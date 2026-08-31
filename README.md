# 🐾 VetMock — คลังโจทย์ฝึกสัตวแพทย์ จุฬาฯ

คลังข้อสอบ + ตารางเรียน/ตารางสอบ + สรุปคลิป + VetWiki สำหรับนิสิตสัตวแพทย์
Made with ♡ by **Vet 86**

🌐 **Live:** [vetmock.vercel.app](https://vetmock.vercel.app)
🔗 **Sister sites:** [cuvetsmo.com](https://cuvetsmo.com) (สโมสรนิสิต), [hanong.vercel.app](https://hanong.vercel.app) (stray welfare)

**Current release:** v5.56.0 · production verified 2026-08-31
Maintainer map: [`docs/PROJECT_KNOWLEDGE_BASE.md`](./docs/PROJECT_KNOWLEDGE_BASE.md)

> ตัวเลข content inventory ด้านล่าง auto-generated จาก source จริงด้วย `npm run stats -- --write`
> ตรวจ drift ด้วย `npm run stats:check`; รายละเอียดเต็มอยู่ที่
> [`docs/content-inventory.md`](./docs/content-inventory.md)

---

## ⚡ Quick Start

```bash
npm install
npm run dev
# เปิด http://localhost:5173
```

**ใช้ได้เลย** ไม่ต้อง setup อะไร (single-player mode ทำงานบน localStorage)

อยากได้ multi-player (login, กลุ่มติว, leaderboard, cloud sync) → ดู [`SETUP.md`](./SETUP.md)

---

## 📊 มีอะไรอยู่ในนี้บ้าง

<!-- content-stats:start -->
| | |
|---|---|
| ข้อสอบพร้อมฝึก | **4,551 ข้อ** ใน 66 bank files, 43 วิชา |
| พักไว้เพื่อความถูกต้อง | 0 ข้อรอภาพที่ตรวจสอบแล้ว (เก็บใน source bank แต่ไม่ส่งให้ผู้เรียน) |
| ชั้นปีที่มีเนื้อหา | ปี 1 (298), ปี 2 (144), ปี 3 (62), ปี 4 (2,090), ปี 5 (1,957) |
| สรุปโน้ต | 37 ไฟล์, 376 หัวข้อ, 4,032 sections, อ้างอิงแหล่งที่มาครบ 100% |
| สรุปคลิป | 400 คลิป ใน 27 ไฟล์ |
| VetWiki (governed) | 208 หัวข้อ, 1,769 sections = 43.9% ของ note sections |
| Taxonomy | 86 วิชา, 1,037 หัวข้อ |
| ชนิดคำถาม | MCQ, True/False, Fill-in, Matching, Short answer, Writing |
<!-- content-stats:end -->

**เทอมปัจจุบัน:** ภาคการศึกษาต้น 2569 — Vet 86 = ชั้นปีที่ 5
ย้ายรุ่นทุกต้นปีการศึกษาที่ `CURRENT_YEAR` ใน `src/data/curriculum.js` ที่เดียว
(`SEMESTER` ใน `schedule.js` และ default ของ `getUpcomingExams` อิงจากตรงนั้น)

---

## ✨ ฟีเจอร์

31 ฟีเจอร์ลงทะเบียนไว้ที่ `src/lib/feature-registry.js` ซึ่งเป็น single source
ที่ป้อนทั้งหน้าแรก, ⌘K command palette และปุ่มเครื่องมือลอย

### ฝึก
- **ฝึกข้อสอบ** เลือกวิชา/หัวข้อ/จำนวน, จับเวลาได้
- **โหมดสอบ** autosave + resume, ยืนยันก่อนส่ง, แยกคะแนน auto-graded กับข้อเขียน
- **Spaced Repetition** (SM-2)
- **Race Mode** แข่งกับเพื่อนแบบ realtime
- **Review Queue** คิวตรวจข้อที่มีคนส่งเข้ามา

### เรียน
- **VetWiki** คลังความรู้ที่บอกที่มาได้ทุก section + ลิงก์ `/wiki/<subject>/<topic>` แชร์ได้
- **Notes โหลดตามวิชา** Notes และ VetWiki ใช้ source map เดียวกัน ไม่ดาวน์โหลดทุกชั้นปีพร้อมกัน
- **สรุปคลิป** 400 คลิปแยกตามวิชา
- **ตารางเรียน & สอบ** ตารางรายสัปดาห์ + countdown + ปฏิทินลงทะเบียน/ชำระเงิน
- **Reading Checklist**, **Pinboard**, **Notes**, **อาจารย์ผู้สอน**

### ติดตามผล
- **ความคืบหน้า** dashboard + heatmap + learning curve
- **สัดส่วนคะแนนรายวิชา**, **Leaderboard**, **Phase Wrapped**

### เครื่องมือ
เครื่องคิดเลขทางสัตวแพทย์, กระดานวาด, Imaging Practical (ฝึกเร็ว ใช้ง่าย), Imaging Pro (เครื่องมือเต็ม), Image Occlusion,
PDF + Annotate, Pomodoro, กลุ่มติว, ช่วยเติมเนื้อหา, เพิ่ม/แก้ข้อสอบเอง

### ทั่วทั้งแอป
PWA + offline (service worker), dark mode + ชุดสีให้เลือก, ⌘K, keyboard shortcuts,
bottom nav บนมือถือ, import/export JSON ที่ตรวจ schema + แสดงรายการก่อนเขียนทับ,
cloud sync เมื่อ login

---

## 📂 โครงสร้างไฟล์

```
vet-mock/
├── src/
│   ├── App.jsx                     ← view routing (state-based) + shared state
│   ├── main.jsx
│   ├── styles.css                  ← design tokens (--vmx-*, --clr-*)
│   ├── styles-landing.css
│   ├── data/
│   │   ├── curriculum.js           ← YEARS + CURRENT_YEAR + SUBJECTS_BY_YEAR
│   │   ├── schedule.js             ← ตารางเรียน/สอบ/ปฏิทินการศึกษา
│   │   ├── questions.js            ← lazy Q-bank loader
│   │   ├── bank-registry.generated.js ← auto-generated (npm run lint:registry)
│   │   ├── q-counts.js             ← auto-generated counts
│   │   ├── questions-*.js          ← Q banks
│   │   ├── notes-*.js              ← study-note sources
│   │   ├── note-corpus.js           ← shared lazy Notes/VetWiki loader map
│   │   ├── video-summaries-*.js    ← per-subject video summaries
│   │   └── changelog.js, videos.js, sources.js, instructors.js, images.js
│   ├── lib/
│   │   ├── feature-registry.js     ← single source ของฟีเจอร์ทั้งหมด
│   │   ├── nav.js                  ← ป้อนทั้ง Sidebar และ BottomNav
│   │   ├── dialog.js               ← confirm/alert ของแอปเอง (ไม่ใช้ของเบราว์เซอร์)
│   │   ├── user-data-sync.js       ← local commit + outbox + cloud sync
│   │   ├── user-data-schema.js     ← Valibot backup/custom-Q validation
│   │   ├── note-retry.js           ← resume Notes target after chunk retry
│   │   ├── vetwiki/                ← governed knowledge runtime
│   │   └── supabase.js, api.js, xp.js, pinboard.js, ...
│   ├── hooks/                      ← useAuth, useStorage, useExamSession, sm2, ...
│   ├── components/
│   └── views/
├── api/                            ← Vercel functions
├── scripts/                        ← lint + regen + stats
├── tests/                          ← unit (node:test) + e2e (Playwright)
├── docs/                           ← content-inventory, UX audit, design system
└── supabase-schema.sql
```

---

## ✅ Gates

ทุก commit ต้องผ่านทั้งหมดนี้:

```bash
npm run lint:all    # consistency + content-quality gates
npm run build
npm run test:unit   # node:test suite
npm run test:e2e    # Playwright (desktop + mobile)
npm run stats:check # fail ถ้า README/docs inventory drift จาก source
npm audit --audit-level=high
```

`lint:all` fail = ห้าม push
ก่อนเพิ่มข้อสอบ อ่าน [`ADDING-QUESTIONS.md`](./ADDING-QUESTIONS.md) ก่อน

---

## 💡 วิธีเพิ่มข้อมูลใหม่

### เพิ่มข้อสอบ
ดู [`ADDING-QUESTIONS.md`](./ADDING-QUESTIONS.md) — ครบตั้งแต่วางไฟล์ จน regen
registry แล้วรัน gates

### เพิ่มตารางสอบ
แก้ `EXAM_SCHEDULE` ใน `src/data/schedule.js`:
```js
{
  id: 'com5-mid', code: '3107510', subject: 'com5',
  title: 'COM V — Midterm',
  date: '2026-09-21', time: '08:30-10:30', duration_min: 120,
  location: 'VET6 807',
  content: ['หัวข้อที่ออก...'],
}
```

### เพิ่มคลิปวิดีโอ
แก้ `src/data/videos.js`:
```js
{
  subject: 'surg3',
  topic: 'ESF Technique',
  url: 'https://www.youtube.com/watch?v=VIDEO_ID',
  author: 'VetChannel',
  duration: '10:30',
  tags: ['ESF', 'orthopedic'],
}
```

### เปิดชั้นปีใหม่
1. เพิ่มวิชาใน `SUBJECTS_BY_YEAR` (`src/data/curriculum.js`)
2. วาง Q bank แล้วรัน `npm run lint:registry` เพื่อ regen registry
3. ปลด `scaffold: true` ของปีนั้นใน `YEARS`
   (`lint:curriculum` จะ fail ถ้าปีมีข้อสอบแล้วแต่ยังติด scaffold หรือกลับกัน)

---

## 🚀 Deploy

```bash
npm run test:unit
npm run lint:all
npm run build
npm audit --audit-level=high
git push origin main
```

Vercel auto-deploys `main`, but a push is not production proof. Wait for the
exact-SHA GitHub Build + Smoke E2E runs, confirm the Vercel **Production**
deployment, then run a changed capability against `https://vetmock.vercel.app`.
Full checklist: [`docs/PROJECT_KNOWLEDGE_BASE.md`](./docs/PROJECT_KNOWLEDGE_BASE.md#release-gate).

⚠️ ถ้า CSS/JS shape, lazy loading, route หรือ update behavior เปลี่ยน ต้องบัมพ์
`SW_VERSION` ใน `public/sw.js` ด้วย
ไม่งั้นเครื่องที่ติดตั้ง PWA ไว้จะค้างที่ bundle เก่า

ดู [`SETUP.md`](./SETUP.md) สำหรับ Supabase + OAuth

---

## 📮 Feedback

เจอ bug หรือมีไอเดีย ส่งมาที่ **palmzamak2547@gmail.com**
หรือใช้ฟอร์มในเว็บ (หน้า Feedback)

---

## 🙏 Credits

**ข้อสอบเก่า:**
- Vet 83 (pployyyn — Repro Lab)
- Vet 84 (พี่พล, Ping, Sunsun, Saideang, Janny — Surg Lab III)
- Vet 85 (Kimchii — Repro, COM III, COM IV, Exotic; + Surg Lab II)
- Vet 86 — ข้อสอบเก็บรวม, COM IV

**Platform:**
- Made with ♡ by **Vet 86**
- React + Vite + Supabase
- Free tier: $0/month

---

🐾 Chula Vet
