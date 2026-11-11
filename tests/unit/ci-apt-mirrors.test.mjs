// scripts/ci-apt-mirrors.sh chooses which Ubuntu mirror apt starts from on a GitHub runner. Each of the
// two mirrors has taken the release gate down once (22 Oct and 11 Nov 2026), so the choice is tested
// here against a pretend mirror list, and a release-gate workflow that calls apt without the script fails.
import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = path.join(ROOT, 'scripts/ci-apt-mirrors.sh');
const AZURE = 'http://azure.archive.ubuntu.com/ubuntu/';
const ARCHIVE = 'https://archive.ubuntu.com/ubuntu/';
const SECURITY = 'https://security.ubuntu.com/ubuntu/';
const KERNEL = 'https://mirrors.edge.kernel.org/ubuntu/';
const MIT = 'https://mirrors.mit.edu/ubuntu/';
const RUNNER_LIST = `${AZURE}\tpriority:1\n${ARCHIVE}\tpriority:2\n${SECURITY}\tpriority:3\n`;

// The script runs on the Linux runner. On a Windows checkout `bash` may be another system's shell,
// so the choice is exercised where it really runs; the static checks below run everywhere.
const onRunner = { skip: process.platform === 'win32' ? 'the script runs on the Linux runner' : false };

function order(list, alive) {
  const file = path.join(mkdtempSync(path.join(tmpdir(), 'apt-mirrors-')), 'apt-mirrors.txt');
  writeFileSync(file, list);
  const out = execFileSync('bash', [SCRIPT, '1', '--order-only'], {
    encoding: 'utf8',
    env: { ...process.env, APT_MIRRORS_FILE: file, APT_SUDO: '', APT_MIRRORS_ALIVE: alive.join(' ') },
  });
  const text = readFileSync(file, 'utf8');
  const priority = Object.fromEntries(text.trim().split('\n').map((line) => {
    const [url, p] = line.split('\t');
    return [url, Number(String(p).replace('priority:', ''))];
  }));
  return { out, text, priority };
}

test('both mirrors answer: the public archive goes first, Azure stays as the fallback', onRunner, () => {
  const { priority } = order(RUNNER_LIST, [ARCHIVE, AZURE]);
  assert.deepEqual(priority, { [SECURITY]: 3, [ARCHIVE]: 1, [AZURE]: 9 });
});

test('the public archive is down (11 Nov): apt starts from Azure and keeps the archive as the fallback', onRunner, () => {
  const { priority } = order(RUNNER_LIST, [AZURE]);
  assert.deepEqual(priority, { [SECURITY]: 3, [AZURE]: 1, [ARCHIVE]: 9 });
});

test('Azure is slow or down (22 Oct): apt starts from the public archive', onRunner, () => {
  const { priority } = order(RUNNER_LIST, [ARCHIVE]);
  assert.deepEqual(priority, { [SECURITY]: 3, [ARCHIVE]: 1, [AZURE]: 9 });
});

test('no ubuntu.com name answers (11 Nov): apt uses only the outside mirrors that do, and the log says so', onRunner, () => {
  const { text, out } = order(RUNNER_LIST, [KERNEL, MIT]);
  assert.equal(text, `${KERNEL}\tpriority:1\n${MIT}\tpriority:9\n`);
  assert.match(out, /::warning::no ubuntu\.com mirror answers on this runner/);
  assert.equal(order(RUNNER_LIST, [MIT]).text, `${MIT}\tpriority:1\n`, 'a dead outside mirror is not listed either');
});

test('an outside mirror is never used while a ubuntu.com mirror answers', onRunner, () => {
  const { text } = order(RUNNER_LIST, [AZURE, KERNEL, MIT]);
  assert.doesNotMatch(text, /kernel\.org|mit\.edu/);
});

test('nothing answers the probe: the runner\'s two stay listed, and the log says so', onRunner, () => {
  const { priority, out } = order(RUNNER_LIST, []);
  assert.deepEqual(priority, { [SECURITY]: 3, [ARCHIVE]: 1, [AZURE]: 9 });
  assert.match(out, /::warning::no Ubuntu mirror answered the probe/);
});

test('a mirror list the script does not recognise is left exactly as it was', onRunner, () => {
  const ports = 'http://ports.ubuntu.com/ubuntu-ports/\tpriority:1\n';
  assert.equal(order(ports, []).text, ports);
  const one = `${ARCHIVE}\tpriority:1\n`;
  assert.equal(order(one, [ARCHIVE]).text, one);
});

test('the script is checked out with Unix line ends, or bash on the runner cannot read it', () => {
  assert.doesNotMatch(readFileSync(SCRIPT, 'utf8'), /\r/);
  assert.match(readFileSync(path.join(ROOT, '.gitattributes'), 'utf8'), /^\*\.sh text eol=lf$/m);
});

test('every apt call of a release-gate workflow goes through the script', () => {
  // The five workflows whose checks a pull request waits for. android.yml installs ffmpeg with apt too,
  // but it builds the app wrapper by hand and gates nothing.
  const gate = ['build.yml', 'smoke-e2e.yml', 'vca.yml', 'ai.yml', 'research-r-parity.yml'];
  const bare = [];
  for (const name of gate) {
    const lines = readFileSync(path.join(ROOT, '.github/workflows', name), 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (/^\s*#/.test(line)) return;
      if (/\bapt(-get)?\s+(install|update)\b|playwright install(-deps| --with-deps)/.test(line) && !line.includes('scripts/ci-apt-mirrors.sh')) {
        bare.push(`${name}:${i + 1}: ${line.trim()}`);
      }
    });
  }
  assert.deepEqual(bare, [], 'these lines ask apt directly: run them as `bash scripts/ci-apt-mirrors.sh <seconds> <command>`');
  const uses = gate.flatMap((name) => readFileSync(path.join(ROOT, '.github/workflows', name), 'utf8').match(/ci-apt-mirrors\.sh \d+ /g) || []);
  assert.ok(uses.length >= 3, `the script is called ${uses.length} times; Build and both e2e steps should call it`);
});
