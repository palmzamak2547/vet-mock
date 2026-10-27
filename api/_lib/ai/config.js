// ============================================================
// ai/config.js — the numbers /api/ai-chat lives by, in one place
// ============================================================
// Every cap the front-end is built against (message count, characters, image
// size) and every ceiling on spend (per-IP windows, the daily budget, model
// deadlines) is named here, so a change to one is a change to one line and
// the unit tests read the same values the route enforces.
//
// Nothing here reads a secret. `chatConfig(env)` only reports whether a key is
// present and which model id the environment asks for; the keys themselves are
// read where the request is made (writer.js, llm.js) and never leave them.
// ============================================================

/** Absolute origin every deep link points at. The chat lives on another
 *  origin (ai.vetmock.com), so a relative path would open the wrong site. */
export const SITE = 'https://vetmock.com';

// ── Request caps (the contract) ─────────────────────────────────────────
export const MAX_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 4000;
export const MAX_TOTAL_CHARS = 16000;
export const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;
export const IMAGE_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/webp']);

// ── Abuse and spend ceilings ────────────────────────────────────────────
// Per IP: a burst window and a day window. Twenty questions in ten minutes is
// a student working hard; past that it is a script.
export const IP_BURST = { max: 20, winMs: 10 * 60 * 1000 };
export const IP_DAY = { max: 150, winMs: 24 * 60 * 60 * 1000 };
// The whole feature's own daily counter, separate from the 4,000 shared by the
// other model routes (llm.js LLM_DAILY_BUDGET), so a busy chat day cannot
// switch off wiki answers, grading and the study coach for everyone else.
export const DAILY_CAP_DEFAULT = 2500;

// ── Deadlines ───────────────────────────────────────────────────────────
// The planner is a convenience: past this the deterministic plan is used.
export const PLANNER_TIMEOUT_MS = 4500;
export const VISION_TIMEOUT_MS = 20_000;
export const RESEARCH_TIMEOUT_MS = 7000;
// The writer has to show its first words within this or the next provider is
// tried; between words it may pause this long before it counts as stalled.
export const WRITER_FIRST_BYTE_MS = 10_000;
export const WRITER_IDLE_MS = 20_000;
// Everything in one request ends before the platform limit below, so a slow
// provider ends in our own `error` event, never in a cut-off connection.
export const REQUEST_DEADLINE_MS = 55_000;
export const MAX_DURATION_S = 60;

// ── Retrieval and answer size ───────────────────────────────────────────
export const MAX_SOURCES = 8;
export const CONTEXT_CHARS = 12_000;
export const SNIPPET_CHARS = 220;
export const WRITER_MAX_TOKENS = 2000;
export const WRITER_TEMPERATURE = 0.3;
export const QUIZ_DEFAULT = 5;
export const QUIZ_MAX = 10;

/** What the environment provides, without exposing any value of a secret. */
export function chatConfig(env = process.env) {
  const cap = Number(env.AI_CHAT_DAILY_CAP);
  return {
    dailyCap: Number.isFinite(cap) && cap > 0 ? Math.floor(cap) : DAILY_CAP_DEFAULT,
    hasDeepSeek: Boolean(env.DEEPSEEK_API_KEY),
    hasAnthropic: Boolean(env.ANTHROPIC_API_KEY),
    configured: Boolean(env.DEEPSEEK_API_KEY || env.ANTHROPIC_API_KEY),
    // Same model env convention as llm.js: LLM_MODEL overrides the primary
    // DeepSeek id; AI_GRADER_MODEL names the Anthropic one.
    primaryModel: env.LLM_MODEL || 'deepseek-flash',
    anthropicModel: env.AI_GRADER_MODEL || 'claude-sonnet-4-5-20250929',
    ncbiKey: env.NCBI_API_KEY || '',
  };
}
