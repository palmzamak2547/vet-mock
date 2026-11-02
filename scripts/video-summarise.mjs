#!/usr/bin/env node
// The one model step of the video pipeline: write a clip's layered summary
// from the slices scripts/video-analyse.mjs picked, then hold it to
// src/lib/video-summary-check.js and to a second, independent reading.
//
//   node --env-file=<file holding DEEPSEEK_API_KEY> scripts/video-summarise.mjs <dir> [--recheck]
//
// Reads <dir>/analysis.json and <dir>/deck.json; writes <dir>/summary.json
// with status "pass" or "held" and every check's result. A held summary is
// never published; its reasons say why.
//
// The structure is fixed before the model writes a word: one key point per
// equal stretch of teaching time, one line per chapter, at most 3 emphasis
// and 5 remember items. The model fills in text; code enforces the shape,
// and a failed item is rewritten on its own with its evidence, never by
// redrafting the whole summary. Calls: one draft, one check, then at most two
// rounds of item fixes, each with its check.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractJSON } from '../api/_lib/llm.js';
import { lintSummary, coverage, unsupportedClaims, thaiWords, keyPointCap, transliterated, LIMITS } from '../src/lib/video-summary-check.js';

const URL_ = 'https://api.deepseek.com/chat/completions';
const MODEL = process.env.LLM_MODEL || 'deepseek-flash';
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const seconds = (t) => (typeof t === 'number' ? t : String(t || '').split(':').map(Number).reduce((a, b) => a * 60 + b, 0));
const usage = { calls: 0, prompt: 0, completion: 0 };

// Writers at 0.2; the two judges at 0, so a verdict does not change between rounds.
async function ask(system, user, maxTokens, temperature = 0.2) {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, temperature, response_format: { type: 'json_object' }, thinking: { type: 'disabled' }, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`model answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  usage.calls += 1;
  usage.prompt += data.usage?.prompt_tokens || 0;
  usage.completion += data.usage?.completion_tokens || 0;
  const out = extractJSON(data.choices?.[0]?.message?.content || '');
  if (!out) throw new Error('reply was not JSON');
  return out;
}

const RULES = `Write the way Thai vet students write notes: Thai sentences, technical terms in English as the slides spell them. Word counts are Thai word-segmenter words; an English term is one word.
Each item teaches something examinable (a definition, mechanism, number, differentiator, diagnostic step or treatment) in ONE sentence; never restate a slide title, never narrate the lecture ("ต่อมาพูดถึง").
Truth: only what this lecture's transcript or slides say at that moment. A number is the slide's number. When the transcript is unclear and the slides do not say it, leave it out. Never add textbook facts. Captions mishear English terms: write the slide's term, never the misheard one.
Clarity: a student who reads only this line must understand it. Never name a person. Use only abbreviations the slides or transcript use. Keep different things apart: a cause is not a predisposing factor, a host factor is not a pathogen.
Voice: state the fact itself; never "อาจารย์กล่าวว่า", "อาจารย์บอกว่า", "ในคลิปนี้". No tables, no middle dot, no emoji, no quotation marks.
Wording: write % for percent and ชม. for hours. Never pair an English term with its Thai translation in one line (not "Fertility rate ... ผสมติด"). No study advice inside an item ("ต้องแยกให้ชัด", "ควรจำ", "อย่าลืมว่า"): say the fact. Use an English word only as the slides or the transcript use it.`;

const DRAFT = `You write the study summary of one recorded veterinary lecture for Thai veterinary students, from its transcript (YouTube's automatic Thai captions) and the lecture's own slides.
You get a JSON skeleton. Return it filled in: the same keys, the same slots and chapter ids in the same order, nothing added.
- oneLiner: what the lecture teaches, at most 22 words, one plain sentence about the subject itself (how it arises, how it is diagnosed, how it is treated); never a list of topic names, never opening with "สรุป" or "บทนี้".
- keyPoints: one per slot, its t (m:ss) inside the slot's range, at most 12 words: the most examinable thing taught in that stretch.
- emphasis: up to ${LIMITS.emphasis} things the lecture clearly stresses (said to remember, repeated, or set in red on a slide), each with t, at most 12 words; fewer when fewer are clearly stressed. Not a repeat of a key point.
- remember: up to ${LIMITS.remember} short definitions, numbers or differentiators worth memorising, each with t, at most 8 words; a number exactly as the slide writes it, the numbers the bank asks about first. Not a repeat of a key point.
- chapters: a line for every chapter id, at most 20 words, what that chapter teaches, including what its slides set in red, taught as content: never mention colours, slides or marks, never repeat the chapter's title or a key point word for word.
${RULES}`;

const FIX = `You repair single items of a lecture summary for Thai veterinary students. Each item comes with the rule it broke and its evidence. Return JSON only: {"items":[{"ref":"<the ref given>","t":"m:ss","text":"<the new text>"}]}, one per item given, each obeying every rule below and its own word limit.
${RULES}`;

// The third reading, without evidence: what a student sees is all they get.
const CLEAR = `You read study notes as a Thai veterinary student would, with nothing else to go on. Notes mix Thai with English terms and may be terse. For each numbered line decide whether a student understands it on its own.
A "point" line states one complete idea a student can learn from. A "chapter" line may list what a chapter teaches, separated by commas, each part understandable. Either fails when it is garbled, half-finished, leaves its subject or referent unclear, or uses a word whose meaning there is unclear.
Judge clarity only. Never judge whether a line is true, and never use your own knowledge of the subject: another reader checks the facts against the lecture.
Return JSON only: {"results":[{"i":0,"clear":true,"why":""}]}; say why in one short English sentence when not clear.`;

const CHECK = `You check a lecture summary against its evidence. For each numbered item you get the transcript around its time (automatic Thai captions; misheard English terms that clearly match the slide's term count as support) and the slides taught then.
Return JSON only: {"results":[{"i":0,"supported":true,"why":""}]}
An item is unsupported when it states anything the evidence does not say, changes a number, merges two different things (for example lists a pathogen among predisposing factors), blurs a distinction the evidence makes, names a person, uses an abbreviation the evidence does not use, or is worded so a student could misread it. Say why in one short English sentence when unsupported.`;

function transcriptSlice(lines, start, end, step = 20) {
  const out = [];
  for (const [t, text] of lines) {
    if (t < start || t >= end) continue;
    const last = out[out.length - 1];
    if (last && t - last.t < step) last.text += ` ${text}`;
    else out.push({ t, text });
  }
  return out.map((l) => `[${mmss(l.t)}] ${l.text}`).join('\n');
}

const pageText = (deck, n) => (deck?.pages?.[n - 1]?.text || '').replace(/\s+/g, ' ').trim().slice(0, 900);
// What the prompts ask for, under the lint's caps: the model counts Thai
// words differently from the segmenter.
const LIMIT = { oneLiner: 22, keyPoints: 12, emphasis: 11, remember: 8, chapters: 20 };

async function main() {
  const dir = process.argv[2];
  const a = JSON.parse(fs.readFileSync(path.join(dir, 'analysis.json'), 'utf8'));
  const deckFile = path.join(dir, 'deck.json');
  const deck = fs.existsSync(deckFile) ? JSON.parse(fs.readFileSync(deckFile, 'utf8')) : null;
  const chapters = a.chapters.map((c, i) => ({ ...c, id: `c${i + 1}` }));
  const chapterOf = (t) => chapters.find((c) => t >= c.start && t < c.end) || chapters[chapters.length - 1];
  const transcriptWords = a.lines.reduce((n, [, text]) => n + thaiWords(text), 0);
  const cap = keyPointCap(a.duration);
  const t0 = a.lines[0][0];
  const t1 = a.lines[a.lines.length - 1][0];
  const teaching = { start: t0, end: t1 };
  // One key point per equal stretch of teaching time: the card follows the
  // whole lecture by construction and never exceeds its cap.
  const slots = Array.from({ length: cap }, (_, k) => ({ id: `k${k + 1}`, start: Math.round(t0 + ((t1 - t0) * k) / cap), end: Math.round(t0 + ((t1 - t0) * (k + 1)) / cap) }));
  const stressed = a.mustCover.filter((m) => m.kind === 'stress');
  const marks = a.mustCover.filter((m) => m.kind === 'mark');

  const pagesNear = (t) => [...new Set([...chapterOf(t).pages, ...(a.pages || []).filter((p) => p.taught && Math.abs(p.at - t) <= 120).map((p) => p.page)])];
  // A chapter line's evidence is its whole chapter; a point's, the moment
  // (half a minute before to two and a half after) and the slides of its chapter.
  const evidenceAt = (t, chapterId = null) => {
    const c = chapterId && chapters.find((x) => x.id === chapterId);
    if (c) return [transcriptSlice(a.lines, c.start, c.end, 1e9), ...c.pages.map((n) => pageText(deck, n))].join('\n');
    return [transcriptSlice(a.lines, t - 30, t + 150, 1e9), ...pagesNear(t).map((n) => pageText(deck, n))].join('\n');
  };
  const known = [...a.mustCover.filter((m) => m.kind === 'concept').map((m) => m.label), ...(deck ? deck.pages.flatMap((p) => p.text.match(/[A-Za-z][A-Za-z-]{4,}/g) || []) : []),
    'alpha', 'beta', 'gamma', 'delta', 'kappa']; // Greek letters a slide's text layer drops (PGF2α prints as PGF2)

  const skeleton = {
    oneLiner: '',
    keyPoints: slots.map((s) => ({ slot: s.id, range: `${mmss(s.start)}-${mmss(s.end)}`, t: '', text: '' })),
    emphasis: [{ t: '', text: '' }],
    remember: [{ t: '', text: '' }],
    chapters: chapters.map((c) => ({ id: c.id, line: '' })),
  };
  const brief = [
    `Lecture: ${a.title} (${mmss(a.duration)}); course ${a.subject}.`,
    `Breaks without teaching: ${a.breaks.map((b) => `${mmss(b.start)}-${mmss(b.end)}`).join(', ') || 'none'}.`,
    'Chapters, each with its slides (red-marked text listed) and its transcript:',
    ...chapters.map((c) => [`## ${c.id} ${mmss(c.start)}-${mmss(c.end)} ${c.title}`, ...c.pages.map((n) => `[slide ${n}] ${pageText(deck, n)}${deck?.pages?.[n - 1]?.marked?.length ? `\n[red on slide ${n}] ${deck.pages[n - 1].marked.join('; ')}` : ''}`), transcriptSlice(a.lines, c.start, c.end)].join('\n')),
    `Stressed moments: ${stressed.map((m) => `${mmss(m.at)} ${m.text}`).join(' | ')}`,
    `Slide numbers the bank asks about: ${a.mustCover.filter((m) => m.kind === 'number' && m.asked).map((m) => `${mmss(m.at)} ${m.text}`).join(' | ') || 'none'}`,
    'Skeleton to fill:', JSON.stringify(skeleton),
  ].join('\n\n');

  // A jump lands where a sentence starts: the caption line at or just before t.
  const lineStarts = a.lines.map(([t]) => t);
  const snap = (t) => { let best = t; for (const s of lineStarts) { if (s <= t + 2) best = s; else break; } return Math.round(best); };
  const clean = (text) => String(text || '').replace(/\s+/g, ' ').trim();
  // A jump lands on the sentence that says it: within a minute before the
  // writer's t and four after (inside a key point's slot), the caption line
  // that says the most of what is particular to the point. A number counts
  // most, a term the lecture says rarely next, a term it says everywhere
  // ("endometritis" in this lecture) not at all. Nothing heard: t stays.
  const heardIn = (w, text) => new RegExp(`(?<![a-z])${w}`).test(text.toLowerCase()) || (w.length >= 6 && transliterated(text, w));
  const spread = new Map();
  const linesWith = (w) => { if (!spread.has(w)) spread.set(w, a.lines.filter(([, x]) => heardIn(w, x)).length); return spread.get(w); };
  const refine = (p, slot = null) => {
    const terms = [...new Set((p.text.match(/[A-Za-z][A-Za-z0-9-]{2,}/g) || []).map((w) => w.toLowerCase()))].filter((w) => !/^(and|the|with|for|vs)$/.test(w));
    const nums = (p.text.match(/\d+(?:[.,]\d+)?/g) || []).filter((n) => n.length > 1);
    const lo = Math.max(slot?.start ?? 0, p.t - 60);
    const hi = Math.min(slot?.end ?? Infinity, p.t + 240);
    let best = null;
    for (const [t, text] of a.lines) {
      if (t < lo || t > hi) continue;
      const score = 3 * nums.filter((n) => text.includes(n)).length + 2 * terms.filter((w) => linesWith(w) <= 12 && heardIn(w, text)).length;
      if (score > 0 && (!best || score > best.score || (score === best.score && Math.abs(t - p.t) < Math.abs(best.t - p.t)))) best = { t, score };
    }
    return best ? { ...p, t: Math.floor(best.t) } : p;
  };
  const refineAll = (s) => {
    s.keyPoints = s.keyPoints.map((p) => refine(p, slots.find((x) => x.id === p.slot)));
    s.emphasis = s.emphasis.map((p) => refine(p));
    s.remember = s.remember.map((p) => refine(p));
    return s;
  };
  // A chapter line is one line, not one sentence: two clauses joined by a
  // semicolon read better joined by a comma.
  const chapterLine = (text) => clean(text).replace(/\s*;\s*/g, ', ');
  // Code, not the model, decides the shape.
  const shape = (raw) => ({
    oneLiner: clean(raw.oneLiner),
    keyPoints: slots.map((s, k) => {
      const p = (raw.keyPoints || []).find((x) => x.slot === s.id) || (raw.keyPoints || [])[k] || {};
      const t = Math.min(s.end, Math.max(s.start, seconds(p.t)));
      return { slot: s.id, t: snap(t), text: clean(p.text) };
    }).filter((p) => p.text),
    emphasis: (raw.emphasis || []).filter((p) => clean(p.text)).slice(0, LIMITS.emphasis).map((p) => ({ t: snap(seconds(p.t)), text: clean(p.text) })),
    remember: (raw.remember || []).filter((p) => clean(p.text)).slice(0, LIMITS.remember).map((p) => ({ t: snap(seconds(p.t)), text: clean(p.text) })),
    chapters: chapters.map((c) => ({ id: c.id, t: c.start, line: chapterLine((raw.chapters || []).find((x) => x.id === c.id)?.line) })),
  });

  // One fact once, decided by code: an emphasis item that says what a key
  // point says becomes that key point's star (stressed), and a remember item
  // that repeats a card item goes. Each merge is logged.
  const merges = [];
  const words = (t) => new Set(String(t || '').toLowerCase().match(/[a-z0-9]+|[฀-๿]+/g) || []);
  const same = (x, y) => {
    if (Math.abs(x.t - y.t) > 60) return false;
    const a = words(x.text);
    const b = words(y.text);
    return [...a].filter((w) => b.has(w)).length / Math.max(1, Math.min(a.size, b.size)) >= 0.6;
  };
  const dedupe = (s) => {
    s.emphasis = s.emphasis.filter((e) => {
      const k = s.keyPoints.find((p) => same(p, e));
      if (!k) return true;
      k.stressed = true;
      merges.push(`emphasis ${mmss(e.t)} became the star of key point ${k.slot}`);
      return false;
    });
    s.remember = s.remember.filter((r, i) => {
      const dup = [...s.keyPoints, ...s.emphasis, ...s.remember.slice(0, i)].find((p) => same(p, r));
      if (dup) merges.push(`remember ${mmss(r.t)} repeated a card item and was dropped`);
      return !dup;
    });
    return s;
  };

  // The second reading, of each item once: an unchanged item keeps its verdict.
  const verdicts = new Map();
  const verify = async (s) => {
    const list = [...['keyPoints', 'emphasis', 'remember'].flatMap((layer) => s[layer].map((p, i) => ({ ref: `${layer}:${i}`, layer, t: p.t, text: p.text }))),
      ...s.chapters.map((c, i) => ({ ref: `chapters:${i}`, layer: 'chapter', id: c.id, t: c.t, text: c.line }))];
    const key = (p) => `${p.layer}|${p.t}|${p.text}`;
    const fresh = list.filter((p) => !verdicts.has(key(p)));
    if (fresh.length) {
      const user = fresh.map((p, i) => `#${i} (${p.layer}${p.id ? ` ${p.id}` : ''}, ${mmss(p.t)}) ${p.text}\nEVIDENCE:\n${evidenceAt(p.t, p.id)}`).join('\n\n');
      const out = await ask(CHECK, user, 3000, 0);
      fresh.forEach((p, i) => verdicts.set(key(p), (out.results || []).find((r) => r.i === i) || { supported: false, why: 'no verdict returned' }));
    }
    return list.map((p) => ({ ...p, ...verdicts.get(key(p)) })).filter((r) => r.supported !== true);
  };
  const clarity = new Map();
  const unclear = async (s) => {
    const list = [{ ref: 'oneLiner', kind: 'chapter', text: s.oneLiner }, ...['keyPoints', 'emphasis', 'remember'].flatMap((layer) => s[layer].map((p, i) => ({ ref: `${layer}:${i}`, kind: 'point', text: p.text }))),
      ...s.chapters.map((c, i) => ({ ref: `chapters:${i}`, kind: 'chapter', text: c.line }))];
    const fresh = list.filter((p) => !clarity.has(p.text));
    if (fresh.length) {
      const out = await ask(CLEAR, fresh.map((p, i) => `#${i} (${p.kind}) ${p.text}`).join('\n'), 1500, 0);
      fresh.forEach((p, i) => clarity.set(p.text, (out.results || []).find((r) => r.i === i) || { clear: false, why: 'no verdict returned' }));
    }
    return list.map((p) => ({ ...p, ...clarity.get(p.text) })).filter((r) => r.clear !== true);
  };
  const judge = async (s) => {
    const lint = lintSummary(s, { durationSec: a.duration, transcriptWords, chapterIds: chapters.map((c) => c.id), breaks: a.breaks, teaching });
    const cov = coverage(s, a.mustCover, { chapters, pageText: (n) => pageText(deck, n) });
    const unsupported = unsupportedClaims(s, evidenceAt, known);
    const rejected = await verify(s);
    const unclearItems = await unclear(s);
    return { lint, coverage: cov, unsupported, rejected, unclear: unclearItems, ok: lint.ok && !cov.missing.length && !unsupported.length && !rejected.length && !unclearItems.length };
  };

  // What to rewrite, item by item, and why.
  const clarityTries = new Map();
  const repairs = (s, checks) => {
    const out = new Map();
    const add = (ref, why) => out.set(ref, [...(out.get(ref) || []), why]);
    const refOf = (layer, t) => {
      const i = (s[layer] || []).findIndex((p) => Math.abs(p.t - t) < 1);
      return i >= 0 ? `${layer}:${i}` : null;
    };
    // Only what a check failed is rewritten: the prompts' word targets guide
    // the draft, the lint's caps decide a repair.
    s.chapters.forEach((c, i) => { if (!c.line) add(`chapters:${i}`, 'missing'); });
    for (const e of checks.lint.errors) {
      const m = e.match(/^(keyPoints|emphasis|remember) (\d+): (.*)$/);
      if (m) { const ref = refOf(m[1], Number(m[2])); if (ref) add(ref, m[3]); }
      if (e.startsWith('one-liner')) add('oneLiner', e.replace(/^one-liner:?\s*/, ''));
      const c = e.match(/^chapter (c\d+): (.*)$/);
      if (c) {
        const n = c[2].match(/^(\d+) words/);
        // Written as short comma-separated parts, code can fit it to the cap.
        add(`chapters:${chapters.findIndex((x) => x.id === c[1])}`, n ? `now ${n[1]} words: rewrite it as 3 or 4 short parts separated by commas, most examinable first, ${LIMIT.chapters} words in all` : c[2]);
      }
      const d = e.match(/^(keyPoints|emphasis|remember) (\d+): says what (keyPoints|emphasis|remember) \d+ says$/);
      if (d) { const ref = refOf(d[1], Number(d[2])); if (ref) add(ref, `repeats a ${d[3]} item: write a different fact`); }
    }
    for (const u of checks.unsupported) {
      const layer = u.layer === 'chapter' ? 'chapters' : u.layer;
      const i = layer === 'chapters' ? s.chapters.findIndex((c) => c.line === u.text) : s[layer].findIndex((p) => p.text === u.text);
      if (i >= 0) add(`${layer}:${i}`, `not in the evidence: ${[...u.numbers, ...u.terms].join(', ')}`);
    }
    for (const r of checks.rejected) add(r.ref, `the checker rejected it: ${r.why || 'unsupported'}`);
    // A clarity rewrite is tried twice per item; a third "unclear" holds the summary.
    for (const r of checks.unclear) if ((clarityTries.get(r.ref) || 0) < 2) { clarityTries.set(r.ref, (clarityTries.get(r.ref) || 0) + 1); add(r.ref, `a student could not follow it: ${r.why || 'unclear'}; say it plainly`); }
    if (thaiWords(s.oneLiner) > LIMITS.oneLiner) add('oneLiner', `at most ${LIMIT.oneLiner} words`);
    for (const id of checks.coverage.missing) {
      const m = marks.find((x) => x.id === id) || stressed.find((x) => x.id === id);
      if (!m) continue;
      add(`chapters:${chapters.indexOf(chapterOf(m.at))}`, `must also teach ${m.kind === 'mark' ? `"${m.text}" (as content: never mention colours, slides or marks)` : `what is stressed at ${mmss(m.at)}`}`);
    }
    return out;
  };
  const applyFixes = async (s, todo) => {
    const items = [...todo].map(([ref, why]) => {
      const [layer, i] = ref.split(':');
      const cur = layer === 'oneLiner' ? { t: t0, text: s.oneLiner, id: null, whole: true }
        : layer === 'chapters' ? { t: s.chapters[i].t, text: s.chapters[i].line, id: s.chapters[i].id } : s[layer][i];
      const limit = LIMIT[layer] || LIMITS.point;
      // The one-liner is an overview of the whole lecture, written from its
      // outline: the parts it covers in order, no details, no numbers.
      const evidence = cur.whole ? `OUTLINE: ${chapters.map((c) => c.title).join('; ')}` : evidenceAt(cur.t, cur.id || null);
      const what = cur.whole ? ', an overview naming the lecture\'s parts in order, no details or numbers, Thai with English terms' : '';
      return `ref ${ref} (${layer}, at most ${limit} words${what}${cur.whole ? '' : `, t ${mmss(cur.t)}`}${cur.id ? `, chapter ${cur.id}` : ''})\nnow: ${cur.text || '(empty)'}\nbroke: ${why.join('; ')}\nEVIDENCE:\n${evidence}`;
    });
    const out = await ask(FIX, items.join('\n\n'), 2500);
    for (const it of out.items || []) {
      const [layer, i] = String(it.ref || '').split(':');
      if (layer === 'oneLiner') s.oneLiner = clean(it.text);
      else if (layer === 'chapters' && s.chapters[i]) s.chapters[i].line = chapterLine(it.text);
      else if (s[layer]?.[i]) {
        const slot = layer === 'keyPoints' && slots.find((x) => x.id === s[layer][i].slot);
        const t = seconds(it.t);
        s[layer][i] = { ...s[layer][i], text: clean(it.text), t: snap(slot ? Math.min(slot.end, Math.max(slot.start, t)) : t) };
      }
    }
    // An over-budget card sheds its longest remember, then emphasis, items.
    return s;
  };

  // --recheck judges the summary on disk; --resume also repairs what fails.
  // Neither drafts a new one, so a checker change costs only what it finds.
  const resume = process.argv.includes('--resume');
  const previous = process.argv.some((x) => x === '--recheck' || x === '--resume' || x.startsWith('--redo=')) ? JSON.parse(fs.readFileSync(path.join(dir, 'summary.json'), 'utf8')) : null;
  // Verdicts survive between runs: an item read once, unchanged, is not read
  // again (a judge's answer shifts with what else is in its batch).
  for (const [k, v] of previous?.cache?.verdicts || []) verdicts.set(k, v);
  for (const [k, v] of previous?.cache?.clarity || []) clarity.set(k, v);
  // A chapter line over its cap sheds its last comma-separated parts, by
  // code, while every must-cover item stays covered. A line that cannot
  // shrink so goes to the writer.
  const covOf = (s) => coverage(s, a.mustCover, { chapters, pageText: (n) => pageText(deck, n) }).missing.length;
  const trimChapters = (s) => {
    s.chapters.forEach((c, i) => {
      const parts = c.line.split(/,\s*/);
      const base = covOf(s);
      while (thaiWords(parts.join(', ')) > LIMITS.chapterLine && parts.length > 1) {
        const trial = { ...s, chapters: s.chapters.map((x, k) => (k === i ? { ...x, line: parts.slice(0, -1).join(', ') } : x)) };
        if (covOf(trial) > base) break;
        parts.pop();
      }
      if (parts.join(', ') !== c.line) { merges.push(`chapter ${c.id} cut to ${thaiWords(parts.join(', '))} words`); c.line = parts.join(', '); }
    });
    return s;
  };
  let summary = previous ? refineAll(previous.summary) : trimChapters(refineAll(dedupe(shape(await ask(DRAFT, brief, 6000)))));
  let checks = await judge(summary);
  const history = previous ? previous.history : [];
  // --redo=oneLiner,keyPoints:3: a reviewer's call to rewrite named items
  // from their evidence; they are checked like any other change.
  const redo = (process.argv.find((x) => x.startsWith('--redo='))?.slice(7) || '').split(',').filter(Boolean);
  if (redo.length && previous) {
    summary = refineAll(dedupe(await applyFixes(summary, new Map(redo.map((ref) => [ref, ['a reviewer asked for it to be rewritten from its evidence']])))));
    checks = await judge(summary);
  }
  for (let round = 0; round < 4 && !checks.ok && (!previous || resume || redo.length); round++) {
    const todo = repairs(summary, checks);
    history.push({ round, lint: checks.lint.errors, missing: checks.coverage.missing, unsupported: checks.unsupported.length, rejected: checks.rejected.length, unclear: checks.unclear.length, fixed: [...todo.keys()] });
    if (!todo.size && checks.lint.errors.some((e) => e.startsWith('expanded summary'))) {
      // Only the total is over: shorten the longest card items.
      const card = ['keyPoints', 'emphasis', 'remember'].flatMap((layer) => summary[layer].map((p, i) => [`${layer}:${i}`, thaiWords(p.text)]));
      card.sort((x, y) => y[1] - x[1]).slice(0, 4).forEach(([ref, n]) => todo.set(ref, [`shorten to ${Math.max(6, n - 4)} words, the card is over its total`]));
    }
    if (!todo.size) break;
    summary = trimChapters(refineAll(dedupe(await applyFixes(summary, todo))));
    checks = await judge(summary);
  }

  const covered = new Map(checks.coverage.covered.map((c) => [c.id, c.layer]));
  const byLayer = {};
  for (const layer of covered.values()) byLayer[layer] = (byLayer[layer] || 0) + 1;
  const result = {
    status: checks.ok ? 'pass' : 'held',
    model: MODEL,
    usage,
    summary,
    // The player's index: each concept at its densest minute, each slide
    // number as the slide prints it, at the minute its page is taught.
    topicIndex: [
      ...a.mustCover.filter((m) => m.kind === 'concept').map((m) => ({ kind: 'concept', term: m.label, at: m.at, heard: m.heard })),
      ...a.mustCover.filter((m) => m.kind === 'number').map((m) => ({ kind: 'number', text: m.text, at: m.at, page: m.page })),
    ],
    numbers: { ...checks.lint.numbers, coverage: { items: checks.coverage.items, covered: checks.coverage.covered.length, byLayer, missing: checks.coverage.missing } },
    checks,
    history,
    merges,
    cache: { verdicts: [...verdicts], clarity: [...clarity] },
  };
  fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(result, null, 2));
  console.log(`${result.status}: ${JSON.stringify(result.numbers)}; ${usage.calls} calls, ${usage.prompt} prompt + ${usage.completion} completion tokens`);
  if (!checks.ok) console.log(JSON.stringify({ lint: checks.lint.errors, missing: checks.coverage.missing, unsupported: checks.unsupported, rejected: checks.rejected }, null, 1).slice(0, 3000));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });
