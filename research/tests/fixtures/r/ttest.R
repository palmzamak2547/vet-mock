# t-tests [M1-DESIGN.md 7.6]: Welch (default), pooled, paired, one-sample, with two-sided and
# one-sided alternatives and other confidence levels, all by R's t.test.
# packages:
source("_common.R")
source("_data.R")

cases <- list()
tt <- function(id, call, res, variant, x, y, alternative = "two.sided", mu = 0, confLevel = 0.95) {
  est <- unname(res$estimate)
  estimate <- if (length(est) == 2) est[1] - est[2] else est
  cases[[id]] <<- case(call, "closed",
    list(t = unname(res$statistic), df = unname(res$parameter), p = res$p.value, estimate = estimate,
      ci = ci_of(res$conf.int[1:2]), se = unname(res$stderr)),
    variant = variant, x = x, y = y, alternative = alternative, mu = mu, confLevel = confLevel)
}
tt("welch", "t.test(two$g1, two$g2)", t.test(two$g1, two$g2), "welch", "two$g1", "two$g2")
tt("pooled", "t.test(two$g1, two$g2, var.equal = TRUE)", t.test(two$g1, two$g2, var.equal = TRUE), "pooled", "two$g1", "two$g2")
tt("paired", "t.test(paired$before, paired$after, paired = TRUE)", t.test(paired$before, paired$after, paired = TRUE), "paired", "paired$before", "paired$after")
tt("oneSample", "t.test(two$g1, mu = 5.5)", t.test(two$g1, mu = 5.5), "one-sample", "two$g1", NULL, mu = 5.5)
tt("welch.less", "t.test(two$g1, two$g2, alternative = 'less')", t.test(two$g1, two$g2, alternative = "less"), "welch", "two$g1", "two$g2", alternative = "less")
tt("pooled.greater", "t.test(two$g1, two$g2, var.equal = TRUE, alternative = 'greater')", t.test(two$g1, two$g2, var.equal = TRUE, alternative = "greater"), "pooled", "two$g1", "two$g2", alternative = "greater")
tt("paired.90", "t.test(paired$before, paired$after, paired = TRUE, conf.level = 0.9)", t.test(paired$before, paired$after, paired = TRUE, conf.level = 0.9), "paired", "paired$before", "paired$after", confLevel = 0.9)
tt("welch.threeAB", "t.test(three$A, three$B)", t.test(three$A, three$B), "welch", "three$A", "three$B")

rs_emit("ttest", c("test.tTest"), cases,
  notes = "estimate is mean(x) - mean(y) for two samples, the mean difference for paired, the mean for one sample; se is t.test's stderr.")
