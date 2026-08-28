// ============================================================
// retrieve.js — Thai-aware retrieval over the governed corpus
// ============================================================
// Turns a free-text question into the handful of VetWiki sections most
// likely to answer it. This is the half of the AI layer that decides what
// the model is ALLOWED to know — the endpoint shows the model only what
// this returns, so retrieval quality is answer quality.
//
// Why not searchTopics(): that matches the WHOLE query as one substring,
// which is right for a search box and useless for a question — a Thai
// question is one long unspaced string that will never appear verbatim in
// any section. Here the question is segmented into words (Intl.Segmenter,
// which both Vercel's Node and every supported browser ship with ICU),
// intent words are dropped, and sections are scored by which content
// words they actually contain.
//
// Pure and deterministic: same question + same corpus → same sections.
// No network, no model, nothing to fabricate.

import { listTopics, loadTopic } from './index.js';
import { indexTopic } from './search.js';

// Words that carry the QUESTION but not the CONTENT. Scoring on "ทำไม"
// would retrieve whichever section happens to explain the most things.
const STOPWORDS = new Set([
  // Thai question/function words
  'ทำไม', 'อะไร', 'อย่างไร', 'ยังไง', 'ไหม', 'มั้ย', 'หรือ', 'หรือเปล่า', 'กี่',
  'ที่', 'ของ', 'ใน', 'และ', 'กับ', 'จาก', 'ให้', 'ได้', 'เป็น', 'มี', 'คือ',
  'ต้อง', 'ควร', 'เมื่อ', 'ถ้า', 'แล้ว', 'ก็', 'ด้วย', 'ไม่', 'ไป', 'มา', 'ถึง',
  'ครับ', 'ค่ะ', 'คะ', 'นะ', 'บ้าง', 'อัน', 'ตัว', 'การ', 'ความ', 'ช่วย',
  'อธิบาย', 'สรุป', 'บอก', 'ขอ', 'หน่อย', 'เกี่ยวกับ', 'เรื่อง',
  // English fillers
  'the', 'a', 'an', 'of', 'in', 'on', 'for', 'to', 'and', 'or', 'is', 'are',
  'what', 'why', 'how', 'when', 'which', 'does', 'do', 'can', 'about',
]);

let _segmenter;
function segmenter() {
  if (_segmenter !== undefined) return _segmenter;
  try {
    _segmenter = new Intl.Segmenter('th', { granularity: 'word' });
  } catch {
    _segmenter = null; // no ICU — fall back to run-splitting below
  }
  return _segmenter;
}

/** Content words of a question, lowercased, stopwords out — plus BIGRAMS of
 *  adjacent Thai words. The segmenter splits โรคพิษสุนัขบ้า into
 *  พิษ|สุนัข|บ้า, and each half is a common word that appears all over the
 *  corpus — the bigram สุนัขบ้า is the RARE string that names the disease.
 *  Exported for tests — if this breaks, retrieval silently degrades to noise. */
export function questionTokens(question) {
  const q = String(question || '').toLowerCase();
  let raw;
  const seg = segmenter();
  if (seg) {
    raw = [...seg.segment(q)].filter((s) => s.isWordLike).map((s) => s.segment);
  } else {
    raw = q.split(/[^a-z0-9฀-๿]+/);
  }
  const ok = (w) => w && !STOPWORDS.has(w) && w.length >= 2;
  const thai = (w) => /^[฀-๿]+$/.test(w);
  const out = [];
  const push = (w) => { if (!out.includes(w)) out.push(w); };
  for (let i = 0; i < raw.length; i++) {
    const w = raw[i].trim();
    if (ok(w)) push(w);
    // Bigrams come from RAW adjacency only. Filtering stopwords first and
    // then pairing survivors invented เกิดเชื้อ out of เกิดจากเชื้อ — a string
    // that never appeared in the question but happened to appear (rare,
    // therefore heavily weighted) in an unrelated husbandry article.
    const n = (raw[i + 1] || '').trim();
    if (ok(w) && ok(n) && thai(w) && thai(n)) push(w + n);
  }
  return out;
}

// Latin tokens match on WORD BOUNDARIES (ASCII \b is exact for them) — as a
// substring, "uri" scores every "urine" in the corpus and a feline-URI
// question retrieves litter-box articles (happened on the first probe).
// Thai has no delimiters, so Thai tokens stay substring matches.
const escapeRe = (t) => t.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
function countHits(text, token) {
  if (/^[a-z0-9]+$/.test(token)) {
    const m = text.match(new RegExp(`\\b${escapeRe(token)}\\b`, 'g'));
    return Math.min(m ? m.length : 0, 4);
  }
  let n = 0;
  for (let i = text.indexOf(token); i >= 0 && n < 4; i = text.indexOf(token, i + token.length)) n++;
  return n;
}

/**
 * The sections most relevant to a question, across every governed topic.
 *
 * tf–idf, not tf: a section that says วัคซีน eight times must not outrank the
 * one section in the corpus that contains the rare word the question is
 * actually about (the first version did exactly that — rabies questions
 * retrieved poultry vaccine programs). df is computed over the live corpus
 * per call, so the weights follow the data like everything else.
 *
 * @returns {Array<{subject, topic, topicTitle, sectionId, heading, score}>}
 */
export function retrieveSections(question, { maxSections = 8, perTopic = 3 } = {}) {
  const tokens = questionTokens(question);
  if (tokens.length === 0) return [];

  const topics = [];
  let totalSections = 0;
  for (const t of listTopics()) {
    const idx = indexTopic(t.subject, t.topic);
    if (!idx) continue;
    topics.push({ t, idx });
    totalSections += idx.sections.length;
  }

  // pass 1 — document frequency per token across every section
  const df = new Map(tokens.map((tok) => [tok, 0]));
  for (const { idx } of topics) {
    for (const s of idx.sections) {
      for (const tok of tokens) if (s.text.includes(tok)) df.set(tok, df.get(tok) + 1);
    }
  }
  const idf = new Map();
  for (const [tok, n] of df) {
    if (n > 0) idf.set(tok, Math.log(1 + totalSections / n));
  }
  if (idf.size === 0) return [];

  // Specificity gate: when the question carries at least one RARE word
  // (high idf — สุนัขบ้า, uri, uht…), a section that matches none of the
  // rare words is background noise no matter how many common words it
  // shares with the question. Without this, one husbandry section that
  // says เชื้อ and รักษา a lot outranked the actual feline-URI article.
  const maxIdf = Math.max(...idf.values());
  const rare = new Set([...idf].filter(([, w]) => w >= 0.55 * maxIdf).map(([tok]) => tok));

  // pass 2 — score sections on the tokens that exist in the corpus at all
  const scored = [];
  for (const { t, idx } of topics) {
    const titleLc = `${t.title} ${t.summary}`.toLowerCase();
    let topicBoost = 0;
    let titleHasRare = false;
    for (const [tok, w] of idf) {
      if (!titleLc.includes(tok)) continue;
      topicBoost += tok.length * w;
      if (rare.has(tok)) titleHasRare = true;
    }
    for (const s of idx.sections) {
      let score = 0;
      for (const [tok, w] of idf) {
        const hits = countHits(s.text, tok);
        if (hits === 0) continue;
        score += hits * tok.length * w * (s.heading.toLowerCase().includes(tok) ? 2 : 1);
      }
      if (score === 0) continue;
      // A section inside the right article rarely repeats the disease name
      // in its own text ("Clinical signs — 3 phases" never says สุนัขบ้า) —
      // the ARTICLE title carrying the rare word vouches for its sections.
      let hasRare = titleHasRare;
      for (const tok of rare) { if (hasRare) break; if (countHits(s.text, tok) > 0) hasRare = true; }
      if (!hasRare) continue;
      // Length normalization — an omnibus section that mentions everything
      // once must not outrank the short section that is ABOUT the question.
      score /= Math.sqrt(Math.max(1, s.text.length / 1200));
      scored.push({ subject: t.subject, topic: t.topic, topicTitle: t.title, topicSummary: t.summary, sectionId: s.id, heading: s.heading, score: score + topicBoost });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const out = [];
  const perTopicCount = new Map();
  for (const s of scored) {
    const key = `${s.subject}--${s.topic}`;
    const n = perTopicCount.get(key) || 0;
    if (n >= perTopic) continue;
    perTopicCount.set(key, n + 1);
    out.push(s);
    if (out.length >= maxSections) break;
  }
  return out;
}


/** Materialize picks into full section objects, grouped by topic, in one
 *  pass per topic. Order inside the result follows the picks (score order). */
export function sectionsForPicks(picks) {
  const byTopic = new Map();
  const out = [];
  for (const p of picks || []) {
    const key = `${p.subject}--${p.topic}`;
    if (!byTopic.has(key)) {
      const k = loadTopic(p.subject, p.topic);
      byTopic.set(key, k ? new Map(k.sections.map((s) => [s.id, s])) : new Map());
    }
    const section = byTopic.get(key).get(p.sectionId);
    if (section) out.push({ subject: p.subject, topic: p.topic, topicTitle: p.topicTitle, topicSummary: p.topicSummary || '', section });
  }
  return out;
}
