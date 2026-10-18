// The bank comes in small files: an index per domain and shards of twelve questions. What a page
// asks the network for is checked here in the browser, and so is what the bank page does while
// the rest of the shards are still on their way, and when one of them fails.
import { test, expect } from './fixtures.mjs';
import { BANK } from '../../src/generated/bank.js';
import { searchQuestions } from '../../src/lib/search.js';
import { readDomain } from '../support/bank-files.mjs';

const onDisk = Object.fromEntries(BANK.domains.map((d) => [d.id, readDomain(d)]));
const INDEX = /\/bank\/[a-z-]+\.index\.[0-9a-f]{8}\.json$/;
const SHARD = /\/bank\/([a-z-]+)-(\d+)\.[0-9a-f]{8}\.json$/;

/** The shard files that hold some keys. */
const shardsHolding = (keys) => {
  const urls = new Set();
  for (const key of keys) {
    for (const d of Object.values(onDisk)) {
      const entry = d.index.byKey.get(key);
      if (entry) urls.add(d.index.shards[entry.shard].url);
    }
  }
  return urls;
};

/** Every /bank/ request the page makes from now on. */
const watchBank = (page) => {
  const asked = [];
  page.on('request', (r) => { const { pathname } = new URL(r.url()); if (pathname.startsWith('/bank/')) asked.push(pathname); });
  return asked;
};

test('the one-tap start asks for four small indexes and a few shards, never a whole domain', async ({ page }) => {
  const asked = watchBank(page);
  await page.goto('/');
  await page.locator('.hero .ctas button.btn-ink').click();
  await expect(page).toHaveURL(/\/session$/, { timeout: 30_000 });
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 30_000 });
  const indexes = asked.filter((p) => INDEX.test(p));
  const shards = asked.filter((p) => SHARD.test(p));
  expect(indexes.length + shards.length, `only indexes and shards: ${asked.join(' ')}`).toBe(asked.length);
  expect(indexes).toHaveLength(4);
  expect(shards.length).toBeGreaterThanOrEqual(1);
  expect(shards.length).toBeLessThanOrEqual(10);
  // The shards are the ones holding the ten questions of the set that opened.
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem('vca:session:v1')));
  expect(session.items).toHaveLength(10);
  expect(new Set(shards)).toEqual(shardsHolding(session.items.map((it) => it.key)));
});

test('a set reopened after a reload fetches its own shards and no others', async ({ page }) => {
  await page.goto('/practice?d=swine,avian&n=10');
  await page.locator('.builder-sum button.btn-ink').click();
  await expect(page).toHaveURL(/\/session$/, { timeout: 30_000 });
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 30_000 });
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem('vca:session:v1')));
  const stem = await page.locator('.q-stem').first().innerText();

  const asked = watchBank(page);
  await page.reload();
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.q-stem').first()).toHaveText(stem);
  expect(asked.filter((p) => INDEX.test(p))).toHaveLength(2);
  expect(new Set(asked.filter((p) => SHARD.test(p)))).toEqual(shardsHolding(session.items.map((it) => it.key)));
});

test('a reopened set whose shards cannot be had says so, and the button gets them', async ({ page, pageErrors }) => {
  await page.goto('/practice?d=imaging&n=10');
  await page.locator('.builder-sum button.btn-ink').click();
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 30_000 });
  const stem = await page.locator('.q-stem').first().innerText();

  await page.route(SHARD, (route) => route.abort('connectionfailed'));
  await page.reload();
  await expect(page.locator('.run-card .notice-error')).toContainText('โหลดข้อสอบไม่สำเร็จ');
  await page.unroute(SHARD);
  await page.locator('.run-card button.btn-ink').click();
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.q-stem').first()).toHaveText(stem);
  // The browser logs a load that failed; here that is the point of the test, and nothing else.
  expect(pageErrors.length).toBeGreaterThan(0);
  expect(pageErrors.every((m) => /ERR_CONNECTION_FAILED .*\/bank\/imaging-\d\./.test(m))).toBe(true);
  pageErrors.length = 0;
});

test('the finished set\'s review comes from its own shards', async ({ page }) => {
  await page.goto('/practice?d=juris,pathology&n=10');
  await page.locator('.builder-sum button.btn-ink').click();
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 30_000 });
  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press('Digit1');
    await page.keyboard.press('Enter');
  }
  await expect(page).toHaveURL(/\/result\/[a-z0-9-]{4,40}$/, { timeout: 15_000 });
  const results = await page.evaluate(() => JSON.parse(localStorage.getItem('vca:results:v1')));
  const asked = watchBank(page);
  await page.reload();
  await expect(page.locator('.rv-list .rv')).toHaveCount(10, { timeout: 30_000 });
  await expect(page.locator('.rv-stem').first()).not.toHaveText('ข้อนี้ไม่อยู่ในคลังแล้ว');
  expect(asked.filter((p) => INDEX.test(p))).toHaveLength(2);
  expect(new Set(asked.filter((p) => SHARD.test(p)))).toEqual(shardsHolding(results[0].items.map((it) => it.key)));
});

// ── the bank page ───────────────────────────────────────────────────────────────────────────

/** The shards holding the first thirty questions that pass `keep`, in the order the bank lists them. */
function firstPageShards(keep = () => true) {
  const keys = [];
  for (const d of BANK.domains) for (const e of onDisk[d.id].index.entries) if (keep(e)) keys.push(e.key);
  return shardsHolding(keys.slice(0, 30));
}

/** Holds back every shard but those of the first page until `release()`. */
async function holdTheRest(page, keep) {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const allowed = firstPageShards(keep);
  await page.route(SHARD, async (route) => {
    if (!allowed.has(new URL(route.request().url()).pathname)) await gate;
    await route.continue();
  });
  return release;
}

test('the bank shows its first page at once, says the rest is coming, and answers a search as it can', async ({ page }) => {
  const release = await holdTheRest(page);
  await page.goto('/bank');
  await expect(page.locator('.bk')).toHaveCount(30, { timeout: 20_000 });
  const status = page.locator('.bank-status');
  await expect(status).toContainText('30 ข้อแรก');
  await expect(status).toContainText('กำลังโหลดที่เหลือ');
  // The status is one line, so the list does not move when the rest arrives.
  const lineHeight = await status.evaluate((el) => el.getBoundingClientRect().height);
  expect(lineHeight).toBeLessThan(60);
  const top = await page.locator('.bk').first().evaluate((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));

  // A word from the first page: found now, in what has arrived, with the note beside it.
  const word = (await page.locator('.bk-stem').first().innerText()).split(/\s+/).find((w) => /^[A-Za-z]{6,}$/.test(w)) || 'ที่';
  await page.locator('.search input').fill(word);
  await expect(status).toContainText('พบ');
  await expect(status).toContainText('กำลังโหลดที่เหลือ');

  release();
  await expect(status).not.toContainText('กำลังโหลดที่เหลือ', { timeout: 60_000 });
  await expect(status).toContainText(`จาก ${BANK.total.toLocaleString('th-TH')} ข้อ`);
  // The answer is the whole bank's, the same as searching every question on disk.
  const everything = BANK.domains.flatMap((d) => onDisk[d.id].questions);
  const expected = searchQuestions(everything, word).length;
  await expect(status.locator('b')).toHaveText(expected.toLocaleString('th-TH'));
  expect(await page.locator('.bk').first().evaluate((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))).toBe(top);
});

test('with nothing typed the bank, once complete, lists every question and offers more', async ({ page }) => {
  await page.goto('/bank?d=juris');
  await expect(page.locator('.bank-status')).toContainText('54 ข้อ', { timeout: 20_000 });
  await expect(page.locator('.bank-status')).not.toContainText('กำลังโหลดที่เหลือ');
  await expect(page.locator('.bk')).toHaveCount(30);
  await page.locator('.more button').click();
  await expect(page.locator('.bk')).toHaveCount(54);
});

test('a shard that fails leaves the first page, says the rest did not come, and the button finishes it', async ({ page, pageErrors }) => {
  const first = BANK.domains[0].id;
  const broken = new RegExp(`/bank/${first}-5\\.[0-9a-f]{8}\\.json$`);
  await page.route(broken, (route) => route.abort('connectionfailed'));
  await page.goto('/bank');
  const status = page.locator('.bank-status');
  await expect(status.locator('.notice-error')).toContainText('โหลดส่วนที่เหลือไม่สำเร็จ', { timeout: 30_000 });
  await expect(page.locator('.bk')).toHaveCount(30);
  await page.unroute(broken);
  await status.getByRole('button', { name: 'ลองอีกครั้ง' }).click();
  await expect(status.locator('.notice-error')).toHaveCount(0, { timeout: 60_000 });
  await expect(status).not.toContainText('กำลังโหลดที่เหลือ');
  expect(pageErrors.length).toBeGreaterThan(0);
  expect(pageErrors.every((m) => /ERR_CONNECTION_FAILED .*\/bank\/[a-z-]+-5\./.test(m))).toBe(true);
  pageErrors.length = 0;
});

test('a source filter starts from that source\'s own first page', async ({ page }) => {
  const release = await holdTheRest(page, (e) => e.kind === 'vca');
  await page.goto('/bank?src=vca');
  await expect(page.locator('.bk')).toHaveCount(30, { timeout: 30_000 });
  await expect(page.locator('.bank-status')).toContainText('30 ข้อแรก');
  await expect(page.locator('.bk-top .badge').first()).toHaveText('แนว VCA');
  release();
  await expect(page.locator('.bank-status')).not.toContainText('กำลังโหลดที่เหลือ', { timeout: 60_000 });
  const vca = BANK.domains.flatMap((d) => onDisk[d.id].questions).filter((q) => q.kind === 'vca').length;
  await expect(page.locator('.bank-status')).toContainText(vca.toLocaleString('th-TH'));
});
