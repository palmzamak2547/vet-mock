// ============================================================
// voice-turns.js — a call's transcript, kept pure so it tests without audio
// ============================================================
// The agent says a few words before it looks something up ("อ๋อ เรื่อง parvo
// นะคะ"), then the answer: two responses for one question. Live captions show
// both; the saved chat keeps the answer, with the sources and cards that came
// with it. Captions run at the voice's pace, learned from its own finished
// answers (8 to 12 characters a second measured over WebRTC on 2026-11-06,
// starting at 10), whole words at a time, never a cut Thai cluster.
// ============================================================

// speech tags the voice may leak ([happy]), and scripts the answer must not carry
const TAGS = /\[[a-z][a-z \-]{1,24}\]/gi;
const FOREIGN = /[Ѐ-ӿ぀-ヿ㐀-鿿가-힯豈-﫿]/g;
const MARKDOWN = /[*_`#>|]+/g;

export const CAPTION_CPS = 10;

export function cleanSpoken(text) {
  return String(text ?? '').replace(TAGS, ' ').replace(FOREIGN, '').replace(MARKDOWN, '').replace(/\s+/g, ' ').trim();
}

const SEG = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('th', { granularity: 'word' }) : null;
const ends = new Map(); // text -> word end offsets (a caption is revealed over many frames)

function wordEnds(t) {
  let e = ends.get(t);
  if (e) return e;
  e = [];
  if (SEG) for (const s of SEG.segment(t)) e.push(s.index + s.segment.length);
  if (ends.size > 40) ends.clear();
  ends.set(t, e);
  return e;
}

/**
 * How much of a caption to show `ms` after its voice began, at `cps` characters a
 * second: whole Thai words where the browser can segment them (Intl.Segmenter), so a
 * word never appears letter by letter; else whole clusters (a vowel or tone mark
 * stays with its letter).
 */
export function revealed(text, ms, cps = CAPTION_CPS) {
  const t = String(text || '');
  let n = Math.max(0, Math.floor((ms / 1000) * cps));
  if (n >= t.length) return t;
  const e = wordEnds(t);
  if (e.length) {
    let cut = 0;
    for (const x of e) { if (x > n) break; cut = x; }
    return t.slice(0, cut);
  }
  while (n < t.length && /[ัิ-ฺ็-๎]/.test(t[n])) n++;
  return t.slice(0, n);
}

/**
 * The voice's own pace, learned from what it has said: characters over the seconds a
 * finished response took, averaged with what came before, kept within 6 to 16.
 */
export function nextRate(rate, chars, seconds) {
  if (!(chars > 12) || !(seconds > 0.8)) return rate;
  const measured = Math.min(16, Math.max(6, chars / seconds));
  return rate * 0.5 + measured * 0.5;
}

/**
 * Turns in, chat messages out. A turn: { role: 'user' | 'agent', text, lead?,
 * sources?, cards? }. Leads (the words before a look-up) are left out; the agent's
 * pieces between two student turns become one answer with everything they carried.
 */
export function toChatMessages(turns, newId) {
  const out = [];
  let answer = null;
  const close = () => {
    if (answer && (answer.content || answer.cards.length)) out.push(answer);
    answer = null;
  };
  for (const t of turns) {
    if (t.role === 'user') {
      close();
      const text = cleanSpoken(t.text);
      if (text) out.push({ id: newId(), role: 'user', content: text, voice: true });
      continue;
    }
    if (!answer) answer = { id: newId(), role: 'assistant', content: '', cards: [], done: true, voice: true };
    if (t.sources?.items?.length) {
      // the sources of the last look-up in this answer are the ones it spoke from
      answer.sources = { covered: Boolean(t.sources.covered), items: t.sources.items };
    }
    for (const c of t.cards || []) answer.cards.push(c);
    const text = cleanSpoken(t.text);
    if (text && !t.lead) answer.content = answer.content ? `${answer.content}\n\n${text}` : text;
  }
  close();
  return out;
}

/** "3:05" */
export const clock = (s) => {
  const v = Math.max(0, Math.round(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`;
};

/** The quiz question on screen: the first one not yet marked (or the last, when all are). */
export function currentQuestion(card, marks) {
  const n = card?.questions?.length || 0;
  for (let i = 0; i < n; i++) if (!marks[i + 1]) return i;
  return Math.max(0, n - 1);
}

// Words a Thai student most needs to see while listening: the English terms (and any number
// written in digits), in the order said, each once. Key terms beat word-for-word captions for
// learning from speech (Adesope & Nesbit 2012, J Educ Psychol); the full text is one tap away.
const TERM_RE = /[A-Za-z][A-Za-z0-9'-]*(?:\s+[A-Za-z0-9][A-Za-z0-9'-]*){0,3}|\d[\d.,]*\s?(?:mg\/kg|mg|ml|kg|g|%|°C|IU)?/g;
const NOT_TERMS = new Set(['vetmock', 'vetwiki', 'ok', 'okay', 'the', 'a', 'an', 'and', 'or', 'of', 'in']);
export function keyTerms(text, max = 6) {
  const out = [];
  const seen = new Set();
  for (const m of String(text || '').matchAll(TERM_RE)) {
    const t = m[0].trim().replace(/[-']+$/, '');
    const k = t.toLowerCase();
    if (t.length < 2 || NOT_TERMS.has(k) || seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out.slice(-max);
}
