// phase.firstRun — the paper after the year is chosen (src/lib/decide.js)
// Principle: default effect + timely; the timetable's current paper is the
// paper, and the student is asked only when the timetable has none. Which
// paper is current stays current-phase.js's answer (AGENTS.md Rule 10).
import { defineDecision, isObject } from '../decide.js';
import { phaseOrder } from '../current-phase.js';

export const PHASE_FIRST_RUN = defineDecision({
  id: 'phase.firstRun',
  valid: (v) => isObject(v) && (v.phase === null || phaseOrder(v.phase) >= 0),
  auto(s = {}) {
    const phase = !s.scaffold && phaseOrder(s.current) >= 0 ? s.current : null;
    return phase
      // Home prints it beside the paper's own label (ปี 5 เทอม 1 ปลาย ตามตารางสอบ).
      ? { value: { phase, ask: false }, why: 'ตามตารางสอบ' }
      : { value: { phase: null, ask: !s.scaffold }, why: '' };
  },
});
