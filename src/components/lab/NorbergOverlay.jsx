import { useState, useEffect, useCallback, useMemo } from 'react';
import { saveAttempt, reasonLabel } from '../../lib/dicom/save-attempt.js';

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

  const onPointerDown = useCallback((e) => {
    if (!active || worldPoints.length >= 4) return;
    const vp = viewportRef?.();
    if (!vp) return;
    const container = e.currentTarget.parentElement;
    const canvas = container?.querySelector('canvas') || container;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    try {
      const world = vp.canvasToWorld([cx, cy]);
      setWorldPoints((prev) => [...prev, world]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[NorbergOverlay] canvasToWorld error:', err);
    }
  }, [active, worldPoints.length, viewportRef]);

  const reset = useCallback(() => setWorldPoints([]), []);

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
        cursor: worldPoints.length < 4 ? 'crosshair' : 'default',
        userSelect: 'none',
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
            <circle cx={p.x} cy={p.y} r={7} fill={COLORS[i]} stroke="#fff" strokeWidth={2} />
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
          ? `🦴 Norberg · ${nextLabel} (${worldPoints.length + 1}/4)`
          : '🦴 Norberg · ครบ 4 จุด — ดูผลทางด้านล่าง'}
      </div>

      {angles && (
        <div style={resultCardStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Norberg angle result</div>
          <div style={{ color: '#ff9b9b' }}>
            Left: <strong>{angles.left.toFixed(1)}°</strong> — {classify(angles.left)}
          </div>
          <div style={{ color: '#9bccff' }}>
            Right: <strong>{angles.right.toFixed(1)}°</strong> — {classify(angles.right)}
          </div>
          <div style={{ marginTop: 6, fontSize: '0.7rem', color: '#aaa' }}>
            เครื่องมือเพื่อการเรียนรู้ · ไม่ใช้แทนการ workup ผู้ป่วยจริง
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <button onClick={reset} style={resetBtnStyle}>↺ Reset</button>
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
