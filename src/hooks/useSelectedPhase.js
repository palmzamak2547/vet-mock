// ============================================================
// useSelectedPhase — the paper a student studies for, kept current
// ============================================================
// The pick is saved (vmx-selected-phase) so a return visit opens where the
// student left off. Saved on its own it never moved: a กลางภาค picked in
// September still scoped every set in late October, with the final four
// weeks away. settlePhase (lib/current-phase.js) moves a pick whose paper is
// over to the paper current now, on load and while the app stays open, and
// hands back what it moved from so Home can say so in one line. A pick for a
// paper still ahead stays. vmx-phase-anchor is the paper that was current
// when the pick was made, which is what tells the two apart.
// ============================================================
import { useCallback, useEffect, useState } from 'react';
import { storage } from './useStorage.js';
import { detectCurrentPhase, settlePhase } from '../lib/current-phase.js';

export const PHASE_KEY = 'vmx-selected-phase';
export const PHASE_ANCHOR_KEY = 'vmx-phase-anchor';
// A paper can end while the app is open (the zoonoses midterm ends 11:30).
const TICK_MS = 60_000;

export function useSelectedPhase(year) {
  const [state, setState] = useState(() => settlePhase(
    { phase: storage.get(PHASE_KEY, null), anchor: storage.get(PHASE_ANCHOR_KEY, null) },
    year,
  ));
  useEffect(() => {
    const settle = () => setState((s) => {
      const next = settlePhase(s, year);
      return next.advancedFrom ? next : s;
    });
    settle();
    const id = setInterval(settle, TICK_MS);
    return () => clearInterval(id);
  }, [year]);
  useEffect(() => {
    storage.set(PHASE_KEY, state.phase);
    storage.set(PHASE_ANCHOR_KEY, state.anchor);
  }, [state.phase, state.anchor]);
  // Every pick, the student's or a flow's (a resumed set, the next exam's
  // shortcut), is anchored to the paper current when it was made.
  const setPhase = useCallback((next) => setState((s) => ({
    phase: typeof next === 'function' ? next(s.phase) : next,
    anchor: detectCurrentPhase(new Date(), year),
    advancedFrom: null,
  })), [year]);
  return [state.phase, setPhase, state.advancedFrom];
}
