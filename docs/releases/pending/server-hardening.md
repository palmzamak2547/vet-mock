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
  short-lived links) and the AI `?health=1` read.
- Guards: `tests/unit/api-limits.test.mjs` (150 students on one address, a
  scripted member and a classmate, throwaway accounts, an outage);
  `api-hostile-requests.test.mjs` fails on a fail-open limit outside its list
  and on a gated route that counts by address alone.

## The gate (`api/_lib/chula-gate.js`)
- Failed tokens are braked per address: a token the database refuses is counted
  on `chula-gate-failed:<ip>`, and an address with 120 refusals in 10 minutes is
  answered 429 without asking the database. Members are not counted; a member
  this instance has already checked passes before the brake. This covers every
  route where the gate runs before a limit (video-file and send-feedback among
  them). Not counted: a valid account that is not a member.
- A deployed preview without database settings refuses like production. The
  signal is `VERCEL_ENV`: `production` or `preview` refuse; unset (the dev
  server, the unit suite) or `development` (`vercel dev`) stay open. A preview
  whose database lacks the wall's function also refuses.
- Guard: `api-limits.test.mjs` (200 forged tokens after the brake cost the
  database nothing; previews refuse, local development opens).

## Feedback (`api/send-feedback.js`)
- Open before sign-in (`ChulaGateView`). A member: 3 in 10 minutes and 10 a day
  on their own account, then the address as a ceiling (30 and 100), incremented
  only when the account allowed the message. A visitor (a free account counts
  as one): 3 in 10 minutes and 20 a day per address. Visitors use at most 40 of
  the mailer's 100 a day.
- A full day answers `reason: 'daily_cap', scope: 'caller'`, and the form says
  "พรุ่งนี้ส่งได้อีก" (`src/lib/feedback-client.js`, `daily_mine`) instead of
  "wait a little". Correction: the first version answered `rate_limited` there.
- The mailer's own error text is logged; the sender gets `mailer_error` and a
  code. Correction: the first version returned it.
- Guards: `api-limits.test.mjs` (50 throwaway accounts on 5 addresses send 15;
  a visitor's full day; the mailer's 403 text), `feedback-client.test.mjs`.

## The library's bytes (`api/library-blob.js`)
- The storage API ignores Range, so every GET pulls the object through the
  function. The route now fails closed, and besides 300 requests per link per
  address it budgets bytes per address: 8 GB per 10 minutes (a whole object per
  request; a media range, the object up to its end). The link carries no
  account (public links are minted once per window for every caller and the
  mint is edge-cached), so the address is what can be counted.
- Guard: `api-limits.test.mjs` (the 164th 50 MB pull from one address is
  refused before storage is asked; an outage refuses); `api-hardening.test.mjs`.
- Unproven: what a real hall uses. A higher or per-account budget would need
  the account in the link, which public links cannot carry.

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

## Checks
- The original reproduction scripts and both reviews' probes, at the head:
  no unhandled error, no leaked text, the mic refuses 100 of 100 with the
  limiter down, prototype qids are 400, the mailer text stays out, 50 throwaway
  accounts send 15 mails.
- `npm run lint:data` and `npm run test:unit`: the last run's result is in the
  branch's final commit message.
- Not run: build and e2e (CI runs them).
