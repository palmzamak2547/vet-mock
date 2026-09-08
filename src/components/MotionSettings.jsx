import { useState } from 'react';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { saveMotionPreferences, LOADER_CHOICES, CELEBRATION_CHOICES } from '../lib/motion-preferences.js';

const names = { pawsteps: 'อุ้งเท้าเดิน', orbital: 'วงโคจร', pages: 'พลิกหน้า', heartbeat: 'ชีพจร', dots: 'จุดสามจุด', helix: 'เกลียวดีเอ็นเอ', skeleton: 'โครงเนื้อหา', progress: 'แถบความคืบหน้า', confetti: 'กระดาษโปรย', pawburst: 'อุ้งเท้า', fireflies: 'หิ่งห้อย', hearts: 'หัวใจ', streak: 'ดาว', chapter: 'จบบท' };
export default function MotionSettings() {
  const { preferences, systemReduced } = useMotionPreferences();
  const [notice, setNotice] = useState('');
  const save = patch => setNotice(saveMotionPreferences(patch) ? 'บันทึกการตั้งค่าบนเครื่องนี้แล้ว' : 'ใช้ค่าใหม่ในครั้งนี้แล้ว แต่เบราว์เซอร์เก็บไว้ถาวรไม่ได้');
  return <details className="vmx-motion-settings">
    <summary>ตั้งค่า Mochi และการเคลื่อนไหว</summary>
    <div className="vmx-motion-settings-body">
      <label>การเคลื่อนไหว
        <select value={preferences.mode} onChange={e => save({ mode: e.target.value })}>
          <option value="auto">ตามการตั้งค่าของอุปกรณ์</option>
          <option value="quiet">โหมดสงบ — ใช้ภาพนิ่ง</option>
          <option value="off">ปิดเอฟเฟกต์</option>
        </select>
      </label>
      <label>ภาพระหว่างรอโหลด
        <select value={preferences.loader} onChange={e => save({ loader: e.target.value })}>
          {LOADER_CHOICES.map(id => <option value={id} key={id}>{names[id]}</option>)}
        </select>
      </label>
      <label>เอฟเฟกต์เมื่อทำสำเร็จ
        <select value={preferences.celebration} onChange={e => save({ celebration: e.target.value })}>
          {CELEBRATION_CHOICES.map(id => <option value={id} key={id}>{names[id]}</option>)}
        </select>
      </label>
      <label className="vmx-motion-checkbox"><input type="checkbox" checked={preferences.companion} onChange={e => save({ companion: e.target.checked })} />แสดง Mochi ในหน้าต่าง ๆ ของ VetMock</label>
      <p>เอฟเฟกต์ฉลองใช้เมื่อทำชุดฝึกสำเร็จ ส่วนโหมดสอบจะเก็บเฉลยไว้จนส่งคำตอบ แถบเปอร์เซ็นต์ใช้กับงานที่วัดความคืบหน้าได้เท่านั้น</p>
      {systemReduced && <p>อุปกรณ์เปิดการลดการเคลื่อนไหวอยู่ ทุกกิจกรรมจึงแสดงเป็นภาพนิ่ง</p>}
      <p className="vmx-motion-notice" role="status">{notice}</p>
    </div>
  </details>;
}
