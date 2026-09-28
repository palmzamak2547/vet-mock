# SPSS system-file fixtures (made-up data, ข้อมูลสมมุติ)

Six made-up cows in two farms, written by haven 2.5.5 (ReadStat) running in R 4.6.0 under webR 0.6.0,
28 Sep 2026, in three compressions: `cows-none.sav` (uncompressed), `cows-byte.sav` (bytecode),
`cows-zsav.zsav` (zlib). `expected.json` is what `haven::read_sav(user_na = TRUE)` returns for them.
They exercise Thai value labels and variable labels (UTF-8, given as code page 65001 in record 7.3;
haven writes no record 7.20), user-missing values, a
system-missing number, a date (DATE11), a long variable name (record 7.13) and a very long string
(record 7.14). OWNER: data role (M2-DESIGN.md 5).

Regenerate (the bytes change because the header carries the creation time; the values do not):

    node research/tests/fixtures/sav/make-sav.mjs C:\Users\palmz\Desktop\vmu\webr-runner research/tests/fixtures/sav/make-sav.R research/tests/fixtures/sav

A legacy file (no record 7.20, code page 874 in record 7.3, TIS-620 bytes), a file with record 7.20,
a big-endian file and damaged files are not something haven writes; `tests/unit/data-sav.test.mjs`
builds them with a small writer and states the expected values beside it.

Very long strings: haven (ReadStat) fills 255 bytes of each segment but the last (the 900-byte notes
column is segments of width 255, 255, 255 and 144 holding 255, 255, 255 and 135 bytes).
