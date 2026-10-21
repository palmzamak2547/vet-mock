# VetMock writing studio: plan (draft 2026-10-21)

Owner ask (Palm, 2026-10-21): study GoodNotes and beat it on design, stability, speed, accuracy,
fit and zero bugs; minimal, modern, glass where it belongs; full of delight; understand the
students. References: GoodNotes (web + public site), REA (behaviour-level study only),
Understand-Anything (map our own writing code before changing it), X clips (ASCII sharks,
ASCII Magic library, crumpled paper, speaksilq, cookie hamster).

Boundary: study GoodNotes by using it and by what its pages show. No decompiling the native app,
no copying its code or assets. ascii-sharks has no licence: ideas only, our own drawing code.

## What a Chula vet student writes on

1. Lecture decks (PDF) before and during class: highlight, circle, margin notes, quick diagrams.
2. Exam prep: redraw a pathway or an anatomy sketch from memory, then compare with the slide.
3. Short-answer and summary questions: handwriting turned into text.
4. Imaging and specimens: mark a radiograph, a lesion, a smear.
Usually on an iPad with Apple Pencil, sometimes a phone, sometimes a laptop in the library.

## Have (5.154.0)

Pen, highlighter, eraser (area and whole stroke), custom colours, size, undo/redo, zoom, pen-only
palm rejection, draw-and-hold shapes, search the PDF text, page thumbnails, account sync, export
annotated PDF, full screen, open at a linked page from VetWiki and topics.

## Gaps against GoodNotes, ordered by what a student feels first

| # | Slice | Why it matters | Delight |
|---|---|---|---|
| 1 | Lasso: select, move, resize, recolour, delete, copy strokes | the most used tool after the pen | selection breathes (spring scale), glass handles |
| 2 | Pages: add blank page after this one, paper (blank, lined, grid, dot, Cornell), delete, reorder | a deck has no room to write | delete = page crumples into a ball, undo unfolds it with its creases |
| 3 | Notebooks without a PDF: new notebook, cover, recent shelf | GoodNotes' home screen | empty state: halftone fish drifting behind a soft veil |
| 4 | Ink feel: pressure, tilt, smoothing, predicted points, 120 Hz | "writes better than paper" is their headline | none needed, it has to just feel right |
| 5 | Text box and sticky note on a page | typed notes beside ink | glass sticky that settles with a damped spring |
| 6 | Zoom window for small handwriting | margin notes on dense slides | |
| 7 | Handwriting to text and search inside ink | we already transcribe for the answer pad | Mochi reacts as words appear |
| 8 | Laser pointer, tape (hide answers until tapped) | study and teaching | tape peels |
| 9 | Audio recording tied to strokes | replay what the lecturer said while writing | |

Every slice: unit tests for its pure logic, e2e on the reader, a press sweep on production,
reduced motion handled per effect (never a blanket off), light and dark themes pure, 44 px
targets, Thai copy, no middle dots. One slice per PR release.

## Slice 1 (built 2026-10-21): lasso + blank notebooks

- `src/lib/lasso.js` (pure, unit-tested): point in polygon, a stroke is taken when 60% of its
  points are inside the loop, erasers never; bounds; move and uniform scale (line width scales
  with the ink); corner-handle scale clamped to 0.2x-6x.
- `src/components/LassoLayer.jsx`: marching-ants loop, dashed box with four 44 px corner handles,
  glass action bar (recolour swatches, duplicate, delete, done). A tap on the box does nothing;
  only a drag past 3 px moves.
- Reader: a moved, recoloured, duplicated or deleted set is written as new strokes plus
  tombstones for the old ids (the stroke eraser's rule, so sync needs nothing new). Undo and redo
  take a lasso action back as one step; the order between pen strokes and lasso actions is kept
  in memory (a WeakMap), never in the stored strokes. Keys: Esc lets go, Delete removes,
  Ctrl/Cmd+D duplicates, captured before the full-screen Esc.
- `src/lib/notebook.js` + `src/components/NotebookShelf.jsx`: a notebook is a PDF the app makes
  (A4; blank, 8 mm lines with a margin, 5 mm grid, 5 mm dots, Cornell), opened under the stable
  key `nb:<id>`, so adding a page remakes the paper and keeps the ink. The ruling is drawn once
  and shared by every page (100 dot pages are a few kB more than one). Removing a notebook asks,
  crumples the card away (a fade under reduced motion) and says so to screen readers.
- Not yet: inserting a page in the middle, notebooks listed on other devices (the list is per
  browser; the ink itself syncs by its key).

### 5.156.1 hotfix (2026-10-22)

5.156.0 opened notebooks through a blob: URL that the reader fetched. Production's CSP
(`connect-src`) has no `blob:`, so every notebook failed on vetmock.com with "เชื่อมต่อไม่ได้", while
the local gate and all CI e2e passed: `vite preview` sends no CSP. Now the reader takes the bytes
(`ingestRemote({ bytes })`, `new File([bytes])` for export), and the notebook e2e runs under the
CSP read from vercel.json (`withProductionCsp`). Proven: that test fails on 5.156.0's reader and
passes on the fix.
