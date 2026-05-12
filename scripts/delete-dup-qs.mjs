#!/usr/bin/env node
// ============================================================
// delete-dup-qs.mjs — Remove duplicate Qs detected by lint:dupes
// ============================================================
//
// Safer line-by-line parser that depth-counts braces. Avoids the
// greedy-regex pitfall (first attempt ate 735 lines).
// ============================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

const DELETE_PLAN = {
  'questions-com3-special.js': [1507, 1527, 1532, 1568],
  'questions-practrum.js': [3000, 3001, 3003, 3004, 3005, 3007, 3009],
};

// Delete one Q literal from `content` by ID. Returns updated content
// (or unchanged if ID not found). Uses brace-depth counting which is
// robust to nested `{...}` inside `flag:`, `options:`, etc.
function deleteQ(content, targetId) {
  const lines = content.split('\n');
  const out = [];
  let i = 0;
  let found = false;
  const startRe = new RegExp(`^\\s*\\{\\s*id:\\s*${targetId}\\s*,`);

  while (i < lines.length) {
    const line = lines[i];
    if (!found && startRe.test(line)) {
      // Found start of target Q. Skip lines until brace depth returns to 0.
      let depth = 0;
      let opened = false;
      while (i < lines.length) {
        for (const ch of lines[i]) {
          if (ch === '{') { depth++; opened = true; }
          else if (ch === '}') depth--;
        }
        i++;
        if (opened && depth === 0) {
          // End of literal at this line. Also consume any trailing comma
          // already on this line — it's part of the line we skip.
          break;
        }
      }
      found = true;
    } else {
      out.push(line);
      i++;
    }
  }
  return { content: out.join('\n'), found };
}

let totalDeleted = 0;
for (const [filename, ids] of Object.entries(DELETE_PLAN)) {
  const path = join(DATA_DIR, filename);
  let content = readFileSync(path, 'utf8');
  let deleted = 0;
  for (const id of ids) {
    const result = deleteQ(content, id);
    if (result.found) {
      content = result.content;
      deleted++;
    } else {
      console.warn(`  ⚠️ ${filename}: id:${id} not found`);
    }
  }
  writeFileSync(path, content, 'utf8');
  console.log(`✅ ${filename}: ${deleted}/${ids.length} Q${deleted === 1 ? '' : 's'} deleted`);
  totalDeleted += deleted;
}

console.log('');
console.log(`📊 Total deletions: ${totalDeleted}`);
