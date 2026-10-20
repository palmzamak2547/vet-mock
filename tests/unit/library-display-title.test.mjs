// Sweep 2026-10-20: library cards printed Drive file names as titles
// ("VCA2026_anatomy", "สำเนาของ …", "(Minimize)2025 …", "… (1)"). The card
// shows a readable title; the stored title (search, provenance) is untouched.
import test from 'node:test';
import assert from 'node:assert/strict';
import { displayDocTitle } from '../../src/lib/library.js';

test('file-name artefacts become a readable title', () => {
  assert.equal(displayDocTitle('VCA2026_anatomy'), 'VCA2026 anatomy');
  assert.equal(displayDocTitle('สำเนาของ VCA2026_anatomy'), 'VCA2026 anatomy');
  assert.equal(displayDocTitle('swine diseases and disorders (1)'), 'swine diseases and disorders');
  assert.equal(displayDocTitle('(Minimize)2025 VCA FOR CUVET84 (Helminths and Protozoa)'), '2025 VCA FOR CUVET84 (Helminths and Protozoa) (ไฟล์ย่อ)');
  assert.equal(displayDocTitle('Principle Equine Management _ Physical examination (VCA review)'), 'Principle Equine Management, Physical examination (VCA review)');
  assert.equal(displayDocTitle('notes.pdf'), 'notes');
  assert.equal(displayDocTitle('(VCA67) Aquatic animal medicine VCA 2024 pdf'), '(VCA67) Aquatic animal medicine VCA 2024');
});

test('a clean title is left exactly as it was', () => {
  for (const t of ['Anatomy (VCA58-68)', 'เฉลย Anesthesiology 67-68', 'พรบ 2557', 'Juris, Ethics and Animal Welfare (VCA58-68)']) {
    assert.equal(displayDocTitle(t), t);
  }
});
