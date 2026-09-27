# The literal datasets of M1-DESIGN.md section 7, the same numbers as the `datasets` block of
# research/tests/fixtures/crosscheck/scipy-crosscheck.json (written by scipy_crosscheck.py).
# research/tests/unit/rparity-fixtures.test.mjs checks that every JSON written from these echoes
# exactly the SciPy file's datasets, so R, SciPy and the engine read the same numbers.

two <- list(
  g1 = c(5.1, 4.9, 6.2, 5.8, 6.0, 5.5, 5.3, 6.4),
  g2 = c(6.8, 7.1, 6.5, 7.4, 6.9, 7.8, 6.25, 7.0, 7.3, 6.6)
)
paired <- list(
  before = c(12.1, 14.3, 11.8, 13.5, 15.2, 12.9, 14.8, 13.1, 12.4, 14.0),
  after = c(11.4, 13.9, 11.9, 12.2, 14.1, 12.0, 14.5, 12.3, 12.6, 13.25)
)
three <- list(
  A = c(23, 25, 21, 27, 24),
  B = c(30, 28, 33, 29, 31, 27),
  C = c(26, 24, 28, 25, 29, 30, 27)
)
corr <- list(
  x = c(1.2, 2.3, 3.1, 4.8, 5.0, 6.7, 7.1, 8.4, 9.0, 10.5),
  y = c(2.1, 2.9, 3.8, 5.2, 4.9, 7.3, 6.8, 8.9, 9.5, 10.1)
)
quantiles <- c(2, 4, 4, 5, 7, 9, 10, 12)

# `three` in long form, factor levels in the order A, B, C (R's TukeyHSD and lm use this order).
three_long <- data.frame(
  y = c(three$A, three$B, three$C),
  g = factor(rep(c("A", "B", "C"), times = c(length(three$A), length(three$B), length(three$C))), levels = c("A", "B", "C"))
)
