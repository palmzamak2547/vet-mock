// /api/system-status — the admin page's check of every outside service (keys,
// credits, tokens, the domain). Admin only: nothing runs before the database
// says this account is in admin_users, so no one else can spend a probe.
import { authenticatedUser, isAdmin } from './_lib/app-backend.js';
import { allowedOrigin } from './_lib/rate-limit.js';
import { runChecks } from './_lib/system-status.js';

// Sign-in (8 s) and the admin check (6 s) run before any probe, then every
// check at once (8 s each, 9 s at most): 23 s worst case.
export const config = { runtime: 'nodejs', maxDuration: 30 };

export default async function handler(req, res, deps = {}) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });
  if (req.headers.origin && !allowedOrigin(req)) return res.status(403).json({ error: 'origin_not_allowed' });
  let user;
  try { user = await (deps.auth || authenticatedUser)(req); } catch { return res.status(503).json({ error: 'backend_unavailable' }); }
  if (!user) return res.status(401).json({ error: 'sign_in_required' });
  let admin = false;
  try { admin = await (deps.isAdmin || isAdmin)(user.token); } catch { admin = false; }
  if (!admin) return res.status(403).json({ error: 'forbidden' });
  return res.status(200).json({ checkedAt: new Date(deps.now ?? Date.now()).toISOString(), checks: await runChecks(deps) });
}
