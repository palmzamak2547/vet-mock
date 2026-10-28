# VetMock VCA: how it is put together

VCA (vca.vetmock.com) is the exam hub for the Thai veterinary licensing exam. It lives in this
repository beside VetMock (vetmock.com) and shares exactly three things with it: the question
bank's data, the student's account, and the people who moderate. Everything else is its own, so
either site can change without the other noticing. This page says which is which, how the code
is layered, and what to do to grow it.

## What is shared and what is not

| | Shared with VetMock | VCA's own |
|---|---|---|
| Questions | Read at build time from `../src/data` (registry, delivery gate, curriculum, VCA library). VCA never edits them. | Its 19 exam domains (`src/data/domains.js`), how a set is drawn, the index and shards per domain in `public/bank/` |
| Display helpers | `@vetmock/lib/richtext.jsx` and `@vetmock/lib/option-shuffle.js`, so a question reads and shuffles the same on both sites | Everything else on screen |
| Art and fonts | The domain plates and fonts in `../public` | The type scale, colours, glass, motion (`src/styles`) |
| Account | VetMock's Supabase project: `auth.users`, Google, email links, LINE through VetMock's `line-auth` function | Its session in its own storage key (`vmx-vca-auth`), so the two sites never sign each other out |
| Moderators | VetMock's admins (`public.is_admin()`) | |
| Practice and results | | This device only (`vca:*` keys on vca.vetmock.com). No account needed, nothing sent anywhere |
| Community data | | Schema `vca` (`supabase/migrations/20261017120000_vca_community.sql`): profiles, the board, chat, blocks, reports |
| Deploy | | Its own Vercel project (`vercel.json`), its own CSP, service worker, sitemap and covers |

One door connects the two sets of data, and it opens one way: `vca.vetmock_snapshot()` gives a
signed-in student their own VetMock name, emoji and practice totals, read-only, to start a VCA
profile from when they choose to. VCA never writes a VetMock table, and VetMock never reads
the `vca` schema. Every `vca` row hangs off the auth user with `on delete cascade`, so
VetMock's delete-account function removes a student's VCA rows without knowing they exist.

## Layers

```
data, generated   facts: exam rounds, the almanac, domains; the bank build's output
lib               logic, stores and browser plumbing (sets, sessions, progress, motion)
components        UI pieces (Shell, Sheet, Question, Link, Icon)
pages             the practice product's routes (Home, Practice, Session, Bank, Exam...)
online            accounts and the community: anything above, plus the network
app               App.jsx, main.jsx, router.js: compose all of it
styles            any layer may bring its own stylesheet
```

`tests/unit/boundaries.test.mjs` holds these lines: a new import that crosses one fails the
unit tests. The rules that matter most:

- The practice product never needs the network. Components and pages reach `online/` only
  through its front door, `online/index.js` (`AccountButton`, `useAccount`, `discussHref`,
  `COMMUNITY_ON`), which loads nothing heavy. Supabase and LIFF load the first time a student
  signs in or opens a community page.
- Only `online/client.js` imports `@supabase/supabase-js`; only `online/line.js` imports
  `@line/liff`.
- VetMock's code comes in through the `@vetmock` alias, and only for the two helpers above.

## The community layer (`src/online/`)

```
index.js          the front door (see above)
config.js         MODE from the build's env: live, demo or off
account.js        who is signed in, as one store; sign-in, sign-out, the profile save
client.js         the Supabase client (lazy, own storage key, schema vca)
live.js           the backend calls against Supabase
demo.js           the same calls, in memory, for development and the end-to-end tests
shapes.js         the vocabulary (kinds, rooms, report reasons) and row-to-page shapes
line.js           LINE sign-in through LIFF
ui/               the account button and sheets, avatars, post cards, the question peek
pages/            Community, Post, Compose, Profile, Chat, AuthCallback
community.css     the community's styles, loaded with its pages and sheets
online.css        the two pieces in the frame on every page: the avatar and account button
```

**The backend contract.** Pages call `getBackend()` and get an object with five parts: `auth`,
`profiles`, `board`, `chat`, `safety`. `live.js` and `demo.js` both implement every call; the
unit test `community.test.mjs` fails if one offers a call the other lacks, and walks the demo
through a whole session (sign in, profile, post, reply, like, chat, block). Rows from the
database become page shapes only in `shapes.js`, so a column rename touches one file.

**Modes.** `live` when the build has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `demo`
on a dev server or with `VITE_COMMUNITY=demo`: signing in is instant, as a demo student, and
the tab keeps what happened. `off` in a production build without a backend: the nav link, the
footer column, the account button and "คุยข้อนี้" disappear, and a community address shows a
"coming soon" page.

**Who may do what** is decided by the database, not the pages: row-level security, column
grants, guard triggers (handles, rate limits, fields a writer may not set), and three reports
from different people hiding a post until a moderator looks. The pages only ask, and turn
refusals into Thai a student can act on (`problemText`).

## Questions: from the main bank to a domain

`scripts/build-bank.mjs` runs before every dev, build and test. It reads the registry and the
delivery gate (`isQuestionDeliverable`) and keeps VCA material only (Palm, 28 Oct 2026): the
main bank's VCA subject, each question named by a row of `VCA_SOURCES` in `src/data/domains.js`
(a recalled round, a compilation of past papers, a set adapted from one, the "VCA ผ่านชัวร์" set)
or kept out by `NOT_VCA`; a VCA question nothing names stops the build. VetMock's course banks
never reach the site. It keeps learner-ready multiple-choice questions, maps each by its VCA
topic to an exam domain, and writes each domain as an index and shards; a domain with no question
is left off the site. The source's kind decides the badge: `paper` for questions people sat,
`vca` for sets reworded or adapted from them.

**Index and shards** (`src/lib/bank-index.js` is the one place that knows the layout; the writer
is `scripts/bank-shards.mjs`). A domain used to be one file of megabytes, fetched whole to draw ten
questions. Now it is:

- `<domain>.index.<hash>.json`: every question's key, source, topic and place, no text (0.7 to 15
  KB raw, 0.3 to 2.5 KB compressed). It is all a set needs to filter by source, topic and what the
  student has answered, and to draw.
- `<domain>-<n>.<hash>.json`: shard n, the full text of 12 consecutive questions in bank order
  (about 20 KB raw, 4.2 KB compressed). Question number `at` is in shard `floor(at / 12)`.
  `SHARD_SIZE`'s comment in `bank-shards.mjs` gives the reasoning: ten random questions land in
  ten different shards, so a start costs shards x shard size, and 12 puts it near the cost of
  the round trips.

`lib/bank.js` loads indexes (`loadEntries`), then the shards that hold chosen entries
(`loadQuestions`), once each and shared by whoever asks. Starting a set, resuming one, the result
review and the community's question peek all fetch only the shards they need; the bank page shows
its first page from three shards and fetches the rest in order behind it (`openBank`). A file that
fails is asked for again once; after that the caller sees the failure, and nothing about it is
remembered. `tests/unit/bank-shards.test.mjs` proves that the shards of each domain, put back in
order, are the questions its single file held, field for field; each index carries the digest the
old file's name had.

What small files cost, and where it shows. All 520 are 2.0 MB compressed where 19 whole-domain
files were 1.4 MB (brotli 11; 2.2 against 1.7 at level 5), so reading the whole bank (the bank
page, to search every question) pays 30 to 45% more bytes, and a 200-question paper fetches some
140 shards. The bank page therefore shows its first page at once, answers a search from what has
arrived and says so, and renders three times in all (not once per file). And a set reopens
offline from the bank cache, but a new set offline can draw only from shards this device already
holds: one visit no longer caches a whole domain.

The service worker (`public/sw.js`) keeps the bank (indexes, shards, figures) in a cache of its
own, apart from the app's files, so a run of shards cannot push the app's entry scripts out of
a shared limit; at install it also stores the files the shell names (script, stylesheet, fonts), so
a first visit that ends offline opens.

Recalled papers such as VCA round 1/2569 Part 2 live in the main bank like any other source
(`../src/data/questions-vca-2569.js`), with their images in `../public/images/vca-2569/`. An
answer that could not be settled carries `flag: { severity: 'unclear' }`, which the delivery gate
holds back until someone reviews it.

## Turning the community on

The code ships with the community off. In order, each step the owner's call:

1. **Database.** Review and apply `supabase/migrations/20261017120000_vca_community.sql`
   to the VetMock project. Then, in the dashboard, add `vca` to Project Settings > Data API >
   Exposed schemas.
2. **Auth redirects.** Authentication > URL Configuration > Redirect URLs: add
   `https://vca.vetmock.com/auth/callback` (and a preview or `http://localhost:43120/auth/callback`
   for testing). Google and email links then come back to VCA.
3. **LINE.** In the LINE Login channel VetMock already uses, add a LIFF app whose endpoint is
   `https://vca.vetmock.com/auth/line`, and the same URL as a callback URL. Deploy the
   `line-auth` function so it accepts the VCA origin
   (`supabase/functions/_shared/app-origins.js` already lists it).
4. **Vercel (VCA project) environment.** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (the
   publishable key) and `VITE_LINE_LIFF_ID`. A rebuild switches the site to `live`, adds
   `/community` to the sitemap and gives it its own cover.
5. **CSP.** `vercel.json` allows the VetMock project's URL for `connect-src` (https and wss) and
   LINE's hosts. A different project URL needs the same change there.

## Growing it

- **A community page:** add it under `online/pages/`, its address in `router.js`, its loader in
  `ONLINE` in `App.jsx`. Community pages load only when visited and import `../community.css`.
- **A backend call:** add it to both `live.js` and `demo.js`; the contract test names the one
  you missed.
- **A table or a rule:** a new migration under `supabase/migrations/` (name it `*_vca_*` so
  the VCA workflow runs), with row-level security and explicit grants, and a check in
  `scripts/test-community-db.mjs`, which applies it to a throwaway PGlite database in CI
  (`npm run test:db`).
- **A practice feature:** stays in `lib/`, `components/` and `pages/`, and keeps working with
  no account and no network.
- **A new VCA source** (the next round's recall, another compilation): a row in `VCA_SOURCES`
  in `src/data/domains.js`, matched on the questions' own provenance fields, and a new VCA topic
  a rule in its domain. Data only: no page changes.

## Checks

| Command | What it holds |
|---|---|
| `npm test` | Unit tests, Bangkok time: sets, sessions, progress, the almanac, the exam calendar, domain mapping, layer boundaries, the community's shapes and demo backend |
| `npm run test:db` | The community schema in PGlite: 13 checks on policies, guards, counts, the bridge and account deletion |
| `npm run e2e` | Playwright on a desk and a phone, including the community in demo mode |
| `npm run build` | The bundle, one head per route, the sitemap |
