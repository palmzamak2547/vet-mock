// The round 3 art review, checked in a real browser [M1-DESIGN.md 3, 15, 16]: the story's panels show
// all of their content at rest (the phone codebook cut its farm question), the reduced-motion first
// screen holds the title, the lead and both buttons with the still herd whole beside or under them,
// the hidden skip link paints nothing until it has focus, the first screen for a new student shows
// the whole drop zone the entrance gathers onto, and the codebook says it scrolls sideways while
// the import message stays off the table. OWNER: landing role.
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { seenEntrance } from './research-runtime-helpers.mjs';

const SEROSURVEY = fileURLToPath(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));

for (const lang of ['th', 'en']) {
  test(`story panels show all their content, farm question included (${lang})`, async ({ page }) => {
    await seenEntrance(page, lang);
    await page.goto('/');
    await expect(page.locator('.rs-story-stack > .rs-l-panel')).toHaveCount(4);
    const panels = await page.$$eval('.rs-story-stack > .rs-l-panel', (ps) => ps.map((p) => ({ k: p.dataset.rs, over: p.scrollHeight - p.clientHeight })));
    for (const p of panels) expect(p.over, `${p.k} cuts ${p.over} px of its content`).toBeLessThanOrEqual(1);
    const ask = await page.$eval('[data-rs="p1"]', (p) => {
      const a = p.querySelector('.rs-l-ask');
      return { bottom: a.offsetTop + a.offsetHeight, box: p.clientHeight, yes: Boolean(a.querySelector('.rs-l-ask-yes')) };
    });
    expect(ask.yes).toBe(true);
    expect(ask.bottom, 'the farm question and its answers sit inside the codebook panel').toBeLessThanOrEqual(ask.box);
  });
}

test('reduced motion: the first screen holds the title, lead and both buttons, and the still herd is whole', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seenEntrance(page);
  await page.goto('/');
  const actions = page.locator('.rs-still .rs-l-hero-actions');
  await expect(actions).toBeVisible();
  const fit = await actions.evaluate((el) => ({ bottom: el.getBoundingClientRect().bottom, vh: window.innerHeight }));
  expect(fit.bottom, 'both hero buttons above the fold').toBeLessThanOrEqual(fit.vh);
  const cut = await page.$$eval('svg.rs-still-herd, svg.rs-still-herd-sm', (svgs) => svgs.map((svg) => {
    const vb = svg.viewBox.baseVal;
    const bb = svg.querySelector('g').getBBox();
    const pad = 0.6; // half the ring stroke
    return (bb.x - pad < vb.x || bb.y - pad < vb.y || bb.x + bb.width + pad > vb.x + vb.width || bb.y + bb.height + pad > vb.y + vb.height) ? 1 : 0;
  }));
  expect(cut.length).toBeGreaterThan(0);
  expect(cut.reduce((a, b) => a + b, 0), 'still herds with an edge ring cut').toBe(0);
});

test('the skip link paints nothing until it has focus', async ({ page }) => {
  await seenEntrance(page);
  await page.goto('/');
  const skip = page.locator('.rs-l-skip');
  const idle = await skip.evaluate((el) => ({ shadow: getComputedStyle(el).boxShadow, bottom: el.getBoundingClientRect().bottom }));
  expect(idle.shadow).toBe('none');
  expect(idle.bottom).toBeLessThan(0);
  await skip.focus();
  const on = await skip.evaluate((el) => ({ shadow: getComputedStyle(el).boxShadow, top: el.getBoundingClientRect().top }));
  expect(on.shadow).not.toBe('none');
  expect(on.top).toBeGreaterThanOrEqual(0);
});

test('a new student sees the whole drop zone on the first screen', async ({ page }) => {
  await seenEntrance(page);
  await page.goto('/app');
  const drop = page.locator('.rs-welcome-drop');
  await expect(drop).toBeVisible();
  const r = await drop.evaluate((el) => ({ top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom, vh: window.innerHeight }));
  expect(r.top).toBeGreaterThanOrEqual(0);
  expect(r.bottom, 'the drop zone the entrance gathers onto ends on the first screen').toBeLessThanOrEqual(r.vh);
});

test('codebook: whole type, role and level labels, a sideways-scroll cue, and the import message off the table', async ({ page }) => {
  test.setTimeout(90_000);
  await seenEntrance(page);
  await page.goto('/app');
  await page.locator('input[type="file"]').first().setInputFiles(SEROSURVEY);
  await expect(page).toHaveURL(/\/import$/);
  await expect(page.locator('#rs-h-found')).toBeVisible();
  for (let i = 0; i < 6; i += 1) {
    const waiting = page.locator('.rs-conv--ask:not(.rs-conv--answered)');
    if ((await waiting.count()) === 0) break;
    await waiting.first().getByRole('radio').first().click();
  }
  await page.locator('.rs-confirmbox .rs-btn--primary').click();
  await expect(page).toHaveURL(/\/codebook$/);

  // On a wide screen the import message sits under the top bar, clear of the table and the save bar.
  const vw = await page.evaluate(() => window.innerWidth);
  if (vw >= 720) {
    await expect(page.locator('.rs-status-item').first()).toBeVisible();
    const clash = await page.evaluate(() => {
      const a = document.querySelector('.rs-status-item').getBoundingClientRect();
      return ['.rs-tablewrap', '.rs-savebar'].filter((s) => {
        const b = document.querySelector(s).getBoundingClientRect();
        return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      });
    });
    expect(clash, 'the import message covers').toEqual([]);
  }
  await expect(page.locator('.rs-tablescroll')).toHaveAttribute('data-more-right', 'true');

  // Every type, role and level select is wide enough for the longest name it can show, in Thai and in
  // English (the English type names are the long ones).
  const tooNarrow = () => page.$$eval('.rs-select--type, .rs-select--role, .rs-select--level', (sels) => {
    const probe = document.createElement('span');
    document.body.appendChild(probe);
    const out = [];
    for (const s of sels) {
      const cs = getComputedStyle(s);
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${cs.font}`;
      const widest = Math.max(...[...s.options].map((o) => { probe.textContent = o.textContent; return probe.getBoundingClientRect().width; }));
      // text box = inner width - paddings - the arrow (about 24 px)
      const room = s.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 24;
      if (widest > room + 1) out.push(`${s.className}: ${Math.round(widest)} > ${Math.round(room)}`);
    }
    probe.remove();
    return out;
  });
  expect(await tooNarrow(), 'selects too narrow for their Thai labels').toEqual([]);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await tooNarrow(), 'selects too narrow for their English labels').toEqual([]);

  // Scrolled to the end, the right-hand cue goes and the left one comes.
  await page.locator('.rs-tablewrap').evaluate((el) => { el.scrollLeft = el.scrollWidth; });
  await expect(page.locator('.rs-tablescroll')).toHaveAttribute('data-more-right', 'false');
  await expect(page.locator('.rs-tablescroll')).toHaveAttribute('data-more-left', 'true');
});
