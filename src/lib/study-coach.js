// ============================================================
// study-coach.js — client for /api/study-coach
// ============================================================
// Three study aids share one endpoint and one failure policy: none of them is
// load-bearing. The question still shows its own explanation, the results
// screen still shows its own numbers, the summary is still readable. So when
// this fails the caller shows nothing rather than an apology, and when the
// server declines to answer (`blocked`) that is a normal outcome, not an
// error — it means the guards caught something and we would rather say
// nothing than say something unverified.
// ============================================================

const TIMEOUT_MS = 40_000;

async function ask(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch('/api/study-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      if (resp.status === 429) return { ok: false, reason: 'rate' };
      if (resp.status === 503) return { ok: false, reason: data.reason === 'budget' ? 'budget' : 'off' };
      if (resp.status === 504) return { ok: false, reason: 'timeout' };
      return { ok: false, reason: 'error' };
    }
    if (data.blocked) return { ok: false, reason: 'blocked' };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, reason: err?.name === 'AbortError' ? 'timeout' : 'error' };
  } finally {
    clearTimeout(timer);
  }
}

/** Why the option a student picked was tempting. `chosen` is the ORIGINAL
 *  option index (what `answers[q.id]` stores), or the boolean for a T/F. */
export function explainMiss({ qid, chosen }) {
  return ask({ mode: 'miss', qid: String(qid), chosen });
}

/** Mistake patterns across one session's wrong answers. */
export function reviewMisses(items) {
  return ask({ mode: 'review', items });
}

/** Recall questions drawn from one lecture summary. */
export function recallFromLecture(videoId) {
  return ask({ mode: 'recall', videoId });
}

// One sentence per failure, in the student's language, for the rare case a
// caller wants to say why nothing appeared. Deliberately never blames them.
export const COACH_MESSAGE = {
  rate: 'ขอพักสักครู่แล้วลองใหม่อีกครั้ง',
  budget: 'โควตาของวันนี้เต็มแล้ว พรุ่งนี้ใช้ได้ตามปกติ',
  off: 'ตอนนี้ยังใช้ไม่ได้',
  blocked: 'รอบนี้ยังสรุปให้ไม่ได้แบบที่มั่นใจ เลยขอไม่เดา',
  timeout: 'ใช้เวลานานเกินไป ลองอีกครั้งได้',
  error: 'ลองอีกครั้งได้',
};

// About a third of the bank's explanations carry a section that goes through
// the wrong options one at a time. Where one exists the student already has a
// per-option account three lines up, and offering to write another is noise
// that also spends the day's budget on a paraphrase.
const WALKS_THE_DISTRACTORS = /ทำไมข้อ(?:อื่น|นี้)?ผิด|ข้ออื่นผิด|ตัวเลือกอื่นผิด/;

/** Whether the bank's own explanation already accounts for this option —
 *  either by having that section, or by quoting the option outright. */
export function alreadyExplained(explain, option) {
  const flat = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
  const text = flat(explain);
  const opt = flat(option);
  if (!text) return false;
  if (WALKS_THE_DISTRACTORS.test(text)) return true;
  if (opt.length < 6) return false;
  return text.includes(opt.length > 24 ? opt.slice(0, 24) : opt);
}
