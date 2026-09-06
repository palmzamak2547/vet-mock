import { ATLAS_PARTS } from '../data/atlas.js';

export const ATLAS_IDS = Object.freeze(ATLAS_PARTS.map(part => part.id));
export function atlasSearch(query) {
  const tokens = String(query || '').normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return ATLAS_PARTS.filter(part => {
    const text = `${part.th} ${part.en} ${part.latin} ${part.id} ${part.group}`.normalize('NFKC').toLocaleLowerCase();
    return tokens.every(token => text.includes(token));
  });
}

export function atlasPartFromHash(hash) {
  const value = new URLSearchParams(String(hash || '').replace(/^#/, '')).get('part');
  return ATLAS_IDS.includes(value) ? value : null;
}

export function atlasVisibleIds(selected, hidden, isolated) {
  const blocked = new Set(hidden);
  return ATLAS_IDS.filter(id => !blocked.has(id) && (!isolated || id === selected));
}

// Tap and orbit are different actions. Multi-touch/cancel never selects a part.
export function atlasIsTap(start, end) {
  return Boolean(start && end && start.pointerId === end.pointerId && end.button === 0
    && Math.hypot(start.x - end.x, start.y - end.y) <= 6);
}

export function assertAtlasModelIds(ids) {
  if (ids.length !== ATLAS_IDS.length || new Set(ids).size !== ids.length
      || ids.some(id => !ATLAS_IDS.includes(id))) {
    throw new Error('Model surfaces do not match the published anatomy inventory.');
  }
}
