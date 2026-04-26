import { QB } from '../data/questions.js';
import { SUBJECTS } from '../data/curriculum.js';

export default function TopicSelectView({ subject, setTopic, setView, goHome, mode, customQuestions = [], readingChecklist = {} }) {
  const subjectMeta = SUBJECTS.find((s) => s.id === subject);
  const topics = subjectMeta?.topics || [];
  const allQuestions = [...QB, ...customQuestions];

  // Reading-checklist summary for this subject
  const subjReadDone = topics.filter((t) => readingChecklist[t.id]).length;

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
        {topics.length > 0 && (
          <div
            onClick={() => setView('reading-checklist')}
            title="เปิดรายการอ่าน"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(184, 137, 64, 0.12)',
              border: '1px solid var(--clr-gold)',
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--clr-ink)',
              cursor: 'pointer',
            }}
          >
            📚 อ่านแล้ว <strong>{subjReadDone}/{topics.length}</strong>
          </div>
        )}
      </div>

      {subjectMeta?.examFormat && (
        <ExamFormatBanner format={subjectMeta.examFormat} accent={subjectMeta.color} />
      )}

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
          const isRead = !!readingChecklist[t.id];
          return (
            <button
              key={t.id}
              className="vmx-subject-card"
              disabled={isEmpty}
              onClick={() => { if (!isEmpty) choose(t.id); }}
              style={{
                opacity: isEmpty ? 0.5 : 1,
                cursor: isEmpty ? 'not-allowed' : 'pointer',
                position: 'relative',
              }}
              title={isEmpty ? 'ยังไม่มีข้อสอบในหัวข้อนี้' : ''}
            >
              <div className="accent" style={{ background: subjectMeta?.color || 'var(--clr-ink)' }}></div>
              {isRead && (
                <div
                  aria-label="อ่านแล้ว"
                  title="อ่านแล้ว"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'var(--clr-sage)',
                    color: 'var(--clr-bg)',
                    fontSize: 12,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  ✓
                </div>
              )}
              <div className="icon">{t.icon || '📑'}</div>
              <div className="title">{t.label}</div>
              {t.lecturer && (
                <div className="sub" style={{ fontStyle: 'italic' }}>
                  by Aj. {t.lecturer}{t.lecturer_year && ` (${t.lecturer_year})`}
                </div>
              )}
              <div className="count" style={{ color: isEmpty ? 'var(--clr-rose)' : 'var(--clr-ink-soft)' }}>
                {isEmpty ? '🚧 รอข้อสอบเพิ่ม' : `${count} questions`}
              </div>
              {t.lecturerNote && !isEmpty && (
                <div style={{ marginTop: 8, padding: '6px 8px', borderRadius: 6, background: 'var(--clr-surface-2)', fontSize: 10, color: 'var(--clr-ink-soft)', fontStyle: 'italic', textAlign: 'left', lineHeight: 1.4 }}>
                  ⚠️ {t.lecturerNote}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={() => setView('subject-select')}>← ย้อนกลับ</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('notes')}>📖 ทวนเนื้อหา</button>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>หน้าแรก</button>
      </div>
    </>
  );
}

// ─── Exam-format banner (shows up when subject has examFormat metadata) ───
function ExamFormatBanner({ format, accent }) {
  const items = [];
  if (format.weight) items.push({ k: 'สัดส่วนวิชา', v: format.weight });
  if (format.perSession) items.push({ k: 'จำนวนข้อ', v: format.perSession });
  if (format.totalEstimate) items.push({ k: 'รวมประมาณ', v: format.totalEstimate });
  if (format.choiceCount) items.push({ k: 'รูปแบบ', v: `MCQ ${format.choiceCount} ช้อยส์ (A-${String.fromCharCode(64 + format.choiceCount)})` });

  return (
    <div style={{
      padding: '14px 18px',
      borderRadius: 12,
      borderLeft: `4px solid ${accent || 'var(--clr-ink)'}`,
      background: 'var(--clr-surface)',
      border: '1px solid var(--clr-border)',
      marginBottom: 20,
    }}>
      <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        📝 โครงสร้างข้อสอบจริง
      </div>

      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginBottom: format.notes?.length || format.questionTypes?.length ? 10 : 0 }}>
          {items.map((it) => (
            <div key={it.k} style={{ fontSize: 13 }}>
              <span style={{ color: 'var(--clr-ink-soft)' }}>{it.k}: </span>
              <strong style={{ color: 'var(--clr-ink)' }}>{it.v}</strong>
            </div>
          ))}
        </div>
      )}

      {format.questionTypes?.length > 0 && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 12.5, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
          {format.questionTypes.map((q, i) => (
            <li key={i}>
              {q.topic} — <code style={{ background: 'var(--clr-surface-2)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>{q.type}</code>
              {q.count && <span style={{ color: 'var(--clr-ink-soft)' }}> · {q.count}</span>}
            </li>
          ))}
        </ul>
      )}

      {format.notes?.length > 0 && (
        <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--clr-surface-2)', fontSize: 12, lineHeight: 1.6 }}>
          {format.notes.map((n, i) => <div key={i}>{n}</div>)}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 10, fontStyle: 'italic', color: 'var(--clr-ink-soft)' }}>
        โปรดยืนยันกับอาจารย์/หัวปีอีกครั้งก่อนวันสอบจริง
      </div>
    </div>
  );
}
