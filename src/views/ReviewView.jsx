import { SUBJECTS } from '../data/curriculum.js';
import { isCorrect } from '../hooks/utils.js';
import { parseVerified, VERIFIED_STYLE } from '../data/verified.js';
import { RichText, stripRichText } from '../lib/richtext.jsx';
import SmartGrader from '../components/SmartGrader.jsx';

// NOTE: Smart AI grading was temporarily removed from the UI per user
// request — the model + rubric + self-assessment workflow alone is
// sufficient for the Final exam mock practice and avoids the friction
// of asking every user to set up an Anthropic API key. The supporting
// code (src/lib/ai-grade.js + api/grade-summary.js) remains in place
// so re-enabling the feature is a one-line UI change later.

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

        // Build display strings (stripRichText so joined output doesn't show raw asterisks)
        // Defensive bounds check — guards against malformed answer indices
        let userDisplay = '—', correctDisplay = '';
        const isOpen = q.type === 'essay' || (q.type === 'short' && (!q.keywords || q.keywords.length === 0));
        if (q.type === 'mcq') {
          const userOpt = answered && userAns >= 0 && userAns < (q.options?.length || 0) ? q.options[userAns] : null;
          const corrOpt = q.options?.[q.answer];
          userDisplay = userOpt ? `${String.fromCharCode(65 + userAns)}. ${stripRichText(userOpt)}` : 'ไม่ได้ตอบ';
          correctDisplay = corrOpt ? `${String.fromCharCode(65 + q.answer)}. ${stripRichText(corrOpt)}` : '⚠️ คำตอบของข้อนี้ผิดรูปแบบ';
        } else if (q.type === 'tf') {
          userDisplay = answered ? (userAns ? 'True' : 'False') : 'ไม่ได้ตอบ';
          correctDisplay = q.answer ? 'True' : 'False';
        } else if (q.type === 'fill') {
          userDisplay = answered && userAns.length ? userAns.map(stripRichText).join(' / ') : 'ไม่ได้ตอบ';
          correctDisplay = q.blanks.map(stripRichText).join(' / ');
        } else if (q.type === 'match') {
          userDisplay = answered ? q.pairs.map((p, i) => `${stripRichText(p.left)} → ${stripRichText(userAns[i]) || '—'}`).join('; ') : 'ไม่ได้ตอบ';
          correctDisplay = q.pairs.map((p) => `${stripRichText(p.left)} → ${stripRichText(p.right)}`).join('; ');
        } else if (q.type === 'short' || q.type === 'essay') {
          userDisplay = answered && typeof userAns === 'string' && userAns.trim() ? userAns : 'ไม่ได้เขียน';
          correctDisplay = q.model_answer || '(no model answer)';
        }

        return (
          <div key={q.id} className={`vmx-review-item ${cls}`}>
            <div className="vmx-review-head">
              <span>
                Q{idx + 1} · {SUBJECTS.find((s) => s.id === q.subject)?.name || q.subject}
                {(() => {
                  const subj = SUBJECTS.find((s) => s.id === q.subject);
                  const t = q.topic && subj?.topics?.find((tp) => tp.id === q.topic);
                  return t ? <> · <span style={{ color: subj?.color || 'var(--clr-ink-soft)', fontWeight: 600 }}>{t.icon} {t.label.replace(/^คาบ\s*\d+(-\d+)?\s*·\s*/, '')}</span></> : null;
                })()}
                {q.examOrigin && (
                  <span title="คำถามนี้อ้างอิงจากข้อสอบเก่า" style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 999, background: 'var(--clr-gold-soft)', color: 'var(--clr-ink)', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                    📜 ข้อสอบเก่า
                  </span>
                )}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className={`vmx-bookmark-btn ${bookmarks.includes(q.id) ? 'active' : ''}`}
                  style={{ position: 'static', width: 28, height: 28, fontSize: 14 }}
                  onClick={() => toggleBookmark(q.id)}>
                  {bookmarks.includes(q.id) ? '★' : '☆'}
                </button>
                <span className={`vmx-review-result ${correct ? 'ok' : (isOpen ? '' : 'no')}`}
                  style={isOpen ? { background: 'rgba(184, 137, 64, 0.15)', color: 'var(--clr-gold)' } : undefined}>
                  {!answered ? 'SKIPPED' : isOpen ? '✍️ Self-assess' : (correct ? '✓ ถูก' : '✗ ผิด')}
                </span>
              </div>
            </div>
            {q.image && <img src={q.image} alt="" className="vmx-qimage" style={{ maxWidth: 300 }} />}
            {q.passage && (
              <div style={{ margin: '8px 0 12px', padding: '10px 14px', borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap', maxHeight: 220, overflowY: 'auto' }}>
                <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-ink-soft)', marginBottom: 6 }}>
                  📄 {q.passage_title || 'Passage'}
                </div>
                <RichText text={q.passage} />
              </div>
            )}
            <div className="vmx-review-q"><RichText text={q.q} /></div>

            {(q.type === 'short' || q.type === 'essay') ? (
              <>
                <div style={{ margin: '8px 0 6px', padding: 10, borderRadius: 8, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>คำตอบของคุณ</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap' }}>{userDisplay}</div>
                  {q.type === 'essay' && answered && typeof userAns === 'string' && userAns.trim() && (
                    <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)' }}>
                      📊 {userAns.trim().split(/\s+/).length} words
                    </div>
                  )}
                </div>
                {q.model_answer && (
                  <div style={{ marginBottom: 6, padding: 10, borderRadius: 8, background: 'rgba(74, 107, 74, 0.08)', border: '1px solid var(--clr-sage)' }}>
                    <div style={{ fontSize: 11, color: 'var(--clr-sage)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 600 }}>✓ Model answer (จาก KEY)</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap' }}>
                      <RichText text={q.model_answer} />
                    </div>
                  </div>
                )}
                {q.rubric && (
                  <div style={{ marginBottom: 6, padding: 10, borderRadius: 8, background: 'rgba(184, 137, 64, 0.08)', border: '1px solid var(--clr-gold)' }}>
                    <div style={{ fontSize: 11, color: 'var(--clr-gold)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 600 }}>📋 Marking criteria</div>
                    <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap' }}>
                      <RichText text={q.rubric} />
                    </div>
                  </div>
                )}
                <SmartGrader q={q} userAnswer={userAns} />
              </>
            ) : (
              <>
                <div className="vmx-review-ans"><span className="k">คำตอบของคุณ</span>{userDisplay}</div>
                {!correct && <div className="vmx-review-ans correct-ans"><span className="k">เฉลย</span>{correctDisplay}</div>}
              </>
            )}
            {q.explain && <div className="vmx-review-explain"><span className="k">Why</span><RichText text={q.explain} /></div>}
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

// SelfGradeHint was replaced by SmartGrader (src/components/SmartGrader.jsx)
// which adds keyword coverage, paraphrase detection, an interactive
// rubric checklist with auto-totalled score, and a confidence-calibration
// panel that tracks how well the user predicts their own grades over time.
