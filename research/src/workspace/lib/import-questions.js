// The import questions [M1-DESIGN.md 8.1, 8.2; G26], read from the intake preview: every question the
// program must not guess (era, date order, two-digit century, Excel date system, missing reason,
// identifiers Excel turned into dates, type conflicts) is carried by a conversion with its options;
// choosing an option re-runs intake's answerPreview, which rebuilds the import step, the codebook
// and the conversion list. This module only groups what the preview says for the screen. Pure.
// OWNER: workspace role.

/**
 * One entry per question (conversions that share a questionId are shown together), the ones still
 * waiting for an answer first.
 * @param {any} preview intake ParsePreview
 * @returns {{ questionId: string, conv: any, related: any[], options: { value: string, key: string, params?: Object }[], answer: string|null, waiting: boolean }[]}
 */
export function questionsOf(preview) {
  const byId = new Map();
  for (const c of preview?.conversions || []) {
    if (!c.questionId || !Array.isArray(c.options) || c.options.length === 0) continue;
    const q = byId.get(c.questionId);
    if (!q) byId.set(c.questionId, { questionId: c.questionId, conv: c, related: [], options: c.options, answer: c.answer ?? null, waiting: false });
    else q.related.push(c);
  }
  const blocking = new Set((preview?.blocking || []).map((b) => b.questionId));
  const list = [...byId.values()].map((q) => ({ ...q, waiting: blocking.has(q.questionId) || q.answer === null }));
  list.sort((a, b) => Number(b.waiting) - Number(a.waiting));
  return list;
}

/** Conversions that need no choice: applied as listed, or shown but left as they are. PII is listed apart. */
export function plainConversions(preview) {
  const rest = (preview?.conversions || []).filter((c) => c.kind !== 'pii' && c.kind !== 'question' && !(c.questionId && c.options?.length));
  return { applied: rest.filter((c) => c.applied !== false), shown: rest.filter((c) => c.applied === false) };
}

/** Columns the preview found personal data in (hidden by default). */
export function piiConversions(preview) {
  return (preview?.conversions || []).filter((c) => c.kind === 'pii');
}

/** How many questions still wait for an answer (G26 blocks the confirm button until 0). */
export function openCount(preview) {
  return (preview?.blocking || []).length;
}

/** Whether the confirm button may import: nothing blocking, and there is a table to save. */
export function canConfirm(preview) {
  return Boolean(preview && preview.importStep && (preview.blocking || []).length === 0 && preview.raw && preview.raw.rowCount > 0);
}
