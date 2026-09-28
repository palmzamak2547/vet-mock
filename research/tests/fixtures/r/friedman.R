# Friedman rank sum test [M2-DESIGN.md 3.1.3]: friedman.test on RoundingTimes (R's help example; Hollander and
# Wolfe 1973, p. 140), on the made-up `rm` blocks, and on a block with a missing value dropped whole.
# PMCMRplus (the natural second source) does not load in webR 0.6.0 (its dependency Rmpfr is not in
# repo.r-wasm.org), so the statistic is also written out in base R (the tie-corrected formula of
# stats:::friedman.test.default) and the script stops if the two differ.
# packages:
source("_common.R")
source("_data_m2.R")

by_hand <- function(y) {
  r <- t(apply(y, 1, rank)); n <- nrow(y); k <- ncol(y)
  ties <- apply(r, 1, function(u) sum(table(u)^3 - table(u)))
  stat <- 12 * sum((colSums(r) - n * (k + 1) / 2)^2) / (n * k * (k + 1) - sum(ties) / (k - 1))
  c(stat, k - 1, pchisq(stat, k - 1, lower.tail = FALSE))
}
one <- function(y, label, data) {
  f <- friedman.test(y)
  h <- by_hand(y)
  stopifnot(isTRUE(all.equal(unname(c(f$statistic, f$parameter, f$p.value)), h, tolerance = 1e-12)))
  case(label, "closed", list(statistic = unname(f$statistic), df = unname(f$parameter), p = f$p.value,
    rankSums = arr(unname(colSums(t(apply(y, 1, rank)))))), data = data, blocks = nrow(y), treatments = ncol(y))
}
cases <- list()
cases[["roundingTimes"]] <- one(rounding_times, "friedman.test(RoundingTimes)", "roundingTimes")
cases[["rm"]] <- one(rm_wide, "friedman.test(rm_wide)", "rm")
withNA <- rounding_times; withNA[5, 2] <- NA
f <- friedman.test(withNA)
stopifnot(isTRUE(all.equal(unname(f$statistic), unname(friedman.test(rounding_times[-5, ])$statistic))))
cases[["roundingTimes.missing"]] <- case("friedman.test(RoundingTimes with row 5, column 2 missing): block 5 dropped whole", "closed",
  list(statistic = unname(f$statistic), df = unname(f$parameter), p = f$p.value), data = "roundingTimes", missingRow = 5L, missingColumn = 2L, blocks = 21L)

rs_emit("friedman", c("test.friedman"), cases,
  datasets = list(roundingTimes = rounding_times, rm = rm_wide),
  notes = "RoundingTimes: R's help page prints chi-squared 11.143, p 0.003805. PMCMRplus does not load in webR (Rmpfr missing), so the base-R formula is the second source (stopifnot). Rows of the datasets are blocks, columns treatments (1-based row numbers in missingRow).")
