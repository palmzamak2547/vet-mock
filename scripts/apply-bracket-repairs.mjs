// Apply a batch of hand-written bracket repairs to one shipped summary file.
//
// Each repair is an exact {from, to} pair. `from` must occur exactly once in the
// file, or nothing is written — an edit that matches twice is an edit that
// lands somewhere nobody looked at, and these files are 10,000 lines long.
//
//   node scripts/apply-bracket-repairs.mjs <subject> <patch.json>
//
// patch.json: [{ "from": "...", "to": "..." }, ...]

import { readFileSync, writeFileSync } from 'node:fs';

const [subject, patchPath] = process.argv.slice(2);
if (!subject || !patchPath) {
  console.error('usage: node scripts/apply-bracket-repairs.mjs <subject> <patch.json>');
  process.exit(2);
}

const file = `src/data/video-summaries-${subject}.js`;
let src = readFileSync(file, 'utf8');
const patches = JSON.parse(readFileSync(patchPath, 'utf8'));

const problems = [];
for (const [i, p] of patches.entries()) {
  const n = src.split(p.from).length - 1;
  if (n !== 1) problems.push(`#${i + 1} matches ${n} times: ${p.from.slice(0, 70)}`);
  if (/\[[^\]]*[฀-๿][^\]]*\]/.test(p.to) && !/^\[\d/.test(p.to)) {
    // The replacement must not reintroduce what we are removing.
    const reintroduced = [...p.to.matchAll(/\[[^\[\]\n]{1,80}\]/g)]
      .map((m) => m[0])
      .filter((s) => /[฀-๿]/.test(s) && !/^\[\d+:\d{2}/.test(s));
    if (reintroduced.length) problems.push(`#${i + 1} replacement still carries a Thai bracket: ${reintroduced.join(' ')}`);
  }
}
if (problems.length) {
  for (const p of problems) console.error(`✖ ${p}`);
  process.exit(1);
}

for (const p of patches) src = src.replace(p.from, p.to);
writeFileSync(file, src);
console.log(`applied ${patches.length} repairs to ${file}`);
