# OAuth Provider Setup Guide

ปุ่ม **LINE** + **Apple** ใน AuthView ใช้งานได้ทันทีถ้า config Supabase แล้ว — ถ้ายังไม่ config คลิกแล้วจะขึ้น "ยังไม่เปิด" ใส่ message ภาษาไทย safe ๆ ไม่พังหน้าจอ

ทำตามขั้น (ละเอียดสุด):

---

## 🔍 Pre-flight: หา Supabase Project ของคุณ

1. เปิด https://supabase.com → Login
2. ที่ **Dashboard** จะเห็นโครงการ — VetMock ใช้โครงการชื่ออะไรอยู่? เปิดไป
3. ดู **Project URL** ที่ **Settings → API**:
   ```
   https://abcd1234.supabase.co     ← ตัวนี้
   ```
   จดส่วน `abcd1234` ไว้ — เรียกมันว่า **PROJECT_REF**

4. **Callback URL** ของ Supabase จะเป็น:
   ```
   https://abcd1234.supabase.co/auth/v1/callback
   ```
   → ตัวนี้คือ URL ที่จะใส่ในขั้นตอน LINE / Apple ข้างล่าง

---

## 💚 LINE Login — Setup (ละเอียดทุกคลิก)

### Step 1: สมัคร LINE Developers

1. เปิด https://developers.line.biz/console/ → Login ด้วย LINE account ส่วนตัว
2. กดปุ่ม **+ Create a new provider** (ถ้ายังไม่มี provider)
   - ใส่ชื่อ: `VetMock` (หรืออะไรก็ได้)
   - กด Create
3. ที่หน้า provider → **+ Create a LINE Login channel**

### Step 2: สร้าง LINE Login Channel

ฟอร์มมี ~10 ช่อง — กรอกตามนี้:

| Field | ใส่อะไร |
|---|---|
| **Channel type** | LINE Login (เลือกตอนสร้าง) |
| **Channel name** | `VetMock` |
| **Channel description** | `Veterinary student mock exam app for CU Vet` |
| **App types** | ✅ Web app (ติ๊กเฉพาะ Web ก็พอ) |
| **Region** | เลือกประเทศที่อยู่ — Thailand |
| **Email address** | อีเมลของคุณ (สำหรับ LINE ติดต่อ) |
| **Privacy policy URL** | `https://vetmock.vercel.app/about` (หรือ skip ก่อนได้) |
| **Terms of use URL** | `https://vetmock.vercel.app/about` (skip ได้) |

→ ติ๊กยอมรับ Terms → กด **Create**

### Step 3: หา Channel ID + Channel Secret

1. หลัง create เสร็จ จะเข้า channel page
2. **Tab "Basic settings"**:
   - **Channel ID** = ตัวเลข ~10 หลัก เช่น `2001234567` ← **copy ไว้**
   - **Channel secret** = string ยาว ๆ เช่น `a1b2c3...` ← **copy ไว้**

### Step 4: ใส่ Callback URL ใน LINE Console

1. ไปที่ Tab **"LINE Login"** (ถ้าไม่เห็น → ดูเมนูซ้าย)
2. หา **Callback URL** → กด Edit
3. ใส่ URL ทั้งหมดนี้ (ทีละบรรทัด):
   ```
   https://abcd1234.supabase.co/auth/v1/callback
   ```
   *(เปลี่ยน `abcd1234` เป็น PROJECT_REF ของคุณจาก Pre-flight)*
4. กด Update

5. ต้องเปิด **OpenID Connect** ด้วย:
   - Tab "OpenID Connect" → **Enable**
   - "Email permission" → **Apply** (เพื่อขอ email user) → ส่งฟอร์ม
   - LINE จะ review (อาจรอ ~1-2 วัน) — ระหว่างรอ test ได้แต่จะไม่มี email

### Step 5: ใส่ใน Supabase Dashboard

1. เปิด Supabase Dashboard → โครงการ VetMock
2. **Authentication → Providers** (เมนูซ้าย)
3. หาแถว **Line** → กด toggle เปิด
4. ใส่:
   - **Client ID** = Channel ID จาก LINE (ตัวเลข)
   - **Client Secret** = Channel Secret จาก LINE
5. กด **Save**

### Step 6: ทดสอบ

1. เปิด https://vetmock.vercel.app
2. กด Login → ปุ่ม **💚 เข้าสู่ระบบด้วย LINE**
3. จะ redirect ไป LINE → ยอม → กลับมา VetMock เป็น login state

ถ้าเจอ error:
- `redirect_uri_mismatch` → Callback URL ใน LINE Console ผิด (Step 4)
- `invalid_client` → Channel ID/Secret ใน Supabase ผิด (Step 5)
- `provider not enabled` → Step 5 ลืม toggle

---

## 🍏 Apple Sign-in — Setup (ละเอียดทุกคลิก)

⚠️ **ต้องมี Apple Developer Account ($99/ปี)** — ถ้ายังไม่ซื้อ skip ไปก่อน LINE ก็พอ

### Step 1: สร้าง Services ID ใน Apple Developer

1. เปิด https://developer.apple.com → **Account** → Login
2. ไปที่ **Certificates, Identifiers & Profiles**
3. **Identifiers** → กดเครื่องหมาย ➕
4. เลือก **Services IDs** → Continue
5. กรอก:
   - **Description**: `VetMock Web`
   - **Identifier**: `app.vetmock.web` (reverse-domain แบบใดก็ได้ที่ unique)
6. Continue → Register

### Step 2: เปิด Sign in with Apple

1. คลิก Services ID ที่เพิ่งสร้าง
2. ติ๊ก ✅ **Sign in with Apple** → กด Configure
3. ใส่:
   - **Domains and Subdomains**: `<PROJECT_REF>.supabase.co`
   - **Return URLs**: `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
4. Save → Continue → Save

### Step 3: สร้าง Sign in Key

1. **Keys** → ➕
2. ใส่ชื่อ: `VetMock Apple Sign-in Key`
3. ติ๊ก ✅ **Sign in with Apple** → Configure → เลือก Primary App ID ที่สร้าง (หรือ default)
4. Continue → Register
5. **Download .p8 file** (ดาวน์โหลดได้ครั้งเดียว — เก็บให้ดี)
6. จด **Key ID** (10 ตัวอักษร เช่น `ABCDE12345`)

### Step 4: หา Team ID

1. ที่ Apple Developer Account → ขวาบน คลิกชื่อ
2. **Membership** → **Team ID** = 10 ตัวอักษร

### Step 5: ใส่ใน Supabase

1. Supabase Dashboard → **Authentication → Providers**
2. หา **Apple** → toggle เปิด
3. ใส่:
   - **Client ID (Services ID)** = `app.vetmock.web` จาก Step 1
   - **Team ID** = จาก Step 4
   - **Key ID** = จาก Step 3
   - **Private Key** = เปิดไฟล์ `.p8` ด้วย text editor → copy ทั้งหมดรวม `-----BEGIN PRIVATE KEY-----` และ `-----END PRIVATE KEY-----` → paste
4. Save

### Step 6: ทดสอบ

เหมือน LINE — กด **🍏 เข้าสู่ระบบด้วย Apple** → ดู redirect

---

## 🤔 ถ้ายังเปิดไม่ได้ / งงตรงไหน

### Quick checklist
- [ ] PROJECT_REF ใน URL ตรงกับ Supabase Dashboard?
- [ ] Callback URL ใส่ครบทั้งใน LINE Console และ Apple Services ID?
- [ ] Provider เปิดใน Supabase แล้ว (toggle เป็น "Enabled")?
- [ ] Saved แล้ว (กดปุ่ม Save ตอนใส่ credentials)?

### Test แต่ละ provider แยก
- เปิด VetMock → Login → กดปุ่ม Google ก่อน (test ว่า Google ใช้ได้ปกติ → ยืนยัน Supabase auth ปกติ)
- ถ้า Google ใช้ได้ → LINE/Apple ที่ไม่ได้ คือ provider config issue
- ถ้า Google ก็ไม่ได้ → Supabase project ทั้ง project มีปัญหา (network/keys)

### Logs ดู
- Supabase Dashboard → **Auth → Logs** (ดู error real-time)
- Browser DevTools → Console + Network tab

ถ้ายังงง — capture screen + ส่ง error message ผ่าน feedback form ได้ครับ

---

## ⏭️ ที่ทำแล้วใน frontend code

- ✅ ปุ่ม LINE (สีเขียว #06C755 brand)
- ✅ ปุ่ม Apple (สีดำ + Apple logo SVG)
- ✅ Helper `signInWithLine()` / `signInWithApple()` ใน `src/lib/supabase.js`
- ✅ Friendly error message ภาษาไทยถ้า provider ไม่เปิด
- ✅ `migrateLocalToCloud()` ทำงานหลัง signup ทันที (รวม OAuth signup ผ่าน redirect callback)

จะใช้งานได้จริงเมื่อ Palm setup Supabase Dashboard ตามขั้นข้างบน
