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
 *  breaks kept, bullets as •, table rows as cells joined by ' / ', citation
 *  marks and emphasis markers removed, links as 'text (url)'. */
export function plainText(md) {
  const src = String(md || '').replace(/```\w*\n?/g, '');
  const out = [];
  for (const line of src.split(/\r?\n/)) {
    if (/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line)) continue; // table rule
    let l = line.replace(/^\s*#{1,6}\s+/, '').replace(/^>\s?/, '');
    if (/^\s*\|.*\|\s*$/.test(l)) l = l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()).filter(Boolean).join(' / ');
    l = l.replace(/^(\s*)[-*•]\s+/, '$1• ').replace(/^(\s*)(\d+)[.)]\s+/, '$1$2. ');
    l = l.replace(/\s*\[(\d{1,2}(?:\s*[,–-]\s*\d{1,2})*)\](?!\()/g, '');
    l = l.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '$1 ($2)');
    l = l.replace(/\*\*|__|`/g, '').replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,:;!?]|$)/g, '$1$2');
    out.push(l.replace(/[ \t]+$/, '').replace(/ {2,}/g, ' '));
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Plain text for a chat app: question, answer, where to ask more. LINE's share
 *  URL carries the text in the query, so it is cut on a word under ~1,400 chars. */
export function shareText(question, answerMd, limit = 1400) {
  const body = plainText(answerMd);
  let text = `${question.trim()}\n\n${body}`;
  if (text.length > limit) {
    let cut = text.slice(0, limit);
    const br = Math.max(cut.lastIndexOf('\n'), cut.lastIndexOf(' '));
    if (br > limit * 0.7) cut = cut.slice(0, br);
    text = `${cut}…`;
  }
  return `${text}\n\nถามต่อที่ ${SITE}`;
}

export const lineUrl = (text) => `https://line.me/R/share?text=${encodeURIComponent(text)}`;

/** A study file as one line of an export: its title, then where it opens. */
const fileLabel = (f) => `${f.title}${f.page > 1 ? ` (หน้า ${f.page})` : ''}`;

/** Markdown with the sources as a numbered link list and the files as a list
 *  of links that open at their page (Notion keeps both). */
export function markdownWithSources(question, answerMd, sources = [], files = []) {
  const src = sources.length ? `\n\n**แหล่งที่มา**\n${sources.map((s) => `${s.n}. [${s.title}](${s.url})`).join('\n')}` : '';
  const fl = files.length ? `\n\n**สไลด์และเอกสาร**\n${files.map((f) => `- [${fileLabel(f)}](${f.open})`).join('\n')}` : '';
  return `## ${question.trim()}\n\n${answerMd.trim()}${src}${fl}\n\n_จาก ${SITE}_`;
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Rich text for Google Docs: the rendered answer's HTML plus linked sources and files. */
export function htmlWithSources(question, answerHtml, sources = [], files = []) {
  const src = sources.length
    ? `<p><strong>แหล่งที่มา</strong></p><ol>${sources.map((s) => `<li><a href="${esc(s.url)}">${esc(s.title)}</a></li>`).join('')}</ol>`
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
