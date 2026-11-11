// studio.preset — the ready-made set the studio names first (src/lib/decide.js)
// Principle: default effect + a stated reason. A phone that asks for less
// motion gets the still set; otherwise the app follows the phone (light or
// dark with it, motion as it allows). The student's own values are the
// memory here (src/lib/prefs/table.js), so nothing is stored under
// vmx-decide: the studio says "ตามที่คุณตั้งไว้" when the values on screen are
// not this decision.
import { defineDecision } from '../decide.js';

export const STUDIO_PRESET = defineDecision({
  id: 'studio.preset',
  valid: (v) => v === 'phone' || v === 'calm',
  auto(s = {}) {
    if (s.systemReduced) return { value: 'calm', why: 'เครื่องนี้ตั้งให้ลดการเคลื่อนไหวไว้' };
    return { value: 'phone', why: 'สว่างหรือมืดตามเครื่อง ภาพเคลื่อนไหวเท่าที่เครื่องรับได้' };
  },
});
