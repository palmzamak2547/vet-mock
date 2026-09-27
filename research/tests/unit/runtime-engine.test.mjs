// The engine protocol (M1-DESIGN.md 11): the shared request handler, and the client with a module
// worker (watchdogs, cancel by terminate, a new worker on the next call, transferred bytes) or the
// main-thread fallback (size limits). A fake Worker stands in for the browser's. OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest, toEngineError, tableTransferables, fingerprintKeys } from '../../src/lib/runtime/engine-core.js';
import { createEngine } from '../../src/lib/runtime/client.js';
import { OPS, ENGINE_VERSION, FALLBACK_LIMITS } from '../../src/lib/runtime/protocol.js';
import { makeSpec } from '../../src/lib/runtime/spec.js';

test('hello answers with the engine version', async () => {
  const { result } = await handleRequest(OPS.HELLO, {}, { mode: 'worker' });
  assert.equal(result.engineVersion, ENGINE_VERSION);
});

test('unknown ops and bad payloads are errors with keys, never crashes', async () => {
  await assert.rejects(handleRequest('nope', {}, { mode: 'worker' }), (e) => e.key === 'runtime.engine.unknownOp');
  await assert.rejects(handleRequest(OPS.PARSE, { bytes: 'text' }, { mode: 'worker' }), (e) => e.key === 'runtime.engine.badRequest');
  assert.deepEqual(toEngineError(new Error('x')), { code: 'failed', key: 'runtime.engine.failed', detail: 'x' });
});

test('the main-thread fallback refuses inputs over 2 MB or 20,000 rows', async () => {
  const big = new ArrayBuffer(FALLBACK_LIMITS.bytes + 1);
  await assert.rejects(handleRequest(OPS.PARSE, { bytes: big, fileName: 'x.csv' }, { mode: 'main-thread' }), (e) => e.key === 'runtime.engine.tooLargeForFallback');
  await assert.rejects(handleRequest(OPS.APPLY, { raw: { rowCount: 20001 }, codebook: {} }, { mode: 'main-thread' }), (e) => e.key === 'runtime.engine.tooLargeForFallback');
  await assert.rejects(handleRequest(OPS.RUN, { spec: {}, table: { n: 20001 } }, { mode: 'main-thread' }), (e) => e.key === 'runtime.engine.tooLargeForFallback');
});

test('run returns an envelope for any spec, including an invalid one', async () => {
  const { result } = await handleRequest(OPS.RUN, { spec: { specVersion: 1, method: 'nope' } }, { mode: 'worker' });
  assert.equal(result.status, 'invalid');
  assert.equal(result.provenance.engineVersion, ENGINE_VERSION);
  const { result: r2 } = await handleRequest(OPS.RUN, { spec: makeSpec('ss.proportion', { kind: 'params', params: { p: 0.5 } }) }, { mode: 'worker' });
  assert.ok(['ok', 'invalid'].includes(r2.status));
});

test('transferables are each buffer once; fingerprint keys follow the codebook', () => {
  const buf = new Float64Array(4);
  const t = { columns: { a: { values: buf, missing: new Uint8Array(4) }, b: { values: buf, missing: new Uint8Array(4) }, c: { values: ['x'], missing: new Uint8Array(1) } } };
  assert.equal(tableTransferables(t).length, 4);
  assert.deepEqual(fingerprintKeys({ columns: { d1: {}, c2: {}, c1: {} } }, { columns: [{ key: 'c1' }, { key: 'c2' }, { key: 'c9' }] }), ['c1', 'c2', 'd1']);
});

// ---- client --------------------------------------------------------------------------------
/** A fake module worker. `behaviour(msg, worker)` decides what happens to each request. */
class FakeWorker {
  constructor(behaviour) {
    this.behaviour = behaviour;
    this.terminated = false;
    this.sent = [];
    FakeWorker.all.push(this);
  }
  postMessage(msg, transfer) {
    this.sent.push({ msg, transfer });
    queueMicrotask(() => { if (!this.terminated) this.behaviour(msg, this); });
  }
  reply(data) {
    if (!this.terminated) this.onmessage?.({ data });
  }
  terminate() { this.terminated = true; }
}
FakeWorker.all = [];

const answering = (msg, w) => {
  if (msg.op === 'hello') w.reply({ id: msg.id, type: 'result', result: { engineVersion: ENGINE_VERSION } });
  else if (msg.op === 'run') {
    w.reply({ id: msg.id, type: 'progress', progress: { done: 1, total: 2 } });
    w.reply({ id: msg.id, type: 'result', result: { status: 'ok', echo: msg.payload.spec } });
  } else if (msg.op === 'parse') {
    w.reply({ id: msg.id, type: 'progress', progress: { done: 1, total: 2 } });
    w.reply({ id: msg.id, type: 'result', result: { raw: null } });
  }
  else if (msg.op === 'apply') w.reply({ id: msg.id, type: 'error', error: { code: 'x', key: 'intake.error.bad' } });
  // 'sheets' never answers (watchdog test)
};

test('worker mode: hello, results, progress, error keys', async () => {
  FakeWorker.all = [];
  const engine = await createEngine({ createWorker: () => new FakeWorker(answering) });
  assert.equal(engine.mode, 'worker');
  const res = await engine.run({ method: 'x' }, null, null);
  assert.equal(res.status, 'ok');
  assert.equal(res.echo.method, 'x');
  await assert.rejects(engine.apply({}, {}, []), (e) => e.key === 'intake.error.bad');
  const progress = [];
  await engine.parse({ bytes: new ArrayBuffer(2), fileName: 'a.csv' }, (p) => progress.push(p));
  assert.deepEqual(progress, [{ done: 1, total: 2 }]);
  engine.dispose();
});

test('parse transfers the file bytes instead of copying them', async () => {
  FakeWorker.all = [];
  const engine = await createEngine({ createWorker: () => new FakeWorker(answering) });
  const bytes = new ArrayBuffer(8);
  await engine.parse({ bytes, fileName: 'a.csv' });
  const sent = FakeWorker.all[0].sent.find((s) => s.msg.op === 'parse');
  assert.deepEqual(sent.transfer, [bytes]);
  engine.dispose();
});

test('a watchdog timeout terminates the worker, fails the call, and the next call starts a new worker', async () => {
  FakeWorker.all = [];
  const engine = await createEngine({ createWorker: () => new FakeWorker(answering), watchdog: { sheets: 30 } });
  await assert.rejects(engine.sheets(new ArrayBuffer(4)), (e) => e.key === 'runtime.engine.timeout');
  assert.equal(FakeWorker.all[0].terminated, true);
  const res = await engine.run({ method: 'y' }, null, null);
  assert.equal(res.echo.method, 'y');
  assert.equal(FakeWorker.all.length, 2, 'a fresh worker answered');
  engine.dispose();
});

test('cancel terminates the worker and rejects what was waiting', async () => {
  FakeWorker.all = [];
  const engine = await createEngine({ createWorker: () => new FakeWorker(answering), watchdog: { sheets: 5000 } });
  const waiting = engine.sheets(new ArrayBuffer(4));
  await new Promise((r) => setTimeout(r, 5));
  engine.cancel();
  await assert.rejects(waiting, (e) => e.key === 'runtime.engine.cancelled');
  assert.equal(FakeWorker.all[0].terminated, true);
  engine.dispose();
  await assert.rejects(engine.run({}, null, null), (e) => e.key === 'runtime.engine.disposed');
});

test('a worker that crashes rejects its calls with a key', async () => {
  FakeWorker.all = [];
  const crashy = (msg, w) => (msg.op === 'hello' ? answering(msg, w) : w.onerror?.({ message: 'dead', preventDefault() {} }));
  const engine = await createEngine({ createWorker: () => new FakeWorker(crashy) });
  await assert.rejects(engine.run({}, null, null), (e) => e.key === 'runtime.engine.workerCrashed');
  engine.dispose();
});

test('no module worker (or no hello within the limit): the main-thread fallback runs the same core', async () => {
  const silent = () => new FakeWorker(() => {});
  let loaded = 0;
  const engine = await createEngine({
    createWorker: silent,
    watchdog: { hello: 20 },
    loadCore: async () => { loaded += 1; return import('../../src/lib/runtime/engine-core.js'); },
  });
  assert.equal(engine.mode, 'main-thread');
  const env = await engine.run({ specVersion: 1, method: 'nope' }, null, null);
  assert.equal(env.status, 'invalid');
  await assert.rejects(engine.parse({ bytes: new ArrayBuffer(FALLBACK_LIMITS.bytes + 1), fileName: 'big.csv' }), (e) => e.key === 'runtime.engine.tooLargeForFallback');
  assert.equal(loaded, 1);
  const noWorker = await createEngine({ preferWorker: false });
  assert.equal(noWorker.mode, 'main-thread');
});
