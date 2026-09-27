// Power and sample size for experiments without a data file: ANOVA, t-tests, correlation, regression, each with the farm design effect step [M2-DESIGN.md 10.3].
// OWNER: ui-tools role. STUB(m2): renders the placeholder until its owner builds the screen.
import TopBar from '../../components/TopBar.jsx';
import NotBuilt from '../../components/NotBuilt.jsx';

export default function Tool() {
  return (
    <div className="rs-ws">
      <TopBar />
      <main id="rs-main" className="rs-main rs-main--narrow">
        <NotBuilt titleKey="ws.rail.power" />
      </main>
    </div>
  );
}
