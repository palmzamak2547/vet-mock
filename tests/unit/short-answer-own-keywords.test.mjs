// A short-answer item's own model answer meets its own keywords.
//
// A short answer shows the student a keyword checklist under "คีย์เวิร์ดที่ควรมี"
// (WrittenReveal in src/components/AnswerReveal.jsx), ticked by the rule
// isCorrect uses: keywordHit on each keyword, correct at 75% of them. Thai
// keywords match as exact text. On 20 Nov 2026 three new Aquatic items
// (219000, 219002, 219004) had keywords that their own model answers did not
// meet: "pH สูง" never appears in "เมื่อ pH หรืออุณหภูมิสูงขึ้น". An answer
// written in the deck's own words then showed points as missing that it had
// made. An independent review caught it before release.
//
// 186 older items do the same, mostly keywords written as whole rubric lines.
// They are listed below and the list may only shrink: fix an item's keywords
// (or its model answer), then take its id out. A new item has to meet its own
// keywords.
import assert from 'node:assert/strict';
import test from 'node:test';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { isCorrect } from '../../src/hooks/utils.js';

// The short-answer items whose model answer missed its own keywords on 20 Nov 2026.
const KNOWN = new Set([
  8355, 8356, 202406, 202407, 202408, 202485, 203012, 203013, 203014, 203015, 203016, 203017,
  206147, 206149, 209020, 209021, 209022, 209028, 209029, 209035, 209036, 209038, 209039, 209040,
  209041, 209042, 209043, 209044, 209045, 209049, 209051, 209052, 209054, 209055, 209057, 209060,
  209062, 209063, 209064, 209116, 209119, 209126, 209127, 209147, 209402, 209403, 209532, 209534,
  209537, 209546, 209565, 209568, 209569, 209570, 209571, 209585, 209586, 209588, 209589, 209590,
  209592, 209595, 209596, 209598, 209600, 209601, 209602, 209603, 209604, 209605, 209606, 209607,
  209608, 209609, 209610, 209611, 209612, 209613, 209614, 209615, 209616, 209617, 209618, 209619,
  209621, 209622, 209623, 209624, 209625, 209627, 209628, 209629, 209630, 209631, 209632, 209633,
  209634, 209635, 209637, 209638, 209640, 209642, 209643, 209644, 209645, 210027, 210028, 210543,
  210556, 210560, 210561, 210562, 210563, 210564, 210565, 210570, 210571, 210572, 210573, 210574,
  210580, 212014, 212016, 212017, 212018, 212019, 212020, 212021, 212022, 212071, 212072, 212073,
  212074, 212076, 212077, 212078, 212079, 212080, 212082, 212084, 212094, 212095, 212132, 212133,
  212135, 212136, 212137, 212138, 212140, 212141, 212145, 212146, 212147, 212148, 212553, 212554,
  212555, 212556, 212557, 212558, 212559, 213538, 213539, 213542, 213544, 213560, 213561, 213562,
  213564, 214074, 214081, 214106, 214107, 214147, 214166, 214176, 214179, 214184, 214202, 214216,
  214515, 214516, 214586, 218200, 218730, 218731
]);

test("a short answer's model answer meets its own keywords, apart from the listed older items", async () => {
  const misses = [];
  const nowMeet = [];
  for (const entry of BANK_REGISTRY) {
    for (const q of await entry.load()) {
      if (q.type !== 'short' || !Array.isArray(q.keywords) || !q.keywords.length || !q.model_answer) continue;
      const meets = isCorrect(q, q.model_answer);
      if (!meets && !KNOWN.has(q.id)) misses.push(q.id);
      if (meets && KNOWN.has(q.id)) nowMeet.push(q.id);
    }
  }
  assert.deepEqual(misses, [], `these model answers miss their own keywords; use words the answer contains: ${misses.join(', ')}`);
  assert.deepEqual(nowMeet, [], `these now meet their keywords; take them out of KNOWN: ${nowMeet.join(', ')}`);
});
