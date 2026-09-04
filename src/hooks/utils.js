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
      if (u === bl) return true;
      if (u.length < 3) return false;
      // Writing MORE than the key is fine: "the lateral condyle" still names
      // the lateral condyle.
      if (u.includes(bl)) return true;
      // Writing LESS used to be fine too, and that was the bug: any three
      // characters of the key scored full marks. Measured on the corpus,
      // 36 of 60 blanks accepted their own first three letters — "lat" for
      // lateral condyle, "vas" for vastus lateralis, "ตับ" for ตับอ่อน,
      // which is a different organ. A fragment is not an answer.
      //
      // Short-of-the-key is still allowed when it covers most of it, so a
      // student who drops a qualifier ("reticuloperitonitis" for
      // "traumatic reticuloperitonitis") is not punished for it.
      return bl.includes(u) && u.length >= bl.length * 0.6;
    });
  }
  if (q.type === 'match') {
    if (!ua || typeof ua !== 'object') return false;
    // รองรับทั้ง object {0:right} (เดิม) และ array [right, ...]
    const get = (i) => Array.isArray(ua) ? ua[i] : ua[i];
    return q.pairs.every((p, i) => get(i) === p.right);
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

// คะแนนแบบบางส่วนสำหรับจับคู่ — ใช้ใน ResultsView/ReviewView (ข้อ B: partial credit + distractors)
export function matchScore(q, ua) {
  if (!q || q.type !== 'match' || !ua || typeof ua !== 'object') return { correct: 0, total: q?.pairs?.length || 0, fraction: 0 };
  const total = q.pairs.length;
  if (total === 0) return { correct: 0, total: 0, fraction: 0 };
  let correct = 0;
  for (let i = 0; i < total; i++) {
    const val = Array.isArray(ua) ? ua[i] : ua[i];
    if (val != null && val !== '' && val === q.pairs[i].right) correct++;
  }
  return { correct, total, fraction: correct / total };
}

export function matchIsPartialCorrect(q, ua) {
  const s = matchScore(q, ua);
  return s.correct > 0 && s.correct < s.total;
}

// True if the question requires human / self-assessment for grading
// (vs the deterministic types above). Used by ReviewView to render
// a "self-assess" UI instead of the rigid "✓ ถูก / ✗ ผิด" badge.
export const isOpenEnded = (q) => q?.type === 'essay' || (q?.type === 'short' && (!q.keywords || q.keywords.length === 0));

// True if the question is a writing-style question (short answer or
// essay). Used to (a) allocate longer per-question time, (b) trigger
// a confirm dialog when skipping blank answers, (c) exclude from the
// auto-graded percentage in ResultsView.
export const isWritingType = (q) => q?.type === 'essay' || q?.type === 'short';

/**
 * Did the student actually answer this, as opposed to leaving a value behind?
 *
 * Clearing an answer does not delete the key: emptying an essay stores '',
 * and MatchDragDrop's "ล้างทั้งหมด" stores {}. Every count in ExamView asked
 * `answers[q.id] !== undefined`, which both of those pass — so the
 * submit-confirm reported cleared questions as answered and, because it
 * derived "remaining" from that, suppressed its own "you left N blank"
 * warning at the exact moment it was needed. useExamSession and ResultsView
 * already knew better and checked for blankness; this is that same rule, in
 * one place, so the screens cannot drift apart again.
 */
export const isAnswered = (ua) => {
  if (ua === undefined || ua === null) return false;
  if (typeof ua === 'string') return ua.trim().length > 0;
  // Match questions store a pair map; an empty one is a cleared question.
  if (typeof ua === 'object') return Object.keys(ua).length > 0;
  return true; // numbers (MCQ index, including 0) and booleans (true/false)
};

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
  if (q.type === 'match') {
    // จับคู่ใช้เวลามากกว่า MCQ ตามจำนวนคู่ + ตัวลวง (timed mode)
    // base 60s + 15s ต่อคู่ (ceil 5 คู่ ~ 135s) เพื่อไม่ให้ timed mock กดดันเกิน
    const n = Array.isArray(q.pairs) ? q.pairs.length : 0;
    const extra = Array.isArray(q.distractors) ? q.distractors.length : 0;
    const perPair = 15;
    return Math.max(baseSeconds, baseSeconds + Math.max(0, (n + Math.min(extra, 2) - 2)) * perPair);
  }
  return baseSeconds;
}

// Categorize a question for the ConfigView type-filter chip.
//   'mcq'     = pure multiple-choice / true-false (mcq, tf, match)
//   'writing' = anything that needs typing input (short, essay, fill)
//
// Updated 2026-05-04 per Palm: fill-in-the-blank should NOT pollute MCQ
// practice pools (they're a different study mode requiring keyboard input).
// Old behavior: fill in mcq → mixed with options → confusing UX.
// New behavior: fill in writing → user picks "writing" chip to practice all
// typed-input questions together (fill + short + essay).
export function questionCategory(q) {
  if (!q?.type) return 'mcq';
  return (q.type === 'short' || q.type === 'essay' || q.type === 'fill') ? 'writing' : 'mcq';
}

// Check if today is a new study day (for streak).
// Streak freeze (since v6 social): if the user misses ONE day but has a
// streak of ≥ 5 days, we silently let them skip without breaking. The
// freeze can be used at most once per active streak — tracked via
// `freezeUsedAt` (timestamp of the day that was skipped). Reset when
// the streak itself resets to 1.
export function updateStreak(lastStudyDate, currentStreak, freezeUsedAt = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  if (!lastStudyDate) return { streak: 1, lastDate: todayTs, freezeUsedAt: null };

  const last = new Date(lastStudyDate);
  last.setHours(0, 0, 0, 0);
  const diff = Math.round((todayTs - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return { streak: currentStreak, lastDate: lastStudyDate, freezeUsedAt }; // Same day
  if (diff === 1) return { streak: currentStreak + 1, lastDate: todayTs, freezeUsedAt }; // Next day
  // diff === 2 + streak ≥ 5 + freeze not yet used → consume freeze, keep streak
  if (diff === 2 && currentStreak >= 5 && !freezeUsedAt) {
    return { streak: currentStreak + 1, lastDate: todayTs, freezeUsedAt: todayTs, freezeJustUsed: true };
  }
  return { streak: 1, lastDate: todayTs, freezeUsedAt: null }; // Gap — reset streak
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

/** A subject's identity colour, made readable as TEXT.
 *
 *  The 23 colours in curriculum.js were chosen against a cream page. Used
 *  as text they fail AA badly — 12 of 23 in light, 22 of 23 in dark, one
 *  of them at 1.00:1 because it was literally the page's own ink. They are
 *  fine as dots, borders and fills, where they are identity and nothing
 *  reads on top of them; it is only the text role that needs help.
 *
 *  Blending toward the current theme's ink keeps the hue recognisable
 *  while pulling the lightness to where it can be read, and the ratio is a
 *  per-theme token because dark needs to travel further (40% vs 45% of the
 *  original). Verified: all 23 clear 4.5 on every surface in both themes.
 */
export const subjectText = (color) =>
  (color ? `color-mix(in srgb, ${color} var(--subject-text-mix), var(--clr-ink))` : 'var(--clr-ink-soft)');

/** Dose for a drug-database row at a given body weight.
 *
 *  Extracted so the calculator and its test run the SAME code. The bug
 *  this replaces was two inline expressions in JSX: the dose multiplied
 *  by weight unconditionally, and the displayed unit chosen by
 *  `doseLo > 1 ? 'mg' : 'µg'` — magnitude, not the drug's own unit. That
 *  labelled 26 of 57 drugs µg when the answer was mg (furosemide,
 *  pimobendan, enalapril, meloxicam…), and called insulin's IU µg too.
 *
 *  `perKg: false` marks a dose that is per ANIMAL — methimazole is
 *  1.25-2.5 mg/cat regardless of weight — and must not be multiplied.
 */
export function drugDose(drug, weightKg, species) {
  if (!drug) return null;
  const perKg = drug.unit !== 'fixed';
  const unit = drug.unit === 'fixed'
    ? (drug.fixedUnit || 'mg')
    : String(drug.unit).replace('/kg', '').replace('/day', '');
  if (!perKg) return { lo: drug.doseLo, hi: drug.doseHi, unit, perKg };
  // A per-species ceiling wins over the general range. Enrofloxacin's
  // range tops out at exactly the 20 mg/kg that blinds cats, and the
  // warning that says so is prose under a number the student is about to
  // write down.
  const cap = species && drug.speciesMax ? drug.speciesMax[species] : undefined;
  const lo0 = Number.isFinite(cap) ? Math.min(drug.doseLo, cap) : drug.doseLo;
  const hi0 = Number.isFinite(cap) ? Math.min(drug.doseHi, cap) : drug.doseHi;
  const cappedFor = Number.isFinite(cap) && cap < drug.doseHi ? species : null;

  const w = Number(weightKg);
  if (!Number.isFinite(w) || w <= 0) return { lo: null, hi: null, unit, perKg, cappedFor, cap };
  const round = (n) => Math.round(n * 100) / 100;
  return { lo: round(lo0 * w), hi: round(hi0 * w), unit, perKg, cappedFor, cap };
}
