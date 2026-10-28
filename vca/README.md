# VetMock VCA

The exam hub at **vca.vetmock.com**: practice and timed mock exams for the Thai veterinary
licensing exam (VCA), drawn from the VCA material in the VetMock bank (papers recalled after each
round, the cohorts' VCA compilations, sourced VCA sets; never VetMock's own course questions) and
arranged by the domains the exam asks.
It is its own Vite + React app, deployed as its own Vercel project, like `research/`.

How it is put together, what it shares with VetMock and what it keeps to itself, and how to
switch on and grow the community: [ARCHITECTURE.md](ARCHITECTURE.md).

## Commands

Run from `vca/`.

| Command | What it does |
|---|---|
| `npm run dev` | Builds the bank, then serves on port 43120 |
| `npm run build` | Builds the bank, `vite build`, then `scripts/prerender.mjs` writes one HTML head per route and `sitemap.xml` |
| `npm test` | Unit tests (Bangkok time); `npm run test:utc` runs them in UTC |
| `npm run test:db` | The community schema in a throwaway in-memory Postgres (PGlite) |
| `npm run e2e` | Playwright, desktop and phone, against a dev server on port 24125 (`VCA_E2E_PORT=24126 npm run e2e` runs another checkout's suite beside this one's) |
| `npm run og` | Redraws the link-preview covers in `public/og/` |
| `npm run icons` | Redraws the app icons in `public/icons/` |
| `npm run plates` | Redraws the domain plates' smaller copies in `public/art/224/` and `public/art/448/` (listed in `src/data/plates.js`). Run it after the art or the domain list changes; `tests/unit/plates.test.mjs` fails while they are stale. Needs `sharp` from the repo root |

## How the data flows

- `scripts/build-bank.mjs` reads the main app's `../src/data` read-only: the bank registry, the
  delivery gate, the curriculum, the subject covers and the VCA library. It writes, per domain,
  a small content-hashed index (every question's key, source and topic, no text) and shards of
  12 questions each to `public/bank/`, figures to `public/q/`, and
  `src/generated/{bank,catalog,library}.js`. All three outputs are git-ignored and rebuilt
  before every dev, build and test run, so counts on the site always come from the bank. A page
  reads the index to draw a set and fetches only the shards that hold the questions drawn
  (`src/lib/bank.js`; ARCHITECTURE.md, "Questions").
- `src/data/domains.js` says what the site serves and where it goes: only the main bank's VCA
  subject, each question named by a row of `VCA_SOURCES` (or kept out by `NOT_VCA`, with the
  reason /about prints), and its VCA topic decides one of the 19 exam domains. A VCA question no
  row names stops the build, so a new source is a decision, not a gap; a domain with no question
  yet is left off the site. Answers given to questions the site no longer serves stay in a
  student's record and count nowhere (`lib/progress.js`).
- `src/data/exam.js` holds the rounds announced so far, with sources: the evaluation centre's, and
  round 1/2570 on the faculty's word (28 Oct 2569), with no hours and no results day until the
  centre publishes 2570 (it announced 2569's on 17 Nov 2568); then replace it with the centre's.
- `src/data/almanac.js` is the cohorts' record of questions per subject, 2558 to 2568, transcribed
  from the CUVET almanac. The tests check every sum against the printed tables. It weights mock
  exams "as the exam asks" and feeds the exam page.

## Design notes

Type: Inter with Anuphan for text, Instrument Serif with Noto Serif Thai (87.5% width) for
headlines, Geist Mono for catalogue numbers, Mali for the few handwritten notes. All are OFL
and self-hosted in `public/fonts/` with their licences. The footer print is Stefano della
Bella's *A Lost Horseman Enquiring the Way* (1649), The Cleveland Museum of Art, CC0, stored as
an ink mask in `public/art/footer-della-bella.webp`, asked for only as a reader nears the footer (`data-near`
in `src/lib/motion.js`); the domain plates are the main app's art, drawn from the smallest copy that is
sharp on the screen asking (`srcset`, `public/art/224` and `448`).
Inter and the headline Thai are subsets of the fonts in `fonts-src/` (`scripts/subset-fonts.py`).

Motion: the top bar's three pieces run together into one liquid-glass capsule once the page moves
(`src/lib/liquid.js`, its outline tested in `tests/unit/liquid.test.mjs`), and the footer's VCA
rises with the scroll (`initScenes` in `src/lib/motion.js`). Reduce motion keeps both still. Nothing that
loops may run under a pane of glass: each frame makes the GPU blur the pane again, so the light's drift
moves in steps and the hero's pulsing dots rest after three beats (`src/styles/motion.css`). Prints are
inked in with transforms, not a mask position, so the compositor draws them.
Only panes that float over the page (the bars, sticky toolbars, sheets, the hero's sample) blur what
is behind them; a card that scrolls with the page keeps the glass's colour and rim without the blur,
which the GPU otherwise redid on every frame of a scroll. While the page moves, the drift and the
pulsing dots hold still and carry on when it rests (`initScrolling`). The bar's outer pieces turn to glass by
fading a layer of their own (opacity), never by animating a blur or a shadow.

## Community

Profiles, an open exam board and chat, on VetMock's own accounts (Google, LINE or an email
link), live in `src/online/` and the `vca` schema. They are off until the backend is configured
(ARCHITECTURE.md, "Turning the community on"); a dev server runs them against an in-memory demo.

## Deploy

`vercel.json` here builds this folder as its own project. The root `vercel.json` ignores
`vca/`, so a change here never redeploys vetmock.com, and this project's ignore step watches the
shared `../src/data`, `../src/lib` files and `../public` it reads.
