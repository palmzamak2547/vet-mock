```js
// No change a student can see: the seven Year 2 note subjects stay out of
// VetWiki on purpose (row 6), so this batch has no changelog entry.
```

# Contracts, truth and tidy (pending, branch `claude/debt-contracts`)

Rows TYPE-1, OPS-1, DEP-2, OPS-3, DEP-1, DEAD-1, DEAD-2, PROD-3 and DEP-6/11/3
of the debt register. Nothing on the exam or question-card path changes; the
only screen code touched is a dead branch in SubjectSelectView and two sign-in
origin rules that keep their answers.

Checks: `lint:data` green (with typecheck, lint:deps, lint:env), `test:unit`
4,150 tests, 0 failed, `npm run build` and `perf:budget` green (first-load JS
225,510 of 227,900 B, CSS 46,506 of 47,900 B). E2E pre-check on Playwright
1.63, chromium-mobile and webkit-mobile, the specs this branch can touch
(wiki-indexing, the four notes specs, phase-wrapped-home, subject-covers,
smoke, chula-wall): 50 passed, 26 skipped, 4 failed, all on chromium-mobile
with the page still on its first-load spinner. The same 4 then passed on a
clean origin/main checkout (3 passed, 1 skipped) and again on this branch
(3 passed, 1 skipped): intermittent first loads, not this change. An earlier
four-engine run (83 timeouts) overlapped another heavy job and proves nothing.
The pull request's CI runs all four engines.

## 1. A type check that gates (TYPE-1)
- `npm run typecheck` (`scripts/typecheck.mjs`, in `lint:data`, so in Build)
  checks the files in `scripts/typecheck-files.json` with
  `tsconfig.check.json`: JavaScript with JSDoc, `checkJs` off, each listed file
  marked `// @ts-check`, nothing compiled. TypeScript 6.0.3 and `@types/node`
  24.13 are development dependencies only.
- The first 14: `api/_lib/{ai/config,ai/text,blob-token,open-ticket,r2}.js`,
  `src/lib/{api-auth,errors,inapp,local-extras,nav,user-data-schema,view-route,vetwiki/schema,vetwiki/url}.js`.
  The register's own list lost `rate-limit`, `llm` (another branch), `chula-gate`,
  `exam-scoring`, `exam-scope`, `current-phase`, `study-events` (exam path) and
  `dialog`, `safe-url` (imported by the question card).
- Found: 24 errors, all missing type information (destructured options without
  defaults read as absent properties, a Map built from `[path, view]` arrays,
  `null` defaults, valibot entries typed `{}`, `navigator.userAgentData`). Fixed
  with JSDoc and two behaviour-keeping narrowings (`typeof x === 'number'`
  before `Number.isFinite`/`isInteger`). No runtime defect. 0 `@ts-ignore`,
  0 `any`.
- An exploratory pass over all 335 files of `src/lib`, `src/hooks` and `api`
  (not committed) found no `.catch`/`.finally` on a non-promise; it did find
  JSDoc that disagrees with its callers (`unsupportedClaims` documents a
  one-argument `evidenceAt` and calls it with two). Plain object literals are
  open in JavaScript, so the check bites hardest where types come from a
  package's declarations (supabase-js) or a JSDoc typedef: TYPE-2.
- Guard: `tests/unit/typecheck.test.mjs` seeds a `.catch` on a thenable, a
  string compared with a number and a misspelt property and expects all three
  to fail; a silencer or `any` without `-- reason` fails; the step is in
  `lint:data`. Run time about 3 s.

## 2. Environment variables (OPS-1)
- Before: 131 names read in code, 5 in `.env.example` (two of them with
  values filled in). After: `scripts/lib/env-list.mjs` lists 121 names (12
  required) with group, need and what happens without each, plus 10 the
  platform sets. `node scripts/env-contract.mjs --write` generates
  `.env.example` (names and comments only) and `docs/ENV.md` (also where and in
  which runtime each is read).
- Guard: `lint:env` (in `lint:data`) fails on a name the code reads that the
  list lacks, a listed name nothing reads, or a stale file;
  `tests/unit/env-contract.test.mjs` pins the scanner's forms and that the
  example holds no value. The scan reads tracked source only, never an .env
  file; unit tests are not scanned (they set variables for the code under
  test), and a name built at run time is not seen.
- The old `.env.example` had values filled in for `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` (public by design; not read for this change). The
  file holds no value now, and they remain in git history.

## 3. Undeclared imports (DEP-2)
- Declared at the installed version: root `playwright`, `esbuild`,
  `@napi-rs/canvas`; vca `@playwright/test`, `sharp`, `esbuild`; research
  `@playwright/test`. The vca and research e2e scripts run their own
  Playwright (`playwright test`) instead of `../node_modules/.../cli.js`, so a
  config and its runner never load two copies.
- Cost: the vca and research installs (CI and Vercel) now fetch Playwright and,
  for vca, sharp (about 30 packages in vca's lock, mostly sharp's per-platform
  binaries, of which one installs).
- Guard: `lint:deps` (in `lint:data`, `scripts/lint-deps.mjs`) reads every
  tracked file's imports through the TypeScript preprocessor and fails on an
  undeclared package; on the old manifests it names exactly these seven.
  `tests/unit/lint-deps.test.mjs`.

## 4. Docs that contradicted the code (OPS-3, DEP-1)
- `docs/PROJECT_KNOWLEDGE_BASE.md` no longer claims a 5.149.0 / SW v227
  checkpoint; it says where each number lives.
- `AGENTS.md`: changelog is `src/data/changelog/<version>.js`; `npm run build`
  is no longer "always before commit"; env, deps and typecheck rows added; the
  LIFF flip note is gone with the flag. `STABILITY.md` rule 9 now says CI
  builds every pull request (owner decision 22 Oct), and rule 8 asks for an
  `SW_VERSION` bump when `public/sw.js` changes, not on every CSS or chunk
  change (assets are cached under their hashed names; bumps since follow
  worker changes).
- Node: `.node-version` 22 -> 24 (what all 9 CI steps and the machines run);
  `engines` stays `>=20` in the four apps, as Vercel reads it. One table in
  `docs/HANDOVER.md` ("เวอร์ชัน Node") says which is the source.
  Guard: `tests/unit/node-version.test.mjs`.
- Left: the Imaging "moderate advisories" line in AGENTS.md (npm audit is 0
  today) and `package.json` version 5.150.0 (AGENTS already says it is not
  bumped).

## 5. Dead flags, the broken script, unused exports (DEAD-1, DEAD-2)
- `scripts/verify-tags.mjs` imported `canonicalTag`, which `tag-case.mjs`
  dropped with the lowercasing rule; nothing references the script, so it is
  fixed rather than deleted: tags are checked as written and split spellings
  still reported (run on a fixture).
- Removed: `GIS_AUTHORISED_ON_VETMOCK_COM` and `LIFF_ENDPOINT_ON_VETMOCK_COM`
  (true constants; the false branch needs a console change, not a flip;
  `origin-move-bridge.test.mjs` pins the same per-origin answers), and
  SubjectSelectView's `{false && s.code ...}` course code.
- Kept: `FEATURE_FLAGS.VETWIKI_ENABLED`, a documented rollback (DECISIONS.md)
  whose readers include the question card's wiki link and the results screen;
  its comment no longer says the view has no URL.
- Unused exports: of the register's 136, 101 are named in no other file across
  src, api, scripts, tests, vca, ai, research and docs. 66 lost `export` (3
  declarations nothing used at all are deleted: `subjectById`,
  `isKnownSubject`, `countCJK`). Left listed: 33 in files on the exam or card
  path, the FSRS and SM-2 scheduler and motion-kit catalogues, user-data-schema
  (FRAG-3a will read `BACKUP_FIELDS`) and files other work is rewriting; 32
  whose name appears elsewhere (left for a closer look); 3 generated defaults.
- Found while checking: `isGoogleLandingHost` and `isNotionLandingHost` in
  `api/_lib/external-connections.js` are host guards nothing has called since
  they were added (4cff15e0, 7 Oct). They are dead, and a check of where a
  response landed would come too late anyway: the POST body is already sent.
  The gap they point at is real: the token exchange
  (`api/external-connect-callback.js:87`, client secret and code) and the
  Google refresh (`api/_lib/external-connections.js` `refreshGoogleAccess`,
  refresh token and client secret) follow redirects, so a 307/308 would resend
  the body elsewhere; revoke in the same file already uses `redirect: 'error'`.
  Left for its own change: add `redirect: 'error'` to those two fetches and
  delete the two guards.

## 6. VetWiki subjects (PROD-3): stopped, the omission is deliberate
- `src/lib/vetwiki/index.js` lists 21 of the 31 subjects in `note-corpus.js`
  by hand. The seven Year 2 subjects it lacks (Physiology III, Biochemistry II,
  Microbiology I, Histology, Physiology Lab I and II, Parasitology I) have no
  sourcing: 0 entries in `verification-generated.js` or `non-verifiable.js`,
  where Neuroanatomy, the one Year 2 subject in, has 262 and 13.
- `lint:wiki-coverage` requires every verifiable section of every wiki topic to
  carry a resolved source, and commit 72cca11a (16 Aug) brought Neuroanatomy in
  only after its sourcing pass and added Parasitology I and the two labs "as
  notes, not yet in the wiki". Adding the seven would fail that gate (and would
  also put them into VetMock AI's retrieval, which reads the same index).
- So no pages were added. Next step, when wanted: source the seven (or mark
  sections non-verifiable with reasons), then derive the index's subjects from
  `NOTE_SOURCES` minus an explicit pending list with a test that the two cannot
  differ silently.

## 7. Tool dependencies (DEP-6, DEP-11, DEP-3/4/5 safe part)
- Parked, not in this batch: one commit on branch
  `claude/debt-tools-after-finals` (pushed, not merged) updates
  `@playwright/test`/`playwright`/`playwright-core` 1.63.0 -> 1.65.0 (root, vca,
  research), `subset-font` 2.7.0 -> 2.9.0 (its `harfbuzzjs` 0.10.3 -> 1.6.4)
  and `meshoptimizer` 1.2.0 -> 1.3.0. Parsed lockfile diff: root 6 packages,
  vca 3, research 3, nothing else. It waits until after the finals (4 Dec): a
  test-runner upgrade twelve days before the exams only adds noise to the
  release gate, and a font lane is making font files with subset-font 2.7
  this week. This branch's e2e ran on 1.63, the runner the wave uses; the
  1.65 browsers are installed on this machine but were not compared.
- No other dev tool had a patch or minor (`@babel/*`, `youtubei.js`,
  `@napi-rs/canvas`, `esbuild`, `sharp`, `typescript` are current in their
  majors; `@vitejs/plugin-react` is Vite's and left to DEP-7).
- DEP-11: the TypeScript commit deduped `@types/node` 26.2.0 into 24.13.6 and
  dropped `@line/bot-sdk`'s nested copy (and two `undici-types`). The other
  duplicate pairs are transitive of shipped packages and were left.
- DEP-6: vca's `@electric-sql/pglite` is imported (through a ternary with
  `PGLITE_MODULE`), not dead. `@babel/helper-globals` is a bare pin with no
  recorded reason; research's `xlsx` still comes from cdn.sheetjs.com. Both
  left, listed by `lint:deps` as declared and unimported.
