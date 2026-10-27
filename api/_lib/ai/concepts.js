// ============================================================
// ai/concepts.js — a question read as the things it names
// ============================================================
// Retrieval scores documents by CONCEPTS, not by strings: โรคพิษสุนัขบ้า and
// rabies are one concept, so a Thai question finds the section the notes wrote
// in English and the other way round. The vocabulary is VetWiki's own
// (query-terms.js ALIAS_GROUPS plus the glossary's Thai names), so the chat
// and the wiki search read a question the same way; nothing here adds a fact,
// it only lets a question reach text that already states one.
//
// A concept carries:
//   forms   what to look for in the corpus ({ thai } substring or { probe, re })
//   weight  how much finding it says (a species or a word like "treatment"
//           says little; a disease name says a lot)
//   core    whether it counts toward "how much of the question a document
//           answers" (coverage). Generic words score but never decide.
//
// A name inside a longer name it is part of (สุนัข inside โรคพิษสุนัขบ้า) is
// dropped: the longer name is what was asked about. A second, standalone
// occurrence (…ในสุนัข) keeps it.
// ============================================================

import { questionTokens } from '../../../src/lib/vetwiki/retrieve.js';
import {
  ALIAS_GROUPS, GENERIC_ALIAS_HEADS, SPECIES_ALIAS_HEADS, normalizeQuery, contentQuery,
  segmentWords, isThai, isLatin, latinPattern, latinProbe, questionFacets,
} from '../../../src/lib/vetwiki/query-terms.js';
import { GLOSSARY } from '../../../src/data/glossary.js';

// Words that ask for a FORMAT or an ACTION rather than naming content. The
// wiki's stopwords cover question words; a chat also hears "ขอข้อสอบ",
// "หางานวิจัย", "เปิด...", which would otherwise be searched for as topics.
const CHAT_STOPWORDS = new Set([
  'ข้อสอบ', 'ข้อ', 'โจทย์', 'แบบทดสอบ', 'ทดสอบ', 'ฝึก', 'ควิซ', 'quiz', 'mcq',
  'งานวิจัย', 'วิจัย', 'งาน', 'paper', 'papers', 'research', 'study', 'studies', 'article', 'articles',
  'ล่าสุด', 'ใหม่', 'ใหม่ๆ', 'หา', 'ค้น', 'ค้นหา', 'เปิด', 'พา', 'vetmock', 'แอป', 'app',
  'หน่อย', 'นะ', 'คับ', 'ค่ะ', 'จ้า', 'ครับผม', 'ด้วย', 'ทีครับ', 'ที', 'latest', 'recent', 'new', 'find', 'search',
  'อธิบาย', 'สรุป', 'ช่วย', 'บอก', 'ให้', 'ฟัง', 'เกี่ยว',
  // follow-up words: "แล้วในแมวล่ะ" names a cat and nothing else
  'ล่ะ', 'อันนี้', 'อันนั้น', 'เมื่อกี้', 'ต่อ', 'แล้วก็', 'อีก',
  // how a question is framed, not what it is about ("เริ่มเมื่ออายุเท่าไหร่",
  // "เกิดจากอะไร" is the cause facet): as core words they sank English pages
  'เริ่ม', 'อายุ', 'เกิด',
]);

// Thai classifiers a glossary name starts with; students type the bare form.
const THAI_LEAD = /^(โรค|ไร|ภาวะ|เชื้อ|การ)/;
const cleanForm = (f) => normalizeQuery(f).replace(/\s*\([^)]*\)\s*/g, ' ').trim();

// Names the chat's corpus (clips, notes, bank questions) uses and VetWiki does
// not cover yet: VetWiki's own list names only what its sections contain.
const CHAT_ALIAS_GROUPS = [
  ['ไข้สามวัน', 'bovine ephemeral fever', 'ephemeral fever', 'bef'],
];

let groupsCache = null;
/** Alias groups prepared once: what a question may say, what the corpus is searched for. */
export function aliasGroups() {
  if (groupsCache) return groupsCache;
  const groups = [...ALIAS_GROUPS, ...CHAT_ALIAS_GROUPS].map((forms) => ({
    head: forms[0],
    forms: forms.map(cleanForm).filter(Boolean),
  }));
  // Glossary entries join the group that already names them, so one thing
  // stays one concept (and is not counted twice).
  const owner = new Map();
  groups.forEach((g, gi) => g.forms.forEach((f) => owner.set(f.replace(/\*$/, ''), gi)));
  for (const entry of GLOSSARY) {
    const forms = new Set();
    for (const f of [entry.term, ...(entry.aliases || []), entry.thai]) {
      const c = cleanForm(f || '');
      if (!c || c.length > 40) continue;
      forms.add(c);
      if (isThai(c.replace(/\s+/g, '')) && THAI_LEAD.test(c)) {
        const bare = c.replace(THAI_LEAD, '');
        if (bare.length >= 4) forms.add(bare);
      }
    }
    if (forms.size < 2) continue;
    let gi = [...forms].map((f) => owner.get(f)).find((x) => x !== undefined);
    if (gi === undefined) gi = groups.push({ head: cleanForm(entry.term || ''), forms: [] }) - 1;
    for (const f of forms) {
      if (!groups[gi].forms.includes(f)) groups[gi].forms.push(f);
      if (!owner.has(f)) owner.set(f, gi);
    }
  }
  groupsCache = groups.map((g) => {
    const thai = g.forms.filter((f) => isThai(f.replace(/\s+/g, ''))).map((f) => f.replace(/\s+/g, ''));
    const latin = g.forms.filter((f) => !isThai(f.replace(/\s+/g, '')) && /^[a-z0-9][a-z0-9 .'*-]*$/.test(f));
    return {
      head: g.head,
      generic: GENERIC_ALIAS_HEADS.has(g.head),
      species: SPECIES_ALIAS_HEADS.has(g.head),
      queryThai: [...new Set(thai)].sort((a, b) => b.length - a.length),
      queryLatin: latin.map((f) => ({ form: f, re: new RegExp(latinPattern(f)) })),
      // Thai forms short enough to sit inside longer words (ไต in ไตรมาส) are
      // searched through their English names only.
      corpus: [
        ...[...new Set(thai)].filter((f) => f.length >= 3).map((f) => ({ thai: f })),
        ...latin.map((f) => ({ probe: latinProbe(f), re: new RegExp(latinPattern(f), 'g') })),
      ],
    };
  });
  return groupsCache;
}

/** Where each alias group occurs in a normalized query (word-aligned). */
function groupMatches(q, starts, ends) {
  const found = [];
  aliasGroups().forEach((g, gi) => {
    if (!g.corpus.length) return;
    const spans = [];
    for (const form of g.queryThai) {
      for (let i = q.indexOf(form); i >= 0; i = q.indexOf(form, i + 1)) {
        if (starts.has(i) && ends.has(i + form.length)) spans.push({ start: i, end: i + form.length, label: form });
      }
    }
    for (const { re } of g.queryLatin) {
      const all = new RegExp(re.source, 'g');
      for (const m of q.matchAll(all)) spans.push({ start: m.index, end: m.index + m[0].length, label: m[0] });
    }
    if (spans.length) found.push({ gi, g, spans });
  });
  return found;
}

// Animals of one family read as one: a puppy question is a dog question, a
// chicken lecture answers a poultry question.
const FAMILY = {
  'ลูกสุนัข': 'สุนัข', 'ลูกแมว': 'แมว', 'โคนม': 'โค', 'ลูกโค': 'โค', 'กระบือ': 'โค', 'ลูกสุกร': 'สุกร',
  'ลูกม้า': 'ม้า', 'แม่ม้า': 'ม้า', 'พ่อม้า': 'ม้า', 'ไก่': 'สัตว์ปีก', 'เป็ด': 'สัตว์ปีก', 'นก': 'สัตว์ปีก', 'แพะ': 'แกะ',
};
const family = (head) => FAMILY[head] || head;
// An animal inside a disease's name is usually that animal's disease (ฝีดาษไก่,
// อหิวาต์สุกร, วัวบ้า); in these it is the carrier, and the disease is anyone's.
const ANY_ANIMAL = new Set(['พิษสุนัขบ้า', 'ฉี่หนู']);

const speciesCache = new Map();
/** The animal families a text (an article or clip title) names, word-aligned as in a question. */
export function speciesIn(text) {
  const key = String(text || '');
  let out = speciesCache.get(key);
  if (out) return out;
  const q = normalizeQuery(key);
  const segs = segmentWords(q).filter((s) => s.wordLike && s.word.trim());
  const groups = groupMatches(q, new Set(segs.map((s) => s.start)), new Set(segs.map((s) => s.end)));
  const wide = groups.filter((m) => ANY_ANIMAL.has(m.g.head)).flatMap((m) => m.spans);
  out = new Set(groups
    .filter((m) => m.g.species && m.spans.some((s) => !wide.some((w) => w.start <= s.start && s.end <= w.end)))
    .map((m) => family(m.g.head)));
  if (speciesCache.size > 5000) speciesCache.clear();
  speciesCache.set(key, out);
  return out;
}

const latinConcept = (term, weight, core) => ({
  key: `l:${term}`, label: term, weight, core, kind: 'word',
  forms: [{ probe: latinProbe(term), re: new RegExp(latinPattern(term), 'g') }],
});

/**
 * Concepts of a question (plus optional English search terms from the planner).
 * @returns {{ concepts: Array<object>, facets: string[], facetWords: string[], normalized: string }}
 */
export function buildConcepts(text, { extraTerms = [] } = {}) {
  const full = normalizeQuery(text);
  const q = contentQuery(full);
  const segs = segmentWords(q).filter((s) => s.wordLike && s.word.trim());
  const starts = new Set(segs.map((s) => s.start));
  const ends = new Set(segs.map((s) => s.end));

  // 1. Named things, longest names first, so a name nested inside a longer
  // one can be recognised and dropped.
  const matches = groupMatches(q, starts, ends)
    .map((m) => ({ ...m, longest: Math.max(...m.spans.map((s) => s.end - s.start)) }))
    .sort((a, b) => b.longest - a.longest);
  const taken = [];
  const names = [];
  const concepts = [];
  for (const m of matches) {
    const free = m.spans.filter((s) => !taken.some((t) => t.start <= s.start && s.end <= t.end && t.end - t.start > s.end - s.start));
    if (!free.length) continue;
    taken.push(...free);
    if (!m.g.generic && !m.g.species) names.push(...free.map((s) => q.slice(s.start, s.end)));
    concepts.push({
      key: `g:${m.gi}`, label: free[0].label, kind: 'alias', forms: m.g.corpus,
      weight: m.g.generic ? 0.4 : m.g.species ? 0.5 : 1,
      core: !m.g.generic,
      generic: m.g.generic,
      named: !m.g.generic && !m.g.species,
      species: m.g.species ? family(m.g.head) : null,
    });
  }

  // 2. Words the names did not already cover.
  let masked = q;
  for (const t of taken) masked = masked.slice(0, t.start) + ' '.repeat(t.end - t.start) + masked.slice(t.end);
  // A Thai term glossed in English, "โรคเลปโตสไปโรซิส (leptospirosis)", counts
  // once, through the gloss. The segmenter cuts a transliteration into pieces
  // (เลป, ซิส) that read as the rarest words of the question, and their weight
  // kept every English-titled lecture on the disease out of the ranking.
  let unglossed = masked;
  for (const m of q.matchAll(/([฀-๿]+)\s*\((?=[^)]*[a-z])[^)]*\)/g)) {
    unglossed = unglossed.slice(0, m.index) + ' '.repeat(m[1].length) + unglossed.slice(m.index + m[1].length);
  }
  const seen = new Set(concepts.map((c) => c.label));
  for (const tok of questionTokens(full)) {
    if (seen.has(tok) || CHAT_STOPWORDS.has(tok) || !masked.includes(tok)) continue;
    seen.add(tok);
    if (isThai(tok)) {
      // A pair of adjacent words (สุนัขบ้า) is rarer than either half; it
      // scores but is not counted as separate evidence for coverage.
      const pair = segmentWords(tok).filter((s) => s.wordLike).length >= 2;
      if (tok.length < 2) continue;
      concepts.push({
        key: `t:${tok}`, label: tok, kind: 'word', forms: [{ thai: tok }],
        weight: pair ? 0.7 : Math.min(tok.length, 6) / 6,
        core: tok.length >= 3 && !pair && unglossed.includes(tok),
      });
    } else if (isLatin(tok) && tok.length >= 3 && !/^\d+$/.test(tok)) {
      concepts.push(latinConcept(tok, 1, true));
    }
  }

  // 3. The planner's English search terms: a term that names a group already
  // present adds nothing; anything else is searched for as written. When the
  // question itself names its disease, organism or drug, the extra terms only
  // add score: counted as part of the question, "morbillivirus" beside
  // ไข้หัดสุนัข dropped the distemper lecture under half coverage and cited
  // rinderpest questions instead (production, 2026-10-28).
  const have = new Set(concepts.map((c) => c.key));
  const named = concepts.some((c) => c.named);
  for (const raw of extraTerms.slice(0, 8)) {
    const term = normalizeQuery(raw).replace(/[^a-z0-9 .'-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (term.length < 3 || /^\d+$/.test(term)) continue;
    const tSegs = segmentWords(term).filter((s) => s.wordLike && s.word.trim());
    const g = groupMatches(term, new Set(tSegs.map((s) => s.start)), new Set(tSegs.map((s) => s.end)))
      .find((m) => m.spans.some((s) => s.end - s.start >= term.length - 1));
    if (g) {
      if (have.has(`g:${g.gi}`)) continue;
      have.add(`g:${g.gi}`);
      concepts.push({ key: `g:${g.gi}`, label: term, kind: 'alias', forms: g.g.corpus, weight: g.g.generic ? 0.4 : g.g.species ? 0.5 : 0.9, core: !g.g.generic && !named, generic: g.g.generic, species: g.g.species ? family(g.g.head) : null });
      continue;
    }
    if (have.has(`l:${term}`) || CHAT_STOPWORDS.has(term)) continue;
    have.add(`l:${term}`);
    concepts.push(latinConcept(term, 0.9, !named));
  }

  // What kind of answer is wanted, read off the question without the names it
  // contains: แท้งติดต่อ (brucellosis) is not a question about transmission.
  const facets = questionFacets(names.reduce((t, n) => t.split(n).join(' '), full));
  return {
    concepts,
    facets: facets.map((f) => f.id),
    facetWords: facets.flatMap((f) => f.heading),
    normalized: q,
  };
}

/** Needles for snippetAround: the most specific forms first. */
export function snippetNeedles(concepts) {
  return [...concepts]
    .sort((a, b) => Number(b.core) - Number(a.core) || b.weight - a.weight)
    .flatMap((c) => c.forms.map((f) => (f.thai ? { thai: f.thai } : { re: f.re })));
}
