// The stream reader must survive what networks do: events split mid-line, CRLF
// line ends, several events in one chunk, and a body that ends without "done".
import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.location = { hostname: 'localhost', search: '' };
const { chat, parseEvent, ChatError } = await import('../../src/lib/api.js');

function streamOf(chunks) {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const ch of chunks) c.enqueue(enc.encode(ch));
      c.close();
    },
  });
}

function fakeFetch(chunks, status = 200) {
  globalThis.fetch = async () => new Response(streamOf(chunks), { status, headers: { 'Content-Type': 'text/event-stream' } });
}

test('parseEvent reads name and JSON, ignores junk', () => {
  assert.deepEqual(parseEvent('event: delta\ndata: {"text":"สวัสดี"}'), { event: 'delta', data: { text: 'สวัสดี' } });
  assert.equal(parseEvent('event: delta\ndata: {broken'), null);
  assert.equal(parseEvent(': keep-alive'), null);
});

test('events split across chunks and CRLF arrive whole and in order', async () => {
  const body = 'event: status\r\ndata: {"phase":"plan","label":"ก"}\r\n\r\nevent: delta\ndata: {"text":"ab"}\n\nevent: delta\ndata: {"text":"ค"}\n\nevent: done\ndata: {"ms":1}\n\n';
  fakeFetch([body.slice(0, 7), body.slice(7, 40), body.slice(40, 41), body.slice(41)]);
  const got = [];
  await chat({ messages: [{ role: 'user', content: 'x' }], on: (e, d) => got.push([e, d]) });
  assert.deepEqual(got.map((g) => g[0]), ['status', 'delta', 'delta', 'done']);
  assert.equal(got[1][1].text + got[2][1].text, 'abค');
});

test('a stream that ends without done is reported as cut, not as success', async () => {
  fakeFetch(['event: delta\ndata: {"text":"half"}\n\n']);
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e instanceof ChatError && e.reason === 'cut');
});

test('a refusal before streaming carries its reason and Thai message', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ error: 'rate', message: 'ช้าลงหน่อย', retryAfter: 30 }), { status: 429 });
  await assert.rejects(chat({ messages: [], on: () => {} }), (e) => e.reason === 'rate' && e.message === 'ช้าลงหน่อย' && e.retryAfter === 30);
});
