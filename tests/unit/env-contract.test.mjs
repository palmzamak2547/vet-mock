// The environment contract (OPS-1): scripts/lib/env-list.mjs names every
// variable the code reads and nothing else; .env.example holds names only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { namesIn } from '../../scripts/lib/env-scan.mjs';
import { contract, renderExample } from '../../scripts/env-contract.mjs';
import { ENV } from '../../scripts/lib/env-list.mjs';

test('reads are found in every form the code uses; writes and comments are not reads', () => {
  const names = namesIn([
    "const a = process.env.ALPHA_KEY;",
    "const b = process.env['BETA_URL'];",
    "const c = import.meta.env?.VITE_GAMMA;",
    "const d = Deno.env.get('DELTA_ID');",
    "function f(env = process.env) { return env.EPSILON_TOKEN || env?.ZETA; }",
    "const { ETA_KEY: eta, THETA } = process.env;",
    "process.env.WRITTEN_ONLY = 'x';",
    "delete process.env.DELETED_ONLY;",
    "// process.env.IN_A_COMMENT",
    "if (process.env.COMPARED === '1') {}",
  ].join('\n'));
  assert.deepEqual([...names].sort(), ['ALPHA_KEY', 'BETA_URL', 'COMPARED', 'DELTA_ID', 'EPSILON_TOKEN', 'ETA_KEY', 'THETA', 'VITE_GAMMA', 'ZETA']);
  assert.deepEqual([...namesIn("x = os.environ.get('PY_ONE'); y = os.getenv('PY_TWO')")].sort(), ['PY_ONE', 'PY_TWO']);
});

test('the list and the code agree, and the generated files are current', () => {
  const { problems } = contract();
  assert.deepEqual(problems, []);
  assert.equal(fs.readFileSync('.env.example', 'utf8').replace(/\r\n/g, '\n'), renderExample());
});

test('.env.example holds names and comments only, never a value', () => {
  for (const line of fs.readFileSync('.env.example', 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    assert.match(line, /^[A-Z][A-Z0-9_]*=$/, line.replace(/=.*/, '=<value>'));
  }
  assert.ok(ENV.every((e) => e.does && ['required', 'optional'].includes(e.need)));
});

test('lint:env runs in lint:data', () => {
  const { scripts } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(scripts['lint:env'], 'node scripts/env-contract.mjs --check');
  assert.ok(scripts['lint:data'].split(' && ').includes('npm run lint:env'));
});
