// The video library's generated files (scripts/video-registry.mjs): every
// record points at a channel with permission on file, a real subject and real
// topics, inside its own length; every card keeps the summary policy of
// docs/VIDEO-LIBRARY.md section 4 at the surface students read.

import test from 'node:test';
import assert from 'node:assert/strict';
import { VIDEO_REGISTRY } from '../../src/data/video-registry.generated.js';
import { VIDEO_CARD_LOADERS, VIDEO_INDEX } from '../../src/data/video-cards.generated.js';
import { VIDEO_TOPIC_INDEX } from '../../src/data/video-topic-index.generated.js';
import { VIDEO_CHANNELS } from '../../src/data/video-channels.js';
import { SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';
import { LIMITS, keyPointCap, thaiWords, voiceErrors, overlap, SELF_NAMING } from '../../src/lib/video-summary-check.js';
import { topicFits, displayTitle, tidyText, tidyHeading, chapterTitles, wholeHeading } from '../../scripts/video-registry.mjs';

const subjects = new Map(Object.values(SUBJECTS_BY_YEAR).flat().map((s) => [s.id, s]));
const topics = new Set([...subjects.values()].flatMap((s) => (s.topics || []).map((t) => t.id)));
const entries = Object.entries(VIDEO_REGISTRY);

test('every video names a channel with permission on file, a real subject and real topics', () => {
  assert.ok(entries.length > 0);
  for (const [id, v] of entries) {
    assert.match(id, /^[0-9A-Za-z_-]{11}$/);
    assert.ok(VIDEO_CHANNELS[v.channel]?.permission?.date, `${id}: channel ${v.channel} has no permission record`);
    assert.ok(subjects.has(v.subject), `${id}: unknown subject ${v.subject}`);
    assert.ok(v.durationSec > 0, `${id}: no length`);
    assert.match(v.date, /^\d{4}-\d{2}-\d{2}$/, `${id}: date`);
    for (const [topic, s, e, conf] of v.topics) {
      assert.ok(topics.has(topic), `${id}: unknown topic ${topic}`);
      assert.ok(s >= 0 && s < e && e <= v.durationSec + 1, `${id}: ${topic} ${s}-${e} outside ${v.durationSec} s`);
      assert.ok(['high', 'medium', 'ambiguous'].includes(conf), `${id}: confidence ${conf}`);
    }
  }
});

test('a topic stretch is published only as the session\'s own topic', () => {
  // The first batch's full check: each wrong stretch named a topic the title does not.
  assert.equal(topicFits('Porcine reproductive and respiratory syndrome', 'CSF supplement'), false);
  assert.equal(topicFits('Porcine reproductive and respiratory syndrome', 'ASF'), false);
  assert.equal(topicFits('Equine concept of surgery and anesthesia', 'Respiratory'), false);
  assert.equal(topicFits('Equine concept of surgery and anesthesia', 'POA equine'), false, 'a species word alone is no match');
  assert.equal(topicFits('Porcine reproductive and respiratory syndrome', 'Respiratory viral diseases in swine'), true);
  assert.equal(topicFits('Equine concept of surgery and anesthesia', 'Equine anesthesia'), true);
  assert.equal(topicFits('Anatomy function and clinical examination of stallion', 'Male reproductive organ functions'), true);
  // Batch 2: a course-wide word is no match (a triage lecture is not the CV emergency session).
  assert.equal(topicFits('Triage + Emergency anesthesia', 'คาบ 24, Respiratory & CV Emergency'), false);
  assert.equal(topicFits('Triage + Emergency anesthesia', 'คาบ 29, Triage'), true);
  // The lecturer's own set settles it, whatever the title says.
  assert.equal(topicFits('7.Endometritis in mare 1 Oct 69', 'Uterine defense', new Set(['eqrepro-defense']), 'eqrepro-defense'), true);
});

test('a session title loses its number and date, never its words', () => {
  assert.equal(displayTitle('8, 9 Anatomy function and clinical examination of stallion'), 'Anatomy function and clinical examination of stallion');
  assert.equal(displayTitle('7.Endometritis in mare 1 Oct 69'), 'Endometritis in mare');
  assert.equal(displayTitle('Mycoses'), 'Mycoses');
  // The review of #147: the second session's number, double spaces, and the uploader's cut word and slip.
  assert.equal(displayTitle('10.Semen collection and insemination  + 11.Infertility problem in stallion 15 Oct 69'), 'Semen collection and insemination + Infertility problem in stallion');
  assert.equal(displayTitle('2.Congen abnormal in male & 3. Congen abnormal in females 9 Jan 69'), 'Congen abnormal in male & Congen abnormal in females');
  assert.equal(displayTitle('7.Module 5 The Future Vet + Module 1 Diagnostic Tools in Veterinary Epidem 14 Sep 69'), 'Module 5 The Future Vet + Module 1 Diagnostic Tools in Veterinary Epidemiology');
  assert.equal(displayTitle('3.Eqine infectious disease and biosecurity  15 Oct 69'), 'Equine infectious disease and biosecurity');
});

test('a deck PDF\'s text layer reads as the deck printed it', () => {
  assert.equal(tidyText('ตอนที่ 1 ระบบการจ าแนกชนิดฟันของม้า'), 'ตอนที่ 1 ระบบการจำแนกชนิดฟันของม้า');
  assert.equal(tidyText('ความเข้มข้นของสารละลายในน ้า 2-4%'), 'ความเข้มข้นของสารละลายในน้ำ 2-4%');
  assert.equal(tidyText('ก๊าซฟอร์มัลดีไฮด์ท างานได้ดีที่ 20 oซ'), 'ก๊าซฟอร์มัลดีไฮด์ทำงานได้ดีที่ 20 °C');
  assert.equal(tidyText('RBC (1.94 x 106)'), 'RBC (1.94 × 10⁶)');
  assert.equal(tidyText('1 x 100 ml'), '1 x 100 ml');
});

test('chapter titles: spaced capitals read back, and a stretch without a slide heading is untitled', () => {
  const VOC = { one: 410, health: 431, series: 13, onehealth: 3, role: 6, veterinarian: 11, history: 9, issue: 10, thank: 35, prevention: 20 };
  const count = (w) => (/^\d+$/.test(w) || w === 'of' ? Infinity : VOC[w] || (w.endsWith('s') && VOC[w.slice(0, -1)]) || 0);
  assert.equal(tidyHeading('O N E H E A L T H S E R I E S', count), 'One Health series');
  assert.equal(tidyHeading('I S S U E 2 · R O L E O F V E T E R I N A R I A N S (ต่อ) (ต่อ)', count), 'Issue 2: Role of veterinarians (ต่อ)');
  assert.equal(tidyHeading('H I S T O R Y', count), 'History');
  assert.equal(tidyHeading('Q X Z W', count), null, 'a heading no lecture word reads is no title');
  const slide = 'Clinical examination of the \npenis/prepuce\n• Disease of prepuce and penis is \nrare.\n';
  assert.equal(wholeHeading('Clinical examination of the', slide), 'Clinical examination of the penis/prepuce');
  assert.equal(wholeHeading('Introduction of (ต่อ)', 'Introduction of\n• history\n'), 'Introduction (ต่อ)');
  assert.equal(wholeHeading('Hypovitaminosis A', ''), 'Hypovitaminosis A');
  assert.deepEqual(
    chapterTitles(['P R E V E N T I O N', 'T H A N K', '3/4/2026 (ต่อ)', null, 'ภาควิชาสัตวแพทยสาธารณสุข คณะสัตวแพทยศาสตร์', '1.2.Type of mastitis (ต่อ) (ต่อ)'], count),
    ['Prevention', 'Prevention (ต่อ)', '', '', '', '1.2.Type of mastitis (ต่อ)'],
  );
});

test('the small index and the card loaders agree with the registry', () => {
  assert.deepEqual(Object.keys(VIDEO_INDEX).sort(), Object.keys(VIDEO_REGISTRY).sort());
  for (const [id, v] of entries) assert.equal(Boolean(VIDEO_CARD_LOADERS[id]), v.card, `${id}: card flag and loader disagree`);
  for (const [topic, list] of Object.entries(VIDEO_TOPIC_INDEX)) {
    assert.ok(topics.has(topic), `topic index: unknown topic ${topic}`);
    for (const x of list) {
      const v = VIDEO_REGISTRY[x.v];
      assert.ok(v, `topic index: ${x.v} is not in the registry`);
      assert.ok(x.s < x.e && x.e <= v.durationSec + 1, `${topic}: ${x.v} ${x.s}-${x.e}`);
      assert.notEqual(x.conf, 'ambiguous', 'an ambiguous stretch never links from a topic');
    }
  }
});

test('every card keeps the summary policy where students read it', async () => {
  for (const [id, load] of Object.entries(VIDEO_CARD_LOADERS)) {
    const card = (await load()).default;
    const d = VIDEO_REGISTRY[id].durationSec;
    const where = (p) => `${id} [${p.t}] ${p.text || p.line || ''}`;
    assert.ok(thaiWords(card.oneLiner) <= LIMITS.oneLiner, `${id}: one-liner too long`);
    // A short practical-class demo may be all one-liner; a lecture of ten minutes or more has points.
    assert.ok(card.keyPoints.length >= (d >= 600 ? 1 : 0) && card.keyPoints.length <= Math.min(keyPointCap(d), LIMITS.ceiling), `${id}: ${card.keyPoints.length} key points for ${d} s`);
    assert.ok(card.emphasis.length <= LIMITS.emphasis && card.remember.length <= LIMITS.remember, `${id}: emphasis or remember over cap`);
    const points = [...card.keyPoints, ...card.emphasis, ...card.remember];
    for (const p of points) {
      assert.ok(p.t >= 0 && p.t <= d, `${where(p)} outside the video`);
      assert.ok(thaiWords(p.text) <= LIMITS.point, `${where(p)} longer than one sentence allows`);
    }
    let last = -1;
    for (const c of card.chapters) {
      assert.ok(c.t > last && c.t <= d, `${id}: chapter ${c.title} out of order`);
      assert.ok(thaiWords(c.line) <= LIMITS.chapterLine, `${where(c)} chapter line too long`);
      last = c.t;
    }
    // The review of 5.186.0: an index row once, without a slide's bullet.
    const keys = card.index.map((x) => (x.term || x.number).toLowerCase());
    assert.equal(new Set(keys).size, keys.length, `${id}: an index row repeats`);
    assert.ok(!card.index.some((x) => /^[•▪◦●–]/.test(x.number || '')), `${id}: a number keeps its slide bullet`);
    const text = JSON.stringify(card);
    assert.ok(!text.includes('·'), `${id}: middle dot`);
    assert.ok(!/อาจารย์(?:กล่าว|บอก|พูด)ว่า/.test(text), `${id}: speaks about the lecturer instead of the content`);
    // The review of #147: the voice holds on every line, a chapter title included;
    // no title reads garbled; one fact is said once.
    const lines = [['one-liner', card.oneLiner], ...points.map((p) => [p.t, p.text]), ...card.chapters.flatMap((c) => [[`chapter ${c.t}`, c.line], [`title ${c.t}`, c.title]])];
    for (const [where, line] of lines) assert.deepEqual(voiceErrors(line, { heading: String(where).startsWith('title') }), [], `${id} ${where}: ${line}`);
    assert.ok(!SELF_NAMING.test(card.oneLiner), `${id}: the one-liner names itself`);
    for (const c of card.chapters) assert.ok(!/(?:\b[A-Za-z0-9] ){2,}[A-Za-z0-9]\b|\d{1,2}\/\d{1,2}\/\d{4}|\(ต่อ\)\s*\(ต่อ\)|[ก-ฮ]\s+า|\b(?:and|of|the|by|for|in|with|to)(?:\s*\(ต่อ\))?$/.test(c.title), `${id}: chapter title "${c.title}"`);
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (Math.abs(points[i].t - points[j].t) <= 60) assert.ok(overlap(points[i].text, points[j].text) < 0.85, `${id}: "${points[j].text}" says what "${points[i].text}" says`);
      }
    }
  }
});
