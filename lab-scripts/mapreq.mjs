// Map the JS/CSS requests in an explore log to manifest chunk names (lab only). node scratch/mapreq.mjs <explore.log>
import fs from 'node:fs';
import { entryFiles } from '../scripts/lib/perf-logic.mjs';
const m = JSON.parse(fs.readFileSync('dist/.vite/manifest.json', 'utf8'));
const byFile = new Map(Object.entries(m).map(([k, e]) => [e.file, { k, name: e.name, dyn: e.isDynamicEntry }]));
const first = entryFiles(m, 'index.html');
const inFirst = new Set([...first.js, ...first.css]);
let page = ''; const seen = {};
for (const line of fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/)) {
  const h = /^=== (\w+) (\S+)/.exec(line); if (h) { page = `${h[1]} ${h[2]}`; seen[page] = []; continue; }
  const r = /^\s+(script|stylesheet|fetch|xhr|other)\s+(\S+)\s+\/(assets\/\S+)/.exec(line); if (r && page) seen[page].push({ type: r[1], bytes: r[2], file: r[3] });
}
for (const [p, list] of Object.entries(seen)) {
  console.log(`\n## ${p}`);
  for (const r of list) { const i = byFile.get(r.file); console.log(`${r.type.padEnd(10)} ${String(r.bytes).padStart(8)}  ${inFirst.has(r.file) ? 'FIRST ' : '      '} ${i ? `${i.name}${i.dyn ? ' (dyn)' : ''}  [${i.k}]` : r.file}`); }
}
