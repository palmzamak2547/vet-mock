// ============================================================
// Questions as an Anki import file
// ============================================================
// Anki (2.1.55 and later, desktop and AnkiMobile) imports a plain-text file
// whose header lines say how to read it: tab-separated, HTML fields, the
// Basic note type and the deck to file the cards in. One card per question:
// the front is the stem with its choices, the back the answer and the
// explanation. Every type the app grades has a back; an essay keeps its
// model answer. A passage comes first on the front, since the question cannot
// be answered without it, and so does its figure (see figureSrc). Markdown bold and line breaks become HTML, a table
// (src/lib/rich-blocks.js) becomes a table, everything else is escaped, so a
// question can never inject markup into the card.
// ============================================================
import { splitBlocks } from './rich-blocks.js';
import { safeImageUrl } from './safe-url.js';

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Escaped text with **bold** and line breaks kept; tabs would end the field.
const html = (s) => esc(s).replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>').replace(/\t/g, ' ').replace(/\r?\n/g, '<br>');

const row = (cells, tag) => `<tr>${cells.map((c) => `<${tag}>${html(c)}</${tag}>`).join('')}</tr>`;
const table = (t) => `<table border="1" cellpadding="4" style="border-collapse:collapse">${row(t.head, 'th')}${t.rows.map((r) => row(r, 'td')).join('')}</table>`;
// A passage or an explanation: its prose as text, its tables as tables.
// A drawn figure stays in the app: the card keeps the explanation's prose and tables around it.
const rich = (s) => splitBlocks(s).filter((b) => b.type !== 'figure').map((b) => (b.type === 'table' ? table(b) : html(b.text))).join('<br>');

const LETTERS = 'ABCDEFGHIJ';

// A figure is part of the question. Anki opens the card away from the app, so
// a path the app serves goes in as an absolute vetmock.com address; a data:
// image or an allow-listed host stays as it is. Anything else (a blob: made on
// this device, a host the app would not render) has no address Anki can open,
// and the question is left out and counted rather than sent without it.
const ORIGIN = 'https://vetmock.com';
function figureSrc(q) {
  const raw = q.image || q.imagePath;
  if (!raw) return '';
  const safe = safeImageUrl(raw);
  if (!safe || safe.startsWith('blob:')) return null;
  return safe.startsWith('/') ? ORIGIN + safe : safe;
}

function front(q, src) {
  const parts = [];
  if (q.passage) parts.push(`${q.passage_title ? `<b>${html(q.passage_title)}</b><br>` : ''}${rich(q.passage)}`);
  if (src) parts.push(`<img src="${esc(src)}">`);
  parts.push(html(q.q));
  if (q.type === 'mcq' && Array.isArray(q.options)) {
    parts.push(q.options.map((o, i) => `${LETTERS[i]}. ${html(o)}`).join('<br>'));
  }
  if (q.type === 'tf') parts.push('ถูก หรือ ผิด');
  if (q.type === 'match' && Array.isArray(q.pairs)) parts.push(q.pairs.map((p) => html(p.left)).join('<br>'));
  return parts.join('<br><br>');
}

function answer(q) {
  if (q.type === 'mcq') return Number.isInteger(q.answer) && q.options?.[q.answer] != null ? `${LETTERS[q.answer]}. ${html(q.options[q.answer])}` : '';
  if (q.type === 'tf') return q.answer === true ? 'ถูก' : q.answer === false ? 'ผิด' : '';
  if (q.type === 'fill') return (q.blanks || []).map(html).join(', ');
  if (q.type === 'match') return (q.pairs || []).map((p) => `${html(p.left)} → ${html(p.right)}`).join('<br>');
  if (q.type === 'short' || q.type === 'essay') return html(q.model_answer || (q.keywords || []).join(', '));
  return '';
}

/**
 * Tab-separated Anki text for these questions; questions with no answer to
 * show are left out, and so are questions whose figure cannot travel with the
 * card (`noFigure` counts them, so the screen can say so).
 */
export function ankiText(questions, { deck = 'VetMock' } = {}) {
  const rows = [];
  let noFigure = 0;
  for (const q of questions) {
    const back = answer(q);
    if (!q?.q || !back) continue;
    const src = figureSrc(q);
    if (src === null) { noFigure += 1; continue; }
    const explain = q.explain ? `<br><br>${rich(q.explain)}` : '';
    const tags = ['vetmock', q.subject, ...(q.tags || [])].filter(Boolean).map((t) => String(t).replace(/\s+/g, '_')).join(' ');
    rows.push([front(q, src), `<b>${back}</b>${explain}`, tags].join('\t'));
  }
  const header = ['#separator:tab', '#html:true', '#notetype:Basic', `#deck:${deck.replace(/[\t\r\n]/g, ' ')}`, '#tags column:3'];
  return { text: [...header, ...rows].join('\n') + '\n', count: rows.length, noFigure };
}
