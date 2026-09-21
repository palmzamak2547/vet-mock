// A signed-in student pressed "ทำข้อที่ผิดอีกครั้ง", answered all 23, pressed
// ส่งข้อสอบ — and got "บัญชีเปลี่ยนระหว่างทำข้อสอบ กรุณากลับไปใช้บัญชีที่เริ่มชุดนี้"
// instead of the results page. Every single time.
//
// `session` is a new object each render and its callbacks are bound to that
// render's ownerId. App.jsx's replayQuestions is memoised with an empty dep
// array, so `session.replayQuestions` inside it was the FIRST render's binding
// — created while auth was still resolving and ownerId was null. It set
// sessionOwner=null, and finishExam's owner check then rejected the submit.
//
// The same fault had already been fixed once for finishTourStart. These are
// source pins on the construct, because the defect is a stale closure: it
// cannot be reproduced by calling the function, only by rendering twice with
// auth resolving in between.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const APP = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');

/** Comments are allowed to name the anti-pattern; only code is checked. */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/** Every useCallback/useEffect in the file, with its body and its dep list. */
function hooksWithEmptyDeps(source) {
  const out = [];
  const lines = stripComments(source).split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/use(Callback|Effect|Memo)\(/.test(lines[i])) continue;
    let depth = 0; let body = '';
    for (let j = i; j < Math.min(lines.length, i + 80); j++) {
      body += `${lines[j]}\n`;
      for (const ch of lines[j]) { if (ch === '(') depth++; if (ch === ')') depth--; }
      if (depth <= 0 && j > i) break;
    }
    const deps = body.match(/\},\s*\[([^\]]*)\]\s*\)/);
    if (deps && deps[1].trim() === '') out.push({ line: i + 1, body });
  }
  return out;
}

test('no hook memoised on [] reaches for the session object directly', () => {
  // `session` is rebuilt every render. A hook with no deps that closes over it
  // keeps the first render's copy, whose ownerId was null. Go through
  // sessionRef.current instead, which always holds the current binding.
  const offenders = hooksWithEmptyDeps(APP)
    .filter((h) => /(?<!sessionRef\.current)\bsession\.[a-zA-Z]/.test(h.body.replace(/sessionRef\.current\.[a-zA-Z]+/g, 'REF')))
    .map((h) => `line ${h.line}`);
  assert.deepEqual(offenders, [], `these hooks would stamp a stale sessionOwner: ${offenders.join(', ')}`);
});

test('replayQuestions reaches the session through the ref', () => {
  const start = APP.indexOf('const replayQuestions = useCallback');
  assert.ok(start > 0, 'replayQuestions moved — re-point this guard');
  const body = APP.slice(start, start + 1800);
  assert.match(body, /sessionRef\.current\.replayQuestions\(qs\)/,
    'replayQuestions must call through sessionRef, or a redo round stamps sessionOwner=null');
  assert.doesNotMatch(body, /(^|[^.\w])session\.replayQuestions\(/,
    'a direct session.replayQuestions here is the stale first-render binding');
});

test('sessionRef exists and is refreshed on every render', () => {
  assert.match(APP, /const sessionRef = useRef\(session\);\s*\n\s*sessionRef\.current = session;/,
    'sessionRef must be assigned unconditionally each render, not inside an effect');
});

test('finishExam still refuses a set that genuinely belongs to another account', () => {
  // The guard is correct and must stay. The bug was never that it existed —
  // it was that a redo round handed it a null owner.
  assert.match(APP, /if \(authLoading \|\| session\.sessionOwner !== \(user\?\.id \?\? null\)\)/,
    'the owner check protects one student from writing history onto another');
});
