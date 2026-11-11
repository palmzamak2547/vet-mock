# Screen leftovers (six small fixes)

```js
{ kind: 'fix', scope: 'system', title: 'ช่องค้นหาขึ้นทันทีที่แตะ', desc: 'แตะค้นหาหรือกด Ctrl+K แล้วช่องพิมพ์ขึ้นทันที พิมพ์รอได้ระหว่างที่โหลด คำที่พิมพ์ไว้ไม่หาย และถ้าโหลดไม่สำเร็จจะบอกพร้อมปุ่มลองอีกครั้ง' },
{ kind: 'fix', scope: 'system', title: 'ลิงก์ VetWiki ของวิชาเปิดที่วิชานั้น', desc: 'ลิงก์อย่าง /wiki/com5 เปิดสารบัญ VetWiki ตรงวิชานั้นและเก็บที่อยู่ไว้ ไม่เด้งกลับสารบัญหน้าแรก' },
{ kind: 'fix', scope: 'system', title: 'ค้นชื่ออาจารย์สะกดต่างได้', desc: 'พิมพ์ชื่อสะกดต่างจากในรายชื่อ เช่น อนุวัฒน์ กับ อนุวัตน์ ก็ยังเจอ โดยบอกว่าแสดงชื่อที่สะกดใกล้เคียง ชื่อที่สะกดตรงยังขึ้นก่อนเสมอ' },
{ kind: 'fix', scope: 'system', title: 'ตัวนับการอ่านบอกว่านับอะไร', desc: 'หน้าเลือกหัวข้อบอกว่าอ่านแล้วกี่หัวข้อจากหัวข้อในแผนการสอนทั้งหมด ซึ่งรวมหัวข้อที่ยังไม่มีเนื้อหาด้วย จึงอาจมากกว่าการ์ดที่เห็น' },
{ kind: 'fix', scope: 'system', title: 'เปิดเอกสารจากช่องค้นหาไม่หายเงียบ', desc: 'ถ้าเปิดเอกสารไม่สำเร็จ จะบอกและให้ลองอีกครั้ง หรือไปที่ชั้นเอกสารที่ค้นชื่อเอกสารนั้นไว้ให้แตะเปิด' },
{ kind: 'fix', scope: 'system', title: 'แอปไม่ว่างเปล่าเพราะค่าที่บันทึกในเครื่อง', desc: 'ค่าตั้งที่บันทึกในเครื่องแบบว่างเปล่าไม่ทำให้แอปเปิดเป็นหน้าว่างอีกแล้ว แอปจะใช้ค่าเริ่มต้นแทน' },
```

## Notes (English)

Branch `claude/screen-leftovers`, from main at ef993a0e. Before = the production build of main served on 127.0.0.1:4331; after = this branch's build served by `vite preview` on 4342. Scripts are in the lane's scratchpad (`palcold.mjs`, `nullstore.mjs`, `keysweep.mjs`).

### 1. The search palette shows its box at once
- Before: a tap or Ctrl+K showed nothing until the palette's lazy chunk arrived. CPU 4x, cache disabled, phone viewport, /app/about: the dialog appeared 3.9 to 8.8 s after Ctrl+K over five runs, and "ketamine" typed straight after the key left the box empty (""). The palette's chunk graph is about 790 KB raw (CommandPalette 78 KB, video meta 224 KB, wiki registry 115 KB, instructor index 111 KB, schedule 35 KB, library and drug data) and was queued behind the year-5 question banks the app starts loading at boot (86 to 93 requests, 1.4 to 1.7 MB raw while the palette waited, main-thread long tasks up to 0.9 s while they parse). Keys typed in that time went nowhere.
- Why the banks: App.jsx's bank effect (`banksToEnsure`, about line 646) calls `loadQBForYear(selectedYear)` on the first commit whenever a year is stored, on every screen (also /app/about): 70 year-5 bank chunks plus 4 cross-year ones. Home reads QB for the review due count, the practice pool size, the weak-subject list and the quick random question, and each of those already recomputes when QB grows (`QB.length` in their deps), so starting the load when the first screen is idle would show Home the same values, later by that idle delay; other screens do not need it. Not changed here (another lane is listing it).
- Fix: `PaletteFrame` (entry chunk) is the Suspense fallback: the same shell, its box focused in the tap's commit, a status line "กำลังเปิดการค้นหา พิมพ์รอไว้ได้เลย". What is typed waits in `palette-handoff.js`; CommandPalette takes it as its first query, focuses its own box in a layout effect with the caret at the end, and returns focus where the frame found it. A failed chunk no longer closes with an alert: the frame says "เปิดการค้นหาไม่สำเร็จ ตรวจการเชื่อมต่อแล้วลองอีกครั้ง" with ลองอีกครั้ง (a fresh `lazy()` through `importFresh`, `lazyWithRetry` in lazy-views.js) and ปิด. What is not needed for first paint is now nothing: the frame needs no download. The search data itself was not split out of the palette's chunk: 17 palette unit tests render it synchronously with stubbed data, and the frame already takes the wait off the screen.
- After: not yet measured on the build (runs as one browser job after the push; the numbers go to the main session and into this file).
- Other OptionalFeature users: the palette (fixed), the lecturer profile (already had OverlayPending), the sketch pad, voice settings, the shortcut list, the tour and the wiki's topic card (all opened by a tap; now OverlayPending: the loading bar and a screen-reader status), and the background ones that need no pending state (Analytics, HighlightToCard, MochiVoice, the loader's MotionLoader).
- Guard: `tests/e2e/palette-frame.spec.js` (the chunk held 3 s: frame within 1.5 s, box focused, typed text kept through the swap and searched; Escape closes the frame and the next open starts empty); `optional-feature-failure.spec.js` first case rewritten (failed chunk: the frame says so, the page draft kept, retry opens the palette with the typed text; WebKit checks the message only, as its failed import names no URL to fetch again); `boot-weight.test.mjs` reads `lazyWithRetry` declarations and requires the palette among them.

### 2. /wiki/<subject>
- Before: /wiki/com5 rendered the plain index and rewrote the address to /wiki (crawl rows, path "/wiki").
- Fix: `wikiEntry(pathname, topics)` in `src/lib/vetwiki/url.js`; KnowledgeView seeds the index focus (the subject open, in list form, scrolled into view) from a subject address and keeps the address. An unknown subject falls back to /wiki.
- After: not yet walked on the build (same job); the unit test and `wiki-subject-address.spec.js` cover it, the spec not yet run.
- Guard: `tests/unit/wiki-subject-address.test.mjs` (every wiki subject id, with and without a trailing slash and encoded; every topic id still an article; unknown subject, unknown topic, bare index); `tests/e2e/wiki-subject-address.spec.js`.

### 3. Thai spelling in the faculty search
- Before: "อนุวัฒน์" found nobody (flows3.txt: cards=0); "anuwat" found the record spelled "อนุวัตน์".
- Fix: `src/lib/thai-name-fold.js`, a second pass only when the exact pass finds nobody: tone marks dropped, a silent letter (consonant under ์, with its ิ/ุ) dropped, a final consonant folded to its sound class (กก กด กบ กน), titles split at their dots, matched from the start of a word. The count line adds "ไม่มีชื่อที่สะกดตรงกัน จึงแสดงชื่อที่สะกดใกล้เคียง". No dependency.
- After: "อนุวัฒน์" finds exactly อนุวัตน์ วิรัชสุดากุล. All 310 names find themselves by the exact pass. 22 common misspellings (final ฒ/ต/ศ/ษ/ส, ณ/น, silent letters, missing tone marks) each find their record and nobody else. Extra hits of the folded key over what the exact text finds: 0 across the 310 full names, 14 across the 310 first names (only if the loose pass always ran; it runs only when the exact pass finds nobody, so in the app a name typed correctly gets 0 extra).
- Guard: `tests/unit/thai-name-fold.test.mjs`.

### 4. Reading counter against cards
- Finding: not a wrong number. The counter is the reading list: every topic of the syllabus on the chosen paper (`topics.length`). The cards leave out topics with no questions, notes or wiki (`hasTopicContent`), which sit behind "แสดงหัวข้อที่ยังไม่มีเนื้อหา (N หัวข้อ)". Year 5 today: epidemiology 24 / 19 cards, One Health 15 / 13, aquatic 15 / 14, POA 13 / 6, equine 26 / 25, swine 14 / 13, RAVB 14 / 3, ruminant 8 / 5; the rest agree.
- Fix: the counter reads "อ่านแล้ว X/Y หัวข้อในแผนการสอน" (aria-label too), the disclosure's own words.
- Guard: `tests/unit/topic-reading-counter.test.mjs` (every Year-5 subject: cards plus hidden topics equal the counter; the label and the card rule pinned in the view).

### 5. An external document picked in the palette
- Before (read from the code, reproduced in the unit harness with `window.open` returning null): a failed link lookup ran `goView('library')` with no message; with a popup blocker no tab opened either. A browser reproduction needs catalogue rows from Supabase, which the hunt's stubs block.
- Fix: `openDocOrOffer` in `src/lib/library.js`. A blocked tab with a link still opens the file here (as before). A failed lookup asks "เปิดเอกสารไม่สำเร็จ" with ลองอีกครั้ง (the retry runs inside that dialog's tap, so a tab may open) or ไปที่ชั้นเอกสาร (the shelf with the document's title searched, its card there to tap).
- Guard: `tests/unit/library-doc-open.test.mjs` (blocked tab + link: file opens; blocked tab + failed lookup + decline: the shelf searched for it, nothing navigates by itself; failed once + retry: opened, no shelf), and the palette pinned to use only this path.

### 6. storage.get and a stored null
- Before: `storage.get` returned a stored JSON null as null; a missing key and corrupt JSON already gave the default. With `vmx-consent-prefs` = "null" and consent "custom" the app read `consentPrefs.analytics` at boot: blank page, page error (4331, nullstore.mjs).
- How a device gets that value: no current code writes it. Both writers of vmx-consent-prefs guard with `if (prefs)`, since the key was added (d74e6921); the synced fields go through `dataFromSyncRow`, which refuses null, and the origin move copies only synced fields and snapshots. So it comes from outside the app's own writes (a hand edit, an extension, a tool that clears values to null). `useLocalStorage` itself can write "undefined" (JSON.stringify(undefined)) if a setter is given undefined; that reads back as corrupt, so as the default.
- Fix: the hook reads a stored null as the default. No caller with a non-null default stores null on purpose (checked by the test).
- After: not yet run on the build (same job); the unit test covers the hook.
- Sweep (each stored key the code names, 109 keys, set to null, to "undefined" and to a cut-off JSON string, one at a time, on Home and on the screens whose views read the key; 366 loads): before (4331, main as built for the hunt): 1 breaking load of 366. `vmx-quests-streak` = null puts Home's error card up ("หน้านี้ขัดข้อง"): `readStreak` in `src/lib/quests.js` returns the parsed null and the streak code reads `.lastDate` from it. Not fixed here: quests.js reads localStorage itself, not through the hook, and Home is another lane; reported. "undefined" and a cut-off string broke nothing (every reader catches the parse). `vmx-consent-prefs` = null did not show in the sweep because the sweep seeds consent "essential", where prefs are not read; with consent "custom" it blanks the app (nullstore.mjs above). After: runs in the post-push job.
- Guard: `tests/unit/use-storage.test.mjs`.

### Checks
- Unit tests of each item pass on their own (listed under each guard). Full unit suite and build on the merged head: see the head commit's note in the main session's wave.
- e2e: `palette-frame.spec.js` (new), `optional-feature-failure.spec.js` (first case rewritten), `wiki-subject-address.spec.js` (new): none has run anywhere yet; CI on the wave's pull request runs them on four engines.
