// Singleton init for Cornerstone3D core + DICOM image loader + tools.
// Idempotent — survives React strict-mode double-mount. The whole
// module is only loaded when LabView mounts, so the cost is paid by
// the user who opens /lab and no one else.

import { init as coreInit } from '@cornerstonejs/core';
import dicomImageLoader, { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';
import {
  init as toolsInit,
  addTool,
  WindowLevelTool,
  PanTool,
  ZoomTool,
} from '@cornerstonejs/tools';

let initPromise = null;

export function ensureCornerstoneInit() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await coreInit();
    await dicomImageLoaderInit({ maxWebWorkers: 1 });
    await toolsInit();
    // addTool() is global and idempotent — registers tool classes so
    // any ToolGroup can later attach them. Registering all base
    // navigation tools up front keeps the per-viewport setup simple.
    addTool(WindowLevelTool);
    addTool(PanTool);
    addTool(ZoomTool);
  })();
  return initPromise;
}

export function getDicomImageLoader() {
  return dicomImageLoader;
}
