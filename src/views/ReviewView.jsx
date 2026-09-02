import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { SUBJECTS } from '../data/curriculum.js';
import { isCorrect, matchScore } from '../hooks/utils.js';
import { articleForQuestion } from '../lib/vetwiki/registry.js';
// The generated per-topic summary, not the full conflict index: the index
// carries the whole 368 KB corrections table, and this view only needs the
// count. Home prefetches this view at idle, so that table was downloaded
// on every boot for a number the summary already holds.
import { conflictCountFor } from '../lib/vetwiki/conflict-summary.generated.js';
import { FEATURE_FLAGS } from '../lib/feature-registry.js';
import { parseVerified, VERIFIED_STYLE } from '../data/verified.js';
import { RichText, stripRichText } from '../lib/richtext.jsx';
import { safeImageUrl } from '../lib/safe-url.js';
import SmartGrader from '../components/SmartGrader.jsx';
import BackBar from '../components/BackBar.jsx';
import ZoomableImage from '../components/ZoomableImage.jsx';
import { copyShareUrl } from '../lib/share-link.js';

// Annotator is heavy (canvas + image processing) and only mounts on
// demand — lazy so the review view stays light.
const ImageAnnotator = lazy(() => import('../components/ImageAnnotator.jsx'));

// Subject lookup map built once at module load. Replaces
// SUBJECTS.find() calls that were running ~2-3× per visible question
// on every render — for a 200-Q review with filter chip toggles, the
// .find() loop was the dominant render cost.
const SUBJECT_BY_ID = new Map(SUBJECTS.map((s) => [s.id, s]));

// QComments only mounts when the user expands the comment thread for
// a question. Comments need Supabase, so the component is gated by
// hasSupabase internally and renders a sign-in CTA otherwise.
const QComments = lazy(() => import('../components/QComments.jsx'));

// Remote grading stays outside the product. The local rubric and
// self-assessment workflow keep review dependable and require no provider
// configuration; the old server path remains dormant for compatibility.

// Phase label map — mirrors header pill in App.jsx
const PHASE_LABEL_REV = {
  '1-mid':   'ทม.1 กลาง',
  '1-final': 'ทม.1 ปลาย',
  '2-mid':   'ทม.2 กลาง',
  '2-final': 'ทม.2 ปลาย',
};

function ReviewNoteEditor({ qId, noteText, setNote }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const currentText = typeof noteText === 'string' ? noteText : '';
  const textareaId = `vmx-note-input-${qId}`;

  const handleChange = (e) => {
    const val = e.target.value.slice(0, 500);
    if (typeof setNote === 'function') {
      setNote(qId, val);
    }
  };

  const handleClear = () => {
    if (typeof setNote === 'function') {
      setNote(qId, '');
    }
    setConfirmClear(false);
  };

  return (
    <div className="vmx-note-panel" style={{ marginTop: 14, padding: 12, borderRadius: 10, background: 'var(--clr-surface-2, #f5f0eb)', border: '1px solid var(--clr-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 6 }}>
        <label htmlFor={textareaId} style={{ fontWeight: 600, fontSize: 13, color: 'var(--clr-ink)' }}>
          บันทึกส่วนตัว
        </label>
        <span style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)' }} aria-live="polite">
          {currentText.length}/500
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginBottom: 8 }}>
        บันทึกนี้เห็นได้เฉพาะคุณ และไม่กระทบคะแนนหรือเฉลย
      </div>
      <textarea
        id={textareaId}
        className="vmx-note-textarea"
        value={currentText}
        onChange={handleChange}
        placeholder="พิมพ์บันทึกสั้นๆ สำหรับทบทวน..."
        maxLength={500}
        rows={3}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: 8,
          borderRadius: 6,
          border: '1px solid var(--clr-border)',
          fontFamily: 'inherit',
          fontSize: 13,
          lineHeight: 1.5,
          resize: 'vertical',
          background: 'var(--clr-bg, #fff)',
          color: 'var(--clr-ink)',
        }}
      />
      {currentText.length > 0 && (
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'flex-end' }}>
          {confirmClear ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--clr-ink-soft)' }}>ยืนยันการลบโน้ต?</span>
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={handleClear}
                style={{ color: 'var(--clr-rose-text, #d9534f)', minHeight: 28, padding: '2px 8px', fontSize: 12 }}
              >
                ยืนยันลบ
              </button>
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={() => setConfirmClear(false)}
                style={{ minHeight: 28, padding: '2px 8px', fontSize: 12 }}
              >
                ยกเลิก
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost vmx-btn-sm"
              onClick={() => setConfirmClear(true)}
              aria-label="ลบบันทึกส่วนตัว"
              style={{ color: 'var(--clr-ink-soft)', minHeight: 28, padding: '2px 8px', fontSize: 12 }}
            >
              ลบบันทึก
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewView({ questions, answers, bookmarks, toggleBookmark, goHome, setView, notes, setNote, user, selectedYear = 4, selectedPhase, onOpenWiki }) {
  const phaseLabel = selectedPhase ? PHASE_LABEL_REV[selectedPhase] : null;
  // Filter tabs let users zoom into the slice they care about — when
  // reviewing a 200-Q exam, scrolling linearly to find the 30 wrong
  // ones is brutal. Start with wrong/skipped work when present; all-correct
  // sessions fall back to the complete list.
  const [filter, setFilter] = useState(() => {
    if (questions.some((q) => answers[q.id] !== undefined && !isCorrect(q, answers[q.id]))) return 'wrong';
    if (questions.some((q) => answers[q.id] === undefined)) return 'skipped';
    return 'all';
  });
  const [expandedCorrect, setExpandedCorrect] = useState(() => new Set());
  // Image annotator — opens for the URL we set here.
  const [annotateSrc, setAnnotateSrc] = useState(null);
  // Set of `subject:id` keys whose comment thread the user has opened.
  // We only mount QComments lazily on click to avoid 200 simultaneous
  // realtime subscriptions on a 200-Q exam review.
  const [openComments, setOpenComments] = useState(() => new Set());
  const toggleComments = (key) => setOpenComments((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const counts = useMemo(() => {
    const c = { all: questions.length, correct: 0, wrong: 0, skipped: 0, bookmarked: 0, noted: 0 };
    for (const q of questions) {
      const ua = answers[q.id];
      if (ua === undefined) c.skipped++;
      else if (isCorrect(q, ua)) c.correct++;
      else c.wrong++;
      if (bookmarks?.includes(q.id)) c.bookmarked++;
      if (notes && notes[q.id]) c.noted++;
    }
    return c;
  }, [questions, answers, bookmarks, notes]);

  const filtered = useMemo(() => {
    if (filter === 'all') return questions;
    return questions.filter((q) => {
      const ua = answers[q.id];
      switch (filter) {
        case 'correct':    return ua !== undefined && isCorrect(q, ua);
        case 'wrong':      return ua !== undefined && !isCorrect(q, ua);
        case 'skipped':    return ua === undefined;
        case 'bookmarked': return bookmarks?.includes(q.id);
        case 'noted':      return notes && notes[q.id];
        default:           return true;
      }
    });
  }, [questions, answers, bookmarks, notes, filter]);

  // Incremental rendering — for 200-Q exam reviews, painting all items at
  // once causes jank on iPad. Variable-height items (images, passages,
  // model answers, rubrics) make full virtualization too complex, so we
  // use an IntersectionObserver sentinel: render N items, observe the
  // bottom of the list, append +N when it scrolls into view.
  const PAGE = 30;
  const [visibleCount, setVisibleCount] = useState(PAGE);
  const sentinelRef = useRef(null);
  // Reset on filter change so the user always sees from the top
  useEffect(() => { setVisibleCount(PAGE); }, [filter]);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      // Fallback: just show everything (older browsers)
      setVisibleCount(filtered.length);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setVisibleCount((c) => Math.min(c + PAGE, filtered.length));
      }
    }, { rootMargin: '600px 0px' });
    obs.observe(node);
    return () => obs.disconnect();
  }, [filtered.length]);
  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const tabs = [
    { id: 'all',        label: 'ทั้งหมด',  icon: '📋', color: 'var(--clr-ink)' },
    { id: 'wrong',      label: 'ผิด',      icon: '✗',  color: 'var(--clr-rose-text)' },
    { id: 'correct',    label: 'ถูก',      icon: '✓',  color: 'var(--clr-sage-text)' },
    { id: 'skipped',    label: 'ข้าม',     icon: '⏭', color: 'var(--clr-ink-soft)' },
    { id: 'bookmarked', label: 'บันทึกไว้', icon: '★',  color: 'var(--clr-gold-text)' },
    { id: 'noted',      label: 'มีโน้ต',   icon: '📝', color: 'var(--clr-plum-text, #7d4a7d)' },
  ];

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" subtitle={`${questions.length} ข้อ`} />
      <div className="vmx-hero">
        <h1>เฉลย <em>ข้อสอบ</em></h1>
        <p>เปิดดูข้อที่ผิดก่อน แล้วบันทึกข้อที่อยากกลับมาทำซ้ำ</p>
        {(phaseLabel || selectedYear) && (
          <div style={{
            marginTop: 8, display: 'inline-block',
            padding: '3px 10px', borderRadius: 999,
            background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)',
            fontFamily: 'var(--vmx-mono)', fontSize: 11,
            letterSpacing: '0.08em', color: 'var(--clr-ink-soft)',
          }}>
            ปี {selectedYear}{phaseLabel ? `, ${phaseLabel}` : ''}
          </div>
        )}
      </div>

      {/* Filter tabs — only render if there's variety to filter (>1 unique
          state). For a 5-Q practice run with all correct, tabs add noise. */}
      {questions.length >= 5 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18, padding: '4px 0' }}>
          {tabs.map((t) => {
            const n = counts[t.id];
            if (t.id !== 'all' && n === 0) return null; // hide empty buckets
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                aria-pressed={active}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  fontFamily: 'inherit',
                  background: active ? t.color : 'var(--clr-surface)',
                  color: active ? 'var(--clr-bg)' : 'var(--clr-ink)',
                  border: `1px solid ${active ? t.color : 'var(--clr-border)'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: 44,
                  boxSizing: 'border-box',
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                <span style={{
                  fontSize: 11,
                  fontFamily: 'var(--vmx-mono)',
                  padding: '1px 6px',
                  borderRadius: 999,
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--clr-surface-2)',
                  color: active ? 'var(--clr-bg)' : 'var(--clr-ink-soft)',
                }}>{n}</span>
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="vmx-empty">ไม่มีข้อในหมวด "{tabs.find((t) => t.id === filter)?.label}" — ลองหมวดอื่น</div>
      )}

      {visible.map((q, idx) => {
        const userAns = answers[q.id];
        const answered = userAns !== undefined;
        const correct = isCorrect(q, userAns);
        // match: แสดง partial เป็น wrong แต่มีแถบส้มถ้าได้บางส่วน (ให้กำลังใจ)
        const ms = q.type === 'match' && answered ? matchScore(q, userAns) : null;
        const isPartial = ms && ms.correct > 0 && ms.correct < ms.total;
        const cls = !answered ? 'skipped' : (correct ? 'correct' : (isPartial ? 'skipped' : 'wrong'));

        // Build display strings (stripRichText so joined output doesn't show raw asterisks)
        // Defensive bounds check — guards against malformed answer indices
        let userDisplay = '—', correctDisplay = '';
        const isOpen = q.type === 'essay' || (q.type === 'short' && (!q.keywords || q.keywords.length === 0));
        if (q.type === 'mcq') {
          const userOpt = answered && userAns >= 0 && userAns < (q.options?.length || 0) ? q.options[userAns] : null;
          const corrOpt = q.options?.[q.answer];
          // No letter prefix (e.g. "A.", "B.") — Palm audit 2026-05-20
          // added a per-question option shuffle in Question.jsx, so the
          // letter the user actually saw during the exam doesn't match
          // the source-order letter anymore. Showing source letters here
          // would mislead users ("I picked B but it says C"). The TEXT
          // is the authoritative pick + answer.
          userDisplay = userOpt ? stripRichText(userOpt) : 'ไม่ได้ตอบ';
          correctDisplay = corrOpt ? stripRichText(corrOpt) : 'คำตอบของข้อนี้ผิดรูปแบบ';
        } else if (q.type === 'tf') {
          userDisplay = answered ? (userAns ? 'True' : 'False') : 'ไม่ได้ตอบ';
          correctDisplay = q.answer ? 'True' : 'False';
        } else if (q.type === 'fill') {
          userDisplay = answered && userAns.length ? userAns.map(stripRichText).join(' / ') : 'ไม่ได้ตอบ';
          correctDisplay = q.blanks.map(stripRichText).join(' / ');
        } else if (q.type === 'match') {
          if (!answered) {
            userDisplay = 'ไม่ได้ตอบ';
          } else {
            const s = matchScore(q, userAns);
            const rows = q.pairs.map((p, i) => {
              const ua = userAns[i];
              const ok = ua === p.right;
              const icon = !ua ? '—' : ok ? '✓' : '✗';
              return `${stripRichText(p.left)} → ${stripRichText(ua) || '—'} ${icon}`;
            }).join('; ');
            userDisplay = `${rows}  (${s.correct}/${s.total})`;
          }
          correctDisplay = q.pairs.map((p) => `${stripRichText(p.left)} → ${stripRichText(p.right)}`).join('; ');
        } else if (q.type === 'short' || q.type === 'essay') {
          userDisplay = answered && typeof userAns === 'string' && userAns.trim() ? userAns : 'ไม่ได้เขียน';
          correctDisplay = q.model_answer || '(no model answer)';
        }

        // Resolve subject + topic once per row (was running .find()
        // twice in the JSX below — for 200 items that's 400 linear
        // scans of the 7-element SUBJECTS array per render).
        const subj = SUBJECT_BY_ID.get(q.subject);
        const topicMeta = q.topic && subj?.topics?.find((tp) => tp.id === q.topic);
        const rowKey = `${q.subject}:${q.id}`;
        const figureSrc = safeImageUrl(q.image || q.imagePath);
        const isCorrectCollapsed = correct && !expandedCorrect.has(rowKey);

        return (
          <div key={q.id} className={`vmx-review-item ${cls}`}>
            <div className="vmx-review-head">
              <span>
                Q{idx + 1}, {subj?.name || q.subject}
                {topicMeta ? <>, <span style={{ color: subj?.color || 'var(--clr-ink-soft)', fontWeight: 600 }}>{topicMeta.icon} {topicMeta.label.replace(/^คาบ\s*\d+(-\d+)?\s*,\s*/, '')}</span></> : null}
                {q.examOrigin && (
                  <span title="คำถามนี้อิงตามแนวที่เคยพบในการสอบประเภทเดียวกัน" style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 999, background: 'var(--clr-gold-soft)', color: 'var(--clr-ink)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--vmx-mono)' }}>
                    อิงแนวเดิม
                  </span>
                )}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {notes && notes[q.id] && (
                  <span
                    title="ข้อนี้มีโน้ตของคุณ — เลื่อนลงไปดู"
                    style={{
                      fontSize: 11,
                      padding: '2px 7px',
                      borderRadius: 999,
                      background: 'rgba(125, 74, 125, 0.15)',
                      color: 'var(--clr-plum-text, #7d4a7d)',
                      border: '1px solid var(--clr-plum, #7d4a7d)',
                      fontFamily: 'var(--vmx-mono)',
                      fontWeight: 600,
                    }}
                  >
                    มีโน้ต
                  </span>
                )}
                <button className={`vmx-bookmark-btn ${bookmarks.includes(q.id) ? 'active' : ''}`}
                  type="button"
                  style={{ position: 'static' }}
                  aria-label={bookmarks.includes(q.id) ? 'ยกเลิกบันทึกข้อนี้' : 'บันทึกข้อนี้ไว้ทบทวน'}
                  aria-pressed={bookmarks.includes(q.id)}
                  onClick={() => toggleBookmark(q.id)}>
                  {bookmarks.includes(q.id) ? '★' : '☆'}
                </button>
                <span className={`vmx-review-result ${correct ? 'ok' : (isOpen ? '' : (isPartial ? '' : 'no'))}`}
                  style={isOpen ? { background: 'rgba(184, 137, 64, 0.15)', color: 'var(--clr-gold-text)' } : isPartial ? { background: 'rgba(184,137,64,.15)', color: 'var(--clr-gold-text)' } : undefined}>
                  {!answered ? 'ข้าม' : isOpen ? 'ประเมินเอง' : (correct ? '✓ ถูก' : (isPartial ? `◐ ${ms.correct}/${ms.total}` : '✗ ผิด'))}
                </span>
              </div>
            </div>
            <h2 className="vmx-review-q"><RichText text={q.q} /></h2>

            {isCorrectCollapsed ? (
              <button
                type="button"
                className="vmx-review-expand"
                onClick={() => setExpandedCorrect((previous) => {
                  const next = new Set(previous);
                  next.add(rowKey);
                  return next;
                })}
                aria-expanded="false"
              >
                ดูคำตอบและเหตุผล
              </button>
            ) : (
            <>
            {figureSrc && (
              <div>
                <ZoomableImage
                  src={figureSrc}
                  alt={q.imageAlt || `ภาพประกอบข้อ ${q.id}`}
                  caption={q.imageCaption}
                  credit={q.imageCredit}
                  sourceUrl={q.imageSourceUrl}
                  maxHeight={320}
                />
                <button
                  type="button"
                  onClick={() => setAnnotateSrc(figureSrc)}
                  className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                  aria-label="เปิดเครื่องมือวาดทับภาพ"
                >
                  ทำเครื่องหมายบนภาพ
                </button>
              </div>
            )}
            {q.passage && (
              <div style={{ margin: '8px 0 12px', padding: '10px 14px', borderRadius: 10, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap', maxHeight: 220, overflowY: 'auto' }}>
                <div className="vmx-kicker" style={{ color: 'var(--clr-ink-soft)', marginBottom: 6 }}>
                  📄 {q.passage_title || 'Passage'}
                </div>
                <RichText text={q.passage} />
              </div>
            )}
            {(q.type === 'short' || q.type === 'essay') ? (
              <>
                <div style={{ margin: '8px 0 6px', padding: 10, borderRadius: 8, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
                  <div className="vmx-kicker" style={{ color: 'var(--clr-ink-soft)', marginBottom: 4 }}>คำตอบของคุณ</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap' }}>{userDisplay}</div>
                  {q.type === 'essay' && answered && typeof userAns === 'string' && userAns.trim() && (
                    <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)' }}>
                      📊 {userAns.trim().split(/\s+/).length} words
                    </div>
                  )}
                </div>
                {q.model_answer && (
                  <div style={{ marginBottom: 6, padding: 10, borderRadius: 8, background: 'rgba(74, 107, 74, 0.08)', border: '1px solid var(--clr-sage)' }}>
                    <div style={{ fontSize: 11, color: 'var(--clr-sage-text)', fontFamily: 'var(--vmx-mono)', marginBottom: 4, fontWeight: 600 }}>คำตอบตัวอย่างจากเฉลย</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap' }}>
                      <RichText text={q.model_answer} />
                    </div>
                  </div>
                )}
                {q.rubric && (
                  <div style={{ marginBottom: 6, padding: 10, borderRadius: 8, background: 'rgba(184, 137, 64, 0.08)', border: '1px solid var(--clr-gold)' }}>
                    <div style={{ fontSize: 11, color: 'var(--clr-gold-text)', fontFamily: 'var(--vmx-mono)', marginBottom: 4, fontWeight: 600 }}>เกณฑ์ให้คะแนน</div>
                    <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--clr-ink)', whiteSpace: 'pre-wrap' }}>
                      <RichText text={q.rubric} />
                    </div>
                  </div>
                )}
                <SmartGrader q={q} userAnswer={userAns} />
              </>
            ) : (
              <>
                <div className="vmx-review-ans"><span className="k">คำตอบของคุณ:</span>{userDisplay}</div>
                {!correct && <div className="vmx-review-ans correct-ans"><span className="k">เฉลย:</span>{correctDisplay}</div>}
              </>
            )}
            {q.explain && <div className="vmx-review-explain"><span className="k">เหตุผล:</span><RichText text={q.explain} /></div>}
            {/* For a missed question, offer the checked VetWiki summary — the
                highest-value moment to read the verified version. Correct
                answers don't need the nudge.

                articleForQuestion, not hasTopic: questions pulled from
                past-paper compilations carry the compilation's name as their
                topic, so matching on topic alone leaves them with nowhere to
                go even when the right article exists. */}
            {(() => {
              if (!onOpenWiki || correct || FEATURE_FLAGS.VETWIKI_ENABLED === false) return null;
              const article = articleForQuestion(q);
              if (!article) return null;
              // Say what is waiting on the other side. A topic where the
              // lecturer and the literature disagree is the single most
              // exam-useful thing this corpus holds, and a generic "read the
              // summary" link gives a student no reason to tap it.
              const conflicts = conflictCountFor(article.subject, article.topic);
              return (
                <button
                  type="button"
                  onClick={() => onOpenWiki(article.subject, article.topic, article.sectionId)}
                  style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, minHeight: 44, color: conflicts > 0 ? 'var(--clr-rose-text)' : 'var(--clr-sage-text)', fontSize: 12.5, fontWeight: 600 }}
                  title={conflicts > 0
                    ? 'หัวข้อนี้มีจุดที่หลักฐานไม่ตรงกับที่บรรยาย พร้อมคำแนะนำว่าเวลาสอบควรตอบอะไร'
                    : 'อ่านสรุปหัวข้อนี้แบบตรวจสอบที่มาได้'}
                >
                  {conflicts > 0
                    ? `🧬 หัวข้อนี้มี ${conflicts} จุดที่หลักฐานไม่ตรงกับที่บรรยาย →`
                    : '🧬 อ่านสรุปเรื่องนี้ใน VetWiki →'}
                </button>
              );
            })()}
            {q && q.id && (
              <ReviewNoteEditor qId={q.id} noteText={notes?.[q.id]} setNote={setNote} />
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
                        {it.year && <span style={{ marginLeft: 6, fontFamily: 'var(--vmx-mono)' }}>{it.year}</span>}
                        {it.by && <span style={{ marginLeft: 6, fontStyle: 'italic' }}>by {it.by}</span>}
                        <div style={{ marginTop: 3, fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)' }}>
                          {it.raw}
                        </div>
                        {it.note && (
                          <div style={{ marginTop: 3, fontSize: 11, fontStyle: 'italic', color: 'var(--clr-ink-soft)' }}>
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
                <strong>{q.flag.severity === 'major' ? 'ข้อควรระวังสำคัญ' : 'หมายเหตุ'}:</strong> {q.flag.note}
                {q.flag.sources?.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)' }}>
                    📖 {q.flag.sources.join(', ')}
                  </div>
                )}
              </div>
            )}
            {q.source && (
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic', fontFamily: 'var(--vmx-mono)' }}>
                แหล่งอ้างอิง: {q.source}
              </div>
            )}
            {/* Comments thread — opens lazily so we don't subscribe to
                200 realtime channels on a 200-Q exam review. */}
            {(() => {
              const key = `${q.subject}:${q.id}`;
              const isOpen = openComments.has(key);
              return (
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => toggleComments(key)}
                    className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                    style={{ fontSize: 12, padding: '4px 10px' }}
                    aria-expanded={isOpen}
                  >
                    💬 {isOpen ? 'ปิดความเห็น' : 'ดูความเห็น'}
                  </button>
                  {isOpen && (
                    <Suspense fallback={<div style={{ marginTop: 8, fontSize: 12, color: 'var(--clr-ink-soft)' }}>กำลังโหลด…</div>}>
                      <QComments qSubject={q.subject} qId={q.id} user={user} setView={setView} />
                    </Suspense>
                  )}
                </div>
              );
            })()}
            {correct && (
              <button
                type="button"
                className="vmx-review-expand"
                onClick={() => setExpandedCorrect((previous) => {
                  const next = new Set(previous);
                  next.delete(rowKey);
                  return next;
                })}
                aria-expanded="true"
              >
                ย่อคำตอบ
              </button>
            )}
            </>
            )}
          </div>
        );
      })}

      {/* Lazy-load sentinel — appended after the rendered slice. When it
          scrolls within 600px of viewport, useEffect above expands the
          window. Hidden when everything is already shown. */}
      {visibleCount < filtered.length && (
        <div ref={sentinelRef} style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-ink-soft)', fontSize: 12, fontFamily: 'var(--vmx-mono)' }}>
          กำลังโหลด {Math.min(filtered.length - visibleCount, PAGE)} ข้อถัดไป…
        </div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 30, flexWrap: 'wrap' }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('config')}>ทำชุดใหม่ →</button>
        <ReviewShareButton questions={questions} />
      </div>

      {annotateSrc && (
        <Suspense fallback={null}>
          <ImageAnnotator src={annotateSrc} onClose={() => setAnnotateSrc(null)} />
        </Suspense>
      )}
    </>
  );
}

function ReviewShareButton({ questions }) {
  const [hint, setHint] = useState('');
  if (!questions?.length) return null;
  return (
    <button
      type="button"
      className="vmx-btn vmx-btn-ghost"
      onClick={async () => {
        const res = await copyShareUrl(questions);
        setHint(res.ok ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกไม่ได้');
        setTimeout(() => setHint(''), 3000);
      }}
      title="แชร์ชุดโจทย์นี้ให้เพื่อน"
    >
      แชร์ชุดนี้{hint && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--clr-sage-text)' }}>{hint}</span>}
    </button>
  );
}

// SelfGradeHint was replaced by SmartGrader (src/components/SmartGrader.jsx)
// which adds keyword coverage, paraphrase detection, an interactive
// rubric checklist with auto-totalled score, and a confidence-calibration
// panel that tracks how well the user predicts their own grades over time.
