// A data file the student dropped on the project list travels to the new project's import screen
// through memory only (never a URL, never storage): the File object waits here until the import
// screen takes it. OWNER: workspace role.
const pending = new Map();

/** @param {string} projectId @param {File} file */
export function setPendingFile(projectId, file) {
  pending.set(projectId, file);
}

/** @param {string} projectId @returns {File|null} the file, removed from the waiting list */
export function takePendingFile(projectId) {
  const f = pending.get(projectId) || null;
  pending.delete(projectId);
  return f;
}
