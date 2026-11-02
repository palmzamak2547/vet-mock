// Read-aloud with the shared pre-generated clips — e2e
// ============================================================
// The speaker button on a question plays clips stored on tts.vetmock.com
// (scripts/tts-clips.mjs) when the subject's manifest lists all of them:
// the stem, then "ตัวเลือก A" + option A, and so on in screen order. The
// clip host is replaced here by a fixture: the manifest lists every clip
// the exotic subject can ask for (computed from the bank with the same
// text rules the page uses), and each clip is a few bytes. Playback is
// stubbed in the page (the test engines do not all ship an AAC decoder),
// so what is checked is the page's own behaviour: which clips it asks
// for, how many it plays, the button's state and that Stop stops. The
// fixture holds the Gemini generation (g1); the ElevenLabs one (e1) holds
// only explanations, or nothing, as on the real host for a subject it has
// not reached, so a question falls back to g1 whole.
// ============================================================
import fs from 'node:fs';
import { test, expect } from './fixtures.js';
import { ELEVEN_TTS, clipKey, clipText, optionLabel, questionLang } from '../../src/lib/tts-text.js';

test.setTimeout(60_000);

const SUBJECT = 'exotic';
const TOPIC_HAS_TEXT = 'โรคติดเชื้อในนก';

async function subjectKeys(subject) {
  const keys = new Set();
  const explain = new Set(); // e1 names of the เหตุผล clips
  for (const f of fs.readdirSync('src/data').filter((x) => /^questions-.*\.js$/.test(x))) {
    const m = await import(`../../src/data/${f}`);
    for (const rows of Object.values(m)) {
      if (!Array.isArray(rows)) continue;
      for (const q of rows) {
        if (q?.subject !== subject || typeof q.q !== 'string') continue;
        const options = Array.isArray(q.options) ? q.options.map(String) : [];
        const lang = questionLang(q.q, options);
        keys.add(await clipKey(clipText(q.q, lang)));
        if (q.explain) explain.add(await clipKey(clipText(q.explain, questionLang(q.explain, [])), ELEVEN_TTS));
        for (let i = 0; i < options.length; i++) {
          keys.add(await clipKey(optionLabel(i, lang)));
          keys.add(await clipKey(clipText(options[i], lang)));
        }
      }
    }
  }
  return { keys: [...keys], explain: [...explain] };
}

let manifest;
let explainManifest;
test.beforeAll(async () => { ({ keys: manifest, explain: explainManifest } = await subjectKeys(SUBJECT)); });

async function openQuestion(page, { clipMs, e1 = [] }) {
  const seen = { clips: [], e1: [], live: 0, manifest: 0 };
  await page.addInitScript((ms) => {
    try { window.localStorage.setItem('vmx-selected-year', '4'); } catch {}
    window.__plays = 0;
    HTMLMediaElement.prototype.canPlayType = () => 'probably';
    // The fixture clips are not real audio: the element is built without a
    // src so the browser never tries to load or decode them (WebKit on Linux
    // logs "Failed to load resource" for a blob it cannot decode).
    const NativeAudio = window.Audio;
    window.Audio = function Audio(src) { const el = new NativeAudio(); el.__src = String(src || ''); return el; };
    HTMLMediaElement.prototype.play = function play() {
      // The silent primer the button plays to unlock audio is not a clip.
      if (!this.__src || this.__src.startsWith('data:')) return Promise.resolve();
      window.__plays += 1;
      const el = this;
      el.__t = setTimeout(() => el.dispatchEvent(new Event('ended')), ms);
      return Promise.resolve();
    };
    const pause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.pause = function () { clearTimeout(this.__t); return pause.call(this); };
  }, clipMs);
  await page.route('https://tts.vetmock.com/**', (route) => {
    const url = route.request().url();
    const ok = { status: 200, headers: { 'access-control-allow-origin': '*' } };
    if (url.includes('/e1/')) {
      if (url.endsWith(`/m/${SUBJECT}.json`)) return route.fulfill({ ...ok, contentType: 'application/json', body: JSON.stringify(e1) });
      const key = url.match(/([0-9a-f]{16})\.mp4$/)?.[1];
      if (!e1.includes(key)) return route.fulfill({ status: 404, headers: ok.headers, body: 'not found' });
      seen.e1.push(key);
      return route.fulfill({ ...ok, contentType: 'audio/mp4', body: Buffer.from('clip') });
    }
    if (url.endsWith(`/m/${SUBJECT}.json`)) {
      seen.manifest += 1;
      return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(manifest) });
    }
    seen.clips.push(url.match(/([0-9a-f]{16})\.mp4$/)?.[1]);
    return route.fulfill({ status: 200, contentType: 'audio/mp4', headers: { 'access-control-allow-origin': '*' }, body: Buffer.from('clip') });
  });
  await page.route('**/api/tts*', (route) => { seen.live += 1; return route.fulfill({ status: 502, body: 'no' }); });

  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();
  await page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT }).click();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('2');
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.vmx-option').first()).toBeVisible();
  return seen;
}

test('plays the stored clips: stem, then label and option for each row', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const seen = await openQuestion(page, { clipMs: 40 });
  const options = await page.locator('.vmx-option').count();
  const button = page.getByRole('button', { name: 'อ่านคำถามออกเสียง' });

  await button.click();
  await expect(page.getByRole('button', { name: 'หยุดอ่านออกเสียง' })).toHaveAttribute('aria-pressed', 'true');
  // Done: back to idle, every piece played once, nothing went to the live voices.
  await expect(page.getByRole('button', { name: 'อ่านคำถามออกเสียง' })).toHaveAttribute('aria-pressed', 'false', { timeout: 15_000 });
  expect(await page.evaluate(() => window.__plays)).toBe(1 + 2 * options);
  expect(seen.clips.length).toBe(1 + 2 * options);
  expect(seen.clips.every((k) => manifest.includes(k))).toBe(true);
  expect(seen.live).toBe(0);
  expect(seen.manifest).toBe(1);

  // A second listen comes from the device's own copy: no new downloads.
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await expect(page.getByRole('button', { name: 'หยุดอ่านออกเสียง' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'อ่านคำถามออกเสียง' })).toHaveAttribute('aria-pressed', 'false', { timeout: 15_000 });
  await expect.poll(() => page.evaluate(() => window.__plays)).toBe(2 * (1 + 2 * options));
  expect(seen.clips.length).toBe(1 + 2 * options);
  expect(errors.filter((e) => !/Vercel|vercel-insights|va\.vercel|Failed to load resource.*404|downloadable font/i.test(e))).toEqual([]);
});

test('Stop ends the read-aloud at once and nothing else plays', async ({ page }) => {
  await openQuestion(page, { clipMs: 3000 });
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  const stop = page.getByRole('button', { name: 'หยุดอ่านออกเสียง' });
  await expect(stop).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => window.__plays)).toBe(1);
  await stop.click();
  await expect(page.getByRole('button', { name: 'อ่านคำถามออกเสียง' })).toHaveAttribute('aria-pressed', 'false');
  await page.waitForTimeout(3500);
  expect(await page.evaluate(() => window.__plays)).toBe(1);
});

test('the เหตุผล row reads its explanation in the newer voice, apart from the question', async ({ page }) => {
  const seen = await openQuestion(page, { clipMs: 40, e1: explainManifest });
  await page.locator('.vmx-option').first().click();
  const panel = page.locator('.vmx-instant-feedback');
  await expect(panel).toBeVisible();
  const listen = panel.getByRole('button', { name: 'อ่านเหตุผลออกเสียง' });
  await expect(listen).toBeVisible();
  const size = async () => { const b = await panel.boundingBox(); return { width: b.width, height: b.height }; };
  const before = await size();
  await listen.click();
  await expect(panel.getByRole('button', { name: 'หยุดอ่านออกเสียง' })).toHaveAttribute('aria-pressed', 'true');
  // The question's own button is not the one reading.
  await expect(page.getByRole('button', { name: 'อ่านคำถามออกเสียง' })).toHaveAttribute('aria-pressed', 'false');
  await expect(listen).toHaveAttribute('aria-pressed', 'false', { timeout: 15_000 });
  expect(await page.evaluate(() => window.__plays)).toBe(1);
  expect(seen.e1.length).toBe(1);
  expect(explainManifest).toContain(seen.e1[0]);
  expect(seen.live).toBe(0);
  // Reading changed nothing about the panel's size.
  expect(await size()).toEqual(before);
});
