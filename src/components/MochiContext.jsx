import { createContext, useContext, useMemo } from 'react';
import { mochiPresenceFor } from '../lib/mochi-presence.js';

const MochiContext = createContext({ visible: true, pose: 'idle', feedback: false });
export function MochiProvider({ view, mode, children }) {
  const value = useMemo(() => mochiPresenceFor(view, mode), [view, mode]);
  return <MochiContext.Provider value={value}>{children}</MochiContext.Provider>;
}
export const useMochiContext = () => useContext(MochiContext);
