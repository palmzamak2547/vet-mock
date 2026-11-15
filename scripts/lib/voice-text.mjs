// ============================================================
// voice-text.mjs — the words a person reads, pulled out of the source
// ============================================================
// lint:voice and fix:voice judge wording, so they must read exactly what a
// reader sees and nothing else: string literals, templates and JSX text, each
// with where it sits (the property it is the value of, the call it is an
// argument of, the JSX attribute it fills). Comments and regular expressions
// are never text.
//
// It keeps the rules lint:ui-copy settled for what counts as copy (the same
// attribute, call and pattern lists), but it is its own small tokenizer and
// imports nothing outside node, so the check runs in a bare checkout and adds
// no parse of 30 MB of question banks to the build.
//
//   extractStrings(source, file)  every string, template and JSX text of a module
//   extractMarkdown(source, file) the prose lines of a Markdown file
// ============================================================

// Attributes that never carry copy; their values are not read at all.
export const SKIP_ATTR = new Set(['className', 'id', 'key', 'type', 'href', 'src', 'style', 'data-testid', 'role', 'htmlFor',
  'name', 'rel', 'target', 'viewBox', 'd', 'fill', 'stroke', 'xmlns', 'points', 'transform', 'inputMode',
  'autoComplete', 'accept', 'method', 'lang', 'dir', 'loading', 'decoding', 'as', 'variant', 'size', 'tone', 'icon',
  'kind', 'mode', 'pose', 'mood', 'layout', 'align', 'fontFamily', 'strokeLinecap', 'strokeLinejoin', 'fillRule',
  'clipRule', 'preserveAspectRatio', 'textAnchor', 'dominantBaseline', 'gradientUnits', 'offset', 'stopColor',
  'crossOrigin', 'referrerPolicy', 'sandbox', 'allow', 'enterKeyHint', 'spellCheck', 'pattern', 'step', 'min',
  'max', 'to', 'path', 'route', 'view', 'testId']);
// Calls whose arguments are keys, selectors or queries rather than copy.
const SKIP_CALL = /\.(querySelector|querySelectorAll|getItem|setItem|removeItem|addEventListener|removeEventListener|getElementById|match|replace|split|test|startsWith|endsWith|includes|indexOf|join|from|select|eq|in|order|rpc|channel|on|invoke|storage|classList\.add|classList\.remove|classList\.toggle|setAttribute|getAttribute|closest)$/;
// A string in first position of these is a pattern, not text.
const PATTERN_CALL = /(^|\.)(replace|replaceAll|split|match|matchAll|test|search|includes|indexOf|lastIndexOf|startsWith|endsWith)$|^RegExp$/;
/** Console and logger output is for whoever debugs, not for a reader. */
export const LOG_CALL = /^(skip)?call:(console|logger)\b|\.(console|logger)\./;

// After these words an expression starts: a slash opens a regular expression, a brace an object.
const EXPR_WORDS = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case',
  'yield', 'await', 'default', 'extends', 'export']);
const OTHER_WORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'with', 'function', 'do', 'else', 'const', 'let',
  'var', 'class', 'import', 'async', 'static', 'try', 'finally', 'break', 'continue', 'debugger']);
const OPERATOR = />>>=|\.\.\.|===|!==|\*\*=|<<=|>>=|>>>|&&=|\|\|=|\?\?=|=>|==|!=|<=|>=|&&|\|\||\?\?|\?\.(?!\d)|\+\+|--|\+=|-=|\*=|%=|&=|\|=|\^=|<<|>>|\*\*|[-+*%=!<>&|^~?:;,.()[\]{}@#\\]/y;
const JSX_NAME = /[A-Za-z_$][\w$.:-]*/y;
const JSX_ATTR = /[^\s=/>{}"'`]+/y;

// JSX text and JSX attribute strings are HTML: an entity is the character it names.
const ENTITIES = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", mdash: '—', ndash: '–',
  hellip: '…', middot: '·', bull: '•', rarr: '→', larr: '←', times: '×', deg: '°',
};
const decodeEntities = (text) => (text.includes('&') ? text.replace(/&(#x[0-9a-fA-F]+|#\d+|[A-Za-z]+);/g, (m, name) => {
  if (name[0] === '#') {
    const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    return Number.isFinite(code) && code > 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : m;
  }
  return Object.hasOwn(ENTITIES, name) ? ENTITIES[name] : m;
}) : text);

const isSpace = (code) => code <= 32 || code === 0xA0 || code === 0xFEFF || code === 0x2028 || code === 0x2029;
const isDigit = (code) => code >= 48 && code <= 57;
const isIdStart = (code) => (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95 || code === 36 || code > 127;
const isIdPart = (code) => isIdStart(code) || isDigit(code);

/**
 * Every string, template and JSX text in one module, in source order.
 *
 * Each record: { file, line, kind: 'str' | 'tpl' | 'jsx', text, ctx, path, key, pattern, list, start, end, quote }.
 *   ctx      what holds the text, innermost first: attr:<name>, call:<callee>, skipcall:<callee>,
 *            prop:<key>, jsx:<element> or root (the words lint:ui-copy uses)
 *   path     the object keys above it, outermost first, joined by dots: sections.body.bullets
 *   key      the innermost of those keys
 *   pattern  true for the first argument of replace/split/test and friends
 *   list     a number shared by the strings that sit in one array
 *   start, end, quote   where the text sits between its quotes ('str' only), so a fix can rewrite in place
 * A template's text carries ${} for each expression.
 */
export function extractStrings(source, file = '') {
  const s = source;
  const n = s.length;
  const out = [];
  let i = 0;

  const lineStarts = [0];
  for (let k = 0; k < n; k++) if (s.charCodeAt(k) === 10) lineStarts.push(k + 1);
  const lineOf = (pos) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= pos) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };

  // What encloses the cursor. Frames: root, paren (callee, argIndex), bracket (id), brace (isObject, key),
  // tplexpr, jsxel (name), jsxattr (name), jsxexpr.
  const stack = [{ kind: 'root' }];
  let prev = null;      // the last two tokens that are not space or comment
  let prev2 = null;
  let chain = '';       // the member chain the last identifier ends: a.b.c
  let afterDot = false;
  let dotBase = '';
  let mute = 0;         // inside a skipped attribute or a css`` template
  let listSeq = 0;

  const setPrev = (tok) => { prev2 = prev; prev = tok; };
  const top = () => stack[stack.length - 1];

  const exprAllowed = () => {
    if (!prev) return true;
    if (prev.t === 'punct') return !(prev.v === ')' || prev.v === ']' || prev.v === '}');
    if (prev.t === 'word') return EXPR_WORDS.has(prev.v) || prev.v === 'do' || prev.v === 'else';
    return false;
  };
  const jsxAhead = () => {
    const c = s.charCodeAt(i + 1);
    return c === 62 || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95 || c === 36;
  };

  function contextOf() {
    let ctx = null;
    let list = 0;
    const keys = [];
    for (let k = stack.length - 1; k >= 0; k--) {
      const f = stack[k];
      if (f.kind === 'bracket') { if (!list) list = f.id; } else if (f.kind === 'brace') {
        if (f.isObject && f.key) { keys.push(f.key); if (!ctx) ctx = `prop:${f.key}`; }
      } else if (f.kind === 'jsxattr') { if (!ctx) ctx = `attr:${f.name}`; } else if (f.kind === 'paren') {
        if (f.callee !== undefined && !ctx) {
          const skip = f.callee === 'require' || f.callee === 'import' || SKIP_CALL.test(f.callee);
          ctx = `${skip ? 'skipcall' : 'call'}:${f.callee}`;
        }
      } else if (f.kind === 'jsxel') { if (!ctx) ctx = `jsx:${f.name}`; }
    }
    const t = top();
    const pattern = t.kind === 'paren' && t.callee !== undefined && t.argIndex === 0 && PATTERN_CALL.test(t.callee);
    keys.reverse();
    return { ctx: ctx || 'root', path: keys.join('.'), key: keys.length ? keys[keys.length - 1] : '', pattern, list };
  }

  function emit(kind, pos, text, start, end, quote) {
    if (mute) return null;
    if (kind === 'str' && prev && ((prev.t === 'id' && prev.v === 'from') || (prev.t === 'word' && prev.v === 'import'))) return null;
    const rec = { file, line: lineOf(pos), kind, text, ...contextOf(), start, end, quote };
    out.push(rec);
    return rec;
  }

  function escape() {
    // s[i] is a backslash. Returns the character it stands for and moves past it.
    const d = s[i + 1];
    i += 2;
    switch (d) {
      case 'n': return '\n';
      case 't': return '\t';
      case 'r': return '\r';
      case 'b': return '\b';
      case 'f': return '\f';
      case 'v': return '\v';
      case '0': return isDigit(s.charCodeAt(i)) ? '0' : '\0';
      case 'x': {
        const hex = s.slice(i, i + 2);
        if (/^[0-9a-fA-F]{2}$/.test(hex)) { i += 2; return String.fromCharCode(parseInt(hex, 16)); }
        return 'x';
      }
      case 'u': {
        if (s[i] === '{') {
          const close = s.indexOf('}', i);
          const hex = close > 0 ? s.slice(i + 1, close) : '';
          if (/^[0-9a-fA-F]{1,6}$/.test(hex)) { i = close + 1; return String.fromCodePoint(parseInt(hex, 16)); }
          return 'u';
        }
        const hex = s.slice(i, i + 4);
        if (/^[0-9a-fA-F]{4}$/.test(hex)) { i += 4; return String.fromCharCode(parseInt(hex, 16)); }
        return 'u';
      }
      case '\r': if (s[i] === '\n') i++; return '';
      case '\n': return '';
      case undefined: return '';
      default: return d;
    }
  }

  function readString(q) {
    const open = i;
    i++;
    let text = '';
    let seg = i;
    while (i < n) {
      const c = s[i];
      if (c === q || c === '\n') break;
      if (c === '\\') { text += s.slice(seg, i); text += escape(); seg = i; continue; }
      i++;
    }
    text += s.slice(seg, i);
    const end = i;
    if (s[i] === q) i++;
    const rec = /\S/.test(text) ? emit('str', open, text, open + 1, end, q) : null;
    setPrev({ t: 'str', v: text, rec });
    afterDot = false;
  }

  function nested(frame, muted) {
    // The JavaScript between a "{" already passed and its "}", as an expression of its own.
    const saved = [prev, prev2, chain, afterDot, dotBase];
    prev = null; prev2 = null; chain = ''; afterDot = false;
    const depth = stack.length;
    stack.push(frame);
    if (muted) mute++;
    js(true);
    if (muted) mute--;
    stack.length = depth;
    if (s[i] === '}') i++;
    [prev, prev2, chain, afterDot, dotBase] = saved;
  }

  function readTemplate() {
    const open = i;
    const tagged = prev && prev.t === 'id' && (chain === 'css' || chain.endsWith('.css'));
    const rec = tagged ? null : emit('tpl', open, '', open + 1, open + 1, '`');
    i++;
    let text = '';
    let seg = i;
    while (i < n) {
      const c = s[i];
      if (c === '`') break;
      if (c === '\\') { text += s.slice(seg, i); text += escape(); seg = i; continue; }
      if (c === '$' && s[i + 1] === '{') {
        text += `${s.slice(seg, i)}\${}`;
        i += 2;
        nested({ kind: 'tplexpr' }, tagged);
        seg = i;
        continue;
      }
      i++;
    }
    text += s.slice(seg, i);
    if (rec) {
      rec.text = text;
      rec.end = i;
      if (!/\S/.test(text.replace(/\$\{\}/g, ''))) out.splice(out.indexOf(rec), 1);
    }
    if (s[i] === '`') i++;
    setPrev({ t: 'tpl' });
    afterDot = false;
  }

  function readRegex() {
    // s[i] is "/" where an expression may start. False when no regular expression ends on this line.
    let k = i + 1;
    let inClass = false;
    for (; k < n; k++) {
      const c = s[k];
      if (c === '\n') return false;
      if (c === '\\') { k++; continue; }
      if (c === '[') inClass = true; else if (c === ']') inClass = false; else if (c === '/' && !inClass) break;
    }
    if (k >= n) return false;
    k++;
    while (k < n && isIdPart(s.charCodeAt(k))) k++;
    i = k;
    setPrev({ t: 'regex' });
    afterDot = false;
    return true;
  }

  function skipTagSpace() {
    while (i < n) {
      if (isSpace(s.charCodeAt(i))) { i++; continue; }
      if (s[i] === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
      if (s[i] === '/' && s[i + 1] === '/') { const e = s.indexOf('\n', i); i = e < 0 ? n : e; continue; }
      break;
    }
  }

  function jsxChildren() {
    const depth = stack.length;
    while (i < n) {
      const from = i;
      while (i < n && s[i] !== '<' && s[i] !== '{') i++;
      if (i > from) {
        const raw = s.slice(from, i);
        const text = decodeEntities(raw).replace(/\s+/g, ' ').trim();
        if (text) emit('jsx', from + (raw.length - raw.trimStart().length), text, from, i, '');
      }
      if (i >= n) return;
      if (s[i] === '{') { i++; nested({ kind: 'jsxexpr' }, false); stack.length = depth; continue; }
      if (s[i + 1] === '/') { const e = s.indexOf('>', i); i = e < 0 ? n : e + 1; return; }
      if (jsxAhead()) { jsxElement(); continue; }
      i++;
    }
  }

  function jsxElement() {
    // s[i] is "<" at the start of an element or a fragment.
    i++;
    let name = '';
    if (s[i] !== '>') {
      JSX_NAME.lastIndex = i;
      const m = JSX_NAME.exec(s);
      name = m ? m[0] : '';
      i += name.length;
    }
    const depth = stack.length;
    stack.push({ kind: 'jsxel', name });
    while (i < n) {
      skipTagSpace();
      if (i >= n) break;
      const c = s[i];
      if (c === '/' && s[i + 1] === '>') { i += 2; break; }
      if (c === '>') { i++; jsxChildren(); break; }
      if (c === '{') { i++; nested({ kind: 'jsxexpr' }, false); continue; }
      JSX_ATTR.lastIndex = i;
      const m = JSX_ATTR.exec(s);
      if (!m) { i++; continue; }
      const attr = m[0];
      i += attr.length;
      skipTagSpace();
      if (s[i] !== '=') continue;
      i++;
      skipTagSpace();
      const muted = SKIP_ATTR.has(attr);
      const q = s[i];
      if (q === '"' || q === "'") {
        const close = s.indexOf(q, i + 1);
        const end = close < 0 ? n : close;
        const text = decodeEntities(s.slice(i + 1, end));
        if (!muted && /\S/.test(text)) {
          stack.push({ kind: 'jsxattr', name: attr });
          emit('str', i, text, i + 1, end, q);
          stack.pop();
        }
        i = Math.min(n, end + 1);
      } else if (q === '{') {
        i++;
        nested({ kind: 'jsxattr', name: attr }, muted);
      } else if (q === '<') {
        jsxElement();
      }
    }
    stack.length = depth;
  }

  function closeFrame(kind, base) {
    for (let k = stack.length - 1; k >= base; k--) {
      if (stack[k].kind === kind) { stack.length = k; return true; }
    }
    return false;
  }

  function js(untilBrace) {
    const base = stack.length;
    while (i < n) {
      const code = s.charCodeAt(i);
      if (isSpace(code)) { i++; continue; }
      const c = s[i];
      if (c === '/') {
        const d = s[i + 1];
        if (d === '/') { const e = s.indexOf('\n', i); i = e < 0 ? n : e; continue; }
        if (d === '*') { const e = s.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
        if ((exprAllowed() || (prev && prev.t === 'punct' && prev.v === '}')) && readRegex()) continue;
        i += d === '=' ? 2 : 1;
        setPrev({ t: 'punct', v: '/' });
        afterDot = false;
        continue;
      }
      if (c === '"' || c === "'") { readString(c); continue; }
      if (c === '`') { readTemplate(); continue; }
      if (isDigit(code) || (c === '.' && isDigit(s.charCodeAt(i + 1)))) {
        const from = i;
        i++;
        while (i < n && (isIdPart(s.charCodeAt(i)) || s[i] === '.')) i++;
        setPrev({ t: 'num', v: s.slice(from, i) });
        afterDot = false;
        continue;
      }
      if (isIdStart(code)) {
        const from = i;
        i++;
        while (i < n && isIdPart(s.charCodeAt(i))) i++;
        const word = s.slice(from, i);
        if (!afterDot && (EXPR_WORDS.has(word) || OTHER_WORDS.has(word))) {
          setPrev({ t: 'word', v: word });
          chain = '';
        } else {
          chain = afterDot ? `${dotBase}.${word}` : word;
          setPrev({ t: 'id', v: word });
        }
        afterDot = false;
        continue;
      }
      if (c === '<' && exprAllowed() && jsxAhead()) {
        jsxElement();
        setPrev({ t: 'jsx' });
        afterDot = false;
        continue;
      }
      if (c === '#' && i === 0 && s[1] === '!') { const e = s.indexOf('\n'); i = e < 0 ? n : e; continue; }

      OPERATOR.lastIndex = i;
      const m = OPERATOR.exec(s);
      const op = m ? m[0] : c;
      i += op.length;
      switch (op) {
        case '(': {
          let callee;
          if (prev && prev.t === 'id' && !(prev2 && prev2.t === 'word' && prev2.v === 'function')) callee = chain;
          else if (prev && prev.t === 'word' && prev.v === 'import') callee = 'import';
          else if (prev && prev.t === 'punct' && (prev.v === ')' || prev.v === ']')) callee = '';
          stack.push({ kind: 'paren', callee, argIndex: 0 });
          break;
        }
        case '[':
          stack.push({ kind: 'bracket', id: ++listSeq });
          break;
        case '{': {
          let isObject;
          if (!prev) isObject = top().kind !== 'root';
          else if (prev.t === 'punct') isObject = !(prev.v === ')' || prev.v === '=>' || prev.v === '}' || prev.v === ']' || prev.v === ';' || prev.v === '{');
          else if (prev.t === 'word') isObject = EXPR_WORDS.has(prev.v);
          else isObject = false;
          stack.push({ kind: 'brace', isObject, key: null });
          break;
        }
        case ')':
          closeFrame('paren', base);
          break;
        case ']':
          closeFrame('bracket', base);
          break;
        case '}':
          if (!closeFrame('brace', base) && untilBrace) { i -= 1; stack.length = base; return; }
          break;
        case ',': {
          const f = top();
          if (f.kind === 'paren') f.argIndex++;
          else if (f.kind === 'brace') f.key = null;
          break;
        }
        case '?': {
          const f = top();
          f.ternary = (f.ternary || 0) + 1;
          break;
        }
        case ':': {
          const f = top();
          if (f.ternary > 0) { f.ternary--; break; }
          if (f.kind === 'brace' && f.isObject) {
            const named = prev && (prev.t === 'id' || prev.t === 'word' || prev.t === 'str' || prev.t === 'num');
            const starts = prev2 && prev2.t === 'punct' && (prev2.v === '{' || prev2.v === ',');
            if (named && starts) {
              f.key = String(prev.v);
              // A quoted key is a name, not text.
              if (prev.t === 'str' && prev.rec && out[out.length - 1] === prev.rec) out.pop();
            } else f.key = '';
          }
          break;
        }
        case '.':
        case '?.':
          dotBase = prev && prev.t === 'id' ? chain : '';
          setPrev({ t: 'punct', v: op });
          afterDot = true;
          continue;
        default: break;
      }
      setPrev({ t: 'punct', v: op });
      afterDot = false;
    }
  }

  js(false);
  return out;
}

/** True when a record is something a reader sees: not a pattern argument, not debug output. */
export const isCopy = (r) => !r.pattern && !LOG_CALL.test(r.ctx);

/**
 * The prose lines of a Markdown file: no fenced code, no inline code, no link targets, no HTML.
 * Each record: { file, line, kind: 'md', text, ctx: 'md', path: '', key: '' }.
 */
export function extractMarkdown(source, file = '') {
  const out = [];
  const lines = source.split(/\r?\n/);
  let fence = null;
  let comment = false;
  let k = 0;
  if (lines[0] === '---') {
    const close = lines.indexOf('---', 1);
    if (close > 0) k = close + 1;
  }
  for (; k < lines.length; k++) {
    let line = lines[k];
    const fenced = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (fenced && fenced[1][0] === fence[0] && fenced[1].length >= fence.length) fence = null;
      continue;
    }
    if (fenced) { fence = fenced[1]; continue; }
    if (comment) {
      const close = line.indexOf('-->');
      if (close < 0) continue;
      line = line.slice(close + 3);
      comment = false;
    }
    line = line.replace(/<!--.*?-->/g, ' ');
    const open = line.indexOf('<!--');
    if (open >= 0) { line = line.slice(0, open); comment = true; }
    const text = line
      .replace(/(`+)[^`]*?\1/g, ' ')
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/<https?:[^>]*>/g, ' ')
      .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
      .replace(/\bhttps?:\/\/\S+/g, ' ')
      .replace(/^\s*(?:[-*+]|\d+[.)])\s+(?:\[[ xX]\]\s+)?|^\s*#{1,6}\s+|^\s*>+\s?/, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text || /^[|:\-\s]+$/.test(text)) continue;
    out.push({ file, line: k + 1, kind: 'md', text, ctx: 'md', path: '', key: '', pattern: false, list: 0 });
  }
  return out;
}
