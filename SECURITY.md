# Security Notes — VetMock

This file documents the security posture of vet-mock and is meant for the
maintainer (Vet 86). Not user-facing.

## Hardening pass — 2026-09-02 (v5.61.1)

Findings from a whole-repo review checked against the live database
(read-only: the Supabase security advisor plus `pg_policies`).

- **Rate-limit windows.** The in-memory fallback swept any bucket idle for
  60 s, whatever its window, so every 24-hour provider budget
  (`provider:llm:daily`, `provider:resend:daily`, ...) reset after one quiet
  minute on any instance running without Upstash. Buckets now live exactly as
  long as their own window (`tests/unit/rate-limit-window.test.mjs`).
- **`/api/library-blob` mime hygiene.** The catalog is curated, but the route
  answers on the app origin under a CSP that allows inline script; a row whose
  mime said `text/html` or `image/svg+xml` would have rendered inline there.
  Those types are now served as `application/octet-stream` downloads.
- **`/api/library-file` header hygiene.** A malformed `Authorization` header
  (anything that is not JWT-shaped) is treated as anonymous instead of making
  the upstream request fail and surface as `catalog_unavailable`.
- **`/api/grade-summary`** gets a bounded upstream call (clean 504) and the
  shared depth-walking JSON parser instead of a greedy regex that broke on
  trailing junk. **`/api/playlist`** upstream calls are bounded too.
  **`/api/tts`** looks voices up by own property only (`constructor` /
  `__proto__` no longer reach the upstream as a voice name) and treats a
  non-numeric rate as 1x instead of sending `NaN%`.
- **`pdf_annotations` copy of record.** The table behind cross-device pen sync
  existed only in production. `20260902000000_pdf_annotations_copy_of_record.sql`
  reproduces it, its 8 MB row guard and its owner-only policies, and restores
  the anonymous-write revoke the table missed by being created after the
  2026-08-24 baseline (RLS already denied anon every row; this is the second
  lock). Idempotent over the live table; apply with `supabase db push`.
- Advisor state at review: 0 errors. The remaining WARNs are the intentional
  SECURITY DEFINER RPCs documented in their migrations, plus the dashboard-only
  "leaked password protection" toggle still listed under manual steps below.

## Data-ingress hardening — 2026-08-21 (v5.31.0)

- Added Valibot 1.4.2 (MIT, zero dependencies) as a lazy validation chunk; it
  is not preloaded on the public landing/home path.
- Backup and custom-question JSON now validate types, renderer contracts,
  bounded sizes, relative MCQ answer indices, SR-card shape, and safe record
  keys before any local/cloud setter runs.
- Malformed files fail closed with a plain-language location; valid files show
  exact overwrite scope. Explicit empty arrays/objects are honored rather than
  skipped by truthiness checks.
- Backup v5.1 preserves complete `streakData`; legacy numeric streak restore no
  longer fabricates a study timestamp.
- Verification: schema unit tests, real browser upload of malformed and valid
  fixtures, dependency audit 0, CI build/smoke, and production flow coverage.

## Hardening pass — 2026-08-11

- `npm audit` reports **0 vulnerabilities** across production and development dependencies.
- Kept VetMock's focused Imaging Practical at `#lab` and the full Imaging Pro
  workstation as a distinct handoff to `https://imaging.cuvetsmo.com`.
- Pinned the compatible Cornerstone 4.22.13 line and `dicom-parser` 1.8.21.
  Patched transitive `js-yaml` and unused loader `uuid` advisories with audited
  package overrides; the legacy CommonJS Vite bridge remains removed.
- Cornerstone, codecs, workers, and WASM stay in a lazy chunk excluded from
  module preload, so ordinary study sessions do not download the imaging stack.
- Upgraded the build chain to Vite 6.4.3 and Sharp 0.35.3.
- Production counts, registries, curriculum links, and generated docs are checked
  by `npm run lint:all`; connected study paths are covered by Playwright.

## Whole-system release pass — 2026-08-12

- `npm audit` reports **0 vulnerabilities** across 503 production/development/
  optional/peer dependencies on the v5.27.0 release tree.
- Public auth errors no longer lazy-load or expose provider-dashboard setup help.
- Auth-required direct routes retain their URL and render a sign-in boundary;
  protected Race and Review Queue views do not mount while signed out.
- Unknown `/app/*` routes canonicalize to Home instead of reviving a stale view
  stored by a previous session.
- VetWiki browser chunks are generated from the canonical evidence corpus and
  checked for missing, changed and extra stale projection files in `lint:all`.
- Cross-engine release coverage includes direct routes, focus containment,
  WebKit focus return, accessible form names, DICOM Practical, Wiki evidence and
  deliberate network-failure recovery.

## Hardening pass — 2026-05-10

Applied with zero UX impact:

**Vercel headers** (`vercel.json`):
- `X-Frame-Options: DENY` (was SAMEORIGIN)
- `Content-Security-Policy` enforced (was Report-Only) — `frame-ancestors 'none'`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (2 yr + preload)
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Origin-Agent-Cluster: ?1`
- `Permissions-Policy` — disabled all dangerous features (camera/mic/USB/payment/etc)

**Supabase** (migration `security_harden_function_search_path_and_execute_grants`):
- All 5 SECURITY DEFINER functions: `SET search_path = public, pg_temp;` (prevents schema-shadowing)
- Trigger functions `handle_new_user` + `handle_new_user_data`: `REVOKE EXECUTE FROM PUBLIC, anon, authenticated;` (no longer RPC-callable)
- RLS-helper functions (`is_group_member`, `get_user_group_ids`, `ensure_profile`): revoked anon EXECUTE; authenticated kept (used by app + RLS)
- Result: 14 advisor warnings → 4 (3 intentional · 1 admin-only)

**Frontend** — tracking-pixel defense:
- New `src/lib/safe-url.js` — `safeImageUrl()` with allow-list of trusted hosts + `sanitizeSharedQuestionData()` for shared Q payloads
- Applied at SOURCE: `lib/api.js shareQuestion()` strips bad URLs before Supabase write
- Applied at SINK: 3 image render sites (Question · ReviewView · SRSessionView) re-check via `safeImageUrl` before render
- Defense in depth — group member tracking-pixel attack neutralized

**Manual steps remaining** (Supabase dashboard, NOT code):
- Enable Auth → Settings → "Leaked password protection" (HaveIBeenPwned check). Reduces account-takeover risk for shared passwords.
- (Optional) Enable Auth → Settings → MFA / TOTP for admin-tier users
- (Optional) Auth → Email → Set rate limits per email/IP

**Historical npm audit state:** 2 moderate findings existed at this point and
were cleared by the 2026-08-11 overrides documented above.

## Hardening pass — 2026-05-20 (Palm 10/10 audit)

**Historical npm audit state (superseded 2026-08-11):**
- 7 moderate (was 10 before fix) — ALL in the Cornerstone3D dependency chain (`@kitware/vtk.js` → `xmlbuilder2` → `js-yaml`; plus `uuid <11.1.1` in dicom-image-loader). No upstream fixes available yet.
- **Containment**: Cornerstone is loaded ONLY on `/lab` (Imaging Lab, accessed via `#lab` hash — not surfaced in nav). The `vendor-cornerstone` chunk is excluded from `modulePreload` (see `vite.config.js`) so unaffected users never download the vulnerable code.
- **Usage**: lab opens user-provided local DICOM files in-browser; no network exfil from cornerstone.
- **Action**: monitor for `@cornerstonejs/core` upgrade that bumps vtk/uuid. Set Dependabot to watch the cornerstone meta-package.

**A11y**:
- WCAG 2.4.1 — `<main id="main">` landmark + visible-on-focus skip link added to App.jsx
- WCAG 2.5.5 — touch targets ≥44px enforced via `:where()` rule on all interactive surfaces incl. footer anchors
- A11y review: keyboard nav now bypasses header chrome cleanly

**Lint hardening**:
- Position bias mitigated structurally via render-time option shuffle in `Question.jsx::MCQOptions` (per-Q + per-session seeded Fisher-Yates; honors `noShuffle` flag and pins "All of the above"-style tail options). Linter rule downgraded to warn (data-level nudge for authors).
- Markdown ** check removed: `RichText` renders `**bold**` correctly and `stripForSpeech` / `stripRichText` handle it for non-markdown sinks.

## Threat model

VetMock is a study app, not a banking app. We're protecting against:

| Threat | Severity | Mitigation status |
|---|---|---|
| Spam: anyone hitting `/api/send-feedback` to flood mailbox / drain Resend quota | High | ✅ Rate-limited 3/10min/IP + Origin-aware CORS (allows same-origin POSTs that omit Origin — iPad Safari quirk; blocks unknown cross-origin) |
| Spam: anyone hitting `/api/playlist` to drain YouTube quota | Medium | ✅ Rate-limited 30/min/IP + Origin-aware CORS (allows same-origin GETs that omit Origin, blocks unknown cross-origin) |
| XSS through user input rendered via `dangerouslySetInnerHTML` | High if present | ✅ Audited — no `dangerouslySetInnerHTML` in code; React JSX auto-escapes; `RichText` whitelists 4 inline tags only |
| Stolen Supabase anon key | Low | ✅ Anon key is designed to be public — Row-Level Security (RLS) gates everything |
| RLS misconfiguration → data leak across users | High | ⚠️ See [RLS audit checklist](#rls-audit-checklist) below |
| Stolen service-role key (full DB access) | Critical | ✅ Service-role key is NEVER in frontend; not currently used by any API function either |
| Leaked Resend / YouTube / Supabase keys via Git | Critical | ✅ `.gitignore` blocks `.env*`; `.env.example` only shows variable names |
| Email injection through feedback form (`Subject:`, headers) | Medium | ✅ Server-side sends via Resend HTTP API, never builds raw RFC 822 — header injection not possible |
| Open redirect / phishing | Low | ✅ No redirect endpoints |
| Iframe clickjacking | Low | ✅ `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |
| MIME-confusion attack | Low | ✅ `X-Content-Type-Options: nosniff` |
| Stale chunk after deploy → user stuck | Low | ✅ `vite:preloadError` → auto-reload once |

## What lives where

| Secret | Location | Should-be-public? |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend (build-time) | Yes — public URL of project |
| `VITE_SUPABASE_ANON_KEY` | Frontend (build-time) | Yes — designed for client-side, RLS enforces |
| `RESEND_API_KEY` | Vercel env (server-only) | **No** — gives full Resend account access |
| `YOUTUBE_API_KEY` | Vercel env (server-only) | **No** — has per-day quota |
| Supabase **service-role key** | Not used anywhere | **No** — would bypass RLS |

If `RESEND_API_KEY` or `YOUTUBE_API_KEY` ever leaked: rotate immediately at the
provider dashboard, push a new value via Vercel CLI or dashboard, and check
provider logs for unauthorized usage.

## RLS audit checklist

Run this in Supabase SQL editor periodically (especially after schema changes):

```sql
-- 1) Every public table must have RLS ON
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;
-- Expected: empty
```

```sql
-- 2) See policies per table
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Tables that should be locked down:

| Table | Rule |
|---|---|
| `profiles` | SELECT public · UPDATE only own row |
| `user_data` | SELECT/INSERT/UPDATE only own `user_id` |
| `exam_results` | SELECT/INSERT only own `user_id` (leaderboard reads via aggregated view or with profile join) |
| `groups` | SELECT public OR via group-membership · UPDATE/DELETE only `created_by` |
| `group_members` | SELECT visible to group members · INSERT/DELETE rules per role |
| `shared_questions` | SELECT visible to group members · INSERT by group members · DELETE by author or group admin |
| `pdf_annotations` | SELECT/INSERT/UPDATE/DELETE only own `user_id` — one row per (user, document), merged client-side; `anon` has no grants |

Quick-test as anonymous client: try `select * from user_data;` — must return only
empty / own row.

## CORS allow-list

Edit `api/_lib/rate-limit.js → allowedOrigin()` when:

- Adding a new production domain
- Adding a development port

Don't broaden to `*` for routes that send mail or hit external paid APIs.

## CSP (Content Security Policy)

Enforced since the 2026-05-10 pass; the live policy is the
`Content-Security-Policy` header in `vercel.json`. Two things worth knowing
before editing it:

- `script-src` carries `'unsafe-inline'` for the anti-FOUC theme script in
  `index.html`. It means any HTML that renders on the app origin can run
  script, which is why `/api/library-blob` refuses to serve HTML / SVG /
  script mime types inline (2026-09-02).
- A new host must be added to `connect-src` / `img-src` / `frame-src` before
  the client can reach it; the failure mode is a silent block in the browser
  console, not an error the student sees.

## Reporting

Found something? Use the in-app `แจ้งปัญหา` form, or email
palmzamak2547 [at] gmail.com with subject `[security]`.

Last review: 2026-09-02
