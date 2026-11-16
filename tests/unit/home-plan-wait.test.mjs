// Home's day plan and welcome banner while the account is read (src/lib/home-plan-wait.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { planWaiting, welcomeShown } from '../../src/lib/home-plan-wait.js';

test('the plan waits for the account, or for the year\'s questions when there is history to plan from', () => {
  assert.equal(planWaiting({ accountReading: true }), true);
  assert.equal(planWaiting({ historyLength: 12, bankLoaded: false }), true);
  assert.equal(planWaiting({ historyLength: 12, bankLoaded: true }), false);
  // A new student with no account to read: one first-question card, nothing to wait for.
  assert.equal(planWaiting({ historyLength: 0, bankLoaded: false }), false);
  assert.equal(planWaiting({ accountReading: true, pendingResume: true }), false);
  assert.equal(planWaiting({ accountReading: true, capped: true }), false);
});

test('a plan already drawn is never replaced by the placeholder', () => {
  // Home opened again, or the year switched, while a bank is still loading: the plan was on screen.
  assert.equal(planWaiting({ shown: true, historyLength: 12, bankLoaded: false }), false);
  assert.equal(planWaiting({ shown: true, accountReading: true }), false);
  // HomeView latches `shown` the first time the plan is drawn; a later wait cannot undo it.
  let shown = false;
  const states = [
    { historyLength: 12, bankLoaded: true },
    { historyLength: 12, bankLoaded: false },
    { accountReading: true },
  ];
  const seen = states.map((s) => { const w = planWaiting({ ...s, shown }); if (!w) shown = true; return w; });
  assert.deepEqual(seen, [false, false, false]);
});

test('the welcome waits for the account read only up to the same cap as the plan', () => {
  assert.equal(welcomeShown({ accountReading: true }), false);
  // The read hangs past 6 s without an error: the welcome shows.
  assert.equal(welcomeShown({ accountReading: true, capped: true }), true);
  assert.equal(welcomeShown({}), true);
  assert.equal(welcomeShown({ historyLength: 1 }), false);
  assert.equal(welcomeShown({ accountUnread: true, capped: true }), false);
  assert.equal(welcomeShown({ dismissed: true }), false);
  assert.equal(welcomeShown({ legacySeen: true }), false);
});

test('the placeholder announces itself to a screen reader', async () => {
  const sourceRoot = new URL('../../src/', import.meta.url).href;
  registerHooks({
    load(url, context, nextLoad) {
      if (url.startsWith(sourceRoot) && url.endsWith('.jsx')) {
        const { code } = transformSync(readFileSync(new URL(url), 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url });
        return { format: 'module', shortCircuit: true, source: code };
      }
      return nextLoad(url, context);
    },
  });
  const { default: NextActionCard } = await import('../../src/components/NextActionCard.jsx');
  const html = renderToStaticMarkup(createElement(NextActionCard, { history: [], subjects: [], waiting: true }));
  const wait = html.match(/<div class="[^"]*vmx-next-actions-wait[^"]*"[^>]*>/);
  assert.ok(wait, 'the placeholder is drawn');
  assert.match(wait[0], /role="status"/);
  assert.match(wait[0], /aria-busy="true"/);
});

test('a plan step is named by its words, and its arrow is not read out', async () => {
  // Runs after the test above, which teaches node to load the .jsx files.
  const { default: NextActionCard } = await import('../../src/components/NextActionCard.jsx');
  const html = renderToStaticMarkup(createElement(NextActionCard, { history: [], subjects: [], waiting: false }));
  const cta = html.match(/<span class="vmx-next-action-cta">([\s\S]*?)<\/span><\/span>/);
  assert.ok(cta, 'the step has its button word');
  assert.match(cta[1], /<span class="vmx-next-action-cta-word">เริ่ม[^<]+<\/span>/);
  assert.match(cta[1], /<span class="vmx-next-action-cta-arrow" aria-hidden="true">→/);
});
