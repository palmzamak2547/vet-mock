// useMyCard: the student's own card style, on this device and for classmates.
// The device copy is written first, so nothing is lost when the screen is
// left or the network is gone; a signed-in student's style is then saved for
// classmates (lib/card-style-remote.js) and the status says how that went.
// A device that has no copy yet takes the account's saved one, if any.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CARD_CHANGE_EVENT, cardKey, encodeCard, readCard, readLocalCard, writeLocalCard } from '../lib/card-style.js';
import { fetchCardStyles, saveCardStyle } from '../lib/card-style-remote.js';

function subscribe(cb) {
  window.addEventListener(CARD_CHANGE_EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(CARD_CHANGE_EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

/** status: 'idle' | 'loading' | 'saving' | 'saved' | 'device' | 'offline' | 'failed' | 'guest' */
export function useMyCard(user) {
  const userId = user?.id || null;
  const token = useSyncExternalStore(subscribe, () => readLocalCard(userId), () => null);
  const [status, setStatus] = useState(userId && !readLocalCard(userId) ? 'loading' : 'idle');
  const pending = useRef(null);

  // A new device: the account's saved style, when the database has one.
  useEffect(() => {
    if (!userId || readLocalCard(userId)) return undefined;
    let live = true;
    setStatus('loading');
    fetchCardStyles([userId]).then((map) => {
      if (!live) return;
      const saved = map.get(userId);
      if (saved && !readLocalCard(userId)) writeLocalCard(userId, saved);
      setStatus('idle');
    });
    return () => { live = false; };
  }, [userId]);

  const push = useCallback(async (next) => {
    if (!userId) { setStatus('guest'); return; }
    pending.current = next;
    setStatus('saving');
    const result = await saveCardStyle(next);
    if (pending.current !== next) return; // a newer change is on its way
    setStatus(result);
  }, [userId]);

  // Offline: saved on this device now, sent when the connection is back.
  useEffect(() => {
    if (status !== 'offline') return undefined;
    const back = () => { if (pending.current) push(pending.current); };
    window.addEventListener('online', back);
    return () => window.removeEventListener('online', back);
  }, [status, push]);

  const save = useCallback((card) => {
    const next = encodeCard(card);
    writeLocalCard(userId, next);
    push(next);
  }, [userId, push]);

  const retry = useCallback(() => { push(readLocalCard(userId) || encodeCard(readCard(null))); }, [userId, push]);

  return { card: readCard(token), token, status, save, retry, key: cardKey(userId) };
}

/** The student's own uploaded picture ({ url, state }), or null. The picture library loads on demand, as it does
 *  on the profile page, and the picture is read again when one changes anywhere in the app. */
export function useOwnPicture(userId) {
  const [mine, setMine] = useState(null);
  useEffect(() => {
    if (!userId) { setMine(null); return undefined; }
    let live = true;
    let stop = null;
    import('../lib/profile-picture.js').then((lib) => {
      if (!live) return;
      const readMine = () => lib.picturesFor([userId]).then((found) => { if (live) setMine(found?.[userId] || null); }, () => {});
      stop = lib.onPicturesChanged(readMine);
      readMine();
    }, () => {});
    return () => { live = false; if (typeof stop === 'function') stop(); };
  }, [userId]);
  return mine;
}
