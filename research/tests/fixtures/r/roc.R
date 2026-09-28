# ROC analysis [M2-DESIGN.md 3.3.1]: pROC 1.19.0.1 roc(status, m, levels = c(0, 1), direction = '<'), the
# DeLong variance, interval and covariance, roc.test(paired = TRUE, method = 'delong'), coords() at every
# threshold and the Youden best (every tied threshold). The AUC equals the Mann-Whitney U / (n1 n0)
# (wilcox.test, stopifnot). Data `roc` (made-up). DeLong quantities are closed forms.
# packages: pROC
source("_common.R")
source("_data_m2.R")
rs_require("pROC")

r1 <- pROC::roc(roc_status, roc_marker1, levels = c(0, 1), direction = "<", quiet = TRUE)
r2 <- pROC::roc(roc_status, roc_marker2, levels = c(0, 1), direction = "<", quiet = TRUE)
one <- function(r, m, label) {
  w <- suppressWarnings(wilcox.test(m[roc_status == 1], m[roc_status == 0]))
  stopifnot(isTRUE(all.equal(unname(w$statistic) / (12 * 18), as.numeric(pROC::auc(r)), tolerance = 1e-12)))
  ci <- as.numeric(pROC::ci.auc(r, method = "delong"))
  cc <- pROC::coords(r, "all", ret = c("threshold", "sensitivity", "specificity"), transpose = FALSE)
  b <- pROC::coords(r, "best", best.method = "youden", ret = c("threshold", "sensitivity", "specificity"), transpose = FALSE)
  case(label, "closed", list(auc = as.numeric(pROC::auc(r)), variance = pROC::var(r, method = "delong"), ciLower = ci[1], ciUpper = ci[3],
    ciUpperUnclipped = as.numeric(pROC::auc(r)) + qnorm(0.975) * sqrt(pROC::var(r, method = "delong")),
    thresholds = arr(cc$threshold), sensitivity = arr(cc$sensitivity), specificity = arr(cc$specificity),
    youdenThresholds = arr(b$threshold), youdenSensitivity = arr(b$sensitivity), youdenSpecificity = arr(b$specificity)),
    data = "roc", direction = "higher-positive", confLevel = 0.95)
}
cases <- list()
cases[["marker1"]] <- one(r1, roc_marker1, "roc(status, marker1, levels = c(0, 1), direction = '<'); ci.auc(method = 'delong'); coords")
cases[["marker2"]] <- one(r2, roc_marker2, "roc(status, marker2, levels = c(0, 1), direction = '<'); ci.auc(method = 'delong'); coords")
rt <- pROC::roc.test(r1, r2, method = "delong", paired = TRUE)
cases[["paired.delong"]] <- case("roc.test(r1, r2, method = 'delong', paired = TRUE); cov(r1, r2, method = 'delong')", "closed",
  list(covariance = pROC::cov(r1, r2, method = "delong"), z = unname(rt$statistic), p = rt$p.value,
    diff = as.numeric(pROC::auc(r1)) - as.numeric(pROC::auc(r2)), diffLower = rt$conf.int[1], diffUpper = rt$conf.int[2]), data = "roc")

# lower values positive: direction '>' on marker1 (the same curve read the other way)
r3 <- pROC::roc(roc_status, -roc_marker1, levels = c(0, 1), direction = ">", quiet = TRUE)
ci3 <- as.numeric(pROC::ci.auc(r3, method = "delong"))
cases[["marker1.negated.lowerPositive"]] <- case("roc(status, -marker1, levels = c(0, 1), direction = '>')", "closed",
  list(auc = as.numeric(pROC::auc(r3)), ciLower = ci3[1], ciUpper = ci3[3]), data = "roc", direction = "lower-positive", marker = "-marker1")

rs_emit("roc", c("roc.delong"), cases, packages = "pROC",
  datasets = list(roc = list(status = arr(roc_status), marker1 = arr(roc_marker1), marker2 = arr(roc_marker2))),
  notes = "Made-up data (ข้อมูลสมมุติ / made-up data). pROC clips the DeLong interval to 0..1 (ciUpper 1 for marker1; ciUpperUnclipped is the bound before clipping). Thresholds are pROC's: -Inf, the midpoints of the sorted distinct values, Inf.")
