// A palette re-colours the accent, never a verdict. Right and partly right
// answers read their own tokens (--clr-right and --clr-part), defined once per theme and
// set by no palette block; wrong answers read --clr-rose, which no palette
// sets either. Under cherry a right answer used to turn red beside the rose
// of a wrong one, and ocean, plum and mono gave it blue, purple and grey.
//
// The verdict rules are derived, not listed: any rule in a stylesheet whose
// selector names a verdict state (ok, correct, right, pass, found, partial,
// and the wrong side) and any JSX line beside a verdict value must not read a
// palette's accent token. A new verdict rule that forgets fails here.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), 'utf8');
const STYLES = readdirSync(new URL('src/', ROOT)).filter((f) => /^styles.*\.css$/.test(f));

export const STATE = /(?:^|[.\-_])(ok|is-ok|correct|is-correct|reveal-correct|correct-ans|correct-val|right|is-right|pass|is-pass|found|is-found|partial|is-partial|half|wrong|is-wrong|reveal-wrong|wrong-ans|incorrect|is-incorrect|fail|is-fail|miss|is-miss|good|is-good|bad|is-bad)(?![\w-])/;
const ACCENT = /var\(--(clr-sage[\w-]*|clr-gold[\w-]*|vmx-color-learning[\w-]*)\)/;
// Classes that carry a state word but paint no verdict, each with its reason.
const NOT_VERDICTS = [
  [/^\.ad-/, 'the back office (one account), its health bars and flags'],
  [/^\.vw-found/, 'VetWiki search hits, a find, not a judged answer'],
  [/^\.vmx-sr-btn/, 'the review grade buttons the student presses, an input'],
  [/^\.vmx-lesson-compare/, 'a lesson figure\'s good and bad example panels'],
];
// Verdict elements whose class names no state.
const NAMED = ['.vmx-check__verdict', '.vmx-check__why', '.vmx-aigrade-gap .vmx-kicker'];

function rulesOf(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));
}
export function verdictLeaks(css) {
  const leaks = [];
  for (const { sel, body } of rulesOf(css)) {
    if (!ACCENT.test(body)) continue;
    for (const s of sel.split(',').map((x) => x.trim())) {
      if (s.includes('[data-palette')) continue;
      if (NOT_VERDICTS.some(([re]) => re.test(s))) continue;
      const classes = s.match(/\.[\w-]+/g) || [];
      if (classes.some((c) => STATE.test(c.slice(1))) || NAMED.includes(s)) leaks.push(`${s} reads ${body.match(ACCENT)[0]}`);
    }
  }
  return leaks;
}

test('no verdict rule in any stylesheet reads a palette\'s accent', () => {
  const leaks = STYLES.flatMap((f) => verdictLeaks(read(`src/${f}`)).map((l) => `${f}: ${l}`));
  assert.deepEqual(leaks, []);
});

test('the check catches a verdict rule that forgets (mutation)', () => {
  const css = read('src/styles.css');
  for (const bad of [
    '.vmx-results-pill.is-ok{color:var(--clr-sage-text)}',
    '.x-card.partial .k { border-color: var(--clr-gold); }',
    '.vmx-new-score.is-pass { background: var(--vmx-color-learning); }',
    '.vmx-check__verdict { color: var(--clr-sage-text); }',
  ]) assert.ok(verdictLeaks(`${css}\n${bad}\n`).length > 0, bad);
});

test('verdict tokens are the house colours in both themes, and no palette sets them or rose', () => {
  const block = (sel) => {
    const at = read('src/styles.css').indexOf(`\n${sel} {`);
    const css = read('src/styles.css');
    const body = css.slice(at, css.indexOf('\n}', at));
    return Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  };
  const light = block(':root, [data-theme="light"]');
  const dark = { ...light, ...block('[data-theme="dark"]') };
  for (const t of [light, dark]) {
    assert.equal(t['--clr-right'], t['--clr-sage']);
    assert.equal(t['--clr-right-text'], t['--clr-sage-text']);
    assert.equal(t['--clr-right-soft'], t['--clr-sage-soft']);
    assert.equal(t['--clr-part'], t['--clr-gold']);
    assert.equal(t['--clr-part-text'], t['--clr-gold-text']);
    assert.equal(t['--clr-part-soft'], t['--clr-gold-soft']);
  }
  for (const f of STYLES) {
    for (const { sel, body } of rulesOf(read(`src/${f}`))) {
      if (!sel.includes('[data-palette')) continue;
      assert.doesNotMatch(body, /--clr-right|--clr-part|--clr-rose/, `${f}: ${sel}`);
    }
  }
});

test('JSX beside a verdict value reads verdict tokens, not the accent', () => {
  const VERDICT_VALUE = /\b(isCorrect|isCorrectAnswer|isPartial|scorePct|liveScore|currentQ\.answer|score\.correct|accPct|r\.pct)\b/;
  const walk = (dir, out = []) => {
    for (const n of readdirSync(dir)) {
      const p = join(dir, n);
      if (statSync(p).isDirectory()) walk(p, out); else if (/\.jsx$/.test(n)) out.push(p);
    }
    return out;
  };
  const leaks = [];
  for (const p of walk(new URL('src/', ROOT).pathname.replace(/^\/([A-Z]:)/, '$1'))) {
    const lines = readFileSync(p, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (!ACCENT.test(line)) return;
      if (VERDICT_VALUE.test(lines.slice(Math.max(0, i - 3), i + 1).join(' '))) leaks.push(`${p.split(/[\\/]src[\\/]/)[1]}:${i + 1}`);
    });
  }
  assert.deepEqual(leaks, []);
});
