// ============================================================
// shaders.js — four passes, all GLSL ES 1.0 (WebGL 1)
// ============================================================
// 1 scene    : water light + animals + particles into a small target,
//              3 x 3 samples per glyph cell. Alpha is a class tag:
//              water < 0.41 (caustic light x 0.40), particle ~0.45, animal 1.
// 2 cell     : reads each 3 x 3 block, picks a glyph (edge stroke by the
//              direction of the animal's mass, else a measured density ramp
//              with 4 x 4 ordered dither) and the cell's colour.
// 3 glow     : a 5 x 5 Gaussian over the cell grid, sampled bilinearly by
//              the composite, so bright tiles bleed light like a lit screen.
// 4 composite: per device pixel: tile + glyph from the atlas, veil behind the
//              reading column, dark (tiles of light) and light (ink on paper)
//              computed together and mixed, so a theme change can crossfade.

export const QUAD_VS = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Caustics: a wavy water surface focuses sunlight into a net of thin bright
// curves on whatever lies below. The net's topology is close to the edges of
// a Voronoi diagram of the wave crests, so: animated Voronoi edges (F2 - F1
// near 0), domain-warped so the lines curve, two octaves (130 px and 62 px
// cells) for the main net and its finer filaments.
const CAUSTIC = `
vec2 chash(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float cnet(vec2 q, float t) {
  vec2 n = floor(q);
  vec2 f = fract(q);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = 0.5 + 0.42 * sin(t + 6.2831 * chash(n + g));
    float d = length(g + o - f);
    if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
  }
  return 1.0 - smoothstep(0.0, 0.13, f2 - f1);
}
float caustic(vec2 p, float t) {
  p += 14.0 * sin(p.yx / 95.0 + vec2(t * 0.7, t * 0.55));
  float a = cnet(p / 130.0, t * 0.9);
  float b = cnet(p / 62.0 + 7.3, t * 1.3);
  return clamp(a * a + 0.55 * b * b * b, 0.0, 1.0);
}
`;

export const WATER_FS = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_grid;
uniform float u_time;
uniform float u_caus;
uniform vec4 u_rip[8];
${CAUSTIC}
void main() {
  vec2 w = vec2(v_uv.x, 1.0 - v_uv.y) * u_grid;
  float c = caustic(w, u_time * 0.32) * u_caus;
  // ripples: a ring at r = c t whose amplitude falls as e^(-t/tau) / sqrt(r)
  // (energy spreading over a growing circle); kind 1 = a bioluminescent pulse
  float ring = 0.0;
  for (int k = 0; k < 8; k++) {
    vec4 r = u_rip[k];
    if (r.z < 0.0) continue;
    float speed = mix(230.0, 420.0, r.w);
    float rad = speed * r.z;
    float d = length(w - r.xy) - rad;
    float width = mix(9.0, 20.0, r.w);
    float amp = exp(-r.z / mix(1.0, 1.5, r.w)) / sqrt(1.0 + rad / 70.0);
    ring += amp * exp(-(d * d) / (width * width));
  }
  gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(c + ring * 0.95, 0.0, 1.0) * 0.40);
}
`;

export const BODY_VS = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec3 a_col;
attribute vec4 a_ext;
uniform vec2 u_grid;
varying vec2 v_uv;
varying vec3 v_col;
varying vec4 v_ext;
varying vec2 v_world;
void main() {
  v_uv = a_uv;
  v_col = a_col;
  v_ext = a_ext;
  v_world = vec2((a_pos.x + 1.0) * 0.5 * u_grid.x, (1.0 - a_pos.y) * 0.5 * u_grid.y);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const BODY_FS = `
precision highp float;
varying vec2 v_uv;
varying vec3 v_col;
varying vec4 v_ext;
varying vec2 v_world;
uniform float u_time;
uniform float u_caus;
uniform vec3 u_fog;
uniform vec3 u_sigma;
uniform vec3 u_hi;
uniform float u_ink;
${CAUSTIC}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 hash2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
// distance to the nearest jittered point and the gap to the second (Voronoi F2 - F1)
vec2 voronoi(vec2 x) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = hash2(n + g) * 0.8 + 0.1;
    float d = length(g + o - f);
    if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
  }
  return vec2(f1, f2 - f1);
}
void main() {
  float s = v_uv.x;
  float u = v_uv.y;
  float pat = v_ext.x;
  float seed = v_ext.y;
  float z = v_ext.z;
  float light = v_ext.w;
  float au = abs(u);
  vec3 c = v_col;
  bool fin = au > 1.0;
  // rounded body: the surface normal tilts away from the midline,
  // n_z = sqrt(1 - u^2); a fin is a flat blade
  float nz = fin ? 0.78 : sqrt(max(0.0, 1.0 - u * u));
  float shade = 0.5 + 0.5 * nz;
  // wet sheen down the back, strongest toward the head
  shade += fin ? 0.0 : 0.14 * exp(-u * u / 0.025) * (1.0 - s * 0.7);

  if (pat < 0.5) {
    // plain dorsal, darker along the midline (countershading seen from above)
    c *= 0.86 + 0.14 * au;
  } else if (pat < 1.5) {
    // whale shark: a grid of pale spots between pale longitudinal ridges
    vec2 g = vec2(s * 21.0, u * 4.2);
    vec2 cell = floor(g);
    vec2 f = fract(g) - 0.5 - (hash2(cell + seed) - 0.5) * 0.45;
    float r = 0.24 + 0.1 * hash(cell * 1.7 + seed);
    float spot = 1.0 - smoothstep(r, r + 0.08, length(f * vec2(1.0, 1.3)));
    float ridge = (1.0 - smoothstep(0.0, 0.05, abs(au - 0.36))) + (1.0 - smoothstep(0.0, 0.05, abs(au - 0.7)));
    ridge *= step(0.12, s) * step(s, 0.82) * 0.45;
    c = mix(c, u_hi, clamp(spot * (fin ? 0.5 : 1.0) * step(0.04, s) + ridge, 0.0, 1.0) * 0.85);
  } else if (pat < 2.5) {
    // zebra (leopard) shark adult: small dark spots all over
    vec2 g = vec2(s * 46.0, u * 7.0);
    vec2 cell = floor(g);
    vec2 f = fract(g) - 0.5 - (hash2(cell + seed) - 0.5) * 0.5;
    float spot = 1.0 - smoothstep(0.16, 0.24, length(f));
    c = mix(c, c * 0.3, spot * 0.9);
  } else if (pat < 3.5) {
    // manta: dark back with pale chevron shoulder patches
    float band = abs(au - (0.28 + 0.95 * (s - 0.12)));
    float patch = (1.0 - smoothstep(0.08, 0.2, band)) * smoothstep(0.1, 0.2, s) * (1.0 - smoothstep(0.42, 0.6, s));
    c = mix(c, u_hi, patch * 0.8);
  } else if (pat < 4.5) {
    // green turtle carapace: plates (Voronoi) with darker seams and radiating streaks
    vec2 q = vec2(s * 3.4, u * 2.2 + 3.0);
    vec2 v = voronoi(q + seed * 0.01);
    float seam = 1.0 - smoothstep(0.03, 0.09, v.y);
    float streak = 0.5 + 0.5 * sin(atan(u, s - 0.5) * 22.0 + seed);
    c *= 0.82 + 0.25 * streak * (1.0 - v.x);
    c = mix(c, c * 0.45, seam);
  } else if (pat < 5.5) {
    // dugong: smooth, faint mottling
    c *= 0.9 + 0.12 * hash(floor(vec2(s * 14.0, u * 4.0)) + seed);
  } else if (pat < 6.5) {
    // moon jelly: a translucent bell with four horseshoe gonads and a bright rim
    float ang = (u + 1.0) * 3.14159265;
    float ring = exp(-pow((s - 0.43) / 0.11, 2.0)) * (0.5 + 0.5 * cos(4.0 * ang));
    float rim = smoothstep(0.75, 1.0, s);
    c = mix(c, c * 0.6 + u_hi * 0.15, 0.0);
    c = mix(c, vec3(c.r * 1.25, c.g * 0.72, c.b * 1.05), ring * 0.9);
    shade = 0.75 + 0.45 * rim;
  } else if (pat < 7.5) {
    // turtle skin: small polygon scales with pale seams
    vec2 v = voronoi(vec2(s * 22.0, u * 6.0) + seed);
    c = mix(c, u_hi, (1.0 - smoothstep(0.02, 0.07, v.y)) * 0.35);
  } else {
    // anchovy: silver; brightness comes from the flank glint (light)
  }

  vec3 col = c * shade * light;
  // light from above: caustics play on the animal's back, fading with depth
  col += c * caustic(v_world, u_time * 0.32) * u_caus * (1.0 - z) * 1.2 * (1.0 - u_ink * 0.6);
  // Beer-Lambert: water above the animal transmits T = e^(-sigma d) per channel;
  // red is absorbed first, so deep animals turn blue-green in the dark sea
  vec3 T = exp(-u_sigma * z);
  col = col * T + u_fog * (1.0 - T);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const POINT_VS = `
attribute vec2 a_pos;
attribute vec4 a_col;
attribute float a_size;
varying vec4 v_col;
void main() { v_col = a_col; gl_PointSize = a_size; gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export const POINT_FS = `
precision mediump float;
varying vec4 v_col;
void main() { gl_FragColor = v_col; }
`;

export const CELL_FS = `
precision highp float;
uniform sampler2D u_scene;
uniform vec2 u_fbo;
uniform float u_K;
uniform float u_edge0;
uniform float u_water0;
uniform float u_spark;
uniform float u_ink;
float bayer(vec2 c) {
  vec2 m = mod(c, 4.0);
  float x = m.x;
  float y = m.y;
  // 4 x 4 Bayer matrix, row-major: 0 8 2 10 / 12 4 14 6 / 3 11 1 9 / 15 7 13 5
  float v;
  if (y < 1.0) v = x < 1.0 ? 0.0 : x < 2.0 ? 8.0 : x < 3.0 ? 2.0 : 10.0;
  else if (y < 2.0) v = x < 1.0 ? 12.0 : x < 2.0 ? 4.0 : x < 3.0 ? 14.0 : 6.0;
  else if (y < 3.0) v = x < 1.0 ? 3.0 : x < 2.0 ? 11.0 : x < 3.0 ? 1.0 : 9.0;
  else v = x < 1.0 ? 15.0 : x < 2.0 ? 7.0 : x < 3.0 ? 13.0 : 5.0;
  return (v + 0.5) / 16.0;
}
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  vec3 sumObj = vec3(0.0);
  float nObj = 0.0;
  vec2 g = vec2(0.0);
  vec3 sumPart = vec3(0.0);
  float nPart = 0.0;
  float water = 0.0;
  for (int j = 0; j < 3; j++)
  for (int i = 0; i < 3; i++) {
    vec2 uv = (cell * 3.0 + vec2(float(i), float(j)) + 0.5) / u_fbo;
    vec4 t = texture2D(u_scene, uv);
    if (t.a > 0.495) { sumObj += t.rgb; nObj += 1.0; g += vec2(float(i) - 1.0, float(j) - 1.0); }
    else if (t.a > 0.415) { sumPart += t.rgb; nPart += 1.0; }
    else { water += t.a / 0.40; }
  }
  float idx = 0.0;
  vec3 col = vec3(0.0);
  if (nObj > 0.0) {
    col = sumObj / nObj;
    float frac = nObj / 9.0;
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    float level = mix(lum, 1.0 - lum, u_ink);
    if (frac < 0.75 && length(g) > 0.9) {
      // an outline runs perpendicular to where the animal's mass lies
      float a = atan(g.y, g.x) + 1.5707963;
      float q = mod(floor(a / 3.14159265 * 4.0 + 0.5), 4.0);
      idx = u_edge0 + q;
      col *= mix(0.8, 1.0, frac);
    } else {
      float v = clamp(level * 1.15, 0.0, 0.999) * u_K + (bayer(cell) - 0.5);
      idx = 1.0 + clamp(floor(v), 0.0, u_K - 1.0);
    }
  } else if (nPart > 0.0) {
    col = sumPart / nPart;
    // bright particles are sparks (bioluminescence), dim ones are marine snow
    float pl = dot(col, vec3(0.2126, 0.7152, 0.0722));
    bool isSpark = u_ink < 0.5 ? pl > 0.55 : pl < 0.35;
    idx = isSpark ? u_spark : u_spark + 1.0;
  } else {
    float w = water / 9.0;
    col = vec3(w);
    if (w > 0.2) idx = u_water0 + (w > 0.62 ? 2.0 : (w > 0.38 ? 1.0 : 0.0));
  }
  // the glyph index rides in an 8-bit channel: k / 255 is stored exactly on every
  // GPU, and the readers round. (idx + 0.5) / 255 sat on a rounding tie: Apple GPUs
  // stored idx + 1, which turned every empty cell of water into a grey tile.
  gl_FragColor = vec4(col, idx / 255.0);
}
`;

export const GLOW_FS = `
precision highp float;
uniform sampler2D u_cell;
uniform vec2 u_cells;
uniform float u_water0;
uniform float u_spark;
void main() {
  vec2 c = gl_FragCoord.xy;
  vec3 acc = vec3(0.0);
  float wsum = 0.0;
  for (int j = -2; j <= 2; j++)
  for (int i = -2; i <= 2; i++) {
    vec2 o = vec2(float(i), float(j));
    float w = exp(-dot(o, o) / 2.4);
    vec4 d = texture2D(u_cell, (c + o) / u_cells);
    float idx = floor(d.a * 255.0 + 0.5);
    float obj = step(0.5, idx) * step(idx, u_water0 - 0.5);
    float spark = 1.0 - step(0.5, abs(idx - u_spark));
    float mote = 1.0 - step(0.5, abs(idx - u_spark - 1.0));
    acc += d.rgb * w * (obj * 0.42 + spark * 1.8 + mote * 0.25);
    wsum += w;
  }
  gl_FragColor = vec4(acc / wsum, 1.0);
}
`;

export const COMPOSITE_FS = `
precision highp float;
uniform sampler2D u_cell;
uniform sampler2D u_glow;
uniform sampler2D u_atlas;
uniform vec2 u_cells;
uniform float u_cellPx;
uniform vec2 u_canvas;
uniform float u_glyphs;
uniform float u_K;
uniform float u_water0;
uniform float u_spark;
uniform vec3 u_bgDark;
uniform vec3 u_bgLight;
uniform vec3 u_waterDark;
uniform vec3 u_waterLight;
uniform float u_ink;
uniform vec4 u_veil;
uniform float u_veilAmt;
uniform float u_veilR;
uniform float u_fade;
uniform float u_glowAmt;
uniform float u_topPx;
uniform float u_exposure;
float sdRound(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main() {
  vec2 p = vec2(gl_FragCoord.x, u_canvas.y - gl_FragCoord.y);
  vec2 cell = floor(p / u_cellPx);
  vec2 local = (p - cell * u_cellPx) / u_cellPx;
  vec4 d = texture2D(u_cell, vec2((cell.x + 0.5) / u_cells.x, 1.0 - (cell.y + 0.5) / u_cells.y));
  float idx = floor(d.a * 255.0 + 0.5);
  vec3 col = d.rgb;
  vec3 glow = texture2D(u_glow, vec2(p.x / (u_cells.x * u_cellPx), 1.0 - p.y / (u_cells.y * u_cellPx))).rgb;

  // the reading column: animals fade behind words (legibility beats spectacle)
  vec2 vc = u_veil.xy + u_veil.zw * 0.5;
  float vd = sdRound(p - vc, u_veil.zw * 0.5, u_veilR);
  float veil = u_veilAmt * (1.0 - smoothstep(0.0, u_veilR * 2.0 + 1.0, vd));
  // the header's words sit on open water: animals fade under that band
  float top = 0.3 + 0.7 * smoothstep(u_topPx * 0.6, u_topPx * 1.5, p.y);
  float k = (1.0 - veil) * u_fade * top;

  float gA = texture2D(u_atlas, vec2((idx + local.x) / u_glyphs, local.y)).r;
  float obj = step(0.5, idx) * step(idx, u_water0 - 0.5);
  float water = step(u_water0 - 0.5, idx) * step(idx, u_spark - 0.5);
  float spark = step(u_spark - 0.5, idx);
  float edge = step(u_water0 - 4.5, idx) * obj;
  // square tiles with a one-device-pixel gap: the grid itself stays visible
  float px = 1.0 / u_cellPx;
  vec2 inside = step(vec2(px), local) * step(local, vec2(1.0 - px));
  // halftone: a tile's size follows its ink (area ~ density, so side ~ sqrt),
  // and outline cells are the smallest, so a silhouette softens instead of stepping
  float dens = edge > 0.5 ? 0.25 : clamp((idx - 1.0) / max(1.0, u_K - 1.0), 0.0, 1.0);
  float hs = 0.5 * sqrt(0.42 + 0.58 * dens) - px; // ('half' is reserved in GLSL ES)
  vec2 q = abs(local - 0.5);
  float tileShape = 1.0 - smoothstep(hs - px, hs + px, max(q.x, q.y));
  float tile = tileShape * obj;
  // photographic mosaics are never one flat colour: +-6% per tile
  float jit = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  // dark water swallows light: tiles get a small exposure lift there, none on paper
  vec3 tc = col * (1.0 + jit * 0.12) * mix(1.18 * u_exposure, 1.0, u_ink);
  float tl = dot(tc, vec3(0.2126, 0.7152, 0.0722));
  // the glyph is cut against its own tile: dark on a light tile, light on a dark one
  vec3 gc = tl > 0.32 ? tc * 0.42 : min(vec3(1.0), tc * 1.7 + 0.08);
  float grid = (1.0 - inside.x * inside.y);

  // dark: lit tiles in black water, the cell grid a faint wire
  vec3 dk = u_bgDark + glow * u_glowAmt * k + grid * 0.018 * k;
  dk = mix(dk, tc, tile * k);
  dk = mix(dk, gc, gA * k * obj);
  dk = mix(dk, u_waterDark, gA * col.r * k * 0.7 * water);
  dk = mix(dk, min(vec3(1.0), col * 1.3), gA * k * spark);

  // light: a specimen plate; ink tiles on paper, the grid as a faint rule
  vec3 lt = u_bgLight - grid * 0.03 * k;
  vec3 lgc = tl > 0.55 ? tc * 0.5 : mix(tc, u_bgLight, 0.72);
  lt = mix(lt, tc, tile * k);
  lt = mix(lt, lgc, gA * k * obj);
  lt = mix(lt, u_waterLight, gA * col.r * k * 0.75 * water);
  lt = mix(lt, col * 0.85, gA * k * spark);

  gl_FragColor = vec4(mix(dk, lt, u_ink), 1.0);
}
`;
