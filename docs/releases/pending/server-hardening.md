```js
{ kind: 'fix', scope: 'system', title: 'ใช้เน็ตมหาวิทยาลัยได้เต็มโควตาของตัวเอง', desc: 'ปุ่มอธิบายใน VetWiki ตรวจคำตอบ ไมค์ เขียนด้วยมือ และเสียงอ่าน นับโควตาตามบัญชีของแต่ละคน ไม่ต้องแบ่งกับเพื่อนที่ใช้ Wi-Fi เดียวกันในห้องเรียนหรือห้องสมุด และข้อเขียนที่มีคะแนนเต็มมากกว่า 2 แสดงคะแนนตามจริง' },
```

# Server hardening (pending, branch `claude/server-hardening`)

Items from a review of the API, the service worker and the device-only tools,
then the fixes two independent reviews of the branch asked for. Each lands with
a guard that fails if the defect returns. This file says what is true at the
branch's head; where an earlier version of it was wrong, that is said.

## Counting callers (`api/_lib/rate-limit.js`)
- `limitCaller(req, gate, route, max, windowMs)` is the one way a gated route
  counts. A Chula member (`gate.member === true`, decided by the database) is
  counted on `<route>:user:<id>` and nowhere else: one limiter call, and nobody
  on the same address can be refused because of them. Anyone else (a guest, or
  a free account while the wall is off) is counted by address at `max`, on the
  same key as before the branch. Correction: the first version also counted
  members' addresses at 15 times the limit, which refused a hall of 150 from the
  16th student at full use and let one scripted member lock the whole address
  for the hour; and it gave any signed-in account its own counter, so throwaway
  accounts multiplied an address's allowance.
- Used by wiki-explain (20/h), the mic (40/h), handwriting (40/h), agent-action
  (30/h), study-coach and grade-summary (120/h), race-start (60/h), tts (60 per
  5 min), tts-iapp, the library link and the video route. The daily provider
  budgets are unchanged.
- Paid routes refuse (503) when the limiter cannot count. Before the branch the
  mic let every clip through; 100 of 100 reached the provider, now 0. Open
  through an outage by decision: the library link and the video route (cheap
  short-lived links), the library bytes (bounded by the instance's own count,
  below) and the AI `?health=1` read.
- Guards: `tests/unit/api-limits.test.mjs` (150 students on one address, a
  scripted member and a classmate, throwaway accounts, an outage);
  `api-hostile-requests.test.mjs` fails on a fail-open limit outside its list
  and on a gated route that counts by address alone.

## The gate (`api/_lib/chula-gate.js`)
- Before any database call a token is read locally (`tokenLooksValid`) and
  refused only when it is certainly not a session: not three dot-separated
  parts, a payload that is not a JSON object, no subject, or an expiry missing
  or more than 60 s in the past (`EXPIRY_MARGIN_S`, for clock difference;
  inside it the database decides). A refused token is no token: the caller is a
  guest, nothing is asked and nothing is counted. Everything else is always
  verified by the database. Nothing is counted per address, so no member is
  ever refused for what someone else on their network sent.
- The issuer and audience are not grounds for refusal (they stop no forger, who
  writes them into an unsigned payload, and a mismatch on our side would make
  every member a guest at once). A differing issuer is logged once a minute,
  host only, never the token. Correction: the version at 92ad3ec9 refused a
  token whose `iss` was not exactly `<configured url>/auth/v1` or whose `aud`
  lacked `authenticated`, and allowed no clock margin. The configured issuer
  came from one place only: `api/_lib/chula-gate.js:89`, `const cfg =
  backendConfig(env)`, which is `env.VITE_SUPABASE_URL || env.SUPABASE_URL`
  (`api/_lib/app-backend.js:3-4`), passed at `chula-gate.js:91` to
  `tokenLooksValid(token, cfg.url, now())`, which built the issuer at
  `chula-gate.js:32`. Nothing else read it; the same `cfg.url` remains the
  address the gate's database calls go to.
- Correction: the previous version braked failed tokens per address and checked
  that before verifying a token, so 120 forged tokens from a lecture hall's
  address refused every member there for ten minutes, and 30 students with
  tokens that expired during a lecture tripped it themselves. That brake is
  removed, not re-keyed: keyed on the token's subject it would bound nothing,
  since a forger writes any subject into an unsigned payload.
- Known limit, as before the branch: a well-formed token with a bad signature
  still costs one database call. Verifying the signature on the server would
  end that; it waits until after the finals.
- A deployed preview without database settings refuses like production. The
  signal is `VERCEL_ENV`: `production` or `preview` refuse; unset (the dev
  server, the unit suite) or `development` (`vercel dev`) stay open. A preview
  whose database lacks the wall's function also refuses.
- Guard: `api-limits.test.mjs` (600 forged tokens from a hall's address, then an
  honest member there is served, also after the instance forgets them; 30
  students x 4 parallel calls with expired tokens reach the database 0 times
  and brake nobody; seven shapes that are certainly not a session (an expiry
  61 s past among them) make no database call; one 30 s past reaches it; six
  issuer and audience mismatches (trailing slashes, a custom auth domain, a
  preview's other address, another audience, none) still reach the database
  and are members when it says so; previews
  refuse, local development opens; 'a session-shaped token: the database
  decides' builds two tokens with identical claims and different signatures).
  Test tokens come from
  `tests/helpers/supabase-jwt.mjs`.

## Feedback (`api/send-feedback.js`)
- Open before sign-in (`ChulaGateView`). A member: 3 in 10 minutes and 10 a day
  on their own account, then the address as a ceiling (30 and 100), incremented
  only when the account allowed the message. A visitor (a free account counts
  as one): 3 in 10 minutes and 20 a day per address. Visitors use at most 40 of
  the mailer's 100 a day.
- A member stopped by the address ceiling (they may have sent one message) is
  answered `reason: 'network_busy'` and told that many messages came from their
  network, not that it was their own burst or day.
- A full day answers `reason: 'daily_cap', scope: 'caller'`, and the form says
  "พรุ่งนี้ส่งได้อีก" (`src/lib/feedback-client.js`, `daily_mine`) instead of
  "wait a little". Correction: the first version answered `rate_limited` there.
- The mailer's own error text is logged; the sender gets `mailer_error` and a
  code. Correction: the first version returned it.
- Guards: `api-limits.test.mjs` (50 throwaway accounts on 5 addresses send 15;
  a visitor's full day; the mailer's 403 text), `feedback-client.test.mjs`.

## The library's bytes (`api/library-blob.js`)
- The storage API ignores Range, so every GET reads the object from byte 0
  through the function. A link `api/library-file.js` mints for a member
  carries a keyed digest of their id (`u`: HMAC with the link's secret, 22
  characters, not the account id, which anyone handed the link could read;
  the mint answer is cached only in that browser).
- Documents are budgeted on that digest: 2 GB per 10 minutes, a whole object
  per request, plus 300 requests per link. One member looping a link stops
  only themselves. A link with no member (an open ticket) is budgeted by
  address, 8 GB. A document with no catalogued size is counted by the bytes it
  actually streamed (`countStreamed`, added once the stream ends), never as
  less than it sent.
- Video and audio are outside the byte budget (the mime comes from the signed
  token, so a client cannot claim it) and keep 300 requests per link. Their
  ranges are served exactly as before the branch: one storage read per
  request, the prefix dropped, the rest streamed.
- A refusal is a small page in Thai (429, `Retry-After`) that says the account
  or network has opened many files and when to try again, not JSON.
- Reading stays open when the shared limiter is down (AGENTS.md, Library and
  sync): the same budgets are counted in the instance's memory instead
  (`rateLimitLocal`), a bound per instance, not a cost ceiling.
- Corrections: an earlier version budgeted every link by address (one member
  could empty a hall's budget in seconds), answered JSON, and refused in an
  outage. The version at bf57ac7d cut media ranges into 8 MB pieces counted by
  the piece; every piece still read the object from byte 0, so that cap made
  things worse (below) and is removed.
- Guards: `api-limits.test.mjs`: a member's 41st 50 MB pull is a Thai page and
  20 classmates on the address are served; a ticket link by address; an outage
  still serves, bounded; both mints carry the member; the link carries a keyed
  digest, never the id; Chrome's `0-` then `N-` and Safari's `0-1` served as
  asked; a range past the end and a multiple range are 416 with no body read; a
  300 MB video with 20 seeks is never refused by the byte budget while the same
  pattern on a 300 MB document is refused at the seventh; the 301st request on
  one media link is refused; a document of unknown size is refused once what
  it streamed fills the budget. And `api-hardening.test.mjs`.
- Unproven: what a real hall uses.

## The microphone's probe (`api/ai-transcribe.js`)
- The public GET never calls a provider: it answers from configuration and from
  what real clips met (a provider that refused a clip for credit or permission
  is left out for 10 minutes). The admin card keeps an explicit test clip.
- Guard: `ai-transcribe.test.mjs` (50 asks and 20 query strings, 0 calls).

## The written grader (`api/_lib/grade-shape.js`, `api/grade-summary.js`)
- A short answer is out of the points its question states, "(10 คะแนน)" (6 of
  the 389 short items state 10 or 20; others say nothing and stay at 2), and
  the grader is told that number. A grader that scored on another positive
  total is scaled, not capped; a score is cut to the half point below, never
  rounded up; a category name differing by case, spaces, "-" or "_" is
  matched; the total is recomputed. Correction: the first version capped every
  short answer at 2, so 6/10 read 2/2, and rounded 1.5 to 2.
- A `qid` of `__proto__`, `constructor` or `toString` names no question
  (`Object.hasOwn`).
- Guards: `api-hardening.test.mjs` with items 209627, 209545 and 209565.

## Bodies and error text
- `api/_lib/body.js` reads every JSON body; anything that is not an object is a
  400 with a fixed message. Error and parser text is logged, never returned.
  The read-aloud route's debug echo is gone.
- Guard: `api-hostile-requests.test.mjs` takes the handler list from `api/`,
  sets every provider key to a fake value, sends a member's bearer through a
  fake database, fills `req.query` from the URL, and sends 26 requests to each
  handler (no body, null, strings, arrays, numbers, an unreadable body signed in
  and out, prototype keys, wrong field types, form, multipart, text and base64
  content types, PUT, PATCH, HEAD, lowercase post, a foreign origin, hostile
  queries). 15 of the 28 handlers read a JSON body, and all 15 now reach it
  (the test fails if one does not); ai-chat, ai-voice and move-in parse their
  own. Correction: the first version ran with no keys and no bearer, so most
  paid handlers stopped at "not configured" or the wall before their body.

## Outbound requests that carry a secret
- A 307 or 308 makes fetch resend the same body to the Location. The Google and
  Notion code exchange (`api/external-connect-callback.js`, client secret and
  code) and the Google refresh (`api/_lib/external-connections.js`, refresh
  token and client secret) followed redirects; they now set `redirect:
  'error'`, and a redirect is a failed exchange (`connect_error=exchange`) or a
  failed refresh, with no provider text. The unused `isGoogleLandingHost` and
  `isNotionLandingHost` are removed.
- Every other fetch under `api/` that sends a credential was checked. Before:
  all but five (revoke, the Sheets reads, the Drive file list, the Notion
  search) followed redirects. Now:

| Where | What it sends | Redirects |
|---|---|---|
| ai-transcribe (Cloudflare Whisper, iApp) | Bearer; `apikey` + audio | error |
| external-connect-callback (code exchange) | client secret, code (body) | error |
| _lib/external-connections (revoke, refresh, Supabase rows, session) | tokens, client secret, service key | error |
| fetch-external-doc (Drive file name, Notion pages and blocks) | the student's Bearer | error |
| fetch-external-doc (Drive export) | the student's Bearer, a GET | follow: an export may be answered from googleusercontent.com, the landing host is checked, and fetch drops Authorization on a redirect to another origin |
| fetch-external-doc (public Docs export) | an API key in the query, a GET | follow: the key is not resent to the Location |
| list-external-files (Drive, Notion) | the student's Bearer | error |
| library-blob (storage) and library-file (catalogue RPC) | Cloudflare token; anon key + bearer | error |
| send-feedback (Resend) and _lib/feedback-usage (log) | mail key + message; service key | error |
| tts-iapp, _lib/ai/voice, _lib/mochi-voice, _lib/llm, _lib/ai/writer, _lib/ai/health | provider keys, prompts | error |
| _lib/app-backend, _lib/chula-gate, _lib/ai/library | anon key + bearer, signed RPC bodies | error |
| _lib/rate-limit (Upstash), _lib/r2 (Cloudflare) | tokens | error |
| _lib/system-status (admin probes) | provider keys | error, except the public status file, a presigned URL and the domain registry, which carry none |
| playlist, video-file, _lib/ai/papers | a key in the query, a presigned URL, nothing | follow |

- Guard: `tests/unit/outbound-redirects.test.mjs`. A redirect answer from the
  token endpoint makes no second request and puts nothing of the provider's in
  the answer, for the exchange and the refresh; and every fetch under `api/`
  (found from the source, arrow bodies included, 51 today) that carries a credential or a body must
  set `redirect: 'error'`, unless its file is listed with why it may follow.

## Origins
- Previews must end in this team's suffix:
  `vetmock-<…>-palmzamak2547s-projects.vercel.app` (the pattern the Supabase
  functions already use). Assumed: Vercel keeps names with a team's suffix for
  that team.

## Device-only work (`src/lib/persist-storage.js`)
- The first save of a student's own work asks `navigator.storage.persist()`
  once per device. Never while a question card or an exam is on screen (that
  save does not ask; a later one does), never from the flashcards' id
  migration (a write made during a read), and at most once per session if the
  browser never answers. A refusal is remembered; nothing is shown.
- Guard: `persist-storage.test.mjs`.
- Syncing (not built): flashcard, cloze and occlusion decks need per-card ids
  and edit times (occlusion images in storage); the pinboard, video notes and
  own clips fit `sync_user_data_v2` as new keys with last-writer-wins per item;
  watch history merges by union; notebooks need their page list there (their
  ink already syncs).

## The sitemap
- The build already listed the 224 prerendered VetWiki topics and nothing behind
  the wall. The rules now live in `scripts/lib/sitemap.mjs` for the three build
  steps, and `GATE_PUBLIC_VIEWS` in `src/lib/gate-public-views.js`. Correction:
  the sitemap commit's message says `/app/about` was listed; that came from a
  stale local build.
- Guard: `sitemap.test.mjs`. Not checked: the sitemap vetmock.com serves.

## The service worker (`public/sw.js`, `SW_VERSION` v229-2026-11-11)
- Lazy chunks and question banks (`/assets/`) were never affected. Other
  non-HTML GETs with no cached copy (landing video, models, JSON under
  `public/`) waited 4 s and then answered 503 on a phone that was online. Now
  they wait for the network up to 15 s, then answer offline and let the request
  go; a cached copy still answers at 4 s; navigations, and `Accept: text/html`
  requests, keep the cached home shell. A 206 is never cached. Correction: the
  first version waited without an end.
- Guard: `service-worker-update-safety.test.mjs` (slow, never answering, Range
  and video, text/html without a navigation, a cache that throws on read).
- A phone gets it on its next visit (`sw.js` is `max-age=0, must-revalidate`):
  the browser installs it in the background and switches once every tab of the
  site is closed.

## Later, after 4 Dec
- The real fix for library media: serve video and audio through the archive
  worker (`workers/library-archive.js`), whose storage binding honours Range,
  as `archives/vca/` already does; then a cap on each answer and an honest
  count of what it read become possible. Do not cap media ranges here without
  a ranged read: measured on a 300 MB video with the cap of bf57ac7d,
  `bytes=0-` counted 8 MB and read 8 MB, `bytes=150000000-` counted 8 MB and
  read 152 MB, the last byte counted 1 byte and read 300 MB; watching 300 MB
  straight through read about 5.9 GB from storage (38 pieces, growing with the
  square), 1 GB about 64.5 GB, one member repeating the last-byte range read
  90 GB per link per 10 minutes counted as 300 bytes, and one storage call per
  video became about 38 against an account-wide API limit whose 429 would
  reach every library file, decks included.
- How many library rows are video or audio, and their sizes, was not counted:
  the catalogue is read only through `scripts/lib/library-read.mjs` (the
  Management API, production), which this branch does not call. The route's
  own comment recorded 61 library videos on 1 Nov 2026.

## Later (known, not fixed in this branch)
- A well-formed token with a bad signature costs one database call (500
  forgeries made 501 calls, replays too). The bound that cannot refuse an
  honest member is a local signature check against the project's published
  keys (JWKS), with an unknown key id or algorithm sent to the database, never
  refused.
- `bearerOf` accepts a token of up to 4,096 characters.
- The library's fallback count during a limiter outage is per instance, so it
  bounds each instance, not the total: it is not a cost ceiling.

## Checks
- The original reproduction scripts and both reviews' probes, at the head:
  no unhandled error, no leaked text, the mic refuses 100 of 100 with the
  limiter down, prototype qids are 400, the mailer text stays out, 50 throwaway
  accounts send 15 mails.
- `npm run lint:data` and `npm run test:unit`: the last run's result is in the
  branch's final commit message.
- Not run: build and e2e (CI runs them).
