# Repeated-measures ANOVA with two within factors, without and with one between factor [M3-DESIGN.md 3.1.5].
# anova.mlm with idata and M/X formulas gives each within effect's F, its Greenhouse-Geisser and Huynh-Feldt p-values
# (H-F epsilon capped at 1 for the p-value), mauchly.test the sphericity test per effect. The epsilons are written out
# per effect from the orthonormal contrasts of that effect (phase contrasts averaged over hour, and so on): GG from
# the eigenvalues, HF = ((n + 1) p GG - 2) / (p (n - p GG)) with n the residual df, as M2's one-factor method.
# car::Anova on the same mlm must give the same Greenhouse-Geisser epsilons (stopifnot) and supplies the sums of
# squares. Data: OBrienKaiser (car; O'Brien and Kaiser 1985), within factors phase (pre, post, fup) x hour (1-5),
# between factor treatment (control, A, B); gender is not used.
# packages: car
source("_common.R")
rs_require("car")

ok <- OBrienKaiser
Y <- as.matrix(ok[, 3:17])
idata <- data.frame(phase = factor(rep(c("pre", "post", "fup"), each = 5), levels = c("pre", "post", "fup")),
                    hour = factor(rep(1:5, 3)))
oc <- function(k) { m <- contr.helmert(k); m %*% diag(1 / sqrt(colSums(m^2))) }
av <- function(k) matrix(1 / sqrt(k), k, 1)
effects <- list(
  phase = list(M = ~phase, X = ~1, C = kronecker(oc(3), av(5))),
  hour = list(M = ~phase + hour, X = ~phase, C = kronecker(av(3), oc(5))),
  phaseHour = list(M = ~phase * hour, X = ~phase + hour, C = kronecker(oc(3), oc(5))))
eps <- function(fit, C) {
  S <- estVar(fit); lam <- eigen(t(C) %*% S %*% C, only.values = TRUE, symmetric = TRUE)$values
  p <- ncol(C); gg <- sum(lam)^2 / (p * sum(lam^2)); n <- fit$df.residual
  c(gg = gg, hf = ((n + 1) * p * gg - 2) / (p * (n - p * gg)))
}
carTab <- function(fit) {
  a <- car::Anova(fit, idata = idata, idesign = ~phase * hour, type = 3)
  summary(a, multivariate = FALSE)
}
run <- function(fit, between) {
  s <- carTab(fit); u <- s$univariate.tests; adj <- s$pval.adjustments; sph <- s$sphericity.tests
  out <- list()
  for (nm in names(effects)) {
    e <- effects[[nm]]
    a <- anova(fit, M = e$M, X = e$X, idata = idata, test = "Spherical")
    mt <- mauchly.test(fit, M = e$M, X = e$X, idata = idata)
    ep <- eps(fit, e$C)
    carName <- c(phase = "phase", hour = "hour", phaseHour = "phase:hour")[[nm]]
    stopifnot(isTRUE(all.equal(unname(adj[carName, "GG eps"]), unname(ep["gg"]), tolerance = 1e-10)))
    row <- list(F = a$F[1], df1 = a$`num Df`[1], df2 = a$`den Df`[1], p = a$`Pr(>F)`[1], pGG = a$`G-G Pr`[1], pHF = a$`H-F Pr`[1],
                epsGG = unname(ep["gg"]), epsHF = unname(ep["hf"]), mauchlyW = unname(mt$statistic), mauchlyP = mt$p.value,
                ss = unname(u[carName, "Sum Sq"]), ssError = unname(u[carName, "Error SS"]))
    if (between) {
      bn <- paste0("treatment:", carName)
      row <- c(row, list(byF = a$F[2], byDf1 = a$`num Df`[2], byP = a$`Pr(>F)`[2], byPGG = a$`G-G Pr`[2], byPHF = a$`H-F Pr`[2],
                         bySs = unname(u[bn, "Sum Sq"])))
    }
    out[[nm]] <- row
  }
  if (between) {
    b <- anova(fit, M = ~1, X = ~0, idata = idata, test = "Spherical")
    out[["treatment"]] <- list(F = b$F[2], df1 = b$`num Df`[2], df2 = b$`den Df`[2], p = b$`Pr(>F)`[2],
                               ss = unname(u["treatment", "Sum Sq"]), ssError = unname(u["treatment", "Error SS"]))
  }
  out
}
cases <- list()
cases[["withinOnly"]] <- case("anova(lm(Y ~ 1), M, X, idata, test = 'Spherical'); mauchly.test; car::Anova type 3 sums of squares", "iterative",
  run(lm(Y ~ 1), FALSE), data = "OBrienKaiser")
old_contrasts <- options(contrasts = c("contr.sum", "contr.poly"))
treatment <- ok$treatment
cases[["withBetween"]] <- case("anova(lm(Y ~ treatment), M, X, idata, test = 'Spherical'); sum contrasts", "iterative",
  run(lm(Y ~ treatment), TRUE), data = "OBrienKaiser")
options(old_contrasts)  # the webR runner shares one session across the scripts: later fixtures must see the default contrasts

rs_emit("anovarm2", c("anova.repeated"), cases, packages = "car",
  datasets = list(OBrienKaiser = list(treatment = arr(as.character(ok$treatment)), columns = arr(colnames(Y)), values = unname(Y),
                                      phase = arr(as.character(idata$phase)), hour = arr(as.character(idata$hour)))),
  notes = "Each within effect is tested on its own orthonormal contrasts (phase averaged over hour, hour averaged over phase, and their product). The Huynh-Feldt epsilon is printed uncapped; anova.mlm caps it at 1 for its H-F p-value. Epsilons and corrected p-values compare at the iterative tolerance.")
