"""
Fetch Cell x Gene Census metadata and aggregate by organism × organ × assay.
Outputs census_nested_cell_type_counts.csv with cell-type breakdowns per cube cell.

Fetches ALL organisms available in the census.
Requires: pip install cellxgene-census
"""

import cellxgene_census
import pandas as pd
import json

CENSUS_VERSION = "latest"

# Census experiment keys → display names
ORGANISM_NAMES = {
    "homo_sapiens": "Homo sapiens",
    "mus_musculus": "Mus musculus",
    "callithrix_jacchus": "Callithrix jacchus",
    "macaca_mulatta": "Macaca mulatta",
    "pan_troglodytes": "Pan troglodytes",
}


def main():
    with cellxgene_census.open_soma(census_version=CENSUS_VERSION) as census:
        # Discover all organisms
        experiment_keys = list(census["census_data"].keys())
        print(f"Found organisms: {experiment_keys}")

        obs_tables = []
        for exp_key in experiment_keys:
            display_name = ORGANISM_NAMES.get(exp_key, exp_key)
            print(f"Fetching {display_name} ({exp_key})...")
            obs = cellxgene_census.get_obs(
                census,
                organism=display_name,
                column_names=["tissue", "assay", "cell_type"],
            )
            obs["organism"] = display_name
            obs_tables.append(obs)
            print(f"  → {len(obs):,} cells")

    obs = pd.concat(obs_tables, ignore_index=True)
    obs.rename(columns={"tissue": "organ"}, inplace=True)

    for col in ["organism", "organ", "assay", "cell_type"]:
        obs[col] = obs[col].fillna("NA").astype(str)

    print(f"\nTotal cells: {len(obs):,}")

    counts = (
        obs.groupby(["organism", "organ", "assay", "cell_type"], dropna=False)
        .size()
        .reset_index(name="cell_type_count")
    )

    nested = (
        counts.groupby(["organism", "organ", "assay"], dropna=False)
        .apply(
            lambda df: json.dumps(
                dict(zip(df["cell_type"], df["cell_type_count"])),
                ensure_ascii=False,
            )
        )
        .reset_index(name="cell_type_counts")
    )

    nested.to_csv("data/census_nested_cell_type_counts.csv", index=False)

    print(f"\nRows written: {len(nested):,}")
    print(f"Organisms: {sorted(nested['organism'].unique())}")
    print(f"Organs: {nested['organ'].nunique()}")
    print(f"Assays: {nested['assay'].nunique()}")
    print("Saved: data/census_nested_cell_type_counts.csv")


if __name__ == "__main__":
    main()
