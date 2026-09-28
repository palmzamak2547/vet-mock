// Computed columns: a tokenizer and a precedence (Pratt-style) parser for arithmetic, comparisons,
// and/or/not and a fixed function list [M2-DESIGN.md 4.4]. The text a student types is parsed into a
// small tree and walked by the evaluator below; nothing is ever run as code (no eval, no new Function,
// no `with`, no property access: names are looked up in Maps built here, never on an object's
// prototype chain). Bounded: at most MAX_LENGTH characters, MAX_TOKENS tokens and MAX_DEPTH levels of
// nesting, so a pasted wall of brackets fails with a message and never hangs.
//
// Grammar (M2-DESIGN.md 4.4):
//   expr    := orExpr
//   orExpr  := andExpr ('or' andExpr)*
//   andExpr := notExpr ('and' notExpr)*
//   notExpr := 'not' notExpr | cmp
//   cmp     := add (('<' | '<=' | '>' | '>=' | '==' | '!=') add)?
//   add     := mul (('+' | '-') mul)*
//   mul     := unary (('*' | '/') unary)*
//   unary   := '-' unary | pow
//   pow     := atom ('^' unary)?
//   atom    := number | column | call | '(' expr ')'
//   column  := '{' any text but '}' '}'   (a header name, or a key such as c3 or d2; a bare key also works)
//   call    := name '(' (expr (',' expr)*)? ')'
//   number  := digits ('.' digits)?       (Thai digits are read as Arabic digits)
// So -2^2 is -4 and 2^3^2 is 512 (the power binds tighter than the minus and groups to the right).
// Comparisons give 1 or 0. A missing operand gives a missing result with the operand's reason; a
// division by zero, the square root of a negative number, the logarithm of zero or less, or a result
// too large to hold gives reason 5 (invalid), and every such row is listed.
//
// Types: 'number', 'boolean' (a comparison, and/or/not, isMissing, a yes/no column) and 'date' (days
// since 1970-01-01). A date plus or minus a number of days is a date; a date minus a date is a number
// of days; anything else on a date is refused at parse time with the position.
// OWNER: data role.
import { thaiDigitsToArabic, cleanCell } from './thai.js';
import { monthsBetween } from './dates.js';
import { MISSING } from './missing.js';

export const MAX_LENGTH = 1000;
export const MAX_TOKENS = 400;
export const MAX_DEPTH = 40;
export const MAX_ARGS = 50;

/** The fixed function list: name -> { min, max } arguments. Looked up in a Map, never on an object. */
export const FUNCTIONS = new Map([
  ['abs', { min: 1, max: 1 }],
  ['sqrt', { min: 1, max: 1 }],
  ['ln', { min: 1, max: 1 }],
  ['log10', { min: 1, max: 1 }],
  ['exp', { min: 1, max: 1 }],
  ['round', { min: 1, max: 2 }],
  ['floor', { min: 1, max: 1 }],
  ['ceil', { min: 1, max: 1 }],
  ['min', { min: 1, max: MAX_ARGS }],
  ['max', { min: 1, max: MAX_ARGS }],
  ['sum', { min: 1, max: MAX_ARGS }],
  ['mean', { min: 1, max: MAX_ARGS }],
  ['if', { min: 3, max: 3 }],
  ['isMissing', { min: 1, max: 1 }],
  ['daysBetween', { min: 2, max: 2 }],
  ['monthsBetween', { min: 2, max: 2 }],
]);

const KEYWORDS = new Map([['and', 'and'], ['or', 'or'], ['not', 'not']]);
const BARE_KEY = /^[cdmw]\d+$/;
const NUMERIC_TYPES = new Set(['continuous', 'count']);

class ExprError extends Error {
  constructor(key, at, params) {
    super(key);
    this.key = key;
    this.at = at;
    this.params = params;
  }
}
const fail = (key, at, params) => { throw new ExprError(key, at, params); };

// ------------------------------------------------------------------ tokenizer

/**
 * @param {string} text
 * @returns {{ k: string, v?: any, at: number, end: number }[]}
 */
function tokenize(text) {
  const out = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    const ch = text[i];
    const code = text.charCodeAt(i);
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === ' ') { i += 1; continue; }
    const at = i;
    if (isDigit(ch) || (ch === '.' && i + 1 < n && isDigit(text[i + 1]))) {
      let j = i;
      while (j < n && isDigit(text[j])) j += 1;
      if (j < n && text[j] === '.') {
        j += 1;
        if (!(j < n && isDigit(text[j]))) fail('data.expr.badNumber', at);
        while (j < n && isDigit(text[j])) j += 1;
      }
      if (j < n && (isDigit(text[j]) || text[j] === '.')) fail('data.expr.badNumber', at);
      const src = thaiDigitsToArabic(text.slice(i, j));
      const v = Number(src.startsWith('.') ? `0${src}` : src);
      if (!Number.isFinite(v)) fail('data.expr.badNumber', at);
      out.push({ k: 'num', v, at, end: j });
      i = j;
      continue;
    }
    if (ch === '{') {
      const close = text.indexOf('}', i + 1);
      if (close < 0) fail('data.expr.unclosedBrace', at);
      const inner = text.slice(i + 1, close);
      if (inner.includes('{')) fail('data.expr.unclosedBrace', at);
      out.push({ k: 'col', v: inner, at, end: close + 1 });
      i = close + 1;
      continue;
    }
    if (ch === '}') fail('data.expr.unexpectedChar', at, { char: ch });
    if (isIdentStart(code)) {
      let j = i + 1;
      while (j < n && isIdentPart(text.charCodeAt(j))) j += 1;
      out.push({ k: 'id', v: text.slice(i, j), at, end: j });
      i = j;
      continue;
    }
    const two = text.slice(i, i + 2);
    if (two === '<=' || two === '>=' || two === '==' || two === '!=' || two === '<>') {
      out.push({ k: 'op', v: two === '<>' ? '!=' : two, at, end: i + 2 });
      i += 2;
      continue;
    }
    if (ch === '=') fail('data.expr.singleEquals', at);
    const alias = OP_ALIASES.get(ch);
    if (alias) { out.push({ k: 'op', v: alias, at, end: i + 1 }); i += 1; continue; }
    if ('+-*/^<>'.includes(ch)) { out.push({ k: 'op', v: ch, at, end: i + 1 }); i += 1; continue; }
    if (ch === '(' || ch === ')' || ch === ',') { out.push({ k: ch, at, end: i + 1 }); i += 1; continue; }
    fail('data.expr.unexpectedChar', at, { char: ch });
  }
  if (out.length > MAX_TOKENS) fail('data.expr.tooLong', 0, { max: MAX_LENGTH });
  out.push({ k: 'end', at: n, end: n });
  return out;
}

// The minus sign, times and divide signs and the comparison signs a student may type on a phone.
const OP_ALIASES = new Map([['−', '-'], ['×', '*'], ['÷', '/'], ['≤', '<='], ['≥', '>='], ['≠', '!=']]);

function isDigit(ch) {
  return (ch >= '0' && ch <= '9') || (ch >= '๐' && ch <= '๙');
}
function isIdentStart(c) {
  return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95;
}
function isIdentPart(c) {
  return isIdentStart(c) || (c >= 48 && c <= 57);
}

// ------------------------------------------------------------------ parser

/**
 * Parse a formula for a computed column.
 * @param {string} text
 * @param {{ key: string, name: string, type?: string, positive?: string|null }[]} columns
 *   what {name} and bare keys may refer to; `type` is the codebook type (number, date, or a yes/no
 *   column with its positive level); a column without a type is read as a number
 * @returns {{ ok: true, ast: any, refs: string[], type: 'number'|'boolean'|'date' } | { ok: false, key: string, at: number, params?: Object }}
 *   `at` is the 0-based character position of the problem (show it as at + 1)
 */
export function parseExpression(text, columns) {
  try {
    if (typeof text !== 'string') fail('data.expr.empty', 0);
    if (text.length > MAX_LENGTH) fail('data.expr.tooLong', MAX_LENGTH, { max: MAX_LENGTH });
    if (!text.trim()) fail('data.expr.empty', 0);
    const byKey = new Map();
    const byName = new Map();
    for (const c of columns || []) {
      if (!c || typeof c.key !== 'string') continue;
      byKey.set(c.key, c);
      const nm = cleanCell(c.name ?? '').value;
      if (nm && !byName.has(nm)) byName.set(nm, c);
    }
    const toks = tokenize(text);
    const p = new Parser(toks, byKey, byName);
    const ast = p.expr(0);
    const t = p.peek();
    if (t.k !== 'end') fail(t.k === ')' ? 'data.expr.unexpectedClose' : 'data.expr.unexpectedToken', t.at);
    return { ok: true, ast, refs: [...p.refs], type: ast.ty };
  } catch (e) {
    if (e instanceof ExprError) return e.params ? { ok: false, key: e.key, at: e.at, params: e.params } : { ok: false, key: e.key, at: e.at };
    if (e instanceof RangeError) return { ok: false, key: 'data.expr.tooDeep', at: 0, params: { max: MAX_DEPTH } };
    throw e;
  }
}

class Parser {
  constructor(toks, byKey, byName) {
    this.toks = toks;
    this.i = 0;
    this.byKey = byKey;
    this.byName = byName;
    this.refs = new Set();
  }
  peek() { return this.toks[this.i]; }
  next() { return this.toks[this.i++]; }
  isOp(v) { const t = this.peek(); return t.k === 'op' && t.v === v; }
  isWord(w) { const t = this.peek(); return t.k === 'id' && t.v === w; }
  guard(depth, at) { if (depth > MAX_DEPTH) fail('data.expr.tooDeep', at, { max: MAX_DEPTH }); }

  expr(d) { return this.orExpr(d); }

  orExpr(d) {
    this.guard(d, this.peek().at);
    let a = this.andExpr(d);
    while (this.isWord('or')) {
      const at = this.next().at;
      const b = this.andExpr(d);
      a = { t: 'logic', op: 'or', a, b, at, ty: 'boolean' };
    }
    return a;
  }

  andExpr(d) {
    this.guard(d, this.peek().at);
    let a = this.notExpr(d);
    while (this.isWord('and')) {
      const at = this.next().at;
      const b = this.notExpr(d);
      a = { t: 'logic', op: 'and', a, b, at, ty: 'boolean' };
    }
    return a;
  }

  notExpr(d) {
    this.guard(d, this.peek().at);
    if (this.isWord('not')) {
      const at = this.next().at;
      const a = this.notExpr(d + 1);
      return { t: 'not', a, at, ty: 'boolean' };
    }
    return this.cmp(d);
  }

  cmp(d) {
    this.guard(d, this.peek().at);
    const a = this.add(d);
    const t = this.peek();
    if (t.k === 'op' && CMP.has(t.v)) {
      this.next();
      const b = this.add(d);
      if ((a.ty === 'date') !== (b.ty === 'date')) fail('data.expr.dateCompare', t.at);
      const after = this.peek();
      if (after.k === 'op' && CMP.has(after.v)) fail('data.expr.chainedComparison', after.at);
      return { t: 'cmp', op: t.v, a, b, at: t.at, ty: 'boolean' };
    }
    return a;
  }

  add(d) {
    this.guard(d, this.peek().at);
    let a = this.mul(d);
    while (this.isOp('+') || this.isOp('-')) {
      const t = this.next();
      const b = this.mul(d);
      let ty;
      if (a.ty === 'date' && b.ty === 'date') {
        if (t.v === '+') fail('data.expr.dateArithmetic', t.at);
        ty = 'number';
      } else if (a.ty === 'date') ty = 'date';
      else if (b.ty === 'date') {
        if (t.v === '-') fail('data.expr.dateArithmetic', t.at);
        ty = 'date';
      } else ty = 'number';
      a = { t: 'bin', op: t.v, a, b, at: t.at, ty };
    }
    return a;
  }

  mul(d) {
    this.guard(d, this.peek().at);
    let a = this.unary(d);
    while (this.isOp('*') || this.isOp('/')) {
      const t = this.next();
      const b = this.unary(d);
      if (a.ty === 'date' || b.ty === 'date') fail('data.expr.dateArithmetic', t.at);
      a = { t: 'bin', op: t.v, a, b, at: t.at, ty: 'number' };
    }
    return a;
  }

  unary(d) {
    this.guard(d, this.peek().at);
    if (this.isOp('-')) {
      const at = this.next().at;
      const a = this.unary(d + 1);
      if (a.ty === 'date') fail('data.expr.dateArithmetic', at);
      return { t: 'neg', a, at, ty: 'number' };
    }
    return this.pow(d);
  }

  pow(d) {
    this.guard(d, this.peek().at);
    const a = this.atom(d);
    if (this.isOp('^')) {
      const at = this.next().at;
      const b = this.unary(d + 1);
      if (a.ty === 'date' || b.ty === 'date') fail('data.expr.dateArithmetic', at);
      return { t: 'bin', op: '^', a, b, at, ty: 'number' };
    }
    return a;
  }

  atom(d) {
    this.guard(d, this.peek().at);
    const t = this.next();
    switch (t.k) {
      case 'num':
        return { t: 'num', v: t.v, at: t.at, ty: 'number' };
      case 'col':
        return this.column(cleanCell(t.v).value, t.at, true);
      case '(': {
        const e = this.expr(d + 1);
        const c = this.next();
        if (c.k !== ')') fail('data.expr.unclosedParen', t.at);
        return e;
      }
      case 'id': {
        if (KEYWORDS.has(t.v)) fail('data.expr.unexpectedToken', t.at);
        if (this.peek().k === '(') return this.call(t, d + 1);
        if (BARE_KEY.test(t.v) && this.byKey.has(t.v)) return this.column(t.v, t.at, false);
        if (FUNCTIONS.has(t.v)) fail('data.expr.needsBrackets', t.at, { name: t.v });
        return fail('data.expr.unknownName', t.at, { name: t.v });
      }
      case 'end':
        return fail('data.expr.unexpectedEnd', t.at);
      case ')':
        return fail('data.expr.unexpectedClose', t.at);
      default:
        return fail('data.expr.unexpectedToken', t.at);
    }
  }

  column(ref, at, braced) {
    if (!ref) fail('data.expr.emptyColumn', at);
    const c = this.byKey.get(ref) || (braced ? this.byName.get(ref) : undefined);
    if (!c) fail('data.expr.unknownColumn', at, { name: ref });
    const type = c.type == null ? 'continuous' : c.type;
    let ty;
    let positive = null;
    if (type === 'date') ty = 'date';
    else if (NUMERIC_TYPES.has(type)) ty = 'number';
    else if (type === 'binary' && typeof c.positive === 'string' && c.positive !== '') { ty = 'boolean'; positive = c.positive; }
    else if (type === 'binary') fail('data.expr.binaryNoPositive', at, { name: c.name || c.key });
    else fail('data.expr.columnNotNumber', at, { name: c.name || c.key });
    this.refs.add(c.key);
    return { t: 'col', key: c.key, positive, at, ty };
  }

  call(nameTok, d) {
    const name = nameTok.v;
    const spec = FUNCTIONS.get(name);
    if (!spec) fail('data.expr.unknownFunction', nameTok.at, { name });
    this.next(); // '('
    const args = [];
    if (this.peek().k !== ')') {
      for (;;) {
        if (args.length >= MAX_ARGS) fail('data.expr.tooManyArgs', this.peek().at, { name, max: spec.max });
        args.push(this.expr(d + 1));
        const t = this.peek();
        if (t.k === ',') { this.next(); continue; }
        break;
      }
    }
    const close = this.next();
    if (close.k !== ')') fail('data.expr.unclosedParen', nameTok.at);
    if (args.length < spec.min || args.length > spec.max) {
      if (spec.max === MAX_ARGS) fail('data.expr.argCountMin', nameTok.at, { name, min: spec.min });
      if (spec.min === spec.max) fail('data.expr.argCount', nameTok.at, { name, count: spec.min });
      fail('data.expr.argCountRange', nameTok.at, { name, min: spec.min, max: spec.max });
    }
    return { t: 'call', fn: name, args, at: nameTok.at, ty: callType(name, args, nameTok.at) };
  }
}

const CMP = new Set(['<', '<=', '>', '>=', '==', '!=']);

function callType(name, args, at) {
  const dates = args.filter((a) => a.ty === 'date').length;
  switch (name) {
    case 'if': {
      const [, a, b] = args;
      if ((a.ty === 'date') !== (b.ty === 'date')) fail('data.expr.ifTypes', at);
      if (a.ty === 'date') return 'date';
      return a.ty === 'boolean' && b.ty === 'boolean' ? 'boolean' : 'number';
    }
    case 'isMissing':
      return 'boolean';
    case 'daysBetween':
    case 'monthsBetween':
      if (dates !== 2) fail('data.expr.needsDates', at, { name });
      return 'number';
    case 'min':
    case 'max':
      if (dates && dates !== args.length) fail('data.expr.dateArithmetic', at);
      return dates ? 'date' : 'number';
    default:
      if (dates) fail('data.expr.dateArithmetic', at);
      return 'number';
  }
}

// ------------------------------------------------------------------ evaluator

const INVALID = MISSING.invalid;

/**
 * Evaluate one row. `cell(key)` returns `{ miss, num, text }` for a column in that row (`num` is the
 * number, the days of a date, or anything for a yes/no column, which is read from `text`).
 * @param {any} node
 * @param {(key: string) => { miss: number, num: number, text: string|null }} cell
 * @returns {{ v: number, m: number, key?: string }}
 */
export function evalRow(node, cell) {
  switch (node.t) {
    case 'num':
      return { v: node.v, m: 0 };
    case 'col': {
      const c = cell(node.key);
      if (c.miss) return { v: NaN, m: c.miss };
      if (node.positive !== null) return { v: c.text === node.positive ? 1 : 0, m: 0 };
      return Number.isFinite(c.num) ? { v: c.num, m: 0 } : { v: NaN, m: INVALID, key: 'data.expr.invalid.notNumber' };
    }
    case 'neg': {
      const a = evalRow(node.a, cell);
      return a.m ? a : { v: a.v === 0 ? 0 : -a.v, m: 0 };
    }
    case 'not': {
      const a = evalRow(node.a, cell);
      return a.m ? a : { v: a.v === 0 ? 1 : 0, m: 0 };
    }
    case 'logic': {
      const a = evalRow(node.a, cell);
      if (a.m) return a;
      const b = evalRow(node.b, cell);
      if (b.m) return b;
      const x = a.v !== 0;
      const y = b.v !== 0;
      return { v: (node.op === 'and' ? x && y : x || y) ? 1 : 0, m: 0 };
    }
    case 'cmp': {
      const a = evalRow(node.a, cell);
      if (a.m) return a;
      const b = evalRow(node.b, cell);
      if (b.m) return b;
      let r;
      switch (node.op) {
        case '<': r = a.v < b.v; break;
        case '<=': r = a.v <= b.v; break;
        case '>': r = a.v > b.v; break;
        case '>=': r = a.v >= b.v; break;
        case '==': r = a.v === b.v; break;
        default: r = a.v !== b.v; break;
      }
      return { v: r ? 1 : 0, m: 0 };
    }
    case 'bin': {
      const a = evalRow(node.a, cell);
      if (a.m) return a;
      const b = evalRow(node.b, cell);
      if (b.m) return b;
      let v;
      switch (node.op) {
        case '+': v = a.v + b.v; break;
        case '-': v = a.v - b.v; break;
        case '*': v = a.v * b.v; break;
        case '/':
          if (b.v === 0) return { v: NaN, m: INVALID, key: 'data.expr.invalid.divideByZero' };
          v = a.v / b.v;
          break;
        default:
          v = a.v ** b.v;
          if (Number.isNaN(v)) return { v: NaN, m: INVALID, key: 'data.expr.invalid.power' };
          break;
      }
      return finite(v);
    }
    case 'call':
      return evalCall(node, cell);
    default:
      return { v: NaN, m: INVALID, key: 'data.expr.invalid.notNumber' };
  }
}

function finite(v) {
  if (!Number.isFinite(v)) return { v: NaN, m: INVALID, key: 'data.expr.invalid.tooLarge' };
  return { v: v === 0 ? 0 : v, m: 0 };
}

function evalCall(node, cell) {
  const { fn, args } = node;
  if (fn === 'isMissing') {
    const a = evalRow(args[0], cell);
    return { v: a.m ? 1 : 0, m: 0 };
  }
  if (fn === 'if') {
    const c = evalRow(args[0], cell);
    if (c.m) return c;
    return evalRow(c.v !== 0 ? args[1] : args[2], cell);
  }
  const vals = [];
  for (const a of args) {
    const r = evalRow(a, cell);
    if (r.m) return r;
    vals.push(r.v);
  }
  const x = vals[0];
  switch (fn) {
    case 'abs': return finite(Math.abs(x));
    case 'sqrt':
      if (x < 0) return { v: NaN, m: INVALID, key: 'data.expr.invalid.sqrtNegative' };
      return finite(Math.sqrt(x));
    case 'ln':
      if (!(x > 0)) return { v: NaN, m: INVALID, key: 'data.expr.invalid.logNotPositive' };
      return finite(Math.log(x));
    case 'log10':
      if (!(x > 0)) return { v: NaN, m: INVALID, key: 'data.expr.invalid.logNotPositive' };
      return finite(Math.log10(x));
    case 'exp': return finite(Math.exp(x));
    case 'floor': return finite(Math.floor(x));
    case 'ceil': return finite(Math.ceil(x));
    case 'round': {
      const digits = vals.length > 1 ? vals[1] : 0;
      if (!Number.isInteger(digits) || digits < -15 || digits > 15) return { v: NaN, m: INVALID, key: 'data.expr.invalid.roundDigits' };
      return finite(roundHalfAway(x, digits));
    }
    case 'min': return finite(Math.min(...vals));
    case 'max': return finite(Math.max(...vals));
    case 'sum': return finite(sumOf(vals));
    case 'mean': return finite(sumOf(vals) / vals.length);
    case 'daysBetween': return finite(vals[1] - vals[0]);
    case 'monthsBetween':
      if (vals[1] < vals[0]) return { v: NaN, m: INVALID, key: 'data.expr.invalid.eventBeforeBirth' };
      return finite(monthsBetween(vals[0], vals[1]));
    default:
      return { v: NaN, m: INVALID, key: 'data.expr.invalid.notNumber' };
  }
}

function sumOf(vals) {
  let s = 0;
  for (const v of vals) s += v;
  return s;
}

/**
 * Round half away from zero to `digits` decimals (round(2.5) = 3, round(-2.5) = -3, round(1.005, 2) =
 * 1.01: the decimal shift is done on the number's shortest text, so 1.005 is not first stored as
 * 1.00499). Negative digits round to tens, hundreds and so on.
 */
export function roundHalfAway(x, digits = 0) {
  if (!Number.isFinite(x)) return x;
  const sign = x < 0 ? -1 : 1;
  const shifted = Number(shiftDecimal(String(Math.abs(x)), digits));
  const r = Math.round(shifted);
  const back = Number(shiftDecimal(String(r), -digits));
  const out = sign * back;
  return out === 0 ? 0 : out;
}

function shiftDecimal(s, by) {
  const m = /^(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/.exec(s);
  if (!m) return s;
  return `${m[1]}${m[2] ? `.${m[2]}` : ''}e${Number(m[3] || 0) + by}`;
}

/**
 * Evaluate a parsed formula over every row of a WorkingTable.
 * @param {any} ast
 * @param {import('../runtime/types.js').WorkingTable} table
 * @returns {{ values: Float64Array, missing: Uint8Array, invalid: number, invalidRows: { rowId: string, key: string }[] }}
 *   `missing` holds the reason code of each missing result (0 when present)
 */
export function evaluateExpression(ast, table) {
  const n = table.n;
  const values = new Float64Array(n);
  const missing = new Uint8Array(n);
  const invalidRows = [];
  const cols = table.columns || {};
  for (let r = 0; r < n; r++) {
    const res = evalRow(ast, (key) => {
      const c = cols[key];
      if (!c) return { miss: INVALID, num: NaN, text: null };
      const m = c.missing ? c.missing[r] : 0;
      if (m) return { miss: m, num: NaN, text: null };
      const v = c.values[r];
      if (c.kind === 'category') return { miss: 0, num: v, text: v >= 0 && c.levels ? c.levels[v] : null };
      if (c.kind === 'text') return { miss: 0, num: NaN, text: v };
      return { miss: 0, num: v, text: null };
    });
    values[r] = res.m ? NaN : res.v;
    missing[r] = res.m;
    if (res.m === INVALID) invalidRows.push({ rowId: table.rowIds[r], key: res.key || 'data.expr.invalid.notNumber' });
  }
  return { values, missing, invalid: invalidRows.length, invalidRows };
}

/** Every data.expr.* key this module can return (for the dictionary test and the screens). */
export const EXPR_KEYS = Object.freeze([
  'data.expr.empty', 'data.expr.tooLong', 'data.expr.tooDeep', 'data.expr.badNumber', 'data.expr.unclosedBrace',
  'data.expr.unexpectedChar', 'data.expr.singleEquals', 'data.expr.unexpectedClose', 'data.expr.unexpectedToken',
  'data.expr.unexpectedEnd', 'data.expr.unclosedParen', 'data.expr.needsBrackets', 'data.expr.unknownName',
  'data.expr.emptyColumn', 'data.expr.unknownColumn', 'data.expr.binaryNoPositive', 'data.expr.columnNotNumber',
  'data.expr.unknownFunction', 'data.expr.tooManyArgs', 'data.expr.argCount', 'data.expr.argCountMin', 'data.expr.argCountRange', 'data.expr.dateCompare',
  'data.expr.chainedComparison', 'data.expr.dateArithmetic', 'data.expr.ifTypes', 'data.expr.needsDates',
  'data.expr.invalid.notNumber', 'data.expr.invalid.divideByZero', 'data.expr.invalid.power', 'data.expr.invalid.tooLarge',
  'data.expr.invalid.sqrtNegative', 'data.expr.invalid.logNotPositive', 'data.expr.invalid.roundDigits',
  'data.expr.invalid.eventBeforeBirth',
]);
