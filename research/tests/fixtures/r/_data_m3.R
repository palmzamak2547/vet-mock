# Literal datasets for the M3a fixtures [M3-DESIGN.md 3]. Every set here is made-up (ข้อมูลสมมุติ / made-up data)
# unless it names its source; the JavaScript tests read the numbers back from each JSON's `datasets` block.

# curves: an inhibition assay with two arms, seven concentrations, three wells each (made-up).
curves <- data.frame(
  arm = rep(c("control", "drug"), each = 21),
  dose = rep(rep(c(0, 0.3, 1, 3, 10, 30, 100), each = 3), 2),
  resp = c(98.1, 101.6, 99.4, 94.2, 97.0, 92.8, 83.5, 86.9, 80.2, 55.1, 49.8, 52.6, 22.4, 25.9, 19.7, 9.8, 12.1, 8.5, 6.2, 4.9, 7.4,
           99.0, 97.3, 100.8, 98.2, 95.5, 99.7, 93.6, 90.1, 95.2, 78.4, 82.9, 75.6, 48.7, 52.3, 45.1, 21.6, 18.4, 24.0, 10.3, 8.1, 11.9))

# decay: a concentration falling over hours (made-up), for the one-phase decay model.
decay <- data.frame(time = c(0, 1, 2, 4, 6, 8, 12, 24), conc = c(98.2, 75.1, 58.3, 36.9, 24.8, 17.6, 10.9, 6.8))

# growth: a count doubling over hours (made-up), for the exponential growth model.
growth <- data.frame(time = c(0, 2, 4, 6, 8, 10), count = c(1.1, 2.0, 4.3, 8.1, 16.9, 33.2))

# gtt: blood glucose (mmol/L) after a glucose load, eight animals, six times (made-up).
gtt_times <- c(0, 15, 30, 60, 90, 120)
gtt <- rbind(
  A1 = c(5.2, 11.8, 10.1, 8.3, 6.6, 5.7), A2 = c(4.9, 12.6, 11.4, 9.0, 7.1, 5.9),
  A3 = c(5.5, 10.9, 9.7, 7.8, 6.4, 5.6), A4 = c(5.0, 12.2, 10.8, 8.9, 6.9, 5.4),
  B1 = c(5.3, 9.4, 8.2, 6.9, 5.9, 5.4), B2 = c(5.1, 9.9, 8.8, 7.2, 6.0, 5.2),
  B3 = c(5.6, 8.8, 7.9, 6.5, 5.8, 5.5), B4 = c(4.8, 9.6, 8.5, 7.0, 5.7, 5.1))
gtt_group <- rep(c("control", "treated"), each = 4)

# qpcr: Ct values, twelve samples, one target and two reference genes (made-up).
qpcr <- data.frame(
  group = rep(c("control", "treated"), each = 6),
  target = c(26.8, 27.3, 26.5, 27.9, 27.1, 26.6, 24.9, 25.4, 24.6, 25.8, 25.1, 24.7),
  gapdh = c(18.2, 18.6, 18.0, 18.9, 18.4, 18.1, 18.3, 18.5, 18.1, 18.7, 18.4, 18.2),
  actb = c(17.5, 17.9, 17.2, 18.1, 17.8, 17.4, 17.6, 17.8, 17.3, 18.0, 17.7, 17.5))
qpcr_eff <- c(target = 1.94, gapdh = 1.98, actb = 2.02)   # amplification factors (2 = doubling every cycle)
# dilution: a ten-fold dilution series for the efficiency of one assay (made-up).
dilution <- data.frame(log10input = c(0, -1, -2, -3, -4), ct = c(17.12, 20.48, 23.85, 27.31, 30.69))
