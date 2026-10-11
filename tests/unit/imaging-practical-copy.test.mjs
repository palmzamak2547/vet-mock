// ============================================================
// Imaging Practical copy: one spelling per word (COPY-23)
// ============================================================
// The app settled on เช็ก (not เช็ค) and a single … (not three dots) for a
// loading line. LabView and the case library were still written the old way.
// Strings are read the way lint:ui-copy reads them, so comments, spreads
// ({...style}) and regex patterns are not mistaken for copy.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extractStrings } from '../../scripts/lint-ui-copy.mjs';

const FILES = [
  'src/views/LabView.jsx',
  'src/components/lab/CaseLibrary.jsx',
  'src/lib/dicom/save-attempt.js',
  'src/lib/dicom/recent-files.js',
];
const strings = (file) => extractStrings(readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8'), file)
  .filter((r) => !r.pattern && !r.content);

for (const file of FILES) {
  test(`${file} has no เช็ค, อัพ or three-dot ellipsis in its copy`, () => {
    const hits = strings(file).filter((r) => /เช็ค|อัพ|\.\.\./.test(r.text));
    assert.deepEqual(hits.map((r) => `${r.file}:${r.line} ${r.text}`), []);
  });
}

test('the loading lines in LabView and the case library read the settled way', () => {
  const lab = strings('src/views/LabView.jsx').map((r) => r.text);
  for (const text of ['กำลังเช็กเคสตัวอย่าง…', 'กำลังโหลดเคสจริง…', 'กำลังโหลด case library…', 'กำลังโหลด viewer…']) {
    assert.ok(lab.includes(text), `LabView says ${JSON.stringify(text)}`);
  }
  const library = strings('src/components/lab/CaseLibrary.jsx').map((r) => r.text);
  assert.ok(library.includes('กำลังโหลด…'), 'the case library opening button says กำลังโหลด…');
});
