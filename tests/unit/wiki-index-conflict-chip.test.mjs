// The VetWiki index marked a topic whose evidence disagrees with the lecture
// with a red "!6" in the mono face. Its only explanation was a title
// attribute, which touch screens never show, so on a phone the mark meant
// nothing. The row now carries the words the article itself uses for the same
// count, "หลักฐานไม่ตรงกับที่บรรยาย N จุด", in the body face, and keeps the title.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const view = fs.readFileSync(new URL('../../src/views/KnowledgeView.jsx', import.meta.url), 'utf8');
const index = view.slice(view.indexOf('function WikiIndex'), view.indexOf('// ================= ARTICLE'));
const chipAt = index.indexOf('conflictCountFor(t.subject, t.topic) > 0');
const chip = index.slice(chipAt, index.indexOf(')}', index.indexOf('</span>', chipAt)));

test('the index row says in words what the conflict mark means', () => {
  assert.ok(chipAt > 0, 'the index still marks topics with a recorded conflict');
  assert.ok(!/!\{conflictCountFor/.test(index), 'no bare "!N" left');
  assert.match(chip, /หลักฐานไม่ตรงกับที่บรรยาย \{conflictCountFor\(t\.subject, t\.topic\)\} จุด/);
  assert.ok(view.includes('หลักฐานไม่ตรงกับที่บรรยาย {conflictCount} จุด'), 'the same words as the article header');
  assert.match(chip, /title="มีจุดที่หลักฐานไม่ตรงกับที่บรรยาย"/, 'the tooltip stays for pointer users');
});

test('the chip is set in the body face, in the rose text colour', () => {
  assert.ok(!chip.includes('--vmx-mono'), 'Thai in the mono face renders in a fallback font');
  assert.ok(chip.includes("color: 'var(--clr-rose-text)'"));
  assert.ok(!chip.includes('·'));
});
