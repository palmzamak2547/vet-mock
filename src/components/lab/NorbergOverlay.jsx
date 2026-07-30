import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { saveAttempt, reasonLabel } from '../../lib/dicom/save-attempt.js';
import { useMediaQuery } from '../../lib/dicom/use-media-query.js';

// Norberg angle workflow on a VD pelvis radiograph:
//   1) center of the left femoral head
//   2) center of the right femoral head
//   3) cranial-most point of the left dorsal acetabular rim
//   4) cranial-most point of the right dorsal acetabular rim
//
// The angle at each femoral-head vertex is formed by the line to the
// opposite femoral head and the line to that side's acetabular rim.
// Classification follows the common BVA-style thresholds:
//   >= 105°  Normal
//   100–104° Borderline
//   < 100°  Dysplastic
const STEPS = [
  'จุดที่ 1: ศูนย์กลาง femoral head ข้างซ้าย (สัตว์)',
  'จุดที่ 2: ศูนย์กลาง femoral head ข้างขวา (สัตว์)',
  'จุดที่ 3: ขอบ acetabular rim ข้างซ้าย (cranial)',
  'จุดที่ 4: ขอบ acetabular rim ข้างขวา (cranial)',
];

const COLORS = ['#ff6b6b', '#6bb6ff', '#ffaa6b', '#6bffaa'];
const LABELS = ['L♀', 'R♀', 'L⌃', 'R⌃'];

export default function NorbergOverlay({ active, viewportRef, caseId = null }) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  // On mobile the result card eats half the canvas; let user collapse
  // it to a thin header bar so they can still see the image. Restored
  // when they tap the header again.
  const [cardCollapsed, setCardCollapsed] = useState(false);
  // World-space points (3D). Persist across tool toggles until Reset.
  const [worldPoints, setWorldPoints] = useState([]);
  // Tick re-renders SVG positions when the camera moves (zoom/pan).
  // Polling is cheaper than wiring into Cornerstone's event system and
  // 80 ms is well below perceptual lag for an annotation overlay.
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!active || worldPoints.length === 0) return;
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, [active, worldPoints.length]);

  // Global "clear" listener — the toolbar 🗑 Clear button dispatches
  // this so a single click wipes both Cornerstone annotations and
  // custom-overlay points without callback wiring.
  useEffect(() => {
    const onClear = () => setWorldPoints([]);
    window.addEventListener('vmx-lab-clear-overlays', onClear);
    return () => window.removeEventListener('vmx-lab-clear-overlays', onClear);
  }, []);

  // Undo — only when this overlay is the active one, so 2 viewports
  // don't both pop a point on the same U keypress.
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
    if (worldPoints.length < 4) return;
    const [lf, rf, lac, rac] = worldPoints;
    const left = angleAtVertex(lf, rf, lac);
    const right = angleAtVertex(rf, lf, rac);
    const cls = classify(Math.min(left, right));
    // Same schema as AI prediction overlay, so the JSON round-trips:
    // download → re-drop via 🤖 Load AI to re-render on a fresh image.
    const data = {
      type: 'vmx-lab-measurement',
      version: 1,
      model: 'manual-norberg',
      created_at: new Date().toISOString(),
      predictions: {
        norberg: {
          points: {
            left_femoral_head:   { world: lf },
            right_femoral_head:  { world: rf },
            left_acetabular_rim: { world: lac },
            right_acetabular_rim:{ world: rac },
          },
          left_angle: left,
          right_angle: right,
          classification: cls,
        },
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `norberg_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
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
    // tick is intentionally a stale-read dep below via setTick above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldPoints, viewportRef, setTick]);

  // Hit-test radius for grabbing existing points (in CSS pixels).
  // Slightly bigger than the visible 7 px circle so it's tappable.
  const HIT_RADIUS_PX = 16;
  const [draggingIdx, setDraggingIdx] = useState(null);
  const dragCanvasRef = useRef(null);

  const onPointerDown = useCallback((e) => {
    if (!active) return;
    const vp = viewportRef?.();
    if (!vp) return;
    const container = e.currentTarget.parentElement;
    const canvas = container?.querySelector('canvas') || container;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    // First try to hit an existing point → start drag-refine mode.
    for (let i = 0; i < worldPoints.length; i++) {
      try {
        const [sx, sy] = vp.worldToCanvas(worldPoints[i]);
        if (Math.hypot(sx - cx, sy - cy) < HIT_RADIUS_PX) {
          dragCanvasRef.current = canvas;
          setDraggingIdx(i);
          e.stopPropagation();
          return;
        }
      } catch { /* projection failed, fall through */ }
    }

    // No hit — add a new point if there's room.
    if (worldPoints.length >= 4) return;
    try {
      const world = vp.canvasToWorld([cx, cy]);
      setWorldPoints((prev) => [...prev, world]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[NorbergOverlay] canvasToWorld error:', err);
    }
  }, [active, worldPoints, viewportRef]);

  // While dragging a point, listen on window so the pointer can
  // leave the overlay without losing the drag.
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
      } catch { /* canvasToWorld failed mid-drag */ }
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

  // 2-step reset confirm to prevent accidentally wiping 4-click work.
  // First click → "ยืนยัน Reset?" for 3 s. Second click within window
  // → wipe. After timeout → revert to plain "Reset".
  const [confirmingReset, setConfirmingReset] = useState(false);
  const reset = useCallback(() => {
    setWorldPoints((prev) => {
      if (prev.length === 0) return prev;
      if (!confirmingReset) {
        setConfirmingReset(true);
        setTimeout(() => setConfirmingReset(false), 3000);
        return prev;  // not yet wiped
      }
      setConfirmingReset(false);
      return [];
    });
  }, [confirmingReset]);

  const [saveState, setSaveState] = useState({ status: 'idle', msg: null });
  const handleSave = useCallback(async () => {
    if (worldPoints.length < 4) return;
    const [lf, rf, lac, rac] = worldPoints;
    const left = angleAtVertex(lf, rf, lac);
    const right = angleAtVertex(rf, lf, rac);
    const cls = classify(Math.min(left, right));
    setSaveState({ status: 'saving', msg: null });
    const res = await saveAttempt({
      tool: 'norberg',
      caseId,
      measurement_json: { worldPoints, left, right },
      numeric_result: left,
      secondary_result: right,
      classification: cls,
    });
    if (res.ok) {
      setSaveState({ status: 'saved', msg: null });
      setTimeout(() => setSaveState({ status: 'idle', msg: null }), 4000);
    } else {
      setSaveState({ status: 'error', msg: reasonLabel(res.reason) });
    }
  }, [worldPoints, caseId]);

  const angles = useMemo(() => {
    if (worldPoints.length < 4) return null;
    const [lf, rf, lac, rac] = worldPoints;
    return {
      left: angleAtVertex(lf, rf, lac),
      right: angleAtVertex(rf, lf, rac),
    };
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
        cursor: draggingIdx != null ? 'grabbing' : (worldPoints.length < 4 ? 'crosshair' : 'default'),
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <svg style={svgStyle}>
        {screenPoints.length >= 2 && (
          <line
            x1={screenPoints[0].x} y1={screenPoints[0].y}
            x2={screenPoints[1].x} y2={screenPoints[1].y}
            stroke="#ffeb3b" strokeWidth={2} strokeDasharray="6,4"
          />
        )}
        {screenPoints.length >= 3 && (
          <line
            x1={screenPoints[0].x} y1={screenPoints[0].y}
            x2={screenPoints[2].x} y2={screenPoints[2].y}
            stroke="#ff6b6b" strokeWidth={2}
          />
        )}
        {screenPoints.length >= 4 && (
          <line
            x1={screenPoints[1].x} y1={screenPoints[1].y}
            x2={screenPoints[3].x} y2={screenPoints[3].y}
            stroke="#6bb6ff" strokeWidth={2}
          />
        )}
        {screenPoints.map((p, i) => (
          <g key={i}>
            {/* Larger transparent grab area so touch users can hit it
                even though the visible circle is 7 px. */}
            <circle cx={p.x} cy={p.y} r={HIT_RADIUS_PX} fill="transparent" />
            <circle
              cx={p.x} cy={p.y}
              r={draggingIdx === i ? 9 : 7}
              fill={COLORS[i]}
              stroke="#fff"
              strokeWidth={draggingIdx === i ? 3 : 2}
            />
            <text
              x={p.x + 12} y={p.y + 4}
              fill="#fff" fontSize="13" fontWeight="bold"
              style={{ paintOrder: 'stroke', stroke: '#000', strokeWidth: 3 }}
            >
              {LABELS[i]}
            </text>
          </g>
        ))}
      </svg>

      <div style={topBannerStyle}>
        {nextLabel
          ? `🦴 Norberg, จุดที่ ${worldPoints.length + 1} จาก 4 → ${nextLabel.replace(/^จุดที่ \d+: /, '')}, กด U เพื่อ undo`
          : '🦴 Norberg, ครบ 4 จุด, ลากจุดเพื่อปรับ, ดูผลด้านล่าง'}
      </div>

      {angles && (
        <div style={isMobile ? (cardCollapsed ? mobileSheetCollapsedStyle : mobileSheetStyle) : resultCardStyle}>
          <div
            onClick={isMobile ? () => setCardCollapsed((c) => !c) : undefined}
            style={{
              fontWeight: 'bold',
              marginBottom: cardCollapsed ? 0 : 6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: isMobile ? 'pointer' : 'default',
              userSelect: 'none',
            }}
          >
            <span>
              Norberg angle result
              {isMobile && cardCollapsed && (
                <span style={{ marginLeft: 8, fontWeight: 400, opacity: 0.8, fontSize: '0.82em' }}>
                  L {angles.left.toFixed(1)}°, R {angles.right.toFixed(1)}°
                </span>
              )}
            </span>
            {isMobile && (
              <span aria-label={cardCollapsed ? 'ขยาย' : 'ย่อ'} style={{ fontSize: '0.85em', color: '#bbb' }}>
                {cardCollapsed ? '▲' : '▼'}
              </span>
            )}
          </div>
          {!cardCollapsed && <>
          <div style={{ color: '#ff9b9b' }}>
            Left: <strong>{angles.left.toFixed(1)}°</strong> — {classify(angles.left)}
          </div>
          <div style={{ color: '#9bccff' }}>
            Right: <strong>{angles.right.toFixed(1)}°</strong> — {classify(angles.right)}
          </div>
          <div style={{ marginTop: 6, fontSize: '0.7rem', color: '#aaa' }}>
            เครื่องมือเพื่อการเรียนรู้, ไม่ใช้แทนการ workup ผู้ป่วยจริง
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <button onClick={undo} disabled={worldPoints.length === 0} style={resetBtnStyle}>↶ Undo</button>
            <button
              onClick={reset}
              style={{ ...resetBtnStyle, background: confirmingReset ? '#b85450' : '#444' }}
              title={confirmingReset ? 'คลิกอีกครั้งใน 3 วินาทีเพื่อยืนยันลบทั้งหมด' : 'ลบ Norberg points ทั้งหมด'}
            >
              {confirmingReset ? '⚠️ ยืนยัน Reset?' : '↺ Reset'}
            </button>
            <button onClick={exportStateJson} style={resetBtnStyle} title="ดาวน์โหลด JSON ของ Norberg points, re-drop via 🤖 Load AI เพื่อ replay ภายหลัง">
              📥 JSON
            </button>
            <button
              onClick={handleSave}
              disabled={saveState.status === 'saving'}
              style={{ ...resetBtnStyle, background: saveState.status === 'saved' ? '#4a6b4a' : '#3a5a8a' }}
            >
              {saveState.status === 'saving' ? '⏳ saving...' : saveState.status === 'saved' ? '✅ Saved' : '💾 Save attempt'}
            </button>
          </div>
          {saveState.msg && (
            <div style={{ marginTop: 6, fontSize: '0.7rem', color: saveState.status === 'error' ? '#fbb' : '#9c9' }}>
              {saveState.msg}
            </div>
          )}
          </>}
        </div>
      )}
    </div>
  );
}

function angleAtVertex(vertex, p1, p2) {
  const v1x = p1[0] - vertex[0], v1y = p1[1] - vertex[1];
  const v2x = p2[0] - vertex[0], v2y = p2[1] - vertex[1];
  const dot = v1x * v2x + v1y * v2y;
  const m1 = Math.hypot(v1x, v1y);
  const m2 = Math.hypot(v2x, v2y);
  if (m1 === 0 || m2 === 0) return 0;
  const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

function classify(angle) {
  if (angle >= 105) return 'Normal (≥105°)';
  if (angle >= 100) return 'Borderline (100–104°)';
  return 'Dysplastic (<100°)';
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
  minWidth: 230,
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
