// ============================================================
// lint-accent-tokens.mjs — every *-text token, on every surface it can
// land on, including the tinted ones.
// ============================================================
// The browser sweep in audit-contrast.mjs measures what is on screen, and
// what is on screen moves: it found ONE of these twelve, and only because
// a schedule chip happened to render during class hours. A gate whose
// coverage depends on the time of day is not a gate you can trust to be
// silent.
//
// This is the deterministic half. It reads the tokens straight out of
// styles.css and checks each one against the three base surfaces AND the
// accent-tinted variants of two of them — chips and cards mix ~12% of the
// accent into their background, which lands lighter than any base surface
// in light mode and darker in dark, and that is where all twelve failures
// were hiding. Every one had been derived against base surfaces only and
// read 3.84-4.49 on a tinted chip.
//
// It does NOT replace the browser sweep: hardcoded colours, inline styles
// and composited backgrounds are invisible from here. The two cover
// different halves.
//
// Run: npm run lint:accent-tokens
// ============================================================

import { readFileSync } from 'node:fs';
const CSS = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const hx = h => { const n = parseInt(h.slice(1), 16); return [n>>16&255, n>>8&255, n&255]; };
const L = c => { const f = v => { v/=255; return v<=0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4; }; return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]); };
const R = (a,b) => { const x=L(hx(a)), y=L(hx(b)); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); };
const mix = (a,s,f=0.12) => { const A=hx(a),S=hx(s); return '#'+[0,1,2].map(i=>Math.round(A[i]*f+S[i]*(1-f)).toString(16).padStart(2,'0')).join(''); };

function block(sel) {
  const at = CSS.indexOf(sel + ' {'); if (at === -1) return null;
  const body = CSS.slice(at, CSS.indexOf('\n}', at));
  const v = {}; for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) v[m[1]] = m[2].trim();
  return v;
}
const BASE = { light: block(':root, [data-theme="light"]'), dark: block('[data-theme="dark"]') };
const FAMS = ['sage','gold','rose','ocean','plum'];
let bad = 0;
for (const theme of ['light','dark']) {
  const base = BASE[theme];
  const surfaces = [base['clr-bg'], base['clr-surface'], base['clr-surface-2']];
  for (const pal of [null,'ocean','plum','cherry','mono','forest']) {
    const sel = pal ? (theme==='dark' ? `[data-theme="dark"][data-palette="${pal}"]` : `[data-palette="${pal}"]`)
                    : (theme==='dark' ? '[data-theme="dark"]' : ':root, [data-theme="light"]');
    const vars = pal ? (block(sel) || {}) : base;
    for (const fam of FAMS) {
      const text = vars[`clr-${fam}-text`] ?? base[`clr-${fam}-text`];
      const accent = vars[`clr-${fam}`] ?? base[`clr-${fam}`];
      if (!text || !text.startsWith('#') || !accent?.startsWith('#')) continue;
      const against = [...surfaces, mix(accent, base['clr-surface']), mix(accent, base['clr-surface-2'])];
      const min = Math.min(...against.map(s => R(text, s)));
      if (min < 4.5) { console.log(`✗ ${sel}  --clr-${fam}-text: ${text}  min ${min.toFixed(2)}`); bad++; }
    }
  }
}
// The -soft tints are used as BACKGROUNDS with text on them (badges,
// callouts, the "อิงแนวเดิม" chip). In light they are pale and ink sits
// happily; in DARK they invert to deep shades, and dark gold-soft left
// --clr-ink at 4.03 while --clr-ink-soft was 2.15 on it. Checked here
// because the browser sweep only meets these chips on the questions that
// happen to carry them — it took fifteen samples to see one.
for (const theme of ['light','dark']) {
  const base = BASE[theme];
  for (const fam of FAMS) {
    const soft = base[`clr-${fam}-soft`];
    if (!soft?.startsWith('#')) continue;
    const r = R(base['clr-ink'], soft);
    if (r < 4.5) { console.log(`✗ ${theme}  --clr-ink on --clr-${fam}-soft (${soft})  ${r.toFixed(2)}`); bad++; }
  }
}

if (bad) {
  console.error(`\n❌ ${bad} token(s) below 4.5 on some surface they can land on.`);
  console.error('   node scripts/derive-accent-roles.mjs prints replacements.');
  process.exit(1);
}
console.log('✅ Accent tokens clear 4.5: text on every surface (tinted included), ink on every -soft tint.');
