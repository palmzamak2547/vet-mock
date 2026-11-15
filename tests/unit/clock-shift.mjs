// Preloaded by scripts/unit-clock-windows.mjs (through NODE_OPTIONS, so every node process a test
// starts gets it too): moves the wall clock to VMX_CLOCK_AT while it keeps running. `Date.now()`,
// `new Date()` and `Date()` read the moved clock; a date built from a value is untouched, and timers
// and performance.now() are not moved.
//
// Why: on 15 Nov 2026 tests/unit/storage-honesty.test.mjs built "today" from the runner's local date
// while the product counts study days in Bangkok, and every Build between 17:00 and 24:00 UTC failed
// (pull request #283). A test that reads the real clock passes or fails by the hour it runs; running
// the suite with the clock inside each risky window finds it on any day.
import { createRequire, syncBuiltinESMExports } from 'node:module';

const at = process.env.VMX_CLOCK_AT;
if (at) {
  const Real = globalThis.Date;
  const target = Real.parse(at);
  if (Number.isNaN(target)) throw new Error(`VMX_CLOCK_AT is not a date: ${at}`);
  const delta = target - Real.now();
  const realNow = Real.now.bind(Real);
  // A function, not a Proxy: a test that sets Date.now to its own clock, or replaces Date, still wins,
  // and a date built with no argument reads whatever Date.now is at that moment.
  function Shifted(...args) {
    if (!new.target) return new Real(Shifted.now()).toString();
    return args.length ? new Real(...args) : new Real(Shifted.now());
  }
  Object.setPrototypeOf(Shifted, Real);
  Shifted.prototype = Real.prototype;
  Shifted.now = () => realNow() + delta;
  globalThis.Date = Shifted;

  // A context made with node:vm has a Date of its own; move it by the same amount, or a test that hands
  // a timestamp to code running in a sandbox would compare two clocks.
  const vm = createRequire(import.meta.url)('node:vm');
  const createContext = vm.createContext;
  vm.createContext = function (...args) {
    const ctx = createContext.apply(this, args);
    vm.runInContext(`(() => { const R = Date, d = ${delta}; const now = R.now.bind(R); function S(...a) { if (!new.target) return new R(S.now()).toString(); return a.length ? new R(...a) : new R(S.now()); } Object.setPrototypeOf(S, R); S.prototype = R.prototype; S.now = () => now() + d; globalThis.Date = S; })();`, ctx);
    return ctx;
  };
  syncBuiltinESMExports();
}
