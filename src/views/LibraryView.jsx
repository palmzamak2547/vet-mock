// ============================================================
// LibraryView — คลังเอกสารการเรียน
// ============================================================
//
// Catalog rows come from Supabase (public.library_docs); the bytes come from an
// object store the app never bundles. Opening a document hands it to the
// existing PdfAnnotateView, so library PDFs get the same pen, eraser and
// per-page stroke storage as an uploaded file.
//
// Two reading modes, because a shelf is browsed differently than it is searched:
//
//   • no query  → browse: ชั้นปี → วิชา, collapsible, counts on every heading.
//                 The reader's own year opens first.
//   • a query   → one flat, capped list. Grouping search hits across four years
//                 buries them under headings instead of surfacing them.
//
// Filters (เทอม · ปีการศึกษา · ชนิด) apply to both, and each row only renders
// when the shelf actually holds more than one value for it — an empty shelf
// should not greet a student with four dead filter rows.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import { thaiError } from '../lib/errors.js';
import {
  LIBRARY_KINDS,
  SEMESTERS,
  buddhistYear,
  docOpenMode,
  docTypeLabel,
  filterIndexed,
  formatBytes,
  getLibraryCatalogFast,
  groupByYearSubject,
  indexDocs,
  kindLabel,
  listRecentDocs,
  readerPayload,
  recordRecentDoc,
  resolveDocUrl,
  semesterLabel,
  subjectMeta,
} from '../lib/library.js';

// An empty query matches everything. Mounting several hundred cards at once is
// the 200–400 ms freeze this codebase has hit before, so both modes are capped
// and say so rather than truncating silently.
const MAX_RESULTS = 60;
const MAX_BROWSE_CARDS = 150;

const KIND_TONE = {
  textbook: 'var(--clr-plum-text)',
  slide: 'var(--clr-ocean-text)',
  handout: 'var(--clr-sage-text)',
  summary: 'var(--clr-sage-text)',
  pastpaper: 'var(--clr-gold-text)',
  guideline: 'var(--clr-ocean-text)',
  other: 'var(--clr-ink-soft)',
};

const cardStyle = {
  border: '1px solid var(--clr-border)',
  borderRadius: 10,
  background: 'var(--clr-surface)',
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 12,
};

const mono = { fontFamily: 'var(--vmx-mono)' };

function subjectName(id) {
  return subjectMeta(id)?.name || id || 'ไม่ระบุวิชา';
}
function subjectIcon(id) {
  return subjectMeta(id)?.icon || '📄';
}

// ── Card ──────────────────────────────────────────────────────────────────

function DocCard({ doc, busy, onOpen, onOpenOriginal, showSubject }) {
  const mode = docOpenMode(doc);

  const meta = [
    showSubject ? subjectName(doc.subject) : null,
    doc.year != null ? `ปี ${doc.year}` : null,
    semesterLabel(doc.semester),
    doc.academic_year != null ? `ปีการศึกษา ${buddhistYear(doc.academic_year)}` : null,
  ].filter(Boolean).join(', ');

  // Name the file type when it is not a PDF — 121 shelf rows are Word,
  // PowerPoint, video and images, and their card should say so before the
  // button explains what tapping it will do.
  const physical = [
    mode.action !== 'read' ? docTypeLabel(doc.mime) : null,
    doc.page_count ? `${doc.page_count} หน้า` : null,
    formatBytes(doc.byte_size),
  ].filter(Boolean).join(', ');

  return (
    <article className="vmx-lib-card" style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 15, margin: 0, lineHeight: 1.35 }}>{doc.title}</h3>
        <span style={{ ...mono, fontSize: 10, whiteSpace: 'nowrap', color: KIND_TONE[doc.kind] || KIND_TONE.other }}>
          {kindLabel(doc.kind)}
        </span>
      </div>

      {doc.description && (
        <p style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', margin: 0, lineHeight: 1.5 }}>
          {doc.description}
        </p>
      )}

      {meta && <div style={{ ...mono, fontSize: 11.5, color: 'var(--clr-ink-soft)' }}>{meta}</div>}
      {physical && <div style={{ ...mono, fontSize: 11, color: 'var(--clr-ink-soft)' }}>{physical}</div>}

      {(doc.lecturer || doc.attribution || doc.cohort) && (
        <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>
          {doc.lecturer ? `ผู้สอน: ${doc.lecturer}` : null}
          {doc.lecturer && (doc.attribution || doc.cohort) ? ', ' : null}
          {doc.cohort || doc.attribution}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 4, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="vmx-btn vmx-btn-primary vmx-btn-sm"
          disabled={busy}
          onClick={() => onOpen(doc)}
        >
          {busy ? 'กำลังเปิด…' : mode.label}
        </button>
        {/* For a non-PDF the primary button already opens the original,
            so a second button saying the same thing is noise. */}
        {mode.action === 'read' && (
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            disabled={busy}
            onClick={() => onOpenOriginal(doc)}
          >
            เปิดไฟล์ต้นฉบับ
          </button>
        )}
      </div>
    </article>
  );
}

// ── Filter chip row ───────────────────────────────────────────────────────

function ChipRow({ label, options, value, onChange, allLabel = 'ทั้งหมด' }) {
  if (options.length < 2) return null;
  return (
    <div>
      <div style={{ ...mono, fontSize: 10.5, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
        {label}
      </div>
      <div className="vmx-chip-row" role="group" aria-label={label}>
        <button
          type="button"
          className={`vmx-chip ${value === 'all' ? 'active' : ''}`}
          aria-pressed={value === 'all'}
          onClick={() => onChange('all')}
        >
          {allLabel}
        </button>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`vmx-chip ${String(value) === String(o.id) ? 'active' : ''}`}
            aria-pressed={String(value) === String(o.id)}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── View ──────────────────────────────────────────────────────────────────

export default function LibraryView({ goHome, onOpenDoc, selectedYear = null }) {
  const [docs, setDocs] = useState([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [query, setQuery] = useState(() => {
    // A hand-off from the AI search ("เปิดชั้นเอกสารวิชานี้") arrives here.
    // Read-once: coming back to the shelf later must not re-apply it.
    try {
      const q = sessionStorage.getItem('vmx-library-q');
      if (q) { sessionStorage.removeItem('vmx-library-q'); return q; }
    } catch { /* storage disabled — the shelf just opens unfiltered */ }
    // A shared /app/library?q=… link lands with the search prefilled.
    try {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) return q;
    } catch { /* no window in tests */ }
    return '';
  });
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [kind, setKind] = useState('all');
  const [semester, setSemester] = useState('all');
  const [academicYear, setAcademicYear] = useState('all');
  // A subject-card hand-off filters by EXACT subject id, so the shelf shows
  // precisely the N files the card promised — the old name-as-text query
  // also matched other subjects' descriptions and the numbers disagreed.
  const [subjectFilter, setSubjectFilter] = useState(() => {
    try {
      const sid = sessionStorage.getItem('vmx-library-subject');
      if (sid) { sessionStorage.removeItem('vmx-library-subject'); return sid; }
    } catch { /* storage disabled */ }
    return null;
  });
  const [openYears, setOpenYears] = useState(() => new Set());

  // Tracks whether the reader has taken control of the accordion. Until then
  // the default (their own year) is allowed to follow the data as filters
  // change; after that, their choice is never overwritten.
  const touchedRef = useRef(false);

  // 80 ms sits below the input-echo threshold, so typing stays instant while
  // the filter runs once per burst instead of once per keystroke.
  useEffect(() => {
    if (query === debouncedQuery) return undefined;
    const t = setTimeout(() => setDebouncedQuery(query), 80);
    return () => clearTimeout(t);
  }, [query, debouncedQuery]);

  // Mirror the search into ?q= so the current view is shareable and survives
  // a refresh. replaceState, never pushState — typing must not grow history.
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const q = debouncedQuery.trim();
      if (q) url.searchParams.set('q', q);
      else url.searchParams.delete('q');
      window.history.replaceState(window.history.state, '', url);
    } catch { /* test envs without a real history */ }
  }, [debouncedQuery]);

  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let cancelled = false;
    // Snapshot-first: the last good catalog paints the full shelf in the
    // mount frame, then the fresh fetch swaps in silently. First-ever visits
    // still see the skeleton.
    const { stale, fresh } = getLibraryCatalogFast();
    if (stale?.docs?.length) {
      setDocs(stale.docs);
      setLoading(false);
    }
    fresh
      .then(({ docs: rows, configured: ok }) => {
        if (cancelled) return;
        setDocs(rows);
        setConfigured(ok);
        setError(null);
      })
      .catch((e) => {
        // With a snapshot already on screen, a background revalidation
        // failure is not worth an alert banner.
        if (!cancelled && !stale?.docs?.length) setError(thaiError(e, 'โหลดรายการเอกสารไม่สำเร็จ'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  // Warm the reader chunk while the shelf sits idle, so the first เปิดอ่าน
  // waits only for document bytes, not for JavaScript.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => { import('./PdfAnnotateView.jsx').catch(() => {}); });
    return () => cancel(id);
  }, []);

  const docIndex = useMemo(() => indexDocs(docs), [docs]);

  const searching = debouncedQuery.trim().length > 0;

  const filtered = useMemo(
    () => filterIndexed(docIndex, {
      query: debouncedQuery, kind, semester, academicYear,
      subject: subjectFilter || 'all',
    }),
    [docIndex, debouncedQuery, kind, semester, academicYear, subjectFilter],
  );

  const groups = useMemo(
    () => (searching ? [] : groupByYearSubject(filtered)),
    [filtered, searching],
  );

  // Filter options come from the shelf itself, so a dimension nobody has filled
  // in never renders a row.
  const semesterOptions = useMemo(() => {
    const present = new Set(docs.map((d) => d.semester).filter((v) => v != null));
    return SEMESTERS.filter((s) => present.has(s.id)).map((s) => ({ id: s.id, label: s.label }));
  }, [docs]);

  const academicYearOptions = useMemo(() => {
    const present = [...new Set(docs.map((d) => d.academic_year).filter((v) => v != null))];
    return present.sort((a, b) => b - a).map((y) => ({ id: y, label: `${buddhistYear(y)}` }));
  }, [docs]);

  const kindOptions = useMemo(() => {
    const present = new Set(docs.map((d) => d.kind));
    return LIBRARY_KINDS.filter((k) => k.id !== 'all' && present.has(k.id));
  }, [docs]);

  // Keep the accordion honest as the data underneath it changes: drop years
  // that no longer exist, and pick a sensible default when nothing is open.
  // Without this, filtering down to a year the reader had collapsed leaves the
  // whole shelf looking empty.
  const yearKey = groups.map((g) => g.year).join(',');
  useEffect(() => {
    if (searching) return;
    setOpenYears((prev) => {
      const available = groups.map((g) => g.year);
      const kept = new Set([...prev].filter((y) => available.some((a) => a === y)));
      if (kept.size > 0) return kept.size === prev.size ? prev : kept;
      if (available.length === 0) return kept.size === prev.size ? prev : kept;
      if (touchedRef.current && prev.size > 0) return kept;
      const preferred = available.includes(selectedYear) ? selectedYear : available[0];
      return new Set([preferred]);
    });
    // groups is rebuilt every filter change; yearKey is its stable identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearKey, searching, selectedYear]);

  const toggleYear = useCallback((year) => {
    touchedRef.current = true;
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year); else next.add(year);
      return next;
    });
  }, []);

  const [recentDocs, setRecentDocs] = useState(() => listRecentDocs());

  // New-tab opens (non-PDF files and "เปิดไฟล์ต้นฉบับ"). The tab is opened
  // SYNCHRONOUSLY inside the click — popup blockers only trust window.open
  // during user activation — then pointed at the URL once the mint resolves.
  const openExternally = useCallback(async (doc) => {
    const win = window.open('', '_blank');
    if (win) { try { win.opener = null; } catch { /* hardened browsers */ } }
    setBusyId(doc.id);
    setError(null);
    try {
      const url = await resolveDocUrl(doc);
      if (win) win.location.replace(url);
      else window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      if (win) { try { win.close(); } catch { /* already gone */ } }
      setError(thaiError(e, 'เปิดไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง'));
    } finally {
      setBusyId(null);
    }
  }, []);

  const openDoc = useCallback((doc) => {
    recordRecentDoc(doc);
    setRecentDocs(listRecentDocs());
    if (docOpenMode(doc).action === 'read') {
      // Navigate first: the reader overlaps the link mint with its own
      // chunk load, so the tap answers in the same frame.
      onOpenDoc(readerPayload(doc));
      return;
    }
    openExternally(doc);
  }, [onOpenDoc, openExternally]);

  // Opens the object URL in a new tab, where the browser's own PDF UI offers
  // Save. A `download` attribute is ignored cross-origin, so promising a direct
  // download here would be a lie on every provider.
  const openOriginal = openExternally;

  // Title hits outrank body hits: someone typing a deck's name wants that
  // deck first, not every row whose description happens to mention the word.
  // Array.prototype.sort is stable, so within each tier the shelf order holds.
  const ranked = useMemo(() => {
    if (!searching) return filtered;
    const q = debouncedQuery.trim().toLowerCase();
    const inTitle = (d) => ((d.title || '').toLowerCase().includes(q) ? 0 : 1);
    return [...filtered].sort((a, b) => inTitle(a) - inTitle(b));
  }, [filtered, searching, debouncedQuery]);

  // Recently opened, still on the shelf. Metadata comes from the live
  // catalog row, so a re-titled or withdrawn document can't linger here.
  const recentOnShelf = useMemo(() => {
    if (recentDocs.length === 0 || docs.length === 0) return [];
    const bySlug = new Map(docs.map((d) => [d.slug, d]));
    return recentDocs.map((r) => bySlug.get(r.slug)).filter(Boolean).slice(0, 6);
  }, [recentDocs, docs]);

  const subjectTotal = useMemo(
    () => new Set(docs.map((d) => d.subject).filter(Boolean)).size,
    [docs],
  );

  const visibleFlat = ranked.slice(0, MAX_RESULTS);
  const hasFilters = kind !== 'all' || semester !== 'all' || academicYear !== 'all' || !!subjectFilter;

  const resetFilters = useCallback(() => {
    setKind('all'); setSemester('all'); setAcademicYear('all');
    setSubjectFilter(null);
    setQuery(''); setDebouncedQuery('');
  }, []);

  return (
    <div>
      <BackBar onBack={goHome} label="กลับหน้าแรก" subtitle="คลังเอกสาร" />

      <div style={{ padding: '4px 0 16px' }}>
        <div style={{ ...mono, fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          📚 Study library
        </div>
        <h1 style={{ margin: '6px 0 4px', fontSize: 22 }}>คลังเอกสารการเรียน</h1>
        <p style={{ color: 'var(--clr-ink-soft)', fontSize: 13, margin: 0 }}>
          แยกตามชั้นปี วิชา เทอม และปีการศึกษา — เปิดอ่านในแอปแล้วขีดเขียนได้เลย
          รอยเขียนจะกลับมาเหมือนเดิมทุกครั้งที่เปิดใหม่
        </p>
        {docs.length > 0 && (
          <div style={{ ...mono, fontSize: 11.5, color: 'var(--clr-ink-soft)', marginTop: 6 }}>
            {docs.length.toLocaleString()} ไฟล์ จาก {subjectTotal} วิชา
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อเอกสาร วิชา ผู้สอน หรือหัวข้อ…"
          aria-label="ค้นหาเอกสารในคลัง"
          style={{
            width: '100%', padding: '10px 14px', fontSize: 14,
            border: '1px solid var(--clr-border)', borderRadius: 8,
            background: 'var(--clr-bg)', color: 'var(--clr-ink)',
          }}
        />
        {subjectFilter && (
          <div className="vmx-chip-row">
            <button
              type="button"
              className="vmx-chip active"
              onClick={() => setSubjectFilter(null)}
              title="ล้างตัวกรองวิชา"
            >
              วิชา: {subjectName(subjectFilter)} ✕
            </button>
          </div>
        )}
        <ChipRow label="เทอม" options={semesterOptions} value={semester} onChange={setSemester} allLabel="ทุกเทอม" />
        <ChipRow label="ปีการศึกษา" options={academicYearOptions} value={academicYear} onChange={setAcademicYear} allLabel="ทุกปี" />
        <ChipRow label="ชนิดเอกสาร" options={kindOptions} value={kind} onChange={setKind} allLabel="ทุกชนิด" />
      </div>

      {error && (
        <div role="alert" style={{
          border: '1px solid var(--clr-rose)', background: 'var(--clr-rose-soft)',
          color: 'var(--clr-rose-text)', borderRadius: 8, padding: '10px 14px',
          fontSize: 13, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span style={{ flex: 1, minWidth: 180 }}>{error}</span>
          {docs.length === 0 && (
            <button
              type="button"
              className="vmx-btn vmx-btn-sm"
              onClick={() => { setError(null); setLoading(true); setReloadKey((k) => k + 1); }}
            >
              ลองใหม่
            </button>
          )}
        </div>
      )}

      {loading && (
        <div role="status" aria-label="กำลังโหลดคลังเอกสาร" style={gridStyle}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="vmx-lab-skeleton" aria-hidden="true" style={{ ...cardStyle, height: 150, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      )}

      {!loading && !configured && (
        <div className="vmx-empty-state">
          <p>คลังเอกสารยังไม่พร้อมใช้งานในเครื่องนี้</p>
          <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>ลองเปิดจากเว็บหลักอีกครั้ง หรือกดลองใหม่</p>
          <button
            type="button"
            className="vmx-btn vmx-btn-sm"
            onClick={() => { setError(null); setLoading(true); setReloadKey((k) => k + 1); }}
          >
            ลองใหม่
          </button>
        </div>
      )}

      {!loading && configured && docs.length === 0 && (
        <div className="vmx-empty-state">
          <p>ยังไม่มีเอกสารในคลัง</p>
          <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
            เอกสารจะขึ้นที่นี่เมื่อมีการเพิ่มเข้าคลัง
          </p>
        </div>
      )}

      {!loading && configured && docs.length > 0 && filtered.length === 0 && (
        <div className="vmx-empty-state">
          <p>ไม่พบเอกสารที่ตรงกับที่เลือก</p>
          {(searching || hasFilters) && (
            <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={resetFilters}>
              ล้างตัวกรอง
            </button>
          )}
        </div>
      )}

      {/* Search mode — one flat list */}
      {!loading && searching && filtered.length > 0 && (
        <>
          <div style={{ ...mono, fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 10 }}>
            พบ {filtered.length} รายการ
          </div>
          <div className="vmx-stagger" style={gridStyle}>
            {visibleFlat.map((doc) => (
              <DocCard
                key={doc.id}
                doc={doc}
                busy={busyId === doc.id}
                onOpen={openDoc}
                onOpenOriginal={openOriginal}
                showSubject
              />
            ))}
          </div>
          {filtered.length > visibleFlat.length && (
            <p style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', textAlign: 'center', marginTop: 14 }}>
              แสดง {visibleFlat.length} จาก {filtered.length} รายการ — พิมพ์คำค้นเพิ่มเพื่อแคบผลลัพธ์
            </p>
          )}
        </>
      )}

      {/* Recently opened — continue where you left off, ahead of the hunt */}
      {!loading && !searching && recentOnShelf.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...mono, fontSize: 10.5, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
            เปิดล่าสุด
          </div>
          <div className="vmx-stagger" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {recentOnShelf.map((doc) => (
              <button
                key={doc.slug}
                type="button"
                className="vmx-chip"
                title={doc.title}
                onClick={() => openDoc(doc)}
                style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {doc.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Browse mode — ชั้นปี → วิชา */}
      {!loading && !searching && groups.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(() => {
            let rendered = 0;
            return groups.map((group) => {
              const open = openYears.has(group.year);
              const yearLabel = group.year == null ? 'วิชานอกคณะ (Gen-Ed)' : `ชั้นปี ${group.year}`;
              return (
                <section
                  key={group.year ?? 'other'}
                  style={{ border: '1px solid var(--clr-border)', borderRadius: 12, overflow: 'hidden', background: 'var(--clr-surface)' }}
                >
                  <h2 style={{ margin: 0 }}>
                    <button
                      type="button"
                      onClick={() => toggleYear(group.year)}
                      aria-expanded={open}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '14px 16px', background: 'var(--clr-surface-2)',
                        border: 0, cursor: 'pointer', color: 'var(--clr-ink)',
                        font: 'inherit', fontSize: 15, fontWeight: 600, textAlign: 'left',
                      }}
                    >
                      <span aria-hidden="true" style={{ ...mono, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
                        {open ? '▾' : '▸'}
                      </span>
                      <span>{yearLabel}</span>
                      <span style={{ ...mono, marginLeft: 'auto', fontSize: 12, fontWeight: 400, color: 'var(--clr-ink-soft)' }}>
                        {group.count} ไฟล์, {group.subjects.length} วิชา
                      </span>
                    </button>
                  </h2>

                  {open && (
                    <div style={{ padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                      {group.subjects.map((sg) => {
                        const budget = MAX_BROWSE_CARDS - rendered;
                        if (budget <= 0) return null;
                        const shown = sg.docs.slice(0, budget);
                        rendered += shown.length;
                        return (
                          <div key={sg.subject}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '14px 0 10px' }}>
                              <span aria-hidden="true">{subjectIcon(sg.subject)}</span>
                              <h3 style={{ fontSize: 14, margin: 0 }}>{subjectName(sg.subject)}</h3>
                              {subjectMeta(sg.subject)?.code && (
                                <span style={{ ...mono, fontSize: 10.5, color: 'var(--clr-ink-soft)' }}>
                                  {subjectMeta(sg.subject).code}
                                </span>
                              )}
                              {sg.semester != null && (
                                <span style={{ ...mono, fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                                  {semesterLabel(sg.semester)}
                                </span>
                              )}
                              <span style={{ ...mono, marginLeft: 'auto', fontSize: 11.5, color: 'var(--clr-ink-soft)' }}>
                                {sg.count} ไฟล์
                              </span>
                            </div>
                            <div className="vmx-stagger" style={gridStyle}>
                              {shown.map((doc) => (
                                <DocCard
                                  key={doc.id}
                                  doc={doc}
                                  busy={busyId === doc.id}
                                  onOpen={openDoc}
                                  onOpenOriginal={openOriginal}
                                  showSubject={false}
                                />
                              ))}
                            </div>
                            {shown.length < sg.docs.length && (
                              <p style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 10 }}>
                                แสดง {shown.length} จาก {sg.docs.length} — ใช้ช่องค้นหาเพื่อดูที่เหลือ
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}
