// A "🚧 รอเติม" line in a notes file marks what is not written yet. It is for authors, never for a student:
// the notes reader and VetWiki take notes through withoutPlaceholders(), which drops such lines, a list or
// sub-section left with nothing, and a section left with nothing. tests/unit/note-placeholders.test.mjs fails
// when any notes file would still draw one.

export function isPlaceholderLine(value) {
  return typeof value === 'string' && /^\s*🚧/.test(value) && value.includes('รอเติม');
}

function cleanBody(body) {
  const out = [];
  for (const item of body || []) {
    if (typeof item === 'string') {
      if (!isPlaceholderLine(item)) out.push(item);
    } else if (item && Array.isArray(item.bullets)) {
      const bullets = item.bullets.filter((b) => !isPlaceholderLine(typeof b === 'string' ? b : b && b.value));
      if (bullets.length) out.push(bullets.length === item.bullets.length ? item : { ...item, bullets });
    } else if (item && typeof item === 'object' && 'sub' in item) {
      const inner = cleanBody(item.body);
      if (inner.length && !isPlaceholderLine(item.sub)) out.push({ ...item, body: inner });
    } else if (item && typeof item === 'object' && 'callout' in item) {
      if (!isPlaceholderLine(item.callout)) out.push(item);
    } else {
      out.push(item);
    }
  }
  return out;
}

/** A subject's notes ({ topicId: note }) without placeholder lines or sections left empty by them. */
export function withoutPlaceholders(notes) {
  if (!notes || typeof notes !== 'object') return notes;
  const out = {};
  for (const [topicId, note] of Object.entries(notes)) {
    if (!note || !Array.isArray(note.sections)) { out[topicId] = note; continue; }
    const sections = [];
    for (const section of note.sections) {
      if (isPlaceholderLine(section.heading)) continue;
      const body = cleanBody(section.body);
      if (body.length) sections.push(body.length === (section.body || []).length && body.every((b, i) => b === section.body[i]) ? section : { ...section, body });
    }
    out[topicId] = sections.length === note.sections.length && sections.every((s, i) => s === note.sections[i]) ? note : { ...note, sections };
  }
  return out;
}
