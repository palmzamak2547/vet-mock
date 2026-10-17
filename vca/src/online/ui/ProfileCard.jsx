// The profile as a card on a stack of notebook paper: what friends will see, filled in live while
// the student types (the setup steps and the edit sheet show it above the form), and stamped
// once the profile exists. Blank fields are blank ruled lines, the way a form looks before it is
// filled, so the card never shows made-up content.

import { CARD_BY_ID } from '../../lib/bank.js';
import { Avatar } from './Avatar.jsx';

const FOCUS_SHOWN = 3;
// Two-digit Buddhist year, the way Thai stamps and forms write it: 18 ต.ค. 69.
const stampDay = (iso) => new Date(iso || Date.now()).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });

function Stamp({ day }) {
  return (
    <span className="pcard-stamp" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <path id="pcard-arc" d="M 50 50 m -36 0 a 36 36 0 1 1 72 0 a 36 36 0 1 1 -72 0" />
          {/* Ink on paper is never even: a little turbulence breaks the stamp's edges. */}
          <filter id="pcard-ink" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        <g filter="url(#pcard-ink)">
          <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth=".9" />
          <text className="pcard-stamp-arc"><textPath href="#pcard-arc" startOffset="0">VETMOCK VCA COMMUNITY</textPath></text>
          <text className="pcard-stamp-big" x="50" y="53" textAnchor="middle">สมาชิก</text>
          <text className="pcard-stamp-day" x="50" y="66" textAnchor="middle">{day}</text>
        </g>
      </svg>
    </span>
  );
}

export function ProfileCard({ profile, stamped = false }) {
  const facts = [profile.school, profile.cohort, profile.round ? `สอบรอบ ${profile.round}` : ''].filter(Boolean);
  const focus = (profile.focus || []).map((id) => CARD_BY_ID[id]?.th).filter(Boolean);
  return (
    <div className={`pcard${stamped ? ' is-stamped' : ''}`}>
      <div className="pcard-sheet">
        <div className="pcard-top">
          <Avatar profile={profile} size={60} />
          <div className="pcard-who">
            {profile.name?.trim() ? <b className="pcard-name">{profile.name.trim()}</b> : <span className="pcard-blank pcard-blank-name" />}
            {profile.handle ? <span className="pcard-handle">@{profile.handle}</span> : <span className="pcard-blank" />}
          </div>
        </div>
        <div className="pcard-lines">
          {facts.length ? <p className="pcard-facts">{facts.map((f) => <span key={f}>{f}</span>)}</p> : <span className="pcard-blank pcard-blank-wide" />}
          {focus.length > 0 && (
            <p className="pcard-focus">
              {focus.slice(0, FOCUS_SHOWN).map((f) => <span key={f}>{f}</span>)}
              {focus.length > FOCUS_SHOWN && <span className="pcard-more">+{focus.length - FOCUS_SHOWN}</span>}
            </p>
          )}
        </div>
        {stamped && <Stamp day={stampDay(profile.onboardedAt)} />}
      </div>
    </div>
  );
}
