// ============================================================
// video-embed-host.test.mjs — YouTube is framed from the host the policy names
// ============================================================
// docs/VIDEO-LIBRARY.md section 5 says the YouTube fallback plays through
// youtube-nocookie.com, and vercel.json's frame-src and Permissions-Policy
// have allowed that host since the policy was written. The code framed
// www.youtube.com all along: the API player had no `host` and the
// playlist-only frame named www.youtube.com/embed. The doc was right and the
// code was brought to it on 11 Nov 2026.
//
// That is all the change claims. The IFrame API script still comes from
// www.youtube.com and may set youtube.com cookies before any frame loads, so
// the frame's host by itself keeps nothing from YouTube, and nothing here or
// in the release says it does.
//
// The specs that keep YouTube off the wire must block the new host as well,
// or a required gate waits on a third party again.
// ============================================================

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
const view = read('src/views/VideoView.jsx');

test('the player is framed from youtube-nocookie.com, by the API and by the playlist-only frame', () => {
  assert.match(view, /const YT_EMBED_HOST = 'https:\/\/www\.youtube-nocookie\.com';/);
  assert.match(view, /new YT\.Player\(ytContainerRef\.current, \{\s*host: YT_EMBED_HOST,/);
  assert.doesNotMatch(view, /youtube\.com\/embed/, 'no frame from www.youtube.com');
  assert.equal((view.match(/\$\{YT_EMBED_HOST\}\/embed\//g) || []).length, 3, 'the three embed addresses use the constant');
});

test('the site policy allows that frame', () => {
  const headers = JSON.parse(read('vercel.json')).headers.flatMap((h) => h.headers);
  const csp = headers.find((h) => h.key === 'Content-Security-Policy').value;
  const frameSrc = csp.split(';').map((d) => d.trim()).find((d) => d.startsWith('frame-src '));
  assert.ok(frameSrc.split(' ').includes('https://www.youtube-nocookie.com'), frameSrc);
  const permissions = headers.find((h) => h.key === 'Permissions-Policy').value;
  for (const feature of ['autoplay', 'encrypted-media', 'fullscreen', 'picture-in-picture']) {
    const rule = permissions.split(',').map((r) => r.trim()).find((r) => r.startsWith(`${feature}=`));
    assert.ok(rule.includes('"https://www.youtube-nocookie.com"'), `${feature}: ${rule}`);
  }
});

test('the view says what the frame host is and claims no privacy for it', () => {
  const note = view.slice(view.indexOf('// The player itself is framed from'), view.indexOf('const YT_EMBED_HOST'));
  assert.match(note, /the API script above comes from www\.youtube\.com/);
  assert.doesNotMatch(view, /privacy-enhanced|sets no cookie/i);
  assert.match(view, /tag\.src = 'https:\/\/www\.youtube\.com\/iframe_api';/, 'the API script is the one the note describes');
  for (const doc of ['docs/MEDIA.md', 'docs/releases/5.203.0.md', 'src/data/changelog/5.203.0.js']) {
    assert.doesNotMatch(read(doc), /privacy-enhanced|sets no cookie|ไม่เก็บคุกกี้|เป็นส่วนตัว/i, `${doc} claims privacy for the frame host`);
  }
});

test('every spec that blocks YouTube blocks the frame host too', () => {
  const dir = new URL('../e2e/', import.meta.url);
  const blocking = readdirSync(dir).filter((f) => f.endsWith('.spec.js'))
    .map((f) => [f, readFileSync(new URL(f, dir), 'utf8')])
    .filter(([, text]) => text.split('\n').some((line) => /page\.route\(/.test(line) && /youtube/.test(line)));
  assert.ok(blocking.length >= 6, `only ${blocking.length} specs block YouTube`);
  for (const [name, text] of blocking) {
    const routes = text.split('\n').filter((line) => /page\.route\(/.test(line) && /youtube/.test(line)).join('\n');
    assert.match(routes, /nocookie/, `${name} blocks youtube.com and would still load the player from youtube-nocookie.com`);
  }
});
