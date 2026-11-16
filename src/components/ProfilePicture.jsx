// ProfilePicture — a student's picture: their own upload where they have one
// and the viewer is a signed-in member, else the ready-made picture they chose.
// usePictures asks once for a whole list (a group's members) and redraws when a
// picture changes anywhere in the app.
import { useEffect, useState } from 'react';
import { picturesFor, onPicturesChanged } from '../lib/profile-picture.js';
import { shownPicture } from '../lib/public-display.js';

export function usePictures(ids, enabled = true) {
  const key = enabled ? [...new Set(ids.filter(Boolean))].sort().join(',') : '';
  const [pictures, setPictures] = useState({});
  const [round, setRound] = useState(0);
  useEffect(() => onPicturesChanged(() => setRound((n) => n + 1)), []);
  useEffect(() => {
    if (!key) { setPictures({}); return undefined; }
    let alive = true;
    picturesFor(key.split(',')).then((found) => { if (alive) setPictures(found); }, () => {});
    return () => { alive = false; };
  }, [key, round]);
  return pictures;
}

/**
 * @param {{ picture?: { url: string | null, state: string } | null, emoji?: string | null,
 *           size?: number, className?: string, ownerView?: boolean }} props
 * ownerView: the owner sees their own hidden picture (with the notice beside it);
 * everyone else sees only a shown one.
 */
export default function ProfilePicture({ picture, emoji, size = 40, className = '', ownerView = false }) {
  const [broken, setBroken] = useState(false);
  const url = picture?.url && (picture.state === 'shown' || ownerView) ? picture.url : null;
  useEffect(() => setBroken(false), [url]);
  if (url && !broken) {
    return (
      <img
        className={`vmx-profile-photo ${className}`.trim()}
        src={url}
        alt=""
        width={size}
        height={size}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
        data-testid="profile-photo"
      />
    );
  }
  return <span className={className} aria-hidden="true" style={className ? undefined : { fontSize: size, lineHeight: 1 }}>{shownPicture(emoji)}</span>;
}
