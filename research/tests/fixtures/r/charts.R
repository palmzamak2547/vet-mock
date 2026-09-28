# Pins for the chart kit's two statistics helpers [M2-DESIGN.md 8.2]: the violin bandwidth bw.nrd0 (closed)
# and R's density() at its own 512-point grid (R bins the data and uses an FFT; the kit evaluates the kernel
# directly, so the density compares within 1e-3 absolute, the design's bound); the scatter's 95% confidence
# band of the mean, predict(lm(y ~ x), interval = 'confidence') on `corr` (closed).
# packages:
source("_common.R")
source("_data.R")
source("_data_m2.R")

cases <- list()
bw <- function(x, label, data) case(label, "closed", list(bw = bw.nrd0(x)), data = data, x = arr(x))
cases[["bw.two.g1"]] <- bw(two$g1, "bw.nrd0(two$g1)", "two$g1")
cases[["bw.three"]] <- bw(three_long$y, "bw.nrd0(three y, all groups)", "three")
cases[["bw.three.A"]] <- bw(three$A, "bw.nrd0(three$A)", "three$A")
cases[["bw.roundingTimes"]] <- bw(as.vector(t(rounding_times)), "bw.nrd0(RoundingTimes, all 66 values in row order)", "roundingTimes")
cases[["bw.roundingTimes1"]] <- bw(unname(rounding_times[, 1]), "bw.nrd0(RoundingTimes[, 1])", "roundingTimes[, 1]")
cases[["bw.zeroIqr"]] <- bw(c(1, 5, 5, 5, 5, 5, 9), "bw.nrd0 when the IQR is 0 (falls back to the SD)", "made-up")

den <- function(x, label, data) {
  d <- density(x)
  case(label, "density", list(bw = d$bw, x = arr(d$x), y = arr(d$y)), data = data, input = arr(x), n = 512L, cut = 3,
    closedValues = arr(c("bw", "x")))
}
cases[["density.two.g1"]] <- den(two$g1, "density(two$g1)", "two$g1")
cases[["density.three"]] <- den(three_long$y, "density(three y)", "three")

fit <- lm(y ~ x, data = as.data.frame(corr))
at <- c(1.2, 3, 5.5, 8, 10.5)
pd <- predict(fit, interval = "confidence", level = 0.95)
pg <- predict(fit, newdata = data.frame(x = at), interval = "confidence", level = 0.95)
cases[["band.corr"]] <- case("predict(lm(y ~ x, data = corr), interval = 'confidence')", "closed",
  list(fit = arr(unname(pd[, "fit"])), lower = arr(unname(pd[, "lwr"])), upper = arr(unname(pd[, "upr"])),
    at = arr(at), fitAt = arr(unname(pg[, "fit"])), lowerAt = arr(unname(pg[, "lwr"])), upperAt = arr(unname(pg[, "upr"]))),
  data = "corr", confLevel = 0.95)

rs_emit("charts", character(0), cases,
  notes = "Not a method pin: the chart kit (graphs role) reads these. density() bins onto 512 points and convolves by FFT; a kernel evaluated directly agrees within 1e-3 absolute at R's grid (tol 'density'). Datasets two, three, corr are M1-DESIGN.md section 7's.")
