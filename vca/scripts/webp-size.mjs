// The pixel size of a WebP file, read from its header: no image library needed, so the build (which
// runs where only this app's own packages are installed) and the tests can check the plates' sizes.

/**
 * @param {Buffer} buf a whole WebP file, or at least its first 30 bytes
 * @returns {{ width: number, height: number } | null} null when the bytes are not a WebP
 */
export function webpSize(buf) {
  if (buf.length < 30 || buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') return null;
  const kind = buf.toString('latin1', 12, 16);
  if (kind === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  if (kind === 'VP8L') {
    // 14 bits of width, 14 of height, each stored minus one, after the 0x2f signature.
    if (buf[20] !== 0x2f) return null;
    const bits = buf.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (kind === 'VP8 ') {
    // A lossy frame: after its 3-byte tag, the start code 9d 01 2a, then 14 bits of width and of height.
    if (buf[23] !== 0x9d || buf[24] !== 0x01 || buf[25] !== 0x2a) return null;
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  return null;
}
