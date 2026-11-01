#!/usr/bin/env node
// Read one lecture video without a model call: what is said when, which deck
// page is being taught, which course topic each stretch teaches, and which
// concepts, numbers and stressed points its summary must cover.
//
//   node scripts/video-analyse.mjs <dir> --subject=<id> [--title=<video title>] [--lecturer-topics=a,b]
//
// <dir> holds video.th.json3 (YouTube's captions with word timing) and, when
// the lecture has a library deck, deck.json (scripts/video-deck-pages.py).
// Writes <dir>/analysis.json; the same input always gives the same output.
// Matching reuses the AI chat's own reader (textindex.js, concepts.js), so a
// term the chat recognises in a question is the term recognised here.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TextIndex } from '../api/_lib/ai/textindex.js';
import { aliasGroups, buildConcepts } from '../api/_lib/ai/concepts.js';
import { normalizeQuery, segmentWords } from '../src/lib/vetwiki/query-terms.js';
import { transliterated } from '../src/lib/video-summary-check.js';
import { SUBJECTS_BY_YEAR } from '../src/data/curriculum.js';
import { BANK_REGISTRY } from '../src/data/bank-registry.generated.js';

const WINDOW = 60; // seconds per scoring window
const BREAK_GAP = 45; // silence long enough to be a break
const MIN_CHAPTER = 120;
const MAX_CHAPTER = 360; // six minutes: longer chapters split at a page
// Said to the class as a pointer, not as content: "สำคัญ" alone is ordinary
// lecture speech and stays out.
const STRESS = /(ออกสอบ|ข้อสอบ|จำไว้|ต้องจำ|ชอบออก|ออกบ่อย|ถามบ่อย|สำคัญมาก|ย้ำ|อย่าลืม|ต้องรู้)/;
const UNSTRESS = /ไม่ต้องจำ|ไม่ต้องรู้|ไม่ออกสอบ/;
const MIN_ABSORB = 300; // a topic stretch shorter than this between two of another topic is that topic
const GENERIC_SHARE = 0.25; // said in more than this share of the cached lectures: generic
const TRANSCRIPTS = fileURLToPath(new URL('../data-cache/transcripts/', import.meta.url));

let lectures = null;
/** Share of the cached lecture transcripts that contain any of `forms`. */
function lectureShare(forms) {
  if (!lectures) {
    lectures = fs.readdirSync(TRANSCRIPTS).filter((f) => f.endsWith('.json')).map((f) => {
      const j = JSON.parse(fs.readFileSync(path.join(TRANSCRIPTS, f), 'utf8'));
      const text = normalizeQuery((j.segments || []).map((s) => s.text).join(' '));
      return { text, flat: text.replace(/\s+/g, '') };
    });
  }
  if (!lectures.length) return 0;
  const n = lectures.filter((l) => forms.some((f) => (f.thai ? l.flat.includes(f.thai) : (!f.probe || l.text.includes(f.probe)) && new RegExp(f.re.source).test(l.text)))).length;
  return n / lectures.length;
}
// A concept is a named thing: VetWiki's and the glossary's names, an acronym
// or an organism on the slide, or an English term of five letters or more.
// Thai words alone ("อยู่", "ตรวจ") are everywhere and name nothing.
const isNamed = (c) => (c.kind === 'alias' && c.named) || (c.key.startsWith('l:') && c.label.length >= 5);
// English words built like medical terms (endometritis, gentamicin, cytology).
const TECHNICAL = /(itis|osis|iasis|ology|ectomy|otomy|plasty|scopy|graphy|emia|cyte|cytes|oma|ase|mycin|cillin|floxacin|azole|cycline|prost|tocin|metra|partum|natal|luteal|estrus|oestrus|coccus|bacter|ella|monas|vagina|uterine|ovarian|cervical|follicle|ovulation|placenta|embryo|semen|sperm|biopsy|lavage|culture|fluid|pmn)s?$/;
// Shaped like terms, used like words.
const NOT_TECHNICAL = /^(terminology|technology|methodology|ideology|database|purchase|increase|decrease|release|disease|phase|base|case|cases|release)$/;
// Units a remembered number carries on a slide.
const NUMBER = /\d+(?:[.,]\d+)?\s*(?:[-–]\s*\d+(?:[.,]\d+)?\s*)?(?:%|cm|mm|µm|h\b|hr|hours?|days?|weeks?|months?|years?|ml|mL|l\b|litres?|liters?|IU|units?|µg|ug|mg|g\b|kg|MHz|x\b|french|°C)/i;
const BULLET = /^\s*(?:[•●▪◦–-]|\d+(?:\.\d+)*[.)]?\s)/;
const sec = (t) => Math.round(t);

/** YouTube json3 captions -> [{ t, end, text }], one per caption event. */
export function captionLines(json3) {
  const lines = [];
  for (const e of json3.events || []) {
    if (!e.segs) continue;
    // The recogniser fills silence with stray glyphs (" ب " at confidence 0).
    const words = e.segs.filter((s) => /[฀-๿A-Za-z0-9]/.test(s.utf8));
    if (!words.length) continue;
    const t = (e.tStartMs + (words[0].tOffsetMs || 0)) / 1000;
    lines.push({ t: Math.round(t * 10) / 10, end: (e.tStartMs + (e.dDurationMs || 0)) / 1000, text: words.map((s) => s.utf8).join('').replace(/\s+/g, ' ').trim() });
  }
  return lines;
}

/** Stretches with no speech for BREAK_GAP seconds or more. */
export function breaksIn(lines, duration) {
  const out = [];
  let heard = 0;
  for (const l of lines) {
    if (l.t - heard > BREAK_GAP) out.push({ start: sec(heard), end: sec(l.t) });
    heard = Math.max(heard, l.end || l.t);
  }
  if (duration - heard > BREAK_GAP) out.push({ start: sec(heard), end: sec(duration) });
  return out;
}

/**
 * The best path through `scores[w][s]` (window, state) that changes state as
 * rarely as the evidence allows: each change costs `penalty`. With
 * `forwardOnly`, states are ordered (deck pages) and the path never goes back.
 */
export function viterbi(scores, penalty, { forwardOnly = false, jumpCost = () => 1 } = {}) {
  const W = scores.length;
  const S = scores[0]?.length || 0;
  if (!W || !S) return [];
  let prev = scores[0].map((v, s) => (forwardOnly && s > 0 ? v - penalty * jumpCost(s) : v));
  const back = [];
  for (let w = 1; w < W; w++) {
    const row = new Array(S);
    const from = new Array(S);
    // Free order: the best other state, one penalty. Forward only (deck
    // pages): any earlier page, the penalty growing with the pages skipped.
    // ponytail: O(S²) per window for forward-only; fine for decks under ~200 pages.
    let bestAny = -Infinity;
    let bestAnyAt = 0;
    if (!forwardOnly) prev.forEach((v, s) => { if (v > bestAny) { bestAny = v; bestAnyAt = s; } });
    for (let s = 0; s < S; s++) {
      let move = -Infinity;
      let moveAt = s;
      if (forwardOnly) {
        for (let q = 0; q < s; q++) { const v = prev[q] - penalty * jumpCost(s - q); if (v > move) { move = v; moveAt = q; } }
      } else if (bestAnyAt !== s) { move = bestAny - penalty; moveAt = bestAnyAt; }
      if (prev[s] >= move) { row[s] = prev[s] + scores[w][s]; from[s] = s; } else { row[s] = move + scores[w][s]; from[s] = moveAt; }
    }
    back.push(from);
    prev = row;
  }
  let s = prev.indexOf(Math.max(...prev));
  const path = [s];
  for (let w = W - 2; w >= 0; w--) { s = back[w][s]; path.unshift(s); }
  return path;
}

/** A deck page's heading: its first line that is neither a bullet nor an address. */
export function pageHeading(text) {
  for (const raw of String(text || '').split(/\n/)) {
    const line = raw.trim();
    if (!line || /^(https?:|www\.)|\.(com|org|net|html?)\b/i.test(line) || /^\d+$/.test(line)) continue;
    return BULLET.test(line) ? null : line.slice(0, 90);
  }
  return null;
}
// "Endometritis : Treatment Goals" continues "Endometritis: Treatment".
const headingKey = (h) => (h || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9฀-๿]+/g, ' ').trim().split(' ').slice(0, 2).join(' ');

/** Topic profiles: what the bank's questions on each topic name, weighted by how specific it is to that topic. */
function topicProfiles(subject, questions) {
  const byTopic = new Map(subject.topics.map((t) => [t.id, { n: 0, counts: new Map(), forms: new Map(), label: t.label }]));
  const add = (topicId, text, weight = 1) => {
    const p = byTopic.get(topicId);
    if (!p) return;
    for (const c of buildConcepts(text).concepts) {
      if (!isNamed(c)) continue;
      p.counts.set(c.key, (p.counts.get(c.key) || 0) + weight);
      p.forms.set(c.key, { forms: c.forms, label: c.label });
    }
  };
  for (const t of subject.topics) add(t.id, t.label, 3);
  for (const q of questions) {
    const p = byTopic.get(q.topic);
    if (!p) continue;
    p.n += 1;
    add(q.topic, [q.q, (q.options || [])[q.answer], q.explain].filter(Boolean).join(' '));
  }
  const df = new Map();
  for (const p of byTopic.values()) for (const k of p.counts.keys()) df.set(k, (df.get(k) || 0) + 1);
  const nT = byTopic.size;
  for (const p of byTopic.values()) {
    // A term half the topics share does not tell them apart.
    p.weights = new Map([...p.counts].filter(([k]) => df.get(k) <= Math.max(1, nT / 2))
      .map(([k, n]) => [k, (n / Math.max(1, p.n / 4 + 3)) * Math.log(1 + nT / df.get(k))])
      .sort((a, b) => b[1] - a[1]).slice(0, 60));
  }
  return byTopic;
}

function analyse({ dir, subjectId, title = '', lecturerTopics = [] }) {
  const subject = Object.values(SUBJECTS_BY_YEAR).flat().find((s) => s.id === subjectId);
  if (!subject) throw new Error(`no subject ${subjectId}`);
  const lines = captionLines(JSON.parse(fs.readFileSync(path.join(dir, 'video.th.json3'), 'utf8')));
  const duration = Math.ceil(lines[lines.length - 1]?.end || 0);
  const breaks = breaksIn(lines, duration);
  const inBreak = (t) => breaks.some((b) => t >= b.start && t < b.end);
  const deckFile = path.join(dir, 'deck.json');
  const deck = fs.existsSync(deckFile) ? JSON.parse(fs.readFileSync(deckFile, 'utf8')) : null;

  const lineIndex = new TextIndex(lines.map((l) => ({ text: l.text })));
  // A slide's picture credits are addresses, not content ("americas-carrier-fleet" is no พาหะ).
  if (deck) for (const p of deck.pages) p.text = p.text.replace(/\b(?:https?:\/\/|www\.)?[\w-]+(?:\.[\w-]+)+(?:\/\S*)?/g, (u) => (/\.(com|org|net|th|edu|gov|io|uk|hu|html?)\b/i.test(u) ? ' ' : u));
  const pageIndex = deck ? new TextIndex(deck.pages.map((p) => ({ text: p.text }))) : null;
  // Thai has no spaces, so a Thai name counts only where it starts and ends
  // on word boundaries: วัวบ้า (BSE) is not inside วัวบ้าง ("some cows").
  const bounds = new Map();
  const aligned = (i, thai) => {
    if (!bounds.has(i)) {
      const q = normalizeQuery(lines[i].text).replace(/\s+/g, '');
      const segs = segmentWords(q);
      bounds.set(i, { q, starts: new Set(segs.map((s) => s.start)), ends: new Set(segs.map((s) => s.end)) });
    }
    const { q, starts, ends } = bounds.get(i);
    for (let at = q.indexOf(thai); at >= 0; at = q.indexOf(thai, at + 1)) if (starts.has(at) && ends.has(at + thai.length)) return true;
    return false;
  };
  const hitLines = (forms) => [...new Set(forms.flatMap((f) => [...lineIndex.hits(f).keys()].filter((i) => !f.thai || aligned(i, f.thai))))].sort((a, b) => a - b);
  const hitPages = (forms) => (pageIndex ? [...new Set(forms.flatMap((f) => [...pageIndex.hits(f).keys()]))].map((i) => i + 1).sort((a, b) => a - b) : []);
  const W = Math.ceil(duration / WINDOW);
  const windowOf = (lineIdx) => Math.min(W - 1, Math.floor(lines[lineIdx].t / WINDOW));

  // 1. Vocabulary: VetWiki's names and the glossary, the deck's acronyms and
  // organisms, and what the bank's questions on this course ask about.
  const vocab = new Map();
  const addTerm = (key, label, forms, source) => {
    if (!forms?.length) return;
    const v = vocab.get(key) || { key, label, forms, sources: new Set() };
    v.sources.add(source);
    vocab.set(key, v);
  };
  aliasGroups().forEach((g, gi) => { if (!g.generic && !g.species && g.corpus.length) addTerm(`g:${gi}`, g.head, g.corpus, 'alias'); });
  if (deck) {
    const text = deck.pages.slice(1).map((p) => p.text).join('\n');
    for (const m of text.matchAll(/\b[A-Z][A-Z0-9]{1,5}s?\b/g)) {
      const a = m[0].replace(/s$/, '');
      if (!/^(IM|IV|ID|SC|PO|VS|OK|DVM|PHD|MSC|TX|DX|IU|MHZ|ML|MG|CM|MM|NO|AND|OR|THE|HORSE|ABO|V)$/.test(a) || a === 'MSC') addTerm(`a:${a}`, a, [{ probe: a.toLowerCase(), re: new RegExp(`(?<![a-z0-9])${a.toLowerCase()}s?(?![a-z0-9])`, 'g') }], 'deck');
    }
    for (const m of text.matchAll(/\b([A-Z][a-z]{4,}) ([a-z]{4,}(?:us|is|ae|um|ii|i|a|es))\b/g)) {
      const phrase = `${m[1]} ${m[2]}`.toLowerCase();
      addTerm(`b:${phrase}`, `${m[1]} ${m[2]}`, [{ probe: m[1].toLowerCase(), re: new RegExp(phrase.replace(' ', '\\s+'), 'g') }], 'deck');
    }
    // The slide's English words the captioner also wrote in English: a Thai
    // lecture speaks its technical terms in English, so a word on both sides
    // is a term of this lecture. They place pages; they are not must-cover.
    const said = new Set(lines.flatMap((l) => l.text.toLowerCase().match(/[a-z]{5,}/g) || []));
    for (const w of new Set(text.toLowerCase().match(/[a-z]{5,}/g) || [])) {
      if (said.has(w)) addTerm(`w:${w}`, w, [{ probe: w, re: new RegExp(`(?<![a-z])${w}(?![a-z])`, 'g') }], 'deck-word');
    }
    // A single word the slide sets in red (Gentamicin, Polymyxin B) is a term
    // of its own; a red phrase ("Evacuate contents") stays a mark.
    for (const p of deck.pages.slice(2)) {
      for (const m of p.marked || []) {
        const one = m.trim().match(/^([A-Za-z][a-z]{5,})(?: [A-Z])?s?$/);
        if (one) { const w = one[1].toLowerCase(); addTerm(`w:${w}`, one[0].replace(/s$/, ''), [{ probe: w, re: new RegExp(`(?<![a-z])${w}s?(?![a-z])`, 'g') }], 'mark'); }
      }
    }
  }
  const banks = BANK_REGISTRY.filter((b) => b.subjects.includes(subjectId));
  return Promise.all(banks.map((b) => b.load())).then((loaded) => {
    const questions = loaded.flat().filter((q) => q.subject === subjectId);
    const profiles = topicProfiles(subject, questions);
    for (const p of profiles.values()) for (const [k] of p.weights) { const f = p.forms.get(k); addTerm(k, f.label, f.forms, 'bank'); }

    const concepts = [];
    for (const v of vocab.values()) {
      const at = hitLines(v.forms).filter((i) => !inBreak(lines[i].t));
      const pages = hitPages(v.forms);
      if (!at.length && !pages.length) continue;
      // A name found only as a short acronym is a homonym risk: the deck's
      // "PRRs" are receptors, not the swine disease PRRS. Kept only when a
      // longer form of the same name is found too.
      if (v.sources.has('alias') && v.sources.size === 1) {
        const found = v.forms.filter((f) => lineIndex.hits(f).size || pageIndex?.hits(f).size);
        if (found.every((f) => !f.thai && (f.probe || '').length <= 5)) continue;
      }
      concepts.push({ ...v, sources: [...v.sources], lines: at, pages });
    }
    const byKey = new Map(concepts.map((c) => [c.key, c]));

    // 2. Topic of each minute, smoothed so a passing mention never flips it.
    const topics = subject.topics.map((t) => t.id);
    const tScores = Array.from({ length: W }, () => new Array(topics.length + 1).fill(0));
    topics.forEach((id, ti) => {
      for (const [k, wgt] of profiles.get(id).weights) {
        const c = byKey.get(k);
        if (!c) continue;
        const perWin = new Map();
        for (const i of c.lines) perWin.set(windowOf(i), (perWin.get(windowOf(i)) || 0) + 1);
        for (const [w, n] of perWin) tScores[w][ti] += wgt * Math.sqrt(Math.min(n, 4));
      }
    });
    const flat = tScores.flat().filter((x) => x > 0).sort((a, b) => a - b);
    const median = flat[Math.floor(flat.length / 2)] || 1;
    for (let w = 0; w < W; w++) {
      const mid = w * WINDOW + WINDOW / 2;
      // "none": a window with nothing taught (or inside a break) belongs to no topic.
      tScores[w][topics.length] = inBreak(mid) ? 1e6 : median * 0.6;
      topics.forEach((id, ti) => { if (lecturerTopics.includes(id)) tScores[w][ti] *= 1.25; });
    }
    const tPath = viterbi(tScores, median * 4);
    let segments = [];
    tPath.forEach((s, w) => {
      const last = segments[segments.length - 1];
      if (last && last.s === s) last.end = Math.min(duration, (w + 1) * WINDOW);
      else segments.push({ s, start: w * WINDOW, end: Math.min(duration, (w + 1) * WINDOW) });
    });
    // A short stretch of topic Y inside topic X (or after X, before a break)
    // is a passing mention, X's lecture going on.
    const none = topics.length;
    for (let changed = true; changed;) {
      changed = false;
      for (let i = 0; i < segments.length; i++) {
        const g = segments[i];
        if (g.s === none || g.end - g.start >= MIN_ABSORB) continue;
        const nb = [segments[i - 1], segments[i + 1]].filter((x) => x && x.s !== none);
        const host = nb.find((x) => x.end - x.start >= MIN_ABSORB) || nb[0];
        if (!host || host.s === g.s) continue;
        g.s = host.s;
        changed = true;
      }
      segments = segments.reduce((out, g) => {
        const last = out[out.length - 1];
        if (last && last.s === g.s) last.end = g.end; else out.push({ ...g });
        return out;
      }, []);
    }
    const topicSegments = segments.filter((g) => g.s < topics.length).map((g) => {
      const ws = tScores.slice(g.start / WINDOW, Math.ceil(g.end / WINDOW));
      const own = ws.reduce((a, r) => a + r[g.s], 0);
      const rival = Math.max(...topics.map((_, ti) => (ti === g.s ? 0 : ws.reduce((a, r) => a + r[ti], 0))));
      const margin = own ? (own - rival) / own : 0;
      const evidence = [...profiles.get(topics[g.s]).weights.keys()].map((k) => byKey.get(k))
        .filter((c) => c && c.lines.some((i) => lines[i].t >= g.start && lines[i].t < g.end))
        .slice(0, 6).map((c) => ({ term: c.label, at: sec(lines[c.lines.find((i) => lines[i].t >= g.start)].t) }));
      return { start: g.start, end: g.end, topic: topics[g.s], margin: Math.round(margin * 100) / 100, evidence, conf: margin >= 0.4 && evidence.length >= 3 ? 'high' : margin >= 0.15 && evidence.length >= 2 ? 'medium' : 'ambiguous' };
    });

    // 3. Deck pages in teaching order: each page at the minute its terms are heard.
    let pages = [];
    if (deck) {
      const P = deck.pages.length;
      const pScores = Array.from({ length: W }, () => new Array(P).fill(0));
      const idf = (c) => Math.log(1 + P / Math.max(1, c.pages.length));
      for (const c of concepts) {
        if (!c.pages.length || c.pages.length > P / 3) continue;
        for (const i of c.lines) for (const p of c.pages) pScores[windowOf(i)][p - 1] += idf(c);
      }
      const pPath = viterbi(pScores, 1.2, { forwardOnly: true, jumpCost: (k) => Math.sqrt(k) });
      // A page opening inside a break opens when speech resumes.
      const afterBreak = (t) => breaks.find((b) => t >= b.start && t < b.end)?.end ?? t;
      pages = deck.pages.map((p) => {
        const w = pPath.indexOf(p.page - 1);
        const heard = w >= 0 && pPath.some((s, wi) => s === p.page - 1 && pScores[wi][s] > 0);
        return { page: p.page, at: w >= 0 ? afterBreak(w * WINDOW) : null, heard, heading: pageHeading(p.text), marked: p.marked || [] };
      });
      // A page the path skipped sits between its neighbours.
      pages.forEach((p, i) => { if (p.at === null) p.at = pages.slice(0, i).reverse().find((q) => q.at !== null)?.at ?? 0; });
      // Taught: heard, or between two heard pages (captions miss most English
      // terms, so silence about a page is not evidence it was skipped).
      const first = pages.findIndex((p) => p.heard);
      const last = pages.length - 1 - [...pages].reverse().findIndex((p) => p.heard);
      pages.forEach((p, i) => { p.taught = p.heard ? 'heard' : first >= 0 && i > first && i < last ? 'between' : null; });
    }

    // 4. Chapters: runs of deck pages under one heading, at least MIN_CHAPTER
    // long; without a deck, the topic segments.
    let chapters = [];
    if (pages.length) {
      for (const p of pages) {
        const key = headingKey(p.heading);
        const last = chapters[chapters.length - 1];
        if (last && (!p.heading || key === last.key || p.at === last.start)) { last.pages.push(p.page); continue; }
        // "Implantation site defect!!!" and "Frontier Research &" read as titles once trimmed.
        chapters.push({ key, title: (p.heading || `หน้า ${p.page}`).replace(/\s+/g, ' ').replace(/[\s!?&:,.\-–]+$/, ''), start: p.at, pages: [p.page] });
      }
      chapters.forEach((c, i) => { c.end = chapters[i + 1]?.start ?? duration; c.parts = [{ title: c.title, start: c.start }]; });
      // Fold short chapters: a run of short ones joins up first (Bacterial
      // causes + Other microorganisms), then what is still short folds into
      // the one before (the first into the next). The merged chapter keeps
      // the title of its longest part.
      for (let i = 0; i < chapters.length;) {
        const c = chapters[i];
        if (c.end - c.start >= MIN_CHAPTER || chapters.length === 1) { i++; continue; }
        const next = chapters[i + 1];
        const into = next && next.end - next.start < MIN_CHAPTER ? next : i > 0 ? chapters[i - 1] : next;
        into.pages = [...new Set([...into.pages, ...c.pages])].sort((a, b) => a - b);
        into.start = Math.min(into.start, c.start);
        into.end = Math.max(into.end, c.end);
        // Parts keep their order in time; the chapter is named where it starts.
        into.parts = [...into.parts, ...c.parts].sort((x, y) => x.start - y.start);
        into.title = into.parts[0].title;
        chapters.splice(i, 1);
        if (i > 0) i--;
      }
    } else {
      chapters = topicSegments.map((s) => ({ title: subject.topics.find((t) => t.id === s.topic)?.label, start: s.start, end: s.end, pages: [] }));
    }
    // A long chapter is split at the page nearest its middle: a dense stretch
    // (treatment's three goals) gets two lines in the player, not one cramped one.
    if (pages.length) {
      const pageAt = new Map(pages.map((p) => [p.page, p]));
      for (let i = 0; i < chapters.length; i++) {
        const c = chapters[i];
        if (c.end - c.start < MAX_CHAPTER || c.pages.length < 2) continue;
        const mid = (c.start + c.end) / 2;
        const cut = c.pages.slice(1).map((n) => pageAt.get(n)).filter((p) => p.at > c.start + 90 && p.at < c.end - 90)
          .sort((x, y) => Math.abs(x.at - mid) - Math.abs(y.at - mid))[0];
        if (!cut) continue;
        const second = { title: cut.heading && headingKey(cut.heading) !== headingKey(c.title) ? cut.heading : `${c.title} (ต่อ)`, start: cut.at, end: c.end, pages: c.pages.filter((n) => n >= cut.page) };
        c.pages = c.pages.filter((n) => n < cut.page);
        c.end = cut.at;
        chapters.splice(i + 1, 0, second);
      }
    }
    // A chapter that is all silence (the title slide before the lecturer
    // starts) is no chapter: its pages join the next one.
    chapters = chapters.filter((c, i) => {
      const silent = breaks.some((b) => b.start <= c.start && c.end <= b.end + 5);
      if (silent && chapters[i + 1]) chapters[i + 1].pages = [...c.pages, ...chapters[i + 1].pages];
      return !silent || !chapters[i + 1];
    });
    chapters = chapters.map(({ key, parts, ...c }) => ({ ...c, start: sec(c.start), end: sec(c.end) }));

    // 5. Where each concept is explained: the start of its densest minute.
    const jump = (c) => {
      let best = null;
      for (const i of c.lines) {
        const n = c.lines.filter((j) => lines[j].t >= lines[i].t && lines[j].t < lines[i].t + 60).length;
        if (!best || n > best.n) best = { n, at: sec(lines[i].t) };
      }
      return best;
    };
    const pageOf = new Map(pages.map((p) => [p.page, p]));
    const taught = (n) => Boolean(pageOf.get(n)?.taught);
    const markedText = new Set(pages.flatMap((p) => p.marked).map((m) => m.toLowerCase()));
    const bankTerms = new Set([...profiles.values()].flatMap((p) => [...p.weights.keys()]));
    // Named things: VetWiki and glossary names, the slide's acronyms and
    // organisms, and English words that are medical terms by their shape, are
    // marked red, or are said four times or more (a Thai lecture speaks few
    // English words that often, and those are its terms). Plain English
    // ("control", "period") scores topics but is not a concept to cover.
    const marked = (c) => [...markedText].some((m) => m.includes(c.label.toLowerCase()));
    // How many of the cached lectures say it: a word every lecture says
    // ("clinical", "bacteria", "ฮอร์โมน") is not this lecture's concept.
    const share = (c) => lectureShare(c.forms);
    // A plain English word said often counts only when the bank asks about it
    // on this lecture's topic in two questions or more ("fluid", "breeding";
    // not "mechanism" or "environment").
    const mainTopics = [...new Set(topicSegments.map((s) => s.topic))];
    const askedTwice = (c) => mainTopics.some((t) => (profiles.get(t).counts.get(c.key) || 0) >= 2);
    const termLike = (c) => (c.key.startsWith('l:') || c.key.startsWith('w:'))
      && !NOT_TECHNICAL.test(c.label.toLowerCase())
      && (TECHNICAL.test(c.label) || c.sources.includes('mark') || (c.lines.length >= 4 && askedTwice(c)));
    const named = concepts.filter((c) => (c.sources.includes('alias') || c.sources.includes('deck') || termLike(c))
      && (c.sources.includes('deck') || c.sources.includes('mark') ? true : share(c) <= GENERIC_SHARE));
    // Must cover: said twice, or said once on a taught slide, or on a taught
    // slide that marks it red or that the bank asks about. One passing
    // mention of ฟัน in an endometritis lecture is not teaching it.
    const relevant = (c) => bankTerms.has(c.key) || marked(c);
    const onTaught = (c) => c.pages.some(taught);
    // One concept per word: "endometritis" from the bank and from the slide.
    const seenLabel = new Set();
    const mustConcepts = named.filter((c) => c.lines.length >= 2 || (onTaught(c) && (c.lines.length >= 1 || relevant(c))))
      .sort((a, b) => b.lines.length - a.lines.length)
      .filter((c) => { const k = c.label.toLowerCase(); if (seenLabel.has(k)) return false; seenLabel.add(k); return true; })
      .map((c) => {
        // An English term the captions wrote only in Thai script (ไพโอเมตรา)
        // is found by its consonants, for its jump point only: topics are
        // scored on exact matches.
        // Searched only while a slide that prints the term is being taught.
        if (!c.lines.length && /^[a-z][a-z .-]+$/i.test(c.label)) {
          const spans = c.pages.filter(taught).map((n) => {
            const at = pageOf.get(n).at;
            const end = pages.find((p) => p.page > n && p.at > at)?.at ?? duration;
            return [at - 60, end + 60];
          });
          c.lines = lines.map((l, i) => (spans.some(([s, e]) => l.t >= s && l.t <= e) && !inBreak(l.t) && transliterated(l.text, c.label.split(' ')[0]) ? i : -1)).filter((i) => i >= 0);
          c.heardAs = c.lines.length ? 'thai-script' : undefined;
        }
        const j = jump(c);
        // Not heard at all: the taught slide that names it most often (the
        // diagnosis slide for ultrasound, not the objectives page).
        // A tie goes to the narrower slide: an objectives page names everything once.
        const most = c.pages.filter(taught).map((n) => ({ n, tf: Math.max(0, ...c.forms.map((f) => pageIndex?.hits(f).get(n - 1)?.tf || 0)), breadth: named.filter((x) => x.pages.includes(n)).length }))
          .sort((x, y) => y.tf - x.tf || x.breadth - y.breadth || x.n - y.n)[0];
        const at = j?.at ?? (most ? pageOf.get(most.n).at : null);
        return { id: c.key, kind: 'concept', label: c.label, at, heard: c.lines.length, ...(c.heardAs && { heardAs: c.heardAs }), pages: c.pages };
      }).filter((c) => c.at !== null);

    // 6. Stressed points: said to be important, repeated within a minute and a
    // half, or marked red on a page that was taught.
    const stress = [];
    lines.forEach((l) => {
      if (!STRESS.test(l.text) || UNSTRESS.test(l.text) || inBreak(l.t)) return;
      const last = stress[stress.length - 1];
      if (last && l.t - last.at < 30) return;
      stress.push({ id: `s:${sec(l.t)}`, kind: 'stress', at: sec(l.t), text: l.text.slice(0, 160), why: 'said' });
    });
    for (const c of named) {
      for (const i of c.lines) {
        const near = c.lines.filter((j) => lines[j].t >= lines[i].t && lines[j].t < lines[i].t + 90);
        if (near.length >= 4) { stress.push({ id: `r:${c.key}`, kind: 'stress', at: sec(lines[i].t), text: c.label, why: 'repeated' }); break; }
      }
    }
    // One item per taught page for its red text (a slide's decoration, a long
    // red paragraph, is not a mark of what to learn).
    const marks = pages.filter((p) => p.taught && p.page > 2).map((p) => ({ p, terms: p.marked.filter((m) => m.length <= 60 && /[A-Za-z฀-๿]{3}/.test(m)) }))
      .filter(({ terms }) => terms.length).map(({ p, terms }) => ({ id: `m:${p.page}`, kind: 'mark', at: p.at, page: p.page, text: terms.join(', ').slice(0, 200), taught: p.taught }));
    const numbers = deck ? deck.pages.filter((p) => taught(p.page)).flatMap((p) => p.text.split(/\n/).map((l) => l.trim()).filter((l) => NUMBER.test(l) && !/doi|http|www|\b(1[7-9]|20)\d\d\b/i.test(l))
      .map((l, k) => ({ id: `n:${p.page}:${k}`, kind: 'number', at: pageOf.get(p.page).at, page: p.page, text: l.slice(0, 140), taught: pageOf.get(p.page).taught }))) : [];

    // A slide number the bank's questions on this lecture's topics also use
    // is the one to remember first.
    const asked = questions.filter((q) => mainTopics.includes(q.topic)).map((q) => [q.q, ...(q.options || []), q.explain].join(' '));
    for (const n of numbers) {
      const nums = (n.text.match(/\d+(?:[.,]\d+)?(?:\s*[-–]\s*\d+)?/g) || []).filter((x) => x.length > 1 || /%/.test(n.text));
      if (nums.some((x) => asked.some((q) => q.includes(x)))) n.asked = true;
    }
    return {
      subject: subjectId, title, duration, generatedFrom: { lines: lines.length, deck: deck?.slug || null, questions: questions.length },
      breaks, chapters, topicSegments, pages,
      mustCover: [...mustConcepts, ...stress.sort((a, b) => a.at - b.at), ...marks, ...numbers],
      lines: lines.map((l) => [l.t, l.text]),
    };
  });
}

async function main() {
  const [dir] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const opt = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
  const out = await analyse({ dir, subjectId: opt('subject'), title: opt('title') || '', lecturerTopics: (opt('lecturer-topics') || '').split(',').filter(Boolean) });
  fs.writeFileSync(path.join(dir, 'analysis.json'), JSON.stringify(out));
  const kinds = out.mustCover.reduce((a, m) => ((a[m.kind] = (a[m.kind] || 0) + 1), a), {});
  console.log(`${out.lines.length} lines, ${out.breaks.length} breaks, ${out.chapters.length} chapters, ${out.topicSegments.length} topic segments, must cover ${out.mustCover.length} ${JSON.stringify(kinds)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });
