// English counts read "1 row", not "1 rows" (review round 1: "1 kept results", "1 times").
// OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { singularEn } from '../../src/i18n/index.js';

test('English: a count of 1 takes the singular noun', () => {
  assert.equal(singularEn('1 kept results'), '1 kept result');
  assert.equal(singularEn('Data that left this device: 1 times'), 'Data that left this device: 1 time');
  assert.equal(singularEn('Showing 1 of 5 rows'), 'Showing 1 of 5 rows');
  assert.equal(singularEn('21 rows'), '21 rows');
  assert.equal(singularEn('1.5 rows'), '1.5 rows');
  assert.equal(singularEn('1 rows with missing values'), '1 row with missing values');
  assert.equal(singularEn('Strata used: 1 strata'), 'Strata used: 1 stratum');
  assert.equal(singularEn('3 analyses and 1 analyses'), '3 analyses and 1 analysis');
});
