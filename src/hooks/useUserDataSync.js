import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { pullUserData, pushUserData } from '../lib/api.js';
import {
  createBrowserLifecycle,
  createEmptyUserData,
  createUserDataSync,
  USER_DATA_FIELDS,
} from '../lib/user-data-sync.js';

function browserStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {}
  // SSR/tests fallback. The app normally creates this hook in a browser,
  // but a tiny in-memory adapter keeps import/render behavior deterministic.
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    key: (index) => [...values.keys()][index] ?? null,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function setterFor(store, field, principalId) {
  return (nextOrUpdater) => store.send({
    type: 'CHANGE',
    principalId,
    derive: (current) => ({
      [field]: typeof nextOrUpdater === 'function'
        ? nextOrUpdater(current[field])
        : nextOrUpdater,
    }),
  });
}

// React adapter around the UserDataSync external store. Existing views keep
// familiar React-style setters while App no longer coordinates storage,
// cloud hydration, retry, or pull-before-push ordering itself.
export function useUserDataSync(userId) {
  const principalId = userId || null;
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createUserDataSync({
      storage: browserStorage(),
      lifecycle: createBrowserLifecycle(),
      remote: {
        pull: (id) => pullUserData(id),
        push: (id, payload) => pushUserData(id, payload),
      },
    });
  }
  const store = storeRef.current;
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );

  useEffect(() => {
    store.send({ type: 'SESSION_CHANGED', userId: principalId });
  }, [store, principalId]);

  const setters = useMemo(() => Object.fromEntries(Object.keys(USER_DATA_FIELDS)
    .map(field => [field, setterFor(store, field, principalId)])), [store, principalId]);

  const retry = useMemo(
    () => () => store.send({ type: 'REFRESH_REQUESTED' }),
    [store],
  );
  // One command owns the complete backup patch. A rejected local write must
  // leave every field unchanged, rather than applying half an import.
  const change = useMemo(() => patch => store.send({
    type: 'CHANGE', principalId, derive: current => typeof patch === 'function' ? patch(current) : patch,
  }), [store, principalId]);
  const emptyData = useMemo(() => createEmptyUserData(), []);
  const isCurrentPrincipal = snapshot.principalId === principalId;
  const visibleSync = isCurrentPrincipal
    ? snapshot.sync
    : {
      phase: principalId ? 'hydrating' : 'local-only',
      pending: false,
      dirtyFields: [],
      lastSyncedAt: null,
      error: null,
    };

  return {
    data: isCurrentPrincipal ? snapshot.data : emptyData,
    set: setters,
    change,
    sync: { ...visibleSync, retry },
  };
}
