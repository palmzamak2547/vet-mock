// 24 px line icons from the workspace boards (build.mjs ICON). Decorative: always aria-hidden, the
// text beside them carries the meaning. No emoji icons anywhere. OWNER: workspace role.

const PATHS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  file: 'M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z M14 3v5h5',
  upload: 'M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z M14 3v5h5 M12 17.5v-6 M9.5 14L12 11.5 14.5 14',
  book: 'M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5z M5 20.5A2.5 2.5 0 0 0 7.5 23 M19 18v3H7.5',
  grid: 'M4 5h16v14H4z M4 10h16 M4 15h16 M10 5v14',
  design: 'M10.5 3h3v4h-3z M12 7v3 M5 13.5v-1.5h14v1.5 M3.5 13.5h3v6h-3z M10.5 13.5h3v6h-3z M17.5 13.5h3v6h-3z M12 12v1.5',
  percent: 'M19 5L5 19 M7.5 5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5 M16.5 14a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5',
  pair: 'M8.5 12h7 M5.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M18.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6',
  table: 'M4 5h16v14H4z M4 9.5h16 M9 9.5V19',
  doc: 'M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6',
  mark: 'M7 4h10v16l-5-3.5L7 20z',
  calc: 'M6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z M8.5 7h7 M8.5 11h.01 M12 11h.01 M15.5 11h.01 M8.5 14.5h.01 M12 14.5h.01 M15.5 14.5h.01 M8.5 18h.01 M12 18h3.5',
  log: 'M4 6h10 M4 11h7 M4 16h6 M17 12.5v3l2 1.2 M17 11a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9',
  lock: 'M6 11h12v9.5H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert: 'M12 4.5l8.5 15h-17z M12 10v4 M12 16.8h.01',
  stop: 'M8.5 3.5h7l5 5v7l-5 5h-7l-5-5v-7z M12 8v5 M12 16h.01',
  info: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M12 11v5.5 M12 7.8h.01',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  down: 'M12 4v11 M7 10l5 5 5-5 M5 20h14',
  copy: 'M9 9h10v11H9z M5 15V4h10',
  user: 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M4.5 20.5a7.5 7.5 0 0 1 15 0',
  plus: 'M12 5v14 M5 12h14',
  chev: 'M6 9l6 6 6-6',
  eyeOff: 'M3 3l18 18 M10.6 6.1A9 9 0 0 1 12 6c5 0 9 6 9 6a16 16 0 0 1-2.6 3.1 M6.6 7.6A16 16 0 0 0 3 12s4 6 9 6a8.6 8.6 0 0 0 3.4-.7',
  eye: 'M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z M12 9.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5',
  wifiOff: 'M3 3l18 18 M8.6 13.5a5 5 0 0 1 6.8 0 M5.2 10a10 10 0 0 1 3.7-2.2 M18.8 10a10 10 0 0 0-5-2.7 M12 18h.01',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  back: 'M19 12H5 M11 6l-6 6 6 6',
  search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14 M20 20l-4.2-4.2',
  close: 'M6 6l12 12 M18 6L6 18',
  undo: 'M9 7L4 12l5 5 M4 12h10a6 6 0 0 1 0 12h-2',
  trash: 'M4 7h16 M9 7V4h6v3 M6.5 7l1 13h9l1-13',
  filter: 'M4 5h16l-6 7.5V19l-4 1.5v-8z',
  edit: 'M4 20h4L19 9l-4-4L4 16z M13.5 6.5l4 4',
  sun: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M12 2.5v2 M12 19.5v2 M2.5 12h2 M19.5 12h2 M5.3 5.3l1.4 1.4 M17.3 17.3l1.4 1.4 M5.3 18.7l1.4-1.4 M17.3 6.7l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  image: 'M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M15.5 8.5h.01',
  folder: 'M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z',
  play: 'M7 5l12 7-12 7z',
};

/**
 * @param {{ name: keyof typeof PATHS, size?: number, className?: string }} props
 */
export default function Icon({ name, size = 20, className = '' }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg className={`rs-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}
