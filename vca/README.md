# VetMock VCA

The exam hub at **vca.vetmock.com**: practice and timed mock exams for the Thai veterinary
licensing exam (VCA), drawn from the VetMock bank and arranged by the domains the exam asks.
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
| `npm run e2e` | Playwright, desktop and phone, against a dev server on port 24125 |
| `npm run og` | Redraws the link-preview covers in `public/og/` |
| `npm run icons` | Redraws the app icons in `public/icons/` |

## How the data flows

- `scripts/build-bank.mjs` reads the main app's `../src/data` read-only: the bank registry, the
  delivery gate, the curriculum, the subject covers and the VCA library. It writes one
  content-hashed JSON file per domain to `public/bank/`, figures to `public/q/`, and
  `src/generated/{bank,catalog,library}.js`. All three outputs are git-ignored and rebuilt
  before every dev, build and test run, so counts on the site always come from the bank.
- `src/data/domains.js` maps course subjects and VCA topics onto the 19 exam domains. A new
  subject in the main bank is either mapped there or listed in `EXCLUDED_SUBJECTS` with a reason;
  `tests/unit/domains.test.mjs` fails while a deliverable subject is neither.
- `src/data/exam.js` holds the rounds the evaluation centre has announced, with sources. Add the
  next year's rounds when the centre publishes them (it announced 2569's on 17 Nov 2568).
- `src/data/almanac.js` is the cohorts' record of questions per subject, 2558 to 2568, transcribed
  from the CUVET almanac. The tests check every sum against the printed tables. It weights mock
  exams "as the exam asks" and feeds the exam page.

## Design notes

Type: Inter with Anuphan for text, Instrument Serif with Noto Serif Thai (87.5% width) for
headlines, Geist Mono for catalogue numbers, Mali for the few handwritten notes. All are OFL
and self-hosted in `public/fonts/` with their licences. The footer print is Stefano della
Bella's *A Lost Horseman Enquiring the Way* (1649), The Cleveland Museum of Art, CC0, stored as
an ink mask in `public/art/footer-della-bella.webp`; the domain plates are the main app's art.

Motion: the top bar's three pieces run together into one liquid-glass capsule once the page moves
(`src/lib/liquid.js`, its outline tested in `tests/unit/liquid.test.mjs`), and the footer's VCA
rises with the scroll (`initScenes` in `src/lib/motion.js`). Reduce motion keeps both still.

## Community

Profiles, an open exam board and chat, on VetMock's own accounts (Google, LINE or an email
link), live in `src/online/` and the `vca` schema. They are off until the backend is configured
(ARCHITECTURE.md, "Turning the community on"); a dev server runs them against an in-memory demo.

## Deploy

`vercel.json` here builds this folder as its own project. The root `vercel.json` ignores
`vca/`, so a change here never redeploys vetmock.com, and this project's ignore step watches the
shared `../src/data`, `../src/lib` files and `../public` it reads.
