// Brent root finding with R's uniroot semantics (tol default .Machine$double.eps^0.25) so exact
// intervals (Fisher conditional MLE and its CI, score intervals) stop where R stops
// [M1-DESIGN.md 7.2]. OWNER: stats role.
//
// A line-by-line port of R_zeroin2 (R src/library/stats/src/zeroin.c, Brent's zeroin as R ships it):
// same bracket bookkeeping, same interpolation tests, same stopping rule
// (|c - b| / 2 <= 2 eps |b| + tol / 2), same iteration count. uniroot() evaluates f at both ends
// first and refuses a bracket without a sign change, as R does.

const EPSILON = Number.EPSILON;
const DBL_MAX = Number.MAX_VALUE;

/** R's truncate(): keep function values finite so +-Inf ends still bracket. */
function truncate(v) { return Math.max(Math.min(v, DBL_MAX), -DBL_MAX); }

/**
 * @param {(x: number) => number} f
 * @param {[number, number]} interval  f must change sign across it
 * @param {{ tol?: number, maxIter?: number }} [opts]  tol default 1.220703125e-4 (= 2^-13, R's default)
 * @returns {{ root: number, iter: number, estimPrec: number|null, converged: boolean }}
 */
export function uniroot(f, interval, opts = {}) {
  const tol0 = opts.tol ?? 1.220703125e-4;
  const maxIter = opts.maxIter ?? 1000;
  let [ax, bx] = interval;
  if (!(ax < bx)) throw new Error('uniroot: lower < upper is not fulfilled');
  let fa = truncate(f(ax));
  let fb = truncate(f(bx));
  if (Number.isNaN(fa) || Number.isNaN(fb)) throw new Error('uniroot: f() values at end points not finite');
  if (fa * fb > 0) throw new Error('uniroot: f() values at end points not of opposite sign');

  let a = ax;
  let b = bx;
  let c = a;
  let fc = fa;
  let maxit = maxIter + 1;
  const tol = tol0;

  if (fa === 0) return { root: a, iter: 0, estimPrec: 0, converged: true };
  if (fb === 0) return { root: b, iter: 0, estimPrec: 0, converged: true };

  while (maxit--) {
    const prevStep = b - a;
    if (Math.abs(fc) < Math.abs(fb)) {
      a = b; b = c; c = a;
      fa = fb; fb = fc; fc = fa;
    }
    const tolAct = 2 * EPSILON * Math.abs(b) + tol / 2;
    let newStep = (c - b) / 2;

    if (Math.abs(newStep) <= tolAct || fb === 0) {
      return { root: b, iter: maxIter - maxit, estimPrec: Math.abs(c - b), converged: true };
    }

    if (Math.abs(prevStep) >= tolAct && Math.abs(fa) > Math.abs(fb)) {
      let p;
      let q;
      const cb = c - b;
      if (a === c) {
        const t1 = fb / fa;
        p = cb * t1;
        q = 1.0 - t1;
      } else {
        q = fa / fc;
        const t1 = fb / fc;
        const t2 = fb / fa;
        p = t2 * (cb * q * (q - t1) - (b - a) * (t1 - 1.0));
        q = (q - 1.0) * (t1 - 1.0) * (t2 - 1.0);
      }
      if (p > 0) q = -q;
      else p = -p;

      if (p < 0.75 * cb * q - Math.abs(tolAct * q) / 2 && p < Math.abs((prevStep * q) / 2)) newStep = p / q;
    }

    if (Math.abs(newStep) < tolAct) newStep = newStep > 0 ? tolAct : -tolAct;
    a = b; fa = fb;
    b += newStep;
    fb = truncate(f(b));
    if ((fb > 0 && fc > 0) || (fb < 0 && fc < 0)) { c = a; fc = fa; }
  }
  return { root: b, iter: -1, estimPrec: null, converged: false };
}
