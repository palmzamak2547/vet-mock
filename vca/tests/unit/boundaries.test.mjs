// The layers of vca/src and what each may reach for (ARCHITECTURE.md, "Layers"). A new import
// that crosses a line fails here, before it becomes a habit:
//
//   data, generated   facts, imports nothing
//   lib               logic, stores and browser plumbing: data, generated, react
//   components        UI pieces: lib, data, generated, the router, react
//   pages             the practice product's routes: components, lib, data, generated, router
//   online            accounts and community: anything above, plus the network
//   app (App.jsx, main.jsx, router.js)   composes all of it
//   styles            any layer may bring its own stylesheet
//
// The practice product never needs the network: components and pages reach online/ only
// through its front door, online/index.js, which loads the rest when it is first used. Only
// online/client.js talks to Supabase, and VetMock's own code comes in through the @vetmock alias
// and only for the few display helpers both sites must agree on.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../../src/', import.meta.url));
const VETMOCK_SHARED = new Set(['lib/richtext.jsx', 'lib/option-shuffle.js']);
const PACKAGES = {
  react: 'any',
  'react-dom/client': ['main.jsx'],
  '@supabase/supabase-js': ['online/client.js'],
  '@line/liff': ['online/line.js'],
};

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return files(p);
    return /\.(jsx?|mjs)$/.test(e.name) ? [p] : [];
  });
}

/** Every module a file asks for: static imports, re-exports and dynamic import(). */
function specifiers(text) {
  const out = [];
  const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  for (const m of code.matchAll(/^\s*(?:import|export)\b[^;'"`]{0,400}?\bfrom\s*['"]([^'"]+)['"]/gm)) out.push(m[1]);
  for (const m of code.matchAll(/^\s*import\s*['"]([^'"]+)['"]/gm)) out.push(m[1]);
  for (const m of code.matchAll(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g)) out.push(m[1]);
  return out;
}

const layerOf = (rel) => {
  const top = rel.split('/')[0];
  if (['data', 'generated', 'lib', 'components', 'pages', 'online', 'styles'].includes(top)) return top;
  return 'app';
};

const MAY = {
  data: ['data'],
  generated: ['generated'],
  lib: ['lib', 'data', 'generated'],
  components: ['components', 'lib', 'data', 'generated', 'app:router.js', 'online:index.js'],
  pages: ['components', 'lib', 'data', 'generated', 'app:router.js', 'online:index.js', 'pages:NotFound.jsx'],
  online: ['online', 'components', 'lib', 'data', 'generated', 'app:router.js', 'pages:NotFound.jsx'],
  app: ['app', 'components', 'lib', 'data', 'generated', 'pages', 'online'],
};

const allowed = (fromLayer, toRel) => {
  const toLayer = layerOf(toRel);
  if (toLayer === 'styles') return true;
  return MAY[fromLayer].some((rule) => {
    const [layer, file] = rule.split(':');
    if (layer !== toLayer) return false;
    if (!file) return true;
    return toLayer === 'app' ? toRel === file : toRel === `${layer}/${file}`;
  });
};

test('every import in vca/src stays inside its layer\'s reach', () => {
  const problems = [];
  for (const file of files(SRC)) {
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const from = layerOf(rel);
    for (const spec of specifiers(fs.readFileSync(file, 'utf8'))) {
      if (spec.startsWith('.')) {
        const target = path.relative(SRC, path.resolve(path.dirname(file), spec)).split(path.sep).join('/');
        if (target.startsWith('..')) problems.push(`${rel}: ${spec} reaches outside vca/src; VetMock's code comes in through @vetmock/`);
        else if (!allowed(from, target)) problems.push(`${rel} (${from}) may not import ${target}`);
      } else if (spec.startsWith('@vetmock/')) {
        const shared = spec.slice('@vetmock/'.length);
        if (!VETMOCK_SHARED.has(shared)) problems.push(`${rel}: @vetmock/${shared} is not one of the helpers the two sites share`);
      } else {
        const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
        const who = PACKAGES[spec] ?? PACKAGES[pkg];
        if (!who) problems.push(`${rel}: package ${spec} is not one this app depends on at run time`);
        else if (who !== 'any' && !who.includes(rel)) problems.push(`${rel}: only ${who.join(', ')} may import ${spec}`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

test('the boundary check sees the imports it is meant to', () => {
  assert.deepEqual(specifiers(`import a from './a.js';\nimport { b } from "../b.js";\nexport { c } from './c.js';\nimport './d.css';\nconst e = () => import('./e.jsx');\n// import x from './no.js';`),
    ['./a.js', '../b.js', './c.js', './d.css', './e.jsx']);
  assert.equal(allowed('components', 'pages/Home.jsx'), false);
  assert.equal(allowed('pages', 'pages/NotFound.jsx'), true);
  assert.equal(allowed('pages', 'online/board/Board.jsx'), false);
  assert.equal(allowed('pages', 'online/index.js'), true);
  assert.equal(allowed('lib', 'components/Icon.jsx'), false);
  assert.equal(allowed('online', 'lib/format.js'), true);
});
