// The share cards' two palettes, light and dark. Plain data with no imports:
// the app shell reads the page background from it, the card studio its card
// colours, and the canvas kit everything else. Being in the shell's first load
// keeps it out of a chunk of its own on Home (perf-budget.spec.js counts requests).
export const PALETTES = {
  light: {
    bg: '#f6efe4', ink: '#2b2419', soft: '#5c5246', rule: 'rgba(43,36,25,0.18)', faint: 'rgba(43,36,25,0.07)',
    sage: '#355a39', sageField: '#4a6b4a', rose: '#93454b', gold: '#76511e', goldField: '#b88940',
    glass: 'rgba(255,255,255,0.55)', grain: '43,36,25', paw: '#fdf8ef',
    // ECG paper is printed pink; the trace is the app's green.
    gridMinor: 'rgba(147,69,75,0.1)', gridMajor: 'rgba(147,69,75,0.22)', trace: '#355a39',
    // Stains on the daily slides and the score scale's fill.
    right: '#4a6b4a', rightEdge: '#6f8f6a', wrong: '#b4555b', wrongEdge: '#d08a8e',
    // The printed timetable's near-white page (timetable-card.js): a printer
    // wastes ink on a tinted sheet and stops short of its edge anyway.
    print: '#fffdf9',
  },
  dark: {
    bg: '#1a1612', ink: '#f0e6d2', soft: '#bcb19e', rule: 'rgba(240,230,210,0.2)', faint: 'rgba(240,230,210,0.07)',
    sage: '#9bc99b', sageField: '#7fae7f', rose: '#edaaaa', gold: '#e4ba73', goldField: '#e4ba73',
    glass: 'rgba(255,255,255,0.05)', grain: '240,230,210', paw: '#fdf8ef',
    gridMinor: 'rgba(237,170,170,0.08)', gridMajor: 'rgba(237,170,170,0.18)', trace: '#9bc99b',
    right: '#7fae7f', rightEdge: '#a6cba3', wrong: '#d98a8f', wrongEdge: '#efb4b6',
  },
};
