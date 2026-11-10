// Every decision in the registry (src/lib/decide.js). A screen imports only
// the decision it uses, so its rules load with it; tests and docs read them
// all through here. A new decision is one more file and one more line.
export { PRACTICE_SETUP } from './practice-setup.js';
export { SR_SETUP } from './sr-setup.js';
export { PHASE_FIRST_RUN } from './phase-first-run.js';
export { HOME_MODE } from './home-mode.js';
