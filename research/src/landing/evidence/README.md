Evidence behind the landing chapter "what CUVET papers use" (M1-DESIGN.md 15.3). Copied byte for
byte from work/research-studio/evidence/ on 2026-09-27 (sha-256 checked equal).

Source: Europe PMC REST search, https://www.ebi.ac.uk/europepmc/webservices/rest/search
Base query: `AFF:"Faculty of Veterinary Science, Chulalongkorn University" AND PUB_YEAR:[2021 TO 2026]`
Full-text papers in that set: 698 (`with_full_text`, query base AND HAS_FT:Y).
Each count is the number of those papers whose METHODS section matches one family's terms
(`METHODS:(...)`). A paper can count in several families; a mention is not an analysis; affiliation
matching includes co-authored papers. Keyword counts are a usage signal, not a census.

| File | Checked | Families | Terms |
|---|---|---|---|
| epmc-methods-2026-09-25.json | 2026-09-25 | 25 families, CUVET block and all-Thai-vet block | epmc-methods-check-2026-09-25.mjs holds the terms for 15 of them (ANOVA, t-test, chi-square, Fisher, Mann-Whitney/Wilcoxon, Kruskal-Wallis, logistic, mixed, GEE, ICC/design effect, survival, post hoc, kappa, Se+Sp, sample size) and the base query; the terms for the other families of that run were not saved (competitor-gaps.md marks those rows "L") |
| epmc-methods-2026-09-27.json | 2026-09-27 | 26 families not covered on 25 Sep | epmc-methods-2026-09-27.py (the exact script and terms) |

The landing prints the base query, the 698, the date of each file, and links to these files and the
script. Bars are drawn to scale from these numbers; each bar's status (in the Studio now, coming in
M2 or M3) is read from src/lib/runtime/catalog.js, never typed into the page.

The chapter reads one joined table, `research/src/data/cuvet-methods.json` (query, denominator, both
check dates, links, and one count per catalogue family with the file and key it came from). It is written
by `build-cuvet-methods.mjs` in this folder; `tests/unit/landing-chart.test.mjs` fails when it differs
from these files.

Re-run of epmc-methods-check-2026-09-25.mjs on 2026-09-28 (review round 1): denominator 698 and ANOVA
220, t-test 104, chi-square 92, Fisher 16, Mann-Whitney/Wilcoxon 102, Kruskal-Wallis 82, logistic 49,
GEE 1, post hoc 60, kappa 26, Se+Sp 45 and sample size 71 match the chart; mixed models 54 (chart 52),
ICC/design effect 5 (chart 4) and survival 22 (chart 23) differ slightly, from new papers indexed since
25 Sep or a term difference. The chart keeps the dated 25 Sep counts.
