// ============================================================
// PhaseWrappedCard — Spotify-Wrapped-style end-of-phase recap
// ============================================================
//
// Two surfaces (same data, very different UX):
//
//   1. "preview" mode (default) — in-app scrollable card. Stats
//      counted up on mount via rAF (respect prefers-reduced-motion),
//      mini bar chart, big copy. Lives inside PhaseWrappedView.
//
//   2. "image" mode — 1080×1920 portrait canvas (IG Story aspect
//      9:16) returned as a PNG Blob for download / navigator.share.
//      Generated via the same buildPhaseCanvas() helper as the
//      ResultsView score card so brand feels cohesive when shared.
//
// Buttons row: 📋 Copy text · 💾 Download PNG · 📤 Share · ✕ Close.
// All cross-platform paths use the existing `copyText` helper
// (handles iOS Safari + LINE/IG webviews).
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { copyText } from '../lib/clipboard.js';
import { statsToText } from '../lib/phase-wrapped.js';

// ── Canvas builder (1080×1920) ────────────────────────────────
// Same gradient + emoji-stack font as DailyQShareCard so shared
// images feel like one cohesive brand on a friend's feed.
async function buildPhaseCanvas(stats) {
  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  // 2× DPR — IG / Twitter / Threads scale aggressively. Painting
  // at the natural pixel size keeps text crisp on Retina screens.
  const DPR = 2;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  // Warm cream → soft sage — matches ResultsView's score card so
  // a user's IG Story feels like one branded set when they share
  // multiple recaps.
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#fdf6e9');
  bg.addColorStop(0.45, '#f5ead0');
  bg.addColorStop(1, '#dde6dc');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle dotted texture
  ctx.fillStyle = 'rgba(43, 36, 25, 0.04)';
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * W, y = Math.random() * H, r = 1 + Math.random() * 2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  // Header
  ctx.fillStyle = '#2b2419';
  ctx.font = '600 64px "Fraunces", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('Phase Wrapped', 80, 170);
  ctx.font = '500 36px "Fraunces", serif';
  ctx.fillStyle = '#6b6055';
  ctx.fillText(stats.phaseLabel || '', 80, 230);

  // Big number: total Qs
  ctx.textAlign = 'center';
  ctx.font = '700 360px "Fraunces", serif';
  ctx.fillStyle = '#4a6b4a';
  const qLabel = stats.qCount.toLocaleString();
  ctx.fillText(qLabel, W / 2, 540);
  ctx.font = '500 56px "Fraunces", serif';
  ctx.fillStyle = '#2b2419';
  ctx.fillText('ข้อทำมาในเทอมนี้', W / 2, 620);

  // Mastery ring (visual gauge) — large circle with arc filled to %.
  const ringCx = W / 2;
  const ringCy = 880;
  const ringR = 150;
  ctx.lineCap = 'round';
  // Track
  ctx.beginPath();
  ctx.arc(ringCx, ringCy, ringR, -Math.PI / 2, Math.PI * 1.5);
  ctx.strokeStyle = 'rgba(43,36,25,0.10)';
  ctx.lineWidth = 26;
  ctx.stroke();
  // Filled arc
  const ratio = Math.max(0, Math.min(1, stats.correctPct / 100));
  const accent = stats.correctPct >= 80 ? '#4a6b4a' : stats.correctPct >= 60 ? '#b88940' : '#c26d6d';
  ctx.beginPath();
  ctx.arc(ringCx, ringCy, ringR, -Math.PI / 2, -Math.PI / 2 + ratio * Math.PI * 2);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 26;
  ctx.stroke();
  // Centered pct text
  ctx.fillStyle = accent;
  ctx.font = '700 100px "Fraunces", serif';
  ctx.fillText(`${stats.correctPct}%`, ringCx, ringCy + 30);
  ctx.fillStyle = '#6b6055';
  ctx.font = '500 28px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
  ctx.fillText('MASTERY', ringCx, ringCy + 80);

  // Strongest + Weakest subject pills (left/right)
  let yRow = 1140;
  if (stats.strongestSubject) {
    drawSubjectPill(ctx, {
      x: 80, y: yRow, w: 460, h: 130,
      icon: stats.strongestSubject.icon, label: 'ดีที่สุด',
      name: stats.strongestSubject.name, pct: stats.strongestSubject.pct,
      tint: '#4a6b4a',
    });
  }
  if (stats.weakestSubject && (!stats.strongestSubject || stats.weakestSubject.id !== stats.strongestSubject.id)) {
    drawSubjectPill(ctx, {
      x: W - 540, y: yRow, w: 460, h: 130,
      icon: stats.weakestSubject.icon, label: 'ต้องเก็บอีก',
      name: stats.weakestSubject.name, pct: stats.weakestSubject.pct,
      tint: '#c26d6d',
    });
  }

  // Stat row: streak + study time
  yRow = 1320;
  ctx.textAlign = 'center';
  ctx.font = '500 28px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
  ctx.fillStyle = '#6b6055';
  if (stats.longestStreak > 0) {
    ctx.fillText('STREAK', W / 4, yRow);
    ctx.font = '700 84px "Fraunces", serif';
    ctx.fillStyle = '#b88940';
    ctx.fillText(`${stats.longestStreak}`, W / 4, yRow + 80);
    ctx.font = '500 28px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
    ctx.fillStyle = '#6b6055';
    ctx.fillText('วัน', W / 4, yRow + 115);
  }
  ctx.font = '500 28px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
  ctx.fillStyle = '#6b6055';
  ctx.fillText('ที่อ่าน', (W * 3) / 4, yRow);
  ctx.font = '700 84px "Fraunces", serif';
  ctx.fillStyle = '#2b2419';
  const hr = (stats.totalStudyMin / 60).toFixed(1);
  ctx.fillText(`${hr}`, (W * 3) / 4, yRow + 80);
  ctx.font = '500 28px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
  ctx.fillStyle = '#6b6055';
  ctx.fillText('ชม.', (W * 3) / 4, yRow + 115);

  // Mini bar chart — 30 days
  const chartX = 80;
  const chartY = 1530;
  const chartW = W - 160;
  const chartH = 130;
  const bars = stats.byDay || [];
  if (bars.length > 0) {
    const maxQ = Math.max(1, ...bars.map((b) => b.qs));
    const barW = chartW / bars.length;
    for (let i = 0; i < bars.length; i++) {
      const h = (bars[i].qs / maxQ) * chartH;
      const bx = chartX + i * barW;
      const by = chartY + (chartH - h);
      ctx.fillStyle = bars[i].qs > 0 ? '#4a6b4a' : 'rgba(43,36,25,0.06)';
      ctx.fillRect(bx + 2, by, Math.max(2, barW - 4), Math.max(2, h));
    }
    ctx.textAlign = 'left';
    ctx.font = '500 24px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
    ctx.fillStyle = '#6b6055';
    ctx.fillText('30 DAYS', chartX, chartY - 12);
    ctx.textAlign = 'right';
    ctx.fillText(`${stats.dailyAvg}/วัน avg`, chartX + chartW, chartY - 12);
  }

  // Encouragement line
  const msg = pickWrappedMessage(stats);
  ctx.textAlign = 'center';
  ctx.font = '400 44px "Fraunces", serif';
  ctx.fillStyle = '#3d342a';
  ctx.fillText(msg, W / 2, 1740);

  // Watermark
  ctx.font = '600 50px "Fraunces", serif';
  ctx.fillStyle = '#2b2419';
  ctx.fillText('vetmock.vercel.app', W / 2, 1820);
  ctx.font = '500 36px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
  ctx.fillStyle = '#b88940';
  ctx.fillText('📷 @vetmock.cu', W / 2, 1870);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
}

function drawSubjectPill(ctx, { x, y, w, h, icon, label, name, pct, tint }) {
  ctx.fillStyle = tint + '20'; // 12% alpha (hex)
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 22);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
  ctx.textAlign = 'left';
  ctx.font = '500 24px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
  ctx.fillStyle = tint;
  ctx.fillText(label.toUpperCase(), x + 28, y + 38);
  ctx.font = '600 44px "Fraunces", serif';
  ctx.fillStyle = '#2b2419';
  const nameStr = `${icon} ${name}`;
  ctx.fillText(truncate(nameStr, 18), x + 28, y + 88);
  ctx.textAlign = 'right';
  ctx.font = '600 40px "Fraunces", serif';
  ctx.fillStyle = tint;
  ctx.fillText(`${pct}%`, x + w - 28, y + 88);
}

function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function pickWrappedMessage(stats) {
  if (stats.qCount === 0) return 'รอบหน้ามาทำใหม่นะ 💪';
  if (stats.correctPct >= 85 && stats.longestStreak >= 7) return 'เทพมาก streak ก็แข็งแกร่ง';
  if (stats.correctPct >= 80) return 'แม่นยำใช้ได้, อ่านต่อให้ติด 💪';
  if (stats.longestStreak >= 14) return 'streak สองสัปดาห์ — วินัยล้วนๆ 🔥';
  if (stats.qCount >= 500) return 'ทำไปเยอะมาก, ใจสู้ 💚';
  if (stats.correctPct >= 60) return 'ผ่านมาแล้ว, รอบหน้าทำให้ดีขึ้นอีก';
  return 'ค่อยๆ ทำต่อ, ทุกข้อมีค่า';
}

// ── Countup animation ────────────────────────────────────────
function useCountUp(target, durationMs = 900) {
  const [value, setValue] = useState(0);
  const ref = useRef({ raf: 0, t0: 0 });
  useEffect(() => {
    // Respect reduced motion — set the final value immediately.
    const reduced = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !target || target < 1) {
      setValue(target || 0);
      return;
    }
    setValue(0);
    ref.current.t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - ref.current.t0) / durationMs);
      // ease-out cubic — overshoots feel "celebratory"
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) ref.current.raf = requestAnimationFrame(step);
    };
    ref.current.raf = requestAnimationFrame(step);
    return () => {
      if (ref.current.raf) cancelAnimationFrame(ref.current.raf);
    };
  }, [target, durationMs]);
  return value;
}

// ── React shell ──────────────────────────────────────────────
export default function PhaseWrappedCard({ stats, onClose, onDismissPhase }) {
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);
  const imgUrlRef = useRef(null);

  // Counted-up versions of the headline numbers. The bar chart
  // gets its own progressive reveal via CSS transform-height.
  const qShown = useCountUp(stats?.qCount || 0);
  const pctShown = useCountUp(stats?.correctPct || 0);
  const streakShown = useCountUp(stats?.longestStreak || 0);
  const hrShown = useCountUp(Math.round((stats?.totalStudyMin || 0) / 6) / 10, 900);
  const masteredShown = useCountUp(stats?.masteredCards || 0);

  const shareText = useMemo(() => statsToText(stats), [stats]);
  const accent = (stats?.correctPct || 0) >= 80
    ? 'var(--clr-sage, #4a6b4a)'
    : (stats?.correctPct || 0) >= 60
      ? 'var(--clr-gold, #b88940)'
      : 'var(--clr-rose, #c26d6d)';

  // Cleanup any cached blob URL
  useEffect(() => () => {
    if (imgUrlRef.current) {
      URL.revokeObjectURL(imgUrlRef.current);
      imgUrlRef.current = null;
    }
  }, []);

  function flash(msg, ms = 2200) {
    setHint(msg);
    setTimeout(() => setHint((cur) => (cur === msg ? '' : cur)), ms);
  }

  async function handleCopy() {
    const res = await copyText(shareText);
    if (res.ok) flash('✓ คัดลอกแล้ว — แปะใน LINE / IG ได้');
    else flash('คัดลอกไม่ได้, ลองใหม่');
  }

  async function ensureBlob() {
    const blob = await buildPhaseCanvas(stats);
    if (!blob) throw new Error('canvas blob failed');
    return blob;
  }

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await ensureBlob();
      const url = URL.createObjectURL(blob);
      imgUrlRef.current = url;
      const a = document.createElement('a');
      a.href = url;
      a.download = `vetmock-wrapped-${stats.phaseId || 'phase'}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      flash('✓ ดาวน์โหลดแล้ว — อัพ IG Story ได้');
    } catch {
      flash('สร้างรูปไม่ได้, ลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await ensureBlob();
      const file = new File([blob], `vetmock-wrapped-${stats.phaseId}.png`, { type: 'image/png' });
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'VetMock Wrapped',
          text: shareText,
        });
        flash('✓ แชร์เรียบร้อย');
      } else if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ title: 'VetMock Wrapped', text: shareText });
        flash('✓ แชร์เรียบร้อย');
      } else {
        const res = await copyText(shareText);
        if (res.ok) flash('ไม่มี share sheet — คัดลอกให้แล้ว');
        else flash('แชร์ไม่ได้');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') flash('แชร์ไม่ได้, ลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    if (stats?.phaseId && typeof onDismissPhase === 'function') {
      onDismissPhase(stats.phaseId);
    }
    onClose?.();
  }

  if (!stats) return null;

  // Bar chart — inline SVG, lightweight + scales without DPR concerns.
  const bars = stats.byDay || [];
  const maxQ = Math.max(1, ...bars.map((b) => b.qs));

  return (
    <div
      className="vmx-wrapped-card"
      style={{
        background: 'linear-gradient(180deg, #fdf6e9 0%, #f5ead0 45%, #dde6dc 100%)',
        border: '1px solid var(--clr-border, rgba(43,36,25,0.10))',
        borderRadius: 24,
        padding: 'clamp(20px, 5vw, 36px)',
        maxWidth: 480,
        margin: '0 auto',
        boxShadow: '0 8px 32px rgba(43, 36, 25, 0.08)',
        fontFamily: '"IBM Plex Sans Thai", system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft, #6b6055)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Phase Wrapped
        </div>
        <h2 style={{ margin: '6px 0 0', fontSize: 24, fontFamily: 'Fraunces, serif', fontWeight: 600 }}>
          {stats.phaseLabel}
        </h2>
      </div>

      {stats.isEmpty ? (
        <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--clr-ink-soft, #6b6055)', fontSize: 14, lineHeight: 1.7 }}>
          เทอมนี้ยังไม่ได้ทำข้อในแอป — รอบหน้ามาทำใหม่นะ 💪
        </div>
      ) : (
        <>
          {/* Big Q count */}
          <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 'clamp(64px, 18vw, 96px)', lineHeight: 1, color: 'var(--clr-sage, #4a6b4a)' }}>
              {qShown.toLocaleString()}
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: 'var(--clr-ink, #2b2419)', marginTop: 6 }}>
              ข้อทำมาในเทอมนี้
            </div>
          </div>

          {/* Mastery ring */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <MasteryRing pct={pctShown} accent={accent} />
          </div>

          {/* Subject pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {stats.strongestSubject && (
              <SubjectRow
                tint="var(--clr-sage, #4a6b4a)"
                label="ดีที่สุด"
                icon={stats.strongestSubject.icon}
                name={stats.strongestSubject.name}
                pct={stats.strongestSubject.pct}
              />
            )}
            {stats.weakestSubject && stats.weakestSubject.id !== stats.strongestSubject?.id && (
              <SubjectRow
                tint="var(--clr-rose, #c26d6d)"
                label="ต้องเก็บอีก"
                icon={stats.weakestSubject.icon}
                name={stats.weakestSubject.name}
                pct={stats.weakestSubject.pct}
              />
            )}
          </div>

          {/* Streak + Hours + Mastered row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
            marginTop: 18, textAlign: 'center',
          }}>
            <StatCell label="STREAK" value={streakShown} unit="วัน" tint="var(--clr-gold, #b88940)" />
            <StatCell label="ที่อ่าน" value={hrShown.toFixed(1)} unit="ชม." />
            <StatCell label="MASTERED" value={masteredShown} unit="cards" tint="var(--clr-plum, #7d4a7d)" />
          </div>

          {/* 30-day bar chart */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft, #6b6055)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              <span>30 days</span>
              <span>{stats.dailyAvg}/วัน avg</span>
            </div>
            <svg viewBox={`0 0 ${bars.length * 4} 60`} preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }} aria-hidden="true">
              {bars.map((b, i) => {
                const h = (b.qs / maxQ) * 56 + 2;
                return (
                  <rect
                    key={b.date}
                    x={i * 4 + 0.5}
                    y={60 - h}
                    width={3}
                    height={h}
                    fill={b.qs > 0 ? 'var(--clr-sage, #4a6b4a)' : 'rgba(43,36,25,0.08)'}
                  />
                );
              })}
            </svg>
          </div>

          {/* Encouragement line */}
          <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: 'rgba(184, 137, 64, 0.10)', border: '1px solid var(--clr-gold, #b88940)', textAlign: 'center', fontSize: 14, lineHeight: 1.6, color: 'var(--clr-ink, #2b2419)' }}>
            {pickWrappedMessage(stats)}
            <div style={{ marginTop: 6, fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft, #6b6055)' }}>
              vetmock.vercel.app, 📷 @vetmock.cu
            </div>
          </div>
        </>
      )}

      {/* Action row — 44 px touch targets */}
      <div style={{
        marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
      }}>
        <button
          type="button"
          onClick={handleCopy}
          disabled={busy || stats.isEmpty}
          className="vmx-btn vmx-btn-ghost"
          style={{ minHeight: 44, fontSize: 13 }}
        >
          Copy text
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy || stats.isEmpty}
          className="vmx-btn vmx-btn-ghost"
          style={{ minHeight: 44, fontSize: 13 }}
        >
          {busy ? '⏳' : '💾'} Download PNG
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy || stats.isEmpty}
          className="vmx-btn vmx-btn-primary"
          style={{ minHeight: 44, fontSize: 13 }}
        >
          Share
        </button>
        <button
          type="button"
          onClick={handleClose}
          className="vmx-btn vmx-btn-ghost"
          style={{ minHeight: 44, fontSize: 13 }}
          aria-label="ปิด"
        >
          ✕ ปิด
        </button>
      </div>
      {hint && (
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--clr-ink-soft, #6b6055)', textAlign: 'center', fontFamily: 'var(--vmx-mono)' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────
function MasteryRing({ pct, accent }) {
  // Pure SVG so it can animate via stroke-dasharray without canvas.
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div style={{ position: 'relative', width: 160, height: 160 }}>
      <svg viewBox="0 0 160 160" width="160" height="160" aria-hidden="true">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(43,36,25,0.10)" strokeWidth="12" />
        <circle
          cx="80" cy="80" r={r}
          fill="none"
          stroke={accent}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 240ms ease-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 40, lineHeight: 1, color: accent }}>
          {pct}%
        </div>
        <div style={{ fontSize: 9, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft, #6b6055)', letterSpacing: '0.12em', marginTop: 2 }}>
          MASTERY
        </div>
      </div>
    </div>
  );
}

function SubjectRow({ tint, label, icon, name, pct }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
      borderRadius: 14, background: `${tint}1A`, border: `1px solid ${tint}33`,
    }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: tint, letterSpacing: '0.10em', textTransform: 'uppercase', minWidth: 86 }}>
        {label}
      </div>
      <div style={{ flex: 1, fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: 'var(--clr-ink, #2b2419)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {icon} {name}
      </div>
      <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 18, color: tint }}>
        {pct}%
      </div>
    </div>
  );
}

function StatCell({ label, value, unit, tint = 'var(--clr-ink, #2b2419)' }) {
  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ fontSize: 9, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft, #6b6055)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 28, color: tint, lineHeight: 1.1, marginTop: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft, #6b6055)' }}>
        {unit}
      </div>
    </div>
  );
}
