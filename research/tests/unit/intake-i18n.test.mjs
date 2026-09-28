// Every i18n key the intake modules can produce exists in both languages (src/i18n/intake.js), so a
// preview, a question or a step sentence never renders as "[intake.x]". OWNER: intake role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import dict from '../../src/i18n/intake.js';
import dataDict from '../../src/i18n/data.js';
import { M1_STEP_KINDS, M2_STEP_KINDS, EXCLUSION_CATEGORIES } from '../../src/lib/intake/recipe.js';
import { SUMMARY_FNS } from '../../src/lib/intake/transform.js';
import { EXPR_KEYS } from '../../src/lib/intake/expr.js';
import { TYPES, ROLES, LEVELS } from '../../src/lib/intake/codebook.js';

const dir = new URL('../../src/lib/intake/', import.meta.url);

test('every literal intake.* key in src/lib/intake exists in th and en', () => {
  const seen = new Set();
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.js'))) {
    const src = readFileSync(new URL(f, dir), 'utf8');
    for (const m of src.matchAll(/['"`](intake\.[A-Za-z0-9.-]+)['"`]/g)) seen.add(m[1]);
  }
  assert.ok(seen.size > 60, `found ${seen.size} keys`);
  for (const k of seen) {
    if (k.endsWith('.')) continue;
    assert.ok(k in dict.th, `th ${k}`);
    assert.ok(k in dict.en, `en ${k}`);
  }
});

test('every computed key exists: kinds, questions, blocking, types, roles, levels, steps, operators', () => {
  const keys = [];
  for (const k of ['encoding', 'ragged', 'thai-digits', 'be-year', 'two-digit-year', 'feb29', 'excel-serial', 'excel-date-id', 'id-number', 'missing-code', 'trim', 'invisible', 'nfc', 'lookalike', 'type-conflict', 'pii', 'question']) keys.push(`intake.kind.${k}`);
  for (const k of ['era', 'order', 'two-digit-century', 'excel-system', 'missing-reason', 'excel-date-id', 'id-padding', 'conflict']) keys.push(`intake.blocking.${k}`);
  for (const k of ['name', 'phone', 'national-id', 'address', 'line-id', 'email']) keys.push(`intake.conv.pii.${k}`, `intake.pii.${k}`);
  for (const k of ['unknown', 'not-applicable', 'not-recorded']) keys.push(`intake.missing.reason.${k}`);
  for (let i = 1; i <= 6; i++) keys.push(`intake.missing.cell.${i}`);
  for (const k of ['value-labels', 'sav-date', 'sav-note']) keys.push(`intake.kind.${k}`);
  for (const k of TYPES) keys.push(`intake.type.${k}`);
  for (const k of ROLES) keys.push(`intake.role.${k}`);
  for (const k of LEVELS) keys.push(`intake.level.${k}`);
  for (const k of M1_STEP_KINDS) keys.push(`intake.step.invalid.${k}`);
  for (const k of ['eq', 'ne', 'in', 'lt', 'le', 'gt', 'ge', 'between', 'missing', 'present']) keys.push(`intake.step.op.${k}`);
  for (const k of ['typed', 'literature', 'median', 'quantile']) keys.push(`intake.step.cutSource.${k}`);
  for (const k of ['left', 'right']) keys.push(`intake.step.describe.bin.${k}`);
  for (const k of ['months', 'days', 'years']) keys.push(`intake.unit.${k}`);
  for (const k of keys) {
    assert.ok(k in dict.th, `th ${k}`);
    assert.ok(k in dict.en, `en ${k}`);
  }
});

test('the Thai copy uses นิสิต wording rules and the fixed terms', () => {
  const th = Object.values(dict.th).join('\n');
  assert.ok(th.includes('ค่าที่หายไป'));
  assert.ok(th.includes('ส่งออกนอกเครื่อง'));
  assert.ok(th.includes('ดาวน์โหลด'));
  assert.ok(!/ดาวน์โหลด์|ดาวโหลด|อัปโหลดออก|นักศึกษา/.test(th));
});

// M2 [M2-DESIGN.md 4, 5]: the messages of the new steps, the formula parser and the SPSS reader live
// in the data dictionary. OWNER: data role.
test('every data.* key the intake modules produce exists in th and en (src/i18n/data.js)', () => {
  const seen = new Set();
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.js'))) {
    const src = readFileSync(new URL(f, dir), 'utf8');
    for (const m of src.matchAll(/['"`](data\.[A-Za-z0-9.-]+)['"`]/g)) seen.add(m[1]);
  }
  for (const k of M2_STEP_KINDS) seen.add(`data.step.invalid.${k}`);
  for (const k of EXCLUSION_CATEGORIES) seen.add(`data.exclusion.category.${k}`);
  for (const k of SUMMARY_FNS) seen.add(`data.aggregate.fn.${k}`);
  for (const k of ['record-7.20', 'code-page', 'utf-8-check', 'chosen']) seen.add(`data.sav.encoding.${k}`);
  for (const k of EXPR_KEYS) seen.add(k);
  for (const k of ['region', 'farm', 'pen', 'household', 'litter', 'animal', 'sample', 'visit']) seen.add(`data.level.${k}`);
  for (const k of ['key', 'rowA', 'rowB', 'column', 'a', 'b']) seen.add(`data.double.csv.${k}`);
  assert.ok(seen.size > 90, `found ${seen.size} keys`);
  for (const k of seen) {
    if (k.endsWith('.')) continue;
    assert.ok(k in dataDict.th, `th ${k}`);
    assert.ok(k in dataDict.en, `en ${k}`);
  }
});
