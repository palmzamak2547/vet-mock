import { useMemo } from 'react';
import { SUBJECTS, QB } from '../data/questions.js';
import { downloadJSON } from '../hooks/utils.js';
import BackBar from '../components/BackBar.jsx';

// Compute last-7-days bucket — returns one entry per day (oldest →
// newest) with `total` attempts + `correct` count + `pct`. Returns
// null if there's no history at all (caller hides the chart).
function build7DayTrend(history) {
  if (!history?.length) return null;
  const MS_DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  // Round to start of today in local time so day buckets align with
  // the user's calendar (not UTC).
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const t0 = todayStart.getTime();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const start = t0 - i * MS_DAY;
    const end = start + MS_DAY;
    const slice = history.filter((h) => h.date >= start && h.date < end);
    const correct = slice.filter((h) => h.correct).length;
    const total = slice.length;
    const dateLabel = new Date(start).toLocaleDateString('th-TH', { weekday: 'short' });
    days.push({ start, total, correct, pct: total ? Math.round((correct / total) * 100) : null, label: dateLabel });
  }
  // If all 7 days are 0 attempts, no value in showing
  if (days.every((d) => d.total === 0)) return null;
  return days;
}

// Compact 7-day trend chart — renders as inline SVG, no chart lib.
// Bars = attempts count (heights normalized to max), thin gold line
// = accuracy % (skips days with no attempts so it doesn't dive to 0).
function TrendChart({ days }) {
  const W = 320, H = 80, PAD = 8;
  const maxAttempts = Math.max(1, ...days.map((d) => d.total));
  const barW = (W - PAD * 2) / days.length;
  // Build the accuracy polyline only across days that have data
  const linePoints = [];
  days.forEach((d, i) => {
    if (d.pct === null) return;
    const x = PAD + barW * i + barW / 2;
    const y = PAD + (H - PAD * 2) * (1 - d.pct / 100);
    linePoints.push(`${x},${y}`);
  });

  return (
    <div style={{ marginTop: 8 }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', maxHeight: 110, display: 'block' }} aria-label="7-day study trend">
        {/* Bars — attempt count */}
        {days.map((d, i) => {
          const h = d.total ? Math.max(2, ((H - PAD * 2) * d.total / maxAttempts)) : 0;
          const x = PAD + barW * i + 4;
          const y = H - PAD - h;
          return (
            <rect
              key={i}
              x={x} y={y} width={barW - 8} height={h}
              fill={d.pct !== null && d.pct >= 70 ? 'var(--clr-sage)' : d.pct !== null && d.pct >= 50 ? 'var(--clr-gold)' : d.pct !== null ? 'var(--clr-rose)' : 'var(--clr-border)'}
              rx={2}
              opacity={d.total === 0 ? 0.3 : 0.7}
            >
              <title>{d.label} · {d.total} ข้อ{d.total ? ` · ${d.pct}%` : ''}</title>
            </rect>
          );
        })}
        {/* Accuracy line on top */}
        {linePoints.length >= 2 && (
          <polyline
            fill="none"
            stroke="var(--clr-ink)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={linePoints.join(' ')}
            opacity="0.55"
          />
        )}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', marginTop: 4, padding: '0 2px' }}>
        {days.map((d, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center' }}>{d.label}</span>
        ))}
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
        แท่ง = จำนวนข้อ · สี = ความแม่น (เขียว ≥70% · ทอง 50-69% · ชมพู &lt;50%)
      </div>
    </div>
  );
}

export default function DashboardView({ analytics, bookmarks, setHistory, setBookmarks, setSrCards, setNotes, setCustomQuestions, setStreakData, setPracticeMode, setView, setMode, history, notes, srCards, streak, customQuestions }) {
  const trend = useMemo(() => build7DayTrend(history), [history]);
  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '5.0',
      bookmarks,
      history,
      notes,
      srCards,
      streak,
      customQuestions,
    };
    downloadJSON(data, `vetmock-backup-${Date.now()}.json`);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (confirm('Import data นี้จะทับของเดิม — ยืนยันไหม?')) {
          if (data.bookmarks) setBookmarks(data.bookmarks);
          if (data.history) setHistory(data.history);
          if (data.srCards) setSrCards(data.srCards);
          if (data.notes && setNotes) setNotes(data.notes);
          if (data.customQuestions && setCustomQuestions) setCustomQuestions(data.customQuestions);
          if (data.streak !== undefined && setStreakData) {
            setStreakData({ streak: data.streak, lastDate: Date.now() });
          }
          alert('Import สำเร็จ! Reload หน้าเพื่อเห็นการเปลี่ยนแปลง');
        }
      } catch { alert('ไฟล์ไม่ถูกต้อง'); }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <BackBar onBack={() => setView('home')} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>Analytics <em>Dashboard</em></h1>
        <p>สถิติการฝึกของคุณ · 🔥 Streak: {streak || 0} วัน</p>
      </div>

      {!analytics ? (
        <div className="vmx-empty">ยังไม่มีข้อมูลสถิติ — ลองทำข้อสอบสักชุดก่อน 📈</div>
      ) : (
        <>
          <div className="vmx-stat-grid">
            <div className="vmx-stat-card">
              <div className="vmx-stat-num">{analytics.totalAttempts}</div>
              <div className="vmx-stat-lbl">Total Attempts</div>
            </div>
            <div className="vmx-stat-card">
              <div className="vmx-stat-num" style={{ color: 'var(--clr-sage)' }}>{analytics.overallPct}%</div>
              <div className="vmx-stat-lbl">Overall Accuracy</div>
            </div>
            <div className="vmx-stat-card">
              <div className="vmx-stat-num" style={{ color: 'var(--clr-gold)' }}>🔥 {streak || 0}</div>
              <div className="vmx-stat-lbl">Day Streak</div>
            </div>
            <div className="vmx-stat-card">
              <div className="vmx-stat-num" style={{ color: 'var(--clr-rose)' }}>{analytics.weakQuestions.length}</div>
              <div className="vmx-stat-lbl">Weak Questions</div>
            </div>
          </div>

          {trend && (
            <div className="vmx-dash-card" style={{ marginTop: 16 }}>
              <h3>📈 7 วันล่าสุด</h3>
              <TrendChart days={trend} />
            </div>
          )}

          <div className="vmx-dash-grid">
            <div className="vmx-dash-card">
              <h3>ความแม่นยำตามวิชา</h3>
              {SUBJECTS.filter((s) => s.id !== 'all').map((s) => {
                const stat = analytics.bySubject[s.id];
                if (!stat || stat.total === 0) return null;
                const pct = Math.round((stat.correct / stat.total) * 100);
                const cls = pct >= 70 ? '' : pct >= 50 ? 'mid' : 'low';
                return (
                  <div key={s.id}>
                    <div className="vmx-subj-row">
                      <span>{s.icon} {s.name}</span>
                      <span className="pct">{pct}% ({stat.correct}/{stat.total})</span>
                    </div>
                    <div className="vmx-bar"><div className={`vmx-bar-fill ${cls}`} style={{ width: `${pct}%` }}></div></div>
                  </div>
                );
              })}
            </div>

            <div className="vmx-dash-card">
              <h3>หัวข้อที่อ่อน 🎯</h3>
              {analytics.weakTags.length === 0 ? (
                <div className="vmx-empty" style={{ padding: 20 }}>ยังไม่มีข้อมูล</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {analytics.weakTags.map((t) => (
                    <span key={t.tag} className={`vmx-tag-pill ${t.pct < 60 ? 'weak' : ''}`}>
                      #{t.tag} · {t.pct}% ({t.total})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="vmx-dash-card">
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              {analytics.weakQuestions.length > 0 && (
                <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => { setPracticeMode('weak'); setMode('quick'); setView('config'); }}>
                  🎯 ทำข้อที่อ่อน ({analytics.weakQuestions.length})
                </button>
              )}
              {bookmarks.length > 0 && (
                <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => { setPracticeMode('bookmarks'); setMode('quick'); setView('config'); }}>
                  🔖 ทำ Bookmarks ({bookmarks.length})
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <div className="vmx-dash-card">
        <h3>Backup & Import</h3>
        <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
          Export ข้อมูลทั้งหมด (bookmarks, history, notes, SR cards) เป็นไฟล์ JSON เพื่อ backup หรือย้ายเครื่อง
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={exportData}>📥 Export Backup</button>
          <label className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ cursor: 'pointer' }}>
            📤 Import Backup
            <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 20 }}>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => {
          if (confirm('ต้องการล้างประวัติทั้งหมด? (ข้อมูล bookmarks, history, notes, SR cards, streak จะหายหมด)')) {
            setHistory([]);
            setBookmarks([]);
            setSrCards({});
            if (setNotes) setNotes({});
            if (setStreakData) setStreakData({ streak: 0, lastDate: null });
          }
        }}>🗑 ล้างข้อมูลทั้งหมด</button>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={() => setView('home')}>← หน้าแรก</button>
      </div>
    </>
  );
}
