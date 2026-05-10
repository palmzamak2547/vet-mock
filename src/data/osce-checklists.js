// ============================================================
// OSCE checklist library
// ============================================================
// Each scenario is a list of weighted skill items the examiner
// would score. The user runs the drill mentally, ticking off each
// step in real time; final score = sum of weighted ticked items
// divided by total weight.
//
// These are intentionally generic templates that match the
// Vet 86 OSCE pool's common stations. Add more presets in this
// file (no UI changes needed) — OSCEDrill auto-renders the list.
//
// Item.weight: 1 = standard step, 2 = critical step (often a
// "must hit" — failing it can flunk the station regardless of
// other points).
// ============================================================

export const OSCE_CHECKLISTS = [
  {
    id: 'pe-small-animal',
    title: 'Physical Exam — Small Animal',
    icon: '🩺',
    minutes: 5,
    items: [
      { text: 'Greet client + verify signalment', weight: 1 },
      { text: 'Wash hands / use alcohol gel', weight: 2 },
      { text: 'Restrain patient appropriately + minimize stress', weight: 1 },
      { text: 'Body condition score (1-9 scale, document)', weight: 1 },
      { text: 'TPR — temperature (rectal, mention reading)', weight: 1 },
      { text: 'TPR — heart rate, mention rhythm', weight: 1 },
      { text: 'TPR — respiratory rate + character', weight: 1 },
      { text: 'Mucous membrane color + CRT', weight: 1 },
      { text: 'Hydration check (skin tent, eye position, MM moisture)', weight: 1 },
      { text: 'Lymph node palpation (mandibular, prescapular, popliteal, others)', weight: 2 },
      { text: 'Heart auscultation 4 valve sites + pulse quality (femoral)', weight: 2 },
      { text: 'Lung auscultation — all 4 quadrants both sides', weight: 2 },
      { text: 'Abdominal palpation — systematic', weight: 1 },
      { text: 'Eye exam — direct + consensual PLR, menace, palpebral', weight: 1 },
      { text: 'Ear exam — both ears, mention otoscope use', weight: 1 },
      { text: 'Oral / dental check', weight: 1 },
      { text: 'Skin / coat overview', weight: 1 },
      { text: 'Neuro screen — gait, conscious proprioception', weight: 1 },
      { text: 'Document findings + share plan with client', weight: 1 },
    ],
  },
  {
    id: 'iv-catheter',
    title: 'IV Catheter Placement',
    icon: '💉',
    minutes: 4,
    items: [
      { text: 'Verify patient ID + select appropriate gauge', weight: 1 },
      { text: 'Hand hygiene + clean gloves', weight: 2 },
      { text: 'Clip + aseptically prep site (chlorhex/alcohol ×3)', weight: 2 },
      { text: 'Apply tourniquet / hold off vein proximally', weight: 1 },
      { text: 'Stretch skin, insert with bevel up', weight: 1 },
      { text: 'Confirm flash → advance plastic over stylet', weight: 2 },
      { text: 'Withdraw stylet (do NOT reinsert) + dispose sharp safely', weight: 2 },
      { text: 'Cap / T-port + flush with saline (no resistance)', weight: 1 },
      { text: 'Secure with tape / wrap — no slipping', weight: 1 },
      { text: 'Label catheter (date + gauge + initials)', weight: 1 },
      { text: 'Record in chart', weight: 1 },
    ],
  },
  {
    id: 'et-intubation',
    title: 'Endotracheal Intubation (Dog)',
    icon: '🌬',
    minutes: 3,
    items: [
      { text: 'Pre-oxygenate ≥3 min', weight: 1 },
      { text: 'Select ET tube — measure length + cuff check', weight: 2 },
      { text: 'Position — sternal / lateral, neck extended', weight: 1 },
      { text: 'Open mouth + visualize larynx (laryngoscope or fingers)', weight: 1 },
      { text: 'Lidocaine on epiglottis (cat) or glottis as needed', weight: 1 },
      { text: 'Pass tube, do NOT force, between arytenoids', weight: 2 },
      { text: 'Confirm placement — chest rise + capnography', weight: 2 },
      { text: 'Inflate cuff to seal, check leak at 20 cmH2O', weight: 2 },
      { text: 'Secure tube to muzzle / maxilla', weight: 1 },
      { text: 'Connect to circuit + monitor SpO2 + EtCO2', weight: 1 },
    ],
  },
  {
    id: 'suturing',
    title: 'Skin Suturing — Simple Interrupted',
    icon: '🪡',
    minutes: 5,
    items: [
      { text: 'Identify wound + select suture material/needle', weight: 1 },
      { text: 'Hand hygiene + sterile gloves', weight: 2 },
      { text: 'Drape + prep field if not already', weight: 1 },
      { text: 'Load needle in driver — 2/3 from tip, perpendicular', weight: 1 },
      { text: 'Engage skin 5 mm from edge, follow needle curve', weight: 2 },
      { text: 'Match exit point on opposite side, equal bite depth', weight: 2 },
      { text: 'Wrap × 2 → square knot → wrap × 1 → wrap × 1 (instrument tie)', weight: 1 },
      { text: 'Snug knot WITHOUT crushing tissue (good apposition, no inversion)', weight: 2 },
      { text: 'Cut suture leaving ~3 mm tails', weight: 1 },
      { text: 'Space sutures evenly (1 cm intervals on skin)', weight: 1 },
      { text: 'Dispose sharps + check wound apposition before drape down', weight: 1 },
    ],
  },
  {
    id: 'anesthesia-check',
    title: 'Anesthesia Machine Pre-use Check',
    icon: '🟢',
    minutes: 4,
    items: [
      { text: 'O₂ supply pressure ≥ 50 psi (E-tank ≥1500 psi)', weight: 2 },
      { text: 'O₂ flush — quick test', weight: 1 },
      { text: 'Vaporizer level adequate (not <25%)', weight: 1 },
      { text: 'Fresh CO₂ absorber (pink/violet → fresh; white → fresh)', weight: 2 },
      { text: 'Circle / rebreathing system selected appropriate to BW', weight: 1 },
      { text: 'Leak test — close pop-off, fill bag to 30 cmH2O, hold', weight: 2 },
      { text: 'Pop-off valve open after leak test', weight: 2 },
      { text: 'Scavenge connected + functional', weight: 1 },
      { text: 'Patient monitor — SpO2, ECG, NIBP, EtCO2 all on', weight: 1 },
      { text: 'Emergency drugs at hand (epi, atropine, lidocaine, naloxone)', weight: 1 },
    ],
  },
  {
    id: 'cpcr-basic',
    title: 'CPCR — Basic Life Support',
    icon: '❤️',
    minutes: 3,
    items: [
      { text: 'Recognize arrest — no pulse, agonal/no breathing', weight: 2 },
      { text: 'Call for help + start timer', weight: 1 },
      { text: 'Position lateral recumbency (small/medium dogs)', weight: 1 },
      { text: 'Begin chest compressions @ 100-120/min', weight: 2 },
      { text: 'Compression depth 1/3 to 1/2 chest width', weight: 2 },
      { text: 'Allow full chest recoil between compressions', weight: 1 },
      { text: 'Switch compressors every 2 min to avoid fatigue', weight: 1 },
      { text: 'Intubate + ventilate 10 breaths/min, 1-sec inspiration', weight: 2 },
      { text: 'Place IV/IO + give epi 0.01 mg/kg q3-5 min', weight: 2 },
      { text: 'Pause briefly to assess rhythm + ROSC q2 min', weight: 1 },
    ],
  },
];
