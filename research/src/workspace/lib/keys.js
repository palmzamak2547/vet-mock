// Dictionary key segments are lowerCamel [M1-DESIGN.md 4.2]; ids and option values that carry
// hyphens or dots ('row-exclude', 'mh-within', 'two.sided', 'wald-log') become one segment here.
// OWNER: workspace role.

/** @param {string|number|boolean} v @returns {string} */
export function keyPart(v) {
  return String(v).replace(/[-.]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, '');
}
