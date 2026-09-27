// On first sign-in in this browser, guest projects move into the account automatically, and the
// move is written to each project's log (research-m1-brief.md decision 11) [M1-DESIGN.md 9.7].
// One readwrite transaction per project: re-key projects, datasets, blocks, analyses and log from
// 'guest/...' to 'u.<id>/...'. OWNER: runtime role.
import { ownerKey, isOwner, StoreError, STORE_NAMES } from '../store/db.js';
import { appendLogInTx, logKey } from '../store/log.js';
import { readPrefs, writePrefs } from '../store/prefs.js';

/** Move one guest record under a new owner: same id, new key and owner field. */
function rekey(store, rec, owner) {
  const next = { ...rec, owner };
  if (store === 'log') next.key = logKey(owner, rec.projectId, rec.seq);
  else if (store === 'blocks') next.key = ownerKey(owner, `${rec.dataset}:${rec.col}:${rec.block}`);
  else next.key = ownerKey(owner, rec.id);
  return next;
}

/**
 * @param {import('../store/db.js').ResearchDb} db
 * @param {`u.${string}`} owner
 * @param {{ now?: Date }} [opts]
 * @returns {Promise<{ moved: number }>}
 */
export async function claimGuestProjects(db, owner, opts = {}) {
  if (!isOwner(owner) || owner === 'guest') throw new StoreError('badOwner', 'runtime.store.failed', String(owner));
  const now = opts.now || new Date();
  const guests = await db.tx(['projects'], 'readonly', (ops) => ops.byIndex('projects', 'owner', 'guest'));
  let moved = 0;
  for (const p of guests) {
    const ok = await db.tx([...STORE_NAMES], 'readwrite', async (ops) => {
      const cur = await ops.get('projects', ownerKey('guest', p.id));
      if (!cur) return false; // another tab moved it first
      if (await ops.get('projects', ownerKey(owner, p.id))) return false;
      const datasets = (await ops.byIndex('datasets', 'project', p.id)).filter((r) => r.owner === 'guest');
      const records = [['projects', cur], ...datasets.map((d) => ['datasets', d])];
      for (const d of datasets) for (const b of (await ops.byIndex('blocks', 'dataset', d.id)).filter((r) => r.owner === 'guest')) records.push(['blocks', b]);
      for (const a of (await ops.byIndex('analyses', 'project', p.id)).filter((r) => r.owner === 'guest')) records.push(['analyses', a]);
      for (const l of (await ops.byIndex('log', 'project', p.id)).filter((r) => r.owner === 'guest')) records.push(['log', l]);
      for (const [store, rec] of records) {
        await ops.put(store, rekey(store, rec, owner));
        await ops.del(store, rec.key);
      }
      await appendLogInTx(ops, owner, p.id, { kind: 'claim', detail: { previousOwner: 'guest', records: records.length, datasets: datasets.length } }, now);
      return true;
    });
    if (ok) moved += 1;
  }
  return { moved };
}

/**
 * The automatic move happens once per browser: at the first sign-in. Guest projects made after that
 * stay on the guest side until the student moves them (claimGuestProjects from a button).
 * @param {import('../store/db.js').ResearchDb} db
 * @param {`u.${string}`} owner
 * @returns {Promise<{ moved: number, first: boolean }>}
 */
export async function claimOnFirstSignIn(db, owner, opts = {}) {
  if (readPrefs().guestClaimDone) return { moved: 0, first: false };
  const res = await claimGuestProjects(db, owner, opts);
  writePrefs({ guestClaimDone: true });
  return { ...res, first: true };
}
