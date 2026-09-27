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
| epmc-methods-2026-09-25.json | 2026-09-25 | 25 families, CUVET block and all-Thai-vet block | family keys only; the per-family term lists of that run were not saved (competitor-gaps.md marks these rows "L") |
| epmc-methods-2026-09-27.json | 2026-09-27 | 26 families not covered on 25 Sep | epmc-methods-2026-09-27.py (the exact script and terms) |

The landing prints the base query, the 698, the date of each file, and links to these files and the
script. Bars are drawn to scale from these numbers; each bar's status (in the Studio now, coming in
M2 or M3) is read from src/lib/runtime/catalog.js, never typed into the page.
