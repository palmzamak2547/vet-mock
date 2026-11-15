// A library PDF that draws page one before the whole file has arrived.
//
// A PDF keeps its table of contents (the cross-reference table) at the END of
// the file, and only one deck in the shelf is linearized to put it at the
// front. So the reader used to download every byte before it could draw page
// one: 22 s for a 24 MB deck on a 10 Mbit/s phone (docs/releases/5.238.0.md).
//
// Now the reader starts the same whole download as before and hands pdf.js
// the bytes as they arrive, and when pdf.js asks for bytes the download will
// not reach for a while (the table at the end, a font the first page uses)
// those few are fetched by byte range beside it. The whole download goes on
// behind page one, so the service worker still keeps the file for offline
// reading and search, thumbnails and export still get every byte.
//
// What it never does:
// - Range-read without the server saying it can (Accept-Ranges: bytes, a
//   length, no content encoding). Otherwise the caller keeps the old path.
// - Ask for many ranges. At most MAX_RANGES per open, and none once page one
//   is on screen (settle): later pages wait for the download, which is
//   already on its way. /api/library-blob counts each range as the bytes it
//   reads from storage, so a range is not free for the member either.
// - Trust a range answer it did not ask for: anything but a 206 with the
//   exact Content-Range turns ranges off and pdf.js waits for the download.

export const RANGE_CHUNK = 65536;
export const MAX_RANGES = 6;
// Bytes the download will bring soon enough that a range would not beat it.
export const NEAR_BYTES = 512 * 1024;
export const NEAR_SECONDS = 0.6;
// A request in the last TAIL bytes fetches all of them: the table, the trailer
// and the objects writers put at the end come in one read instead of several
// dependent ones (each costs a round trip and, on the server, a storage read).
export const tailBytes = (length) => Math.min(length, Math.max(512 * 1024, Math.min(2 * 1024 * 1024, Math.ceil(length * 0.03))));
// A request elsewhere fetches at least this much.
export const MID_BLOCK = 128 * 1024;
// What the ranges of one open may cost the member's byte budget. The server
// counts a range as every byte from the start of the file to the range's end
// (storage cannot start in the middle), so a range near the end costs about
// the whole file. A file the service worker keeps (40 MB or less) is paid for
// once and reopened for nothing; a bigger one is paid again on every open, so
// its ranges may cost at most three times the file.
export const KEPT_MAX_BYTES = 40 * 1024 * 1024;
export const rangeChargeCap = (length) => (length <= KEPT_MAX_BYTES ? Infinity : 3 * length);

const alignDown = (n) => Math.floor(n / RANGE_CHUNK) * RANGE_CHUNK;
const alignUp = (n, length) => Math.min(length, Math.ceil(n / RANGE_CHUNK) * RANGE_CHUNK);

/**
 * The length of a response that may be read by range, or 0 when the old whole
 * download must be used: not a 200, a content encoding (its length is not the
 * file's), no length, no Accept-Ranges: bytes, or the service worker's kept
 * copy (already on this device, so reading it whole is the fast way).
 * @param {Response} res
 */
export function rangeableLength(res) {
  if (!res || res.status !== 200) return 0;
  const h = res.headers;
  const encoding = (h.get('content-encoding') || 'identity').toLowerCase();
  if (encoding !== 'identity') return 0;
  if (!/(^|,)\s*bytes\s*(,|$)/i.test(h.get('accept-ranges') || '')) return 0;
  if (h.get('x-vetmock-library-hash')) return 0;
  const length = Number(h.get('content-length'));
  return Number.isSafeInteger(length) && length > 0 ? length : 0;
}

/**
 * Decides what to do with pdf.js's request for [begin, end).
 * @returns {{ kind: 'wait' } | { kind: 'fetch', from: number, to: number }}
 */
export function planRange(begin, end, { length, streamed, rate = 0, open = true, rangeOk = true, used = 0, maxRanges = MAX_RANGES, streaming = true, charged = 0 }) {
  if (end <= streamed) return { kind: 'wait' };
  if (!open || !rangeOk || used >= maxRanges) return { kind: 'wait' };
  // A download that broke brings nothing more, so nothing is left to it.
  const soon = streaming ? Math.max(NEAR_BYTES, rate * NEAR_SECONDS) : 0;
  if (end - streamed <= soon) return { kind: 'wait' };
  const tail = tailBytes(length);
  const plan = begin >= length - tail
    ? { kind: 'fetch', from: Math.min(alignDown(begin), alignDown(length - tail)), to: length }
    : { kind: 'fetch', from: alignDown(begin), to: alignUp(Math.max(end, alignDown(begin) + MID_BLOCK), length) };
  // The server counts a range as plan.to bytes (see rangeChargeCap).
  if (charged + plan.to > rangeChargeCap(length)) return { kind: 'wait' };
  return plan;
}

/**
 * Feeds pdf.js from one whole download plus a few byte ranges.
 *
 * `transport` is a pdfjs PDFDataRangeTransport (or anything with its on*
 * methods); `response` is the whole download's response, its body unread.
 */
export class RangedPdfSource {
  constructor({ url, response, length, fetchImpl = (...a) => fetch(...a), now = () => Date.now(), maxRanges = MAX_RANGES }) {
    this.url = url;
    this.response = response;
    this.length = length;
    this.fetchImpl = fetchImpl;
    this.now = now;
    this.maxRanges = maxRanges;
    this.streamed = 0;
    this.used = 0;
    this.charged = 0;
    this.open = true;
    this.rangeOk = true;
    this.blocks = []; // { from, to, bytes?: Uint8Array, pending?: Promise }
    this.waiting = []; // requests left to the download
    this.aborter = new AbortController();
    this.startedAt = 0;
    this.transport = null;
    this.log = [];
    this.failed = null;
    this.complete = false;
    this.done = new Promise((resolve, reject) => { this._resolve = resolve; this._reject = reject; });
    this.done.catch(() => {});
  }

  get rate() {
    const elapsed = (this.now() - this.startedAt) / 1000;
    return this.startedAt && elapsed > 0.2 ? this.streamed / elapsed : 0;
  }

  /** Wires a PDFDataRangeTransport to this source and starts the download. */
  attach(transport) {
    this.transport = transport;
    transport.requestDataRange = (begin, end) => this.request(begin, end);
    transport.abort = () => this.abort();
    this.pump();
    // pdf.js reads the end of a PDF first, always, but only once its worker
    // has loaded and the trailer has been asked for. Asking now lets the tail
    // arrive while the worker is still on its way.
    this.prefetchTail();
    return transport;
  }

  prefetchTail() {
    const plan = planRange(this.length - 1, this.length, { length: this.length, streamed: 0, rate: 0, used: this.used, maxRanges: this.maxRanges, charged: this.charged });
    if (plan.kind === 'fetch') this.startBlock(plan);
  }

  /** Page one is on screen: from now on everything waits for the download. */
  settle() { this.open = false; }

  abort() {
    this.aborter.abort();
    this.response.body?.cancel?.().catch?.(() => {});
  }

  async pump() {
    const reader = this.response.body.getReader();
    this.startedAt = this.now();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        this.streamed += value.byteLength;
        this.transport.onDataProgressiveRead(value);
        this.transport.onDataProgress(this.streamed, this.length);
      }
      if (this.streamed !== this.length) throw new Error('short_download');
      this.transport.onDataProgressiveDone();
      this.complete = true;
      this._resolve(this.length);
    } catch (error) {
      if (this.aborter.signal.aborted) { this._reject(error); return; }
      // The download broke. With ranges the rest can still be read; without,
      // the caller must say the file did not arrive.
      this.failed = error;
      this._reject(error);
      if (this.rangeOk) {
        this.open = true;
        this.maxRanges = Infinity;
        for (const { begin, end } of this.waiting.splice(0)) this.request(begin, end);
      } else {
        this.onFail?.(error);
      }
    }
  }

  // Always on a later turn: pdf.js registers the request's reader only after
  // requestDataRange returns, and an answer before that is dropped.
  deliver(begin, end, block) {
    const chunk = block.bytes.slice(begin - block.from, end - block.from);
    setTimeout(() => {
      try { this.transport.onDataRange(begin, chunk); } catch { /* the request was cancelled (document closed) */ }
    }, 0);
  }

  request(begin, end) {
    const held = this.blocks.find((b) => b.from <= begin && b.to >= end);
    if (held?.bytes) { this.deliver(begin, end, held); return; }
    if (held?.pending) {
      held.pending.then((ok) => { if (ok) this.deliver(begin, end, held); else this.waitOrRetry(begin, end); });
      return;
    }
    const plan = planRange(begin, end, {
      length: this.length, streamed: this.streamed, rate: this.rate, streaming: !this.failed,
      open: this.open, rangeOk: this.rangeOk, used: this.used, maxRanges: this.maxRanges, charged: this.charged,
    });
    if (plan.kind === 'wait') {
      // A broken download brings nothing more: a request no range may answer
      // will never be answered, and the reader must say so.
      if (this.failed) { this.onFail?.(this.failed); return; }
      this.waiting.push({ begin, end });
      return;
    }
    const block = this.startBlock(plan);
    block.pending.then((ok) => { if (ok) this.deliver(begin, end, block); else this.waitOrRetry(begin, end); });
  }

  startBlock({ from, to }) {
    this.used += 1;
    this.charged += to;
    const block = { from, to };
    block.pending = this.fetchBlock(block).then((bytes) => {
      block.bytes = bytes;
      block.pending = null;
      return true;
    }, () => {
      this.blocks.splice(this.blocks.indexOf(block), 1);
      this.rangeOk = false;
      return false;
    });
    this.blocks.push(block);
    return block;
  }

  waitOrRetry(begin, end) {
    if (this.failed) { this.onFail?.(this.failed); return; }
    this.waiting.push({ begin, end });
  }

  async fetchBlock({ from, to }) {
    const started = this.now();
    const res = await this.fetchImpl(this.url, { headers: { Range: `bytes=${from}-${to - 1}` }, signal: this.aborter.signal });
    const expected = `bytes ${from}-${to - 1}/${this.length}`;
    if (res.status !== 206 || (res.headers.get('content-range') || '').replace(/\s+/g, ' ').trim() !== expected) {
      res.body?.cancel?.().catch?.(() => {});
      throw new Error('range_refused');
    }
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.byteLength !== to - from) throw new Error('range_short');
    this.log.push({ from, to, ms: this.now() - started });
    return bytes;
  }
}
