import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { safeImageUrl, safeLinkUrl } from '../../src/lib/safe-url.js';
import {
  ANON_TAGS,
  isAnonymizedTagName,
} from '../../src/lib/dicom/anonymizer.js';
import { csvCell } from '../../src/lib/dicom/export-attempts.js';
import { decodeQuizSet, encodeQuizSet } from '../../src/lib/share-link.js';
import { headerText } from '../../api/send-feedback.js';
import {
  isAllowedAppOrigin,
  resolveAppRedirect,
} from '../../supabase/functions/_shared/app-origins.js';
import { clientIP } from '../../api/_lib/rate-limit.js';

test('shared images accept VetMock storage but reject attacker-owned Supabase projects', () => {
  const official = 'https://mpovsdzdggvksmeehqfj.supabase.co/storage/v1/object/public/q/a.webp';
  const attacker = 'https://attacker-project.supabase.co/storage/v1/object/public/track/pixel.gif';

  assert.equal(safeImageUrl(official), official);
  assert.equal(safeImageUrl(attacker), null);
  assert.equal(safeImageUrl('javascript:alert(1)'), null);
  assert.equal(safeImageUrl('http://i.imgur.com/insecure.png'), null);
});

test('rendered links allow HTTPS and same-origin targets only', () => {
  assert.equal(safeLinkUrl('/app/notes'), '/app/notes');
  assert.equal(safeLinkUrl('#section-2'), '#section-2');
  assert.equal(safeLinkUrl('https://pubmed.ncbi.nlm.nih.gov/123/'), 'https://pubmed.ncbi.nlm.nih.gov/123/');

  assert.equal(safeLinkUrl('javascript:alert(1)'), null);
  assert.equal(safeLinkUrl('data:text/html,<script>alert(1)</script>'), null);
  assert.equal(safeLinkUrl('http://example.com'), null);
  assert.equal(safeLinkUrl('//evil.example/path'), null);
  assert.equal(safeLinkUrl('https://user:pass@example.com/path'), null);
});

test('LINE auth redirects stay on production, approved previews, or local development', () => {
  assert.equal(isAllowedAppOrigin('https://vetmock.vercel.app'), true);
  assert.equal(
    isAllowedAppOrigin('https://vetmock-fix-123-palmzamak2547s-projects.vercel.app'),
    true,
  );
  assert.equal(isAllowedAppOrigin('https://vetmock.vercel.app.evil.example'), false);

  assert.equal(
    resolveAppRedirect('https://vetmock.vercel.app/app/home?from=line', null),
    'https://vetmock.vercel.app/app/home?from=line',
  );
  assert.equal(
    resolveAppRedirect('https://evil.example/steal', 'https://vetmock.vercel.app'),
    'https://vetmock.vercel.app',
  );
  assert.equal(
    resolveAppRedirect('https://vetmock.vercel.app@evil.example/steal', null),
    'https://vetmock.vercel.app',
  );
  assert.equal(
    resolveAppRedirect('http://localhost:5173/app/home', null),
    'http://localhost:5173/app/home',
  );
});

test('rate limits prefer Vercel-owned client IP metadata', () => {
  const req = {
    headers: {
      'x-vercel-forwarded-for': '203.0.113.9',
      'x-forwarded-for': '198.51.100.4, 203.0.113.9',
      'x-real-ip': '192.0.2.8',
    },
    socket: { remoteAddress: '127.0.0.1' },
  };
  assert.equal(clientIP(req), '203.0.113.9');
  assert.equal(clientIP({ headers: { 'x-forwarded-for': '198.51.100.4, 203.0.113.9' } }), '198.51.100.4');
  assert.equal(clientIP({ headers: {} }), 'unknown');
});

test('DICOM owner contact tags are stripped and inspector warnings share that source', () => {
  const byTag = new Map(ANON_TAGS.map((entry) => [entry.tag, entry.label]));
  assert.equal(byTag.size, ANON_TAGS.length, 'anonymizer tag ids must be unique');
  assert.equal(byTag.get('x00101040'), 'PatientAddress');
  assert.equal(byTag.get('x00102154'), 'PatientTelephoneNumbers');
  assert.equal(byTag.get('x00102155'), 'PatientTelecomInformation');
  assert.equal(byTag.get('x00102297'), 'ResponsiblePerson');
  assert.equal(byTag.get('x00102299'), 'ResponsibleOrganization');
  assert.equal(isAnonymizedTagName('ResponsiblePerson'), true);
  assert.equal(isAnonymizedTagName('PixelData'), false);
});

test('Imaging CSV export neutralizes spreadsheet formulas without changing numbers', () => {
  assert.equal(
    csvCell('=HYPERLINK("https://evil.example")'),
    '"\'=HYPERLINK(""https://evil.example"")"',
  );
  assert.equal(csvCell('+cmd'), "'+cmd");
  assert.equal(csvCell(' @SUM(A1:A2)'), "' @SUM(A1:A2)");
  assert.equal(csvCell(-12.5), '-12.5');
  assert.equal(csvCell('ordinary note'), 'ordinary note');
});

test('shared quiz URLs reject oversized and malformed payloads before use', () => {
  const valid = encodeQuizSet([{ subject: 'com5', id: 123 }]);
  assert.deepEqual(decodeQuizSet(valid), [{ subject: 'com5', id: 123 }]);
  assert.deepEqual(decodeQuizSet('A'.repeat(32_001)), []);
  assert.deepEqual(decodeQuizSet('not+base64'), []);

  const malformedId = btoa(JSON.stringify([{ s: 'com5', i: 'not-a-number' }]))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  assert.deepEqual(decodeQuizSet(malformedId), []);
});

test('feedback email subject fields cannot inject new mail headers', () => {
  assert.equal(headerText('Bug\r\nBcc: attacker@example.com', 50), 'Bug Bcc: attacker@example.com');
  assert.equal(headerText('  Feedback  ', 50), 'Feedback');
});

test('database hardening migration closes the verified public data paths', () => {
  const migrationName = readdirSync(resolve('supabase/migrations'))
    .find((name) => name.endsWith('_harden_public_data_and_group_invites.sql'));
  assert.ok(migrationName, 'hardening migration must exist');
  const sql = readFileSync(resolve('supabase/migrations', migrationName), 'utf8');
  const migrationCorpus = readdirSync(resolve('supabase/migrations'))
    .filter((name) => /^20260824.*\.sql$/.test(name))
    .map((name) => readFileSync(resolve('supabase/migrations', name), 'utf8'))
    .join('\n');

  assert.match(sql, /revoke select on table public\.profiles from anon, authenticated/i);
  assert.match(sql, /grant select \(id, username, avatar_emoji, created_at\)/i);
  assert.match(sql, /revoke select on table public\.imaging_cases from anon, authenticated/i);
  const imagingGrant = sql.match(
    /revoke select on table public\.imaging_cases[\s\S]*?grant select \(([\s\S]*?)\)\s+on table public\.imaging_cases/i,
  );
  assert.ok(imagingGrant, 'imaging_cases must have an explicit safe-column grant');
  assert.doesNotMatch(
    imagingGrant[1],
    /reference_findings|consent_documented|created_by/i,
  );
  assert.match(sql, /lab-dicom read for public cases only/i);
  assert.match(sql, /f\.storage_path = storage\.objects\.name[\s\S]*c\.status = 'public'/i);

  assert.match(sql, /drop policy if exists "groups_select_by_code"/i);
  assert.match(sql, /drop policy if exists "members_insert_self"/i);
  assert.match(sql, /create or replace function public\.create_study_group/i);
  assert.match(sql, /create or replace function public\.join_study_group/i);
  assert.match(sql, /values \(matched_group\.id, caller_id, 'member'\)/i);
  assert.match(sql, /private\.group_join_rate_limits/i);
  assert.match(sql, /attempt_count > 20/i);
  assert.match(sql, /private\.is_current_user_group_member/i);

  assert.match(migrationCorpus, /drop policy if exists "self insert reputation"/i);
  assert.match(migrationCorpus, /revoke insert on table public\.contributor_reputation from authenticated/i);
  assert.match(migrationCorpus, /drop policy if exists "contributors insert own submission"/i);
  assert.match(migrationCorpus, /revoke insert on table public\.q_submissions from authenticated/i);
  assert.match(migrationCorpus, /drop policy if exists "reviewers insert own review"/i);
  assert.match(migrationCorpus, /revoke insert on table public\.submission_reviews from authenticated/i);
  assert.match(migrationCorpus, /sanitized\/coffee\/VD\.dcm/i);
  assert.match(migrationCorpus, /sanitized\/coffee\/Lateral\.dcm/i);
  assert.match(migrationCorpus, /drop policy if exists "lab-dicom one-time recovery read"/i);
  assert.match(migrationCorpus, /create policy "groups_select_by_code"[\s\S]*?to authenticated[\s\S]*?using \(true\)/i);
  assert.match(migrationCorpus, /role = 'admin'[\s\S]*?g\.created_by = \(select auth\.uid\(\)\)/i);
});

test('browser group flow delegates identity and role assignment to RPCs', () => {
  const api = readFileSync(resolve('src/lib/api.js'), 'utf8');
  assert.match(api, /rpc\('create_study_group'/);
  assert.match(api, /rpc\('join_study_group'/);
  assert.doesNotMatch(api, /from\('group_members'\)\s*\.insert/);
  assert.doesNotMatch(api, /from\('groups'\)\s*\.select\('\*'\)/);
});

test('personal API responses use private cache directives', () => {
  const grade = readFileSync(resolve('api/grade-summary.js'), 'utf8');
  const explain = readFileSync(resolve('api/wiki-explain.js'), 'utf8');
  const playlist = readFileSync(resolve('api/playlist.js'), 'utf8');
  const feedback = readFileSync(resolve('api/send-feedback.js'), 'utf8');
  const tts = readFileSync(resolve('api/tts.js'), 'utf8');
  const iapp = readFileSync(resolve('api/tts-iapp.js'), 'utf8');

  assert.match(grade, /Cache-Control', 'private, no-store'/);
  assert.match(explain, /Cache-Control', 'private, no-store'/);
  assert.match(tts, /Cache-Control', 'private, max-age=86400, immutable'/);
  assert.match(iapp, /Cache-Control', 'private, max-age=86400, immutable'/);
  assert.match(grade, /provider:anthropic:daily/);
  assert.match(explain, /provider:llm:daily/);
  assert.match(playlist, /provider:youtube-data-api:daily/);
  assert.match(feedback, /provider:resend:daily/);
  assert.match(iapp, /provider:iapp:daily/);
});
