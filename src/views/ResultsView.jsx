import { useEffect, useRef, useState } from 'react';
import { isCorrect, isWritingType } from '../hooks/utils.js';
import BackBar from '../components/BackBar.jsx';

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

  // Background gradient (warm cream → soft sage · matches app palette)
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
  if (isWritingOnly) msg = 'เขียนไปแล้ว · ลองดู AI feedback ใน VetMock';
  else if (pct === 100) msg = 'เทพสุดๆ 🏆 อ่านต่อมาเรื่อยๆ';
  else if (pct >= 80) msg = 'ใกล้แล้ว · อ่านอีกนิดเดียว';
  else if (pct >= 60) msg = 'ผ่านครับ · ทบทวนข้อที่ผิด';
  else if (pct >= 40) msg = 'สู้ๆ · กลับไปเปิดข้อสอบเก่า';
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

export default function ResultsView({ score, questions, answers, goHome, setView, mode }) {
  // Fire confetti once on mount for a perfect auto-graded score.
  // Lazy-imported so the canvas/animation code never hits the
  // main bundle. Guarded by useRef so React StrictMode's double
  // mount in dev doesn't trigger the burst twice.
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    // Use correct === total instead of pct === 100 — pct is rounded,
    // so 199/200 = 99.5% would round to 100% and false-fire.
    if (score.total > 0 && score.correct === score.total) {
      firedRef.current = true;
      import('../lib/confetti.js').then((m) => {
        m.fireConfetti({ count: 140 });
        // Second + third bursts from the corners for a fuller spread
        setTimeout(() => m.fireConfetti({ count: 80, originXRatio: 0.2 }), 250);
        setTimeout(() => m.fireConfetti({ count: 80, originXRatio: 0.8 }), 500);
      }).catch(() => {});
    }
  }, [score.correct, score.total]);

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
    : score.pct >= 40 ? '"สู้ๆ นะ เปิดข้อสอบเก่าอ่านอีกรอบกันเถอะ"'
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
      {showPassFail && (
        <div style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.15em', color: 'var(--clr-ink-soft)' }}>
          {passed ? '✓ PASSED' : '✗ FAILED'} · EXAM MODE
        </div>
      )}
      {isExam && autoQs.length === 0 && writingQs.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.15em', color: 'var(--clr-gold)' }}>
          ✍️ WRITING SESSION · GRADE IN REVIEW
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

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← กลับหน้าแรก</button>
        <button className="vmx-btn vmx-btn-primary" onClick={() => setView('review')}>ดูเฉลย →</button>
      </div>

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
    </>
  );
}

// One-click share. We render the score card to a Blob, then prefer the
// Web Share API (mobile · lets user pick IG Story / IG Direct / DM /
// any installed app). On desktop or browsers without share-with-files,
// we fall back to PNG download — user can airdrop / save and upload to
// IG manually. Either way we add a footer link to the IG profile so
// the share has a destination beyond just the screenshot.
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
          text: `ทำข้อสอบ VetMock ได้ ${isWritingOnly ? 'writing ' + writingDone + '/' + writingTotal : pct + '% (' + correct + '/' + total + ')'} 📚 · ลองดูที่ vetmock.vercel.app · IG @vetmock.cu`,
        });
        setHint('✓ แชร์เรียบร้อย — เลือก Instagram Story / Direct ได้เลย');
      } else {
        // Desktop path: download PNG, open IG
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `vetmock-score-${Date.now()}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setHint('✓ ดาวน์โหลดรูปแล้ว — อัพโหลดเข้า IG Story เอง · @vetmock.cu');
      }
    } catch (e) {
      setHint('⚠️ แชร์ไม่ได้ · ลองใหม่อีกครั้ง');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'linear-gradient(135deg, rgba(225,48,108,0.06), rgba(247,119,55,0.06))', border: '1px dashed rgba(225,48,108,0.35)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--clr-ink)', flex: '1 1 200px', lineHeight: 1.5 }}>
          อยากแชร์คะแนนให้เพื่อน? · กดสร้าง score card สำหรับ <strong>IG Story</strong> ได้
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
