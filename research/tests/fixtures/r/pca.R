# Principal component analysis [M3-DESIGN.md 3.1.4]: prcomp (SVD of the centred, optionally scaled data), with
# one sign rule so the pin does not depend on LAPACK: in each component the loading of largest absolute value is
# positive (the scores flip with it). Biplot coordinates as biplot.prcomp with scale = 1: points = scores / lam,
# arrows = loadings * lam, lam = sdev sqrt(n). Data: USArrests (R datasets; McNeil 1977), iris measurements
# (R datasets; Anderson 1935, Fisher 1936).
source("_common.R")

signfix <- function(p) {
  s <- apply(p$rotation, 2, function(v) sign(v[which.max(abs(v))]))
  p$rotation <- sweep(p$rotation, 2, s, `*`); p$x <- sweep(p$x, 2, s, `*`); p
}
one <- function(d, scale) {
  p <- signfix(prcomp(d, scale. = scale)); n <- nrow(d); lam <- p$sdev[1:2] * sqrt(n)
  ev <- p$sdev^2
  list(sdev = arr(p$sdev), eigenvalue = arr(ev), proportion = arr(ev / sum(ev)), cumulative = arr(cumsum(ev) / sum(ev)),
       loadings = unname(p$rotation), scores = unname(p$x), center = arr(unname(p$center)),
       scale = if (scale) arr(unname(p$scale)) else NULL,
       biplotPoints = unname(t(t(p$x[, 1:2]) / lam)), biplotArrows = unname(t(t(p$rotation[, 1:2]) * lam)))
}
cases <- list()
cases[["usarrestsScaled"]] <- case("prcomp(USArrests, scale. = TRUE), signs fixed; biplot.prcomp scale = 1 coordinates", "iterative",
  one(USArrests, TRUE), data = "USArrests")
cases[["irisCovariance"]] <- case("prcomp(iris[, 1:4], scale. = FALSE), signs fixed", "iterative", one(iris[, 1:4], FALSE), data = "iris")

rs_emit("pca", c("multi.pca"), cases,
  datasets = list(USArrests = list(rows = arr(rownames(USArrests)), columns = arr(colnames(USArrests)), values = unname(as.matrix(USArrests))),
                  iris = list(columns = arr(colnames(iris)[1:4]), values = unname(as.matrix(iris[, 1:4])))),
  notes = "Signs fixed so the largest absolute loading of each component is positive. Eigenvalues are sdev^2 (divisor n - 1). Loadings and scores compare at the iterative tolerance.")
