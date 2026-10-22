// The manifest's entries with their own gzip size after the first load (lab only).
import fs from 'node:fs';
import path from 'node:path';
import { entryFiles, routeSizes } from '../scripts/lib/perf-logic.mjs';
const m = JSON.parse(fs.readFileSync('dist/.vite/manifest.json', 'utf8'));
const read = (f) => fs.readFileSync(path.join('dist', f));
const first = entryFiles(m, 'index.html');
const rows = [];
for (const [k, e] of Object.entries(m)) {
  if (!(e.isDynamicEntry || e.isEntry)) continue;
  if (/data-q-|data-notes|data-video/.test(e.name || '')) continue;
  try { const r = routeSizes(m, k, read, { except: first }); rows.push({ k, name: e.name, js: r.js, css: r.css }); } catch (err) { rows.push({ k, name: e.name, err: err.message }); }
}
rows.sort((a, b) => (b.js || 0) - (a.js || 0));
for (const r of rows.slice(0, 60)) console.log(String(r.js ?? '-').padStart(8), String(r.css ?? '-').padStart(7), String(r.name || '').padEnd(34), r.k);
const idx = Object.entries(m).filter(([, e]) => /vetwiki/.test(e.src || '') ).map(([k, e]) => `${e.name} ${k}`);
console.log('vetwiki keys:', idx.length); console.log(idx.slice(0, 40).join('\n'));
