// ============================================================
// pdf-export — hand the annotated document back to the student
// ============================================================
//
// Notes that cannot leave the app are notes held hostage. This writes a real
// PDF: the ORIGINAL file with the ink stamped onto it, so the text layer,
// links, bookmarks and page size all survive and the result can be printed,
// emailed to a study group, or opened in anything.
//
// The ink goes on as a raster, not as vector paths, and that is a deliberate
// choice rather than a shortcut:
//
//   • The eraser removes pixels. In a vector export there is nothing to
//     remove — earlier paths are already committed — so an erased stroke
//     would come back in the exported file. Rasterising the finished overlay
//     is the only representation in which erasing means what it means on
//     screen.
//
//   • The highlighter multiplies. Reproducing that per-path needs blend modes
//     that not every PDF viewer honours; a flattened layer looks the same
//     everywhere.
//
//   • Pressure varies the width along a single stroke. As paths that is one
//     sub-path per width change; as pixels it is free and exact.
//
// So what is exported is what was on screen, at print resolution, over an
// untouched original. pdf-lib is imported here and nowhere else, so the
// ~500 KB it costs is paid only by someone who actually exports.

const RENDER_SCALE = 2; // ink raster at 2x the PDF's own points ≈ 144 dpi

/**
 * Where a page's ink raster goes back onto the page, in PDF user space.
 *
 * The reader authors ink against the frame pdf.js displays: the CropBox
 * clipped to the MediaBox (or the MediaBox alone when that leaves nothing),
 * turned by the page's /Rotate. A stroke at normalised (0.25, 0.25) is a
 * quarter of the way across and down THAT frame. Stamping the raster at
 * (0, 0) over getSize() — the raw, unturned MediaBox — put the ink on the
 * wrong quarter of every rotated page and off by the crop offset on every
 * cropped one.
 *
 * So the raster takes the displayed frame's proportions and is drawn turned
 * back by the same angle onto the crop box. pdf-lib turns an image counter-
 * clockwise about its lower-left corner, which is why the anchor walks the
 * box's corners with the angle. The page's own boxes and /Rotate are not
 * touched.
 *
 * @param {object} opts
 * @param {{x:number,y:number,width:number,height:number}} opts.mediaBox
 * @param {{x:number,y:number,width:number,height:number}|null} opts.cropBox
 * @param {number} opts.rotate  the page's /Rotate, in degrees
 * @returns {{rotation:number, width:number, height:number, x:number, y:number}}
 *   width/height: the displayed frame in points, which the raster must
 *   share; x/y: where to anchor the raster; rotation: how far to turn it.
 */
export function inkFrame({ mediaBox, cropBox, rotate }) {
  const media = normalRect(mediaBox);
  let box = media;
  if (cropBox) {
    // pdf.js: the view is CropBox ∩ MediaBox, unless that is empty.
    const crop = normalRect(cropBox);
    const x0 = Math.max(crop.x, media.x);
    const y0 = Math.max(crop.y, media.y);
    const x1 = Math.min(crop.x + crop.width, media.x + media.width);
    const y1 = Math.min(crop.y + crop.height, media.y + media.height);
    if (x1 - x0 > 0 && y1 - y0 > 0) box = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  }
  // pdf.js: an angle that is not a multiple of 90 counts as 0; negatives wrap.
  const raw = Number(rotate) || 0;
  const rotation = raw % 90 !== 0 ? 0 : ((raw % 360) + 360) % 360;
  const turned = rotation === 90 || rotation === 270;
  const width = turned ? box.height : box.width;
  const height = turned ? box.width : box.height;
  const [x, y] = rotation === 90 ? [box.x + box.width, box.y]
    : rotation === 180 ? [box.x + box.width, box.y + box.height]
      : rotation === 270 ? [box.x, box.y + box.height]
        : [box.x, box.y];
  return { rotation, width, height, x, y };
}

// pdf-lib hands a box back exactly as the file wrote it, so one written
// upper-right corner first has a negative width. pdf.js normalises, and the
// frame has to agree with what pdf.js displayed.
function normalRect({ x, y, width, height }) {
  const x0 = Math.min(x, x + width);
  const y0 = Math.min(y, y + height);
  return { x: x0, y: y0, width: Math.max(x, x + width) - x0, height: Math.max(y, y + height) - y0 };
}

/**
 * @param {object} opts
 * @param {ArrayBuffer|Uint8Array} opts.bytes  the ORIGINAL pdf
 * @param {object} opts.strokesByPage          { [pageNumber]: Stroke[] }
 * @param {(ctx, strokes, w, h, scale) => void} opts.paint  the reader's own
 *        renderer, passed in so the export cannot drift from the screen
 * @param {boolean} [opts.annotatedOnly]       drop pages with no ink
 * @param {(done:number, total:number) => void} [opts.onProgress]
 * @returns {Promise<Blob>}
 */
export async function exportAnnotatedPdf({
  bytes, strokesByPage, paint, annotatedOnly = false, onProgress,
}) {
  const { PDFDocument, degrees } = await import('pdf-lib');
  // ignoreEncryption: a deck that merely forbids editing still belongs to the
  // student who is allowed to read it; refusing to give them their own notes
  // back would be the wrong side to err on.
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = pdf.getPages();

  const inked = Object.entries(strokesByPage || {})
    .filter(([, arr]) => Array.isArray(arr) && arr.length > 0)
    .map(([n]) => Number(n))
    .filter((n) => n >= 1 && n <= pages.length)
    .sort((a, b) => a - b);

  if (inked.length === 0) {
    const err = new Error('no-annotations');
    err.code = 'no-annotations';
    throw err;
  }

  let done = 0;
  for (const pageNo of inked) {
    const page = pages[pageNo - 1];
    // The frame the ink was drawn in: what pdf.js showed for this page.
    let cropBox = null;
    try { cropBox = page.getCropBox(); } catch { /* pdf.js ignores a malformed box too */ }
    const frame = inkFrame({
      mediaBox: page.getMediaBox(),
      cropBox,
      rotate: page.getRotation().angle,
    });
    const w = Math.max(1, Math.round(frame.width * RENDER_SCALE));
    const h = Math.max(1, Math.round(frame.height * RENDER_SCALE));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    // The reader's own draw function, at the export's scale. Widths are
    // authored in CSS pixels against a canvas of this width, so the scale
    // factor is the ratio of this raster to the page's points.
    paint(ctx, strokesByPage[pageNo] || [], w, h, RENDER_SCALE);

    const dataUrl = canvas.toDataURL('image/png');
    const png = await pdf.embedPng(dataUrl);
    // Turned back by the page's own angle onto its crop box, so the ink
    // covers the content it was drawn over (see inkFrame).
    page.drawImage(png, {
      x: frame.x, y: frame.y, width: frame.width, height: frame.height,
      rotate: degrees(frame.rotation),
    });

    // Free the bitmap before building the next one: a 30-page export at this
    // resolution is otherwise several hundred megabytes of live canvases.
    canvas.width = 0;
    canvas.height = 0;

    done += 1;
    onProgress?.(done, inked.length);
  }

  if (annotatedOnly) {
    const keep = new Set(inked);
    // Backwards, because removing a page renumbers everything after it.
    for (let i = pages.length; i >= 1; i--) if (!keep.has(i)) pdf.removePage(i - 1);
  }

  const out = await pdf.save();
  return new Blob([out], { type: 'application/pdf' });
}

/** Filename that says what it is without saying who made it. */
export function exportFileName(sourceName, annotatedOnly) {
  const stem = String(sourceName || 'document').replace(/\.pdf$/i, '').slice(0, 80);
  return `${stem} - ${annotatedOnly ? 'หน้าที่เขียน' : 'มีรอยเขียน'}.pdf`;
}

/** Hands the blob to the browser. Kept here so the view has one call. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Safari needs the URL to outlive the click; a minute is far more than the
  // download needs and costs nothing.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
