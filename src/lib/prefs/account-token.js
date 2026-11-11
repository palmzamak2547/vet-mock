// ============================================================
// prefs/account-token.js — the account's copy of the preferences that follow
// the student, as one short string in the sign-in account's user_metadata
// ============================================================
// user_metadata travels inside every access token, so the copy stays small
// (512 bytes at most) and plain:
//
//   p1;t=<ms base36>;pa=ocean;ah=210;co=1;lo=pages;ce=confetti;rp=ink;bu=mimi;rr=1.25;cd=c1.bgraph
//
// p1 is the version, t when it was written (newest wins). Every other part is
// one row of src/lib/prefs/table.js under a two-letter code; a code this
// build does not know is ignored, and a value its row does not accept drops
// that part. Codes are looked up in a Map, never as object keys, so
// "__proto__=..." is just an unknown code. Imported like any untrusted data
// (AGENTS.md rule 8): nothing outside the table's own choices gets through.
// ============================================================

import { prefRow, validFor, ACCOUNT_PREFS } from './table.js';

export const ACCOUNT_META_KEY = 'vmx_prefs';
export const TOKEN_VERSION = 'p1';
export const MAX_TOKEN_BYTES = 512;

// code -> [row id, encode, decode]
const bool = [(v) => (v ? '1' : '0'), (s) => (s === '1' ? true : s === '0' ? false : undefined)];
const str = [(v) => String(v), (s) => s];
const num = [(v) => String(v), (s) => (/^\d+(\.\d+)?$/.test(s) ? Number(s) : undefined)];
export const CODES = new Map([
  ['pa', ['palette', ...str]],
  ['ah', ['accentHue', ...num]],
  ['co', ['motion.companion', ...bool]],
  ['lo', ['motion.loader', ...str]],
  ['ce', ['motion.celebration', ...str]],
  ['rp', ['motion.readingPointer', ...str]],
  ['bu', ['buddy', ...str]],
  ['rr', ['readAloudRate', ...num]],
  ['cd', ['card', ...str]],
]);
const CODE_FOR = new Map([...CODES].map(([code, [id]]) => [id, code]));

/** Every row that follows the account has a code (a unit test holds this). */
export const uncodedAccountPrefs = () => ACCOUNT_PREFS.filter((id) => !CODE_FOR.has(id));

const byteLength = (s) => (typeof TextEncoder === 'undefined' ? s.length : new TextEncoder().encode(s).length);

/** The token for `values` ({ rowId: value }) written at `at` (ms). */
export function encodeAccountToken(values, at) {
  const parts = [TOKEN_VERSION, `t=${Math.max(0, Math.floor(at)).toString(36)}`];
  for (const [id, v] of Object.entries(values || {})) {
    const code = CODE_FOR.get(id);
    if (!code || !validFor(id, v)) continue;
    const [, enc] = CODES.get(code);
    const s = enc(v);
    if (!/^[a-z0-9.,-]+$/i.test(s)) continue;
    parts.push(`${code}=${s}`);
  }
  const token = parts.join(';');
  return byteLength(token) <= MAX_TOKEN_BYTES ? token : null;
}

/** { at, values } from a token, or null when it is not one. */
export function parseAccountToken(raw) {
  if (typeof raw !== 'string' || raw.length === 0 || byteLength(raw) > MAX_TOKEN_BYTES) return null;
  const parts = raw.split(';');
  if (parts[0] !== TOKEN_VERSION) return null;
  const stamp = /^t=([0-9a-z]{1,10})$/.exec(parts[1] || '');
  if (!stamp) return null;
  const at = parseInt(stamp[1], 36);
  if (!Number.isFinite(at) || at <= 0) return null;
  const values = Object.create(null);
  for (const part of parts.slice(2)) {
    const eq = part.indexOf('=');
    if (eq < 1) continue;
    const entry = CODES.get(part.slice(0, eq));
    if (!entry) continue;
    const [id, , dec] = entry;
    const v = dec(part.slice(eq + 1));
    if (v !== undefined && prefRow(id) && validFor(id, v)) values[id] = v;
  }
  return { at, values: { ...values } };
}
