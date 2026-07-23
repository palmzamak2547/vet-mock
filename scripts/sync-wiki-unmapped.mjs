#!/usr/bin/env node
// ============================================================
// sync-wiki-unmapped.mjs — Explicit Unmapped Questions Generator
// ============================================================
// Usage: node scripts/sync-wiki-unmapped.mjs
//
// Generates or updates wiki/unmapped-questions.md deterministically.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'wiki', 'unmapped-questions.md');

async function main() {
  console.log('Generating wiki/unmapped-questions.md...');
  const qModulePath = path.join(ROOT_DIR, 'src', 'data', 'questions.js');
  const qModule = await import(`file://${qModulePath}`);
  await qModule.loadQB();
  const questions = qModule.QB;

  const unmapped = questions.filter(q => !q.wikiRefs || q.wikiRefs.length === 0 || q.wikiRefs.every(r => r.mappingStatus === 'unmapped'));

  // Sort deterministically by subject then id
  unmapped.sort((a, b) => {
    const subjA = String(a.subject || '');
    const subjB = String(b.subject || '');
    if (subjA !== subjB) return subjA.localeCompare(subjB);
    return Number(a.id) - Number(b.id);
  });

  const bySubject = new Map();
  for (const q of unmapped) {
    const subj = q.subject || 'unassigned';
    if (!bySubject.has(subj)) bySubject.set(subj, []);
    bySubject.get(subj).push(q);
  }

  let md = `---
id: unmapped-questions
title: Unmapped Questions Report
type: reference
version: 1.0.0
status: draft
tags: [unmapped, report, questions]
lastReviewed: ${new Date().toISOString().split('T')[0]}
---

# 📋 Unmapped Questions Report

สรุปรายการข้อสอบทั้งหมดที่ยังไม่มีบทความ Wiki รองรับ (wikiRefs: []) หรือมีสถานะ unmapped

- **จำนวนข้อสอบทั้งหมด:** ${questions.length} ข้อ
- **จำนวนข้อสอบที่ยัง Unmapped:** ${unmapped.length} ข้อ
- **สัดส่วน:** ${((unmapped.length / questions.length) * 100).toFixed(1)}%

---

## รายการข้อสอบแยกตามวิชา

`;

  for (const [subj, qList] of bySubject.entries()) {
    md += `### วิชา: \`${subj}\` (${qList.length} ข้อ)\n`;
    md += `| Question ID | Type | Year | Topic/Tags | Text Snippet |\n`;
    md += `|---|---|---|---|---|\n`;
    for (const q of qList) {
      const snippet = String(q.q || '').replace(/\r?\n/g, ' ').slice(0, 60).replace(/\|/g, '\\|');
      const tagsStr = Array.isArray(q.tags) ? q.tags.join(', ') : '-';
      md += `| \`${q.id}\` | ${q.type || 'mcq'} | Year ${q.year || 4} | ${tagsStr} | ${snippet}... |\n`;
    }
    md += `\n`;
  }

  fs.writeFileSync(OUTPUT_FILE, md, 'utf8');
  console.log(`✅ Successfully written ${OUTPUT_FILE} (${unmapped.length} unmapped questions)`);
}

main().catch(err => {
  console.error('Fatal Sync Error:', err);
  process.exit(1);
});
