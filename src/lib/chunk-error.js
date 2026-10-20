// A lazy screen whose code or stylesheet could not be downloaded (offline, or a
// release replaced the files). Engines word it differently; Vite throws its own
// "Unable to preload CSS" when only the stylesheet failed.
export function isChunkLoadError(error) {
  const msg = error?.message || (error ? String(error) : '');
  return /dynamically imported module|module script|loading chunk|ChunkLoadError|Importing a module script failed|Unable to preload CSS/i.test(msg);
}
