// ============================================================
// ocean — the living background of ai.vetmock.com
// ============================================================
// createOcean(canvas) draws a sea made entirely of glyph tiles and keeps it
// alive: animals swim, light ripples where you type, the school mills while
// the answer is being looked up, and the whole scene steps aside behind the
// words you read. React never re-renders for any of it: the page hands the
// ocean a few rectangles and a mode, and the ocean writes to its canvas (and
// to one label element) directly.
//
// Budget: a 432 x 270 scene target and a 144 x 90 cell grid at 1440 px, so the
// GPU work is a few tiny passes plus one per-pixel composite; the JS frame
// (simulation + mesh) measured well under 2 ms on a laptop. A quality ladder
// steps down (pixel ratio, cell size, 30 fps, still) when frames run long.
// ============================================================

import { createGL, program, texture, target, dropTarget, attrib } from './gl.js';
import { buildAtlas } from './atlas.js';
import { Mesh, Swimmer, School, population, FLOATS } from './creatures.js';
import * as SH from './shaders.js';
import { oklch, lerp, clamp, rng, smooth } from './math.js';

const THEMES = {
  dark: {
    bg: oklch(0.15, 0.036, 248),
    water: oklch(0.7, 0.09, 205),
    fog: oklch(0.17, 0.042, 246),
    sigma: [2.1, 0.85, 0.5], // red goes first, then green: the deep turns blue
    hi: oklch(0.94, 0.012, 230),
    caus: 0.9,
    glow: 0.95,
    snow: oklch(0.6, 0.04, 220),
    spark: oklch(0.88, 0.13, 195),
  },
  light: {
    bg: oklch(0.977, 0.008, 85),
    water: oklch(0.78, 0.06, 205),
    fog: oklch(0.977, 0.008, 85),
    sigma: [0.9, 0.9, 0.9], // a printed plate: depth only fades toward the paper
    hi: oklch(0.985, 0.006, 85),
    caus: 0.7,
    glow: 0,
    snow: oklch(0.82, 0.03, 230),
    spark: oklch(0.5, 0.17, 255),
  },
};

const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Cell size by viewport width: 7 px at 375, 9.5 px at 1440 (linear, clamped),
 *  so a phone keeps ~54 columns and a laptop ~150: enough tiles to read an animal. */
const cellFor = (w) => clamp(7 + ((w - 375) * 2.5) / 1065, 7, 9.5);

export async function createOcean(canvas, opts = {}) {
  const gl = createGL(canvas, !!opts.allowSoftware);
  if (!gl) throw new Error('webgl-unavailable');

  const family = '"Geist Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  if (document.fonts?.load) {
    await Promise.race([document.fonts.load(`500 12px "Geist Mono"`), new Promise((r) => setTimeout(r, 1500))]).catch(() => {});
  }

  const reduced = !!opts.reducedMotion;
  const manual = !!opts.manual;
  const rand = rng(opts.seed ?? Math.floor(Math.random() * 1e9));

  let progs;
  let quadBuf;
  let bodyBuf;
  let pointBuf;
  let atlasTex = null;
  let atlas = null;
  let sceneT = null;
  let cellT = null;
  let glowT = null;
  const mesh = new Mesh(9000);
  const POINTS = 420;
  const points = new Float32Array(POINTS * 7);

  // sizes
  let W = 0;
  let H = 0;
  let dpr = 1;
  let cellCss = 10;
  let cellPx = 10;
  let cols = 0;
  let rows = 0;
  let gridW = 0;
  let gridH = 0;
  let atlasKey = '';

  // state
  const env = {
    W: 0, H: 0, short: 1, t: 0, pace: 1, avoid: 0,
    pointer: { x: -1e4, y: -1e4, active: false },
    focus: null, content: null, mill: null, millSchool: null, schoolPull: null,
  };
  let theme = opts.theme === 'light' ? 1 : 0;
  let themeTarget = theme;
  let fade = reduced ? 1 : 0;
  let veilAmt = 0;
  let veilTarget = 0;
  let veilRect = null;
  let mode = 'idle';
  let swimmers = [];
  let school = null;
  let snow = [];
  let sparks = [];
  const ripples = [];
  let raf = 0;
  let last = 0;
  let running = false;
  let lost = false;
  let tracked = null;
  let qualityLevel = 0;
  let ema = 1 / 60;
  let slowFor = 0;
  let fastFor = 0;
  let skip = false;
  let warm = 0;

  function initGL() {
    progs = {
      water: program(gl, SH.QUAD_VS, SH.WATER_FS),
      body: program(gl, SH.BODY_VS, SH.BODY_FS),
      point: program(gl, SH.POINT_VS, SH.POINT_FS),
      cell: program(gl, SH.QUAD_VS, SH.CELL_FS),
      glow: program(gl, SH.QUAD_VS, SH.GLOW_FS),
      comp: program(gl, SH.QUAD_VS, SH.COMPOSITE_FS),
    };
    quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    bodyBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bodyBuf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.data.byteLength, gl.DYNAMIC_DRAW);
    pointBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    gl.bufferData(gl.ARRAY_BUFFER, points.byteLength, gl.DYNAMIC_DRAW);
    atlasKey = '';
    sceneT = cellT = glowT = null;
    atlasTex = null;
  }

  function dprCap() {
    return [2, 1.5, 1, 1, 1][qualityLevel];
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width || window.innerWidth));
    H = Math.max(1, Math.round(rect.height || window.innerHeight));
    dpr = Math.min(window.devicePixelRatio || 1, dprCap());
    cellCss = (opts.cell || cellFor(W)) + (qualityLevel >= 2 ? 2 : 0);
    cellPx = Math.max(6, Math.round(cellCss * dpr));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    cols = Math.ceil(canvas.width / cellPx);
    rows = Math.ceil(canvas.height / cellPx);
    gridW = (cols * cellPx) / dpr;
    gridH = (rows * cellPx) / dpr;
    const prev = { W: env.W, H: env.H, short: env.short };
    env.W = W;
    env.H = H;
    env.short = Math.min(W, H);
    // a pane can report 0 x 0 before it is shown: only populate a real viewport
    const fresh = !swimmers.length && W > 120 && H > 120;
    if (!fresh && swimmers.length && prev.W > 0) rescale(prev);
    dropTarget(gl, sceneT);
    dropTarget(gl, cellT);
    dropTarget(gl, glowT);
    sceneT = target(gl, cols * 3, rows * 3, gl.NEAREST);
    cellT = target(gl, cols, rows, gl.NEAREST);
    glowT = target(gl, cols, rows, gl.LINEAR);
    const key = `${cellPx}`;
    if (key !== atlasKey) {
      atlas = buildAtlas(cellPx, family);
      if (atlasTex) gl.deleteTexture(atlasTex);
      atlasTex = texture(gl, 0, 0, gl.NEAREST, atlas.canvas);
      atlasKey = key;
    }
    if (fresh) populate();
    if (!running || reduced) renderOnce();
  }

  /** Keep the same animals through a resize: positions follow the viewport,
   *  sizes follow its short side (a phone turned sideways keeps its sea). */
  function rescale(prev) {
    const sx = W / prev.W;
    const sy = H / prev.H;
    const k = env.short / prev.short;
    if (Math.abs(sx - 1) < 1e-3 && Math.abs(sy - 1) < 1e-3) return;
    for (const s of swimmers) {
      s.x *= sx;
      s.y *= sy;
      s.L *= k;
      s.cruise *= k;
      s.speed *= k;
      s.seg *= k;
      for (let i = 0; i < s.N; i++) { s.jx[i] *= sx; s.jy[i] *= sy; }
    }
    if (school) {
      school.l *= k;
      for (let i = 0; i < school.n; i++) { school.x[i] *= sx; school.y[i] *= sy; }
    }
    for (const m of snow) { m.x *= sx; m.y *= sy; }
  }

  function populate() {
    const pop = population(env);
    swimmers = pop.list.map((k) => new Swimmer(k, rand, env, false));
    swimmers.sort((a, b) => b.z - a.z); // far first
    school = new School(pop.school, rand, env);
    const n = clamp(Math.round((W * H) / 6500), 60, 320);
    snow = Array.from({ length: n }, () => ({ x: rand() * W, y: rand() * H, z: rand(), ph: rand() * 6.28 }));
  }

  // ── simulation ────────────────────────────────────────────
  function update(dt) {
    env.t += dt;
    themeTarget !== theme && (theme += (themeTarget - theme) * smooth(dt, 0.16));
    if (Math.abs(themeTarget - theme) < 0.002) theme = themeTarget;
    fade += (1 - fade) * smooth(dt, 0.45);
    veilAmt += (veilTarget - veilAmt) * smooth(dt, 0.25);

    if (!school) return;
    env.pace = mode === 'thinking' ? 1.15 : mode === 'answering' ? 0.85 : 1;
    env.avoid = veilTarget > 0 ? 1 : 0.25;
    for (const s of swimmers) s.update(dt, env);
    const predators = [];
    for (const s of swimmers) if (s.spec.body === 'fish' && s.key !== 'dugong') predators.push({ x: s.x, y: s.y, r: s.L * 0.55 });
    if (env.pointer.active) predators.push({ x: env.pointer.x, y: env.pointer.y, r: 110 });
    for (const r of ripples) if (env.t - r.t0 < 0.4 && r.kind === 0) predators.push({ x: r.x, y: r.y, r: 70 });
    school.update(dt, env, predators);

    // marine snow drifts with a slow current; nearer motes move faster (parallax)
    const cx = 7;
    const cy = 3;
    for (const m of snow) {
      const k = 0.4 + 0.6 * (1 - m.z);
      m.x += (cx + Math.sin(env.t * 0.3 + m.ph) * 4) * k * dt;
      m.y += cy * k * dt;
      if (m.x > W + 4) m.x -= W + 8;
      if (m.y > H + 4) m.y -= H + 8;
    }
    for (const s of sparks) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vx *= Math.exp(-dt / 0.9);
      s.vy *= Math.exp(-dt / 0.9);
      s.life -= dt;
    }
    sparks = sparks.filter((s) => s.life > 0);
    while (ripples.length && env.t - ripples[0].t0 > 3.2) ripples.shift();

    if (tracked) {
      const c = tracked.creature;
      const el = tracked.el;
      tracked.left -= dt;
      if (tracked.left <= 0 || !el.isConnected) {
        el.dataset.on = '0';
        tracked = null;
      } else {
        el.style.transform = `translate3d(${Math.round(c.x)}px, ${Math.round(c.y)}px, 0)`;
      }
    }
  }

  // ── rendering ─────────────────────────────────────────────
  function bindQuad(p) {
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    attrib(gl, p.attr('a_pos'), 2, 2, 0);
  }

  function render() {
    if (lost || !sceneT) return;
    const th = {};
    for (const k of Object.keys(THEMES.dark)) {
      const a = THEMES.dark[k];
      const b = THEMES.light[k];
      th[k] = Array.isArray(a) ? mix3(a, b, theme) : lerp(a, b, theme);
    }
    // 1. scene
    gl.bindFramebuffer(gl.FRAMEBUFFER, sceneT.fb);
    gl.viewport(0, 0, sceneT.w, sceneT.h);
    gl.disable(gl.BLEND);
    let p = progs.water;
    gl.useProgram(p.prog);
    bindQuad(p);
    gl.uniform2f(p.uni('u_grid'), gridW, gridH);
    gl.uniform1f(p.uni('u_time'), env.t);
    gl.uniform1f(p.uni('u_caus'), th.caus);
    const rip = new Float32Array(32);
    for (let i = 0; i < 8; i++) {
      const r = ripples[ripples.length - 1 - i];
      if (r && !reduced) rip.set([r.x, r.y, env.t - r.t0, r.kind], i * 4);
      else rip.set([0, 0, -1, 0], i * 4);
    }
    gl.uniform4fv(p.uni('u_rip'), rip);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    mesh.reset(gridW, gridH);
    // far to near; the school swims at its own depth among the others
    let schoolDone = !school;
    for (const s of swimmers) {
      if (!schoolDone && s.z < school.z) { school.write(mesh, theme, -0.6); schoolDone = true; }
      s.write(mesh, theme);
    }
    if (!schoolDone) school.write(mesh, theme, -0.6);
    p = progs.body;
    gl.useProgram(p.prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, bodyBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, mesh.data.subarray(0, mesh.n * FLOATS));
    attrib(gl, p.attr('a_pos'), 2, FLOATS, 0);
    attrib(gl, p.attr('a_uv'), 2, FLOATS, 2);
    attrib(gl, p.attr('a_col'), 3, FLOATS, 4);
    attrib(gl, p.attr('a_ext'), 4, FLOATS, 7);
    gl.uniform2f(p.uni('u_grid'), gridW, gridH);
    gl.uniform1f(p.uni('u_time'), env.t);
    gl.uniform1f(p.uni('u_caus'), th.caus);
    gl.uniform3fv(p.uni('u_fog'), th.fog);
    gl.uniform3fv(p.uni('u_sigma'), th.sigma);
    gl.uniform3fv(p.uni('u_hi'), th.hi);
    gl.uniform1f(p.uni('u_ink'), theme);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.n);
    gl.disableVertexAttribArray(p.attr('a_uv'));
    gl.disableVertexAttribArray(p.attr('a_col'));
    gl.disableVertexAttribArray(p.attr('a_ext'));

    // particles: motes and sparks, alpha 0.45 tags them as particles
    let n = 0;
    const put = (x, y, col, size) => {
      if (n >= POINTS) return;
      points.set([(x / gridW) * 2 - 1, 1 - (y / gridH) * 2, col[0], col[1], col[2], 0.45, size], n * 7);
      n++;
    };
    for (const m of snow) put(m.x, m.y, th.snow, 1);
    for (const s of sparks) put(s.x, s.y, th.spark, 1 + (s.life > 0.8 ? 1 : 0));
    if (n) {
      p = progs.point;
      gl.useProgram(p.prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, points.subarray(0, n * 7));
      attrib(gl, p.attr('a_pos'), 2, 7, 0);
      attrib(gl, p.attr('a_col'), 4, 7, 2);
      attrib(gl, p.attr('a_size'), 1, 7, 6);
      gl.drawArrays(gl.POINTS, 0, n);
      gl.disableVertexAttribArray(p.attr('a_col'));
      gl.disableVertexAttribArray(p.attr('a_size'));
    }

    // 2. cells
    const L = atlas.layout;
    gl.bindFramebuffer(gl.FRAMEBUFFER, cellT.fb);
    gl.viewport(0, 0, cols, rows);
    p = progs.cell;
    gl.useProgram(p.prog);
    bindQuad(p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneT.tex);
    gl.uniform1i(p.uni('u_scene'), 0);
    gl.uniform2f(p.uni('u_fbo'), sceneT.w, sceneT.h);
    gl.uniform1f(p.uni('u_K'), L.K);
    gl.uniform1f(p.uni('u_edge0'), L.edge0);
    gl.uniform1f(p.uni('u_water0'), L.water0);
    gl.uniform1f(p.uni('u_spark'), L.spark);
    gl.uniform1f(p.uni('u_ink'), theme);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 3. glow
    gl.bindFramebuffer(gl.FRAMEBUFFER, glowT.fb);
    p = progs.glow;
    gl.useProgram(p.prog);
    bindQuad(p);
    gl.bindTexture(gl.TEXTURE_2D, cellT.tex);
    gl.uniform1i(p.uni('u_cell'), 0);
    gl.uniform2f(p.uni('u_cells'), cols, rows);
    gl.uniform1f(p.uni('u_water0'), L.water0);
    gl.uniform1f(p.uni('u_spark'), L.spark);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 4. composite
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    p = progs.comp;
    gl.useProgram(p.prog);
    bindQuad(p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cellT.tex);
    gl.uniform1i(p.uni('u_cell'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, glowT.tex);
    gl.uniform1i(p.uni('u_glow'), 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, atlasTex);
    gl.uniform1i(p.uni('u_atlas'), 2);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform2f(p.uni('u_cells'), cols, rows);
    gl.uniform1f(p.uni('u_cellPx'), cellPx);
    gl.uniform2f(p.uni('u_canvas'), canvas.width, canvas.height);
    gl.uniform1f(p.uni('u_glyphs'), L.count);
    gl.uniform1f(p.uni('u_K'), L.K);
    gl.uniform1f(p.uni('u_water0'), L.water0);
    gl.uniform1f(p.uni('u_spark'), L.spark);
    gl.uniform3fv(p.uni('u_bgDark'), THEMES.dark.bg);
    gl.uniform3fv(p.uni('u_bgLight'), THEMES.light.bg);
    gl.uniform3fv(p.uni('u_waterDark'), THEMES.dark.water);
    gl.uniform3fv(p.uni('u_waterLight'), THEMES.light.water);
    gl.uniform1f(p.uni('u_ink'), theme);
    const v = veilRect || { x: -1e4, y: -1e4, w: 0, h: 0 };
    gl.uniform4f(p.uni('u_veil'), v.x * dpr, v.y * dpr, v.w * dpr, v.h * dpr);
    gl.uniform1f(p.uni('u_veilAmt'), veilAmt);
    gl.uniform1f(p.uni('u_veilR'), 28 * dpr);
    gl.uniform1f(p.uni('u_fade'), fade);
    gl.uniform1f(p.uni('u_topPx'), (opts.bare ? 0 : 60) * dpr);
    gl.uniform1f(p.uni('u_exposure'), opts.exposure || 1);
    gl.uniform1f(p.uni('u_glowAmt'), THEMES.dark.glow * (1 - theme));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function renderOnce() {
    if (lost) return;
    render();
  }

  // ── quality ladder ────────────────────────────────────────
  function observe(dt) {
    warm += dt;
    if (warm < 2.5) return; // shader compile, font and atlas work
    ema += (dt - ema) * smooth(dt, 1);
    if (ema > 1 / 38) { slowFor += dt; fastFor = 0; } else if (ema < 1 / 55) { fastFor += dt; slowFor = 0; }
    if (slowFor > 2 && qualityLevel < 4) {
      qualityLevel++;
      slowFor = 0;
      warm = 1.5;
      if (qualityLevel === 4) { stop(); renderOnce(); opts.onQuality?.(qualityLevel); return; }
      resize();
      opts.onQuality?.(qualityLevel);
    }
    if (fastFor > 12 && qualityLevel > 0 && qualityLevel < 3) {
      qualityLevel--;
      fastFor = 0;
      warm = 1.5;
      resize();
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    observe(dt);
    if (qualityLevel === 3) { skip = !skip; if (skip) return; }
    update(qualityLevel === 3 ? dt * 2 : dt);
    render();
  }

  function start() {
    if (running || reduced || manual || lost || qualityLevel === 4) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onVis = () => (document.hidden ? stop() : start());
  const onLost = (e) => { e.preventDefault(); lost = true; stop(); };
  const onRestored = () => {
    lost = false;
    initGL();
    resize();
    start();
  };
  document.addEventListener('visibilitychange', onVis);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  initGL();
  resize();
  if (reduced) {
    // a still composition: let the animals spread out, then draw one frame
    for (let i = 0; i < 180; i++) update(1 / 30);
    fade = 1;
    renderOnce();
  } else if (!manual) {
    start();
  }

  return {
    resize,
    start,
    stop,
    setTheme(t) {
      themeTarget = t === 'light' ? 1 : 0;
      if (reduced || !running) { theme = themeTarget; renderOnce(); }
    },
    setMode(m, at) {
      mode = m;
      env.mill = m === 'thinking' && at ? { x: at.x, y: at.y } : null;
      env.millSchool = (m === 'thinking' || m === 'listening') && at ? { x: at.x, y: at.y, r: env.short * 0.15 } : null;
      if (m === 'focus' && env.focus) {
        // the nearest big animal comes to look
        let best = null;
        let bd = Infinity;
        for (const s of swimmers) {
          if (s.spec.body === 'jelly') continue;
          const d = Math.hypot(s.x - (env.focus.x + env.focus.w / 2), s.y - env.focus.y);
          if (d < bd) { bd = d; best = s; }
        }
        if (best && !swimmers.some((s) => s.curious > 0)) { best.curious = 7 + rand() * 3; best.curiousSide = rand() < 0.5 ? 1 : -1; }
      }
    },
    setFocus(rect) { env.focus = rect; },
    setContent(rect, veil = 0) {
      env.content = rect;
      veilRect = rect;
      veilTarget = veil;
      if (reduced || !running) { veilAmt = veil; renderOnce(); }
    },
    pointer(x, y, active) {
      env.pointer.x = x;
      env.pointer.y = y;
      env.pointer.active = active;
    },
    ripple(x, y) {
      if (reduced) return;
      ripples.push({ x, y, t0: env.t, kind: 0 });
      if (ripples.length > 8) ripples.shift();
    },
    pulse(x, y) {
      if (reduced) return;
      ripples.push({ x, y, t0: env.t, kind: 1 });
      if (ripples.length > 8) ripples.shift();
      for (let i = 0; i < 12; i++) {
        const a = rand() * Math.PI * 2;
        const v = 40 + rand() * 70;
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1.2 + rand() * 0.8 });
      }
    },
    /** Tap: which animal is under (x, y)? Starts its escape and lets `el` follow it. */
    hit(x, y, el) {
      let best = null;
      let bd = 1;
      for (let i = swimmers.length - 1; i >= 0; i--) {
        const s = swimmers[i];
        const d = s.hit(x, y);
        if (d < bd) { bd = d; best = s; }
      }
      if (!best) return null;
      best.burst = Math.max(best.burst, 1.6);
      if (el) {
        tracked = { creature: best, el, left: 4.5 };
        el.dataset.on = '1';
        el.style.transform = `translate3d(${Math.round(best.x)}px, ${Math.round(best.y)}px, 0)`;
      }
      return { key: best.key, th: best.spec.th, sci: best.spec.sci };
    },
    /**
     * Stage a scene (link covers, film shots): animals at given places and
     * headings, a school laid on a ring. Lengths are in units of the short side.
     * @param {{ animals?: {key: string, x: number, y: number, heading: number, len?: number, z?: number}[],
     *           school?: {x: number, y: number, r: number, n?: number} }} spec  (x, y in 0..1 of W, H)
     */
    compose(spec) {
      if (spec.animals) {
        swimmers = spec.animals.map((a) => {
          const s = new Swimmer(a.key, rand, env, false);
          if (a.z !== undefined) { s.z = a.z; s.scale = 1 - 0.4 * a.z; }
          const L = (a.len ?? s.spec.lenK) * env.short * s.scale;
          const k = L / s.L;
          s.L = L;
          s.cruise *= k;
          s.speed = s.cruise;
          s.seg = s.L / (s.N - 1);
          s.x = a.x * W;
          s.y = a.y * H;
          s.theta = a.heading;
          s.home = a.heading;
          s.homeAt = env.t + 1e6; // hold the staged course
          const cx = Math.cos(a.heading);
          const cy = Math.sin(a.heading);
          for (let i = 0; i < s.N; i++) { s.jx[i] = s.x - cx * s.seg * i; s.jy[i] = s.y - cy * s.seg * i; }
          return s;
        });
        swimmers.sort((a, b) => b.z - a.z);
      }
      if (spec.school) {
        const sc = spec.school;
        school = new School(sc.n ?? school?.n ?? 64, rand, env);
        const cx = sc.x * W;
        const cy = sc.y * H;
        const R = sc.r * env.short;
        const v = school.spec.speedBL * school.l;
        for (let i = 0; i < school.n; i++) {
          const a = (i / school.n) * Math.PI * 2 + rand() * 0.2;
          const rr = R * (0.85 + rand() * 0.3);
          school.x[i] = cx + Math.cos(a) * rr;
          school.y[i] = cy + Math.sin(a) * rr;
          school.vx[i] = -Math.sin(a) * v;
          school.vy[i] = Math.cos(a) * v;
        }
        env.millSchool = { x: cx, y: cy, r: R };
        mode = 'thinking';
      }
      renderOnce();
    },
    /** Frame-exact capture: advance the clock by dt and draw (manual mode). */
    step(dt) {
      update(dt);
      render();
    },
    info: () => ({ cols, rows, cellPx, dpr, qualityLevel, swimmers: swimmers.length, school: school?.n || 0 }),
    destroy() {
      stop();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    },
  };
}
