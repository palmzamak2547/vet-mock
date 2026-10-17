# VetMock VCA: handoff for local work, 2026-10-17

Branch `ccr-207d6695-bl2wyq`, draft PR #37. This is what the cloud checkout could not do:
steps that need the owner's accounts (Supabase, LINE, Vercel, DNS), checks that need real
phones, and the questions that need a person's judgement. The app itself, its tests and the
data are on the branch. How the app is put together is in `vca/ARCHITECTURE.md`.

## Where it stands

- **The hub (`vca/`)** covers practice, mock exams, the bank, the library, the exam page and
  progress, and it is built and tested. Before this handoff, `npm test` passed 198 unit tests,
  `npm run e2e` passed 44 Playwright tests on a desk and a phone, and `npm run build`
  prerendered 25 routes plus home.
- **The community** (accounts, profiles, the board, chat, reports, blocks) is complete in
  code:
  - It runs in demo mode on `npm run dev`.
  - A production build keeps it out of sight until the backend below is switched on.
  - `npm run test:db` checks the schema on PGlite.
- **VCA round 1/2569 Part 2** is in the main bank as `src/data/questions-vca-2569.js`:
  - 132 questions; 122 are ready for learners and 10 are held for review (listed below).
  - The six figures are in `public/images/vca-2569/`.
  - Everything is in our own bank: nothing links to the seniors' Drive or sheet.

## Needs your accounts, in this order

Each step is the owner's call. `vca/ARCHITECTURE.md`, "Turning the community on", has the
reasons; these are the clicks.

1. **Supabase (the VetMock project): the schema.**
   1. Run `npm run test:db` in `vca/` first.
   2. Check `supabase migration list` so nothing else is pending, then apply
      `supabase/migrations/20261017120000_vca_community.sql`.
   3. In Project Settings > Data API > Exposed schemas, add `vca`.
   4. Check it: signed in, `select * from vca.vetmock_snapshot()` returns your own name and
      totals. Signed out, the board reads but cannot be written.
2. **Supabase: auth redirects.** In Authentication > URL Configuration > Redirect URLs, add:
   - `https://vca.vetmock.com/auth/callback`
   - the preview domain's `/auth/callback`
   - `http://localhost:43120/auth/callback`
3. **LINE.** In the LINE Login channel VetMock already uses:
   1. Add a LIFF app with endpoint `https://vca.vetmock.com/auth/line`, size Full, scopes
      `openid` and `profile`.
   2. Add that URL as a callback URL.
   3. Deploy `supabase/functions/line-auth` so that the VCA origin it now lists
      (`_shared/app-origins.js`) is live.
4. **Vercel: a new project for VCA.**
   1. Create it from this repository with Root Directory `vca` and framework Vite.
      `vca/vercel.json` already sets the build, output, CSP and caching. Keep files outside
      the root directory included, because the bank build reads `../src/data` and `../public`.
   2. Set the environment: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (the publishable
      key) and `VITE_LINE_LIFF_ID`. A build with them switches the community to live.
   3. Add the domain `vca.vetmock.com` and its DNS record.
5. **Release.** Merging PR #37 also deploys vetmock.com, because the branch changes
   `src/data`:
   - the new bank, the counts and the VCA topics in `curriculum.js`;
   - `tests/unit/config-ladder.test.mjs` now reads the year count instead of a fixed number.

   Follow `docs/LAUNCH_READINESS.md` as for any main push.

## Checks that need real phones

- **Google:** sign in on vca.vetmock.com, land back on the page you left, and confirm
  vetmock.com stays signed in on its own.
- **LINE:** open vca.vetmock.com inside LINE and sign in through LIFF. Then sign in from an
  ordinary browser, which should hand over to LINE and come back.
- **Email:** open the email link on an iPhone (Mail, then Safari) and on Android.
- **The community on a phone:** post, reply, like, chat in a room, report a post and block a
  person. A post that three people report is hidden until a moderator looks.
- **The installed app:** a domain opened once can still be practised offline.

## VCA round 1/2569 Part 2: the ten held questions

Each held question carries `flag: { severity: 'unclear', note }`. The note says, in Thai, what
is unsettled, and the delivery gate keeps the question from learners.

| No. | ID | Topic | What is unsettled |
|---|---|---|---|
| 6 | 692006 | theriogenology | Sources disagree on the day a pregnant bitch starts producing milk |
| 31 | 692031 | theriogenology | Cytology at peak progesterone: small intermediate cells or parabasal cells |
| 50 | 692050 | ruminant | Only 2 options were recalled; a jaw abscess in a goat is usually caseous lymphadenitis, which is not offered |
| 52 | 692052 | ruminant | The current dairy-farm standard (มกษ. 6402-2562) sets no floor area per cow |
| 61 | 692061 | exotic | Elephant dystocia: whether to wait or to give oxytocin |
| 74 | 692074 | dogcat | Pyelonephritis: pradofloxacin or cefpodoxime |
| 89 | 692089 | equine | Dorsal cannon wound: proud flesh or a bone sequestrum (its key is also 1.7 times the other options' length) |
| 91 | 692091 | swine | Postpartum dysgalactia: constipation or a large litter |
| 122 | 692122 | food-hygiene | Raw-milk outbreak: Campylobacter or Salmonella |
| 123 | 692123 | theriogenology | The longest normal stage II in the bitch: 12 or 24 hours |

To release one:
1. Settle the key and rewrite the stem or options if needed.
2. Delete its `flag`.
3. Run `npm run regen:all` and `npm run lint:data`.

Questions 54 and 134 were dropped as repeats of 18 and 99.

## Part 3 (หมวด 3): follow Part 2

- **Source:** the students' sheet, tab หมวด 3. Rewrite it into our bank and link to nothing
  outside it.
- **Where it goes:** append to `QB_VCA_2569` in `src/data/questions-vca-2569.js`, with IDs
  693000 + the question's number. The file already has its own bundle chunk and registry
  entry. File the new origin, `VCA รอบ 1/2569 หมวด 3 (บันทึกหลังสอบ)`, in
  `src/data/exam-origins.js` as kind `paper`.
- **Fields, as in Part 2:**
  - `subject` `vca`, `year` 5, `type` `mcq`, `sourceType` `past-paper`
  - `topic` from the VCA topics in `curriculum.js`
  - `tags` `['vca', topic, 'vca-2569']`
  - `source` `ผู้เข้าสอบ VCA รอบ 1/2569 บันทึกหมวด 3 ข้อ N หลังสอบ เรียบเรียงใหม่`, adding
    `บางส่วนของโจทย์หรือตัวเลือกเติมขึ้นจากที่จำได้ไม่ครบ` when options were filled in
  - `verified` and `verificationSources`, naming sources that were actually opened
  - figures in `public/images/vca-2569/p3-NNN-*.jpg`, each with a Thai `imageAlt` that
    describes what is visible and never gives the answer
  - `noShuffle` only when the options name places on a figure
- **Method:**
  1. Answer each question against a source opened for it.
  2. Solve it again independently, without seeing the first answer.
  3. Re-examine every disagreement.
  4. Hold whatever is still unsettled with a Thai note.
  5. Fix options where two are right, or where the choices nest (as in 4, 6 and 8 hours).
  6. Spread the keys over the five positions, and keep each key under 1.6 times the mean
     length of the other options.
  7. A stem may say ดังภาพ or จากภาพ only when the figure is attached. Use no middle dot, and
     นิสิต, never นักศึกษา.
- **Gates:**
  - at the root: `npm run regen:all`, `npm run lint:data`, `npm run test:unit`
  - in `vca/`: `npm test`, `npm run build`, `npm run e2e`

## Running it locally

- Use Node 24, as CI does. On Node 22 two unit tests outside this PR's files fail: the emoji
  check on the exam chrome (UI-17) and a React warning in the OSCE drill's mock timers.
- `npm run e2e` in `vca/` needs port 43120 free.
- The working files from Part 2 were handed over separately: the answer sheets, the
  independent checks, the decisions and the build script. Keep them under `work/`, which git
  ignores.

## Open, not started

- The library holds a "Table of specification" for หมวด 2 and 3, which may be the official
  blueprint. If it checks out, the domain weights could follow it instead of the cohorts'
  recalled counts.
