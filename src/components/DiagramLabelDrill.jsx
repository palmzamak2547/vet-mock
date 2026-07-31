// ============================================================
// DiagramLabelDrill — anatomy labeling exercise modal
// ============================================================
//
// Pick a diagram → tap each anchor → choose its label from the pool.
// Wrong = red flash; correct = green stick. Score reveals on completion.
// Pure SVG + tap-to-pick UX (works on phone, no DnD complexity).
// ============================================================

import { useMemo, useState } from 'react';
import { DIAGRAM_DRILLS } from '../data/diagram-drills.js';

export default function DiagramLabelDrill({ onClose }) {
  const [drillId, setDrillId] = useState(null);
  const drill = useMemo(() => DIAGRAM_DRILLS.find((d) => d.id === drillId), [drillId]);

  if (!drill) {
    return (
      <div className="vmx-modal-overlay" onClick={onClose} role="dialog" aria-label="Diagram label drill">
        <div className="vmx-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Diagram label drill
            </div>
            <h2 style={{ margin: '4px 0 0', fontSize: 22 }}>เลือก diagram ที่จะฝึก</h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              ฝึก label anatomy แบบ active recall — แตะจุดที่ diagram → เลือก label ที่ตรง
            </p>
          </div>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {DIAGRAM_DRILLS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDrillId(d.id)}
                className="vmx-btn vmx-btn-ghost"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, padding: '12px 14px', height: 'auto', textAlign: 'left' }}
              >
                <span style={{ fontSize: 18 }}>{d.icon} {d.title}</span>
                <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
                  {d.anchors.length} จุดให้ label
                </span>
              </button>
            ))}
          </div>
          <div className="vmx-btn-row" style={{ marginTop: 16 }}>
            <button className="vmx-btn vmx-btn-ghost" onClick={onClose} type="button">ปิด</button>
          </div>
        </div>
      </div>
    );
  }

  return <DrillRunner drill={drill} onBack={() => setDrillId(null)} onClose={onClose} />;
}

function DrillRunner({ drill, onBack, onClose }) {
  const [activeAnchor, setActiveAnchor] = useState(null);
  // Map anchor id → { picked: labelText, correct: bool }
  const [progress, setProgress] = useState({});
  const [revealed, setRevealed] = useState(false);

  // Build pool from this drill's labels (shuffled deterministically per
  // mount so the order isn't always the same).
  const labelPool = useMemo(() => {
    const labels = drill.anchors.map((a) => a.label);
    return [...labels].sort(() => Math.random() - 0.5);
  }, [drill]);

  function pickLabel(label) {
    if (!activeAnchor) return;
    const anchor = drill.anchors.find((a) => a.id === activeAnchor);
    const correct = anchor?.label === label;
    setProgress((prev) => ({
      ...prev,
      [activeAnchor]: { picked: label, correct },
    }));
    setActiveAnchor(null);
  }

  const completedCount = Object.keys(progress).length;
  const correctCount = Object.values(progress).filter((p) => p.correct).length;
  const allDone = completedCount === drill.anchors.length;
  const scorePct = drill.anchors.length > 0 ? Math.round((correctCount / drill.anchors.length) * 100) : 0;

  // Available labels — drop ones the user has correctly placed already
  // so they can't reuse them. Wrong picks stay available so user has
  // a chance to try again on a different anchor.
  const usedCorrectly = new Set(
    Object.values(progress).filter((p) => p.correct).map((p) => p.picked)
  );
  const remainingLabels = labelPool.filter((l) => !usedCorrectly.has(l));

  return (
    <div className="vmx-modal-overlay" onClick={onClose} role="dialog" aria-label={drill.title}>
      <div className="vmx-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <button type="button" onClick={onBack} className="vmx-btn vmx-btn-ghost vmx-btn-sm">← เปลี่ยน diagram</button>
          <span style={{ fontFamily: 'var(--vmx-mono)', fontSize: 13 }}>
            {correctCount}/{drill.anchors.length} ถูก
            {revealed && allDone && `, คะแนน ${scorePct}%`}
          </span>
        </div>

        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{drill.icon} {drill.title}</h2>

        <div style={{ background: 'var(--clr-surface-2)', borderRadius: 12, padding: 8, marginBottom: 14 }}>
          <svg
            viewBox={drill.viewBox}
            style={{ width: '100%', height: 'auto', maxHeight: 420, display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{ __html: drill.svg + drill.anchors.map((a) => {
              const p = progress[a.id];
              const fill = revealed
                ? (p?.correct ? '#27ae60' : (p?.picked ? '#c0392b' : '#888'))
                : (p?.correct ? '#27ae60' : (p?.picked ? '#c0392b' : (activeAnchor === a.id ? '#b88940' : '#3d6b82')));
              const stroke = activeAnchor === a.id ? '#000' : '#fff';
              return `<g class="anchor" data-id="${a.id}">
                <circle cx="${a.x}" cy="${a.y}" r="11" fill="${fill}" stroke="${stroke}" stroke-width="2" style="cursor:pointer"/>
                <text x="${a.x}" y="${a.y + 4}" text-anchor="middle" font-size="11" font-family="monospace" font-weight="700" fill="white">${p?.correct ? '✓' : (p?.picked ? '✗' : '?')}</text>
              </g>`;
            }).join('') }}
            onClick={(e) => {
              // Bubble up from <g> or <circle> via data-id attr
              let el = e.target;
              while (el && el !== e.currentTarget && !el.dataset?.id) el = el.parentNode;
              if (el?.dataset?.id) {
                if (revealed) return;
                setActiveAnchor((prev) => prev === el.dataset.id ? null : el.dataset.id);
              }
            }}
          />
        </div>

        {!revealed && (
          <>
            <div style={{ fontSize: 12, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              {activeAnchor ? '⬇ เลือก label สำหรับจุดที่เลือก' : '⬇ แตะจุดบน diagram → แล้วเลือก label จากด้านล่าง'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {remainingLabels.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => pickLabel(l)}
                  disabled={!activeAnchor}
                  className="vmx-chip"
                  style={{
                    cursor: activeAnchor ? 'pointer' : 'not-allowed',
                    opacity: activeAnchor ? 1 : 0.5,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </>
        )}

        {allDone && !revealed && (
          <div className="vmx-btn-row" style={{ marginTop: 14 }}>
            <button type="button" className="vmx-btn vmx-btn-primary" onClick={() => setRevealed(true)}>
              ดูคะแนน
            </button>
          </div>
        )}

        {revealed && (
          <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: scorePct >= 70 ? 'rgba(74,107,74,0.10)' : 'rgba(192,57,43,0.10)', border: `1px solid ${scorePct >= 70 ? 'var(--clr-sage)' : 'var(--clr-rose, #c0392b)'}` }}>
            <div style={{ fontSize: 22, fontFamily: 'Fraunces, serif', fontWeight: 700, marginBottom: 4 }}>
              {scorePct}%, {correctCount}/{drill.anchors.length} ถูก
            </div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              {scorePct === 100 ? 'perfect! anatomy แม่นมาก' : scorePct >= 70 ? 'ผ่านเกณฑ์' : 'ลองใหม่อีกรอบ — เน้น label ที่ตอบผิด'}
            </div>
            <details style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>ดูเฉลย</summary>
              <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                {drill.anchors.map((a) => {
                  const p = progress[a.id];
                  return (
                    <li key={a.id} style={{ marginBottom: 4 }}>
                      <strong>{a.label}</strong> {p?.correct ? '✓' : <span style={{ color: 'var(--clr-rose, #c0392b)' }}>(คุณตอบ: {p?.picked || '—'})</span>}
                    </li>
                  );
                })}
              </ul>
            </details>
            <div className="vmx-btn-row" style={{ marginTop: 12 }}>
              <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => { setProgress({}); setActiveAnchor(null); setRevealed(false); }}>🔁 ทำซ้ำ</button>
              <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onBack}>เปลี่ยน diagram</button>
            </div>
          </div>
        )}

        <div className="vmx-btn-row" style={{ marginTop: 14 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose} type="button">ปิด</button>
        </div>
      </div>
    </div>
  );
}
