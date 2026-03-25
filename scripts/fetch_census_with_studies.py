"""
Fetch Cell x Gene Census metadata with study/dataset info.
Outputs two CSVs:
  1. census_nested_cell_type_counts.csv — organism × organ × assay (for outer cube)
  2. census_study_cell_type_counts.csv  — organism × organ × assay × dataset_title × cell_type (for inner cube drill-down)

Fetches ALL organisms.
"""

import cellxgene_census
import pandas as pd
import json

CENSUS_VERSION = "latest"

ORGANISM_NAMES = {
    "homo_sapiens": "Homo sapiens",
    "mus_musculus": "Mus musculus",
    "callithrix_jacchus": "Callithrix jacchus",
    "macaca_mulatta": "Macaca mulatta",
    "pan_troglodytes": "Pan troglodytes",
}


def main():
    with cellxgene_census.open_soma(census_version=CENSUS_VERSION) as census:
        # Get dataset title lookup
        datasets_meta = census["census_info"]["datasets"].read().concat().to_pandas()
        id_to_title = dict(zip(datasets_meta["dataset_id"], datasets_meta["dataset_title"]))
        print(f"Dataset titles loaded: {len(id_to_title)}")

        experiment_keys = list(census["census_data"].keys())
        print(f"Organisms: {experiment_keys}")

        obs_tables = []
        for exp_key in experiment_keys:
            display_name = ORGANISM_NAMES.get(exp_key, exp_key)
            print(f"Fetching {display_name}...")
            obs = cellxgene_census.get_obs(
                census,
                organism=display_name,
                column_names=["tissue", "assay", "cell_type", "dataset_id"],
            )
            obs["organism"] = display_name
            obs_tables.append(obs)
            print(f"  → {len(obs):,} cells")

    obs = pd.concat(obs_tables, ignore_index=True)
    obs.rename(columns={"tissue": "organ"}, inplace=True)

    # Map dataset_id → title
    obs["dataset_title"] = obs["dataset_id"].map(id_to_title).fillna(obs["dataset_id"])

    for col in ["organism", "organ", "assay", "cell_type", "dataset_title"]:
        obs[col] = obs[col].fillna("NA").astype(str)

    print(f"\nTotal cells: {len(obs):,}")

    # === Table 1: outer cube (organism × organ × assay) ===
    counts1 = (
        obs.groupby(["organism", "organ", "assay", "cell_type"], dropna=False)
        .size()
        .reset_index(name="cell_type_count")
    )
    nested1 = (
        counts1.groupby(["organism", "organ", "assay"], dropna=False)
        .apply(
            lambda df: json.dumps(
                dict(zip(df["cell_type"], df["cell_type_count"])),
                ensure_ascii=False,
            ),
            include_groups=False,
        )
        .reset_index(name="cell_type_counts")
    )
    nested1.to_csv("data/census_nested_cell_type_counts.csv", index=False)
    print(f"\nOuter cube: {len(nested1):,} cells")

    # === Table 2: inner cube drill-down (organism × organ × assay × dataset × cell_type) ===
    counts2 = (
        obs.groupby(
            ["organism", "organ", "assay", "dataset_title", "cell_type"],
            dropna=False,
        )
        .size()
        .reset_index(name="count")
    )
    counts2.to_csv("data/census_study_cell_type_counts.csv", index=False)
    print(f"Inner cube: {len(counts2):,} rows")
    print(f"Unique datasets: {counts2['dataset_title'].nunique()}")

    print(f"\nOrgans: {nested1['organ'].nunique()}")
    print(f"Assays: {nested1['assay'].nunique()}")
    print("Done!")


if __name__ == "__main__":
    main()
