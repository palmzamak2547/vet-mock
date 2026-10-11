# Area under a time course per animal [M3-DESIGN.md 3.1.2]: the trapezoid rule on each animal's own times, total
# (baseline 0) and net of the animal's first value (areas below that baseline count negative), then the groups
# compared on the per-animal areas (Welch t.test; summary-measure analysis, Matthews et al. 1990, BMJ 300:230).
# Data gtt (made-up).
source("_common.R")
source("_data_m3.R")

trap <- function(t, y) sum(diff(t) * (head(y, -1) + tail(y, -1)) / 2)
tot <- apply(gtt, 1, function(y) trap(gtt_times, y))
net <- apply(gtt, 1, function(y) trap(gtt_times, y - y[1]))
g <- factor(gtt_group, levels = c("control", "treated"))
tt <- t.test(tot[g == "treated"], tot[g == "control"])
tn <- t.test(net[g == "treated"], net[g == "control"])
cases <- list()
cases[["gtt"]] <- case("sum(diff(t) * (head(y, -1) + tail(y, -1)) / 2) per animal; t.test(treated, control)", "closed",
  list(animal = arr(rownames(gtt)), total = arr(unname(tot)), net = arr(unname(net)),
       totalDiff = unname(tt$estimate[1] - tt$estimate[2]), totalLower = tt$conf.int[1], totalUpper = tt$conf.int[2],
       totalT = unname(tt$statistic), totalDf = unname(tt$parameter), totalP = tt$p.value,
       netDiff = unname(tn$estimate[1] - tn$estimate[2]), netLower = tn$conf.int[1], netUpper = tn$conf.int[2],
       netT = unname(tn$statistic), netDf = unname(tn$parameter), netP = tn$p.value),
  data = "gtt")

rs_emit("auc", c("calc.auc"), cases,
  datasets = list(gtt = list(times = arr(gtt_times), animal = arr(rownames(gtt)), group = arr(gtt_group), glucose = unname(gtt))),
  notes = "Made-up data gtt (ข้อมูลสมมุติ / made-up data). The net area is the trapezoid area of y - y[first], negative parts kept; it is not Wolever's incremental area, which drops the area below baseline.")
