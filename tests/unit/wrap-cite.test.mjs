// ============================================================
// Wrap-up citations: a cited clip minute opens the clip at that minute
// ============================================================
// The pieces: src/lib/wrap-cite.js splits a bullet's citation into clips (each
// with its minutes) and text; source-label.js's recordingMoments and
// momentHref already turn a minute into /app/videos?v=...&at=<second>.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { citeParts, shortSession } from '../../src/lib/wrap-cite.js';
import { momentHref, humanSource } from '../../src/lib/source-label.js';
import { wrapUpPapers, loadWrapUp } from '../../src/data/exam-wrapups.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// Two Swine final recordings: 2_2M9bEGpmE is the 1 Oct class, -Y30vybBkEI the 7 Oct one.
const COURSE = 'อายุรศาสตร์สุกร';

test('one clip cited in several pieces is one entry, its minutes in order and each once', () => {
  const parts = citeParts('2_2M9bEGpmE [8:39]; 2_2M9bEGpmE [5:28]; -Y30vybBkEI [46:06]; 2_2M9bEGpmE [8:39]', COURSE);
  assert.deepEqual(parts.map((p) => [p.kind, p.videoId, p.moments.map((m) => m.seconds)]), [
    ['clip', '2_2M9bEGpmE', [519, 328]],
    ['clip', '-Y30vybBkEI', [2766]],
  ]);
  assert.equal(parts[0].session, 'คลิป 1 ต.ค.');
  assert.equal(parts[1].moments[0].stamp, '46:06');
  assert.equal(momentHref(parts[1].moments[0]), '/app/videos?v=-Y30vybBkEI&at=2766');
});

test('the rest of a citation stays readable text, in the order it was written', () => {
  const parts = citeParts('-Y30vybBkEI [47:20]; เดค Swine Enteric Diseases หน้า 97', COURSE);
  assert.deepEqual(parts.map((p) => p.kind), ['clip', 'text']);
  assert.equal(parts[1].text, 'เดค Swine Enteric Diseases หน้า 97');
  // Text sharing a piece with a clip comes first, without its clip.
  const mixed = citeParts('TJ ข้อ 53 (บล็อก 6), 2_2M9bEGpmE [58:05], [60:41-61:42]', COURSE);
  assert.deepEqual(mixed.map((p) => p.kind), ['text', 'clip']);
  assert.equal(mixed[0].text, humanSource('TJ ข้อ 53 (บล็อก 6)'));
  assert.deepEqual(mixed[1].moments.map((m) => m.stamp), ['58:05', '60:41-61:42']);
});

test('no clip, an unknown recording or nothing at all: the citation reads as before', () => {
  assert.deepEqual(citeParts('ข้อสอบเก่า 209058, 209059'), [{ kind: 'text', text: 'ข้อสอบเก่า 209058, 209059' }]);
  assert.deepEqual(citeParts('ZZZZZZZZZZZ [1:00]'), [{ kind: 'text', text: 'ZZZZZZZZZZZ [1:00]' }]);
  assert.deepEqual(citeParts(''), []);
  assert.deepEqual(citeParts(undefined), []);
});

test('a clip of the page\'s own course is named by its date; any other keeps its name', () => {
  assert.equal(shortSession('คลิป อายุรศาสตร์สุกร (7 ต.ค.)', COURSE), 'คลิป 7 ต.ค.');
  assert.equal(shortSession('คลิป COM V (11 ก.พ.)', COURSE), 'คลิป COM V (11 ก.พ.)');
  assert.equal(shortSession('คาบ 1 (4 ส.ค.)', COURSE), 'คาบ 1 (4 ส.ค.)');
  assert.equal(shortSession('คลิป อายุรศาสตร์สุกร (7 ต.ค.)', ''), 'คลิป อายุรศาสตร์สุกร (7 ต.ค.)');
});

test('over every shipped wrap-up, every cited minute the helper can open becomes a link and none is lost', async () => {
  let links = 0;
  for (const { year, phase, subject } of wrapUpPapers()) {
    const d = await loadWrapUp(subject, year, phase);
    for (const g of d.groups) {
      for (const it of g.items) {
        for (const b of [...(it.emphasis || []), ...(it.examined || [])]) {
          if (!b.src) continue;
          const parts = citeParts(b.src);
          assert.ok(parts.length, `${subject}: "${b.src}" printed nothing`);
          for (const p of parts) {
            if (p.kind === 'clip') {
              assert.ok(p.moments.length);
              for (const m of p.moments) {
                assert.match(momentHref(m), /^\/app\/videos\?v=[0-9A-Za-z_-]{11}&at=\d+$/);
                links += 1;
              }
            } else {
              assert.ok(p.text.trim(), `${subject}: an empty text piece from "${b.src}"`);
            }
          }
        }
      }
    }
  }
  assert.ok(links > 500, `only ${links} clip minutes became links`);
});

test('the view links each minute through the helper, in a new tab', () => {
  const view = read('src/views/WrapUpView.jsx');
  assert.match(view, /import \{ citeParts \} from '\.\.\/lib\/wrap-cite\.js';/);
  assert.match(view, /href=\{momentHref\(m\)\}\s+target="_blank"\s+rel="noopener"/);
});
