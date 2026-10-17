// The VCA mark: VetMock's paw on its rounded tile, with one toe filled in verdigris the way an
// answer is filled in on an answer sheet. Same paw geometry as public/vetmock-logo.svg, scaled
// from 512 to 64 units, so the family reads at a glance; Research marks its tile with a field
// of dots and one gold, VCA with the paw and one chosen answer.

export function Mark({ size = 28, title }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 64 64" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      <rect width="64" height="64" rx="14" fill="currentColor" />
      <g fill="var(--mark-paw)">
        <ellipse cx="32" cy="42.25" rx="11.5" ry="9.25" />
        <ellipse cx="18.5" cy="29" rx="4.5" ry="6" transform="rotate(-18 18.5 29)" />
        <ellipse cx="26.5" cy="19.75" rx="4.25" ry="5.75" transform="rotate(-6 26.5 19.75)" />
        <ellipse cx="45.5" cy="29" rx="4.5" ry="6" transform="rotate(18 45.5 29)" />
      </g>
      <ellipse cx="37.5" cy="19.75" rx="4.25" ry="5.75" transform="rotate(6 37.5 19.75)" fill="var(--verd-mark)" />
    </svg>
  );
}

/** "VetMock | VCA", the family lockup Research also uses. */
export function Lockup({ size = 28 }) {
  return (
    <span className="lockup">
      <Mark size={size} />
      <span className="lockup-name">VetMock</span>
      <span className="lockup-rule" aria-hidden="true" />
      <span className="lockup-sub">VCA</span>
    </span>
  );
}
