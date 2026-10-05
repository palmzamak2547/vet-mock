// Loads one project for the workspace: the project record, its dataset (raw table, codebook,
// recipe), the working table the engine builds from them, the saved analyses and the project log.
// Every change goes through the store (compare-and-set on rev) and is logged; the raw table is never
// edited [M1-DESIGN.md 8.4, 9.2, 9.3]. OWNER: ui-tools role (M2; workspace in M1).
//
// M2 [M2-DESIGN.md 4.1, 4.6]: a project may hold more than one dataset. The first is the one the student
// analyses; the others came in through Import with a purpose ('merge': a farm file to bring columns
// from; 'double-entry': a second typing of the same forms). A merge step names its source dataset, so
// the working table is built with `sources` (each source's raw table, codebook and recipe) and the
// fingerprint covers the merged rows.
import { useCallback, useEffect, useRef, useState } from 'react';
import { getProject, saveProject } from '../../lib/store/projects.js';
import { getDataset, putDataset, saveCodebook, saveRecipe } from '../../lib/store/datasets.js';
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
 * @property {{ meta: any, raw: any }[]} others   the project's other datasets (merge sources, second typings)
 */

/** Dataset ids the steps read from (merge steps name their source). */
export function sourceIds(steps) {
  const out = [];
  for (const s of steps || []) {
    const id = s?.kind === 'merge' ? s.params?.sourceDatasetId : null;
    if (id && !out.includes(id)) out.push(id);
  }
  return out;
}

/**
 * The `sources` argument of the engine's apply: every dataset a merge step names, with its own raw
 * table, codebook and recipe [M2-DESIGN.md 4].
 * @param {any[]} steps
 * @param {{ meta: any, raw: any }[]} others
 */
export function sourcesFor(steps, others) {
  const out = {};
  for (const id of sourceIds(steps)) {
    const o = (others || []).find((x) => x.meta?.id === id);
    if (o) out[id] = { raw: o.raw, codebook: o.meta.codebook, steps: o.meta.steps || [] };
  }
  return out;
}

/** @param {string} projectId */
export function useProject(projectId) {
  const { db, owner, engine, engineError, notify, bumpProjects } = useWs();
  const [state, setState] = useState(/** @type {ProjectState} */ ({ status: 'loading', project: null, meta: null, raw: null, table: null, analyses: [], log: [], error: null, busy: false, others: [] }));
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const set = useCallback((patch) => { if (alive.current) setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })); }, []);

  const applyTable = useCallback(async (raw, meta, others = []) => {
    if (!raw || !meta || !engine) return null;
    const steps = meta.steps || [];
    return engine.apply(raw, meta.codebook, steps, sourcesFor(steps, others));
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
      const others = [];
      if (datasetId) {
        const ds = await getDataset(db, owner, datasetId);
        if (ds) {
          // The working table needs the engine; until it has started, the project stays "loading"
          // (this effect runs again when the engine arrives) so no pane sees data without its table.
          if (!engine) { if (engineError) set({ status: 'error', error: engineError }); return; }
          meta = ds.meta;
          raw = ds.raw;
          for (const id of (project.datasetIds || []).slice(1)) {
            const o = await getDataset(db, owner, id);
            if (o) others.push({ meta: o.meta, raw: o.raw });
          }
          table = await applyTable(raw, meta, others);
        }
      }
      const [analyses, log] = await Promise.all([listAnalyses(db, owner, project.id), listLog(db, owner, project.id)]);
      set({ status: 'ready', project, meta, raw, table, analyses: analyses || [], log: log || [], error: null, others });
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
    const table = await applyTable(raw, nextMeta, state.others);
    // Dataset writes also advance the project's revision; the next design/rename must use it.
    const project = await getProject(db, owner, projectId);
    set({ project, meta: nextMeta, raw, table });
    return table;
  }, [db, owner, projectId, state.meta, state.raw, state.others, applyTable, set]);

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
    // One entry or a list (a reshape or an aggregate step creates several columns at once).
    const entries = [].concat(entry || []);
    set({ busy: true });
    try {
      await saveRecipe(db, owner, state.meta.id, steps, state.meta.rev);
      const ds = await getDataset(db, owner, state.meta.id);
      const cb = ds.meta.codebook;
      const keys = new Set(entries.map((e) => e.key));
      const codebook = { ...cb, columns: [...cb.columns.filter((c) => !keys.has(c.key)), ...entries] };
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

  /**
   * The working table a list of steps would give, without saving anything (tool previews). Sources
   * for merge steps come from the project's other datasets.
   * @param {any[]} steps
   */
  const previewSteps = useCallback(async (steps) => {
    if (!state.raw || !state.meta || !engine) return null;
    return engine.apply(state.raw, state.meta.codebook, steps, sourcesFor(steps, state.others));
  }, [engine, state.raw, state.meta, state.others]);

  /** The working table of one of the other datasets, after its own recipe. */
  const otherTable = useCallback(async (datasetId) => {
    const o = state.others.find((x) => x.meta?.id === datasetId);
    if (!o || !engine) return null;
    return engine.apply(o.raw, o.meta.codebook, o.meta.steps || []);
  }, [engine, state.others]);

  /**
   * A second file for this project (a farm file to merge, a second typing to compare): stored like the
   * first, with its purpose, and never analysed on its own.
   * @param {{ raw: any, codebook: any, importStep: any }} preview   the confirmed import preview
   * @param {'merge'|'double-entry'} purpose
   * @returns {Promise<any|null>} the new dataset's meta
   */
  const addDataset = useCallback(async (preview, purpose) => {
    if (!state.project) return null;
    set({ busy: true });
    try {
      const meta = await putDataset(db, owner, state.project.id, { raw: preview.raw, codebook: preview.codebook, steps: [preview.importStep], purpose }, { purpose });
      bumpProjects();
      await load();
      set({ busy: false });
      return meta;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      set({ busy: false });
      return null;
    }
  }, [db, owner, state.project, bumpProjects, load, notify, set]);

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
    // Shown at once: the radio is controlled by project.design, so waiting for the store left it unchecked
    // for a moment after the click (a failed save reloads the stored project below).
    set({ project: { ...state.project, design } });
    try {
      const saved = await saveProject(db, owner, { ...state.project, design }, state.project.rev);
      set({ project: saved || { ...state.project, design } });
      bumpProjects();
      return true;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      await load();
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
      const [analyses, entries] = await Promise.all([listAnalyses(db, owner, projectId), listLog(db, owner, projectId)]);
      set({ analyses: analyses || [], log: entries || [] });
      notify('ws.snapshot.saved', {}, 'ok');
      return analysis.id;
    } catch (err) {
      notify(errorInfo(err).key, {}, 'error');
      return null;
    }
  }, [db, owner, projectId, state.table, notify, set]);

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
  return { ...state, entries: state.log, codebook, reload: load, log, commitSteps, commitStepsWithColumn, commitCodebook, setDesign, rename, saveSnapshot, removeSnapshot, previewSteps, otherTable, addDataset };
}
