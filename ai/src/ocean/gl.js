// ============================================================
// gl.js — the few WebGL 1 helpers the ocean needs
// ============================================================
// WebGL 1 on purpose: it is what every in-app browser (LINE, Facebook,
// Instagram, TikTok) and every phone from the last eight years exposes.
// failIfMajorPerformanceCaveat makes a software-rendered context refuse,
// so a machine that would crawl gets the still picture instead.

export function createGL(canvas, allowSoftware = false) {
  const opts = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'default',
    failIfMajorPerformanceCaveat: !allowSoftware,
  };
  try {
    return canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
  } catch {
    return null;
  }
}

function shader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`shader: ${log}`);
  }
  return s;
}

/** Compile + link; returns { prog, attr(name), uni(name) } with cached locations. */
export function program(gl, vs, fs) {
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS) && !gl.isContextLost()) {
    throw new Error(`link: ${gl.getProgramInfoLog(prog)}`);
  }
  const a = new Map();
  const u = new Map();
  return {
    prog,
    attr: (n) => (a.has(n) ? a.get(n) : (a.set(n, gl.getAttribLocation(prog, n)), a.get(n))),
    uni: (n) => (u.has(n) ? u.get(n) : (u.set(n, gl.getUniformLocation(prog, n)), u.get(n))),
  };
}

export function texture(gl, w, h, filter = gl.NEAREST, source = null) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  if (source) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  return t;
}

/** A texture you can render into. */
export function target(gl, w, h, filter) {
  const tex = texture(gl, w, h, filter);
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (!ok) throw new Error('framebuffer incomplete');
  return { tex, fb, w, h };
}

export function dropTarget(gl, t) {
  if (!t) return;
  gl.deleteFramebuffer(t.fb);
  gl.deleteTexture(t.tex);
}

/** Bind a float attribute from the currently bound ARRAY_BUFFER. */
export function attrib(gl, loc, size, stride, offset) {
  if (loc < 0) return;
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride * 4, offset * 4);
}
