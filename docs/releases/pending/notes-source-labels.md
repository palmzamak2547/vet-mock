# Notes source lines read as words

Student line (Thai):

ใต้แต่ละส่วนในสรุป บรรทัด "แหล่งที่มา" บอกชื่อคลิปพร้อมวันที่ และชื่อเอกสารที่อ่านออก แทนรหัสคลิปกับชื่อไฟล์ดิบ

## Reviewer notes

- Rendering only. No notes data file and no stored `source` changes; `NotesView` draws each section's source through `noteSourceLabel` in `src/lib/source-label.js`.
- Rules, in order: (1) a bracketed recording pointer becomes the label `sessionLabel` already gives elsewhere, with the minute ranges kept; the leading word "คลิป" is consumed with the id, so it is no longer printed twice. (2) A file name claimed by a document in `src/data/source-docs.js` shows that document's registered title, page reference kept. (3) Any other file-style name (`.pdf`, `.pptx`, `.docx`, or an underscored stem such as `Role_of_Vet_in_One_Health_2026`) loses the extension and shows underscores as spaces. Everything else is returned character for character.
- `humanSource` and `recordingMoments` share the same recording pattern, so the doubled "คลิป คลิป" is also gone from question source chips and the moment links.
- `noteSourceLabel(raw, titleFor)` takes the registry lookup from its caller. `source-docs.js` is 78 KB and uses regex lookbehind (not shipped, iOS 14), so `scripts/regen-note-source-titles.mjs` asks it once per file name the notes use and writes `src/data/note-source-titles.generated.js` (currently one name); a unit test fails when that file is stale, and `regen:all` runs it.
- The VetWiki article page does not print `section.source`; it draws numbered source chips from `lib/vetwiki/cite.js`, so no second call site needed the change.
- Proof: `tests/unit/notes-source-label.test.mjs` (each rule, the doubled prefix, several parts in one line, unchanged hand-written lines, and a guard that the reader calls the function). The list of every distinct line whose rendering changes, before and after, is generated from the real data in `C:/dev/vetmock-notes-work/source-labels/BEFORE-AFTER.md`.
