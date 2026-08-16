// The question standard, as code. One definition, every gate.
//
// docs/QUESTION-STANDARD.md is the same thing for humans, and explains WHY each
// rule exists. Change a rule here and there, together.
//
// This file exists because the rule was written out three times — in the
// deck-reference gate, in the bank builder, and in the corpus report — and the
// three lists had already drifted apart: two of them missed "checklist", so the
// same corpus measured 92 defects by one gate and 90 by another. A standard
// that is copied is a standard that decays.

/** Words that mean the question is talking about a DOCUMENT rather than about
 *  an animal. The slide is where the ANSWER came from — a citation, never part
 *  of what is asked, and never the subject of the explanation either. */
export const NAMES_DOCUMENT = new RegExp([
  'สไลด์', 'เด็ค', 'เดค',                     // slide, deck
  'เอกสารนี้', 'คู่มือนี้', 'บทเรียนนี้',      // "this document/manual/lesson"
  'ตารางเขียน', 'ตารางกำกับ',                 // "the table states/labels"
  'หน้าถัดไป', 'หน้าที่แล้ว',                  // next page, previous page
  'ชุดย้อม',                                   // "the stain set" as shown
  'handout', '\\bdeck\\b', 'lecture นี้',
  // Deliberately NOT bare "checklist". An English past paper says "do not
  // include the full diagnostic checklist verbatim" about an article printed on
  // the same page, and a surveillance checklist is a real epidemiology
  // artefact. The word only offends when the DOCUMENT is what is being asked
  // about, and that is a judgement no word list can make.
].join('|'), 'i');

/** True when a question is ABOUT its source document. */
export const namesDocument = (q) => NAMES_DOCUMENT.test(String(q?.q || ''));

/** True when the EXPLANATION narrates the source instead of stating the fact.
 *  94% of the first Year-2 batch did this; 0 of the 1,746 Year-4 semester-2
 *  questions do. */
export const narratesDocument = (q) => NAMES_DOCUMENT.test(String(q?.explain || ''));

/** A question must say where it came from, by any of the three routes the
 *  corpus uses. */
export const hasCitation = (q) => Boolean(q?.verified || q?.examOrigin || q?.source);

/** `examOrigin` means a real past paper — "COM III Final 2019". A lecture deck
 *  is a `source`. Filling examOrigin with a deck name makes a slide-derived
 *  question wear the authority of an exam. */
export const DECK_SHAPED = /lecture deck|lecture-derived|\.pdf|\.pptx/i;
export const examOriginIsADeck = (q) => DECK_SHAPED.test(String(q?.examOrigin || ''));

/** Defects: every one of these must be zero. */
export const DEFECTS = [
  ['stem names the source doc', namesDocument],
  ['explain narrates the doc', narratesDocument],
  ['no citation at all', (q) => !hasCitation(q)],
  ['examOrigin is a deck', examOriginIsADeck],
];

/** Coverage: the habits that separate the Year-4 semester-2 banks from the
 *  rest. Not build-failing — this is the gap being closed, year by year. */
export const COVERAGE = [
  ['explains every distractor', (q) => /ทำไมข้ออื่นผิด|❌/.test(q?.explain || '')],
  ['memory hook', (q) => /💡/.test(q?.explain || '')],
  ['2+ concept tags', (q) => (q?.tags || []).length >= 2],
  ['5-option items', (q) => (q?.options || []).length >= 5],
  ['cites outside the deck', (q) => EXTERNAL_AUTHORITY.test(q?.verified || '')],
];

/** A year, a textbook edition, a standards body, a DOI — something a student
 *  can go and check that is not our own slide. */
export const EXTERNAL_AUTHORITY =
  /\b(19|20)\d{2}\b|\bed\.|WSAVA|WOAH|OIE|AVMA|NRC|et al|doi|Merck|Nelson|Ettinger|Junqueira|Guyton|Cunningham|Dyce|Sisson/i;
