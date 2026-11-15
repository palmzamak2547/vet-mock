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

Row security cannot see into a SECURITY DEFINER function, so `library_search`
asks `public.chula_access()` itself before it reads a page
(`20261107141605_library_search_asks_the_wall.sql`): it holds even with the
Data API gate taken out, and with the wall off it answers everyone as before.
Scripts have no member session, so they read the library through
`scripts/lib/library-read.mjs` (Management API and R2), never the anon key.

Public on purpose (checked by the pre-request allow-list or untouched):
- `rpc/chula_access_state` (the wall's own state, read before sign-in);
- `rpc/seeside_public_stats` (an external site's counters);
- `rpc/record_client_diagnostic` (crash counts, so a broken sign-in page is seen);
- `rpc/library_doc_for_signing` (storage metadata only: the bytes need a link
  `/api/library-file` signs, and it signs only for a member's bearer or a
  member's open ticket, `api/_lib/open-ticket.js`, which VetMock AI's file
  links carry because a tapped link sends no header; a ticket names one
  document for a day and only a member's answer carries one);
- `rpc/ai_guest_pass_use` (is this trial link's code good; see "Trial links"
  below. It tells nothing about any account and opens no row);
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
- The same evening, before the merge: the before-user-created hook on, manual
  linking on (for เชื่อมบัญชีจุฬา), and `https://ai.vetmock.com/**`,
  `https://vca.vetmock.com/**` among the redirect URLs. The migration was applied
  then too, with the switch off (proof in `docs/releases/5.184.0.md`).

## The switch

`private.chula_wall.enforce` is the one switch every layer reads. It was switched on at 18:34 on 2 Nov 2026 from the
`/app/admin` card, after a live Chula sign-in; the walk and its checks are in `docs/releases/5.184.0.md`.

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
- A session revoked elsewhere (sign out of all devices, a deleted account) still
  opens offline on a device that holds it, until the device is online again: the
  price of never locking out a student who studies offline. Online, the refused
  refresh ends it within one round trip.
- The API's ten-minute grace opens what it saw open whenever the state call fails,
  which includes a timeout or a 429 from the database, not only an outage. It
  applies only on an instance that saw the switch off in the last ten minutes.
- On ai, vca and research, a device holding one account that returns from the
  redirect fallback with another shows the first account's app for a moment.
- A student who unticked "stay signed in" keeps the token in sessionStorage, which
  a duplicated tab copies. After a sign-out with no network, that duplicate still
  holds its own copy of a refresh token the server never revoked, and signs back
  in once it can refresh. An online sign-out revokes the token, so this needs both
  the duplicate tab and no network.
- `/api/playlist` stays open: it returns the titles of public YouTube playlists,
  edge-cached for half an hour with its Data API spend capped daily, and the
  video page asks for about 40 at once. `GET /api/external-connect` (which
  providers this deployment can connect, booleans only) is open for the same
  reason; connecting a provider is behind the gate.

## Never lock out a studying student

- A saved session is judged on the device from its stored identities and the last
  server answer, with no network. Offline, the app opens as before.
- A saved session opens its account at once from the device
  (`storedAuthSession`, `src/lib/auth-storage.js`), so neither Home nor the wall
  waits for the auth SDK chunk on each open. With an expired access token offline
  this matters most: auth-js answers "no session" only after about 25 s of
  retries, and on a network failure it keeps the token while answering null, so
  the app keeps the account then too. Only a sign-out, or the server refusing the
  refresh token (auth-js then removes it), ends it. It reads only the client's own
  storage key, and never on a sign-in redirect, where the arriving account must
  not be preceded by the one on the device.
- Signing out of a device works offline: when auth-js cannot reach the server it
  answers with an error and keeps the token, so every front end then ends the
  local session the way auth-js does after a refused refresh (`_removeSession`):
  the token goes, a refresh still retrying cannot save it again, and every open
  tab hears SIGNED_OUT.
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

The design for one sign-in across the four sites (a one-time handoff, each site
keeping its own session) is in [FAMILY-SIGNIN.md](FAMILY-SIGNIN.md); not built.
A redirect sign-in on vetmock.com, vca and ai keeps the student's destination
(path, query and section) in the tab's sessionStorage, accepted only as a
same-origin relative path (`src/lib/family/return-path.js`).

## Trial links

Palm, 15 Nov 2026: a person without a Chula account should be able to try the
assistant for a limited time. A trial link is
`https://ai.vetmock.com/?pass=<code>`. It opens the assistant on that site for
whoever holds it, until the pass expires, is used up or is revoked. The wall
itself does not move.

What a pass opens:

| Route | For a trial visitor |
|---|---|
| `POST /api/ai-chat` | answers as a guest, from VetMock's own content; each request uses one of the pass's messages |
| `POST /api/ai-transcribe` | the microphone's speech to text; checked without counting (the question it becomes is counted) |
| `POST /api/ai-voice` | the live voice call (start, and a photo into that call); checked without counting, under the same caps as a student's call, counted per link, except the calls a day: a link has its own number (`AI_VOICE_PASS_SESSIONS`, default 8) because its holders share it |
| `POST /api/ai-chat` with `voice` | the call's tools, answered as a guest; each tool call uses one of the pass's messages, as any request to this route does |

The call's caps (the day's sessions, the burst limit, the free restarts, the
photos a call and the provider balance floor) are the ones a student has, and
they apply per link: the route counts a trial call as
`pass:<first 16 hex of the SHA-256 of the code>`, never as the address, so
everyone who shares one link shares one allowance. The call's tools are counted
the same way. The code itself is never logged, and neither is that key's
source.

What it never opens:

- The Chula-only library. The request has no session, so the search goes out
  with the public key and the database refuses it while the wall is on. No
  answer and no tool of the call carries a file, a slide or an open ticket.
- Any account data: a trial visitor has no account, and a photo pass from one
  link's call does not open another's.
- Every other `/api` function, vetmock.com, vca and research: nothing else reads
  the header.
- Any row. The visitor is `anon` to every policy. No policy, no table in
  `public` or `vca` and no part of `chula_access_state` changed.

How it works:

- The page (`ai/src/lib/pass.js`) takes the code out of the address as it
  starts, keeps it on the device (`vmx-ai-pass`) and sends it as
  `X-VetMock-Pass` on a request that has no session. With the wall on, nobody
  signed in and a code held, the page is open instead of showing the sign-in
  card; the call button is shown as for a member, and one line under the box
  says what the link covers. Every request of a call (its start, its tools, a
  photo) goes through the same helper and carries the code; a `pass_invalid`
  during or before a call drops the code, ends the call and shows the sign-in
  card with its line. A member who opens a trial link stays a member, and the code is
  dropped when an account leaves the device, so a sign-out still lands on the
  sign-in card.
- `api/_lib/guest-pass.js` reads the header only on a request with no bearer
  token: a session is judged by the gate as before, whatever header rides with
  it. It asks `public.ai_guest_pass_use` with the public key. A good pass is the
  guest the gate returns while the wall is off (`member: false`, no token). A
  refused one is `401 pass_invalid`, and the page then shows the sign-in card
  with one line. When the database cannot be asked the answer is 503, never an
  opening.
- `private.ai_guest_pass` keeps the SHA-256 of the code, an expiry, a cap (200
  messages unless set) and the count. The count rises in one `UPDATE` whose
  `WHERE` holds every condition, so two requests at once cannot pass the cap.
- A trial visitor is limited by address like any guest: 20 questions in 10
  minutes and 150 a day, inside the whole feature's daily budget.

To make one, the owner makes the code and its hash on their own machine, so the
code is never in a statement or a database log:

```bash
node -e "const c=require('crypto');const code=c.randomBytes(24).toString('base64url');console.log('https://ai.vetmock.com/?pass='+code);console.log(c.createHash('sha256').update(code).digest('hex'))"
```

The first line is the link to hand over; the second goes into one insert in the
SQL editor:

```sql
insert into private.ai_guest_pass (code_sha256, note, expires_at, max_messages)
values ('<the 64 hex characters>', '<who it is for>', now() + interval '7 days', 200);
```

To end one, and to see how much each has used:

```sql
update private.ai_guest_pass set revoked_at = now() where note = '<who it is for>';
select note, expires_at, used_messages, max_messages, revoked_at
  from private.ai_guest_pass order by created_at desc;
```

Known limits:

- Whoever holds the link holds the pass. It is not tied to a person or a
  device; the expiry, the cap and `revoked_at` are what bound it.
- The code is in the address of the first page request, so the page host's
  request log has it. That log is the owner's own; keep passes short-lived.
- Every chat request with a good pass uses one message, also one that is then
  refused for its input or for asking too fast.
- A visitor on a trial link sees no sign-in button until the pass ends.
- A value shaped like a code that is not a pass costs one database call, as a
  well-formed session token with a bad signature does.

## Tests

- `tests/unit/chula.test.mjs`: the domain and member rule, the copies in the
  sub-apps, error mapping, the gate's decisions.
- `tests/unit/chula-api-gate.test.mjs`: the API gate with a stubbed backend.
- `tests/unit/guest-pass.test.mjs`: the trial pass header, the database call
  with a stub, and the chat, transcribe and voice routes with a pass.
- `ai/tests/unit/pass.test.mjs` and `ai/tests/unit/wall.test.mjs`: the code on
  the device, and the page open on a trial link.
- `scripts/test-chula-wall-db.mjs`: the hook, the trigger, the pre-request, the
  restrictive policies, the switch and the trial pass function on the CI
  Postgres service.
- `tests/e2e/chula-wall.spec.js`: the connected bundle with every request to the
  database answered by the spec. The app has no test-only code path; the spec
  plants sessions as test data, so nothing can leak into a production build.
