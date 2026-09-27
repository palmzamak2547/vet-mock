// The workspace at /app [M1-DESIGN.md 17]: top bar (name, "คำนวณในเครื่องนี้", ไทย/EN, account),
// rail (data, analysis, report, tools, project log), and the panes the 13 boards in
// work/research-studio/workspace/ show. Starts the engine and requests every workspace chunk on
// entry so an old tab never needs a chunk a later deploy removed. OWNER: workspace role.
import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { registerArea, useT } from '../i18n/index.js';
import workspace from '../i18n/workspace.js';
import report from '../i18n/report.js';
import intake from '../i18n/intake.js';
import stats from '../i18n/stats.js';
import epi from '../i18n/epi.js';
import runtime from '../i18n/runtime.js';
import { useOwner } from '../lib/auth/session.js';
import { claimGuestProjects, claimOnFirstSignIn } from '../lib/auth/claim-guest.js';
import { openResearchDb } from '../lib/store/db.js';
import { listProjects } from '../lib/store/projects.js';
import { readPrefs, writePrefs } from '../lib/store/prefs.js';
import { createEngine } from '../lib/runtime/client.js';
import { WsContext, errorInfo } from './ws-context.js';
import '../styles/workspace.css';
import TopBar from './components/TopBar.jsx';
import Link from './components/Link.jsx';
import { Busy, ErrorBox, Notice } from './components/Bits.jsx';
import Icon from './components/Icon.jsx';
import Projects from './screens/Projects.jsx';
import Project from './screens/Project.jsx';
import SampleSize from './screens/SampleSize.jsx';
import Licenses from './screens/Licenses.jsx';

registerArea('workspace', workspace);
registerArea('report', report);
registerArea('intake', intake);
registerArea('stats', stats);
registerArea('epi', epi);
registerArea('runtime', runtime);

const Entrance = lazy(() => import('../entrance/Entrance.jsx'));

/** Where the entrance's dots settle: the new-user drop zone, else the project list. */
function entranceTarget() {
  const el = document.querySelector('.rs-welcome-drop') || document.querySelector('.rs-projects-list');
  return el ? el.getBoundingClientRect() : null;
}

/** Anything a screen throws ends here instead of a blank page. */
class Boundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) return <BoundaryView error={this.state.error} onReset={() => this.setState({ error: null })} />;
    return this.props.children;
  }
}

function BoundaryView({ error, onReset }) {
  const { t } = useT();
  return (
    <main id="rs-main" className="rs-main rs-main--narrow">
      <h1 className="rs-h1" tabIndex={-1}>{t('ws.crash.title')}</h1>
      <p>{t('ws.crash.body')}</p>
      <ErrorBox error={errorInfo(error)} />
      <div className="rs-row-wrap">
        <button type="button" className="rs-btn rs-btn--primary" onClick={onReset}>{t('ws.action.retry')}</button>
        <Link to="/app" className="rs-btn" onClick={onReset}>{t('ws.rail.allProjects')}</Link>
      </div>
    </main>
  );
}

function NotFound() {
  const { t } = useT();
  useEffect(() => { document.title = `${t('common.notFound.title')} | ${t('common.appName')}`; }, [t]);
  return (
    <div className="rs-ws">
      <TopBar />
      <main id="rs-main" className="rs-main rs-main--narrow">
        <h1 className="rs-h1" tabIndex={-1}>{t('common.notFound.title')}</h1>
        <p>{t('common.notFound.body')}</p>
        <div className="rs-row-wrap">
          <Link to="/app" className="rs-btn rs-btn--primary">{t('ws.rail.allProjects')}</Link>
          <a href="/" className="rs-btn">{t('common.notFound.back')}</a>
        </div>
      </main>
    </div>
  );
}

/** Short confirmations ("คัดลอกแล้ว"), read out politely, gone after a few seconds. */
function StatusLine({ items, onDismiss }) {
  const { t } = useT();
  return (
    <div className="rs-status" role="status" aria-live="polite">
      {items.map((m) => (
        <div key={m.id} className={`rs-status-item rs-status-item--${m.tone}`}>
          <Icon name={m.tone === 'error' ? 'stop' : m.tone === 'warn' ? 'alert' : 'check'} size={18} />
          <span className="rs-grow">{t(m.key, m.params)}</span>
          <button type="button" className="rs-iconbtn rs-iconbtn--sm" onClick={() => onDismiss(m.id)} aria-label={t('ws.dialog.close')}>
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Guest projects made on this device after the first sign-in: the student moves them on purpose. */
function GuestProjects({ db, owner, version, onMoved }) {
  const { t } = useT();
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let live = true;
    listProjects(db, 'guest').then((l) => { if (live) setCount(l?.length || 0); }).catch(() => {});
    return () => { live = false; };
  }, [db, version]);
  if (!count) return null;
  const move = async () => {
    setBusy(true);
    try {
      const r = await claimGuestProjects(db, owner);
      if (r?.moved) onMoved(r.moved);
      setCount(0);
    } catch {
      setBusy(false);
    }
  };
  return (
    <div className="rs-banner">
      <Notice tone="info" action={<button type="button" className="rs-btn" onClick={move} disabled={busy}>{t('runtime.auth.moveGuest')}</button>}>
        {t('ws.account.guestWaiting', { n: count })}
      </Notice>
    </div>
  );
}

function Root({ route, owner, user, authError }) {
  const { t } = useT();
  const [db, setDb] = useState(null);
  const [dbError, setDbError] = useState(null);
  const [engine, setEngine] = useState(null);
  const [engineError, setEngineError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [version, setVersion] = useState(0);
  const [entrance, setEntrance] = useState(() => !readPrefs().entranceSeen && route.name === 'projects');
  const [projectCount, setProjectCount] = useState(0);
  const firstRoute = useRef(true);

  const notify = useCallback((key, params = {}, tone = 'ok') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setMessages((m) => [...m.slice(-2), { id, key, params, tone }]);
    window.setTimeout(() => setMessages((m) => m.filter((x) => x.id !== id)), tone === 'error' ? 9000 : 5000);
  }, []);
  const bumpProjects = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let live = true;
    let handle = null;
    openResearchDb().then((d) => {
      handle = d;
      if (!live) { d.close(); return; }
      setDb(d);
      if (owner !== 'guest') {
        // Guest projects move into the account once per browser, at the first sign-in. Later guest
        // projects wait for the student's own button (GuestProjects), so a second account signing in
        // on a shared browser does not take someone else's work.
        claimOnFirstSignIn(d, owner).then((r) => { if (live && r?.moved) { notify('ws.account.claimed', { n: r.moved }, 'ok'); setVersion((v) => v + 1); } }).catch(() => {});
      }
    }).catch((err) => { if (live) setDbError(errorInfo(err)); });
    return () => { live = false; handle?.close?.(); };
  }, [owner, notify]);

  useEffect(() => {
    let live = true;
    let eng = null;
    createEngine().then((e) => {
      eng = e;
      if (live) setEngine(e); else e.dispose();
    }).catch((err) => { if (live) setEngineError(errorInfo(err)); });
    return () => { live = false; eng?.dispose?.(); };
  }, []);

  useEffect(() => {
    if (!db || !entrance) return;
    listProjects(db, owner).then((l) => setProjectCount(l?.length || 0)).catch(() => {});
  }, [db, owner, entrance]);

  useEffect(() => {
    if (route.name === 'projects') document.title = `${t('ws.projects.title')} | ${t('common.appName')}`;
    if (firstRoute.current) { firstRoute.current = false; return undefined; }
    const id = window.requestAnimationFrame(() => {
      const h = document.querySelector('#rs-main h1');
      if (h) h.focus({ preventScroll: false });
      window.scrollTo({ top: 0 });
    });
    return () => window.cancelAnimationFrame(id);
  }, [route, t]);

  const value = useMemo(() => ({ owner, user, db, engine, engineError, notify, bumpProjects }), [owner, user, db, engine, engineError, notify, bumpProjects]);

  let body;
  if (dbError) {
    body = (
      <div className="rs-ws">
        <TopBar />
        <main id="rs-main" className="rs-main rs-main--narrow"><ErrorBox error={dbError} onRetry={() => window.location.reload()} /></main>
      </div>
    );
  } else if (!db) {
    body = <div className="rs-boot"><Busy label={t('common.loading')} /></div>;
  } else if (route.name === 'projects') {
    body = (
      <div className="rs-ws">
        <TopBar />
        {db.mode === 'memory' ? <div className="rs-banner"><Notice tone="warn" title={t('ws.memory.title')}>{db.reason ? t(db.reason) : t('ws.memory.body')}</Notice></div> : null}
        {authError ? <div className="rs-banner"><Notice tone="warn" role="status">{t(authError)}</Notice></div> : null}
        {owner !== 'guest' ? <GuestProjects db={db} owner={owner} version={version} onMoved={(n) => { notify('ws.account.claimed', { n }, 'ok'); setVersion((v) => v + 1); }} /> : null}
        <Projects version={version} />
      </div>
    );
  } else if (route.name === 'sampleSize') {
    body = <SampleSize />;
  } else {
    body = <Project key={route.projectId} route={route} />;
  }

  return (
    <WsContext.Provider value={value}>
      <Boundary key={route.projectId || route.name}>{body}</Boundary>
      {entrance && db ? (
        <Suspense fallback={null}>
          <Entrance projectCount={projectCount} target={entranceTarget} onDone={() => { writePrefs({ entranceSeen: true }); setEntrance(false); }} />
        </Suspense>
      ) : null}
      <StatusLine items={messages} onDismiss={(id) => setMessages((m) => m.filter((x) => x.id !== id))} />
    </WsContext.Provider>
  );
}

function OwnerGate({ route }) {
  const { t } = useT();
  const { owner, user, ready, authError } = useOwner();
  if (!ready) return <div className="rs-boot"><Busy label={t('common.loading')} /></div>;
  return <Root key={owner} route={route} owner={owner} user={user} authError={authError} />;
}

/** @param {{ route: import('../router.js').Route }} props */
export default function Workspace({ route }) {
  if (route.name === 'notFound') return <NotFound />;
  if (route.name === 'licenses') return <Licenses />;
  return (
    <Boundary>
      <OwnerGate route={route} />
    </Boundary>
  );
}
