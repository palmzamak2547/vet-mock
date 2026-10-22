#!/usr/bin/env node
// ============================================================
// SVG to Android VectorDrawable, for the subset VetMock's art uses
// ============================================================
// The splash and the widget draw Mochi and the paw from the web's own SVGs
// (public/motion/poses, public/vetmock-logo.svg), so the app never carries a
// second copy of the art to drift. Handles path, ellipse, circle and nested g
// with translate/rotate/scale; groups at opacity 0 (Mochi's hidden rigs) and
// text are skipped. Anything else throws, so a new element is noticed.
//
//   node mobile/scripts/svg-to-vector.mjs <in.svg> <out.xml> [--size 240] [--inset 0.72] [--cy 280] [--fill #hex]
// ============================================================

import { readFileSync, writeFileSync } from 'node:fs';

const NUM = String.raw`-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?`;

export function parseTransform(value = '') {
  const ops = [];
  const re = /(translate|rotate|scale)\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(value))) {
    const a = (m[2].match(new RegExp(NUM, 'g')) || []).map(Number);
    if (m[1] === 'translate') ops.push({ translateX: a[0] || 0, translateY: a[1] || 0 });
    else if (m[1] === 'rotate') ops.push({ rotation: a[0] || 0, pivotX: a[1] || 0, pivotY: a[2] || 0 });
    else ops.push({ scaleX: a[0] ?? 1, scaleY: a[1] ?? a[0] ?? 1 });
  }
  if (value.replace(re, '').trim()) throw new Error(`unsupported transform: ${value}`);
  return ops;
}

const ellipsePath = (cx, cy, rx, ry) =>
  `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${2 * rx},0a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;

/** A tiny XML reader: enough for the flat, well-formed SVGs this repo writes. */
export function parseSvg(text) {
  const root = { tag: 'root', attrs: {}, children: [] };
  const stack = [root];
  const re = /<(\/?)([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>|<!--[\s\S]*?-->/g;
  let m;
  while ((m = re.exec(text))) {
    if (!m[2]) continue;
    const [, close, tag, rawAttrs, selfClose] = m;
    if (close) { stack.pop(); continue; }
    const attrs = {};
    for (const a of rawAttrs.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    const node = { tag, attrs, children: [] };
    stack.at(-1).children.push(node);
    if (!selfClose) stack.push(node);
  }
  return root.children[0];
}

function color(value, opacity) {
  if (!value || value === 'none') return null;
  const hex = value.replace('#', '');
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`unsupported colour: ${value}`);
  const alpha = Math.round(Math.max(0, Math.min(1, opacity)) * 255).toString(16).padStart(2, '0');
  return `#${alpha === 'ff' ? '' : alpha}${full.toUpperCase()}`;
}

function render(node, inherited, out, indent) {
  const pad = '  '.repeat(indent);
  const a = node.attrs;
  const opacity = (a.opacity === undefined ? 1 : Number(a.opacity)) * inherited.opacity;
  if (opacity <= 0.001 || node.tag === 'text' || node.tag === 'title') return;
  const ctx = {
    opacity,
    force: inherited.force,
    fill: a.fill === 'none' ? 'none' : (inherited.force ?? a.fill ?? inherited.fill),
    stroke: (a.stroke ?? inherited.stroke) && (inherited.force ?? a.stroke ?? inherited.stroke),
    strokeWidth: a['stroke-width'] ?? inherited.strokeWidth,
    cap: a['stroke-linecap'] ?? inherited.cap,
    join: a['stroke-linejoin'] ?? inherited.join,
  };
  const ops = parseTransform(a.transform);
  let depth = indent;
  for (const op of ops) {
    const attrs = Object.entries(op).map(([k, v]) => `android:${k}="${+v.toFixed(4)}"`).join(' ');
    out.push(`${'  '.repeat(depth)}<group ${attrs}>`);
    depth += 1;
  }
  if (node.tag === 'g') {
    for (const child of node.children) render(child, ctx, out, depth);
  } else {
    let d;
    if (node.tag === 'path') d = a.d;
    else if (node.tag === 'ellipse') d = ellipsePath(+(a.cx || 0), +(a.cy || 0), +a.rx, +a.ry);
    else if (node.tag === 'circle') d = ellipsePath(+(a.cx || 0), +(a.cy || 0), +a.r, +a.r);
    else throw new Error(`unsupported element: <${node.tag}>`);
    const fill = color(ctx.fill === undefined ? '#000000' : ctx.fill, opacity);
    const stroke = color(ctx.stroke, opacity);
    const parts = [`android:pathData="${d.trim().replace(/\s+/g, ' ')}"`];
    if (fill) parts.push(`android:fillColor="${fill}"`);
    if (stroke) {
      parts.push(`android:strokeColor="${stroke}"`, `android:strokeWidth="${ctx.strokeWidth || 1}"`);
      if (ctx.cap) parts.push(`android:strokeLineCap="${ctx.cap}"`);
      if (ctx.join) parts.push(`android:strokeLineJoin="${ctx.join}"`);
    }
    out.push(`${'  '.repeat(depth)}<path ${parts.join(' ')}/>`);
  }
  for (let i = ops.length - 1; i >= 0; i--) out.push(`${'  '.repeat(indent + i)}</group>`);
}

/**
 * VectorDrawable XML. `inset` scales the art about (256, cy) so it sits inside
 * the splash screen's circular mask; `fill` paints every shape one colour (a
 * themed or monochrome icon).
 */
export function svgToVector(svgText, { size = 240, inset = 1, cy = 256, fill = null } = {}) {
  const svg = parseSvg(svgText);
  const [, , w, h] = (svg.attrs.viewBox || '0 0 512 512').split(/\s+/).map(Number);
  const out = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!-- Generated by mobile/scripts/svg-to-vector.mjs from the web\'s SVG. Do not edit by hand. -->',
    `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="${size}dp" android:height="${size}dp" android:viewportWidth="${w}" android:viewportHeight="${h}">`,
    `  <group android:pivotX="${w / 2}" android:pivotY="${cy}" android:scaleX="${inset}" android:scaleY="${inset}" android:translateY="${h / 2 - cy}">`,
  ];
  const base = { opacity: 1, force: fill || undefined };
  for (const child of svg.children) {
    if (fill && child.tag === 'rect') continue;
    if (child.tag === 'rect') {
      // A full-bleed background rect: drawn as a rounded rectangle path.
      const r = +(child.attrs.rx || 0);
      const d = `M${r},0H${w - r}A${r},${r} 0 0 1 ${w},${r}V${h - r}A${r},${r} 0 0 1 ${w - r},${h}H${r}A${r},${r} 0 0 1 0,${h - r}V${r}A${r},${r} 0 0 1 ${r},0Z`;
      out.push(`    <path android:pathData="${d}" android:fillColor="${color(child.attrs.fill, 1)}"/>`);
      continue;
    }
    render(child, base, out, 2);
  }
  out.push('  </group>', '</vector>', '');
  return out.join('\n');
}

if (process.argv[1]?.endsWith('svg-to-vector.mjs') && process.argv.length >= 4) {
  const [input, output, ...rest] = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i].replace(/^--/, '');
    opts[key] = key === 'fill' ? rest[i + 1] : Number(rest[i + 1]);
  }
  writeFileSync(output, svgToVector(readFileSync(input, 'utf8'), opts));
  console.log(`wrote ${output}`);
}
