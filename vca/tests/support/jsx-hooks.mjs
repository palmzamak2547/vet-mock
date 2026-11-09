// Node hooks for the tests that run a page (support/page.mjs registers them): a .jsx file is
// compiled the way Vite compiles it (esbuild, the automatic JSX runtime), a stylesheet it imports
// is an empty module, and react resolves from this app whoever imports it, as vite.config.js
// dedupes it (../src/lib/richtext.jsx imports react too).
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const APP = new URL('../../package.json', import.meta.url).href;

export async function resolve(specifier, context, next) {
  if (/^react(-dom)?(\/|$)/.test(specifier)) return next(specifier, { ...context, parentURL: APP });
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (/\.css$/.test(url)) return { format: 'module', source: '', shortCircuit: true };
  if (/\.jsx$/.test(url)) {
    const file = fileURLToPath(url);
    const { code } = await transform(await readFile(file, 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: file, sourcemap: 'inline' });
    return { format: 'module', source: code, shortCircuit: true };
  }
  return next(url, context);
}
