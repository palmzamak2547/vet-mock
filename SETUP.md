# 🐾 VetMock v4.0 — Setup Guide

คู่มือการ deploy แบบละเอียดทุกสเต็ป — ทำตามได้เลย ไม่ต้องรู้ coding มาก่อน

---

## 📋 ภาพรวม

ขั้นตอนทั้งหมดประมาณ **45 นาที** แบ่งเป็น 4 phase:

| Phase | ใช้เวลา | ทำอะไร |
|---|---|---|
| **1. ทดสอบเบื้องต้น** | 5 min | รันเว็บในเครื่อง (แบบ single-player) |
| **2. ตั้งค่า Supabase** | 15 min | สร้าง database + auth |
| **3. ตั้งค่า Google OAuth** | 10 min | (optional) ใส่ Google login |
| **4. Deploy ขึ้น Vercel** | 15 min | ได้ URL จริง |

---

## 🛠️ PHASE 1: ติดตั้งเครื่องมือ (ครั้งเดียว)

ถ้าเคยทำแล้วข้ามได้เลย

### 1.1 ติดตั้ง Node.js
- ดาวน์โหลดจาก https://nodejs.org/en/download (เลือก **LTS**)
- Install ตามปกติ
- เช็คว่าติดตั้งสำเร็จ: เปิด Terminal/Command Prompt แล้วพิมพ์
  ```bash
  node --version
  # ต้องแสดง version เช่น v20.x.x
  ```

### 1.2 ติดตั้ง Git
- ดาวน์โหลดจาก https://git-scm.com/downloads
- Install ตามปกติ

### 1.3 สมัครบัญชี (ฟรี ทั้งหมด)
- ☑️ GitHub: https://github.com/signup
- ☑️ Supabase: https://supabase.com/dashboard (login ด้วย GitHub ได้เลย)
- ☑️ Vercel: https://vercel.com/signup (login ด้วย GitHub ได้เลย)

---

## 🧪 PHASE 2: ทดสอบเบื้องต้น (5 นาที)

ทดสอบให้เว็บรันในเครื่องก่อน — แบบ **single-player** (ยังไม่ต้อง login)

### 2.1 Unzip + Install
```bash
# unzip ไฟล์ vet-mock-v4.zip ลงที่ไหนก็ได้
cd vet-mock
npm install
```

> ⏳ `npm install` ใช้เวลาประมาณ 1-2 นาที ครั้งแรก

### 2.2 Run dev server
```bash
npm run dev
```

จะเห็นข้อความ:
```
  VITE v5.4.21  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

เปิด browser ไปที่ **http://localhost:5173** → เห็นเว็บ VetMock 🎉

> 💡 ตอนนี้ยังไม่มีปุ่ม Login เพราะยังไม่ได้ตั้งค่า Supabase — ใช้งานได้ทุกฟีเจอร์ยกเว้น groups/leaderboard

กด `Ctrl+C` ใน terminal เพื่อหยุด server

---

## 🔐 PHASE 3: ตั้งค่า Supabase (15 นาที)

ถ้าอยากได้แค่ single-player ข้ามไป PHASE 5 ได้เลย

### 3.1 สร้าง Supabase Project

1. เข้า https://supabase.com/dashboard
2. กด **"New Project"**
3. กรอกข้อมูล:
   - **Name**: `vetmock` (หรืออะไรก็ได้)
   - **Database Password**: สุ่มรหัสยาวๆ → **กดเซฟไว้** (ใช้ตอนอื่นไม่ได้ซะหน่อยแต่เก็บไว้เผื่อ)
   - **Region**: **Southeast Asia (Singapore)** (ใกล้ไทยสุด)
   - **Pricing Plan**: **Free** (พอเพียงสำหรับหลายร้อย users)
4. กด **"Create new project"**
5. รอประมาณ 2 นาที ให้ Supabase setup database

### 3.2 รัน SQL Schema (สำคัญสุด!)

1. ใน Supabase Dashboard → sidebar ซ้าย กด **"SQL Editor"** (icon: `{}`)
2. กด **"New query"**
3. เปิดไฟล์ `supabase-schema.sql` ใน project folder ด้วย notepad/editor
4. **Copy ทั้งหมด** แล้ว **paste** ลงใน SQL Editor
5. กด **"Run"** (หรือ Ctrl+Enter)
6. ✅ ถ้าเห็น **"Success. No rows returned"** = เรียบร้อย!

> ⚠️ ถ้า error → check ว่า paste ครบทั้งไฟล์ไหม

### 3.3 เอา API Keys มาใส่ในโปรเจกต์

1. ใน Supabase Dashboard → sidebar ซ้าย → **"Settings"** (⚙️ icon ล่างสุด)
2. กด **"API"**
3. **Copy ค่า 2 ค่าต่อไปนี้**:
   - **Project URL** (อยู่ใต้หัวข้อ "Project URL") — เช่น `https://abcdefgh.supabase.co`
   - **anon / public** key (ใต้หัวข้อ "Project API keys") — string ยาวๆ ขึ้นต้นด้วย `eyJhbGci...`

4. ในโฟลเดอร์ `vet-mock` → **สร้างไฟล์ใหม่** ชื่อ `.env.local` (มีจุดข้างหน้า!)

5. ใส่ 2 บรรทัดนี้:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
   แทน `YOUR_PROJECT_REF` และ anon key ด้วยค่าจริงที่ copy มา

6. Save ไฟล์

### 3.4 ทดสอบ Supabase Connection

```bash
npm run dev
```

เปิด http://localhost:5173 — ถ้าเห็นปุ่ม **"Login"** ที่มุมบนขวา = connection ok! 🎉

ลองสมัคร account ทดสอบด้วย email:
1. กด Login → กด "สมัครเลย"
2. ใส่ username / email / password
3. กด "สมัคร"
4. เช็ค email ของพี่ → กด link verify → login ได้เลย

> 💡 Supabase free plan ส่ง verify email ให้ฟรี (จำกัด ~30 emails/hour)

---

## 🔍 PHASE 4: (Optional) ตั้งค่า Google Sign-in (10 นาที)

ถ้าไม่อยากทำข้ามได้ — email login ก็ใช้ได้ปกติ

### 4.1 สร้าง Google OAuth Credentials

1. เข้า https://console.cloud.google.com
2. สร้าง Project ใหม่ (หรือใช้ของเดิม)
3. Menu (☰) → **APIs & Services** → **Credentials**
4. กด **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
5. ถ้าระบบบอกให้ config "OAuth consent screen" ก่อน:
   - User Type: **External** → Create
   - App name: `VetMock`
   - User support email: (email ของพี่)
   - Developer contact: (email ของพี่)
   - Save and Continue ผ่านทุกหน้า
6. กลับมาสร้าง OAuth client ID:
   - Application type: **Web application**
   - Name: `VetMock Web`
   - Authorized JavaScript origins: `http://localhost:5173`
   - **Authorized redirect URIs**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     > แทน `YOUR_PROJECT_REF` ด้วยของ Supabase
7. กด **CREATE**
8. **Copy** ค่า **Client ID** และ **Client Secret** เก็บไว้

### 4.2 เปิด Google Provider ใน Supabase

1. Supabase Dashboard → **Authentication** → **Providers**
2. หา **Google** → enable
3. Paste **Client ID** และ **Client Secret**
4. Copy URL ใน field **"Redirect URL"** → เอาไปใส่ใน Google Cloud "Authorized redirect URIs" ถ้ายังไม่ได้ใส่
5. Save

### 4.3 ทดสอบ

```bash
npm run dev
```

เปิด http://localhost:5173 → Login → กดปุ่ม **"เข้าสู่ระบบด้วย Google"** → ต้อง redirect ไป Google แล้วกลับมาเข้าระบบได้

---

## 🚀 PHASE 5: Deploy ขึ้น Vercel (15 นาที)

### 5.1 Push โค้ดขึ้น GitHub

```bash
cd vet-mock
git init
git add .
git commit -m "VetMock v4.0 initial"
git branch -M main
```

สร้าง repo ใหม่บน GitHub:
1. ไปที่ https://github.com/new
2. ชื่อ: `vet-mock` (หรืออะไรก็ได้)
3. **อย่า** tick "Initialize with README"
4. กด Create Repository
5. Copy คำสั่งที่ GitHub แสดง เช่น:
   ```bash
   git remote add origin https://github.com/USERNAME/vet-mock.git
   git push -u origin main
   ```
6. รันคำสั่งนั้นใน terminal

### 5.2 Deploy บน Vercel

1. เข้า https://vercel.com/new
2. เลือก GitHub repo `vet-mock` → **Import**
3. ในหน้า Configure:
   - Framework Preset: **Vite** (auto-detected)
   - เปิด section **"Environment Variables"**
   - เพิ่ม 2 ตัว:
     - `VITE_SUPABASE_URL` = (ค่าเดียวกับ .env.local)
     - `VITE_SUPABASE_ANON_KEY` = (ค่าเดียวกับ .env.local)
4. กด **Deploy**
5. รอ 1-2 นาที → ได้ URL เช่น `https://vet-mock-xxx.vercel.app` 🎉

### 5.3 อัพเดต OAuth Settings

ใส่ Production URL ใน 2 ที่:

**Supabase:**
1. Authentication → **URL Configuration**
2. **Site URL**: `https://vet-mock-xxx.vercel.app`
3. **Redirect URLs**: เพิ่ม `https://vet-mock-xxx.vercel.app/**`

**Google Cloud (ถ้าใช้ Google Sign-in):**
1. Credentials → OAuth client ID → Edit
2. เพิ่มใน "Authorized JavaScript origins": `https://vet-mock-xxx.vercel.app`

---

## 🎉 เสร็จแล้ว!

แชร์ URL นี้ให้เพื่อนๆ vet 86 ได้เลย ทุกคนจะได้:
- ✅ สมัคร account + login
- ✅ สร้าง/join study groups
- ✅ แชร์ข้อสอบในกลุ่ม
- ✅ แข่งคะแนน leaderboard
- ✅ Progress sync ข้ามเครื่อง (คอมเครื่องใหม่ login แล้วได้ข้อมูลเดิม)

---

## 🛠️ การอัพเดตในอนาคต

เวลาแก้โค้ด/เพิ่มข้อสอบ:

```bash
git add .
git commit -m "add new questions"
git push
```

Vercel จะ deploy ใหม่อัตโนมัติใน 30 วินาที ✨

---

## ❓ Troubleshooting

### "Supabase not configured" - ไม่มีปุ่ม Login
- เช็คว่าสร้างไฟล์ `.env.local` (มีจุดข้างหน้า) และใส่ค่าถูกต้อง
- Restart dev server (`Ctrl+C` แล้ว `npm run dev`)

### "Failed to fetch" ตอนสมัคร
- เช็คว่ารัน `supabase-schema.sql` แล้วจริงหรือไม่
- ลองเข้า Supabase Dashboard → Table Editor — ต้องเห็น tables: profiles, groups, etc.

### Vercel build fail
- Check log ใน Vercel → ส่วนมากเป็น typo
- ลองรัน `npm run build` ในเครื่องก่อน ถ้า error ที่นี่ = จะ error บน Vercel ด้วย

### Email verify ไม่มา
- Check spam folder
- Free plan: 30 emails/hour จำกัด รอสักพัก
- หรือเข้า Supabase → Authentication → Users → กด verify manual ได้

### อยากเลิกใช้ Supabase
- แค่ลบไฟล์ `.env.local` — จะกลับไปเป็น single-player อัตโนมัติ
- ข้อมูลใน localStorage จะไม่หาย

---

## 💰 ค่าใช้จ่าย (Free Tier Limits)

| บริการ | Free Tier | เหมาะสำหรับ |
|---|---|---|
| **Supabase** | 50k monthly active users, 500MB DB, 1GB storage | 500+ users ห้อง Vet |
| **Vercel** | 100GB bandwidth/month | หลายพัน visits |
| **GitHub** | Unlimited public repos | ไม่จำกัด |

**รวมค่าใช้จ่ายต่อเดือน: 0 บาท** 🎉

---

## 📂 โครงสร้างไฟล์

```
vet-mock/
├── .env.example               ← Template สำหรับ env vars
├── .env.local                 ← (สร้างเอง) Supabase credentials
├── .gitignore
├── index.html
├── package.json
├── supabase-schema.sql        ← ⭐ รันใน Supabase SQL Editor
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.js
    ├── lib/
    │   ├── supabase.js        ← Supabase client + auth
    │   └── api.js             ← Groups, leaderboard, sync APIs
    ├── data/
    │   ├── questions.js
    │   ├── questions-part1.js
    │   ├── questions-part2.js
    │   ├── questions-part3.js
    │   └── images.js
    ├── hooks/
    │   ├── useAuth.js         ← Auth state
    │   ├── useStorage.js      ← localStorage
    │   ├── sm2.js             ← Spaced Repetition
    │   └── utils.js
    ├── components/
    │   └── Question.jsx
    └── views/                 ← 12 views
        ├── HomeView.jsx
        ├── AuthView.jsx       ⭐ Login/Signup
        ├── GroupsView.jsx     ⭐ Study groups
        ├── GroupDetailView.jsx ⭐ Group members/leaderboard
        ├── LeaderboardView.jsx ⭐ Global leaderboard
        ├── SubjectSelectView.jsx
        ├── ConfigView.jsx
        ├── ExamView.jsx
        ├── ResultsView.jsx
        ├── ReviewView.jsx
        ├── SRSessionView.jsx
        ├── DashboardView.jsx
        └── QuestionManagerView.jsx
```

---

Made with ♡ · VetMock v4.0 · Chula Vet 86 🐾

พร้อมเมื่อพี่พร้อมเลย! ถ้าติดตรงไหนแค่บอก ผมช่วยได้ครับ 💪
