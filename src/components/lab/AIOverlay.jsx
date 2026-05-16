import { useEffect, useMemo, useState } from 'react';

// AIOverlay — render model predictions on top of the DICOM viewport.
// The integration point is a JSON document the user drops in via the
// "🤖 Load AI" button. Format is model-agnostic; see README in this
// file for the shape.
//
// Predictions:
//   • predictions.norberg.points = {left_femoral_head, right_femoral_head,
//     left_acetabular_rim, right_acetabular_rim} → each {world:[x,y,z], confidence?}
//     Draws 4 cyan diamonds + femoral baseline + 2 angle lines.
//   • predictions.vhs.points = {long_axis_start, long_axis_end,
//     short_axis_start, short_axis_end, vertebra_start, vertebra_end}
//     → each {world:[x,y,z], confidence?}. Draws 3 magenta lines.
//   • predictions.annotations = [{type:'point'|'bbox', world:[..]|world_xywh:[..], label, confidence}]
//
// Color convention chosen to be visually distinct from the manual
// overlays (red/blue/yellow for Norberg+VHS). Cyan/magenta = "AI".

const COLOR_AI_NORBERG = '#00d4ff';     // cyan
const COLOR_AI_VHS     = '#ff66cc';     // magenta
const COLOR_AI_GENERIC = '#aaff66';     // green

export default function AIOverlay({ prediction, viewportRef }) {
  const [, setTick] = useState(0);

  // Re-render SVG positions as the camera moves
  useEffect(() => {
    if (!prediction) return;
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, [prediction]);

  const project = useMemo(() => {
    const vp = viewportRef?.();
    return (worldArr) => {
      if (!vp || !worldArr) return null;
      try {
        const [x, y] = vp.worldToCanvas(worldArr);
        return { x, y };
      } catch {
        return null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportRef, prediction]);

  if (!prediction) return null;

  const norberg = prediction?.predictions?.norberg;
  const vhs = prediction?.predictions?.vhs;
  const generic = prediction?.predictions?.annotations || [];

  const norbergPts = norberg?.points ? [
    project(norberg.points.left_femoral_head?.world),
    project(norberg.points.right_femoral_head?.world),
    project(norberg.points.left_acetabular_rim?.world),
    project(norberg.points.right_acetabular_rim?.world),
  ] : null;

  const vhsPts = vhs?.points ? [
    project(vhs.points.long_axis_start?.world),
    project(vhs.points.long_axis_end?.world),
    project(vhs.points.short_axis_start?.world),
    project(vhs.points.short_axis_end?.world),
    project(vhs.points.vertebra_start?.world),
    project(vhs.points.vertebra_end?.world),
  ] : null;

  return (
    <div style={overlayContainerStyle}>
      <svg style={svgStyle}>
        {/* AI Norberg */}
        {norbergPts && norbergPts.every(Boolean) && (
          <>
            <line x1={norbergPts[0].x} y1={norbergPts[0].y} x2={norbergPts[1].x} y2={norbergPts[1].y}
                  stroke={COLOR_AI_NORBERG} strokeWidth={2} strokeDasharray="4,3" opacity={0.85} />
            <line x1={norbergPts[0].x} y1={norbergPts[0].y} x2={norbergPts[2].x} y2={norbergPts[2].y}
                  stroke={COLOR_AI_NORBERG} strokeWidth={2} opacity={0.85} />
            <line x1={norbergPts[1].x} y1={norbergPts[1].y} x2={norbergPts[3].x} y2={norbergPts[3].y}
                  stroke={COLOR_AI_NORBERG} strokeWidth={2} opacity={0.85} />
            {norbergPts.map((p, i) => (
              <g key={`nb-${i}`}>
                <Diamond cx={p.x} cy={p.y} size={9} fill={COLOR_AI_NORBERG} />
              </g>
            ))}
          </>
        )}

        {/* AI VHS */}
        {vhsPts && vhsPts.every(Boolean) && (
          <>
            <line x1={vhsPts[0].x} y1={vhsPts[0].y} x2={vhsPts[1].x} y2={vhsPts[1].y}
                  stroke={COLOR_AI_VHS} strokeWidth={2} opacity={0.85} />
            <line x1={vhsPts[2].x} y1={vhsPts[2].y} x2={vhsPts[3].x} y2={vhsPts[3].y}
                  stroke={COLOR_AI_VHS} strokeWidth={2} opacity={0.85} />
            <line x1={vhsPts[4].x} y1={vhsPts[4].y} x2={vhsPts[5].x} y2={vhsPts[5].y}
                  stroke={COLOR_AI_VHS} strokeWidth={3} opacity={0.85} />
            {vhsPts.map((p, i) => (
              <g key={`vhs-${i}`}>
                <Diamond cx={p.x} cy={p.y} size={7} fill={COLOR_AI_VHS} />
              </g>
            ))}
          </>
        )}

        {/* Generic annotations */}
        {generic.map((a, i) => {
          if (a.type === 'point') {
            const p = project(a.world);
            return p ? (
              <g key={`gen-${i}`}>
                <Diamond cx={p.x} cy={p.y} size={8} fill={COLOR_AI_GENERIC} />
                {a.label && <text x={p.x + 12} y={p.y + 4} fill={COLOR_AI_GENERIC}
                                 fontSize="11" fontWeight="bold"
                                 style={{ paintOrder: 'stroke', stroke: '#000', strokeWidth: 3 }}>{a.label}</text>}
              </g>
            ) : null;
          }
          if (a.type === 'bbox' && a.world_xywh) {
            const tl = project([a.world_xywh[0], a.world_xywh[1], 0]);
            const br = project([a.world_xywh[0] + a.world_xywh[2], a.world_xywh[1] + a.world_xywh[3], 0]);
            return tl && br ? (
              <g key={`gen-${i}`}>
                <rect x={tl.x} y={tl.y} width={br.x - tl.x} height={br.y - tl.y}
                      stroke={COLOR_AI_GENERIC} strokeWidth={2} fill="none" />
                {a.label && <text x={tl.x + 4} y={tl.y - 4} fill={COLOR_AI_GENERIC}
                                 fontSize="11" fontWeight="bold"
                                 style={{ paintOrder: 'stroke', stroke: '#000', strokeWidth: 3 }}>
                                 {a.label}{a.confidence ? ` (${(a.confidence * 100).toFixed(0)}%)` : ''}
                                 </text>}
              </g>
            ) : null;
          }
          return null;
        })}
      </svg>

      <div style={legendStyle}>
        <strong>🤖 AI prediction</strong>
        <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: 2 }}>
          {prediction?.model || 'unknown model'}
          {prediction?.version && ` · v${prediction.version}`}
        </div>
        {norberg && (
          <div style={{ marginTop: 4 }}>
            <ColorChip color={COLOR_AI_NORBERG} />
            Norberg L={norberg.left_angle?.toFixed(1) ?? '?'}° R={norberg.right_angle?.toFixed(1) ?? '?'}°
          </div>
        )}
        {vhs && (
          <div style={{ marginTop: 2 }}>
            <ColorChip color={COLOR_AI_VHS} />
            VHS = {vhs.vhs?.toFixed(2) ?? '?'} v
          </div>
        )}
        {generic.length > 0 && (
          <div style={{ marginTop: 2 }}>
            <ColorChip color={COLOR_AI_GENERIC} />
            {generic.length} annotation(s)
          </div>
        )}
      </div>
    </div>
  );
}

function Diamond({ cx, cy, size = 8, fill }) {
  // Diamond shape distinguishes AI points from manual circles
  return (
    <polygon
      points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`}
      fill={fill}
      stroke="#fff"
      strokeWidth={1.5}
    />
  );
}

function ColorChip({ color }) {
  return <span style={{ display: 'inline-block', width: 10, height: 10, background: color, borderRadius: 2, marginRight: 6, verticalAlign: 'middle' }} />;
}

const overlayContainerStyle = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 9,  // below user-interactive overlays (Norberg/VHS at z:10)
};

const svgStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
};

const legendStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
  background: 'rgba(0,0,0,0.8)',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: 4,
  fontSize: '0.75rem',
  pointerEvents: 'none',
  maxWidth: 220,
};
