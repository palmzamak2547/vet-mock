import { getUserFromRequest, getConnection, refreshGoogleAccess, googleTokenStale } from './_lib/external-connections.js';
import { allowedOrigin, clientIP, rateLimit, sendRateLimitFailure } from './_lib/rate-limit.js';
import { normalizeExternalDocUrl } from './_lib/external-doc.js';

const TIMEOUT_MS = 10000;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const origin = allowedOrigin(req);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  if (req.headers.origin && !origin) return res.status(403).json({ error: 'Origin not allowed' });
  const limit = await rateLimit(`external-files:${clientIP(req)}`, 60, 60 * 60 * 1000);
  if (!limit.ok) return sendRateLimitFailure(res, limit);
  
  const userId = await getUserFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'login_required' });
  }

  const provider = req.query.provider;
  if (provider !== 'google' && provider !== 'notion') {
    return res.status(400).json({ error: 'invalid_provider' });
  }

  const row = await getConnection({ userId, provider });
  if (!row) {
    return res.status(403).json({ error: 'not_connected' });
  }

  if (provider === 'google') {
    let token = row.access_token;
    if (googleTokenStale(row)) {
      const refreshed = await refreshGoogleAccess(row);
      if (!refreshed) {
        return res.status(401).json({ error: 'token_expired' });
      }
      token = refreshed.accessToken;
    }

    try {
      // Query for Google Docs and Sheets
      const q = encodeURIComponent(`trashed=false and (mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet')`);
      const driveRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,modifiedTime)&orderBy=modifiedTime desc&pageSize=20`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: 'error',
      });

      if (!driveRes.ok) {
        return res.status(driveRes.status).json({ error: 'upstream_error', reason: driveRes.status === 401 ? 'token_expired' : 'temporarily_unavailable' });
      }

      const data = await driveRes.json();
      if (!Array.isArray(data.files) || data.files.some(f => !f || typeof f.id !== 'string' || typeof f.name !== 'string'
          || !['application/vnd.google-apps.document', 'application/vnd.google-apps.spreadsheet'].includes(f.mimeType)
          || !normalizeExternalDocUrl(`https://docs.google.com/document/d/${f.id}`))) {
        return res.status(502).json({ error: 'upstream_error', reason: 'temporarily_unavailable' });
      }
      const files = (data.files || []).map(f => ({
        id: f.id,
        title: f.name,
        type: f.mimeType === 'application/vnd.google-apps.spreadsheet' ? 'sheet' : 'doc',
        updatedAt: f.modifiedTime,
        url: `https://docs.google.com/${f.mimeType === 'application/vnd.google-apps.spreadsheet' ? 'spreadsheets' : 'document'}/d/${f.id}`
      }));
      return res.status(200).json({ files });
    } catch (err) {
      return res.status(503).json({ error: 'fetch_failed', reason: err?.name === 'TimeoutError' ? 'timeout' : 'temporarily_unavailable' });
    }
  }

  if (provider === 'notion') {
    const token = row.access_token;
    try {
      const notionRes = await fetch(`https://api.notion.com/v1/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: { value: 'page', property: 'object' },
          sort: { direction: 'descending', timestamp: 'last_edited_time' },
          page_size: 20
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: 'error',
      });

      if (!notionRes.ok) {
        return res.status(notionRes.status).json({ error: 'upstream_error', reason: notionRes.status === 401 ? 'token_expired' : 'temporarily_unavailable' });
      }

      const data = await notionRes.json();
      if (!Array.isArray(data.results) || data.results.some(p => !p || typeof p.id !== 'string'
          || normalizeExternalDocUrl(p.url || `https://notion.so/${p.id.replace(/-/g, '')}`)?.provider !== 'notion')) {
        return res.status(502).json({ error: 'upstream_error', reason: 'temporarily_unavailable' });
      }
      const files = (data.results || []).map(p => {
        let title = 'Untitled';
        try {
          const titleProp = Object.values(p.properties || {}).find(prop => prop.type === 'title');
          if (titleProp && titleProp.title) {
            title = titleProp.title.map(t => t.plain_text).join('') || 'Untitled';
          }
        } catch(e) {}
        return {
          id: p.id,
          title,
          type: 'page',
          updatedAt: p.last_edited_time,
          url: p.url || `https://notion.so/${p.id.replace(/-/g, '')}`
        };
      });
      return res.status(200).json({ files });
    } catch (err) {
      return res.status(503).json({ error: 'fetch_failed', reason: err?.name === 'TimeoutError' ? 'timeout' : 'temporarily_unavailable' });
    }
  }
}
