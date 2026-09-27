# Correlation [M1-DESIGN.md 7.10]: cor.test Pearson (t test and Fisher z interval) and Spearman
# (exact AS 89 through prho when n < 1290 and no ties; the t approximation when there are ties).
# packages:
source("_common.R")
source("_data.R")

cases <- list()
p <- cor.test(corr$x, corr$y)
cases[["pearson.corr"]] <- case("cor.test(corr$x, corr$y)", "closed",
  list(r = unname(p$estimate), t = unname(p$statistic), df = unname(p$parameter), p = p$p.value, ci = ci_of(p$conf.int[1:2])), data = "corr")
y2 <- c(26.1, 24, 28.2, 25, 29.1, 30, 27.3, 26)
p2 <- cor.test(two$g1, y2, conf.level = 0.9)
cases[["pearson.weak.90"]] <- case("cor.test(two$g1, c(26.1, 24, 28.2, 25, 29.1, 30, 27.3, 26), conf.level = 0.9)", "closed",
  list(r = unname(p2$estimate), t = unname(p2$statistic), df = unname(p2$parameter), p = p2$p.value, ci = ci_of(p2$conf.int[1:2])),
  x = "two$g1", y = arr(y2), confLevel = 0.9)

s <- cor.test(corr$x, corr$y, method = "spearman")
cases[["spearman.corr"]] <- case("cor.test(corr$x, corr$y, method = 'spearman')  (exact, AS 89)", "closed",
  list(rho = unname(s$estimate), S = unname(s$statistic), p = s$p.value), data = "corr")
yt <- c(2, 3, 3, 5, 4, 7, 6, 9, 9, 10)
st <- suppressWarnings(cor.test(corr$x, yt, method = "spearman"))
cases[["spearman.ties"]] <- case("cor.test(corr$x, c(2, 3, 3, 5, 4, 7, 6, 9, 9, 10), method = 'spearman')  (ties: t approximation)", "closed",
  list(rho = unname(st$estimate), S = unname(st$statistic), p = st$p.value), x = "corr$x", y = arr(yt))

rs_emit("correlation", c("corr.pearson", "corr.spearman"), cases)
