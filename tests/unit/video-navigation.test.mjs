import test from 'node:test';
import assert from 'node:assert/strict';
import { videoSubjectForNavigation, videoSubjectNavigation } from '../../src/lib/video-navigation.js';

const subjects = new Set(['com5', 'surg2', 'personal-course']);

test('the current URL wins over an older incoming course, including an invalid query', () => {
  assert.equal(videoSubjectForNavigation('?subject=surg2', 'com5', subjects), 'surg2');
  assert.equal(videoSubjectForNavigation('', 'com5', subjects), 'com5');
  assert.equal(videoSubjectForNavigation('?subject=unknown', 'com5', subjects), 'all');
  assert.equal(videoSubjectForNavigation('?subject=', 'com5', subjects), 'all');
  assert.equal(videoSubjectForNavigation('?subject=personal-course', null, subjects), 'personal-course');
});

test('choosing All clears both the URL and the old incoming course for Back', () => {
  const incoming = { vmxView: 'videos', vmxVideoSubject: 'com5', preserved: 7 };
  const selected = videoSubjectNavigation('https://example.test/app/videos?subject=com5&keep=1', incoming, 'surg2');
  assert.equal(selected.url.search, '?subject=surg2&keep=1');
  assert.equal(selected.state.vmxVideoSubject, 'surg2');
  const all = videoSubjectNavigation(selected.url.href, selected.state, 'all');
  assert.equal(all.url.search, '?keep=1');
  assert.equal(all.state.vmxView, 'videos');
  assert.equal(all.state.preserved, 7);
  assert.equal(videoSubjectForNavigation(all.url.search, all.state.vmxVideoSubject, subjects), 'all');
  assert.equal(incoming.vmxVideoSubject, 'com5', 'the old history entry must not be mutated');
});

test('an unmounting shelf cannot rewrite another destination URL', () => {
  assert.equal(videoSubjectNavigation('https://example.test/app/library?subject=com5', {}, 'surg2'), null);
  assert.equal(videoSubjectNavigation('https://example.test/', {}, 'surg2'), null);
});
