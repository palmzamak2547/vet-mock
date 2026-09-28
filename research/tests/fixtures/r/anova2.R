# Two-way ANOVA [M2-DESIGN.md 3.1.1]: Type III sums of squares by drop1() under sum-to-zero contrasts
# (SPSS UNIANOVA), Type II by model comparison, Tukey HSD on a main effect with the model's residual mean
# square. car::Anova (type 3 and type 2) must agree with the pin to 1e-10 or the script stops.
# packages: car
source("_common.R")
source("_data.R")
source("_data_m2.R")
rs_require("car")

old <- options(contrasts = c("contr.sum", "contr.poly"))
wb <- warpbreaks
wu <- warpbreaks[-c(1, 20, 37), ]

type3 <- function(d, label, drop) {
  fit <- lm(breaks ~ wool * tension, data = d)
  a <- drop1(fit, . ~ ., test = "F")
  ca <- car::Anova(fit, type = 3)
  stopifnot(isTRUE(all.equal(unname(ca[c("wool", "tension", "wool:tension"), "Sum Sq"]), unname(a[["Sum of Sq"]][-1]), tolerance = 1e-10)))
  ss <- a[["Sum of Sq"]][-1]; rss <- deviance(fit)
  case(sprintf("drop1(lm(breaks ~ wool * tension, data = %s), . ~ ., test = 'F') under contr.sum", label), "closed",
    list(effects = arr(c("wool", "tension", "wool:tension")), ss = arr(ss), df = arr(a[["Df"]][-1]), F = arr(a[["F value"]][-1]),
      p = arr(a[["Pr(>F)"]][-1]), residualSs = rss, residualDf = df.residual(fit), partialEtaSq = arr(ss / (ss + rss))),
    data = label, ssType = "III", interaction = TRUE, dropRows = arr(drop))
}

cases <- list()
cases[["typeIII.balanced"]] <- type3(wb, "warpbreaks", integer(0))
cases[["typeIII.unbalanced"]] <- type3(wu, "warpbreaks[-c(1, 20, 37), ]", c(1L, 20L, 37L))

# Type II by model comparison (treatment contrasts; the sums of squares do not depend on the coding).
options(contrasts = c("contr.treatment", "contr.poly"))
mf <- lm(breaks ~ wool * tension, data = wu); m0 <- lm(breaks ~ wool + tension, data = wu)
mA <- lm(breaks ~ tension, data = wu); mB <- lm(breaks ~ wool, data = wu)
ss2 <- c(deviance(mA) - deviance(m0), deviance(mB) - deviance(m0), deviance(m0) - deviance(mf))
df2 <- c(1, 2, 2); mse <- deviance(mf) / df.residual(mf); F2 <- ss2 / df2 / mse
p2 <- pf(F2, df2, df.residual(mf), lower.tail = FALSE)
ca2 <- car::Anova(mf, type = 2)
stopifnot(isTRUE(all.equal(unname(ca2[c("wool", "tension", "wool:tension"), "Sum Sq"]), ss2, tolerance = 1e-10)),
  isTRUE(all.equal(unname(ca2[c("wool", "tension", "wool:tension"), "Pr(>F)"]), p2, tolerance = 1e-10)))
cases[["typeII.unbalanced"]] <- case("model comparison on warpbreaks[-c(1, 20, 37), ]; car::Anova(type = 2) agrees", "closed",
  list(effects = arr(c("wool", "tension", "wool:tension")), ss = arr(ss2), df = arr(df2), F = arr(F2), p = arr(p2),
    residualSs = deviance(mf), residualDf = df.residual(mf), partialEtaSq = arr(ss2 / (ss2 + deviance(mf))),
    typeISsWool = anova(mf)[["Sum Sq"]][1]),
  data = "warpbreaks[-c(1, 20, 37), ]", ssType = "II", interaction = TRUE, dropRows = arr(c(1L, 20L, 37L)))

# Type III without the interaction term (interaction: false) on the balanced data.
options(contrasts = c("contr.sum", "contr.poly"))
fa <- lm(breaks ~ wool + tension, data = wb); aa <- drop1(fa, . ~ ., test = "F")
cases[["typeIII.additive"]] <- case("drop1(lm(breaks ~ wool + tension, data = warpbreaks), . ~ ., test = 'F')", "closed",
  list(effects = arr(c("wool", "tension")), ss = arr(aa[["Sum of Sq"]][-1]), df = arr(aa[["Df"]][-1]), F = arr(aa[["F value"]][-1]),
    p = arr(aa[["Pr(>F)"]][-1]), residualSs = deviance(fa), residualDf = df.residual(fa)),
  data = "warpbreaks", ssType = "III", interaction = FALSE, dropRows = arr(integer(0)))
options(old)

tk <- function(formula, which, label, interaction) {
  t <- TukeyHSD(aov(formula, data = warpbreaks), which)[[which]]
  case(label, "iterative", list(pairs = lapply(seq_len(nrow(t)), function(i) list(pair = rownames(t)[i], diff = t[i, "diff"],
    ci = ci_of(t[i, c("lwr", "upr")]), p = t[i, "p adj"]))), data = "warpbreaks", term = which, interaction = interaction, confLevel = 0.95)
}
cases[["tukey.additive.tension"]] <- tk(breaks ~ wool + tension, "tension", "TukeyHSD(aov(breaks ~ wool + tension), 'tension')", FALSE)
cases[["tukey.additive.wool"]] <- tk(breaks ~ wool + tension, "wool", "TukeyHSD(aov(breaks ~ wool + tension), 'wool')", FALSE)
cases[["tukey.interaction.tension"]] <- tk(breaks ~ wool * tension, "tension", "TukeyHSD(aov(breaks ~ wool * tension), 'tension')", TRUE)

# A disconnected layout (review round 2): housing a0/a1 on farms b0/b1 (all four cells), housing a2 only on
# farm b2. The additive model loses rank (full model rank 4, not 5), so each term's df is the rank it adds,
# not levels - 1: R's drop1 and anova print Df 1 for both factors. A 2x2 with only the diagonal cells is fully
# confounded: the second term adds no rank and R prints Df 0 with no F.
dsc <- data.frame(y = c(10.1, 11.3, 9.8, 12.0, 12.9, 13.4, 11.9, 12.2, 13.1, 14.2, 13.8, 15.0, 20.3, 19.1, 21.4, 20.0),
  a = factor(rep(c("a0", "a0", "a1", "a1", "a2"), c(3, 3, 3, 3, 4)), levels = c("a0", "a1", "a2")),
  b = factor(rep(c("b0", "b1", "b0", "b1", "b2"), c(3, 3, 3, 3, 4)), levels = c("b0", "b1", "b2")))
options(contrasts = c("contr.sum", "contr.poly"))
fd <- lm(y ~ a + b, data = dsc); dd <- drop1(fd, . ~ ., test = "F")
cases[["disconnected.typeIII"]] <- case("drop1(lm(y ~ a + b, data = disconnected), . ~ ., test = 'F') under contr.sum", "closed",
  list(effects = arr(c("a", "b")), ss = arr(dd[["Sum of Sq"]][-1]), df = arr(dd[["Df"]][-1]), F = arr(dd[["F value"]][-1]),
    p = arr(dd[["Pr(>F)"]][-1]), residualSs = deviance(fd), residualDf = df.residual(fd), rank = fd$rank),
  data = "disconnected", ssType = "III", interaction = FALSE)
options(contrasts = c("contr.treatment", "contr.poly"))
fd <- lm(y ~ a + b, data = dsc); mA <- lm(y ~ b, data = dsc); mB <- lm(y ~ a, data = dsc)
ssd <- c(deviance(mA) - deviance(fd), deviance(mB) - deviance(fd)); dfd <- c(fd$rank - mA$rank, fd$rank - mB$rank)
Fd <- ssd / dfd / (deviance(fd) / df.residual(fd))
cases[["disconnected.typeII"]] <- case("model comparison on the disconnected layout, df = rank(y ~ a + b) - rank(without the term)", "closed",
  list(effects = arr(c("a", "b")), ss = arr(ssd), df = arr(dfd), F = arr(Fd), p = arr(pf(Fd, dfd, df.residual(fd), lower.tail = FALSE)),
    residualSs = deviance(fd), residualDf = df.residual(fd)),
  data = "disconnected", ssType = "II", interaction = FALSE)
ad <- anova(fd)
cases[["disconnected.typeI"]] <- case("anova(lm(y ~ a + b, data = disconnected))", "closed",
  list(effects = arr(c("a", "b")), ss = arr(ad[["Sum Sq"]][1:2]), df = arr(ad[["Df"]][1:2]), F = arr(ad[["F value"]][1:2]),
    p = arr(ad[["Pr(>F)"]][1:2]), residualSs = deviance(fd), residualDf = df.residual(fd)),
  data = "disconnected", ssType = "I", interaction = FALSE)
cf <- data.frame(y = c(3.1, 2.9, 3.4, 5.2, 4.8, 5.5), a = factor(rep(c("x", "y"), each = 3)), b = factor(rep(c("p", "q"), each = 3)))
fc <- lm(y ~ a + b, data = cf); ac <- anova(fc)
cases[["confounded.typeI"]] <- case("anova(lm(y ~ a + b)) with b identical to a: b adds no rank", "closed",
  list(effects = arr(c("a")), ss = arr(ac[["Sum Sq"]][1]), df = arr(ac[["Df"]][1]), F = arr(ac[["F value"]][1]), p = arr(ac[["Pr(>F)"]][1]),
    residualSs = deviance(fc), residualDf = df.residual(fc), rank = fc$rank, aliased = arr(names(which(is.na(coef(fc)))))),
  data = "confounded", ssType = "I", interaction = FALSE)
options(old)

cm <- aggregate(breaks ~ wool + tension, data = warpbreaks, FUN = function(v) c(n = length(v), mean = mean(v), sd = sd(v)))
cases[["cellMeans.balanced"]] <- case("aggregate(breaks ~ wool + tension, warpbreaks, n / mean / sd)", "closed",
  list(wool = arr(as.character(cm$wool)), tension = arr(as.character(cm$tension)), n = arr(cm$breaks[, "n"]),
    mean = arr(cm$breaks[, "mean"]), sd = arr(cm$breaks[, "sd"])), data = "warpbreaks")

rs_emit("anova2", c("anova.twoWay"), cases, packages = "car",
  datasets = list(warpbreaks = list(breaks = arr(warpbreaks$breaks), wool = arr(as.character(warpbreaks$wool)),
    tension = arr(as.character(warpbreaks$tension)), woolLevels = arr(levels(warpbreaks$wool)), tensionLevels = arr(levels(warpbreaks$tension))),
    disconnected = list(y = arr(dsc$y), a = arr(as.character(dsc$a)), b = arr(as.character(dsc$b))),
    confounded = list(y = arr(cf$y), a = arr(as.character(cf$a)), b = arr(as.character(cf$b)))),
  notes = "Type III is drop1 under contr.sum (SPSS UNIANOVA); Type II by model comparison. car 3.1-5 Anova(type = 3) and Anova(type = 2) agree to 1e-10 (stopifnot in the script). Tukey rows are later level minus earlier, from ptukey/qtukey (iterative tolerance). Rows dropped for the unbalanced case are 1-based row numbers of warpbreaks.")
