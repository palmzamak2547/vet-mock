// ============================================================
// wiki-search-retry.test.mjs — "ค้นอีกครั้ง" can actually recover
// ============================================================
// When the full-text pass of the VetWiki index fails to load, the banner
// says the results cover titles only and offers ค้นอีกครั้ง. The button only
// bumped a nonce, which re-ran the search effect, which re-imported the same
// runtime-search chunk. Native ESM remembers a failed dynamic import for the
// life of the document (a fresh GET of the chunk returned 200 while import()
// of the same URL kept rejecting), so once the connection came back every
// press showed the same incomplete results, forever.
//
// NotesView.retryLoad already knows the answer: once online, reload; while
// offline, retry in place so a click never lands on the browser's offline
// page. The banner now does the same. The reload happens only on the
// student's click (the explicit-retry rule in UPDATE-AND-FLOW-CONTRACT.md),
// the index URL is /wiki, and the query survives through sessionStorage.
//
// The view renders JSX, so the button's handler is lifted out of the source
// and run against a stubbed navigator/location and a nonce spy.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/KnowledgeView.jsx'), 'utf8').replace(/\r\n/g, '\n');

/** The source from `open` to its matching close bracket (the handlers hold no bracketed strings). */
function balanced(from, open = '{', close = '}') {
  const start = SRC.indexOf(open, from);
  let depth = 0;
  for (let i = start; i < SRC.length; i += 1) {
    if (SRC[i] === open) depth += 1;
    else if (SRC[i] === close && --depth === 0) return SRC.slice(start, i + 1);
  }
  throw new Error('unbalanced source');
}

/** The onClick of the banner's ค้นอีกครั้ง button, resolved to a function expression. */
function retryHandlerSource() {
  const label = SRC.indexOf('ค้นอีกครั้ง\n');
  assert.notEqual(label, -1, 'the incomplete-search banner must still offer ค้นอีกครั้ง');
  const tag = SRC.lastIndexOf('<button', label);
  const onClick = SRC.indexOf('onClick=', tag);
  assert.ok(tag !== -1 && onClick !== -1 && onClick < label, 'the ค้นอีกครั้ง button must have an onClick');
  const expr = balanced(onClick).slice(1, -1).trim();
  if (!/^\w+$/.test(expr)) return expr;
  // A named handler: lift its declaration.
  const decl = SRC.indexOf(`const ${expr} = `);
  assert.notEqual(decl, -1, `could not find the declaration of ${expr}`);
  const arrow = SRC.indexOf('=>', decl);
  return SRC.slice(decl + `const ${expr} = `.length, arrow + 2) + ' ' + balanced(arrow);
}

function press(onLine) {
  const calls = { reload: 0, nonce: [] };
  const location = { reload: () => { calls.reload += 1; } };
  const handler = vm.runInNewContext('(' + retryHandlerSource() + ')', {
    navigator: { onLine },
    window: { location },
    location,
    setRetryNonce: (v) => { calls.nonce.push(typeof v === 'function' ? v(0) : v); },
  });
  handler();
  return calls;
}

test('online: ค้นอีกครั้ง reloads once, since the same document can never complete the failed import', () => {
  const calls = press(true);
  assert.equal(calls.reload, 1, 'the retry re-ran an import the document remembers as failed');
  assert.deepEqual(calls.nonce, [], 'a reload makes the nonce retry redundant');
});

test('offline: ค้นอีกครั้ง retries in place and never lands on the offline page', () => {
  const calls = press(false);
  assert.equal(calls.reload, 0, 'reloading while offline would replace the wiki with the browser offline page');
  assert.deepEqual(calls.nonce, [1], 'the offline retry must still re-run the search');
});

test('a browser that does not report connectivity reloads, as the Notes retry does', () => {
  const calls = press(undefined);
  assert.equal(calls.reload, 1);
  assert.deepEqual(calls.nonce, []);
});

test('the query the student typed survives that reload', () => {
  const index = SRC.slice(SRC.indexOf('function WikiIndex('));
  assert.match(index, /useState\(\(\) => \{\s*try \{ return sessionStorage\.getItem\('vmx-wiki-q'\) \|\| ''; \}/,
    'the index must restore its query from sessionStorage on load');
  assert.ok(index.includes("sessionStorage.setItem('vmx-wiki-q', q)"),
    'and write it as the student types, before any retry can reload');
});
