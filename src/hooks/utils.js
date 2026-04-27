// Shared utility functions

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const fmtDate = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(ts);
  compareDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round((compareDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'วันนี้';
  if (diffDays === 1) return 'พรุ่งนี้';
  if (diffDays === -1) return 'เมื่อวาน';
  if (diffDays > 0) return `อีก ${diffDays} วัน`;
  return `${Math.abs(diffDays)} วันที่แล้ว`;
};

export const isCorrect = (q, ua) => {
  if (ua === null || ua === undefined) return false;
  if (q.type === 'mcq' || q.type === 'tf') return ua === q.answer;
  if (q.type === 'fill') {
    if (!Array.isArray(ua)) return false;
    return q.blanks.every((b, i) => {
      const u = (ua[i] || '').toLowerCase().trim();
      const bl = b.toLowerCase().trim();
      return u === bl || (u.length > 2 && (u.includes(bl) || bl.includes(u)));
    });
  }
  if (q.type === 'match') {
    if (!ua || typeof ua !== 'object') return false;
    return q.pairs.every((p, i) => ua[i] === p.right);
  }
  if (q.type === 'short') {
    // Loose keyword match — q.keywords is an array of strings/phrases
    // student needs to mention. ≥75% coverage = "correct" (heuristic).
    // Stricter graders should self-assess in Review.
    if (typeof ua !== 'string' || !ua.trim()) return false;
    const text = ua.toLowerCase();
    const keys = Array.isArray(q.keywords) ? q.keywords : [];
    if (keys.length === 0) return false; // ungraded — Review will self-assess
    const hit = keys.filter((k) => text.includes(String(k).toLowerCase())).length;
    return hit / keys.length >= 0.75;
  }
  if (q.type === 'essay') {
    // Open-ended writing — never auto-correct. ReviewView shows the
    // model answer + rubric so the student self-assesses.
    return false;
  }
  return false;
};

// True if the question requires human / self-assessment for grading
// (vs the deterministic types above). Used by ReviewView to render
// a "self-assess" UI instead of the rigid "✓ ถูก / ✗ ผิด" badge.
export const isOpenEnded = (q) => q?.type === 'essay' || (q?.type === 'short' && (!q.keywords || q.keywords.length === 0));

// True if the question is a writing-style question (short answer or
// essay). Used to (a) allocate longer per-question time, (b) trigger
// a confirm dialog when skipping blank answers, (c) exclude from the
// auto-graded percentage in ResultsView.
export const isWritingType = (q) => q?.type === 'essay' || q?.type === 'short';

// Per-question time allocation. The Final exam is 2 hours for ~20
// short answers + 1 essay (~5 min/short + ~25 min/essay), so when
// the user sets a base time-per-question we scale it for writing
// types so a 60-second-per-MCQ default doesn't cripple the essay.
//   MCQ / T/F / fill / match → user's base value (e.g., 60s)
//   short                    → max(base × 3, 180s = 3 min)
//   essay                    → max(base × 25, 1500s = 25 min)
// Returns 0 if the user disabled the timer entirely.
export function timeForQuestion(q, baseSeconds) {
  if (!baseSeconds || baseSeconds <= 0) return 0;
  if (!q) return baseSeconds;
  if (q.type === 'essay') return Math.max(baseSeconds * 25, 25 * 60);
  if (q.type === 'short') return Math.max(baseSeconds * 3, 3 * 60);
  return baseSeconds;
}

// Categorize a question for the ConfigView type-filter chip.
//   'mcq'     = auto-graded (mcq, tf, fill, match)
//   'writing' = open-ended (short, essay)
export function questionCategory(q) {
  if (!q?.type) return 'mcq';
  return (q.type === 'short' || q.type === 'essay') ? 'writing' : 'mcq';
}

// Check if today is a new study day (for streak)
export function updateStreak(lastStudyDate, currentStreak) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  if (!lastStudyDate) return { streak: 1, lastDate: todayTs };

  const last = new Date(lastStudyDate);
  last.setHours(0, 0, 0, 0);
  const diff = Math.round((todayTs - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return { streak: currentStreak, lastDate: lastStudyDate }; // Same day
  if (diff === 1) return { streak: currentStreak + 1, lastDate: todayTs }; // Next day
  return { streak: 1, lastDate: todayTs }; // Gap — reset streak
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
