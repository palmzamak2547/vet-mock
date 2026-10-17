// A shared profile link (/u/<handle>) carries that profile in its preview: LINE, Facebook and X
// read the page's meta tags without running the app. vercel.json rewrites /u/<handle> here; this
// answers with the app shell (the site's own /) with the profile's title, description and cover
// (online/cover.js draws it into the owner's storage folder), and the app takes over as on any
// other page. Anything that fails leaves the shell as it is, which is what /u/ served before.

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const ANON = process.env.VITE_SUPABASE_ANON_KEY || '';
const HANDLE = /^[a-z0-9][a-z0-9_]{2,19}$/;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function profileOf(handle) {
  const url = `${SUPABASE_URL}/rest/v1/profiles?select=user_id,handle,display_name,bio&handle=eq.${encodeURIComponent(handle)}&limit=1`;
  const res = await fetch(url, { headers: { apikey: ANON, authorization: `Bearer ${ANON}`, 'accept-profile': 'vca' }, signal: AbortSignal.timeout(2500) });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

// The cover's address with its version, so a preview shows the newest picture: the stored file's
// ETag changes whenever the owner's device draws a new one.
async function coverOf(userId) {
  const url = `${SUPABASE_URL}/storage/v1/object/public/vca-media/${userId}/avatar/og.jpg`;
  const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(2500) });
  if (!res.ok) return null;
  const tag = (res.headers.get('etag') || '').replace(/\W/g, '').slice(0, 16);
  return tag ? `${url}?v=${tag}` : url;
}

function withMeta(html, { url, title, description, image, alt }) {
  const meta = (attr, key, value) => {
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
    html = re.test(html) ? html.replace(re, `$1${esc(value)}$2`) : html.replace('</head>', `<meta ${attr}="${key}" content="${esc(value)}" />\n</head>`);
  };
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`);
  meta('name', 'description', description);
  meta('property', 'og:type', 'profile');
  meta('property', 'og:url', url);
  meta('property', 'og:title', title);
  meta('property', 'og:description', description);
  meta('property', 'og:image', image);
  meta('property', 'og:image:alt', alt);
  meta('name', 'twitter:title', title);
  meta('name', 'twitter:description', description);
  meta('name', 'twitter:image', image);
  return html;
}

export default async function handler(req, res) {
  const origin = `https://${req.headers['x-forwarded-host'] || req.headers.host}`;
  const handle = String(req.query.handle || '').toLowerCase();
  const shell = await fetch(`${origin}/`, { signal: AbortSignal.timeout(3000) });
  let html = await shell.text();
  try {
    const p = HANDLE.test(handle) && SUPABASE_URL && ANON ? await profileOf(handle) : null;
    if (p) {
      const cover = await coverOf(p.user_id).catch(() => null);
      const name = p.display_name;
      html = withMeta(html, {
        url: `${origin}/u/${p.handle}`,
        title: `${name} (@${p.handle}) | VetMock VCA`,
        description: p.bio || `${name} ในชุมชน VetMock VCA ฝึกข้อสอบ VCA และคุยกับเพื่อนที่สอบรอบเดียวกัน`,
        image: cover || `${origin}/og/community.jpg`,
        alt: `โปรไฟล์ของ ${name} บน VetMock VCA`,
      });
    }
  } catch {
    // The shell as it is.
  }
  res.setHeader('content-type', 'text/html; charset=utf-8');
  // Previews are fetched rarely and a profile changes rarely: the edge keeps a copy five minutes.
  res.setHeader('cache-control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
  res.status(shell.ok ? 200 : 502).send(html);
}
