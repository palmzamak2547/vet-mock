// What the tool screens ask for each planning method (power.*, design.randomisation, design.sampling),
// in the same shape as METHOD_UI [M2-DESIGN.md 10.3]. Kept apart from method-ui.js so the ui-tools and
// ui-analysis roles never edit one file; method-ui.js spreads this table into METHOD_UI.
// OWNER: ui-tools role. Empty until the tools are built (each entry needs its words; the i18n coverage
// test enumerates METHOD_UI).

/** @type {Record<string, import('./method-ui.js').MethodUi>} */
export const TOOL_METHOD_UI = {};
