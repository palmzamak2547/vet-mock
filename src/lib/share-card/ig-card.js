// ============================================================
// ig-card.js: one question as a 4:5 feed post for @vetmock.cu
// ============================================================
// The studio (views/IgCardStudioView.jsx) makes a week of these at once.
// The stem is set as large as it can be while every option still fits; an
// option takes at most two lines. The answer is never on the card: the post
// asks, the caption answers.
// ============================================================

import { createCard, paper, masthead, footer, POST, SIZE, FAMILY, layoutProblems } from './kit.js';

const { live } = POST;
const WIDTH = live.right - live.left;
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** Bank markup out, whitespace collapsed: the card shows what a student reads. */
export function cleanText(s) {
  return String(s ?? '').replace(/\*\*/g, '').replace(/★/g, '').replace(/\s+/g, ' ').trim();
}

/** What the card offers as choices: an MCQ's options, or ถูก and ผิด. */
export function cardOptions(q) {
  if (q?.type === 'tf') return ['ถูก', 'ผิด'];
  return Array.isArray(q?.options) ? q.options.slice(0, LETTERS.length).map(cleanText) : [];
}

// Paper under each line set over a backdrop, feathered where the browser can
// blur: the drawing frames the text instead of running through it (the
// stethoscope's tube crossed "vetmock.com" at 1.1:1). The rings get room too.
function paperVeil(card, boxes) {
  const { ctx, pal } = card;
  ctx.save();
  ctx.fillStyle = pal.bg;
  ctx.filter = 'blur(12px)';
  for (const b of boxes) {
    const pad = b.role === 'letter' ? 34 : 18;
    const [x, y, w, h] = [b.left - pad, b.top - pad, b.right - b.left + pad * 2, b.bottom - b.top + pad * 2];
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, 18);
    else ctx.rect(x, y, w, h);
    ctx.fill();
  }
  ctx.restore();
}

function layout(card, q, { subjectName, stemSize, optSize, backdrop, shift = 0, veil = null }) {
  const { ctx, pal } = card;
  if (backdrop && !card.dry) {
    ctx.drawImage(backdrop, 0, 0, POST.w, POST.h);
    if (veil) paperVeil(card, veil);
  } else paper(card);
  masthead(card, subjectName || 'ข้อสอบชวนคิด', '@vetmock.cu');

  const stem = card.para(cleanText(q.q), live.left, live.top + shift, WIDTH,
    { weight: 600, size: stemSize, family: FAMILY.serif, color: pal.ink }, { maxLines: 8, balance: true, leading: 1.42, role: 'stem' });
  // A question with a word cut off is not the question: smaller type, or no card.
  const cuts = stem.cut ? ['the stem is cut short'] : [];
  let y = stem.bottom + 52;

  const letterSize = Math.max(32, Math.round(optSize * 0.82));
  const r = Math.round(optSize * 0.66);
  cardOptions(q).forEach((text, i) => {
    const tx = live.left + r * 2 + 26;
    const box = card.para(text, tx, y, live.right - tx,
      { weight: 500, size: optSize, family: FAMILY.label, color: pal.ink }, { maxLines: 2, balance: true, leading: 1.38, role: 'option' });
    if (box.cut) cuts.push(`option ${LETTERS[i]} is cut short`);
    // The ring sits on the middle of the option's first line.
    const cx = live.left + r;
    const cy = y + box.ascent - optSize * 0.36;
    if (!card.dry) {
      ctx.save();
      ctx.strokeStyle = pal.sage;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    card.text(LETTERS[i], cx, cy + letterSize * 0.35, { weight: 600, size: letterSize, family: FAMILY.numeral, color: pal.sage, align: 'center' }, 'letter');
    y = box.lineBottom + 18;
  });

  card.para('เฉลยอยู่ในแคปชัน', live.left, y + 18, WIDTH,
    { weight: 600, size: SIZE.xs, family: FAMILY.label, color: pal.rose }, { maxLines: 1, role: 'pointer' });
  footer(card);
  return cuts;
}

const STEM_SIZES = [84, 72, 64, 58, 52, 48, 44, 40, 36];
const OPTION_SIZES = [44, 40, 36];

/**
 * Draw one question card: the largest stem, then the largest options, that
 * leave the layout clean. A `backdrop` plate is drawn under a light card only.
 * @returns {{ card, problems: string[] }}
 */
export function drawIgCard(q, { theme = 'light', subjectName = '', backdrop = null } = {}) {
  const plate = theme === 'light' ? backdrop : null;
  const attempt = (stemSize, optSize, shift, dry = true, veil = null) => {
    const card = createCard(theme, 20261016, POST, { dry });
    const cuts = layout(card, q, { subjectName, stemSize, optSize, shift, backdrop: plate, veil });
    return { card, problems: [...layoutProblems(card.boxes, { frame: POST }), ...cuts] };
  };
  // The full drawing, with the veil laid where a trial of the same layout put the text.
  const draw = (stemSize, optSize, shift) => attempt(stemSize, optSize, shift, false, plate ? attempt(stemSize, optSize, shift).card.boxes : null);
  for (const stemSize of STEM_SIZES) {
    for (const optSize of OPTION_SIZES) {
      const trial = attempt(stemSize, optSize, 0);
      if (trial.problems.length) continue;
      // A short question sits a little above the middle of the space, the
      // optical centre, instead of hanging from the top with a hole below.
      const bottom = Math.max(...trial.card.boxes.filter((b) => b.role !== 'footer' && b.role !== 'masthead').map((b) => b.bottom));
      const spare = live.bottom - bottom;
      const shift = spare > 60 && attempt(stemSize, optSize, Math.round(spare * 0.42)).problems.length === 0 ? Math.round(spare * 0.42) : 0;
      return draw(stemSize, optSize, shift);
    }
  }
  return draw(STEM_SIZES[STEM_SIZES.length - 1], OPTION_SIZES[OPTION_SIZES.length - 1], 0);
}
