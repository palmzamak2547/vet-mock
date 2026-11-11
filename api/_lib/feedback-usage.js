// ============================================================
// feedback-usage.js — the counter behind "ใช้ feature นี้เท่าไหร่ กี่คน"
// ============================================================
// /api/send-feedback writes ONE row per send attempt it saw, so the
// back-office can show cumulative usage. The table holds counts, never
// content: the feedback type, the outcome, and two keyed fingerprints
// (optional reply email, client IP) so "กี่คน" can be answered without
// storing who. The email already reaches the owner's inbox through Resend;
// a fingerprint here is strictly less exposure, and the row builder takes
// its environment so the unit suite can pin the shape.
//
// A fingerprint is an HMAC-SHA256 under a server-only key, never a bare
// hash: an IPv4 address has 2^32 values and a student address is the
// student ID at a known domain, so a bare SHA-256 of either falls to a sweep
// of every candidate, and a dump of the table would name who sent what. The
// key is FEEDBACK_HASH_KEY when set, else one derived from RESEND_API_KEY,
// which lives in Vercel and not in the database that holds the rows; the
// service-role key, which can read the rows, is never the key to them.
// With neither, the fingerprint is null and the attempt still counts.
// ============================================================

import { createHash, createHmac } from 'node:crypto';

function fingerprintKey(env) {
  const own = String(env.FEEDBACK_HASH_KEY || '').trim();
  if (own) return own;
  const mailer = String(env.RESEND_API_KEY || '').trim();
  if (!mailer) return null;
  return createHash('sha256').update(`vetmock-feedback-usage:${mailer}`).digest();
}

/**
 * HMAC-SHA256 of a trimmed value under the server's fingerprint key, or null
 * when there is nothing to fingerprint or no key to do it with.
 */
export function fingerprint(value, { env = process.env } = {}) {
  const v = String(value || '').trim();
  if (!v) return null;
  const key = fingerprintKey(env);
  if (!key) return null;
  return createHmac('sha256', key).update(v).digest('hex');
}

/**
 * One log row. `sample` is { type, fromEmail, ip } as the handler saw it;
 * `outcome` is one of the outcomes the table's check constraint accepts.
 */
export function feedbackUsageRow(sample, outcome, { env = process.env } = {}) {
  const type = String(sample?.type || 'Feedback').slice(0, 50).trim() || 'Feedback';
  return {
    feedback_type: type,
    outcome,
    reporter_email_hash: fingerprint(sample?.fromEmail, { env }),
    reporter_ip_hash: fingerprint(sample?.ip, { env }),
  };
}

/**
 * Best-effort insert through PostgREST with the service role. Metrics must
 * never break the send: an unconfigured backend or a failed insert resolves
 * false and the caller carries on. Awaits with a hard timeout instead of
 * floating, because a serverless runtime can freeze the process the moment
 * the response is sent and an unawaited fetch would silently never land.
 */
export async function logFeedbackUsage(row, {
  url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  key = process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  fetch = globalThis.fetch,
} = {}) {
  if (!url || !key) return false;
  try {
    const res = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/feedback_usage_log`, {
      redirect: 'error',
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(1500),
    });
    return res.ok;
  } catch {
    return false;
  }
}
