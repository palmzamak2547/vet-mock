// Ask the browser, once, to keep this site's storage.
//
// Flashcards, cloze and image-occlusion decks, the pinboard, video notes,
// clips a student added, watch history and notebooks live only on the device
// (local-extras.js, notebook.js). Without a persistent-storage grant the
// browser may clear them when the device runs short of space, and Safari
// clears script-written storage of a site not visited for a while.
//
// The ask happens at the moment it means something, the first time a student
// saves something of their own, and only once per device: a refusal is
// remembered, never repeated, and nothing is shown either way. Firefox answers
// with a permission prompt, so:
// - never while a question set or an exam is on screen (the pin button in the
//   question toolbar saves mid-exam): that save does not ask, a later one does;
// - never from a write a read makes (the flashcards' id migration passes
//   ask: false to writeLocalExtra);
// - a prompt left unanswered (a promise that never settles) is asked at most
//   once per session: the session mark is set before asking.

const ASKED_KEY = 'vmx-persist-asked';
let pending = null;

function flag(storage, key) {
  try { return storage?.getItem(key) === '1'; } catch { return true; }
}

function mark(storage, key) {
  try { storage?.setItem(key, '1'); } catch { /* storage full or blocked: asking again later is harmless */ }
}

/** A question card or an exam is on screen (Question.jsx, ExamView.jsx). */
export function studyOnScreen(doc = globalThis.document) {
  try { return !!doc?.querySelector?.('.vmx-question-card, .vmx-exam-top'); } catch { return true; }
}

/**
 * Resolves to true when storage is (now) persistent, false otherwise. Never
 * throws, never asks twice on one device, never asks during a set or an exam.
 */
export function keepDeviceWork({
  nav = globalThis.navigator,
  storage = globalThis.localStorage,
  session = globalThis.sessionStorage,
  doc = globalThis.document,
} = {}) {
  if (pending) return pending;
  const api = nav?.storage;
  if (!api || typeof api.persist !== 'function' || flag(storage, ASKED_KEY) || flag(session, ASKED_KEY)) return Promise.resolve(false);
  if (studyOnScreen(doc)) return Promise.resolve(false);
  mark(session, ASKED_KEY);
  pending = (async () => {
    try {
      if (typeof api.persisted === 'function' && await api.persisted()) return true;
      return (await api.persist()) === true;
    } catch {
      return false;
    } finally {
      mark(storage, ASKED_KEY);
    }
  })();
  return pending;
}

/** Tests only. */
export function resetKeepDeviceWork() { pending = null; }
