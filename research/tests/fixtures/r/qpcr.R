# qPCR relative quantification [M3-DESIGN.md 3.1.3]. One framework for both methods (Hellemans et al. 2007, Genome
# Biol 8:R19): per sample log2 NRQ = -Ct_target log2 E_target + mean_i(Ct_ref_i log2 E_ref_i), the reference genes
# combined by their geometric mean (Vandesompele et al. 2002, Genome Biol 3:research0034). With every E = 2 this is
# -dCt of Livak and Schmittgen 2001 (Methods 25:402). Groups compared on log2 NRQ (dCt) with Welch's t-test (Yuan et
# al. 2006, BMC Bioinformatics 7:85); the difference is -ddCt, its interval exponentiated base 2 gives the fold change.
# Efficiency from a dilution series: lm(Ct ~ log10 input), E = 10^(-1/slope), the interval from the slope's.
# Data qpcr, dilution (made-up).
source("_common.R")
source("_data_m3.R")

lnrq <- function(E) -qpcr$target * log2(E[["target"]]) + (qpcr$gapdh * log2(E[["gapdh"]]) + qpcr$actb * log2(E[["actb"]])) / 2
g <- factor(qpcr$group, levels = c("control", "treated"))
one <- function(v, label) {
  tt <- t.test(v[g == "treated"], v[g == "control"])
  d <- unname(tt$estimate[1] - tt$estimate[2])
  list(perSample = arr(v), diff = d, lower = tt$conf.int[1], upper = tt$conf.int[2], t = unname(tt$statistic), df = unname(tt$parameter), p = tt$p.value,
       fold = 2^d, foldLower = 2^tt$conf.int[1], foldUpper = 2^tt$conf.int[2])
}
cases <- list()
liv <- one(lnrq(c(target = 2, gapdh = 2, actb = 2)), "livak")
dct <- qpcr$target - (qpcr$gapdh + qpcr$actb) / 2
stopifnot(isTRUE(all.equal(liv$perSample[[1]], -dct)))
cases[["livak"]] <- case("log2 NRQ with E = 2 (-dCt, references by mean Ct); t.test(treated, control)", "closed",
  c(liv, list(dCt = arr(dct), ddCt = -liv$diff)), data = "qpcr")
cases[["pfaffl"]] <- case("log2 NRQ with E = (1.94, 1.98, 2.02); t.test(treated, control)", "closed", one(lnrq(qpcr_eff), "pfaffl"), data = "qpcr")
cases[["livakOneReference"]] <- case("-dCt against GAPDH only; t.test(treated, control)", "closed",
  one(-(qpcr$target - qpcr$gapdh), "gapdh"), data = "qpcr")

fit <- lm(ct ~ log10input, data = dilution)
s <- coef(fit)[["log10input"]]; ci <- confint(fit)["log10input", ]
cases[["efficiency"]] <- case("lm(ct ~ log10input); E = 10^(-1/slope); interval from confint(slope)", "closed",
  list(slope = s, intercept = coef(fit)[["(Intercept)"]], slopeLower = ci[[1]], slopeUpper = ci[[2]], r2 = summary(fit)$r.squared,
       e = 10^(-1 / s), eLower = 10^(-1 / ci[[1]]), eUpper = 10^(-1 / ci[[2]]), percent = (10^(-1 / s) - 1) * 100),
  data = "dilution")

rs_emit("qpcr", c("qpcr.relative", "qpcr.efficiency"), cases,
  datasets = list(qpcr = list(group = arr(qpcr$group), target = arr(qpcr$target), gapdh = arr(qpcr$gapdh), actb = arr(qpcr$actb),
                              efficiency = list(target = 1.94, gapdh = 1.98, actb = 2.02)),
                  dilution = list(log10input = arr(dilution$log10input), ct = arr(dilution$ct))),
  notes = "Made-up data qpcr and dilution (ข้อมูลสมมุติ / made-up data). The efficiency's interval maps the slope's interval through 10^(-1/slope), which is increasing for a negative slope.")
