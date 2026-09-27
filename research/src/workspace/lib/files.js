// File names the workspace gives downloads [M1-DESIGN.md 9.4, 14]: made safe for every file system,
// Thai letters kept, the project file with its date and fixed suffix. Pure. OWNER: workspace role.
import { isoLocalDay } from './era.js';

/** Project file name: the project name made safe for a file system, the date, the fixed suffix. */
export function projectFileName(name, when = new Date()) {
  const base = String(name || 'project').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'project';
  return `${base}-${isoLocalDay(when)}.vmresearch.json`;
}

/** A project name from a data file name: the name without its extension. */
export function nameFromFile(fileName) {
  return String(fileName || '').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'project';
}

/** File-name-safe text (keeps Thai letters, drops path characters and spaces). */
export function safeFileBase(s) {
  return String(s || 'result').replace(/[\\/:*?"<>|\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'result';
}
