import { SUBJECTS, QB } from '../data/questions.js';
import { downloadJSON } from '../hooks/utils.js';

export default function DashboardView({ analytics, bookmarks, setHistory, setBookmarks, setSrCards, setPracticeMode, setView, setMode, history, notes, srCards, streak, customQuestions }) {
  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '3.0',
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
          alert('Import สำเร็จ! Reload หน้าเพื่อเห็นการเปลี่ยนแปลง');
        }
      } catch { alert('ไฟล์ไม่ถูกต้อง'); }
    };
    reader.readAsText(file);
  };

  return (
    <>
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
          if (confirm('ต้องการล้างประวัติทั้งหมด? (ข้อมูล bookmarks, history, notes, SR cards จะหายหมด)')) {
            setHistory([]); setBookmarks([]); setSrCards({});
          }
        }}>🗑 ล้างข้อมูลทั้งหมด</button>
      </div>
    </>
  );
}
