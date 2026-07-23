// ============================================================
// VetWiki — grounded answers (SupportedAnswerClaim)
// ============================================================
// The contract that makes an AI answer inspectable: an answer is not prose,
// it is a LIST OF CLAIMS, each carrying how it is supported.
//
// The trust property is structural, not prompt-based: the model is only ever
// shown governed sections, and `validateAnswer` re-checks every claim against
// the exact set of section ids that were supplied. A claim citing anything
// else cannot be displayed as sourced — it is downgraded to analysis. So the
// model cannot invent a citation even if it tries; the worst it can do is be
// labelled as its own analysis.
//
// Pure + isomorphic on purpose: the same function runs in the serverless
// endpoint (before responding) and in the client (before rendering).
// ============================================================

/**
 * @typedef {'vetwiki-verified'|'vetwiki-draft'|'vetmock-analysis'|'insufficient-evidence'} AnswerSupportType
 */

/**
 * @typedef {Object} SupportedAnswerClaim
 * @property {string} id
 * @property {string} text
 * @property {AnswerSupportType} supportType
 * @property {Array<{ topicId?: string, sectionId?: string, claimId?: string }>} support
 * @property {string[]} [limitations]
 */

export const ANSWER_SUPPORT_LABEL = {
  'vetwiki-verified': { th: 'ยืนยันจาก VetWiki', tone: 'strong' },
  'vetwiki-draft': { th: 'จากโน้ตใน VetWiki (ฉบับร่าง)', tone: 'weak' },
  'vetmock-analysis': { th: 'การวิเคราะห์ของ VetMock', tone: 'muted' },
  'insufficient-evidence': { th: 'ข้อมูลยังไม่พอ', tone: 'muted' },
};

const TYPES = Object.keys(ANSWER_SUPPORT_LABEL);

/**
 * Re-ground a model-produced answer against what it was actually given.
 *
 * @param {SupportedAnswerClaim[]} claims       raw claims from the model
 * @param {Map<string, {sectionId:string, topicId:string, verified:boolean}>} allowed
 *        the sections that were actually supplied as context, keyed by sectionId
 * @returns {{ claims: SupportedAnswerClaim[], dropped: number, downgraded: number }}
 */
export function validateAnswer(claims, allowed) {
  let dropped = 0;
  let downgraded = 0;
  const out = [];

  for (const raw of Array.isArray(claims) ? claims : []) {
    const text = String(raw?.text || '').trim();
    if (!text) { dropped += 1; continue; }

    // Keep only references to sections we actually supplied.
    const support = (Array.isArray(raw?.support) ? raw.support : [])
      .map((s) => ({ sectionId: String(s?.sectionId || '') }))
      .filter((s) => allowed.has(s.sectionId))
      .map((s) => {
        const meta = allowed.get(s.sectionId);
        return { sectionId: s.sectionId, topicId: meta.topicId };
      });

    let supportType = TYPES.includes(raw?.supportType) ? raw.supportType : 'vetmock-analysis';

    if (support.length === 0) {
      // Nothing real backs it → it is analysis, whatever the model called it.
      if (supportType === 'vetwiki-verified' || supportType === 'vetwiki-draft') downgraded += 1;
      supportType = supportType === 'insufficient-evidence' ? 'insufficient-evidence' : 'vetmock-analysis';
    } else {
      // Claiming "verified" is only allowed when a cited section really does
      // carry a reference-verified claim.
      const anyVerified = support.some((s) => allowed.get(s.sectionId)?.verified);
      if (supportType === 'vetwiki-verified' && !anyVerified) {
        supportType = 'vetwiki-draft';
        downgraded += 1;
      }
      if (supportType === 'vetmock-analysis' || supportType === 'insufficient-evidence') {
        // Model was more modest than its evidence — leave it; understating is safe.
      }
    }

    out.push({
      id: String(raw?.id || `c${out.length + 1}`),
      text,
      supportType,
      support,
      ...(Array.isArray(raw?.limitations) && raw.limitations.length
        ? { limitations: raw.limitations.map((l) => String(l)).slice(0, 4) }
        : {}),
    });
  }

  return { claims: out, dropped, downgraded };
}

/** Build the `allowed` map the validator needs from governed sections. */
export function allowedFromSections(topicId, sections) {
  const m = new Map();
  for (const s of sections || []) {
    m.set(s.id, {
      sectionId: s.id,
      topicId,
      verified: (s.claims || []).some((c) => c.reviewStatus === 'verified'),
    });
  }
  return m;
}

/** True when an answer has at least one genuinely sourced claim. */
export function isGrounded(claims) {
  return (claims || []).some((c) => c.support?.length > 0);
}
