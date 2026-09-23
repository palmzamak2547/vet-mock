// ============================================================
// feedback-draft.test.mjs — the success timer clears only what was sent
// ============================================================
// FeedbackView is where a student reports a wrong answer key. After a send
// succeeds it shows "ส่งสำเร็จ" for 4 seconds, then empties the subject and
// message. The inputs stay editable the whole time (only the submit button
// is disabled), so a student who reported one key and started typing the
// next one straight away watched the new, never-sent text vanish when the
// timer fired, because the timer cleared whatever was in the form.
//
// The timer now clears the form only if it still holds exactly what was
// sent. Anything typed after pressing ส่ง, during the request or during the
// 4-second panel, is kept.
//
// The view renders JSX, so submit() is lifted out of the source and run
// against React-shaped state, a local fetch stub (no network, no email) and
// captured timers, the way case-library-latest-open.test.mjs does.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { sendFeedback } from '../../src/lib/feedback-client.js';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/FeedbackView.jsx'), 'utf8').replace(/\r\n/g, '\n');

function submitSource() {
  const anchor = 'const submit = async (e) => {';
  const start = SRC.indexOf(anchor);
  assert.notEqual(start, -1, 'FeedbackView must still define submit');
  const end = SRC.indexOf('\n  };', start);
  assert.notEqual(end, -1, 'could not find the end of submit');
  return SRC.slice(start + 'const submit = '.length, end + 4);
}

/**
 * One mounted form. `respond` decides what the stubbed /api/send-feedback
 * returns; it can return a promise the test resolves later.
 */
function mountForm(initial, respond) {
  const h = {
    state: { type: 'Bug', subject: '', message: '', fromEmail: '', fromName: '', ...initial },
    status: 'idle',
    apiError: null,
    timers: [],
    sends: [],
  };
  const context = {
    // submit closes over the formData of the render it came from, as in React.
    formData: h.state,
    setFormData: (v) => { h.state = typeof v === 'function' ? v(h.state) : v; },
    setStatus: (v) => { h.status = v; },
    setError() {},
    setApiError: (v) => { h.apiError = v; },
    resetTimerRef: { current: null },
    fetch: async (url, opts) => {
      h.sends.push({ url, body: JSON.parse(opts.body) });
      return respond();
    },
    setTimeout: (fn, ms) => { h.timers.push({ fn, ms }); return h.timers.length; },
    clearTimeout() {},
    JSON,
    console: { warn() {}, error() {} },
  };
  // submit sends through lib/feedback-client.js, pointed at the stub above.
  context.sendFeedback = (payload) => sendFeedback(payload, { fetch: context.fetch });
  h.submit = vm.runInNewContext('(' + submitSource() + ')', context);
  /** The student types into the subject/message boxes. */
  h.type = (patch) => { h.state = { ...h.state, ...patch }; };
  return h;
}

const ok = () => ({ ok: true, status: 200, json: async () => ({}) });

test('a second draft typed during the success panel survives the reset timer', async () => {
  const form = mountForm({ subject: 'first', message: 'first message' }, ok);
  await form.submit({ preventDefault() {} });

  assert.equal(form.sends.length, 1);
  assert.equal(form.sends[0].url, '/api/send-feedback');
  assert.equal(form.sends[0].body.message, 'first message');
  assert.equal(form.status, 'success');
  assert.equal(form.timers.length, 1);
  assert.equal(form.timers[0].ms, 4000, 'the success panel still shows for 4 seconds');

  form.type({ subject: 'second', message: 'second unsent draft must survive' });
  form.timers[0].fn();

  assert.equal(form.state.message, 'second unsent draft must survive', 'the timer erased a draft that was never sent');
  assert.equal(form.state.subject, 'second');
  assert.equal(form.status, 'idle', 'the form must still return to idle so the draft can be sent');
  assert.equal(form.sends.length, 1, 'nothing was sent a second time');
});

test('with no edit, the sent report is cleared after the panel, as before', async () => {
  const form = mountForm({ type: 'Content', subject: 'first', message: 'first message', fromName: 'Vet86', fromEmail: 'a@b.co' }, ok);
  await form.submit({ preventDefault() {} });
  form.timers[0].fn();

  assert.equal(form.state.subject, '');
  assert.equal(form.state.message, '');
  assert.equal(form.status, 'idle');
  // Who is writing and what kind of report it is carry over to the next one.
  assert.equal(form.state.type, 'Content');
  assert.equal(form.state.fromName, 'Vet86');
  assert.equal(form.state.fromEmail, 'a@b.co');
});

test('an edit made while the request is in flight is kept', async () => {
  let release;
  const pending = new Promise((r) => { release = r; });
  const form = mountForm({ subject: 'key', message: 'the key for item 12 is wrong' }, () => pending);

  const sending = form.submit({ preventDefault() {} });
  assert.equal(form.status, 'sending');
  form.type({ message: 'the key for item 12 is wrong; item 13 too' });

  release(ok());
  await sending;
  assert.equal(form.status, 'success');
  form.timers[0].fn();

  assert.equal(form.state.message, 'the key for item 12 is wrong; item 13 too', 'text typed after pressing ส่ง was erased without being sent');
  assert.equal(form.sends.length, 1);
  assert.equal(form.sends[0].body.message, 'the key for item 12 is wrong', 'the request carries what was in the box when ส่ง was pressed');
});

test('an API failure keeps the text and offers retry, with no reset timer', async () => {
  const form = mountForm({ subject: 'key', message: 'keep me' }, () => ({
    ok: false,
    status: 500,
    json: async () => ({ error: 'boom' }),
  }));
  await form.submit({ preventDefault() {} });

  assert.equal(form.status, 'api-error');
  assert.equal(form.apiError.status, 500);
  assert.equal(form.timers.length, 0);
  assert.equal(form.state.message, 'keep me');
  assert.equal(form.state.subject, 'key');
});

test('a network failure keeps the text, with no reset timer', async () => {
  const form = mountForm({ subject: 'key', message: 'keep me too' }, () => { throw new TypeError('Failed to fetch'); });
  await form.submit({ preventDefault() {} });

  assert.equal(form.status, 'network-error');
  assert.equal(form.apiError.reason, 'offline');
  assert.equal(form.timers.length, 0);
  assert.equal(form.state.message, 'keep me too');
});

test('an empty message is refused before anything is sent', async () => {
  const form = mountForm({ subject: 'x', message: '   ' }, ok);
  await form.submit({ preventDefault() {} });
  assert.equal(form.sends.length, 0);
  assert.equal(form.status, 'idle');
});
