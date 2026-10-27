// Conversations stay on this device (localStorage), at most 40, newest first.
// Every read and write is guarded: a private window or blocked storage must
// never break the page, it just forgets.

const KEY = 'vmai-chats-v1';
const MAX = 40;

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter((c) => c && typeof c.id === 'string' && Array.isArray(c.messages)) : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // quota or blocked: drop the oldest half once, then give up quietly
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, Math.floor(MAX / 2)))); } catch { /* forget */ }
  }
}

export const listChats = () => read().sort((a, b) => b.updated - a.updated);

export function saveChat(chat) {
  if (!chat.messages.length) return;
  const list = read().filter((c) => c.id !== chat.id);
  // images are not kept: a base64 photo would fill the quota in a few chats
  const messages = chat.messages.map(({ image, ...m }) => ({ ...m, hadImage: m.hadImage || !!image }));
  list.unshift({ ...chat, messages, updated: Date.now() });
  write(list);
}

export function deleteChat(id) {
  write(read().filter((c) => c.id !== id));
}

export function clearChats() {
  try { localStorage.removeItem(KEY); } catch { /* blocked */ }
}

export const newId = () => `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function titleFor(text) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= 48) return t;
  // cut on a word (Intl.Segmenter knows Thai words), never mid-syllable
  try {
    const seg = new Intl.Segmenter('th', { granularity: 'word' });
    let out = '';
    for (const s of seg.segment(t)) {
      if ((out + s.segment).length > 46) break;
      out += s.segment;
    }
    return `${out.trim()}…`;
  } catch {
    return `${t.slice(0, 46)}…`;
  }
}

export function getPref(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
export function setPref(key, value) {
  try { localStorage.setItem(key, value); } catch { /* blocked */ }
}
