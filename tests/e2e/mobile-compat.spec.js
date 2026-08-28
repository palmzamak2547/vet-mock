import { test, expect } from '@playwright/test';

// Mobile regressions in VetMock are often visually clipped by an ancestor with
// overflow-x: hidden/clip, so document.scrollWidth alone cannot detect them.
// This gate also inspects the geometry of every visible element and reports the
// exact surface and selector that escapes the viewport.

const ALL_SURFACES = [
  ['landing', '/?e2e-fresh=1'],
  ['home', '/'],
  ['study', '/app/study'],
  ['review', '/app/review'],
  ['progress', '/app/progress'],
  ['questions', '/app/questions'],
  ['groups', '/app/groups'],
  ['leaderboard', '/app/leaderboard'],
  ['schedule', '/app/schedule'],
  ['course-scores', '/app/course-scores'],
  ['videos', '/app/videos'],
  ['about', '/app/about'],
  ['feedback', '/app/feedback'],
  ['cards', '/app/tools/cards'],
  ['year', '/app/year'],
  ['phase', '/app/phase'],
  ['reading', '/app/reading'],
  ['faculty', '/app/faculty'],
  ['account', '/app/account'],
  ['game', '/app/game'],
  ['focus', '/app/focus'],
  ['race', '/app/race'],
  ['pdf', '/app/tools/pdf'],
  ['pinboard', '/app/pinboard'],
  ['image-occlusion', '/app/tools/image-occlusion'],
  ['wrapped', '/app/wrapped'],
  ['contribute', '/app/contribute'],
  ['review-queue', '/app/review-queue'],
  ['imaging-practical', '/#lab'],
  ['wiki-index', '/wiki'],
  ['wiki-article', '/wiki/com5/rabies'],
];

const CROSS_ENGINE_SURFACES = [
  ['landing', '/?e2e-fresh=1'],
  ['home', '/'],
  ['study', '/app/study'],
  ['progress', '/app/progress'],
  ['schedule', '/app/schedule'],
  ['videos', '/app/videos'],
  ['focus', '/app/focus'],
  ['pinboard', '/app/pinboard'],
  ['imaging-practical', '/#lab'],
  ['wiki-article', '/wiki/com5/rabies'],
];

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      if (window.location.search.includes('e2e-fresh')) {
        window.localStorage.removeItem('vmx-selected-year');
        window.localStorage.removeItem('vmx-selected-phase');
        window.localStorage.removeItem('vmx-seen-landing');
        window.localStorage.removeItem('vmx-consent');
      } else {
        window.localStorage.setItem('vmx-selected-year', '4');
        window.localStorage.setItem('vmx-selected-phase', 'preclinic');
        window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      }
    } catch {}
  });
});

function routeUrl(path) {
  return `.${path}`;
}

async function gotoSurface(page, path) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(routeUrl(path), { waitUntil: 'domcontentloaded' });
      return;
    } catch (error) {
      const transientFirefoxCancel = /NS_BINDING_ABORTED|NS_ERROR_FAILURE|frame was detached|interrupted by another navigation/i.test(String(error));
      if (!transientFirefoxCancel || attempt === 2) throw error;
      await page.waitForTimeout(100 * (attempt + 1));
    }
  }
}

async function waitForSurface(page) {
  await page.locator('main#main, main').first().waitFor({ state: 'visible', timeout: 20_000 });
  await page.waitForFunction(() => {
    const main = document.querySelector('main#main, main');
    if (!main) return false;
    const fallback = [...main.querySelectorAll('[aria-busy="true"]')]
      .some((el) => /กำลังโหลด/.test(el.textContent || ''));
    return !fallback;
  }, null, { timeout: 20_000 }).catch(() => {});
  // Let responsive effects, fonts, and late auth boundaries settle before the
  // geometry snapshot. This is deliberately short; lazy chunks are handled by
  // the condition above.
  await page.waitForTimeout(120);
}

async function scanViewport(page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const rootScrollOverflow = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth || 0,
    ) - viewportWidth;

    const describe = (el) => {
      let value = el.tagName.toLowerCase();
      if (el.id) value += `#${el.id}`;
      const classes = [...el.classList].filter(Boolean).slice(0, 3);
      if (classes.length) value += `.${classes.join('.')}`;
      return value;
    };

    const isVisible = (el) => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      if (!el.getClientRects().length) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 1 && rect.height > 1;
    };

    const isDecorative = (el) => {
      if (el.matches('script, style, link, meta, path, circle, rect, line, defs, symbol')) return true;
      if (el.closest('.vmx-sr-only')) return true;
      if (el.matches('.lp-skip') && !el.matches(':focus')) return true;
      const style = getComputedStyle(el);
      return el.getAttribute('aria-hidden') === 'true' && style.pointerEvents === 'none';
    };

    const hasFittingHorizontalScroller = (el) => {
      for (let parent = el.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        const rect = parent.getBoundingClientRect();
        if (
          /^(auto|scroll)$/.test(style.overflowX)
          && parent.scrollWidth > parent.clientWidth + 1
          && rect.left >= -1
          && rect.right <= viewportWidth + 1
        ) return true;
      }
      return false;
    };

    const raw = [];
    for (const el of document.querySelectorAll('body *')) {
      if (!isVisible(el) || isDecorative(el) || hasFittingHorizontalScroller(el)) continue;
      const rect = el.getBoundingClientRect();
      const leftOverflow = Math.max(0, -rect.left);
      const rightOverflow = Math.max(0, rect.right - viewportWidth);
      if (leftOverflow <= 1 && rightOverflow <= 1) continue;

      const style = getComputedStyle(el);
      // Off-screen skip links and closed non-interactive decoration are
      // intentional. Visible controls, dialogs, and content are never ignored.
      const interactive = el.matches('a, button, input, select, textarea, [role="button"], [role="dialog"], [tabindex]');
      if (!interactive && style.position === 'absolute' && style.pointerEvents === 'none') continue;

      raw.push({
        element: el,
        selector: describe(el),
        text: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
        left: Math.round(rect.left * 10) / 10,
        right: Math.round(rect.right * 10) / 10,
        width: Math.round(rect.width * 10) / 10,
        overshoot: Math.round(Math.max(leftOverflow, rightOverflow) * 10) / 10,
        position: style.position,
      });
    }

    // Prefer the deepest actionable node rather than reporting the same wide
    // card, its row, and every ancestor as separate failures.
    const leafOffenders = raw.filter((entry) => !raw.some((other) => (
      other !== entry && entry.element.contains(other.element)
      && Math.abs(other.overshoot - entry.overshoot) <= 2
    )));

    const clippedControls = [...document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="dialog"]',
    )].filter(isVisible).filter((el) => {
      const style = getComputedStyle(el);
      if (!/^(hidden|clip)$/.test(style.overflowX)) return false;
      if (style.textOverflow === 'ellipsis') return false;
      return el.scrollWidth > el.clientWidth + 2;
    }).map((el) => ({
      selector: describe(el),
      text: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
      clippedBy: Math.round(el.scrollWidth - el.clientWidth),
    }));

    const textOffenders = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent?.trim()) continue;
      const parent = node.parentElement;
      if (!parent || !isVisible(parent) || isDecorative(parent) || hasFittingHorizontalScroller(parent)) continue;
      if (parent.matches('.lp-skip') && !parent.matches(':focus')) continue;
      const style = getComputedStyle(parent);
      if (style.textOverflow === 'ellipsis' && /^(hidden|clip)$/.test(style.overflowX)) continue;

      const range = document.createRange();
      range.selectNodeContents(node);
      const escaped = [...range.getClientRects()].map((rect) => ({
        rect,
        overshoot: Math.max(0, -rect.left, rect.right - viewportWidth),
      })).filter((entry) => entry.rect.width > 1 && entry.rect.height > 1 && entry.overshoot > 1)
        .sort((a, b) => b.overshoot - a.overshoot)[0];
      range.detach();
      if (!escaped) continue;
      textOffenders.push({
        selector: describe(parent),
        text: node.textContent.trim().replace(/\s+/g, ' ').slice(0, 80),
        left: Math.round(escaped.rect.left * 10) / 10,
        right: Math.round(escaped.rect.right * 10) / 10,
        overshoot: Math.round(escaped.overshoot * 10) / 10,
      });
    }

    return {
      viewportWidth,
      rootScrollOverflow: Math.round(rootScrollOverflow * 10) / 10,
      offenders: leafOffenders
        .sort((a, b) => b.overshoot - a.overshoot)
        .slice(0, 12)
        .map(({ element: _element, ...entry }) => entry),
      clippedControls: clippedControls.slice(0, 12),
      textOffenders: textOffenders.sort((a, b) => b.overshoot - a.overshoot).slice(0, 12),
    };
  });
}

async function auditSurfaces(page, testInfo, surfaces, viewport) {
  await page.setViewportSize(viewport);
  const failures = [];

  for (const [name, path] of surfaces) {
    await gotoSurface(page, path);
    await waitForSurface(page);
    const result = await scanViewport(page);
    if (result.rootScrollOverflow > 1 || result.offenders.length || result.clippedControls.length || result.textOffenders.length) {
      failures.push({ name, path, ...result });
      if (failures.length <= 3) {
        await testInfo.attach(`${name}-${viewport.width}x${viewport.height}.png`, {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
      }
    }
  }

  await testInfo.attach(`mobile-layout-${viewport.width}x${viewport.height}.json`, {
    body: Buffer.from(JSON.stringify(failures, null, 2)),
    contentType: 'application/json',
  });
  return failures;
}

async function recordStage(page, testInfo, failures, stage) {
  await page.waitForTimeout(100);
  const result = await scanViewport(page);
  if (result.rootScrollOverflow <= 1 && !result.offenders.length && !result.clippedControls.length && !result.textOffenders.length) return;
  failures.push({ stage, ...result });
  if (failures.length <= 3) {
    await testInfo.attach(`${stage}.png`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
}

async function answerCurrentQuestion(page) {
  const mcq = page.locator('.vmx-option:visible').first();
  if (await mcq.isVisible()) {
    await mcq.click();
    return;
  }

  const trueFalse = page.locator('.vmx-tf-row button:visible').first();
  if (await trueFalse.isVisible()) {
    await trueFalse.click();
    return;
  }

  const blanks = page.locator('.vmx-fill-input:visible');
  if (await blanks.count()) {
    for (const input of await blanks.all()) await input.fill('test answer');
    return;
  }

  const matches = page.locator('.vmx-match-select:visible, .vmx-match-native-select:visible');
  if (await matches.count()) {
    for (const select of await matches.all()) await select.selectOption({ index: 1 });
    return;
  }

  const writing = page.locator('.vmx-question-card textarea:visible').first();
  if (await writing.isVisible()) {
    await writing.fill('คำตอบทดสอบสำหรับ responsive layout');
    return;
  }

  throw new Error('No supported answer control is visible');
}

test.describe('whole-app mobile compatibility', () => {
  // The audit deliberately performs many full navigations. Firefox can cancel
  // one when two audit pages navigate in parallel in the same browser process,
  // so keep this small compatibility matrix sequential within each project.
  test.describe.configure({ mode: 'serial' });
  // Layout does not depend on offline caching. Blocking the worker keeps rapid
  // multi-route Firefox audits from having a worker activation cancel an
  // in-flight navigation with NS_BINDING_ABORTED.
  test.use({ serviceWorkers: 'block' });

  test('every stable surface fits the 320px minimum viewport', async ({ page, browserName, isMobile }, testInfo) => {
    test.skip(browserName !== 'chromium' || !!isMobile, 'the exhaustive route pass runs once on desktop Chromium');
    test.setTimeout(120_000);
    const failures = await auditSurfaces(page, testInfo, ALL_SURFACES, { width: 320, height: 740 });
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });

  test('representative surfaces fit narrow phones in every engine', async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const failures = await auditSurfaces(page, testInfo, CROSS_ENGINE_SURFACES, { width: 390, height: 844 });
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });

  test('representative surfaces fit phone landscape in every engine', async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const failures = await auditSurfaces(page, testInfo, CROSS_ENGINE_SURFACES, { width: 667, height: 375 });
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });

  test('critical interactive states fit a 320px phone in every engine', async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 320, height: 740 });
    const failures = [];

    await gotoSurface(page, '/');
    await waitForSurface(page);
    const quickPractice = page.getByRole('button', { name: /ฝึกแบบเลือกจำนวน|Quick Practice/i }).first();
    await expect(quickPractice).toBeVisible({ timeout: 20_000 });
    await quickPractice.click();
    await page.locator('.vmx-config-panel').waitFor({ state: 'visible', timeout: 20_000 });
    await recordStage(page, testInfo, failures, 'practice-config');

    await page.locator('.vmx-config-panel input[type="number"]').first().fill('1');
    await page.locator('.vmx-btn-row .vmx-btn-primary').last().click();
    await page.locator('.vmx-question-card').waitFor({ state: 'visible', timeout: 25_000 });
    await recordStage(page, testInfo, failures, 'active-question');

    await answerCurrentQuestion(page);
    await page.locator('.vmx-btn-row .vmx-btn-primary').last().click();
    const submitDialog = page.locator('.vmx-modal[role="dialog"]');
    await submitDialog.waitFor({ state: 'visible' });
    await recordStage(page, testInfo, failures, 'submit-dialog');
    await submitDialog.locator('.vmx-btn-primary').click();
    await page.locator('.vmx-results-hero').waitFor({ state: 'visible', timeout: 20_000 });
    await recordStage(page, testInfo, failures, 'results');

    await gotoSurface(page, '/');
    await waitForSurface(page);
    await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
    const commandPalette = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
    await commandPalette.waitFor({ state: 'visible', timeout: 20_000 });
    await recordStage(page, testInfo, failures, 'command-palette');
    await commandPalette.getByRole('textbox', { name: 'ค้นหาใน VetMock' }).fill('เครื่องคิดเลข');
    await expect(commandPalette.getByRole('button', { name: /เครื่องคิดเลข/ }).first()).toBeVisible();
    await page.keyboard.press('Escape');

    const toolsButton = page.getByRole('button', { name: 'เครื่องมือ', exact: true });
    await expect(toolsButton).not.toBeVisible();

    await gotoSurface(page, '/app/questions');
    await waitForSurface(page);
    await page.getByRole('button', { name: 'เพิ่มข้อสอบ', exact: true }).click();
    await page.locator('.vmx-config-panel').waitFor({ state: 'visible' });
    await recordStage(page, testInfo, failures, 'question-editor');

    await gotoSurface(page, '/app/videos');
    await waitForSurface(page);
    await page.getByRole('button', { name: 'เพิ่มคลิป', exact: true }).click();
    const videoEditor = page.getByRole('dialog', { name: /เพิ่มคลิป YouTube/ });
    await videoEditor.waitFor({ state: 'visible' });
    await recordStage(page, testInfo, failures, 'video-editor');
    await videoEditor.getByRole('button', { name: 'ยกเลิก' }).click();

    const firstVideo = page.locator('.vmx-mode-card > button').first();
    await firstVideo.waitFor({ state: 'visible', timeout: 20_000 });
    await firstVideo.click();
    const videoPlayer = page.getByRole('dialog').first();
    await videoPlayer.waitFor({ state: 'visible', timeout: 20_000 });
    await recordStage(page, testInfo, failures, 'video-player');
    await page.getByRole('button', { name: 'ปิดเครื่องเล่นวิดีโอ' }).click();

    await gotoSurface(page, '/');
    await waitForSurface(page);
    const com5 = page.locator('.vmx-subject-card').filter({ hasText: /COM V/ }).first();
    await com5.waitFor({ state: 'visible', timeout: 20_000 });
    await com5.click();
    await page.locator('.vmx-topic-card').first().waitFor({ state: 'visible', timeout: 20_000 });
    await recordStage(page, testInfo, failures, 'topic-selection');
    const rabies = page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first();
    await rabies.getByRole('button', { name: 'สรุป', exact: true }).click();
    await page.locator('.vmx-notes-grid').waitFor({ state: 'visible', timeout: 20_000 });
    await recordStage(page, testInfo, failures, 'topic-notes');

    await gotoSurface(page, '/app/tools/image-occlusion');
    await waitForSurface(page);
    await page.getByRole('button', { name: /เลือก.*รูป.*สร้าง deck/ }).click();
    await page.getByRole('dialog', { name: 'แก้ไข Image Occlusion deck' }).waitFor({ state: 'visible', timeout: 20_000 });
    await recordStage(page, testInfo, failures, 'image-occlusion-editor');

    await gotoSurface(page, '/?e2e-fresh=1');
    await waitForSurface(page);
    await page.locator('.lp-nav-burger').click();
    const mobileDrawer = page.locator('#vm-nav > .lp-only-mobile');
    await mobileDrawer.waitFor({ state: 'visible' });
    await recordStage(page, testInfo, failures, 'landing-mobile-drawer');
    await mobileDrawer.locator('.vmx-btn-ghost').click();
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    await recordStage(page, testInfo, failures, 'landing-login-dialog');

    await testInfo.attach('interactive-mobile-layout.json', {
      body: Buffer.from(JSON.stringify(failures, null, 2)),
      contentType: 'application/json',
    });
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });
});
