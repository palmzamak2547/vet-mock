// The topic names a domain page lists, made fit for a student to read.
//
// A topic's name is whatever the main app's curriculum calls it, and the curriculum is written for
// the people who build it: emoji, "คาบ 27-28," and "Week 10-12," in front of a lecture, internal
// tags such as "🐺 หมาหอน 4 —" (a study group's nickname), a lecturer's name in brackets, and
// first rows that only say which domain you are on ("หมู — Swine" on the swine page).
// build-bank.mjs runs every name through topicRows() when it writes the catalog, so the page draws
// the result and never has to clean anything. Nothing in the browser bundle imports this file.
//
// What it does, in order:
//   emoji                                   dropped
//   an internal tag before an em dash       dropped, the real topic is what follows it
//   a lecturer, in brackets or on its own   dropped (a person's name is never shown)
//   "คาบ 3," "Week 10-12," "Lect 16," "L9," dropped
//   a name that only repeats the domain     left out of the list
//   names that come out the same            merged: counts added, every key kept for the link
//   fewer than MIN_TOPICS left              the domain shows no list at all
//
// Only the tags named below are internal. An em dash alone is not one: "ASF — acute signs" and
// "CCL — surgical Rx" keep both sides.

import { stripEmoji } from './emoji.js';

/** A domain with fewer topics than this shows no list: three rows are a menu, not a ranking. */
export const MIN_TOPICS = 4;

/** How many rows the domain page lists. */
export const TOPICS_LISTED = 14;

const DASH = '[—–-]';

// Internal tags in front of the topic. `internal` marks the groups whose names carry more
// internal notes after the topic (see cleanInternal).
const TAGS = [
  { re: new RegExp(`^(?:รวม)?หมาหอน\\s*\\d*\\s*${DASH}\\s*`), internal: true }, // "หมาหอน 4 — Hoof Health"
  { re: /^Uncertain Scope\s*,\s*/i, internal: true }, // "Uncertain Scope, Tendon Sx"
  { re: new RegExp(`^Term Paper\\s+G\\d+\\s*${DASH}\\s*`, 'i'), internal: false }, // "Term Paper G5 — Felidae infertility"
];

// "คาบ 27-28," "สัปดาห์ 9-11," "Lect 16," "Lecture 3:" "Week 8/10-12," "L10-11," in front of a topic.
const LECTURE = /^(?:คาบ|สัปดาห์|Lect(?:ure)?\.?|Week|Wk\.?|L)\s*\d+(?:\s*[-–+/&]\s*\d+)*\s*[,:]\s*/i;
// Behind an internal tag the number comes without a comma: "หมาหอน 6 — L8 Nutrition".
const LECTURE_CODE = /^L\d+(?:\s*[-–]\s*\d+)*\s+/;

// A lecturer: a title and the name after it, or a name the curriculum spells out.
const TITLE = '(?:ผศ\\.|รศ\\.|ศ\\.|ดร\\.|อ\\.|Dr\\.|Prof\\.|Aj\\.|Ajarn\\b)';
const NAMES_SPELLED = ['Sawita', 'Pornchalit'];
const SPELLED = new RegExp(`\\b(?:${NAMES_SPELLED.join('|')})\\b`, 'i');
const SPELLED_RUN = new RegExp(`\\b(?:${NAMES_SPELLED.join('|')})\\b\\s*`, 'gi');
const TITLED = new RegExp(`(?:^|[\\s(])${TITLE}\\s*[^\\s)]+`, 'i');
const TITLED_RUN = new RegExp(`(^|[\\s(])${TITLE}\\s*[^\\s)]+`, 'gi');
const SENIOR = /\sพี่\S+/g; // "ART พี่อิม": a senior, called by nickname

// Internal notes in the groups above: "(synthesized)", "(Blackboard p17)", "(legacy Vet 84)",
// a source tag "TJ" at the end, and a bare Thai first name in brackets before it.
const NOTE = /synthesi[sz]ed|verified|blackboard|past paper|legacy|\bvet\s*\d{2}\b|\bTJ\b|\d+\s*ข้อ/i;
const SOURCE_TAIL = /\s+TJ\b.*$/;
const THAI_ONLY = /^\([\u{0E00}-\u{0E7F}\s.]+\)$/u;

const BRACKETS = /\([^()]*\)/g;

/** The text with every bracketed group `drop` accepts removed. */
const dropBrackets = (text, drop) => text.replace(BRACKETS, (group) => (drop(group) ? ' ' : group));

const cleanInternal = (text) => dropBrackets(text.replace(SENIOR, ''), (g) => NOTE.test(g) || THAI_ONLY.test(g)).replace(SOURCE_TAIL, '');

/**
 * One topic name as a student should read it.
 * @param {string} raw the name as the curriculum writes it
 * @returns {string} '' when nothing but tags was left
 */
export function cleanTopicLabel(raw) {
  let text = stripEmoji(raw).normalize('NFC').replace(/\s+/g, ' ').trim();
  let internal = false;
  for (const tag of TAGS) {
    if (tag.re.test(text)) { text = text.replace(tag.re, ''); internal = internal || tag.internal; }
  }
  text = dropBrackets(text, (g) => TITLED.test(g) || SPELLED.test(g)).replace(TITLED_RUN, '$1').replace(SPELLED_RUN, '');
  if (internal) text = cleanInternal(text).replace(LECTURE_CODE, '');
  return text
    .replace(LECTURE, '')
    .replace(/\s*·\s*/g, ' — ') // the site writes no middle dot between words
    .replace(/\s*↔\s*/g, ' and ') // nor an arrow that some phones draw as a picture
    .replace(/\(\s*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,:;—–-]+|[\s,:;—–-]+$/g, '');
}

// Words that name a domain on its own page, besides its own Thai and English name: what the exam
// calls the animals or the field. A topic made only of these is the page's own title again.
const NAMES = {
  anatomy: ['กายวิภาค', 'สรีรวิทยา'],
  pharmacology: ['เภสัชวิทยา', 'พิษวิทยา'],
  'small-animal': ['หมาแมว', 'สุนัข', 'หมา', 'แมว', 'dog', 'cat'],
  exotic: ['exotic', 'wildlife'],
  avian: ['สัตว์ปีก', 'poultry'],
  swine: ['หมู', 'swine', 'pig'],
  equine: ['ม้า', 'equine'],
  ruminant: ['ruminant', 'โค', 'กระบือ', 'แพะ', 'แกะ'],
  aquatic: ['สัตว์น้ำ', 'fish', 'shrimp'],
  surgery: ['ศัลยศาสตร์', 'วิสัญญีวิทยา'],
  juris: ['กฎหมาย', 'จริยธรรม', 'สวัสดิภาพสัตว์'],
};

/** True when the name says nothing the domain's own title does not. */
export function repeatsDomain(label, domain) {
  const words = [domain.th, domain.en, domain.tag, ...(NAMES[domain.id] || [])]
    .filter(Boolean)
    .map((w) => String(w).replace(/\|/g, '').toLowerCase())
    .sort((a, b) => b.length - a.length);
  let rest = label.toLowerCase();
  for (const w of words) rest = rest.split(w).join(' ');
  // "medicine" and "set" say nothing a page of that name does not: "Swine medicine Dr. Pornchalit
  // set" is "Swine medicine set" once the lecturer is gone, the swine page's title again.
  rest = rest.replace(/\band\b|และ|\bmedicine\b|\bset\b/g, ' ');
  return !/[\p{L}\p{N}]/u.test(rest);
}

const sameName = (label) => label.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/**
 * The rows a domain page lists under "most questions", most questions first.
 * @param {{ key: string, n: number }[]} topics every topic of the domain, with its question count
 * @param {Record<string, string>} names topic key -> name as the curriculum writes it
 * @param {{ id: string, th: string, en: string, tag?: string }} domain
 * @returns {{ label: string, n: number, keys: string[] }[]} [] when fewer than MIN_TOPICS remain
 */
export function topicRows(topics, names, domain) {
  const rows = new Map();
  for (const { key, n } of topics) {
    const raw = names[key];
    if (!raw) continue;
    const label = cleanTopicLabel(raw);
    if (!label || repeatsDomain(label, domain)) continue;
    const id = sameName(label);
    const row = rows.get(id);
    if (row) {
      row.n += n;
      row.keys.push(key);
      // The merged row is named after its biggest part.
      if (n > row.top) { row.top = n; row.label = label; }
    } else {
      rows.set(id, { label, n, keys: [key], top: n });
    }
  }
  const list = [...rows.values()].map(({ label, n, keys }) => ({ label, n, keys }));
  list.sort((a, b) => b.n - a.n || (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
  return list.length >= MIN_TOPICS ? list : [];
}
