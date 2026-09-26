// ============================================================
// tts-ssml-escape — question text reaches the neural voice as text, not markup
// ============================================================
// B18 (bug hunt 2026-09-26). msedge-tts interpolates the text into its SSML
// template (<prosody>…</prosody>) without escaping it. A question such as
// "Doxorubicin < DNA < Antibody" or "ย้อม H&E" (202 deliverable questions
// carry < > or &) made malformed SSML, no audio came back, /api/tts answered
// 502, and the client restarted the whole question in the device voice.
//
// Node's module hooks swap the msedge-tts import, for api/tts.js only, for a
// stand-in that records exactly what the handler hands the library.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = String(context.parentURL || '').split('?')[0];
    if (parent.endsWith('/api/tts.js') && specifier === 'msedge-tts') {
      return { url: 'vetmock-test:msedge-tts', shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'vetmock-test:msedge-tts') {
      return {
        format: 'module', shortCircuit: true,
        source: `import { Readable } from 'node:stream';
export const OUTPUT_FORMAT = { AUDIO_24KHZ_48KBITRATE_MONO_MP3: 'mp3' };
export class MsEdgeTTS {
  async setMetadata() {}
  async toStream(input) { globalThis.__vmxTtsInputs.push(input); return { audioStream: Readable.from([Buffer.from('ID3')]) }; }
  close() {}
}`,
      };
    }
    return nextLoad(url, context);
  },
});

globalThis.__vmxTtsInputs = [];
const { default: handler } = await import('../../api/tts.js');

async function speak(text) {
  const res = { statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; }, status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; return res; }, send(b) { res.body = b; return res; }, end() { return res; } };
  await handler({ method: 'POST', headers: { host: 'vetmock.test', 'content-type': 'application/json' },
    socket: { remoteAddress: '10.88.0.1' }, body: JSON.stringify({ text, lang: 'en' }) }, res);
  return res;
}

// What the library will place between <prosody> and </prosody>: any raw '<'
// opens a tag, and any '&' must begin one of the XML entities.
function wellFormedText(input) {
  return !/[<>]/.test(input) && !/&(?!(?:amp|lt|gt|quot|apos);)/.test(input);
}

test('< > and & in a question are escaped before they reach the SSML template', async () => {
  for (const text of ['Doxorubicin < DNA < Antibody', 'ย้อม H&E แล้วดู nucleus', 'pH > 7.4 & HCO3 > 26', 'already &amp; escaped?']) {
    globalThis.__vmxTtsInputs = [];
    const res = await speak(text);
    assert.equal(res.statusCode, 200, text);
    const [input] = globalThis.__vmxTtsInputs;
    assert.ok(input, 'the handler reached the library');
    assert.ok(wellFormedText(input), `malformed SSML text node for: ${text} -> ${input}`);
  }
});

test('plain text reaches the library unchanged', async () => {
  globalThis.__vmxTtsInputs = [];
  await speak('Parvovirus enteritis in puppies');
  assert.equal(globalThis.__vmxTtsInputs[0], 'Parvovirus enteritis in puppies');
});
