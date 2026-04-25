// ============================================================
// /api/send-feedback.js — Vercel Serverless Function
// Send feedback email via Resend (https://resend.com)
// ============================================================
// Env vars required (set in Vercel Dashboard → Settings → Env):
//   RESEND_API_KEY = re_xxxxxxxxxxxxx
//   FEEDBACK_EMAIL = palmzamak2547@gmail.com
// ============================================================

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const { type, subject, message, fromEmail, fromName } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.FEEDBACK_EMAIL || 'palmzamak2547@gmail.com';

    if (!apiKey) {
      console.error('RESEND_API_KEY not set');
      return res.status(500).json({ error: 'Email service not configured. Add RESEND_API_KEY in Vercel.' });
    }

    // Build email content
    const emailHtml = `
      <!DOCTYPE html>
      <html><body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2b2419; background: #f6efe4;">
        <div style="background: #fdf8ef; border: 1px solid #d8c9a8; border-radius: 16px; padding: 24px;">
          <h2 style="margin: 0 0 16px; color: #4a6b4a;">🐾 VetMock Feedback</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: 600; width: 100px;">Type:</td><td>${escapeHtml(type || 'Feedback')}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Subject:</td><td>${escapeHtml(subject || '(no subject)')}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">From:</td><td>${escapeHtml(fromName || 'Anonymous')} ${fromEmail ? `&lt;${escapeHtml(fromEmail)}&gt;` : ''}</td></tr>
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
Type: ${type || 'Feedback'}
Subject: ${subject || '(no subject)'}
From: ${fromName || 'Anonymous'}${fromEmail ? ` <${fromEmail}>` : ''}

${message}

---
Sent from VetMock · ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}`;

    // Send via Resend API
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VetMock <onboarding@resend.dev>',  // Resend's free domain (no domain setup needed)
        to: [toEmail],
        reply_to: fromEmail || undefined,
        subject: `[VetMock ${type || 'Feedback'}] ${subject || 'Message from user'}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error('Resend error:', err);
      return res.status(502).json({ error: 'Failed to send email', detail: err });
    }

    const data = await resp.json();
    return res.status(200).json({ ok: true, id: data.id });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
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
