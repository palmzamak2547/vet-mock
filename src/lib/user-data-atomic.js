import { USER_DATA_FIELDS, createEmptyUserData } from './user-data-sync.js';
import { userDataChanges, applyUserDataChanges, dataFromSyncRow, accountRestoreChanges } from './user-data-operations.js';
import { newStudySessionId, validSessionId } from './study-events.js';
import { isQuotaError, sweepStaleKeys } from './storage-gc.js';

const DATA = 'vmx-user-data-v2:';
const OPS = 'vmx-user-intent-v2:';
const MAX_BATCH_BYTES = 7 * 1024 * 1024; // Leave JSON envelope room under the RPC's 8 MiB limit.
const ownerKey = id => encodeURIComponent(id || 'anonymous');
const clone = value => JSON.parse(JSON.stringify(value));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const remoteFields = () => new Set(Object.values(USER_DATA_FIELDS).map(field => field.remoteKey).filter(Boolean));
const errorOf = (code, message, retryable = true) => ({ code, message, retryable });
const bytes = value => new TextEncoder().encode(JSON.stringify(value)).byteLength;

/** Immutable local intent plus server receipts. Snapshots never become intent. */
export function createAtomicUserDataSync({ storage, remote, lifecycle, scheduler, now, debounceMs, readLegacy }) {
  let userId = null;
  let generation = 0;
  let active = null;
  let timer = null;
  let stopLifecycle = null;
  let closed = false;
  let retries = 0;
  let ready = false;
  let intentReadError = null;
  const knownIntentIds = new Map();
  const listeners = new Set();
  const dataKey = id => DATA + ownerKey(id);
  const opPrefix = id => OPS + ownerKey(id) + ':';
  const blank = data => ({ version: 2, revision: 0, clock: 0, base: data, acknowledged: [],
    legacyFingerprint: null, recovery: null, archive: null });
  const readSnapshot = id => {
    try {
      const raw = storage.getItem(dataKey(id));
      if (raw === null) return null;
      const value = JSON.parse(raw);
      if (value?.version !== 2 || !value.base || typeof value.base !== 'object' || Array.isArray(value.base)
        || !Number.isSafeInteger(value.revision)) throw new Error('Invalid owner snapshot');
      return value;
    } catch { readFailure(); return null; }
  };
  const readFailure = () => { intentReadError = errorOf('LOCAL_READ_FAILED', 'ยังอ่านงานค้างในเครื่องไม่สำเร็จ กรุณาลองซิงก์อีกครั้ง'); };
  const readOperations = (id = userId, snapshot = current) => {
    const result = [];
    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key?.startsWith(opPrefix(id))) continue;
        try {
          const raw = storage.getItem(key);
          if (raw === null) continue; // A peer may have removed its acknowledged row.
          const record = JSON.parse(raw);
          const operations = record?.preparedOperations ?? record?.operations ?? [record];
          if (!Array.isArray(operations) || !operations.length || operations.some(op =>
            op?.version !== 2 || !validSessionId(op.id) || !Number.isSafeInteger(op.clock)
            || !op.changes || typeof op.changes !== 'object' || Array.isArray(op.changes))) throw new Error('Invalid immutable intent');
          if (record.preparedOperations && !validSessionId(record.recoveryCommit)) throw new Error('Invalid recovery commit');
          knownIntentIds.set(key, operations.map(op => op.id));
          for (const op of operations) result.push({ ...op, key, recoveryCommit: record.recoveryCommit });
        } catch {
          // Only previously read immutable rows whose every operation has a
          // receipt can be ignored safely. An unknown row is never empty work.
          const known = knownIntentIds.get(key);
          if (!known || !known.every(opId => snapshot?.acknowledged?.includes(opId))) readFailure();
        }
      }
    } catch { readFailure(); }
    return result;
  };
  const pending = (id = userId, snapshot = current) => {
    const acknowledged = new Set(snapshot?.acknowledged || []);
    const result = readOperations(id, snapshot).filter(op => !acknowledged.has(op.id)
      && (!op.recoveryCommit || snapshot?.recoveryCommits?.includes(op.recoveryCommit)));
    const canceled = new Set(result.flatMap(op => op.cancel || []));
    return result.filter(op => !canceled.has(op.id)).sort((a, b) => a.clock - b.clock || a.id.localeCompare(b.id));
  };
  const retainedAcknowledgements = () => {
    const operations = readOperations();
    const readable = new Set(operations.map(op => op.key));
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith(opPrefix(userId)) && !readable.has(key)) return current.acknowledged;
    }
    const existing = new Set(operations.map(op => op.id));
    return current.acknowledged.filter(id => existing.has(id));
  };
  const retainedRecoveryCommits = (acknowledged = current.acknowledged) => {
    const completed = new Set(acknowledged);
    return (current.recoveryCommits || []).filter(id => {
      try {
        const raw = storage.getItem(opPrefix(userId) + id);
        if (raw === null) return false;
        const operations = JSON.parse(raw)?.preparedOperations;
        return !Array.isArray(operations) || operations.some(op => !completed.has(op.id));
      } catch { return true; } // A failed read cannot revoke a committed choice.
    });
  };
  const removeAcknowledged = () => {
    const operations = readOperations();
    const remainingKeys = new Set(operations.filter(op => !current.acknowledged.includes(op.id)).map(op => op.key));
    for (const key of new Set(operations.map(op => op.key))) if (!remainingKeys.has(key)) {
      try { storage.removeItem(key); knownIntentIds.delete(key); } catch { /* The persisted receipt still suppresses replay. */ }
    }
  };
  const replay = (snapshot, operations) => operations.reduce((data, operation) => applyUserDataChanges(data, operation.changes), snapshot.base);
  const committedData = snapshot => snapshot.recoveryCommits?.length && ['local', 'account'].includes(snapshot.archive?.resolvedAs)
    ? snapshot.archive[snapshot.archive.resolvedAs] || snapshot.base : snapshot.recovery?.local || snapshot.base;
  let guest;
  try { guest = readLegacy(null); }
  catch { readFailure(); guest = { visible: false, data: createEmptyUserData() }; }
  let current = readSnapshot(null) || blank(guest.visible ? guest.data : createEmptyUserData());
  const guestOperations = pending(null, current);
  let state = { principalId: null, data: intentReadError ? committedData(current)
    : guest.visible ? replay(current, guestOperations) : createEmptyUserData(),
    sync: { phase: intentReadError ? 'error' : 'local-only', pending: !!intentReadError,
      dirtyFields: [], error: intentReadError, lastSyncedAt: null, recovery: null } };
  const nextClock = (serverClock = 0) => pending().reduce((clock, op) => Math.max(clock, op.clock + 1),
    Math.max(Math.trunc(now()), current.clock + 1, serverClock + 1));

  const publish = (phase, error = null) => {
    const queued = pending();
    const sameOwner = state.principalId === userId;
    const data = intentReadError ? sameOwner ? state.data : committedData(current) : replay(current, queued);
    state = { principalId: userId, data, sync: {
      phase: intentReadError ? 'error' : phase, error: intentReadError || error,
      pending: !!intentReadError || queued.length > 0 || Boolean(current.recovery),
      dirtyFields: intentReadError ? sameOwner ? state.sync.dirtyFields : [] : [...new Set(queued.flatMap(op => Object.keys(op.changes)))],
      lastSyncedAt: current.lastSyncedAt ?? null,
      recovery: current.recovery ? { ...current.recovery, local: intentReadError ? data : current.recovery.kind === 'conflict'
        ? queued.reduce((data, op) => applyUserDataChanges(data, op.changes), current.recovery.local)
        : replay(current, queued) } : null,
      recoveryArchive: current.archive || null,
    } };
    for (const listener of listeners) listener();
  };
  const write = (key, value) => {
    try { storage.setItem(key, JSON.stringify(value)); }
    catch (error) {
      if (!isQuotaError(error)) throw error;
      sweepStaleKeys(storage);
      storage.setItem(key, JSON.stringify(value));
    }
  };
  const mirror = data => {
    try {
      storage.setItem('vmx-user-sync-owner-v1', JSON.stringify(userId || 'anonymous'));
      for (const [field, definition] of Object.entries(USER_DATA_FIELDS)) storage.setItem(definition.localKey, JSON.stringify(data[field]));
      // Retained clean readers prefer their principal snapshot to raw keys.
      // Project only acknowledged account state, never overwrite dirty v1 work.
      // An old edit racing this check remains in its untouched intent/meta log.
      if (userId && !readLegacy(userId).pending) {
        storage.setItem(`vmx-user-data-v1:${ownerKey(userId)}`, JSON.stringify(current.recovery?.account || current.base));
      }
    } catch { /* The v2 snapshot/outbox remain the durable authority. */ }
  };
  const saveSnapshot = snapshot => {
    write(dataKey(userId), snapshot);
    current = snapshot;
    const queued = pending();
    if (!intentReadError) mirror(replay(current, queued));
  };
  const clearTimer = () => { if (timer !== null) scheduler.clearTimeout(timer); timer = null; };
  const schedule = delay => {
    clearTimer();
    if (!closed && userId && !intentReadError && (!current.recovery || current.recovery.kind === 'conflict')) timer = scheduler.setTimeout(() => { timer = null; flush(); }, delay);
  };
  const failed = (error, captured = []) => {
    const permanent = ['INVALID_REMOTE_DATA', 'VMX_CUSTOM_ID_CONFLICT'].some(code => String(error?.message || error?.code).includes(code));
    const customCollision = String(error?.message).includes('VMX_CUSTOM_ID_CONFLICT');
    if (customCollision && captured.length) {
      const local = replay(current, pending());
      const recovery = { id: newStudySessionId(), kind: 'custom-id', local, account: null, operations: captured,
        message: 'ข้อสอบส่วนตัวมีรหัสซ้ำกับบัญชี กรุณาส่งออกข้อมูลค้างก่อนใช้ข้อมูลบัญชี แล้วนำเข้าข้อสอบที่ต้องการอีกครั้ง' };
      try { saveSnapshot({ ...current, recovery, archive: { ...recovery, previous: current.archive } }); }
      catch { current = { ...current, recovery }; }
      previewRecovery();
    }
    publish(lifecycle.isOnline() === false ? 'offline' : 'error', errorOf(customCollision ? 'CUSTOM_ID_CONFLICT' : error?.code || 'REMOTE_PUSH_FAILED',
      customCollision ? 'ข้อสอบส่วนตัวมีรหัสซ้ำกับข้อมูลบัญชี ข้อมูลในเครื่องยังอยู่ครบ กรุณาสำรองแล้วนำเข้าข้อนั้นใหม่เพื่อรับรหัสใหม่'
        : 'บันทึกไว้ในเครื่องแล้ว แต่ยังส่งขึ้นบัญชีไม่สำเร็จ', !permanent));
    if (!permanent) schedule(Math.min(30000, 1500 * 2 ** Math.min(retries++, 5)));
  };
  const latest = () => {
    const stored = readSnapshot(userId);
    if (stored && stored.revision >= current.revision) current = stored;
  };
  const archiveLegacy = legacy => {
    const recovery = { id: newStudySessionId(), kind: 'legacy', local: legacy.data, account: null,
      message: 'มีข้อมูลค้างจากเวอร์ชันก่อน กรุณาสำรองและเลือกข้อมูลที่ต้องการใช้ก่อนซิงก์' };
    saveSnapshot({ ...current, base: legacy.data, recovery,
      archive: { kind: 'legacy', local: legacy.data, legacy: legacy.evidence, previous: current.archive }, legacyFingerprint: legacy.fingerprint });
  };
  const checkLegacy = () => {
    if (!userId || current.recovery) return;
    const legacy = readLegacy(userId);
    if (legacy.pending && legacy.fingerprint !== current.legacyFingerprint) archiveLegacy(legacy);
  };
  const previewRecovery = async () => {
    if (intentReadError || !userId || !current.recovery || lifecycle.isOnline() === false) return;
    const expected = generation;
    try {
      const row = await remote.pull(userId);
      latest();
      if (expected !== generation || !current.recovery) return;
      saveSnapshot({ ...current, recovery: { ...current.recovery, account: dataFromSyncRow(row, createEmptyUserData) } });
      publish('error', errorOf('LEGACY_RECOVERY_REQUIRED', current.recovery.message, false));
    } catch { /* Local recovery remains visible and exportable while offline. */ }
  };

  async function flush() {
    if (closed || !userId || active !== null) return;
    if (intentReadError) { publish('error', intentReadError); return; }
    latest();
    if (intentReadError) { publish('error', intentReadError); return; }
    try { checkLegacy(); } catch (error) { failed(error); return; }
    if (current.recovery && current.recovery.kind !== 'conflict') { publish('error', errorOf('LEGACY_RECOVERY_REQUIRED', current.recovery.message, false)); previewRecovery(); return; }
    if (lifecycle.isOnline() === false) { publish('offline'); return; }
    const queued = pending();
    if (intentReadError) { publish('error', intentReadError); return; }
    const expected = generation;
    const selectedUser = userId;
    const operation = {};
    active = operation;
    const fields = remoteFields();
    const captured = [], outgoing = [];
    let batchBytes = 2, cancelCount = 0;
    for (const op of queued) {
      const payload = { id: op.id, clock: op.clock,
        ...(op.cancel?.length ? { cancel: op.cancel } : {}),
        changes: Object.fromEntries(Object.entries(op.changes).filter(([field]) => fields.has(field))) };
      const size = bytes(payload) + 1;
      if (captured.length && (captured.length >= 200 || batchBytes + size > MAX_BATCH_BYTES || cancelCount + (op.cancel?.length || 0) > 10000)) break;
      captured.push(op); outgoing.push(payload); batchBytes += size; cancelCount += op.cancel?.length || 0;
    }
    publish('syncing');
    if (intentReadError) { active = null; return; }
    try {
      const result = await remote.apply(selectedUser, outgoing);
      if (closed || expected !== generation) return;
      if (!result || result.row?.user_id !== selectedUser || result.row.sync_version !== 2 || !Number.isSafeInteger(result.row.sync_revision)
        || !Number.isSafeInteger(result.row.sync_clock) || !Array.isArray(result.acknowledged)
        || result.row.sync_revision < 0 || result.row.sync_clock < 0
        || result.acknowledged.some(id => !outgoing.some(op => op.id === id))
        || (result.conflicts !== undefined && (!Array.isArray(result.conflicts)
          || result.conflicts.some(conflict => !outgoing.some(op => op.id === conflict?.id) || !fields.has(conflict.field) || typeof conflict.key !== 'string')))
        || outgoing.some(op => !result.acknowledged.includes(op.id))) {
        throw Object.assign(new Error('Invalid synchronization receipt'), { code: 'INVALID_REMOTE_DATA' });
      }
      latest();
      const visibleBeforeAck = replay(current, pending());
      if (intentReadError) { publish('error', intentReadError); return; }
      const localOnly = Object.fromEntries(Object.entries(USER_DATA_FIELDS).filter(([, field]) => !field.remoteKey)
        .map(([field]) => [field, visibleBeforeAck[field]]));
      const newer = result.row.sync_revision >= current.revision;
      const base = newer ? { ...dataFromSyncRow(result.row, createEmptyUserData), ...localOnly } : { ...current.base, ...localOnly };
      const acknowledged = [...new Set([...retainedAcknowledgements(),
        ...result.acknowledged, ...captured.filter(op => result.acknowledged.includes(op.id)).flatMap(op => op.cancel || [])])];
      const suppressed = result.conflicts?.length ? captured.filter(op => result.conflicts.some(conflict => conflict.id === op.id)) : [];
      const snapshot = { ...current, base, revision: Math.max(current.revision, result.row.sync_revision),
        clock: Math.max(current.clock, result.row.sync_clock), acknowledged,
        recoveryCommits: retainedRecoveryCommits(acknowledged), lastSyncedAt: now() };
      if (current.recovery && current.recovery.kind !== 'conflict') {
        snapshot.base = visibleBeforeAck;
        snapshot.recovery = { ...current.recovery, local: visibleBeforeAck, account: base };
      }
      if (suppressed.length && !current.recovery) {
        const local = suppressed.reduce((data, op) => applyUserDataChanges(data, op.changes), base);
        snapshot.recovery = { id: newStudySessionId(), kind: 'conflict', local, account: base, operations: suppressed,
          message: 'มีข้อมูลจากอีกเครื่องใหม่กว่า กรุณาสำรองและเลือกข้อมูลที่ต้องการใช้' };
        snapshot.archive = { ...snapshot.recovery, previous: current.archive };
      }
      if (intentReadError) { publish('error', intentReadError); return; }
      saveSnapshot(snapshot); // Persist receipts before removing immutable records.
      removeAcknowledged();
      ready = true;
      retries = 0;
      publish(current.recovery ? 'error' : pending().length ? 'pending' : 'synced',
        current.recovery ? errorOf('SYNC_CONFLICT', current.recovery.message, false) : null);
      if (!intentReadError) mirror(state.data);
      if (pending().length) schedule(0);
    } catch (error) { if (!closed && expected === generation) failed(error, captured); }
    finally { if (active === operation) active = null; }
  }

  const change = command => {
    if (Object.prototype.hasOwnProperty.call(command, 'principalId') && (command.principalId || null) !== userId) {
      return { accepted: false, error: { code: 'STALE_PRINCIPAL' } };
    }
    latest();
    const before = replay(current, pending());
    if (intentReadError) { publish('error', intentReadError); return { accepted: false, error: intentReadError }; }
    const patch = command.derive(before);
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)
      || Object.keys(patch).some(field => !Object.prototype.hasOwnProperty.call(USER_DATA_FIELDS, field))) {
      throw new TypeError('CHANGE requires known user-data fields');
    }
    const changes = userDataChanges(before, patch, true);
    if (!Object.keys(changes).length) return { accepted: true };
    const clock = nextClock();
    if (intentReadError) { publish('error', intentReadError); return { accepted: false, error: intentReadError }; }
    if (!Number.isSafeInteger(clock)) throw new Error('Synchronization clock limit reached');
    const op = { version: 2, id: newStudySessionId(), clock, changes };
    const key = opPrefix(userId) + op.id;
    if (bytes(op) > MAX_BATCH_BYTES - 1024) {
      const error = errorOf('LOCAL_WRITE_FAILED', 'ข้อมูลชุดนี้ใหญ่เกิน 7 MB กรุณาแบ่งเป็นชุดเล็กลง ข้อมูลเดิมยังอยู่ครบ', false);
      publish('error', error);
      return { accepted: false, error };
    }
    try { write(key, op); }
    catch {
      publish('error', errorOf('LOCAL_WRITE_FAILED', 'พื้นที่จัดเก็บในเครื่องไม่พอ จึงยังไม่บันทึกการเปลี่ยนแปลงนี้', false));
      return { accepted: false, error: { code: 'LOCAL_WRITE_FAILED' } };
    }
    state = { ...state, data: applyUserDataChanges(before, changes) };
    if (!userId) {
      try {
        const queued = pending();
        if (!intentReadError) {
          const acknowledged = [...new Set([...retainedAcknowledgements(), ...queued.map(item => item.id)])];
          if (!intentReadError) {
            saveSnapshot({ ...current, base: replay(current, queued), clock, acknowledged });
            removeAcknowledged();
          }
        }
      } catch { /* The immutable operation remains durable if the snapshot mirror is full. */ }
    }
    publish(userId ? current.recovery ? 'error' : lifecycle.isOnline() === false ? 'offline' : 'pending' : 'local-only',
      current.recovery ? errorOf('LEGACY_RECOVERY_REQUIRED', current.recovery.message, false) : null);
    if (!intentReadError) mirror(state.data);
    if (userId) schedule(debounceMs);
    return { accepted: true, generation: clock };
  };

  const recover = async (choice, principalId, recoveryId) => {
    latest();
    if (principalId !== undefined && (principalId || null) !== userId) return { accepted: false, error: { code: 'STALE_PRINCIPAL' } };
    pending();
    if (intentReadError) { publish('error', intentReadError); return { accepted: false, error: intentReadError }; }
    if (recoveryId !== undefined && current.recovery?.id !== recoveryId) return { accepted: false, error: { code: 'RECOVERY_CHANGED' } };
    if (!userId || !current.recovery || !['local', 'account'].includes(choice) || lifecycle.isOnline() === false) return { accepted: false };
    const expected = generation;
    const selected = userId;
    const selectedRecovery = current.recovery.id;
    const row = await remote.pull(selected);
    if (expected !== generation) return { accepted: false, error: { code: 'STALE_PRINCIPAL' } };
    latest();
    if (current.recovery?.id !== selectedRecovery) return { accepted: false, error: { code: 'RECOVERY_CHANGED' } };
    if (choice === 'local' && current.recovery.kind === 'custom-id') return { accepted: false, error: { code: 'CUSTOM_ID_CONFLICT' } };
    const queued = pending();
    if (intentReadError) { publish('error', intentReadError); return { accepted: false, error: intentReadError }; }
    const desired = current.recovery.kind === 'conflict'
      ? queued.reduce((data, op) => applyUserDataChanges(data, op.changes), current.recovery.local)
      : replay(current, queued);
    const account = { ...dataFromSyncRow(row, createEmptyUserData), ...Object.fromEntries(Object.entries(USER_DATA_FIELDS)
      .filter(([, field]) => !field.remoteKey).map(([field]) => [field, desired[field]])) };
    let legacy;
    try { legacy = readLegacy(selected); }
    catch { readFailure(); publish('error', intentReadError); return { accepted: false, error: intentReadError }; }
    if (current.recovery.kind === 'legacy' && legacy.pending && legacy.fingerprint !== current.legacyFingerprint) {
      archiveLegacy(legacy);
      publish('error', errorOf('RECOVERY_CHANGED', 'มีข้อมูลค้างใหม่จากอีกหน้าต่าง กรุณาตรวจสำเนาล่าสุดก่อนเลือก', false));
      previewRecovery();
      return { accepted: false, error: { code: 'RECOVERY_CHANGED' } };
    }
    const clock = nextClock(row?.sync_clock || 0);
    if (intentReadError) { publish('error', intentReadError); return { accepted: false, error: intentReadError }; }
    if (!Number.isSafeInteger(clock)) return { accepted: false, error: { code: 'INVALID_REMOTE_DATA' } };
    const discarded = current.recovery.kind === 'custom-id' ? queued : [];
    const resolutions = [];
    for (let i = 0; i < discarded.length; i += 200) resolutions.push({ version: 2, id: newStudySessionId(),
      clock: clock + resolutions.length, changes: {}, cancel: discarded.slice(i, i + 200).map(op => op.id) });
    resolutions.push({ version: 2, id: newStudySessionId(), clock: clock + resolutions.length,
      changes: discarded.length ? accountRestoreChanges(account, discarded) : choice === 'local' ? userDataChanges(account, desired, true) : {} });
    const recoveryCommit = resolutions[0].id;
    const resolutionKey = opPrefix(selected) + recoveryCommit;
    // The snapshot commits this choice; a prepared envelope cannot replay or
    // cancel work if that write fails or the page closes between the writes.
    // Retained v2 readers ignore preparedOperations and cannot publish a
    // choice whose snapshot has not committed.
    const envelope = { version: 2, preparedOperations: resolutions, recoveryCommit };
    try {
      if (bytes(envelope) > MAX_BATCH_BYTES - 1024 || !Number.isSafeInteger(resolutions.at(-1).clock)) throw new Error('Recovery operation is too large');
      write(resolutionKey, envelope);
      const recoveryCommits = [...retainedRecoveryCommits(), recoveryCommit];
      const acknowledged = [...new Set([...retainedAcknowledgements(), ...discarded.map(op => op.id)])];
      if (intentReadError) {
        try { storage.removeItem(resolutionKey); } catch { /* A prepared choice stays inactive without its snapshot marker. */ }
        publish('error', intentReadError);
        return { accepted: false, error: intentReadError };
      }
      saveSnapshot({ ...current, base: account, recovery: null, legacyFingerprint: legacy.fingerprint,
        recoveryCommits, acknowledged,
        archive: { ...(current.archive || {}), local: desired, account, resolvedAs: choice, at: now() },
        revision: row?.sync_revision || 0, clock: resolutions.at(-1).clock });
      state = { ...state, data: choice === 'local' ? desired : account };
    } catch {
      try { storage.removeItem(resolutionKey); } catch { /* Uncommitted intent stays inactive across reload. */ }
      const error = intentReadError || errorOf('LOCAL_WRITE_FAILED', 'ยังจัดเก็บการเลือกนี้ไม่สำเร็จ ข้อมูลเดิมยังอยู่ครบ กรุณาลองอีกครั้ง', false);
      publish('error', error);
      return { accepted: false, error: { code: error.code } };
    }
    publish('pending');
    schedule(0);
    return { accepted: true };
  };

  const session = id => {
    const selected = id || null;
    if (selected === userId && ready) return { accepted: true };
    clearTimer(); generation++; active = null; ready = false; retries = 0;
    const previous = state.data;
    const fromGuest = userId === null;
    if (selected !== userId) { intentReadError = null; knownIntentIds.clear(); }
    userId = selected;
    let legacy;
    try { legacy = readLegacy(selected); }
    catch { readFailure(); legacy = { visible: false, found: false, pending: false, data: createEmptyUserData() }; }
    const snapshot = readSnapshot(selected);
    current = snapshot || blank(legacy.visible ? legacy.data : createEmptyUserData());
    if (!intentReadError && selected && !snapshot) {
      const guestImport = fromGuest && !same(previous, createEmptyUserData()) && !legacy.found;
      if (legacy.pending || guestImport) {
        try { archiveLegacy(guestImport ? { ...legacy, data: previous } : legacy); }
        catch { current.recovery = { id: newStudySessionId(), kind: 'legacy', local: previous, account: null, message: 'กรุณาสำรองข้อมูลในเครื่องก่อนเลือกข้อมูลบัญชี' }; }
      } else current.legacyFingerprint = legacy.fingerprint;
    }
    publish(selected ? current.recovery ? 'error' : 'hydrating' : 'local-only',
      current.recovery ? errorOf('LEGACY_RECOVERY_REQUIRED', current.recovery.message, false) : null);
    if (!intentReadError) mirror(state.data);
    if (selected) { if (current.recovery) previewRecovery(); else schedule(0); }
    else ready = true;
    return { accepted: true };
  };
  const resume = () => {
    if (stopLifecycle || closed) return;
    stopLifecycle = lifecycle.subscribe(reason => {
      if (reason === 'offline') { if (userId) publish('offline'); return; }
      latest();
      publish(userId ? current.recovery ? 'error' : pending().length ? 'pending' : state.sync.phase : 'local-only', state.sync.error);
      if (userId && (reason !== 'storage' || pending().length)) schedule(0);
    });
  };
  return {
    getSnapshot: () => state,
    subscribe(listener) { listeners.add(listener); resume(); return () => { listeners.delete(listener); if (!listeners.size) { stopLifecycle?.(); stopLifecycle = null; } }; },
    send(command) {
      if (closed) return { accepted: false, error: { code: 'CLOSED' } };
      resume();
      if (command.type === 'CHANGE') return change(command);
      if (command.type === 'SESSION_CHANGED') return session(command.userId);
      if (command.type === 'RECOVER_LEGACY') return recover(command.choice, command.principalId, command.recoveryId);
      if (command.type === 'REFRESH_REQUESTED') {
        retries = 0; intentReadError = null;
        if (!userId) { latest(); publish('local-only'); return { accepted: !intentReadError }; }
        flush(); return { accepted: true };
      }
      throw new TypeError(`Unknown UserDataSync command: ${command.type}`);
    },
    close() { closed = true; generation++; clearTimer(); stopLifecycle?.(); listeners.clear(); },
  };
}
