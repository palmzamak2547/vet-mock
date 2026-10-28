// ============================================================
// useSelectedPhase — the paper a student studies for, kept current
// ============================================================
// The pick is saved (vmx-selected-phase) so a return visit opens where the
// student left off. Saved on its own it never moved: a กลางภาค picked in
// September still scoped every set in late October, with the final four
// weeks away. phaseState (lib/current-phase.js) settles it on load and every
// minute while the app is open: a pick whose paper is over moves to the
// paper current now, a pick for a paper still ahead stays, and where the
// timetable has no paper to offer nothing is narrowed. vmx-phase-anchor is
// when the pick was made and against which timetable, which is what tells a
// stale pick from a fresh one.
//
// Returns the phase every view narrows by (null when nothing is narrowed),
// the setter for a pick, and the whole state for the lines that explain it.
// ============================================================
import { useCallback, useEffect, useState } from 'react';
import { storage } from './useStorage.js';
import { phaseAnchor, phaseState } from '../lib/current-phase.js';

export const PHASE_KEY = 'vmx-selected-phase';
export const PHASE_ANCHOR_KEY = 'vmx-phase-anchor';
// A paper can end while the app is open (the zoonoses midterm ends 11:30).
const TICK_MS = 60_000;

const settle = (stored, year) => phaseState(stored, year);
const same = (a, b) => a.saved === b.saved && a.anchor === b.anchor && a.phase === b.phase
  && a.filtered === b.filtered && a.reason === b.reason && a.current === b.current;

export function useSelectedPhase(year) {
  const [state, setState] = useState(() => settle(
    { saved: storage.get(PHASE_KEY, null), anchor: storage.get(PHASE_ANCHOR_KEY, null) },
    year,
  ));
  useEffect(() => {
    const tick = () => setState((s) => {
      const next = settle(s, year);
      // An earlier move stays announced until the next pick.
      const kept = next.advancedFrom ? next : { ...next, advancedFrom: s.advancedFrom };
      return same(kept, s) && kept.advancedFrom === s.advancedFrom ? s : kept;
    });
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [year]);
  useEffect(() => {
    storage.set(PHASE_KEY, state.saved);
    storage.set(PHASE_ANCHOR_KEY, state.anchor);
  }, [state.saved, state.anchor]);
  // Every pick, the student's or a flow's (a resumed set, the next exam's
  // shortcut), is anchored to the moment it was made.
  const setPhase = useCallback((next) => setState((s) => {
    const saved = typeof next === 'function' ? next(s.filtered ? s.phase : null) : next;
    return settle({ saved, anchor: phaseAnchor() }, year);
  }), [year]);
  return [state.filtered ? state.phase : null, setPhase, state];
}
