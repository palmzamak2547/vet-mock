// Dev-only sign-off captures: the atlas at the three review widths, against a
// running preview server. The PNGs are the owner's review artifact — the
// release doc links them. Not part of any gate.
//
//   npm run build && npm run preview &          # serves dist on :4173
//   node scripts/atlas-labels/capture.mjs http://localhost:4173 ../work/atlas-labels-2026-11-07
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const [base = 'http://localhost:4173', out = 'work/atlas-labels-captures'] = process.argv.slice(2);
const widths = [
  [360, 780],
  [900, 900],
  [1400, 950],
];
await mkdir(resolve(out), { recursive: true });
const browser = await chromium.launch();
try {
  for (const [width, height] of widths) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${base}/app/atlas#specimen=canine-visible-ajou`);
    await page.waitForSelector('.vmx-atlas-render[data-atlas-state="ready"]', { timeout: 60000 });
    await page.waitForTimeout(600);
    const stage = page.locator('.vmx-atlas-render');
    await stage.screenshot({ path: resolve(out, `atlas-labels-${width}.png`) });
    console.log(`captured ${width}px → ${out}/atlas-labels-${width}.png`);
    await page.close();
  }
} finally {
  await browser.close();
}
