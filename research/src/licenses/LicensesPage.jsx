// The /licenses page (M1-DESIGN.md A10): every third-party package the browser downloads, its version
// and licence, and the licence texts themselves (Apache-2.0 asks for the notice to travel with the
// code). Rendered by the workspace route as a lazy chunk. OWNER: runtime role.
import { useEffect, useState } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import runtimeDict from '../i18n/runtime.js';
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
  if (failed) return <p className="rs-licenses-note">{t('runtime.licenses.textFailed')}</p>;
  if (text === null) return <p className="rs-licenses-note" role="status">{t('runtime.licenses.loading')}</p>;
  return <pre className="rs-licenses-text" tabIndex={0}>{text}</pre>;
}

export default function LicensesPage() {
  const { t } = useT();
  const all = [...NOTICES, ...FONT_NOTICES];
  const groups = [...new Set(all.map((n) => n.text))];
  useEffect(() => {
    document.title = t('runtime.licenses.docTitle');
  }, [t]);
  return (
    <main className="rs-licenses" id="main">
      <h1>{t('runtime.licenses.title')}</h1>
      <p>{t('runtime.licenses.intro')}</p>
      <div className="rs-licenses-tablewrap">
        <table className="rs-licenses-table">
          <caption>{t('runtime.licenses.caption')}</caption>
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
                <td className="rs-num">{n.version}</td>
                <td>{n.license}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{t('runtime.licenses.stdlib', { total: STDLIB_TOTAL, bsl: STDLIB_BSL })}</p>
      <h2>{t('runtime.licenses.textsTitle')}</h2>
      {groups.map((g) => (
        <details key={g} className="rs-licenses-group">
          <summary>{all.filter((n) => n.text === g).map((n) => n.name).join(', ')}</summary>
          <LicenseText id={g} />
        </details>
      ))}
      <p><a href="/">{t('runtime.licenses.back')}</a></p>
    </main>
  );
}
