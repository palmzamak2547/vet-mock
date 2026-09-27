// /licenses [M1-DESIGN.md A10]: every third-party package the Studio ships, its version and licence,
// from lib/../licenses/notices.js (kept equal to the lockfile by the runtime role's test). The page
// needs no project and no database. OWNER: workspace role (the notices data belongs to runtime).
import { useEffect } from 'react';
import { useT } from '../../i18n/index.js';
import { NOTICES } from '../../licenses/notices.js';
import TopBar from '../components/TopBar.jsx';
import { PageHead } from '../components/Bits.jsx';

export default function Licenses() {
  const { t } = useT();
  useEffect(() => { document.title = `${t('ws.licenses.title')} | ${t('common.appName')}`; }, [t]);
  return (
    <div className="rs-ws">
      <TopBar />
      <main id="rs-main" className="rs-main rs-main--narrow">
        <PageHead title={t('ws.licenses.title')} sub={t('ws.licenses.sub')} />
        <div className="rs-tablewrap">
          <table className="rs-table">
            <caption className="rs-visually-hidden">{t('ws.licenses.title')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('ws.licenses.package')}</th>
                <th scope="col">{t('ws.licenses.version')}</th>
                <th scope="col">{t('ws.licenses.license')}</th>
              </tr>
            </thead>
            <tbody>
              {NOTICES.map((n) => (
                <tr key={n.name}>
                  <th scope="row"><a href={n.url} rel="noopener noreferrer">{n.name}</a></th>
                  <td className="rs-mono">{n.version}</td>
                  <td>{n.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rs-soft rs-small">{t('ws.licenses.stdlibNote')}</p>
      </main>
    </div>
  );
}
