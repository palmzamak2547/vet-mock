# Farm route 'survey' for freq.proportion [M2-DESIGN.md 3.3.4]: survey 4.5 svydesign(ids = ~farm, data) with
# equal weights (farms as the primary sampling units, Taylor linearisation, t on clusters - 1 df),
# svymean and svyciprop with method 'logit' (default) and 'mean'. The whole made-up serosurvey, 728 cows in 49
# farms, rebuilt from the per-farm counts in _serosurvey.R (a design-based proportion depends only on each
# farm's n and positives). Closed forms.
# packages: survey
source("_common.R")
source("_serosurvey.R")
rs_require("survey")

dat <- data.frame(farm = rep(sero_farm, sero_n), pos = unlist(mapply(function(n, p) c(rep(1, p), rep(0, n - p)), sero_n, sero_pos, SIMPLIFY = FALSE)))
stopifnot(nrow(dat) == 728, sum(dat$pos) == 146)
des <- suppressWarnings(survey::svydesign(ids = ~farm, data = dat))
sm <- survey::svymean(~pos, des)
ci_l <- survey::svyciprop(~pos, des, method = "logit")
ci_m <- survey::svyciprop(~pos, des, method = "mean")
cases <- list()
cases[["serosurvey"]] <- case("svyciprop(~pos, svydesign(ids = ~farm, data = serosurvey), method = 'logit' / 'mean')", "closed",
  list(p = unname(coef(sm)), se = as.numeric(survey::SE(sm)), df = survey::degf(des), n = nrow(dat), clusters = length(sero_n),
    logitLower = unname(attr(ci_l, "ci")[1]), logitUpper = unname(attr(ci_l, "ci")[2]),
    meanLower = unname(attr(ci_m, "ci")[1]), meanUpper = unname(attr(ci_m, "ci")[2])),
  data = "serosurvey counts", confLevel = 0.95, iterativeValues = arr(c("logitLower", "logitUpper")))

# a small made-up design: 6 farms of unequal size
sn <- c(12, 8, 15, 10, 6, 9); sp <- c(3, 0, 7, 2, 1, 4)
d2 <- data.frame(farm = rep(sprintf("S%d", 1:6), sn), pos = unlist(mapply(function(n, p) c(rep(1, p), rep(0, n - p)), sn, sp, SIMPLIFY = FALSE)))
des2 <- suppressWarnings(survey::svydesign(ids = ~farm, data = d2))
sm2 <- survey::svymean(~pos, des2)
l2 <- survey::svyciprop(~pos, des2, method = "logit"); m2 <- survey::svyciprop(~pos, des2, method = "mean")
cases[["sixFarms"]] <- case("svyciprop on six made-up farms of unequal size", "closed",
  list(p = unname(coef(sm2)), se = as.numeric(survey::SE(sm2)), df = survey::degf(des2), logitLower = unname(attr(l2, "ci")[1]), logitUpper = unname(attr(l2, "ci")[2]),
    meanLower = unname(attr(m2, "ci")[1]), meanUpper = unname(attr(m2, "ci")[2])),
  data = "sixFarms", sizes = arr(sn), positives = arr(sp), confLevel = 0.95, iterativeValues = arr(c("logitLower", "logitUpper")))

rs_emit("survey", c("freq.proportion"), cases, packages = "survey",
  datasets = list(serosurvey = list(farm = arr(sero_farm), n = arr(sero_n), positives = arr(sero_pos))),
  notes = "Made-up data (ข้อมูลสมมุติ / made-up data). survey 4.5 with equal weights warns 'No weights or probabilities supplied, assuming equal probability' (suppressed). The logit interval is svyciprop's default: svyglm(quasibinomial) on the farms, a t interval on the logit scale, back-transformed; the glm fit is iterative, so the logit bounds compare at 1e-6.")
