// sr.setup — today's review session (src/lib/decide.js)
// Principle: default effect; today's plan from Home, else a size one day can
// hold, oldest cards first; yours wins for any row the student set.
// The planner's rows keep the keys they have stored since before the
// registry, so a value other than the default there is the student's own.
import { defineDecision, intIn, parse, safeGet, safeRemove, validRows } from '../decide.js';

const DEFAULT = Object.freeze({ yearScope: 'current', subject: 'all', phaseScope: 'current', size: 25, scheduler: 'sm2' });
const KEYS = { size: 'vmx-sr-session-size', subject: 'vmx-sr-subject-filter', yearScope: 'vmx-sr-year-scope', phaseScope: 'vmx-sr-phase-scope' };
const SCHEDULER_KEY = 'vmx-sr-scheduler';
const plannedSize = (s) => (Number.isInteger(s.planSize) && s.planSize > 0 ? s.planSize : null);

export const SR_SETUP = defineDecision({
  id: 'sr.setup',
  valid: validRows({
    size: (v) => v === 'all' || intIn(v, 1, 1000),
    subject: (v) => typeof v === 'string' && v.length > 0 && v.length < 80,
    yearScope: (v) => v === 'current' || v === 'all',
    phaseScope: (v) => v === 'current' || v === 'all',
    scheduler: (v) => v === 'sm2' || v === 'fsrs',
  }),
  auto(s = {}) {
    const plan = plannedSize(s);
    const why = plan ? 'ตามแผนวันนี้จากหน้าแรก'
      : s.dueReviewed > 0 ? 'ใบที่ค้างนานสุดมาก่อน ทีละ 25 ใบพอดีกับหนึ่งวัน'
        : s.newCount > 0 ? 'เริ่มทีละ 25 ใบ ทำทุกวันได้ผลกว่าทำทีเดียวเยอะ'
          : 'ยังไม่มีใบถึงรอบ';
    return { value: { ...DEFAULT, size: plan ?? DEFAULT.size }, why };
  },
  read(io) {
    const out = {};
    for (const [field, key] of Object.entries(KEYS)) {
      const v = parse(safeGet(io, key));
      if (v !== undefined && v !== DEFAULT[field]) out[field] = v;
    }
    const scheduler = safeGet(io, SCHEDULER_KEY);
    if (scheduler && scheduler !== DEFAULT.scheduler) out.scheduler = scheduler;
    return Object.keys(out).length ? out : undefined;
  },
  clear(io) {
    for (const key of Object.values(KEYS)) safeRemove(io, key);
    safeRemove(io, SCHEDULER_KEY);
  },
  // A plan's size is for that one session and wins over a saved size.
  merge(auto, stored, s = {}) {
    const own = { ...stored };
    if (plannedSize(s)) delete own.size;
    return Object.keys(own).length ? { ...auto, ...own } : null;
  },
});
