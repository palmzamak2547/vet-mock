// A student's mark: their own photo, or their chosen animal on a disc of their chosen tone.
// A photo appears only once someone is signed in or a community page is open, when the backend
// is loaded anyway; the animal holds the place until it has drawn.

import { useEffect, useState } from 'react';
import { getBackend } from '../account.js';
import '../online.css';

export function Avatar({ profile, size = 36, ring = false }) {
  const tone = profile?.tone || 'ink';
  const photo = profile?.photo || null;
  const [src, setSrc] = useState('');
  const [shown, setShown] = useState(false);
  useEffect(() => {
    setShown(false);
    if (!photo) { setSrc(''); return undefined; }
    let live = true;
    getBackend().then((b) => { if (live) setSrc(b.media.url(photo, { width: Math.min(512, Math.round(size * 2.5)) })); });
    return () => { live = false; };
  }, [photo, size]);
  return (
    <span className={`av av-${tone}${ring ? ' av-ring' : ''}${shown ? ' has-photo' : ''}`} style={{ '--av': `${size}px` }} aria-hidden="true">
      <span className="av-glyph">{profile?.avatar || '🐾'}</span>
      {src && <img className="av-photo" src={src} alt="" decoding="async" onLoad={() => setShown(true)} onError={() => setSrc('')} />}
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
