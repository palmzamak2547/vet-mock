// Scheduling is owned by the React adapter. This coordinator only binds a
// batch to its owner and acknowledges records after the server confirms them.
export function createExamResultOutbox({ snapshot, send, acknowledge, notify = () => {} }) {
  let running = null;
  const cooldown = new Map();
  function flush() {
    const current = snapshot();
    if (!current.userId || !current.pending.length) return Promise.resolve();
    if ((cooldown.get(current.userId) || 0) > Date.now()) return Promise.resolve();
    if (running?.owner === current.userId) return running.promise;
    const batch = { owner: current.userId, promise: null };
    running = batch;
    batch.promise = (async () => {
      notify(batch.owner, { sending: true, error: null });
      try {
        for (const record of current.pending.slice(0, 100)) {
          if (snapshot().userId !== batch.owner) return;
          if (record.user_id !== batch.owner) throw new Error('ผลสอบนี้ไม่ใช่ของบัญชีปัจจุบัน');
          await send(record);
          if (snapshot().userId !== batch.owner) return;
          const result = acknowledge(batch.owner, record.id);
          if (result?.accepted === false) throw new Error('บันทึกสถานะการส่งในเครื่องไม่สำเร็จ กรุณาลองอีกครั้ง');
        }
        notify(batch.owner, { sending: false, error: null });
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
