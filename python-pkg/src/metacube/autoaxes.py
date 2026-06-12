"""Automatic axis assignment for metacube.

Manual mode (the default) takes axis columns straight from the config YAML.
Auto mode (``axes.mode: auto``) inspects the CSV and assigns columns to the
cube faces and zoom-drilldown axes by scoring how much *visual variety* each
column contributes — with separate scoring for the outer faces (which read best
with a few clean buckets) and the inner drilldown axes (where fine detail is the
point). This keeps a high-cardinality column like ``tissue`` off the outer faces
and reserved for drilldown, while a coarse column like ``organ`` goes outside.

Nothing here is domain-specific: candidate columns, the coarse→fine hierarchy,
and redundancy are all derived from the data, so the same logic works on any
tabular input a metacube user supplies.

Concepts
--------
* **Weighting** — how each CSV row contributes to a column's value distribution.
  ``cube_cells`` (default) weights every row equally: the cube draws one glyph
  per unique axis combination, so visual variety is the spread of *voxels*, not
  the underlying counts. ``count`` weights by the size column (observation mass);
  ``presence`` is an alias of ``cube_cells``.
* **Metric** — count-weighted Shannon entropy ``H``; the headline figure is the
  effective category count ``D = exp(H)`` (a Hill number of order 1). ``D`` already
  reflects skew (it drops toward 1 when one value dominates), so it is used directly
  for ranking; evenness ``J = H / log(k)`` is still reported for transparency but is
  no longer applied as a penalty (so legitimately dominant categories, e.g.
  human/mouse over-representation, are not demoted).
* **Mode sensitivity** — outer faces score through a band-pass over ``D`` (peaks
  for a moderate bucket count, decays for high cardinality); inner axes score
  through a rising, saturating curve that rewards detail up to a label cap.
* **Hierarchy** — derived from pairwise conditional entropy: if knowing column B
  determines column A but not vice-versa, A is the coarser parent and may sit
  outer of B, never the reverse. No hierarchy is hardcoded.

This module is pure and dependency-light (numpy + pandas). ``select_axes`` is the
scoring entry point; ``apply_auto_axes`` is the config-level integration used by
``transform.py``.
"""

from __future__ import annotations

import logging
import math
from dataclasses import dataclass, field
from typing import Any

import numpy as np
import pandas as pd

log = logging.getLogger(__name__)


# ── Configuration ──────────────────────────────────────────────────────────

@dataclass
class AutoAxisConfig:
    """Tunables for automatic axis selection. Every field is overridable via the
    ``axes.auto`` block of the config YAML so the package adapts to any input."""

    n_outer: int = 3
    n_inner: int = 3

    # Row weighting when building value distributions.
    #   "cube_cells" -> 1 per row (voxel spread; default, dataset-size robust)
    #   "count"      -> size column ** count_alpha (observation mass)
    #   "presence"   -> alias of cube_cells
    weighting: str = "cube_cells"
    count_alpha: float = 1.0

    # Outer band-pass over D = exp(H): trapezoid 0 -> 1 (peak) -> 0.
    outer_band_lo: float = 1.2
    outer_band_peak_lo: float = 2.5
    outer_band_peak_hi: float = 8.0
    outer_band_hi: float = 25.0

    # Inner high-pass: rises with D, saturates at the label cap.
    inner_d_cap: float = 40.0

    # Eligibility filters.
    min_distinct: int = 2        # need >= 2 values to carry information
    min_effective: float = 1.05  # D below this == effectively constant
    near_id_max: float = 0.9     # k / n_rows above this == identifier-like

    # Hierarchy + redundancy (normalized conditional entropy / mutual info).
    hierarchy_cond_entropy_eps: float = 0.05
    redundancy_nmi: float = 0.9

    # Reward inner candidates that are children of a chosen outer axis (nesting).
    child_nesting_bonus: float = 1.25

    # Cap labels per axis (written as max_labels when a column exceeds it).
    outer_max_labels: int = 30
    inner_max_labels: int = 40

    # Column governance.
    exclude_columns: tuple[str, ...] = ()
    semantic_priors: dict[str, float] = field(default_factory=dict)


# ── Result types ─────────────────────────────────────────────────────────────

@dataclass
class Axis:
    column: str
    label: str
    max_labels: int | None = None


@dataclass
class AxisAssignment:
    outer: list[Axis]
    inner: list[Axis]
    scoring: pd.DataFrame   # one row per candidate column, with stats + role


# ── Entropy primitives ─────────────────────────────────────────────────────

def _entropy(weights: np.ndarray) -> float:
    """Shannon entropy (nats) of a vector of non-negative group weights."""
    w = np.asarray(weights, dtype=float)
    w = w[w > 0]
    total = w.sum()
    if total <= 0:
        return 0.0
    p = w / total
    return float(-(p * np.log(p)).sum())


def _value_weights(values: pd.Series, weights: np.ndarray) -> np.ndarray:
    """Total weight per distinct value of ``values``."""
    grouped = pd.Series(weights, index=values.astype("object").to_numpy()).groupby(level=0).sum()
    return grouped.to_numpy(dtype=float)


def _conditional_entropy(a: pd.Series, b: pd.Series, weights: np.ndarray) -> float:
    """H(A | B) in nats, weighted: sum_b p(b) * H(A | B=b)."""
    frame = pd.DataFrame({
        "a": a.astype("object").to_numpy(),
        "b": b.astype("object").to_numpy(),
        "w": np.asarray(weights, dtype=float),
    })
    total = frame["w"].sum()
    if total <= 0:
        return 0.0
    h = 0.0
    for _, grp in frame.groupby("b", sort=False):
        p_b = grp["w"].sum() / total
        a_weights = grp.groupby("a", sort=False)["w"].sum().to_numpy(dtype=float)
        h += p_b * _entropy(a_weights)
    return h


def _joint_key(df: pd.DataFrame) -> pd.Series:
    """Collapse several columns into a single composite-key Series."""
    return df.astype(str).agg("\x1f".join, axis=1)


# ── Per-column statistics ────────────────────────────────────────────────────

@dataclass
class _ColumnStats:
    column: str
    k: int
    H: float
    D: float
    J: float
    near_id: float


def _column_stats(column: str, values: pd.Series, weights: np.ndarray, n_rows: int) -> _ColumnStats:
    totals = _value_weights(values, weights)
    k = int(len(totals))
    H = _entropy(totals)
    D = math.exp(H)
    J = H / math.log(k) if k > 1 else 0.0
    near_id = k / n_rows if n_rows else 0.0
    return _ColumnStats(column, k, H, D, J, near_id)


# ── Scoring curves ─────────────────────────────────────────────────────────

def _f_outer(D: float, cfg: AutoAxisConfig) -> float:
    """Band-pass: trapezoid that peaks for a moderate number of buckets."""
    lo, pl, ph, hi = (cfg.outer_band_lo, cfg.outer_band_peak_lo,
                      cfg.outer_band_peak_hi, cfg.outer_band_hi)
    if D <= lo or D >= hi:
        return 0.0
    if D < pl:
        return (D - lo) / (pl - lo)
    if D <= ph:
        return 1.0
    return (hi - D) / (hi - ph)


def _f_inner(D: float, cfg: AutoAxisConfig) -> float:
    """High-pass: rises with detail, saturates at the label cap."""
    return min(D, cfg.inner_d_cap) / cfg.inner_d_cap


def _prior_factor(column: str, cfg: AutoAxisConfig) -> float:
    return 1.0 + float(cfg.semantic_priors.get(column, 0.0))


def _score_outer(col: str, stats: dict[str, _ColumnStats], cfg: AutoAxisConfig) -> float:
    s = stats[col]
    # Ranked purely by effective category count (D, via the band-pass): D already
    # reflects skew (it drops when one value dominates), so we do NOT additionally
    # apply an evenness penalty — domains where a few categories legitimately
    # dominate (e.g. human/mouse over-representation) should not be demoted for it.
    return _f_outer(s.D, cfg) * _prior_factor(col, cfg)


# ── Relations: hierarchy + redundancy ──────────────────────────────────────

def _relations(
    cols: list[str],
    df: pd.DataFrame,
    weights: np.ndarray,
    stats: dict[str, _ColumnStats],
    cfg: AutoAxisConfig,
) -> tuple[dict[str, set[str]], set[frozenset[str]]]:
    """Return (parents_of, redundant_pairs).

    ``parents_of[child]`` is the set of coarser columns the child determines
    (knowing the child fixes the parent, but not vice-versa). A pair is redundant
    when each determines the other (same partition).
    """
    eps = cfg.hierarchy_cond_entropy_eps
    norm_ce: dict[tuple[str, str], float] = {}
    for a in cols:
        la = math.log(stats[a].k) if stats[a].k > 1 else 0.0
        for b in cols:
            if a == b:
                continue
            ce = _conditional_entropy(df[a], df[b], weights)
            norm_ce[(a, b)] = ce / la if la > 0 else 0.0

    parents_of: dict[str, set[str]] = {c: set() for c in cols}
    redundant: set[frozenset[str]] = set()
    for a in cols:
        for b in cols:
            if a == b:
                continue
            a_given_b = norm_ce[(a, b)]   # how determined A is by B
            b_given_a = norm_ce[(b, a)]
            if a_given_b <= eps and b_given_a <= eps:
                redundant.add(frozenset((a, b)))
            elif a_given_b <= eps and b_given_a > eps:
                # B determines A but not the reverse -> A is the coarser parent of B.
                parents_of[b].add(a)
    return parents_of, redundant


# ── Labels / axis construction ─────────────────────────────────────────────

def _humanize(column: str) -> str:
    return column.replace("_", " ").strip().title()


def _make_axis(col: str, stats: dict[str, _ColumnStats], cfg: AutoAxisConfig, *, inner: bool) -> Axis:
    cap = cfg.inner_max_labels if inner else cfg.outer_max_labels
    k = stats[col].k
    return Axis(
        column=col,
        label=_humanize(col),
        max_labels=cap if (cap and k > cap) else None,
    )


# ── Selection ────────────────────────────────────────────────────────────────

def _fill(chosen: list[str], pool: list[str], n: int) -> list[str]:
    """Pad ``chosen`` up to n with the next-best unused columns from ``pool``."""
    for c in pool:
        if len(chosen) >= n:
            break
        if c not in chosen:
            chosen.append(c)
    return chosen[:n]


def _select_outer(
    eligible: list[str],
    all_dims: list[str],
    stats: dict[str, _ColumnStats],
    parents_of: dict[str, set[str]],
    redundant: set[frozenset[str]],
    cfg: AutoAxisConfig,
    pinned: list[str],
) -> list[str]:
    eligible_set = set(eligible)
    # Reserve columns that have an eligible parent for the inner axes (coarse-out rule).
    pool = [c for c in eligible if c not in pinned and not (parents_of[c] & eligible_set)]
    ranked = sorted(pool, key=lambda c: _score_outer(c, stats, cfg), reverse=True)

    chosen: list[str] = []
    for c in ranked:
        if len(chosen) >= cfg.n_outer - len(pinned):
            break
        if _score_outer(c, stats, cfg) <= 0:
            continue
        if any(frozenset((c, x)) in redundant for x in chosen + pinned):
            continue
        chosen.append(c)

    # The cube needs exactly n_outer faces: pad from remaining eligible, then any dims.
    fallback = (
        [c for c in ranked if c not in chosen]
        + [c for c in eligible if c not in chosen and c not in pinned]
        + [c for c in all_dims if c not in chosen and c not in pinned]
    )
    return _fill(chosen, fallback, cfg.n_outer - len(pinned))


def _select_inner(
    candidates: list[str],
    df: pd.DataFrame,
    weights: np.ndarray,
    stats: dict[str, _ColumnStats],
    outer_cols: list[str],
    parents_of: dict[str, set[str]],
    redundant: set[frozenset[str]],
    cfg: AutoAxisConfig,
    pinned: list[str],
    n_inner: int,
) -> tuple[list[str], dict[str, float]]:
    outer_key = _joint_key(df[outer_cols]) if outer_cols else None

    scored: list[tuple[str, float]] = []
    inner_scores: dict[str, float] = {}
    for c in candidates:
        # Residual variety the outer cube does not already show.
        H_cond = _conditional_entropy(df[c], outer_key, weights) if outer_key is not None else stats[c].H
        D_cond = math.exp(H_cond)
        bonus = cfg.child_nesting_bonus if (parents_of[c] & set(outer_cols)) else 1.0
        score = _f_inner(D_cond, cfg) * bonus * _prior_factor(c, cfg)
        scored.append((c, score))
        inner_scores[c] = score

    scored.sort(key=lambda t: t[1], reverse=True)
    chosen: list[str] = []
    for c, score in scored:
        if len(chosen) >= n_inner - len(pinned):
            break
        if score <= 0:
            continue
        if any(frozenset((c, x)) in redundant for x in chosen + pinned):
            continue
        chosen.append(c)

    fallback = [c for c, _ in scored if c not in chosen]
    return _fill(chosen, fallback, n_inner - len(pinned)), inner_scores


# ── Public scoring entry point ───────────────────────────────────────────────

def select_axes(
    df: pd.DataFrame,
    *,
    count_col: str | None = None,
    config: AutoAxisConfig | None = None,
    pinned_outer: dict[str, str] | None = None,
    pinned_inner: dict[str, str] | None = None,
) -> AxisAssignment:
    """Choose outer + inner cube axes for ``df`` by data-driven variety scoring.

    Parameters
    ----------
    df : the input table (one row per unique dimension combination, ideally).
    count_col : size/count column; used for ``count`` weighting and excluded
        from candidacy. Optional.
    config : :class:`AutoAxisConfig`; defaults are sensible for most tables.
    pinned_outer / pinned_inner : axis slot -> column overrides ("x"/"y"/"z").
        Pinned columns are placed verbatim and removed from the candidate pool.
    """
    cfg = config or AutoAxisConfig()
    pinned_outer = pinned_outer or {}
    pinned_inner = pinned_inner or {}
    n_rows = len(df)
    if n_rows == 0:
        raise ValueError("select_axes received an empty DataFrame")

    if cfg.weighting == "count" and count_col and count_col in df.columns:
        weights = pd.to_numeric(df[count_col], errors="coerce").fillna(0.0).clip(lower=0.0).to_numpy(float)
        if cfg.count_alpha != 1.0:
            weights = np.power(weights, cfg.count_alpha)
    else:
        weights = np.ones(n_rows, dtype=float)

    excluded = set(cfg.exclude_columns)
    if count_col:
        excluded.add(count_col)
    pinned_cols = set(pinned_outer.values()) | set(pinned_inner.values())
    dims = [c for c in df.columns if c not in excluded]
    candidate_dims = [c for c in dims if c not in pinned_cols]
    if not dims:
        raise ValueError("No candidate dimension columns after applying excludes")

    stats = {c: _column_stats(c, df[c], weights, n_rows) for c in dims}

    eligible = [
        c for c in candidate_dims
        if stats[c].k >= cfg.min_distinct
        and stats[c].D >= cfg.min_effective
        and stats[c].near_id <= cfg.near_id_max
    ]

    parents_of, redundant = _relations(eligible, df, weights, stats, cfg)

    pinned_outer_cols = [pinned_outer[k] for k in ("x", "y", "z") if k in pinned_outer]
    auto_outer = _select_outer(eligible, candidate_dims, stats, parents_of, redundant, cfg, pinned_outer_cols)
    outer_cols = pinned_outer_cols + auto_outer

    pinned_inner_cols = [pinned_inner[k] for k in ("x", "y", "z") if k in pinned_inner]
    inner_candidates = [c for c in eligible if c not in outer_cols and c not in pinned_inner_cols]
    auto_inner, inner_scores = _select_inner(
        inner_candidates, df, weights, stats, outer_cols, parents_of, redundant,
        cfg, pinned_inner_cols, cfg.n_inner,
    )
    inner_cols = pinned_inner_cols + auto_inner

    # Build Axis objects; ensure stats exist for any padded/pinned column.
    for c in outer_cols + inner_cols:
        stats.setdefault(c, _column_stats(c, df[c], weights, n_rows))
    outer = [_make_axis(c, stats, cfg, inner=False) for c in outer_cols]
    inner = [_make_axis(c, stats, cfg, inner=True) for c in inner_cols]

    scoring = _scoring_table(dims, stats, eligible, outer_cols, inner_cols, inner_scores, parents_of, cfg)
    log.info("Auto axes — outer: %s | inner: %s",
             " / ".join(a.column for a in outer) or "(none)",
             " / ".join(a.column for a in inner) or "(none)")
    return AxisAssignment(outer=outer, inner=inner, scoring=scoring)


def _scoring_table(dims, stats, eligible, outer_cols, inner_cols, inner_scores, parents_of, cfg) -> pd.DataFrame:
    outer_set, inner_set, eligible_set = set(outer_cols), set(inner_cols), set(eligible)
    rows = []
    for c in dims:
        s = stats[c]
        if c in outer_set:
            role = "outer"
        elif c in inner_set:
            role = "inner"
        elif c not in eligible_set:
            role = "dropped"
        else:
            role = "unused"
        rows.append({
            "column": c,
            "k": s.k,
            "D": round(s.D, 3),
            "J": round(s.J, 3),
            "near_id": round(s.near_id, 3),
            "score_outer": round(_score_outer(c, stats, cfg), 4),
            "score_inner": round(inner_scores.get(c, float("nan")), 4),
            "parents": ",".join(sorted(parents_of.get(c, set()))) or "",
            "role": role,
        })
    return (
        pd.DataFrame(rows)
        .sort_values(["role", "score_outer"], ascending=[True, False])
        .reset_index(drop=True)
    )


# ── Config-level integration ─────────────────────────────────────────────────

# Config keys whose *values* name columns already used elsewhere — auto-selection
# excludes these so it never re-uses a column that has a dedicated role.
def _implicit_excludes(cfg: dict[str, Any]) -> set[str]:
    out: set[str] = set()
    for key in ("size_colour", "size_column", "color_column", "datasets_column", "priority_column"):
        v = cfg.get(key)
        if isinstance(v, str):
            out.add(v)
    drill = cfg.get("drilldown") or {}
    for key in ("category_column", "subcategory_column", "count_column", "size_colour"):
        v = drill.get(key)
        if isinstance(v, str):
            out.add(v)
    tm = (drill.get("treemap") or {})
    for key in ("category_column", "subcategory_column", "count_column"):
        v = tm.get(key)
        if isinstance(v, str):
            out.add(v)
    slc = cfg.get("slice") or {}
    if isinstance(slc.get("count_column"), str):
        out.add(slc["count_column"])
    for block in ("info", "info_box"):
        cols = (cfg.get(block) or {}).get("columns") or {}
        out.update(v for v in cols.values() if isinstance(v, str))
    return out


def _config_from_block(block: dict[str, Any]) -> AutoAxisConfig:
    valid = AutoAxisConfig.__dataclass_fields__.keys()
    kwargs = {k: v for k, v in block.items() if k in valid}
    if "exclude_columns" in kwargs and kwargs["exclude_columns"] is not None:
        kwargs["exclude_columns"] = tuple(kwargs["exclude_columns"])
    unknown = set(block) - set(valid)
    if unknown:
        log.warning("axes.auto: ignoring unknown key(s): %s", ", ".join(sorted(unknown)))
    return AutoAxisConfig(**kwargs)


def _axis_to_cfg(axis: Axis) -> dict[str, Any]:
    spec: dict[str, Any] = {"label": axis.label, "column": axis.column}
    if axis.max_labels is not None:
        spec["max_labels"] = axis.max_labels
    return spec


def is_auto(cfg: dict[str, Any]) -> bool:
    return str((cfg.get("axes") or {}).get("mode", "manual")).strip().lower() == "auto"


def apply_auto_axes(df: pd.DataFrame, cfg: dict[str, Any]) -> dict[str, Any]:
    """Return a config with axis columns filled in by data-driven selection.

    Activates only when ``axes.mode == "auto"``. Pinned faces (an ``x``/``y``/``z``
    entry that already names a ``column``) are kept verbatim; the rest are filled.
    When ``drilldown.type == "zoom"``, the inner drilldown axes are filled too.
    Manual configs are returned unchanged.
    """
    if not is_auto(cfg):
        return cfg

    axes_cfg = dict(cfg.get("axes") or {})
    block = dict(axes_cfg.get("auto") or {})

    # General axes.max_labels caps every auto axis (outer + inner). The granular
    # auto.outer_max_labels / auto.inner_max_labels still win when set explicitly.
    general_max = axes_cfg.get("max_labels")
    if general_max is None:
        general_max = block.get("max_labels")
    block.pop("max_labels", None)  # not an AutoAxisConfig field
    if general_max is not None:
        block.setdefault("outer_max_labels", general_max)
        block.setdefault("inner_max_labels", general_max)

    # User exclude_columns + columns already given roles elsewhere in the config.
    user_excludes = set(block.get("exclude_columns") or ())
    block["exclude_columns"] = tuple(user_excludes | _implicit_excludes(cfg))
    auto_cfg = _config_from_block(block)

    count_col = cfg.get("size_colour") or cfg.get("size_column")

    # Honour pinned outer faces (slot already names a column present in the CSV).
    pinned_outer = {
        ax: axes_cfg[ax]["column"]
        for ax in ("x", "y", "z")
        if isinstance(axes_cfg.get(ax), dict)
        and axes_cfg[ax].get("column") in df.columns
    }

    drill = dict(cfg.get("drilldown") or {})
    zoom_auto = drill.get("type") == "zoom"
    pinned_inner: dict[str, str] = {}
    if zoom_auto:
        drill_axes = drill.get("axes") or {}
        pinned_inner = {
            ax: drill_axes[ax]["column"]
            for ax in ("x", "y", "z")
            if isinstance(drill_axes.get(ax), dict)
            and drill_axes[ax].get("column") in df.columns
        }
        auto_cfg.n_inner = 3
    else:
        auto_cfg.n_inner = 0

    assignment = select_axes(
        df, count_col=count_col, config=auto_cfg,
        pinned_outer=pinned_outer, pinned_inner=pinned_inner,
    )

    log.info("Auto axis scoring table:\n%s", assignment.scoring.to_string(index=False))

    # Write resolved outer faces (preserve any pinned label/colors the user set).
    new_axes: dict[str, Any] = {k: v for k, v in axes_cfg.items() if k in ("x", "y", "z")}
    for ax, axis in zip(("x", "y", "z"), assignment.outer):
        existing = dict(new_axes.get(ax) or {})
        existing.update(_axis_to_cfg(axis))
        # A user-set label on a pinned face wins over the humanized default.
        if isinstance(axes_cfg.get(ax), dict) and axes_cfg[ax].get("label"):
            existing["label"] = axes_cfg[ax]["label"]
        new_axes[ax] = existing
    new_axes.pop("mode", None)
    new_axes.pop("auto", None)

    out_cfg = dict(cfg)
    out_cfg["axes"] = new_axes

    if zoom_auto and assignment.inner:
        drill_axes = dict(drill.get("axes") or {})
        for ax, axis in zip(("x", "y", "z"), assignment.inner):
            existing = dict(drill_axes.get(ax) or {})
            existing.update(_axis_to_cfg(axis))
            if isinstance((drill.get("axes") or {}).get(ax), dict) and drill["axes"][ax].get("label"):
                existing["label"] = drill["axes"][ax]["label"]
            drill_axes[ax] = existing
        drill["axes"] = drill_axes
        out_cfg["drilldown"] = drill

    return out_cfg
