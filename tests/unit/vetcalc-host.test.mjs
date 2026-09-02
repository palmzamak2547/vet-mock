// ============================================================
// VetCalculatorHost — a failed calculator chunk must not take the page down
// ============================================================
// The calculator loads on its first open request. React.lazy would throw a
// rejected import at the tree, and nothing above this host catches it, so
// the load is a plain import() promise: a failure keeps the screen and
// offers a retry (found in review of #10).

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const host = app.slice(app.indexOf('function VetCalculatorHost('), app.indexOf('export default function App('));

test('the calculator is not imported eagerly and not through React.lazy', () => {
  assert.doesNotMatch(app, /^import VetCalculator from/m);
  assert.doesNotMatch(app, /lazy\(\(\) => import\('\.\/components\/VetCalculator\.jsx'\)\)/);
  assert.match(app, /const loadVetCalculator = \(\) => import\('\.\/components\/VetCalculator\.jsx'\);/);
});

test('a failed load is caught, keeps the page, and offers a retry', () => {
  assert.match(host, /const mod = await loadVetCalculator\(\);/);
  // A failed module fetch is memoised by the browser, so the retry is a
  // reload of the document, never a second import() in the same one.
  assert.match(host, /\} catch \{[\s\S]*?confirmLabel: 'ลองใหม่'[\s\S]*?if \(again && alive\) window\.location\.reload\(\);/);
  assert.match(host, /window\.addEventListener\('vmx-open-vetcalc', load\);/);
  assert.match(host, /if \(!Calculator\) return null;\n  return <Calculator showFab=\{false\} initialOpen \/>;/);
});

test('no automatic warm-up: a failing chunk must not feed the one-reload stale-deploy policy', () => {
  assert.doesNotMatch(host, /requestIdleCallback/);
  assert.equal((host.match(/loadVetCalculator\(\)/g) || []).length, 1, 'the module is requested on an open request only');
});
