# VetMock project knowledge base

Source checkpoint: **2026-10-08 · study 5.139.0 / SWv214**.
Subject cards share 85 course bookplates, with names, counts and availability
remaining live text. Source versions do not establish a production deployment;
use the dated acceptance receipts below for the deployed SHA and live checks.
Product entry: [vetmock.com](https://vetmock.com), currently a 307 to
[vetmock.vercel.app](https://vetmock.vercel.app). Research is a separate app at
[research.vetmock.com](https://research.vetmock.com).
Exact-SHA/backend/alias proof and remaining validation live in
[LAUNCH_READINESS.md](LAUNCH_READINESS.md). Source version, provider deployment,
live runtime and browser acceptance are separate facts.

VCA sources now have verified copies in owned storage. See
[`vca-archive.md`](./vca-archive.md) for the independent recovery manifest,
deduplication counts and restore command.

This is the current-state map for maintainers and coding agents. Historical
plans, changelogs, audits, and session logs explain how the system got here;
they are not sources for current counts or release status.

## Product boundary

VetMock is a standalone Thai-first veterinary study platform. It owns the
question bank, practice/exam/SRS engines, notes, learner analytics, groups, and
an intentionally approachable Imaging Practical.

It may consume CUVETSMO sources, but it does not rebuild the separate knowledge
backend, MCP, shared inference service, or advanced Imaging Pro workstation.
Imaging Practical stays narrow; advanced DICOM workflows belong at
`imaging.cuvetsmo.com`.

## Measured inventory

Run `npm run stats` before quoting current scale. The maintained generated
inventory is [content-inventory.md](content-inventory.md), also projected into
README by `npm run stats -- --write`. Check drift with `npm run stats:check`.
Do not duplicate totals in this map or treat a dated checkpoint as a live count.

VCA material is projected from `src/data/vca-materials.js` into the existing
library. Verified owned-storage copies retain the original Drive provenance;
source access and adapted scored practice remain distinct. The dated ingest
scope and unavailable older shortcut are in
[`vca-import-2026-09-05.md`](./vca-import-2026-09-05.md); recovery is in
[`vca-archive.md`](./vca-archive.md). Recount the source/catalog before quoting totals.

## System map

| Concern | Source of truth | Consumers / projections |
|---|---|---|
| VetMock Research | `research/`, its package/config/worker/runtime and owner-scoped IndexedDB | separate subdomain; on-device datasets, computation and exports; optional Supabase Auth |
| Curriculum | `src/data/curriculum.js` | selectors, schedule, study catalog |
| Subject bookplates | `src/data/subject-covers.js`, `src/components/SubjectCover.jsx` | Home/SubjectSelect; `lint:art` checks exact course coverage and the per-file budget |
| Question bodies | `src/data/questions-*.js` | generated bank/count/delivery registries |
| Note bodies | `src/data/notes-*.js` | `src/data/note-corpus.js` lazy subject map |
| Note availability | `NOTE_SOURCES` in `note-corpus.js` | NotesView, VetWiki runtime, notes registry |
| Governed knowledge | notes + evidence/review metadata | `src/lib/vetwiki/runtime*.js`, `/wiki/*` |
| Stable URLs | `src/lib/view-route.js` | App history and Vercel rewrites |
| PDF annotations | src/lib/pdf-annotations.js + src/lib/annotation-sync.js; atomic SQL source copy-of-record | owner-scoped IndexedDB + pdf_annotations; provider 20261001054615; separate backend/frontend proof |
| User study data | `src/lib/user-data-sync.js` | local-first store + Supabase replica |
| Imported JSON | `src/lib/user-data-schema.js` | backup + custom-question ingress |
| Atlas specimens | `src/data/atlas-catalog.js`, per-specimen conversion ledgers | generated asset registry, shared AtlasView, `/atlas/` discovery page |
| Atlas direct entry | `atlas.html`, `src/atlas-main.jsx` | `/app/atlas` opens without exam/account dependencies |
| Offline/update behavior | `public/sw.js`, `src/lib/app-lifecycle.js` | shared PWA update/retry rules; verified bounded Atlas model and shell caches |

### Atlas

The same AtlasView runs inside the main app and through a lightweight direct
entry. Vite dev/preview middleware and Vercel rewrites keep `/app/atlas`
consistent. The generated offline manifest follows static dependencies of that
entry plus its explicit lazy renderer; following unrelated dynamic exports of a
shared chunk would pull in the video corpus.

Offline readiness requires both verified model bytes and a complete cached
entry/dependency graph. HTML is committed after its dependencies, security
headers are retained, and irrelevant CORS/compression variants are removed from
verified offline copies. The last complete Atlas shell survives worker updates.
The shared catalog includes the Visible dog whole-body specimen (32 source
surfaces in 12 systems), the Stark skeletal/path model, CT organ surfaces and
skull specimens. Muscle and Bones in Visible dog remain composites. Source
review status is retained independently of software checks.
See [`veterinary-atlas-full-body.md`](./veterinary-atlas-full-body.md) for current
coverage and conversion evidence; [`veterinary-atlas-pilot.md`](./veterinary-atlas-pilot.md)
records the earlier skull pilot. Optional workstation assets are loaded only by
the dev plugin and are never automatically included in release builds.

### Notes and VetWiki

`note-corpus.js` is the only browser loader map for notes. Literal dynamic
imports split the six-megabyte corpus by subject. NotesView and VetWiki share
the loaded object and the registry generator reads the same definitions.

The v5.31.0 change reduced the NotesView gzip chunk from 631,956 to 36,331
bytes (94.3%). Lecture sections stay first and Vet 85 sections append with
their provenance. Failed imports are retryable; an online retry reloads with a
one-shot destination because native ESM caches a failed import for the document
lifetime.

### Persisted PDF annotation merge

`pdf-annotations.js` owns the client merge semantics; `annotation-sync.js` retains
the existing authenticated table-write path. The invoker trigger in
`supabase/migrations/20261001030000_pdf_annotations_atomic_merge.sql` merges each
write with the locked stored row, preserving ink and tombstones from old clients.
RLS, immutable row identity and the post-merge 8 MiB limit remain.
Provider version and verification receipts are in [Launch Readiness](LAUNCH_READINESS.md).
Other study-data sync is a separate contract.

### Backup and custom-question data

All imported JSON passes the shared Valibot schemas before a setter runs.
Imports cap file size, reject malformed renderer contracts, preserve compatible
extra fields, normalize legacy SR defaults, respect explicit empty data, and
show the exact overwrite scope. `streakData` is restored without inventing a
last-study timestamp.

## Research contracts

VetMock Research lives under `research/` and builds separately. It does not
share browser storage or sessions with the study origin. Datasets and exports
stay on device; the lazy auth client is the specific network exception. The
method/spec/registry/fixture pipeline owns verified numerical status.

Read [research/M2-DESIGN.md](research/M2-DESIGN.md) and the applicable
[M1 contract](research/M1-DESIGN.md) before changing statistical methods,
intake, owner-scoped persistence, charts or reports. These are dated build
contracts; their scaffold/stub descriptions are not today's release status.
A native-R CI failure remains a finding until its cause is reproduced and checked.

## OSS decisions

- Adopted: Vite literal dynamic imports and Valibot 1.4.2 in a lazy validation
  chunk.
- Deferred: FSRS until a versioned review-event ledger supports shadow
  comparison and truthful migration.
- Study app: defer TanStack Virtual, FlexSearch and a storage migration until
  measured evidence justifies their UX/data risk. Research already uses
  owner-scoped IndexedDB and its own installed TanStack Virtual dependency;
  its adoption does not migrate the study app.
- Retained: the domain-specific service worker because its API privacy,
  controlled activation, and offline contracts are already explicit and tested.

Evidence and license matrix:
[`oss-adoption-audit-2026-08-21.md`](./oss-adoption-audit-2026-08-21.md).

## Release gate

Run the current gate from one stable checkout:

```powershell
npm run gate
npm audit --audit-level=high
```

The gate covers data/unit in Bangkok and UTC, build, dist contrast, and all four
browser profiles. Risk-specific failure-path checks supplement it. Production
requires separate proof of exact SHA, GitHub Build + Smoke, Vercel Production
deployment and a live changed journey on the actual origin. Research changes
also require its own unit/build/E2E checks and Research R parity workflow.
`gate:data` is diagnosis, not full acceptance. Keep broad gates quiet and
retain original failures alongside isolated reruns.

Vercel skips root/docs/internal Markdown-only, `.github/**`, `tests/**`, and
Playwright-config-only commits. `wiki/**/*.md` is public prerender input and
remains deploy-worthy. Do not broaden these exclusions without checking the
resulting Git pathspec.

## Historical release evidence

The following receipts apply only to the named releases.

v5.56.0 evidence (2026-08-31):

- Local gates passed: 402 unit tests, all generated/data/content checks,
  production build with 209 VetWiki prerenders, dependency audit 0, targeted
  interaction E2E 16/16, mobile compatibility 2/2, and production console /
  same-origin request errors 0.
- GitHub Build `33386364695` succeeded for exact SHA `a6dfad1`.
- GitHub Smoke E2E `33386364715` succeeded cleanly: 192 passed, 40 deliberate
  project-matrix skips, 0 failed, and no flaky retry.
- Vercel Production deployment `6180037450` succeeded for `a6dfad1`; the
  learner-facing bundle is v5.56.0 from `c3eb40e`, while `a6dfad1` changes only
  its deterministic matching-question smoke guard.
- The production alias exposed SW `v122-2026-08-31` and passed 4/4 live changed-
  capability journeys for landing consent/login, compact menu rotation and
  focus, observer-driven chrome, and Home onboarding.
- Question lint has 0 blocking errors. Its 18 source-position advisories are
  neutralized in the learner UI by session-stable option shuffling and remain
  tracked as data-quality nudges rather than runtime defects.

Historical v5.31.0 evidence (2026-08-21):

- 218 unit tests passed.
- All generated/data/content gates passed; dependency audit found 0 issues.
- GitHub Build run `32415996906` succeeded.
- GitHub Smoke E2E run `32415996900` succeeded: 144 passed, 40 deliberate
  project-matrix skips, 0 failed.
- Vercel Production deployment `6010442139` succeeded for commit `3e85fb5`.
- Production alias passed 20 targeted journeys, including Notes/VetWiki,
  stable routes, mobile onboarding, modal accessibility, and offline Notes
  recovery unique to v5.31.0.

## Documentation map

- [`../AGENTS.md`](../AGENTS.md) — mandatory project/agent rules
- [`../STABILITY.md`](../STABILITY.md) — recurring bug guardrails
- [`LAUNCH_READINESS.md`](./LAUNCH_READINESS.md) — current release verdict
- [CONTINUOUS-IMPROVEMENT.md](CONTINUOUS-IMPROVEMENT.md) — shared cross-harness ownership and loop acceptance
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — visual and accessibility contract
- [`UX_AUDIT.md`](./UX_AUDIT.md) — historical findings + implementation status
- [`../ADDING-QUESTIONS.md`](../ADDING-QUESTIONS.md) — question intake crank
- [`../SECURITY.md`](../SECURITY.md) — threat model and hardening history
- [`../DECISIONS.md`](../DECISIONS.md) — durable architecture decisions
- [`../RISKS.md`](../RISKS.md) — product/technical risk register; dated mitigations need reverification
- [data-durability-and-operations.md](data-durability-and-operations.md) — durability and operations
- [audit-remediation-2026-09-07.md](audit-remediation-2026-09-07.md) — dated repair register
- [handoff/history-2026-09-30/](handoff/history-2026-09-30/) — lossless archived handoffs

Durable cross-session context is mirrored in the MycOS VetMock project hub and
the local `vetmock-project-operations` skill. Update those after a substantial
release; do not rewrite dated historical evidence as though it were current.
