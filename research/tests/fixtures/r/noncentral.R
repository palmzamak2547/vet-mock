# Noncentral t and F distribution values for stats/noncentral.js [M2-DESIGN.md 3.1.7]: R's pt(q, df, ncp)
# (pnt, AS 243) and pf(q, df1, df2, ncp) (pnbeta, AS 226 with Frick's correction), both tails, including
# tails below 1e-10. The tiny tails are lower tails that R sums directly (pt with a large ncp, pf near 0): an
# upper tail that R forms as 1 - (lower) loses its digits in R itself and would pin R's rounding, not a value. The design asked for these in dist.R; they are a file of their own so the M1 dist
# adapter (which maps each case to a central distribution function) stays as it is.
# packages:
source("_common.R")

cases <- list()
tc <- list(
  list(1.5, 10, 1, TRUE), list(2.1, 25, 2.5, TRUE), list(-1, 5, 0.5, TRUE), list(3, 15, 1, FALSE),
  list(0, 30, 2, TRUE), list(-2, 12, -1.5, TRUE), list(1.96, 38, 3.2, FALSE), list(2.02, 18, 2.9, FALSE),
  list(5, 8, 10, TRUE), list(0.5, 20, 8, TRUE), list(1, 10, 7.5, TRUE)
)
for (i in seq_along(tc)) {
  a <- tc[[i]]
  cases[[sprintf("pt.%02d", i)]] <- case(sprintf("pt(%s, %s, ncp = %s, lower.tail = %s)", a[[1]], a[[2]], a[[3]], a[[4]]), "iterative",
    list(p = pt(a[[1]], a[[2]], ncp = a[[3]], lower.tail = a[[4]])), fn = "pnt", q = a[[1]], df = a[[2]], ncp = a[[3]], lowerTail = a[[4]],
    tolByValue = list(p = "rAbs12"))
}
fc <- list(
  list(2.5, 3, 20, 4, TRUE), list(2.5, 3, 20, 4, FALSE), list(1.2, 2, 50, 1.5, TRUE), list(5, 4, 30, 10, FALSE),
  list(0.01, 10, 30, 20, TRUE), list(3.0983912121407811, 2, 15, 6, FALSE), list(0.5, 1, 10, 0.8, TRUE),
  list(2.6993545548395, 3, 100, 16.5, FALSE), list(0.05, 6, 40, 12, TRUE)
)
for (i in seq_along(fc)) {
  a <- fc[[i]]
  cases[[sprintf("pf.%02d", i)]] <- case(sprintf("pf(%.17g, %s, %s, ncp = %s, lower.tail = %s)", a[[1]], a[[2]], a[[3]], a[[4]], a[[5]]), "iterative",
    list(p = pf(a[[1]], a[[2]], a[[3]], ncp = a[[4]], lower.tail = a[[5]])), fn = "pnf", q = a[[1]], df1 = a[[2]], df2 = a[[3]], ncp = a[[4]], lowerTail = a[[5]],
    tolByValue = list(p = "rAbs9"))
}
tiny <- vapply(cases, function(c) c$values$p, 0)
stopifnot(any(tiny < 1e-10))

rs_emit("noncentral", c("power.anova", "power.tTest", "power.regression"), cases,
  notes = paste("Every value is a series summed to R's own absolute error bound: errmax 1e-12 in pnt (AS 243), errmax 1e-9 in pnbeta (AS 226).",
    "Compared within 1e-6 relative OR within that absolute bound (tol kinds rAbs12, rAbs9): a tail smaller than the bound is as accurate in R as the bound, no more.",
    "Measured against Boost (SciPy 1.17.1): pt(1, 10, ncp = 7.5) = 1.0362243e-10 in R vs 1.0362293e-10 (4.8e-6 relative); pf(0.01, 10, 30, ncp = 20) = 2.2827e-13 in R vs 2.2944e-13 (5.1e-3 relative);",
    "pf(0.05, 6, 40, ncp = 12) = 1.81835e-6 in R vs 1.81846e-6 (5.6e-5 relative): R's values are within its stated absolute bounds, and a port of AS 243 / AS 226 reproduces them exactly."))
