# Chula sign-in wall

Palm, 1 Nov 2026: every visitor to VetMock signs in with a Chula email before using
the app, as safe and stable as possible, better than cuvetsmo.com in every way.

## Who counts as Chula

An account is a **member** when it holds a Google identity whose email Google has
verified and whose domain is exactly `student.chula.ac.th` or `chula.ac.th`. The
one account in `public.admin_users` is also let through, so the back office can
never lock its owner out.

Evidence (1 Nov 2026, read-only):

| Source | What it shows |
|---|---|
| VetMock `auth.identities` | 13 Google identities on `student.chula.ac.th`, every one with `email_verified` and the hosted-domain claim `hd = student.chula.ac.th`; no other Chula domain among 45 accounts |
| cuvetsmo.com | its sign-up trigger and client check have allowed exactly `chula.ac.th` and `student.chula.ac.th` since its first migration |
| Auth settings | email sign-up is auto-confirmed (`mailer_autoconfirm`), so an email address on an email/password account was never proven; mail goes through Gmail SMTP at 30 an hour |

So the proof is the Google identity, never the account's own email or a UI hint:
- an auto-confirmed email/password account could claim any Chula address;
- Google verifies the mailbox, and Chula's Workspace signs students in through
  Chula's own portal;
- 30 mails an hour cannot carry an email code for a whole cohort arriving at once.

Exact domains only: `x@vet.chula.ac.th` is refused. Add a domain in one place,
`CHULA_DOMAINS` in `src/lib/chula.js` and `public.is_chula_email` in the
migration (a unit test keeps the copies equal).

## Layers, each standing on its own

| Layer | Where | What it refuses |
|---|---|---|
| Creation gate | `public.hook_before_user_created` (Auth hook) and the `chula_only_signup` trigger on `auth.users` | any new account that is not Google with a verified Chula email; nothing else can create one, so no Chula address can be pre-registered with a password |
| Data API | PostgREST `db_pre_request` = `public.chula_pre_request()` | every REST and RPC request from `anon` or a non-member, SECURITY DEFINER RPCs included; `service_role` passes |
| Row security | a RESTRICTIVE policy `chula members only` on every table in `public` and `vca`, on `storage.objects` and on `realtime.messages` | rows for anyone who is not a member, reads and writes (`WITH CHECK`) |
| Vercel API | `api/_lib/chula-gate.js` | every function that costs money or touches account data; the AI reads the library with the member's own token |
| Front ends | vetmock.com, ai, vca, research | the app itself until a member session is present |

Public on purpose (checked by the pre-request allow-list or untouched):
- `rpc/chula_access_state` (the wall's own state, read before sign-in);
- `rpc/seeside_public_stats` (an external site's counters);
- `rpc/record_client_diagnostic` (crash counts, so a broken sign-in page is seen);
- `rpc/library_doc_for_signing` (storage metadata only: the bytes need a link
  `/api/library-file` signs, and it signs only for a member's bearer or a
  member's open ticket, `api/_lib/open-ticket.js`, which VetMock AI's file
  links carry because a tapped link sends no header);
- the landing page, OG images, robots and sitemap, the blog, wiki link previews
  (head tags plus the noscript article for crawlers), the atlas catalogue page;
- `/api/send-feedback`, so a student who cannot get in can still say so.

## The switch

`private.chula_wall.enforce` is the one switch every layer reads.

```sql
select public.admin_set_chula_wall(false);   -- off, from the admin account
update private.chula_wall set enforce = false; -- off, from the dashboard SQL editor
```

Off means everything behaves as before this release: guests use the app, the API
takes anonymous calls, sign-up is open. The front ends read the state through
`chula_access_state` on every boot, keep the last answer, and assume on when they
cannot reach the server; a member with a saved session passes either way.

The migration ships with the wall off. It is turned on once the release is live,
after the owner's own sign-in is walked on vetmock.com (see the release record).

## Existing accounts and devices

- Members already: the 13 Chula Google accounts. The 2 email/password accounts on
  Chula addresses become members when they sign in with that Chula Google account:
  Supabase links the identity to the same account by email.
- Everyone else (30 accounts, including 6 of the 8 active in October): after
  signing in the old way they see **เชื่อมบัญชีจุฬา**. Linking adds the Chula
  Google identity to the same account, so every answer, history and synced item
  stays. Nothing is deleted or moved.
- A Chula account that already has its own VetMock account cannot be linked to a
  second one; the screen says so and offers to open that account instead.
- A guest's progress on the device joins the account at the first sign-in (the
  sync engine's existing first-sign-in merge).

## Never lock out a studying student

- A saved session is judged on the device from its stored identities and the last
  server answer, with no network. Offline, the app opens as before.
- The wall never signs anyone out. Tokens refresh when the device is back online.
- Inside LINE the page offers to open in the system browser
  (`openExternalBrowser=1`); other in-app browsers get the way out of their menu.
- One switch turns every layer off in seconds.

## What a wall cannot hide

The repository is public and the question banks ship in the JavaScript bundle. The
wall gates the app, the AI, sync and the library; it does not make question text
secret. Moving the banks behind authenticated storage is a separate, larger
decision.

## Subdomains

ai.vetmock.com, vca.vetmock.com and research.vetmock.com each keep their own
session and show the same Chula sign-in; the Google account is remembered, so it
is one tap. One shared session across subdomains is a follow-up, not this release:
- a shared refresh token rotated by several origins can revoke itself;
- iOS caps cookies written by script at 7 days, which would sign home-screen
  users out and lock them out offline.

## Tests

- `tests/unit/chula.test.mjs`: the domain and member rule, the copies in the
  sub-apps, error mapping, the gate's decisions.
- `tests/unit/chula-api-gate.test.mjs`: the API gate with a stubbed backend.
- `scripts/test-chula-wall-db.mjs`: the hook, the trigger, the pre-request, the
  restrictive policies and the switch on the CI Postgres service.
- `tests/e2e/chula-wall.spec.js`: the connected bundle with every request to the
  database answered by the spec. The app has no test-only code path; the spec
  plants sessions as test data, so nothing can leak into a production build.
