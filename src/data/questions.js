import { QB as QB1 } from './questions-part1.js';
import { QB_PART2 } from './questions-part2.js';
import { QB_PART3 } from './questions-part3.js';
import { QB_COM5 } from './questions-com5.js';
import { QB_COM3 } from './questions-com3.js';
import { QB_COM3_SPECIAL } from './questions-com3-special.js';
import { QB_COM4 } from './questions-com4.js';
import { QB_ENGPROF } from './questions-engprof.js';
import { QB_EXOTIC } from './questions-exotic.js';
import { QB_POULTRY } from './questions-poultry.js';
import { QB_REPRO_LECT } from './questions-repro-lect.js';
import { QB_PRACTRUM } from './questions-practrum.js';
import { QB_CLIAPPRUM } from './questions-cliapprum.js';
import { QB_SHORT } from './questions-short.js';
import { QB_MAHAHON } from './questions-mahahon.js';
import { QB_TERMPAPER } from './questions-termpaper.js';
import { QB_VCA } from './questions-vca.js';

// ── Y5 Q banks — extracted from senior cache 2026-05-12 ──
// All 7 files carry `examOrigin` tagging + flagged Qs where past-paper
// answers disagree with current guideline (Vet 79-81 era papers need
// curriculum-drift verification before students rely on them).
import { QB_Y5_FINAL_MIXED } from './questions-y5-final-mixed.js';
import { QB_Y5_PATHO } from './questions-y5-patho.js';
import { QB_Y5_OSCE_RUMINANT } from './questions-y5-osce-ruminant.js';
import { QB_Y5_SWINE_CLINIC } from './questions-y5-swine-clinic.js';
import { QB_Y5_REPRO_CLINIC } from './questions-y5-repro-clinic.js';
import { QB_Y5_OSCE_MED } from './questions-y5-osce-med.js';
import { QB_Y5_VISION_BATCH } from './questions-y5-vision-batch.js';

// All questions combined
export const QB = [
  ...QB1, ...QB_PART2, ...QB_PART3,
  ...QB_COM5, ...QB_COM3, ...QB_COM3_SPECIAL, ...QB_COM4,
  ...QB_ENGPROF, ...QB_EXOTIC, ...QB_POULTRY,
  ...QB_REPRO_LECT, ...QB_PRACTRUM, ...QB_CLIAPPRUM,
  ...QB_SHORT, ...QB_MAHAHON, ...QB_TERMPAPER, ...QB_VCA,
  // Y5
  ...QB_Y5_FINAL_MIXED, ...QB_Y5_PATHO, ...QB_Y5_OSCE_RUMINANT,
  ...QB_Y5_SWINE_CLINIC, ...QB_Y5_REPRO_CLINIC, ...QB_Y5_OSCE_MED,
  ...QB_Y5_VISION_BATCH,
];

// Re-export for convenience
export { SUBJECTS } from './curriculum.js';
