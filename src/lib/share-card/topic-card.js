// ============================================================
// topic-card.js: a VetWiki topic as a poster
// ============================================================
// The subject's bookplate printed in one ink on its spine's cloth (the same
// colour the volume has on the shelf), the topic's place in its course, its
// title in Noto Serif Thai, how much of it was checked against sources and
// its address. Every count comes from the article as it is on screen; a
// topic with no checked point says so in words.
// ============================================================

import {
  createCard, paper, cropMarks, masthead, footer, rule, sticker, fitCard, seedOf,
  LIVE, SIZE, FAMILY, STORY,
} from './kit.js';
import { provenanceHeadline } from '../vetwiki/schema.js';

const WIDTH = LIVE.right - LIVE.left;

/** The line under the title: the checked points and their sources, or that there are none. */
export function topicLine({ claims = 0, sources = 0 } = {}) {
  if (claims > 0 && sources > 0) return `ตรวจทาน ${claims.toLocaleString('en-US')} จุด กับแหล่งอ้างอิง ${sources.toLocaleString('en-US')} แหล่ง`;
  return provenanceHeadline(0, 0);
}

// The bookplate: a panel of the spine's cloth with the print centred on it
// in ink. The print is a mask (ink as alpha), so one file prints dark on the
// light cloth and light on the dark one.
function plate(card, art, top, height, cloth) {
  if (card.dry) return;
  const { ctx, pal } = card;
  ctx.save();
  ctx.fillStyle = cloth || pal.faint;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(LIVE.left, top, WIDTH, height, 18);
  else ctx.rect(LIVE.left, top, WIDTH, height);
  ctx.fill();
  ctx.restore();
  if (!art) return;
  const pad = 30;
  const iw = art.naturalWidth || art.width || 1;
  const ih = art.naturalHeight || art.height || 1;
  const k = Math.min((WIDTH - 2 * pad) / iw, (height - 2 * pad) / ih);
  const w = Math.max(1, Math.round(iw * k));
  const h = Math.max(1, Math.round(ih * k));
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const o = off.getContext('2d');
  o.drawImage(art, 0, 0, w, h);
  o.globalCompositeOperation = 'source-in';
  o.fillStyle = pal.ink;
  o.fillRect(0, 0, w, h);
  ctx.drawImage(off, LIVE.left + (WIDTH - w) / 2, top + (height - h) / 2);
}

function layout(card, data, size, gap, { art, cloth, mochi }) {
  const { pal } = card;
  const g = gap;
  paper(card);
  cropMarks(card);
  sticker(card, mochi);
  masthead(card, 'VetWiki', data.subjectName || '');

  const plateH = 360;
  const plateTop = LIVE.top + 8;
  plate(card, art, plateTop, plateH, cloth);
  let y = plateTop + plateH + 44 * g;

  if (data.chapter?.index && data.chapter?.count) {
    const k = card.para(`หัวข้อที่ ${data.chapter.index} จาก ${data.chapter.count}`, LIVE.left, y, WIDTH,
      { weight: 600, size: SIZE.xs, family: FAMILY.label, color: pal.sage }, { maxLines: 1, role: 'kicker' });
    y = k.lineBottom + 18 * g;
  }
  // Each language on its own line, as on the featured book: "Rabies —
  // โรคพิษสุนัขบ้า" broke after "โรค" when set as one paragraph.
  for (const part of String(data.title).split(/\s+[—–]\s+/)) {
    const t = card.para(part, LIVE.left, y, WIDTH,
      { weight: 700, size, family: FAMILY.serif, color: pal.ink }, { maxLines: 3, leading: 1.28, role: 'title' });
    y = t.lineBottom + size * 0.12;
  }
  y += 34 * g;
  rule(card, y);
  y += 30 * g;
  const line = card.para(topicLine(data), LIVE.left, y, WIDTH,
    { weight: 600, size: SIZE.xs, family: FAMILY.label, color: data.claims > 0 ? pal.sage : pal.soft }, { maxLines: 2, role: 'line' });
  y = line.lineBottom + 14 * g;
  if (data.conflicts > 0) {
    const c = card.para(`หลักฐานไม่ตรงกับที่บรรยาย ${data.conflicts} จุด`, LIVE.left, y, WIDTH,
      { weight: 600, size: SIZE.xs, family: FAMILY.label, color: pal.rose }, { maxLines: 1, role: 'conflicts' });
    y = c.lineBottom + 14 * g;
  }
  card.para(data.address, LIVE.left, y + 10 * g, WIDTH,
    { weight: 400, size: SIZE.xs, family: FAMILY.numeral, color: pal.soft }, { maxLines: 3, balance: false, role: 'address' });
  footer(card);
}

const TITLE_STEPS = [108, 96, 84, 72, 64, 56, 48];

/**
 * Draw the card: the largest title that lets everything fit, then the gaps
 * opened until the content fills the live area.
 * @param {{ title: string, subjectName: string, chapter?: { index: number, count: number },
 *   claims: number, sources: number, conflicts: number, address: string }} data
 * @returns {{ card, problems: string[] }}
 */
export function drawTopicCard(data, { theme = 'light', art = null, cloth = null, mochi = null } = {}) {
  return fitCard({
    sizes: TITLE_STEPS,
    maxGap: 2,
    draw: (size, gap, dry) => {
      const card = createCard(theme, seedOf(data.address || data.title || 'vetwiki'), STORY, { dry });
      layout(card, data, size, gap, { art, cloth, mochi });
      return card;
    },
  });
}
