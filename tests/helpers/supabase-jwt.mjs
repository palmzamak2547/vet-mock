// A token shaped like a Supabase session token, for tests of the API gate
// (api/_lib/chula-gate.js reads the issuer, audience, subject and expiry
// before it asks the database). The signature is not real: the database stub
// in each test decides what it accepts.
export function sessionToken(projectUrl, { sub = 'u-test', expInSec = 3600, aud = 'authenticated', iss, tag = '' } = {}) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const header = b64({ alg: 'ES256', typ: 'JWT' });
  const payload = b64({ iss: iss ?? `${String(projectUrl).replace(/\/+$/, '')}/auth/v1`, aud, sub, exp: Math.floor(Date.now() / 1000) + expInSec, role: 'authenticated', ...(tag ? { tag } : {}) });
  return `${header}.${payload}.${Buffer.from(`sig-${sub}-${tag}`).toString('base64url')}`;
}
