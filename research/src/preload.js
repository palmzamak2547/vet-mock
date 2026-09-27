// Preload the workspace code when a link into /app is pressed on the landing, so the entrance does not
// wait on a "loading" beat (M1 round 3 leftover) [M2-DESIGN.md 12]. The import specifier is the same as
// App.jsx's lazy() so Vite serves one chunk. Call on pointerdown and focus, never on page load (the
// front door must not download the workspace unasked). OWNER: trust role. STUB(m2): wired by trust.
let started = false;

/** Start downloading the workspace chunk once; later calls do nothing. */
export function preloadWorkspace() {
  if (started) return;
  started = true;
  import('./workspace/Workspace.jsx').catch(() => { started = false; });
}
