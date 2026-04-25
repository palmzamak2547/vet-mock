import { SUBJECTS } from '../data/curriculum.js';
import { isCorrect } from '../hooks/utils.js';
import { parseVerified, VERIFIED_STYLE } from '../data/verified.js';

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
            {q.verified && (() => {
              const items = parseVerified(q.verified);
              if (!items.length) return null;
              return (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {items.map((it, i) => {
                    const st = VERIFIED_STYLE[it.type] || VERIFIED_STYLE.other;
                    return (
                      <div key={i} style={{ padding: '6px 10px', borderRadius: 8, background: st.bg, border: `1px solid ${st.border}`, fontSize: 11, color: st.ink }}>
                        <span style={{ marginRight: 6 }}>{st.icon}</span>
                        <strong>{it.label}</strong>
                        {it.year && <span style={{ marginLeft: 6, fontFamily: 'JetBrains Mono, monospace' }}>· {it.year}</span>}
                        {it.by && <span style={{ marginLeft: 6, fontStyle: 'italic' }}>· by {it.by}</span>}
                        <div style={{ marginTop: 3, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)' }}>
                          {it.raw}
                        </div>
                        {it.note && (
                          <div style={{ marginTop: 3, fontSize: 10, fontStyle: 'italic', color: 'var(--clr-ink-soft)' }}>
                            ⚠️ {it.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            {q.flag && (
              <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--clr-rose-soft)', border: `1px solid ${q.flag.severity === 'major' ? 'var(--clr-rose)' : 'var(--clr-gold)'}`, fontSize: 12, color: 'var(--clr-ink)' }}>
                ⚠️ <strong>{q.flag.severity === 'major' ? 'Major flag' : 'Note'}:</strong> {q.flag.note}
                {q.flag.sources?.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)' }}>
                    📖 {q.flag.sources.join(' · ')}
                  </div>
                )}
              </div>
            )}
            {q.source && (
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic', fontFamily: 'JetBrains Mono, monospace' }}>
                📚 ไฟล์ต้นทาง: {q.source}
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
