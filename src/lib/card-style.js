// ============================================================
// card-style.js: "การ์ดของฉัน", the style a student picks for their card
// ============================================================
// One short versioned token holds the style, the same string on this device
// (localStorage, one key per account) and in profiles.card_style for
// classmates (lib/card-style-remote.js):
//
//   c1.b<backdrop>.f<frame>.t<title>.s<trophy>,<trophy>,<trophy>
//
// Every part is optional. An unknown letter is ignored (a newer build may add
// one), a value off its list drops that part, and anything else (another
// version, over 120 characters, a character outside [a-z0-9.,-]) is no token,
// so the default card is shown. Parsing never builds an object from the
// input's keys.
//
// The picture and the name are not in the token: they are the account's own
// (profiles.avatar_emoji and username, edited on the profile's identity card).
//
// cardFace() turns a token and the student's numbers into everything the
// card shows, colours included. The studio's preview (components/StudentCard),
// a classmate's card in a group and the share image
// (lib/share-card/student-card.js) all draw from it, so the three cannot
// disagree.
// ============================================================

import { BADGE_ART, IG_BACKGROUNDS } from '../data/art.js';
import { earnedBadges, nextBadge } from './badges.js';
import { PALETTES } from './share-card/kit.js';

export const CARD_VERSION = 'c1';
export const CARD_MAX_LEN = 120;
export const MAX_ON_SHOW = 3;

/** Backdrops, all free: art.js IG_BACKGROUNDS ids plus plain paper. */
// Every one keeps all text on the card at 4.5:1 or more in light and dark
// (tests/unit/card-contrast.test.mjs); the stethoscope plate did not, so it is not offered.
export const CARD_BACKDROPS = Object.freeze(['paw-trail', 'paper', 'herb-border', 'notebook', 'dotted-grid', 'field', 'microscope', 'arch']);
/** Frames: 'plain' is free, the others are earned (FRAME_EARNED_BY). */
export const CARD_FRAMES = Object.freeze(['plain', 'ledger', 'gilt', 'foil', 'seal']);
export const FRAME_EARNED_BY = Object.freeze({ plain: null, ledger: 'questions-100', gilt: 'streak-7', foil: 'streak-30', seal: 'questions-1000' });
export const FRAME_LABEL = Object.freeze({ plain: 'เส้นบาง', ledger: 'เส้นคู่', gilt: 'ขอบทอง', foil: 'ขอบรุ้ง', seal: 'ตราประทับ' });
/** Badge ids the card may show (a unit test keeps this equal to art.js BADGE_ART). */
export const BADGE_IDS = Object.freeze(Object.keys(BADGE_ART));

/** A new student's card: finished without touching anything. */
export const DEFAULT_CARD = Object.freeze({ backdrop: 'paw-trail', frame: 'plain', title: null, trophies: Object.freeze([]) });

const BACKDROP_ART = Object.fromEntries(IG_BACKGROUNDS.map((b) => [b.id, b]));
export const backdropLabel = (id) => (id === 'paper' ? 'กระดาษเรียบ' : BACKDROP_ART[id]?.label || '');
export const backdropSrc = (id) => BACKDROP_ART[id]?.src || null;

const has = (list, v) => typeof v === 'string' && list.includes(v);
const fresh = () => ({ backdrop: DEFAULT_CARD.backdrop, frame: DEFAULT_CARD.frame, title: null, trophies: [] });

/** The card a token describes, or null when it is not a card token. */
export function parseCardToken(raw) {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > CARD_MAX_LEN) return null;
  if (!/^[a-z0-9.,-]+$/.test(raw)) return null;
  const parts = raw.split('.');
  if (parts[0] !== CARD_VERSION) return null;
  const card = fresh();
  for (const part of parts.slice(1)) {
    const tag = part[0];
    const value = part.slice(1);
    if (tag === 'b' && has(CARD_BACKDROPS, value)) card.backdrop = value;
    else if (tag === 'f' && has(CARD_FRAMES, value)) card.frame = value;
    else if (tag === 't' && has(BADGE_IDS, value)) card.title = value;
    else if (tag === 's') card.trophies = [...new Set(value.split(',').filter((id) => has(BADGE_IDS, id)))].slice(0, MAX_ON_SHOW);
  }
  return card;
}

/** The card for any stored value: a broken or missing token is the default card. */
export const readCard = (raw) => parseCardToken(raw) || fresh();

/** The token for a card; values off their lists are left out. */
export function encodeCard(card = DEFAULT_CARD) {
  const out = [CARD_VERSION];
  if (has(CARD_BACKDROPS, card.backdrop) && card.backdrop !== DEFAULT_CARD.backdrop) out.push(`b${card.backdrop}`);
  if (has(CARD_FRAMES, card.frame) && card.frame !== DEFAULT_CARD.frame) out.push(`f${card.frame}`);
  if (has(BADGE_IDS, card.title)) out.push(`t${card.title}`);
  const shown = Array.isArray(card.trophies) ? [...new Set(card.trophies.filter((id) => has(BADGE_IDS, id)))].slice(0, MAX_ON_SHOW) : [];
  if (shown.length) out.push(`s${shown.join(',')}`);
  return out.join('.');
}

export const isDefaultCard = (card) => encodeCard(card) === CARD_VERSION;

// ── What the student has earned ────────────────────────────────────────────
// From earnedBadges() over the synced history with the saved streak, the
// profile hub's own reader, so the card and the hub agree on every device.

/** Everything the card may wear for this student's data. */
export function cardAllowance(src = {}) {
  const badges = earnedBadges(src);
  const earned = new Set(badges.map((b) => b.id));
  const frames = CARD_FRAMES.filter((f) => !FRAME_EARNED_BY[f] || earned.has(FRAME_EARNED_BY[f]));
  return { badges, earned, frames };
}

/** The card as it may be worn: anything not earned falls back to the free choice. */
export function wearable(card, allowance) {
  return {
    ...card,
    frame: allowance.frames.includes(card.frame) ? card.frame : 'plain',
    title: card.title && allowance.earned.has(card.title) ? card.title : null,
    trophies: (card.trophies || []).filter((id) => allowance.earned.has(id)),
  };
}

/** The hub's next trophy, with the frame it brings, or null. */
export function nextTrophy(src = {}) {
  const next = nextBadge(src);
  if (!next) return null;
  const frame = Object.entries(FRAME_EARNED_BY).find(([, by]) => by === next.id)?.[0] || null;
  return { id: next.id, label: next.label, left: Math.max(1, next.need - next.have), unit: next.unit, frame };
}

// ── The face: what any copy of the card draws ──────────────────────────────

export const DARK_PLATE_FILTER = 'invert(1) hue-rotate(180deg)';
export const DARK_PLATE_OPACITY = 0.5;

// invert(1) then hue-rotate(180deg), as the Filter Effects spec defines them
// (sRGB values, the matrix at cos -1, sin 0): the share image and the
// contrast test print a dark-mode plate exactly as the CSS filter does.
const HUE_180 = [[-0.574, 1.43, 0.144], [0.426, 0.43, 0.144], [0.426, 1.43, -0.856]];
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
export function darkPlatePixel(r, g, b) {
  const i = [255 - r, 255 - g, 255 - b];
  return HUE_180.map((row) => clamp(row[0] * i[0] + row[1] * i[1] + row[2] * i[2]));
}

/** The card's colours for a theme: the share card's paper and inks. */
export function cardColours(theme = 'light') {
  const pal = PALETTES[theme === 'dark' ? 'dark' : 'light'];
  // Light: the card stock is the paper a shade lighter than the page, so the
  // card lifts off it; dark: the page's own ink-black, the rule draws the edge.
  const stock = theme === 'dark' ? pal.bg : PALETTES.light.paw;
  return {
    stock,
    ink: pal.ink,
    soft: pal.soft,
    rule: pal.rule,
    brand: pal.sage,
    title: pal.gold,
    gold: pal.goldField,
    seal: pal.rose,
    // A plate is printed art on light paper. Dark mode prints it in
    // negative (darkPlatePixel, the CSS filter below), so its paper sinks into
    // the dark stock and the drawing still shows.
    plateOpacity: theme === 'dark' ? DARK_PLATE_OPACITY : 0.35,
    plateFilter: theme === 'dark' ? DARK_PLATE_FILTER : 'none',
    // Foil: the palette's four field colours, round the edge.
    foil: [PALETTES.light.rightEdge, PALETTES.light.goldField, PALETTES.light.wrongEdge, PALETTES.dark.sage],
  };
}

const num = (n) => Math.max(0, Math.round(Number(n) || 0)).toLocaleString('en-US');

/**
 * Everything the card shows.
 * stats: { answered, streak, trophies } or null (a classmate's card shows no
 * numbers: their study record is theirs).
 */
export function cardFace({ card = DEFAULT_CARD, name = '', picture = '', yearLine = '', stats = null, theme = 'light' } = {}) {
  const c = { ...fresh(), ...card };
  return {
    name: String(name || 'นิสิต'),
    picture: String(picture || ''),
    yearLine: String(yearLine || ''),
    brand: 'VetMock',
    backdrop: { id: c.backdrop, src: backdropSrc(c.backdrop), label: backdropLabel(c.backdrop) },
    frame: has(CARD_FRAMES, c.frame) ? c.frame : 'plain',
    title: c.title ? BADGE_ART[c.title]?.label || null : null,
    trophies: (c.trophies || []).filter((id) => BADGE_ART[id]).map((id) => ({ id, src: BADGE_ART[id].src, label: BADGE_ART[id].label })),
    stats: stats ? [
      { label: 'ทำแล้ว', value: num(stats.answered), unit: 'ข้อ' },
      { label: 'ต่อเนื่อง', value: num(stats.streak), unit: 'วัน' },
      { label: 'ถ้วย', value: num(stats.trophies), unit: 'ใบ' },
    ] : [],
    theme: theme === 'dark' ? 'dark' : 'light',
    colours: cardColours(theme),
  };
}

// ── This device's copy ─────────────────────────────────────────────────────
// One key per account, so a second student signing in on a shared phone does
// not inherit the first one's card.
export const cardKey = (userId) => `vmx-card:${userId || 'guest'}`;
export const CARD_CHANGE_EVENT = 'vmx-card-change';

export function readLocalCard(userId) {
  try { return window.localStorage.getItem(cardKey(userId)); } catch { return null; }
}

export function writeLocalCard(userId, token) {
  try {
    window.localStorage.setItem(cardKey(userId), token);
    window.dispatchEvent(new CustomEvent(CARD_CHANGE_EVENT, { detail: { userId: userId || null } }));
    return true;
  } catch { return false; }
}
