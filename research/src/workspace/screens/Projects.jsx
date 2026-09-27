// Projects [workspace board "Main"]: every project on this device for this owner, a nudge to download
// a backup when none was made, a drop zone that starts a project from a data file, opening a project
// file (.vmresearch.json), the course sample-size tool, and what "this device" means. OWNER: workspace role.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '../../i18n/index.js';
import { createProject, deleteProject, listProjects } from '../../lib/store/projects.js';
import { exportProjectFile, importProjectFile, parseProjectFile } from '../../lib/store/project-file.js';
import { listAnalyses } from '../../lib/store/analyses.js';
import { storageHealth } from '../../lib/store/health.js';
import { download } from '../../lib/runtime/export.js';
import { navigate } from '../../router.js';
import { DESIGNS } from '../../lib/epi/design.js';
import { useWs, errorInfo } from '../ws-context.js';
import { formatMoment } from '../lib/era.js';
import { nameFromFile, projectFileName } from '../lib/files.js';
import { setPendingFile } from './pending-file.js';
import { Busy, Chip, ErrorBox, Notice, PageHead, formatBytes } from '../components/Bits.jsx';
import Dialog from '../components/Dialog.jsx';
import Icon from '../components/Icon.jsx';
import Link from '../components/Link.jsx';
import Welcome from '../../entrance/Welcome.jsx';

const DATA_ACCEPT = '.csv,.tsv,.txt,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';

export default function Projects({ version }) {
  const { t, lang } = useT();
  const { db, owner, notify, bumpProjects } = useWs();
  const [projects, setProjects] = useState(null);
  const [counts, setCounts] = useState({});
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);
  const [drag, setDrag] = useState(false);
  const [newName, setNewName] = useState('');
  const [importing, setImporting] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const fileInput = useRef(null);
  const projectInput = useRef(null);

  const load = useCallback(async () => {
    if (!db) return;
    try {
      const list = await listProjects(db, owner);
      setProjects(list || []);
      setError(null);
      const c = {};
      await Promise.all((list || []).map(async (p) => {
        try { c[p.id] = (await listAnalyses(db, owner, p.id))?.length || 0; } catch { c[p.id] = 0; }
      }));
      setCounts(c);
    } catch (err) {
      setError(errorInfo(err));
    }
  }, [db, owner]);

  useEffect(() => { load(); }, [load, version]);
  useEffect(() => { storageHealth({ mode: db?.mode === 'memory' ? 'memory' : 'idb' }).then(setHealth).catch(() => setHealth(null)); }, [db]);

  const startFromFile = async (file) => {
    if (!file) return;
    try {
      const project = await createProject(db, owner, { name: nameFromFile(file.name) });
      setPendingFile(project.id, file);
      bumpProjects();
      navigate(`/app/p/${project.id}/import`);
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    }
  };

  const startEmpty = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const project = await createProject(db, owner, { name: newName.trim() });
      setNewName('');
      bumpProjects();
      navigate(`/app/p/${project.id}/import`);
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer?.files?.[0];
    if (f && /\.vmresearch\.json$/i.test(f.name)) openProjectFile(f);
    else startFromFile(f);
  };

  const openProjectFile = async (file) => {
    if (!file) return;
    try {
      const parsed = await parseProjectFile(file);
      if (!parsed.ok) { notify(parsed.key, {}, 'error'); return; }
      setImporting(parsed);
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    }
  };

  const confirmImport = async () => {
    try {
      const project = await importProjectFile(db, owner, importing.data);
      setImporting(null);
      notify('ws.projects.imported', {}, 'ok');
      bumpProjects();
      if (project?.id) navigate(`/app/p/${project.id}`);
      else load();
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    }
  };

  const downloadProject = async (p) => {
    try {
      // exportProjectFile records lastExportAt and the 'download' log entry itself.
      const blob = await exportProjectFile(db, owner, p.id);
      download(blob, blob.name || projectFileName(p.name));
      notify('ws.projects.downloaded', {}, 'ok');
      load();
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    }
  };

  const doDelete = async () => {
    try {
      await deleteProject(db, owner, toDelete.id);
      setToDelete(null);
      notify('ws.projects.deleted', {}, 'ok');
      bumpProjects();
      load();
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
    }
  };

  // No project yet on this device: the designed first screen (entrance/Welcome.jsx) with one large
  // drop zone, which is also where the entrance's dots settle. Naming an empty project and opening a
  // project file stay one step below it.
  const empty = Boolean(projects && projects.length === 0 && !error);

  const newProjectForm = (
    <>
      <form className="rs-inline-form" onSubmit={startEmpty}>
        <label className="rs-field-label" htmlFor="rs-newname">{t('ws.projects.newNameLabel')}</label>
        <div className="rs-row">
          <input id="rs-newname" className="rs-input rs-grow" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t('ws.projects.newNamePlaceholder')} maxLength={120} />
          <button type="submit" className="rs-btn" disabled={!newName.trim()}>
            <Icon name="plus" size={18} />
            {t('ws.projects.create')}
          </button>
        </div>
      </form>
      <button type="button" className="rs-btn rs-btn--quiet" onClick={() => projectInput.current?.click()}>
        <Icon name="folder" size={18} />
        {t('ws.projects.openFile')}
      </button>
    </>
  );

  return (
    <main id="rs-main" className="rs-main rs-main--projects">
      <input ref={fileInput} type="file" accept={DATA_ACCEPT} className="rs-visually-hidden" tabIndex={-1} aria-hidden="true" onChange={(e) => { startFromFile(e.target.files?.[0]); e.target.value = ''; }} />
      <input ref={projectInput} type="file" accept=".json,application/json" className="rs-visually-hidden" tabIndex={-1} aria-hidden="true" onChange={(e) => { openProjectFile(e.target.files?.[0]); e.target.value = ''; }} />
      {empty ? (
        <div className="rs-projects-welcome">
          <Welcome
            onChooseFile={() => fileInput.current?.click()}
            onDropFiles={(files) => {
              const f = files?.[0];
              if (f && /\.vmresearch\.json$/i.test(f.name)) openProjectFile(f);
              else startFromFile(f);
            }}
          />
          <section className="rs-panel rs-pad" aria-labelledby="rs-h-new">
            <h2 id="rs-h-new" className="rs-h3">{t('ws.projects.newTitle')}</h2>
            {newProjectForm}
          </section>
        </div>
      ) : (
      <div className="rs-projects">
        <section className="rs-projects-list" aria-labelledby="rs-h-projects">
          <PageHead id="rs-h-projects" title={t('ws.projects.title')} sub={t('ws.projects.sub')} />
          <ErrorBox error={error} onRetry={load} />
          {projects === null && !error ? <Busy label={t('common.loading')} /> : null}
          {(projects || []).map((p) => (
            <article key={p.id} className="rs-panel rs-projcard" aria-labelledby={`rs-p-${p.id}`}>
              <div className="rs-projcard-top">
                <h2 id={`rs-p-${p.id}`} className="rs-h2 rs-grow">
                  <Link to={`/app/p/${p.id}`} className="rs-plainlink">{p.name}</Link>
                </h2>
                <Link to={`/app/p/${p.id}`} className="rs-btn rs-btn--primary">
                  {t('ws.action.open')}
                  <Icon name="arrow" size={18} />
                </Link>
              </div>
              <div className="rs-row-wrap rs-small">
                {p.design ? <Chip>{t(DESIGNS.find((d) => d.id === p.design)?.nameKey || 'ws.projects.noDesign')}</Chip> : <Chip tone="gold">{t('ws.projects.noDesign')}</Chip>}
                <Chip icon="mark">{t('ws.projects.snapshots', { n: counts[p.id] ?? 0 })}</Chip>
                {Number.isFinite(p.sizeBytes) && p.sizeBytes > 0 ? <Chip>{formatBytes(p.sizeBytes, lang)}</Chip> : null}
                <span className="rs-soft">{t('ws.projects.updated', { date: formatMoment(p.updatedAt, lang) })}</span>
              </div>
              {p.lastExportAt ? (
                <p className="rs-soft rs-small">{t('ws.projects.lastExport', { date: formatMoment(p.lastExportAt, lang) })}</p>
              ) : (
                <Notice tone="warn" title={t('ws.projects.noBackupTitle')}>{t('ws.projects.noBackupBody')}</Notice>
              )}
              <div className="rs-row-wrap">
                <button type="button" className="rs-btn" onClick={() => downloadProject(p)}>
                  <Icon name="down" size={18} />
                  {t('ws.projects.downloadFile')}
                </button>
                <button type="button" className="rs-btn rs-btn--quiet" onClick={() => setToDelete(p)}>
                  <Icon name="trash" size={18} />
                  {t('ws.projects.delete')}
                </button>
              </div>
            </article>
          ))}
          <article className="rs-panel rs-coursecard">
            <div className="rs-grow">
              <h2 className="rs-h3">{t('ws.projects.courseTitle')}</h2>
              <p className="rs-soft">{t('ws.projects.courseBody')}</p>
            </div>
            <Chip tone="sage">{t('ws.course.chip')}</Chip>
            <Link to="/app/tools/sample-size" className="rs-btn">{t('ws.action.open')}</Link>
          </article>
        </section>
        <aside className="rs-projects-side">
          <section className="rs-panel rs-pad" aria-labelledby="rs-h-new">
            <h2 id="rs-h-new" className="rs-h2">{t('ws.projects.newTitle')}</h2>
            <div
              className={`rs-drop${drag ? ' rs-drop--on' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
            >
              <Icon name="upload" size={34} />
              <p className="rs-strong">{t('ws.projects.dropTitle')}</p>
              <p className="rs-soft rs-small">{t('ws.projects.dropFormats')}</p>
              <button type="button" className="rs-btn rs-btn--primary" onClick={() => fileInput.current?.click()}>{t('ws.projects.chooseFile')}</button>
            </div>
            <p className="rs-soft rs-small">{t('ws.projects.dropNote')}</p>
            {newProjectForm}
          </section>
          <section className="rs-panel rs-pad" aria-labelledby="rs-h-device">
            <h2 id="rs-h-device" className="rs-h3">{t('ws.projects.deviceTitle')}</h2>
            <ul className="rs-iconlist">
              <li><Icon name="lock" size={18} /><span>{t('ws.projects.deviceLocal')}</span></li>
              <li><Icon name="log" size={18} /><span>{t('ws.projects.deviceEgress')}</span></li>
              <li><Icon name="wifiOff" size={18} /><span>{t('ws.projects.deviceOffline')}</span></li>
            </ul>
            {health?.mode === 'memory' ? <Notice tone="warn" title={t('ws.projects.memoryTitle')}>{t('ws.projects.memoryBody')}</Notice> : null}
            {health?.safariEviction ? <Notice tone="warn" title={t('ws.projects.safariTitle')}>{t('ws.projects.safariBody')}</Notice> : null}
          </section>
        </aside>
      </div>
      )}

      <Dialog
        open={Boolean(importing)}
        onClose={() => setImporting(null)}
        title={t('ws.projects.importTitle')}
        footer={(
          <>
            <button type="button" className="rs-btn" onClick={() => setImporting(null)}>{t('ws.action.cancel')}</button>
            <button type="button" className="rs-btn rs-btn--primary" onClick={confirmImport} data-autofocus>{t('ws.projects.importConfirm')}</button>
          </>
        )}
      >
        {importing ? (
          <>
            <p>{t('ws.projects.importIntro')}</p>
            <dl className="rs-deflist">
              <div className="rs-defrow"><dt>{t('ws.projects.importName')}</dt><dd>{importing.preview.name}</dd></div>
              <div className="rs-defrow"><dt>{t('ws.projects.importDatasets')}</dt><dd className="rs-num">{importing.preview.datasets}</dd></div>
              <div className="rs-defrow"><dt>{t('ws.projects.importRows')}</dt><dd className="rs-num">{importing.preview.rows.toLocaleString('en-US')}</dd></div>
              <div className="rs-defrow"><dt>{t('ws.projects.importAnalyses')}</dt><dd className="rs-num">{importing.preview.analyses}</dd></div>
              {importing.preview.exportedAt ? <div className="rs-defrow"><dt>{t('ws.projects.importExported')}</dt><dd>{formatMoment(importing.preview.exportedAt, lang)}</dd></div> : null}
            </dl>
            <p className="rs-soft rs-small">{t('ws.projects.importNew')}</p>
          </>
        ) : null}
      </Dialog>

      <Dialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title={t('ws.projects.deleteTitle')}
        footer={(
          <>
            <button type="button" className="rs-btn" onClick={() => setToDelete(null)} data-autofocus>{t('ws.action.cancel')}</button>
            <button type="button" className="rs-btn rs-btn--danger" onClick={doDelete}>{t('ws.projects.deleteConfirm')}</button>
          </>
        )}
      >
        {toDelete ? <p>{t('ws.projects.deleteBody', { name: toDelete.name })}</p> : null}
      </Dialog>
    </main>
  );
}
