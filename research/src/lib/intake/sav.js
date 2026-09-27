// SPSS system files: .sav (uncompressed and bytecode-compressed) and .zsav (zlib, through fflate). Records
// 1, 2, 3/4, 6, 7 (subtypes 3, 4, 11, 13, 14, 20, 21, 22) and 999; value labels, user-missing values,
// variable labels, measure levels, dates [M2-DESIGN.md 5].
// OWNER: data role. STUB(m2): each export throws until its owner fills it in.

/**
 * @param {ArrayBuffer} bytes
 * @returns {Promise<{ raw: import('../runtime/types.js').RawTable, variables: { name: string, label: string|null, type: 'numeric'|'string', width: number, format: string, measure: 'nominal'|'ordinal'|'scale'|'unknown', valueLabels: { value: string, label: string }[], userMissing: { values: string[], range: [number, number]|null } }[], encoding: string, compression: 'none'|'bytecode'|'zlib', conversions: any[] }>}
 */
export function readSav(bytes) {
  throw new Error('not implemented: intake/sav.readSav');
}
