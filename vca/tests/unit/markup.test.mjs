// Two rules about the markup and the styles that a browser test cannot hold on a desk:
//
//  1. An element with data-reveal has a class list that belongs to the reveal observer
//     (lib/motion.js adds is-in when it scrolls into view, and never looks at it again). A page
//     that writes the class itself, with a className that can change, wipes is-in the next time it
//     draws a different value: the element stays at opacity 0, a blank gap (the library shelf you
//     arrived at, once the tab dropped it from the address). Such an element takes a plain string
//     for its class, and anything that varies goes in a data attribute.
//  2. A sheet is as tall as the screen the reader sees. vh is the taller screen of iPhone Safari
//     with its toolbar away, so a sheet's height in vh sits off the top of the screen while the
//     toolbar shows; each such height has its dvh form after it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../../src/', import.meta.url));

function files(dir, ext) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return files(p, ext);
    return ext.test(e.name) ? [p] : [];
  });
}

/**
 * The opening tags of a JSX file, each as a skeleton: what sits at the tag's own level, with
 * every {expression} and "string" folded to a marker, so `className={...}` and `className="..."`
 * tell apart whatever the expression holds, and a nested tag inside an attribute is not the
 * outer tag's own.
 */
function* tags(code) {
  const start = /<([A-Za-z][\w.]*)(?=[\s/>])/g;
  for (let m; (m = start.exec(code));) {
    let skeleton = m[1];
    const stack = [];
    for (let i = start.lastIndex; i < code.length; i += 1) {
      const c = code[i];
      const top = stack[stack.length - 1];
      if (top === '`') {
        if (c === '\\') i += 1;
        else if (c === '`') stack.pop();
        else if (c === '$' && code[i + 1] === '{') { stack.push('{'); i += 1; }
        continue;
      }
      if (top === '"' || top === "'") {
        if (c === '\\') i += 1;
        else if (c === top) { stack.pop(); if (!stack.length) skeleton += '"…"'; }
        continue;
      }
      if (c === '"' || c === "'" || c === '`' || c === '{') { stack.push(c); continue; }
      if (c === '}') { stack.pop(); if (!stack.length) skeleton += '{…}'; continue; }
      if (stack.length) continue;
      if (c === '>') { yield skeleton; break; }
      skeleton += c;
    }
  }
}

/** Elements that observe the reveal and write their class list from an expression. */
function revealWithComputedClass(code) {
  return [...tags(code)].filter((t) => /\sdata-reveal(\s|=|\/|$)/.test(` ${t}`) && /\sclassName=\{…\}/.test(` ${t}`));
}

test('no element the reveal observer watches has a class list that can change', () => {
  const problems = [];
  for (const file of files(SRC, /\.jsx$/)) {
    for (const tag of revealWithComputedClass(fs.readFileSync(file, 'utf8'))) problems.push(`${path.relative(SRC, file)}: <${tag.split(/\s/)[0]} ... className={...} data-reveal>`);
  }
  assert.deepEqual(problems, [], 'use className="..." and put what varies in a data- attribute (styles: [data-...])');
});

test('the scan sees the tags it is meant to', () => {
  const bad = [
    '<section key={a} className={`shelf${on ? " is-focus" : ""}`} data-reveal>',
    '<div className={cls} data-reveal style={{ "--i": 1 }} />',
    '<li data-reveal className={`a${b ? `c` : ""}`}>',
  ];
  for (const code of bad) assert.equal(revealWithComputedClass(code).length, 1, code);
  const fine = [
    '<section key={a} className="shelf" data-focus={on ? "" : undefined} data-reveal>',
    '<div className={cls} style={{ "--i": a > b ? 1 : 2 }}>no reveal here</div>',
    // data-reveal belongs to the inner element, whose class is a plain string; the outer one is not blamed for it.
    '<Foo render={<div className="inner" data-reveal />} className={cls} />',
    '<p className="q">{n > 1 && <b className={x}>y</b>}</p>',
  ];
  for (const code of fine) assert.deepEqual(revealWithComputedClass(code), [], code);
});

test('every height a sheet is given in vh has its dvh form right after it', () => {
  const css = fs.readFileSync(path.join(SRC, 'styles/components.css'), 'utf8');
  const heights = [];
  for (const [, selector, body] of css.matchAll(/(\.sheet[^{}]*)\{([^{}]*)\}/g)) {
    const decls = body.split(';').map((d) => d.trim()).filter(Boolean);
    decls.forEach((d, i) => {
      if (/^max-height:.*\d\s*vh/.test(d) && !/dvh/.test(d)) heights.push({ selector: selector.trim(), vh: d, next: decls[i + 1] });
    });
  }
  assert.ok(heights.length >= 2, 'the desk and the phone rule both give a sheet a height');
  for (const h of heights) assert.equal(h.next?.replace(/dvh/g, 'vh'), h.vh, `${h.selector}: "${h.vh}" needs the same in dvh straight after it, for a browser that has dvh`);
});
