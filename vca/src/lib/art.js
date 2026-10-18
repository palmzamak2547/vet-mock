// A domain's plate is drawn from the smallest copy that is sharp on the screen asking: the art is 418
// to 512 px and a print on the home wall is 62 px on a phone, so an <img> offers the browser the
// copies made by scripts/make-plates.mjs (src/data/plates.js) as a srcset, widest last.

import { PLATES } from '../data/plates.js';

const sets = new Map();

/**
 * The srcset for a plate: its smaller copies, then the art itself at its own width.
 * @param {string} art a domain card's `art`, "/art/<name>.webp"
 * @returns {string | undefined} undefined for a print that has no copies
 */
export function artSet(art) {
  if (sets.has(art)) return sets.get(art);
  const name = /^\/art\/([^/]+)\.webp$/.exec(art)?.[1];
  const plate = name ? PLATES[name] : undefined;
  const set = plate ? [...plate.sizes.map((w) => `/art/${w}/${name}.webp ${w}w`), `${art} ${plate.width}w`].join(', ') : undefined;
  sets.set(art, set);
  return set;
}
