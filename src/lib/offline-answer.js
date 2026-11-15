// @ts-check
// The service worker answers a request it could not send with a 503 of its
// own, so fetch() resolves instead of throwing, and a page that only looked in
// its catch block called it a server fault ("the mail system is down, write to
// us instead"). This tells that answer apart: the header every made-up offline
// answer carries (public/sw.js OFFLINE_HEADER), or, from a worker older than
// the header, the bodies it has always sent.

/**
 * @param {{ status?: number, headers?: { get?: (name: string) => string | null } } | null | undefined} res
 * @param {unknown} [body] the parsed JSON or the text, when the caller already read it
 * @returns {boolean}
 */
export function isOfflineAnswer(res, body) {
  if (!res || res.status !== 503) return false;
  if (res.headers?.get?.('x-vmx-offline') === '1') return true;
  if (body === 'Offline') return true;
  const error = body && typeof body === 'object' ? /** @type {{ error?: unknown }} */ (body).error : undefined;
  return error === 'Offline' || error === 'offline_not_cached';
}
