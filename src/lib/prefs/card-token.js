// ============================================================
// prefs/card-token.js — "การ์ดของฉัน" as one short, versioned token
// ============================================================
// The card's style is private to the student's own screens and share card in
// this release. It is kept as one string so a later, reviewed database change
// can let classmates read it without a new shape:
//
//   c1.b<backdrop>.f<frame>.t<title>.s<trophy>,<trophy>,<trophy>.p<emoji hex>
//
// c1 is the version. Every part is optional; a part whose letter is unknown is
// ignored (a newer build may add one), a value that is not on its list drops
// that part, and anything else (wrong version, over 120 characters, a
// character outside [a-z0-9.,-]) is no token at all. Parsing never builds an
// object from the input's own keys, so "__proto__" is just an unknown value.
//
// Self-expression is free: every backdrop and the plain frame from the first
// minute. Titles, the other frames and trophies on show are earned; which are
// earned is computed from earnedBadges() at render (lib/card-trophies.js), so
// a token naming an unearned one shows the free choice instead.
// ============================================================

export const CARD_KEY = 'vmx-card';
export const CARD_VERSION = 'c1';
const MAX_LEN = 120;

/** Backdrops: free. ids of art.js IG_BACKGROUNDS plus two drawn in CSS. */
export const CARD_BACKDROPS = Object.freeze(['paper', 'graph', 'herb-border', 'paw-trail', 'stethoscope', 'notebook', 'dotted-grid', 'field', 'microscope']);
/** Frames: 'plain' is free, the others are earned (card-trophies.js). */
export const CARD_FRAMES = Object.freeze(['plain', 'ledger', 'gilt', 'foil', 'seal']);
/** Badge ids (art.js BADGE_ART; a unit test keeps the two equal). */
export const BADGE_IDS = Object.freeze([
  'streak-7', 'streak-30', 'questions-100', 'questions-1000', 'perfect', 'panic-survivor', 'night-owl',
  'early-bird', 'corrected-mistakes', 'review-cycle', 'contributor', 'study-group', 'race-winner', 'exam-finished',
]);
export const MAX_ON_SHOW = 3;

export const DEFAULT_CARD = Object.freeze({ backdrop: 'paper', frame: 'plain', title: null, trophies: Object.freeze([]), picture: null });

const has = (list, v) => typeof v === 'string' && list.includes(v);
const EMOJI_HEX = /^[0-9a-f]{2,6}(-[0-9a-f]{2,6}){0,4}$/;

export function emojiToHex(emoji) {
  if (typeof emoji !== 'string' || !emoji || emoji.length > 16) return null;
  return [...emoji].map((c) => c.codePointAt(0).toString(16)).join('-');
}
export function hexToEmoji(hex) {
  if (typeof hex !== 'string' || !EMOJI_HEX.test(hex)) return null;
  try { return String.fromCodePoint(...hex.split('-').map((h) => parseInt(h, 16))); } catch { return null; }
}

/**
 * The card a token describes, or null when it is not a card token.
 * `allowPicture(emoji)` decides which pictures are accepted (default: any one
 * emoji the hex decodes to; the studio passes the avatar list).
 */
export function parseCardToken(raw, { allowPicture = () => true } = {}) {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > MAX_LEN) return null;
  if (!/^[a-z0-9.,-]+$/.test(raw)) return null;
  const parts = raw.split('.');
  if (parts[0] !== CARD_VERSION) return null;
  const card = { backdrop: DEFAULT_CARD.backdrop, frame: DEFAULT_CARD.frame, title: null, trophies: [], picture: null };
  for (const part of parts.slice(1)) {
    const tag = part[0];
    const value = part.slice(1);
    if (tag === 'b' && has(CARD_BACKDROPS, value)) card.backdrop = value;
    else if (tag === 'f' && has(CARD_FRAMES, value)) card.frame = value;
    else if (tag === 't' && has(BADGE_IDS, value)) card.title = value;
    else if (tag === 's') {
      const ids = value.split(',').filter((id) => has(BADGE_IDS, id));
      card.trophies = [...new Set(ids)].slice(0, MAX_ON_SHOW);
    } else if (tag === 'p') {
      const emoji = hexToEmoji(value);
      let ok = false;
      try { ok = Boolean(emoji) && Boolean(allowPicture(emoji)); } catch { ok = false; }
      if (ok) card.picture = emoji;
    }
    // any other letter: a part from a newer build, ignored
  }
  return card;
}

/** The token for a card; values not on their lists are left out. */
export function encodeCard(card = DEFAULT_CARD) {
  const out = [CARD_VERSION];
  if (has(CARD_BACKDROPS, card.backdrop) && card.backdrop !== DEFAULT_CARD.backdrop) out.push(`b${card.backdrop}`);
  if (has(CARD_FRAMES, card.frame) && card.frame !== DEFAULT_CARD.frame) out.push(`f${card.frame}`);
  if (has(BADGE_IDS, card.title)) out.push(`t${card.title}`);
  const shown = Array.isArray(card.trophies) ? [...new Set(card.trophies.filter((id) => has(BADGE_IDS, id)))].slice(0, MAX_ON_SHOW) : [];
  if (shown.length) out.push(`s${shown.join(',')}`);
  const hex = emojiToHex(card.picture);
  if (hex && EMOJI_HEX.test(hex)) out.push(`p${hex}`);
  return out.join('.');
}
