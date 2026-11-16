import { Suspense, useEffect, useRef, useState } from 'react';
import { lazyWithRetry } from '../lib/lazy-retry.js';
import {
  CLASS_TIMETABLE, EXAM_SCHEDULE, SEMESTER, examTitle, fmtThaiDate, getTopMilestone, getUpcomingEvents, getUpcomingExams,
  shortCountdown, examEndMs, termPhase,
} from '../data/schedule.js';
import { examTimetable } from '../lib/exam-timetable.js';
import { courseDocs, syllabusDoc, teachingDoc } from '../lib/course-docs.js';
import WeekTimetable from '../components/WeekTimetable.jsx';
import AcademicCalendar from '../components/AcademicCalendar.jsx';
// Phase 2 perf: use precomputed counts instead of QB. ScheduleView
// only asks "does this paper have usable Qs?" — a boolean lookup against
// the tiny q-counts.js file. Saves dragging the full QB into this
// view's load graph.
import { Q_VISIBLE_COUNTS_BY_SUBJECT, Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE } from '../data/q-counts.js';
import { hasNotes } from '../data/notes-registry.generated.js';
import { buildExamPool } from '../lib/exam-pool.js';
import { EXAM_SCOPE_LABEL, scopeForPhase, questionInScope } from '../lib/exam-scope.js';
import BackBar from '../components/BackBar.jsx';
import FeatureTip from '../components/FeatureTip.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { importFresh, isChunkLoadError } from '../lib/chunk-error.js';
import '../styles-schedule.css';

// The page, top to bottom (styles-schedule.css):
//   the classes of the day in question, with the week one tap away
//   the next paper as the one card, with the page's one filled button
//   the other papers as rows: date, course, days left, when and where, nothing to press
//   one group of rows for what is opened now and then, each mounted when it is opened
// In an exam period the classes are off, so the papers come first and the line
// saying so goes to the end.

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
// the sheet: the page and its exam rows stay, and the wording follows the
// connection while it shows. A retry fetches the sheet afresh where the
// browser allows it (chunk-error.js importFresh), but WebKit keeps a failed
// import, as Chromium does for a piece the sheet shares with other screens, so
// a second failure while online offers to load the page again (nothing on
// this page is lost by it).
function SheetFailure({ error, repeated, onRetry, what = 'ตารางสอบฉบับพิมพ์' }) {
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
    ? `เปิด${what}ไม่สำเร็จ กดลองอีกครั้ง`
    : !online
      ? `ยังไม่ได้ต่ออินเทอร์เน็ต จึงเปิด${what}ไม่ได้ ต่ออินเทอร์เน็ตแล้วกดลองอีกครั้ง`
      : reload
        ? `ยังโหลด${what}ไม่ได้ โหลดหน้านี้ใหม่แล้วลองอีกครั้ง`
        : `โหลด${what}ไม่สำเร็จ กดลองอีกครั้ง`;
  return (
    <div role="alert" className="vmx-timetable-failed">
      <span>{text}</span>
      {reload && <button type="button" className="vmx-btn vmx-btn-primary vmx-btn-sm" onClick={() => window.location.reload()}>โหลดหน้านี้ใหม่</button>}
      <button type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={onRetry}>ลองอีกครั้ง</button>
    </div>
  );
}

// A row that opens in place: a native disclosure whose body is mounted once
// it is open, so a shut row costs the page its own line and nothing more.
// What a tap opened is brought into view when part of it would sit under the
// bottom bar: as little movement as shows it, and none when it already fits
// (the stylesheet keeps the row clear of the bar).
function Fold({ title, sub, subClass = '', note, children }) {
  const [open, setOpen] = useState(false);
  const row = useRef(null);
  useEffect(() => {
    if (!open || !row.current?.scrollIntoView) return;
    const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    row.current.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
  }, [open]);
  return (
    <details ref={row} className="vmx-sched-fold" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        {/* The row is a span of its own: older WebKit lays a flex summary out as a block. */}
        <span className="vmx-sched-fold-row">
          <span className="vmx-sched-fold-title">
            {title}
            {sub && <span className={`vmx-sched-fold-sub${subClass}`}>{sub}</span>}
          </span>
          {note && <span className="vmx-sched-fold-note">{note}</span>}
        </span>
      </summary>
      {open && <div className="vmx-sched-fold-body">{children}</div>}
    </details>
  );
}

export default function ScheduleView({ goHome, setSubject, setTopic, setMode, setView, setPracticeMode, setSelectedPhase, selectedYear = 4, selectedPhase, customQuestions = [] }) {
  // The period is read on the tap, so a page left open past midnight prints today's date.
  const [printTable, setPrintTable] = useState(null);
  // React.lazy keeps a rejected import for good, so a failed sheet is given a
  // fresh lazy component on the next try.
  const [TimetableSheet, setTimetableSheet] = useState(() => lazyWithRetry(loadSheet));
  const [sheetFailure, setSheetFailure] = useState(null);
  // Failed opens since the sheet last opened.
  const [sheetFailures, setSheetFailures] = useState(0);
  // What the last tap opened, so a retry opens the same page, and the sheet's
  // loading line or failure note shows beside the control that was tapped.
  const [lastOpen, setLastOpen] = useState(null);
  const openPage = (build, what, where = 'exams') => {
    if (sheetFailure) {
      setTimetableSheet(() => lazyWithRetry(loadSheet));
      setSheetFailure(null);
    }
    setLastOpen({ build, what, where });
    setPrintTable(build());
  };
  const openSheet = () => openPage(() => examTimetable(selectedYear), 'ตารางสอบฉบับพิมพ์');
  const docs = courseDocs(selectedYear);
  // Where a tap's sheet is mounted: its own boundary, as ResultsView keeps
  // one round its 3D viewer, so a sheet that fails to load or draw leaves a
  // note here, never the whole page's error card in place of the timetable.
  // While its chunk is on the way the line says so (drawn only when that takes
  // a moment: styles-schedule.css).
  const sheetSlot = (where) => (
    <>
      {printTable && !sheetFailure && (lastOpen?.where || 'exams') === where && (
        <ErrorBoundary fallback={null} onError={(err) => { setSheetFailure(err); setSheetFailures((n) => n + 1); setPrintTable(null); }}>
          <Suspense fallback={<p role="status" className="vmx-sched-opening">กำลังเปิด{lastOpen?.what}…</p>}>
            <TimetableSheet table={printTable} onClose={() => { setPrintTable(null); setSheetFailures(0); }} />
          </Suspense>
        </ErrorBoundary>
      )}
      {sheetFailure && (lastOpen?.where || 'exams') === where && (
        <SheetFailure error={sheetFailure} repeated={sheetFailures > 1} what={lastOpen?.what}
          onRetry={() => (lastOpen ? openPage(lastOpen.build, lastOpen.what, lastOpen.where) : openSheet())} />
      )}
    </>
  );
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
  // A paper is sat once it has ended, not once its day has: at 16:00 the
  // 13:00-15:00 paper still read วันนี้ over its practice button until midnight.
  const nowMs = Date.now();
  const isOver = (e) => e.daysLeft < 0 || (e.daysLeft === 0 && examEndMs(e) <= nowMs);
  const upcoming = allExams.filter((e) => !isOver(e));
  const past = allExams.filter(isOver);
  const next = upcoming[0] || null;
  const rest = upcoming.slice(1);

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

  // A paper's day as a calendar leaf: the month in Thai (พ.ย.), not "NOV" in
  // the mono face, over the day the row names in every zone ('YYYY-MM-DD'
  // parses as UTC midnight, the previous evening west of Greenwich).
  const dateLeaf = (exam) => (
    <div className="vmx-sched-date">
      <span className="vmx-exam-date-month">{new Date(exam.date).toLocaleDateString('th-TH', { month: 'short', timeZone: 'UTC' })}</span>
      <span className="vmx-exam-date-day">{new Date(exam.date).getUTCDate()}</span>
    </div>
  );
  // When and where, each pair kept whole: "อังคาร 13:00-16:00", then the room.
  const whenWhere = (exam) => (
    <>
      <span className="vmx-sched-nowrap">{fmtThaiDate(exam.date).split(' ')[0]} {exam.time}</span>
      {exam.location && <>, <span className="vmx-sched-nowrap">{exam.location}</span></>}
    </>
  );
  // What a row holds beyond its date and place. Older entries carry a
  // hand-written content outline, a remark or a link to shared past papers;
  // the officially published rows do not, so every part stays optional. A
  // paper already sat also says which paper it was and its course code.
  const extras = (exam, record) => {
    const facts = record ? [
      exam.term && EXAM_SCOPE_LABEL[exam.term],
      exam.code,
      exam.credits != null && `${exam.credits} หน่วยกิต`,
      exam.weight_pct && `คะแนน ${exam.weight_pct}%`,
    ].filter(Boolean) : [];
    return (
      <>
        {facts.length > 0 && <p className="vmx-sched-extra">{facts.join(', ')}</p>}
        {exam.content?.length > 0 && (
          <ul className="vmx-sched-outline">
            {exam.content.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        )}
        {exam.notes && <p className="vmx-sched-extra">หมายเหตุ: {exam.notes}</p>}
        {Array.isArray(exam.links) && exam.links.length > 0 && (
          <div className="vmx-sched-links">
            {exam.links.map((lnk, i) => (
              <a key={i} href={lnk.url} target="_blank" rel="noopener noreferrer" className="vmx-exam-link">{lnk.label} ↗</a>
            ))}
          </div>
        )}
      </>
    );
  };
  // How far off a paper is: hours inside a day and a half (schedule.js
  // shortCountdown), else whole days. `near` is that last stretch.
  const timeLeft = (exam) => {
    const near = shortCountdown(exam);
    return { near: !!near, text: near ? near.text : exam.daysLeft === 0 ? 'วันนี้' : `อีก ${exam.daysLeft} วัน` };
  };
  const paperLabel = (exam, withTerm) => `${examTitle(exam)}${withTerm && exam.term ? ` ${EXAM_SCOPE_LABEL[exam.term]}` : ''}`;

  // The next paper: the one card, and its button is the page's only filled one.
  const paperCard = (exam) => {
    const phase = examPhase(exam);
    const left = timeLeft(exam);
    return (
      <article key={exam.id} className="vmx-dash-card vmx-exam-card vmx-sched-next">
        <div className="vmx-sched-next-top">
          {dateLeaf(exam)}
          <div className="vmx-sched-next-main">
            <h2 className="vmx-sched-next-title">{examTitle(exam)}</h2>
            <p className="vmx-sched-fact">{whenWhere(exam)}</p>
            <p className={`vmx-sched-left${left.near ? ' is-near' : ''}`}>{left.text}</p>
            {extras(exam, false)}
          </div>
        </div>
        {hasContent(exam.subject, phase) ? (
          <button type="button" className="vmx-btn vmx-btn-primary vmx-sched-go" onClick={() => openSubject(exam.subject, phase)}>
            {hasQuestions(exam.subject, phase) ? 'ฝึกข้อสอบวิชานี้' : 'อ่านสรุปวิชานี้'}
          </button>
        ) : (
          <p className="vmx-sched-none">ยังไม่มีข้อสอบสำหรับช่วงสอบนี้ในแอป</p>
        )}
      </article>
    );
  };
  // Every other paper: one row. A past paper keeps full ink (it used to fade
  // to half opacity, under the contrast floor) and sits behind its own row.
  const paperRow = (exam) => {
    const isPast = isOver(exam);
    const left = isPast ? null : timeLeft(exam);
    return (
      <li key={exam.id} className={`vmx-exam-card vmx-sched-row${isPast ? ' is-past' : ''}`}>
        {dateLeaf(exam)}
        <div className="vmx-sched-row-main">
          <span className="vmx-sched-row-top">
            <span className="vmx-sched-row-title">{examTitle(exam)}</span>
            {left && <span className={`vmx-sched-row-left${left.near ? ' is-near' : ''}`}>{left.text}</span>}
          </span>
          <p className="vmx-sched-row-meta">{whenWhere(exam)}</p>
          {extras(exam, isPast)}
        </div>
      </li>
    );
  };

  // The other papers a tap can start: one button each, named by its course
  // (and by its paper when the list holds two papers of one course).
  const pickable = rest.filter((exam) => hasContent(exam.subject, examPhase(exam)));
  const twoTerms = new Set(upcoming.map((exam) => exam.term)).size > 1;

  const inClassWeek = termPhase().phase === 'classes';
  const week = (
    <WeekTimetable
      year={selectedYear}
      onOpenSubject={(subjId) => openSubject(subjId)}
      hasContent={hasContent}
    />
  );
  const hasTimetable = allExams.length > 0 || (CLASS_TIMETABLE[yearKey] || []).length > 0 || docs.length > 0;

  // The registration row's own line: the nearest announced event, else the
  // window that closes first (schedule.js getTopMilestone).
  const event = getUpcomingEvents(selectedYear, 14)[0];
  const milestone = getTopMilestone();
  const calendarLine = event
    ? `${event.titleTh}, ${event.daysLeft === 0 ? 'วันนี้' : event.daysLeft === 1 ? 'พรุ่งนี้' : `อีก ${event.daysLeft} วัน`}`
    : milestone
      ? `${milestone.shortTh} ${milestone.active
        ? (milestone.daysLeftToEnd === 0 ? 'วันสุดท้ายวันนี้' : `เหลืออีก ${milestone.daysLeftToEnd} วัน`)
        : (milestone.daysLeft === 0 ? 'เริ่มวันนี้' : `เริ่มในอีก ${milestone.daysLeft} วัน`)}`
      : '';
  const lastDay = !event && milestone?.active && milestone.daysLeftToEnd === 0;

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero vmx-sched-hero">
        <h1>ตาราง<em>เรียนและสอบ</em></h1>
        {/* The year whose papers are listed below, not the cohort's own year:
            "Vet 86 = ชั้นปีที่ 5" above a year-4 table read as a mistake. */}
        <p>ชั้นปีที่ {selectedYear}, {SEMESTER.labelTh}</p>
      </div>

      <div className="vmx-sched">
        {/* วันนี้เรียนอะไร — the question students open this page for */}
        {inClassWeek && week}

        {allExams.length > 0 && (
          <section className="vmx-sched-papers" aria-labelledby="vmx-sched-papers-title">
            <p className="vmx-sched-label" id="vmx-sched-papers-title">{`ตารางสอบ${EXAM_SCOPE_LABEL[next?.term] || ''}`}</p>
            {next ? paperCard(next) : <p className="vmx-sched-done">สอบครบทุกวิชาในตารางแล้ว</p>}
            {upcoming.some((e) => hasQuestions(e.subject, examPhase(e))) && <FeatureTip id="schedule" />}
            {rest.length > 0 && (
              <ul className="vmx-sched-rows">
                {rest.map((exam, i) => [
                  exam.term && exam.term !== (i === 0 ? next.term : rest[i - 1].term)
                    ? <li key={`${exam.id}-paper`} className="vmx-sched-subhead">{`ตารางสอบ${EXAM_SCOPE_LABEL[exam.term]}`}</li>
                    : null,
                  paperRow(exam),
                ])}
              </ul>
            )}
          </section>
        )}

        {!hasTimetable && (
          <p className="vmx-sched-empty">
            <strong>ยังไม่มีตารางของชั้นปีที่ {selectedYear}</strong>
            <span>
              ตอนนี้มีตารางของชั้นปีที่ {Object.keys(EXAM_SCHEDULE).map((key) => key.slice(1)).sort().join(' และ ')}{' '}
              <button type="button" className="vmx-inline-action vmx-schedule-report" onClick={() => setView('feedback')}>ส่งตารางของชั้นปีนี้</button>
            </span>
          </p>
        )}

        <div className="vmx-sched-more">
          {pickable.length > 0 && (
            <Fold title="ฝึกวิชาอื่น" note={`${pickable.length} วิชา`}>
              <div className="vmx-sched-pick">
                {pickable.map((exam) => {
                  const phase = examPhase(exam);
                  return (
                    <button key={exam.id} type="button" className="vmx-btn vmx-btn-ghost vmx-btn-sm vmx-sched-go" onClick={() => openSubject(exam.subject, phase)}>
                      {paperLabel(exam, twoTerms)}{hasQuestions(exam.subject, phase) ? '' : ' (อ่านสรุป)'}
                    </button>
                  );
                })}
              </div>
            </Fold>
          )}
          {allExams.length > 0 && (
            <button type="button" className="vmx-sched-act" onClick={openSheet}>ดาวน์โหลดตารางสอบ</button>
          )}
          {sheetSlot('exams')}
          {past.length > 0 && (
            <Fold title="สอบที่ผ่านแล้ว" note={`${past.length} วิชา`}>
              <ul className="vmx-sched-rows">{past.map(paperRow)}</ul>
            </Fold>
          )}
          {docs.length > 0 && (
            <section aria-label={`ประมวลรายวิชาและตารางสอน ปี ${selectedYear}`}>
              <Fold title="ประมวลรายวิชาและตารางสอน" note={`${docs.length} วิชา`}>
                <p className="vmx-sched-fold-lede">ฉบับอ่านง่าย เปิดแล้วดาวน์โหลดเป็น PDF หรือรูปได้</p>
                {sheetSlot('docs')}
                <ul className="vmx-sched-docs">
                  {docs.map((d) => (
                    <li key={d.subject} className="vmx-sched-doc">
                      <span className="vmx-sched-doc-name">{d.nameTh}<span className="vmx-sched-doc-code">{d.code}</span></span>
                      <span className="vmx-sched-doc-links">
                        <button type="button" className="vmx-sched-doc-open" aria-label={`ประมวลรายวิชา ${d.nameTh}`}
                          onClick={() => openPage(() => syllabusDoc(d.subject, selectedYear), 'ประมวลรายวิชาฉบับพิมพ์', 'docs')}>
                          ประมวลรายวิชา
                        </button>
                        <button type="button" className="vmx-sched-doc-open" aria-label={`ตารางสอน ${d.nameTh}`}
                          onClick={() => openPage(() => teachingDoc(d.subject, selectedYear), 'ตารางสอนฉบับพิมพ์', 'docs')}>
                          ตารางสอน
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </Fold>
            </section>
          )}
          <Fold title="ปฏิทินลงทะเบียนและชำระเงิน" sub={calendarLine} subClass={lastDay ? ' is-last-day' : ''}>
            <AcademicCalendar year={selectedYear} />
          </Fold>
        </div>

        {!inClassWeek && week}

        {hasTimetable && (
          <p className="vmx-sched-foot">
            ตารางอาจเปลี่ยน เช็กกับเพื่อนในห้องอีกครั้งก่อนสอบ{' '}
            <button type="button" className="vmx-inline-action vmx-schedule-report" onClick={() => setView('feedback')}>แจ้งข้อมูลผิด</button>
          </p>
        )}
      </div>
    </>
  );
}
