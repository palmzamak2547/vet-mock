# VetMock VCA: handoff for local work, 2026-10-17

Branch `ccr-207d6695-bl2wyq`, PR #37. This is what the cloud checkout could not do:
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
  - 132 questions; 123 are ready for learners and 9 are held for review (listed below).
  - The six figures are in `public/images/vca-2569/`.
  - Everything is in our own bank: nothing links to the seniors' Drive or sheet.

## Accounts: done on 2026-10-17, and the one step left

Done from the local checkout, each checked:

1. **Supabase schema.** `npm run test:db` passed 13/13, then the migration was applied as
   `vca_community`: 9 tables, 28 policies, RLS on every table, the 5 open rooms, and `messages`
   and `comments` in realtime. The security advisor added nothing for `vca`.
2. **Exposed schemas.** The project's Data API config is now `public,graphql_public,vca`
   (Management API). Signed out, `vca.posts` reads and `vca.rooms` is refused; `public` still
   answers 200.
3. **Auth redirects.** Added `https://vca.vetmock.com/auth/callback`,
   `https://vetmock-vca-*-palmzamak2547s-projects.vercel.app/auth/callback` and
   `http://localhost:43120/auth/callback`. The site URL and every existing entry are unchanged.
   A Google sign-in started with the VCA callback now keeps it (it fell back to vetmock.com
   before).
4. **`line-auth`** redeployed (version 6) with the VCA origin; the function body is main's.
5. **Vercel.** Project `vetmock-vca` (root `vca`, Vite, Node 24, files outside the root
   included), `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set, domain `vca.vetmock.com`
   attached. Its ignore step is `vca/scripts/vercel-ignore.sh` and builds production only: the
   first deploy failed because the inline command was over Vercel's 256-character limit.
6. **DNS.** `vca` CNAME to Vercel in the Cloudflare zone, DNS only.
7. **Google sign-in names the site (18 Oct).** `https://vca.vetmock.com` is an Authorized
   JavaScript origin of the "VetMock Web" OAuth client, and `VITE_GOOGLE_CLIENT_ID` is set on
   `vetmock-vca`: the sheet shows Google's own button (Google Identity Services), whose popup
   names the site instead of the Supabase project. Without the variable the redirect button
   comes back.
8. **Photos, video and onboarding (18 Oct).** Migrations `20261018090000_vca_media`,
   `20261018090100_vca_media_storage` and `20261018093000_vca_media_jpeg` are applied:
   buckets `vca-media` (public) and `vca-private` (direct rooms), five storage policies, and
   `photo`, `focus`, `onboarded_at` on profiles and `media` on posts, comments and messages.
   `npm run test:db` checks the row rules (14 checks); the storage policies need Supabase's
   storage schema, so they were checked on the project. Not built yet: removing a deleted
   post's files from storage (they stay until a cleanup job exists).

Left, and it needs the owner signed in to the LINE Developers console (no channel secret is on
this machine, so the LIFF API is not an option):

- In the LINE Login channel 2010109536 (the one VetMock's LIFF app is in), add a LIFF app with
  endpoint `https://vca.vetmock.com/auth/line`, size Full, scopes `openid` and `profile`.
- Put its LIFF ID in the `vetmock-vca` project as `VITE_LINE_LIFF_ID` and redeploy. Until then
  the sign-in sheet offers Google and email only; the LINE button is hidden, not broken.

Not part of VCA, noticed on the way: `20261006090000_feedback_usage_log` and
`20261007150000_external_connections` are in `supabase/migrations` but not applied to the
project. Whoever owns those features should apply them.

## Checks that need real phones

- **Google:** sign in on vca.vetmock.com, land back on the page you left, and confirm
  vetmock.com stays signed in on its own.
- **LINE:** open vca.vetmock.com inside LINE and sign in through LIFF. Then sign in from an
  ordinary browser, which should hand over to LINE and come back.
- **Email:** open the email link on an iPhone (Mail, then Safari) and on Android.
- **The community on a phone:** post, reply, like, chat in a room, report a post and block a
  person. A post that three people report is hidden until a moderator looks.
- **The installed app:** a domain opened once can still be practised offline.
- **Media on a phone:** set a profile photo (iPhone HEIC and an Android JPEG), post four
  photos, post a 30-second iPhone video (a MOV that Chrome on Android may not play: check), send
  a photo in a direct chat and see it on the other phone.

## VCA round 1/2569 Part 2: the nine held questions

Each held question carries `flag: { severity: 'unclear', note }`. The note says, in Thai, what
is unsettled, and the delivery gate keeps the question from learners.

| No. | ID | Topic | What is unsettled |
|---|---|---|---|
| 6 | 692006 | theriogenology | Sources disagree on the day a pregnant bitch starts producing milk |
| 31 | 692031 | theriogenology | Cytology at peak progesterone: small intermediate cells or parabasal cells |
| 44 | 692044 | parasitology | The figure is a look-alike the students found; its pale egg with a clear space reads as Toxascaris leonina, while the history points to Toxocara canis |
| 50 | 692050 | ruminant | Only 2 options were recalled; a jaw abscess in a goat is usually caseous lymphadenitis, which is not offered |
| 52 | 692052 | ruminant | The current dairy-farm standard (มกษ. 6402-2562) sets no floor area per cow |
| 89 | 692089 | equine | Dorsal cannon wound: proud flesh or a bone sequestrum (its key is also 1.7 times the other options' length) |
| 91 | 692091 | swine | Postpartum dysgalactia: constipation or a large litter |
| 122 | 692122 | food-hygiene | Raw-milk outbreak: Campylobacter or Salmonella |
| 123 | 692123 | theriogenology | The longest normal stage II in the bitch: 12 or 24 hours |

To release one:
1. Settle the key and rewrite the stem or options if needed.
2. Delete its `flag`.
3. Run `npm run regen:all` and `npm run lint:data`.

Questions 54 and 134 were dropped as repeats of 18 and 99.

### Second review, on the local checkout (2026-10-17)

Three reviewers solved all 132 again, blind to the key, and checked the figures. Fixed on the
branch:

- **Released:** 61 (the stem now says ultrasound found the calf dead and the cervix closed, which
  is what rules out oxytocin in the cited source) and 74 (MSD names fluoroquinolones and
  third-generation cephalosporins alike for pyelonephritis, so Cefpodoxime became Clindamycin).
- **Held:** 44, in the table above.
- **Two right answers or nested options:** 23 (Morbidity rate can mean attack rate; now Odds
  ratio, and the stem defines the measure), 33 (Cross-sectional is itself descriptive; now Cohort
  study), 90 (Drug allergy spans all four types; now Penicillin anaphylaxis).
- **The stem or the alt text gave the answer away:** 1, 37, 107 and 133.
- **Wording:** 80 asked for an organism with disease names as options; it now asks for the
  disease.
- **Explanations:** 8 (why dexamethasone is not the answer), 9 (the tapir claim rested on one
  animal), 64 (collagenase also works in remodelling), 118 (dropped a maternal-antibody window
  that read against the key), 111 (a repeated locator).

What the reviewers suggested for the held ones, if a person wants to release them:

- 6: no option fits milk let-down (the last week, about day 57 to 63). Ask about mammary
  enlargement instead, or keep it held.
- 50: add a firm, enlarged mandible to the stem, which leaves actinomycosis as the only answer.
- 89: add a shallow wound that does not reach the periosteum to keep C, or a chronic discharge
  after three weeks to make the sequestrum the key.
- 123: MSD gives no 12-hour limit. Ask instead how long a bitch may strain without a pup (1 to 2
  hours).

119 was checked again against the Royal Gazette page (เล่ม 133 ตอนที่ 85 ก, หน้า 16): มาตรา 30
gives the local administrator the appointment, and the director-general for export
slaughterhouses, as keyed.

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
