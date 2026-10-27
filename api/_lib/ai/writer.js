// ============================================================
// ai/writer.js — the answer, streamed word by word, with a fallback chain
// ============================================================
// llm.js answers in one piece; a chat answer has to start appearing while it
// is still being written, so this module speaks the providers' streaming
// protocols directly:
//
//   1. DeepSeek `deepseek-flash` (LLM_MODEL overrides), thinking DISABLED —
//      left on, the model can spend the whole token budget inside its hidden
//      reasoning and stream back nothing (llm.js documents the trap, hit live)
//   2. DeepSeek `deepseek-chat`
//   3. Anthropic (AI_GRADER_MODEL, the same env convention as llm.js), only
//      when its key is set
//
// A provider is abandoned for the next one ONLY before it has produced its
// first words: once text has gone to the student, switching providers would
// splice two different answers together, so a failure after that point ends
// the answer with an error event instead. A provider that says nothing within
// WRITER_FIRST_BYTE_MS, or stalls for WRITER_IDLE_MS mid-answer, counts as
// failed.
//
// Every non-OK provider response is logged with its status and the first part
// of its body (never the request), as llm.js does: the body usually names the
// problem outright.
// ============================================================

import { WRITER_FIRST_BYTE_MS, WRITER_IDLE_MS, WRITER_MAX_TOKENS, WRITER_TEMPERATURE } from './config.js';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const cut = (s, n = 300) => String(s ?? '').slice(0, n);

/** Anthropic wants alternating turns that start with the user. */
export function alternate(messages) {
  const out = [];
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'assistant' : 'user';
    if (out.length && out[out.length - 1].role === role) out[out.length - 1].content += `\n\n${m.content}`;
    else out.push({ role, content: m.content });
  }
  while (out.length && out[0].role !== 'user') out.shift();
  return out;
}

// ── Stream parsers: one SSE event in, { text?, done?, error?, finish? } out ──
export function parseDeepSeekEvent(_event, data) {
  if (data === '[DONE]') return { done: true };
  let j;
  try { j = JSON.parse(data); } catch { return {}; }
  if (j?.error) return { error: cut(JSON.stringify(j.error)) };
  const c = j?.choices?.[0];
  return { text: typeof c?.delta?.content === 'string' ? c.delta.content : '', finish: c?.finish_reason || null };
}

export function parseAnthropicEvent(event, data) {
  let j;
  try { j = JSON.parse(data); } catch { return {}; }
  const type = j?.type || event;
  if (type === 'error') return { error: cut(JSON.stringify(j.error || j)) };
  if (type === 'content_block_delta' && j.delta?.type === 'text_delta') return { text: j.delta.text || '' };
  if (type === 'message_delta') return { finish: j.delta?.stop_reason || null };
  if (type === 'message_stop') return { done: true };
  return {};
}

/** The providers this environment can use, in order. */
export function providerChain(env = process.env) {
  const chain = [];
  if (env.DEEPSEEK_API_KEY) {
    const primary = env.LLM_MODEL || 'deepseek-flash';
    const deepseek = (model, thinkingOff) => ({
      id: `deepseek:${model}`,
      parse: parseDeepSeekEvent,
      request: ({ system, messages, maxTokens, temperature }) => ({
        url: DEEPSEEK_URL,
        headers: { 'content-type': 'application/json', authorization: `Bearer ${env.DEEPSEEK_API_KEY}` },
        body: {
          model,
          stream: true,
          temperature,
          max_tokens: maxTokens,
          messages: [{ role: 'system', content: system }, ...messages.map((m) => ({ role: m.role, content: m.content }))],
          ...(thinkingOff ? { thinking: { type: 'disabled' } } : {}),
        },
      }),
    });
    chain.push(deepseek(primary, true));
    if (primary !== 'deepseek-chat') chain.push(deepseek('deepseek-chat', false));
  }
  if (env.ANTHROPIC_API_KEY) {
    const model = env.AI_GRADER_MODEL || 'claude-sonnet-4-5-20250929';
    chain.push({
      id: `anthropic:${model}`,
      parse: parseAnthropicEvent,
      request: ({ system, messages, maxTokens, temperature }) => ({
        url: ANTHROPIC_URL,
        headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: { model, system, stream: true, temperature, max_tokens: maxTokens, messages: alternate(messages) },
      }),
    });
  }
  return chain;
}

/** One provider, one streamed attempt. */
async function attempt(provider, { system, messages, maxTokens, temperature, onDelta, signal, firstByteMs, idleMs, fetchImpl }) {
  if (signal?.aborted) return { ok: false, reason: 'aborted', partial: false };
  const ac = new AbortController();
  let timedOut = false;
  let got = false;
  let text = '';
  let finish = null;
  const onParent = () => ac.abort(signal.reason);
  signal?.addEventListener('abort', onParent, { once: true });
  let timer = setTimeout(() => { timedOut = true; ac.abort(new Error('first byte timeout')); }, firstByteMs);
  const rearm = () => {
    clearTimeout(timer);
    timer = setTimeout(() => { timedOut = true; ac.abort(new Error('idle timeout')); }, idleMs);
  };
  const handle = (event, data) => {
    const r = provider.parse(event, data);
    if (r.finish) finish = r.finish;
    if (r.error) return { stop: true, error: r.error };
    if (r.text) {
      got = true;
      text += r.text;
      rearm();
      onDelta(r.text);
    }
    return { stop: Boolean(r.done) };
  };
  try {
    const req = provider.request({ system, messages, maxTokens, temperature });
    const res = await fetchImpl(req.url, { method: 'POST', headers: req.headers, body: JSON.stringify(req.body), signal: ac.signal });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[ai-chat] writer', provider.id, res.status, cut(detail));
      return { ok: false, reason: 'provider', status: res.status, partial: false };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    let event = '';
    let data = [];
    let stopped = null;
    const line = (raw) => {
      const l = raw.endsWith('\r') ? raw.slice(0, -1) : raw;
      if (l === '') {
        if (data.length) stopped = handle(event, data.join('\n'));
        event = '';
        data = [];
        return;
      }
      if (l.startsWith(':')) return;
      if (l.startsWith('event:')) event = l.slice(6).trim();
      else if (l.startsWith('data:')) data.push(l.slice(5).replace(/^ /, ''));
    };
    while (!stopped?.stop) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let nl;
      while (!stopped?.stop && (nl = buf.indexOf('\n')) >= 0) {
        line(buf.slice(0, nl));
        buf = buf.slice(nl + 1);
      }
    }
    if (!stopped?.stop) {
      if (buf) line(buf);
      line('');
    }
    reader.cancel().catch(() => {});
    if (stopped?.error) {
      console.error('[ai-chat] writer', provider.id, 'stream error', stopped.error);
      return { ok: false, reason: 'provider', partial: got };
    }
    if (!got) {
      // Finished without a word: the empty-content trap, or a filtered reply.
      console.error('[ai-chat] writer', provider.id, 'empty answer, finish', finish);
      return { ok: false, reason: 'provider', partial: false };
    }
    return { ok: true, text, finish };
  } catch (err) {
    if (signal?.aborted) return { ok: false, reason: 'aborted', partial: got };
    if (timedOut) {
      console.error('[ai-chat] writer', provider.id, got ? 'stalled' : 'no first byte');
      return { ok: false, reason: 'timeout', partial: got };
    }
    console.error('[ai-chat] writer', provider.id, 'transport', cut(err?.message || err));
    return { ok: false, reason: 'provider', partial: got };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onParent);
  }
}

/**
 * Stream an answer. onDelta(text) receives raw provider text as it arrives.
 * @returns {Promise<{ ok: boolean, model: 'primary'|'fallback'|null, text?: string, finish?: string,
 *                     reason?: 'timeout'|'provider'|'aborted', partial?: boolean }>}
 */
export async function writeAnswer({
  system, messages, onDelta, signal, env = process.env, fetchImpl = fetch,
  maxTokens = WRITER_MAX_TOKENS, temperature = WRITER_TEMPERATURE,
  firstByteMs = WRITER_FIRST_BYTE_MS, idleMs = WRITER_IDLE_MS,
} = {}) {
  const chain = providerChain(env);
  if (!chain.length) return { ok: false, model: null, reason: 'provider', partial: false };
  let last = { ok: false, model: 'primary', reason: 'provider', partial: false };
  for (let k = 0; k < chain.length; k++) {
    const model = k === 0 ? 'primary' : 'fallback';
    const r = await attempt(chain[k], { system, messages, maxTokens, temperature, onDelta, signal, firstByteMs, idleMs, fetchImpl });
    if (r.ok || r.partial || r.reason === 'aborted') return { ...r, model, provider: chain[k].id };
    last = { ...r, model, provider: chain[k].id };
    if (signal?.aborted) break;
  }
  return last;
}
