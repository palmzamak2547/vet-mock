import { useEffect, useRef, useState, useCallback } from 'react';
import { RenderingEngine, Enums } from '@cornerstonejs/core';
import {
  ToolGroupManager,
  WindowLevelTool,
  PanTool,
  ZoomTool,
  LengthTool,
  AngleTool,
  annotation,
  Enums as ToolEnums,
} from '@cornerstonejs/tools';
import { ensureCornerstoneInit, getDicomImageLoader } from '../../lib/dicom/cornerstone-init.js';
import NorbergOverlay from './NorbergOverlay.jsx';
import VHSOverlay from './VHSOverlay.jsx';
import AIOverlay from './AIOverlay.jsx';

const PRESETS = [
  { id: 'default', label: 'Default', voi: 'reset' },
  { id: 'soft',    label: 'Soft tissue', voi: { lower: 1000, upper: 3000 } },
  { id: 'bone',    label: 'Bone',        voi: { lower: 2200, upper: 3800 } },
  { id: 'lung',    label: 'Lung',        voi: { lower: 200,  upper: 1500 } },
];

// Tool registry — id → { class, label }. The id is what
// activeTool state holds; class.toolName is what Cornerstone
// stores in its tool group registry.
const TOOLS = {
  wl:     { cls: WindowLevelTool, label: '🌓 W/L',    kind: 'nav' },
  pan:    { cls: PanTool,         label: '✋ Pan',     kind: 'nav' },
  zoom:   { cls: ZoomTool,        label: '🔍 Zoom',    kind: 'nav' },
  length: { cls: LengthTool,      label: '📏 Length',  kind: 'measure' },
  angle:  { cls: AngleTool,       label: '📐 Angle',   kind: 'measure' },
};

let engineSeq = 0;

export default function DicomViewport({ file, caseId = null }) {
  const elRef = useRef(null);
  const engineRef = useRef(null);
  const viewportIdRef = useRef(null);
  const toolGroupIdRef = useRef(null);
  const [status, setStatus] = useState('init');
  const [errorMsg, setErrorMsg] = useState('');
  const [meta, setMeta] = useState(null);
  const [activeTool, setActiveTool] = useState('wl');

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    const seq = ++engineSeq;
    const engineId = `lab-engine-${seq}`;
    const viewportId = `lab-vp-${seq}`;
    const toolGroupId = `lab-tg-${seq}`;
    viewportIdRef.current = viewportId;
    toolGroupIdRef.current = toolGroupId;

    (async () => {
      try {
        setStatus('init');
        await ensureCornerstoneInit();
        if (cancelled || !elRef.current) return;

        const loader = getDicomImageLoader();
        const imageId = loader.wadouri.fileManager.add(file);

        const engine = new RenderingEngine(engineId);
        engineRef.current = engine;
        engine.enableElement({
          viewportId,
          type: Enums.ViewportType.STACK,
          element: elRef.current,
        });
        const viewport = engine.getViewport(viewportId);
        await viewport.setStack([imageId]);

        const tg = ToolGroupManager.createToolGroup(toolGroupId);
        Object.values(TOOLS).forEach(({ cls }) => tg.addTool(cls.toolName));
        tg.addViewport(viewportId, engineId);
        tg.setToolActive(WindowLevelTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }] });
        tg.setToolActive(PanTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Auxiliary }] });
        tg.setToolActive(ZoomTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Secondary }] });

        viewport.render();

        if (cancelled) return;
        const img = viewport.csImage || null;
        const dims = img?.dimensions || [img?.width, img?.height];
        // PixelSpacing for mm-calibrated measurements. Cornerstone reads
        // it from the DICOM tag; we just surface it in the status line.
        const spacing = img?.rowPixelSpacing || img?.columnPixelSpacing || null;
        setMeta({
          width: dims?.[0] ?? '?',
          height: dims?.[1] ?? '?',
          mmPerPx: spacing,
        });
        setStatus('ready');
        setActiveTool('wl');
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
      try {
        if (toolGroupIdRef.current) ToolGroupManager.destroyToolGroup(toolGroupIdRef.current);
        engineRef.current?.destroy();
      } catch { /* noop */ }
    };
  }, [file]);

  const getViewport = useCallback(() => {
    return engineRef.current?.getViewport(viewportIdRef.current);
  }, []);

  const selectTool = useCallback((tool) => {
    setActiveTool(tool);
    const tg = ToolGroupManager.getToolGroup(toolGroupIdRef.current);
    if (!tg) return;
    try {
      // Set every Cornerstone tool passive first so only the chosen one
      // is on Primary. Vet-specific modes (e.g. 'norberg') aren't in the
      // TOOLS map — they're handled by React overlays, and Primary stays
      // un-bound so the overlay's click handler receives events first.
      Object.values(TOOLS).forEach(({ cls }) => tg.setToolPassive(cls.toolName));
      if (TOOLS[tool]) {
        tg.setToolActive(TOOLS[tool].cls.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }] });
      }
      tg.setToolActive(PanTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Auxiliary }] });
      tg.setToolActive(ZoomTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Secondary }] });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[selectTool] bind error:', err);
    }
  }, []);

  const applyPreset = useCallback((preset) => {
    const engine = engineRef.current;
    if (!engine) return;
    const viewport = engine.getViewport(viewportIdRef.current);
    if (!viewport) return;
    if (preset.voi === 'reset') {
      viewport.resetProperties();
    } else {
      viewport.setProperties({ voiRange: { lower: preset.voi.lower, upper: preset.voi.upper } });
    }
    viewport.render();
  }, []);

  const resetView = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const viewport = engine.getViewport(viewportIdRef.current);
    if (!viewport) return;
    viewport.resetCamera();
    viewport.resetProperties();
    viewport.render();
  }, []);

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [aiError, setAiError] = useState(null);

  const loadAiJson = useCallback(async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      // Light validation — require predictions object somewhere
      if (!data || typeof data !== 'object' || !data.predictions) {
        throw new Error('JSON missing "predictions" key');
      }
      setAiPrediction(data);
      setAiError(null);
    } catch (err) {
      setAiError(err?.message || String(err));
      setAiPrediction(null);
    }
  }, []);

  const clearAi = useCallback(() => {
    setAiPrediction(null);
    setAiError(null);
  }, []);

  const exportPng = useCallback(async () => {
    try {
      const mod = await import('../../lib/dicom/export-image.js');
      const baseFilename = (file?.name || 'dicom').replace(/\.dcm$/i, '').replace(/\.dicom$/i, '') + '_annotated';
      await mod.exportAnnotatedPng({ containerEl: elRef.current, baseFilename });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[exportPng] error:', err);
    }
  }, [file]);

  const clearMeasurements = useCallback(() => {
    // Clear both Cornerstone annotations (Length/Angle) and any custom
    // overlays (Norberg/VHS) by dispatching a custom event that the
    // overlay components listen for. Simpler than threading a callback
    // through every overlay child.
    try {
      const all = annotation.state.getAllAnnotations();
      all.forEach((a) => annotation.state.removeAnnotation(a.annotationUID));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[clearMeasurements] error:', err);
    }
    try {
      window.dispatchEvent(new CustomEvent('vmx-lab-clear-overlays'));
    } catch { /* noop */ }
    const engine = engineRef.current;
    const viewport = engine?.getViewport(viewportIdRef.current);
    viewport?.render();
  }, []);

  const navTools = ['wl', 'pan', 'zoom'];
  const measureTools = ['length', 'angle'];

  // Keyboard shortcuts. Bound at the window level but skip when the
  // user is typing in a form input (so VetMock's other views aren't
  // hijacked by single letters). Each viewport mounts its own listener
  // — with 2 viewports they both respond to a keypress, which gives
  // pseudo-sync tool switching for free.
  useEffect(() => {
    if (status !== 'ready') return;
    const onKey = (e) => {
      const t = e.target;
      if (!t) return;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key.toLowerCase();
      const sk = e.shiftKey;
      const map = {
        w: () => selectTool('wl'),
        p: () => selectTool('pan'),
        z: () => selectTool('zoom'),
        l: () => selectTool('length'),
        a: () => selectTool('angle'),
        n: () => selectTool('norberg'),
        v: () => selectTool('vhs'),
        r: () => resetView(),
        c: () => clearMeasurements(),
        e: () => exportPng(),
        '1': () => applyPreset(PRESETS[0]),
        '2': () => applyPreset(PRESETS[1]),
        '3': () => applyPreset(PRESETS[2]),
        '4': () => applyPreset(PRESETS[3]),
        '?': () => setShowShortcuts((s) => !s),
        '/': () => sk && setShowShortcuts((s) => !s),
        escape: () => setShowShortcuts(false),
      };
      const fn = map[k];
      if (!fn) return;
      fn();
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status, selectTool, resetView, clearMeasurements, exportPng, applyPreset]);

  return (
    <div>
      {status === 'ready' && (
        <div style={toolbarStyle}>
          <span style={labelStyle}>Nav:</span>
          {navTools.map((t) => (
            <TBtn key={t} active={activeTool === t} onClick={() => selectTool(t)}>{TOOLS[t].label}</TBtn>
          ))}
          <Divider />
          <span style={labelStyle}>Measure:</span>
          {measureTools.map((t) => (
            <TBtn key={t} active={activeTool === t} onClick={() => selectTool(t)}>{TOOLS[t].label}</TBtn>
          ))}
          <TBtn onClick={clearMeasurements}>🗑 Clear</TBtn>
          <Divider />
          <span style={labelStyle}>W/L:</span>
          {PRESETS.map((p) => (
            <TBtn key={p.id} onClick={() => applyPreset(p)}>{p.label}</TBtn>
          ))}
          <Divider />
          <span style={labelStyle}>Vet:</span>
          <TBtn active={activeTool === 'norberg'} onClick={() => selectTool('norberg')}>🦴 Norberg</TBtn>
          <TBtn active={activeTool === 'vhs'} onClick={() => selectTool('vhs')}>📐 VHS</TBtn>
          <Divider />
          <span style={labelStyle}>AI:</span>
          <label className="vmx-btn" style={aiBtnLabelStyle} title="Load AI prediction JSON for this image">
            🤖 Load AI
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => loadAiJson(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
          </label>
          {aiPrediction && <TBtn onClick={clearAi}>✕ Clear AI</TBtn>}
          <Divider />
          <TBtn onClick={exportPng}>📤 Export PNG</TBtn>
          <TBtn onClick={resetView}>↺ Reset view</TBtn>
          <TBtn onClick={() => setShowShortcuts((s) => !s)} title="Keyboard shortcuts (?)">⌨</TBtn>
        </div>
      )}
      {aiError && (
        <div style={{ background: '#fff5f5', border: '1px solid #fcc', color: '#a33', padding: '4px 10px', fontSize: '0.78rem', borderRadius: 4, marginBottom: 4 }}>
          ⚠️ AI JSON parse error: {aiError}
        </div>
      )}

      {showShortcuts && (
        <div style={shortcutsModalStyle} onClick={() => setShowShortcuts(false)}>
          <div style={shortcutsContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong>⌨ Keyboard shortcuts</strong>
              <button onClick={() => setShowShortcuts(false)} style={{ width: 26, height: 26, border: '1px solid #ccc', background: '#fff', borderRadius: 4, cursor: 'pointer' }}>✕</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <tbody>
                <SC k="W" desc="Window/Level tool" />
                <SC k="P" desc="Pan tool" />
                <SC k="Z" desc="Zoom tool" />
                <SC k="L" desc="Length measurement" />
                <SC k="A" desc="Angle measurement" />
                <SC k="N" desc="🦴 Norberg angle" />
                <SC k="V" desc="📐 VHS" />
                <SC k="1 – 4" desc="W/L presets (Default / Soft / Bone / Lung)" />
                <SC k="R" desc="Reset view (zoom/pan/window)" />
                <SC k="C" desc="Clear all measurements" />
                <SC k="E" desc="Export annotated PNG" />
                <SC k="?" desc="Show / hide this help" />
                <SC k="Esc" desc="Close this help" />
              </tbody>
            </table>
            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: 10 }}>
              Shortcuts ทำงานเมื่อโฟกัสไม่ได้อยู่ใน input/textarea · ใน study mode (2 viewports) shortcut จะ apply กับทั้งสองอันพร้อมกัน
            </div>
          </div>
        </div>
      )}
      <div
        ref={elRef}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: '100%',
          height: 600,
          background: '#000',
          borderRadius: status === 'ready' ? '0 0 8px 8px' : 8,
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        {status === 'init' && <div style={overlay}>กำลังโหลด DICOM...</div>}
        {status === 'error' && (
          <div style={{ ...overlay, color: '#fbb', textAlign: 'center', padding: 20 }}>
            ❌ โหลดไม่สำเร็จ<br />
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{errorMsg}</span>
          </div>
        )}
        {/* `key` includes file identity so the overlay component
            unmounts + re-mounts when the user switches DICOM. Without
            this, world-space points from the previous image stay
            in state and would render at nonsense positions over
            the new image's anatomy. */}
        {status === 'ready' && aiPrediction && (
          <AIOverlay prediction={aiPrediction} viewportRef={getViewport} />
        )}
        {status === 'ready' && (
          <NorbergOverlay
            key={`norberg-${file?.name}-${file?.size}-${file?.lastModified || 0}`}
            active={activeTool === 'norberg'}
            viewportRef={getViewport}
            caseId={caseId}
          />
        )}
        {status === 'ready' && (
          <VHSOverlay
            key={`vhs-${file?.name}-${file?.size}-${file?.lastModified || 0}`}
            active={activeTool === 'vhs'}
            viewportRef={getViewport}
            caseId={caseId}
          />
        )}
      </div>
      {meta && status === 'ready' && (
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 8 }}>
          📐 {meta.width} × {meta.height} pixels
          {meta.mmPerPx && (
            <> · calibrated at <strong>{meta.mmPerPx.toFixed(3)} mm/pixel</strong> (PixelSpacing tag)</>
          )}
          · Phase 6 · 🦴 Norberg + 📐 VHS ใน toolbar
        </div>
      )}
      {meta && status === 'ready' && (
        <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 4 }}>
          เลือก 📏 Length หรือ 📐 Angle จาก toolbar แล้วลากบนภาพ — ผลแสดงเป็น mm จาก PixelSpacing tag · ลากซ้าย = active tool · กลาง = pan · ขวา = zoom
        </div>
      )}
    </div>
  );
}

function TBtn({ active, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        // Min-height 36 keeps it tappable on mobile per WCAG 2.5.5
        // (Target Size 44×44 is AAA; AA is 24×24 — we land in between
        // because the toolbar would explode at full AAA).
        minHeight: 36,
        padding: '6px 11px',
        background: active ? '#4a6b4a' : '#fff',
        color: active ? '#fff' : '#333',
        border: '1px solid #ccc',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: '0.82rem',
        whiteSpace: 'nowrap',
        lineHeight: 1.3,
      }}
    >
      {children}
    </button>
  );
}

function SC({ k, desc }) {
  return (
    <tr style={{ borderBottom: '1px solid #eee' }}>
      <td style={{ padding: '6px 8px', width: 110 }}>
        <kbd style={kbdStyle}>{k}</kbd>
      </td>
      <td style={{ padding: '6px 8px', color: '#444' }}>{desc}</td>
    </tr>
  );
}

const aiBtnLabelStyle = {
  minHeight: 36,
  padding: '6px 11px',
  background: '#fff',
  color: '#333',
  border: '1px solid #ccc',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.82rem',
  whiteSpace: 'nowrap',
  lineHeight: 1.3,
  display: 'inline-flex',
  alignItems: 'center',
};

const kbdStyle = {
  display: 'inline-block',
  padding: '2px 8px',
  background: '#f4f4f4',
  border: '1px solid #ccc',
  borderRadius: 3,
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  color: '#333',
};

const shortcutsModalStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const shortcutsContentStyle = {
  background: '#fff',
  borderRadius: 8,
  padding: '16px 18px',
  minWidth: 320,
  maxWidth: '90vw',
  maxHeight: '85vh',
  overflow: 'auto',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
};

function Divider() {
  return <span style={{ width: 1, height: 22, background: '#ccc', margin: '0 4px' }} />;
}

const toolbarStyle = {
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
  padding: 8,
  background: '#f5f5f5',
  borderRadius: '8px 8px 0 0',
  alignItems: 'center',
  fontSize: '0.85rem',
};

const labelStyle = {
  color: '#666',
  fontSize: '0.75rem',
  marginRight: 2,
  whiteSpace: 'nowrap',
};

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
