# Pending: the VetMock Standard (no release number, no user-visible change)

For the reviewer. Docs and tooling only; no product code changed, nothing for the changelog.

## What is in it
- `docs/VETMOCK-STANDARD.md`: one page, ten sections. Who the product is for, then design, motion, language, data, speed, stability, works everywhere, the release rule, and the measure: 50 clauses, each with the check that tests it, today's number, the usual "good" line, the best measured figure with its source, VetMock's target (at or above the best) and the document holding the detail.
- `scripts/standard.mjs` and `npm run standard` (`--json`, `--no-run`, `--sweep=FILE`): runs ten lints that finish in seconds, reads `perf-budgets.json`, `perf-baseline.json`, the CI workflow, the route sweep's KNOWN list, the stylesheets and JSX (static scans), the data scorecard when `scripts/scorecard.mjs` exists, and main's last Build and Smoke through `gh`. Exit code is always 0: it reports.
- `tests/unit/standard.test.mjs`: the clause shape, the report shape, that the page's table and the script's CLAUSES name the same ids, and the static readers.
- `AGENTS.md`: one bullet under Rule 11 pointing to the page.

## Checks run
- `npm run standard` (full, with lints and CI): 28 s; 17 met, 23 not met, 10 not measured.
- `node --import ./tests/unit/setup-generated.mjs --test tests/unit/standard.test.mjs tests/unit/project-docs.test.mjs`: 10 of 10 passed.

## For the reviewer to decide
- Which clauses gate CI, and when. Today nothing gates; the static scans are proxies and their counts include a few false positives (named in their notes).
- The targets on the page were set above the best published figures on purpose (owner, 14 Nov). Each one the product misses is written as missed.
- The perf timings come from `perf-baseline.json` of 22 Oct; re-run `npm run perf` before acting on S1-S3 and M5-M6.
- When the Thai style guide and the data scorecard land, L7 and A1 start measuring; check the scorecard's JSON shape against `standard.mjs` (it reads `rows`, `properties` or `clauses` with `met: true` or `status: 'met'`).
