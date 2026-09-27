// WebGL herd [M1-DESIGN.md 15.1]. Port of work/research-studio/design/engine.js: every dot in one
// gl.POINTS draw plus one ring draw; positions for the 3D cloud, the farm grid and a target layout
// are computed on the GPU and mixed by two uniforms, so a frame costs the CPU a handful of uniform
// writes whatever the scroll. The halo behind the hero text lives in the shader (a CSS gradient on a
// fading layer re-rasterises). Straight alpha blends with blendFuncSeparate (plain blendFunc applied
// alpha twice in the prototype). Additions for the methods chart and the entrance: a per-dot target
// size and a per-dot "used" flag (unused dots fade out as they arrive), and a target buffer that can
// be replaced when the page lays out again. Context loss is survived: the engine reports it, drops its
// GL objects and rebuilds on restore. OWNER: landing role.

const VS = `
attribute vec3 aScatter; attribute vec2 aFarm; attribute vec2 aGrid; attribute float aPos; attribute float aSeed;
attribute float aTargetSize; attribute float aUse;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uFold; uniform float uGrid; uniform float uReduce;
uniform vec2 uScatterOrigin; uniform vec2 uFarmOrigin; uniform vec2 uGridOrigin; uniform float uPointPx; uniform float uPosBoost;
uniform vec2 uHaloC; uniform vec2 uHaloR; uniform float uHaloK; uniform float uStagger;
varying float vPos; varying float vAlpha;
float ease(float x){ return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x + 2.0, 3.0) * 0.5; }
void main(){
  float moving = 1.0 - uReduce;
  float ang = uTime * 0.05 * moving;
  float c = cos(ang); float s = sin(ang);
  vec3 p = aScatter;
  p = vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z);
  p.y += sin(uTime*0.6 + aSeed*6.2831853) * 7.0 * moving;
  p.x += cos(uTime*0.45 + aSeed*12.566371) * 5.0 * moving;
  float persp = 1000.0 / (1000.0 + p.z);
  vec2 scatter = uScatterOrigin + p.xy * persp;
  float k = 1.0 + uStagger;
  float f = clamp(uFold * k - aSeed * uStagger, 0.0, 1.0);
  float g = clamp(uGrid * k - aSeed * uStagger, 0.0, 1.0);
  f = mix(ease(f), step(0.5, uFold), uReduce);
  g = mix(ease(g), step(0.5, uGrid), uReduce);
  vec2 pos = mix(mix(scatter, uFarmOrigin + aFarm, f), uGridOrigin + aGrid, g);
  float settled = max(f, g);
  float tsize = aTargetSize > 0.0 ? aTargetSize : uPointPx;
  float size = mix(mix(uPointPx * persp * 1.1, uPointPx, f), tsize, g) * (1.0 + uPosBoost * aPos);
  gl_Position = vec4(pos.x / (uRes.x * 0.5), -pos.y / (uRes.y * 0.5), 0.0, 1.0);
  gl_PointSize = max(1.0, size * uDpr);
  vPos = aPos;
  vAlpha = mix(clamp(0.35 + (persp - 0.75) * 1.6, 0.25, 1.0), 1.0, settled) * mix(1.0, aUse, g);
  vec2 hq = abs(pos - uHaloC) / uHaloR;
  float hd = pow(pow(hq.x, 4.0) + pow(hq.y, 4.0), 0.25);
  vAlpha *= mix(1.0, 0.15 + 0.85 * smoothstep(0.6, 1.1, hd), uHaloK);
}`;

const FS = `
precision mediump float;
uniform vec3 uColPos; uniform vec3 uColNeg; uniform float uDim; uniform float uPosMix;
varying float vPos; varying float vAlpha;
void main(){
  vec2 d = gl_PointCoord - vec2(0.5);
  float a = 1.0 - smoothstep(0.34, 0.5, length(d));
  if (a <= 0.0) discard;
  float k = vPos * uPosMix;
  gl_FragColor = vec4(mix(uColNeg, uColPos, k), a * vAlpha * uDim);
}`;

const RVS = `
attribute vec2 aCenter; uniform vec2 uRes; uniform vec2 uOrigin; uniform float uSize;
void main(){
  vec2 pos = uOrigin + aCenter;
  gl_Position = vec4(pos.x / (uRes.x * 0.5), -pos.y / (uRes.y * 0.5), 0.0, 1.0);
  gl_PointSize = uSize;
}`;

const RFS = `
precision mediump float;
uniform vec3 uCol; uniform float uAlpha; uniform float uEdge;
void main(){
  float r = length(gl_PointCoord - vec2(0.5));
  float a = (1.0 - smoothstep(0.5 - uEdge, 0.5, r)) * smoothstep(0.5 - 3.0 * uEdge, 0.5 - 2.0 * uEdge, r);
  if (a <= 0.0) discard;
  gl_FragColor = vec4(uCol, a * uAlpha);
}`;

const P_UNIFORMS = ['uRes', 'uDpr', 'uTime', 'uFold', 'uGrid', 'uReduce', 'uScatterOrigin', 'uFarmOrigin', 'uGridOrigin', 'uPointPx', 'uPosBoost', 'uColPos', 'uColNeg', 'uDim', 'uPosMix', 'uHaloC', 'uHaloR', 'uHaloK', 'uStagger'];
const Q_UNIFORMS = ['uRes', 'uOrigin', 'uSize', 'uCol', 'uAlpha', 'uEdge'];

/** @returns {boolean} whether this browser can create a WebGL context at all */
export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl');
    const ok = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

/**
 * @typedef {Object} DrawState
 * @property {number} time
 * @property {number} fold      0..1 cloud -> farm grid
 * @property {number} grid      0..1 -> target layout (aGrid)
 * @property {number} dim
 * @property {number} posMix
 * @property {boolean} reduce
 * @property {number} [ringAlpha]
 * @property {number} [ringPx]
 * @property {number} pointPx
 * @property {number} [posBoost]   default 0.25 (positives drawn a little larger)
 * @property {number} [stagger]    default 0.4 (per-dot delay)
 * @property {number[]} colPos
 * @property {number[]} colNeg
 * @property {number[]} [colRing]
 * @property {number[]} scatterOrigin  CSS px from the canvas centre, y down
 * @property {number[]} farmOrigin
 * @property {number[]} gridOrigin
 * @property {number} [halo]
 * @property {number[]} [haloC]
 * @property {number[]} [haloR]
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {import('./data.js').HerdData} data
 * @param {{ onLost?: () => void, onRestored?: () => void, onError?: (e: unknown) => void }} [hooks]
 * @returns {null | { resize: (w: number, h: number, dpr: number) => void, draw: (s: DrawState) => void,
 *   setTarget: (grid: Float32Array, sizes?: Float32Array, use?: Float32Array, pos?: Float32Array) => void,
 *   lost: () => boolean, destroy: () => void }}
 *   null when WebGL is unavailable; w and h are the logical size (CSS px of the coordinate system)
 */
export function createHerdEngine(canvas, data, hooks = {}) {
  const opts = { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, powerPreference: 'high-performance' };
  let gl = null;
  try {
    gl = canvas.getContext('webgl', opts);
  } catch {
    gl = null;
  }
  if (!gl) return null;

  const N = data.N;
  let target = { grid: data.grid, sizes: new Float32Array(N), use: new Float32Array(N).fill(1), pos: data.pos };
  let res = null;
  let isLost = false;
  let size = { w: 1, h: 1, dpr: 1 };

  function shader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) throw new Error(`shader: ${gl.getShaderInfoLog(s)}`);
    return s;
  }
  function program(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) throw new Error(`link: ${gl.getProgramInfoLog(p)}`);
    return p;
  }
  function buffer(arr) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
    return b;
  }

  function init() {
    const P = program(VS, FS);
    const Q = program(RVS, RFS);
    const B = {
      aScatter: [buffer(data.scatter), 3],
      aFarm: [buffer(data.farm), 2],
      aGrid: [buffer(target.grid), 2],
      aPos: [buffer(target.pos), 1],
      aSeed: [buffer(data.seed), 1],
      aTargetSize: [buffer(target.sizes), 1],
      aUse: [buffer(target.use), 1],
    };
    const bCenters = buffer(data.centers);
    const LP = {};
    for (const n of Object.keys(B)) LP[n] = gl.getAttribLocation(P, n);
    const lCenter = gl.getAttribLocation(Q, 'aCenter');
    const UP = {};
    for (const n of P_UNIFORMS) UP[n] = gl.getUniformLocation(P, n);
    const UQ = {};
    for (const n of Q_UNIFORMS) UQ[n] = gl.getUniformLocation(Q, n);
    const range = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    res = { P, Q, B, bCenters, LP, lCenter, UP, UQ, maxPoint: range ? range[1] : 64 };
    applySize();
  }

  function applySize() {
    canvas.width = Math.max(1, Math.round(size.w * size.dpr));
    canvas.height = Math.max(1, Math.round(size.h * size.dpr));
    if (gl && !isLost) gl.viewport(0, 0, canvas.width, canvas.height);
  }

  const onLost = (e) => {
    e.preventDefault();
    isLost = true;
    res = null;
    hooks.onLost?.();
  };
  const onRestored = () => {
    isLost = false;
    try {
      init();
      hooks.onRestored?.();
    } catch (err) {
      hooks.onError?.(err);
    }
  };
  canvas.addEventListener('webglcontextlost', onLost, false);
  canvas.addEventListener('webglcontextrestored', onRestored, false);

  try {
    init();
  } catch (err) {
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    hooks.onError?.(err);
    return null;
  }

  function replace(name, arr) {
    if (!res) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, res.B[name][0]);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
  }

  return {
    resize(w, h, dpr) {
      size = { w, h, dpr };
      applySize();
    },
    setTarget(grid, sizes, use, pos) {
      target = { grid, sizes: sizes || new Float32Array(N), use: use || new Float32Array(N).fill(1), pos: pos || data.pos };
      replace('aGrid', target.grid);
      replace('aTargetSize', target.sizes);
      replace('aUse', target.use);
      replace('aPos', target.pos);
    },
    lost: () => isLost,
    draw(s) {
      if (!res || isLost) return;
      const { P, Q, B, bCenters, LP, lCenter, UP, UQ, maxPoint } = res;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if ((s.ringAlpha || 0) > 0.003) {
        const ringDev = Math.min((s.ringPx || 74) * size.dpr, maxPoint);
        gl.useProgram(Q);
        gl.bindBuffer(gl.ARRAY_BUFFER, bCenters);
        gl.enableVertexAttribArray(lCenter);
        gl.vertexAttribPointer(lCenter, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(UQ.uRes, size.w, size.h);
        gl.uniform2f(UQ.uOrigin, s.farmOrigin[0], s.farmOrigin[1]);
        gl.uniform1f(UQ.uSize, ringDev);
        gl.uniform3fv(UQ.uCol, s.colRing || s.colNeg);
        gl.uniform1f(UQ.uAlpha, s.ringAlpha);
        gl.uniform1f(UQ.uEdge, Math.min(0.08, (1.1 * size.dpr) / ringDev));
        gl.drawArrays(gl.POINTS, 0, data.FARMS);
        gl.disableVertexAttribArray(lCenter);
      }
      gl.useProgram(P);
      for (const n of Object.keys(B)) {
        if (LP[n] < 0) continue;
        gl.bindBuffer(gl.ARRAY_BUFFER, B[n][0]);
        gl.enableVertexAttribArray(LP[n]);
        gl.vertexAttribPointer(LP[n], B[n][1], gl.FLOAT, false, 0, 0);
      }
      gl.uniform2f(UP.uRes, size.w, size.h);
      gl.uniform1f(UP.uDpr, size.dpr);
      gl.uniform1f(UP.uTime, s.time);
      gl.uniform1f(UP.uFold, s.fold);
      gl.uniform1f(UP.uGrid, s.grid);
      gl.uniform1f(UP.uReduce, s.reduce ? 1 : 0);
      gl.uniform2f(UP.uScatterOrigin, s.scatterOrigin[0], s.scatterOrigin[1]);
      gl.uniform2f(UP.uFarmOrigin, s.farmOrigin[0], s.farmOrigin[1]);
      gl.uniform2f(UP.uGridOrigin, s.gridOrigin[0], s.gridOrigin[1]);
      gl.uniform1f(UP.uPointPx, s.pointPx);
      gl.uniform1f(UP.uPosBoost, s.posBoost ?? 0.25);
      gl.uniform1f(UP.uStagger, s.stagger ?? 0.4);
      gl.uniform3fv(UP.uColPos, s.colPos);
      gl.uniform3fv(UP.uColNeg, s.colNeg);
      gl.uniform1f(UP.uDim, s.dim);
      gl.uniform1f(UP.uPosMix, s.posMix);
      const hc = s.haloC || [0, 0];
      const hr = s.haloR || [1, 1];
      gl.uniform2f(UP.uHaloC, hc[0], hc[1]);
      gl.uniform2f(UP.uHaloR, hr[0], hr[1]);
      gl.uniform1f(UP.uHaloK, s.halo || 0);
      gl.drawArrays(gl.POINTS, 0, N);
      for (const n of Object.keys(B)) if (LP[n] >= 0) gl.disableVertexAttribArray(LP[n]);
    },
    destroy() {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (res && !isLost) {
        for (const n of Object.keys(res.B)) gl.deleteBuffer(res.B[n][0]);
        gl.deleteBuffer(res.bCenters);
        gl.deleteProgram(res.P);
        gl.deleteProgram(res.Q);
      }
      res = null;
    },
  };
}

/** Maximum device-pixel ratio for WebGL canvases (M1-DESIGN.md 3). */
export const DPR_CAP = 2;

/**
 * Read the herd colours for the current theme from the tokens (--rs-gl-pos, --rs-gl-neg,
 * --rs-gl-ring are "r g b" triples in 0..1).
 * @returns {{ pos: number[], neg: number[], ring: number[] }}
 */
export function readGlColours() {
  const cs = getComputedStyle(document.documentElement);
  const triple = (name, fallback) => {
    const v = cs.getPropertyValue(name).trim().split(/\s+/).map(Number);
    return v.length === 3 && v.every((x) => Number.isFinite(x)) ? v : fallback;
  };
  return {
    pos: triple('--rs-gl-pos', [0.831, 0.647, 0.337]),
    neg: triple('--rs-gl-neg', [0.522, 0.471, 0.396]),
    ring: triple('--rs-gl-ring', [0.482, 0.659, 0.482]),
  };
}
