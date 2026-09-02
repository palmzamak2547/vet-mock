// ============================================================
// Study-buddies presence — one message per pause, not per question
// ============================================================
// supabase-js sends a presence `track` on every call and Realtime caps
// presence events per client; production logged the cap being hit on
// 2026-09-01. These contracts keep the hook from tracking on every render
// input change: a fixed joined_at, a trailing timer for metadata updates,
// no re-send of an unchanged payload, and dependencies on the profile
// fields rather than the profile object.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../../src/hooks/useStudyBuddies.js', import.meta.url), 'utf8');

test('joined_at is fixed for the life of the channel, never minted per track', () => {
  assert.match(src, /const joinedAtRef = useRef\(0\);/);
  assert.match(src, /joinedAtRef\.current = Date\.now\(\);/);
  assert.doesNotMatch(src, /joined_at: Date\.now\(\)/, 'a fresh joined_at makes every payload unique and defeats the dedupe');
});

test('metadata updates coalesce on a trailing timer', () => {
  assert.match(src, /const RETRACK_DELAY_MS = 1500;/);
  assert.match(src, /clearTimeout\(retrackTimerRef\.current\);\n    retrackTimerRef\.current = setTimeout\(\(\) => \{\n      retrackTimerRef\.current = null;\n      sendPresence\(false\);\n    \}, RETRACK_DELAY_MS\);/);
  // The timer is cleared with the channel, so an unmount never tracks late.
  assert.match(src, /cancelled = true;\n      clearTimeout\(retrackTimerRef\.current\);/);
});

test('an unchanged payload is not re-sent, except when re-announcing after a background kill', () => {
  assert.match(src, /if \(!force && key === lastSentRef\.current\) return;/);
  assert.match(src, /if \(status === 'SUBSCRIBED' && !cancelled\) sendPresence\(true\);/);
  assert.match(src, /if \(document\.visibilityState !== 'visible'\) return;\n      sendPresence\(true\);/);
});

test('the update effect depends on the profile fields the panel shows, not the profile object', () => {
  assert.match(src, /\}, \[user\?\.id, username, avatar, subject, view, qKey\]\);/);
  assert.doesNotMatch(src, /\}, \[subject, view, qKey, user, profile\]\);/);
  assert.doesNotMatch(src, /\}, \[user, profile, subject, view, qKey\]\);/);
});
