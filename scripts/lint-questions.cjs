#!/usr/bin/env node
/**
 * lint-questions.cjs
 *
 * Long-term guard against the two biases we keep tripping over:
 *
 *   1. POSITION BIAS  — correct answer always at the same option index.
 *      Symptom: student gets ~80% by clicking B every time (real
 *      feedback after v5.2.0).
 *
 *   2. LENGTH BIAS    — correct answer noticeably longer/more detailed
 *      than the distractors. Symptom: pick the longest option, win.
 *
 * Bonus checks:
 *   3. ** markdown bold leaking into question/options/explain text —
 *      reads as AI-written and sometimes renders literally if the
 *      string is fed into a non-markdown sink.
 *
 * Exit code 0 if everything is within thresholds, 1 otherwise — so this
 * can run in CI / a `npm run` script and fail the build on regression.
 *
 *     node scripts/lint-questions.cjs              # human report
 *     node scripts/lint-questions.cjs --json       # machine output
 *     node scripts/lint-questions.cjs --warn-only  # never exit non-zero
 */

const fs = require('fs');
const path = require('path');

const FILES = [
  'src/data/questions-com3.js',
  'src/data/questions-com4.js',
  'src/data/questions-com5.js',
  'src/data/questions-engprof.js',
];

// Thresholds. Tunable — these are calibrated from the v5.2.0 disaster
// (94% at B) so even a much milder version of the same problem trips.
const POSITION_BIAS_PCT = 0.50;   // any one position holds > 50% of the answers
const LENGTH_BIAS_RATIO = 1.6;    // correct option > 1.6× the mean distractor
const MIN_TOPIC_N = 5;            // ignore tiny topic buckets where bias is just sample noise

const args = process.argv.slice(2);
const wantJson = args.includes('--json');
const warnOnly = args.includes('--warn-only');

// ── Single-line JS string array splitter (same logic as fix-answer-bias) ──
function splitJsStringArray(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    if (i >= s.length) break;
    if (s[i] !== "'") return null;
    const start = i;
    i++;
    while (i < s.length) {
      if (s[i] === '\\') { i += 2; continue; }
      if (s[i] === "'") { i++; break; }
      i++;
    }
    // strip outer quotes + un-escape
    out.push(s.slice(start + 1, i - 1).replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
  }
  return out;
}

// ── Naive question-block extractor. Skips embedded objects (e.g. flag).
//    Each MCQ entry is on its own line with options + answer + topic. ──
function parseQuestions(src, file) {
  const blocks = src.split(/\n  \{ id: /).slice(1);
  const items = [];
  for (const b of blocks) {
    const idMatch = b.match(/^(\d+),/);
    const subjectMatch = b.match(/subject: '([^']+)'/);
    const topicMatch = b.match(/topic: '([^']+)'/);
    const typeMatch = b.match(/type: '([^']+)'/);
    const optsMatch = b.match(/options: \[([^\n]+)\]/);
    const answerMatch = b.match(/answer: (\d+)/);
    const qMatch = b.match(/q: '((?:[^'\\]|\\.)*)'/);

    if (!idMatch || !typeMatch) continue;
    const item = {
      id: Number(idMatch[1]),
      subject: subjectMatch ? subjectMatch[1] : '?',
      topic: topicMatch ? topicMatch[1] : '?',
      type: typeMatch[1],
      file,
    };
    if (item.type !== 'mcq') {
      // Still record q text for ** check
      item.q = qMatch ? qMatch[1] : '';
      items.push(item);
      continue;
    }
    if (!optsMatch || !answerMatch) continue;
    const opts = splitJsStringArray(optsMatch[1]);
    if (!opts) continue;
    item.options = opts;
    item.answer = Number(answerMatch[1]);
    item.q = qMatch ? qMatch[1] : '';
    items.push(item);
  }
  return items;
}

// ── Checks ────────────────────────────────────────────────────────────
function checkPositionBias(questions) {
  // Group by (subject, topic), then look at answer-index distribution
  const groups = {};
  for (const q of questions) {
    if (q.type !== 'mcq') continue;
    const key = `${q.subject}::${q.topic}`;
    (groups[key] = groups[key] || []).push(q);
  }
  const findings = [];
  for (const [key, qs] of Object.entries(groups)) {
    if (qs.length < MIN_TOPIC_N) continue;
    const counts = {};
    qs.forEach((q) => { counts[q.answer] = (counts[q.answer] || 0) + 1; });
    const maxIdx = Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    const maxCount = counts[maxIdx];
    const pct = maxCount / qs.length;
    if (pct > POSITION_BIAS_PCT) {
      findings.push({
        kind: 'position-bias',
        severity: pct > 0.7 ? 'error' : 'warn',
        topic: key,
        n: qs.length,
        worstIndex: Number(maxIdx),
        worstPct: Math.round(pct * 100),
        distribution: counts,
        ids: qs.filter((q) => q.answer === Number(maxIdx)).map((q) => q.id),
      });
    }
  }
  return findings;
}

function checkLengthBias(questions) {
  const findings = [];
  for (const q of questions) {
    if (q.type !== 'mcq' || !q.options || q.options.length < 3) continue;
    const correctLen = q.options[q.answer].length;
    const distractors = q.options.filter((_, i) => i !== q.answer);
    if (distractors.length < 2) continue;
    const mean = distractors.reduce((s, x) => s + x.length, 0) / distractors.length;
    if (mean === 0) continue;
    const ratio = correctLen / mean;
    if (ratio > LENGTH_BIAS_RATIO) {
      findings.push({
        kind: 'length-bias',
        severity: ratio > 2.5 ? 'error' : 'warn',
        id: q.id,
        topic: `${q.subject}::${q.topic}`,
        correctLen,
        meanDistractorLen: Math.round(mean),
        ratio: Math.round(ratio * 10) / 10,
      });
    }
  }
  return findings;
}

function checkMarkdownLeak(questions) {
  const findings = [];
  for (const q of questions) {
    const fields = { q: q.q, options: (q.options || []).join(' || ') };
    for (const [name, text] of Object.entries(fields)) {
      if (!text) continue;
      // Match **...** that's >= 1 char inside (skip lone ** which can be
      // a passage separator or sentinel)
      if (/\*\*[^*\n]+?\*\*/.test(text)) {
        findings.push({
          kind: 'markdown-bold',
          severity: 'warn',
          id: q.id,
          topic: `${q.subject}::${q.topic}`,
          field: name,
        });
        break; // one finding per question
      }
    }
  }
  return findings;
}

// ── Run ───────────────────────────────────────────────────────────────
const root = path.resolve(__dirname, '..');
const allQs = [];
for (const rel of FILES) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    console.error(`! missing ${rel}`);
    continue;
  }
  const src = fs.readFileSync(abs, 'utf8');
  const items = parseQuestions(src, rel);
  allQs.push(...items);
}

const findings = [
  ...checkPositionBias(allQs),
  ...checkLengthBias(allQs),
  ...checkMarkdownLeak(allQs),
];

const errors = findings.filter((f) => f.severity === 'error');
const warns = findings.filter((f) => f.severity === 'warn');

if (wantJson) {
  console.log(JSON.stringify({ total: allQs.length, mcq: allQs.filter((q) => q.type === 'mcq').length, errors: errors.length, warnings: warns.length, findings }, null, 2));
} else {
  console.log(`🔍 VetMock question lint`);
  console.log(`   ${allQs.length} questions across ${FILES.length} files (${allQs.filter((q) => q.type === 'mcq').length} MCQ)\n`);

  if (findings.length === 0) {
    console.log('   ✅ No bias detected. Good shape.');
  } else {
    const groupBy = (k) => findings.filter((f) => f.kind === k);

    const posBias = groupBy('position-bias');
    if (posBias.length) {
      console.log(`   📍 Position bias (${posBias.length}):`);
      posBias.forEach((f) => {
        const tag = f.severity === 'error' ? '🚨' : '⚠️ ';
        const dist = Object.entries(f.distribution).map(([k, v]) => `${k}:${v}`).join(' ');
        console.log(`     ${tag} ${f.topic} (n=${f.n}) — ${f.worstPct}% at index ${f.worstIndex} [${dist}]`);
        console.log(`        IDs: ${f.ids.slice(0, 8).join(', ')}${f.ids.length > 8 ? '...' : ''}`);
      });
      console.log();
    }

    const lenBias = groupBy('length-bias');
    if (lenBias.length) {
      console.log(`   📏 Length bias (${lenBias.length}):`);
      lenBias.slice(0, 20).forEach((f) => {
        const tag = f.severity === 'error' ? '🚨' : '⚠️ ';
        console.log(`     ${tag} Q${f.id} ${f.topic} — correct ${f.correctLen}ch vs distractor mean ${f.meanDistractorLen}ch (${f.ratio}×)`);
      });
      if (lenBias.length > 20) console.log(`        ... and ${lenBias.length - 20} more`);
      console.log();
    }

    const mdBold = groupBy('markdown-bold');
    if (mdBold.length) {
      console.log(`   ✏️  Markdown ** in question text (${mdBold.length}):`);
      const byTopic = {};
      mdBold.forEach((f) => { (byTopic[f.topic] = byTopic[f.topic] || []).push(f.id); });
      Object.entries(byTopic).forEach(([t, ids]) => {
        console.log(`     ⚠️  ${t}: ${ids.length} question(s) — IDs: ${ids.slice(0, 6).join(', ')}${ids.length > 6 ? '...' : ''}`);
      });
      console.log();
    }
  }

  console.log(`Summary: ${errors.length} error(s), ${warns.length} warning(s).`);
}

if (errors.length > 0 && !warnOnly) {
  process.exit(1);
}
