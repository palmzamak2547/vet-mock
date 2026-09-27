// The seeded generator for every list the Studio draws: PCG32 (O'Neill 2014, pcg32 with the reference pcg-c-
// basic seeding), unbiased bounded integers by rejection, and Fisher-Yates shuffles [M2-DESIGN.md 7]. The
// seed is recorded with every list; nothing claims that another program (R's sample() included) would draw
// the same list.
// OWNER: ui-tools role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {number} seed        integer 0..2^32 - 1 (the student's number, or one drawn from crypto.getRandomValues and shown)
 * @param {number} [stream]    integer 0..2^32 - 1, default 54 (the reference demo's sequence)
 * @returns {{ nextUint32: () => number, bounded: (n: number) => number, shuffle: <T>(arr: T[]) => T[] }}
 */
export function createRng(seed, stream) {
  throw new Error('not implemented: plan/random.createRng');
}
