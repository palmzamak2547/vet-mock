// Quick custom length-bias scan for Q5XXX (Clin App Rum mahahon)
// using the project's actual question loader so we get parsed options.

const path = require('path');
const fs = require('fs');

// Read raw text and extract Q5XXX option arrays + answer
const src = fs.readFileSync(path.join(__dirname, '..', 'src/data/questions-cliapprum.js'), 'utf-8');

// Match `{ id: 5XXX, ... options: [ ... ], answer: N, ... }` non-greedy
const blockRe = /\{\s*id:\s*(5\d{3}),[\s\S]*?options:\s*\[([\s\S]*?)\],\s*answer:\s*(\d)/g;

const findings = [];
let m;
while ((m = blockRe.exec(src)) !== null) {
  const qid = parseInt(m[1], 10);
  const optsRaw = m[2];
  const ans = parseInt(m[3], 10);

  // Pull each quoted option string. Options use single-quoted strings that may
  // contain escaped quotes \' — we cap at the closing quote not preceded by \.
  const opts = [];
  // Walk char by char to handle escapes safely.
  let i = 0;
  while (i < optsRaw.length) {
    if (optsRaw[i] === "'") {
      let j = i + 1;
      let buf = '';
      while (j < optsRaw.length) {
        if (optsRaw[j] === '\\' && j + 1 < optsRaw.length) {
          buf += optsRaw[j + 1];
          j += 2;
          continue;
        }
        if (optsRaw[j] === "'") break;
        buf += optsRaw[j];
        j++;
      }
      opts.push(buf);
      i = j + 1;
    } else {
      i++;
    }
  }

  if (opts.length < 2 || isNaN(ans) || !opts[ans]) continue;
  const correct = opts[ans];
  const distractors = opts.filter((_, k) => k !== ans);
  const cl = correct.length;
  const dlAvg = distractors.reduce((s, d) => s + d.length, 0) / distractors.length;
  const ratio = dlAvg > 0 ? cl / dlAvg : 0;

  // Also compute "is correct the longest by N chars" — even when ratio is OK.
  const longest = Math.max(...opts.map((o) => o.length));
  const isLongest = correct.length === longest && longest - Math.min(...opts.map((o) => o.length)) >= 8;

  if (ratio >= 1.3 || isLongest) {
    findings.push({ qid, cl, dlAvg, ratio, isLongest, options: opts.map((o) => o.length) });
  }
}

findings.sort((a, b) => b.ratio - a.ratio);
console.log(`Found ${findings.length} length-suspicious Q5XXX:`);
for (const f of findings) {
  const tag = f.ratio >= 1.5 ? '🚨' : f.ratio >= 1.3 ? '⚠️ ' : '📍';
  console.log(
    `  ${tag} Q${f.qid}: correct ${f.cl}ch vs distractor mean ${f.dlAvg.toFixed(0)}ch ` +
      `(${f.ratio.toFixed(2)}x)` +
      (f.isLongest ? ' [LONGEST]' : '') +
      `  options=[${f.options.join(', ')}]`,
  );
}
