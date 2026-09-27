// A project [M1-DESIGN.md 2, 17]: top bar with the project crumb, the rail, and one pane. A project
// with no dataset opens on import; otherwise on the data grid. A deep link to a project that is not in
// this browser gets a plain sentence and the two ways to get it back, never an error. OWNER: workspace role.
import { useEffect, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { navigate } from '../../router.js';
import TopBar from '../components/TopBar.jsx';
import Rail from '../components/Rail.jsx';
import { Busy, ErrorBox } from '../components/Bits.jsx';
import Link from '../components/Link.jsx';
import { useProject } from './useProject.js';
import ImportPane from './ImportPane.jsx';
import CodebookPane from './CodebookPane.jsx';
import DataPane from './DataPane.jsx';
import DesignPane from './DesignPane.jsx';
import AnalysisPane from './AnalysisPane.jsx';
import Table1Pane from './Table1Pane.jsx';
import ReportPane from './ReportPane.jsx';
import SavedResult from './SavedResult.jsx';

export function ProjectMissing() {
  const { t } = useT();
  return (
    <main id="rs-main" className="rs-main rs-main--narrow">
      <h1 className="rs-h1" tabIndex={-1}>{t('ws.missing.title')}</h1>
      <p>{t('ws.missing.body')}</p>
      <ul className="rs-plainlist">
        <li>{t('ws.missing.wayFile')}</li>
        <li>{t('ws.missing.waySignIn')}</li>
      </ul>
      <Link to="/app" className="rs-btn rs-btn--primary">{t('ws.rail.allProjects')}</Link>
    </main>
  );
}

/** @param {{ route: import('../../router.js').Route }} props */
export default function Project({ route }) {
  const { t } = useT();
  const p = useProject(route.projectId);
  const [menu, setMenu] = useState(false);
  const hasData = Boolean(p.meta && p.table);
  const pane = route.name === 'result' ? null : route.pane || (p.status === 'ready' ? (p.meta ? 'data' : 'import') : null);

  useEffect(() => { setMenu(false); }, [route]);
  useEffect(() => {
    if (p.status === 'ready' && route.name === 'project' && !route.pane) navigate(`/app/p/${route.projectId}/${p.meta ? 'data' : 'import'}`, { replace: true });
  }, [p.status, p.meta, route]);
  useEffect(() => {
    if (p.project?.name) document.title = `${p.project.name} | ${t('common.appName')}`;
  }, [p.project?.name, t]);

  if (p.status === 'missing') {
    return (
      <div className="rs-ws">
        <TopBar />
        <ProjectMissing />
      </div>
    );
  }

  let body;
  if (p.status === 'loading') body = <Busy label={t('common.loading')} />;
  else if (p.status === 'error') body = <ErrorBox error={p.error} onRetry={p.reload} />;
  else if (route.name === 'result') body = <SavedResult p={p} analysisId={route.analysisId} />;
  else {
    switch (pane) {
      case 'import': body = <ImportPane p={p} />; break;
      case 'codebook': body = <CodebookPane p={p} />; break;
      case 'data': body = <DataPane p={p} />; break;
      case 'design': body = <DesignPane p={p} />; break;
      case 'prev': body = <AnalysisPane key="prev" p={p} pane="prev" />; break;
      case 'assoc': body = <AnalysisPane key="assoc" p={p} pane="assoc" />; break;
      case 'table1': body = <Table1Pane p={p} />; break;
      case 'report': body = <ReportPane p={p} />; break;
      default: body = <Busy label={t('common.loading')} />;
    }
  }

  return (
    <div className="rs-ws">
      <TopBar crumb={p.project?.name || null} onMenu={() => setMenu((v) => !v)} menuOpen={menu} />
      <div className="rs-ws-body">
        <Rail projectId={route.projectId} pane={pane} hasData={hasData} log={p.entries} fingerprint={p.table?.fingerprint || null} open={menu} onClose={() => setMenu(false)} />
        <main id="rs-main" className="rs-main" aria-busy={p.busy || undefined}>
          {body}
        </main>
      </div>
    </div>
  );
}
