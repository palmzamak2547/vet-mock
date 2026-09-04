// Smoke e2e — Palm 2026-05-24
// ============================================================
// Goal: catch TDZ-class blank-page bugs (the kind that shipped to prod
// in commit 49a33dc and made every visit fail) BEFORE merge.
//
// Strategy: not exhaustive feature coverage — JUST the critical path:
//   1. Home loads without JS errors
//   2. ⌘K / Random Q button is clickable
//   3. Quick Practice completes from config through results
//   4. Fresh-user year/phase onboarding reaches home
//   5. Browser Back restores home from config
//   6. No "ReferenceError" / "Cannot access before initialization" in console
//
// What we DON'T test here (intentional — keep CI fast):
//   • Auth flow (needs Supabase test user)
//   • Specific Q content (changes daily)
//   • Modals + dropdowns (covered by useDropdownAnchor unit tests)
//
// CI wires this up via .github/workflows/smoke-e2e.yml. Local:
//   npm run test:e2e

import { test, expect } from '@playwright/test';

async function answerCurrentQuestion(page) {
  const mcq = page.locator('.vmx-option:visible').first();
  if (await mcq.isVisible()) {
    await mcq.click();
    return;
  }

  const trueFalse = page.getByRole('group', { name: /True.*False|ตัวเลือก.*True/i }).getByRole('button').first();
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
    // Match answers are one-to-one: after one row claims a value, React
    // disables that option in every remaining row. Re-reading the enabled
    // values per row avoids waiting forever on the same fixed option index.
    for (const select of await matches.all()) {
      const availableValue = await select.locator('option').evaluateAll((options) => (
        options.find((option) => option.value && !option.disabled)?.value || null
      ));
      if (!availableValue) throw new Error('No enabled matching option is available for a visible row');
      await select.selectOption(availableValue);
    }
    return;
  }

  const writing = page.locator('.vmx-question-card textarea:visible').first();
  if (await writing.isVisible()) {
    await writing.fill('คำตอบทดสอบสำหรับ smoke test');
    return;
  }

  throw new Error('No supported answer control is visible for the current question');
}

test('matching smoke helper skips an option already claimed by another row', async ({ page }) => {
  test.setTimeout(5_000);
  await page.setContent(`
    <select class="vmx-match-native-select" aria-label="จับคู่ข้อ 1">
      <option value="">เลือกคำตอบ</option>
      <option value="a">A</option>
      <option value="b">B</option>
    </select>
    <select class="vmx-match-native-select" aria-label="จับคู่ข้อ 2">
      <option value="">เลือกคำตอบ</option>
      <option value="a" disabled>A</option>
      <option value="b">B</option>
    </select>
  `);

  await answerCurrentQuestion(page);

  const matches = page.locator('.vmx-match-native-select');
  await expect(matches.nth(0)).toHaveValue('a');
  await expect(matches.nth(1)).toHaveValue('b');
});

test.describe('VetMock smoke flow', () => {
  // Capture all console errors per test so we can fail fast on
  // ReferenceError / TypeError / etc. — the bug class we're guarding.
  // (Vercel Analytics CSP warnings + Permissions-Policy unknown
  // features are pre-existing noise; we filter them out.)
  let consoleErrors = [];
  // Pre-existing noise we explicitly ignore so the smoke doesn't
  // false-fail on environmental quirks:
  //   • Vercel Analytics scripts (404 in preview / CSP block in prod)
  //   • Permissions-Policy unknown features (browser-side warning)
  //   • /_vercel/* resources (only served by Vercel edge, not vite preview)
  //   • Google Fonts CDN 404s (the UI has local/system font fallbacks)
  //   • CSP violations from va.vercel-scripts (handled in vercel.json
  //     for prod; preview just 404s the script)
  //   • __cf_bm cookie rejection — Firefox-only. Cloudflare sets a bot-
  //     management cookie on the Supabase realtime websocket; Firefox's
  //     stricter third-party-cookie policy rejects the domain and logs a
  //     JS-Error-level message. It's a browser cookie-policy notice, NOT
  //     a VetMock bug — chromium/webkit don't surface it. (Added 2026-05-27
  //     when cross-engine smoke first ran firefox-desktop.)
  const isExpectedNoise = (msg) =>
    /Vercel Web Analytics|Vercel Speed Insights|va\.vercel-scripts|vitals\.vercel-insights|Unrecognized feature|_vercel\/(insights|speed-insights)|Failed to load resource.*404.*\/_vercel\/|Failed to load resource.*404.*fonts\.gstatic\.com|downloadable font.*download failed.*fonts\.gstatic\.com|Unexpected token '<'|expected expression, got '<'|__cf_bm|rejected for invalid domain/i.test(msg);
  // ↑ "Unexpected token '<'" comes from `vite preview` returning the
  //   HTML 404 page when /_vercel/insights/script.js is requested.
  //   The browser tries to parse the HTML as JS → SyntaxError. This
  //   is preview-server-only noise; the real Vercel CDN serves the
  //   correct JS in prod. CI runs against `npm run preview` so this
  //   filter is essential.

  test.beforeEach(async ({ page, context }) => {
    consoleErrors = [];
    // Seed localStorage so the year-select front door doesn't grab
    // us on first visit — the smoke should test the actual home view.
    // (App.jsx initialView() returns 'year-select' when
    //  vmx-selected-year is absent → fresh Playwright context hits
    //  that page, not home.)
    await context.addInitScript(() => {
      try {
        // Tests that exercise the real first-run experience opt out via
        // a query flag. All other tests keep the deterministic home seed.
        if (!window.location.search.includes('e2e-fresh')) {
          window.localStorage.setItem('vmx-selected-year', '4');
        }
      } catch {}
      // A prior test run may have left a service worker controlling this
      // origin. When this run's sw.js carries a new SW_VERSION, the old
      // worker goes "waiting", the app announces an update, and the
      // "มีเวอร์ชันใหม่" notice overlaps whatever button the test is
      // about to click — the suite tests the app, not the update flow
      // (system-polish covers that separately). Registering nothing and
      // evicting any leftover worker keeps every smoke run deterministic.
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register = () => Promise.reject(
          new Error('service worker blocked for smoke determinism'),
        );
        navigator.serviceWorker.getRegistrations = () => Promise.resolve([]);
      }
    });
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      // The URL of the resource that errored is in msg.location().url
      // for "Failed to load resource" errors. Combine text + url so
      // our noise filter can match either.
      const text = msg.text();
      const loc = msg.location?.() || {};
      const combined = text + ' ' + (loc.url || '');
      if (isExpectedNoise(combined)) return;
      // Keep the resource URL in diagnostics; Chromium's generic 404 text
      // alone is otherwise impossible to classify after a failure.
      consoleErrors.push(combined.trim());
    });
    page.on('pageerror', (err) => {
      // pageerror also gets noise from Vercel analytics 404 → "<" parse fail
      if (!isExpectedNoise(err.message)) {
        consoleErrors.push(`pageerror: ${err.message}`);
      }
    });
  });

  test('home loads without TDZ / ReferenceError', async ({ page }) => {
    await page.goto('/');
    // Wait for the main app shell — covers TDZ that would otherwise
    // crash the React tree silently and leave the page blank.
    await expect(page.locator('h1')).toBeVisible({ timeout: 10_000 });
    // App-specific: <main id="main"> landmark added in a11y r1 — its
    // presence proves the tree mounted past App's root.
    await expect(page.locator('main#main')).toBeVisible();
    // No TDZ / "Cannot access before initialization" / etc.
    const tdzPattern = /cannot access|before initialization|referenceerror/i;
    const tdzErrors = consoleErrors.filter((e) => tdzPattern.test(e));
    expect(tdzErrors, `TDZ-class errors in console:\n${tdzErrors.join('\n')}`).toEqual([]);
  });

  test('can interact with hero CTAs without crash', async ({ page }) => {
    await page.goto('/');
    // The "Quick Practice" button is a stable hero CTA that exists
    // regardless of Q-bank load timing. ฝึก 1 ข้อด่วน chip only
    // appears once QB loads — using the more deterministic "Quick
    // Practice" button avoids race-flake.
    const ctas = page.getByRole('button', {
      name: /Quick Practice|ฝึกสุ่ม 1 ข้อด่วน|ฝึกแบบเลือกจำนวน|Exam Mode|จำลองสนามสอบ|🎲 ฝึก/,
    });
    // Just confirm AT LEAST ONE hero CTA is rendered + clickable —
    // proves the App tree mounted and HomeView rendered without
    // a TDZ-class error halting the render.
    await expect(ctas.first()).toBeVisible({ timeout: 15_000 });
    // Smoke-click the first CTA. Either navigates or opens a config
    // view — either way no exception.
    await ctas.first().click();
    // Wait a beat for any setState dust to settle, then check no
    // console errors were thrown by the click.
    await page.waitForTimeout(800);
    const tdzPattern = /cannot access|before initialization|referenceerror/i;
    const tdzErrors = consoleErrors.filter((e) => tdzPattern.test(e));
    expect(tdzErrors, `TDZ-class errors after CTA click:\n${tdzErrors.join('\n')}`).toEqual([]);
  });

  test('completes one-question Quick Practice through results', async ({ page }) => {
    await page.goto('/');

    const quickPractice = page.getByRole('button', {
      name: /Quick Practice|ฝึกแบบเลือกจำนวน/i,
    }).first();
    await expect(quickPractice).toBeVisible({ timeout: 15_000 });
    await quickPractice.click();

    await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
    await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('1');
    await page.getByRole('button', { name: /เริ่มฝึก/ }).click();

    await expect(page.getByRole('progressbar', { name: /ความคืบหน้า/ })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.vmx-question-card')).toBeVisible();
    await answerCurrentQuestion(page);
    // Last-question submit now opens a confirm dialog (guards accidental
    // submission) — the exam button is "ส่งข้อสอบ ✓", the modal's confirm is
    // exactly "ส่งข้อสอบ".
    await page.getByRole('button', { name: /ส่งข้อสอบ ✓/ }).click();
    await expect(page.getByRole('heading', { name: 'ส่งข้อสอบ?' })).toBeVisible();
    await page.getByRole('button', { name: 'ส่งข้อสอบ', exact: true }).click();

    await expect(page.getByText(
      /Auto-graded Score|Writing Practice Done|คะแนนตรวจอัตโนมัติ|ฝึกข้อเขียนเสร็จแล้ว/,
    )).toBeVisible({ timeout: 15_000 });
    expect(consoleErrors, `Unexpected console errors in Quick Practice flow:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('skipped-answer results can return home without changing hook order', async ({ page }) => {
    // This walks the whole loop from a cold start: the question bank is
    // lazy-loaded, so the first "เริ่มฝึก" of a fresh page has to pull and
    // parse a chunk of a 4,551-question corpus before a card can render.
    // Under parallel workers that occasionally passed 15s and the default
    // 30s budget ran out — measured 1 failure in 4 local runs, which is
    // exactly the intermittent, one-engine-at-a-time shape this showed on
    // CI. Same 60s allowance connected-study and system-polish already use
    // for comparable work.
    test.setTimeout(60_000);
    await page.goto('/');

    const quickPractice = page.getByRole('button', {
      name: /Quick Practice|ฝึกแบบเลือกจำนวน/i,
    }).first();
    await expect(quickPractice).toBeVisible({ timeout: 15_000 });
    await quickPractice.click();

    await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
    await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('2');
    await page.getByRole('button', { name: /เริ่มฝึก/ }).click();

    await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
    await answerCurrentQuestion(page);
    await page.getByRole('button', { name: 'ข้อถัดไป →', exact: true }).click();
    await page.getByRole('button', { name: /ส่งข้อสอบ ✓/ }).click();
    // The set is drawn at random, so question 2 is SOMETIMES a writing
    // question. Leaving one blank — which is the whole point of this test —
    // raises its own confirm ("ยังไม่ได้เขียนข้อนี้"), and that dialog's
    // button is also labelled "ส่งข้อสอบ". So one click could land on either
    // that guard or the submit confirm, and when it landed on the guard the
    // submit confirm was still open and the test timed out waiting for
    // results. Which of the two appears was pure luck of the draw, which is
    // why this failed intermittently on one engine at a time.
    // Clear whichever confirms are actually on screen instead of assuming.
    for (let i = 0; i < 3; i++) {
      const confirm = page.getByRole('button', { name: 'ส่งข้อสอบ', exact: true });
      if (!(await confirm.isVisible().catch(() => false))) break;
      await confirm.click();
      await page.waitForTimeout(250);
    }

    await expect(page.getByText(
      /Auto-graded Score|Writing Practice Done|คะแนนตรวจอัตโนมัติ|ฝึกข้อเขียนเสร็จแล้ว/,
    )).toBeVisible({ timeout: 15_000 });
    // The duplicate "🏠 หน้าแรก" button under the back bar was removed —
    // the back bar itself was already the way home. Same destination.
    await page.getByRole('button', { name: 'หน้าแรก', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1, name: /พร้อมฝึกสำหรับ|สวัสดี/ })).toBeVisible();

    expect(
      consoleErrors,
      `Results → Home must not throw a hook-order error:\n${consoleErrors.join('\n')}`,
    ).toEqual([]);
  });

  test('fresh user sees landing, then chooses year and phase, then reaches home', async ({ page }) => {
    await page.goto('/?e2e-fresh=1');

    // New front door (2026): a brand-new visitor (no vmx-selected-year AND
    // no vmx-seen-landing) lands on the marketing landing page first.
    // The landing defaults to Thai (the audience) with an EN toggle, so accept
    // either locale's hero heading.
    const landingHeading = page.getByRole('heading', {
      level: 1,
      name: /Practice before the real exam|ลุยโจทย์ให้ชิน/i,
    });
    await expect(landingHeading).toBeVisible();
    // Decorative hero layers must never consume layout space and push the
    // actual value proposition below the first mobile viewport.
    await expect(landingHeading).toBeInViewport();
    // The header CTA bridges into the real app → year-select (since no year
    // has been picked yet). There are two (nav + hero); click the nav one.
    await page.getByRole('button', { name: /Start Practicing|เริ่มฝึกเลย|เริ่มฝึก/i }).first().click();

    await expect(page.getByRole('heading', { level: 1, name: /เลือก.*ชั้นปี/ })).toBeVisible();
    await page.getByRole('button', { name: /ปี\s*4\b/ }).click();

    await expect(page.getByRole('heading', { level: 1, name: /เลือก.*ช่วงสอบ/ })).toBeVisible();
    await page.getByRole('button', { name: /เทอม\s*2\s*ปลายภาค/ }).click();

    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.locator('.vmx-hero h1')).toContainText(/พร้อมฝึกสำหรับ|สวัสดี/);
    await expect(page.getByRole('button', {
      name: /Quick Practice|ฝึกแบบเลือกจำนวน/i,
    }).first()).toBeVisible({ timeout: 15_000 });
    expect(consoleErrors, `Unexpected console errors in onboarding flow:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  // Measured on production 2026-09-04: a browser with no VetMock state opened
  // /app and got Home reading "พร้อมฝึกสำหรับ ปี 5" while vmx-selected-year was
  // still 'null'. /app/* are the app's OWN canonical URLs and the ones students
  // paste into the year group chat, so the picker has to run there too.
  test('a fresh visitor deep-linking to /app is asked for a year, not told one', async ({ page }) => {
    // e2e-fresh opts out of the beforeEach year seed (see the init script above).
    await page.goto('/app?e2e-fresh=1');

    // The front door for someone who has never seen the landing page.
    const landingHeading = page.getByRole('heading', {
      level: 1,
      name: /Practice before the real exam|ลุยโจทย์ให้ชิน/i,
    });
    await expect(landingHeading).toBeVisible({ timeout: 20_000 });

    // The year was never asserted on the way in.
    const stored = await page.evaluate(() => window.localStorage.getItem('vmx-selected-year'));
    expect(stored === null || stored === 'null').toBe(true);
    await expect(page.locator('.vmx-hero h1')).toHaveCount(0);
    expect(consoleErrors, `Unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  // The library is deliberately login-free and link-shareable — a year picker
  // in front of a document someone was sent is worse than the bug this guards.
  test('a fresh visitor deep-linking to the shared library still gets the library', async ({ page }) => {
    await page.goto('/app/library?e2e-fresh=1');
    await expect(page.getByRole('heading', { level: 1, name: /คลังเอกสาร/ })).toBeVisible({ timeout: 20_000 });
    expect(consoleErrors, `Unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('browser Back from config returns to home', async ({ page }) => {
    await page.goto('/');

    const quickPractice = page.getByRole('button', {
      name: /Quick Practice|ฝึกแบบเลือกจำนวน/i,
    }).first();
    await expect(quickPractice).toBeVisible({ timeout: 15_000 });
    await quickPractice.click();
    await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();

    await page.goBack();

    await expect(page.locator('.vmx-hero h1')).toContainText(/พร้อมฝึกสำหรับ|สวัสดี/);
    await expect(page.getByRole('button', {
      name: /Quick Practice|ฝึกแบบเลือกจำนวน/i,
    }).first()).toBeVisible();
    expect(consoleErrors, `Unexpected console errors after browser Back:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('no JS errors anywhere on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15_000 });
    // Allow 1s for any deferred effects to settle.
    await page.waitForTimeout(1000);
    expect(
      consoleErrors,
      `Unexpected console errors on home:\n${consoleErrors.join('\n')}`
    ).toEqual([]);
  });

  // VetWiki governed read page — guards the whole provenance chain:
  // note corpus → adapter → knowledge → read page → real cited source.
  test('VetWiki read page shows governed status + a real cited source', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15_000 });

    // Sidebar and bottom navigation share the same label; only one is visible
    // at a given breakpoint. Pick the visible control instead of relying on
    // DOM order, which differs between desktop and mobile layouts.
    const wikiEntries = page.getByRole('button', { name: 'VetWiki', exact: true });
    const wikiEntryCount = await wikiEntries.count();
    let openedWiki = false;
    for (let i = 0; i < wikiEntryCount; i++) {
      const entry = wikiEntries.nth(i);
      if (await entry.isVisible()) {
        await entry.click();
        openedWiki = true;
        break;
      }
    }
    expect(openedWiki).toBe(true);

    // VetWiki opens at its index (a reference opens at its contents).
    await expect(page.getByRole('heading', { level: 1, name: 'VetWiki' })).toBeVisible({ timeout: 10_000 });
    // In-wiki search narrows the list, then we open the article.
    await page.getByPlaceholder(/ค้นหาหัวข้อ/).fill('rabies');
    await page.getByRole('button', { name: /Rabies — โรคพิษสุนัขบ้า/ }).click();

    // The article renders with its real note content.
    // level:1 — the topic title (section headings also contain "Rabies").
    await expect(page.getByRole('heading', { level: 1, name: /Rabies/i })).toBeVisible({ timeout: 10_000 });
    // Wiki affordances: breadcrumb + table of contents.
    await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'สารบัญ' })).toBeVisible();

    // Honest governance is visible. This used to require a "ฉบับร่าง" badge,
    // but drafts were deliberately eliminated when every section reached a
    // verified state — so the assertion outlived the thing it described and
    // sat red. What must hold now is the opposite: a governed badge is shown,
    // and nothing on the page still calls itself a draft.
    await expect(page.locator('.vmx-qtype-badge').first()).toBeVisible();
    await expect(page.locator('.vmx-qtype-badge', { hasText: 'ฉบับร่าง' })).toHaveCount(0);

    // A claim cross-checked against an external reference is marked as such.
    await expect(page.getByText('ตรวจทานกับแหล่งอ้างอิง').first()).toBeVisible();

    // Provenance panel opens and cites a REAL source (never fabricated).
    await page.getByRole('button', { name: /VetMock รู้เรื่องนี้ได้อย่างไร/ }).click();
    const dialog = page.getByRole('dialog', { name: /ที่มาของเนื้อหา/ });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/WOAH/i).first()).toBeVisible();

    expect(
      consoleErrors,
      `Unexpected console errors on VetWiki:\n${consoleErrors.join('\n')}`
    ).toEqual([]);
  });

  // A reference you cannot link to isn't a reference: a shared URL must open
  // the exact article, and a section anchor must open the exact section.
  test('a shared VetWiki URL opens the article, and an anchor opens the section', async ({ page }) => {
    await page.goto('/wiki/com5/rabies#com5--rabies--diagnosis');
    await page.waitForLoadState('networkidle', { timeout: 15_000 });

    await expect(page.getByRole('heading', { level: 1, name: /Rabies/i })).toBeVisible({ timeout: 10_000 });
    // The section the link points at exists and is scrolled to.
    const section = page.locator('#com5--rabies--diagnosis');
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { name: 'Diagnosis' })).toBeInViewport();
    // The address bar keeps the shareable path (no redirect to "/").
    expect(new URL(page.url()).pathname).toBe('/wiki/com5/rabies');

    expect(
      consoleErrors,
      `Unexpected console errors on a shared VetWiki link:\n${consoleErrors.join('\n')}`
    ).toEqual([]);
  });
});
