// User-owned study data has two durability layers:
//   1) localStorage is the immediate, offline-capable source
//   2) Supabase is a remote replica for signed-in users
//
// This module owns the ordering between them. Callers only see a small
// external-store interface: getSnapshot(), subscribe(), and send().
// In particular, a failed remote write never discards a local change.

export const USER_DATA_FIELDS = Object.freeze({
  bookmarks: {
    localKey: 'vmx-bookmarks',
    remoteKey: 'bookmarks',
    initial: [],
    type: 'array',
    merge: 'set-array',
  },
  history: {
    localKey: 'vmx-history',
    remoteKey: 'history',
    initial: [],
    type: 'array',
    merge: 'append-array',
  },
  notes: {
    localKey: 'vmx-notes',
    remoteKey: 'notes',
    initial: {},
    type: 'object',
    merge: 'keyed-object',
  },
  srCards: {
    localKey: 'vmx-sr-cards',
    remoteKey: 'sr_cards',
    initial: {},
    type: 'object',
    merge: 'keyed-object',
  },
  customQuestions: {
    localKey: 'vmx-custom-q',
    remoteKey: 'custom_questions',
    initial: [],
    type: 'array',
    merge: 'keyed-array',
  },
  streakData: {
    localKey: 'vmx-streak',
    remoteKey: 'streak_data',
    initial: { streak: 0, lastDate: null },
    type: 'object',
    merge: 'streak',
  },
  readingChecklist: {
    localKey: 'vmx-reading-checklist',
    remoteKey: null,
    initial: {},
    type: 'object',
    merge: 'keyed-object',
  },
});

const SYNC_VERSION = 1;
const META_PREFIX = 'vmx-user-sync-v1:';
const DATA_PREFIX = 'vmx-user-data-v1:';
const OPERATION_PREFIX = 'vmx-user-op-v1:';
const CURRENT_OWNER_KEY = 'vmx-user-sync-owner-v1';
const JOURNAL_KEY = 'vmx-user-sync-journal-v1';
const ANONYMOUS = 'anonymous';
const REMOTE_FIELDS = Object.keys(USER_DATA_FIELDS)
  .filter((field) => USER_DATA_FIELDS[field].remoteKey);
let storeInstanceSequence = 0;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createEmptyUserData() {
  return Object.fromEntries(
    Object.entries(USER_DATA_FIELDS).map(([field, definition]) => [
      field,
      clone(definition.initial),
    ]),
  );
}

function sameValue(a, b) {
  if (Object.is(a, b)) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function isValidValue(value, definition) {
  if (definition.type === 'array') return Array.isArray(value);
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseJson(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function principalKey(userId) {
  return userId || ANONYMOUS;
}

function metaKey(userId) {
  return `${META_PREFIX}${encodeURIComponent(principalKey(userId))}`;
}

function dataKey(userId) {
  return `${DATA_PREFIX}${encodeURIComponent(principalKey(userId))}`;
}

function operationKeyPrefix(userId) {
  return `${OPERATION_PREFIX}${encodeURIComponent(principalKey(userId))}:`;
}

function blankMeta() {
  return {
    version: SYNC_VERSION,
    initialized: false,
    revision: 0,
    dirty: {},
    lastSyncedAt: null,
  };
}

function normalizeMeta(value) {
  if (!value || value.version !== SYNC_VERSION || typeof value !== 'object') {
    return blankMeta();
  }
  return {
    version: SYNC_VERSION,
    initialized: Boolean(value.initialized),
    revision: Number.isFinite(value.revision) ? value.revision : 0,
    dirty: value.dirty && typeof value.dirty === 'object' ? value.dirty : {},
    lastSyncedAt: Number.isFinite(value.lastSyncedAt) ? value.lastSyncedAt : null,
  };
}

function readPrincipalData(storage, userId) {
  const value = parseJson(storage, dataKey(userId), null);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { found: false, data: createEmptyUserData() };
  }

  const data = createEmptyUserData();
  for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) {
    if (
      Object.prototype.hasOwnProperty.call(value, field) &&
      isValidValue(value[field], definition)
    ) {
      data[field] = value[field];
    }
  }
  return { found: true, data };
}

function recoverJournal(storage) {
  const journal = parseJson(storage, JOURNAL_KEY, null);
  if (!journal || journal.version !== SYNC_VERSION || !journal.patch) return null;

  let recovered = true;
  try {
    if (journal.meta && journal.metaKey) {
      storage.setItem(journal.metaKey, JSON.stringify(journal.meta));
    }
    if (journal.snapshot && journal.snapshotKey) {
      storage.setItem(journal.snapshotKey, JSON.stringify(journal.snapshot));
    }
    if (Object.prototype.hasOwnProperty.call(journal, 'owner')) {
      storage.setItem(CURRENT_OWNER_KEY, JSON.stringify(journal.owner));
    }
    for (const [field, value] of Object.entries(journal.patch)) {
      const definition = USER_DATA_FIELDS[field];
      if (!definition || !isValidValue(value, definition)) continue;
      storage.setItem(definition.localKey, JSON.stringify(value));
    }
    storage.removeItem(JOURNAL_KEY);
  } catch {
    recovered = false;
  }

  return { patch: journal.patch, recovered };
}

function readLocalData(storage) {
  const data = createEmptyUserData();
  for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) {
    const value = parseJson(storage, definition.localKey, definition.initial);
    if (isValidValue(value, definition)) data[field] = value;
  }

  const journal = recoverJournal(storage);
  if (journal?.patch) {
    for (const [field, value] of Object.entries(journal.patch)) {
      const definition = USER_DATA_FIELDS[field];
      if (definition && isValidValue(value, definition)) data[field] = value;
    }
  }
  return { data, journalRecovered: journal?.recovered !== false };
}

function writeLocalCommit(storage, {
  patch,
  meta = null,
  metaStorageKey = null,
  snapshot = null,
  snapshotStorageKey = null,
  owner,
}) {
  const journal = {
    version: SYNC_VERSION,
    patch,
    meta,
    metaKey: metaStorageKey,
    snapshot,
    snapshotKey: snapshotStorageKey,
    writtenAt: Date.now(),
  };
  if (owner !== undefined) journal.owner = owner;

  // The journal is written first. If a later mirror write fails, the next
  // boot can still reconstruct both the newest values and sync metadata.
  storage.setItem(JOURNAL_KEY, JSON.stringify(journal));

  let mirrorError = null;
  try {
    if (meta && metaStorageKey) {
      storage.setItem(metaStorageKey, JSON.stringify(meta));
    }
    if (snapshot && snapshotStorageKey) {
      storage.setItem(snapshotStorageKey, JSON.stringify(snapshot));
    }
    if (owner !== undefined) {
      storage.setItem(CURRENT_OWNER_KEY, JSON.stringify(owner));
    }
    for (const [field, value] of Object.entries(patch)) {
      const definition = USER_DATA_FIELDS[field];
      if (!definition) continue;
      storage.setItem(definition.localKey, JSON.stringify(value));
    }
    storage.removeItem(JOURNAL_KEY);
  } catch (error) {
    mirrorError = error;
  }

  return { durable: true, mirrorError };
}

function meaningful(field, value) {
  return !sameValue(value, USER_DATA_FIELDS[field].initial);
}

function stableItemKey(item) {
  if (item && typeof item === 'object') {
    if (item.id !== undefined) return `id:${item.id}`;
    if (item.questionId !== undefined && item.date !== undefined) {
      return `history:${item.date}:${item.subject || ''}:${item.questionId}`;
    }
  }
  try {
    return `json:${JSON.stringify(item)}`;
  } catch {
    return `value:${String(item)}`;
  }
}

function unionArrays(remote, local) {
  const result = [];
  const seen = new Set();
  for (const item of [...remote, ...local]) {
    const key = stableItemKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function applySetArrayChanges(base, local, remote) {
  const baseKeys = new Set(base.map(stableItemKey));
  const localKeys = new Set(local.map(stableItemKey));
  const removed = new Set([...baseKeys].filter((key) => !localKeys.has(key)));
  const result = remote.filter((item) => !removed.has(stableItemKey(item)));
  const present = new Set(result.map(stableItemKey));
  for (const item of local) {
    const key = stableItemKey(item);
    if (!baseKeys.has(key) && !present.has(key)) {
      result.push(item);
      present.add(key);
    }
  }
  return result;
}

function applyKeyedObjectChanges(base, local, remote) {
  const result = { ...remote };
  const keys = new Set([...Object.keys(base), ...Object.keys(local)]);
  for (const key of keys) {
    const baseHas = Object.prototype.hasOwnProperty.call(base, key);
    const localHas = Object.prototype.hasOwnProperty.call(local, key);
    if (baseHas === localHas && (!localHas || sameValue(base[key], local[key]))) continue;
    if (localHas) result[key] = local[key];
    else delete result[key];
  }
  return result;
}

function applyKeyedArrayChanges(base, local, remote) {
  const toMap = (items) => new Map(items.map((item) => [stableItemKey(item), item]));
  const baseMap = toMap(base);
  const localMap = toMap(local);
  const result = toMap(remote);
  const keys = new Set([...baseMap.keys(), ...localMap.keys()]);
  for (const key of keys) {
    const baseHas = baseMap.has(key);
    const localHas = localMap.has(key);
    if (baseHas === localHas && (!localHas || sameValue(baseMap.get(key), localMap.get(key)))) continue;
    if (localHas) result.set(key, localMap.get(key));
    else result.delete(key);
  }
  return [...result.values()];
}

function mergeStreak(local, remote) {
  const localDate = Date.parse(local?.lastDate || '') || 0;
  const remoteDate = Date.parse(remote?.lastDate || '') || 0;
  if (localDate > remoteDate) return local;
  if (remoteDate > localDate) return remote;
  return {
    ...remote,
    ...local,
    streak: Math.max(Number(local?.streak) || 0, Number(remote?.streak) || 0),
  };
}

function mergeLegacy(field, local, remote) {
  const policy = USER_DATA_FIELDS[field].merge;
  if (policy === 'set-array' || policy === 'append-array' || policy === 'keyed-array') {
    return unionArrays(remote, local);
  }
  if (policy === 'keyed-object') return { ...remote, ...local };
  if (policy === 'streak') return mergeStreak(local, remote);
  return local;
}

function reconcileDirty(field, entry, remote) {
  const local = entry.value;
  if (entry.legacy || !Object.prototype.hasOwnProperty.call(entry, 'base')) {
    return mergeLegacy(field, local, remote);
  }

  const base = entry.base;
  if (sameValue(local, base)) return remote;
  if (sameValue(remote, base)) return local;

  const policy = USER_DATA_FIELDS[field].merge;
  if (policy === 'set-array') return applySetArrayChanges(base, local, remote);
  if (policy === 'append-array') return unionArrays(remote, local);
  if (policy === 'keyed-object') return applyKeyedObjectChanges(base, local, remote);
  if (policy === 'keyed-array') return applyKeyedArrayChanges(base, local, remote);
  if (policy === 'streak') return mergeStreak(local, remote);
  return local;
}

function readPendingOperations(storage, userId) {
  if (!Number.isFinite(storage.length) || typeof storage.key !== 'function') return [];
  const prefix = operationKeyPrefix(userId);
  const operations = [];

  try {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key?.startsWith(prefix)) continue;
      const operation = parseJson(storage, key, null);
      if (
        !operation ||
        operation.version !== SYNC_VERSION ||
        !operation.changes ||
        typeof operation.changes !== 'object'
      ) continue;

      const changes = {};
      for (const [field, change] of Object.entries(operation.changes)) {
        const definition = USER_DATA_FIELDS[field];
        if (
          !definition ||
          !change ||
          !isValidValue(change.base, definition) ||
          !isValidValue(change.value, definition)
        ) continue;
        changes[field] = change;
      }
      if (Object.keys(changes).length === 0) continue;
      operations.push({
        key,
        token: operation.token || key,
        createdAt: Number.isFinite(operation.createdAt) ? operation.createdAt : 0,
        changes,
      });
    }
  } catch {
    return [];
  }

  operations.sort((a, b) => (
    a.createdAt - b.createdAt || a.key.localeCompare(b.key)
  ));
  return operations;
}

function replayOperations(data, operations) {
  const next = { ...data };
  const touched = new Set();
  for (const operation of operations) {
    for (const [field, change] of Object.entries(operation.changes)) {
      next[field] = reconcileDirty(field, change, next[field]);
      touched.add(field);
    }
  }
  return { data: next, touched };
}

function operationTouchesRemote(operation) {
  return Object.keys(operation.changes)
    .some((field) => Boolean(USER_DATA_FIELDS[field]?.remoteKey));
}

function acknowledgeRemoteOperationParts(storage, operations) {
  for (const operation of operations) {
    const current = parseJson(storage, operation.key, null);
    if (!current || (current.token || operation.key) !== operation.token) {
      // The originating tab updated this operation while the push was in
      // flight. Keep the newer cumulative value for the next flush.
      continue;
    }
    const localChanges = Object.fromEntries(
      Object.entries(operation.changes)
        .filter(([field]) => !USER_DATA_FIELDS[field]?.remoteKey),
    );
    try {
      if (Object.keys(localChanges).length === 0) {
        storage.removeItem(operation.key);
      } else {
        storage.setItem(operation.key, JSON.stringify({
          version: SYNC_VERSION,
          token: operation.token,
          createdAt: operation.createdAt,
          changes: localChanges,
        }));
      }
    } catch {
      // Keeping an acknowledged operation is safe: all merge policies are
      // idempotent, so a later retry cannot erase the already-synced value.
    }
  }
}

function fromRemoteRow(row) {
  if (!row) return { found: false, data: {}, present: new Set() };
  const data = {};
  const present = new Set();

  for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) {
    if (!definition.remoteKey) continue;
    if (!Object.prototype.hasOwnProperty.call(row, definition.remoteKey)) continue;
    present.add(field);
    const raw = row[definition.remoteKey];
    const value = raw === null ? clone(definition.initial) : raw;
    if (!isValidValue(value, definition)) {
      const error = new Error(`Invalid remote value for ${field}`);
      error.code = 'INVALID_REMOTE_DATA';
      throw error;
    }
    data[field] = value;
  }
  return { found: true, data, present };
}

export function toRemoteUserData(data) {
  const payload = {};
  for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) {
    if (definition.remoteKey) payload[definition.remoteKey] = data[field];
  }
  return payload;
}

function publicError(code, message, retryable = true) {
  return { code, message, retryable };
}

export function createBrowserLifecycle() {
  return {
    isOnline() {
      return typeof navigator === 'undefined' ? true : navigator.onLine !== false;
    },
    subscribe(listener) {
      if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};
      const onOnline = () => listener('online');
      const onOffline = () => listener('offline');
      const onVisible = () => {
        if (document.visibilityState === 'visible') listener('visible');
      };
      const onStorage = (event) => {
        const key = event.key;
        if (
          key === null ||
          key === JOURNAL_KEY ||
          key?.startsWith(OPERATION_PREFIX) ||
          key?.startsWith(DATA_PREFIX) ||
          key?.startsWith(META_PREFIX) ||
          Object.values(USER_DATA_FIELDS).some(({ localKey }) => localKey === key)
        ) {
          listener('storage');
        }
      };
      window.addEventListener('online', onOnline);
      window.addEventListener('offline', onOffline);
      window.addEventListener('storage', onStorage);
      document.addEventListener('visibilitychange', onVisible);
      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
        window.removeEventListener('storage', onStorage);
        document.removeEventListener('visibilitychange', onVisible);
      };
    },
  };
}

export function createUserDataSync({
  storage,
  remote,
  lifecycle = { isOnline: () => true, subscribe: () => () => {} },
  scheduler = {
    setTimeout: (fn, delay) => setTimeout(fn, delay),
    clearTimeout: (id) => clearTimeout(id),
  },
  now = () => Date.now(),
  random = () => Math.random(),
  debounceMs = 1500,
} = {}) {
  if (!storage?.getItem || !storage?.setItem || !storage?.removeItem) {
    throw new TypeError('createUserDataSync requires a storage adapter');
  }
  if (!remote?.pull || !remote?.push) {
    throw new TypeError('createUserDataSync requires a remote adapter');
  }

  const localInitial = readLocalData(storage);
  const ownerAtBoot = parseJson(storage, CURRENT_OWNER_KEY, null);
  const bootData = ownerAtBoot && ownerAtBoot !== ANONYMOUS
    ? createEmptyUserData()
    : replayOperations(
      localInitial.data,
      readPendingOperations(storage, null),
    ).data;
  const initial = {
    data: bootData,
    journalRecovered: localInitial.journalRecovered,
  };
  let state = {
    principalId: null,
    data: initial.data,
    sync: {
      phase: 'local-only',
      pending: false,
      dirtyFields: [],
      lastSyncedAt: null,
      error: initial.journalRecovered
        ? null
        : publicError('LOCAL_RECOVERY_PENDING', 'ข้อมูลบันทึกไว้แล้ว แต่ยังจัดเก็บไม่สมบูรณ์'),
    },
  };
  let userId = null;
  let activeMeta = normalizeMeta(parseJson(storage, metaKey(null), null));
  let sessionGeneration = 0;
  let hydratedUserId = null;
  let retryAttempt = 0;
  let timer = null;
  let disposed = false;
  let operationSequence = 0;
  let activeOperation = null;
  let unsubscribeLifecycle = null;
  const instanceId = globalThis.crypto?.randomUUID?.()
    || `${now().toString(36)}-${(++storeInstanceSequence).toString(36)}-${Math.floor(random() * 1e9).toString(36)}`;
  let localOperationSequence = 0;
  const listeners = new Set();

  const publish = (data = state.data, sync = state.sync, principalId = userId) => {
    state = { principalId, data, sync };
    for (const listener of listeners) listener();
  };

  const syncShape = (patch = {}) => {
    const dirtyFields = new Set(Object.keys(activeMeta.dirty || {}));
    for (const operation of readPendingOperations(storage, userId)) {
      for (const field of Object.keys(operation.changes)) {
        if (USER_DATA_FIELDS[field]?.remoteKey) dirtyFields.add(field);
      }
    }
    return {
      ...state.sync,
      dirtyFields: [...dirtyFields],
      pending: dirtyFields.size > 0,
      lastSyncedAt: activeMeta.lastSyncedAt || state.sync.lastSyncedAt || null,
      ...patch,
    };
  };

  const persistOperation = (changes) => {
    const key = `${operationKeyPrefix(userId)}${instanceId}`;
    const existing = parseJson(storage, key, null);
    const cumulativeChanges = {
      ...(
        existing?.changes && typeof existing.changes === 'object'
          ? existing.changes
          : {}
      ),
    };
    for (const [field, change] of Object.entries(changes)) {
      const prior = cumulativeChanges[field];
      cumulativeChanges[field] = prior
        ? { base: prior.base, value: change.value }
        : change;
    }
    const token = `${instanceId}:${++localOperationSequence}`;
    storage.setItem(key, JSON.stringify({
      version: SYNC_VERSION,
      token,
      createdAt: Number.isFinite(existing?.createdAt) ? existing.createdAt : now(),
      changes: cumulativeChanges,
    }));
    return key;
  };

  const clearTimer = () => {
    if (timer !== null) scheduler.clearTimeout(timer);
    timer = null;
  };

  const persistMeta = (meta) => {
    storage.setItem(metaKey(userId), JSON.stringify(meta));
  };

  const schedule = (kind, delay) => {
    clearTimer();
    timer = scheduler.setTimeout(() => {
      timer = null;
      if (kind === 'hydrate') hydrate();
      else flush();
    }, delay);
  };

  const scheduleRetry = (kind) => {
    retryAttempt += 1;
    const base = Math.min(30000, 1500 * (2 ** Math.min(retryAttempt - 1, 5)));
    const jitter = 0.8 + (Math.max(0, Math.min(1, random())) * 0.4);
    schedule(kind, Math.round(base * jitter));
  };

  const markLegacyDirty = (meta, data) => {
    const next = { ...meta, dirty: { ...meta.dirty } };
    for (const field of REMOTE_FIELDS) {
      if (!meaningful(field, data[field])) continue;
      next.dirty[field] = { value: data[field], legacy: true };
    }
    if (Object.keys(next.dirty).length > 0) next.revision += 1;
    return next;
  };

  const hydrate = async () => {
    if (disposed || !userId || activeOperation !== null) return;
    if (lifecycle.isOnline() === false) {
      publish(state.data, syncShape({
        phase: 'offline',
        error: Object.keys(activeMeta.dirty).length > 0
          ? publicError('OFFLINE', 'บันทึกไว้ในเครื่องแล้ว และจะซิงก์เมื่อกลับมาออนไลน์')
          : null,
      }));
      return;
    }
    const operation = ++operationSequence;
    activeOperation = operation;
    const generation = sessionGeneration;
    publish(state.data, syncShape({
      phase: lifecycle.isOnline() ? 'hydrating' : 'offline',
      error: null,
    }));

    try {
      const row = await remote.pull(userId);
      if (disposed || generation !== sessionGeneration) return;
      const remoteSnapshot = fromRemoteRow(row);
      const ownerBefore = parseJson(storage, CURRENT_OWNER_KEY, null);
      const accountChanged = Boolean(ownerBefore && ownerBefore !== userId && ownerBefore !== ANONYMOUS);
      let merged = { ...state.data };
      const nextDirty = { ...activeMeta.dirty };

      for (const field of REMOTE_FIELDS) {
        const definition = USER_DATA_FIELDS[field];
        const dirty = nextDirty[field];
        if (dirty) {
          const remoteValue = remoteSnapshot.present.has(field)
            ? remoteSnapshot.data[field]
            : clone(definition.initial);
          const value = remoteSnapshot.found
            ? reconcileDirty(field, dirty, remoteValue)
            : dirty.value;
          merged[field] = value;
          nextDirty[field] = { ...dirty, value };
          continue;
        }

        if (remoteSnapshot.present.has(field)) {
          // Presence, not truthiness: [] and {} are legitimate remote values.
          merged[field] = remoteSnapshot.data[field];
        } else if (accountChanged) {
          // Do not leak the previous account's local values into a new account.
          merged[field] = clone(definition.initial);
        } else if (!remoteSnapshot.found && meaningful(field, merged[field])) {
          nextDirty[field] = {
            base: clone(definition.initial),
            value: merged[field],
            legacy: !activeMeta.initialized,
          };
        }
      }

      const pendingOperations = readPendingOperations(storage, userId);
      const replayed = replayOperations(merged, pendingOperations);
      merged = replayed.data;
      for (const field of replayed.touched) {
        const definition = USER_DATA_FIELDS[field];
        if (!definition.remoteKey) continue;
        const remoteValue = remoteSnapshot.present.has(field)
          ? remoteSnapshot.data[field]
          : clone(definition.initial);
        nextDirty[field] = {
          base: clone(remoteValue),
          value: merged[field],
        };
      }

      const nextMeta = {
        ...activeMeta,
        initialized: true,
        dirty: nextDirty,
        revision: activeMeta.revision + (
          sameValue(activeMeta.dirty, nextDirty) ? 0 : 1
        ),
      };
      const commit = writeLocalCommit(storage, {
        patch: merged,
        meta: nextMeta,
        metaStorageKey: metaKey(userId),
        snapshot: merged,
        snapshotStorageKey: dataKey(userId),
        owner: userId,
      });
      activeMeta = nextMeta;
      hydratedUserId = userId;
      retryAttempt = 0;

      const hasPending = (
        Object.keys(nextDirty).length > 0 ||
        pendingOperations.some(operationTouchesRemote)
      );
      publish(merged, syncShape({
        phase: hasPending ? 'pending' : 'synced',
        error: commit.mirrorError
          ? publicError('LOCAL_MIRROR_FAILED', 'ข้อมูลปลอดภัยใน recovery journal และจะลองจัดเก็บอีกครั้ง')
          : null,
      }));
      if (hasPending) schedule('flush', debounceMs);
    } catch (error) {
      if (disposed || generation !== sessionGeneration) return;
      const isOffline = lifecycle.isOnline() === false;
      const code = error?.code === 'INVALID_REMOTE_DATA'
        ? 'INVALID_REMOTE_DATA'
        : 'REMOTE_PULL_FAILED';
      publish(state.data, syncShape({
        phase: isOffline ? 'offline' : 'error',
        error: publicError(
          code,
          code === 'INVALID_REMOTE_DATA'
            ? 'ข้อมูลบนบัญชีมีรูปแบบไม่ถูกต้อง จึงยังไม่เขียนทับ'
            : 'ยังอ่านข้อมูลจากบัญชีไม่ได้ ข้อมูลในเครื่องยังอยู่ครบ',
          code !== 'INVALID_REMOTE_DATA',
        ),
      }));
      if (code !== 'INVALID_REMOTE_DATA') scheduleRetry('hydrate');
    } finally {
      if (activeOperation === operation) activeOperation = null;
    }
  };

  const flush = async () => {
    if (
      disposed ||
      !userId ||
      hydratedUserId !== userId ||
      activeOperation !== null
    ) return;
    const queuedBeforeFlush = readPendingOperations(storage, userId);
    if (
      Object.keys(activeMeta.dirty).length === 0 &&
      !queuedBeforeFlush.some(operationTouchesRemote)
    ) return;

    if (lifecycle.isOnline() === false) {
      publish(state.data, syncShape({
        phase: 'offline',
        error: publicError('OFFLINE', 'บันทึกไว้ในเครื่องแล้ว และจะซิงก์เมื่อกลับมาออนไลน์'),
      }));
      scheduleRetry('flush');
      return;
    }

    const operation = ++operationSequence;
    activeOperation = operation;
    const generation = sessionGeneration;
    publish(state.data, syncShape({ phase: 'syncing', error: null }));
    let failureStage = 'pull';

    try {
      // Re-read immediately before every write. A device or tab may have
      // changed unrelated cloud fields since this store hydrated; rebasing
      // here keeps those changes instead of replacing them with a stale row.
      const row = await remote.pull(userId);
      if (disposed || generation !== sessionGeneration) return;
      const remoteSnapshot = fromRemoteRow(row);
      let rebasedData = { ...state.data };
      const rebasedDirty = { ...activeMeta.dirty };

      for (const field of REMOTE_FIELDS) {
        const definition = USER_DATA_FIELDS[field];
        const dirty = rebasedDirty[field];
        if (dirty) {
          const remoteValue = remoteSnapshot.present.has(field)
            ? remoteSnapshot.data[field]
            : clone(definition.initial);
          const value = remoteSnapshot.found
            ? reconcileDirty(field, dirty, remoteValue)
            : dirty.value;
          rebasedData[field] = value;
          rebasedDirty[field] = {
            base: clone(remoteValue),
            value,
          };
        } else if (remoteSnapshot.present.has(field)) {
          rebasedData[field] = remoteSnapshot.data[field];
        }
      }

      // Capture all durable operations that exist after the network read.
      // Operations written while the subsequent push is in flight remain in
      // storage and are picked up by the follow-up flush.
      const capturedOperations = readPendingOperations(storage, userId);
      const replayed = replayOperations(rebasedData, capturedOperations);
      rebasedData = replayed.data;
      for (const field of replayed.touched) {
        const definition = USER_DATA_FIELDS[field];
        if (!definition.remoteKey) continue;
        const remoteValue = remoteSnapshot.present.has(field)
          ? remoteSnapshot.data[field]
          : clone(definition.initial);
        rebasedDirty[field] = {
          base: clone(remoteValue),
          value: rebasedData[field],
        };
      }

      const rebaseChanged = (
        !sameValue(state.data, rebasedData) ||
        !sameValue(activeMeta.dirty, rebasedDirty)
      );
      const rebasedMeta = {
        ...activeMeta,
        dirty: rebasedDirty,
        revision: activeMeta.revision + (rebaseChanged ? 1 : 0),
      };
      writeLocalCommit(storage, {
        patch: rebasedData,
        meta: rebasedMeta,
        metaStorageKey: metaKey(userId),
        snapshot: rebasedData,
        snapshotStorageKey: dataKey(userId),
        owner: userId,
      });
      activeMeta = rebasedMeta;
      publish(rebasedData, syncShape({ phase: 'syncing', error: null }));

      const payload = toRemoteUserData(rebasedData);
      failureStage = 'push';
      await remote.push(userId, payload);
      if (disposed || generation !== sessionGeneration) return;
      retryAttempt = 0;

      acknowledgeRemoteOperationParts(storage, capturedOperations);
      const remainingOperations = readPendingOperations(storage, userId);
      const afterAck = replayOperations(rebasedData, remainingOperations);
      const remainingDirty = {};
      for (const field of afterAck.touched) {
        const definition = USER_DATA_FIELDS[field];
        if (!definition.remoteKey) continue;
        remainingDirty[field] = {
          base: clone(rebasedData[field]),
          value: afterAck.data[field],
        };
      }
      const hasRemotePending = remainingOperations.some(operationTouchesRemote);
      const syncedAt = hasRemotePending
        ? activeMeta.lastSyncedAt
        : now();
      const nextMeta = {
        ...activeMeta,
        dirty: remainingDirty,
        initialized: true,
        revision: activeMeta.revision + 1,
        lastSyncedAt: syncedAt,
      };
      writeLocalCommit(storage, {
        patch: afterAck.data,
        meta: nextMeta,
        metaStorageKey: metaKey(userId),
        snapshot: afterAck.data,
        snapshotStorageKey: dataKey(userId),
        owner: userId,
      });
      activeMeta = nextMeta;
      publish(afterAck.data, syncShape({
        phase: hasRemotePending ? 'pending' : 'synced',
        error: null,
        lastSyncedAt: syncedAt,
      }));
      if (hasRemotePending) schedule('flush', 0);
    } catch (error) {
      if (disposed || generation !== sessionGeneration) return;
      const invalidRemote = error?.code === 'INVALID_REMOTE_DATA';
      const code = invalidRemote
        ? 'INVALID_REMOTE_DATA'
        : (failureStage === 'pull' ? 'REMOTE_PULL_FAILED' : 'REMOTE_PUSH_FAILED');
      publish(state.data, syncShape({
        phase: lifecycle.isOnline() === false ? 'offline' : 'error',
        error: publicError(
          code,
          'บันทึกไว้ในเครื่องแล้ว แต่ยังส่งขึ้นบัญชีไม่สำเร็จ',
        ),
      }));
      if (!invalidRemote) scheduleRetry('flush');
    } finally {
      if (activeOperation === operation) activeOperation = null;
    }
  };

  const change = (command) => {
    const expectedPrincipal = command.principalId || null;
    if (
      Object.prototype.hasOwnProperty.call(command, 'principalId') &&
      expectedPrincipal !== userId
    ) {
      return { accepted: false, error: { code: 'STALE_PRINCIPAL' } };
    }
    if (typeof command.derive !== 'function') {
      throw new TypeError('CHANGE requires derive(currentData)');
    }
    const currentData = replayOperations(
      state.data,
      readPendingOperations(storage, userId),
    ).data;
    const patch = command.derive(currentData);
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
      throw new TypeError('CHANGE derive() must return a partial data object');
    }

    const changed = {};
    for (const [field, value] of Object.entries(patch)) {
      const definition = USER_DATA_FIELDS[field];
      if (!definition) throw new TypeError(`Unknown user-data field: ${field}`);
      if (!isValidValue(value, definition)) {
        throw new TypeError(`Invalid value for user-data field: ${field}`);
      }
      if (!sameValue(currentData[field], value)) changed[field] = value;
    }
    if (Object.keys(changed).length === 0) {
      return { accepted: true, generation: activeMeta.revision };
    }

    const nextData = { ...currentData, ...changed };
    const nextMeta = {
      ...activeMeta,
      revision: activeMeta.revision + 1,
      dirty: { ...activeMeta.dirty },
    };
    for (const [field, value] of Object.entries(changed)) {
      if (!USER_DATA_FIELDS[field].remoteKey) continue;
      const existing = nextMeta.dirty[field];
      nextMeta.dirty[field] = existing
        ? { ...existing, value }
        : { base: currentData[field], value };
    }

    const operationChanges = Object.fromEntries(
      Object.entries(changed).map(([field, value]) => [
        field,
        { base: currentData[field], value },
      ]),
    );
    try {
      // A unique per-store operation is the first durability boundary. Two
      // tabs can overwrite shared snapshots, but never each other's outbox
      // entries; replay restores both changes after a crash or reload.
      persistOperation(operationChanges);
    } catch {
      publish(state.data, syncShape({
        phase: 'error',
        error: publicError(
          'LOCAL_WRITE_FAILED',
          'พื้นที่จัดเก็บในเครื่องไม่พอ จึงยังไม่บันทึกการเปลี่ยนแปลงนี้',
          false,
        ),
      }));
      return {
        accepted: false,
        error: { code: 'LOCAL_WRITE_FAILED' },
      };
    }

    try {
      const commit = writeLocalCommit(storage, {
        patch: changed,
        meta: nextMeta,
        metaStorageKey: metaKey(userId),
        snapshot: nextData,
        snapshotStorageKey: dataKey(userId),
        owner: principalKey(userId),
      });
      activeMeta = nextMeta;
      publish(nextData, syncShape({
        phase: userId
          ? (
            lifecycle.isOnline() === false
              ? 'offline'
              : (hydratedUserId === userId ? 'pending' : 'hydrating')
          )
          : 'local-only',
        error: commit.mirrorError
          ? publicError('LOCAL_MIRROR_FAILED', 'ข้อมูลปลอดภัยใน recovery journal และจะลองจัดเก็บอีกครั้ง')
          : null,
      }));
      if (userId && hydratedUserId === userId) schedule('flush', debounceMs);
      return { accepted: true, generation: nextMeta.revision };
    } catch {
      // The append-only operation above is already durable. A failed shared
      // snapshot mirror must not make the accepted edit disappear in-memory.
      activeMeta = nextMeta;
      publish(nextData, syncShape({
        phase: 'error',
        error: publicError(
          'LOCAL_MIRROR_FAILED',
          'บันทึกการเปลี่ยนแปลงไว้แล้ว แต่ยังจัด snapshot ในเครื่องไม่สำเร็จ',
          false,
        ),
      }));
      if (userId && hydratedUserId === userId) schedule('flush', debounceMs);
      return { accepted: true, generation: nextMeta.revision };
    }
  };

  const sessionChanged = (nextUserId) => {
    const normalized = nextUserId || null;
    if (normalized === userId && (normalized === null || hydratedUserId === normalized)) {
      return { accepted: true };
    }

    clearTimer();
    sessionGeneration += 1;
    activeOperation = null;
    retryAttempt = 0;
    const previousUserId = userId;
    userId = normalized;
    hydratedUserId = null;

    if (!userId) {
      if (!previousUserId) {
        activeMeta = normalizeMeta(parseJson(storage, metaKey(null), null));
        publish(state.data, syncShape({ phase: 'local-only', error: null }));
        return { accepted: true };
      }

      // Restore the separate signed-out workspace. Account-owned data stays
      // hidden, while work created before sign-in is not erased.
      const anonymousSnapshot = readPrincipalData(storage, null);
      const safeBase = anonymousSnapshot.found
        ? anonymousSnapshot.data
        : createEmptyUserData();
      const safeData = replayOperations(
        safeBase,
        readPendingOperations(storage, null),
      ).data;
      activeMeta = normalizeMeta(parseJson(storage, metaKey(null), null));
      try {
        writeLocalCommit(storage, {
          patch: safeData,
          meta: activeMeta,
          metaStorageKey: metaKey(null),
          snapshot: safeData,
          snapshotStorageKey: dataKey(null),
          owner: ANONYMOUS,
        });
      } catch {}
      publish(safeData, syncShape({
        phase: 'local-only',
        error: null,
        lastSyncedAt: null,
      }));
      return { accepted: true };
    }

    const storedMetaRaw = parseJson(storage, metaKey(userId), null);
    activeMeta = normalizeMeta(storedMetaRaw);
    const ownerBefore = parseJson(storage, CURRENT_OWNER_KEY, null);
    const accountSnapshot = readPrincipalData(storage, userId);
    let selectedData;
    if (accountSnapshot.found) {
      selectedData = accountSnapshot.data;
    } else if (!ownerBefore || ownerBefore === ANONYMOUS) {
      selectedData = state.data;
    } else if (ownerBefore === userId) {
      // Upgrade path from the old global-only localStorage layout.
      selectedData = readLocalData(storage).data;
    } else {
      selectedData = createEmptyUserData();
    }
    selectedData = replayOperations(
      selectedData,
      readPendingOperations(storage, userId),
    ).data;

    if (!storedMetaRaw && (!ownerBefore || ownerBefore === ANONYMOUS || ownerBefore === userId)) {
      const anonymousMeta = normalizeMeta(parseJson(storage, metaKey(null), null));
      if (Object.keys(anonymousMeta.dirty).length > 0) {
        activeMeta = {
          ...anonymousMeta,
          initialized: false,
          revision: anonymousMeta.revision + 1,
        };
      } else {
        activeMeta = markLegacyDirty(activeMeta, selectedData);
      }
    }

    try {
      writeLocalCommit(storage, {
        patch: selectedData,
        meta: activeMeta,
        metaStorageKey: metaKey(userId),
        snapshot: selectedData,
        snapshotStorageKey: dataKey(userId),
        owner: userId,
      });
    } catch {
      try { persistMeta(activeMeta); } catch {}
    }

    publish(selectedData, syncShape({
      phase: lifecycle.isOnline() ? 'hydrating' : 'offline',
      error: null,
    }));
    hydrate();
    return { accepted: true };
  };

  const refresh = () => {
    retryAttempt = 0;
    clearTimer();
    if (!userId) return { accepted: false, error: { code: 'NO_SESSION' } };
    if (hydratedUserId === userId) flush();
    else hydrate();
    return { accepted: true };
  };

  const handleLifecycle = (reason) => {
    if (disposed) return;
    if (reason === 'storage') {
      const persisted = readPrincipalData(storage, userId);
      const base = persisted.found ? persisted.data : state.data;
      const replayed = replayOperations(
        base,
        readPendingOperations(storage, userId),
      );
      publish(replayed.data, syncShape());
      if (userId) refresh();
      return;
    }
    if (!userId) return;
    if (reason === 'offline') {
      if (Object.keys(activeMeta.dirty).length > 0) {
        publish(state.data, syncShape({
          phase: 'offline',
          error: publicError('OFFLINE', 'บันทึกไว้ในเครื่องแล้ว และจะซิงก์เมื่อกลับมาออนไลน์'),
        }));
      }
      return;
    }
    refresh();
  };

  const resumeLifecycle = () => {
    if (disposed || unsubscribeLifecycle) return;
    unsubscribeLifecycle = lifecycle.subscribe(handleLifecycle);
    if (!userId || activeOperation !== null) return;
    if (hydratedUserId === userId) {
      const queued = readPendingOperations(storage, userId);
      if (
        Object.keys(activeMeta.dirty).length > 0 ||
        queued.some(operationTouchesRemote)
      ) schedule('flush', 0);
    } else {
      schedule('hydrate', 0);
    }
  };

  const pauseLifecycle = () => {
    if (unsubscribeLifecycle) unsubscribeLifecycle();
    unsubscribeLifecycle = null;
    sessionGeneration += 1;
    activeOperation = null;
    clearTimer();
  };

  return {
    getSnapshot() {
      return state;
    },
    subscribe(listener) {
      if (disposed) return () => {};
      listeners.add(listener);
      resumeLifecycle();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) pauseLifecycle();
      };
    },
    send(command) {
      if (disposed) return { accepted: false, error: { code: 'CLOSED' } };
      resumeLifecycle();
      if (!command || typeof command.type !== 'string') {
        throw new TypeError('UserDataSync command requires a type');
      }
      if (command.type === 'CHANGE') return change(command);
      if (command.type === 'SESSION_CHANGED') return sessionChanged(command.userId);
      if (command.type === 'REFRESH_REQUESTED') return refresh();
      throw new TypeError(`Unknown UserDataSync command: ${command.type}`);
    },
    close() {
      disposed = true;
      pauseLifecycle();
      listeners.clear();
    },
  };
}
