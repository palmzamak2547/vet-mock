// Where the site meets the apps students already use: the phone's own share sheet (or LINE,
// Facebook and X on a desk), Google Calendar and any .ics calendar, and the flashcard and
// spreadsheet apps a set can be exported to (Anki, Quizlet, Google Sheets, Notion).

import { FORMAT, SOURCES, roundCalendar } from '../data/exam.js';
import { LETTERS } from './format.js';

export const SITE = 'https://vca.vetmock.com';

/** An absolute link to a path on this site. */
export const siteUrl = (path = '/') => new URL(path, SITE).href;

/** True where the device has its own share sheet (phones, and some desks). */
export const canShareNatively = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';

/** Links that open each app's own share screen. */
export function shareTargets({ url, text }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return [
    { id: 'line', label: 'LINE', href: `https://social-plugins.line.me/lineit/share?url=${u}&text=${t}` },
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { id: 'x', label: 'X', href: `https://x.com/intent/post?text=${t}&url=${u}` },
  ];
}

/**
 * The device's share sheet. True once it has opened (shared, or closed by the student, which
 * is their answer); false when there is none or it refused, so the page offers its own.
 */
export async function shareNatively({ title, text, url }) {
  if (!canShareNatively()) return false;
  try {
    await navigator.share({ title, text, url });
    return true;
  } catch (err) {
    return err?.name === 'AbortError';
  }
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and some in-app views: a hidden field and the copy command.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.append(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    area.remove();
    return ok;
  }
}

/** Save text as a file the browser downloads. */
export function saveFile(name, text, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ── calendars ─────────────────────────────────────────────────────────────────────────────────

const utc = (date, time) => {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - 7, mm)).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

/** A Google Calendar link that opens a new event for one part of a round, filled in. */
export function googleCalendarUrl(round, part) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `สอบ VCA หมวด ${part.part} (รอบ ${round.id})`,
    dates: `${utc(part.date, part.from)}/${utc(part.date, part.to)}`,
    details: `${FORMAT.perPart} ข้อ ${FORMAT.minutesPerPart / 60} ชั่วโมง ตรวจประกาศล่าสุดได้ที่ ${SOURCES[round.source].url}\nซ้อมได้ที่ ${SITE}/exam`,
    ctz: 'Asia/Bangkok',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** The round as an .ics file, for Apple Calendar, Outlook and the rest. */
export function saveRoundCalendar(round) {
  saveFile(`vca-${round.id.replace('/', '-')}.ics`, roundCalendar(round), 'text/calendar;charset=utf-8');
}

// ── flashcards and spreadsheets ───────────────────────────────────────────────────────────────

const plain = (s) => String(s ?? '').replace(/\*\*|__|`/g, '').replace(/\s+/g, ' ').trim();
const esc = (s) => plain(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Rows for export, in the order the student saw them: the stem, the options as shown, the
 * letter that was right, the explanation, where the question came from.
 * @param {Array<{ q: any, order: number[], domainName: string }>} items
 */
export function exportRows(items) {
  return items.filter((it) => it.q).map(({ q, order, domainName }) => {
    const shown = (order && order.length ? order : q.options.map((_, i) => i)).map((orig) => q.options[orig]);
    const row = (order && order.length ? order : q.options.map((_, i) => i)).indexOf(q.answer);
    return {
      id: q.id, domain: domainName, stem: plain(q.q), options: shown.map(plain),
      letter: LETTERS[row], answer: plain(q.options[q.answer]), explain: plain(q.explain), source: plain(q.source),
    };
  });
}

/**
 * Anki's text import: tab-separated, HTML allowed, a header that tells Anki so, and tags.
 * File > Import in Anki reads it as Basic notes (front: question, back: answer and why).
 */
export function toAnki(rows) {
  const tag = (s) => String(s).replace(/\s+/g, '_');
  const lines = rows.map((r) => {
    const front = `${esc(r.stem)}<ol type="A">${r.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ol>`;
    const back = `<b>${r.letter}. ${esc(r.answer)}</b>${r.explain ? `<br><br>${esc(r.explain)}` : ''}${r.source ? `<br><br><small>${esc(r.source)}</small>` : ''}`;
    return [front, back, `VetMockVCA ${tag(r.domain)}`].map((f) => f.replace(/\t/g, ' ')).join('\t');
  });
  return ['#separator:tab', '#html:true', '#tags column:3', ...lines].join('\n') + '\n';
}

/** Quizlet's import box: term, a tab, the definition; one card a line. */
export function toQuizlet(rows) {
  return rows.map((r) => {
    const term = `${r.stem} ${r.options.map((o, i) => `(${LETTERS[i]}) ${o}`).join(' ')}`;
    const def = `${r.letter}. ${r.answer}${r.explain ? `  ${r.explain}` : ''}`;
    return `${term.replace(/[\t\n]/g, ' ')}\t${def.replace(/[\t\n]/g, ' ')}`;
  }).join('\n');
}

/** CSV for Google Sheets, Excel and Notion, with a byte-order mark so Thai opens right in Excel. */
export function toCsv(rows) {
  const cell = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = ['No.', 'หมวด', 'โจทย์', 'A', 'B', 'C', 'D', 'E', 'คำตอบ', 'คำอธิบาย', 'ที่มา'];
  const body = rows.map((r) => [r.id, r.domain, r.stem, ...Array.from({ length: 5 }, (_, i) => r.options[i] || ''), `${r.letter}. ${r.answer}`, r.explain, r.source].map(cell).join(','));
  return `﻿${[head.join(','), ...body].join('\r\n')}\r\n`;
}
