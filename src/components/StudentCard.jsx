// ============================================================
// StudentCard: "การ์ดของฉัน", drawn from cardFace() (lib/card-style.js)
// ============================================================
// A specimen label more than a game card: card stock, a printed plate behind,
// the serif name, numerals in the mono face with their units, the picture in
// a measured ring. The share image (lib/share-card/student-card.js) draws the
// same face with the same colours and the same crop of the plate.
// The light it catches is lib/card-sheen.js (never under reduced motion).
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { attachSheen } from '../lib/card-sheen.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import '../styles-card.css';

export default function StudentCard({ face, compact = false, still = false, className = '', onPhotoBroken = null }) {
  const ref = useRef(null);
  // A member's own picture, when the face carries one. One that fails to load gives way to the ready-made picture.
  const [brokenPhoto, setBrokenPhoto] = useState('');
  const photo = face.photo && face.photo !== brokenPhoto ? face.photo : '';
  const { reduced } = useMotionPreferences();
  useEffect(() => (still ? undefined : attachSheen(ref.current, { reduced })), [reduced, still]);
  const c = face.colours;
  const style = {
    '--sc-stock': c.stock, '--sc-ink': c.ink, '--sc-soft': c.soft, '--sc-rule': c.rule,
    '--sc-brand': c.brand, '--sc-title': c.title, '--sc-gold': c.gold, '--sc-seal': c.seal,
    '--sc-plate': c.plateOpacity, '--sc-plate-filter': c.plateFilter,
    '--sc-foil': `conic-gradient(from 210deg, ${c.foil.join(', ')}, ${c.foil[0]})`,
  };
  return (
    <figure
      ref={ref}
      className={`vmx-scard is-frame-${face.frame}${compact ? ' is-compact' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      aria-label={`การ์ดของ ${face.name}`}
      data-frame={face.frame}
      data-backdrop={face.backdrop.id}
    >
      {face.backdrop.src && <img className="vmx-scard__bd" src={face.backdrop.src} alt="" aria-hidden="true" decoding="async" />}
      {!still && <span className="vmx-scard__sheen" aria-hidden="true" />}
      <div className="vmx-scard__top">
        <span className="vmx-scard__brand">{face.brand}</span>
        {face.yearLine && <span className="vmx-scard__year">{face.yearLine}</span>}
      </div>
      <div className="vmx-scard__body">
        <span className="vmx-scard__ring" aria-hidden="true">
          {photo
            ? <img src={photo} alt="" referrerPolicy="no-referrer" draggable={false} onError={() => { setBrokenPhoto(photo); if (onPhotoBroken) onPhotoBroken(photo); }} />
            : face.picture}
        </span>
        <div className="vmx-scard__who">
          <figcaption className="vmx-scard__name">{face.name}</figcaption>
          {face.title && <p className="vmx-scard__title">{face.title}</p>}
        </div>
      </div>
      <div className="vmx-scard__foot">
        {face.stats.length > 0 && (
          <dl className="vmx-scard__stats">
            {face.stats.map((s) => (
              <div key={s.label}><dt>{s.label}</dt><dd>{s.value}<small>{s.unit}</small></dd></div>
            ))}
          </dl>
        )}
        {face.trophies.length > 0 && (
          <ul className="vmx-scard__shelf" aria-label="ถ้วยบนการ์ด">
            {face.trophies.map((t) => (
              <li key={t.id}><img src={t.src} alt={t.label} width="32" height="32" decoding="async" /></li>
            ))}
          </ul>
        )}
      </div>
    </figure>
  );
}
