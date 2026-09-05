import { expect, test } from '@playwright/test';
// The topic button renders its count from this file, so read the count
// from the same place the app does. Hardcoding "5 ข้อ" made this test
// fail the day one epidemiology question was pulled for missing its
// figure — a content edit, not a regression in anything this test is
// about. The test name says "counts ... truthful"; truthful means
// matching the data, not matching a number typed here in August.
import { Q_COUNTS_BY_TOPIC } from '../../src/data/q-counts.js';
// Same reasoning for the year sentence: it is DERIVED from which years are
// live, so freezing the August wording here made the test fail the day ปี 3
// opened — the app becoming more correct broke its own guard.
import { YEARS } from '../../src/data/curriculum.js';
import { readFile } from 'node:fs/promises';
import dicomParser from 'dicom-parser';

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
    dicomElement(0x0010, 0x1000, 'LO', text('OTHER-ID')),
    dicomElement(0x0010, 0x1001, 'PN', text('OTHER-NAME')),
    dicomElement(0x0010, 0x2154, 'SH', text('000-000-0000')),
    dicomElement(0x0010, 0x2297, 'PN', text('RESPONSIBLE-PERSON')),
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

  test('core mobile journey keeps year copy, counts and required figures truthful', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto('/app/year', { waitUntil: 'domcontentloaded' });
    const liveLabels = YEARS.filter((y) => !y.scaffold).map((y) => y.label);
    const liveYearCopy = liveLabels.length > 1
      ? `${liveLabels.slice(0, -1).join(', ')} และ ${liveLabels[liveLabels.length - 1]}`
      : liveLabels[0];
    await expect(page.getByText(`${liveYearCopy} เปิดให้ฝึกแล้ว`)).toBeVisible();

    await page.getByRole('button', { name: /ปี 5 LIVE/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: /ช่วงสอบ/ })).toBeVisible();
    await expect(page.getByText('แนะนำ', { exact: true })).toBeVisible();
    await expect(page.locator('.vmx-bottom-nav')).toHaveCount(0);

    await page.getByRole('button', { name: /เทอม 1 กลางภาค/ }).click();
    const headerContextBox = await page.locator('.vmx-header-context').boundingBox();
    const headerToolsBox = await page.locator('.vmx-header-right').boundingBox();
    expect(headerContextBox).not.toBeNull();
    expect(headerToolsBox).not.toBeNull();
    expect(Math.abs(headerContextBox.y - headerToolsBox.y)).toBeLessThan(6);
    const epidemiology = page.locator('.vmx-subject-card').filter({ hasText: /ระบาดวิทยา/ }).first();
    await expect(epidemiology).toBeVisible({ timeout: 15_000 });
    const epidemiologyBox = await epidemiology.boundingBox();
    expect(epidemiologyBox.y).toBeLessThan(650);
    await expect(page.locator('.vmx-tools-fab')).not.toBeVisible();
    await epidemiology.click();

    await expect(page.getByRole('tab', { name: 'ฝึกตามหัวข้อ' })).toHaveAttribute('aria-selected', 'true');
    const introCount = Q_COUNTS_BY_TOPIC['epidemiology']?.['epidem-intro'];
    expect(introCount, 'epidem-intro must exist in q-counts').toBeGreaterThan(0);
    const introLabel = new RegExp(`ฝึกข้อสอบ Intro to Vet Epidemiology ${introCount} ข้อ`);
    const introTopic = page.getByRole('button', { name: introLabel });
    await expect(introTopic).toBeVisible();
    const introTopicBox = await introTopic.boundingBox();
    expect(introTopicBox.width).toBeGreaterThan(300);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
    await expect(page.getByText('รูปแบบของชุดโจทย์ฝึก')).not.toBeVisible();

    await page.getByRole('button', { name: introLabel }).click();
    await expect(page.getByRole('status')).toContainText(`มี ${introCount} ข้อในชุดนี้`);
    // ConfigView caps its count chips at what the topic actually has, so
    // the pressed chip IS the availability. Reading it from q-counts keeps
    // this assertion true as the bank grows or shrinks.
    await expect(page.getByRole("button", { name: String(introCount), exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole('button', { name: '10', exact: true })).toHaveCount(0);
    // Name the switch: ConfigView grew a second one (เฉลยทันที), and a bare
    // getByRole('switch') that used to be unambiguous now matches both.
    await page.getByRole('switch', { name: /จับเวลา/ }).click();
    await page.getByRole("button", { name: `เริ่มฝึก ${introCount} ข้อ →`, exact: true }).click();

    let visualQuestions = 0;
    const wrongOptionByStem = [
      [/reassortant H1N1/, /โคเป็น mixing vessel/],
      [/แผนที่ WHO/, /ประเทศอียิปต์/],
      [/Mid-term Examination/, /14 - 18 ก.ย. 69/],
      [/case fatality rate/, /ประมาณ 90%/],
      [/เส้นโค้งการระบาดของ COVID-19/, /Intervention II, Intervention I/],
    ];
    // Length follows the bank, not a literal: this set lost a question in
    // the figure pass and the loop kept reaching for a sixth screen.
    for (let index = 0; index < introCount; index += 1) {
      const stem = await page.getByRole('heading', { level: 2 }).innerText();
      if (/แผนภาพ|แผนที่/.test(stem)) {
        visualQuestions += 1;
        const figure = page.getByRole('figure');
        await expect(figure).toBeVisible();
        await expect(figure.getByRole('img')).toHaveAttribute('alt', /\S{20,}/);
        const zoomTrigger = figure.getByRole('button', { name: /เปิดภาพขยาย/ });
        await expect(zoomTrigger).toBeVisible();
        if (visualQuestions === 1) {
          await zoomTrigger.click();
          const lightbox = page.getByRole('dialog', { name: /ภาพขยาย/ });
          await expect(lightbox.getByRole('button', { name: 'ปิดภาพขยาย' })).toBeFocused();
          await lightbox.getByRole('button', { name: 'ปิดภาพขยาย' }).click();
          await expect(zoomTrigger).toBeFocused();
        }
      }
      const wrongChoice = wrongOptionByStem.find(([pattern]) => pattern.test(stem));
      expect(wrongChoice, `missing deterministic wrong answer for: ${stem}`).toBeTruthy();
      await page.getByRole('button', { name: wrongChoice[1] }).click();
      if (index < introCount - 1) await page.getByRole('button', { name: 'ข้อถัดไป →', exact: true }).click();
    }

    expect(visualQuestions).toBe(2);
    await page.getByRole('button', { name: 'ส่งข้อสอบ ✓', exact: true }).click();
    const submitDialog = page.getByRole('dialog', { name: 'ส่งข้อสอบ?' });
    await submitDialog.getByRole('button', { name: 'ส่งข้อสอบ', exact: true }).click();
    await expect(page.getByText('คะแนนตรวจอัตโนมัติ')).toBeVisible();
    await expect(page.getByText(new RegExp(`คุณพลาด ${introCount} ข้อในหัวข้อ "Intro to Vet Epidemiology"`))).toBeVisible();
    await expect(page.getByText(/epidem-intro/)).toHaveCount(0);
    await page.getByRole('button', { name: 'หน้าแรก', exact: true }).click();
    await page.evaluate(() => new Promise((resolve) => {
      window.addEventListener('popstate', resolve, { once: true });
      window.history.back();
    }));
    await expect(page.getByRole('heading', { level: 1, name: /พร้อมฝึกสำหรับ|สวัสดี/ })).toBeVisible();
    await expect(page.getByText('0 / 0 ข้อเขียนเสร็จ')).toHaveCount(0);
    expect(pageErrors).toEqual([]);
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
    await expect(rabies.getByRole('button', { name: 'สรุป', exact: true })).toBeVisible();
    await expect(rabies.getByRole('button', { name: /VetWiki/ })).toBeVisible();

    await rabies.getByRole('button', { name: 'สรุป', exact: true }).click();
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

    await page.getByRole('tab', { name: 'สื่อเรียนและโหมดสอบ' }).click();
    const subjectVideos = page.locator('.vmx-mode-card').filter({ hasText: /คลิปย้อนหลัง/ }).first();
    await expect(subjectVideos).toBeEnabled();
    await subjectVideos.click();
    await expect(page.locator('.vmx-chip.active')).toContainText('COM V');
    await expect(page.locator('.vmx-chip').first()).not.toHaveClass(/active/);

    await page.locator('.vmx-back-chip').first().click();
    const globalVideos = page.locator('.vmx-feature-card').filter({ hasText: /เพลย์ลิสต์ YouTube|YouTube playlist/ }).first();
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
    await page.goto('/', { waitUntil: 'domcontentloaded' });

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
    await expect(page.getByText('⚠️ 6 PII tag(s) present (un-anonymized)')).toBeVisible();
    expect(
      await visibleViewportEscapes(page, '.vmx-lab-shell'),
      'the DICOM tag inspector must fit a 320px phone',
    ).toEqual([]);
    await page.getByRole('button', { name: 'Close DICOM Tag Inspector' }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Anonymize', exact: true }).first().click();
    const download = await downloadPromise;
    const downloadedPath = await download.path();
    const anonymized = dicomParser.parseDicom(new Uint8Array(await readFile(downloadedPath)));
    for (const tag of [
      'x00100010',
      'x00100020',
      'x00101000',
      'x00101001',
      'x00102154',
      'x00102297',
    ]) {
      expect((anonymized.string(tag) || '').trim(), `${tag} must be blank in the downloaded copy`).toBe('');
    }
    // WebKit can emit a local-preview-only favicon CORS warning when the test
    // server is saturated in a fully parallel run. It is not a page/runtime
    // error and does not occur on the production same-origin asset.
    const actionableErrors = pageErrors.filter((message) => !/favicon\.ico.*access control/i.test(message));
    expect(actionableErrors).toEqual([]);

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
      returnTarget = page.locator('.lp-nav-burger');
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

  test('mobile menu stays mounted and owns focus, scroll, and Escape', async ({ page, context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.removeItem('vmx-selected-year');
        window.localStorage.removeItem('vmx-seen-landing');
        window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
        window.localStorage.setItem('vmx-landing-lang', JSON.stringify('th'));
        window.localStorage.setItem('vmx-theme', JSON.stringify('light'));
      } catch {}
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?e2e-fresh=1');

    const trigger = page.locator('.lp-nav-burger');
    const menu = page.locator('#lp-mobile-menu');
    await expect(menu).toBeAttached();
    await expect(menu).toBeHidden();
    await expect(menu).toHaveAttribute('inert', '');
    await expect(trigger).toHaveAttribute('aria-label', 'เปิดเมนู');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(menu).toBeVisible();
    await expect(menu).not.toHaveAttribute('inert', '');
    await expect(trigger).toHaveAttribute('aria-label', 'ปิดเมนู');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(menu.locator('.lp-mobile-menu-link').first()).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    const focusables = menu.locator('button:not([disabled]), a[href]');
    await focusables.last().focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'ปิดเมนู' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(menu.locator('.lp-mobile-menu-link').first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');

    await trigger.click();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(trigger).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await trigger.click();
    await expect(menu).toBeVisible();
    const reducedDurationMs = await menu.evaluate((element) => {
      const values = getComputedStyle(element).transitionDuration.split(',');
      return Math.max(...values.map((value) => {
        const normalized = value.trim();
        return normalized.endsWith('ms') ? Number.parseFloat(normalized) : Number.parseFloat(normalized) * 1000;
      }));
    });
    expect(reducedDurationMs).toBeLessThanOrEqual(150);
    await page.keyboard.press('Escape');
  });

  test('landing chrome uses one icon language and observer-driven scroll state', async ({ page, context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.removeItem('vmx-selected-year');
        window.localStorage.removeItem('vmx-seen-landing');
        window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
        window.localStorage.setItem('vmx-landing-lang', JSON.stringify('th'));
        window.localStorage.setItem('vmx-theme', JSON.stringify('light'));
      } catch {}
    });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/?e2e-fresh=1');

    const sound = page.locator('.lp-sound-toggle');
    const theme = page.locator('.lp-theme-toggle');
    const bookmark = page.getByRole('button', { name: 'บันทึกข้อนี้' });
    await expect(sound.locator('svg')).toBeVisible();
    await expect(theme.locator('svg')).toBeVisible();
    await expect(bookmark.locator('svg')).toBeVisible();
    await expect(sound).toHaveAttribute('aria-label', 'เปิดเสียง');
    await expect(theme).toHaveAttribute('aria-label', 'เปลี่ยนเป็นโหมดมืด');
    await expect(page.locator('.lp-rail, .lp-spotlight')).toHaveCount(0);

    await sound.click();
    await expect(sound).toHaveAttribute('aria-label', 'ปิดเสียง');
    await theme.click();
    await expect(theme).toHaveAttribute('aria-label', 'เปลี่ยนเป็นโหมดสว่าง');

    const header = page.locator('.lp-nav');
    await expect(header).not.toHaveClass(/is-scrolled/);
    await page.evaluate(() => window.scrollTo(0, 24));
    await expect(header).toHaveClass(/is-scrolled/);

    const progressLink = page.locator('.lp-navlink[href="#progress"]');
    await page.locator('#progress').scrollIntoViewIfNeeded();
    await expect(progressLink).toHaveClass(/is-active/);
  });

  test('home onboarding tour traps focus, locks scroll, and restores its launcher', async ({ page, context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem('vmx-seen-landing', '1');
        window.localStorage.setItem('vmx-selected-year', '5');
        window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
        window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
        window.localStorage.removeItem('vmx-welcome-dismissed');
        window.localStorage.removeItem('vmx-onboarding-seen');
      } catch {}
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const launcher = page.getByRole('button', { name: 'เปิดคำแนะนำการใช้งาน' });
    await expect(launcher).toBeVisible();
    await launcher.click();

    const dialog = page.getByRole('dialog', { name: 'ยินดีต้อนรับสู่ VetMock' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'ข้าม' }).first()).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    const focusables = dialog.locator('button:not([disabled]), a[href]');
    await focusables.last().focus();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'ข้าม' }).first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(launcher).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  });
});
