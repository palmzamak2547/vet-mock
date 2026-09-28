// RIS and BibTeX for the references a report cites and for citing VetMock Research itself, and the
// citation line in Thai and English [M2-DESIGN.md 6.5, 11.2]. Pure strings, no dependency, so the /cite
// page and the report can both load it. A DOI is written only when the record has one; nothing here
// makes one up. OWNER: report role.

/**
 * @typedef {{ id: string, type: 'article'|'book'|'software', authors: string[], title: string, year: number, journal?: string, volume?: string, issue?: string, pages?: string, doi?: string|null, url?: string, version?: string, accessed?: string, publisher?: string }} CiteRecord
 */

/** The address VetMock Research answers on. */
export const SOFTWARE_URL = 'https://research.vetmock.com';
export const SOFTWARE_NAME = 'VetMock Research';

const RIS_TYPE = { article: 'JOUR', book: 'BOOK', software: 'COMP' };

/** "837-845" to its first and last page. */
function pageParts(pages) {
  const m = String(pages || '').split(/\s*[-–]+\s*/);
  return { sp: m[0] || '', ep: m[1] || '' };
}

/** 'YYYY-MM-DD' to 'YYYY/MM/DD' as RIS writes a date (Y2, the access date). */
const risDate = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(String(iso || '')) ? String(iso).replace(/-/g, '/') : '');

/**
 * RIS (Research Information Systems) records, one per reference, CRLF line ends as the format asks.
 * @param {CiteRecord[]} refs
 * @returns {string}
 */
export function toRis(refs) {
  const lines = [];
  const tag = (t, v) => {
    const s = v === undefined || v === null ? '' : String(v).replace(/[\r\n]+/g, ' ').trim();
    if (s) lines.push(`${t}  - ${s}`);
  };
  for (const r of refs || []) {
    tag('TY', RIS_TYPE[r.type] || 'GEN');
    for (const a of r.authors || []) tag('AU', a);
    tag('TI', r.title);
    if (r.type === 'article') {
      tag('T2', r.journal);
      tag('JO', r.journal);
    }
    tag('PY', r.year);
    tag('VL', r.volume);
    tag('IS', r.issue);
    const { sp, ep } = pageParts(r.pages);
    tag('SP', sp);
    tag('EP', ep);
    tag('ET', r.version);
    tag('PB', r.publisher);
    tag('DO', r.doi);
    tag('UR', r.url || (r.doi ? `https://doi.org/${r.doi}` : ''));
    tag('Y2', risDate(r.accessed));
    lines.push('ER  - ');
    lines.push('');
  }
  return lines.join('\r\n');
}

/** Characters BibTeX treats as commands, escaped; everything else (Thai, ø) stays as UTF-8 text. */
function bib(s) {
  return String(s ?? '')
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/[\r\n]+/g, ' ');
}

/** A citation key BibTeX accepts: letters, digits and the id's own separators. */
const bibKey = (id) => String(id || 'ref').replace(/[^A-Za-z0-9:_-]/g, '');

/**
 * BibTeX entries: @article, @book, and @software for VetMock Research (biblatex's type, which Zotero and
 * JabRef import; classic BibTeX styles print it as @misc).
 * @param {CiteRecord[]} refs
 * @returns {string}
 */
export function toBibtex(refs) {
  const out = [];
  for (const r of refs || []) {
    const type = r.type === 'software' ? 'software' : r.type === 'book' ? 'book' : 'article';
    const f = [];
    const field = (name, v, raw = false) => {
      if (v === undefined || v === null || v === '') return;
      f.push(`  ${name} = {${raw ? v : bib(v)}}`);
    };
    // A name without a comma is an organisation or a program: braced whole so BibTeX does not split it.
    if ((r.authors || []).length) field('author', r.authors.map((a) => (String(a).includes(',') ? bib(a) : `{${bib(a)}}`)).join(' and '), true);
    // Double braces keep the title's capitals as written (acronyms such as ROC, STROBE-Vet).
    field('title', `{${bib(r.title)}}`, true);
    if (type === 'article') field('journal', r.journal);
    field('year', r.year);
    field('volume', r.volume);
    field('number', r.issue);
    if (r.pages) field('pages', String(r.pages).replace(/\s*[-–]+\s*/, '--'), true);
    field('publisher', r.publisher);
    field('version', r.version);
    field('doi', r.doi, true);
    if (r.url) field('url', r.url, true);
    if (r.accessed) field('urldate', r.accessed, true);
    out.push(`@${type}{${bibKey(r.id)},\n${f.join(',\n')}\n}\n`);
  }
  return out.join('\n');
}

/**
 * VetMock Research as a reference record for one release. `release` comes from src/data/cite.js (trust);
 * when no release record exists the caller passes the version the results were computed with and the
 * record carries no authors and no DOI rather than invented ones.
 * @param {{ version: string, year: number, url?: string, doi?: string|null, authors?: string[] }} release
 * @param {string} accessed   'YYYY-MM-DD', the day the student downloads it
 * @returns {CiteRecord}
 */
export function softwareRecord(release, accessed) {
  return {
    id: `vetmockResearch${String(release?.version || '').replace(/[^0-9A-Za-z]/g, '')}`,
    type: 'software',
    authors: Array.isArray(release?.authors) ? release.authors.slice() : [],
    title: SOFTWARE_NAME,
    year: release?.year,
    version: release?.version || undefined,
    url: release?.url || SOFTWARE_URL,
    doi: release?.doi || null,
    accessed,
  };
}

/** 'YYYY-MM-DD' written with its era: "28 ก.ย. พ.ศ. 2569" / "28 Sep 2026 CE" (month and era words from the dictionary). */
export function dateWithEra(iso, lang, t) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return '';
  const y = Number(m[1]);
  const month = t(`ws.date.month.${Number(m[2])}`);
  const era = t('ws.date.era');
  return lang === 'th' ? `${Number(m[3])} ${month} ${era} ${y + 543}` : `${Number(m[3])} ${month} ${y} ${era}`;
}

/**
 * The citation line a student pastes into a reference list: authors when the release names them, the
 * version, the year with its era, the address and the access date; the DOI only when one was minted.
 * @param {{ version: string, year: number, url?: string, doi?: string|null, authors?: string[] }} release
 * @param {{ lang: 'th'|'en', t: (k: string, p?: any) => string, accessed: string }} ctx
 * @returns {string}
 */
export function citationText(release, ctx) {
  const { lang, t } = ctx;
  const authors = (release?.authors || []).join(', ');
  const year = lang === 'th' ? t('report.cite.yearTh', { be: release.year + 543, ce: release.year }) : t('report.cite.yearEn', { ce: release.year });
  const parts = {
    name: SOFTWARE_NAME,
    version: release.version,
    year,
    // one form everywhere (the /cite page, the report pane, the files): the DOI address stands for the web
    // address once one is minted (review round 2: three different citation lines)
    url: release.doi ? `https://doi.org/${release.doi}` : release.url || SOFTWARE_URL,
    accessed: dateWithEra(ctx.accessed, lang, t),
  };
  return t(authors ? 'report.cite.lineAuthors' : 'report.cite.line', { ...parts, authors });
}

/** One reference as it is printed in the list (Vancouver order: authors, title, journal, year;volume(issue):pages, DOI). */
export function referenceLine(ref, n, words) {
  const initials = (a) => {
    const [family, given = ''] = String(a).split(',').map((x) => x.trim());
    const ini = given.split(/[\s.-]+/).filter(Boolean).map((g) => g[0].toUpperCase()).join('');
    return ini ? `${family} ${ini}` : family;
  };
  const authors = (ref.authors || []).map(initials);
  const who = authors.length > 6 ? `${authors.slice(0, 6).join(', ')}, et al` : authors.join(', ');
  const parts = [];
  if (who) parts.push(`${who}.`);
  if (ref.type === 'software') {
    parts.push(`${ref.title} [${words.software}].`);
    if (ref.version) parts.push(`${words.version} ${ref.version}.`);
    parts.push(`${words.yearText ? words.yearText(ref.year) : ref.year}.`);
    parts.push(`${words.available} ${ref.url}${ref.accessed ? ` (${words.accessed} ${words.accessedDate})` : ''}.`);
    if (ref.doi) parts.push(`doi:${ref.doi}`);
  } else {
    parts.push(`${String(ref.title).replace(/[.\s]+$/, '')}.`);
    const where = [ref.volume ? `${ref.volume}${ref.issue ? `(${ref.issue})` : ''}` : '', ref.pages ? `:${ref.pages}` : ''].join('');
    parts.push(`${ref.journal}. ${ref.year}${where ? `;${where}` : ''}.`);
    if (ref.doi) parts.push(`doi:${ref.doi}`);
  }
  return `${n}. ${parts.join(' ')}`;
}
