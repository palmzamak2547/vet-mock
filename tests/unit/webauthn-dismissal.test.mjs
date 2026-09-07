import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isWebAuthnDismissal, thaiAuthError } from '../../src/lib/auth-errors.js';

// auth-js 2.115 wraps the browser's DOMException before it reaches the views:
// `code` becomes a passthrough marker while the original name survives on
// `name` and `cause`. This is the exact shape a dismissed prompt produces.
function wrapped(name, message, code = 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY') {
  const cause = Object.assign(new Error(message), { name });
  const err = new Error(message, { cause });
  err.name = name;
  err.code = code;
  return err;
}

const NOT_ALLOWED = 'The operation either timed out or was not allowed. See: https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client.';

test('a dismissed prompt or a device without a passkey is not a sign-in failure', () => {
  assert.equal(isWebAuthnDismissal(wrapped('NotAllowedError', NOT_ALLOWED)), true);
  assert.equal(isWebAuthnDismissal(wrapped('AbortError', 'Authentication ceremony was sent an abort signal', 'ERROR_CEREMONY_ABORTED')), true);
  // Name lost, cause kept — still a dismissal.
  const causeOnly = Object.assign(new Error(NOT_ALLOWED), {
    code: 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY',
    cause: Object.assign(new Error(NOT_ALLOWED), { name: 'NotAllowedError' }),
  });
  assert.equal(isWebAuthnDismissal(causeOnly), true);
  // The raw DOMException shape, in case a future SDK stops wrapping it.
  assert.equal(isWebAuthnDismissal({ name: 'NotAllowedError', message: NOT_ALLOWED }), true);
});

test('server passkey outcomes and ordinary failures keep their own messages', () => {
  assert.equal(isWebAuthnDismissal({ code: 'webauthn_credential_not_found', message: 'unknown credential' }), false);
  assert.equal(isWebAuthnDismissal({ code: 'webauthn_credential_exists', message: 'already registered' }), false);
  assert.equal(isWebAuthnDismissal(new Error('PASSKEY_UNSUPPORTED')), false);
  assert.equal(isWebAuthnDismissal(new Error('Failed to fetch')), false);
  assert.equal(isWebAuthnDismissal(null), false);
  assert.match(thaiAuthError(new Error('Failed to fetch')), /เครือข่าย/);
});

test('both passkey handlers route dismissals through the shared check', () => {
  for (const file of ['../../src/views/AuthView.jsx', '../../src/views/AccountSettingsView.jsx']) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    assert.ok(source.includes('isWebAuthnDismissal(err)'), `${file} uses the shared check`);
    assert.ok(!/\/NotAllowedError\|AbortError\|cancel\/i/.test(source), `${file} no longer tests code||name inline`);
  }
});
