// ============================================================
// tts-budget.test.mjs — the clip script never spends blind
// ============================================================
// scripts/tts-clips.mjs buys voicings (Paxa, ElevenLabs) and transcription
// checks (ElevenLabs Scribe, a plan shared with other work). Its rules live
// in scripts/lib/tts-budget.mjs; the balance readers here are stubs, so no
// provider is called.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { scribeGate, elevenLeft, paidRunProblem, clipsToMake, wholeSubjectManifest } from '../../scripts/lib/tts-budget.mjs';

test('a balance that cannot be read buys no check and says to stop', async () => {
  for (const readBalance of [
    async () => { throw new TypeError('fetch failed'); }, // the network
    async () => elevenLeft({ detail: { status: 'missing_permissions' } }), // a key without user-read: 401 { detail }
    async () => NaN,
    async () => undefined,
  ]) {
    const gate = scribeGate({ readBalance, floor: 51500 });
    assert.equal(await gate.allow(10), 'unreadable');
    assert.equal(await gate.allow(10), 'unreadable', 'and stays so: no later check is bought blind');
    assert.equal(gate.checks, 0);
    assert.ok(gate.reason);
  }
});

test('a readable balance buys checks down to the floor, its own spend counted', async () => {
  let reads = 0;
  const gate = scribeGate({ readBalance: async () => { reads++; return elevenLeft({ character_limit: 60000, character_count: 8480 }); }, floor: 51500, every: 40 });
  assert.equal(await gate.allow(10), 'ok'); // 51,520 left
  gate.spend(12);
  assert.equal(await gate.allow(10), 'floor', '51,508 less 10 is under the floor');
  assert.equal(reads, 1);
});

test('the balance is read again every few checks, and a failed read then stops too', async () => {
  let n = 0;
  const gate = scribeGate({ readBalance: async () => { n++; if (n > 1) throw new Error('503'); return 1e6; }, floor: 100, every: 2 });
  assert.equal(await gate.allow(1), 'ok');
  assert.equal(await gate.allow(1), 'ok');
  assert.equal(await gate.allow(1), 'unreadable');
});

test('elevenLeft reads only an answer that carries both numbers', () => {
  assert.equal(elevenLeft({ character_limit: 100, character_count: 40 }), 60);
  assert.ok(Number.isNaN(elevenLeft({ character_limit: 100 })));
  assert.ok(Number.isNaN(elevenLeft(null)));
  assert.ok(Number.isNaN(elevenLeft({ character_limit: 'x', character_count: 1 })));
});

test('a paid generation needs a floor or a cap', () => {
  assert.ok(paidRunProblem({ paid: true, maxCredits: Infinity, keepRemaining: 0 }));
  assert.equal(paidRunProblem({ paid: true, maxCredits: Infinity, keepRemaining: 500 }), null);
  assert.equal(paidRunProblem({ paid: true, maxCredits: 2000, keepRemaining: 0 }), null);
  assert.equal(paidRunProblem({ paid: true, maxCredits: Infinity, keepRemaining: 0, dry: true }), null, 'a dry run spends nothing');
  assert.equal(paidRunProblem({ paid: true, maxCredits: Infinity, keepRemaining: 0, generating: false }), null, 'manifests only');
  assert.equal(paidRunProblem({ paid: false, maxCredits: Infinity, keepRemaining: 0 }), null);
});

test('a clip that failed its check twice is not voiced again unless asked', () => {
  const queue = ['a', 'b', 'c'];
  const done = new Set(['a']);
  const failed = new Set(['b']);
  assert.deepEqual(clipsToMake(queue, { done, failed }), ['c']);
  assert.deepEqual(clipsToMake(queue, { done, failed, retryFailed: true }), ['b', 'c']);
});

test('a served subject stays served on a run without --publish', () => {
  const have = ['k1'];
  assert.deepEqual(wholeSubjectManifest({ have, whole: true, publish: false, unpublish: false, wasComplete: true }), { complete: true, keys: have });
  assert.deepEqual(wholeSubjectManifest({ have, whole: true, publish: false, unpublish: false, wasComplete: false }), { complete: false, keys: have });
  assert.deepEqual(wholeSubjectManifest({ have, whole: true, publish: true, unpublish: false, wasComplete: null }), { complete: true, keys: have });
  assert.deepEqual(wholeSubjectManifest({ have, whole: true, publish: false, unpublish: true, wasComplete: true }), { complete: false, keys: have });
  assert.equal(wholeSubjectManifest({ have, whole: true, publish: false, unpublish: false, wasComplete: null }), null, 'unread: not written');
});
