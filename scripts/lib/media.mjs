// ============================================================
// media.mjs: every picture a question or a note can show, measured
// ============================================================
// The registry (src/data/media-registry.generated.json) and its lint are
// built here; scripts/media-registry.mjs is the command, docs/MEDIA.md the
// guide. Two kinds of picture are governed, each with its own folders:
//
//   question  a figure a question shows (image, imagePath, explainImage):
//             public/figures/questions/ and public/images/
//   slide     a figure lifted from a lecture deck, shown under a note section
//             (src/data/slide-images.generated.js): public/figures/<subject>/
//
// A file in those folders that a page of the app names in its own source
// (the landing page's screenshot) is kind `page`: recorded, never a question.
//
// Everything that reads the disk takes the public folder as an argument, so
// the tests run on a folder of their own.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

import { answerParts, textWords } from './answer-leak.mjs';

export const QUESTION_FIELDS = ['image', 'imagePath', 'explainImage'];
export const IMAGE_EXT = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif', '.svg']);

// The heaviest a question image may be. Measured on 11 Nov 2026: the 48 WebP
// figures cut from decks top out at 110 KB (1296x972) and the JPEG photographs
// at 167 KB (1424x1150). Every file over 200 KB was a PNG screenshot of a
// photograph (ten, 245 to 756 KB) or one 221 KB JPEG, and all eleven came
// under it as WebP at the same pixel size (14 to 179 KB). So a file over the
// line is one that was saved in the wrong format, not one that needs the
// bytes: `node scripts/media-to-webp.mjs <file> --write` brings it back.
export const QUESTION_IMAGE_MAX_BYTES = 200 * 1024;

// Byte-identical files of one kind that must stay two files. Each entry names
// its paths and says why. Empty on 11 Nov 2026: every repeat found was either
// a deck's template or one picture stored under several names, and all of
// them went.
//   { paths: ['/figures/…', '/figures/…'], reason: '…' }
export const SAME_BYTES_ALLOWED = [];

const GOVERNED_ROOTS = ['figures', 'images'];

/** The kind a file's folder gives it, before anything says what shows it. */
export function kindByFolder(sitePath) {
  const parts = String(sitePath).split('/');
  if (parts[1] === 'images' && parts.length > 2) return 'question';
  if (parts[1] === 'figures' && parts[2] === 'questions' && parts.length > 3) return 'question';
  if (parts[1] === 'figures' && parts.length > 3) return 'slide';
  return null;
}

/** A local path as a question or the map writes it, without query or fragment; null for anything else. */
export function localPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null;
  return value.split(/[?#]/)[0];
}

/** Every file under the governed folders: site path -> absolute path. */
export function governedFiles(publicDir) {
  const out = new Map();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) walk(abs);
      else out.set(`/${path.relative(publicDir, abs).split(path.sep).join('/')}`, abs);
    }
  };
  for (const root of GOVERNED_ROOTS) {
    const dir = path.join(publicDir, root);
    if (fs.existsSync(dir)) walk(dir);
  }
  return out;
}

/**
 * What the data says is shown: site path -> the things that show it.
 * `questions` are bank rows, `slideMap` is SLIDE_IMAGES.
 */
export function collectReferences({ questions = [], slideMap = {} }) {
  const refs = new Map();
  const problems = [];
  let inline = 0;
  const add = (p, kind, user) => {
    if (!refs.has(p)) refs.set(p, { kinds: new Set(), usedBy: [] });
    refs.get(p).kinds.add(kind);
    refs.get(p).usedBy.push(user);
  };
  for (const q of questions) {
    for (const field of QUESTION_FIELDS) {
      const value = q?.[field];
      if (value == null || value === '') continue;
      const key = `${q.subject}:${q.id}`;
      if (typeof value === 'string' && value.startsWith('data:image/')) { inline++; continue; }
      const p = localPath(value);
      if (!p) { problems.push(`${key}: ${field} is neither a path under public/ nor an inline image: ${String(value).slice(0, 80)}`); continue; }
      add(p, 'question', `question:${key}:${field}`);
    }
  }
  for (const [id, figures] of Object.entries(slideMap)) {
    const seen = new Set();
    for (const figure of figures) {
      const p = localPath(figure);
      if (!p) { problems.push(`note section ${id}: ${String(figure).slice(0, 80)} is not a path under public/`); continue; }
      if (seen.has(p)) { problems.push(`note section ${id}: lists ${p} twice`); continue; }
      seen.add(p);
      add(p, 'slide', `note:${id}`);
    }
  }
  return { refs, problems, inline };
}

/** Files of the app's own source that may name a picture: index.html and src/, bar banks and generated files. */
export function sourceFiles(root) {
  const out = [];
  const index = path.join(root, 'index.html');
  if (fs.existsSync(index)) out.push(index);
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) walk(abs);
      else if (/\.(jsx?|css|html)$/.test(e.name) && !/\.generated\./.test(e.name) && !/^questions-.*\.js$/.test(e.name)) out.push(abs);
    }
  };
  const src = path.join(root, 'src');
  if (fs.existsSync(src)) walk(src);
  return out;
}

/** For each path, the source files that name it as a literal. */
export function sourceMentions(root, paths) {
  const found = new Map(paths.map((p) => [p, []]));
  if (!paths.length) return found;
  for (const file of sourceFiles(root)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const p of paths) if (text.includes(p)) found.get(p).push(path.relative(root, file).split(path.sep).join('/'));
  }
  return found;
}

/** Width and height as a browser lays the image out, bytes and the full SHA-256. */
export async function measure(abs) {
  let bytes = fs.readFileSync(abs);
  // An SVG is text: Windows checkouts hand it back with CRLF, and the registry
  // must read the same on every machine.
  if (path.extname(abs).toLowerCase() === '.svg') bytes = Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const meta = await sharp(bytes).metadata();
  // EXIF orientations 5 to 8 turn the picture a quarter: browsers lay it out turned.
  const turned = (meta.orientation || 1) >= 5;
  const width = turned ? meta.height : meta.width;
  const height = turned ? meta.width : meta.height;
  if (!(width > 0 && height > 0)) throw new Error('no width or height');
  return { width, height, bytes: bytes.length, sha256 };
}

const byCodeUnit = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The registry: one entry per governed file and per referenced path, with what
 * each could not be given. Nothing is judged here; lintMedia does that.
 */
export async function buildRegistry({ publicDir, root, questions, slideMap, concurrency = 12 }) {
  const files = governedFiles(publicDir);
  const { refs, problems, inline } = collectReferences({ questions, slideMap });

  // A referenced file outside the governed folders is still a picture the app shows.
  for (const p of refs.keys()) {
    if (files.has(p)) continue;
    const abs = path.join(publicDir, p.slice(1));
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) files.set(p, abs);
  }
  const unreferenced = [...files.keys()].filter((p) => !refs.has(p)).sort(byCodeUnit);
  const mentions = sourceMentions(root, unreferenced);

  const paths = [...new Set([...files.keys(), ...refs.keys()])].sort(byCodeUnit);
  const entries = new Array(paths.length);
  let next = 0;
  async function worker() {
    for (;;) {
      const i = next++;
      if (i >= paths.length) return;
      const p = paths[i];
      const ref = refs.get(p);
      const named = mentions.get(p) || [];
      const entry = {
        path: p,
        kind: ref ? (ref.kinds.size === 1 ? [...ref.kinds][0] : 'mixed') : named.length ? 'page' : kindByFolder(p),
        folderKind: kindByFolder(p),
        usedBy: ref ? [...ref.usedBy].sort(byCodeUnit) : named.map((f) => `source:${f}`),
        exists: files.has(p),
        isImage: IMAGE_EXT.has(path.extname(p).toLowerCase()),
      };
      if (entry.exists && entry.isImage) {
        try { Object.assign(entry, await measure(files.get(p))); } catch (error) { entry.unreadable = error.message; }
      }
      entries[i] = entry;
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, paths.length) }, worker));
  return { entries, problems, inline };
}

/**
 * A question figure's file name must not carry a word of the key that the
 * stem and the other options do not: /images/repro-us/q7-estrus.png sat above
 * "…บ่งชี้ระยะใด" with the key "Estrus stage", and an image's address is one
 * long press away. Seven names did on 11 Nov 2026; none does now.
 * Returns the words, or [].
 */
export function nameLeak(question, sitePath) {
  const parts = answerParts(question);
  if (!parts || parts.kind === 'statement') return [];
  const segments = String(sitePath).toLowerCase().split('/');
  const name = (segments.pop() || '').replace(/\.[a-z0-9]+$/, '');
  const tokens = `${segments.pop() || ''} ${name}`.split(/[^a-z0-9]+/).filter(Boolean);
  if (!tokens.length) return [];
  const seen = textWords(parts.seen, { sourceWordsCount: true }).words;
  const rival = new Set(parts.rivals.flatMap((r) => [...textWords(r, { sourceWordsCount: true }).words]));
  const hits = new Set();
  for (const key of parts.key) {
    const kw = textWords(key, { sourceWordsCount: true });
    for (const w of kw.words) {
      if (!/^[a-z0-9]+$/.test(w) || seen.has(w) || rival.has(w)) continue;
      // A long word counts inside a run-together name ("bloodvessel"); a short
      // one, or an acronym, only as a word of its own ("ceh").
      const inName = w.length >= 5 ? tokens.some((t) => t.includes(w)) : tokens.includes(w) && (w.length >= 4 || kw.acronyms.has(w));
      if (inName) hits.add(w);
    }
  }
  return [...hits];
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

/**
 * Everything lint:media fails on, bar drift (the command compares the files).
 *
 * @param {object} input
 * @param {object[]} input.entries   from buildRegistry
 * @param {object[]} [input.questions]   bank rows, for the file-name check
 * @param {{ paths: string[], reason: string }[]} [input.allowedSame]
 * @param {number} [input.maxQuestionBytes]
 */
export function lintMedia({ entries, questions = [], allowedSame = SAME_BYTES_ALLOWED, maxQuestionBytes = QUESTION_IMAGE_MAX_BYTES }) {
  const errors = [];
  const users = (e) => e.usedBy.slice(0, 3).join(', ') + (e.usedBy.length > 3 ? ` and ${e.usedBy.length - 3} more` : '');

  for (const e of entries) {
    if (!e.exists) { errors.push(`missing: ${e.path} is shown by ${users(e)} and is not under public/`); continue; }
    if (!e.isImage) { errors.push(`not an image: ${e.path} sits in a folder of pictures`); continue; }
    if (e.unreadable) { errors.push(`unreadable: ${e.path} (${e.unreadable})`); continue; }
    if (!e.usedBy.length) { errors.push(`unreferenced: ${e.path} is in a folder of ${e.folderKind ? `${e.folderKind} figures` : 'pictures'} and nothing shows it; show it or delete it`); continue; }
    if (e.kind === 'mixed') errors.push(`two kinds: ${e.path} is shown by a question and by a note section; give each its own file in its own folder`);
    else if (e.kind !== 'page' && e.folderKind !== e.kind) {
      errors.push(`wrong folder: ${e.path} is a ${e.kind} figure (${users(e)}); ${e.kind === 'question' ? 'question figures live in public/figures/questions/ or public/images/' : 'deck figures live in public/figures/<subject>/<topic>/'}`);
    }
    if (e.kind === 'question' && e.bytes > maxQuestionBytes) {
      errors.push(`too heavy: ${e.path} is ${kb(e.bytes)}, over the ${kb(maxQuestionBytes)} a question image may weigh; node scripts/media-to-webp.mjs public${e.path} --write`);
    }
  }

  // Byte-identical files within one kind.
  const allowed = allowedSame.map((a) => new Set(a.paths));
  const groups = new Map();
  for (const e of entries) {
    if (!e.sha256 || !e.usedBy.length) continue;
    const key = `${e.kind}\n${e.sha256}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e.path);
  }
  for (const [key, list] of groups) {
    if (list.length < 2) continue;
    if (allowed.some((set) => list.every((p) => set.has(p)))) continue;
    const kind = key.split('\n')[0];
    errors.push(`same picture ${list.length} times (${kind}): ${list.slice(0, 4).join(', ')}${list.length > 4 ? ` and ${list.length - 4} more` : ''}; ${kind === 'slide' ? 'node scripts/extract-slide-figures.mjs --clean --write' : 'point every question at one file and delete the others'}`);
  }
  for (const a of allowedSame) {
    if (!a.reason || !String(a.reason).trim()) errors.push(`SAME_BYTES_ALLOWED: ${a.paths.join(', ')} has no reason`);
    const live = a.paths.filter((p) => entries.some((e) => e.path === p && e.sha256));
    const hashes = new Set(live.map((p) => entries.find((e) => e.path === p).sha256));
    if (live.length !== a.paths.length || hashes.size !== 1) errors.push(`SAME_BYTES_ALLOWED: ${a.paths.join(', ')} are no longer the same bytes; remove the entry`);
  }

  // A figure's file name that names the key.
  const byPath = new Map(entries.map((e) => [e.path, e]));
  for (const q of questions) {
    for (const field of ['image', 'imagePath']) {
      const p = localPath(q?.[field]);
      if (!p || !byPath.has(p)) continue;
      const words = nameLeak(q, p);
      if (words.length) errors.push(`file name gives the answer: ${p} is shown above ${q.subject}:${q.id} and names its key (${words.join(', ')}); rename the file (q<id>.webp)`);
    }
  }
  return errors;
}

// ── What is written ──────────────────────────────────────────────────

const HASH_CHARS = 16;

/** The registry file's text. One picture per line, so a diff reads as the pictures that changed. */
export function registryText({ entries, inline }) {
  const listed = entries.filter((e) => e.exists && e.isImage && !e.unreadable && e.kind);
  const totals = {};
  for (const e of listed) {
    totals[e.kind] ||= { files: 0, bytes: 0 };
    totals[e.kind].files += 1;
    totals[e.kind].bytes += e.bytes;
  }
  if (totals.question) totals.question.inline = inline;
  const head = {
    about: 'Every picture a question or a note section shows: where it is, its pixel size, its weight, the first 16 hex characters of its SHA-256, its kind and what shows it. Written by scripts/media-registry.mjs (npm run regen:media); lint:media fails when it drifts. Guide: docs/MEDIA.md.',
    limits: { questionImageBytes: QUESTION_IMAGE_MAX_BYTES },
    totals: Object.fromEntries(Object.keys(totals).sort().map((k) => [k, totals[k]])),
  };
  const lines = listed.map((e) => JSON.stringify({
    path: e.path, kind: e.kind, width: e.width, height: e.height, bytes: e.bytes, hash: e.sha256.slice(0, HASH_CHARS), usedBy: e.usedBy,
  }));
  return `${JSON.stringify(head, null, 2).slice(0, -2)},\n  "media": [\n${lines.join(',\n')}\n  ]\n}\n`;
}

/** The question figures' sizes, for the card: loaded with the banks (src/lib/media-size.js). */
export function questionSizesText({ entries }) {
  const rows = entries.filter((e) => e.kind === 'question' && e.width && e.exists)
    .map((e) => `  ${JSON.stringify(e.path)}: [${e.width}, ${e.height}],`);
  return `// Generated by scripts/media-registry.mjs (npm run regen:media). Do not edit.
// The pixel size of every question figure under public/, so the card keeps the
// figure's place before the image arrives. It loads with the question banks
// (src/lib/media-size.js) and is never part of a view's own code.
export const QUESTION_MEDIA_SIZES = {
${rows.join('\n')}
};
`;
}

/** The deck figures' sizes, for the notes: loaded with the slide-figure map (components/SlideFigures.jsx). */
export function slideSizesText({ entries }) {
  const decks = new Map();
  for (const e of entries) {
    if (e.kind !== 'slide' || !e.width || !e.exists) continue;
    const at = e.path.lastIndexOf('/');
    const deck = e.path.slice('/figures/'.length, at);
    if (!decks.has(deck)) decks.set(deck, []);
    decks.get(deck).push(`${JSON.stringify(e.path.slice(at + 1))}:[${e.width},${e.height}]`);
  }
  const rows = [...decks].map(([deck, files]) => `  ${JSON.stringify(deck)}: {${files.join(',')}},`);
  return `// Generated by scripts/media-registry.mjs (npm run regen:media). Do not edit.
// The pixel size of every deck figure, by deck folder under /figures/ and file
// name, so a note keeps each figure's place before the image arrives. It loads
// beside slide-images.generated.js, only when a note with figures is read.
export const SLIDE_IMAGE_SIZES = {
${rows.join('\n')}
};

export function slideImageSize(src) {
  const at = String(src).lastIndexOf('/');
  const deck = SLIDE_IMAGE_SIZES[String(src).slice('/figures/'.length, at)];
  return (deck && deck[String(src).slice(at + 1)]) || null;
}
`;
}
