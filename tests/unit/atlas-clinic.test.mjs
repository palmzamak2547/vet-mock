import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ATLAS_CATALOG } from '../../src/data/atlas-catalog.js';

// The clinic panel and the three cut axes are shown only where the display
// pose is verified: both westerly feline sculpts. Everything else keeps the
// legacy single-plane cut and no clinic presets.
const withClinic = ATLAS_CATALOG.filter((specimen) => specimen.clinicViews?.length);

test('clinic presets exist only on the pose-verified feline specimens', () => {
  assert.deepEqual(
    withClinic.map((specimen) => specimen.id).sort(),
    ['feline-ecorche-westerly', 'feline-skeleton-westerly'],
  );
});

for (const specimen of withClinic) {
  test(`${specimen.id} presets have usable, unique camera directions`, () => {
    const ids = specimen.clinicViews.map((preset) => preset.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const preset of specimen.clinicViews) {
      assert.ok(preset.label, 'every preset needs a Thai label');
      assert.ok(preset.direction?.length === 3);
      assert.ok(preset.direction.every((value) => Number.isFinite(value)));
      const length = Math.hypot(...preset.direction);
      assert.ok(length > 0.01 && Number.isFinite(length));
    }
  });
}
