# Nonlinear regression [M3-DESIGN.md 3.1.1]. The 4PL and 5PL in the log-EC50 form (drc LL2.4, LL2.5:
# f = c + (d - c) / (1 + exp(b (log x - e)))^g, g = 1 for the 4PL), Michaelis-Menten, one-phase decay and
# exponential growth, fitted by nls (Gauss-Newton). Standard errors are s^2 (J'J)^-1 at the solution (vcov.nls),
# parameter intervals est +- qt(0.975, df) SE. The EC50 and interpolated concentrations get delta-method intervals
# on the log scale with the analytic gradients written below, then are exponentiated. The confidence band of the
# curve is f +- qt(0.975, df) sqrt(g' V g). Curve comparison: extra sum-of-squares F test between nested least-
# squares fits sharing one residual variance, and AICc = n log(RSS/n) + 2K + 2K(K + 1)/(n - K - 1), K = parameters
# + 1. drc 3.0.1 must give the same fitted parameters (stopifnot at 1e-6); its standard errors come from a numerical
# Hessian and are not the pin. Data: ryegrass (drc; Inderjit et al. 2002), Puromycin treated (R datasets; Treloar
# 1974), and the made-up sets of _data_m3.R.
# packages: drc
source("_common.R")
source("_data_m3.R")
rs_require("drc")

tq <- function(df) qt(0.975, df)
L0 <- function(x) log(x)                                   # log(0) = -Inf on purpose: a zero dose sits on an asymptote
ll5 <- function(x, b, c, d, e, g) c + (d - c) / (1 + exp(b * (L0(x) - e)))^g
# gradient of the 5PL with respect to (b, c, d, e, g); u (L - e) is taken as 0 where u = 0 (a zero dose)
g5 <- function(x, b, c, d, e, g) {
  L <- L0(x); u <- exp(b * (L - e)); D <- 1 + u
  uLe <- ifelse(u == 0, 0, u * (L - e))
  cbind(b = -(d - c) * g * D^(-g - 1) * uLe, c = 1 - D^(-g), d = D^(-g),
        e = (d - c) * g * D^(-g - 1) * u * b, g = -(d - c) * D^(-g) * log(D))
}
# log of the concentration whose fitted response is y0, and its gradient in (b, c, d, e, g)
lx0 <- function(y0, b, c, d, e, g) {
  r <- (d - c) / (y0 - c); w <- r^(1 / g) - 1
  val <- e + log(w) / b
  dw_dr <- (1 / g) * r^(1 / g - 1)
  grad <- c(b = -log(w) / b^2,
            c = (1 / b) / w * dw_dr * ((d - y0) / (y0 - c)^2) * 1,
            d = (1 / b) / w * dw_dr * (1 / (y0 - c)),
            e = 1,
            g = (1 / b) / w * (r^(1 / g)) * log(r) * (-1 / g^2))
  list(val = val, grad = grad)
}
vfit <- function(f) { co <- coef(f); se <- sqrt(diag(vcov(f))); df <- df.residual(f)
  list(coef = co, se = se, lower = co - tq(df) * se, upper = co + tq(df) * se, rss = sum(residuals(f)^2), df = df,
       sigma = summary(f)$sigma) }
dm <- function(grad, V) sqrt(drop(t(grad) %*% V %*% grad))
r2 <- function(f, y) 1 - sum(residuals(f)^2) / sum((y - mean(y))^2)
aicc <- function(rss, n, p) { K <- p + 1; n * log(rss / n) + 2 * K + 2 * K * (K + 1) / (n - K - 1) }

cases <- list()
data(ryegrass)
rg <- ryegrass
grid <- c(0.5, 1, 2, 4, 8, 16)
unknowns <- c(2, 4, 6)

# 4PL on ryegrass (g fixed at 1)
f4 <- nls(rootl ~ c + (d - c) / (1 + exp(b * (log(conc) - e))), data = rg, start = list(b = 3, c = 0.5, d = 7.8, e = 1.1))
v4 <- vfit(f4); V4 <- vcov(f4); p4 <- coef(f4)
dr4 <- coef(drm(rootl ~ conc, data = rg, fct = LL2.4()))
stopifnot(isTRUE(all.equal(unname(dr4), unname(p4), tolerance = 1e-6)))
ec <- p4[["e"]]; ecse <- sqrt(V4["e", "e"])
G4 <- g5(grid, p4[["b"]], p4[["c"]], p4[["d"]], p4[["e"]], 1)[, c("b", "c", "d", "e")]
band4 <- sqrt(rowSums((G4 %*% V4) * G4))
fit4 <- ll5(grid, p4[["b"]], p4[["c"]], p4[["d"]], p4[["e"]], 1)
ip4 <- lapply(unknowns, function(y0) { z <- lx0(y0, p4[["b"]], p4[["c"]], p4[["d"]], p4[["e"]], 1)
  s <- dm(z$grad[c("b", "c", "d", "e")], V4); c(z$val, s, z$val - tq(v4$df) * s, z$val + tq(v4$df) * s) })
ip4 <- do.call(rbind, ip4)
cases[["ryegrass4pl"]] <- case("nls(rootl ~ c + (d - c) / (1 + exp(b * (log(conc) - e))), ryegrass); vcov; delta method on the log scale", "iterative",
  list(b = p4[["b"]], c = p4[["c"]], d = p4[["d"]], e = p4[["e"]],
       se = arr(unname(v4$se)), lower = arr(unname(v4$lower)), upper = arr(unname(v4$upper)),
       rss = v4$rss, df = v4$df, sigma = v4$sigma, r2 = r2(f4, rg$rootl),
       ec50 = exp(ec), ec50Lower = exp(ec - tq(v4$df) * ecse), ec50Upper = exp(ec + tq(v4$df) * ecse), logEc50Se = ecse,
       grid = arr(grid), fitted = arr(fit4), bandSe = arr(band4), bandLower = arr(fit4 - tq(v4$df) * band4), bandUpper = arr(fit4 + tq(v4$df) * band4),
       unknownResponse = arr(unknowns), unknownLogX = arr(ip4[, 1]), unknownLogXSe = arr(ip4[, 2]),
       unknownX = arr(exp(ip4[, 1])), unknownXLower = arr(exp(ip4[, 3])), unknownXUpper = arr(exp(ip4[, 4])),
       aicc = aicc(v4$rss, nrow(rg), 4)),
  data = "ryegrass")

# 5PL on ryegrass, started from drc's fit
m5d <- drm(rootl ~ conc, data = rg, fct = LL2.5()); d5 <- coef(m5d)
f5 <- nls(rootl ~ c + (d - c) / (1 + exp(b * (log(conc) - e)))^g, data = rg,
          start = list(b = d5[[1]], c = d5[[2]], d = d5[[3]], e = d5[[4]], g = d5[[5]]))
v5 <- vfit(f5); V5 <- vcov(f5); p5 <- coef(f5)
# The 5PL is loosely determined here (SE of g about its own size): drc's optimiser stops near, not at, the
# least-squares minimum. nls's minimum is the pin; it must not be worse than drc's.
stopifnot(v5$rss <= sum(residuals(m5d)^2) + 1e-12)
h <- 2^(1 / p5[["g"]]) - 1
l50 <- p5[["e"]] + log(h) / p5[["b"]]
gr50 <- c(b = -log(h) / p5[["b"]]^2, c = 0, d = 0, e = 1, g = (1 / p5[["b"]]) / h * 2^(1 / p5[["g"]]) * log(2) * (-1 / p5[["g"]]^2))
s50 <- dm(gr50, V5)
ip5 <- do.call(rbind, lapply(unknowns, function(y0) { z <- lx0(y0, p5[["b"]], p5[["c"]], p5[["d"]], p5[["e"]], p5[["g"]])
  s <- dm(z$grad, V5); c(z$val, s, z$val - tq(v5$df) * s, z$val + tq(v5$df) * s) }))
Fv <- ((v4$rss - v5$rss) / (v4$df - v5$df)) / (v5$rss / v5$df)
cases[["ryegrass5pl"]] <- case("nls(rootl ~ c + (d - c) / (1 + exp(b * (log(conc) - e)))^g, ryegrass); EC50 = exp(e + log(2^(1/g) - 1) / b)", "iterative",
  list(b = p5[["b"]], c = p5[["c"]], d = p5[["d"]], e = p5[["e"]], g = p5[["g"]],
       se = arr(unname(v5$se)), rss = v5$rss, df = v5$df, sigma = v5$sigma, r2 = r2(f5, rg$rootl),
       ec50 = exp(l50), ec50Lower = exp(l50 - tq(v5$df) * s50), ec50Upper = exp(l50 + tq(v5$df) * s50), logEc50Se = s50,
       unknownResponse = arr(unknowns), unknownX = arr(exp(ip5[, 1])), unknownXLower = arr(exp(ip5[, 3])), unknownXUpper = arr(exp(ip5[, 4])),
       aicc = aicc(v5$rss, nrow(rg), 5), vs4plF = Fv, vs4plDf1 = v4$df - v5$df, vs4plDf2 = v5$df,
       vs4plP = pf(Fv, v4$df - v5$df, v5$df, lower.tail = FALSE)),
  data = "ryegrass")

# Michaelis-Menten on Puromycin (treated cells)
pur <- subset(Puromycin, state == "treated")
fm <- nls(rate ~ Vm * conc / (K + conc), data = pur, start = list(Vm = 200, K = 0.05))
vm <- vfit(fm)
cases[["michaelisMenten"]] <- case("nls(rate ~ Vm * conc / (K + conc), subset(Puromycin, state == 'treated'))", "iterative",
  list(vm = coef(fm)[["Vm"]], k = coef(fm)[["K"]], se = arr(unname(vm$se)), lower = arr(unname(vm$lower)), upper = arr(unname(vm$upper)),
       rss = vm$rss, df = vm$df, r2 = r2(fm, pur$rate)), data = "puromycin")

# one-phase decay: Y = (Y0 - P) exp(-K t) + P; half-life ln 2 / K with its interval from K's interval
fd <- nls(conc ~ (y0 - plateau) * exp(-k * time) + plateau, data = decay, start = list(y0 = 98, plateau = 6, k = 0.3))
vd <- vfit(fd); kk <- coef(fd)[["k"]]
cases[["decay"]] <- case("nls(conc ~ (y0 - plateau) * exp(-k * time) + plateau, decay)", "iterative",
  list(y0 = coef(fd)[["y0"]], plateau = coef(fd)[["plateau"]], k = kk, se = arr(unname(vd$se)), lower = arr(unname(vd$lower)), upper = arr(unname(vd$upper)),
       rss = vd$rss, df = vd$df, r2 = r2(fd, decay$conc),
       halfLife = log(2) / kk, halfLifeLower = log(2) / vd$upper[["k"]], halfLifeUpper = log(2) / vd$lower[["k"]]), data = "decay")

# exponential growth: Y = Y0 exp(k t); doubling time ln 2 / k
fg <- nls(count ~ y0 * exp(k * time), data = growth, start = list(y0 = 1, k = 0.35))
vg <- vfit(fg); kg <- coef(fg)[["k"]]
cases[["growth"]] <- case("nls(count ~ y0 * exp(k * time), growth)", "iterative",
  list(y0 = coef(fg)[["y0"]], k = kg, se = arr(unname(vg$se)), lower = arr(unname(vg$lower)), upper = arr(unname(vg$upper)),
       rss = vg$rss, df = vg$df, r2 = r2(fg, growth$count),
       doubling = log(2) / kg, doublingLower = log(2) / vg$upper[["k"]], doublingUpper = log(2) / vg$lower[["k"]]), data = "growth")

# Curve comparison on `curves`: separate 4PLs (one residual variance), one curve for both, and a shared EC50
cv <- curves; cv$arm <- factor(cv$arm, levels = c("control", "drug")); cv$a <- as.integer(cv$arm); n <- nrow(cv)
fs <- nls(resp ~ c[a] + (d[a] - c[a]) / (1 + exp(b[a] * (log(dose) - e[a]))), data = cv,
          start = list(b = c(1.2, 1.2), c = c(6, 6), d = c(99, 99), e = c(log(3), log(10))))
f1 <- nls(resp ~ c + (d - c) / (1 + exp(b * (log(dose) - e))), data = cv, start = list(b = 1.2, c = 6, d = 99, e = log(5)))
fe <- nls(resp ~ c[a] + (d[a] - c[a]) / (1 + exp(b[a] * (log(dose) - e))), data = cv,
          start = list(b = c(1.2, 1.2), c = c(6, 6), d = c(99, 99), e = log(5)))
rs <- sum(residuals(fs)^2); r1 <- sum(residuals(f1)^2); re <- sum(residuals(fe)^2)
ds <- df.residual(fs); d1 <- df.residual(f1); de <- df.residual(fe)
F1 <- ((r1 - rs) / (d1 - ds)) / (rs / ds); Fe <- ((re - rs) / (de - ds)) / (rs / ds)
ps <- coef(fs); Vs <- vcov(fs)
lr <- ps[["e2"]] - ps[["e1"]]; lrse <- sqrt(Vs["e2", "e2"] + Vs["e1", "e1"] - 2 * Vs["e1", "e2"])
cases[["compare"]] <- case("nls with indexed parameters: separate 4PLs, one 4PL, shared e; extra sum-of-squares F; AICc", "iterative",
  list(separate = arr(unname(ps)), separateSe = arr(unname(sqrt(diag(Vs)))), oneCurve = arr(unname(coef(f1))), sharedEc50 = arr(unname(coef(fe))),
       rssSeparate = rs, rssOne = r1, rssShared = re, dfSeparate = ds, dfOne = d1, dfShared = de,
       oneF = F1, oneP = pf(F1, d1 - ds, ds, lower.tail = FALSE), sharedF = Fe, sharedP = pf(Fe, de - ds, ds, lower.tail = FALSE),
       aiccSeparate = aicc(rs, n, 8), aiccOne = aicc(r1, n, 4), aiccShared = aicc(re, n, 7),
       ec50Control = exp(ps[["e1"]]), ec50Drug = exp(ps[["e2"]]),
       ec50Ratio = exp(lr), ec50RatioLower = exp(lr - tq(ds) * lrse), ec50RatioUpper = exp(lr + tq(ds) * lrse)),
  data = "curves")

rs_emit("nonlinear", c("nls.fourPL", "nls.doseResponse", "nls.equation"), cases, packages = "drc",
  datasets = list(ryegrass = list(conc = arr(rg$conc), rootl = arr(rg$rootl)),
                  puromycin = list(conc = arr(pur$conc), rate = arr(pur$rate)),
                  decay = list(time = arr(decay$time), conc = arr(decay$conc)),
                  growth = list(time = arr(growth$time), count = arr(growth$count)),
                  curves = list(arm = arr(curves$arm), dose = arr(curves$dose), resp = arr(curves$resp))),
  notes = "Gauss-Newton covariance (vcov.nls), as NIST StRD and Prism's asymptotic standard errors; drc's numerical-Hessian SEs differ by about 1% and are not the pin. A zero dose sits on an asymptote (log 0 = -Inf), and the gradient's u (L - e) term is 0 there. Interpolated concentrations cover the curve's uncertainty only, not the unknown's own measurement error. curves, decay and growth are made-up (ข้อมูลสมมุติ / made-up data).")
