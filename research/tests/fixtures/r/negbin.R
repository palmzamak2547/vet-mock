# Negative binomial regression [M3-DESIGN.md 3.2.2]: MASS glm.nb (theta by maximum likelihood, alternating with
# IRLS; Var = mu + mu^2 / theta), outer tolerance tightened to 1e-12. Profile intervals with theta held at its
# estimate (confint on the fit), Wald intervals, term tests by refitting glm.nb without the term (theta
# re-estimated) and comparing 2 log-likelihoods, and the test against Poisson: LR = 2 (logLik nb - logLik poisson),
# p = P(chi2_1 > LR) / 2 (theta on the boundary). Data: quine (MASS; Aitkin 1978, days absent from school) and the
# same data with a made-up exposure (school days, an offset) to pin the offset path.
# packages: MASS
source("_common.R")
rs_require("MASS")

ctl <- glm.control(epsilon = 1e-12, maxit = 200)
q <- quine
q$py <- 150 + (seq_len(nrow(q)) %% 7) * 8          # made-up exposure, a deterministic pattern
nb <- function(f, d) glm.nb(f, data = d, control = ctl)
pack <- function(m, d, f) {
  ci <- suppressMessages(confint(m)); cw <- confint.default(m)
  po <- glm(f, family = poisson, data = d)
  lr <- 2 * (as.numeric(logLik(m)) - as.numeric(logLik(po)))
  terms <- attr(terms(m), "term.labels")
  tt <- lapply(terms, function(tl) { m0 <- nb(update(f, paste(". ~ . -", tl)), d)
    x <- m$twologlik - m0$twologlik; df <- length(coef(m)) - length(coef(m0))
    c(x, df, pchisq(x, df, lower.tail = FALSE)) })
  tt <- do.call(rbind, tt)
  list(names = arr(names(coef(m))), coef = arr(unname(coef(m))), se = arr(unname(sqrt(diag(vcov(m))))),
       lower = arr(unname(ci[, 1])), upper = arr(unname(ci[, 2])), waldLower = arr(unname(cw[, 1])), waldUpper = arr(unname(cw[, 2])),
       theta = m$theta, thetaSe = m$SE.theta, twoLogLik = m$twologlik, aic = AIC(m), deviance = deviance(m), dfResidual = df.residual(m),
       terms = arr(terms), termChisq = arr(tt[, 1]), termDf = arr(tt[, 2]), termP = arr(tt[, 3]),
       vsPoissonLr = lr, vsPoissonP = 0.5 * pchisq(lr, 1, lower.tail = FALSE))
}
cases <- list()
f1 <- Days ~ Eth + Sex + Age + Lrn
cases[["quine"]] <- case("glm.nb(Days ~ Eth + Sex + Age + Lrn, quine)", "iterative", pack(nb(f1, q), q, f1), data = "quine")
f2 <- Days ~ Eth + Sex + offset(log(py))
cases[["quineOffset"]] <- case("glm.nb(Days ~ Eth + Sex + offset(log(py)), quine with a made-up exposure)", "iterative", pack(nb(f2, q), q, f2), data = "quine")

rs_emit("negbin", c("reg.negbin"), cases, packages = "MASS",
  datasets = list(quine = list(Eth = arr(as.character(q$Eth)), Sex = arr(as.character(q$Sex)), Age = arr(as.character(q$Age)),
                               Lrn = arr(as.character(q$Lrn)), Days = arr(q$Days), py = arr(q$py))),
  notes = "Reference levels as R's factor order: Eth A, Sex F, Age F0, Lrn AL. The exposure py is made-up (ข้อมูลสมมุติ / made-up data). theta is the size parameter (Var = mu + mu^2 / theta).")
