import { test, expect } from './fixtures.js';

// One number, four screens. A student reads a count on the subject card, then
// on รวมทุกหัวข้อ, then on the config screen, then on the button that starts the
// set — and every one of them has been wrong at some point in a different way:
// the card counted the whole subject while the session served one paper, the
// topic numerator and denominator came from different piles, and Panic offered
// 158 and then said 302.
//
// This walks the chain a student walks and insists the number does not change
// on the way. It does not recompute anything; if the four disagree, one of them
// is lying to somebody sitting an exam next week.

test.setTimeout(120_000);

const num = (s) => {
  const m = String(s).replace(/,/g, '').match(/(\d+)/);
  return m ? Number(m[1]) : null;
};

async function open(page, context, { year, phase }) {
  await context.addInitScript(({ y, p }) => {
    try {
      window.localStorage.setItem('vmx-selected-year', String(y));
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify(p));
    } catch {}
  }, { y: year, p: phase });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
}

for (const phase of ['1-mid', '1-final']) {
  test(`the count on the card survives the walk to the start button (${phase})`, async ({ page, context }) => {
    await open(page, context, { year: 5, phase });

    // A subject with questions on both papers, so neither run is a no-op.
    const card = page.locator('.vmx-subject-card', { hasText: 'คลินิกสัตว์น้ำ' }).first();
    await expect(card).toBeVisible({ timeout: 20000 });
    const onCard = num((await card.innerText()).match(/(\d[\d,]*)\s*ข้อ/)?.[1]);
    expect(onCard, 'the subject card prints a count').toBeGreaterThan(0);

    await card.click();
    await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible({ timeout: 20000 });

    const allTopics = page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first();
    await expect(allTopics).toBeVisible();
    const onAll = num((await allTopics.innerText()).match(/(\d[\d,]*)\s*ข้อ/)?.[1]);
    expect(onAll, 'รวมทุกหัวข้อ counts the same paper as the card').toBe(onCard);

    await allTopics.click();
    const start = page.getByRole('button', { name: /^เริ่ม(ฝึก|สอบ)/ });
    await expect(start).toBeVisible({ timeout: 20000 });
    const inSet = num(await page.getByText(/มี [\d,]+ ข้อในชุดนี้/).innerText());
    expect(inSet, 'the config screen counts the pool it will draw from').toBe(onCard);
    // The button carries the CHOSEN count, which is a slice of the pool, so it
    // may be smaller — never larger than what exists to draw from.
    expect(num(await start.innerText()), 'the start button cannot offer more than the pool holds').toBeLessThanOrEqual(inSet);
  });
}

// Another year's course from the search: a year-5 student reviewing COM V
// (year 4, term 2). App loads only the selected year's banks, so the config
// screen used to say ยังไม่มีข้อที่พร้อมใช้ในชุดนี้ with Start greyed out, and
// the card stopped offering practice. Opening the course now loads its year's
// banks, and the number holds from the card to the start button. The period is
// the student's own year's (เทอม 1 ปลายภาค here, the one this term defaults
// to), so it does not narrow another year's course: the 5.144.4 card withheld
// practice from COM V under it.
async function openFromSearch(page, query) {
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  await dialog.getByRole('textbox', { name: 'ค้นหาใน VetMock' }).fill(query);
  const card = dialog.locator('.vmx-omni-go-primary');
  await expect(card).toContainText('ฝึกข้อสอบ');
  const onCard = num((await card.innerText()).match(/(\d[\d,]*)\s*ข้อ/)?.[1]);
  expect(onCard, 'the search card prints a count').toBeGreaterThan(0);
  await card.click();
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible({ timeout: 20000 });
  return onCard;
}

async function walkToStart(page, onCard) {
  const allTopics = page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first();
  await expect(allTopics).toBeVisible();
  expect(num((await allTopics.innerText()).match(/(\d[\d,]*)\s*ข้อ/)?.[1]), 'รวมทุกหัวข้อ').toBe(onCard);
  await allTopics.click();
  const start = page.getByRole('button', { name: /^เริ่ม(ฝึก|สอบ)/ });
  await expect(start).toBeEnabled({ timeout: 20000 });
  await expect(page.getByText(/มี [\d,]+ ข้อในชุดนี้/)).toBeVisible({ timeout: 20000 });
  expect(num(await page.getByText(/มี [\d,]+ ข้อในชุดนี้/).innerText()), 'the config screen counts the loaded pool').toBe(onCard);
  return start;
}

test('another year\'s course keeps one count from the search card to the start button', async ({ page, context }) => {
  await open(page, context, { year: 5, phase: '1-final' });
  const onCard = await openFromSearch(page, 'ข้อสอบ com5');
  await walkToStart(page, onCard);
});

// Leaving the course before its year's banks arrive, then coming back: the
// load finished in the background but its count was thrown away with the
// screen that asked for it, so the config screen said none until a reload
// (5.144.4 review, Chromium and WebKit). One chunk is held to make the window.
test('leaving another year\'s course mid-load does not leave its config at none', async ({ page, context }) => {
  let held = 0;
  let released = 0;
  await context.route((url) => /\/assets\/data-q-com5-/.test(url.pathname), async (route) => {
    held += 1;
    await new Promise((resolve) => setTimeout(resolve, 4000));
    await route.continue();
    released += 1;
  });
  await open(page, context, { year: 5, phase: '1-final' });
  const onCard = await openFromSearch(page, 'ข้อสอบ com5');
  await page.locator('.vmx-back-bar').getByRole('button', { name: /หน้าแรก/ }).first().click();
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await expect.poll(() => held > 0 && released === held, { timeout: 20000 }).toBe(true);
  expect(await openFromSearch(page, 'ข้อสอบ com5')).toBe(onCard);
  await walkToStart(page, onCard);
});

// Start pressed while another year's banks are still on their way: it used to
// check only the selected year, so a VCA set from year 4 served 316 of 455.
test('Start pressed while another year\'s banks load serves the whole course', async ({ page, context }) => {
  await context.route((url) => /\/assets\/data-q-y5-mixed-/.test(url.pathname), async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await route.continue();
  });
  await open(page, context, { year: 4, phase: '1-final' });
  const onCard = await openFromSearch(page, 'ข้อสอบ vca');
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  await page.getByRole('spinbutton', { name: 'จำนวนข้อแบบกำหนดเอง' }).fill(String(onCard));
  await page.getByRole('button', { name: /^เริ่ม(ฝึก|สอบ)/ }).click();
  await expect(page.getByRole('status').filter({ hasText: /^ข้อ 1 จาก \d+$/ })).toHaveText(`ข้อ 1 จาก ${onCard}`, { timeout: 30000 });
});

// Opened offline, then the network returns: 5.144.4 fetched the other year's
// banks at once, the fetch failed, nothing retried it, and the count said
// กำลังตรวจจำนวนข้อ… for good (Chromium also kept that failed import failed
// until a reload). The background fetch now waits for the network and runs
// when it is back. The topic and config screens are warmed online first with
// a course of the selected year, so only the banks are missing.
test('another year\'s course opened offline gets its count once the network is back', async ({ page, context }) => {
  await open(page, context, { year: 5, phase: '1-final' });
  const ownCourse = page.locator('.vmx-subject-card', { hasText: /\d+\s*ข้อ/ }).first();
  await ownCourse.click();
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  await expect(page.locator('#vmx-config-count-help')).toContainText(/มี [\d,]+ ข้อในชุดนี้/, { timeout: 20000 });
  // Back the way a student goes; a reload would drop the warmed code.
  await page.locator('.vmx-back-bar').getByRole('button').first().click();
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-back-bar').getByRole('button', { name: /หน้าแรก/ }).first().click();
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  // The palette's chunk, warmed online too.
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  await expect(page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' })).toBeVisible();
  await page.keyboard.press('Escape');
  await context.setOffline(true);
  const onCard = await openFromSearch(page, 'ข้อสอบ com5');
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  const help = page.locator('#vmx-config-count-help');
  await expect(help).toHaveText('กำลังตรวจจำนวนข้อ…');
  await context.setOffline(false);
  await expect(help).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 20000 });
  await page.getByRole('button', { name: /^เริ่ม(ฝึก|สอบ)/ }).click();
  await expect(page.getByRole('status').filter({ hasText: /^ข้อ 1 จาก \d+$/ })).toBeVisible({ timeout: 20000 });
});

// The topic, config and palette code, fetched online the way a student moves
// (a reload would drop it), so an offline step only lacks the banks.
async function warmViews(page) {
  await page.locator('.vmx-subject-card', { hasText: /\d+\s*ข้อ/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  await expect(page.locator('#vmx-config-count-help')).toContainText(/มี [\d,]+ ข้อในชุดนี้/, { timeout: 20000 });
  await page.locator('.vmx-back-bar').getByRole('button').first().click();
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-back-bar').getByRole('button', { name: /หน้าแรก/ }).first().click();
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  await expect(page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' })).toBeVisible();
  await page.keyboard.press('Escape');
}

// Every bank already in memory (SR's ทุกปี loads them all): offline, another
// year's course is counted from memory. The first offline fix waited for the
// network here although nothing needed fetching (review of the 5.144.4 fixes).
// Trying the load is what makes this pass (a loaded chunk resolves without the
// network); the full-load shortcut in courseYearMissing only skips that work.
test('with every bank in memory, a course of another year counts offline', async ({ page, context }) => {
  await context.addInitScript(() => { try { localStorage.setItem('vmx-sr-year-scope', JSON.stringify('all')); } catch {} });
  await open(page, context, { year: 5, phase: '1-final' });
  await warmViews(page);
  const com5 = page.waitForResponse((r) => /\/assets\/data-q-com5-/.test(r.url()));
  await page.evaluate(() => {
    history.pushState({ vmxView: 'sr-session' }, '', '/app/review');
    dispatchEvent(new PopStateEvent('popstate', { state: { vmxView: 'sr-session' } }));
  });
  await com5;
  await expect(page.getByText('กำลังโหลดทุกปี…')).toHaveCount(0, { timeout: 30000 });
  await page.goBack();
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await context.setOffline(true);
  const onCard = await openFromSearch(page, 'ข้อสอบ com5');
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  await expect(page.locator('#vmx-config-count-help')).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 10000 });
});

// Start pressed offline, then the network returns. Chromium keeps the failed
// bank import failed, so before importBank the count stayed checking and every
// ลองใหม่ failed until a reload (review of the 5.144.4 fixes).
test('Start pressed offline recovers once the network is back', async ({ page, context }) => {
  await open(page, context, { year: 5, phase: '1-final' });
  await warmViews(page);
  await context.setOffline(true);
  const onCard = await openFromSearch(page, 'ข้อสอบ com5');
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  await page.getByRole('button', { name: /^เริ่ม(ฝึก|สอบ)/ }).click();
  const failed = page.getByRole('dialog', { name: 'โหลดคลังโจทย์ไม่ได้' });
  await expect(failed).toBeVisible({ timeout: 20000 });
  await failed.getByRole('button', { name: 'ปิด', exact: true }).click();
  await context.setOffline(false);
  await expect(page.locator('#vmx-config-count-help')).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 20000 });
  await page.getByRole('button', { name: /^เริ่ม(ฝึก|สอบ)/ }).click();
  await expect(page.getByRole('status').filter({ hasText: /^ข้อ 1 จาก \d+$/ })).toBeVisible({ timeout: 20000 });
});

// An installed app: the worker cached the year's chunks on an earlier online
// visit, and a later visit is offline (a fresh page, chunks from the worker).
// The first offline fix never tried, so the count stayed checking.
test.describe('with the service worker', () => {
  test.use({ serviceWorkers: 'allow' });
  test('chunks in the worker cache count a course of another year offline', async ({ page, context }) => {
    test.skip(!test.info().project.name.startsWith('chromium'), 'worker caching is checked on Chromium');
    await open(page, context, { year: 5, phase: '1-final' });
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout: 20000 }).toBe(true);
    await warmViews(page);
    const onCard = await openFromSearch(page, 'ข้อสอบ com5');
    await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
    await expect(page.locator('#vmx-config-count-help')).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 20000 });
    await expect.poll(() => page.evaluate(async () => {
      const names = await caches.keys();
      for (const name of names) {
        const keys = await (await caches.open(name)).keys();
        if (keys.some((r) => /data-q-com5-/.test(r.url))) return true;
      }
      return false;
    }), { timeout: 20000 }).toBe(true);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 30000 });
    expect(await openFromSearch(page, 'ข้อสอบ com5')).toBe(onCard);
    await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
    await expect(page.locator('#vmx-config-count-help')).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 20000 });
  });
});

// Bank loads that fail are tried again, and come back whole (third review of
// the 5.144.4 fixes). Each test fails some bank requests on purpose.

// One failed fetch of the shared VCA chunk at boot: its retry read undefined
// from a chunk that held two banks, and 437 VCA questions went missing with no
// error (config "มี 18 ข้อ" against 455 on the card and the topic screen).
test('a failed VCA chunk at boot comes back with every VCA question', async ({ page, context }) => {
  let aborted = 0;
  await context.route((url) => /\/assets\/data-q-vca-(?!reviewed)[^/]+\.js$/.test(url.pathname), async (route) => {
    if (aborted++ === 0) return route.abort();
    return route.continue();
  });
  await open(page, context, { year: 5, phase: '1-final' });
  const onCard = await openFromSearch(page, 'ข้อสอบ vca');
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  await expect(page.locator('#vmx-config-count-help')).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 30000 });
  expect(aborted, 'the chunk was failed once and fetched again').toBeGreaterThan(1);
});

// The boot load failing (a flaky network as the app opens): it was never tried
// again, so the counts said checking until Start. It is retried after 5 s.
test('a bank load that fails as the app opens is tried again', async ({ page, context }) => {
  // By count, not by time: the first bank request fails, whenever it comes.
  let aborted = 0;
  await context.route((url) => /\/assets\/data-q-/.test(url.pathname), (route) => (
    aborted++ === 0 ? route.abort() : route.continue()
  ));
  await open(page, context, { year: 5, phase: '1-final' });
  await page.locator('.vmx-subject-card', { hasText: /\d+\s*ข้อ/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  await expect(page.locator('#vmx-config-count-help')).toContainText(/มี [\d,]+ ข้อในชุดนี้/, { timeout: 30000 });
  expect(aborted, 'a boot bank request was failed').toBeGreaterThan(0);
});

// Back online, but the first loads after it still fail (a network that comes
// back slowly): there used to be one retry, on the online event, and then
// nothing. The next tries follow at 5, 15 and 45 s.
test('a course whose retry fails right after reconnecting is tried again', async ({ page, context }) => {
  await open(page, context, { year: 5, phase: '1-final' });
  await warmViews(page);
  await context.setOffline(true);
  const onCard = await openFromSearch(page, 'ข้อสอบ com5');
  await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
  const help = page.locator('#vmx-config-count-help');
  await expect(help).toHaveText('กำลังตรวจจำนวนข้อ…');
  // By count, not by time: the first bank request after reconnecting fails.
  let aborted = 0;
  await context.route((url) => /\/assets\/data-q-/.test(url.pathname), (route) => (
    aborted++ === 0 ? route.abort() : route.continue()
  ));
  await context.setOffline(false);
  await expect(help).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 30000 });
  expect(aborted, 'the retry after reconnecting was failed once').toBeGreaterThan(1);
});

test.describe('a retried chunk in the worker cache', () => {
  test.use({ serviceWorkers: 'allow' });
  // The worker kept a retried chunk only under its ?retry= URL, so after the
  // recovery an offline reload still found nothing.
  test('is kept under its plain URL, so an offline reload finds it', async ({ page, context }) => {
    test.skip(!test.info().project.name.startsWith('chromium'), 'worker caching is checked on Chromium');
    await open(page, context, { year: 5, phase: '1-final' });
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout: 20000 }).toBe(true);
    await warmViews(page);
    await context.setOffline(true);
    const onCard = await openFromSearch(page, 'ข้อสอบ com5');
    await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
    await context.setOffline(false);
    await expect(page.locator('#vmx-config-count-help')).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 30000 });
    // The worker stores a chunk after it has answered with it, so wait for it.
    const com5Keys = () => page.evaluate(async () => {
      const out = [];
      for (const name of await caches.keys()) {
        for (const r of await (await caches.open(name)).keys()) if (/data-q-com5-/.test(r.url)) out.push(r.url.replace(/^.*\/assets\//, ''));
      }
      return out;
    });
    await expect.poll(async () => (await com5Keys()).some((k) => !k.includes('?')), { timeout: 20000 }).toBe(true);
    const keys = await com5Keys();
    expect(keys.some((k) => k.includes('retry=')), `no ?retry= copies: ${keys.join(', ')}`).toBe(false);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 30000 });
    expect(await openFromSearch(page, 'ข้อสอบ com5')).toBe(onCard);
    await page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first().click();
    await expect(page.locator('#vmx-config-count-help')).toHaveText(`มี ${onCard.toLocaleString()} ข้อในชุดนี้`, { timeout: 20000 });
  });
});
