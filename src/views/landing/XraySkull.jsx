// ============================================================
// XraySkull — one Atlas specimen drawn as an X-ray, for the landing
// ============================================================
// The Atlas models are glTF with KHR_mesh_quantization only: one mesh,
// 16-bit normalised positions already in display coordinates, 8-bit normals,
// 16-bit indices (see public/atlas/*-provenance.json). That is small enough
// to draw with forty lines of WebGL2, so the landing does not pull three.js
// (the 168 KB gzip vendor-atlas chunk) to turn one skull.
//
// The look: additive blending with no depth test, brightness from how edge-on
// each surface is (1 - |n.v|)^k. Thin edges glow and thick bone builds up,
// which reads as a radiograph and needs no texture.
//
// `rest` is the pose it turns from: { yaw, pitch, dist, at }. The turn and
// the drag's coast use time constants, so they read the same on a 60 Hz and
// a 120 Hz screen.
//
// Cost rules: the model is fetched only when the stage is near the viewport,
// the loop runs only while the stage is on screen and the tab is visible,
// the drawing buffer is sized once (WebKit stops showing a WebGL canvas whose
// buffer is resized after it has been on screen, see AtlasScene.jsx), and
// reduced motion keeps the skull still unless the reader drags it. Any failure (no WebGL2, a lost context, a failed
// fetch) leaves the poster.
// ============================================================

import { useEffect, useRef, useState } from 'react';

const VERT = `#version 300 es
in vec3 aPos; in vec3 aNor;
uniform mat4 uMV; uniform mat4 uP;
out vec3 vN; out vec3 vV;
void main() {
  vec4 p = uMV * vec4(aPos, 1.0);
  vN = mat3(uMV) * aNor;
  vV = -p.xyz;
  gl_Position = uP * p;
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vN; in vec3 vV;
uniform vec3 uTint; uniform float uGain;
out vec4 o;
void main() {
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float a = pow(1.0 - facing, 2.4) * uGain + 0.018;
  o = vec4(uTint * a, a);
}`;

export function parseGlb(buf) {
  const dv = new DataView(buf);
  if (dv.getUint32(0, true) !== 0x46546c67) throw new Error('not a glb');
  let off = 12, json = null, bin = null;
  while (off < dv.byteLength) {
    const len = dv.getUint32(off, true), type = dv.getUint32(off + 4, true);
    if (type === 0x4e4f534a) json = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, off + 8, len)));
    else if (type === 0x004e4942) bin = new Uint8Array(buf, off + 8, len);
    off += 8 + len;
  }
  const prim = json.meshes[0].primitives[0];
  const view = (i) => {
    const a = json.accessors[i], bv = json.bufferViews[a.bufferView];
    return { a, bytes: bin.subarray((bv.byteOffset || 0) + (a.byteOffset || 0), (bv.byteOffset || 0) + bv.byteLength), stride: bv.byteStride || 0 };
  };
  return { pos: view(prim.attributes.POSITION), nor: view(prim.attributes.NORMAL), idx: view(prim.indices) };
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

// Column-major 4x4 helpers, just the two this needs.
function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}
/** View * model: rotate (pitch after yaw) about the point `at`, then step back. */
export function modelView(yaw, pitch, dist, at = [0, 0, 0]) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const r = [cy, sp * sy, -cp * sy, 0, cp, sp, sy, -sp * cy, cp * cy];
  const [ax, ay, az] = at;
  const tx = -(r[0] * ax + r[3] * ay + r[6] * az);
  const ty = -(r[1] * ax + r[4] * ay + r[7] * az);
  const tz = -(r[2] * ax + r[5] * ay + r[8] * az) - dist;
  return new Float32Array([r[0], r[1], r[2], 0, r[3], r[4], r[5], 0, r[6], r[7], r[8], 0, tx, ty, tz, 1]);
}

const DEFAULT_TINT = [0.78, 0.9, 1.0];
const IDLE = { yaw: -0.6, pitch: 0.12, dist: 3.3, at: [0, 0, 0] };

export default function XraySkull({ model, poster, label, hint, tint = DEFAULT_TINT, rest = IDLE, spin = 0.32, className = '' }) {
  const stage = useRef(null);
  const canvas = useRef(null);
  const tintRef = useRef(tint);
  tintRef.current = tint;
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = stage.current, cv = canvas.current;
    if (!el || !cv || typeof IntersectionObserver === 'undefined') return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let disposed = false, gl = null, frame = 0, onScreen = false, started = false;
    const { dist, at } = rest;
    let yaw = rest.yaw, pitch = rest.pitch;
    let vyaw = 0, vpitch = 0, last = 0, dragging = false, px = 0, py = 0;
    let count = 0, uMV = null;

    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; };
    const loop = (t) => {
      frame = 0;
      if (disposed || !gl || !onScreen || document.hidden) return;
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
      last = t;
      let moving = dragging || Math.abs(vyaw) > 0.01 || Math.abs(vpitch) > 0.01;
      if (!dragging) {
        // The drag coasts to a stop; the slow turn keeps going.
        const k = Math.exp(-dt / 0.35);
        vyaw *= k; vpitch *= k;
        yaw += vyaw * dt + (reduced ? 0 : spin * dt);
        pitch = Math.max(-0.6, Math.min(0.6, pitch + vpitch * dt));
        moving = moving || !reduced;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(uMV, false, modelView(yaw, pitch, dist, at));
      gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
      if (moving) frame = requestAnimationFrame(loop);
    };
    const kick = () => { if (!frame && gl && onScreen && !document.hidden) { last = 0; frame = requestAnimationFrame(loop); } };

    async function start() {
      started = true;
      try {
        gl = cv.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'low-power' });
        if (!gl) return;
        const res = await fetch(model);
        if (!res.ok) throw new Error(`model ${res.status}`);
        const glb = parseGlb(await res.arrayBuffer());
        if (disposed) return;
        // Size the buffer once from the stage, capped, and let CSS scale it.
        const box = el.getBoundingClientRect();
        const side = Math.round(Math.min(1000, Math.max(320, box.width * Math.min(2, window.devicePixelRatio || 1))));
        cv.width = side; cv.height = side;
        const prog = gl.createProgram();
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
        gl.useProgram(prog);
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        const attr = (name, part, size, type) => {
          const loc = gl.getAttribLocation(prog, name);
          const b = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.bufferData(gl.ARRAY_BUFFER, part.bytes, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, size, type, true, part.stride, 0);
        };
        attr('aPos', glb.pos, 3, gl.SHORT);
        attr('aNor', glb.nor, 3, gl.BYTE);
        const ib = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, glb.idx.bytes, gl.STATIC_DRAW);
        count = glb.idx.a.count;
        uMV = gl.getUniformLocation(prog, 'uMV');
        gl.uniformMatrix4fv(gl.getUniformLocation(prog, 'uP'), false, perspective(0.62, 1, 0.1, 20));
        gl.uniform3fv(gl.getUniformLocation(prog, 'uTint'), tintRef.current);
        gl.uniform1f(gl.getUniformLocation(prog, 'uGain'), 0.5);
        gl.viewport(0, 0, side, side);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.clearColor(0, 0, 0, 0);
        if (disposed) return;
        setLive(true);
        kick();
      } catch {
        gl = null; // the poster stays
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !started) start();
      if (onScreen) kick(); else stop();
    }, { rootMargin: '300px 0px' });
    io.observe(el);

    const onVisibility = () => (document.hidden ? stop() : kick());
    const onLost = (e) => { e.preventDefault(); gl = null; stop(); setLive(false); };
    // Direct manipulation only: pointer events exist while a finger or the
    // mouse holds the skull, never as hover physics.
    const onDown = (e) => {
      if (!gl) return;
      dragging = true; px = e.clientX; py = e.clientY; vyaw = 0; vpitch = 0;
      cv.setPointerCapture?.(e.pointerId);
      kick();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      yaw += dx * 0.01; pitch = Math.max(-0.6, Math.min(0.6, pitch + dy * 0.006));
      vyaw = dx * 0.6; vpitch = dy * 0.36;
      kick();
    };
    const onUp = () => { dragging = false; kick(); };
    document.addEventListener('visibilitychange', onVisibility);
    cv.addEventListener('webglcontextlost', onLost);
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onUp);
    return () => {
      disposed = true; stop(); io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      cv.removeEventListener('webglcontextlost', onLost);
      cv.removeEventListener('pointerdown', onDown);
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('pointercancel', onUp);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [model, spin, rest]);

  return (
    <div ref={stage} className={`lp-skull${live ? ' is-live' : ''}${className ? ` ${className}` : ''}`}>
      <img className="lp-skull-poster" src={poster} alt="" width={600} height={600} loading="lazy" decoding="async" />
      <canvas ref={canvas} className="lp-skull-canvas" role="img" aria-label={label} />
      {live && hint && <span className="lp-skull-hint" aria-hidden="true">{hint}</span>}
    </div>
  );
}
