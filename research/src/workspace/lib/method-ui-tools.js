// What the tool screens ask for each planning method (power.*, design.randomisation, design.sampling),
// in the same shape as METHOD_UI [M2-DESIGN.md 10.3]. Kept apart from method-ui.js so the ui-tools and
// ui-analysis roles never edit one file; method-ui.js spreads this table into METHOD_UI.
// OWNER: ui-tools role.
//
// pane 'plan' keeps these methods off the analysis panes (methodsForPane matches the pane name). The
// tool screens hold their own field lists and option lists with their words in i18n/tools.js
// (PowerTool.jsx POWER_METHODS, RandomiseTool.jsx, SamplingPane.jsx), so `options` here is empty and the
// workspace coverage test asks no ws.opt.* words of them; buildSpec reads `input` from this table.

/** @type {Record<string, import('./method-ui.js').MethodUi>} */
export const TOOL_METHOD_UI = {
  'power.anova': { pane: 'plan', input: 'params', roles: [], options: {} },
  'power.tTest': { pane: 'plan', input: 'params', roles: [], options: {} },
  'power.correlation': { pane: 'plan', input: 'params', roles: [], options: {} },
  'power.regression': { pane: 'plan', input: 'params', roles: [], options: {} },
  'design.randomisation': { pane: 'plan', input: 'params', roles: [], options: {} },
  'design.sampling': { pane: 'plan', input: 'dataset', roles: [{ role: 'strata', accept: ['binary', 'nominal', 'ordinal'], optional: true }], options: {} },
};
