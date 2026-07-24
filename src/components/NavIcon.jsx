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
