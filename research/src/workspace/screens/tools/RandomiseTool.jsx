// Randomisation lists and blinding codes from the seeded generator, downloaded as CSV with the seed and settings in the file [M2-DESIGN.md 7, 10.3].
// OWNER: ui-tools role. STUB(m2): renders the placeholder until its owner builds the screen.
import TopBar from '../../components/TopBar.jsx';
import NotBuilt from '../../components/NotBuilt.jsx';

export default function Tool() {
  return (
    <div className="rs-ws">
      <TopBar />
      <main id="rs-main" className="rs-main rs-main--narrow">
        <NotBuilt titleKey="ws.rail.randomise" />
      </main>
    </div>
  );
}
