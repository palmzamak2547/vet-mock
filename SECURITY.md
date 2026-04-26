# Security Notes — VetMock

This file documents the security posture of vet-mock and is meant for the
maintainer (Vet 86). Not user-facing.

## Threat model

VetMock is a study app, not a banking app. We're protecting against:

| Threat | Severity | Mitigation status |
|---|---|---|
| Spam: anyone hitting `/api/send-feedback` to flood mailbox / drain Resend quota | High | ✅ Rate-limited 3/10min/IP + tightened CORS |
| Spam: anyone hitting `/api/playlist` to drain YouTube quota | Medium | ✅ Rate-limited 30/min/IP + tightened CORS |
| XSS through user input rendered via `dangerouslySetInnerHTML` | High if present | ✅ Audited — no `dangerouslySetInnerHTML` in code; React JSX auto-escapes; `RichText` whitelists 4 inline tags only |
| Stolen Supabase anon key | Low | ✅ Anon key is designed to be public — Row-Level Security (RLS) gates everything |
| RLS misconfiguration → data leak across users | High | ⚠️ See [RLS audit checklist](#rls-audit-checklist) below |
| Stolen service-role key (full DB access) | Critical | ✅ Service-role key is NEVER in frontend; not currently used by any API function either |
| Leaked Resend / YouTube / Supabase keys via Git | Critical | ✅ `.gitignore` blocks `.env*`; `.env.example` only shows variable names |
| Email injection through feedback form (`Subject:`, headers) | Medium | ✅ Server-side sends via Resend HTTP API, never builds raw RFC 822 — header injection not possible |
| Open redirect / phishing | Low | ✅ No redirect endpoints |
| Iframe clickjacking | Low | ✅ `X-Frame-Options: SAMEORIGIN` |
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

Quick-test as anonymous client: try `select * from user_data;` — must return only
empty / own row.

## CORS allow-list

Edit `api/_lib/rate-limit.js → allowedOrigin()` when:

- Adding a new production domain
- Adding a development port

Don't broaden to `*` for routes that send mail or hit external paid APIs.

## CSP (Content Security Policy)

Currently **not enforced**. Adding CSP is preferred eventually but blocks
inline `<style>` and inline event handlers — needs a careful pass through React
inline styles. A tracked future improvement, not a critical gap.

If added later, the policy needs to permit:
- `default-src 'self'`
- `script-src 'self'` (no `unsafe-eval`; Vite production output is safe)
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` (inline JSX styles widespread)
- `font-src 'self' https://fonts.gstatic.com`
- `img-src 'self' data: https://img.youtube.com https://i.ytimg.com`
- `connect-src 'self' https://*.supabase.co`
- `frame-src https://www.youtube.com https://www.youtube-nocookie.com`
- `object-src 'none'`

## Reporting

Found something? Use the in-app `แจ้งปัญหา` form, or email
palmzamak2547 [at] gmail.com with subject `[security]`.

Last review: 2026-04-26
