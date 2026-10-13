// ============================================================
// daily-card.js: the daily question's week as a row of slides
// ============================================================
// Seven glass slides, one a day, each stained by that day's answer: green
// for right, rose for wrong, an empty dashed ring for a day not played. The
// slides are drawn, not emoji, so they look the same on every phone. Today's
// slide is outlined and labelled.
// ============================================================

import {
  createCard, paper, cropMarks, masthead, footer, ghostNumeral, thaiDate, sticker, plateBand, fitCard,
  LIVE, SIZE, FAMILY, W, CORE, STORY,
} from './kit.js';
import { CARD_PLATES } from '../../data/art.js';

/** The frieze over the daily card: Muybridge's hound, a run kept up day after day. */
export const DAILY_STRIP = CARD_PLATES.daily;

const WIDTH = LIVE.right - LIVE.left;
const WEEKDAY = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

/** The day's headline, in plain Thai. */
export function dailyTitle(status) {
  if (status === 'correct') return 'วันนี้ตอบถูก';
  if (status === 'wrong') return 'วันนี้พลาด';
  return 'ข้อประจำวัน';
}

/**
 * One line that is true of the week. The streak counts days answered, right
 * or wrong, so only the seven slides on the card can say "right".
 */
export function dailyLine({ todayStatus, streak, correct, total }) {
  if (todayStatus === 'correct' && total >= 7 && correct === total) return 'ตอบถูกครบทั้งสัปดาห์ เก่งจริง';
  if (todayStatus === 'correct' && streak > 7) return 'มาตอบทุกวันเกินสัปดาห์แล้ว';
  if (todayStatus === 'correct' && streak >= 3) return 'ติดมือแล้ว พรุ่งนี้มาต่อ';
  if (todayStatus === 'correct') return 'วันนี้เก็บไปอีกหนึ่งข้อ';
  if (todayStatus === 'wrong' && correct >= total - 1) return 'พลาดวันเดียว พรุ่งนี้สู้ต่อ';
  if (todayStatus === 'wrong') return 'ผิดได้ ค่อย ๆ ทำต่อ';
  return 'มาทุกวันแล้วจะติดเอง';
}

function slide(card, x, top, w, h, row, today) {
  const { ctx, pal } = card;
  const stain = { correct: [pal.right, pal.rightEdge], wrong: [pal.wrong, pal.wrongEdge] };
  const r = 12;
  const label = 76;
  const day = new Date(`${row.date}T12:00:00`);
  const wd = Number.isNaN(day.getTime()) ? '' : WEEKDAY[day.getDay()];
  if (card.dry) {
    card.text(wd, x + w / 2, top + label / 2 + 13, { weight: 600, size: SIZE.xs, family: FAMILY.label, color: pal.soft, align: 'center' }, 'weekday');
    return;
  }
  ctx.save();
  const shape = () => {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(x, top, w, h, r);
    else ctx.rect(x, top, w, h);
  };
  shape();
  ctx.fillStyle = pal.glass;
  ctx.fill();
  // The frosted end a slide is labelled on.
  ctx.save();
  shape();
  ctx.clip();
  ctx.fillStyle = pal.faint;
  ctx.fillRect(x, top, w, label);
  ctx.restore();
  shape();
  ctx.lineWidth = today ? 3.5 : 2;
  ctx.strokeStyle = today ? pal.ink : pal.rule;
  ctx.stroke();

  const cx = x + w / 2;
  const cy = top + label + (h - label) / 2;
  const rad = Math.min(36, w * 0.34);
  // The cover slip over the sample: a thin square of glass.
  const slip = w * 0.8;
  ctx.save();
  ctx.fillStyle = pal.glass;
  ctx.fillRect(cx - slip / 2, cy - slip / 2, slip, slip);
  ctx.strokeStyle = pal.rule;
  ctx.lineWidth = 1.25;
  ctx.strokeRect(cx - slip / 2, cy - slip / 2, slip, slip);
  ctx.restore();
  if (row.status === 'correct' || row.status === 'wrong') {
    const [deep, edge] = stain[row.status];
    const g = ctx.createRadialGradient(cx - rad * 0.3, cy - rad * 0.3, rad * 0.1, cx, cy, rad);
    g.addColorStop(0, deep);
    g.addColorStop(1, edge);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.setLineDash([6, 7]);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = pal.soft;
    ctx.beginPath(); ctx.arc(cx, cy, rad - 2, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();

  card.text(wd, cx, top + label / 2 + 13, { weight: 600, size: SIZE.xs, family: FAMILY.label, color: today ? pal.ink : pal.soft, align: 'center' }, 'weekday');
}

function legendDot(card, x, y, status) {
  if (card.dry) return;
  const { ctx, pal } = card;
  const stain = { correct: [pal.right], wrong: [pal.wrong] };
  ctx.save();
  if (status === 'missed') {
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = pal.soft;
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.fillStyle = stain[status][0];
    ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function layout(card, data, g, mochi, strip) {
  const { pal } = card;
  const { history, streak = 0, todayDate, todayStatus } = data;
  const correct = history.filter((r) => r.status === 'correct').length;
  paper(card);
  cropMarks(card);
  const dayNum = Number(String(todayDate || '').slice(8, 10));
  // "01", not "1": a lone 1 in the corner read as a stray line.
  if (dayNum) ghostNumeral(card, String(dayNum).padStart(2, '0'), { baseline: CORE.bottom + 470, size: 600, x: W + 20 });
  sticker(card, mochi);
  plateBand(card, strip, 'Eadweard Muybridge, 1882');
  masthead(card, 'ข้อประจำวัน', thaiDate(todayDate));

  const titleSize = card.fit(dailyTitle(todayStatus), WIDTH, { weight: 700, max: SIZE.l, min: SIZE.m });
  const title = card.para(dailyTitle(todayStatus), LIVE.left, LIVE.top, WIDTH,
    { weight: 700, size: titleSize, family: FAMILY.serif, color: pal.ink }, { maxLines: 2, role: 'title' });

  // The week.
  const n = Math.max(1, history.length);
  const gap = 22;
  const w = (WIDTH - gap * (n - 1)) / n;
  const h = 300;
  const top = title.bottom + 64 * g;
  history.forEach((row, i) => slide(card, LIVE.left + i * (w + gap), top, w, h, row, i === history.length - 1));
  const todayX = LIVE.left + (n - 1) * (w + gap) + w / 2;
  const below = card.text('วันนี้', todayX, top + h + 50, { weight: 600, size: SIZE.xs, family: FAMILY.label, color: pal.ink, align: 'center' }, 'today');

  // Legend, so the stains need no guessing.
  let lx = LIVE.left;
  const ly = top + h + 50;
  for (const [status, text] of [['correct', 'ถูก'], ['wrong', 'ผิด'], ['missed', 'ไม่ได้ทำ']]) {
    legendDot(card, lx + 11, ly - 13, status);
    const t = card.text(text, lx + 32, ly, { weight: 500, size: SIZE.xs, family: FAMILY.label, color: pal.soft }, 'legend');
    lx = t.right + 36;
  }

  // The count.
  const labTop = below.bottom + 64 * g;
  const lab = card.para('ตอบถูก', LIVE.left, labTop, WIDTH, { weight: 500, size: SIZE.xs, family: FAMILY.label, color: pal.soft }, { maxLines: 1, role: 'hero-label' });
  const heroSize = SIZE.xxl;
  const base = lab.bottom + 20 + heroSize * 0.72;
  const hero = card.textInk(String(correct), LIVE.left, base, { weight: 800, size: heroSize, family: FAMILY.numeral, color: pal.ink }, 'hero');
  const of = card.text(`จาก ${history.length} วัน`, hero.right + 28, base, { weight: 600, size: SIZE.m, family: FAMILY.serif, color: pal.soft }, 'hero-unit');
  let y = Math.max(hero.bottom, of.bottom);

  if (streak >= 2) {
    const s = card.para(`ตอบต่อเนื่อง ${streak} วัน`, LIVE.left, y + 40 * g, WIDTH, { weight: 600, size: SIZE.s, family: FAMILY.label, color: pal.sage }, { maxLines: 1, role: 'streak' });
    y = s.bottom;
  }

  const line = dailyLine({ todayStatus, streak, correct, total: history.length });
  card.para(line, LIVE.left, y + 56 * g, WIDTH, { weight: 500, size: SIZE.s, family: FAMILY.serif, color: pal.ink }, { maxLines: 2, role: 'line' });

  footer(card);
}

/** Draw the week; gaps open up until the content fills the live area. */
export function drawDailyCard(data, { theme = 'light', mochi = null, strip = null } = {}) {
  return fitCard({
    sizes: [null],
    maxGap: 2.4,
    draw: (_, gap, dry) => {
      const card = createCard(theme, 20261014, STORY, { dry });
      layout(card, data, gap, mochi, strip);
      return card;
    },
  });
}
