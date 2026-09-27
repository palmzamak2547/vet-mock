// TIFF writer for figures: 8-bit RGB, LZW compression, XResolution and YResolution in pixels per inch, so a
// journal reads the dpi the student chose [M2-DESIGN.md 8.3]. Loaded lazily.
// OWNER: graphs role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {Uint8ClampedArray} rgba
 * @param {number} width
 * @param {number} height
 * @param {number} dpi
 * @returns {Uint8Array}
 */
export function encodeTiff(rgba, width, height, dpi) {
  throw new Error('not implemented: export/tiff.encodeTiff');
}
