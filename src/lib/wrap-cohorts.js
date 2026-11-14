// ============================================================
// wrap-cohorts.js — "เคยออก N รุ่น" for a wrap-up item
// ============================================================
// A wrap-up item lists what past papers tested, each line citing the items it
// came from ("ข้อสอบเก่า 209058, 209059"). The bank already knows which
// senior cohorts sat each of those items: src/data/exam-recurrence.generated.js
// files every past-paper key under the cohorts that sat it, and joins copies
// of the same item recorded more than once (EXAM_RECURRENCE_CLUSTERS). This
// reads the item's cited past papers against that file and returns the
// cohorts, ascending.
//
// History only. The count says how many cohorts were asked an item, never
// what a coming paper will hold. Nothing is read from the wrap-up's own
// wording ("(Vet 80)"): an id the recurrence file does not attribute counts
// for nothing, so the tag is absent rather than guessed.
// ============================================================

// The ids a past-paper citation names: "ข้อสอบเก่า 209009, 209010 (Vet 80),
// 209051 (Vet 83)". A bracket is a remark about the item, not an id, and the
// citation ends where another kind of source starts.
const PAST_PAPER = /ข้อสอบเก่า([^;]*)/g;
const OTHER_SOURCE = /ข้อฝึกในคลัง|แนวข้อสอบ|เดค|สไลด์|\bdeck\b|\bTJ\b|\baudit\b/i;

export function pastPaperIds(raw) {
  const ids = [];
  for (const [, tail] of String(raw ?? '').matchAll(PAST_PAPER)) {
    const stop = tail.search(OTHER_SOURCE);
    const span = (stop >= 0 ? tail.slice(0, stop) : tail).replace(/\([^)]*\)/g, ' ');
    for (const [id] of span.matchAll(/\d{3,7}/g)) if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

/** subject's question id -> Set of the cohorts that sat it (or a copy of it). */
export function cohortIndex(recurrence, clusters, subject) {
  const index = new Map();
  const add = (id, cohort) => {
    if (!index.has(id)) index.set(id, new Set());
    index.get(id).add(Number(cohort));
  };
  const prefix = `${subject}:`;
  for (const topic of Object.values(recurrence?.[subject]?.topics || {})) {
    for (const [cohort, papers] of Object.entries(topic.sat || {})) {
      for (const keys of Object.values(papers)) {
        for (const key of keys) if (key.startsWith(prefix)) add(key.slice(prefix.length), cohort);
      }
    }
  }
  // A copy of the same item sat by another cohort, filed in this subject or another.
  for (const cluster of clusters || []) {
    const mine = cluster.members.filter(([key]) => key.startsWith(prefix));
    if (!mine.length) continue;
    for (const [key] of mine) for (const cohort of cluster.cohorts) add(key.slice(prefix.length), cohort);
  }
  return index;
}

/** The cohorts that sat any past paper the item's "มีในข้อสอบเก่า" lines cite, ascending. */
export function itemCohorts(item, index) {
  const all = new Set();
  for (const line of item?.examined || []) {
    for (const id of pastPaperIds(line?.src)) for (const c of index.get(id) || []) all.add(c);
  }
  return [...all].filter(Number.isFinite).sort((a, b) => a - b);
}

/** "Vet 78, 81, 85": the first cohort carries the word, as the papers write it. */
export function cohortList(cohorts) {
  return cohorts.length ? `Vet ${cohorts.join(', ')}` : '';
}
