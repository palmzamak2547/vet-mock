import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const landing = read('../../src/views/LandingView.jsx');
const landingBody = read('../../src/views/landing/LandingBody.jsx');
const landingMotion = read('../../src/views/landing/useLandingMotion.js');
const quests = read('../../src/components/QuestsPanel.jsx');
const executableLandingMotion = landingMotion.replace(/\/\/.*$/gm, '');

test('landing scroll state stays observer-driven and free of pointer-frame physics', () => {
  assert.match(landing, /new IntersectionObserver/);
  assert.match(executableLandingMotion, /new IntersectionObserver/);
  assert.doesNotMatch(landing, /addEventListener\(['"]scroll/);
  assert.doesNotMatch(executableLandingMotion, /addEventListener\(['"]scroll|pointermove|lp-rail|lp-spotlight/);
});

test('landing chrome uses the canonical icon component instead of interface emoji', () => {
  assert.match(landing, /<NavIcon name=\{muted \? 'speaker-off' : 'speaker'\}/);
  assert.match(landing, /<NavIcon name=\{theme === 'dark' \? 'sun' : 'moon'\}/);
  assert.match(landing, /<NavIcon name=\{mobileOpen \? 'close' : 'menu'\}/);
  assert.doesNotMatch(landing, /🔇|🔊|🌙|☀️|☰|✕/);
  assert.doesNotMatch(landingBody, /🔖/);
});

test('quest action controls keep tactile classes and the 44px touch floor', () => {
  const claimStart = quests.indexOf('{claimable && (');
  const actionStart = quests.indexOf('{!claimable && action && (');
  const claimedStart = quests.indexOf('{quest.claimed && (');
  assert.ok(claimStart >= 0 && actionStart > claimStart && claimedStart > actionStart);

  const claimBlock = quests.slice(claimStart, actionStart);
  const actionBlock = quests.slice(actionStart, claimedStart);
  assert.equal((claimBlock.match(/\bclassName=/g) || []).length, 1);
  assert.match(claimBlock, /className="vmx-press vmx-pop-in"/);
  assert.doesNotMatch(claimBlock, /all:\s*['"]unset/);
  assert.match(actionBlock, /className="vmx-press"/);
  assert.match(actionBlock, /minHeight:\s*44/);
  assert.doesNotMatch(actionBlock, /all:\s*['"]unset|▶️|🎁/);
  assert.doesNotMatch(quests, /all:\s*['"]unset|minHeight:\s*40|▶️|🎁|linear-gradient/);
  assert.equal((quests.match(/color:\s*['"]var\(--clr-sage-on, #fff\)['"]/g) || []).length, 3);
});
