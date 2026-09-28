# Hodges-Lehmann estimates and intervals [M2-DESIGN.md 3.1.6]: wilcox.test(conf.int = TRUE). Exact (n < 50,
# no ties) from the Walsh averages and qwilcox/qsignrank: closed. With ties R uses the normal approximation
# with the continuity correction and finds the estimate and the interval with uniroot(tol = 1e-4): the
# `uniroot` tolerance of the parity test.
# packages:
source("_common.R")
source("_data.R")

cases <- list()
two_hl <- function(x, y, label, data, tol) {
  w <- suppressWarnings(wilcox.test(x, y, conf.int = TRUE))
  case(label, tol, list(estimate = unname(w$estimate), ci = ci_of(w$conf.int), W = unname(w$statistic), p = w$p.value),
    data = data, x = arr(x), y = arr(y), confLevel = 0.95, exact = length(unique(c(x, y))) == length(c(x, y)) && length(x) < 50 && length(y) < 50,
    closedValues = arr(c("W", "p")))
}
pair_hl <- function(x, y, label, data, tol) {
  w <- suppressWarnings(wilcox.test(x, y, paired = TRUE, conf.int = TRUE))
  case(label, tol, list(estimate = unname(w$estimate), ci = ci_of(w$conf.int), V = unname(w$statistic), p = w$p.value),
    data = data, x = arr(x), y = arr(y), confLevel = 0.95, closedValues = arr(c("V", "p")))
}
cases[["two.exact"]] <- two_hl(two$g1, two$g2, "wilcox.test(two$g1, two$g2, conf.int = TRUE)", "two", "closed")
cases[["paired.exact"]] <- pair_hl(paired$before, paired$after, "wilcox.test(paired$before, paired$after, paired = TRUE, conf.int = TRUE)", "paired", "closed")

# Tied cases (made-up): the normal approximation with correction; estimate and CI by uniroot.
tx <- c(1.5, 2.5, 2.5, 3, 4, 4, 5.5, 3)
ty <- c(3, 4, 4.5, 5.5, 6, 7, 7, 5.5, 6.5)
cases[["two.ties"]] <- two_hl(tx, ty, "wilcox.test(tx, ty, conf.int = TRUE) with ties (normal approximation)", "tied (made-up)", "uniroot")
# Differences are exact in binary (1, 1, 0, 1, 1, 1, 2, 1, 1, 0.5), so the ties do not depend on rounding.
pb <- c(10, 12, 9, 13, 11, 12, 14, 10, 12, 11)
pa <- c(9, 11, 9, 12, 10, 11, 12, 9, 11, 10.5)
cases[["paired.ties"]] <- pair_hl(pb, pa, "wilcox.test(pb, pa, paired = TRUE, conf.int = TRUE) with tied differences and a zero", "tied pairs (made-up)", "uniroot")

rs_emit("hodgeslehmann", c("test.mannWhitney", "test.wilcoxonSignedRank"), cases,
  notes = "Exact intervals are order statistics of the Walsh averages (closed). Tied cases (made-up data, ข้อมูลสมมุติ / made-up data) use R's normal approximation with continuity correction and uniroot(tol = 1e-4) for the estimate and the bounds (uniroot tolerance); their W, V and p are closed forms.")
