# One-way ANOVA and post hoc [M1-DESIGN.md 7.7]: summary(aov()), TukeyHSD() (Tukey-Kramer for
# unequal n; rows are later level minus earlier) and pairwise.t.test() with pooled SD and Holm or
# Bonferroni adjustment.
# packages:
source("_common.R")
source("_data.R")

cases <- list()
fit <- aov(y ~ g, data = three_long)
s <- summary(fit)[[1]]
cases[["anova1.three"]] <- case("summary(aov(y ~ g, data = three_long))", "closed",
  list(F = s$`F value`[1], df1 = s$Df[1], df2 = s$Df[2], p = s$`Pr(>F)`[1], ssBetween = s$`Sum Sq`[1], ssWithin = s$`Sum Sq`[2],
    msWithin = s$`Mean Sq`[2], means = arr(unname(tapply(three_long$y, three_long$g, mean))), ns = arr(unname(as.numeric(table(three_long$g))))),
  data = "three")

tk <- TukeyHSD(fit, conf.level = 0.95)$g
pairs <- lapply(seq_len(nrow(tk)), function(i) list(pair = rownames(tk)[i], diff = tk[i, "diff"], ci = ci_of(tk[i, c("lwr", "upr")]), p = tk[i, "p adj"]))
cases[["tukey.three"]] <- case("TukeyHSD(aov(y ~ g, data = three_long))", "iterative", list(pairs = pairs), data = "three", confLevel = 0.95)
tk90 <- TukeyHSD(fit, conf.level = 0.9)$g
cases[["tukey.three.90"]] <- case("TukeyHSD(aov(y ~ g, data = three_long), conf.level = 0.9)", "iterative",
  list(pairs = lapply(seq_len(nrow(tk90)), function(i) list(pair = rownames(tk90)[i], diff = tk90[i, "diff"], ci = ci_of(tk90[i, c("lwr", "upr")]), p = tk90[i, "p adj"]))),
  data = "three", confLevel = 0.9)

for (m in c("holm", "bonferroni", "none")) {
  pw <- pairwise.t.test(three_long$y, three_long$g, p.adjust.method = m, pool.sd = TRUE)$p.value
  cases[[paste0("pairwiseT.", m)]] <- case(sprintf("pairwise.t.test(three_long$y, three_long$g, p.adjust.method = '%s')", m), "closed",
    list(`B-A` = pw["B", "A"], `C-A` = pw["C", "A"], `C-B` = pw["C", "B"]), data = "three", method = m)
}

# a second, four-group set with a clearly null result
four <- data.frame(y = c(5.1, 4.8, 5.3, 5.0, 4.9, 5.2, 5.0, 4.7, 5.4, 5.1, 4.9, 5.0, 5.2, 4.8, 5.1, 5.3),
  g = factor(rep(c("W", "X", "Y", "Z"), each = 4)))
s4 <- summary(aov(y ~ g, data = four))[[1]]
cases[["anova1.four"]] <- case("summary(aov(y ~ g, data = four))", "closed",
  list(F = s4$`F value`[1], df1 = s4$Df[1], df2 = s4$Df[2], p = s4$`Pr(>F)`[1]),
  groups = list(W = arr(four$y[1:4]), X = arr(four$y[5:8]), Y = arr(four$y[9:12]), Z = arr(four$y[13:16])))

rs_emit("anova", c("test.anova1", "posthoc.tukey"), cases,
  notes = "Tukey p-values and intervals use ptukey/qtukey (numerical integration), so they compare at the iterative tolerance. R computes the Tukey upper tail as 1 - ptukey (M1-DESIGN.md A8).")
