// rows.ndjson → library_docs, through the one-time bulk RPC.
//   node --env-file=.r2env scripts/load-rows.mjs
// Safe to run repeatedly: the RPC is ON CONFLICT (slug) DO NOTHING, and
// the function forces status/provider/bucket server-side.
import { readFileSync } from 'node:fs';

const secret = process.env.LIBRARY_INGEST_SECRET;
if (!secret) { console.error('LIBRARY_INGEST_SECRET missing'); process.exit(1); }
const anon = readFileSync('.env.local', 'utf8').match(/^VITE_SUPABASE_ANON_KEY=(.+)$/m)?.[1]?.trim();
const rows = readFileSync(process.argv[2] || '.mcv/rows.ndjson', 'utf8')
  .trim().split('\n').filter(Boolean).map(JSON.parse)
  .map(({ storage_provider, storage_bucket, status, ...keep }) => keep);

let inserted = 0;
for (let i = 0; i < rows.length; i += 200) {
  const batch = rows.slice(i, i + 200);
  const r = await fetch('https://mpovsdzdggvksmeehqfj.supabase.co/rest/v1/rpc/library_bulk_upsert', {
    method: 'POST',
    headers: { apikey: anon, Authorization: `Bearer ${anon}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_secret: secret, p_rows: batch }),
  });
  if (!r.ok) { console.error(`batch ${i / 200}: ${r.status} ${(await r.text()).slice(0, 160)}`); process.exit(1); }
  const n = await r.json();
  inserted += n;
  console.log(`  batch ${i / 200}: +${n}`);
}
console.log(`${inserted} row(s) inserted of ${rows.length} sent (rest already present)`);
