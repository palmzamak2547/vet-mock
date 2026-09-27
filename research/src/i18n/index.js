// Bilingual strings [M1-DESIGN.md 4]. Thai by default, English of equal quality; the ไทย/EN switch
// in the header writes prefs.lang (per device) and <html lang>. No visible string is hardcoded in a
// component: components call t(key, params). Dictionaries are split by area so the landing never
// downloads workspace strings; each lazy root registers its areas at module load.
// OWNER: data role (this file; runtime in M1). Each area file has one owner (M1-DESIGN.md 4.2).
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import common from './common.js';
import terms from './terms.js';
import { readPrefs, writePrefs } from '../lib/store/prefs.js';

export const LANGS = /** @type {const} */ (['th', 'en']);

/** Key prefix each area file must use (tests/unit/i18n-dictionaries.test.mjs enforces it). */
export const AREA_PREFIX = Object.freeze({
  common: 'common.', terms: 'term.', workspace: 'ws.', report: 'report.', landing: 'landing.', entrance: 'entrance.',
  intake: 'intake.', stats: 'stats.', epi: 'epi.', runtime: 'runtime.',
  // M2 areas [M2-DESIGN.md 9]
  lab: 'lab.', models: 'models.', measure: 'measure.', data: 'data.', graphs: 'graphs.', tools: 'tools.', trust: 'trust.',
});

/** @typedef {{ th: Record<string, string>, en: Record<string, string> }} Dictionary */

const table = { th: /** @type {Record<string, string>} */ ({}), en: /** @type {Record<string, string>} */ ({}) };
const registered = new Set();

/**
 * Add an area's strings. Idempotent per area name. Throws on a key that another area already defined.
 * @param {string} area
 * @param {Dictionary} dict
 */
export function registerArea(area, dict) {
  if (registered.has(area)) return;
  for (const lang of LANGS) {
    for (const [k, v] of Object.entries(dict[lang] || {})) {
      if (Object.prototype.hasOwnProperty.call(table[lang], k)) throw new Error(`i18n: duplicate key ${k}`);
      table[lang][k] = v;
    }
  }
  registered.add(area);
}

registerArea('common', common);
registerArea('terms', terms);

/**
 * Look up a string and fill {name} placeholders. A missing key returns the key itself wrapped in
 * brackets (visible in review, never silently English in a Thai page) and warns in development.
 * @param {'th'|'en'} lang
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 * @returns {string}
 */
export function translate(lang, key, params) {
  const s = table[lang]?.[key];
  if (s === undefined) {
    if (import.meta.env?.DEV) console.warn(`i18n: missing ${lang} ${key}`);
    return `[${key}]`;
  }
  if (!params) return s;
  const out = s.replace(/\{(\w+)\}/g, (m, name) => (params[name] === undefined ? m : String(params[name])));
  return lang === 'en' ? singularEn(out) : out;
}

const IRREGULAR = { analyses: 'analysis', categories: 'category', strata: 'stratum', times: 'time' };
const COUNTED = /(^|[^\d.,])1 ((?:[a-z]+ )?)(rows|cells|columns|projects|results|times|farms|animals|things|pairs|steps|conversions|questions|values|items|groups|levels|tests|analyses|files|days|months|years|categories|strata|entries|clusters|sheets|kept results)\b/g;

/**
 * English counts are written "{n} rows"; when n is 1 the noun is made singular ("1 row", "1 kept
 * result"), so the dictionaries need no second key per count (review round 1: "1 kept results").
 * @param {string} s
 */
export function singularEn(s) {
  return s.replace(COUNTED, (m, pre, adj, noun) => {
    const one = IRREGULAR[noun] || noun.replace(/s$/, '');
    return `${pre}1 ${adj}${one}`;
  });
}

const I18nContext = createContext({ lang: /** @type {'th'|'en'} */ ('th'), setLang: (_l) => {}, t: (key, params) => translate('th', key, params) });

/** @param {{ children: any }} props */
export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => readPrefs().lang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((next) => {
    if (next !== 'th' && next !== 'en') return;
    writePrefs({ lang: next });
    setLangState(next);
  }, []);
  const t = useCallback((key, params) => translate(lang, key, params), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return createElement(I18nContext.Provider, { value }, children);
}

/** @returns {{ lang: 'th'|'en', setLang: (l: 'th'|'en') => void, t: (key: string, params?: Record<string, string|number>) => string }} */
export function useT() {
  return useContext(I18nContext);
}
