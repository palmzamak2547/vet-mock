#!/usr/bin/env node
// Time the API the way a student meets it, against a live site (docs/releases/5.180.0.md).
//   VMX_PROBE_TOKEN=<access token> node scripts/probe-api-latency.mjs [--base=https://vetmock.com] [--runs=3] [slug...]
// The Chula wall (api/_lib/chula-gate.js) answers a guest's mint with 401, so the library open is
// measured only with a signed-in Chula member's Supabase access token in VMX_PROBE_TOKEN: the
// access_token in that tab's localStorage `sb-<project ref>-auth-token`, good for about an hour.
// Pass it in the environment, never as an argument.
// For each public deck slug, the open as the client does it today (src/lib/library.js): a mint
// (/api/library-file) without the token, which the wall answers 401, the mint with it, and the
// file it links to, each with the region that answered (x-vercel-id: edge::function). Without
// slugs, three public 1.5 MB decks. The gate remembers a member for 60 s per instance and does not
// renew it on a hit, so a student opening one deck now and then meets the first mint (the
// membership check); the median of the rest is the best case.
// Then the time to first byte of two cheap calls that answer before any wall, for everyone:
// /api/tts answering 405 (no outside call) and /api/playlist answering 400 after one limiter call;
// their difference is one limiter round trip.
// Plain fetch from Node, a fresh query string per run so no edge cache answers.
const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d;
const BASE = opt('base', 'https://vetmock.com');
const RUNS = Number(opt('runs', 3));
const TOKEN = (process.env.VMX_PROBE_TOKEN || '').trim();
// Only a bare access token goes further. One pasted across lines, or the whole session value,
// would otherwise reach a header, and the error that follows prints it.
if (TOKEN && !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(TOKEN)) {
  console.error('VMX_PROBE_TOKEN is not a bare access token (three base64url parts on one line): take access_token alone');
  process.exit(2);
}
// A member's token goes to VetMock only: production, this team's previews, or a local API.
if (TOKEN && !/^(https:\/\/([a-z0-9-]+\.)*vetmock\.com|https:\/\/vetmock-[a-z0-9-]+-palmzamak2547s-projects\.vercel\.app|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/.test(new URL(BASE).origin)) {
  console.error(`not sending a member token to ${new URL(BASE).origin}`);
  process.exit(2);
}
const expiresIn = (() => { try { return JSON.parse(Buffer.from(TOKEN.split('.')[1], 'base64url')).exp - Date.now() / 1000; } catch { return NaN; } })();
if (TOKEN && !(expiresIn > 60)) {
  console.error('VMX_PROBE_TOKEN is not a live access token (expired, or not a JWT), so no open would be measured');
  process.exit(2);
}
console.log(TOKEN ? `member token, expires in ${Math.round(expiresIn / 60)} min`
  : 'no VMX_PROBE_TOKEN: the Chula wall answers a guest\'s mint with 401, so the library open is not measured');
const given = args.filter((a) => !a.startsWith('--'));
const slugs = given.length ? given : ['insecticides-122e66', 'inflammatory-bowel-disease-ibd-39b351', 'lab-ha-amp-hi-test-handout-at-4a1fa5'];
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const hop = (r) => (r.headers.get('x-vercel-id') || '').split('::').slice(0, 2).join('>');
const fresh = (i) => `_=${Date.now()}${i}`;

const opens = [];
for (let i = 0; TOKEN && i < RUNS; i++) {
  for (const slug of slugs) {
    const url = `${BASE}/api/library-file?slug=${encodeURIComponent(slug)}&${fresh(i)}`;
    const tg = performance.now();
    const guest = await fetch(`${url}g`);
    await guest.arrayBuffer();
    const t0 = performance.now();
    const mint = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const body = await mint.json().catch(() => ({}));
    const t1 = performance.now();
    // A refusal is not an open, so nothing is timed. It names where it came from: a base that
    // redirects (www to the apex) drops the token on the way, and library-file has refusals of its own.
    if (mint.status === 401 || mint.status === 403) {
      console.error(`mint ${mint.status} ${body.error || ''} from ${new URL(mint.url).origin}: refused, so no open is measured`);
      process.exit(1);
    }
    if (!body.url) { console.log(`${slug}: mint ${mint.status} ${JSON.stringify(body).slice(0, 120)}`); continue; }
    // The link is its own authorization (a presigned or ticketed URL), so the token stays off it.
    const file = await fetch(new URL(body.url, BASE));
    const bytes = (await file.arrayBuffer()).byteLength;
    const t2 = performance.now();
    if (!file.ok) { console.log(`${slug}: file ${file.status}, not counted`); continue; }
    opens.push({ guest: t0 - tg, guestStatus: guest.status, mint: t1 - t0, file: t2 - t1, bytes });
    console.log(`${slug.slice(0, 30).padEnd(30)} tokenless ${(t0 - tg).toFixed(0).padStart(5)} ms  mint ${(t1 - t0).toFixed(0).padStart(5)} ms (${hop(mint)})  file ${(t2 - t1).toFixed(0).padStart(5)} ms (${hop(file)}) ${(bytes / 1e6).toFixed(2)} MB`);
  }
}
if (opens.length) {
  const m = (k) => med(opens.map(k)).toFixed(0);
  console.log(`open median: ${m((o) => o.guest + o.mint + o.file)} ms as the client opens today (tokenless ${m((o) => o.guest)}, mint ${m((o) => o.mint)}, file ${m((o) => o.file)}), n=${opens.length}; first mint ${opens[0].mint.toFixed(0)} ms with the membership check`);
  if (opens.some((o) => o.guestStatus !== 401)) console.log('note: a tokenless mint did not answer 401 (wall off?), and there the client opens without minting again');
}

for (const path of ['/api/tts', '/api/playlist']) {
  const ttfb = [];
  let where = '';
  for (let i = 0; i < RUNS * 3 + 1; i++) {
    const t0 = performance.now();
    const r = await fetch(`${BASE}${path}?${fresh(i)}`);
    ttfb.push(performance.now() - t0);
    where = `${r.status} ${hop(r)}`;
    await r.arrayBuffer();
  }
  ttfb.shift(); // the first can be a cold start
  console.log(`${path.padEnd(14)} first byte median ${med(ttfb).toFixed(0)} ms (n=${ttfb.length}, ${where})`);
}
