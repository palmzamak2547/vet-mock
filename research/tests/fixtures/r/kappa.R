# Agreement [M1-DESIGN.md 7.19]: Cohen's kappa unweighted, linear and quadratic weights by irr::kappa2
# on the expanded ratings (and by formula), and for 2x2 tables PABAK, the prevalence index and the bias
# index (Byrt, Bishop and Carlin 1993, J Clin Epidemiol 46:423) in base R, beside epiR::epi.kappa.
# packages: irr, epiR
source("_common.R")
rs_require(c("irr", "epiR"))

expand <- function(tab) {
  k <- nrow(tab)
  a <- unlist(lapply(seq_len(k), function(i) rep(i, sum(tab[i, ]))))
  b <- unlist(lapply(seq_len(k), function(i) rep(seq_len(k), tab[i, ])))
  cbind(a, b)
}
formula_kappa <- function(tab, w) {
  k <- nrow(tab); n <- sum(tab); P <- tab / n
  W <- outer(seq_len(k), seq_len(k), function(i, j) switch(w,
    none = as.numeric(i == j), linear = 1 - abs(i - j) / (k - 1), quadratic = 1 - (i - j)^2 / (k - 1)^2))
  po <- sum(W * P); pe <- sum(W * outer(rowSums(P), colSums(P)))
  c(po = po, pe = pe, kappa = (po - pe) / (1 - pe))
}

cases <- list()
t3 <- matrix(c(20, 5, 1, 4, 15, 6, 1, 3, 25), 3, byrow = TRUE)
r3 <- expand(t3)
f0 <- formula_kappa(t3, "none"); f1 <- formula_kappa(t3, "linear"); f2 <- formula_kappa(t3, "quadratic")
cases[["threeLevel"]] <- case("irr::kappa2 on the ratings of [[20, 5, 1], [4, 15, 6], [1, 3, 25]], weights unweighted, equal, squared", "closed",
  list(po = unname(f0["po"]), pe = unname(f0["pe"]),
    kappa = kappa2(r3, "unweighted")$value, kappaLinear = kappa2(r3, "equal")$value, kappaQuadratic = kappa2(r3, "squared")$value,
    formula = list(kappa = unname(f0["kappa"]), kappaLinear = unname(f1["kappa"]), kappaQuadratic = unname(f2["kappa"]),
      peLinear = unname(f1["pe"]), peQuadratic = unname(f2["pe"]))),
  table = lapply(seq_len(3), function(i) arr(t3[i, ])))

t2 <- matrix(c(40, 9, 6, 45), 2, byrow = TRUE)
n <- sum(t2); a <- t2[1, 1]; b <- t2[1, 2]; c <- t2[2, 1]; d <- t2[2, 2]
po <- (a + d) / n
e <- epi.kappa(as.table(t2), method = "cohen")
cases[["twoByTwo"]] <- case("[[40, 9], [6, 45]]: kappa, PABAK = 2 po - 1, prevalence index (a - d)/n, bias index (b - c)/n; irr::kappa2; epiR::epi.kappa", "closed",
  list(po = po, kappa = kappa2(expand(t2), "unweighted")$value, pabak = 2 * po - 1,
    prevalenceIndex = (a - d) / n, prevalenceIndexAbs = abs(a - d) / n, biasIndex = (b - c) / n, biasIndexAbs = abs(b - c) / n),
  table = list(arr(t2[1, ]), arr(t2[2, ])),
  epiR = list(kappa = e$kappa$est, pabak = e$pabak$est, pindex = e$pindex$est, bindex = e$bindex$est))

cases[["percentAgreement.course107027"]] <- case("865/986", "closed", list(po = 865 / 986), agree = 865, n = 986)

rs_emit("kappa", c("agree.kappa", "agree.percent"), cases, packages = c("irr", "epiR"),
  notes = "Signed indices: epiR reports the prevalence index as (a - d)/n = -0.05 for this table; M1-DESIGN.md 7.19 prints 0.05, the absolute value. Both are stored.")
