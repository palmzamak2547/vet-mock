// What the bank writes in an explanation and what the pages draw. The bank marks its lines with
// emoji (a bulb before the takeaway, a cross before the options that fail, a warning sign) and
// heads the reasons for the other options with "ทำไมข้ออื่นผิด". The site draws no emoji and shows
// that heading as a label; no word may go. The examples are explanations as the bank ships them
// (the main app's source file is named beside each); the last test runs all of them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanExplain } from '../../src/lib/explain.js';
import { hasEmoji, stripEmoji } from '../../src/lib/emoji.js';
import { BANK } from '../../src/generated/bank.js';
import { readDomain } from '../support/bank-files.mjs';

// The warning sign as the bank writes it: mostly with the emoji selector after it, in com1 without.
const WARN_SIGN = String.fromCodePoint(0x26A0);
const SELECTOR = String.fromCodePoint(0xFE0F);
const WARN = WARN_SIGN + SELECTOR;

/** The blocks as one string, a label in [[ ]], so an expectation reads at a glance. */
const outline = (blocks) => blocks.map((b) => (b.kind === 'label' ? `[[${b.text}]]` : b.text)).join('');
const plain = (blocks) => blocks.map((b) => b.text).join('');

// questions-vet-dev.js, vet-dev-anat 71001: a paragraph, the heading, dash items, a bulb line.
const STANDARD = "Ascending colon เป็นส่วนที่ผันแปรตามชนิดสัตว์มากที่สุด — ม้ามี ascending colon (great colon) ขนาดใหญ่พับซับซ้อน, สัตว์เคี้ยวเอื้องและสุกรมี spiral colon, สุนัขสั้นเรียบ ส่วน duodenum ค่อนข้างคงรูปทุกชนิด\n\n❌ ทำไมข้ออื่นผิด\n— \"Ascending duodenum\" = ส่วนหนึ่งของ duodenum ซึ่งมีรูปแบบใกล้เคียงกันทุกชนิดตามที่กล่าวข้างต้น\n— \"Descending duodenum\" = อีกส่วนของ duodenum เช่นกัน ไม่ใช่จุดที่ชนิดสัตว์ต่างกันมาก\n— \"Descending colon\" = ลำไส้ใหญ่ส่วนท้ายที่ทอดต่อไปยัง rectum ไม่ใช่ส่วนที่ขดเป็น great colon หรือ spiral colon\n— \"Descending duodenum และ ascending duodenum เท่ากัน\" = ยังเป็น duodenum ทั้งคู่ จึงไม่ใช่ส่วนที่ต่างกันมากที่สุดอยู่ดี\n\n💡 ชื่อเฉพาะที่แต่ละชนิดใช้เรียกลำไส้ใหญ่ (great colon ในม้า, spiral colon ในสัตว์เคี้ยวเอื้องและสุกร) ล้วนเป็น ascending colon ทั้งนั้น";

// questions-vet-juris.js, vet-juris 93028: tick and cross marks that say which option is right, then a bulb.
const TICKS = "✓ ตุ๊กแกถูกเพิ่มเป็น 'สัตว์' ตาม พรบ.โรคระบาดสัตว์ 2558 เพราะเป็น zoonosis vector (นำโรคจากสัตว์มาสู่คน)\n✗ บริโภคเนื้อ (กวาง) · OIE/น้ำผึ้ง (ผึ้ง)\n💡 ตุ๊กแก = zoonosis-driven inclusion";

// questions-vca.js, vca 6471: a bulb in front of Latin text.
const BULB = "Piglet iron deficiency anemia พบบ่อย (sow milk Fe ต่ำ + rapid growth), Iron dextran IM 200 mg ที่อายุ 3-7 วัน = standard, ป้องกัน hemolytic anemia + improve weight gain\n\n💡 Fe 100-200 mg";

// questions-mid86-aquatic-clinic.js, aquatic-clinic 202198: heading, bulb, then a warning sign with the emoji selector.
const WARNING = "โปรโตซัวมีขนในกบที่พบบ่อยคือ Opalina และ Balantidium ติดต่อทางการกินอาหารสดที่ไม่มีคุณภาพแบบ fecal-oral ถ้าอาการหนักจะถ่ายเหลวและมีมูลสีขาว รักษาด้วย metronidazole ทางปาก\n\n❌ ทำไมข้ออื่นผิด\n— Doxycycline ใช้รักษา chlamydiosis ในกบ ไม่ใช่โปรโตซัวกลุ่มนี้\n— Ivermectin ใช้กับปรสิตกลุ่มพยาธิ ไม่ใช่โปรโตซัวในทางเดินอาหาร\n— Amoxicillin เป็นยาปฏิชีวนะที่ไม่ครอบคลุมโปรโตซัว\n\n💡 โปรโตซัวในลำไส้ ให้นึกถึง metronidazole ก่อน\n\n" + WARN + " ตอนใช้จริงในฟาร์ม กบเลี้ยงเป็นสัตว์ที่ส่งไปบริโภค metronidazole อยู่ในกลุ่ม nitroimidazole ที่สหรัฐห้ามใช้นอกฉลากในสัตว์เพื่อการบริโภค (21 CFR 530.41(a)(6)) การเลือกยาหน้างานจึงต้องดูข้อกำหนดสารตกค้างของปลายทางที่ส่งไปด้วย";

// questions-com3.js, com3 1393: the heading led by a cross mark and followed by a colon.
const CROSS_HEADING = "C1-C5 lesion → UMN ทั้ง 4 ขา (เพราะ tract ลงต่ำกว่ายังไม่ถึง intumescence)\n\n✗ ทำไมข้ออื่นผิด:\n— C6-T2 = LMN ขาหน้า + UMN ขาหลัง (intumescence)\n— T3-L3 = ขาหน้าปกติ + UMN ขาหลัง\n— L4-S3 = ขาหน้าปกติ + LMN ขาหลัง";

// questions-y5-osce-ruminant.js, ruminant-clinical 8300: no picture at all, a colon after the heading.
const COLON_HEADING = "CUI = Check-up after Uterine Involution · เกณฑ์: DIM 30-60, ไม่พบสัด, ไม่มี insem → ใช้ตรวจหลังมดลูกฟื้นตัวว่ากลับมา cycle ปกติหรือยัง\nDIM 45 = อยู่ใน window 30-60 → CUI\n\nทำไมข้ออื่นผิด:\n— COA = DIM ≥ 60 หรือเคยสัดแต่ไม่ผสม (case นี้ DIM ยังน้อย)\n— PD = ต้องเคยผสมเทียม ≥28d (case นี้ไม่มี insem)\n— skip = DIM <30 หรือ insem <28d (case นี้ DIM 45 = pass voluntary waiting)\n— GnRH-Ovsynch ไม่ใช่ HHM screening program";

// questions-y5-milk-2026-b.js, milk-meat-hygiene 105644: the heading run into the line after a sentence.
const INLINE = "โครงสร้างที่กั้นไม่ให้น้ำนมไหลออกจาก teat cistern ลงสู่ teat canal คือ Furstenberg's rosette ซึ่งเป็นกลุ่มกล้ามเนื้อและเยื่อเมือกที่พับซ้อนกันคล้ายกลีบกุหลาบอยู่ที่รอยต่อระหว่าง teat cistern กับ teat canal นอกจากกั้นน้ำนมแล้วยังเป็นด่านกรองเชื้อไม่ให้ขึ้นสู่เต้านม ❌ ทำไมข้ออื่นผิด — annular fold เป็นรอยพับกั้นระหว่าง gland cistern กับ teat cistern คนละตำแหน่ง — myoepithelial cell รอบ alveolus ทำหน้าที่บีบไล่น้ำนมออก ไม่ได้กั้นการรั่ว — ในตำรากายวิภาคทั่วไปจะแยก teat sphincter ที่ล้อมรอบ streak canal ออกมาเป็นหูรูดอีกชั้นหนึ่ง แต่ในวิชานี้ชี้ที่ rosette เป็นตัวหลัก";

// questions-mid86-aquatic-clinic.js, aquatic-clinic 202422: the heading with words after it is a sentence, not a label.
const QUALIFIED = "กุ้งไม่มี B cell และไม่มี immunoglobulin จึงไม่มี clonal expansion ตัวเลือกนี้จับ proPO ซึ่งเป็นกลไกจริงของกุ้งมาผูกกับ B cell ที่กุ้งไม่มี จึงเป็นข้อที่ผิด\n\n❌ ทำไมข้ออื่นผิด ในความหมายว่าเป็นสิ่งที่กุ้งทำได้จริง\n— hyaline cell และ semi granular cell ของกุ้งจับกินเชื้อและหลั่งสารสื่อได้\n— hemocyte เข้าล้อมและดักจับสิ่งแปลกปลอมเป็นกลไกหลักของกุ้ง\n— การหลั่งแกรนูลและการสร้างแคปซูลล้อมเชื้อเป็นภาพคลาสสิกของ crustacean\n— antimicrobial peptide เป็น humoral factor สำคัญที่กุ้งสร้างได้\n\n💡 เจอคำว่า B cell, MHC หรือ antibody ในโจทย์กุ้ง ให้สงสัยไว้ก่อน";

// questions-com4.js, com4 1087: a tick box first, then bulbs, one to a line.
const TICK_BOX = "✅ ถูก, Direct Antiglobulin Test (DAT/Coomb's) = gold standard\n\n💡 ใช้ Coomb's reagent (anti-IgG + anti-IgM + anti-C3) ลงบน RBC ผู้ป่วยที่ล้างแล้ว → ถ้า RBC มี Ab/complement เคลือบ → reagent cross-link → agglutination (+)\n💡 Sensitivity ~60-70%, Specificity > 90%\n💡 ก่อน Coomb's ทำ slide agglutination test ก่อน — positive autoagglutination = strong IMHA, ข้าม Coomb's ได้";

test('a heading line becomes a label; the bulb goes and the Thai after it stays', () => {
  const blocks = cleanExplain(STANDARD);
  assert.deepEqual(blocks.map((b) => b.kind), ['text', 'label', 'text']);
  assert.equal(blocks[1].text, 'ทำไมข้ออื่นผิด');
  assert.ok(blocks[0].text.endsWith('ส่วน duodenum ค่อนข้างคงรูปทุกชนิด\n\n'), 'the blank line above the heading stays');
  assert.ok(blocks[2].text.startsWith('— "Ascending duodenum" = '), 'the dash items follow the label, as they followed the heading');
  assert.ok(blocks[2].text.endsWith('ล้วนเป็น ascending colon ทั้งนั้น'));
  assert.ok(blocks[2].text.includes('\n\nชื่อเฉพาะที่แต่ละชนิดใช้เรียกลำไส้ใหญ่ (great colon ในม้า'), 'the takeaway is a paragraph of its own, without its bulb');
  assert.ok(!hasEmoji(plain(blocks)));
});

test('tick and cross marks say which option is right, so they stay; the bulb goes', () => {
  assert.equal(outline(cleanExplain(TICKS)), "✓ ตุ๊กแกถูกเพิ่มเป็น 'สัตว์' ตาม พรบ.โรคระบาดสัตว์ 2558 เพราะเป็น zoonosis vector (นำโรคจากสัตว์มาสู่คน)\n✗ บริโภคเนื้อ (กวาง) · OIE/น้ำผึ้ง (ผึ้ง)\nตุ๊กแก = zoonosis-driven inclusion");
});

test('a bulb in front of Latin text, and a tick box in front of Thai', () => {
  assert.equal(outline(cleanExplain(BULB)), BULB.replace('💡 ', ''));
  assert.equal(outline(cleanExplain(TICK_BOX)).split('\n')[0], "ถูก, Direct Antiglobulin Test (DAT/Coomb's) = gold standard");
  assert.equal(outline(cleanExplain(TICK_BOX)), TICK_BOX.replaceAll('💡 ', '').replace('✅ ', ''));
});

test('a warning sign goes, with or without the emoji selector, and after a bullet', () => {
  const out = outline(cleanExplain(WARNING));
  assert.ok(out.includes('\n\nตอนใช้จริงในฟาร์ม กบเลี้ยงเป็นสัตว์ที่ส่งไปบริโภค metronidazole'), 'questions-mid86-aquatic-clinic 202198');
  assert.ok(!out.includes(WARN_SIGN) && !out.includes(SELECTOR));
  // com1 90029 writes the sign alone; practrum 2001 puts it after a bullet.
  assert.equal(outline(cleanExplain(`${WARN_SIGN} Emergency = hyperkalemia → bradycardia → cardiac arrest`)), 'Emergency = hyperkalemia → bradycardia → cardiac arrest');
  assert.equal(outline(cleanExplain(`• ${WARN} ระวังให้เกิด Hypoxia + pulmonary edema`)), '• ระวังให้เกิด Hypoxia + pulmonary edema');
});

test('a star in the middle of a line goes, and leaves the spacing of the sentence', () => {
  assert.equal(outline(cleanExplain('💡 **CuSO4 (Copper sulfate)** ⭐ most common:')), '**CuSO4 (Copper sulfate)** most common:');
  assert.equal(outline(cleanExplain('• **Peterson nerve block** ⭐:')), '• **Peterson nerve block**:', 'no space is left before a colon');
  assert.equal(outline(cleanExplain('• **Score 3**: Optimal pancake/cow pie (กึ่งกองกึ่งเปียก, 2-4 cm tall) ⭐ **ideal for lactating**')), '• **Score 3**: Optimal pancake/cow pie (กึ่งกองกึ่งเปียก, 2-4 cm tall) **ideal for lactating**');
  assert.equal(outline(cleanExplain('1. Pass orogastric tube → release gas immediately ⭐')), '1. Pass orogastric tube → release gas immediately');
});

test('the heading is a label with its marker and colon left off, whichever way it is written', () => {
  const cross = cleanExplain(CROSS_HEADING);
  assert.deepEqual(cross.map((b) => b.kind), ['text', 'label', 'text']);
  assert.equal(cross[1].text, 'ทำไมข้ออื่นผิด');
  assert.ok(cross[2].text.startsWith('— C6-T2 = LMN ขาหน้า + UMN ขาหลัง (intumescence)\n'));

  const bare = cleanExplain(COLON_HEADING);
  assert.deepEqual(bare.map((b) => b.kind), ['text', 'label', 'text']);
  assert.equal(bare[1].text, 'ทำไมข้ออื่นผิด');
  assert.ok(bare[0].text.includes('เกณฑ์: DIM 30-60'), 'a colon elsewhere in the line is left alone');

  // The other two headings the bank writes over its reasons.
  assert.equal(cleanExplain('x\n\n❌ ทำไมข้ออื่นถูก\n— y')[1].text, 'ทำไมข้ออื่นถูก');
  assert.equal(cleanExplain('x\n\n❌ ข้ออื่น\n— y')[1].text, 'ข้ออื่น');
  assert.equal(cleanExplain('x\n\n✓ ข้ออื่นถูก\n— y')[1].text, 'ข้ออื่นถูก');
});

test('a heading with words after it is a sentence: only its marker goes', () => {
  const blocks = cleanExplain(QUALIFIED);
  assert.deepEqual(blocks.map((b) => b.kind), ['text']);
  assert.ok(blocks[0].text.includes('\n\nทำไมข้ออื่นผิด ในความหมายว่าเป็นสิ่งที่กุ้งทำได้จริง\n— hyaline cell'));
  assert.ok(blocks[0].text.endsWith('\n\nเจอคำว่า B cell, MHC หรือ antibody ในโจทย์กุ้ง ให้สงสัยไว้ก่อน'));
});

test('a heading run into the line after a sentence is split out as a label', () => {
  const blocks = cleanExplain(INLINE);
  assert.deepEqual(blocks.map((b) => b.kind), ['text', 'label', 'text']);
  assert.ok(blocks[0].text.endsWith('ไม่ให้ขึ้นสู่เต้านม\n\n'), 'the sentence stands apart from the label');
  assert.equal(blocks[1].text, 'ทำไมข้ออื่นผิด');
  assert.ok(blocks[2].text.startsWith('— annular fold เป็นรอยพับกั้นระหว่าง gland cistern'), 'no stray space; the dash items follow');
  assert.ok(blocks[2].text.endsWith('แต่ในวิชานี้ชี้ที่ rosette เป็นตัวหลัก'));
});

test('symbols a sentence needs are not emoji: ® ↔ ♂ ♥ stay', () => {
  const kept = [
    'Premi®Test = screening (broad-spectrum antibiotic detection) ไม่ใช่ confirmatory', // food-safety-y4 92525
    'Toe elevation/extension test → positive ↔ navicular syndrome, MRI definitive', // vca 6652
    'ใช้ดูร่วมกับ tail length (♂ ยาว)', // repro-lect 2056
    '✓ Valentine shape = หัวใจดูเป็นรูปหัวใจ (♥) บน VD/DV view', // vet-imaging 91029
  ];
  for (const line of kept) assert.equal(outline(cleanExplain(line)), line);
  assert.ok(!hasEmoji('Apoquel® ↔ ♂ ♀ ♥ ✓ ✗'));
});

test('nothing in, nothing out', () => {
  assert.deepEqual(cleanExplain(''), []);
  assert.deepEqual(cleanExplain(null), []);
  assert.deepEqual(cleanExplain(undefined), []);
  assert.deepEqual(cleanExplain('  \n '), []);
  assert.deepEqual(cleanExplain('💡'), []);
  assert.deepEqual(cleanExplain('ทำไมข้ออื่นผิด'), [{ kind: 'label', text: 'ทำไมข้ออื่นผิด' }]);
});

test('every explanation in the bank: no emoji left, every word kept, a label only over a heading', () => {
  const skeleton = (s) => s.replace(/[^\p{L}\p{N}]/gu, '');
  let withEmoji = 0;
  let labels = 0;
  let checked = 0;
  for (const card of BANK.domains) {
    const { questions } = readDomain(card);
    for (const q of questions) {
      if (!q.explain) continue;
      checked += 1;
      const where = `${q.subject}:${q.id}`;
      const blocks = cleanExplain(q.explain);
      const out = plain(blocks);
      if (hasEmoji(q.explain)) withEmoji += 1;
      assert.ok(!hasEmoji(out), `${where}: an emoji is left`);
      assert.equal(skeleton(out), skeleton(stripEmoji(q.explain)), `${where}: a word was lost or added`);
      for (const b of blocks) {
        if (b.kind === 'label') {
          labels += 1;
          assert.match(b.text, /^(?:ทำไม)?ข้ออื่น(?:ผิด|ถูก)?$/, `${where}: a label that is not a heading`);
        } else {
          assert.ok(b.text.trim(), `${where}: an empty block`);
        }
      }
    }
  }
  assert.ok(checked > 5000, `read ${checked} explanations`);
  assert.ok(withEmoji > 2000, `${withEmoji} explanations carried emoji`);
  assert.ok(labels > 2000, `${labels} headings became labels`);
});
