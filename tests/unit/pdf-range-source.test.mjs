// The reader draws page one of a library PDF before the whole file arrives
// (src/lib/pdf-range-source.js): one whole download fed to pdf.js as it comes,
// plus a few byte ranges for the bytes it will not reach for a while. These
// pin when a range is asked for, what is trusted, and that every way it can go
// wrong ends on the whole download, never on a hang or on wrong bytes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RangedPdfSource, planRange, rangeableLength, tailBytes,
  RANGE_CHUNK, MAX_RANGES, NEAR_BYTES, MID_BLOCK,
} from '../../src/lib/pdf-range-source.js';

const MB = 1024 * 1024;

function headers(h) { return new Response(null, { status: h.status || 200, headers: h }); }

test('only a whole, unencoded response with a length and Accept-Ranges: bytes is read by range', () => {
  const ok = { 'content-length': '1000', 'accept-ranges': 'bytes' };
  assert.equal(rangeableLength(new Response('x', { headers: ok })), 1000);
  assert.equal(rangeableLength(headers({ 'content-length': '1000', 'accept-ranges': 'none' })), 0, 'today\'s server says none');
  assert.equal(rangeableLength(headers({ 'content-length': '1000' })), 0, 'nothing said');
  assert.equal(rangeableLength(headers({ ...ok, 'content-encoding': 'gzip' })), 0, 'a compressed length is not the file\'s');
  assert.equal(rangeableLength(headers({ 'accept-ranges': 'bytes' })), 0, 'no length');
  assert.equal(rangeableLength(headers({ ...ok, 'x-vetmock-library-hash': 'abc' })), 0, 'the kept copy is read whole');
  assert.equal(rangeableLength(new Response('x', { status: 206, headers: ok })), 0);
  assert.equal(rangeableLength(null), 0);
});

test('a request the download will reach soon waits for it; the tail is fetched in one read', () => {
  const length = 25 * MB;
  const base = { length, streamed: 0, rate: 0 };
  assert.deepEqual(planRange(0, RANGE_CHUNK, base), { kind: 'wait' });
  assert.deepEqual(planRange(NEAR_BYTES - RANGE_CHUNK, NEAR_BYTES, base), { kind: 'wait' });
  // A fast download covers more ground in the same time.
  assert.deepEqual(planRange(2 * MB, 2 * MB + RANGE_CHUNK, { ...base, streamed: MB, rate: 4 * MB }), { kind: 'wait' });
  const tail = planRange(length - RANGE_CHUNK, length, base);
  assert.equal(tail.kind, 'fetch');
  assert.equal(tail.to, length);
  assert.equal(tail.from % RANGE_CHUNK, 0, 'pdf.js takes ranges on its chunk boundaries');
  assert.ok(length - tail.from >= tailBytes(length) && length - tail.from < tailBytes(length) + RANGE_CHUNK);
  const mid = planRange(10 * MB + 5, 10 * MB + 100, base);
  assert.deepEqual(mid, { kind: 'fetch', from: 10 * MB, to: 10 * MB + MID_BLOCK });
  assert.ok(tailBytes(100 * MB) <= 2 * MB, 'never more than 2 MB of tail');
  assert.equal(tailBytes(100 * 1024), 100 * 1024, 'a small file\'s tail is the file');
});

test('no range once ranges are off, used up, closed, or refused; a broken download leaves nothing to wait for', () => {
  const length = 25 * MB;
  const far = [20 * MB, 20 * MB + RANGE_CHUNK];
  for (const off of [{ open: false }, { rangeOk: false }, { used: MAX_RANGES }]) {
    assert.deepEqual(planRange(...far, { length, streamed: 0, ...off }), { kind: 'wait' }, JSON.stringify(off));
  }
  assert.equal(planRange(MB, MB + RANGE_CHUNK, { length, streamed: MB - 10, streaming: false }).kind, 'fetch');
  assert.deepEqual(planRange(0, RANGE_CHUNK, { length, streamed: RANGE_CHUNK }), { kind: 'wait' }, 'already here');
});

// ── the source, against a fake pdf.js transport and a fake server ──────────

function fakeTransport() {
  const t = { progressive: [], ranges: [], progress: [], done: false };
  t.onDataProgressiveRead = (chunk) => t.progressive.push(chunk.byteLength);
  t.onDataProgress = (loaded, total) => t.progress.push([loaded, total]);
  t.onDataProgressiveDone = () => { t.done = true; };
  t.onDataRange = (begin, chunk) => t.ranges.push({ begin, chunk: Uint8Array.from(chunk) });
  return t;
}

// A body that hands out the file in pieces, holding each until released.
function heldBody(bytes, piece = RANGE_CHUNK) {
  let at = 0;
  let release;
  let fail = null;
  const gates = [];
  const body = new ReadableStream({
    async pull(controller) {
      await new Promise((r) => { release = r; gates.push(r); });
      if (fail) { controller.error(fail); return; }
      if (at >= bytes.length) { controller.close(); return; }
      controller.enqueue(bytes.slice(at, at + piece));
      at += piece;
    },
  }, { highWaterMark: 0 });
  return {
    body,
    async step(n = 1) { for (let i = 0; i < n; i++) { await tick(); release?.(); await tick(); } },
    async rest() { while (at < bytes.length) await this.step(); await this.step(); },
    async breakNow() { fail = new Error('network'); await tick(); release?.(); await tick(); },
  };
}
const tick = () => new Promise((r) => setTimeout(r, 0));

function fileOf(length) { return Uint8Array.from({ length }, (_, i) => i % 251); }

function server(bytes, { answer = 'ranges' } = {}) {
  const asked = [];
  const fetchImpl = async (_url, init) => {
    const range = init?.headers?.Range;
    asked.push(range);
    const m = /^bytes=(\d+)-(\d+)$/.exec(range || '');
    if (answer === 'ignore' || !m) return new Response(bytes, { status: 200 });
    if (answer === 'wrong') return new Response(bytes.slice(0, 10), { status: 206, headers: { 'content-range': `bytes 0-9/${bytes.length}` } });
    const from = Number(m[1]); const to = Number(m[2]);
    return new Response(bytes.slice(from, to + 1), { status: 206, headers: { 'content-range': `bytes ${from}-${to}/${bytes.length}` } });
  };
  return { fetchImpl, asked };
}

test('page one\'s far bytes come by one range, exactly as asked, and the rest of the download still arrives', async () => {
  const length = 4 * MB;
  const bytes = fileOf(length);
  const held = heldBody(bytes);
  const { fetchImpl, asked } = server(bytes);
  const source = new RangedPdfSource({ url: '/doc', response: new Response(held.body), length, fetchImpl });
  const transport = source.attach(fakeTransport());
  await held.step(2);
  // pdf.js asks for the trailer at the very end, then the table before it.
  transport.requestDataRange(length - RANGE_CHUNK, length);
  await tick(); await tick();
  assert.equal(asked.length, 1);
  const [{ begin, chunk }] = transport.ranges;
  assert.equal(begin, length - RANGE_CHUNK);
  assert.deepEqual(chunk, bytes.slice(length - RANGE_CHUNK, length), 'the bytes asked for, not the block around them');
  transport.requestDataRange(length - 3 * RANGE_CHUNK, length - 2 * RANGE_CHUNK);
  await tick();
  assert.equal(asked.length, 1, 'the second request is answered from the tail already read');
  assert.deepEqual(transport.ranges[1].chunk, bytes.slice(length - 3 * RANGE_CHUNK, length - 2 * RANGE_CHUNK));
  // A request near the download's position is left to it.
  transport.requestDataRange(3 * RANGE_CHUNK, 4 * RANGE_CHUNK);
  await tick();
  assert.equal(asked.length, 1);
  await held.rest();
  await source.done;
  assert.equal(transport.done, true);
  assert.equal(transport.progressive.reduce((a, b) => a + b, 0), length, 'every byte through the download as well');
  assert.equal(source.complete, true);
});

test('a server that ignores Range turns ranges off and pdf.js waits for the download', async () => {
  const length = 4 * MB;
  const bytes = fileOf(length);
  const held = heldBody(bytes);
  const { fetchImpl, asked } = server(bytes, { answer: 'ignore' });
  const source = new RangedPdfSource({ url: '/doc', response: new Response(held.body), length, fetchImpl });
  const transport = source.attach(fakeTransport());
  await held.step();
  transport.requestDataRange(length - RANGE_CHUNK, length);
  await tick(); await tick();
  assert.equal(transport.ranges.length, 0, 'a 200 is never handed over as the range');
  assert.equal(source.rangeOk, false);
  transport.requestDataRange(2 * MB, 2 * MB + RANGE_CHUNK);
  await tick();
  assert.equal(asked.length, 1, 'no second try');
  await held.rest();
  await source.done;
  assert.equal(transport.done, true);
});

test('a 206 for the wrong bytes is refused the same way', async () => {
  const length = 4 * MB;
  const bytes = fileOf(length);
  const held = heldBody(bytes);
  const { fetchImpl } = server(bytes, { answer: 'wrong' });
  const source = new RangedPdfSource({ url: '/doc', response: new Response(held.body), length, fetchImpl });
  const transport = source.attach(fakeTransport());
  transport.requestDataRange(length - RANGE_CHUNK, length);
  await tick(); await tick(); await tick();
  assert.equal(transport.ranges.length, 0);
  assert.equal(source.rangeOk, false);
  await held.rest();
});

test('once page one is drawn, and after MAX_RANGES, every request waits for the download', async () => {
  const length = 40 * MB;
  const bytes = fileOf(length);
  const held = heldBody(bytes);
  const { fetchImpl, asked } = server(bytes);
  const source = new RangedPdfSource({ url: '/doc', response: new Response(held.body), length, fetchImpl });
  const transport = source.attach(fakeTransport());
  for (let i = 0; i < MAX_RANGES + 3; i++) transport.requestDataRange((5 + 3 * i) * MB, (5 + 3 * i) * MB + RANGE_CHUNK);
  await tick(); await tick();
  assert.equal(asked.length, MAX_RANGES);
  const settled = new RangedPdfSource({ url: '/doc', response: new Response(heldBody(bytes).body), length, fetchImpl });
  const t2 = settled.attach(fakeTransport());
  settled.settle();
  t2.requestDataRange(length - RANGE_CHUNK, length);
  await tick();
  assert.equal(asked.length, MAX_RANGES, 'no range after settle');
  source.abort(); settled.abort();
});

test('a download that breaks is finished by range; without ranges the reader is told', async () => {
  const length = 4 * MB;
  const bytes = fileOf(length);
  const held = heldBody(bytes);
  const { fetchImpl, asked } = server(bytes);
  const source = new RangedPdfSource({ url: '/doc', response: new Response(held.body), length, fetchImpl });
  const transport = source.attach(fakeTransport());
  source.settle();
  await held.step(2);
  transport.requestDataRange(3 * RANGE_CHUNK, 4 * RANGE_CHUNK);
  await tick();
  assert.equal(asked.length, 0, 'left to the download');
  await held.breakNow();
  await tick(); await tick();
  assert.equal(asked.length, 1, 'the waiting request is read by range once the download broke');
  assert.deepEqual(transport.ranges[0].chunk, bytes.slice(3 * RANGE_CHUNK, 4 * RANGE_CHUNK));
  await assert.rejects(source.done);

  const held2 = heldBody(bytes);
  const s2 = new RangedPdfSource({ url: '/doc', response: new Response(held2.body), length, fetchImpl: server(bytes, { answer: 'ignore' }).fetchImpl });
  let told = null;
  s2.onFail = (e) => { told = e; };
  const t2 = s2.attach(fakeTransport());
  t2.requestDataRange(length - RANGE_CHUNK, length);
  await tick(); await tick();
  await held2.step();
  await held2.breakNow();
  await tick();
  assert.ok(told, 'no ranges and no download: the reader shows the failure instead of a page that never draws');
});

test('a download shorter than its length is a failure, not a finished file', async () => {
  const bytes = fileOf(3 * RANGE_CHUNK);
  const source = new RangedPdfSource({ url: '/doc', response: new Response(bytes), length: 4 * RANGE_CHUNK, fetchImpl: server(bytes, { answer: 'ignore' }).fetchImpl });
  let told = null;
  source.onFail = (e) => { told = e; };
  const transport = source.attach(fakeTransport());
  await assert.rejects(source.done);
  assert.equal(transport.done, false);
  assert.equal(source.complete, false);
  // pdf.js asks for the missing chunk; the server cannot answer a range.
  transport.requestDataRange(3 * RANGE_CHUNK, 4 * RANGE_CHUNK);
  await tick(); await tick(); await tick();
  assert.match(String(told?.message), /short_download/);
});
