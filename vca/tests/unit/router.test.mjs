// Paths to pages. Every public page has a route; anything else is the not-found page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, withQuery, PAGES } from '../../src/router.js';

test('fixed pages', () => {
  assert.equal(parseRoute('/').name, 'home');
  assert.equal(parseRoute('').name, 'home');
  assert.equal(parseRoute('/exam').name, 'exam');
  assert.equal(parseRoute('/exam/').name, 'exam', 'a trailing slash is the same page');
  for (const [path, name] of Object.entries(PAGES)) assert.equal(parseRoute(path).name, name);
  for (const name of ['practice', 'session', 'bank', 'library', 'progress', 'exam', 'about']) {
    assert.ok(Object.values(PAGES).includes(name), `${name} has a path`);
  }
});

test('a domain page', () => {
  const r = parseRoute('/d/swine');
  assert.equal(r.name, 'domain');
  assert.deepEqual(r.params, { id: 'swine' });
  assert.deepEqual(parseRoute('/d/neuro-ophtho').params, { id: 'neuro-ophtho' });
  assert.equal(parseRoute('/d/Swine').name, 'notFound');
  assert.equal(parseRoute('/d/').name, 'notFound');
  assert.equal(parseRoute('/d/swine/extra').name, 'notFound');
});

test('a result page', () => {
  const r = parseRoute('/result/mbx1k2-ab12cd34');
  assert.equal(r.name, 'result');
  assert.deepEqual(r.params, { id: 'mbx1k2-ab12cd34' });
  assert.equal(parseRoute('/result/abc').name, 'notFound', 'too short to be an id');
  assert.equal(parseRoute('/result/ABC123').name, 'notFound');
});

test('anything else is not found', () => {
  for (const path of ['/nope', '/exam/2', '/app', '/practice/mock', '/index.html']) assert.equal(parseRoute(path).name, 'notFound', path);
});

test('the query travels with the route', () => {
  const r = parseRoute('/practice', '?mode=mock&d=swine,equine&n=50');
  assert.equal(r.name, 'practice');
  assert.equal(r.query.get('mode'), 'mock');
  assert.equal(r.query.get('d'), 'swine,equine');
  assert.equal(parseRoute('/bank', '?q=Leptospira').query.get('q'), 'Leptospira');
});

test('withQuery drops empty values and joins lists', () => {
  assert.equal(withQuery('/practice', {}), '/practice');
  assert.equal(withQuery('/practice', { mode: 'mock', d: ['swine', 'equine'], n: 50, s: null, t: [], src: '', x: undefined }), '/practice?mode=mock&d=swine%2Cequine&n=50');
  assert.equal(withQuery('/bank', { q: 'เลปโต สไปรา' }), `/bank?q=${new URLSearchParams({ q: 'เลปโต สไปรา' }).toString().slice(2)}`);
  const back = parseRoute('/practice', withQuery('/practice', { d: ['swine', 'equine'] }).split('?')[1]);
  assert.equal(back.query.get('d'), 'swine,equine');
});
