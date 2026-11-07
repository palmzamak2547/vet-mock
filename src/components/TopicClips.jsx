// ============================================================
// TopicClips — "ดูช่วงนี้": the clips that teach a topic, one row each,
// surest first, each opening at its surest stretch.
// ============================================================
// On a topic card it lists them; under a question (quiet) it offers the one
// best stretch and says nothing when there is none.
import React, { useEffect, useState } from 'react';
import '../styles-clip.css';
import { topicClips, clock } from '../lib/video-library.js';
import { momentHref } from '../lib/source-label.js';

const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const thaiDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  return m ? `${Number(m[3])} ${TH_MONTH[Number(m[2]) - 1]} ${String(Number(m[1]) + 543).slice(2)}` : '';
};

export default function TopicClips({ topicId, limit = 8, quiet = false }) {
  const [clips, setClips] = useState(null);
  useEffect(() => {
    let off = false;
    setClips(null);
    topicClips(topicId).then((c) => { if (!off) setClips(c); }).catch(() => { if (!off) setClips([]); });
    return () => { off = true; };
  }, [topicId]);

  if (clips === null) return quiet ? null : <p className="vmx-clip-note" aria-busy="true">กำลังหาคลิปของหัวข้อนี้</p>;
  if (!clips.length) return quiet ? null : <p className="vmx-clip-note">ยังไม่มีคลิปที่สอนหัวข้อนี้</p>;
  return (
    <ol className="vmx-clip-list vmx-topic-clips" aria-label={quiet ? 'คลิปที่สอนหัวข้อนี้' : undefined}>
      {clips.slice(0, limit).map((c) => (
        <li key={`${c.v}-${c.s}`}>
          {/* A new tab, so the topic or the question stays where it is. */}
          <a className="vmx-clip-row vmx-topic-clip" href={momentHref({ videoId: c.v, seconds: c.s })} target="_blank" rel="noopener">
            <span className="vmx-clip-t">{clock(c.s)}</span>
            <span className="vmx-clip-text">
              <strong className="vmx-clip-ctitle">{quiet ? 'ดูช่วงที่สอนหัวข้อนี้' : c.video.title}</strong>
              <span className="vmx-clip-cline">
                {quiet ? `${c.video.title}, ` : ''}{thaiDate(c.video.date)}, {Math.max(1, Math.round(c.sec / 60))} นาที{c.n > 1 ? ` ใน ${c.n} ช่วง` : ''}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
