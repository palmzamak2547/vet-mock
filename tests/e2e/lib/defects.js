// The defect sweep's detectors (tests/e2e/defect-sweep.spec.js). Each finding names the detector that
// fired, so a fault can be traced to one rule:
//   overlap     two visible things that hold text or are controls (or a picture over text), neither
//               inside the other, whose boxes cross by more than 2 px both ways
//   overflow-x  the page, or a scroller meant for up and down, is wider than its view
//   clipped     text cut by its own box or an ancestor's hidden overflow with no ellipsis or line clamp,
//               and Thai marks at risk in a line box shorter than the text needs
//   off-screen  a control or text partly past the screen's side, or under a fixed bar at the top or
//               the bottom with no scroll that frees it
//   target      a control under 44 px either way on a touch size, or two controls closer than 8 px
//   raw         "undefined", "NaN", "null", "[object Object]", "{placeholder}", a translation key,
//               "Invalid Date", or a unit word whose number is missing
//   console     an uncaught error, an unhandled rejection, a React warning, or a failed data request
//               the screen does not explain
//   shift       a thing that moves more than 8 px after first paint with nobody touching the page
//   dead        a control that does nothing when pressed, or a link to the not-found screen
//   stuck       a loading state still there after 20 s, or a spinner with no words for more than 4 s
//   contrast    text under 4.5:1 (3:1 when large) against what is really behind it
//   focus       a dialog that does not take or keep focus, ignores Escape, or returns focus to nothing
// Everything that runs in the page is a plain function with no closures, handed to page.evaluate.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DETECTORS = ['overlap', 'overflow-x', 'clipped', 'off-screen', 'target', 'raw', 'console', 'shift', 'dead', 'stuck', 'contrast', 'focus'];

export const SIZES = [
  { id: '390x664', width: 390, height: 664, touch: true },
  { id: '820x1180', width: 820, height: 1180, touch: true },
  { id: '1180x820', width: 1180, height: 820, touch: true },
  { id: '1280x800', width: 1280, height: 800, touch: false },
];

export const STATES = ['settled', 'loading', 'empty', 'failed', 'offline'];

export const STUCK_MS = 20_000;
export const SPINNER_MS = 4_000;

// ---------------------------------------------------------------------------------------------
// In the page: install the observers a visit is judged by (an init script, before any app code).
export function installObservers() {
  if (window.__vmxDefects) return;
  const state = { shifts: [], firstPaint: null };
  window.__vmxDefects = state;
  const sig = (el) => {
    if (!el || el.nodeType !== 1) return '';
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter((c) => c && !/\d{3,}/.test(c)).slice(0, 3).join('.') : '';
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
  };
  const text = (el) => (el && el.nodeType === 1 ? (el.innerText || el.getAttribute('aria-label') || '') : '').replace(/\s+/g, ' ').trim().slice(0, 50);
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        for (const s of e.sources || []) {
          const p = s.previousRect; const c = s.currentRect;
          const move = Math.max(Math.abs(p.x - c.x), Math.abs(p.y - c.y), Math.abs(p.width - c.width), Math.abs(p.height - c.height));
          if (move <= 8 || !p.width || !c.width) continue;
          const node = s.node && s.node.nodeType === 3 ? s.node.parentElement : s.node;
          state.shifts.push({ t: Math.round(e.startTime), value: e.value, sig: sig(node), text: text(node), move: Math.round(move),
            prev: { x: p.x, y: p.y, w: p.width, h: p.height }, curr: { x: c.x, y: c.y, w: c.width, h: c.height } });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch { /* an engine without layout-shift entries: the two-picture comparison still runs */ }
  window.addEventListener('unhandledrejection', (event) => {
    const r = event.reason;
    console.error(`unhandledrejection: ${r && r.stack ? r.stack.split(String.fromCharCode(10))[0] : String(r)}`);
  });
}

// ---------------------------------------------------------------------------------------------
// In the page: is a loading state on screen, and which spinners carry no words.
export function readLoading() {
  const main = document.querySelector('#main') || document.querySelector('main') || document.body;
  const shown = (el) => {
    if (!el.checkVisibility || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const sig = (el) => {
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter((c) => c && !/\d{3,}/.test(c)).slice(0, 3).join('.')
      : (el.className && el.className.baseVal ? el.className.baseVal.trim().split(/\s+/).slice(0, 3).join('.') : '');
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
  };
  // A progress bar on its own is not loading (a lesson's progress is a progressbar); a download's bar
  // says so in words, which loadingText reads.
  const busy = [...document.querySelectorAll('.vmx-view-fallback, [aria-busy="true"]')].filter(shown);
  const words = /กำลังโหลด|กำลังเปิด|กำลังเตรียม|กำลังดึง|กำลังค้น|Loading/;
  const loadingText = [...main.querySelectorAll('p, span, div, h1, h2, h3, strong')].filter((el) => el.children.length === 0 && words.test(el.textContent || '') && shown(el));
  const spinnerish = [...document.querySelectorAll('[role="progressbar"], [aria-busy="true"], [class*="spinner"], [class*="spin "], [class*="-spin"], [class*="loader"], [class*="loading"], [class*="skeleton"]')]
    .filter((el) => shown(el));
  const silent = [];
  for (const el of spinnerish) {
    const own = `${el.innerText || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('aria-valuetext') || ''} ${el.getAttribute('title') || ''}`.replace(/\s+/g, '');
    if (own.length > 1) continue;
    let p = el.parentElement; let explained = false;
    for (let i = 0; i < 3 && p; i += 1, p = p.parentElement) {
      if ((p.innerText || '').replace(/\s+/g, '').length > 1) { explained = true; break; }
    }
    if (!explained) {
      const r = el.getBoundingClientRect();
      silent.push({ sig: sig(el), rect: { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) } });
    }
  }
  return { loading: busy.length > 0 || loadingText.length > 0, what: [...busy, ...loadingText].slice(0, 3).map(sig), silent };
}

// ---------------------------------------------------------------------------------------------
// In the page: a snapshot of where text and controls sit, for the two-picture shift comparison.
export function snapshotPositions() {
  const out = {};
  const els = document.querySelectorAll('h1, h2, h3, p, li, button, a[href], input, label, [role="button"], img');
  let i = 0;
  for (const el of els) {
    if (i > 600) break;
    if (!el.checkVisibility || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    if (el.closest('[aria-live], [role="timer"], [role="status"], .vmx-toast, [class*="marquee"], [class*="ticker"]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    // Position fixed things move with nothing; measure the rest in page coordinates.
    let fixed = false;
    for (let p = el; p && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p).position; if (s === 'fixed' || s === 'sticky') { fixed = true; break; } }
    const key = `${el.tagName}|${(el.innerText || el.getAttribute('alt') || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40)}|${el.className && typeof el.className === 'string' ? el.className : ''}`;
    if (out[key]) { out[key].dup = true; continue; }
    out[key] = { x: Math.round(r.left + (fixed ? 0 : scrollX)), y: Math.round(r.top + (fixed ? 0 : scrollY)), w: Math.round(r.width), h: Math.round(r.height), fixed };
    i += 1;
  }
  return out;
}

export function comparePositions(a, b) {
  const moved = [];
  for (const [key, p] of Object.entries(a)) {
    const q = b[key];
    if (!q || p.dup || q.dup) continue;
    const move = Math.max(Math.abs(p.x - q.x), Math.abs(p.y - q.y));
    if (move > 8) moved.push({ key, move, from: p, to: q });
  }
  return moved;
}

// ---------------------------------------------------------------------------------------------
// In the page: the static detectors. Returns findings with element descriptions and page rects.
export function scanPage({ touch }) {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const out = [];
  const styles = new Map();
  const style = (el) => { let s = styles.get(el); if (!s) { s = getComputedStyle(el); styles.set(el, s); } return s; };
  const clsOf = (el) => (typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '');
  const sig = (el) => {
    const cls = clsOf(el).trim().split(/\s+/).filter((c) => c && !/\d{3,}/.test(c)).slice(0, 3).join('.');
    const role = el.getAttribute('role');
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}${role ? `[role=${role}]` : ''}`;
  };
  const textOf = (el) => (el.innerText || el.getAttribute('aria-label') || el.getAttribute('alt') || el.value || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const pageRect = (r) => ({ x: Math.round(r.l + scrollX), y: Math.round(r.t + scrollY), w: Math.round(r.r - r.l), h: Math.round(r.b - r.t) });
  const box = (r) => ({ l: r.left, t: r.top, r: r.right, b: r.bottom });
  const meet = (a, b) => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
  const empty = (r) => r.r - r.l < 1 || r.b - r.t < 1;
  const INF = { l: -1e9, t: -1e9, r: 1e9, b: 1e9 };
  const describe = (el, r) => ({ sig: sig(el), text: textOf(el), rect: pageRect(r || box(el.getBoundingClientRect())) });
  const shown = (el) => {
    if (!el.checkVisibility || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 2 && r.height >= 2;
  };

  // The region an element can be seen through: every ancestor's non-visible overflow (all), and only
  // hidden or clip overflow (hard: what no scrolling reveals).
  const childClip = new Map();
  const clipOf = (el) => {
    if (style(el).position === 'fixed') return { all: INF, hard: INF };
    return clipForChildren(el.parentElement);
  };
  function clipForChildren(p) {
    if (!p || p === document.documentElement || p === document.body) return { all: INF, hard: INF };
    let c = childClip.get(p);
    if (c) return c;
    const base = clipOf(p);
    const s = style(p);
    let all = base.all; let hard = base.hard;
    const r = box(p.getBoundingClientRect());
    if (s.overflowX !== 'visible') { all = { ...all, l: Math.max(all.l, r.l), r: Math.min(all.r, r.r) }; }
    if (s.overflowY !== 'visible') { all = { ...all, t: Math.max(all.t, r.t), b: Math.min(all.b, r.b) }; }
    if (s.overflowX === 'hidden' || s.overflowX === 'clip') hard = { ...hard, l: Math.max(hard.l, r.l), r: Math.min(hard.r, r.r) };
    if (s.overflowY === 'hidden' || s.overflowY === 'clip') hard = { ...hard, t: Math.max(hard.t, r.t), b: Math.min(hard.b, r.b) };
    c = { all, hard };
    childClip.set(p, c);
    return c;
  }
  const fixedMemo = new Map();
  const inFixed = (el) => {
    if (!el || el === document.body || el === document.documentElement) return false;
    if (fixedMemo.has(el)) return fixedMemo.get(el);
    const pos = style(el).position;
    const v = pos === 'fixed' || pos === 'sticky' ? el : inFixed(el.parentElement);
    fixedMemo.set(el, v);
    return v;
  };

  // --- what holds text: one entry per element, with the boxes of its own lines
  const texts = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|TITLE|OPTION)$/.test(el.tagName)) continue;
    let entry = texts.get(el);
    if (entry === null) continue;
    if (!entry) {
      if (!shown(el)) { texts.set(el, null); continue; }
      entry = { el, lines: [], text: '' };
      texts.set(el, entry);
    }
    range.selectNodeContents(n);
    // Text is seen through its ancestors' overflow and its own (an ellipsis line's range runs on past
    // the box that cuts it).
    let clip = clipOf(el).all;
    const own = style(el);
    if (own.overflowX !== 'visible' || own.overflowY !== 'visible') {
      const r = box(el.getBoundingClientRect());
      if (own.overflowX !== 'visible') clip = { ...clip, l: Math.max(clip.l, r.l), r: Math.min(clip.r, r.r) };
      if (own.overflowY !== 'visible') clip = { ...clip, t: Math.max(clip.t, r.t), b: Math.min(clip.b, r.b) };
    }
    for (const r of range.getClientRects()) {
      const b = box(r);
      const v = meet(b, clip);
      if (!empty(v) && r.width > 1) entry.lines.push({ ...v, raw: b });
    }
    entry.text += n.textContent;
  }
  // With a modal open, the page behind it is covered: only the modal (and what sits above it) is read.
  const modals = [...document.querySelectorAll('[aria-modal="true"], dialog[open]')].filter((d) => shown(d));
  const modal = modals[modals.length - 1] || null;
  const inScope = (el) => !modal || modal.contains(el) || !!(inFixed(el) && !inFixed(el).contains(modal) && style(inFixed(el)).zIndex !== 'auto' && Number(style(inFixed(el)).zIndex) > Number(style(modal).zIndex || 0));
  const textItems = [...texts.values()].filter((e) => e && e.lines.length && inScope(e.el));

  const CONTROL = 'button, a[href], input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="menuitem"], [role="option"], [contenteditable="true"]';
  const controls = [...document.querySelectorAll(CONTROL)].filter((el) => shown(el) && !el.closest('[inert]') && inScope(el))
    .map((el) => { const raw = box(el.getBoundingClientRect()); const v = meet(raw, clipOf(el).all); return { el, raw, v }; })
    .filter((c) => !empty(c.v));
  // Pictures: images, drawings, and boxes painted with a picture (a mascot drawn by the motion kit).
  const painted = [...document.querySelectorAll('body *')].filter((el) => el.children.length === 0 && !el.textContent.trim()
    && /url\(/.test(style(el).backgroundImage || ''));
  const media = [...document.querySelectorAll('img, svg, canvas, video'), ...painted]
    .filter((el) => !(el.tagName.toLowerCase() === 'svg' && el.parentElement && el.parentElement.closest('svg')) && shown(el) && inScope(el))
    .map((el) => { const raw = box(el.getBoundingClientRect()); return { el, raw, v: meet(raw, clipOf(el).all) }; })
    .filter((m) => !empty(m.v) && m.v.r - m.v.l >= 12 && m.v.b - m.v.t >= 12);

  // Where a line's letters are drawn: the font box less the space above and below the ink, measured
  // with the same font on a canvas. Two stacked lines with tight line height share font box but not
  // ink (a big number over its unit), and that is not a fault; letters drawn over letters is.
  function inkLines(t) {
    const s = style(t.el);
    const ctx = (window.__vmxCanvas ||= document.createElement('canvas').getContext('2d'));
    ctx.font = s.font || `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const m = ctx.measureText(t.text.trim().slice(0, 200) || 'x');
    const topGap = Math.max(0, m.fontBoundingBoxAscent - m.actualBoundingBoxAscent);
    const bottomGap = Math.max(0, m.fontBoundingBoxDescent - m.actualBoundingBoxDescent);
    return t.lines.map((l) => {
      const h = l.raw.b - l.raw.t;
      if (!(topGap + bottomGap < h)) return l;
      return { ...l, t: Math.max(l.t, l.raw.t + topGap), b: Math.min(l.b, l.raw.b - bottomGap) };
    }).filter((l) => l.b - l.t > 1);
  }

  // --- overlap: text and controls, then pictures drawn over text
  const items = [
    ...textItems.map((t) => ({ el: t.el, rects: inkLines(t), kind: 'text' })),
    ...controls.map((c) => ({ el: c.el, rects: [c.v], kind: 'control' })),
  ];
  const flat = [];
  items.forEach((it, i) => it.rects.forEach((r) => flat.push({ i, r })));
  flat.sort((a, b) => a.r.t - b.r.t);
  const seenPair = new Set();
  const crosses = (a, b) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > 2 && Math.min(a.b, b.b) - Math.max(a.t, b.t) > 2;
  for (let x = 0; x < flat.length; x += 1) {
    const A = flat[x];
    for (let y = x + 1; y < flat.length && flat[y].r.t < A.r.b; y += 1) {
      const B = flat[y];
      if (A.i === B.i) continue;
      const key = A.i < B.i ? `${A.i}|${B.i}` : `${B.i}|${A.i}`;
      if (seenPair.has(key)) continue;
      if (!crosses(A.r, B.r)) continue;
      const ea = items[A.i].el; const eb = items[B.i].el;
      if (ea.contains(eb) || eb.contains(ea)) { seenPair.add(key); continue; }
      // A control and the text of its own label.
      if ((ea.closest('label') && ea.closest('label') === eb.closest('label'))) { seenPair.add(key); continue; }
      if (!!inFixed(ea) !== !!inFixed(eb)) { seenPair.add(key); continue; }
      seenPair.add(key);
      const m = meet(A.r, B.r);
      out.push({ detector: 'overlap', detail: `${items[A.i].kind} over ${items[B.i].kind} by ${Math.round(m.r - m.l)}x${Math.round(m.b - m.t)} px`,
        a: describe(ea, A.r), b: describe(eb, B.r) });
    }
  }
  for (const m of media) {
    for (const t of textItems) {
      if (m.el.contains(t.el) || t.el.contains(m.el)) continue;
      if (!!inFixed(m.el) !== !!inFixed(t.el)) continue;
      const hit = t.lines.find((r) => crosses(r, m.v));
      if (!hit) continue;
      const c = meet(hit, m.v);
      const cx = (c.l + c.r) / 2; const cy = (c.t + c.b) / 2;
      if (cx < 0 || cy < 0 || cx > vw || cy > vh) continue;
      const top = document.elementFromPoint(cx, cy);
      if (!top || !(m.el === top || m.el.contains(top))) continue; // the text is drawn over the picture: a caption
      out.push({ detector: 'overlap', detail: `picture drawn over text by ${Math.round(c.r - c.l)}x${Math.round(c.b - c.t)} px`, a: describe(m.el, m.v), b: describe(t.el, hit) });
    }
  }

  // --- overflow-x
  const root = document.documentElement;
  const pageOver = Math.max(root.scrollWidth, document.body.scrollWidth) - root.clientWidth;
  if (pageOver > 1) {
    const culprits = [];
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.right <= vw + 1 || r.width < 2) continue;
      if (clipOf(el).all.r < r.right - 1) continue;
      if (el.parentElement && culprits.includes(el.parentElement)) continue;
      if (!shown(el)) continue;
      culprits.push(el);
      if (culprits.length >= 3) break;
    }
    out.push({ detector: 'overflow-x', detail: `page ${pageOver}px wider than the view`, a: culprits[0] ? describe(culprits[0]) : { sig: 'html', text: '', rect: { x: 0, y: 0, w: vw, h: vh } },
      b: culprits[1] ? describe(culprits[1]) : undefined });
  }
  for (const el of document.body.querySelectorAll('*')) {
    const s = style(el);
    if (!/(auto|scroll)/.test(s.overflowX) || !/(auto|scroll)/.test(s.overflowY)) continue;
    if (el.scrollWidth <= el.clientWidth + 1 || el.clientWidth < 50 || !shown(el)) continue;
    // A browser computes overflow-y auto for any box whose overflow-x is not visible, so a sideways
    // row of chips reads as both: only a box that really scrolls up and down is judged here.
    if (el.scrollHeight <= el.clientHeight + 1) continue;
    if (el.matches('pre, code, table, [role="grid"], textarea')) continue;
    out.push({ detector: 'overflow-x', detail: `a scroller for up and down also scrolls ${el.scrollWidth - el.clientWidth}px sideways`, a: describe(el) });
  }

  // --- clipped
  const THAI_MARKS = /[ัิ-ฺ็-๎]/;
  for (const t of textItems) {
    const el = t.el;
    const s = style(el);
    const ellipsis = s.textOverflow === 'ellipsis';
    const clamp = s.webkitLineClamp && s.webkitLineClamp !== 'none';
    if ((s.overflowX === 'hidden' || s.overflowX === 'clip') && el.scrollWidth > el.clientWidth + 1 && !ellipsis && el.clientWidth > 0) {
      out.push({ detector: 'clipped', detail: `text cut sideways by its own box (${el.scrollWidth} in ${el.clientWidth} px)`, a: describe(el) });
      continue;
    }
    if ((s.overflowY === 'hidden' || s.overflowY === 'clip') && el.scrollHeight > el.clientHeight + 2 && !clamp && el.clientHeight > 0) {
      out.push({ detector: 'clipped', detail: `text cut at the bottom by its own box (${el.scrollHeight} in ${el.clientHeight} px)`, a: describe(el) });
      continue;
    }
    // Cut by an ancestor's hidden overflow: a line partly inside, partly outside.
    const hard = clipOf(el).hard;
    const cut = t.lines.find((l) => {
      const r = l.raw;
      const inside = meet(r, hard);
      if (empty(inside)) return false;
      const lostY = (r.b - r.t) - (inside.b - inside.t);
      const lostX = (r.r - r.l) - (inside.r - inside.l);
      return lostY > 2 || (lostX > 2 && !ellipsis);
    });
    if (cut) {
      let anc = el.parentElement;
      while (anc && anc !== document.body) { const a = style(anc); if (a.textOverflow === 'ellipsis' || (a.webkitLineClamp && a.webkitLineClamp !== 'none')) break; anc = anc.parentElement; }
      if (!anc || anc === document.body) {
        out.push({ detector: 'clipped', detail: 'a line of text cut by a box around it', a: describe(el, cut.raw) });
        continue;
      }
    }
    // Thai marks above or below the line: where the ink of the text reaches (measured with the same
    // font on a canvas) against the box that clips it, the element's own hidden overflow included.
    if (THAI_MARKS.test(t.text)) {
      let clipBox = hard;
      if (s.overflowY === 'hidden' || s.overflowY === 'clip' || clamp) {
        const own = box(el.getBoundingClientRect());
        clipBox = { ...clipBox, t: Math.max(clipBox.t, own.t), b: Math.min(clipBox.b, own.b) };
      }
      if (clipBox.t > -1e8 || clipBox.b < 1e8) {
        const ctx = (window.__vmxCanvas ||= document.createElement('canvas').getContext('2d'));
        ctx.font = s.font || `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
        const mt = ctx.measureText(t.text.trim().slice(0, 200));
        const above = mt.actualBoundingBoxAscent - mt.fontBoundingBoxAscent;
        const below = mt.actualBoundingBoxDescent - mt.fontBoundingBoxDescent;
        const line = t.lines.find((l) => {
          const r = l.raw;
          const inkTop = r.t - Math.max(0, above);
          const inkBottom = r.b + Math.max(0, below);
          // More than 2 px of ink past the box: at 2 px the marks were read whole at three times the size.
          return inkTop < clipBox.t - 2 && r.t >= clipBox.t - 1 ? true : inkBottom > clipBox.b + 2 && r.b <= clipBox.b + 1;
        });
        if (line) out.push({ detector: 'clipped', detail: `Thai marks cut by the line box (ink ${Math.round(Math.max(above, below))} px past the font box, past the clipping edge)`, a: describe(el, line.raw) });
      }
    }
  }

  // --- off-screen, sideways
  for (const it of [...textItems.map((t) => ({ el: t.el, v: t.lines.reduce((a, l) => ({ l: Math.min(a.l, l.l), t: Math.min(a.t, l.t), r: Math.max(a.r, l.r), b: Math.max(a.b, l.b) }), { l: 1e9, t: 1e9, r: -1e9, b: -1e9 }) })), ...controls]) {
    const v = it.v;
    if (v.r <= 0 || v.l >= vw) continue; // moved away on purpose (a skip link until focused)
    if (v.l < -1 || v.r > vw + 1) {
      if (controls.includes(it) || !it.el.closest(CONTROL)) out.push({ detector: 'off-screen', detail: `${Math.round(v.l < -1 ? -v.l : v.r - vw)} px past the ${v.l < -1 ? 'left' : 'right'} edge`, a: describe(it.el, v) });
    }
  }

  // --- target sizes and spacing on touch sizes
  if (touch) {
    const targets = controls.filter((c) => {
      const el = c.el;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
      if (el.matches('a') && style(el).display === 'inline') {
        const p = el.parentElement;
        if (p && [...p.childNodes].some((n) => n !== el && n.nodeType === 3 && n.textContent.trim())) return false; // a link inside a sentence
      }
      if (el.matches('input[type="checkbox"], input[type="radio"]') && el.closest('label')) return false; // the label is the target
      return true;
    });
    for (const c of targets) {
      const w = c.raw.r - c.raw.l; const h = c.raw.b - c.raw.t;
      if (w < 44 || h < 44) out.push({ detector: 'target', detail: `${Math.round(w)}x${Math.round(h)} px, under 44`, a: describe(c.el, c.raw) });
    }
    const sorted = [...targets].sort((a, b) => a.raw.t - b.raw.t);
    for (let x = 0; x < sorted.length; x += 1) {
      const A = sorted[x];
      for (let y = x + 1; y < sorted.length && sorted[y].raw.t < A.raw.b + 8; y += 1) {
        const B = sorted[y];
        if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        const dx = Math.max(A.raw.l, B.raw.l) - Math.min(A.raw.r, B.raw.r);
        const dy = Math.max(A.raw.t, B.raw.t) - Math.min(A.raw.b, B.raw.b);
        // Side by side (their spans meet on the other axis) and closer than 8 px, but not crossing.
        const close = (dx >= 0 && dx < 8 && dy < 0) || (dy >= 0 && dy < 8 && dx < 0);
        if (!close) continue;
        // Two targets that are each 44 px or more both ways cannot be mistaken for each other by a
        // finger (a tab bar's items touch on purpose); spacing is judged where one of them is small.
        const big = (c) => c.raw.r - c.raw.l >= 44 && c.raw.b - c.raw.t >= 44;
        if (big(A) && big(B)) continue;
        out.push({ detector: 'target', detail: `two controls ${Math.round(Math.max(dx, dy))} px apart, under 8`, a: describe(A.el, A.raw), b: describe(B.el, B.raw) });
      }
    }
  }

  // --- raw text
  const RAW = [
    [/\[object Object\]/, '[object Object]'],
    [/Invalid Date/, 'Invalid Date'],
    [/(?<![\w.-])(?:undefined|NaN)(?![\w-])/, 'undefined or NaN'],
    [/(?<![\w.-])null(?![\w-])(?! hypothesis| allele| mutation| cell)/i, 'null'],
    [/\{\{?\s*[A-Za-z_][\w.]*\s*\}\}?/, 'an unfilled {placeholder}'],
    [/(?<![\w/.@-])[a-z][a-zA-Z]+(?:\.[a-z][a-zA-Z0-9]+)*\.(?:[a-z]+[A-Z][A-Za-z0-9]*|[a-z]+_[a-z_]+)(?![\w/.@-])/, 'a translation key'],
  ];
  for (const t of textItems) {
    const s = t.text.replace(/\s+/g, ' ');
    for (const [re, what] of RAW) {
      const m = re.exec(s);
      if (m) { out.push({ detector: 'raw', detail: `${what}: "${s.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).trim()}"`, a: describe(t.el, t.lines[0]) }); break; }
    }
  }
  // A unit word whose number is missing ("ทั้งหมด  ข้อ", "N ข้อ"), read over a block's whole text.
  const UNIT = /(^|[\s(:])(N|[^\s\d๐-๙(]+)?\s+(ข้อ|นาที|ชั่วโมง|วัน|คน|ครั้ง|หัวข้อ|ชุด|คะแนน|หน้า)(?=$|[\s),.])/;
  for (const el of new Set(textItems.map((t) => t.el.closest('p, li, h1, h2, h3, h4, button, span, div') || t.el))) {
    const s = (el.innerText || '').replace(/\s+/g, ' ');
    if (s.length > 200) continue;
    const m = UNIT.exec(s);
    if (!m) continue;
    const prev = m[2] || '';
    if (prev && prev !== 'N') continue; // a Thai word before the unit reads as the unit's own phrase; only a bare N or nothing is left
    out.push({ detector: 'raw', detail: `a unit with no number: "${s.slice(Math.max(0, m.index - 20), m.index + m[0].length + 10).trim()}"`, a: describe(el) });
  }
  return out.slice(0, 400);
}

// ---------------------------------------------------------------------------------------------
// In the page: text under a fixed bar at the top or the bottom that no scrolling frees.
export async function scanUnderBars() {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const out = [];
  const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const shown = (el) => el.checkVisibility && el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && el.getBoundingClientRect().width > 1;
  const sig = (el) => {
    const cls = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).filter((c) => c && !/\d{3,}/.test(c)).slice(0, 3).join('.');
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
  };
  const textOf = (el) => (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const bars = () => [...document.querySelectorAll('body *')].filter((el) => {
    const s = getComputedStyle(el);
    if (s.position !== 'fixed' && s.position !== 'sticky') return false;
    if (!shown(el)) return false;
    const r = el.getBoundingClientRect();
    return r.width > vw * 0.5 && r.height < vh * 0.4 && r.height > 20 && (r.bottom >= vh - 4 || r.top <= 4);
  }).filter((el, _, all) => !all.some((o) => o !== el && o.contains(el)));
  const scrollers = [document.scrollingElement, ...[...document.querySelectorAll('body *')].filter((el) => {
    const s = getComputedStyle(el);
    return /(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > vh * 0.5;
  })];
  const candidates = () => [...document.querySelectorAll('button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], h1, h2, h3, p, li')].filter(shown);
  const check = (edge) => {
    for (const bar of bars()) {
      const br = bar.getBoundingClientRect();
      const isBottom = br.bottom >= vh - 4 && br.top > vh / 2;
      if ((edge === 'bottom') !== isBottom) continue;
      for (const el of candidates()) {
        if (bar.contains(el) || el.contains(bar)) continue;
        let fixedSelf = false;
        for (let p = el; p && p !== document.body; p = p.parentElement) { const ps = getComputedStyle(p).position; if (ps === 'fixed') { fixedSelf = p; break; } }
        if (fixedSelf && fixedSelf.contains(bar)) continue;
        const r = el.getBoundingClientRect();
        if (r.right <= 0 || r.left >= vw) continue;
        const iy = Math.min(r.bottom, br.bottom) - Math.max(r.top, br.top);
        const ix = Math.min(r.right, br.right) - Math.max(r.left, br.left);
        if (iy <= 4 || ix <= 4) continue;
        const cx = (Math.max(r.left, br.left) + Math.min(r.right, br.right)) / 2;
        const cy = (Math.max(r.top, br.top) + Math.min(r.bottom, br.bottom)) / 2;
        const top = document.elementFromPoint(Math.min(vw - 1, Math.max(0, cx)), Math.min(vh - 1, Math.max(0, cy)));
        if (!top || !bar.contains(top)) continue; // the bar is not drawn over it here
        out.push({ detector: 'off-screen', detail: `${Math.round(iy)} px under a fixed bar at the ${edge} with no scroll left to free it`,
          a: { sig: sig(el), text: textOf(el), rect: { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) } },
          b: { sig: sig(bar), text: textOf(bar).slice(0, 30), rect: { x: Math.round(br.left), y: Math.round(br.top + scrollY), w: Math.round(br.width), h: Math.round(br.height) } } });
      }
    }
  };
  for (const s of scrollers) s.scrollTop = 0;
  await frame();
  check('top');
  for (const s of scrollers) s.scrollTop = s.scrollHeight;
  await frame();
  await new Promise((r) => setTimeout(r, 250));
  check('bottom');
  for (const s of scrollers) s.scrollTop = 0;
  await frame();
  const seen = new Set();
  return out.filter((f) => { const k = `${f.a.sig}|${f.a.text}`; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 40);
}

// ---------------------------------------------------------------------------------------------
// In the page: text contrast against what is really behind it, read through the view a screen at a
// time (elementsFromPoint gives the stack that is painted at that point).
export async function scanContrast({ maxScreens = 6 } = {}) {
  const vh = window.innerHeight;
  const vw = document.documentElement.clientWidth;
  const out = []; let measured = 0; let unsure = 0;
  const done = new Set();
  const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const parse = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || '');
    if (!m) {
      const o = /color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/.exec(c || '');
      if (o) return [o[1] * 255, o[2] * 255, o[3] * 255, o[4] === undefined ? 1 : +o[4]];
      return null;
    }
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const over = (top, under) => { const a = top[3]; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };
  const opacityOf = (el) => { let o = 1; for (let p = el; p && p.nodeType === 1; p = p.parentElement) o *= parseFloat(getComputedStyle(p).opacity || '1'); return o; };
  const sig = (el) => {
    const cls = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).filter((c) => c && !/\d{3,}/.test(c)).slice(0, 3).join('.');
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
  };
  const canvasBg = () => {
    const h = parse(getComputedStyle(document.documentElement).backgroundColor);
    if (h && h[3] > 0) return [h[0], h[1], h[2], 1];
    const b = parse(getComputedStyle(document.body).backgroundColor);
    if (b && b[3] > 0) return [b[0], b[1], b[2], 1];
    return [255, 255, 255, 1];
  };
  const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  const steps = Math.min(maxScreens, Math.ceil(height / vh));
  for (let step = 0; step < steps; step += 1) {
    window.scrollTo(0, step * vh);
    await frame();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!el || done.has(el) || !n.textContent.trim() || /^(SCRIPT|STYLE|NOSCRIPT|OPTION|TITLE)$/.test(el.tagName)) continue;
      if (!el.checkVisibility || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
      range.selectNodeContents(n);
      const rect = [...range.getClientRects()].find((r) => r.width > 2 && r.height > 2 && r.top >= 0 && r.bottom <= vh && r.left >= 0 && r.right <= vw);
      if (!rect) continue;
      done.add(el);
      if (el.closest('[disabled], [aria-disabled="true"], [aria-hidden="true"], [inert]')) continue;
      const s = getComputedStyle(el);
      const fg = parse(s.color);
      if (!fg || s.webkitTextFillColor === 'transparent' || s.color === 'transparent' || (s.backgroundClip || '').includes('text')) { unsure += 1; continue; }
      const x = rect.left + Math.min(rect.width / 2, 6); const y = rect.top + rect.height / 2;
      const stack = document.elementsFromPoint(x, y);
      const at = stack.findIndex((e) => e === el || el.contains(e));
      if (at < 0) { unsure += 1; continue; } // something else is painted over it here
      if (stack.slice(0, at).some((e) => !el.contains(e) && !e.contains(el))) { unsure += 1; continue; }
      const layers = []; let solid = false; let doubt = false;
      for (const e of stack.slice(at)) {
        const es = getComputedStyle(e);
        if (es.backgroundImage && es.backgroundImage !== 'none') { doubt = true; break; }
        if (e !== el && /^(IMG|VIDEO|CANVAS|PICTURE)$/.test(e.tagName)) { doubt = true; break; }
        if (es.filter !== 'none' || es.mixBlendMode !== 'normal') { doubt = true; break; }
        const bg = parse(es.backgroundColor);
        if (bg && bg[3] > 0) {
          const a = bg[3] * opacityOf(e);
          layers.push([bg[0], bg[1], bg[2], a]);
          if (a >= 0.999) { solid = true; break; }
        }
      }
      if (doubt) { unsure += 1; continue; }
      let back = solid ? [0, 0, 0, 1] : canvasBg();
      for (const l of layers.reverse()) back = over(l, back);
      const front = over([fg[0], fg[1], fg[2], fg[3] * opacityOf(el)], back);
      const L1 = lum(front); const L2 = lum(back);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const size = parseFloat(s.fontSize); const weight = parseInt(s.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      measured += 1;
      const need = large ? 3 : 4.5;
      if (ratio < need - 0.05) {
        const hex = (c) => `#${c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
        out.push({ detector: 'contrast', detail: `${ratio.toFixed(2)}:1, needs ${need}:1 (${hex(front)} on ${hex(back)}, ${Math.round(size)}px${large ? ' large' : ''})`,
          a: { sig: sig(el), text: (n.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60), rect: { x: Math.round(rect.left), y: Math.round(rect.top + scrollY), w: Math.round(rect.width), h: Math.round(rect.height) } } });
      }
    }
  }
  window.scrollTo(0, 0);
  await frame();
  return { findings: out.slice(0, 120), measured, unsure };
}

// ---------------------------------------------------------------------------------------------
// In the page: the controls the dead-control probe will press, with a stable index.
export function listControls({ max = 40, chrome = false }) {
  const vw = document.documentElement.clientWidth;
  const sig = (el) => {
    const cls = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).filter((c) => c && !/\d{3,}/.test(c)).slice(0, 3).join('.');
    return `${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
  };
  const els = [...document.querySelectorAll('button, a[href], [role="button"], [role="tab"], summary, [role="switch"], [role="checkbox"]')]
    .filter((el) => el.checkVisibility && el.checkVisibility({ opacityProperty: true, visibilityProperty: true }))
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.right > 0 && r.left < vw; })
    .filter((el) => !el.disabled && el.getAttribute('aria-disabled') !== 'true' && !el.closest('[inert]'))
    // The screen's own controls; the header, the rail and the bottom bar are the same on every screen
    // and are pressed on one screen only (chrome). A skip link moves focus for a keyboard and is left out.
    .filter((el) => !el.matches('.vmx-skip-link') && (chrome ? !el.closest('#main') : !!el.closest('#main, .lp-root')));
  return els.slice(0, max).map((el, i) => {
    el.setAttribute('data-vmx-probe', String(i));
    const r = el.getBoundingClientRect();
    return { i, sig: sig(el), text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim().slice(0, 50),
      href: el.getAttribute('href'), target: el.getAttribute('target'), download: el.hasAttribute('download'), type: el.getAttribute('type'),
      rect: { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) } };
  });
}

// In the page: start watching for anything a press could change.
export function armWatch() {
  const w = { mutations: 0, targets: [], url: location.href, focus: document.activeElement, dialogs: document.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog[open]').length };
  const quiet = window.__vmxNoisy || new Set();
  const mo = new MutationObserver((list) => {
    for (const m of list) {
      const t = m.target.nodeType === 1 ? m.target : m.target.parentElement;
      if (!t || [...quiet].some((q) => q.contains(t))) continue;
      if (m.type === 'attributes' && m.attributeName === 'data-vmx-probe') continue;
      w.mutations += 1;
    }
  });
  mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
  w.stop = () => mo.disconnect();
  window.__vmxWatch = w;
}

// In the page: learn which parts change on their own (a clock), so a press is not credited for them.
export async function learnNoise(ms = 900) {
  const noisy = new Set();
  const mo = new MutationObserver((list) => { for (const m of list) { const t = m.target.nodeType === 1 ? m.target : m.target.parentElement; if (t) noisy.add(t.parentElement || t); } });
  mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
  await new Promise((r) => setTimeout(r, ms));
  mo.disconnect();
  window.__vmxNoisy = noisy;
  return noisy.size;
}

export function readWatch() {
  const w = window.__vmxWatch;
  if (!w) return null;
  w.stop();
  const dialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog[open]').length;
  return { mutations: w.mutations, urlChanged: location.href !== w.url, focusMoved: document.activeElement !== w.focus && document.activeElement !== document.body, dialogOpened: dialogs > w.dialogs };
}

// In the page: the open dialog's facts for the focus detector.
export function readDialog() {
  const all = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog[open], [aria-modal="true"]')]
    .filter((d) => d.checkVisibility && d.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && d.getBoundingClientRect().width > 10);
  const d = all[all.length - 1];
  if (!d) return null;
  const a = document.activeElement;
  const cls = (typeof d.className === 'string' ? d.className : '').trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.');
  const r = d.getBoundingClientRect();
  return { sig: `${d.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`, label: (d.getAttribute('aria-label') || d.querySelector('h1,h2,h3')?.textContent || '').trim().slice(0, 50),
    focusInside: !!a && d.contains(a), rect: { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) } };
}

// ---------------------------------------------------------------------------------------------
// Node side: the place a finding is written, and its picture.
export const OUT_DIR = process.env.VMX_DEFECT_OUT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../work/defect-sweep');

export const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 10);

// The fault key: the same detector on the same kind of element, whatever the text or the route.
export function signature(f) {
  const strip = (s) => (s || '').replace(/\[role=[^\]]+\]/, '');
  return `${f.detector}|${strip(f.a?.sig)}|${strip(f.b?.sig)}|${f.detector === 'console' || f.detector === 'raw' ? (f.detail || '').replace(/\d+/g, 'N').replace(/"[^"]*"/g, '"…"').slice(0, 80) : ''}`;
}

// Keeps at most three pictures for one fault at one size, so the folder stays small.
export async function picture(page, f, { size, scheme, state, route }) {
  const dir = path.join(OUT_DIR, 'shots');
  mkdirSync(dir, { recursive: true });
  const key = hash(signature(f));
  let name = null;
  for (let n = 0; n < 3; n += 1) {
    const candidate = `${key}-${size}-${scheme}-${n}.jpg`;
    if (!existsSync(path.join(dir, candidate))) { name = candidate; break; }
  }
  if (!name) return `${key}-${size}-${scheme}-0.jpg`;
  const rects = [f.a?.rect, f.b?.rect].filter(Boolean);
  if (!rects.length) return null;
  const dims = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) })).catch(() => null);
  if (!dims) return null;
  const pad = 32;
  const x0 = Math.max(0, Math.min(...rects.map((r) => r.x)) - pad);
  const y0 = Math.max(0, Math.min(...rects.map((r) => r.y)) - pad);
  const x1 = Math.min(dims.w, Math.max(...rects.map((r) => r.x + r.w)) + pad);
  const y1 = Math.min(dims.h, Math.max(...rects.map((r) => r.y + r.h)) + pad, y0 + 900);
  if (x1 - x0 < 4 || y1 - y0 < 4) return null;
  // A picture of the view, scrolled to the finding when it lies below the first screen: a full-page
  // capture of a long page took seconds each and made the sweep three times slower.
  const vp = page.viewportSize() || { width: x1, height: 800 };
  try {
    writeFileSync(path.join(dir, name), '');
    let top = 0;
    if (y1 > vp.height) {
      top = await page.evaluate((y) => { window.scrollTo(0, y); return window.scrollY; }, Math.max(0, y0 - 40));
    }
    const cy = Math.max(0, y0 - top);
    const ch = Math.min(y1 - y0, vp.height - cy);
    const cw = Math.min(x1, vp.width) - Math.min(x0, vp.width - 4);
    if (ch >= 4 && cw >= 4) {
      await page.screenshot({ path: path.join(dir, name), type: 'jpeg', quality: 60, clip: { x: Math.min(x0, vp.width - 4), y: cy, width: cw, height: ch }, animations: 'disabled', timeout: 8_000 });
    }
    if (top) await page.evaluate(() => window.scrollTo(0, 0));
    void route; void state;
    return ch >= 4 && cw >= 4 ? name : null;
  } catch {
    return null;
  }
}

export function writeFindings(testId, findings) {
  const dir = path.join(OUT_DIR, 'raw');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, `${hash(testId)}.json`), `${JSON.stringify({ testId, findings })}\n`);
}

// The allow list: { detector, a?, b?, text?, route?, reason }. a and b are patterns over the elements'
// signatures (tag.class), text over the finding's text or detail. A finding it matches is kept in
// findings.json with `allowed` set to the reason and is not counted.
export function allowedBy(allow, f) {
  return allow.find((x) => x.detector === f.detector
    && (!x.a || x.a.test(f.a?.sig || '') || (x.either && x.a.test(f.b?.sig || '')))
    && (!x.b || x.b.test(f.b?.sig || '') || (x.either && x.b.test(f.a?.sig || '')))
    && (!x.text || x.text.test(`${f.detail} ${f.a?.text || ''} ${f.b?.text || ''}`))
    && (!x.route || x.route.test(f.route || ''))
    && (!x.state || x.state === f.state));
}
