# McNemar [M1-DESIGN.md 7.14]: mcnemar.test with and without continuity, and the exact binomial test on
# the discordant pairs (binom.test(b, b + c)).
# packages:
source("_common.R")

cases <- list()
for (bc in list(c(15, 5), c(8, 2), c(20, 22), c(3, 0))) {
  b <- bc[1]; c0 <- bc[2]
  m <- matrix(c(30, b, c0, 50), 2, byrow = TRUE)
  r1 <- mcnemar.test(m, correct = TRUE)
  r0 <- mcnemar.test(m, correct = FALSE)
  ex <- binom.test(b, b + c0)
  cases[[sprintf("b%d.c%d", b, c0)]] <- case(
    sprintf("mcnemar.test(matrix(c(30, %1$d, %2$d, 50), 2, byrow = TRUE), correct = TRUE / FALSE); binom.test(%1$d, %3$d)", b, c0, b + c0), "closed",
    list(corrected = list(X2 = unname(r1$statistic), p = r1$p.value), uncorrected = list(X2 = unname(r0$statistic), p = r0$p.value), exact = list(p = ex$p.value)),
    b = b, c = c0)
}
rs_emit("mcnemar", c("test.mcnemar"), cases)
