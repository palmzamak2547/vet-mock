import { useState, useEffect, useCallback, useMemo, useRef, useId } from 'react';
import { saveAttempt, reasonLabel } from '../../lib/dicom/save-attempt.js';
import { useMediaQuery } from '../../lib/dicom/use-media-query.js';

// Buchanan & Bücheler 1995 vertebral heart score on a right-lateral
// thoracic radiograph. Six clicks define three measurements:
//   1–2  cardiac long axis (carina/L-bronchus base → apex)
//   3–4  cardiac short axis (perpendicular to L at CVC level)
//   5–6  ONE thoracic vertebra (e.g. T4 body) used as ruler unit
// VHS = (L / V) + (S / V)
//
// Reference ranges:
//   canine  ~8.5–10.5 (mean 9.7)   Buchanan & Bücheler 1995
//   feline  ~6.7–8.1  (mean 7.5)   Litster & Buchanan 2000
// Breed-specific ranges exist (e.g. Cavaliers run higher); the UI
// shows generic ranges only.
const STEPS = [
  'จุด 1: ฐาน left mainstem bronchus (long-axis start)',
  'จุด 2: cardiac apex (long-axis end)',
  'จุด 3: short-axis start (perpendicular, CVC level)',
  'จุด 4: short-axis end',
  'จุด 5: cranial edge of reference vertebra (e.g. T4)',
  'จุด 6: caudal edge of same vertebra',
];

const COLORS = ['#ff6b6b', '#ff6b6b', '#6bb6ff', '#6bb6ff', '#ffd93d', '#ffd93d'];
const PAIR_LABELS = ['L', 'L', 'S', 'S', 'V', 'V'];

// Species-adapted reference ranges (Buchanan & Bücheler · Litster &
// Buchanan). Returns null if species can't be matched — UI then shows
// the generic both-ranges note.
function refRangeForSpecies(species) {
  if (!species) return null;
  const s = species.toLowerCase();
  if (/feline|cat|felis/.test(s)) return { label: 'feline', lo: 6.7, hi: 8.1 };
  if (/canine|dog|canis/.test(s)) return { label: 'canine', lo: 8.5, hi: 10.5 };
  return null;
}

export default function VHSOverlay({ active, viewportRef, caseId = null, species = '' }) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const resultDetailsId = useId();
  const ref = refRangeForSpecies(species);
  const [cardCollapsed, setCardCollapsed] = useState(false);
  const [worldPoints, setWorldPoints] = useState([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!active || worldPoints.length === 0) return;
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, [active, worldPoints.length]);

  useEffect(() => {
    const onClear = () => setWorldPoints([]);
    window.addEventListener('vmx-lab-clear-overlays', onClear);
    return () => window.removeEventListener('vmx-lab-clear-overlays', onClear);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onUndo = () => setWorldPoints((prev) => prev.slice(0, -1));
    window.addEventListener('vmx-lab-undo-point', onUndo);
    return () => window.removeEventListener('vmx-lab-undo-point', onUndo);
  }, [active]);

  const undo = useCallback(() => {
    setWorldPoints((prev) => prev.slice(0, -1));
  }, []);

  const exportStateJson = useCallback(() => {
    if (worldPoints.length < 6) return;
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const L = d(worldPoints[0], worldPoints[1]);
    const S = d(worldPoints[2], worldPoints[3]);
    const V = d(worldPoints[4], worldPoints[5]);
    if (V === 0) return;
    const Lv = L / V, Sv = S / V, vhs = Lv + Sv;
    const data = {
      type: 'vmx-lab-measurement',
      version: 1,
      model: 'manual-vhs',
      created_at: new Date().toISOString(),
      predictions: {
        vhs: {
          points: {
            long_axis_start:  { world: worldPoints[0] },
            long_axis_end:    { world: worldPoints[1] },
            short_axis_start: { world: worldPoints[2] },
            short_axis_end:   { world: worldPoints[3] },
            vertebra_start:   { world: worldPoints[4] },
            vertebra_end:     { world: worldPoints[5] },
          },
          Lv, Sv, vhs,
        },
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vhs_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }, [worldPoints]);

  const screenPoints = useMemo(() => {
    const vp = viewportRef?.();
    if (!vp) return [];
    return worldPoints.map((w) => {
      try {
        const [x, y] = vp.worldToCanvas(w);
        return { x, y };
      } catch {
        return { x: -100, y: -100 };
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldPoints, viewportRef]);

  const HIT_RADIUS_PX = 16;
  const [draggingIdx, setDraggingIdx] = useState(null);
  const dragCanvasRef = useRef(null);

  const onPointerDown = useCallback((e) => {
    if (!active) return;
    if (e.target instanceof Element && e.target.closest('button, a, input, label')) return;
    const vp = viewportRef?.();
    if (!vp) return;
    const container = e.currentTarget.parentElement;
    const canvas = container?.querySelector('canvas') || container;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    for (let i = 0; i < worldPoints.length; i++) {
      try {
        const [sx, sy] = vp.worldToCanvas(worldPoints[i]);
        if (Math.hypot(sx - cx, sy - cy) < HIT_RADIUS_PX) {
          dragCanvasRef.current = canvas;
          setDraggingIdx(i);
          e.stopPropagation();
          return;
        }
      } catch { /* projection failed */ }
    }

    if (worldPoints.length >= 6) return;
    try {
      const world = vp.canvasToWorld([cx, cy]);
      setWorldPoints((prev) => [...prev, world]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[VHSOverlay] canvasToWorld error:', err);
    }
  }, [active, worldPoints, viewportRef]);

  useEffect(() => {
    if (draggingIdx == null) return;
    const vp = viewportRef?.();
    if (!vp) return;
    const onMove = (e) => {
      const canvas = dragCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      try {
        const world = vp.canvasToWorld([cx, cy]);
        setWorldPoints((prev) => prev.map((p, i) => (i === draggingIdx ? world : p)));
      } catch { /* canvasToWorld failed */ }
    };
    const onUp = () => {
      setDraggingIdx(null);
      dragCanvasRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [draggingIdx, viewportRef]);

  const [confirmingReset, setConfirmingReset] = useState(false);
  const reset = useCallback(() => {
    setWorldPoints((prev) => {
      if (prev.length === 0) return prev;
      if (!confirmingReset) {
        setConfirmingReset(true);
        setTimeout(() => setConfirmingReset(false), 3000);
        return prev;
      }
      setConfirmingReset(false);
      return [];
    });
  }, [confirmingReset]);

  const [saveState, setSaveState] = useState({ status: 'idle', msg: null });
  const handleSave = useCallback(async () => {
    if (worldPoints.length < 6) return;
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const L = d(worldPoints[0], worldPoints[1]);
    const S = d(worldPoints[2], worldPoints[3]);
    const V = d(worldPoints[4], worldPoints[5]);
    if (V === 0) return;
    const Lv = L / V, Sv = S / V, vhs = Lv + Sv;
    setSaveState({ status: 'saving', msg: null });
    const res = await saveAttempt({
      tool: 'vhs',
      caseId,
      measurement_json: { worldPoints, Lv, Sv, vhs },
      numeric_result: vhs,
      secondary_result: Lv,
      classification: null,
    });
    if (res.ok) {
      setSaveState({ status: 'saved', msg: null });
      setTimeout(() => setSaveState({ status: 'idle', msg: null }), 4000);
    } else {
      setSaveState({ status: 'error', msg: reasonLabel(res.reason) });
    }
  }, [worldPoints, caseId]);

  const result = useMemo(() => {
    if (worldPoints.length < 6) return null;
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const L = d(worldPoints[0], worldPoints[1]);
    const S = d(worldPoints[2], worldPoints[3]);
    const V = d(worldPoints[4], worldPoints[5]);
    if (V === 0) return null;
    const Lv = L / V;
    const Sv = S / V;
    return { Lv, Sv, vhs: Lv + Sv };
  }, [worldPoints]);

  if (!active) return null;

  const nextLabel = STEPS[worldPoints.length];

  return (
    <div
      onPointerDownCapture={onPointerDown}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        cursor: draggingIdx != null ? 'grabbing' : (worldPoints.length < 6 ? 'crosshair' : 'default'),
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <svg style={svgStyle}>
        {screenPoints.length >= 2 && (
          <line
            x1={screenPoints[0].x} y1={screenPoints[0].y}
            x2={screenPoints[1].x} y2={screenPoints[1].y}
            stroke="#ff6b6b" strokeWidth={2}
          />
        )}
        {screenPoints.length >= 4 && (
          <line
            x1={screenPoints[2].x} y1={screenPoints[2].y}
            x2={screenPoints[3].x} y2={screenPoints[3].y}
            stroke="#6bb6ff" strokeWidth={2}
          />
        )}
        {screenPoints.length >= 6 && (
          <line
            x1={screenPoints[4].x} y1={screenPoints[4].y}
            x2={screenPoints[5].x} y2={screenPoints[5].y}
            stroke="#ffd93d" strokeWidth={3}
          />
        )}
        {screenPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={HIT_RADIUS_PX} fill="transparent" />
            <circle
              cx={p.x} cy={p.y}
              r={draggingIdx === i ? 8 : 6}
              fill={COLORS[i]}
              stroke="#fff"
              strokeWidth={draggingIdx === i ? 3 : 2}
            />
            <text
              x={p.x + 10} y={p.y - 8}
              fill="#fff" fontSize="11" fontWeight="bold"
              style={{ paintOrder: 'stroke', stroke: '#000', strokeWidth: 3 }}
            >
              {PAIR_LABELS[i]}
            </text>
          </g>
        ))}
      </svg>

      <div style={topBannerStyle}>
        {nextLabel
          ? `VHS, จุดที่ ${worldPoints.length + 1} จาก 6 → ${nextLabel.replace(/^จุด \d+: /, '')}, กด U เพื่อ undo`
          : 'VHS, ครบ 6 จุด, ลากจุดเพื่อปรับ, ดูผลด้านล่าง'}
      </div>

      {result && (
        <div style={isMobile ? (cardCollapsed ? mobileSheetCollapsedStyle : mobileSheetStyle) : resultCardStyle}>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setCardCollapsed((c) => !c)}
              aria-expanded={!cardCollapsed}
              aria-controls={resultDetailsId}
              className="vmx-tap"
              style={{
                width: '100%',
                minHeight: 44,
                padding: 0,
                border: 0,
                background: 'transparent',
                color: 'inherit',
                font: 'inherit',
                fontWeight: 'bold',
                marginBottom: cardCollapsed ? 0 : 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>
                Vertebral Heart Score
                {cardCollapsed && (
                  <span style={{ marginLeft: 8, fontWeight: 400, opacity: 0.8, fontSize: '0.82em', color: '#ffd93d' }}>
                    VHS = {result.vhs.toFixed(2)} v
                  </span>
                )}
              </span>
              <span aria-hidden="true" style={{ fontSize: '0.85em', color: '#bbb' }}>
                {cardCollapsed ? '▲' : '▼'}
              </span>
            </button>
          ) : (
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>
              Vertebral Heart Score
            </div>
          )}
          {!cardCollapsed && <div id={resultDetailsId}>
          <div>L (long axis) = <strong>{result.Lv.toFixed(2)} v</strong></div>
          <div>S (short axis) = <strong>{result.Sv.toFixed(2)} v</strong></div>
          <div style={{ marginTop: 6, fontSize: '1rem', color: '#ffd93d' }}>
            VHS = <strong>{result.vhs.toFixed(2)} v</strong>
          </div>
          <div style={{ marginTop: 6, fontSize: '0.72rem', color: '#aaa' }}>
            {ref ? (
              <>
                ค่าอ้างอิง, <strong>{ref.label}</strong> {ref.lo}–{ref.hi}
                {', '}
                <span style={{ color: result.vhs > ref.hi ? '#fbb' : result.vhs < ref.lo ? '#bbf' : '#cfc' }}>
                  {result.vhs > ref.hi ? `↑ +${(result.vhs - ref.hi).toFixed(1)} above`
                    : result.vhs < ref.lo ? `↓ -${(ref.lo - result.vhs).toFixed(1)} below`
                    : 'within range'}
                </span>
                <br />Species จาก DICOM tag, breed-specific ranges อาจต่างจากนี้
              </>
            ) : (
              <>
                ค่าอ้างอิงทั่วไป, canine 8.5–10.5, feline 6.7–8.1
                <br />Species ไม่ระบุใน DICOM tag — แสดงทั้ง 2 ช่วง
              </>
            )}
            <br />เครื่องมือเพื่อการเรียนรู้, ไม่ใช้แทนการ workup ผู้ป่วยจริง
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={undo} disabled={worldPoints.length === 0} className="vmx-tap" style={resetBtnStyle}>↶ Undo</button>
            <button
              type="button"
              onClick={reset}
              className="vmx-tap"
              style={{ ...resetBtnStyle, background: confirmingReset ? '#b85450' : '#444' }}
              title={confirmingReset ? 'คลิกอีกครั้งใน 3 วินาทีเพื่อยืนยันลบทั้งหมด' : 'ลบ VHS points ทั้งหมด'}
            >
              {confirmingReset ? 'ยืนยัน Reset?' : '↺ Reset'}
            </button>
            <button type="button" onClick={exportStateJson} className="vmx-tap" style={resetBtnStyle} title="ดาวน์โหลด JSON ของ VHS points เพื่อเก็บผลการวัด">
              JSON
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="vmx-tap"
              disabled={saveState.status === 'saving'}
              style={{ ...resetBtnStyle, background: saveState.status === 'saved' ? '#4a6b4a' : '#3a5a8a' }}
            >
              {saveState.status === 'saving' ? 'saving...' : saveState.status === 'saved' ? 'Saved' : 'Save attempt'}
            </button>
          </div>
          {saveState.msg && (
            <div role={saveState.status === 'error' ? 'alert' : 'status'} style={{ marginTop: 6, fontSize: '0.7rem', color: saveState.status === 'error' ? '#fbb' : '#9c9' }}>
              {saveState.msg}
            </div>
          )}
          </div>}
        </div>
      )}
    </div>
  );
}

const svgStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
};

const topBannerStyle = {
  position: 'absolute',
  top: 8, left: 8, right: 8,
  background: 'rgba(0,0,0,0.78)',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: 4,
  fontSize: '0.85rem',
  pointerEvents: 'none',
  zIndex: 1,
};

const resultCardStyle = {
  position: 'absolute',
  bottom: 8, left: 8,
  background: 'rgba(0,0,0,0.9)',
  color: '#fff',
  padding: '10px 14px',
  borderRadius: 6,
  fontSize: '0.85rem',
  minWidth: 240,
  pointerEvents: 'auto',
};

const mobileSheetStyle = {
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  background: 'rgba(0,0,0,0.94)',
  color: '#fff',
  padding: '12px 16px',
  borderRadius: '12px 12px 0 0',
  fontSize: '0.9rem',
  pointerEvents: 'auto',
  maxHeight: '50%',
  overflowY: 'auto',
  boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
};

const mobileSheetCollapsedStyle = {
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  background: 'rgba(0,0,0,0.85)',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: '10px 10px 0 0',
  fontSize: '0.82rem',
  pointerEvents: 'auto',
  boxShadow: '0 -2px 8px rgba(0,0,0,0.25)',
};

const resetBtnStyle = {
  marginTop: 8,
  padding: '4px 10px',
  background: '#444',
  color: '#fff',
  border: '1px solid #777',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.75rem',
};
