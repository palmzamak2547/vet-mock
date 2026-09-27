// Loads one project for the workspace: the project record, its dataset (raw table, codebook,
// recipe), the working table the engine builds from them, the saved analyses and the project log.
// Every change goes through the store (compare-and-set on rev) and is logged; the raw table is never
// edited [M1-DESIGN.md 8.4, 9.2, 9.3]. OWNER: workspace role.
import { useCallback, useEffect, useRef, useState } from 'react';
import { getProject, saveProject } from '../../lib/store/projects.js';
import { getDataset, saveCodebook, saveRecipe } from '../../lib/store/datasets.js';
import { listAnalyses, putAnalysis, deleteAnalysis } from '../../lib/store/analyses.js';
import { appendLog, listLog } from '../../lib/store/log.js';
import { writePrefs } from '../../lib/store/prefs.js';
import { useWs, errorInfo, newId } from '../ws-context.js';

/**
 * @typedef {Object} ProjectState
 * @property {'loading'|'missing'|'ready'|'error'} status
 * @property {any} project
 * @property {any} meta          dataset meta (codebook, steps, rev) or null when nothing is imported yet
 * @property {any} raw
 * @property {any} table         WorkingTable or null
 * @property {any[]} analyses
 * @property {any[]} log   the project log entries (the returned object exposes them as `entries`; `log` there is the append function)
 * @property {{ key: string, detail: string } | null} error
 * @property {boolean} busy
 * @property {any} [codebook]    effective codebook after the recipe (table.codebook), else the stored one
 */

/** @param {string} projectId */
export function useProject(projectId) {
  const { db, owner, engine, engineError, notify, bumpProjects } = useWs();
  const [state, setState] = useState(/** @type {ProjectState} */ ({ status: 'loading', project: null, meta: null, raw: null, table: null, analyses: [], log: [], error: null, busy: false }));
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const set = useCallback((patch) => { if (alive.current) setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })); }, []);

  const applyTable = useCallback(async (raw, meta) => {
    if (!raw || !meta || !engine) return null;
    return engine.apply(raw, meta.codebook, meta.steps || []);
  }, [engine]);

  const load = useCallback(async () => {
    if (!db) return;
    try {
      const project = await getProject(db, owner, projectId);
      if (!project) { set({ status: 'missing', project: null }); return; }
      writePrefs({ lastProjectId: project.id, lastProjectOwner: owner });
      const datasetId = project.datasetIds?.[0] || null;
      let meta = null;
      let raw = null;
      let table = null;
      if (datasetId) {
        const ds = await getDataset(db, owner, datasetId);
        if (ds) {
          // The working table needs the engine; until it has started, the project stays "loading"
          // (this effect runs again when the engine arrives) so no pane sees data without its table.
          if (!engine) { if (engineError) set({ status: 'error', error: engineError }); return; }
          meta = ds.meta;
          raw = ds.raw;
          table = await applyTable(raw, meta);
        }
      }
      const [analyses, log] = await Promise.all([listAnalyses(db, owner, project.id), listLog(db, owner, project.id)]);
      set({ status: 'ready', project, meta, raw, table, analyses: analyses || [], log: log || [], error: null });
    } catch (err) {
      set({ status: 'error', error: errorInfo(err) });
    }
  }, [db, owner, projectId, engine, engineError, applyTable, set]);

  useEffect(() => { load(); }, [load]);

  const log = useCallback(async (kind, detail) => {
    try {
      await appendLog(db, owner, projectId, { kind, detail, egress: 'none' });
      const entries = await listLog(db, owner, projectId);
      set({ log: entries || [] });
    } catch {
      /* the log is best effort for the screen; the store reports its own failures */
    }
  }, [db, owner, projectId, set]);

  const refreshDataset = useCallback(async (meta) => {
    const datasetId = meta?.id || state.meta?.id;
    const ds = await getDataset(db, owner, datasetId);
    const nextMeta = ds?.meta || meta;
    const raw = ds?.raw || state.raw;
    const table = await applyTable(raw, nextMeta);
    set({ meta: nextMeta, raw, table });
    return table;
  }, [db, owner, state.meta, state.raw, applyTable, set]);

  /** Replace the recipe (append a step, or remove the last one for undo). */
  const commitSteps = useCallback(async (steps, logDetail) => {
    if (!state.meta) return false;
    set({ busy: true });
    try {
      const saved = await saveRecipe(db, owner, state.meta.id, steps, state.meta.rev);
      await refreshDataset(saved && typeof saved === 'object' && saved.rev ? saved : null);
      await log('recipe', logDetail || { steps: steps.length });
      set({ busy: false });
      return true;
    } catch (err) {
      const info = errorInfo(err);
      notify(info.key, {}, 'error');
      if (err?.code === 'conflict') await load();
      set({ busy: false });
      return false;
    }
  }, [db, owner, state.meta, refreshDataset, log, notify, load, set]);

  /**
   * A step that creates a derived column also adds that column to the codebook: the recipe is saved
   * first, then the codebook against the dataset's new revision.
   */
  const commitStepsWithColumn = useCallback(async (steps, entry, logDetail) => {
    if (!state.meta) return false;
    set({ busy: true });
    try {
      await saveRecipe(db, owner, state.meta.id, steps, state.meta.rev);
      const ds = await getDataset(db, owner, state.meta.id);
      const cb = ds.meta.codebook;
      const codebook = { ...cb, columns: [...cb.columns.filter((c) => c.key !== entry.key), entry] };
      await saveCodebook(db, owner, state.meta.id, codebook, ds.meta.rev);
      await refreshDataset(null);
      await log('recipe', logDetail || { steps: steps.length });
      set({ busy: false });
      return true;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      await load();
      set({ busy: false });
      return false;
    }
  }, [db, owner, state.meta, refreshDataset, log, notify, load, set]);

  const commitCodebook = useCallback(async (codebook) => {
    if (!state.meta) return false;
    set({ busy: true });
    try {
      const saved = await saveCodebook(db, owner, state.meta.id, codebook, state.meta.rev);
      await refreshDataset(saved && typeof saved === 'object' && saved.rev ? saved : null);
      await log('recipe', { codebook: true });
      set({ busy: false });
      notify('ws.codebook.saved', {}, 'ok');
      return true;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      if (err?.code === 'conflict') await load();
      set({ busy: false });
      return false;
    }
  }, [db, owner, state.meta, refreshDataset, log, notify, load, set]);

  const setDesign = useCallback(async (design) => {
    if (!state.project) return false;
    try {
      const saved = await saveProject(db, owner, { ...state.project, design }, state.project.rev);
      set({ project: saved || { ...state.project, design } });
      bumpProjects();
      return true;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      if (err?.code === 'conflict') await load();
      return false;
    }
  }, [db, owner, state.project, notify, load, bumpProjects, set]);

  const rename = useCallback(async (name) => {
    if (!state.project || !name.trim()) return false;
    try {
      const saved = await saveProject(db, owner, { ...state.project, name: name.trim() }, state.project.rev);
      set({ project: saved || { ...state.project, name: name.trim() } });
      bumpProjects();
      return true;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      return false;
    }
  }, [db, owner, state.project, notify, bumpProjects, set]);

  /** Keep a result: a frozen snapshot with the fingerprint of the data it was computed on. */
  const saveSnapshot = useCallback(async (spec, envelope) => {
    try {
      const analysis = {
        id: newId(),
        projectId,
        spec,
        envelope,
        frozen: true,
        dataFingerprint: envelope?.provenance?.dataFingerprint ?? state.table?.fingerprint ?? null,
        createdAt: new Date().toISOString(),
      };
      await putAnalysis(db, owner, analysis);
      await log('freeze', { analysisId: analysis.id, method: spec.method });
      const analyses = await listAnalyses(db, owner, projectId);
      set({ analyses: analyses || [] });
      notify('ws.snapshot.saved', {}, 'ok');
      return analysis.id;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      return null;
    }
  }, [db, owner, projectId, state.table, log, notify, set]);

  const removeSnapshot = useCallback(async (id) => {
    try {
      await deleteAnalysis(db, owner, id);
      await log('delete', { analysisId: id });
      const analyses = await listAnalyses(db, owner, projectId);
      set({ analyses: analyses || [] });
      return true;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      return false;
    }
  }, [db, owner, projectId, log, notify, set]);

  // The effective codebook after the recipe (types set by steps, merged levels, derived columns) is
  // what analyses read; the stored one (meta.codebook) is what the codebook screen edits.
  const codebook = state.table?.codebook || state.meta?.codebook || null;
  return { ...state, entries: state.log, codebook, reload: load, log, commitSteps, commitStepsWithColumn, commitCodebook, setDesign, rename, saveSnapshot, removeSnapshot };
}
