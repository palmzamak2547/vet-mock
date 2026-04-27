import { QB } from '../data/questions.js';
import { SUBJECTS } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';

export default function SubjectSelectView({ setSubject, setTopic, setView, setPracticeMode, goHome, mode, customQuestions = [] }) {
  const allQuestions = [...QB, ...customQuestions];

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>เลือก <em>วิชา</em></h1>
        <p>
          {mode === 'exam' ? '🎓 Exam Mode — สอบจริงจัง · ตั้งค่าจำนวนข้อ/เวลาได้ในขั้นถัดไป' : '📝 Quick Practice — สุ่มข้อสอบตามจำนวนที่เลือก'}
        </p>
      </div>

      <div className="vmx-subject-grid">
        {SUBJECTS.map((s) => {
          const count = s.id === 'all' ? allQuestions.length : allQuestions.filter((q) => q.subject === s.id).length;
          const isEmpty = count === 0;

          return (
            <button
              key={s.id}
              className="vmx-subject-card"
              disabled={isEmpty}
              onClick={() => {
                if (isEmpty) return;
                setSubject(s.id);
                setPracticeMode('all');
                if (setTopic) setTopic(null);
                // ถ้าวิชามี topics → ไป TopicSelectView ก่อน
                const hasTopics = Array.isArray(s.topics) && s.topics.length > 0;
                setView(hasTopics ? 'topic-select' : 'config');
              }}
              style={{
                opacity: isEmpty ? 0.5 : 1,
                cursor: isEmpty ? 'not-allowed' : 'pointer',
              }}
              title={isEmpty ? 'ยังไม่มีข้อสอบในวิชานี้' : ''}
            >
              <div className="accent" style={{ background: s.color }}></div>
              <div className="icon">{s.icon}</div>
              <div className="title">{s.name}</div>
              <div className="sub">{s.name_en}</div>
              <div className="count" style={{ color: isEmpty ? 'var(--clr-rose)' : 'var(--clr-ink-soft)' }}>
                {isEmpty ? '🚧 รอข้อสอบเพิ่ม' : `${count} questions`}
              </div>
              {s.code && s.id !== 'all' && (
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', opacity: 0.7, marginTop: 2 }}>
                  {s.code}
                </div>
              )}
              {s.examFormat && (
                <div style={{
                  marginTop: 6,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: 'var(--clr-surface-2)',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--clr-ink-soft)',
                  display: 'inline-block',
                  letterSpacing: '0.05em',
                }}>
                  📝 {s.examFormat.weight}
                  {s.examFormat.choiceCount && ` · ${s.examFormat.choiceCount} ช้อยส์`}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← ย้อนกลับ</button>
      </div>
    </>
  );
}
