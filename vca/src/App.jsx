// Route shell. Every page is its own lazy chunk, fetched in the background once the first page
// is up, so a page change never waits on the network; Home is in the entry so the front door
// paints without a second request. A running set (/session) takes the whole screen. The
// community's pages (online/) load only when visited: practice never pays for them.

import { Suspense, lazy, useEffect, useLayoutEffect, useRef } from 'react';
import { useRoute } from './router.js';
import { TopBar, TabBar, Footer } from './components/Shell.jsx';
import { Home } from './pages/Home.jsx';
import { AccountSheets, startAccount } from './online/index.js';
import { initMotion, pageReady } from './lib/motion.js';

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

/** Tells a waiting view transition that the new page is on screen. */
function Mounted({ path, children }) {
  useLayoutEffect(() => { pageReady(); }, [path]);
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
    // Fetch the other pages while the reader looks at this one.
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
    idle(() => { for (const load of Object.values(LOADERS)) load().catch(() => {}); });
  }, []);

  // A new page starts at its top with focus on its heading, as a page load would, except on
  // the first paint, where the browser's own position and focus stand.
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    window.scrollTo(0, 0);
    const t = requestAnimationFrame(() => {
      const h = document.querySelector('main h1');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    });
    return () => cancelAnimationFrame(t);
  }, [path]);

  const Page = route.name === 'home' ? Home : PAGES[route.name] || PAGES.notFound;
  const focus = route.name === 'session';
  // A conversation on a phone is a screen of its own: the tab bar and footer step aside.
  const room = route.name === 'chat' && !!route.params.room;
  return (
    <div className={`app${focus ? ' app-focus' : ''}${room ? ' app-room' : ''}`}>
      <a className="skip" href="#main">ข้ามไปเนื้อหา</a>
      <div className="atmos" aria-hidden="true"><span className="atmos-a" /><span className="atmos-b" /></div>
      {!focus && <TopBar route={route} />}
      <main id="main" className="main">
        <Suspense fallback={<Loading />}>
          <Mounted path={path}>
            <div className="page" key={path}><Page route={route} /></div>
          </Mounted>
        </Suspense>
      </main>
      {!focus && <Footer />}
      {!focus && <TabBar route={route} />}
      <AccountSheets />
    </div>
  );
}
