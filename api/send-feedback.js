// ============================================================
// /api/send-feedback.js — Vercel Serverless Function
// Send feedback email via Resend (https://resend.com)
// ============================================================
// Env vars required (set in Vercel Dashboard → Settings → Env):
//   RESEND_API_KEY = re_xxxxxxxxxxxxx
//   FEEDBACK_EMAIL = palmzamak2547@gmail.com
//
// Security:
//   • Rate-limited: 3 requests per 10 minutes per IP
//   • CORS: only known origins (vetmock.vercel.app + previews + localhost)
//   • Input length capped (subject 200, message 5000 chars)
//   • All HTML output escaped via escapeHtml()
// ============================================================

import { rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';

const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const MAX_NAME = 100;
const MAX_EMAIL = 254; // RFC 5321

export default async function handler(req, res) {
  // ── CORS handling ──
  // Mirror /api/playlist's approach: only reject when Origin IS present
  // but not in allowlist. Some browsers (notably iPad Safari) omit the
  // Origin header on same-origin fetch POST — `if (!origin) → 403` was
  // silently blocking legitimate iPad submits and pushing the form into
  // mailto fallback. Cross-origin POSTs always include Origin, so an
  // attacker page can't bypass — they'll still hit `if (reqOrigin &&
  // !allowed) → 403`.
  const reqOrigin = req.headers.origin;
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  // ── Rate limit: 3 / 10 minutes / IP ──
  const ip = clientIP(req);
  const rl = rateLimit(`feedback:${ip}`, 3, 10 * 60 * 1000);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Too many requests', retryAfter: rl.retryAfter });
  }

  try {
    const body = req.body || {};
    const type = String(body.type || 'Feedback').slice(0, 50);
    const subject = String(body.subject || '').slice(0, MAX_SUBJECT);
    const message = String(body.message || '').slice(0, MAX_MESSAGE);
    let fromEmail = String(body.fromEmail || '').slice(0, MAX_EMAIL).trim();
    const fromName = String(body.fromName || '').slice(0, MAX_NAME);

    if (!message.trim()) return res.status(400).json({ error: 'Message is required' });

    // ── Sanitize fromEmail (iOS autofill quirks) ──
    // iPad/iPhone Contacts autofill often produces "Name <email@host>" or
    // adds stray whitespace. Extract the email and silently drop if it's
    // still not a usable format — the field is optional, no need to fail
    // the whole submission. We only use it for the Resend `reply_to`.
    const angle = fromEmail.match(/<([^>]+)>/);
    if (angle) fromEmail = angle[1].trim();
    if (fromEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
      fromEmail = '';
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.FEEDBACK_EMAIL || 'palmzamak2547@gmail.com';
    if (!apiKey) {
      console.error('RESEND_API_KEY not set');
      return res.status(500).json({ error: 'Email service not configured. Add RESEND_API_KEY in Vercel.' });
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html><body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2b2419; background: #f6efe4;">
        <div style="background: #fdf8ef; border: 1px solid #d8c9a8; border-radius: 16px; padding: 24px;">
          <h2 style="margin: 0 0 16px; color: #4a6b4a;">🐾 VetMock Feedback</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: 600; width: 100px;">Type:</td><td>${escapeHtml(type)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Subject:</td><td>${escapeHtml(subject || '(no subject)')}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">From:</td><td>${escapeHtml(fromName || 'Anonymous')} ${fromEmail ? `&lt;${escapeHtml(fromEmail)}&gt;` : ''}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #888;">IP:</td><td style="font-family: monospace; font-size: 11px; color: #888;">${escapeHtml(ip)}</td></tr>
          </table>
          <hr style="margin: 16px 0; border: none; border-top: 1px dashed #d8c9a8;">
          <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</div>
          <hr style="margin: 16px 0; border: none; border-top: 1px dashed #d8c9a8;">
          <p style="font-size: 12px; color: #5c4f3d; margin: 0;">
            Sent from VetMock · ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}
          </p>
        </div>
      </body></html>
    `;

    const emailText = `VetMock Feedback
Type: ${type}
Subject: ${subject || '(no subject)'}
From: ${fromName || 'Anonymous'}${fromEmail ? ` <${fromEmail}>` : ''}
IP: ${ip}

${message}

---
Sent from VetMock · ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}`;

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'VetMock <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: fromEmail || undefined,
        subject: `[VetMock ${type}] ${subject || 'Message from user'}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Resend error:', resp.status, errText);
      // Surface Resend's error so client can show diagnostic
      let detail = '';
      try {
        const parsed = JSON.parse(errText);
        detail = parsed.message || parsed.error?.message || parsed.name || errText.slice(0, 200);
      } catch {
        detail = errText.slice(0, 200);
      }
      return res.status(502).json({
        error: `Resend ${resp.status}: ${detail}`,
        hint: resp.status === 403
          ? "onboarding@resend.dev only sends to your Resend account email. Verify a domain or check FEEDBACK_EMAIL matches signup email."
          : undefined,
      });
    }
    const data = await resp.json();
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
