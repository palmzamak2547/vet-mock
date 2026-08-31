// ============================================================
// ingest-local-docs.mjs — put files that are already on this machine
// into the study library
// ============================================================
//
// The two existing paths do not cover this case. ingest-library.mjs mirrors
// MyCourseVille and refuses anything whose URL is not mycourseville.
// upload-library-doc.mjs takes a local file but hardcodes application/pdf in
// three places and, for R2, only VERIFIES an object someone else uploaded out
// of band (it needs LIBRARY_CDN_BASE, which this project does not set — the
// live shelf mints presigned reads instead of serving from a public origin).
//
// So this script does the one thing neither does: local bytes → R2 → catalog
// row, over the SAME presign helper the app itself reads through, with the
// SAME content-addressed key shape (docs/<sha256_16>/<name>) so a re-run of an
// unchanged file uploads nothing and inserts nothing.
//
// MIME matters here and is not cosmetic. The reader picks how to open a
// document from its mime family (lib/library.js docOpenMode): PDFs open in the
// in-app reader, Office files download. Filing a .pptx as application/pdf
// hands it to pdf.js, which is exactly the breakage fixed on 2026-08-29.
//
// USAGE
//   node scripts/ingest-local-docs.mjs --manifest=<file.json> [--dry-run]
//
// Manifest = array of { path, title, subject, year, semester, academicYear,
//                       kind, lecturer, description, sequence, license,
//                       attribution, permissionEvidence, status, topics }
//
// Rows are written with the Supabase REST API using SUPABASE_SERVICE_ROLE_KEY
// when present; without it the script stops after upload and prints the rows,
// so they can be inserted through an authenticated admin path instead. It will
// not invent a row for bytes it has not confirmed are readable.
// ============================================================

import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import { presignAny, r2Config, cfConfig } from '../api/_lib/r2.js';

// R2 accepts writes two ways and this project only ever has ONE of them.
// A presigned PUT needs permanent S3 keys; the standing CLOUDFLARE_API_TOKEN
// cannot mint temporary ones (R2's temp-credential endpoint requires a parent
// access key — probed and documented in api/_lib/blob-token.js), so asking for
// them fails with a misleading "JSON not well formed". The REST object API
// takes the same token and writes fine. ingest-library.mjs already chose this
// way; both ingest paths now agree, and either switches back to presigned PUT
// by itself the day permanent keys land in the env.
const objectUrl = (key) =>
  `https://api.cloudflare.com/client/v4/accounts/${cfConfig().accountId}`
  + `/r2/buckets/${encodeURIComponent(process.env.R2_BUCKET || 'vetmock-library')}`
  + `/objects/${key.split('/').map(encodeURIComponent).join('/')}`;

async function r2Put(key, bytes, mime) {
  if (r2Config().configured) {
    const put = await presignAny(key, { method: 'PUT', expiresIn: 900 });
    return fetch(put, { method: 'PUT', body: bytes, headers: { 'Content-Type': mime } });
  }
  return fetch(objectUrl(key), {
    method: 'PUT',
    body: bytes,
    headers: { Authorization: `Bearer ${cfConfig().apiToken}`, 'Content-Type': mime },
  });
}

async function r2Head(key) {
  if (r2Config().configured) {
    const url = await presignAny(key, { method: 'GET', expiresIn: 120 });
    return fetch(url, { method: 'HEAD' });
  }
  // The REST API has no HEAD; a GET is the only way to learn the real size,
  // and reading back is the whole point — a PUT's own 200 is not evidence.
  return fetch(objectUrl(key), { headers: { Authorization: `Bearer ${cfConfig().apiToken}` } });
}

const arg = (n, d = null) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const DRY = process.argv.includes('--dry-run');

// Mirrors scripts/ingest-library.mjs so both ingest paths agree on what a
// file IS — a shelf where the same extension means two things to two scripts
// is a shelf that opens the same deck two different ways.
const MIME = {
  pdf: 'application/pdf',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ppt: 'application/vnd.ms-powerpoint',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', mp4: 'video/mp4', zip: 'application/zip',
};
const mimeFor = (name) => MIME[String(name).split('.').pop().toLowerCase()] || 'application/octet-stream';

const hash16 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 16);

// Keep the object name ASCII-safe: S3 signing and Thai filenames have bitten
// this repo before. The Thai title lives in the catalog row, which is what
// search and the card read anyway.
function safeObjectName(p) {
  const base = basename(p);
  const ext = (base.split('.').pop() || 'bin').toLowerCase().slice(0, 5);
  const stem = base.slice(0, base.length - ext.length - 1)
    .normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 60) || 'document';
  return `${stem}.${ext}`;
}

// Identical rule to ingest-library.mjs, Thai range included. Stripping Thai
// (the obvious ASCII-only slugify) turns every Thai-titled deck into
// "doc-7eba88" — six of the twelve in the first run — while the 1,495 rows
// already on the shelf carry readable Thai slugs. One shelf, one rule.
function slugify(title, sha) {
  const base = String(title).toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'doc';
  return `${base}-${sha.slice(0, 6)}`;
}

async function pdfPageCount(bytes, mime) {
  if (mime !== 'application/pdf') return null;
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes), disableWorker: true }).promise;
    const n = doc.numPages;
    await doc.destroy();
    return n;
  } catch { return null; }
}

async function main() {
  const manifestPath = arg('manifest');
  if (!manifestPath || !existsSync(manifestPath)) {
    console.error('usage: node scripts/ingest-local-docs.mjs --manifest=<file.json> [--dry-run]');
    process.exit(1);
  }
  const items = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const rows = [];
  let uploaded = 0; let reused = 0;

  for (const it of items) {
    if (!existsSync(it.path)) { console.error(`✖ missing: ${it.path}`); process.exit(1); }
    const bytes = readFileSync(it.path);
    const sha = hash16(bytes);
    const mime = mimeFor(it.path);
    const key = `docs/${sha}/${safeObjectName(it.path)}`;
    const pages = await pdfPageCount(bytes, mime);
    const sizeMb = (bytes.length / 1048576).toFixed(1);

    console.log(`\n${it.title}`);
    console.log(`  ${sizeMb} MB · ${mime.split(/[/.]/).pop()} · ${pages ?? '—'} pages · ${sha}`);

    if (DRY) {
      rows.push({ key, mime, sha, pages, size: bytes.length, title: it.title });
      continue;
    }

    // Content-addressed: if the object is already there, the bytes are
    // identical by construction, so re-uploading would be a no-op with a cost.
    const head = await r2Head(key).catch(() => null);
    if (head?.ok) {
      console.log('  already in R2 — reusing');
      reused++;
    } else {
      const res = await r2Put(key, bytes, mime);
      if (!res.ok) {
        console.error(`  ✖ upload failed ${res.status} ${(await res.text()).slice(0, 200)}`);
        process.exit(1);
      }
      // Never trust the PUT's own 200 — read it back before writing a row that
      // claims a student can open it.
      const verify = await r2Head(key);
      const got = Number(verify.headers.get('content-length') || 0);
      if (!verify.ok || got !== bytes.length) {
        console.error(`  ✖ readback mismatch: ${verify.status}, ${got} of ${bytes.length} bytes`);
        process.exit(1);
      }
      console.log(`  uploaded + verified (${got} bytes)`);
      uploaded++;
    }

    rows.push({
      slug: slugify(it.title, sha),
      title: it.title,
      description: it.description ?? null,
      kind: it.kind || 'slide',
      subject: it.subject,
      year: it.year ?? null,
      semester: it.semester ?? null,
      academic_year: it.academicYear ?? null,
      cohort: it.cohort ?? null,
      lecturer: it.lecturer ?? null,
      topics: it.topics || [],
      sequence: it.sequence ?? 0,
      lang: it.lang || 'th',
      storage_provider: 'r2',
      storage_bucket: process.env.R2_BUCKET || 'vetmock-library',
      storage_key: key,
      mime,
      byte_size: bytes.length,
      page_count: pages,
      sha256_16: sha,
      linearized: mime === 'application/pdf'
        ? bytes.subarray(0, 4096).toString('latin1').includes('/Linearized')
        : false,
      license: it.license || 'instructor-permission',
      source_url: it.sourceUrl ?? null,
      attribution: it.attribution || 'คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย',
      permission_evidence: it.permissionEvidence ?? null,
      status: it.status || 'public',
    });
  }

  console.log(`\n— ${DRY ? 'dry run' : `${uploaded} uploaded, ${reused} reused`} —`);
  const out = arg('rows-out', 'library-rows.json');
  const { writeFileSync } = await import('node:fs');
  writeFileSync(out, JSON.stringify(rows, null, 2));
  console.log(`rows written to ${out} (${rows.length})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
