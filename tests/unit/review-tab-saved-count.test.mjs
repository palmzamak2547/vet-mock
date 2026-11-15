import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadModule } from '../helpers/fake-react.mjs';

const stubs = [
  { match: '/lib/dialog\.js$', contents: 'export const alertDialog = () => {}; export const confirmDialog = async () => true;' },
  { match: '/components/Mochi\.jsx$', contents: 'export default () => null;' },
];
const { savedQuestionsLine } = await loadModule('src/views/PinboardView.jsx', { stubs });
const read = (f) => fs.readFileSync(f, 'utf8');

test('the pinboard names the bookmarked questions the header chip counts', () => {
  assert.equal(savedQuestionsLine(1), 'ข้อที่บันทึกไว้ 1 ข้อ');
  assert.equal(savedQuestionsLine(1234), 'ข้อที่บันทึกไว้ 1,234 ข้อ');
});

test('no bookmarks, no line; bad input never prints a number', () => {
  for (const v of [0, -2, null, undefined, NaN, 'x']) assert.equal(savedQuestionsLine(v), '');
});

test('App hands the board the same bookmarks the header counts', () => {
  const app = read('src/App.jsx');
  const line = app.split('\n').find((l) => l.includes('<PinboardView'));
  assert.match(line, /\bbookmarks\b/);
  assert.match(line, /\bsetMode\b/);
});

test('the planner says one thing once and in Thai', () => {
  const s = read('src/views/SRSessionView.jsx');
  assert.ok(s.includes("'เริ่มทบทวน'"));
  assert.ok(!s.includes('เริ่ม Session'));
  assert.ok(!s.includes('ทำติดต่อกันทุกวันสำคัญกว่า'));
  assert.ok(!s.includes('Algorithm'));
  assert.ok(!s.includes('<p>ทบทวนเสร็จแล้ว, กลับมา'));
  assert.ok(!s.includes('ทำต่ออีก session'));
});
