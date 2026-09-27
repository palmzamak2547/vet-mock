# Made-up data (ข้อมูลสมมุติ): six cows in two farms, written by haven (ReadStat) as SPSS files.
library(haven)
d <- data.frame(
  id = c(1, 2, 3, 4, 5, 6),
  farm = c("F01", "F01", "F01", "F02", "F02", "F02"),
  sex = labelled(c(1, 1, 2, 1, 2, 1), c("เพศเมีย" = 1, "เพศผู้" = 2), label = "เพศ"),
  elisa = labelled_spss(c(0, 1, 9, 1, 0, 0), c("ลบ" = 0, "บวก" = 1, "ไม่ทราบ" = 9), na_values = 9, label = "ผล ELISA"),
  age_months = labelled_spss(c(30, 24, -99, 41, 18.5, 60), na_values = -99, label = "อายุ (เดือน)"),
  weight_kg = c(452.5, 398.25, 510, NA, 377.125, 601),
  sampled = as.Date(c("2026-08-03", "2026-08-03", "2026-08-04", "2026-08-10", "2026-08-10", "2026-08-11")),
  owner_th = c("สมชาย ใจดี", "สมชาย ใจดี", "สมชาย ใจดี", "มาลี รักวัว", "มาลี รักวัว", "มาลี รักวัว"),
  vaccinated_in_last_six_months = labelled(c(1, 0, 1, 1, 0, 1), c("ฉีด" = 1, "ไม่ฉีด" = 0)),
  stringsAsFactors = FALSE
)
d$notes <- c(strrep("ก", 300), "", "โคซึม", "", strrep("abc ", 80), "ok")
attr(d$weight_kg, "label") <- "น้ำหนัก (กก.)"
out <- Sys.getenv("RS_OUT")
for (cmp in c("none", "byte", "zsav")) {
  f <- file.path(out, paste0("cows-", cmp, if (cmp == "zsav") ".zsav" else ".sav"))
  write_sav(d, f, compress = cmp)
}
back <- read_sav(file.path(out, "cows-byte.sav"), user_na = TRUE)
str(back)
for (v in names(back)) {
  x <- back[[v]]
  cat("VAR", v, "| class", paste(class(x), collapse = "/"), "| label", if (is.null(attr(x, "label"))) "-" else attr(x, "label"),
      "| format", if (is.null(attr(x, "format.spss"))) "-" else attr(x, "format.spss"),
      "| labels", if (is.null(attr(x, "labels"))) "-" else paste(paste0(names(attr(x, "labels")), "=", attr(x, "labels")), collapse = ";"),
      "| na_values", if (is.null(attr(x, "na_values"))) "-" else paste(attr(x, "na_values"), collapse = ";"),
      "| values", paste(if (inherits(x, "Date")) format(x) else if (is.character(x)) nchar(x) else sprintf("%.17g", as.numeric(x)), collapse = ";"), "\n")
}
cat("haven", as.character(packageVersion("haven")), "\n")
