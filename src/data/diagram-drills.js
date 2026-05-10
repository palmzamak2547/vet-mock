// ============================================================
// diagram-drills — anatomy labeling exercise data
// ============================================================
//
// Each drill is a simple inline SVG diagram with named anchor points.
// User taps an anchor → picks the correct label from the shared pool
// → gets immediate feedback. Score = (correct anchors) / (total anchors).
//
// All diagrams are simple shape-art (paths/circles/rects) — no
// copyrighted images or photos. Anchor coordinates are in viewBox space.
// ============================================================

export const DIAGRAM_DRILLS = [
  {
    id: 'heart-4-chamber',
    title: 'Heart — 4 chambers + great vessels',
    icon: '❤️',
    viewBox: '0 0 320 360',
    // Simple stylized heart: 2 atria on top, 2 ventricles below, with
    // major vessels labeled. Drawn with gradient + paths so it doesn't
    // look like a clip-art piece.
    svg: `
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c26d6d" />
          <stop offset="100%" stop-color="#8b3d3d" />
        </linearGradient>
      </defs>
      <!-- Aorta arch -->
      <path d="M 130 60 Q 160 20 190 60 L 190 100 L 130 100 Z" fill="#c0c0c0" stroke="#444" stroke-width="2"/>
      <!-- Pulmonary trunk -->
      <path d="M 110 70 L 130 100 L 110 110 Z" fill="#c0c0c0" stroke="#444" stroke-width="2"/>
      <!-- SVC -->
      <rect x="100" y="80" width="20" height="50" fill="#9090c0" stroke="#444" stroke-width="2"/>
      <!-- IVC -->
      <rect x="100" y="280" width="20" height="60" fill="#9090c0" stroke="#444" stroke-width="2"/>
      <!-- Heart body -->
      <path d="M 90 130 Q 60 130 60 200 L 60 270 Q 60 330 130 330 Q 200 330 230 290 L 240 200 Q 240 130 200 130 Z" fill="url(#hg)" stroke="#5a2727" stroke-width="3"/>
      <!-- Septum -->
      <line x1="150" y1="140" x2="150" y2="320" stroke="#5a2727" stroke-width="2" stroke-dasharray="4 4"/>
      <!-- Atrium / ventricle divider -->
      <line x1="65" y1="200" x2="235" y2="200" stroke="#5a2727" stroke-width="2" stroke-dasharray="4 4"/>
    `,
    anchors: [
      { id: 'ra',  x: 105, y: 165, label: 'Right atrium' },
      { id: 'la',  x: 200, y: 165, label: 'Left atrium' },
      { id: 'rv',  x: 105, y: 270, label: 'Right ventricle' },
      { id: 'lv',  x: 200, y: 270, label: 'Left ventricle' },
      { id: 'svc', x: 110, y: 100, label: 'Superior vena cava' },
      { id: 'ivc', x: 110, y: 310, label: 'Inferior vena cava' },
      { id: 'ao',  x: 165, y: 50,  label: 'Aorta' },
      { id: 'pa',  x: 105, y: 70,  label: 'Pulmonary trunk' },
    ],
  },
  {
    id: 'eye-globe',
    title: 'Eye — basic globe anatomy',
    icon: '👁',
    viewBox: '0 0 360 240',
    svg: `
      <defs>
        <radialGradient id="iris" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stop-color="#5b8a8a" />
          <stop offset="100%" stop-color="#234747" />
        </radialGradient>
      </defs>
      <!-- Sclera -->
      <ellipse cx="180" cy="120" rx="160" ry="100" fill="#fdf8ef" stroke="#5a4f3d" stroke-width="3"/>
      <!-- Cornea (front bulge) -->
      <path d="M 35 120 Q 60 90 100 90 Q 130 90 130 120 Q 130 150 100 150 Q 60 150 35 120 Z" fill="#a8d0e8" opacity="0.55" stroke="#444" stroke-width="2"/>
      <!-- Iris -->
      <circle cx="80" cy="120" r="22" fill="url(#iris)" />
      <!-- Pupil -->
      <circle cx="80" cy="120" r="9" fill="#1a1612" />
      <!-- Lens -->
      <ellipse cx="105" cy="120" rx="14" ry="22" fill="#cfd8e3" opacity="0.7" stroke="#444" stroke-width="2"/>
      <!-- Retina (inner outline) -->
      <ellipse cx="195" cy="120" rx="125" ry="80" fill="none" stroke="#a85a30" stroke-width="2" stroke-dasharray="3 3"/>
      <!-- Optic nerve -->
      <path d="M 320 120 L 360 100 L 360 140 Z" fill="#c0c0c0" stroke="#444" stroke-width="2"/>
    `,
    anchors: [
      { id: 'cornea', x: 70,  y: 120, label: 'Cornea' },
      { id: 'iris',   x: 80,  y: 100, label: 'Iris' },
      { id: 'pupil',  x: 80,  y: 138, label: 'Pupil' },
      { id: 'lens',   x: 105, y: 145, label: 'Lens' },
      { id: 'retina', x: 250, y: 80,  label: 'Retina' },
      { id: 'optic',  x: 340, y: 120, label: 'Optic nerve' },
      { id: 'sclera', x: 220, y: 200, label: 'Sclera' },
    ],
  },
];
