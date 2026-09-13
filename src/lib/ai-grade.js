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

    if (resp.status === 503) {
      const data = await resp.json().catch(() => ({}));
      return { ok: false, error: 'ตรวจคำตอบอัตโนมัติยังไม่พร้อม ลองใหม่ภายหลังหรือประเมินตามเกณฑ์ด้วยตัวเอง', hint: data.hint };
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
    if (err.name === 'AbortError') {
      return { ok: false, error: 'AI grading หมดเวลา — ลองใหม่ภายหลัง' };
    }
    return { ok: false, error: err.message || 'Network error' };
  } finally {
    clearTimeout(timer);
  }
}
