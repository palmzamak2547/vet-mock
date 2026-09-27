// Thai terms the Studio takes from the main app's glossary must stay identical to it (one term per
// concept across VetMock). Reads ../src/data/glossary.js read-only. OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import terms from '../../src/i18n/terms.js';
import { GLOSSARY } from '../../../src/data/glossary.js';

const thaiOf = (term) => GLOSSARY.find((e) => e.term === term)?.thai;

test('glossary-sourced terms match src/data/glossary.js', () => {
  assert.equal(terms.th['term.prevalence'], thaiOf('prevalence'));
  assert.equal(terms.th['term.incidence'], thaiOf('incidence'));
  assert.equal(terms.th['term.relativeRisk'], thaiOf('relative risk'));
  const sesp = thaiOf('sensitivity & specificity');
  assert.ok(sesp.includes(terms.th['term.sensitivity']) && sesp.includes(terms.th['term.specificity']));
  const pv = thaiOf('predictive value');
  assert.ok(pv.startsWith(terms.th['term.ppv']), `${pv} vs ${terms.th['term.ppv']}`);
  assert.ok(pv.endsWith('ผลลบ') && terms.th['term.npv'].endsWith('ผลลบ'));
  // Review round 2: one Thai term for p-value across VetMock.
  assert.equal(terms.th['term.pValue'], thaiOf('p-value'));
});

test('fixed Studio wording', () => {
  assert.equal(terms.th['term.clusterAdjusted'], 'ปรับตามฟาร์ม');
  assert.equal(terms.th['term.download'], 'ดาวน์โหลด');
  assert.equal(terms.th['term.leavesDevice'], 'ส่งออกนอกเครื่อง');
  assert.equal(terms.th['term.student'], 'นิสิต');
});
