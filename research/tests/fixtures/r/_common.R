# Shared helpers for the R parity fixtures [M1-DESIGN.md 13.2].
#
# Every fixture script sources this file, builds a named list of cases and calls rs_emit(). The JSON
# writer is written here in base R on purpose: numbers go out as sprintf("%.17g") so a double survives
# the trip to JavaScript bit for bit, and the files do not depend on the version of a JSON package.
#
# Runs in two places and must give the same numbers:
#   webR 0.6.0 in Node (research/scripts/r-parity/run-webr.mjs sets RS_WEBR = "0.6.0"), the pin;
#   native R 4.6.0 in GitHub Actions (research/scripts/r-parity/run-native.mjs), the second check.
# RS_OUT names the output folder in both.
#
# Encoding of values that JSON cannot hold: Inf -> "Infinity", -Inf -> "-Infinity", NaN -> "NaN",
# NA -> null. The JavaScript side turns the three strings back into numbers.

rs_out_dir <- function() {
  d <- Sys.getenv("RS_OUT", "out")
  if (!dir.exists(d)) dir.create(d, recursive = TRUE)
  d
}

# Force a JSON array even when the vector has length 1.
arr <- function(x) structure(list(x), class = "rs_array")

rs_json_string <- function(s) {
  s <- enc2utf8(as.character(s))
  s <- gsub("\\", "\\\\", s, fixed = TRUE)
  s <- gsub("\"", "\\\"", s, fixed = TRUE)
  s <- gsub("\n", "\\n", s, fixed = TRUE)
  s <- gsub("\r", "\\r", s, fixed = TRUE)
  s <- gsub("\t", "\\t", s, fixed = TRUE)
  paste0("\"", s, "\"")
}

rs_json_scalar <- function(v) {
  if (is.null(v)) return("null")
  if (is.logical(v)) return(if (is.na(v)) "null" else if (v) "true" else "false")
  if (is.character(v) || is.factor(v)) return(if (is.na(v)) "null" else rs_json_string(v))
  if (is.numeric(v)) {
    if (is.na(v) && !is.nan(v)) return("null")
    if (is.nan(v)) return("\"NaN\"")
    if (is.infinite(v)) return(if (v > 0) "\"Infinity\"" else "\"-Infinity\"")
    if (is.integer(v)) return(sprintf("%d", v))
    if (v == round(v) && abs(v) < 1e15) return(sprintf("%.0f", v))
    return(sprintf("%.17g", v))
  }
  stop("rs_json: unsupported scalar of class ", class(v)[1])
}

rs_json <- function(x, indent = 0) {
  pad <- strrep(" ", indent + 1)
  close <- strrep(" ", indent)
  if (inherits(x, "rs_array")) {
    v <- unclass(x)[[1]]
    if (length(v) == 0) return("[]")
    return(paste0("[", paste(vapply(seq_along(v), function(i) rs_json(if (is.list(v)) v[[i]] else v[i], indent + 1), ""), collapse = ", "), "]"))
  }
  if (is.null(x)) return("null")
  if (is.list(x)) {
    nm <- names(x)
    if (length(x) == 0) return(if (is.null(nm)) "[]" else "{}")
    if (is.null(nm)) {
      items <- vapply(x, rs_json, "", indent = indent + 1)
      return(paste0("[\n", paste0(pad, items, collapse = ",\n"), "\n", close, "]"))
    }
    items <- vapply(seq_along(x), function(i) paste0(rs_json_string(nm[i]), ": ", rs_json(x[[i]], indent + 1)), "")
    return(paste0("{\n", paste0(pad, items, collapse = ",\n"), "\n", close, "}"))
  }
  if (is.matrix(x)) {
    rows <- lapply(seq_len(nrow(x)), function(i) arr(unname(x[i, ])))
    return(rs_json(rows, indent))
  }
  x <- unname(x)
  if (length(x) == 1) return(rs_json_scalar(x))
  if (length(x) == 0) return("[]")
  paste0("[", paste(vapply(seq_along(x), function(i) rs_json_scalar(x[i]), ""), collapse = ", "), "]")
}

# Versions of the packages a script used (base packages carry R's version).
rs_packages <- function(pkgs) {
  if (length(pkgs) == 0) return(setNames(list(), character(0)))
  setNames(lapply(pkgs, function(p) as.character(utils::packageVersion(p))), pkgs)
}

rs_require <- function(pkgs) {
  for (p in pkgs) {
    if (!requireNamespace(p, quietly = TRUE)) stop("R package not installed: ", p)
    suppressPackageStartupMessages(library(p, character.only = TRUE))
  }
  invisible(pkgs)
}

# Write <out>/<name>.json.
#   name     the fixture file name without extension (dist, ttest, ...)
#   methods  catalogue ids the file pins (M1-DESIGN.md 5)
#   cases    named list; each case is a named list with at least `call` (the R call, as text),
#            `tol` ("closed", "iterative" or "uniroot") and `values`
#   packages non-base packages the script used
#   notes    free text: formulas written in base R, papers cited
#   datasets optional named list of the input data the cases name (M2: so the JavaScript test reads exactly
#            the numbers R used; compared exactly by compare.mjs)
rs_emit <- function(name, methods, cases, packages = character(0), notes = NULL, datasets = NULL) {
  si <- utils::sessionInfo()
  webr <- Sys.getenv("RS_WEBR", "")
  doc <- list(
    `_fixture` = list(family = "r-4.6.0", kind = "pin", methods = arr(methods)),
    `_meta` = list(
      script = paste0("research/tests/fixtures/r/", name, ".R"),
      r = R.version.string,
      webR = if (nzchar(webr)) webr else NULL,
      platform = R.version$platform,
      basePackages = arr(si$basePkgs),
      packages = rs_packages(packages),
      numberFormat = "sprintf('%.17g'); Inf, -Inf and NaN as the strings Infinity, -Infinity, NaN; NA as null",
      tolerances = list(
        closed = "1e-10 relative",
        iterative = "1e-6 relative",
        uniroot = "|js - R| <= 2 * 1.220703125e-4 * max(1, |R|)"
      )
    ),
    notes = notes,
    datasets = datasets,
    cases = cases
  )
  if (is.null(notes)) doc$notes <- NULL
  if (is.null(datasets)) doc$datasets <- NULL
  txt <- paste0(rs_json(doc), "\n")
  path <- file.path(rs_out_dir(), paste0(name, ".json"))
  con <- file(path, open = "wb")
  writeLines(txt, con, sep = "", useBytes = TRUE)
  close(con)
  invisible(path)
}

# Small helpers used by several scripts.
ci_of <- function(x) arr(unname(as.numeric(x)))
# Formals start with a dot so a case argument named c, t or v cannot partially match them.
case <- function(.call, .tol, .values, ...) {
  extra <- list(...)
  base::c(list(call = .call, tol = .tol), extra, list(values = .values))
}
