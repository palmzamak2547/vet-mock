// A student's uploaded picture, made safe before anything stores it.
//
// The bytes are judged by what they are, never by the name or the content type
// the browser sent: the first bytes must be a JPEG, PNG or WebP signature, the
// decoder must agree, and the header's size is checked before a pixel is
// decoded. What is kept is not the upload but a new picture drawn from it: a
// 256 px square WebP, turned upright first, with no metadata at all (no
// location, no camera, no colour profile, no comment). sharp (libvips) does the
// decoding; nothing here parses an image format by hand beyond the signature.
import sharp from 'sharp';

// Serverless instances are short-lived and small: no decoded-image cache, and
// one libvips thread per picture so a burst of uploads cannot starve the rest.
sharp.cache(false);
sharp.concurrency(1);

export const PICTURE_LIMITS = Object.freeze({
  maxBytes: 2 * 1024 * 1024,
  // 40 megapixels: above any phone camera's full picture, far below a
  // decompression bomb. The browser shrinks to 512 px before sending anyway.
  maxPixels: 40_000_000,
  side: 256,
});

/** The format the bytes really are, from their signature, or null. */
export function sniffPicture(bytes) {
  const b = bytes;
  if (!b || b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return 'png';
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

// An animated PNG announces itself with an acTL chunk before its first IDAT.
function apng(bytes) {
  let at = 8;
  while (at + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(at);
    const type = bytes.toString('ascii', at + 4, at + 8);
    if (type === 'acTL') return true;
    if (type === 'IDAT' || type === 'IEND') return false;
    at += 12 + length;
  }
  return false;
}

/**
 * @param {Buffer} bytes the request body as received
 * @returns {Promise<{ ok: true, bytes: Buffer, mime: 'image/webp' } | { ok: false, reason: 'too_large' | 'not_picture' | 'too_many_pixels' | 'animated' }>}
 */
export async function remakePicture(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0) return { ok: false, reason: 'not_picture' };
  if (bytes.length > PICTURE_LIMITS.maxBytes) return { ok: false, reason: 'too_large' };
  const format = sniffPicture(bytes);
  if (!format) return { ok: false, reason: 'not_picture' };
  if (format === 'png' && apng(bytes)) return { ok: false, reason: 'animated' };

  const input = { failOn: 'error', limitInputPixels: PICTURE_LIMITS.maxPixels, animated: false };
  let meta;
  try {
    meta = await sharp(bytes, { ...input, limitInputPixels: false }).metadata();
  } catch {
    return { ok: false, reason: 'not_picture' };
  }
  if (meta.format !== format) return { ok: false, reason: 'not_picture' };
  if (!(meta.width > 0 && meta.height > 0)) return { ok: false, reason: 'not_picture' };
  if (meta.width * meta.height > PICTURE_LIMITS.maxPixels) return { ok: false, reason: 'too_many_pixels' };
  if ((meta.pages || 1) > 1) return { ok: false, reason: 'animated' };

  try {
    const out = await sharp(bytes, input)
      .rotate() // upright by the EXIF orientation, before the orientation is dropped with the rest
      .resize(PICTURE_LIMITS.side, PICTURE_LIMITS.side, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    return { ok: true, bytes: out, mime: 'image/webp' };
  } catch {
    // A header that parses over a body that does not (truncated, corrupt).
    return { ok: false, reason: 'not_picture' };
  }
}
