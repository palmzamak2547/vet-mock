// ============================================================
// feedback-usage-row.test.mjs — the usage counter stores counts, never content
// ============================================================
// The back-office answers "ใช้ feature นี้เท่าไหร่ กี่คน" from one row per
// send attempt. These pin the shape that makes that safe: a row carries the
// coarse type, the outcome and two fingerprints — never the subject, never
// the message — and the logger is a best-effort fetch that can neither
// throw nor leak into the response the student waits for.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprint, feedbackUsageRow, logFeedbackUsage } from '../../api/_lib/feedback-usage.js';

test('a fingerprint is a sha-256 hex digest, and empty input has none', () => {
  assert.match(fingerprint('student@chula.ac.th'), /^[0-9a-f]{64}$/);
  assert.equal(fingerprint('student@chula.ac.th'), fingerprint('  student@chula.ac.th '), 'trim before hashing so the same address yields the same count');
  assert.notEqual(fingerprint('a@b.co'), fingerprint('c@d.co'));
  assert.equal(fingerprint(''), null);
  assert.equal(fingerprint(null), null);
  assert.equal(fingerprint('   '), null);
});

test('a row holds type, outcome and fingerprints — and nothing readable', () => {
  const row = feedbackUsageRow(
    { type: 'Bug', fromEmail: 'student@chula.ac.th', ip: '203.0.113.7' },
    'sent',
  );
  assert.deepEqual(Object.keys(row).sort(), ['feedback_type', 'outcome', 'reporter_email_hash', 'reporter_ip_hash']);
  assert.equal(row.feedback_type, 'Bug');
  assert.equal(row.outcome, 'sent');
  assert.match(row.reporter_email_hash, /^[0-9a-f]{64}$/);
  assert.match(row.reporter_ip_hash, /^[0-9a-f]{64}$/);
  assert.doesNotThrow(() => JSON.stringify(row), 'the row must stay JSON-safe for PostgREST');
});

test('an anonymous report still counts, with null fingerprints where empty', () => {
  const row = feedbackUsageRow({ ip: '203.0.113.7' }, 'capped_daily');
  assert.equal(row.feedback_type, 'Feedback', 'the type defaults when the attempt was cut off before the body was read');
  assert.equal(row.reporter_email_hash, null);
  assert.match(row.reporter_ip_hash, /^[0-9a-f]{64}$/);
});

test('an unknown outcome is still the caller’s wording — the table’s check rejects it, this file does not hide it', () => {
  const row = feedbackUsageRow({ type: 'Bug' }, 'mystery');
  assert.equal(row.outcome, 'mystery');
});

test('the logger is a no-op without backend credentials', async () => {
  const calls = [];
  const res = await logFeedbackUsage(feedbackUsageRow({ type: 'Bug' }, 'sent'), {
    url: '', key: '', fetch: async (...args) => { calls.push(args); },
  });
  assert.equal(res, false);
  assert.equal(calls.length, 0, 'no request may leave without credentials');
});

test('the logger posts the row to the usage table with the service role', async () => {
  const seen = [];
  const res = await logFeedbackUsage(feedbackUsageRow({ type: 'Bug', ip: 'x' }, 'sent'), {
    url: 'https://sb.example.co/',
    key: 'service-key',
    fetch: async (url, opts) => {
      seen.push({ url, opts });
      return { ok: true };
    },
  });
  assert.equal(res, true);
  assert.equal(seen.length, 1);
  assert.equal(seen[0].url, 'https://sb.example.co/rest/v1/feedback_usage_log', 'the trailing slash of the URL is normalized away');
  assert.equal(seen[0].opts.headers.Authorization, 'Bearer service-key');
  assert.equal(JSON.parse(seen[0].opts.body).feedback_type, 'Bug');
});

test('a failing or timing-out logger resolves false instead of throwing', async () => {
  const boom = await logFeedbackUsage({}, {
    url: 'https://sb.example.co', key: 'k',
    fetch: async () => { throw new Error('down'); },
  });
  assert.equal(boom, false);
  const bad = await logFeedbackUsage({}, {
    url: 'https://sb.example.co', key: 'k',
    fetch: async () => ({ ok: false }),
  });
  assert.equal(bad, false);
});
