# Bland-Altman agreement [M2-DESIGN.md 3.3.2] on pefr (Bland and Altman 1986, Lancet 327(8476):307-10, Table 1,
# first reading of each meter; checked against MethComp::PEFR in sources.R). Base R formulas: mean difference
# with its t interval, SD, limits mean -/+ m SD for m = 1.96 and 2, the approximate SE of a limit
# sqrt(3 s^2 / n) and its t interval (1986, 1999), proportional bias as lm(difference ~ mean), the percent
# scale 100 (A - B) / mean and the ratio scale on logs, back-transformed. Closed forms.
# packages:
source("_common.R")
source("_data_m2.R")

wr <- pefr$wright; mw <- pefr$mini
d <- wr - mw; n <- length(d); md <- mean(d); s <- sd(d); tq <- qt(0.975, n - 1); se_l <- sqrt(3 * s^2 / n)
lim <- function(mult) md + c(-1, 1) * mult * s
cases <- list()
lo <- md - 1.96 * s; hi <- md + 1.96 * s
cases[["absolute.196"]] <- case("A - B (Wright minus mini Wright); limits mean -/+ 1.96 SD", "closed",
  list(n = n, meanDifference = md, meanLower = md - tq * s / sqrt(n), meanUpper = md + tq * s / sqrt(n), sd = s,
    loaLower = lo, loaUpper = hi, loaSe = se_l, loaLowerCiLower = lo - tq * se_l, loaLowerCiUpper = lo + tq * se_l,
    loaUpperCiLower = hi - tq * se_l, loaUpperCiUpper = hi + tq * se_l), data = "pefr", scale = "absolute", loaMultiplier = 1.96)
cases[["absolute.2"]] <- case("limits mean -/+ 2 SD (the 1986 paper)", "closed",
  list(loaLower = lim(2)[1], loaUpper = lim(2)[2], loaLowerCiLower = lim(2)[1] - tq * se_l, loaLowerCiUpper = lim(2)[1] + tq * se_l,
    loaUpperCiLower = lim(2)[2] - tq * se_l, loaUpperCiUpper = lim(2)[2] + tq * se_l), data = "pefr", scale = "absolute", loaMultiplier = 2)
mm <- (wr + mw) / 2; pb <- summary(lm(d ~ mm))$coefficients
cases[["proportionalBias"]] <- case("summary(lm((A - B) ~ (A + B)/2))", "closed",
  list(slope = pb[2, 1], intercept = pb[1, 1], slopeSe = pb[2, 2], t = pb[2, 3], df = n - 2, p = pb[2, 4]), data = "pefr")
dp <- 100 * (wr - mw) / mm
cases[["percent.196"]] <- case("100 (A - B) / ((A + B)/2); limits mean -/+ 1.96 SD", "closed",
  list(meanDifference = mean(dp), sd = sd(dp), loaLower = mean(dp) - 1.96 * sd(dp), loaUpper = mean(dp) + 1.96 * sd(dp),
    loaSe = sqrt(3 * sd(dp)^2 / n)), data = "pefr", scale = "percent", loaMultiplier = 1.96)
lr <- log(wr / mw)
cases[["ratio.196"]] <- case("log(A / B); exp(mean -/+ 1.96 SD)", "closed",
  list(ratio = exp(mean(lr)), loaLower = exp(mean(lr) - 1.96 * sd(lr)), loaUpper = exp(mean(lr) + 1.96 * sd(lr)),
    logMean = mean(lr), logSd = sd(lr)), data = "pefr", scale = "ratio", loaMultiplier = 1.96)

rs_emit("blandaltman", c("agree.blandAltman"), cases,
  datasets = list(pefr = list(wright = arr(wr), mini = arr(mw))),
  notes = "The paper prints mean difference -2.1 and SD 38.8, and limits -79.7 and 75.5 from those rounded numbers with multiplier 2. The limit SE is the approximate sqrt(3 s^2 / n) with t on n - 1 df (Bland and Altman 1986, 1999).")
