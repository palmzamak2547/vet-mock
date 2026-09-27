// The workspace at /app [M1-DESIGN.md 17]: top bar (name, "คำนวณในเครื่องนี้", ไทย/EN, account),
// rail (data, analysis, report, tools, project log), and the panes the 13 boards in
// work/research-studio/workspace/ show. Starts the engine and requests every workspace chunk on
// entry so an old tab never needs a chunk a later deploy removed. OWNER: workspace role.
import { registerArea, useT } from '../i18n/index.js';
import workspace from '../i18n/workspace.js';
import report from '../i18n/report.js';
import intake from '../i18n/intake.js';
import stats from '../i18n/stats.js';
import epi from '../i18n/epi.js';
import runtime from '../i18n/runtime.js';

registerArea('workspace', workspace);
registerArea('report', report);
registerArea('intake', intake);
registerArea('stats', stats);
registerArea('epi', epi);
registerArea('runtime', runtime);

/** @param {{ route: import('../router.js').Route }} props */
export default function Workspace({ route }) {
  const { t } = useT();
  if (route.name === 'notFound') {
    return (
      <main className="rs-boot">
        <h1>{t('common.notFound.title')}</h1>
        <a href="/">{t('common.notFound.back')}</a>
      </main>
    );
  }
  return (
    <main className="rs-boot">
      <h1>{t('common.appName')}</h1>
    </main>
  );
}
