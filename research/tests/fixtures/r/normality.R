# Diagnostics [M2-DESIGN.md 3.1.5]: shapiro.test (Royston 1995, AS R94), qqnorm's theoretical quantiles
# (ppoints(n): (i - 3/8)/(n + 1/4) for n <= 10, else (i - 1/2)/n), Brown-Forsythe (Levene on absolute
# deviations from the group median) and the classic Levene (from the mean). car::leveneTest must agree with
# both to 1e-10 or the script stops.
# packages: car
source("_common.R")
source("_data.R")
source("_data_m2.R")
rs_require("car")

cases <- list()
sw <- function(x, label, data) {
  s <- shapiro.test(x)
  case(label, "iterative", list(W = unname(s$statistic), p = s$p.value, n = length(x)), data = data, x = arr(x))
}
cases[["shapiro.two.g1"]] <- sw(two$g1, "shapiro.test(two$g1)", "two$g1")
cases[["shapiro.two.g2"]] <- sw(two$g2, "shapiro.test(two$g2)", "two$g2")
cases[["shapiro.quantiles"]] <- sw(quantiles, "shapiro.test(quantiles) (with ties)", "quantiles")
res <- unname(residuals(lm(y ~ g, data = three_long)))
cases[["shapiro.three.residuals"]] <- sw(res, "shapiro.test(residuals(lm(y ~ g, data = three_long)))", "three residuals")
cases[["shapiro.n3"]] <- sw(c(1, 2, 4), "shapiro.test(c(1, 2, 4)) (the exact n = 3 branch)", "n3")
cases[["shapiro.roundingTimes1"]] <- sw(unname(rounding_times[, 1]), "shapiro.test(RoundingTimes[, 1]) (n = 22, the n >= 12 polynomial)", "roundingTimes[, 1]")
x11 <- c(3.1, 2.4, 5.6, 4.4, 3.9, 4.1, 2.8, 3.3, 6.0, 4.7, 3.6)
cases[["shapiro.n11"]] <- sw(x11, "shapiro.test(x) with n = 11 (the 4 <= n <= 11 polynomial)", "n11")

qq <- function(x, label, data) {
  q <- qqnorm(x, plot.it = FALSE)
  case(label, "closed", list(theoretical = arr(q$x), sample = arr(q$y)), data = data, x = arr(x))
}
cases[["qq.two.g1"]] <- qq(two$g1, "qqnorm(two$g1, plot.it = FALSE)", "two$g1")
cases[["qq.roundingTimes1"]] <- qq(unname(rounding_times[, 1]), "qqnorm(RoundingTimes[, 1], plot.it = FALSE) (n > 10: (i - 1/2)/n, ties ranked in order)", "roundingTimes[, 1]")

lev <- function(center, label) {
  dev <- abs(three_long$y - ave(three_long$y, three_long$g, FUN = center))
  a <- anova(lm(dev ~ three_long$g))
  cl <- car::leveneTest(y ~ g, data = three_long, center = center)
  stopifnot(isTRUE(all.equal(cl[["F value"]][1], a[["F value"]][1], tolerance = 1e-10)))
  case(label, "closed", list(F = a[["F value"]][1], df1 = a[["Df"]][1], df2 = a[["Df"]][2], p = a[["Pr(>F)"]][1]), data = "three")
}
cases[["brownForsythe.three"]] <- lev(median, "anova(lm(|y - group median| ~ g)); car::leveneTest(center = median) agrees")
cases[["levene.three"]] <- lev(mean, "anova(lm(|y - group mean| ~ g)); car::leveneTest(center = mean) agrees")

# Two-way layout (warpbreaks, Tippett 1950): the residuals of aov(breaks ~ wool * tension) are each value minus
# its cell mean, and car::leveneTest(breaks ~ wool * tension) compares the six cells' spread. Added by the
# integrator for the diagnostics panel beside a two-way ANOVA [M2-DESIGN.md 3.1.5].
wb <- datasets::warpbreaks
wres <- unname(residuals(aov(breaks ~ wool * tension, data = wb)))
stopifnot(isTRUE(all.equal(wres, wb$breaks - ave(wb$breaks, wb$wool, wb$tension), tolerance = 1e-12)))
cases[["shapiro.warpbreaks.cells"]] <- sw(wres, "shapiro.test(residuals(aov(breaks ~ wool * tension, warpbreaks)))", "warpbreaks residuals")
lev2 <- function(center, label) {
  cell <- interaction(wb$wool, wb$tension)
  dev <- abs(wb$breaks - ave(wb$breaks, cell, FUN = center))
  a <- anova(lm(dev ~ cell))
  cl <- car::leveneTest(breaks ~ wool * tension, data = wb, center = center)
  stopifnot(isTRUE(all.equal(cl[["F value"]][1], a[["F value"]][1], tolerance = 1e-10)))
  case(label, "closed", list(F = a[["F value"]][1], df1 = a[["Df"]][1], df2 = a[["Df"]][2], p = a[["Pr(>F)"]][1]), data = "warpbreaks")
}
cases[["brownForsythe.warpbreaks.cells"]] <- lev2(median, "car::leveneTest(breaks ~ wool * tension, center = median): the six cells")

rs_emit("normality", c("diag.shapiro", "diag.brownForsythe"), cases, packages = "car",
  datasets = list(roundingTimes1 = arr(unname(rounding_times[, 1]))),
  notes = "Shapiro-Wilk p-values come from Royston's polynomial approximations (iterative tolerance). Q-Q points are qnorm(ppoints(n))[order(order(x))], in the order of the data. car 3.1-5 leveneTest agrees with both centres to 1e-10 (stopifnot).")
