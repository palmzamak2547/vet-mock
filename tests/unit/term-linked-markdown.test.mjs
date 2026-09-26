// ============================================================
// term-linked-markdown.test.mjs — a glossary term inside **bold**
// ============================================================
// B29: TermLinkedRichText cut the raw markdown at every detected term and
// sent each piece to RichText on its own. "**DMI**" became "**", the DMI
// button, and "**...", and RichText cannot match a lone "**", so the
// asterisks printed and the emphasis was lost (19 real explanations).
// The component now splits the markdown first and places each term inside
// the bold or italic run it sits in.
//
// The component's real splitter, cut from the source and run under vm with
// the real term detector.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { detectTerms } from '../../src/lib/term-detect.js';

const SRC = readFileSync(new URL('../../src/components/TermLinkedRichText.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const RICH = readFileSync(new URL('../../src/lib/richtext.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function cut(src, start, end) {
  const a = src.indexOf(start);
  assert.notEqual(a, -1, `source must still contain ${JSON.stringify(start)}`);
  const b = src.indexOf(end, a);
  assert.notEqual(b, -1);
  return src.slice(a, b + end.length);
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(`${cut(SRC, 'const MARKDOWN_TOKEN_RE', ';\n')}\n${cut(SRC, 'function splitTermMarkdown(', '\n}\n')}\nthis.split = splitTermMarkdown;`, ctx);
const split = (str, subject = 'cliapprum') => ctx.split(str, detectTerms(str, subject));

// Flatten back to what the reader would see: markers never survive as text.
function visible(nodes) {
  return nodes.map((n) => (n.children ? visible(n.children) : n.value)).join('');
}

test('the splitter tokenises exactly as RichText does', () => {
  const mine = cut(SRC, 'const MARKDOWN_TOKEN_RE = ', ';\n').replace('const MARKDOWN_TOKEN_RE = ', '');
  const theirs = cut(RICH, 'const TOKEN_RE = ', ';\n').replace('const TOKEN_RE = ', '');
  assert.equal(mine, theirs);
});

test('a term inside **bold** renders bold, with no stray asterisks, and stays tappable', () => {
  const str = '**DMI** ต่ำกว่าปกติ';
  assert.ok(detectTerms(str, 'cliapprum').length > 0, 'fixture: DMI is a glossary term');
  const { nodes, terms } = split(str);
  assert.equal(nodes[0].type, 'strong');
  assert.equal(nodes[0].children[0].type, 'term');
  assert.equal(nodes[0].children[0].value, 'DMI');
  assert.equal(terms.length, 1);
  assert.equal(terms[0].at, 0);
  assert.doesNotMatch(visible(nodes), /\*/);
});

test('a longer bold heading keeps its term and the rest of the run bold', () => {
  const { nodes } = split('ดู **LDA risk factors** ก่อน');
  const strong = nodes.find((n) => n.type === 'strong');
  assert.ok(strong);
  assert.equal(visible([strong]), 'LDA risk factors');
  assert.ok(strong.children.some((c) => c.type === 'term' && c.value === 'LDA'));
  assert.doesNotMatch(visible(nodes), /\*/);
});

test('a term inside `code` stays plain code, and a line break stays a break', () => {
  const { nodes, terms } = split('`DMI`\nDMI');
  assert.deepEqual(JSON.parse(JSON.stringify(nodes.slice(0, 2).map((n) => [n.type, n.value]))), [['raw', '`DMI`'], ['raw', '\n']]);
  assert.equal(terms.length, 1, 'only the plain DMI is a term');
  assert.equal(nodes[2].type, 'term');
});

test('real explanations with a term inside bold print no marker as text', async () => {
  const { QB, loadQB } = await import('../../src/data/questions.js');
  await loadQB();
  let seen = 0;
  for (const q of QB) {
    const text = String(q.explain || '');
    if (!text.includes('**')) continue;
    const matches = detectTerms(text, q.subject);
    if (!matches.length) continue;
    const { nodes } = ctx.split(text, matches);
    const strongs = [];
    const walk = (list) => { for (const n of list) { if (n.type === 'strong') strongs.push(n); if (n.children) walk(n.children); } };
    walk(nodes);
    for (const s of strongs) {
      if (!s.children.some((c) => c.type === 'term')) continue;
      seen++;
      // the text left outside any run must not carry a "**" that RichText would print
    }
    const outside = nodes.filter((n) => n.type === 'text').map((n) => n.value).join('');
    assert.doesNotMatch(outside, /\*\*[^*\n]+\*\*/, `${q.subject}:${q.id} left a bold run unsplit`);
  }
  assert.ok(seen >= 10, `expected the probe's ~19 explanations with a term inside bold, saw ${seen}`);
});
