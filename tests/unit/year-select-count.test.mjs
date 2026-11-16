// The year picker (src/views/YearSelectView.jsx), drawn by the real view.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const sourceRoot = new URL('../../src/', import.meta.url).href;
registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith(sourceRoot) && url.endsWith('.css')) return { format: 'module', shortCircuit: true, source: '' };
    if (url.startsWith(sourceRoot) && url.endsWith('.jsx')) {
      const { code } = transformSync(readFileSync(new URL(url), 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url });
      return { format: 'module', shortCircuit: true, source: code };
    }
    return nextLoad(url, context);
  },
});
const { default: YearSelectView } = await import('../../src/views/YearSelectView.jsx');

test('the count of other years is drawn at full strength, not faded below a readable contrast', () => {
  const html = renderToStaticMarkup(createElement(YearSelectView, { selectedYear: 5, goHome() {}, setSelectedYear() {}, setSelectedPhase() {}, setView() {} }));
  const count = html.match(/<span style="([^"]*)">\d+ ปี, กำลังเตรียมเนื้อหา<\/span>/);
  assert.ok(count, 'the count of other years is drawn');
  assert.doesNotMatch(count[1], /opacity/);
});
