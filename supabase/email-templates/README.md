# 📧 VetMock Email Templates

Custom Supabase email templates for VetMock auth flows.

## 📋 What's here

| File | Supabase template name | Trigger |
|---|---|---|
| `01-magic-link.html` | **Magic Link** | User requests passwordless login (`signInWithOtp`) |
| `02-confirm-signup.html` | **Confirm signup** | New signup needs email verification |
| `03-reset-password.html` | **Reset Password** | User clicks "ลืมรหัสผ่าน" (`resetPasswordForEmail`) |
| `04-change-email.html` | **Change Email Address** | User changes email in Account Settings (`updateUser({email})`) |
| `05-reauthentication.html` | **Reauthentication** | OTP for sensitive actions (rare — uses `{{ .Token }}` not URL) |

---

## 🎨 Design

**Brand identity:**
- Sage green CTA buttons (`#4a6b4a`) — matches VetMock palette
- Warm cream background (`#faf7f0`) — easy on eyes
- Fraunces serif headings, system sans body
- Gradient header bar with 🩺 wordmark
- Card-style layout (centered, max 560px)

**Email-client compatibility:**
- Table-based outer layout (works in Outlook, Gmail, Apple Mail)
- Inline CSS only (no `<style>` blocks)
- System font stack (no Google Fonts dependency)
- Light-mode optimized · Gmail dark mode auto-inverts colors gracefully

**Accessibility:**
- Hidden preheader text (preview in inbox)
- Fallback "copy this link" for unclickable buttons
- Clear "wasn't you?" security disclaimer in every template

---

## 🚀 How to apply (one-time setup)

### 1. Login to Supabase Dashboard
Go to https://supabase.com/dashboard → select VetMock project.

### 2. Navigate to Email Templates
Sidebar: **Authentication** → **Email Templates**

### 3. For each template:

**Step A** — Open one of the 5 HTML files in a text editor:
```
supabase/email-templates/01-magic-link.html
```

**Step B** — Copy the **entire file contents** (Ctrl+A, Ctrl+C)

**Step C** — In Supabase, click the matching template name from the table above
- Switch to the **Source** view (toggle "HTML" or "Code")
- Paste the HTML
- Edit the **Subject** field (suggested below)
- Click **Save**

### 4. Suggested subject lines

| Template | Subject |
|---|---|
| Magic Link | `✨ ลิงก์เข้าสู่ระบบ VetMock` |
| Confirm signup | `🎉 ยินดีต้อนรับสู่ VetMock — ยืนยันอีเมล` |
| Reset Password | `🔑 รีเซ็ตรหัสผ่าน VetMock` |
| Change Email | `📧 ยืนยันอีเมลใหม่ของคุณ` |
| Reauthentication | `🔐 รหัสยืนยัน VetMock: {{ .Token }}` |

---

## 🧪 Testing

After saving each template:

1. **Magic Link** — go to vetmock.vercel.app → Login → "✨ Login ผ่านลิงก์ในอีเมล" → enter email → check inbox
2. **Confirm signup** — sign up with a new email → check inbox
3. **Reset Password** — click "ลืมรหัสผ่าน?" on login → check inbox
4. **Change Email** — Account Settings → Change email → check NEW email inbox
5. **Reauthentication** — only triggers on certain MFA flows; can skip testing

Send test to your own inbox first. Check on:
- Gmail (web + mobile)
- Apple Mail (iOS)
- Outlook web (worst-case CSS support)
- Dark mode if your client supports it

---

## 🔧 Available Supabase template variables

You can use these in any template:

| Variable | Description |
|---|---|
| `{{ .ConfirmationURL }}` | Action link (verify / login / reset) — primary CTA |
| `{{ .Token }}` | 6-digit OTP code (alternative to URL) |
| `{{ .TokenHash }}` | Hashed token (advanced — for custom flows) |
| `{{ .SiteURL }}` | Your configured site URL (`vetmock.vercel.app`) |
| `{{ .Email }}` | User's email address |
| `{{ .RedirectTo }}` | Redirect URL after action |
| `{{ .Data }}` | User metadata (e.g., `{{ .Data.username }}`) |

> ⚠️ **Don't include unescaped user input** in HTML — Supabase auto-escapes,
> but be careful with `{{ .Data.* }}` if you ever store HTML in metadata.

---

## 🎯 Why these templates exist

**Default Supabase emails are generic and English-only:**
> "Click here to confirm your email"

**Our custom templates:**
- Thai-first (matches user base — Vet 86 students at Chula)
- Branded (VetMock visual identity)
- Friendly tone ("ขอบคุณที่สมัคร" instead of "Welcome")
- Helpful security context ("ไม่ได้สมัคร? อาจมีคนใช้ email คุณ")
- Promote features in welcome email (mention 1700 Qs, SR, video summaries)
- Cross-link to Account Settings + Feedback page in footer

---

## 🔄 Updating templates later

When you change a template:
1. Edit the HTML file in this repo (commits show what changed)
2. Re-paste into Supabase dashboard (no automated sync — Supabase doesn't expose a public API for email templates)

To partially automate: the [Supabase Management API](https://supabase.com/docs/reference/api/v1-update-a-project-config) does support config updates with a Personal Access Token, but it's overkill for 5 templates that change rarely.

---

## 📚 References

- [Supabase Email Templates docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email client CSS support (caniemail.com)](https://www.caniemail.com)
- [Litmus email design guide](https://www.litmus.com/blog/email-design)

---

*Last updated: 2026-04-30 · 5 templates designed for VetMock v5.x*
