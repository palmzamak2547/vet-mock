import Mochi from '../components/Mochi.jsx';
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
import ExternalDocsSection from '../components/ExternalDocsSection.jsx';
import FeatureTip from '../components/FeatureTip.jsx';
import { takeViewIntent, consumeViewIntent } from '../lib/feature-registry.js';
import { thaiError } from '../lib/errors.js';
import { googleDriveSourceUrl, mergeLibrarySources, vcaFileDoc } from '../lib/vca-library.js';
import { openSourceLine } from '../lib/open-sources.js';
import { EMPTY_ART } from '../data/art.js';
import { cardDescription, ownYearFirst, prefersCompactReading } from '../lib/reading-layout.js';
import {
  LIBRARY_KINDS,
  SEMESTERS,
  buddhistYear,
  docOpenMode,
  prefetchDocUrl,
  docTypeLabel,
  filterIndexed,
  formatBytes,
  getLibraryCatalogFast,
  groupByYearSubject,
  indexDocs,
  displayDocTitle,
  kindLabel,
  listRecentDocs,
  readerPayload,
  recordRecentDoc,
  resolveDocUrl,
  markTerms,
  searchLibraryText,
  semesterLabel,
  subjectMeta,
  TEXT_SEARCH_MIN,
} from '../lib/library.js';

// An empty query matches everything. Mounting several hundred cards at once is
// the 200–400 ms freeze this codebase has hit before, so both modes are capped
// and say so rather than truncating silently.
const MAX_RESULTS = 60;
const MAX_BROWSE_CARDS = 150;
// One tap on a capped subject's "แสดงอีก" mounts this many more of its cards.
const BROWSE_STEP = 150;

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
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
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

  // In browse mode the year and the term are already the headings above the
  // card, so the card says only what they do not: the academic year.
  const meta = [
    showSubject ? subjectName(doc.subject) : null,
    showSubject && doc.year != null ? `ปี ${doc.year}` : null,
    showSubject ? semesterLabel(doc.semester) : null,
    doc.academic_year != null ? `ปีการศึกษา ${buddhistYear(doc.academic_year)}` : null,
  ].filter(Boolean).join(', ');

  // Name the file type when it is not a PDF — 121 shelf rows are Word,
  // PowerPoint, video and images, and their card should say so before the
  // button explains what tapping it will do.
  const physical = [
    mode.action !== 'read' ? (doc.storage_provider === 'external' ? 'ลิงก์ไปเว็บต้นทาง' : docTypeLabel(doc.mime)) : null,
    doc.page_count ? `${doc.page_count} หน้า` : null,
    formatBytes(doc.byte_size),
  ].filter(Boolean).join(', ');
  const description = cardDescription(doc, kindLabel(doc.kind));

  return (
    <article className="vmx-lib-card" style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between' }}>
        <h3 className="vmx-lib-card-title">{displayDocTitle(doc.title)}</h3>
        <span className="vmx-lib-card-kind" style={{ color: KIND_TONE[doc.kind] || KIND_TONE.other }}>
          {kindLabel(doc.kind)}
        </span>
      </div>

      {description && <p className="vmx-lib-card-desc">{description}</p>}

      {(meta || physical) && (
        <div className="vmx-lib-card-meta">{[physical, meta].filter(Boolean).join(', ')}</div>
      )}

      {doc.open ? (
        <div className="vmx-lib-card-meta">แหล่งภายนอก: {openSourceLine(doc.open)}</div>
      ) : (doc.lecturer || doc.attribution || doc.cohort) && (
        <div className="vmx-lib-card-meta">
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
          {...intentProps(doc)}
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
            {...intentProps(doc)}
            onClick={() => onOpenOriginal(doc)}
          >
            เปิดไฟล์ต้นฉบับ
          </button>
        )}
      </div>
      {doc.source_files?.length > 0 && (
        <details style={{ fontSize: 14, lineHeight: 1.6 }}>
          <summary style={{ cursor: 'pointer', padding: '10px 0', minHeight: 44, boxSizing: 'border-box' }}>ไฟล์ที่เกี่ยวข้อง {doc.source_files.length} ไฟล์</summary>
          {doc.source_files.map((file) => {
            const href = googleDriveSourceUrl(file.url);
            return <div key={file.id} style={{ padding: '6px 0', overflowWrap: 'anywhere' }}>
              <span>{file.title}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(file.backups || []).map((copy) => {
                  const variant = vcaFileDoc(file, copy);
                  return <button key={copy.slug} type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                    disabled={busy} {...intentProps(variant)} onClick={() => onOpen(variant)}>
                    เปิด {copy.format.toUpperCase()} จากคลัง
                  </button>;
                })}
                {href && <a href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>ที่มาใน Google Drive</a>}
              </div>
            </div>;
          })}
        </details>
      )}
    </article>
  );
}

// Hovering or touching a button is intent — start minting the link then, so
// the download can begin the instant the reader mounts instead of after a
// round-trip. `pointerenter` covers mouse and pen; `pointerdown` covers touch,
// where there is no hover and the press still lands ~100 ms before the tap
// completes. Both are no-ops once one has fired for that document.
function intentProps(doc) {
  const go = () => prefetchDocUrl(doc);
  return { onPointerEnter: go, onPointerDown: go };
}

// ── Filter chip row ───────────────────────────────────────────────────────

function ChipRow({ label, options, value, onChange, allLabel = 'ทั้งหมด' }) {
  if (options.length < 2) return null;
  return (
    <div className="vmx-lib-filter">
      <div className="vmx-lib-filter-label">{label}</div>
      {/* One scrolling line on a phone (CSS), the wrapping row elsewhere. */}
      <div className="vmx-chip-row vmx-lib-filter-chips" role="group" aria-label={label}>
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

// Read one filter back out of the URL. Defined outside the component so the
// state initialisers can use it before anything else runs.
function paramOr(key, fallback) {
  try {
    const v = new URLSearchParams(window.location.search).get(key);
    return v == null || v === '' ? fallback : v;
  } catch { return fallback; } // no window in tests
}

// The external tab opens from the OAuth callback (?connected / ?connect_error),
// from ?tab=external (the way back from a chat app's browser), from the
// retired /app/external-docs path, and from the palette's เอกสารภายนอก entry.
const EXTERNAL_DOCS_ALIAS = '/app/external-docs';

export default function LibraryView({ goHome, onOpenDoc, onOpenLocalPdf, selectedYear = null, user }) {
  const tabIntentRef = useRef(null);
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      if (search.has('connected') || search.has('connect_error') || search.get('tab') === 'external') return 'external';
      if (window.location.pathname.replace(/\/+$/, '') === EXTERNAL_DOCS_ALIAS) return 'external';
    } catch { /* ignored */ }
    return takeViewIntent(tabIntentRef) === 'external' ? 'external' : 'internal';
  });
  // Read once: the intent is consumed only after this render commits, and the
  // address bar settles on the canonical /app/library without the tab hint.
  useEffect(() => {
    if (tabIntentRef.current === 'external') consumeViewIntent('external');
    try {
      const url = new URL(window.location.href);
      const alias = url.pathname.replace(/\/+$/, '') === EXTERNAL_DOCS_ALIAS;
      if (!alias && !url.searchParams.has('tab')) return;
      if (alias) url.pathname = '/app/library';
      url.searchParams.delete('tab');
      window.history.replaceState(window.history.state, '', url.toString());
    } catch { /* no window in tests or history refused: the tab is already open */ }
  }, []);
  const [docs, setDocs] = useState([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const initialTicketsRef = useRef({});
  const [query, setQuery] = useState(() => {
    // A hand-off from the AI search ("เปิดชั้นเอกสารวิชานี้") arrives here.
    // Read-once: coming back to the shelf later must not re-apply it.
    try {
      const q = sessionStorage.getItem('vmx-library-q');
      if (q) { initialTicketsRef.current['vmx-library-q'] = q; return q; }
    } catch { /* storage disabled — the shelf just opens unfiltered */ }
    // A shared /app/library?q=… link lands with the search prefilled.
    try {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) return q;
    } catch { /* no window in tests */ }
    return '';
  });
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  // Only `q` used to be mirrored into the URL, so opening a document and
  // coming back dropped every other filter: a shelf narrowed to one academic
  // year and one kind reopened as everything, and the four files the student
  // had been working through were gone.
  const [kind, setKind] = useState(() => paramOr('kind', 'all'));
  const [semester, setSemester] = useState(() => paramOr('semester', 'all'));
  const [academicYear, setAcademicYear] = useState(() => paramOr('ay', 'all'));
  // A subject-card hand-off filters by EXACT subject id, so the shelf shows
  // precisely the N files the card promised — the old name-as-text query
  // also matched other subjects' descriptions and the numbers disagreed.
  const [subjectFilter, setSubjectFilter] = useState(() => {
    try {
      const sid = sessionStorage.getItem('vmx-library-subject');
      if (sid) { initialTicketsRef.current['vmx-library-subject'] = sid; return sid; }
    } catch { /* storage disabled */ }
    // The sessionStorage hand-off is read-once, so without the URL copy a
    // subject-scoped shelf was unrecoverable after a reader round-trip.
    return paramOr('subject', null);
  });
  useEffect(() => {
    // A render can be discarded before the selected filters reach the URL.
    for (const [key, raw] of Object.entries(initialTicketsRef.current)) {
      try { if (sessionStorage.getItem(key) === raw) sessionStorage.removeItem(key); } catch { /* retain the handoff */ }
    }
  }, []);
  const [openYears, setOpenYears] = useState(() => new Set());

  // Tracks whether the reader has taken control of the accordion. Until then
  // the default (their own year) is allowed to follow the data as filters
  // change; after that, their choice is never overwritten.
  const touchedRef = useRef(false);

  useEffect(() => {
    const receiveIntent = (event) => {
      if (event.detail?.view !== 'library') return;
      // The palette's เอกสารภายนอก entry while the library is already open.
      const pending = { current: null };
      if (takeViewIntent(pending) === 'external') {
        consumeViewIntent('external');
        setActiveTab('external');
      }
      try {
        const subject = sessionStorage.getItem('vmx-library-subject');
        const query = sessionStorage.getItem('vmx-library-q');
        if (subject === null && query === null) return;
        sessionStorage.removeItem('vmx-library-subject');
        sessionStorage.removeItem('vmx-library-q');
        setSubjectFilter(subject || null);
        setQuery(query || '');
        setDebouncedQuery(query || '');
        // The explicit search result names a new set. Old year/type filters
        // must not silently hide the files the chosen result promised.
        setKind('all'); setSemester('all'); setAcademicYear('all');
        touchedRef.current = false;
        setOpenYears(new Set());
      } catch { /* storage disabled: keep the current shelf usable */ }
    };
    window.addEventListener('vmx-view-intent', receiveIntent);
    return () => window.removeEventListener('vmx-view-intent', receiveIntent);
  }, []);

  // 80 ms sits below the input-echo threshold, so typing stays instant while
  // the filter runs once per burst instead of once per keystroke.
  useEffect(() => {
    if (query === debouncedQuery) return undefined;
    const t = setTimeout(() => setDebouncedQuery(query), 80);
    return () => clearTimeout(t);
  }, [query, debouncedQuery]);

  // Mirror the whole filter set into the URL so the current view is shareable
  // and survives both a refresh and a trip through the reader. replaceState,
  // never pushState — typing must not grow history. A param is deleted when it
  // is at its default, so an unfiltered shelf keeps a clean URL.
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const set = (key, value, dflt) => {
        if (value != null && value !== dflt && value !== '') url.searchParams.set(key, String(value));
        else url.searchParams.delete(key);
      };
      set('q', debouncedQuery.trim(), '');
      set('kind', kind, 'all');
      set('semester', semester, 'all');
      set('ay', academicYear, 'all');
      set('subject', subjectFilter, null);
      window.history.replaceState(window.history.state, '', url);
    } catch { /* test envs without a real history */ }
  }, [debouncedQuery, kind, semester, academicYear, subjectFilter]);

  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    const onAuthChanged = () => {
      setDocs((rows) => rows.filter((doc) => doc.status === 'public'));
      setReloadKey((key) => key + 1);
    };
    window.addEventListener('vmx-library-auth-changed', onAuthChanged);
    return () => window.removeEventListener('vmx-library-auth-changed', onAuthChanged);
  }, []);
  useEffect(() => {
    let cancelled = false;
    // Snapshot-first: the last good catalog paints the full shelf in the
    // mount frame, then the fresh fetch swaps in silently. First-ever visits
    // still see the skeleton.
    const { stale, fresh } = getLibraryCatalogFast();
    // The snapshot comes from the Cache API, so it lands a tick after mount
    // rather than in it — still far ahead of the network. Once the fresh
    // catalog is on screen the snapshot must not paint over it; if the fetch
    // failed, the snapshot is still the best shelf there is.
    let snapshot = null;
    let outcome = null;
    let partial = null;
    stale.then((snap) => {
      if (cancelled || !snap?.docs?.length) return;
      snapshot = snap;
      if (outcome === 'ok') return;
      setDocs(partial ? mergeLibrarySources(snap.docs, partial) : snap.docs);
      setLoading(false);
    }).catch(() => {});
    fresh
      .then(({ docs: rows, configured: ok, error: fetchError }) => {
        if (cancelled) return;
        outcome = 'ok';
        setDocs(rows);
        setConfigured(ok);
        setError(fetchError ? thaiError(fetchError, 'อัปเดตรายการเอกสารไม่สำเร็จ แสดงแหล่งข้อมูลที่มีอยู่ก่อน') : null);
      })
      .catch((e) => {
        // With a snapshot already on screen, a background revalidation
        // failure is not worth an alert banner.
        if (!cancelled) {
          outcome = 'failed';
          if (e.partialDocs) {
            partial = e.partialDocs;
            setDocs(mergeLibrarySources(snapshot?.docs || [], e.partialDocs));
          }
          setError(thaiError(e, 'โหลดรายการเอกสารไม่สำเร็จ'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  // Warm the reader chunk while the shelf sits idle, so the first เปิดอ่าน
  // waits only for document bytes, not for JavaScript. pdf.js has a chunk of
  // its own that the reader imports only when a document opens, so it is
  // warmed here too.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => { import('./PdfAnnotateView.jsx').catch(() => {}); import('pdfjs-dist').catch(() => {}); });
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

  // Matches inside the documents' own pages, asked of the server a beat after
  // the title search has already answered. Kept per query so a slow answer
  // for an older query can never fill in under a newer one.
  const textQuery = debouncedQuery.trim();
  const wantsText = textQuery.replace(/\s+/g, '').length >= TEXT_SEARCH_MIN;
  const [textHits, setTextHits] = useState({ q: '', rows: [] });
  useEffect(() => {
    if (!wantsText) return undefined;
    let alive = true;
    const t = setTimeout(() => {
      searchLibraryText(textQuery).then((rows) => { if (alive) setTextHits({ q: textQuery, rows }); });
    }, 220);
    return () => { alive = false; clearTimeout(t); };
  }, [textQuery, wantsText]);
  const textPending = searching && wantsText && textHits.q !== textQuery;
  const contentHits = useMemo(() => {
    if (!searching || !wantsText || textHits.q !== textQuery || !textHits.rows.length) return [];
    // The shelf's own filters apply to these too.
    const allowed = new Set(filterIndexed(docIndex, {
      kind, semester, academicYear, subject: subjectFilter || 'all',
    }).map((d) => d.slug));
    const bySlug = new Map(docs.map((d) => [d.slug, d]));
    return textHits.rows
      .filter((r) => allowed.has(r.slug) && bySlug.has(r.slug))
      .map((r) => ({ ...r, doc: bySlug.get(r.slug) }));
  }, [searching, wantsText, textHits, textQuery, docIndex, docs, kind, semester, academicYear, subjectFilter]);

  // The reader's own year first, as the clip shelf already does: it is the
  // one that opens, and on a phone it used to sit under four closed years.
  const groups = useMemo(
    () => (searching ? [] : ownYearFirst(groupByYearSubject(filtered), (g) => g.year, selectedYear)),
    [filtered, searching, selectedYear],
  );

  // Inside an open year, each subject folds on a phone: the year's 400-odd
  // cards in one column were a 37,000px page. Wider screens keep every subject
  // open, as before. A subject the student picked, or a year with only one,
  // opens anyway; a tap always wins over the default.
  const [subjectsOpenByDefault] = useState(() => !prefersCompactReading());
  const [subjectToggles, setSubjectToggles] = useState(() => new Map());
  const subjectOpen = (year, sg, count) => {
    const key = `${year}|${sg.subject}`;
    if (subjectToggles.has(key)) return subjectToggles.get(key);
    return subjectsOpenByDefault || subjectFilter === sg.subject || count === 1;
  };
  const toggleSubject = (year, sg, count) => {
    const key = `${year}|${sg.subject}`;
    const open = subjectOpen(year, sg, count);
    setSubjectToggles((prev) => new Map(prev).set(key, !open));
  };
  const showOnlySubject = (subject) => {
    setSubjectFilter(subject);
    touchedRef.current = false;
    try { document.querySelector('.vmx-lib-search')?.scrollIntoView({ block: 'start' }); } catch { /* the filter still applies */ }
  };
  // Cards a student asked for beyond the shared budget, per subject. The
  // one-subject filter alone never lifted the cap (the VCA shelf has 294
  // files and still showed 150), so a capped subject opens further a step at
  // a time, and what it adds never takes another subject's share.
  const [subjectExtra, setSubjectExtra] = useState(() => new Map());
  const showMore = (year, sg) => {
    const key = `${year}|${sg.subject}`;
    setSubjectExtra((prev) => new Map(prev).set(key, (prev.get(key) || 0) + BROWSE_STEP));
  };

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

  const openDocAt = useCallback((doc, page) => {
    recordRecentDoc(doc);
    setRecentDocs(listRecentDocs());
    onOpenDoc(readerPayload(doc, { page }));
  }, [onOpenDoc]);

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

      <div className="vmx-library-intro">
        <div className="vmx-library-intro-copy">
        <h1 style={{ margin: '0 0 4px', fontSize: 22 }}>คลังเอกสารการเรียน</h1>
        <p style={{ color: 'var(--clr-ink-soft)', fontSize: 14, margin: 0 }}>
          ค้นหาเอกสารตามชั้นปี วิชา และหัวข้อ เปิดอ่าน PDF ในแอปพร้อมขีดเขียน
          หรือเปิดเอกสาร VCA จาก Google Drive ต้นฉบับ
        </p>
        {docs.length > 0 && (
          <div className="vmx-lib-result-count" style={{ marginTop: 6, marginBottom: 0 }}>
            {hasFilters && !searching
              ? `แสดง ${filtered.length.toLocaleString()} จาก ${docs.length.toLocaleString()} รายการ`
              : `${docs.length.toLocaleString()} รายการ จาก ${subjectTotal} วิชา`}
          </div>
        )}
        </div>
        {onOpenLocalPdf && (
          <button type="button" className="vmx-btn vmx-library-local-pdf" onClick={onOpenLocalPdf}>
            เปิด PDF ของฉัน
          </button>
        )}
      </div>

      <FeatureTip id="library" />

      <div className="vmx-chip-row" role="group" aria-label="แหล่งเอกสาร" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={`vmx-chip ${activeTab === 'internal' ? 'active' : ''}`}
          aria-pressed={activeTab === 'internal'}
          onClick={() => setActiveTab('internal')}
        >
          เอกสารในระบบ
        </button>
        <button
          type="button"
          className={`vmx-chip ${activeTab === 'external' ? 'active' : ''}`}
          aria-pressed={activeTab === 'external'}
          onClick={() => setActiveTab('external')}
        >
          เอกสารภายนอก
        </button>
      </div>

      {activeTab === 'external' && <ExternalDocsSection user={user} />}

      <div style={{ display: activeTab === 'internal' ? 'block' : 'none' }}>
        {(subjectFilter === 'vca' || /vca/i.test(debouncedQuery)) && (
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-ink-soft)', margin: '0 0 16px' }}>
          ชุดนี้รวมเอกสารและบันทึกข้อสอบย้อนหลัง เฉลยในต้นฉบับบางข้อยังต้องตรวจเทียบ
          {' '}เปิดอ่านจากสำเนาที่เก็บไว้ในคลัง VetMock ได้ แม้ลิงก์ต้นทางจะใช้งานไม่ได้
          {' '}กำหนดการและเกณฑ์รอบปัจจุบันดูได้ที่{' '}
          <a href="https://eval.vetcouncil.or.th/students/news" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', minHeight: 44, padding: '10px 0', boxSizing: 'border-box' }}>ประกาศศูนย์ประเมินฯ สัตวแพทยสภา</a>
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อเอกสาร วิชา ผู้สอน หรือคำในเนื้อหา…"
          aria-label="ค้นหาเอกสารในคลัง"
          className="vmx-lib-search"
          enterKeyHint="search"
          style={{
            // fontSize omitted deliberately: the inline 14px overrode the
            // max(16px, 1em) input floor in styles.css, and iOS zooms the whole
            // page when a focused input is under 16px.
            width: '100%', padding: '10px 14px',
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
          fontSize: 14, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span style={{ flex: 1, minWidth: 180 }}>{error}</span>
          {(
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
          <Mochi state="encourage" size={56} slot="library-status" className="vmx-empty-mochi" /><p>คลังเอกสารยังไม่พร้อมใช้งานในเครื่องนี้</p>
          <p style={{ fontSize: 14, color: 'var(--clr-ink-soft)' }}>ลองเปิดจากเว็บหลักอีกครั้ง หรือกดลองใหม่</p>
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
          <img
            src={EMPTY_ART.library.src}
            alt={EMPTY_ART.library.alt}
            width={640}
            height={480}
            loading="lazy"
            decoding="async"
            style={{ width: 'min(240px, 70%)', height: 'auto', margin: '0 auto 4px', display: 'block' }}
          />
          <p>ยังไม่มีเอกสารในคลัง</p>
          <p style={{ fontSize: 14, color: 'var(--clr-ink-soft)' }}>
            เอกสารจะขึ้นที่นี่เมื่อมีการเพิ่มเข้าคลัง
          </p>
        </div>
      )}

      {!loading && configured && docs.length > 0 && filtered.length === 0 && contentHits.length === 0 && !textPending && (
        <div className="vmx-empty-state">
          <Mochi state="curious" size={56} slot="library-status" className="vmx-empty-mochi" /><p>ไม่พบเอกสารที่ตรงกับที่เลือก</p>
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
          <div className="vmx-lib-result-count" role="status">
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
            <p style={{ fontSize: 14, color: 'var(--clr-ink-soft)', textAlign: 'center', marginTop: 14 }}>
              แสดง {visibleFlat.length} จาก {filtered.length} รายการ — พิมพ์คำค้นเพิ่มเพื่อแคบผลลัพธ์
            </p>
          )}
        </>
      )}

      {/* Search mode — where the words appear inside the documents */}
      {!loading && contentHits.length > 0 && (
        <section aria-label="พบในเนื้อหาเอกสาร" style={{ marginTop: filtered.length > 0 ? 22 : 0 }}>
          <div className="vmx-lib-result-count" role="status">
            พบในเนื้อหาเอกสาร {contentHits.length} ไฟล์
          </div>
          <div style={gridStyle}>
            {contentHits.map(({ doc, page, hits, snippet }) => (
              <article key={doc.id} className="vmx-lib-card" style={cardStyle}>
                <h3 className="vmx-lib-card-title">{displayDocTitle(doc.title)}</h3>
                {snippet && (
                  <p className="vmx-lib-card-desc vmx-lib-snippet">
                    …{markTerms(snippet, textQuery).map((part, i) => (part.hit ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>))}…
                  </p>
                )}
                <div className="vmx-lib-card-meta">
                  {[subjectName(doc.subject), `หน้า ${page}`, hits > 1 ? `พบ ${hits} หน้า` : null].filter(Boolean).join(', ')}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
                  <button
                    type="button"
                    className="vmx-btn vmx-btn-primary vmx-btn-sm"
                    {...intentProps(doc)}
                    onClick={() => openDocAt(doc, page)}
                  >
                    เปิดหน้า {page}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Recently opened — continue where you left off, ahead of the hunt */}
      {!loading && !searching && recentOnShelf.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="vmx-lib-filter-label">เปิดล่าสุด</div>
          <div className="vmx-stagger" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {recentOnShelf.map((doc) => (
              <button
                key={doc.slug}
                type="button"
                className="vmx-chip"
                title={displayDocTitle(doc.title)}
                onClick={() => openDoc(doc)}
                style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {displayDocTitle(doc.title)}
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
                      <span className="vmx-lib-year-count">
                        {group.count} ไฟล์, {group.subjects.length} วิชา
                      </span>
                    </button>
                  </h2>

                  {open && (
                    <div className="vmx-lib-year-body">
                      {group.subjects.map((sg) => {
                        // The render budget is shared across the whole tree, so
                        // expanding a second year can leave nothing for a
                        // subject in a year that is still open. Returning null
                        // there made the group vanish with no explanation — the
                        // shelf looked empty rather than capped. Keep the
                        // heading and the count line; only the card grid is
                        // skipped, so nothing extra is mounted.
                        const budget = Math.max(0, MAX_BROWSE_CARDS - rendered);
                        const subjectIsOpen = subjectOpen(group.year, sg, group.subjects.length);
                        const extra = subjectExtra.get(`${group.year}|${sg.subject}`) || 0;
                        const shown = subjectIsOpen ? sg.docs.slice(0, budget + extra) : [];
                        // Only the shared share counts against the subjects below.
                        rendered += Math.min(shown.length, budget);
                        const hidden = sg.docs.length - shown.length;
                        const code = subjectMeta(sg.subject)?.code;
                        return (
                          <div key={sg.subject} className="vmx-lib-subject">
                            <h3 className="vmx-lib-subject-heading">
                              <button
                                type="button"
                                className="vmx-lib-subject-toggle"
                                aria-expanded={subjectIsOpen}
                                onClick={() => toggleSubject(group.year, sg, group.subjects.length)}
                              >
                                <span aria-hidden="true" className="vmx-lib-subject-icon">{subjectIcon(sg.subject)}</span>
                                <span className="vmx-lib-subject-text">
                                  <span className="vmx-lib-subject-name">{subjectName(sg.subject)}</span>
                                  {(code || sg.semester != null) && (
                                    <span className="vmx-lib-subject-meta">
                                      {[code, sg.semester != null ? semesterLabel(sg.semester) : null].filter(Boolean).join(', ')}
                                    </span>
                                  )}
                                </span>
                                <span className="vmx-lib-subject-count">{sg.count} ไฟล์</span>
                                <span aria-hidden="true" className="vmx-lib-subject-chevron">{subjectIsOpen ? '▾' : '▸'}</span>
                              </button>
                            </h3>
                            {shown.length > 0 && (
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
                            )}
                            {subjectIsOpen && hidden > 0 && (
                              <div className="vmx-lib-capped">
                                <p>
                                  {/* Do not blame open years. One year is open by
                                      default and a single year's shelf already
                                      passes the card budget on its own, so the
                                      old wording told a student with nothing else
                                      open to go and close it. The line states
                                      what is shown and the buttons below say what
                                      to do: it once pointed at a button the
                                      one-subject filter had just removed. */}
                                  {shown.length === 0
                                    ? `ยังไม่ได้แสดง ${sg.docs.length} ไฟล์ของวิชานี้`
                                    : `แสดง ${shown.length} จาก ${sg.docs.length} ไฟล์`}
                                </p>
                                <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => showMore(group.year, sg)}>
                                  แสดงอีก {Math.min(BROWSE_STEP, hidden)} ไฟล์
                                </button>
                                {subjectFilter !== sg.subject && (
                                  <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => showOnlySubject(sg.subject)}>
                                    แสดงเฉพาะวิชานี้
                                  </button>
                                )}
                              </div>
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
    </div>
  );
}
