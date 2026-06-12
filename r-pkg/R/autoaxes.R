# Automatic axis assignment for metacube (R port of python-pkg/.../autoaxes.py).
#
# Manual mode (default) takes axis columns straight from the config. Auto mode
# (axes$mode == "auto") inspects the data frame and assigns columns to the cube
# faces and zoom-drilldown axes by scoring how much visual variety each column
# contributes, with separate scoring for outer faces (a few clean buckets read
# best) and inner drilldown axes (fine detail is the point). The coarse->fine
# hierarchy is derived from the data via conditional entropy, so a high-
# cardinality column like "tissue" stays off the outer faces and a coarse one
# like "organ" goes outside. Nothing is domain-specific. Base R only.
#
# Metric: count-weighted Shannon entropy H; effective categories D = exp(H)
# (Hill number, order 1). D already reflects skew, so it is used directly; evenness
# J = H / log(k) is reported but no longer penalises dominant categories.

# ── Defaults (mirror python AutoAxisConfig) ─────────────────────────────────
.auto_axis_defaults <- function() {
  list(
    n_outer = 3L, n_inner = 3L,
    weighting = "cube_cells", count_alpha = 1.0,
    outer_band_lo = 1.2, outer_band_peak_lo = 2.5,
    outer_band_peak_hi = 8.0, outer_band_hi = 25.0,
    inner_d_cap = 40.0,
    min_distinct = 2L, min_effective = 1.05, near_id_max = 0.9,
    hierarchy_cond_entropy_eps = 0.05, redundancy_nmi = 0.9,
    child_nesting_bonus = 1.25,
    outer_max_labels = 30L, inner_max_labels = 40L,
    exclude_columns = character(0),
    semantic_priors = list()
  )
}

.merge_auto_cfg <- function(block) {
  cfg <- .auto_axis_defaults()
  if (is.null(block)) return(cfg)
  known <- names(cfg)
  unknown <- setdiff(names(block), known)
  if (length(unknown) > 0)
    message("axes.auto: ignoring unknown key(s): ", paste(sort(unknown), collapse = ", "))
  for (k in intersect(names(block), known)) cfg[[k]] <- block[[k]]
  cfg$exclude_columns <- as.character(cfg$exclude_columns)
  cfg
}

# ── Entropy primitives ──────────────────────────────────────────────────────
.entropy <- function(w) {
  w <- w[w > 0]
  total <- sum(w)
  if (total <= 0) return(0)
  p <- w / total
  -sum(p * log(p))
}

.value_weights <- function(values, weights) {
  as.numeric(tapply(weights, as.character(values), sum))
}

.conditional_entropy <- function(a, b, weights) {
  a <- as.character(a); b <- as.character(b)
  total <- sum(weights)
  if (total <= 0) return(0)
  h <- 0
  for (bv in unique(b)) {
    idx <- b == bv
    pb <- sum(weights[idx]) / total
    h <- h + pb * .entropy(.value_weights(a[idx], weights[idx]))
  }
  h
}

.column_stats <- function(values, weights, n_rows) {
  totals <- .value_weights(values, weights)
  k <- length(totals)
  H <- .entropy(totals)
  list(
    k = k, H = H, D = exp(H),
    J = if (k > 1) H / log(k) else 0,
    near_id = if (n_rows > 0) k / n_rows else 0
  )
}

# ── Scoring curves ──────────────────────────────────────────────────────────
.f_outer <- function(D, cfg) {
  lo <- cfg$outer_band_lo; pl <- cfg$outer_band_peak_lo
  ph <- cfg$outer_band_peak_hi; hi <- cfg$outer_band_hi
  if (D <= lo || D >= hi) return(0)
  if (D < pl) return((D - lo) / (pl - lo))
  if (D <= ph) return(1)
  (hi - D) / (hi - ph)
}

.f_inner <- function(D, cfg) min(D, cfg$inner_d_cap) / cfg$inner_d_cap

.prior_factor <- function(col, cfg) {
  p <- cfg$semantic_priors[[col]]
  1.0 + if (is.null(p)) 0 else as.numeric(p)
}

.score_outer <- function(col, stats, cfg) {
  s <- stats[[col]]
  # Ranked by effective category count (D) only; D already reflects skew, so no
  # additional evenness penalty (don't demote legitimately dominant categories).
  .f_outer(s$D, cfg) * .prior_factor(col, cfg)
}

# ── Relations: hierarchy + redundancy ───────────────────────────────────────
.pair_key <- function(a, b) paste(sort(c(a, b)), collapse = "\x1f")

.relations <- function(cols, df, weights, stats, cfg) {
  eps <- cfg$hierarchy_cond_entropy_eps
  norm_ce <- list()
  for (a in cols) {
    la <- if (stats[[a]]$k > 1) log(stats[[a]]$k) else 0
    for (b in cols) {
      if (a == b) next
      ce <- .conditional_entropy(df[[a]], df[[b]], weights)
      norm_ce[[paste(a, b, sep = "\x1f")]] <- if (la > 0) ce / la else 0
    }
  }
  parents_of <- stats::setNames(vector("list", length(cols)), cols)
  for (c in cols) parents_of[[c]] <- character(0)
  redundant <- character(0)
  for (a in cols) for (b in cols) {
    if (a == b) next
    a_given_b <- norm_ce[[paste(a, b, sep = "\x1f")]]
    b_given_a <- norm_ce[[paste(b, a, sep = "\x1f")]]
    if (a_given_b <= eps && b_given_a <= eps) {
      redundant <- union(redundant, .pair_key(a, b))
    } else if (a_given_b <= eps && b_given_a > eps) {
      # B determines A but not the reverse -> A is the coarser parent of B.
      parents_of[[b]] <- union(parents_of[[b]], a)
    }
  }
  list(parents_of = parents_of, redundant = redundant)
}

.is_redundant_with <- function(col, others, redundant) {
  for (o in others) if (.pair_key(col, o) %in% redundant) return(TRUE)
  FALSE
}

# ── Labels / axis construction ──────────────────────────────────────────────
.humanize <- function(col) {
  words <- strsplit(gsub("_", " ", trimws(col)), "\\s+")[[1]]
  paste(toupper(substring(words, 1, 1)), substring(words, 2), sep = "", collapse = " ")
}

.make_axis <- function(col, stats, cfg, inner) {
  cap <- if (inner) cfg$inner_max_labels else cfg$outer_max_labels
  k <- stats[[col]]$k
  ax <- list(label = .humanize(col), column = col)
  if (!is.null(cap) && k > cap) ax$max_labels <- as.integer(cap)
  ax
}

# ── Selection ────────────────────────────────────────────────────────────────
.fill <- function(chosen, pool, n) {
  for (c in pool) {
    if (length(chosen) >= n) break
    if (!(c %in% chosen)) chosen <- c(chosen, c)
  }
  head(chosen, n)
}

.select_outer <- function(eligible, all_dims, stats, parents_of, redundant, cfg, pinned) {
  pool <- Filter(function(c) !(c %in% pinned) &&
                   length(intersect(parents_of[[c]], eligible)) == 0, eligible)
  ranked <- pool[order(vapply(pool, .score_outer, numeric(1), stats = stats, cfg = cfg),
                       decreasing = TRUE)]
  chosen <- character(0)
  need <- cfg$n_outer - length(pinned)
  for (c in ranked) {
    if (length(chosen) >= need) break
    if (.score_outer(c, stats, cfg) <= 0) next
    if (.is_redundant_with(c, c(chosen, pinned), redundant)) next
    chosen <- c(chosen, c)
  }
  fallback <- c(setdiff(ranked, chosen),
                setdiff(eligible, c(chosen, pinned)),
                setdiff(all_dims, c(chosen, pinned)))
  .fill(chosen, fallback, need)
}

.select_inner <- function(candidates, df, weights, stats, outer_cols,
                          parents_of, redundant, cfg, pinned, n_inner) {
  outer_key <- if (length(outer_cols) > 0)
    do.call(paste, c(lapply(outer_cols, function(c) as.character(df[[c]])), sep = "\x1f"))
  else NULL

  scores <- numeric(0)
  for (c in candidates) {
    H_cond <- if (!is.null(outer_key)) .conditional_entropy(df[[c]], outer_key, weights) else stats[[c]]$H
    D_cond <- exp(H_cond)
    bonus  <- if (length(intersect(parents_of[[c]], outer_cols)) > 0) cfg$child_nesting_bonus else 1.0
    scores[c] <- .f_inner(D_cond, cfg) * bonus * .prior_factor(c, cfg)
  }
  ordered <- names(sort(scores, decreasing = TRUE))
  chosen <- character(0)
  need <- n_inner - length(pinned)
  for (c in ordered) {
    if (length(chosen) >= need) break
    if (scores[[c]] <= 0) next
    if (.is_redundant_with(c, c(chosen, pinned), redundant)) next
    chosen <- c(chosen, c)
  }
  list(chosen = .fill(chosen, setdiff(ordered, chosen), need), scores = scores)
}

# ── Core selection ────────────────────────────────────────────────────────────
.select_axes <- function(df, count_col, cfg, pinned_outer, pinned_inner) {
  n_rows <- nrow(df)
  if (n_rows == 0) stop("select_axes received an empty data frame")

  if (identical(cfg$weighting, "count") && !is.null(count_col) && count_col %in% names(df)) {
    weights <- suppressWarnings(as.numeric(df[[count_col]]))
    weights[is.na(weights) | weights < 0] <- 0
    if (cfg$count_alpha != 1.0) weights <- weights ^ cfg$count_alpha
  } else {
    weights <- rep(1.0, n_rows)
  }

  excluded <- cfg$exclude_columns
  if (!is.null(count_col)) excluded <- union(excluded, count_col)
  pinned_cols <- unname(unlist(c(pinned_outer, pinned_inner)))
  dims <- setdiff(names(df), excluded)
  candidate_dims <- setdiff(dims, pinned_cols)
  if (length(dims) == 0) stop("No candidate dimension columns after applying excludes")

  stats <- stats::setNames(
    lapply(dims, function(c) .column_stats(df[[c]], weights, n_rows)), dims)

  eligible <- Filter(function(c)
    stats[[c]]$k >= cfg$min_distinct &&
      stats[[c]]$D >= cfg$min_effective &&
      stats[[c]]$near_id <= cfg$near_id_max, candidate_dims)

  rel <- .relations(eligible, df, weights, stats, cfg)
  parents_of <- rel$parents_of; redundant <- rel$redundant

  pinned_outer_cols <- unlist(pinned_outer[intersect(c("x", "y", "z"), names(pinned_outer))])
  auto_outer <- .select_outer(eligible, candidate_dims, stats, parents_of,
                              redundant, cfg, as.character(pinned_outer_cols))
  outer_cols <- c(as.character(pinned_outer_cols), auto_outer)

  pinned_inner_cols <- unlist(pinned_inner[intersect(c("x", "y", "z"), names(pinned_inner))])
  inner_candidates <- setdiff(eligible, c(outer_cols, pinned_inner_cols))
  inner_res <- .select_inner(inner_candidates, df, weights, stats, outer_cols,
                             parents_of, redundant, cfg,
                             as.character(pinned_inner_cols), cfg$n_inner)
  inner_cols <- c(as.character(pinned_inner_cols), inner_res$chosen)

  for (c in c(outer_cols, inner_cols))
    if (is.null(stats[[c]])) stats[[c]] <- .column_stats(df[[c]], weights, n_rows)

  list(
    outer = lapply(outer_cols, .make_axis, stats = stats, cfg = cfg, inner = FALSE),
    inner = lapply(inner_cols, .make_axis, stats = stats, cfg = cfg, inner = TRUE),
    scoring = .scoring_table(dims, stats, eligible, outer_cols, inner_cols,
                             inner_res$scores, parents_of, cfg)
  )
}

.scoring_table <- function(dims, stats, eligible, outer_cols, inner_cols,
                           inner_scores, parents_of, cfg) {
  role <- function(c) {
    if (c %in% outer_cols) "outer"
    else if (c %in% inner_cols) "inner"
    else if (!(c %in% eligible)) "dropped"
    else "unused"
  }
  data.frame(
    column = dims,
    k = vapply(dims, function(c) stats[[c]]$k, integer(1)),
    D = round(vapply(dims, function(c) stats[[c]]$D, numeric(1)), 3),
    J = round(vapply(dims, function(c) stats[[c]]$J, numeric(1)), 3),
    near_id = round(vapply(dims, function(c) stats[[c]]$near_id, numeric(1)), 3),
    score_outer = round(vapply(dims, .score_outer, numeric(1), stats = stats, cfg = cfg), 4),
    score_inner = round(vapply(dims, function(c) {
      if (c %in% names(inner_scores)) inner_scores[[c]] else NA_real_
    }, numeric(1)), 4),
    parents = vapply(dims, function(c) paste(sort(parents_of[[c]]), collapse = ","), character(1)),
    role = vapply(dims, role, character(1)),
    stringsAsFactors = FALSE, row.names = NULL
  )
}

# ── Config-level integration ──────────────────────────────────────────────────
.implicit_excludes <- function(cfg) {
  out <- character(0)
  add <- function(v) if (is.character(v) && length(v) == 1) out[[length(out) + 1]] <<- v
  for (k in c("size_colour", "size_column", "color_column", "datasets_column", "priority_column"))
    add(cfg[[k]])
  drill <- cfg$drilldown
  if (!is.null(drill)) {
    for (k in c("category_column", "subcategory_column", "count_column", "size_column", "color_column"))
      add(drill[[k]])
    tm <- drill$treemap
    if (!is.null(tm)) for (k in c("category_column", "subcategory_column", "count_column")) add(tm[[k]])
  }
  if (!is.null(cfg$slice$count_column)) add(cfg$slice$count_column)
  for (block in c("info", "info_box")) {
    cols <- cfg[[block]]$columns
    if (!is.null(cols)) for (v in cols) add(v)
  }
  unique(out)
}

.is_auto <- function(cfg) {
  mode <- cfg$axes$mode
  !is.null(mode) && tolower(as.character(mode)) == "auto"
}

#' Resolve auto axes into an explicit config (internal).
#'
#' When \code{config$axes$mode == "auto"}, fills in axis columns by data-driven
#' variety scoring; otherwise returns the config unchanged. Pinned faces (an
#' x/y/z entry already naming a column) are kept; the rest are auto-filled, and
#' zoom drilldown inner axes are filled when present.
#' @keywords internal
.apply_auto_axes <- function(df, cfg) {
  if (!.is_auto(cfg)) return(cfg)

  axes_cfg <- cfg$axes
  block <- if (is.null(axes_cfg$auto)) list() else axes_cfg$auto

  # General axes$max_labels caps every auto axis (outer + inner); granular
  # auto$outer_max_labels / auto$inner_max_labels still win when set explicitly.
  general_max <- if (!is.null(axes_cfg$max_labels)) axes_cfg$max_labels else block$max_labels
  block$max_labels <- NULL
  if (!is.null(general_max)) {
    if (is.null(block$outer_max_labels)) block$outer_max_labels <- general_max
    if (is.null(block$inner_max_labels)) block$inner_max_labels <- general_max
  }

  user_excl <- if (!is.null(block$exclude_columns)) as.character(block$exclude_columns) else character(0)
  block$exclude_columns <- union(user_excl, .implicit_excludes(cfg))
  auto_cfg <- .merge_auto_cfg(block)

  count_col <- if (!is.null(cfg$size_column)) cfg$size_column else cfg$size_colour

  pinned_outer <- list()
  for (ax in c("x", "y", "z")) {
    col <- axes_cfg[[ax]]$column
    if (!is.null(col) && col %in% names(df)) pinned_outer[[ax]] <- col
  }

  drill <- cfg$drilldown
  zoom_auto <- !is.null(drill) && identical(drill$type, "zoom")
  pinned_inner <- list()
  if (zoom_auto) {
    for (ax in c("x", "y", "z")) {
      col <- drill$axes[[ax]]$column
      if (!is.null(col) && col %in% names(df)) pinned_inner[[ax]] <- col
    }
    auto_cfg$n_inner <- 3L
  } else {
    auto_cfg$n_inner <- 0L
  }

  res <- .select_axes(df, count_col, auto_cfg, pinned_outer, pinned_inner)

  message("Auto axes — outer: ",
          paste(vapply(res$outer, function(a) a$column, character(1)), collapse = " / "),
          " | inner: ",
          paste(vapply(res$inner, function(a) a$column, character(1)), collapse = " / "))
  message("Auto axis scoring table:\n",
          paste(utils::capture.output(print(res$scoring)), collapse = "\n"))

  # Write resolved outer faces, preserving any user-set label on pinned faces.
  for (i in seq_along(c("x", "y", "z"))) {
    ax <- c("x", "y", "z")[i]
    if (i > length(res$outer)) next
    axis <- res$outer[[i]]
    user_label <- cfg$axes[[ax]]$label
    cfg$axes[[ax]] <- axis
    if (!is.null(user_label)) cfg$axes[[ax]]$label <- user_label
  }
  cfg$axes$mode <- NULL
  cfg$axes$auto <- NULL

  if (zoom_auto && length(res$inner) > 0) {
    for (i in seq_along(c("x", "y", "z"))) {
      ax <- c("x", "y", "z")[i]
      if (i > length(res$inner)) next
      axis <- res$inner[[i]]
      user_label <- cfg$drilldown$axes[[ax]]$label
      cfg$drilldown$axes[[ax]] <- axis
      if (!is.null(user_label)) cfg$drilldown$axes[[ax]]$label <- user_label
    }
  }

  cfg
}
