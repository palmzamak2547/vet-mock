// ============================================================
// figure-answer-leak.test.mjs — a figure above the options is not the key
// ============================================================
// Question.jsx draws q.image above the stem and options, before any answer.
// Seven recall questions carried inline SVG diagrams whose labels printed
// the key (B48): MGCS "3-8 Grave" above "3-8 หมายถึง", the three MGCS
// categories above "MGCS ประเมินอะไร", the Cushing triad above "Cushing
// reflex ประกอบด้วย", "Catagen (transitional)" above "transitional คือ
// ระยะใด", "Spherocyte (IMHA hallmark)" above the IMHA smear question,
// "angular cornified cells" above the estrus cytology question and a
// segment-to-limb-pattern table above the localisation case. Q27's nerve
// diagram labelled both muscles the radial nerve runs between.
//
// Each now shows a figure without its own answer, or (822, whose diagram
// is the triad itself) carries it as explainImage for after the reveal.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const LIVE = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) LIVE.push(q);
const find = (subject, id) => {
  const q = LIVE.find((r) => r.subject === subject && r.id === id);
  assert.ok(q, `${subject}:${id} is in the bank`);
  return q;
};

// Everything a student can read before answering: the figure's own text
// and the alt a screen reader announces.
function preAnswerText(q) {
  const src = String(q.image || q.imagePath || '');
  const svg = src.startsWith('data:image/svg+xml') ? decodeURIComponent(src.replace(/^data:image\/svg\+xml;utf8,/, '')) : '';
  const labels = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
  return [...labels, String(q.imageAlt || '')].join(' | ').toLowerCase();
}

const MUST_NOT_SHOW = [
  ['com3', 821, ['grave', 'guarded']],
  ['com3', 874, ['motor activity', 'brainstem reflex', 'level of consciousness']],
  ['com3', 822, ['bradycardia', 'hypertension', 'irreg']],
  ['com3', 890, ['umn', 'lmn', 'hyperreflexia', 'forelimb', 'hindlimb']],
  ['com4', 902, ['transitional', '(growth)', '(resting)']],
  ['com4', 985, ['spherocyte', 'hallmark', 'no pallor']],
  ['repro', 60, ['cornified', 'angular']],
  ['surg3', 27, ['triceps', 'brachialis', 'lat. head']],
];

test('the figure and alt shown before answering do not print the key', () => {
  for (const [subject, id, words] of MUST_NOT_SHOW) {
    const text = preAnswerText(find(subject, id));
    for (const w of words) assert.ok(!text.includes(w), `${subject}:${id} shows "${w}" before the answer`);
  }
});

test('the teaching figures are kept, not thrown away', () => {
  for (const [subject, id] of MUST_NOT_SHOW) {
    const q = find(subject, id);
    assert.ok(q.image || q.explainImage, `${subject}:${id} still carries a figure`);
    if (q.image) assert.ok([...String(q.imageAlt || '')].length >= 20, `${subject}:${id} alt describes the figure`);
  }
  const cushing = find('com3', 822);
  assert.equal(cushing.image, undefined, 'the triad is not drawn above the options');
  assert.match(decodeURIComponent(cushing.explainImage), /Bradycardia/, 'the triad diagram is kept for after the reveal');
  assert.ok([...String(cushing.explainImageAlt || '')].length >= 20);
});

test('no inline SVG figure prints its question\'s whole key', () => {
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9ก-๙]+/g, ' ').trim();
  for (const q of LIVE) {
    const src = String(q.image || '');
    if (!src.startsWith('data:image/svg+xml') || !Array.isArray(q.options) || typeof q.answer !== 'number') continue;
    const key = norm(q.options[q.answer]);
    if (key.length < 6) continue;
    assert.ok(!norm(preAnswerText(q)).includes(key), `${q.subject}:${q.id} prints "${q.options[q.answer]}" in its figure`);
  }
});

test('an explanation figure is drawn only after the answer is revealed', async () => {
  const { readFileSync } = await import('node:fs');
  const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
  const question = read('src/components/Question.jsx');
  const review = read('src/views/ReviewView.jsx');
  assert.match(question, /const explainFigureSrc = safeImageUrl\(currentQ\?\.explainImage\);/);
  assert.equal((question.match(/figure=\{explainFigure\}/g) || []).length, 2, 'both instant-feedback panels carry the figure');
  assert.match(question, /\{figure\}\n\s*\{coach\}/, 'the figure sits inside the verdict panel, after the reason');
  assert.doesNotMatch(question.slice(question.indexOf('{figureSrc && (')), /explainImage/, 'never next to the question figure');
  assert.match(review, /src=\{safeImageUrl\(q\.explainImage\)\}/, 'Review shows it with the explanation');
});
