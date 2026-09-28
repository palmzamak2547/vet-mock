// The front door as M2 methods ship [M2-DESIGN.md 11.5, 12.6, 12.8]: each chart row's status is the
// catalogue's (a family flips to "now" the day one of its methods registers), every status has words in
// both languages, links into the workspace start its download on press and focus (never on page load),
// the footer links the public pages, and both parts of the wordmark stay on a 320 px phone.
// OWNER: trust role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAMILIES, getCatalog, familyStatus } from '../../src/lib/runtime/catalog.js';
import { appLinkProps, servedByWorkspace } from '../../src/landing/shell/nav.js';
import { preloadWorkspace } from '../../src/preload.js';
import landing from '../../src/i18n/landing.js';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

test('a family reads "now" exactly when one of its methods ships, else its earliest planned release', () => {
  const catalog = getCatalog();
  for (const f of FAMILIES) {
    const rows = catalog.filter((m) => m.families.includes(f.id));
    const expected = rows.some((m) => m.shipped) ? 'now' : (['M1', 'M2', 'M3'].find((ms) => rows.some((m) => m.milestone === ms)) || 'later');
    assert.equal(familyStatus(f.id), expected, f.id);
  }
});

test('every status the chart can show has words in Thai and English, and the planned ones name their release', () => {
  for (const s of ['now', 'M1', 'M2', 'M3', 'later', 'loading']) {
    assert.ok(landing.th[`landing.papers.status.${s}`] && landing.en[`landing.papers.status.${s}`], s);
  }
  // "next release" would be wrong the day M2 ships; each planned status names its release by number.
  assert.match(landing.en['landing.papers.status.M2'], /second/);
  assert.match(landing.en['landing.papers.status.M3'], /third/);
  assert.match(landing.th['landing.papers.status.M2'], /รุ่นที่ 2/);
});

test('links into the workspace preload it on press and focus; public pages and the front door do not', () => {
  for (const p of ['/app', '/app/tools/sample-size', '/app/p/abc', '/licenses']) {
    assert.ok(servedByWorkspace(p), p);
    const props = appLinkProps(p);
    assert.equal(props.href, p);
    assert.equal(props.onPointerDown, preloadWorkspace);
    assert.equal(props.onFocus, preloadWorkspace);
  }
  for (const p of ['/', '/methods', '/guide', '/cite', '/application']) {
    assert.equal(servedByWorkspace(p), false, p);
    assert.equal(appLinkProps(p).onPointerDown, undefined, p);
  }
});

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test('no landing link into the workspace skips the preload, and the footer links the public pages', () => {
  const files = walk(here('../../src/landing')).filter((f) => f.endsWith('.jsx'));
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    assert.ok(!/href=["{`]+\/(app|licenses)/.test(src), `${path.basename(f)}: use appLinkProps for links into the workspace`);
    assert.ok(!/onClick=\{appLink\(/.test(src), `${path.basename(f)}: use appLinkProps`);
  }
  const footer = readFileSync(here('../../src/landing/shell/SiteFooter.jsx'), 'utf8');
  for (const p of ['/methods', '/guide', '/cite']) assert.ok(footer.includes(`appLinkProps('${p}')`), p);
  for (const k of ['methods', 'guide', 'cite']) assert.ok(landing.th[`landing.footer.${k}`] && landing.en[`landing.footer.${k}`], k);
});

test('both parts of the header wordmark stay visible on a phone (no rule hides the second word)', () => {
  const css = readFileSync(here('../../src/styles/landing.css'), 'utf8');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1], body: m[2] }));
  const hiding = rules.filter((r) => /\.rs-l-brand\s+\.rs-l-wordmark-sub/.test(r.sel) && /display:\s*none/.test(r.body));
  assert.deepEqual(hiding.map((r) => r.sel.trim()), []);
  assert.ok(rules.some((r) => /\.rs-l-brand\s+\.rs-l-wordmark-sub/.test(r.sel) && /font-size:\s*11px/.test(r.body)), 'a smaller size at 320 px');
});
