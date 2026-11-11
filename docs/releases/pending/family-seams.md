```js
{ kind: 'feature', scope: 'multi', title: 'ไปมาระหว่างเว็บ VetMock ได้จากทุกหน้า', desc: 'VetMock, VetMock VCA, VetMock AI และ VetMock Research มีปุ่มไปหากันที่หัวเว็บและท้ายเว็บ ใช้ชื่อเดียวกันทุกที่ ธีมที่เลือกตามไปด้วย และเข้าสู่ระบบแล้วกลับมาที่หัวข้อเดิม' }
```

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

VCA no longer says it needs no account: the manifest, About's privacy section, the progress page
and the sign-in sheet now say it is used with a Chula Google account and that answers stay in this
browser, not in the account. The cover prints `vca.vetmock.com/u/<handle>` with the host in one
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
rule), `ai/tests/unit/family-seams.test.mjs`, `vca/tests/unit/family-seams.test.mjs`.
Unproven: a real redirect sign-in on any site (needs a Chula account; the Google button's own flow
never leaves the page and was always fine).

## 5. Links that land on the thing

VetMock AI's source cards already link a VetWiki section to its public page
(`/wiki/<subject>/<topic>#<section>`, `api/_lib/ai/retrieve.js`) and the rest to the app's own
address; with 4 the section now survives a redirect sign-in. No change there.
VCA library "open" still lands on a title search: the main library's stable address is
`/app/pdf-annotate?doc=<slug>`, but the VCA catalogue does not know each document's library slug
(the slugs in `src/data/vca-materials.js` are R2 archive backups, not library rows) and the mapping
could not be checked without the database. Next step: export `slug` per VCA title from
`library_docs` into the bank build, then link `readerUrl(slug)`.

## 6. Theme and language across a crossing

A followed family link carries `?vmt=light|dark` (and `?vml=th|en` only to a site with a language
switch: the main landing and Research). Each site's boot (main `index.html`, `vca/public/theme-boot.js`,
`ai/public/theme-boot.js`, `research/src/main.jsx`) writes it once to its own key before the first
paint and removes it from the address. Unknown values are dropped. The feature-registry dispatchers
add the theme to family links only.
Test: `tests/unit/family.test.mjs`, `tests/e2e/family-links.spec.js` (arrival and a followed link).
Seen: `/?vmt=dark&vml=th` on the local dev server paints dark and the address is left clean.

## 7. A VCA question has an address

`/d/<domain>/<no>` (the number the bank prints as "No."), a client page only, so nothing is added to
the prerender or the sitemap (`/q/` is taken by question images). It shows the question as the
community threads do (`QuestionPeek`, moved to `components/` with its styles) with "เปิดข้อนี้ใน
VetMock", the app's own shared-question link (`?qset=`, built by `src/lib/share-link.js`). The bank's
"No." is now that link. Nothing inside a question, a set or an exam changed.
Test: `vca/tests/unit/family-seams.test.mjs`. Unproven: the page was not seen (the VCA wall needs an
account).

## One sign-in for the family

Designed, not built: `docs/FAMILY-SIGNIN.md` (recommended: a one-time handoff in the URL fragment,
started by the site that lacks a session, each site keeping its own session).
