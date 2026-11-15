// The term glossary at the end of a VetWiki chapter (5.223.0), as walked on vetmock.com on 15 Nov 2026.
// Two defects, one guard each:
// - its title and cells set `color` to a font-stack token (--vw-display, --vw-body), which is not a colour,
//   so the declaration was dropped: the title never took the display face and the cells never took the
//   body face. The first test reads every stylesheet, so the same slip cannot return anywhere.
// - at 390 px the three columns left about 90 px each, so the meaning column ran one or two words to a
//   line and 15 terms filled several screens. A phone now lays each term out as one entry.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// Tokens that hold a font stack (their definitions start with a quoted family name).
const fontTokens = () => {
  const names = new Set();
  for (const f of readdirSync(new URL('../../src/', import.meta.url)).filter((n) => n.endsWith('.css'))) {
    for (const m of read(`src/${f}`).matchAll(/(--[a-z0-9-]+):\s*'[^']+'/g)) names.add(m[1]);
  }
  return names;
};

test('no stylesheet sets a colour from a font-stack token', () => {
  const fonts = fontTokens();
  assert.ok(fonts.has('--vw-display') && fonts.has('--vw-body'), 'the wiki font tokens were found');
  const bad = [];
  for (const f of readdirSync(new URL('../../src/', import.meta.url)).filter((n) => n.endsWith('.css'))) {
    const css = read(`src/${f}`);
    for (const m of css.matchAll(/(?:^|[;{\s])(?:background-)?color:\s*var\((--[a-z0-9-]+)/g)) {
      if (fonts.has(m[1])) bad.push(`${f}: color: var(${m[1]})`);
    }
  }
  assert.deepEqual(bad, []);
});

test('the glossary title and cells take the wiki faces', () => {
  const css = read('src/styles-wiki.css');
  const block = (sel) => { const at = css.indexOf(`\n${sel} {`); assert.notEqual(at, -1, `${sel} is missing`); return css.slice(at, css.indexOf('\n}', at)); };
  assert.match(block('.vw-glossary-title'), /font-family:\s*var\(--vw-display\)/);
  assert.match(block('.vw-glossary-table td'), /font-family:\s*var\(--vw-body\)/);
});

test('on a phone each glossary term is one entry, and the table keeps its roles', () => {
  const css = read('src/styles-wiki.css');
  const media = [...css.matchAll(/@media \(max-width: (\d+)px\) \{([\s\S]*?)\n\}/g)]
    .filter((m) => Number(m[1]) >= 430 && m[2].includes('.vw-glossary-table'));
  assert.equal(media.length, 1, 'one phone block for the glossary');
  const body = media[0][2];
  assert.match(body, /\.vw-glossary-table tr,[\s\S]*?\{ display: block; \}/, 'rows become blocks');
  assert.match(body, /\.vw-glossary-table thead \{[\s\S]*?clip-path: inset\(50%\)/, 'column heads stay for screen readers only');
  const jsx = read('src/views/KnowledgeView.jsx');
  const at = jsx.indexOf('className="vw-glossary-table"');
  assert.notEqual(at, -1);
  const table = jsx.slice(at - 200, jsx.indexOf('</table>', at));
  for (const role of ['role="table"', 'role="rowgroup"', 'role="row"', 'role="columnheader"', 'role="rowheader"', 'role="cell"']) {
    assert.ok(table.includes(role), `${role} on the glossary table`);
  }
});
