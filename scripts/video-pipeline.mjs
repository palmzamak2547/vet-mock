#!/usr/bin/env node
// The content steps for every taken video (scripts/video-media.mjs takenVideos):
//   captions   YouTube's timed text with word times (json3), when not already here
//   decks      the session's library deck: the lecturer set's, else the subject's
//              public deck whose title and first page best match the video's title
//   analyse    scripts/video-analyse.mjs (no model)
//   summarise  scripts/video-summarise.mjs, then --resume once when held
//
//   node --env-file=<.env.local> --env-file=<.r2env> --env-file=<file with DEEPSEEK_API_KEY> scripts/video-pipeline.mjs \
//     [--step=captions,decks,analyse,summarise] [--only=id,id] [--concurrency=3] [--force]
//
// The decks step reads the library behind the Chula wall through
// scripts/lib/library-read.mjs: SUPABASE_ACCESS_TOKEN for the catalog, .r2env
// for a deck's bytes. The anon key and /api/library-file answer members only.
//
// Idempotent: a step whose output exists is skipped unless --force. Writes
// data-cache/channels/pipeline-manifest.json with each video's state and the
// deck choice and its score, for review.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { takenVideos } from './video-media.mjs';
import { allLecturerSets } from '../src/data/lecturer-sets.js';
import { normalizeQuery, segmentWords } from '../src/lib/vetwiki/query-terms.js';
import { libraryCatalog, libraryFirstPages, libraryFileBytes } from './lib/library-read.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = process.env.VIDEO_DATA_DIR || 'C:/dev/vetmock-video-data';
const MANIFEST = path.join(process.env.VIDEO_CACHE_DIR || path.join(ROOT, 'data-cache'), 'channels/pipeline-manifest.json');
const MIN_WORDS = 150; // fewer spoken words than this: a silent lab clip, no summary

const exec = (cmd, args, opts = {}) => new Promise((resolve) => {
  const p = spawn(cmd, args, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '';
  p.stdout.on('data', (d) => { out += d; });
  p.stderr.on('data', (d) => { out += d; });
  p.on('close', (code) => resolve({ code, out }));
});

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; await fn(items[k], k); } }));
}

// Words a title and a deck share, Thai segmented, dates and numbers out.
const STOP = new Set(['vet86', 'and', 'the', 'of', 'in', 'to', 'for', 'with', 'part', 'lecture', 'lect', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ต่อ']);
const words = (s) => new Set(segmentWords(normalizeQuery(String(s || '').replace(/\d+/g, ' ')))
  .filter((w) => w.wordLike && w.word.trim().length >= 3).map((w) => w.word.trim()).filter((w) => !STOP.has(w)));

async function fetchDeck(slug, file) {
  fs.writeFileSync(file, await libraryFileBytes(slug));
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
  const steps = new Set((opt('step') || 'captions,decks,analyse,summarise').split(','));
  const only = new Set((opt('only') || '').split(',').filter(Boolean));
  const conc = Number(opt('concurrency')) || 3;
  const force = args.includes('--force');
  const state = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
  const save = () => fs.writeFileSync(MANIFEST, JSON.stringify(state, null, 1));
  const videos = takenVideos().filter((v) => !only.size || only.has(v.id));
  const sessionDecks = new Map();
  const sessionTopics = new Map();
  for (const set of allLecturerSets()) for (const lec of set.lecturers || []) for (const s of lec.sessions || []) {
    if (!s.videoId) continue;
    sessionDecks.set(s.videoId, [...new Set([...(sessionDecks.get(s.videoId) || []), ...(s.decks || []).map((d) => d.doc).filter(Boolean)])]);
    sessionTopics.set(s.videoId, [...new Set([...(sessionTopics.get(s.videoId) || []), ...(s.decks || []).flatMap((d) => d.topics || []), ...(s.alsoTopics || [])])]);
  }
  console.log(`${videos.length} videos; steps ${[...steps].join(', ')}`);

  if (steps.has('captions')) {
    await pool(videos, conc, async (v) => {
      const dir = path.join(DATA, v.id);
      fs.mkdirSync(dir, { recursive: true });
      if ((fs.existsSync(path.join(dir, 'video.th.json3')) || fs.existsSync(path.join(dir, 'video.scribe.json3'))) && !force) return;
      const r = await exec('yt-dlp', ['-q', '--no-warnings', '--skip-download', '--write-auto-subs', '--sub-langs', 'th', '--sub-format', 'json3', '-o', 'video.%(ext)s', `https://www.youtube.com/watch?v=${v.id}`], { cwd: dir });
      (state[v.id] ||= {}).captions = fs.existsSync(path.join(dir, 'video.th.json3')) ? 'youtube' : `none (${r.code})`;
    });
    save();
    console.log(`captions: ${videos.filter((v) => fs.existsSync(path.join(DATA, v.id, 'video.th.json3'))).length} of ${videos.length}`);
  }

  if (steps.has('decks')) {
    const catalog = await libraryCatalog();
    // Every deck's first page in a few requests, kept between runs: a deck's
    // title page does not change.
    const pageCache = path.join(path.dirname(MANIFEST), 'library-page1.json');
    const firstPage = new Map(Object.entries(fs.existsSync(pageCache) ? JSON.parse(fs.readFileSync(pageCache, 'utf8')) : {}));
    const missing = catalog.filter((d) => d.kind !== 'video' && !firstPage.has(String(d.id))).map((d) => String(d.id));
    for (let i = 0; i < missing.length; i += 150) {
      const ids = missing.slice(i, i + 150);
      const rows = await libraryFirstPages(ids);
      for (const id of ids) firstPage.set(id, '');
      for (const r of rows) firstPage.set(String(r.doc_id), r.body || '');
    }
    if (missing.length) fs.writeFileSync(pageCache, JSON.stringify(Object.fromEntries(firstPage)));
    const pageOne = async (doc) => firstPage.get(String(doc.id)) || '';
    // How many of a subject's decks use a word: a title match needs one word
    // few decks share (five letters or more), not just "examination".
    const dfBySubject = new Map();
    const subjectDf = async (subjectIds) => {
      const key = subjectIds.join(',');
      if (!dfBySubject.has(key)) {
        const df = new Map();
        for (const doc of catalog.filter((d) => subjectIds.includes(d.subject) && d.kind !== 'video')) {
          for (const w of words(`${doc.title} ${await pageOne(doc)}`)) df.set(w, (df.get(w) || 0) + 1);
        }
        dfBySubject.set(key, df);
      }
      return dfBySubject.get(key);
    };
    for (const v of videos) {
      const dir = path.join(DATA, v.id);
      const st = (state[v.id] ||= {});
      if (fs.existsSync(path.join(dir, 'deck.json')) && !force) continue;
      let chosen = (sessionDecks.get(v.id) || []).map((slug) => ({ slug, score: 1, why: 'lecturer set' }));
      // A deck a reader matched by hand (polished.json "decks", beside the clip's other
      // hand edits) where the title match misses the lecture's own: every word of
      // "Microbiology of meat" is common in its subject, so none is distinctive.
      if (!chosen.length) {
        const pf = path.join(dir, 'polished.json');
        const hand = fs.existsSync(pf) ? JSON.parse(fs.readFileSync(pf, 'utf8')).decks : null;
        chosen = (hand || []).map((slug) => ({ slug, score: 1, why: 'hand' }));
      }
      if (!chosen.length) {
        // Each part of a "1.A + 2.B" title may have its own deck.
        const parts = v.title.split(/\s(?:\+|&)\s?|\s\d+\.\s*/).map((p) => words(p)).filter((w) => w.size);
        const scored = [];
        const df = await subjectDf(v.subjects);
        for (const doc of catalog.filter((d) => v.subjects.includes(d.subject) && d.kind !== 'video')) {
          const dw = words(`${doc.title} ${await pageOne(doc)}`);
          let best = 0;
          for (const p of parts) {
            const hit = [...p].filter((w) => dw.has(w));
            const distinctive = hit.some((w) => w.length >= 5 && (df.get(w) || 0) <= 2);
            if (distinctive) best = Math.max(best, hit.length / p.size);
          }
          if (best >= 0.6) scored.push({ slug: doc.slug, score: Math.round(best * 100) / 100, why: 'title' });
        }
        chosen = scored.sort((a, b) => b.score - a.score).slice(0, Math.max(1, Math.min(3, parts.length)));
      }
      st.decks = chosen;
      delete st.deckError; // an earlier attempt's error, not this one's
      if (!chosen.length) { fs.rmSync(path.join(dir, 'deck.json'), { force: true }); save(); continue; }
      try {
        const pages = [];
        for (const d of chosen) {
          // The page text is what stays; the PDF goes once it is read.
          const part = path.join(dir, `deck-${d.slug.slice(-6)}.json`);
          if (!fs.existsSync(part)) {
            const pdf = path.join(dir, `deck-${d.slug.slice(-6)}.pdf`);
            if (!fs.existsSync(pdf)) await fetchDeck(d.slug, pdf);
            const r = await exec('python', ['-I', path.join(ROOT, 'scripts/video-deck-pages.py'), pdf, part, `--slug=${d.slug}`]);
            if (r.code) throw new Error(r.out.slice(-200));
            fs.rmSync(pdf, { force: true });
          }
          for (const p of JSON.parse(fs.readFileSync(part, 'utf8')).pages) pages.push({ ...p, page: pages.length + 1, doc: d.slug, docPage: p.page });
        }
        fs.writeFileSync(path.join(dir, 'deck.json'), JSON.stringify({ slug: chosen.map((d) => d.slug).join(','), source: { 'lecturer set': 'lecturer-set', hand: 'hand' }[chosen[0].why] || 'title', pages }));
      } catch (e) { st.deckError = String(e.message || e).slice(0, 200); }
      save();
    }
    console.log(`decks: ${videos.filter((v) => fs.existsSync(path.join(DATA, v.id, 'deck.json'))).length} of ${videos.length}`);
  }

  if (steps.has('analyse')) {
    await pool(videos, conc, async (v) => {
      const dir = path.join(DATA, v.id);
      // An analysis older than the silence measurement is redone: the skip list needs it.
      const af = path.join(dir, 'analysis.json');
      const sf = path.join(dir, 'silence.json');
      const scribe = path.join(dir, 'video.scribe.json3');
      const newer = (f) => fs.existsSync(f) && fs.existsSync(af) && fs.statSync(f).mtimeMs > fs.statSync(af).mtimeMs;
      // A Scribe transcript that arrived after the analysis is a reason to redo it, like new silence.
      const stale = newer(sf) || newer(scribe);
      if ((!fs.existsSync(path.join(dir, 'video.th.json3')) && !fs.existsSync(scribe)) || (fs.existsSync(af) && !force && !stale)) return;
      // The summary was written against this analysis: it stays beside the new one
      // until the summary is redone, and the registry pairs the chapter lines with it.
      const basis = path.join(dir, 'analysis.basis.json');
      if (fs.existsSync(af) && fs.existsSync(path.join(dir, 'summary.json')) && !fs.existsSync(basis)) fs.copyFileSync(af, basis);
      const r = await exec('node', [path.join(ROOT, 'scripts/video-analyse.mjs'), dir, `--subject=${v.subjects.join(',')}`, `--title=${v.title}`, `--duration=${v.durationSec}`, `--lecturer-topics=${(sessionTopics.get(v.id) || []).join(',')}`]);
      (state[v.id] ||= {}).analysis = r.code ? `failed: ${r.out.slice(-200)}` : r.out.trim().split('\n').pop();
    });
    save();
  }

  if (steps.has('transcripts')) {
    // The player's transcript: the analysis's caption lines, private in R2
    // beside the video (served signed-in only by /api/video-file).
    const { s3Env, putBuffer } = await import('./video-media.mjs');
    const env = await s3Env();
    await pool(videos, conc, async (v) => {
      const af = path.join(DATA, v.id, 'analysis.json');
      const st = (state[v.id] ||= {});
      // A redone analysis (a Scribe transcript arrived) replaces the one students read.
      if (!fs.existsSync(af) || (st.transcript && !force && Date.parse(st.transcript) >= fs.statSync(af).mtimeMs)) return;
      const a = JSON.parse(fs.readFileSync(af, 'utf8'));
      await putBuffer(env, `videos/${v.id}/transcript.json`, Buffer.from(JSON.stringify({ lines: a.lines })), 'application/json');
      st.transcript = new Date().toISOString();
    });
    save();
  }

  if (steps.has('summarise')) {
    // The model budget (docs/VIDEO-LIBRARY.md section 8): no new summary
    // starts once the account has spent VIDEO_AI_BUDGET_CNY since the run
    // began. The balance posts late and production shares the key, so the
    // guard errs towards stopping, and a balance it cannot read stops it.
    const budget = Number(process.env.VIDEO_AI_BUDGET_CNY || 30);
    const balance = async () => {
      const r = await fetch('https://api.deepseek.com/user/balance', { headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` }, signal: AbortSignal.timeout(10_000) });
      return Number((await r.json()).balance_infos?.find((b) => b.currency === 'CNY')?.total_balance);
    };
    const start = await balance().catch(() => NaN);
    if (!Number.isFinite(start)) throw new Error('summarise: the DeepSeek balance could not be read, so the budget cannot be kept');
    let made = 0;
    let over = false;
    await pool(videos, conc, async (v) => {
      if (over) return;
      const dir = path.join(DATA, v.id);
      const st = (state[v.id] ||= {});
      const af = path.join(dir, 'analysis.json');
      // A summary polished by hand (polished.json beside it) is never redrafted or re-anchored.
      if (fs.existsSync(path.join(dir, 'polished.json'))) return;
      if (!fs.existsSync(af) || (fs.existsSync(path.join(dir, 'summary.json')) && !force && !String(st.summary || '').startsWith('held'))) return;
      const a = JSON.parse(fs.readFileSync(af, 'utf8'));
      const spoken = a.lines.reduce((n, [, t]) => n + String(t).split(/\s+/).length, 0);
      if (spoken < MIN_WORDS) { st.summary = 'skipped: no lecture speech'; return; }
      const script = path.join(ROOT, 'scripts/video-summarise.mjs');
      // A held summary over a redone analysis is drafted afresh: its chapter lines were for the old one.
      const basis = path.join(dir, 'analysis.basis.json');
      const first = fs.existsSync(path.join(dir, 'summary.json')) && !fs.existsSync(basis) ? ['--resume'] : [];
      let r = await exec('node', [script, dir, ...first]);
      if (/^held/m.test(r.out)) r = await exec('node', [script, dir, '--resume']);
      if (!r.code) fs.rmSync(basis, { force: true });
      st.summary = r.code ? `failed: ${r.out.slice(-200)}` : (r.out.match(/^(pass|held)[^\n]*/m)?.[0] || r.out.slice(-200)).slice(0, 160);
      save();
      if (++made % 10 === 0) {
        const now = await balance().catch(() => NaN);
        console.log(`budget: ¥${(start - now).toFixed(2)} of ¥${budget} spent after ${made} summaries`);
        if (!Number.isFinite(now) || start - now > budget) { over = true; console.error(`stopped: the budget guard (¥${budget}) ended the run after ${made} summaries`); }
      }
    });
    const end = await balance().catch(() => NaN);
    console.log(`budget: ¥${(start - end).toFixed(2)} spent in this run (${made} summaries made)`);
    save();
    const s = Object.values(state);
    console.log(`summaries: pass ${s.filter((x) => String(x.summary).startsWith('pass')).length}, held ${s.filter((x) => String(x.summary).startsWith('held')).length}, skipped ${s.filter((x) => String(x.summary).startsWith('skipped')).length}, failed ${s.filter((x) => String(x.summary).startsWith('failed')).length}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });
