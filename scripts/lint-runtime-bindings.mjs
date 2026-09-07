import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { createRequire } from 'node:module';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';

const require = createRequire(import.meta.url);
const globalsRoot = dirname(require.resolve('@babel/helper-globals/package.json'));
const globals = new Set(['arguments', 'undefined', 'NaN', 'Infinity', 'globalThis', 'window', 'document', 'navigator', 'console',
  'process', 'Buffer', 'global', '__dirname', '__filename', 'require', 'module', 'exports', 'self', 'fetch', 'setTimeout', 'clearTimeout',
  'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback', 'cancelIdleCallback',
  'queueMicrotask', 'localStorage', 'sessionStorage', 'indexedDB', 'performance', 'crypto', 'location', 'history',
  'alert', 'confirm', 'prompt', 'atob', 'btoa', 'matchMedia', 'getComputedStyle', 'devicePixelRatio', 'innerWidth', 'innerHeight',
  'scrollX', 'scrollY', 'screen', 'google', 'YT', 'webkitAudioContext', 'caches', 'createImageBitmap']);
for (const file of ['builtin-lower.json', 'builtin-upper.json', 'browser-upper.json']) {
  for (const name of JSON.parse(readFileSync(join(globalsRoot, 'data', file), 'utf8'))) globals.add(name);
}
const traverse = traverseModule.default || traverseModule;
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['data', 'db'].includes(entry.name)) walk(path);
    } else if (/\.(js|jsx)$/.test(entry.name) && !entry.name.includes('.generated.')) files.push(path);
  }
}
walk('src'); walk('api');
const failures = [];
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  let ast;
  try { ast = parse(source, { sourceType: 'unambiguous', plugins: ['jsx', 'importAttributes'] }); }
  catch (error) { failures.push(`${file}:${error.loc?.line || 1} ${error.message}`); continue; }
  const seen = new Set();
  traverse(ast, { ReferencedIdentifier(path) {
    const name = path.node.name;
    if (globals.has(name) || path.scope.hasBinding(name) || seen.has(name)) return;
    if (path.parentPath.isUnaryExpression({ operator: 'typeof' })) return;
    seen.add(name);
    failures.push(`${relative(process.cwd(), file) || file}:${path.node.loc.start.line} undeclared ${name}`);
  } });
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Runtime bindings: ${files.length} modules checked`);
