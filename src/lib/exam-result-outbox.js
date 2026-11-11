// Scheduling is owned by the React adapter. This coordinator only binds a
// batch to its owner and acknowledges records after the server confirms them.
//
// A result the server refuses for good (400 malformed, 409 result_conflict,
// 413 too large) used to stop the loop on every flush, so every result queued
// behind it stayed on the device and never reached the account. Such a record
// is now set aside for the rest of this session: it stays in the device queue
// (nothing is dropped, and the next session tries it once more), and the
// results behind it are sent. A transient failure still stops the batch so
// order is kept and the whole queue is retried later.
const PERMANENT_REFUSAL = new Set([400, 409, 413]);

export function createExamResultOutbox({ snapshot, send, acknowledge, notify = () => {} }) {
  let running = null;
  const cooldown = new Map();
  const heldBack = new Map(); // owner -> Map of record id -> the refusal's own message, this session
  function flush() {
    const current = snapshot();
    if (!current.userId || !current.pending.length) return Promise.resolve();
    if ((cooldown.get(current.userId) || 0) > Date.now()) return Promise.resolve();
    if (running?.owner === current.userId) return running.promise;
    const batch = { owner: current.userId, promise: null };
    running = batch;
    if (!heldBack.has(batch.owner)) heldBack.set(batch.owner, new Map());
    const held = heldBack.get(batch.owner);
    batch.promise = (async () => {
      notify(batch.owner, { sending: true, error: null });
      try {
        for (const record of current.pending.slice(0, 100)) {
          if (snapshot().userId !== batch.owner) return;
          // Another account's record (an old device-wide key, an origin move) is left where it is and
          // skipped: stopping at it would hold every later result of this account on the device.
          if (record.user_id !== batch.owner) continue;
          if (held.has(record.id)) continue;
          try {
            await send(record);
          } catch (error) {
            if (!PERMANENT_REFUSAL.has(Number(error?.status))) throw error;
            held.set(record.id, error?.conflict ? error.message : null);
            continue;
          }
          if (snapshot().userId !== batch.owner) return;
          const result = acknowledge(batch.owner, record.id);
          if (result?.accepted === false) throw new Error('บันทึกสถานะการส่งในเครื่องไม่สำเร็จ กรุณาลองอีกครั้ง');
        }
        const heldNow = snapshot().pending.filter((record) => held.has(record.id));
        const stillHeld = heldNow.length;
        // A conflict has its own words (sent from another tab with other answers: back it up); one
        // refused set says them, more than one the general line.
        const specific = stillHeld === 1 ? held.get(heldNow[0].id) : null;
        notify(batch.owner, {
          sending: false,
          error: stillHeld
            ? specific || `ผลสอบ ${stillHeld} ชุดส่งเข้าบัญชีไม่ได้ เพราะระบบไม่รับชุดนั้น ผลชุดอื่นส่งต่อตามปกติ และคำตอบของชุดนั้นยังอยู่ในประวัติบนเครื่องนี้`
            : null,
        });
      } catch (error) {
        if (error?.retryAfter > 0) cooldown.set(batch.owner, Date.now() + Math.min(3600, error.retryAfter) * 1000);
        notify(batch.owner, { sending: false, error: error?.message || 'ผลสอบยังรอส่ง ระบบจะลองใหม่เมื่อเชื่อมต่อได้' });
      } finally {
        if (running === batch) running = null;
      }
    })();
    return batch.promise;
  }
  return { flush };
}
