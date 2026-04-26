# 📧 Supabase Email Templates

Custom HTML templates for emails Supabase sends from your project.
Branded to match VetMock — sage / cream / Fraunces / paw — and built
to render correctly across Gmail, Apple Mail, Outlook (web + desktop),
iOS Mail, and Thunderbird.

## Files

| File | Supabase template slot | When it fires |
|---|---|---|
| `reset-password.html` | **Reset Password** | User clicks "ลืมรหัสผ่าน" + submits email |
| `confirm-signup.html` | **Confirm signup** | New signup, only when project has email confirmation ON |
| `magic-link.html` | **Magic Link** | Passwordless login via signInWithOtp (UI not exposed yet) |

## How to apply

1. **Supabase Dashboard** → your project
2. Sidebar: **Authentication** → **Email Templates**
3. Pick the template (e.g. **"Reset Password"**)
4. Copy-paste the HTML from the matching file in this folder into the **Body (HTML)** field
5. (Optional) Update **Subject** too — suggested:
   - Reset Password: `🔐 รีเซ็ตรหัสผ่าน VetMock`
   - Confirm signup: `🐾 ยืนยันอีเมล — ยินดีต้อนรับสู่ VetMock`
   - Magic Link: `✨ ลิงก์ Login VetMock ของคุณ`
6. Click **Save changes**

## Supabase template variables used

| Variable | What it becomes |
|---|---|
| `{{ .ConfirmationURL }}` | The signed magic link Supabase generates per email — the only thing the user actually needs to click |
| `{{ .SiteURL }}` | Your project's Site URL setting |
| `{{ .Email }}` | The recipient's email |

## Design rules followed

- **Inline styles only** — most clients strip `<style>` blocks
  (we keep one `<style>` for `@media` queries; clients that ignore
  it just render the inline defaults — no breakage)
- **Table-based layout** — flexbox/grid is unreliable in email
- **Light + dark mode** — `prefers-color-scheme` for clients that
  honor it (Apple Mail, modern Gmail, Outlook web)
- **Responsive** — `@media (max-width: 600px)` shrinks padding +
  font sizes for mobile
- **Web fonts via `@import`** — Fraunces + IBM Plex Sans Thai;
  falls back gracefully to system fonts in clients that block them
- **Big, single CTA** — "ตั้งรหัสผ่านใหม่" rounded pill in sage
- **Fallback URL block** — for clients/users who can't click
  the styled button
- **Security note** — gold-bordered callout reassuring users who
  didn't request the reset

## Future templates (not yet created)

Open if you want me to write these in the same style:

- `email-change.html` — when user changes their email (no UI yet)
- `invite.html` — for team/org invites (not used in VetMock yet)
