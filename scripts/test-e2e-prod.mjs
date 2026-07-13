import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Keep the production smoke command portable. Inline `FOO=bar command`
// assignments work in POSIX shells but fail in PowerShell/cmd.exe.
const playwrightCli = fileURLToPath(
  new URL('../node_modules/@playwright/test/cli.js', import.meta.url),
);

const result = spawnSync(
  process.execPath,
  [playwrightCli, 'test', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: 'https://vetmock.vercel.app',
    },
  },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
