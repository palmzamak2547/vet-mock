# Ordinary least squares [M1-DESIGN.md 7.11] by lm (QR): simple regression on `corr`, and a one-way
# model on `three` with treatment contrasts against level A. NIST StRD certified values are the other
# pin (research/tests/fixtures/published/nist/).
# packages:
source("_common.R")
source("_data.R")

cases <- list()
lmcase <- function(id, call, fit, extra) {
  s <- summary(fit)
  co <- coef(s)
  f <- s$fstatistic
  vals <- list(terms = arr(rownames(co)), coef = arr(unname(co[, 1])), se = arr(unname(co[, 2])), t = arr(unname(co[, 3])), p = arr(unname(co[, 4])),
    df = fit$df.residual, sigma = s$sigma, r2 = s$r.squared, adjR2 = s$adj.r.squared,
    F = unname(f[1]), pF = unname(pf(f[1], f[2], f[3], lower.tail = FALSE)))
  cases[[id]] <<- do.call(case, c(list(call, "closed", vals), extra))
}
lmcase("simple.corr", "summary(lm(y ~ x, data = corr))", lm(y ~ x, data = as.data.frame(corr)), list(data = "corr"))
lmcase("oneway.three", "summary(lm(y ~ g, data = three_long))  (treatment contrasts, reference A)", lm(y ~ g, data = three_long), list(data = "three", reference = "A"))
lmcase("noIntercept.corr", "summary(lm(y ~ x - 1, data = corr))", lm(y ~ x - 1, data = as.data.frame(corr)), list(data = "corr", intercept = FALSE))

rs_emit("ols", c("reg.ols"), cases,
  notes = "R's R^2 without an intercept is computed against 0 (uncentred), as summary.lm does.")
