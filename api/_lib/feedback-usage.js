// ============================================================
// feedback-usage.js — the counter behind "ใช้ feature นี้เท่าไหร่ กี่คน"
// ============================================================
// /api/send-feedback writes ONE row per send attempt it saw, so the
// back-office can show cumulative usage. The table holds counts, never
// content: the feedback type, the outcome, and two SHA-256 fingerprints
// (optional reply email, client IP) so "กี่คน" can be answered without
// storing who. The email already reaches the owner's inbox through Resend;
// a fingerprint here is strictly less exposure, and the row builder is pure
// so the unit suite can pin the shape.
// ============================================================

import { createHash } from 'node:crypto';

/** SHA-256 of a trimmed value, or null when there is nothing to fingerprint. */
export function fingerprint(value) {
  const v = String(value || '').trim();
  if (!v) return null;
  return createHash('sha256').update(v).digest('hex');
}

/**
 * One log row. `sample` is { type, fromEmail, ip } as the handler saw it;
 * `outcome` is one of the outcomes the table's check constraint accepts.
 */
export function feedbackUsageRow(sample, outcome) {
  const type = String(sample?.type || 'Feedback').slice(0, 50).trim() || 'Feedback';
  return {
    feedback_type: type,
    outcome,
    reporter_email_hash: fingerprint(sample?.fromEmail),
    reporter_ip_hash: fingerprint(sample?.ip),
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
