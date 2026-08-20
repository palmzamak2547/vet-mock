import { useMemo, useState } from 'react';
import { QB } from '../data/questions.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, YEARS, visibleQuestionCount } from '../data/curriculum.js';
import { hasNotes } from '../data/notes-registry.generated.js';
import BackBar from '../components/BackBar.jsx';

export default function SubjectSelectView({ setSubject, setTopic, setView, setPracticeMode, goHome, mode, customQuestions = [], selectedYear, qbReady = true }) {
  const allQuestions = [...QB, ...customQuestions];
  const [searchQuery, setSearchQuery] = useState('');
  // QB is lazy-loaded and mutated in place, so on a slow connection this
  // view used to render EVERY subject as "🚧 รอข้อสอบเพิ่ม" and disabled —
  // telling a first-time user the whole curriculum is empty. Loading and
  // genuinely-empty are different states and must look different.
  const qbLoading = !qbReady && QB.length === 0;

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
              🚧 <strong>{yearMeta.label}</strong>, {yearMeta.desc} — โครงสร้างวิชาวางไว้แล้ว, รอเติมข้อสอบ/เนื้อหาทีละวิชา
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
            ? yearSubjects.reduce((n, y) => n + visibleQuestionCount(y.id, allQuestions), 0)
            : visibleQuestionCount(s.id, allQuestions);
          // A subject with notes and no questions is still worth opening —
          // this selector is also where the Notes feature lands, and gating
          // it on the question count locked students out of written material
          // that was sitting right there.
          const subjectHasNotes = hasNotes(s.id);
          const isEmpty = count === 0 && !subjectHasNotes;
          const isScaffold = !!s.scaffold;

          return (
            <button
              key={s.id}
              className="vmx-subject-card"
              disabled={isEmpty && !qbLoading}
              onClick={() => {
                if (isEmpty && !qbLoading) return;
                setSubject(s.id);
                setPracticeMode('all');
                if (setTopic) setTopic(null);
                // ถ้าวิชามี topics → ไป TopicSelectView ก่อน
                const hasTopics = Array.isArray(s.topics) && s.topics.length > 0;
                setView(hasTopics ? 'topic-select' : 'config');
              }}
              style={{
                opacity: qbLoading ? 0.75 : (isEmpty ? 0.5 : 1),
                cursor: (isEmpty && !qbLoading) ? 'not-allowed' : 'pointer',
              }}
              title={qbLoading ? 'กำลังโหลดคลังข้อสอบ' : (isScaffold ? 'รอเติมเนื้อหา, ส่ง slide/notes มาช่วยได้' : (isEmpty ? 'ยังไม่มีข้อสอบในวิชานี้' : ''))}
            >
              <div className="accent" style={{ background: s.color }}></div>
              <div className="icon">{s.icon}</div>
              <div className="title">{s.name}</div>
              <div className="sub">{s.name_en}</div>
              <div className="count" style={{ color: (isEmpty && !qbLoading) ? 'var(--clr-rose-text)' : 'var(--clr-ink-soft)' }}>
                {qbLoading
                  ? 'กำลังโหลด…'
                  : count === 0 && subjectHasNotes
                    ? 'มีสรุปให้อ่าน'
                    : isScaffold
                      ? 'รอเติมเนื้อหา'
                      : isEmpty
                        ? '🚧 รอข้อสอบเพิ่ม'
                        : `${count} ข้อ`}
              </div>
              {/* Drop the 7-digit course code on the card — already
                  searchable via ⌘K; redundant visual noise here. */}
              {false && s.code && s.id !== 'all' && (
                <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', opacity: 0.7, marginTop: 2 }}>
                  {s.code}
                </div>
              )}
              {s.examFormat && (
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
                  📝 {s.examFormat.weight}
                  {s.examFormat.choiceCount && `, ${s.examFormat.choiceCount} ช้อยส์`}
                </div>
              )}
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
