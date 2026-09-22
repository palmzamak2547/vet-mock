import { ownedRpc } from './owned-rpc.js';
import {
  appendStudyEvents, pendingStudyEvents, markStudyEventsSynced,
  readStudyEventPullMark, writeStudyEventPullMark,
} from './study-event-log.js';

const PAGE = 100;
// A batch is stamped with its transaction's start time (now()), and a late
// append with clock_timestamp(), both before the commit. So a batch can become
// visible after a later-stamped one was already pulled. Each pull starts this
// far before the mark to catch those; appendStudyEvents skips events it has.
const OVERLAP_MS = 10 * 60 * 1000;

/** A PostgREST timestamptz ('2026-09-23T10:00:00.123456+00:00') as whole
 *  microseconds, to order marks without losing the digits Date drops. */
function stampMicros(text) {
  const m = /^(\d{4}-\d\d-\d\d)[T ](\d\d:\d\d:\d\d)(?:\.(\d+))?(Z|[+-]\d\d(?::?\d\d)?)?$/i.exec(String(text ?? ''));
  if (!m) return NaN;
  const frac = (m[3] || '').padEnd(6, '0');
  let zone = (m[4] || 'Z').toUpperCase();
  if (zone !== 'Z') zone = zone.length === 3 ? `${zone}:00` : `${zone.slice(0, 3)}:${zone.slice(-2)}`;
  const ms = Date.parse(`${m[1]}T${m[2]}.${frac.slice(0, 3)}${zone}`);
  return Number.isFinite(ms) ? ms * 1000 + Number(frac.slice(3, 6)) : NaN;
}

function later(a, b) {
  if (!b) return true;
  const ta = stampMicros(a.updatedAt), tb = stampMicros(b.updatedAt);
  if (!Number.isFinite(ta)) return false;
  if (!Number.isFinite(tb)) return true;
  return ta > tb || (ta === tb && a.sessionId > b.sessionId);
}

// Pages through the owner's batches in (updated_at, session_id) order. With a
// mark, only batches from shortly before it are asked for: a launch with
// nothing new costs one small request. Without one (a new device, cleared
// storage) or with full = true, everything comes down. The mark moves after
// each page, and only once that page's events are stored, so an interrupted
// pull resumes where it stopped and never skips what it did not store.
async function pullBatches(sb, owner, full) {
  let mark = await readStudyEventPullMark(owner);
  const since = full ? NaN : stampMicros(mark?.updatedAt);
  // { op, value } bounds the next page from below; `tie` pages through
  // batches that share one stamp, which updated_at alone cannot order.
  let lower = Number.isFinite(since)
    ? { op: 'gte', value: new Date(Math.floor(since / 1000) - OVERLAP_MS).toISOString() }
    : null;
  let tie = null;
  for (;;) {
    let query = sb.from('study_event_batches').select('session_id,events,updated_at').eq('user_id', owner);
    if (tie) {
      query = query.eq('updated_at', tie.updatedAt).gt('session_id', tie.sessionId).order('session_id');
    } else {
      if (lower) query = query[lower.op]('updated_at', lower.value);
      query = query.order('updated_at').order('session_id');
    }
    const { data, error } = await query.limit(PAGE).abortSignal(AbortSignal.timeout(12_000));
    if (error) throw error;
    const rows = data || [];
    for (const batch of rows) {
      const restored = await appendStudyEvents(owner, Object.values(batch.events || {}), { synced: true, keepOnFailure: false });
      if (!restored.ok) throw new Error('local-restore-failed');
    }
    const last = rows[rows.length - 1];
    const reached = last && { updatedAt: last.updated_at, sessionId: last.session_id };
    if (reached && later(reached, mark) && (await writeStudyEventPullMark(owner, reached)).ok) mark = reached;
    if (rows.length === PAGE) {
      tie = reached;
    } else if (tie) {
      lower = { op: 'gt', value: tie.updatedAt };
      tie = null;
    } else {
      return;
    }
  }
}

const running = new Map();
/** pull: true brings down what is new since this device's mark (everything
 *  when it has none); pull: 'full' re-reads the whole archive regardless. */
export function syncStudyEvents(owner, { pull = false } = {}) {
  if (!owner) return Promise.resolve({ ok: true });
  if (running.has(owner)) return pull
    ? running.get(owner).then(() => syncStudyEvents(owner, { pull }))
    : running.get(owner);
  const task = (async () => {
    try {
      const { getSupabase } = await import('./supabase.js');
      const sb = await getSupabase();
      if (!sb) return { ok: false };
      const { data: { session } = {} } = await sb.auth.getSession();
      if (session?.user?.id !== owner) return { ok: false };
      const pending = await pendingStudyEvents(owner);
      const batches = Map.groupBy ? Map.groupBy(pending, event => event.sessionId) : pending.reduce((map, event) => {
        if (!map.has(event.sessionId)) map.set(event.sessionId, []);
        map.get(event.sessionId).push(event);
        return map;
      }, new Map());
      for (const [sessionId, events] of batches) {
        const { data: latest } = await sb.auth.getSession();
        if (latest.session?.user?.id !== owner) return { ok: false };
        const receipt = await ownedRpc(owner, 'append_study_events', {
          p_session_id: sessionId, p_events: Object.fromEntries(events.map(event => [event.id, event])),
        });
        if (!receipt?.ok) throw new Error('sync-not-acknowledged');
        if (!(await markStudyEventsSynced(owner, events.map(event => event.id))).ok) throw new Error('local-ack-failed');
      }
      // App runs this with pull: true on every launch while signed in, so the
      // pull asks only for what is new since this device's mark.
      if (pull) await pullBatches(sb, owner, pull === 'full');
      return { ok: true, pending: (await pendingStudyEvents(owner, 1)).length > 0 };
    } catch { return { ok: false }; }
    finally { running.delete(owner); }
  })();
  running.set(owner, task);
  return task;
}
