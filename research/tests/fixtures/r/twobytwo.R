# 2x2 measures [M1-DESIGN.md 7.15]. Layout [[a, b], [c, d]]: rows exposed, reference; columns
# positive, negative. Written in base R with the papers cited, and cross-checked in the same file
# against epiR::epi.2by2 and PropCIs::riskscoreci:
#   RR / PR, Wald on the log scale (Katz et al. 1978, Biometrics 34:469);
#   RR score interval (Koopman 1984, Biometrics 40:513) = PropCIs::riskscoreci;
#   OR, Woolf (1955, Ann Hum Genet 19:251); OR exact = fisher.test (conditional MLE and interval);
#   RD Wald; RD Newcombe hybrid score, method 10 (Newcombe 1998, Stat Med 17:873), from Wilson bounds;
#   AFe = (RR - 1)/RR; AFp = (Rt - R0)/Rt; case-control AFe_est = (OR - 1)/OR, AFp_est = AFe_est a/(a + c);
#   Haldane: 0.5 added to every cell, then the same formulas.
# packages: epiR, PropCIs
source("_common.R")
rs_require(c("epiR", "PropCIs"))

z <- qnorm(0.975)
wilson <- function(x, n) unname(prop.test(x, n, correct = FALSE)$conf.int[1:2])

measures <- function(a, b, c, d, conf = 0.95) {
  zz <- qnorm(1 - (1 - conf) / 2)
  n1 <- a + b; n0 <- c + d; p1 <- a / n1; p0 <- c / n0; pt <- (a + c) / (n1 + n0)
  rr <- p1 / p0
  seLogRR <- sqrt(1 / a - 1 / n1 + 1 / c - 1 / n0)
  or <- (a * d) / (b * c)
  seLogOR <- sqrt(1 / a + 1 / b + 1 / c + 1 / d)
  rd <- p1 - p0
  seRD <- sqrt(p1 * (1 - p1) / n1 + p0 * (1 - p0) / n0)
  w1 <- suppressWarnings(prop.test(a, n1, correct = FALSE, conf.level = conf)$conf.int)
  w0 <- suppressWarnings(prop.test(c, n0, correct = FALSE, conf.level = conf)$conf.int)
  newc <- c(rd - sqrt((p1 - w1[1])^2 + (w0[2] - p0)^2), rd + sqrt((w1[2] - p1)^2 + (p0 - w0[1])^2))
  afe <- (rr - 1) / rr
  afeOR <- (or - 1) / or
  list(
    risk1 = p1, risk0 = p0, riskTotal = pt,
    RR = list(value = rr, se = seLogRR, ci = ci_of(exp(log(rr) + c(-1, 1) * zz * seLogRR))),
    OR = list(value = or, se = seLogOR, ci = ci_of(exp(log(or) + c(-1, 1) * zz * seLogOR))),
    RD = list(value = rd, se = seRD, ci = ci_of(rd + c(-1, 1) * zz * seRD), newcombe = ci_of(newc)),
    AFe = afe, AFp = (pt - p0) / pt,
    AFeFromOR = afeOR, AFpFromOR = afeOR * a / (a + c)
  )
}

cases <- list()
tabs <- list(
  small = c(12, 8, 5, 15),
  serosurvey = c(116, 364, 27, 209),
  course = c(40, 60, 20, 80),
  rare = c(3, 997, 1, 999)
)
for (nm in names(tabs)) {
  v <- tabs[[nm]]; a <- v[1]; b <- v[2]; c <- v[3]; d <- v[4]
  m <- measures(a, b, c, d)
  sc <- PropCIs::riskscoreci(a, a + b, c, c + d, 0.95)$conf.int
  fe <- fisher.test(matrix(v, 2, byrow = TRUE))
  m$RR$score <- ci_of(sc)
  cases[[nm]] <- case(sprintf("twobytwo formulas on [[%d, %d], [%d, %d]]; PropCIs::riskscoreci(%d, %d, %d, %d); fisher.test", a, b, c, d, a, a + b, c, c + d), "closed",
    m, table = list(arr(c(a, b)), arr(c(c, d))), confLevel = 0.95,
    iterativeValues = arr(c("RR.score")),
    exactOR = list(estimate = unname(fe$estimate), ci = ci_of(fe$conf.int[1:2]), tol = "uniroot"))
  # epiR cross-check: the same numbers reached by a second program, stored beside the pin
  e <- suppressWarnings(epi.2by2(as.table(matrix(v, 2, byrow = TRUE)), method = "cohort.count", conf.level = 0.95))$massoc.detail
  cases[[nm]]$epiR <- list(
    RR = ci_of(unlist(e$RR.strata.wald)), RRscore = ci_of(unlist(e$RR.strata.score)), OR = ci_of(unlist(e$OR.strata.wald)),
    RDper100 = ci_of(unlist(e$ARisk.strata.wald)), AFe = ci_of(unlist(e$AFRisk.strata.wald)), AFp = ci_of(unlist(e$PAFRisk.strata.wald)))
}

# a zero cell: ratios undefined without a correction; Haldane adds 0.5 to every cell
cases[["zeroCell.haldane"]] <- case("twobytwo formulas on [[7, 0], [2, 5]] + 0.5 (Haldane)", "closed",
  measures(7.5, 0.5, 2.5, 5.5), table = list(arr(c(7, 0)), arr(c(2, 5))), zeroCell = "haldane", confLevel = 0.95)
cases[["small.90"]] <- case("twobytwo formulas on [[12, 8], [5, 15]], conf.level 0.9", "closed",
  measures(12, 8, 5, 15, 0.9), table = list(arr(c(12, 8)), arr(c(5, 15))), confLevel = 0.9)

rs_emit("twobytwo", c("epi.twoByTwo"), cases, packages = c("epiR", "PropCIs"),
  notes = paste("Formulas in base R (header of twobytwo.R). RR.score = PropCIs::riskscoreci (Koopman), found by root search: compare at the iterative tolerance.",
    "exactOR is fisher.test's conditional MLE and interval (uniroot tolerance). The epiR block holds epi.2by2's est, lower, upper for a second check; epiR reports the risk difference per 100."))
