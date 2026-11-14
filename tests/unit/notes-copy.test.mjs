// ============================================================
// Notes and wrap-ups: what a student reads in them
// ============================================================
// Two rules for src/data/notes-*.js and src/data/wrapups/*.js:
//   1. List items separate with a comma (a semicolon when an item already
//      holds a comma), never a middle dot. A section's stored `source` keeps
//      its dot and is printed through readableSource, like every stored origin.
//   2. A lecturer is named without an email address or a phone number.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const DATA = new URL('../../src/data/', import.meta.url);
const files = [
  ...fs.readdirSync(DATA).filter((f) => /^notes-.*\.js$/.test(f)),
  ...fs.readdirSync(new URL('wrapups/', DATA)).filter((f) => f.endsWith('.js')).map((f) => `wrapups/${f}`),
];
const lines = (f) => fs.readFileSync(new URL(f, DATA), 'utf8').split('\n');
const isSource = (line) => /^\s*["']?source["']?\s*:/.test(line);

test('the scan reads the notes and the wrap-ups', () => {
  assert.ok(files.filter((f) => f.startsWith('notes-')).length >= 30, 'notes files found');
  assert.ok(files.some((f) => f.startsWith('wrapups/')), 'wrap-up files found');
});

test('list items in notes and wrap-ups are not separated by a middle dot', () => {
  // A dot inside a unit (N·m) has no spaces around it and is left alone.
  const hits = files.flatMap((f) => lines(f).flatMap((line, i) => (!isSource(line) && /\s·\s/.test(line) ? [`${f}:${i + 1}`] : [])));
  assert.deepEqual(hits, [], 'use a comma, or a semicolon when an item already holds a comma');
});

test('the notes screen prints a stored source in its readable form', () => {
  const view = fs.readFileSync(new URL('../../src/views/NotesView.jsx', import.meta.url), 'utf8');
  // The same rule as readableSource, written in place: importing
  // source-line.js would pull the stored origins into the notes chunk.
  assert.doesNotMatch(view, /แหล่งที่มา: \{section\.source\}/);
  const written = /แหล่งที่มา: \{section\.source\.replace\(\/(.+?)\/g, ', '\)\}/.exec(view);
  assert.ok(written, 'the source line replaces the stored dot');
  const stored = 'Neonatal Physiology p.7 · ductus arteriosus p.8';
  assert.equal(stored.replace(new RegExp(written[1], 'g'), ', '), 'Neonatal Physiology p.7, ductus arteriosus p.8');
});

test('notes and wrap-ups carry no email address or phone number', () => {
  const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[A-Za-z]{2,}/;
  const PHONE = /(?:Tel\.?|โทร\.?)\s*:?\s*\+?\d|\b0\d{0,2}-\d{3,4}-\d{4}\b/;
  const hits = files.flatMap((f) => lines(f).flatMap((line, i) => (EMAIL.test(line) || PHONE.test(line) ? [`${f}:${i + 1}`] : [])));
  assert.deepEqual(hits, [], 'name the lecturer and leave contact details out');
});
