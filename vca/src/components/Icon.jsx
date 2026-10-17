// One drawn icon set: 24 px grid, 1.7 px strokes with round ends, optically centred. Decorative
// unless given a label; a button carries its own name.

const PATHS = {
  arrowRight: 'M4.5 12h14.5M13 6.5 18.5 12 13 17.5',
  arrowLeft: 'M19.5 12H5M11 6.5 5.5 12 11 17.5',
  arrowUpRight: 'M7 17 17 7M9 7h8v8',
  check: 'M5 12.6 9.4 17 19 7.4',
  x: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
  flag: 'M6 20.5V4.2M6 4.5h10.6l-2.1 3.9 2.1 3.9H6',
  grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2',
  search: 'M10.8 18.1a7.3 7.3 0 1 0 0-14.6 7.3 7.3 0 0 0 0 14.6ZM16.2 16.2 20.5 20.5',
  sun: 'M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4ZM12 2.8v1.9M12 19.3v1.9M4.9 4.9l1.3 1.3M17.8 17.8l1.3 1.3M2.8 12h1.9M19.3 12h1.9M4.9 19.1l1.3-1.3M17.8 6.2l1.3-1.3',
  moon: 'M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z',
  home: 'M4 10.6 12 4l8 6.6V20H14.5v-5.6h-5V20H4z',
  play: 'M8 5.6v12.8a.6.6 0 0 0 .9.5l10.2-6.4a.6.6 0 0 0 0-1L8.9 5.1a.6.6 0 0 0-.9.5Z',
  stack: 'M12 3.8 20.2 8 12 12.2 3.8 8zM3.8 12 12 16.2 20.2 12M3.8 16 12 20.2 20.2 16',
  book: 'M4.5 5.2c2.7-.9 5.2-.6 7.5 1v13c-2.3-1.6-4.8-1.9-7.5-1zM19.5 5.2c-2.7-.9-5.2-.6-7.5 1v13c2.3-1.6 4.8-1.9 7.5-1z',
  chart: 'M4.5 19.5h15M7 16v-4.5M11 16V7.5M15 16v-6M19 16V5',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.6v.4',
  chevronDown: 'm6.5 9.5 5.5 5.5 5.5-5.5',
  chevronRight: 'm9.5 6.5 5.5 5.5-5.5 5.5',
  refresh: 'M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4.2h-4.2',
  target: 'M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM12 15.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z',
  timer: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 9v4.2M9.5 2.8h5',
  calendar: 'M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4',
  download: 'M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14',
  upload: 'M12 15.5v-11M7.5 9 12 4.5 16.5 9M5 19.5h14',
  trash: 'M5 7h14M9.5 7V4.8h5V7M7 7l.8 12.5h8.4L17 7',
  sparkle: 'M12 3.5c.6 4.4 2.1 5.9 6.5 6.5-4.4.6-5.9 2.1-6.5 6.5-.6-4.4-2.1-5.9-6.5-6.5 4.4-.6 5.9-2.1 6.5-6.5Z',
  layers: 'M12 4 20 8.2 12 12.4 4 8.2zM6.4 11.6 4 12.8l8 4.2 8-4.2-2.4-1.2',
  share: 'M12 15.5V4.2M7.8 8.2 12 4l4.2 4.2M7 11H5.5v8.5h13V11H17',
  link: 'M10.2 13.8a3.6 3.6 0 0 0 5.1 0l3-3a3.6 3.6 0 0 0-5.1-5.1l-1.1 1.1M13.8 10.2a3.6 3.6 0 0 0-5.1 0l-3 3a3.6 3.6 0 0 0 5.1 5.1l1.1-1.1',
  copy: 'M8.5 8.5h11v11h-11zM15.5 8.5V4.5h-11v11h4',
  phone: 'M8 3.5h8a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5ZM11 17.5h2',
  eye: 'M2.8 12S6.2 5.5 12 5.5 21.2 12 21.2 12 17.8 18.5 12 18.5 2.8 12 2.8 12ZM12 14.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z',
};

export function Icon({ name, size = 20, label, className = '', strokeWidth = 1.7 }) {
  const d = PATHS[name];
  if (!d) return null;
  const filled = name === 'play';
  return (
    <svg
      className={`ic ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
