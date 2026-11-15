// Preloaded by scripts/unit-clock-windows.mjs (through NODE_OPTIONS, so every node process a test
// starts gets it too): moves the wall clock to VMX_CLOCK_AT while it keeps running. `Date.now()`,
// `new Date()` and `Date()` read the moved clock, and so do file times read or set through node:fs; a
// date built from a value is untouched, and timers and performance.now() are not moved.
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
  // a timestamp to code running in a sandbox would compare two clocks. A sandbox handed its own Date
  // (a test's fixed clock, `{ Date: { now: () => t } }`) keeps it, as a test that sets its own clock wins.
  const vm = createRequire(import.meta.url)('node:vm');
  const createContext = vm.createContext;
  vm.createContext = function (...args) {
    const ctx = createContext.apply(this, args);
    const given = args[0];
    if (given && typeof given === 'object' && Object.prototype.hasOwnProperty.call(given, 'Date')) return ctx;
    vm.runInContext(`(() => { const R = Date, d = ${delta}; const now = R.now.bind(R); function S(...a) { if (!new.target) return new R(S.now()).toString(); return a.length ? new R(...a) : new R(S.now()); } Object.setPrototypeOf(S, R); S.prototype = R.prototype; S.now = () => now() + d; globalThis.Date = S; })();`, ctx);
    return ctx;
  };

  // A file's times come from the same wall clock: a file written now must read as written now, or code
  // that ages a file against Date.now() (scripts/new-release.mjs takes over a lock a minute old) sees
  // every fresh file as hours old or not yet written. Stats read through fs come out moved by the same
  // amount, and times handed to utimes go back by it, so a time set and then read stays the same.
  const fs = createRequire(import.meta.url)('node:fs');
  const FIELDS = ['atime', 'mtime', 'ctime', 'birthtime'];
  const shiftStats = (st) => {
    if (!st || typeof st !== 'object' || st.mtimeMs === undefined) return st;
    const big = typeof st.mtimeMs === 'bigint';
    for (const f of FIELDS) {
      if (big) {
        st[`${f}Ms`] += BigInt(delta);
        if (typeof st[`${f}Ns`] === 'bigint') st[`${f}Ns`] += BigInt(delta) * 1000000n;
        Object.defineProperty(st, f, { value: new Real(Number(st[`${f}Ms`])), writable: true, enumerable: true, configurable: true });
      } else {
        st[`${f}Ms`] += delta;
        Object.defineProperty(st, f, { value: new Real(st[`${f}Ms`]), writable: true, enumerable: true, configurable: true });
      }
    }
    return st;
  };
  const back = (t) => {
    const ms = t instanceof Real ? t.getTime() : typeof t === 'string' && Number.isNaN(Number(t)) ? Real.parse(t) : Number(t) * 1000;
    return (ms - delta) / 1000;
  };
  for (const name of ['statSync', 'lstatSync', 'fstatSync']) {
    const real = fs[name];
    fs[name] = function (...args) { return shiftStats(real.apply(this, args)); };
  }
  for (const name of ['stat', 'lstat', 'fstat']) {
    const real = fs[name];
    fs[name] = function (...args) {
      const cb = args.pop();
      if (typeof cb !== 'function') return real.apply(this, [...args, cb]);
      return real.apply(this, [...args, (err, st) => cb(err, err ? st : shiftStats(st))]);
    };
  }
  for (const name of ['stat', 'lstat']) {
    const real = fs.promises[name];
    fs.promises[name] = async function (...args) { return shiftStats(await real.apply(this, args)); };
  }
  for (const name of ['utimesSync', 'lutimesSync', 'futimesSync', 'utimes', 'lutimes', 'futimes']) {
    const real = fs[name];
    fs[name] = function (target, atime, mtime, ...rest) { return real.call(this, target, back(atime), back(mtime), ...rest); };
  }
  for (const name of ['utimes', 'lutimes']) {
    const real = fs.promises[name];
    fs.promises[name] = function (target, atime, mtime) { return real.call(this, target, back(atime), back(mtime)); };
  }
  syncBuiltinESMExports();
}
