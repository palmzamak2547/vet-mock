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
 *   4. An option that names other options by letter ("ข้อ A และ C ถูก")
 *      on a row the render shuffle permutes (error; set noShuffle).
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

// Auto-discover all questions-*.js banks under src/data/ so newly-
// added Q banks (Y4 Sem 1 wave, Y5 banks, future faculties) get linted
// without an editor having to remember updating this list.
// Was: hardcoded 8 files · stale once Wave 3 (surg1, herd-health-rum)
// + Y5 wave shipped. Palm audit 2026-05-20 flagged the scope gap.
const FILES = (() => {
  const dataDir = path.resolve(__dirname, '..', 'src/data');
  return fs.readdirSync(dataDir)
    .filter((f) => /^questions-.+\.js$/.test(f))
    .map((f) => path.posix.join('src/data', f))
    .sort();
})();

// Thresholds. Tunable — these are calibrated from the v5.2.0 disaster
// (94% at B) so even a much milder version of the same problem trips.
const POSITION_BIAS_PCT = 0.50;   // any one position holds > 50% of the answers
const LENGTH_BIAS_RATIO = 1.6;    // correct option > 1.6× the mean distractor
const LENGTH_BIAS_ERROR_RATIO = 3.5; // ≥3.5× = error (egregious, must rewrite)
const MIN_TOPIC_N = 5;            // ignore tiny topic buckets where bias is just sample noise

const root = path.resolve(__dirname, '..');

// Import the same executable modules the app and the other corpus gates read.
// A source-text parser used to recognise only `  { id: ... }` with bare keys
// and single-quoted values. JSON-shaped banks emitted by build-question-bank
// use quoted keys on separate lines, so thousands of shipped questions were
// silently absent from this lint. `readBank` is the shared reader built for
// exactly this mixed-format corpus; an unreadable bank now rejects the run.
async function loadQuestions({ files = FILES, rootDir = root } = {}) {
  const { readBank } = await import('./lib/bank-file.mjs');
  const allQs = [];

  for (const file of files) {
    const abs = path.isAbsolute(file) ? file : path.join(rootDir, file);
    const rel = path.relative(rootDir, abs).split(path.sep).join('/');
    if (!fs.existsSync(abs)) {
      console.error(`! missing ${rel}`);
      continue;
    }

    const src = fs.readFileSync(abs, 'utf8');
    // A bank may declare itself a faithful past-paper transcription. Length
    // bias in a REAL exam belongs to the original examiner — rewriting the
    // options would falsify the paper students are practicing for — so those
    // findings are suppressed (with a count, never silently). The pragma
    // requires a reason after the colon; a bare switch does not count.
    const pragmaAt = src.indexOf('lint:length-bias-exempt:');
    const lengthBiasExempt = pragmaAt >= 0
      && src.slice(pragmaAt + 'lint:length-bias-exempt:'.length).split(String.fromCharCode(10))[0].trim().length > 0;
    const { questions } = await readBank(abs);
    for (const question of questions) {
      allQs.push({ ...question, file: rel, lengthBiasExempt });
    }
  }

  return allQs;
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
      // Palm audit 2026-05-20: position bias is now NEUTRALIZED AT
      // RENDER TIME via the per-question stable Fisher-Yates shuffle
      // in src/components/Question.jsx (MCQOptions). Different users
      // see different option orders for the same Q, so source-level
      // index bias no longer leaks to the UI.
      //
      // We keep the data-level check as a `warn` so authors writing
      // new banks still get a nudge ("hey, you put correct at A every
      // time"), but it no longer fails CI. Severity downgrade is
      // intentional and the right level for a problem the runtime
      // already mitigates.
      findings.push({
        kind: 'position-bias',
        severity: 'warn',
        topic: key,
        n: qs.length,
        worstIndex: Number(maxIdx),
        worstPct: Math.round(pct * 100),
        distribution: counts,
        ids: qs.filter((q) => q.answer === Number(maxIdx)).map((q) => q.id),
        note: 'render-shuffle mitigated',
      });
    }
  }
  return findings;
}

function checkLengthBias(questions) {
  const findings = [];
  let suppressed = 0;
  for (const q of questions) {
    if (q.type !== 'mcq' || !q.options || q.options.length < 3) continue;
    if (q.lengthBiasExempt) {
      // still measure, so the suppressed count is real, then move on
      const c = q.options[q.answer]; const d = q.options.filter((_, i) => i !== q.answer);
      if (typeof c === 'string' && d.length >= 2) {
        const m = d.reduce((s, x) => s + x.length, 0) / d.length;
        if (m > 0 && c.length / m > LENGTH_BIAS_RATIO) suppressed += 1;
      }
      continue;
    }
    const correctLen = q.options[q.answer].length;
    const distractors = q.options.filter((_, i) => i !== q.answer);
    if (distractors.length < 2) continue;
    const mean = distractors.reduce((s, x) => s + x.length, 0) / distractors.length;
    if (mean === 0) continue;
    const ratio = correctLen / mean;
    if (ratio > LENGTH_BIAS_RATIO) {
      // Palm audit 2026-05-20: with the render-time shuffle in place,
      // the "longest option == correct" guess advantage shrinks because
      // students can't combine "correct is position N" + "correct is
      // long" anymore. Only EXTREME asymmetry (≥3.5×, ~70 char vs
      // ~20 char) is still a hard tell — those become error and must
      // be rewritten. Moderate cases (1.6–3.5×) stay warn so they
      // surface in lint output without blocking CI. Triage list for
      // batch rewrite: `node scripts/lint-questions.cjs --triage`.
      findings.push({
        kind: 'length-bias',
        severity: ratio >= LENGTH_BIAS_ERROR_RATIO ? 'error' : 'warn',
        id: q.id,
        topic: `${q.subject}::${q.topic}`,
        correctLen,
        meanDistractorLen: Math.round(mean),
        ratio: Math.round(ratio * 10) / 10,
      });
    }
  }
  checkLengthBias.suppressed = suppressed;
  return findings;
}

// ── Length strategy, per subject ──────────────────────────────────────
// checkLengthBias judges one question against its mean distractor, so a key
// that is simply the longest option, by less than 1.6x, never trips it. A
// subject built that way rewards "always pick the longest": com1 scored 88%
// that way against a chance rate of 20%, and no gate noticed. Each subject is
// now scored for always-longest and always-shortest (ties split evenly, the
// rule year4-longest-option.test.mjs uses) and must not beat chance by more
// than STRATEGY_MARGIN points. Faithful past-paper banks
// (lint:length-bias-exempt) are left out: their lengths are the examiner's.
const STRATEGY_MIN_N = 20;
const STRATEGY_MARGIN = 10; // percentage points above chance
// Measured 2026-09-23: the subjects that still beat chance, with the score
// (%, rounded up) they may not rise above. Lower a number when the subject is
// rewritten; delete the subject once it is within the margin; never raise one
// or add one — a new subject over the margin fails the lint.
const LENGTH_STRATEGY_BUDGET = Object.freeze({
  longest: Object.freeze({
    com1: 89,
    'engprof1': 61,
    'vet-pharm-2': 60,
    com5: 56,
    cliapprum: 52,
    'vet-imaging': 48,
    com3: 47,
    com4: 45,
    poultry: 44,
    practrum: 44,
    'repro-lect': 41,
    'food-industry': 38,
    surg3: 38,
    'vet-juris': 36,
    exotic: 35,
    'poa-clinical': 35,
    vca: 33,
    'ruminant-clinical': 32,
  }),
  shortest: Object.freeze({}),
});

const optionLength = (s) => String(s ?? '').replace(/\*\*|__/g, '').trim().length;

/** Per subject: n, chance, and the % an always-longest / always-shortest student scores. */
function lengthStrategyScores(questions) {
  const by = new Map();
  for (const q of questions) {
    if (q.type !== 'mcq' || !Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.answer)) continue;
    if (q.lengthBiasExempt) continue;
    const s = by.get(q.subject) || { subject: q.subject, n: 0, longest: 0, shortest: 0, chance: 0 };
    const lens = q.options.map(optionLength);
    for (const [key, target] of [['longest', Math.max(...lens)], ['shortest', Math.min(...lens)]]) {
      const tied = lens.map((_, i) => i).filter((i) => lens[i] === target);
      if (tied.includes(q.answer)) s[key] += 1 / tied.length;
    }
    s.chance += 1 / q.options.length;
    s.n += 1;
    by.set(q.subject, s);
  }
  return [...by.values()].map((s) => ({
    subject: s.subject,
    n: s.n,
    longest: (100 * s.longest) / s.n,
    shortest: (100 * s.shortest) / s.n,
    chance: (100 * s.chance) / s.n,
  }));
}

function checkLengthStrategy(questions, budget = LENGTH_STRATEGY_BUDGET) {
  const findings = [];
  const scores = lengthStrategyScores(questions);
  for (const strategy of ['longest', 'shortest']) {
    const allowed = budget[strategy] || {};
    for (const s of scores) {
      const score = Math.ceil(s[strategy]);
      const base = { strategy, subject: s.subject, n: s.n, score, chance: Math.round(s.chance) };
      const over = s.n >= STRATEGY_MIN_N && s[strategy] - s.chance > STRATEGY_MARGIN;
      if (!over) {
        if (Object.hasOwn(allowed, s.subject)) {
          findings.push({ kind: 'length-strategy-budget', severity: 'warn', ...base, note: `within ${STRATEGY_MARGIN} points of chance now; delete it from LENGTH_STRATEGY_BUDGET.${strategy}` });
        }
        continue;
      }
      if (!Object.hasOwn(allowed, s.subject)) {
        findings.push({ kind: 'length-strategy', severity: 'error', ...base, note: 'beats chance by more than the margin and is not in the budget' });
      } else if (score > allowed[s.subject]) {
        findings.push({ kind: 'length-strategy', severity: 'error', ...base, note: `rose above its budget of ${allowed[s.subject]}%` });
      } else if (score < allowed[s.subject]) {
        findings.push({ kind: 'length-strategy-budget', severity: 'warn', ...base, note: `below its budget of ${allowed[s.subject]}%; lower it to ${score}` });
      }
    }
  }
  return findings;
}

// ── Explanations that only restate the key ──────────────────────────
// The predicate is restatesKey in scripts/lib/question-standard.mjs (ESM,
// so main() loads it and passes it in). The count may only fall: lower
// RESTATED_KEY_BUDGET when rows are rewritten into "fact + why".
const RESTATED_KEY_BUDGET = 89;

function checkRestatedKeys(questions, restatesKey, budget = RESTATED_KEY_BUDGET) {
  if (typeof restatesKey !== 'function') return [];
  const hits = questions.filter((q) => restatesKey(q));
  if (hits.length > budget) {
    return [{ kind: 'restated-key', severity: 'error', count: hits.length, budget, ids: hits.map((q) => q.id), note: `explanations that only restate the key rose above the budget of ${budget}` }];
  }
  if (hits.length < budget) {
    return [{ kind: 'restated-key-budget', severity: 'warn', count: hits.length, budget, note: `lower RESTATED_KEY_BUDGET to ${hits.length}` }];
  }
  return [];
}

function checkMiddleDotInOptions(questions) {
  const findings = [];
  const MD = String.fromCharCode(0xB7);
  for (const q of questions) {
    if (!Array.isArray(q.options)) continue;
    for (const o of q.options) {
      if (typeof o === 'string' && o.includes(MD)) {
        findings.push({ kind: 'middle-dot-option', severity: 'error', id: q.id, topic: (q.subject || '?') + '::' + (q.topic || '?'), file: q.file });
        break;
      }
    }
  }
  return findings;
}

// An option that names OTHER options by letter or number ("ข้อ A และ C ถูก",
// "ถูกเฉพาะข้อ 1 และ 2", "ถูกทั้ง A, B, C") only means what it says in the
// order it was written. getShuffledOptions (src/lib/option-shuffle.js)
// permutes every question that does not set noShuffle, so for most students
// the letters point at different options than the author meant. Such a row
// must set noShuffle — unless the stem carries its own numbered list, which
// is then what the letters refer to. A reference that cannot resolve (a label
// past the last option, the option naming itself, "1 และ b") fails always.
//
// Only an explicit reference counts: the word ข้อ before the labels, or a
// ถูก/ผิด verdict over them. Bare "A และ C" is left alone — in this corpus it
// is TLC spots, figure phases, serovars and finger numbers, not options.
const LETTER_LABEL = '(?:[A-Ha-h]|[กขคงจฉ]|[1-9])';
const LETTER_SEP = '(?:\\s*(?:,|และ|and|&|\\+|หรือ|or)\\s*|\\s+)';
const LETTER_END = '(?![A-Za-z0-9\\u0E01-\\u0E59])';
const LETTER_REFERENCE_RES = [
  new RegExp(`ข้อ\\s*(${LETTER_LABEL}(?:${LETTER_SEP}(?:ข้อ\\s*)?${LETTER_LABEL})+)${LETTER_END}`),
  new RegExp(`(?:ถูก|ผิด)(?:ทั้ง|ทุก|เฉพาะ)?\\s*(${LETTER_LABEL}(?:${LETTER_SEP}${LETTER_LABEL})+)${LETTER_END}`),
  /\b(?:both\s+)?([A-E](?:\s*(?:,|and|&)\s*[A-E])+)\s+(?:are|is)\s+(?:correct|true|right)\b/i,
  /\bboth\s+([A-E]\s+and\s+[A-E])\b/i,
];
const THAI_LABELS = 'กขคงจฉ';

function letterIndex(label) {
  if (/^[1-9]$/.test(label)) return Number(label) - 1;
  if (/^[A-Ha-h]$/.test(label)) return label.toUpperCase().charCodeAt(0) - 65;
  return THAI_LABELS.indexOf(label);
}

function letterFamily(label) {
  if (/^[1-9]$/.test(label)) return 'digit';
  if (/^[A-Ha-h]$/.test(label)) return 'latin';
  return 'thai';
}

function stemEnumerates(stem, family) {
  const pattern = {
    digit: /(?:^|[\s(:])\(?([1-9])[.)](?!\d)/g,
    latin: /(?:^|[\s(:,])\(?([A-Ha-h])(?:[.)]|\s*=)/g,
    thai: /(?:^|[\s(:])\(?([กขคงจฉ])[.)]/g,
  }[family];
  const seen = new Set();
  for (const m of String(stem || '').matchAll(pattern)) seen.add(m[1].toUpperCase());
  return seen.size >= 2;
}

function optionLetterReference(option) {
  for (const re of LETTER_REFERENCE_RES) {
    const m = re.exec(String(option));
    // the separators include "and"/"or", so pick out only free-standing labels
    if (m) return m[1].match(/(?<![A-Za-z0-9])[A-Za-z0-9](?![A-Za-z0-9])|[กขคงจฉ](?![ก-๙])/g) || [];
  }
  return null;
}

function checkOptionLetterReferences(questions) {
  const findings = [];
  for (const q of questions) {
    if (!Array.isArray(q.options) || q.options.length < 2) continue;
    for (let i = 0; i < q.options.length; i++) {
      const labels = optionLetterReference(q.options[i]);
      if (!labels || labels.length < 2) continue;
      const families = new Set(labels.map(letterFamily));
      const listed = families.size === 1 && stemEnumerates(q.q, [...families][0]);
      const base = { id: q.id, topic: `${q.subject || '?'}::${q.topic || '?'}`, file: q.file, option: String(q.options[i]) };
      if (listed) continue;
      const indices = labels.map(letterIndex);
      const unresolvable = families.size > 1
        || indices.some((k) => k < 0 || k >= q.options.length || k === i);
      if (unresolvable) {
        findings.push({ kind: 'option-letter-reference-broken', severity: 'error', ...base });
      } else if (q.noShuffle !== true) {
        findings.push({ kind: 'option-letter-reference', severity: 'error', ...base });
      }
    }
  }
  return findings;
}

function checkMarkdownLeak(questions) {
  // Palm audit 2026-05-20: `**emphasis**` in question text is rendered
  // CORRECTLY by RichText (`src/lib/richtext.jsx`) — `**ไม่**` shows up
  // as bold "ไม่" so students don't miss the negation. The TTS path
  // (`stripForSpeech`) and plain-text path (`stripRichText`) already
  // strip the markers. So `**...**` is a feature, not a leak.
  //
  // We keep the function as a structural placeholder (in case a future
  // bad sink shows up) but return [] so it no longer flags valid
  // emphasis as a warning. To detect truly broken markdown (mismatched
  // markers, code-block leaks), add specific checks here.
  return [];
}

function lintQuestions(allQs, {
  strategyBudget = LENGTH_STRATEGY_BUDGET,
  restatesKey = null,
  restatedKeyBudget = RESTATED_KEY_BUDGET,
} = {}) {
  const findings = [
    ...checkPositionBias(allQs),
    ...checkLengthBias(allQs),
    ...checkLengthStrategy(allQs, strategyBudget),
    ...checkRestatedKeys(allQs, restatesKey, restatedKeyBudget),
    ...checkMarkdownLeak(allQs),
    ...checkMiddleDotInOptions(allQs),
    ...checkOptionLetterReferences(allQs),
  ];
  return {
    findings,
    errors: findings.filter((f) => f.severity === 'error'),
    warns: findings.filter((f) => f.severity === 'warn'),
    suppressed: checkLengthBias.suppressed || 0,
  };
}

function printResults(allQs, result, args = []) {
  const wantJson = args.includes('--json');
  const wantTriage = args.includes('--triage');
  const { findings, errors, warns, suppressed } = result;

  if (wantTriage) {
    // CSV of length-bias findings sorted worst→best for batch content review.
    // Columns: ratio, file, id, topic, correctLen, distractorMean, severity
    const lenBias = findings.filter((f) => f.kind === 'length-bias');
    lenBias.sort((a, b) => b.ratio - a.ratio);
    // Map id → file so reviewers can jump straight to the file.
    const idToFile = {};
    for (const q of allQs) { idToFile[q.id] = q.file; }
    console.log('ratio,file,id,topic,correctLen,distractorMean,severity');
    for (const f of lenBias) {
      console.log([
        f.ratio,
        idToFile[f.id] || '?',
        f.id,
        f.topic,
        f.correctLen,
        f.meanDistractorLen,
        f.severity,
      ].join(','));
    }
  } else if (wantJson) {
    console.log(JSON.stringify({ total: allQs.length, mcq: allQs.filter((q) => q.type === 'mcq').length, errors: errors.length, warnings: warns.length, findings }, null, 2));
  } else {
    console.log('🔍 VetMock question lint');
    console.log(`   ${allQs.length} questions across ${FILES.length} files (${allQs.filter((q) => q.type === 'mcq').length} MCQ)\n`);

    // Always print where "pick the longest / shortest" pays, worst first.
    const scores = lengthStrategyScores(allQs).filter((s) => s.n >= STRATEGY_MIN_N);
    const worst = scores
      .map((s) => ({ ...s, lift: Math.max(s.longest, s.shortest) - s.chance }))
      .sort((a, b) => b.lift - a.lift)
      .slice(0, 12);
    console.log(`   🎯 Length strategy per subject (always-longest / always-shortest vs chance, n ≥ ${STRATEGY_MIN_N}, margin ${STRATEGY_MARGIN} pts):`);
    for (const s of worst) {
      const flag = s.longest - s.chance > STRATEGY_MARGIN || s.shortest - s.chance > STRATEGY_MARGIN ? '⚠️ ' : '  ';
      console.log(`     ${flag} ${s.subject.padEnd(22)} longest ${s.longest.toFixed(0).padStart(3)}%  shortest ${s.shortest.toFixed(0).padStart(3)}%  chance ${s.chance.toFixed(0).padStart(3)}%  (n=${s.n})`);
    }
    console.log();
    const strat = findings.filter((f) => f.kind === 'length-strategy' || f.kind === 'length-strategy-budget');
    for (const f of strat) {
      console.log(`     ${f.severity === 'error' ? '🚨' : 'ℹ️ '} ${f.subject} ${f.strategy} ${f.score}% (chance ${f.chance}%) — ${f.note}`);
    }
    if (strat.length) console.log();
    for (const f of findings.filter((x) => x.kind === 'restated-key' || x.kind === 'restated-key-budget')) {
      console.log(`   ${f.severity === 'error' ? '🚨' : 'ℹ️ '} Explanations that only restate the key: ${f.count} (budget ${f.budget}) — ${f.note}`);
      console.log();
    }

    if (findings.length === 0) {
      console.log('   ✅ No bias detected. Good shape.');
    } else {
      const groupBy = (k) => findings.filter((f) => f.kind === k);

      const posBias = groupBy('position-bias');
      if (posBias.length) {
        console.log(`   📍 Position bias (${posBias.length}) — render-shuffle mitigated, data-level nudge only:`);
        posBias.forEach((f) => {
          const tag = f.severity === 'error' ? '🚨' : '⚠️ ';
          const dist = Object.entries(f.distribution).map(([k, v]) => `${k}:${v}`).join(' ');
          console.log(`     ${tag} ${f.topic} (n=${f.n}) — ${f.worstPct}% at index ${f.worstIndex} [${dist}]`);
          console.log(`        IDs: ${f.ids.slice(0, 8).join(', ')}${f.ids.length > 8 ? '...' : ''}`);
        });
        console.log('     ℹ️  MCQOptions in Question.jsx randomizes option order per Q per session, so source bias does not surface in UI.');
        console.log();
      }

      if (suppressed > 0) {
        console.log(`   📜 ${suppressed} length-bias reading(s) suppressed in banks declared as faithful past-paper transcriptions (lint:length-bias-exempt pragma)
`);
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

      const mdOpt = groupBy('middle-dot-option');
      if (mdOpt.length) {
        console.log(`   🚫 Middle dot (U+00B7) inside options[] (${mdOpt.length}) — ERROR, the classic answer tell:`);
        mdOpt.forEach((f) => console.log(`     🚨 Q${f.id} ${f.topic}`));
        console.log();
      }
      const letterRefs = [...groupBy('option-letter-reference'), ...groupBy('option-letter-reference-broken')];
      if (letterRefs.length) {
        console.log(`   🔤 Options that name other options by letter (${letterRefs.length}) — ERROR, the render shuffle moves what they name:`);
        letterRefs.forEach((f) => console.log(`     🚨 Q${f.id} ${f.topic} ${f.file || ''} — "${f.option}"${f.kind.endsWith('-broken') ? ' (cannot resolve)' : ' (set noShuffle: true, or name the content)'}`));
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
}

/** lintQuestions with every check the CLI runs, including the ESM-only
 *  restated-key predicate. main() uses exactly this. */
async function lintBank(allQs, options = {}) {
  const { restatesKey } = await import('./lib/question-standard.mjs');
  return lintQuestions(allQs, { restatesKey, ...options });
}

async function main(args = process.argv.slice(2)) {
  const allQs = await loadQuestions();
  const result = await lintBank(allQs);
  printResults(allQs, result, args);
  return result.errors.length > 0 && !args.includes('--warn-only') ? 1 : 0;
}

if (require.main === module) {
  main().then((code) => { process.exitCode = code; }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  loadQuestions,
  lintQuestions,
  lintBank,
  lengthStrategyScores,
  LENGTH_STRATEGY_BUDGET,
  STRATEGY_MARGIN,
  STRATEGY_MIN_N,
  RESTATED_KEY_BUDGET,
  main,
};
