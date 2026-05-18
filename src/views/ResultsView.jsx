import { useEffect, useMemo, useRef, useState } from 'react';
import { isCorrect, isWritingType } from '../hooks/utils.js';
import BackBar from '../components/BackBar.jsx';
import { buildShareUrl, copyShareUrl } from '../lib/share-link.js';
import { copyText } from '../lib/clipboard.js';
import { SUBJECTS } from '../data/curriculum.js';

// Render a 1080×1920 portrait score card (IG Story aspect 9:16) onto a
// canvas and return a Blob. Pure-canvas, no external deps. Designed to
// look readable on a phone-screen story preview without IG-internal
// chrome cropping anything important. The "VetMock @vetmock.cu" mark
// is a small but persistent watermark — when shared, friends who see
// the story can find the app from that handle.
function buildScoreCard({ pct, correct, total, subject, mode, isWritingOnly, writingDone, writingTotal }) {
  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background gradient (warm cream → soft sage, matches app palette)
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#fdf6e9');
  bg.addColorStop(0.55, '#f5ead0');
  bg.addColorStop(1, '#dde6dc');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle dotted texture
  ctx.fillStyle = 'rgba(43, 36, 25, 0.04)';
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * W, y = Math.random() * H, r = 1 + Math.random() * 2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  // Top label row: VetMock + mode tag
  ctx.fillStyle = '#2b2419';
  ctx.font = '600 64px "Fraunces", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('VetMock', 80, 180);
  ctx.font = '500 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#6b6055';
  ctx.fillText(mode === 'exam' ? 'EXAM MODE' : 'PRACTICE', 80, 230);

  // Big score (or writing icon)
  if (isWritingOnly) {
    ctx.textAlign = 'center';
    ctx.font = '600 360px "Fraunces", serif';
    ctx.fillStyle = '#b88940';
    ctx.fillText('✍️', W / 2, 800);
    ctx.font = '500 60px "Fraunces", serif';
    ctx.fillStyle = '#2b2419';
    ctx.fillText('Writing Practice', W / 2, 920);
    ctx.font = '400 44px "JetBrains Mono", monospace';
    ctx.fillStyle = '#6b6055';
    ctx.fillText(`${writingDone} / ${writingTotal}`, W / 2, 990);
  } else {
    ctx.textAlign = 'center';
    ctx.font = '700 480px "Fraunces", serif';
    const scoreColor = pct >= 80 ? '#4a6b4a' : pct >= 60 ? '#b88940' : '#c26d6d';
    ctx.fillStyle = scoreColor;
    ctx.fillText(`${pct}`, W / 2, 850);
    ctx.font = '500 100px "Fraunces", serif';
    ctx.fillText('%', W / 2 + (`${pct}`.length === 3 ? 280 : 220), 700);
    ctx.font = '500 56px "Fraunces", serif';
    ctx.fillStyle = '#2b2419';
    ctx.fillText(`${correct} / ${total} ถูก`, W / 2, 970);
  }

  // Subject pill
  if (subject && subject !== 'all') {
    ctx.fillStyle = 'rgba(74, 107, 74, 0.15)';
    ctx.beginPath();
    const pillW = 360, pillH = 80, pillX = (W - pillW) / 2, pillY = 1080;
    ctx.roundRect(pillX, pillY, pillW, pillH, 40);
    ctx.fill();
    ctx.fillStyle = '#4a6b4a';
    ctx.font = '500 36px "JetBrains Mono", monospace';
    ctx.fillText(subject.toUpperCase(), W / 2, 1135);
  }

  // Encouragement line — short Thai
  let msg = '';
  if (isWritingOnly) msg = 'เขียนไปแล้ว, ลองดู AI feedback ใน VetMock';
  else if (pct === 100) msg = 'เทพสุดๆ 🏆 อ่านต่อมาเรื่อยๆ';
  else if (pct >= 80) msg = 'ใกล้แล้ว, อ่านอีกนิดเดียว';
  else if (pct >= 60) msg = 'ผ่านครับ, ทบทวนข้อที่ผิด';
  else if (pct >= 40) msg = 'สู้ๆ, กลับไปทบทวนเนื้อหาอีกรอบ';
  else msg = 'เริ่มใหม่ได้เสมอ 💪';
  ctx.font = '400 44px "Fraunces", serif';
  ctx.fillStyle = '#3d342a';
  ctx.fillText(msg, W / 2, 1300);

  // Bottom watermark — persistent IG handle
  ctx.font = '600 56px "Fraunces", serif';
  ctx.fillStyle = '#2b2419';
  ctx.fillText('vetmock.vercel.app', W / 2, 1700);
  ctx.font = '500 40px "JetBrains Mono", monospace';
  ctx.fillStyle = '#b88940';
  ctx.fillText('📷 @vetmock.cu', W / 2, 1770);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
}

// Phase label map — mirrors header pill in App.jsx
const PHASE_LABEL_RES = {
  '1-mid':   'ทม.1 กลาง',
  '1-final': 'ทม.1 ปลาย',
  '2-mid':   'ทม.2 กลาง',
  '2-final': 'ทม.2 ปลาย',
};

export default function ResultsView({
  score,
  questions,
  answers,
  goHome,
  setView,
  mode,
  selectedYear = 4,
  selectedPhase,
  // Phase 2 (2026-05-18): "next play" CTAs need to relaunch exam
  // rounds without the user manually navigating Subject → Config.
  // App.jsx passes startExam + state setters so we can fire 1-tap
  // continue / redo flows.
  startExam,
  setSubject,
  setTopic,
  setPracticeMode,
  setMode,
  setNumQuestions,
  setUseTimer,
  replayQuestions,
  // Round 2B 2026-05-18: when this session came from a challenge link,
  // app parses `?sc=…&by=…` and passes the parsed payload. Drives the
  // post-exam comparison panel + win/lose framing.
  challengeSender,
  // Round 3 2026-05-18: examStartTime → compute receiver elapsed time
  // for "เทียบคะแนน/เวลา" (Phase 5 spec). When this user later shares
  // the same set, their own time goes into the URL for THEIR receiver.
  examStartTime,
}) {
  // Receiver's elapsed time (seconds since exam started). Round to int
  // because URL/display granularity is per-second. Null when start time
  // is missing (e.g. legacy session).
  const receiverDurationSec = useMemo(() => {
    if (!Number.isFinite(examStartTime) || examStartTime <= 0) return null;
    const ms = Date.now() - examStartTime;
    if (ms <= 0) return null;
    return Math.max(1, Math.min(9999, Math.round(ms / 1000)));
  }, [examStartTime]);
  const phaseLabel = selectedPhase ? PHASE_LABEL_RES[selectedPhase] : null;
  // Fire confetti once on mount for a perfect auto-graded score.
  // Lazy-imported so the canvas/animation code never hits the
  // main bundle. Guarded by useRef so React StrictMode's double
  // Clear the in-flight exam key once we're safely mounted with a
  // score in hand. App.jsx now keeps the key (tagged submitted)
  // through finishExam so a chunk-load failure mid-deploy doesn't
  // strand the user on a blank screen — ReviewView can replay.
  useEffect(() => {
    try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
  }, []);

  // mount in dev doesn't trigger the burst twice.
  // Personal-best tracking — per-subject highest pct ever recorded in
  // a 5+ Q session. Surfaced as a "🏆 NEW PERSONAL BEST" banner +
  // independent confetti burst on top of the score-based celebration.
  const [personalBest, setPersonalBest] = useState(null);
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    if (score.total === 0) return;
    // Tiered confetti: perfect score = full burst (3 sources), 90%+ = single
    // burst, 80%+ = small celebration. pct uses correct/total directly to
    // avoid the 99.5%→round-to-100% false-fire.
    const ratio = score.correct / score.total;
    const pct = Math.round(ratio * 100);
    const isPerfect = score.correct === score.total;
    const isExcellent = !isPerfect && ratio >= 0.9 && score.total >= 5;
    const isGood = !isPerfect && !isExcellent && ratio >= 0.8 && score.total >= 5;

    // ── Personal-best detection (only for sessions ≥5 Q in a single subject)
    let isPB = false;
    try {
      const subj = questions[0]?.subject;
      const allSameSubj = subj && questions.every((q) => q.subject === subj);
      if (allSameSubj && score.total >= 5) {
        const raw = window.localStorage.getItem('vmx-personal-best');
        const map = raw ? JSON.parse(raw) : {};
        const prev = map[subj] || 0;
        if (pct > prev) {
          map[subj] = pct;
          window.localStorage.setItem('vmx-personal-best', JSON.stringify(map));
          // Only flag as PB (banner + confetti) when ≥60%. Below that we
          // still record the new high-water mark in localStorage but
          // don't celebrate — first-time users hitting 10% shouldn't
          // see "NEW PERSONAL BEST" since the prior baseline was just 0.
          if (pct >= 60) {
            isPB = true;
            setPersonalBest({ subj, pct, prev });
          }
        }
      }
    } catch {}

    if (!isPerfect && !isExcellent && !isGood && !isPB) return;
    firedRef.current = true;
    import('../lib/confetti.js').then((m) => {
      if (isPerfect) {
        m.fireConfetti({ count: 140 });
        setTimeout(() => m.fireConfetti({ count: 80, originXRatio: 0.2 }), 250);
        setTimeout(() => m.fireConfetti({ count: 80, originXRatio: 0.8 }), 500);
      } else if (isExcellent) {
        m.fireConfetti({ count: 90 });
      } else if (isGood) {
        m.fireConfetti({ count: 50 });
      }
      if (isPB) {
        // Distinct PB burst (gold) — fires after the score burst
        setTimeout(() => m.fireConfetti({ count: 60, originXRatio: 0.5 }), 700);
      }
    }).catch(() => {});
  }, [score.correct, score.total, questions]);

  // Split writing from auto-graded for the result counts so writing
  // questions don't show up as "wrong" — they need Self/AI grading.
  const autoQs = questions.filter((q) => !isWritingType(q));
  const writingQs = questions.filter((q) => isWritingType(q));
  const wrongCount = autoQs.filter((q) => answers[q.id] !== undefined && !isCorrect(q, answers[q.id])).length;
  const skipCount = autoQs.filter((q) => answers[q.id] === undefined).length;
  const writingAttempted = writingQs.filter((q) => {
    const ua = answers[q.id];
    return typeof ua === 'string' && ua.trim().length > 0;
  }).length;

  // Pick a message that matches what the user actually did:
  // pure-writing sessions don't have a percentage, so a "low score"
  // pep-talk is misleading. Show a writing-specific message instead.
  const msg = autoQs.length === 0
    ? (writingAttempted === writingQs.length && writingQs.length > 0
        ? '"เขียนครบทุกข้อแล้ว ✍️ ไปดูเฉลย / AI grade ได้เลย"'
        : writingAttempted > 0
          ? '"เขียนได้ส่วนหนึ่งแล้ว ✍️ ลองดูเฉลย + AI feedback"'
          : '"ยังไม่ได้เขียนข้อไหนเลย — กลับไปลองอีกที 💪"')
    : score.pct === 100 ? '"เทพสุดๆ เก่งมากก 🏆"'
    : score.pct >= 80 ? '"โค้ดดดด ใกล้จะผ่านแล้ว อ่านอีกนิดนึง"'
    : score.pct >= 60 ? '"ผ่านครับ แต่ต้องอ่านซ้ำส่วนที่ผิด"'
    : score.pct >= 40 ? '"สู้ๆ นะ กลับไปทบทวนเนื้อหาอีกรอบกันเถอะ"'
    : '"ไม่เป็นไร เริ่มใหม่ได้เสมอ 💪"';

  const isExam = mode === 'exam';
  // pass/fail only meaningful for auto-graded sessions; pure-writing
  // mocks (autoQs.length === 0) get neither banner since the engine
  // can't actually compute pass/fail without manual/AI grading
  const passed = autoQs.length > 0 && score.pct >= 60;
  const showPassFail = isExam && autoQs.length > 0;

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      {(phaseLabel || selectedYear) && (
        <div style={{
          marginBottom: 12, display: 'flex', gap: 6, justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          letterSpacing: '0.08em', color: 'var(--clr-ink-soft)',
        }}>
          <span style={{
            padding: '3px 10px', borderRadius: 999,
            background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)',
          }}>
            🎓 ปี {selectedYear}{phaseLabel ? ` · ${phaseLabel}` : ''}
          </span>
        </div>
      )}
      {showPassFail && (
        <div style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.15em', color: 'var(--clr-ink-soft)' }}>
          {passed ? '✓ PASSED' : '✗ FAILED'}, EXAM MODE
        </div>
      )}
      {isExam && autoQs.length === 0 && writingQs.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.15em', color: 'var(--clr-gold)' }}>
          ✍️ WRITING SESSION, GRADE IN REVIEW
        </div>
      )}
      {personalBest && (
        <div style={{
          marginBottom: 16, padding: '10px 16px', borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(184,137,64,0.18), rgba(184,137,64,0.10))',
          border: '1px solid var(--clr-gold)', textAlign: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, letterSpacing: '0.05em',
          color: 'var(--clr-gold, #b88940)', fontWeight: 700,
        }}>
          🏆 NEW PERSONAL BEST · {personalBest.pct}% (เดิม {personalBest.prev}%)
        </div>
      )}

      <div className="vmx-results-hero">
        {autoQs.length > 0 ? (
          <>
            <h2 className={`vmx-score-big ${score.pct >= 60 ? 'pass' : 'fail'}`}>
              {score.pct}<span style={{ fontSize: '0.4em', fontWeight: 400 }}>%</span>
            </h2>
            <div className="vmx-score-label">Auto-graded Score</div>
            <div className="vmx-score-frac">{score.correct} / {autoQs.length} ถูก</div>
          </>
        ) : (
          <>
            <h2 className="vmx-score-big" style={{ color: 'var(--clr-gold)' }}>
              ✍️
            </h2>
            <div className="vmx-score-label">Writing Practice Done</div>
            <div className="vmx-score-frac">{writingAttempted} / {writingQs.length} ข้อเขียนเสร็จ</div>
          </>
        )}
        {writingQs.length > 0 && autoQs.length > 0 && (
          <div style={{ marginTop: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(184, 137, 64, 0.12)', border: '1px solid var(--clr-gold)', display: 'inline-block', fontSize: 12, color: 'var(--clr-ink)', fontFamily: 'JetBrains Mono, monospace' }}>
            ✍️ มีข้อเขียน {writingQs.length} ข้อ — ตรวจใน "ดูเฉลย" (Self / 🤖 AI)
          </div>
        )}
        <div className="vmx-score-msg">{msg}</div>
      </div>

      <div className="vmx-stat-grid">
        <div className="vmx-stat-card">
          <div className="vmx-stat-num" style={{ color: 'var(--clr-sage)' }}>{score.correct}</div>
          <div className="vmx-stat-lbl">Correct</div>
        </div>
        <div className="vmx-stat-card">
          <div className="vmx-stat-num" style={{ color: 'var(--clr-rose)' }}>{wrongCount}</div>
          <div className="vmx-stat-lbl">Wrong</div>
        </div>
        <div className="vmx-stat-card">
          <div className="vmx-stat-num" style={{ color: 'var(--clr-gold)' }}>{skipCount}</div>
          <div className="vmx-stat-lbl">Skipped</div>
        </div>
        {writingQs.length > 0 && (
          <div className="vmx-stat-card">
            <div className="vmx-stat-num" style={{ color: 'var(--clr-plum, #7d4a7d)' }}>{writingAttempted}/{writingQs.length}</div>
            <div className="vmx-stat-lbl">✍️ Writing</div>
          </div>
        )}
      </div>

      {/* Challenge comparison — shown ONLY when receiver finishes a
          challenge link with sender's score embedded. Round 2B 2026-05-18.
          Round 3 (Phase 5 "เทียบคะแนน/เวลา"): also passes the receiver's
          elapsed time when available so the box can show side-by-side
          score AND time. */}
      {challengeSender?.senderScore && autoQs.length > 0 && (
        <ChallengeComparisonBox
          sender={challengeSender}
          receiverScore={{ correct: score.correct, total: autoQs.length }}
          receiverTimeSec={receiverDurationSec}
        />
      )}

      <NextPlayPanel
        autoQs={autoQs}
        wrongCount={wrongCount}
        score={score}
        goHome={goHome}
        setView={setView}
        questions={questions}
        answers={answers}
        startExam={startExam}
        setSubject={setSubject}
        setTopic={setTopic}
        setPracticeMode={setPracticeMode}
        setMode={setMode}
        setNumQuestions={setNumQuestions}
        setUseTimer={setUseTimer}
        replayQuestions={replayQuestions}
        receiverDurationSec={receiverDurationSec}
      />

      <RecommendationsBox
        autoQs={autoQs}
        wrongCount={wrongCount}
        questions={questions}
        answers={answers}
        score={score}
      />

      {/* Share tier — high scores get IG Story share (people share wins);
          low/mid scores get challenge framing (people share questions, not
          bad scores). Pure-writing always sees share since there's no
          embarrassing score. Threshold 70% per Palm spec 2026-05-18. */}
      {(autoQs.length === 0 || score.pct >= 70) ? (
        <ShareToIGRow
          pct={score.pct}
          correct={score.correct}
          total={autoQs.length}
          subject={questions[0]?.subject || 'all'}
          mode={mode}
          isWritingOnly={autoQs.length === 0}
          writingDone={writingAttempted}
          writingTotal={writingQs.length}
        />
      ) : (
        <ChallengeFriendRow questions={questions} score={score} />
      )}
    </>
  );
}

// ─── NextPlayPanel — Phase 2 (2026-05-18) ──────────────────────────
// Priority-ordered CTAs based on (a) did they get any wrong? (b) was
// this a single-subject set? Goal: turn ResultsView from a dead-end
// ("← กลับหน้าแรก") into a 1-tap continuation that compounds the
// study session. Mirrors NextActionCard's priority pattern.
function NextPlayPanel({
  autoQs,
  wrongCount,
  score,
  goHome,
  setView,
  questions,
  answers,
  startExam,
  setSubject,
  setTopic,
  setPracticeMode,
  setMode,
  setNumQuestions,
  setUseTimer,
  replayQuestions,
  // Round 4 hotfix 2026-05-18: receiverDurationSec lives in parent
  // ResultsView scope. Sub-component (this one) was referencing it
  // unresolved → ReferenceError at runtime crashed every Results view.
  // Pass through as prop so the ChallengeQuizButton + SendToGroupButton
  // calls below get the correct elapsed time for sender-side URL.
  receiverDurationSec,
}) {
  // Detect single-subject + single-topic context so we can offer
  // "continue this topic" buttons rather than generic "random".
  const ctx = useMemo(() => {
    if (!questions || questions.length === 0) return { subj: null, topic: null };
    const subj = questions[0]?.subject || null;
    const topic = questions[0]?.topic || null;
    const allSameSubj = subj && questions.every((q) => q.subject === subj);
    const allSameTopic = topic && questions.every((q) => q.topic === topic);
    return {
      subj: allSameSubj ? subj : null,
      topic: allSameSubj && allSameTopic ? topic : null,
    };
  }, [questions]);

  const subjMeta = ctx.subj ? SUBJECTS.find((s) => s.id === ctx.subj) : null;
  const subjLabel = subjMeta?.name || ctx.subj || '';
  // Truncate long topic labels (Thai labels often have leading number/dot)
  const topicLabel = ctx.topic
    ? (questions[0]?.topic_label || ctx.topic).replace(/^[\d\s.·\-]+/, '').trim().slice(0, 28)
    : '';

  // Pure-writing → keep classic flow (review needed for AI grade)
  if (autoQs.length === 0) {
    return (
      <div className="vmx-btn-row" style={{ flexWrap: 'wrap', marginTop: 16 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome} style={{ minHeight: 44 }}>← กลับหน้าแรก</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('review')} style={{ minHeight: 44 }}>📖 ดูเฉลย + AI grade →</button>
        <ShareQuizButton questions={questions} />
      </div>
    );
  }

  // Build the wrong-Qs sub-array from THIS session (not history).
  // We hand the slice to App via replayQuestions so the new round is
  // a precise redo, not a cross-history scan.
  const wrongQs = useMemo(
    () => autoQs.filter((q) => answers[q.id] !== undefined && !isCorrect(q, answers[q.id])),
    [autoQs, answers],
  );

  const handleRedoWrong = () => {
    if (wrongQs.length === 0) return;
    if (typeof replayQuestions === 'function') {
      replayQuestions(wrongQs);
    } else {
      // Fallback: cross-history wrong via practiceMode='wrong'
      startExam?.({
        practiceMode: 'wrong',
        subject: 'all',
        topic: null,
        questionCategory: 'all',
        numQuestions: Math.max(5, Math.min(wrongQs.length, 20)),
        useTimer: false,
      });
    }
  };

  const handleContinueMore = (n) => {
    if (!startExam) return;
    setMode?.('quick');
    setSubject?.(ctx.subj || 'all');
    setTopic?.(ctx.topic || null);
    setPracticeMode?.('all');
    setNumQuestions?.(n);
    setUseTimer?.(false);
    startExam({
      practiceMode: 'all',
      subject: ctx.subj || 'all',
      topic: ctx.topic || null,
      questionCategory: 'all',
      numQuestions: n,
      useTimer: false,
    });
  };

  // hasWrong → primary = fix wrong · noWrong → primary = continue
  const hasWrong = wrongQs.length > 0;
  const continueLabel = ctx.topic
    ? `🚀 ทำหัวข้อนี้ต่ออีก 5 ข้อ`
    : ctx.subj
      ? `🚀 ทำ${subjLabel}ต่ออีก 5 ข้อ`
      : `🚀 ทำต่ออีก 5 ข้อ`;
  const continueSub = ctx.topic
    ? topicLabel
    : ctx.subj
      ? subjLabel
      : 'สุ่มจากทุกวิชาในปีนี้';

  return (
    <div style={{ marginTop: 18 }}>
      {/* Action stack — primary card on top, secondary row below. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {hasWrong ? (
          <button
            type="button"
            onClick={handleRedoWrong}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '14px 16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(167, 61, 74, 0.12), rgba(167, 61, 74, 0.04))',
              border: '2px solid var(--clr-rose, #a73d4a)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              minHeight: 56,
            }}
            aria-label={`ทำซ้ำ ${wrongQs.length} ข้อที่ตอบผิดในรอบนี้`}
          >
            <div style={{ fontSize: 28, lineHeight: 1 }}>🎯</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: 'var(--clr-ink)' }}>
                แก้ข้อที่ผิด {wrongQs.length} ข้อ ทันที
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
                ทำซ้ำเฉพาะข้อในรอบนี้ที่ตอบผิด
              </div>
            </div>
            <div style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: 'var(--clr-rose, #a73d4a)',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              ลุย →
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleContinueMore(5)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '14px 16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(74, 107, 74, 0.12), rgba(74, 107, 74, 0.04))',
              border: '2px solid var(--clr-sage, #4a6b4a)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              minHeight: 56,
            }}
            aria-label={continueLabel}
          >
            <div style={{ fontSize: 28, lineHeight: 1 }}>🚀</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: 'var(--clr-ink)' }}>
                {continueLabel.replace('🚀 ', '')}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
                {continueSub}
              </div>
            </div>
            <div style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: 'var(--clr-sage, #4a6b4a)',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              ลุย →
            </div>
          </button>
        )}

        {/* Secondary row — ดูเฉลย + ทำหัวข้อนี้ต่อ (when hasWrong) */}
        <div className="vmx-btn-row" style={{ flexWrap: 'wrap', gap: 8 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={() => setView('review')} style={{ minHeight: 44 }}>
            📖 ดูเฉลย
          </button>
          {hasWrong && ctx.subj && (
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost"
              onClick={() => handleContinueMore(5)}
              style={{ minHeight: 44 }}
              title={ctx.topic ? `สุ่ม 5 ข้อใหม่ในหัวข้อ ${topicLabel}` : `สุ่ม 5 ข้อใหม่ในวิชา ${subjLabel}`}
            >
              📚 ทำ{ctx.topic ? 'หัวข้อ' : 'วิชา'}นี้อีก 5 ข้อ
            </button>
          )}
          <ChallengeQuizButton questions={questions} score={score} senderTimeSec={receiverDurationSec} />
          {/* Round 2B 2026-05-18: race-room shortcut. Skips the Race
              entry page — just routes to RaceView (it handles its own
              flow). Future enhancement: pass current questions[] as
              seed when RaceView accepts a seed prop. */}
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost"
            onClick={() => setView('race')}
            style={{ minHeight: 44 }}
            title="ไปหน้า Race mode — สร้างห้องแข่งกับเพื่อนแบบ realtime"
          >
            🏁 สร้างห้องแข่ง
          </button>
          {/* Round 2B 2026-05-18: "send to group" — same primitive as
              ChallengeQuizButton but explicitly invokes navigator.share
              first (mobile system picker → LINE/IG group chat target). */}
          <SendToGroupButton questions={questions} score={score} senderTimeSec={receiverDurationSec} />
          <button className="vmx-btn vmx-btn-ghost" onClick={goHome} style={{ minHeight: 44 }}>
            🏠 หน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RecommendationsBox — Phase 2 (2026-05-18) ──────────────────────
// Short "ต่อจากนี้แนะนำ" panel under the action stack. Tells the user
// what the system is doing in the background (SR queue, weak-topic
// signal) so the loop feels intelligent rather than opaque.
function RecommendationsBox({ autoQs, wrongCount, questions, answers, score }) {
  // Compute a couple of structured hints. Only render box if we have
  // at least one substantive hint — never render an empty card.
  const hints = useMemo(() => {
    const out = [];
    if (autoQs.length === 0) return out;
    if (wrongCount > 0) {
      out.push({
        icon: '🧠',
        text: `ข้อที่ผิด ${wrongCount} ข้อถูกเพิ่มเข้า SR queue แล้ว`,
      });
      out.push({
        icon: '🕒',
        text: 'ทำซ้ำอีก ~3 วันจะจำติด — ระบบจะปล่อยมาให้ทบทวนตาม spacing-repetition',
      });
    }
    // Topic-level pattern: ≥2 wrong in same topic → flag it
    if (wrongCount >= 2) {
      const topicTally = {};
      for (const q of autoQs) {
        if (answers[q.id] === undefined) continue;
        if (isCorrect(q, answers[q.id])) continue;
        const key = q.topic;
        if (!key) continue;
        topicTally[key] = (topicTally[key] || 0) + 1;
      }
      const entries = Object.entries(topicTally).sort((a, b) => b[1] - a[1]);
      if (entries.length > 0 && entries[0][1] >= 2) {
        const [topic, count] = entries[0];
        const cleaned = String(topic).replace(/^[\d\s.·\-]+/, '').trim().slice(0, 40);
        out.push({
          icon: '🎯',
          text: `คุณพลาด ${count} ข้อในหัวข้อ "${cleaned}" — ลองทบทวนเนื้อหานี้ก่อน`,
        });
      }
    }
    if (score.pct >= 90 && autoQs.length >= 5) {
      out.push({
        icon: '🔥',
        text: 'คะแนนสูงในรอบนี้ ลองเพิ่มจำนวนข้อรอบหน้าเพื่อท้าทายตัวเองดู',
      });
    }
    return out.slice(0, 3);
  }, [autoQs, answers, wrongCount, score.pct]);

  if (hints.length === 0) return null;

  return (
    <div style={{
      marginTop: 18,
      padding: '12px 14px',
      borderRadius: 12,
      background: 'rgba(184, 137, 64, 0.06)',
      border: '1px dashed var(--clr-gold, #b88940)',
    }}>
      <div style={{
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--clr-gold, #b88940)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 700,
        marginBottom: 8,
      }}>
        💡 ต่อจากนี้แนะนำ
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {hints.map((h, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--clr-ink)',
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} aria-hidden>{h.icon}</span>
            <span style={{ flex: 1 }}>{h.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// One-click share. We render the score card to a Blob, then prefer the
// Web Share API (mobile, lets user pick IG Story / IG Direct / DM /
// any installed app). On desktop or browsers without share-with-files,
// we fall back to PNG download — user can airdrop / save and upload to
// IG manually. Either way we add a footer link to the IG profile so
// the share has a destination beyond just the screenshot.
// Compact button that copies a shareable quiz URL (`?qset=...`) so the
// user can paste it in LINE/IG and a friend opens the same Q set.
// Different from ShareToIGRow (which generates a screenshot for stories);
// this is for "lets do this exact quiz together".
function ShareQuizButton({ questions }) {
  const [hint, setHint] = useState('');
  if (!questions || questions.length === 0) return null;
  return (
    <button
      type="button"
      className="vmx-btn vmx-btn-ghost"
      style={{ minHeight: 44 }}
      onClick={async () => {
        const res = await copyShareUrl(questions);
        if (res.ok) setHint('คัดลอกลิงก์แล้ว · วางส่งเพื่อนได้เลย');
        else setHint('คัดลอกไม่ได้: ' + (res.url || ''));
        setTimeout(() => setHint(''), 3500);
      }}
      title="แชร์ชุดโจทย์นี้ให้เพื่อน — เปิดลิงก์แล้วได้ข้อเดียวกัน เรียงเดียวกัน"
    >
      📎 แชร์ชุดนี้
      {hint && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--clr-sage, #4a6b4a)', fontFamily: 'JetBrains Mono, monospace' }}>{hint}</span>}
    </button>
  );
}

// Same primitive as ShareQuizButton but reframes the action as
// "challenge friend" — Palm spec 2026-05-18: people share questions
// (low embarrassment) more readily than they share bad scores.
// We use the Web Share API where available (mobile native share sheet)
// with a copy-paste fallback to clipboard so LINE/IG webviews work too.
//
// Round 2B (2026-05-18): when `score` is provided we embed the sender
// score in BOTH the URL (?sc=12_15) and the share text ("เราได้ 12/15")
// — Palm spec wants the bragging-rights framing + per-message comparison.
function ChallengeQuizButton({ questions, label = '🎯 ท้าเพื่อนทำชุดนี้', score, senderName, senderTimeSec }) {
  const [hint, setHint] = useState('');
  if (!questions || questions.length === 0) return null;

  const buildChallengeText = () => {
    const n = questions.length;
    const senderScore = score && Number.isFinite(score.correct) && Number.isFinite(score.total)
      ? { correct: score.correct, total: score.total }
      : null;
    const url = buildShareUrl(questions, { senderScore, senderName, senderTimeSec });
    if (!url) return null;
    // Sender-score baked into the text body so the message preview
    // (LINE/IG inline link card) carries the challenge framing even
    // when the receiver doesn't open the URL right away.
    const fragment = senderScore
      ? `เราได้ ${senderScore.correct}/${senderScore.total} 📚 ลองทำดู — ตอบถูกมากกว่ามั้ย?`
      : `ลองทำข้อนี้ดิ 📚 ${n} ข้อจาก VetMock — ใครตอบถูกมากกว่ากัน?`;
    return `${fragment}\n${url}`;
  };

  const handleClick = async () => {
    const text = buildChallengeText();
    if (!text) {
      setHint('สร้างลิงก์ไม่ได้');
      setTimeout(() => setHint(''), 3000);
      return;
    }
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title: 'VetMock challenge', text });
        setHint('✓ ส่งให้เพื่อนแล้ว');
        setTimeout(() => setHint(''), 3000);
        return;
      }
    } catch (err) {
      if (err?.name === 'AbortError') return; // user cancelled
    }
    // Fallback: copy text (URL embedded)
    const res = await copyText(text);
    setHint(res.ok ? '✓ คัดลอกแล้ว · วางใน LINE / IG ได้เลย' : '⚠️ คัดลอกไม่ได้');
    setTimeout(() => setHint(''), 3500);
  };

  return (
    <button
      type="button"
      className="vmx-btn vmx-btn-ghost"
      onClick={handleClick}
      style={{ minHeight: 44 }}
      title="แชร์ลิงก์ชุดโจทย์ + ข้อความท้าทาย — เพื่อนเปิดลิงก์แล้วทำชุดเดียวกัน"
    >
      {label}
      {hint && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--clr-sage, #4a6b4a)', fontFamily: 'JetBrains Mono, monospace' }}>{hint}</span>}
    </button>
  );
}

// Send-to-group variant — Round 2B 2026-05-18. Forces the native share
// sheet (no clipboard fallback) so on mobile the user lands on the
// LINE/IG/Telegram group picker directly. On desktop, falls back to
// clipboard with a hint to paste into the group chat.
function SendToGroupButton({ questions, score, senderTimeSec }) {
  const [hint, setHint] = useState('');
  if (!questions || questions.length === 0) return null;

  const handleClick = async () => {
    const senderScore = score && Number.isFinite(score.correct) && Number.isFinite(score.total)
      ? { correct: score.correct, total: score.total }
      : null;
    const url = buildShareUrl(questions, { senderScore, senderTimeSec });
    if (!url) {
      setHint('สร้างลิงก์ไม่ได้');
      setTimeout(() => setHint(''), 3000);
      return;
    }
    const fragment = senderScore
      ? `เราได้ ${senderScore.correct}/${senderScore.total} ใครได้มากกว่ามั้ย 📚`
      : `ลองทำชุดนี้กัน 📚 VetMock`;
    const text = `${fragment}\n${url}`;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title: 'VetMock challenge', text });
        setHint('✓ เลือกกลุ่ม / แชทได้เลย');
        setTimeout(() => setHint(''), 3000);
        return;
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
    }
    const res = await copyText(text);
    setHint(res.ok ? '✓ คัดลอกแล้ว · วางในกลุ่มได้เลย' : '⚠️ ส่งไม่ได้');
    setTimeout(() => setHint(''), 3500);
  };

  return (
    <button
      type="button"
      className="vmx-btn vmx-btn-ghost"
      onClick={handleClick}
      style={{ minHeight: 44 }}
      title="ส่งลิงก์ชุดโจทย์เข้ากลุ่ม LINE / IG / chat"
    >
      📨 ส่งเข้ากลุ่ม
      {hint && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--clr-sage, #4a6b4a)', fontFamily: 'JetBrains Mono, monospace' }}>{hint}</span>}
    </button>
  );
}

// Format seconds → "M:SS" for human-readable elapsed time.
function fmtTimeSec(n) {
  if (!Number.isFinite(n) || n <= 0) return '—';
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── ChallengeComparisonBox — Round 2B/3 (2026-05-18) ────────────
// Visible only when receiver finishes a challenge that included
// sender score in the URL. Round 3 adds elapsed-time comparison
// per Palm spec "เทียบคะแนน/เวลา". Layout: verdict header → 2-col
// score+time table (sender · receiver) → 1-line summary.
function ChallengeComparisonBox({ sender, receiverScore, receiverTimeSec }) {
  if (!sender?.senderScore || !receiverScore) return null;
  const s = sender.senderScore;
  const r = receiverScore;
  // Compare by accuracy %; same total in practice (same Q set), but
  // we don't strictly assume so. Win/lose/tie at the rounded-pct level.
  const sPct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  const rPct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
  const verdict = rPct > sPct ? 'win' : rPct < sPct ? 'lose' : 'tie';
  const verdictMeta = {
    win:  { icon: '🥇', label: 'คุณชนะ!',  copy: `${r.correct}/${r.total} ดีกว่า ${s.correct}/${s.total} ของผู้ส่ง · ขอบราเดอร์`, color: '#4a6b4a' },
    lose: { icon: '💭', label: 'เกือบแล้ว', copy: `ผู้ส่งได้ ${s.correct}/${s.total} · คุณ ${r.correct}/${r.total} — ลองอีกชุดดู`, color: '#a73d4a' },
    tie:  { icon: '🤝', label: 'เสมอ',     copy: `ได้เท่ากัน ${r.correct}/${r.total} ทั้งคู่ — เพื่อนสนิทแล้ว`, color: '#b88940' },
  }[verdict];

  // Time race: only render when BOTH sides have a valid duration. With
  // the same score, faster wins. Otherwise time is informational only
  // (we don't override the score-based verdict — score is the canonical
  // win/lose, time is the bragging-rights tiebreaker shown alongside).
  const hasTimes = Number.isFinite(sender.senderTimeSec) && sender.senderTimeSec > 0
    && Number.isFinite(receiverTimeSec) && receiverTimeSec > 0;
  const fasterReceiver = hasTimes && receiverTimeSec < sender.senderTimeSec;
  const fasterSender = hasTimes && receiverTimeSec > sender.senderTimeSec;

  return (
    <div style={{
      marginTop: 18,
      padding: '14px 16px',
      borderRadius: 14,
      background: `linear-gradient(135deg, ${verdictMeta.color}1f, ${verdictMeta.color}0d)`,
      border: `2px solid ${verdictMeta.color}`,
    }}>
      <div style={{
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace',
        color: verdictMeta.color,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 700,
        marginBottom: 6,
      }}>
        📨 ผลการท้า {sender.senderName ? `จาก ${sender.senderName}` : 'จากเพื่อน'}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: hasTimes ? 12 : 0 }}>
        <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }} aria-hidden>{verdictMeta.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 18, color: 'var(--clr-ink)' }}>
            {verdictMeta.label}
          </div>
          <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)', marginTop: 2, lineHeight: 1.45 }}>
            {verdictMeta.copy}
          </div>
        </div>
      </div>

      {/* Round 3 "เทียบเวลา" side-by-side row. Only when both sides
          carry a time payload — keeps legacy links (sc but no t)
          rendering cleanly. */}
      {hasTimes && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: 10,
          borderRadius: 10,
          background: 'rgba(0,0,0,0.04)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              ผู้ส่ง{sender.senderName ? ` · ${sender.senderName}` : ''}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-ink)' }}>
              {s.correct}/{s.total} · ⏱ {fmtTimeSec(sender.senderTimeSec)}
              {fasterSender && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--clr-gold, #b88940)' }}>เร็วกว่า</span>}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              คุณ
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-ink)' }}>
              {r.correct}/{r.total} · ⏱ {fmtTimeSec(receiverTimeSec)}
              {fasterReceiver && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--clr-sage, #4a6b4a)' }}>เร็วกว่า</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wraps the challenge-friend share as a callout row (replaces ShareToIGRow
// on low/mid scores). Communicates the "this is what people DO share"
// proposition vs awkwardly showing IG-Story-share with a 30% score.
function ChallengeFriendRow({ questions, score }) {
  return (
    <div style={{
      marginTop: 24,
      padding: 16,
      borderRadius: 12,
      background: 'linear-gradient(135deg, rgba(74, 107, 74, 0.06), rgba(217, 119, 68, 0.06))',
      border: '1px dashed var(--clr-sage, #4a6b4a)',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--clr-ink)', flex: '1 1 200px', lineHeight: 1.5 }}>
          ส่งให้เพื่อนลอง — <strong>เพื่อนตอบถูกมากกว่าเรามั้ย</strong>? วัดดวงเล่นๆ
        </div>
        <ChallengeQuizButton questions={questions} score={score} label="🎯 ท้าเพื่อนทำชุดนี้" />
      </div>
    </div>
  );
}

function ShareToIGRow({ pct, correct, total, subject, mode, isWritingOnly, writingDone, writingTotal }) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('');

  const handleShare = async () => {
    if (busy) return;
    setBusy(true); setHint('');
    try {
      const blob = await buildScoreCard({ pct, correct, total, subject, mode, isWritingOnly, writingDone, writingTotal });
      if (!blob) throw new Error('canvas blob failed');
      const file = new File([blob], `vetmock-score-${Date.now()}.png`, { type: 'image/png' });

      // Mobile path: native share sheet
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'VetMock score',
          text: `ทำข้อสอบ VetMock ได้ ${isWritingOnly ? 'writing ' + writingDone + '/' + writingTotal : pct + '% (' + correct + '/' + total + ')'} 📚, ลองดูที่ vetmock.vercel.app, IG @vetmock.cu`,
        });
        setHint('✓ แชร์เรียบร้อย — เลือก Instagram Story / Direct ได้เลย');
      } else {
        // Desktop path: download PNG, open IG
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `vetmock-score-${Date.now()}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setHint('✓ ดาวน์โหลดรูปแล้ว — อัพโหลดเข้า IG Story เอง, @vetmock.cu');
      }
    } catch (e) {
      setHint('⚠️ แชร์ไม่ได้, ลองใหม่อีกครั้ง');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'linear-gradient(135deg, rgba(225,48,108,0.06), rgba(247,119,55,0.06))', border: '1px dashed rgba(225,48,108,0.35)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--clr-ink)', flex: '1 1 200px', lineHeight: 1.5 }}>
          อยากแชร์คะแนนให้เพื่อน?, กดสร้าง score card สำหรับ <strong>IG Story</strong> ได้
        </div>
        <button
          className="vmx-btn vmx-btn-primary"
          onClick={handleShare}
          disabled={busy}
          style={{ fontSize: 14, padding: '8px 16px', whiteSpace: 'nowrap' }}
        >
          {busy ? '⏳ กำลังสร้าง…' : '📷 Share Score → IG Story'}
        </button>
      </div>
      {hint && (
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--clr-ink-soft)', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
          {hint}
        </div>
      )}
    </div>
  );
}
