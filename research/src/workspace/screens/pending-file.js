// A data file the student dropped on the project list travels to the new project's import screen
// through memory only (never a URL, never storage): the File object waits here until the import
// screen takes it. OWNER: ui-tools role (M2; workspace in M1).
//
// M2 [M2-DESIGN.md 11.4]: an example dataset may bring a second file (a farm file to merge, a second
// typing to compare), codebook hints matched to columns by name, and the tool to open after the import.
// Each waits under its purpose ('analysis', 'merge', 'double-entry') until the screen for it takes it.
const pending = new Map();
const slot = (projectId, purpose) => `${projectId}|${purpose || 'analysis'}`;

/**
 * @param {string} projectId
 * @param {File} file
 * @param {{ purpose?: 'analysis'|'merge'|'double-entry', hints?: any[]|null, next?: string|null }} [extra]
 */
export function setPendingFile(projectId, file, extra = {}) {
  pending.set(slot(projectId, extra.purpose), { file, hints: extra.hints || null, next: extra.next || null });
}

/** @param {string} projectId @param {string} [purpose] @returns {File|null} the file, removed from the waiting list */
export function takePendingFile(projectId, purpose = 'analysis') {
  return takePending(projectId, purpose)?.file || null;
}

/** @param {string} projectId @param {string} [purpose] @returns {{ file: File, hints: any[]|null, next: string|null }|null} */
export function takePending(projectId, purpose = 'analysis') {
  const key = slot(projectId, purpose);
  const p = pending.get(key) || null;
  pending.delete(key);
  return p;
}

const HINT_FIELDS = ['labelTh', 'labelEn', 'type', 'role', 'level', 'unit', 'levels', 'reference', 'positive', 'range'];

/**
 * A proposed codebook with the hints an example carries applied, matched by column name. Only fields
 * the hint gives are taken; the key and the name stay the file's. A hint with role 'cluster' names the
 * cluster column. Pure; the argument is not changed.
 * @param {import('../../lib/runtime/types.js').Codebook} codebook
 * @param {{ name: string }[]|null} hints
 */
export function applyHints(codebook, hints) {
  if (!codebook || !Array.isArray(hints) || !hints.length) return codebook;
  const byName = new Map(hints.map((h) => [String(h.name).normalize('NFC').trim(), h]));
  let clusterKey = codebook.clusterKey ?? null;
  const columns = (codebook.columns || []).map((c) => {
    const h = byName.get(String(c.name).normalize('NFC').trim());
    if (!h) return c;
    const next = { ...c };
    for (const f of HINT_FIELDS) if (h[f] !== undefined) next[f] = h[f] === null ? null : JSON.parse(JSON.stringify(h[f]));
    if (h.role === 'cluster') clusterKey = c.key;
    return next;
  });
  return { ...codebook, columns, clusterKey };
}
