// ============================================================
// pdf.mjs — one subject's proof PDF (docs/PROVENANCE-CROPS.md)
// ============================================================
// Reads <data>/work/<subject>.json and <data>/registry/<subject>.jsonl, writes
// <data>/pdf/<subject>.html and prints it with Chromium, which shapes and
// breaks Thai correctly. The crops are referenced from the data root and the
// PDF stays there: nothing is written into the repository.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️]/gu;
const LETTERS = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ'];
const KIND = { 'past-paper': 'ข้อสอบเก่าที่บันทึกไว้', 'student-compilation': 'จากสรุปของรุ่นพี่', 'exam-aligned': 'อิงแนวข้อสอบ', 'lecture-derived': 'จากเนื้อหาบรรยาย' };
const SCOPE = { final: 'ปลายภาค', both: 'กลางภาคและปลายภาค', midterm: 'กลางภาค', continuous: 'เก็บคะแนนระหว่างเทอม' };
const SCOPE_ORDER = { final: 0, both: 1, midterm: 2, continuous: 3 };
const TYPE_ORDER = { 'past-paper': 0, 'student-compilation': 1, 'exam-aligned': 2, 'lecture-derived': 3 };
const DOC_KIND = { senior: 'ไฟล์รุ่นพี่', 'senior-marked-deck': 'สไลด์อาจารย์ที่รุ่นพี่มาร์ค', deck: 'สไลด์อาจารย์' };
const LOCATED = { text: 'ตำแหน่งจาก text layer', vision: 'ตำแหน่งจากการอ่านภาพ (vision)', model: 'โมเดลชี้บรรทัด ตรวจข้อความกับหน้าแล้ว', hand: 'วางตำแหน่งด้วยมือ' };

// One fixed sentence per state; never more than the page shows.
const HOW = { mark: 'มีเครื่องหมายที่ตัวเลือกนั้น', typed: 'ตัวเลือกนั้นพิมพ์สีแดงหรือตัวหนา', written: 'เขียนว่า ตอบ' };
function clauseLine(r, q) {
  const a = r.answer;
  const how = (a?.how || []).map((h) => HOW[h] || h).join(', ');
  switch (r.clause) {
    case 'answer-match': return `ไฟล์นี้ระบุคำตอบเป็นตัวเลือก ${LETTERS[a.index]} (${how}) ตรงกับเฉลยของคลัง`;
    case 'answer-conflict': return `ไฟล์นี้ระบุคำตอบเป็นตัวเลือก ${LETTERS[a.index]} (${how}) ไม่ตรงกับเฉลยของคลัง (${LETTERS[q.answer] ?? '-'}) ต้องตรวจ`;
    case 'ambiguous': return 'ไฟล์นี้มีสัญญาณคำตอบมากกว่าหนึ่งตัวเลือก อ่านคำตอบไม่ได้แน่ชัด';
    case 'states-marked': return 'ข้อความที่ตรงกับเฉลย (กรอบเขียว) อยู่ใต้เครื่องหมายของรุ่นพี่ (เส้นประส้ม)';
    case 'states': return 'ข้อความที่ตรงกับเฉลยอยู่ในหน้านี้ (กรอบเขียว)';
    case 'pointed': return 'โมเดลชี้บรรทัดที่น่าจะสนับสนุนเฉลย (กรอบจุด) ข้ามภาษา คำที่ยกมาอยู่ในบรรทัดนั้นจริง แต่ต้องอ่านเองว่าสนับสนุนจริงไหม';
    case 'mentions': return `คำจากเฉลยหรือตัวเลือกปรากฏในหน้านี้${r.support?.of ? ` ${r.support.of[0]} จาก ${r.support.of[1]} ส่วน` : ''} (กรอบจุด) ไม่นับเป็นหลักฐานว่าเฉลยถูก`;
    default: return 'ไม่พบคำตอบของข้อนี้ในหน้านี้';
  }
}
const SUMMARY = {
  'answer-conflict': 'ต้นทางระบุคำตอบไม่ตรงกับเฉลย ต้องตรวจ',
  'blind-disagrees': 'บันทึกการแก้แบบไม่ดูเฉลยได้คำตอบต่างจากคลัง ต้องตรวจ',
  ambiguous: 'ต้นทางมีสัญญาณคำตอบมากกว่าหนึ่งตัวเลือก อ่านคำตอบไม่ได้แน่ชัด',
  'answer-match': 'ต้นทางระบุคำตอบตรงกับเฉลย',
  'states-marked': 'เฉลยตรงกับจุดที่รุ่นพี่ทำเครื่องหมายไว้',
  states: 'ข้อความในต้นทางตรงกับเฉลย',
  pointed: 'โมเดลชี้ข้อความข้ามภาษาที่น่าจะสนับสนุนเฉลย ต้องอ่านเอง',
  mentions: 'พบเพียงคำที่เกี่ยวข้องในต้นทาง ไม่พบคำตอบ',
  blind: 'ไม่พบคำตอบในต้นทาง การแก้แบบไม่ดูเฉลยที่บันทึกไว้ได้คำตอบตรงกับคลัง',
  none: 'ไม่พบคำตอบในต้นทาง',
};
const HL = { key: 'hl-key', mention: 'hl-mention', pointed: 'hl-mention', 'source-answer': 'hl-answer', 'our-key': 'hl-ours' };

/** Boxes drawn over the crop from the record, so the JPEG stays the untouched source. */
function overlays(r) {
  const [X0, Y0, X1, Y1] = r.bbox;
  const W = X1 - X0;
  const H = Y1 - Y0;
  const pct = (v, a, d) => Math.max(0, Math.min(100, ((v - a) / d) * 100)).toFixed(2);
  return (r.highlights || []).map((h) => {
    const cls = HL[h.type] || 'hl-mark';
    const top = pct(h.bbox[1], Y0, H);
    const height = Math.max(0.8, pct(h.bbox[3], Y0, H) - top).toFixed(2);
    if (!h.exact) return `<div class="bar ${cls}" style="top:${top}%;height:${height}%"></div>`;
    const left = pct(h.bbox[0], X0, W);
    const width = Math.max(0.8, pct(h.bbox[2], X0, W) - left).toFixed(2);
    return `<div class="box ${cls}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"></div>`;
  }).join('');
}

function why(explain) {
  const first = String(explain || '').split(/\n\s*❌|\n\s*—|\n\n💡/)[0].replace(EMOJI, '').trim();
  return first.length > 420 ? `${first.slice(0, 420)}…` : first;
}

function keyText(q) {
  if (q.type === 'mcq' && Array.isArray(q.options) && Number.isInteger(q.answer)) return `${LETTERS[q.answer]}. ${q.options[q.answer]}`;
  if (q.type === 'tf') return q.answer === true || q.answer === 0 ? 'ถูก' : 'ผิด';
  return null;
}

function itemHtml(q, n, recs, root, humanSource) {
  const crops = recs.filter((r) => r.crop);
  const shown = [...crops.filter((r) => r.role === 'origin').slice(0, 2), ...crops.filter((r) => r.role === 'key').slice(0, 1)];
  const rest = crops.filter((r) => !shown.includes(r));
  const ev = recs[0]?.evidence ?? 'none';
  const blindRec = recs.find((r) => r.blind)?.blind;
  const opts = Array.isArray(q.options) && q.type !== 'tf'
    ? `<ol class="opts">${q.options.map((o, i) => `<li class="${i === q.answer ? 'key' : ''}"><b>${LETTERS[i]}.</b> ${esc(o)}</li>`).join('')}</ol>` : '';
  const key = keyText(q);
  const answer = q.model_answer ? `<div class="ma"><b>แนวคำตอบ</b> ${esc(String(q.model_answer).replace(EMOJI, ''))}</div>` : '';
  const figs = shown.map((r) => `
    <figure>
      <div class="crop"><img src="${pathToFileURL(path.join(root, r.crop)).href}" alt="">${overlays(r)}</div>
      <figcaption><b>${esc(r.doc.name)}</b> หน้า ${r.page} <span class="who">${esc(DOC_KIND[r.doc.kind] || '')}${r.doc.who ? `, ${esc(r.doc.who)}` : ''}</span>
        <span class="how">${esc(LOCATED[r.located] || r.located)}${r.checked ? ', ตรวจด้วยตาแล้ว' : ''}${(r.flags || []).length ? `, ${esc(r.flags.join(', '))}` : ''}</span></figcaption>
      <div class="clause cl-${r.clause}">${esc(clauseLine(r, q))}</div>
    </figure>`).join('');
  const more = rest.length ? `<div class="more">หน้าอื่นที่อ้าง: ${rest.map((r) => `${esc(r.doc.name)} หน้า ${r.page}`).join(', ')}</div>` : '';
  const blind = blindRec?.evidence ? `<div class="blind">บันทึกการแก้แบบไม่ดูเฉลย: ${esc(blindRec.evidence)}</div>` : '';
  return `
  <section class="item ev-${ev}">
    <div class="head"><span class="n">${n}</span><span class="qid">${esc(q.qid)}</span><span class="tag">${esc(KIND[q.sourceType] || 'ไม่ระบุที่มา')}</span>${q.examOrigin ? `<span class="eo">${esc(String(q.examOrigin).replace(/\s*\u00b7\s*/g, ', '))}</span>` : ''}</div>
    <div class="stem">${esc(q.q)}</div>
    ${opts}
    ${key ? `<div class="keyline"><b>เฉลย</b> ${esc(key)}</div>` : ''}
    ${answer}
    ${why(q.explain) ? `<div class="why"><b>ทำไม</b> ${esc(why(q.explain))}</div>` : ''}
    <div class="src"><b>ที่มาในคลัง</b> ${esc(humanSource(q.source) || '-')}${q.verified ? `<br><b>ตรวจกับ</b> ${esc(humanSource(q.verified))}` : ''}</div>
    ${figs}${more}
    <div class="ev"><b>สรุปหลักฐาน</b> ${esc(SUMMARY[ev] || SUMMARY.none)}</div>${blind}
  </section>`;
}

const CSS = (fonts) => `
@font-face { font-family: Sarabun; font-weight: 400; src: url(${fonts}/Sarabun-Regular.ttf); }
@font-face { font-family: Sarabun; font-weight: 600; src: url(${fonts}/Sarabun-SemiBold.ttf); }
@font-face { font-family: Sarabun; font-weight: 700; src: url(${fonts}/Sarabun-Bold.ttf); }
@page { size: A4; margin: 13mm 12mm 15mm; }
* { box-sizing: border-box; }
body { font-family: Sarabun, sans-serif; font-size: 10.5pt; line-height: 1.55; color: #1b1b1b; margin: 0; }
h1 { font-size: 22pt; line-height: 1.2; margin: 0 0 4mm; letter-spacing: 0; }
h2 { font-size: 14pt; line-height: 1.2; margin: 7mm 0 3mm; padding-bottom: 1.5mm; border-bottom: 1.5px solid #333; break-after: avoid; letter-spacing: 0; }
h3 { font-size: 11.5pt; margin: 5mm 0 2mm; color: #444; break-after: avoid; }
.cover { break-after: page; }
.cover p { margin: 1.5mm 0; }
table.counts { border-collapse: collapse; margin: 4mm 0; }
table.counts td { border: 1px solid #bbb; padding: 1.5mm 3mm; }
table.counts td:last-child { text-align: right; font-weight: 600; }
.legend div { margin: 1.2mm 0; }
.sw { display: inline-block; width: 9mm; height: 3.2mm; vertical-align: middle; margin-right: 2mm; }
.item { border-top: 1px solid #ddd; padding: 3mm 0 2mm; }
.head, .stem, .opts, .keyline { break-inside: avoid; }
.head { font-size: 9pt; color: #555; display: flex; gap: 3mm; flex-wrap: wrap; align-items: baseline; }
.n { font-weight: 700; font-size: 11pt; color: #111; }
.tag { background: #eef; padding: 0 2mm; border-radius: 2mm; }
.eo { color: #666; }
.stem { font-weight: 600; margin: 1mm 0; white-space: pre-wrap; }
.opts { list-style: none; padding: 0; margin: 1mm 0; }
.opts li { padding: 0.4mm 2mm; border-left: 3px solid transparent; }
.opts li.key { background: #e6f5ea; border-left-color: #1f8c4a; }
.keyline { color: #145c32; margin: 1mm 0; }
.ma { font-size: 9.5pt; background: #f6f8f6; padding: 1.5mm 2.5mm; margin: 1mm 0; white-space: pre-wrap; }
.why, .src, .more, .blind { font-size: 9.2pt; color: #333; margin: 1mm 0; }
.src { color: #555; }
figure { margin: 2.5mm 0; padding: 0 3mm; break-inside: avoid; }
.crop { position: relative; display: inline-block; max-width: 100%; }
.crop img { display: block; max-width: 100%; max-height: 118mm; border: 1px solid #ccc; }
.box { position: absolute; }
.bar { position: absolute; width: 1.6mm; }
.box.hl-key { border: 2px solid #1f8c4a; background: rgba(40,180,80,.18); margin: -2px; }
.box.hl-mention { border: 2px dotted #1f8c4a; margin: -2px; }
.box.hl-answer { border: 2.5px solid #1d5fbf; margin: -3px; }
.box.hl-ours { border: 2px dashed #888; margin: -4px; }
.box.hl-mark { border: 2px dashed #eb7800; margin: -3px; }
.bar.hl-key, .bar.hl-mention, .bar.hl-ours { left: -2.4mm; background: #1f8c4a; }
.bar.hl-answer { left: -2.4mm; background: #1d5fbf; }
.bar.hl-mark { right: -2.4mm; background: #eb7800; }
.clause { font-size: 9pt; margin-top: .8mm; color: #333; }
.cl-answer-conflict, .cl-ambiguous { color: #8c1d18; font-weight: 600; }
.cl-answer-match, .cl-states-marked, .cl-states { color: #145c32; }
figcaption { font-size: 8.8pt; color: #333; margin-top: 1mm; }
.who { color: #555; } .how { color: #777; }
.ev { font-size: 9.5pt; margin-top: 1.5mm; padding: 1mm 2.5mm; border-radius: 1.5mm; break-inside: avoid; }
.ev-answer-match .ev, .ev-states .ev, .ev-states-marked .ev { background: #e6f5ea; }
.ev-blind-disagrees .ev, .ev-ambiguous .ev { background: #fde7e5; color: #8c1d18; font-weight: 600; }
.ev-mentions .ev { background: #eef3fb; }
.ev-shown .ev { background: #eef3fb; }
.ev-blind .ev { background: #fff5e0; }
.ev-none .ev { background: #f1f1f1; }
.ev-answer-conflict .ev { background: #fde7e5; color: #8c1d18; font-weight: 600; }
.app td { font-size: 9pt; vertical-align: top; border-bottom: 1px solid #eee; padding: 1mm 1.5mm; }
.app { border-collapse: collapse; width: 100%; }
`;

const PAPERS = { final: ['final', 'both', null], midterm: ['midterm', 'both', null] };
const PAPER_TH = { final: 'ปลายภาค', midterm: 'กลางภาค' };
const SECTION = { final: 'เฉพาะปลายภาค', midterm: 'เฉพาะกลางภาค', both: 'ออกได้ทั้งกลางภาคและปลายภาค', null: 'ไม่ระบุช่วงสอบ' };
const SAT_TH = { final: 'ปลาย', midterm: 'กลาง', unknown: 'ไม่ระบุรอบ', quiz: 'quiz', station: 'station' };
const GENERIC = new Set('disease diseases swine equine pig pigs horse horses and the for with from vet veterinary medicine lecture lectures slides slide note notes year 5th yr5 2024 2025 2026 2569 present reading material handout course intro introduction'.split(' '));
const toks = (s) => new Set(String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .split(/[^a-z0-9ก-๛]+/).filter((t) => t.length >= 3 && !GENERIC.has(t)));
const fileUrl = (root, rel) => pathToFileURL(path.join(root, rel)).href;

/** Which papers the subject sits, from the exam timetable. */
function papersOf(data) {
  const out = [];
  for (const p of data.subject.papers) {
    const text = `${p.id} ${p.title} ${p.term || ''}`;
    const key = /final/i.test(text) ? 'final' : /mid/i.test(text) ? 'midterm' : null;
    if (key && !out.some((x) => x.key === key)) out.push({ key, ...p });
  }
  return out.length ? out : [{ key: 'final' }];
}

/** The document a cite names, as crops.py resolves it (docs.json pins). */
function resolver(docs) {
  const byCite = new Map(docs.filter((d) => d.cite).map((d) => [d.cite, d]));
  const aliases = docs.filter((d) => d.alias).map((d) => [new RegExp(d.alias, 'i'), d]);
  return (c) => {
    if (c.name) for (const [rx, d] of aliases) if (rx.test(c.name)) return d;
    if (!c.slug) return null;
    if (c.edition && byCite.has(`${c.slug}@${c.edition}`)) return byCite.get(`${c.slug}@${c.edition}`);
    const hits = docs.filter((d) => d.cite && d.cite.split('@')[0] === c.slug);
    return hits.length === 1 ? hits[0] : null;
  };
}

/** Each topic's decks: this year's library files first (by the questions that cite them, the
 *  lecturer sets, then their title and first page), else an earlier year's deck on the same topic
 *  by the same lecturer (Palm, 31 Oct), else the title slide cut from the class recording. */
function decksByTopic(data, lib, docs, sourceDocs, lecturerDecks) {
  const resolve = resolver(docs);
  const titleOf = new Map(sourceDocs.map((d) => [d.slug, d.title]));
  const cited = new Map(); // topic -> sha16 -> questions citing it
  for (const q of data.questions) {
    const seen = new Set();
    for (const c of q.cites) {
      const d = resolve(c);
      if (!d || seen.has(d.sha16)) continue;
      seen.add(d.sha16);
      const m = cited.get(q.topic) || new Map();
      m.set(d.sha16, (m.get(d.sha16) || 0) + 1);
      cited.set(q.topic, m);
    }
  }
  const current = (lib.current || []).filter((d) => !d.missing);
  const assigned = new Map(data.topics.map((t) => [t.id, []]));
  const placed = new Set();
  const citesOf = (sha) => data.topics.reduce((n, t) => n + (cited.get(t.id)?.get(sha) || 0), 0);
  for (const d of current) {
    let best = null;
    const all = citesOf(d.sha16);
    for (const t of data.topics) {
      // The share of the deck's cites that come from this topic, not the raw count: a big deck
      // cited now and then by a neighbouring topic must not be pulled onto it.
      const share = all ? (cited.get(t.id)?.get(d.sha16) || 0) / all : 0;
      const bySet = (lecturerDecks.get(d.slug) || []).includes(t.id) ? 5 : 0;
      const want = toks(`${t.label} ${t.id.split('-').slice(1).join(' ')}`);
      const have = toks(`${d.title} ${d.p1 || ''}`);
      const byText = want.size ? [...want].filter((w) => have.has(w)).length / want.size : 0;
      const score = 2 * share + bySet + (byText >= 0.5 ? 3 * byText : 0);
      if (score > 0 && (!best || score > best.score)) best = { t: t.id, score };
    }
    if (best) { assigned.get(best.t).push({ ...d, how: 'current' }); placed.add(d.sha16); }
  }
  const older = lib.older || [];
  for (const t of data.topics) {
    if (assigned.get(t.id).length) continue;
    const words = String(t.lecturer || '').replace(/\([^)]*\)/g, ' ').toLowerCase()
      .split(/\s+/).filter((w) => /^[a-z]{3,}$/.test(w) && !['prof', 'assoc', 'asst', 'guest', 'lecturer', 'dr', 'tbd'].includes(w));
    const surname = words.length >= 2 ? words[words.length - 1] : null;
    const counts = cited.get(t.id) || new Map();
    const cands = older.filter((d) => counts.get(d.sha16)).sort((a, b) => counts.get(b.sha16) - counts.get(a.sha16));
    for (const d of cands) {
      const title = titleOf.get(String(d.cite || '').split('@')[0]) || d.name;
      const text = `${title} ${d.name} ${d.who} ${d.p1}`.toLowerCase();
      const same = !!surname && new RegExp(`\\b${surname}\\b`, 'i').test(text);
      // Palm asked for the seniors' slides: a deck, or a lecture file the senior's drive numbers
      // ("12 - Prion_diseases..."); a compilation is never shown here.
      const deckLike = d.kind === 'deck' || d.kind === 'senior-marked-deck' || /^\d+(\.\d+)?\s*-\s+\S/.test(d.name || '');
      if (!deckLike) continue;
      assigned.get(t.id).push({ ...d, title, how: same ? 'older' : 'older-unconfirmed' });
      if (assigned.get(t.id).length >= 2) break;
    }
    // A deck by the same lecturer makes another lecturer's deck on the topic irrelevant here.
    if (assigned.get(t.id).some((d) => d.how === 'older')) assigned.set(t.id, assigned.get(t.id).filter((d) => d.how === 'older'));
  }
  return { assigned, unplaced: current.filter((d) => !placed.has(d.sha16)) };
}

function deckCard(root, d, topic) {
  if (d.how === 'older-unconfirmed') {
    return `<div class="deck none"><div class="ph">มีสไลด์รุ่นพี่หัวข้อนี้ แต่ยืนยันจากไฟล์ไม่ได้ว่าอาจารย์คนเดียวกัน จึงไม่ใส่ภาพ</div><div class="dt">${esc(d.title)}</div></div>`;
  }
  const tag = d.how === 'current' ? `ปีนี้ (2569), ${d.pages || '?'} หน้า`
    : d.how === 'older' ? `สไลด์รุ่นพี่ใช้แทน อาจารย์คนเดียวกัน (${esc(topic.lecturer || '')}), ${d.pages || '?'} หน้า` : 'ปกจากคลิปบันทึกการสอน';
  return `<div class="deck ${d.how}"><img src="${d.src || fileUrl(root, d.cover)}" alt=""><div class="dt">${esc(d.title || d.name)}</div><div class="dk">${tag}</div></div>`;
}

function statsHtml(data, paper, rec, qs) {
  const topics = data.topics.filter((t) => PAPERS[paper].includes(t.examScope ?? null));
  const rows = topics.map((t) => {
    const r = rec?.topics?.[t.id];
    const sat = r ? Object.entries(r.sat || {}).map(([c, ps]) => `Vet ${c} (${Object.entries(ps).map(([k, v]) => `${SAT_TH[k] || k} ${v.length}`).join(', ')})`).join('<br>') : '';
    const inBank = qs.filter((q) => q.topic === t.id).length;
    const aligned = qs.filter((q) => q.topic === t.id && q.sourceType === 'exam-aligned').length;
    const n = r?.cohorts?.length || 0;
    return `<tr class="${n >= 3 ? 'hot' : ''}"><td>${esc(t.label)}<div class="lec">${esc(t.lecturer || '')}</div></td><td class="num">${inBank}</td><td class="num">${r?.items || 0}</td><td class="num">${n}</td><td>${sat || '<span class="muted">ยังไม่พบข้อสอบเก่าในคลัง</span>'}</td><td class="num">${aligned}</td></tr>`;
  }).join('');
  return `<h2>สถิติการออกสอบรายหัวข้อ (${PAPER_TH[paper]})</h2>
  <p class="note">นับจากข้อสอบเก่าที่อยู่ในคลัง ว่ารุ่นไหนเคยออกหัวข้อนี้ กี่ข้อ ในรอบไหน เป็นประวัติเท่านั้น ไม่ใช่การบอกว่าปีนี้จะออก แถวพื้นเหลืองคือหัวข้อที่เคยออกตั้งแต่ 3 รุ่นขึ้นไป หัวข้ออยู่รอบไหนเป็นไปตามตารางปีนี้</p>
  <table class="stats"><tr><th>หัวข้อ (อาจารย์ปีนี้)</th><th>ข้อในคลัง</th><th>ข้อสอบเก่า</th><th>จำนวนรุ่น</th><th>รุ่นที่เคยออก (รอบ จำนวนข้อ)</th><th>อิงแนวข้อสอบ</th></tr>${rows}</table>`;
}

function slidesHtml(root, data, paper, deckMap, lectureCovers) {
  const topics = data.topics.filter((t) => PAPERS[paper].includes(t.examScope ?? null));
  let html = `<h2 style="break-before:page">สไลด์ปีนี้ หน้าแรกของทุกหัวข้อ (${PAPER_TH[paper]})</h2>
  <p class="note">เรียงตามหัวข้อในตารางเรียนปีนี้ หัวข้อที่ยังไม่มีไฟล์ปีนี้ในคลัง ใช้สไลด์รุ่นพี่แทนเฉพาะเมื่อหัวข้อเดียวกันและอาจารย์คนเดียวกัน (ยืนยันจากชื่อในไฟล์) ถ้าไม่มีทั้งสองอย่าง ใช้ปกจากคลิปบันทึกการสอนเท่าที่มี</p>`;
  for (const t of topics) {
    let decks = deckMap.assigned.get(t.id) || [];
    if (!decks.some((d) => d.how === 'current' || d.how === 'older')) {
      decks = [...decks, ...(lectureCovers.get(t.id) || []).map((c) => ({ ...c, how: 'recording' }))];
    }
    html += `<div class="topic"><div class="th">${esc(t.label)} <span class="lec">${esc(t.lecturer || '')}, ${esc(SECTION[t.examScope ?? null])}</span></div><div class="decks">${
      decks.length ? decks.map((d) => deckCard(root, d, t)).join('') : '<div class="deck none"><div class="ph">ยังไม่มีไฟล์สไลด์ปีนี้ในคลัง และไม่มีสไลด์รุ่นพี่ของอาจารย์คนเดียวกัน</div></div>'}</div></div>`;
  }
  if (deckMap.unplaced.length) {
    html += `<div class="topic"><div class="th">ไฟล์ปีนี้ที่ยังจับเข้าหัวข้อไม่ได้</div><div class="decks">${deckMap.unplaced.map((d) => deckCard(root, { ...d, how: 'current' }, {})).join('')}</div></div>`;
  }
  return html;
}

const FRONT_CSS = `
.note { font-size: 9pt; color: #555; margin: 0 0 3mm; }
table.stats { border-collapse: collapse; width: 100%; font-size: 9pt; }
table.stats th, table.stats td { border: 1px solid #ccc; padding: 1.2mm 1.8mm; vertical-align: top; }
table.stats th { background: #f0f0f0; text-align: left; }
table.stats td.num { text-align: right; width: 12mm; }
table.stats tr.hot td { background: #fff6d6; }
.lec { color: #666; font-size: 8.5pt; font-weight: 400; }
.muted { color: #999; }
.topic { break-inside: avoid; margin: 3mm 0 4mm; }
.topic .th { font-weight: 600; margin-bottom: 1.5mm; }
.decks { display: flex; flex-wrap: wrap; gap: 3mm; }
.deck { width: 58mm; border: 1px solid #ccc; padding: 1.5mm; font-size: 8.5pt; }
.deck img { width: 100%; display: block; border: 1px solid #eee; }
.deck.older { border-color: #d9a400; background: #fffaf0; }
.deck.recording { border-color: #8aa; }
.deck .dt { font-weight: 600; margin-top: 1mm; }
.deck .dk { color: #666; }
.deck.none { width: auto; max-width: 120mm; color: #777; background: #f6f6f6; }
`;

export async function buildPdf(subject, root) {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'work', `${subject}.json`), 'utf8'));
  const regPath = path.join(root, 'registry', `${subject}.jsonl`);
  const reg = fs.existsSync(regPath) ? fs.readFileSync(regPath, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
  const byQ = new Map();
  for (const r of reg) byQ.set(r.qid, [...(byQ.get(r.qid) || []), r]);
  const libPath = path.join(root, 'library', `${subject}.json`);
  const lib = fs.existsSync(libPath) ? JSON.parse(fs.readFileSync(libPath, 'utf8')) : {};
  const docs = JSON.parse(fs.readFileSync(path.join(root, 'docs.json'), 'utf8')).docs.filter((d) => !d.subject || d.subject === subject);
  const imp = (rel) => import(pathToFileURL(path.join(REPO, rel)).href);
  const [{ humanSource }, { SOURCE_DOCS }, { EXAM_RECURRENCE }, { LECTURER_SETS_BY_PAPER }, { LECTURE_COVERS }] = await Promise.all([
    imp('src/lib/source-label.js'), imp('src/data/source-docs.js'), imp('src/data/exam-recurrence.generated.js'),
    imp('src/data/lecturer-sets.js'), imp('src/data/art.js')]);
  // Lecturer sets: which library deck and which recording cover go with which topic, per paper.
  const lecturerDecks = new Map();
  const coversByPaper = { final: new Map(), midterm: new Map() };
  const walk = (o, paper) => {
    if (Array.isArray(o)) { o.forEach((x) => walk(x, paper)); return; }
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o.decks)) {
      for (const d of o.decks) {
        if (d.doc) lecturerDecks.set(d.doc, d.topics || []);
        const art = d.cover && LECTURE_COVERS[subject]?.[d.cover];
        if (art) {
          for (const t of d.topics || []) {
            const m = coversByPaper[paper];
            if (!(m.get(t) || []).some((x) => x.title === d.title)) m.set(t, [...(m.get(t) || []), { title: d.title, src: pathToFileURL(path.join(REPO, 'public', art.src)).href }]);
          }
        }
      }
    }
    for (const v of Object.values(o)) if (v && typeof v === 'object' && v !== o.decks) walk(v, paper);
  };
  for (const term of Object.values(LECTURER_SETS_BY_PAPER)) {
    for (const byYear of Object.values(term)) {
      for (const [phase, set] of Object.entries(byYear)) walk(set?.[subject], /final/.test(phase) ? 'final' : 'midterm');
    }
  }
  const deckMap = decksByTopic(data, lib, docs, SOURCE_DOCS, lecturerDecks);
  const topicOrder = new Map(data.topics.map((t) => [t.id, t.order]));
  const topicLabel = new Map(data.topics.map((t) => [t.id, t.label]));
  const fonts = pathToFileURL(path.join(REPO, 'public/Sarabun')).href;
  const out = path.join(root, 'pdf');
  fs.mkdirSync(out, { recursive: true });
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch();
  try {
    for (const paper of papersOf(data)) {
      const scopes = PAPERS[paper.key];
      const qs = data.questions.filter((q) => scopes.includes(q.scope ?? null)).sort((a, b) =>
        scopes.indexOf(a.scope ?? null) - scopes.indexOf(b.scope ?? null)
        || (topicOrder.get(a.topic) ?? 999) - (topicOrder.get(b.topic) ?? 999)
        || (TYPE_ORDER[a.sourceType] ?? 4) - (TYPE_ORDER[b.sourceType] ?? 4) || a.id - b.id);
      const withCrop = (q) => (byQ.get(q.qid) || []).some((r) => r.crop);
      const main = qs.filter(withCrop);
      const appendix = qs.filter((q) => !withCrop(q));
      const ev = (q) => (byQ.get(q.qid) || [])[0]?.evidence ?? 'none';
      const nOf = (state) => qs.filter((q) => ev(q) === state).length;
      const count = [
        ['ข้อในคลังของรอบนี้', qs.length],
        ['มีภาพตัดจากต้นทาง', main.length],
        ['ไฮไลต์จุดที่เป็นคำตอบได้', main.filter((q) => byQ.get(q.qid).some((r) => (r.highlights || []).some((h) => h.type === 'key' || h.type === 'source-answer'))).length],
        ['ต้นทางระบุคำตอบ และตรงกับเฉลย', nOf('answer-match')],
        ['เฉลยตรงกับจุดที่รุ่นพี่ทำเครื่องหมาย', nOf('states-marked')],
        ['ข้อความในต้นทางตรงกับเฉลย', nOf('states')],
        ['โมเดลชี้ข้อความข้ามภาษาที่น่าจะสนับสนุนเฉลย (ต้องอ่านเอง)', nOf('pointed')],
        ['ต้นทางระบุคำตอบไม่ตรงกับเฉลย (ต้องตรวจ)', nOf('answer-conflict')],
        ['บันทึกการแก้แบบไม่ดูเฉลยไม่ตรงกับคลัง (ต้องตรวจ)', nOf('blind-disagrees')],
        ['ต้นทางมีเครื่องหมายหลายตัวเลือก', nOf('ambiguous')],
        ['พบเพียงคำที่เกี่ยวข้อง ไม่พบคำตอบ', nOf('mentions')],
        ['ไม่มีคำตอบในต้นทาง แต่การแก้แบบไม่ดูเฉลยตรงกับคลัง', nOf('blind')],
        ['ไม่พบคำตอบในต้นทาง', nOf('none')],
        ['ยังไม่มีภาพตัด (อยู่ในภาคผนวก พร้อมเหตุผล)', appendix.length],
      ];
      let html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>${esc(data.subject.name)} ${PAPER_TH[paper.key]}</title><style>${CSS(fonts)}${FRONT_CSS}</style></head><body>
      <div class="cover">
        <h1>${esc(data.subject.name)} ${PAPER_TH[paper.key]}${data.subject.name_en ? `<br><span style="font-size:13pt;font-weight:400">${esc(data.subject.name_en)}</span>` : ''}</h1>
        <p>ฉบับตรวจที่มา: ข้อในคลังของรอบนี้ พร้อมภาพตัดจากไฟล์ต้นทาง เฉลย และหลักฐานว่าเฉลยมาจากตรงไหน</p>
        ${paper.date ? `<p>สอบ${PAPER_TH[paper.key]} ${esc(paper.date)} เวลา ${esc(paper.time || '')} ${esc(paper.location || '')}</p>` : ''}
        <p>หน้าถัดไป: สถิติการออกสอบรายหัวข้อ, หน้าแรกของสไลด์ปีนี้ทุกหัวข้อ, แล้วจึงเป็นข้อในคลังพร้อมที่มา</p>
        <table class="counts">${count.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${v}</td></tr>`).join('')}</table>
        <div class="legend">
          <div><span class="sw" style="background:rgba(40,180,80,.18);border:2px solid #1f8c4a"></span>กรอบเขียว คือคำในเฉลยของเราที่พบในหน้าที่อ้าง ต่อเนื่องกัน ไม่มีตัวเลือกอื่นปน กรอบจุดเขียว คือพบแค่บางคำ</div>
          <div><span class="sw" style="border:2.5px solid #1d5fbf"></span>กรอบน้ำเงิน คือตัวเลือกที่ต้นทางระบุว่าเป็นคำตอบ</div>
          <div><span class="sw" style="border:2px dashed #888"></span>กรอบเทาประ คือตัวเลือกที่เป็นเฉลยของคลัง ในภาพต้นทาง</div>
          <div><span class="sw" style="border:2px dashed #eb7800"></span>เส้นประส้ม คือเครื่องหมายของรุ่นพี่ (ปากกาแดง ไฮไลต์ ดาว) ซึ่งมักแปลว่าเน้นหรือเคยออก ไม่ได้แปลว่าคำตอบ</div>
          <div>กรอบจุดเขียวที่มีบรรทัด "โมเดลชี้" คือข้อความที่โมเดลชี้ข้ามภาษา ต้องอ่านเอง ไม่นับเป็นหลักฐานเต็ม</div>
          <div>แถบสีที่ขอบภาพ คือตำแหน่งจากการอ่านภาพ (vision) ระดับแถว ไม่ใช่กรอบแม่นยำ ตัวเลือกพื้นเขียวในโจทย์ คือเฉลยของคลัง</div>
        </div>
        <p style="color:#666;font-size:9pt">สร้างเมื่อ ${new Date().toISOString().slice(0, 16).replace('T', ' ')} จากคลังข้อสอบปัจจุบัน ไฟล์นี้เป็นเอกสารส่วนตัว ไม่ใช่เนื้อหาในแอป</p>
      </div>
      ${statsHtml(data, paper.key, EXAM_RECURRENCE[subject], data.questions)}
      ${slidesHtml(root, data, paper.key, deckMap, coversByPaper[paper.key])}
      <h2 style="break-before:page">ข้อในคลังพร้อมที่มา</h2>`;
      let n = 0;
      let scope;
      let topic = null;
      for (const q of main) {
        if ((q.scope ?? null) !== scope) { scope = q.scope ?? null; topic = null; html += `<h2>${esc(SECTION[scope])}</h2>`; }
        if (q.topic !== topic) { topic = q.topic; html += `<h3>${esc(topicLabel.get(topic) || topic)}</h3>`; }
        html += itemHtml(q, ++n, byQ.get(q.qid), root, humanSource);
      }
      if (appendix.length) {
        html += `<h2 style="break-before:page">ภาคผนวก: ข้อที่ยังไม่มีภาพตัด</h2><table class="app"><tr><td><b>ข้อ</b></td><td><b>โจทย์และเฉลย</b></td><td><b>ที่มาในคลัง และเหตุผล</b></td></tr>`;
        for (const q of appendix) {
          const r = (byQ.get(q.qid) || [])[0];
          html += `<tr><td>${esc(q.qid)}<br>${esc(KIND[q.sourceType] || '')}</td><td>${esc(q.q.slice(0, 260))}${keyText(q) ? `<br><b>เฉลย</b> ${esc(keyText(q))}` : ''}</td><td>${esc(humanSource(q.verified || q.source) || '-')}<br><i>${esc(r?.why || 'ยังไม่ได้รัน')}</i></td></tr>`;
        }
        html += '</table>';
      }
      html += '</body></html>';
      const name = `${paper.date || '0000-00-00'} ${subject} ${paper.key}`;
      const htmlPath = path.join(out, `${name}.html`);
      fs.writeFileSync(htmlPath, html);
      const page = await browser.newPage();
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load', timeout: 180_000 });
      await page.pdf({
        path: path.join(out, `${name}.pdf`), format: 'A4', printBackground: true, displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: `<div style="font-size:7.5px;width:100%;text-align:center;color:#888">${esc(subject)} ${paper.key} <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
        margin: { top: '13mm', bottom: '15mm', left: '12mm', right: '12mm' },
      });
      await page.close();
      console.log(`${subject} ${paper.key}: ${path.join(out, `${name}.pdf`)} (${main.length} with crops, ${appendix.length} in the appendix)`);
    }
  } finally {
    await browser.close();
  }
}
