// ============================================================
// /api/send-feedback.js — Vercel Serverless Function
// Send feedback email via Resend (https://resend.com)
// ============================================================
// Env vars required (set in Vercel Dashboard → Settings → Env):
//   RESEND_API_KEY = re_xxxxxxxxxxxxx
//   FEEDBACK_EMAIL = palmzamak2547@gmail.com
//   SUPABASE_SERVICE_ROLE_KEY (+ SUPABASE_URL) — optional, enables the
//     usage counter the back-office reads (api/_lib/feedback-usage.js)
//   FEEDBACK_HASH_KEY — optional, the key for that counter's fingerprints;
//     without it the key is derived from RESEND_API_KEY
//
// Security:
//   • Rate-limited per member (else per address): 3 per 10 minutes, 10 a day;
//     visitors share 40 of the mailer's 100 a day (FEEDBACK_RATE)
//   • CORS: only known origins (vetmock.com + vetmock.vercel.app + previews + localhost)
//   • Input length capped (subject 200, message 5000 chars)
//   • All HTML output escaped via escapeHtml()
//   • The usage log stores counts and keyed fingerprints only, never the message
// ============================================================

import { sendRateLimitFailure, rateLimit, clientIP, allowedOrigin, limitCaller } from './_lib/rate-limit.js';
import { feedbackUsageRow, logFeedbackUsage } from './_lib/feedback-usage.js';
import { bearerOf, chulaGate } from './_lib/chula-gate.js';
import { readJsonBody, sendBadBody } from './_lib/body.js';

const DAY_MS = 24 * 60 * 60 * 1000;
// Per caller (a member's account, else an address): 3 in 10 minutes, 10 a day.
// The mailer allows 100 a day in all, of which visitors may use 40.
export const FEEDBACK_RATE = { burst: 3, burstMs: 10 * 60 * 1000, daily: 10, provider: 100, visitorShare: 40 };

const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const MAX_NAME = 100;
const MAX_EMAIL = 254; // RFC 5321
const RESEND_TIMEOUT_MS = 10_000;

export function headerText(value, maxLength) {
  return String(value || '')
    .replace(/[\r\n\0]+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (reqOrigin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const body = readJsonBody(req);
  if (!body) return sendBadBody(res);

  // ── Who is counted ──
  // The form is open before sign-in too (ChulaGateView: someone stuck at the
  // wall can still write), so a visitor is counted by address. A signed-in
  // member is counted on their own account (FEEDBACK_RATE), with the address
  // kept as a much higher ceiling, so classmates on one network do not share
  // three messages. A gate that cannot answer leaves the caller a visitor.
  const ip = clientIP(req);
  let gate = null;
  if (bearerOf(req)) {
    try { gate = await chulaGate(req); } catch { gate = null; }
  }
  const member = gate?.ok && gate.userId ? gate : null;
  const burst = await limitCaller(req, member, 'feedback', FEEDBACK_RATE.burst, FEEDBACK_RATE.burstMs);
  const daily = burst.ok ? await limitCaller(req, member, 'feedback-day', FEEDBACK_RATE.daily, DAY_MS) : burst;
  if (!daily.ok) {
    // A limiter outage is not a student at the burst cap: logging it as one
    // filled the admin's usage log with spam that never happened.
    if (!daily.unavailable) await logFeedbackUsage(feedbackUsageRow({ type: body.type, ip }, 'capped_burst'));
    return sendRateLimitFailure(res, daily);
  }

  try {
    const type = headerText(body.type || 'Feedback', 50) || 'Feedback';
    const subject = headerText(body.subject, MAX_SUBJECT);
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
      // 503, not 500: nothing crashed, the mailer is simply not wired up. A
      // 500 was indistinguishable from a genuine fault, so callers offered a
      // "try again" that could never succeed. The reason lets them point at
      // the email escape hatch instead.
      console.error('RESEND_API_KEY not set');
      return res.status(503).json({ error: 'Email service not configured', reason: 'not_configured' });
    }

    // The mailer's daily allowance is the last brake. Visitors draw on a share
    // of it of their own first, so addresses with no account cannot use up
    // what members' messages need.
    let providerBudget = member ? { ok: true } : await rateLimit('provider:resend:daily:visitors', FEEDBACK_RATE.visitorShare, DAY_MS);
    if (providerBudget.ok) providerBudget = await rateLimit('provider:resend:daily', FEEDBACK_RATE.provider, DAY_MS);

    if (providerBudget.unavailable) return sendRateLimitFailure(res, providerBudget);
    if (!providerBudget.ok) {
      res.setHeader('Retry-After', String(providerBudget.retryAfter));
      await logFeedbackUsage(feedbackUsageRow({ type, ip }, 'capped_daily'));
      // Distinct from the per-IP 3-per-10-minutes limit above: this one is
      // platform-wide, so telling the sender to wait ten minutes is wrong.
      return res.status(429).json({ error: 'Daily feedback capacity reached', reason: 'daily_cap', retryAfter: providerBudget.retryAfter });
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

    // Bounded: Resend stalling used to hold the form on "sending" until the
    // platform killed the function, minutes later, with nothing logged.
    let resp;
    try {
      resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Resend's shared sender reaches only the Resend account's own inbox; a
          // verified domain's sender goes in FEEDBACK_FROM (docs/HANDOVER.md, อีเมลแจ้งปัญหา).
          from: process.env.FEEDBACK_FROM || 'VetMock <onboarding@resend.dev>',
          to: [toEmail],
          reply_to: fromEmail || undefined,
          subject: `[VetMock ${type}] ${subject || 'Message from user'}`,
          html: emailHtml,
          text: emailText,
        }),
        signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      });
    } catch (err) {
      console.error('Resend unreachable:', err?.name || err);
      await logFeedbackUsage(feedbackUsageRow({ type, fromEmail, ip }, 'mailer_error'));
      return res.status(502).json({ error: 'mailer_unreachable' });
    }

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Resend error:', resp.status, errText);
      await logFeedbackUsage(feedbackUsageRow({ type, fromEmail, ip }, 'mailer_error'));
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
    await logFeedbackUsage(feedbackUsageRow({ type, fromEmail, ip }, 'sent'));
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
