#!/usr/bin/env node
/**
 * trim-length-bias.cjs
 *
 * One-shot helper: reads `--triage` CSV from lint-questions, locates
 * the correct option of each top-N Q, prints a summary so the author
 * (or a follow-up `--apply` pass) can decide how to shorten.
 *
 *   node scripts/trim-length-bias.cjs --top 30          # report
 *
 * No mutation by default — content review is required. This is a
 * data-gathering tool, not an auto-fixer.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const topN = (() => {
  const idx = args.indexOf('--top');
  return idx >= 0 ? parseInt(args[idx + 1], 10) : 30;
})();

// Get triage CSV from lint
const csv = execSync('node scripts/lint-questions.cjs --triage', {
  cwd: path.resolve(__dirname, '..'),
  encoding: 'utf8',
}).trim().split('\n').slice(1, topN + 1);

const targets = csv.map((line) => {
  const cols = line.split(',');
  return { ratio: parseFloat(cols[0]), file: cols[1], id: parseInt(cols[2], 10) };
});

const byFile = {};
for (const t of targets) {
  (byFile[t.file] = byFile[t.file] || []).push(t);
}

const root = path.resolve(__dirname, '..');

for (const [file, qs] of Object.entries(byFile)) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    console.log('!! missing file:', file);
    continue;
  }
  const src = fs.readFileSync(abs, 'utf8');
  for (const q of qs) {
    const re = new RegExp('\\{\\s*id:\\s*' + q.id + '\\b[\\s\\S]*?(?=\\n  \\{ id:|\\];)', 'm');
    const m = src.match(re);
    if (!m) {
      console.log('!!', q.id, 'block not found');
      continue;
    }
    const block = m[0];
    const answerMatch = block.match(/answer:\s*(\d+)/);
    if (!answerMatch) {
      console.log('!!', q.id, 'no answer');
      continue;
    }
    const answer = parseInt(answerMatch[1], 10);
    const optsMatch = block.match(/options:\s*\[([\s\S]*?)\](?=,\s*\n)/);
    if (!optsMatch) {
      console.log('!!', q.id, 'no options');
      continue;
    }
    // Parse single-quote string array, respecting escapes
    const opts = [];
    let buf = '';
    let inStr = false;
    const raw = optsMatch[1];
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === '\\') {
        if (inStr) buf += ch + raw[i + 1];
        i++;
        continue;
      }
      if (ch === "'") {
        if (inStr) {
          opts.push(buf);
          buf = '';
        }
        inStr = !inStr;
        continue;
      }
      if (inStr) buf += ch;
    }
    const correct = opts[answer];
    if (!correct) {
      console.log('!!', q.id, 'correct missing');
      continue;
    }
    console.log('─'.repeat(78));
    console.log(`Q${q.id}  ${file.replace('src/data/', '')}  ratio=${q.ratio}×`);
    console.log(`  correct[${answer}] (${correct.length}ch):`);
    console.log(`    ${correct}`);
    console.log(`  distractors:`);
    opts.forEach((o, i) => {
      if (i === answer) return;
      console.log(`    [${i}] (${o.length}ch): ${o}`);
    });
  }
}
