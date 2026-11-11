// Avatar — the one picture component for a person: the header chip, the hub,
// board rows, groups, presence and comments. A character's emoji draws its
// portrait; any other emoji is drawn as itself; nothing at all draws the paw.
// Sized by the `size` prop in px; the portrait files are 96 px squares, so
// they stay sharp up to 48 px at 2x.
import { characterFor, portraitFor, DEFAULT_AVATAR } from '../lib/avatar.js';

export default function Avatar({ emoji, size = 32, label = '', className = '' }) {
  const id = characterFor(emoji);
  const style = { width: size, height: size, fontSize: Math.round(size * 0.6) };
  const cls = `vmx-avatar${id ? ' is-portrait' : ''}${className ? ` ${className}` : ''}`;
  if (id) {
    return (
      <span className={cls} style={style} role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
        <img src={portraitFor(id)} alt="" width={size} height={size} decoding="async" loading="lazy" draggable="false" />
      </span>
    );
  }
  return (
    <span className={cls} style={style} role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
      {typeof emoji === 'string' && emoji.trim() ? emoji : DEFAULT_AVATAR}
    </span>
  );
}
