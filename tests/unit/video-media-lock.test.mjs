// The media run waits between videos while another lane's heavy job holds HEAVY.lock
// (scripts/video-media.mjs holderBlocks). On 14 Nov a run wrapped in with-heavy-lock.mjs
// waited eight hours on the lock its own wrapper held, and then on one whose holder was gone.
import test from 'node:test';
import assert from 'node:assert/strict';
import { holderBlocks } from '../../scripts/video-media.mjs';

const lock = 'vet-86: build; start 23:31; pid=4242; kind=cpu\nchild=4300\n';

test('a live holder from another lane blocks', () => {
  assert.equal(holderBlocks(lock, { ownPid: undefined, alive: () => true }), true);
});

test('the run\'s own wrapper and a holder that is gone do not block', () => {
  assert.equal(holderBlocks(lock, { ownPid: '4242', alive: () => true }), false, 'its own wrapper');
  assert.equal(holderBlocks(lock, { ownPid: undefined, alive: () => false }), false, 'a holder that is gone');
  assert.equal(holderBlocks(lock, { ownPid: '4300', alive: () => true }), true, 'the child= line names no holder');
});

test('a lock without a pid is left to its age', () => {
  assert.equal(holderBlocks('an older writer, no pid', { alive: () => false }), true);
});
