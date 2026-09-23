// ============================================================
// feedback-client.test.mjs — one client, one Thai sentence per cause
// ============================================================
// Three places send a message to the team through /api/send-feedback: the
// flag on a question, the concern box on a VetWiki section, and the feedback
// page. Each used to call the endpoint itself and read its failures its own
// way. At the daily cap the concern box said "พรุ่งนี้", the flag said
// "ลองใหม่ภายหลัง" and pointed at the feedback page, and that page posts to
// the same endpoint, so it failed too: a student going round in circles.
//
// All three now go through src/lib/feedback-client.js. These tests mount each
// surface's send handler (lifted out of the JSX, the way feedback-draft.test
// does, with a local fetch stub: no network, no email) and check that every
// failure cause reaches all three as the same sentence, that the sentence says
// what to do next, and that the student's text is still there afterwards.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');

// Loaded softly so the surface tests still run, and fail for their own
// reason, on a tree that does not have the client.
const client = await import('../../src/lib/feedback-client.js').catch(() => null);

// ── What the endpoint answers (api/send-feedback.js, api/_lib/rate-limit.js)

function reply(status, body, contentType = 'application/json') {
  const text = body == null ? null : (typeof body === 'string' ? body : JSON.stringify(body));
  return new Response(text, { status, headers: contentType ? { 'content-type': contentType } : {} });
}

const ANSWERS = {
  daily_cap: () => reply(429, { error: 'Daily feedback capacity reached', reason: 'daily_cap', retryAfter: 43200 }),
  burst: () => reply(429, { error: 'Too many requests', reason: 'rate_limited', retryAfter: 420 }),
  offline: () => { throw new TypeError('Failed to fetch'); },
  // `vite` / `vite preview` have no serverless runtime: the route is a bare 404.
  preview: () => reply(404, null, null),
  server: () => reply(503, { error: 'Email service not configured', reason: 'not_configured' }),
};
const sent = () => reply(200, { ok: true, id: 'test' });

function fetchStub(calls, respond) {
  return async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return respond();
  };
}

function withClient(stub) {
  return client ? (payload) => client.sendFeedback(payload, { fetch: stub }) : undefined;
}

// ── Lift a handler out of a component: `const name = async (...) => { ... };`

function lift(rel, anchor) {
  const src = read(rel);
  const start = src.indexOf(anchor);
  assert.notEqual(start, -1, `${rel} must still define ${anchor}`);
  const end = src.indexOf('\n  };', start);
  assert.notEqual(end, -1, `could not find the end of ${anchor} in ${rel}`);
  return src.slice(start + anchor.indexOf('async'), end + 4);
}

const QUIET = { warn() {}, error() {}, log() {} };

// The flag on a question (Question.jsx toggleFlag). What the student sees on
// failure is the alert.
function mountFlag(respond, reason = 'เฉลยข้อนี้ไม่ตรงกับคำอธิบาย') {
  const h = { store: {}, alerts: [], calls: [], flagState: undefined };
  const stub = fetchStub(h.calls, respond);
  const context = {
    compoundId: 'swine:101',
    currentQ: { id: 101, subject: 'swine', q: 'สุกรอายุ 3 สัปดาห์ ท้องเสีย' },
    readFlags: () => JSON.parse(JSON.stringify(h.store)),
    writeFlags: (map) => { h.store = JSON.parse(JSON.stringify(map)); },
    promptDialog: async () => reason,
    alertDialog: (opts) => { h.alerts.push(opts); },
    setFlagState: (v) => { h.flagState = v; },
    fetch: stub,
    sendFeedback: withClient(stub),
    console: QUIET,
  };
  h.run = vm.runInNewContext('(' + lift('src/components/Question.jsx', 'const toggleFlag = async () => {') + ')', context);
  h.shown = () => h.alerts.map((a) => a.body).join('\n');
  return h;
}

// The concern box on a VetWiki section (ReportConcern.jsx submit). What the
// student sees on failure is the inline alert under the textarea.
function mountConcern(respond, text = 'ขนาดยาในหัวข้อนี้ไม่ตรงกับตำรา') {
  const h = { state: 'idle', msg: '', calls: [], textCleared: false, text };
  const stub = fetchStub(h.calls, respond);
  const context = {
    text,
    state: 'idle',
    topicId: 'swine-prrs',
    sectionId: 'swine-prrs.treatment',
    sectionHeading: 'การรักษา',
    setState: (v) => { h.state = v; },
    setMsg: (v) => { h.msg = v; },
    setText: () => { h.textCleared = true; },
    fetch: stub,
    sendFeedback: withClient(stub),
    console: QUIET,
  };
  h.run = vm.runInNewContext('(' + lift('src/components/ReportConcern.jsx', 'const submit = async () => {') + ')', context);
  h.shown = () => h.msg;
  return h;
}

// The error panel of the feedback page renders one expression from apiError.
function feedbackPanelText(apiError) {
  const src = read('src/views/FeedbackView.jsx');
  const at = src.indexOf('<strong>ส่งไม่สำเร็จ</strong>');
  assert.notEqual(at, -1, 'the feedback page must still have its failure panel');
  const openTag = 'lineHeight: 1.6 }}>';
  const open = src.indexOf(openTag, at);
  assert.notEqual(open, -1, 'the failure panel must still hold its message line');
  const inner = src.slice(open + openTag.length, src.indexOf('</div>', open)).trim();
  assert.ok(inner.startsWith('{') && inner.endsWith('}'), 'the message line renders one expression');
  return vm.runInNewContext(inner.slice(1, -1), { apiError });
}

// The feedback page (FeedbackView.jsx submit), with React-shaped state.
function mountPage(respond, initial = { subject: 'เฉลยผิด', message: 'ข้อ 12 วิชาสุกร เฉลยไม่ตรงกับคำอธิบาย' }) {
  const h = {
    state: { type: 'Bug', subject: '', message: '', fromEmail: '', fromName: '', ...initial },
    status: 'idle',
    apiError: null,
    timers: [],
    calls: [],
  };
  const stub = fetchStub(h.calls, respond);
  const context = {
    formData: h.state,
    setFormData: (v) => { h.state = typeof v === 'function' ? v(h.state) : v; },
    setStatus: (v) => { h.status = v; },
    setError() {},
    setApiError: (v) => { h.apiError = v; },
    resetTimerRef: { current: null },
    fetch: stub,
    sendFeedback: withClient(stub),
    setTimeout: (fn, ms) => { h.timers.push({ fn, ms }); return h.timers.length; },
    clearTimeout() {},
    console: QUIET,
  };
  h.run = () => vm.runInNewContext('(' + lift('src/views/FeedbackView.jsx', 'const submit = async (e) => {') + ')', context)({ preventDefault() {} });
  h.shown = () => {
    assert.ok(h.status === 'api-error' || h.status === 'network-error', `the failure panel is not shown (status ${h.status})`);
    return feedbackPanelText(h.apiError);
  };
  return h;
}

async function allThree(respond) {
  const flag = mountFlag(respond);
  const concern = mountConcern(respond);
  const page = mountPage(respond);
  await flag.run();
  await concern.run();
  await page.run();
  return { flag, concern, page };
}

// ── The client ──────────────────────────────────────────────────────────

test('the client exists and names one sentence per cause', () => {
  assert.ok(client, 'src/lib/feedback-client.js must exist');
  assert.equal(typeof client.sendFeedback, 'function');
  assert.deepEqual(Object.keys(client.FEEDBACK_MESSAGES).sort(), ['burst', 'daily_cap', 'offline', 'preview', 'server']);
});

test('the payload goes out unchanged, as the JSON POST the endpoint reads', async () => {
  assert.ok(client, 'src/lib/feedback-client.js must exist');
  const calls = [];
  const payload = { type: 'Bug', subject: 'หัวข้อ', message: 'ข้อความ', fromEmail: 'a@b.co', fromName: 'Vet86' };
  const result = await client.sendFeedback(payload, { fetch: fetchStub(calls, sent) });
  assert.deepEqual(result, { ok: true, status: 200, reason: null, messageTh: '' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, '/api/send-feedback');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.deepEqual(calls[0].body, payload);
});

test('every answer the endpoint can give maps to its cause, and nothing throws', async () => {
  assert.ok(client, 'src/lib/feedback-client.js must exist');
  const cases = [
    [ANSWERS.daily_cap, 429, 'daily_cap'],
    [ANSWERS.burst, 429, 'burst'],
    // A 429 without our JSON (the platform's own limiter) is still a burst.
    [() => reply(429, 'Too Many Requests', 'text/plain'), 429, 'burst'],
    [ANSWERS.offline, 0, 'offline'],
    [ANSWERS.preview, 404, 'preview'],
    // A dev server that falls back to index.html answers 200 with a page, not our JSON.
    [() => reply(200, '<!doctype html><title>VetMock</title>', 'text/html'), 200, 'preview'],
    [ANSWERS.server, 503, 'server'],
    [() => reply(503, { error: 'Service temporarily unavailable', reason: 'temporarily_unavailable', retryAfter: 60 }), 503, 'server'],
    [() => reply(502, { error: 'Resend 403: x', hint: 'y' }), 502, 'server'],
    [() => reply(500, { error: 'Internal error' }), 500, 'server'],
    // The platform's own error pages carry no JSON; that is a server fault in
    // production, never "only on the real site".
    [() => reply(504, 'An error occurred with your deployment', 'text/plain'), 504, 'server'],
    [() => reply(403, '<html>blocked</html>', 'text/html'), 403, 'server'],
  ];
  for (const [respond, status, reason] of cases) {
    const result = await client.sendFeedback({ message: 'x' }, { fetch: fetchStub([], respond) });
    assert.equal(result.ok, false, `${reason} ${status} is not a success`);
    assert.equal(result.status, status);
    assert.equal(result.reason, reason, `HTTP ${status} should read as ${reason}`);
    assert.equal(result.messageTh, client.FEEDBACK_MESSAGES[reason]);
  }
});

test('every sentence is Thai, says what to do next, and never sends the student in circles', () => {
  assert.ok(client, 'src/lib/feedback-client.js must exist');
  const M = client.FEEDBACK_MESSAGES;
  for (const [cause, text] of Object.entries(M)) {
    assert.match(text, /[ก-๙]/, `${cause} must be Thai`);
    assert.doesNotMatch(text, /·/, `${cause}: no middle dot in UI copy`);
    assert.doesNotMatch(text, /นักศึกษา/, `${cause}: นิสิต, never นักศึกษา`);
  }
  // The daily cap does not clear for hours: tomorrow, or email the team.
  assert.match(M.daily_cap, /พรุ่งนี้/);
  assert.ok(M.daily_cap.includes(client.FEEDBACK_EMAIL), 'the daily cap needs a way out that does not use the capped endpoint');
  assert.doesNotMatch(M.daily_cap, /สักครู่|ภายหลัง/);
  // The feedback page posts to the same endpoint, so it is no way out.
  for (const cause of ['daily_cap', 'server']) {
    assert.doesNotMatch(M[cause], /หน้าแจ้งปัญหา|ส่ง Feedback/, `${cause} must not point at a page that fails the same way`);
  }
  assert.ok(M.server.includes(client.FEEDBACK_EMAIL), 'a mailer fault needs the email way out');
  assert.match(M.burst, /สักครู่/);
  assert.doesNotMatch(M.burst, /พรุ่งนี้/);
  assert.match(M.offline, /อินเทอร์เน็ต/);
});

// ── The three surfaces ─────────────────────────────────────────────────

test('at the daily cap, none of the three surfaces sends the student in circles', async () => {
  const { flag, concern, page } = await allThree(ANSWERS.daily_cap);
  const shown = { flag: flag.shown(), concern: concern.shown(), page: page.shown() };
  for (const [where, text] of Object.entries(shown)) {
    assert.match(text, /พรุ่งนี้/, `${where} must say the cap clears tomorrow; it said: ${text}`);
    assert.doesNotMatch(text, /ลองใหม่ภายหลัง|สักครู่/, `${where} told a capped student to retry soon: ${text}`);
    assert.doesNotMatch(text, /หน้าแจ้งปัญหา|ส่ง Feedback/, `${where} pointed at the feedback page, which is capped too: ${text}`);
  }
  assert.equal(shown.concern, shown.page, 'the concern box and the feedback page must say the same thing');
  assert.ok(shown.flag.includes(shown.page), `the flag must carry the same sentence; it said: ${shown.flag}`);
});

for (const cause of Object.keys(ANSWERS)) {
  test(`${cause}: all three surfaces show the client's sentence and keep the student's text`, async () => {
    assert.ok(client, 'src/lib/feedback-client.js must exist');
    const expected = client.FEEDBACK_MESSAGES[cause];
    const { flag, concern, page } = await allThree(ANSWERS[cause]);

    assert.equal(flag.alerts.length, 1);
    assert.equal(flag.alerts[0].title, 'ส่งรายงานไม่สำเร็จ');
    assert.ok(flag.shown().includes(expected), `the flag said: ${flag.shown()}`);
    assert.match(flag.shown(), /บันทึกไว้ในเครื่องแล้ว/, 'the flag still says its local mark was kept');
    assert.equal(flag.store['swine:101'].reason, 'เฉลยข้อนี้ไม่ตรงกับคำอธิบาย', 'the reason the student typed is kept');
    assert.equal(flag.store['swine:101'].delivered, false, 'an undelivered report is marked as such');

    assert.equal(concern.shown(), expected);
    assert.equal(concern.state, 'error');
    assert.equal(concern.textCleared, false, 'the concern text must stay in the box');

    assert.equal(page.shown(), expected);
    assert.equal(page.status, cause === 'offline' ? 'network-error' : 'api-error');
    assert.equal(page.state.message, 'ข้อ 12 วิชาสุกร เฉลยไม่ตรงกับคำอธิบาย', 'the page keeps the message');
    assert.equal(page.state.subject, 'เฉลยผิด');
    assert.equal(page.timers.length, 0, 'no reset timer after a failure');
  });
}

test('a success reaches all three as before', async () => {
  const { flag, concern, page } = await allThree(sent);
  assert.equal(flag.alerts.length, 0);
  assert.equal(flag.store['swine:101'].reason, 'เฉลยข้อนี้ไม่ตรงกับคำอธิบาย');
  assert.equal(flag.store['swine:101'].delivered, undefined);
  assert.equal(concern.state, 'done');
  assert.equal(page.status, 'success');
  assert.equal(page.timers.length, 1);
  assert.equal(page.timers[0].ms, 4000);
});

test('each surface still posts the body the endpoint accepts today', async () => {
  const { flag, concern, page } = await allThree(sent);
  for (const h of [flag, concern, page]) {
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0].url, '/api/send-feedback');
    assert.equal(h.calls[0].init.method, 'POST');
    const type = Object.entries(h.calls[0].init.headers).find(([k]) => k.toLowerCase() === 'content-type')?.[1];
    assert.equal(type, 'application/json');
  }
  assert.deepEqual(flag.calls[0].body, {
    type: 'content',
    subject: 'แจ้งปัญหาข้อสอบ swine:101',
    message: 'เฉลยข้อนี้ไม่ตรงกับคำอธิบาย\n\nข้อ: swine:101\nโจทย์: สุกรอายุ 3 สัปดาห์ ท้องเสีย',
  });
  assert.deepEqual(concern.calls[0].body, {
    type: 'VetWiki concern',
    subject: 'VetWiki: swine-prrs.treatment',
    message: 'หัวข้อ: การรักษา\nsection: swine-prrs.treatment\ntopic: swine-prrs\n\nข้อกังวล:\nขนาดยาในหัวข้อนี้ไม่ตรงกับตำรา',
  });
  assert.deepEqual(page.calls[0].body, {
    type: 'Bug', subject: 'เฉลยผิด', message: 'ข้อ 12 วิชาสุกร เฉลยไม่ตรงกับคำอธิบาย', fromEmail: '', fromName: '',
  });
});

// ── The flag's local mark while its report is in flight ─────────────────

test('a flag raised on another question while a report is in flight survives that report failing', async () => {
  let release;
  const flag = mountFlag(() => new Promise((r) => { release = r; }));
  const running = flag.run();
  await new Promise((r) => setImmediate(r));
  assert.equal(typeof release, 'function', 'the report must be in flight');
  // Meanwhile the student moves on and flags the next question.
  flag.store['swine:102'] = { reason: 'ตัวเลือกซ้ำกัน', ts: 2 };
  release(ANSWERS.daily_cap());
  await running;
  assert.deepEqual(flag.store['swine:102'], { reason: 'ตัวเลือกซ้ำกัน', ts: 2 }, 'the failure wrote back a stale copy and erased the newer flag');
  assert.equal(flag.store['swine:101'].delivered, false);
});

test('a flag withdrawn while its report is in flight is not put back by the failure', async () => {
  let release;
  const flag = mountFlag(() => new Promise((r) => { release = r; }));
  const running = flag.run();
  await new Promise((r) => setImmediate(r));
  delete flag.store['swine:101'];
  release(ANSWERS.server());
  await running;
  assert.equal(flag.store['swine:101'], undefined, 'the withdrawn flag came back');
});

// ── One client ─────────────────────────────────────────────────────────

test('only the client calls /api/send-feedback', () => {
  const hits = [];
  for (const name of readdirSync(join(ROOT, 'src'), { recursive: true })) {
    const rel = `src/${String(name).replace(/\\/g, '/')}`;
    if (!/\.(jsx?|mjs|tsx?)$/.test(rel)) continue;
    if (read(rel).includes('/api/send-feedback')) hits.push(rel);
  }
  assert.deepEqual(hits, ['src/lib/feedback-client.js']);
});
