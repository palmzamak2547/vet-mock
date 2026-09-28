// Measurement quality: ROC curves with DeLong intervals, Bland-Altman agreement and Cronbach's alpha [M2-DESIGN.md 10.2]. The analysis screen with the methods listed under the student's question
// (AnalysisPane with pane 'measure'): design first, columns for each role, options with a plain sentence each,
// the farm stop before any result, the result with its charts. OWNER: ui-analysis role.
import AnalysisPane from './AnalysisPane.jsx';

/** @param {{ p: any }} props */
export default function Pane({ p }) {
  return <AnalysisPane key="measure" p={p} pane="measure" />;
}
