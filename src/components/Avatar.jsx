// Avatar — the one picture component for a person: the header chip, the hub,
// board rows, groups, presence, races and comments. A character's emoji draws
// its portrait (96 px files, sharp up to 48 px at 2x); any other emoji is
// drawn as itself; nothing at all draws the paw. On first load with the
// header chip, so it stays this small.
import { characterFor, portraitFor, DEFAULT_AVATAR } from '../lib/avatar.js';

export default function Avatar({ emoji, size = 32, label = '' }) {
  const id = characterFor(emoji);
  return (
    <span className={id ? 'vmx-avatar is-portrait' : 'vmx-avatar'} style={{ width: size, height: size, fontSize: Math.round(size * 0.6) }}
      role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
      {id
        ? <img src={portraitFor(id)} alt="" width={size} height={size} decoding="async" loading="lazy" draggable="false" />
        : (typeof emoji === 'string' && emoji.trim()) || DEFAULT_AVATAR}
    </span>
  );
}
