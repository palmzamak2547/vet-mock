import { useEffect, useState } from 'react';
import { BUDDY_CHANGED_EVENT, SELECTED_BUDDY_KEY } from '../lib/buddy-stats.js';
import { MOCHI_BUDDY, MOCHI_ID, buddyById, pickBuddy, pickedBuddyId } from '../lib/buddy.js';

/**
 * The student's buddy, live: a pick made on another screen, or in another
 * tab, shows here without a reload.
 *
 *   const { buddy, picked, pick } = useBuddy();
 *
 * `picked` is the explicit pick (null when the student never chose); `buddy`
 * falls back to `fallbackId` (Mochi unless the screen says otherwise).
 */
export function useBuddy(fallbackId = MOCHI_ID) {
  const [picked, setPicked] = useState(pickedBuddyId);
  useEffect(() => {
    const sync = () => setPicked(pickedBuddyId());
    const onStorage = (event) => { if (!event?.key || event.key === SELECTED_BUDDY_KEY) sync(); };
    window.addEventListener(BUDDY_CHANGED_EVENT, sync);
    window.addEventListener('storage', onStorage);
    // A pick between the first render and this subscription is not missed.
    sync();
    return () => {
      window.removeEventListener(BUDDY_CHANGED_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  const id = picked || (buddyById(fallbackId) ? fallbackId : MOCHI_ID);
  return { id, buddy: buddyById(id) || MOCHI_BUDDY, picked, pick: pickBuddy };
}
