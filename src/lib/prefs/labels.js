// prefs/labels.js — the Thai name of every choice in src/lib/prefs/table.js,
// shared by the studio, the theme menu, the Mochi page's settings and the
// voice dialog, so one choice reads the same everywhere. The motion names are
// the motion kit's own (motion-kit/catalog.js).
import { EFFECTS } from '../motion-kit/catalog.js';

const EFFECT = Object.fromEntries(EFFECTS.map(({ id, th, symbol }) => [id, { th, symbol }]));

export const CHOICE_LABEL = Object.freeze({
  theme: { system: 'ตามเครื่อง', light: 'สว่าง', dark: 'มืด' },
  palette: { default: 'เสจกับทอง', forest: 'ป่า', ocean: 'ทะเล', plum: 'พลัม', cherry: 'เชอร์รี', mono: 'ขาวดำ', custom: 'สีของฉัน' },
  'motion.mode': { auto: 'ตามเครื่อง', quiet: 'สงบ ภาพนิ่ง', off: 'ปิด' },
  'motion.companion': { true: 'แสดง', false: 'ซ่อน' },
  'motion.haptics': { true: 'เปิด', false: 'ปิด' },
});

/** Two dots for a palette's swatch (light theme values, styles.css). */
export const PALETTE_DOTS = Object.freeze({
  default: ['#4a6b4a', '#b88940'], forest: ['#2d5a3d', '#857538'], ocean: ['#3d6b82', '#6b94a8'],
  plum: ['#7d4a7d', '#b07ab0'], cherry: ['#ab4747', '#b88940'], mono: ['#4a4a4a', '#767676'],
});

const SPECIAL = {
  'motion.celebration': { contextual: { th: 'ตามสิ่งที่ทำสำเร็จ', symbol: '✓' } },
  'motion.readingPointer': { auto: { th: 'ตามเครื่อง', symbol: '⌖' }, none: { th: 'ไม่มี', symbol: '○' } },
};

/** { th, symbol } for a choice of a row. */
export function choiceMeta(id, value) {
  const fixed = CHOICE_LABEL[id]?.[String(value)];
  if (fixed) return { th: fixed, symbol: '' };
  return SPECIAL[id]?.[value] || EFFECT[value] || { th: String(value), symbol: '○' };
}
export const choiceLabel = (id, value) => choiceMeta(id, value).th;
