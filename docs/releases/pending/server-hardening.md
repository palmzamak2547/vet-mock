```js
{ kind: 'fix', scope: 'system', title: 'ใช้เน็ตมหาวิทยาลัยได้เต็มโควตาของตัวเอง', desc: 'ปุ่มอธิบายใน VetWiki ตรวจคำตอบ ไมค์ เขียนด้วยมือ และเสียงอ่าน นับโควตาตามบัญชีของแต่ละคน ไม่ต้องแบ่งกับเพื่อนที่ใช้ Wi-Fi เดียวกันในห้องเรียนหรือห้องสมุด' },
```

# Server hardening (pending, branch `claude/server-hardening`)

Eleven items from a review of the API, the service worker and the device-only
tools. Each lands with a guard that fails if the defect returns.

## 1. A paid route counted only while the limiter worked
- `api/ai-transcribe.js` let a clip through when the shared limiter could not
  count. It now refuses (503, retryable) like every other paid route.
- Other routes with the same shape: `library-file.js`, `library-blob.js`,
  `video-file.js` (reading surfaces, open through a limiter outage by an earlier
  decision, AGENTS.md "Library and sync") and the `?health=1` read of
  `ai-chat.js` (costs no token). Left as they are and listed by name in the guard.
- Guard: `tests/unit/api-hostile-requests.test.mjs` fails on the fail-open
  pattern in any file not on that list; `ai-transcribe.test.mjs` checks that a
  limiter outage reaches no provider.

## 2. Members shared one limit per network
- `limitCaller(req, gate, route, max, windowMs)` in `api/_lib/rate-limit.js` is
  the one way a gated route counts: a signed-in caller on `<route>:user:<id>` at
  the route's limit, the address on `<route>:addr:<ip>` at 15 times that, and a
  caller without an account on the old `<route>:<ip>` key.
- Used by wiki-explain (20/h), the mic (40/h), handwriting (40/h), agent-action
  (30/h), study-coach (120/h), grade-summary (120/h), race-start (60/h), tts
  (60 per 5 min), tts-iapp, the library link and the video route. The daily
  provider budgets are unchanged and remain the shared ceiling.
- Guard: the hostile-request test fails when a gated route builds a limit key
  from the address and has no per-account count; it also checks that fifteen
  students on one address each keep their own limit and that the address
  ceiling still brakes one address cycling accounts.
- Cost: a gated request now makes two limiter calls instead of one.

## 3. An unauthenticated probe could cost money
- The microphone's GET probe sent half a second of audio to the provider on each
  cold instance, and a query string bypassed the edge cache. It now answers from
  configuration and from what real clips met: a provider that refused a clip for
  credit or permission (401, 402, 403) is left out for ten minutes and the
  microphone hides. The admin status card keeps an explicit test clip
  (`testTranscription`), behind the admin check.
- Guard: `ai-transcribe.test.mjs` asks the probe 50 times and through the handler
  with 20 different query strings, and counts zero provider calls.
- Unproven: until a real clip fails, a provider out of credit shows the
  microphone; the first clip then fails with the existing message and the
  microphone hides for ten minutes.

## 4. The written grader's JSON was shown as it came
- `api/_lib/grade-shape.js`: each score is an integer clamped to its category's
  maximum, the maximum comes from the rubric (essay 7/5/3, short answer 2), a
  category the rubric lacks is dropped, the essay word penalty is counted from
  the answer (over the soft maximum 1, over the hard maximum 2), and the total is
  recomputed and never below zero. A grading with a category missing or not a
  number is refused with the existing "could not read" answer (502).
- Guard: `api-hardening.test.mjs` (out-of-range scores, made-up categories and a
  wrong total through the handler; the essay rubric directly).

## 5. Handlers threw on a hostile body
- `api/_lib/body.js`: `readJsonBody` (and `readEncodedJsonBody` for the
  read-aloud routes' base64 body) return a plain object or null, never throw; the
  handler answers `sendBadBody` (400, fixed Thai message). Every handler that
  reads a body uses it, except ai-chat, ai-voice and move-in, which parse inside
  their own guards.
- Guard: the hostile-request test reads the handler list from `api/`, sends each
  fifteen hostile requests (no body, null, a string, an array, a number, an
  unreadable body, a huge body, wrong field types, a foreign origin, a bad query)
  with the network cut, and fails on any unhandled error, a 5xx other than 503,
  or a handler reading `req.body` outside the reader.

## 6. Error text reached responses
- tts, tts-iapp, agent-action, external-connect, external-connect-start,
  fetch-external-doc, wiki-explain and playlist answered with error or parser
  text. They log it and answer a fixed message with a short `code`.
- Guard: the same test fails when a response holds a stack frame, a file path,
  the network error's text, the body error's text or JSON parser text.

## 7. The origin rule admitted any `vetmock-*.vercel.app`
- Narrowed to `vetmock-<…>-palmzamak2547s-projects.vercel.app`, the pattern the
  Supabase functions already use (`supabase/functions/_shared/app-origins.js`).
  It covers the previews of the vetmock, vetmock-ai and vetmock-vca projects.
  The bare `vet-mock-*.vercel.app` pattern is gone.
- Assumed: Vercel keeps names ending in the team's suffix for that team. The
  exact legacy names `vetmock.vercel.app` and `vet-mock.vercel.app` stay.
- Guard: the hostile-request test admits four real preview shapes and refuses
  five look-alikes.

## 8. Feedback could be shut by a few addresses
- The form is shown before sign-in (`ChulaGateView`), so it stays open to
  visitors. A signed-in member is counted on their own account (3 in 10 minutes,
  10 a day), with the address as a 15x ceiling; a visitor by address at the same
  numbers. Visitors draw first on a share of 40 of the mailer's 100 a day, so
  they cannot use up what members' messages need. The client sends the session
  header when there is one.
- Guard: `chula-api-gate.test.mjs` (the route asks the gate who is writing and
  never refuses on its answer) and the hostile-request test (bad bodies).
- Unproven: 100 a day is the mailer's own allowance; members together can still
  reach it.

## 9. Device-only work could be evicted
- `src/lib/persist-storage.js` asks `navigator.storage.persist()` once per device,
  the first time a student saves something of their own (any device-only tool
  except the watch history, and a new notebook). A refusal is remembered; nothing
  is shown.
- Guard: `tests/unit/persist-storage.test.mjs` (asked once, never looped, no
  text, wired in both places).
- What syncing each would need (not built): flashcards and cloze decks, and
  image-occlusion decks, need a table per deck with per-card ids and edit times
  (occlusion masks also need their images in storage, sized like the library's
  uploads); the pinboard and video notes are small JSON that fit the existing
  `sync_user_data_v2` payload as new keys with a last-writer rule per item;
  custom clips are a list of links that fit there too; watch history is a set
  that merges by union; notebooks need their page list in that payload, while
  their ink already syncs by document key.

## 10. The sitemap
- The build already added all 224 prerendered VetWiki topics to
  `dist/sitemap.xml` (`public/sitemap.xml` holds only the hand-kept pages). What
  was wrong: it also listed `/app/about`, which sits behind the sign-in wall.
- `scripts/lib/sitemap.mjs` now holds the rules for the three build steps; an
  /app screen is listed only when it is indexable and open before sign-in.
  `GATE_PUBLIC_VIEWS` moved to `src/lib/gate-public-views.js` so the wall and the
  sitemap read one list.
- Guard: `tests/unit/sitemap.test.mjs` runs the build's steps on
  `public/sitemap.xml` and fails if a prerendered topic is missing or anything
  behind the wall is listed.
- Left: `/app/about` keeps `indexable: true` in `src/data/og-covers.js`; whether
  it should be public or noindex is the owner's call.

## 11. The service worker called a slow network "offline"
- Which requests took the path: same-origin GETs that are not /api, not
  `/assets/`, not a navigation, not an image, font or manifest, and not an atlas
  model: the landing video, glTF models and JSON under `public/`. Lazy chunks
  and question banks are under `/assets/`, which is cache-first with no timeout,
  so study on a weak connection was not affected.
- On that path, a request with no cached copy now keeps waiting past 4 s
  instead of answering 503; a cached copy still answers at 4 s, navigations keep
  the cached home shell fallback. `SW_VERSION` is `v229-2026-11-11`.
- Guard: five cases in `service-worker-update-safety.test.mjs`.
- How a phone gets it: `sw.js` is served `max-age=0, must-revalidate`, so the
  browser compares it on the next navigation (and at least daily), installs the
  new worker in the background, and activates it once every tab of the site is
  closed (no early activation, by design). Until then the old worker serves.

## Checks
- The review's reproduction scripts, before: four handlers threw on an unreadable
  body, `tts` threw on a body of `null` and put parser text in two answers, and
  100 of 100 clips reached the provider with the limiter down. After: no throw,
  no leaked text, 100 of 100 refused with 503 and no provider call.
- `npm run test:unit` and `npm run lint:data`: see the branch's last run.
