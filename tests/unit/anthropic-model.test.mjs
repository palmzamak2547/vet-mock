// The Anthropic fallback: one model id for every route, and a request each
// model accepts. `claude-sonnet-4-5-20250929` was typed into four files and
// retires on 30 Nov 2026; a retired id answers 404, which ends the fallback
// without a word. Its successors refuse what that request carried (a non-default
// `temperature`) and think by default, which a short JSON reply or a streamed
// answer with a first-byte deadline cannot afford. These tests pin the id's
// one home, the fields each generation is sent, and the admin card that says
// when the id stops being served.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ANTHROPIC_MODEL, anthropicModel, anthropicFields, chatJSON, visionJSON } from '../../api/_lib/llm.js';
import { providerChain } from '../../api/_lib/ai/writer.js';
import { chatConfig } from '../../api/_lib/ai/config.js';
import { runChecks } from '../../api/_lib/system-status.js';

const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const text = (t) => reply({ content: [{ type: 'text', text: t }], stop_reason: 'end_turn' });

async function withFetch(impl, fn) {
  const real = globalThis.fetch;
  const realError = console.error;
  globalThis.fetch = impl;
  console.error = () => {};
  try { return await fn(); } finally { globalThis.fetch = real; console.error = realError; }
}

test('every route asks for the same model, and the environment can name another', () => {
  assert.equal(anthropicModel({}), ANTHROPIC_MODEL);
  assert.equal(anthropicModel({ AI_GRADER_MODEL: 'claude-opus-5-5' }), 'claude-opus-5-5');
  assert.equal(chatConfig({}).anthropicModel, ANTHROPIC_MODEL);
  assert.equal(providerChain({ ANTHROPIC_API_KEY: 'k' })[0].id, `anthropic:${ANTHROPIC_MODEL}`);
  assert.doesNotMatch(ANTHROPIC_MODEL, /-\d{8}$/, 'a dated snapshot retires on a date; the bare id is the current one');
});

test('a model id is written in one place', () => {
  // The handwriting route tries two stronger models before the shared one.
  const allowed = new Map([
    ['api/_lib/llm.js', [ANTHROPIC_MODEL]],
    ['api/transcribe-handwriting.js', ['claude-opus-5', 'claude-sonnet-5']],
  ]);
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(?:js|mjs|ts)$/.test(name)) files.push(path);
    }
  };
  walk('api');
  walk('supabase/functions');
  for (const file of files) {
    const found = [...readFileSync(file, 'utf8').matchAll(/['"`](claude-[a-z0-9.-]+)['"`]/g)].map((m) => m[1]);
    assert.deepEqual(found, allowed.get(file.split('\\').join('/')) || [], `${file} names a model id of its own`);
  }
});

test('each generation is sent the fields it accepts', () => {
  // The default answers directly and takes no temperature.
  assert.deepEqual(anthropicFields(ANTHROPIC_MODEL, { temperature: 0.3 }), { thinking: { type: 'between_tools' } });
  assert.deepEqual(anthropicFields(ANTHROPIC_MODEL, { thinking: true }), { thinking: { type: 'adaptive' } });
  // Thinking cannot be switched off: the lowest effort instead.
  for (const id of ['claude-opus-5-5', 'claude-fable-5-2']) {
    assert.deepEqual(anthropicFields(id, { temperature: 0.3 }), { output_config: { effort: 'low' } }, id);
  }
  // Thinks by default, takes `disabled`.
  for (const id of ['claude-opus-5', 'claude-sonnet-5', 'claude-haiku-5-5']) {
    assert.deepEqual(anthropicFields(id, { temperature: 0.3 }), { thinking: { type: 'disabled' } }, id);
    assert.deepEqual(anthropicFields(id, { thinking: true }), { thinking: { type: 'adaptive' } }, id);
  }
  // No thinking unless asked; 4.7 and 4.8 refuse temperature, 4.6 takes it.
  assert.deepEqual(anthropicFields('claude-opus-4-8', { temperature: 0.3 }), {});
  assert.deepEqual(anthropicFields('claude-sonnet-4-6', { temperature: 0.3 }), { temperature: 0.3 });
  // The budget form, for an environment still pinned to the old id.
  assert.deepEqual(anthropicFields('claude-sonnet-4-5-20250929', { thinking: true, temperature: 0.3 }),
    { thinking: { type: 'enabled', budget_tokens: 1500 }, temperature: 0.3 });
  // An id nobody listed gets nothing it could refuse.
  assert.deepEqual(anthropicFields('claude-next-9', { temperature: 0.3 }), {});
  assert.deepEqual(anthropicFields('claude-next-9', { thinking: true }), { thinking: { type: 'adaptive' } });
  assert.deepEqual(anthropicFields(undefined), {});
});

test('a JSON answer is asked for directly, from the shared model', async () => {
  const bodies = [];
  const out = await withFetch(async (url, init) => { bodies.push(JSON.parse(init.body)); return text('{"a":1}'); },
    () => chatJSON({ system: 's', user: 'u', maxTokens: 700, env: { ANTHROPIC_API_KEY: 'k' } }));
  assert.deepEqual(out, { ok: true, text: '{"a":1}', model: ANTHROPIC_MODEL });
  assert.equal(bodies.length, 1);
  assert.deepEqual(bodies[0], {
    model: ANTHROPIC_MODEL, max_tokens: 700, system: 's', messages: [{ role: 'user', content: 'u' }],
    thinking: { type: 'between_tools' },
  });
});

test('a model that refuses the thinking field is asked once more without it', async () => {
  const bodies = [];
  const out = await withFetch(async (url, init) => {
    bodies.push(JSON.parse(init.body));
    return bodies.length === 1
      ? reply({ type: 'error', error: { type: 'invalid_request_error', message: '"thinking.type.between_tools" is not supported for this model.' } }, 400)
      : text('{"a":2}');
  }, () => chatJSON({ system: 's', user: 'u', env: { ANTHROPIC_API_KEY: 'k' } }));
  assert.equal(out.ok, true);
  assert.equal(bodies.length, 2);
  assert.ok(!('thinking' in bodies[1]) && !('output_config' in bodies[1]));
});

test('a 400 about something else is not retried', async () => {
  let calls = 0;
  const out = await withFetch(async () => { calls += 1; return reply({ type: 'error', error: { type: 'invalid_request_error', message: 'messages: too long' } }, 400); },
    () => chatJSON({ system: 's', user: 'u', env: { ANTHROPIC_API_KEY: 'k' } }));
  assert.deepEqual(out, { ok: false, status: 400 });
  assert.equal(calls, 1);
});

test('a decline fails the provider in one call, so the next one can answer', async () => {
  let calls = 0;
  const out = await withFetch(async () => {
    calls += 1;
    return reply({ content: [], stop_reason: 'refusal', stop_details: { type: 'refusal', category: 'bio' } });
  }, () => visionJSON({ system: 's', user: 'u', image: { mediaType: 'image/png', data: 'AAAA' }, thinking: true, prefer: 'anthropic', env: { ANTHROPIC_API_KEY: 'k' } }));
  assert.deepEqual(out, { ok: false, status: 502 });
  assert.equal(calls, 1, 'a decline is not the empty-thinking case: no second call');
});

test('thinking that used the whole allowance is asked again directly', async () => {
  const bodies = [];
  const out = await withFetch(async (url, init) => {
    bodies.push(JSON.parse(init.body));
    return bodies.length === 1
      ? reply({ content: [{ type: 'thinking', thinking: '' }], stop_reason: 'max_tokens' })
      : text('{"text":"ก"}');
  }, () => visionJSON({ system: 's', user: 'u', image: { mediaType: 'image/png', data: 'AAAA' }, thinking: true, prefer: 'anthropic', env: { ANTHROPIC_API_KEY: 'k' } }));
  assert.equal(out.ok, true);
  assert.deepEqual(bodies.map((b) => b.thinking), [{ type: 'adaptive' }, { type: 'between_tools' }]);
});

test('the streamed answer carries no temperature the model would refuse, and no thinking pass', () => {
  const request = (env) => providerChain(env)[0].request({ system: 's', messages: [{ role: 'user', content: 'q' }], maxTokens: 2000, temperature: 0.3 }).body;
  const now = request({ ANTHROPIC_API_KEY: 'k' });
  assert.equal(now.model, ANTHROPIC_MODEL);
  assert.ok(!('temperature' in now), 'a non-default temperature is a 400 on this model');
  assert.deepEqual(now.thinking, { type: 'between_tools' });
  assert.equal(now.stream, true);
  assert.equal(now.max_tokens, 2000);
  // An environment still pinned to the old id keeps the request it had.
  const pinned = request({ ANTHROPIC_API_KEY: 'k', AI_GRADER_MODEL: 'claude-sonnet-4-5-20250929' });
  assert.equal(pinned.temperature, 0.3);
  assert.ok(!('thinking' in pinned));
});

test('the admin card says when the model is no longer served, and where to change it', async () => {
  const check = async (env, status) => {
    let asked = '';
    const checks = await runChecks({
      env: { ANTHROPIC_API_KEY: 'k', ...env },
      fetchImpl: async (url) => {
        if (!String(url).startsWith('https://api.anthropic.com/')) throw new Error('unrouted');
        asked = String(url);
        return { ok: status === 200, status, json: async () => ({}), text: async () => '' };
      },
      synth: async () => 1, limit: async () => ({ ok: true }), mic: async () => true, now: Date.parse('2026-11-10T00:00:00Z'),
    });
    return { asked, row: checks.find((c) => c.id === 'ai-anthropic') };
  };
  const ok = await check({}, 200);
  assert.equal(ok.asked, `https://api.anthropic.com/v1/models/${ANTHROPIC_MODEL}`);
  assert.equal(ok.row.state, 'ok');
  assert.ok(ok.row.detail.includes(ANTHROPIC_MODEL));

  const retired = await check({}, 404);
  assert.equal(retired.row.state, 'down');
  assert.match(retired.row.detail, /เลิกให้บริการ/);
  assert.match(retired.row.fix, /ANTHROPIC_MODEL/);

  const pinned = await check({ AI_GRADER_MODEL: 'claude-old-1' }, 404);
  assert.equal(pinned.asked, 'https://api.anthropic.com/v1/models/claude-old-1');
  assert.match(pinned.row.fix, /^แก้ AI_GRADER_MODEL/);

  const badKey = await check({}, 401);
  assert.equal(badKey.row.state, 'down');
  assert.match(badKey.row.detail, /คีย์ใช้ไม่ได้/);
});
