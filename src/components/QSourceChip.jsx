// ============================================================
// QSourceChip — surface source/verified/examOrigin per Q
// ============================================================
//
// Friend's review (2026-05-12): "เพิ่มชั้น trust/source/verification
// ให้โจทย์ทุกก้อน" — every Q should let the user see where it came
// from and who verified it.
//
// Renders a compact chip with the source filename, expandable to a
// detail panel showing all citation fields. Iron Rule 0: this
// chip just READS existing fields (q.source, q.verified, q.examOrigin,
// q.flag) — no fabrication.
//   5.33: the per-question report button lived here but no caller
// ever passed `onReport`, so it was unreachable — removed. Reporting
// happens through the question-card toolbar flag.
//
// Placement: inside the Question component, below the options +
// explain panel, above the optional image-fallback strip.
//
// 5.189.2: measured on 1 Nov 2026, the line named the key on 23 questions and
// what "ดูเต็ม" opened (the pointer, the checking note, the tags) on 1,795 of
// 7,814. Until the key is on screen (`revealed`) the line then named only the
// kind of source; since 11 Nov nothing of the source renders before it.
//
// The panel also lists `verificationSources` (what the key was checked
// against) and names the question number of `sourceDocument` beside its page
// (lib/source-refs.js). Both wait for the key like the rest of the panel.
//
// Quiet labels (11 Nov 2026): nothing stands under the line. The source-scope
// sentence and a minor flag's note are rows of the panel; the closed line
// may carry one short paper tag after the answer (lib/exam-scope.js).
// ============================================================

import { useState, lazy, Suspense } from 'react';
import { originPaperNote, originPaperTag } from '../lib/exam-scope.js';
import { humanSource, recordingMoments, momentHref } from '../lib/source-label.js';
import { sourceLineAfterAnswer, readableSource as readable, cautionChipShown, tagTopicLabels } from '../lib/source-line.js';
// Lazy: a question pays for the video code only when its source opens.
const TopicClips = lazy(() => import('./TopicClips.jsx'));
import { isDisplayableWikiRef, getEligibleCitationForQuestion } from '../lib/citation-gate.js';
import { archivedSourceUrl, googleDriveSourceUrl, signedArchiveUrl } from '../lib/vca-library.js';
import { authHeader } from '../lib/api-auth.js';
import { verificationRefs, sourceDocumentPointer, verifiedLine } from '../lib/source-refs.js';
import NavIcon from './NavIcon.jsx';

export { isDisplayableWikiRef, getEligibleCitationForQuestion };

export default function QSourceChip({ q, revealed = false }) {
  const [open, setOpen] = useState(false);
  const sourceDocumentUrl = archivedSourceUrl(q?.sourceDocument) || googleDriveSourceUrl(q?.sourceDocument?.url);
  // The archived copy needs the member's session, which a plain link cannot send:
  // open the tab now (inside the tap, so it is not blocked), then send it to the
  // signed link, or to the Drive original when the archive cannot answer.
  const openArchived = async (event) => {
    if (!archivedSourceUrl(q?.sourceDocument)) return;
    event.preventDefault();
    const tab = window.open('about:blank', '_blank');
    const signed = await signedArchiveUrl(q.sourceDocument, { headers: await authHeader() }).catch(() => null);
    const target = signed || googleDriveSourceUrl(q?.sourceDocument?.url);
    if (!tab) { if (target) window.location.assign(target); return; }
    if (!target) { tab.close(); return; }
    tab.opener = null;
    tab.location.replace(target);
  };

  // Evaluate strict citation eligibility via getEligibleCitationForQuestion
  const eligibleCitation = getEligibleCitationForQuestion(q?.id, q?.subject);

  // Filter valid, approved, and verified wikiReferences
  const displayableWikiRefs = Array.isArray(q?.wikiRefs)
    ? q.wikiRefs.filter(isDisplayableWikiRef)
    : [];
  const hasDisplayableWikiRefs = !!eligibleCitation || displayableWikiRefs.length > 0;

  // Show nothing if Q has zero citation fields
  const hasAny = !!(q?.source || q?.verified || q?.examOrigin || q?.flag || eligibleCitation || hasDisplayableWikiRefs
    || (Array.isArray(q?.verificationSources) && q.verificationSources.length));
  // Nothing of the source before the answer (audit item 8, 11 Nov 2026): a
  // row that said only "later" stood on every question. It arrives with the
  // verdict, below the answer area, so nothing above it moves.
  if (!hasAny || !revealed) return null;

  // Compact summary: examOrigin, else the source pointer read through
  // humanSource ("WRttiWQ7D9s [28:22]" is stored, "คาบ 3 (2 ก.ย.) นาที 28:22"
  // is what the นิสิต sees).
  const summary = sourceLineAfterAnswer(q, { hasWikiRefs: hasDisplayableWikiRefs });
  // A source named for the other paper (a senior cohort sat it at another
  // point of the course). Never a line of its own: the closed line carries a
  // short tag only where its own text names that paper, and only after the
  // answer; one caution per card, so a card with the caution chip leaves it
  // to the panel. The sentence itself waits in the panel beside the source.
  const paperTag = !cautionChipShown(q?.flag) ? originPaperTag(q, summary) : null;
  const expanded = open;
  const paperNote = expanded ? originPaperNote(q) : null;
  // The caution chip's note is read from the chip; any other flag's note is a
  // หมายเหตุ here.
  const flagNote = expanded && !cautionChipShown(q?.flag) ? q?.flag?.note : null;
  const moments = expanded ? momentsByClip(q) : [];
  const refs = expanded ? verificationRefs(q) : [];
  const tagLabels = expanded ? tagTopicLabels(q) : [];
  const pointer = sourceDocumentPointer(q?.sourceDocument);

  return (
    // The page's face, not mono: the line opens with Thai ("ที่มา:") and
    // mono has no Thai glyphs.
    <div style={{
      marginTop: 14,
      padding: '0 12px',
      borderRadius: 10,
      background: 'rgba(74, 107, 74, 0.04)',
      border: '1px solid var(--clr-border)',
      fontSize: 14,
      color: 'var(--clr-ink-soft)',
    }}>
      {/* A class, not an inline all:unset (which reset the very rules the
          control needs): the 44px floor, a focus ring, and a line icon in
          place of the 📚 emoji. */}
      <button
        type="button"
        className="vmx-qsource-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={open ? 'ซ่อนแหล่งที่มา' : 'ดูแหล่งที่มาของข้อนี้'}
      >
        <NavIcon name="book" size={16} />
        {/* With a paper tag the line wraps instead of cutting: on a phone the
            cut fell before the paper's name, and the tag then corrected a
            word nobody could see. */}
        <span style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: paperTag ? 'normal' : 'nowrap',
          letterSpacing: 0,
        }}>
          ที่มา: {summary}
          {paperTag && <> <span className="vmx-qsource-tag" style={{ whiteSpace: 'nowrap' }}>{paperTag}</span></>}
        </span>
        {/* Full opacity: at 0.7 this 11px hint measured 3.48:1 in light and
            3.91:1 in dark, under the 4.5 floor. */}
        <span style={{ fontSize: 14, flex: '0 0 auto' }}>
          {open ? '▴ ซ่อน' : '▾ ดูเต็ม'}
        </span>
      </button>

      {expanded && (
        <div style={{ margin: '0 0 10px', paddingTop: 10, borderTop: '1px dashed var(--clr-border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {eligibleCitation && (
            <div style={{ padding: 8, borderRadius: 6, background: 'rgba(74, 107, 74, 0.12)', border: '1px solid var(--clr-sage)' }}>
              {/* A new tab, like the recording moments below: the chip shows
                  in exam mode, and a same-tab link pulled the student out of
                  the question they were on. */}
              <a
                href={eligibleCitation.url}
                target="_blank"
                rel="noopener"
                title="เปิดบทความใน VetWiki ในแท็บใหม่"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                {/* The title is the link. The page and anchor ids behind it
                    are the wiki's own addressing, not something to read. */}
                <Row label="อ้างอิง VetWiki" value={eligibleCitation.title} icon="🔗" iconColor="var(--clr-sage)" />
              </a>
            </div>
          )}
          {!eligibleCitation && hasDisplayableWikiRefs && displayableWikiRefs.map((ref, idx) => (
            <div key={idx} style={{ padding: 8, borderRadius: 6, background: 'rgba(74, 107, 74, 0.08)', border: '1px solid var(--clr-border)' }}>
              <Row label="ข้อมูลอ้างอิง Wiki" value={ref.label} icon="🔗" iconColor="var(--clr-sage)" />
            </div>
          ))}
          {/* Labels as ReviewView words them. Both fields render through
              humanSource: they store "7XyI0SjnuBA [12:34]" and the student
              reads "คาบ 1 (4 ส.ค.) นาที 12:34". */}
          {q.source && (
            <Row label="ที่มา" value={readable(humanSource(q.source))} />
          )}
          {/* Beside the source it explains. */}
          {paperNote && <Row label="หมายเหตุ" value={paperNote} />}
          {/* With a references list below, the line leaves its bare addresses to the list. */}
          {verifiedLine(q) && (
            <Row label="ตรวจกับ" value={readable(humanSource(verifiedLine(q)))} icon="✓" iconColor="var(--clr-sage)" />
          )}
          {/* Each cited moment of a recording opens that clip at that second.
              A new tab, so the question the student is on stays where it is. */}
          {moments.map((clip) => (
            <div key={clip.videoId} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, fontSize: 14 }}>
              <span style={{ color: 'var(--clr-ink)' }}>▶ {clip.session}</span>
              {clip.moments.map((m) => (
                <a
                  key={m.seconds}
                  href={momentHref(m)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`เปิดคลิป${m.label}`}
                  title="เปิดคลิปที่นาทีนี้ในแท็บใหม่"
                  style={{
                    display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 10px',
                    borderRadius: 999, border: '1px solid var(--clr-border)', textDecoration: 'none',
                    color: 'var(--clr-sage-text)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap',
                  }}
                >
                  นาที {m.stamp}
                </a>
              ))}
            </div>
          ))}
          {/* No cited minute: the lecture stretch that teaches the question's
              topic, so a wrong answer still leads to the part that explains it. */}
          {moments.length === 0 && q.topic && <Suspense fallback={null}><TopicClips topicId={q.topic} limit={1} quiet /></Suspense>}
          {sourceDocumentUrl && (
            <a href={sourceDocumentUrl} target="_blank" rel="noopener noreferrer" onClick={openArchived}
              style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: 'var(--clr-sage-text)', overflowWrap: 'anywhere' }}>
              เปิดเอกสารต้นฉบับ
              {pointer ? ` (${pointer})` : ''}
            </a>
          )}
          {/* The references the key was checked against, worded as
              vca.vetmock.com lists them: the title (a link when its address
              passes the URL check) with the locator after it. */}
          {refs.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, lineHeight: 1.5 }}>
              <span style={{ flex: '0 0 auto', minWidth: 60, color: 'var(--clr-ink-soft)', fontSize: 14, letterSpacing: 0 }}>
                อ้างอิง
              </span>
              <ul style={{ flex: 1, minWidth: 0, margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {refs.map((r, i) => (
                  <li key={i} style={{ overflowWrap: 'anywhere', fontSize: 14 }}>
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer nofollow"
                        title="เปิดเอกสารอ้างอิงในแท็บใหม่"
                        style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: 'var(--clr-sage-text)' }}>
                        {r.title}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--clr-ink)' }}>{r.title}</span>
                    )}
                    {r.locator && <span style={{ display: 'block', color: 'var(--clr-ink-soft)' }}>{r.locator}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {flagNote && <Row label="หมายเหตุ" value={readable(flagNote)} />}
          {/* Topics the question touches, by their labels; working slugs stay out. */}
          {tagLabels.length > 0 && <Row label="หัวข้อ" value={tagLabels.join(', ')} />}
          {/* The decks these citations name live in the app's own shelf —
              close the loop instead of leaving the reference as dead text. */}
          {q.subject && (q.source || q.verified) && (
            <button
              type="button"
              onClick={() => {
                try { sessionStorage.setItem('vmx-library-subject', q.subject); } catch { /* nicety */ }
                try { window.dispatchEvent(new Event('vmx-open-library')); } catch { /* no-op */ }
              }}
              style={{
                all: 'unset', cursor: 'pointer', marginTop: 4, minHeight: 44,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: 'var(--clr-sage-text)', fontSize: 14, fontWeight: 600,
                fontFamily: 'inherit',
              }}
              title="เปิดชั้นเอกสารของวิชานี้ในคลังเอกสาร"
            >
              เปิดชั้นเอกสารวิชานี้ →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Every moment the citation names, grouped by clip, so a row that cites one
// lecture at thirty moments reads as one lecture with thirty times.
function momentsByClip(q) {
  const clips = [];
  const seen = new Set();
  for (const field of [q.verified, q.source]) {
    if (typeof field !== 'string') continue;
    for (const m of recordingMoments(field)) {
      if (seen.has(`${m.videoId}@${m.seconds}`)) continue;
      seen.add(`${m.videoId}@${m.seconds}`);
      let clip = clips.find((c) => c.videoId === m.videoId);
      if (!clip) clips.push(clip = { videoId: m.videoId, session: m.session, moments: [] });
      clip.moments.push(m);
    }
  }
  return clips;
}

function Row({ label, value, icon, iconColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, lineHeight: 1.5 }}>
      {icon && (
        <span style={{ flex: '0 0 auto', color: iconColor || 'inherit', fontSize: 14 }}>
          {icon}
        </span>
      )}
      {/* The labels are Thai now: no uppercasing, and no tracking, which
          pulls Thai tone marks away from their consonants. */}
      <span style={{ flex: '0 0 auto', minWidth: 60, color: 'var(--clr-ink-soft)', fontSize: 14, letterSpacing: 0 }}>
        {label}
      </span>
      <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere', color: 'var(--clr-ink)', fontFamily: 'inherit', fontSize: 14 }}>
        {value}
      </span>
    </div>
  );
}
