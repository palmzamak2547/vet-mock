// ============================================================
// xp-account.js — the level that follows the account
// ============================================================
// Split from xp.js so the first load (which awards XP) carries none of it:
// only the header chip (lazy) and the profile hub read these.
// ============================================================

import { XP_AWARDS, getXpState } from './xp.js';

/**
 * XP rebuilt from what follows the account: every answer in the synced
 * history (XP_AWARDS for a right or a wrong answer) and every review counted
 * on a synced SR card. Any device holding the account computes the same
 * number from the same rows, so the level is the same everywhere.
 */
export function accountXp({ history = [], srCards = {} } = {}) {
  let xp = 0;
  for (const row of Array.isArray(history) ? history : []) {
    if (!row) continue;
    xp += row.correct === true ? XP_AWARDS.correctAnswer : XP_AWARDS.wrongAnswer;
  }
  for (const card of Object.values(srCards && typeof srCards === 'object' ? srCards : {})) {
    const n = Math.max(0, Math.floor(Number(card?.totalReviews) || 0));
    xp += n * XP_AWARDS.srGrade;
  }
  return xp;
}

// ── The level that follows the account ─────────────────────────────
// What the app awards XP for today: answers (in the synced history), SR
// grades (counted on the synced cards) and daily-quest rewards (quests.js,
// kept per day on the device only). The daily question and reading award
// nothing (XP_AWARDS.dailyQ and notesRead are never granted). So the one
// device-only part is quest points. It travels in the account's metadata,
// written through identity-write.js rarely:
//   xp_quests   quest points, added when a quest is claimed (a few a day)
//   xp_carry    { <device id>: n }: this device's old counter's lead over the
//               account, recorded once per device. Keyed by device, so a
//               second tab writing it again overwrites, never adds.

const SYNC_OWNER_KEY = 'vmx-user-sync-owner-v1';
const DEVICE_KEY = 'vmx-device-id';
const OWNER_KEY = 'vmx-xp-owner';
export const carriedKey = (uid) => `vmx-xp-carried:${uid}`;
export const pendingKey = (uid) => `vmx-xp-pending:${uid}`;

const read = (storage, key) => { try { return storage?.getItem(key) ?? null; } catch { return null; } };
const write = (storage, key, value) => { try { storage?.setItem(key, String(value)); } catch { /* private mode */ } };
const count = (value) => Math.max(0, Math.floor(Number(value) || 0));

/** The account the sync store holds this device for, or null for a guest. */
export function deviceAccount(storage = globalThis.localStorage) {
  try {
    const v = JSON.parse(read(storage, SYNC_OWNER_KEY) || 'null');
    return typeof v === 'string' && v && v !== 'anonymous' ? v : null;
  } catch { return null; }
}

/** A random id for this browser, made once. */
export function deviceId(storage = globalThis.localStorage) {
  let id = read(storage, DEVICE_KEY);
  if (!id) {
    id = globalThis.crypto?.randomUUID?.() || `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    write(storage, DEVICE_KEY, id);
  }
  return id;
}

/** The account metadata's carried XP: quest points and every device's carry. */
export function extraXpOf(user) {
  const md = user?.user_metadata || {};
  const carries = md.xp_carry && typeof md.xp_carry === 'object' ? Object.values(md.xp_carry) : [];
  return count(md.xp_quests) + carries.reduce((sum, n) => sum + count(n), 0);
}

/** Quest points this account earned on this device and not yet added. */
export const pendingXp = (uid, storage = globalThis.localStorage) => (uid ? count(read(storage, pendingKey(uid))) : 0);
export const setPendingXp = (uid, n, storage = globalThis.localStorage) => { if (uid) write(storage, pendingKey(uid), count(n)); };

/**
 * Whether this device's old counter can be this account's. Every answer the
 * account gave here is in its synced history, so a counter that recorded more
 * answers than the whole history holds also counts someone else's (a second
 * student on a shared phone). Once one account has carried it, it is that
 * account's alone.
 */
export function counterIsTheirs({ user, history = [], device = getXpState(), storage = globalThis.localStorage } = {}) {
  if (!user?.id) return false;
  const owner = read(storage, OWNER_KEY);
  if (owner) return owner === user.id;
  return count(device?.lifetimeQs) <= (Array.isArray(history) ? history.length : 0);
}

/**
 * The XP a student sees, one function of data that follows the account:
 * rebuilt answers and reviews plus the carried metadata. Two terms are
 * transitional, both only on the device that earned them: this account's
 * quest points not yet added (flushed by XpChip within a moment when online),
 * and, until this device's one-time carry is recorded, the old counter where
 * it is higher and can be this account's. A guest's level is the counter.
 */
export function shownXp({ history = [], srCards = {}, user = null, device = getXpState(), storage = globalThis.localStorage } = {}) {
  const rebuilt = accountXp({ history, srCards });
  const counter = count(device?.totalXp);
  if (!user?.id) return Math.max(rebuilt, counter);
  const own = rebuilt + extraXpOf(user) + pendingXp(user.id, storage);
  const carried = read(storage, carriedKey(user.id)) === '1';
  if (carried || !counterIsTheirs({ user, history, device, storage })) return own;
  return Math.max(own, counter);
}

/**
 * What to add to the account now. `ready` is the sync store having finished
 * this account's first pull: before that its history is empty, and a lead
 * measured then would count every answer twice. The carry is this device's
 * counter's lead over the account excluding this device's own earlier carry
 * (so writing it again is the same number), only where the counter can be
 * this account's; quest points already counted on the device are inside it.
 */
export function xpToCarry({ user, history = [], srCards = {}, device = getXpState(), storage = globalThis.localStorage, ready = false } = {}) {
  const none = { addQuests: 0, carry: null, first: false };
  if (!user?.id || !ready) return none;
  const pending = pendingXp(user.id, storage);
  if (read(storage, carriedKey(user.id)) === '1') return { ...none, addQuests: pending };
  if (!counterIsTheirs({ user, history, device, storage })) return { ...none, addQuests: pending, first: true, owns: false };
  const id = deviceId(storage);
  const md = user.user_metadata || {};
  const mine = count(md.xp_carry?.[id]);
  const others = extraXpOf(user) - mine;
  const lead = Math.max(0, count(device?.totalXp) - (accountXp({ history, srCards }) + others));
  // Nothing ahead of the account: done here, nothing written (a fresh browser
  // or a private window must not add a key to the metadata every token
  // carries), and the counter is NOT claimed, so the student whose counter it
  // is can still carry it when they sign in on this device.
  if (lead === 0) return { addQuests: pending, carry: null, first: true, owns: false };
  return { addQuests: 0, carry: { device: id, value: lead }, first: true, owns: true };
}

/** Record on the device that the carry for this account is done; only a
 *  carry above zero claims the counter for the account. */
export function markCarried(uid, storage = globalThis.localStorage, { owns = false } = {}) {
  write(storage, carriedKey(uid), '1');
  if (owns && !read(storage, OWNER_KEY)) write(storage, OWNER_KEY, uid);
}
