import { useEffect, useRef, useState } from 'react';
import { saveExamResult } from '../lib/api.js';
import { createExamResultOutbox } from '../lib/exam-result-outbox.js';

export function useExamResultOutbox(userId, pending, setPending) {
  const latest = useRef(null);
  latest.current = { userId, pending, setPending };
  const [status, setStatus] = useState({ owner: null, sending: false, error: null });
  const worker = useRef(null);
  if (!worker.current) worker.current = createExamResultOutbox({
    snapshot: () => latest.current,
    send: saveExamResult,
    acknowledge: (owner, id) => latest.current.userId === owner
      ? latest.current.setPending(items => items.filter(item => item.id !== id))
      : { accepted: false },
    notify: (owner, next) => { if (latest.current.userId === owner) setStatus({ owner, ...next }); },
  });
  useEffect(() => {
    if (!userId) return undefined;
    const retry = () => {
      if (navigator.onLine !== false && document.visibilityState !== 'hidden') worker.current.flush();
    };
    retry();
    const timer = setInterval(retry, 30_000);
    window.addEventListener('online', retry);
    document.addEventListener('visibilitychange', retry);
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', retry);
      document.removeEventListener('visibilitychange', retry);
    };
  }, [userId]);
  useEffect(() => {
    if (userId && pending.length && navigator.onLine !== false) worker.current.flush();
  }, [userId, pending.length]);
  return {
    ...(status.owner === userId ? status : { sending: false, error: null }),
    pendingCount: pending.length,
    retry: () => worker.current.flush(),
  };
}
