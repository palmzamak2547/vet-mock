// The /licenses page (M1-DESIGN.md A10): every third-party package and typeface the browser downloads,
// its version and licence, and the licence texts themselves (Apache-2.0 and the OFL ask for the notice
// to travel with the code). The one /licenses page: the workspace route renders it (through
// workspace/screens/Licenses.jsx) inside the workspace's top bar, so the language switch and the way
// back are where they are on every other page (review round 3: a second copy of this page without the
// typeface rows or the texts was the one on the route). OWNER: runtime role.
import { useEffect, useState } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import runtimeDict from '../i18n/runtime.js';
import TopBar from '../workspace/components/TopBar.jsx';
import { NOTICES, FONT_NOTICES, STDLIB_TOTAL, STDLIB_BSL, LICENSE_TEXTS } from './notices.js';

registerArea('runtime', runtimeDict);

function LicenseText({ id }) {
  const { t } = useT();
  const [text, setText] = useState(/** @type {string|null} */ (null));
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    LICENSE_TEXTS[id]?.()
      .then((m) => { if (alive) setText(m.default); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [id]);
  if (failed) return <p className="rs-licenses-note rs-soft rs-small">{t('runtime.licenses.textFailed')}</p>;
  if (text === null) return <p className="rs-licenses-note rs-soft rs-small" role="status">{t('runtime.licenses.loading')}</p>;
  // Wrapped, so a long licence line never makes the page wider than a phone.
  return <pre className="rs-licenses-text rs-mono rs-small" tabIndex={0} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{text}</pre>;
}

export default function LicensesPage() {
  const { t } = useT();
  const all = [...NOTICES, ...FONT_NOTICES];
  const groups = [...new Set(all.map((n) => n.text))];
  useEffect(() => {
    document.title = t('runtime.licenses.docTitle');
  }, [t]);
  return (
    <div className="rs-ws">
      <TopBar />
      <main className="rs-licenses rs-main rs-main--narrow" id="rs-main">
        <h1 className="rs-h1" tabIndex={-1}>{t('runtime.licenses.title')}</h1>
        <p className="rs-sub">{t('runtime.licenses.intro')}</p>
        {/* The caption sits above the scroller: inside it, a phone cut the caption off with the table. */}
        <p className="rs-table-cap" id="rs-licenses-cap">{t('runtime.licenses.caption')}</p>
        <div className="rs-licenses-tablewrap rs-tablewrap">
          <table className="rs-licenses-table rs-table" aria-labelledby="rs-licenses-cap">
            <thead>
              <tr>
                <th scope="col">{t('runtime.licenses.package')}</th>
                <th scope="col">{t('runtime.licenses.version')}</th>
                <th scope="col">{t('runtime.licenses.license')}</th>
              </tr>
            </thead>
            <tbody>
              {all.map((n) => (
                <tr key={n.name}>
                  <th scope="row"><a href={n.url} rel="noopener noreferrer" target="_blank">{n.name}</a></th>
                  <td className="rs-num rs-mono">{n.version}</td>
                  <td>{n.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rs-soft rs-small">{t('runtime.licenses.stdlib', { total: STDLIB_TOTAL, bsl: STDLIB_BSL })}</p>
        <h2 className="rs-h2">{t('runtime.licenses.textsTitle')}</h2>
        {groups.map((g) => (
          <details key={g} className="rs-licenses-group rs-foldtable">
            <summary>{all.filter((n) => n.text === g).map((n) => n.name).join(', ')}</summary>
            <LicenseText id={g} />
          </details>
        ))}
        <p><a href="/">{t('runtime.licenses.back')}</a></p>
      </main>
    </div>
  );
}
