// ============================================================
// ReviewQueueView — Q submission review queue (Tier 1 + Tier 2)
// ============================================================
//
// Used by:
//   • Peer reviewers (role >= verified) → Tier 1 "Peer Review" queue
//     (statuses: in_peer_review + palm_review)
//   • Palm (role = founder) → also sees Tier 2 "Palm Final" tab
//     (status: palm_review only)
//
// Each card collapses by default (just the stem preview). Expanding
// loads previous reviews lazily and reveals the voting row:
//   ✅ Approve · ✏️ Nudge (feedback required) · ❌ Reject (feedback required)
//
// Optimistic update on vote — we keep the card visible with its
// new status badge until the next manual refresh. Own-submission
// cards are disabled (can't vote on your own work).
// ============================================================

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  fetchReviewQueue,
  fetchSubmissionReviews,
  fetchMyReputation,
  castReviewVote,
  statusMeta,
  ROLE_META,
  isReviewer,
  isPalmFounder,
} from '../lib/contributions.js';
import { SUBJECTS } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';
import StatePanel from '../components/StatePanel.jsx';

const STEM_PREVIEW_CHARS = 150;
const FEEDBACK_MIN_CHARS = 10;

export default function ReviewQueueView({ goHome, setView, user }) {
  const [rep, setRep] = useState(null);
  const [repLoading, setRepLoading] = useState(true);
  const [tab, setTab] = useState('peer'); // 'peer' | 'palm'
  const [queue, setQueue] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState('');

  // ─── Reputation load (gates everything below) ────────────────
  useEffect(() => {
    let alive = true;
    if (!user) {
      setRepLoading(false);
      return;
    }
    (async () => {
      try {
        const r = await fetchMyReputation();
        if (alive) setRep(r);
      } catch (err) {
        console.warn('fetchMyReputation failed:', err);
      } finally {
        if (alive) setRepLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [user]);

  // ─── Queue load (re-runs on tab switch + refresh) ────────────
  const loadQueue = useCallback(async () => {
    if (!user || !isReviewer(rep)) return;
    setQueueLoading(true);
    setQueueError('');
    try {
      const data = await fetchReviewQueue({
        founderOnly: tab === 'palm',
        limit: 50,
      });
      setQueue(data);
    } catch (err) {
      console.error('fetchReviewQueue failed:', err);
      setQueueError(err?.message || 'โหลด queue ไม่สำเร็จ');
    } finally {
      setQueueLoading(false);
    }
  }, [user, rep, tab]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // Optimistic vote handler — patches the card status locally so
  // the badge reflects the new state immediately. Caller still
  // receives the verdict so it can collapse the card.
  const applyOptimisticVote = useCallback((submissionId, newStatus) => {
    setQueue((prev) => prev.map((s) =>
      s.id === submissionId ? { ...s, status: newStatus } : s
    ));
  }, []);

  // Founder stats — declared at top level (Rules of Hooks: no
  // conditional hook calls). Returns null when user is not founder
  // so the panel render below can skip cleanly.
  const showPalmTab = isPalmFounder(rep);
  const founderStats = useMemo(() => {
    if (!showPalmTab) return null;
    return computeFounderStats(queue, tab);
  }, [queue, tab, showPalmTab]);

  // ─── Gate 1: not signed in ───────────────────────────────────
  if (!user) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-hero">
          <h1>คิว <em>รอตรวจ</em></h1>
          <p>ต้องเข้าสู่ระบบเพื่อรีวิว Q ที่ contributors ส่งเข้ามา</p>
        </div>
        <div style={emptyPanelStyle}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>🔒</div>
          <div style={{ fontSize: 15, marginBottom: 16, color: 'var(--clr-ink)' }}>
            Login เพื่อรีวิว
          </div>
          <button className="vmx-btn vmx-btn-primary" onClick={() => setView('auth')}>
            เข้าสู่ระบบ
          </button>
        </div>
      </>
    );
  }

  // ─── Gate 2: loading reputation ──────────────────────────────
  if (repLoading) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-hero">
          <h1>คิว <em>รอตรวจ</em></h1>
        </div>
        <div style={{ ...emptyPanelStyle, color: 'var(--clr-ink-soft)' }}>
          กำลังตรวจสิทธิ์...
        </div>
      </>
    );
  }

  // ─── Gate 3: not a reviewer yet ──────────────────────────────
  if (!isReviewer(rep)) {
    const currentRole = rep?.role || 'contributor';
    const roleInfo = ROLE_META[currentRole] || ROLE_META.contributor;
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-hero">
          <h1>คิว <em>รอตรวจ</em></h1>
          <p>หน้านี้สำหรับ peer reviewer ที่ได้รับ role ระดับ verified ขึ้นไป</p>
        </div>
        <div style={emptyPanelStyle}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>{roleInfo.icon}</div>
          <div style={{ fontSize: 14, color: 'var(--clr-ink)', marginBottom: 8 }}>
            สถานะปัจจุบัน: <strong style={{ color: roleInfo.color }}>{roleInfo.label}</strong>
          </div>
          <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7, marginBottom: 18, maxWidth: 360, margin: '0 auto 18px' }}>
            ยังไม่เปิดสิทธิ์รีวิว — ต้องมี role <strong>'verified'</strong> หรือสูงกว่า, Palm จะให้ role นี้กับ contributors ที่พิสูจน์คุณภาพแล้ว (มี submission ผ่าน peer review หลายข้อ และไม่มีประวัติ ban)
          </div>
          <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic' }}>
            อยากเริ่ม contribute? → ส่ง Q proposal เข้ามาก่อน
          </div>
          <div className="vmx-btn-row" style={{ marginTop: 18, justifyContent: 'center' }}>
            <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
          </div>
        </div>
      </>
    );
  }

  // ─── Main view: reviewer with at least one queue ─────────────
  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>คิว <em>รอตรวจ</em></h1>
        <p>
          วิเคราะห์ Q ที่ contributors ส่งเข้ามา, Approve / Nudge / Reject
          {', '}
          <span style={{ color: ROLE_META[rep.role]?.color || 'var(--clr-ink-soft)' }}>
            {ROLE_META[rep.role]?.icon} {ROLE_META[rep.role]?.label}
          </span>
        </p>
      </div>

      {/* Founder dashboard strip */}
      {showPalmTab && founderStats && (
        <div style={founderPanelStyle}>
          <FounderStat label="ทั้งหมด" value={founderStats.total} />
          <FounderStat label="Tier 1" value={founderStats.tier1Count} color="var(--clr-gold)" />
          <FounderStat label="Tier 2 (Palm)" value={founderStats.tier2Count} color="var(--clr-sage)" />
          <FounderStat label="รอเฉลี่ย" value={founderStats.avgWait} small />
        </div>
      )}

      {/* Tab bar + refresh */}
      <div style={tabBarStyle}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setTab('peer')}
            className={`vmx-chip ${tab === 'peer' ? 'active' : ''}`}
            style={{ fontWeight: tab === 'peer' ? 600 : 400 }}
          >
            Peer Review (Tier 1)
          </button>
          {showPalmTab && (
            <button
              onClick={() => setTab('palm')}
              className={`vmx-chip ${tab === 'palm' ? 'active' : ''}`}
              style={{ fontWeight: tab === 'palm' ? 600 : 400 }}
            >
              Palm Final (Tier 2)
            </button>
          )}
        </div>
        <button
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={loadQueue}
          disabled={queueLoading}
          style={{ flexShrink: 0 }}
          aria-label="Refresh"
        >
          {queueLoading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {/* Queue */}
      {queueError && queue.length > 0 && (
        <div style={{ padding: 14, borderRadius: 10, background: 'var(--clr-rose-soft)', border: '1px solid var(--clr-rose)', marginBottom: 14, fontSize: 13 }}>
          ⚠️ {queueError}
        </div>
      )}

      {queueLoading && queue.length === 0 ? (
        <StatePanel kind="loading" title="กำลังโหลด Review Queue…" />
      ) : queueError && queue.length === 0 ? (
        <StatePanel kind="error" title="โหลด Review Queue ไม่สำเร็จ" body={queueError} actionLabel="ลองอีกครั้ง" onAction={loadQueue} />
      ) : queue.length === 0 ? (
        <div style={emptyPanelStyle}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
          <div style={{ fontSize: 14, color: 'var(--clr-ink)' }}>
            {tab === 'palm'
              ? 'ไม่มี Q รอ Palm final, ทุกอย่างเรียบร้อย'
              : 'ไม่มี Q ค้างรอ peer review, กลับมาดูใหม่ภายหลัง'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {queue.map((s) => (
            <SubmissionCard
              key={s.id}
              submission={s}
              currentUserId={user.id}
              onVoted={applyOptimisticVote}
              onRefreshRequested={loadQueue}
            />
          ))}
        </div>
      )}

      <div className="vmx-btn-row" style={{ marginTop: 8 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}

// ─── Submission card with expand-to-vote behavior ──────────────
function SubmissionCard({ submission, currentUserId, onVoted, onRefreshRequested }) {
  const [expanded, setExpanded] = useState(false);
  const [stemFull, setStemFull] = useState(false);
  const [pastReviews, setPastReviews] = useState(null); // null = not loaded
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [voteMode, setVoteMode] = useState(null); // null | 'approve' | 'nudge' | 'reject'
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [voted, setVoted] = useState(false); // local "I just voted" lock

  const isOwn = submission.contributor_id === currentUserId;
  const meta = statusMeta(submission.status);
  const subject = SUBJECTS.find((sub) => sub.id === submission.subject);
  const topic = subject?.topics?.find((t) => t.id === submission.topic);

  // Lazy-load past reviews when card expands
  useEffect(() => {
    if (!expanded || pastReviews !== null) return;
    let alive = true;
    setReviewsLoading(true);
    fetchSubmissionReviews(submission.id)
      .then((rs) => { if (alive) setPastReviews(rs || []); })
      .catch(() => { if (alive) setPastReviews([]); })
      .finally(() => { if (alive) setReviewsLoading(false); });
    return () => { alive = false; };
  }, [expanded, submission.id, pastReviews]);

  const stem = submission.q_text || '';
  const stemPreview = stem.length > STEM_PREVIEW_CHARS && !stemFull
    ? stem.slice(0, STEM_PREVIEW_CHARS).trimEnd() + '…'
    : stem;
  const stemCollapsible = stem.length > STEM_PREVIEW_CHARS;

  const difficultyStars = (() => {
    const d = Number(submission.difficulty);
    if (!d || d < 1) return null;
    const filled = Math.max(1, Math.min(5, Math.round(d)));
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  })();

  const handleVoteClick = (mode) => {
    setVoteMode(mode);
    setVoteError('');
    if (mode === 'approve') {
      // approve has no feedback box — submit immediately for snappier UX
      submitVote('approve', null);
    }
  };

  const submitVote = async (verdict, feedbackText) => {
    if (submitting || voted) return;
    if ((verdict === 'nudge' || verdict === 'reject')) {
      const trimmed = (feedbackText || '').trim();
      if (trimmed.length < FEEDBACK_MIN_CHARS) {
        setVoteError(`ต้องอธิบายเหตุผลอย่างน้อย ${FEEDBACK_MIN_CHARS} ตัวอักษร`);
        return;
      }
    }
    setSubmitting(true);
    setVoteError('');
    try {
      const newStatus = await castReviewVote({
        submissionId: submission.id,
        verdict,
        feedback: feedbackText?.trim() || null,
      });
      setVoted(true);
      if (typeof newStatus === 'string') {
        onVoted(submission.id, newStatus);
      }
      // Trigger a queue refresh in background — picks up removed
      // items that have left the visible status window.
      setTimeout(() => onRefreshRequested?.(), 400);
    } catch (err) {
      console.error('castReviewVote failed:', err);
      setVoteError(err?.message || 'ส่ง vote ไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  const cardStyle = {
    padding: 16,
    borderRadius: 14,
    background: 'var(--clr-surface)',
    border: '1px solid var(--clr-border)',
    opacity: isOwn ? 0.55 : 1,
    transition: 'opacity 0.15s',
  };

  return (
    <div style={cardStyle}>
      {/* Status pill + meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          borderRadius: 999,
          background: 'var(--clr-surface-2)',
          color: meta.color,
          fontSize: 11,
          fontFamily: 'var(--vmx-mono)',
          border: `1px solid ${meta.color}33`,
        }}>
          {meta.icon} {meta.label}
        </span>
        <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
          {formatRelativeTime(submission.created_at)}
        </span>
      </div>

      {/* Subject + topic + difficulty */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {subject && (
          <span style={chipStyle}>{subject.icon} {subject.name}</span>
        )}
        {topic && (
          <span style={{ ...chipStyle, background: 'var(--clr-bg)' }}>{topic.label}</span>
        )}
        {difficultyStars && (
          <span style={{ ...chipStyle, color: 'var(--clr-gold-text)', background: 'var(--clr-bg)' }}>
            {difficultyStars}
          </span>
        )}
      </div>

      {/* Q stem */}
      <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--clr-ink)', marginBottom: 10, whiteSpace: 'pre-wrap' }}>
        {stemPreview}
        {stemCollapsible && (
          <button
            onClick={() => setStemFull((v) => !v)}
            style={inlineToggleStyle}
          >
            {stemFull ? '…ย่อ' : '…อ่านต่อ'}
          </button>
        )}
      </div>

      {/* Source compact */}
      {submission.source_type && (
        <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', marginBottom: 12 }}>
          📌 {submission.source_type}{submission.source_ref ? `, ${submission.source_ref.slice(0, 60)}` : ''}
        </div>
      )}

      {/* Own-submission notice */}
      {isOwn && (
        <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--clr-ink-soft)', padding: '8px 12px', background: 'var(--clr-surface-2)', borderRadius: 8, marginBottom: 8 }}>
          (submission ของคุณเอง — ไม่สามารถ vote ได้)
        </div>
      )}

      {/* Expand toggle */}
      {!expanded ? (
        <button
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={() => setExpanded(true)}
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={isOwn}
        >
          {isOwn ? 'ดูเต็ม (vote ไม่ได้)' : 'ดูเต็ม + รีวิว →'}
        </button>
      ) : (
        <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: 14, marginTop: 4 }}>
          {/* Full stem (always shown when expanded) */}
          <div style={sectionLabelStyle}>โจทย์เต็ม</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-ink)', marginBottom: 14, whiteSpace: 'pre-wrap', padding: 12, background: 'var(--clr-bg)', borderRadius: 8 }}>
            {stem}
          </div>

          {/* Options */}
          {Array.isArray(submission.options) && submission.options.length > 0 && (
            <>
              <div style={sectionLabelStyle}>ตัวเลือก</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {submission.options.map((opt, i) => {
                  const isCorrect = i === submission.answer_idx;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        fontSize: 13,
                        lineHeight: 1.6,
                        background: isCorrect ? 'rgba(74, 107, 74, 0.15)' : 'var(--clr-bg)',
                        border: isCorrect ? '1px solid var(--clr-sage)' : '1px solid var(--clr-border)',
                        color: 'var(--clr-ink)',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--vmx-mono)',
                        marginRight: 8,
                        color: isCorrect ? 'var(--clr-sage)' : 'var(--clr-ink-soft)',
                        fontWeight: isCorrect ? 600 : 400,
                      }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                      {isCorrect && (
                        <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--clr-sage)', fontFamily: 'var(--vmx-mono)' }}>
                          ← คำตอบ
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Explain */}
          {submission.explain_text && (
            <>
              <div style={sectionLabelStyle}>เฉลย / เหตุผล</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--clr-ink)', marginBottom: 14, whiteSpace: 'pre-wrap', padding: 12, background: 'var(--clr-surface-2)', borderRadius: 8 }}>
                {submission.explain_text}
              </div>
            </>
          )}

          {/* Source detail */}
          {(submission.source_ref || submission.contributor_note) && (
            <>
              <div style={sectionLabelStyle}>แหล่งที่มา + บันทึก contributor</div>
              <div style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--clr-ink-soft)', marginBottom: 14, padding: 12, background: 'var(--clr-bg)', borderRadius: 8 }}>
                {submission.source_type && <div style={{ fontFamily: 'var(--vmx-mono)', marginBottom: 4 }}>type: {submission.source_type}</div>}
                {submission.source_ref && <div style={{ marginBottom: submission.contributor_note ? 6 : 0 }}>📌 {submission.source_ref}</div>}
                {submission.contributor_note && <div style={{ fontStyle: 'italic' }}>💬 {submission.contributor_note}</div>}
              </div>
            </>
          )}

          {/* Past reviews */}
          {!isOwn && (
            <>
              <div style={sectionLabelStyle}>รีวิวที่ผ่านมา</div>
              <div style={{ marginBottom: 16 }}>
                {reviewsLoading ? (
                  <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', padding: '8px 0' }}>
                    โหลด...
                  </div>
                ) : !pastReviews || pastReviews.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', padding: '8px 12px', background: 'var(--clr-bg)', borderRadius: 8 }}>
                    ยังไม่มี vote — คุณเป็นคนแรก
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {pastReviews.map((r) => (
                      <PastReviewRow key={r.id} review={r} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Voting row */}
          {!isOwn && !voted && (
            <>
              <div style={sectionLabelStyle}>Vote</div>
              {voteMode === null ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8,
                  marginBottom: voteError ? 8 : 0,
                }}>
                  <button
                    className="vmx-btn"
                    style={voteBtnStyle('approve')}
                    onClick={() => handleVoteClick('approve')}
                    disabled={submitting}
                  >
                    Approve
                  </button>
                  <button
                    className="vmx-btn"
                    style={voteBtnStyle('nudge')}
                    onClick={() => handleVoteClick('nudge')}
                    disabled={submitting}
                  >
                    Nudge
                  </button>
                  <button
                    className="vmx-btn"
                    style={voteBtnStyle('reject')}
                    onClick={() => handleVoteClick('reject')}
                    disabled={submitting}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <FeedbackPrompt
                  mode={voteMode}
                  feedback={feedback}
                  onFeedbackChange={setFeedback}
                  onCancel={() => { setVoteMode(null); setFeedback(''); setVoteError(''); }}
                  onSubmit={() => submitVote(voteMode, feedback)}
                  submitting={submitting}
                />
              )}
              {voteError && (
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--clr-rose-text)', padding: '6px 10px', background: 'var(--clr-rose-soft)', borderRadius: 6 }}>
                  ⚠️ {voteError}
                </div>
              )}
              {submitting && voteMode === 'approve' && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', textAlign: 'center' }}>
                  กำลังส่ง approve...
                </div>
              )}
            </>
          )}

          {voted && (
            <div style={{ padding: 12, borderRadius: 10, background: 'rgba(74, 107, 74, 0.15)', border: '1px solid var(--clr-sage)', fontSize: 13, textAlign: 'center', color: 'var(--clr-ink)' }}>
              ✓ บันทึก vote แล้ว — ขอบคุณที่ช่วยรักษาคุณภาพ Q bank 🙏
            </div>
          )}

          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="vmx-btn vmx-btn-ghost vmx-btn-sm"
              onClick={() => { setExpanded(false); setVoteMode(null); setFeedback(''); setVoteError(''); }}
            >
              ↑ ย่อกลับ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Feedback textarea for nudge / reject ──────────────────────
function FeedbackPrompt({ mode, feedback, onFeedbackChange, onCancel, onSubmit, submitting }) {
  const config = mode === 'nudge'
    ? {
        label: 'Nudge — ขอแก้',
        hint: 'อธิบายว่า contributor ควรแก้อะไร, จะส่งกลับให้แก้ใหม่ (revise)',
        placeholder: 'เช่น "options C/D ยาวเกินไป เป็น length-bias / เฉลยขาด rationale ทำไมตัวอื่นผิด"',
        confirmLabel: 'ส่ง Nudge',
        accent: 'var(--clr-gold)',
      }
    : {
        label: 'Reject',
        hint: 'อธิบายว่าทำไม Q นี้ไม่ผ่าน, contributor จะเห็นเหตุผลและ Q จะถูก reject ออกจาก queue',
        placeholder: 'เช่น "ข้อนี้ผิดทาง pharmacology หลัก / อ้างอิงไม่ตรงกับเนื้อหา"',
        confirmLabel: 'ยืนยัน Reject',
        accent: 'var(--clr-rose)',
      };

  return (
    <div style={{ padding: 14, borderRadius: 10, background: 'var(--clr-bg)', border: `1px solid ${config.accent}` }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: config.accent, marginBottom: 4 }}>
        {config.label}
      </div>
      <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.6 }}>
        {config.hint}
      </div>
      <textarea
        aria-label={`${config.label} feedback`}
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value.slice(0, 1500))}
        placeholder={config.placeholder}
        rows={4}
        style={{
          width: '100%',
          minHeight: 90,
          padding: 10,
          border: '1px solid var(--clr-border)',
          borderRadius: 8,
          background: 'var(--clr-surface)',
          color: 'var(--clr-ink)',
          fontSize: 13,
          lineHeight: 1.6,
          fontFamily: 'system-ui, sans-serif',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
        maxLength={1500}
        autoFocus
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: feedback.trim().length >= FEEDBACK_MIN_CHARS ? 'var(--clr-sage)' : 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
          {feedback.trim().length}/{FEEDBACK_MIN_CHARS}+ chars
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={onCancel}
            disabled={submitting}
            type="button"
          >
            ยกเลิก
          </button>
          <button
            className="vmx-btn vmx-btn-sm"
            onClick={onSubmit}
            disabled={submitting || feedback.trim().length < FEEDBACK_MIN_CHARS}
            type="button"
            style={{
              background: config.accent,
              color: 'white',
              borderColor: config.accent,
            }}
          >
            {submitting ? 'กำลังส่ง...' : config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Past review row ───────────────────────────────────────────
function PastReviewRow({ review }) {
  const verdictMeta = {
    approve: { icon: '✅', label: 'Approved', color: 'var(--clr-sage)' },
    nudge: { icon: '✏️', label: 'Nudge', color: 'var(--clr-gold-text)' },
    reject: { icon: '❌', label: 'Rejected', color: 'var(--clr-rose-text)' },
  }[review.verdict] || { icon: '?', label: review.verdict, color: 'var(--clr-ink-soft)' };

  return (
    <div style={{ padding: 10, background: 'var(--clr-bg)', borderRadius: 8, fontSize: 12, lineHeight: 1.6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: review.feedback ? 4 : 0 }}>
        <span style={{ color: verdictMeta.color, fontWeight: 600 }}>
          {verdictMeta.icon} {verdictMeta.label}
        </span>
        {review.is_palm_review && (
          <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: 'rgba(167, 61, 74, 0.15)', color: 'var(--clr-rose-text)', fontFamily: 'var(--vmx-mono)' }}>
            👑 Palm
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)' }}>
          {formatRelativeTime(review.created_at)}
        </span>
      </div>
      {review.feedback && (
        <div style={{ color: 'var(--clr-ink-soft)', fontStyle: 'italic', whiteSpace: 'pre-wrap', paddingLeft: 4 }}>
          " {review.feedback} "
        </div>
      )}
    </div>
  );
}

// ─── Founder stats card ────────────────────────────────────────
function FounderStat({ label, value, color, small }) {
  return (
    <div style={{
      padding: '8px 10px',
      borderRadius: 8,
      background: 'var(--clr-surface)',
      flex: '1 1 0',
      minWidth: 70,
      textAlign: 'center',
      border: '1px solid var(--clr-border)',
    }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', letterSpacing: '0.05em', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        fontSize: small ? 13 : 18,
        fontWeight: 600,
        fontFamily: 'Fraunces, serif',
        color: color || 'var(--clr-ink)',
      }}>
        {value}
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────
function computeFounderStats(queue, tab) {
  const tier1Count = queue.filter((s) => s.status === 'in_peer_review').length;
  const tier2Count = queue.filter((s) => s.status === 'palm_review').length;
  const total = queue.length;
  // Mean wait time across the currently-loaded window. For an empty
  // queue we just show "—" rather than NaN.
  let avgWait = '—';
  if (queue.length > 0) {
    const now = Date.now();
    const sumMs = queue.reduce((acc, s) => {
      const t = s.created_at ? new Date(s.created_at).getTime() : now;
      return acc + (now - t);
    }, 0);
    const meanHours = sumMs / queue.length / (1000 * 60 * 60);
    avgWait = meanHours < 24
      ? `${Math.round(meanHours)}h`
      : `${Math.round(meanHours / 24)}d`;
  }
  return { total, tier1Count, tier2Count, avgWait, tab };
}

function formatRelativeTime(iso) {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const diffMs = Date.now() - t;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'เมื่อกี้';
  if (mins < 60) return `${mins} นาที`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} ชม.`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} วัน`;
  const months = Math.round(days / 30);
  return `${months} เดือน`;
}

// ─── Inline style constants ────────────────────────────────────
const emptyPanelStyle = {
  padding: '28px 20px',
  borderRadius: 14,
  background: 'var(--clr-surface)',
  border: '1px solid var(--clr-border)',
  textAlign: 'center',
  marginBottom: 16,
};

const founderPanelStyle = {
  display: 'flex',
  gap: 8,
  marginBottom: 12,
  flexWrap: 'wrap',
  padding: 10,
  borderRadius: 12,
  background: 'var(--clr-surface-2)',
  border: '1px dashed var(--clr-border)',
};

const tabBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
  marginBottom: 14,
  flexWrap: 'wrap',
};

const chipStyle = {
  padding: '3px 10px',
  borderRadius: 999,
  background: 'var(--clr-surface-2)',
  fontSize: 11,
  fontFamily: 'var(--vmx-mono)',
  color: 'var(--clr-ink-soft)',
};

const sectionLabelStyle = {
  fontSize: 11,
  fontFamily: 'var(--vmx-mono)',
  color: 'var(--clr-ink-soft)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const inlineToggleStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--clr-sage)',
  cursor: 'pointer',
  fontSize: 13,
  padding: '0 4px',
  fontFamily: 'inherit',
};

function voteBtnStyle(kind) {
  const palette = {
    approve: { bg: 'var(--clr-sage)', border: 'var(--clr-sage)' },
    nudge: { bg: 'var(--clr-gold)', border: 'var(--clr-gold)' },
    reject: { bg: 'var(--clr-rose)', border: 'var(--clr-rose)' },
  }[kind];
  return {
    background: palette.bg,
    color: 'white',
    border: `1px solid ${palette.border}`,
    minHeight: 44,
    fontSize: 13,
    fontWeight: 600,
    justifyContent: 'center',
  };
}
