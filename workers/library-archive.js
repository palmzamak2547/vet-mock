// Private archive reader. Only expiring library tokens may read the VCA prefix.
// Deploy with ARCHIVE (R2 binding), ARCHIVE_BUCKET, and BLOB_MAC_KEY (base64 of
// sha256('vetmock-library-blob:' + the server's signing secret)). Never bind the
// account API token itself. This production module has no write endpoint.
const PREFIX = 'archives/vca/';
const decode = (value) => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

export function byteRange(header, size) {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2])) return false;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return false;
  return { offset: start, length: end - start + 1 };
}

export async function authorizedPayload(url, env, now = Date.now()) {
  try {
    const t = url.searchParams.get('t'); const s = url.searchParams.get('s');
    if (!t || !s || t.length > 4096 || !env.BLOB_MAC_KEY) return null;
    const key = await crypto.subtle.importKey('raw', decode(env.BLOB_MAC_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    if (!await crypto.subtle.verify('HMAC', key, decode(s), new TextEncoder().encode(t))) return null;
    const payload = JSON.parse(new TextDecoder().decode(decode(t)));
    if (payload.b !== env.ARCHIVE_BUCKET || !payload.k?.startsWith(PREFIX) || payload.k.includes('..')) return null;
    if (!Number.isFinite(payload.e) || payload.e * 1000 <= now) return null;
    return payload;
  } catch { return null; }
}

export default {
  async fetch(request, env) {
    const headers = new Headers({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    // No cookies or browser credentials are used; the signed link is the grant.
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges, ETag');
    if (request.method === 'OPTIONS') {
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Range');
      return new Response(null, { status: 204, headers });
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers });
    const payload = await authorizedPayload(new URL(request.url), env);
    if (!payload) return new Response(null, { status: 403, headers });
    const head = await env.ARCHIVE.head(payload.k);
    if (!head) return new Response(null, { status: 404, headers });
    const range = request.method === 'HEAD' ? null : byteRange(request.headers.get('Range'), head.size);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('ETag', head.httpEtag);
    headers.set('X-Archive-Sha256', head.customMetadata?.sha256 || '');
    if (range === false) {
      headers.set('Content-Range', `bytes */${head.size}`);
      return new Response(null, { status: 416, headers });
    }
    const mime = payload.m || 'application/octet-stream';
    const unsafe = /html|xml|javascript|ecmascript/i.test(mime) && !mime.startsWith('application/vnd.openxmlformats-officedocument.');
    headers.set('Content-Type', unsafe ? 'application/octet-stream' : mime);
    const filename = String(payload.f || payload.k.split('/').pop()).replace(/[\r\n]/g, '');
    const encodedName = encodeURIComponent(filename).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
    const disposition = unsafe || mime.startsWith('application/vnd.openxmlformats-officedocument.') ? 'attachment' : 'inline';
    headers.set('Content-Disposition', `${disposition}; filename*=UTF-8''${encodedName}`);
    headers.set('Content-Length', String(range ? range.length : head.size));
    headers.set('Cache-Control', `private, max-age=${Math.max(0, Math.floor(payload.e - Date.now() / 1000))}`);
    if (range) headers.set('Content-Range', `bytes ${range.offset}-${range.offset + range.length - 1}/${head.size}`);
    if (request.method === 'HEAD') return new Response(null, { headers });
    const object = await env.ARCHIVE.get(payload.k, range ? { range } : undefined);
    if (!object?.body) return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return new Response(object.body, { status: range ? 206 : 200, headers });
  },
};
