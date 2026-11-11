# Pending: "ปรับแต่ง", the customization studio and "การ์ดของฉัน"

## State
- On top of `claude/verdict-pin` (7f94e596, verdict colours, its own pull request). The changelog line for
  the verdict fix belongs to that pull request; it is not repeated below.
- Waits for `claude/student-profile`: Avatar in the header chip, hub, board rows, groups, presence and
  comments; the hub entry to the studio; the picture written through `saveIdentity()` (until then the
  studio keeps it in the local card token); `PICTURE_ANIMALS` matched to IdentityEditor's 16.

```js
// Changelog lines (Thai, what a student notices). kind / scope as in src/data/changelog.js.
{ kind: 'feature', scope: 'system', title: 'หน้า "ปรับแต่ง" รวมทุกอย่างไว้ที่เดียว', desc: 'เลือกชุดสำเร็จได้ในแตะเดียว เปลี่ยนแล้วเห็นทันที และกดย้อนกลับได้ ส่วนที่ละเอียดกว่าอยู่ใต้ "ปรับเอง" เปิดจากเมนูธีมด้านบน' },
{ kind: 'feature', scope: 'system', title: 'การ์ดของฉัน', desc: 'เลือกตัวละคร VetMock หรือสัตว์ที่ชอบเป็นรูป เลือกพื้นหลังได้ทุกแบบ ส่วนกรอบ ตำแหน่ง และถ้วยบนการ์ดได้จากการฝึกจริง การ์ดสะท้อนแสงตามนิ้ว' },
{ kind: 'feature', scope: 'system', title: 'สีของฉัน', desc: 'เลือกเฉดสีเองได้ทุกเฉด ระบบปรับความสว่างให้ตัวหนังสือและปุ่มอ่านชัดเสมอ' },
{ kind: 'feature', scope: 'system', title: 'การตั้งค่าตามไปเครื่องอื่น', desc: 'สี เพื่อนติว และการ์ดตามไปเครื่องอื่นที่เข้าบัญชีเดียวกัน เครื่องที่ตั้งไว้เองแล้วยังใช้ค่าของเครื่องนั้น' },
{ kind: 'fix', scope: 'system', title: 'จานสีขึ้นทันทีที่เปิดแอป', desc: 'จานสีที่เลือกไว้ขึ้นตั้งแต่หน้าแรกปรากฏ ไม่กะพริบเป็นสีเขียวก่อน' },
```

## Notes (English)

Branch `claude/custom-studio`, on top of main `ef993a0e`. No database change, no migration, no new
dependency, no art from outside the repository.

### 1. One table of preferences (`src/lib/prefs/table.js`)
Every row: id, the key it already had, the owning module it reads and writes through, choices, a
default from signals, `account`, `exam: 'as-today'`. Names in `src/lib/prefs/labels.js`.

Inventory taken on 11 Nov 2026 (every `vmx-*` key in `src/`):
- In the table, 16 rows: theme, palette, my own hue (new), motion mode, companion, loader,
  celebration, reading pointer, haptics, buddy, read-aloud rate, card (new), and the four voice
  sliders. The studio shows 12 of them (palette, hue and card on top; theme, motion, companion,
  buddy, loader, celebration, pointer, read-aloud rate and haptics folded under "ปรับเอง"); the four
  voice sliders stay in the voice dialog, drawn from the same rows.
- Left out, with the reason: the study setup (`vmx-decide:*`, `vmx-instant-feedback`,
  `vmx-reveal-timing`, `vmx-sr-*`, year and phase) belongs to `decide.js` and its screens; the
  Pomodoro config sits on the timer it sets; consent stays its own explicit choice; the
  leaderboard, dashboard and pinboard year scopes, `vmx-wiki-layout`, `vmx-fullscreen`,
  `vmx-clip-skip`, the lab and PDF pen settings are a screen's remembered state, not taste;
  `vmx-landing-lang` is the signed-out page only; reminders are notifications, asked for apart.
- Do not exist as preferences: text size (browser zoom), a global sound switch, the order of the
  home grid (`lib/nav.js`). Corner radii are half tokenised (161 `var(--r-*)` uses against 176
  literal radii in styles.css and 409 inline in JSX) and there is no paper texture token, so
  shape and texture are not offered (no tokenising sweep in this branch).
- Fonts: the "ตัวอักษร" section is reserved between the look and the companion (shown in
  development only) and the table holds a marked slot for the `vmx-font` row that delegates to
  `src/lib/typography/fonts.js` once `claude/reading-fonts` is merged.
- Not stamped for the account copy: the read-aloud bar's own speed chips write
  `vmx-read-aloud-rate` through `read-aloud.js` (an owner, inside a running set, left as is); the
  value is still carried with the next account change.

Test: `tests/unit/prefs-table.test.mjs` (every old key seeded resolves to the meaning its module
gives it and is not rewritten; writes keep the stored shape; invalid values refused; presets valid
and never touch identity; no file outside a key's owners names it).

### 2. The studio (`src/views/StudioView.jsx`, `src/styles-studio.css`, lazy)
Card on top (docks as a bar when scrolled away, one IntersectionObserver), four ready-made sets
(`ตามเครื่อง`, `สงบนิ่ง`, `สดใส`, `อ่านดึก`; they never touch palette, buddy or card), the
decision `studio.preset` (`src/lib/decisions/studio-preset.js`: a phone asking for less motion gets
`สงบนิ่ง`), characters and animals, palettes with "สีของฉัน", the card's backdrop, frame, trophies
and title, and "ปรับเอง". Every change applies at once; one "ย้อนกลับ" for 6 s; no confirmation.
Palette and theme cross-fade with a View Transition (skipped on mobile WebKit, as App does).
Opened from the theme menu ("ปรับแต่งทั้งหมด") by the `vmx-open-studio` event, which App refuses
while the view is an exam, results, review, config, a review session or a race.
Old entries: the theme menu body (`ThemePickerPanel.jsx`, now lazy), `MotionSettings`,
`VoiceSettings`, `BuddySelector` and the reading pointer picker draw from and write through the
table. Tests: `tests/unit/decide.test.mjs` (studio.preset), `tests/e2e/custom-studio.spec.js`.

Motion values: chip press spring response 0.30 s, damping 0.70 (491 ms); controls and the undo bar
0.35 s / 0.82 (480 ms), sampled into `linear()`; card shadow from 8 px elevation; tilt at most 6
and 4 degrees; sheen smoothing tau 90 ms, frame-rate independent, loop stops at rest, nothing
attached under reduced motion or motion mode quiet/off, no `deviceorientation`. The 3D character is
the existing viewer, lazy, behind a button, only with WebGL2, no Save-Data and 4 GB or more.

### 3. The card (`src/components/StudentCard.jsx`, `src/lib/prefs/card-token.js`, `src/lib/card-trophies.js`)
Token `c1.b<backdrop>.f<frame>.t<title>.s<a>,<b>,<c>.p<emoji hex>`, at most 120 characters, strict
parse (unknown parts ignored, values off their lists dropped, no object built from input keys).
Private to the student's own screens in this release (`vmx-card`, follows the account). Frames:
plain free; ledger (100 answers), gilt (7-day streak), foil (30-day streak), seal (1,000 answers).
Titles and trophies on show (up to 3) are earned badges. One quiet line names the next trophy and
its distance. Picture: `src/lib/avatar.js` maps each character to one emoji, both ways
(Mochi 🐶, Pawsy 🐕, Mimi 🐱, Moocha 🐮, Porky 🐷, Oto 🦦, Clover 🐴, Chicky 🐥, Hootie 🦉,
Glidy 🐿️); `components/Avatar.jsx` draws a 96 px portrait (`scripts/make-avatars.mjs`, sharp,
3.0-5.1 KB each) or the emoji. Tests: `prefs-tokens.test.mjs`, `card-trophies.test.mjs`.

### 4. The account copy (`src/lib/prefs/account-token.js`, `account-sync.js`)
`user_metadata.vmx_prefs`: `p1;t=<ms base36>;pa=..;ah=..;co=..;lo=..;ce=..;rp=..;bu=..;rr=..;cd=..`,
at most 512 bytes (the longest possible measured in the test). Started after sign-in with a lazy
import; written after a quiet 2 s or when the studio closes; a device with its own choices keeps
them on first sign-in, then newest wins; a failed write keeps the local choice silently. In the
backup (`preferences`, parsed by `parseBackupPreferences`), and `vmx-prefs-sync:<id>` and
`vmx-card` are in the purge list. Test: `prefs-tokens.test.mjs` (hostile strings, prototype keys,
over-length, wrong version, the sign-in plan).

### 5. Colour and the exam (`src/lib/prefs/accent.js`, styles.css)
"สีของฉัน" derives ten accent tokens per theme in OKLCH, searching lightness and chroma outward from
a target until body and muted text, accent text on plain and accent-tinted surfaces, the primary
button label, the focus ring (3:1) and a 0.09 OKLab distance from the right and wrong answer
colours all hold. `index.html` applies the palette attribute and the derived sheet before the app
(checked against an allow-list of characters). Tests: `accent-palette.test.mjs` (360 hues x 2
themes, plus the six named palettes resolved from styles.css), `prefs-exam-rule.test.mjs`.

Exam, as found: the companion is not shown in a question set (AGENTS.md, Mochi), celebrations run
when a set ends and the exam keeps answers until submit, the timer reads only ink and rose. The one
defect, verdicts taking the palette accent, is fixed on `claude/verdict-pin` (verdict tokens, a derived
test). No file in `src/views/Exam*`, `Question.jsx` or scoring changed in this branch.

### Weight (gzip 9)
(measured at the end; see below)

### Waits for `claude/student-profile`
Wiring the avatar component into the header chip, the hub, board rows, groups, presence and
comments; the studio entry on the profile hub; the picture written through `saveIdentity()`
(until then the studio keeps the picture in the local card token); reconciling `PICTURE_ANIMALS`
with IdentityEditor's 16 animals.
