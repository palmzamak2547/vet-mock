// ============================================================
// ImageOcclusionCard — SR-session renderer for image-occlusion Qs
// ============================================================
// Front: image with ALL masks shown. The current target (q.mask)
//        is highlighted orange so the user knows what to recall;
//        the rest are blue so context isn't given away.
// Back:  image with all masks REMOVED (transparent) so the
//        underlying labels are visible. The user's typed answer
//        ("เฉลย: …") appears below.
//
// Props:
//   q           — one element from loadOcclusionCards()
//   showAnswer  — bool, controlled by SRSessionView
//   onReveal    — optional callback when user taps the card
// ============================================================

import { useId } from 'react';

const TARGET_COLOR = '#F39C12'; // Chula-orange-ish, used when masked
const OTHER_COLOR = '#4A90E2';  // Anki blue
const MASK_FILL_OPACITY = 0.92;

export default function ImageOcclusionCard({ q, showAnswer, onReveal }) {
  const revealInstructionId = useId();

  if (!q || !q.imageDataUrl) {
    return (
      <div style={{
        padding: 24, textAlign: 'center', color: 'var(--clr-rose)',
      }}>
        Image occlusion card นี้ไม่สมบูรณ์
      </div>
    );
  }

  const allMasks = Array.isArray(q.allMasks) ? q.allMasks : [];
  const target = q.mask;
  const canReveal = !showAnswer && typeof onReveal === 'function';

  const imageStyle = {
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: 0,
    border: 0,
    borderRadius: 10,
    overflow: 'hidden',
    background: '#000',
    cursor: canReveal ? 'pointer' : 'default',
    userSelect: 'none',
  };

  const image = (
    <>
      <img
        src={q.imageDataUrl}
        alt={q.deckName || 'image occlusion'}
        draggable={false}
        style={{ display: 'block', width: '100%', height: 'auto', pointerEvents: 'none' }}
      />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Front: ALL masks opaque, target highlighted. */}
        {/* Back: only non-target masks (semi-transparent context). */}
        {!showAnswer && allMasks.map((m) => {
          const isTarget = target && m.id === q.maskId;
          return (
            <rect
              key={m.id}
              x={m.x * 100}
              y={m.y * 100}
              width={m.w * 100}
              height={m.h * 100}
              fill={isTarget ? TARGET_COLOR : OTHER_COLOR}
              fillOpacity={MASK_FILL_OPACITY}
              stroke={isTarget ? '#a35a06' : '#1f63a8'}
              strokeWidth={isTarget ? 0.4 : 0.2}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {showAnswer && target && (
          // On the back, draw only the target's outline so the user can
          // still locate which region was being asked about.
          <rect
            x={target.x * 100}
            y={target.y * 100}
            width={target.w * 100}
            height={target.h * 100}
            fill="none"
            stroke={TARGET_COLOR}
            strokeWidth={0.5}
            strokeDasharray="1 1"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </>
  );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 720,
        margin: '0 auto',
      }}
    >
      {q.deckName && (
        <div style={{
          fontSize: 12,
          color: 'var(--clr-ink-soft)',
          textAlign: 'center',
          marginBottom: 6,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          🖼 {q.deckName}
        </div>
      )}

      {canReveal ? (
        <button
          type="button"
          onClick={onReveal}
          aria-label="เปิดเฉลยภาพ"
          aria-describedby={revealInstructionId}
          style={imageStyle}
        >
          {image}
        </button>
      ) : (
        <div style={imageStyle}>{image}</div>
      )}

      {canReveal ? (
        <div id={revealInstructionId} style={{
          marginTop: 10,
          textAlign: 'center',
          color: 'var(--clr-ink-soft)',
          fontSize: 14,
        }}>
          แตะหรือคลิกรูป หรือกด Enter หรือ Space เพื่อเปิดเฉลย
        </div>
      ) : showAnswer ? (
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          borderRadius: 10,
          background: 'var(--clr-sage-soft)',
          color: 'var(--clr-sage)',
          fontWeight: 600,
          textAlign: 'center',
          fontSize: 16,
          lineHeight: 1.45,
        }}>
          {q.label && <div style={{ fontSize: 12, opacity: 0.75, fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>{q.label}</div>}
          เฉลย: {q.answer || q.back || '(no answer)'}
        </div>
      ) : null}
    </div>
  );
}
