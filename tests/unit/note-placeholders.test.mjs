// A "🚧 รอเติม" line is an author's marker. The notes reader (note-corpus) and VetWiki (vetwiki/index) take notes
// through withoutPlaceholders(); this test fails when any notes file would still draw one, or a section with
// nothing left in it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { isPlaceholderLine, withoutPlaceholders } from '../../src/data/note-placeholders.js';
import { NOTE_SOURCES, loadNotesSubject } from '../../src/data/note-corpus.js';
import { listTopics, loadTopic } from '../../src/lib/vetwiki/index.js';

function drawnLines(note) {
  const lines = [];
  const walk = (body) => {
    for (const item of body || []) {
      if (typeof item === 'string') lines.push(item);
      else if (item && Array.isArray(item.bullets)) item.bullets.forEach((b) => lines.push(typeof b === 'string' ? b : `${b.label}: ${b.value}`));
      else if (item && typeof item === 'object' && 'sub' in item) { lines.push(item.sub); walk(item.body); }
      else if (item && typeof item === 'object' && 'callout' in item) lines.push(item.callout);
    }
  };
  for (const s of note.sections || []) { lines.push(s.heading); walk(s.body); }
  return lines;
}

test('a placeholder line, an emptied list and an emptied section are not drawn', () => {
  const notes = {
    t: {
      title: 'T',
      sections: [
        { heading: 'kept', body: ['real line', { bullets: ['🚧 รอเติม — later', 'real bullet'] }, '🚧 รอเติม — x'] },
        { heading: 'emptied', body: [{ bullets: ['🚧 รอเติม — only this'] }, { sub: 'inner', body: ['🚧 รอเติม'] }] },
      ],
    },
  };
  const out = withoutPlaceholders(notes);
  assert.equal(out.t.sections.length, 1);
  assert.deepEqual(out.t.sections[0].body, ['real line', { bullets: ['real bullet'] }]);
  assert.equal(isPlaceholderLine('🚧 รอเติม — a'), true);
  assert.equal(isPlaceholderLine('ปิดถุงด้วยคลิปโลหะ'), false);
  assert.equal(notes.t.sections.length, 2, 'the data itself is not changed');
});

test('the notes reader draws no placeholder line and no empty section in any subject', async () => {
  for (const subject of Object.keys(NOTE_SOURCES)) {
    const notes = await loadNotesSubject(subject);
    for (const [topic, note] of Object.entries(notes)) {
      for (const s of note.sections || []) assert.ok((s.body || []).length > 0, `${subject}/${topic}: "${s.heading}" is empty`);
      const bad = drawnLines(note).filter(isPlaceholderLine);
      assert.deepEqual(bad, [], `${subject}/${topic} draws a placeholder`);
    }
  }
});

test('VetWiki draws no placeholder line in any article', () => {
  for (const { subject, topic } of listTopics()) {
    const text = JSON.stringify(loadTopic(subject, topic));
    assert.ok(!/🚧[^"]{0,4}รอเติม/.test(text), `${subject}/${topic} draws a placeholder`);
  }
});
