// ============================================================
// NavIcon — small line icons for the primary nav. Stroke-based,
// currentColor, 24×24. Replaces emoji-as-interface-icon (a reference
// tool shouldn't navigate by 🏠🎯⏱️). Decorative → aria-hidden; the nav
// buttons carry the accessible label.
// ============================================================
import React from 'react';

const PATHS = {
  // house
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M9.5 20v-5.5h5V20" />,
  // clipboard / practice list
  practice: (
    <>
      <path d="M8 4h8v3H8zM6 5.5H5a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6.5a1 1 0 0 0-1-1h-1" />
      <path d="M8 11h8M8 15h5" />
    </>
  ),
  // clock / timed exam
  exam: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M9 2h6" />
    </>
  ),
  // bar chart / progress
  progress: <path d="M4 20V13M9 20V7M14 20v-9M19 20V4M3 20h18" />,
  // open book / wiki
  wiki: (
    <>
      <path d="M12 6.5C10 5 6.5 5 4.5 6v13c2-1 5.5-1 7.5.5 2-1.5 5.5-1.5 7.5-.5V6c-2-1-5.5-1-7.5.5Z" />
      <path d="M12 6.5V20" />
    </>
  ),
  // magnifier / search (header ⌘K)
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  // account / sign in
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M15.5 5.5a3 3 0 0 1 0 5.8M16 14.5a5 5 0 0 1 4.5 5.5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v4.5a4 4 0 0 1-8 0V4ZM9 20h6M12 12.5V20" />
      <path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.7V21h-4v-.1a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1-2.8-2.8.1-.1a1.8 1.8 0 0 0 .4-2A1.8 1.8 0 0 0 3 14H3v-4h.1a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.4-2l-.1-.1 2.8-2.8.1.1a1.8 1.8 0 0 0 2 .4A1.8 1.8 0 0 0 10 3V3h4v.1a1.8 1.8 0 0 0 1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1 2.8 2.8-.1.1a1.8 1.8 0 0 0-.4 2A1.8 1.8 0 0 0 21 10h.1v4H21a1.8 1.8 0 0 0-1.6 1Z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M14 8l4 4-4 4M8 12h10" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
  repeat: (
    <>
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M6.1 8.5A7 7 0 0 1 18.8 7M17.9 15.5A7 7 0 0 1 5.2 17" />
    </>
  ),
  // ribbon / saved questions
  bookmark: <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />,
  // flame / daily streak
  flame: (
    <>
      <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.7.7-3.1 1.5-4.2.4 1 1 1.7 1.8 2C11 8 12 5.6 12 3Z" />
    </>
  ),
  // star outline / bookmark this question (filled variant via `filled` prop)
  star: <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9L12 3.6Z" />,
  // pencil on a page / personal note
  note: (
    <>
      <path d="M13 4H6.5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-6" />
      <path d="M16.5 3.5a1.7 1.7 0 0 1 2.4 2.4L13.6 11l-2.9.6.6-2.9 5.2-5.2Z" />
    </>
  ),
  // speaker with waves / read aloud
  speaker: (
    <>
      <path d="M4 9.5h3L11 6v12l-4-3.5H4z" />
      <path d="M14.5 9.2a4 4 0 0 1 0 5.6M17 6.8a7.5 7.5 0 0 1 0 10.4" />
    </>
  ),
  // muted speaker / stop reading
  'speaker-off': (
    <>
      <path d="M4 9.5h3L11 6v12l-4-3.5H4z" />
      <path d="m15 9.8 4.5 4.4M19.5 9.8 15 14.2" />
    </>
  ),
  // flag on a pole / report a problem with this question
  flag: (
    <>
      <path d="M6 21V4" />
      <path d="M6 4.8h11l-2.2 3.6L17 12H6z" />
    </>
  ),
  // pushpin / pin to the pinboard
  pin: (
    <>
      <path d="M12 15v6" />
      <path d="M8.4 4h7.2l-1 5 2.9 2.6a1 1 0 0 1-.7 1.7H7.2a1 1 0 0 1-.7-1.7L9.4 9l-1-5Z" />
    </>
  ),
  // crescent / switch to dark
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  // sun / switch to light
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
};

/** `filled` gives an on/off pair from ONE path — a bookmarked question or an
 *  active flag reads as solid, the idle state as an outline, without needing a
 *  second glyph (which is what the ★/☆ and 🚩/🏳️ emoji pairs were doing). */
export default function NavIcon({ name, size = 22, filled = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name] || PATHS.home}
    </svg>
  );
}
