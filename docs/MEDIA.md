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

A question figure keeps that one box through its three states. While the file is on the way the box is
the card's own surface with a pale band across it. Once it is in, the box is white, the page a line
drawing with a clear ground is drawn for. When it did not come, the note "ภาพโหลดไม่ได้", the picture's
`imageAlt` and "ลองโหลดอีกครั้ง" stand in the same box, so the stem and the options do not move; the
picture is asked for again by itself when the connection returns. The zoom view takes the picture's
shape from the same sizes: it is the largest box of that shape the screen holds, there before the file
is. A deck figure is never drawn wider than its own pixels or taller than 80% of the screen.

## Where each kind lives

| Kind | Folder | Named by | In the registry |
|---|---|---|---|
| Question figure | `public/figures/questions/` (`q<id>.webp`, or one name for a figure several questions share), `public/images/<set>/` (older sets) | the bank row's `image`, `imagePath` or `explainImage`, with `imageAlt` | `question` |
| Inline question figure | `src/data/images-com.js`, `images-com4.js` (SVG as a data URI) | the bank row's `image` or `explainImage` | counted (`totals.question.inline`) |
| Deck figure under a note section | `public/figures/<subject>/<topic>/p<page>-<n>.webp` | `src/data/slide-images.generated.js`, written by `scripts/extract-slide-figures.mjs` | `slide` |
| A page's own picture inside those folders | `public/images/landing/` | a path written out whole in `src/`, `vca/src/`, a page at the root or a static page under `public/` (the blog) | `page` |
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
size, the way up a browser shows it (a photograph stored on its side is turned first), and changes the
path in the banks.

**Its caption and credit.** `imageCaption` and `imageCredit` are printed under the picture while the
question is open, on the question card and on the review card. A caption says what kind of picture it
is or where its data comes from, never what the question asks. `lint:source-line` reads both fields of
every question (`figureTextLeak` in `scripts/lib/answer-leak.mjs`) and fails on one Thai word or one
number of the key, on the whole of the key where no other option is named, and on three words in a row
of the key that the stem does not carry and not every option shares. `imageAlt` is not held to that: it
is the picture in words, and what it says is what the picture shows.

**A picture that moves.** A set parked on a device keeps its questions whole, each with the address of
its figure, and is resumed whenever the student returns. So a question picture that is renamed,
re-encoded under another extension or merged into another file keeps its old address: add
`{ "source": "<old>", "destination": "<new>", "permanent": false }` to `redirects` in `vercel.json`,
before the rule for the old host (`media-to-webp.mjs` prints the row). `tests/unit/media-redirects.test.mjs`
fails when a rule leads to a file that is not under `public/`. The VCA site needs none: it serves
figures under content-hashed names and reads questions from its bank, never from a stored row.

**Deck figures.** `node scripts/extract-slide-figures.mjs --subject <id> --folder "<folder>" --write`
needs the decks and poppler. It skips a deck's template (an image drawn four or more times in one deck)
and a drawn shape (below), keeps one file per picture, removes files no section lists, and re-applies
the hand placements. Without the decks, `--clean --write` does the template, shape, copy and unlisted
passes on what is on disk. Then `npm run regen:media`.

What a person decided about a figure is three tables in `scripts/lib/slide-figure-placements.mjs`:
- `REKEYS`: `{ figure, to: [topic, heading], label }` files a figure under a note section, and
  `{ figure, drop }` takes one out for good. A listed figure is shown where its rows say and nowhere
  else, so a figure that belongs in two sections has two rows; `--clean` fails, naming the row to add,
  when a section showed a second file of a hand-placed picture.
- `KEEP_REPEATED`: a real figure that repeats four times in its deck.
- `KEEP_FLAT`: a real figure whose pixels read as a drawn shape.

The tables name files. A fresh extraction numbers a page's figures in the order it keeps them, so a
page that loses template art or a shape before a figure gives that figure a lower number than it has
today: after a fresh extraction of a deck, look at each of its rows' pictures again.

## What `lint:media` holds (`npm run lint:data` runs it)

| It fails on | Meaning | The fix it prints |
|---|---|---|
| `missing` | a question, a note section or a page's own source shows a path that is not under `public/` (`explainImage` included, which nothing checked before) | restore the file or correct the path |
| `unreferenced` | a file in `public/figures` or `public/images` that no question, no note section and no source file shows (`src/`, `vca/src/`, the pages at the root, the static pages under `public/`) | show it or delete it |
| `not a figure` | a deck figure whose pixels are a drawn shape: a flat mask, a smoothly filled shape, one flat colour | `--clean --write`, or `KEEP_FLAT` for a real figure |
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
  more copies in one deck were pictures the deck repeats on its own pages, in no section's subject
  (292 files), and the 81 groups with two or three were slide content. A threshold of three would have
  removed five real figures. Seven of the nine were backgrounds and banners (197 files). Two were
  biological pictures the cytology deck draws on nearly every page and its note never mentions: a skin
  section stained H&E (`histo--cytology/p10-0`, 56 copies) and a cell drawing without labels (`p10-1`,
  39 copies). Those two could not be checked against the deck, which is not on the build machine;
  `KEEP_REPEATED` in the placement tables says how to bring one back.

## A drawn shape is not a figure

A slide puts a photograph on a dark rounded backdrop, points at it with an arrow, and stands a triangle
or a gradient bar beside the text. A deck saves each as an image, and the extractor took them for
figures: after the template art went, 77 of the 1,833 deck figures were such shapes, 54 of them the
same backdrop (`#333333` on `#000000`) in 37 sections, and the section "Clinical signs และ lesions ของ
Chytridiomycosis" showed three backdrops and nothing else.

`scripts/lib/slide-figure-shape.mjs` reads it from the pixels, about 200,000 of them on an even grid,
transparency flattened on white. It measures five things: the share of pixels within 3 levels of the
pixel on their left and the one above (smooth); the share within 10 levels of the commonest colour, of
the two commonest and of the three (tones); how many colours, five bits a channel, each hold 0.1% of
the picture; the share that is exactly one of the two commonest colours (exact); and the share that is
white (paper). A picture is a shape when:

| Kind | Rule | What it took on 11 Nov 2026 |
|---|---|---|
| `flat`, a mask | at most 12 colours, 95% in three tones, 60% exact | 57: the 54 backdrops (7 to 11 colours, 96.4% to 98.4%, 64.5% to 84.0%), two silhouettes cut for a photograph, a white triangle |
| `smooth`, a filled shape | 95% smooth and 93% in three tones | 13: arrows, triangles, a disc, rounded panels, a bar (95.8% to 98.1% smooth, 94.5% in three tones or more) |
| `smooth`, a gradient | 98.5% smooth, whatever the tones | 5: two dark vignettes and three bars shading from blue to black, all 100% smooth |
| `blank` | 99.5% in one tone, and 95% smooth | none; the fullest picture, a line drawing, is 93.3% paper |

A picture at least half white is drawn on paper and is never `flat` or `smooth`: a chart, a table, a
line drawing.

The numbers were set from all 1,833 files. The 75 pictures the rule took and the 38 nearest to it (what
a much looser rule with no paper guard would take) were put on contact sheets and looked at one by one:
none of the 75 is a picture, and every real picture among the 38 is kept. The nearest on each side:

| Number | The shape closest to it | The picture closest to it, and what keeps it |
|---|---|---|
| 12 colours | a backdrop with 11 (`aquatic-fungi/p32-1`) | a green fluorescence field has 14 (`viral-ag-detection/p2-0`), and only 12.6% exact |
| 95% in three tones | a silhouette at 95.9% (`fungal-disease-and-classification-lect1/p25-0`) | a grey micrograph of 11 colours at 92.9%, with 40.1% exact (`lect-12-2-diagnostic-techniques/p3-0`); a dog drawn on black at 94.3%, with 25 colours |
| 60% exact | the same silhouette at 64.4% | no picture passes the other two numbers; the micrograph above is at 40.1% |
| half paper | a white triangle on black, 47.2% paper | a standard curve of 8 colours and 98.3% in three tones is 95.5% paper (`lab-pcr-other-molecular-techniques/p20-2`) |
| 95% smooth, 93% in three tones | a rounded panel at 95.8% and 94.5% (`higher-bacteria/p18-2`) | an antibiotic disc plate is 95.8% smooth with 89.8% in three tones; the fluorescence field has 97.9% in three tones and is 90.6% smooth |
| 98.5% smooth | the bars and vignettes at 100% | a test tube on a white bench, the smoothest photograph, at 97.1% |

Two shapes the rule keeps were dropped by name, in `REKEYS`: a grey shadow of 84 by 134 pixels
(`histo--bone-marrow/p51-1`, 92.1% in three tones) and an empty frame with teal waves along its edge
(`fungal-disease-and-classification-lect1/p10-2`, 71.7% paper). So 77 files went: 1,756 deck figures
are left, in 897 sections. Nine sections showed nothing but shapes and show no figure now.

The rule is applied in three places: the extractor skips a shape before it fills a page's three places,
`--clean` removes one from the map and the disk, and `lint:media` fails on one. A new number is a new
measurement: run the rule over every deck figure and look at what it takes and at what it nearly takes
(`tests/unit/slide-figure-shape.test.mjs` holds the numbers and seven of the nearest pictures).

## Not built yet

- One lookup across media: from a question or a topic to its figure, its slide page and its video
  moment. The registry's `usedBy` is the figure half of it.
- The two video-summary systems as one; credit and licence fields on every picture; `srcset` or AVIF
  derivatives; sizes for the VCA site's own card (`vca/`, which copies figures as they are).
- A fresh extraction of the decks: 70 note sections showed nothing but pictures their deck repeats on
  every page and 9 nothing but drawn shapes. They show no figure now, and their real figures are still
  in the decks.
- Decoration that is a picture stays: a petri-dish icon on two title slides, a cartoon peach, a banner
  photograph, a lecturer's portrait. The shape rule reads pixels, and these are pictures.
