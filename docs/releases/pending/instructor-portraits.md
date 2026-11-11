```js
{ kind: 'feature', scope: 'system', title: 'ทำเนียบอาจารย์มีรูปอาจารย์แล้ว', desc: 'การ์ดและโปรไฟล์อาจารย์ 122 ท่านแสดงรูปประจำตัวจากหน้ารายชื่อบุคลากรของภาควิชาและศูนย์สัตว์ทดลอง จุฬาฯ เห็นได้เมื่อเข้าสู่ระบบด้วยบัญชีจุฬาฯ ท่านที่ยังไม่มีรูปแสดงอักษรย่อของชื่อแทน' },
```

# Instructor portraits on the faculty screen and in a profile

Asked for: complete the instructor profiles with each lecturer's portrait. The portraits are the
institutions' official staff portraits, shown to signed-in members, with permission recorded by the
owner on 11 Nov 2026.

## What changed

- A profile in `src/data/instructors-directory.js` may carry `photo: { w, h, v }`: pixel size (a
  square, 320 px or the source's own size when smaller) and the first 8 hex of the file's SHA-256.
  Nothing else about the picture is in the app.
- `scripts/instructor-portraits.mjs` holds one line per portrait: slug, size, hash, the staff page,
  the image's address on that page and the date fetched. `--write` applies the list to the
  directory; `scripts/generate-instructor-directory.mjs` applies it too, so a regeneration keeps it.
  `npm run lint:instructor-portraits` (in `lint:data`) checks the `photo` shape, that every `photo`
  has a line and every line a `photo`, and that each source is a department staff page of
  vet.chula.ac.th or the CULAC staff page.
- `InstructorPortrait.jsx` draws a 48 px box on each faculty card and a 72 px box in the profile:
  the portrait (`loading="lazy"`, `decoding="async"`, alt text the person's name) or the initials of
  the name in the app's own colours. The box is the same size either way, so nothing moves when a
  picture arrives. Nothing else on those screens changed.

## Sources and the pairing rule

- The twelve department pages on vet.chula.ac.th (the addresses `npm run audit:instructors` reads,
  English and Thai, 24 pages) and https://culac.chula.ac.th/about/staff. GETs only, one at a time
  with a pause between requests.
- A portrait was taken only when it is the picture of a staff card (`grid-item list-profile`, its
  `grid-image` box) whose name, titles trimmed, equals one profile's `nameEn`, `nameTh` or an alias
  exactly. The English and Thai pages print the same cards in the same order (all 201 card
  positions carry the same image and email on both), so a card position is one person: a Thai name
  that matches makes the card that person's even when the English spelling differs.
- Rejected: an image used by cards of different people, an address that reads as a logo or a
  placeholder, anything under 120 px, a card naming two profiles, a person with two different
  pictures. Then every accepted portrait was looked at on a contact sheet.
- The picture: one square from the centre-top of the source, 320 px WebP (smaller sources kept at
  their own size, never enlarged), no other change. 6.8 to 16 KB each.

## Counts

| | |
|---|---|
| Staff cards read | 403 (402 department, 1 CULAC), 201 department card positions |
| Cards paired with a profile | 242 cards, 123 profiles |
| Rejected on the contact sheet | 1: `namphung-suemanotham` (a second person is in the picture) |
| Portraits shown | 122: 121 from department pages, 1 from CULAC (`tussapon-boonyarattanasoonthorn`) |
| Under 320 px (source smaller) | `kongkiat-srisuwattanaskul` 260, `krichaporn-kradanggha` 296, `anudep-rungsipipat` 300, `theerayuth-kaewamatawong` 300 |
| Cards not paired: name matches no profile | 156, nearly all support staff; also `Nitira Anakkul` (no profile) |
| Cards not paired: shared image | 4 (English and Thai) for `pornchalit-assavacheep` and `thanasak-boonserm`, whose cards show the faculty logo, as two staff cards do; the one placeholder rejected |
| Cards not paired: no name | 1 (an English card whose Thai twin names `saranporn-poothong`) |

Department roster profiles left without a portrait: `pornchalit-assavacheep`, `thanasak-boonserm`
(the card shows the faculty logo), `namphung-suemanotham` (see above), and `chollada-buranakarl`,
`sirirat-wataradee`, `thanicha-chanchaidechachai` (no card on the current pages). Profiles outside
the faculty: only `noppawan-buamithup` links an official page of her own institution
(dld.go.th), which refuses automated requests, so it was not read. The Kasetsart and Mahidol
profiles link no staff page and have no portrait.

## Where the files are and who can fetch them

- R2 bucket `vetmock-evidence`, `e/<folder>/people/<slug>.webp`, beside the answer slides; 122
  objects, 1,272,050 bytes, each answered 200 at its address after upload.
- `<folder>` is the evidence grant (docs/ANSWER-EVIDENCE.md): never in the repository;
  `/api/evidence-pass` gives the base to Chula members only, and the browser loads
  `<base>/people/<slug>.webp?v=<v>`. A visitor the wall does not serve gets no base and sees initials.
- The 320 px files are also kept outside the repository in `ROOT/people` (the evidence data
  folder), so `node scripts/instructor-portraits.mjs upload` can send them again after the folder
  is rotated. No image file is in this repository.

## To remove a portrait

Delete the person's line in `scripts/instructor-portraits.mjs`, run
`node scripts/instructor-portraits.mjs --write` (the profile shows initials), then delete the
object `e/<folder>/people/<slug>.webp` from the bucket and its file from `ROOT/people`.

## Not checked

- That each picture is current: the pages' own pictures were taken as they are on 11 Nov 2026.
- Faces were not compared with anything; pairing is by the page's structure and the name only.
- The production build was not loaded against the real bucket in a signed-in browser; the e2e spec
  stubs the base address.
