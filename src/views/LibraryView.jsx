// ============================================================
// LibraryView — คลังเอกสารการเรียน
// ============================================================
//
// Catalog rows come from Supabase (public.library_docs); the bytes come from
// an object store the app never bundles. Opening a document hands it to the
// existing PdfAnnotateView, which means library PDFs get the same pen, eraser
// and per-page stroke storage as an uploaded file — the catalog carries the
// SHA-256 that annotation store keys on, so the strokes survive a reopen
// without the browser ever downloading the file twice.
//
// States: loading → (unconfigured | error | empty | grid).
// ============================================================

import { useCallback, useEffect, useMemo, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import { SUBJECTS } from '../data/curriculum.js';
import {
  LIBRARY_KINDS,
  fetchLibraryDocs,
  filterIndexed,
  formatBytes,
  indexDocs,
  kindLabel,
  resolveDocUrl,
} from '../lib/library.js';

// Module-scope lookup — a `.find()` inside the card map would be O(n) per row
// per render over ~80 subjects.
const SUBJECT_META = new Map(SUBJECTS.map((s) => [s.id, s]));

// An empty query matches everything. Mounting several hundred cards at once is
// the 200–400 ms freeze this codebase has hit before, so the grid is capped and
// says so rather than silently truncating.
const MAX_RESULTS = 60;

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

export default function LibraryView({ goHome, onOpenDoc }) {
  const [docs, setDocs] = useState([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [year, setYear] = useState('all');

  // 80 ms sits below the input-echo threshold, so typing stays instant while
  // the filter runs once per burst instead of once per keystroke.
  useEffect(() => {
    if (query === debouncedQuery) return undefined;
    const t = setTimeout(() => setDebouncedQuery(query), 80);
    return () => clearTimeout(t);
  }, [query, debouncedQuery]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { docs: rows, configured: ok } = await fetchLibraryDocs();
        if (cancelled) return;
        setDocs(rows);
        setConfigured(ok);
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const docIndex = useMemo(() => indexDocs(docs), [docs]);

  const yearChips = useMemo(() => {
    const years = new Set();
    for (const d of docs) if (d.year != null) years.add(d.year);
    return [...years].sort((a, b) => a - b);
  }, [docs]);

  const kindChips = useMemo(() => {
    const present = new Set(docs.map((d) => d.kind));
    return LIBRARY_KINDS.filter((k) => k.id === 'all' || present.has(k.id));
  }, [docs]);

  const filtered = useMemo(
    () => filterIndexed(docIndex, { query: debouncedQuery, kind, year }),
    [docIndex, debouncedQuery, kind, year],
  );
  const visible = filtered.slice(0, MAX_RESULTS);

  const openDoc = useCallback(async (doc) => {
    setBusyId(doc.id);
    setError(null);
    try {
      const url = await resolveDocUrl(doc);
      onOpenDoc({
        url,
        fileName: `${doc.title}.pdf`,
        sha256: doc.sha256_16,
        slug: doc.slug,
        linearized: doc.linearized,
      });
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setBusyId(null);
    }
  }, [onOpenDoc]);

  // Opens the object URL in a new tab, where the browser's own PDF UI offers
  // Save. A `download` attribute is ignored cross-origin, so promising a
  // direct download here would be a lie on every provider.
  const openOriginal = useCallback(async (doc) => {
    setBusyId(doc.id);
    setError(null);
    try {
      const url = await resolveDocUrl(doc);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setBusyId(null);
    }
  }, []);

  return (
    <div>
      <BackBar onBack={goHome} label="กลับหน้าแรก" subtitle="คลังเอกสาร" />

      <div style={{ padding: '4px 0 16px' }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          📚 Study library
        </div>
        <h1 style={{ margin: '6px 0 4px', fontSize: 22 }}>คลังเอกสารการเรียน</h1>
        <p style={{ color: 'var(--clr-ink-soft)', fontSize: 13, margin: 0 }}>
          เปิดอ่านในแอปแล้วขีดเขียนได้เลย — เอกสารที่เขียนไว้จะกลับมาเหมือนเดิมทุกครั้งที่เปิดใหม่
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อเอกสาร วิชา หรือหัวข้อ…"
          aria-label="ค้นหาเอกสารในคลัง"
          style={{
            width: '100%', padding: '10px 14px', fontSize: 14,
            border: '1px solid var(--clr-border)', borderRadius: 8,
            background: 'var(--clr-bg)', color: 'var(--clr-ink)',
          }}
        />
        {kindChips.length > 2 && (
          <div className="vmx-chip-row">
            {kindChips.map((k) => (
              <button
                key={k.id}
                type="button"
                className={`vmx-chip ${kind === k.id ? 'active' : ''}`}
                aria-pressed={kind === k.id}
                onClick={() => setKind(k.id)}
              >
                {k.label}
              </button>
            ))}
          </div>
        )}
        {yearChips.length > 1 && (
          <div className="vmx-chip-row">
            <button
              type="button"
              className={`vmx-chip ${year === 'all' ? 'active' : ''}`}
              aria-pressed={year === 'all'}
              onClick={() => setYear('all')}
            >
              ทุกชั้นปี
            </button>
            {yearChips.map((y) => (
              <button
                key={y}
                type="button"
                className={`vmx-chip ${String(year) === String(y) ? 'active' : ''}`}
                aria-pressed={String(year) === String(y)}
                onClick={() => setYear(y)}
              >
                ปี {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div role="alert" style={{
          border: '1px solid var(--clr-rose)', background: 'var(--clr-rose-soft)',
          color: 'var(--clr-rose-text)', borderRadius: 8, padding: '10px 14px',
          fontSize: 13, marginBottom: 14,
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div role="status" aria-label="กำลังโหลดคลังเอกสาร" style={gridStyle}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="vmx-lab-skeleton" aria-hidden="true" style={{ ...cardStyle, height: 132, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      )}

      {!loading && !configured && (
        <div className="vmx-empty-state">
          <p>คลังเอกสารยังไม่พร้อมใช้งานในเครื่องนี้</p>
          <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
            ลองเปิดจากเว็บหลักอีกครั้ง
          </p>
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
          <p>ไม่พบเอกสารที่ตรงกับที่ค้นหา</p>
        </div>
      )}

      {visible.length > 0 && (
        <>
          <div style={gridStyle}>
            {visible.map((doc) => {
              const subject = SUBJECT_META.get(doc.subject);
              const busy = busyId === doc.id;
              return (
                <article key={doc.id} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: 15, margin: 0, lineHeight: 1.35 }}>{doc.title}</h2>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--vmx-mono)', whiteSpace: 'nowrap',
                      color: KIND_TONE[doc.kind] || KIND_TONE.other,
                    }}>
                      {kindLabel(doc.kind)}
                    </span>
                  </div>

                  {doc.description && (
                    <p style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', margin: 0, lineHeight: 1.5 }}>
                      {doc.description}
                    </p>
                  )}

                  <div style={{ fontSize: 11.5, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
                    {[
                      subject?.name || doc.subject,
                      doc.year != null ? `ปี ${doc.year}` : null,
                      doc.page_count ? `${doc.page_count} หน้า` : null,
                      formatBytes(doc.byte_size),
                    ].filter(Boolean).join(' · ')}
                  </div>

                  {(doc.attribution || doc.license) && (
                    <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>
                      {doc.attribution ? `ที่มา: ${doc.attribution}` : null}
                      {doc.attribution && doc.license ? ' · ' : null}
                      {doc.license}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 4 }}>
                    <button
                      type="button"
                      className="vmx-btn vmx-btn-primary vmx-btn-sm"
                      disabled={busy}
                      onClick={() => openDoc(doc)}
                    >
                      {busy ? 'กำลังเปิด…' : 'เปิดอ่าน'}
                    </button>
                    <button
                      type="button"
                      className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                      disabled={busy}
                      onClick={() => openOriginal(doc)}
                    >
                      เปิดไฟล์ต้นฉบับ
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length > visible.length && (
            <p style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', textAlign: 'center', marginTop: 14 }}>
              แสดง {visible.length} จาก {filtered.length} รายการ — พิมพ์คำค้นเพิ่มเพื่อแคบผลลัพธ์
            </p>
          )}
        </>
      )}
    </div>
  );
}
