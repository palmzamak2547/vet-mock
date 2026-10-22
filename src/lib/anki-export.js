// ============================================================
// Questions as an Anki import file
// ============================================================
// Anki (2.1.55 and later, desktop and AnkiMobile) imports a plain-text file
// whose header lines say how to read it: tab-separated, HTML fields, the
// Basic note type and the deck to file the cards in. One card per question:
// the front is the stem with its choices, the back the answer and the
// explanation. Every type the app grades has a back; an essay keeps its
// model answer. Markdown bold and line breaks become HTML, everything else
// is escaped, so a question can never inject markup into the card.
// ============================================================

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Escaped text with **bold** and line breaks kept; tabs would end the field.
const html = (s) => esc(s).replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>').replace(/\t/g, ' ').replace(/\r?\n/g, '<br>');

const LETTERS = 'ABCDEFGHIJ';

function front(q) {
  const parts = [html(q.q)];
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

/** Tab-separated Anki text for these questions; questions with no answer to show are left out. */
export function ankiText(questions, { deck = 'VetMock' } = {}) {
  const rows = [];
  for (const q of questions) {
    const back = answer(q);
    if (!q?.q || !back) continue;
    const explain = q.explain ? `<br><br>${html(q.explain)}` : '';
    const tags = ['vetmock', q.subject, ...(q.tags || [])].filter(Boolean).map((t) => String(t).replace(/\s+/g, '_')).join(' ');
    rows.push([front(q), `<b>${back}</b>${explain}`, tags].join('\t'));
  }
  const header = ['#separator:tab', '#html:true', '#notetype:Basic', `#deck:${deck.replace(/[\t\r\n]/g, ' ')}`, '#tags column:3'];
  return { text: [...header, ...rows].join('\n') + '\n', count: rows.length };
}
