// ============================================================
// llm.js — one place that talks to a language model
// ============================================================
// Provider order:
//   1. DeepSeek `deepseek-v4-flash` with thinking DISABLED — probed
//      2026-08-29: 0.75 s for a Thai JSON answer. Left thinking on, the
//      model spends the whole max_tokens budget inside reasoning_content
//      and returns an EMPTY content string (the reasoning-model
//      budget trap, hit live during the probe).
//   2. DeepSeek `deepseek-chat` alias — in case the flash id or the
//      thinking parameter ever stops being accepted.
//   3. Anthropic — only if ANTHROPIC_API_KEY is present.
//
// Every non-OK provider response is logged WITH ITS BODY (truncated).
// A bare status code cost a day of guessing on another surface; the
// body usually names the problem outright.

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

const cut = (s, n = 300) => String(s ?? '').slice(0, n);

async function callDeepSeek({ apiKey, model, thinkingOff, system, user, maxTokens, signal }) {
  const body = {
    model,
    max_tokens: maxTokens,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  };
  if (thinkingOff) body.thinking = { type: 'disabled' };
  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    signal,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[llm] deepseek', model, res.status, cut(detail));
    return { ok: false, status: res.status };
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';
  if (!text) {
    // content empty + reasoning_content full = the budget trap again
    console.error('[llm] deepseek', model, 'empty content', cut(JSON.stringify(data?.choices?.[0]?.message)));
    return { ok: false, status: 502 };
  }
  return { ok: true, text, model };
}

async function callAnthropic({ apiKey, model, system, user, maxTokens, signal }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[llm] anthropic', res.status, cut(detail));
    return { ok: false, status: res.status };
  }
  const data = await res.json();
  const text = data?.content?.[0]?.text || '';
  if (!text) return { ok: false, status: 502 };
  return { ok: true, text, model };
}

/** First complete JSON object in a model reply. lastIndexOf('}') grabbed
 *  trailing junk the model sometimes appends after the object (seen live:
 *  `{...}"}`) — a depth walk cannot. Returns null when nothing parses. */
export function extractJSON(text) {
  const s = String(text ?? '');
  const start = s.indexOf('{');
  if (start < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === String.fromCharCode(92)) esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(s.slice(start, i + 1)); } catch { return null; }
      }
    }
  }
  return null;
}

export function llmConfigured(env = process.env) {
  return !!(env.DEEPSEEK_API_KEY || env.ANTHROPIC_API_KEY);
}

// CJK detector for output-language enforcement. The primary model is
// Chinese-trained and occasionally drops Chinese fragments into Thai
// answers (live 2026-08-29: "โรคพิษสุนัขบ้าติดต่อ主要通过การถูกสัตว์กัด").
// Covers CJK punctuation, kana, unified + ext-A ideographs, compat forms.
const CJK_RE = /[\u3000-\u303F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF01-\uFF60\uFF66-\uFF9F]/;
export function hasCJK(s) {
  return CJK_RE.test(String(s ?? ''));
}

/**
 * Ask the first working provider for a JSON answer.
 * @returns {{ ok: true, text, model } | { ok: false, status }}
 */
export async function chatJSON({ system, user, maxTokens = 1200, timeoutMs = 25_000, env = process.env }) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const attempts = [];
    if (env.DEEPSEEK_API_KEY) {
      attempts.push(() => callDeepSeek({
        apiKey: env.DEEPSEEK_API_KEY, model: env.LLM_MODEL || 'deepseek-v4-flash',
        thinkingOff: true, system, user, maxTokens, signal: ac.signal,
      }));
      attempts.push(() => callDeepSeek({
        apiKey: env.DEEPSEEK_API_KEY, model: 'deepseek-chat',
        thinkingOff: false, system, user, maxTokens, signal: ac.signal,
      }));
    }
    if (env.ANTHROPIC_API_KEY) {
      attempts.push(() => callAnthropic({
        apiKey: env.ANTHROPIC_API_KEY, model: env.AI_GRADER_MODEL || 'claude-sonnet-4-5-20250929',
        system, user, maxTokens, signal: ac.signal,
      }));
    }
    let last = { ok: false, status: 503 };
    for (const attempt of attempts) {
      last = await attempt();
      if (last.ok) return last;
      // 4xx that is not rate-limiting means the REQUEST is wrong — the next
      // provider gets a chance, but a retry of the same one would not help.
    }
    return last;
  } catch (err) {
    if (err?.name === 'AbortError') return { ok: false, status: 504 };
    console.error('[llm] transport', cut(err?.message || err));
    return { ok: false, status: 502 };
  } finally {
    clearTimeout(timer);
  }
}
