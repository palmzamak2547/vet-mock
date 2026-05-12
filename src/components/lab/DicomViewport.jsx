import { useEffect, useRef, useState } from 'react';
import { RenderingEngine, Enums } from '@cornerstonejs/core';
import { ensureCornerstoneInit, getDicomImageLoader } from '../../lib/dicom/cornerstone-init.js';

let engineSeq = 0;

export default function DicomViewport({ file }) {
  const elRef = useRef(null);
  const [status, setStatus] = useState('init');
  const [errorMsg, setErrorMsg] = useState('');
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!file) return;
    let engine;
    let cancelled = false;
    const engineId = `lab-engine-${++engineSeq}`;
    const viewportId = 'lab-vp-1';

    (async () => {
      try {
        setStatus('init');
        await ensureCornerstoneInit();
        if (cancelled || !elRef.current) return;

        const loader = getDicomImageLoader();
        const imageId = loader.wadouri.fileManager.add(file);

        engine = new RenderingEngine(engineId);
        engine.enableElement({
          viewportId,
          type: Enums.ViewportType.STACK,
          element: elRef.current,
        });
        const viewport = engine.getViewport(viewportId);
        await viewport.setStack([imageId]);
        viewport.render();

        if (cancelled) return;
        const img = viewport.csImage || viewport.getCurrentImageData?.() || null;
        const dims = img?.dimensions || [img?.width, img?.height];
        setMeta({
          width: dims?.[0] ?? '?',
          height: dims?.[1] ?? '?',
        });
        setStatus('ready');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[DicomViewport] load error:', err);
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(err?.message || String(err));
        }
      }
    })();

    return () => {
      cancelled = true;
      try { engine?.destroy(); } catch { /* noop */ }
    };
  }, [file]);

  return (
    <div>
      <div
        ref={elRef}
        style={{
          width: '100%',
          height: 600,
          background: '#000',
          borderRadius: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {status === 'init' && (
          <div style={overlay}>กำลังโหลด DICOM...</div>
        )}
        {status === 'error' && (
          <div style={{ ...overlay, color: '#fbb', textAlign: 'center', padding: 20 }}>
            ❌ โหลดไม่สำเร็จ<br />
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{errorMsg}</span>
          </div>
        )}
      </div>
      {meta && status === 'ready' && (
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 8 }}>
          📐 {meta.width} × {meta.height} pixels · Phase 1 viewer · เครื่องมือ window/level/zoom จะเพิ่ม Phase 2
        </div>
      )}
    </div>
  );
}

const overlay = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#aaa',
  fontSize: '0.95rem',
  pointerEvents: 'none',
};
