#!/usr/bin/env node
// Time the API the way a student meets it, against a live site (docs/releases/5.180.0.md).
//   node scripts/probe-api-latency.mjs [--base=https://vetmock.com] [--runs=3] [slug...]
// For each public deck slug: the mint (/api/library-file) and the file it links to, each with the
// region that answered (x-vercel-id: edge::function). Without slugs, three public 1.5 MB decks.
// Then the time to first byte of two cheap calls: /api/tts answering 405 (no outside call) and
// /api/playlist answering 400 after one limiter call; their difference is one limiter round trip.
// Plain fetch from Node, a fresh query string per run so no edge cache answers.
const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3) ?? d;
const BASE = opt('base', 'https://vetmock.com');
const RUNS = Number(opt('runs', 3));
const given = args.filter((a) => !a.startsWith('--'));
const slugs = given.length ? given : ['insecticides-122e66', 'inflammatory-bowel-disease-ibd-39b351', 'lab-ha-amp-hi-test-handout-at-4a1fa5'];
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const hop = (r) => (r.headers.get('x-vercel-id') || '').split('::').slice(0, 2).join('>');
const fresh = (i) => `_=${Date.now()}${i}`;

const opens = [];
for (let i = 0; i < RUNS; i++) {
  for (const slug of slugs) {
    const t0 = performance.now();
    const mint = await fetch(`${BASE}/api/library-file?slug=${encodeURIComponent(slug)}&${fresh(i)}`);
    const body = await mint.json().catch(() => ({}));
    const t1 = performance.now();
    if (!body.url) { console.log(`${slug}: mint ${mint.status} ${JSON.stringify(body).slice(0, 120)}`); continue; }
    const file = await fetch(new URL(body.url, BASE));
    const bytes = (await file.arrayBuffer()).byteLength;
    const t2 = performance.now();
    opens.push({ mint: t1 - t0, file: t2 - t1, bytes });
    console.log(`${slug.slice(0, 30).padEnd(30)} mint ${(t1 - t0).toFixed(0).padStart(5)} ms (${hop(mint)})  file ${(t2 - t1).toFixed(0).padStart(5)} ms (${hop(file)}) ${(bytes / 1e6).toFixed(2)} MB`);
  }
}
if (opens.length) console.log(`open median: mint ${med(opens.map((o) => o.mint)).toFixed(0)} ms, file ${med(opens.map((o) => o.file)).toFixed(0)} ms, total ${med(opens.map((o) => o.mint + o.file)).toFixed(0)} ms (n=${opens.length})`);

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
