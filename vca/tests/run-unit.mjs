// Runs the unit tests in a fixed time zone: Asia/Bangkok by default, where the students are,
// or the one given (npm run test:utc passes UTC). Calendar-day rules (streaks, the exam date,
// the countdown) must hold in both.
import { spawnSync } from 'node:child_process';

const tz = process.argv[2] || 'Asia/Bangkok';
const run = spawnSync(process.execPath, ['--import', './tests/register-alias.mjs', '--test', 'tests/unit/*.test.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, TZ: tz },
});
process.exit(run.status ?? 1);
