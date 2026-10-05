import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('signup never starts a second blind data writer beside the owner-scoped store', () => {
  const auth = readFileSync(new URL('../../src/views/AuthView.jsx', import.meta.url), 'utf8');
  const sdk = readFileSync(new URL('../../src/lib/supabase.js', import.meta.url), 'utf8');
  assert.equal(auth.includes('migrateLocalToCloud'), false);
  assert.equal(sdk.includes('migrateLocalToCloud'), false);
  assert.equal(auth.includes(".from('user_data')"), false);
});
