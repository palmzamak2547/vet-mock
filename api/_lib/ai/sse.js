// ============================================================
// ai/sse.js — the event stream the chat page reads
// ============================================================
// One wire format, written in one place: `event: <name>\ndata: <json>\n\n`.
// JSON.stringify never emits a raw newline, so one event is always exactly
// one `data:` line and the browser's EventSource-style parser cannot split a
// payload in two.
//
// openStream() owns the response once streaming starts. Before it is called
// the route may still answer with an ordinary JSON status (400/429/503); after
// it, every outcome, failures included, is an event, because the status line
// has already gone out as 200.
//
// It also notices a reader who left: the response closing before we ended it
// aborts `signal`, which every upstream call is wired to, so a closed tab
// stops paying for tokens nobody will read.
// ============================================================

export const STREAM_HEADERS = Object.freeze({
  'Content-Type': 'text/event-stream; charset=utf-8',
  // no-transform: a proxy that compresses or rewrites the body would buffer it
  // and the student would see the whole answer arrive at once at the end.
  'Cache-Control': 'no-cache, no-transform',
  'X-Accel-Buffering': 'no',
});

/** One event, exactly as it goes on the wire. */
export function encodeEvent(name, data) {
  const event = String(name).replace(/[\r\n]/g, '');
  return `event: ${event}\ndata: ${JSON.stringify(data ?? null)}\n\n`;
}

/**
 * Start streaming on a Vercel-style response. Returns
 *   send(name, data)  write one event (ignored once closed)
 *   end()             finish the response
 *   signal            aborted when the reader goes away
 *   closed()          true once ended or abandoned
 */
export function openStream(res) {
  const ac = new AbortController();
  let ended = false;
  res.statusCode = 200;
  for (const [k, v] of Object.entries(STREAM_HEADERS)) res.setHeader(k, v);
  if (typeof res.flushHeaders === 'function') {
    try { res.flushHeaders(); } catch { /* headers go out with the first write */ }
  }
  if (typeof res.on === 'function') {
    res.on('close', () => {
      // 'close' also fires after a normal end; only an early one is a reader
      // who left mid-answer.
      if (!ended) ac.abort(new Error('client closed'));
      ended = true;
    });
  }
  return {
    signal: ac.signal,
    closed: () => ended,
    send(name, data) {
      if (ended) return false;
      try {
        res.write(encodeEvent(name, data));
        return true;
      } catch {
        ended = true;
        ac.abort(new Error('write failed'));
        return false;
      }
    },
    end() {
      if (ended) return;
      ended = true;
      try { res.end(); } catch { /* already gone */ }
    },
  };
}
