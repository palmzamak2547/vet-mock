// ============================================================
// share.js — an answer, handed to the apps students already use
// ============================================================
// Every target here works without signing in to anything: LINE takes text
// through its share URL; Notion and Google Docs get a clipboard copy (markdown
// or rich text) and a fresh page to paste into; Anki imports a tab-separated
// file of real bank questions; calendars get review reminders. Pure builders,
// so the strings can be tested without a browser.


const SITE = 'https://ai.vetmock.com';

/** Markdown to plain text that still reads like the answer: paragraphs and line
 *  breaks kept, bullets as •, table rows as cells joined by ' / ', emphasis
 *  markers removed, links as 'text (url)'. Citation marks [n] are removed,
 *  unless `citations` (the text then carries its numbered sources below). */
export function plainText(md, { citations = false } = {}) {
  const src = String(md || '').replace(/```\w*\n?/g, '');
  const out = [];
  for (const line of src.split(/\r?\n/)) {
    if (/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line)) continue; // table rule
    let l = line.replace(/^\s*#{1,6}\s+/, '').replace(/^>\s?/, '');
    if (/^\s*\|.*\|\s*$/.test(l)) l = l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()).filter(Boolean).join(' / ');
    l = l.replace(/^(\s*)[-*•]\s+/, '$1• ').replace(/^(\s*)(\d+)[.)]\s+/, '$1$2. ');
    if (!citations) l = l.replace(/\s*\[(\d{1,2}(?:\s*[,–-]\s*\d{1,2})*)\](?!\()/g, '');
    l = l.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '$1 ($2)');
    l = l.replace(/\*\*|__|`/g, '').replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,:;!?]|$)/g, '$1$2');
    out.push(l.replace(/[ \t]+$/, '').replace(/ {2,}/g, ' '));
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** A source as one line: number and title, and what tells two sources with one
 *  title apart (two sections of one lecture clip read as the same title). */
export const sourceLabel = (s) => `${s.title}${s.subtitle && s.subtitle !== s.title ? `, ${s.subtitle}` : ''}`;

/**
 * Plain text for a chat app or a calendar note: the question, the answer with
 * its citation numbers, the numbered sources they point to, where to ask more.
 * LINE's share URL carries the text in the query, so a long answer is cut where
 * a paragraph or a bullet ends (never mid-sentence) and marked with "…"; the
 * sources and the link are never the part that is cut.
 */
export function shareText(question, answerMd, { sources = [], limit = 2000, maxSources = 8 } = {}) {
  const list = sources.slice(0, maxSources);
  const tail = [
    list.length ? `แหล่งที่มา\n${list.map((s) => `${s.n}. ${sourceLabel(s)}`).join('\n')}` : '',
    `ถามต่อที่ ${SITE}`,
  ].filter(Boolean).join('\n\n');
  const head = question.trim();
  let body = plainText(answerMd, { citations: list.length > 0 });
  if (list.length && list.length < sources.length) body = keepCitations(body, new Set(list.map((s) => s.n)));
  const room = Math.max(240, limit - head.length - tail.length - 6);
  if (body.length > room) {
    const cut = body.slice(0, room);
    const end = Math.max(cut.lastIndexOf('\n\n'), cut.lastIndexOf('\n'));
    body = `${(end > room * 0.5 ? cut.slice(0, end) : cut.slice(0, Math.max(cut.lastIndexOf(' '), Math.floor(room * 0.8)))).trim()}\n…`;
  }
  return `${head}\n\n${body}\n\n${tail}`;
}

/** A citation mark keeps only the numbers still listed below it ([2, 5] with
 *  sources 1 to 3 kept reads [2]); a mark left with none goes. */
function keepCitations(text, kept) {
  return text.replace(/(\s*)\[(\d{1,2}(?:\s*[,–-]\s*\d{1,2})*)\](?!\()/g, (mark, space, inner) => {
    const nums = inner.split(/\s*,\s*/).flatMap((part) => {
      const [a, b = a] = part.split(/\s*[–-]\s*/).map(Number);
      return Array.from({ length: Math.max(0, b - a) + 1 }, (_, i) => a + i);
    }).filter((n) => kept.has(n));
    return nums.length ? `${space}[${nums.join(', ')}]` : '';
  });
}

export const lineUrl = (text) => `https://line.me/R/share?text=${encodeURIComponent(text)}`;

// line.me answers 414 once its URL passes about 8,190 bytes (measured 2026-10-28)
// and a Thai letter is 9 bytes encoded, so the text is fitted to the encoded size:
// the answer is shortened first, the source list only when the sources alone do not fit.
const LINE_URL_MAX = 8000;

export function lineShareUrl(question, answerMd, sources = []) {
  let url = '';
  for (const maxSources of [8, 5, 3, 1, 0]) {
    for (let limit = 2000; limit >= 400; limit -= 100) {
      url = lineUrl(shareText(question, answerMd, { sources, limit, maxSources }));
      if (url.length <= LINE_URL_MAX) return url;
    }
  }
  return url;
}

/** A study file as one line of an export: its title, then where it opens. */
const fileLabel = (f) => `${f.title}${f.page > 1 ? ` (หน้า ${f.page})` : ''}`;

/** Markdown with the sources as a numbered link list and the files as a list
 *  of links that open at their page (Notion keeps both). */
export function markdownWithSources(question, answerMd, sources = [], files = []) {
  const src = sources.length ? `\n\n**แหล่งที่มา**\n${sources.map((s) => `${s.n}. [${sourceLabel(s).replace(/[[\]]/g, '')}](${s.url})`).join('\n')}` : '';
  const fl = files.length ? `\n\n**สไลด์และเอกสาร**\n${files.map((f) => `- [${fileLabel(f)}](${f.open})`).join('\n')}` : '';
  return `## ${question.trim()}\n\n${answerMd.trim()}${src}${fl}\n\n_จาก ${SITE}_`;
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Rich text for Google Docs: the rendered answer's HTML plus linked sources and files. */
export function htmlWithSources(question, answerHtml, sources = [], files = []) {
  const src = sources.length
    ? `<p><strong>แหล่งที่มา</strong></p><ol>${sources.map((s) => `<li><a href="${esc(s.url)}">${esc(sourceLabel(s))}</a></li>`).join('')}</ol>`
    : '';
  const fl = files.length
    ? `<p><strong>สไลด์และเอกสาร</strong></p><ul>${files.map((f) => `<li><a href="${esc(f.open)}">${esc(fileLabel(f))}</a></li>`).join('')}</ul>`
    : '';
  return `<h2>${esc(question.trim())}</h2>${answerHtml}${src}${fl}<p><em>จาก ${SITE}</em></p>`;
}

/** Anki "Basic" notes, tab separated, one per line; tabs and newlines inside a
 *  field become spaces and <br> (Anki reads HTML in fields). */
export function ankiTsv(questions) {
  const f = (s) => esc(String(s ?? '')).replace(/\t/g, ' ').replace(/\r?\n/g, '<br>');
  const lines = ['#separator:tab', '#html:true', '#tags:vetmock'];
  for (const q of questions) {
    const front = `${f(q.stem)}<br><br>${q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${f(o)}`).join('<br>')}`;
    const back = `${String.fromCharCode(65 + q.answer)}. ${f(q.options[q.answer])}${q.explain ? `<br><br>${f(q.explain)}` : ''}`;
    lines.push(`${front}\t${back}`);
  }
  return `${lines.join('\n')}\n`;
}

const utc = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Expanding review intervals (1, 3, 7 days), each at 20:00 local time: the
 *  spacing effect, in the shape SM-2 style schedules start with. */
export function reviewTimes(now = new Date(), days = [1, 3, 7]) {
  return days.map((d) => {
    const t = new Date(now);
    t.setDate(t.getDate() + d);
    t.setHours(20, 0, 0, 0);
    return t;
  });
}

export function googleCalendarUrl(title, details, start, minutes = 30) {
  const end = new Date(start.getTime() + minutes * 60000);
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, details, dates: `${utc(start)}/${utc(end)}` });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** An .ics with one VEVENT per review time (RFC 5545: CRLF, folded at 75 octets). */
export function icsFile(title, details, starts, minutes = 30, now = new Date()) {
  const fold = (line) => {
    const out = [];
    let s = line;
    while (new TextEncoder().encode(s).length > 75) {
      let n = 74;
      while (new TextEncoder().encode(s.slice(0, n)).length > 74) n--;
      out.push(s.slice(0, n));
      s = ` ${s.slice(n)}`;
    }
    out.push(s);
    return out.join('\r\n');
  };
  const t = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const stamp = utc(now);
  const events = starts.map((st, i) => [
    'BEGIN:VEVENT',
    `UID:vmai-${stamp}-${i}@ai.vetmock.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${utc(st)}`,
    `DTEND:${utc(new Date(st.getTime() + minutes * 60000))}`,
    fold(`SUMMARY:${t(title)}`),
    fold(`DESCRIPTION:${t(details)}`),
    `URL:${SITE}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:-PT10M', fold(`DESCRIPTION:${t(title)}`), 'END:VALARM',
    'END:VEVENT',
  ].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//VetMock//AI//TH', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR', ''].join('\r\n');
}

export function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function copyRich(html, plain) {
  if (window.ClipboardItem && navigator.clipboard?.write) {
    await navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([plain], { type: 'text/plain' }),
    })]);
    return;
  }
  await navigator.clipboard.writeText(plain);
}
