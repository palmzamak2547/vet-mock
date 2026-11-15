# One sign-in for the VetMock family (design, not built)

Status: proposal, 11 Nov 2026. Nothing in this file is live. The sign-in of every site is
unchanged; read [CHULA-SIGNIN.md](CHULA-SIGNIN.md) for what is.

## The problem

Four sites (vetmock.com, vca.vetmock.com, ai.vetmock.com, research.vetmock.com) sign in against
one Supabase project and one `auth.users`, but each keeps its own session under its own storage key
(`sb-*`, `vmx-vca-auth`, `vmx-ai-auth`, `vmx-research-auth`). So:

- a student signs in four times, once per site, and again per browser, per installed web app and
  in the system browser after leaving LINE;
- signing out of one site leaves the other three signed in (every sign-out is `scope: 'local'`);
- a link from one site to another (a VetMock AI source card, a VCA question's twin in the app)
  lands on the other site's sign-in wall first.

What any design must keep (CHULA-SIGNIN.md, "Subdomains" and "Never lock out a studying student"):

- no refresh token shared between origins: a rotating refresh token used by two sites revokes
  itself (Supabase's reuse detection ends the whole session family);
- no cookie written by script for the session: iOS caps those at 7 days, which signs out
  home-screen users and locks them out offline;
- the wall decides membership on the server (hook, pre-request, row policies); a crossing must
  never widen who gets in or the paid surface (AI, read-aloud, voice);
- a saved session keeps opening offline.

## What Supabase offers

| Primitive | What it does | Use here |
|---|---|---|
| `auth.admin.generateLink({ type: 'magiclink', email })` (service role) | returns `properties.hashed_token` for an existing user without sending any mail | the server mints a one-time sign-in for the account it has just authenticated |
| `auth.verifyOtp({ type: 'magiclink', token_hash })` (any client) | exchanges that token for a brand-new session with its own refresh token | the target site starts its own session, never a copy of another's |
| `auth.signOut({ scope: 'local' \| 'others' \| 'global' })` | ends this session, every other session of the user, or all of them | "sign out everywhere" |
| `auth.sessions` (Postgres, service role) | one row per session, refresh tokens cascade | revoking the sessions one handoff chain created |
| Cookie storage (`@supabase/ssr`, `cookieOptions.domain`) | one session in a cookie on `.vetmock.com` | option B below |

The magic-link token's lifetime is the project's OTP expiry (default one hour, one setting for
every email); it cannot be shortened per call. That is why the designs below never put it in an
address: the address carries only our own code, which lives for 60 seconds and is used once.

## Option A: a one-time signed handoff in the URL fragment

Flow, started by the site that lacks a session (the target), so the target binds the result to
itself before anything is minted (the same idea as PKCE):

1. The target (say VCA) has no session. It makes a random `verifier` (32 bytes), keeps it in
   `sessionStorage` with the path it was going to (`src/lib/family/return-path.js`), and goes,
   top level, to `https://vetmock.com/family/hop?to=vca&c=<base64url(SHA-256(verifier))>`.
   `to` is an id from `src/lib/family/family.js`, never a URL.
2. vetmock.com, holding a member session, calls `POST /api/family/mint` with its bearer token
   (`Authorization` header, never a cookie), `{ to, challenge }`. The server checks the token,
   the Chula gate (`api/_lib/chula-gate.js`), `to` against the fixed list, a rate limit, then
   stores `{ code_hash, user_id, to, challenge, expires_at: now + 60 s, used_at: null }` and
   returns a random 32-byte `code`.
3. vetmock.com replaces itself (`location.replace`) with
   `https://vca.vetmock.com/auth/family#code=<code>`. A fragment is never sent to a server,
   never in a `Referer`, never in Vercel's logs.
4. The target reads the fragment and removes it at once (`history.replaceState`), then calls
   `POST https://vetmock.com/api/family/redeem` with `{ code, verifier }`. The server checks the
   `Origin` header equals the code's target, `SHA-256(verifier)` equals the stored challenge, the
   code is unexpired and unused, and marks it used in the same statement
   (`update ... where used_at is null returning ...`). Only then does it call `generateLink` for
   that user and answer `{ token_hash }` in the response body (`Cache-Control: no-store`).
5. The target calls `verifyOtp({ type: 'magiclink', token_hash })` with its own client and storage
   key: a new session, its own refresh token. It goes to the remembered path.

If vetmock.com has no session at step 2, it answers `#none` and the target shows its wall as
today. The hop is a pair of redirects, about half a second, once per site per browser.

Threat model:

| Threat | Why it fails |
|---|---|
| Token in a referrer, history or server log | the address carries only `code`, in the fragment; it is removed on arrival, used once, dead after 60 s; the Supabase token never appears in any address |
| A browser extension or shoulder-surfer copies the code | redeeming needs the `verifier`, which never left the target's `sessionStorage` |
| Replay | single use (atomic `used_at`), 60 s, bound to one origin |
| Open redirect | `to` is an id looked up in the family list; the return path passes `safeReturnPath` (same-origin relative path only, tested against `//host`, `/\host`, encoded and credentialed forms) |
| Cross-site request forgery on mint | mint takes the bearer token from a header a page on another site cannot set; there is no cookie to ride |
| Login CSRF (planting the attacker's account on a victim's VCA) | the victim's tab has no verifier for the attacker's challenge, so redeem fails |
| A compromised sub-app (XSS on VCA) | it can mint only a session for itself, which it already holds; codes for ai are delivered to ai's origin only, and redeem checks `Origin`; the hop page must never answer for an id outside the list |
| A compromised vetmock.com | holds the main session already, as today; the design adds no power over the other sites beyond what a signed-in main page has |
| iOS storage caps | nothing is written to a cookie; each site keeps localStorage as now; a site whose storage iOS cleared gets a session back from the hop while vetmock.com's is alive |
| LINE's in-app browser | no gain unless vetmock.com is already signed in inside LINE (Google refuses sign-in there); the "open in the system browser" handoff stays |
| Session sprawl | each hop creates a session row; the target hops only when it holds none, and mint is rate-limited per user |

## Objections from review (open: answer each before anything is built)

The design above was reviewed adversarially on 11 Nov 2026. Three objections stand against option A
as written; none has an answer yet.

**(a) The hop accepts any challenge.** Step 1 lets whoever opens the hop page choose the challenge.
An attacker who sends a student to `vetmock.com/family/hop?to=vca&c=<challenge whose verifier the
attacker knows>` gets a code minted for the student's account; if that code leaks from the address
bar (an extension, a screen share, a synced history), the attacker redeems it from their own server
with a forged `Origin` header, which only browsers enforce. So: the hop must ask the student before
minting (a visible "เข้าสู่ระบบ VetMock VCA ด้วยบัญชีนี้" with the account named), or deliver the code
without an address at all (a `postMessage` to a window the target opened, checked against the
target origin); and redeem must never rely on `Origin` as a proof of anything.

**(b) A minted session is a session for the whole account.** There is one Supabase project, so a
session minted for VCA reads and writes everything the main app's session can (sync, library,
paid endpoints). A script injection on a sibling (VCA's community board and chat render content
other students write) would then reach the main app's data. So either every sibling's content
handling and CSP are held to the main app's standard and reviewed as part of this change, or the
session a sibling holds is limited to that site (a token scoped by a claim the row policies and the
API gate check), which Supabase does not offer as a setting and would be our own work.

**(c) Automatic hops undo a local sign-out.** On a shared computer a student signs out of VCA,
walks away, and the next person opens VCA: an automatic hop finds vetmock.com still signed in and
signs them back in as the first student. So: after a local sign-out on a site, no automatic hop
there until the student asks for one; and "sign out" in the family defaults to signing out of every
family site in this browser, with "this site only" the exception.

## Option B: a session cookie on `.vetmock.com`

All four sites use cookie storage with `Domain=.vetmock.com`, so there is one session.

- One refresh token shared by four origins and many tabs: concurrent refreshes trip reuse
  detection and revoke the session (the reuse interval narrows this, it does not end it).
- Written by script: iOS keeps it 7 days, so home-screen students are signed out weekly and
  locked out offline.
- Sent with every request to every subdomain, including the media hosts (`slides.`, `tts.`), so the
  token reaches their CDN's request logs; readable by script on every subdomain.
- An HttpOnly cookie set by a server avoids the last two, but means a server session layer in
  front of every Supabase call on four sites: a rewrite, not a seam.

Rejected for the reasons CHULA-SIGNIN.md already gives, plus the media hosts.

## Option C: a hub page with silent session checks

A hidden frame of `vetmock.com/family/hub` on each site answers by `postMessage` whether a session
exists. The sites are same-site, so the frame would see vetmock.com's own storage. But every site
sends `X-Frame-Options: DENY` and `frame-ancestors 'none'`, which would have to open for this page;
and whatever the frame hands over is either the main session's tokens (option B's shared-refresh
problem) or a handoff code (option A, with a frame added). A top-level hop does the same job
without a frame, so C reduces to A's step 1 to 3.

## Recommendation: A, started by the target with a top-level hop

Held back by the three open objections above: as written, steps 1 to 3 and the automatic hop in
the migration do not yet answer them.

It is the only option that gives each site its own session (no shared refresh token, no script
cookie), keeps every token out of addresses, and can be switched off without touching a session.

### Signing out

Today: "ออกจากระบบ" ends this site's session only. With A, offer two clear choices:

- **ออกจากระบบในเบราว์เซอร์นี้**: the site signs out locally, then hops through each sibling's
  `/auth/family-signout` (top level, each ends its own session locally and passes on), back to
  where the student started. Server side, mint records the chain (`chain_id` beside each code),
  so a sibling that cannot be reached (offline) still loses its session: the server deletes
  that chain's rows in `auth.sessions`. Refresh tokens die at once; an access token already
  issued lives until it expires (an hour at most), and offline a saved session keeps opening
  until the device is back online (CHULA-SIGNIN.md, known limits).
- **ออกจากระบบทุกเครื่อง**: `signOut({ scope: 'global' })`. This also ends the student's phone,
  tablet and every other browser, which must be said on the button's confirmation, in those
  words. It is the right choice after using a shared computer and losing it.

### What the server needs (vetmock.com)

- `POST /api/family/mint` and `POST /api/family/redeem` (Node, region of the database), CORS
  allowing exactly the three sibling origins on redeem, `no-store` on both, per-user and
  per-address rate limits, an audit line without the code.
- A table `private.family_handoffs` (code hash, user, target, challenge, chain, expiry, used),
  never exposed to PostgREST, with expired rows deleted daily; or the existing KV store with a
  60-second TTL and an atomic get-and-delete.
- The service role key the API already holds, for `generateLink` and the chain revocation.
- A switch: `FAMILY_SIGNIN=on` on the main project. Off (the default) mint answers 404, the
  sibling sees no session and shows its wall exactly as today.

### Migration

1. Ship the endpoints and the hop page dark (switch off). Nothing changes for students.
2. Owner turns it on. The sibling walls first offer an explicit button, "ใช้บัญชีจาก vetmock.com"
   (one tap, no Google screen); measure success and failures from the audit lines for a week.
3. Make the hop automatic on a sibling's first visit with no session (still falling back to the
   wall on any failure).
4. Add the two sign-out choices.

Switching off at any stage: the env var off, then a redeploy of the main project only. Sessions
already minted are ordinary Supabase sessions and keep working; nothing to migrate back.

### To review before it ships

- A security review of the two endpoints and the hop page against the threat table above
  (differential review of the diff; a test for every row: expired, reused, wrong origin, wrong
  verifier, unknown target, no session, non-member, rate limit).
- Proof, on a staging project, that `generateLink({ type: 'magiclink' })` for a Google-only
  member sends no mail, does not count against the 30-an-hour SMTP limit, and that
  `verifyOtp` with its `token_hash` works for both the implicit (vetmock.com, VCA) and PKCE
  (VetMock AI) clients; and that the before-user-created hook and the identity-linking guard are
  not involved (the user exists).
- That a hop never lets a non-member through: mint asks the Chula gate, and the minted session
  still meets every database layer.
- The `auth.sessions` growth after a week, and the chain revocation on a real account.
- iOS Safari, a home-screen install of each site, Android Chrome and the LINE in-app browser.

### What it needs from the owner

- The decision: explicit button first, then automatic (recommended), or automatic from the start.
- The decision on the two sign-out choices and their wording.
- Vercel: `FAMILY_SIGNIN` on the main project when ready; the three sibling projects need no
  new secret.
- Supabase dashboard: no new redirect URL (the hop does not use OAuth's redirect); confirm the
  OTP expiry stays at or below one hour, and that the sibling origins stay in the redirect
  allow-list for today's Google fallback.
- CSP: `connect-src https://vetmock.com` on VCA and Research (VetMock AI has it), reviewed with the
  rest of the diff.
