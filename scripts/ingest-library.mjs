// ============================================================
// ingest-library.mjs — MyCourseVille material → R2 → library_docs
// ============================================================
// Reads a manifest of course materials, mirrors the bytes into R2, and
// writes one catalog row per file. Designed to be run again and again:
// keys are content-addressed by sha256, so a re-run of an unchanged file
// uploads nothing and inserts nothing.
//
// WHY THIS SHAPE
//
//   The bytes are ~16 GB across ~3,600 files. Supabase Storage on this
//   project's free plan gives 1 GB, so the shelf goes to R2: 10 GB free,
//   $0.015/GB-month after, and NO egress charge — the part that matters
//   when a hundred students open the same deck before an exam.
//
//   Every row lands `status: 'restricted'`, which means /api/library-file
//   refuses to sign a link without a session. That is the posture this
//   material needs: these are faculty lecture decks, and the standing rule
//   is that this project does not host them in the open.
//
// USAGE
//
//   node scripts/ingest-library.mjs --manifest=.mcv/manifest.json --dry-run
//   node scripts/ingest-library.mjs --manifest=.mcv/manifest.json
//
// The manifest is written by scripts/mcv-manifest.mjs from the
// MyCourseVille MCP, so the network-facing half and the credential-facing
// half stay separable — you can inspect exactly what is about to be
// mirrored before anything is uploaded.
//
// ENV (never committed):
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
//   SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { presign, r2Config } from '../api/_lib/r2.js';

const arg = (name, fallback = null) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const DRY = process.argv.includes('--dry-run');
const LIMIT = Number(arg('limit', '0')) || Infinity;

// MyCourseVille hands back Thai filenames with the escapes already
// flattened — "u0e15u0e23u0e35_Esophageal_2025.pdf" is ตรี_Esophageal.
// Left alone, every Thai-named deck in the shelf is unsearchable.
export function decodeThaiEscapes(s) {
  return String(s || '').replace(/(?:u0e[0-9a-f]{2})+/gi, (run) =>
    (run.match(/u0e[0-9a-f]{2}/gi) || [])
      .map((c) => String.fromCharCode(parseInt(c.slice(1), 16)))
      .join(''),
  );
}

/** The same flattening happens in the URL, and there it is fatal.
 *
 *  MyCourseVille hands back
 *    .../materials/u0e15u0e23u0e35_Esophageal_2025-838816-1756.pdf
 *  where the real S3 key is "ตรี_Esophageal_...". Requested as given, S3
 *  answers 403 — not 404 — so it reads like a permissions problem rather
 *  than a wrong key, and EVERY Thai-named file in the shelf would have
 *  failed silently. In a Thai curriculum that is ตารางสอน, ตารางสอบ,
 *  แบบฝึกหัด, เฉลย… a large share of the material.
 *
 *  Returns the repaired URL, or null when nothing needed repairing. The
 *  caller tries the original first, so if MyCourseVille ever fixes their
 *  side this quietly stops being used.
 */
export function repairMcvUrl(url) {
  const s = String(url || '');
  const i = s.lastIndexOf('/') + 1;
  if (i <= 0) return null;
  const [file, query = ''] = s.slice(i).split(/(\?.*)$/, 2);
  const decoded = decodeThaiEscapes(file);
  if (decoded === file) return null;
  return s.slice(0, i) + encodeURIComponent(decoded) + query;
}

/** Fetch, retrying once with the repaired URL when the key looks mangled. */
export async function fetchMaterial(url, fetchImpl = fetch) {
  let res = await fetchImpl(url, { signal: AbortSignal.timeout(120_000) });
  if (res.ok) return res;
  if (res.status === 403 || res.status === 404) {
    const repaired = repairMcvUrl(url);
    if (repaired) {
      const second = await fetchImpl(repaired, { signal: AbortSignal.timeout(120_000) });
      if (second.ok) return second;
      return second;
    }
  }
  return res;
}

export function slugify(title, sha) {
  const base = decodeThaiEscapes(title)
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'doc';
  return `${base}-${sha.slice(0, 6)}`;
}

const MIME = {
  pdf: 'application/pdf', mp4: 'video/mp4', m4a: 'audio/mp4', mp3: 'audio/mpeg',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', zip: 'application/zip',
};
export const mimeFor = (name) => MIME[String(name).split('.').pop().toLowerCase()] || 'application/octet-stream';

// 'slide' for a lecture deck, 'other' for the heart-sound clips and
// anything else. The check constraint has no 'media' and inventing one
// would need a migration for no gain.
export const kindFor = (folder, name) => {
  const f = `${folder} ${name}`.toLowerCase();
  if (/lecture|slide|บรรยาย/.test(f)) return 'slide';
  if (/past ?paper|ข้อสอบ|exam/.test(f)) return 'pastpaper';
  if (/guideline|แนวทาง/.test(f)) return 'guideline';
  if (/summary|สรุป/.test(f)) return 'summary';
  if (/\.(mp4|mp3|m4a|png|jpe?g)$/i.test(name)) return 'other';
  return 'handout';
};

async function sb(path, init = {}) {
  const base = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing');
  const r = await fetch(`${base}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!r.ok) throw new Error(`supabase ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.status === 204 ? null : r.json();
}

async function main() {
  const manifestPath = arg('manifest');
  if (!manifestPath) {
    console.error('usage: node scripts/ingest-library.mjs --manifest=<file.json> [--dry-run] [--limit=N]');
    process.exit(1);
  }
  const items = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const cfg = r2Config();
  if (!DRY && !cfg.configured) {
    console.error('✗ R2 is not configured. Set R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY.');
    process.exit(1);
  }

  // One round trip for everything already shelved, so a re-run costs one
  // query rather than one per file.
  const known = new Set();
  if (!DRY) {
    for (const row of await sb('library_docs?select=sha256_16')) known.add(row.sha256_16);
  }

  let uploaded = 0, skipped = 0, failed = 0, bytes = 0;
  const n = Math.min(items.length, LIMIT);
  for (let i = 0; i < n; i++) {
    const it = items[i];
    const name = decodeThaiEscapes(it.name || '');
    try {
      // Google Drive links are not ours to mirror and cannot be fetched
      // without a browser session; they stay as catalog rows pointing home.
      if (!/^https?:\/\/mycourseville/i.test(it.url)) { skipped++; continue; }

      const res = await fetchMaterial(it.url);
      if (!res.ok) { failed++; console.warn(`  ✗ ${res.status} ${name}`); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (!buf.length) { failed++; console.warn(`  ✗ empty ${name}`); continue; }

      const sha = createHash('sha256').update(buf).digest('hex').slice(0, 16);
      if (known.has(sha)) { skipped++; continue; }

      const ext = (it.url.split('?')[0].split('.').pop() || 'bin').toLowerCase().slice(0, 5);
      const key = `docs/${sha}/${slugify(name, sha)}.${ext}`;
      const mime = mimeFor(it.url.split('?')[0]);

      if (DRY) {
        console.log(`  would upload ${(buf.length / 1048576).toFixed(1)} MB  ${key}`);
      } else {
        const put = presign(key, { method: 'PUT', expiresIn: 900 });
        const up = await fetch(put, { method: 'PUT', body: buf, headers: { 'Content-Type': mime } });
        if (!up.ok) { failed++; console.warn(`  ✗ r2 ${up.status} ${name}`); continue; }

        await sb('library_docs', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates' },
          body: JSON.stringify({
            slug: slugify(name, sha), title: name || key, kind: kindFor(it.folder, name),
            subject: it.subject || null, year: it.year ?? null, semester: it.semester ?? null,
            academic_year: it.academicYear ?? null,
            storage_provider: 'r2', storage_bucket: cfg.bucket, storage_key: key,
            mime, byte_size: buf.length, sha256_16: sha,
            // Faculty teaching material, mirrored for the cohort that was
            // taught it. Never 'public' — /api/library-file will not sign a
            // link for a restricted row without a session.
            license: 'instructor-permission', status: 'restricted',
            source_url: it.url, attribution: it.attribution || 'คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย',
          }),
        });
        known.add(sha);
      }
      uploaded++; bytes += buf.length;
      if (uploaded % 25 === 0) console.log(`  ${uploaded} files, ${(bytes / 1073741824).toFixed(2)} GB`);
    } catch (e) {
      failed++;
      console.warn(`  ✗ ${name}: ${String(e.message).slice(0, 100)}`);
    }
  }

  console.log(`\n${DRY ? '[dry run] ' : ''}${uploaded} shelved · ${skipped} already there or not mirrorable · ${failed} failed · ${(bytes / 1073741824).toFixed(2)} GB`);
  if (failed) process.exitCode = 1;
}

// argv[1] is undefined when this module is imported rather than run, and
// reading .replace off it took the whole module down with it.
const entry = process.argv[1]?.replace(/\\/g, '/');
if (entry && import.meta.url.endsWith(entry.split('/').pop())) main();
