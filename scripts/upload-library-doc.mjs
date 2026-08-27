#!/usr/bin/env node
// ============================================================
// upload-library-doc.mjs — add one document to the study library
// ============================================================
//
// The browser has no write path into public.library_docs on purpose (see
// 20260827000000_library_docs_init.sql): `license`, `status` and `storage_key`
// are authorization data, and a browser-writable row would let any signed-in
// account publish arbitrary bytes under the VetMock name. Ingest therefore runs
// here, under the service role, from a machine that already has the file.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//   node scripts/upload-library-doc.mjs <file.pdf> \
//     --title "สรีรวิทยาระบบหัวใจ" \
//     --kind handout --subject com5 --year 5 --semester 1 \
//     --academic-year 2026 --cohort "Vet 86" --lecturer "อ.ชื่ออาจารย์" \
//     --license "instructor-permission" \
//     --attribution "อ.ชื่ออาจารย์" \
//     --permission-evidence "อีเมลอนุญาต 2026-08-20" \
//     [--description "..."] [--topics cardio,ecg] [--source-url https://...] \
//     [--sequence 1] \
//     [--status draft|public|restricted] [--slug custom-slug] \
//     [--provider supabase|r2] [--dry-run]
//
// Storage keys are content-addressed — docs/<sha256_16>/<safe-name>.pdf — so
// uploading the same file twice resolves to the same object and the catalog's
// unique index turns a re-run into a visible conflict instead of a duplicate
// shelf entry.
// ============================================================

import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import { readFile, stat } from 'node:fs/promises';

const KINDS = ['handout', 'slide', 'summary', 'textbook', 'pastpaper', 'guideline', 'other'];
const STATUSES = ['draft', 'public', 'restricted', 'archived'];
const PROVIDERS = ['supabase', 'r2'];
const BUCKET = 'library-docs';

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') { flags.dryRun = true; continue; }
    if (a.startsWith('--')) {
      const key = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) fail(`flag ${a} needs a value`);
      flags[key] = value;
      i++;
      continue;
    }
    positional.push(a);
  }
  return { positional, flags };
}

// Matches src/lib/pdf-annotations.js hashFile(): SHA-256, first 16 hex chars.
// The reader keys its strokes on this, so the two MUST stay in step — a
// different slice here would orphan every annotation on the document.
function hash16(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

// A linearized ("fast web view") PDF puts a hint table at the front, so pdf.js
// can paint page 1 after ~100 KB of range requests instead of downloading the
// whole file. The marker lives in the first object of the file.
function isLinearized(buf) {
  return buf.subarray(0, 4096).toString('latin1').includes('/Linearized');
}

// Best-effort page count. Nullable in the schema, so a parse failure is not
// fatal — it only means the card omits "N หน้า".
async function countPages(bytes) {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const doc = await pdfjs.getDocument({ data: bytes, disableWorker: true }).promise;
    const n = doc.numPages;
    await doc.destroy();
    return n;
  } catch {
    return null;
  }
}

function slugify(input) {
  // \p{M} matters for Thai: vowel signs and tone marks (ั ่ ้ ิ …) are combining
  // marks, not letters, so a class of \p{L}\p{N} alone punches a hyphen through
  // the middle of every other Thai word.
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// Storage keys must satisfy src/lib/library.js isSafeStorageKey().
function safeObjectName(fileName) {
  const base = basename(fileName).replace(/\.pdf$/i, '');
  const slug = slugify(base) || 'document';
  return `${slug}.pdf`;
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const filePath = positional[0];
  if (!filePath) fail('missing <file.pdf>. See the header of this script for usage.');

  const provider = flags.provider || 'supabase';
  if (!PROVIDERS.includes(provider)) fail(`--provider must be one of ${PROVIDERS.join(' | ')}`);

  const kind = flags.kind || 'handout';
  if (!KINDS.includes(kind)) fail(`--kind must be one of ${KINDS.join(' | ')}`);

  const status = flags.status || 'draft';
  if (!STATUSES.includes(status)) fail(`--status must be one of ${STATUSES.join(' | ')}`);

  if (!flags.title) fail('--title is required');
  // license is NOT NULL in the schema and this is the point where a human is
  // still in the loop. Refusing here is cheaper than discovering an unlicensed
  // row after it is already public.
  if (!flags.license) {
    fail('--license is required. Use the licence name for open content (e.g. "cc-by-4.0", '
      + '"public-domain"), "instructor-permission" for material shared with consent, or '
      + '"internal-original" for VetMock\'s own writing. Anything else does not belong in the library.');
  }
  if (/permission/i.test(flags.license) && !flags.permissionEvidence) {
    fail('--permission-evidence is required when --license is a permission grant. '
      + 'Record where the permission is on file (e.g. "อีเมลจาก อ.X 2026-08-20").');
  }

  // Validate the browse dimensions here rather than letting Postgres reject the
  // insert after a 17 MB upload has already been paid for.
  const year = flags.year == null ? null : Number(flags.year);
  if (year != null && !(Number.isInteger(year) && year >= 1 && year <= 6)) {
    fail('--year must be an integer 1-6');
  }
  const semester = flags.semester == null ? null : Number(flags.semester);
  if (semester != null && ![1, 2, 3].includes(semester)) {
    fail('--semester must be 1 (ภาคต้น), 2 (ภาคปลาย) or 3 (ภาคฤดูร้อน)');
  }
  const academicYear = flags.academicYear == null ? null : Number(flags.academicYear);
  if (academicYear != null && !(Number.isInteger(academicYear) && academicYear >= 2000 && academicYear <= 2100)) {
    // 2569 lands here, which is the common mistake — say so rather than just
    // naming the range.
    fail('--academic-year must be a CE year: pass 2026, not the พ.ศ. 2569');
  }
  const sequence = flags.sequence == null ? 0 : Number(flags.sequence);
  if (!Number.isInteger(sequence)) fail('--sequence must be an integer');

  const info = await stat(filePath).catch(() => fail(`cannot read ${filePath}`));
  const bytes = await readFile(filePath);
  const sha = hash16(bytes);
  const linearized = isLinearized(bytes);
  const pageCount = await countPages(new Uint8Array(bytes));
  const objectName = safeObjectName(filePath);
  const storageKey = `docs/${sha}/${objectName}`;
  const slug = flags.slug || `${slugify(flags.title)}-${sha.slice(0, 6)}`;
  const sizeMb = info.size / (1024 * 1024);

  console.log(`  file        ${filePath}`);
  console.log(`  size        ${sizeMb.toFixed(1)} MB`);
  console.log(`  sha256_16   ${sha}`);
  console.log(`  pages       ${pageCount ?? 'unknown'}`);
  console.log(`  linearized  ${linearized ? 'yes' : 'NO'}`);
  console.log(`  key         ${storageKey}`);
  console.log(`  slug        ${slug}`);
  console.log(`  filed under ${[
    flags.subject || 'ไม่ระบุวิชา',
    year != null ? `ปี ${year}` : null,
    semester != null ? `เทอม ${semester}` : null,
    academicYear != null ? `ปีการศึกษา ${academicYear + 543}` : null,
  ].filter(Boolean).join(' · ')}`);

  if (!linearized) {
    console.warn(
      '\n⚠ Not linearized. The reader will download the whole file before showing page 1.\n'
      + `  Fix it first — it is usually a large win on a ${sizeMb.toFixed(0)} MB file:\n`
      + `    qpdf --linearize "${filePath}" out.pdf\n`
      + '  Scanned PDFs also shrink 5-10× with an image downsample pass first:\n'
      + '    gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH \\\n'
      + `       -sOutputFile=small.pdf "${filePath}"\n`,
    );
  }

  const row = {
    slug,
    title: flags.title,
    description: flags.description || null,
    kind,
    subject: flags.subject || null,
    year,
    semester,
    academic_year: academicYear,
    cohort: flags.cohort || null,
    lecturer: flags.lecturer || null,
    topics: flags.topics ? flags.topics.split(',').map((t) => t.trim()).filter(Boolean) : [],
    sequence,
    lang: flags.lang || 'th',
    storage_provider: provider,
    storage_bucket: provider === 'supabase' ? BUCKET : (flags.bucket || BUCKET),
    storage_key: storageKey,
    mime: 'application/pdf',
    byte_size: info.size,
    page_count: pageCount,
    sha256_16: sha,
    linearized,
    license: flags.license,
    source_url: flags.sourceUrl || null,
    attribution: flags.attribution || null,
    permission_evidence: flags.permissionEvidence || null,
    status,
  };

  if (flags.dryRun) {
    console.log('\n— dry run, nothing uploaded —');
    console.log(JSON.stringify(row, null, 2));
    return;
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    fail('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Never commit them.');
  }

  const { createClient } = await import('@supabase/supabase-js');
  const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

  if (provider === 'supabase') {
    console.log('\n→ uploading to Supabase Storage…');
    const { error } = await sb.storage.from(BUCKET).upload(storageKey, bytes, {
      contentType: 'application/pdf',
      // Content-addressed keys are immutable by construction, so a long
      // max-age is safe and lets the CDN and the browser keep the file.
      cacheControl: '31536000',
      upsert: false,
    });
    if (error && !/already exists/i.test(error.message)) fail(`upload failed: ${error.message}`);
    if (error) console.log('  object already present — reusing it');
  } else {
    // R2 objects are uploaded out of band (wrangler / rclone / any S3 client)
    // so this repo takes on no new dependency and no cloud credentials. What
    // the script will not do is insert a catalog row pointing at bytes that
    // are not actually reachable.
    const base = (process.env.LIBRARY_CDN_BASE || '').replace(/\/+$/, '');
    if (!base) fail('LIBRARY_CDN_BASE must be set to verify an R2 upload (e.g. https://files.example.com)');
    const objectUrl = `${base}/${storageKey}`;
    console.log(`\n→ checking ${objectUrl}`);
    const res = await fetch(objectUrl, { method: 'HEAD' }).catch(() => null);
    if (!res || !res.ok) {
      fail(
        `object not reachable (${res ? res.status : 'network error'}). Upload it first:\n`
        + `    npx wrangler r2 object put "${row.storage_bucket}/${storageKey}" \\\n`
        + `      --file "${filePath}" --content-type application/pdf \\\n`
        + '      --cache-control "public, max-age=31536000, immutable"\n'
        + '  then re-run this command.',
      );
    }
    if (res.headers.get('accept-ranges') !== 'bytes') {
      console.warn('⚠ object does not advertise Accept-Ranges — streaming will fall back to a full download');
    }
  }

  console.log('→ inserting catalog row…');
  const { data, error } = await sb.from('library_docs').insert(row).select('id, slug, status').single();
  if (error) fail(`insert failed: ${error.message}`);

  console.log(`\n✓ ${data.slug} (${data.status})`);
  if (data.status === 'draft') {
    console.log('  Still a draft — nobody can see it yet. Publish with:');
    console.log(`    update public.library_docs set status = 'public' where slug = '${data.slug}';`);
  }
}

main().catch((e) => fail(e?.stack || String(e)));
