import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildManifest, inBundle } from '../../scripts/app-bundle-manifest.mjs';
import { parseTransform, svgToVector } from '../../mobile/scripts/svg-to-vector.mjs';

test('the Android app carries code and interface art, and fetches figures, models and pre-renders on demand', () => {
  for (const path of ['index.html', 'assets/index-abc.js', 'subject-art/com5.webp', 'motion/poses/happy.svg', 'fonts/x.woff2', 'Sarabun/OFL.txt']) {
    assert.equal(inBundle(path), true, path);
  }
  for (const path of ['figures/q1.webp', 'atlas/dog.glb', 'og/wiki-com5.png', 'wiki/com5/index.html', 'app/about/index.html', 'sw.js', 'sitemap.xml', '.vite/manifest.json']) {
    assert.equal(inBundle(path), false, path);
  }
});

test('the manifest lists each carried file with the SHA-256 the app checks, and the production CSP', () => {
  const dir = mkdtempSync(join(tmpdir(), 'vmx-bundle-'));
  try {
    mkdirSync(join(dir, 'assets'));
    mkdirSync(join(dir, 'figures'));
    writeFileSync(join(dir, 'index.html'), '<!doctype html>');
    writeFileSync(join(dir, 'assets', 'a.js'), 'export {}');
    writeFileSync(join(dir, 'figures', 'big.webp'), 'not carried');
    const csp = "default-src 'self'";
    const m = buildManifest(dir, { headers: [{ source: '/(.*)', headers: [{ key: 'Content-Security-Policy', value: csp }] }] });
    assert.deepEqual(m.files.map(([path]) => path), ['assets/a.js', 'index.html']);
    assert.equal(m.files[0][1], createHash('sha256').update('export {}').digest('base64url'));
    assert.equal(m.files[0][2], 9);
    assert.equal(m.csp, csp);
    assert.match(m.build, /^[0-9a-f]{16}$/);
    // Same files, same build id: the app recognises a build it already holds.
    assert.equal(buildManifest(dir, {}).build, m.build);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('Mochi and the paw become VectorDrawables with the same geometry', () => {
  assert.deepEqual(parseTransform('translate(0 -20.261) rotate(-1.026 256 285) scale(0.8)'), [
    { translateX: 0, translateY: -20.261 }, { rotation: -1.026, pivotX: 256, pivotY: 285 }, { scaleX: 0.8, scaleY: 0.8 },
  ]);
  const xml = svgToVector('<svg viewBox="0 0 512 512"><g opacity="0"><text>hidden</text></g><ellipse cx="10" cy="20" rx="5" ry="4" fill="#abc" opacity=".5"/></svg>');
  assert.match(xml, /android:pathData="M5,20a5,4 0 1,0 10,0a5,4 0 1,0 -10,0Z"/);
  assert.match(xml, /android:fillColor="#80AABBCC"/);
  assert.doesNotMatch(xml, /hidden/);
  assert.throws(() => svgToVector('<svg viewBox="0 0 512 512"><polygon points="0 0"/></svg>'), /unsupported element/);
});
