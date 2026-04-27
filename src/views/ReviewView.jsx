import { useState } from 'react';
import { SUBJECTS } from '../data/curriculum.js';
import { isCorrect } from '../hooks/utils.js';
import { parseVerified, VERIFIED_STYLE } from '../data/verified.js';
import { RichText, stripRichText } from '../lib/richtext.jsx';
import { gradeWithAI } from '../lib/ai-grade.js';

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
                <AIGradePanel q={q} userAnswer={userAns} />
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

// ─────────────────────────────────────────────────────────────
// AIGradePanel — choose between Self-grade and AI-grade for
// short/essay questions. AI calls /api/grade-summary; result is
// rendered as a per-criterion breakdown.
// ─────────────────────────────────────────────────────────────
function AIGradePanel({ q, userAnswer }) {
  // mode: 'choose' | 'self' | 'ai-loading' | 'ai-result' | 'ai-error'
  const [mode, setMode] = useState('choose');
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const hasAnswer = typeof userAnswer === 'string' && userAnswer.trim().length > 0;

  const requestAI = async () => {
    if (!hasAnswer) {
      setAiError({ error: 'ยังไม่ได้เขียนคำตอบ' });
      setMode('ai-error');
      return;
    }
    setMode('ai-loading');
    setAiError(null);
    const result = await gradeWithAI({
      type: q.type,
      passage: q.passage,
      question: q.q,
      userAnswer,
      modelAnswer: q.model_answer,
      rubric: q.rubric,
      targetWords: q.target_words,
      softMaxWords: q.soft_max_words,
      hardMaxWords: q.hard_max_words,
    });
    if (result.ok) {
      setAiResult(result.grading);
      setMode('ai-result');
    } else {
      setAiError(result);
      setMode('ai-error');
    }
  };

  // ── Mode: choose grader ──
  if (mode === 'choose') {
    return (
      <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: 'var(--clr-bg)', border: '1px dashed var(--clr-border)' }}>
        <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 8, lineHeight: 1.5 }}>
          💡 ข้อเขียนตรวจอัตโนมัติด้วย exact match ไม่ได้ — เลือกวิธีประเมินที่อยากได้:
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setMode('self')}
            style={{ all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', fontSize: 13, color: 'var(--clr-ink)' }}
          >
            📝 Self assess (ดู model + rubric แล้วประเมินเอง)
          </button>
          <button
            type="button"
            onClick={requestAI}
            disabled={!hasAnswer}
            style={{
              all: 'unset',
              cursor: hasAnswer ? 'pointer' : 'not-allowed',
              padding: '8px 14px',
              borderRadius: 999,
              background: hasAnswer ? 'var(--clr-sage)' : 'var(--clr-surface-2)',
              color: hasAnswer ? 'var(--clr-bg)' : 'var(--clr-ink-soft)',
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid transparent',
            }}
            title={hasAnswer ? 'ส่งให้ AI ตรวจตาม rubric' : 'ต้องมีคำตอบก่อน AI จะตรวจให้ได้'}
          >
            🤖 Smart AI grade
          </button>
        </div>
      </div>
    );
  }

  // ── Mode: self-grade hint ──
  if (mode === 'self') {
    return (
      <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: 'var(--clr-bg)', border: '1px dashed var(--clr-border)', fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        ✓ <strong>Self-grade:</strong> เปรียบเทียบคำตอบของคุณกับ model answer + rubric ข้างบน แล้วประเมินตัวเองว่าได้คะแนนเท่าไหร่ (full 15 pts → Content 7 + Org/Grammar 5 + Paraphrase 3)
        <button type="button" onClick={() => setMode('choose')} style={{ all: 'unset', cursor: 'pointer', marginLeft: 8, color: 'var(--clr-sage)', textDecoration: 'underline' }}>
          ↺ เปลี่ยนเป็น AI grade
        </button>
      </div>
    );
  }

  // ── Mode: AI loading ──
  if (mode === 'ai-loading') {
    return (
      <div style={{ marginTop: 10, padding: 14, borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-sage)', fontSize: 13, color: 'var(--clr-ink)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="vmx-ai-spin" style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--clr-border)', borderTopColor: 'var(--clr-sage)', animation: 'pulse 1s linear infinite' }} />
          <div>
            <strong>🤖 AI กำลังตรวจ...</strong>
            <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
              กำลังเปรียบเทียบกับ model answer + rubric · ใช้เวลาประมาณ 10-30 วินาที
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Mode: AI error ──
  if (mode === 'ai-error') {
    return (
      <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: 'var(--clr-rose-soft)', border: '1px solid var(--clr-rose)', fontSize: 13, color: 'var(--clr-ink)' }}>
        ❌ <strong>AI grading ไม่สำเร็จ</strong>
        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--clr-ink)' }}>{aiError?.error}</div>
        {aiError?.hint && <div style={{ marginTop: 4, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>💡 {aiError.hint}</div>}
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button type="button" onClick={requestAI} style={{ all: 'unset', cursor: 'pointer', padding: '4px 10px', borderRadius: 999, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', fontSize: 12 }}>
            ↻ ลองใหม่
          </button>
          <button type="button" onClick={() => setMode('self')} style={{ all: 'unset', cursor: 'pointer', padding: '4px 10px', borderRadius: 999, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', fontSize: 12 }}>
            📝 ใช้ self-grade แทน
          </button>
        </div>
      </div>
    );
  }

  // ── Mode: AI result ──
  if (mode === 'ai-result' && aiResult) {
    const total = aiResult.totalScore ?? 0;
    const max = q.type === 'essay' ? 15 : (aiResult.scores?.answer?.total || 2);
    return (
      <div style={{ marginTop: 10, padding: 14, borderRadius: 12, background: 'rgba(74, 107, 74, 0.08)', border: '1px solid var(--clr-sage)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-sage)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            🤖 AI Grade · {aiResult._meta?.model?.replace('claude-', '').replace(/-\d+$/, '') || 'Claude'}
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 700, color: 'var(--clr-ink)' }}>
            {total}<span style={{ fontSize: 14, color: 'var(--clr-ink-soft)', fontWeight: 400 }}> / {max}</span>
          </div>
        </div>

        {/* Score breakdown */}
        {aiResult.scores && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
            {Object.entries(aiResult.scores).map(([k, v]) => (
              <div key={k} style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <strong style={{ fontSize: 13, textTransform: 'capitalize' }}>{labelFor(k)}</strong>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--clr-sage)', fontWeight: 600 }}>{v.earned}/{v.total}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.5 }}>{v.justification}</div>
              </div>
            ))}
          </div>
        )}

        {/* Word count penalty */}
        {aiResult.wordCountPenalty && aiResult.wordCountPenalty.applied !== 0 && (
          <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(184, 137, 64, 0.12)', border: '1px solid var(--clr-gold)', fontSize: 12, marginBottom: 10 }}>
            ⏱ Word penalty: <strong>−{aiResult.wordCountPenalty.applied}</strong> · {aiResult.wordCountPenalty.reason}
          </div>
        )}

        {/* Overall feedback */}
        {aiResult.overallFeedback && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--clr-bg)', borderLeft: '3px solid var(--clr-sage)', fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>
            <strong style={{ color: 'var(--clr-sage)' }}>📋 Overall:</strong> {aiResult.overallFeedback}
          </div>
        )}

        {/* Strengths */}
        {aiResult.strengthsSpotted?.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--clr-sage)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
              ✓ จุดเด่น
            </div>
            <ul style={{ margin: 0, paddingLeft: 22, fontSize: 12.5, lineHeight: 1.6 }}>
              {aiResult.strengthsSpotted.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {aiResult.improvements?.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--clr-gold)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
              ⚠️ ควรปรับ
            </div>
            <ul style={{ margin: 0, paddingLeft: 22, fontSize: 12.5, lineHeight: 1.6 }}>
              {aiResult.improvements.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 10, color: 'var(--clr-ink-soft)', fontStyle: 'italic', lineHeight: 1.5 }}>
          ⚠️ AI grading เป็นแค่ ประเมินคร่าวๆ เพื่อช่วยฝึก — คะแนนจริงตัดสินโดยอาจารย์ในห้องสอบเท่านั้น
        </div>
      </div>
    );
  }

  return null;
}

function labelFor(key) {
  const map = {
    content: 'Content (เนื้อหา)',
    grammar: 'Organization & Grammar (โครงสร้าง + ไวยากรณ์)',
    paraphrase: 'Paraphrasing (การสรุปเป็นคำของตัวเอง)',
    answer: 'Answer (ความถูกต้อง)',
  };
  return map[key] || key;
}
