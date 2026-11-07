// buildLabelRegistry: pure. One provenance ledger + one authored label file in,
// that specimen's registry entry out. The regen CLI and the unit tests share
// this function; nothing here reads or writes the filesystem.
//
// The authored file is a SIBLING INPUT to the conversion ledger, never a member
// of public/atlas/*-provenance.json: the converter rewrites those on
// reconversion, which would clobber hand-authored anchors.
import { sourceToDisplay } from './atlas-label-transform.mjs';

const finitePoint = value => Array.isArray(value) && value.length === 3 && value.every(Number.isFinite);
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;

export function buildLabelRegistry(proof, authored) {
  if (!authored) return null;
  if (authored.specimen !== proof.id) throw new Error(`Label file targets "${authored.specimen}" but provenance is "${proof.id}".`);
  if (!Array.isArray(authored.labels)) throw new Error('Authored labels must be an array.');
  const partIds = new Set(proof.profiles.quick.parts.map(part => part.id));
  const rows = authored.labels.map(label => {
    if (!partIds.has(label.partId)) throw new Error(`Unknown partId "${label.partId}" for ${proof.id}.`);
    if (!nonEmpty(label.latin)) throw new Error(`Label "${label.partId}" ships with an empty latin field.`);
    if (!finitePoint(label.source)) throw new Error(`Label "${label.partId}" has no finite source anchor.`);
    if (!nonEmpty(label.pickedAt) || !nonEmpty(label.pickedAgainst)) throw new Error(`Label "${label.partId}" lacks pick provenance (pickedAt/pickedAgainst).`);
    const row = { partId: label.partId, display: sourceToDisplay(label.source, proof.sourceToDisplay), latin: label.latin.trim() };
    if (label.th !== undefined) {
      if (!nonEmpty(label.th)) throw new Error(`Label "${label.partId}" has an empty th override.`);
      row.th = label.th;
    }
    return row;
  });
  return { [proof.id]: { labels: rows } };
}
