// ============================================================
// ai-grade.js — frontend helper for /api/grade-summary
// ============================================================
// Calls the AI-grading serverless function and returns the
// structured result. Handles timeout + graceful fallback.
//
// Returns:
//   { ok: true, grading: {...} }
//   { ok: false, error: 'message', hint?: 'message' }
// ============================================================

import { thaiError } from './errors.js';

const TIMEOUT_MS = 60_000; // AI calls can take 10-30s; allow up to 60s

// SmartGrader prints `error` and then `hint` verbatim. The server's own
// `error` field is English and meant for logs ("Internal error", "Unknown
// question"), so the sentence a student reads is chosen here from the status
// alone, and a hint is passed on only when it is Thai.
const FAILED = 'ตรวจคำตอบอัตโนมัติไม่สำเร็จ ลองอีกครั้ง';
const TIMED_OUT = 'ตรวจคำตอบหมดเวลา ลองใหม่อีกครั้ง';
const NOT_READY = 'ตรวจคำตอบอัตโนมัติยังไม่พร้อม ลองใหม่ภายหลังหรือประเมินตามเกณฑ์ด้วยตัวเอง';
const NOT_GRADEABLE = 'ข้อนี้ยังตรวจคำตอบอัตโนมัติไม่ได้';

const thaiHint = (hint) => (typeof hint === 'string' && /[ก-๙]/.test(hint) ? hint : undefined);

function waitMessage(seconds) {
  const n = Math.ceil(Number(seconds));
  if (!Number.isFinite(n) || n <= 0) return 'ใช้บ่อยเกินไป รอสักครู่แล้วลองใหม่';
  return n < 60
    ? `ใช้บ่อยเกินไป รอ ${n} วินาทีแล้วลองใหม่`
    : `ใช้บ่อยเกินไป รอ ${Math.ceil(n / 60)} นาทีแล้วลองใหม่`;
}

function failureFor(resp, data) {
  const hint = thaiHint(data?.hint);
  if (resp.status === 429) {
    return { ok: false, error: waitMessage(data?.retryAfter ?? resp.headers?.get?.('Retry-After')) };
  }
  if (resp.status === 503) return { ok: false, error: NOT_READY, hint };
  if (resp.status === 504) return { ok: false, error: TIMED_OUT, hint };
  if (resp.status === 400 || resp.status === 422) return { ok: false, error: NOT_GRADEABLE, hint };
  return { ok: false, error: FAILED, hint };
}

// The question id is all the server needs: it holds the question, the model
// answer and the rubric itself. Sending them from here would let anyone with
// the network tab open post their own key and use this to answer anything.
export async function gradeWithAI({ qid, userAnswer }) {
  if (!userAnswer || !userAnswer.trim()) {
    return { ok: false, error: 'ยังไม่ได้เขียนคำตอบ' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch('/api/grade-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, userAnswer }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      return failureFor(resp, data);
    }

    const grading = await resp.json();
    return { ok: true, grading };
  } catch (err) {
    if (err?.name === 'AbortError') return { ok: false, error: TIMED_OUT };
    return { ok: false, error: thaiError(err, FAILED) };
  } finally {
    clearTimeout(timer);
  }
}
