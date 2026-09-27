# Chi-square and trend [M1-DESIGN.md 7.12]: chisq.test with and without Yates, the expected counts,
# and prop.trend.test (weighted regression of x/n on the scores).
# packages:
source("_common.R")

cases <- list()
chi <- function(id, tab, correct) {
  m <- matrix(unlist(tab), nrow = length(tab), byrow = TRUE)
  r <- suppressWarnings(chisq.test(m, correct = correct))
  cases[[id]] <<- case(sprintf("chisq.test(matrix(c(%s), nrow = %d, byrow = TRUE), correct = %s)", paste(t(m), collapse = ", "), nrow(m), correct), "closed",
    list(X2 = unname(r$statistic), df = unname(r$parameter), p = r$p.value, expected = unname(r$expected), minExpected = min(r$expected)),
    table = tab, yates = correct)
}
sero <- list(arr(c(116, 364)), arr(c(27, 209)))
chi("serosurvey.pearson", sero, FALSE)
chi("serosurvey.yates", sero, TRUE)
chi("rxc.2x3", list(arr(c(20, 15, 10)), arr(c(10, 20, 25))), FALSE)
chi("small.2x2.pearson", list(arr(c(3, 1)), arr(c(1, 3))), FALSE)
chi("small.2x2.yates", list(arr(c(3, 1)), arr(c(1, 3))), TRUE)
chi("rxc.3x3", list(arr(c(20, 5, 1)), arr(c(4, 15, 6)), arr(c(1, 3, 25))), FALSE)

tr <- function(id, x, n, score) {
  r <- prop.trend.test(x, n, score)
  cases[[id]] <<- case(sprintf("prop.trend.test(c(%s), c(%s), c(%s))", paste(x, collapse = ", "), paste(n, collapse = ", "), paste(score, collapse = ", ")), "closed",
    list(X2 = unname(r$statistic), df = unname(r$parameter), p = r$p.value), x = arr(x), n = arr(n), scores = arr(score))
}
tr("trend.rank", c(15, 10, 8, 4), c(20, 20, 20, 20), 1:4)
tr("trend.typed", c(15, 10, 8, 4), c(20, 25, 18, 30), c(0, 1, 2, 5))

rs_emit("chisq", c("test.chisq", "test.trend"), cases)
