// ============================================================
// media-redirects.test.mjs — a question picture that moved still answers at its old address
// ============================================================
// A set parked on a device keeps its questions whole, each with the address of
// its figure (App.jsx writes them, useExamSession.js primeFromSaved reads them
// back as they are), and nothing ends that copy: it is resumed whenever the
// student returns. Release 5.203.0 re-encoded 20 question pictures under a new
// extension, renamed 7 of them away from their answers and pointed 6 questions
// at a file they now share, so 28 addresses stopped existing. A set parked
// before the deploy would have shown "ภาพประกอบโหลดไม่ได้" for each.
//
// vercel.json redirects every old address to the picture's new one. These
// tests hold the table: nothing it sends a browser to may be missing.
// ============================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const VERCEL = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const REGISTRY = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/media-registry.generated.json'), 'utf8'));

const onDisk = (sitePath) => {
  const abs = path.join(ROOT, 'public', sitePath);
  return fs.existsSync(abs) && fs.statSync(abs).isFile();
};
const isPicture = (r) => typeof r.source === 'string' && /^\/(images|figures)\//.test(r.source);
const pictureRedirects = VERCEL.redirects.filter(isPicture);

// Every question picture release 5.203.0 removed or renamed, as
// `git diff --name-status -M50 <its base> -- public/images public/figures/questions` listed them.
const MOVED_IN_5_203_0 = [
  // one picture four questions shared under four names
  '/figures/questions/equine-medicine-209596.webp',
  '/figures/questions/equine-medicine-209597.webp',
  '/figures/questions/equine-medicine-209598.webp',
  '/figures/questions/milk-meat-hygiene-212015.webp',
  '/figures/questions/milk-meat-hygiene-212016.webp',
  '/figures/questions/milk-meat-hygiene-212017.webp',
  // named after their answers
  '/figures/questions/eqmed-intro-face-star.webp',
  '/figures/questions/eqmed-dent-buccal-ulcer.webp',
  '/images/repro-us/q4-ceh.png',
  '/images/repro-us/q5-bloodvessel.png',
  '/images/repro-us/q6-fluid.png',
  '/images/repro-us/q7-estrus.png',
  '/images/repro-us/q10-hydrocephalus.png',
  // re-encoded as WebP under the same name
  '/images/practrum/dystocia/grid-A-L.png',
  '/images/vca-2569/p3-111-prolapse-tools.jpg',
  '/images/vca-super/dogcat-p06-125-2.png',
  '/images/vca-super/dogcat-p24-43.png',
  '/images/vca-super/dogcat-p25-34.png',
  '/images/vca-super/dogcat-p25-41.png',
  '/images/vca-super/dogcat-p25-84.png',
  '/images/vca-super/dogcat-p26-5.png',
  '/images/vca-super/dogcat-p26-9.png',
  '/images/vca-super/dogcat-p48-27.png',
  '/images/vca-super/dogcat-p49-14.png',
  '/images/vca-super/equine-p15-3.png',
  '/images/vca-super/exotic-p03-118.png',
  '/images/vca-super/exotic-p07-88.png',
  '/images/vca-super/swine-p13-46.png',
];

test('every question picture 5.203.0 moved is redirected to where it went', () => {
  assert.equal(new Set(MOVED_IN_5_203_0).size, 28);
  const bySource = new Map(pictureRedirects.map((r) => [r.source, r]));
  for (const old of MOVED_IN_5_203_0) {
    assert.equal(onDisk(old), false, `${old} is back on disk: drop its redirect, which would hide the file`);
    const rule = bySource.get(old);
    assert.ok(rule, `${old} was removed and nothing redirects it; a parked set still asks for it`);
    assert.ok(onDisk(rule.destination), `${old} is sent to ${rule.destination}, which is not under public/`);
  }
  // The answers' names are gone from the new addresses too.
  assert.equal(bySource.get('/images/repro-us/q7-estrus.png').destination, '/images/repro-us/q7.webp');
  assert.equal(bySource.get('/figures/questions/equine-medicine-209598.webp').destination, '/figures/questions/equine-medicine-209595.webp');
});

test('a picture redirect is temporary, one hop long, and ends at a picture a question shows', () => {
  assert.ok(pictureRedirects.length >= 28);
  const sources = new Set(pictureRedirects.map((r) => r.source));
  assert.equal(sources.size, pictureRedirects.length, 'one rule per old address');
  const shown = new Map(REGISTRY.media.map((m) => [m.path, m]));
  for (const r of pictureRedirects) {
    // A permanent redirect is cached by the browser for good; the old name may be used again.
    assert.equal(r.permanent, false, `${r.source} must not be a permanent redirect`);
    assert.deepEqual(Object.keys(r).sort(), ['destination', 'permanent', 'source'], `${r.source} has no condition`);
    assert.doesNotMatch(r.source, /[:*()?+{}\\]/, `${r.source} is a literal path, not a pattern`);
    assert.equal(onDisk(r.source), false, `${r.source} exists: its redirect would hide the file`);
    assert.ok(onDisk(r.destination), `${r.source} is sent to ${r.destination}, which is not under public/`);
    assert.equal(sources.has(r.destination), false, `${r.source} is sent to another old address`);
    assert.equal(shown.get(r.destination)?.kind, 'question', `${r.destination} is not a question picture in the registry`);
  }
});

test('the picture redirects are read before the rule that moves the whole old host', () => {
  // Vercel takes the first rule that matches, and the host rule matches every path.
  const hostRule = VERCEL.redirects.findIndex((r) => r.has?.some((h) => h.type === 'host'));
  assert.ok(hostRule > 0);
  for (const r of pictureRedirects) assert.ok(VERCEL.redirects.indexOf(r) < hostRule, `${r.source} comes after the host rule`);
});
