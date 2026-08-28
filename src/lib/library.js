// ============================================================
// library.js — study-library catalog + object-URL resolution
// ============================================================
// The catalog is a Supabase table (public.library_docs). The bytes live in an
// object store, never in the repo and never in `public/`: that directory is
// already 157 MB of tracked figures, and Vercel's Hobby bandwidth is a hard
// stop rather than an overage — one popular textbook could take the whole app
// offline for the rest of the month, mid-exam.
//
// Two providers, chosen per row:
//
//   'supabase' → private bucket + createSignedUrl(). Zero new infrastructure,
//                same shape as CaseLibrary's lab-dicom reads. Egress billed.
//   'r2'       → Cloudflare R2 behind a custom domain named by
//                VITE_LIBRARY_CDN_BASE. Egress is free and the edge caches
//                content-addressed keys forever, so the marginal cost of a
//                second reader is zero.
//
// Moving a document between providers is a column update plus a re-upload; no
// caller in this module or in LibraryView knows which one it got.
// ============================================================

// Vite statically replaces `import.meta.env`. Under plain node (unit tests) it
// is undefined, so every read goes through optional chaining and the module
// stays importable outside the bundler.
import { SUBJECTS } from '../data/curriculum.js';
import { EXTERNAL_COURSES } from '../data/library-courses.js';

const CDN_BASE = import.meta.env?.VITE_LIBRARY_CDN_BASE || '';

// Signed URLs are short-lived on purpose. Ten minutes is long enough to open a
// large PDF over a slow campus connection and short enough that a URL pasted
// into a group chat stops working before it spreads. Matches lab-dicom.
const SIGNED_URL_TTL_SEC = 600;

export const LIBRARY_BUCKET_DEFAULT = 'library-docs';

// Column list kept explicit (not `*`) so a future private column added to
// library_docs cannot leak into the client by accident.
const CATALOG_COLUMNS = [
  'id', 'slug', 'title', 'description',
  'kind', 'subject', 'year', 'semester', 'academic_year', 'cohort',
  'lecturer', 'topics', 'sequence', 'lang',
  'storage_provider', 'storage_bucket', 'storage_key',
  'mime', 'byte_size', 'page_count', 'sha256_16', 'linearized',
  'license', 'source_url', 'attribution',
  'status', 'created_at', 'updated_at',
].join(', ');

export const LIBRARY_KINDS = Object.freeze([
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'handout', label: 'เอกสารประกอบ' },
  { id: 'slide', label: 'สไลด์' },
  { id: 'summary', label: 'สรุป' },
  { id: 'textbook', label: 'ตำรา' },
  { id: 'pastpaper', label: 'ข้อสอบเก่า' },
  { id: 'guideline', label: 'แนวปฏิบัติ' },
  { id: 'other', label: 'อื่นๆ' },
]);

const KIND_LABELS = new Map(LIBRARY_KINDS.map((k) => [k.id, k.label]));

export function kindLabel(kind) {
  return KIND_LABELS.get(kind) || KIND_LABELS.get('other');
}

export const SEMESTERS = Object.freeze([
  { id: 1, label: 'ภาคต้น', short: 'เทอม 1' },
  { id: 2, label: 'ภาคปลาย', short: 'เทอม 2' },
  { id: 3, label: 'ภาคฤดูร้อน', short: 'ฤดูร้อน' },
]);

const SEMESTER_LABELS = new Map(SEMESTERS.map((s) => [s.id, s.label]));

export function semesterLabel(semester) {
  return SEMESTER_LABELS.get(Number(semester)) || null;
}

// academic_year is stored as a CE year because that is what curriculum.js uses
// for `lecturer_year`. Thai students read ปีการศึกษา in พ.ศ., so every render
// goes through here rather than showing 2026 to someone looking for 2569.
export function buddhistYear(ceYear) {
  // Number(null) and Number('') are both 0, so a bare Number.isFinite() guard
  // turns a missing academic_year into "543" — which then lands in the search
  // haystack of every unclassified document.
  if (ceYear == null || ceYear === '') return null;
  const n = Number(ceYear);
  if (!Number.isFinite(n)) return null;
  return n + 543;
}

// ── Pure helpers (unit-tested without a network or a bundler) ──────────────

export function formatBytes(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return '—';
  if (n < 1024) return `${n} B`;
  const mb = n / (1024 * 1024);
  if (mb < 1) return `${(n / 1024).toFixed(0)} KB`;
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

// Reject anything that is not an absolute https origin, and strip trailing
// slashes so joining never produces a double slash. A misconfigured base that
// silently became a relative path would make every object URL resolve against
// vetmock.vercel.app and 404 — worth failing loudly at the boundary instead.
export function normalizeCdnBase(base) {
  if (typeof base !== 'string' || !base.trim()) return '';
  const trimmed = base.trim().replace(/\/+$/, '');
  if (!/^https:\/\/[^/\s]+/i.test(trimmed)) return '';
  return trimmed;
}

// Storage keys are content-addressed (`docs/<sha256_16>/<safe-name>.pdf`) and
// generated by the ingest script, but they arrive here from the database, so
// they are still normalized before being pasted into a URL: a leading slash or
// a `..` segment would let a bad row reach outside the intended prefix.
export function isSafeStorageKey(key) {
  if (typeof key !== 'string' || !key) return false;
  if (key.startsWith('/') || key.includes('//')) return false;
  if (key.split('/').some((seg) => seg === '' || seg === '.' || seg === '..')) return false;
  return !/[\s?#]/.test(key);
}

export function cdnUrlFor(doc, base = CDN_BASE) {
  const root = normalizeCdnBase(base);
  if (!root) return null;
  if (!doc || !isSafeStorageKey(doc.storage_key)) return null;
  return `${root}/${doc.storage_key.split('/').map(encodeURIComponent).join('/')}`;
}

// A document can be range-streamed when the object store honours Range and the
// PDF was linearized at ingest. Both R2 and Supabase Storage serve ranges, so
// the deciding factor is linearization: without it pdf.js would issue dozens of
// small ranges chasing a cross-reference table at the end of the file, which is
// slower than one sequential download.
export function canStream(doc) {
  return !!(doc && doc.linearized && doc.mime === 'application/pdf');
}

// One lookup for "what is this subject called and what icon does it wear",
// shared by the view (headings, cards) and the search index below. Curriculum
// subjects come first — library rows written from MyCourseVille carry the SAME
// subject ids the question bank uses — and the five gen-ed / other-faculty
// courses resolve through library-courses.js with the course number as id.
const SUBJECT_LOOKUP = new Map([
  ...SUBJECTS.map((s) => [s.id, s]),
  ...EXTERNAL_COURSES.map((c) => [c.code, { id: c.code, code: c.code, name: c.name, icon: c.icon }]),
]);

export function subjectMeta(id) {
  return SUBJECT_LOOKUP.get(id) || null;
}

// Search index. Lowercasing every field of every row on every keystroke is
// the recurring perf bug on this codebase (CommandPalette, FacultyView,
// NotesView all had it): the haystack is built and lowered ONCE here, and the
// hot path does a single indexOf per row. Same shape as FacultyView's
// instructorIndex.
export function indexDocs(docs) {
  return (Array.isArray(docs) ? docs : []).map((doc) => ({
    doc,
    _hayLc: [
      doc.title, doc.description, doc.subject,
      subjectMeta(doc.subject)?.name, subjectMeta(doc.subject)?.name_en,
      subjectMeta(doc.subject)?.code, doc.attribution, doc.lecturer,
      doc.cohort, kindLabel(doc.kind), semesterLabel(doc.semester),
      doc.academic_year, buddhistYear(doc.academic_year),
      ...(Array.isArray(doc.topics) ? doc.topics : []),
    ].filter(Boolean).join(' ').toLowerCase(),
  }));
}

export function filterIndexed(index, {
  query = '', kind = 'all', subject = 'all',
  year = 'all', semester = 'all', academicYear = 'all',
} = {}) {
  const qlc = (query || '').trim().toLowerCase();
  const terms = qlc ? qlc.split(/\s+/) : null;
  const out = [];
  for (const entry of (Array.isArray(index) ? index : [])) {
    const d = entry.doc;
    if (kind !== 'all' && d.kind !== kind) continue;
    if (subject !== 'all' && d.subject !== subject) continue;
    if (year !== 'all' && String(d.year) !== String(year)) continue;
    if (semester !== 'all' && String(d.semester) !== String(semester)) continue;
    if (academicYear !== 'all' && String(d.academic_year) !== String(academicYear)) continue;
    if (terms && !terms.every((t) => entry._hayLc.includes(t))) continue;
    out.push(d);
  }
  return out;
}

// Browse-mode shape: ชั้นปี → วิชา → เอกสาร.
//
// Returns subject ids only. Mapping an id to its name, icon and colour needs
// curriculum.js, which is large; keeping that out of here leaves this module
// importable by the unit tests without pulling the whole taxonomy in.
//
// Years ascending to match curriculum order, unclassified last. Within a year,
// subjects sort by semester then id; within a subject, documents sort by
// `sequence` then title — a plain title sort puts "GI X" before "GI II".
export function groupByYearSubject(docs) {
  const byYear = new Map();
  for (const d of (Array.isArray(docs) ? docs : [])) {
    const yKey = d.year == null ? 'other' : d.year;
    if (!byYear.has(yKey)) byYear.set(yKey, new Map());
    const subjects = byYear.get(yKey);
    const sKey = d.subject || 'other';
    if (!subjects.has(sKey)) subjects.set(sKey, []);
    subjects.get(sKey).push(d);
  }

  const years = [...byYear.keys()].sort((a, b) => {
    if (a === 'other') return 1;
    if (b === 'other') return -1;
    return a - b;
  });

  return years.map((yKey) => {
    const subjectMap = byYear.get(yKey);
    const subjects = [...subjectMap.entries()]
      .map(([subject, list]) => ({
        subject,
        docs: list.slice().sort((a, b) => (
          (a.sequence ?? 0) - (b.sequence ?? 0)
          || (a.title < b.title ? -1 : a.title > b.title ? 1 : 0)
        )),
        count: list.length,
        // The semester a subject is taught in, taken from its documents. Used
        // only for ordering, so the first non-null wins.
        semester: list.find((d) => d.semester != null)?.semester ?? null,
      }))
      .sort((a, b) => (
        (a.semester ?? 9) - (b.semester ?? 9)
        || (a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : 0)
      ));
    return {
      year: yKey === 'other' ? null : yKey,
      subjects,
      count: subjects.reduce((n, s) => n + s.count, 0),
    };
  });
}

// ── Catalog access ────────────────────────────────────────────────────────

// Pre-migration state — the table does not exist yet — must look like an empty
// shelf, not like a broken app. Same reasoning as CaseLibrary: a student who
// opens the library before the migration lands should see "ยังไม่มีเอกสาร",
// not a red error they cannot act on.
function isPreMigration(err) {
  const msg = err?.message || String(err || '');
  return /schema cache|library_docs|does not exist|relation .* does not exist/i.test(msg);
}

export async function fetchLibraryDocs() {
  const { hasSupabase, getSupabase } = await import('./supabase.js');
  if (!hasSupabase) return { docs: [], configured: false };

  const sb = await getSupabase();

  // Paged, because PostgREST silently caps an un-ranged select at 1,000
  // rows and the MyCourseVille mirror is ~3,000. With rows ordered year
  // ascending, the cap would have dropped YEARS 4 AND 5 — the years the
  // people using this app are actually in — the day the full shelf landed,
  // with no error anywhere.
  const PAGE = 1000;
  const data = [];
  let error = null;
  for (let from = 0; ; from += PAGE) {
    const res = await sb
      .from('library_docs')
      .select(CATALOG_COLUMNS)
      .order('year', { ascending: true, nullsFirst: false })
      .order('semester', { ascending: true, nullsFirst: false })
      .order('subject', { ascending: true, nullsFirst: false })
      .order('sequence', { ascending: true })
      .order('title', { ascending: true })
      // slug is unique, so it breaks any remaining tie — without a total
      // order, rows can repeat or vanish across page boundaries.
      .order('slug', { ascending: true })
      .range(from, from + PAGE - 1);
    if (res.error) { error = res.error; break; }
    data.push(...(res.data || []));
    if (!res.data || res.data.length < PAGE) break;
  }

  if (error) {
    if (isPreMigration(error)) return { docs: [], configured: true };
    throw error;
  }
  // RLS already restricts rows to public (anon) or public+restricted (signed
  // in). Archived rows can only appear through a service-role client, which
  // the browser never has, but filtering here keeps the view honest if that
  // ever changes.
  return { docs: (data || []).filter((d) => d.status !== 'archived'), configured: true };
}

// Resolves a catalog row to a fetchable URL.
//
// R2 rows are signed per open by /api/library-file, which checks the session
// before handing anything over. They USED to resolve to a permanent public CDN
// URL, which is right for material anyone may read and wrong for lecture
// slides: this project does not host faculty decks in the open, and a
// permanent URL is public whether or not anyone links to it. A public CDN base
// is still honoured for rows explicitly marked public, so genuinely open
// material keeps its cacheable, edge-served URL.
//
// Supabase rows are signed in the browser against the user's own session,
// which is why that bucket can stay private too.
export async function resolveDocUrl(doc) {
  if (!doc) throw new Error('resolveDocUrl: missing doc');

  if (doc.storage_provider === 'r2') {
    if (doc.status === 'public') {
      const url = cdnUrlFor(doc);
      if (url) return url;
    }
    const { getSupabase } = await import('./supabase.js');
    const sb = await getSupabase();
    const { data: { session } = {} } = await sb.auth.getSession();
    const res = await fetch(`/api/library-file?slug=${encodeURIComponent(doc.slug)}`, {
      headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
    });
    if (res.status === 401) throw new Error('ไฟล์นี้ต้องเข้าสู่ระบบก่อนจึงจะเปิดได้');
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(`ขอลิงก์ไฟล์ไม่สำเร็จ: ${body.error || res.status}`);
    }
    const { url } = await res.json();
    if (!url) throw new Error('ขอลิงก์ไฟล์ไม่สำเร็จ');
    return url;
  }

  if (!isSafeStorageKey(doc.storage_key)) {
    throw new Error('เส้นทางไฟล์ไม่ถูกต้อง');
  }
  const { getSupabase } = await import('./supabase.js');
  const sb = await getSupabase();
  const { data, error } = await sb.storage
    .from(doc.storage_bucket || LIBRARY_BUCKET_DEFAULT)
    .createSignedUrl(doc.storage_key, SIGNED_URL_TTL_SEC);
  if (error) throw new Error(`ขอลิงก์ไฟล์ไม่สำเร็จ: ${error.message}`);
  return data.signedUrl;
}
