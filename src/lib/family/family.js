// The VetMock family: one list of the four sites, read by all four (vetmock.com, vca/, ai/,
// research/ import this folder read-only through their `@vetmock` alias). A name or a sentence is
// changed here and nowhere else; tests/unit/family.test.mjs holds every surface to this list.
//
// Each site keeps its own session, its own storage and its own theme key. A link followed from
// this list may carry two display preferences, never anything about the account:
//   ?vmt=light|dark  the theme the student was looking at
//   ?vml=th|en       the language, only for a site that has a language switch
// The site reads them once before its first paint, writes them to its own key and removes them
// from the address bar (takeCrossing below; the boot scripts that cannot import this file hold
// the same two names, checked by the test).
//
// No imports: the boot path of every site may load this file.

export const FAMILY = Object.freeze([
  Object.freeze({
    id: 'main',
    name: 'VetMock',
    url: 'https://vetmock.com/',
    th: 'คลังข้อสอบ สรุปบทเรียน และ VetWiki สำหรับนิสิตสัตวแพทย์',
    en: 'Practice questions, lecture notes and VetWiki for vet students',
    lang: true,
  }),
  Object.freeze({
    id: 'vca',
    name: 'VetMock VCA',
    url: 'https://vca.vetmock.com/',
    th: 'ซ้อมสอบใบประกอบวิชาชีพสัตวแพทย์ ให้เหมือนวันจริง',
    en: 'Practise for the veterinary licensing exam as on the day',
    lang: false,
  }),
  Object.freeze({
    id: 'ai',
    name: 'VetMock AI',
    url: 'https://ai.vetmock.com/',
    th: 'ถามเรื่องที่เรียน ได้คำตอบพร้อมที่มาจากคลัง',
    en: 'Ask about what you study, with answers that cite the library',
    lang: false,
  }),
  Object.freeze({
    id: 'research',
    name: 'VetMock Research',
    url: 'https://research.vetmock.com/',
    th: 'วิเคราะห์สถิติงานวิจัยสัตวแพทย์ ข้อมูลไม่ออกจากเครื่อง',
    en: 'Statistics for veterinary research, your data stays on this device',
    lang: true,
  }),
]);

/** The heading over the list, in each language. */
export const FAMILY_TITLE = Object.freeze({ th: 'VetMock ทั้งหมด', en: 'All of VetMock' });

/** The two parameter names a crossing may carry. */
export const CROSSING = Object.freeze({ theme: 'vmt', lang: 'vml' });

const THEMES = new Set(['light', 'dark']);
const LANGS = new Set(['th', 'en']);

/** @param {string} id */
export function familyMember(id) {
  return FAMILY.find((m) => m.id === id) || null;
}

/** The member whose origin this absolute URL is on, or null. */
export function memberOfUrl(href) {
  let origin;
  try { origin = new URL(href).origin; } catch { return null; }
  return FAMILY.find((m) => new URL(m.url).origin === origin) || null;
}

/**
 * The address to follow to a member, carrying the theme (and the language where the member has
 * one). Anything that is not a family address comes back unchanged, so a stray URL never gains
 * the parameters. A value outside the allowed set is left out, never passed through.
 * @param {string} target  a member id, or an absolute URL on a member's origin
 * @param {{ theme?: string|null, lang?: string|null }} prefs
 */
export function crossingHref(target, { theme = null, lang = null } = {}) {
  const byId = familyMember(target);
  const href = byId ? byId.url : target;
  const member = byId || memberOfUrl(href);
  if (!member) return href;
  let url;
  try { url = new URL(href); } catch { return href; }
  url.searchParams.delete(CROSSING.theme);
  url.searchParams.delete(CROSSING.lang);
  if (THEMES.has(theme)) url.searchParams.set(CROSSING.theme, theme);
  if (member.lang && LANGS.has(lang)) url.searchParams.set(CROSSING.lang, lang);
  return url.href;
}

/** The theme this page shows now, from <html data-theme>, which every family site sets. */
export function currentTheme(doc = globalThis.document) {
  const t = doc?.documentElement?.getAttribute?.('data-theme');
  return THEMES.has(t) ? t : null;
}

/**
 * Read the crossing parameters from this page's address and take them out of it, once.
 * @returns {{ theme: 'light'|'dark'|null, lang: 'th'|'en'|null }}
 */
export function takeCrossing(loc = globalThis.location, hist = globalThis.history) {
  const none = { theme: null, lang: null };
  if (!loc) return none;
  let url;
  try { url = new URL(loc.href); } catch { return none; }
  const p = url.searchParams;
  if (!p.has(CROSSING.theme) && !p.has(CROSSING.lang)) return none;
  const theme = THEMES.has(p.get(CROSSING.theme)) ? p.get(CROSSING.theme) : null;
  const lang = LANGS.has(p.get(CROSSING.lang)) ? p.get(CROSSING.lang) : null;
  p.delete(CROSSING.theme);
  p.delete(CROSSING.lang);
  try { hist?.replaceState?.(hist.state, '', `${url.pathname}${url.search}${url.hash}`); } catch { /* the address keeps them; harmless */ }
  return { theme, lang };
}

/**
 * For a link's click handler: point the anchor at the crossing address just before the browser
 * follows it, so the theme is the one on screen at the moment of the tap (it may have changed
 * since the render). A copied link stays the plain address.
 */
export function stampCrossing(anchor, { lang = null } = {}) {
  if (!anchor || typeof anchor.getAttribute !== 'function') return;
  const base = anchor.getAttribute('data-family-href') || anchor.getAttribute('href');
  if (!base) return;
  anchor.setAttribute('data-family-href', base);
  anchor.setAttribute('href', crossingHref(base, { theme: currentTheme(anchor.ownerDocument), lang }));
}
