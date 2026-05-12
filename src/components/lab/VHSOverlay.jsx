import { useState, useEffect, useCallback, useMemo } from 'react';

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

export default function VHSOverlay({ active, viewportRef }) {
  const [worldPoints, setWorldPoints] = useState([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!active || worldPoints.length === 0) return;
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, [active, worldPoints.length]);

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

  const onPointerDown = useCallback((e) => {
    if (!active || worldPoints.length >= 6) return;
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
      console.error('[VHSOverlay] canvasToWorld error:', err);
    }
  }, [active, worldPoints.length, viewportRef]);

  const reset = useCallback(() => setWorldPoints([]), []);

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
        cursor: worldPoints.length < 6 ? 'crosshair' : 'default',
        userSelect: 'none',
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
            <circle cx={p.x} cy={p.y} r={6} fill={COLORS[i]} stroke="#fff" strokeWidth={2} />
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
          ? `📐 VHS · ${nextLabel} (${worldPoints.length + 1}/6)`
          : '📐 VHS · ครบ 6 จุด — ดูผลด้านล่าง'}
      </div>

      {result && (
        <div style={resultCardStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Vertebral Heart Score</div>
          <div>L (long axis) = <strong>{result.Lv.toFixed(2)} v</strong></div>
          <div>S (short axis) = <strong>{result.Sv.toFixed(2)} v</strong></div>
          <div style={{ marginTop: 6, fontSize: '1rem', color: '#ffd93d' }}>
            VHS = <strong>{result.vhs.toFixed(2)} v</strong>
          </div>
          <div style={{ marginTop: 6, fontSize: '0.72rem', color: '#aaa' }}>
            ค่าอ้างอิงทั่วไป · canine 8.5–10.5 · feline 6.7–8.1
            <br />breed-specific มี · breed ใหญ่บางพันธุ์ค่าปกติสูงกว่านี้
            <br />เครื่องมือเพื่อการเรียนรู้ · ไม่ใช้แทนการ workup ผู้ป่วยจริง
          </div>
          <button onClick={reset} style={resetBtnStyle}>↺ Reset VHS points</button>
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
