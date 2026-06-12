#' Serve an interactive cube visualization locally
#'
#' Starts a local HTTP server and opens the visualization in the default browser.
#' Requires the \pkg{httpuv} package.
#'
#' @param data A CubeData list (output of \code{cube_transform()}).
#' @param port Integer port to serve on (default 8000).
#' @param open_browser Logical; whether to open a browser automatically.
#' @return Invisibly returns NULL. Blocks until interrupted (Ctrl+C / stop button).
#' @export
cube_serve <- function(data, port = 8000L, open_browser = TRUE) {
  if (!requireNamespace("httpuv", quietly = TRUE)) {
    stop("Package 'httpuv' is required for cube_serve(). Install it with install.packages('httpuv').")
  }

  template_path <- system.file("template.html", package = "metacube")
  if (!nchar(template_path)) {
    stop("Bundled template.html not found. Reinstall the package or rebuild the template.")
  }
  template <- paste(readLines(template_path, warn = FALSE), collapse = "\n")
  html     <- .inject_data(template, data)

  app <- list(
    call = function(req) {
      list(
        status  = 200L,
        headers = list("Content-Type" = "text/html; charset=utf-8"),
        body    = html
      )
    }
  )

  url <- paste0("http://localhost:", port, "/")
  message("Cube visualization running at ", url)
  message("Press Ctrl+C to stop.")
  if (open_browser) utils::browseURL(url)
  httpuv::runServer("127.0.0.1", port, app)
  invisible(NULL)
}
