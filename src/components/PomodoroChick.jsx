// PomodoroChick — pure-SVG companion that grows alongside a focus session.
//
// Stages by progress (0..1):
//   0.00–0.25 : egg (crack appears near 0.20)
//   0.25–0.50 : hatching (chick peeking out of broken shell)
//   0.50–0.85 : baby chick (waddle)
//   0.85–1.00 : grown chicken (proud stance)
//
// state prop drives non-progress overlays:
//   'running'   — normal animation
//   'paused'    — animations frozen
//   'escaped'   — sad chick fading
//   'completed' — sparkles + scale pulse

import { useEffect, useState } from 'react';

function pickStage(progress) {
  if (progress < 0.25) return 'egg';
  if (progress < 0.5) return 'hatching';
  if (progress < 0.85) return 'baby';
  return 'grown';
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}

export default function PomodoroChick({ progress = 0, state = 'idle' }) {
  const reduced = usePrefersReducedMotion();
  const stage = pickStage(Math.max(0, Math.min(1, progress)));
  const showCrack = stage === 'egg' && progress >= 0.2;
  const escaped = state === 'escaped';
  const completed = state === 'completed';
  const paused = state === 'paused';

  // Animation classes (CSS in <style> below). Reduced motion → static.
  const waddleClass = !reduced && stage === 'baby' && state === 'running' ? 'pmd-waddle' : '';
  const proudClass =
    !reduced && stage === 'grown' && (state === 'running' || completed) ? 'pmd-proud' : '';
  const fadeClass = escaped ? 'pmd-fade' : '';
  const pulseClass = !reduced && completed ? 'pmd-pulse' : '';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 280,
        aspectRatio: '1 / 1',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes pmdWaddle { 0%,100% { transform: rotate(-4deg);} 50% { transform: rotate(4deg);} }
        @keyframes pmdProud  { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-3px);} }
        @keyframes pmdFade   { 0% { opacity:1; transform: scale(1);} 100% { opacity:0; transform: scale(0.85) translateY(8px);} }
        @keyframes pmdPulse  { 0%,100% { transform: scale(1);} 50% { transform: scale(1.06);} }
        @keyframes pmdSparkle{ 0%,100% { opacity:0; transform: scale(0.8);} 50% { opacity:1; transform: scale(1.1);} }
        .pmd-waddle { animation: pmdWaddle 1.4s ease-in-out infinite; transform-origin: 50% 90%; }
        .pmd-proud  { animation: pmdProud 2.2s ease-in-out infinite; }
        .pmd-fade   { animation: pmdFade 1.2s ease-out forwards; }
        .pmd-pulse  { animation: pmdPulse 1.6s ease-in-out infinite; }
        .pmd-sparkle{ animation: pmdSparkle 1.8s ease-in-out infinite; }
        .pmd-paused * { animation-play-state: paused !important; }
      `}</style>

      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className={`${fadeClass} ${pulseClass} ${paused ? 'pmd-paused' : ''}`}
        style={{ overflow: 'visible' }}
      >
        {/* Ground shadow */}
        <ellipse cx="100" cy="175" rx="55" ry="6" fill="rgba(0,0,0,0.12)" />

        {stage === 'egg' && (
          <g>
            {/* Egg body */}
            <ellipse cx="100" cy="115" rx="48" ry="60" fill="#fff7e6" stroke="#d9b370" strokeWidth="2" />
            {/* Subtle speckles */}
            <circle cx="85" cy="100" r="3" fill="#d9b370" opacity="0.5" />
            <circle cx="118" cy="125" r="2.5" fill="#d9b370" opacity="0.4" />
            <circle cx="95" cy="145" r="2" fill="#d9b370" opacity="0.5" />
            {/* Crack — appears at progress ≥ 0.2 */}
            {showCrack && (
              <path
                d="M 75 95 L 85 105 L 80 110 L 95 118 L 88 125"
                stroke="#7a5a30"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </g>
        )}

        {stage === 'hatching' && (
          <g>
            {/* Bottom half of shell */}
            <path d="M 52 120 Q 100 200 148 120 Q 130 150 100 152 Q 70 150 52 120 Z" fill="#fff7e6" stroke="#d9b370" strokeWidth="2" />
            {/* Top jagged shell piece floating */}
            <path d="M 70 80 L 80 70 L 92 78 L 105 65 L 118 76 L 130 70 L 132 88 L 70 88 Z" fill="#fff7e6" stroke="#d9b370" strokeWidth="2" />
            {/* Chick peeking */}
            <circle cx="100" cy="115" r="28" fill="#ffe066" stroke="#e6a900" strokeWidth="2" />
            <circle cx="92" cy="108" r="3" fill="#222" />
            <circle cx="108" cy="108" r="3" fill="#222" />
            <path d="M 96 118 L 100 122 L 104 118 Z" fill="#ff9a3c" stroke="#c46a00" strokeWidth="1" />
          </g>
        )}

        {stage === 'baby' && (
          <g className={waddleClass}>
            {/* Body */}
            <ellipse cx="100" cy="120" rx="40" ry="38" fill="#ffe066" stroke="#e6a900" strokeWidth="2" />
            {/* Head */}
            <circle cx="100" cy="80" r="28" fill="#ffe066" stroke="#e6a900" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="91" cy="76" r="3.5" fill="#222" />
            <circle cx="109" cy="76" r="3.5" fill="#222" />
            <circle cx="92" cy="74.5" r="1.2" fill="#fff" />
            <circle cx="110" cy="74.5" r="1.2" fill="#fff" />
            {/* Beak */}
            <path d="M 94 86 L 100 92 L 106 86 Z" fill="#ff9a3c" stroke="#c46a00" strokeWidth="1" />
            {/* Tiny wing */}
            <path d="M 70 118 Q 60 128 72 138 Q 78 130 78 122 Z" fill="#ffd633" stroke="#c69300" strokeWidth="1.5" />
            {/* Feet */}
            <line x1="90" y1="158" x2="90" y2="170" stroke="#ff9a3c" strokeWidth="3" strokeLinecap="round" />
            <line x1="110" y1="158" x2="110" y2="170" stroke="#ff9a3c" strokeWidth="3" strokeLinecap="round" />
            {/* Tiny tail tuft */}
            <path d="M 138 110 Q 150 108 146 118 Q 142 116 138 118 Z" fill="#ffd633" stroke="#c69300" strokeWidth="1" />
          </g>
        )}

        {stage === 'grown' && (
          <g className={proudClass}>
            {/* Body */}
            <ellipse cx="100" cy="120" rx="48" ry="45" fill="#fff2c2" stroke="#c69300" strokeWidth="2" />
            {/* Wing */}
            <path d="M 65 118 Q 50 130 68 148 Q 80 138 80 124 Z" fill="#ffd633" stroke="#c69300" strokeWidth="1.5" />
            {/* Head */}
            <circle cx="100" cy="70" r="30" fill="#fff2c2" stroke="#c69300" strokeWidth="2" />
            {/* Comb (red crown) */}
            <path d="M 82 50 Q 88 38 94 50 Q 100 38 106 50 Q 112 38 118 50 L 118 60 L 82 60 Z" fill="#ff4d4d" stroke="#b00000" strokeWidth="1.5" />
            {/* Eyes */}
            <circle cx="90" cy="68" r="3.8" fill="#222" />
            <circle cx="110" cy="68" r="3.8" fill="#222" />
            <circle cx="91" cy="66.5" r="1.3" fill="#fff" />
            <circle cx="111" cy="66.5" r="1.3" fill="#fff" />
            {/* Beak */}
            <path d="M 92 78 L 100 86 L 108 78 Z" fill="#ff9a3c" stroke="#c46a00" strokeWidth="1" />
            {/* Wattle */}
            <path d="M 96 86 Q 100 96 104 86 Z" fill="#ff4d4d" stroke="#b00000" strokeWidth="1" />
            {/* Feet */}
            <line x1="88" y1="160" x2="88" y2="172" stroke="#ff9a3c" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="112" y1="160" x2="112" y2="172" stroke="#ff9a3c" strokeWidth="3.5" strokeLinecap="round" />
            {/* Tail feathers */}
            <path d="M 145 105 Q 168 95 162 120 Q 158 115 150 118 Z" fill="#ffb800" stroke="#c69300" strokeWidth="1.5" />
            <path d="M 145 115 Q 172 115 162 135 Q 158 128 150 128 Z" fill="#ffd633" stroke="#c69300" strokeWidth="1.5" />
          </g>
        )}

        {/* Completion sparkles */}
        {completed && (
          <g>
            <text x="40" y="50" fontSize="22" className={!reduced ? 'pmd-sparkle' : ''}>✨</text>
            <text x="155" y="55" fontSize="20" className={!reduced ? 'pmd-sparkle' : ''} style={{ animationDelay: '0.3s' }}>✨</text>
            <text x="30" y="140" fontSize="18" className={!reduced ? 'pmd-sparkle' : ''} style={{ animationDelay: '0.6s' }}>⭐</text>
            <text x="160" y="135" fontSize="18" className={!reduced ? 'pmd-sparkle' : ''} style={{ animationDelay: '0.9s' }}>⭐</text>
          </g>
        )}
      </svg>

      {/* Escape overlay — sad face */}
      {escaped && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 56,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
            opacity: 0.95,
          }}
        >
          💔
        </div>
      )}
    </div>
  );
}
