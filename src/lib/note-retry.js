export const NOTES_RETRY_SESSION_KEY = 'vmx-notes-retry-target';

export function parseNoteRetryTarget(raw) {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    if (typeof value.subject !== 'string' || !value.subject.trim() || value.subject.length > 100) return null;
    if (value.topic != null && (typeof value.topic !== 'string' || value.topic.length > 200)) return null;
    return { subject: value.subject, topic: value.topic || null };
  } catch {
    return null;
  }
}

export function saveNoteRetryTarget(subject, topic, session = window.sessionStorage) {
  try {
    session.setItem(NOTES_RETRY_SESSION_KEY, JSON.stringify({ subject, topic: topic || null }));
    return true;
  } catch {
    return false;
  }
}

export function readNoteRetryTarget(session = window.sessionStorage) {
  try {
    return parseNoteRetryTarget(session.getItem(NOTES_RETRY_SESSION_KEY));
  } catch {
    return null;
  }
}

export function clearNoteRetryTarget(session = window.sessionStorage) {
  try {
    session.removeItem(NOTES_RETRY_SESSION_KEY);
    return true;
  } catch {
    return false;
  }
}

export function consumeNoteRetryTarget(session = window.sessionStorage) {
  const target = readNoteRetryTarget(session);
  clearNoteRetryTarget(session);
  return target;
}
