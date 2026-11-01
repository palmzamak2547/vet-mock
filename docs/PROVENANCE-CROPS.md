# Provenance crops and subject proof PDFs

Palm, 31 Oct 2026: every question that came from a senior's file should carry
an image of where it came from, and each subject should have one PDF that
shows our item, its key and the cropped source, with the span the key came
from highlighted, so anyone can see the key is real and not guessed.

This page is the design, revised after one independent review. The scripts
are `scripts/provenance/`. The data they produce is private and never enters
this repository (see Privacy).

## What it produces

1. **A crop registry.** One record per (question, document, page, role),
   JSONL per subject, rebuilt from the current bank on every run.
2. **Crop images.** The untouched region of the source page as JPEG. Boxes
   are drawn by the PDF from the record, never burned into the image.
3. **One proof PDF per paper**: a subject with a midterm and a final gets two
   files, named by the paper date so they sort in exam order; topics on both
   papers appear in both. Year-5 finals first (`EXAM_SCHEDULE.y5` in
   `src/data/schedule.js`), then the rest of Year 5, then other years.
4. **A report** per subject: counts per evidence state, why each unlocated
   question was not located, and the queue of records a person should check.

## Data model

```json
{
  "qid": "swine-clinic:209107",
  "bankFile": "questions-y5-swine-final-marked.js",
  "role": "origin | key",
  "doc": { "sha16": "0123456789abcdef", "name": "<file name as received>",
           "cite": "swine-med-pa-vet81@35p", "kind": "senior | senior-marked-deck | deck",
           "who": "<the cohort as the file states it, else where it came from>" },
  "page": 10,
  "pageSize": [595, 842],
  "rotation": 0,
  "bbox": [40, 212, 560, 330],
  "crop": "crops/0123456789abcdef/p010-40-212-560-330.jpg",
  "located": "text | vision | model | hand",
  "item": { "score": 0.82, "margin": 0.4 },
  "answer": { "state": "answer | ambiguous", "index": 1, "how": ["mark", "typed", "written"] },
  "support": { "state": "states | mentions", "boxes": [], "exact": true, "pointed": false },
  "highlights": [ { "type": "key | mention | source-answer | our-key | senior-<kind>", "bbox": [], "exact": true } ],
  "clause": "answer-match | answer-conflict | ambiguous | states-marked | states | mentions | none",
  "evidence": "<the question's summary state>",
  "checked": false,
  "flags": []
}
```

- `qid` is `subject:id`, the way the bank keys questions. Pages are 1-based.
- `role: origin` is a senior's file (where the item or the marked point was
  seen); `role: key` is a lecture deck (where the key's support is).
- Boxes are PDF points in the page's own space, origin top-left (PyMuPDF), so
  a crop can be re-cut at any resolution. `exact: false` marks a band placed
  from the vision grid; the PDF draws it as a margin bar, never as a box.
- `doc.sha16` is the first 16 hex of the file's SHA-256, the key
  `scripts/archive-inventory.mjs` and `library_docs.sha256_16` use.
- `checked` is true only after a person confirmed the crop. The bank's
  `source`, `verified`, `examOrigin` and `sourceType` are read, never written;
  the PDF prints them through `humanSource` and as stored.

## Where things live

| What | Where |
|---|---|
| Scripts, this design | repo: `scripts/provenance/`, `docs/PROVENANCE-CROPS.md` |
| Data root | `VMX_PROVENANCE_DATA`, default `C:\dev\vetmock-provenance-data`; both scripts refuse a root inside any git work tree |
| Document table | `<root>/docs.json`: cite or alias pattern → file (sha16, name, path, pages, kind, who), pinned by a person |
| Caches | `<root>/pages/` (page analysis), `<root>/vision/` (page transcriptions), `<root>/pointer/` (key pointers) |
| Crops | `<root>/crops/<sha16>/` |
| Registry, report, checks | `<root>/registry/<subject>.jsonl`, `.report.json`; `<root>/checks.json` |
| PDFs | `<root>/pdf/` |

## Pipeline

1. **Export** (`build.mjs export`): the bank through `scripts/lib/bank-file.mjs`.
   `sourcePages` is authoritative for every document it names; page runs in
   `source`/`verified` (`pageRuns`) add only documents it does not name, each
   run tied to the nearest document name before it, with an item label
   ("ข้อ 9") bound to the run it follows. A document named with no page is
   searched page by page when it has 40 pages or fewer.
2. **Documents** (`docs.json`): each cite resolves to one pinned file. A cite
   that resolves to nothing is reported, never guessed.
   - `crops.py --pin` pins a `SOURCE_DOCS` edition by page count and name
     (local roots and every subject's current library files), then by page
     count among the subject's own folders only when the name shares a word
     and leads the other files. Every page-count pin is read by a person:
     two wrong ones were caught that way on 31 Oct.
   - `crops.py --alias` proves a document named only in text: each candidate
     with enough pages is scored by how many citing questions find their own
     Latin words on the cited page; one is taken only with four or more
     testable questions, 60% found, and a 25-point lead. The evidence goes
     into the pin. Names a person can read off the cite (a file's own name, a
     library deck's exact title) are pinned by hand.
   - A content lane's own registry (`docs-registry.json`) is checked against
     the pins; its `.txt` extracts are never pinned in place of the PDF.
3. **Page analysis**, cached per (sha16, page): lines with their own Thai
   health (these fonts swap vowels for ASCII symbols, `เ*น`), red or bold
   spans, and vector marks with stroke geometry (a translucent box with one
   segment is a slide shape, not a highlighter). Marks are read only on
   `senior` and `senior-marked-deck` files.
4. **Vision**, once per page, for image pages and pages whose text layer
   does not give the item: the page is rendered with labelled bands
   (about 24 bands two lines tall, labelled in both margins) and DeepSeek flash
   transcribes it band by band with its
   marks. It never sees our question, options or key, so it cannot copy them
   back. A calibration run transcribes pages whose text layer is healthy and
   reports how often vision places the same item.
5. **Locate** on text lines or transcribed bands, locally:
   - **The item** (origin pages): the stem's distinctive tokens (Latin words,
     numbers, Thai trigrams on healthy lines), a boost for the cited label,
     and a margin over the next-best place; a small margin is flagged.
   - **The source's answer**: only an answer-form signal decides it: a
     circle or tick on exactly one of the item's options (a vector stroke
     counts only when it closes on itself around the option), one option set
     apart in red or bold, or a written ตอบ/Ans/เฉลย line (not ตอบสนอง).
     Options are matched by their text, never by printed order: a written
     letter goes through the source's own line with that letter, because the
     bank may have reordered the options. Signals on several options are
     `ambiguous`. A cross or strike rules an option out, and a star,
     underline or highlight is emphasis: drawn, never read as an answer. No
     answer is read for a negative frame or an all-of key, nor unless the
     options sit as a list under the stem.
   - **The item's block** ends at the next item's label (its number plus
     one); the answer and the key's text are looked for inside it only.
   - **The text the key rests on**: our key phrase, contiguous in one or two
     lines, with no distractor's words beside it, on three or fewer pages of
     the document, and on an origin page outside the item's own options:
     `states`. A key that carries a negator (not, no, ไม่) needs it in the
     same lines. Anything weaker, any negative frame (ข้อใดไม่, ยกเว้น,
     EXCEPT, NOT), an all-of or combination key, every written item, and a
     page of items on which this item was not found reach only `mentions`,
     printed as "k of n appear".
   - **Across languages** (Thai options, English deck): the model gets the
     page's numbered lines and our key, and may only point at lines and copy
     their words. The copy must stand contiguously in those lines, carry no
     distractor's words, and carry the key's own Latin terms when it has
     any, or the pointer is dropped. A kept pointer is its own state,
     `pointed`: counted apart, drawn dotted, never promoted to states-marked.
   - Deck pages are tried in cite order, three at most; the first that
     states the key ends the search and the rest are listed, not cut.
6. **Crop**: the item and its support, widened to their own column only,
   rendered at 2.2x or the embedded image's own resolution.
7. **Evidence**: one clause per crop, and the question's summary in this
   order: answer-conflict, blind-disagrees, ambiguous, answer-match,
   states-marked (the key text lies under a senior's mark), states, pointed,
   mentions, blind, none. `blind` (no source answer; the content lane's
   recorded blind solve agreed) and `blind-disagrees` come from the lanes'
   `verify/` records (`blindKey` rows joined to their items by stem and
   option text, never by index) and are counted apart from source evidence.
8. **PDF** (`build.mjs pdf`): HTML with Sarabun, printed by Chromium
   (Playwright), which breaks Thai lines correctly.

## Checks by a person

`crops.py --check <qid> <sha16> <page> <role> ok|wrong|R10-R14[:left|right]` writes
`checks.json`. `ok` holds while the new region contains the checked box and
the stem is unchanged; `wrong` drops that page for that question; bands place
the region by hand on the same grid, and a hand placement wins over every
machine result. The report's queue lists only vision-placed, pointed,
flagged or shared-region records.

## PDF layout (A4)

- Cover: subject, the paper and its date, counts per state for that paper,
  the legend, date of the bank.
- Topic statistics (Palm, 31 Oct): per topic of the paper, its lecturer this
  year, questions in the bank, past-paper items, how many cohorts and which
  (with paper and count) from `EXAM_RECURRENCE`, and items written from marks.
  History only: it never says what this year will ask.
- This year's decks, first page of each, topic by topic. A library file of
  the current academic year (`crops.py --covers` reads the public shelf with
  the app's anon key and the bytes from R2) is placed on a topic by the
  questions that cite it, the lecturer sets, then its title and first page.
  A topic with no file this year shows an earlier deck the topic's questions
  cite, only when the file names the same lecturer (Palm, 31 Oct); else the
  title slide cut from the class recording (`LECTURE_COVERS`); else it says
  no file. Files placed on no topic are listed at the end.
- Final-scope topics first, then midterm, in curriculum order; within a
  topic, past papers, compilations, items written from marks, lecture-derived.
- Each item: number, `qid`, source type, `examOrigin` as stored; stem;
  options with our key in green; why (the explanation's first part); source
  through `humanSource`; up to two origin crops and one key crop with file
  name, page, whose file it is, how it was located and its clause; the other
  cited pages listed; the summary line.
- Items with no crop go to an appendix with key, cites and the reason.

## Privacy and academic safety

- The repository is public. Crops, the registry, `docs.json`, file names of
  senior files, caches and PDFs stay under the data root. Nothing of them
  goes into `src/data/`, the app, the library or a commit, and handoff notes
  carry counts only. The console prints counts, qids and hashes.
- Showing any of it to students is Palm's decision. A later step may copy
  the registry to private Supabase storage for the admin page; not built.
- Source files are untrusted: parsed by PyMuPDF under `python -I`, passed as
  paths, never executed.
- `npm run lint:academic-safety` scans `src/` only, so the scripts and this
  page were checked against its vocabulary by hand; they carry none of it.

## Re-running when questions land

```
node scripts/provenance/build.mjs all --subject swine-clinic
```

runs export, crops and PDF; `--year 5` runs every subject in paper order.
Caches key on what each step reads: a page analysis on (sha16, page,
version), a transcription on (sha16, page, prompt version), a pointer on
(sha16, page, question, options, key). A new document asks to be pinned once.
`crops.py --dry` prints the pages vision would read; `--max-calls` caps a run.

## Cost

Claude reads no pages in bulk. Text work is local. A page transcription is
about 4,500 tokens and a pointer about 2,000, both on DeepSeek flash and both
cached, so a re-run with no new pages costs nothing.
