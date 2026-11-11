#!/usr/bin/env node
// lint:deps — every package a file imports is declared by the package.json
// of the app the file belongs to (root, ai, mobile, research, vca).
//
// An import that works only because a parent node_modules is hoisted breaks
// with a confusing error the day that parent drops the package (a Vite or
// pdf.js bump, a clean clone of one app). Node builtins, `node:`/`virtual:`
// ids and the aliases an app's vite.config.js declares are not packages.
// Declared packages no file imports are printed, not failed: some are pins (a
// transitive held at a version), types, or loaded by a path at run time.
import fs from 'node:fs';
import path from 'node:path';
import { builtinModules } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPS = ['ai', 'mobile', 'research', 'vca'];
const BUILTIN = new Set(builtinModules);
// Directories whose code is not run by Node or a bundler from this tree:
// Deno edge functions (npm:/jsr: ids), vendored static files.
const SKIP = /^(supabase\/functions|public|mobile\/android|vetmock_launch_kit|wiki|docs)\//;
export function packageOf(spec, aliases = []) {
  if (/^(\.|\/|node:|virtual:|npm:|jsr:|https?:|data:|\0)/.test(spec)) return null;
  if (aliases.some((a) => spec === a || spec.startsWith(`${a}/`))) return null;
  const clean = spec.split('?')[0];
  const name = clean.startsWith('@') ? clean.split('/').slice(0, 2).join('/') : clean.split('/')[0];
  if (BUILTIN.has(name) || !/^(@[a-z0-9][\w.-]*\/)?[a-z0-9][\w.-]*$/i.test(name)) return null;
  return name;
}

/** Packages a source imports: static, dynamic with a literal id, and require(). */
export function importsOf(source, aliases = []) {
  const out = new Set();
  const { importedFiles } = ts.preProcessFile(source, true, true);
  for (const { fileName } of importedFiles) {
    const name = packageOf(fileName, aliases);
    if (name) out.add(name);
  }
  return out;
}

/** The alias keys of an app's vite.config.js (`alias: { '@vetmock': ... }`). */
function aliasesOf(app) {
  const file = path.join(ROOT, app, 'vite.config.js');
  if (!fs.existsSync(file)) return [];
  const block = /alias\s*:\s*\{([^}]*)\}/.exec(fs.readFileSync(file, 'utf8'))?.[1] || '';
  return [...block.matchAll(/['"]([^'"]+)['"]\s*:/g)].map((m) => m[1]);
}

function appOf(file) {
  const top = file.split('/')[0];
  return APPS.includes(top) ? top : '';
}

export function lint() {
  const files = execFileSync('git', ['ls-files', '*.js', '*.jsx', '*.mjs', '*.cjs'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter((f) => f && !SKIP.test(f) && !/(^|\/)node_modules\//.test(f));
  const byApp = new Map();
  const aliases = new Map();
  for (const file of files) {
    const app = appOf(file);
    if (!byApp.has(app)) byApp.set(app, new Map());
    const used = byApp.get(app);
    if (!aliases.has(app)) aliases.set(app, aliasesOf(app));
    for (const name of importsOf(fs.readFileSync(path.join(ROOT, file), 'utf8'), aliases.get(app))) {
      if (!used.has(name)) used.set(name, []);
      used.get(name).push(file);
    }
  }
  const undeclared = [];
  const unused = [];
  for (const [app, used] of byApp) {
    const pj = JSON.parse(fs.readFileSync(path.join(ROOT, app, 'package.json'), 'utf8'));
    const declared = { ...pj.dependencies, ...pj.devDependencies, ...pj.optionalDependencies, ...pj.peerDependencies };
    if (pj.name) declared[pj.name] = true; // a self-reference
    for (const [name, where] of used) if (!declared[name]) undeclared.push({ app: app || 'root', name, where });
    for (const name of Object.keys({ ...pj.dependencies, ...pj.devDependencies })) if (!used.has(name)) unused.push({ app: app || 'root', name });
  }
  return { undeclared, unused };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { undeclared, unused } = lint();
  for (const u of undeclared) console.log(`✗ ${u.app}: imports ${u.name} without declaring it (${u.where.slice(0, 3).join(', ')}${u.where.length > 3 ? ', …' : ''})`);
  if (unused.length) console.log(`· declared, imported by no file (pins or loaded by path): ${unused.map((u) => `${u.app}:${u.name}`).join(', ')}`);
  console.log(`lint:deps: ${undeclared.length} undeclared import(s)`);
  process.exitCode = undeclared.length ? 1 : 0;
}
