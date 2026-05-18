// ============================================================
// TodaysQModal — single-Q daily challenge modal
// ============================================================
//
// Opens from the HomeView "🌟 ข้อวันนี้" chip. Renders ONE MCQ in a
// compact modal: stem → 4 options → answer reveal → done. Records
// the answer (correct or not) so the chip flips to ✓ once done.
//
// We deliberately don't route through the full exam flow because:
//   • Daily Q = quick habit loop (10 sec), not 50-Q grind
//   • No timer pressure, no streak penalty for wrong answer
//   • Single modal = less context switching, easier to do in waiting rooms
// ============================================================

import { lazy, Suspense, useState } from 'react';
import { RichText } from '../lib/richtext.jsx';
import { isCorrect } from '../hooks/utils.js';
import { recordTodaysQAnswer } from '../lib/daily-q.js';
import { SUBJECTS } from '../data/curriculum.js';
import { buildShareUrl } from '../lib/share-link.js';
import { copyText } from '../lib/clipboard.js';

// Lazy-load the share card — it pulls a 1080×1920 canvas helper and
// isn't needed until the user actually picks an answer + taps share.
// Keeps the daily-Q modal opening fast on slow networks.
const DailyQShareCard = lazy(() => import('./DailyQShareCard.jsx'));

export default function TodaysQModal({ q, onClose, onDone }) {
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [todayResult, setTodayResult] = useState(null);
  const [challengeHint, setChallengeHint] = useState('');

  if (!q) return null;
  const correctIdx = q.answer;
  const subjectMeta = SUBJECTS.find((s) => s.id === q.subject);

  function pickAnswer(idx) {
    if (revealed) return;
    setPicked(idx);
    const wasCorrect = isCorrect(q, idx);
    setRevealed(true);
    setTodayResult(wasCorrect ? 'correct' : 'wrong');
    recordTodaysQAnswer({
      qSubject: q.subject,
      qId: q.id,
      choice: idx,
      correct: wasCorrect,
    });
    onDone?.(wasCorrect);
  }

  return (
    <div className="vmx-modal-overlay" onClick={onClose} role="dialog" aria-label="Today's Q">
      <div className="vmx-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            🌟 ข้อวันนี้ · {subjectMeta?.icon || ''} {subjectMeta?.name || q.subject}
          </div>
          <h2 style={{ margin: '4px 0 0', fontSize: 20 }}>1 ข้อ ใน 1 วัน</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--clr-ink-soft)' }}>
            ลอง 1 ข้อ — ถูกผิดไม่นับเข้า history หลัก, แค่สร้าง habit
          </p>
        </div>

        <div style={{ marginTop: 16, fontSize: 15, lineHeight: 1.6 }}>
          <RichText text={q.q} />
        </div>

        <div className="vmx-options" style={{ marginTop: 12 }}>
          {q.options.map((opt, i) => {
            const isCorrectAnswer = i === correctIdx;
            const isPicked = picked === i;
            let bg = '';
            let border = '';
            if (revealed) {
              if (isCorrectAnswer) {
                bg = 'rgba(74, 107, 74, 0.15)';
                border = '2px solid var(--clr-sage)';
              } else if (isPicked) {
                bg = 'rgba(192, 57, 43, 0.10)';
                border = '2px solid var(--clr-rose, #c0392b)';
              }
            }
            return (
              <button
                key={i}
                className="vmx-option"
                onClick={() => pickAnswer(i)}
                disabled={revealed}
                style={{ background: bg || undefined, border: border || undefined }}
              >
                <div className="vmx-option-letter">{String.fromCharCode(65 + i)}</div>
                <div className="vmx-option-text">
                  <RichText text={opt} />
                </div>
                {revealed && isCorrectAnswer && <span style={{ marginLeft: 'auto', color: 'var(--clr-sage)', fontWeight: 700 }}>✓</span>}
                {revealed && isPicked && !isCorrectAnswer && <span style={{ marginLeft: 'auto', color: 'var(--clr-rose, #c0392b)' }}>✗</span>}
              </button>
            );
          })}
        </div>

        {revealed && q.explain && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'rgba(74, 107, 74, 0.06)', border: '1px solid var(--clr-sage)', fontSize: 13, lineHeight: 1.6 }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', color: 'var(--clr-sage)', marginBottom: 4 }}>
              เฉลย
            </div>
            <RichText text={q.explain} />
          </div>
        )}

        <div className="vmx-btn-row" style={{ marginTop: 14, flexWrap: 'wrap', gap: 8 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={onClose} type="button" style={{ minHeight: 44 }}>
            {revealed ? 'ปิด · เจอกันพรุ่งนี้' : 'ปิด'}
          </button>
          {revealed && (
            <>
              <button
                className="vmx-btn vmx-btn-primary"
                onClick={() => setShareOpen(true)}
                type="button"
                style={{ minHeight: 44 }}
                title="แชร์ history 7 วันแบบ Wordle ให้เพื่อน"
              >
                📤 แชร์ผลลัพธ์
              </button>
              <button
                className="vmx-btn vmx-btn-ghost"
                type="button"
                style={{ minHeight: 44 }}
                title="ส่งลิงก์ให้เพื่อนลองทำข้อเดียวกัน (เปิดลิงก์แล้วเข้าข้อทันที ไม่ผ่านหน้าแรก)"
                onClick={async () => {
                  const url = buildShareUrl([q]);
                  if (!url) {
                    setChallengeHint('สร้างลิงก์ไม่ได้');
                    setTimeout(() => setChallengeHint(''), 3000);
                    return;
                  }
                  const text = `ลองทำข้อนี้ดิ 📚 VetMock daily Q — ตอบถูกไหม?\n${url}`;
                  try {
                    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
                      await navigator.share({ title: 'VetMock challenge', text });
                      setChallengeHint('✓ ส่งให้เพื่อนแล้ว');
                      setTimeout(() => setChallengeHint(''), 3000);
                      return;
                    }
                  } catch (err) {
                    if (err?.name === 'AbortError') return;
                  }
                  const res = await copyText(text);
                  setChallengeHint(res.ok ? '✓ คัดลอกแล้ว · วางใน LINE / IG ได้เลย' : '⚠️ คัดลอกไม่ได้');
                  setTimeout(() => setChallengeHint(''), 3500);
                }}
              >
                🎯 ท้าเพื่อนทำข้อนี้
              </button>
            </>
          )}
        </div>
        {challengeHint && (
          <div role="status" aria-live="polite" style={{
            marginTop: 8,
            fontSize: 12,
            color: 'var(--clr-sage, #4a6b4a)',
            fontFamily: 'JetBrains Mono, monospace',
            textAlign: 'center',
          }}>
            {challengeHint}
          </div>
        )}
      </div>

      {shareOpen && (
        <Suspense fallback={null}>
          <DailyQShareCard
            todayResult={todayResult}
            onClose={() => setShareOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
