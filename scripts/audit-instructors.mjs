#!/usr/bin/env node

// Compare VetMock's instructor directory with the current public department
// rosters from the Faculty of Veterinary Science, Chulalongkorn University.
//
// This is intentionally a network audit, not a CI gate: the faculty website
// can be slow or temporarily unavailable. Run with:
//   npm run audit:instructors
//   npm run audit:instructors -- --json

import { ALL_INSTRUCTORS } from '../src/data/instructors.js';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const OFFICIAL_BASE = 'https://vet.chula.ac.th';
const VERIFIED_AT = new Date().toISOString().slice(0, 10);

export const DEPARTMENT_PAGES = [
  { id: 'anatomy', label: 'Department of Anatomy', path: 'anatomy' },
  { id: 'microbiology', label: 'Department of Microbiology', path: 'microbiology' },
  { id: 'pathology', label: 'Department of Pathology', path: 'pathology-unit' },
  { id: 'parasitology', label: 'Parasitology Unit', path: 'parasitology-unit' },
  { id: 'pharmacology', label: 'Department of Pharmacology', path: 'pharmacology' },
  { id: 'surgery', label: 'Department of Veterinary Surgery', path: 'surgery' },
  { id: 'biochemistry', label: 'Biochemistry Unit', path: 'biochemistry-unit' },
  { id: 'physiology', label: 'Physiology Unit', path: 'physiology-unit' },
  { id: 'animal-husbandry', label: 'Department of Animal Husbandry', path: 'animal-husbandry' },
  { id: 'veterinary-public-health', label: 'Department of Veterinary Public Health', path: 'veterinary-public-health' },
  { id: 'reproduction', label: 'Department of Obstetrics, Gynaecology and Reproduction', path: 'obstetrics-gynaecology-and-reproduction-ntez' },
  { id: 'medicine', label: 'Department of Veterinary Medicine', path: 'medicine-uivn' },
];

const ACADEMIC_POSITION = /professor|lecturer|instructor|ศาสตราจารย์|รองศาสตราจารย์|ผู้ช่วยศาสตราจารย์|อาจารย์/i;

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
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

function normalizeName(value = '') {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\b(?:professor|prof|associate|assoc|assistant|asst|lecturer|instructor|doctor|dr|dvm|phd)\b/g, '')
    .replace(/[^a-z0-9ก-๙]+/g, '');
}

function normalizeEmail(value = '') {
  return value.trim().toLowerCase();
}

function academicRank(value = '') {
  const position = String(value).toLowerCase();
  if (/associate professor|assoc\.?\s*prof|รองศาสตราจารย์|รศ\.?/iu.test(position)) return 'associate-professor';
  if (/assistant professor|asst\.?\s*prof|ผู้ช่วยศาสตราจารย์|ผศ\.?/iu.test(position)) return 'assistant-professor';
  if (/(?:^|\s)professor|(?:^|\s)prof\.?|ศาสตราจารย์|(?:^|\s)ศ\.?/iu.test(position)) return 'professor';
  if (/lecturer|instructor|อาจารย์|(?:^|\s)อ\.?/iu.test(position)) return 'instructor';
  return undefined;
}

function absoluteUrl(value, pageUrl) {
  if (!value) return undefined;
  try {
    return new URL(value, pageUrl).href;
  } catch {
    return undefined;
  }
}

function extractName(titleHtml) {
  const lines = textFromHtml(titleHtml)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.at(-1) || '';
}

function extractAcademicTitle(titleHtml) {
  const lines = textFromHtml(titleHtml)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 1 ? lines.slice(0, -1).join(' ') : '';
}

function parsePersonnelCards(html, page, locale, pageUrl) {
  const cards = [];
  const cardPattern = /<div\s+class=["']grid-detail["']\s*>([\s\S]*?)<\/div>/gi;

  for (const match of html.matchAll(cardPattern)) {
    const body = match[1];
    const titleHtml = body.match(/<h5[^>]*class=["'][^"']*profile-title[^"']*["'][^>]*>([\s\S]*?)<\/h5>/i)?.[1] || '';
    const positionHtml = body.match(/<p[^>]*class=["'][^"']*profile-position[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
    const email = decodeHtml(body.match(/href=["']mailto:([^"']+)["']/i)?.[1] || '').trim();
    const phone = decodeHtml(body.match(/href=["']tel:([^"']+)["']/i)?.[1] || '').trim();
    const name = extractName(titleHtml);
    const academicTitle = extractAcademicTitle(titleHtml);
    const position = textFromHtml(positionHtml);

    if (!name || !ACADEMIC_POSITION.test(`${textFromHtml(titleHtml)} ${position}`)) continue;

    const beforeCardDetail = html.slice(0, match.index);
    const profileItemStarts = [...beforeCardDetail.matchAll(
      /<div[^>]+class=["'][^"']*\bprofile-item\b[^"']*["'][^>]*>/gi,
    )];
    const profileItemStart = profileItemStarts.at(-1)?.index ?? Math.max(0, match.index - 2600);
    const cardContext = html.slice(profileItemStart, match.index);
    const researcherMatches = [...cardContext.matchAll(/href=["']([^"']*researcher_info\/\d+)["']/gi)];
    const researcherUrl = absoluteUrl(researcherMatches.at(-1)?.[1], pageUrl);

    cards.push({
      departmentId: page.id,
      department: page.label,
      locale,
      name,
      academicTitle,
      position,
      email: email && email !== '-' ? email : undefined,
      phone: phone && phone !== '-' ? phone : undefined,
      officialUrl: pageUrl,
      researcherUrl,
      verifiedAt: VERIFIED_AT,
    });
  }

  return cards;
}

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'VetMock instructor directory audit/1.0' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 750 * attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

function mergeLocales(englishCards, thaiCards) {
  const thaiByEmail = new Map(thaiCards.filter((row) => row.email).map((row) => [normalizeEmail(row.email), row]));
  const thaiByResearcher = new Map(thaiCards.filter((row) => row.researcherUrl).map((row) => [row.researcherUrl, row]));
  const usedThai = new Set();

  const merged = englishCards.map((row) => {
    const thai = (row.email && thaiByEmail.get(normalizeEmail(row.email)))
      || (row.researcherUrl && thaiByResearcher.get(row.researcherUrl));
    if (thai) usedThai.add(thai);
    return {
      ...row,
      nameEn: row.name,
      nameTh: thai?.name,
      academicTitleEn: row.academicTitle,
      academicTitleTh: thai?.academicTitle,
      positionEn: row.position,
      positionTh: thai?.position,
      officialUrlTh: thai?.officialUrl,
    };
  });

  for (const thai of thaiCards) {
    if (usedThai.has(thai)) continue;
    merged.push({
      ...thai,
      nameEn: undefined,
      nameTh: thai.name,
      academicTitleEn: undefined,
      academicTitleTh: thai.academicTitle,
      positionEn: undefined,
      positionTh: thai.position,
      officialUrlTh: thai.officialUrl,
    });
  }

  return merged;
}

function findAppMatch(official, appRows) {
  if (official.email) {
    const emailMatch = appRows.find((row) => normalizeEmail(row.email) === normalizeEmail(official.email));
    if (emailMatch) return emailMatch;
  }
  return appRows.find((row) => {
    const candidates = [row.nameEn, row.nameTh, ...(row.aliases || [])].filter(Boolean).map(normalizeName);
    const exactMatch = (official.nameEn && candidates.includes(normalizeName(official.nameEn)))
      || (official.nameTh && candidates.includes(normalizeName(official.nameTh)));
    if (exactMatch) return true;

    // A few English roster cards expose only the given name. In that case a
    // full Thai-name match is unavailable in the merged row, so accept the
    // unique full app name that begins with that given name.
    const officialEn = normalizeName(official.nameEn);
    if (!officialEn || officialEn.length < 5 || /[ก-๙]/u.test(official.nameEn || '')) return false;
    return candidates.some((candidate) => candidate.startsWith(officialEn));
  });
}

function officialEnglishNameMatchesApp(officialName, app) {
  const official = normalizeName(officialName);
  if (!official) return false;
  const officialIsSingleToken = String(officialName).trim().split(/\s+/).length === 1;
  const candidates = [app.nameEn, ...(app.aliases || [])]
    .filter(Boolean)
    .map(normalizeName);
  return candidates.some((candidate) => candidate === official
    || (official.length >= 5 && candidate.startsWith(official))
    || (officialIsSingleToken && official.length >= 5 && candidate.endsWith(official))
    || (candidate.length >= 5 && official.startsWith(candidate)));
}

function findThaiPageUrl(englishHtml, fallbackUrl) {
  const match = englishHtml.match(/<a[^>]+href=["']([^"']+)["'][^>]*>\s*TH\s*<\/a>/i);
  return absoluteUrl(match?.[1], fallbackUrl);
}

export async function collectOfficialRoster() {
  const pageResults = [];
  const failures = [];

  for (const page of DEPARTMENT_PAGES) {
    const enUrl = `${OFFICIAL_BASE}/en/department/${page.path}`;
    const enResult = await Promise.allSettled([fetchText(enUrl)]).then(([result]) => result);
    if (enResult.status === 'rejected') {
      failures.push({ page: page.id, locale: 'en', error: enResult.reason instanceof Error ? enResult.reason.message : String(enResult.reason) });
      continue;
    }
    const thUrl = findThaiPageUrl(enResult.value, enUrl);
    const thResult = thUrl
      ? await Promise.allSettled([fetchText(thUrl)]).then(([result]) => result)
      : { status: 'rejected', reason: new Error('Thai-language page link not found') };
    if (thResult.status === 'rejected') {
      failures.push({ page: page.id, locale: 'th', error: thResult.reason instanceof Error ? thResult.reason.message : String(thResult.reason) });
    }
    const english = parsePersonnelCards(enResult.value, page, 'en', enUrl);
    const thai = thResult.status === 'fulfilled' ? parsePersonnelCards(thResult.value, page, 'th', thUrl) : [];
    pageResults.push({ page, english, thai, merged: mergeLocales(english, thai) });
  }

  const official = pageResults.flatMap((result) => result.merged);
  return { official, pageResults, failures };
}

async function main() {
  const { official, pageResults, failures } = await collectOfficialRoster();
  const matched = [];
  const missingFromApp = [];
  for (const row of official) {
    const app = findAppMatch(row, ALL_INSTRUCTORS);
    if (app) matched.push({ official: row, app });
    else missingFromApp.push(row);
  }

  const matchedAppSlugs = new Set(matched.map(({ app }) => app.slug));
  const notOnOfficialRoster = ALL_INSTRUCTORS.filter((row) => !matchedAppSlugs.has(row.slug));
  const nameVariants = matched
    .filter(({ official: row, app }) => row.nameEn
      && normalizeName(row.nameEn) !== normalizeName(app.nameEn)
      && officialEnglishNameMatchesApp(row.nameEn, app))
    .map(({ official: row, app }) => ({ slug: app.slug, canonical: app.nameEn, roster: row.nameEn }));
  const nameMismatches = matched
    .filter(({ official: row, app }) => row.nameEn && !officialEnglishNameMatchesApp(row.nameEn, app))
    .map(({ official: row, app }) => ({ slug: app.slug, app: app.nameEn, official: row.nameEn }));
  const positionMismatches = matched
    .filter(({ official: row, app }) => {
      const appRank = academicRank(app.position);
      const officialRank = academicRank(row.academicTitleTh)
        || academicRank(row.academicTitleEn)
        || academicRank(row.positionEn);
      return appRank && officialRank && appRank !== officialRank;
    })
    .map(({ official: row, app }) => ({
      slug: app.slug,
      app: app.position,
      official: row.academicTitleTh || row.academicTitleEn || row.positionEn,
    }));

  const report = {
    generatedAt: new Date().toISOString(),
    officialSource: OFFICIAL_BASE,
    departmentCounts: Object.fromEntries(pageResults.map(({ page, merged }) => [page.id, merged.length])),
    officialCount: official.length,
    appCount: ALL_INSTRUCTORS.length,
    matchedCount: matched.length,
    missingFromApp,
    notOnOfficialRoster: notOnOfficialRoster.map(({ slug, nameEn, department, position }) => ({ slug, nameEn, department, position })),
    nameVariants,
    nameMismatches,
    positionMismatches,
    failures,
    officialRoster: official,
  };

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`Official academic roster: ${official.length}`);
  console.log(`VetMock profiles: ${ALL_INSTRUCTORS.length}`);
  console.log(`Matched: ${matched.length}`);
  console.log(`Missing from VetMock: ${missingFromApp.length}`);
  console.log(`VetMock-only / external / stale: ${notOnOfficialRoster.length}`);
  console.log(`Accepted roster/name variants: ${nameVariants.length}`);
  console.log(`Name mismatches: ${nameMismatches.length}`);
  console.log(`Position mismatches: ${positionMismatches.length}`);
  if (failures.length) console.log(`Fetch failures: ${failures.length}`);

  if (missingFromApp.length) {
    console.log('\nMissing from VetMock');
    for (const row of missingFromApp) console.log(`- ${row.nameEn || row.nameTh} | ${row.department} | ${row.positionEn || row.positionTh}`);
  }
  if (nameMismatches.length) {
    console.log('\nName mismatches');
    for (const row of nameMismatches) console.log(`- ${row.slug}: ${row.app} -> ${row.official}`);
  }
  if (nameVariants.length) {
    console.log('\nAccepted roster/name variants');
    for (const row of nameVariants) console.log(`- ${row.slug}: ${row.canonical} | roster: ${row.roster}`);
  }
  if (positionMismatches.length) {
    console.log('\nAcademic-title differences');
    for (const row of positionMismatches) console.log(`- ${row.slug}: ${row.app} | roster: ${row.official}`);
  }
  if (failures.length) {
    console.log('\nFetch failures');
    for (const row of failures) console.log(`- ${row.page} (${row.locale}): ${row.error}`);
  }
}

const isDirectRun = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) await main();
