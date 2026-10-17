// A profile's link preview (1200 x 630 JPEG), drawn in the student's own browser after they save
// their profile, so a Thai name is set by the browser's own text engine in the site's fonts. It
// is kept as <uid>/avatar/og.jpg in their storage folder, and api/u.js points a shared
// /u/<handle> link at it. The composition follows the site's covers (scripts/render-og.mjs): the
// gallery wall, the lockup, the address at the foot. On it, the profile card from the setup steps
// on its stack of paper, the student's own plates (their focus domains) fanned beside it like a
// hand of cards, and the member stamp pressed across both.

import { CARD_BY_ID, DOMAIN_CARDS } from '../lib/bank.js';

const W = 1200;
const H = 630;
// Light-theme tokens (styles/tokens.css, online.css): a cover is the same in either theme.
const C = {
  wall: '#f1efe9', ink: '#15171a', ink2: '#474c54', ink3: '#5f646b', paper: '#fbfaf7', verdText: '#176a54',
  margin: 'rgba(180, 67, 45, .42)', rule: 'rgba(28, 49, 146, .13)', line: 'rgba(21, 23, 26, .09)', stamp: '#1d7a62', markVerd: '#2a9a7b',
};
const TONES = {
  verd: ['#1d7a62', 'rgba(29, 122, 98, .11)'], brass: ['#7f581a', 'rgba(201, 154, 69, .16)'], cinn: ['#b4432d', 'rgba(180, 67, 45, .10)'],
  cobalt: ['#3048b4', 'rgba(48, 72, 180, .12)'], plum: ['#8a3f86', 'rgba(138, 63, 134, .12)'], ink: ['#474c54', 'rgba(21, 23, 26, .09)'],
};
// Plates for a profile that has not chosen its domains: the community cover's first three.
const DEFAULT_PLATES = [6, 11, 9];
const rad = (deg) => (deg * Math.PI) / 180;

const fonts = () => {
  const css = getComputedStyle(document.documentElement);
  const v = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  return { serif: v('--serif', 'serif'), sans: v('--sans', 'sans-serif'), mono: v('--mono', 'monospace') };
};

function loadImage(src, cors = false) {
  return new Promise((resolve) => {
    if (!src) { resolve(null); return; }
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// The same specks on every redraw of one profile: a small seeded generator (mulberry32).
function seeded(text) {
  let a = [...String(text)].reduce((h, ch) => Math.imul(h ^ ch.codePointAt(0), 2654435761) >>> 0, 1779033703);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** The largest size from `sizes` at which `text` fits `width`; at the smallest, cut with an ellipsis. */
function fit(ctx, text, width, sizes, font) {
  for (const s of sizes) {
    ctx.font = font(s);
    if (ctx.measureText(text).width <= width) return text;
  }
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > width) t = t.slice(0, -1);
  return `${t}…`;
}

function wall(ctx) {
  ctx.fillStyle = C.wall;
  ctx.fillRect(0, 0, W, H);
  // The covers' light: verdigris from the top left, brass from the bottom right.
  for (const [x, y, r, color] of [[80, 40, 720, 'rgba(29, 122, 98, .10)'], [1160, 640, 680, 'rgba(201, 154, 69, .16)']]) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

function lockup(ctx, f, x, y) {
  // components/Mark.jsx at 40 units of 64.
  const k = 40 / 64;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = C.ink;
  roundRect(ctx, 0, 0, 64, 64, 14);
  ctx.fill();
  const toe = (cx, cy, rx, ry, deg, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rad(deg), 0, Math.PI * 2); ctx.fill(); };
  toe(32, 42.25, 11.5, 9.25, 0, '#ffffff');
  toe(18.5, 29, 4.5, 6, -18, '#ffffff');
  toe(26.5, 19.75, 4.25, 5.75, -6, '#ffffff');
  toe(45.5, 29, 4.5, 6, 18, '#ffffff');
  toe(37.5, 19.75, 4.25, 5.75, 6, C.markVerd);
  ctx.restore();
  ctx.fillStyle = C.ink;
  ctx.font = `700 26px ${f.sans}`;
  ctx.textBaseline = 'middle';
  ctx.fillText('VetMock', x + 54, y + 21);
  const nameW = ctx.measureText('VetMock').width;
  ctx.fillStyle = C.ink3;
  ctx.fillRect(x + 54 + nameW + 14, y + 10, 1.5, 22);
  ctx.font = `500 15px ${f.mono}`;
  // The lockup's .16em tracking where the canvas can track; spaced letters where it cannot.
  if ('letterSpacing' in ctx) ctx.letterSpacing = '2.4px';
  ctx.fillText('letterSpacing' in ctx ? 'VCA' : 'V C A', x + 54 + nameW + 30, y + 21);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
}

function plate(ctx, f, card, img, cx, cy, deg) {
  const w = 176;
  const h = 214;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rad(deg));
  ctx.shadowColor = 'rgba(20, 23, 26, .20)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = card.paper || '#efe9dc';
  roundRect(ctx, -w / 2, -h / 2, w, h, 16);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.stroke();
  if (img) {
    const box = { x: -w / 2 + 16, y: -h / 2 + 16, w: w - 32, h: h - 58 };
    const s = Math.min(box.w / img.width, box.h / img.height);
    const dw = img.width * s;
    const dh = img.height * s;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(img, box.x + (box.w - dw) / 2, box.y + (box.h - dh) / 2, dw, dh);
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.fillStyle = C.ink3;
  ctx.font = `500 13px ${f.mono}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`PL. ${String(card.plate).padStart(2, '0')}`, -w / 2 + 16, h / 2 - 16);
  ctx.restore();
}

function avatar(ctx, profile, photo, x, y, d) {
  const [tone, soft] = TONES[profile.tone] || TONES.verd;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2);
  ctx.clip();
  if (photo) {
    const s = Math.max(d / photo.width, d / photo.height);
    ctx.drawImage(photo, x + (d - photo.width * s) / 2, y + (d - photo.height * s) / 2, photo.width * s, photo.height * s);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, d, d);
    ctx.fillStyle = soft;
    ctx.fillRect(x, y, d, d);
    // A colour emoji is drawn at the fill's opacity: give it an opaque one.
    ctx.fillStyle = '#000000';
    ctx.font = `${Math.round(d * 0.5)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(profile.avatar || '🐾', x + d / 2, y + d / 2 + d * 0.03);
  }
  ctx.restore();
  // The ring the site draws around an avatar: paper, then the tone.
  ctx.lineWidth = 3;
  ctx.strokeStyle = tone;
  ctx.beginPath();
  ctx.arc(x + d / 2, y + d / 2, d / 2 + 5, 0, Math.PI * 2);
  ctx.stroke();
}

function card(ctx, f, profile, photo, x, y, w, h, deg) {
  const sheet = (dx, dy, turn, shade) => {
    ctx.save();
    ctx.translate(x + w / 2 + dx, y + h / 2 + dy);
    ctx.rotate(rad(deg + turn));
    ctx.shadowColor = 'rgba(20, 23, 26, .16)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 14;
    ctx.fillStyle = shade;
    roundRect(ctx, -w / 2, -h / 2, w, h, 22);
    ctx.fill();
    ctx.restore();
  };
  // The pile under it, a little askew, as in ProfileCard.
  sheet(9, 11, 2.2, '#f2efe8');
  sheet(-7, 6, -1.4, '#f6f3ed');

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rad(deg));
  ctx.translate(-w / 2, -h / 2);
  ctx.shadowColor = 'rgba(20, 23, 26, .22)';
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = C.paper;
  roundRect(ctx, 0, 0, w, h, 22);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // The red margin line, then rules 44 px apart under the facts (24 px type on a 44 px line).
  ctx.fillStyle = C.margin;
  ctx.fillRect(34, 0, 2.5, h);
  ctx.fillStyle = C.rule;
  for (let ry = 248; ry < h - 10; ry += 44) ctx.fillRect(58, ry, w - 96, 1.5);

  const d = 136;
  avatar(ctx, profile, photo, 64, 44, d);
  const textX = 64 + d + 34;
  // The name stops short of the stamp: its circle (centre 712, 160, radius 92 on the cover)
  // reaches x = 629 at the name's cap height, which is 565 on the card, less a 10 px gap.
  const textW = Math.min(w - textX - 44, 555 - textX);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = C.ink;
  const name = fit(ctx, profile.name || '', textW, [70, 62, 54, 46, 40], (s) => `400 ${s}px ${f.serif}`);
  ctx.fillText(name, textX, 118);
  ctx.fillStyle = C.ink3;
  ctx.font = `500 25px ${f.mono}`;
  ctx.fillText(fit(ctx, `@${profile.handle}`, textW, [25], (s) => `500 ${s}px ${f.mono}`), textX, 162);

  const facts = [profile.school, profile.cohort, profile.round ? `สอบรอบ ${profile.round}` : ''].filter(Boolean).join('   ');
  ctx.fillStyle = C.ink2;
  if (facts) ctx.fillText(fit(ctx, facts, w - 120, [25, 22], (s) => `400 ${s}px ${f.sans}`), 64, 238);
  const focus = (profile.focus || []).map((id) => CARD_BY_ID[id]?.th).filter(Boolean);
  if (focus.length) {
    ctx.fillStyle = C.verdText;
    const more = focus.length > 3 ? `   +${focus.length - 3}` : '';
    ctx.fillText(fit(ctx, focus.slice(0, 3).join('   ') + more, w - 120, [25, 22], (s) => `500 ${s}px ${f.sans}`), 64, facts ? 282 : 238);
  }
  ctx.restore();
}

function stamp(ctx, f, day, seed, cx, cy, r) {
  const size = Math.ceil(r * 2 + 12);
  const s = document.createElement('canvas');
  s.width = size;
  s.height = size;
  const g = s.getContext('2d');
  const c = size / 2;
  g.strokeStyle = C.stamp;
  g.fillStyle = C.stamp;
  g.lineWidth = r * 0.055;
  g.beginPath();
  g.arc(c, c, r * 0.94, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = r * 0.02;
  g.beginPath();
  g.arc(c, c, r * 0.84, 0, Math.PI * 2);
  g.stroke();
  // The arc of capitals over the top, each letter turned to the circle (ProfileCard's textPath).
  const text = 'VETMOCK VCA COMMUNITY';
  g.font = `600 ${r * 0.15}px ${f.mono}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const spread = Math.PI * 1.2;
  [...text].forEach((ch, i) => {
    const a = -Math.PI / 2 - spread / 2 + ((i + 0.5) * spread) / text.length;
    g.save();
    g.translate(c + Math.cos(a) * r * 0.71, c + Math.sin(a) * r * 0.71);
    g.rotate(a + Math.PI / 2);
    g.fillText(ch, 0, 0);
    g.restore();
  });
  g.font = `700 ${r * 0.32}px ${f.sans}`;
  g.fillText('สมาชิก', c, c + r * 0.08);
  g.font = `600 ${r * 0.17}px ${f.mono}`;
  g.fillText(day, c, c + r * 0.4);
  // A rubber stamp never inks evenly: knock out a scatter of specks.
  const rand = seeded(seed);
  g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 1400; i += 1) {
    g.globalAlpha = rand() * 0.55;
    g.fillRect(rand() * size, rand() * size, 1 + rand() * 1.8, 1 + rand() * 1.8);
  }
  ctx.save();
  ctx.globalAlpha = 0.86;
  ctx.globalCompositeOperation = 'multiply';
  ctx.translate(cx, cy);
  ctx.rotate(rad(-12));
  ctx.drawImage(s, -c, -c);
  ctx.restore();
}

function address(ctx, f, handle) {
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.font = `700 22px ${f.mono}`;
  ctx.fillStyle = C.ink;
  ctx.fillText('vca', 64, 586);
  const x = 64 + ctx.measureText('vca').width;
  ctx.font = `500 22px ${f.mono}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(`.vetmock.com/u/${handle}`, x, 586);
}

/**
 * Draw the cover for a saved profile.
 * @param {object} profile  the profile shape from online/shapes.js
 * @param {{ photoUrl?: string }} [opts]  where the profile photo can be read from (CORS-enabled)
 * @returns {Promise<Blob>} a 1200 x 630 JPEG
 */
export async function drawCover(profile, { photoUrl = '' } = {}) {
  const f = fonts();
  // The canvas uses the page's fonts only once they are loaded; ask for exactly the glyphs.
  const sample = `${profile.name || ''}${profile.school || ''}สมาชิก`;
  await Promise.all([
    document.fonts.load(`400 70px ${f.serif}`, sample),
    document.fonts.load(`400 25px ${f.sans}`, sample),
    document.fonts.load(`700 26px ${f.sans}`, 'VetMock'),
    document.fonts.load(`500 25px ${f.mono}`, `@${profile.handle || ''}VCA`),
  ]).catch(() => {});

  const focus = (profile.focus || []).map((id) => CARD_BY_ID[id]).filter(Boolean);
  const plates = (focus.length ? focus : DOMAIN_CARDS.filter((d) => DEFAULT_PLATES.includes(d.plate))).slice(0, 3);
  const [photo, ...arts] = await Promise.all([loadImage(photoUrl, true), ...plates.map((d) => loadImage(d.art))]);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  wall(ctx);
  lockup(ctx, f, 64, 50);
  // A hand of plates: back to front, fanned about a point below them.
  const fan = [[[6, -6, 3]], [[-70, 10, -7], [74, 6, 8]], [[-128, 18, -11], [6, -6, 3], [138, 26, 14]]][plates.length - 1] || [];
  plates.forEach((d, i) => plate(ctx, f, d, arts[i], 930 + fan[i][0], 318 + fan[i][1], fan[i][2]));
  card(ctx, f, profile, photo, 64, 130, 664, 372, -1.6);
  const day = new Date(profile.onboardedAt || profile.createdAt || Date.now()).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  stamp(ctx, f, day, profile.handle || 'vca', 712, 160, 92);
  address(ctx, f, profile.handle || '');
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('cover failed'))), 'image/jpeg', 0.9));
}

// Bump when the drawing changes, so every profile's cover is drawn again on its next save or
// its owner's next visit.
const COVER_VERSION = 1;
const signature = (p) => JSON.stringify([COVER_VERSION, p.name, p.handle, p.photo, p.avatar, p.tone, p.school, p.cohort, p.round, p.focus, p.onboardedAt]);

/**
 * Draw and store the cover when the profile it shows has changed since the last one this device
 * drew. Quiet on failure: a profile without a cover shares with the community cover.
 * @param {object} profile  the owner's own saved profile
 * @param {object} backend  online/live.js or online/demo.js
 */
export async function refreshCover(profile, backend) {
  if (!profile?.handle || !backend?.media?.putCover) return;
  const key = `vca:cover:${profile.handle}`;
  const sig = signature(profile);
  try { if (localStorage.getItem(key) === sig) return; } catch { /* storage blocked: draw it */ }
  try {
    const blob = await drawCover(profile, { photoUrl: profile.photo ? backend.media.url(profile.photo, { width: 280 }) : '' });
    await backend.media.putCover(blob);
    try { localStorage.setItem(key, sig); } catch { /* next visit draws it again */ }
  } catch (err) {
    console.warn('profile cover not saved', err);
  }
}
