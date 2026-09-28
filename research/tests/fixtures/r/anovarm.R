# Repeated-measures ANOVA, one within factor with or without one between factor [M2-DESIGN.md 3.1.2]:
# summary(aov(y ~ time + Error(subj/time))), anova(lm(W ~ ...), X = ~1, test = 'Spherical') (anova.mlm) for
# the corrected p-values, mauchly.test, and the epsilons written out as anova.mlm computes them (GG from
# the eigenvalues of the orthonormal-contrast covariance; HF = ((n + 1) p GG - 2) / (p (n - p GG)) with n the
# residual df, which is the Lecoutre 1991 correction with a between factor). car::Anova on the same mlm must
# give the same Greenhouse-Geisser epsilon or the script stops. Data `rm` (made-up).
# packages: car
source("_common.R")
source("_data_m2.R")
rs_require("car")

eps <- function(fit) {
  S <- estVar(fit); p <- ncol(S) - 1
  Tm <- contr.helmert(ncol(S)); Tm <- Tm %*% diag(1 / sqrt(colSums(Tm^2)))
  lam <- eigen(t(Tm) %*% S %*% Tm, only.values = TRUE, symmetric = TRUE)$values
  gg <- sum(lam)^2 / (p * sum(lam^2)); n <- fit$df.residual
  c(gg = gg, hf = ((n + 1) * p * gg - 2) / (p * (n - p * gg)))
}
carGG <- function(fit) {
  a <- car::Anova(fit, idata = data.frame(time = factor(paste0("T", 1:4))), idesign = ~time, type = 3)
  s <- summary(a, multivariate = FALSE)
  unname(s$pval.adjustments[, "GG eps"])
}

cases <- list()
s1 <- summary(aov(y ~ time + Error(subj / time), data = rm_long))
st <- s1[["Error: subj:time"]][[1]]; ss <- s1[["Error: subj"]][[1]]
f1 <- lm(rm_wide ~ 1)
e1 <- eps(f1)
stopifnot(isTRUE(all.equal(carGG(f1)[1], unname(e1["gg"]), tolerance = 1e-10)))
sp1 <- anova(f1, X = ~1, test = "Spherical")
mt1 <- mauchly.test(f1, X = ~1)
cases[["oneWay"]] <- case("summary(aov(y ~ time + Error(subj/time), data = rm_long)); anova(lm(W ~ 1), X = ~1, test = 'Spherical'); mauchly.test", "closed",
  list(timeF = st[["F value"]][1], timeDf1 = st[["Df"]][1], timeDf2 = st[["Df"]][2], timeP = st[["Pr(>F)"]][1],
    ssTime = st[["Sum Sq"]][1], ssError = st[["Sum Sq"]][2], ssSubjects = ss[["Sum Sq"]][1], dfSubjects = ss[["Df"]][1],
    epsGG = unname(e1["gg"]), epsHF = unname(e1["hf"]), timePGG = sp1[["G-G Pr"]][1], timePHF = sp1[["H-F Pr"]][1],
    mauchlyW = unname(mt1$statistic), mauchlyP = mt1$p.value),
  data = "rm", iterativeValues = arr(c("epsGG", "epsHF", "timePGG", "timePHF", "mauchlyW", "mauchlyP")))

s2 <- summary(aov(y ~ grp * time + Error(subj / time), data = rm_long))
b <- s2[["Error: subj"]][[1]]; w <- s2[["Error: subj:time"]][[1]]
f2 <- lm(rm_wide ~ rm_group)
e2 <- eps(f2)
stopifnot(isTRUE(all.equal(carGG(f2)[1], unname(e2["gg"]), tolerance = 1e-10)))
sp2 <- anova(f2, X = ~1, test = "Spherical")
mt2 <- mauchly.test(f2, X = ~1)
cases[["splitPlot"]] <- case("summary(aov(y ~ grp * time + Error(subj/time), data = rm_long)); anova(lm(W ~ grp), X = ~1, test = 'Spherical'); mauchly.test", "closed",
  list(groupF = b[["F value"]][1], groupDf1 = b[["Df"]][1], groupDf2 = b[["Df"]][2], groupP = b[["Pr(>F)"]][1],
    timeF = w[["F value"]][1], timeDf1 = w[["Df"]][1], groupTimeF = w[["F value"]][2], groupTimeDf1 = w[["Df"]][2], withinDf2 = w[["Df"]][3],
    timeP = w[["Pr(>F)"]][1], groupTimeP = w[["Pr(>F)"]][2],
    ssGroup = b[["Sum Sq"]][1], ssSubjects = b[["Sum Sq"]][2], ssTime = w[["Sum Sq"]][1], ssGroupTime = w[["Sum Sq"]][2], ssError = w[["Sum Sq"]][3],
    epsGG = unname(e2["gg"]), epsHF = unname(e2["hf"]),
    timePGG = sp2[["G-G Pr"]][1], groupTimePGG = sp2[["G-G Pr"]][2], timePHF = sp2[["H-F Pr"]][1], groupTimePHF = sp2[["H-F Pr"]][2],
    mauchlyW = unname(mt2$statistic), mauchlyP = mt2$p.value),
  data = "rm", iterativeValues = arr(c("epsGG", "epsHF", "timePGG", "groupTimePGG", "timePHF", "groupTimePHF", "mauchlyW", "mauchlyP")))

# means table: per time and group, mean with its 95% t interval (one-sample t on the animals in the cell)
mt <- do.call(rbind, lapply(levels(rm_long$time), function(tm) do.call(rbind, lapply(levels(rm_long$grp), function(g) {
  v <- rm_long$y[rm_long$time == tm & rm_long$grp == g]; ci <- t.test(v)$conf.int
  data.frame(time = tm, grp = g, n = length(v), mean = mean(v), sd = sd(v), lower = ci[1], upper = ci[2])
}))))
cases[["means"]] <- case("mean and t.test(v)$conf.int per time and group", "closed",
  list(time = arr(mt$time), group = arr(mt$grp), n = arr(mt$n), mean = arr(mt$mean), sd = arr(mt$sd), lower = arr(mt$lower), upper = arr(mt$upper)), data = "rm")

rs_emit("anovarm", c("anova.repeated"), cases, packages = "car",
  datasets = list(rm = list(wide = rm_wide, group = arr(as.character(rm_group)), times = arr(colnames(rm_wide)))),
  notes = "Made-up data rm (ข้อมูลสมมุติ / made-up data). The Huynh-Feldt epsilon is printed uncapped (1.106 in the one-way case); anova.mlm caps it at 1 for its H-F p-value, which then equals the uncorrected p up to rounding. Epsilons, corrected p-values and Mauchly's test come from an eigen decomposition and compare at the iterative tolerance. car 3.1-5 gives the same Greenhouse-Geisser epsilon (stopifnot); its Huynh-Feldt epsilon is not the pin.")
