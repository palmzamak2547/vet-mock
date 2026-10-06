import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const cli = require.resolve('@playwright/test/cli');
const testModule = pathToFileURL(path.join(path.dirname(require.resolve('@playwright/test/package.json')), 'index.mjs')).href;
const gateScript = fileURLToPath(new URL('../../scripts/gate.mjs', import.meta.url));
const shellEnv = () => {
  const env = { ...process.env, FORCE_COLOR: '0' };
  for (const name of ['NODE_TEST_CONTEXT', 'PLAYWRIGHT_OUTPUT_DIR', 'PLAYWRIGHT_BASE_URL', 'PLAYWRIGHT_PORT']) delete env[name];
  return env;
};
function fixture() {
  const parent = fs.realpathSync(os.tmpdir());
  const dir = fs.mkdtempSync(path.join(parent, 'vetmock-gate-native-'));
  const owned = fs.realpathSync(dir);
  const put = (name, content) => { const file = path.join(dir, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); };
  put('package.json', JSON.stringify({ type: 'module', scripts: {
    'lint:data': 'node ok.mjs', 'lint:dist': 'node ok.mjs', build: 'node ok.mjs',
    'test:unit': 'node --test unit/*.test.mjs',
    'test:e2e:chromium': 'node native-run.mjs chromium', 'test:e2e:gl': 'node native-run.mjs gl',
  } }));
  put('.gitignore', 'test-results/\n'); put('ok.mjs', 'console.log("fixture step");');
  put('unit/pass.test.mjs', 'import test from "node:test"; test("fixture unit", () => {});');
  put('playwright.config.mjs', `export default { testDir: './native', workers: 1, retries: 0, forbidOnly: true,
    preserveOutput: 'always', reporter: 'line', outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR || 'test-results' };`);
  put('native-run.mjs', `import { spawnSync } from 'node:child_process'; import path from 'node:path';
    const phase = process.argv[2], selected = process.env.PLAYWRIGHT_OUTPUT_DIR || 'test-results';
    const target = path.resolve(process.cwd(), selected), relative = path.relative(process.cwd(), target);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('fixture output escaped its directory');
    console.log('NATIVE ' + phase + ' out=' + selected + ' port=' + (process.env.PLAYWRIGHT_PORT || '-'));
    const env = { ...process.env }; delete env.NODE_TEST_CONTEXT;
    const result = spawnSync(process.execPath, [${JSON.stringify(cli)}, 'test', '-c', 'playwright.config.mjs', phase + '.spec.mjs'],
      { cwd: process.cwd(), env, encoding: 'utf8', windowsHide: true });
    process.stdout.write(result.stdout || ''); process.stderr.write(result.stderr || ''); process.exitCode = result.status ?? 1;`);
  for (const phase of ['chromium', 'gl']) put(`native/${phase}.spec.mjs`, `import { test, expect } from ${JSON.stringify(testModule)};
    import fs from 'node:fs'; import path from 'node:path';
    test('${phase} native failure evidence', async ({}, info) => {
      const artifact = info.outputPath('${phase}-evidence.txt');
      fs.mkdirSync(path.dirname(artifact), { recursive: true }); fs.writeFileSync(artifact, '${phase} failure evidence');
      await info.attach('${phase}-evidence', { path: artifact, contentType: 'text/plain' });
      expect('intentional fixture failure').toBe('not a browser or application failure');
    });`);
  const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });
  git('init', '-q'); git('config', 'user.email', 'gate@example.invalid'); git('config', 'user.name', 'gate'); git('config', 'core.autocrlf', 'false');
  git('add', 'package.json', '.gitignore', 'ok.mjs', 'unit/pass.test.mjs', 'playwright.config.mjs', 'native-run.mjs', 'native/chromium.spec.mjs', 'native/gl.spec.mjs');
  git('commit', '-q', '-m', 'Fixture native runner evidence');
  return { dir,
    run(script, args = [], env = {}) {
      const result = spawnSync(process.execPath, [script, ...args], { cwd: dir, env: { ...shellEnv(), ...env }, encoding: 'utf8', windowsHide: true, timeout: 60000 });
      assert.equal(result.error, undefined, result.error?.message);
      return { status: result.status, output: `${result.stdout || ''}${result.stderr || ''}` };
    },
    done() {
      const target = fs.realpathSync(dir);
      assert.equal(target, owned, 'only the explicitly created fixture directory may be removed');
      assert.equal(path.dirname(target), parent); assert.ok(path.basename(target).startsWith('vetmock-gate-native-'));
      fs.rmSync(target, { recursive: true, force: true });
    },
  };
}
function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name); return entry.isDirectory() ? files(file) : [file];
  });
}
const evidence = (dir, phase) => files(dir).filter(file => path.basename(file) === `${phase}-evidence.txt`);
const attachments = (dir, phase) => files(dir).filter(file => path.basename(path.dirname(file)) === 'attachments'
  && path.basename(file).startsWith(`${phase}-evidence-`) && file.endsWith('.txt'));

test('the installed native runner really removes an earlier invocation attachment in a shared output directory', () => {
  const f = fixture();
  try {
    const env = { PLAYWRIGHT_OUTPUT_DIR: 'test-results/shared' };
    const first = f.run('native-run.mjs', ['chromium'], env);
    assert.equal(first.status, 1, first.output);
    const [artifact] = evidence(path.join(f.dir, 'test-results/shared'), 'chromium');
    const [attached] = attachments(path.join(f.dir, 'test-results/shared'), 'chromium');
    assert.ok(artifact, first.output); assert.equal(fs.readFileSync(artifact, 'utf8'), 'chromium failure evidence');
    assert.ok(attached, first.output); assert.equal(fs.readFileSync(attached, 'utf8'), 'chromium failure evidence');
    const second = f.run('native-run.mjs', ['gl'], env);
    assert.equal(second.status, 1, second.output);
    assert.equal(fs.existsSync(artifact), false, 'the real runner startup cleaned the shared directory');
    assert.equal(fs.existsSync(attached), false, 'the runner also removed the reported attachment copy');
    assert.equal(evidence(path.join(f.dir, 'test-results/shared'), 'gl').length, 1);
  } finally { f.done(); }
});

test('the actual serial gate preserves both native runner failure attachments in stable phase directories', () => {
  const f = fixture();
  try {
    // All earlier phases are tiny fixture commands. Native tests request no
    // page/context/browser fixture and start no web server or application gate.
    const run = f.run(gateScript);
    assert.equal(run.status, 1, run.output);
    assert.match(run.output, /failed: test:e2e:chromium, test:e2e:gl/);
    const all = path.join(f.dir, 'test-results');
    const [chromium] = evidence(all, 'chromium'), [gl] = evidence(all, 'gl');
    const [chromiumAttached] = attachments(all, 'chromium'), [glAttached] = attachments(all, 'gl');
    assert.ok(chromium, 'GL startup deleted the preceding Chromium failure attachment');
    assert.ok(gl, run.output);
    assert.ok(chromiumAttached && glAttached, 'both reported attachment copies survive');
    assert.ok(chromium.startsWith(path.join(all, 'chromium') + path.sep));
    assert.ok(gl.startsWith(path.join(all, 'gl') + path.sep));
    assert.equal(fs.readFileSync(chromium, 'utf8'), 'chromium failure evidence');
    assert.equal(fs.readFileSync(gl, 'utf8'), 'gl failure evidence');
    assert.equal(fs.readFileSync(chromiumAttached, 'utf8'), 'chromium failure evidence');
    assert.equal(fs.readFileSync(glAttached, 'utf8'), 'gl failure evidence');
    assert.match(run.output, /NATIVE chromium out=test-results\/chromium port=-/);
    assert.match(run.output, /NATIVE gl out=test-results\/gl port=-/);
    assert.ok(run.output.indexOf('NATIVE chromium') < run.output.indexOf('NATIVE gl'));
  } finally { f.done(); }
});
