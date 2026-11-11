// ============================================================
// media-registry.test.mjs — one registry of every picture, and what lint:media holds
// ============================================================
// Until 11 Nov 2026 nothing knew which pictures the app shows. A note section
// listed its deck's blue background three times as "figures" (292 template
// files, 9 groups), one picture sat on disk under up to four names, ten
// question images were PNG screenshots of photographs (245 to 756 KB each),
// seven figure files were named after their question's answer, and
// explainImage was checked by nothing. scripts/media-registry.mjs now records
// every picture and lint:media fails on each of those.
//
// The rules are exercised on a scratch folder of real images; the registry
// the repository ships is then read back against its two size modules.
// ============================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import {
  QUESTION_IMAGE_MAX_BYTES, SAME_BYTES_ALLOWED, buildRegistry, collectReferences, kindByFolder, lintMedia, nameLeak,
  questionSizesText, registryText, slideSizesText, sourceFiles, sourcePictures, toWebp,
} from '../../scripts/lib/media.mjs';
import { QUESTION_MEDIA_SIZES } from '../../src/data/media-sizes.generated.js';
import { SLIDE_IMAGE_SIZES, slideImageSize } from '../../src/data/slide-image-sizes.generated.js';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

let tmp;
let publicDir;
// A picture with texture, as a photograph has: each colour name seeds its own noise. A deck
// figure of one flat colour is a drawn shape and fails the lint (the test for that is below).
const picture = (w, h, colour) => {
  const data = Buffer.alloc(w * h * 3);
  let x = [...`${w}x${h}${colour}`].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  for (let i = 0; i < data.length; i++) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0;
    data[i] = 40 + ((x >>> 16) % 176);
  }
  return sharp(data, { raw: { width: w, height: h, channels: 3 } }).webp({ lossless: true }).toBuffer();
};
const flat = (w, h, colour) => sharp({ create: { width: w, height: h, channels: 3, background: colour } }).webp({ lossless: true }).toBuffer();
const put = (sitePath, bytes) => {
  const abs = path.join(publicDir, sitePath.slice(1));
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, bytes);
};

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'media-registry-'));
  publicDir = path.join(tmp, 'public');
  fs.mkdirSync(path.join(tmp, 'src', 'views'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'src', 'views', 'Landing.jsx'), 'export default () => <img src="/images/landing/shot.webp" alt="" />;\n');
  put('/figures/questions/q1.webp', await picture(40, 30, '#aa0000'));
  put('/figures/questions/q2.webp', await picture(64, 16, '#00aa00'));
  put('/images/set/a.webp', await picture(20, 50, '#0000aa'));
  put('/images/landing/shot.webp', await picture(80, 40, '#aaaa00'));
  put('/figures/vet-x/topic--one/p2-0.webp', await picture(30, 30, '#00aaaa'));
  put('/figures/vet-x/topic--one/p3-0.webp', await picture(32, 30, '#aa00aa'));
});
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const QUESTIONS = [
  { id: 1, subject: 's', type: 'mcq', q: 'stem', options: ['a', 'b'], answer: 0, image: '/figures/questions/q1.webp' },
  { id: 2, subject: 's', type: 'mcq', q: 'stem', options: ['a', 'b'], answer: 0, imagePath: '/images/set/a.webp', explainImage: '/figures/questions/q2.webp' },
  { id: 3, subject: 's', type: 'mcq', q: 'stem', options: ['a', 'b'], answer: 0, image: 'data:image/svg+xml;utf8,%3Csvg%3E%3C%2Fsvg%3E' },
];
const MAP = { 'vet-x--topic--one--a': ['/figures/vet-x/topic--one/p2-0.webp'], 'vet-x--topic--one--b': ['/figures/vet-x/topic--one/p2-0.webp', '/figures/vet-x/topic--one/p3-0.webp'] };
const build = (over = {}) => buildRegistry({ publicDir, root: tmp, questions: QUESTIONS, slideMap: MAP, ...over });
const lint = async (over = {}, opts = {}) => {
  const built = await build(over);
  return [...built.problems, ...lintMedia({ entries: built.entries, questions: over.questions || QUESTIONS, allowedSame: [], ...opts })];
};

test('each picture is recorded with its size, weight, hash, kind and what shows it', async () => {
  const built = await build();
  assert.deepEqual(await lint(), []);
  const byPath = Object.fromEntries(built.entries.map((e) => [e.path, e]));
  const q1 = byPath['/figures/questions/q1.webp'];
  assert.deepEqual([q1.kind, q1.width, q1.height], ['question', 40, 30]);
  assert.equal(q1.bytes, fs.statSync(path.join(publicDir, 'figures/questions/q1.webp')).size);
  assert.match(q1.sha256, /^[0-9a-f]{64}$/);
  assert.deepEqual(q1.usedBy, ['question:s:1:image']);
  assert.deepEqual(byPath['/figures/questions/q2.webp'].usedBy, ['question:s:2:explainImage'], 'an explanation figure is a question figure');
  assert.deepEqual(byPath['/images/set/a.webp'].usedBy, ['question:s:2:imagePath']);
  const slide = byPath['/figures/vet-x/topic--one/p2-0.webp'];
  assert.equal(slide.kind, 'slide');
  assert.deepEqual(slide.usedBy, ['note:vet-x--topic--one--a', 'note:vet-x--topic--one--b']);
  assert.equal(built.inline, 1, 'an inline figure is counted, not listed');

  const written = JSON.parse(registryText(built));
  assert.equal(written.media.length, 6);
  assert.deepEqual(written.totals.question, { files: 3, bytes: q1.bytes + byPath['/figures/questions/q2.webp'].bytes + byPath['/images/set/a.webp'].bytes, inline: 1 });
  assert.equal(written.media[0].hash, built.entries[0].sha256.slice(0, 16));
  assert.equal(registryText(built), registryText(await build()), 'two runs write the same bytes');
});

test('a picture a page names in its own source is recorded as that page\'s, not as unreferenced', async () => {
  const shot = (await build()).entries.find((e) => e.path === '/images/landing/shot.webp');
  assert.equal(shot.kind, 'page');
  assert.deepEqual(shot.usedBy, ['source:src/views/Landing.jsx']);
});

test('missing: a picture something shows that is not on disk fails, the explanation figure too', async () => {
  const gone = [...QUESTIONS, { id: 9, subject: 's', type: 'mcq', q: 'x', options: ['a', 'b'], answer: 0, explainImage: '/figures/questions/gone.webp' }];
  const errors = await lint({ questions: gone });
  assert.equal(errors.length, 1, errors.join('\n'));
  assert.match(errors[0], /^missing: \/figures\/questions\/gone\.webp is shown by question:s:9:explainImage/);
  const mapGone = await lint({ slideMap: { ...MAP, 'vet-x--topic--one--c': ['/figures/vet-x/topic--one/p9-0.webp'] } });
  assert.match(mapGone.join('\n'), /^missing: \/figures\/vet-x\/topic--one\/p9-0\.webp is shown by note:vet-x--topic--one--c/);
});

// A page's own picture was only ever looked up from the disk: a file nothing
// showed was searched for in src/. A path a page named that had no file was
// never looked at, so a renamed landing screenshot would have shipped broken.
test('missing: a picture a page names whole that is not on disk fails too', async () => {
  const file = path.join(tmp, 'src', 'views', 'Broken.jsx');
  fs.writeFileSync(file, [
    'export default () => <img src="/images/landing/gone.webp" alt="" />;',
    'const css = "background: url(/figures/questions/gone-too.png)";',
    'const own = \'https://vetmock.com/images/landing/gone-as-well.jpg\';',
    // None of these is a picture under public/: a path put together in code, another site's folder, a document.
    'const built = `/images/${set}/x.png`;',
    'const other = "https://example.org/th/images/logo.png";',
    'const paper = "/images/syllabus.pdf";',
    '',
  ].join('\n'));
  try {
    const errors = await lint();
    assert.deepEqual(errors.sort(), [
      'missing: /figures/questions/gone-too.png is shown by source:src/views/Broken.jsx and is not under public/',
      'missing: /images/landing/gone-as-well.jpg is shown by source:src/views/Broken.jsx and is not under public/',
      'missing: /images/landing/gone.webp is shown by source:src/views/Broken.jsx and is not under public/',
    ]);
    assert.deepEqual([...sourcePictures(tmp).keys()].sort(), ['/figures/questions/gone-too.png', '/images/landing/gone-as-well.jpg', '/images/landing/gone.webp', '/images/landing/shot.webp']);
  } finally {
    fs.rmSync(file);
  }
  assert.deepEqual(await lint(), []);
});

// "Unreferenced, delete it" was said of any file src/ did not name. The VCA
// site is built from this repository and the blog is plain HTML under public/.
test('a picture only the VCA site or a static page names is that page\'s, with its users in one order', async () => {
  const sources = {
    'vca/src/pages/Home.jsx': 'export default () => <img src="/images/shared/vca-only.webp" alt="" />;\n',
    'public/blog/post.html': '<img src="https://vetmock.com/images/shared/blog.webp" alt=""><img src="/images/shared/both.webp" alt="">\n',
    'src/views/Zed.jsx': 'export const zed = "/images/shared/both.webp";\n',
    'src/a/Alpha.jsx': 'export const alpha = "/images/shared/both.webp";\n',
    'vca/index.html': '<link rel="preload" as="image" href="/images/shared/both.webp">\n',
  };
  for (const [file, text] of Object.entries(sources)) {
    fs.mkdirSync(path.dirname(path.join(tmp, file)), { recursive: true });
    fs.writeFileSync(path.join(tmp, file), text);
  }
  for (const [i, name] of ['vca-only', 'blog', 'both'].entries()) put(`/images/shared/${name}.webp`, await picture(24, 30 + i, '#335577'));
  try {
    const built = await build();
    assert.deepEqual([...built.problems, ...lintMedia({ entries: built.entries, questions: QUESTIONS, allowedSame: [] })], []);
    const byPath = Object.fromEntries(built.entries.map((e) => [e.path, e]));
    assert.deepEqual([byPath['/images/shared/vca-only.webp'].kind, byPath['/images/shared/vca-only.webp'].usedBy], ['page', ['source:vca/src/pages/Home.jsx']]);
    assert.deepEqual(byPath['/images/shared/blog.webp'].usedBy, ['source:public/blog/post.html']);
    // By code unit, whatever order the folders were read in: the registry is the same file on Windows and on Linux.
    assert.deepEqual(byPath['/images/shared/both.webp'].usedBy, ['source:public/blog/post.html', 'source:src/a/Alpha.jsx', 'source:src/views/Zed.jsx', 'source:vca/index.html']);
    const files = sourceFiles(tmp);
    assert.deepEqual(files, [...files].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
    assert.deepEqual(files, ['public/blog/post.html', 'src/a/Alpha.jsx', 'src/views/Landing.jsx', 'src/views/Zed.jsx', 'vca/index.html', 'vca/src/pages/Home.jsx']);
  } finally {
    for (const file of Object.keys(sources)) fs.rmSync(path.join(tmp, file));
    fs.rmSync(path.join(publicDir, 'images/shared'), { recursive: true });
  }
  assert.deepEqual(await lint(), []);
});

test('unreferenced: a file in a governed folder that nothing shows fails', async () => {
  const errors = await lint({ questions: QUESTIONS.slice(0, 1) });
  assert.deepEqual(errors.map((e) => e.split(' ').slice(0, 2).join(' ')).sort(), ['unreferenced: /figures/questions/q2.webp', 'unreferenced: /images/set/a.webp']);
  const noMap = await lint({ slideMap: {} });
  assert.equal(noMap.filter((e) => e.startsWith('unreferenced: /figures/vet-x/')).length, 2);
});

test('same picture: byte-identical files of one kind fail, unless named with a reason', async () => {
  put('/figures/questions/q1-copy.webp', fs.readFileSync(path.join(publicDir, 'figures/questions/q1.webp')));
  // The same bytes as a deck figure too: another kind, so not a repeat of q1.
  put('/figures/vet-x/topic--one/p4-0.webp', fs.readFileSync(path.join(publicDir, 'figures/questions/q1.webp')));
  try {
    const questions = [...QUESTIONS, { id: 4, subject: 's', type: 'mcq', q: 'x', options: ['a', 'b'], answer: 0, image: '/figures/questions/q1-copy.webp' }];
    const slideMap = { ...MAP, 'vet-x--topic--one--c': ['/figures/vet-x/topic--one/p4-0.webp'] };
    const errors = await lint({ questions, slideMap });
    assert.equal(errors.length, 1, errors.join('\n'));
    assert.match(errors[0], /^same picture 2 times \(question\): \/figures\/questions\/q1-copy\.webp, \/figures\/questions\/q1\.webp/);

    const pair = ['/figures/questions/q1.webp', '/figures/questions/q1-copy.webp'];
    assert.deepEqual(await lint({ questions, slideMap }, { allowedSame: [{ paths: pair, reason: 'two papers print the same plate' }] }), []);
    const noReason = await lint({ questions, slideMap }, { allowedSame: [{ paths: pair, reason: ' ' }] });
    assert.match(noReason.join('\n'), /SAME_BYTES_ALLOWED: .* has no reason/);
  } finally {
    fs.rmSync(path.join(publicDir, 'figures/questions/q1-copy.webp'));
    fs.rmSync(path.join(publicDir, 'figures/vet-x/topic--one/p4-0.webp'));
  }
  const stale = await lint({}, { allowedSame: [{ paths: ['/figures/questions/q1.webp', '/figures/questions/q2.webp'], reason: 'once the same' }] });
  assert.match(stale.join('\n'), /SAME_BYTES_ALLOWED: .* are no longer the same bytes; remove the entry/);
  assert.deepEqual(SAME_BYTES_ALLOWED, [], 'the repository needs no exception today; adding one takes a reason');
});

test('too heavy: a question image over the limit fails, a deck figure of the same weight does not', async () => {
  const weight = fs.statSync(path.join(publicDir, 'images/set/a.webp')).size;
  const errors = await lint({}, { maxQuestionBytes: weight - 1 });
  assert.ok(errors.some((e) => /^too heavy: \/images\/set\/a\.webp/.test(e)), errors.join('\n'));
  assert.ok(errors.every((e) => !e.includes('/figures/vet-x/')), 'the limit is for question images');
  assert.deepEqual(await lint({}, { maxQuestionBytes: 1024 * 1024 }), []);
});

// scripts/media-to-webp.mjs encoded the stored pixels and dropped the EXIF
// orientation: a phone photograph stored on its side would have come out lying
// down. None of the 20 pictures converted on 11 Nov 2026 carried one.
test('a photograph stored on its side is re-encoded upright, at the size a browser shows it', async () => {
  // 60x20 as stored, red on the left and blue on the right, tagged "turn a quarter clockwise to show":
  // a browser draws it 20x60 with the red end on top.
  const red = await sharp({ create: { width: 30, height: 20, channels: 3, background: '#ff0000' } }).png().toBuffer();
  const stored = await sharp({ create: { width: 60, height: 20, channels: 3, background: '#0000ff' } })
    .composite([{ input: red, left: 0, top: 0 }]).withMetadata({ orientation: 6 }).jpeg({ quality: 95 }).toBuffer();
  assert.equal((await sharp(stored).metadata()).orientation, 6);
  const { webp, shown, orientation, decoded } = await toWebp(stored);
  assert.equal(orientation, 6);
  assert.deepEqual(shown, { width: 20, height: 60 });
  assert.deepEqual(decoded, { width: 20, height: 60, orientation: 1 }, 'the pixels are turned and the tag is gone');
  const { data, info } = await sharp(webp).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const at = (x, y) => [...data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3)];
  const [topR, , topB] = at(10, 5);
  const [bottomR, , bottomB] = at(10, 55);
  assert.ok(topR > 180 && topB < 80, `the top is the red end: ${at(10, 5)}`);
  assert.ok(bottomB > 180 && bottomR < 80, `the bottom is the blue end: ${at(10, 55)}`);

  // An upright picture keeps its size.
  const plain = await toWebp(await sharp({ create: { width: 60, height: 20, channels: 3, background: '#0000ff' } }).png().toBuffer());
  assert.deepEqual([plain.orientation, plain.shown, plain.decoded], [1, { width: 60, height: 20 }, { width: 60, height: 20, orientation: 1 }]);
  // The script goes through this function and prints the redirect a moved picture needs.
  const script = fs.readFileSync(path.join(ROOT, 'scripts/media-to-webp.mjs'), 'utf8');
  assert.match(script, /await toWebp\(source, \{ quality: QUALITY \}\)/);
  assert.match(script, /"redirects" in vercel\.json/);
});

// 77 "figures" under the Year-2 notes were shapes a slide draws: 54 dark backdrops, arrows,
// triangles, gradient bars. scripts/lib/slide-figure-shape.mjs reads it from the pixels.
test('not a figure: a deck figure whose pixels are a drawn shape fails, a question figure does not', async () => {
  // A dark backdrop: #333333 on #000000, as 54 of them were.
  const w = 120;
  const h = 90;
  const data = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data.fill(x > 8 && x < w - 8 && y > 8 && y < h - 8 ? 0x33 : 0, (y * w + x) * 3, (y * w + x) * 3 + 3);
  const backdrop = await sharp(data, { raw: { width: w, height: h, channels: 3 } }).webp({ lossless: true }).toBuffer();
  put('/figures/vet-x/topic--one/p5-0.webp', backdrop);
  put('/figures/vet-x/topic--one/p6-0.webp', await flat(60, 40, '#2244aa'));
  put('/figures/questions/q8.webp', await flat(60, 41, '#2244aa'));
  try {
    const slideMap = { ...MAP, 'vet-x--topic--one--c': ['/figures/vet-x/topic--one/p5-0.webp', '/figures/vet-x/topic--one/p6-0.webp'] };
    const questions = [...QUESTIONS, { id: 8, subject: 's', type: 'mcq', q: 'x', options: ['a', 'b'], answer: 0, image: '/figures/questions/q8.webp' }];
    const errors = await lint({ slideMap, questions });
    assert.equal(errors.length, 2, errors.join('\n'));
    assert.match(errors[0], /^not a figure: \/figures\/vet-x\/topic--one\/p5-0\.webp is a flat mask: 2 colours, 100\.0% in three tones, 100\.0% in two exact colours, a shape a slide draws; node scripts\/extract-slide-figures\.mjs --clean --write removes it/);
    assert.match(errors[1], /^not a figure: \/figures\/vet-x\/topic--one\/p6-0\.webp is one flat colour/);
    // A real figure that measures as a shape is named in KEEP_FLAT, and then it is not read.
    const kept = await lint({ slideMap, questions, keepFlat: ['/figures/vet-x/topic--one/p5-0.webp', '/figures/vet-x/topic--one/p6-0.webp'] });
    assert.deepEqual(kept, []);
  } finally {
    for (const p of ['figures/vet-x/topic--one/p5-0.webp', 'figures/vet-x/topic--one/p6-0.webp', 'figures/questions/q8.webp']) fs.rmSync(path.join(publicDir, p));
  }
});

test('not an image, wrong folder and two kinds each fail', async () => {
  put('/figures/questions/notes.txt', 'not a picture');
  try {
    assert.match((await lint()).join('\n'), /^not an image: \/figures\/questions\/notes\.txt/);
  } finally {
    fs.rmSync(path.join(publicDir, 'figures/questions/notes.txt'));
  }
  const borrowed = [...QUESTIONS, { id: 5, subject: 's', type: 'mcq', q: 'x', options: ['a', 'b'], answer: 0, image: '/figures/vet-x/topic--one/p3-0.webp' }];
  assert.match((await lint({ questions: borrowed })).join('\n'), /^two kinds: \/figures\/vet-x\/topic--one\/p3-0\.webp/m);
  const onlyTheQuestion = { 'vet-x--topic--one--a': ['/figures/vet-x/topic--one/p2-0.webp'] };
  assert.match((await lint({ questions: borrowed, slideMap: onlyTheQuestion })).join('\n'), /^wrong folder: \/figures\/vet-x\/topic--one\/p3-0\.webp is a question figure/m);
  const misplaced = { ...MAP, 'vet-x--topic--one--c': ['/images/set/a.webp'] };
  assert.match((await lint({ slideMap: misplaced })).join('\n'), /^two kinds: \/images\/set\/a\.webp/m);
  const remote = [...QUESTIONS, { id: 6, subject: 's', type: 'mcq', q: 'x', options: ['a', 'b'], answer: 0, explainImage: 'https://example.com/x.png' }];
  assert.match((await lint({ questions: remote })).join('\n'), /s:6: explainImage is neither a path under public\/ nor an inline image/);
  const twice = collectReferences({ slideMap: { sec: ['/figures/vet-x/topic--one/p2-0.webp', '/figures/vet-x/topic--one/p2-0.webp'] } });
  assert.deepEqual(twice.problems, ['note section sec: lists /figures/vet-x/topic--one/p2-0.webp twice']);
});

test('the folders decide the kind', () => {
  assert.equal(kindByFolder('/figures/questions/q1.webp'), 'question');
  assert.equal(kindByFolder('/images/vca-super/x.jpg'), 'question');
  assert.equal(kindByFolder('/figures/vet-histo/histo--avian/p3-0.webp'), 'slide');
  assert.equal(kindByFolder('/figures/stray.webp'), null);
  assert.equal(kindByFolder('/art/cover.webp'), null);
});

// ── A file name that names the key ────────────────────────────────────
const mcq = (q, options, answer) => ({ id: 1, subject: 'repro-lect', type: 'mcq', q, options, answer });

test('a figure file named after its question\'s key is caught: the seven names found on 11 Nov 2026', () => {
  const cases = [
    [mcq('ภาพอัลตร้าซาวด์ uterus แปลผลคือ', ['CEH (cystic hyperplasia)', 'Normal uterus in estrus', 'Active uterine bleeding', 'Postpartum metritis'], 0), '/images/repro-us/q4-ceh.png', ['ceh']],
    [mcq('อวัยวะที่ติดสีเป็นอวัยวะใด', ['Splenic tail', 'Blood vessel', 'Uterus', 'Colon'], 1), '/images/repro-us/q5-bloodvessel.png', ['blood', 'vessel']],
    [mcq('แปลผลจากภาพ คือ', ['Septic pyometra', 'Cystic mucometra', 'Tubular hydrometra', 'Fluid-filled uterus'], 3), '/images/repro-us/q6-fluid.png', ['fluid']],
    [mcq('บ่งชี้ระยะใด', ['Ovaritis', 'Ovarian neoplasia', 'Anestrus stage', 'Estrus stage'], 3), '/images/repro-us/q7-estrus.png', ['estrus']],
    [mcq('ภาพนี้แปลผลว่า', ['Normal brain', 'ventriculomegaly (hydrocephalus)', 'Cerebellar hypoplasia', 'Meningioma'], 1), '/images/repro-us/q10-hydrocephalus.png', ['hydrocephalus']],
    [mcq('เครื่องหมายสีขาวบนหน้าผากม้าในภาพเรียกว่า', ['Blaze', 'Snip', 'Star', 'Stripe'], 2), '/figures/questions/eqmed-intro-face-star.webp', ['star']],
    [mcq('รอยโรคในภาพคือ', ['แผลหลุมที่เยื่อบุกระพุ้งแก้ม (buccal ulceration)', 'ฟันผุ (caries)', 'เหงือกอักเสบ (gingivitis)', 'ฟันเกิน (polyodontia)'], 0), '/figures/questions/eqmed-dent-buccal-ulcer.webp', ['buccal']],
  ];
  for (const [q, file, words] of cases) assert.deepEqual(nameLeak(q, file).sort(), [...words].sort(), file);
});

test('a neutral name, a word the stem already says and a word every option shares are not leaks', () => {
  const estrus = mcq('บ่งชี้ระยะใด', ['Ovaritis', 'Ovarian neoplasia', 'Anestrus stage', 'Estrus stage'], 3);
  assert.deepEqual(nameLeak(estrus, '/images/repro-us/q7.webp'), []);
  assert.deepEqual(nameLeak(estrus, '/figures/questions/q52020.webp'), []);
  assert.deepEqual(nameLeak(mcq('ระยะ estrus ในภาพมี follicle ขนาดเท่าใด', ['Estrus 1 cm', 'Estrus 2 cm'], 0), '/images/repro-us/estrus.webp'), [], 'the stem says it');
  assert.deepEqual(nameLeak(mcq('ภาพนี้คือ', ['Triadan 108', 'Triadan 208'], 0), '/figures/questions/eqmed-dent-triadan-chart.webp'), [], 'both options say it');
  assert.deepEqual(nameLeak({ id: 2, subject: 's', type: 'tf', q: 'x', answer: true, explain: 'Estrus.' }, '/images/repro-us/estrus.webp'), [], 'a statement has no option to name');
});

test('lint:media reports the leaking name beside the question that shows it', async () => {
  put('/images/set/q7-estrus.webp', await picture(21, 50, '#123456'));
  try {
    const questions = [...QUESTIONS, { ...mcq('บ่งชี้ระยะใด', ['Ovaritis', 'Ovarian neoplasia', 'Anestrus stage', 'Estrus stage'], 3), id: 7, imagePath: '/images/set/q7-estrus.webp' }];
    const errors = await lint({ questions });
    assert.equal(errors.length, 1, errors.join('\n'));
    assert.match(errors[0], /^file name gives the answer: \/images\/set\/q7-estrus\.webp is shown above repro-lect:7 and names its key \(estrus\)/);
  } finally {
    fs.rmSync(path.join(publicDir, 'images/set/q7-estrus.webp'));
  }
});

// ── What the repository ships ────────────────────────────────────────
const SHIPPED = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/media-registry.generated.json'), 'utf8'));

test('the shipped registry lists every figure the banks and the slide map show, each on disk', async () => {
  const questions = [];
  for (const bank of BANK_REGISTRY) for (const q of await bank.load()) questions.push(q);
  const { refs } = collectReferences({ questions, slideMap: SLIDE_IMAGES });
  const listed = new Map(SHIPPED.media.map((m) => [m.path, m]));
  for (const [p, ref] of refs) {
    assert.ok(listed.has(p), `${p} is shown and not in the registry; run npm run regen:media`);
    assert.deepEqual(listed.get(p).usedBy, [...ref.usedBy].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)), `${p}: usedBy`);
  }
  for (const m of SHIPPED.media) {
    assert.ok(m.width > 0 && m.height > 0 && m.bytes > 0 && /^[0-9a-f]{16}$/.test(m.hash), `${m.path} is measured`);
    assert.ok(m.usedBy.length > 0, `${m.path} names what shows it`);
    assert.equal(fs.statSync(path.join(ROOT, 'public', m.path.slice(1))).size, m.bytes, `${m.path}: bytes on disk`);
  }
  const kinds = Object.fromEntries(['question', 'slide', 'page'].map((k) => [k, SHIPPED.media.filter((m) => m.kind === k)]));
  assert.equal(SHIPPED.totals.question.files, kinds.question.length);
  assert.equal(SHIPPED.totals.slide.files, kinds.slide.length);
  assert.equal(SHIPPED.totals.slide.bytes, kinds.slide.reduce((n, m) => n + m.bytes, 0));
  assert.ok(kinds.question.length >= 100 && kinds.slide.length >= 1500, 'both kinds are there');
});

test('no shipped question image is over the limit, and the limit is the one the registry prints', () => {
  assert.equal(SHIPPED.limits.questionImageBytes, QUESTION_IMAGE_MAX_BYTES);
  const heavy = SHIPPED.media.filter((m) => m.kind === 'question' && m.bytes > QUESTION_IMAGE_MAX_BYTES);
  assert.deepEqual(heavy.map((m) => m.path), []);
});

test('the two size modules say what the registry says, for every figure', () => {
  const questions = SHIPPED.media.filter((m) => m.kind === 'question');
  assert.deepEqual(Object.keys(QUESTION_MEDIA_SIZES).sort(), questions.map((m) => m.path).sort());
  for (const m of questions) assert.deepEqual(QUESTION_MEDIA_SIZES[m.path], [m.width, m.height], m.path);

  const slides = SHIPPED.media.filter((m) => m.kind === 'slide');
  assert.equal(Object.values(SLIDE_IMAGE_SIZES).reduce((n, deck) => n + Object.keys(deck).length, 0), slides.length);
  for (const m of slides) assert.deepEqual(slideImageSize(m.path), [m.width, m.height], m.path);
  assert.equal(slideImageSize('/figures/vet-histo/histo--avian/p999-9.webp'), null);
  assert.equal(slideImageSize('/figures/no-such-deck/topic/p1-0.webp'), null);
});

test('the generated texts are pure functions of the entries', async () => {
  const built = await build();
  assert.match(questionSizesText(built), /"\/figures\/questions\/q1\.webp": \[40, 30\],/);
  assert.doesNotMatch(questionSizesText(built), /landing|vet-x/, 'only question figures reach the card');
  assert.match(slideSizesText(built), /"vet-x\/topic--one": \{"p2-0\.webp":\[30,30\],"p3-0\.webp":\[32,30\]\},/);
});
