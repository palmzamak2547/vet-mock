import { SUBJECTS } from '../data/questions.js';
import { isCorrect } from '../hooks/utils.js';

export default function ReviewView({ questions, answers, bookmarks, toggleBookmark, goHome, setView, notes }) {
  return (
    <>
      <div className="vmx-hero">
        <h1>เฉลย <em>ข้อสอบ</em></h1>
        <p>กด ★ เพื่อ bookmark ข้อที่อยากกลับมาทำซ้ำ</p>
      </div>

      {questions.map((q, idx) => {
        const userAns = answers[q.id];
        const answered = userAns !== undefined;
        const correct = isCorrect(q, userAns);
        const cls = !answered ? 'skipped' : (correct ? 'correct' : 'wrong');

        let userDisplay = '—', correctDisplay = '';
        if (q.type === 'mcq') {
          userDisplay = answered ? `${String.fromCharCode(65 + userAns)}. ${q.options[userAns]}` : 'ไม่ได้ตอบ';
          correctDisplay = `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`;
        } else if (q.type === 'tf') {
          userDisplay = answered ? (userAns ? 'True' : 'False') : 'ไม่ได้ตอบ';
          correctDisplay = q.answer ? 'True' : 'False';
        } else if (q.type === 'fill') {
          userDisplay = answered && userAns.length ? userAns.join(' / ') : 'ไม่ได้ตอบ';
          correctDisplay = q.blanks.join(' / ');
        } else if (q.type === 'match') {
          userDisplay = answered ? q.pairs.map((p, i) => `${p.left} → ${userAns[i] || '—'}`).join('; ') : 'ไม่ได้ตอบ';
          correctDisplay = q.pairs.map((p) => `${p.left} → ${p.right}`).join('; ');
        }

        return (
          <div key={q.id} className={`vmx-review-item ${cls}`}>
            <div className="vmx-review-head">
              <span>Q{idx + 1} · {SUBJECTS.find((s) => s.id === q.subject)?.name || q.subject}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className={`vmx-bookmark-btn ${bookmarks.includes(q.id) ? 'active' : ''}`}
                  style={{ position: 'static', width: 28, height: 28, fontSize: 14 }}
                  onClick={() => toggleBookmark(q.id)}>
                  {bookmarks.includes(q.id) ? '★' : '☆'}
                </button>
                <span className={`vmx-review-result ${correct ? 'ok' : 'no'}`}>
                  {!answered ? 'SKIPPED' : correct ? '✓ ถูก' : '✗ ผิด'}
                </span>
              </div>
            </div>
            {q.image && <img src={q.image} alt="" className="vmx-qimage" style={{ maxWidth: 300 }} />}
            <div className="vmx-review-q">{q.q}</div>
            <div className="vmx-review-ans"><span className="k">คำตอบของคุณ</span>{userDisplay}</div>
            {!correct && <div className="vmx-review-ans correct-ans"><span className="k">เฉลย</span>{correctDisplay}</div>}
            {q.explain && <div className="vmx-review-explain"><span className="k">Why</span>{q.explain}</div>}
            {notes && notes[q.id] && (
              <div className="vmx-note-panel" style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', marginBottom: 4, letterSpacing: '0.08em' }}>📝 โน้ตของคุณ</div>
                <div style={{ fontSize: 13, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap' }}>{notes[q.id]}</div>
              </div>
            )}
            {q.tags && q.tags.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {q.tags.map((t) => <span key={t} className="vmx-tag-pill">#{t}</span>)}
              </div>
            )}
          </div>
        );
      })}

      <div className="vmx-btn-row" style={{ marginTop: 30 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('config')}>ทำชุดใหม่ →</button>
      </div>
    </>
  );
}
