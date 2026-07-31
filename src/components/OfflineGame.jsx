// ──────────────────────────────────────────────────────────────────
// OfflineGame v2 — Chrome T-Rex-style runner, vet-themed
// ──────────────────────────────────────────────────────────────────
// Player: 🐤 (lukai / chick) running on a poultry farm path.
//
// Obstacles (ground): 🦠 Salmonella · 💩 vent pasting · 🟡 mycotoxin
// Obstacles (air):    🪰 fly vector (jump-OR-duck to clear)
// Pickups:            💉 syringe = 4-sec invincibility (rare)
//                     🌽 corn = +50 instant score (common)
//
// Controls:
//   Space / ↑ / Tap   — jump (or restart after game-over)
//   ↓                 — duck (lets fly pass overhead)
//   Esc               — close
//
// Scoring:
//   • +0.1 per frame distance
//   • Combo system: dodge consecutive obstacles → multiplier (5+/10+/20+)
//   • Pickups give score / shield
//   • High score persisted in localStorage
//
// What's new in v2 (2026-05-10):
//   ✨ 2-layer parallax (clouds + ground dashes) — actually feels alive
//   🎮 Pickups: 💉 invincibility shield + 🌽 corn score boost
//   🔥 Combo system + milestone celebrations
//   📚 Educational vet fact shown on game-over (per obstacle hit)
//   🐤 Player squash/stretch animation (jump compress / land bounce)
//   💥 Collision particle burst (red poof) + jump dust kick
//   📱 Mobile-responsive canvas (scales to viewport, internal coords stable)
//   📳 Haptic feedback on mobile tap (navigator.vibrate)
//   🌙 Dark-mode adaptive colors (reads --clr-* CSS vars)
//   ⚡ True RAF pause on hidden tab (was: spinning at 60fps with no work)
//   🛡️ Stability: error guard around game loop · throttled resize
//   🌅 Stage progression: Stage 1 (ground only) → 2 (+air) → 3 (faster) → 4 (max speed)
//
// Why all the game state is in refs instead of React state:
// the render loop runs at 60fps; if every velocity tweak triggered a
// re-render the framerate would tank. React state is only used for
// the UI panel (high-score banner, fact-popup) which doesn't refresh
// every frame.
// ──────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';

// ── Tuning constants ─────────────────────────────────────────────
const CANVAS_W = 600;
const CANVAS_H = 200;
const GROUND_Y = 160;
const PLAYER_SIZE = 30;
const GRAVITY = 0.6;
const JUMP_V = -11;
const DUCK_HEIGHT = 18;
const HITBOX_X = 24;          // a touch tighter than v1's 26 (more forgiving when ducking)
const PICKUP_HITBOX_X = 28;   // generous — collecting should feel easy
const SHIELD_DURATION = 240;  // ~4 sec at 60fps
const COMBO_TIMEOUT = 180;    // ~3 sec without a dodge resets combo
const HIGH_SCORE_KEY = 'vmx-game-highscore';
const BEST_COMBO_KEY = 'vmx-game-best-combo';

// Spawn weights — sum doesn't need to be 1, normalized at draw
const SPAWN_OBSTACLE_GROUND = 0.78;
const SPAWN_OBSTACLE_AIR    = 0.10; // unlocked at stage 2
const SPAWN_PICKUP_CORN     = 0.09;
const SPAWN_PICKUP_SHIELD   = 0.03;

const GROUND_OBSTACLES = ['🦠', '💩', '🟡'];
const AIR_OBSTACLES    = ['🪰'];

// Vet facts — shown on game-over to turn defeat into a teachable moment
const VET_FACTS = {
  '🦠': 'Salmonella Pullorum: pullorum disease ในลูกไก่, vertical transmission ผ่านไข่, white diarrhea + ตายเฉียบพลัน',
  '💩': 'Vent pasting: พบลูกไก่ <2 wk, ป้องกันโดยจัดการ brooder ให้อุ่น+แห้ง, ปล่อยไว้นาน → dehydration',
  '🟡': 'Aflatoxin จากอาหารขึ้นรา → liver necrosis + ลด egg production, EU MRL = 20 ppb ใน feed',
  '🪰': 'แมลงวัน = พาหะ Fowl cholera (Pasteurella) + Salmonella, จัดการขยะ + รักษาสะอาด = key control',
};

// ── Helper: read CSS var with fallback (for dark-mode-aware colors) ─
function cssVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return (v || fallback).trim();
}

export default function OfflineGame({ onClose }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const stateRef = useRef(makeFreshState());
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const [comboDisplay, setComboDisplay] = useState(0);
  const [stageDisplay, setStageDisplay] = useState(1);
  const [factText, setFactText] = useState(null); // { fact, obstacle } or null
  const [highScore, setHighScore] = useState(() => {
    try { return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0); } catch { return 0; }
  });
  const [bestCombo, setBestCombo] = useState(() => {
    try { return Number(localStorage.getItem(BEST_COMBO_KEY) || 0); } catch { return 0; }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── Hi-DPI + responsive scaling ────────────────────────────────
    // Canvas keeps internal CANVAS_W × CANVAS_H coordinates so all
    // game logic is resolution-independent. CSS scales the visible
    // size to fit container (max 600px). Mobile portrait → ~340px,
    // desktop → 600px. Internal hit-tests stay accurate.
    const applyScale = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = CANVAS_W * dpr;
      canvas.height = CANVAS_H * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    applyScale();

    let rafId = null;
    let alive = true;

    // ── Lifecycle ──────────────────────────────────────────────────
    const reset = () => {
      stateRef.current = makeFreshState();
      stateRef.current.state = 'playing';
      setGameState('playing');
      setScoreDisplay(0);
      setComboDisplay(0);
      setStageDisplay(1);
      setFactText(null);
    };

    const jump = () => {
      const p = stateRef.current.player;
      if (!p.jumping) {
        p.vy = JUMP_V;
        p.jumping = true;
        p.ducking = false;
        p.squash = -6; // stretch on jump
        spawnDustParticles(p.x + 6, p.y + PLAYER_SIZE - 2);
        haptic(8);
      }
    };

    const setDuck = (ducking) => {
      const p = stateRef.current.player;
      if (!p.jumping) p.ducking = ducking;
    };

    const gameOver = (hitObstacle) => {
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
        const prevCombo = Number(localStorage.getItem(BEST_COMBO_KEY) || 0);
        if (s.bestCombo > prevCombo) {
          localStorage.setItem(BEST_COMBO_KEY, String(s.bestCombo));
          setBestCombo(s.bestCombo);
        }
      } catch {}
      // Educational fact based on what you hit
      if (hitObstacle && VET_FACTS[hitObstacle]) {
        setFactText({ fact: VET_FACTS[hitObstacle], obstacle: hitObstacle });
      }
      // Burst red particles on player
      spawnHitParticles(s.player.x + PLAYER_SIZE / 2, s.player.y + PLAYER_SIZE / 2);
      haptic([30, 40, 30]);
    };

    const trigger = () => {
      const s = stateRef.current;
      if (s.state === 'ready' || s.state === 'gameover') reset();
      else jump();
    };

    // ── Particles (cheap visual flair) ─────────────────────────────
    const spawnDustParticles = (x, y) => {
      for (let i = 0; i < 4; i++) {
        stateRef.current.particles.push({
          x, y,
          vx: -1 - Math.random() * 1.5,
          vy: -0.5 - Math.random() * 0.6,
          life: 18,
          size: 2 + Math.random() * 2,
          color: '#c4b694',
        });
      }
    };
    const spawnHitParticles = (x, y) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        stateRef.current.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 30,
          size: 2.5 + Math.random() * 2.5,
          color: '#c26d6d',
        });
      }
    };
    const spawnSparkle = (x, y) => {
      for (let i = 0; i < 6; i++) {
        stateRef.current.particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -0.5 - Math.random(),
          life: 24,
          size: 2.5,
          color: '#b88940',
        });
      }
    };

    // ── Haptic (mobile only) ───────────────────────────────────────
    const haptic = (ms) => {
      try { navigator.vibrate?.(ms); } catch {}
    };

    // ── Input ──────────────────────────────────────────────────────
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
      // Tap upper half = jump (default), lower half on mobile = duck-tap
      // Keep simple for now: any tap triggers jump
      trigger();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    if (supportsPointer) {
      canvas.addEventListener('pointerdown', onPointer);
    } else {
      canvas.addEventListener('touchstart', onPointer, { passive: false });
    }

    // ── True RAF pause on hidden tab (no spin loop) ────────────────
    const startLoop = () => {
      if (rafId == null) rafId = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else if (alive) startLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // ── Throttled resize observer ──────────────────────────────────
    let resizeTimer = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyScale, 80);
    });
    ro.observe(canvas);

    // ── Main loop ──────────────────────────────────────────────────
    const loop = () => {
      if (!alive) { rafId = null; return; }
      rafId = null;
      try {
        const s = stateRef.current;

        // ── update ──
        if (s.state === 'playing') {
          // Player physics
          const p = s.player;
          p.vy += GRAVITY;
          p.y += p.vy;
          if (p.y >= GROUND_Y) {
            const wasJumping = p.jumping;
            p.y = GROUND_Y;
            p.vy = 0;
            p.jumping = false;
            if (wasJumping) p.squash = 4; // squash on land
          }
          // Decay squash toward 0
          if (p.squash !== 0) p.squash *= 0.7;
          if (Math.abs(p.squash) < 0.1) p.squash = 0;

          // Shield decay
          if (p.shieldTimer > 0) {
            p.shieldTimer--;
            if (p.shieldTimer === 0) p.shield = false;
          }

          // Spawn obstacles + pickups
          s.spawnTimer++;
          if (s.spawnTimer >= s.nextSpawn) {
            s.spawnTimer = 0;
            s.nextSpawn = Math.max(40, 70 + Math.floor(Math.random() * 80) - s.stage * 3);
            spawnEntity(s);
          }

          // Move + cull
          s.obstacles = s.obstacles.filter((o) => {
            o.x -= s.speed;
            if (!o.passed && o.x < p.x - 20) {
              // Player passed without hit — combo++
              o.passed = true;
              s.combo++;
              s.comboTimer = COMBO_TIMEOUT;
              if (s.combo > s.bestCombo) s.bestCombo = s.combo;
              if (s.combo % 5 === 0) {
                spawnSparkle(p.x + PLAYER_SIZE, p.y);
              }
            }
            return o.x > -40;
          });
          s.pickups = s.pickups.filter((pk) => {
            pk.x -= s.speed;
            return pk.x > -40;
          });
          s.particles = s.particles.filter((pt) => {
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += 0.15;
            pt.life--;
            return pt.life > 0;
          });
          s.clouds = s.clouds.map((c) => {
            c.x -= s.speed * 0.15; // slow parallax
            if (c.x < -60) { c.x = CANVAS_W + 60; c.y = 30 + Math.random() * 60; c.scale = 0.7 + Math.random() * 0.5; }
            return c;
          });

          // Combo timeout
          if (s.combo > 0) {
            s.comboTimer--;
            if (s.comboTimer <= 0) s.combo = 0;
          }

          // Score multiplier from combo
          const mult = s.combo >= 20 ? 3 : s.combo >= 10 ? 2 : s.combo >= 5 ? 1.5 : 1;
          s.score += 0.1 * mult;

          // Collisions — obstacles
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
              if (p.shield) {
                // Shield absorbs — destroy obstacle, mini sparkle, no game-over
                spawnSparkle(o.x, o.y);
                o.x = -100; // mark for cull
                p.shield = false;
                p.shieldTimer = 0;
                haptic(20);
              } else {
                gameOver(o.type);
                break;
              }
            }
          }
          // Collisions — pickups
          for (const pk of s.pickups) {
            const overlapX = Math.abs(px - pk.x) < PICKUP_HITBOX_X;
            const overlapY = pyBot > pk.y && pyTop < pk.y + 26;
            if (overlapX && overlapY) {
              if (pk.type === '💉') {
                p.shield = true;
                p.shieldTimer = SHIELD_DURATION;
                spawnSparkle(p.x + PLAYER_SIZE / 2, p.y);
              } else if (pk.type === '🌽') {
                s.score += 50;
                spawnSparkle(pk.x, pk.y);
              }
              pk.x = -100; // mark
              haptic(15);
            }
          }
          s.pickups = s.pickups.filter((pk) => pk.x > -40);

          // Stage progression — every 500 score advances stage
          const newStage = Math.floor(s.score / 500) + 1;
          if (newStage !== s.stage) {
            s.stage = newStage;
            setStageDisplay(newStage);
            // Stage celebration: brief sparkle burst
            for (let i = 0; i < 3; i++) spawnSparkle(CANVAS_W / 2, CANVAS_H / 2);
            // Speed bump per stage
            s.speed = Math.min(5 + (newStage - 1) * 0.8, 12);
          }

          // Push integer score to React state only on change (not every frame)
          const newScore = Math.floor(s.score);
          if (newScore !== s.lastDisplayedScore) {
            s.lastDisplayedScore = newScore;
            setScoreDisplay(newScore);
          }
          if (s.combo !== s.lastDisplayedCombo) {
            s.lastDisplayedCombo = s.combo;
            setComboDisplay(s.combo);
          }

          s.frame++;
        } else {
          // Animate clouds + particles even when not playing (subtle life)
          s.clouds = s.clouds.map((c) => {
            c.x -= 0.4;
            if (c.x < -60) { c.x = CANVAS_W + 60; c.y = 30 + Math.random() * 60; c.scale = 0.7 + Math.random() * 0.5; }
            return c;
          });
          s.particles = s.particles.filter((pt) => {
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += 0.15;
            pt.life--;
            return pt.life > 0;
          });
          s.frame++;
        }

        // ── render ──
        render(ctx, s);
      } catch (err) {
        // Don't kill the loop on a single bad frame — log + continue
        // (e.g. CSS var read failure during theme switch)
        // eslint-disable-next-line no-console
        console.warn('[OfflineGame] frame error', err);
      }
      if (alive && !document.hidden) {
        rafId = requestAnimationFrame(loop);
      }
    };
    startLoop();

    return () => {
      alive = false;
      stopLoop();
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibility);
      if (supportsPointer) {
        canvas.removeEventListener('pointerdown', onPointer);
      } else {
        canvas.removeEventListener('touchstart', onPointer);
      }
      ro.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: 16,
      }}
    >
      {/* HUD bar — score + stage + combo + best */}
      <div
        style={{
          width: '100%',
          maxWidth: CANVAS_W,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          fontFamily: 'var(--vmx-mono)',
          color: 'var(--clr-ink-soft, #7a6f5e)',
          letterSpacing: '0.04em',
        }}
      >
        <span>SCORE <strong style={{ color: 'var(--clr-ink, #2b2419)', fontSize: 14 }}>{String(scoreDisplay).padStart(5, '0')}</strong></span>
        <span>HI <strong style={{ color: 'var(--clr-gold, #b88940)' }}>{String(highScore).padStart(5, '0')}</strong></span>
        <span>STAGE <strong style={{ color: 'var(--clr-ocean, #3d6b82)' }}>{stageDisplay}</strong></span>
        {comboDisplay >= 5 && (
          <span className="vmx-pop-in" key={comboDisplay} style={{ color: '#d97744' }}>
            COMBO ×{comboDisplay >= 20 ? 3 : comboDisplay >= 10 ? 2 : comboDisplay >= 5 ? 1.5 : 1}
          </span>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: CANVAS_W,
          aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
          background: 'linear-gradient(180deg, var(--clr-bg, #f6efe4) 0%, var(--clr-surface-2, #f0e6d2) 100%)',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          touchAction: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          border: '1px solid var(--clr-border, #d8c9a8)',
        }}
        aria-label="Mini-game canvas"
      />

      <div style={{ fontSize: 12, color: 'var(--clr-ink-soft, #7a6f5e)', textAlign: 'center', lineHeight: 1.5 }}>
        🐤 ลูกไก่หนีเชื้อโรค, ↑/Space = กระโดด, ↓ = หมอบ, เก็บ 💉 = โล่, 🌽 = +50, Esc = ปิด
      </div>

      {/* Educational fact popup on game-over */}
      {gameState === 'gameover' && factText && (
        <div
          className="vmx-fade-in-up"
          style={{
            width: '100%',
            maxWidth: CANVAS_W,
            padding: '12px 14px',
            borderRadius: 12,
            background: 'var(--clr-surface, #fdf8ef)',
            border: '1px solid var(--clr-gold, #b88940)',
            borderLeft: '4px solid var(--clr-gold, #b88940)',
            fontSize: 13,
            lineHeight: 1.55,
            color: 'var(--clr-ink, #2b2419)',
          }}
        >
          <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-gold, #b88940)', marginBottom: 6, letterSpacing: '0.08em' }}>
            รู้จัก {factText.obstacle} ไหม?
          </div>
          {factText.fact}
        </div>
      )}

      {/* High score celebration */}
      {gameState === 'gameover' && scoreDisplay > 0 && scoreDisplay >= highScore && scoreDisplay > 0 && (
        <div
          className="vmx-pop-in"
          style={{
            background: 'rgba(184, 137, 64, 0.12)',
            color: 'var(--clr-gold, #b88940)',
            padding: '8px 16px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 700,
            border: '1px solid var(--clr-gold, #b88940)',
          }}
        >
          🎉 New High Score! {bestCombo > 0 && <span style={{ fontWeight: 400, color: 'var(--clr-ink-soft)' }}>, best combo {bestCombo}×</span>}
        </div>
      )}
    </div>
  );
}

// ── Helpers (defined outside component to avoid recreation per render) ──

function makeFreshState() {
  return {
    player: {
      x: 60,
      y: GROUND_Y,
      vy: 0,
      jumping: false,
      ducking: false,
      squash: 0,        // -ve = stretched (jumping), +ve = squashed (landing)
      shield: false,
      shieldTimer: 0,
    },
    obstacles: [],
    pickups: [],
    particles: [],
    clouds: [
      { x: 100, y: 40, scale: 1.0 },
      { x: 280, y: 60, scale: 0.8 },
      { x: 460, y: 30, scale: 1.2 },
    ],
    speed: 5,
    score: 0,
    combo: 0,
    comboTimer: 0,
    bestCombo: 0,
    stage: 1,
    nextSpawn: 80,
    spawnTimer: 0,
    frame: 0,
    state: 'ready',
    lastDisplayedScore: 0,
    lastDisplayedCombo: 0,
  };
}

function spawnEntity(s) {
  const r = Math.random();
  // Decide ground/air/pickup
  const airAvailable = s.stage >= 2;
  const cumGround = SPAWN_OBSTACLE_GROUND;
  const cumAir = cumGround + (airAvailable ? SPAWN_OBSTACLE_AIR : 0);
  const cumCorn = cumAir + SPAWN_PICKUP_CORN;
  const cumShield = cumCorn + SPAWN_PICKUP_SHIELD;
  const total = cumShield;

  const pick = r * total;
  if (pick < cumGround) {
    const type = GROUND_OBSTACLES[Math.floor(Math.random() * GROUND_OBSTACLES.length)];
    s.obstacles.push({ x: CANVAS_W + 20, y: GROUND_Y + 4, type, air: false, passed: false });
  } else if (pick < cumAir) {
    const type = AIR_OBSTACLES[Math.floor(Math.random() * AIR_OBSTACLES.length)];
    s.obstacles.push({ x: CANVAS_W + 20, y: GROUND_Y - 32, type, air: true, passed: false });
  } else if (pick < cumCorn) {
    s.pickups.push({ x: CANVAS_W + 20, y: GROUND_Y - 4, type: '🌽' });
  } else {
    // Shield — spawn at jump-height so player has to commit to grab it
    s.pickups.push({ x: CANVAS_W + 20, y: GROUND_Y - 24, type: '💉' });
  }
}

function render(ctx, s) {
  const inkSoft = cssVar('--clr-ink-soft', '#7a6f5e');
  const ink = cssVar('--clr-ink', '#2b2419');
  const gold = cssVar('--clr-gold', '#b88940');
  const groundLine = cssVar('--clr-border', '#8a7a5c');
  const dashLine = cssVar('--clr-surface-2', '#c4b694');

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // ── Sun (top-right, soft) ────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.arc(CANVAS_W - 60, 36, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── Clouds (parallax background) ─────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#ffffff';
  for (const c of s.clouds) {
    const cx = c.x;
    const cy = c.y;
    const r = 12 * c.scale;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.9, cy + 2, r * 0.85, 0, Math.PI * 2);
    ctx.arc(cx + r * 1.7, cy, r * 0.95, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.5, cy - 4, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ── Ground line ──────────────────────────────────────────────────
  ctx.strokeStyle = groundLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + PLAYER_SIZE);
  ctx.lineTo(CANVAS_W, GROUND_Y + PLAYER_SIZE);
  ctx.stroke();

  // ── Animated ground dashes (parallax foreground) ─────────────────
  ctx.strokeStyle = dashLine;
  ctx.lineWidth = 1;
  ctx.setLineDash([10, 14]);
  ctx.lineDashOffset = -((s.frame * s.speed) % 24);
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + PLAYER_SIZE + 8);
  ctx.lineTo(CANVAS_W, GROUND_Y + PLAYER_SIZE + 8);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Particles (back layer) ───────────────────────────────────────
  for (const pt of s.particles) {
    const a = Math.max(0, pt.life / 30);
    ctx.globalAlpha = a;
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ── Pickups ──────────────────────────────────────────────────────
  ctx.font = '22px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
  for (const pk of s.pickups) {
    // Soft glow ring
    ctx.save();
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(s.frame * 0.15);
    ctx.fillStyle = pk.type === '💉' ? gold : '#d4a556';
    ctx.beginPath();
    ctx.arc(pk.x + 10, pk.y + 14, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillText(pk.type, pk.x, pk.y + PLAYER_SIZE - 4);
  }

  // ── Obstacles ────────────────────────────────────────────────────
  ctx.font = '24px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
  for (const o of s.obstacles) {
    ctx.fillText(o.type, o.x, o.y + PLAYER_SIZE);
  }

  // ── Player (with squash/stretch + shield ring + horizontal flip) ─
  const p = s.player;
  if (p.shield) {
    // Shield ring — pulses
    ctx.save();
    ctx.globalAlpha = 0.4 + 0.3 * Math.sin(s.frame * 0.25);
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(p.x + PLAYER_SIZE / 2, p.y + PLAYER_SIZE / 2 + 4, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  // Squash transform: -ve squash = stretched (taller, thinner), +ve = squashed (shorter, wider)
  // Horizontal flip: 🐤 emoji faces LEFT/forward by default, but obstacles
  // come from the RIGHT, so we mirror the chick to face into the run.
  const squash = p.squash;
  const fontSize = (p.ducking ? 24 : 30) - squash * 0.5;
  const yOffset = p.ducking ? 4 : 0;
  ctx.save();
  ctx.font = `${fontSize}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;
  ctx.translate(p.x + PLAYER_SIZE, p.y + PLAYER_SIZE - yOffset + (squash > 0 ? squash * 0.5 : 0));
  ctx.scale(-1, 1); // flip horizontal so chick faces right (forward)
  ctx.fillText('🐤', 0, 0);
  ctx.restore();

  // ── Overlays ─────────────────────────────────────────────────────
  if (s.state === 'ready') {
    ctx.fillStyle = ink;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    // Pulse the prompt
    const pulse = 0.85 + 0.15 * Math.sin(s.frame * 0.08);
    ctx.globalAlpha = pulse;
    ctx.fillText('แตะ / กด Space เพื่อเริ่ม', CANVAS_W / 2, CANVAS_H / 2 - 10);
    ctx.globalAlpha = 1;
    ctx.font = '12px sans-serif';
    ctx.fillStyle = inkSoft;
    ctx.fillText('🐤 ลูกไก่หนีเชื้อโรค, ↑ กระโดด, ↓ หมอบ, 💉 = โล่, 🌽 = +50', CANVAS_W / 2, CANVAS_H / 2 + 12);
    ctx.textAlign = 'left';
  } else if (s.state === 'gameover') {
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.fillRect(CANVAS_W / 2 - 130, CANVAS_H / 2 - 36, 260, 56);
    ctx.fillStyle = '#a73d3d';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('G A M E   O V E R', CANVAS_W / 2, CANVAS_H / 2 - 10);
    ctx.fillStyle = ink;
    ctx.font = '12px sans-serif';
    ctx.fillText('แตะเพื่อเล่นอีกครั้ง', CANVAS_W / 2, CANVAS_H / 2 + 10);
    ctx.textAlign = 'left';
  }
}
