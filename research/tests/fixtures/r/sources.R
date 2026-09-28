# Checks the published M2 datasets typed into _data_m2.R against copies in R packages, and fails when a
# single number differs [M2-DESIGN.md 3, "New literal datasets"]:
# - doctors against boot::breslow (Breslow and Day 1987, Statistical Methods in Cancer Research vol. II; the
#   British doctors data of Doll and Hill): deaths `y`, person-years `n`, by smoking and age 40..80 (midpoints
#   of 35-44 .. 75-84);
# - pefr against MethComp::PEFR (Bland and Altman 1986, Table 1): replicate 1 of each meter;
# - aml against survival::aml (Miller 1981);
# - warpbreaks and infert are R's own `datasets`, nothing to check.
# The output records which copies matched; it has no statistics.
# packages: boot, MethComp, survival
source("_common.R")
source("_data_m2.R")
rs_require(c("boot", "MethComp", "survival"))

br <- boot::breslow
br_smoke <- br[br$smoke == 1, ]; br_non <- br[br$smoke == 0, ]
stopifnot(identical(as.numeric(br_smoke$y), doctors$deaths[doctors$smoke == "yes"]), identical(as.numeric(br_smoke$n), doctors$py[doctors$smoke == "yes"]),
  identical(as.numeric(br_non$y), doctors$deaths[doctors$smoke == "no"]), identical(as.numeric(br_non$n), doctors$py[doctors$smoke == "no"]),
  identical(as.numeric(as.character(br_smoke$age)), c(40, 50, 60, 70, 80)))

e <- new.env(); utils::data("PEFR", package = "MethComp", envir = e)
pf <- e$PEFR
w1 <- pf$y[pf$meth == "Wright" & pf$repl == 1][order(pf$item[pf$meth == "Wright" & pf$repl == 1])]
m1 <- pf$y[pf$meth == "Mini" & pf$repl == 1][order(pf$item[pf$meth == "Mini" & pf$repl == 1])]
stopifnot(identical(as.numeric(w1), pefr$wright), identical(as.numeric(m1), pefr$mini))

stopifnot(identical(as.numeric(survival::aml$time), aml_lit$time), identical(as.numeric(survival::aml$status), aml_lit$status))

cases <- list()
cases[["doctors"]] <- case("identical(doctors, boot::breslow)", "evidence", list(matches = TRUE, rows = nrow(br)), source = "boot::breslow")
cases[["pefr"]] <- case("identical(pefr, MethComp::PEFR replicate 1)", "evidence", list(matches = TRUE, subjects = length(w1)), source = "MethComp::PEFR")
cases[["aml"]] <- case("identical(aml, survival::aml)", "evidence", list(matches = TRUE, rows = nrow(survival::aml)), source = "survival::aml")
rs_emit("sources", character(0), cases, packages = c("boot", "MethComp", "survival"),
  notes = "Evidence only (tol 'evidence'): the literal datasets equal the package copies number for number. boot 1.3-32 breslow has the smokers and non-smokers in the architect's order; MethComp 1.30.2 PEFR replicate 1 is Table 1's first reading.")
