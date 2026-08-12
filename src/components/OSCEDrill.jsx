// ============================================================
// OSCEDrill — interactive OSCE checklist runner
// ============================================================
//
// Modal that lets the user pick a station from osce-checklists.js,
// run a timer, and tick off items as they "perform" each step.
// At the end: weighted score + breakdown of missed criticals.
//
// Persists last-3 attempts per station to localStorage as a quick
// "did I improve?" trend. Pure client-side, no Supabase.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { OSCE_CHECKLISTS } from '../data/osce-checklists.js';
import { useModalFocus } from '../hooks/useModalFocus.js';

const ATTEMPTS_KEY = 'vmx-osce-attempts';

function readAttempts() {
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAttempt(stationId, score, ms, missedCriticals) {
  try {
    const all = readAttempts();
    const list = all[stationId] || [];
    list.push({ ts: Date.now(), score, ms, missedCriticals });
    while (list.length > 3) list.shift();
    all[stationId] = list;
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(all));
  } catch {}
}

export default function OSCEDrill({ onClose }) {
  const [stationId, setStationId] = useState(null);
  const station = useMemo(() => OSCE_CHECKLISTS.find((s) => s.id === stationId), [stationId]);
  const [checked, setChecked] = useState({});
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const tickRef = useRef(null);
  const [attempts, setAttempts] = useState({});
  const dialogRef = useModalFocus({ onClose });

  useEffect(() => { setAttempts(readAttempts()); }, []);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed;
    tickRef.current = setInterval(() => setElapsed(Date.now() - startRef.current), 250);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function pickStation(id) {
    setStationId(id);
    setChecked({});
    setDone(false);
    setElapsed(0);
    setRunning(false);
  }

  function start() {
    if (!station) return;
    setRunning(true);
    setDone(false);
  }

  function finish() {
    setRunning(false);
    setDone(true);
    if (!station) return;
    const totalW = station.items.reduce((s, it) => s + it.weight, 0);
    const earnedW = station.items.reduce((s, it, i) => s + (checked[i] ? it.weight : 0), 0);
    const score = totalW > 0 ? Math.round((earnedW / totalW) * 100) : 0;
    const missedCriticals = station.items
      .map((it, i) => ({ ...it, i }))
      .filter((it) => it.weight >= 2 && !checked[it.i])
      .map((it) => it.text);
    saveAttempt(station.id, score, elapsed, missedCriticals);
    setAttempts(readAttempts());
  }

  function reset() {
    setChecked({});
    setDone(false);
    setElapsed(0);
    setRunning(false);
  }

  const fmtMs = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  // Score live for header readout
  const totalW = station ? station.items.reduce((s, it) => s + it.weight, 0) : 0;
  const earnedW = station ? station.items.reduce((s, it, i) => s + (checked[i] ? it.weight : 0), 0) : 0;
  const liveScore = totalW > 0 ? Math.round((earnedW / totalW) * 100) : 0;

  return (
    <div className="vmx-modal-overlay" onClick={onClose}>
      <div ref={dialogRef} className="vmx-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640, maxHeight: 'min(90vh, calc(100dvh - 24px))', overflowY: 'auto' }} role="dialog" aria-modal="true" aria-labelledby="vmx-osce-title" tabIndex={-1} data-vmx-modal="true">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>OSCE Drill</div>
          <h2 id="vmx-osce-title" style={{ margin: '4px 0 0', fontSize: 22 }}>ฝึก station จับเวลา + checklist</h2>
        </div>

        {!station && (
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {OSCE_CHECKLISTS.map((s) => {
              const lastAttempts = attempts[s.id] || [];
              const last = lastAttempts[lastAttempts.length - 1];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => pickStation(s.id)}
                  className="vmx-btn vmx-btn-ghost"
                  style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, padding: '12px 14px', height: 'auto' }}
                >
                  <span style={{ fontSize: 18 }}>{s.icon} {s.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
                    {s.items.length} ขั้น, {s.minutes} นาที {last ? `, last ${last.score}%` : ''}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {station && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <button type="button" onClick={() => pickStation(null)} className="vmx-btn vmx-btn-ghost vmx-btn-sm">← เปลี่ยน station</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--vmx-mono)', fontSize: 14 }}>
                <span>⏱ {fmtMs(elapsed)}</span>
                <span style={{ color: 'var(--clr-ink-soft)' }}>/ {station.minutes}:00</span>
                <span>,</span>
                <span style={{ fontWeight: 700 }}>{liveScore}%</span>
              </div>
            </div>

            {!running && !done && (
              <button type="button" onClick={start} className="vmx-btn vmx-btn-primary" style={{ width: '100%', marginBottom: 12 }}>
                ▶️ เริ่มจับเวลา
              </button>
            )}
            {running && !done && (
              <button type="button" onClick={finish} className="vmx-btn vmx-btn-primary" style={{ width: '100%', marginBottom: 12, background: 'var(--clr-rose, #c0392b)' }}>
                🛑 จบและให้คะแนน
              </button>
            )}

            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {station.items.map((it, i) => {
                const isChecked = !!checked[i];
                const critical = it.weight >= 2;
                return (
                  <li key={i}>
                    <label style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '8px 10px', borderRadius: 8,
                      background: isChecked ? 'rgba(74, 107, 74, 0.10)' : (critical ? 'rgba(184, 137, 64, 0.06)' : 'transparent'),
                      border: critical ? '1px solid rgba(184, 137, 64, 0.35)' : '1px solid transparent',
                      cursor: 'pointer', userSelect: 'none',
                    }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const nextChecked = e.target.checked;
                          setChecked((c) => ({ ...c, [i]: nextChecked }));
                        }}
                        style={{ marginTop: 3, width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
                      />
                      <span style={{ flex: 1, fontSize: 13, lineHeight: 1.5, textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'var(--clr-ink-soft)' : 'var(--clr-ink)' }}>
                        {it.text}
                      </span>
                      {critical && <span title="critical step — must hit" style={{ fontSize: 11, padding: '2px 6px', borderRadius: 999, background: 'var(--clr-gold, #b88940)', color: '#fff', fontFamily: 'var(--vmx-mono)', flexShrink: 0 }}>★ critical</span>}
                    </label>
                  </li>
                );
              })}
            </ul>

            {done && (
              <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: liveScore >= 70 ? 'rgba(74, 107, 74, 0.08)' : 'rgba(192, 57, 43, 0.08)', border: `1px solid ${liveScore >= 70 ? 'var(--clr-sage)' : 'var(--clr-rose, #c0392b)'}` }}>
                <div style={{ fontSize: 22, fontFamily: 'Fraunces, serif', fontWeight: 700, marginBottom: 4 }}>
                  {liveScore}%, {fmtMs(elapsed)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>
                  {liveScore >= 70 ? 'ผ่านเกณฑ์ — keep practicing for consistency' : 'ยังไม่ผ่าน — โฟกัส critical steps ก่อน'}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button type="button" onClick={reset} className="vmx-btn vmx-btn-primary vmx-btn-sm">🔁 ทำซ้ำ station นี้</button>
                  <button type="button" onClick={() => pickStation(null)} className="vmx-btn vmx-btn-ghost vmx-btn-sm">เปลี่ยน station</button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="vmx-btn-row" style={{ marginTop: 16 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose} type="button">ปิด</button>
        </div>
      </div>
    </div>
  );
}
