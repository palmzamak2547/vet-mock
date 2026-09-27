# Rank tests [M1-DESIGN.md 7.9] by R's wilcox.test and kruskal.test. W is the rank sum of x minus
# n1(n1 + 1)/2; V is the sum of the positive ranks (zeros dropped).
#
# R 4.6.0's rule differs from older R and from the text of M1-DESIGN.md 7.9: with exact = NULL it uses
# the exact distribution whenever n < 50 (both samples for the rank sum), EVEN WITH TIES OR ZEROS. With
# ties it computes the permutation distribution of the tied (mid)ranks (stats:::.pwilcox and
# .psignrank, C_dpermdist2 and C_dpermdist1), and it forms that upper tail as 1 - lower. Only
# exact = FALSE, or n >= 50, gives the normal approximation. The cases below pin both branches.
# packages:
source("_common.R")
source("_data.R")

cases <- list()
w <- function(id, call, res, x, y, extra = list()) {
  cases[[id]] <<- do.call(case, c(list(call, "closed", list(statistic = unname(res$statistic), p = res$p.value), x = x, y = y), extra))
}
w("mannWhitney.exact", "wilcox.test(two$g1, two$g2)", wilcox.test(two$g1, two$g2), "two$g1", "two$g2", list(exact = TRUE, correct = TRUE))
w("mannWhitney.normalTiesCC", "wilcox.test(three$A, three$B, exact = FALSE, correct = TRUE)",
  suppressWarnings(wilcox.test(three$A, three$B, exact = FALSE, correct = TRUE)), "three$A", "three$B", list(exact = FALSE, correct = TRUE))
w("mannWhitney.autoTies", "wilcox.test(three$A, three$B)  (ties; R 4.6.0 still uses the exact permutation distribution)",
  suppressWarnings(wilcox.test(three$A, three$B)), "three$A", "three$B", list(exact = "auto", correct = TRUE))
w("mannWhitney.normalNoCC", "wilcox.test(two$g1, two$g2, exact = FALSE, correct = FALSE)",
  wilcox.test(two$g1, two$g2, exact = FALSE, correct = FALSE), "two$g1", "two$g2", list(exact = FALSE, correct = FALSE))
w("mannWhitney.exact.less", "wilcox.test(two$g1, two$g2, alternative = 'less')",
  wilcox.test(two$g1, two$g2, alternative = "less"), "two$g1", "two$g2", list(exact = TRUE, correct = TRUE, alternative = "less"))
w("signedRank.exact", "wilcox.test(paired$before, paired$after, paired = TRUE)",
  wilcox.test(paired$before, paired$after, paired = TRUE), "paired$before", "paired$after", list(exact = TRUE, correct = TRUE))
w("signedRank.normal", "wilcox.test(paired$before, paired$after, paired = TRUE, exact = FALSE, correct = TRUE)",
  wilcox.test(paired$before, paired$after, paired = TRUE, exact = FALSE, correct = TRUE), "paired$before", "paired$after", list(exact = FALSE, correct = TRUE))
# a difference vector with a zero and ties: R drops the zero; with exact = NULL, R 4.6.0 uses the exact
# permutation distribution of the tied ranks; with exact = FALSE the normal approximation
dz <- c(0, 1.5, -0.5, 2, 1.5, 3, -1, 0.5, 2.5, 4)
w("signedRank.zerosTies", "wilcox.test(c(0, 1.5, -0.5, 2, 1.5, 3, -1, 0.5, 2.5, 4))  (exact, conditional on ties)",
  suppressWarnings(wilcox.test(dz)), "dz", NULL, list(d = arr(dz), exact = "auto", correct = TRUE))
w("signedRank.zerosTies.normal", "wilcox.test(c(0, 1.5, -0.5, 2, 1.5, 3, -1, 0.5, 2.5, 4), exact = FALSE)",
  suppressWarnings(wilcox.test(dz, exact = FALSE)), "dz", NULL, list(d = arr(dz), exact = FALSE, correct = TRUE))

k <- kruskal.test(list(three$A, three$B, three$C))
cases[["kruskalWallis.three"]] <- case("kruskal.test(list(three$A, three$B, three$C))", "closed",
  list(H = unname(k$statistic), df = unname(k$parameter), p = k$p.value), groups = "three")

rs_emit("rank", c("test.mannWhitney", "test.wilcoxonSignedRank", "test.kruskalWallis"), cases,
  notes = "R 4.6.0 uses the exact distribution for n < 50 even with ties or zeros (conditional on the tied ranks); only exact = FALSE or n >= 50 gives the normal approximation. See the header of rank.R.")
