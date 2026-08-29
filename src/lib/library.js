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
// library_docs cannot leak into the client by accident. Trimmed to what the
// UI, search index and URL resolver actually consume — created_at,
// updated_at, license, source_url and lang were shipped on all ~1,500 rows
// of every catalog load without a single reader.
const CATALOG_COLUMNS = [
  'id', 'slug', 'title', 'description',
  'kind', 'subject', 'year', 'semester', 'academic_year', 'cohort',
  'lecturer', 'topics', 'sequence',
  'storage_provider', 'storage_bucket', 'storage_key',
  'mime', 'byte_size', 'page_count', 'sha256_16', 'linearized',
  'attribution', 'status',
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

// Which subjects actually have documents on the shelf, and how many.
// Fetched once per session; scaffold-year subject cards use this to offer
// the REAL shelf instead of a dead รอเติมเนื้อหา card — ปี 3 has zero
// questions but hundreds of real course documents.
let _subjectCounts = null;
export async function librarySubjectCounts() {
  if (_subjectCounts) return _subjectCounts;
  try {
    const { docs } = await getLibraryCatalog();
    const m = new Map();
    for (const d of docs || []) {
      if (!d.subject) continue;
      m.set(d.subject, (m.get(d.subject) || 0) + 1);
    }
    _subjectCounts = m;
  } catch {
    return new Map(); // offline/unconfigured — cards fall back to today's copy
  }
  return _subjectCounts;
}

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

// One catalog, fetched once per session. Before this, three consumers each
// pulled the same 1,496 rows independently — LibraryView refetched on every
// mount (~700 KB and two paged requests), while the AI-search source and the
// subject-count helper kept private caches. One cache means one truth on
// screen, and the invalidation event clears everyone at once.
let _catalogPromise = null;
export function getLibraryCatalog() {
  if (!_catalogPromise) {
    _catalogPromise = fetchLibraryDocs()
      .then((result) => {
        saveCatalogSnapshot(result);
        return result;
      })
      .catch((err) => {
        _catalogPromise = null; // a failed fetch must not poison the session
        throw err;
      });
  }
  return _catalogPromise;
}
if (typeof window !== 'undefined') {
  window.addEventListener('vmx-palette-invalidate', () => { _catalogPromise = null; });
}

// ── Instant-paint snapshot ────────────────────────────────────────────────
// The catalog changes rarely and its metadata is public, so the last good
// fetch is kept in localStorage. A returning visitor paints the whole shelf
// from the snapshot in the same frame the view mounts, while the fresh fetch
// revalidates in the background and swaps in silently if anything changed.

const SNAPSHOT_KEY = 'vmx-library-catalog-v1';

function saveCatalogSnapshot(result) {
  if (typeof window === 'undefined') return;
  if (!result?.configured || !Array.isArray(result.docs) || result.docs.length === 0) return;
  try {
    window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ at: Date.now(), docs: result.docs }));
  } catch { /* quota or private mode — the shelf just loads from network */ }
}

export function readCatalogSnapshot() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.docs) || parsed.docs.length === 0) return null;
    return { docs: parsed.docs, at: parsed.at || 0 };
  } catch {
    return null;
  }
}

/** Snapshot-first access: `{ stale, fresh }` where `stale` is the instant
 *  local copy (or null on a first-ever visit) and `fresh` is the shared
 *  session promise. Callers render `stale` immediately and swap when
 *  `fresh` resolves. */
export function getLibraryCatalogFast() {
  return { stale: readCatalogSnapshot(), fresh: getLibraryCatalog() };
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
  const fetchPage = (from) => sb
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

  // The shelf is ~1,500 rows today, so the first TWO pages are fired
  // concurrently — sequential paging made every visitor pay page 1's full
  // round-trip before page 2 even started (measured 414 ms + 182 ms on
  // prod). Only a shelf that outgrows 2,000 rows pages on sequentially.
  const data = [];
  let error = null;
  const [p0, p1] = await Promise.all([fetchPage(0), fetchPage(PAGE)]);
  if (p0.error) error = p0.error;
  else {
    data.push(...(p0.data || []));
    if ((p0.data || []).length === PAGE) {
      if (p1.error) error = p1.error;
      else {
        data.push(...(p1.data || []));
        let last = p1.data || [];
        for (let from = PAGE * 2; !error && last.length === PAGE; from += PAGE) {
          const res = await fetchPage(from);
          if (res.error) { error = res.error; break; }
          data.push(...(res.data || []));
          last = res.data || [];
        }
      }
    }
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
    let res;
    try {
      res = await fetch(`/api/library-file?slug=${encodeURIComponent(doc.slug)}`, {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
    } catch (netErr) {
      // Offline (or the mint endpoint is unreachable). The service worker
      // keeps recently opened documents in a content-addressed cache keyed
      // by the `h` param — hand it a URL it can answer from that cache. If
      // the document was never opened on this device, the request falls
      // through to the network and fails honestly.
      if (doc.sha256_16) return `/api/library-blob?offline=1&h=${encodeURIComponent(doc.sha256_16)}`;
      throw new Error('ออฟไลน์อยู่ และยังไม่เคยเปิดไฟล์นี้ในเครื่อง จึงเปิดไม่ได้ตอนนี้');
    }
    if (res.status === 401) throw new Error('ไฟล์นี้ต้องเข้าสู่ระบบก่อนจึงจะเปิดได้');
    if (!res.ok) {
      // The endpoint answers with machine codes (not_found, storage_not_configured,
      // catalog_unavailable). Printing those, or a bare HTTP number, told the
      // reader nothing they could act on.
      const body = await res.json().catch(() => ({}));
      const code = body.error || '';
      throw new Error(
        code === 'not_found' ? 'ไม่พบไฟล์นี้ในคลังแล้ว อาจถูกนำออกไป'
          : code === 'storage_not_configured' ? 'คลังเอกสารยังไม่พร้อมใช้งาน ลองใหม่ภายหลัง'
            : res.status >= 500 ? 'เซิร์ฟเวอร์คลังเอกสารขัดข้องชั่วคราว ลองใหม่อีกครั้ง'
              : 'เปิดไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง',
      );
    }
    const { url } = await res.json();
    if (!url) throw new Error('ขอลิงก์ไฟล์ไม่สำเร็จ');
    // `h` is not part of the signed token — it is the content hash the
    // service worker uses as a stable cache key across mint windows, which
    // is what makes "open the same deck again next week, offline on the
    // train" work.
    if (url.startsWith('/api/library-blob?') && doc.sha256_16) {
      return `${url}&h=${encodeURIComponent(doc.sha256_16)}`;
    }
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

// ── How a document opens ──────────────────────────────────────────────────
// 121 shelf rows are not PDFs (Word, PowerPoint, Excel, images, videos, one
// zip). Sending those into the PDF reader used to fail after the download;
// each family now gets the action a browser can actually perform.

const TYPE_LABELS = [
  [/^application\/pdf$/, 'PDF'],
  [/wordprocessingml|msword/, 'Word'],
  [/presentationml|ms-powerpoint/, 'PowerPoint'],
  [/spreadsheetml|ms-excel/, 'Excel'],
  [/^image\//, 'รูปภาพ'],
  [/^video\//, 'วิดีโอ'],
  [/^audio\//, 'เสียง'],
  [/zip/, 'ZIP'],
];

export function docTypeLabel(mime) {
  const m = String(mime || '');
  for (const [re, label] of TYPE_LABELS) if (re.test(m)) return label;
  return 'ไฟล์';
}

/** What the primary button on a card should DO for this mime type.
 *  'read'     → the in-app annotating PDF reader
 *  'tab'      → a new tab the browser renders natively (images, video, audio)
 *  'download' → the browser will save it (Office files, zip, unknown) */
export function docOpenMode(doc) {
  const m = String(doc?.mime || '');
  if (m === 'application/pdf') return { action: 'read', label: 'เปิดอ่าน' };
  if (/^image\//.test(m)) return { action: 'tab', label: 'เปิดดูรูป' };
  if (/^video\//.test(m)) return { action: 'tab', label: 'เปิดวิดีโอ' };
  if (/^audio\//.test(m)) return { action: 'tab', label: 'เปิดฟังเสียง' };
  return { action: 'download', label: 'ดาวน์โหลดไฟล์' };
}

/** The payload the PDF reader receives. `resolve` defers the mint to the
 *  reader's own loading phase, so tapping a card navigates instantly instead
 *  of freezing the button for the mint round-trip. */
export function readerPayload(doc) {
  return {
    resolve: () => resolveDocUrl(doc),
    fileName: `${doc.title}.pdf`,
    sha256: doc.sha256_16,
    slug: doc.slug,
    linearized: doc.linearized,
    title: doc.title,
    subject: doc.subject,
  };
}

// ── Recently opened ───────────────────────────────────────────────────────
// A small per-device list so the shelf's first row is "continue where you
// left off" instead of starting the hunt over. Metadata only — the bytes
// live in the service worker's cache, the strokes in pdf-annotations.

const RECENT_KEY = 'vmx-library-recent-v1';
const RECENT_MAX = 8;

export function recordRecentDoc(doc) {
  if (typeof window === 'undefined' || !doc?.slug) return;
  try {
    const list = listRecentDocs().filter((r) => r.slug !== doc.slug);
    list.unshift({
      slug: doc.slug,
      title: doc.title,
      subject: doc.subject || null,
      mime: doc.mime || null,
      sha256_16: doc.sha256_16 || null,
      at: Date.now(),
    });
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
  } catch { /* storage full or disabled — recents are a nicety */ }
}

export function listRecentDocs() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((r) => r && r.slug && r.title) : [];
  } catch {
    return [];
  }
}
