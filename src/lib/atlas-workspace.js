import { ATLAS_CATALOG, DEFAULT_ATLAS_ID, getAtlasSpecimen } from '../data/atlas-catalog.js';

export function readAtlasLocation(hash = '') {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const legacyPart = params.get('part');
  const id = params.get('specimen') || (legacyPart ? 'canine-skull-base-cuhl9' : DEFAULT_ATLAS_ID);
  const specimen = getAtlasSpecimen(id);
  const compareId = params.get('compare');
  return {
    specimenId: specimen.id,
    selected: specimen.parts.some((part) => part.id === legacyPart) ? legacyPart : specimen.parts[0].id,
    compareId:
      compareId !== specimen.id && ATLAS_CATALOG.some((item) => item.id === compareId) ? compareId : null,
  };
}
export function atlasSharePath({ specimenId, selected, compareId }) {
  const specimen = getAtlasSpecimen(specimenId);
  const params = new URLSearchParams({ specimen: specimen.id });
  if (specimen.parts.some((part) => part.id === selected)) params.set('part', selected);
  if (compareId !== specimen.id && ATLAS_CATALOG.some((item) => item.id === compareId))
    params.set('compare', compareId);
  return `/app/atlas#${params}`;
}
export function filterAtlasParts(specimen, query) {
  const words = String(query || '')
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return specimen.parts.filter((part) =>
    words.every((word) =>
      `${part.th} ${part.en} ${part.latin || ''} ${part.group || ''} ${part.systemLabel || ''}`
        .normalize('NFKC')
        .toLowerCase()
        .includes(word),
    ),
  );
}
export function visibleAtlasParts(specimen, selected, hidden, isolated) {
  const excluded = new Set(hidden);
  return specimen.parts
    .filter((part) => !excluded.has(part.id) && (!isolated || part.id === selected))
    .map((part) => part.id);
}

// Operate on the current visible set, including isolation, and only IDs that
// actually belong to this specimen. Showing a group preserves other layers.
export function atlasGroupVisibility(specimen, visibleIds, groupIds, action) {
  const valid = new Set(specimen.parts.map((part) => part.id));
  const group = new Set(groupIds.filter((id) => valid.has(id)));
  const visible = new Set(visibleIds.filter((id) => valid.has(id)));
  if (!['show', 'hide', 'isolate'].includes(action) || !group.size) return [...visible];
  if (action === 'isolate') return specimen.parts.filter((part) => group.has(part.id)).map((part) => part.id);
  for (const id of group) {
    if (action === 'show') visible.add(id);
    else visible.delete(id);
  }
  return specimen.parts.filter((part) => visible.has(part.id)).map((part) => part.id);
}
// A bounding sphere remains inside view at every orientation, including tall
// specimens in a narrow comparison pane. No axis-dependent clipping guesses.
export function atlasFitDistance(radius, verticalFov, aspect, padding = 1.12) {
  const halfVertical = (verticalFov * Math.PI) / 360;
  const halfHorizontal = Math.atan(Math.tan(halfVertical) * Math.max(0.1, aspect));
  return (Math.max(0.05, radius) / Math.sin(Math.min(halfVertical, halfHorizontal))) * padding;
}
