// ============================================================
// score-card.js: a finished set as a poster
// ============================================================
// The subject by name, the score as one numeral, the exact count under it,
// and a scale with the practice pass line marked, so the card says what the
// results screen said: 28 of 47 rounds to 60 but does not reach the line,
// and the scale shows that.
// ============================================================

import {
  createCard, paper, cropMarks, masthead, footer, ghostNumeral, thaiDate, rule, sticker, fitCard, plateBand,
  LIVE, SIZE, FAMILY, W, CORE, STORY,
} from './kit.js';
import { CARD_PLATES } from '../../data/art.js';

/** The frieze over the score: Muybridge's horse clearing a post, as a set clears its bar. */
export const SCORE_STRIP = CARD_PLATES.score;

const WIDTH = LIVE.right - LIVE.left;

/** The results screen's bar, read from the counts (28/47 rounds to 60 and still misses it). */
export const scoreReached = (d) => d.total > 0 && d.correct / d.total >= d.passPct / 100;

/** The results screen's own encouragement, one tier per tier. */
export function scoreLine({ pct, correct, total, reached, isWritingOnly, writingDone = 0 }) {
  if (isWritingOnly) return writingDone > 0 ? 'เขียนตอบแล้ว ไปดูเฉลยต่อใน VetMock' : 'ไปดูเฉลยต่อใน VetMock';
  if (total > 0 && correct === total) return 'ถูกทุกข้อ รักษาระดับนี้ไว้';
  if (total > 0 && correct / total >= 0.8) return 'แม่นดีมาก ลองเพิ่มจำนวนข้อดู';
  if (reached) return 'ถึงเกณฑ์ซ้อมแล้ว ทบทวนข้อที่ผิดต่อ';
  if (pct >= 40) return 'ยังมีจุดที่ควรทบทวน เริ่มจากข้อที่ผิด';
  return 'เริ่มใหม่ได้เสมอ';
}

function layout(card, d, heroSize, g, mochi, strip) {
  const { ctx, pal } = card;
  const reached = scoreReached(d);
  paper(card);
  cropMarks(card);
  if (!d.isWritingOnly) ghostNumeral(card, d.pct, { baseline: CORE.bottom + 470, size: 600, x: W + 20 });
  sticker(card, mochi);
  plateBand(card, strip, 'Eadweard Muybridge, 1882');
  masthead(card, d.mode === 'exam' ? 'โหมดสอบ' : 'โหมดซ้อม', thaiDate(d.completedAt || Date.now()));

  // No name: the set held more than one subject (not necessarily all of them).
  const name = d.subjectName || 'หลายวิชา';
  const titleSize = card.fit(name, WIDTH, { weight: 700, max: SIZE.l, min: SIZE.m });
  const title = card.para(name, LIVE.left, LIVE.top, WIDTH,
    { weight: 700, size: titleSize, family: FAMILY.serif, color: pal.ink }, { maxLines: 2, role: 'title' });
  let y = title.bottom;
  if (d.topicName) {
    const t = card.para(d.topicName, LIVE.left, y + 26, WIDTH, { weight: 500, size: SIZE.s, family: FAMILY.label, color: pal.soft }, { maxLines: 2, role: 'topic' });
    y = t.bottom;
  }

  // Hero.
  const value = d.isWritingOnly ? `${d.writingDone}/${d.writingTotal}` : String(d.pct);
  // A wide value ("999/1000") steps down rather than leaving the column.
  const size = card.fit(value, WIDTH - (d.isWritingOnly ? 0 : heroSize * 0.4), { weight: 800, family: FAMILY.numeral, max: heroSize, min: SIZE.l });
  const base = y + 56 * g + size * 0.72;
  const hero = card.textInk(value, LIVE.left, base, { weight: 800, size, family: FAMILY.numeral, color: pal.ink }, 'hero');
  if (!d.isWritingOnly) {
    const pctSize = Math.round(size * 0.3);
    card.text('%', hero.right + 14, hero.top + pctSize * 0.72, { weight: 600, size: pctSize, family: FAMILY.numeral, color: pal.soft }, 'hero-unit');
  }
  const countText = d.isWritingOnly ? 'ข้อที่เขียนตอบ' : `ถูก ${d.correct.toLocaleString('en-US')} จาก ${d.total.toLocaleString('en-US')} ข้อ`;
  // The count is the fact the picture stands on: smaller type, never cut.
  const countSize = card.fit(countText, WIDTH, { weight: 600, family: FAMILY.serif, max: SIZE.m, min: SIZE.s });
  const count = card.para(countText, LIVE.left, hero.bottom + 30, WIDTH, { weight: 600, size: countSize, family: FAMILY.serif, color: pal.ink }, { maxLines: 2, role: 'count' });
  y = count.bottom;

  // The scale, with the pass line.
  if (!d.isWritingOnly && d.total > 0) {
    const passX = LIVE.left + (WIDTH * d.passPct) / 100;
    const labelTop = y + 64 * g;
    const passLabel = card.para(`เกณฑ์ซ้อม ${d.passPct}%`, passX, labelTop, WIDTH, { weight: 500, size: SIZE.xs, family: FAMILY.label, color: pal.soft }, { maxLines: 1, balance: false, role: 'pass-label' });
    const barTop = passLabel.bottom + 22;
    const barH = 14;
    const r = barH / 2;
    const track = () => {
      if (card.dry) return;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') ctx.roundRect(LIVE.left, barTop, WIDTH, barH, r);
      else ctx.rect(LIVE.left, barTop, WIDTH, barH);
    };
    if (!card.dry) {
    ctx.save();
    track(); ctx.fillStyle = pal.faint; ctx.fill();
    ctx.save(); track(); ctx.clip();
    ctx.fillStyle = reached ? pal.right : pal.wrong;
    ctx.fillRect(LIVE.left, barTop, WIDTH * Math.max(0, Math.min(1, d.correct / d.total)), barH);
    ctx.restore();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(passX, barTop - 12); ctx.lineTo(passX, barTop + barH + 12); ctx.stroke();
    ctx.restore();
    }
    y = barTop + barH + 12;
    // 28 of 47 shows 60 beside a 60% bar: say how far it is from the bar.
    const short = Math.ceil((d.total * d.passPct) / 100 - 1e-9) - d.correct;
    if (!reached && short > 0) {
      y = card.para(`อีก ${short.toLocaleString('en-US')} ข้อถึงเกณฑ์ซ้อม`, LIVE.left, y + 18, WIDTH,
        { weight: 600, size: SIZE.xs, family: FAMILY.label, color: pal.rose }, { maxLines: 1, role: 'short' }).bottom;
    }
  }

  rule(card, y + 48 * g);
  card.para(scoreLine({ ...d, reached }), LIVE.left, y + 48 * g + 40, WIDTH,
    { weight: 500, size: SIZE.s, family: FAMILY.serif, color: pal.ink }, { maxLines: 2, role: 'line' });

  footer(card);
}

const HERO_STEPS = [365, 324, 288, 256, 243, 216];

/**
 * @param d {{ pct, correct, total, passPct, mode, subjectName, topicName?,
 *   isWritingOnly?, writingDone?, writingTotal?, completedAt? }}
 */
export function drawScoreCard(d, { theme = 'light', mochi = null, strip = null } = {}) {
  return fitCard({
    sizes: HERO_STEPS,
    maxGap: 2.4,
    draw: (size, gap, dry) => {
      const card = createCard(theme, 20261015, STORY, { dry });
      layout(card, d, size, gap, mochi, strip);
      return card;
    },
  });
}
