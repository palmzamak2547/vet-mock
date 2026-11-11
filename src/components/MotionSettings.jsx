import { useState } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { prefRow, writePref } from '../lib/prefs/table.js';
import { choiceLabel } from '../lib/prefs/labels.js';
import { canVibrate } from '../lib/haptics.js';

// The compact form of the motion rows of src/lib/prefs/table.js (theme menu,
// Mochi page). The studio ("ปรับแต่ง") draws the same rows as samples; the
// choices and their names come from the table and prefs/labels.js, so the two
// cannot disagree.
const select = (id, label, value, save) => (
  <label>{label}
    <select value={String(value)} onChange={(e) => save(id, prefRow(id).choices.find((c) => String(c) === e.target.value))}>
      {prefRow(id).choices.map((c) => <option value={String(c)} key={String(c)}>{choiceLabel(id, c)}</option>)}
    </select>
  </label>
);

export default function MotionSettings() {
  const { preferences, systemReduced } = useMotionPreferences();
  const [notice, setNotice] = useState('');
  const save = (id, value) => setNotice(writePref(id, value) ? 'บันทึกการตั้งค่าบนเครื่องนี้แล้ว' : 'ใช้ค่าใหม่ในครั้งนี้แล้ว แต่เบราว์เซอร์เก็บไว้ถาวรไม่ได้');
  return <details className="vmx-motion-settings">
    <summary>ตั้งค่า Mochi และการเคลื่อนไหว</summary>
    <div className="vmx-motion-settings-body">
      {select('motion.mode', 'การเคลื่อนไหว', preferences.mode, save)}
      {select('motion.loader', 'ภาพระหว่างรอโหลด', preferences.loader, save)}
      {select('motion.celebration', 'เอฟเฟกต์เมื่อทำสำเร็จ', preferences.celebration, save)}
      <label className="vmx-motion-checkbox"><input type="checkbox" checked={preferences.companion} onChange={(e) => save('motion.companion', e.target.checked)} />แสดง Mochi ในหน้าต่าง ๆ ของ VetMock</label>
      {/* Only where a vibration can be felt (lib/haptics.js): an iPhone has
          no vibration for websites, and a desktop has nothing to vibrate. */}
      {canVibrate() && <label className="vmx-motion-checkbox"><input type="checkbox" checked={preferences.haptics} onChange={(e) => save('motion.haptics', e.target.checked)} />สั่นเบา ๆ เมื่อรู้ผลคำตอบในโหมดฝึก</label>}
      <p>เอฟเฟกต์ฉลองใช้เมื่อทำชุดฝึกสำเร็จ ส่วนโหมดสอบจะเก็บเฉลยไว้จนส่งคำตอบ แถบเปอร์เซ็นต์ใช้กับงานที่วัดความคืบหน้าได้เท่านั้น</p>
      {systemReduced && <p>อุปกรณ์เปิดการลดการเคลื่อนไหวอยู่ ทุกกิจกรรมจึงแสดงเป็นภาพนิ่ง</p>}
      <p className="vmx-motion-notice" role="status">{notice}</p>
    </div>
  </details>;
}
