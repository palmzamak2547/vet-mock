#!/usr/bin/env node
// Writes vetmock.com's Digital Asset Links file: which signing certificates may open vetmock.com links in the app
// (App Links, the sign-in return) and use its passkeys. The wizard calls it with Play's app signing certificate and
// the owner's upload certificate (both public fingerprints).
//   node mobile/scripts/assetlinks.mjs <out.json> <SHA-256> [<SHA-256> ...]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const [out, ...prints] = process.argv.slice(2);
const valid = prints.filter((p) => /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/i.test(p)).map((p) => p.toUpperCase());
if (!out || !valid.length) {
  console.error('usage: assetlinks.mjs <out.json> <SHA-256 AA:BB:...> [...]');
  process.exit(1);
}
const links = [{
  relation: ['delegate_permission/common.handle_all_urls', 'delegate_permission/common.get_login_creds'],
  target: { namespace: 'android_app', package_name: 'com.vetmock.app', sha256_cert_fingerprints: [...new Set(valid)] },
}];
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(links, null, 2)}\n`);
console.log(`wrote ${out} (${valid.length} certificate${valid.length > 1 ? 's' : ''})`);
