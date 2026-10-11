// ============================================================
// guide-progress.js — what the วิธีใช้ guide remembers, and how a hint opens it
// ============================================================
// The guide (components/OnboardingTour.jsx, content in data/how-to.js) is a
// short list of goals a student actually has: ฝึกทุกวัน, เตรียมสอบ,
// ทบทวนข้อที่ผิด, อ่านสรุปแล้วพิมพ์เป็น PDF, ค้นหาและถาม, ใช้บนมือถือ. This
// module is the guide's only memory, kept pure and dependency-free so it can
// be tested in Node the way lib/first-tip.js is.
//
// Storage, all of it a per-device convenience (never a fact anyone relies on):
//   localStorage  `vmx-guide`       { v: 1, seen: [goalId…], last: goalId }
//   sessionStorage `vmx-guide-open` a goal id the next open should start at
//
// Deliberate choices:
//   • Progress counts only goals the guide still has. A retired goal id in an
//     old blob must not keep "ดูแล้ว 6 จาก 6" true after the list changed.
//   • Every read and write is wrapped. Private mode, a refused write or a
//     corrupted blob reads as "nothing seen" and the next write replaces it.
//   • The open-at request is PEEKED while rendering and CONSUMED after the
//     guide has committed, the capture/consume pattern of takeViewIntent in
//     lib/feature-registry.js. React.StrictMode renders twice in development,
//     and a read-once in the render would hand the second render nothing.
//   • A hint may offer "ดูวิธีใช้ทั้งหมด" only when the app has said it
//     listens (App.jsx sets GUIDE_READY_ATTR on <html> while its listener is
//     mounted). Without that the link would be a control that does nothing.
// ============================================================

export const GUIDE_STORAGE_KEY = 'vmx-guide';
export const GUIDE_PENDING_KEY = 'vmx-guide-open';
export const GUIDE_OPEN_EVENT = 'vmx-open-guide';
export const GUIDE_READY_ATTR = 'data-vmx-guide';

const isId = (v) => typeof v === 'string' && v.length > 0;

function readRaw() {
  try {
    const raw = localStorage.getItem(GUIDE_STORAGE_KEY);
    if (!raw) return { seen: [], last: null };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { seen: [], last: null };
    const seen = Array.isArray(parsed.seen) ? [...new Set(parsed.seen.filter(isId))] : [];
    const last = isId(parsed.last) ? parsed.last : null;
    return { seen, last };
  } catch {
    return { seen: [], last: null };
  }
}

/**
 * The goals opened on this device, oldest first, and the last one opened.
 * Pass the guide's current goal ids to drop any the guide no longer has.
 */
export function readGuideProgress(validIds = null) {
  const { seen, last } = readRaw();
  if (!Array.isArray(validIds)) return { seen, last };
  const known = new Set(validIds);
  return { seen: seen.filter((id) => known.has(id)), last: known.has(last) ? last : null };
}

/** Record that a goal was opened. Unknown ids are ignored when the list is given. */
export function markGuideSeen(id, validIds = null) {
  if (!isId(id)) return readGuideProgress(validIds);
  if (Array.isArray(validIds) && !validIds.includes(id)) return readGuideProgress(validIds);
  const { seen } = readRaw();
  const next = { v: 1, seen: seen.includes(id) ? seen : [...seen, id], last: id };
  try {
    localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage refused: the guide simply forgets, it never throws.
  }
  return readGuideProgress(validIds);
}

/** Ask the next opening of the guide to start at one goal (null clears). */
export function requestGuidePath(id) {
  try {
    if (isId(id)) sessionStorage.setItem(GUIDE_PENDING_KEY, id);
    else sessionStorage.removeItem(GUIDE_PENDING_KEY);
  } catch {
    // No session store: the guide opens at its list instead.
  }
}

/** Read the pending goal without using it up (safe to call while rendering). */
export function peekGuidePath() {
  try {
    const v = sessionStorage.getItem(GUIDE_PENDING_KEY);
    return isId(v) ? v : null;
  } catch {
    return null;
  }
}

/** Use the request up, unless a newer one replaced it since it was peeked. */
export function consumeGuidePath(captured) {
  try {
    if (isId(captured) && sessionStorage.getItem(GUIDE_PENDING_KEY) === captured) {
      sessionStorage.removeItem(GUIDE_PENDING_KEY);
    }
  } catch {
    // Keep the request; at worst the next open starts at the same goal.
  }
}

/** True while the app is listening for GUIDE_OPEN_EVENT. */
export function canOpenGuide() {
  try {
    return typeof document !== 'undefined'
      && document.documentElement?.getAttribute?.(GUIDE_READY_ATTR) === 'ready';
  } catch {
    return false;
  }
}

/**
 * Open the guide at one goal from anywhere (a usage hint's "ดูวิธีใช้ทั้งหมด").
 * The launcher is handed to the app so closing the guide returns focus to it.
 * Returns false, and leaves no request behind, when nobody is listening.
 */
export function openGuide(id, launcher = null) {
  if (!canOpenGuide()) return false;
  requestGuidePath(id);
  try {
    window.dispatchEvent(new CustomEvent(GUIDE_OPEN_EVENT, { detail: { launcher } }));
    return true;
  } catch {
    requestGuidePath(null);
    return false;
  }
}
