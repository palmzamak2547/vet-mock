import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { safeImageUrl, safeLinkUrl } from '../../src/lib/safe-url.js';
import {
  ANON_TAGS,
  isAnonymizedTagName,
} from '../../src/lib/dicom/anonymizer.js';
import { decodeQuizSet, encodeQuizSet, readSenderInfoFromLocation } from '../../src/lib/share-link.js';
import { headerText } from '../../api/send-feedback.js';
import {
  isAllowedAppOrigin,
  resolveAppRedirect,
} from '../../supabase/functions/_shared/app-origins.js';
import { allowedOrigin, clientIP } from '../../api/_lib/rate-limit.js';
import { vercelHeadersFor } from '../helpers/vercel-static.mjs';
import { presign } from '../../api/_lib/r2.js';

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
  // vetmock.com is production; the old address stays allowed while learners move.
  assert.equal(isAllowedAppOrigin('https://vetmock.com'), true);
  assert.equal(isAllowedAppOrigin('https://vetmock.vercel.app'), true);
  assert.equal(
    isAllowedAppOrigin('https://vetmock-fix-123-palmzamak2547s-projects.vercel.app'),
    true,
  );
  assert.equal(isAllowedAppOrigin('https://vetmock.vercel.app.evil.example'), false);
  assert.equal(isAllowedAppOrigin('https://vetmock.com.evil.example'), false);
  assert.equal(isAllowedAppOrigin('https://www.vetmock.com'), false, 'www redirects to the apex; no page runs there');

  assert.equal(
    resolveAppRedirect('https://vetmock.com/app/home?from=line', null),
    'https://vetmock.com/app/home?from=line',
  );
  assert.equal(
    resolveAppRedirect('https://vetmock.vercel.app/app/home?from=line', null),
    'https://vetmock.vercel.app/app/home?from=line',
  );
  assert.equal(
    resolveAppRedirect('https://evil.example/steal', 'https://vetmock.vercel.app'),
    'https://vetmock.vercel.app',
  );
  assert.equal(
    resolveAppRedirect('https://vetmock.com@evil.example/steal', null),
    'https://vetmock.com',
  );
  assert.equal(
    resolveAppRedirect('http://localhost:5173/app/home', null),
    'http://localhost:5173/app/home',
  );
});

test('both addresses may call the API and account deletion while learners move', () => {
  const from = (origin, host = 'api.example') => allowedOrigin({ headers: { origin, host } });
  assert.equal(from('https://vetmock.com'), 'https://vetmock.com');
  assert.equal(from('https://vetmock.vercel.app'), 'https://vetmock.vercel.app');
  assert.equal(from('https://vetmock.com', 'vetmock.com'), 'https://vetmock.com', 'same origin');
  assert.equal(from('https://vetmock.com.evil.example'), null);
  assert.equal(from('https://evil.example'), null);
  const deletion = readFileSync(resolve('supabase/functions/delete-account/index.ts'), 'utf8');
  const allowed = /const ALLOWED_ORIGINS = new Set\(\[([\s\S]*?)\]\)/.exec(deletion)?.[1] || '';
  assert.match(allowed, /'https:\/\/vetmock\.com'/);
  assert.match(allowed, /'https:\/\/vetmock\.vercel\.app'/);
});

test('a challenge link whose sender name holds a percent sign still shows the score', () => {
  // URLSearchParams decodes once. The reader used to decode a second time,
  // which throws on "100%" — and the whole banner (score and time included)
  // went with it, inside one try/catch.
  const had = Object.prototype.hasOwnProperty.call(globalThis, 'window');
  const prev = globalThis.window;
  globalThis.window = { location: { search: '?qset=x&sc=3_5&by=100%25%20club&t=90', origin: 'https://vetmock.com' } };
  try {
    assert.deepEqual(readSenderInfoFromLocation(), {
      senderScore: { correct: 3, total: 5 },
      senderName: '100% club',
      senderTimeSec: 90,
    });
    globalThis.window.location.search = '?qset=x&by=%20';
    assert.equal(readSenderInfoFromLocation(), null, 'a blank name is no sender info at all');
  } finally {
    if (had) globalThis.window = prev; else delete globalThis.window;
  }
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

test('only the decode workers (DICOM, and pdf.js since B56) may compile WebAssembly, and nothing they run may eval', () => {
  // A worker takes its CSP from its own response, so the codecs get
  // 'wasm-unsafe-eval' without widening the policy of any page (2026-09-25).
  const cfg = JSON.parse(readFileSync(resolve('vercel.json'), 'utf8'));
  const csp = (path) => vercelHeadersFor(path, cfg)['content-security-policy'] || '';
  const worker = csp('/assets/decodeImageFrameWorker-AbC123.js');
  assert.match(worker, /script-src 'self' 'wasm-unsafe-eval'(;|$)/);
  assert.doesNotMatch(worker, /'unsafe-eval'|'unsafe-inline'|https:/);
  for (const path of ['/', '/index.html', '/app/study', '/assets/main-AbC123.js', '/sw.js']) {
    assert.doesNotMatch(csp(path), /wasm-unsafe-eval|'unsafe-eval'/, `${path} keeps the page policy`);
  }
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
  assert.match(grade, /provider:llm:daily/);
  assert.match(explain, /provider:llm:daily/);
  assert.match(playlist, /provider:youtube-data-api:daily/);
  assert.match(feedback, /provider:resend:daily/);
  assert.match(iapp, /provider:iapp:daily/);
});

// ── Header policy against what the app actually uses (2026-09-26) ──────────

const vercelCfg = () => JSON.parse(readFileSync(resolve('vercel.json'), 'utf8'));
const cspFor = (path) => vercelHeadersFor(path, vercelCfg())['content-security-policy'] || '';
const directive = (csp, name) => {
  const hit = csp.split(';').map((d) => d.trim()).find((d) => d.split(/\s+/)[0] === name);
  return hit ? hit.split(/\s+/).slice(1) : null;
};
// CSP host-source matching for the forms this file uses: 'self', an exact
// https origin, and a leading *. wildcard.
const cspAllowsUrl = (sources, url, selfOrigin = 'https://vetmock.com') => {
  const u = new URL(url, selfOrigin);
  return sources.some((s) => {
    if (s === "'self'") return u.origin === selfOrigin;
    const m = /^(https:|wss:)\/\/(\*\.)?([^/]+)$/.exec(s);
    if (!m || m[1] !== u.protocol) return false;
    return m[2] ? u.hostname.endsWith(`.${m[3]}`) : u.hostname === m[3];
  });
};

function walkSrc(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, ent.name);
    if (ent.isDirectory()) walkSrc(full, out);
    else if (/\.(m?js|jsx)$/.test(ent.name)) out.push(full);
  }
  return out;
}

test('the site keeps the microphone for itself while its own voice input uses it (B54)', () => {
  // microphone=() switched the feature off for vetmock itself: every mic
  // button failed with not-allowed and told the student to fix a browser
  // setting that cannot override the site's own policy.
  const usesMic = walkSrc(resolve('src')).some((f) =>
    /\bSpeechRecognition\b|getUserMedia\s*\(/.test(readFileSync(f, 'utf8')));
  assert.ok(usesMic, 'the app still ships voice input');
  for (const path of ['/', '/app/about', '/app/exam', '/wiki/x']) {
    const policy = vercelHeadersFor(path, vercelCfg())['permissions-policy'] || '';
    const mic = /(?:^|,\s*)microphone=\(([^)]*)\)/.exec(policy);
    assert.ok(mic, `${path} names the microphone`);
    assert.deepEqual(mic[1].trim().split(/\s+/), ['self'], `${path}: the site itself, and no embedded frame`);
  }
});

test('every origin the library endpoint can hand the reader is in connect-src (B55)', () => {
  const connect = directive(cspFor('/app/library'), 'connect-src');
  assert.ok(connect, 'the page policy has a connect-src');
  // Presigned R2: switches on by itself once S3 keys land in the env.
  const presigned = presign('docs/abc/x.pdf', {
    env: {
      R2_ACCOUNT_ID: '0123456789abcdef0123456789abcdef',
      R2_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
      R2_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    },
  });
  assert.ok(presigned, 'presign builds a URL once keys exist');
  const archive = /const ARCHIVE_ORIGIN = '([^']+)'/.exec(readFileSync(resolve('api/library-file.js'), 'utf8'))?.[1];
  assert.ok(archive, 'library-file still names its archive origin');
  for (const url of [presigned, `${archive}/?t=x&s=y`, '/api/library-blob?t=x&s=y']) {
    assert.ok(cspAllowsUrl(connect, url), `connect-src allows ${new URL(url, 'https://vetmock.com').origin}`);
  }
  // Only connect-src widened: no other directive learns about R2.
  assert.equal(cspFor('/app/library').match(/r2\.cloudflarestorage\.com/g)?.length, 1);
});

test('the pdf.js worker may compile its JPEG 2000 decoder and nothing more (B56)', () => {
  // pdf.js decodes JPXDecode images with new WebAssembly.Module inside its
  // worker; under the page policy that throws and the image renders blank.
  const worker = cspFor('/assets/pdf.worker.min-yatZIOMy.mjs');
  assert.deepEqual(directive(worker, 'script-src'), ["'self'", "'wasm-unsafe-eval'"]);
  assert.deepEqual(directive(worker, 'default-src'), ["'none'"]);
  assert.doesNotMatch(worker, /'unsafe-eval'|'unsafe-inline'|https:/);
  // The rule matches only the worker file, never a page or another chunk.
  for (const path of ['/', '/app/library', '/assets/PdfAnnotateView-AbC123.js', '/assets/vendor-pdf-read-AbC123.js', '/assets/pdf.worker.min-x.js']) {
    assert.doesNotMatch(cspFor(path), /wasm-unsafe-eval/, `${path} keeps the page policy`);
  }
  // The file name the rule relies on is the one the reader asks Vite for.
  const view = readFileSync(resolve('src/views/PdfAnnotateView.jsx'), 'utf8');
  assert.match(view, /pdfjs-dist\/build\/pdf\.worker\.min\.mjs\?url/);
});
