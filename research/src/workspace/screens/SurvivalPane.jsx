// Time until an event: Kaplan-Meier curves with the log-rank test [M2-DESIGN.md 10.2]. The analysis screen with the methods listed under the student's question
// (AnalysisPane with pane 'survival'): design first, columns for each role, options with a plain sentence each,
// the farm stop before any result, the result with its charts. OWNER: ui-analysis role.
import AnalysisPane from './AnalysisPane.jsx';

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  return <AnalysisPane key="survival" p={p} pane="survival" />;
}
