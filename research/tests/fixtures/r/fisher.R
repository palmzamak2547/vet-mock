# Fisher exact 2x2 [M1-DESIGN.md 7.13] by fisher.test: two-sided p (tables with probability <= the
# observed times 1 + 1e-7), one-sided p, the conditional maximum likelihood odds ratio and its exact
# interval. R finds the estimate and the bounds with uniroot at its default tolerance, so those values
# compare at the uniroot tolerance; the p-values are sums of hypergeometric terms (closed).
# packages:
source("_common.R")

cases <- list()
fi <- function(id, tab, alternative = "two.sided", conf = 0.95) {
  m <- matrix(unlist(tab), nrow = 2, byrow = TRUE)
  r <- fisher.test(m, alternative = alternative, conf.level = conf)
  cases[[id]] <<- case(sprintf("fisher.test(matrix(c(%s), 2, byrow = TRUE), alternative = '%s', conf.level = %s)", paste(t(m), collapse = ", "), alternative, format(conf)),
    "uniroot", list(p = r$p.value, estimate = unname(r$estimate), ci = ci_of(r$conf.int[1:2])),
    table = tab, alternative = alternative, confLevel = conf, closedValues = arr("p"))
}
fi("tea", list(arr(c(3, 1)), arr(c(1, 3))))
fi("tea.greater", list(arr(c(3, 1)), arr(c(1, 3))), "greater")
fi("tea.less", list(arr(c(3, 1)), arr(c(1, 3))), "less")
fi("zeroCell", list(arr(c(7, 0)), arr(c(2, 5))))
fi("zeroCellOther", list(arr(c(0, 7)), arr(c(5, 2))))
fi("serosurvey", list(arr(c(116, 364)), arr(c(27, 209))))
fi("small.99", list(arr(c(12, 8)), arr(c(5, 15))), conf = 0.99)
fi("symmetric", list(arr(c(5, 5)), arr(c(5, 5))))

rs_emit("fisher", c("test.fisher2x2"), cases,
  notes = "estimate and ci come from uniroot inside fisher.test (tolerance .Machine$double.eps^0.25); p is a closed sum and is listed in closedValues.")
