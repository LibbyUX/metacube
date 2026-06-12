#' Generate a standalone HTML visualization file
#'
#' @param data A CubeData list (output of \code{cube_transform()}).
#' @param output Path to the output HTML file.
#' @return Invisibly returns the resolved output path.
#' @export
cube_build <- function(data, output) {
  template_path <- system.file("template.html", package = "metacube")
  if (!nchar(template_path)) {
    stop("Bundled template.html not found. Reinstall the package or rebuild the template.")
  }
  template <- paste(readLines(template_path, warn = FALSE), collapse = "\n")
  html <- .inject_data(template, data)
  writeLines(html, output, useBytes = FALSE)
  message("Visualization saved to ", normalizePath(output))
  invisible(normalizePath(output))
}

.inject_data <- function(template, data) {
  json_str <- jsonlite::toJSON(data, auto_unbox = TRUE, null = "null")
  injection <- paste0("<script>window.__CUBE_DATA__ = ", json_str, ";</script>\n    ")
  sub('<div id="root"></div>', paste0(injection, '<div id="root"></div>'), template, fixed = TRUE)
}
