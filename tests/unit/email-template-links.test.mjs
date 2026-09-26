// ============================================================
// email-template-links — every link in an auth email opens its page
// ============================================================
// B75 (bug hunt 2026-09-26). The "wasn't you?" warning in the reset-password
// and change-email templates linked to /?view=account-settings, and every
// footer linked to /?view=feedback or /?view=about. The app reads ?view=
// only for 'landing' (App.jsx initialView), so all of them opened Home or the
// year picker: the security call to action never reached Account settings.
// Links now use the app's real paths (src/lib/view-route.js).
//
// The templates are pasted into the Supabase dashboard by hand
// (supabase/email-templates/README.md), so a change here reaches students
// only after that paste.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { viewForAppPath } from '../../src/lib/view-route.js';

const DIR = new URL('../../supabase/email-templates/', import.meta.url);
const templates = readdirSync(DIR).filter((f) => f.endsWith('.html'));

test('every VetMock link in the auth emails lands on a real app page', () => {
  assert.ok(templates.length >= 5);
  let checked = 0;
  for (const file of templates) {
    const html = readFileSync(new URL(file, DIR), 'utf8');
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (href.includes('{{')) continue; // the Supabase confirmation link
      const url = new URL(href);
      if (url.hostname !== 'vetmock.vercel.app') continue;
      checked++;
      assert.equal(url.search, '', `${file}: ${href} relies on a ?view= the app ignores`);
      if (url.pathname !== '/') assert.ok(viewForAppPath(url.pathname), `${file}: ${href} is not an app page`);
    }
  }
  assert.ok(checked >= 10, 'the templates were read');
});

test('the security warnings open Account settings', () => {
  for (const file of ['03-reset-password.html', '04-change-email.html']) {
    const html = readFileSync(new URL(file, DIR), 'utf8');
    assert.match(html, /href="https:\/\/vetmock\.vercel\.app\/app\/account"/, file);
  }
});
