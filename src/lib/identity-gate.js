// ============================================================
// identity-gate.js — when the "how classmates see you" step may show
// ============================================================
// Tiny on purpose: App reads it on every render of Home, so it stays in the
// first load. Everything else about a public name (rules, pictures, the
// surfaces it reaches) lives in public-identity.js, which only lazy screens
// import.
//
// A public name is one of three kinds:
//   chosen     the student typed it (signup, the account page, this step)
//   auto       the database made it: handle_new_user strips a name to ASCII,
//              so a Thai Google name becomes "user", then user_2, user_3, or
//              user_<6 hex> after 99 collisions; useAuth's stand-in "นิสิต"
//   fromEmail  the part of the address before the @. For a Chula address
//              that is the 10-digit student number, so it is never offered
//              and, where it is already stored, it is treated as not chosen.
// ============================================================

const AUTO = /^user(?:_\d{1,2}|_[0-9a-f]{6})?$/i;
export const STAND_IN_NAME = 'นิสิต';

/** The part of an address before the @, lower-cased; '' when there is none. */
export function emailLocalPart(email) {
  if (typeof email !== 'string') return '';
  const at = email.indexOf('@');
  return at > 0 ? email.slice(0, at).trim().toLowerCase() : '';
}

// handle_new_user keeps the ASCII letters of the Google name (25 at most),
// so an English Google name is published as the real full name, then _2, _3
// or _<6 hex> on a collision.
const googleHandle = (value) => String(value ?? '').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 25);
function madeFromGoogleName(n, user) {
  const md = user?.user_metadata || {};
  // Saved by the student through the editor (or typed at signup): a choice.
  if (typeof md.username === 'string' && md.username === n) return false;
  for (const source of [md.full_name, md.name]) {
    const base = googleHandle(source);
    if (!base) continue;
    if (n === base || n.startsWith(`${base}_`) && /^(\d{1,2}|[0-9a-f]{6})$/.test(n.slice(base.length + 1))) return true;
  }
  return false;
}

/** True when nobody chose this name: made by the database (user_N, or the
 *  ASCII letters of the Google name when `user` is given), the app's
 *  stand-in, the email's local part, or a bare run of digits (a student
 *  number). */
export function isAutoName(name, email = '', user = null) {
  const n = String(name ?? '').trim();
  if (!n) return true;
  if (n === STAND_IN_NAME || AUTO.test(n)) return true;
  if (/^\d{5,}$/.test(n)) return true;
  if (user && madeFromGoogleName(n, user)) return true;
  const local = emailLocalPart(email);
  return Boolean(local) && n.toLowerCase() === local;
}

export const introSeenKey = (uid) => `vmx-identity-intro:${uid}`;

/**
 * Whether the first-run step shows now. Pure: storage and state are passed in.
 * It shows once, on Home only (never inside an exam, a set or any other
 * screen), never while a set waits to be resumed or the wall's welcome plays,
 * only for a real profile row (the stand-in has no created_at), and only to a
 * student who never chose a name.
 */
export function identityIntroDue({ user, profile, view, pendingResume = false, welcome = false, seen = false }) {
  if (!user?.id || seen) return false;
  if (view !== 'home' || pendingResume || welcome) return false;
  if (!profile || profile.id !== user.id || !profile.created_at) return false;
  const md = user.user_metadata || {};
  if (md.identity_intro_done) return false;
  const chose = typeof md.username === 'string' && md.username && md.username === profile.username
    && !isAutoName(profile.username, user.email, user);
  return !chose;
}

/** Whether this device already recorded the step for this account. */
export function introSeen(storage, uid) {
  try { return Boolean(uid) && storage?.getItem(introSeenKey(uid)) === '1'; } catch { return false; }
}

export function markIntroSeen(storage, uid) {
  try { if (uid) storage?.setItem(introSeenKey(uid), '1'); } catch { /* private mode */ }
}
