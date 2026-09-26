// ============================================================
// wiki-search-section-links.test.mjs — a matched heading opens its section
// ============================================================
// B36: VetWiki full-text search listed "พบใน: <heading>, …" under a result,
// but the headings were plain text and WikiIndex's onOpenSection prop was
// never passed, so the row could only open the article at its top. Each
// matched heading is now a control that opens the article at that section.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { wikiPath } from '../../src/lib/vetwiki/url.js';

const SRC = readFileSync(new URL('../../src/views/KnowledgeView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
function cut(start, end) {
  const a = SRC.indexOf(start);
  assert.notEqual(a, -1, `KnowledgeView must still contain ${JSON.stringify(start)}`);
  return SRC.slice(a, SRC.indexOf(end, a) + end.length);
}

test('openSection opens the article and puts the section in the address', () => {
  const pushed = [];
  const opened = [];
  const ctx = {
    topics: [{ id: 'com5--rabies', subject: 'com5', topic: 'rabies' }],
    setOpenId: (id) => opened.push(id),
    wikiPath,
    window: { history: { pushState: (state, _t, url) => pushed.push([state.vetwiki, url]) }, scrollTo() {} },
  };
  vm.createContext(ctx);
  const openSection = vm.runInContext(`(() => { ${cut('const openSection = (id, sectionId) => {', '\n  };\n')} return openSection; })()`, ctx);
  openSection('com5--rabies', 'com5--rabies--diagnosis');
  assert.deepEqual(opened, ['com5--rabies']);
  assert.deepEqual(pushed, [['com5--rabies', '/wiki/com5/rabies#com5--rabies--diagnosis']]);
  openSection('no--such', 'x');
  assert.equal(opened.length, 1, 'an unknown topic opens nothing');
});

test('the index receives onOpenSection and renders each matched heading as a control', () => {
  assert.match(SRC, /<WikiIndex topics=\{topics\} onOpen=\{openTopic\} onOpenSection=\{openSection\} goHome=\{goHome\} \/>/);
  const index = cut('function WikiIndex(', '\n}\n');
  assert.match(index, /onClick=\{\(\) => onOpenSection\?\.\(t\.id, s\.id\)\}/);
  assert.doesNotMatch(index, /\.map\(\(s\) => s\.heading\)\.join\(', '\)/, 'headings are no longer joined into plain text');
});
