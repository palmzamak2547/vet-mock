// ============================================================
// DailyQShareCard — Wordle-style emoji-grid share for Daily Q
// ============================================================
//
// Mounted on top of TodaysQModal after the user has revealed an
// answer. Two surfaces:
//
//   1. Text view — emoji grid + "N/7 days · streak K 🔥" line +
//      vetmock URL. One-tap copy to clipboard via the existing
//      `copyText` helper (handles iOS Safari + LINE/IG webviews).
//
//   2. Image view — 1080×1920 canvas (IG Story aspect 9:16) with
//      a large emoji grid + Thai motivational line + watermark.
//      Saves as PNG or sends via navigator.share (with `files`).
//
// Why two surfaces: the text payload travels through chat (LINE/
// IG DM/Discord) where emoji renders natively + the URL auto-linkifies.
// The image is for IG Story / Twitter / Threads / Facebook where a
// visual artifact gets way more engagement than a text grid.
//
// The emoji grid uses the SAME glyphs as the text payload (imported
// from daily-q-history) — keep them in sync if either changes.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { copyText } from '../lib/clipboard.js';
import {
  buildShareText,
  daysCorrect,
  daysCompleted,
  formatEmojiGrid,
  formatThaiShortDate,
  getDailyQHistory,
  DAILY_Q_EMOJI,
} from '../lib/daily-q-history.js';
import { dailyQStreak, todayKey } from '../lib/daily-q.js';
import { useModalFocus } from '../hooks/useModalFocus.js';

// Pick a soft Thai motivational line based on today's result + streak.
// Mirrors the tone used in ResultsView's score card.
function pickMotivationalText({ todayStatus, streak, correct, total }) {
  if (todayStatus === 'correct' && streak >= 7) return 'streak ทะลุ 7 วัน, เก่งจริง 🏆';
  if (todayStatus === 'correct' && streak >= 3) return 'streak ติดมือแล้ว, อย่าหลุดวันนี้';
  if (todayStatus === 'correct') return 'วันนี้เก็บไปอีก 1 ข้อ ✓';
  if (todayStatus === 'wrong' && correct >= total - 1) return 'แค่พลาดวันเดียว, พรุ่งนี้สู้ต่อ';
  if (todayStatus === 'wrong') return 'ผิดได้, ค่อยๆ ทำต่อนะ 💪';
  return 'มากันทุกวันแล้วจะติดเอง';
}

// 1080×1920 portrait. Mirrors ResultsView's buildScoreCard but for
// the daily-Q emoji grid. Returns a Promise<Blob>. 2× DPR is handled
// by the absolute pixel size — IG Story scales the image down for us.
async function buildShareImage({ history, streak, todayDate, todayStatus }) {
  const W = 1080, H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Warm cream → sage gradient — same palette as the score card so
  // shared images feel like one cohesive brand on a friend's IG.
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

  // Header
  ctx.fillStyle = '#2b2419';
  ctx.font = '600 64px "Fraunces", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('VetMock', 80, 180);
  ctx.font = '500 32px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
  ctx.fillStyle = '#6b6055';
  ctx.fillText('ข้อวันนี้, DAILY Q', 80, 230);

  // Date — right-aligned for balance
  ctx.font = '500 36px "Fraunces", serif';
  ctx.fillStyle = '#3d342a';
  ctx.textAlign = 'right';
  ctx.fillText(formatThaiShortDate(todayDate), W - 80, 200);

  // Emoji grid — center, big. Use the emoji-stack font so each glyph
  // renders as the colored emoji presentation, not a black geometric
  // shape (canvas defaults to text presentation on some systems).
  const cellSize = 110;
  const cellGap = 16;
  const gridWidth = history.length * cellSize + (history.length - 1) * cellGap;
  const startX = (W - gridWidth) / 2 + cellSize / 2;
  const gridY = 900;
  ctx.font = `${cellSize - 18}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  history.forEach((row, i) => {
    const emoji = DAILY_Q_EMOJI[row.status] || DAILY_Q_EMOJI.missed;
    const x = startX + i * (cellSize + cellGap);
    ctx.fillText(emoji, x, gridY);
  });
  ctx.textBaseline = 'alphabetic';

  // Days correct + streak line — center, just below the grid
  const correct = daysCorrect(history);
  const total = history.length;
  ctx.fillStyle = '#2b2419';
  ctx.font = '600 72px "Fraunces", serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${correct} / ${total} days`, W / 2, gridY + 200);

  if (streak > 0) {
    ctx.fillStyle = '#b88940';
    ctx.font = '600 56px "Fraunces", serif';
    ctx.fillText(`streak ${streak} วัน`, W / 2, gridY + 280);
  }

  // Motivational line
  const motivation = pickMotivationalText({
    todayStatus,
    streak,
    correct,
    total,
  });
  ctx.fillStyle = '#3d342a';
  ctx.font = '400 44px "Fraunces", serif';
  ctx.fillText(motivation, W / 2, gridY + 400);

  // Bottom watermark — vetmock URL + IG handle
  ctx.font = '600 56px "Fraunces", serif';
  ctx.fillStyle = '#2b2419';
  ctx.fillText('vetmock.vercel.app', W / 2, 1700);
  ctx.font = '500 40px "JetBrains Mono", "IBM Plex Sans Thai", monospace';
  ctx.fillStyle = '#b88940';
  ctx.fillText('📷 @vetmock.cu', W / 2, 1770);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
}

export default function DailyQShareCard({ todayResult, streak: streakProp, onClose }) {
  // Snapshot history + streak at mount — fixed for the lifetime of
  // this modal so the share text never mutates between user pressing
  // Copy and the toast landing.
  const history = useMemo(() => getDailyQHistory(7), []);
  const streak = useMemo(
    () => (typeof streakProp === 'number' ? streakProp : dailyQStreak()),
    [streakProp],
  );
  const todayDate = todayKey();
  // todayResult: 'correct' | 'wrong' | null
  // We don't trust localStorage timing here — the parent passes the
  // freshly-computed value so the card reflects what the user just did.
  const todayStatus =
    todayResult === true || todayResult === 'correct' ? 'correct' :
    todayResult === false || todayResult === 'wrong' ? 'wrong' :
    history[history.length - 1]?.status || 'missed';

  const [mode, setMode] = useState('text'); // 'text' | 'image'
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const imgUrlRef = useRef(null);
  const dialogRef = useModalFocus({ onClose });

  const shareText = useMemo(
    () => buildShareText({ history, streak, todayDate, todayStatus }),
    [history, streak, todayDate, todayStatus],
  );
  const grid = useMemo(() => formatEmojiGrid(history), [history]);
  const correct = daysCorrect(history);
  const completed = daysCompleted(history);

  // Release blob URLs on unmount — prevents leaks if the user toggles
  // image preview and closes without downloading.
  useEffect(() => {
    return () => {
      if (imgUrlRef.current) {
        URL.revokeObjectURL(imgUrlRef.current);
        imgUrlRef.current = null;
      }
    };
  }, []);

  function flash(msg, ms = 2200) {
    setHint(msg);
    setTimeout(() => setHint((cur) => (cur === msg ? '' : cur)), ms);
  }

  async function handleCopy() {
    const res = await copyText(shareText);
    if (res.ok) flash('✓ คัดลอกแล้ว! ไปแปะใน LINE / IG ได้เลย');
    else flash('คัดลอกไม่ได้, ลองใหม่');
  }

  async function ensureImage() {
    if (imgUrl) return imgUrl;
    const blob = await buildShareImage({ history, streak, todayDate, todayStatus });
    if (!blob) throw new Error('canvas blob failed');
    const url = URL.createObjectURL(blob);
    imgUrlRef.current = url;
    setImgUrl(url);
    return { url, blob };
  }

  async function handleSwitchToImage() {
    if (busy) return;
    setBusy(true);
    try {
      await ensureImage();
      setMode('image');
    } catch {
      flash('สร้างรูปไม่ได้, ลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      const ready = imgUrl ? { url: imgUrl } : await ensureImage();
      const a = document.createElement('a');
      a.href = ready.url;
      a.download = `vetmock-daily-q-${todayDate}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      flash('✓ ดาวน์โหลดรูปแล้ว — อัพ IG Story ได้เลย');
    } catch {
      flash('ดาวน์โหลดไม่ได้, ลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  async function handleNativeShare() {
    if (busy) return;
    setBusy(true);
    try {
      // Best path on mobile: navigator.share with a file — opens the
      // system share sheet, user picks IG Story / IG Direct / LINE / etc.
      const built = imgUrl ? null : await buildShareImage({ history, streak, todayDate, todayStatus });
      const blob = built;
      let file = null;
      if (blob) {
        file = new File([blob], `vetmock-daily-q-${todayDate}.png`, { type: 'image/png' });
      }
      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        file &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: 'VetMock, ข้อวันนี้',
          text: shareText,
        });
        flash('✓ เลือกแอปได้เลย');
      } else if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        // Text-only share — older iOS Safari + browsers without
        // canShare files. Still useful: user gets the grid + URL.
        await navigator.share({ title: 'VetMock, ข้อวันนี้', text: shareText });
        flash('✓ แชร์เรียบร้อย');
      } else {
        // Final fallback: copy text. User can paste anywhere.
        const res = await copyText(shareText);
        if (res.ok) flash('ไม่มี share sheet — คัดลอกให้แล้ว, ไปแปะได้เลย');
        else flash('แชร์ไม่ได้, ลองใหม่');
      }
      // Cache the blob URL only if we actually built one and didn't
      // cache it yet — saves re-rendering canvas on subsequent clicks.
      if (blob && !imgUrl) {
        const url = URL.createObjectURL(blob);
        imgUrlRef.current = url;
        setImgUrl(url);
      }
    } catch (err) {
      // AbortError = user cancelled the share sheet, not an error worth surfacing
      if (err?.name !== 'AbortError') flash('แชร์ไม่ได้, ลองใหม่');
    } finally {
      setBusy(false);
    }
  }

  // Emoji stack matched to canvas — keeps the inline grid color-rich
  // on Win/Android/iOS. system-ui last so we never crash if the colored
  // emoji fonts are missing.
  const emojiFontStack = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif';

  return (
    <div
      className="vmx-modal-overlay"
      onClick={onClose}
      style={{ zIndex: 1100 /* sit above TodaysQModal */ }}
    >
      <div
        ref={dialogRef}
        className="vmx-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480, paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
        tabIndex={-1}
        data-vmx-modal="true"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vmx-daily-share-title"
      >
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            แชร์ผลลัพธ์, DAILY Q
          </div>
          <h2 id="vmx-daily-share-title" style={{ margin: '4px 0 0', fontSize: 22 }}>{formatThaiShortDate(todayDate)}</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            แชร์ history 7 วันแบบ Wordle — ชวนเพื่อนมาเล่นด้วย
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, padding: 4, borderRadius: 999, background: 'var(--clr-surface-2, rgba(0,0,0,0.04))' }}>
          <button
            type="button"
            onClick={() => setMode('text')}
            style={{
              flex: 1, padding: '8px 10px', borderRadius: 999, border: 'none',
              minHeight: 44, cursor: 'pointer', fontSize: 13,
              background: mode === 'text' ? 'var(--clr-surface)' : 'transparent',
              fontWeight: mode === 'text' ? 700 : 500,
              boxShadow: mode === 'text' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            ข้อความ (chat)
          </button>
          <button
            type="button"
            onClick={handleSwitchToImage}
            disabled={busy}
            style={{
              flex: 1, padding: '8px 10px', borderRadius: 999, border: 'none',
              minHeight: 44, cursor: 'pointer', fontSize: 13,
              background: mode === 'image' ? 'var(--clr-surface)' : 'transparent',
              fontWeight: mode === 'image' ? 700 : 500,
              boxShadow: mode === 'image' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              opacity: busy ? 0.6 : 1,
            }}
          >
            รูป (IG Story)
          </button>
        </div>

        {/* Preview */}
        {mode === 'text' ? (
          <div
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(253,246,233,0.6), rgba(221,230,220,0.6))',
              border: '1px dashed var(--clr-border, rgba(0,0,0,0.12))',
              fontFamily: 'var(--vmx-mono)',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--clr-ink)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>VetMock, ข้อวันนี้, {formatThaiShortDate(todayDate)}</div>
            <div style={{ fontFamily: emojiFontStack, fontSize: 26, letterSpacing: '0.05em', marginBottom: 4 }}>
              {grid}
            </div>
            <div style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
              {correct}/{history.length} days{streak > 0 ? `, streak ${streak} 🔥` : ''}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--clr-ink-soft)' }}>
              https://vetmock.vercel.app
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 14, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--clr-border, rgba(0,0,0,0.12))', background: '#000' }}>
            {imgUrl ? (
              <img
                src={imgUrl}
                alt="VetMock daily Q share card"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            ) : (
              <div style={{ aspectRatio: '9 / 16', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>
                {busy ? 'กำลังสร้างรูป…' : 'กดปุ่ม "รูป (IG Story)" เพื่อ preview'}
              </div>
            )}
          </div>
        )}

        {/* Stats summary */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8, fontSize: 12, color: 'var(--clr-ink-soft)', fontFamily: 'var(--vmx-mono)', flexWrap: 'wrap' }}>
          <span>✓ {correct} ถูก</span>
          <span>, เล่นไป {completed}/{history.length} วัน</span>
          {streak > 0 && <span>, streak {streak}</span>}
        </div>

        {/* Action buttons */}
        <div
          style={{
            marginTop: 14,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 8,
          }}
        >
          <button
            type="button"
            className="vmx-btn vmx-btn-primary"
            onClick={handleCopy}
            disabled={busy}
            style={{ minHeight: 44 }}
          >
            คัดลอก
          </button>
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost"
            onClick={handleDownload}
            disabled={busy}
            style={{ minHeight: 44 }}
          >
            {busy && mode !== 'image' ? '⏳…' : 'PNG'}
          </button>
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost"
            onClick={handleNativeShare}
            disabled={busy}
            style={{ minHeight: 44 }}
          >
            แชร์
          </button>
        </div>

        {hint && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 10,
              fontSize: 12,
              color: 'var(--clr-sage, #4a6b4a)',
              fontFamily: 'var(--vmx-mono)',
              textAlign: 'center',
            }}
          >
            {hint}
          </div>
        )}

        <div className="vmx-btn-row" style={{ marginTop: 12 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose} type="button" style={{ minHeight: 44 }}>
            ← กลับ
          </button>
        </div>
      </div>
    </div>
  );
}
