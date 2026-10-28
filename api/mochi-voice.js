// ============================================================
// /api/mochi-voice — Mochi realtime voice (Gemini Live)
// ============================================================
// POST { action: 'status' }         → { enabled, sessionMinutes }
// POST { action: 'token' }          → { token, expiresAt, sessionMinutes }
// POST { action: 'search', query }  → { covered, results: [{ title, heading, text, url }] }
//
// Every action needs a signed-in Supabase user. Until MOCHI_VOICE_OPEN=1 only
// admins (the database's is_admin(), i.e. Palm) pass, so the feature can ship
// dark. Caps live in api/_lib/mochi-voice.js; both counters fail closed: if
// the shared limiter is down in production no token is minted.
// ============================================================

import { allowedOrigin, rateLimit, sendRateLimitFailure } from './_lib/rate-limit.js';
import { authenticatedUser, isAdmin } from './_lib/app-backend.js';
import { voiceConfig, monthKey, secondsToMonthEnd, mintToken, searchKnowledge } from './_lib/mochi-voice.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const allowed = allowedOrigin(req);
  if (allowed) { res.setHeader('Access-Control-Allow-Origin', allowed); res.setHeader('Vary', 'Origin'); }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !allowed) return res.status(403).json({ error: 'Origin not allowed' });

  let user;
  try { user = await authenticatedUser(req); } catch { return res.status(503).json({ error: 'backend_unavailable' }); }
  if (!user) return res.status(401).json({ error: 'sign_in_required' });

  const cfg = voiceConfig();
  let enabled = cfg.open;
  if (!enabled) {
    try { enabled = await isAdmin(user.token); } catch { enabled = false; }
  }
  const action = String(req.body?.action || '');
  if (action === 'status') return res.status(200).json({ enabled: enabled && cfg.configured, sessionMinutes: cfg.sessionMinutes });
  if (!enabled) return res.status(403).json({ error: 'not_enabled' });

  if (action === 'search') {
    const rl = await rateLimit(`mochi-voice:search:${user.userId}`, 240, 60 * 60 * 1000);
    if (!rl.ok) return sendRateLimitFailure(res, rl);
    return res.status(200).json(searchKnowledge(req.body?.query));
  }

  if (action === 'token') {
    if (!cfg.configured) return res.status(503).json({ error: 'not_configured' });
    const month = monthKey();
    const ttl = secondsToMonthEnd() * 1000;
    // Global first: a refusal there should not also burn the student's own allowance.
    const global = await rateLimit(`mochi-voice:global:${month}`, cfg.globalSessions, ttl);
    if (!global.ok) {
      if (global.unavailable) return sendRateLimitFailure(res, global);
      return res.status(429).json({ error: 'monthly_budget_reached', retryAfter: global.retryAfter });
    }
    const mine = await rateLimit(`mochi-voice:user:${user.userId}:${month}`, cfg.userSessions, ttl);
    if (!mine.ok) {
      if (mine.unavailable) return sendRateLimitFailure(res, mine);
      return res.status(429).json({ error: 'user_cap_reached', sessions: cfg.userSessions, sessionMinutes: cfg.sessionMinutes, retryAfter: mine.retryAfter });
    }
    try {
      const t = await mintToken(process.env.GEMINI_API_KEY, { sessionMinutes: cfg.sessionMinutes });
      return res.status(200).json({ ...t, sessionMinutes: cfg.sessionMinutes });
    } catch (e) {
      console.warn('[mochi-voice] token mint failed', e.status || e.message);
      return res.status(502).json({ error: 'provider_unavailable' });
    }
  }
  return res.status(400).json({ error: 'unknown_action' });
}
