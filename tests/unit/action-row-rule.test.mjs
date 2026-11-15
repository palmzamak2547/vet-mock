// The action row rule (docs/DESIGN_SYSTEM.md, Action rows, 5.235.0): one class
// places every row that pairs a way back with a primary action. The way back
// first at the left, the primary last at the right; a primary alone at the
// right, a way back alone at the left. On 15 Nov the practice setup's start sat
// at the far left beside its back button on the owner's iPad.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const css = read('src/styles.css');

test('.vmx-btn-row ends at the right and sends the first of several, or a lone way back, to the left', () => {
  assert.match(css, /\.vmx-btn-row \{ display: flex; gap: 10px; justify-content: flex-end;/);
  assert.match(css, /\.vmx-btn-row:not\(\.is-stack, \.is-center\) > :first-child:not\(:last-child\),\n\.vmx-btn-row:not\(\.is-stack, \.is-center\) > :only-child:not\(\.vmx-btn-primary\) \{ margin-right: auto; \}/);
  // A phone keeps the bar variant on one line, the primary taking the rest.
  const phone = css.slice(css.indexOf('  .vmx-btn-row { flex-direction: column-reverse; gap: 10px; }'));
  assert.match(phone.slice(0, 600), /\.vmx-btn-row\.is-bar \{ flex-direction: row; flex-wrap: nowrap; \}/);
});

test('the practice setup start row is an action row, after ปรับเอง, drawn once', () => {
  const config = read('src/views/ConfigView.jsx');
  assert.ok(config.includes('<div className="vmx-btn-row is-bar">'), 'the start row uses the shared class');
  assert.equal(config.includes('vmx-config-actions-row'), false, 'the screen-own row class is back');
  assert.equal(config.split('className="vmx-config-actions"').length - 1, 1, 'the start bar is drawn in more than one place');
  const toggle = config.indexOf('className="vmx-decide-toggle"');
  assert.ok(toggle > config.indexOf('<section className="vmx-decide"') && toggle < config.indexOf('</section>', toggle), 'ปรับเอง is outside the summary card');
  assert.ok(config.indexOf('className="vmx-config-actions"') > toggle, 'the start row comes before ปรับเอง');
});

test('a row that pairs a way back with a primary puts the primary last', () => {
  const files = [
    ...readdirSync(new URL('../../src/views/', import.meta.url)).map((f) => `src/views/${f}`),
    ...readdirSync(new URL('../../src/components/', import.meta.url)).map((f) => `src/components/${f}`),
  ].filter((f) => f.endsWith('.jsx'));
  const wrong = [];
  let inline = 0;
  for (const f of files) {
    const src = read(f);
    for (const m of src.matchAll(/<div className="vmx-btn-row"([^>]*)>([\s\S]*?)\n\s*<\/div>/g)) {
      if (/justifyContent|flexDirection/.test(m[1])) inline += 1;
      const kids = [...m[2].matchAll(/className="vmx-btn (vmx-btn-(?:primary|ghost))/g)].map((k) => k[1]);
      if (kids.length === 2 && kids[0] === 'vmx-btn-primary' && kids[1] === 'vmx-btn-ghost' && /←|กลับ|ยกเลิก|เปลี่ยน/.test(m[2])) wrong.push(f);
    }
  }
  // SRSessionView's finished screen is being rewritten in its own lane (5.231.0).
  assert.ok(wrong.every((f) => f === 'src/views/SRSessionView.jsx'), `primary before the way back in ${wrong.join(', ')}`);
  // Rows that still set their own placement inline; the number only falls.
  assert.ok(inline <= 6, `${inline} action rows set their own placement inline`);
});
