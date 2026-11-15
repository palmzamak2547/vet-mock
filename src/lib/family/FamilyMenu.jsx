// The family's two shared pieces of markup, used by all four sites: a menu for the header and a
// list for the footer. Markup and behaviour only; each site styles the `vm-family` classes in its
// own stylesheet with its own tokens. The words come from family.js.

import { useEffect, useRef } from 'react';
import { FAMILY, FAMILY_TITLE, stampCrossing } from './family.js';

const pick = (lang) => (lang === 'en' ? 'en' : 'th');

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      {[4, 10, 16].map((y) => [4, 10, 16].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.7" fill="currentColor" />))}
    </svg>
  );
}

/** One row: a link to another site, or the site you are on, unlinked. */
function Row({ member, self, lang, carryLang, line = true }) {
  const text = (
    <>
      <span className="vm-family-name">{member.name}</span>
      {line && <span className="vm-family-line">{member[lang]}</span>}
    </>
  );
  if (member.id === self) {
    return <span className="vm-family-row vm-family-here" aria-current="page">{text}</span>;
  }
  return (
    <a
      className="vm-family-row"
      href={member.url}
      data-family={member.id}
      onClick={(e) => stampCrossing(e.currentTarget, { lang: carryLang })}
    >
      {text}
    </a>
  );
}

/**
 * The header's door to the other sites. A native disclosure, so it opens with a tap, Enter or
 * Space and needs no script to work; the script only closes it on Escape or a tap outside.
 * @param {{ self: string, lang?: 'th'|'en', carryLang?: 'th'|'en'|null, className?: string, buttonClassName?: string }} props
 *   carryLang: the language to pass along, only where this page has a language switch
 */
export function FamilyMenu({ self, lang = 'th', carryLang = null, className = '', buttonClassName = '' }) {
  const ref = useRef(null);
  const l = pick(lang);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onDown = (e) => { if (el.open && !el.contains(e.target)) el.open = false; };
    const onKey = (e) => {
      if (e.key !== 'Escape' || !el.open) return;
      el.open = false;
      el.querySelector('summary')?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    el.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      el.removeEventListener('keydown', onKey);
    };
  }, []);
  return (
    <details ref={ref} className={`vm-family ${className}`.trim()}>
      <summary className={`vm-family-btn ${buttonClassName}`.trim()} aria-label={FAMILY_TITLE[l]} title={FAMILY_TITLE[l]}>
        <GridIcon />
      </summary>
      <div className="vm-family-pop">
        <p className="vm-family-h">{FAMILY_TITLE[l]}</p>
        <ul className="vm-family-list">
          {FAMILY.map((m) => (
            <li key={m.id}><Row member={m} self={self} lang={l} carryLang={carryLang} /></li>
          ))}
        </ul>
      </div>
    </details>
  );
}

/**
 * The footer's list of the other sites (the one you are on is left out).
 * @param {{ self: string, lang?: 'th'|'en', carryLang?: 'th'|'en'|null, line?: boolean, className?: string }} props
 */
export function FamilyLinks({ self, lang = 'th', carryLang = null, line = true, className = '' }) {
  const l = pick(lang);
  return (
    <ul className={`vm-family-links ${className}`.trim()}>
      {FAMILY.filter((m) => m.id !== self).map((m) => (
        <li key={m.id}><Row member={m} self={self} lang={l} carryLang={carryLang} line={line} /></li>
      ))}
    </ul>
  );
}
