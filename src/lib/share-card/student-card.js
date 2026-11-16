// ============================================================
// student-card.js: "การ์ดของฉัน" as a share image
// ============================================================
// Draws the face cardFace() gives (lib/card-style.js), the same one the
// studio's preview and a classmate's card show: the same colours, the same
// plate cropped the same way (cover, anchored bottom centre, as the preview's
// object-position 50% 100%), the same words. Proportions follow the preview's
// container units (styles-card.css), so the picture looks like the card.
// The card sits in the middle of the 4:5 core, so the story and the feed post
// carry it whole.
// ============================================================

import { createCard, paper, masthead, footer, picture, fitCard, thaiDate, STORY, LIVE, CORE, FAMILY } from './kit.js';

import { darkPlatePixel } from '../card-style.js';

const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
export const CARD_RATIO = 1.586;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

/** Where the card sits on the story: the live width, centred in the core. */
export function cardBox() {
  const w = LIVE.right - LIVE.left;
  const h = Math.round(w / CARD_RATIO);
  return { x: LIVE.left, y: Math.round((CORE.top + CORE.bottom) / 2 - h / 2), w, h };
}

/** The plate's cover crop, anchored bottom centre: the source rectangle drawn. */
export function coverCrop(iw, ih, w, h) {
  const s = Math.max(w / iw, h / ih);
  const sw = w / s;
  const sh = h / s;
  return { sx: (iw - sw) * 0.5, sy: ih - sh, sw, sh };
}

/**
 * The plate in negative, as the preview's CSS filter prints it in dark mode
 * (darkPlatePixel). null when the pixels cannot be read; the plate is then
 * drawn as it is.
 */
function negative(img, crop, w, h) {
  try {
    const off = document.createElement('canvas');
    off.width = Math.round(w);
    off.height = Math.round(h);
    const o = off.getContext('2d', { willReadFrequently: true });
    o.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, off.width, off.height);
    const data = o.getImageData(0, 0, off.width, off.height);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      const [r, g, b] = darkPlatePixel(px[i], px[i + 1], px[i + 2]);
      px[i] = r; px[i + 1] = g; px[i + 2] = b;
    }
    o.putImageData(data, 0, 0);
    return off;
  } catch {
    return null;
  }
}

function frame(card, face, box, u) {
  if (card.dry) return;
  const { ctx } = card;
  const c = face.colours;
  const r = 16 * (box.w / 360);
  ctx.save();
  if (face.frame === 'foil') {
    const stops = c.foil;
    let grad;
    if (typeof ctx.createConicGradient === 'function') {
      grad = ctx.createConicGradient((210 - 90) * (Math.PI / 180), box.x + box.w / 2, box.y + box.h / 2);
      [...stops, stops[0]].forEach((s, i, all) => grad.addColorStop(i / (all.length - 1), s));
    } else {
      grad = ctx.createLinearGradient(box.x, box.y, box.x + box.w, box.y + box.h);
      stops.forEach((s, i) => grad.addColorStop(i / (stops.length - 1), s));
    }
    ctx.lineWidth = 3 * (box.w / 360);
    ctx.strokeStyle = grad;
    roundRect(ctx, box.x, box.y, box.w, box.h, r);
    ctx.stroke();
  } else if (face.frame === 'gilt') {
    ctx.strokeStyle = c.gold;
    ctx.lineWidth = 2 * (box.w / 360);
    roundRect(ctx, box.x, box.y, box.w, box.h, r);
    ctx.stroke();
    ctx.lineWidth = 0.3 * u;
    const i = 1.15 * u;
    roundRect(ctx, box.x + i, box.y + i, box.w - 2 * i, box.h - 2 * i, Math.max(2, r - i));
    ctx.stroke();
  } else {
    ctx.strokeStyle = c.rule;
    ctx.lineWidth = box.w / 360;
    roundRect(ctx, box.x, box.y, box.w, box.h, r);
    ctx.stroke();
    if (face.frame === 'ledger') {
      ctx.strokeStyle = c.soft;
      ctx.lineWidth = 0.3 * u;
      const i = 1.4 * u;
      roundRect(ctx, box.x + i, box.y + i, box.w - 2 * i, box.h - 2 * i, Math.max(2, r - i));
      ctx.stroke();
    }
  }
  if (face.frame === 'seal') {
    const d = 13 * u;
    ctx.translate(box.x + box.w - 4 * u - d / 2, box.y + box.h * 0.34 + d / 2);
    ctx.rotate((-12 * Math.PI) / 180);
    ctx.globalAlpha = 0.75;
    ctx.setLineDash([5 * (box.w / 360), 4 * (box.w / 360)]);
    ctx.strokeStyle = c.seal;
    ctx.lineWidth = 1.5 * (box.w / 360);
    ctx.beginPath();
    ctx.arc(0, 0, d / 2, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function layout(card, face, art, gap) {
  const { ctx } = card;
  const c = face.colours;
  const box = cardBox();
  const u = box.w / 100;
  const r = 16 * (box.w / 360);
  paper(card);
  // The house masthead, as on every share card: what this is, and when.
  masthead(card, 'การ์ดของฉัน', thaiDate(new Date()));

  // Stock, shadow, plate.
  if (!card.dry) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 8 * (box.w / 360) * 2;
    ctx.shadowOffsetY = 3.2 * (box.w / 360);
    ctx.fillStyle = c.stock;
    roundRect(ctx, box.x, box.y, box.w, box.h, r);
    ctx.fill();
    ctx.restore();
    if (art.plate) {
      ctx.save();
      roundRect(ctx, box.x, box.y, box.w, box.h, r);
      ctx.clip();
      ctx.globalAlpha = c.plateOpacity;
      const iw = art.plate.naturalWidth || art.plate.width || 1;
      const ih = art.plate.naturalHeight || art.plate.height || 1;
      const { sx, sy, sw, sh } = coverCrop(iw, ih, box.w, box.h);
      const plate = face.theme === 'dark' ? negative(art.plate, { sx, sy, sw, sh }, box.w, box.h) : null;
      if (plate) ctx.drawImage(plate, box.x, box.y, box.w, box.h);
      else ctx.drawImage(art.plate, sx, sy, sw, sh, box.x, box.y, box.w, box.h);
      ctx.restore();
    }
  }
  frame(card, face, box, u);

  const left = box.x + 4.45 * u;
  const right = box.x + box.w - 4.45 * u;
  const top = box.y + 3.9 * u;
  const bottom = box.y + box.h - 3.4 * u;

  // Top line: the brand, and the year on the right.
  const brandSize = Math.max(14 * 2.4, 4.2 * u);
  const brandBase = top + brandSize;
  card.text(face.brand, left, brandBase, { weight: 600, size: brandSize, family: FAMILY.serif, color: c.brand }, 'brand');
  if (face.yearLine) card.text(face.yearLine, right, brandBase, { weight: 500, size: Math.max(36, 3.9 * u), family: FAMILY.label, color: c.soft, align: 'right' }, 'year');

  // Foot: the numbers on the left, the trophies on the right, under a rule.
  const labelSize = Math.max(36, 3.9 * u);
  const valueSize = Math.max(36, 5 * u);
  const shelf = Math.max(26 * 2.4, 8.9 * u);
  const footH = face.stats.length ? labelSize * 1.2 + valueSize * 1.3 : face.trophies.length ? shelf : 0;
  const ruleY = bottom - footH - 2.2 * u;
  if (footH && !card.dry) {
    ctx.save();
    ctx.strokeStyle = c.rule;
    ctx.lineWidth = box.w / 360;
    ctx.beginPath();
    ctx.moveTo(left, ruleY);
    ctx.lineTo(right, ruleY);
    ctx.stroke();
    ctx.restore();
  }
  let x = left;
  for (const s of face.stats) {
    const lb = card.text(s.label, x, ruleY + 2.2 * u + labelSize, { weight: 500, size: labelSize, family: FAMILY.label, color: c.soft }, 'stat');
    const vb = card.text(s.value, x, bottom - valueSize * 0.25, { weight: 600, size: valueSize, family: FAMILY.numeral, color: c.ink }, 'stat');
    const ub = card.text(s.unit, vb.right + 3 * (box.w / 360), bottom - valueSize * 0.25, { weight: 500, size: Math.max(36, 14 * (box.w / 360)), family: FAMILY.label, color: c.soft }, 'stat');
    x = Math.max(lb.right, ub.right) + 5 * u;
  }
  if (!card.dry) {
    face.trophies.forEach((t, i) => {
      const img = art.trophies[i];
      if (!img) return;
      const tx = right - (face.trophies.length - i) * (shelf + 2);
      ctx.drawImage(img, tx, bottom - shelf, shelf, shelf);
    });
  }

  // Body: the picture in its ring, the name and the title beside it.
  const bodyTop = brandBase + 1.5 * u;
  const bodyBottom = footH ? ruleY : bottom;
  const ring = 23.3 * u;
  const cy = (bodyTop + bodyBottom) / 2;
  const cx = left + ring / 2;
  if (!card.dry) {
    ctx.save();
    ctx.fillStyle = c.stock;
    ctx.beginPath(); ctx.arc(cx, cy, ring / 2 + 1.4 * u + 1, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c.soft; ctx.lineWidth = box.w / 360;
    ctx.beginPath(); ctx.arc(cx, cy, ring / 2 + 1.4 * u, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = c.rule;
    ctx.beginPath(); ctx.arc(cx, cy, ring / 2, 0, Math.PI * 2); ctx.stroke();
    if (face.picture) {
      ctx.font = `${Math.round(12 * u)}px ${EMOJI_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(face.picture, cx, cy + 0.04 * ring);
    }
    ctx.restore();
  }
  const textLeft = left + ring + 3.9 * u;
  const textWidth = right - textLeft - (face.frame === 'seal' ? 14 * u : 0);
  const nameSize = Math.max(17 * 2.4, 6.7 * u) * gap;
  const titleSize = Math.max(36, 3.9 * u);
  card.style({ weight: 600, size: nameSize, family: FAMILY.serif });
  const nameLines = card.measure(face.name) > textWidth ? 2 : 1;
  const blockH = nameSize * 1.2 * nameLines + (face.title ? titleSize * 1.6 : 0);
  const name = card.para(face.name, textLeft, cy - blockH / 2, textWidth,
    { weight: 600, size: nameSize, family: FAMILY.serif, color: c.ink }, { maxLines: 2, balance: false, leading: 1.2, role: 'name' });
  if (face.title) {
    card.para(face.title, textLeft, name.lineBottom + 1 * u, textWidth,
      { weight: 600, size: titleSize, family: FAMILY.label, color: c.title }, { maxLines: 1, role: 'title' });
  }

  footer(card);
}

/** Load the plate and the trophies the face names (missing ones are skipped). */
export async function cardArt(face) {
  const [plate, ...trophies] = await Promise.all([picture(face.backdrop.src), ...face.trophies.map((t) => picture(t.src))]);
  return { plate, trophies };
}

/** The share image for a face; `art` from cardArt(). */
export function drawStudentCard(face, { art = { plate: null, trophies: [] } } = {}) {
  const theme = face.theme === 'dark' ? 'dark' : 'light';
  return fitCard({
    sizes: [1, 0.9, 0.8],
    maxGap: 1,
    draw: (size, _gap, dry) => {
      const card = createCard(theme, 20261116, STORY, { dry });
      layout(card, face, art, size);
      return card;
    },
  });
}
