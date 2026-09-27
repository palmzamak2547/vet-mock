// Project file export and import (valibot schema) [M1-DESIGN.md 9.4]. An imported file is untrusted:
// it is parsed, size-capped and validated completely, and the student sees exactly what will be
// added before anything is written. Import always creates a new project (never overwrites).
// OWNER: runtime role.

export const PROJECT_FILE_FORMAT = 'vetmock-research-project';
export const PROJECT_FILE_VERSION = 1;
export const PROJECT_FILE_MAX_BYTES = 50 * 1024 * 1024;

/**
 * @returns {Promise<Blob>} application/json, file name `<project-name>-<YYYY-MM-DD>.vmresearch.json`
 */
export async function exportProjectFile(db, owner, projectId) { void db; void owner; void projectId; throw new Error('not implemented: store/project-file.exportProjectFile'); }

/**
 * @param {File|Blob} file
 * @returns {Promise<{ ok: true, preview: { name: string, datasets: number, rows: number, analyses: number, exportedAt: string|null }, data: Object } | { ok: false, key: string }>}
 */
export async function parseProjectFile(file) { void file; throw new Error('not implemented: store/project-file.parseProjectFile'); }

/** Writes the validated data as a new project owned by `owner`, with new ids, and logs it. */
export async function importProjectFile(db, owner, data) { void db; void owner; void data; throw new Error('not implemented: store/project-file.importProjectFile'); }
