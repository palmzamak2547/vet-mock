import { useState } from 'react';
import { QB } from '../data/questions.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, YEARS, visibleQuestionCount } from '../data/curriculum.js';
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
  const baseSubjects = selectedYear
    ? (yearHasQuestions
        ? [SUBJECTS.find((s) => s.id === 'all'), ...yearSubjects].filter(Boolean)
        : yearSubjects)
    : SUBJECTS;

  const visibleSubjects = baseSubjects.filter((s) => {
    if (!searchQuery) return true;
    if (s.id === 'all') return true;
    const q = searchQuery.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) ||
           (s.name_en || '').toLowerCase().includes(q) ||
           (s.code || '').toLowerCase().includes(q);
  });

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
            'Exam Mode — สอบจริงจัง, ตั้งค่าจำนวนข้อ/เวลาได้ในขั้นถัดไป'
          ) : (
            'Quick Practice — สุ่มข้อสอบตามจำนวนที่เลือก'
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

      <div className="vmx-subject-grid">
        {visibleSubjects.length === 0 ? (
          <div className="vmx-empty" style={{ gridColumn: '1 / -1' }}>ไม่พบวิชาที่ค้นหา</div>
        ) : visibleSubjects.map((s) => {
          // Count only Qs in non-hidden topics — matches what user
          // actually sees in TopicSelectView (avoids "127 promised, 70
          // visible" confusion). For 'all' subject, sum visible per
          // subject across the bank.
          const count = visibleQuestionCount(s.id, allQuestions);
          const isEmpty = count === 0;
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

      {isScaffoldYear && (
        <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
          💡 <strong>ปีนี้กำลังวางโครงสร้าง</strong> — รายวิชา + course code + รายชื่ออาจารย์ มาจาก vault profiles ของ {yearSubjects.reduce((acc, s) => acc + (s.vault_lecturers?.length || 0), 0)} คนใน Chula Vet faculty<br/>
          ช่วยกันได้: ถ้ามี slide เก่า, notes, ข้อสอบ past paper ปีนี้ ส่งมาทาง feedback ได้เลย<br/>
          ตอนนี้เปิดครบแล้ว 3 ชั้นปี (ปี 1, ปี 4, ปี 5) ปีที่เหลือจะทยอยเปิดเมื่อมีเนื้อหาส่งเข้ามา
        </div>
      )}

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← ย้อนกลับ</button>
      </div>
    </>
  );
}
