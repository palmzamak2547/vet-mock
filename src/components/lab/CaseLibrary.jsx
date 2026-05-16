import { useState, useEffect, useCallback, useMemo } from 'react';

// DICOM Modality (0008,0060) values map into 5 user-facing buckets.
// X-ray rolls up DX/CR/RG/RF/MG/PX since to a vet student they're
// all "radiographs"; CT/MR/US stand alone; everything else into
// 'other'. Add new codes to the X-ray list if a case shows up with
// a missing modality (e.g. some old scanners use 'DR').
function modalityToKey(modality) {
  if (!modality) return 'other';
  const M = String(modality).toUpperCase().trim();
  if (['DX', 'CR', 'RG', 'RF', 'MG', 'PX', 'DR'].includes(M)) return 'xray';
  if (M === 'CT') return 'ct';
  if (M === 'MR') return 'mri';
  if (M === 'US') return 'us';
  return 'other';
}

const MODALITY_TABS = [
  { k: 'all',   label: 'All',         icon: '📚' },
  { k: 'xray',  label: 'X-ray',       icon: '🦴' },
  { k: 'ct',    label: 'CT',          icon: '🧠' },
  { k: 'mri',   label: 'MRI',         icon: '🧲' },
  { k: 'us',    label: 'Ultrasound',  icon: '🌊' },
  { k: 'other', label: 'Other',       icon: '❓' },
];

function modalityBadgeStyle(k) {
  const bg = {
    xray: '#5a7ba8', ct: '#a86b5a', mri: '#7a5aa8', us: '#5aa87a', other: '#888',
  }[k] || '#888';
  return { ...badgeBase, background: bg };
}

function modalityShortLabel(k) {
  return MODALITY_TABS.find((t) => t.k === k)?.label || 'other';
}

// CaseLibrary — list public imaging cases from Supabase and open one
// for practice. Reads through RLS (status='public'), so the anon
// session is enough — no sign-in required. Storage URLs are signed
// per-open via createSignedUrl so the bucket can stay private.

export default function CaseLibrary({ onOpenCase, onBack }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openingId, setOpeningId] = useState(null);
  // Modality filter persists across mounts so a user who picked "X-ray"
  // last time doesn't see "All" again on the next visit.
  const [modalityFilter, setModalityFilter] = useState(() => {
    try {
      return localStorage.getItem('vmx-lab-modality-filter') || 'all';
    } catch { return 'all'; }
  });
  const onSetModalityFilter = useCallback((k) => {
    setModalityFilter(k);
    try { localStorage.setItem('vmx-lab-modality-filter', k); } catch { /* noop */ }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { hasSupabase, getSupabase } = await import('../../lib/supabase.js');
        // hasSupabase is a boolean constant (not a function) — VetMock's
        // existing convention. False when env vars are missing.
        if (!hasSupabase) {
          if (!cancelled) setLoading(false);
          return;
        }
        const sb = await getSupabase();
        const { data, error: err } = await sb
          .from('imaging_cases')
          .select('id, slug, title, species, signalment, history, body_part, modality, learning_objectives, difficulty, license, source_url, attribution, credibility')
          .eq('status', 'public')
          .order('created_at', { ascending: false });
        if (err) throw err;
        if (!cancelled) setCases(data || []);
      } catch (e) {
        // Pre-migration state — table doesn't exist yet — looks the
        // same to the user as "no public cases". Surface as empty
        // state, not as an error.
        const msg = e?.message || String(e);
        const isPreMigration = /schema cache|imaging_cases|does not exist|relation .* does not exist/i.test(msg);
        if (!cancelled) {
          if (isPreMigration) {
            // eslint-disable-next-line no-console
            console.info('[CaseLibrary] imaging_cases table not yet migrated — showing empty state');
            setCases([]);
          } else {
            setError(msg);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleOpen = useCallback(async (c) => {
    setOpeningId(c.id);
    try {
      const { getSupabase } = await import('../../lib/supabase.js');
      const sb = await getSupabase();
      const { data: files, error: filesErr } = await sb
        .from('imaging_case_files')
        .select('id, view_name, storage_path, transfer_syntax, pixel_spacing_mm')
        .eq('case_id', c.id)
        .order('display_order');
      if (filesErr) throw filesErr;
      if (!files || files.length === 0) {
        throw new Error('Case has no DICOM files yet');
      }
      // Fetch up to 2 files for the side-by-side study viewer.
      // Each gets its own signed URL (10 min) and is downloaded in
      // parallel via Promise.all to minimize wall time.
      const filesToFetch = files.slice(0, 2);
      const fetched = await Promise.all(filesToFetch.map(async (row) => {
        const { data: signed, error: signedErr } = await sb.storage
          .from('lab-dicom')
          .createSignedUrl(row.storage_path, 600);
        if (signedErr) throw new Error(`Sign URL failed (${row.view_name}): ${signedErr.message}`);
        const res = await fetch(signed.signedUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${row.view_name}`);
        const buf = await res.arrayBuffer();
        return new File([buf], `${c.slug}_${row.view_name}.dcm`, { type: 'application/dicom' });
      }));
      onOpenCase(fetched, c);  // array — LabView now accepts File[]
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[CaseLibrary] open case error:', e);
      setError(e?.message || String(e));
    } finally {
      setOpeningId(null);
    }
  }, [onOpenCase]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.15rem', margin: 0 }}>📚 Case library</h2>
        <button onClick={onBack} className="vmx-btn vmx-btn-ghost vmx-btn-sm">← back to drag-drop</button>
      </div>

      {loading && (
        <div style={gridStyle}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ ...cardStyle, height: 180, animation: `vmx-lab-skeleton-pulse 1.4s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }}>
              <div style={{ height: 14, width: '60%', background: '#e8e8e8', borderRadius: 3, marginBottom: 8 }} />
              <div style={{ height: 10, width: '85%', background: '#eee', borderRadius: 3, marginBottom: 6 }} />
              <div style={{ height: 10, width: '70%', background: '#eee', borderRadius: 3, marginBottom: 16 }} />
              <div style={{ height: 32, width: '100%', background: '#e8e8e8', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={errorStyle}>โหลดไม่สำเร็จ: {error}</div>
      )}

      {!loading && !error && cases.length > 0 && (
        <ModalityTabs cases={cases} active={modalityFilter} onSelect={onSetModalityFilter} />
      )}

      {!loading && !error && cases.length === 0 && (
        <div style={emptyStyle}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
          <div>ยังไม่มี public case ในระบบ</div>
          <div style={{ fontSize: '0.78rem', marginTop: 12, color: '#888', lineHeight: 1.5 }}>
            Palm สามารถ seed cases ผ่าน Supabase Studio (set <code>status = 'public'</code>)
            <br />อ่าน <code>supabase/README-imaging-lab.md</code> สำหรับ anonymization checklist
            ก่อนเปิด case เป็น public — patient data ต้อง strip identifying tags + ได้ consent ก่อน
          </div>
        </div>
      )}

      {!loading && !error && cases.length > 0 && (() => {
        const filtered = modalityFilter === 'all'
          ? cases
          : cases.filter((c) => modalityToKey(c.modality) === modalityFilter);
        if (filtered.length === 0) {
          return (
            <div style={emptyModalityStyle}>
              <div style={{ fontSize: '2rem', marginBottom: 6 }}>📭</div>
              <div>ยังไม่มี <strong>{modalityShortLabel(modalityFilter)}</strong> case ใน library</div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 6 }}>
                {modalityFilter === 'xray'
                  ? 'แปลกแล้ว — น่ามี X-ray cases · ลอง refresh'
                  : `${modalityShortLabel(modalityFilter)} cases จะเพิ่มในเซสชันถัดไป (ขึ้นกับ CC dataset ที่หาเจอ + CUVET path)`}
              </div>
            </div>
          );
        }
        return (
          <div style={gridStyle}>
            {filtered.map((c) => (
              <CaseCard
                key={c.id}
                caseData={c}
                onOpen={() => handleOpen(c)}
                opening={openingId === c.id}
              />
            ))}
          </div>
        );
      })()}
    </div>
  );
}

function ModalityTabs({ cases, active, onSelect }) {
  const counts = useMemo(() => {
    const c = { all: cases.length, xray: 0, ct: 0, mri: 0, us: 0, other: 0 };
    for (const cs of cases) c[modalityToKey(cs.modality)]++;
    return c;
  }, [cases]);
  return (
    <div style={tabRowStyle}>
      {MODALITY_TABS.map((t) => {
        const count = counts[t.k] || 0;
        const isActive = active === t.k;
        const isEmpty = count === 0 && t.k !== 'all';
        return (
          <button
            key={t.k}
            onClick={() => onSelect(t.k)}
            disabled={isEmpty}
            style={{
              ...tabBtnStyle,
              ...(isActive ? tabBtnActiveStyle : {}),
              ...(isEmpty ? tabBtnEmptyStyle : {}),
            }}
            title={isEmpty ? `ยังไม่มี ${t.label} case` : `${t.label} (${count} case)`}
          >
            {t.icon} {t.label} <span style={{ opacity: 0.7, fontSize: '0.85em' }}>({count})</span>
          </button>
        );
      })}
    </div>
  );
}

function CaseCard({ caseData, onOpen, opening }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', flex: '1 1 60%', minWidth: 0 }}>{caseData.title}</h3>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {caseData.modality && (
            <span style={modalityBadgeStyle(modalityToKey(caseData.modality))} title={`Modality: ${caseData.modality}`}>
              {MODALITY_TABS.find((t) => t.k === modalityToKey(caseData.modality))?.icon}{' '}
              {modalityShortLabel(modalityToKey(caseData.modality))}
            </span>
          )}
          {caseData.difficulty && (
            <span style={{ ...badgeBase, background: difficultyColor(caseData.difficulty) }}>{caseData.difficulty}</span>
          )}
          {caseData.credibility && (
            <span
              style={{ ...badgeBase, background: credibilityColor(caseData.credibility) }}
              title={credibilityHint(caseData.credibility)}
            >
              {credibilityShort(caseData.credibility)}
            </span>
          )}
        </div>
      </div>
      <p style={{ margin: '4px 0', fontSize: '0.78rem', color: '#666' }}>
        {[caseData.species, caseData.signalment, caseData.body_part].filter(Boolean).join(' · ')}
      </p>
      {caseData.history && (
        <p style={{ margin: '6px 0', fontSize: '0.78rem', color: '#555' }}>{caseData.history}</p>
      )}
      {caseData.learning_objectives?.length > 0 && (
        <ul style={{ margin: '6px 0 8px', paddingLeft: 18, fontSize: '0.75rem', color: '#666' }}>
          {caseData.learning_objectives.slice(0, 3).map((obj, i) => <li key={i}>{obj}</li>)}
        </ul>
      )}
      {(caseData.license || caseData.source_url) && (
        <div style={licenseRowStyle}>
          {caseData.license && <span title="License">📜 {caseData.license}</span>}
          {caseData.source_url && caseData.source_url !== 'internal' && (
            <> · <a href={caseData.source_url} target="_blank" rel="noopener noreferrer" style={sourceLinkStyle}>source ↗</a></>
          )}
        </div>
      )}
      <button
        onClick={onOpen}
        disabled={opening}
        className="vmx-btn vmx-btn-primary vmx-btn-sm"
        style={{ marginTop: 6, width: '100%' }}
      >
        {opening ? 'กำลังโหลด...' : 'เปิด case'}
      </button>
    </div>
  );
}

function difficultyColor(d) {
  if (d === 'intro') return '#4a6b4a';
  if (d === 'advanced') return '#c0392b';
  return '#888';
}

function credibilityShort(c) {
  if (c === 'peer-reviewed') return '🏛 peer-reviewed';
  if (c === 'open-textbook') return '📖 open-textbook';
  if (c === 'community') return '👥 community';
  if (c === 'cuvet-internal') return '🐾 CUVET';
  if (c === 'sample-demo') return '🧪 demo';
  return c;
}

function credibilityColor(c) {
  if (c === 'peer-reviewed') return '#3a5a8a';
  if (c === 'open-textbook') return '#5a8a5a';
  if (c === 'community') return '#8a7a3a';
  if (c === 'cuvet-internal') return '#8a3a5a';
  if (c === 'sample-demo') return '#888';
  return '#999';
}

function credibilityHint(c) {
  if (c === 'peer-reviewed') return 'จาก peer-reviewed publication หรือ academic dataset';
  if (c === 'open-textbook') return 'จาก textbook ที่เปิด open license';
  if (c === 'community') return 'จาก community contribution (เช่น Radiopaedia)';
  if (c === 'cuvet-internal') return 'จาก CUVET hospital · anonymized + consent';
  if (c === 'sample-demo') return 'Sample DICOM สำหรับทดลอง viewer · ไม่ใช่ clinical case';
  return '';
}

// Skeleton-pulse keyframes for Case Library loading state — injected once
if (typeof document !== 'undefined' && !document.getElementById('vmx-lab-skeleton-keyframes')) {
  const s = document.createElement('style');
  s.id = 'vmx-lab-skeleton-keyframes';
  s.textContent = `@keyframes vmx-lab-skeleton-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }`;
  document.head.appendChild(s);
}

const loadingStyle = { padding: 40, textAlign: 'center', color: '#888' };
const errorStyle = {
  padding: '12px 16px',
  background: '#fff5f5',
  border: '1px solid #fcc',
  borderRadius: 6,
  color: '#a33',
  fontSize: '0.85rem',
};
const emptyStyle = {
  padding: 36,
  textAlign: 'center',
  color: '#666',
  background: '#fafafa',
  border: '1px dashed #ccc',
  borderRadius: 8,
};
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 12,
};
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: 8,
  padding: 14,
  background: '#fff',
};

const badgeBase = {
  fontSize: '0.65rem',
  padding: '2px 6px',
  color: '#fff',
  borderRadius: 3,
  whiteSpace: 'nowrap',
  fontWeight: 600,
};

const licenseRowStyle = {
  margin: '6px 0',
  padding: '6px 8px',
  background: '#f8f8f8',
  borderRadius: 4,
  fontSize: '0.7rem',
  color: '#666',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 4,
};

const sourceLinkStyle = {
  color: '#3a5a8a',
  textDecoration: 'underline',
};

const tabRowStyle = {
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
  marginBottom: 12,
  padding: '6px 0',
  borderBottom: '1px solid #eee',
};

const tabBtnStyle = {
  padding: '6px 12px',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '0.82rem',
  whiteSpace: 'nowrap',
  minHeight: 32,
};

const tabBtnActiveStyle = {
  background: '#4a6b4a',
  color: '#fff',
  borderColor: '#3a5a3a',
};

const tabBtnEmptyStyle = {
  opacity: 0.45,
  cursor: 'not-allowed',
};

const emptyModalityStyle = {
  padding: 36,
  textAlign: 'center',
  color: '#666',
  background: '#fafafa',
  border: '1px dashed #ccc',
  borderRadius: 8,
};
