// The seeded generator for every list VetMock Research draws: PCG32 (O'Neill 2014, pcg32 with the
// reference pcg-c-basic seeding), unbiased bounded integers by rejection, and Fisher-Yates shuffles
// [M2-DESIGN.md 7]. The seed is recorded with every list; nothing claims that another program (R's
// sample() included) would draw the same list. Pure; BigInt for the 64-bit state.
// OWNER: ui-tools role.
//
// Reference (pcg-c-basic, pcg32-demo): seed 42, sequence 54 gives 0xa15c02b7 0x7b47f409 0xba1d3330
// 0x83d2f293 0xbfa4784b 0xcbed606e. tests/unit/plan-random.test.mjs pins those six numbers, and the
// Python generator in tests/fixtures/plan/golden.py (its own PCG32) pins the lists built on top.

const MASK64 = (1n << 64n) - 1n;
const MULT = 6364136223846793005n;

/** The algorithm as every list names it (CSV header rows, envelope). */
export const GENERATOR = Object.freeze({ name: 'PCG32', reference: 'O\'Neill 2014, pcg-c-basic (pcg32_srandom_r, pcg32_boundedrand_r)', defaultStream: 54 });

/** Largest seed and stream (unsigned 32-bit). */
export const MAX_SEED = 4294967295;

/** @param {unknown} x */
export function isSeed(x) {
  return typeof x === 'number' && Number.isInteger(x) && x >= 0 && x <= MAX_SEED;
}

/**
 * A seed the student did not type: from the browser's cryptographic generator, shown before the list
 * is made. Falls back to the clock only where no crypto exists (Node tests without webcrypto).
 * @returns {number}
 */
export function drawSeed() {
  const c = globalThis.crypto;
  if (c && typeof c.getRandomValues === 'function') {
    const a = new Uint32Array(1);
    c.getRandomValues(a);
    return a[0];
  }
  return (Date.now() >>> 0);
}

/**
 * @param {number} seed        integer 0..2^32 - 1 (the student's number, or one drawn from crypto.getRandomValues and shown)
 * @param {number} [stream]    integer 0..2^32 - 1, default 54 (the reference demo's sequence)
 * @returns {{ nextUint32: () => number, bounded: (n: number) => number, shuffle: <T>(arr: T[]) => T[], draws: () => number }}
 */
export function createRng(seed, stream = GENERATOR.defaultStream) {
  if (!isSeed(seed)) throw Object.assign(new Error('seed must be an integer from 0 to 4294967295'), { key: 'tools.error.seed' });
  if (!isSeed(stream)) throw Object.assign(new Error('stream must be an integer from 0 to 4294967295'), { key: 'tools.error.stream' });
  let state = 0n;
  const inc = ((BigInt(stream) << 1n) | 1n) & MASK64;
  let count = 0;

  const step = () => {
    const old = state;
    state = (old * MULT + inc) & MASK64;
    const xorshifted = Number((((old >> 18n) ^ old) >> 27n) & 0xffffffffn);
    const rot = Number(old >> 59n);
    return ((xorshifted >>> rot) | (xorshifted << ((32 - rot) & 31))) >>> 0;
  };

  // pcg32_srandom_r: state = 0, inc = 2 seq + 1, step, state += seed, step.
  step();
  state = (state + BigInt(seed)) & MASK64;
  step();

  const nextUint32 = () => {
    count += 1;
    return step();
  };

  /** Uniform integer in [0, n), as pcg32_boundedrand_r: reject below (2^32 - n) mod n, no modulo bias. */
  const bounded = (n) => {
    if (!Number.isInteger(n) || n < 1 || n > MAX_SEED + 1) throw new Error(`bounded: bad range ${n}`);
    if (n === 1) {
      // The C code draws once and returns r % 1 = 0; kept so the stream position matches it.
      nextUint32();
      return 0;
    }
    const threshold = ((2 ** 32) - n) % n;
    for (;;) {
      const r = nextUint32();
      if (r >= threshold) return r % n;
    }
  };

  /** Fisher-Yates from the last index down; returns a shuffled copy, the argument is not changed. */
  const shuffle = (arr) => {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = bounded(i + 1);
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  };

  return { nextUint32, bounded, shuffle, draws: () => count };
}
