import { QB } from '../data/questions.js';
import { SUBJECTS } from '../data/curriculum.js';

export default function TopicSelectView({ subject, setTopic, setView, goHome, mode, customQuestions = [] }) {
  const subjectMeta = SUBJECTS.find((s) => s.id === subject);
  const topics = subjectMeta?.topics || [];
  const allQuestions = [...QB, ...customQuestions];

  const countFor = (topicId) => {
    if (topicId === 'all') return allQuestions.filter((q) => q.subject === subject).length;
    return allQuestions.filter((q) => q.subject === subject && q.topic === topicId).length;
  };

  const choose = (topicId) => {
    setTopic(topicId === 'all' ? null : topicId);
    setView('config');
  };

  return (
    <>
      <div className="vmx-hero">
        <h1>เลือก <em>หัวข้อ</em></h1>
        <p>{subjectMeta?.icon} {subjectMeta?.name} · เลือกเฉพาะหัวข้อที่จะสอบ หรือทั้งหมดก็ได้</p>
      </div>

      <div className="vmx-subject-grid">
        {/* All-topics card */}
        <button
          key="all"
          className="vmx-subject-card"
          onClick={() => choose('all')}
        >
          <div className="accent" style={{ background: subjectMeta?.color || 'var(--clr-ink)' }}></div>
          <div className="icon">📚</div>
          <div className="title">รวมทุกหัวข้อ</div>
          <div className="sub">All topics in {subjectMeta?.name}</div>
          <div className="count">{countFor('all')} questions</div>
        </button>

        {topics.map((t) => {
          const count = countFor(t.id);
          const isEmpty = count === 0;
          return (
            <button
              key={t.id}
              className="vmx-subject-card"
              disabled={isEmpty}
              onClick={() => { if (!isEmpty) choose(t.id); }}
              style={{
                opacity: isEmpty ? 0.5 : 1,
                cursor: isEmpty ? 'not-allowed' : 'pointer',
              }}
              title={isEmpty ? 'ยังไม่มีข้อสอบในหัวข้อนี้' : ''}
            >
              <div className="accent" style={{ background: subjectMeta?.color || 'var(--clr-ink)' }}></div>
              <div className="icon">{t.icon || '📑'}</div>
              <div className="title">{t.label}</div>
              {t.lecturer && (
                <div className="sub" style={{ fontStyle: 'italic' }}>by Aj. {t.lecturer}</div>
              )}
              <div className="count" style={{ color: isEmpty ? 'var(--clr-rose)' : 'var(--clr-ink-soft)' }}>
                {isEmpty ? '🚧 รอข้อสอบเพิ่ม' : `${count} questions`}
              </div>
            </button>
          );
        })}
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={() => setView('subject-select')}>← ย้อนกลับ</button>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>หน้าแรก</button>
      </div>
    </>
  );
}
