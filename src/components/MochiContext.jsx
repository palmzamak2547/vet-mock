import { createContext, useContext, useMemo } from 'react';
import { mochiPresenceFor } from '../lib/mochi-presence.js';

const MochiContext = createContext({ visible: true, pose: 'idle' });
// The page alone decides; App still passes the set's mode, which nothing reads
// since the verdict stamp went (5.189.2).
export function MochiProvider({ view, children }) {
  const value = useMemo(() => mochiPresenceFor(view), [view]);
  return <MochiContext.Provider value={value}>{children}</MochiContext.Provider>;
}
export const useMochiContext = () => useContext(MochiContext);
