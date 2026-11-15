```js
{ kind: 'feature', scope: 'multi', title: 'ไปมาระหว่างเว็บ VetMock ได้จากทุกหน้า', desc: 'VetMock, VetMock VCA, VetMock AI และ VetMock Research มีปุ่มไปหากันที่หัวเว็บและท้ายเว็บ ใช้ชื่อเดียวกันทุกที่ ธีมที่เลือกตามไปด้วย และเข้าสู่ระบบแล้วกลับมาที่หัวข้อเดิม' }
```

## Checks run (11 Nov)

- Builds of all four apps, root `lint:dist` and `perf:budget` (9 routes within budget): passed.
- Root `lint:data`: passed. Root `test:unit`: 4,149 tests, 0 failures (after the three fixes in 1dc9bc67).
- VCA unit 369/369, VetMock AI unit 89/89; Research unit passes after the unused-key fix (fadb8f10). Its
  20,000-column preview test took 61 s against its 10 s limit while two builds shared the machine and
  1.8 s run alone.
- `tests/e2e/family-links.spec.js`: local pre-check on chromium-mobile and webkit-mobile (CI runs all four).
  The first full run's Firefox failures were page-load timeouts under machine load: unproven, not regressions.

# Family seams (pending release)

Branch `claude/family-seams`. No version number yet: the main session takes one when it folds this
branch into a wave (`npm run release:new`).

**Vercel projects this branch changes:** the main project (vetmock.com), `vetmock-vca`
(vca.vetmock.com), `vetmock-ai` (ai.vetmock.com) and the Research project (research.vetmock.com).
All three sibling projects now import `src/lib/family/` from the main tree; their ignore steps
(`vca/scripts/vercel-ignore.sh`, `ai/scripts/vercel-ignore.sh`, `research/vercel.json`) and the
VCA and AI workflows watch that folder (VCA also `src/lib/share-link.js` and
`src/lib/custom-question-ids.js`), so a change to the list rebuilds every site that shows it.

## 1. A door to the family from the main app

One list, `src/lib/family/family.js` (`FAMILY`): id, name, a Thai and an English sentence, address.
The main app shows it in the feature registry (new entries `vca-site` in practice and `ai-tutor` in
tools, so the learn group keeps the owner's seven home tiles; `research-studio` now takes its name and sentence from the list), so the home grid, the
command palette and the tools menus get them from one place; in a "VetMock ทั้งหมด" section on the
landing before the final call; in the landing footer; and in the in-app footer.
Test: `tests/unit/family.test.mjs` (every member is a registry entry with the list's own name and
sentence; every surface renders the shared component and holds no copied sibling address);
`tests/e2e/family-links.spec.js` (each other site on the landing section and footer).
Unproven: the in-app footer and the home grid were not seen rendered (behind the wall locally).

## 2. A way back on each sub-app

`FamilyMenu` (a native disclosure in the header: tap, Enter or Space; Escape and a tap outside
close it) on VCA's top bar, VetMock AI's header (also on its wall) and Research's landing, public
and workspace headers; `FamilyLinks` in each footer and Research's phone menu. Markup is shared;
each site styles the `vm-family` classes with its own tokens. VetMock AI's header breakpoints moved
by one button (the preview tag now shortens below 522 px and hides below 442 px).
Test: `tests/unit/family.test.mjs` (the surface list). Unproven: the sub-app headers were not seen
in a browser at 320 to 390 px; VCA's wall itself has no menu (the wall is the whole page).

## 3. Words that are true

VCA no longer says it needs no account. After review: About, the progress page and the sign-in sheet
say single answers and results stay in this browser and the totals a student chooses to show on
their profile ("โชว์สถิติการฝึกบนโปรไฟล์", `ProfileSheet.jsx`) are saved to the account; nothing claims
the account depends on the wall (its switch can turn off): the manifest names no account, About says
the account confirms a Chula student "when the site is open to Chula students only". The cover prints `vca.vetmock.com/u/<handle>` with the host in one
weight, so it no longer reads as `vetmock.com/u/...` (which is 404).
Test: `vca/tests/unit/family-seams.test.mjs`. Unproven: the cover was not redrawn and looked at.

## 4. Arrive where you were going

`src/lib/family/return-path.js`: a destination is kept in the tab's sessionStorage for 15 minutes
and accepted only as a same-origin relative path that passes an allow pattern, also after one
decode. vetmock.com keeps it before the Google redirect and puts back only the `#section` once the
SDK has taken its tokens out of the address (`restoreSignInDestination`, called in `useAuth`);
VetMock AI keeps the path, query and hash and puts them back after its code exchange; VCA's
existing return (`account.js`) now keeps the hash and uses the same check, which closes `/\host`
(the old check passed it). Nothing in how a site signs in or out changed: the redirect addresses,
storage keys and the wall are as they were.
Test: `tests/unit/family-return-path.test.mjs` (`//evil.example`, `/\evil.example`, `%2F%2F`,
`%5C`, credentials, CR/LF, malformed escapes, stale and future entries, blocked storage, the hash
rule), `ai/tests/unit/family-seams.test.mjs`, `vca/tests/unit/family-seams.test.mjs`. After review the
check runs again on the cleaned result, which must pass unchanged (`/./%2f/evil` resolved to
`/%2f/evil`, which reads `//evil` once decoded), and a decoded path may hold no empty or dot
segment; both review strings are in the test.
Unproven: a real redirect sign-in on any site (needs a Chula account; the Google button's own flow
never leaves the page and was always fine).

## 5. Links that land on the thing

VetMock AI's source cards already link a VetWiki section to its public page
(`/wiki/<subject>/<topic>#<section>`, `api/_lib/ai/retrieve.js`) and the rest to the app's own
address; with 4 the section now survives a redirect sign-in. No change there.
VCA library "open" still lands on a title search (`vca/src/pages/Library.jsx:17`). Left out of this
branch on purpose; it is its own small piece:

- **What is missing:** for each document on the VCA shelf, the `slug` of the matching row in
  `public.library_docs`. The main app's stable address for a document is
  `https://vetmock.com/app/pdf-annotate?doc=<slug>` (`readerUrl` in `src/lib/view-route.js`). The
  slugs already in `src/data/vca-materials.js` (`vca-archive-<sha16>`) are R2 archive backups, not
  library rows.
- **The join key that exists:** every VCA file in `src/data/vca-materials.js` carries `sha256`;
  every library row carries `sha256_16` (the first 16 hex of the file's SHA-256,
  `supabase/migrations/20260827000000_library_docs_init.sql`). So `sha256.slice(0, 16)` =
  `library_docs.sha256_16` (status published, subject `vca`) gives the slug, with `source_url`
  (the Drive address both keep) as a cross-check.
- **Where it comes from:** a read with the scripts' library reader (`scripts/lib/library-read.mjs`,
  Management API, never the anon key), written once to a committed map
  (`src/data/vca-library-slugs.js`: `{ [sha256_16]: slug }`), regenerated when VCA material is added.
- **Then:** `vca/scripts/build-bank.mjs` adds `slug` to each shelf entry (the PDF's, else the first
  file's), and `Library.jsx` links `readerUrl(slug)` on vetmock.com, keeping the title search only for
  an entry with no slug. A unit test: every published VCA library row is reached by one shelf entry.

## 6. Theme and language across a crossing

A followed family link carries `?vmt=light|dark` (and `?vml=th|en` only to a site with a language
switch: the main landing and Research). Each site's boot (main `index.html`, `vca/public/theme-boot.js`,
`ai/public/theme-boot.js`, `research/src/main.jsx`) reads it before the first paint and removes it
from the address. After review a value that arrives in an address applies to this visit only
(sessionStorage `vmx-family-visit`), never to the saved choice, so neither a crossing nor any
outside link (`vetmock.com/?vml=en`) changes a student's setting for good; the student's own pick on
the site replaces it (`dropVisit`). A student who follows the system theme sends none: each site
marks a chosen or visiting theme on `<html data-theme-chosen>` and only that travels. Unknown values
are dropped.
Test: `tests/unit/family.test.mjs` (visit store, chosen theme, and that no boot writes a saved key
from an address), `tests/e2e/family-links.spec.js` (arrival for the visit only, a chosen theme travels,
a system theme does not).
Seen: `/?vmt=dark&vml=th` on the local dev server paints dark and the address is left clean.

## 7. A VCA question has an address

`/d/<domain>/<no>` (the number the bank prints as "No."), a client page only, so nothing is added to
the prerender or the sitemap (`/q/` is taken by question images). It shows the question as the
community threads do (`QuestionPeek`, moved to `components/` with its styles) with "เปิดข้อนี้ใน
VetMock", the app's own shared-question link (`?qset=`, built by `src/lib/share-link.js`). The bank's
"No." is now that link. Nothing inside a question, a set or an exam changed. After review: a load
that fails says "เปิดข้อนี้ไม่ได้ ตอนนี้อาจไม่ได้ต่อเน็ต" with "ลองอีกครั้ง" instead of calling the
question withdrawn, and the bank build stops if two subjects share a number within one domain
(`assertUniqueNumbers`, `vca/scripts/bank-shards.mjs`), since the page finds a question by number.
Test: `vca/tests/unit/family-seams.test.mjs`. Unproven: the page was not seen (the VCA wall needs an
account).

## Known limits

- Research has no CI workflow: a change under `src/lib/family` reaches the Research project's Vercel
  build untested by CI (its ignore step now rebuilds on it). A failed build keeps the previous
  deployment, so the risk is a stale Research, not a broken one; run `npm --prefix research test`
  and `npm --prefix research run build` by hand for any change to the folder.
- The registry's Research address (`RESEARCH_STUDIO_URL`) now comes from the family list too.

## Every cross-site link, as it is followed (to check on production)

`<t>` is the theme the student chose or arrived with (`light` or `dark`); a student following the
system theme sends no `vmt`. `<l>` is the language (`th` or `en`).
The `href` in the page is the plain address (`https://<host>/`); the parameters are added at the tap.
On arrival each site removes them, so the address bar ends on the plain address.

| From | Where | Address followed |
|---|---|---|
| vetmock.com | home grid, command palette, tools menus (registry `vca-site`, `ai-tutor`, `research-studio`) | `https://vca.vetmock.com/?vmt=<t>`, `https://ai.vetmock.com/?vmt=<t>`, `https://research.vetmock.com/?vmt=<t>` |
| vetmock.com | landing "VetMock ทั้งหมด" section and landing footer | `https://vca.vetmock.com/?vmt=<t>`, `https://ai.vetmock.com/?vmt=<t>`, `https://research.vetmock.com/?vmt=<t>&vml=<l>` |
| vetmock.com | in-app footer, column "VetMock ทั้งหมด" | `https://vca.vetmock.com/?vmt=<t>`, `https://ai.vetmock.com/?vmt=<t>`, `https://research.vetmock.com/?vmt=<t>` |
| vca.vetmock.com | top bar menu (grid button) and footer column VetMock | `https://vetmock.com/?vmt=<t>`, `https://ai.vetmock.com/?vmt=<t>`, `https://research.vetmock.com/?vmt=<t>` |
| vca.vetmock.com | question page `/d/<domain>/<no>`, "เปิดข้อนี้ใน VetMock" | `https://vetmock.com/?qset=<base64url of [{"s":<subject>,"i":<id>}]>` |
| vca.vetmock.com | bank row "No. <n>" (same site) | `/d/<domain>/<n>` |
| ai.vetmock.com | header menu (also on the wall) and footer | `https://vetmock.com/?vmt=<t>`, `https://vca.vetmock.com/?vmt=<t>`, `https://research.vetmock.com/?vmt=<t>` |
| research.vetmock.com | landing header menu, phone menu, public pages' header, workspace top bar, landing footer | `https://vetmock.com/?vmt=<t>&vml=<l>`, `https://vca.vetmock.com/?vmt=<t>`, `https://ai.vetmock.com/?vmt=<t>` |

Unchanged and still live: VCA footer "ส่งความเห็น" `https://vetmock.com/app/feedback`, VCA About
`https://vetmock.com/app/feedback` and `/app/contribute`, VCA library "open"
`https://vetmock.com/app/library?subject=vca&q=<title>`, VetMock AI footer VetWiki
`https://vetmock.com/wiki`, VetMock AI source cards (`/wiki/<subject>/<topic>#<section>`,
`/?qset=`, `/app/videos?v=&at=`, `/app/library?subject=`), Research footer privacy and feedback.

## One sign-in for the family

Designed, not built: `docs/FAMILY-SIGNIN.md` (recommended: a one-time handoff in the URL fragment,
started by the site that lacks a session, each site keeping its own session).
