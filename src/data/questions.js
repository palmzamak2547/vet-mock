import { QB as QB1 } from './questions-part1.js';
import { QB_PART2 } from './questions-part2.js';
import { QB_PART3 } from './questions-part3.js';
import { QB_COM5 } from './questions-com5.js';

// All questions combined
export const QB = [...QB1, ...QB_PART2, ...QB_PART3, ...QB_COM5];

// Re-export for convenience
export { SUBJECTS } from './curriculum.js';
