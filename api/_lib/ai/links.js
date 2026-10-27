// ============================================================
// ai/links.js — every deep link the chat hands out, built from the app's own
// URL code
// ============================================================
// The chat runs on ai.vetmock.com, so every link is ABSOLUTE and points at
// vetmock.com. Each builder delegates to the module the app itself uses to
// read that URL back (vetwiki/url.js, view-route.js, share-link.js,
// source-label.js), so a link from the chat cannot drift from what the app
// accepts: rename a route there and these follow.
//
//   wiki section   /wiki/<subject>/<topic>#<sectionId>
//   video clip     /app/videos?v=<id>&at=<second>
//   question(s)    /?qset=<base64url [{s,i}]>  — the shared-quiz link, which
//                  opens exactly those bank questions in the exam screen
//   library shelf  /app/library?subject=<id>
//   app screen     /app/... from view-route.js (VetWiki index is /wiki)
//   paper          PubMed by PMID, else the DOI resolver
// ============================================================

import { SITE } from './config.js';
import { wikiPath } from '../../../src/lib/vetwiki/url.js';
import { appPathForView } from '../../../src/lib/view-route.js';
import { encodeQuizSet } from '../../../src/lib/share-link.js';
import { momentHref } from '../../../src/lib/source-label.js';

const abs = (path) => `${SITE}${path.startsWith('/') ? path : `/${path}`}`;

export function wikiLink(subject, topic, sectionId) {
  return abs(wikiPath(subject, topic, sectionId));
}

export function videoLink(videoId, seconds = 0) {
  return abs(momentHref({ videoId, seconds: Number.isInteger(seconds) && seconds >= 0 ? seconds : 0 }));
}

/** One or more bank questions as a shared-quiz link, or null when none of
 *  them can travel in a link (custom questions never can). */
export function questionSetLink(questions) {
  const qset = encodeQuizSet(Array.isArray(questions) ? questions : [questions]);
  return qset ? `${SITE}/?qset=${qset}` : null;
}

export function librarySubjectLink(subjectId) {
  return `${SITE}/app/library?subject=${encodeURIComponent(subjectId)}`;
}

/** An app screen by its view id. VetWiki and the imaging lab live outside the
 *  /app/* map, so they are named here. Null for a view with no address. */
export function viewLink(view) {
  if (view === 'knowledge') return abs('/wiki');
  if (view === 'lab') return abs('/#lab');
  const path = appPathForView(view);
  return path ? abs(path) : null;
}

/**
 * Where a feature-registry entry opens, or null when it has no address (a
 * calculator popup, the voice overlay): such a feature can be described but
 * not linked, and the chat never invents a URL for it.
 */
export function featureLink(feature) {
  const inv = feature?.invoke;
  if (!inv) return null;
  if (inv.kind === 'view') return viewLink(inv.view);
  if (inv.kind === 'external' && /^https:\/\//.test(inv.url || '')) return inv.url;
  // A practice preset starts from the subject picker; the preset itself has no URL.
  if (inv.kind === 'practice' || inv.kind === 'panic') return viewLink('subject-select');
  return null;
}

export function paperLink({ pmid, doi } = {}) {
  if (pmid && /^\d{1,9}$/.test(String(pmid))) return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  if (doi && /^10\.\d{4,9}\/\S+$/.test(String(doi))) return `https://doi.org/${encodeURI(String(doi))}`;
  return null;
}
