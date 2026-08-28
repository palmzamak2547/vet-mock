// ============================================================
// r2-setup.mjs — create the library bucket and say exactly what is missing.
// ============================================================
// Everything after the one dashboard step (enabling R2 on the account,
// which Cloudflare only offers in the browser) is API work, so this does
// it: verify the token, create the bucket if absent, mint temp
// credentials once as the end-to-end proof.
//
//   node --env-file=.r2env scripts/r2-setup.mjs
//
// .r2env holds CLOUDFLARE_API_TOKEN + R2_ACCOUNT_ID and is git-ignored.

import { cfConfig, tempCredentials, presignWith } from '../api/_lib/r2.js';

const cfg = cfConfig();
if (!cfg.configured) {
  console.error('✗ CLOUDFLARE_API_TOKEN / R2_ACCOUNT_ID missing (node --env-file=.r2env …)');
  process.exit(1);
}

const api = async (path, init = {}) => {
  const r = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${cfg.apiToken}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

const verify = await api('/user/tokens/verify');
console.log(`token: ${verify.body?.result?.status || 'invalid'}`);
if (verify.body?.result?.status !== 'active') process.exit(1);

const list = await api(`/accounts/${cfg.accountId}/r2/buckets`);
if (!list.body.success) {
  const msg = (list.body.errors || []).map((e) => e.message).join('; ');
  if (/enable R2/i.test(msg)) {
    console.error('✗ R2 is not enabled on this Cloudflare account yet.');
    console.error('  One-time, dashboard-only: dash.cloudflare.com → R2 → Enable.');
    console.error('  Everything else here runs itself the moment that is done.');
  } else {
    console.error(`✗ ${msg}`);
  }
  process.exit(1);
}

const names = (list.body.result?.buckets || []).map((b) => b.name);
console.log(`buckets: ${names.join(', ') || '(none)'}`);

if (!names.includes(cfg.bucket)) {
  const made = await api(`/accounts/${cfg.accountId}/r2/buckets`, {
    method: 'POST',
    body: JSON.stringify({ name: cfg.bucket }),
  });
  if (!made.body.success) {
    console.error(`✗ create ${cfg.bucket}: ${(made.body.errors || []).map((e) => e.message).join('; ')}`);
    process.exit(1);
  }
  console.log(`created bucket ${cfg.bucket} (private by default — no public access, no custom domain)`);
} else {
  console.log(`bucket ${cfg.bucket} already exists`);
}

// End-to-end proof: mint read-only temp credentials and presign a URL.
// The object does not need to exist — a well-formed 404-able URL proves
// the whole signing chain; a 403 would mean the chain is broken.
const creds = await tempCredentials({ ttlSeconds: 300 });
const probe = presignWith(creds, 'docs/_setup-probe/never-uploaded.pdf', { expiresIn: 60 });
const res = await fetch(probe, { method: 'GET' });
console.log(`presign probe: HTTP ${res.status} ${res.status === 404 ? '(correct — signed request reached the bucket)' : res.status === 403 ? '(SIGNING BROKEN)' : ''}`);
process.exit(res.status === 404 ? 0 : 1);
