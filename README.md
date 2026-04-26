# 🐾 VetMock v5.0 — Full Vet Study Platform

คลังข้อสอบ + ตารางสอบ + คลิปย้อนหลัง สำหรับสัตวแพทย์ จุฬา
Made with ♡ by **Vet 86**

---

## ⚡ Quick Start

```bash
npm install
npm run dev
# เปิด http://localhost:5173
```

**ใช้ได้เลย!** ไม่ต้อง setup อะไร (single-player mode)

ถ้าอยากได้ multi-player (login, groups, leaderboard) → ดู [`SETUP.md`](./SETUP.md)

---

## ✨ ฟีเจอร์ใหม่ใน v5.0

### 📅 ตารางสอบ
- รวมตารางสอบ Final ปี 4 Vet 86 (Sem 2/2568)
- Countdown "อีกกี่วันถึงจะสอบ"
- เนื้อหาที่จะออก + สถานที่ + เวลา
- ปุ่มไปทำข้อสอบวิชานั้นๆ ได้เลย

### 🎥 คลิปย้อนหลัง
- รวมคลิป YouTube แยกตามวิชา
- เล่นในเว็บได้เลย (YouTube embed)
- แก้/เพิ่มคลิปได้ใน `src/data/videos.js`

### 📚 ระบุแหล่งที่มา
- ทุกข้อสอบมี field `source` บอกว่าดึงมาจากข้อสอบเก่าไหน
- `src/data/sources.js` รวมข้อมูล contributors + ข้อสอบเก่า + topics แต่ละวิชา

### 🎓 รองรับทุกชั้นปี (schema พร้อม)
- ตอนนี้มีข้อมูลปี 4 ครบ (570+ ข้อ · 8 วิชา)
- ปี 1-3, 5-6 จะเพิ่มได้ในอนาคต (schema รองรับแล้ว)

### 📮 Feedback Form
- รายงาน bug / ส่งความเห็น → ส่งไป `palmzamak2547@gmail.com`
- Optional: เชื่อม Formspree สำหรับระบบเต็ม (ดู SETUP.md)

### 👥 By Vet 86 — หน้า About
- แนะนำคนสร้าง
- Credits สำหรับข้อสอบเก่าของรุ่นพี่ (Vet 83, 84, 85)

---

## 📝 ฟีเจอร์จาก v1-v4 (ยังมีครบ)

### 📝 การเรียน
- **570+ ข้อสอบ** 8 วิชา (Surg II/III, Repro, COM III/IV/V, Exotic, Cli App Rum)
- **4 ประเภทคำถาม**: MCQ, True/False, Fill, Match
- **Image-based questions**
- **3 โหมด**: Quick Practice / Exam Mode / Spaced Repetition (SM-2)

### 🎯 ติดตามผล
- Bookmark ⭐ + Notes 📝
- Analytics Dashboard
- Weak Spot Detection
- Study Streak 🔥

### 🛠️ เครื่องมือ
- Question Manager (เพิ่ม/แก้ไขข้อสอบเอง)
- Dark/Light Mode
- Keyboard Shortcuts
- Import/Export JSON

### 👥 Multi-player (ต้อง Setup Supabase)
- Login (Email/Password + Google OAuth)
- Study Groups + Invite Code
- Shared Question Bank
- Leaderboard (กลุ่ม + Global)
- Cloud Sync ข้ามเครื่อง

---

## 📂 โครงสร้างไฟล์

```
vet-mock/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.js
│   ├── data/
│   │   ├── curriculum.js          ← YEARS + SUBJECTS
│   │   ├── schedule.js            ← ตารางสอบ 🆕
│   │   ├── videos.js              ← YouTube links 🆕
│   │   ├── sources.js             ← แหล่งที่มาข้อสอบ 🆕
│   │   ├── questions.js
│   │   ├── questions-part1.js     ← Surg + Repro
│   │   ├── questions-part2.js     ← COM + Exotic
│   │   ├── questions-part3.js     ← Expanded
│   │   └── images.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useStorage.js
│   │   ├── sm2.js
│   │   └── utils.js
│   ├── lib/
│   │   ├── supabase.js
│   │   └── api.js
│   ├── components/
│   │   └── Question.jsx
│   └── views/  (18 views รวม)
│       ├── HomeView.jsx
│       ├── ScheduleView.jsx       🆕
│       ├── VideoView.jsx          🆕
│       ├── AboutView.jsx          🆕
│       ├── FeedbackView.jsx       🆕
│       ├── YearSelectView.jsx     🆕
│       ├── AuthView.jsx
│       ├── GroupsView.jsx
│       ├── GroupDetailView.jsx
│       ├── LeaderboardView.jsx
│       ├── SubjectSelectView.jsx
│       ├── ConfigView.jsx
│       ├── ExamView.jsx
│       ├── ResultsView.jsx
│       ├── ReviewView.jsx
│       ├── SRSessionView.jsx
│       ├── DashboardView.jsx
│       └── QuestionManagerView.jsx
└── supabase-schema.sql
```

---

## 💡 วิธีเพิ่มข้อมูลใหม่

### เพิ่มตารางสอบ
แก้ `src/data/schedule.js`:
```js
{
  id: 'repro-final', subject: 'repro',
  title: 'Repro Lab Final',
  date: '2026-05-05', time: '09:00-11:00',
  location: 'ชั้น 8',
  content: ['Vaginal cytology', 'Pyometra', '...'],
  notes: 'เอกสารเสริม...',
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

### เพิ่มข้อสอบของชั้นปีอื่น
1. แก้ `src/data/curriculum.js` → เพิ่มใน `SUBJECTS_BY_YEAR`:
   ```js
   3: [
     { id: 'pharm3', name: 'Pharmacology', ... },
   ],
   ```
2. เพิ่มข้อสอบใน part files:
   ```js
   { id: 400, year: 3, subject: 'pharm3', source: '...', ... }
   ```

---

## 🚀 Deploy

```bash
git add .
git commit -m "my updates"
git push
# Vercel auto-deploys in 30s
```

ดู SETUP.md สำหรับคำแนะนำเต็ม

---

## 📮 Feedback

เจอ bug หรือมีไอเดียเพิ่ม? ส่งมาที่:
**palmzamak2547@gmail.com**

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
- Powered by React + Vite + Supabase
- Free tier: $0/month

---

🐾 Chula Vet · v5.0
