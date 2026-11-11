// ============================================================
// StudentCard — "การ์ดของฉัน", drawn from the card token and the student's
// own data. Lazy (the studio, the hub's card, the share card load it).
// ============================================================
// A specimen label more than a game card: paper, a thin rule, the serif name,
// numerals in the mono face with their units, the character's portrait in a
// measured ring. Earned parts only (lib/card-trophies.js decides). The light
// it catches is lib/card-sheen.js.
// ============================================================
import { useEffect, useRef } from 'react';
import Avatar from './Avatar.jsx';
import { attachSheen } from '../lib/card-sheen.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { BADGE_ART, IG_BACKGROUNDS } from '../data/art.js';

const BACKDROP_SRC = Object.fromEntries(IG_BACKGROUNDS.filter((b) => b.src).map((b) => [b.id, b.src]));

export default function StudentCard({ card, name, picture, stats, serial, compact = false }) {
  const ref = useRef(null);
  const { reduced } = useMotionPreferences();
  useEffect(() => attachSheen(ref.current, { reduced }), [reduced]);
  const title = card.title ? BADGE_ART[card.title]?.label : null;
  const backdrop = BACKDROP_SRC[card.backdrop];
  return (
    <figure
      ref={ref}
      className={`vmx-scard is-frame-${card.frame} is-bd-${card.backdrop}${compact ? ' is-compact' : ''}`}
      aria-label={`การ์ดของ ${name}`}
      data-frame={card.frame}
      data-backdrop={card.backdrop}
    >
      {backdrop && <img className="vmx-scard__bd" src={backdrop} alt="" aria-hidden="true" decoding="async" />}
      <span className="vmx-scard__sheen" aria-hidden="true" />
      <div className="vmx-scard__top">
        <span className="vmx-scard__brand">VetMock</span>
        <span className="vmx-scard__serial">{serial}</span>
      </div>
      <div className="vmx-scard__body">
        <div className="vmx-scard__ring" aria-hidden="true">
          <Avatar emoji={picture} size={compact ? 56 : 72} />
        </div>
        <div className="vmx-scard__who">
          <figcaption className="vmx-scard__name">{name}</figcaption>
          {title && <p className="vmx-scard__title">{title}</p>}
        </div>
      </div>
      <dl className="vmx-scard__stats">
        <div><dt>ทำแล้ว</dt><dd>{stats.answered.toLocaleString('en-US')}<small>ข้อ</small></dd></div>
        <div><dt>ต่อเนื่องสูงสุด</dt><dd>{stats.streak}<small>วัน</small></dd></div>
        <div><dt>ถ้วย</dt><dd>{stats.trophies}<small>ใบ</small></dd></div>
      </dl>
      {card.trophies.length > 0 && (
        <ul className="vmx-scard__shelf" aria-label="ถ้วยที่โชว์">
          {card.trophies.map((id) => (
            <li key={id}><img src={BADGE_ART[id]?.src} alt={BADGE_ART[id]?.label || ''} width="32" height="32" decoding="async" /></li>
          ))}
        </ul>
      )}
    </figure>
  );
}
