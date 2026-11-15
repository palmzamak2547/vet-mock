// The counting half of lint:motion (scripts/lint-motion.mjs). Pure: text in, counts out.
//
// What it counts, per file, is everything the motion family (src/lib/motion/springs.js) rules out:
//
//   layout-transition  a transition on `all`, on a bare duration (which means all), or on a
//                      property that lays the page out again (width, height, top, left, margin,
//                      padding, gap, font-size ...): every frame of it re-runs layout.
//   paint-keyframes    an @keyframes that moves a layout property, `background-position` or a
//                      custom property: it repaints or re-lays out every frame. Transform and
//                      opacity are what the compositor moves for free.
//   no-reduced-rule    an animation in use that no reduced-motion rule of its own names. A rule
//                      on `*` does not count: it switches information off with decoration.
//   blanket-reduced    a reduced-motion rule on `*` that cuts animation or transition times.
//   infinite-loop      an animation that repeats forever.
//   easing-literal     a transition or animation whose timing is not a var(--token), including
//                      the ones that name none (the browser's `ease`).
//
// Sources: every stylesheet under src/, and the inline `transition:` and `animation:` strings of
// style objects in src/ scripts (src/data is content, not interface, and is skipped).

export const METRICS = Object.freeze(['layout-transition', 'paint-keyframes', 'no-reduced-rule', 'blanket-reduced', 'infinite-loop', 'easing-literal']);

const LAYOUT = new Set([
  'all', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'inline-size', 'block-size',
  'top', 'left', 'right', 'bottom', 'inset', 'inset-inline', 'inset-block',
  'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'margin-inline', 'margin-block',
  'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'padding-inline', 'padding-block',
  'gap', 'row-gap', 'column-gap', 'grid-template-rows', 'grid-template-columns', 'flex', 'flex-basis', 'flex-grow',
  'font-size', 'line-height', 'letter-spacing', 'border-width',
]);
const KEYWORD_EASINGS = new Set(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end']);

/** Split a declaration value at top-level commas. */
export function splitTop(value) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

/**
 * Parse CSS into style rules and @keyframes, with the at-rules each sits in.
 * Rules: { selector, context: string[], decls: [{ prop, value, line }], line }.
 * Keyframes: { name, body, line, context }.
 */
export function parseCss(text) {
  const rules = [];
  const keyframes = [];
  const stack = [];
  let i = 0;
  let line = 1;
  let buf = '';
  let bufLine = 1;
  const n = text.length;
  const pushDecl = (top, raw, at) => {
    const s = raw.trim();
    const k = s.indexOf(':');
    if (k < 0) return;
    const prop = s.slice(0, k).trim().toLowerCase();
    if (!/^-?-?[a-z][a-z0-9-]*$/.test(prop)) return;
    top.decls.push({ prop, value: s.slice(k + 1).trim(), line: at });
  };
  while (i < n) {
    const c = text[i];
    if (c === '/' && text[i + 1] === '*') {
      const j = text.indexOf('*/', i + 2);
      const end = j < 0 ? n : j + 2;
      line += (text.slice(i, end).match(/\n/g) || []).length;
      i = end;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && text[j] !== c) { if (text[j] === '\\') j++; j++; }
      buf += text.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    if (c === '{') {
      const prelude = buf.trim().replace(/\s+/g, ' ');
      const preludeLine = bufLine;
      const context = stack.filter((s) => s.prelude.startsWith('@')).map((s) => s.prelude);
      if (/^@(-webkit-)?keyframes\b/.test(prelude)) {
        let depth = 1;
        let j = i + 1;
        while (j < n && depth) { if (text[j] === '{') depth++; else if (text[j] === '}') depth--; j++; }
        keyframes.push({ name: prelude.replace(/^@(-webkit-)?keyframes\s+/, '').trim(), body: text.slice(i + 1, j - 1), line: preludeLine, context });
        line += (text.slice(i, j).match(/\n/g) || []).length;
        i = j;
        buf = '';
        bufLine = line;
        continue;
      }
      stack.push({ prelude, line: preludeLine, decls: [] });
      buf = '';
      bufLine = line;
      i++;
      continue;
    }
    if (c === '}') {
      const top = stack.pop();
      if (top) {
        if (buf.trim()) pushDecl(top, buf, bufLine);
        if (!top.prelude.startsWith('@')) {
          rules.push({ selector: top.prelude, context: stack.filter((s) => s.prelude.startsWith('@')).map((s) => s.prelude), decls: top.decls, line: top.line });
        }
      }
      buf = '';
      bufLine = line;
      i++;
      continue;
    }
    if (c === ';') {
      const top = stack[stack.length - 1];
      if (top) pushDecl(top, buf, bufLine);
      buf = '';
      bufLine = line;
      i++;
      continue;
    }
    if (c === '\n') line++;
    if (!buf.trim()) bufLine = line;
    buf += c;
    i++;
  }
  return { rules, keyframes };
}

/** The properties a keyframes body sets. */
export const keyframeProps = (body) => [...new Set([...body.matchAll(/(?:^|[;{\s])(-?-?[a-z][a-z0-9-]*)\s*:/g)].map((m) => m[1]))];

/** True when a keyframes body moves something the compositor cannot move alone. */
export const isPaintKeyframes = (props) => props.some((p) => LAYOUT.has(p) || p === 'background-position' || p.startsWith('--'));

/** The properties a `transition` value names; a part with only times means `all`. */
export function transitionProps(value) {
  return splitTop(value).map((part) => {
    const first = part.split(/\s+/)[0].toLowerCase();
    return /^[-\d.]|^var\(/.test(first) ? 'all' : first;
  });
}

/** Whether every part of a transition or animation value names its timing through a token. */
function easingLiterals(value, { isAnimation = false, knownNames = new Set() } = {}) {
  let count = 0;
  for (const part of splitTop(value)) {
    if (/^(none|initial|inherit|unset)$/i.test(part)) continue;
    const rest = part.replace(/var\(--[a-z0-9-]+\)/gi, (m) => (/ease|spring/i.test(m) ? ' TOKEN ' : ' VAR '));
    if (/TOKEN/.test(rest)) continue;
    const words = rest.split(/\s+/);
    const literal = /\b(cubic-bezier|linear|steps)\(/i.test(rest) || words.some((w) => KEYWORD_EASINGS.has(w.toLowerCase()));
    if (literal) { count++; continue; }
    // no timing named: the browser's `ease` (an animation that only names keyframes counts too)
    if (!isAnimation || words.some((w) => knownNames.has(w)) || /\d(m?s)\b/.test(rest)) count++;
  }
  return count;
}

const isReducedContext = (rule) => rule.context.some((c) => /prefers-reduced-motion\s*:\s*reduce/i.test(c))
  || /\[data-vmx-motion|\.vm-quiet\b/.test(rule.selector);
const isMotionAllowedContext = (rule) => rule.context.some((c) => /prefers-reduced-motion\s*:\s*no-preference/i.test(c));
const isBlanket = (rule) => /(^|,)\s*(:root(\[[^\]]*\])?\s+)?\*/.test(rule.selector)
  && rule.decls.some((d) => /^(animation|transition)/.test(d.prop));

/**
 * Count every metric for a set of files.
 * @param {{ css: Record<string,string>, scripts?: Record<string,string> }} sources path -> text
 * @returns {Record<string, Record<string, number>>} path -> metric -> count (zero metrics left out)
 */
export function countMotion({ css, scripts = {} }) {
  const parsed = Object.fromEntries(Object.entries(css).map(([f, t]) => [f, parseCss(t)]));
  const allRules = Object.values(parsed).flatMap((p) => p.rules);
  const names = new Set(Object.values(parsed).flatMap((p) => p.keyframes.map((k) => k.name)));
  const reduced = allRules.filter((r) => isReducedContext(r) && !isBlanket(r));
  const reducedText = reduced.map((r) => `${r.selector} { ${r.decls.map((d) => `${d.prop}: ${d.value}`).join('; ')} }`).join('\n');
  const reducedSelectors = reduced.flatMap((r) => r.selector.split(',').map((s) => s.trim()
    .replace(/^:root(\[[^\]]*\])?\s+/, '').replace(/^\.vm-quiet\s+/, ''))).filter((s) => s && !s.startsWith('*'));
  const hasOwnRule = (selector, name) => {
    if (name && new RegExp(`(^|[^a-z0-9-])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9-]|$)`, 'i').test(reducedText)) return true;
    return selector.split(',').some((part) => {
      const s = part.trim();
      return reducedSelectors.some((rs) => s === rs || s.startsWith(`${rs} `) || s.startsWith(`${rs}>`) || s.startsWith(`${rs}:`) || s.startsWith(`${rs}.`) || s.startsWith(`${rs}[`));
    });
  };

  const out = {};
  const add = (file, metric, by = 1) => {
    if (!by) return;
    out[file] = out[file] || {};
    out[file][metric] = (out[file][metric] || 0) + by;
  };

  for (const [file, { rules, keyframes }] of Object.entries(parsed)) {
    for (const k of keyframes) if (isPaintKeyframes(keyframeProps(k.body))) add(file, 'paint-keyframes');
    for (const rule of rules) {
      if (isBlanket(rule) && isReducedContext(rule)) add(file, 'blanket-reduced');
      if (isReducedContext(rule)) continue; // the fallbacks themselves are not counted
      for (const d of rule.decls) {
        if (/^(none|initial|inherit|unset)$/i.test(d.value)) continue;
        if (d.prop === 'transition' || d.prop === 'transition-property') {
          const props = d.prop === 'transition' ? transitionProps(d.value) : splitTop(d.value).map((p) => p.toLowerCase());
          if (props.some((p) => LAYOUT.has(p))) add(file, 'layout-transition');
          if (d.prop === 'transition') add(file, 'easing-literal', easingLiterals(d.value));
        }
        if (d.prop === 'transition-timing-function' || d.prop === 'animation-timing-function') add(file, 'easing-literal', easingLiterals(d.value));
        if (d.prop === 'animation' || d.prop === 'animation-name') {
          for (const part of splitTop(d.value)) {
            const name = part.split(/\s+/).find((w) => names.has(w));
            if (!name) continue;
            if (!isMotionAllowedContext(rule) && !hasOwnRule(rule.selector, name)) add(file, 'no-reduced-rule');
            if (/\binfinite\b/.test(part) || rule.decls.some((x) => x.prop === 'animation-iteration-count' && /infinite/.test(x.value))) add(file, 'infinite-loop');
          }
          if (d.prop === 'animation') add(file, 'easing-literal', easingLiterals(d.value, { isAnimation: true, knownNames: names }));
        }
      }
    }
  }

  // Inline style objects: transition: '...' and animation: '...'.
  for (const [file, text] of Object.entries(scripts)) {
    const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
    for (const m of code.matchAll(/\btransition\s*:\s*(['"`])([^'"`]+)\1/g)) {
      const v = m[2].trim();
      if (/^(none|initial|inherit|unset)$/i.test(v) || /\$\{/.test(v)) continue;
      if (transitionProps(v).some((p) => LAYOUT.has(p))) add(file, 'layout-transition');
      add(file, 'easing-literal', easingLiterals(v));
    }
    for (const m of code.matchAll(/\banimation\s*:\s*(['"`])([^'"`]+)\1/g)) {
      const v = m[2].trim();
      if (/^(none|initial|inherit|unset)$/i.test(v) || /\$\{/.test(v)) continue;
      const name = v.split(/\s+/).find((w) => names.has(w));
      if (!name) continue;
      if (!hasOwnRule('', name)) add(file, 'no-reduced-rule');
      if (/\binfinite\b/.test(v)) add(file, 'infinite-loop');
      add(file, 'easing-literal', easingLiterals(v, { isAnimation: true, knownNames: names }));
    }
  }
  return out;
}

/**
 * Compare counts with the budget, and the budget with main's.
 * `over` and `rose` fail: a count over its budget, a budget number higher than main's. `under`
 * is reported, not failed: the lower number waits for the next --write to record it.
 * @returns {{ over: string[], under: string[], rose: string[] }}
 */
export function compareBudget(counts, budget, mainBudget = null) {
  const over = [];
  const under = [];
  const rose = [];
  const files = new Set([...Object.keys(counts), ...Object.keys(budget)]);
  for (const file of [...files].sort()) {
    for (const metric of METRICS) {
      const n = counts[file]?.[metric] || 0;
      const cap = budget[file]?.[metric] || 0;
      if (n > cap) over.push(`${file} ${metric}: ${n} > budget ${cap}`);
      else if (n < cap) under.push(`${file} ${metric}: ${n} < budget ${cap}`);
    }
  }
  if (mainBudget) {
    for (const [file, row] of Object.entries(budget)) {
      for (const [metric, cap] of Object.entries(row)) {
        const was = mainBudget[file]?.[metric] || 0;
        if (cap > was) rose.push(`${file} ${metric}: ${cap} > main's ${was}`);
      }
    }
  }
  return { over, under, rose };
}

/** The budget --write records: each number lowered to today's count, never raised; zeros dropped. */
export function lowerBudget(counts, budget) {
  const next = {};
  for (const [file, row] of Object.entries(budget)) {
    for (const metric of METRICS) {
      const cap = row[metric] || 0;
      const n = Math.min(cap, counts[file]?.[metric] || 0);
      if (n > 0) (next[file] = next[file] || {})[metric] = n;
    }
  }
  return Object.fromEntries(Object.keys(next).sort().map((f) => [f, next[f]]));
}
