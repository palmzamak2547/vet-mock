// Scan question banks for options with suspicious patterns:
//   1. Parenthetical answer cues (likely from PDF extraction with answer keys in parens)
//   2. Possibly-truncated options (too short or ending weirdly)
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'data');
const FILES = ['questions-com3.js','questions-com4.js','questions-com5.js','questions-engprof.js','questions-exotic.js','questions-part1.js','questions-part2.js','questions-part3.js'];

const issuesParens = [];
const issuesTruncated = [];

for (const f of FILES) {
  const fp = path.join(DIR, f);
  if (!fs.existsSync(fp)) continue;
  const lines = fs.readFileSync(fp, 'utf8').split('\n');
  let curId = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const idMatch = line.match(/id:\s*(\d+)/);
    if (idMatch) curId = idMatch[1];
    const optMatch = line.match(/^\s*options:\s*\[(.*)\]/);
    if (!optMatch) continue;
    // Parse options inside [...] — handles single-quoted strings with possible \' escapes
    const optsStr = optMatch[1];
    const opts = [];
    const re = /'((?:[^'\\]|\\.)*)'/g;
    let m;
    while ((m = re.exec(optsStr)) !== null) opts.push(m[1]);
    opts.forEach((opt, idx) => {
      // Parenthetical answer cue
      const parens = opt.match(/\([^)]+\)/g) || [];
      for (const par of parens) {
        const inner = par.slice(1, -1);
        const words = inner.split(/\s+/).filter(Boolean);
        // Flag if 3+ words and looks like an explanation (contains Thai or English text)
        if (words.length >= 3 && /[ก-๙A-Za-z]/.test(inner)) {
          issuesParens.push({ file: f, line: i+1, id: curId, optIdx: idx, opt, paren: par });
        }
      }
      // Suspicious truncation: very short OR ends with em-dash / ellipsis / dash (often cut off)
      if (opt.length > 0 && opt.length < 4) {
        issuesTruncated.push({ file: f, line: i+1, id: curId, optIdx: idx, opt, reason: 'too-short' });
      }
      if (/[—–-]$|\.{3}$/.test(opt)) {
        issuesTruncated.push({ file: f, line: i+1, id: curId, optIdx: idx, opt, reason: 'ends-with-dash-or-ellipsis' });
      }
    });
  }
}

console.log('=== Parenthetical answer-cue (' + issuesParens.length + ') ===');
issuesParens.forEach((x, i) => {
  if (i < 50) console.log(`${x.file}:${x.line} Q${x.id} opt[${x.optIdx}] | "${x.opt.slice(0, 80)}" → ${x.paren}`);
});
if (issuesParens.length > 50) console.log(`... and ${issuesParens.length - 50} more`);

console.log('\n=== Possibly truncated (' + issuesTruncated.length + ') ===');
issuesTruncated.forEach((x, i) => {
  if (i < 30) console.log(`${x.file}:${x.line} Q${x.id} opt[${x.optIdx}] | "${x.opt}" (${x.reason})`);
});
if (issuesTruncated.length > 30) console.log(`... and ${issuesTruncated.length - 30} more`);
