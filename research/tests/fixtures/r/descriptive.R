# Descriptives [M1-DESIGN.md 7.3]: mean, sd (n - 1), se and quartiles by R's quantile types 7
# (R default) and 6 (SPSS / Minitab), on the dataset `quantiles` and the other literal datasets.
# packages:
source("_common.R")
source("_data.R")

cases <- list()
desc <- function(id, name, x) {
  q7 <- unname(quantile(x, c(0.25, 0.5, 0.75), type = 7))
  q6 <- unname(quantile(x, c(0.25, 0.5, 0.75), type = 6))
  cases[[id]] <<- case(sprintf("mean(%1$s); sd(%1$s); quantile(%1$s, c(.25, .5, .75), type = 7 and 6)", name), "closed",
    list(n = length(x), mean = mean(x), sd = sd(x), se = sd(x) / sqrt(length(x)), min = min(x), max = max(x),
      q1Type7 = q7[1], medianType7 = q7[2], q3Type7 = q7[3], q1Type6 = q6[1], medianType6 = q6[2], q3Type6 = q6[3]),
    data = name, x = arr(x))
}
desc("quantiles", "quantiles", quantiles)
desc("two.g1", "two$g1", two$g1)
desc("two.g2", "two$g2", two$g2)
desc("three.C", "three$C", three$C)
desc("corr.x", "corr$x", corr$x)
x <- c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)
desc("odd11", "1:11", x)

# a few single quantiles away from the quartiles, both types
qs <- c(0, 0.05, 0.1, 0.9, 0.95, 1)
cases[["quantiles.tails"]] <- case("quantile(quantiles, c(0, .05, .1, .9, .95, 1), type = 7 and 6)", "closed",
  list(probs = arr(qs), type7 = arr(unname(quantile(quantiles, qs, type = 7))), type6 = arr(unname(quantile(quantiles, qs, type = 6)))),
  data = "quantiles")

rs_emit("descriptive", c("desc.summary"), cases)
