// ============================================================
// Wrap-up keyword lists: the term leads the line, not a gold box (UI-19)
// ============================================================
// On the one-page read the night before a paper, each long keyword list was
// twelve identical gold blocks, and the term that opens a "Term — what it
// is" line ("Equine passport — สัตวแพทย์เป็นผู้เขียน ...") was set exactly
// like its explanation. Only equine medicine writes its lists that way (42
// of 83 lines; equine repro 1 of 60, the other four subjects none), so the
// split is by the line's own shape, and a line without " — " is rendered
// byte for byte as before. A list the lecturer numbered keeps its text as is.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { keyTerm } from '../../src/lib/wrap-keyline.js';
import { WRAPUP_SUBJECTS, loadWrapUp, selfNumbered } from '../../src/data/exam-wrapups.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('UI-19: a "Term — explanation" line splits at its first dash and loses nothing', () => {
  assert.deepEqual(keyTerm('Equine passport — สัตวแพทย์เป็นผู้เขียน'), { term: 'Equine passport', rest: 'สัตวแพทย์เป็นผู้เขียน' });
  // A second dash stays in the explanation; split(' — ', 2) would drop it.
  assert.deepEqual(keyTerm('A — B — C'), { term: 'A', rest: 'B — C' });
  for (const plain of ['no dash here', '— leading dash', 'hyphen - only', 'x —y']) assert.equal(keyTerm(plain), null);
});

test('UI-19: over every shipped wrap-up, the split is lossless and lands where the audit counted', async () => {
  const perSubject = {};
  for (const s of WRAPUP_SUBJECTS) {
    const d = await loadWrapUp(s);
    let lines = 0;
    let terms = 0;
    for (const g of d.groups) {
      for (const it of g.items) {
        const ks = it.keywords || [];
        if (!ks.some((k) => k.length > 44)) continue; // chips, not a list
        for (const k of ks) {
          lines += 1;
          const p = keyTerm(k);
          if (!p) continue;
          terms += 1;
          assert.equal(`${p.term} — ${p.rest}`, k, `${s}: "${k}" does not survive the split`);
          assert.ok(p.term.length <= 60, `${s}: "${p.term}" is a clause, not a term`);
        }
      }
    }
    perSubject[s] = [terms, lines];
  }
  assert.deepEqual(perSubject['equine-medicine'], [42, 83]);
  assert.deepEqual(perSubject['equine-repro'], [1, 60]);
});

test('UI-19: the list bolds the term for a plain list only, and a numbered list keeps its text', () => {
  const view = read('src/views/WrapUpView.jsx');
  assert.match(view, /import \{ keyTerm \} from '\.\.\/lib\/wrap-keyline\.js';/);
  assert.match(view, /const numbered = selfNumbered\(it\.keywords\);/);
  assert.match(view, /const parts = numbered \? null : keyTerm\(k\);/);
  assert.match(view, /<li key=\{k\}>\{parts \? <><b>\{parts\.term\}<\/b>\{' — '\}\{parts\.rest\}<\/> : k\}<\/li>/);
  assert.equal(selfNumbered(['1 A', '2 B', '3 C']), true);
});

test('UI-19: the list rows are hairlines, not tinted boxes, with a Sarabun tabular counter', () => {
  const css = read('src/styles.css');
  const li = css.match(/\n\.vmx-wrap-keylist li \{([^}]*)\}/)?.[1];
  assert.ok(li, '.vmx-wrap-keylist li moved');
  assert.doesNotMatch(li, /background/, 'the gold tint is back');
  assert.match(li, /border-bottom: 1px solid var\(--clr-border\);/);
  assert.match(li, /padding: 6px 10px 6px 34px;/);
  const counter = css.match(/\n\.vmx-wrap-keylist li::before \{([^}]*)\}/)?.[1];
  assert.match(counter, /font-family: var\(--vmx-sans\);/);
  assert.match(counter, /font-variant-numeric: tabular-nums;/);
  // Printing still keeps a wrap-up card whole.
  assert.ok(css.includes('@media print { .vmx-wrap-index, .vmx-wrap-actions { display: none !important; } .vmx-wrap-item { break-inside: avoid; } }'));
});
