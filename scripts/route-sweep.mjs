#!/usr/bin/env node
// npm run test:e2e:sweep [-- <playwright arguments>]
//
// Runs tests/e2e/route-sweep.spec.js, which the default e2e run leaves out (playwright.config.js),
// against the built bundle (`npm run build` first). With no --project it runs chromium-mobile and
// webkit-mobile, the two phone engines; pass --project=<name> to choose. The environment variable
// is set here rather than in package.json, where an env prefix would not work under cmd.exe.
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const projects = args.some((a) => a.startsWith('--project')) ? [] : ['--project=chromium-mobile', '--project=webkit-mobile'];
const result = spawnSync('npx', ['playwright', 'test', 'tests/e2e/route-sweep.spec.js', ...projects, ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, VMX_ROUTE_SWEEP: '1' },
});
process.exit(result.status ?? 1);
