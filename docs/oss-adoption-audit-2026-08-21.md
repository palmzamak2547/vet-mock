# VetMock OSS adoption audit — 2026-08-21

## Decision rule

Adopt a project only when it fixes a measured VetMock problem, has a clear
permissive license, is currently maintained, and can be isolated from the first
load. A popular dependency is not automatically an improvement.

## Adopted now

| Project | Version | License | VetMock use | Measured result |
|---|---:|---|---|---|
| [Vite](https://github.com/vitejs/vite/tree/v6.4.3) | 6.4.3 | MIT | Literal dynamic imports split the six-megabyte note corpus by subject. One lazy source map now serves NotesView, VetWiki, and the generated notes registry. | NotesView's own gzip chunk fell from 631,956 B to 36,331 B (94.3%). Opening COM V now needs about 54,048 B gzip for the view plus its note body, instead of loading the full corpus path. |
| [Valibot](https://github.com/open-circle/valibot) | 1.4.2 | MIT | Runtime schemas validate backup and custom-question JSON before any local state changes. | Invalid files fail closed; empty arrays restore correctly; legacy SR cards receive safe defaults; the complete streak timestamp is preserved. The dependency is a 2,671 B gzip lazy chunk and is not preloaded on the home page. |

The Vite implementation follows its official dynamic-import behavior: each
literal `import()` becomes a separately cacheable production chunk. The note
loader evicts rejected requests so a transient network failure can be retried.

## Evaluated, not adopted yet

| Project | Version checked | License | Decision | Reason |
|---|---:|---|---|---|
| [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | 5.4.1 | MIT | Defer | VetMock's existing cards store SM-2 aggregates, not the complete review event stream needed for a truthful replay/calibration. A direct swap would silently move due dates. First add a compact versioned review log, then compare schedules in shadow mode before migration. |
| [TanStack Virtual](https://github.com/TanStack/virtual) | 3.14.10 | MIT | Defer | The 4,506-question bank is searched but not rendered as one list. Current visible lists are small enough that virtualization would add scroll/measurement and keyboard-selection risk without a measured bottleneck. Revisit if the custom-question manager commonly exceeds 200 rendered cards. |
| [idb-keyval](https://github.com/jakearchibald/idb-keyval) | 6.3.0 | Apache-2.0 | Defer | IndexedDB could reduce synchronous localStorage work, but VetMock also syncs these records through Supabase. Moving one side without a versioned dual-read migration risks device-to-device divergence. |
| [FlexSearch](https://github.com/nextapps-de/flexsearch) | 0.8.212 | Apache-2.0 | Do not add now | The current search keeps Thai substring matching predictable, pre-lowers its index, debounces input, and renders at most 80 rows. A new tokenizer must beat the current relevance and latency on a Thai query corpus before shipping. |
| [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) | 1.3.0 | MIT | Do not replace current worker | VetMock's worker deliberately keeps `/api` network-only, uses controlled update activation, and retains immutable hashed assets across releases. Replacing it is only worthwhile if the plugin configuration reproduces those privacy and update contracts in tests. |

## Verification gates

- Shared corpus: 28 subjects and 305 note topics must equal the generated
  availability registry.
- Provenance: lecture sections remain first; Vet 85 sections append without
  losing their source labels.
- Imports: malformed backup/question files cannot call a data setter.
- Compatibility: v5.0 backups remain accepted; v5.1 additionally restores the
  full streak record.
- Delivery: `vendor-validation` and per-subject notes must not appear in the
  initial HTML module-preload list.

## Next evidence to collect

1. Record anonymized duration/count metrics for custom-question lists before
   considering list virtualization.
2. Add a bounded, versioned review-event ledger before running FSRS in shadow
   mode. Never convert due dates from aggregate SM-2 fields alone.
3. If local user data approaches the browser storage ceiling, design a
   dual-read localStorage-to-IndexedDB migration together with Supabase sync and
   rollback tests.

## Research Studio (research.vetmock.com), 2026-09-27

The Studio is a separate Vite app in `research/` with its own `package.json` and lockfile, deployed as
its own project. None of these packages enter the main app's bundle or boot path. Design and reasons:
`docs/research/M1-DESIGN.md`; spec: `work/research-studio/engine.md` section 4 and `fit.md` 3.5.

| Project | Version | License | Research Studio use | Why it passes the rule |
|---|---:|---|---|---|
| [TanStack Virtual](https://github.com/TanStack/virtual) (`@tanstack/react-virtual`) | 3.14.13 | MIT | Virtualised data grid for imported datasets (hundreds to tens of thousands of rows) | The deferral above waited for a list that "commonly exceeds 200 rendered cards"; a research dataset is that evidence (the made-up serosurvey the design uses has 728 rows by 13 columns). Loaded only in the workspace chunk (`vendor-grid`). Last published 2026-09-14. |
| [stdlib](https://github.com/stdlib-js/stdlib), per-function packages: `math-base-special-{erfc,gammainc,betainc,gammaln,binomcoefln}`, `stats-base-dists-{normal,t,chisquare,f,beta}-quantile`, `stats-base-dists-studentized-range-{cdf,quantile}` | 0.2.2 to 0.3.1 | Apache-2.0 (gammainc and betainc: Apache-2.0 AND BSL-1.0) | Distribution functions for every Tier A method, with complement upper tails | Measured against R 4.6.0 (engine.md 4): as accurate as jStat or more on every kernel measured, for example qt(0.975, 5) at 15 correct digits against jStat's 9.5, and Clopper-Pearson qbeta at 15 against 9.2 to 13.2. Only the focused packages are installed, and they load only in the engine worker (and the iOS 14 fallback). |
| [SheetJS CE](https://git.sheetjs.com/SheetJS/sheetjs) (`xlsx`) from `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` | 0.20.3 | Apache-2.0 | Reading .xlsx and .xls files | The npm registry's `xlsx` stops at 0.18.5 with two high advisories (prototype pollution below 0.19.3, ReDoS below 0.20.2); the vendor's own tarball is current. Imported only inside the engine worker; `npm audit --audit-level=high` in `research/` reports 0 vulnerabilities (27 Sep). |
| React and ReactDOM | 18.3.1 | MIT | UI | Same version as the main app, own copy for the separate build. |
| Valibot | 1.4.2 | MIT | Project-file and AnalysisSpec validation | Same version and role as in the main app (imported JSON is untrusted). |
| Supabase JS | 2.115.0 | MIT | Optional sign-in only (no data leaves the device in M1) | Same version as the main app's lockfile; imported only by `research/src/lib/auth`, lazily. |
| Vite, @vitejs/plugin-react | 6.4.3, 4.7.0 | MIT | Build | Same versions as the main app. |

Not adopted for the Studio: jStat (last npm release 2022-11-21; fewer correct digits than stdlib on
most kernels engine.md measured), the npm `xlsx` package (advisories above), fflate (no
zip container is needed until the M2 .docx export).

Verification gates for these adoptions: `npm ls` in `research/` shows exactly the pinned versions;
`research/tests/unit/no-egress.test.mjs` keeps Supabase inside `lib/auth`; a probe build on 27 Sep
bundled the stdlib kernels and SheetJS into one module-worker chunk (820 KB, never on the landing) that
evaluated and answered in Chromium.
