// The rail of the tools that need no data file (sample size, power, randomisation), so one tool reaches
// the others in one tap [M2-DESIGN.md 10.1, 10.3]. The words are the rail's own (ws.rail.*).
// OWNER: ui-tools role.
export const TOOL_RAIL = Object.freeze([
  { h: 'ws.rail.group.tools' },
  { id: 'sampleSize', label: 'ws.rail.sampleSize', icon: 'calc', href: '/app/tools/sample-size' },
  { id: 'power', label: 'ws.rail.power', icon: 'calc', href: '/app/tools/power' },
  { id: 'randomise', label: 'ws.rail.randomise', icon: 'lock', href: '/app/tools/randomise' },
]);
