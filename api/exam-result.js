import { allowedOrigin, clientIP, rateLimit, sendRateLimitFailure } from './_lib/rate-limit.js';
import { authenticatedUser, signedRpc } from './_lib/app-backend.js';
import { scoreSubmission } from './_lib/exam-scoring.js';
import { isWritingType } from '../src/hooks/utils.js';

let catalogPromise;
async function catalog() {
  if (!catalogPromise) catalogPromise = Promise.all([
    import('../src/data/questions.js'), import('../src/data/question-delivery.generated.js'),
  ]).then(async ([bank, delivery]) => {
    await bank.loadQB();
    return new Map(bank.QB.filter(q => delivery.isQuestionDeliverable(q) && !isWritingType(q)).map(q => [String(q.id), q]));
  }).catch(error => { catalogPromise = null; throw error; });
  return catalogPromise;
}

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
  if (Buffer.byteLength(JSON.stringify(req.body || {})) > 3 * 1024 * 1024) return res.status(413).json({ error: 'submission_too_large' });
  const ipLimit = await rateLimit(`exam-result:${clientIP(req)}`, 600, 10 * 60 * 1000);
  if (!ipLimit.ok) return sendRateLimitFailure(res, ipLimit);
  try {
    const auth = await authenticatedUser(req);
    if (!auth) return res.status(401).json({ error: 'sign_in_required' });
    const accountLimit = await rateLimit(`exam-result-user:${auth.userId}`, 120, 60 * 60 * 1000);
    if (!accountLimit.ok) return sendRateLimitFailure(res, accountLimit);
    let result;
    try { result = scoreSubmission(req.body, await catalog()); }
    catch (error) {
      if (['invalid-submission', 'duplicate-questions', 'invalid-score'].includes(error.message)) return res.status(400).json({ error: error.message });
      throw error;
    }
    const receipt = await signedRpc('record_exam_receipt', 'exam-result', { ...result, user_id: auth.userId }, auth.token);
    return res.status(receipt?.ok ? 200 : 409).json(receipt);
  } catch {
    return res.status(503).json({ error: 'result_pending', retryAfter: 30 });
  }
}
