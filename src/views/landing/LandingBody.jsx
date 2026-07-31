// ============================================================
// LandingBody — hero → footer matching export HTML 100%
// ============================================================

import React, { useState, useEffect, useRef } from 'react';

// Demo MCQ questions for the Hero Quiz Card
const QUESTIONS = [
  {
    subject: 'ศัลยศาสตร์ · COM IV',
    q: 'สุนัขพันธุ์ใดมีความเสี่ยงต่อภาวะข้อสะโพกเสื่อม (Hip Dysplasia) มากที่สุด?',
    opts: ['Chihuahua', 'German Shepherd', 'Pug', 'Shih Tzu'],
    ans: 1,
    explain: 'Hip Dysplasia พบบ่อยในสุนัขพันธุ์ใหญ่ เช่น German Shepherd, Labrador และ Golden Retriever เนื่องจากพันธุกรรมและการเจริญเติบโตที่รวดเร็ว ทำให้ข้อสะโพกหลวมและเสื่อมก่อนวัย'
  },
  {
    subject: 'เภสัชวิทยา · COM III',
    q: 'ยาชนิดใด “ห้ามใช้” ในแมว เพราะทำให้เกิด methemoglobinemia และ Heinz body anemia?',
    opts: ['Amoxicillin', 'Metronidazole', 'Paracetamol', 'Prednisolone'],
    ans: 2,
    explain: 'แมวขาดเอนไซม์ glucuronyl transferase ทำให้กำจัด paracetamol ได้ช้า เกิด oxidative damage ต่อเม็ดเลือดแดง อันตรายถึงชีวิตแม้ในขนาดต่ำมาก'
  },
  {
    subject: 'สรีรวิทยา · COM III',
    q: 'อัตราการเต้นของหัวใจสุนัขโตเต็มวัยขณะพัก อยู่ในช่วงใด?',
    opts: ['180–250 ครั้ง/นาที', '60–140 ครั้ง/นาที', '20–40 ครั้ง/นาที', '300–400 ครั้ง/นาที'],
    ans: 1,
    explain: 'สุนัขโตเต็มวัยมี heart rate ประมาณ 60–140 bpm (พันธุ์เล็กอาจสูงกว่าเล็กน้อย) ส่วนช่วง 180–250 มักเป็นค่าปกติของแมว'
  }
];

const LETTERS = ['ก', 'ข', 'ค', 'ง'];

const TOPICS = [
  'เภสัชวิทยา', 'ศัลยศาสตร์', 'อายุรศาสตร์', 'กายวิภาคศาสตร์', 'สรีรวิทยา',
  'จุลชีววิทยา', 'ปรสิตวิทยา', 'พยาธิวิทยา', 'สูติศาสตร์', 'Diagnostic Imaging',
  'โภชนาการ', 'เภสัชจลนศาสตร์'
];

const FEED_INIT = [
  { t: 'นิสิตปี 4 ทำ <b>COM IV · Surgery</b> เสร็จ', s: 'คะแนน 86%', time: 'เมื่อครู่', c: '#147a6c' },
  { t: 'นิสิตปี 3 ถูก <b>8 ข้อติด</b> ใน Pharmacology', s: '🔥 streak พุ่ง', time: '1 นาทีที่แล้ว', c: '#e8930c' },
  { t: 'นิสิตปี 5 เพิ่งดูสรุปคลิป <b>Cardiology</b>', s: '14:08', time: '3 นาทีที่แล้ว', c: '#1c9384' },
  { t: 'นิสิตปี 4 อัพ streak เป็น <b>21 วัน</b>', s: 'เก่งมาก!', time: '5 นาทีที่แล้ว', c: '#ff6b5e' },
  { t: 'นิสิตปี 3 ทำ <b>Mock COM III</b> เสร็จ', s: 'คะแนน 78%', time: '7 นาทีที่แล้ว', c: '#0e5a50' },
  { t: 'นิสิตปี 5 ทวน <b>สมุดข้อผิด</b> 12 ข้อ', s: 'จุดอ่อนลดลง', time: '9 นาทีที่แล้ว', c: '#147a6c' }
];

const BOARD = [
  { n: 'Ployp.', y: 'ปี 4', st: 34, xp: '12,480', c: '#e8930c' },
  { n: 'Kavin T.', y: 'ปี 5', st: 29, xp: '11,920', c: '#147a6c' },
  { n: 'Mook S.', y: 'ปี 3', st: 27, xp: '10,340', c: '#1c9384' },
  { n: 'Beam J.', y: 'ปี 4', st: 22, xp: '9,870', c: '#ff6b5e' },
  { n: 'Fah R.', y: 'ปี 5', st: 19, xp: '9,410', c: '#0e5a50' }
];

export default function LandingBody(p) {
  // --- Quiz Card State ---
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [popStreak, setPopStreak] = useState(false);
  const [popXp, setPopXp] = useState(false);
  const [toastMsg, setToastMsg] = useState({ text: '', err: false, show: false });

  // --- Modes Tab State ---
  const [activeTab, setActiveTab] = useState('m1');

  // --- Mock Timer State ---
  const [mockLeft, setMockLeft] = useState(90 * 60);
  const [mockRunning, setMockRunning] = useState(false);

  // --- Clip Filter State ---
  const [clipFilter, setClipFilter] = useState('all');

  // --- Live Feed State ---
  const [feedList, setFeedList] = useState(FEED_INIT.slice(0, 5));
  const feedIdx = useRef(5);

  // Auto-scroll reveal & counters hook
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.rv, .scard, .road, .panel-visual').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Mock Timer effect
  useEffect(() => {
    let t;
    if (mockRunning) {
      t = setInterval(() => {
        setMockLeft((prev) => {
          if (prev <= 1) {
            setMockRunning(false);
            return 90 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [mockRunning]);

  // Live Feed interval
  useEffect(() => {
    const interval = setInterval(() => {
      const nextItem = { ...FEED_INIT[feedIdx.current % FEED_INIT.length], time: 'เมื่อครู่', isNew: true };
      feedIdx.current += 1;
      setFeedList((prev) => [nextItem, ...prev.slice(0, 5)]);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg, err) => {
    setToastMsg({ text: msg, err, show: true });
    setTimeout(() => setToastMsg((t) => ({ ...t, show: false })), 2400);
  };

  const handleAnswer = (index) => {
    if (picked !== null) return;
    setPicked(index);
    const q = QUESTIONS[qi];
    if (index === q.ans) {
      setStreak((s) => s + 1);
      setXp((x) => x + 10);
      setPopStreak(true);
      setPopXp(true);
      triggerToast('ถูกต้อง! +10 XP 🔥', false);
    } else {
      setStreak(0);
      setPopStreak(true);
      triggerToast('ผิดนิดเดียว — อ่านคำอธิบายแล้วลุยต่อ 💪', true);
    }
    setTimeout(() => {
      setPopStreak(false);
      setPopXp(false);
    }, 400);
  };

  const handleNextQ = () => {
    setPicked(null);
    setQi((prev) => (prev + 1) % QUESTIONS.length);
  };

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const currentQ = QUESTIONS[qi];

  return (
    <main id="lp-main" className="lp-root">
      {/* Toast Notification */}
      <div id="toast" className={`${toastMsg.show ? 'show' : ''} ${toastMsg.err ? 'err' : ''}`}>
        <span className="ti">{toastMsg.err ? '💡' : '✅'}</span>
        <span>{toastMsg.text}</span>
      </div>

      {/* HERO SECTION */}
      <section className="hero" id="top">
        <svg className="ecg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 70 H280 l14 -30 18 56 14 -26 H560 l14 -30 18 56 14 -26 H840 l14 -30 18 56 14 -26 H1200" fill="none" stroke="rgba(61,220,151,.16)" strokeWidth="2"/>
          <path className="run" d="M0 70 H280 l14 -30 18 56 14 -26 H560 l14 -30 18 56 14 -26 H840 l14 -30 18 56 14 -26 H1200" fill="none" stroke="#3ddc97" strokeWidth="2.5" pathLength="100"/>
        </svg>
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-text">
              <span className="eyebrow" style={{ background: 'rgba(61,220,151,.12)', color: 'var(--mint)', borderColor: 'rgba(61,220,151,.25)' }}>
                <span className="dot" style={{ background: 'var(--mint)' }} />
                คลังโจทย์นิสิตสัตวแพทย์ จุฬาฯ
              </span>
              <h1 style={{ marginTop: 18 }}>
                ซ้อมให้เหมือน<br /><span className="hl">สอบจริง</span> ทุกสนาม
              </h1>
              <p className="lead">
                MCQ พร้อมคำอธิบายละเอียด + แนวข้อสอบจับเวลา + สรุปคลิปย้อนหลัง ครอบคลุม COM III / IV / V และ Eng Vet Prof II — กำลังขยายให้ครบทุกชั้นปี (ปี 1–6)
              </p>
              <div className="hero-stats">
                <div className="hstat">
                  <div className="n num">3,200<span className="suf">+</span></div>
                  <div className="l">ข้อสอบในคลัง</div>
                </div>
                <div className="hstat">
                  <div className="n num">150<span className="suf">+</span></div>
                  <div className="l">คลิปสรุปเนื้อหา</div>
                </div>
                <div className="hstat">
                  <div className="n num">12,400<span className="suf">+</span></div>
                  <div className="l">เซสชันซ้อม / เดือน</div>
                </div>
              </div>
              <div className="hero-cta">
                <button type="button" className="btn btn-primary" onClick={p.onEnterApp}>
                  เริ่มทำโจทย์ฟรี <span className="ar">→</span>
                </button>
                <a href="#clips" className="btn btn-ghost">ดูคลิปสรุป</a>
              </div>
              <div className="live-pill">
                <span className="pd" /> มีนิสิตกำลังซ้อมอยู่ตอนนี้ <b className="num" style={{ color: '#fff' }}>128</b> คน
              </div>
            </div>

            <div className="quiz-stage">
              <div className="stamp">
                <svg viewBox="0 0 100 100">
                  <defs>
                    <path id="circ" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"/>
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="#ffb020"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#072723" strokeOpacity=".25" strokeWidth="1"/>
                  <text fontMinimal="true" fontFamily="Chakra Petch" fontSize="9" fontWeight="700" fill="#072723" letterSpacing="2">
                    <textPath href="#circ">VETMOCK · CHULALONGKORN · VETMOCK · CHULALONGKORN · </textPath>
                  </text>
                </svg>
                <span className="core">🐾</span>
              </div>
              <div className="fchip a"><span className="ic">⚡</span> +10 XP ต่อข้อ</div>
              <div className="fchip b"><span className="ic">📖</span> อธิบายทุกข้อ</div>
              <div className="fchip c"><span className="ic">🎯</span> Tag ตาม topic</div>

              <div className="quiz-card" id="quizCard">
                <div className="qc-top">
                  <span className="qc-subj">{currentQ.subject}</span>
                  <div className="qc-meta">
                    <span className={`qc-chip ${popStreak ? 'pop' : ''}`}>🔥 <span className="num">{streak}</span></span>
                    <span className={`qc-chip xp ${popXp ? 'pop' : ''}`}>⚡ <span className="num">{xp}</span></span>
                  </div>
                </div>
                <div className="q-text">{currentQ.q}</div>
                <div className="q-opts">
                  {currentQ.opts.map((opt, i) => {
                    let cls = 'opt';
                    let mark = '';
                    if (picked !== null) {
                      cls += ' lock';
                      if (i === currentQ.ans) {
                        cls += ' correct';
                        mark = '✓';
                      } else if (i === picked) {
                        cls += ' wrong';
                        mark = '✕';
                      } else {
                        cls += ' dim';
                      }
                    }
                    return (
                      <button key={i} type="button" className={cls} onClick={() => handleAnswer(i)}>
                        <span className="opt-key">{LETTERS[i]}</span>
                        <span className="opt-txt">{opt}</span>
                        <span className="opt-ic">{mark}</span>
                      </button>
                    );
                  })}
                </div>
                <div className={`q-explain ${picked !== null ? 'show' : ''}`}>
                  <div className="box">
                    <div className="t">💡 คำอธิบาย</div>
                    <p>{currentQ.explain}</p>
                  </div>
                </div>
                <div className="q-foot">
                  <div className="q-dots">
                    {QUESTIONS.map((_, i) => (
                      <i key={i} className={i === qi ? 'on' : ''} />
                    ))}
                  </div>
                  <button type="button" className="q-next" onClick={handleNextQ} disabled={picked === null}>
                    ข้อถัดไป →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="mq-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="mq-group">
              {TOPICS.map((t) => (
                <span key={t} className="mq-item">
                  {t}
                  <svg className="paw" viewBox="0 0 24 24">
                    <g fill="#072723">
                      <ellipse cx="12" cy="15" rx="4" ry="3.2"/>
                      <ellipse cx="6" cy="9" rx="1.7" ry="2.2"/>
                      <ellipse cx="10" cy="6.5" rx="1.7" ry="2.2"/>
                      <ellipse cx="14" cy="6.5" rx="1.7" ry="2.2"/>
                      <ellipse cx="18" cy="9" rx="1.7" ry="2.2"/>
                    </g>
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SUBJECTS BENTO */}
      <section className="sec" id="subjects">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow"><span className="dot" />เลือกสนามซ้อม</span>
            <h2>คลังข้อสอบแยกตาม COM & วิชา</h2>
            <p>ทุกชุดมี Tag ตาม topic, คำอธิบายละเอียด และบันทึกข้อผิดเข้า “สมุดทวน” อัตโนมัติ ให้กลับมาแก้จุดอ่อนได้ตรงจุด</p>
          </div>
          <div className="bento">
            <article className="scard s-com3 rv" style={{ '--v': '68%', cursor: 'pointer' }} onClick={() => p.onPickSubject ? p.onPickSubject(3, 'com3') : p.onEnterApp()}>
              <span className="ghost">03</span>
              <span className="code">COMPREHENSIVE III</span>
              <h3>COM III</h3>
              <span className="yr">ชั้นปีที่ 3 · พื้นฐานทางคลินิก</span>
              <div className="count num">รวม <b>820</b> ข้อ</div>
              <div className="chips">
                <span className="chip">เภสัชวิทยา</span>
                <span className="chip">พยาธิวิทยา</span>
                <span className="chip">จุลชีววิทยา</span>
                <span className="chip">สรีรวิทยา</span>
              </div>
              <svg className="spark" viewBox="0 0 220 56" preserveAspectRatio="none">
                <polyline points="0,46 28,40 56,43 84,28 112,33 140,18 168,24 196,10 220,15" />
              </svg>
              <div className="prog">
                <div className="row"><span>ความคืบหน้าการซ้อม</span><span className="num">68%</span></div>
                <div className="track"><div className="fill" /></div>
              </div>
              <span className="go">→</span>
            </article>

            <article className="scard s-com4 rv" style={{ '--v': '41%', cursor: 'pointer' }} onClick={() => p.onPickSubject ? p.onPickSubject(4, 'com4') : p.onEnterApp()}>
              <span className="ghost">04</span>
              <span className="code">COMPREHENSIVE IV</span>
              <h3>COM IV</h3>
              <span className="yr">ชั้นปีที่ 4 · วิชาคลินิกหลัก</span>
              <div className="count num">รวม <b>940</b> ข้อ</div>
              <div className="chips">
                <span className="chip">ศัลยศาสตร์</span>
                <span className="chip">อายุรศาสตร์</span>
                <span className="chip">Diagnostic Imaging</span>
              </div>
              <div className="prog">
                <div className="row"><span>ความคืบหน้าการซ้อม</span><span className="num">41%</span></div>
                <div className="track"><div className="fill" /></div>
              </div>
              <span className="go">→</span>
            </article>

            <article className="scard s-com5 rv" style={{ '--v': '12%', cursor: 'pointer' }} onClick={() => p.onPickSubject ? p.onPickSubject(5, 'com5') : p.onEnterApp()}>
              <span className="ghost">05</span>
              <span className="code">COMPREHENSIVE V</span>
              <h3>COM V</h3>
              <span className="yr">ชั้นปีที่ 5 · คลินิกประยุกต์</span>
              <div className="count num">รวม <b>1,050</b> ข้อ</div>
              <div className="chips">
                <span className="chip">คลินิกสัตว์เล็ก</span>
                <span className="chip">สูติศาสตร์</span>
                <span className="chip">Theriogenology</span>
              </div>
              <div className="prog">
                <div className="row"><span>ความคืบหน้าการซ้อม</span><span className="num">12%</span></div>
                <div className="track"><div className="fill" /></div>
              </div>
              <span className="go">→</span>
            </article>

            <article className="scard s-eng rv" style={{ '--v': '55%', cursor: 'pointer' }} onClick={() => p.onPickSubject ? p.onPickSubject(4, 'engprof') : p.onEnterApp()}>
              <span className="ghost">EN</span>
              <span className="code">ENGLISH FOR VET PROFESSION</span>
              <h3>Eng Vet Prof II</h3>
              <span className="yr">ภาษาอังกฤษวิชาชีพ · ปี 4–5</span>
              <div className="count num">รวม <b>390</b> ข้อ</div>
              <div className="chips">
                <span className="chip">Reading</span>
                <span className="chip">Vocabulary</span>
                <span className="chip">Case Communication</span>
                <span className="chip">Medical Terminology</span>
              </div>
              <svg className="spark" viewBox="0 0 220 56" preserveAspectRatio="none">
                <polyline points="0,40 28,44 56,30 84,34 112,22 140,28 168,14 196,20 220,8" />
              </svg>
              <div className="prog">
                <div className="row"><span>ความคืบหน้าการซ้อม</span><span className="num">55%</span></div>
                <div className="track"><div className="fill" /></div>
              </div>
              <span className="go">→</span>
            </article>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="sec" id="roadmap" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow"><span className="dot" />เส้นทางปี 1–6</span>
            <h2>ไล่ตามชั้นปี ไม่มีหลงทาง</h2>
            <p>เปิดแล้วในชั้นปี 3–5 และกำลังขยายให้ครบทุกชั้นปี (ปี 1–6) — ล็อกไว้รอคุณอยู่</p>
          </div>
          <div className="road rv" id="road">
            <div className="track-line" />
            <div className="track-fill" />
            <div className="nodes">
              <div className="node lock">
                <div className="circle">🔒</div>
                <div className="yr">ปี 1</div>
                <div className="sub">พื้นฐานวิทยาศาสตร์</div>
                <span className="tag">เร็ว ๆ นี้</span>
              </div>
              <div className="node lock">
                <div className="circle">🔒</div>
                <div className="yr">ปี 2</div>
                <div className="sub">Pre-clinic</div>
                <span className="tag">เร็ว ๆ นี้</span>
              </div>
              <div className="node open">
                <div className="circle">3</div>
                <div className="yr">ปี 3</div>
                <div className="sub">COM III</div>
                <span className="tag">เปิดแล้ว</span>
              </div>
              <div className="node open">
                <div className="circle">4</div>
                <div className="yr">ปี 4</div>
                <div className="sub">COM IV + Eng II</div>
                <span className="tag">เปิดแล้ว</span>
              </div>
              <div className="node open">
                <div className="circle">5</div>
                <div className="yr">ปี 5</div>
                <div className="sub">COM V</div>
                <span className="tag">เปิดแล้ว</span>
              </div>
              <div className="node lock">
                <div className="circle">🔒</div>
                <div className="yr">ปี 6</div>
                <div className="sub">คลินิกเต็มเวลา</div>
                <span className="tag">เร็ว ๆ นี้</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODES */}
      <section className="sec" id="modes" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow"><span className="dot" />โหมดซ้อม</span>
            <h2>ครบทุกอาวุธในการอ่านสอบ</h2>
            <p>จะทบทวนทีละข้อ ฝึกจับเวลาแบบสนามจริง หรือเปิดคลิปสรุปก่อนนอน — เลือกได้ตามจังหวะของคุณ</p>
          </div>
          <div className="tabs rv">
            <button type="button" className={`tab-btn ${activeTab === 'm1' ? 'on' : ''}`} onClick={() => setActiveTab('m1')}>
              <span className="ic">📝</span> MCQ ทีละข้อ
            </button>
            <button type="button" className={`tab-btn ${activeTab === 'm2' ? 'on' : ''}`} onClick={() => setActiveTab('m2')}>
              <span className="ic">⏱️</span> Mock Exam จับเวลา
            </button>
            <button type="button" className={`tab-btn ${activeTab === 'm3' ? 'on' : ''}`} onClick={() => setActiveTab('m3')}>
              <span className="ic">🎬</span> สรุปคลิป
            </button>
          </div>

          {/* Panel M1 */}
          <div className={`panel ${activeTab === 'm1' ? 'on' : ''}`} id="m1">
            <div className="panel-grid">
              <div>
                <h3>ทำทีละข้อ พร้อมเฉลยละเอียดทันที</h3>
                <p className="desc">ทุกข้อมีคำอธิบายว่า “ทำไมถูก / ทำไมผิด” ช่วยเปลี่ยนข้อที่ผิดให้กลายเป็นบทเรียน ไม่ใช่แค่คะแนน</p>
                <ul className="check">
                  <li><span className="ck">✓</span> คำอธิบายละเอียดทุกตัวเลือก</li>
                  <li><span className="ck">✓</span> Tag ตาม topic — ซ้อมเฉพาะจุดที่อ่อน</li>
                  <li><span className="ck">✓</span> บันทึกข้อผิดเข้า “สมุดทวน” อัตโนมัติ</li>
                  <li><span className="ck">✓</span> ระบบ streak & XP ให้ซ้อมต่อเนื่อง</li>
                </ul>
              </div>
              <div className="panel-visual rv" id="ringBox">
                <div className="ring-wrap">
                  <div className="ring">
                    <svg width="120" height="120">
                      <circle className="bg" cx="60" cy="60" r="50"/>
                      <circle className="fg" cx="60" cy="60" r="50" style={{ '--off': '113' }}/>
                    </svg>
                    <div className="mid"><b className="num">64%</b><span>ทำถูกเฉลี่ย</span></div>
                  </div>
                  <div className="ring-txt">
                    <h4>นิสิตทำถูกเฉลี่ย 64%</h4>
                    <p>หลังซ้อมครบ 3 ชุด คะแนนเฉลี่ยขยับขึ้นเป็น <b>82%</b> — ตัวเลขที่พิสูจน์ว่าการซ้อมซ้ำได้ผลจริง</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel M2 */}
          <div className={`panel ${activeTab === 'm2' ? 'on' : ''}`} id="m2">
            <div className="panel-grid rev">
              <div className="panel-visual mock">
                <div className="mock-head">
                  <span className="ttl">COM IV · Mock #3</span>
                  <span className="mock-timer">
                    <span className="blip" />
                    <span className="num">{fmtTime(mockLeft)}</span>
                  </span>
                </div>
                <div className="mock-row">
                  <span className="k">1</span>
                  <div className="bar"><div className="skl w90" /><div className="skl w70" /></div>
                </div>
                <div className="mock-row">
                  <span className="k">2</span>
                  <div className="bar"><div className="skl w80" /><div className="skl w50" /></div>
                </div>
                <div className="mock-row">
                  <span className="k">3</span>
                  <div className="bar"><div className="skl w90" /><div className="skl w70" /></div>
                </div>
                <div className="mock-cta">
                  <button type="button" className="btn btn-dark" onClick={() => p.onStartMockExam ? p.onStartMockExam() : setMockRunning((r) => !r)}>
                    {mockRunning ? '⏸ พัก' : '▶ เริ่มจับเวลา'}
                  </button>
                  <span className="mock-meta">100 ข้อ · 90 นาที</span>
                </div>
              </div>
              <div>
                <h3>จำลองสนามสอบจริง จับเวลาเป๊ะ</h3>
                <p className="desc">ชุด Mock Exam สุ่มข้อตามสัดส่วนจริงของแต่ละ COM ฝึกบริหารเวลาและความกดดันก่อนวันสอบจริง</p>
                <ul className="check">
                  <li><span className="ck">✓</span> สุ่มข้อตาม blueprint ของแต่ละวิชา</li>
                  <li><span className="ck">✓</span> นาฬิกานับถอยหลัง + เตือนเมื่อใกล้หมดเวลา</li>
                  <li><span className="ck">✓</span> รายงานผลแยกราย topic หลังส่ง</li>
                  <li><span className="ck">✓</span> เปรียบเทียบคะแนนกับนิสิตทั้งรุ่น</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Panel M3 */}
          <div className={`panel ${activeTab === 'm3' ? 'on' : ''}`} id="m3">
            <div className="panel-grid">
              <div>
                <h3>สรุปคลิปย้อนหลัง สั้น กระชับ ตรงจุดที่ออกสอบ</h3>
                <p className="desc">คลิปสรุปเนื้อหา 5–20 นาที ตัดเฉพาะส่วนที่ออกสอบบ่อย ดูทบทวนระหว่างเดินทางหรือก่อนนอนได้</p>
                <ul className="check">
                  <li><span className="ck">✓</span> สรุปเป็น mind-map & flashcard</li>
                  <li><span className="ck">✓</span> แบ่งตาม chapter ตรงกับเลกเชอร์</li>
                  <li><span className="ck">✓</span> มี timestamp กระโดดไปจุดสำคัญ</li>
                </ul>
              </div>
              <div className="panel-visual">
                <div className="miniclip">
                  <img src="https://image.qwenlm.ai/public_source/dc693399-5212-423d-8491-d675c6a8ef9e/103a6e8eb-85b4-435b-a539-6fe6d9c3cecc.png" alt="NSAIDs" />
                  <div>
                    <div className="mc-t">NSAIDs ในสุนัขและแมว</div>
                    <div className="mc-m">COM III · 12:45</div>
                  </div>
                  <span className="play">▶</span>
                </div>
                <div className="miniclip">
                  <img src="https://image.qwenlm.ai/public_source/dc693399-5212-423d-8491-d675c6a8ef9e/162a4d801-d94b-4e36-9c09-c9dc53f4f43b.png" alt="Suture" />
                  <div>
                    <div className="mc-t">เทคนิคการเย็บแผลพื้นฐาน</div>
                    <div className="mc-m">COM IV · 18:20</div>
                  </div>
                  <span className="play">▶</span>
                </div>
                <div className="miniclip">
                  <img src="https://image.qwenlm.ai/public_source/dc693399-5212-423d-8491-d675c6a8ef9e/1a274d7ef-fe0c-4cb8-bf1a-b52855a0047b.png" alt="Cardiac" />
                  <div>
                    <div className="mc-t">Approach to Cardiac Case</div>
                    <div className="mc-m">COM IV · 14:08</div>
                  </div>
                  <span className="play">▶</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIPS DARK */}
      <section className="sec clips" id="clips">
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow"><span className="dot" />สรุปคลิปย้อนหลัง</span>
            <h2>เปิดโรงหนังแห่งการทบทวน</h2>
            <p>คัดเฉพาะคลิปที่นิสิตกดดูซ้ำมากที่สุด อัปเดตทุกเทอม</p>
          </div>
          <div className="filters rv">
            {['all', 'com3', 'com4', 'com5'].map((f) => (
              <button
                key={f}
                type="button"
                className={`flt ${clipFilter === f ? 'on' : ''}`}
                onClick={() => setClipFilter(f)}
              >
                {f === 'all' ? 'ทั้งหมด' : f.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="clip-grid">
            {(clipFilter === 'all' || clipFilter === 'com3') && (
              <article className="ccard feat rv" data-cat="com3">
                <div className="cthumb">
                  <img src="https://image.qwenlm.ai/public_source/dc693399-5212-423d-8491-d675c6a8ef9e/103a6e8eb-85b4-435b-a539-6fe6d9c3cecc.png" alt="NSAIDs" />
                  <span className="cat">COM III</span>
                  <span className="dur">12:45</span>
                  <div className="play"><span>▶</span></div>
                </div>
                <div className="cbody">
                  <h4>Pharmacology: NSAIDs ในสุนัขและแมว — กลไก, ข้อห้าม & เคสพิษ</h4>
                  <p className="feat-desc">สรุปครบตั้งแต่ COX selectivity, ขนาดยา, ไปจนถึงการจัดการภาวะไตวายจากยา — พร้อม mnemonic จำง่าย</p>
                  <div className="cmeta"><span>👁 2.1k</span><span>🗓 3 วันที่แล้ว</span><span>⭐ 4.9</span></div>
                </div>
              </article>
            )}

            {(clipFilter === 'all' || clipFilter === 'com4') && (
              <article className="ccard std rv" data-cat="com4">
                <div className="cthumb">
                  <img src="https://image.qwenlm.ai/public_source/dc693399-5212-423d-8491-d675c6a8ef9e/162a4d801-d94b-4e36-9c09-c9dc53f4f43b.png" alt="Surgery" />
                  <span className="cat">COM IV</span>
                  <span className="dur">18:20</span>
                  <div className="play"><span>▶</span></div>
                </div>
                <div className="cbody">
                  <h4>Surgery: เทคนิคการเย็บแผลและ pattern พื้นฐาน</h4>
                  <div className="cmeta"><span>👁 1.8k</span><span>🗓 1 สัปดาห์</span></div>
                </div>
              </article>
            )}

            {(clipFilter === 'all' || clipFilter === 'com5') && (
              <article className="ccard std rv" data-cat="com5">
                <div className="cthumb">
                  <img src="https://image.qwenlm.ai/public_source/dc693399-5212-423d-8491-d675c6a8ef9e/135ff700f-f0ae-449b-a0f2-ac618daed3b6.png" alt="Ultrasound" />
                  <span className="cat">COM V</span>
                  <span className="dur">15:02</span>
                  <div className="play"><span>▶</span></div>
                </div>
                <div className="cbody">
                  <h4>Theriogenology: อัลตราซาวด์ตรวจครรภ์</h4>
                  <div className="cmeta"><span>👁 1.2k</span><span>🗓 5 วัน</span></div>
                </div>
              </article>
            )}

            {(clipFilter === 'all' || clipFilter === 'com4') && (
              <article className="ccard std rv" data-cat="com4">
                <div className="cthumb">
                  <img src="https://image.qwenlm.ai/public_source/dc693399-5212-423d-8491-d675c6a8ef9e/1a274d7ef-fe0c-4cb8-bf1a-b52855a0047b.png" alt="Cardiac" />
                  <span className="cat">COM IV</span>
                  <span className="dur">14:08</span>
                  <div className="play"><span>▶</span></div>
                </div>
                <div className="cbody">
                  <h4>Internal Med: Approach to Cardiac Case</h4>
                  <div className="cmeta"><span>👁 3.4k</span><span>🗓 2 สัปดาห์</span></div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* LIVE + BOARD */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head rv">
            <span className="eyebrow"><span className="dot" />ชุมชนคนซ้อม</span>
            <h2>คุณไม่ได้ซ้อมคนเดียว</h2>
            <p>ดูกิจกรรมสดและอันดับ streak — แรงบันดาลใจเล็ก ๆ ที่ทำให้กด “ข้อถัดไป” ต่อได้</p>
          </div>
          <div className="duo">
            <div className="card-box rv">
              <div className="hd">
                <h3>กิจกรรมล่าสุด</h3>
                <span className="live-tag"><span className="pd" /> LIVE</span>
              </div>
              <ul className="feed">
                {feedList.map((item, idx) => (
                  <li key={idx} className={item.isNew ? 'new' : ''}>
                    <span className="av" style={{ background: item.c }}>
                      {item.t.includes('ปี 4') ? 'ปี4' : item.t.includes('ปี 3') ? 'ปี3' : item.t.includes('ปี 5') ? 'ปี5' : 'ปี?'}
                    </span>
                    <div>
                      <div className="ft" dangerouslySetInnerHTML={{ __html: `${item.t} — ${item.s}` }} />
                      <div className="ftime">{item.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-box rv">
              <div className="hd">
                <h3>อันดับ Streak ประจำสัปดาห์</h3>
                <span className="num" style={{ color: 'var(--ink-2)', fontFamily: 'Chakra Petch', fontSize: '.82rem' }}>Top 5</span>
              </div>
              <ul className="board">
                {BOARD.map((b, i) => (
                  <li key={i}>
                    <span className="rk">{i + 1}</span>
                    <span className="av" style={{ background: b.c }}>{b.n.slice(0, 2).toUpperCase()}</span>
                    <div>
                      <div className="nm">{b.n}</div>
                      <div className="yr">{b.y}</div>
                    </div>
                    <div className="rt">
                      <div className="st">🔥 {b.st} วัน</div>
                      <div className="xp num">{b.xp} XP</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="wrap">
          <div className="cta-box rv">
            <div className="cta-inner">
              <div>
                <h2>สอบจริงไม่หวั่น เพราะซ้อมมาพอแล้ว</h2>
                <p>เริ่มทำโจทย์ชุดแรกวันนี้ — ฟรี สำหรับนิสิตคณะสัตวแพทยศาสตร์ จุฬาฯ</p>
                <div className="cta-note">※ ต้องเปิด JavaScript เพื่อใช้งานระบบซ้อม</div>
              </div>
              <button type="button" className="btn btn-dark" onClick={p.onEnterApp}>
                เริ่มซ้อมเลย 🐾
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <a href="#top" className="logo">
                <span className="mark">
                  <svg viewBox="0 0 32 32">
                    <g fill="#ffb020">
                      <ellipse cx="16" cy="20" rx="5.5" ry="4.5"/>
                      <ellipse cx="9" cy="13" rx="2.4" ry="3.1"/>
                      <ellipse cx="14" cy="10" rx="2.4" ry="3.1"/>
                      <ellipse cx="20" cy="10" rx="2.4" ry="3.1"/>
                      <ellipse cx="24" cy="13" rx="2.4" ry="3.1"/>
                    </g>
                  </svg>
                </span>
                <span>VetMock<small>Chula · Vet</small></span>
              </a>
              <p>คลังโจทย์ฝึกนิสิตสัตวแพทย์ จุฬาฯ — MCQ + แนวข้อสอบ + สรุปคลิปย้อนหลัง ทำด้วยใจโดยนิสิต เพื่อนิสิต</p>
            </div>
            <div className="foot-col">
              <h5>สนามสอบ</h5>
              <a href="#subjects">COM III</a>
              <a href="#subjects">COM IV</a>
              <a href="#subjects">COM V</a>
              <a href="#subjects">Eng Vet Prof II</a>
            </div>
            <div className="foot-col">
              <h5>ชั้นปี</h5>
              <a href="#roadmap">ปี 1–2 (เร็ว ๆ นี้)</a>
              <a href="#roadmap">ปี 3</a>
              <a href="#roadmap">ปี 4</a>
              <a href="#roadmap">ปี 5–6</a>
            </div>
            <div className="foot-col">
              <h5>เพิ่มเติม</h5>
              <a href="#modes">โหมดซ้อม</a>
              <a href="#clips">คลิปย้อนหลัง</a>
              <a href="#top">เกี่ยวกับเรา</a>
              <a href="#top">ติดต่อ</a>
            </div>
          </div>
          <div className="foot-bot">
            <span>© 2569 VetMock · คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย</span>
            <span>ทำด้วย <span class="heart">♥</span> โดยนิสิตสัตวแพทย์ จุฬาฯ</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
