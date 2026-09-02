// ============================================================
// ScoreBurst — a one-shot scatter of confetti behind a strong score
// ============================================================
// Purely decorative: the score, its colour and the message carry the
// information, so the burst is aria-hidden, compositor-only (transform +
// opacity in styles.css), plays once after the digits have rolled into
// place, and does not exist under prefers-reduced-motion.
//
// The geometry is deterministic (no randomness): a re-render never throws
// the pieces somewhere else, and the piece count is the only knob.

const PIECES = 14;

export default function ScoreBurst({ strong = false }) {
  const pieces = [];
  for (let i = 0; i < PIECES; i++) {
    const angle = (i / PIECES) * Math.PI * 2 + (i % 2 ? 0.2 : -0.15);
    const reach = (strong ? 120 : 84) + (i % 3) * (strong ? 28 : 18);
    const dx = Math.round(Math.cos(angle) * reach);
    const dy = Math.round(Math.sin(angle) * reach * 0.75) - 30;
    pieces.push(
      <i key={i} style={{ '--i': i, '--dx': `${dx}px`, '--dy': `${dy}px`, '--rot': `${(i * 67) % 360}deg` }} />,
    );
  }
  return <span className={`vmx-burst${strong ? ' is-strong' : ''}`} aria-hidden="true">{pieces}</span>;
}
