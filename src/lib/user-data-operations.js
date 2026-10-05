import { USER_DATA_FIELDS, stableItemKey } from './user-data-sync.js';
import { normalizeUserHistory } from './user-data-row.js';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const owns = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const safeKey = key => !['__proto__', 'constructor', 'prototype'].includes(key);

/** Only keys changed by this action become intent; a visible peer edit does not. */
export function userDataChanges(before, after, includeLocal = false) {
  const changes = {};
  for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) {
    if ((!definition.remoteKey && !includeLocal) || !owns(after, field) || same(before[field], after[field])) continue;
    const key = definition.remoteKey || field;
    const previous = field === 'history' ? normalizeUserHistory(before[field] ?? definition.initial) : before[field] ?? definition.initial;
    const next = field === 'history' ? normalizeUserHistory(after[field]) : after[field];
    if (definition.type === 'array') {
      if (!Array.isArray(next)) throw new TypeError(`Invalid ${field}`);
      const old = new Map(previous.map(item => [stableItemKey(item), item]));
      const current = new Map(next.map(item => [stableItemKey(item), item]));
      changes[key] = {
        put: [...current].filter(([key, item]) => !old.has(key) || !same(old.get(key), item)).map(([, item]) => item),
        remove: [...old.keys()].filter(key => !current.has(key)),
      };
      if (field === 'customQuestions') changes[key].created = [...current.keys()].filter(id => !old.has(id));
      if (!changes[key].put.length && !changes[key].remove.length) delete changes[key];
    } else {
      if (!next || typeof next !== 'object' || Array.isArray(next) || !Object.keys(next).every(safeKey)) {
        throw new TypeError(`Invalid ${field}`);
      }
      changes[key] = definition.merge === 'streak' ? { value: next } : {
        set: Object.fromEntries(Object.entries(next).filter(([key, value]) => !owns(previous, key) || !same(previous[key], value))),
        remove: Object.keys(previous).filter(key => !owns(next, key)),
      };
    }
  }
  return changes;
}

export function applyUserDataChanges(data, changes) {
  const next = { ...data };
  for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) {
    const change = changes[definition.remoteKey || field];
    if (!change) continue;
    if (definition.type === 'array') {
      const items = new Map(next[field].map(item => [stableItemKey(item), item]));
      for (const key of change.remove) items.delete(key);
      for (const item of change.put) items.set(stableItemKey(item), item);
      next[field] = [...items.values()];
    } else if (definition.merge === 'streak') next[field] = change.value;
    else {
      next[field] = { ...next[field], ...change.set };
      for (const key of change.remove) delete next[field][key];
    }
  }
  return next;
}

export function dataFromSyncRow(row, empty) {
  const data = empty();
  for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) {
    if (!definition.remoteKey) continue;
    const value = row?.[definition.remoteKey] ?? definition.initial;
    if (definition.type === 'array' ? !Array.isArray(value)
      : !value || typeof value !== 'object' || Array.isArray(value)) {
      throw Object.assign(new Error('ข้อมูลบัญชีมีรูปแบบไม่ถูกต้อง จึงยังไม่เขียนทับ'), { code: 'INVALID_REMOTE_DATA' });
    }
    data[field] = value;
  }
  return data;
}

/** Restore every touched key, including net-zero changes, after explicit cancellation. */
export function accountRestoreChanges(data, operations) {
  const changes = {};
  for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) {
    const name = definition.remoteKey || field;
    const parts = operations.map(op => op.changes[name]).filter(Boolean);
    if (!parts.length) continue;
    if (definition.merge === 'streak') { changes[name] = { value: data[field] }; continue; }
    const keys = new Set(parts.flatMap(part => [...(part.remove || []), ...(part.put || []).map(stableItemKey), ...Object.keys(part.set || {})]));
    if (definition.type === 'array') {
      const current = new Map(data[field].map(item => [stableItemKey(item), item]));
      changes[name] = { put: [...current].filter(([key]) => keys.has(key)).map(([, item]) => item),
        remove: [...keys].filter(key => !current.has(key)) };
    } else changes[name] = { set: Object.fromEntries(Object.entries(data[field]).filter(([key]) => keys.has(key))),
      remove: [...keys].filter(key => !owns(data[field], key)) };
  }
  return changes;
}
