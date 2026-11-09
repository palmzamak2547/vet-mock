#!/usr/bin/env node
// Publish what the video pipeline produced, as the app reads it:
//   src/data/video-registry.generated.js   every taken video: subject, date, length, topic segments, what exists
//   src/data/video-cards/<id>.js           a passing summary's card, chapters and index (lazy, one per video)
//   src/data/video-cards.generated.js      the loaders for those
//   src/data/video-topic-index.generated.js topic -> the stretches of video that teach it
//
//   node scripts/video-registry.mjs [--check] [--status]
//
// --status also writes the run's report to R2 (videos/_status.json), which
// the admin page's "คลังวิดีโอ" row reads (api/_lib/system-status.js): how
// many videos and cards, what was published, what is held and why, what
// failed and at which step. A run that breaks or stops shows up there.
//
// Only a summary whose status is "pass" becomes a card: a held one stays out
// (docs/VIDEO-LIBRARY.md section 4). --check fails when a file would change.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { takenVideos } from './video-media.mjs';
import { SUBJECTS_BY_YEAR } from '../src/data/curriculum.js';
import { allLecturerSets } from '../src/data/lecturer-sets.js';
import { overlap } from '../src/lib/video-summary-check.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = process.env.VIDEO_DATA_DIR || 'C:/dev/vetmock-video-data';
const OUT = path.join(ROOT, 'src/data');
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** "4.Cushing & Addison 29 Jan 69" -> "2026-01-29" (69 = B.E. 2569); null when the title names no date. */
export function titleDate(title) {
  const m = String(title).match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{2})\s*$/);
  const month = m ? MONTHS.indexOf(m[2].toLowerCase()) : -1;
  if (!m || month < 0) return null;
  return `${2500 + Number(m[3]) - 543}-${String(month + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

// The uploader's typing, not the session's name: a cut word and a slip.
const TITLE_WORDS = [[/\bEpidem$/, 'Epidemiology'], [/\bEqine\b/g, 'Equine']];
/** "7.Endometritis in mare 1 Oct 69" -> "Endometritis in mare"; the session number and date are shown apart. */
export function displayTitle(title) {
  let t = String(title).replace(/\s+\d{1,2}\s+[A-Za-z]{3}[a-z]*\.?\s+\d{2}\s*$/, '').replace(/^[\s,]*\d+(?:\.\d+)?(?:\s*[,+&]\s*\d+(?:\.\d+)?)*\s*\.?\s*(?=\S)/, '').replace(/^[\s,]+/, '')
    // A second session's number goes too: "Semen collection  + 11.Infertility problem".
    .replace(/([+&]\s*)\d{1,2}\s*\.\s*(?=\S)/g, '$1').replace(/\s+/g, ' ').trim();
  for (const [word, name] of TITLE_WORDS) t = t.replace(word, name);
  return t || String(title).trim();
}

// What a PDF's text layer does to a deck's words: Thai sara am split off
// ("การจ าแนก"), a degree sign read as "o" ("20 oซ"), an exponent set inline ("8 x 106").
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export function tidyText(text) {
  return String(text)
    .replace(/([ก-ฮ])([่-๋]?)\s+([่-๋]?)า/g, '$1$2$3ำ')
    .replace(/(\d)\s*o\s*[ซC](?![A-Za-z])/g, '$1 °C')
    .replace(/(\d)\s*[x×]\s*10([1-9]|1[0-2])(?!\d)/g, (m, d, e) => `${d} × 10${[...e].map((c) => SUP[c]).join('')}`);
}

// A heading set in spaced capitals ("H I S T O R Y", "R O L E O F V E T E R I N A R I A N S")
// is read back into words the lectures themselves use; one that cannot be read is no title.
const SPACED = /(?:\b[A-Za-z0-9] ){2,}[A-Za-z0-9]\b/;
const SMALL = new Set(['a', 'an', 'and', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'you']);
let lexicon = null;
function lectureWords(w) {
  if (!lexicon) {
    lexicon = new Map();
    const add = (s) => {
      if (SPACED.test(s)) return;
      for (const x of String(s).toLowerCase().match(/[a-z]+/g) || []) lexicon.set(x, (lexicon.get(x) || 0) + 1);
    };
    for (const id of fs.existsSync(DATA) ? fs.readdirSync(DATA) : []) {
      const a = readJSON(path.join(DATA, id, 'analysis.json'));
      for (const [, s] of a?.lines || []) add(s);
      for (const c of a?.chapters || []) add(c.title);
      for (const p of a?.pages || []) add(`${p.heading || ''} ${p.text || ''}`);
    }
  }
  if (/^\d+$/.test(w) || SMALL.has(w)) return Infinity;
  return lexicon.get(w) || (w.endsWith('s') && lexicon.get(w.slice(0, -1))) || 0;
}
/**
 * "ONEHEALTHSERIES" -> "one health series": the split into words of three letters
 * or more (or a small joining word) whose rarest word the lectures use most, unless
 * the whole run is itself a word used nearly as much ("outlook", not "out look";
 * "one health", not the captions' "onehealth"); null when nothing reads.
 */
export function readSpaced(run, count = lectureWords) {
  const w = run.replace(/\s+/g, '').toLowerCase();
  let best = null;
  const walk = (i, parts, least) => {
    if (i === w.length) {
      if (parts.length > 1 && (!best || least > best.least || (least === best.least && parts.length < best.parts.length))) best = { parts, least };
      return;
    }
    for (let j = i + 1; j <= w.length; j++) {
      const piece = w.slice(i, j);
      const n = piece.length >= 3 || /^\d+$/.test(piece) || SMALL.has(piece) ? count(piece) : 0;
      if (n) walk(j, [...parts, piece], Math.min(least, n));
    }
  };
  walk(0, [], Infinity);
  const whole = count(w);
  if (whole && (!best || whole * 50 >= best.least)) return w;
  return best ? best.parts.join(' ') : null;
}

/** A deck heading as a chapter title: "CONTAMINATION" -> "Contamination", "Treatment : Goals" -> "Treatment: Goals"; null when it cannot be read. */
export function tidyHeading(title, count = lectureWords) {
  const spaced = SPACED.test(String(title));
  let unread = false;
  let t = tidyText(title).replace(new RegExp(SPACED.source, 'g'), (run) => readSpaced(run, count) ?? ((unread = true), run))
    .replace(/\s*·\s*/g, ': ').replace(/\s+:/g, ':').replace(/\s+/g, ' ').replace(/(\s*\(ต่อ\))+$/, ' (ต่อ)').trim();
  if (unread) return null;
  if (spaced) t = t.replace(/(^|:\s)([a-z])/g, (m, p, c) => p + c.toUpperCase()).replace(/\bone health\b/gi, 'One Health');
  else if (!/[a-z]/.test(t) && /[A-Z]{6}/.test(t)) t = t.charAt(0) + t.slice(1).toLowerCase();
  return t;
}

// A heading that runs onto a second line ("Clinical examination of the" / "penis/prepuce")
// is read whole from the slide's own text; one whose next line is a bullet loses the
// word left hanging.
// "INTRODUCTION OF" hangs too; "Hypovitaminosis A" does not.
const hangs = (t) => /\s*(?:\b(?:and|of|the|by|for|in|with|to|on|at|from|or|an)|\ba|&)$/.test(t.replace(/[A-Z]{2,}/g, (w) => w.toLowerCase()));
export function wholeHeading(title, pageText = '') {
  const [, head, more] = String(title).match(/^(.*?)((?:\s*\(ต่อ\))*)$/);
  let whole = head.trim();
  const lines = String(pageText).split('\n').map((l) => l.trim());
  let i = lines.findIndex((l) => l.toLowerCase() === whole.toLowerCase());
  // The next line carries on the heading when it is no bullet and the heading hangs
  // or the line starts in lower case ("Clinical" / "examination of" / "accessory sex glands").
  const goesOn = (next) => next && !/^(?:[•▪◦●\-–*]|\d+[.)])/.test(next) && next.split(/\s+/).length <= 8 && (hangs(whole) || /^[a-z]/.test(next));
  while (i >= 0 && goesOn(lines[i + 1])) whole = `${whole} ${lines[++i]}`;
  while (whole && hangs(whole)) whole = whole.replace(/\s*\S+$/, '');
  return whole ? `${whole}${more}` : '';
}

const DATE_TITLE = /^\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}(?:\s+[A-Za-z])?$/;
const INSTITUTION = /ภาควิชา|คณะสัตวแพทยศาสตร์|จุฬาลงกรณ์มหาวิทยาลัย|chulalongkorn university|faculty of veterinary/i;
const CLOSING = /^(?:thank(?:s| you)?|the end|q\s*&\s*a|questions?)$/i;
/**
 * The chapter panel's titles, in order. A title is a slide's heading; null (a
 * stretch with no slides, titled by two words it heard), a date, the faculty's
 * name or a heading that cannot be read leaves the chapter untitled (''), and its
 * line says what it teaches. A thank-you slide continues the chapter before it.
 */
export function chapterTitles(list, count = lectureWords) {
  let prev = '';
  return list.map((title) => {
    const own = title ? tidyHeading(title, count) : null;
    const base = own?.replace(/\s*\(ต่อ\)$/, '') || '';
    if (base && CLOSING.test(base)) return prev && `${prev} (ต่อ)`;
    const t = !own || DATE_TITLE.test(base) || INSTITUTION.test(base) ? '' : own;
    prev = t.replace(/\s*\(ต่อ\)$/, '');
    return t;
  });
}

// One fact once on the card (the review of #147): an emphasis or remember item
// that a key point beside it already says marks that point stressed instead.
const SAME = 0.85;
function cardOf(v, a, s, stale) {
  const dir = path.join(DATA, v.id);
  const deck = readJSON(path.join(dir, 'deck.json'));
  const pageOf = (n) => (deck?.pages?.[n - 1] ? { doc: deck.pages[n - 1].doc || deck.slug, page: deck.pages[n - 1].docPage || n } : null);
  // A summary is written against one analysis. A redone one (a Scribe transcript,
  // new silence) keeps that analysis beside it, and every chapter line must find its
  // chapter by start time, or the card is held: lines under the wrong chapters are
  // worse than none.
  const basis = readJSON(path.join(dir, 'analysis.basis.json')) || a;
  const at = new Map(basis.chapters.map((c) => [Math.round(c.start), c]));
  const lines = s.summary.chapters.filter((x) => x.line);
  const chapters = lines.map((x) => at.get(Math.round(x.t)));
  if (chapters.some((c) => !c)) {
    stale.push(v.id);
    console.warn(`${v.id}: held, its chapter lines no longer match its analysis`);
    return null;
  }
  // A title fixed by hand lives beside the summary's hand edits (polished.json), by chapter start.
  const polish = readJSON(path.join(dir, 'polished.json'));
  const titles = chapterTitles(chapters.map((c) => polish?.titles?.[Math.round(c.start)] ?? (c.pages?.length ? wholeHeading(c.title, deck?.pages?.[c.pages[0] - 1]?.text) : null)));
  const keyPoints = s.summary.keyPoints.map((p) => ({ t: p.t, text: p.text, ...(p.stressed && { stressed: true }) }));
  const said = (p, list) => list.find((k) => Math.abs(k.t - p.t) <= 60 && overlap(k.text, p.text) >= SAME);
  const emphasis = s.summary.emphasis.filter((p) => {
    const k = said(p, keyPoints);
    if (k) k.stressed = true;
    return !k;
  }).map((p) => ({ t: p.t, text: p.text }));
  const remember = s.summary.remember.filter((p) => !said(p, [...keyPoints, ...emphasis])).map((p) => ({ t: p.t, text: p.text }));
  return {
    oneLiner: s.summary.oneLiner,
    keyPoints,
    emphasis,
    remember,
    chapters: chapters.map((c, i) => ({ t: c.start, title: titles[i], line: lines[i].line, ...(c.pages?.length && { slides: c.pages.map(pageOf).filter(Boolean) }) })),
    // Once each, without the slide's bullet characters, as the deck printed them.
    index: s.topicIndex.map((x) => (x.kind === 'concept' ? { term: tidyText(x.term), t: x.at } : { number: tidyText(String(x.text).replace(/^[\s•▪◦●▸►‣∙·\-–—*]+/, '')), t: x.at, ...(pageOf(x.page) && { slide: pageOf(x.page) }) }))
      .filter((x, i, all) => all.findIndex((y) => (y.term || y.number).toLowerCase() === (x.term || x.number).toLowerCase()) === i),
  };
}

// What a topic stretch may be published as: a topic the lecturer set gives
// this session, or one whose name shares a word with the session's title.
// The first batch's full check found every wrong stretch outside these (a
// PRRS lecture read as CSF and ASF on shared biosecurity words, an
// anaesthesia lecture's ventilation read as the respiratory topic).
const GENERIC = new Set(['equine', 'mare', 'stallion', 'horse', 'swine', 'porcine', 'bovine', 'cattle', 'canine', 'feline', 'avian', 'poultry', 'ruminant', 'animal',
  'disease', 'introduction', 'concept', 'approach', 'clinic', 'clinical', 'part', 'basic', 'principle', 'management', 'general', 'review', 'lecture', 'with', 'from', 'about',
  // A course-wide word: every session of the emergency course carries it.
  'emergency']);
const titleWords = (s) => new Set((String(s).toLowerCase().match(/[a-z]{4,}/g) || []).map((w) => w.replace(/s$/, '')).filter((w) => !GENERIC.has(w)));
export function topicFits(title, label, setTopics = new Set(), topic = '') {
  if (setTopics.has(topic)) return true;
  const t = titleWords(title);
  return [...titleWords(label)].some((w) => t.has(w));
}

const readJSON = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
const js = (o) => JSON.stringify(o, null, 1);
const HEAD = (what) => `// ============================================================
// ${what}
// ============================================================
// GENERATED by scripts/video-registry.mjs from the video pipeline's output
// (docs/VIDEO-LIBRARY.md). Do not hand-edit: rerun the pipeline and this.
// ============================================================

`;

function build() {
  // VIDEO_BATCH=<file of ids>: what this run adds, each read through
  // (docs/VIDEO-LIBRARY.md); the cards already published stay without being listed.
  const batch = process.env.VIDEO_BATCH ? new Set(fs.readFileSync(process.env.VIDEO_BATCH, 'utf8').split(/[\s,]+/).filter(Boolean)) : null;
  if (batch && !batch.size) throw new Error(`VIDEO_BATCH ${process.env.VIDEO_BATCH} lists no video`);
  const cardDir = path.join(OUT, 'video-cards');
  const published = new Set((fs.existsSync(cardDir) ? fs.readdirSync(cardDir) : []).map((f) => f.replace(/\.js$/, '')));
  const stale = [];
  const media = {};
  const dir = path.join(process.env.VIDEO_CACHE_DIR || path.join(ROOT, 'data-cache'), 'channels');
  for (const f of fs.readdirSync(dir).filter((x) => /^media-manifest(\.\d+)?\.json$/.test(x))) Object.assign(media, readJSON(path.join(dir, f)));
  const subjects = new Map(Object.entries(SUBJECTS_BY_YEAR).flatMap(([y, ss]) => ss.map((s) => [s.id, { ...s, year: Number(y) }])));
  const topicLabel = new Map([...subjects.values()].flatMap((s) => (s.topics || []).map((t) => [t.id, t.label])));
  const setTopics = new Map();
  for (const set of allLecturerSets()) for (const lec of set.lecturers || []) for (const ses of lec.sessions || []) {
    if (!ses.videoId) continue;
    const mine = setTopics.get(ses.videoId) || new Set();
    for (const t of [...(ses.decks || []).flatMap((d) => d.topics || []), ...(ses.alsoTopics || [])]) mine.add(t);
    setTopics.set(ses.videoId, mine);
  }
  const registry = {};
  const cards = {};
  const topicIndex = {};
  for (const v of takenVideos()) {
    const a = readJSON(path.join(DATA, v.id, 'analysis.json'));
    const s = readJSON(path.join(DATA, v.id, 'summary.json'));
    const m = media[v.id]?.key ? media[v.id] : null;
    if (!a && !m) continue;
    const subject = a?.subject || v.subjects[0] || null;
    const subj = subjects.get(subject);
    const pass = s?.status === 'pass';
    // The library ships in batches (docs/VIDEO-LIBRARY.md): a video reaches students
    // with its passing card, mapping and copy together. VIDEO_REGISTRY_ALL=1 lists
    // every analysed video, for checking the pipeline locally.
    if (!pass && !process.env.VIDEO_REGISTRY_ALL) continue;
    if (batch && !batch.has(v.id) && !published.has(v.id)) continue;
    const card = pass ? cardOf(v, a, s, stale) : null;
    if (!card && !process.env.VIDEO_REGISTRY_ALL) continue;
    // The file's own length (ffprobe) can be a few seconds under YouTube's.
    const durationSec = m?.durationSec || v.durationSec;
    const segments = (a?.topicSegments || []).map((g) => ({ ...g, end: Math.min(g.end, durationSec) }))
      .filter((g) => g.start < g.end && topicFits(v.title, topicLabel.get(g.topic) || g.topic, setTopics.get(v.id), g.topic));
    registry[v.id] = {
      title: displayTitle(v.title),
      session: String(v.title).match(/^\s*(\d+(?:\.\d+)?)/)?.[1] || null,
      date: titleDate(v.title) || v.publishedAt.slice(0, 10),
      durationSec,
      subject,
      year: subj?.year ?? null,
      term: subj?.semester ?? null,
      channel: v.channelId,
      playlist: v.playlists[0]?.id || null,
      topics: segments.map((g) => [g.topic, g.start, g.end, g.conf]),
      skips: (a?.skips || []).map((k) => [k.start, Math.min(k.end, durationSec), k.kind]).filter(([s, e]) => s < e),
      media: Boolean(m),
      captions: m?.captions || (a ? 'youtube' : null),
      card: Boolean(card),
      ...(v.description?.trim() && { note: v.description.trim() }),
    };
    if (card) cards[v.id] = card;
    for (const g of segments) {
      if (g.conf === 'ambiguous') continue;
      (topicIndex[g.topic] ||= []).push({ v: v.id, s: g.start, e: g.end, conf: g.conf });
    }
  }
  // The stretch that teaches a topic most surely, longest first within a confidence.
  const rank = { high: 0, medium: 1 };
  for (const list of Object.values(topicIndex)) list.sort((x, y) => rank[x.conf] - rank[y.conf] || (y.e - y.s) - (x.e - x.s));
  return { registry, cards, topicIndex, stale };
}

/** The run's report for the admin page, from the manifests the stages keep. */
export function runStatus({ registry, cards, before, media, pipeline, taken, stale = [] }) {
  const ids = new Set(taken);
  // A summary's own file says whether it is held: the manifest can lag a recheck.
  const held = [...ids].map((id) => [id, readJSON(path.join(DATA, id, 'summary.json'))]).filter(([, s]) => s?.status === 'held')
    .map(([id, s]) => ({ id, why: [...(s.checks?.lint?.errors || []), ...(s.checks?.coverage?.missing || []).map((m) => `missing ${m}`)].join('; ').slice(0, 160) || 'held by the verifier or the clarity reader' }))
    .concat(stale.map((id) => ({ id, why: 'its chapter lines no longer match its analysis' })));
  const failed = [
    ...Object.entries(media).filter(([id, m]) => ids.has(id) && m.error).map(([id, m]) => ({ id, step: 'media', error: String(m.error).slice(0, 160) })),
    ...Object.entries(pipeline).filter(([id]) => ids.has(id)).flatMap(([id, s]) => ['analysis', 'summary'].filter((k) => String(s[k] || '').startsWith('failed')).map((k) => ({ id, step: k, error: String(s[k]).slice(0, 160) }))),
  ];
  return {
    at: new Date().toISOString(),
    videos: Object.keys(registry).length,
    copies: Object.values(registry).filter((r) => r.media).length,
    cards: Object.keys(cards).length,
    published: Object.keys(cards).filter((id) => !before.has(id)).map((id) => ({ id })),
    held,
    failed,
  };
}

async function main() {
  const check = process.argv.includes('--check');
  const { registry, cards, topicIndex, stale: unmatched } = build();
  const cardDir0 = path.join(OUT, 'video-cards');
  const before = new Set((fs.existsSync(cardDir0) ? fs.readdirSync(cardDir0) : []).map((f) => f.replace(/\.js$/, '')));
  const files = new Map();
  files.set(path.join(OUT, 'video-registry.generated.js'), `${HEAD('VIDEO_REGISTRY — every video the library keeps, by YouTube id')}export const VIDEO_REGISTRY = ${js(registry)};\n`);
  files.set(path.join(OUT, 'video-topic-index.generated.js'), `${HEAD('VIDEO_TOPIC_INDEX — topic id -> the stretches of video that teach it, surest first')}export const VIDEO_TOPIC_INDEX = ${js(topicIndex)};\n`);
  const ids = Object.keys(cards).sort();
  // VIDEO_INDEX is small and loads with the app's video code, so a link to
  // any library video (?v=<id>&at=<s>) knows what it opens without the registry.
  const index = Object.fromEntries(Object.entries(registry).map(([id, r]) => [id, [r.title, r.subject, r.date, r.media ? 1 : 0, Math.round(r.skips.reduce((n, [s, e]) => n + e - s, 0)), r.durationSec]]));
  files.set(path.join(OUT, 'video-cards.generated.js'), `${HEAD('VIDEO_CARD_LOADERS — one lazy chunk per video card; VIDEO_INDEX — id -> [title, subject, date, our copy 1/0, seconds the skip list saves, length in seconds]')}export const VIDEO_INDEX = ${JSON.stringify(index)};\n\nexport const VIDEO_CARD_LOADERS = {\n${ids.map((id) => `  '${id}': () => import('./video-cards/${id}.js'),`).join('\n')}\n};\n`);
  for (const id of ids) files.set(path.join(OUT, 'video-cards', `${id}.js`), `${HEAD(`Video card ${id}`)}export default ${js(cards[id])};\n`);
  let stale = 0;
  for (const [file, text] of files) {
    const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    if (cur === text) continue;
    stale += 1;
    if (!check) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); }
  }
  // A card whose video no longer passes is removed.
  const cardDir = path.join(OUT, 'video-cards');
  for (const f of fs.existsSync(cardDir) ? fs.readdirSync(cardDir) : []) {
    if (ids.includes(f.replace(/\.js$/, ''))) continue;
    stale += 1;
    if (!check) fs.rmSync(path.join(cardDir, f));
  }
  console.log(`${Object.keys(registry).length} videos, ${ids.length} cards, ${Object.keys(topicIndex).length} topics; ${stale} file(s) ${check ? 'stale' : 'written'}`);
  if (check && stale) process.exit(1);
  if (process.argv.includes('--status')) {
    const dir = path.join(process.env.VIDEO_CACHE_DIR || path.join(ROOT, 'data-cache'), 'channels');
    const media = {};
    for (const f of fs.readdirSync(dir).filter((x) => /^media-manifest(\.\d+)?\.json$/.test(x))) Object.assign(media, readJSON(path.join(dir, f)));
    const status = runStatus({ registry, cards, before, media, pipeline: readJSON(path.join(dir, 'pipeline-manifest.json')) || {}, taken: takenVideos().map((v) => v.id), stale: unmatched });
    const { s3Env, putBuffer } = await import('./video-media.mjs');
    await putBuffer(await s3Env(), 'videos/_status.json', Buffer.from(JSON.stringify(status)), 'application/json');
    console.log(`status: ${status.videos} videos, ${status.copies} copies, ${status.cards} cards, ${status.published.length} published, ${status.held.length} held, ${status.failed.length} failed`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });
