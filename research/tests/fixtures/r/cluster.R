# Clustering [M1-DESIGN.md 7.20, 7.21]: the ICC by the one-way ANOVA estimator with unequal cluster
# sizes (n0 = (N - sum n_i^2 / N)/(k - 1); Donner 1986, Int Stat Rev 54:67), DEFF = 1 + (m - 1) ICC with
# m the mean cluster size (and with n0 as the option), effective n = N / DEFF, and the DEFF-widened
# Wald intervals of the G1 panel. Base R formulas; aov() gives the same mean squares for the
# continuous case and is stored beside them.
# packages:
source("_common.R")
source("_serosurvey.R")

icc_parts <- function(y, g) {
  g <- factor(g, levels = unique(g))
  ni <- as.numeric(table(g)); k <- length(ni); N <- sum(ni)
  mi <- tapply(y, g, mean); m <- mean(y)
  msb <- sum(ni * (mi - m)^2) / (k - 1)
  msw <- sum(tapply(y, g, function(v) sum((v - mean(v))^2))) / (N - k)
  n0 <- (N - sum(ni^2) / N) / (k - 1)
  icc <- (msb - msw) / (msb + (n0 - 1) * msw)
  list(msb = msb, msw = msw, n0 = n0, k = k, n = N, meanSize = N / k, icc = icc)
}

cases <- list()
cont <- list(F1 = c(4.1, 3.8, 4.5, 4.0), F2 = c(5.2, 5.0, 4.8), F3 = c(3.1, 3.5, 3.3, 2.9, 3.6), F4 = c(4.4, 4.9))
y <- unlist(cont); g <- rep(names(cont), lengths(cont))
cp <- icc_parts(y, g)
av <- summary(aov(y ~ factor(g)))[[1]]
deffM <- 1 + (cp$meanSize - 1) * cp$icc
cases[["continuous.fourFarms"]] <- case("one-way ANOVA ICC on F1..F4", "closed",
  c(cp, list(deff = deffM, nEff = cp$n / deffM, deffN0 = 1 + (cp$n0 - 1) * cp$icc, aovMSB = av$`Mean Sq`[1], aovMSW = av$`Mean Sq`[2])),
  clusters = lapply(cont, arr))

# the serosurvey: binary outcome, 49 farms
yb <- unlist(lapply(seq_along(sero_n), function(i) c(rep(1, sero_pos[i]), rep(0, sero_n[i] - sero_pos[i]))))
gb <- rep(sero_farm, sero_n)
sp <- icc_parts(yb, gb)
deff <- 1 + (sp$meanSize - 1) * sp$icc
p <- sum(sero_pos) / sum(sero_n); se <- sqrt(p * (1 - p) / sum(sero_n)); z <- qnorm(0.975)
# the crude prevalence ratio of the 2x2 and its DEFF-widened interval (numbers.json assoc.deffPR)
a <- sum(sero_a); b <- sum(sero_b); c <- sum(sero_c); d <- sum(sero_d)
pr <- (a / (a + b)) / (c / (c + d)); sePr <- sqrt(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d))
cases[["serosurvey.binary"]] <- case("one-way ANOVA ICC of ELISA positive over 49 farms; DEFF with the mean farm size; widened Wald", "closed",
  c(sp, list(deff = deff, nEff = sp$n / deff, deffN0 = 1 + (sp$n0 - 1) * sp$icc,
    prevalence = p, waldDeff = ci_of(p + c(-1, 1) * z * se * sqrt(deff)),
    pr = pr, prCiDeff = ci_of(exp(log(pr) + c(-1, 1) * z * sePr * sqrt(deff))))),
  sizes = arr(sero_n), positives = arr(sero_pos))

cases[["deff.course107039"]] <- case("1 + (15 - 1) * 0.05", "closed", list(deff = 1 + (15 - 1) * 0.05), m = 15, icc = 0.05)

rs_emit("cluster", c("cluster.iccDeff"), cases,
  notes = "k = number of clusters, n = animals, meanSize = n/k. deff uses the mean size; deffN0 is the n0 option.")
