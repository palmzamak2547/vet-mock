// Loader for the generated difficulty snapshot. The map can grow to thousands
// of entries, so it is dynamic-imported (its own Vite chunk) and only fetched
// when an adaptive surface actually needs it — never on cold boot.

import { questionDifficulty } from './elo.js';

let cache = null;

export async function loadQuestionDifficulty() {
  if (!cache) {
    const mod = await import('../data/question-difficulty.generated.js');
    cache = mod.QUESTION_DIFFICULTY;
  }
  return cache;
}

// Binds the ladder in elo.js to the loaded snapshot. Returns a function the
// selection code can call per question without knowing where ratings live.
export async function loadDifficultyResolver() {
  const data = await loadQuestionDifficulty();
  return (question) => questionDifficulty(question, data);
}
