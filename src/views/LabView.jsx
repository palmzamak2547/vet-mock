import { useState, useCallback, Suspense, lazy } from 'react';

const DicomViewport = lazy(() => import('../components/lab/DicomViewport.jsx'));
const CaseLibrary = lazy(() => import('../components/lab/CaseLibrary.jsx'));

export default function LabView({ goHome }) {
  const [file, setFile] = useState(null);
  const [currentCase, setCurrentCase] = useState(null);
  const [showCases, setShowCases] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    const lower = f.name.toLowerCase();
    const okExt = lower.endsWith('.dcm') || lower.endsWith('.dicom');
    if (!okExt && f.type !== 'application/dicom') {
      setError('โปรดเลือกไฟล์ .dcm (DICOM)');
      return;
    }
    setError(null);
    setFile(f);
    // Local drag-drop clears any active case
    setCurrentCase(null);
  }, []);

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
            <button onClick={reset} className="vmx-btn vmx-btn-ghost vmx-btn-sm">เปลี่ยนไฟล์</button>
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
