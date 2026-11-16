// The account pill in the header (src/components/UserMenu.jsx), drawn by the real component.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const sourceRoot = new URL('../../src/', import.meta.url).href;
registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith(sourceRoot) && url.endsWith('.jsx')) {
      const { code } = transformSync(readFileSync(new URL(url), 'utf8'), { loader: 'jsx', jsx: 'automatic', format: 'esm', sourcefile: url });
      return { format: 'module', shortCircuit: true, source: code };
    }
    return nextLoad(url, context);
  },
});
const { default: UserMenu } = await import('../../src/components/UserMenu.jsx');

const nameOf = (username) => {
  const html = renderToStaticMarkup(createElement(UserMenu, { profile: { username, avatar_emoji: '🐾' } }));
  const span = html.match(/<span class="vmx-usermenu-name"([^>]*)>([^<]*)<\/span>/);
  assert.ok(span, 'the name is drawn');
  return { attrs: span[1], text: span[2] };
};

test('a short name sits in the middle of its slot, which keeps its width', () => {
  const { attrs, text } = nameOf('palm');
  assert.equal(text, 'palm');
  assert.match(attrs, /width:100px/);
  assert.match(attrs, /text-align:center/);
});

test('a long name cut by its slot is still shown whole on pointing at it', () => {
  const long = 'สมาชิกที่มีชื่อยาวมากจริงๆ';
  const { attrs } = nameOf(long);
  assert.match(attrs, /text-overflow:ellipsis/);
  assert.ok(attrs.includes(`title="${long}"`));
});
