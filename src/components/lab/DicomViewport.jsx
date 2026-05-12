import { useEffect, useRef, useState, useCallback } from 'react';
import { RenderingEngine, Enums } from '@cornerstonejs/core';
import {
  ToolGroupManager,
  WindowLevelTool,
  PanTool,
  ZoomTool,
  Enums as ToolEnums,
} from '@cornerstonejs/tools';
import { ensureCornerstoneInit, getDicomImageLoader } from '../../lib/dicom/cornerstone-init.js';

// Rough W/L presets calibrated for 12-bit vet DR (raw pixel range
// 0–4095, rescale slope/intercept of 1/0). These are starting points,
// not clinical presets — Phase 3 will compute histogram-based ranges
// from the actual image so the presets adapt to vendor differences.
const PRESETS = [
  { id: 'default', label: 'Default', voi: 'reset' },
  { id: 'soft',    label: 'Soft tissue', voi: { lower: 1000, upper: 3000 } },
  { id: 'bone',    label: 'Bone',        voi: { lower: 2200, upper: 3800 } },
  { id: 'lung',    label: 'Lung',        voi: { lower: 200,  upper: 1500 } },
];

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
        tg.addTool(WindowLevelTool.toolName);
        tg.addTool(PanTool.toolName);
        tg.addTool(ZoomTool.toolName);
        tg.addViewport(viewportId, engineId);
        // Primary (left-click/single-tap) is the user-selectable active
        // tool; middle and right keep their conventional bindings so
        // mouse-based PACS users feel at home.
        tg.setToolActive(WindowLevelTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }] });
        tg.setToolActive(PanTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Auxiliary }] });
        tg.setToolActive(ZoomTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Secondary }] });

        viewport.render();

        if (cancelled) return;
        const img = viewport.csImage || null;
        const dims = img?.dimensions || [img?.width, img?.height];
        setMeta({ width: dims?.[0] ?? '?', height: dims?.[1] ?? '?' });
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

  const selectTool = useCallback((tool) => {
    const tg = ToolGroupManager.getToolGroup(toolGroupIdRef.current);
    if (!tg) return;
    const map = { wl: WindowLevelTool, pan: PanTool, zoom: ZoomTool };
    Object.values(map).forEach((T) => tg.setToolPassive(T.toolName));
    tg.setToolActive(map[tool].toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Primary }] });
    // Keep middle and right bindings consistent regardless of left choice
    tg.setToolActive(PanTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Auxiliary }] });
    tg.setToolActive(ZoomTool.toolName, { bindings: [{ mouseButton: ToolEnums.MouseBindings.Secondary }] });
    setActiveTool(tool);
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

  return (
    <div>
      {status === 'ready' && (
        <div style={toolbarStyle}>
          <span style={labelStyle}>Tool:</span>
          <TBtn active={activeTool === 'wl'}   onClick={() => selectTool('wl')}>🌓 W/L</TBtn>
          <TBtn active={activeTool === 'pan'}  onClick={() => selectTool('pan')}>✋ Pan</TBtn>
          <TBtn active={activeTool === 'zoom'} onClick={() => selectTool('zoom')}>🔍 Zoom</TBtn>
          <Divider />
          <span style={labelStyle}>Preset:</span>
          {PRESETS.map((p) => (
            <TBtn key={p.id} onClick={() => applyPreset(p)}>{p.label}</TBtn>
          ))}
          <Divider />
          <TBtn onClick={resetView}>↺ Reset</TBtn>
          <span style={{ flex: 1 }} />
          <span style={{ color: '#888', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
            ลากซ้าย = active · กลาง = pan · ขวา = zoom
          </span>
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
      </div>
      {meta && status === 'ready' && (
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 8 }}>
          📐 {meta.width} × {meta.height} pixels · Phase 2 · เครื่องมือวัด length/angle จะเพิ่ม Phase 3
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
