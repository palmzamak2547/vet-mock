# Cronbach's alpha [M2-DESIGN.md 3.3.3] on `items` (made-up, twelve respondents x five Likert items): alpha
# k/(k - 1) (1 - sum item variances / variance of the total), standardized alpha from the mean inter-item
# correlation, alpha if an item is dropped, item-rest correlation, and the Feldt (1965) interval
# 1 - (1 - alpha) F(1 - a/2 or a/2; n - 1, (n - 1)(k - 1)). psych 2.6.5 alpha() must agree to 1e-10 or the
# script stops. Closed forms.
# packages: psych
source("_common.R")
source("_data_m2.R")
rs_require("psych")

alpha_of <- function(X) { k <- ncol(X); k / (k - 1) * (1 - sum(apply(X, 2, var)) / var(rowSums(X))) }
one <- function(X, label, data) {
  k <- ncol(X); n <- nrow(X); a <- alpha_of(X)
  R <- cor(X); rbar <- (sum(R) - k) / (k * (k - 1))
  dropped <- sapply(seq_len(k), function(j) alpha_of(X[, -j, drop = FALSE]))
  itemrest <- sapply(seq_len(k), function(j) cor(X[, j], rowSums(X[, -j, drop = FALSE])))
  df1 <- n - 1; df2 <- (n - 1) * (k - 1)
  feldt <- c(1 - (1 - a) * qf(0.975, df1, df2), 1 - (1 - a) * qf(0.025, df1, df2))
  ps <- suppressWarnings(suppressMessages(psych::alpha(as.data.frame(X), warnings = FALSE)))
  stopifnot(isTRUE(all.equal(ps$total$raw_alpha, a, tolerance = 1e-10)), isTRUE(all.equal(ps$total$std.alpha, k * rbar / (1 + (k - 1) * rbar), tolerance = 1e-10)),
    isTRUE(all.equal(unname(ps$alpha.drop$raw_alpha), dropped, tolerance = 1e-10)), isTRUE(all.equal(unname(ps$item.stats$r.drop), itemrest, tolerance = 1e-10)),
    isTRUE(all.equal(unname(unlist(ps$feldt[c("lower.ci", "upper.ci")])), feldt, tolerance = 1e-10)))
  case(label, "closed", list(k = k, n = n, alpha = a, standardized = k * rbar / (1 + (k - 1) * rbar), meanInterItemR = rbar,
    feldtLower = feldt[1], feldtUpper = feldt[2], alphaIfDropped = arr(dropped), itemRest = arr(itemrest),
    itemMean = arr(unname(colMeans(X))), itemSd = arr(unname(apply(X, 2, sd)))), data = data, confLevel = 0.95)
}
cases <- list()
cases[["items"]] <- one(items, "alpha on items; psych::alpha agrees", "items")
cases[["items.firstThree"]] <- one(items[, 1:3], "alpha on items[, 1:3]; psych::alpha agrees", "items[, 1:3]")

rs_emit("cronbach", c("rel.cronbach"), cases, packages = "psych",
  datasets = list(items = items),
  notes = "Made-up data (ข้อมูลสมมุติ / made-up data). Base R formulas; psych 2.6.5 alpha() agrees to 1e-10 for alpha, standardized alpha, alpha if dropped, item-rest r and the Feldt bounds (stopifnot).")
