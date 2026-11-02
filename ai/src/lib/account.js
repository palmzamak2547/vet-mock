// The page's one Chula wall (lib/wall.js) on the real account (lib/auth.js), and the
// API's way to it: every request to /api/ai-chat and /api/ai-transcribe carries the
// session's token, and a refusal there moves the wall (lib/api.js).
import { useSyncExternalStore } from 'react';
import { createWall } from './wall.js';
import { authPort } from './auth.js';
import { setApiAuth } from './api.js';

export const wall = createWall({ auth: authPort });
setApiAuth(wall.apiAuth);

/** The wall's current state: { gate, user, email, problem, busy, ... }. */
export const useWall = () => useSyncExternalStore(wall.subscribe, wall.get, wall.get);
