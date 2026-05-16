// Export the current viewer state as an annotated PNG: composite the
// Cornerstone canvas (the DICOM render) with any SVG overlays
// (annotations + custom measurement overlays) into one image and
// trigger a browser download.
//
// We render at the canvas's native bitmap resolution so the export
// preserves DICOM detail. SVGs are serialized to image/svg+xml data,
// loaded into HTMLImageElement, and drawn back onto the same context
// at the same display-space offset — keeping markers anatomically
// correct relative to the underlying pixels.

export async function exportAnnotatedPng({ containerEl, baseFilename = 'annotated' }) {
  const canvas = containerEl?.querySelector('canvas');
  if (!canvas) throw new Error('No canvas found in container');

  const w = canvas.width;
  const h = canvas.height;
  const cRect = canvas.getBoundingClientRect();

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d');

  // 1) Draw the DICOM render bitmap.
  ctx.drawImage(canvas, 0, 0);

  // 2) For each SVG inside the container, rasterize + drawImage at
  //    the right offset/scale. This handles both Cornerstone's
  //    annotation SVG and the Norberg/VHS SVG overlays.
  const svgs = containerEl.querySelectorAll('svg');
  const scaleX = w / cRect.width;
  const scaleY = h / cRect.height;

  for (const svg of svgs) {
    const sRect = svg.getBoundingClientRect();
    if (sRect.width === 0 || sRect.height === 0) continue;

    const clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    if (!clone.getAttribute('width')) clone.setAttribute('width', String(sRect.width));
    if (!clone.getAttribute('height')) clone.setAttribute('height', String(sRect.height));
    const xml = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const offX = (sRect.left - cRect.left) * scaleX;
          const offY = (sRect.top - cRect.top) * scaleY;
          const tw = sRect.width * scaleX;
          const th = sRect.height * scaleY;
          ctx.drawImage(img, offX, offY, tw, th);
          resolve();
        };
        img.onerror = (e) => reject(new Error('SVG rasterize failed (possibly external resources): ' + (e?.message || e)));
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  // 3) Encode + download.
  const pngBlob = await new Promise((resolve, reject) => {
    out.toBlob((b) => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png');
  });

  const url = URL.createObjectURL(pngBlob);
  const a = document.createElement('a');
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.href = url;
  a.download = `${baseFilename}_${ts}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);

  return { width: w, height: h, byteSize: pngBlob.size };
}
