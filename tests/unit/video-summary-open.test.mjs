// ============================================================
// video-summary-open.test.mjs — the clip player and its shelf
// ============================================================
// อ่านสรุปคลิป used to do nothing at all when the summary could not be loaded.
// The per-subject chunk is a lazy import, and it fails offline or in a tab
// opened before a deploy that no longer serves the old hash. The loader caught
// that failure, then tried the other 31 chunks as well (which re-read the same
// cached rejection) and resolved null. The player set its summary to null, so
// no modal opened, no message showed, and the button came back as if the tap
// had never happened. The fallback that tells the student to reload was
// unreachable.
//
// These are the view's real loader and click handler, cut from the source and
// run under vm with the summary chunks under the test's control, the way the
// reader-race tests in this folder do it.
//
// The same file pins the player's copy: it spoke to the student as พี่, named
// localStorage, and paged with English controls.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const SRC = readFileSync(new URL('../../src/views/VideoView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

function cut(start, end) {
  const a = SRC.indexOf(start);
  assert.notEqual(a, -1, `VideoView must still contain ${JSON.stringify(start)}`);
  const b = SRC.indexOf(end, a);
  assert.notEqual(b, -1, `VideoView must still contain ${JSON.stringify(end)} after ${JSON.stringify(start)}`);
  return SRC.slice(a, b + end.length);
}

const LOADER = cut('async function loadVideoSummaryEntry', '\n}\n');
const HANDLER = cut('const handleOpenSummary = async () => {', '\n  };\n');

const META = {
  equineClip: {
    videoId: 'equineClip',
    title: 'Equine Medicine — colic',
    subject: 'equine-medicine',
    date: '2026-09-02',
    durationMin: 140,
    instructor: 'ผู้สอนม้า',
  },
};
const ENTRY = { ...META.equineClip, summary: '# colic\n\nเนื้อหาสรุป' };

// A player with one clip open. `subjectLoader` and `allLoader` stand in for
// the barrel's two loaders; the counters say which of them the view asked.
function player({ subjectLoader, allLoader, videoId = 'equineClip' }) {
  const calls = { subject: [], all: 0, opened: [], loading: [], warned: 0 };
  const ctx = {
    VIDEO_META: META,
    loadVideoSummariesForSubject: async (subject) => { calls.subject.push(subject); return subjectLoader(subject); },
    loadAllVideoSummaries: async () => { calls.all += 1; return allLoader(); },
    console: { warn() { calls.warned += 1; } },
    currentVideoId: videoId,
    summaryLoading: false,
    setSummaryLoading: (v) => calls.loading.push(v),
    setOpenSummary: (v) => calls.opened.push(v),
  };
  vm.createContext(ctx);
  const handleOpenSummary = vm.runInContext(`${LOADER}\n${HANDLER}\nhandleOpenSummary`, ctx);
  return { ctx, calls, handleOpenSummary, loadVideoSummaryEntry: ctx.loadVideoSummaryEntry };
}

const offline = () => { throw new Error('Failed to fetch dynamically imported module'); };

// SummaryModal's header line, exactly as it builds it.
const headerLine = (s) => `${s.subject?.toUpperCase()}, ${s.date}, ${s.durationMin} นาที`;

test('a summary chunk that fails to load rejects, and does not fetch the other 31', async () => {
  const p = player({ subjectLoader: offline, allLoader: () => ({ equineClip: ENTRY }) });
  await assert.rejects(p.loadVideoSummaryEntry('equineClip'), /dynamically imported module/);
  assert.deepEqual(p.calls.subject, ['equine-medicine']);
  assert.equal(p.calls.all, 0, 'the full set re-reads the same failed chunk and costs 31 more requests');
});

test('an entry filed under the wrong subject is still found in the full set', async () => {
  const p = player({ subjectLoader: () => ({ someOtherClip: {} }), allLoader: () => ({ equineClip: ENTRY }) });
  assert.equal(await p.loadVideoSummaryEntry('equineClip'), ENTRY);
  assert.equal(p.calls.all, 1);
});

test('the entry in its own subject opens without touching the full set', async () => {
  const p = player({ subjectLoader: () => ({ equineClip: ENTRY }), allLoader: () => { throw new Error('not needed'); } });
  await p.handleOpenSummary();
  assert.equal(p.calls.all, 0);
  assert.equal(p.calls.opened.length, 1);
  assert.equal(p.calls.opened[0], ENTRY, 'the real summary opens');
  assert.deepEqual(p.calls.loading, [true, false]);
});

test('a failed chunk opens the reload message instead of doing nothing', async () => {
  const p = player({ subjectLoader: offline, allLoader: offline });
  await p.handleOpenSummary();
  assert.equal(p.calls.opened.length, 1, 'the tap must open something');
  const shown = p.calls.opened[0];
  assert.ok(shown, 'setOpenSummary(null) renders nothing, which is the silent dead button');
  assert.match(shown.summary, /โหลดสรุปคลิปไม่สำเร็จ/);
  assert.match(shown.summary, /รีโหลด/);
  assert.equal(shown.videoId, 'equineClip');
  assert.equal(shown.title, META.equineClip.title);
  assert.deepEqual(p.calls.loading, [true, false], 'the button must come back');
});

test('a summary missing from every chunk also opens the message', async () => {
  const p = player({ subjectLoader: () => ({}), allLoader: () => ({}) });
  await p.handleOpenSummary();
  assert.equal(p.calls.opened.length, 1);
  assert.ok(p.calls.opened[0], 'a missing body must not be a silent null');
  assert.match(p.calls.opened[0].summary, /โหลดสรุปคลิปไม่สำเร็จ/);
});

test('the reload message keeps the clip header the metadata already has', async () => {
  const p = player({ subjectLoader: offline, allLoader: offline });
  await p.handleOpenSummary();
  const shown = p.calls.opened[0];
  assert.equal(shown.subject, 'equine-medicine');
  assert.equal(shown.date, '2026-09-02');
  assert.equal(shown.durationMin, 140);
  assert.equal(headerLine(shown), 'EQUINE-MEDICINE, 2026-09-02, 140 นาที');
  assert.doesNotMatch(headerLine(shown), /undefined|, ,/);
});

test('the reload is left to the student', () => {
  const handler = cut('const handleOpenSummary = async () => {', '\n  };\n');
  assert.doesNotMatch(handler, /location\.reload|reloadPage|window\.location/);
});

// ── the player's copy ────────────────────────────────────────────────

test('the player speaks Thai to the student and never names the storage API', () => {
  for (const gone of ['ของพี่', '(localStorage)', 'Disclaimer', '← Prev', 'Next →', 'Now playing', 'Copy link', 'ซ่อน list', 'ดู list', 'โหลด list', 'ไม่สามารถ embed', 'link ของ channel']) {
    assert.ok(!SRC.includes(gone), `VideoView still says ${JSON.stringify(gone)}`);
  }
  for (const said of [
    'หมายเหตุ:',
    'คลิปที่เพิ่มเองและประวัติการดูเก็บไว้ในเบราว์เซอร์เครื่องนี้เท่านั้น',
    '← ก่อนหน้า',
    'ถัดไป →',
    'กำลังเล่นคลิปที่ {currentIdx + 1}',
    'คัดลอกลิงก์',
    "'ซ่อนรายการ'",
    '`ดูรายการ (${playlistItems.length})`',
    'กำลังโหลดรายการ…',
    'คลิปนี้เล่นในแอปไม่ได้ เปิดใน YouTube แทน',
    'ลิงก์นี้เป็นช่อง YouTube เปิดใน YouTube เพื่อเลือกคลิป',
  ]) {
    assert.ok(SRC.includes(said), `VideoView should say ${JSON.stringify(said)}`);
  }
});

test('the paging buttons keep their Thai titles and their handlers', () => {
  assert.ok(/onClick=\{goPrev\} disabled=\{currentIdx <= 0\} title="ก่อนหน้า \(←\)"[^>]*>← ก่อนหน้า<\/button>/.test(SRC),
    'the previous-clip button lost its handler, its guard or its label');
  assert.ok(/onClick=\{goNext\} disabled=\{currentIdx < 0 \|\| currentIdx >= playlistItems\.length - 1\} title="ถัดไป \(→\)"[^>]*>ถัดไป →<\/button>/.test(SRC),
    'the next-clip button lost its handler, its guard or its label');
});
