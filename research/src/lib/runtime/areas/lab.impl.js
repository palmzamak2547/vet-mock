// Implementations of the lab area's methods, for registry.js [M2-DESIGN.md 2]. `module` is the path under
// src/lib/ (the registry test reads it to check the function has left its stub). A method ships only
// when its id is also in lab.registered.js. OWNER: lab role.
import { runAnovaTwoWay } from '../../stats/anova2.js';
import { runAnovaRepeated } from '../../stats/anovarm.js';
import { runFriedman } from '../../stats/friedman.js';
import { runDunn, runDunnett, runGamesHowell } from '../../stats/posthoc.js';
import { runBrownForsythe, runShapiro } from '../../stats/normality.js';
import { runPowerAnova, runPowerCorrelation, runPowerRegression, runPowerTTest } from '../../stats/power.js';

/** @type {Record<string, { impl: import('../registry.js').MethodImpl, module: string, fn: string }>} */
export default {
  'anova.twoWay': { impl: runAnovaTwoWay, module: 'stats/anova2.js', fn: 'runAnovaTwoWay' },
  'anova.repeated': { impl: runAnovaRepeated, module: 'stats/anovarm.js', fn: 'runAnovaRepeated' },
  'test.friedman': { impl: runFriedman, module: 'stats/friedman.js', fn: 'runFriedman' },
  'posthoc.dunn': { impl: runDunn, module: 'stats/posthoc.js', fn: 'runDunn' },
  'posthoc.gamesHowell': { impl: runGamesHowell, module: 'stats/posthoc.js', fn: 'runGamesHowell' },
  'posthoc.dunnett': { impl: runDunnett, module: 'stats/posthoc.js', fn: 'runDunnett' },
  'diag.shapiro': { impl: runShapiro, module: 'stats/normality.js', fn: 'runShapiro' },
  'diag.brownForsythe': { impl: runBrownForsythe, module: 'stats/normality.js', fn: 'runBrownForsythe' },
  'power.anova': { impl: runPowerAnova, module: 'stats/power.js', fn: 'runPowerAnova' },
  'power.tTest': { impl: runPowerTTest, module: 'stats/power.js', fn: 'runPowerTTest' },
  'power.correlation': { impl: runPowerCorrelation, module: 'stats/power.js', fn: 'runPowerCorrelation' },
  'power.regression': { impl: runPowerRegression, module: 'stats/power.js', fn: 'runPowerRegression' },
};
