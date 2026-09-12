// "ข้อที่ตอบผิด" — one definition, shared by everything that counts or serves it.
//
// The pool used to mean "has ever been answered wrong", so a question answered
// wrong once and then correctly ten times stayed in the set forever and kept
// outranking new practice in the daily plan. Keeping the history is right; it
// is using that history as a stand-in for "still not learnt" that made the
// queue stop reflecting any progress.
//
// A question counts as still wrong when its MOST RECENT attempt was wrong,
// decided by each row's own timestamp. Array order cannot be trusted for this:
// a sync merge appends one device's rows after the other's regardless of when
// they happened.
//
// This lives in its own module because three places have to agree: the pool
// the exam engine builds, the count the home chip shows, and the weak-question
// list the dashboard drives. When they disagreed before, a button promised one
// number and handed over a different set.

export function historyKey(subject, questionId) {
  return `${subject || ''}:${questionId}`;
}

/**
 * @param {Array} history chronological attempt rows
 * @returns {{ keys: Set<string>, counts: Map<string, number> }}
 *   keys   — questions whose latest attempt was wrong
 *   counts — how many times each of those was ever missed, for "most-missed
 *            first" ordering. Counting every past miss is deliberate: it ranks
 *            a question missed five times above one missed once, even though
 *            both are currently wrong.
 */
export function stillWrong(history) {
  const latest = new Map();
  const counts = new Map();
  for (const item of history || []) {
    if (!item || item.questionId == null) continue;
    const key = historyKey(item.subject, item.questionId);
    const wrong = item.correct === false;
    if (wrong) counts.set(key, (counts.get(key) || 0) + 1);
    // Compare the timestamps the rows carry, not their position. Array order
    // is NOT chronological once two devices have synced: the merge keeps the
    // remote rows and appends this device's local-only rows after them
    // whatever their date, so a laptop answer from 09:00 can sit behind a
    // phone answer from 20:00 for the same question. Trusting position there
    // served back a question the student had most recently got right.
    const at = Number(item.date);
    const dated = Number.isFinite(at);
    const prev = latest.get(key);
    if (!prev
      || (dated && (!prev.dated || at >= prev.at))
      || (!dated && !prev.dated)) {
      latest.set(key, { at, dated, wrong });
    }
  }
  const keys = new Set();
  for (const [key, entry] of latest) if (entry.wrong) keys.add(key);
  return { keys, counts };
}
