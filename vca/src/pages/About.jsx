// How the collection is made: what it is, what it is not, where each question comes from, what
// is held back and why, and whose work it rests on. Numbers come from the bank as built.

import { Link } from '../components/Link.jsx';
import { Icon } from '../components/Icon.jsx';
import { KindBadge, Words } from '../components/bits.jsx';
import { Mark } from '../components/Mark.jsx';
import { BANK, DOMAIN_CARDS, loadCatalog, subjectName } from '../lib/bank.js';
import { useAsync, useTitle } from '../lib/hooks.js';
import { num, plateNo } from '../lib/format.js';

const KINDS = [
  ['vca', 'แนวข้อสอบ VCA โดยตรง: ชุด “VCA ผ่านชัวร์” ที่ @Fukfangfluffy_channel แจกฟรี เขียนใหม่ด้วยถ้อยคำของเรา และแบบฝึกที่ปรับจากข้อสอบเก่าในคลัง CUVET85 ซึ่งบอกไฟล์ หน้า และข้อของต้นฉบับไว้ทุกข้อ'],
  ['paper', 'ข้อสอบรายวิชาที่รุ่นพี่สอบจริงแล้วจดกลับมา แต่ละข้อบอกชื่อชุดสอบที่มา'],
  ['aligned', 'เขียนจากประเด็นที่รุ่นพี่ทำเครื่องหมายไว้ในเอกสารสรุปว่าออกสอบ ไม่มีใครรู้ข้อสอบล่วงหน้า จึงเรียกเพียงว่าอิงแนว'],
  ['lecture', 'เขียนจากเนื้อหาในคาบเรียนและสไลด์ของรายวิชา'],
  ['course', 'ข้อฝึกอื่นในคลังรายวิชาของ VetMock'],
];

export default function About() {
  useTitle('ที่มาของข้อสอบ');
  const catalog = useAsync(loadCatalog, 'catalog');
  const left = catalog.status === 'ready' ? catalog.value.left : null;
  const excluded = catalog.status === 'ready' ? catalog.value.excludedSubjects : [];

  return (
    <div className="wrap about">
      <header className="page-head">
        <p className="kicker">About the collection</p>
        <h1 className="page-h">ที่มาของข้อสอบ</h1>
        <p className="page-p">VetMock VCA รวมข้อสอบ {num(BANK.total)} ข้อจากคลังของ VetMock มาจัดตามหมวดที่ข้อสอบ VCA ถาม เพื่อให้ซ้อมได้ตรงจุด ทุกตัวเลขในหน้านี้นับจากคลังจริงตอนสร้างเว็บ</p>
      </header>

      <div className="prose">
        <section>
          <h2>VCA คืออะไร และเว็บนี้คืออะไร</h2>
          <p>VCA (Veterinary Competency Assessment) คือการประเมินความรู้ความสามารถก่อนขอรับใบอนุญาตประกอบวิชาชีพการสัตวแพทย์ เว็บนี้เป็นที่ซ้อมของนิสิตสัตวแพทย์ <b>ไม่ได้จัดทำโดยสัตวแพทยสภา และไม่ใช่ข้อสอบจริง</b> ขอบเขต วันสอบ และเกณฑ์ ให้ยึดประกาศของสัตวแพทยสภาเสมอ</p>
        </section>

        <section>
          <h2>ข้อสอบแต่ละข้อมาจากไหน</h2>
          <p>ทุกข้อบอกที่มาของตัวเองใต้คำอธิบาย และมีป้ายหนึ่งในห้าแบบนี้</p>
          <dl className="kinds">
            {KINDS.map(([k, text]) => (
              <div key={k} className="kinds-row">
                <dt><KindBadge kind={k} /><span className="kinds-n">{num(BANK.kinds[k])} ข้อ</span></dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>อะไรที่ไม่ได้อยู่ในชุดฝึก</h2>
          <ul className="dash">
            <li><b>{num(BANK.held)} ข้อ</b>ในรายวิชาเหล่านี้พักไว้ เพราะเฉลยหรือขอบเขตยังรอตรวจ หรือโจทย์ต้องใช้ภาพที่ยังไม่มี ข้อเหล่านี้ไม่ถูกนำมาให้ฝึกทั้งที่นี่และในแอป VetMock จนกว่าจะตรวจเสร็จ</li>
            {left && <li><b>{num(left.type)} ข้อ</b>เป็นโจทย์แบบอื่น (ถูกผิด จับคู่ เติมคำ ตอบสั้น) ซึ่ง VCA ไม่ใช้ จึงฝึกได้ในแอป VetMock แทน</li>}
            {excluded.map((x) => <li key={x.id}><b>{x.name} {num(x.n)} ข้อ</b> {x.why}</li>)}
          </ul>
        </section>

        <section>
          <h2>หมวดทั้ง {BANK.domains.length} มาจากรายวิชาไหน</h2>
          <p>แต่ละหมวดรวมรายวิชาที่ถามเรื่องเดียวกับหัวข้อในเอกสารข้อสอบเก่า VCA ส่วนแนวข้อสอบ VCA จัดเข้าหมวดตามหัวข้อของมันเอง (ชนิดสัตว์หรือสาขา)</p>
          {catalog.status === 'ready' ? (
            <ol className="map">
              {DOMAIN_CARDS.map((d) => (
                <li key={d.id}>
                  <Link to={`/d/${d.id}`} className="map-name"><span className="drow-pl">{plateNo(d.plate)}</span><Words text={d.thw} /></Link>
                  <span className="map-from">{catalog.value.domains[d.id].subjects.map((x) => (
                    <span key={x.id} className="map-src">{x.id === 'vca' ? 'แนว VCA' : subjectName(x.id)} <b>{num(x.n)}</b></span>
                  ))}</span>
                </li>
              ))}
            </ol>
          ) : <p className="hint">กำลังโหลด…</p>}
        </section>

        <section>
          <h2>ขอบคุณ</h2>
          <p>แนวข้อสอบ VCA ชุดแรกมาจาก “VCA ผ่านชัวร์” ของ @Fukfangfluffy_channel ที่แจกให้ทุกคนอ่านฟรี เอกสารและข้อสอบเก่าในชั้นเอกสารรวบรวมโดยรุ่นพี่หลายรุ่น (คลัง CUVET85 และรุ่นก่อนหน้า) ข้อสอบรายวิชามาจากรุ่นพี่ที่จดและแบ่งปันกันมา และภาพพิมพ์ประจำหมวดเป็นภาพประจำวิชาของ VetMock</p>
          <p>เห็นเฉลยที่น่าสงสัยหรือข้อความผิด บอกเราได้ที่ <a href="https://vetmock.com/app/feedback" className="text-link">ส่งความเห็นถึง VetMock <Icon name="arrowUpRight" size={14} /></a> ระบุเลขข้อ (No.) ที่อยู่ใต้คำอธิบายมาด้วย จะตรวจได้เร็วขึ้น อยากช่วยเพิ่มข้อสอบ ดูที่ <a href="https://vetmock.com/app/contribute" className="text-link">ร่วมเพิ่มข้อสอบ <Icon name="arrowUpRight" size={14} /></a></p>
        </section>

        <section>
          <h2>ความเป็นส่วนตัว</h2>
          <p>ไม่ต้องมีบัญชี คำตอบ ผลสอบ และวันสอบที่ตั้งไว้ เก็บในเบราว์เซอร์ของเครื่องนี้เท่านั้น ส่งออกหรือลบได้เองที่หน้า<Link to="/progress" className="text-link">ความคืบหน้า</Link></p>
        </section>

        <section className="about-mark">
          <Mark size={56} />
          <p>เครื่องหมายของ VetMock VCA คืออุ้งเท้าของ VetMock ที่นิ้วหนึ่งระบายสีไว้ แบบเดียวกับช่องคำตอบในกระดาษคำตอบ</p>
        </section>
      </div>
    </div>
  );
}
