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
// ============================================================

import { useState } from 'react';
import { originPaperNote } from '../lib/exam-scope.js';
import { humanSource, recordingMoments, momentHref } from '../lib/source-label.js';
import { isDisplayableWikiRef, getEligibleCitationForQuestion } from '../lib/citation-gate.js';
import { archivedSourceUrl, googleDriveSourceUrl } from '../lib/vca-library.js';
import NavIcon from './NavIcon.jsx';

export { isDisplayableWikiRef, getEligibleCitationForQuestion };

export default function QSourceChip({ q, store }) {
  const [open, setOpen] = useState(false);
  const sourceDocumentUrl = archivedSourceUrl(q?.sourceDocument) || googleDriveSourceUrl(q?.sourceDocument?.url);

  // Evaluate strict citation eligibility via getEligibleCitationForQuestion
  const eligibleCitation = getEligibleCitationForQuestion(q?.id, q?.subject);

  // Filter valid, approved, and verified wikiReferences
  const displayableWikiRefs = Array.isArray(q?.wikiRefs)
    ? q.wikiRefs.filter(isDisplayableWikiRef)
    : [];
  const hasDisplayableWikiRefs = !!eligibleCitation || displayableWikiRefs.length > 0;

  // Show nothing if Q has zero citation fields
  const hasAny = !!(q?.source || q?.verified || q?.examOrigin || q?.flag || eligibleCitation || hasDisplayableWikiRefs);
  if (!hasAny) return null;

  // Compact summary: prefer examOrigin (most user-meaningful), fall
  // back to source filename if examOrigin missing. The source reads through
  // humanSource like the verified row does: "WRttiWQ7D9s [28:22]" is stored,
  // "คาบ 3 (2 ก.ย.) นาที 28:22" is what the นิสิต sees.
  const paperNote = originPaperNote(q);
  const summary = q.examOrigin
    ? q.examOrigin
    : (typeof q.source === 'string' ? humanSource(q.source).replace(/\.pdf.*$/, '.pdf') : (hasDisplayableWikiRefs ? 'มีข้อมูลอ้างอิง Wiki' : 'มีแหล่งอ้างอิง'));
  const moments = open ? momentsByClip(q) : [];

  return (
    // The page's face, not mono: the line opens with Thai ("ที่มา:") and
    // mono has no Thai glyphs.
    <div style={{
      marginTop: 14,
      padding: '0 12px',
      borderRadius: 10,
      background: 'rgba(74, 107, 74, 0.04)',
      border: '1px solid var(--clr-border)',
      fontSize: 12,
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
        <span style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: 0,
        }}>
          ที่มา: {summary}
        </span>
        {/* Full opacity: at 0.7 this 11px hint measured 3.48:1 in light and
            3.91:1 in dark, under the 4.5 floor. */}
        <span style={{ fontSize: 12, flex: '0 0 auto' }}>
          {open ? '▴ ซ่อน' : '▾ ดูเต็ม'}
        </span>
      </button>

      {paperNote && (
        <div style={{ margin: '0 0 8px', fontSize: 12, lineHeight: 1.5 }}>
          หมายเหตุ: {paperNote}
        </div>
      )}

      {open && (
        <div style={{ margin: '0 0 10px', paddingTop: 10, borderTop: '1px dashed var(--clr-border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {eligibleCitation && (
            <div style={{ padding: 8, borderRadius: 6, background: 'rgba(74, 107, 74, 0.12)', border: '1px solid var(--clr-sage)' }}>
              <a
                href={eligibleCitation.url}
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.__vetmock_navigate) {
                    e.preventDefault();
                    window.__vetmock_navigate(eligibleCitation.url);
                  }
                }}
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
            <Row label="ที่มา" value={humanSource(q.source)} />
          )}
          {q.verified && (
            <Row label="ตรวจกับ" value={humanSource(q.verified)} icon="✓" iconColor="var(--clr-sage)" />
          )}
          {/* Each cited moment of a recording opens that clip at that second.
              A new tab, so the question the student is on stays where it is. */}
          {moments.map((clip) => (
            <div key={clip.videoId} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, fontSize: 11 }}>
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
                    color: 'var(--clr-sage-text)', fontWeight: 600, fontSize: 11.5, whiteSpace: 'nowrap',
                  }}
                >
                  นาที {m.stamp}
                </a>
              ))}
            </div>
          ))}
          {sourceDocumentUrl && (
            <a href={sourceDocumentUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, color: 'var(--clr-sage-text)', overflowWrap: 'anywhere' }}>
              เปิดเอกสารต้นฉบับ
              {Number.isInteger(q.sourceDocument.page) && q.sourceDocument.page > 0 ? ` (อ้างหน้า ${q.sourceDocument.page})` : ''}
            </a>
          )}
          {q.flag?.note && (
            <Row
              label={q.flag.severity === 'major' ? 'ข้อควรระวังสำคัญ' : 'หมายเหตุ'}
              value={q.flag.note}
              icon="⚠️"
              iconColor={
                q.flag.severity === 'major' ? 'var(--clr-rose)'
                : q.flag.severity === 'minor' ? 'var(--clr-gold)'
                : 'var(--clr-ink-soft)'
              }
            />
          )}
          {q.tags && q.tags.length > 0 && (
            <Row label="แท็ก" value={q.tags.join(', ')} />
          )}
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
                color: 'var(--clr-sage-text)', fontSize: 11.5, fontWeight: 600,
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
        <span style={{ flex: '0 0 auto', color: iconColor || 'inherit', fontSize: 11 }}>
          {icon}
        </span>
      )}
      {/* The labels are Thai now: no uppercasing, and no tracking, which
          pulls Thai tone marks away from their consonants. */}
      <span style={{ flex: '0 0 auto', minWidth: 60, color: 'var(--clr-ink-soft)', fontSize: 11, letterSpacing: 0 }}>
        {label}
      </span>
      <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere', color: 'var(--clr-ink)', fontFamily: 'inherit', fontSize: 11 }}>
        {value}
      </span>
    </div>
  );
}
