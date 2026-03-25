"""
Build microbiome cube data from two papers:
  Paper 1: Human multi-site microbiome (4380 genome bins, 8 body sites, 1030 species)
  Paper 2: Zoo animals (786 genome bins, 41 host species, saliva/stool)

Cube axes (clustered so similar categories are adjacent):
  X = Host (Human + zoo animal species)
  Y = Sampling region (body site / specimen)
  Z = Microbial genus (top genera)

Outputs:
  public/microbiome_cube.json — outer cube records
  public/microbiome_drilldown.json — species-level drilldown per cube cell
"""

import pandas as pd
import numpy as np
import json
from scipy.cluster.hierarchy import linkage, leaves_list
from scipy.spatial.distance import pdist

TOP_GENERA = 10
TOP_HOSTS = 12


def cluster_axis(combined: pd.DataFrame, axis_col: str, value_col: str, axis_values: list[str]) -> list[str]:
    """Reorder axis_values by hierarchical clustering on their co-occurrence profiles."""
    if len(axis_values) <= 2:
        return axis_values

    # Build other columns for the profile
    other_cols = [c for c in ["host", "specimen", "genus_display"] if c != axis_col]

    # Create a feature key from other dimensions
    combined = combined.copy()
    combined["_key"] = combined[other_cols[0]].astype(str) + "|" + combined[other_cols[1]].astype(str)

    # Pivot: axis_values × feature_keys → counts
    all_keys = sorted(combined["_key"].unique())
    key_idx = {k: i for i, k in enumerate(all_keys)}

    mat = np.zeros((len(axis_values), len(all_keys)), dtype=float)
    for _, row in combined.groupby([axis_col, "_key"])[value_col].sum().reset_index().iterrows():
        ax_val = row[axis_col]
        if ax_val not in axis_values:
            continue
        ai = axis_values.index(ax_val)
        ki = key_idx.get(row["_key"])
        if ki is not None:
            mat[ai, ki] = row[value_col]

    # Normalize rows to unit vectors (cosine-like)
    norms = np.linalg.norm(mat, axis=1, keepdims=True)
    norms[norms == 0] = 1
    mat = mat / norms

    # Cluster
    if mat.shape[0] < 3:
        return axis_values

    dist = pdist(mat, metric="cosine")
    dist = np.nan_to_num(dist, nan=1.0)
    Z = linkage(dist, method="average")
    order = leaves_list(Z)

    return [axis_values[i] for i in order]


def main():
    # === Paper 1: Human ===
    df1 = pd.read_excel("data/microbiome/paper1_supp7.xlsx")
    df1["genus"] = df1["species"].str.extract(r"s__(\w+)")[0].fillna("Unknown")
    df1["host"] = "Human"
    df1["specimen"] = df1["Specimen"]
    df1["sp"] = df1["species"].str.replace("s__", "", regex=False)
    df1["bin_count"] = 1

    # === Paper 2: Zoo ===
    meta = pd.read_excel("data/microbiome/paper2_supp1.xlsx")
    df2 = pd.read_excel("data/microbiome/paper2_supp2.xlsx")
    df2["sample"] = df2["Bin"].str.extract(r"^(S\d+[AM]_(?:St|Sa))")[0]
    df2 = df2.merge(meta[["ID", "Latin", "Specimen"]], left_on="sample", right_on="ID", how="left")
    df2["genus"] = df2["NCBI Classification"].str.extract(r"^(\w+)")[0].fillna("Unknown")
    df2["host"] = df2["Latin"].fillna("Unknown")
    df2["specimen"] = df2["Specimen"].fillna("Unknown")
    df2["sp"] = df2["NCBI Classification"].fillna("Unknown")
    df2["bin_count"] = 1

    # Combine
    combined = pd.concat([
        df1[["host", "specimen", "genus", "sp", "bin_count"]],
        df2[["host", "specimen", "genus", "sp", "bin_count"]],
    ], ignore_index=True)

    print(f"Combined: {len(combined)} genome bins")

    # Top genera by total bin count
    genus_counts = combined.groupby("genus")["bin_count"].sum().sort_values(ascending=False)
    top_genera = list(genus_counts.head(TOP_GENERA).index)
    combined["genus_display"] = combined["genus"].where(combined["genus"].isin(top_genera), "Other")

    # Top hosts (Human always first, then by bin count)
    host_counts = combined.groupby("host")["bin_count"].sum().sort_values(ascending=False)
    top_hosts_unsorted = ["Human"] + [h for h in host_counts.index if h != "Human"][:TOP_HOSTS - 1]
    combined = combined[combined["host"].isin(top_hosts_unsorted)]

    all_specimens_unsorted = sorted(combined["specimen"].unique())
    all_genera_unsorted = top_genera + ["Other"]

    # === Cluster axes ===
    print("Clustering axes...")
    top_hosts = cluster_axis(combined, "host", "bin_count", top_hosts_unsorted)
    all_specimens = cluster_axis(combined, "specimen", "bin_count", all_specimens_unsorted)
    all_genera = cluster_axis(combined, "genus_display", "bin_count", all_genera_unsorted)

    print(f"  Hosts: {top_hosts}")
    print(f"  Specimens: {all_specimens}")
    print(f"  Genera: {all_genera}")

    # === Outer cube: host × specimen × genus ===
    outer = (
        combined.groupby(["host", "specimen", "genus_display"])
        .agg(total_bins=("bin_count", "sum"))
        .reset_index()
    )

    records = []
    for _, row in outer.iterrows():
        records.append({
            "organism": row["host"],
            "modality": row["specimen"],
            "organ": row["genus_display"],
            "datasetSize": int(row["total_bins"]),
            "datasets": [],
            "priority": 1 if row["host"] == "Human" else 3,
        })

    # Fill in top species as "datasets" for each cube cell
    species_agg = (
        combined.groupby(["host", "specimen", "genus_display", "sp"])
        .agg(n=("bin_count", "sum"))
        .reset_index()
        .sort_values("n", ascending=False)
    )
    for rec in records:
        key_mask = (
            (species_agg["host"] == rec["organism"])
            & (species_agg["specimen"] == rec["modality"])
            & (species_agg["genus_display"] == rec["organ"])
        )
        top_sp = species_agg[key_mask].head(5)
        rec["datasets"] = [f"{row['sp']} ({row['n']})" for _, row in top_sp.iterrows()]

    cube_data = {
        "records": records,
        "organisms": top_hosts,
        "modalities": all_specimens,
        "organs": all_genera,
    }

    with open("public/microbiome_cube.json", "w") as f:
        json.dump(cube_data, f, indent=2)
    print(f"\nOuter cube: {len(records)} cells")
    print(f"Axes: {len(top_hosts)} hosts × {len(all_specimens)} specimens × {len(all_genera)} genera")

    # === Drilldown: species-level per cube cell ===
    drilldown = {}
    for _, row in species_agg.iterrows():
        key = f"{row['host']}|{row['genus_display']}|{row['specimen']}"
        if key not in drilldown:
            drilldown[key] = []
        drilldown[key].append({
            "d": row["sp"],
            "c": row["genus_display"],
            "n": int(row["n"]),
        })

    with open("public/microbiome_drilldown.json", "w") as f:
        json.dump(drilldown, f, separators=(",", ":"))

    print(f"Drilldown: {len(drilldown)} keys")
    print("Done!")


if __name__ == "__main__":
    main()
