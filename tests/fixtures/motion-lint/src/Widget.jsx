// Fixture for tests/unit/lint-motion.test.mjs.
export function Widget({ p }) {
  // a comment that says transition: 'width 1s' is not code
  return (
    <div>
      {/* layout-transition 1, easing-literal 1 */}
      <span style={{ width: `${p}%`, transition: 'width 0.3s ease' }} />
      {/* easing-literal 1 */}
      <span style={{ transition: 'opacity 120ms' }} />
      {/* nothing */}
      <span style={{ transition: 'transform var(--vm-dur-tap) var(--vm-ease-tap)' }} />
      {/* infinite-loop 1, no-reduced-rule 1, easing-literal 1 */}
      <i style={{ animation: 'shine 1s ease-in-out infinite' }} />
    </div>
  );
}
