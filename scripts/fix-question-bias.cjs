#!/usr/bin/env node
/**
 * fix-question-bias.cjs
 *
 * Successor to scripts/fix-answer-bias.cjs. The IMHA-only version did
 * 26 questions in COM IV. Lint now shows the same shape across most
 * COM IV dermatology topics, peds-geri, and parts of COM III — total
 * ~70 MCQs all stuck at index 1. Doing those by hand would be silly.
 *
 * What this does:
 *   1. Position bias — for every (subject, topic) group whose answers
 *      pile up at one index (>50%), redistribute the over-represented
 *      Qs across the under-represented indices. Round-robin assignment
 *      keeps a deterministic, idempotent result so re-runs are safe.
 *   2. Markdown ** stripping — replace **bold** with plain text in q,
 *      options, explain, model_answer, rubric, keywords. The ** felt
 *      AI-written to a real student.
 *
 * Constraints honoured:
 *   • 4-option questions never get target index ≥ 4
 *   • idempotent — re-running on a clean file is a no-op
 *   • emits a per-topic summary so you can sanity-check the swap plan
 *     before the file is rewritten (run with --dry-run)
 *
 *     node scripts/fix-question-bias.cjs --dry-run    # preview only
 *     node scripts/fix-question-bias.cjs              # apply
 */

const fs = require('fs');
const path = require('path');

const FILES = [
  'src/data/questions-com3.js',
  'src/data/questions-com4.js',
  'src/data/questions-com5.js',
  'src/data/questions-engprof.js',
];

const POSITION_BIAS_PCT = 0.50;
const MIN_TOPIC_N = 5;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// ── Same string-array splitter used by lint + the older fix script ──
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
    out.push(s.slice(start, i)); // KEEP outer quotes — emit verbatim
  }
  return out;
}

// ── Plan: given an array of {id, answer, optsLen}, redistribute the
//    over-represented index across the rest. Returns a Map<id, newIdx>.
//    Skips the under-represented indices that are already balanced. ──
function planRedistribution(qs) {
  if (qs.length < MIN_TOPIC_N) return new Map();
  const counts = {};
  for (const q of qs) counts[q.answer] = (counts[q.answer] || 0) + 1;
  const indices = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [maxIdxStr, maxCount] = indices[0];
  const maxIdx = Number(maxIdxStr);
  if (maxCount / qs.length <= POSITION_BIAS_PCT) return new Map();

  // Target: each index gets floor(n/k) or ceil(n/k) where k = number of
  // legal indices. Legal index = 0..maxOptsLen-1. We assume mixed 4/5-
  // option Qs share the same topic.
  const movable = qs.filter((q) => q.answer === maxIdx);
  const keepCount = Math.ceil(qs.length / 5); // leave roughly 1/5 at the bias index
  const toMove = movable.slice(keepCount);    // first N stay; the rest move
  const stay = new Set(movable.slice(0, keepCount).map((q) => q.id));

  // Always send each movable Q to the currently-most-deficit valid index.
  // We re-sort on every iteration so that as we fill slot 0, slot 2 takes
  // the next assignment — without this the first deficit slot keeps
  // grabbing every move (the bug that left derm-intro 60% at index 0
  // after the first dry-run).
  const moves = new Map();
  for (const q of toMove) {
    const maxValidIdx = q.optsLen - 1; // 4-opt → max 3, 5-opt → max 4
    let target = -1;
    let bestCount = Infinity;
    for (let i = 0; i <= maxValidIdx; i++) {
      if (i === maxIdx) continue;
      const c = counts[i] || 0;
      if (c < bestCount) { bestCount = c; target = i; }
    }
    if (target < 0) continue; // shouldn't happen
    counts[target] = (counts[target] || 0) + 1;
    counts[maxIdx]--;
    moves.set(q.id, target);
  }

  for (const id of stay) {
    // explicitly mark "stay" — for reporting
    // moves does NOT include them (they keep their current index)
  }
  return moves;
}

// ── Core question-block walker. Returns parsed questions + offsets
//    into the source string so we can rewrite each in place. The block
//    is delimited by "  { id: NNN," at the start and "' },\n" at the
//    end (sometimes "}\n" without comma at the very last item). ──
function walkQuestions(src) {
  const items = [];
  const re = /\n {2}\{ id: (\d+),/g;
  const starts = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    starts.push({ index: m.index, id: Number(m[1]) });
  }
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].index + 1; // skip the leading \n so blockStart points at the leading 2 spaces
    const end = i + 1 < starts.length ? starts[i + 1].index + 1 : src.lastIndexOf('];');
    const blockText = src.slice(start, end);

    const subjectMatch = blockText.match(/subject: '([^']+)'/);
    const topicMatch = blockText.match(/topic: '([^']+)'/);
    const typeMatch = blockText.match(/type: '([^']+)'/);
    const optsMatch = blockText.match(/options: \[([^\n]+)\]/);
    const answerMatch = blockText.match(/answer: (\d+)/);
    if (!typeMatch) continue;

    items.push({
      id: starts[i].id,
      subject: subjectMatch ? subjectMatch[1] : '?',
      topic: topicMatch ? topicMatch[1] : '?',
      type: typeMatch[1],
      answer: answerMatch ? Number(answerMatch[1]) : null,
      options: optsMatch ? splitJsStringArray(optsMatch[1]) : null,
      blockStart: start,
      blockEnd: end,
      blockText,
    });
  }
  return items;
}

// ── Apply position swap inside a single block's source text ──
function rewriteBlockForSwap(blockText, fromIdx, toIdx) {
  const optsRe = /(options: )\[([^\n]+)\]/;
  const m = blockText.match(optsRe);
  if (!m) return blockText;
  const opts = splitJsStringArray(m[2]);
  if (!opts || opts.length < Math.max(fromIdx, toIdx) + 1) return blockText;
  [opts[fromIdx], opts[toIdx]] = [opts[toIdx], opts[fromIdx]];
  const newOpts = `${m[1]}[${opts.join(', ')}]`;

  let next = blockText.replace(optsRe, newOpts);
  next = next.replace(/answer: \d+/, `answer: ${toIdx}`);
  return next;
}

// ── Markdown ** stripper ──────────────────────────────────────────
// Only inside string literals. We replace **xxx** with xxx everywhere
// in the file (string contents only) by walking each JS string with a
// regex that respects escape sequences. Cheap heuristic but accurate
// enough since the codebase doesn't ship Markdown to the user.
function stripBoldMarkers(src) {
  let count = 0;
  // Match content between ** ** that doesn't span newlines or contain *
  const out = src.replace(/\*\*([^*\n]+?)\*\*/g, (whole, inner) => {
    count++;
    return inner;
  });
  return [out, count];
}

// ── Main ──────────────────────────────────────────────────────────
const root = path.resolve(__dirname, '..');
let totalSwaps = 0;
let totalBoldStripped = 0;

for (const rel of FILES) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  let src = fs.readFileSync(abs, 'utf8');
  const before = src;

  // Pass 1: position bias per (subject, topic)
  const items = walkQuestions(src);
  const groups = {};
  for (const q of items) {
    if (q.type !== 'mcq' || !q.options) continue;
    const k = `${q.subject}::${q.topic}`;
    (groups[k] = groups[k] || []).push({ id: q.id, answer: q.answer, optsLen: q.options.length, ref: q });
  }

  const swapPlan = []; // { item, fromIdx, toIdx }
  for (const [key, qs] of Object.entries(groups)) {
    const moves = planRedistribution(qs);
    if (moves.size === 0) continue;
    console.log(`\n  [${rel}] ${key} — moving ${moves.size}/${qs.length} answers`);
    for (const [id, target] of moves.entries()) {
      const item = qs.find((q) => q.id === id).ref;
      console.log(`    Q${id}: ${item.answer} → ${target}`);
      swapPlan.push({ item, fromIdx: item.answer, toIdx: target });
    }
  }

  // Apply swaps from highest-offset to lowest so earlier offsets stay valid
  swapPlan.sort((a, b) => b.item.blockStart - a.item.blockStart);
  for (const { item, fromIdx, toIdx } of swapPlan) {
    const newBlock = rewriteBlockForSwap(item.blockText, fromIdx, toIdx);
    src = src.slice(0, item.blockStart) + newBlock + src.slice(item.blockEnd);
    totalSwaps++;
  }

  // Pass 2: ** markdown
  const [stripped, n] = stripBoldMarkers(src);
  src = stripped;
  totalBoldStripped += n;
  if (n > 0) console.log(`  [${rel}] stripped ${n} ** marker pair(s)`);

  if (src !== before && !dryRun) {
    fs.writeFileSync(abs, src);
  }
}

console.log(`\nDone. ${totalSwaps} answer swap(s), ${totalBoldStripped} bold marker pair(s) removed.`);
if (dryRun) console.log('(dry-run — no files written)');
