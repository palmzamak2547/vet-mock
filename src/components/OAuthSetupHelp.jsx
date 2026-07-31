// ============================================================
// OAuthSetupHelp — modal that surfaces exact dashboard steps when
// LINE / Apple login throws PROVIDER_NOT_CONFIGURED
// ============================================================
//
// Why this exists:
//   When LINE or Apple sign-in errors, the user gets a one-line Thai
//   message ("LINE login ยังไม่เปิด — แอดมินตั้งค่าก่อน"). But the
//   ADMIN (Palm) needs to know:
//     • exact callback URL to whitelist
//     • which dashboards to open (LINE Developer Console / Apple Developer)
//     • what fields to fill in Supabase
//
//   This modal renders those steps inline so Palm can fix it without
//   leaving the running app.
// ============================================================

import { useEffect, useState } from 'react';
import { getOAuthCallbackUrl, getSupabaseProjectUrl } from '../lib/supabase.js';
import { copyText } from '../lib/clipboard.js';

const CHECKLISTS = {
  line: {
    title: '🟢 ตั้งค่า LINE Login (LIFF + Edge Function)',
    intro: 'Supabase ไม่ support LINE provider native — bridge ผ่าน LINE LIFF SDK + Supabase Edge Function ที่ verify LINE JWT แล้ว mint Supabase magic link. setup ครั้งเดียว ใช้ตลอด.',
    steps: [
      {
        n: 1,
        label: 'สร้าง LINE Login Channel',
        body: 'LINE Developers Console → สร้าง Provider (ถ้ายังไม่มี) → "Create a new channel" → **LINE Login** → ตั้งชื่อ "VetMock" → Region: Japan → Scope ติ๊ก openid + profile + email',
        link: { url: 'https://developers.line.biz/console/', text: 'เปิด LINE Developers' },
      },
      {
        n: 2,
        label: 'สร้าง LIFF app ใน Channel',
        body: 'หน้า Channel → tab "LIFF" → "Add" →\n• Endpoint URL: https://vetmock.vercel.app\n• Size: Full\n• Scope: openid profile email\nคัดลอก LIFF ID (รูปแบบ 1234567890-abcdefgh)',
      },
      {
        n: 3,
        label: 'คัดลอก Channel ID',
        body: 'tab "Basic settings" → คัดลอก Channel ID (เลขล้วน) — ไม่ต้องใช้ Channel Secret',
      },
      {
        n: 4,
        label: 'Deploy Supabase Edge Function (line-auth)',
        body: 'CLI:\n  supabase secrets set LINE_CHANNEL_ID=<channel_id>\n  supabase functions deploy line-auth --no-verify-jwt\nโค้ดอยู่ที่ supabase/functions/line-auth/index.ts',
        link: { url: 'https://supabase.com/dashboard/project/_/functions', text: 'เปิด Edge Functions' },
      },
      {
        n: 5,
        label: 'เพิ่ม Vercel env var',
        body: 'Vercel → Project Settings → Environment Variables → เพิ่ม:\n• VITE_LINE_LIFF_ID = <liff_id>\nแล้ว redeploy (push commit ใหม่หรือคลิก Redeploy)',
        link: { url: 'https://vercel.com/dashboard', text: 'เปิด Vercel Dashboard' },
      },
      {
        n: 6,
        label: 'Whitelist redirect URL ใน Supabase',
        body: 'Supabase Dashboard → Authentication → URL Configuration → เพิ่ม Redirect URLs:\n• https://vetmock.vercel.app\n• http://localhost:5173',
        link: { url: 'https://supabase.com/dashboard/project/_/auth/url-configuration', text: 'เปิด URL Configuration' },
      },
    ],
  },
  discord: {
    title: '💜 ตั้งค่า Discord Login',
    intro: 'Discord เป็น native provider ของ Supabase — setup เร็ว 5 นาที ฟรี ไม่ต้อง verify อะไรเพิ่ม.',
    steps: [
      {
        n: 1,
        label: 'สร้าง Discord Application',
        body: 'เปิด Discord Developer Portal → "New Application" → ตั้งชื่อ "VetMock" → ยอมรับ ToS → Create',
        link: { url: 'https://discord.com/developers/applications', text: 'เปิด Discord Developer Portal' },
      },
      {
        n: 2,
        label: 'Copy Client ID + Client Secret',
        body: 'หน้า Application → tab "OAuth2" → คัดลอก **Client ID** และคลิก "Reset Secret" → คัดลอก **Client Secret** (เห็นแค่ครั้งเดียว — เก็บไว้ใน notes)',
      },
      {
        n: 3,
        label: 'Whitelist redirect URL ใน Discord',
        body: 'OAuth2 → Redirects → "Add Redirect" → วาง URL ด้านล่าง → Save Changes',
        copyable: 'CALLBACK_URL',
      },
      {
        n: 4,
        label: 'เปิด Discord provider ใน Supabase',
        body: 'Supabase Dashboard → Authentication → Providers → Discord → toggle ON → วาง Client ID + Client Secret → Save',
        link: { url: 'https://supabase.com/dashboard/project/_/auth/providers', text: 'เปิด Supabase Auth Providers' },
      },
      {
        n: 5,
        label: 'Verify Supabase Redirect URLs',
        body: 'Supabase Dashboard → Authentication → URL Configuration → ตรวจว่ามี:\n• https://vetmock.vercel.app/**\n• http://localhost:5173/**\nใน Redirect URLs (ถ้าไม่มีให้เพิ่ม)',
        link: { url: 'https://supabase.com/dashboard/project/_/auth/url-configuration', text: 'เปิด URL Configuration' },
      },
    ],
  },
};

export default function OAuthSetupHelp({ provider, rawError, onClose }) {
  const [copied, setCopied] = useState(null);
  const callbackUrl = getOAuthCallbackUrl();
  const projectUrl = getSupabaseProjectUrl();
  const checklist = CHECKLISTS[provider];

  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

  const handleCopy = async (text, key) => {
    const result = await copyText(text);
    if (result.ok) {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  if (!checklist) {
    return (
      <div className="vmx-modal-overlay" onClick={onClose}>
        <div className="vmx-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
          <h2>OAuth setup</h2>
          <p>ไม่รู้จัก provider: {provider}</p>
          <button className="vmx-btn vmx-btn-primary" onClick={onClose}>ปิด</button>
        </div>
      </div>
    );
  }

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={checklist.title}
        style={{
          maxWidth: 620,
          maxHeight: 'min(92vh, calc(100dvh - 24px))',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            OAuth setup
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>{checklist.title}</h2>
          <p style={{ fontSize: 12, color: 'var(--clr-ink-soft)', margin: '6px 0 0', lineHeight: 1.5 }}>
            ต้องตั้งค่าใน 2 dashboard: ฝั่ง provider ({provider === 'line' ? 'LINE Developers' : 'Apple Developer'}) และ Supabase. ทำตามลำดับด้านล่าง ตั้งครั้งเดียว ใช้ตลอด.
          </p>
        </div>

        {/* Raw error from Supabase (for debugging) */}
        {rawError && (
          <details style={{ marginBottom: 14, padding: 10, borderRadius: 10, background: 'rgba(192, 109, 109, 0.08)', border: '1px solid var(--clr-rose)', fontSize: 12 }}>
            <summary style={{ cursor: 'pointer', color: 'var(--clr-rose-text)', fontWeight: 600 }}>
              🐛 ดู error จริงจาก Supabase
            </summary>
            <div style={{ marginTop: 6, fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {rawError}
            </div>
          </details>
        )}

        {/* Callback URL — always shown, copyable */}
        {callbackUrl && (
          <div style={{
            marginBottom: 18,
            padding: 14,
            borderRadius: 12,
            background: 'rgba(74, 107, 74, 0.08)',
            border: '1px solid var(--clr-sage)',
          }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-sage)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Callback URL (วางทุกที่ที่ใช้)
            </div>
            <div style={{
              marginTop: 6,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'var(--clr-surface-2)',
              fontFamily: 'var(--vmx-mono)',
              fontSize: 12,
              color: 'var(--clr-ink)',
              wordBreak: 'break-all',
              lineHeight: 1.5,
            }}>
              {callbackUrl}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(callbackUrl, 'CALLBACK_URL')}
              className="vmx-btn vmx-btn-ghost vmx-btn-sm"
              style={{ marginTop: 8, minHeight: 36 }}
            >
              {copied === 'CALLBACK_URL' ? '✓ คัดลอกแล้ว' : 'คัดลอก URL'}
            </button>
          </div>
        )}

        {/* Numbered steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {checklist.steps.map((step) => (
            <div
              key={step.n}
              style={{
                padding: 12,
                borderRadius: 10,
                background: 'var(--clr-surface)',
                border: '1px solid var(--clr-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{
                  flex: '0 0 auto',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--clr-sage)',
                  color: 'var(--clr-bg)',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--vmx-mono)',
                }}>
                  {step.n}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--clr-ink)' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 4, lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                    {step.body}
                  </div>
                  {step.link && (
                    <a
                      href={step.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: 8,
                        fontSize: 12,
                        color: 'var(--clr-sage)',
                        textDecoration: 'underline',
                      }}
                    >
                      ↗ {step.link.text}
                    </a>
                  )}
                  {step.copyable === 'CALLBACK_URL' && (
                    <div style={{ marginTop: 6, fontSize: 11, color: 'var(--clr-gold-text)', fontStyle: 'italic' }}>
                      ↑ ใช้ URL ที่กล่องสีเขียวด้านบน
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project URL footer */}
        {projectUrl && (
          <div style={{
            marginTop: 14,
            fontSize: 11,
            color: 'var(--clr-ink-soft)',
            fontFamily: 'var(--vmx-mono)',
            wordBreak: 'break-all',
          }}>
            Project: {projectUrl}
          </div>
        )}

        <div className="vmx-btn-row" style={{ marginTop: 18, justifyContent: 'flex-end' }}>
          <button className="vmx-btn vmx-btn-primary" onClick={onClose} type="button" style={{ minHeight: 44 }}>
            เสร็จ
          </button>
        </div>
      </div>
    </div>
  );
}
