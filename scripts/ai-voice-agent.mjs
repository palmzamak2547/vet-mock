#!/usr/bin/env node
// ============================================================
// ai-voice-agent.mjs — write the voice agent from code (api/_lib/ai/voice-agent.js)
// ============================================================
//   node scripts/ai-voice-agent.mjs            print what would be sent (no network)
//   node scripts/ai-voice-agent.mjs --apply    create the agent, or update it in place
//
// The key is ELEVENLABS_API_KEY and the agent ELEVENLABS_VOICE_AGENT_ID, from the
// shell or .env.local at the repo root (values are never printed). With no agent
// id, --apply creates one and prints its id: put that in Vercel as
// ELEVENLABS_VOICE_AGENT_ID (production) and in .env.local.
// The caps (session length, concurrency) come from the same env names the route
// reads (api/_lib/ai/voice.js), so the agent and the route cannot disagree.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const apply = process.argv.includes('--apply');

function loadEnv() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*"?([^"\r\n]*)"?\s*$/.exec(line);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

async function main() {
  loadEnv();
  const imp = (p) => import(pathToFileURL(path.join(root, p)).href);
  const { agentDefinition, asrKeywords, EXTRA_TERMS } = await imp('api/_lib/ai/voice-agent.js');
  const { voiceConfig, EL_API } = await imp('api/_lib/ai/voice.js');
  const { GLOSSARY } = await imp('src/data/glossary.js');
  const { listTopics } = await imp('src/lib/vetwiki/index.js');
  const cfg = voiceConfig();
  const titles = (await listTopics()).map((t) => t.title);
  const keywords = asrKeywords({ glossary: GLOSSARY, titles, extra: EXTRA_TERMS });
  const def = agentDefinition({ keywords, sessionSeconds: cfg.sessionSeconds, maxConcurrent: cfg.maxConcurrent });

  if (!apply) {
    const c = def.conversation_config;
    console.log(JSON.stringify({
      name: def.name, llm: c.agent.prompt.llm, tts: c.tts.model_id, voice: c.tts.voice_id, asr: c.asr.provider,
      keywords: keywords.length, sampleKeywords: keywords.slice(0, 12), promptChars: c.agent.prompt.prompt.length,
      tools: c.agent.prompt.tools.map((t) => t.name), maxDuration: c.conversation.max_duration_seconds,
      concurrency: def.platform_settings.call_limits.agent_concurrency_limit,
    }, null, 1));
    console.log('dry run: nothing sent (add --apply)');
    return;
  }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY is not set');
  const call = async (method, p, body) => {
    const r = await fetch(`${EL_API}${p}`, { method, headers: { 'xi-api-key': key, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const text = await r.text();
    if (!r.ok) throw new Error(`${method} ${p} -> ${r.status} ${text.slice(0, 600)}`);
    return text ? JSON.parse(text) : {};
  };
  let id = process.env.ELEVENLABS_VOICE_AGENT_ID;
  if (id) {
    await call('PATCH', `/v1/convai/agents/${id}`, def);
    console.log(`updated agent ${id}`);
  } else {
    id = (await call('POST', '/v1/convai/agents/create', def)).agent_id;
    console.log(`created agent ${id}: set ELEVENLABS_VOICE_AGENT_ID to it`);
  }
  // read back what the platform kept (a silently dropped field shows here)
  const got = await call('GET', `/v1/convai/agents/${id}`);
  const c = got.conversation_config || {};
  console.log(JSON.stringify({
    llm: c.agent?.prompt?.llm, reasoning: c.agent?.prompt?.reasoning_effort, tts: c.tts?.model_id, voice: c.tts?.voice_id,
    asr: c.asr?.provider, keywords: c.asr?.keywords?.length, eagerness: c.turn?.turn_eagerness, speculative: c.turn?.speculative_turn,
    tools: (c.agent?.prompt?.tools || []).map((t) => t.name), maxDuration: c.conversation?.max_duration_seconds,
    auth: got.platform_settings?.auth?.enable_auth, allowlist: (got.platform_settings?.auth?.allowlist || []).map((a) => a.hostname),
    limits: got.platform_settings?.call_limits, privacy: got.platform_settings?.privacy,
  }, null, 1));
}

main().catch((e) => { console.error(String(e?.message || e)); process.exit(1); });
