import { expect, test } from '@playwright/test';

async function firstVisible(locator) {
  for (let index = 0; index < await locator.count(); index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible()) return candidate;
  }
  return null;
}

async function openVisible(locator) {
  const candidate = await firstVisible(locator);
  if (candidate) {
    await candidate.click();
    return candidate;
  }
  throw new Error('No visible matching control');
}

async function visibleViewportEscapes(page, rootSelector) {
  return page.evaluate((selector) => {
    const root = document.querySelector(selector);
    if (!root) return [{ selector, problem: 'root not found' }];
    const viewportWidth = document.documentElement.clientWidth;
    const describe = (el) => {
      let value = el.tagName.toLowerCase();
      if (el.id) value += `#${el.id}`;
      const classes = [...el.classList].filter(Boolean).slice(0, 3);
      if (classes.length) value += `.${classes.join('.')}`;
      return value;
    };
    const insideFittingScroller = (el) => {
      for (let parent = el.parentElement; parent && root.contains(parent); parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        const rect = parent.getBoundingClientRect();
        if (/^(auto|scroll)$/.test(style.overflowX)
          && parent.scrollWidth > parent.clientWidth + 1
          && rect.left >= -1 && rect.right <= viewportWidth + 1) return true;
      }
      return false;
    };
    return [root, ...root.querySelectorAll('*')].filter((el) => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      if (!el.getClientRects().length || insideFittingScroller(el)) return false;
      if (el.matches('path, circle, rect, line, defs') || el.closest('.vmx-sr-only')) return false;
      const bounds = el.getBoundingClientRect();
      return bounds.width > 1 && bounds.height > 1 && (bounds.left < -1 || bounds.right > viewportWidth + 1);
    }).map((el) => {
      const bounds = el.getBoundingClientRect();
      return {
        selector: describe(el),
        text: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
        left: Math.round(bounds.left * 10) / 10,
        right: Math.round(bounds.right * 10) / 10,
        width: Math.round(bounds.width * 10) / 10,
      };
    }).slice(0, 16);
  }, rootSelector);
}

function evenText(value, pad = 0x20) {
  const raw = Buffer.from(String(value), 'ascii');
  return raw.length % 2 === 0 ? raw : Buffer.concat([raw, Buffer.from([pad])]);
}

function uint16(value) {
  const bytes = Buffer.alloc(2);
  bytes.writeUInt16LE(value);
  return bytes;
}

function uint32(value) {
  const bytes = Buffer.alloc(4);
  bytes.writeUInt32LE(value);
  return bytes;
}

function dicomElement(group, element, vr, value) {
  const longVr = ['OB', 'OD', 'OF', 'OL', 'OW', 'SQ', 'UC', 'UN', 'UR', 'UT'].includes(vr);
  const header = Buffer.alloc(longVr ? 12 : 8);
  header.writeUInt16LE(group, 0);
  header.writeUInt16LE(element, 2);
  header.write(vr, 4, 2, 'ascii');
  if (longVr) header.writeUInt32LE(value.length, 8);
  else header.writeUInt16LE(value.length, 6);
  return Buffer.concat([header, value]);
}

// Tiny deidentified Explicit-VR Little-Endian Secondary Capture image.
// Building it in-memory keeps the repository free of opaque binary fixtures
// while proving the real Cornerstone loader, worker and renderer can decode.
function minimalDicomFixture() {
  const sopClass = '1.2.840.10008.5.1.4.1.1.7';
  const sopInstance = '1.2.826.0.1.3680043.8.498.2026081101';
  const studyInstance = '1.2.826.0.1.3680043.8.498.2026081102';
  const seriesInstance = '1.2.826.0.1.3680043.8.498.2026081103';
  const ui = (value) => evenText(value, 0x00);
  const text = (value) => evenText(value);

  const meta = Buffer.concat([
    dicomElement(0x0002, 0x0001, 'OB', Buffer.from([0x00, 0x01])),
    dicomElement(0x0002, 0x0002, 'UI', ui(sopClass)),
    dicomElement(0x0002, 0x0003, 'UI', ui(sopInstance)),
    dicomElement(0x0002, 0x0010, 'UI', ui('1.2.840.10008.1.2.1')),
    dicomElement(0x0002, 0x0012, 'UI', ui('1.2.826.0.1.3680043.8.498.1')),
    dicomElement(0x0002, 0x0013, 'SH', text('VETMOCK_5261')),
  ]);

  const dataSet = Buffer.concat([
    dicomElement(0x0008, 0x0016, 'UI', ui(sopClass)),
    dicomElement(0x0008, 0x0018, 'UI', ui(sopInstance)),
    dicomElement(0x0008, 0x0060, 'CS', text('OT')),
    dicomElement(0x0010, 0x0010, 'PN', text('ANONYMOUS')),
    dicomElement(0x0010, 0x0020, 'LO', text('E2E-FIXTURE')),
    dicomElement(0x0020, 0x000d, 'UI', ui(studyInstance)),
    dicomElement(0x0020, 0x000e, 'UI', ui(seriesInstance)),
    dicomElement(0x0020, 0x0013, 'IS', text('1')),
    dicomElement(0x0028, 0x0002, 'US', uint16(1)),
    dicomElement(0x0028, 0x0004, 'CS', text('MONOCHROME2')),
    dicomElement(0x0028, 0x0010, 'US', uint16(2)),
    dicomElement(0x0028, 0x0011, 'US', uint16(2)),
    dicomElement(0x0028, 0x0030, 'DS', text('1\\1')),
    dicomElement(0x0028, 0x0100, 'US', uint16(8)),
    dicomElement(0x0028, 0x0101, 'US', uint16(8)),
    dicomElement(0x0028, 0x0102, 'US', uint16(7)),
    dicomElement(0x0028, 0x0103, 'US', uint16(0)),
    dicomElement(0x0028, 0x1050, 'DS', text('127')),
    dicomElement(0x0028, 0x1051, 'DS', text('256')),
    dicomElement(0x7fe0, 0x0010, 'OB', Buffer.from([0, 64, 128, 255])),
  ]);

  return Buffer.concat([
    Buffer.alloc(128),
    Buffer.from('DICM', 'ascii'),
    dicomElement(0x0002, 0x0000, 'UL', uint32(meta.length)),
    meta,
    dataSet,
  ]);
}

test.describe('connected study experience', () => {
  // These tests exercise lazy network boundaries directly. A previously
  // activated app service worker can satisfy chunks before Playwright routes
  // see them, which would make the deterministic slow-chunk regression inert.
  test.use({ serviceWorkers: 'block' });

  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem('vmx-selected-year', '4');
        window.localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
        window.localStorage.setItem('vmx-seen-landing', '1');
        window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      } catch {}
    });
  });

  test('topic opens its exact Notes and governed VetWiki resources', async ({ page }) => {
    // The article URL must become shareable at click time, not only after the
    // large lazy VetWiki chunk has downloaded and mounted. Holding that chunk
    // gives this regression a deterministic signal for slow devices/networks.
    let releaseWikiChunk;
    let markWikiChunkRequested;
    const wikiChunkRequested = new Promise((resolve) => { markWikiChunkRequested = resolve; });
    const wikiChunkRelease = new Promise((resolve) => { releaseWikiChunk = resolve; });
    await page.route(/\/assets\/KnowledgeView-[^/]+\.js(?:\?.*)?$/, async (route) => {
      markWikiChunkRequested();
      await wikiChunkRelease;
      await route.continue();
    });

    await page.goto('/');
    const com5 = page.locator('.vmx-subject-card').filter({ hasText: /COM V/ }).first();
    await expect(com5).toBeVisible({ timeout: 15_000 });
    await com5.click();

    await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible();
    const rabies = page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first();
    await expect(rabies).toBeVisible();
    await expect(rabies.getByRole('button', { name: /Notes/ })).toBeVisible();
    await expect(rabies.getByRole('button', { name: /VetWiki/ })).toBeVisible();

    await rabies.getByRole('button', { name: /Notes/ }).click();
    await expect(page.getByRole('heading', { name: /Rabies.*โรคพิษสุนัขบ้า/i })).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: /ย้อนกลับ|หัวข้อ|topic/ }).first().click();
    const rabiesAgain = page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first();
    await expect(rabiesAgain).toBeVisible();
    await rabiesAgain.getByRole('button', { name: /VetWiki/ }).click();

    await wikiChunkRequested;
    await expect(page).toHaveURL(/\/wiki\/com5\/rabies/, { timeout: 1_000 });
    releaseWikiChunk();
    await expect(page.getByRole('heading', { level: 1, name: /Rabies/i })).toBeVisible({ timeout: 15_000 });

    // Trigger the product's real same-document history path. Playwright's
    // protocol-level page.goBack can intermittently no-op for pushState-only
    // entries in WebKit when the suite is highly parallel.
    await page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('popstate', resolve, { once: true });
      window.history.back();
    }));
    await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
    await expect(page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first()).toBeVisible();
  });

  test('video subject scope applies only to contextual navigation', async ({ page }) => {
    await page.goto('/');
    const com5 = page.locator('.vmx-subject-card').filter({ hasText: /COM V/ }).first();
    await expect(com5).toBeVisible({ timeout: 15_000 });
    await com5.click();

    const subjectVideos = page.locator('.vmx-mode-card').filter({ hasText: /playlist/ }).first();
    await expect(subjectVideos).toBeEnabled();
    await subjectVideos.click();
    await expect(page.locator('.vmx-chip.active')).toContainText('COM V');
    await expect(page.locator('.vmx-chip').first()).not.toHaveClass(/active/);

    await page.locator('.vmx-back-chip').first().click();
    const globalVideos = page.locator('.vmx-feature-card').filter({ hasText: /YouTube playlist/ }).first();
    await expect(globalVideos).toBeVisible();
    await globalVideos.click();
    await expect(page.locator('.vmx-chip').first()).toHaveClass(/active/);
  });

  test('Practical Imaging stays local while Pro remains a separate handoff', async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 320, height: 740 });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    // The upload smoke is deliberately local-only. Stub the optional public
    // case catalogue so a third-party CORS/network wobble cannot masquerade
    // as a Cornerstone regression (especially in parallel WebKit runs).
    await page.route(/\/rest\/v1\/imaging_cases(?:\?|$)/, async (route) => {
      const corsHeaders = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': 'apikey, authorization, content-type, prefer, x-client-info',
      };
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: corsHeaders,
        body: '[]',
      });
    });
    await page.goto('/');

    const practical = page.locator('.vmx-feature-card').filter({ hasText: /Imaging Practical/ }).first();
    await expect(practical).toBeVisible({ timeout: 15_000 });
    await practical.click();

    await expect(page).toHaveURL(/\/#lab$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Practical Imaging Lab' })).toBeVisible({ timeout: 15_000 });

    // #lab is a genuine reload-safe VetMock route, not an external redirect.
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Practical Imaging Lab' })).toBeVisible({ timeout: 15_000 });

    const pro = page.getByRole('link', { name: /CUVETSMO Imaging Pro/ });
    await expect(pro).toHaveAttribute('href', 'https://imaging.cuvetsmo.com');
    await expect(pro).toHaveAttribute('target', '_blank');

    await page.locator('input[type="file"][accept*="dcm"]').setInputFiles([
      {
        name: 'vetmock-e2e-a.dcm',
        mimeType: 'application/dicom',
        buffer: minimalDicomFixture(),
      },
      {
        name: 'vetmock-e2e-b.dcm',
        mimeType: 'application/dicom',
        buffer: minimalDicomFixture(),
      },
    ]);
    await expect(page.getByText(/2 × 2 pixels/).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.vmx-lab-shell canvas')).toHaveCount(2, { timeout: 30_000 });
    await expect(page.locator('.vmx-lab-shell canvas').first()).toBeVisible();
    expect(
      await visibleViewportEscapes(page, '.vmx-lab-shell'),
      'the decoded Practical viewer must fit a 320px phone without silent clipping',
    ).toEqual([]);

    await page.getByRole('button', { name: 'Keyboard shortcuts (?)' }).first().click();
    await expect(page.getByRole('dialog', { name: /Keyboard shortcuts/ })).toBeVisible();
    expect(
      await visibleViewportEscapes(page, '.vmx-lab-shell'),
      'the Practical shortcuts dialog must fit a 320px phone',
    ).toEqual([]);
    await page.getByRole('button', { name: 'Close keyboard shortcuts' }).click();

    await page.getByRole('button', { name: 'Info', exact: true }).first().click();
    await expect(page.getByRole('dialog', { name: 'DICOM Tag Inspector' })).toBeVisible();
    expect(
      await visibleViewportEscapes(page, '.vmx-lab-shell'),
      'the DICOM tag inspector must fit a 320px phone',
    ).toEqual([]);
    await page.getByRole('button', { name: 'Close DICOM Tag Inspector' }).click();
    expect(pageErrors).toEqual([]);

    await page.getByRole('button', { name: '← Home' }).click();
    await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Practical Imaging Lab' })).toBeHidden();
  });
});

test.describe('landing accessibility', () => {
  test('consent stays compact and login dialog manages focus', async ({ page, context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.removeItem('vmx-selected-year');
        window.localStorage.removeItem('vmx-seen-landing');
        window.localStorage.removeItem('vmx-consent');
      } catch {}
    });
    await page.goto('/?e2e-fresh=1');

    const consent = page.getByRole('region', { name: /remember where|จำที่ที่/ });
    await expect(consent).toBeVisible();
    const consentBox = await consent.boundingBox();
    const viewport = page.viewportSize();
    expect(consentBox.height).toBeLessThan(Math.min(230, viewport.height * 0.38));

    await consent.locator('.lp-cookie-prefs').click();
    await expect(page.getByRole('switch').first()).toBeFocused();
    await page.locator('.lp-cookie-card .vmx-btn-primary').click();
    await expect(page.locator('.lp-cookie-dock')).toBeHidden();

    const signInControls = page.getByRole('button', { name: /Sign In|เข้าสู่ระบบ/ });
    let returnTarget = await firstVisible(signInControls);
    if (!returnTarget) {
      returnTarget = page.getByRole('button', { name: 'Menu' });
      await returnTarget.click();
    }
    await openVisible(signInControls);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('textbox', { name: /Email|อีเมล/ })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(returnTarget).toBeFocused();
  });
});
