// @ts-check
// English for the app's interface, without a line changed in the screens.
//
// With English chosen, every Thai string the interface shows is looked up in one dictionary
// (src/data/ui-en.js) and replaced on the page before it is painted. A string with no entry stays
// Thai, and tests/e2e/ui-language.spec.js counts it. Content keeps its own language: an element that
// carries its own `lang` (a question, a note, a person's name, the landing page that translates
// itself) is left as it is, with everything inside it. With Thai chosen neither this module nor the
// dictionary is fetched: the app reaches it through ui-lang.js.
//
// The page belongs to React, so a text node is only ever given a new value here, never replaced or
// moved: React keeps writing to the same nodes, each of its writes is seen, kept as the original and
// translated again, and switching back to Thai writes every original back.
//
// Dictionary keys, all Thai as the screen shows it, spaces collapsed:
//   'ฝึกข้อสอบ'            an exact string
//   '{0} ข้อ'              numbers as {0}, {1} in order; the value may be { one, other }
//   'สรุป {a}'             {a}, {b} any text, matched in order; Thai inside is looked up too
// ponytail: one observer over the whole page; observe per subtree if English ever profiles slow.

const THAI = /[\u0E00-\u0E7F]/;
const NUMBER = /\d[\d,]*(?:\.\d+)?/g;
const WILD = /\{([a-h])\}/g;
const ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];
const NO_TEXT = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);
const LISTS = [' — ', ', '];
const EMOJI_LEAD = /^\p{Extended_Pictographic}[\p{Extended_Pictographic}️‍]*\s+/u;

/** @typedef {string | { one: string, other: string }} Entry */
/** @typedef {{ re: RegExp, names: string[], literal: string, size: number, en: Entry }} Pattern */
/** @typedef {{ exact: Map<string, Entry>, byPrefix: Map<string, Pattern[]>, loose: Pattern[] }} Dictionary */

const collapse = (/** @type {string} */ s) => s.trim().replace(/\s+/g, ' ');
const escape = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** @param {Record<string, Entry>} raw @returns {Dictionary} */
export function compileDictionary(raw) {
  /** @type {Dictionary} */
  const dict = { exact: new Map(), byPrefix: new Map(), loose: [] };
  for (const [th, en] of Object.entries(raw)) {
    // Read the way the screen's strings are read before they are looked up (dates in English).
    const key = collapse(englishDates(th));
    if (!/\{[a-h]\}/.test(key)) { dict.exact.set(key, en); continue; }
    const names = [...key.matchAll(WILD)].map((m) => m[1]);
    const parts = key.split(WILD).filter((_, i) => i % 2 === 0);
    // Two values the code wrote side by side ("{a}{b}") have no knowable split between them: the
    // first capture takes both and the second stays empty, so a Thai word is never cut in half.
    const groups = parts.slice(1).map((_, i) => (i > 0 && parts[i] === '' ? '()' : '(.+?)'));
    const re = new RegExp('^' + escape(parts[0]) + groups.map((g, i) => g + escape(parts[i + 1])).join('') + '$');
    const pattern = { re, names, literal: parts.find((p) => THAI.test(p)) || parts.join(''), size: parts.join('').length, en };
    // A pattern that opens with words is found by its first two characters; one that opens with a
    // wildcard is tried on every string that holds its first Thai words.
    if (parts[0].length >= 2) {
      const list = dict.byPrefix.get(parts[0].slice(0, 2)) || [];
      list.push(pattern);
      dict.byPrefix.set(parts[0].slice(0, 2), list);
    } else dict.loose.push(pattern);
  }
  // The most specific pattern is tried first: "แสดงหมวด {a}" before "แสดง{a}".
  const bySize = (/** @type {Pattern} */ a, /** @type {Pattern} */ b) => b.size - a.size;
  for (const list of dict.byPrefix.values()) list.sort(bySize);
  dict.loose.sort(bySize);
  return dict;
}

/** @param {Entry} entry @param {string[]} nums */
function fill(entry, nums) {
  const tpl = typeof entry === 'string' ? entry
    : Number(String(nums[0] ?? '').replace(/,/g, '')) === 1 ? entry.one : entry.other;
  return tpl.replace(/\{(\d+)\}/g, (m, i) => nums[Number(i)] ?? m);
}

/**
 * Labels the code joined ("Practice | VetMock", "Library, Clips", "Zoonoses — this year's class"):
 * each Thai part looked up on its own, used only when every one is found (or, with partialOk, as far
 * as the parts go).
 * @param {string} core @param {Dictionary} dict @param {number} depth @param {string[]} seps @param {boolean} partialOk
 */
function joined(core, dict, depth, seps, partialOk) {
  for (const sep of seps) {
    if (!core.includes(sep)) continue;
    const pieces = core.split(sep);
    const parts = pieces.map((p) => (THAI.test(p) ? lookup(p.trim(), dict, depth + 1, false) : p));
    // "Rabies — โรคพิษสุนัขบ้า" names one thing twice; in English once is enough.
    if (parts.every((p) => p !== null)) return parts.filter((p, i) => i === 0 || p?.toLowerCase() !== parts[i - 1]?.toLowerCase()).join(sep);
    if (partialOk) return pieces.map((p, i) => parts[i] ?? lookup(p.trim(), dict, depth + 1, true) ?? p).join(sep);
  }
  return null;
}

/**
 * @param {string} core @param {Dictionary} dict @param {number} depth
 * @param {boolean} partialOk whether an answer may keep a capture Thai (only the string as shown may)
 * @returns {string | null}
 */
function lookup(core, dict, depth, partialOk) {
  const direct = dict.exact.get(core);
  if (direct !== undefined) return fill(direct, []);
  /** @type {string[]} */
  const nums = [];
  const key = core.replace(NUMBER, (m) => { nums.push(m); return `{${nums.length - 1}}`; });
  if (nums.length) {
    const numbered = dict.exact.get(key);
    if (numbered !== undefined) return fill(numbered, nums);
  }
  if (depth > 2) return null;
  // A page title is "<view> | VetMock": split before any pattern reads the whole line as one phrase.
  const titled = joined(core, dict, depth, [' | '], partialOk);
  if (titled !== null) return titled;
  const candidates = [...(dict.byPrefix.get(core.slice(0, 2)) || []), ...dict.loose.filter((p) => core.includes(p.literal))];
  // A pattern whose Thai captures are all found wins. One that leaves a capture Thai (a name inside a
  // sentence) is the last resort, after the list reading below.
  /** @type {string | null} */
  let partial = null;
  for (const pattern of candidates) {
    const m = pattern.re.exec(core);
    if (!m) continue;
    let whole = true;
    /** @type {Record<string, string>} */
    const got = {};
    pattern.names.forEach((name, i) => {
      const part = m[i + 1];
      const en = THAI.test(part) ? lookup(part, dict, depth + 1, false) : part;
      if (en === null) whole = false;
      got[name] = en ?? (partialOk ? lookup(part, dict, depth + 1, true) : null) ?? part;
    });
    const firstNumber = /** @type {RegExpMatchArray | null} */ (Object.values(got).join(' ').match(/\d[\d,]*/));
    const out = fill(pattern.en, firstNumber ? [firstNumber[0]] : []).replace(WILD, (_, name) => got[name] ?? '');
    if (whole) return out;
    partial ??= out;
  }
  const listed = joined(core, dict, depth, LISTS, false);
  if (listed !== null || !partialOk) return listed;
  return byPhrases(core, dict, depth) ?? partial ?? joined(core, dict, depth, LISTS, true);
}

// Dates the app writes the Thai way ("ศุกร์ 21 พ.ย. 2569", "4 ธ.ค. 69"): English weekday and
// month, and the Buddhist-era year as its Common Era year. A two-digit year counts only with nothing
// Thai after it, so "15 ธ.ค. 80 ข้อ" keeps its 80 questions. Dictionary keys are read the same way.
const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'พฤหัส', 'ศุกร์', 'เสาร์'];
const EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Thu', 'Fri', 'Sat'];
const THAI_RANGE = THAI.source.slice(1, -1);
const THAI_DATE = new RegExp(`(\\d{1,2}) (${MONTHS.map((m) => m.replace(/\./g, '\\.')).join('|')})(?: (25\\d\\d|[6-9]\\d(?![\\d:]|\\s*[${THAI_RANGE}])))?`, 'g');
// A weekday only right before a date or a time ("จันทร์ 13:00"), never inside a longer Thai word.
const THAI_WEEKDAY = new RegExp(`(^|[^${THAI_RANGE}])(?:วัน)?(${WEEKDAYS.join('|')}) (?=\\d)`, 'g');
const THAI_PHRASE = new RegExp(`[${THAI_RANGE}](?:[${THAI_RANGE} ]*[${THAI_RANGE}])?`, 'g');
/** @param {string} text */
function englishDates(text) {
  return text
    .replace(THAI_DATE, (_, day, month, year) =>
      `${day} ${EN_MONTHS[MONTHS.indexOf(month)]}${year ? ` ${(year.length === 2 ? 2500 : 0) + Number(year) - 543}` : ''}`)
    .replace(THAI_WEEKDAY, (_, before, day) => `${before}${EN_WEEKDAYS[WEEKDAYS.indexOf(day)]} `);
}

/**
 * The last reading: the Thai phrases between English words, numbers and times ("Mon 10:00
 * ระบาดวิทยา"), each looked up alone, used only when every one is found.
 * @param {string} core @param {Dictionary} dict @param {number} depth
 */
function byPhrases(core, dict, depth) {
  // "10:00 น." is a time; its น. has no English of its own.
  const timed = core.replace(/(\d{1,2}[:.]\d{2}) น\./g, '$1');
  const phrases = timed.match(THAI_PHRASE) || [];
  if (phrases.length === 1 && phrases[0] === timed) return null;
  let found = true;
  const out = timed.replace(THAI_PHRASE, (p) => {
    const en = lookup(p, dict, depth + 1, false);
    if (en === null) found = false;
    return en ?? p;
  });
  return found ? collapse(out) : null;
}

/**
 * The English for one string, or null when it holds no Thai or the dictionary has no entry.
 * Spaces around the string are kept as they were.
 * @param {string} text @param {Dictionary} dict
 */
export function translateString(text, dict) {
  if (!text || !THAI.test(text)) return null;
  const dated = collapse(englishDates(text));
  // A label led by an emoji ("🐟 สัตว์น้ำ — Fish & Shrimp") is read without it, unless it has an entry whole.
  const lead = (!dict.exact.has(dated) && EMOJI_LEAD.exec(dated)?.[0]) || '';
  const core = dated.slice(lead.length);
  // With no entry, a date read the English way is still better than none.
  const hit = THAI.test(core) ? lookup(core, dict, 0, true) ?? (dated !== collapse(text) ? core : null) : core;
  if (hit === null) return null;
  return /^\s*/.exec(text)?.[0] + lead + hit + /\s*$/.exec(text)?.[0];
}

// ---- the page ------------------------------------------------------------------------------------

/** @type {WeakMap<Node, string>} */ const ORIGINAL = new WeakMap();
/** @type {WeakMap<Node, string>} */ const WRITTEN = new WeakMap();
/** @type {WeakMap<Element, Map<string, string>>} */ const ATTR_ORIGINAL = new WeakMap();
/** @type {WeakMap<Element, Map<string, string>>} */ const ATTR_WRITTEN = new WeakMap();

/** What the page itself last wrote into this text node. @param {Text} node */
function originalOf(node) {
  const value = node.nodeValue ?? '';
  if (WRITTEN.has(node) && WRITTEN.get(node) === value) return ORIGINAL.get(node) ?? value;
  ORIGINAL.set(node, value);
  WRITTEN.delete(node);
  return value;
}

/** @param {Text} node @param {string} value */
function put(node, value) {
  if (node.nodeValue === value) return;
  WRITTEN.set(node, value);
  node.nodeValue = value;
}

/** Content in its own language, an editor, or a part marked translate="no". @param {Element} el */
function keepsItsLanguage(el) {
  const marked = el.closest('[lang]');
  if (marked && marked !== el.ownerDocument.documentElement) return true;
  return Boolean(el.closest('[translate="no"],[contenteditable=""],[contenteditable="true"]'));
}

/** @param {Element} el @param {Dictionary} dict */
function translateText(el, dict) {
  if (NO_TEXT.has(el.tagName)) return;
  /** @type {Text[]} */
  const texts = [];
  let onlyText = true;
  for (const child of el.childNodes) {
    if (child.nodeType === 3) texts.push(/** @type {Text} */ (child));
    else if (child.nodeType !== 8) onlyText = false;
  }
  if (!texts.length) return;
  const originals = texts.map(originalOf);
  if (!originals.some((t) => THAI.test(t))) return;
  const parts = () => originals.map((t) => translateString(t, dict) ?? t);
  // React writes "5" and " ข้อ" as two text nodes; read together they are one string to look up.
  // A whole reading that keeps some Thai loses to the parts read one by one when they come out whole.
  if (onlyText && texts.length > 1) {
    const whole = translateString(originals.join(''), dict);
    const each = whole !== null && THAI.test(whole) ? parts() : null;
    if (whole !== null && !(each && !each.some((p) => THAI.test(p)))) {
      put(texts[0], whole);
      for (let i = 1; i < texts.length; i++) put(texts[i], '');
      return;
    }
    if (each) { texts.forEach((node, i) => put(node, each[i])); return; }
  }
  const each = parts();
  texts.forEach((node, i) => put(node, each[i]));
}

/** @param {Element} el @param {Dictionary} dict */
function translateAttributes(el, dict) {
  for (const name of ATTRS) {
    const value = el.getAttribute(name);
    if (value === null) continue;
    const written = ATTR_WRITTEN.get(el)?.get(name);
    let original = ATTR_ORIGINAL.get(el)?.get(name);
    if (written === undefined || written !== value || original === undefined) {
      original = value;
      if (!ATTR_ORIGINAL.has(el)) ATTR_ORIGINAL.set(el, new Map());
      ATTR_ORIGINAL.get(el)?.set(name, value);
    }
    const next = translateString(original, dict) ?? original;
    if (next === value) continue;
    if (!ATTR_WRITTEN.has(el)) ATTR_WRITTEN.set(el, new Map());
    ATTR_WRITTEN.get(el)?.set(name, next);
    el.setAttribute(name, next);
  }
}

/**
 * A label the page split into words so a line breaks only between them (HomeQuickGrid's "สรุป"
 * "บทเรียน"), marked data-phrase: read whole, its English written into the first word.
 * @param {Element} el @param {Dictionary} dict
 */
function translatePhrase(el, dict) {
  /** @type {Text[]} */
  const texts = [];
  const walker = /** @type {Document} */ (el.ownerDocument).createTreeWalker(el, 4);
  while (walker.nextNode()) texts.push(/** @type {Text} */ (walker.currentNode));
  const originals = texts.map(originalOf);
  const whole = translateString(originals.join(''), dict);
  texts.forEach((node, i) => put(node, whole === null ? originals[i] : i === 0 ? whole : ''));
}

/** @param {Element} el @param {Dictionary} dict */
function translateElement(el, dict) {
  if (!el.isConnected || keepsItsLanguage(el)) return;
  const phrase = el.closest('[data-phrase]');
  if (phrase) translatePhrase(phrase, dict); else translateText(el, dict);
  translateAttributes(el, dict);
}

/** Every element at and under a node. @param {Node} node @param {Set<Element>} into */
function gather(node, into) {
  if (node.nodeType === 3) { if (node.parentElement) into.add(node.parentElement); return; }
  if (node.nodeType !== 1) return;
  into.add(/** @type {Element} */ (node));
  const walker = /** @type {Document} */ (node.ownerDocument).createTreeWalker(node, 1);
  while (walker.nextNode()) into.add(/** @type {Element} */ (walker.currentNode));
}

/** Writes back what the page wrote, everywhere this module wrote something. @param {Document} doc */
function restore(doc) {
  const walker = doc.createTreeWalker(doc.documentElement, 1 | 4);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === 3) {
      if (WRITTEN.has(node) && WRITTEN.get(node) === node.nodeValue) node.nodeValue = ORIGINAL.get(node) ?? '';
      WRITTEN.delete(node);
      continue;
    }
    const el = /** @type {Element} */ (node);
    const written = ATTR_WRITTEN.get(el);
    if (!written) continue;
    for (const [name, value] of written) {
      if (el.getAttribute(name) === value) el.setAttribute(name, ATTR_ORIGINAL.get(el)?.get(name) ?? value);
    }
    ATTR_WRITTEN.delete(el);
  }
}

// ---- the language of the whole site (reached through ui-lang.js) -------------------------------

/** @type {Promise<Dictionary> | null} */
let englishLoad = null;
/** @type {null | (() => void)} */
let stopTranslating = null;
let wanted = 'th';

// A switch made on a page already painted cross-fades, as App's withTransition does, and like it
// not under reduced motion nor on WebKit, which can crash snapshotting a large page.
function crossFade(/** @type {() => void} */ swap) {
  const doc = document;
  const ua = navigator.userAgent || '';
  const webkit = /AppleWebKit/i.test(ua) && !/(Chrome|Chromium|Edg|OPR|SamsungBrowser)/i.test(ua);
  if (!doc.startViewTransition || webkit || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { swap(); return; }
  try {
    const vt = doc.startViewTransition(swap);
    vt.ready?.catch(() => {});
    vt.updateCallbackDone?.catch(() => {});
    vt.finished?.catch(() => {});
  } catch {
    swap();
  }
}

/**
 * Shows the interface in this language and resolves to the one on screen: 'en' unless the
 * dictionary could not be fetched (offline on a first visit), when the page stays Thai.
 * @param {string} lang @param {{ animate?: boolean }} [options]
 * @returns {Promise<'th' | 'en'>}
 */
export async function showInterfaceIn(lang, { animate = false } = {}) {
  wanted = lang === 'en' ? 'en' : 'th';
  /** @type {Dictionary | null} */
  let dict = null;
  if (wanted === 'en') {
    try {
      englishLoad ??= import('../data/ui-en.js').then((m) => compileDictionary(m.default));
      dict = await englishLoad;
    } catch {
      englishLoad = null;
    }
  }
  const shown = wanted === 'en' && dict ? 'en' : 'th';
  // A later call decided while the dictionary was on its way.
  if (shown === 'en' && wanted !== 'en') return 'th';
  const swap = () => {
    if (shown === 'en' && dict) stopTranslating ??= startUiTranslation(dict);
    else { stopTranslating?.(); stopTranslating = null; }
    document.documentElement.lang = shown;
  };
  if (animate && document.documentElement.lang !== shown) crossFade(swap);
  else swap();
  return shown;
}

/**
 * Translates the page now and keeps translating what React writes, until the returned function is
 * called, which puts the Thai back.
 * @param {Dictionary} dict @param {Document} [doc]
 */
export function startUiTranslation(dict, doc = document) {
  /** @type {Set<Element>} */
  const pending = new Set();
  const flush = () => {
    for (const el of pending) translateElement(el, dict);
    pending.clear();
  };
  const observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'childList') {
        r.addedNodes.forEach((n) => gather(n, pending));
        if (r.target.nodeType === 1) pending.add(/** @type {Element} */ (r.target));
      } else if (r.target.nodeType === 3) {
        if (r.target.parentElement) pending.add(r.target.parentElement);
      } else pending.add(/** @type {Element} */ (r.target));
    }
    flush();
    // What is left in the queue are this module's own writes.
    observer.takeRecords();
  });
  observer.observe(doc.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  observer.observe(doc.head, { subtree: true, childList: true, characterData: true });
  gather(doc.body, pending);
  const title = doc.querySelector('title');
  if (title) pending.add(title);
  flush();
  observer.takeRecords();
  return () => { observer.disconnect(); restore(doc); };
}
