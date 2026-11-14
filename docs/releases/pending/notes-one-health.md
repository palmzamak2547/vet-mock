# One Health final notes (pending, folded into the next wave release)

## Changelog line (Thai, for the student)

สรุปสุขภาพหนึ่งเดียวเพิ่มอีกห้าหัวข้อของปลายภาค ได้แก่ การประเมินความเสี่ยงการนำเข้า ความเสี่ยงต่อสุขภาพจากสิ่งแวดล้อมทั้งสองคาบ GMO ในอาหารคนและอาหารสัตว์ และการจัดการของเสียจากฟาร์มปศุสัตว์ ทุกหัวข้อเปิดอ่านใน VetWiki ได้พร้อมแหล่งอ้างอิง

## For the reviewer

What changed:

- `src/data/notes-y5-one-health.js`: five new topics spliced in (no existing line changed): `oh-env-carcinogen` 8 sections,
  `oh-env-mutagen` 7, `oh-gmo` 7, `oh-livestock-waste` 8, `oh-import-risk` 8; 38 sections, 238 body items, 0 flags.
  No placeholder replaced.
- `src/lib/vetwiki/verification-one-health.js` (new overlay, merged in `verification.js`), 23 new works appended to
  `sources.js` (14 PubMed, 9 pages); `tests/unit/vetwiki-sources-work.test.mjs` pin 2,154 to 2,177 for them.
- Regenerated: notes registry, wiki topic registry and keys, runtime and search data for One Health, citation
  index, shelf, README and `docs/content-inventory.md` counts. `bank-registry.generated.js` and `q-counts.js` changed
  only in their build timestamp and were left out.

What was checked:

- Second reader: five sheets, 654 draft lines, every line with a verdict (`lines.mjs --check` passes all five); 56
  non-ok rows (49 fix, 6 add, 1 cut, 0 unclear) settled by the integrator, the ones resting on a picture checked on
  19 page images (env I p.6, 7, 9;
  GMOs p.5, 9, 11, 14; import risk p.11, 20, 21, 31, 43, 45, 46; livestock waste 2569 p.29, 39, 45, 49, 51), logged
  with before, after and why in the work folder's `review/decisions.md`. Four places differ from the reader's
  wording (listed there).
- Points of substance: the ammonia line gives the right reason (no carbon, so inorganic), not the class's "no carbon
  and no hydrogen"; PM10 is stated as including PM2.5 (EPA); the import-risk "take the highest value" rule stays as
  the recording's rule; the p.46 flag is a tip with the recomputed options 3, 4 and 8; livestock-waste sources name
  2569 pages only and the p.51 anaerobic digestion diagram is in. No line says what a paper will ask.
- `check-note.mjs`: 5 of 5 pass, no warnings. `after-integration.mjs`: no Thai digit in the notes or the claims.
- Claims: 38 of 38 sections carry one checked claim, 0 exempt, 0 left (21 PubMed, 17 pages). Recheck: 26 by
  script, 7 in PDFs, 5 read by hand in the Internet Archive copy of the Australian prawn import risk analysis (the
  department's server returned nothing in 10 minutes), quotes found on its pages 40-41, 43, 112, 119, 183.
- Gates run in the worktree: see the integrator's report (lint:data chain and the notes and wiki unit suites). Left
  for the wave fold: full unit suite, production build, `lint:dist`, `perf:budget` (the wiki topic registry grows
  by 38 sections), and the walk.
