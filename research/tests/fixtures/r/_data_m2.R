# The literal datasets of M2-DESIGN.md section 3 ("New literal datasets"), shared by the M2 fixture scripts.
# Made-up data (ข้อมูลสมมุติ / made-up data): rm, roc, items, sep, tied. Published data: RoundingTimes
# (R's ?friedman.test example; Hollander and Wolfe 1973, p. 140), aml (survival package; Miller 1981),
# doctors (Doll and Hill; Breslow and Day 1987, as boot::breslow), pefr (Bland and Altman 1986, Table 1,
# first reading of each meter, as MethComp::PEFR). sources.R checks the published ones against the package
# copies and fails when a number differs. R's own warpbreaks and infert are read from `datasets`.

# rm: eight animals x four times T1..T4; animals 1-4 group A, 5-8 group B (made-up).
rm_wide <- matrix(c(45, 50, 55, 70, 42, 42, 45, 60, 36, 41, 43, 62, 39, 35, 40, 53,
  51, 55, 59, 70, 44, 49, 56, 65, 40, 48, 51, 58, 47, 53, 57, 71), ncol = 4, byrow = TRUE,
  dimnames = list(NULL, paste0("T", 1:4)))
rm_group <- factor(rep(c("A", "B"), each = 4), levels = c("A", "B"))
rm_long <- data.frame(y = as.vector(t(rm_wide)), subj = factor(rep(1:8, each = 4)),
  time = factor(rep(paste0("T", 1:4), 8), levels = paste0("T", 1:4)),
  grp = factor(rep(c("A", "B"), each = 16), levels = c("A", "B")))

# roc: 30 animals, status 1 for the first 12 (made-up).
roc_status <- c(rep(1, 12), rep(0, 18))
roc_marker1 <- c(0.82, 1.10, 0.95, 1.43, 0.66, 1.25, 0.90, 1.58, 0.71, 1.02, 1.37, 0.88,
  0.35, 0.52, 0.41, 0.78, 0.29, 0.60, 0.47, 0.93, 0.38, 0.55, 0.44, 0.69, 0.31, 0.83, 0.50, 0.62, 0.40, 0.72)
roc_marker2 <- c(12.1, 15.4, 9.8, 18.2, 11.5, 14.0, 8.9, 16.7, 13.3, 10.2, 17.1, 12.8,
  9.5, 11.2, 8.1, 13.6, 7.4, 10.9, 9.9, 12.5, 8.8, 10.4, 7.9, 11.8, 9.1, 14.2, 10.1, 8.4, 12.0, 9.6)

# items: twelve respondents x five Likert items (made-up).
items <- matrix(c(4, 5, 4, 4, 5, 3, 3, 4, 3, 3, 5, 5, 5, 4, 5, 2, 3, 2, 2, 3, 4, 4, 3, 4, 4, 3, 2, 3, 3, 2,
  5, 4, 5, 5, 4, 2, 2, 1, 2, 3, 4, 4, 4, 5, 4, 3, 4, 3, 3, 3, 1, 2, 2, 1, 2, 4, 3, 4, 4, 5), ncol = 5, byrow = TRUE,
  dimnames = list(NULL, paste0("q", 1:5)))

# sep: complete separation for level b (made-up).
sep <- data.frame(y = c(0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0),
  x = factor(c("a", "a", "a", "a", "a", "b", "b", "b", "b", "c", "c", "c"), levels = c("a", "b", "c")))

# RoundingTimes: 22 players x 3 methods of rounding first base (R's ?friedman.test).
rounding_times <- matrix(c(5.40, 5.50, 5.55, 5.85, 5.70, 5.75, 5.20, 5.60, 5.50, 5.55, 5.50, 5.40,
  5.90, 5.85, 5.70, 5.45, 5.55, 5.60, 5.40, 5.40, 5.35, 5.45, 5.50, 5.35, 5.25, 5.15, 5.00, 5.85, 5.80, 5.70,
  5.25, 5.20, 5.10, 5.65, 5.55, 5.45, 5.60, 5.35, 5.45, 5.05, 5.00, 4.95, 5.50, 5.50, 5.40, 5.45, 5.55, 5.50,
  5.55, 5.55, 5.35, 5.45, 5.50, 5.55, 5.50, 5.45, 5.25, 5.65, 5.60, 5.40, 5.70, 5.65, 5.55, 6.30, 6.30, 6.25),
  nrow = 22, byrow = TRUE, dimnames = list(1:22, c("Round Out", "Narrow Angle", "Wide Angle")))

# aml: acute myelogenous leukaemia, weeks to relapse (survival::aml; Miller 1981).
aml_lit <- data.frame(time = c(9, 13, 13, 18, 23, 28, 31, 34, 45, 48, 161, 5, 5, 8, 8, 12, 16, 23, 27, 30, 33, 43, 45),
  status = c(1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1),
  x = factor(rep(c("Maintained", "Nonmaintained"), c(11, 12)), levels = c("Maintained", "Nonmaintained")))

# doctors: coronary deaths and person-years of British doctors by smoking and age 35-44 .. 75-84.
doctors <- data.frame(deaths = c(32, 104, 206, 186, 102, 2, 12, 28, 28, 31),
  py = c(52407, 43248, 28612, 12663, 5317, 18790, 10673, 5710, 2585, 1462),
  smoke = factor(rep(c("yes", "no"), each = 5), levels = c("no", "yes")),
  age = factor(rep(c("35-44", "45-54", "55-64", "65-74", "75-84"), 2)))

# pefr: peak expiratory flow rate (l/min), first reading of each meter, 17 subjects (Bland and Altman 1986).
pefr <- list(
  wright = c(494, 395, 516, 434, 476, 557, 413, 442, 650, 433, 417, 656, 267, 478, 178, 423, 427),
  mini = c(512, 430, 520, 428, 500, 600, 364, 380, 658, 445, 432, 626, 260, 477, 259, 350, 451)
)
