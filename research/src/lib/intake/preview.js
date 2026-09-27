// The import preview: every conversion listed before the student confirms [M1-DESIGN.md 8.1].
// OWNER: intake role.

/**
 * @typedef {Object} Conversion
 * @property {string} column             column key
 * @property {'encoding'|'thai-digits'|'be-year'|'two-digit-year'|'feb29'|'excel-date-id'|'missing-code'|'trim'|'invisible'|'nfc'|'type-conflict'|'pii'} kind
 * @property {number} count               cells affected
 * @property {{ rowId: string, from: string, to: string }[]} examples  at most 5
 * @property {boolean} needsAnswer        true when the student must choose (era, date order, two-digit century, missing reason)
 * @property {string} key                 i18n key of the sentence
 * @property {Object} params
 */

/**
 * @typedef {Object} ParsePreview
 * @property {import('../runtime/types.js').RawTable} raw
 * @property {Conversion[]} conversions
 * @property {import('../runtime/types.js').Codebook} codebook   proposed
 * @property {import('../runtime/types.js').RecipeStep} importStep   the 'import-conversions' step the confirm button will save
 * @property {{ key: string, params: Object }[]} blocking          G26 stops: questions without an answer
 */

/**
 * Bytes to a preview: decode or read the sheet, detect the header, clean cells, infer types, find
 * missing codes, dates and PII, and propose the import step.
 * @param {ArrayBuffer} bytes
 * @param {{ fileName: string, format?: 'auto'|'csv'|'tsv'|'xlsx', sheet?: string|null, headerRow?: number }} opts
 * @returns {Promise<ParsePreview>}
 */
export async function buildPreview(bytes, opts) { void bytes; void opts; throw new Error('not implemented: intake/preview.buildPreview'); }
