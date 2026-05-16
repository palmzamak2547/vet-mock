import { useState, useEffect, useCallback } from 'react';

// CaseLibrary — list public imaging cases from Supabase and open one
// for practice. Reads through RLS (status='public'), so the anon
// session is enough — no sign-in required. Storage URLs are signed
// per-open via createSignedUrl so the bucket can stay private.

export default function CaseLibrary({ onOpenCase, onBack }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openingId, setOpeningId] = useState(null);

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
          .select('id, slug, title, species, signalment, history, body_part, learning_objectives, difficulty')
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

      {loading && <div style={loadingStyle}>กำลังโหลด cases...</div>}

      {error && (
        <div style={errorStyle}>โหลดไม่สำเร็จ: {error}</div>
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

      {!loading && !error && cases.length > 0 && (
        <div style={gridStyle}>
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              caseData={c}
              onOpen={() => handleOpen(c)}
              opening={openingId === c.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCard({ caseData, onOpen, opening }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '0.98rem' }}>{caseData.title}</h3>
        {caseData.difficulty && (
          <span style={{
            fontSize: '0.68rem',
            padding: '2px 6px',
            background: difficultyColor(caseData.difficulty),
            color: '#fff',
            borderRadius: 3,
            whiteSpace: 'nowrap',
          }}>{caseData.difficulty}</span>
        )}
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
