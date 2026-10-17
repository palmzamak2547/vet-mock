// Pictures and video, made ready in the browser before they are sent: a photo is turned the
// right way up, scaled down and re-encoded (WebP, or JPEG where the browser cannot write WebP),
// which also drops its location and camera data; a video is checked for size and length and given
// a poster from its first frame. The database checks the same limits (vca_media migrations).

export const LIMITS = {
  imageMaxEdge: 2048,
  avatarEdge: 512,
  imageQuality: 0.84,
  videoBytes: 50 * 1024 * 1024,
  videoSeconds: 120,
  inputImageBytes: 30 * 1024 * 1024,
};
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif', 'image/avif'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const ACCEPT_IMAGES = 'image/*';
export const ACCEPT_MEDIA = 'image/*,video/mp4,video/webm,video/quicktime';

export class MediaProblem extends Error {}

const isVideo = (file) => VIDEO_TYPES.includes(file.type) || /\.(mp4|webm|mov|m4v)$/i.test(file.name || '');

function canvasBlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((webp) => {
      // Safari writes PNG when asked for WebP on some versions: fall back to JPEG.
      if (webp && webp.type === 'image/webp') { resolve({ blob: webp, ext: 'webp', type: 'image/webp' }); return; }
      canvas.toBlob((jpg) => resolve(jpg ? { blob: jpg, ext: 'jpg', type: 'image/jpeg' } : null), 'image/jpeg', quality);
    }, 'image/webp', quality);
  });
}

async function decode(file) {
  if (file.size > LIMITS.inputImageBytes) throw new MediaProblem('รูปใหญ่เกิน 30 MB');
  try {
    // from-image: phones store the turn in EXIF; this draws the photo the way it was taken.
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // HEIC opens only where the browser can read it (Safari).
    throw new MediaProblem(/heic|heif/i.test(file.type || file.name) ? 'เบราว์เซอร์นี้เปิดรูป HEIC ไม่ได้ ลองถ่ายเป็น JPEG หรือแปลงก่อน' : 'เปิดรูปนี้ไม่ได้ ลองรูปอื่น');
  }
}

/** A photo for a post, comment or message: longest edge at most 2048 px. */
export async function prepareImage(file) {
  const bmp = await decode(file);
  const scale = Math.min(1, LIMITS.imageMaxEdge / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close?.();
  const out = await canvasBlob(canvas, LIMITS.imageQuality);
  if (!out) throw new MediaProblem('แปลงรูปไม่สำเร็จ ลองรูปอื่น');
  return { kind: 'image', ...out, w, h };
}

/** Load a photo for the avatar cropper, oriented, at a size the screen can handle. */
export async function loadForCrop(file) {
  const bmp = await decode(file);
  const scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
  if (scale === 1) return bmp;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close?.();
  return createImageBitmap(canvas);
}

/**
 * The square the student framed, as a 512 px picture.
 * @param {ImageBitmap} bmp
 * @param {{ x: number, y: number, size: number }} crop in the bitmap's pixels
 */
export async function cropAvatar(bmp, crop) {
  const canvas = document.createElement('canvas');
  canvas.width = LIMITS.avatarEdge;
  canvas.height = LIMITS.avatarEdge;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, crop.x, crop.y, crop.size, crop.size, 0, 0, LIMITS.avatarEdge, LIMITS.avatarEdge);
  const out = await canvasBlob(canvas, 0.88);
  if (!out) throw new MediaProblem('แปลงรูปไม่สำเร็จ ลองรูปอื่น');
  return { kind: 'image', ...out, w: LIMITS.avatarEdge, h: LIMITS.avatarEdge };
}

/** A video: within 50 MB and 2 minutes, playable here, with a poster from its first second. */
export async function prepareVideo(file) {
  if (file.size > LIMITS.videoBytes) throw new MediaProblem('วิดีโอใหญ่เกิน 50 MB ลองตัดให้สั้นลง');
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.src = url;
    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = () => reject(new MediaProblem('เบราว์เซอร์นี้เล่นวิดีโอนี้ไม่ได้ ลองไฟล์ MP4'));
      setTimeout(() => reject(new MediaProblem('อ่านวิดีโอไม่สำเร็จ ลองอีกครั้ง')), 15000);
    });
    const dur = Math.round(video.duration * 10) / 10;
    if (!Number.isFinite(dur)) throw new MediaProblem('อ่านความยาววิดีโอไม่ได้ ลองไฟล์ MP4');
    if (dur > LIMITS.videoSeconds) throw new MediaProblem('วิดีโอยาวเกิน 2 นาที ลองตัดให้สั้นลง');
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) throw new MediaProblem('เบราว์เซอร์นี้เปิดภาพของวิดีโอนี้ไม่ได้ ลองไฟล์ MP4');
    await new Promise((resolve) => {
      video.onseeked = resolve;
      video.currentTime = Math.min(0.5, dur / 2);
      setTimeout(resolve, 4000);
    });
    const scale = Math.min(1, 1280 / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const poster = await canvasBlob(canvas, 0.8);
    if (!poster) throw new MediaProblem('ทำภาพปกวิดีโอไม่สำเร็จ ลองอีกครั้ง');
    const ext = /\.webm$/i.test(file.name) || file.type === 'video/webm' ? 'webm' : /\.mov$/i.test(file.name) || file.type === 'video/quicktime' ? 'mov' : 'mp4';
    const type = { webm: 'video/webm', mov: 'video/quicktime', mp4: 'video/mp4' }[ext];
    return { kind: 'video', blob: file, ext, type, w, h, dur, poster };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Either kind, by what the file is. */
export function prepareFile(file, { video = true } = {}) {
  if (isVideo(file)) {
    if (!video) return Promise.reject(new MediaProblem('ที่นี่แนบได้เฉพาะรูป'));
    return prepareVideo(file);
  }
  return prepareImage(file);
}

/** A random file name: 16 characters a path allows. */
export function randomName() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
