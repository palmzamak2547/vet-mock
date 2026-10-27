#!/usr/bin/env node
// ============================================================
// ai-dev-api.mjs — run /api/ai-chat locally for the ai.vetmock.com page
// ============================================================
// `node scripts/ai-dev-api.mjs` serves the real handler (api/ai-chat.js) on
// http://localhost:43139/api/ai-chat, so the chat front-end running on
// http://localhost:43130 can talk to it exactly as it will talk to
// vetmock.com. CORS comes from the same allowedOrigin() code production uses.
//
// What it adapts: Node's req/res to the platform's style the handler expects
// (req.body parsed lazily, throwing on invalid JSON as the platform does;
// res.status().json(); res.write/end/flushHeaders for the event stream).
//
// Environment: .env.local at the repo root is parsed here (no dependency) and
// copied into process.env BEFORE the handler is imported, because
// rate-limit.js decides at import time whether the shared limiter exists.
// Variables already set in the shell win. Values are never printed; only the
// count of names loaded.
//
//   --port <n>   listen elsewhere (default 43139)
//   --no-kv      ignore the shared limiter/cache credentials and use the
//                in-memory limiter, so local runs touch no shared counters
//                (also drops VERCEL_ENV/NODE_ENV: with them set to production
//                a missing limiter makes every request fail closed)
// ============================================================

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const portArg = args.indexOf('--port');
const PORT = portArg >= 0 ? Number(args[portArg + 1]) : 43139;
const NO_KV = args.includes('--no-kv');
const MAX_BODY = 6 * 1024 * 1024;

/** KEY=VALUE lines, # comments, optional export prefix and quotes. */
export function parseEnv(text) {
  const out = {};
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
      if (m[2].trim().startsWith('"')) v = v.replace(/\\n/g, '\n');
    } else {
      v = v.replace(/\s+#.*$/, '');
    }
    out[m[1]] = v;
  }
  return out;
}

function loadEnvFile() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return 0;
  const vars = parseEnv(fs.readFileSync(file, 'utf8'));
  let n = 0;
  for (const [k, v] of Object.entries(vars)) {
    if (process.env[k] === undefined) { process.env[k] = v; n++; }
  }
  return n;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** Give Node's req/res the platform's helpers. */
function adapt(req, res, buf) {
  const type = String(req.headers['content-type'] || '').toLowerCase();
  let parsed;
  let parsedOnce = false;
  Object.defineProperty(req, 'body', {
    configurable: true,
    get() {
      if (!parsedOnce) {
        parsedOnce = true;
        const text = buf.toString('utf8');
        if (!text) parsed = null;
        else if (type.includes('application/json')) {
          try { parsed = JSON.parse(text); } catch { parsed = undefined; throw new Error('Invalid JSON'); }
        } else parsed = text;
      } else if (parsed === undefined && type.includes('application/json')) {
        throw new Error('Invalid JSON');
      }
      return parsed;
    },
  });
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => {
    if (!res.getHeader('content-type')) res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
    return res;
  };
  res.send = (data) => {
    if (typeof data === 'object' && !Buffer.isBuffer(data)) return res.json(data);
    res.end(data);
    return res;
  };
}

async function main() {
  const loaded = loadEnvFile();
  if (NO_KV) {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    // A pulled production env says VERCEL_ENV=production, and in production a
    // missing limiter fails closed (every request 503s, by design). Locally,
    // without the shared limiter, that is not what anyone wants.
    delete process.env.VERCEL_ENV;
    delete process.env.NODE_ENV;
  }
  const { default: handler } = await import(pathToFileURL(path.join(root, 'api', 'ai-chat.js')).href);
  const server = http.createServer(async (req, res) => {
    const started = Date.now();
    const url = new URL(req.url, `http://${req.headers.host || `localhost:${PORT}`}`);
    res.on('finish', () => {
      console.log(`${req.method} ${url.pathname} ${res.statusCode} ${Date.now() - started}ms`);
    });
    if (url.pathname !== '/api/ai-chat') {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'not_found' }));
      return;
    }
    let buf;
    try {
      buf = await readBody(req);
    } catch (err) {
      res.statusCode = err.status || 400;
      res.end();
      return;
    }
    adapt(req, res, buf);
    try {
      await handler(req, res);
    } catch (err) {
      console.error('[ai-dev-api] handler threw', err?.message || err);
      if (!res.headersSent) res.status(500).json({ error: 'unexpected' });
      else res.end();
    }
  });
  server.listen(PORT, () => {
    console.log(`[ai-dev-api] http://localhost:${PORT}/api/ai-chat  (env vars loaded from .env.local: ${loaded}${NO_KV ? ', shared limiter off' : ''})`);
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((err) => {
    console.error('[ai-dev-api] failed to start:', err?.message || err);
    process.exit(1);
  });
}
