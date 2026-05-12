// Singleton init for Cornerstone3D core + DICOM image loader.
// Idempotent — survives React strict-mode double-mount. The whole
// module is only loaded when LabView mounts, so the cost is paid by
// the user who opens /lab and no one else.

import { init as coreInit } from '@cornerstonejs/core';
import dicomImageLoader, { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';

let initPromise = null;

export function ensureCornerstoneInit() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await coreInit();
    await dicomImageLoaderInit({ maxWebWorkers: 1 });
  })();
  return initPromise;
}

export function getDicomImageLoader() {
  return dicomImageLoader;
}
