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

const TIMEOUT_MS = 60_000; // AI calls can take 10-30s; allow up to 60s

export async function gradeWithAI({
  type,           // 'essay' | 'short'
  passage,        // string (optional but recommended)
  question,       // string (the prompt the student answered)
  userAnswer,     // string (student's response)
  modelAnswer,    // string (KEY from textbook)
  rubric,         // string (marking criteria)
  targetWords,    // number (essay only)
  softMaxWords,   // number (essay only)
  hardMaxWords,   // number (essay only)
}) {
  if (!userAnswer || !userAnswer.trim()) {
    return { ok: false, error: 'ยังไม่ได้เขียนคำตอบ' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch('/api/grade-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type, passage, question, userAnswer, modelAnswer, rubric,
        targetWords, softMaxWords, hardMaxWords,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (resp.status === 503) {
      // AI not configured — let the UI suggest self-grade
      const data = await resp.json().catch(() => ({}));
      return { ok: false, error: 'AI grading ยังไม่ได้ตั้งค่า', hint: data.hint };
    }

    if (resp.status === 429) {
      const data = await resp.json().catch(() => ({}));
      return { ok: false, error: `รอสักครู่ก่อนลองใหม่ — เกินโควตา (retry in ${data.retryAfter}s)` };
    }

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      return { ok: false, error: data.error || `HTTP ${resp.status}`, hint: data.hint };
    }

    const grading = await resp.json();
    return { ok: true, grading };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      return { ok: false, error: 'AI grading หมดเวลา — ลองใหม่ภายหลัง' };
    }
    return { ok: false, error: err.message || 'Network error' };
  }
}
