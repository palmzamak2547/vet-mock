import { useState, useCallback, useEffect, Suspense, lazy } from 'react';

const DicomViewport = lazy(() => import('../components/lab/DicomViewport.jsx'));
const CaseLibrary = lazy(() => import('../components/lab/CaseLibrary.jsx'));

// Lazy-loads the anonymizer module + dicom-parser only when needed.
// Keeps the lab home page light for users who never anonymize.
function AnonymizeButton({ file }) {
  const [status, setStatus] = useState('idle');
  const [summary, setSummary] = useState(null);

  const run = async () => {
    setStatus('working');
    setSummary(null);
    try {
      const mod = await import('../lib/dicom/anonymizer.js');
      const { file: anon, stripped } = await mod.anonymizeDicom(file);
      mod.downloadFile(anon);
      setSummary({ count: stripped.length, names: stripped.map(s => s.label) });
      setStatus('done');
      setTimeout(() => setStatus('idle'), 6000);
    } catch (e) {
      setStatus('error');
      setSummary({ error: e?.message || String(e) });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={run}
        disabled={status === 'working'}
        className="vmx-btn vmx-btn-ghost vmx-btn-sm"
        title="Strip PII tags + download anonymized copy"
      >
        {status === 'working' ? '⏳ กำลัง anonymize...' : status === 'done' ? '✅ Downloaded' : '🔒 Anonymize'}
      </button>
      {summary && status !== 'working' && (
        <div style={anonSummaryStyle}>
          {summary.error ? (
            <span style={{ color: '#c33' }}>❌ {summary.error}</span>
          ) : (
            <>
              <strong>Stripped {summary.count} tags</strong>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: '0.7rem' }}>
                {summary.names.slice(0, 6).map((n) => <li key={n}>{n}</li>)}
                {summary.names.length > 6 && <li>… +{summary.names.length - 6} more</li>}
              </ul>
              <div style={{ fontSize: '0.65rem', color: '#888', marginTop: 4 }}>
                Saved as <code>{file.name.replace(/\.dcm$/i, '')}_anon.dcm</code>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const anonSummaryStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 4,
  padding: '8px 10px',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: '0.78rem',
  minWidth: 220,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 100,
};

const RECENT_KEY = 'vmx-lab-recent-files';
const RECENT_MAX = 5;

// Check the DICOM magic-byte signature "DICM" at offset 128. This
// catches files exported without a .dcm extension (common when PACS
// dumps SOP-Instance-UID as filename). Reads only the first 200
// bytes — cheap.
async function isDicomFile(file) {
  if (!file) return false;
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.dcm') || lower.endsWith('.dicom')) return true;
  if (file.type === 'application/dicom') return true;
  if (file.size < 132) return false;
  try {
    const head = await file.slice(0, 200).arrayBuffer();
    const view = new Uint8Array(head);
    return view[128] === 0x44 && view[129] === 0x49 && view[130] === 0x43 && view[131] === 0x4D;
  } catch {
    return false;
  }
}

export default function LabView({ goHome }) {
  const [file, setFile] = useState(null);
  const [currentCase, setCurrentCase] = useState(null);
  const [showCases, setShowCases] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const [recent, setRecent] = useState([]);

  // Recent files history. Stored as {name,size,lastModified} so we
  // can recognize files dragged from disk again. Actual File blobs
  // can't be persisted — the user must re-drag, but the list nudges
  // them toward "the file I used yesterday".
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch { /* corrupt JSON; ignore */ }
  }, []);

  const addToRecent = useCallback((f) => {
    if (!f) return;
    const entry = { name: f.name, size: f.size, lastModified: f.lastModified || Date.now() };
    setRecent((prev) => {
      const next = [entry, ...prev.filter((p) => !(p.name === entry.name && p.size === entry.size))].slice(0, RECENT_MAX);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* quota or private mode */ }
      return next;
    });
  }, []);

  const handleFile = useCallback(async (f) => {
    if (!f) return;
    const ok = await isDicomFile(f);
    if (!ok) {
      setError('ไฟล์ไม่ใช่ DICOM (magic bytes "DICM" ไม่ตรง · ลองไฟล์อื่น)');
      return;
    }
    setError(null);
    setFile(f);
    setCurrentCase(null);
    addToRecent(f);
  }, [addToRecent]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer?.files?.[0]);
  }, [handleFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragging(false);
  }, []);

  const onFileInput = useCallback((e) => handleFile(e.target.files?.[0]), [handleFile]);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch { /* noop */ }
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setCurrentCase(null);
    setError(null);
  }, []);

  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#lab') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    goHome?.();
  }, [goHome]);

  const handleOpenCase = useCallback((openedFile, caseMeta) => {
    setFile(openedFile);
    setCurrentCase(caseMeta);
    setShowCases(false);
  }, []);

  // Decide which sub-view to render:
  // file → viewer (top priority; covers both drag-drop and case-opened)
  // showCases → case library
  // else → home (drag-drop entry)
  const subView = file ? 'viewer' : (showCases ? 'cases' : 'home');

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.4rem', margin: 0 }}>🔬 Imaging Practice Lab</h1>
          <p style={{ fontSize: '0.85rem', color: '#666', margin: '4px 0 0' }}>
            ฝึกอ่านภาพ + DICOM viewer · <span style={{ color: '#c66' }}>Experimental</span>
          </p>
        </div>
        <button onClick={handleBack} className="vmx-btn vmx-btn-ghost vmx-btn-sm">← Home</button>
      </header>

      <div style={disclaimerStyle}>
        ⚠️ เครื่องมือเพื่อการเรียนรู้ · ฝึกอ่านภาพ + วัด practice · <strong>ไม่ใช้แทนการ workup ผู้ป่วยจริง</strong>
      </div>

      {subView === 'home' && (
        <>
          <div style={modeButtonsStyle}>
            <button
              className="vmx-btn vmx-btn-ghost"
              onClick={() => setShowCases(true)}
              style={{ flex: 1 }}
            >
              📚 Browse case library
            </button>
            <span style={{ color: '#aaa', fontSize: '0.8rem', alignSelf: 'center' }}>หรือ</span>
            <span style={{ color: '#666', fontSize: '0.85rem', alignSelf: 'center' }}>
              ใส่ DICOM ของคุณเองด้านล่าง
            </span>
          </div>

          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            style={{
              border: `2px dashed ${dragging ? '#4a6b4a' : '#bbb'}`,
              borderRadius: 12,
              padding: '60px 20px',
              textAlign: 'center',
              background: dragging ? '#f0f8f0' : '#fafafa',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📁</div>
            <p style={{ fontSize: '1.05rem', margin: '0 0 8px' }}>ลาก DICOM (.dcm) มาวางที่นี่</p>
            <p style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 16px' }}>หรือ</p>
            <label className="vmx-btn vmx-btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
              เลือกไฟล์
              <input
                type="file"
                accept=".dcm,application/dicom"
                onChange={onFileInput}
                style={{ display: 'none' }}
              />
            </label>
            {error && <p style={{ color: '#c00', fontSize: '0.85rem', marginTop: 16 }}>{error}</p>}
            <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 24 }}>
              ไฟล์ไม่ถูกอัพโหลด — render ใน browser ล้วน
            </p>
          </div>

          {recent.length > 0 && (
            <div style={recentBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong style={{ fontSize: '0.85rem', color: '#555' }}>🕘 Recent files</strong>
                <button
                  onClick={clearRecent}
                  style={{ fontSize: '0.7rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ล้าง
                </button>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#777', marginBottom: 6 }}>
                File blobs ไม่ persist ข้าม session · เห็นรายการที่นี่แล้วลากไฟล์เดิมจาก disk เพื่อ re-open
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {recent.map((r, i) => (
                  <li key={i} style={{ fontSize: '0.8rem', color: '#666', padding: '4px 0', borderTop: i > 0 ? '1px solid #eee' : 'none' }}>
                    📄 <span style={{ color: '#333' }}>{r.name}</span> · {(r.size / 1024).toFixed(0)} KB · {new Date(r.lastModified).toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {subView === 'cases' && (
        <Suspense fallback={<div style={loadingFallbackStyle}>กำลังโหลด case library...</div>}>
          <CaseLibrary onOpenCase={handleOpenCase} onBack={() => setShowCases(false)} />
        </Suspense>
      )}

      {subView === 'viewer' && file && (
        <div>
          <div style={viewerHeaderStyle}>
            <div style={{ fontSize: '0.88rem', color: '#555' }}>
              {currentCase ? (
                <>
                  <strong>📚 Case: {currentCase.title}</strong> ·
                  <span style={{ color: '#777' }}>
                    {' '}{[currentCase.species, currentCase.signalment].filter(Boolean).join(' · ')}
                  </span>
                </>
              ) : (
                <>📄 {file.name} · {(file.size / 1024).toFixed(0)} KB</>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <AnonymizeButton file={file} />
              <button onClick={reset} className="vmx-btn vmx-btn-ghost vmx-btn-sm">เปลี่ยนไฟล์</button>
            </div>
          </div>

          {currentCase?.history && (
            <div style={historyCardStyle}>
              <strong>History:</strong> {currentCase.history}
            </div>
          )}

          <Suspense fallback={<div style={loadingFallbackStyle}>กำลังโหลด viewer...</div>}>
            <DicomViewport file={file} />
          </Suspense>

          {currentCase?.learning_objectives?.length > 0 && (
            <div style={objectivesCardStyle}>
              <strong>🎯 Learning objectives:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 22 }}>
                {currentCase.learning_objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
  gap: 12,
  flexWrap: 'wrap',
};

const disclaimerStyle = {
  fontSize: '0.8rem',
  color: '#7a5a00',
  padding: '8px 12px',
  background: '#fff8e1',
  border: '1px solid #ffd54f',
  borderRadius: 6,
  marginBottom: 16,
};

const modeButtonsStyle = {
  display: 'flex',
  gap: 12,
  marginBottom: 16,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const viewerHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  gap: 8,
  flexWrap: 'wrap',
};

const historyCardStyle = {
  fontSize: '0.85rem',
  color: '#555',
  padding: '8px 12px',
  background: '#f8f6f0',
  border: '1px solid #e8e0c8',
  borderRadius: 6,
  marginBottom: 12,
};

const objectivesCardStyle = {
  marginTop: 12,
  fontSize: '0.85rem',
  color: '#555',
  padding: '10px 14px',
  background: '#f0f5f0',
  border: '1px solid #cce0cc',
  borderRadius: 6,
};

const loadingFallbackStyle = {
  padding: 40,
  textAlign: 'center',
  color: '#888',
};

const recentBoxStyle = {
  marginTop: 16,
  padding: '10px 14px',
  background: '#fafafa',
  border: '1px solid #e8e8e8',
  borderRadius: 6,
};
