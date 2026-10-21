// Mochi voice: the caps, the locked token request and the grounding tool.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  voiceConfig, monthKey, secondsToMonthEnd, mintToken, searchKnowledge, liveSetup, SYSTEM_PROMPT, USD_PER_MINUTE_WORST,
} from '../../api/_lib/mochi-voice.js';

test('caps default to a $20 month and never round a budget up', () => {
  const c = voiceConfig({ GEMINI_API_KEY: 'k' });
  assert.equal(c.open, false);
  assert.equal(c.configured, true);
  assert.equal(c.sessionMinutes, 10);
  assert.equal(c.userSessions, 6);
  assert.ok(c.globalSessions * c.sessionMinutes * USD_PER_MINUTE_WORST <= c.monthlyUsd);
  assert.equal(voiceConfig({}).configured, false);
  assert.equal(voiceConfig({ MOCHI_VOICE_SESSION_MINUTES: '60' }).sessionMinutes, 14, 'a Live audio session cannot outlast 15 min');
  assert.equal(voiceConfig({ MOCHI_VOICE_MONTHLY_USD: 'abc' }).monthlyUsd, 20);
  assert.equal(voiceConfig({ MOCHI_VOICE_OPEN: '1' }).open, true);
});

test('counters are per UTC month and live until the 1st', () => {
  const now = new Date('2026-10-31T23:59:00Z');
  assert.equal(monthKey(now), '2026-10');
  assert.equal(secondsToMonthEnd(now), 60);
  assert.equal(secondsToMonthEnd(new Date('2026-12-31T00:00:00Z')), 86400);
});

test('the token locks every setup field, so the browser cannot drop the grounding prompt', async () => {
  let sent;
  const fetchImpl = async (url, init) => { sent = { url, init }; return { ok: true, json: async () => ({ name: 'auth_tokens/abc' }) }; };
  const now = new Date('2026-10-21T00:00:00Z');
  const t = await mintToken('KEY', { now, sessionMinutes: 10, fetchImpl });
  assert.equal(t.token, 'auth_tokens/abc');
  assert.equal(t.expiresAt, '2026-10-21T00:10:00.000Z');
  assert.match(sent.url, /\/v1beta\/auth_tokens$/);
  assert.equal(sent.init.headers['x-goog-api-key'], 'KEY');
  const body = JSON.parse(sent.init.body);
  assert.equal(body.uses, 3);
  assert.deepEqual(body.fieldMask.split(','), Object.keys(liveSetup()));
  assert.equal(body.bidiGenerateContentSetup.model, 'models/gemini-3.8-live');
  assert.equal(body.bidiGenerateContentSetup.tools[0].functionDeclarations[0].name, 'search_vetmock');
  await assert.rejects(mintToken('KEY', { sessionMinutes: 10, fetchImpl: async () => ({ ok: false, status: 402 }) }));
});

test('the prompt makes the tool the only source of facts', () => {
  assert.match(SYSTEM_PROMPT, /search_vetmock/);
  assert.match(SYSTEM_PROMPT, /ห้ามเดา/);
});

test('search answers from VetWiki with links, and says so when nothing matches', () => {
  const hit = searchKnowledge('rabies vaccine');
  assert.equal(hit.covered, true);
  assert.ok(hit.results.length > 0 && hit.results.length <= 4);
  for (const r of hit.results) {
    assert.match(r.url, /^\/wiki\/[^/]+\/[^/#]+#/);
    assert.ok(r.title && r.heading && r.text.length > 0 && r.text.length <= 701);
  }
  assert.deepEqual(searchKnowledge('   '), { covered: false, results: [] });
  assert.deepEqual(searchKnowledge('gabapentin cat stress').unmatched, ['gabapentin']);
  assert.equal(searchKnowledge('zzqx flurbwonk').covered, false);
});

test('mic and speaker PCM survive the base64 round trip the socket uses', async () => {
  const { pcm16ToBase64, base64ToFloat32 } = await import('../../src/lib/mochi-voice.js');
  const x = Float32Array.from({ length: 1600 }, (_, i) => Math.sin(i / 7) * 0.8);
  const y = base64ToFloat32(pcm16ToBase64(x));
  assert.equal(y.length, x.length);
  assert.ok(x.every((v, i) => Math.abs(v - y[i]) < 1e-4));
  assert.equal(base64ToFloat32(pcm16ToBase64(Float32Array.of(2, -2)))[0] > 0.99, true, 'clipped, not wrapped');
});
