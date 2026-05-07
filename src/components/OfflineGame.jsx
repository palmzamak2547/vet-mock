// ──────────────────────────────────────────────────────────────────
// OfflineGame — Chrome T-Rex-style runner, vet-themed
//
// Player: 🐤 (lukai / chick) running on a poultry farm path.
// Obstacles:
//   • 🦠 Salmonella (ground)
//   • 💩 vent pasting (ground)
//   • 🟡 mycotoxin (ground)
//   • 🪰 fly vector (mid-air — must duck or jump)
// Controls:
//   • Space / Up / Tap — jump (or restart after game-over)
//   • Down — duck (lets fly pass overhead)
//   • Esc — close
// Scoring:
//   • +1 / frame distance · speed scales every 500 score
//   • High score persisted in localStorage as vmx-game-highscore
//
// Why all the game state is in refs instead of React state:
// the render loop runs at 60fps; if every velocity tweak triggered a
// re-render the framerate would tank. React state is only used for
// the UI panel (high-score banner) which doesn't need to refresh
// every frame.
//
// Bug fixes (2026-05-08, Palm reported):
//   1. Double-fire input: was attaching both pointerdown AND touchstart,
//      so a single tap on mobile fired twice (jump-then-jump or
//      reset-then-jump). Fix: detect pointer support; use one or the
//      other.
//   2. Hi-DPI on rotate/resize: canvas scale was set only at mount, so
//      rotating phone or resizing browser distorted the canvas. Fix:
//      ResizeObserver + re-apply scale on size change.
//   3. Hitbox too tight: 20px window for 30px sprite felt unfair —
//      visual contact didn't trigger collision. Fix: bumped to 26.
//   4. Air obstacle threshold too high: 200 score (~33s) before any
//      flying obstacle made warmup boring. Fix: lowered to 100.
//   5. Background tab kept running RAF: drained battery if user
//      switched tabs. Fix: pause via visibilitychange.
//   6. Game over → press Down: residual ducking state. Fix: reset()
//      explicitly sets ducking: false (was already done; verified).
// ──────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';

const CANVAS_W = 600;
const CANVAS_H = 200;
const GROUND_Y = 160;
const PLAYER_SIZE = 30;
const GRAVITY = 0.6;
const JUMP_V = -11;
const DUCK_HEIGHT = 18;
const HITBOX_X = 26;          // was 20 — felt too tight
const AIR_OBSTACLE_AFTER = 100; // was 200 — long boring warmup

const GROUND_OBSTACLES = ['🦠', '💩', '🟡'];
const AIR_OBSTACLES = ['🪰'];

const HIGH_SCORE_KEY = 'vmx-game-highscore';

export default function OfflineGame({ onClose }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    player: { x: 60, y: GROUND_Y, vy: 0, jumping: false, ducking: false },
    obstacles: [],
    speed: 5,
    score: 0,
    nextSpawn: 80,
    spawnTimer: 0,
    frame: 0,
    state: 'ready',
    paused: false,
  });
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const [highScore, setHighScore] = useState(() => {
    try { return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0); }
    catch { return 0; }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Hi-DPI scaling. Re-applied on resize so phone rotation looks
    // sharp instead of stretched.
    const applyScale = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = CANVAS_W * dpr;
      canvas.height = CANVAS_H * dpr;
      canvas.style.width = `${CANVAS_W}px`;
      canvas.style.height = `${CANVAS_H}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before re-scaling
      ctx.scale(dpr, dpr);
    };
    applyScale();

    let rafId;
    let alive = true;

    const reset = () => {
      const s = stateRef.current;
      s.player = { x: 60, y: GROUND_Y, vy: 0, jumping: false, ducking: false };
      s.obstacles = [];
      s.speed = 5;
      s.score = 0;
      s.nextSpawn = 80;
      s.spawnTimer = 0;
      s.frame = 0;
      s.state = 'playing';
      s.paused = false;
      setGameState('playing');
      setScoreDisplay(0);
    };

    const jump = () => {
      const p = stateRef.current.player;
      if (!p.jumping) {
        p.vy = JUMP_V;
        p.jumping = true;
        p.ducking = false;
      }
    };

    const setDuck = (ducking) => {
      const p = stateRef.current.player;
      if (!p.jumping) p.ducking = ducking;
    };

    const gameOver = () => {
      const s = stateRef.current;
      s.state = 'gameover';
      setGameState('gameover');
      const final = Math.floor(s.score);
      try {
        const prev = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
        if (final > prev) {
          localStorage.setItem(HIGH_SCORE_KEY, String(final));
          setHighScore(final);
        }
      } catch {}
    };

    const trigger = () => {
      const s = stateRef.current;
      if (s.state === 'ready' || s.state === 'gameover') reset();
      else jump();
    };

    // Input handlers. We pick exactly ONE pointer-style listener — the
    // browser's PointerEvents API supersedes touchstart on modern
    // mobile; the legacy touchstart fallback is only attached when
    // PointerEvents are missing (very old WebView). This stops the
    // double-fire that caused tapping to "jump twice" on iOS.
    const supportsPointer = typeof window !== 'undefined' && 'PointerEvent' in window;

    const onKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        trigger();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setDuck(true);
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'ArrowDown') setDuck(false);
    };
    const onPointer = (e) => {
      e.preventDefault();
      trigger();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    if (supportsPointer) {
      canvas.addEventListener('pointerdown', onPointer);
    } else {
      canvas.addEventListener('touchstart', onPointer, { passive: false });
    }

    // Pause loop when the tab is hidden — saves battery and prevents
    // a giant time-jump when you tab back in (rAF coalesces hidden
    // ticks but our scoring is per-frame, so an unpaused background
    // would either freeze or accelerate the next frame).
    const onVisibility = () => {
      stateRef.current.paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Re-apply DPR when window/canvas size changes (rotation, browser
    // resize, dev-tools panel toggle).
    const ro = new ResizeObserver(() => applyScale());
    ro.observe(canvas);

    const loop = () => {
      if (!alive) return;
      const s = stateRef.current;

      if (s.paused) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      // ── update ──
      if (s.state === 'playing') {
        const p = s.player;
        p.vy += GRAVITY;
        p.y += p.vy;
        if (p.y >= GROUND_Y) {
          p.y = GROUND_Y;
          p.vy = 0;
          p.jumping = false;
        }

        // Spawn obstacles
        s.spawnTimer++;
        if (s.spawnTimer >= s.nextSpawn) {
          s.spawnTimer = 0;
          s.nextSpawn = 70 + Math.floor(Math.random() * 80);
          const useAir = s.score > AIR_OBSTACLE_AFTER && Math.random() < 0.25;
          const list = useAir ? AIR_OBSTACLES : GROUND_OBSTACLES;
          const type = list[Math.floor(Math.random() * list.length)];
          s.obstacles.push({
            x: CANVAS_W + 20,
            y: useAir ? GROUND_Y - 32 : GROUND_Y + 4,
            type,
            air: useAir,
          });
        }

        // Move + cull
        s.obstacles = s.obstacles.filter((o) => {
          o.x -= s.speed;
          return o.x > -40;
        });

        // Collisions — wider hitbox so visual contact actually counts
        const px = p.x;
        const pyTop = p.ducking ? p.y + DUCK_HEIGHT : p.y;
        const pyBot = p.y + PLAYER_SIZE;
        for (const o of s.obstacles) {
          const ox = o.x;
          const oyTop = o.y;
          const oyBot = o.y + 26;
          const overlapX = Math.abs(px - ox) < HITBOX_X;
          const overlapY = pyBot > oyTop && pyTop < oyBot;
          if (overlapX && overlapY) {
            gameOver();
            break;
          }
        }

        // Score + difficulty
        s.score += 0.1;
        const newScore = Math.floor(s.score);
        if (newScore !== Math.floor(s.score - 0.1)) setScoreDisplay(newScore);
        if (s.frame % 500 === 0 && s.frame > 0) {
          s.speed = Math.min(s.speed + 0.4, 12);
        }
        s.frame++;
      }

      // ── render ──
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Ground line
      ctx.strokeStyle = '#8a7a5c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + PLAYER_SIZE);
      ctx.lineTo(CANVAS_W, GROUND_Y + PLAYER_SIZE);
      ctx.stroke();

      // Animated dashes (parallax)
      ctx.strokeStyle = '#c4b694';
      ctx.lineWidth = 1;
      ctx.setLineDash([10, 14]);
      ctx.lineDashOffset = -((stateRef.current.frame * stateRef.current.speed) % 24);
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + PLAYER_SIZE + 8);
      ctx.lineTo(CANVAS_W, GROUND_Y + PLAYER_SIZE + 8);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player
      const p = stateRef.current.player;
      ctx.font = p.ducking
        ? '24px "Apple Color Emoji","Segoe UI Emoji",sans-serif'
        : '30px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
      ctx.fillText('🐤', p.x, p.y + PLAYER_SIZE - (p.ducking ? 4 : 0));

      // Obstacles
      ctx.font = '24px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
      for (const o of stateRef.current.obstacles) {
        ctx.fillText(o.type, o.x, o.y + PLAYER_SIZE);
      }

      // Score (top-right)
      ctx.fillStyle = '#3d3a36';
      ctx.font = '14px monospace';
      ctx.textAlign = 'right';
      const scoreStr = String(Math.floor(stateRef.current.score)).padStart(5, '0');
      const hi = String(highScore).padStart(5, '0');
      ctx.fillText(`HI ${hi}   ${scoreStr}`, CANVAS_W - 12, 22);
      ctx.textAlign = 'left';

      // Overlays
      if (stateRef.current.state === 'ready') {
        ctx.fillStyle = '#3d3a36';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('แตะ / กด Space เพื่อเริ่ม', CANVAS_W / 2, CANVAS_H / 2 - 8);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#7a6f5e';
        ctx.fillText('ลูกไก่หนีเชื้อโรค · ↓ หมอบ · ↑/Space กระโดด', CANVAS_W / 2, CANVAS_H / 2 + 12);
        ctx.textAlign = 'left';
      } else if (stateRef.current.state === 'gameover') {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(CANVAS_W / 2 - 130, CANVAS_H / 2 - 36, 260, 56);
        ctx.fillStyle = '#a73d3d';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('G A M E   O V E R', CANVAS_W / 2, CANVAS_H / 2 - 10);
        ctx.fillStyle = '#3d3a36';
        ctx.font = '12px sans-serif';
        ctx.fillText('แตะเพื่อเล่นอีกครั้ง', CANVAS_W / 2, CANVAS_H / 2 + 10);
        ctx.textAlign = 'left';
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibility);
      if (supportsPointer) {
        canvas.removeEventListener('pointerdown', onPointer);
      } else {
        canvas.removeEventListener('touchstart', onPointer);
      }
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: 16,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          background: 'linear-gradient(180deg, #f6efe4 0%, #f0e6d2 100%)',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          touchAction: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Offline mini-game canvas"
      />
      <div style={{ fontSize: 13, color: 'var(--clr-ink-soft, #7a6f5e)', textAlign: 'center' }}>
        🐤 ลูกไก่หนีเชื้อโรค · ↑/Space = กระโดด · ↓ = หมอบ · Esc = ปิด
      </div>
      {gameState === 'gameover' && scoreDisplay > 0 && scoreDisplay >= highScore && (
        <div
          style={{
            background: 'rgba(184, 137, 64, 0.12)',
            color: 'var(--clr-gold, #b88940)',
            padding: '6px 14px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          🎉 New High Score!
        </div>
      )}
    </div>
  );
}
