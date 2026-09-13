// ============================================================
// EmptyState — the screen you see before you've done anything
// ============================================================
// styles.css has carried `.vmx-empty-state` with `.icon` and `.cta` slots
// since the design system was written, and nothing ever used it. What views
// actually used was the bare `.vmx-empty` — one line of grey italic text.
// So a student opening ความคืบหน้า for the first time got
// "ยังไม่มีข้อมูลสถิติ" centred in an otherwise blank column, with no way
// forward, while three big green buttons below offered features they hadn't
// asked for.
//
// An empty state has one job: say what goes here, and hand over the action
// that fills it.
//
// `icon` takes a node, not an emoji — the .icon slot is 48px and the house
// rule is line SVGs for interface art. Pass a <NavIcon> or an illustration.
// ============================================================

import Mochi from './Mochi.jsx';

// `art` takes an entry from EMPTY_ART (src/data/art.js): an illustration of
// the thing that is missing — an empty shelf, a podium with nobody on it. It
// replaces the 52px Mochi rather than sitting next to it, because two mascots
// of different sizes in one column reads as a mistake.
//
// Width and height are declared so the picture reserves its space before it
// loads; without them the title and button jump down when it arrives.
export default function EmptyState({
  icon = null,
  art = null,
  title,
  body = null,
  ctaLabel = null,
  onCta = null,
  style,
}) {
  return (
    <div className="vmx-empty-state" style={style}>
      {art ? (
        <img
          className="vmx-empty-art"
          src={art.src}
          alt={art.alt || ''}
          width={640}
          height={480}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="icon" aria-hidden="true" style={{ color: 'var(--clr-sage-text)' }}>
          <Mochi state="curious" size={52} slot="empty" fallback={icon} />
        </span>
      )}
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--clr-ink)', marginBottom: body ? 6 : 0 }}>
        {title}
      </div>
      {body && <div style={{ maxWidth: '42ch', margin: '0 auto' }}>{body}</div>}
      {ctaLabel && onCta && (
        <button type="button" className="vmx-btn vmx-btn-primary cta" onClick={onCta} style={{ minHeight: 44 }}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
