// ============================================================
// ai/limits.js — who may ask, how often, and how much the day may cost
// ============================================================
// Three counters in the shared limiter (rate-limit.js, Upstash in
// production), checked BEFORE the stream opens so a refusal is an ordinary
// JSON status the page can read:
//
//   per student, burst   IP_BURST (20 per 10 minutes)
//   per student, day     IP_DAY (150 per day)
//   whole feature        AI_CHAT_DAILY_CAP requests per day (default 2,500)
//
// A student is their account behind the Chula wall, else the address: a
// whole class can share one campus address, and keyed by it the 21st
// classmate to ask within ten minutes would be told they ask too fast.
//
// Order matters: the two per-student windows are checked first (together,
// one round trip), the shared budget only after both pass. Checked the other
// way, one script hammering the endpoint would collect 429s while draining
// the day's budget for every student. The limiter counts a call before it
// compares, so a question refused for the burst gives its day count back.
//
// Fails closed, like mochi-voice: when the shared limiter is unreachable in
// production rateLimit() reports `unavailable`, and the chat answers 503
// rather than granting every serverless instance a fresh private budget.
// ============================================================

import { rateLimit, rateRefund } from '../rate-limit.js';
import { IP_BURST, IP_DAY } from './config.js';

export const LIMIT_MESSAGES = Object.freeze({
  burst: 'ถามติดกันเร็วเกินไป รอสักครู่แล้วลองใหม่',
  day: 'วันนี้ใช้ผู้ช่วยครบจำนวนครั้งต่อวันแล้ว ลองใหม่พรุ่งนี้',
  budget: 'วันนี้ผู้ช่วยตอบครบโควตาของทั้งระบบแล้ว ลองใหม่พรุ่งนี้',
  unavailable: 'ระบบจำกัดการใช้งานขัดข้องชั่วคราว ลองใหม่อีกครั้งในไม่ช้า',
});

const refusal = (status, error, message, retryAfter) => ({
  ok: false,
  status,
  body: { error, message, ...(Number.isFinite(retryAfter) && retryAfter > 0 ? { retryAfter: Math.ceil(retryAfter) } : {}) },
});

/**
 * @param {string} who  the student's account id, or `ip:<address>` with no account
 * @returns {Promise<{ ok: true } | { ok: false, status: number, body: object }>}
 */
export async function checkLimits(who, { dailyCap, limiter = rateLimit, refund = rateRefund } = {}) {
  const dayKey = `ai-chat:day:${who}`;
  const [burst, day] = await Promise.all([
    limiter(`ai-chat:burst:${who}`, IP_BURST.max, IP_BURST.winMs),
    limiter(dayKey, IP_DAY.max, IP_DAY.winMs),
  ]);
  // not answered, so not one of the day's questions (a day counter that did not answer is left alone)
  if (!burst.ok && !day.unavailable) await refund(dayKey, IP_DAY.winMs);
  for (const [r, key] of [[burst, 'burst'], [day, 'day']]) {
    if (r.ok) continue;
    return r.unavailable
      ? refusal(503, 'rate', LIMIT_MESSAGES.unavailable, r.retryAfter)
      : refusal(429, 'rate', LIMIT_MESSAGES[key], r.retryAfter);
  }
  const budget = await limiter('ai-chat:daily', dailyCap, 24 * 60 * 60 * 1000);
  if (!budget.ok) {
    return budget.unavailable
      ? refusal(503, 'rate', LIMIT_MESSAGES.unavailable, budget.retryAfter)
      : refusal(503, 'budget', LIMIT_MESSAGES.budget, budget.retryAfter);
  }
  return { ok: true };
}
