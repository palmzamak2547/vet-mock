// The heavy exporters and readers load only when asked for [M2-DESIGN.md 15]: the Word writer (export/docx.js
// with fflate), the TIFF encoder (export/tiff.js), the SPSS reader (intake/sav.js, with fflate for .zsav), the
// HTML report and the SPSS and R script writers are reached from the landing and the workspace only through
// import(), never through a static import. Vite puts a module that some static import reaches into that
// chunk, so walking the static import graph from each lazy root is the same guarantee the build gives, and
// needs no build. The build's own chunk list (npm run build) shows the result. OWNER: integrator (M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../../src/', import.meta.url));
const STATIC = /(?:^|[\n;])\s*(?:import|export)\s+(?:[^'"()]*?\s+from\s+)?['"]([^'"]+)['"]/g;

function resolve(from, spec) {
  if (!spec.startsWith('.')) return spec; // a package or an alias
  const base = path.resolve(path.dirname(from), spec);
  for (const p of [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js')]) if (existsSync(p) && !p.endsWith(path.sep)) return p;
  return base;
}

/** Every file and package a root reaches through static imports only. */
function staticClosure(root) {
  const seen = new Set();
  const stack = [root];
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    if (!/\.(m?js|jsx)$/.test(f) || !existsSync(f)) continue;
    const text = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');
    for (const m of text.matchAll(STATIC)) {
      const spec = m[1];
      if (/\.(css|svg|png|woff2?|txt)(\?.*)?$/.test(spec) || spec.includes('?raw')) continue;
      stack.push(resolve(f, spec));
    }
  }
  return seen;
}

const rel = (p) => path.relative(SRC, p).split(path.sep).join('/');
const HEAVY = ['lib/export/docx.js', 'lib/export/tiff.js', 'lib/intake/sav.js', 'lib/export/html.js', 'lib/export/sps.js', 'lib/export/rscript.js', 'lib/export/report-model.js'];

for (const root of ['landing/Landing.jsx', 'workspace/Workspace.jsx', 'pages/Public.jsx', 'main.jsx']) {
  test(`${root} reaches no heavy exporter or reader through a static import`, () => {
    const closure = [...staticClosure(path.join(SRC, root))];
    const files = closure.map((f) => (path.isAbsolute(f) ? rel(f) : f));
    for (const h of HEAVY) assert.ok(!files.includes(h), `${h} is statically reachable from ${root}`);
    assert.ok(!files.includes('fflate'), `fflate is statically reachable from ${root}`);
  });
}

test('the exporters are still imported lazily somewhere (the check above is not vacuous)', () => {
  const report = readFileSync(path.join(SRC, 'workspace/screens/ReportPane.jsx'), 'utf8');
  for (const m of ['docx.js', 'html.js', 'sps.js', 'rscript.js', 'report-model.js']) assert.match(report, new RegExp(`import\\(['"][^'"]*${m.replace('.', '\\.')}['"]\\)`));
  assert.match(readFileSync(path.join(SRC, 'workspace/charts/raster.js'), 'utf8'), /import\(['"][^'"]*export\/tiff\.js['"]\)/);
  assert.match(readFileSync(path.join(SRC, 'lib/intake/preview.js'), 'utf8'), /import\(['"]\.\/sav\.js['"]\)/);
  // and a static import of one of them would be caught: the walker sees ReportPane's own static imports
  assert.ok([...staticClosure(path.join(SRC, 'workspace/screens/ReportPane.jsx'))].some((f) => f.endsWith(`report${path.sep}build.js`)));
});
