// ──────────────────────────────────────────────────────────────────
// OfflineGame — Chrome T-Rex-style runner, vet-themed
//
// Player: 🐤 (lukai / chick) running on a poultry farm path.
// Obstacles:
//   • 🦠 Salmonella (ground)
//   • 💩 vent pasting (ground)
//   • 🪰 fly vector (mid-air — must stay grounded)
// Controls:
//   • Space / Up / Tap — jump
//   • Down — duck (lets fly pass overhead)
//   • Any key after game-over — restart
// Scoring:
//   • +1 / frame distance
//   • Speed scales every 500 score
//   • High score persisted in localStorage as vmx-game-highscore
//
// Why all the game state is in refs instead of React state:
// the render loop runs at 60fps; if every velocity tweak triggered
// a re-render the framerate would tank. React only re-renders for
// the score display + game-over overlay.
// ──────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';

const CANVAS_W = 600;
const CANVAS_H = 200;
const GROUND_Y = 160;          // top of the path line
const PLAYER_SIZE = 30;
const GRAVITY = 0.6;
const JUMP_V = -11;
const DUCK_HEIGHT = 18;

const GROUND_OBSTACLES = ['🦠', '💩', '🟡']; // salmonella · vent paste · mycotoxin
const AIR_OBSTACLES = ['🪰'];                 // fly vector — duck under

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
    state: 'ready', // ready | playing | gameover
  });
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const [highScore, setHighScore] = useState(() => {
    try { return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0); }
    catch { return 0; }
  });

  // Single setup+teardown — game loop lives forever inside this effect.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Hi-DPI: render at 2x for crisp text on retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;
    ctx.scale(dpr, dpr);

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
    canvas.addEventListener('pointerdown', onPointer);
    canvas.addEventListener('touchstart', onPointer, { passive: false });

    const loop = () => {
      if (!alive) return;
      const s = stateRef.current;

      // ── update ──
      if (s.state === 'playing') {
        // Player physics
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
          // 25% chance of an air obstacle once we're past warm-up
          const useAir = s.score > 200 && Math.random() < 0.25;
          const list = useAir ? AIR_OBSTACLES : GROUND_OBSTACLES;
          const type = list[Math.floor(Math.random() * list.length)];
          s.obstacles.push({
            x: CANVAS_W + 20,
            y: useAir ? GROUND_Y - 32 : GROUND_Y + 4,
            type,
            air: useAir,
          });
        }

        // Move obstacles + cull off-screen
        s.obstacles = s.obstacles.filter((o) => {
          o.x -= s.speed;
          return o.x > -40;
        });

        // Collisions: tighter hitbox so it feels fair
        const px = p.x;
        const pyTop = p.ducking ? p.y + DUCK_HEIGHT : p.y;
        const pyBot = p.y + PLAYER_SIZE;
        for (const o of s.obstacles) {
          const ox = o.x;
          const oyTop = o.y;
          const oyBot = o.y + 26;
          const overlapX = Math.abs(px - ox) < 20;
          const overlapY = pyBot > oyTop && pyTop < oyBot;
          if (overlapX && overlapY) {
            gameOver();
            break;
          }
        }

        // Score + difficulty ramp
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

      // Animated dashes on the ground (parallax)
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

      // Ready / gameover overlays
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
      canvas.removeEventListener('pointerdown', onPointer);
      canvas.removeEventListener('touchstart', onPointer);
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
