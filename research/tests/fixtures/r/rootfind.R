# Root finding [M1-DESIGN.md 7.2]: Brent's method with R's uniroot defaults
# (tol = .Machine$double.eps^0.25 = 1.220703125e-4, maxiter = 1000). The engine must stop at the
# same iteration and return the same root, since the Fisher and score intervals depend on it.
# packages:
source("_common.R")

cases <- list()
run <- function(id, call, f, lower, upper, tol = .Machine$double.eps^0.25) {
  u <- uniroot(f, c(lower, upper), tol = tol)
  cases[[id]] <<- case(call, "closed", list(root = u$root, iter = u$iter, estimPrec = u$estim.prec),
    fn = "uniroot", interval = arr(c(lower, upper)), tolUsed = tol)
}
run("cubic", "uniroot(function(x) x^3 - x - 1, c(1, 2))", function(x) x^3 - x - 1, 1, 2)
run("cos", "uniroot(function(x) cos(x) - x, c(0, 1))", function(x) cos(x) - x, 0, 1)
run("exp", "uniroot(function(x) exp(x) - 5, c(0, 10))", function(x) exp(x) - 5, 0, 10)
run("cubicTight", "uniroot(function(x) x^3 - x - 1, c(1, 2), tol = 1e-12)", function(x) x^3 - x - 1, 1, 2, tol = 1e-12)

rs_emit("rootfind", character(0), cases,
  notes = "A helper module (no catalogue method). The root and the iteration count are compared as closed forms: the same algorithm on the same arithmetic gives the same bits. Functions: cubic x^3 - x - 1, cos x - x, exp(x) - 5.")
