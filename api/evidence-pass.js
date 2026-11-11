// ============================================================
// /api/evidence-pass — where the slide page images are, for members
// ============================================================
// Under a revealed answer the question card shows the page of the lecture
// slide the answer rests on (docs/ANSWER-EVIDENCE.md). Which page it is, is a
// citation and ships with the app. The page image is course material, served
// like the library's files: to Chula members only. The images sit in R2 behind
// an address that cannot be guessed (EVIDENCE_BASE), and this function is the
// only place that address is given out. The browser then loads images straight
// from Cloudflare's edge: no function runs per image.
//
// The address does not expire the way a library link does, so it is held to a
// stricter rule than the wall's switch: a member, always. With the wall
// switched off the gate lets everyone through; this function still answers
// members only.
//
// Rotating the address: docs/ANSWER-EVIDENCE.md, "To retire a leaked address".

import { requireChula, CHULA_REQUIRED } from './_lib/chula-gate.js';

const HOST = 'https://slides.vetmock.com/';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Never kept by a browser or a proxy: the body is a grant, and the next person at this device may not hold one.
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' });
  const gate = await requireChula(req, res);
  if (!gate) return undefined;
  if (!gate.member) return send(res, CHULA_REQUIRED.status, CHULA_REQUIRED.body);
  const base = String(process.env.EVIDENCE_BASE || '').replace(/\/+$/, '');
  if (!base.startsWith(HOST)) return send(res, 503, { error: 'not_configured' });
  return send(res, 200, { base });
}
