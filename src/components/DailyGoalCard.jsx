// ============================================================
// DailyGoalCard — daily Q quota + today's tasks
// ============================================================
//
// Two-in-one widget for HomeView:
//   1. Daily Q goal — user sets a target (default 25/day), progress
//      bar fills as they answer. Crossing 100% triggers a small
//      celebration animation.
//   2. Today's tasks — quick checklist for the day (add/check/delete).
//      Persists in localStorage; auto-rolls over to a fresh day at
//      midnight (yesterday's tasks are archived to a 7-day rolling
//      buffer in case Palm wants them back).
//
// Both pieces are localStorage-only — no Supabase, no cost. Stays
// useful even offline.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useStorage.js';

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function DailyGoalCard({ history = [] }) {
  const [goal, setGoal] = useLocalStorage('vmx-daily-goal', 25);
  const [editing, setEditing] = useState(false);
  const [inputGoal, setInputGoal] = useState(String(goal));
  const [tasksByDay, setTasksByDay] = useLocalStorage('vmx-day-tasks', {});
  const [taskInput, setTaskInput] = useState('');
  const today = todayKey();

  // Q count for today — counts non-skipped history entries (i.e., the
  // user actually committed an answer). One entry per Q in an exam.
  const todayCount = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const t = startOfDay.getTime();
    return history.filter((h) => h.date >= t && h.userAnswer !== undefined).length;
  }, [history]);

  // Auto-rollover — if tasks for "yesterday" exist, archive them
  // (kept for 7 days under YYYY-MM-DD keys). Today's bucket created lazily.
  useEffect(() => {
    setTasksByDay((prev) => {
      const out = { ...prev };
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
      const cutoffMs = cutoff.getTime();
      for (const key of Object.keys(out)) {
        const [y, m, d] = key.split('-').map(Number);
        if (Number.isFinite(y) && Number.isFinite(m) && Number.isFinite(d)) {
          const t = new Date(y, m - 1, d).getTime();
          if (t < cutoffMs) delete out[key];
        }
      }
      if (!out[today]) out[today] = [];
      return out;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tasks = tasksByDay[today] || [];

  function addTask() {
    const text = taskInput.trim();
    if (!text) return;
    const newTask = { id: Date.now() + Math.random(), text, done: false };
    setTasksByDay((prev) => ({ ...prev, [today]: [...(prev[today] || []), newTask] }));
    setTaskInput('');
  }

  function toggleTask(id) {
    setTasksByDay((prev) => ({
      ...prev,
      [today]: (prev[today] || []).map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }

  function deleteTask(id) {
    setTasksByDay((prev) => ({
      ...prev,
      [today]: (prev[today] || []).filter((t) => t.id !== id),
    }));
  }

  function saveGoal() {
    const n = parseInt(inputGoal, 10);
    if (Number.isFinite(n) && n > 0 && n < 1000) setGoal(n);
    setEditing(false);
  }

  const pct = goal > 0 ? Math.min(100, (todayCount / goal) * 100) : 0;
  const hit = todayCount >= goal && goal > 0;

  return (
    <div className="vmx-dash-card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>🎯 เป้าวันนี้</h3>
        {editing ? (
          <span style={{ display: 'flex', gap: 4 }}>
            <input
              type="number"
              inputMode="numeric"
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              style={{ width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--clr-border)', fontSize: 13 }}
            />
            <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={saveGoal}>OK</button>
          </span>
        ) : (
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setEditing(true); setInputGoal(String(goal)); }}>
            ⚙ ตั้งเป้า
          </button>
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 22, fontFamily: 'Fraunces, serif', fontWeight: 700, color: hit ? 'var(--clr-sage, #4a6b4a)' : 'var(--clr-ink)' }}>
        {todayCount} / {goal} {hit && '🎉'}
      </div>
      <div style={{ marginTop: 6, height: 10, borderRadius: 999, background: 'var(--clr-surface-2)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: hit ? 'var(--clr-sage, #4a6b4a)' : 'linear-gradient(90deg, var(--clr-sage, #4a6b4a), var(--clr-gold, #b88940))',
          transition: 'width 0.4s ease',
        }} />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
          ✅ Todo วันนี้
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }}
            placeholder="เพิ่มสิ่งที่ต้องทำวันนี้…"
            style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--clr-border)', fontSize: 13, background: 'var(--clr-bg)', color: 'var(--clr-ink)' }}
          />
          <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={addTask} disabled={!taskInput.trim()}>
            +
          </button>
        </div>
        {tasks.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>ยังไม่มีรายการ — พิมพ์เพิ่มข้างบน</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {tasks.map((t) => (
              <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, background: t.done ? 'rgba(74, 107, 74, 0.07)' : 'transparent' }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  aria-label={`ทำเสร็จ: ${t.text}`}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <span style={{ flex: 1, fontSize: 13, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--clr-ink-soft)' : 'var(--clr-ink)' }}>
                  {t.text}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTask(t.id)}
                  aria-label="ลบ"
                  style={{ background: 'transparent', border: 'none', color: 'var(--clr-ink-soft)', cursor: 'pointer', fontSize: 14, padding: 0 }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
