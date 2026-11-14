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
import { momentHref, humanSource, questionPointerLabel } from '../../src/lib/source-label.js';
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
  assert.equal(parts[1].text, 'สไลด์ Swine Enteric Diseases หน้า 97', 'one word for a slide, as the legend and the deck say');
  // Text sharing a piece with a clip comes first, without its clip.
  const mixed = citeParts('TJ ข้อ 53 (บล็อก 6), 2_2M9bEGpmE [58:05], [60:41-61:42]', COURSE);
  assert.deepEqual(mixed.map((p) => p.kind), ['text', 'clip']);
  assert.equal(mixed[0].text, humanSource('TJ ข้อ 53 (บล็อก 6)'));
  assert.deepEqual(mixed[1].moments.map((m) => m.stamp), ['58:05', '60:41-61:42']);
});

test('no clip, an unknown recording or nothing at all: the citation reads as before', () => {
  assert.deepEqual(citeParts('ZZZZZZZZZZZ [1:00]'), [{ kind: 'text', text: 'ZZZZZZZZZZZ [1:00]' }]);
  assert.deepEqual(citeParts(''), []);
  assert.deepEqual(citeParts(undefined), []);
});

test('a cited question is a pointer part, never its bare id as text', () => {
  assert.deepEqual(citeParts('ข้อสอบเก่า 209058, 209059'), [{ kind: 'question', pointer: { kind: 'past', ids: ['209058', '209059'], remarks: [] } }]);
  const mixed = citeParts('เดค Swine Enteric Diseases หน้า 80; ข้อฝึกในคลัง 209163 และ 209165 (ข้อเขียน)');
  assert.deepEqual(mixed.map((p) => p.kind), ['text', 'question']);
  assert.deepEqual(mixed[1].pointer, { kind: 'practice', ids: ['209163', '209165'], remarks: ['ข้อเขียน'] });
  const around = citeParts('TJ ข้อ 7 และ แนวข้อสอบ 105579 ในหัวข้อนี้');
  assert.deepEqual(around.map((p) => p.kind), ['text', 'question', 'text']);
  assert.equal(around[2].text, 'ในหัวข้อนี้');
});

test('the words for a cited question: its filed cohorts and paper, or the kind alone', () => {
  const past = { kind: 'past', ids: ['209058'], remarks: [] };
  assert.equal(questionPointerLabel(past, [{ cohort: 85, paper: 'final' }, { cohort: 78, paper: 'final' }, { cohort: 81, paper: 'final' }]), 'ข้อสอบเก่า Vet 78, 81, 85 ปลายภาค');
  assert.equal(questionPointerLabel(past, []), 'ข้อสอบเก่า', 'an id nobody filed reads as the kind, never the id');
  assert.equal(questionPointerLabel({ ...past, remarks: ['ปลายภาค Vet 78, Vet 81'] }, [{ cohort: 78, paper: 'final' }]), 'ข้อสอบเก่า Vet 78 ปลายภาค', 'a remark that repeats the filing goes');
  assert.equal(questionPointerLabel({ ...past, remarks: ['Vet 80'] }, []), 'ข้อสอบเก่า (Vet 80)', 'with nothing filed, the remark stays');
  assert.equal(questionPointerLabel({ kind: 'aligned', ids: ['1'], remarks: [] }, []), 'อิงแนวข้อสอบ');
  assert.equal(questionPointerLabel(past, [{ cohort: 84, paper: 'unknown' }]), 'ข้อสอบเก่า Vet 84');
});

test('over every shipped wrap-up, no citation prints a bare question id or the word เดค', async () => {
  const bare = /(ข้อสอบเก่า|แนวข้อสอบ|ข้อฝึกในคลัง)(\s*ปี\s*\d)?\s+\d{3,7}/;
  let pointers = 0;
  for (const { year, phase, subject } of wrapUpPapers()) {
    const d = await loadWrapUp(subject, year, phase);
    for (const g of d.groups) {
      for (const it of g.items) {
        for (const b of [...(it.emphasis || []), ...(it.examined || [])]) {
          for (const p of citeParts(b.src)) {
            if (p.kind === 'question') { pointers += 1; continue; }
            if (p.kind !== 'text') continue;
            assert.doesNotMatch(p.text, bare, `${subject}: "${b.src}"`);
            assert.doesNotMatch(p.text, /เดค/, `${subject}: "${b.src}"`);
          }
        }
      }
    }
  }
  assert.ok(pointers > 500, `only ${pointers} cited questions found`);
  // The same for what the page prints as text: an intro, a lecturer's note, a line, a pitfall.
  const { citedText } = await import('../../src/lib/wrap-cite.js');
  let inText = 0;
  for (const { year, phase, subject } of wrapUpPapers()) {
    const d = await loadWrapUp(subject, year, phase);
    const texts = [[d.intro, false], ...d.groups.flatMap((g) => [[g.formatNote, true], ...g.items.flatMap((it) => [
      [it.pitfall, false], ...[...(it.emphasis || []), ...(it.examined || [])].map((l) => [l.text, false]),
    ])])].filter(([t]) => typeof t === 'string');
    for (const [t, human] of texts) {
      for (const p of citedText(t, { human })) {
        if (p.kind === 'question') { inText += 1; continue; }
        assert.doesNotMatch(p.text, bare, `${subject}: "${t.slice(0, 80)}"`);
      }
    }
  }
  assert.ok(inText >= 10, `only ${inText} questions named inside text`);
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
            } else if (p.kind === 'question') {
              assert.ok(p.pointer.ids.length, `${subject}: a cited question with no id from "${b.src}"`);
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
  // The citation is drawn by components/WrapParts.jsx, for reading mode and the deck alike.
  const view = read('src/components/WrapParts.jsx');
  assert.match(read('src/views/WrapUpView.jsx'), /import \{ CitedText, Keywords, Line, SignalLabel, WrapCiteContext \} from '\.\.\/components\/WrapParts\.jsx';/);
  assert.match(view, /import \{ citeParts, citedText \} from '\.\.\/lib\/wrap-cite\.js';/);
  assert.match(view, /href=\{momentHref\(m\)\}\s+target="_blank"\s+rel="noopener"/);
});

test('the page reads สไลด์ where the authors wrote เดค, and the stored citations stay as written', async () => {
  const { readingCopy, slideWord } = await import('../../src/lib/wrap-cite.js');
  assert.equal(slideWord('ตามเดคหน้า 17'), 'ตามสไลด์หน้า 17');
  let checked = 0;
  for (const { year, phase, subject } of wrapUpPapers()) {
    const raw = await loadWrapUp(subject, year, phase);
    const shown = readingCopy(raw);
    const words = [shown.intro, ...shown.groups.flatMap((g) => [g.formatNote, ...g.items.flatMap((it) => [
      it.name, it.th, it.agent, it.pitfall, ...(it.keywords || []), ...[...(it.emphasis || []), ...(it.examined || [])].map((l) => l.text),
    ])])].filter((t) => typeof t === 'string');
    for (const t of words) assert.doesNotMatch(t, /เดค/, `${subject}: "${t.slice(0, 60)}"`);
    raw.groups.forEach((g, gi) => g.items.forEach((it, ii) => {
      const same = shown.groups[gi].items[ii];
      assert.equal(same.name, it.name, 'an item keeps its name, which the deck keys marks by');
      (it.emphasis || []).forEach((l, li) => assert.equal(same.emphasis[li].src, l.src));
    }));
    checked += words.length;
  }
  assert.ok(checked > 1000);
});

test('a run of questions named by its ends is labelled but offers nothing to open', async () => {
  const { questionPointers } = await import('../../src/lib/source-label.js');
  const [p] = questionPointers('(ข้อสอบเก่า 209058 ถึง 209064)');
  assert.deepEqual(p.ids, ['209058', '209064']);
  assert.equal(p.range, true);
  assert.equal(questionPointers('ข้อสอบเก่า 209058, 209059')[0].range, undefined);
  assert.match(read('src/components/WrapParts.jsx'), /openQuestion && !pointer\.range && pointer\.ids\.map/);
});
