import { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { SUBJECTS, QB } from '../data/questions.js';
import { downloadJSON } from '../hooks/utils.js';
import BackBar from '../components/BackBar.jsx';
import { getWebVitalsSamples, summarize } from '../lib/web-vitals.js';
import StreakHeatmap from '../components/StreakHeatmap.jsx';
import { confirmDialog, alertDialog } from '../lib/dialog.js';

// OSCE drill is a heavier interactive modal — lazy load when launched.
const OSCEDrill = lazy(() => import('../components/OSCEDrill.jsx'));
// Diagram label exercise — anatomy hot-spot labeling (canvas-light SVG drill).
const DiagramLabelDrill = lazy(() => import('../components/DiagramLabelDrill.jsx'));

// Bucket history into per-subject daily accuracy over the last `daysBack`
// days. Returns { dayLabels, subjects: [{id, name, icon, color, points,
// totalN}] } or null if no usable data.
//
// Why: drives the multi-line "learning curve" — Palm wanted to see if
// each subject is improving or plateauing as the exam approaches.
// Subjects with <5 attempts in the window are skipped (noise floor).
function buildLearningCurve(history, daysBack = 14) {
  if (!history?.length) return null;
  const MS_DAY = 24 * 60 * 60 * 1000;
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const t0 = todayStart.getTime();
  const dayBuckets = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const start = t0 - i * MS_DAY;
    dayBuckets.push({ start, label: new Date(start).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) });
  }
  const startMs = dayBuckets[0].start;
  const bySubject = new Map();
  for (const h of history) {
    if (!h.subject || h.date < startMs) continue;
    const idx = Math.floor((h.date - startMs) / MS_DAY);
    if (idx < 0 || idx >= daysBack) continue;
    if (!bySubject.has(h.subject)) bySubject.set(h.subject, Array.from({ length: daysBack }, () => ({ total: 0, correct: 0 })));
    const arr = bySubject.get(h.subject);
    arr[idx].total += 1;
    if (h.correct) arr[idx].correct += 1;
  }
  const subjects = [];
  for (const [id, arr] of bySubject) {
    const totalN = arr.reduce((s, x) => s + x.total, 0);
    if (totalN < 5) continue;
    const meta = SUBJECTS.find((s) => s.id === id);
    if (!meta) continue;
    subjects.push({
      id,
      name: meta.name,
      icon: meta.icon,
      color: meta.color || 'var(--clr-ink)',
      points: arr.map((b, i) => ({ day: i, pct: b.total ? (b.correct / b.total) * 100 : null, n: b.total })),
      totalN,
    });
  }
  if (subjects.length === 0) return null;
  subjects.sort((a, b) => b.totalN - a.totalN);
  return { dayLabels: dayBuckets.map((d) => d.label), subjects };
}

// Multi-line SVG chart — one line per subject. No chart lib.
// Lines skip days with no data (each subject has its own point set).
function LearningCurveChart({ data }) {
  const W = 360, H = 200, PADL = 36, PADR = 12, PADT = 14, PADB = 24;
  const innerW = W - PADL - PADR;
  const innerH = H - PADT - PADB;
  const days = data.dayLabels.length;
  const xFor = (i) => PADL + (days <= 1 ? innerW / 2 : (innerW * i) / (days - 1));
  const yFor = (pct) => PADT + innerH * (1 - pct / 100);
  const labelStride = Math.max(1, Math.ceil(days / 6));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', maxHeight: 260, display: 'block' }} aria-label="Learning curve per subject">
      {[0, 50, 70, 100].map((y) => (
        <g key={y}>
          <line x1={PADL} y1={yFor(y)} x2={W - PADR} y2={yFor(y)} stroke="var(--clr-border)" strokeDasharray={y === 70 ? '0' : '2 4'} opacity={y === 70 ? 0.5 : 0.4} />
          <text x={PADL - 4} y={yFor(y) + 3} textAnchor="end" fontSize="9" fontFamily="var(--vmx-mono)" fill="var(--clr-ink-soft)">{y}%</text>
        </g>
      ))}
      {data.subjects.map((s) => {
        const valid = s.points.filter((p) => p.pct !== null);
        if (valid.length === 0) return null;
        const pathD = valid.length >= 2
          ? valid.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(p.day).toFixed(1)},${yFor(p.pct).toFixed(1)}`).join(' ')
          : '';
        return (
          <g key={s.id}>
            {pathD && <path d={pathD} stroke={s.color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />}
            {valid.map((p) => (
              <circle key={p.day} cx={xFor(p.day)} cy={yFor(p.pct)} r="3" fill={s.color}>
                <title>{s.icon} {s.name} — {data.dayLabels[p.day]}: {Math.round(p.pct)}% ({p.n} ข้อ)</title>
              </circle>
            ))}
          </g>
        );
      })}
      {data.dayLabels.map((label, i) => (i === 0 || i === days - 1 || i % labelStride === 0) && (
        <text key={i} x={xFor(i)} y={H - 6} textAnchor="middle" fontSize="9" fontFamily="var(--vmx-mono)" fill="var(--clr-ink-soft)">{label}</text>
      ))}
    </svg>
  );
}

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
              <title>{d.label}, {d.total} ข้อ{d.total ? `, ${d.pct}%` : ''}</title>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', marginTop: 4, padding: '0 2px' }}>
        {days.map((d, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center' }}>{d.label}</span>
        ))}
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
        แท่ง = จำนวนข้อ, สี = ความแม่น (เขียว ≥70%, ทอง 50-69%, ชมพู &lt;50%)
      </div>
    </div>
  );
}

// ── Web Vitals panel ─────────────────────────────────────────────
// Read-only view of last-50 samples persisted by web-vitals.js. Tells
// Palm whether the app is still meeting Core Web Vitals thresholds
// (LCP <2.5s, CLS <0.1, INP <200ms) on his actual device, without
// any analytics service. Renders nothing if no samples yet.
// Opt-in: LCP/CLS/INP are a developer's numbers, and this panel sat on every
// student's dashboard telling them nothing they can act on. Turn it on with
// ?perf=1 (sticks for the session) or localStorage vmx-perf = '1'.
function perfPanelEnabled() {
  if (typeof window === 'undefined') return false;
  try {
    if (new URLSearchParams(window.location.search).get('perf') === '1') {
      window.localStorage.setItem('vmx-perf', '1');
      return true;
    }
    return window.localStorage.getItem('vmx-perf') === '1';
  } catch { return false; }
}

function WebVitalsPanel() {
  const [samples, setSamples] = useState([]);
  const enabled = perfPanelEnabled();
  useEffect(() => {
    if (enabled) setSamples(getWebVitalsSamples());
  }, [enabled]);
  if (!enabled || !samples.length) return null;
  const stats = {
    lcp: summarize(samples, 'lcp'),
    cls: summarize(samples, 'cls'),
    inp: summarize(samples, 'inp'),
    fcp: summarize(samples, 'fcp'),
    ttfb: summarize(samples, 'ttfb'),
  };
  const fmt = (key, v) => {
    if (v == null) return '—';
    if (key === 'cls') return v.toFixed(3);
    return Math.round(v) + 'ms';
  };
  const rate = (key, v) => {
    if (v == null) return null;
    const T = { lcp: [2500, 4000], cls: [0.1, 0.25], inp: [200, 500], fcp: [1800, 3000], ttfb: [800, 1800] }[key];
    if (!T) return null;
    return v < T[0] ? '🟢' : v < T[1] ? '🟡' : '🔴';
  };
  const labels = {
    lcp: 'LCP, biggest paint',
    cls: 'CLS, layout shift',
    inp: 'INP, tap response',
    fcp: 'FCP, first paint',
    ttfb: 'TTFB, server speed',
  };
  return (
    <div className="vmx-dash-card">
      <h3>Performance (last {samples.length} sessions)</h3>
      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        {(['lcp', 'cls', 'inp', 'fcp', 'ttfb']).map((key) => {
          const s = stats[key];
          if (!s) return null;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 8px', borderRadius: 8, background: 'var(--clr-bg-soft, rgba(0,0,0,0.03))' }}>
              <span style={{ fontSize: 16 }}>{rate(key, s.p75) || '⚪'}</span>
              <span style={{ flex: 1, fontSize: 13 }}>{labels[key]}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
                p75 {fmt(key, s.p75)}, med {fmt(key, s.median)}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
        🟢 good, 🟡 needs improvement, 🔴 poor (Google Core Web Vitals thresholds)
      </div>
    </div>
  );
}

export default function DashboardView({ analytics, bookmarks, setHistory, setBookmarks, setSrCards, setNotes, setCustomQuestions, setStreakData, setPracticeMode, setView, setMode, history, notes, srCards, streak, customQuestions, selectedYear = 4, selectedPhase }) {
  // Year-scope toggle: 'current' restricts charts/heatmap/learning-curve
  // to the user's current year context; 'all' shows the lifetime view.
  // Persist user preference so they don't have to re-pick every visit.
  const [yearScope, setYearScope] = useState(() => {
    try { return localStorage.getItem('vmx-dash-year-scope') || 'current'; }
    catch { return 'current'; }
  });
  useEffect(() => {
    try { localStorage.setItem('vmx-dash-year-scope', yearScope); } catch { /* noop */ }
  }, [yearScope]);

  // Build subject → year map once so we can filter history without
  // joining against QB on every render (history doesn't store q.year).
  const subjectYear = useMemo(() => {
    const m = {};
    for (const q of QB) {
      if (q.subject && q.year != null && !(q.subject in m)) m[q.subject] = q.year;
    }
    return m;
  }, []);

  const scopedHistory = useMemo(() => {
    if (yearScope === 'all') return history;
    return (history || []).filter((h) => {
      // Prefer entry's explicit `year` field (set by App.jsx finishExam
      // post-data-layer-audit AND by the one-time backfill effect).
      if (typeof h?.year === 'number') return h.year === selectedYear;
      // Fallback for legacy rows the backfill missed: map subject→year.
      // Keep rows without subject (defensive — don't drop unknown).
      const y = subjectYear[h?.subject];
      return y == null || y === selectedYear;
    });
  }, [history, yearScope, subjectYear, selectedYear]);

  const trend = useMemo(() => build7DayTrend(scopedHistory), [scopedHistory]);
  const [curveDays, setCurveDays] = useState(14);
  const learningCurve = useMemo(() => buildLearningCurve(scopedHistory, curveDays), [scopedHistory, curveDays]);

  // Year-scoped analytics override — data-layer audit 2026-05-19 round 3.
  // The `analytics` prop is computed cross-year in App.jsx (used by other
  // surfaces too). When DashboardView's yearScope toggle is 'current',
  // the stat cards (Total / Overall / Weak Qs count) need to reflect
  // the SCOPED history, not lifetime. We derive lightweight scoped
  // versions here so we don't have to thread the year filter through
  // App.jsx's analytics useMemo.
  const scopedAnalytics = useMemo(() => {
    if (!analytics) return null;
    if (yearScope === 'all') return analytics;
    let correct = 0;
    const wrongIdSet = new Set();
    // Per-subject scoped accuracy — rebuild from scopedHistory so the
    // "ความแม่นยำตามวิชา" card respects the year toggle.
    const bySubject = {};
    for (const h of scopedHistory) {
      if (h?.correct === true) correct++;
      else if (h && h.correct === false) wrongIdSet.add(h.questionId);
      const sid = h?.subject;
      if (!sid) continue;
      if (!bySubject[sid]) bySubject[sid] = { correct: 0, total: 0 };
      bySubject[sid].total++;
      if (h.correct) bySubject[sid].correct++;
    }
    const total = scopedHistory.length;
    return {
      ...analytics,
      totalAttempts: total,
      overallPct: total ? Math.round((correct / total) * 100) : 0,
      bySubject,
      // Filter the precomputed weakQuestions list to IDs that also
      // appear in scoped history (proxy for "weak in current year").
      weakQuestions: analytics.weakQuestions.filter((id) => wrongIdSet.has(id)),
    };
  }, [analytics, scopedHistory, yearScope]);
  const [osceOpen, setOsceOpen] = useState(false);
  const [diagramOpen, setDiagramOpen] = useState(false);
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
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (await confirmDialog({ title: 'นำข้อมูลเข้า?', body: 'ข้อมูลในเครื่องตอนนี้จะถูกทับด้วยไฟล์ที่เลือก', confirmLabel: 'นำเข้าและทับของเดิม', tone: 'danger' })) {
          if (data.bookmarks) setBookmarks(data.bookmarks);
          if (data.history) setHistory(data.history);
          if (data.srCards) setSrCards(data.srCards);
          if (data.notes && setNotes) setNotes(data.notes);
          if (data.customQuestions && setCustomQuestions) setCustomQuestions(data.customQuestions);
          if (data.streak !== undefined && setStreakData) {
            setStreakData({ streak: data.streak, lastDate: Date.now() });
          }
          alertDialog('Import สำเร็จ! Reload หน้าเพื่อเห็นการเปลี่ยนแปลง');
        }
      } catch { alertDialog('ไฟล์ไม่ถูกต้อง'); }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <BackBar onBack={() => setView('home')} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>Analytics <em>Dashboard</em></h1>
        <p>สถิติการฝึกของคุณ, Streak: {streak || 0} วัน</p>
      </div>

      {/* Year-scope toggle — sets context for trend chart, heatmap,
          and learning curve. Stat cards above still show lifetime
          totals (from `analytics` which is computed cross-year). */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          ขอบเขต:
        </span>
        <button
          className={`vmx-chip ${yearScope === 'current' ? 'active' : ''}`}
          onClick={() => setYearScope('current')}
          style={{ minHeight: 32, fontSize: 12 }}
        >
          ปี {selectedYear} เท่านั้น
        </button>
        <button
          className={`vmx-chip ${yearScope === 'all' ? 'active' : ''}`}
          onClick={() => setYearScope('all')}
          style={{ minHeight: 32, fontSize: 12 }}
        >
          🌐 ทุกปี (lifetime)
        </button>
        {yearScope === 'current' && (
          <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
            {scopedHistory.length}/{history?.length || 0} attempts
          </span>
        )}
      </div>

      {!scopedAnalytics ? (
        <div className="vmx-empty">ยังไม่มีข้อมูลสถิติ — เริ่มทำข้อสอบเพื่อดูความคืบหน้าที่นี่</div>
      ) : (
        <>
          {/* Stat cards now reflect yearScope toggle (Palm round 3
              audit). 'current' → year-scoped totals/accuracy/weak-Q
              count. 'all' → lifetime (passed through unchanged). */}
          <div className="vmx-stat-grid">
            <div className="vmx-stat-card">
              <div className="vmx-stat-num">{scopedAnalytics.totalAttempts}</div>
              <div className="vmx-stat-lbl">Total Attempts</div>
            </div>
            <div className="vmx-stat-card">
              <div className="vmx-stat-num" style={{ color: 'var(--clr-sage)' }}>{scopedAnalytics.overallPct}%</div>
              <div className="vmx-stat-lbl">Overall Accuracy</div>
            </div>
            <div className="vmx-stat-card vmx-streak-stat-card">
              <div className="vmx-streak-stat-icon">🔥</div>
              <div className="vmx-stat-num" style={{ color: 'var(--clr-gold-text)' }}>{streak || 0}</div>
              <div className="vmx-stat-lbl">วันต่อเนื่อง</div>
              {streak >= 7 && (
                <div className="vmx-streak-milestone-badge">
                  {streak >= 30 ? 'เทพ!' : streak >= 14 ? 'แข็งแกร่ง!' : 'สุดยอด!'}
                </div>
              )}
            </div>
            <div className="vmx-stat-card">
              <div className="vmx-stat-num" style={{ color: 'var(--clr-rose-text)' }}>{scopedAnalytics.weakQuestions.length}</div>
              <div className="vmx-stat-lbl">Weak Questions</div>
            </div>
          </div>

          <div className="vmx-dash-card" style={{ marginTop: 16 }}>
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              {scopedAnalytics.weakQuestions.length > 0 && (
                <button className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => { setPracticeMode('weak'); setMode('quick'); setView('config'); }}>
                  ทำข้อที่อ่อน ({scopedAnalytics.weakQuestions.length})
                </button>
              )}
              {bookmarks.length > 0 && (
                <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={async () => { setPracticeMode('bookmarks'); setMode('quick'); setView('config'); }}>
                  ทำ Bookmarks ({bookmarks.length})
                </button>
              )}
            </div>
          </div>

          {trend && (
            <div className="vmx-dash-card" style={{ marginTop: 16 }}>
              <h3>7 วันล่าสุด</h3>
              <TrendChart days={trend} />
            </div>
          )}

          <div className="vmx-dash-card" style={{ marginTop: 16 }}>
            <h3>ความหนาแน่น 12 เดือน{yearScope === 'current' ? `, ปี ${selectedYear}` : ''}</h3>
            <StreakHeatmap history={scopedHistory} />
          </div>

          {learningCurve && (
            <div className="vmx-dash-card" style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>Learning Curve รายวิชา</h3>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setCurveDays(d)}
                      className={`vmx-chip ${curveDays === d ? 'active' : ''}`}
                      style={{ fontSize: 11, padding: '3px 10px' }}
                    >{d}d</button>
                  ))}
                </div>
              </div>
              <LearningCurveChart data={learningCurve} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                {learningCurve.subjects.map((s) => (
                  <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 2, background: s.color, borderRadius: 1 }}></span>
                    {s.icon} {s.name} ({s.totalN})
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
                เส้นแต่ละสีคือความแม่นยำต่อวันของแต่ละวิชา, เส้น 70% เป็น threshold เป้าหมาย, แตะจุดเพื่อดูจำนวนข้อ
              </div>
            </div>
          )}

          <div className="vmx-dash-grid">
            <div className="vmx-dash-card">
              <h3>ความแม่นยำตามวิชา</h3>
              {SUBJECTS.filter((s) => s.id !== 'all').map((s) => {
                const stat = scopedAnalytics.bySubject[s.id];
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
              <h3>หัวข้อที่อ่อน</h3>
              {analytics.weakTags.length === 0 ? (
                <div className="vmx-empty" style={{ padding: 20 }}>ยังไม่มีข้อมูล</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {analytics.weakTags.map((t) => (
                    <span key={t.tag} className={`vmx-tag-pill ${t.pct < 60 ? 'weak' : ''}`}>
                      #{t.tag}, {t.pct}% ({t.total})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="vmx-dash-card">
        <h3>OSCE drill</h3>
        <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
          ฝึก clinical-skills station แบบจับเวลา + checklist (PE, IV, intubation, suture,
          anesthesia check, CPCR). มี critical step weight เหมือนสถานีจริง.
        </div>
        <button
          type="button"
          className="vmx-btn vmx-btn-primary vmx-btn-sm"
          onClick={() => setOsceOpen(true)}
        >
          ▶️ เริ่ม OSCE drill
        </button>
      </div>

      {osceOpen && (
        <Suspense fallback={null}>
          <OSCEDrill onClose={() => setOsceOpen(false)} />
        </Suspense>
      )}

      <div className="vmx-dash-card">
        <h3>Diagram label drill</h3>
        <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
          ฝึก label anatomy แบบ active recall — แตะจุดบน diagram → เลือก label, ตอนนี้มี 2 ชุด (Heart, Eye) เริ่มต้นไว้
        </div>
        <button
          type="button"
          className="vmx-btn vmx-btn-primary vmx-btn-sm"
          onClick={() => setDiagramOpen(true)}
        >
          ▶️ เริ่ม Diagram drill
        </button>
      </div>

      {diagramOpen && (
        <Suspense fallback={null}>
          <DiagramLabelDrill onClose={() => setDiagramOpen(false)} />
        </Suspense>
      )}

      <WebVitalsPanel />

      <div className="vmx-dash-card">
        <h3>Backup & Import</h3>
        <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginBottom: 12 }}>
          Export ข้อมูลทั้งหมด (bookmarks, history, notes, SR cards) เป็นไฟล์ JSON เพื่อ backup หรือย้ายเครื่อง
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={exportData}>Export Backup</button>
          <label className="vmx-btn vmx-btn-ghost vmx-btn-sm" style={{ cursor: 'pointer' }}>
            Import Backup
            <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 20 }}>
        <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={async () => {
          if (await confirmDialog({
            title: 'ล้างข้อมูลทั้งหมด?',
            body: 'bookmarks, ประวัติการฝึก, โน้ต, SR cards และ streak จะหายหมด',
            note: 'กู้คืนไม่ได้ — export backup ไว้ก่อนถ้ายังไม่แน่ใจ',
            confirmLabel: 'ล้างทั้งหมด',
            tone: 'danger',
          })) {
            setHistory([]);
            setBookmarks([]);
            setSrCards({});
            if (setNotes) setNotes({});
            if (setStreakData) setStreakData({ streak: 0, lastDate: null });
          }
        }}>ล้างข้อมูลทั้งหมด</button>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={() => setView('home')}>← หน้าแรก</button>
      </div>
    </>
  );
}
