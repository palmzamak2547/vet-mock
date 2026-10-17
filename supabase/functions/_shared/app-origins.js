const PRODUCTION_ORIGIN = 'https://vetmock.com';

const ALLOWED_ORIGINS = new Set([
  PRODUCTION_ORIGIN,
  // The old address stays allowed while learners move to vetmock.com.
  'https://vetmock.vercel.app',
  // VetMock VCA (vca/): the same accounts, signed in on its own site.
  'https://vca.vetmock.com',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:4174',
  'http://localhost:43120',
  'http://localhost:43121',
]);

const PREVIEW_ORIGIN_RE = /^https:\/\/vetmock-[a-z0-9-]+-palmzamak2547s-projects\.vercel\.app$/i;

export function isAllowedAppOrigin(origin) {
  if (!origin || typeof origin !== 'string') return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return PREVIEW_ORIGIN_RE.test(origin);
}

/**
 * Normalize an auth redirect without ever accepting an attacker-controlled
 * host. Supabase also checks its redirect allowlist, but the bridge must not
 * delegate its own trust boundary to dashboard configuration.
 */
export function resolveAppRedirect(candidate, requestOrigin) {
  const fallback = isAllowedAppOrigin(requestOrigin)
    ? requestOrigin
    : PRODUCTION_ORIGIN;

  if (!candidate || typeof candidate !== 'string' || candidate.length > 2048) {
    return fallback;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.username || parsed.password) return fallback;
    if (!isAllowedAppOrigin(parsed.origin)) return fallback;
    return parsed.href;
  } catch {
    return fallback;
  }
}

export { PRODUCTION_ORIGIN };
