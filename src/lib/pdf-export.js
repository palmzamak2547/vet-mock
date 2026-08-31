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
  const { PDFDocument } = await import('pdf-lib');
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
    const { width, height } = page.getSize();
    const w = Math.max(1, Math.round(width * RENDER_SCALE));
    const h = Math.max(1, Math.round(height * RENDER_SCALE));

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
    // The rotation a page declares is applied by the viewer AFTER content is
    // drawn, and getSize() reports the unrotated box — so ink drawn in that
    // box lands correctly in the rotated result without any correction here.
    page.drawImage(png, { x: 0, y: 0, width, height });

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
