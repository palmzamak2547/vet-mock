import test from 'node:test';
import assert from 'node:assert/strict';
import { oklch, contrast, carangiform, tailBeatHz, stepSpring, smooth, wrapAngle, noise1, rng, bayer4, durationFor } from '../../src/ocean/math.js';

test('contrast of white on black is 21', () => {
  assert.equal(Math.round(contrast([1, 1, 1], [0, 0, 0])), 21);
});

test('palette tokens keep their measured contrast', () => {
  const dark = oklch(0.15, 0.036, 248);
  const light = oklch(0.977, 0.008, 85);
  assert.ok(contrast(oklch(0.95, 0.01, 230), dark) > 15, 'dark text');
  assert.ok(contrast(oklch(0.64, 0.024, 232), dark) >= 4.5, 'dark tertiary text passes AA');
  assert.ok(contrast(oklch(0.24, 0.03, 255), light) > 14, 'light text');
  assert.ok(contrast(oklch(0.53, 0.026, 255), light) >= 4.5, 'light tertiary text passes AA');
});

test('oklch stays inside sRGB', () => {
  for (const [L, C, h] of [[0.5, 0.4, 30], [0.98, 0.2, 120], [0.05, 0.1, 300]]) {
    for (const c of oklch(L, C, h)) assert.ok(c >= 0 && c <= 1);
  }
});

test('carangiform envelope: still head, tail at a tenth of a body length', () => {
  assert.ok(Math.abs(carangiform(1) - 0.1) < 1e-9);
  assert.ok(carangiform(0.25) < 0.011);
  assert.ok(carangiform(0) > carangiform(0.25));
});

test('tail beat follows speed with slip 0.7', () => {
  assert.ok(Math.abs(tailBeatHz(0.12, 1) - 0.12 / 0.7) < 1e-9);
});

test('spring integrator lands on target at 60 Hz, 120 Hz and through a hitch', () => {
  for (const dt of [1 / 60, 1 / 120, 0.1]) {
    const s = { x: 0, v: 0 };
    for (let t = 0; t < 3; t += dt) stepSpring(s, 1, 0.35, 0.82, dt);
    assert.ok(Math.abs(s.x - 1) < 1e-3, `dt ${dt}`);
  }
});

test('smoothing is frame-rate independent', () => {
  let a = 0;
  let b = 0;
  for (let i = 0; i < 60; i++) a += (1 - a) * smooth(1 / 60, 0.3);
  for (let i = 0; i < 120; i++) b += (1 - b) * smooth(1 / 120, 0.3);
  assert.ok(Math.abs(a - b) < 1e-9);
});

test('helpers stay in range', () => {
  for (let i = 0; i < 200; i++) {
    const a = wrapAngle(i * 1.7 - 50);
    assert.ok(a >= -Math.PI && a <= Math.PI);
    const n = noise1(i * 0.37, 11);
    assert.ok(n >= -1 && n <= 1);
  }
  const r = rng(5);
  const seen = new Set(Array.from({ length: 50 }, () => r()));
  assert.equal(seen.size, 50);
  const b = new Set();
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) b.add(bayer4(x, y));
  assert.equal(b.size, 16);
  assert.equal(durationFor(300), 250);
});
