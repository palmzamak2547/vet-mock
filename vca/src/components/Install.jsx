// "Install as an app": the browser's own prompt where there is one, and otherwise the two taps
// each phone needs, shown as a short how-to. Hidden once the site runs installed.

import { useEffect, useState } from 'react';
import { Icon } from './Icon.jsx';
import { Sheet } from './Sheet.jsx';
import { canPrompt, isInstalled, onInstallChange, platform, promptInstall } from '../lib/install.js';

const STEPS = {
  ios: ['แตะปุ่มแชร์ด้านล่างของ Safari', 'เลือก “เพิ่มไปยังหน้าจอโฮม”'],
  android: ['แตะเมนูสามจุดของ Chrome', 'เลือก “ติดตั้งแอป” หรือ “เพิ่มลงในหน้าจอหลัก”'],
  line: ['แตะเมนูมุมขวาบนของ LINE', 'เลือกเปิดในเบราว์เซอร์ แล้วติดตั้งจากที่นั่น'],
  desktop: ['คลิกไอคอนติดตั้งท้ายช่องที่อยู่ของ Chrome หรือ Edge', 'หรือเปิดเมนูของเบราว์เซอร์ แล้วเลือกติดตั้ง VetMock VCA'],
};

export function InstallLink({ className = '' }) {
  const [, tick] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => onInstallChange(() => tick((n) => n + 1)), []);
  if (isInstalled()) return null;
  const onClick = async () => {
    if (canPrompt()) { await promptInstall(); return; }
    setOpen(true);
  };
  const steps = STEPS[platform()];
  return (
    <>
      <button type="button" className={className} onClick={onClick}>ติดตั้งเป็นแอป <Icon name="phone" size={14} /></button>
      <Sheet open={open} onClose={() => setOpen(false)} title="ติดตั้งเป็นแอป">
        <p className="sheet-p">เปิดจากหน้าจอหลักได้เหมือนแอป และชุดที่เคยโหลดไว้ฝึกต่อได้แม้ไม่มีเน็ต</p>
        <ol className="install-steps">
          {steps.map((s, i) => <li key={i}><span className="install-n">{i + 1}</span>{s}</li>)}
        </ol>
      </Sheet>
    </>
  );
}
