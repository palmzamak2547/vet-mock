// The frame of the public pages (/methods, /guide, /cite) [M2-DESIGN.md 11]: a skip link, the wordmark
// back to the front door, links between the three pages, the ไทย/EN switch and the way into the
// workspace (its code starts downloading when the link is pressed or focused, never on page load).
// Uses only the common and trust dictionaries, so this lazy root never pulls the workspace's top bar,
// account menu or sign-in client. OWNER: trust role.
import { useT } from '../i18n/index.js';
import { linkHandler } from '../router.js';
// The same preload as src/preload.js, written here so the landing's first load keeps preload.js inside its
// own chunk (a module two lazy roots share becomes a chunk of its own and one more request on the front door).
let preloading = false;
function preloadWorkspace() {
  if (preloading) return;
  preloading = true;
  import('../workspace/Workspace.jsx').catch(() => { preloading = false; });
}

const PAGES = [
  ['methods', '/methods', 'trust.nav.methods'],
  ['guide', '/guide', 'trust.nav.guide'],
  ['cite', '/cite', 'trust.nav.cite'],
];

function Lang() {
  const { lang, setLang, t } = useT();
  return (
    <div className="rs-seg" role="group" aria-label={t('common.lang.group')}>
      <button type="button" className="rs-seg-btn" aria-pressed={lang === 'th'} onClick={() => setLang('th')} lang="th">{t('common.lang.th')}</button>
      <button type="button" className="rs-seg-btn" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">{t('common.lang.en')}</button>
    </div>
  );
}

/** @param {{ current: 'methods'|'guide'|'cite', children: any }} props */
export default function PublicShell({ current, children }) {
  const { t } = useT();
  return (
    <div className="rs-ws rs-pub">
      <header className="rs-top rs-pub-top">
        <a className="rs-skip" href="#rs-main">{t('trust.skip')}</a>
        <a href="/" className="rs-wordmark" aria-label={t('trust.nav.homeLabel')} onClick={linkHandler('/')}>
          <span className="rs-wordmark-a">{t('common.wordmark.a')}</span>
          <span className="rs-wordmark-b">{t('common.wordmark.b')}</span>
        </a>
        <span className="rs-grow" />
        <Lang />
        <a
          className="rs-btn rs-btn--primary rs-btn--sm rs-pub-open"
          href="/app"
          onClick={linkHandler('/app')}
          onPointerDown={preloadWorkspace}
          onFocus={preloadWorkspace}
          aria-label={t('trust.nav.open')}
        >
          <span className="rs-pub-open-long">{t('trust.nav.open')}</span>
          <span className="rs-pub-open-short" aria-hidden="true">{t('trust.nav.openShort')}</span>
        </a>
      </header>
      <nav className="rs-pub-nav" aria-label={t('trust.nav.label')}>
        {PAGES.map(([id, path, key]) => (
          <a key={id} href={path} className="rs-pub-navlink" aria-current={id === current ? 'page' : undefined} onClick={linkHandler(path)}>
            {t(key)}
          </a>
        ))}
      </nav>
      {children}
    </div>
  );
}
