# Tests for R auto axis selection. Run: Rscript r-pkg/tests/test_autoaxes.R
# Sources the package R files directly (no install needed).

args <- commandArgs(trailingOnly = FALSE)
file_arg <- sub("^--file=", "", args[grepl("^--file=", args)])
root <- if (length(file_arg)) normalizePath(file.path(dirname(file_arg), "..", "..")) else getwd()
source(file.path(root, "r-pkg", "R", "autoaxes.R"))

make_frame <- function() {
  set.seed(0)
  organ_to_tissue <- list(
    brain = c("frontal lobe", "cortex", "midbrain", "striatum"),
    blood = c("whole blood", "plasma")
  )
  rows <- list()
  for (organ in names(organ_to_tissue)) {
    for (tissue in organ_to_tissue[[organ]]) {
      for (molecule in c("RNA", "miRNA", "sncRNA")) {
        for (platform in c("illumina", "ont", "pacbio")) {
          rows[[length(rows) + 1]] <- data.frame(
            molecule = molecule, platform = platform,
            organism = "Homo sapiens", organ = organ, tissue = tissue,
            row_id = paste0("r", length(rows)),
            count = sample(10:1000, 1), stringsAsFactors = FALSE)
        }
      }
    }
  }
  do.call(rbind, rows)
}

ok <- 0; fail <- 0
check <- function(cond, msg) {
  if (isTRUE(cond)) { ok <<- ok + 1 } else { fail <<- fail + 1; cat("FAIL:", msg, "\n") }
}

df <- make_frame()

# 1. coarse-out / fine-in + constant dropped
cfg <- .merge_auto_cfg(list(exclude_columns = "row_id"))
res <- .select_axes(df, "count", cfg, list(), list())
outer <- vapply(res$outer, function(a) a$column, character(1))
inner <- vapply(res$inner, function(a) a$column, character(1))
check(!("organism" %in% c(outer, inner)), "constant organism must be dropped")
check(!("tissue" %in% outer), "fine tissue must not sit on an outer face")
check("tissue" %in% inner, "tissue belongs in drilldown")
check("organ" %in% outer, "coarse organ belongs on an outer face")
parents_tissue <- res$scoring$parents[res$scoring$column == "tissue"]
check(grepl("organ", parents_tissue), "organ should be derived parent of tissue")

# 2. identifier dropped
res2 <- .select_axes(df, "count", .merge_auto_cfg(NULL), list(), list())
assigned <- c(vapply(res2$outer, function(a) a$column, character(1)),
              vapply(res2$inner, function(a) a$column, character(1)))
check(!("row_id" %in% assigned), "near-unique row_id must be filtered")

# 3. apply_auto_axes fills config + excludes role columns
cfg3 <- list(
  axes = list(mode = "auto", auto = list(exclude_columns = list("row_id"))),
  size_colour = "count",
  drilldown = list(type = "treemap", category_column = "molecule",
                   subcategory_column = "tissue", count_column = "count"))
out3 <- .apply_auto_axes(df, cfg3)
cols3 <- c(out3$axes$x$column, out3$axes$y$column, out3$axes$z$column)
check(!("count" %in% cols3) && !("row_id" %in% cols3), "count/row_id excluded as axes")
check(!("molecule" %in% cols3) && !("tissue" %in% cols3), "treemap columns excluded as axes")
check(is.null(out3$axes$mode) && is.null(out3$axes$auto), "mode/auto scaffolding removed")

# 4. pinned face respected + label preserved
cfg4 <- list(axes = list(mode = "auto", x = list(column = "molecule", label = "Mol")),
             size_colour = "count")
out4 <- .apply_auto_axes(df, cfg4)
check(out4$axes$x$column == "molecule", "pinned x column kept")
check(out4$axes$x$label == "Mol", "pinned user label preserved")
check(!("molecule" %in% c(out4$axes$y$column, out4$axes$z$column)), "pinned column not reused")

# 5. manual config unchanged
cfg5 <- list(axes = list(x = list(column = "organ"), y = list(column = "tissue"),
                         z = list(column = "molecule")), size_colour = "count")
out5 <- .apply_auto_axes(df, cfg5)
check(identical(out5, cfg5), "manual config returned unchanged")

cat(sprintf("\n%d passed, %d failed\n", ok, fail))
if (fail > 0) quit(status = 1)
