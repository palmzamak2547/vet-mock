// ============================================================
// phase-card.js: the end-of-term recap as a poster
// ============================================================
// One idea: how many questions the student worked through this term. Under
// it, the rhythm of the last 30 days drawn as a heart trace on ECG paper
// (each beat a day, its height that day's questions), three supporting
// figures, the best and the weakest subject, and one line in plain Thai
// that is true of these numbers.
//
// Study time is a 45 s a question estimate unless every answer carried its
// own duration (buildPhaseStats says which), so it is printed with "~".
// ============================================================

import {
  createCard, paper, cropMarks, masthead, footer, rule, ghostNumeral, sticker, plateBand, fitCard,
  LIVE, SIZE, FAMILY, W, CORE, STORY,
} from './kit.js';
import { CARD_PLATES } from '../../data/art.js';
import { studyTime, subjectRows } from '../phase-wrapped.js';

/** The frieze over the recap: Muybridge's trotting horse, a term as a gait. */
export const PHASE_STRIP = CARD_PLATES.phase;

const WIDTH = LIVE.right - LIVE.left;

/** Thai academic year of a date: term 1 starts mid-year, term 2 ends in May. */
export function academicYear(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return (d.getMonth() + 1 >= 6 ? d.getFullYear() : d.getFullYear() - 1) + 543;
}

/** One line that is true of these numbers, from the best claim down. */
export function phaseLine(stats) {
  const { qCount = 0, correctPct = 0, longestStreak = 0 } = stats || {};
  if (qCount === 0) return '';
  // The shown percentage is rounded; the 60% bar is judged on the exact count.
  const ratio = typeof stats.correct === 'number' ? stats.correct / qCount : correctPct / 100;
  if (correctPct >= 85 && longestStreak >= 7) return 'ทั้งแม่นและสม่ำเสมอ';
  if (correctPct >= 80) return 'แม่นยำใช้ได้ อ่านต่อให้ติดเป็นนิสัย';
  if (longestStreak >= 14) return 'อ่านติดกันสองสัปดาห์ขึ้นไป นี่คือวินัย';
  if (qCount >= 500) return 'ทำไปห้าร้อยข้อแล้ว ใจสู้จริง';
  if (ratio >= 0.6) return 'ถึงเกณฑ์ซ้อมแล้ว รอบหน้าไปให้ไกลกว่านี้';
  return 'ทุกข้อที่ทำ คือทางที่เดินมาแล้ว';
}


// A pale grid of small squares with a bolder line every fifth, and over it
// one beat per day: a flat line on a day with no questions.
function ecg(card, days, top, height) {
  const { ctx, pal } = card;
  const ink = pal;
  const left = LIVE.left;
  const minor = WIDTH / 60;
  const list = days.length ? days : [{ qs: 0 }];
  const base = top + height * 0.74;
  const reach = height * 0.64;
  const pitch = WIDTH / list.length;
  const most = Math.max(1, ...list.map((d) => d.qs));
  let best = -1;
  list.forEach((d, i) => { if (d.qs > 0 && (best < 0 || d.qs >= list[best].qs)) best = i; });
  const peak = best < 0 ? null : {
    x: left + (best + 0.5) * pitch,
    y: base - (12 + (reach - 12) * (list[best].qs / most)),
    qs: list[best].qs,
  };
  // A trial layout needs only where the peak is, for its label.
  if (card.dry) return peak;
  ctx.save();
  ctx.lineWidth = 1;
  for (let i = 0; i <= 60; i++) {
    const x = left + i * minor;
    ctx.strokeStyle = i % 5 === 0 ? ink.gridMajor : ink.gridMinor;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, top + height); ctx.stroke();
  }
  for (let i = 0; i * minor <= height + 0.5; i++) {
    const y = top + i * minor;
    ctx.strokeStyle = i % 5 === 0 ? ink.gridMajor : ink.gridMinor;
    ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(LIVE.right, y); ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = ink.trace;
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(left, base);
  list.forEach((d, i) => {
    const x = left + (i + 0.5) * pitch;
    if (d.qs > 0) {
      const a = 12 + (reach - 12) * (d.qs / most);
      ctx.lineTo(x - 8, base);
      ctx.lineTo(x - 4, base + a * 0.1);
      ctx.lineTo(x, base - a);
      ctx.lineTo(x + 4.5, base + a * 0.2);
      ctx.lineTo(x + 8, base);
      ctx.quadraticCurveTo(x + 11, base - a * 0.12, x + 14, base);
    }
    ctx.lineTo(left + (i + 1) * pitch, base);
  });
  ctx.stroke();
  if (peak) {
    ctx.fillStyle = ink.trace;
    ctx.beginPath(); ctx.arc(peak.x, peak.y, 7, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  return peak;
}

function layout(card, stats, heroSize, g = 1, mochi = null, strip = null, withLine = true) {
  const { ctx, pal } = card;
  const year = stats.phaseEnd ? academicYear(stats.phaseEnd) : null;
  paper(card);
  cropMarks(card);
  if (year) ghostNumeral(card, year, { baseline: CORE.bottom + 470, size: 560, x: W + 30 });
  sticker(card, mochi);
  plateBand(card, strip, 'Eadweard Muybridge, 1882');
  masthead(card, stats.phaseCompleted ? 'สรุปช่วงสอบ' : 'สรุปช่วงสอบ ระหว่างทาง', year ? `ปีการศึกษา ${year}` : '');

  // The term, as large as one line allows.
  const titleSize = card.fit(stats.phaseLabel, WIDTH, { weight: 700, max: SIZE.l, min: SIZE.m });
  const title = card.para(stats.phaseLabel, LIVE.left, LIVE.top, WIDTH,
    { weight: 700, size: titleSize, family: FAMILY.serif, color: pal.ink }, { maxLines: 2, role: 'title' });

  // Hero: questions answered. Beside it, stacked, what the number counts.
  const n = Number(stats.qCount || 0).toLocaleString('en-US');
  const heroBase = title.bottom + 44 * g + heroSize * 0.72;
  const hero = card.textInk(n, LIVE.left, heroBase, { weight: 800, size: heroSize, family: FAMILY.numeral, color: pal.ink }, 'hero');
  card.style({ weight: 600, size: SIZE.m, family: FAMILY.serif });
  const unitW = card.measure('ข้อ');
  let heroBottom = hero.bottom;
  if (hero.right + 28 + Math.max(unitW, 170) <= LIVE.right) {
    const x = hero.right + 28;
    const unit = card.text('ข้อ', x, heroBase, { weight: 600, size: SIZE.m, family: FAMILY.serif, color: pal.ink }, 'hero-unit');
    card.text('ฝึกไปแล้ว', x, unit.top - 22, { weight: 500, size: SIZE.xs, family: FAMILY.label, color: pal.soft }, 'hero-label');
  } else {
    const label = card.para('ข้อที่ฝึกไปแล้ว', LIVE.left, hero.bottom + 18, WIDTH,
      { weight: 500, size: SIZE.s, family: FAMILY.label, color: pal.soft }, { maxLines: 1, role: 'hero-label' });
    heroBottom = label.bottom;
  }

  // The rhythm strip, when the last 30 days hold any answers: an empty month
  // drew a flat trace, which a vet reads as asystole.
  let figTop = heroBottom + 48 * g;
  if ((stats.byDay || []).some((d) => d.qs > 0)) {
    const stripLabel = card.para('จังหวะการอ่าน 30 วันล่าสุด', LIVE.left, heroBottom + 48 * g, WIDTH,
      { weight: 500, size: SIZE.xs, family: FAMILY.label, color: pal.soft }, { maxLines: 1, role: 'strip-label' });
    const stripTop = stripLabel.bottom + 16;
    const stripH = 126;
    const peak = ecg(card, stats.byDay, stripTop, stripH);
    if (peak) {
      const label = `สูงสุด ${peak.qs.toLocaleString('en-US')} ข้อ`;
      card.style({ weight: 600, size: SIZE.xs, family: FAMILY.label });
      const room = peak.x + 18 + card.measure(label) <= LIVE.right;
      card.padded(label, room ? peak.x + 18 : peak.x - 18, Math.max(stripTop + 40, peak.y + 13),
        { weight: 600, size: SIZE.xs, family: FAMILY.label, color: pal.ink, align: room ? 'left' : 'right' }, 'peak');
    }
    figTop = stripTop + stripH + 48 * g;
  }

  // Three figures, each a label over a numeral, divided by hairlines. The
  // numerals share one size, the largest at which each fits its column.
  const gutter = 40;
  const colW = (WIDTH - 2 * gutter) / 3;
  const approx = stats.studyTimeEstimated !== false;
  const figs = [
    ['ความแม่นยำ', String(stats.correctPct ?? 0), '%'],
    ['ต่อเนื่องสูงสุด', Number(stats.longestStreak ?? 0).toLocaleString('en-US'), 'วัน'],
    [approx ? 'เวลาอ่านราว' : 'เวลาอ่าน', ...studyTime(stats.totalStudyMin)],
  ];
  const numeral = Math.min(...figs.map(([, value, unit]) => {
    card.style({ weight: 600, size: SIZE.xs, family: FAMILY.label });
    return card.fit(value, colW - card.measure(unit) - 10, { weight: 800, family: FAMILY.numeral, max: SIZE.l, min: SIZE.m });
  }));
  const labels = figs.map(([label], i) => card.para(label, LIVE.left + i * (colW + gutter), figTop, colW,
    { weight: 500, size: SIZE.xs, family: FAMILY.label, color: pal.soft }, { maxLines: 1, balance: false, role: 'figure-label' }));
  const figBase = Math.max(...labels.map((l) => l.bottom)) + 16 + numeral * 0.72;
  const nums = figs.map(([, value, unit], i) => {
    const x = LIVE.left + i * (colW + gutter);
    const num = card.textInk(value, x, figBase, { weight: 800, size: numeral, family: FAMILY.numeral, color: pal.ink }, 'figure');
    card.text(unit, num.right + 10, figBase, { weight: 600, size: SIZE.xs, family: FAMILY.label, color: pal.soft }, 'figure-unit');
    return num;
  });
  if (!card.dry) {
    ctx.save();
    ctx.strokeStyle = pal.rule;
    ctx.lineWidth = 1.5;
    for (let i = 1; i < 3; i++) {
      const x = LIVE.left + i * (colW + gutter) - gutter / 2;
      ctx.beginPath(); ctx.moveTo(x, figTop); ctx.lineTo(x, figBase + 12); ctx.stroke();
    }
    ctx.restore();
  }
  let y = Math.max(...nums.map((b) => b.bottom)) + 44 * g;

  // The best subject, and the weakest, quieter, under it when it is lower.
  // A long name runs to a second line instead of being cut.
  const { best, weak } = subjectRows(stats);
  if (best) {
    rule(card, y);
    const row = (label, subject, size, nameColor, labelColor, pctColor, role) => {
      card.style({ weight: 600, size: SIZE.xs, family: FAMILY.label });
      const labW = card.measure(label);
      const pct = `${subject.pct}%`;
      card.style({ weight: 700, size, family: FAMILY.numeral });
      const pctW = card.measure(pct);
      const nameFamily = size >= SIZE.s ? FAMILY.serif : FAMILY.label;
      const room = WIDTH - labW - pctW - 2 * 28;
      const nameBox = card.para(subject.name, LIVE.left + labW + 28, y + 26, room,
        { weight: 600, size, family: nameFamily, color: nameColor }, { maxLines: 2, role });
      const baseline = y + 26 + nameBox.ascent;
      card.text(label, LIVE.left, baseline, { weight: 600, size: SIZE.xs, family: FAMILY.label, color: labelColor }, `${role}-label`);
      card.text(pct, LIVE.right, baseline, { weight: 700, size, family: FAMILY.numeral, color: pctColor, align: 'right' }, `${role}-pct`);
      return nameBox.bottom;
    };
    const tone = best.single ? pal.soft : pal.sage;
    y = row(best.label, best.subject, SIZE.s, pal.ink, tone, best.single ? pal.ink : pal.sage, 'best') + 12;
    if (weak) y = row(weak.label, weak.subject, SIZE.xs, pal.ink, pal.soft, pal.soft, 'weak') + 12;
    y += 14;
    rule(card, y);
  }

  // One line that is true of these numbers.
  const line = phaseLine(stats);
  if (line && withLine) card.para(line, LIVE.left, y + 36 * g, WIDTH, { weight: 500, size: SIZE.s, family: FAMILY.serif, color: pal.ink }, { maxLines: 2, role: 'line' });

  footer(card);
}

const HERO_STEPS = [365, 324, 288, 256, 243, 216, 192, 162];

/**
 * Draw the recap: the largest hero numeral that lets everything fit, then
 * the gaps between blocks opened up (to at most twice) until the content
 * fills the live area, so a short term does not leave a hole above the
 * signature.
 * @returns {{ card, problems: string[] }} problems is empty when the layout is clean
 */
export function drawPhaseCard(stats, { theme = 'light', mochi = null, strip = null } = {}) {
  const run = (withLine) => fitCard({
    sizes: HERO_STEPS,
    draw: (size, gap, dry) => {
      const card = createCard(theme, 20261013, STORY, { dry });
      layout(card, stats, size, gap, mochi, strip, withLine);
      return card;
    },
  });
  // The closing line is the one thing a full card can do without: with two
  // long subject names it was set over the signature.
  const full = run(true);
  return full.problems.length ? run(false) : full;
}
