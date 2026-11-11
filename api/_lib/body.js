// The one way a handler reads a JSON request body.
//
// Vercel parses JSON lazily: reading req.body on a request whose body does not
// parse throws. A handler that reads it bare, or destructures a body of
// `null`, ends in an unhandled error instead of an answer. readJsonBody never
// throws: it returns the body as a plain object, or null when the body is not
// one (unreadable, null, an array, a string or number), and the handler then
// answers sendBadBody(res).
//
// No body at all (undefined, empty string) reads as {}, so each handler's own
// field checks decide what is missing.

export const BAD_BODY = Object.freeze({ error: 'bad_body', message: 'คำขอไม่ถูกต้อง ลองใหม่อีกครั้ง' });

export function readJsonBody(req) {
  let raw;
  try {
    raw = req?.body;
  } catch {
    return null;
  }
  if (raw === undefined || raw === '') return {};
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(raw)) raw = raw.toString('utf8');
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  return raw;
}

/**
 * The read-aloud routes' body: a raw string, either JSON or base64 JSON
 * ("b64:" prefix or Content-Type application/vmx-b64), because Vercel's edge
 * mangles non-ASCII bytes before the function sees them (api/tts.js has the
 * history). Same contract as readJsonBody: a plain object, {} for no body
 * (the handler's own checks then answer), or null when it is not one.
 */
export async function readEncodedJsonBody(req) {
  let raw = '';
  try {
    const parsed = req?.body;
    if (typeof parsed === 'string') raw = parsed;
    else if (parsed && typeof parsed === 'object' && !Buffer.isBuffer(parsed)) return Array.isArray(parsed) ? null : parsed;
    else if (parsed === null) return null;
    if (!raw && req.rawBody && Buffer.isBuffer(req.rawBody)) raw = req.rawBody.toString('utf8');
    if (!raw && Buffer.isBuffer(parsed)) raw = parsed.toString('utf8');
    if (!raw && req.readable) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      raw = Buffer.concat(chunks).toString('utf8');
    }
  } catch {
    return null;
  }
  if (!raw) return {};
  const ct = String(req.headers?.['content-type'] || '');
  let payload = raw;
  if (ct.includes('application/vmx-b64') || raw.startsWith('b64:')) {
    payload = Buffer.from(raw.startsWith('b64:') ? raw.slice(4) : raw, 'base64').toString('utf8');
  }
  return readJsonBody({ body: payload });
}

export function sendBadBody(res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(400).json(BAD_BODY);
}
