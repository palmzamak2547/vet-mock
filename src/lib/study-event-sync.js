import { ownedRpc } from './owned-rpc.js';
import { appendStudyEvents, pendingStudyEvents, markStudyEventsSynced } from './study-event-log.js';

const running = new Map();
export function syncStudyEvents(owner, { pull = false } = {}) {
  if (!owner) return Promise.resolve({ ok: true });
  if (running.has(owner)) return pull
    ? running.get(owner).then(() => syncStudyEvents(owner, { pull: true }))
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
      // Page through the owner's batches. This path is run on sign-in and
      // explicit backup refresh, not per keypress or per rendered card.
      let cursor = null;
      while (pull) {
        let query = sb.from('study_event_batches').select('session_id,events')
          .eq('user_id', owner).order('session_id').limit(100);
        if (cursor) query = query.gt('session_id', cursor);
        const { data, error } = await query.abortSignal(AbortSignal.timeout(12_000));
        if (error) throw error;
        for (const batch of data || []) {
          const restored = await appendStudyEvents(owner, Object.values(batch.events || {}), { synced: true, keepOnFailure: false });
          if (!restored.ok) throw new Error('local-restore-failed');
        }
        if (!data || data.length < 100) break;
        cursor = data[data.length - 1].session_id;
      }
      return { ok: true, pending: (await pendingStudyEvents(owner, 1)).length > 0 };
    } catch { return { ok: false }; }
    finally { running.delete(owner); }
  })();
  running.set(owner, task);
  return task;
}
