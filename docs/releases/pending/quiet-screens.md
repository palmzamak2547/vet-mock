# Quiet screens (pending release notes)

## Where I stopped

Done (one commit per item, on `claude/quiet-screens`, not pushed): items 1, 2, 3, 4, 5, 6, 9, 10, 11, 14, 15, each with its unit or e2e test (`tests/e2e/quiet-screens.spec.js` collects the e2e checks; unit tests in `tests/unit/first-tip`, `wiki-index-conflict-chip`, `wiki-review-fixes`, `wiki-shelves`, `topic-note-caveats`, `topic-count-custom-overlay`, `changelog-seen`, `config-ladder`, `decide`, `home-rail-quiet`, `quiet-small`). Targeted unit files pass locally.

Nothing was running when I stopped: `npm ci` finished (the fourth try, after moving two binaries another process held: `@esbuild/win32-x64/esbuild.exe` and `@rollup/rollup-win32-x64-msvc/rollup.win32-x64-msvc.node`, parked in the session scratchpad `held/`). No dev server was started.

Not yet run: the e2e specs touched or added (`quiet-screens`, `first-tip`, `smoke`, `update-note`, `connected-study`, `decide-for-student`) on the four engines, `npm run lint:data` (curriculum.js changed: five equine notes marked caveat), the full unit suite, the build.

Next three steps:
1. Through the heavy lock: build, then the touched specs on chromium-desktop, chromium-mobile, webkit-mobile, firefox-desktop; `npm run lint:data`; the full unit suite once. Fix what fails from its output.
2. Before/after phone screenshots (375x812, before on 127.0.0.1:4331, after on `npx vite --port 4341 --strictPort`), the contact sheet at the scratchpad `quiet-screens/contact-sheet.png`, the first-viewport shares per screen.
3. Fill this file (Thai changelog block, English notes with counts), add the "Quiet screens" section to AGENTS.md (the five rules; update the line that says the topic screen counts "ข้อสอบเก่า X/Y"), then `git push -u origin claude/quiet-screens` once.

## Changelog lines (draft, kind and scope)

```
feature system  คำแนะนำการใช้งานขึ้นครั้งเดียว: แต่ละหน้าบอกวิธีใช้ครั้งแรกที่เปิด แล้วไม่ขึ้นซ้ำอีก
feature system  VetWiki อ่านสบายขึ้น: ที่มาและแหล่งอ้างอิงของแต่ละส่วนพับไว้ในแถวเดียว จุดที่แหล่งอ้างอิงไม่ตรงกับที่สอนบอกไว้ตรงส่วนนั้นที่เดียว
feature system  หน้าเลือกวิชาและหัวข้อสะอาดขึ้น: สัดส่วนคะแนนอยู่ในหน้าวิชา การ์ดหัวข้อบอกสัดส่วนข้อสอบเก่าสั้น ๆ และเหลือเฉพาะคำเตือนที่เปลี่ยนสิ่งที่ต้องอ่าน
feature system  หน้าแรกเงียบขึ้น: ป้ายอัปเดตขึ้นเฉพาะเมื่อมีของใหม่ วันละครั้ง ค่าเล่าเรียนเตือนเมื่อใกล้ครบกำหนด และคาบเรียนบอกชื่อวิชาภาษาไทย
```
