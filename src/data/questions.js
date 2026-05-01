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

// All questions combined
export const QB = [...QB1, ...QB_PART2, ...QB_PART3, ...QB_COM5, ...QB_COM3, ...QB_COM3_SPECIAL, ...QB_COM4, ...QB_ENGPROF, ...QB_EXOTIC, ...QB_POULTRY, ...QB_REPRO_LECT];

// Re-export for convenience
export { SUBJECTS } from './curriculum.js';
