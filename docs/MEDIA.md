# Media: where every picture lives, and what keeps it clean

Owner ask, 11 Nov 2026: store pictures and video so they come out fast and exact, with no rough edges.
This is release one of that: **one registry of every picture a question or a note shows, measured, with
a lint that holds it.** Video and a lookup across media are listed at the end as what comes next.

## The registry

`npm run regen:media` (`scripts/media-registry.mjs`) reads the question banks (`image`, `imagePath`,
`explainImage`) and the slide-figure map (`src/data/slide-images.generated.js`) against `public/figures`
and `public/images`, and writes three files. Never edit them by hand.

| File | What it holds | Who reads it |
|---|---|---|
| `src/data/media-registry.generated.json` | one line per picture: path, width, height, bytes, the first 16 hex characters of its SHA-256, kind, and what shows it (`question:<subject>:<id>:<field>`, `note:<section id>`, `source:<file>`) | scripts and tests; never the browser |
| `src/data/media-sizes.generated.js` | the question figures' pixel sizes | `src/lib/media-size.js`, loaded with the question banks |
| `src/data/slide-image-sizes.generated.js` | the deck figures' pixel sizes, by deck folder | `components/SlideFigures.jsx`, loaded beside the slide-figure map |

The sizes are why a picture no longer moves the page: `ZoomableImage` (the question card, Review and the
review cards) and `SlideFigures` (Notes, VetWiki) give each `<img>` its `width` and `height`, so the
browser lays the final box out before the file arrives. An inline SVG figure takes its size from its
`viewBox`. A figure a student links in a question of their own has no size and shows as before.

## Where each kind lives

| Kind | Folder | Named by | In the registry |
|---|---|---|---|
| Question figure | `public/figures/questions/` (`q<id>.webp`, or one name for a figure several questions share), `public/images/<set>/` (older sets) | the bank row's `image`, `imagePath` or `explainImage`, with `imageAlt` | `question` |
| Inline question figure | `src/data/images-com.js`, `images-com4.js` (SVG as a data URI) | the bank row's `image` or `explainImage` | counted (`totals.question.inline`) |
| Deck figure under a note section | `public/figures/<subject>/<topic>/p<page>-<n>.webp` | `src/data/slide-images.generated.js`, written by `scripts/extract-slide-figures.mjs` | `slide` |
| A page's own picture inside those folders | `public/images/landing/` | a literal path in `src/` | `page` |
| The slide under a revealed answer | R2 bucket `vetmock-evidence`, never in this repository | `src/data/evidence/<subject>.generated.js` (`docs/ANSWER-EVIDENCE.md`) | no |
| Course covers, plates, share-card art | `public/subject-art/`, `public/art/`, `public/panic-art/`, `public/og/` | `src/data/subject-covers.js`, `src/data/art.js`, `src/data/panic-cards.js`; `lint:art`, `lint:og` | no |
| 3D specimens | `public/atlas/` | `src/data/atlas-assets.generated.js` (`lint:atlas`) | no |
| Mochi | `public/motion/poses/` (`lint:mochi`), `public/motion/assets/mochi.png` | `src/data/mochi-poses.generated.js` | no |
| Brand marks | `public/brand/` (`ATTRIBUTION.md`) | `ConnectAppsView`, `ReminderPicker`, `ChulaGateView`, and the `ai/` app through `ai/build/shared-assets.mjs` | no |
| Landing video and stills | `public/landing/` | `src/views/landing/LandingBody.jsx` | no |
| Lecture video, transcripts, frames | R2, private (`docs/VIDEO-LIBRARY.md`); YouTube is the fallback, framed from `youtube-nocookie.com` | `src/data/videos.js`, `src/data/video-*` | no |
| Read-aloud clips | `tts.vetmock.com` (R2) | `src/lib/read-aloud.js` | no |

## Adding a picture

**A question figure.** Put a WebP in `public/figures/questions/` named `q<id>.webp` (never after what
it shows: the address is one long press away from the student), set `image` and an `imageAlt` of 20 or
more characters that describes what is visible without giving the answer, then `npm run regen:media`.
Two questions on one picture name the same file. A file over 200 KB is in the wrong format:
`node scripts/media-to-webp.mjs public/images/<set>/<file>.png --write` re-encodes it at the same pixel
size and changes the path in the banks.

**Deck figures.** `node scripts/extract-slide-figures.mjs --subject <id> --folder "<folder>" --write`
needs the decks and poppler. It skips a deck's template (an image drawn four or more times in one deck),
keeps one file per picture, removes files no section lists, and re-applies the hand placements in its
`REKEYS` table. A figure that should not show is a `drop` row there; a real figure that repeats four
times is a `KEEP_REPEATED` row. Without the decks, `--clean --write` does the template, copy and unlisted
passes on what is on disk. Then `npm run regen:media`.

## What `lint:media` holds (`npm run lint:data` runs it)

| It fails on | Meaning | The fix it prints |
|---|---|---|
| `missing` | a question or a note section shows a path that is not under `public/` (`explainImage` included, which nothing checked before) | restore the file or correct the path |
| `unreferenced` | a file in `public/figures` or `public/images` that nothing shows | show it or delete it |
| `same picture` | byte-identical files of one kind | one file; `--clean --write` for deck figures |
| `too heavy` | a question image over 200 KB (`QUESTION_IMAGE_MAX_BYTES`) | `media-to-webp.mjs` |
| `file name gives the answer` | a question figure whose file name carries a word only the key has | rename to `q<id>.webp` |
| `wrong folder`, `two kinds`, `not an image` | a figure outside its kind's folders, one file shown by a question and a note, or a stray file | move or remove it |
| `drift` | a generated file that is not what the script writes today | `npm run regen:media` |

Byte-identical files that must stay two files go in `SAME_BYTES_ALLOWED` (`scripts/lib/media.mjs`) with
a reason. It is empty: none was found.

The numbers behind two of the rules, both from the files on 11 Nov 2026:
- **200 KB.** The 48 WebP figures cut from decks topped out at 110 KB and the JPEG photographs at
  167 KB. Every file over 200 KB was a PNG screenshot of a photograph (ten, 245 to 756 KB) or one
  221 KB JPEG, and all eleven came under it as WebP at the same pixel size (14 to 179 KB).
- **Four repeats.** Every group of byte-identical deck figures was looked at: the 9 groups with four or
  more copies in one deck were template art (292 files), the 81 groups with two or three were slide
  content. A threshold of three would have removed five real figures.

## Not built yet

- One lookup across media: from a question or a topic to its figure, its slide page and its video
  moment. The registry's `usedBy` is the figure half of it.
- The two video-summary systems as one; credit and licence fields on every picture; `srcset` or AVIF
  derivatives; sizes for the VCA site's own card (`vca/`, which copies figures as they are).
- A fresh extraction of the six decks whose pages gave all three places to template art: those 70 note
  sections show no figure now, and their real figures are still in the decks.
