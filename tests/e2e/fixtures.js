// Every spec imports `test` and `expect` from here, never from '@playwright/test'
// directly (tests/unit/e2e-clock-pin.test.mjs enforces it), so the whole suite
// reads one calendar instead of the real one.
//
// Why: Home, the countdown, wrap-up pages, Panic and the phase-wrapped card all
// read Date.now() against src/data/schedule.js. On 23 Sep exam-scope failed from
// 11:30 because the soonest paper changed; on 26 Sep four specs failed on every
// project because the midterm had ended and Home swapped its welcome card for
// the end-of-phase card. Nothing in the app had changed either time.
//
// The pin is the start of the last fully green CI run (25 Sep 2026, 18:15
// Bangkok). Time still FLOWS from that instant, so timers, countdown ticks and
// elapsed-time logic behave exactly as before; only the calendar is fixed.
// A spec that drives time itself with page.clock opts out with
// test.use({ pinCalendar: false }): Playwright's clock and this shim do not
// stack (the shim would re-offset the clock's instant). The unit pin
// tests/unit/e2e-clock-pin.test.mjs allows the opt-out only beside page.clock.
import { test as base } from '@playwright/test';

export * from '@playwright/test';

export const PINNED_NOW = '2026-09-25T18:15:00+07:00';

function installPinnedCalendar({ pinned }) {
  const RealDate = Date;
  const offset = pinned - RealDate.now();
  function PinnedDate(...args) {
    if (!new.target) return new RealDate(PinnedDate.now()).toString();
    return args.length ? new RealDate(...args) : new RealDate(PinnedDate.now());
  }
  PinnedDate.prototype = RealDate.prototype;
  PinnedDate.now = () => RealDate.now() + offset;
  PinnedDate.parse = RealDate.parse;
  PinnedDate.UTC = RealDate.UTC;
  Object.defineProperty(PinnedDate.prototype, 'constructor', { value: PinnedDate, writable: true, configurable: true });
  globalThis.Date = PinnedDate;
}

export const test = base.extend({
  pinCalendar: [true, { option: true }],
  context: async ({ context, pinCalendar }, use) => {
    if (pinCalendar) await context.addInitScript(installPinnedCalendar, { pinned: Date.parse(PINNED_NOW) });
    await use(context);
  },
});

