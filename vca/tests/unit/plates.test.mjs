// The bookplates' smaller copies (scripts/make-plates.mjs, committed in public/art and listed in
// src/data/plates.js): every domain's print has them, they are what they say they are, and they come
// from the art as it is today. The build cannot make them (it runs where only this app's packages are
// installed), so a change to the art or the domain list that skips `npm run plates` fails here, not on
// the page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DOMAINS } from '../../src/data/domains.js';
import { PLATES } from '../../src/data/plates.js';
import { artSet } from '../../src/lib/art.js';
import { SUBJECT_COVERS } from '../../../src/data/subject-covers.js';
import { webpSize } from '../../scripts/webp-size.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ART = path.join(APP, 'public', 'art');
const REPO_PUBLIC = path.resolve(APP, '..', 'public');
const digest = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
const nameOf = (domain) => path.basename(SUBJECT_COVERS[domain.art].src, '.webp');
const sourceOf = (domain) => fs.readFileSync(path.join(REPO_PUBLIC, SUBJECT_COVERS[domain.art].src.replace(/^\//, '')));

test('every domain\'s plate has its copies listed, and nothing else is listed', () => {
  const names = DOMAINS.map(nameOf);
  for (const name of names) assert.ok(PLATES[name], `${name}: not in src/data/plates.js; run npm run plates`);
  assert.deepEqual(Object.keys(PLATES).sort(), [...new Set(names)].sort(), 'a plate that no domain draws is still being made');
});

test('the copies come from the art as it is now', () => {
  for (const d of DOMAINS) {
    const entry = PLATES[nameOf(d)];
    const source = sourceOf(d);
    assert.equal(entry.source, digest(source), `${d.id}: the art changed since its copies were made; run npm run plates`);
    assert.equal(webpSize(source).width, entry.width, `${d.id}: width`);
  }
});

test('each copy is a WebP of the width it is named for, smaller than the art, never an upscale', () => {
  for (const d of DOMAINS) {
    const name = nameOf(d);
    const entry = PLATES[name];
    assert.ok(entry.sizes.includes(224), `${name}: a 224 px copy for the walls and the exam page`);
    assert.deepEqual(entry.sizes, [...entry.sizes].sort((a, b) => a - b), `${name}: sizes in order`);
    const sourceBytes = sourceOf(d).length;
    for (const w of entry.sizes) {
      assert.ok(w < entry.width, `${name}: a ${w} px copy of ${entry.width} px art is an upscale`);
      const file = path.join(ART, String(w), `${name}.webp`);
      assert.ok(fs.existsSync(file), `${name}: public/art/${w}/${name}.webp is missing`);
      const bytes = fs.readFileSync(file);
      assert.deepEqual(webpSize(bytes), { width: w, height: w }, `${name}: ${w} px copy's size`);
      assert.ok(bytes.length < sourceBytes, `${name}: the ${w} px copy weighs more than the art`);
    }
    // A 448 px copy only where the art is larger than that: 418 px art is drawn as it is.
    assert.equal(entry.sizes.includes(448), entry.width > 448, `${name}: 448 px copy iff the art is wider`);
  }
});

test('the srcset offers every copy to the browser, widest last, and the art itself at its true width', () => {
  for (const d of DOMAINS) {
    const art = `/art/${path.basename(SUBJECT_COVERS[d.art].src)}`;
    const parts = artSet(art).split(', ').map((p) => p.split(' '));
    const widths = parts.map(([, w]) => Number(w.replace('w', '')));
    assert.deepEqual(widths, [...widths].sort((a, b) => a - b), `${d.id}: srcset in width order`);
    assert.equal(parts.at(-1)[0], art, `${d.id}: the art itself is the widest candidate`);
    assert.equal(widths.at(-1), webpSize(sourceOf(d)).width, `${d.id}: its true width`);
    for (const [url] of parts.slice(0, -1)) assert.ok(fs.existsSync(path.join(APP, 'public', url)), `${d.id}: ${url} is missing`);
  }
});

test('a print with no copies gets no srcset, not a broken one', () => {
  assert.equal(artSet('/art/not-a-plate.webp'), undefined);
  assert.equal(artSet('/somewhere/else.webp'), undefined);
  assert.equal(artSet(undefined), undefined);
});
