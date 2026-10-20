import { artImgFallback } from '../lib/art-fallback.js';

// The 2D picture of a study-squad mascot, used wherever the 3D model cannot
// or should not run: no WebGL, a lost GPU context, a model or code chunk that
// failed to load, and reduced motion in the Pomodoro celebration. It imports
// nothing from three, so a screen can show it without pulling the 3D chunk.
export default function MascotStill({ mascot, note, size = 160 }) {
  if (!mascot?.src) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 8px', textAlign: 'center' }}>
      <img
        src={mascot.src}
        alt={mascot.alt || ''}
        width={size}
        height={size}
        decoding="async"
        onError={artImgFallback}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
      {note && <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--clr-ink-soft)' }}>{note}</p>}
    </div>
  );
}
