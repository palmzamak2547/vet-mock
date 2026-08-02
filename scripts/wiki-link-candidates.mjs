#!/usr/bin/env node
// ============================================================
// wiki-link-candidates.mjs — propose which article a question belongs to
// ============================================================
// Usage: node scripts/wiki-link-candidates.mjs [outfile.json]
//
// 893 questions sit in past-paper buckets (`vca/*`, `mahahon-*`, `special-prep`,
// untopiced banks). They are real questions about real subjects, but their
// "topic" is the compilation they came from, so `hasTopic(subject, topic)` finds
// nothing and the reader gets no article to read after getting one wrong.
//
// The articles they need already exist and are already verified. This is a
// retrieval problem, not a writing problem — which is why it is worth doing
// first: it reaches ~900 more questions without adding a single new claim that
// could be wrong.
//
// This script only PROPOSES. It scores every governed section against each
// question by weighted term overlap and emits the top candidates. Deciding
// whether a candidate genuinely supports the question is a judgement call and
// is made downstream — a retrieval score is not evidence of a match.
//
// Scoring is IDF-weighted overlap: a question and a section that share
// "cryptococcosis" should beat a pair that share "สุนัข". Thai has no spaces,
// so segmentation uses Intl.Segmenter rather than splitting on whitespace,
// which would otherwise reduce every Thai sentence to one useless token.
// ============================================================

import fs from 'node:fs';
import { listTopics, loadTopic } from '../src/lib/vetwiki/index.js';
import { BANK_REGISTRY } from '../src/data/bank-registry.generated.js';

const OUT = process.argv[2] || 'wiki-link-candidates.json';
const TOP_N = 5;

const seg = new Intl.Segmenter('th', { granularity: 'word' });

/** Split mixed Thai/English text into comparable terms. */
function terms(text) {
  const out = [];
  for (const { segment, isWordLike } of seg.segment(String(text || '').toLowerCase())) {
    if (!isWordLike) continue;
    const t = segment.trim();
    // single Latin letters and bare digits carry no topical signal
    if (t.length < 2) continue;
    if (/^\d+$/.test(t)) continue;
    out.push(t);
  }
  return out;
}

function flatten(body, out = []) {
  for (const item of body || []) {
    if (typeof item === 'string') { out.push(item); continue; }
    if (!item || typeof item !== 'object') continue;
    if (item.bullets) for (const b of item.bullets) out.push(typeof b === 'string' ? b : `${b.label} ${b.value}`);
    if (item.sub) { out.push(item.sub); flatten(item.body, out); }
    if (item.callout) out.push(item.callout);
    if (item.table) {
      for (const h of item.table.headers || []) out.push(h);
      for (const r of item.table.rows || []) for (const c of r) out.push(c);
    }
  }
  return out;
}

// ---- build the section corpus ----
const sections = [];
const governed = new Map();
for (const t of listTopics()) {
  if (!governed.has(t.subject)) governed.set(t.subject, new Set());
  governed.get(t.subject).add(t.topic);
  const full = loadTopic(t.subject, t.topic);
  for (const s of full?.sections || []) {
    const text = [t.title, t.summary, s.heading, ...flatten(s.body)].join(' ');
    const tf = new Map();
    for (const w of terms(text)) tf.set(w, (tf.get(w) || 0) + 1);
    sections.push({
      sectionId: s.id, heading: s.heading, subject: t.subject, topic: t.topic,
      title: t.title, tf,
    });
  }
}

// ---- idf over the section corpus ----
const df = new Map();
for (const s of sections) for (const w of s.tf.keys()) df.set(w, (df.get(w) || 0) + 1);
const N = sections.length;
const idf = (w) => Math.log(1 + N / (1 + (df.get(w) || 0)));

// section vector norms, so a long section does not win on length alone
for (const s of sections) {
  let sum = 0;
  for (const [w, n] of s.tf) { const v = (1 + Math.log(n)) * idf(w); sum += v * v; s.tf.set(w, v); }
  s.norm = Math.sqrt(sum) || 1;
}

function score(qTerms) {
  const qtf = new Map();
  for (const w of qTerms) qtf.set(w, (qtf.get(w) || 0) + 1);
  let qnorm = 0;
  for (const [w, n] of qtf) { const v = (1 + Math.log(n)) * idf(w); qtf.set(w, v); qnorm += v * v; }
  qnorm = Math.sqrt(qnorm) || 1;

  const out = [];
  for (const s of sections) {
    let dot = 0, shared = [];
    for (const [w, v] of qtf) {
      const sv = s.tf.get(w);
      if (sv) { dot += v * sv; if (shared.length < 8 && idf(w) > 2) shared.push(w); }
    }
    if (dot > 0) out.push({ s, sim: dot / (qnorm * s.norm), shared });
  }
  out.sort((a, b) => b.sim - a.sim);
  return out.slice(0, TOP_N);
}

// ---- the questions that need linking ----
const BUCKET_TOPIC = /^(mahahon-|uncertain-scope|special-prep)/;
const BUCKET_SUBJECT = /^(vca|repro|surg[123]|com4)$/;

const items = [];
for (const entry of BANK_REGISTRY) {
  const bank = await entry.load();
  for (const q of (Array.isArray(bank) ? bank : [])) {
    if (!q?.subject) continue;
    if (Array.isArray(q.wikiRefs) && q.wikiRefs.length) continue;   // already linked
    const topic = q.topic || '(no topic)';
    if (governed.get(q.subject)?.has(topic)) continue;              // topic-level link already works
    const isBucket = BUCKET_TOPIC.test(topic) || BUCKET_SUBJECT.test(q.subject) || topic === '(no topic)';
    if (!isBucket) continue;                                        // teachable gap, needs an article not a link

    const qText = [q.q, ...(q.options || []), q.explain].filter(Boolean).join(' ');
    const cands = score(terms(qText));
    if (!cands.length) continue;
    items.push({
      id: q.id, bank: entry.file, subject: q.subject, topic,
      question: q.q,
      options: q.options || [],
      // the banks key the correct option as `answer`; there is no `a` field
      answerIndex: typeof q.answer === 'number' ? q.answer : undefined,
      explain: q.explain || '',
      candidates: cands.map((c) => ({
        sectionId: c.s.sectionId, heading: c.s.heading,
        articleTitle: c.s.title, wikiSubject: c.s.subject, wikiTopic: c.s.topic,
        similarity: Number(c.sim.toFixed(4)),
        sharedTerms: c.shared,
      })),
    });
  }
}

items.sort((a, b) => b.candidates[0].similarity - a.candidates[0].similarity);
fs.writeFileSync(OUT, JSON.stringify({ generated: items.length, sections: N, items }, null, 2));

const strong = items.filter((i) => i.candidates[0].similarity >= 0.20).length;
const weak = items.filter((i) => i.candidates[0].similarity < 0.08).length;
console.log(`governed sections indexed : ${N}`);
console.log(`questions needing a link  : ${items.length}`);
console.log(`  top candidate >= 0.20   : ${strong}`);
console.log(`  top candidate <  0.08   : ${weak}  (likely no good article yet)`);
console.log(`\nwrote ${OUT}`);
