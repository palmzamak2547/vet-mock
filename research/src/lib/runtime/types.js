// Shared JSDoc types for Research Studio. No runtime code: every module imports types from here
// with `@typedef {import('../runtime/types.js').X} X`. The contract behind each type is written out
// in docs/research/M1-DESIGN.md (section numbers in brackets). OWNER: runtime role.

/**
 * Owner scope of every stored record [9]. 'guest' before sign-in, 'u.<supabase user uuid>' after.
 * @typedef {'guest' | `u.${string}`} OwnerScope
 */

/**
 * The file as the student gave it, decoded but never converted [8].
 * @typedef {Object} RawTable
 * @property {string[]} header           header cells as decoded (NFC applied, nothing else)
 * @property {string[][]} columns        column-major raw cell text; columns[c][r]
 * @property {string[]} rowIds           'r1'..'rN' in source order; typed rows get 'n1'.. (recipe)
 * @property {number} rowCount
 * @property {RawSource} source
 */

/**
 * @typedef {Object} RawSource
 * @property {string} fileName
 * @property {number} bytes
 * @property {string} sha256              hex of the original bytes
 * @property {'utf-8'|'utf-8-bom'|'utf-16le'|'windows-874'|'xlsx'} encoding
 * @property {'csv'|'tsv'|'xlsx'|'paste'} format
 * @property {string|null} sheet          xlsx sheet name
 * @property {number} headerRow           0-based row of the header in the source
 * @property {string} importedAt          ISO 8601 UTC
 */

/**
 * One column's codebook entry [8.3].
 * @typedef {Object} CodebookEntry
 * @property {string} key                 stable id 'c1'..; derived columns 'd1'..
 * @property {string} name                header text from the file
 * @property {string} labelTh
 * @property {string} labelEn
 * @property {'continuous'|'count'|'binary'|'nominal'|'ordinal'|'date'|'id'|'text'} type
 * @property {'outcome'|'exposure'|'confounder'|'group'|'cluster'|'id'|'pair'|'rater'|'time'|'none'} role
 * @property {'region'|'farm'|'pen'|'household'|'litter'|'animal'|'sample'|'visit'} level
 * @property {string|null} unit
 * @property {{value: string, labelTh: string, labelEn: string}[]} levels  order = ordinal order
 * @property {string|null} reference      reference level (exposure) or null
 * @property {string|null} positive       level counted as positive (binary outcome, test result)
 * @property {{code: string, reason: 'unknown'|'not-applicable'|'not-recorded'}[]} missingCodes
 * @property {{min: number|null, max: number|null}|null} range
 * @property {'name'|'phone'|'national-id'|'address'|'line-id'|'email'|null} pii
 * @property {boolean} hidden             hidden from the grid and every export by default when pii
 */

/**
 * @typedef {Object} Codebook
 * @property {CodebookEntry[]} columns
 * @property {string} unitOfAnalysis      level the rows describe, usually 'animal'
 * @property {string|null} clusterKey     column key of the cluster (farm) id, or null when none
 */

/**
 * A replayable change; the raw table is never edited [8.4].
 * @typedef {Object} RecipeStep
 * @property {string} id                  's1'.. unique within the dataset
 * @property {number} seq                 order of application
 * @property {'import-conversions'|'set-type'|'missing-code'|'cell-edit'|'row-add'|'row-exclude'|'recode'|'bin'|'reference'|'filter'|'derive-age'} kind
 * @property {Object} params              per kind, see M1-DESIGN.md 8.4
 * @property {string|null} reason         required for row-exclude and filter, optional otherwise
 * @property {string} at                  ISO 8601 UTC
 */

/**
 * Column after the recipe [8.5]. Missing cells carry a reason code in `missing`.
 * @typedef {Object} Column
 * @property {string} key
 * @property {'number'|'date'|'category'|'text'} kind
 * @property {Float64Array|Int32Array|(string|null)[]} values  number: value or NaN; date: days since
 *   1970-01-01 (proleptic Gregorian, CE) or NaN; category: level index or -1; text: string or null
 * @property {string[]} [levels]          category only, in codebook order
 * @property {Uint8Array} missing         0 present, 1 blank, 2 unknown, 3 not applicable, 4 not recorded, 5 invalid
 */

/**
 * @typedef {Object} WorkingTable
 * @property {string[]} rowIds
 * @property {Record<string, Column>} columns
 * @property {number} n
 * @property {number} recipeRev
 * @property {Record<string, string>} excluded   rowId -> step id that excluded or filtered it
 * @property {string} fingerprint           sha-256 hex of the canonical CSV of the rows in use [10.4]
 */

/**
 * What the student asked for, with every option spelled out [10.1].
 * @typedef {Object} AnalysisSpec
 * @property {1} specVersion
 * @property {string} method              catalogue id, e.g. 'epi.twoByTwo'
 * @property {{kind: 'dataset', datasetId: string, recipeRev: number} | {kind: 'counts', counts: Object} | {kind: 'params', params: Object}} input
 * @property {'cross-sectional'|'cohort'|'case-control'|'trial'|'diagnostic'|'agreement'|'descriptive'|null} design
 * @property {Object<string, string|string[]>} roles     outcome, exposure, group, x, y, strata, cluster, pair, raterA, raterB, test, reference, covariates
 * @property {Object<string, string|string[]|null>} levels  outcomePositive, exposureLevel, referenceLevel, testPositive, referencePositive, order
 * @property {Object} options              complete after normalizeSpec(); see M1-DESIGN.md 10.1 table
 * @property {{route: 'none'|'deff'|'mh-within'|'aggregate'|null, column: string|null}} cluster
 */

/**
 * A number the result reports [10.2]. `value` null means undefined, never 0; `reasonKey` says why.
 * @typedef {Object} Value
 * @property {number|null} value
 * @property {[number|null, number|null]} [ci]     bounds may be Infinity / -Infinity (open interval)
 * @property {number} [ciLevel]
 * @property {string} [ciMethod]
 * @property {number|null} [se]
 * @property {string} [reasonKey]
 */

/**
 * @typedef {Object} TestResult
 * @property {string} id
 * @property {{name: string, value: number|null}} statistic
 * @property {number|null} [df]
 * @property {number|[number, number]|null} [dfPair]
 * @property {number|null} p               never rounded; null when withheld (G1) or undefined
 * @property {'two.sided'|'less'|'greater'} alternative
 * @property {string} variant             e.g. 'pearsonX2', 'yates', 'exact', 'normal-cc'
 * @property {string} [reasonKey]
 */

/**
 * @typedef {Object} GuardFinding
 * @property {string} id                  'G1'..'G26' (methods.md section 4)
 * @property {'stop'|'warn'|'note'} severity
 * @property {string} key                 i18n key of the message
 * @property {Object} [params]
 * @property {string[]} [routes]          for stops: the valid alternatives the UI offers
 */

/**
 * @typedef {Object} ResultEnvelope
 * @property {1} envelopeVersion
 * @property {'ok'|'stopped'|'invalid'} status
 * @property {{id: string, family: string, milestone: 'M1'|'M2'|'M3'|'later'}} method
 * @property {AnalysisSpec} spec          normalised copy
 * @property {Object<string, Value>} values
 * @property {TestResult[]} tests
 * @property {{id: string, columns: string[], rows: (string|number|null)[][]}[]} tables
 * @property {{stops: GuardFinding[], warnings: GuardFinding[], notes: GuardFinding[]}} guard
 * @property {Provenance} provenance
 * @property {boolean} verified           true only when the catalogue marks this method and option set verified
 */

/**
 * @typedef {Object} Provenance
 * @property {string} methodId
 * @property {Object} options
 * @property {string} engineVersion       ENGINE_VERSION from protocol.js
 * @property {'A'} engineTier
 * @property {number} rowsUsed
 * @property {{reason: 'missing'|'excluded'|'filter'|'invalid'|'aggregated', column: string|null, count: number}[]} rowsDropped
 * @property {string|null} dataFingerprint
 * @property {number|null} recipeRev
 * @property {string} computedAt          ISO 8601 UTC
 * @property {string[]} validatedAgainst  fixture family ids from verified.generated.js
 */

export {};
