// Fields the source files keep for the repository's own scripts and that no screen reads, removed
// from the modules the browser downloads. The source files stay as they are: scripts/ (the
// source-document lint, the provenance build, the evidence build) and the VCA bank build read them
// from src/ with Node, never through this plugin.
//
// A field joins a list only when nothing in src/, api/, vca/src or ai/src reads it, and
// tests/unit/strip-unread-fields.test.mjs fails as soon as one of those starts to. Fields the app
// does read stay, among them verificationSources and sourceDocument (the source chip).
import { parseAst } from 'rollup/parseAst';

export const UNREAD_FIELDS = Object.freeze({
  // On a question object (src/data/questions-*.js).
  question: Object.freeze([
    'sourcePages', // structured page citations: scripts/lint-source-docs.mjs and scripts/provenance/build.mjs
    '_pdfRef',
    '_confidence',
  ]),
  // On a wrap-up bullet, groups[].items[] (src/data/wrapups/*.js). The page shows each bullet's
  // emphasis[].src and examined[].src; the item's own list of sources is for the ingest's check.
  wrapupItem: Object.freeze(['sources']),
});

const QUESTION_FILE = /[\\/]src[\\/]data[\\/]questions-[^\\/]+\.js$/;
const WRAPUP_FILE = /[\\/]src[\\/]data[\\/]wrapups[\\/][^\\/]+\.js$/;

const keyName = (prop) => {
  if (prop.type !== 'Property' || prop.computed) return null;
  if (prop.key.type === 'Identifier') return prop.key.name;
  if (prop.key.type === 'Literal' && typeof prop.key.value === 'string') return prop.key.value;
  return null;
};

// Visit every ObjectExpression with the name of the property whose value holds it, through arrays
// (a question inside `export const X = [ ... ]` has no parent key; a wrap-up bullet's is `items`).
function visitObjects(node, parentKey, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { for (const n of node) visitObjects(n, parentKey, visit); return; }
  if (node.type === 'ObjectExpression') {
    visit(node, parentKey);
    for (const p of node.properties) {
      if (p.type === 'Property') visitObjects(p.value, keyName(p), visit);
      else visitObjects(p, null, visit);
    }
    return;
  }
  if (node.type === 'ArrayExpression') { for (const e of node.elements) visitObjects(e, parentKey, visit); return; }
  for (const [k, v] of Object.entries(node)) {
    if (k === 'type' || k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue;
    if (v && typeof v === 'object') visitObjects(v, null, visit);
  }
}

// The source ranges to cut: each dropped property with the comma that joins it to a neighbour.
function cutsFor(obj, drop) {
  const props = obj.properties;
  const dropped = props.map((p) => drop.has(keyName(p)));
  const lastKept = dropped.lastIndexOf(false);
  const cuts = [];
  props.forEach((p, i) => {
    // Before the last kept property: the property up to the next one.
    if (dropped[i] && i < lastKept) cuts.push([p.start, props[i + 1].start]);
  });
  // A dropped run at the end goes from the last kept property's end, taking the comma before it.
  if (lastKept < props.length - 1) {
    cuts.push([lastKept >= 0 ? props[lastKept].end : props[0].start, props[props.length - 1].end]);
  }
  return cuts;
}

/** The module's code without the unread fields, or null when it has none to drop. */
export function stripUnreadFields(code, id) {
  const isQuestion = QUESTION_FILE.test(id);
  const isWrapup = !isQuestion && WRAPUP_FILE.test(id);
  if (!isQuestion && !isWrapup) return null;
  const names = isQuestion ? UNREAD_FIELDS.question : UNREAD_FIELDS.wrapupItem;
  if (!names.some((n) => code.includes(n))) return null;
  const drop = new Set(names);
  const ast = parseAst(code);
  let cuts = [];
  visitObjects(ast.body, null, (obj, parentKey) => {
    if (isWrapup && parentKey !== 'items') return;
    cuts.push(...cutsFor(obj, drop));
  });
  if (!cuts.length) return null;
  cuts.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const c of cuts) {
    const last = merged[merged.length - 1];
    if (last && c[0] <= last[1]) last[1] = Math.max(last[1], c[1]);
    else merged.push([...c]);
  }
  let out = '';
  let at = 0;
  for (const [s, e] of merged) { out += code.slice(at, s); at = e; }
  return out + code.slice(at);
}

export function stripUnreadFieldsPlugin() {
  return {
    name: 'strip-unread-fields',
    enforce: 'pre',
    transform(code, id) {
      const out = stripUnreadFields(code, id.split('?')[0]);
      return out === null ? null : { code: out, map: null };
    },
  };
}
