// Several factors and repeated measures: two-way and repeated-measures ANOVA, Friedman, post hoc tests (Dunnett, Games-Howell, Dunn) and the diagnostics checks [M2-DESIGN.md 10.2]. The analysis screen with the methods listed under the student's question
// (AnalysisPane with pane 'lab'): design first, columns for each role, options with a plain sentence each,
// the farm stop before any result, the result with its charts. OWNER: ui-analysis role.
import AnalysisPane from './AnalysisPane.jsx';

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  return <AnalysisPane key="lab" p={p} pane="lab" />;
}
