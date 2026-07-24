// ============================================================
// DailyGoalCard — daily Q quota + today's tasks (compact list rows)
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useStorage.js';

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function DailyGoalCard({ history = [], selectedYear }) {
  const [goal, setGoal] = useLocalStorage('vmx-daily-goal', 25);
  const [editing, setEditing] = useState(false);
  const [inputGoal, setInputGoal] = useState(String(goal));
  const [tasksByDay, setTasksByDay] = useLocalStorage('vmx-day-tasks', {});
  const [taskInput, setTaskInput] = useState('');
  const today = todayKey();

  const todayCount = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const t = startOfDay.getTime();
    const yearMatch = (h) => {
      if (!Number.isFinite(selectedYear)) return true;
      if (typeof h.year === 'number') return h.year === selectedYear;
      return true;
    };
    return history.filter((h) =>
      h.date >= t
      && h.userAnswer !== undefined
      && yearMatch(h)
    ).length;
  }, [history, selectedYear]);

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
  }, [today, setTasksByDay]);

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
    <div className="vmx-dash-card" style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--clr-ink)' }}>
          เป้าหมายทำโจทย์ประจำวัน
        </h3>
        {editing ? (
          <span style={{ display: 'flex', gap: 4 }}>
            <input
              type="number"
              inputMode="numeric"
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              style={{ width: 60, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--clr-border)', fontSize: 13, background: 'var(--clr-bg)', color: 'var(--clr-ink)' }}
            />
            <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={saveGoal}>บันทึก</button>
          </span>
        ) : (
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setEditing(true); setInputGoal(String(goal)); }}>
            แก้ไขเป้าหมาย
          </button>
        )}
      </div>

      <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: hit ? 'var(--vmx-color-success)' : 'var(--clr-ink)' }}>
          {todayCount} / {goal} ข้อ
        </span>
        {hit && <span style={{ fontSize: 12, color: 'var(--vmx-color-success)', fontWeight: 700 }}>บรรลุเป้าหมายแล้ว</span>}
      </div>

      <div style={{ marginTop: 12, height: 16, borderRadius: 999, background: 'var(--vmx-surface-muted)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: hit ? 'var(--vmx-color-success)' : 'var(--vmx-color-learning)',
          transition: 'width 0.4s ease',
          borderRadius: 999
        }} />
      </div>

      {/* Compact Daily Task List */}
      <div style={{ marginTop: 14, borderTop: '1px solid var(--clr-border)', paddingTop: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-ink-soft)', marginBottom: 6 }}>
          รายการสิ่งที่ต้องทำวันนี้
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }}
            placeholder="เพิ่มรายการสิ่งที่ต้องทำ..."
            style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--clr-border)', fontSize: 13, background: 'var(--clr-bg)', color: 'var(--clr-ink)' }}
          />
          <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={addTask} disabled={!taskInput.trim()}>
            เพิ่ม
          </button>
        </div>

        {tasks.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>ยังไม่มีรายการประจำวัน</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {tasks.map((t) => (
              <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, background: t.done ? 'var(--clr-surface-2)' : 'transparent' }}>
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
                  aria-label="ลบรายการ"
                  style={{ background: 'transparent', border: 'none', color: 'var(--clr-ink-soft)', cursor: 'pointer', fontSize: 13, padding: '2px 4px' }}
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
