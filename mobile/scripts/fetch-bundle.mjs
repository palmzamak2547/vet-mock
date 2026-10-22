#!/usr/bin/env node
// ============================================================
// Fill mobile/www with the build the app ships
// ============================================================
// From production by default, so the app carries exactly the files vetmock.com
// serves (with production's environment baked in), or from a local build for
// CI and measurements. Every file is checked against dist/app-bundle.json
// (scripts/app-bundle-manifest.mjs) before it is kept. Then `npx cap sync android`.
//
//   node scripts/fetch-bundle.mjs                   https://vetmock.com
//   node scripts/fetch-bundle.mjs --dist ../dist    a local `npm run build`
// ============================================================

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const www = resolve(here, '..', 'www');
const args = process.argv.slice(2);
const distArg = args.includes('--dist') ? resolve(args[args.indexOf('--dist') + 1]) : null;
const origin = args.includes('--origin') ? args[args.indexOf('--origin') + 1] : 'https://vetmock.com';

const sha = (bytes) => createHash('sha256').update(bytes).digest('base64url');

async function get(path) {
  const url = `${origin}/${path.split('/').map(encodeURIComponent).join('/')}`;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt >= 3) throw new Error(`${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

const manifestText = distArg
  ? readFileSync(join(distArg, 'app-bundle.json'), 'utf8')
  : (await get('app-bundle.json')).toString('utf8');
const manifest = JSON.parse(manifestText);

rmSync(www, { recursive: true, force: true });
let bytes = 0;
const queue = [...manifest.files];
async function worker() {
  for (let entry = queue.shift(); entry; entry = queue.shift()) {
    const [path, hash] = entry;
    const data = distArg ? readFileSync(join(distArg, path)) : await get(path);
    if (sha(data) !== hash) throw new Error(`${path}: hash differs from the manifest (a deploy landed mid-download? run again)`);
    const target = join(www, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, data);
    bytes += data.length;
  }
}
await Promise.all(Array.from({ length: distArg ? 1 : 8 }, worker));
writeFileSync(join(www, 'app-bundle.json'), manifestText);
console.log(`mobile/www: build ${manifest.build}, ${manifest.files.length} files, ${(bytes / 1e6).toFixed(1)} MB, from ${distArg || origin}`);
