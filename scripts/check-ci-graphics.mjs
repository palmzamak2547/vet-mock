import { firefox } from 'playwright';
import assert from 'node:assert/strict';

const browser = await firefox.launch({ headless: !(process.env.CI && process.platform === 'linux') });
try {
  const page = await browser.newPage();
  const result = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 4;
    let reason = '';
    canvas.addEventListener('webglcontextcreationerror', event => { reason = event.statusMessage; });
    const gl = canvas.getContext('webgl2');
    if (!gl) return { available: false, reason };
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const pixel = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    return { available: true, version: gl.getParameter(gl.VERSION), renderer: gl.getParameter(gl.RENDERER), pixel: [...pixel] };
  });
  console.log(JSON.stringify({ browser: 'firefox', ...result }));
  assert.equal(result.available, true, 'CI Firefox must have WebGL2 before testing the Atlas');
  assert.deepEqual(result.pixel, [255, 0, 0, 255], 'CI graphics must actually render pixels');
} finally { await browser.close(); }
