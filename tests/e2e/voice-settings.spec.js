// The listener's voice settings — e2e
// ============================================================
// The read-aloud bar's speed button opens one small dialog: named settings,
// speed, the device voice's tone, which device voice reads, and ลองฟัง. The
// device's speech engine is a stub here (an iPad's voices: two Thai, one
// English), so what is checked is what the page asks of it: the voice, the
// speed and the tone of each sentence, and that nothing in the dialog ever
// asks the network for a voice. Inside a timed paper the button keeps its
// old job (the next speed) and no dialog opens over the clock.
// ============================================================
import { test, expect, openAdjust } from './fixtures.js';

test.setTimeout(60_000);

const SUBJECT = 'exotic';
const TOPIC_HAS_TEXT = 'โรคติดเชื้อในนก';

// opts.lateMs: the device lists no voice until then, then fires voiceschanged.
// opts.mute: a voice by that name takes utterances and never starts.
// opts.only: the names of the voices this device has (default: Kanya, Narisa, Samantha).
async function stubSpeech(page, opts = {}) {
  await page.addInitScript(({ lateMs = 0, mute = '', only = ['Kanya', 'Narisa', 'Samantha'] }) => {
    window.__said = [];
    const born = Date.now();
    const listeners = new Set();
    const all = [
      { name: 'Kanya', lang: 'th-TH', voiceURI: 'Kanya', localService: true, default: true },
      { name: 'Narisa', lang: 'th-TH', voiceURI: 'Narisa', localService: true, default: false },
      { name: 'Samantha', lang: 'en-US', voiceURI: 'Samantha', localService: true, default: false },
    ];
    all.push({ name: 'Microsoft Pattara - Thai (Thailand)', lang: 'th-TH', voiceURI: 'Pattara', localService: true, default: false });
    const mine = all.filter((v) => only.some((n) => v.name.startsWith(n)));
    const voices = () => (Date.now() - born < lateMs ? [] : mine);
    if (lateMs) setTimeout(() => { for (const f of listeners) f(); }, lateMs);
    let current = null;
    const synth = {
      speak(u) {
        current = u;
        window.__said.push({ text: u.text, rate: u.rate, pitch: u.pitch, voice: u.voice?.name || null });
        if (mute && u.voice?.name === mute) return;
        setTimeout(() => { if (current !== u) return; u.onstart?.(); u.t = setTimeout(() => { if (current === u) { current = null; u.onend?.(); } }, 900); }, 5);
      },
      cancel() { const u = current; current = null; if (u) { clearTimeout(u.t); u.onerror?.({ error: 'interrupted' }); } },
      getVoices: voices, pause() {}, resume() {},
      get speaking() { return Boolean(current); }, pending: false,
      addEventListener(type, f) { if (type === 'voiceschanged') listeners.add(f); },
      removeEventListener(type, f) { listeners.delete(f); },
    };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, get: () => synth });
    window.SpeechSynthesisUtterance = function (text) { this.text = text; };
  }, opts);
}

// No stored clips anywhere: the device voice reads. Every request for a
// voice (the clip host, the cloud voice) is counted.
async function routeVoices(page) {
  const seen = { clipHost: 0, cloud: 0 };
  await page.route('https://tts.vetmock.com/**', (route) => { seen.clipHost += 1; return route.fulfill({ status: 404, headers: { 'access-control-allow-origin': '*' }, body: 'not found' }); });
  await page.route('**/api/tts*', (route) => { seen.cloud += 1; return route.fulfill({ status: 502, body: 'no' }); });
  return seen;
}

async function openPractice(page) {
  await page.addInitScript(() => { try { window.localStorage.setItem('vmx-selected-year', '4'); } catch {} });
  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();
  await page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT }).click();
  await openAdjust(page);
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('2');
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
}

test('the bar opens the voice settings; speed, tone and voice are heard at once and kept on the device', async ({ page }) => {
  await stubSpeech(page);
  const seen = await routeVoices(page);
  await openPractice(page);
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  const bar = page.getByRole('region', { name: 'เสียงอ่าน' });
  await expect(bar.getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  const barBox = await bar.boundingBox();
  const card = page.locator('.vmx-question-card');
  const cardBox = await card.boundingBox();

  // Two taps from the bar to any speed: the button, then the speed.
  const tune = bar.getByRole('button', { name: /ปรับเสียงอ่าน ความเร็ว 1 เท่า/ });
  await expect(tune).toHaveAttribute('aria-haspopup', 'dialog');
  await tune.click();
  const sheet = page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('radio', { name: /ปกติ/ }).first()).toHaveAttribute('aria-checked', 'true');
  // Opening it moved nothing on the card.
  expect(await card.boundingBox()).toEqual(cardBox);

  // A named setting: slow and clear.
  await sheet.getByRole('radio', { name: /ช้าและชัด/ }).click();
  await expect(sheet.getByRole('radio', { name: '0.75 เท่า' })).toHaveAttribute('aria-checked', 'true');
  await expect(bar.getByRole('button', { name: /ความเร็ว 0.75 เท่า/ })).toHaveText('0.75x');
  await expect.poll(() => page.evaluate(() => window.__said.at(-1).rate)).toBeLessThan(0.8);

  // The tone: one step up is สูง, and the sentence being said starts again in it.
  const pitch = sheet.getByRole('slider', { name: /โทนเสียง/ });
  await pitch.focus();
  await page.keyboard.press('ArrowRight');
  await expect(pitch).toHaveAttribute('aria-valuetext', 'สูง');
  await expect.poll(() => page.evaluate(() => window.__said.at(-1).pitch)).toBe(1.15);
  await expect(sheet.getByRole('radio', { name: /ช้าและชัด/ })).toHaveAttribute('aria-checked', 'false');

  // Which device voice: the Thai ones by name.
  const thai = sheet.getByRole('combobox', { name: 'เสียงของเครื่อง ภาษาไทย' });
  await expect(thai.locator('option')).toHaveText(['เลือกให้อัตโนมัติ', 'Kanya', 'Narisa']);
  // The drawn question may be in English: then it keeps its English voice and
  // only a Thai question takes the new Thai voice.
  const english = (await page.evaluate(() => window.__said.at(-1).voice)) === 'Samantha';
  await thai.selectOption('Narisa');
  await expect.poll(() => page.evaluate(() => window.__said.at(-1).voice)).toBe(english ? 'Samantha' : 'Narisa');
  await expect(sheet.getByRole('combobox', { name: /ภาษาอังกฤษ/ }).locator('option')).toHaveText(['เลือกให้อัตโนมัติ', 'Samantha']);

  // ลองฟัง: one fixed sentence, the device voice, the settings as they are.
  await sheet.getByRole('button', { name: 'ลองฟัง' }).click();
  await expect.poll(() => page.evaluate(() => window.__said.at(-1).text)).toContain('นี่คือเสียงอ่านตามที่ตั้งไว้');
  const last = await page.evaluate(() => window.__said.at(-1));
  expect(last).toMatchObject({ voice: 'Narisa', pitch: 1.15 });
  expect(last.rate).toBeLessThan(0.8);
  // The reading paused for the sample.
  await expect(bar.getByRole('status')).toHaveText('หยุดชั่วคราว');

  await sheet.getByRole('button', { name: 'เสร็จ' }).click();
  await expect(sheet).toHaveCount(0);
  expect((await bar.boundingBox()).height).toBe(barBox.height);
  // Nothing in the dialog asked for a voice from the network.
  expect(seen.cloud).toBe(0);

  // Kept on this device, read back after a reload.
  const stored = await page.evaluate(() => JSON.parse(window.localStorage.getItem('vmx-tts-prefs')));
  expect(stored).toMatchObject({ v: 2, rate: 0.75, pitch: 1.15, voiceTh: 'Narisa' });
  await openPractice(page);
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  await expect(page.getByRole('region', { name: 'เสียงอ่าน' }).getByRole('button', { name: /ความเร็ว 0.75 เท่า/ })).toBeVisible();
  // A Thai question is read by Narisa (an English one keeps Samantha), and the dialog shows the choice.
  await expect.poll(() => page.evaluate(() => window.__said.at(-1)?.voice)).toMatch(/^(Narisa|Samantha)$/);

  // คืนค่าเริ่มต้น puts everything back.
  await page.getByRole('region', { name: 'เสียงอ่าน' }).getByRole('button', { name: /ปรับเสียงอ่าน/ }).click();
  await expect(page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' }).getByRole('combobox', { name: 'เสียงของเครื่อง ภาษาไทย' })).toHaveValue('Narisa');
  await page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' }).getByRole('button', { name: 'คืนค่าเริ่มต้น' }).click();
  await expect(page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' }).getByRole('radio', { name: /ปกติ/ }).first()).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' })).toHaveCount(0);
  await page.evaluate(() => window.localStorage.removeItem('vmx-tts-prefs'));
});

test('inside a timed paper the speed button steps the speed and opens nothing', async ({ page }) => {
  await stubSpeech(page);
  await routeVoices(page);
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('voice-timed-fixture')) {
      sessionStorage.setItem('voice-timed-fixture', '1');
      const now = Date.now();
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null,
        questions: [{ id: 6201, subject: 'vca', type: 'mcq', q: 'สุกรป่วยด้วยโรคใดมากที่สุดในฤดูฝน', options: ['โรคปากและเท้าเปื่อย', 'โรคพิษสุนัขบ้า', 'โรคบิด'], answer: 0, explain: 'ตัวอย่างสำหรับตรวจเสียงอ่าน' }],
        answers: {}, currentIdx: 0, useTimer: true, timePerQ: 600,
        questionDeadline: now + 600_000, examStartTime: now,
        savedAt: now, mode: 'exam', clock: 'session', selectedYear: 4,
      }));
    }
  });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-timer')).toBeVisible();
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  const bar = page.getByRole('region', { name: 'เสียงอ่าน' });
  await expect(bar.getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  await expect(bar.getByRole('button', { name: /ปรับเสียงอ่าน/ })).toHaveCount(0);
  await bar.getByRole('button', { name: /ความเร็ว 1 เท่า แตะเพื่อเปลี่ยนเป็น 1.25 เท่า/ }).click();
  await expect(bar.getByRole('button', { name: /ความเร็ว 1.25 เท่า/ })).toHaveText('1.25x');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await bar.getByRole('button', { name: 'ปิดเสียงอ่าน' }).click();
  await page.evaluate(() => window.localStorage.removeItem('vmx-tts-prefs'));
});

test('a voice list that arrives late is waited for, never reported as no Thai voice', async ({ page }) => {
  await stubSpeech(page, { lateMs: 15_000 });
  await routeVoices(page);
  await openPractice(page);
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  const bar = page.getByRole('region', { name: 'เสียงอ่าน' });
  await expect(bar).toBeVisible();
  await bar.getByRole('button', { name: /ปรับเสียงอ่าน/ }).click();
  const sheet = page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' });
  const thai = sheet.getByRole('combobox', { name: 'เสียงของเครื่อง ภาษาไทย' });
  await expect(thai).toBeDisabled();
  await expect(sheet).not.toContainText('เครื่องนี้ไม่มีเสียงอ่านภาษาไทย');
  // The device lists its voices: the dialog reads the list again.
  await expect(thai.locator('option')).toHaveText(['เลือกให้อัตโนมัติ', 'Kanya', 'Narisa'], { timeout: 20_000 });
  await expect(thai).toBeEnabled();
  await expect(sheet).not.toContainText('เครื่องนี้ไม่มีเสียงอ่านภาษาไทย');
  await expect(sheet.locator('.vmx-voice-now')).toContainText('เสียงของเครื่อง (Kanya)');
});

test('the dialog says which voice reads here, and ลองฟัง takes that voice: the cloud for a plain device voice, the device voice once toned', async ({ page }) => {
  await stubSpeech(page, { only: ['Microsoft Pattara'] });
  const seen = await routeVoices(page);
  await openPractice(page);
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  const bar = page.getByRole('region', { name: 'เสียงอ่าน' });
  await expect(bar).toBeVisible();
  await bar.getByRole('button', { name: /ปรับเสียงอ่าน/ }).click();
  const sheet = page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' });
  const now = sheet.locator('.vmx-voice-now');
  await expect(now).toContainText('เสียงออนไลน์');
  await expect(sheet).toContainText('โทนเสียงและการเลือกเสียงใช้กับเสียงของเครื่องเท่านั้น');
  const cloud = seen.cloud;
  await sheet.getByRole('button', { name: 'ลองฟัง' }).click();
  await expect.poll(() => seen.cloud).toBeGreaterThan(cloud);
  // Toned, the device voice reads, and the sample is the device voice with the tone.
  const pitch = sheet.getByRole('slider', { name: /โทนเสียง/ });
  await pitch.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(now).toContainText('เสียงของเครื่อง (Microsoft Pattara');
  // The first sample has finished (its button reads ลองฟัง again) before the second.
  await expect(sheet.getByRole('button', { name: 'ลองฟัง' })).toBeVisible({ timeout: 15_000 });
  const asked = seen.cloud;
  const before = await page.evaluate(() => window.__said.length);
  await sheet.getByRole('button', { name: 'ลองฟัง' }).click();
  // The new sample: the fixed sentence, the device voice, the tone.
  await expect.poll(() => page.evaluate((n) => window.__said.slice(n).find((s) => s.text.includes('นี่คือเสียงอ่านตามที่ตั้งไว้')) || null, before))
    .toMatchObject({ voice: 'Microsoft Pattara - Thai (Thailand)', pitch: 0.85 });
  expect(seen.cloud).toBe(asked);
  await sheet.getByRole('button', { name: 'คืนค่าเริ่มต้น' }).click();
  await page.evaluate(() => window.localStorage.removeItem('vmx-tts-prefs'));
});

test('in a timed paper a chosen voice that does not speak gives way to the device\'s own voice, never silence', async ({ page }) => {
  await stubSpeech(page, { mute: 'Narisa' });
  const seen = await routeVoices(page);
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-tts-prefs', JSON.stringify({ v: 2, rate: 1, pitch: 1, voiceTh: 'Narisa', voiceEn: '' }));
    if (!sessionStorage.getItem('voice-mute-fixture')) {
      sessionStorage.setItem('voice-mute-fixture', '1');
      const now = Date.now();
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null,
        questions: [{ id: 6202, subject: 'vca', type: 'mcq', q: 'โคนมป่วยด้วยโรคใดมากที่สุดหลังคลอด', options: ['ไข้น้ำนม', 'ปากและเท้าเปื่อย', 'บิด'], answer: 0, explain: 'ตัวอย่างสำหรับตรวจเสียงอ่าน' }],
        answers: {}, currentIdx: 0, useTimer: true, timePerQ: 600,
        questionDeadline: now + 600_000, examStartTime: now,
        savedAt: now, mode: 'exam', clock: 'session', selectedYear: 4,
      }));
    }
  });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-timer')).toBeVisible();
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  const bar = page.getByRole('region', { name: 'เสียงอ่าน' });
  // The chosen voice was asked first, did not start, and Kanya read instead.
  await expect.poll(() => page.evaluate(() => window.__said.map((s) => s.voice)), { timeout: 15_000 }).toEqual(expect.arrayContaining(['Narisa', 'Kanya']));
  await expect(bar.getByRole('status')).toHaveText('เสียงอ่านของเครื่อง');
  expect(seen.cloud).toBe(0);
  await bar.getByRole('button', { name: 'ปิดเสียงอ่าน' }).click();
  await page.evaluate(() => window.localStorage.removeItem('vmx-tts-prefs'));
});

// The cloud voice answers here. Its pieces play on the read-aloud's element,
// whose src is only remembered (the fixture is not real audio) and which
// "plays" each piece for CLIP_MS; window.__clips counts the pieces played.
const CLIP_MS = 1500;
async function stubCloudPlayer(page) {
  await page.addInitScript((ms) => {
    window.__clips = 0;
    HTMLMediaElement.prototype.canPlayType = () => 'probably';
    Object.defineProperty(HTMLMediaElement.prototype, 'src', {
      configurable: true,
      get() { return this.__src || ''; },
      set(v) { clearTimeout(this.__t); this.__src = String(v); },
    });
    const removeAttribute = Element.prototype.removeAttribute;
    HTMLMediaElement.prototype.removeAttribute = function (name) { if (name === 'src') this.__src = ''; return removeAttribute.call(this, name); };
    HTMLMediaElement.prototype.load = function () {};
    HTMLMediaElement.prototype.play = function play() {
      const src = this.__src || '';
      if (!src.startsWith('blob:')) return Promise.resolve();
      window.__clips += 1;
      const el = this;
      clearTimeout(el.__t);
      queueMicrotask(() => el.dispatchEvent(new Event('playing')));
      el.__t = setTimeout(() => { if (el.__src === src) el.dispatchEvent(new Event('ended')); }, ms);
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function () { clearTimeout(this.__t); };
  }, CLIP_MS);
  await page.route('https://tts.vetmock.com/**', (route) => route.fulfill({ status: 404, headers: { 'access-control-allow-origin': '*' }, body: 'not found' }));
  await page.route('**/api/tts*', (route) => route.fulfill({ status: 200, contentType: 'audio/mpeg', body: Buffer.from('cloud piece') }));
}

// One Thai question of several sentences, in an untimed paper (the dialog
// opens there), so every run reads the same pieces.
async function openThaiQuestion(page, prefs = null) {
  await page.addInitScript((p) => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (p) localStorage.setItem('vmx-tts-prefs', JSON.stringify(p));
    if (!sessionStorage.getItem('voice-follow-fixture')) {
      sessionStorage.setItem('voice-follow-fixture', '1');
      const now = Date.now();
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null,
        questions: [{ id: 6203, subject: 'vca', type: 'mcq', q: 'สุกรขุนอายุสิบสองสัปดาห์มีไข้สูงและไอ. ผิวหนังบริเวณใบหูมีสีม่วงคล้ำ. สุกรหลายตัวในคอกเดียวกันตายภายในสามวัน. โรคใดเป็นไปได้มากที่สุด', options: ['อหิวาต์สุกรแอฟริกา', 'โรคปากและเท้าเปื่อย', 'โรคบิดมูกเลือด', 'โรคพิษสุนัขบ้า'], answer: 0, explain: 'ตัวอย่างสำหรับตรวจเสียงอ่าน' }],
        answers: {}, currentIdx: 0, useTimer: false, timePerQ: 0,
        examStartTime: now, savedAt: now, mode: 'exam', clock: 'session', selectedYear: 4,
      }));
    }
  }, prefs);
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
}

const PATTARA = 'Microsoft Pattara - Thai (Thailand)';

test('a tone set while the cloud voice reads: the rest of the question is the device voice with that tone', async ({ page }) => {
  await stubSpeech(page, { only: ['Microsoft Pattara'] });
  await stubCloudPlayer(page);
  await openThaiQuestion(page);
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  const bar = page.getByRole('region', { name: 'เสียงอ่าน' });
  await expect.poll(() => page.evaluate(() => window.__clips)).toBeGreaterThan(0);
  await bar.getByRole('button', { name: /ปรับเสียงอ่าน/ }).click();
  const sheet = page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' });
  await expect(sheet.locator('.vmx-voice-now')).toContainText('เสียงออนไลน์');
  expect(await page.evaluate(() => window.__said.length)).toBe(0);
  const pitch = sheet.getByRole('slider', { name: /โทนเสียง/ });
  // One step down; pressed again only if the key reached nothing (the dialog
  // can still be settling its focus on a slow engine).
  await expect(async () => {
    if ((await pitch.getAttribute('aria-valuetext')) === 'ปกติ') { await pitch.focus(); await page.keyboard.press('ArrowLeft'); }
    await expect(pitch).toHaveAttribute('aria-valuetext', 'ทุ้ม', { timeout: 1000 });
  }).toPass({ timeout: 10_000 });
  await expect(sheet.locator('.vmx-voice-now')).toContainText('เสียงของเครื่อง (Microsoft Pattara');
  // The sentence being read starts again in the device voice, with the tone.
  await expect.poll(() => page.evaluate(() => window.__said[0] || null)).toMatchObject({ voice: PATTARA, pitch: 0.85, rate: 0.88 });
  const clips = await page.evaluate(() => window.__clips);
  // And the rest of the question goes on in it: no cloud piece plays again.
  await expect.poll(() => page.evaluate(() => window.__said.length), { timeout: 15_000 }).toBeGreaterThan(2);
  const said = await page.evaluate(() => window.__said);
  expect(said.every((s) => s.voice === PATTARA && s.pitch === 0.85)).toBe(true);
  expect(await page.evaluate(() => window.__clips)).toBe(clips);
  await sheet.getByRole('button', { name: 'คืนค่าเริ่มต้น' }).click();
  await page.evaluate(() => window.localStorage.removeItem('vmx-tts-prefs'));
});

test('the settings put back while the device voice reads: the rest of the question is the cloud voice, as the dialog says', async ({ page }) => {
  await stubSpeech(page, { only: ['Microsoft Pattara'] });
  await stubCloudPlayer(page);
  await openThaiQuestion(page, { v: 2, rate: 1, pitch: 0.85, voiceTh: '', voiceEn: '' });
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();
  const bar = page.getByRole('region', { name: 'เสียงอ่าน' });
  await expect.poll(() => page.evaluate(() => window.__said[0] || null)).toMatchObject({ voice: PATTARA, pitch: 0.85 });
  await bar.getByRole('button', { name: /ปรับเสียงอ่าน/ }).click();
  const sheet = page.getByRole('dialog', { name: 'ตั้งค่าเสียงอ่าน' });
  await expect(sheet.locator('.vmx-voice-now')).toContainText('เสียงของเครื่อง (Microsoft Pattara');
  await sheet.getByRole('button', { name: 'คืนค่าเริ่มต้น' }).click();
  await expect(sheet.locator('.vmx-voice-now')).toContainText('เสียงออนไลน์');
  // The cloud voice takes over, and the device voice says nothing more.
  await expect.poll(() => page.evaluate(() => window.__clips)).toBeGreaterThan(0);
  const spoken = await page.evaluate(() => window.__said.length);
  await expect.poll(() => page.evaluate(() => window.__clips), { timeout: 15_000 }).toBeGreaterThan(2);
  expect(await page.evaluate(() => window.__said.length)).toBe(spoken);
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.localStorage.removeItem('vmx-tts-prefs'));
});
