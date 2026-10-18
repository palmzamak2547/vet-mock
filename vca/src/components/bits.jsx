// Small pieces every page uses: the specimen plate, meters, the score ring, segmented choices,
// the provenance badge, keyboard hints.

import { useEffect, useState } from 'react';
import { artSet } from '../lib/art.js';
import { plateNo, num } from '../lib/format.js';
import { reducedMotion } from '../lib/motion.js';
import { CountUp } from './CountUp.jsx';

/**
 * A print from VetMock's own course art, on its paper, numbered like a plate on the wall. Given
 * `sizes` (how wide the print draws, as in <img sizes>), it is drawn from the smallest copy that is
 * sharp on the screen asking: the art is 418 to 512 px and a print on the wall is 62 px on a phone.
 * Without `sizes` (the page's own big print) it is the art itself.
 */
export function Plate({ card, caption = true, className = '', eager = false, sizes, style, ...rest }) {
  return (
    <figure className={`plate ${className}`} style={{ '--paper': card.paper, '--paper-0': `${card.paper}00`, ...style }} {...rest}>
      <img src={card.art} srcSet={sizes ? artSet(card.art) : undefined} sizes={sizes} alt="" width="512" height="512" loading={eager ? 'eager' : 'lazy'} decoding="async" />
      {caption && <figcaption><span>{plateNo(card.plate)}</span><span className="plate-tag">{card.tag}</span></figcaption>}
    </figure>
  );
}

export function Meter({ value, label, tone = 'verd', i = 0 }) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  return (
    <span className={`meter meter-${tone}`} role="img" aria-label={label} style={{ '--i': i }}>
      <i style={{ width: `${(v * 100).toFixed(1)}%` }} />
    </span>
  );
}

/** The result's score: a hairline circle drawn, on arrival, to the share answered right. */
export function Ring({ value, size = 168, stroke = 6, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const target = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  const [v, setV] = useState(() => (reducedMotion() ? target : 0));
  useEffect(() => {
    if (reducedMotion()) { setV(target); return undefined; }
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setV(target)));
    return () => cancelAnimationFrame(id);
  }, [target]);
  return (
    <div className={`ring${target >= 0.8 ? ' is-high' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--verd)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${(c * v).toFixed(2)} ${c.toFixed(2)}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-in">{children}</div>
    </div>
  );
}

/**
 * A row of mutually exclusive choices. Renders native radios, so arrow keys and screen readers
 * work the way they do everywhere else.
 */
export function Seg({ name, value, onChange, options, label, wide = false }) {
  return (
    <fieldset className={`seg${wide ? ' seg-wide' : ''}`}>
      {label && <legend className="label">{label}</legend>}
      <div className="seg-row">
        {options.map((o) => (
          <label key={o.value} className={`seg-opt${value === o.value ? ' on' : ''}${o.disabled ? ' off' : ''}`}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} />
            <span className="seg-main">{o.label}</span>
            {o.hint && <span className="seg-hint">{o.hint}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const KIND = {
  vca: { th: 'แนว VCA', tone: 'verd' },
  paper: { th: 'ข้อสอบเก่า', tone: 'brass' },
  aligned: { th: 'อิงแนวข้อสอบ', tone: 'plain' },
  lecture: { th: 'จากเลกเชอร์', tone: 'plain' },
  course: { th: 'คลังรายวิชา', tone: 'plain' },
};

export const kindLabel = (kind) => KIND[kind]?.th || kind;

export function KindBadge({ kind }) {
  const k = KIND[kind] || KIND.course;
  return <span className={`badge badge-${k.tone}`}>{k.th}</span>;
}

export function Kbd({ children }) {
  return <kbd className="kbd">{children}</kbd>;
}

/** A big serif figure with its unit, as the numbers band and the result use. */
export function Figure({ value, unit, children, className = '', ...rest }) {
  return (
    <div className={`fig ${className}`} {...rest}>
      <div className="fig-n">{typeof value === 'number' ? <CountUp value={value} /> : value}{unit && <small>{unit}</small>}</div>
      {children && <div className="fig-t">{children}</div>}
    </div>
  );
}

/** A phrase that must not break inside (a compound, a name, a number and its unit). */
export const Nw = ({ children }) => <span className="nw">{children}</span>;

/**
 * A Thai name set phrase by phrase: each run between spaces and `|` marks stays whole, a
 * space breaks as a space, a `|` breaks invisibly (see src/data/domains.js).
 */
export function Words({ text }) {
  // One wrapper, so a flex row treats the name as one item, not one item per phrase.
  return (
    <span className="words">
      {String(text).split(/(\s+|\|)/).map((t, i) => {
        if (t === '|') return <wbr key={i} />;
        if (!t) return null;
        if (/^\s+$/.test(t)) return ' ';
        return <span key={i} className="nw">{t}</span>;
      })}
    </span>
  );
}
