// Regression models for a yes-or-no outcome (logistic) and for counts (Poisson, with animal-time as the offset) [M2-DESIGN.md 10.2]. The analysis screen with the methods listed under the student's question
// (AnalysisPane with pane 'models'): design first, columns for each role, options with a plain sentence each,
// the farm stop before any result, the result with its charts. OWNER: ui-analysis role.
import AnalysisPane from './AnalysisPane.jsx';

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  return <AnalysisPane key="models" p={p} pane="models" />;
}
