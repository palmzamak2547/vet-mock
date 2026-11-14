# Pending: Equine Medicine notes for the final (paper 24 Nov 2026)

## Changelog line (Thai, for the wave's release)

โน้ต Equine Medicine and Surgery เขียนใหม่ทั้งหมด 15 หัวข้อจากเด็คปีนี้ และเพิ่มหัวข้อ Equine dermatology กับ Concept of equine surgery and wound management ทุกหัวข้อมีแหล่งอ้างอิงใน VetWiki และจุดที่เด็คสองชุดให้ตัวเลขไม่ตรงกันมีป้ายเตือนบอกไว้

## For the reviewer

- **Notes.** 17 drafts from this year's decks and class recordings, each read line by line by a second reader
  against the page (17 sheets, 2,726 lines). 135 non-ok rows settled: 105 fixes, 19 additions, 7 cuts, 3 unclear
  rows decided, 1 addition not applied (the colic section it belonged to moved to the colic topic). Log with
  before, after and why: `C:/dev/vetmock-notes-work/equine-medicine/review/decisions.md`.
- **Replaced** 15 y5 entries that were placeholders from a year ago (integrate-notes found a `รอเติม` in each);
  **added** equine-surgery-wound and equine-derm; **removed** the y5 equine-ortho entry (no 2569 session, no deck of
  this year; notes-85 keeps last year's). equine-exercise and equine-poa are untouched (taught 19 and 16 Nov).
- **Colic in one topic.** equine-colic-bestfit carries all colic material; equine-gi keeps anatomy, the examination
  (gut sound sites, FLASH ultrasound, radiography, rectal), choke and EGUS, with one line pointing to the colic
  topic. Eight facts found only in equine-gi moved to colic-bestfit before its six colic sections were cut.
- **Conflicts kept visible as flags naming both pages:** local anaesthetic onset and duration (anesthesia,
  lameness), NSAID doses (anesthesia, colic-bestfit), imidocarb (infectious, parasites), foal vaccine ages
  (infectious, neonatal), rabies yearly booster against risk group (infectious), ileum 50 m on GI I p.10 against
  about 1 m in the BHS digestive-system page.
- **Claims.** 163 sections needed one: 150 claims checked by refetching each quote (143 by script, 1 in a PDF,
  6 read by hand: 2 AAEP pages that refuse the script, 4 registered PubMed abstracts) and 13 exemptions with
  reasons. 94 new sources (44 PubMed, 50 pages). Removed with the old stubs: 44 claim keys in
  verification-generated.js and 19 exemptions in non-verifiable.js that pointed at sections no longer there.
  The y5 "Sinusitis" heading became "Sinusitis ในม้า" (it collided with the Vet 85 section of the same name).
  The works pin in vetwiki-sources-work.test.mjs moves 2,154 to 2,166 (net).
- **Gates run on this branch:** npm run lint:data (whole chain, pass; wiki coverage 1,834 of 1,834 backed, 163
  exempt); node --test of notes-copy, vetwiki, vetwiki-runtime, vetwiki-registry, vetwiki-sources-work, note-corpus
  and data-chunk-rules (40 of 40). Not run here, left to the wave fold: full unit suite, build, lint:dist,
  perf:budget, the walk.
