# Answer evidence: the slide an answer rests on

Palm, 11 Nov 2026: under each answer, show the real page of the lecture slide
the answer comes from, with the lines that state it highlighted, so a student
can see the key is what was taught and not a guess.

After a student answers (or opens the review), the card shows the part of the
slide around the highlighted lines; a tap opens the whole page. The same
block appears in practice, in the written-answer reveal and in the review
list. A timed paper reveals nothing in session, as before.

## The pieces

| What | Where |
|---|---|
| Which page and lines, per question | `src/data/evidence/<subject>.generated.js`, one lazy chunk per subject; `loaders.generated.js` maps them |
| The link between a slide and its question | `src/lib/evidence-hash.js`: a hash of the stem and the key |
| Loading, the crop, the image address | `src/lib/evidence.js` |
| The block on the card | `src/components/EvidenceSlot.jsx` (in the card), `AnswerEvidence.jsx` and `src/styles-evidence.css` (their own chunk) |
| The page images | R2 bucket `vetmock-evidence`, served at `slides.vetmock.com` under a folder whose name is a secret |
| Who is told that folder | `api/evidence-pass.js`: Chula members, through the wall |
| The pipeline | `scripts/evidence/pages.py` (PDFs, lines, pictures, images) and `scripts/evidence/build.mjs` (matching, index, upload) |
| The pipeline's data | `VMX_EVIDENCE_DATA`, default `C:\dev\vetmock-evidence-data`: outside every checkout, both scripts refuse a root inside a git work tree |
| Guards | `npm run lint:evidence`, `tests/unit/answer-evidence.test.mjs`, `tests/e2e/answer-evidence.spec.js` |

## What is public and what is not

The repository is public. A row in the index is a citation: document, page,
boxes in thousandths of the page, and the hash. It holds no slide text.

The page image is course material, served like the library's files: to Chula
members only. Images are stored as `e/<folder>/<sha256_16>/pNNN.webp`. The
folder is 32 random hex characters kept in `ROOT/folder.txt` and in the Vercel
variable `EVIDENCE_BASE`, never in the repository. `/api/evidence-pass` gives
the address to a caller the wall lets in, and the browser then loads images
from Cloudflare's edge: no function runs per image, and a cached page costs
nothing. A visitor outside the wall sees the citation line and no image.

Only library documents are ever shown (`library_docs`, status public, never a
past paper, never a document held for personal data). A senior's file is not a
library document and never appears, whatever the bank cites.

The address does not expire by itself, so `/api/evidence-pass` is stricter
than the wall's switch: it answers members only even while the wall is off,
never lets a browser or a proxy keep its answer (`no-store`), and the app
keeps the address for the tab only and forgets it when the account changes.

To retire a leaked address: write a new `folder.txt` (and empty
`uploaded.json`), run `upload` for every subject, set `EVIDENCE_BASE` in
Vercel, redeploy, delete the old folder's objects in R2, then purge
Cloudflare's cache for `slides.vetmock.com` (the images are served
`immutable`, so the edge keeps copies of the old folder until it is purged).
A tab that still holds the old address repairs itself: the first image that
fails makes it ask again.

## A slide is shown only for the question it was matched to

Each row stores `evidenceHash(question)`. The card compares it with the
question it is showing and hides the slide when they differ. So a stem or a
key edited later loses its slide until the pipeline matches it again; nothing
needs to be remembered by whoever made the edit, and `lint:evidence` counts
such rows instead of failing. The stem that is hashed is the whole sentence
(`wholeStem`): a stem whose numbers moved into a passage table keeps that
sentence in `say`, so laying it out as a table keeps its slide.

## How a slide is matched

No model writes or changes an answer. For each question in scope:

1. **Candidates.** The subject's library pages are ranked against the stem,
   the key and the explanation, plus search terms in Thai and English (the
   bank is mostly Thai, the decks mostly English). Pages of the documents the
   topic is taught from rank higher, and a library page the bank already cites
   is always among the eight read.
2. **Pointing.** A model sees those pages with numbered lines and may only
   name one page, line numbers and a copy of their words. The copy must stand
   in those lines (letters and digits compared, so bullets and spacing do not
   matter); if the numbers are off, the lines that do hold the words are
   taken; words the page does not hold end the attempt.
3. **A blind reading.** A second model is given only those lines, under the
   names of their document and slide, with the stem and the options but not
   the key, and asked which option the lines support. It must copy the words
   that decide it, and those words must stand in the lines: an answer from
   memory is not evidence. A true/false statement the lines merely do not
   mention is undecided, never false. When it confidently answers another
   option the row is a `conflict`: either the lines were the wrong ones or
   the bank's key needs a look.
4. **Numbers.** A number in the key that the lines do not print (a dose, a
   percentage, a duration) makes the row a `review`, with the numbers named:
   the slide may teach another figure.
5. **Pictures.** A page whose content is a figure, a table kept as an image
   or a scan is read once by a vision model that only transcribes. A slide
   matched through such text is shown whole, with no highlight to misplace.
6. **The last reading, by eye.** Nothing is published on those steps alone.
   Each proposed slide is drawn as the student will see it, beside the
   question and its key (`pages.py sheets`), and looked at. The verdict is
   `ok`, `weak` (right topic, but the lines do not show the key by
   themselves), `wrong`, or `key-doubt` (the slide disagrees with the bank's
   key). Only `ok` is published. A verdict holds for the pick it was given
   on: another page, other lines or an edited question puts the row back in
   the queue. On the first run (11 Nov 2026) an independent reading of 252
   proposed slides found 231 right, 17 weak, 3 wrong and 1 key in doubt,
   which is why this step exists.

A pick whose blind reading came back `undecided` is drawn too when `tocheck`
is given `--states ...,undecided`: the reader declines lines it would need a
heading or a table to read, and the eye can still find them right. On the
second pass (11 Nov 2026) 260 such and re-matched picks were looked at: 145
ok, 108 weak, 4 wrong, 3 keys in doubt.

Two faults of a PDF's text layer no longer end a match: a Thai sara am split
into a space and "า" ("จ านวน"), and mathematical letters ("𝑥"). And a fact
set over many short lines (a cycle diagram, a list of one-word bullets) may
take up to 14 lines when they hold 420 letters at most; the model is still
asked for eight.

What the last reading judges, panel by panel:
- `ok`: the highlighted lines (for a picture page, something plainly visible
  on the slide) state the fact that makes the key the right answer. A student
  would say "yes, this is where it comes from".
- `weak`: the right topic, but the lines do not show the key by themselves: a
  heading only, part of the fact, a broader term than the key's.
- `wrong`: another subject, or lines that support another answer.
- `key-doubt`: the slide is on point and disagrees with the key (another
  number, drug, organism, order). Quote the slide.
- A true statement needs lines that say it. A false statement needs lines that
  state the correct fact it gets wrong; not mentioning it is `weak`.
- A number in the key that the lines print differently is `key-doubt`; a
  number they do not print at all is `weak`.
- A calculation is the exception to that last line: its result comes from the
  question's own figures, which no slide prints. It is `ok` when the lines
  print the formula or the definition the key applies, or work the question's
  own example; `weak` when they only name the measure or work another example.
  The same holds for a key that reads the question's own figure (an interval,
  a predictive value) with the wording the lines give.
- Outside knowledge does not rescue a match: only what the slide shows counts.

A `key-doubt` and a `conflict` are findings about the bank, not about the
slide: they go to whoever owns the questions, with the slide's words.

Files in ROOT: `registry/<subject>.jsonl` (every question and what was
proposed for it), `checks.json` (the verdicts), `sheets/` (the drawn panels).

The report compares the picks with the library pages the bank itself cites
(`sourcePages`): that is the yardstick for a change to ranking or prompts.

## Running it

```
node scripts/evidence/build.mjs catalog
python -I scripts/evidence/pages.py fetch  --data <ROOT> --subject <id>
python -I scripts/evidence/pages.py lines  --data <ROOT> --subject <id>
python -I scripts/evidence/pages.py vision --data <ROOT> --subject <id>
node scripts/evidence/build.mjs find    --subject <id>
node scripts/evidence/build.mjs tocheck --subject <id> [--states states,review,conflict,undecided]
python -I scripts/evidence/pages.py sheets --data <ROOT> --subject <id>
   (look at ROOT/sheets/<id>-NNN.jpg; write [{ "qid", "verdict", "note" }])
node scripts/evidence/build.mjs check   --file <verdicts.json>
node scripts/evidence/build.mjs index   --subject <id>
node scripts/evidence/build.mjs upload  --subject <id>
```

**The provider's account is production's too.** `find` and `vision` call
DeepSeek with the machine's key; VetMock AI, the explainers and the grader
call it with production's key, and the two keys draw on one balance. The
first full run (11 Nov 2026: about 8,400 text calls and 4,400 page readings)
spent that balance to zero, and production answered from its second provider
until the account was topped up. Both scripts now read the balance before
they pay for anything, stop under a floor (`VMX_EVIDENCE_FLOOR_CNY`, 40 by
default) and end at once on a refusal for lack of balance. Before a large
run, look at the balance yourself and top up first.

Each run ends by printing what it paid for (calls, tokens in and out): keep
that line, it is the only measure of a run's cost. `vision --dry` lists the
picture pages still unread without paying for one. The provider's price list
(read 11 Nov 2026) charges double in its peak hours, 01:00 to 04:00 and
06:00 to 10:00 UTC on weekdays, which is 08:00 to 11:00 and 13:00 to 17:00
in Bangkok: run a batch in the evening, at night or at the weekend.

Environment: `SUPABASE_ACCESS_TOKEN` (catalog), `CLOUDFLARE_API_TOKEN` and
`R2_ACCOUNT_ID` (fetch, upload), `DEEPSEEK_API_KEY` (find, vision). Every model
call is cached by its input, so a re-run asks only about what changed. Upload
before the index reaches production: an index row whose image is missing shows
the citation line alone.

`find` covers this year's final and what no paper is recorded for. Midterm
topics join when their turn comes: the scope is one filter in `finalPool`.
