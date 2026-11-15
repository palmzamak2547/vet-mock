// The build drops question and wrap-up fields no screen reads (scripts/strip-unread-fields.mjs).
// Two guards: no code the browser or the functions run reads a dropped field, and the served
// module equals its source with exactly those fields removed and nothing else.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { UNREAD_FIELDS, stripUnreadFields } from '../../scripts/strip-unread-fields.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const DATA = path.join(root, 'src/data');
const WRAPUPS = path.join(DATA, 'wrapups');
const isData = (p) => (path.dirname(p) === DATA && /^questions-.*\.js$/.test(path.basename(p))) || path.dirname(p) === WRAPUPS;

function codeFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'generated') continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) codeFiles(p, out);
    else if (/\.(m?js|jsx|ts|tsx)$/.test(name) && !isData(p)) out.push(p);
  }
  return out;
}
const withoutComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
const READERS = ['src', 'api', 'vca/src', 'ai/src'].flatMap((d) => codeFiles(path.join(root, d)));

test('no code under src, api, vca/src or ai/src reads a question field the build drops', () => {
  for (const field of UNREAD_FIELDS.question) {
    const re = new RegExp(`(?<![\\w$])${field.replace(/\$/g, '\\$')}(?![\\w$])`);
    const readers = READERS.filter((p) => re.test(withoutComments(readFileSync(p, 'utf8'))));
    assert.deepEqual(readers.map((p) => path.relative(root, p)), [],
      `${field} is read: take it off UNREAD_FIELDS.question in scripts/strip-unread-fields.mjs`);
  }
});

test('no module that loads a wrap-up reads the bullet field the build drops', () => {
  // A wrap-up reaches a screen only through data/exam-wrapups.js, so its readers are the
  // modules importing that index (and the index itself).
  const loaders = READERS.filter((p) => /exam-wrapups(\.js)?['"]/.test(readFileSync(p, 'utf8')) || p.endsWith('exam-wrapups.js'));
  assert.ok(loaders.some((p) => p.endsWith('WrapUpView.jsx')), 'the wrap-up page imports exam-wrapups.js');
  for (const field of UNREAD_FIELDS.wrapupItem) {
    const re = new RegExp(`(?<![\\w$])${field}(?![\\w$])`);
    const readers = loaders.filter((p) => re.test(withoutComments(readFileSync(p, 'utf8'))));
    assert.deepEqual(readers.map((p) => path.relative(root, p)), [],
      `${field} may be read from a wrap-up: take it off UNREAD_FIELDS.wrapupItem or prove the reader is not a bullet`);
  }
  // Nor reached by index from a generic walk over every field.
  assert.ok(!readFileSync(path.join(root, 'src/views/WrapUpView.jsx'), 'utf8').includes('Object.entries(it'));
});

test('the verified source chip fields are never dropped', () => {
  for (const kept of ['verificationSources', 'sourceDocument', 'source', 'verified', 'examOrigin', 'sourceType']) {
    assert.ok(!UNREAD_FIELDS.question.includes(kept), kept);
  }
});

// What the served module must equal: the source's exports with the fields deleted where the
// plugin deletes them (any depth on a question; on an object inside an `items` array in a wrap-up).
function expected(value, kind, parentKey = null) {
  if (Array.isArray(value)) return value.map((v) => expected(v, kind, parentKey));
  if (!value || typeof value !== 'object') return value;
  const drop = kind === 'question' ? UNREAD_FIELDS.question : parentKey === 'items' ? UNREAD_FIELDS.wrapupItem : [];
  return Object.fromEntries(Object.entries(value).filter(([k]) => !drop.includes(k)).map(([k, v]) => [k, expected(v, kind, k)]));
}

async function importCode(code, file) {
  // Relative imports of the data module resolve against its own folder.
  const abs = code.replace(/(from\s*['"])(\.{1,2}\/[^'"]+)(['"])/g, (_, a, spec, b) => a + pathToFileURL(path.resolve(path.dirname(file), spec)).href + b);
  return import(`data:text/javascript;base64,${Buffer.from(abs).toString('base64')}`);
}

const dataFiles = [
  ...readdirSync(DATA).filter((f) => /^questions-.*\.js$/.test(f)).map((f) => [path.join(DATA, f), 'question']),
  ...readdirSync(WRAPUPS).filter((f) => f.endsWith('.js')).map((f) => [path.join(WRAPUPS, f), 'wrapup']),
];

test('each served bank and wrap-up equals its source minus exactly the dropped fields', async () => {
  let changed = 0;
  let dropped = 0;
  for (const [file, kind] of dataFiles) {
    const code = readFileSync(file, 'utf8');
    const out = stripUnreadFields(code, file);
    if (out === null) {
      const fields = kind === 'question' ? UNREAD_FIELDS.question : UNREAD_FIELDS.wrapupItem;
      const src = await import(pathToFileURL(file).href);
      assert.deepEqual(expected({ ...src }, kind), { ...src },`${path.basename(file)} has a dropped field the plugin missed (${fields})`);
      continue;
    }
    changed++;
    dropped += code.length - out.length;
    const [src, served] = await Promise.all([import(pathToFileURL(file).href), importCode(out, file)]);
    assert.deepEqual({ ...served }, expected({ ...src }, kind), path.basename(file));
  }
  assert.ok(changed >= 40, `expected the dropped fields in most Y5 banks and the wrap-ups, saw ${changed} files`);
  assert.ok(dropped > 500_000, `expected over 500 KB dropped from the sources, saw ${dropped}`);
});

test('a file outside the banks and wrap-ups passes through untouched', () => {
  assert.equal(stripUnreadFields('export const A = [{ sourcePages: [1] }];', path.join(DATA, 'source-docs.js')), null);
  assert.equal(stripUnreadFields('export const A = [{ sources: [1] }];', path.join(DATA, 'questions-x.js')), null);
  assert.equal(stripUnreadFields('export const W = { sources: ["a"], groups: [] };', path.join(WRAPUPS, 'x.js')), null);
  assert.equal(stripUnreadFields('export const A = [{ a: 1, sourcePages: [2], _pdfRef: "p" }];', path.join(DATA, 'questions-x.js')), 'export const A = [{ a: 1 }];');
});
