// The one implementation of the specimen transform recorded in every conversion
// ledger. scripts/convert-atlas-specimen.mjs and scripts/regen-atlas-registry.mjs
// both import this, so the composition whose drift the label registry guards
// against cannot fork between them.
//
// Order is load-bearing and matches the converter exactly: rotate by Euler XYZ
// degrees FIRST, take bounds/center on the rotated geometry (so `center` in the
// ledger lives in rotated space), then translate by −center, then scale by
// 2/extent. See the ledger's sourceToDisplay { rotationDegreesXYZ, center, scale }.
import * as T from 'three';

function parts(ledger) {
  if (!ledger || !Array.isArray(ledger.rotationDegreesXYZ) || !Array.isArray(ledger.center)
    || !Number.isFinite(ledger.scale) || ledger.scale <= 0) throw new Error('Invalid sourceToDisplay ledger.');
  const rotation = new T.Matrix4().makeRotationFromEuler(
    new T.Euler(...ledger.rotationDegreesXYZ.map(value => value * Math.PI / 180)),
  );
  return { rotation, inverse: rotation.clone().invert(), center: new T.Vector3(...ledger.center), scale: ledger.scale };
}

/** SOURCE-space point → display-space point (model space, not screen space). */
export function sourceToDisplay([x, y, z], ledger) {
  const { rotation, center, scale } = parts(ledger);
  return new T.Vector3(x, y, z).applyMatrix4(rotation).sub(center).multiplyScalar(scale).toArray();
}

/** Display-space point → SOURCE-space point. */
export function displayToSource([x, y, z], ledger) {
  const { inverse, center, scale } = parts(ledger);
  return new T.Vector3(x, y, z).multiplyScalar(1 / scale).add(center).applyMatrix4(inverse).toArray();
}
