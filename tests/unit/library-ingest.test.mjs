// The ingest's pure helpers. The Thai decoding is the one that would have
// quietly ruined the whole shelf: MyCourseVille returns filenames with the
// escapes already flattened to literal text, so "ตรี_Esophageal_2025.pdf"
// arrives as "u0e15u0e23u0e35_Esophageal_2025.pdf". Left alone, every
// Thai-named deck is unsearchable and untitled.
import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeThaiEscapes, slugify, mimeFor, kindFor } from '../../scripts/ingest-library.mjs';

test('flattened Thai escapes are read back as Thai', () => {
  assert.equal(decodeThaiEscapes('u0e15u0e23u0e35_Esophageal_2025'), 'ตรี_Esophageal_2025');
  assert.equal(decodeThaiEscapes('u0e1b_u0e15u0e23u0e35_hernia_1'), 'ป_ตรี_hernia_1');
});

test('text with no escapes is returned untouched', () => {
  // The run has to be anchored to the u0exx shape — a filename containing
  // "u0e" as ordinary letters, or real Thai already decoded, must survive.
  assert.equal(decodeThaiEscapes('Cardiac_arrhythmia_2025.key'), 'Cardiac_arrhythmia_2025.key');
  assert.equal(decodeThaiEscapes('โรคหัวใจ 2025'), 'โรคหัวใจ 2025');
  assert.equal(decodeThaiEscapes(''), '');
  assert.equal(decodeThaiEscapes(null), '');
});

test('slugs are url-safe, bounded, and carry the content hash', () => {
  const s = slugify('Disorder of urinary tract', 'abcdef0123456789');
  assert.match(s, /^[a-z0-9-]+-abcdef$/);
  // Two files with the same title but different bytes must not collide —
  // the slug column is unique and a clash would drop the second file.
  assert.notEqual(slugify('Same title', 'aaaaaaaaaaaaaaaa'), slugify('Same title', 'bbbbbbbbbbbbbbbb'));
  // A title that is entirely punctuation still produces a usable slug.
  assert.match(slugify('***', '0123456789abcdef'), /^doc-012345$/);
});

test('a Thai title survives into the slug', () => {
  const s = slugify('u0e15u0e23u0e35_hernia', '0123456789abcdef');
  assert.ok(s.includes('ตรี'), `Thai should survive slugification, got ${s}`);
});

test('mime comes from the extension, with a safe fallback', () => {
  assert.equal(mimeFor('a/b/deck.pdf'), 'application/pdf');
  assert.equal(mimeFor('normal_dog.mp4'), 'video/mp4');
  assert.equal(mimeFor('notes.PPTX'), 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  assert.equal(mimeFor('mystery.qqq'), 'application/octet-stream');
});

test('kind is read from the folder as well as the filename', () => {
  assert.equal(kindFor('Lecture Slides', 'urinary.pdf'), 'slide');
  assert.equal(kindFor('Heart sounds', 'normal_dog.mp4'), 'other');
  assert.equal(kindFor('บรรยาย', 'x.pdf'), 'slide');
  assert.equal(kindFor('_other', 'ข้อสอบเก่า.pdf'), 'pastpaper');
  assert.equal(kindFor('Supplementary Materials', 'Orientation.pdf'), 'handout');
});

// ── the flattened URL ────────────────────────────────────────────────
// The same mangling that ruins a filename is FATAL in the URL: S3 answers
// 403 (not 404) for a key that does not exist, so it reads like a
// permissions problem, and every Thai-named file in the shelf fails
// silently. Confirmed against the live bucket: the URL as handed over
// returns 403 and the repaired one returns 200.
import { repairMcvUrl, fetchMaterial } from '../../scripts/ingest-library.mjs';

const MANGLED = 'https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/x/u0e15u0e23u0e35_Esophageal_2025-838816-1756.pdf';

test('a mangled Thai key is rebuilt as percent-encoded Thai', () => {
  const fixed = repairMcvUrl(MANGLED);
  assert.ok(fixed.includes('%E0%B8%95%E0%B8%A3%E0%B8%B5'), `expected encoded ตรี, got ${fixed}`);
  assert.ok(fixed.endsWith('.pdf'));
  assert.ok(fixed.startsWith('https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/x/'));
});

test('a URL that needs no repair returns null, so the original is used', () => {
  assert.equal(repairMcvUrl('https://mycourseville-default.s3.x/x/Cardiac_arrhythmia_2025.pdf'), null);
  assert.equal(repairMcvUrl(''), null);
  assert.equal(repairMcvUrl(null), null);
});

test('a query string survives the repair', () => {
  const fixed = repairMcvUrl(`${MANGLED}?X-Amz-Expires=60`);
  assert.ok(fixed.endsWith('?X-Amz-Expires=60'), fixed);
});

test('the original is tried first and the repair only on 403/404', async () => {
  const calls = [];
  const fake = async (u) => { calls.push(u); return { ok: true, status: 200 }; };
  await fetchMaterial(MANGLED, fake);
  assert.equal(calls.length, 1, 'a working URL must not be retried');

  calls.length = 0;
  const forbidden = async (u) => { calls.push(u); return { ok: calls.length > 1, status: calls.length > 1 ? 200 : 403 }; };
  const res = await fetchMaterial(MANGLED, forbidden);
  assert.equal(res.ok, true);
  assert.equal(calls.length, 2);
  assert.ok(calls[1].includes('%E0%B8%95'), 'the retry must use the repaired URL');
});

test('a 500 is not retried — that is not a mangled key', async () => {
  const calls = [];
  const boom = async (u) => { calls.push(u); return { ok: false, status: 500 }; };
  await fetchMaterial(MANGLED, boom);
  assert.equal(calls.length, 1);
});
