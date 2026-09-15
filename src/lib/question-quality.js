// ============================================================
// question-quality.js — signals that a question, not the student, is wrong
// ============================================================
// Pure. Takes one row of admin_questions (attempts, wrong, users,
// users_wrong, answers) plus, when the bank is loaded, the question's keyed
// answer, and returns the flags worth a second look. Thresholds are blunt on
// purpose: this exists so Palm sees a bad key or a trick distractor before
// anyone bothers to report it, and a blunt flag on 8 attempts beats a
// statistically careful one that waits for 80.
// ============================================================

export const wrongRate = (row) => (row?.attempts > 0 ? row.wrong / row.attempts : 0);

/**
 * @param {object} row  admin_questions row
 * @param {number|null} keyedAnswer  the bank's answer index, when known
 * @returns {{ key: string, label: string, tone: 'alarm'|'warn'|'info' }[]}
 */
export function qualityFlags(row, keyedAnswer = null) {
  const flags = [];
  if (!row || !(row.attempts > 0)) return flags;
  const rate = wrongRate(row);

  // Nobody has ever got it right. On 3+ attempts that is usually the key.
  if (row.attempts >= 3 && row.wrong === row.attempts) {
    flags.push({ key: 'always-wrong', label: 'ผิดทุกครั้ง', tone: 'alarm' });
  } else if (row.attempts >= 5 && rate >= 0.7) {
    flags.push({ key: 'high-wrong', label: `ผิด ${Math.round(rate * 100)}%`, tone: 'warn' });
  }

  // Not one struggling student: most people who met it got it wrong.
  if (row.users >= 3 && row.users_wrong / row.users >= 0.75) {
    flags.push({ key: 'most-users-wrong', label: 'คนส่วนใหญ่ผิด', tone: 'warn' });
  }

  // One wrong option collects the crowd. Either the distractor is doing its
  // job too well or the key is on the wrong line — both deserve a look.
  const dist = answerDistribution(row.answers);
  const total = dist.reduce((s, d) => s + d.count, 0);
  if (total >= 4 && keyedAnswer != null) {
    const top = dist.filter((d) => d.index !== keyedAnswer).sort((a, b) => b.count - a.count)[0];
    if (top && top.count / total >= 0.6) {
      flags.push({ key: 'one-distractor', label: `ตัวเลือก ${String.fromCharCode(65 + top.index)} ดูดคนไป ${Math.round((top.count / total) * 100)}%`, tone: 'alarm' });
    }
  }

  return flags;
}

/** answers: {"1": 4, "3": 2, "null": 1} -> [{index:1,count:4}, ...]; null (unanswered) is dropped. */
export function answerDistribution(answers) {
  if (!answers || typeof answers !== 'object') return [];
  return Object.entries(answers)
    .map(([k, n]) => [Number(k), Number(n)])
    .filter(([k, n]) => Number.isInteger(k) && k >= 0 && n > 0)
    .map(([index, count]) => ({ index, count }))
    .sort((a, b) => a.index - b.index);
}

/** Worst first: by wrong rate, then by how many people it has caught. */
export function rankQuestions(rows) {
  return [...(rows || [])].sort((a, b) => wrongRate(b) - wrongRate(a) || (b.users_wrong || 0) - (a.users_wrong || 0) || (b.attempts || 0) - (a.attempts || 0));
}

/** Fill the calendar so a chart shows every day in the window, zeros included. */
export function fillDaily(daily, days, today = new Date()) {
  const byDate = new Map((daily || []).map((d) => [d.d, d]));
  const out = [];
  const span = days > 0 ? days : Math.max(1, daily?.length || 1);
  const start = new Date(today); start.setHours(0, 0, 0, 0);
  if (days > 0) start.setDate(start.getDate() - (days - 1));
  else if (daily?.length) {
    // 'YYYY-MM-DD' through Date() is UTC midnight; split it so the first
    // bar is the day the database meant in every zone.
    const [y, m, d] = String(daily[0].d).slice(0, 10).split('-').map(Number);
    start.setTime(new Date(y, m - 1, d).getTime());
  }
  const count = days > 0 ? span : Math.floor((today - start) / 86400000) + 1;
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const row = byDate.get(key);
    out.push({ d: key, attempts: row?.attempts || 0, correct: row?.correct || 0, users: row?.users || 0 });
  }
  return out;
}
