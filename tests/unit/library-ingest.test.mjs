// The ingest's pure helpers. The Thai decoding is the one that would have
// quietly ruined the whole shelf: MyCourseVille returns filenames with the
// escapes already flattened to literal text, so "ตรี_Esophageal_2025.pdf"
// arrives as "u0e15u0e23u0e35_Esophageal_2025.pdf". Left alone, every
// Thai-named deck is unsearchable and untitled.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
import { publicationMetadata, repairMcvUrl, fetchMaterial } from '../../scripts/ingest-library.mjs';

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

// ── Display-string cleaning (the 2026-08-28 metadata repair pass) ─────────
// Every fixture below is lifted from the real dump: entities that shipped to
// production, the backslash that survived its own escape, the ELISA file
// whose display name was leaked listing HTML.

test('HTML entities in display names decode', async () => {
  const { cleanDisplayText } = await import('../../scripts/ingest-library.mjs');
  assert.equal(cleanDisplayText('Ca &amp; P Method'), 'Ca & P Method');
  assert.equal(cleanDisplayText('Lecture handout &quot;ANS&quot; (17)'), 'Lecture handout "ANS" (17)');
});

test('stray backslashes before Thai and slashes are dropped', async () => {
  const { cleanDisplayText } = await import('../../scripts/ingest-library.mjs');
  const BS = String.fromCharCode(92);
  assert.equal(cleanDisplayText(`PP ${BS}\u0e1c${BS}\u0e28.`), 'PP ผศ.');
  assert.equal(cleanDisplayText(`29${BS}/03${BS}/2023`), '29/03/2023');
  // a backslash anywhere else is content, not an escape artifact
  assert.equal(cleanDisplayText(`A${BS}B`), `A${BS}B`);
});

test('control characters collapse to a single space', async () => {
  const { cleanDisplayText } = await import('../../scripts/ingest-library.mjs');
  assert.equal(
    cleanDisplayText(`Radiographic quality${String.fromCharCode(11)}Technique errors`),
    'Radiographic quality Technique errors',
  );
});

test('leaked listing HTML is junk; a short real name is not', async () => {
  const { isJunkTitle } = await import('../../scripts/ingest-library.mjs');
  assert.equal(isJunkTitle('" title='), true);
  assert.equal(isJunkTitle('   '), true);
  assert.equal(isJunkTitle('BT'), false); // real file name in Herd Health
});

test('a junk title is salvaged from the upload URL basename', async () => {
  const { titleFromUrl } = await import('../../scripts/ingest-library.mjs');
  assert.equal(
    titleFromUrl('https://x/materials/lecture_4-838832-17872007545295.pdf'),
    'Lecture 4',
  );
  assert.equal(titleFromUrl('https://x/m/ELISA_2024-1050238-17319395035135.pdf'), 'ELISA 2024');
});

test("MyCourseVille's no-folder marker never becomes a description", async () => {
  const { folderLabel } = await import('../../scripts/ingest-library.mjs');
  assert.equal(folderLabel('_other'), null);
  assert.equal(folderLabel(''), null);
  assert.equal(folderLabel('Virology IV_avian viruses'), 'Virology IV_avian viruses');
});

test('publication metadata defaults to draft and requires real permission evidence', () => {
  assert.throws(() => publicationMetadata({}), /license missing/);
  assert.throws(
    () => publicationMetadata({ license: 'instructor-permission' }),
    /requires permissionEvidence/,
  );
  assert.throws(
    () => publicationMetadata({ license: 'Instructor-Permission', status: 'public' }),
    /requires permissionEvidence/,
  );
  assert.deepEqual(publicationMetadata({
    license: 'instructor-permission',
    permissionEvidence: 'Written approval on file 2026-08-20',
  }), {
    license: 'instructor-permission',
    permissionEvidence: 'Written approval on file 2026-08-20',
    status: 'draft',
  });
  assert.throws(
    () => publicationMetadata({ license: 'CC-BY-4.0', status: 'visible' }),
    /invalid library status/,
  );
  assert.throws(
    () => publicationMetadata({ license: 'all-rights-reserved', status: 'public' }),
    /unsupported library license/,
  );
  assert.throws(
    () => publicationMetadata({ license: 'copyrighted lecture deck', status: 'public' }),
    /unsupported library license/,
  );
});

test('local bulk ingest enforces the same rights gate during dry-run', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-local-ingest-'));
  try {
    const source = path.join(tmp, 'fixture.txt');
    const manifest = path.join(tmp, 'manifest.json');
    const rows = path.join(tmp, 'rows.json');
    fs.writeFileSync(source, 'fixture');
    fs.writeFileSync(manifest, JSON.stringify([{ path: source, title: 'Fixture' }]));

    assert.throws(() => execFileSync(process.execPath, [
      'scripts/ingest-local-docs.mjs',
      `--manifest=${manifest}`,
      `--rows-out=${rows}`,
      '--dry-run',
    ], { cwd: path.resolve('.'), stdio: 'pipe' }), /Command failed/);

    fs.writeFileSync(manifest, JSON.stringify([{
      path: source,
      title: 'Fixture',
      license: 'CC-BY-4.0',
    }]));
    execFileSync(process.execPath, [
      'scripts/ingest-local-docs.mjs',
      `--manifest=${manifest}`,
      `--rows-out=${rows}`,
      '--dry-run',
    ], { cwd: path.resolve('.'), stdio: 'pipe' });
    const [row] = JSON.parse(fs.readFileSync(rows, 'utf8'));
    assert.equal(row.license, 'CC-BY-4.0');
    assert.equal(row.status, 'draft');
    assert.equal(row.permission_evidence, null);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('course numbers resolve to curriculum subject ids, gen-ed keeps the number', async () => {
  const { subjectForCourse } = await import('../../scripts/mcv-manifest.mjs');
  assert.equal(subjectForCourse('3100403'), 'vet-juris');
  assert.equal(subjectForCourse('3103304.02'), 'animal-nutrition'); // section suffix
  assert.equal(subjectForCourse('5100101'), '5100101');             // Population and Development
  assert.equal(subjectForCourse('junk'), null);
});
