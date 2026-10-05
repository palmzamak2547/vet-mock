import { migrateHistoryArray } from './id-migration.js';
import { yearForSubject } from '../data/curriculum.js';

/** Shared restore semantics for ordinary reads and receipt-backed RPC replies.
 * The RPC persists this normalization before deriving history identity keys. */
export function normalizeUserDataRow(row) {
  if (!row || !Array.isArray(row.history)) return row;
  return { ...row, history: normalizeUserHistory(row.history) };
}

export function normalizeUserHistory(history) {
  if (!Array.isArray(history)) return history;
  const migrated = migrateHistoryArray(history.map(entry => entry && typeof entry === 'object' && !Array.isArray(entry)
    ? { ...entry } : entry));
  return migrated.map(entry => entry && typeof entry === 'object' && !Array.isArray(entry)
    && typeof entry.year === 'undefined'
    ? { ...entry, year: yearForSubject(entry.subject) ?? null, phase: entry.phase ?? null }
    : entry);
}
