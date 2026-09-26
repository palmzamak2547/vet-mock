// ============================================================
// screening-bench-guess.test.mjs — a guess is a guess until the reveal
// ============================================================
// "ลองเดาก่อนดูคำตอบ" hides the positive predictive value so the student
// commits to a number first. The headline, the dot field and the 2x2 table
// waited for the reveal, but the prevalence curve was still drawn from the
// same sensitivity and specificity: its height at the current prevalence is
// the answer, and its role=img aria-label read the exact value aloud (B71).
//
// This renders the real component (bundled with esbuild, rendered with
// react-dom/server) in guessing mode and in answer mode, and checks the
// printed answer appears only in the second.
// ============================================================
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

import { screeningTable, LECTURE_SCENARIOS } from '../../src/lib/screening.js';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

// One bundle carries React, react-dom/server and the component, so the
// hooks and the renderer share one copy of React.
const dir = mkdtempSync(join(tmpdir(), 'screening-bench-'));
after(() => rmSync(dir, { recursive: true, force: true }));
const outfile = join(dir, 'bench.cjs');
await build({
  stdin: {
    contents: [
      "import { createElement } from 'react';",
      "import { renderToStaticMarkup } from 'react-dom/server';",
      "import ScreeningBench from './src/components/ScreeningBench.jsx';",
      'export const render = (props) => renderToStaticMarkup(createElement(ScreeningBench, props));',
    ].join(String.fromCharCode(10)),
    resolveDir: repoRoot,
    loader: 'jsx',
  },
  bundle: true,
  format: 'cjs',
  platform: 'node',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  outfile,
  logLevel: 'silent',
});
const { render } = (await import(pathToFileURL(outfile).href)).default;

const pct1 = (v) => `${(v * 100).toFixed(1)}%`;
const answerFor = (preset) => {
  const table = screeningTable(LECTURE_SCENARIOS[preset].input);
  assert.notEqual(table.ppv, null, 'this preset has a predictive value to guess');
  return pct1(table.ppv);
};

test('while a guess is pending, the answer is nowhere on the page', () => {
  for (let preset = 0; preset < LECTURE_SCENARIOS.length; preset++) {
    const { ppv } = screeningTable(LECTURE_SCENARIOS[preset].input);
    if (ppv === null) continue;
    const answer = pct1(ppv);
    const html = render({ preset, initialGuess: 50 });
    assert.match(html, /ดูคำตอบ/, 'the guessing slider is showing');
    assert.doesNotMatch(html, /กราฟค่าทำนายผลบวกเทียบกับความชุก/, `preset ${preset}: the curve waits for the reveal`);
    assert.ok(!html.includes(answer), `preset ${preset}: ${answer} must not be printed or announced before the guess`);
  }
});

test('after the reveal the curve and its label come back', () => {
  const answer = answerFor(0);
  const html = render({ preset: 0 });
  assert.match(html, /กราฟค่าทำนายผลบวกเทียบกับความชุก/);
  assert.ok(html.includes(answer), 'the readout shows the value once no guess is pending');
});
