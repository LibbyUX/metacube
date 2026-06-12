/**
 * TypeScript port of python-pkg/src/metacube/autoaxes.py (and r-pkg/R/autoaxes.R).
 *
 * Automatic axis assignment for the in-browser playground transform. When the
 * config sets `axes.mode: auto`, this inspects the parsed rows and fills in the
 * x/y/z axis columns (and zoom-drilldown inner axes) by scoring how much visual
 * variety each column contributes — coarse, balanced columns go on the outer
 * faces; fine / nested columns are reserved for the drilldown. The coarse->fine
 * hierarchy is derived from the data via conditional entropy, so nothing is
 * domain-specific.
 *
 * Metric: count-weighted Shannon entropy H; effective categories D = exp(H)
 * (Hill number, order 1). D already reflects skew, so it is used directly; evenness
 * J = H / log(k) is reported but no longer penalises dominant categories.
 */

type Row = Record<string, string>;

const SEP = "\u001f"; // unit separator for composite keys (unlikely in data/names)

export interface AutoAxisConfig {
  n_outer: number;
  n_inner: number;
  weighting: "cube_cells" | "count" | "presence";
  count_alpha: number;
  outer_band_lo: number;
  outer_band_peak_lo: number;
  outer_band_peak_hi: number;
  outer_band_hi: number;
  inner_d_cap: number;
  min_distinct: number;
  min_effective: number;
  near_id_max: number;
  hierarchy_cond_entropy_eps: number;
  redundancy_nmi: number;
  child_nesting_bonus: number;
  outer_max_labels: number;
  inner_max_labels: number;
  exclude_columns: string[];
  semantic_priors: Record<string, number>;
}

function defaults(): AutoAxisConfig {
  return {
    n_outer: 3, n_inner: 3,
    weighting: "cube_cells", count_alpha: 1.0,
    outer_band_lo: 1.2, outer_band_peak_lo: 2.5,
    outer_band_peak_hi: 8.0, outer_band_hi: 25.0,
    inner_d_cap: 40.0,
    min_distinct: 2, min_effective: 1.05, near_id_max: 0.9,
    hierarchy_cond_entropy_eps: 0.05, redundancy_nmi: 0.9,
    child_nesting_bonus: 1.25,
    outer_max_labels: 30, inner_max_labels: 40,
    exclude_columns: [], semantic_priors: {},
  };
}

interface ColStats { k: number; H: number; D: number; J: number; nearId: number; }
interface ResolvedAxis { column: string; label: string; max_labels?: number; }

// ── Entropy primitives ──────────────────────────────────────────────────────

function entropy(weights: number[]): number {
  let total = 0;
  for (const w of weights) if (w > 0) total += w;
  if (total <= 0) return 0;
  let h = 0;
  for (const w of weights) {
    if (w <= 0) continue;
    const p = w / total;
    h -= p * Math.log(p);
  }
  return h;
}

function valueWeights(values: string[], weights: number[]): number[] {
  const totals = new Map<string, number>();
  for (let i = 0; i < values.length; i++) {
    totals.set(values[i], (totals.get(values[i]) ?? 0) + weights[i]);
  }
  return [...totals.values()];
}


/** H(A | B) = sum_b p(b) * H(A | B=b), weighted. */
function conditionalEntropy(a: string[], b: string[], weights: number[]): number {
  let total = 0;
  for (const w of weights) total += w;
  if (total <= 0) return 0;
  // Group weights of A within each value of B.
  const byB = new Map<string, Map<string, number>>();
  const bTotals = new Map<string, number>();
  for (let i = 0; i < a.length; i++) {
    const bv = b[i];
    let inner = byB.get(bv);
    if (!inner) { inner = new Map(); byB.set(bv, inner); }
    inner.set(a[i], (inner.get(a[i]) ?? 0) + weights[i]);
    bTotals.set(bv, (bTotals.get(bv) ?? 0) + weights[i]);
  }
  let h = 0;
  for (const [bv, inner] of byB) {
    const pB = (bTotals.get(bv) ?? 0) / total;
    h += pB * entropy([...inner.values()]);
  }
  return h;
}

function columnStats(values: string[], weights: number[], nRows: number): ColStats {
  const totals = valueWeights(values, weights);
  const k = totals.length;
  const H = entropy(totals);
  return {
    k, H, D: Math.exp(H),
    J: k > 1 ? H / Math.log(k) : 0,
    nearId: nRows > 0 ? k / nRows : 0,
  };
}

// ── Scoring curves ──────────────────────────────────────────────────────────

function fOuter(D: number, cfg: AutoAxisConfig): number {
  const { outer_band_lo: lo, outer_band_peak_lo: pl, outer_band_peak_hi: ph, outer_band_hi: hi } = cfg;
  if (D <= lo || D >= hi) return 0;
  if (D < pl) return (D - lo) / (pl - lo);
  if (D <= ph) return 1;
  return (hi - D) / (hi - ph);
}

function fInner(D: number, cfg: AutoAxisConfig): number {
  return Math.min(D, cfg.inner_d_cap) / cfg.inner_d_cap;
}

function priorFactor(col: string, cfg: AutoAxisConfig): number {
  return 1.0 + (cfg.semantic_priors[col] ?? 0);
}

function scoreOuter(col: string, stats: Record<string, ColStats>, cfg: AutoAxisConfig): number {
  const s = stats[col];
  // Ranked by effective category count (D) only — D already reflects skew, so no
  // additional evenness penalty (don't demote legitimately dominant categories,
  // e.g. human/mouse over-representation).
  return fOuter(s.D, cfg) * priorFactor(col, cfg);
}

// ── Relations: hierarchy + redundancy ───────────────────────────────────────

function pairKey(a: string, b: string): string {
  return a < b ? `${a}${SEP}${b}` : `${b}${SEP}${a}`;
}

interface Relations { parentsOf: Record<string, Set<string>>; redundant: Set<string>; }

function relations(
  cols: string[], colData: Record<string, string[]>, weights: number[],
  stats: Record<string, ColStats>, cfg: AutoAxisConfig,
): Relations {
  const eps = cfg.hierarchy_cond_entropy_eps;
  const normCe = new Map<string, number>();
  for (const a of cols) {
    const la = stats[a].k > 1 ? Math.log(stats[a].k) : 0;
    for (const b of cols) {
      if (a === b) continue;
      const ce = conditionalEntropy(colData[a], colData[b], weights);
      normCe.set(`${a}${SEP}${b}`, la > 0 ? ce / la : 0);
    }
  }
  const parentsOf: Record<string, Set<string>> = {};
  for (const c of cols) parentsOf[c] = new Set();
  const redundant = new Set<string>();
  for (const a of cols) {
    for (const b of cols) {
      if (a === b) continue;
      const aGivenB = normCe.get(`${a}${SEP}${b}`)!;
      const bGivenA = normCe.get(`${b}${SEP}${a}`)!;
      if (aGivenB <= eps && bGivenA <= eps) {
        redundant.add(pairKey(a, b));
      } else if (aGivenB <= eps && bGivenA > eps) {
        // B determines A but not the reverse -> A is the coarser parent of B.
        parentsOf[b].add(a);
      }
    }
  }
  return { parentsOf, redundant };
}

function isRedundantWith(col: string, others: string[], redundant: Set<string>): boolean {
  return others.some(o => redundant.has(pairKey(col, o)));
}

// ── Labels / axis construction ──────────────────────────────────────────────

function humanize(col: string): string {
  return col.replace(/_/g, " ").trim()
    .split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function makeAxis(col: string, stats: Record<string, ColStats>, cfg: AutoAxisConfig, inner: boolean): ResolvedAxis {
  const cap = inner ? cfg.inner_max_labels : cfg.outer_max_labels;
  const ax: ResolvedAxis = { column: col, label: humanize(col) };
  if (cap && stats[col].k > cap) ax.max_labels = cap;
  return ax;
}

// ── Selection ────────────────────────────────────────────────────────────────

function fill(chosen: string[], pool: string[], n: number): string[] {
  for (const c of pool) {
    if (chosen.length >= n) break;
    if (!chosen.includes(c)) chosen.push(c);
  }
  return chosen.slice(0, n);
}

function selectOuter(
  eligible: string[], allDims: string[], stats: Record<string, ColStats>,
  rel: Relations, cfg: AutoAxisConfig, pinned: string[],
): string[] {
  const eligibleSet = new Set(eligible);
  const pool = eligible.filter(c =>
    !pinned.includes(c) && ![...rel.parentsOf[c]].some(p => eligibleSet.has(p)));
  const ranked = [...pool].sort((a, b) => scoreOuter(b, stats, cfg) - scoreOuter(a, stats, cfg));

  const need = cfg.n_outer - pinned.length;
  const chosen: string[] = [];
  for (const c of ranked) {
    if (chosen.length >= need) break;
    if (scoreOuter(c, stats, cfg) <= 0) continue;
    if (isRedundantWith(c, [...chosen, ...pinned], rel.redundant)) continue;
    chosen.push(c);
  }
  const fallback = [
    ...ranked.filter(c => !chosen.includes(c)),
    ...eligible.filter(c => !chosen.includes(c) && !pinned.includes(c)),
    ...allDims.filter(c => !chosen.includes(c) && !pinned.includes(c)),
  ];
  return fill(chosen, fallback, need);
}

function selectInner(
  candidates: string[], colData: Record<string, string[]>, weights: number[],
  stats: Record<string, ColStats>, outerCols: string[], rel: Relations,
  cfg: AutoAxisConfig, pinned: string[], nInner: number,
): { chosen: string[]; scores: Record<string, number> } {
  const outerKey = outerCols.length
    ? colData[outerCols[0]].map((_, i) => outerCols.map(c => colData[c][i]).join(SEP))
    : null;

  const scores: Record<string, number> = {};
  for (const c of candidates) {
    const Hcond = outerKey ? conditionalEntropy(colData[c], outerKey, weights) : stats[c].H;
    const Dcond = Math.exp(Hcond);
    const bonus = [...rel.parentsOf[c]].some(p => outerCols.includes(p)) ? cfg.child_nesting_bonus : 1.0;
    scores[c] = fInner(Dcond, cfg) * bonus * priorFactor(c, cfg);
  }
  const ordered = [...candidates].sort((a, b) => scores[b] - scores[a]);

  const need = nInner - pinned.length;
  const chosen: string[] = [];
  for (const c of ordered) {
    if (chosen.length >= need) break;
    if (scores[c] <= 0) continue;
    if (isRedundantWith(c, [...chosen, ...pinned], rel.redundant)) continue;
    chosen.push(c);
  }
  return { chosen: fill(chosen, ordered.filter(c => !chosen.includes(c)), need), scores };
}

interface Assignment { outer: ResolvedAxis[]; inner: ResolvedAxis[]; scoring: ScoringRow[]; }
interface ScoringRow {
  column: string; k: number; D: number; J: number; nearId: number;
  scoreOuter: number; scoreInner: number | null; parents: string; role: string;
}

function selectAxes(
  rows: Row[], countCol: string | undefined, cfg: AutoAxisConfig,
  pinnedOuter: Record<string, string>, pinnedInner: Record<string, string>,
): Assignment {
  const nRows = rows.length;
  if (nRows === 0) throw new Error("selectAxes received no rows");

  let weights: number[];
  if (cfg.weighting === "count" && countCol) {
    weights = rows.map(r => {
      let v = parseFloat(r[countCol]);
      if (isNaN(v) || v < 0) v = 0;
      return cfg.count_alpha !== 1.0 ? Math.pow(v, cfg.count_alpha) : v;
    });
  } else {
    weights = new Array(nRows).fill(1);
  }

  const excluded = new Set(cfg.exclude_columns);
  if (countCol) excluded.add(countCol);
  const pinnedCols = new Set([...Object.values(pinnedOuter), ...Object.values(pinnedInner)]);

  const allCols = nRows > 0 ? Object.keys(rows[0]) : [];
  const dims = allCols.filter(c => !excluded.has(c));
  const candidateDims = dims.filter(c => !pinnedCols.has(c));
  if (dims.length === 0) throw new Error("No candidate dimension columns after applying excludes");

  // Materialise per-column string arrays once.
  const colData: Record<string, string[]> = {};
  for (const c of dims) colData[c] = rows.map(r => r[c] ?? "");

  const stats: Record<string, ColStats> = {};
  for (const c of dims) stats[c] = columnStats(colData[c], weights, nRows);

  const eligible = candidateDims.filter(c =>
    stats[c].k >= cfg.min_distinct &&
    stats[c].D >= cfg.min_effective &&
    stats[c].nearId <= cfg.near_id_max);

  const rel = relations(eligible, colData, weights, stats, cfg);

  const pinnedOuterCols = (["x", "y", "z"] as const).filter(ax => pinnedOuter[ax]).map(ax => pinnedOuter[ax]);
  const autoOuter = selectOuter(eligible, candidateDims, stats, rel, cfg, pinnedOuterCols);
  const outerCols = [...pinnedOuterCols, ...autoOuter];

  const pinnedInnerCols = (["x", "y", "z"] as const).filter(ax => pinnedInner[ax]).map(ax => pinnedInner[ax]);
  const innerCandidates = eligible.filter(c => !outerCols.includes(c) && !pinnedInnerCols.includes(c));
  const innerRes = selectInner(innerCandidates, colData, weights, stats, outerCols, rel, cfg, pinnedInnerCols, cfg.n_inner);
  const innerCols = [...pinnedInnerCols, ...innerRes.chosen];

  for (const c of [...outerCols, ...innerCols]) {
    if (!stats[c]) {
      colData[c] = rows.map(r => r[c] ?? "");
      stats[c] = columnStats(colData[c], weights, nRows);
    }
  }

  const eligibleSet = new Set(eligible);
  const outerSet = new Set(outerCols);
  const innerSet = new Set(innerCols);
  const scoring: ScoringRow[] = dims.map(c => ({
    column: c, k: stats[c].k,
    D: +stats[c].D.toFixed(3), J: +stats[c].J.toFixed(3), nearId: +stats[c].nearId.toFixed(3),
    scoreOuter: +scoreOuter(c, stats, cfg).toFixed(4),
    scoreInner: c in innerRes.scores ? +innerRes.scores[c].toFixed(4) : null,
    parents: [...rel.parentsOf[c] ?? []].sort().join(","),
    role: outerSet.has(c) ? "outer" : innerSet.has(c) ? "inner" : eligibleSet.has(c) ? "unused" : "dropped",
  }));

  return {
    outer: outerCols.map(c => makeAxis(c, stats, cfg, false)),
    inner: innerCols.map(c => makeAxis(c, stats, cfg, true)),
    scoring,
  };
}

// ── Config-level integration ──────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCfg = Record<string, any>;

/** Columns already named by other config keys — never reuse them as axes. */
function implicitExcludes(cfg: AnyCfg): string[] {
  const out: string[] = [];
  const add = (v: unknown) => { if (typeof v === "string" && v) out.push(v); };
  for (const k of ["size_colour", "colour", "color_column", "datasets_column",
                   "tooltip_breakdown", "ghost_datasets", "accent_datasets"]) add(cfg[k]);
  const drill = cfg.drilldown;
  if (drill) {
    for (const k of ["category_column", "subcategory_column", "count_column", "size_colour", "color_column"]) add(drill[k]);
    if (drill.treemap) for (const k of ["category_column", "subcategory_column", "count_column"]) add(drill.treemap[k]);
  }
  if (cfg.slice?.count_column) add(cfg.slice.count_column);
  for (const block of ["info", "info_box"]) {
    const cols = cfg[block]?.columns;
    if (cols) for (const v of Object.values(cols)) add(v);
  }
  return [...new Set(out)];
}

function mergeCfg(block: AnyCfg | undefined): AutoAxisConfig {
  const cfg = defaults();
  if (!block) return cfg;
  const known = new Set(Object.keys(cfg));
  const unknown = Object.keys(block).filter(k => !known.has(k));
  if (unknown.length) console.warn(`axes.auto: ignoring unknown key(s): ${unknown.sort().join(", ")}`);
  for (const k of Object.keys(block)) if (known.has(k)) (cfg as AnyCfg)[k] = block[k];
  cfg.exclude_columns = (cfg.exclude_columns ?? []).map(String);
  return cfg;
}

export function isAutoAxes(cfg: AnyCfg): boolean {
  return String(cfg?.axes?.mode ?? "manual").toLowerCase() === "auto";
}

/**
 * When `axes.mode: auto`, resolve axis columns from the data and write them into
 * `cfg.axes` (and zoom-drilldown inner axes), mutating `cfg` in place. Pinned
 * faces (an x/y/z entry already naming a column present in the data) are kept.
 * No-op for manual configs. Must run before resolveAxisColumns / validateColumns.
 */
export function resolveAutoAxes(rows: Row[], cfg: AnyCfg): void {
  if (!isAutoAxes(cfg) || rows.length === 0) return;

  const axesCfg = cfg.axes ?? {};
  const block = { ...(axesCfg.auto ?? {}) };

  // General axes.max_labels caps every auto axis (outer + inner); granular
  // auto.outer_max_labels / auto.inner_max_labels still win when set explicitly.
  const generalMax = axesCfg.max_labels ?? block.max_labels;
  delete block.max_labels;
  if (generalMax != null) {
    block.outer_max_labels ??= generalMax;
    block.inner_max_labels ??= generalMax;
  }

  const userExcl: string[] = (block.exclude_columns ?? []).map(String);
  block.exclude_columns = [...new Set([...userExcl, ...implicitExcludes(cfg)])];
  const autoCfg = mergeCfg(block);

  const countCol: string | undefined = cfg.size_colour ?? cfg.colour;
  const available = new Set(Object.keys(rows[0]));

  const pinnedOuter: Record<string, string> = {};
  for (const ax of ["x", "y", "z"]) {
    const col = axesCfg[ax]?.column;
    if (col && available.has(col)) pinnedOuter[ax] = col;
  }

  const drill = cfg.drilldown;
  const zoomAuto = drill?.type === "zoom";
  const pinnedInner: Record<string, string> = {};
  if (zoomAuto) {
    for (const ax of ["x", "y", "z"]) {
      const col = drill.axes?.[ax]?.column;
      if (col && available.has(col)) pinnedInner[ax] = col;
    }
    autoCfg.n_inner = 3;
  } else {
    autoCfg.n_inner = 0;
  }

  const res = selectAxes(rows, countCol, autoCfg, pinnedOuter, pinnedInner);

  console.info(
    `Auto axes — outer: ${res.outer.map(a => a.column).join(" / ")}` +
    ` | inner: ${res.inner.map(a => a.column).join(" / ") || "(none)"}`,
  );
  // eslint-disable-next-line no-console
  if (typeof console.table === "function") console.table(res.scoring);

  // Write outer faces, preserving any user-set label on a pinned face.
  const newAxes: AnyCfg = {};
  (["x", "y", "z"] as const).forEach((ax, i) => {
    if (i >= res.outer.length) return;
    const userLabel = axesCfg[ax]?.label;
    newAxes[ax] = { ...res.outer[i] };
    if (userLabel) newAxes[ax].label = userLabel;
  });
  cfg.axes = newAxes;

  if (zoomAuto && res.inner.length) {
    drill.axes = drill.axes ?? {};
    (["x", "y", "z"] as const).forEach((ax, i) => {
      if (i >= res.inner.length) return;
      const userLabel = drill.axes[ax]?.label;
      drill.axes[ax] = { ...res.inner[i] };
      if (userLabel) drill.axes[ax].label = userLabel;
    });
  }
}
