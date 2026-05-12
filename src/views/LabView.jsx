import { useState, useCallback, Suspense, lazy } from 'react';

const DicomViewport = lazy(() => import('../components/lab/DicomViewport.jsx'));

export default function LabView({ goHome }) {
  const [file, setFile] = useState(null);
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
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer?.files?.[0];
    handleFile(f);
  }, [handleFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragging(false);
  }, []);

  const onFileInput = useCallback((e) => {
    handleFile(e.target.files?.[0]);
  }, [handleFile]);

  const reset = useCallback(() => {
    setFile(null);
    setError(null);
  }, []);

  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#lab') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    goHome?.();
  }, [goHome]);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', margin: 0 }}>🔬 Imaging Practice Lab</h1>
          <p style={{ fontSize: '0.85rem', color: '#666', margin: '4px 0 0' }}>
            ฝึกอ่านภาพ + DICOM viewer · <span style={{ color: '#c66' }}>Experimental · Phase 1</span>
          </p>
        </div>
        <button onClick={handleBack} className="vmx-btn vmx-btn-ghost vmx-btn-sm">← Home</button>
      </header>

      <div style={{
        fontSize: '0.8rem',
        color: '#7a5a00',
        padding: '8px 12px',
        background: '#fff8e1',
        border: '1px solid #ffd54f',
        borderRadius: 6,
        marginBottom: 16,
      }}>
        ⚠️ เครื่องมือเพื่อการเรียนรู้ · ฝึกอ่านภาพ + วัด practice · <strong>ไม่ใช้แทนการ workup ผู้ป่วยจริง</strong>
      </div>

      {!file && (
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
          {error && (
            <p style={{ color: '#c00', fontSize: '0.85rem', marginTop: 16 }}>{error}</p>
          )}
          <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 24 }}>
            ไฟล์ไม่ถูกอัพโหลด — render ใน browser ล้วน
          </p>
        </div>
      )}

      {file && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.9rem', color: '#555' }}>
              📄 {file.name} · {(file.size / 1024).toFixed(0)} KB
            </div>
            <button onClick={reset} className="vmx-btn vmx-btn-ghost vmx-btn-sm">เปลี่ยนไฟล์</button>
          </div>
          <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#888' }}>กำลังโหลด viewer...</div>}>
            <DicomViewport file={file} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
