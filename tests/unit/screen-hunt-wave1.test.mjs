// Fixes from the first wave of the screen hunt (14 Nov 2026, scripts/screen-hunt.mjs), one guard each.
// The hunt measures the drawn screen; these read the code that drew it, so each fails on the old line.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const CSS = read('src/styles.css');
const rule = (selector) => {
  const at = CSS.indexOf(`\n${selector} {`);
  assert.notEqual(at, -1, `${selector} is missing from styles.css`);
  return CSS.slice(at, CSS.indexOf('\n}', at));
};

const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const [r, g, b] = hex(c); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const token = (block, name) => {
  const at = CSS.indexOf(block);
  const m = CSS.slice(at, CSS.indexOf('\n}', at)).match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, 'i'));
  assert.ok(m, `${name} in ${block}`);
  return m[1];
};

test('the bench lesson answers use the app typeface, not the browser\'s Arial at 13.33 px', () => {
  assert.match(rule('.vmx-check__option'), /\bfont: inherit;/);
});

test('every form control draws in the app typeface, at zero specificity and before any class', () => {
  const at = CSS.indexOf(':where(button, input, select, textarea) { font-family: inherit; }');
  assert.notEqual(at, -1, 'controls fall back to the browser font (Arial) and draw Thai in it');
  const firstClass = CSS.search(/\n\.vmx-[\w-]+[^{]*\{/);
  assert.ok(at < firstClass, 'the reset comes before the class rules');
});

test('the phone header logo may give way, so the paper pill never runs under the search button', () => {
  assert.match(CSS, /\.vmx-logo-btn \{ width: var\(--touch-min\); padding: 0;/);
});

test('Home prints a subject\'s accuracy in the text shades, which read 4.5:1, not the fill shades', () => {
  const home = read('src/views/HomeView.jsx');
  const acc = home.slice(home.indexOf('const accColor = hasAccData'), home.indexOf("'var(--clr-ink-soft)';", home.indexOf('const accColor = hasAccData')));
  assert.match(acc, /--clr-rose-text/);
  assert.doesNotMatch(acc, /var\(--clr-(rose|gold|sage)\)/);
});

test('the open topic in the notes list reads its lecturer and size in ink, legible on the rose tint', () => {
  const notes = read('src/views/NotesView.jsx');
  for (const line of ['ผู้สอน:', '{t.sections.length} ส่วน']) {
    const at = notes.indexOf(line);
    const style = notes.slice(notes.lastIndexOf('<div style={{', at), at);
    assert.match(style, /color: active \? 'var\(--clr-ink\)' : 'var\(--clr-ink-soft\)'/, line);
  }
  // Why: ink-soft on the dark theme's rose tint is under 3:1, ink is not.
  const dark = '[data-theme="dark"] {';
  assert.ok(ratio(token(dark, '--clr-ink-soft'), token(dark, '--clr-rose-soft')) < 3);
  assert.ok(ratio(token(dark, '--clr-ink'), token(dark, '--clr-rose-soft')) >= 4.5);
});

test('the row that shows a course\'s empty topics is a 44 px target', () => {
  const topics = read('src/views/TopicSelectView.jsx');
  const at = topics.indexOf('onClick={() => setShowEmptyTopics((v) => !v)}');
  assert.match(topics.slice(at, at + 400), /minHeight: 44,/);
});

test('a practice result writes its pace as one line with the comma against the time', () => {
  const results = read('src/views/ResultsView.jsx');
  const at = results.indexOf('className="vmx-pacing-telemetry"');
  const pace = results.slice(at, results.indexOf('</div>', at));
  assert.equal((pace.match(/<span>/g) || []).length, 1, 'one text in the flex row, so its gap cannot open before the comma');
  assert.match(pace, /`, เฉลี่ย \$\{/);
});

test('a wiki source lists the sections that cite it without a comma floating between 44 px targets', () => {
  const evidence = read('src/components/WikiEvidence.jsx');
  const at = evidence.indexOf("{'อ้างในหัวข้อย่อย '}");
  const list = evidence.slice(at, evidence.indexOf('</span>', at));
  assert.doesNotMatch(list, /', '/);
  assert.match(read('src/styles-wiki.css'), /\.vw-src-meta a \{\n\s+display: inline-flex; align-items: center; justify-content: center; min-width: 44px;/);
});

test('the result bar names its mark once, with room above for the flag', () => {
  const results = read('src/views/ResultsView.jsx');
  const at = results.indexOf('<div className="vmx-benchmark-legend">');
  const legend = results.slice(at, results.indexOf('</div>', at));
  assert.doesNotMatch(legend, /PRACTICE_PASS_PCT/, 'the legend sat at 50% under a mark at 60%');
  assert.match(results, /<div className="vmx-benchmark-flag">เกณฑ์ \{PRACTICE_PASS_PCT\}%<\/div>/);
  const top = Number(rule('.vmx-benchmark-container').match(/margin: (\d+)px/)[1]);
  const flag = Number(rule('.vmx-benchmark-flag').match(/top: -(\d+)px/)[1]);
  assert.ok(top >= flag + 12, `the flag stands ${flag} px above the track, the bar only ${top} px under the score`);
});
