// Restore a verified VCA archive without contacting Google Drive.
// Usage: node scripts/restore-vca-archive.mjs --manifest <manifest.json> --out <directory>
// The manifest is stored independently in the private R2 bucket; see docs/vca-archive.md.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { mintBlobToken } from '../api/_lib/blob-token.js';

const arg = (name) => process.argv[process.argv.indexOf(name) + 1];
if (!process.argv.includes('--manifest') || !process.argv.includes('--out')) {
  console.error('Usage: node scripts/restore-vca-archive.mjs --manifest <manifest.json> --out <directory>');
  process.exit(1);
}
const env = { ...process.env };
if (fs.existsSync('.r2env')) for (const line of fs.readFileSync('.r2env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const manifest = JSON.parse(fs.readFileSync(arg('--manifest'), 'utf8'));
if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.artifacts)) throw new Error('Unsupported manifest');
const root = path.resolve(arg('--out'));
await fsp.mkdir(root, { recursive: true });
const safe = (value) => String(value).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/[. ]+$/g, '').slice(0, 100) || 'unnamed';
async function sha256(file) {
  const hash = crypto.createHash('sha256');
  for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}
for (const item of manifest.artifacts) {
  if (!/^[a-f0-9]{64}$/.test(item.sha256) || !item.key?.startsWith('archives/vca/') || item.key.includes('..') || item.bucket !== env.R2_BUCKET) throw new Error('Invalid archive object');
  // A source-ID directory keeps same-name editions and editable/PDF exports distinct.
  const hierarchy = String(item.categories?.[0] || 'Unsorted').split('/').map(safe);
  const folder = path.resolve(root, ...hierarchy, safe(item.sourceId));
  if (!folder.startsWith(root + path.sep)) throw new Error('Unsafe restore path');
  await fsp.mkdir(folder, { recursive: true });
  const title = item.exported ? item.title.replace(/\.(pdf|docx|xlsx)$/i, '') + '.' + item.format : item.title;
  const extension = path.extname(title);
  const stem = extension ? title.slice(0, -extension.length) : title;
  const target = path.join(folder, safe(stem) + safe(extension || '').replace(/^unnamed$/, ''));
  if (fs.existsSync(target)) {
    if (await sha256(target) !== item.sha256) throw new Error(`Existing file differs; refusing overwrite: ${target}`);
    continue;
  }
  const token = mintBlobToken({ storage_bucket: item.bucket, storage_key: item.key, mime: item.mime, byte_size: item.bytes }, { env, ttlSeconds: 1800 });
  if (!token) throw new Error('Archive signing configuration missing');
  const response = await fetch('https://vetmock-library-archive.palmzamak2547.workers.dev/?' + new URLSearchParams(token));
  if (!response.ok) throw new Error(`Archive HTTP ${response.status}`);
  const partial = target + '.partial';
  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(partial));
  if (fs.statSync(partial).size !== item.bytes || await sha256(partial) !== item.sha256) throw new Error(`Integrity mismatch: ${item.sourceId}`);
  await fsp.rename(partial, target);
  console.log(`Verified ${item.sourceId} ${item.format}`);
}
await fsp.copyFile(arg('--manifest'), path.join(root, 'manifest.json'));
console.log(`Restored ${manifest.artifacts.length} source artifacts to ${root}`);
