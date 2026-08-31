import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflowPaths = [
  '../../.github/workflows/build.yml',
  '../../.github/workflows/lint-questions.yml',
  '../../.github/workflows/smoke-e2e.yml',
];
const workflows = workflowPaths
  .map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'))
  .join('\n');

const minimumMajor = {
  checkout: 7,
  'setup-node': 7,
  cache: 6,
  'upload-artifact': 7,
};

test('JavaScript workflow actions carry their own Node 24 runtime', () => {
  assert.doesNotMatch(workflows, /FORCE_JAVASCRIPT_ACTIONS_TO_NODE24/);

  for (const [action, minimum] of Object.entries(minimumMajor)) {
    const refs = [...workflows.matchAll(new RegExp(`actions/${action}@v(\\d+)`, 'g'))];
    assert.ok(refs.length > 0, `expected at least one actions/${action} reference`);
    for (const ref of refs) {
      assert.ok(Number(ref[1]) >= minimum, `${ref[0]} must be v${minimum} or newer`);
    }
  }
});
