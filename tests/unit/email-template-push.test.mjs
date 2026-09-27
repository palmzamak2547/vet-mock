// scripts/push-auth-emails.mjs sends the repo's auth email templates to
// Supabase. It must send only the mailer fields (never site_url, SMTP or a
// provider setting), keep the token each template needs, and refuse a
// template or subject carrying a middle dot or an em dash.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuthEmailPatch, TEMPLATES } from '../../scripts/push-auth-emails.mjs';

test('the push sends only the five templates and their subjects', () => {
  const body = buildAuthEmailPatch();
  const expected = Object.keys(TEMPLATES).flatMap((key) => [
    `mailer_templates_${key}_content`, `mailer_subjects_${key}`,
  ]).sort();
  assert.deepEqual(Object.keys(body).sort(), expected);
});

test('every template keeps the token that makes its email work, and no separator glyphs', () => {
  const body = buildAuthEmailPatch();
  for (const [key, { tokens }] of Object.entries(TEMPLATES)) {
    const html = body[`mailer_templates_${key}_content`];
    for (const token of tokens) assert.ok(html.includes(token), `${key} lost ${token}`);
    assert.doesNotMatch(html, /[·—]/, `${key} template`);
    assert.doesNotMatch(body[`mailer_subjects_${key}`], /[·—]/, `${key} subject`);
  }
});
