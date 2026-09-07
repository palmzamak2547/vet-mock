import { createHmac } from 'node:crypto';

export function backendConfig(env = process.env) {
  return { url: env.VITE_SUPABASE_URL || env.SUPABASE_URL, key: env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY };
}

export async function authenticatedUser(req, env = process.env) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!/^[A-Za-z0-9._~-]{20,4096}$/.test(token)) return null;
  const { url, key } = backendConfig(env);
  if (!url || !key) throw new Error('backend-unavailable');
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000),
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error('backend-unavailable');
  const user = await response.json();
  return user?.id ? { userId: user.id, token } : null;
}

export function signAppPayload(purpose, data, env = process.env) {
  const key = env.VETMOCK_RPC_SIGNING_KEY;
  if (!key) throw new Error('signing-unavailable');
  const payload = JSON.stringify({ purpose, issuedAt: Math.floor(Date.now() / 1000), data });
  return { payload, signature: createHmac('sha256', key).update(payload).digest('hex') };
}

export async function signedRpc(name, purpose, data, token, env = process.env) {
  const { url, key } = backendConfig(env);
  if (!url || !key) throw new Error('backend-unavailable');
  const signed = signAppPayload(purpose, data, env);
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST', headers: { apikey: key, Authorization: `Bearer ${token || key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_payload: signed.payload, p_signature: signed.signature }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    const error = new Error('write-unavailable');
    error.status = response.status;
    throw error;
  }
  return response.json();
}
