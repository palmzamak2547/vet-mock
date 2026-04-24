import { QB, SUBJECTS } from '../data/questions.js';

export default function SubjectSelectView({ setSubject, setView, setPracticeMode, goHome, mode, customQuestions = [] }) {
  const allQuestions = [...QB, ...customQuestions];
  return (
    <>
      <div className="vmx-hero">
        <h1>เลือก <em>วิชา</em></h1>
        <p>
          {mode === 'exam' ? '🎓 Exam Mode — สอบจริงจัง 50 ข้อ 50 นาที' : '📝 Quick Practice — สุ่มข้อสอบตามจำนวนที่เลือก'}
        </p>
      </div>
      <div className="vmx-subject-grid">
        {SUBJECTS.map((s) => {
          const count = s.id === 'all' ? allQuestions.length : allQuestions.filter((q) => q.subject === s.id).length;
          return (
            <button key={s.id} className="vmx-subject-card" onClick={() => { setSubject(s.id); setPracticeMode('all'); setView('config'); }}>
              <div className="accent" style={{ background: s.color }}></div>
              <div className="icon">{s.icon}</div>
              <div className="title">{s.name}</div>
              <div className="sub">{s.name_en}</div>
              <div className="count">{count} questions</div>
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
