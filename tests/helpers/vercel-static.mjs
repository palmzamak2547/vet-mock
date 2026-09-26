// Serve dist/ with the response headers vercel.json gives production.
// `vite preview` sends none of them, so a page that only works without the
// production CSP passes every other spec and fails for students.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8',
};

// vercel.json sources here are literals plus `(.*)` groups. Anything else
// throws, so a new pattern cannot be silently matched the wrong way.
function sourcePattern(source) {
  const parts = source.split('(.*)');
  if (parts.some((p) => /[:*+?(){}[\]\\]/.test(p))) throw new Error(`unsupported vercel.json source: ${source}`);
  return new RegExp(`^${parts.map((p) => p.replace(/[.^$|]/g, '\\$&')).join('(.*)')}$`);
}

// Vercel applies every matching rule in order; a later rule wins on the same key.
export function vercelHeadersFor(pathname, config) {
  const out = {};
  for (const rule of config.headers || []) {
    if (rule.has || rule.missing) throw new Error(`conditional header rule not modelled: ${rule.source}`);
    if (!sourcePattern(rule.source).test(pathname)) continue;
    for (const { key, value } of rule.headers) out[key.toLowerCase()] = value;
  }
  return out;
}

export async function serveDist({ root = process.cwd(), config } = {}) {
  const dist = resolve(root, 'dist');
  const cfg = config || JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
  const server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = normalize(join(dist, pathname));
    if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      await stat(file);
    } catch {
      file = join(dist, 'index.html'); // the /app/:path* and /wiki/:path* rewrites
    }
    const headers = vercelHeadersFor(pathname, cfg);
    // The test origin is plain http on 127.0.0.1; upgrading its requests would
    // only break the fixture. Nothing else in the policy is touched.
    if (headers['content-security-policy']) {
      headers['content-security-policy'] = headers['content-security-policy'].replace(/;\s*upgrade-insecure-requests/, '');
    }
    headers['content-type'] = TYPES[extname(file)] || 'application/octet-stream';
    res.writeHead(200, headers).end(await readFile(file));
  });
  await new Promise((ok, fail) => { server.once('error', fail); server.listen(0, '127.0.0.1', ok); });
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((ok) => { server.close(ok); server.closeAllConnections(); }),
  };
}
