// Shared workspace state: who owns the records on this device, the open database, the engine and a
// status line for short confirmations. One provider per owner (the workspace remounts on sign-in or
// sign-out, so nothing from one owner is ever shown to another). OWNER: workspace role.
import { createContext, useContext } from 'react';

/**
 * @typedef {Object} WsValue
 * @property {import('../lib/runtime/types.js').OwnerScope} owner
 * @property {{ id: string, email: string|null } | null} user
 * @property {import('../lib/store/db.js').ResearchDb | null} db
 * @property {import('../lib/runtime/client.js').Engine | null} engine
 * @property {{ key: string, detail?: string } | null} engineError
 * @property {(key: string, params?: Object, tone?: 'ok'|'warn'|'error') => void} notify
 * @property {() => void} bumpProjects   ask the project list to reload
 */

export const WsContext = createContext(/** @type {WsValue} */ ({
  owner: 'guest', user: null, db: null, engine: null, engineError: null, notify: () => {}, bumpProjects: () => {},
}));

/** @returns {WsValue} */
export function useWs() {
  return useContext(WsContext);
}

/**
 * The i18n key for an error from a library: runtime and store errors carry `{ code, key }`; anything
 * else becomes the generic sentence (the technical text stays in a details element for developers).
 * @param {any} err
 * @returns {{ key: string, detail: string }}
 */
export function errorInfo(err) {
  if (err && typeof err === 'object' && typeof err.key === 'string') return { key: err.key, detail: String(err.detail || err.message || ''), ...(err.params && typeof err.params === 'object' ? { params: err.params } : {}) };
  if (err && typeof err === 'object' && err.code === 'conflict') return { key: 'ws.error.conflict', detail: '' };
  if (err && typeof err === 'object' && err.code === 'quota') return { key: 'ws.error.quota', detail: '' };
  return { key: 'ws.error.generic', detail: String(err?.message || err || '') };
}

/** A new random id for records the workspace creates. */
export function newId() {
  return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
