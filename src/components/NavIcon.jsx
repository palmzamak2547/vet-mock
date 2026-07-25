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
  // ribbon / saved questions
  bookmark: <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />,
  // flame / daily streak
  flame: (
    <>
      <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.7.7-3.1 1.5-4.2.4 1 1 1.7 1.8 2C11 8 12 5.6 12 3Z" />
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

export default function NavIcon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
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
