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
//
// Wrap-up slice 1: a line written "Term: detail" leads with its term too
// ("Stool pH: bacteria > 7, virus < 7", 465 lines across the pages), and so
// does a short keyword chip. A colon counts only with a space after it, so
// clock times stay whole, and the part before it must be a term: at most 60
// characters with its brackets closed.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { keyTerm } from '../../src/lib/wrap-keyline.js';
import { wrapUpPapers, loadWrapUp, selfNumbered } from '../../src/data/exam-wrapups.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('UI-19: a "Term — explanation" line splits at its first dash and loses nothing', () => {
  assert.deepEqual(keyTerm('Equine passport — สัตวแพทย์เป็นผู้เขียน'), { term: 'Equine passport', sep: ' — ', rest: 'สัตวแพทย์เป็นผู้เขียน' });
  // A second dash stays in the explanation; split(' — ', 2) would drop it.
  assert.deepEqual(keyTerm('A — B — C'), { term: 'A', sep: ' — ', rest: 'B — C' });
  for (const plain of ['no dash here', '— leading dash', 'hyphen - only', 'x —y']) assert.equal(keyTerm(plain), null);
});

test('a "Term: detail" line splits at its first colon, and a time, a ratio or a clause does not', () => {
  assert.deepEqual(keyTerm('Stool pH: bacteria > 7, virus < 7'), { term: 'Stool pH', sep: ': ', rest: 'bacteria > 7, virus < 7' });
  assert.deepEqual(keyTerm('Left: ตับ กระเพาะ / Right: ตับ cecum'), { term: 'Left', sep: ': ', rest: 'ตับ กระเพาะ / Right: ตับ cecum' });
  // Whichever separator comes first wins.
  assert.deepEqual(keyTerm('A: B — C'), { term: 'A', sep: ': ', rest: 'B — C' });
  assert.deepEqual(keyTerm('A — B: C'), { term: 'A', sep: ' — ', rest: 'B: C' });
  for (const plain of [
    'สอบ 13:00-15:00', // a clock time has no space after its colon
    'ratio 1:2 in the herd',
    '2 Public Health (บทบาท 4: improve agriculture)', // a bracket left open: the colon is inside a remark
    'ก'.repeat(61) + ': detail', // a clause, not a term
    'trailing colon: ',
    ': leading colon',
  ]) assert.equal(keyTerm(plain), null, plain);
});

test('UI-19: over every shipped wrap-up, the split is lossless and lands where the audit counted', async () => {
  const perSubject = {};
  for (const { year, phase, subject: s } of wrapUpPapers()) {
    const d = await loadWrapUp(s, year, phase);
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
          assert.equal(`${p.term}${p.sep}${p.rest}`, k, `${s}: "${k}" does not survive the split`);
          assert.ok(p.term.length <= 60, `${s}: "${p.term}" is a clause, not a term`);
        }
      }
    }
    // One subject has a wrap-up per paper, so the count is per paper: the
    // audit counted the midterm pages.
    perSubject[`${s}:${phase}`] = [terms, lines];
  }
  // 42 and 1 dash lines when UI-19 was measured; the colon lines joined in slice 1.
  assert.deepEqual(perSubject['equine-medicine:1-mid'], [63, 83]);
  assert.deepEqual(perSubject['equine-repro:1-mid'], [16, 60]);
});

test('UI-19: the list bolds the term for a plain list only, and a numbered list keeps its text', () => {
  const view = read('src/views/WrapUpView.jsx');
  assert.match(view, /import \{ keyTerm \} from '\.\.\/lib\/wrap-keyline\.js';/);
  assert.match(view, /const numbered = selfNumbered\(it\.keywords\);/);
  assert.match(view, /const parts = numbered \? null : keyTerm\(k\);/);
  assert.match(view, /<li key=\{k\}>\{parts \? <><b>\{parts\.term\}<\/b>\{parts\.sep\}\{parts\.rest\}<\/> : k\}<\/li>/);
  // A chip leads with its term the same way, and a plain chip is untouched.
  assert.match(view, /<span key=\{k\} className="vmx-wrap-key has-term"><b>\{parts\.term\}<\/b>\{parts\.sep\}\{parts\.rest\}<\/span>/);
  assert.match(view, /: <span key=\{k\} className="vmx-wrap-key">\{k\}<\/span>;/);
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
