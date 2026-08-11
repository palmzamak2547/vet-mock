import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isTopicRead,
  migrateUniqueTopicProgress,
  setTopicRead,
  topicProgressKey,
} from '../../src/lib/study-progress.js';

test('topicProgressKey scopes identity by subject and safely encodes ids', () => {
  assert.equal(topicProgressKey('com3', 'nutrition'), 'topic:com3/nutrition');
  assert.equal(topicProgressKey('food safety', 'milk/meat'), 'topic:food%20safety/milk%2Fmeat');
  assert.notEqual(topicProgressKey('com3', 'nutrition'), topicProgressKey('poultry', 'nutrition'));
  assert.throws(() => topicProgressKey('', 'nutrition'), /subject must be a non-empty string/);
  assert.throws(() => topicProgressKey('com3', null), /topic must be a non-empty string/);
});

test('canonical value takes precedence over the legacy bare topic key', () => {
  const legacy = { nutrition: 100 };
  assert.equal(isTopicRead(legacy, 'com3', 'nutrition'), true);
  assert.equal(isTopicRead(legacy, 'poultry', 'nutrition'), true);

  const withExplicitUnread = {
    ...legacy,
    [topicProgressKey('com3', 'nutrition')]: false,
  };
  assert.equal(isTopicRead(withExplicitUnread, 'com3', 'nutrition'), false);
  assert.equal(isTopicRead(withExplicitUnread, 'poultry', 'nutrition'), true);

  const withCanonicalRead = {
    nutrition: false,
    [topicProgressKey('com3', 'nutrition')]: 200,
  };
  assert.equal(isTopicRead(withCanonicalRead, 'com3', 'nutrition'), true);
  assert.equal(isTopicRead(null, 'com3', 'nutrition'), false);
  assert.equal(isTopicRead({}, 'com3', 'toString'), false, 'prototype keys are not legacy progress');
});

test('setTopicRead is pure and false sentinel overrides ambiguous legacy state', () => {
  const original = { nutrition: 100, untouched: 7 };
  const unreadCom3 = setTopicRead(original, 'com3', 'nutrition', false, 200);

  assert.deepEqual(original, { nutrition: 100, untouched: 7 });
  assert.deepEqual(unreadCom3, {
    nutrition: 100,
    untouched: 7,
    [topicProgressKey('com3', 'nutrition')]: false,
  });
  assert.equal(isTopicRead(unreadCom3, 'com3', 'nutrition'), false);
  assert.equal(isTopicRead(unreadCom3, 'poultry', 'nutrition'), true);

  const readAgain = setTopicRead(unreadCom3, 'com3', 'nutrition', 'toggle', 300);
  assert.equal(readAgain[topicProgressKey('com3', 'nutrition')], 300);
  assert.equal(isTopicRead(readAgain, 'com3', 'nutrition'), true);
  assert.throws(
    () => setTopicRead(original, 'com3', 'nutrition', 'yes'),
    /nextRead must be true, false, or 'toggle'/,
  );
  assert.throws(
    () => setTopicRead({}, 'com3', 'nutrition', true, 0),
    /completedAt must be a positive finite number/,
  );
});

test('setTopicRead preserves an existing canonical completion time', () => {
  const key = topicProgressKey('com5', 'rabies');
  const original = { [key]: 123 };
  const next = setTopicRead(original, 'com5', 'rabies', true, 999);

  assert.notStrictEqual(next, original);
  assert.equal(next[key], 123);
});

test('migration moves only unique legacy keys and respects canonical sentinels', () => {
  const subjects = [
    { id: 'com3', topics: [{ id: 'nutrition' }, { id: 'shock' }] },
    { id: 'poultry', topics: [{ id: 'nutrition' }] },
    { id: 'com5', topics: [{ id: 'rabies' }, { id: 'rabies' }] },
  ];
  const rabiesKey = topicProgressKey('com5', 'rabies');
  const original = {
    nutrition: 11,
    shock: 22,
    rabies: 33,
    [rabiesKey]: false,
    unrelated: 44,
  };

  const migrated = migrateUniqueTopicProgress(original, subjects);

  assert.deepEqual(original, {
    nutrition: 11,
    shock: 22,
    rabies: 33,
    [rabiesKey]: false,
    unrelated: 44,
  });
  assert.equal(migrated.nutrition, 11, 'ambiguous legacy key must remain');
  assert.equal('shock' in migrated, false);
  assert.equal(migrated[topicProgressKey('com3', 'shock')], 22);
  assert.equal('rabies' in migrated, false);
  assert.equal(migrated[rabiesKey], false, 'canonical false must not be overwritten');
  assert.equal(migrated.unrelated, 44);
  assert.deepEqual(migrateUniqueTopicProgress(migrated, subjects), migrated);
});

test('migration is a no-op when no curriculum refs are available', () => {
  const checklist = { rabies: 123 };
  assert.strictEqual(migrateUniqueTopicProgress(checklist, []), checklist);
  assert.deepEqual(migrateUniqueTopicProgress(null, []), {});
});
