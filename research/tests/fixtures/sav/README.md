# SPSS system-file fixtures (made-up data, ข้อมูลสมมุติ)

Six made-up cows in two farms, written by haven 2.5.5 (ReadStat) running in R 4.6.0 under webR 0.6.0,
28 Sep 2026, in three compressions: `cows-none.sav` (uncompressed), `cows-byte.sav` (bytecode),
`cows-zsav.zsav` (zlib). `expected.json` is what `haven::read_sav(user_na = TRUE)` returns for them.
They exercise Thai value labels and variable labels (UTF-8, record 7.20), user-missing values, a
system-missing number, a date (DATE11), a long variable name (record 7.13) and a very long string
(record 7.14). OWNER: data role (M2-DESIGN.md 5).

Regenerate (the bytes change because the header carries the creation time; the values do not):

    node research/tests/fixtures/sav/make-sav.mjs C:\Users\palmz\Desktop\vmu\webr-runner research/tests/fixtures/sav/make-sav.R research/tests/fixtures/sav

A legacy file (no record 7.20, code page 874 in record 7.3, TIS-620 bytes) is not something haven can
write; the data role builds one with a small writer in the test and states the expected values beside it.
