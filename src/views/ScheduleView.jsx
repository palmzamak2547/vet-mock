import { lazy, Suspense, useEffect, useState } from 'react';
import { SEMESTER, examTitle, fmtThaiDate, getUpcomingExams, shortCountdown } from '../data/schedule.js';
import { examTimetable } from '../lib/exam-timetable.js';
import WeekTimetable from '../components/WeekTimetable.jsx';
import AcademicCalendar from '../components/AcademicCalendar.jsx';
// Phase 2 perf: use precomputed counts instead of QB. ScheduleView
// only asks "does this paper have usable Qs?" — a boolean lookup against
// the tiny q-counts.js file. Saves dragging the full QB into this
// view's load graph.
import { Q_VISIBLE_COUNTS_BY_SUBJECT, Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE } from '../data/q-counts.js';
import { hasNotes } from '../data/notes-registry.generated.js';
import { buildExamPool } from '../lib/exam-pool.js';
import { scopeForPhase, questionInScope } from '../lib/exam-scope.js';
import BackBar from '../components/BackBar.jsx';
import FeatureTip from '../components/FeatureTip.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { importFresh, isChunkLoadError } from '../lib/chunk-error.js';

// The printable page pulls in the share-card kit and its fonts, so it is its
// own chunk: warmed when this page is idle, loaded on the tap otherwise. The
// warm-up and the tap share one import, and a failed one is dropped so the
// next try fetches again.
let sheetModule = null;
function loadSheet() {
  if (!sheetModule) {
    sheetModule = importFresh(() => import('../components/TimetableSheet.jsx'))
      .catch((err) => { sheetModule = null; throw err; });
  }
  return sheetModule;
}

// What a tap that could not open the sheet leaves on the page, in place of
// the sheet: the page and its exam cards stay, and the wording follows the
// connection while it shows. A retry fetches the sheet afresh where the
// browser allows it (chunk-error.js importFresh), but WebKit keeps a failed
// import, as Chromium does for a piece the sheet shares with other screens, so
// a second failure while online offers to load the page again (nothing on
// this page is lost by it).
function SheetFailure({ error, repeated, onRetry }) {
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine !== false);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine !== false);
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);
  const chunk = isChunkLoadError(error);
  const reload = chunk && online && repeated;
  const text = !chunk
    ? 'เปิดตารางสอบฉบับพิมพ์ไม่สำเร็จ กดลองอีกครั้ง'
    : !online
      ? 'ยังไม่ได้ต่ออินเทอร์เน็ต จึงเปิดตารางสอบฉบับพิมพ์ไม่ได้ ต่ออินเทอร์เน็ตแล้วกดลองอีกครั้ง'
      : reload
        ? 'ยังโหลดตารางสอบฉบับพิมพ์ไม่ได้ โหลดหน้านี้ใหม่แล้วลองอีกครั้ง'
        : 'โหลดตารางสอบฉบับพิมพ์ไม่สำเร็จ กดลองอีกครั้ง';
  return (
    <div role="alert" className="vmx-timetable-failed" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, margin: '0 0 14px', padding: '10px 12px', borderRadius: 8, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', fontSize: 14, color: 'var(--clr-ink)', lineHeight: 1.6 }}>
      <span style={{ flex: '1 1 16em', minWidth: 0 }}>{text}</span>
      {reload && <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => window.location.reload()}>โหลดหน้านี้ใหม่</button>}
      <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onRetry}>ลองอีกครั้ง</button>
    </div>
  );
}

export default function ScheduleView({ goHome, setSubject, setTopic, setMode, setView, setPracticeMode, setSelectedPhase, selectedYear = 4, selectedPhase, customQuestions = [] }) {
  const [showPast, setShowPast] = useState(false);
  // The period is read on the tap, so a page left open past midnight prints today's date.
  const [printTable, setPrintTable] = useState(null);
  // React.lazy keeps a rejected import for good, so a failed sheet is given a
  // fresh lazy component on the next try.
  const [TimetableSheet, setTimetableSheet] = useState(() => lazy(loadSheet));
  const [sheetFailure, setSheetFailure] = useState(null);
  // Failed opens since the sheet last opened.
  const [sheetFailures, setSheetFailures] = useState(0);
  const openSheet = () => {
    if (sheetFailure) {
      setTimetableSheet(() => lazy(loadSheet));
      setSheetFailure(null);
    }
    setPrintTable(examTimetable(selectedYear));
  };
  const [, setTick] = useState(0);
  const yearKey = `y${selectedYear}`;
  const allExams = getUpcomingExams(yearKey);
  const hasImminent = allExams.some((e) => e.daysLeft <= 1 && e.daysLeft >= 0 && shortCountdown(e));
  useEffect(() => {
    if (!hasImminent) return;
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, [hasImminent]);
  // Warm the sheet while the page is idle, as lazy-views.js warms the offline
  // game: the worker's cache then has it for a tap made offline later. Never
  // while offline or saving data, where it would only cache a failure.
  useEffect(() => {
    if (typeof window === 'undefined' || navigator.connection?.saveData) return undefined;
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cic = window.cancelIdleCallback || clearTimeout;
    const id = ric(() => {
      if (navigator.onLine === false || navigator.connection?.saveData) return;
      loadSheet().catch(() => {});
    }, { timeout: 5000 });
    return () => cic(id);
  }, []);
  const pastCount = allExams.filter((e) => e.daysLeft < 0).length;
  const exams = showPast ? allExams : allExams.filter((e) => e.daysLeft >= 0);

  const hasQuestions = (subjId, phase = selectedPhase) => {
    if (((Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE[phase] || Q_VISIBLE_COUNTS_BY_SUBJECT)[subjId] || 0) > 0) return true;
    if (!customQuestions.length) return false;
    const pool = buildExamPool({ questions: customQuestions, subject: subjId, topic: null,
      practiceMode: 'all', questionCategory: 'all', selectedYear, selectedPhase: phase });
    // The engine may return another paper to avoid an empty named-subject
    // set. A timetable paper must only advertise its own usable content.
    return pool.some(question => questionInScope(question, scopeForPhase(phase)));
  };
  const hasContent = (subjId, phase = selectedPhase) => hasQuestions(subjId, phase) || hasNotes(subjId);
  const examPhase = (exam) => exam.term === 'midterm' || exam.term === 'final'
    ? `${SEMESTER.id.split('-')[1]}-${exam.term === 'midterm' ? 'mid' : 'final'}`
    : selectedPhase;

  const openSubject = (subjId, phase = selectedPhase) => {
    if (!hasContent(subjId, phase)) return;
    setSubject(subjId);
    // Clear the topic with the subject. A topic belongs to whichever subject
    // was open before, so carrying it into a different subject filters the
    // pool down to nothing while the screen still offers to start.
    if (setTopic) setTopic(null);
    // A named paper owns its scope, even if the header still shows another.
    if (phase !== selectedPhase) setSelectedPhase?.(phase);
    setPracticeMode('all');
    setMode('quick');
    setView(hasQuestions(subjId, phase) ? 'config' : 'notes');
  };

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>ตาราง<em>เรียนและสอบ</em></h1>
        <p>
          {/* The year whose papers are listed below, not the cohort's own year:
              "Vet 86 = ชั้นปีที่ 5" above a year-4 table read as a mistake. */}
          {SEMESTER.labelTh}, ตารางชั้นปีที่ {selectedYear}, {SEMESTER.midtermPeriod.labelTh}, {SEMESTER.finalPeriod.labelTh}
        </p>
      </div>

      {allExams.some((e) => e.daysLeft >= 0 && hasQuestions(e.subject, examPhase(e))) && <FeatureTip id="schedule" />}
      {/* วันนี้เรียนอะไร — the question students open this page for */}
      <WeekTimetable
        year={selectedYear}
        onOpenSubject={(subjId) => openSubject(subjId)}
        hasContent={hasContent}
      />

      <AcademicCalendar year={selectedYear} />

      <div className="vmx-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span>ตารางสอบ ปี {selectedYear} ({exams.length})</span>
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {allExams.length > 0 && (
            <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={openSheet}>
              ดาวน์โหลดตารางสอบ
            </button>
          )}
          {pastCount > 0 && (
            <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setShowPast(!showPast)}>
              {showPast ? `ซ่อนสอบที่ผ่านแล้ว (${pastCount})` : `แสดงสอบที่ผ่านแล้ว (${pastCount})`}
            </button>
          )}
        </span>
      </div>
      {/* Its own boundary, as ResultsView keeps one round its 3D viewer: a
          sheet that fails to load or draw leaves a note here, never the
          whole page's error card in place of the timetable. */}
      {printTable && !sheetFailure && (
        <ErrorBoundary fallback={null} onError={(err) => { setSheetFailure(err); setSheetFailures((n) => n + 1); setPrintTable(null); }}>
          <Suspense fallback={null}>
            <TimetableSheet table={printTable} onClose={() => { setPrintTable(null); setSheetFailures(0); }} />
          </Suspense>
        </ErrorBoundary>
      )}
      {sheetFailure && <SheetFailure error={sheetFailure} repeated={sheetFailures > 1} onRetry={openSheet} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 30 }}>
        {exams.map((exam) => {
          const isPast = exam.daysLeft < 0;
          const isToday = exam.daysLeft === 0;
          const isUrgent = exam.daysLeft > 0 && exam.daysLeft <= 7;
          const phase = examPhase(exam);
          const canPractice = hasQuestions(exam.subject, phase);
          return (
            // A past paper used to fade to half opacity, which took its text
            // under the contrast floor; it now reads at full ink on a quieter
            // card, with "ผ่านแล้ว" in the date tile saying why.
            <div key={exam.id} className={`vmx-dash-card vmx-exam-card${isPast ? ' is-past' : ''}`} style={{
              borderLeft: `4px solid ${exam.color}`,
              position: 'relative',
            }}>
              {/* Date tile beside the details on every width: wrapping it onto
                  its own row left a phone-wide gap beside a 90px tile. */}
              <div className="vmx-exam-row">
                {/* Date block */}
                <div className="vmx-exam-date" style={{
                  background: isUrgent ? 'var(--clr-rose-soft)' : 'var(--clr-surface-2)',
                  border: `1px solid ${isUrgent ? 'var(--clr-rose)' : 'var(--clr-border)'}`,
                }}>
                  <div className="vmx-exam-date-month">
                    {new Date(exam.date).toLocaleDateString('th-TH', { month: 'short' })}
                  </div>
                  <div className="vmx-exam-date-day">
                    {new Date(exam.date).getDate()}
                  </div>
                  <div className="vmx-exam-date-left">
                    {(() => {
                      if (isPast) return 'ผ่านแล้ว';
                      const cd = shortCountdown(exam);
                      if (cd) return cd.text;
                      if (isToday) return 'วันนี้!';
                      return `อีก ${exam.daysLeft} วัน`;
                    })()}
                  </div>
                </div>

                {/* Info */}
                <div className="vmx-exam-info">
                  <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--vmx-display)', fontWeight: 600, fontSize: 18 }}>
                    {exam.icon} {examTitle(exam)}
                    {exam.weight_pct && <span style={{ fontSize: 14, color: 'var(--clr-ink-soft)', fontWeight: 400, marginLeft: 8 }}>{exam.weight_pct}%</span>}
                  </h2>
                  <div className="vmx-exam-meta">
                    {exam.term && (
                      <span style={{ color: exam.term === 'midterm' ? 'var(--clr-gold-text)' : 'var(--clr-sage-text)', fontWeight: 600 }}>
                        {exam.term === 'midterm' ? 'กลางภาค' : 'ปลายภาค'}
                      </span>
                    )}
                    <span>{exam.code}</span>
                    <span>{fmtThaiDate(exam.date)}</span>
                    <span>{exam.time}</span>
                    <span>{exam.location}</span>
                    {exam.credits != null && <span>{exam.credits} หน่วยกิต</span>}
                  </div>
                  {/* Older entries carry a hand-written content outline; the
                      officially-published schedule rows don't, so this stays optional
                      rather than assuming the field exists. */}
                  {exam.content?.length > 0 && (
                    <div style={{ fontSize: 14, color: 'var(--clr-ink)', marginBottom: 8 }}>
                      <strong>เนื้อหา:</strong>
                      <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                        {exam.content.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {exam.notes && (
                    <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)', marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <span className="vmx-kicker" style={{ color: 'var(--clr-ink)', flexShrink: 0 }}>จุดเน้น:</span>
                      <span>{exam.notes}</span>
                    </div>
                  )}

                  {/* External links — e.g. shared Google Doc with collected past papers */}
                  {Array.isArray(exam.links) && exam.links.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {exam.links.map((lnk, i) => (
                        <a key={i} href={lnk.url} target="_blank" rel="noopener noreferrer" className="vmx-exam-link"
                          style={{ borderRadius: 999, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', color: 'var(--clr-ink)', textDecoration: 'none' }}>
                          {lnk.label} ↗
                        </a>
                      ))}
                    </div>
                  )}

                  {!isPast && (
                    hasContent(exam.subject, phase) ? (
                      <button className="vmx-btn vmx-btn-primary vmx-btn-sm" style={{ marginTop: 12 }}
                        onClick={() => openSubject(exam.subject, phase)}>
                        {canPractice ? 'ฝึกข้อสอบวิชานี้ →' : 'อ่านสรุปวิชานี้ →'}
                      </button>
                    ) : (
                      <div style={{ marginTop: 12, fontSize: 14, color: 'var(--clr-ink-soft)', padding: '8px 12px', background: 'var(--clr-surface-2)', borderRadius: 8, display: 'inline-block' }}>
                        ยังไม่มีข้อสอบสำหรับช่วงสอบนี้ในแอป
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 14, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        <strong>คำแนะนำ:</strong> เลือกวิชาเพื่อฝึกตามช่วงสอบ หรือเปิดสรุปที่มีให้อ่าน<br/>
        ข้อมูลตารางอาจเปลี่ยนแปลง — เช็กกับเพื่อนในห้องอีกครั้งก่อนสอบ<br/>
        หากข้อมูลผิดหรือล้าสมัย → ส่งไปที่ <button type="button" className="vmx-inline-action vmx-schedule-report" onClick={() => setView('feedback')}>ฟอร์มแจ้ง</button>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
