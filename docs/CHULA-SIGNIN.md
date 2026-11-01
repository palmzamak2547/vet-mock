# Chula sign-in wall

Palm, 1 Nov 2026: every visitor to VetMock signs in with a Chula email before using
the app, as safe and stable as possible, better than cuvetsmo.com in every way.

## Who counts as Chula

An account is a **member** when it holds a Google identity whose email Google has
verified, whose domain is exactly `student.chula.ac.th` or `chula.ac.th`, and
whose hosted-domain claim (`hd`) names one of those domains: an account in
Chula's own Workspace, not a personal Google account registered on a Chula
address. The one account in `public.admin_users` is also let through, so the back
office can never lock its owner out.

Evidence (1 Nov 2026, read-only):

| Source | What it shows |
|---|---|
| VetMock `auth.identities` | 13 Google identities on `student.chula.ac.th`, every one with `email_verified` and the hosted-domain claim `hd = student.chula.ac.th`; no other Chula domain among 45 accounts |
| cuvetsmo.com | its sign-up trigger and client check have allowed exactly `chula.ac.th` and `student.chula.ac.th` since its first migration |
| Auth settings | email sign-up was auto-confirmed (`mailer_autoconfirm`), so an email address on an email/password account was never proven; mail goes through Gmail SMTP at 30 an hour |

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
| Creation gate | `public.hook_before_user_created` (Auth hook) and the `chula_only_signup` trigger on `auth.users` | while on, any new account that is not Google with a Chula email. On or off, a Chula address through any provider but Google, so nobody can reserve a student's address with a password and later receive their Google identity by automatic linking |
| Linking guard | the `chula_guard_identity` trigger on `auth.identities` | an OAuth identity whose provider did not verify its email joining an account that already exists (automatic linking by an unverified address is an account takeover) |
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
  links carry because a tapped link sends no header; a ticket names one
  document for a day and only a member's answer carries one);
- the landing page, OG images, robots and sitemap, the blog, wiki link previews
  (head tags plus the noscript article for crawlers), the atlas catalogue page;
- `/api/send-feedback`, so a student who cannot get in can still say so.

## Auth settings (Management API)

Changed on 1 Nov 2026, all reversible:
- `mailer_autoconfirm` off and the Discord provider off, the same day, because
  the security review showed that Supabase links an identity by email when its
  email is verified *or* autoconfirm is on: a Discord account registered on
  someone's address took over that account. The one Discord identity belongs to
  an account that also signs in with Google. No unverified OAuth identity sat on
  any account (checked).
- After the release: the before-user-created hook on, manual linking on (for
  เชื่อมบัญชีจุฬา), and `https://ai.vetmock.com/**`, `https://vca.vetmock.com/**`
  among the redirect URLs.

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

## Known limits

- Objects in the public storage bucket `vca-media` (images on the VCA board)
  stay readable by their URL; making the bucket private would break the posts
  that show them.
- The online counter uses a public Realtime presence channel, which no row
  policy covers; it carries counts only.
- The LINE sign-in edge function signs in the account whose email LINE reports.
  The wall does not offer LINE, but the function is still reachable.
- The two dormant email/password accounts on Chula addresses (made 28 Apr and
  14 Sep 2026, each used only that day) can still receive a Google identity by
  automatic linking; nobody proved they own those addresses. The owner decides
  whether to ask their holders to confirm.
- A device that never reached the server assumes the wall is on, and the admin's
  Gmail account opens offline only on a device where the server once said yes.
- `/api/playlist` stays open: it returns the titles of public YouTube playlists,
  edge-cached for half an hour with its Data API spend capped daily, and the
  video page asks for about 40 at once. `GET /api/external-connect` (which
  providers this deployment can connect, booleans only) is open for the same
  reason; connecting a provider is behind the gate.

## Never lock out a studying student

- A saved session is judged on the device from its stored identities and the last
  server answer, with no network. Offline, the app opens as before.
- A session whose access token has expired opens its account at once from the
  device (`storedAuthSession`, `src/lib/auth-storage.js`) instead of waiting about
  25 s for a refresh that cannot run, and keeps it when auth-js answers "no
  session" because the refresh failed on the network. Only a sign-out, or the
  server refusing the refresh token (auth-js then removes it), ends it.
- The wall never signs anyone out. Tokens refresh when the device is back online.
- A re-read of a known member's session (a profile save, a passkey) keeps the app
  on screen; the wall's checking screen is only for a device with no account yet.
- Inside LINE the page offers to open in the system browser
  (`openExternalBrowser=1`); other in-app browsers get the way out of their menu.
- One switch turns every layer off in seconds.
- The API trusts a switch it read in the last 30 seconds. When the database
  cannot be asked, it keeps open what it saw open in the last ten minutes, so the
  AI and read-aloud ride out a Supabase hiccup while the wall is off; in
  production a missing wall function refuses rather than opens, so the migration
  is applied before the code that reads it is merged.
- An open tab asks again when it comes back online and when it is looked at again
  (at most once a minute), so turning the switch on reaches tabs left open.
- One Tap is offered on the sign-in screen, never on the link screen: on a shared
  device it could tie a passer-by's Chula account to whoever is signed in.

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
