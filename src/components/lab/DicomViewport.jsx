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
import dicomParser from 'dicom-parser';
import { ensureCornerstoneInit, getDicomImageLoader } from '../../lib/dicom/cornerstone-init.js';
import NorbergOverlay from './NorbergOverlay.jsx';
import VHSOverlay from './VHSOverlay.jsx';
import { useMediaQuery } from '../../lib/dicom/use-media-query.js';

const PRESETS = [
  { id: 'smart',   label: '🪄 Auto',  voi: 'compute' },
  { id: 'default', label: 'DICOM',    voi: 'reset' },
  { id: 'soft',    label: 'Soft',     voi: { lower: 1000, upper: 3000 } },
  { id: 'bone',    label: 'Bone',     voi: { lower: 2200, upper: 3800 } },
  { id: 'lung',    label: 'Lung',     voi: { lower: 200,  upper: 1500 } },
];

// Sample the pixel histogram + set voiRange from P1–P99. Way more
// reliable than the DICOM-tag default (which is often the full bit
// range = washed out). Sampled (~20 k) not full-image, so it's cheap
// even on 4k DR images.
function applySmartContrast(viewport) {
  try {
    const img = viewport?.csImage;
    if (!img?.getPixelData) return false;
    const pixels = img.getPixelData();
    const N = pixels.length;
    if (N === 0) return false;
    const sampleSize = Math.min(20000, N);
    const stride = Math.max(1, Math.floor(N / sampleSize));
    const samples = [];
    for (let i = 0; i < N; i += stride) samples.push(pixels[i]);
    if (samples.length < 10) return false;
    samples.sort((a, b) => a - b);
    const p1 = samples[Math.floor(samples.length * 0.01)];
    const p99 = samples[Math.floor(samples.length * 0.99)];
    if (p99 <= p1) return false;
    viewport.setProperties({ voiRange: { lower: p1, upper: p99 } });
    viewport.render();
    return true;
  } catch {
    return false;
  }
}

// Tool registry — id → { class, label, sk (keyboard shortcut letter) }.
// The id is what activeTool state holds; class.toolName is what
// Cornerstone stores in its tool group registry. `short` is used as
// the abbreviated label on narrow viewports.
const TOOLS = {
  wl:     { cls: WindowLevelTool, label: '🌓 W/L',    short: '🌓 W', sk: 'W' },
  pan:    { cls: PanTool,         label: '✋ Pan',     short: '✋ P', sk: 'P' },
  zoom:   { cls: ZoomTool,        label: 'Zoom',    short: 'Z', sk: 'Z' },
  length: { cls: LengthTool,      label: '📏 Length',  short: '📏 L', sk: 'L' },
  angle:  { cls: AngleTool,       label: 'Angle',   short: 'A', sk: 'A' },
};

let engineSeq = 0;

export default function DicomViewport({ file, caseId = null, syncEnabled = false }) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const elRef = useRef(null);
  const engineRef = useRef(null);
  const viewportIdRef = useRef(null);
  const toolGroupIdRef = useRef(null);
  const shortcutsDialogRef = useRef(null);
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
        // Bindings include explicit numTouchPoints so single-finger
        // tap-and-drag on tablet/phone behaves the same as left-mouse-
        // drag — same gesture pipes through Cornerstone's normalized
        // pointer events. Pan also accepts 2-finger drag (the natural
        // touch gesture). Zoom keeps Secondary mouse only; pinch on
        // touch is suppressed by `touch-action: none` on the wrapper
        // and re-enabled implicitly when the user selects Zoom in the
        // toolbar (becomes single-tap-drag via the Primary binding).
        tg.setToolActive(WindowLevelTool.toolName, {
          bindings: [
            { mouseButton: ToolEnums.MouseBindings.Primary },
            { numTouchPoints: 1 },
          ],
        });
        tg.setToolActive(PanTool.toolName, {
          bindings: [
            { mouseButton: ToolEnums.MouseBindings.Auxiliary },
            { numTouchPoints: 2 },
          ],
        });
        tg.setToolActive(ZoomTool.toolName, {
          bindings: [{ mouseButton: ToolEnums.MouseBindings.Secondary }],
        });

        viewport.render();

        // Try smart auto-contrast as the default presentation. Falls
        // back silently to the DICOM-tag default if csImage isn't
        // ready yet (rare; happens with stack-loader race conditions).
        requestAnimationFrame(() => {
          if (!cancelled) applySmartContrast(viewport);
        });

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
        // Parse PatientSpeciesDescription (0010,2201) once, in parallel
        // with the Cornerstone load. Used by VHS overlay to pick the
        // right reference range (canine 8.5–10.5 vs feline 6.7–8.1).
        try {
          const buf = await file.arrayBuffer();
          const ds = dicomParser.parseDicom(new Uint8Array(buf));
          const sp = ds.string('x00102201') || '';
          if (!cancelled && sp) setSpecies(sp);
        } catch { /* dicom-parser failed; species stays empty */ }
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
    // First user action dismisses the hint
    setShowFirstHint(false);
    const tg = ToolGroupManager.getToolGroup(toolGroupIdRef.current);
    if (!tg) return;
    try {
      // Set every Cornerstone tool passive first so only the chosen one
      // is on Primary. Vet-specific modes (e.g. 'norberg') aren't in the
      // TOOLS map — they're handled by React overlays, and Primary stays
      // un-bound so the overlay's click handler receives events first.
      Object.values(TOOLS).forEach(({ cls }) => tg.setToolPassive(cls.toolName));
      if (TOOLS[tool]) {
        // Same dual binding pattern as initial setup — keeps touch
        // tap-and-drag working after the user switches active tools.
        tg.setToolActive(TOOLS[tool].cls.toolName, {
          bindings: [
            { mouseButton: ToolEnums.MouseBindings.Primary },
            { numTouchPoints: 1 },
          ],
        });
      }
      tg.setToolActive(PanTool.toolName, {
        bindings: [
          { mouseButton: ToolEnums.MouseBindings.Auxiliary },
          { numTouchPoints: 2 },
        ],
      });
      tg.setToolActive(ZoomTool.toolName, {
        bindings: [{ mouseButton: ToolEnums.MouseBindings.Secondary }],
      });
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
      viewport.render();
    } else if (preset.voi === 'compute') {
      applySmartContrast(viewport);
    } else {
      viewport.setProperties({ voiRange: { lower: preset.voi.lower, upper: preset.voi.upper } });
      viewport.render();
    }
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [species, setSpecies] = useState('');

  // Keep the keyboard-help dialog self-contained for keyboard and screen-
  // reader users, then return focus to whichever toolbar control opened it.
  useEffect(() => {
    if (!showShortcuts) return undefined;
    const previousFocus = document.activeElement;
    const dialog = shortcutsDialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusable = () => Array.from(dialog?.querySelectorAll(
      'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ) || []);
    focusable()[0]?.focus();

    const onDialogKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowShortcuts(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onDialogKey);
    return () => {
      document.removeEventListener('keydown', onDialogKey);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [showShortcuts]);
  // First-load nudge — small floating tip near the canvas that hints
  // the measurement workflow. Auto-fades after 6 s or on any tool
  // selection (other than the default W/L which is auto-active).
  const [showFirstHint, setShowFirstHint] = useState(false);
  useEffect(() => {
    if (status !== 'ready') return;
    setShowFirstHint(true);
    const t = setTimeout(() => setShowFirstHint(false), 6500);
    return () => clearTimeout(t);
  }, [status, file]);

  // Track browser fullscreen so the toolbar button label flips.
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { /* user rejected */ });
    } else {
      el.requestFullscreen?.().catch(() => { /* unsupported */ });
    }
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

  // Camera-sync for 2-up compare. When LabView turns sync on, each
  // viewport emits its own camera changes via window events and
  // applies remote ones (skipping its own ID to avoid feedback).
  // The `isApplying` flag suppresses the bounce — without it, an
  // incoming setCamera() would trigger CAMERA_MODIFIED locally which
  // would emit again → infinite loop. requestAnimationFrame resets
  // the flag AFTER the local CAMERA_MODIFIED bounce arrives.
  useEffect(() => {
    if (!syncEnabled || status !== 'ready') return;
    const element = elRef.current;
    if (!element) return;
    const myId = viewportIdRef.current;
    let isApplying = false;

    const onCameraChange = () => {
      if (isApplying) return;
      const vp = engineRef.current?.getViewport(myId);
      if (!vp) return;
      try {
        const cam = vp.getCamera();
        window.dispatchEvent(new CustomEvent('vmx-lab-sync-camera', {
          detail: { sourceId: myId, camera: cam },
        }));
      } catch { /* viewport torn down mid-event */ }
    };

    const onRemoteCamera = (evt) => {
      if (!evt?.detail || evt.detail.sourceId === myId) return;
      const vp = engineRef.current?.getViewport(myId);
      if (!vp) return;
      try {
        isApplying = true;
        vp.setCamera(evt.detail.camera);
        vp.render();
        requestAnimationFrame(() => { isApplying = false; });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[viewport-sync] apply error:', err);
        isApplying = false;
      }
    };

    element.addEventListener(Enums.Events.CAMERA_MODIFIED, onCameraChange);
    window.addEventListener('vmx-lab-sync-camera', onRemoteCamera);
    return () => {
      element.removeEventListener(Enums.Events.CAMERA_MODIFIED, onCameraChange);
      window.removeEventListener('vmx-lab-sync-camera', onRemoteCamera);
    };
  }, [syncEnabled, status]);

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
        f: () => toggleFullscreen(),
        u: () => {
          // Send to whichever overlay is currently active (Norberg or VHS).
          // The overlay's own `active` check filters out stale instances.
          try { window.dispatchEvent(new CustomEvent('vmx-lab-undo-point')); } catch { /* noop */ }
        },
        '1': () => applyPreset(PRESETS[0]),  // 🪄 Auto
        '2': () => applyPreset(PRESETS[1]),  // DICOM
        '3': () => applyPreset(PRESETS[2]),  // Soft
        '4': () => applyPreset(PRESETS[3]),  // Bone
        '5': () => applyPreset(PRESETS[4]),  // Lung
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
  }, [status, selectTool, resetView, clearMeasurements, exportPng, applyPreset, toggleFullscreen]);

  return (
    <div>
      {status === 'ready' && (
        <div style={isMobile ? toolbarMobileStyle : toolbarStyle}>
          {!isMobile && <span style={labelStyle}>Nav:</span>}
          {navTools.map((t) => (
            <TBtn key={t} active={activeTool === t} onClick={() => selectTool(t)} title={`${TOOLS[t].label} — shortcut (${TOOLS[t].sk})`}>
              {isMobile ? TOOLS[t].short : TOOLS[t].label}
            </TBtn>
          ))}
          <Divider />
          {!isMobile && <span style={labelStyle}>Measure:</span>}
          {measureTools.map((t) => (
            <TBtn key={t} active={activeTool === t} onClick={() => selectTool(t)} title={`${TOOLS[t].label} — shortcut (${TOOLS[t].sk})`}>
              {isMobile ? TOOLS[t].short : TOOLS[t].label}
            </TBtn>
          ))}
          <TBtn onClick={clearMeasurements} title="Clear all measurements (C)">{isMobile ? '🗑' : 'Clear'}</TBtn>
          <Divider />
          {!isMobile && <span style={labelStyle}>W/L:</span>}
          {PRESETS.map((p, i) => (
            <TBtn key={p.id} onClick={() => applyPreset(p)} title={`${p.label} preset — shortcut (${i + 1})`}>
              {p.label}
            </TBtn>
          ))}
          <Divider />
          {!isMobile && <span style={labelStyle}>Vet:</span>}
          <TBtn active={activeTool === 'norberg'} onClick={() => selectTool('norberg')} title="Norberg angle (N) — 4-click">
            {isMobile ? '🦴 N' : '🦴 Norberg'}
          </TBtn>
          <TBtn active={activeTool === 'vhs'} onClick={() => selectTool('vhs')} title="Vertebral Heart Score (V) — 6-click">
            {isMobile ? '💗 V' : '💗 VHS'}
          </TBtn>
          <Divider />
          <TBtn onClick={exportPng} title="Export annotated PNG (E)">{isMobile ? '📤' : 'Export PNG'}</TBtn>
          <TBtn onClick={toggleFullscreen} title={isFullscreen ? 'ออก fullscreen (F or Esc)' : 'เปิด fullscreen (F)'}>
            {isFullscreen ? '⤢ Exit FS' : '⛶ Fullscreen'}
          </TBtn>
          <TBtn onClick={resetView} title="Reset view (R)">{isMobile ? '↺' : '↺ Reset view'}</TBtn>
          <TBtn onClick={() => setShowShortcuts((s) => !s)} title="Keyboard shortcuts (?)">⌨</TBtn>
        </div>
      )}
      {showShortcuts && (
        <div style={shortcutsModalStyle} onClick={() => setShowShortcuts(false)}>
          <div
            ref={shortcutsDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vmx-lab-shortcuts-title"
            tabIndex={-1}
            style={shortcutsContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong id="vmx-lab-shortcuts-title">⌨ Keyboard shortcuts</strong>
              <button
                onClick={() => setShowShortcuts(false)}
                className="vmx-tap"
                aria-label="Close keyboard shortcuts"
                style={{ width: 26, height: 26, border: '1px solid #ccc', background: '#fff', borderRadius: 4, cursor: 'pointer' }}
              >✕</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <tbody>
                <SC k="W" desc="Window/Level tool" />
                <SC k="P" desc="Pan tool" />
                <SC k="Z" desc="Zoom tool" />
                <SC k="L" desc="Length measurement" />
                <SC k="A" desc="Angle measurement" />
                <SC k="N" desc="🦴 Norberg angle" />
                <SC k="V" desc="VHS" />
                <SC k="1 – 5" desc="W/L presets (Auto, DICOM, Soft, Bone, Lung)" />
                <SC k="R" desc="Reset view (zoom/pan/window)" />
                <SC k="C" desc="Clear all measurements" />
                <SC k="U" desc="Undo last Norberg/VHS point" />
                <SC k="(drag)" desc="ลากจุด Norberg/VHS ที่วางแล้ว = ปรับตำแหน่ง" />
                <SC k="E" desc="Export annotated PNG" />
                <SC k="F" desc="Toggle fullscreen" />
                <SC k="?" desc="Show / hide this help" />
                <SC k="Esc" desc="Close this help" />
              </tbody>
            </table>
            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: 10 }}>
              Shortcuts ทำงานเมื่อโฟกัสไม่ได้อยู่ใน input/textarea, ใน study mode (2 viewports) shortcut จะ apply กับทั้งสองอันพร้อมกัน
            </div>
          </div>
        </div>
      )}
      <div
        ref={elRef}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: '100%',
          // Adaptive: at least 400 px, at most 900 px, prefer viewport
          // minus chrome (~260 px = page header + toolbar + status
          // footer). Solves the "viewport hidden under fold on a
          // small laptop" complaint without overflowing on tall
          // monitors. Cornerstone3D resizes canvas to match.
          height: 'clamp(380px, calc(100vh - 260px), 900px)',
          background: '#000',
          borderRadius: status === 'ready' ? '0 0 8px 8px' : 8,
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        {status === 'init' && (
          <div style={overlay}>
            <div style={spinnerStyle}>🔬</div>
            <div>กำลังโหลด DICOM...</div>
            <div style={{ fontSize: '0.72rem', marginTop: 6, opacity: 0.6 }}>
              {file?.name}, {(file?.size / 1024 | 0)} KB
            </div>
          </div>
        )}
        {status === 'error' && (
          <div style={{ ...overlay, color: '#fbb', textAlign: 'center', padding: 20 }}>
            โหลดไม่สำเร็จ<br />
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{errorMsg}</span>
          </div>
        )}
        {/* `key` includes file identity so the overlay component
            unmounts + re-mounts when the user switches DICOM. Without
            this, world-space points from the previous image stay
            in state and would render at nonsense positions over
            the new image's anatomy. */}
        {status === 'ready' && showFirstHint && (
          <div
            style={firstHintStyle}
            onClick={() => setShowFirstHint(false)}
            title="คลิกเพื่อปิด"
            role="status"
          >
            💡 <strong>ลองวัด:</strong>{' '}
            กด <kbd style={kbdInlineStyle}>N</kbd> Norberg,{' '}
            <kbd style={kbdInlineStyle}>V</kbd> VHS,{' '}
            <kbd style={kbdInlineStyle}>L</kbd> Length{' '}
            <span style={{ opacity: 0.7, fontSize: '0.78em' }}>, กด <kbd style={kbdInlineStyle}>?</kbd> ดูทั้งหมด</span>
          </div>
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
            species={species}
          />
        )}
      </div>
      {meta && status === 'ready' && (
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 8 }}>
          📐 {meta.width} × {meta.height} pixels
          {meta.mmPerPx && (
            <>, calibrated at <strong>{meta.mmPerPx.toFixed(3)} mm/pixel</strong> (PixelSpacing tag)</>
          )}
         , Phase 6, 🦴 Norberg + VHS ใน toolbar
        </div>
      )}
      {meta && status === 'ready' && (
        <div style={{ fontSize: '0.75rem', color: '#888', marginTop: 4 }}>
          เลือก 📏 Length หรือ Angle จาก toolbar แล้วลากบนภาพ — ผลแสดงเป็น mm จาก PixelSpacing tag, ลากซ้าย = active tool, กลาง = pan, ขวา = zoom
        </div>
      )}
    </div>
  );
}

function TBtn({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={typeof active === 'boolean' ? active : undefined}
      style={{
        // The toolbar scrolls horizontally on mobile, so every control can
        // keep the app-wide 44 px touch floor without squeezing the canvas.
        minHeight: 44,
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

// First-load hint near the canvas, fades after 6.5 s.
const firstHintStyle = {
  position: 'absolute',
  top: 10,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 11,
  background: 'rgba(0,0,0,0.78)',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 999,
  fontSize: '0.82rem',
  pointerEvents: 'auto',
  cursor: 'pointer',
  maxWidth: '92%',
  textAlign: 'center',
  animation: 'vmx-lab-hint-fade 6.5s ease-in-out forwards',
};

const kbdInlineStyle = {
  display: 'inline-block',
  padding: '0 5px',
  background: '#fff',
  color: '#333',
  border: '1px solid #ccc',
  borderRadius: 3,
  fontFamily: 'monospace',
  fontSize: '0.78rem',
  lineHeight: 1.3,
};

// Keyframes for first-hint fade
if (typeof document !== 'undefined' && !document.getElementById('vmx-lab-hint-keyframes')) {
  const s = document.createElement('style');
  s.id = 'vmx-lab-hint-keyframes';
  s.textContent = '@keyframes vmx-lab-hint-fade { 0% { opacity: 0; transform: translateX(-50%) translateY(-4px); } 8% { opacity: 1; transform: translateX(-50%) translateY(0); } 85% { opacity: 1; } 100% { opacity: 0; transform: translateX(-50%) translateY(-2px); } }';
  document.head.appendChild(s);
}

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

// Mobile toolbar — no wrap, horizontal scroll. Keeps the canvas
// from being squished by a 4-row toolbar on phone portrait.
// `touch-action: pan-x` lets horizontal swipe scroll the toolbar
// without the browser also trying to navigate. Momentum scroll on
// iOS via -webkit-overflow-scrolling.
const toolbarMobileStyle = {
  display: 'flex',
  gap: 6,
  flexWrap: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
  padding: '6px 8px',
  background: '#f5f5f5',
  borderRadius: '8px 8px 0 0',
  alignItems: 'center',
  fontSize: '0.85rem',
  WebkitOverflowScrolling: 'touch',
  touchAction: 'pan-x',
  scrollbarWidth: 'thin',
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
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#aaa',
  fontSize: '0.95rem',
  pointerEvents: 'none',
};

const spinnerStyle = {
  fontSize: 44,
  marginBottom: 14,
  animation: 'vmx-lab-spin-pulse 1.4s ease-in-out infinite',
  display: 'inline-block',
};

// CSS keyframes injected once at module level so each viewport
// doesn't duplicate a <style> tag.
if (typeof document !== 'undefined' && !document.getElementById('vmx-lab-spin-pulse-keyframes')) {
  const s = document.createElement('style');
  s.id = 'vmx-lab-spin-pulse-keyframes';
  s.textContent = `@keyframes vmx-lab-spin-pulse { 0%,100% { opacity:0.35; transform: scale(0.92); } 50% { opacity: 1; transform: scale(1.05); } }`;
  document.head.appendChild(s);
}
