NIST/ITL Statistical Reference Datasets, linear least squares (public domain, US government work).
Downloaded 2026-09-25 from https://www.itl.nist.gov/div898/strd/lls/data/LINKS/DATA/ (Longley.dat,
Norris.dat, Wampler4.dat); `nist.json` holds the same rows and certified values parsed from those
files (`cert` rows are [index, estimate, standard deviation]). Copied unchanged from
work/research-studio/evidence/ on 2026-09-27.

Fixture declaration for scripts/regen-verified.mjs (JSON files cannot carry comments, so it lives here
and in `fixture.json`): family `nist-strd`, kind `pin`, methods `reg.ols`.

Assertions (engine.md 6.1): log relative error of every coefficient and standard error at least 9 for
Norris (lower difficulty); for Longley and Wampler4 (higher difficulty) at least the native-R LRE minus
1, which engine.md section 4 measured as Longley coefficients 13.0 to 15, SEs 14.1 to 14.7; Wampler4
coefficients 7.5 to 11.7, SEs 13.6 to 14.1.
