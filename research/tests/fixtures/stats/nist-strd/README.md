NIST/ITL Statistical Reference Datasets (public domain, US government work), for the stats role's
ANOVA and univariate summary tests. Downloaded 2026-09-27 from

- ANOVA: https://www.itl.nist.gov/div898/strd/anova/<name>.dat (SiRstv, SmLs01, SmLs02, SmLs03 at the
  lower level of difficulty; AtmWtAg, SmLs04, SmLs05, SmLs06 at the average level)
- Univariate summary statistics: https://www.itl.nist.gov/div898/strd/univ/data/<name>.dat (PiDigits,
  Lottery, Lew, Mavro, Michelso, NumAcc1 lower; NumAcc2, NumAcc3 average; NumAcc4 higher)

The files are unchanged (NIST's own headers carry the certified values; the tests parse them from the
file, so no number is typed twice). SmLs07, SmLs08 and SmLs09 (higher difficulty, values near 1e12
whose last decimal is below the spacing of doubles) are not copied; measured on 27 Sep they give an
LRE of about 3.3 to 4.6, the limit of reading "1000000000000.4" into a double.

Fixture declaration for scripts/regen-verified.mjs (it lives in `fixture.json`): family `nist-strd`,
kind `pin`, methods `test.anova1`, `desc.summary`.

Assertions (tests/unit/stats-anova.test.mjs and stats-descriptive.test.mjs): log relative error
(LRE, capped at 15) of at least 9 for every certified value of the lower and average difficulty sets
(ANOVA: between and within sums of squares and mean squares, F, R-squared, residual SD; univariate:
mean and SD). NumAcc4 (higher difficulty) must keep at least 8. Measured on 27 Sep 2026 (Node 22):

| Set | Level | smallest LRE |
|---|---|---|
| SiRstv | lower | 12.9 (F) |
| SmLs01, SmLs02 | lower | 14.9 |
| SmLs03 | lower | 13.7 |
| AtmWtAg | average | 10.9 (within SS) |
| SmLs04, SmLs05, SmLs06 | average | 9.3 (between SS; the data 1000000.4 are not exact doubles) |
| PiDigits, Lottery, Lew, Mavro, Michelso, NumAcc1 | lower | 13.1 (Mavro SD) |
| NumAcc2 | average | 14.2 |
| NumAcc3 | average | 9.5 (SD) |
| NumAcc4 | higher | 8.3 (SD) |

sha-256 of the bytes as downloaded (CRLF line ends; a checkout may store LF):

```
5a1083c9062d3966f244bffa376fc9b033244abf86a0d0dd016af39cd71fb8a7  AtmWtAg.dat
081b231f686d01fa00247b8072909206947c8321bd62e060d9aaae5f4866c44e  Lew.dat
956cb33392ee28683aa7978326fc356d1461e4a3b0e5a69d317fd481d02d6255  Lottery.dat
6b967538d6a607fdf30df054c6fbf4ca6bfb4fa6dc2ecbe613d4f93237a0b1dd  Mavro.dat
68cad435641539ca020adafb4c9a6b7fcc4fefe1d6ab8f2af8fb858d4f1b12ab  Michelso.dat
ce7c7a0fc6d7cedd0d5e1f9911afb9337544be6836730beb9968ca0a4571d375  NumAcc1.dat
5be29522dfbe299541f0ec98ec1c22a51a5587bf06561ba21a92c209fb7ef0f9  NumAcc2.dat
66df1b96596735936f37fd889e7c1c6ce998eb2b523bfc46c98ec1737e992aec  NumAcc3.dat
ca310dc767f5130f980f8280bbe69e26ba414a4d85a89fc11b6c767b828e5fe4  NumAcc4.dat
e9421a2f4c0a31c505099332b4d22e507e808953c3c57bddae9226f25587d7d2  PiDigits.dat
5a4f02d7f256e18c30dcad1b81e0260bb810b5ac113f6107e06dee168d07663e  SiRstv.dat
ad28cac0d4fb79ffea2522b55349083bdea10f12a6f8c46cfbabcccdb4d6b896  SmLs01.dat
708e32eaf36769abe7533e7dcd1b6dc67091b60df938dd37c4f0e65660ef7b0b  SmLs02.dat
e18404d0628b78670580b230a3a3b6cd997d959d00f92a2883a4da942b19377a  SmLs03.dat
1308eb1581f28ce6c9de4ca9520fcc729f916c34f1f9dee10fb6e6581e5b4ce7  SmLs04.dat
7b1333e6e56ced74145096df774cfb1f6305213cb28f9a8222c418ca85d0c296  SmLs05.dat
0c0f09a2df05f2e9db5324a6aaeed85647651e874e9f5c3892b8f29fc4a200f7  SmLs06.dat
de60baa5dc66fd804f9316f895bc5aa2b8f791c09d1ecc1ec39f8b199b8c15c7  Pontius.dat
```

## Pontius (linear least squares, added 27 Sep 2026)

Downloaded 2026-09-27 from https://www.itl.nist.gov/div898/strd/lls/data/LINKS/DATA/Pontius.dat
(lower level of difficulty, quadratic y = B0 + B1 x + B2 x^2, 40 observations; the other linear
least squares sets, Norris, Longley and Wampler4, live in `../../published/nist/`). Asserted in
tests/unit/stats-ols.test.mjs: LRE >= 9 for every coefficient, standard error, the residual SD and
R-squared. Measured on 27 Sep 2026 (Node 24.15): coefficients 11.6, 14.6, 13.3; standard errors 12.5;
residual SD 12.5; R-squared 15.
