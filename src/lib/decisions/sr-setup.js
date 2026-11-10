// sr.setup — today's review session (src/lib/decide.js)
// Principle: default effect; today's plan from Home, else a size one day can
// hold, oldest cards first; yours wins for any row the student set.
// The planner's rows keep the keys they have stored since before the
// registry, so a value other than the default there is the student's own.
// Only a size the planner offers (25, 50, 100, 200, all) is a choice: until
// 5.192.1 Home's plan wrote its own count into the same key, and a device
// still holding one of those has not chosen it. The scheduler is a device
// preference shown on the line, not part of today's session, so a reset
// never switches it.
import { defineDecision, parse, safeGet, safeRemove, validRows } from '../decide.js';

export const SR_SIZES = Object.freeze([25, 50, 100, 200, 'all']);
export const SR_DEFAULT = Object.freeze({ yearScope: 'current', subject: 'all', phaseScope: 'current', size: 25 });
export const SR_KEYS = Object.freeze({ size: 'vmx-sr-session-size', subject: 'vmx-sr-subject-filter', yearScope: 'vmx-sr-year-scope', phaseScope: 'vmx-sr-phase-scope' });
const plannedSize = (s) => (Number.isInteger(s.planSize) && s.planSize > 0 ? s.planSize : null);

export const SR_SETUP = defineDecision({
  id: 'sr.setup',
  valid: validRows({
    size: (v) => SR_SIZES.includes(v),
    subject: (v) => typeof v === 'string' && v.length > 0 && v.length < 80,
    yearScope: (v) => v === 'current' || v === 'all',
    phaseScope: (v) => v === 'current' || v === 'all',
  }),
  auto(s = {}) {
    const plan = plannedSize(s);
    const why = plan ? 'ตามแผนวันนี้จากหน้าแรก'
      : s.dueReviewed > 0 ? 'ใบที่ค้างนานสุดมาก่อน'
        : s.newCount > 0 ? 'ไม่มีใบค้าง วันนี้เป็นใบใหม่ทั้งหมด'
          : '';
    return { value: { ...SR_DEFAULT, size: plan ?? SR_DEFAULT.size }, why };
  },
  read(io) {
    const out = {};
    for (const [field, key] of Object.entries(SR_KEYS)) {
      const v = parse(safeGet(io, key));
      if (v === undefined || v === SR_DEFAULT[field]) continue;
      // A size the planner never offered is not anyone's choice: leave it out.
      if (field === 'size' && !SR_SIZES.includes(v)) continue;
      out[field] = v;
    }
    return Object.keys(out).length ? out : undefined;
  },
  clear(io) {
    for (const key of Object.values(SR_KEYS)) safeRemove(io, key);
  },
  // A plan's size is for that one session and wins over a saved size.
  merge(auto, stored, s = {}) {
    const own = { ...stored };
    if (plannedSize(s)) delete own.size;
    return Object.keys(own).length ? { ...auto, ...own } : null;
  },
});
