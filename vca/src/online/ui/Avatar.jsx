// A student's mark: their chosen animal on a disc of their chosen tone.

import '../online.css';

export function Avatar({ profile, size = 36, ring = false }) {
  const tone = profile?.tone || 'ink';
  return (
    <span className={`av av-${tone}${ring ? ' av-ring' : ''}`} style={{ '--av': `${size}px` }} aria-hidden="true">
      <span className="av-glyph">{profile?.avatar || '🐾'}</span>
    </span>
  );
}

/** Name, handle and school on one line, for a post or a comment. */
export function Byline({ profile, children }) {
  if (!profile) return null;
  return (
    <span className="byline">
      <span className="byline-name">{profile.name}</span>
      {profile.handle && <span className="byline-handle">@{profile.handle}</span>}
      {children}
    </span>
  );
}
