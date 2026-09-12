// Device-local tools retain their original keys until a user explicitly
// restores an archive. A restored bundle is one atomic localStorage write;
// subsequent edits use that bundle so a failed restore cannot apply half of it.
export const LOCAL_EXTRA_FIELDS = Object.freeze({
  'vmx-video-notes': { label: 'โน้ตวิดีโอ', type: 'object' },
  'vmx-pinboard': { label: 'Pinboard', type: 'array' },
  'vmx-user-flashcards': { label: 'Flashcard และ Cloze ส่วนตัว', type: 'array' },
  'vmx-image-occlusion-decks': { label: 'ชุดปิดภาพทบทวน', type: 'array' },
  // Clips a student added themselves are their own work, and the watch history
  // is the only record of what they have been through. Neither was in the main
  // backup nor in this bundle, so "ย้ายข้อมูล" restored everything except
  // those two — they were simply gone on the new device.
  'vmx-custom-videos': { label: 'คลิปที่เพิ่มเอง', type: 'array' },
  'vmx-watched-videos': { label: 'ประวัติการดูคลิป', type: 'object' },
});
const BUNDLE_KEY = 'vmx-local-extras-v1';
let cachedStorage, cachedBundle, cacheReady = false, corrupt = false;
let listeningWindow;
const copy = value => JSON.parse(JSON.stringify(value));

function storageAndBundle() {
  const storage = window.localStorage;
  if (listeningWindow !== window) {
    listeningWindow?.removeEventListener?.('storage', invalidate);
    listeningWindow = window;
    listeningWindow.addEventListener?.('storage', invalidate);
    cacheReady = false;
  }
  if (!cacheReady || cachedStorage !== storage) {
    cachedStorage = storage;
    cacheReady = true;
    corrupt = false;
    try {
      const raw = storage.getItem(BUNDLE_KEY);
      cachedBundle = raw ? JSON.parse(raw) : null;
      if (cachedBundle && (typeof cachedBundle !== 'object' || Array.isArray(cachedBundle))) throw new Error('invalid bundle');
    } catch { corrupt = true; cachedBundle = null; }
  }
  return { storage, bundle: cachedBundle };
}

function invalidate(event) {
  if (!event || event.key === null || event.key === BUNDLE_KEY) cacheReady = false;
}

export function readLocalExtra(key, fallback) {
  try {
    const { storage, bundle } = storageAndBundle();
    if (corrupt) return copy(fallback);
    if (bundle && Object.prototype.hasOwnProperty.call(bundle, key)) return copy(bundle[key]);
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : copy(fallback);
  } catch { return copy(fallback); }
}

export function writeLocalExtra(key, value) {
  if (!LOCAL_EXTRA_FIELDS[key]) return false;
  try {
    const { storage, bundle } = storageAndBundle();
    if (corrupt) return false;
    if (bundle) {
      const next = { ...bundle, [key]: value };
      storage.setItem(BUNDLE_KEY, JSON.stringify(next));
      cachedBundle = copy(next);
    } else storage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}

export function exportLocalExtras() {
  const { storage, bundle } = storageAndBundle();
  if (corrupt) throw new Error('อ่านข้อมูลเครื่องมือไม่ได้ กรุณาเก็บข้อมูลเว็บไซต์ไว้แล้วลองอีกครั้ง');
  const data = Object.fromEntries(Object.entries(LOCAL_EXTRA_FIELDS).map(([key, field]) => {
    const value = bundle && Object.prototype.hasOwnProperty.call(bundle, key) ? copy(bundle[key])
      : storage.getItem(key) ? JSON.parse(storage.getItem(key)) : field.type === 'array' ? [] : {};
    return [key, value];
  }));
  const archive = { format: 'vetmock-local-extras-v1', exportedAt: new Date().toISOString(), data };
  if (!parseLocalExtras(archive).success) throw new Error('ข้อมูลเครื่องมือบางส่วนอ่านไม่ครบ ยังไม่สร้างไฟล์สำรอง');
  return archive;
}

function safeJson(value) {
  const stack = [value];
  let count = 0;
  while (stack.length) {
    const node = stack.pop();
    if (++count > 200000) return false;
    if (typeof node === 'number' && !Number.isFinite(node)) return false;
    if (node && typeof node === 'object') {
      for (const key of Object.keys(node)) {
        if (['__proto__', 'prototype', 'constructor'].includes(key)) return false;
        stack.push(node[key]);
      }
    }
  }
  return true;
}

const object = value => value && typeof value === 'object' && !Array.isArray(value);
const positiveId = id => Number.isSafeInteger(id) && id >= 0;
export function parseLocalExtras(value) {
  if (value?.format !== 'vetmock-local-extras-v1' || !object(value.data) || !safeJson(value.data)) return { success: false, reason: 'รูปแบบข้อมูลเพิ่มเติมไม่ถูกต้อง' };
  const keys = Object.keys(value.data);
  if (!keys.length || keys.some(key => !LOCAL_EXTRA_FIELDS[key])) return { success: false, reason: 'มีประเภทข้อมูลที่ไม่รองรับ' };
  for (const key of keys) {
    const data = value.data[key], type = LOCAL_EXTRA_FIELDS[key].type;
    if (type === 'array' ? !Array.isArray(data) : !object(data)) return { success: false, reason: `รูปแบบ ${LOCAL_EXTRA_FIELDS[key].label} ไม่ถูกต้อง` };
    let valid = true;
    if (key === 'vmx-video-notes') valid = Object.values(data).every(bucket => object(bucket) && Array.isArray(bucket.notes)
      && bucket.notes.every(note => object(note) && positiveId(note.id) && typeof note.text === 'string' && Number.isFinite(note.t) && note.t >= 0));
    if (key === 'vmx-pinboard') valid = data.every(pin => object(pin) && positiveId(pin.id) && typeof pin.label === 'string' && object(pin.payload)
      && ['question', 'summary', 'flashcard', 'note'].includes(pin.type));
    if (key === 'vmx-user-flashcards') valid = data.every(card => object(card) && positiveId(card.id) && ['flashcard', 'cloze'].includes(card.type)
      && typeof card.q === 'string' && typeof card.front === 'string' && typeof card.back === 'string'
      && (card.type !== 'cloze' || (typeof card.fullText === 'string' && Number.isInteger(card.clozeIdx) && card.clozeIdx > 0 && typeof card.deckGroupId === 'string')));
    if (key === 'vmx-image-occlusion-decks') valid = data.every(deck => object(deck) && positiveId(deck.id)
      && typeof deck.imageDataUrl === 'string' && /^data:image\/(png|jpeg|webp|gif);base64,/.test(deck.imageDataUrl)
      && Array.isArray(deck.masks) && deck.masks.every(mask => object(mask) && mask.w > 0 && mask.h > 0 && ['x', 'y', 'w', 'h'].every(k => Number.isFinite(mask[k]) && mask[k] >= 0 && mask[k] <= 1)));
    // A custom clip needs the two fields the list renders from; anything else
    // on the object is the student's own metadata and is carried as-is.
    if (key === 'vmx-custom-videos') valid = data.every(clip => object(clip)
      && typeof clip.url === 'string' && clip.url.length > 0 && typeof clip.topic === 'string');
    // videoId -> { watchedAt }. A malformed entry would make the "watched"
    // badge lie about what the student has been through.
    if (key === 'vmx-watched-videos') valid = Object.values(data).every(entry => object(entry)
      && Number.isFinite(entry.watchedAt));
    if (!valid) return { success: false, reason: `ข้อมูล ${LOCAL_EXTRA_FIELDS[key].label} ไม่ครบหรือผิดชนิด` };
  }
  return { success: true, data: value.data, labels: keys.map(key => LOCAL_EXTRA_FIELDS[key].label) };
}

export function restoreLocalExtras(value) {
  const parsed = parseLocalExtras(value);
  if (!parsed.success) return { ok: false, reason: parsed.reason };
  try {
    const storage = window.localStorage;
    const complete = Object.keys(LOCAL_EXTRA_FIELDS).every(key => Object.prototype.hasOwnProperty.call(parsed.data, key));
    const old = complete ? {} : exportLocalExtras().data;
    const next = { ...old, ...parsed.data };
    storage.setItem(BUNDLE_KEY, JSON.stringify(next));
    cachedStorage = storage; cachedBundle = copy(next); corrupt = false; cacheReady = true;
    for (const name of ['vmx-pinboard-changed', 'vmx-user-flashcards-changed', 'vmx-image-occlusion-changed', 'vmx-palette-invalidate']) {
      window.dispatchEvent?.(new Event(name));
    }
    return { ok: true };
  } catch { return { ok: false, reason: 'พื้นที่ในเครื่องไม่พอหรืออ่านข้อมูลเดิมไม่ครบ ข้อมูลเดิมยังไม่ถูกเปลี่ยน' }; }
}
