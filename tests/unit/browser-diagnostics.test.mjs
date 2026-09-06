import test from 'node:test';
import assert from 'node:assert/strict';
import { isCacheShutdownDiagnostic } from '../helpers/browser-diagnostics.mjs';

test('only native WebKit cache shutdown during reload is a diagnostic', () => {
  const native = { name: 'Cache API operation failed', message: 'Context is stopped', stack: '' };
  assert.equal(isCacheShutdownDiagnostic(native, 'webkit', true), true);
  assert.equal(isCacheShutdownDiagnostic(native, 'webkit', false), false);
  assert.equal(isCacheShutdownDiagnostic(native, 'firefox', true), false);
  assert.equal(isCacheShutdownDiagnostic(new Error('Context is stopped'), 'webkit', true), false);
  assert.equal(isCacheShutdownDiagnostic({ ...native, stack: 'at app.js:1' }, 'webkit', true), false);
  assert.equal(isCacheShutdownDiagnostic({ ...native, message: 'Failed writing data from the file system' }, 'webkit', true), false);
});
