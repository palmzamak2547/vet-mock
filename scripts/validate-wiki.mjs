#!/usr/bin/env node
// ============================================================
// validate-wiki.mjs — Read-Only Wiki Validator & Link Inspector
// ============================================================
// Usage: node scripts/validate-wiki.mjs
//
// Guaranteed 100% Read-Only & Deterministic.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sectionContentHash } from './lib/wiki-section-hash.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '..');
export const WIKI_DIR = path.join(ROOT_DIR, 'wiki');

// Helper: Extract YAML frontmatter
export function parseFrontmatter(content, filePath) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: null, body: content };
  const rawYaml = match[1];
  const body = content.slice(match[0].length);
  const data = {};
  
  for (const line of rawYaml.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let val = trimmed.slice(colonIdx + 1).trim();
    
    // Clean quotes or brackets
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    data[key] = val;
  }
  return { data, body };
}

// Helper: Validate ISO-8601 full-date (YYYY-MM-DD)
export function isValidIso8601Date(str) {
  if (typeof str !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

// Helper: Strip code blocks before checking anchors and links
export function stripCodeBlocks(str) {
  return str
    .replace(/```[\s\S]*?```/g, '') // Fenced code blocks
    .replace(/`[^`\n]+`/g, '');      // Inline code snippets
}

// Helper: Parse <!-- wiki-section-meta ... --> block
export function parseSectionMetaBlock(blockContent) {
  const lines = blockContent.split(/\r?\n/);
  const data = { sectionSourceRefs: [] };
  let currentRef = null;
  let inReview = false;

  for (const line of lines) {
    const rawTrimmed = line.trim();
    if (!rawTrimmed || rawTrimmed.startsWith('#') || rawTrimmed.startsWith('<!--') || rawTrimmed.startsWith('-->')) continue;

    if (rawTrimmed === 'sectionSourceRefs:') {
      inReview = false;
      continue;
    }

    if (rawTrimmed === 'review:') {
      inReview = true;
      if (!data.review) data.review = {};
      continue;
    }

    if (rawTrimmed.startsWith('- ')) {
      inReview = false;
      currentRef = {};
      data.sectionSourceRefs.push(currentRef);
      const subLine = rawTrimmed.slice(2).trim();
      const colonIdx = subLine.indexOf(':');
      if (colonIdx !== -1) {
        const k = subLine.slice(0, colonIdx).trim();
        let v = subLine.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        currentRef[k] = v;
      }
    } else if (!inReview && (rawTrimmed.startsWith('sourceId:') || rawTrimmed.startsWith('title:') || rawTrimmed.startsWith('locator:') || rawTrimmed.startsWith('derivedFrom:') || rawTrimmed.startsWith('evidenceStatus:') || rawTrimmed.startsWith('sourceAvailability:'))) {
      const colonIdx = rawTrimmed.indexOf(':');
      if (colonIdx !== -1 && currentRef) {
        const k = rawTrimmed.slice(0, colonIdx).trim();
        let v = rawTrimmed.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        currentRef[k] = v;
      }
    } else if (inReview) {
      const colonIdx = rawTrimmed.indexOf(':');
      if (colonIdx !== -1) {
        const k = rawTrimmed.slice(0, colonIdx).trim();
        let rawV = rawTrimmed.slice(colonIdx + 1).trim();
        let v = rawV;
        if (v === 'null' || v === '') v = null;
        else v = v.replace(/^['"]|['"]$/g, '');
        data.review[k] = v;
      }
    } else {
      const colonIdx = rawTrimmed.indexOf(':');
      if (colonIdx !== -1) {
        const k = rawTrimmed.slice(0, colonIdx).trim();
        let rawV = rawTrimmed.slice(colonIdx + 1).trim();
        let v;
        if (rawV === 'true') v = true;
        else if (rawV === 'false') v = false;
        else v = rawV.replace(/^['"]|['"]$/g, '');
        data[k] = v;
      }
    }
  }
  return data;
}

// 1. Scan Wiki Pages
export function scanWikiPages(dir, errors = [], warnings = [], rootDir = ROOT_DIR) {
  let pages = new Map(); // pageId -> { filePath, frontmatter, anchors, content }
  
  if (!fs.existsSync(dir)) {
    errors.push(`Wiki directory missing at ${dir}`);
    return pages;
  }

  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data, body } = parseFrontmatter(content, fullPath);
        const relPath = path.relative(rootDir, fullPath);
        
        if (!data || !data.id) {
          warnings.push(`[${relPath}] Missing YAML frontmatter or 'id' field`);
          continue;
        }
        
        const pageId = data.id;
        if (pages.has(pageId)) {
          errors.push(`Duplicate pageId '${pageId}' found in [${relPath}] and [${pages.get(pageId).relPath}]`);
        }

        // Strip code blocks so example snippet anchors in SCHEMA.md don't trigger false errors
        const cleanContent = stripCodeBlocks(content);

        // Extract Anchors & Section Metadata
        const anchors = new Set();
        const sectionMetas = new Map();

        const htmlAnchorRegex = /<a\s+(?:[^>]*?\s+)?id=["']([^"']+)["']/gi;
        let aMatch;
        while ((aMatch = htmlAnchorRegex.exec(cleanContent)) !== null) {
          const aId = aMatch[1];
          if (anchors.has(aId)) {
            errors.push(`[${relPath}] Duplicate anchorId '${aId}'`);
          }
          anchors.add(aId);

          // Find corresponding <!-- wiki-section-meta ... --> block in the text following this anchor
          const afterAnchorIndex = htmlAnchorRegex.lastIndex;
          const remainingContent = cleanContent.slice(afterAnchorIndex);
          
          // Match the first <!-- wiki-section-meta ... --> before the next <a id=...
          const nextAnchorMatch = remainingContent.match(/<a\s+(?:[^>]*?\s+)?id=["']/i);
          const searchWindow = nextAnchorMatch ? remainingContent.slice(0, nextAnchorMatch.index) : remainingContent.slice(0, 5000);

          const metaMatch = searchWindow.match(/<!--\s*wiki-section-meta([\s\S]*?)-->/);
          
          if (metaMatch) {
            const metaBlockContent = metaMatch[1];
            const parsedMeta = parseSectionMetaBlock(metaBlockContent);
            
            if (!parsedMeta || !parsedMeta.anchorId) {
              errors.push(`[${relPath}] Unparseable or malformed <!-- wiki-section-meta --> for anchorId '${aId}'`);
            } else if (parsedMeta.anchorId !== aId) {
              errors.push(`[${relPath}] Section meta anchorId '${parsedMeta.anchorId}' does not match anchor '${aId}'`);
            } else {
              sectionMetas.set(aId, parsedMeta);

              // Dynamic Lifecycle State Matrix Validation for domain pages
              if (data.domainId) {
                // 1. Allowed Page Statuses
                const ALLOWED_PAGE_STATUSES = ['draft', 'reviewed', 'approved'];
                if (!ALLOWED_PAGE_STATUSES.includes(data.status)) {
                  errors.push(`[${relPath}] Invalid page status '${data.status}'`);
                }

                // 2. Allowed Section Statuses
                const ALLOWED_SECTION_STATUSES = ['draft', 'reviewed', 'approved'];
                if (!ALLOWED_SECTION_STATUSES.includes(parsedMeta.sectionStatus)) {
                  errors.push(`[${relPath}] Section '${aId}' has invalid sectionStatus '${parsedMeta.sectionStatus}'`);
                }

                // Course Notes Approval Baseline Check
                const isCourseNotesApproved = (
                  parsedMeta.sourceApprovalBasis === 'approved-course-notes' &&
                  typeof parsedMeta.sourceApprovalRef === 'string' &&
                  parsedMeta.sourceApprovalRef.startsWith('src/data/notes-') &&
                  parsedMeta.sourceApprovalStatus === 'approved'
                );

                if (parsedMeta.sourceApprovalBasis === 'approved-course-notes') {
                  if (!parsedMeta.sourceApprovalRef || typeof parsedMeta.sourceApprovalRef !== 'string' || !parsedMeta.sourceApprovalRef.startsWith('src/data/notes-')) {
                    errors.push(`[${relPath}] Section '${aId}' with sourceApprovalBasis 'approved-course-notes' requires valid sourceApprovalRef starting with 'src/data/notes-'`);
                  }
                  if (parsedMeta.sourceApprovalStatus !== 'approved') {
                    errors.push(`[${relPath}] Section '${aId}' with sourceApprovalBasis 'approved-course-notes' requires sourceApprovalStatus 'approved'`);
                  }
                }

                // Helper to reject AI/LLM identities as reviewedBy
                const isAiName = (name) => {
                  if (!name || typeof name !== 'string') return false;
                  const n = name.trim().toLowerCase();
                  return (
                    n === 'ai' ||
                    n === 'bot' ||
                    n === 'antigravity' ||
                    n === 'claude' ||
                    n === 'llm' ||
                    n === 'gpt' ||
                    n === 'chatgpt' ||
                    n === 'openai' ||
                    n.includes(' ai ') ||
                    n.startsWith('ai ') ||
                    n.endsWith(' ai')
                  );
                };

                // 3. Strict Boolean Check for mappingEligible
                if (typeof parsedMeta.mappingEligible !== 'boolean') {
                  errors.push(`[${relPath}] Section '${aId}' mappingEligible must be a strict boolean (true or false)`);
                }

                // 4. Section Source Refs Array Check
                if (!Array.isArray(parsedMeta.sectionSourceRefs) || parsedMeta.sectionSourceRefs.length === 0) {
                  errors.push(`[${relPath}] Section '${aId}' must have non-empty sectionSourceRefs`);
                }

                // 5. Page Status: Draft Rules
                if (data.status === 'draft') {
                  if (parsedMeta.mappingEligible !== false) {
                    errors.push(`[${relPath}] Section '${aId}' on draft page must have mappingEligible: false`);
                  }
                  if (parsedMeta.sectionStatus !== 'draft') {
                    errors.push(`[${relPath}] Section '${aId}' on draft page must have sectionStatus 'draft'`);
                  }
                }

                // 6. Page Status: Reviewed Rules
                if (data.status === 'reviewed') {
                  if (parsedMeta.mappingEligible !== false) {
                    errors.push(`[${relPath}] Section '${aId}' on reviewed page must have mappingEligible: false`);
                  }
                  if (!['draft', 'reviewed'].includes(parsedMeta.sectionStatus)) {
                    errors.push(`[${relPath}] Section '${aId}' on reviewed page cannot have sectionStatus '${parsedMeta.sectionStatus}'`);
                  }
                }

                // 7. Section Status: Reviewed Requirements
                if (parsedMeta.sectionStatus === 'reviewed') {
                  if (!Array.isArray(parsedMeta.sectionSourceRefs) || (parsedMeta.sectionSourceRefs.some(r => r.sourceAvailability === 'note-only') && !isCourseNotesApproved)) {
                    errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'reviewed' requires sourceAvailability 'original-verified'`);
                  }
                  if (!parsedMeta.review) {
                    errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'reviewed' is missing review metadata`);
                  } else {
                    const { decision, reviewedBy, reviewedAt, approvedAt } = parsedMeta.review;
                    if (!['REVIEWED', 'APPROVED'].includes(decision)) {
                      errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'reviewed' requires review.decision 'REVIEWED' or 'APPROVED'`);
                    }
                    if (reviewedBy && isAiName(reviewedBy)) {
                      errors.push(`[${relPath}] Section '${aId}' review.reviewedBy cannot specify an AI/LLM identity`);
                    } else if (!isCourseNotesApproved && (!reviewedBy || typeof reviewedBy !== 'string' || reviewedBy.trim() === '')) {
                      errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'reviewed' requires non-empty review.reviewedBy`);
                    }
                    const effDate = reviewedAt || approvedAt;
                    if (!isValidIso8601Date(effDate)) {
                      errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'reviewed' requires valid ISO-8601 review.reviewedAt or approvedAt (YYYY-MM-DD)`);
                    }
                  }
                }

                // 8. Section Status: Approved Requirements
                if (parsedMeta.sectionStatus === 'approved') {
                  if (data.status !== 'approved') {
                    errors.push(`[${relPath}] Section '${aId}' sectionStatus 'approved' requires page status 'approved'`);
                  }
                  if (!Array.isArray(parsedMeta.sectionSourceRefs) || (parsedMeta.sectionSourceRefs.some(r => r.sourceAvailability === 'note-only') && !isCourseNotesApproved)) {
                    errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'approved' requires sourceAvailability 'original-verified'`);
                  }
                  if (!parsedMeta.review) {
                    errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'approved' is missing review metadata`);
                  } else {
                    const { decision, reviewedBy, reviewedAt, approvedAt, approvalScope } = parsedMeta.review;
                    if (decision !== 'APPROVED') {
                      errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'approved' requires review.decision 'APPROVED'`);
                    }
                    if (reviewedBy && isAiName(reviewedBy)) {
                      errors.push(`[${relPath}] Section '${aId}' review.reviewedBy cannot specify an AI/LLM identity`);
                    } else if (!isCourseNotesApproved && (!reviewedBy || typeof reviewedBy !== 'string' || reviewedBy.trim() === '')) {
                      errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'approved' requires non-empty review.reviewedBy`);
                    }
                    const effDate = reviewedAt || approvedAt;
                    if (!isValidIso8601Date(effDate)) {
                      errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'approved' requires valid ISO-8601 review.reviewedAt or approvedAt (YYYY-MM-DD)`);
                    }
                    if (!approvalScope || typeof approvalScope !== 'string' || approvalScope.trim() === '') {
                      errors.push(`[${relPath}] Section '${aId}' with sectionStatus 'approved' requires non-empty review.approvalScope`);
                    }
                  }
                }

                // 9. mappingEligible: true Requirements
                if (parsedMeta.mappingEligible === true) {
                  if (data.status !== 'approved') {
                    errors.push(`[${relPath}] Section '${aId}' mappingEligible: true requires page status 'approved'`);
                  }
                  if (parsedMeta.sectionStatus !== 'approved') {
                    errors.push(`[${relPath}] Section '${aId}' mappingEligible: true requires sectionStatus 'approved'`);
                  }
                  if (!Array.isArray(parsedMeta.sectionSourceRefs) || (parsedMeta.sectionSourceRefs.some(r => r.sourceAvailability === 'note-only') && !isCourseNotesApproved)) {
                    errors.push(`[${relPath}] Section '${aId}' mappingEligible: true requires sourceAvailability 'original-verified'`);
                  }

                  // Restricted Safety Scope Check
                  if (parsedMeta.clinicalSafety === 'restricted') {
                    if (parsedMeta.requiresDomainApproval !== true) {
                      errors.push(`[${relPath}] Restricted section '${aId}' with mappingEligible: true requires requiresDomainApproval: true`);
                    }
                    const scope = (parsedMeta.review && parsedMeta.review.approvalScope) ? String(parsedMeta.review.approvalScope).toLowerCase() : '';
                    if (!scope.includes('educational question generation')) {
                      errors.push(`[${relPath}] Restricted section '${aId}' with mappingEligible: true requires approvalScope containing 'educational question generation'`);
                    }
                  }
                }
              }
            }
          } else {
            // Require wiki-section-meta for domain pages
            if (data.domainId) {
              errors.push(`[${relPath}] Anchor '${aId}' is missing required <!-- wiki-section-meta --> block`);
            }
          }
        }

        pages.set(pageId, {
          filePath: fullPath,
          relPath,
          frontmatter: data,
          anchors,
          sectionMetas,
          content
        });
      }
    }
  }

  walk(dir);
  return pages;
}

// 2. Scan Wiki Internal Links
export function validateInternalLinks(pages, errors = [], warnings = []) {
  for (const [pageId, page] of pages.entries()) {
    const cleanContent = stripCodeBlocks(page.content);

    // Check standard markdown relative links: [text](path)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(cleanContent)) !== null) {
      const linkTarget = match[2];
      if (linkTarget.startsWith('http://') || linkTarget.startsWith('https://') || linkTarget.startsWith('mailto:') || linkTarget.startsWith('#')) {
        continue;
      }

      const [targetFile, targetAnchor] = linkTarget.split('#');
      if (targetFile) {
        const resolvedPath = path.resolve(path.dirname(page.filePath), targetFile);
        if (!fs.existsSync(resolvedPath)) {
          errors.push(`[${page.relPath}] Broken internal link: '${linkTarget}' (Target file does not exist)`);
        }
      }
    }

    // Check Ghost Wikilinks [[...]]
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
    let wMatch;
    while ((wMatch = wikiLinkRegex.exec(cleanContent)) !== null) {
      const target = wMatch[1];
      warnings.push(`[${page.relPath}] Ghost wikilink found: '[[${target}]]'`);
    }
  }
}

// 3. Load Question Bank Safely
export async function loadQuestionBank(rootDir = ROOT_DIR, errors = [], warnings = [], infoLogs = []) {
  let questions = [];
  let sourceFiles = [];

  try {
    const qModulePath = path.join(rootDir, 'src', 'data', 'questions.js');
    const qModule = await import(`file://${qModulePath}`);
    await qModule.loadQB();
    questions = qModule.QB;
    infoLogs.push(`Successfully loaded Question Bank via src/data/questions.js (Total: ${questions.length} Qs)`);
    
    // Resolve source files from registry
    const registryPath = path.join(rootDir, 'src', 'data', 'bank-registry.generated.js');
    if (fs.existsSync(registryPath)) {
      const regModule = await import(`file://${registryPath}`);
      sourceFiles = regModule.BANK_REGISTRY.map(b => b.file);
    }
  } catch (err) {
    warnings.push(`loadQB() failed (${err.message}). Falling back to dynamic scanner.`);
    const dataDir = path.join(rootDir, 'src', 'data');
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir).filter(f => f.startsWith('questions-') && f.endsWith('.js'));
      sourceFiles = files;
      
      for (const f of files) {
        try {
          const fPath = path.join(dataDir, f);
          const mod = await import(`file://${fPath}`);
          for (const expKey of Object.keys(mod)) {
            if (Array.isArray(mod[expKey])) {
              questions = questions.concat(mod[expKey]);
            }
          }
        } catch (e) {
          errors.push(`Failed to dynamic-import ${f}: ${e.message}`);
        }
      }
    }
  }

  return { questions, sourceFiles };
}

// 4. Validate Question Wiki References
export function validateQuestionRefs(questions, pages, errors = [], warnings = []) {
  let verifiedCount = 0;
  let candidateCount = 0;
  let unmappedCount = 0;
  const unmappedIds = [];
  // section key -> question ids citing it whose stamped hash no longer matches
  const driftedSections = new Map();

  for (const q of questions) {
    const qIdStr = `${q.subject || 'unknown'}:${q.id}`;

    if (!q.wikiRefs || !Array.isArray(q.wikiRefs) || q.wikiRefs.length === 0) {
      unmappedCount++;
      unmappedIds.push(qIdStr);
      continue;
    }

    for (const ref of q.wikiRefs) {
      if (!ref || typeof ref !== 'object' || !ref.pageId || !ref.anchorId) {
        errors.push(`Question ${qIdStr} has invalid wikiRef object (missing pageId or anchorId)`);
        continue;
      }

      if (!pages.has(ref.pageId)) {
        errors.push(`Question ${qIdStr} references missing pageId '${ref.pageId}'`);
      } else {
        const page = pages.get(ref.pageId);
        if (!page.anchors.has(ref.anchorId)) {
          errors.push(`Question ${qIdStr} references missing anchorId '${ref.anchorId}' in page '${ref.pageId}'`);
        }
      }

      if (ref.contentHash === null || ref.contentHash === undefined) {
        warnings.push(`Question ${qIdStr} wikiRef to '${ref.pageId}#${ref.anchorId}' has null contentHash`);
      } else if (pages.has(ref.pageId)) {
        // A stamped hash makes the citation self-checking: if the section it
        // points at has been edited since, the question may no longer be
        // supported by it and a human has to look. Drift is an ERROR, not a
        // warning — a silently-rotted citation is what this whole mechanism
        // exists to prevent.
        const actual = sectionContentHash(pages.get(ref.pageId).content, ref.anchorId);
        if (actual && actual !== ref.contentHash) {
          driftedSections.set(
            `${ref.pageId}#${ref.anchorId}`,
            (driftedSections.get(`${ref.pageId}#${ref.anchorId}`) || []).concat(qIdStr),
          );
        }
      }

      if (ref.mappingStatus === 'verified') verifiedCount++;
      else if (ref.mappingStatus === 'candidate') candidateCount++;
      else unmappedCount++;
    }
  }

  // Report drift per SECTION rather than per question — one edited section can
  // invalidate a dozen citations, and the fix is to re-check that one section.
  for (const [section, qIds] of driftedSections) {
    errors.push(
      `Wiki section '${section}' has changed since ${qIds.length} question(s) cited it `
      + `[${qIds.slice(0, 8).join(', ')}${qIds.length > 8 ? `, +${qIds.length - 8} more` : ''}]. `
      + `Re-check that the section still supports them, then re-stamp with: npm run wiki:hashes`,
    );
  }

  if (unmappedCount > 0) {
    warnings.push(`WARNING: ${unmappedCount} questions have no wikiRefs`);
  }

  return { verifiedCount, candidateCount, unmappedCount, unmappedIds, driftedSections };
}

// Full Runner Function
export async function runValidation(options = {}) {
  const rootDir = options.rootDir || ROOT_DIR;
  const wikiDir = options.wikiDir || path.join(rootDir, 'wiki');
  
  const errors = [];
  const warnings = [];
  const infoLogs = [];

  const pages = scanWikiPages(wikiDir, errors, warnings, rootDir);
  validateInternalLinks(pages, errors, warnings);

  const { questions, sourceFiles } = options.questions 
    ? { questions: options.questions, sourceFiles: options.sourceFiles || [] }
    : await loadQuestionBank(rootDir, errors, warnings, infoLogs);

  const refStats = validateQuestionRefs(questions, pages, errors, warnings);

  return {
    pages,
    questions,
    sourceFiles,
    refStats,
    errors,
    warnings,
    infoLogs
  };
}

// CLI Execution Entrypoint
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' VetMock Wiki Read-Only Validation & Integrity Check');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const result = await runValidation();

  console.log(`\n📂 Scanned Wiki Pages: ${result.pages.size}`);
  for (const [id, page] of result.pages.entries()) {
    console.log(`  - [${id}] (${page.frontmatter.status}) -> ${page.anchors.size} anchors, ${page.sectionMetas ? page.sectionMetas.size : 0} section metas`);
  }

  console.log(`\n📚 Scanned Question Source Files (${result.sourceFiles.length}):`);
  console.log(`   ${result.sourceFiles.join(', ')}`);
  console.log(`\n❓ Total Questions Evaluated: ${result.questions.length}`);
  console.log(`   Verified Citations : ${result.refStats.verifiedCount}`);
  console.log(`   Candidate Citations: ${result.refStats.candidateCount}`);
  console.log(`   Unmapped Questions : ${result.refStats.unmappedCount}`);

  console.log('\n----------------------------------------------------');
  if (result.infoLogs.length > 0) {
    result.infoLogs.forEach(i => console.log(`ℹ️  ${i}`));
  }
  if (result.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${result.warnings.length}):`);
    result.warnings.slice(0, 25).forEach(w => console.log(`   ${w}`));
    if (result.warnings.length > 25) console.log(`   ... and ${result.warnings.length - 25} more warnings.`);
  }

  if (result.errors.length > 0) {
    console.log(`\n❌ ERRORS (${result.errors.length}):`);
    result.errors.forEach(e => console.log(`   ${e}`));
    console.log('\n❌ Validation Failed.');
    process.exit(1);
  }

  console.log('\n✅ Validation Succeeded (0 Errors).');
  process.exit(0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(err => {
    console.error('Fatal Validator Failure:', err);
    process.exit(1);
  });
}
