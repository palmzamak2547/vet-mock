import { questionRevision } from '../src/lib/study-events.js';
import { allowedOrigin, clientIP, rateLimit, sendRateLimitFailure } from './_lib/rate-limit.js';
import { authenticatedUser, signedRpc } from './_lib/app-backend.js';
import { questionCatalog } from './_lib/question-catalog.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const origin = allowedOrigin(req);
  if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (req.headers.origin && !origin) return res.status(403).json({ error: 'origin_not_allowed' });
  const ids = req.body?.questionIds;
  if (!/^[A-F0-9]{6}$/.test(req.body?.code || '') || !Array.isArray(ids) || ids.length < 5 || ids.length > 50
    || new Set(ids.map(String)).size !== ids.length) return res.status(400).json({ error: 'invalid-race' });
  const limited = await rateLimit(`race-start:${clientIP(req)}`, 60, 60 * 60 * 1000);
  if (!limited.ok) return sendRateLimitFailure(res, limited);
  try {
    const auth = await authenticatedUser(req);
    if (!auth) return res.status(401).json({ error: 'sign_in_required' });
    const bank = await questionCatalog();
    const questions = ids.map(id => bank.get(String(id)));
    if (questions.some(q => !q || q.type !== 'mcq' || !Number.isInteger(q.answer))
      || new Set(questions.map(q => q.subject)).size !== 1
      || questions.some(q => req.body.questionVersions?.[q.id] !== questionRevision(q))) return res.status(400).json({ error: 'invalid-questions' });
    const result = await signedRpc('start_verified_race', 'race-start', {
      user_id: auth.userId, code: req.body.code, subject: questions[0].subject, year: questions[0].year,
      question_ids: questions.map(q => q.id), question_versions: Object.fromEntries(questions.map(q => [q.id, questionRevision(q)])), answers: questions.map(q => q.answer),
      option_counts: questions.map(q => q.options.length),
    }, auth.token);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status === 400 || error.status === 403 ? 409 : 503).json({ error: 'race_start_unavailable' });
  }
}
