// Brings the made-up serosurvey file into the (public) repo [M1-DESIGN.md 8.6].
//
// Source: work/research-studio/workspace/data/serosurvey-2569.csv and numbers.json, written by
// work/research-studio/workspace/build-data.mjs (seed 20260927, outcomes from the front door's herd,
// seed 27953) and checked by check.py (SciPy, 47 of 47). Every row, owner name and number there is
// made up. The one change made here: the phone column held 49 made-up but plausible Thai mobile
// numbers (08x-xxx-xxxx), and a plausible number may belong to somebody. They become
// 000-<farm>-<last four digits>, a shape no operator assigns (00 is the international prefix), still
// 49 distinct values of the same length, so the file keeps its byte count and every statistic.
//
// Run from research/:  node tests/fixtures/serosurvey/regen-phones.mjs [path to work/research-studio/workspace]
// Then:                python tests/fixtures/serosurvey/check.py   (must print ALL MATCH)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = process.argv[2] || 'C:/Users/palmz/Desktop/vet-mock/work/research-studio/workspace';
const bytes = fs.readFileSync(path.join(src, 'data', 'serosurvey-2569.csv'));
const numbers = JSON.parse(fs.readFileSync(path.join(src, 'numbers.json'), 'utf8'));

const text = new TextDecoder('windows-874').decode(bytes);
const lines = text.split('\r\n');
const header = lines[0].split(',');
const iFarm = header.indexOf('ฟาร์ม');
const iPhone = header.indexOf('เบอร์โทร');
if (iFarm !== 0 || iPhone < 0) throw new Error('unexpected header');

const map = new Map();
const out = lines.map((line, n) => {
  if (n === 0 || line === '') return line;
  const cells = line.split(',');
  const old = cells[iPhone];
  const farm = cells[iFarm];
  const next = `000-${farm.slice(1).padStart(3, '0')}-${old.slice(-4)}`;
  if (map.has(old) && map.get(old) !== next) throw new Error(`phone ${old} used by two farms`);
  map.set(old, next);
  if (next.length !== old.length) throw new Error('length changed');
  cells[iPhone] = next;
  return cells.join(',');
}).join('\r\n');
if (new Set(map.values()).size !== 49) throw new Error('expected 49 distinct phone numbers');

// windows-874: ASCII as is, Thai U+0E01..U+0E5B -> 0xA1..0xFB (as build-data.mjs writes it)
const outBytes = Buffer.alloc(out.length);
for (let i = 0; i < out.length; i++) {
  const c = out.charCodeAt(i);
  if (c < 0x80) outBytes[i] = c;
  else if (c >= 0x0e01 && c <= 0x0e5b) outBytes[i] = c - 0x0e01 + 0xa1;
  else throw new Error('not in windows-874');
}
if (outBytes.length !== bytes.length) throw new Error('byte length changed');

const swap = (v) => (typeof v === 'string' && map.has(v) ? map.get(v) : Array.isArray(v) ? v.map(swap) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swap(x)])) : v);
const next = swap(numbers);
next.file.bytes = outBytes.length;
next.file.sha256 = crypto.createHash('sha256').update(outBytes).digest('hex');
const first = out.split('\r\n')[1].split(',')[iPhone];
next.conv.phoneMaskExample = first.slice(0, 2) + 'x-xxx-xx' + first.slice(-2);
next.file.note = 'phone column replaced by tests/fixtures/serosurvey/regen-phones.mjs (000-<farm>-<last four>); everything else as build-data.mjs wrote it';

fs.writeFileSync(path.join(here, 'serosurvey-2569.csv'), outBytes);
fs.writeFileSync(path.join(here, 'numbers.json'), JSON.stringify(next, null, 1) + '\n');
console.log('wrote', outBytes.length, 'bytes sha256', next.file.sha256, 'mask', next.conv.phoneMaskExample);
