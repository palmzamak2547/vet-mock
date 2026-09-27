# Multiplicity [M1-DESIGN.md 7.8]: p.adjust Holm (default) and Bonferroni, with NA left out of m.
# packages:
source("_common.R")

cases <- list()
sets <- list(
  course = c(0.01, 0.04, 0.03, 0.005),
  ties = c(0.02, 0.02, 0.5, 0.001, 0.2),
  big = c(0.3, 0.6, 0.9, 0.45),
  withNA = c(0.01, NA, 0.04, 0.03)
)
for (nm in names(sets)) {
  p <- sets[[nm]]
  cases[[nm]] <- case(sprintf("p.adjust(c(%s), method = 'holm' / 'bonferroni')", paste(ifelse(is.na(p), "NA", format(p)), collapse = ", ")), "closed",
    list(holm = arr(p.adjust(p, "holm")), bonferroni = arr(p.adjust(p, "bonferroni"))), p = arr(p))
}
rs_emit("padjust", c("adjust.pValues"), cases, notes = "NA stays NA (null here) and does not count toward m, as in p.adjust(n = length(p[!is.na(p)])).")
