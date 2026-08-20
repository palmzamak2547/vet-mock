# VetMock project knowledge base

Last verified: **2026-08-21 · v5.31.0 · commit `3e85fb5`**
Production: [vetmock.vercel.app](https://vetmock.vercel.app)

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

Run `npm run stats` before quoting current scale. The verified v5.31.0
checkpoint is:

| Metric | Value |
|---|---:|
| Source questions | 4,506 |
| Learner-ready questions | 4,480 |
| Fail-closed pending verified figures | 26 |
| Question-bank files | 65 |
| Subjects with questions | 42 |
| Note files / topics / sections | 37 / 376 / 4,032 |
| Note sections with source locator | 100% |
| Video summaries | 400 |
| Governed VetWiki topics / sections | 208 / 1,769 |
| Verified claims / distinct external sources | 3,216 / 2,093 |

Generated detail: [`content-inventory.md`](./content-inventory.md).

## System map

| Concern | Source of truth | Consumers / projections |
|---|---|---|
| Curriculum | `src/data/curriculum.js` | selectors, schedule, study catalog |
| Question bodies | `src/data/questions-*.js` | generated bank/count/delivery registries |
| Note bodies | `src/data/notes-*.js` | `src/data/note-corpus.js` lazy subject map |
| Note availability | `NOTE_SOURCES` in `note-corpus.js` | NotesView, VetWiki runtime, notes registry |
| Governed knowledge | notes + evidence/review metadata | `src/lib/vetwiki/runtime*.js`, `/wiki/*` |
| Stable URLs | `src/lib/view-route.js` | App history and Vercel rewrites |
| User study data | `src/lib/user-data-sync.js` | local-first store + Supabase replica |
| Imported JSON | `src/lib/user-data-schema.js` | backup + custom-question ingress |
| Offline/update behavior | `public/sw.js`, `src/main.jsx` | PWA cache and update/retry UI |

### Notes and VetWiki

`note-corpus.js` is the only browser loader map for notes. Literal dynamic
imports split the six-megabyte corpus by subject. NotesView and VetWiki share
the loaded object and the registry generator reads the same definitions.

The v5.31.0 change reduced the NotesView gzip chunk from 631,956 to 36,331
bytes (94.3%). Lecture sections stay first and Vet 85 sections append with
their provenance. Failed imports are retryable; an online retry reloads with a
one-shot destination because native ESM caches a failed import for the document
lifetime.

### Backup and custom-question data

All imported JSON passes the shared Valibot schemas before a setter runs.
Imports cap file size, reject malformed renderer contracts, preserve compatible
extra fields, normalize legacy SR defaults, respect explicit empty data, and
show the exact overwrite scope. `streakData` is restored without inventing a
last-study timestamp.

## OSS decisions

- Adopted: Vite literal dynamic imports and Valibot 1.4.2 in a lazy validation
  chunk.
- Deferred: FSRS until a versioned review-event ledger supports shadow
  comparison and truthful migration.
- Deferred: TanStack Virtual, FlexSearch, and IndexedDB until measured product
  evidence justifies their UX/data-migration risk.
- Retained: the domain-specific service worker because its API privacy,
  controlled activation, and offline contracts are already explicit and tested.

Evidence and license matrix:
[`oss-adoption-audit-2026-08-21.md`](./oss-adoption-audit-2026-08-21.md).

## Release gate

Normal local baseline:

```powershell
npm run test:unit
npm run lint:all
npm run build
npm audit --audit-level=high
```

Then run targeted browser coverage. Production requires separate proof of the
exact Git SHA, GitHub Build, GitHub Smoke E2E, Vercel Production deployment,
and a live journey against the production alias.

Vercel skips root/docs/internal Markdown-only commits, but `wiki/**/*.md` is
public prerender input and remains deploy-worthy. Do not broaden the Markdown
exclude without checking the resulting Git pathspec.

v5.31.0 evidence:

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
- [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — visual and accessibility contract
- [`UX_AUDIT.md`](./UX_AUDIT.md) — historical findings + implementation status
- [`../ADDING-QUESTIONS.md`](../ADDING-QUESTIONS.md) — question intake crank
- [`../SECURITY.md`](../SECURITY.md) — threat model and hardening history
- [`../DECISIONS.md`](../DECISIONS.md) — durable architecture decisions
- [`../RISKS.md`](../RISKS.md) — active product/technical risks

Durable cross-session context is mirrored in the MycOS VetMock project hub and
the local `vetmock-project-operations` skill. Update those after a substantial
release; do not rewrite dated historical evidence as though it were current.
