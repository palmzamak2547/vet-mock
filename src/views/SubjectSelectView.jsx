import { useEffect, useMemo, useState } from 'react';
import { QB, isQBYearLoaded, isQBFullyLoaded } from '../data/questions.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, YEARS, visibleQuestionCount, announced } from '../data/curriculum.js';
import { hasNotes } from '../data/notes-registry.generated.js';
import BackBar from '../components/BackBar.jsx';
import { librarySubjectCounts } from '../lib/library.js';
import { computeSubjectProgress } from '../lib/subject-progress.js';

export default function SubjectSelectView({ setSubject, setTopic, setView, setPracticeMode, goHome, mode, customQuestions = [], selectedYear, qbReady = true, history = [] }) {
  const allQuestions = [...QB, ...customQuestions];
  const [searchQuery, setSearchQuery] = useState('');
  // Real documents per subject — a scaffold-year card with zero questions
  // but a full shelf opens the shelf instead of dead-ending. Fetched only
  // when this view actually shows a scaffold year.
  const [docCounts, setDocCounts] = useState(null);
  // QB is lazy-loaded and mutated in place, so on a slow connection this
  // view used to render EVERY subject as "🚧 รอข้อสอบเพิ่ม" and disabled —
  // telling a first-time user the whole curriculum is empty. Loading and
  // genuinely-empty are different states and must look different.
  // ...and also while the SELECTED year's banks are still arriving: after
  // the first year lands QB is never empty again, so the old guard read every
  // subject of a newly picked year as "ยังไม่มีเนื้อหา" (card disabled) until
  // that year's chunks finished downloading. Scaffold years have no banks to
  // wait for.
  const yearIsScaffold = !!YEARS.find((y) => y.id === selectedYear)?.scaffold;
  const qbLoading = (!qbReady && QB.length === 0)
    || (Number.isFinite(selectedYear) && !yearIsScaffold && !isQBYearLoaded(selectedYear) && !isQBFullyLoaded());

  // Per-subject coverage — "เรียนวิชานี้ไปกี่ %". Memoised on the same
  // inputs HomeView uses; the bank lazy-loads in place, so QB.length is
  // the real "pool changed" signal (eslint-disabled like Home's presets).
  const progressBySubject = useMemo(
    () => computeSubjectProgress({ history, allQuestions: QB, customQuestions }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, customQuestions, QB.length],
  );

  // One count per subject per bank change. The render body used to call
  // visibleQuestionCount — a full scan of the bank — for every card on
  // every keystroke in the search box.
  const countBySubject = useMemo(() => {
    const m = new Map();
    for (const s of SUBJECTS) {
      if (s.id === 'all') continue;
      m.set(s.id, visibleQuestionCount(s.id, allQuestions));
    }
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customQuestions, QB.length]);

  // Filter subjects to selectedYear (or show all if no year selected — for
  // legacy "all subjects" flow).
  //
  // Year-agnostic (2026-05-30 architecture pass): the "รวมทุกวิชา" (all)
  // card is shown for ANY year that actually has questions — not hardcoded
  // to Y4. As Y1-3/5/6 banks land, their year picks up the all-card
  // automatically. Scaffold/empty years show their subject structure
  // (each disabled via visibleQuestionCount = 0) without an all-card that
  // would lead into an empty exam.
  const yearMeta = YEARS.find((y) => y.id === selectedYear);
  const isScaffoldYear = !!yearMeta?.scaffold;
  useEffect(() => {
    // Unconditional: this used to run only for scaffold YEARS, so the day
    // ปี 3 went live with one filled subject, its 18 empty subjects lost
    // the shelf hand-off and turned into dead "รอเติมเนื้อหา" tiles while
    // the Home grid (which always fetches) kept offering the documents.
    // One session-cached catalog fetch — same cache Home uses.
    let alive = true;
    librarySubjectCounts().then((m) => { if (alive) setDocCounts(m); });
    return () => { alive = false; };
  }, []);
  const yearSubjects = selectedYear
    ? (SUBJECTS_BY_YEAR[selectedYear] || [])
    : [];
  const yearHasQuestions = yearSubjects.some((s) => s.has_questions);
  const baseSubjects = useMemo(() => (
    selectedYear
      ? (yearHasQuestions
          ? [SUBJECTS.find((s) => s.id === 'all'), ...yearSubjects].filter(Boolean)
          : yearSubjects)
      : SUBJECTS
  ), [selectedYear, yearHasQuestions, yearSubjects]);
  const indexedSubjects = useMemo(() => baseSubjects.map((item) => ({
    item,
    searchText: `${item.name || ''} ${item.name_en || ''} ${item.code || ''}`.toLowerCase(),
  })), [baseSubjects]);
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleSubjects = indexedSubjects
    .filter(({ item, searchText }) => !normalizedSearch || item.id === 'all' || searchText.includes(normalizedSearch))
    .map(({ item }) => item);

  // Year and term are the layer a student thinks in — "ปี 2 เทอม 1" is one
  // shelf, not thirteen loose subjects. The whole-year card and the handful of
  // subjects that run across both terms sit outside the split rather than
  // being filed under a term they do not belong to.
  const subjectGroups = useMemo(() => {
    const bySemester = new Map();
    const unsorted = [];
    for (const s of visibleSubjects) {
      if (s.id === 'all' || !s.semester) { unsorted.push(s); continue; }
      if (!bySemester.has(s.semester)) bySemester.set(s.semester, []);
      bySemester.get(s.semester).push(s);
    }
    const groups = [];
    if (unsorted.length) groups.push({ key: 'any', label: null, items: unsorted });
    for (const sem of [...bySemester.keys()].sort()) {
      groups.push({ key: `sem${sem}`, label: `เทอม ${sem}`, items: bySemester.get(sem) });
    }
    // One unlabelled group when nothing splits — a lone "เทอม 1" header over
    // every subject is noise, not structure.
    return groups.length === 1 ? [{ ...groups[0], label: null }] : groups;
  }, [visibleSubjects]);

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>
          เลือก <em>วิชา</em>
          {yearMeta && (
            <span style={{ fontSize: '0.55em', marginLeft: 12, color: 'var(--clr-ink-soft)', verticalAlign: 'middle' }}>
             , {yearMeta.label}
            </span>
          )}
        </h1>
        <p>
          {isScaffoldYear ? (
            <>
              <strong>{yearMeta.label}</strong>, {yearMeta.desc} — วิชาที่มีชั้นเอกสารเปิดอ่านได้เลย ข้อสอบกำลังทยอยเพิ่ม
            </>
          ) : mode === 'exam' ? (
            'จำลองสนามสอบ — ตั้งค่าจำนวนข้อและเวลาได้ในขั้นถัดไป'
          ) : (
            'ฝึกแบบเลือกจำนวน — สุ่มข้อสอบตามจำนวนที่เลือก'
          )}
        </p>
      </div>

      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <input
          type="text"
          aria-label="ค้นหาวิชา"
          placeholder="ค้นหาวิชา (ชื่อวิชา, รหัสวิชา)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="vmx-input"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', fontSize: 16 }}
        />
      </div>

      {visibleSubjects.length === 0 && (
        <div className="vmx-subject-grid">
          <div className="vmx-empty" style={{ gridColumn: '1 / -1' }}>ไม่พบวิชาที่ค้นหา</div>
        </div>
      )}

      {subjectGroups.map((group) => (
        <div key={group.key}>
          {group.label && (
            <div style={{
              margin: '20px 20px 8px', display: 'flex', alignItems: 'baseline', gap: 10,
              fontSize: 13, fontFamily: 'var(--vmx-mono)', letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--clr-ink-soft)',
            }}>
              <span>{group.label}</span>
              <span style={{ flex: 1, height: 1, background: 'var(--clr-border)' }} />
              <span style={{ fontSize: 11 }}>{group.items.length} วิชา</span>
            </div>
          )}
          <div className="vmx-subject-grid">
            {group.items.map((s) => {
          // Count only Qs in non-hidden topics — matches what user
          // actually sees in TopicSelectView (avoids "127 promised, 70
          // visible" confusion). For 'all' subject, sum visible per
          // subject across the bank.
          // The all-card counts this year only, matching the pool the exam
          // will actually draw from.
          const count = s.id === 'all' && selectedYear
            ? yearSubjects.reduce((n, y) => n + (countBySubject.get(y.id) ?? 0), 0)
            : (countBySubject.get(s.id) ?? visibleQuestionCount(s.id, allQuestions));
          // A subject with notes and no questions is still worth opening —
          // this selector is also where the Notes feature lands, and gating
          // it on the question count locked students out of written material
          // that was sitting right there.
          const subjectHasNotes = hasNotes(s.id);
          const isEmpty = count === 0 && !subjectHasNotes;
          const shelfDocs = isEmpty ? (docCounts?.get(s.id) || 0) : 0;

          return (
            <button
              key={s.id}
              className="vmx-subject-card"
              disabled={isEmpty && !qbLoading && shelfDocs === 0}
              onClick={() => {
                if (isEmpty && !qbLoading) {
                  if (shelfDocs > 0) {
                    // The shelf hand-off the AI search's course card uses.
                    try { sessionStorage.setItem('vmx-library-subject', s.id || ''); } catch { /* nicety */ }
                    setView('library');
                  }
                  return;
                }
                setSubject(s.id);
                setPracticeMode('all');
                if (setTopic) setTopic(null);
                // ถ้าวิชามี topics → ไป TopicSelectView ก่อน
                const hasTopics = Array.isArray(s.topics) && s.topics.length > 0;
                setView(hasTopics ? 'topic-select' : 'config');
              }}
              style={{
                opacity: qbLoading ? 0.75 : (isEmpty && shelfDocs === 0 ? 0.5 : 1),
                cursor: (isEmpty && !qbLoading && shelfDocs === 0) ? 'not-allowed' : 'pointer',
              }}
              title={qbLoading ? 'กำลังโหลดคลังข้อสอบ'
                : (shelfDocs > 0 ? `เปิดชั้นเอกสารจริงของวิชานี้ (${shelfDocs} ไฟล์)`
                  : (isEmpty ? 'ยังไม่มีเนื้อหาของวิชานี้ในแอป' : ''))}
            >
              <div className="accent" style={{ background: s.color }}></div>
              <div className="icon">{s.icon}</div>
              <div className="title">{s.name}</div>
              <div className="sub">{s.name_en}</div>
              <div className="count" style={{ color: (isEmpty && !qbLoading && shelfDocs === 0) ? 'var(--clr-rose-text)' : (shelfDocs > 0 ? 'var(--clr-sage-text)' : 'var(--clr-ink-soft)') }}>
                {qbLoading
                  ? 'กำลังโหลด…'
                  : count === 0 && subjectHasNotes
                    ? 'มีสรุปให้อ่าน'
                    : shelfDocs > 0
                      ? `เอกสารจริง ${shelfDocs} ไฟล์`
                      : isEmpty
                        ? 'ยังไม่มีเนื้อหา'
                        : `${count} ข้อ`}
              </div>
              {/* Drop the 7-digit course code on the card — already
                  searchable via ⌘K; redundant visual noise here. */}
              {false && s.code && s.id !== 'all' && (
                <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', opacity: 0.7, marginTop: 2 }}>
                  {s.code}
                </div>
              )}
              {/* Coverage mini-bar — how much of this subject's practice
                  pool the student has answered at least once. Sits with
                  the count it explains; hidden while the bank loads or
                  when nothing has been answered yet. */}
              {(() => {
                const cov = progressBySubject[s.id];
                if (qbLoading || !cov || cov.covered === 0 || cov.total === 0 || isEmpty) return null;
                return (
                  <div
                    title={`เรียนไปแล้ว ${cov.covered}/${cov.total} ข้อ (${cov.pct}%)`}
                    style={{ marginTop: 6, height: 4, borderRadius: 999, background: 'var(--clr-surface-2)', overflow: 'hidden' }}
                  >
                    <div style={{
                      width: `${cov.pct}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: cov.pct >= 80 ? 'var(--clr-sage)' : cov.pct >= 40 ? 'var(--clr-gold)' : 'var(--clr-rose)',
                      transition: 'width var(--dur) var(--ease-out)',
                    }} />
                  </div>
                );
              })()}
              {/* Only render the chip when there is something real to put in
                  it. Guarding on examFormat alone printed a bare "📝" (or
                  "📝 , 4 ช้อยส์") for every subject whose weighting is not
                  announced yet. */}
              {(() => {
                const w = s.examFormat && announced(s.examFormat.weight);
                const c = s.examFormat && s.examFormat.choiceCount;
                if (!w && !c) return null;
                return (
                  <div style={{
                    marginTop: 6,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: 'var(--clr-surface-2)',
                    fontSize: 11,
                    fontFamily: 'var(--vmx-mono)',
                    color: 'var(--clr-ink-soft)',
                    display: 'inline-block',
                    letterSpacing: '0.05em',
                  }}>
                    📝 {[w, c && `${c} ช้อยส์`].filter(Boolean).join(', ')}
                  </div>
                );
              })()}
            </button>
          );
            })}
          </div>
        </div>
      ))}

      {isScaffoldYear && (
        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
          <strong>ปีนี้กำลังวางโครงสร้าง</strong> — ข้อมูลรายวิชาและผู้สอนมาจากทะเบียนที่ตรวจสอบแล้ว<br/>
          ถ้ามีสไลด์ สรุป หรือข้อสอบเก่าที่ได้รับอนุญาต ส่งผ่านเมนู "แจ้งปัญหา" ได้เลย<br/>
          ชั้นปีที่มีคลังข้อสอบพร้อมใช้: {YEARS.filter((year) => !year.scaffold).map((year) => year.label).join(', ')}
        </div>
      )}

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← ย้อนกลับ</button>
      </div>
    </>
  );
}
