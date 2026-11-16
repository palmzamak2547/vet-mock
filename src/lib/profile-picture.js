// profile-picture.js — a student's own picture, through /api/profile-picture.
//
// The browser's part: shrink the chosen picture (longest side 512 px) before it
// leaves the device, send it, and turn every answer into the words the student
// reads where they acted. The server judges the bytes and redraws the picture;
// nothing here is trusted for that. Links to pictures are minted per signed-in
// member and live for minutes, so they are kept only in memory, for as long as
// they are valid, and never in storage.
import { authHeader } from './api-auth.js';

export const SHRINK_TO = 512;
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
// A link is kept until a minute before the server says it stops working; an
// answer with no link (no picture, or a failure) is asked again after this.
const LINK_MARGIN_MS = 60 * 1000;
const NO_LINK_LIFE_MS = 4 * 60 * 1000;
const keepUntil = (expiresAt, now) => (Number(expiresAt) > now ? Number(expiresAt) - LINK_MARGIN_MS : now + NO_LINK_LIFE_MS);

// What the student reads, by what happened. 14 px or more where shown.
export const PICTURE_WORDS = Object.freeze({
  uploading: 'กำลังอัปโหลดรูป',
  saved: 'ใช้รูปนี้แล้ว เพื่อนในจุฬาที่เข้าสู่ระบบเห็นรูปนี้',
  removed: 'ลบรูปแล้ว กลับไปใช้รูปสำเร็จรูป',
  too_large: 'รูปนี้ใหญ่เกิน 2 MB เลือกรูปที่เล็กกว่านี้',
  too_many_pixels: 'รูปนี้ใหญ่เกินไป เลือกรูปที่เล็กกว่านี้',
  not_picture: 'ไฟล์นี้ไม่ใช่รูป ใช้ได้เฉพาะ JPEG, PNG หรือ WebP',
  animated: 'รูปเคลื่อนไหวใช้ไม่ได้ เลือกรูปนิ่ง',
  refused: 'ใช้รูปใหม่ไม่ได้ในตอนนี้ เพราะผู้ดูแล VetMock ซ่อนรูปของบัญชีนี้ไว้',
  offline: 'ออฟไลน์อยู่ ต่ออินเทอร์เน็ตแล้วลองอีกครั้ง',
  signin: 'เข้าสู่ระบบด้วยอีเมลจุฬาก่อน จึงใส่รูปได้',
  busy: 'ส่งรูปบ่อยเกินไป รอสักครู่แล้วลองอีกครั้ง',
  not_ready: 'ยังใส่รูปเองไม่ได้ในตอนนี้ ใช้รูปสำเร็จรูปไปก่อน',
  failed: 'บันทึกรูปไม่สำเร็จ ลองอีกครั้ง',
  hidden_reports: 'รูปของคุณถูกซ่อนจากเพื่อน เพราะมีเพื่อนหลายคนรายงานรูปนี้ เปลี่ยนรูปใหม่หรือกลับไปใช้รูปสำเร็จรูปได้',
  hidden_admin: 'ผู้ดูแล VetMock ซ่อนรูปของคุณจากเพื่อนไว้ ตอนนี้เพื่อนเห็นรูปสำเร็จรูปแทน',
  blocked: 'ผู้ดูแล VetMock ปิดการใส่รูปเองของบัญชีนี้ไว้ ตอนนี้ใช้รูปสำเร็จรูป',
  broken: 'โหลดรูปไม่ขึ้น จึงแสดงรูปสำเร็จรูปแทน เปิดหน้านี้ใหม่เพื่อลองอีกครั้ง',
  broken_some: 'บางรูปโหลดไม่ขึ้น จึงแสดงรูปสำเร็จรูปแทน',
  reported: 'รายงานแล้ว ขอบคุณที่ช่วยดูแล',
  report_failed: 'รายงานไม่สำเร็จ ลองอีกครั้ง',
});

const offline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

/** The error code an answer means, for PICTURE_WORDS. */
export function pictureProblem(status, error) {
  if (status === 401) return 'signin';
  if (status === 403) return error === 'refused' ? 'refused' : 'signin';
  if (status === 413) return 'too_large';
  if (status === 415) return error === 'animated' ? 'animated' : 'not_picture';
  if (status === 422) return 'too_many_pixels';
  if (status === 429) return 'busy';
  if (status === 503 && error === 'not_ready') return 'not_ready';
  return 'failed';
}

/** A File or Blob shrunk so its longest side is at most SHRINK_TO, as JPEG. */
export async function shrinkPicture(file) {
  if (!file || !/^image\//.test(file.type || '')) throw Object.assign(new Error('not_picture'), { code: 'not_picture' });
  if (file.size > 20 * MAX_UPLOAD_BYTES) throw Object.assign(new Error('too_large'), { code: 'too_large' });
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw Object.assign(new Error('not_picture'), { code: 'not_picture' });
  }
  const scale = Math.min(1, SHRINK_TO / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw Object.assign(new Error('failed'), { code: 'failed' });
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
  if (!blob) throw Object.assign(new Error('failed'), { code: 'failed' });
  if (blob.size > MAX_UPLOAD_BYTES) throw Object.assign(new Error('too_large'), { code: 'too_large' });
  return blob;
}

async function asBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let text = '';
  for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(text);
}

/** @type {Map<string, { url: string | null, state: string, until: number }>} */
const links = new Map();
const listeners = new Set();
const announce = () => listeners.forEach((fn) => fn());
export function onPicturesChanged(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function forgetPictures() {
  links.clear();
  announce();
}
/** A link that failed to load is not handed out again; the next ask mints a new one. */
export function forgetPictureUrl(url) {
  for (const [id, entry] of links) if (entry.url === url) links.delete(id);
}

// Links are minted for one signed-in account: another account on the same
// browser starts with none of them.
let viewer = '';
async function sameViewer() {
  const header = await authHeader();
  const token = String(/** @type {any} */ (header)?.Authorization || /** @type {any} */ (header)?.authorization || '').replace(/^Bearer\s+/i, '');
  let sub = '';
  try { sub = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub || ''; } catch { sub = ''; }
  if (sub !== viewer) { viewer = sub; links.clear(); }
}

async function call(method, query = '', body) {
  if (offline()) return { ok: false, problem: 'offline' };
  let response;
  try {
    response = await fetch(`/api/profile-picture${query}`, {
      method,
      headers: { ...(await authHeader()), ...(body ? { 'Content-Type': 'application/vmx-b64' } : {}) },
      body,
    });
  } catch {
    return { ok: false, problem: offline() ? 'offline' : 'failed' };
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return { ok: false, problem: pictureProblem(response.status, data?.error), status: response.status };
  return { ok: true, data };
}

/** Shrinks, sends and keeps the student's new picture. */
export async function uploadPicture(file, userId) {
  let blob;
  try {
    blob = await shrinkPicture(file);
  } catch (error) {
    return { ok: false, problem: /** @type {any} */ (error)?.code || 'not_picture' };
  }
  await sameViewer();
  const sent = await call('POST', '', `b64:${await asBase64(blob)}`);
  if (!sent.ok) return sent;
  links.set(userId, { url: sent.data.url || null, state: 'shown', until: keepUntil(sent.data.expiresAt, Date.now()) });
  announce();
  return { ok: true };
}

/** Removes the student's picture; the ready-made one shows again. */
export async function removePicture(userId) {
  const done = await call('DELETE');
  if (!done.ok) return done;
  links.set(userId, { url: null, state: 'none', until: Date.now() + NO_LINK_LIFE_MS });
  announce();
  return { ok: true };
}

/** Reports another member's picture. */
export async function reportPicture(ownerId) {
  const done = await call('POST', `?report=${encodeURIComponent(ownerId)}`);
  if (!done.ok) return done;
  if (done.data.hidden) links.delete(ownerId);
  announce();
  return { ok: true, hidden: done.data.hidden === true };
}

/** The pictures of these accounts as { [id]: { url, state } }; one request for those not known yet. */
export async function picturesFor(ids) {
  await sameViewer();
  const now = Date.now();
  const wanted = [...new Set(ids.filter((id) => typeof id === 'string' && id))];
  const missing = wanted.filter((id) => !(links.get(id)?.until > now));
  for (let i = 0; i < missing.length; i += 60) {
    const chunk = missing.slice(i, i + 60);
    const got = await call('GET', `?users=${chunk.join(',')}`);
    // A refusal or a failure leaves the ready-made pictures, and is not asked
    // again on every redraw: the next try comes when these entries expire.
    for (const id of chunk) {
      const row = got.ok ? got.data.pictures?.[id] : null;
      links.set(id, { url: row?.url || null, state: row?.state || 'none', until: keepUntil(row?.url ? row.expiresAt : 0, now) });
    }
  }
  /** @type {Record<string, { url: string | null, state: string }>} */
  const out = {};
  for (const id of wanted) {
    const known = links.get(id);
    if (known) out[id] = { url: known.url, state: known.state };
  }
  return out;
}
