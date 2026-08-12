#!/usr/bin/env node

// Build a source-audited research cache for the VetMock faculty directory.
// Primary identity sources: current Chula Vet department pages and official
// researcher profiles. Publication discovery: OpenAlex. DOI metadata is then
// checked independently against Crossref before a paper can be emitted.

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { ALL_INSTRUCTORS } from '../src/data/instructors.js';
import { collectOfficialRoster } from './audit-instructors.mjs';

const ROOT = new URL('..', import.meta.url);
const CACHE_DIR = new URL('data-cache/instructors/', ROOT);
const CACHE_FILE = new URL('research-audit.json', CACHE_DIR);
const DEFAULT_VAULT = 'C:\\Users\\palmz\\OneDrive\\Desktop\\MycOS\\knowledge\\instructors';
const CURRENT_YEAR = new Date().getFullYear();
const RESEARCH_CONTACT = (process.env.VETMOCK_RESEARCH_CONTACT || '').trim();
const CONTACT = RESEARCH_CONTACT ? `mailto=${encodeURIComponent(RESEARCH_CONTACT)}` : '';
const CONTACT_SUFFIX = CONTACT ? `&${CONTACT}` : '';
const OFFICIAL_EMAIL_SLUGS = {
  'sanipa.s@chula.ac.th': 'sanipa-suradhat',
  'woraporn.s@chula.ac.th': 'woraporn-sukhumavasi',
  'kiatpichet.k@chula.ac.th': 'krit-komin',
  'nan.c@chula.ac.th': 'nan-choisunirachon',
  'panrawee.p@chula.ac.th': 'panrawee-viriyasitthawat',
  'nicole.s@chula.ac.th': 'nicole-mehl',
  'cuorapun.j@chula.ac.th': 'orapun-chaturakanchanaphon',
};

// Publication indexes and the faculty website do not always use the same
// romanisation. These aliases are evidence-backed variants found on official
// profiles or DOI metadata; they are search inputs, never displayed blindly.
const IDENTITY_ALIASES = {
  'chenpop-sawangmake': ['Chenphop Sawangmake', 'Chenpop Sawangmek'],
  'chollada-buranakarl': ['Chollada Buranakarl', 'Chollada Buranakan'],
  'ekkapol-akkraputtiporn': ['Ekkapol Akaraphutiporn', 'Ekkapol Akkraputtiporn'],
  'gunnaporn-suriyaphol': ['Gunnaporn Suriyaphol', 'Gunnaporn Suriyaphon'],
  'krichaporn-kradanggha': ['Krishaporn Kradangnga', 'Krichaporn Kradanggha'],
  'krit-komin': ['Kiatpichet Komin'],
  'nalinee-tantiwanich': ['Nalinee Tuntivanich', 'Nalinee Tantiwanich'],
  'natchanon-damneam': ['Natchanon Dumniem', 'Natchanon Dumumniem', 'Natchanon Damneam'],
  'navapon-techakriengkrai': ['Navapon Techakriengkrai', 'Nawapol Techakriangkrai'],
  'nicole-mehl': ['Nicole Sirisopit Mehl', 'Nicole Sirisophisth Mehl'],
  'nipattra-suwanpairintr': ['Nipattra Suanpairintr', 'Nipattra Suwanpairintr'],
  'orapun-chaturakanchanaphon': ['Orapun Jaturakan', 'Orapun Chaturakanchanaphon'],
  'panrawee-viriyasitthawat': ['Panrawee Viriyasitavat', 'Panrawee Phoomvuthisarn', 'Panrawee Viriyasitthawat'],
  'patharapol-piamsomboon': ['Pattarapol Piamsomboon', 'Patharapol Piamsomboon'],
  'pattaramonchat-bunnak': ['Patmanachatr Bunnag', 'Pattaramonchat Bunnak'],
  'pattrarat-chanchaithong': ['Pattrarat Chanchaithong', 'Pattarat Chanchaithong'],
  'prapruddee-piyaviriyakul': ['Prapruddee Piyaviriyakul', 'Prabhaddee Piyawiriyakul'],
  'saikaew-sutayatram': ['Saikaew Sattayatham', 'Saikaew Sutayatram'],
  'sawita-santivipatana': ['Sawita Santiviparat', 'Sawita Santivipatana'],
  'sirakarnt-dhitavat': ['Sirikarnt Dhitavat', 'Sirakarnt Dhitavat'],
  'sirawit-pakdeephanichkit': ['Sirawit Pakdeephanichkit', 'Sirawit Pagdepanichkit'],
  'sirinun-thabthiang': ['Sirinun Pisamai Tabtieang', 'Sirinun Phismai Thabthiang'],
  'sitilak-surachetpong': ['Sirilak Surachetpong', 'Sitilak Surachetpong'],
  'supol-semserimbun': ['Sapon Semsirmboon', 'Supol Semserimbun'],
  'teerapol-chingkangsadar': ['Teerapol Chinkangsadarn', 'Teerapol Chingkangsadar'],
  'teerawat-sawangchun-uthai': ['Theerawat Swangchan-Uthai', 'Teerawat Sawangchun-uthai'],
  'thavajchai-lekdamrongsak': ['Thawat Lekdumrongsak', 'Thavajchai Lekdamrongsak'],
  'theerawat-tharasanit': ['Teerawat Tarasanit', 'Theerawat Tharasanit'],
  'theerayuth-kaewamatawong': ['Thirayut Kaewamatawong', 'Theerayuth Kaewamatawong'],
  'thanasak-boonserm': ['Thanasak Boonserm'],
  'theerapong-yata': ['Teerapong Yata', 'Thiraphong Yata', 'Theerapong Yata'],
  'worrayanee-thammathorn': ['Worrayanee Thammatorn', 'Worrayanee Thammathorn'],
  'wuthichai-klomkliao': ['Wuthichai Klomkleaw', 'Wuthichai Klomkliao'],
};

function decodeHtml(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;|&ensp;|&emsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function textFromHtml(value = '') {
  return decodeHtml(value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' '))
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

function stripMarkdown(value = '') {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripThaiTitle(value = '') {
  return value
    .replace(/^(?:(?:ศาสตราจารย์|รองศาสตราจารย์|ผู้ช่วยศาสตราจารย์|ศ\.|รศ\.|ผศ\.|อ\.|น\.สพ\.|สพ\.ญ\.|ดร\.)\s*)+/u, '')
    .trim();
}

function stripEnglishTitle(value = '') {
  let result = value.trim();
  const prefix = /^(?:(?:professor|associate professor|assistant professor|instructor|lecturer|prof\.?|assoc\.?\s*prof\.?|asst\.?\s*prof\.?|doctor|dr\.?|dvm|phd|mr\.?|mrs\.?|miss|ms\.?)\s*)+/i;
  while (prefix.test(result)) result = result.replace(prefix, '').trim();
  return result;
}

function normalizeName(value = '') {
  return stripThaiTitle(stripEnglishTitle(value))
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/g, '');
}

function normalizeEmail(value = '') {
  return value.trim().toLowerCase();
}

function slugify(value = '') {
  return stripEnglishTitle(value)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function levenshtein(a, b) {
  const left = normalizeName(a);
  const right = normalizeName(b);
  if (!left) return right.length;
  if (!right) return left.length;
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const old = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        previous + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
      previous = old;
    }
  }
  return row[right.length];
}

function similarity(a, b) {
  const maxLength = Math.max(normalizeName(a).length, normalizeName(b).length, 1);
  return 1 - (levenshtein(a, b) / maxLength);
}

function parseFrontmatter(text) {
  const raw = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
  const result = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (!match) continue;
    const [, key, original] = match;
    const value = original.trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      result[key] = value.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean);
    } else {
      result[key] = value.replace(/^['"]|['"]$/g, '');
    }
  }
  return result;
}

function bodyField(text, label) {
  return stripMarkdown(text.match(new RegExp(`^\\*\\*${label}\\*\\*:\\s*(.+)$`, 'mi'))?.[1] || '');
}

function parseMarkdownLinks(value = '') {
  const result = {};
  for (const match of value.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) {
    const label = match[1].toLowerCase();
    if (label.includes('scholar')) result.scholar = match[2];
    else if (label.includes('scopus')) result.scopus = match[2];
    else if (label.includes('researchgate')) result.researchgate = match[2];
    else if (label.includes('pubmed')) result.pubmed = match[2];
    else if (label.includes('orcid')) result.orcid = match[2];
    else if (label.includes('official') || label.includes('chula')) result.official = match[2];
  }
  return result;
}

function parseVaultAreas(text) {
  const section = text.match(/##\s+[^\r\n]*Research areas[^\r\n]*\r?\n([\s\S]*?)(?=\r?\n##\s|$)/i)?.[1]?.trim() || '';
  if (!section) return [];
  const bulletAreas = section.split(/\r?\n/)
    .map((line) => line.match(/^[-*]\s+(.*)$/)?.[1])
    .filter(Boolean)
    .map((line) => stripMarkdown(line.split(/\s+[—–-]\s+/)[0]));
  if (bulletAreas.length) return [...new Set(bulletAreas)].slice(0, 6);
  return section
    .split(/[·;\n]/)
    .map(stripMarkdown)
    .filter((item) => item && !/limited public|to be confirmed|tbd/i.test(item))
    .slice(0, 6);
}

function parseVaultPapers(text) {
  const section = text.match(/##\s+[^\r\n]*Notable papers[^\r\n]*\r?\n([\s\S]*?)(?=\r?\n##\s|$)/i)?.[1]?.trim() || '';
  const papers = [];
  for (const line of section.split(/\r?\n/)) {
    if (!/^\|/.test(line) || /^\|\s*(?:Year|---)/i.test(line)) continue;
    const columns = line.split('|').slice(1, -1).map((column) => column.trim());
    const year = Number(columns[0]);
    if (!Number.isInteger(year)) continue;
    const titleCell = columns[1] || '';
    const link = titleCell.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
    const title = stripMarkdown(link?.[1] || titleCell);
    if (!title || /to be researched|none located/i.test(title)) continue;
    papers.push({
      year,
      title,
      journal: stripMarkdown(columns[2] || ''),
      url: link?.[2],
      verification: 'vault-unverified',
    });
  }
  return papers;
}

async function loadVaultRecords() {
  const vaultPath = process.env.VETMOCK_INSTRUCTOR_VAULT || DEFAULT_VAULT;
  const files = (await readdir(vaultPath)).filter((file) => file.endsWith('.md') && !file.startsWith('_'));
  const records = [];
  for (const file of files) {
    const text = await readFile(join(vaultPath, file), 'utf8');
    const frontmatter = parseFrontmatter(text);
    const slug = frontmatter.slug || basename(file, '.md');
    const rawThaiName = frontmatter.nameTh || '';
    const profilesLine = text.match(/^\*\*Profiles?\*\*:\s*(.+)$/mi)?.[1] || '';
    records.push({
      slug,
      nameEn: frontmatter.name || '',
      nameTh: stripThaiTitle(rawThaiName),
      titleTh: rawThaiName.replace(stripThaiTitle(rawThaiName), '').trim(),
      position: bodyField(text, 'Position'),
      department: bodyField(text, 'Department'),
      institution: bodyField(text, 'Faculty') || 'Faculty of Veterinary Science, Chulalongkorn University',
      email: bodyField(text, 'Email').replace(/^\(|\)$/g, ''),
      profiles: { ...parseMarkdownLinks(profilesLine), ...parseMarkdownLinks(text) },
      areas: parseVaultAreas(text),
      papers: parseVaultPapers(text),
      subjects: frontmatter.subjects || [],
      topics: frontmatter.topics || [],
      sourceType: frontmatter.type || 'instructor',
      vaultFile: file,
    });
  }
  return records;
}

function mergeAppRecords(vaultRecords) {
  const bySlug = new Map(vaultRecords.map((record) => [record.slug, record]));
  for (const app of ALL_INSTRUCTORS) {
    // The generated public directory also contains hand-audited guest profiles.
    // Those are appended by the generator and must not be fed back into this
    // cache, otherwise each research refresh creates a circular duplicate.
    if (!bySlug.has(app.slug)) continue;
    const vault = bySlug.get(app.slug) || {};
    bySlug.set(app.slug, {
      ...vault,
      ...app,
      profiles: { ...(vault.profiles || {}), ...(app.profiles || {}) },
      subjects: [...new Set([...(vault.subjects || []), ...(app.subjects || [])])],
      topics: [...new Set([...(vault.topics || []), ...(app.topics || [])])],
      vaultAreas: vault.areas || [],
      vaultPapers: vault.papers || [],
    });
  }
  return [...bySlug.values()];
}

async function fetchJson(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          accept: 'application/json',
          'user-agent': 'VetMock instructor research audit/1.0',
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolveDelay) => setTimeout(resolveDelay, 800 * attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

let openAlexQueue = Promise.resolve();

function fetchOpenAlexJson(url) {
  const task = openAlexQueue.then(async () => {
    // OpenAlex's unauthenticated API is intentionally treated gently. Keeping
    // requests serial also makes long refreshes resumable instead of ending in
    // a wall of HTTP 429 responses.
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 350));
    return fetchJson(url, {}, 5);
  });
  openAlexQueue = task.catch(() => undefined);
  return task;
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'VetMock instructor research audit/1.0' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolveDelay) => setTimeout(resolveDelay, 800 * attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

async function pooled(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      try {
        results[index] = await worker(items[index], index);
      } catch (error) {
        results[index] = { error: error instanceof Error ? error.message : String(error) };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function parseOfficialResearcher(html, locale, url) {
  const profileNameHtml = html.match(/<h4[^>]*class=["'][^"']*profile-name[^"']*["'][^>]*>([\s\S]*?)<\/h4>/i)?.[1] || '';
  const profileName = textFromHtml(profileNameHtml);
  const biographyHtml = html.match(/id=["']researcher-biography["'][\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
  const biographyLines = textFromHtml(biographyHtml).split('\n').map((line) => line.trim()).filter(Boolean);
  const interestHtml = html.match(/id=["']interest["'][\s\S]*?<div[^>]*class=["'][^"']*cLeft[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] || '';
  const interestText = textFromHtml(interestHtml);
  const email = decodeHtml(html.match(/href=["']mailto:([^"']+)["']/i)?.[1] || '').trim();
  const scholar = decodeHtml(html.match(/href=["'](https?:\/\/scholar\.google\.[^"']+)["']/i)?.[1] || '');
  const scopus = decodeHtml(html.match(/href=["'](https?:\/\/www\.scopus\.com\/[^"']+)["']/i)?.[1] || '');
  const metricMatches = [...html.matchAll(/<li[^>]*class=["'][^"']*metics-item[^"']*["'][^>]*>[\s\S]*?<h2>([\s\S]*?)<\/h2>[\s\S]*?<p>([\s\S]*?)<\/p>/gi)];
  const metrics = Object.fromEntries(metricMatches.map((match) => [textFromHtml(match[2]), Number(textFromHtml(match[1]))]));
  const name = locale === 'th' ? stripThaiTitle(profileName) : stripEnglishTitle(profileName);
  const department = biographyLines.find((line) => /department|ภาควิชา|หน่วย/i.test(line) && normalizeName(line) !== normalizeName(profileName));
  const rawAreas = interestText
    .split(/[\n,;]+/)
    .map((area) => area.trim().replace(/[.。]+$/g, ''))
    .filter((area) => area && area !== '-');

  return {
    locale,
    url,
    profileName,
    name,
    title: profileName.replace(name, '').trim(),
    department,
    email: email || undefined,
    areas: [...new Set(rawAreas)].slice(0, 8),
    profiles: { scholar: scholar || undefined, scopus: scopus || undefined },
    metrics,
  };
}

function canonicalOfficialEnglish(profileName, rosterName) {
  if (!profileName) return rosterName;
  if (!profileName.includes(',')) return profileName;
  const [surname, given = ''] = profileName.split(',').map((part) => part.trim());
  if (!given || /^[A-Z](?:\.|$)/i.test(given)) return rosterName || profileName;
  return `${given} ${surname}`.trim();
}

async function fetchResearcherPair(researcherUrl) {
  const thUrl = researcherUrl.replace('/en/researcher_info/', '/researcher_info/');
  const enUrl = thUrl.replace('/researcher_info/', '/en/researcher_info/');
  const [thHtml, enHtml] = await Promise.all([fetchText(thUrl), fetchText(enUrl)]);
  return {
    th: parseOfficialResearcher(thHtml, 'th', thUrl),
    en: parseOfficialResearcher(enHtml, 'en', enUrl),
  };
}

function officialMatchScore(record, official) {
  if (record.email && official.email && normalizeEmail(record.email) === normalizeEmail(official.email)) return 3;
  if (record.nameTh && official.nameTh && normalizeName(record.nameTh) === normalizeName(official.nameTh)) return 2.5;
  if (record.nameEn && official.nameEn) {
    const officialTokens = stripEnglishTitle(official.nameEn).trim().split(/\s+/);
    if (officialTokens.length === 1 && normalizeName(record.nameEn).startsWith(normalizeName(official.nameEn))) return 0.8;
  }
  if (record.nameEn && official.nameEn) return similarity(record.nameEn, official.nameEn);
  return 0;
}

function researcherProfileMatchesRoster(row, pair) {
  if (!pair) return false;
  const profileEmail = pair?.en?.email || pair?.th?.email;
  if (row.email && profileEmail) {
    return normalizeEmail(row.email) === normalizeEmail(profileEmail);
  }
  const rosterNames = [row.nameEn, row.nameTh].filter(Boolean).map(normalizeName);
  const profileNames = [pair?.en?.name, pair?.th?.name].filter(Boolean).map(normalizeName);
  return rosterNames.some((name) => profileNames.includes(name));
}

function attachOfficialSources(records, officialRows, researcherProfiles) {
  const assignments = [];
  const unmatchedOfficial = [];
  for (const row of officialRows) {
    const linkedProfile = row.researcherUrl ? researcherProfiles[row.researcherUrl] : undefined;
    // Some department cards link to another lecturer's researcher ID. Never
    // let a bad site link overwrite the card's own name, email, or title.
    const profile = researcherProfileMatchesRoster(row, linkedProfile) ? linkedProfile : undefined;
    const enriched = {
      ...row,
      researcherUrl: profile ? row.researcherUrl : undefined,
      rosterNameEn: row.nameEn,
      rosterNameTh: row.nameTh,
      rosterPositionEn: row.positionEn,
      rosterPositionTh: row.positionTh,
      nameEn: canonicalOfficialEnglish(profile?.en?.name, row.nameEn),
      nameTh: profile?.th?.name || row.nameTh,
      positionEn: profile?.en?.title || row.positionEn,
      positionTh: profile?.th?.title || row.positionTh,
      departmentEn: profile?.en?.department || row.department,
      departmentTh: profile?.th?.department,
      email: profile?.en?.email || profile?.th?.email || row.email,
      areasEn: profile?.en?.areas || [],
      areasTh: profile?.th?.areas || [],
      profiles: { ...(profile?.th?.profiles || {}), ...(profile?.en?.profiles || {}) },
      metrics: profile?.en?.metrics || profile?.th?.metrics || {},
    };
    const aliasedSlug = enriched.email && OFFICIAL_EMAIL_SLUGS[normalizeEmail(enriched.email)];
    if (aliasedSlug) {
      assignments.push({ slug: aliasedSlug, score: 4, official: enriched });
      continue;
    }
    const ranked = records
      .map((record) => ({ record, score: officialMatchScore(record, enriched) }))
      .sort((a, b) => b.score - a.score);
    if (!ranked[0] || ranked[0].score < 0.72) {
      unmatchedOfficial.push(enriched);
      continue;
    }
    assignments.push({ slug: ranked[0].record.slug, score: ranked[0].score, official: enriched });
  }

  const officialBySlug = {};
  for (const assignment of assignments) {
    const previous = officialBySlug[assignment.slug];
    officialBySlug[assignment.slug] = previous
      ? {
          ...previous,
          ...assignment.official,
          nameEn: assignment.official.nameEn || previous.nameEn,
          nameTh: assignment.official.nameTh || previous.nameTh,
          researcherUrl: assignment.official.researcherUrl || previous.researcherUrl,
        }
      : assignment.official;
  }
  return { officialBySlug, assignments, unmatchedOfficial };
}

function attachResearcherProfiles(records, researcherProfiles) {
  const bySlug = {};
  for (const [url, pair] of Object.entries(researcherProfiles)) {
    if (!pair?.th?.name && !pair?.en?.name) continue;
    const identity = {
      nameEn: canonicalOfficialEnglish(pair?.en?.name),
      nameTh: pair?.th?.name,
      email: pair?.en?.email || pair?.th?.email,
    };
    const aliasedSlug = identity.email && OFFICIAL_EMAIL_SLUGS[normalizeEmail(identity.email)];
    const ranked = records
      .map((record) => ({ record, score: officialMatchScore(record, identity) }))
      .sort((a, b) => b.score - a.score);
    const slug = aliasedSlug || (ranked[0]?.score >= 0.72 ? ranked[0].record.slug : undefined);
    if (!slug) continue;
    bySlug[slug] = {
      url,
      nameEn: identity.nameEn,
      nameTh: identity.nameTh,
      positionEn: pair?.en?.title,
      positionTh: pair?.th?.title,
      departmentEn: pair?.en?.department,
      departmentTh: pair?.th?.department,
      email: identity.email,
      areasEn: pair?.en?.areas || [],
      areasTh: pair?.th?.areas || [],
      profiles: { ...(pair?.th?.profiles || {}), ...(pair?.en?.profiles || {}) },
      metrics: pair?.en?.metrics || pair?.th?.metrics || {},
    };
  }
  return bySlug;
}

function candidateInstitutions(candidate) {
  const institutions = [
    ...(candidate.last_known_institutions || []),
    ...(candidate.affiliations || []).map((item) => item.institution),
  ];
  return [...new Set(institutions.map((item) => item?.display_name).filter(Boolean))];
}

function scoreOpenAlexCandidate(candidate, names, isCurrentFaculty) {
  const alternatives = [candidate.display_name, ...(candidate.display_name_alternatives || [])];
  const nameScore = Math.max(...names.flatMap((name) => alternatives.map((candidateName) => authorIdentityScore(name, candidateName))));
  const institutions = candidateInstitutions(candidate);
  const isChula = institutions.some((name) => /chulalongkorn/i.test(name));
  return {
    score: nameScore + (isCurrentFaculty && isChula ? 0.18 : 0),
    nameScore,
    isChula,
    institutions,
  };
}

async function findOpenAlexAuthor(record, official) {
  const names = [...new Set([...(IDENTITY_ALIASES[record.slug] || []), official?.nameEn, record.nameEn].filter(Boolean))];
  if (!names.length) return { status: 'unmatched', reason: 'No English name available' };
  const query = names[0];
  const url = `https://api.openalex.org/authors?search=${encodeURIComponent(query)}&per-page=10${CONTACT_SUFFIX}`;
  const payload = await fetchOpenAlexJson(url);
  const ranked = (payload.results || [])
    .map((candidate) => ({ candidate, ...scoreOpenAlexCandidate(candidate, names, Boolean(official)) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.nameScore < 0.78 || (official && !best.isChula && best.nameScore < 0.96)) {
    return {
      status: 'unmatched',
      query,
      candidates: ranked.slice(0, 3).map(({ candidate, score, nameScore, isChula, institutions }) => ({
        id: candidate.id,
        name: candidate.display_name,
        score,
        nameScore,
        isChula,
        institutions,
      })),
    };
  }
  return {
    status: best.nameScore >= 0.9 ? 'matched-high' : 'matched-review',
    query,
    id: best.candidate.id,
    openAlex: best.candidate,
    score: best.score,
    nameScore: best.nameScore,
    isChula: best.isChula,
    institutions: best.institutions,
  };
}

function shortOpenAlexId(value = '') {
  return value.replace('https://openalex.org/', '');
}

async function fetchAuthorWorks(authorId) {
  const id = shortOpenAlexId(authorId);
  const base = `https://api.openalex.org/works?filter=author.id:${id}&per-page=`;
  const [top, recent] = await Promise.all([
    fetchOpenAlexJson(`${base}30&sort=cited_by_count:desc${CONTACT_SUFFIX}`),
    fetchOpenAlexJson(`${base}20&sort=publication_date:desc${CONTACT_SUFFIX}`),
  ]);
  const byId = new Map();
  for (const work of [...(top.results || []), ...(recent.results || [])]) byId.set(work.id, work);
  return [...byId.values()];
}

function paperAuthors(work, authorId) {
  const names = (work.authorships || []).map((authorship) => authorship.author?.display_name).filter(Boolean);
  const target = (work.authorships || []).find((authorship) => authorship.author?.id === authorId);
  const compact = names.length <= 5 ? names.join(', ') : `${names.slice(0, 3).join(', ')}, et al.`;
  return { compact, targetPosition: target?.author_position, corresponding: Boolean(target?.is_corresponding) };
}

function workDoi(work) {
  return (work.doi || work.ids?.doi || '').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
}

function paperFromWork(work, authorId) {
  const authors = paperAuthors(work, authorId);
  const doi = workDoi(work);
  const pmid = (work.ids?.pmid || '').replace(/^https?:\/\/pubmed\.ncbi\.nlm\.nih\.gov\//i, '').replace(/\/$/, '');
  return {
    openAlexId: work.id,
    title: work.title,
    year: work.publication_year,
    publicationDate: work.publication_date,
    journal: work.primary_location?.source?.display_name || work.best_oa_location?.source?.display_name || '',
    authors: authors.compact,
    targetPosition: authors.targetPosition,
    corresponding: authors.corresponding,
    citedByCount: work.cited_by_count || 0,
    type: work.type,
    doi: doi || undefined,
    pmid: pmid || undefined,
    url: doi ? `https://doi.org/${doi}` : (pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : work.id),
    topics: (work.topics || []).slice(0, 3).map((topic) => topic.display_name).filter(Boolean),
    primaryTopic: work.primary_topic?.display_name,
    isRetracted: Boolean(work.is_retracted),
  };
}

function selectCandidatePapers(works, authorId) {
  const eligible = works
    .map((work) => paperFromWork(work, authorId))
    .filter((paper) => paper.title && paper.year && paper.year <= CURRENT_YEAR && !paper.isRetracted)
    .filter((paper) => ['article', 'review', 'book-chapter'].includes(paper.type))
    .filter((paper) => paper.doi || paper.pmid);

  const signature = [...eligible].sort((a, b) => {
    const roleA = (a.targetPosition === 'first' || a.targetPosition === 'last' ? 60 : 0) + (a.corresponding ? 30 : 0);
    const roleB = (b.targetPosition === 'first' || b.targetPosition === 'last' ? 60 : 0) + (b.corresponding ? 30 : 0);
    return (roleB + Math.log1p(b.citedByCount) * 12) - (roleA + Math.log1p(a.citedByCount) * 12);
  });
  const recent = [...eligible].sort((a, b) => (b.publicationDate || '').localeCompare(a.publicationDate || ''));
  const selected = [];
  for (const paper of [...signature.slice(0, 2), ...recent]) {
    if (selected.some((item) => item.openAlexId === paper.openAlexId)) continue;
    selected.push(paper);
    if (selected.length === 3) break;
  }
  return selected;
}

function areasFromWorks(works) {
  const weights = new Map();
  for (const work of works) {
    const weight = 1 + Math.log1p(work.cited_by_count || 0) + (work.publication_year >= CURRENT_YEAR - 5 ? 2 : 0);
    for (const topic of (work.topics || []).slice(0, 3)) {
      if (!topic.display_name) continue;
      weights.set(topic.display_name, (weights.get(topic.display_name) || 0) + weight * (topic.score || 0.5));
    }
  }
  return [...weights.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([area]) => area);
}

async function verifyDoi(paper) {
  if (!paper.doi) return { ...paper, verification: paper.pmid ? 'OPENALEX_PMID' : 'UNVERIFIED' };
  const endpoint = `https://api.crossref.org/works/${encodeURIComponent(paper.doi)}${CONTACT ? `?${CONTACT}` : ''}`;
  try {
    const payload = await fetchCrossrefJson(endpoint);
    const message = payload.message || {};
    const crossrefTitle = Array.isArray(message.title) ? message.title[0] : message.title;
    const published = message.published?.['date-parts']?.[0]?.[0]
      || message.publishedPrint?.['date-parts']?.[0]?.[0]
      || message.publishedOnline?.['date-parts']?.[0]?.[0];
    const titleScore = similarity(paper.title, crossrefTitle || '');
    const yearMatches = !published || Math.abs(Number(published) - Number(paper.year)) <= 1;
    return {
      ...paper,
      verification: titleScore >= 0.72 && yearMatches ? 'CROSSREF_VERIFIED' : 'CROSSREF_MISMATCH',
      crossref: { title: crossrefTitle, year: published, titleScore },
    };
  } catch (error) {
    return { ...paper, verification: 'CROSSREF_UNAVAILABLE', verificationError: error instanceof Error ? error.message : String(error) };
  }
}

let crossrefQueue = Promise.resolve();

function fetchCrossrefJson(url) {
  const task = crossrefQueue.then(async () => {
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 650));
    return fetchJson(url, {}, 5);
  });
  crossrefQueue = task.catch(() => undefined);
  return task;
}

function crossrefYear(item) {
  return item.published?.['date-parts']?.[0]?.[0]
    || item['published-print']?.['date-parts']?.[0]?.[0]
    || item['published-online']?.['date-parts']?.[0]?.[0]
    || item.issued?.['date-parts']?.[0]?.[0];
}

function crossrefAuthors(item) {
  return (item.author || [])
    .map((author) => [author.given, author.family].filter(Boolean).join(' ').trim())
    .filter(Boolean);
}

function compactAuthors(names) {
  return names.length <= 5 ? names.join(', ') : `${names.slice(0, 3).join(', ')}, et al.`;
}

function recordIdentityNames(record) {
  return [...new Set([
    ...(IDENTITY_ALIASES[record.slug] || []),
    record.official?.nameEn,
    record.officialResearcher?.nameEn,
    record.openAlex?.openAlex?.display_name,
    record.nameEn,
  ].filter(Boolean))];
}

function personNameParts(value = '') {
  const tokens = stripEnglishTitle(value)
    .replace(/\([^)]*\)/g, ' ')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z\s-]+/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean)
    .filter((token) => !['dvm', 'phd', 'md', 'msc'].includes(token));
  return { tokens, given: tokens[0] || '', family: tokens.at(-1) || '' };
}

function authorIdentityScore(expected, candidate) {
  const left = personNameParts(expected);
  const right = personNameParts(candidate);
  if (!left.given || !left.family || !right.given || !right.family) return similarity(expected, candidate);
  const familyScore = similarity(left.family, right.family);
  const givenScore = left.given.length === 1 || right.given.length === 1
    ? (left.given[0] === right.given[0] ? 0.82 : 0)
    : similarity(left.given, right.given);
  if (familyScore < 0.72 || givenScore < 0.55) return 0;
  return Math.min(1, familyScore * 0.55 + givenScore * 0.35 + similarity(expected, candidate) * 0.1);
}

function openAlexIdentityIsValid(record, official, result) {
  const candidate = result?.openAlex?.display_name;
  if (!candidate) return false;
  const names = [...new Set([
    ...(IDENTITY_ALIASES[record.slug] || []),
    official?.nameEn,
    record.nameEn,
  ].filter(Boolean))];
  return Math.max(...names.map((name) => authorIdentityScore(name, candidate))) >= 0.78;
}

async function verifyPubMedPaper(paper, pmid) {
  try {
    const email = RESEARCH_CONTACT ? `&email=${encodeURIComponent(RESEARCH_CONTACT)}` : '';
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json&tool=vetmock${email}`;
    const payload = await fetchJson(url, {}, 3);
    const result = payload.result?.[String(pmid)];
    if (!result?.title) return undefined;
    const titleScore = similarity(paper.title, result.title);
    if (titleScore < 0.72) return undefined;
    const year = Number(String(result.pubdate || '').match(/\d{4}/)?.[0]) || paper.year;
    const doi = result.articleids?.find((id) => id.idtype === 'doi')?.value;
    return {
      title: result.title.replace(/\.$/, ''),
      year,
      journal: result.fulljournalname || paper.journal || '',
      authors: compactAuthors((result.authors || []).map((author) => author.name).filter(Boolean)),
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      doi,
      pmid: String(pmid),
      verification: 'PUBMED_VERIFIED',
      titleScore,
    };
  } catch {
    return undefined;
  }
}

async function verifyFallbackPaper(paper, record) {
  const doi = (paper.doi || paper.url?.match(/(?:doi\.org\/|doi:\s*)(10\.\d{4,9}\/[^?#\s]+)/i)?.[1] || '').replace(/[).,;]+$/, '');
  if (doi) {
    const verified = await verifyDoi({ ...paper, doi });
    if (verified.verification === 'CROSSREF_VERIFIED') {
      return {
        title: verified.crossref.title || paper.title,
        year: verified.crossref.year || paper.year,
        journal: paper.journal || '',
        authors: paper.authors || '',
        url: `https://doi.org/${doi}`,
        doi,
        verification: 'CROSSREF_VERIFIED',
        titleScore: verified.crossref.titleScore,
      };
    }
  }

  const pmid = paper.pmid || paper.url?.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i)?.[1];
  if (pmid) {
    const verified = await verifyPubMedPaper(paper, pmid);
    if (verified) return verified;
  }

  const names = recordIdentityNames(record);
  const queryName = names[0] || '';
  const url = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(paper.title)}&query.author=${encodeURIComponent(queryName)}&rows=5&select=DOI,title,author,published,published-print,published-online,issued,container-title${CONTACT_SUFFIX}`;
  try {
    const payload = await fetchCrossrefJson(url);
    const ranked = (payload.message?.items || []).map((item) => {
      const title = item.title?.[0] || '';
      const year = crossrefYear(item);
      const authors = crossrefAuthors(item);
      const titleScore = similarity(paper.title, title);
      const authorScore = names.length && authors.length
        ? Math.max(...names.flatMap((name) => authors.map((author) => authorIdentityScore(name, author))))
        : 0;
      const yearScore = !paper.year || !year ? 1 : Math.max(0, 1 - Math.abs(Number(paper.year) - Number(year)) / 3);
      return { item, title, year, authors, titleScore, authorScore, yearScore, score: titleScore * 0.72 + authorScore * 0.2 + yearScore * 0.08 };
    }).sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (!best || best.titleScore < 0.72 || (best.authorScore < 0.58 && names.length)) return undefined;
    const matchedDoi = best.item.DOI;
    return {
      title: best.title,
      year: best.year || paper.year,
      journal: best.item['container-title']?.[0] || paper.journal || '',
      authors: compactAuthors(best.authors),
      url: matchedDoi ? `https://doi.org/${matchedDoi}` : paper.url,
      doi: matchedDoi,
      verification: 'CROSSREF_SEARCH_VERIFIED',
      titleScore: best.titleScore,
      authorScore: best.authorScore,
    };
  } catch {
    return undefined;
  }
}

function fallbackCandidates(record) {
  const all = [...(record.papers || []), ...(record.vaultPapers || [])];
  const unique = new Map();
  for (const paper of all) {
    const key = normalizeName(paper.title);
    if (!key || unique.has(key)) continue;
    unique.set(key, paper);
  }
  return [...unique.values()].slice(0, 8);
}

async function verifyFallbackPapers(record) {
  const verified = [];
  for (const paper of fallbackCandidates(record)) {
    const result = await verifyFallbackPaper(paper, record);
    if (!result) continue;
    if (verified.some((item) => normalizeName(item.title) === normalizeName(result.title))) continue;
    verified.push(result);
    if (verified.length === 3) break;
  }
  return verified;
}

function crossrefAuthorMatch(item, names) {
  const authors = item.author || [];
  let best = { score: 0, index: -1 };
  for (let index = 0; index < authors.length; index += 1) {
    const displayName = [authors[index].given, authors[index].family].filter(Boolean).join(' ');
    const score = Math.max(...names.map((name) => authorIdentityScore(name, displayName)));
    if (score > best.score) best = { score, index };
  }
  const target = authors[best.index];
  const affiliation = (target?.affiliation || []).map((entry) => entry.name).filter(Boolean);
  return {
    ...best,
    target,
    affiliation,
    isChula: affiliation.some((value) => /chulalongkorn/i.test(value)),
  };
}

function crossrefPaper(item, match) {
  const title = item.title?.[0] || '';
  const year = crossrefYear(item);
  const authors = crossrefAuthors(item);
  return {
    title,
    year,
    journal: item['container-title']?.[0] || '',
    authors: compactAuthors(authors),
    url: item.DOI ? `https://doi.org/${item.DOI}` : '',
    doi: item.DOI,
    type: item.type,
    citedByCount: item['is-referenced-by-count'] || 0,
    targetPosition: match.index === 0 ? 'first' : (match.index === authors.length - 1 ? 'last' : 'middle'),
    identityScore: match.score,
    affiliation: match.affiliation,
    verification: 'CROSSREF_AUTHOR_VERIFIED',
  };
}

async function discoverCrossrefPapers(record) {
  const names = recordIdentityNames(record);
  if (!names.length) return [];
  const select = 'DOI,title,author,published,published-print,published-online,issued,container-title,is-referenced-by-count,type';
  try {
    const items = [];
    for (const queryName of names.slice(0, 3)) {
      const url = `https://api.crossref.org/works?query.author=${encodeURIComponent(queryName)}&rows=30&select=${select}${CONTACT_SUFFIX}`;
      const payload = await fetchCrossrefJson(url);
      items.push(...(payload.message?.items || []));
    }
    const candidates = items
      .map((item) => ({ item, match: crossrefAuthorMatch(item, names) }))
      .filter(({ item, match }) => (
        item.DOI
        && item.title?.[0]
        && crossrefYear(item)
        && crossrefYear(item) <= CURRENT_YEAR
        // Author-only discovery is deliberately strict. Scores below 0.92
        // admitted unrelated people who shared an initial and a similar
        // surname (for example P. Bunnak and Wantanee Viriyasitavat).
        && match.score >= 0.92
        && ['journal-article', 'book-chapter', 'proceedings-article'].includes(item.type)
      ))
      .map(({ item, match }) => crossrefPaper(item, match));

    const byDoi = new Map();
    for (const paper of candidates) {
      const key = paper.doi.toLowerCase();
      const previous = byDoi.get(key);
      if (!previous || paper.identityScore > previous.identityScore) byDoi.set(key, paper);
    }
    const unique = [...byDoi.values()];
    const signature = [...unique].sort((a, b) => {
      const roleA = ['first', 'last'].includes(a.targetPosition) ? 60 : 0;
      const roleB = ['first', 'last'].includes(b.targetPosition) ? 60 : 0;
      return (roleB + Math.log1p(b.citedByCount) * 12) - (roleA + Math.log1p(a.citedByCount) * 12);
    });
    const recent = [...unique].sort((a, b) => b.year - a.year);
    const selected = [];
    for (const paper of [...signature.slice(0, 2), ...recent]) {
      if (selected.some((entry) => entry.doi.toLowerCase() === paper.doi.toLowerCase())) continue;
      selected.push(paper);
      if (selected.length === 3) break;
    }
    return selected;
  } catch (error) {
    return [{ error: error instanceof Error ? error.message : String(error) }];
  }
}

function validDiscoveredPapers(papers = []) {
  return papers.filter((paper) => !paper.error && paper.identityScore >= 0.92);
}

async function readExistingCache() {
  try {
    return JSON.parse(await readFile(CACHE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
}

async function main() {
  const refresh = process.argv.includes('--refresh');
  const skipOpenAlex = process.argv.includes('--skip-openalex');
  const refreshFallback = process.argv.includes('--refresh-fallback');
  const refreshDiscovery = process.argv.includes('--refresh-discovery');
  const retryEmptyDiscovery = process.argv.includes('--retry-empty-discovery');
  const retryLowDiscovery = process.argv.includes('--retry-low-discovery');
  const slugArg = process.argv.find((arg) => arg.startsWith('--slug='))?.split('=')[1];
  const previous = refresh ? {} : await readExistingCache();
  const vaultRecords = await loadVaultRecords();
  let records = mergeAppRecords(vaultRecords);
  if (slugArg) records = records.filter((record) => record.slug === slugArg);

  const { official, failures: rosterFailures } = await collectOfficialRoster();
  const rosterResearcherUrls = official.map((row) => row.researcherUrl).filter(Boolean);
  const scannedResearcherUrls = Array.from(
    { length: 150 },
    (_, index) => `https://vet.chula.ac.th/researcher_info/${index + 1}`,
  );
  const researcherUrls = [...new Set([...rosterResearcherUrls, ...scannedResearcherUrls])];
  const researcherProfiles = { ...(previous.researcherProfiles || {}) };
  const pendingResearcherUrls = researcherUrls.filter((url) => refresh || !researcherProfiles[url]);
  const researcherResults = await pooled(pendingResearcherUrls, 6, fetchResearcherPair);
  pendingResearcherUrls.forEach((url, index) => { researcherProfiles[url] = researcherResults[index]; });

  const { officialBySlug, assignments, unmatchedOfficial } = attachOfficialSources(records, official, researcherProfiles);
  const researcherBySlug = attachResearcherProfiles(records, researcherProfiles);
  const openAlexBySlug = { ...(previous.openAlexBySlug || {}) };
  const pendingRecords = skipOpenAlex ? [] : records.filter((record) => (
    refresh
    || !openAlexBySlug[record.slug]
    || openAlexBySlug[record.slug]?.error
    || openAlexBySlug[record.slug]?.status === 'unmatched'
    || !openAlexIdentityIsValid(record, officialBySlug[record.slug] || researcherBySlug[record.slug], openAlexBySlug[record.slug])
  ));
  const authorResults = await pooled(pendingRecords, 4, async (record) => {
    const identitySource = officialBySlug[record.slug] || researcherBySlug[record.slug];
    const author = await findOpenAlexAuthor(record, identitySource);
    if (!author.id) return author;
    const works = await fetchAuthorWorks(author.id);
    const candidates = selectCandidatePapers(works, author.id);
    const verifiedPapers = await pooled(candidates, 3, verifyDoi);
    return {
      ...author,
      areas: areasFromWorks(works),
      papers: verifiedPapers,
      worksSampled: works.length,
    };
  });
  pendingRecords.forEach((record, index) => { openAlexBySlug[record.slug] = authorResults[index]; });

  let reportRecords = records.map((record) => {
    const officialIdentity = officialBySlug[record.slug] || researcherBySlug[record.slug];
    const cachedOpenAlex = openAlexBySlug[record.slug];
    const openAlex = openAlexIdentityIsValid(record, officialIdentity, cachedOpenAlex)
      ? cachedOpenAlex
      : (cachedOpenAlex ? { ...cachedOpenAlex, status: 'identity-mismatch', papers: [], invalidDisplayName: cachedOpenAlex.openAlex?.display_name } : cachedOpenAlex);
    return {
      ...record,
      official: officialBySlug[record.slug],
      officialResearcher: researcherBySlug[record.slug],
      openAlex,
    };
  });
  const fallbackPapersBySlug = { ...(previous.fallbackPapersBySlug || {}) };
  const pendingFallback = reportRecords.filter((record) => (
    (record.openAlex?.papers || []).filter((paper) => paper.verification === 'CROSSREF_VERIFIED').length < 3
    && (refreshFallback || !Object.hasOwn(fallbackPapersBySlug, record.slug))
  ));
  const fallbackResults = await pooled(pendingFallback, 3, verifyFallbackPapers);
  pendingFallback.forEach((record, index) => { fallbackPapersBySlug[record.slug] = fallbackResults[index]; });
  reportRecords = reportRecords.map((record) => ({
    ...record,
    fallbackPapers: fallbackPapersBySlug[record.slug] || [],
  }));
  const discoveredPapersBySlug = { ...(previous.discoveredPapersBySlug || {}) };
  const pendingDiscovery = reportRecords.filter((record) => {
    const verifiedOpenAlex = (record.openAlex?.papers || []).filter((paper) => paper.verification === 'CROSSREF_VERIFIED').length;
    const verifiedFallback = (record.fallbackPapers || []).filter((paper) => ['CROSSREF_VERIFIED', 'CROSSREF_SEARCH_VERIFIED', 'PUBMED_VERIFIED'].includes(paper.verification)).length;
    const currentDiscovery = validDiscoveredPapers(discoveredPapersBySlug[record.slug] || []);
    return verifiedOpenAlex + verifiedFallback < 3
      && (refreshDiscovery
        || !Object.hasOwn(discoveredPapersBySlug, record.slug)
        || (retryEmptyDiscovery && currentDiscovery.length === 0)
        || (retryLowDiscovery && currentDiscovery.length < 3));
  });
  const discoveryResults = await pooled(pendingDiscovery, 3, discoverCrossrefPapers);
  pendingDiscovery.forEach((record, index) => { discoveredPapersBySlug[record.slug] = discoveryResults[index]; });
  reportRecords = reportRecords.map((record) => ({
    ...record,
    discoveredPapers: validDiscoveredPapers(discoveredPapersBySlug[record.slug] || []),
  }));
  const cache = {
    generatedAt: new Date().toISOString(),
    sources: {
      official: 'https://vet.chula.ac.th',
      openAlex: 'https://openalex.org',
      crossref: 'https://www.crossref.org',
    },
    rosterFailures,
    officialCount: official.length,
    vaultCount: vaultRecords.length,
    recordCount: records.length,
    assignmentCount: assignments.length,
    unmatchedOfficial,
    researcherProfiles,
    researcherBySlug,
    openAlexBySlug,
    fallbackPapersBySlug,
    discoveredPapersBySlug,
    records: reportRecords,
  };
  await saveCache(cache);

  const matchedHigh = reportRecords.filter((record) => record.openAlex?.status === 'matched-high').length;
  const matchedReview = reportRecords.filter((record) => record.openAlex?.status === 'matched-review').length;
  const unmatched = reportRecords.filter((record) => record.openAlex?.status === 'unmatched').length;
  const verifiedPapers = reportRecords.flatMap((record) => record.openAlex?.papers || []).filter((paper) => paper.verification === 'CROSSREF_VERIFIED').length;
  const mismatchedPapers = reportRecords.flatMap((record) => record.openAlex?.papers || []).filter((paper) => paper.verification === 'CROSSREF_MISMATCH').length;
  const fallbackVerified = reportRecords.flatMap((record) => record.fallbackPapers || []).length;
  const discoveredVerified = reportRecords.flatMap((record) => record.discoveredPapers || []).length;

  console.log(`Records: ${records.length} (vault ${vaultRecords.length}, app ${ALL_INSTRUCTORS.length})`);
  console.log(`Official roster rows: ${official.length}; assigned: ${Object.keys(officialBySlug).length}; unmatched rows: ${unmatchedOfficial.length}`);
  console.log(`Official researcher profiles matched to records: ${Object.keys(researcherBySlug).length}`);
  console.log(`OpenAlex: high ${matchedHigh}; review ${matchedReview}; unmatched ${unmatched}`);
  console.log(`Selected papers: Crossref verified ${verifiedPapers}; mismatched ${mismatchedPapers}`);
  console.log(`Fallback papers independently verified: ${fallbackVerified}`);
  console.log(`Crossref author-verified papers: ${discoveredVerified}`);
  console.log(`Cache: ${CACHE_FILE.pathname}`);

  if (unmatchedOfficial.length) {
    console.log('\nUnmatched official rows');
    for (const row of unmatchedOfficial) console.log(`- ${row.nameEn || row.nameTh} | ${row.email || 'no email'}`);
  }
  if (matchedReview || unmatched) {
    console.log('\nOpenAlex review queue');
    for (const record of reportRecords.filter((item) => item.openAlex?.status !== 'matched-high')) {
      console.log(`- ${record.slug}: ${record.openAlex?.status || 'error'} (${record.openAlex?.query || record.openAlex?.reason || record.openAlex?.error || ''})`);
    }
  }
}

await main();
