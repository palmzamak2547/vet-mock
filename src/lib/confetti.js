// ============================================================
// confetti.js — tiny self-contained confetti burst
// ============================================================
// Lazy-imported only when user gets a perfect score (or other
// celebration moment), so the canvas + animation code never
// hits the main bundle. ~80 lines, no dependency.
//
// Usage:
//   import('./lib/confetti.js').then(m => m.fireConfetti());
// ============================================================

const COLORS = [
  '#c26d6d', // rose
  '#b88940', // gold
  '#4a6b4a', // sage
  '#3d6b82', // ocean
  '#7d4a7d', // plum
  '#d4a556', // gold-light
  '#7ba87b', // sage-light
];

let activeCanvas = null;
let activeRaf = 0;

function ensureCanvas() {
  if (activeCanvas) return activeCanvas;
  const c = document.createElement('canvas');
  c.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    width: 100vw; height: 100vh;
  `;
  c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  activeCanvas = c;
  return c;
}

function destroyCanvas() {
  if (!activeCanvas) return;
  if (activeCanvas.parentNode) activeCanvas.parentNode.removeChild(activeCanvas);
  activeCanvas = null;
}

function makeParticle(originX, originY) {
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8; // upward fan
  const speed = 8 + Math.random() * 12;
  return {
    x: originX,
    y: originY,
    vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
    vy: Math.sin(angle) * speed,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.4,
    size: 6 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() < 0.5 ? 'rect' : 'circle',
    alpha: 1,
  };
}

/**
 * Fire a one-shot confetti burst.
 * Safe to call multiple times — each fires its own particle batch
 * but shares one canvas. The canvas is auto-removed when all
 * particles fade out.
 */
export function fireConfetti({ count = 120, originXRatio = 0.5, originYRatio = 0.55 } = {}) {
  if (typeof document === 'undefined') return;

  // Respect user preference — no flying particles for vestibular folks
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const canvas = ensureCanvas();
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const ox = w * originXRatio;
  const oy = h * originYRatio;
  const particles = Array.from({ length: count }, () => makeParticle(ox, oy));

  // If a previous burst is animating, don't double-schedule a frame loop.
  // Each burst's particles are independent; we just append to a shared list.
  if (!canvas._particles) canvas._particles = [];
  canvas._particles.push(...particles);

  if (activeRaf) return; // a tick loop is already running

  const tick = () => {
    const list = canvas._particles || [];
    if (list.length === 0) {
      destroyCanvas();
      activeRaf = 0;
      return;
    }

    ctx.clearRect(0, 0, w, h);

    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      // Physics — gravity + drag
      p.vy += 0.3;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      // Fade as they fall off screen
      if (p.y > h * 0.9) p.alpha -= 0.02;
      if (p.alpha <= 0 || p.y > h + 50) {
        list.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    activeRaf = requestAnimationFrame(tick);
  };

  activeRaf = requestAnimationFrame(tick);
}
