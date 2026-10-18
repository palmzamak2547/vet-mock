// Route shell. Every page is its own lazy chunk, fetched in the background once the first page
// is up, so a page change never waits on the network; Home is in the entry so the front door
// paints without a second request. A running set (/session) takes the whole screen. The
// community's pages (online/) load only when visited: practice never pays for them.

import { Component, Suspense, lazy, useEffect, useLayoutEffect, useRef } from 'react';
import { navigate, useRoute } from './router.js';
import { TopBar, TabBar, Footer } from './components/Shell.jsx';
import { Home } from './pages/Home.jsx';
import { AccountSheets, prefetchSignIn, startAccount } from './online/index.js';
import { initMotion, pageReady } from './lib/motion.js';
import { isRestoring } from './lib/scroll.js';
import { useActiveSession } from './lib/hooks.js';

const LOADERS = {
  practice: () => import('./pages/Practice.jsx'),
  session: () => import('./pages/Session.jsx'),
  result: () => import('./pages/Result.jsx'),
  bank: () => import('./pages/Bank.jsx'),
  library: () => import('./pages/Library.jsx'),
  progress: () => import('./pages/Progress.jsx'),
  domain: () => import('./pages/Domain.jsx'),
  exam: () => import('./pages/Exam.jsx'),
  about: () => import('./pages/About.jsx'),
  notFound: () => import('./pages/NotFound.jsx'),
};
const ONLINE = {
  community: () => import('./online/pages/Community.jsx'),
  post: () => import('./online/pages/Post.jsx'),
  compose: () => import('./online/pages/Compose.jsx'),
  profile: () => import('./online/pages/Profile.jsx'),
  chat: () => import('./online/pages/Chat.jsx'),
  auth: () => import('./online/pages/AuthCallback.jsx'),
};
const PAGES = Object.fromEntries(Object.entries({ ...LOADERS, ...ONLINE }).map(([name, load]) => [name, lazy(load)]));

function Loading() {
  return <div className="page-loading" role="status"><span className="spinner" aria-hidden="true" />กำลังเปิด…</div>;
}

const RELOADED = 'vca:chunk-reload';

/**
 * A page that cannot load or throws while drawing. A tab left open across a deploy asks for the
 * old build's chunks, which no longer exist: one reload fetches the new build (once per session,
 * so a real outage cannot loop). Anything else shows a card with a way out, instead of a blank
 * screen with the whole app unmounted.
 */
class PageBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) {
    const stale = /dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically/i.test(String(error?.message || error));
    let tried = false;
    try { tried = sessionStorage.getItem(RELOADED) === '1'; } catch { /* storage off: no reload */ tried = true; }
    if (stale && !tried && navigator.onLine !== false) {
      try { sessionStorage.setItem(RELOADED, '1'); } catch { /* ignore */ }
      window.location.reload();
    }
  }
  componentDidUpdate(prev) { if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false }); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="wrap page-error" role="alert">
        <h1 className="page-h">เปิดหน้านี้ไม่สำเร็จ</h1>
        <p className="page-p">{navigator.onLine === false ? 'ตอนนี้ออฟไลน์อยู่ หน้านี้ยังไม่เคยเปิดในเครื่องนี้ ต่อเน็ตแล้วลองอีกครั้ง' : 'อาจมีเวอร์ชันใหม่เพิ่งขึ้น โหลดหน้าใหม่แล้วจะใช้ได้ตามปกติ'}</p>
        <div className="ctas">
          <button type="button" className="btn btn-ink" onClick={() => window.location.reload()}>โหลดหน้าใหม่</button>
          <a className="btn btn-ghost" href="/">กลับหน้าแรก</a>
        </div>
      </div>
    );
  }
}

/** Tells a waiting view transition that the new page is on screen. */
function Mounted({ path, children }) {
  useLayoutEffect(() => {
    pageReady();
    // A page drew: a later stale chunk may reload once again (cleared only after a success, so a
    // chunk that is broken in the new build too cannot reload forever).
    try { sessionStorage.removeItem(RELOADED); } catch { /* ignore */ }
  }, [path]);
  return children;
}

export function App() {
  const route = useRoute();
  const first = useRef(true);
  const path = route.name + JSON.stringify(route.params);

  useEffect(() => {
    initMotion();
    // A student signed in on an earlier visit is signed back in; nobody else loads anything.
    startAccount();
    // Fetch the other pages, and the sheet a visitor signs in with, while the reader looks at this one.
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
    idle(() => {
      for (const load of Object.values(LOADERS)) load().catch(() => {});
      prefetchSignIn();
    });
  }, []);

  // A new page starts at its top with focus on its heading, as a page load would, except on
  // the first paint, where the browser's own position and focus stand. A page reached by Back or
  // Forward is put back where the reader left it instead (lib/scroll.js), once it is tall enough.
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    if (!isRestoring()) window.scrollTo(0, 0);
    const t = requestAnimationFrame(() => {
      const h = document.querySelector('main h1');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    });
    return () => cancelAnimationFrame(t);
  }, [path]);

  // /session with no set to run (an old link, a set finished in another tab) has nothing to show,
  // and a full-screen page with no bar and no way on is a dead end: the set builder is the way on,
  // and the entry is replaced, so Back does not return to an empty page. The address is read, not
  // the route: when a set ends, the store clears a beat before the route reaches its result, and
  // the result must not be redirected from under the student. A passive effect, not a layout one:
  // on a first load it must run after useRoute's own effect has started listening, or the new
  // address is never heard and the route stays on /session.
  const session = useActiveSession();
  const noSet = route.name === 'session' && !session;
  useEffect(() => {
    if (noSet && window.location.pathname.replace(/\/+$/, '') === '/session') navigate('/practice', { replace: true });
  }, [noSet]);

  const Page = route.name === 'home' ? Home : PAGES[route.name] || PAGES.notFound;
  const focus = route.name === 'session' && !noSet;
  // A conversation on a phone is a screen of its own: the tab bar and footer step aside.
  const room = route.name === 'chat' && !!route.params.room;
  return (
    <div className={`app${focus ? ' app-focus' : ''}${room ? ' app-room' : ''}`}>
      <a className="skip" href="#main">ข้ามไปเนื้อหา</a>
      <div className="atmos" aria-hidden="true"><span className="atmos-a" /><span className="atmos-b" /></div>
      {!focus && <TopBar route={route} />}
      <main id="main" className="main">
        <PageBoundary resetKey={path}>
          <Suspense fallback={<Loading />}>
            <Mounted path={path}>
              <div className="page" key={path}>{noSet ? null : <Page route={route} />}</div>
            </Mounted>
          </Suspense>
        </PageBoundary>
      </main>
      {!focus && <Footer />}
      {!focus && <TabBar route={route} />}
      <AccountSheets />
    </div>
  );
}
