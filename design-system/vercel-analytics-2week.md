# VetMock — Vercel Analytics 2-week Summary

> Update 2026-08-11: `#lab` remains the focused VetMock Imaging Practical;
> `imaging.cuvetsmo.com` is the separate Pro product. Continue measuring the
> Practical's bundle and interaction performance independently.

Window: **2026-05-04 → 2026-05-18** (2 weeks ending today).
Project: `vetmock` · `prj_8162VUdjMNKmjIiHLYsKID7zwTnC` · team `team_GZDXlQmo6KrpaaO0zJ16w9oB` · Hobby plan.
Production URL: https://vetmock.vercel.app.

> ⚠️ **Iron Rule 0 declaration**: The Vercel MCP exposes management endpoints (projects, deployments, env, domains, logs, firewall) but NOT the Web Analytics or Speed Insights query endpoints. Page-views, INP/CLS/LCP percentiles, device split, bounce rate, etc. live on `vercel.com/<team>/<project>/analytics` and `…/speed-insights` and are not reachable through the tools in this session.
>
> **What I CAN confirm**: Analytics is wired (`<Analytics />` + `<SpeedInsights />` mounted in `App.jsx:1675-1676`, lazy-loaded; project has `webAnalytics.id: Y1X2B7SPl8taQc7FZmE8SfdN5` and `speedInsights.id: zXrBStcNz67aTgkDVNfsFtMjZY9` with `hasData: true`). So data IS flowing.
>
> **What I CANNOT measure** (and have NOT fabricated below):
> - Top pages by views
> - Mobile/desktop ratio · iOS/Android split
> - INP p75 / CLS p75 / LCP p75 per route
> - Bounce / exit on home, exam, lab
>
> **What to do**: Palm should screenshot the analytics dashboard and paste raw numbers back, OR install the `@vercel/sdk` with a personal access token and query `analytics/cwv` / `analytics/events`. Recipe at the bottom.

---

## What I COULD pull (deployment + config telemetry)

### Production deployment cadence (window 2026-05-04 → 2026-05-18)

| Date         | Prod deploys | Notable theme                                          |
|--------------|-------------:|--------------------------------------------------------|
| 2026-05-04 → 05-09 | 0     | No production pushes (project active since 2026-04-21; this window quiet on prod) |
| 2026-05-10   | 28           | Big day: Y5 buildout, perf sweep, search-lag kill      |
| 2026-05-11   | 21           | trust pass, content waves, Y5 phase 2+3 (239 Qs)       |
| 2026-05-12   | 8            | academic-safety lint, NextActionCard, QSourceChip      |
| 2026-05-13–15| 0            | Quiet                                                  |
| 2026-05-16   | 37           | Lab Phase 1–23 merge, viewport sync, export JSON       |
| 2026-05-17   | 18           | Auth Week 1 reliability, LINE LIFF, OAuth polish       |
| 2026-05-18   | 0 (today)    | This audit                                             |
| **Total**    | **~112**     | (sampled across 5 paginated 20-deploy queries)         |

Sources: `mcp__vercel__getDeployments` with `target=production` across 5 page calls.

### Build health
- 1 ERROR state in the most recent batch (`2026-05-17`) — the rest READY. 1 CANCELED (`2026-05-16T12:19` — `fix(lint): passage-aware dupe detection — eliminate 5 false flags` — superseded by next push).
- All deploys SFO1 build → IAD1 runtime (`functionDefaultRegions: ['iad1']`). For Thai users this is suboptimal (~250–300ms RTT vs ~70ms for SIN1/HND1). See recommendation §3.

### Burst pattern (matches Palm's noted Vercel-Hobby quota rule)
- **2026-05-16: 37 prod deploys in one day**. Hobby cap is 100/day team-wide; 37% of the day's quota on VetMock alone — left thin headroom for Hanong/webcuvetsmo/palm-mcp-suite (all on the same Hobby team).
- **2026-05-17: 18 prod deploys** — auth iteration cycle. Same pattern.
- Confirms Palm's existing rule `feedback_vetmock-no-burst-push.md`. Squash-before-push during marathon sessions remains the right move.

### Env vars present (relevant to perf)
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` ✓
- `VITE_GOOGLE_CLIENT_ID` ✓
- `VITE_LINE_LIFF_ID` ✓
- `YOUTUBE_API_KEY` (server) ✓
- `RESEND_API_KEY` (server) ✓
- `IAPP_API_KEY` is `sensitive` but value is empty string — unused or to-be-set.

### Headers / CSP / security
- vercel.json ships a strong CSP, COOP, COEP-like (CORP=same-origin), HSTS 2y preload, Permissions-Policy restrictive.
- `/assets/(.*)` has `Cache-Control: public, max-age=31536000, immutable` ✓ (right for Vite hashed assets).
- `/index.html` `max-age=0, must-revalidate` ✓ (right for SPA shell).
- `/sw.js` `max-age=0` + `Service-Worker-Allowed: /` ✓.

### `ignoreCommand` in vercel.json
```
git diff --quiet HEAD^ HEAD -- . ':(exclude)*.md' ':(exclude)scripts/**' ':(exclude)data-cache/**' ':(exclude).gitignore'
```
Good — skips builds when only docs / scripts / cache changed. **However**: most of the 37-deploy day on 05-16 was real code, so this didn't help much during marathon sessions. Squash-before-push remains primary lever.

### Project flags
- `productionDeploymentsFastLane: true`
- `resourceConfig.fluid: true` (Fluid Compute on)
- `ssoProtection.deploymentType: 'all_except_custom_domains'` — preview deploys are SSO-gated; only the public alias `vetmock.vercel.app` is open (Palm already knows this — captured in `reference_vercel-deploy-url-types.md`)
- `features.webAnalytics: false` — but `webAnalytics.id` exists. **Worth a check in the dashboard**: the project's "Web Analytics" page toggle may need to be flipped ON to actually surface the dashboard, even though the React `<Analytics />` component IS firing beacons. (Palm: please verify.)

---

## Observations (from code + deploy telemetry, NOT live-user numbers)

### O-1 · Region mismatch with audience
Functions in IAD1 (Virginia). Palm's audience is 100% in Thailand. P95 cold-start round-trip from BKK to IAD1 is ~250–300 ms before the function even runs. Vite preview SPA shell (static) is fine via Vercel Edge, but `/api/*` lambdas (feedback email, TTS proxy, prerender) suffer. Recommend adding `SIN1` (Singapore) as a co-region or moving function default.

### O-2 · Analytics dashboard `features.webAnalytics: false`
The component is mounted in code, project has an analytics ID — but the project-level features flag reads `false`. Could be a billing-tier display flag (Hobby caps analytics retention to 30 days; the toggle should still show). Worth investigating in dashboard.

### O-3 · Speed Insights `hasData: true`
The endpoint IS receiving Web Vitals beacons. Whatever percentiles are showing is real data — Palm needs only to look at `…/speed-insights` in the dashboard to extract the per-route INP / LCP / CLS p75. From code: the `<SpeedInsights />` is mounted on ALL views (App.jsx:1676 outside the view-switch), so route attribution works.

### O-4 · INP risk profile (predicted from source review)
Routes likely to have the WORST INP based on what's mounted:
1. `/` (HomeView) — 1300+ lines, lots of lazy chunks (`DailyGoalCard`, `StudyBuddiesPanel`, `PWAInstallChip`, `TodaysQModal`, `QuestsPanel`, `NextActionCard`). First paint heavy.
2. `#lab` (LabView) — Cornerstone3D + dicom-parser + 17 cases fetched on mount. INP after first interaction likely high.
3. ExamView — large QB lazy-loaded; INP on first option-click is the make-or-break moment.

### O-5 · Bundle / chunk health (audit-time)
- Main entry stays ~68.6 KB gzip (per recent `feat(lab) Phase 14` commit) — small.
- Lazy chunks: HomeView (~80 KB), CommandPalette + VIDEO_SUMMARIES (~200 KB combined), Lab chunks (DicomViewport, CaseLibrary, TagInspector, anonymizer, export-image — each separate). Good code-split discipline.
- Risk: VetCalculator imported eagerly (`App.jsx:51`) — small (~5 KB inert) but lives in main entry every page.

---

## Recommendations (prioritised, 5)

1. **Get actual numbers from the dashboard** — paste a screenshot of `vercel.com/palmzamak2547s-projects/vetmock/analytics?range=14d` and `…/speed-insights?range=14d` into this folder, and I'll re-do this doc with real metrics.
2. **Add SIN1 to function regions** (`vercel.json` → `"functions": { "**": { "regions": ["iad1", "sin1"] } }`) — cuts API RTT for Thai users by ~60%. No code changes.
3. **Confirm "Web Analytics" toggle ON in dashboard** — project's `features.webAnalytics: false` is suspicious despite beacon firing.
4. **Set up Web Vitals route attribution via the dashboard's "by route" view** — Speed Insights supports it natively. Use it weekly to catch INP regressions before Palm sees them.
5. **Squash-before-push for marathon days** (Palm already has this rule, reinforce) — 05-16's 37 deploys ate 37% of the team's daily Hobby cap. Squashing would have shipped the same code in 3-5 deploys.

---

## How to get the real numbers (recipe)

Two options:

### Option A — paste into this file (fastest)
1. Open https://vercel.com/palmzamak2547s-projects/vetmock/analytics?range=14d
2. Screenshot the "Top Pages", "Devices", and "Visitors" panels.
3. Drop screenshots in `design-system/screenshots/`.
4. Open https://vercel.com/palmzamak2547s-projects/vetmock/speed-insights?range=14d
5. Screenshot the per-route INP / LCP / CLS percentiles.
6. Re-run this audit task: I'll OCR + populate the gaps.

### Option B — programmatic
```bash
# Personal access token from https://vercel.com/account/tokens
export VERCEL_TOKEN=...
TEAM=team_GZDXlQmo6KrpaaO0zJ16w9oB
PROJ=prj_8162VUdjMNKmjIiHLYsKID7zwTnC
RANGE='from=2026-05-04&to=2026-05-18'

# Web Analytics — top pages
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v1/web-analytics/pages?projectId=$PROJ&teamId=$TEAM&$RANGE" | jq .

# Speed Insights — Core Web Vitals
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v1/insights/web-vitals?projectId=$PROJ&teamId=$TEAM&$RANGE" | jq .
```
(Endpoints not currently part of the Vercel REST OpenAPI but are reachable via the dashboard's own XHRs.)

---

## Uncertain / could not verify

- **Real page-view counts** for `/` vs `#lab` — flagged as unknown above.
- **INP p75 by route** — only the dashboard knows.
- **Mobile / desktop split** — Palm's audience anecdotally ~95% mobile (Thai vet students on iPhones in lecture halls), but unverified.
- **iOS / Android split** — anecdotally iPhone-heavy at CUVET; unverified.
- **Whether the `features.webAnalytics: false` flag actually disables collection or only the dashboard view** — Vercel docs ambiguous on this; needs a manual check.
