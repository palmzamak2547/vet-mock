// Google's redirect brings a student back to the address they were on, query
// and all (7 Nov 2026): it kept only the path, so a VetMock AI link to a deck
// at page N reached the Chula wall and, after sign-in, an empty reader.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../src/lib/supabase.js', import.meta.url), 'utf8');
// The module itself needs Vite's import.meta.env; the helper's own body runs here.
const body = source.match(/export function returnAddress\(href = window\.location\.href\) \{([\s\S]*?)\n\}/)?.[1];
const returnAddress = new Function('href', body);

test('the return address keeps the deck and its page, and leaves the open ticket out of the sign-in', () => {
  assert.equal(
    returnAddress('https://vetmock.com/app/tools/pdf?doc=rabies-com5&page=12&vt=abc&ve=1900000000'),
    'https://vetmock.com/app/tools/pdf?doc=rabies-com5&page=12',
  );
  const thai = 'https://vetmock.com/app/tools/pdf?doc=fiqc-ml-acfs-1-%E0%B8%81%E0%B8%B2%E0%B8%A3-2a322b&page=3';
  assert.equal(returnAddress(thai), thai, 'a Thai slug comes back as it left');
});

test('it drops what an earlier sign-in left, which the wall would read again', () => {
  assert.equal(
    returnAddress('https://vetmock.com/app/tools/pdf?doc=deck&error=access_denied&error_code=bad_oauth&error_description=x&code=c1&state=s#access_token=t'),
    'https://vetmock.com/app/tools/pdf?doc=deck',
  );
  assert.equal(returnAddress('https://vetmock.com/app/home?code=c1'), 'https://vetmock.com/app/home');
});

test('both of the wall\'s Google buttons come back to the address', () => {
  assert.match(source, /hd\s*\?\s*\{ redirectTo: returnAddress\(\),/);
  assert.match(source, /redirectTo: back \? returnAddress\(\) : window\.location\.origin/);
  const gate = readFileSync(new URL('../../src/views/ChulaGateView.jsx', import.meta.url), 'utf8');
  assert.match(gate, /signInWithGoogle\(\{ back: true \}\)/);
});
