// ============================================================
// WikiTopicCard: "บันทึกเป็นภาพการ์ด" for a VetWiki topic
// ============================================================
// Loaded only when asked for (KnowledgeView lazy-loads it): the card kit,
// the subject's bookplate and Mochi come with it. The picture is drawn on
// the device, in the app's theme unless the student picks the other, and
// leaves through the same sheet as the other share cards.
// ============================================================

import { useCallback } from 'react';
import ShareCardSheet from './ShareCardSheet.jsx';
import { picture } from '../lib/share-card/kit.js';
import { drawTopicCard, topicLine } from '../lib/share-card/topic-card.js';
import { SUBJECT_COVERS } from '../data/subject-covers.js';
import { SHELF_SUBJECTS } from '../lib/vetwiki/shelf.generated.js';
import { MOCHI_POSE_ASSETS } from '../data/mochi-poses.generated.js';

export default function WikiTopicCard({ subject, topic, title, subjectName, chapter, claims, sources, conflicts, url, onClose }) {
  const address = url.replace(/^https?:\/\//, '');
  const draw = useCallback(async (theme) => {
    const [art, mochi] = await Promise.all([picture(SUBJECT_COVERS[subject]?.src), picture(MOCHI_POSE_ASSETS.read)]);
    return drawTopicCard(
      { title, subjectName, chapter, claims, sources, conflicts, address },
      { theme, art, mochi, cloth: SHELF_SUBJECTS[subject]?.cloth?.[theme] || null },
    );
  }, [subject, title, subjectName, chapter, claims, sources, conflicts, address]);
  return (
    <ShareCardSheet
      title="การ์ดหัวข้อนี้"
      onClose={onClose}
      draw={draw}
      fileBase={`vetwiki-${subject}-${topic}`}
      shareText={`${title} ${url}`}
      alt={`การ์ด VetWiki ${subjectName}: ${title}. ${topicLine({ claims, sources })}`}
    />
  );
}
