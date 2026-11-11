// ============================================================
// figure-check.js — what a parsed figure must be before it is drawn
// ============================================================
// parseFigure (figure-spec.js) only reads; it stays small because it ships
// with the first load. The checks that need words live here, shared by the
// lint (scripts/lint-question-figures.mjs, which fails on any of them) and the
// lazy drawing (ExplainFigure.jsx, which writes a figure out in words rather
// than draw one that fails them).
// ============================================================

/** Everything wrong with a parsed figure's shape, as sentences. */
export function figureProblems(fig) {
  const out = [...(fig.errors || [])];
  const num = (v, what) => { if (v == null || Number.isNaN(v)) out.push(`${what} is not a number`); };
  if (fig.kind === 'interval') {
    num(fig.nil, 'null');
    for (const r of fig.rows || []) {
      ['est', 'lo', 'hi'].forEach((k) => num(r[k], `"${r.label}" ${k}`));
      if (r.est != null && r.lo != null && r.hi != null && !(r.lo <= r.est && r.est <= r.hi)) out.push(`the estimate ${r.est} is outside ${r.lo} to ${r.hi}`);
    }
    // A ratio's axis is logarithmic: every bound must be above zero.
    if (fig.nil === 1 && (fig.rows || []).some((r) => !(r.lo > 0))) out.push('a ratio (null: 1) is drawn on a log scale, so every bound must be above 0');
  }
  for (const b of fig.bars || []) { num(b.value, `the bar "${b.label}"`); if (b.value < 0) out.push(`the bar "${b.label}" starts at zero and cannot be negative`); }
  for (const e of fig.events || []) {
    num(e.at, `the time of "${e.label}"`);
    if ('to' in e) { num(e.to, `the end of "${e.label}"`); if (e.to < e.at) out.push(`"${e.label}" ends before it starts`); }
  }
  if (fig.kind === 'scale' && fig.value) num(fig.value.value, 'the value');
  return out;
}
