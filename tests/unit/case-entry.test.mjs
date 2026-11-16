// The case sheet's own history entry (src/lib/case-entry.js). What a student could lose if it were
// wrong: a Back that seems to do nothing, a results page left behind the student's back, or the
// leave-the-set dialog in the middle of a timed paper.
import test from 'node:test';
import assert from 'node:assert/strict';
import { pushEntry, leaveEntry, ownPop, dropEntry } from '../../src/lib/case-entry.js';

// A window with a history stack whose Back fires popstate a task later, as a browser's does, and an
// app listener in the bubble phase that counts what it hears (App.jsx reads Back in a paper there).
function fakeWindow(state = { vmxView: 'exam' }) {
  const entries = [state];
  let at = 0;
  const capture = new Set();
  const app = [];
  const backs = [];
  const win = {
    history: {
      get state() { return entries[at]; },
      get length() { return entries.length; },
      pushState(s) { entries.splice(at + 1); entries.push(s); at += 1; },
      replaceState(s) { entries[at] = s; },
      back() {
        backs.push(at);
        setTimeout(() => {
          if (at === 0) return;
          at -= 1;
          let stopped = false;
          const e = { state: entries[at], stopImmediatePropagation() { stopped = true; } };
          for (const fn of [...capture]) { fn(e); if (stopped) return; }
          app.push(entries[at]);
        }, 0);
      },
    },
    addEventListener(type, fn, cap) { if (type === 'popstate' && cap) capture.add(fn); },
    removeEventListener(type, fn, cap) { if (type === 'popstate' && cap) capture.delete(fn); },
  };
  return { win, app, backs, here: () => at };
}
const tick = () => new Promise((r) => setTimeout(r, 5));

test('a sheet closed by the card takes its entry back, and the app never hears it', async () => {
  const { win, app, backs, here } = fakeWindow();
  globalThis.window = win;
  const e = pushEntry();
  assert.equal(e.on, true);
  assert.equal(win.history.state.vmxCaseSheet, 1);
  let after = 0;
  e.then = () => { after += 1; };
  dropEntry(e);
  await tick();
  assert.equal(backs.length, 1);
  assert.equal(here(), 0);
  assert.deepEqual(app, [], 'no popstate reached the app');
  assert.equal(after, 1, 'what follows the close runs once the page stands where it stood');
});

test('a paper that ends with the sheet open leaves the results where they are', async () => {
  // App replaces the paper's entry with the results, spreading its state (vmxCaseSheet with it).
  const { win, backs } = fakeWindow();
  globalThis.window = win;
  const e = pushEntry();
  win.history.replaceState({ ...win.history.state, vmxView: 'results' });
  dropEntry(e);
  await tick();
  assert.deepEqual(backs, [], 'no Back behind the results page');
  assert.equal(win.history.state.vmxView, 'results');
});

test('a close on its way back when the card closes the sheet goes back once, and the app hears nothing', async () => {
  const { win, app, backs, here } = fakeWindow();
  globalThis.window = win;
  const e = pushEntry();
  // The sheet's own close: Back through its entry ...
  assert.equal(leaveEntry(e), true);
  // ... and before its popstate arrives, the question's time runs out and the sheet unmounts.
  dropEntry(e);
  await tick();
  await tick();
  assert.equal(backs.length, 1, 'one Back, not two');
  assert.equal(here(), 0);
  assert.deepEqual(app, [], 'the app heard no Back, so no leave-the-set dialog');
});

test('Back on the sheet is its own popstate once, and a later one is the app\'s', () => {
  const { win } = fakeWindow();
  globalThis.window = win;
  const e = pushEntry();
  assert.equal(ownPop(e), true);
  assert.equal(ownPop(e), false);
  assert.equal(leaveEntry(e), false, 'no entry left to go back through');
});

test('an open that failed takes its entry back, so the next Back is the page\'s own', async () => {
  const { win, app, here } = fakeWindow({ vmxView: 'practice' });
  globalThis.window = win;
  const e = pushEntry();
  dropEntry(e);
  await tick();
  assert.equal(here(), 0);
  assert.equal(win.history.state.vmxCaseSheet, undefined);
  assert.deepEqual(app, []);
});
