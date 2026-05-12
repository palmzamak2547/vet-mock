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

export default function DicomViewport({ file }) {
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

  const clearMeasurements = useCallback(() => {
    try {
      const all = annotation.state.getAllAnnotations();
      all.forEach((a) => annotation.state.removeAnnotation(a.annotationUID));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[clearMeasurements] error:', err);
    }
    const engine = engineRef.current;
    const viewport = engine?.getViewport(viewportIdRef.current);
    viewport?.render();
  }, []);

  const navTools = ['wl', 'pan', 'zoom'];
  const measureTools = ['length', 'angle'];

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
          <TBtn onClick={resetView}>↺ Reset view</TBtn>
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
        {status === 'ready' && (
          <NorbergOverlay active={activeTool === 'norberg'} viewportRef={getViewport} />
        )}
        {status === 'ready' && (
          <VHSOverlay active={activeTool === 'vhs'} viewportRef={getViewport} />
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

function TBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        background: active ? '#4a6b4a' : '#fff',
        color: active ? '#fff' : '#333',
        border: '1px solid #ccc',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: '0.8rem',
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      {children}
    </button>
  );
}

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
