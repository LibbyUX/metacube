"""Tests for data-driven axis auto-selection (no external data needed)."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from metacube.autoaxes import AutoAxisConfig, apply_auto_axes, select_axes  # noqa: E402


def _frame() -> pd.DataFrame:
    """Coarse->fine hierarchy with enough columns to exercise outer/inner split.

    organ (2) > tissue (6, nested in organ) is the hierarchy under test.
    molecule (3) and platform (3) are independent coarse columns — together with
    organ they fill the three outer faces, leaving tissue for the inner axis.
    organism is constant (dropped); row_id is unique (identifier-like)."""
    rng = np.random.default_rng(0)
    organ_to_tissue = {
        "brain": ["frontal lobe", "cortex", "midbrain", "striatum"],
        "blood": ["whole blood", "plasma"],
    }
    rows = []
    for organ, tissues in organ_to_tissue.items():
        for tissue in tissues:
            for molecule in ["RNA", "miRNA", "sncRNA"]:
                for platform in ["illumina", "ont", "pacbio"]:
                    rows.append({
                        "molecule": molecule,
                        "platform": platform,           # independent coarse column
                        "organism": "Homo sapiens",     # constant -> dropped
                        "organ": organ,                 # coarse parent
                        "tissue": tissue,               # fine child of organ
                        "row_id": f"r{len(rows)}",      # identifier-like
                        "count": int(rng.integers(10, 1000)),
                    })
    return pd.DataFrame(rows)


def test_coarse_out_fine_in() -> None:
    df = _frame()
    res = select_axes(df, count_col="count",
                      config=AutoAxisConfig(exclude_columns=("row_id",)))
    outer = {a.column for a in res.outer}
    inner = {a.column for a in res.inner}

    assert "organism" not in outer | inner            # constant carries no info
    assert "tissue" not in outer, "fine child must not sit on an outer face"
    assert "tissue" in inner, "fine child belongs in drilldown"
    assert "organ" in outer, "coarse parent belongs on an outer face"

    parents = res.scoring.set_index("column").loc["tissue", "parents"]
    assert "organ" in parents


def test_identifier_dropped() -> None:
    df = _frame()
    res = select_axes(df, count_col="count", config=AutoAxisConfig())
    assigned = {a.column for a in res.outer + res.inner}
    assert "row_id" not in assigned


def test_apply_auto_axes_fills_config_and_excludes_roles() -> None:
    df = _frame()
    cfg = {
        "title": "t",
        "axes": {"mode": "auto", "auto": {"exclude_columns": ["row_id"]}},
        "size_colour": "count",
        # cell-level columns referenced elsewhere must be auto-excluded as axes:
        "drilldown": {"type": "treemap", "category_column": "molecule",
                      "subcategory_column": "tissue", "count_column": "count"},
    }
    out = apply_auto_axes(df, cfg)
    cols = {out["axes"][ax]["column"] for ax in ("x", "y", "z")}
    assert "count" not in cols and "row_id" not in cols
    # molecule + tissue are claimed by the treemap, so excluded from faces.
    assert "molecule" not in cols and "tissue" not in cols
    # 'mode'/'auto' scaffolding is removed from the resolved config.
    assert "mode" not in out["axes"] and "auto" not in out["axes"]


def test_pinned_face_is_respected() -> None:
    df = _frame()
    cfg = {
        "axes": {"mode": "auto", "x": {"column": "molecule", "label": "Mol"}},
        "size_colour": "count",
    }
    out = apply_auto_axes(df, cfg)
    assert out["axes"]["x"]["column"] == "molecule"
    assert out["axes"]["x"]["label"] == "Mol"          # user label preserved
    others = {out["axes"]["y"]["column"], out["axes"]["z"]["column"]}
    assert "molecule" not in others                     # not assigned twice


def test_manual_config_unchanged() -> None:
    df = _frame()
    cfg = {"axes": {"x": {"column": "organ"}, "y": {"column": "tissue"},
                    "z": {"column": "molecule"}}, "size_colour": "count"}
    assert apply_auto_axes(df, cfg) is cfg


if __name__ == "__main__":
    test_coarse_out_fine_in()
    test_identifier_dropped()
    test_apply_auto_axes_fills_config_and_excludes_roles()
    test_pinned_face_is_respected()
    test_manual_config_unchanged()
    print("All autoaxes tests passed.")
