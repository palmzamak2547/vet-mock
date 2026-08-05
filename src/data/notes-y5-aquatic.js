// ============================================================
// คลินิกสัตว์น้ำ — Study Notes
// ============================================================
// เขียนจาก lecture 3107520 ที่แจกจริงในรายวิชา ทุก section อ้างอิงสไลด์
// พร้อมเลขหน้า ไม่ได้เขียนจากความจำ และไม่ได้เติมเนื้อหานอกสไลด์
//
// ที่ไหนสไลด์ไม่ได้บอก จะเขียนกำกับไว้ตรงๆ ว่าสไลด์ไม่ได้บอก แทนที่จะเดาให้
//
// Body item types:
//   { bullets: [string] }        — bulleted list
//   { sub, body }                — sub-section
//   { callout, kind }            — kind: 'tip' | 'warn' | 'flag'
//   { text }                     — paragraph
// ============================================================

export const NOTES_Y5_AQUATIC = {
  "aqua-disease-control": {
    "topic": "aqua-disease-control",
    "title": "โรคระบาดในสัตว์น้ำตาม พ.ร.บ. โรคระบาดสัตว์ พ.ศ. 2558",
    "icon": "⚖️",
    "summary": "เอกสารเสริมชุดนี้เป็นตัวบทกฎหมายล้วน ไล่จากพระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558 (นิยาม \"สัตว์\" \"ซากสัตว์\" \"โรคระบาด\" และหน้าที่แจ้งภายใน 12 ชั่วโมงตามมาตรา 11) ต่อด้วยประกาศกระทรวงเกษตรและสหกรณ์ 2 ฉบับ คือ ประกาศกำหนดสัตว์ชนิดอื่น (ทำให้ปลา กุ้ง กบ เต่า ตะพาบน้ำ และสัตว์น้ำอื่นเข้ามาอยู่ใต้ พ.ร.บ. นี้) และประกาศกำหนดโรคระบาดสัตว์เพิ่มเติม ซึ่งหมวด ฉ. ระบุโรคระบาดในสัตว์น้ำไว้ 34 โรค ปิดท้ายด้วยหมวด จ. โรคระบาดในสัตว์หลายชนิด 17 โรค",
    "sections": [
      {
        "heading": "ตัวพระราชบัญญัติและการยกเลิกกฎหมายเดิม",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.1-2",
        "body": [
          {
            "text": "สไลด์หน้าแรกเป็นหน้าราชกิจจานุเบกษาของ **พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558** (เล่ม 132 ตอนที่ 14 ก หน้า 22 ราชกิจจานุเบกษา 2 มีนาคม 2558) ให้ไว้ ณ วันที่ 25 กุมภาพันธ์ พ.ศ. 2558 เป็นปีที่ 70 ในรัชกาลปัจจุบัน โดยเหตุผลที่ระบุไว้คือ \"เป็นการสมควรปรับปรุงกฎหมายว่าด้วยโรคระบาดสัตว์\""
          },
          {
            "bullets": [
              "**มาตรา 1** พระราชบัญญัตินี้เรียกว่า \"พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558\"",
              "**มาตรา 2** ให้ใช้บังคับตั้งแต่วันถัดจากวันประกาศในราชกิจจานุเบกษาเป็นต้นไป",
              "**มาตรา 3 ให้ยกเลิก** (1) พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2499 และ (2) พระราชบัญญัติโรคระบาดสัตว์ (ฉบับที่ 2) พ.ศ. 2542"
            ]
          },
          {
            "callout": "ตัวเลขปีที่ต้องแยกให้ชัด ฉบับที่ใช้อยู่คือ พ.ศ. 2558 ส่วน พ.ศ. 2499 กับ พ.ศ. 2542 คือฉบับที่ถูกยกเลิกไปแล้ว",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "นิยาม \"สัตว์\" ตามพระราชบัญญัติ",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.2",
        "body": [
          {
            "text": "สไลด์แบ่งนิยามคำว่า \"สัตว์\" ออกเป็น 3 อนุมาตรา และไฮไลต์ไว้ว่านิยามครอบคลุมไปถึงวัสดุสืบพันธุ์ด้วย ไม่ใช่เฉพาะตัวสัตว์"
          },
          {
            "sub": "(1) สัตว์บกที่ระบุชื่อไว้",
            "body": [
              {
                "text": "ช้าง ม้า โค กระบือ ลา ล่อ แพะ แกะ กวาง สุกร หมูป่า สุนัข แมว กระต่าย ลิง ชะนี และให้หมายความรวมถึง **น้ำเชื้อสำหรับผสมพันธุ์และเอ็มบริโอ** ของสัตว์เหล่านี้ด้วย"
              }
            ]
          },
          {
            "sub": "(2) สัตว์ปีก",
            "body": [
              {
                "text": "สัตว์ปีกจำพวกนก ไก่ เป็ด ห่าน และให้หมายความรวมถึงน้ำเชื้อสำหรับผสมพันธุ์และ **ไข่สำหรับใช้ทำพันธุ์**"
              }
            ]
          },
          {
            "sub": "(3) สัตว์ชนิดอื่นตามที่รัฐมนตรีประกาศกำหนด",
            "body": [
              {
                "text": "**สัตว์ชนิดอื่นตามที่รัฐมนตรีประกาศกำหนด** และให้หมายความรวมถึงน้ำเชื้อสำหรับผสมพันธุ์ เอ็มบริโอ และไข่สำหรับใช้ทำพันธุ์ของสัตว์ชนิดนั้นด้วย"
              },
              {
                "callout": "อนุมาตรา (3) นี้คือช่องทางที่ทำให้สัตว์น้ำเข้ามาอยู่ใต้ พ.ร.บ. ฉบับนี้ ผ่านประกาศกระทรวงเกษตรและสหกรณ์ที่อยู่ในสไลด์ถัดไป",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "นิยาม \"ซากสัตว์\"",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.2",
        "body": [
          {
            "text": "\"ซากสัตว์\" หมายความว่า ร่างกายหรือส่วนของร่างกายสัตว์ที่ตายแล้ว สิ่งใด ๆ ที่ได้จากสัตว์ที่มีชีวิตหรือสัตว์ที่ตายแล้ว และให้หมายความรวมถึง **อาหารสุก** ที่ทำ ประกอบ หรือปรุงจากซากสัตว์ **หรือสิ่งประดิษฐ์สำเร็จรูปที่ทำจากซากสัตว์** ตามที่รัฐมนตรีประกาศกำหนด"
          },
          {
            "callout": "จุดที่สไลด์ไฮไลต์ไว้คือคำว่า \"อาหารสุก\" และ \"สิ่งประดิษฐ์สำเร็จรูปที่ทำจากซากสัตว์\" นั่นคือของที่ปรุงสุกแล้วก็ยังนับเป็นซากสัตว์ตามกฎหมายนี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "นิยาม \"โรคระบาด\" ที่ระบุชื่อไว้ในตัวพระราชบัญญัติ",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.3",
        "body": [
          {
            "text": "\"โรคระบาด\" ตามตัวพระราชบัญญัติ หมายความว่าโรคต่อไปนี้ ทั้งหมดเป็นโรคของสัตว์บกและสัตว์ปีก และปิดท้ายด้วยข้อความเปิดช่องให้เพิ่มได้"
          },
          {
            "bullets": [
              "กาฬโรคเป็ด",
              "โรคไข้หวัดนก",
              "โรคแซลโมเนลลา",
              "โรคทริคิเนลลา",
              "โรคนิวคาสเซิล",
              "โรคบรูเซลลา",
              "โรคปากและเท้าเปื่อย",
              "โรคพิษสุนัขบ้า",
              "โรครินเดอร์เปสต์",
              "โรคเลปโทสไปรา",
              "โรคโลหิตจางติดเชื้อในม้า",
              "โรควัวบ้า",
              "โรคสมองอักเสบนิปาห์",
              "โรคอหิวาต์สุกร",
              "โรคแอนแทรกซ์",
              "โรคเฮโมรายิกเซปทิซีเมีย",
              "วัณโรค",
              "**และโรคอื่นตามที่รัฐมนตรีประกาศกำหนด**"
            ]
          },
          {
            "callout": "ในรายชื่อชุดนี้ยังไม่มีโรคของสัตว์น้ำเลยแม้แต่โรคเดียว โรคสัตว์น้ำทั้งหมดมาจากประกาศกระทรวงที่อาศัยวรรค \"โรคอื่นตามที่รัฐมนตรีประกาศกำหนด\"",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "มาตรา 11 หน้าที่แจ้งของเจ้าของสัตว์",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.3",
        "body": [
          {
            "text": "มาตรา 11 ให้ **เจ้าของสัตว์** แจ้งต่อพนักงานเจ้าหน้าที่ สารวัตร หรือสัตวแพทย์ ภายในเวลา **สิบสองชั่วโมง** นับแต่เวลาที่ทราบว่าสัตว์ป่วยหรือตาย เมื่อมีกรณีดังต่อไปนี้"
          },
          {
            "bullets": [
              "(1) มีสัตว์ป่วยหรือตายโดย **รู้ว่าเป็นโรคระบาด**",
              "(2) มีสัตว์ป่วยหรือตายโดย **ไม่รู้สาเหตุ**",
              "(3) ในหมู่บ้านเดียวกันหรือบริเวณใกล้เคียงกัน มีสัตว์ป่วยหรือตาย **มีอาการคล้ายกันในเวลาห่างกันไม่เกินเจ็ดวัน**"
            ]
          },
          {
            "callout": "ตัวเลขที่ต้องจำแม่น 12 ชั่วโมงสำหรับการแจ้ง และ 7 วันสำหรับเกณฑ์กรณีที่ 3 ส่วนผู้รับแจ้งมี 3 กลุ่ม คือพนักงานเจ้าหน้าที่ สารวัตร และสัตวแพทย์",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ประกาศกระทรวงเกษตรและสหกรณ์ เรื่อง กำหนดสัตว์ชนิดอื่น",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.4",
        "body": [
          {
            "text": "ประกาศนี้ออกโดยอาศัยอำนาจตามความในคำนิยามคำว่า \"สัตว์\" ตาม **มาตรา 4 ประกอบมาตรา 5** แห่งพระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558 โดยรัฐมนตรีว่าการกระทรวงเกษตรและสหกรณ์ ข้อ 1 ให้ใช้บังคับตั้งแต่วันประกาศในราชกิจจานุเบกษาเป็นต้นไป ข้อ 2 ให้สัตว์ที่ระบุในบัญชีเป็น **สัตว์ชนิดอื่นตามมาตรา 4** หน้าที่นำมาแสดงคือเล่ม 132 ตอนพิเศษ 251 ง ราชกิจจานุเบกษา 13 ตุลาคม 2558"
          },
          {
            "text": "อาจารย์ตีกรอบสีแดงเน้นรายการที่เป็นสัตว์น้ำไว้ในบัญชี ได้แก่"
          },
          {
            "bullets": [
              "**(1) กบ และรวมถึงสัตว์จำพวกสะเทินน้ำสะเทินบก**",
              "**(9) กุ้ง และรวมถึงสัตว์จำพวกครัสเตเชียน (Crustacean)**",
              "**(20) ตะพาบน้ำ**",
              "**(22) เต่า**",
              "**(26) ปลา**"
            ]
          },
          {
            "text": "ในบัญชีเดียวกันยังมีสัตว์น้ำและสัตว์กึ่งน้ำอื่นที่อ่านได้ชัดเจน เช่น งู จระเข้ (รวมสัตว์ในวงศ์ Crocodylidae) ตะกวด (วงศ์ Varanidae) ตะโขง (วงศ์ Gavialidae) ปลิงทะเล พะยูน เพรียงทราย และรวมถึงสัตว์จำพวกโพลีคีท (Polychaete) แมวน้ำ โลมา วาฬ สิงโตทะเล หมึก และหอย"
          },
          {
            "callout": "รายการอื่น ๆ ในบัญชีบนสไลด์หน้านี้พิมพ์เล็กมากและอ่านไม่ชัดพอที่จะคัดลอกมาทีละข้อ ถ้าต้องการเลขข้อครบทุกรายการให้ไปดูราชกิจจานุเบกษาฉบับจริง เล่ม 132 ตอนพิเศษ 251 ง",
            "kind": "warn"
          },
          {
            "callout": "ประเด็นสอบที่สไลด์ต้องการสื่อคือ ปลา กุ้ง กบ เต่า ตะพาบน้ำ ไม่ได้อยู่ในนิยาม \"สัตว์\" ของตัว พ.ร.บ. โดยตรง แต่เข้ามาโดยประกาศกระทรวงฉบับนี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ประกาศกระทรวงเกษตรและสหกรณ์ เรื่อง กำหนดโรคระบาดสัตว์เพิ่มเติม",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.5",
        "body": [
          {
            "text": "หน้าราชกิจจานุเบกษา เล่ม 132 ตอนพิเศษ 347 ง หน้า 10 วันที่ **29 ธันวาคม 2558** ออกโดยอาศัยอำนาจตามความในคำนิยามคำว่า \"โรคระบาด\" ตาม **มาตรา 4 ประกอบมาตรา 5** แห่งพระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558"
          },
          {
            "bullets": [
              "ข้อ 1 ประกาศฉบับนี้ให้ใช้บังคับตั้งแต่วันประกาศในราชกิจจานุเบกษาเป็นต้นไป",
              "ข้อ 2 ให้เพิ่มโรคดังต่อไปนี้เป็นโรคระบาดตามมาตรา 4 แห่งพระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558"
            ]
          },
          {
            "text": "ประกาศแบ่งโรคเป็นหมวดตามกลุ่มสัตว์ สไลด์แสดงหัวข้อหมวด ก. **โรคระบาดในสัตว์ปีก** (ตัวอย่างที่อ่านได้ คือ (1) โรคอหิวาต์สัตว์ปีก (fowl cholera) และ (2) โรคหลอดลมอักเสบติดเชื้อในสัตว์ปีก (avian infectious bronchitis)) และหมวด ฉ. **โรคระบาดในสัตว์น้ำ**"
          },
          {
            "callout": "สไลด์ตัดข้อความช่วงกลางหน้าออก จึงไม่ได้แสดงว่าหมวด ข. ค. ง. คืออะไร เอกสารชุดนี้บอกเฉพาะหมวด ก. (สัตว์ปีก) หมวด จ. (สัตว์หลายชนิด) และหมวด ฉ. (สัตว์น้ำ) เท่านั้น",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "หมวด ฉ. โรคระบาดในสัตว์น้ำ ข้อ 1 ถึง 5",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.5-6",
        "body": [
          {
            "bullets": [
              "(1) **โรคเครฟิชเพลก (crayfish plague)**",
              "(2) **โรคเคเอชวี (KHV disease หรือ koi herpesvirus disease)**",
              "(3) **โรคไคทริดฟังกัส (chytrid fungus disease หรือ infection with Batrachochytrium dendrobatidis)**",
              "(4) **โรคไจโรแด็กทีโลซิส (gyrodactylosis หรือ infection with Gyrodactylus salaris)**",
              "(5) **โรคซีโนฮาลิโอทิส (xenohaliotis disease หรือ infection with Xenohaliotis californiensis)**"
            ]
          },
          {
            "callout": "ลำดับในประกาศเรียงตามตัวอักษรของชื่อโรคภาษาไทย ไม่ได้เรียงตามชนิดสัตว์หรือชนิดเชื้อ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หมวด ฉ. โรคระบาดในสัตว์น้ำ ข้อ 6 ถึง 21",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.7",
        "body": [
          {
            "bullets": [
              "(6) **โรคติดเชื้อซาลโมนิด แอลฟาไวรัส (infection with salmonid alphavirus)**",
              "(7) **โรคตัวแดงดวงขาว (white spot disease)**",
              "(8) **โรคทีเอส (TS หรือ Taura syndrome)**",
              "(9) **โรคเททระฮีดรัลแบคูโลไวรัส (tetrahedral baculovirosis)**",
              "(10) **โรคโบนาเมีย (bonamiosis)**",
              "(11) **โรคฝีดาษจระเข้ (poxvirus in crocodile)**",
              "(12) **โรคเพอร์คินซัส (perkinsosis)**",
              "(13) **โรคฟูรังคูโลซีส (furunculosis)**",
              "(14) **โรคเมกาโลไซติไวรัส (megalocytivirus disease)**",
              "(15) **โรคมาร์ทีเลีย (infection with Marteilia refringens)**",
              "(16) **โรครานาไวรัส (infection with ranavirus)**",
              "(17) **โรควีเอชเอส (VHS หรือ viral haemorrhagic septicaemia)**",
              "(18) **โรควีเอ็นเอ็น (VNN หรือ viral nervous necrosis)**",
              "(19) **โรคหัวเหลือง (infection with yellow head virus)**",
              "(20) **โรคหางขาว (white tail disease)**",
              "(21) **โรคอาร์เอสไอวี (RSIV disease หรือ red sea bream iridoviral disease)**"
            ]
          },
          {
            "text": "หน้านี้เป็นหน้า 14 ของราชกิจจานุเบกษา เล่ม 132 ตอนพิเศษ 347 ง ลงวันที่ 29 ธันวาคม 2558"
          }
        ]
      },
      {
        "heading": "หมวด ฉ. โรคระบาดในสัตว์น้ำ ข้อ 22 ถึง 32",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.8",
        "body": [
          {
            "bullets": [
              "(22) **โรคอียูเอส (EUS หรือ epizootic ulcerative syndrome)**",
              "(23) **โรคอีเอชเอ็น (EHN หรือ epizootic haematopoietic necrosis)**",
              "(24) **โรคเอเอชพีเอ็นดี (AHPND หรือ acute hepatopancreatic necrosis disease)**",
              "(25) **โรคเอชพีวี (HPV disease หรือ hepatopancreatic parvovirus disease)**",
              "(26) **โรคเอสวีซี (SVC หรือ spring viraemia of carp)**",
              "(27) **โรคเอ็นเอชพี (NHP หรือ necrotising hepatopancreatitis)**",
              "(28) **โรคเอ็มบีวี (MBV disease หรือ spherical baculovirosis)**",
              "(29) **โรคแอบาโลนีเฮอร์พีสไวรัส (infection with abalone herpesvirus)**",
              "(30) **โรคไอพีเอ็น (IPN หรือ infectious pancreatic necrosis)**",
              "(31) **โรคไอเอชเอชเอ็น (IHHN หรือ infectious hypodermal and haematopoietic necrosis)**",
              "(32) **โรคไอเอชเอ็น (IHN หรือ infectious haematopoietic necrosis)**"
            ]
          },
          {
            "callout": "ตัวย่อที่หน้าตาใกล้กันมากในช่วงนี้ IHHN กับ IHN และ IPN กับ IMN ควรอ่านชื่อเต็มประกอบทุกครั้ง",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "หมวด ฉ. โรคระบาดในสัตว์น้ำ ข้อ 33 ถึง 34 และผู้ลงนาม",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.9",
        "body": [
          {
            "bullets": [
              "(33) **โรคไอเอ็มเอ็น (IMN หรือ infectious myonecrosis)**",
              "(34) **โรคไอเอสเอ (ISA หรือ infection with infectious salmon anaemia virus)**"
            ]
          },
          {
            "text": "หน้า 15 ของประกาศ ปิดท้ายด้วย ประกาศ ณ วันที่ **24 ธันวาคม พ.ศ. 2558** ลงนามโดย **พลเอก ฉัตรชัย สาริกัลยะ รัฐมนตรีว่าการกระทรวงเกษตรและสหกรณ์**"
          },
          {
            "callout": "รวมโรคระบาดในสัตว์น้ำตามหมวด ฉ. ทั้งหมด **34 โรค** (ข้อ 1 ถึง 34) วันที่ลงนามคือ 24 ธันวาคม 2558 แต่วันที่ลงราชกิจจานุเบกษาคือ 29 ธันวาคม 2558",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หมวด จ. โรคระบาดในสัตว์หลายชนิด",
        "source": "AP_supplement_พรบ.โรคระบาด_2558 p.10",
        "body": [
          {
            "text": "สไลด์สุดท้ายแสดงหมวด จ. ของประกาศฉบับเดียวกัน คือโรคระบาดในสัตว์หลายชนิด 17 โรค"
          },
          {
            "bullets": [
              "(1) โรคไวรัสอีโบลา (Ebola virus disease)",
              "(2) โรคไมโคพลาสมา (mycoplasmosis)",
              "(3) โรคฝีดาษ (pox)",
              "(4) โรคคลามิเดีย (chlamydiosis)",
              "(5) โรคเมลิออยด์ หรือโรคมงคล่อเทียม (melioidosis)",
              "(6) โรคไข้หวัดใหญ่ชนิดเอ (influenza virus type A)",
              "(7) โรคบาดทะยัก (tetanus)",
              "(8) โรคทริพาโนโซมา (trypanosomiasis)",
              "(9) โรคทอกโซพลาสมา (toxoplasmosis)",
              "(10) **โรคสเตรปโทค็อกคัส (streptococcosis)**",
              "(11) โรคแคมพิโลแบกเตอร์ (campylobacteriosis)",
              "(12) โรคบลูทังก์ (bluetongue)",
              "(13) โรคพิษสุนัขบ้าเทียม (pseudorabies หรือ Aujeszky's disease)",
              "(14) โรคสมองอักเสบญี่ปุ่น (Japanese encephalitis)",
              "(15) โรคท้องเสียเรื้อรัง (paratuberculosis)",
              "(16) โรคไข้ริฟต์แวลลีย์ (Rift valley fever)",
              "(17) โรคปากอักเสบพุพอง (vesicular stomatitis)"
            ]
          },
          {
            "callout": "อาจารย์ทำสัญลักษณ์ดาวสีส้มชี้ที่ข้อ (10) **โรคสเตรปโทค็อกคัส (streptococcosis)** เพียงข้อเดียว สไลด์ไม่ได้เขียนอธิบายว่าเน้นเพราะอะไร จึงตีความแทนไม่ได้ แต่ให้จำไว้ว่าโรคนี้ถูกจัดอยู่ในหมวดสัตว์หลายชนิด ไม่ได้อยู่ในหมวด ฉ. สัตว์น้ำ",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "aqua-intro-thailand": {
    "topic": "aqua-intro-thailand",
    "title": "Aquaculture in Thailand (ภาพรวมการเพาะเลี้ยงสัตว์น้ำในไทย)",
    "lecturer": "Aranya Ponpornpisit",
    "icon": "🐟",
    "summary": "สไลด์แรกของวิชาอายุรศาสตร์สัตว์น้ำ (3107520) เปิดด้วย course syllabus + course outline + การวัดผล แล้วเข้าเนื้อหา Aquaculture in Thailand ซึ่งแบ่งเป็น 2 กลุ่มใหญ่คือ INLAND (น้ำจืด) และ COASTAL (ชายฝั่ง) โดยไล่ชนิดสัตว์น้ำที่เลี้ยงในไทยทีละชนิดพร้อมภาพฟาร์มจริง ส่วน inland ครอบคลุมปลานิล ปลาดุก ปลาสวาย ปลาช่อน ปลาแรด กุ้งก้ามกราม สัตว์สะเทินน้ำสะเทินบก/สัตว์เลื้อยคลาน และปลาสวยงาม (มีสไลด์รูปแบบโรงเรือนฟาร์มปลาสวยงามหลายแบบ) ส่วน coastal ครอบคลุมกุ้งขาว กุ้งกุลาดำ ปลากะพงขาว ปลากะรัง หอยแมลงภู่ หอยนางรม หอยแครง หอยหวาน หอยเป๋าฮื้อ ปูทะเลและปูม้า สไลด์ส่วนใหญ่ในช่วงหลังเป็นภาพประกอบพร้อมหัวข้อสั้น ๆ ไม่มีคำบรรยายเพิ่ม จุดที่มีเนื้อหาเป็นตัวหนังสือชัดเจนคือ FARM MANAGEMENT PRACTICE, รายชื่อชนิดสัตว์น้ำทั้ง 2 กลุ่ม, ไทม์ไลน์ SHRIMP FARMING IN THAILAND HISTORY และวงจรชีวิตกุ้งทะเล",
    "sections": [
      {
        "heading": "ข้อมูลรายวิชา (Course syllabus)",
        "source": "AP1_Aquaculture_in_Thailand p.1",
        "body": [
          {
            "bullets": [
              "Course no. **3107520**",
              "Course credits **3.0 (3.0-0.0-6.0)**",
              "ชื่อวิชา ไทย **อายุรศาสตร์สัตว์น้ำ** / English **Aquatic Animal Medicine**",
              "Responsible unit: Faculty of veterinary science, Department of Veterinary Medicine (Field of study ระบุเป็นขีด)",
              "Type of course: Semester Course (Regular course), Semester: 1st semester",
              "Course co-ordinator: **Aranya Ponpornpisit**"
            ]
          },
          {
            "sub": "Instructors / staffs (Section 1)",
            "body": [
              {
                "bullets": [
                  "Aranya Ponpornpisit",
                  "Thanida Haetrakul",
                  "Patharapol Piamsomboon",
                  "Worrayanee Thammatorn"
                ]
              }
            ]
          },
          {
            "callout": "ช่อง Academic year บนสไลด์พิมพ์ตัวเลขซ้อนกัน อ่านได้เป็น 2026 แต่หลักสุดท้ายไม่ชัดเจน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Course outline (หัวข้อทั้งรายวิชา)",
        "source": "AP1_Aquaculture_in_Thailand p.2",
        "body": [
          {
            "text": "สไลด์แสดงตาราง 16 ช่อง ไล่ตามลำดับหัวข้อของทั้งรายวิชา โดย **MIDTERM EXAMINATION อยู่ในช่องที่ 8** คือหลังจบหัวข้อ AQUATIC REPTILE MEDICINE"
          },
          {
            "sub": "ก่อน midterm",
            "body": [
              {
                "bullets": [
                  "AQUACULTURE IN THAILAND / AQUACULTURE INDUSTRY & TECHNOLOGY",
                  "FISH BIOLOGY & AQUATIC MANAGEMENT PRACTICE",
                  "WATER AND SOIL QUALITY MANAGEMENT IN AQUACULTURE",
                  "SHRIMP BIOLOGY & CULTURE FISH & SHRIMP IMMUNOLOGY",
                  "ORNAMENTAL FISH MEDICINE",
                  "AQUATIC AMPHIBIAN MEDICINE",
                  "AQUATIC REPTILE MEDICINE"
                ]
              }
            ]
          },
          {
            "sub": "หลัง midterm",
            "body": [
              {
                "bullets": [
                  "DISEASES IN FISH AND SHRIMP CULTURE (กินพื้นที่ 2 ช่องรวมกัน)",
                  "BIOSECURITY & DISEASE CONTROL IN AQUACULTURE",
                  "AQUARIUM MANAGEMENT & MEDICINE",
                  "CONSERVATION AQUATIC ANIMAL MANAGEMENT & MEDICINE",
                  "AQUATIC TOXICOLOGY AND AQUATIC ANIMAL IMPACT",
                  "REGULATION & INVOLVING ORGANIZATIONS",
                  "AQUATIC ANIMAL DISEASE IN ANIMAL EPIDEMICS ACT 2558"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การวัดผลและงานที่มอบหมาย",
        "source": "AP1_Aquaculture_in_Thailand p.3",
        "body": [
          {
            "bullets": [
              "Midterm examination **49%**",
              "Final examination **46%**",
              "Class activity **5%**"
            ]
          },
          {
            "sub": "รายละเอียด class activity",
            "body": [
              {
                "bullets": [
                  "ให้นิสิต**ทุกคน** เลือกทำคนละ **1 โรค** โดยเป็น**โรคระบาดในสัตว์น้ำที่ระบุในพระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558**",
                  "หัวหน้าชั้นปีรวบรวม pdf ส่ง อ.อรัญญา ไม่เกิน **30 ตค. 2569**",
                  "วันที่ **17 พย. 2569** จะสุ่มเลือกนิสิตมานำเสนอหน้าชั้นเรียน ให้เวลาคนละ **10 นาที**"
                ]
              }
            ]
          },
          {
            "callout": "หัวข้อ AQUATIC ANIMAL DISEASE IN ANIMAL EPIDEMICS ACT 2558 ใน course outline เป็นหัวข้อเดียวกับที่ใช้เป็นงาน class activity",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หัวเรื่องบรรยาย Aquaculture in Thailand",
        "source": "AP1_Aquaculture_in_Thailand p.4",
        "body": [
          {
            "text": "สไลด์ชื่อเรื่อง **AQUACULTURE IN THAILAND** โดย ARANYA PONPORNPISIT, FACULTY OF VETERINARY SCIENCE, CHULALONGKORN UNIVERSITY"
          }
        ]
      },
      {
        "heading": "ชนิดสัตว์น้ำที่เลี้ยงในแหล่งน้ำจืด (Inland aquaculture species)",
        "source": "AP1_Aquaculture_in_Thailand p.5",
        "body": [
          {
            "text": "สไลด์ไล่รายชื่อ **11 กลุ่ม** ตามลำดับดังนี้"
          },
          {
            "bullets": [
              "TILAPIA",
              "WALKING CATFISH",
              "STRIPED CATFISH OR PANGASIUS CATFISH",
              "CARP",
              "GOURAMI",
              "GIANT GOURAMI",
              "SNAKEHEAD FISH",
              "FRESHWATER PRAWN",
              "ORNAMENTAL FISH",
              "AMPHIBIAN AND REPTILE"
            ]
          },
          {
            "callout": "สไลด์แยก GOURAMI กับ GIANT GOURAMI ออกจากกันเป็นคนละบรรทัด และสไลด์ถัดไปในเด็คมีภาพเฉพาะ GIANT GOURAMI ไม่มีสไลด์ภาพของ CARP และ GOURAMI ทั่วไป",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การจัดการฟาร์ม (Farm management practice)",
        "source": "AP1_Aquaculture_in_Thailand p.6",
        "body": [
          {
            "text": "หัวข้อการจัดการฟาร์มที่สไลด์ระบุไว้ เป็นกรอบสำหรับมองงานสัตวแพทย์ในฟาร์มสัตว์น้ำ"
          },
          {
            "bullets": [
              "WATER QUALITY MANAGEMENT",
              "FEED PREPARATION AND FEEDING SYSTEM",
              "BROODSTOCK AND BREEDING MANAGEMENT",
              "STOCKING DENSITY, GRADING FISH, SEX SCREENING",
              "DISEASE PREVENTION AND CONTROL MANAGEMENT",
              "ENVIRONMENTAL IMPACT MITIGATION",
              "PREPARATION FOR HARVESTING",
              "PACKING AND TRANSPORTING",
              "DOCUMENT MANAGEMENT: **FARM REGISTRATION, GAP DOCUMENT, RECORD KEEPING and DATA ANALYSIS**",
              "COMPLIANCE AND REGULATIONS"
            ]
          }
        ]
      },
      {
        "heading": "ปลานิล (Tilapia)",
        "source": "AP1_Aquaculture_in_Thailand p.8-10",
        "body": [
          {
            "text": "สไลด์กลุ่มนี้เป็นภาพฟาร์มจริง แสดงระบบการผลิตลูกปลานิลตั้งแต่โรงเพาะฟักจนถึงการอนุบาล โดยมีเพียงหัวข้อกำกับภาพ ไม่มีคำบรรยายเพิ่ม"
          },
          {
            "bullets": [
              "**TILAPIA HATCHERY** ภาพโรงเพาะฟัก มีรางเพาะฟักเรียงเป็นแถวในโรงเรือน และภาพถังที่มีไข่/ลูกปลาจำนวนมาก (p.8)",
              "**TILAPIA BROODSTOCK NET PEN** ภาพกระชังตาข่ายสีฟ้าขึงในบ่อดินกลางแจ้ง มีเครื่องตีน้ำ ใช้เลี้ยงพ่อแม่พันธุ์ (p.9)",
              "**TILAPIA JUVENILE CULTURE IN NET PENS IN AN EARTHEN POND** ภาพกระชังอนุบาลลูกปลาจำนวนมากเรียงกันในบ่อดิน คลุมด้วยตาข่ายพรางแสงและตาข่ายกันนก (p.10)"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุชื่อวิทยาศาสตร์ ความหนาแน่นการปล่อย หรือระยะเวลาเลี้ยงของปลานิล",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ปลาดุก (Walking catfish, Clarias spp.)",
        "source": "AP1_Aquaculture_in_Thailand p.11-12",
        "body": [
          {
            "bullets": [
              "สไลด์ระบุชื่อ **WALKING CATFISH *CLARIAS SPP.*** พร้อมภาพปลาดุกกินอาหารเม็ดที่ผิวน้ำ (p.11)",
              "**WALKING CATFISH IN CEMENT POND AND TRANSPORTATION** ภาพการช้อนปลาขึ้นใส่ถังบนรถบรรทุกเพื่อขนส่ง และภาพปลาดุกหนาแน่นในบ่อซีเมนต์ (p.12)"
            ]
          },
          {
            "text": "จุดที่สไลด์สื่อคือปลาดุกเลี้ยงในบ่อซีเมนต์ได้ และมีขั้นตอนการขนส่งปลามีชีวิตเป็นส่วนหนึ่งของระบบ สไลด์ไม่ได้ให้รายละเอียดวิธีขนส่งหรือความหนาแน่นที่ใช้"
          }
        ]
      },
      {
        "heading": "ปลาสวาย (Striped catfish, Pangasius sutchi)",
        "source": "AP1_Aquaculture_in_Thailand p.13",
        "body": [
          {
            "text": "สไลด์ระบุชื่อ **STRIPED CATFISH *PANGASIUS SUTCHI*** พร้อมภาพปลาที่วางขายในตลาด สังเกตเห็นรอยแดงบริเวณปากและครีบของปลาในภาพ สไลด์ไม่ได้อธิบายว่ารอยแดงนั้นคืออะไร"
          },
          {
            "callout": "ในรายชื่อ inland species (p.5) เรียกกลุ่มนี้ว่า STRIPED CATFISH OR PANGASIUS CATFISH",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ปลาช่อน (Snakehead fish, Channa striatus)",
        "source": "AP1_Aquaculture_in_Thailand p.14-16",
        "body": [
          {
            "bullets": [
              "**SNAKEHEAD FISH *CHANNA STRIATUS*** ภาพลูกปลาช่อนจำนวนมหาศาลในบ่ออนุบาล และภาพปลาโตในสวิง (p.14)",
              "**SNAKEHEAD FISH IN CEMENT POND AND EARTHEN POND** เลี้ยงได้ทั้งบ่อซีเมนต์และบ่อดิน (p.15)",
              "**SNAKEHEAD FISH FEED PREPARATION** ภาพคนงานผสมอาหารเอง โดยมีปลาเป็ด/ปลาสดบดเป็นก้อน กองรำหรือวัตถุดิบผง และปลาสดทั้งตัว ผสมกันในลังพลาสติก (p.16)"
            ]
          },
          {
            "callout": "สไลด์ให้เห็นชัดว่าปลาช่อนเป็นชนิดที่ฟาร์มยังเตรียมอาหารเองจากปลาสด ไม่ได้ใช้อาหารเม็ดสำเร็จรูปอย่างเดียว แต่สไลด์ไม่ได้ระบุสูตรหรือสัดส่วนวัตถุดิบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ปลาแรด (Giant gourami)",
        "source": "AP1_Aquaculture_in_Thailand p.17-18",
        "body": [
          {
            "bullets": [
              "**GIANT GOURAMI** ภาพปลาโตเต็มวัยในน้ำใส ลำตัวสูงเป็นทรงกลมรี หัวมีลายด่าง (p.17)",
              "**GIANT GOURAMI JUVENILE AND CULTURE POND** ภาพลูกปลาที่มีลายขวางลำตัว และภาพบ่อดินที่น้ำเป็นสีเขียว มีเครื่องตีน้ำ (p.18) โดยสไลด์อ้างอิงแหล่งภาพ https://www.technologychaoban.com/fishery-technology/article_55045"
            ]
          },
          {
            "text": "สไลด์ไม่ได้ระบุชื่อวิทยาศาสตร์ของปลาแรด และไม่ได้อธิบายวิธีเลี้ยงเพิ่มเติมนอกเหนือจากภาพ"
          }
        ]
      },
      {
        "heading": "กุ้งก้ามกราม (Freshwater prawn, M. rosenbergii)",
        "source": "AP1_Aquaculture_in_Thailand p.19-20",
        "body": [
          {
            "bullets": [
              "**FRESH WATER PRAWN *M. ROSENBERGII*** ภาพกุ้งก้ามกรามที่ก้ามมีสีน้ำเงินเข้ม และภาพการคัดกุ้งใส่ตะกร้าในถังขนส่ง (p.19)",
              "**JUVENILE FRESHWATER PRAWN AND CULTURE POND** ภาพลูกกุ้งวัยอ่อนในถุง/ภาชนะใส และภาพบ่อดินขนาดใหญ่กลางแจ้งที่มีเครื่องตีน้ำเรียงตลอดแนว (p.20)"
            ]
          },
          {
            "callout": "สไลด์เขียนชื่อวิทยาศาสตร์แบบย่อว่า M. rosenbergii ไม่ได้สะกดชื่อสกุลเต็มไว้บนสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สัตว์สะเทินน้ำสะเทินบกและสัตว์เลื้อยคลาน (Amphibian and reptile)",
        "source": "AP1_Aquaculture_in_Thailand p.21",
        "body": [
          {
            "text": "สไลด์ **AMPHIBIAN AND REPTILE** แสดงภาพ 3 กลุ่มที่จัดอยู่ในการเพาะเลี้ยงสัตว์น้ำในไทย"
          },
          {
            "bullets": [
              "ตะพาบ (ภาพตะพาบกระดองมีจุดสีน้ำตาล)",
              "กบ (ภาพกบสีเหลืองเขียว)",
              "จระเข้ (ภาพจระเข้จำนวนมากอยู่รวมกันบนพื้นซีเมนต์)"
            ]
          },
          {
            "text": "สไลด์ไม่ได้ระบุชนิด (species) หรือรายละเอียดการเลี้ยงของทั้ง 3 กลุ่มนี้ หัวข้อ AQUATIC AMPHIBIAN MEDICINE และ AQUATIC REPTILE MEDICINE เป็นคาบแยกใน course outline"
          }
        ]
      },
      {
        "heading": "ปลาสวยงาม (Ornamental fish)",
        "source": "AP1_Aquaculture_in_Thailand p.22",
        "body": [
          {
            "text": "สไลด์ **ORNAMENTAL FISH** รวมภาพปลาสวยงามหลายชนิดที่เลี้ยงในไทย ได้แก่ปลาหมอสีหัวโหนกสีแดงและสีขาว ปลาปอมปาดัวร์ (discus) ทั้งสีฟ้าและลายตาข่าย ปลาทองหัวสิงห์ ปลาหางนกยูงสีชมพู ปลาอะโรวาน่า และปลาทองในตู้ที่มีระบบกรอง"
          },
          {
            "callout": "ORNAMENTAL FISH MEDICINE เป็นหัวข้อบรรยายแยกอีกคาบหนึ่งใน course outline",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "รูปแบบโรงเรือนและบ่อของฟาร์มปลาสวยงาม (Variety of ornamental fish farm)",
        "source": "AP1_Aquaculture_in_Thailand p.23-30",
        "body": [
          {
            "text": "สไลด์ชุดยาว 8 หน้าเปรียบเทียบ **โครงสร้างโรงเรือนและบ่อ** ของฟาร์มปลาสวยงามหลายแบบ นี่คือช่วงที่สไลด์ให้ตัวเลขจริงมากที่สุดในหมวดปลาสวยงาม"
          },
          {
            "sub": "แบบของโรงเรือน",
            "body": [
              {
                "bullets": [
                  "**OPEN-AIR GREENHOUSES COVERED WITH NET** โรงเรือนโปร่ง คลุมด้วยตาข่าย (p.24, p.25)",
                  "**TRANSLUCENT TILE ROOF** หลังคากระเบื้องโปร่งแสง (p.25)",
                  "**NO SIDE WALLS, SOLID ROOFS** ไม่มีผนังข้าง หลังคาทึบ (p.25)",
                  "**SIDE WALLS, TRANSLUCENT TILED ROOFS** มีผนังข้าง หลังคากระเบื้องโปร่งแสง (p.25)",
                  "โรงเรือนปิดล้อมทุกด้าน (enclosed by greenhouses on all sides) (p.27)"
                ]
              }
            ]
          },
          {
            "sub": "ขนาดและลักษณะบ่อ (ตัวเลขตามที่สไลด์พิมพ์ไว้)",
            "body": [
              {
                "bullets": [
                  "**OPEN GREENHOUSES, POND DEPTH 60 CM** บ่อยาวเลี้ยงปลาคาร์ป ลึก **60 ซม.** (p.26)",
                  "THE POND IS APPROXIMATELY **60 CENTIMETERS DEEP**, ENCLOSED BY GREENHOUSES ON ALL SIDES (p.27)",
                  "OPEN GREENHOUSES WITH ROOFS, THE POND IS ABOUT **1.2 METERS HIGH** (p.27)",
                  "**THE CONCRETE POND IS PAINTED INSIDE, WITH A DRAINAGE IN THE MIDDLE** บ่อซีเมนต์ทาสีน้ำเงินด้านใน มีท่อระบายอยู่กลางบ่อ (p.29)",
                  "**Round cement pond or ready-made cement backing** บ่อวงซีเมนต์กลม มีแผ่นสังกะสีวางปิดด้านบน (p.30)"
                ]
              }
            ]
          },
          {
            "sub": "ฟาร์มปลาปอมปาดัวร์",
            "body": [
              {
                "text": "**POMPADUR FISH FARM** (p.28) เป็นภาพห้องในอาคาร ตู้กระจกโครงสเตนเลสวางเรียงเป็นชั้นสองชั้นตลอดแนวผนัง มีระบบท่อน้ำเดินถึงทุกตู้ ต่างจากฟาร์มปลาสวยงามแบบบ่อกลางแจ้งอย่างชัดเจน"
              }
            ]
          },
          {
            "callout": "ตัวเลข 60 ซม. กับ 1.2 เมตร บนสไลด์ p.27 พิมพ์คนละคำ (deep กับ high) และอยู่คนละภาพ อย่ารวมเป็นตัวเลขเดียวกัน",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ชนิดสัตว์น้ำชายฝั่ง (Coastal aquaculture species)",
        "source": "AP1_Aquaculture_in_Thailand p.31",
        "body": [
          {
            "text": "สไลด์ไล่รายชื่อ **11 ชนิด** ตามลำดับดังนี้"
          },
          {
            "bullets": [
              "WHITELEG SHRIMP",
              "BLACK TIGER SHRIMP",
              "SEABASS",
              "GROUPER",
              "GREEN MUSSEL",
              "OYSTER",
              "COCKLE",
              "BABYLON SNAIL",
              "ABALONE",
              "MUDDY CRAB",
              "SWIMMING CRAB"
            ]
          }
        ]
      },
      {
        "heading": "ประวัติการเลี้ยงกุ้งทะเลในไทย (Shrimp farming in Thailand history)",
        "source": "AP1_Aquaculture_in_Thailand p.32",
        "body": [
          {
            "text": "ไทม์ไลน์นี้เป็นสไลด์ที่มีเนื้อหาเป็นตัวหนังสือหนาแน่นที่สุดของเด็ค ตัวเลขปีคัดตามที่พิมพ์บนสไลด์ทุกตัว"
          },
          {
            "bullets": [
              "MARINE SHRIMP CULTURE HAS BEEN BOOMING SINCE **1984**",
              "**1986** THAILAND WAS THE WORLD'S LARGEST BLACK TIGER SHRIMP PRODUCER",
              "**1989** THAILAND FACED A SEVERE OUTBREAK OF **YELLOW HEAD VIRUS (YHV)**",
              "**2000** A SEVERE OUTBREAK OF **WHITE SPOT SYNDROME VIRUS (WSSV)** CAUSED THE SHRIMP CULTURE TO COLLAPSE",
              "**2002** A SHIFT IN THE DOMINANT SHRIMP SPECIES FARMED IN THAILAND, THE **WHITELEG SHRIMP**",
              "**2012** THAILAND'S SHRIMP INDUSTRY FACED SEVERE CONSEQUENCES FROM **EMS** OUTBREAKS",
              "**2023** สไลด์เขียนไว้แค่ปี แล้วตามด้วยจุดไข่ปลา ไม่ได้ระบุเหตุการณ์"
            ]
          },
          {
            "callout": "สไลด์เขียนตัวย่อ EMS ไว้เฉย ๆ ไม่ได้กางชื่อเต็มหรืออธิบายว่าเป็นโรคอะไร",
            "kind": "flag"
          },
          {
            "callout": "จับ pattern ของไทม์ไลน์ไว้: โรคระบาดใหญ่แต่ละรอบ (YHV 1989, WSSV 2000, EMS 2012) ตามด้วยการปรับตัวของอุตสาหกรรม เช่นการเปลี่ยนชนิดกุ้งหลักเป็นกุ้งขาวในปี 2002 หลัง WSSV",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การเลี้ยงชายฝั่งยุคใหม่ (New-era coastal aquaculture in Thailand)",
        "source": "AP1_Aquaculture_in_Thailand p.33",
        "body": [
          {
            "text": "สไลด์ **NEW-ERA COASTAL AQUACULTURE IN THAILAND** เป็นภาพถ่ายดาวเทียม 2 ภาพซ้อนกัน เห็นพื้นที่ชายฝั่งที่ถูกแบ่งเป็นบ่อเลี้ยงเป็นตารางหนาแน่นเต็มพื้นที่ ทั้งบ่อสี่เหลี่ยมขนาดใหญ่และบ่อกลมขนาดเล็กเรียงกันเป็นแถว สไลด์ไม่ได้เขียนคำอธิบายกำกับ จึงบอกได้เพียงว่าภาพสื่อถึงขนาดและความหนาแน่นของพื้นที่เลี้ยงชายฝั่ง"
          }
        ]
      },
      {
        "heading": "กุ้งทะเลชนิดหลักที่เลี้ยง (Major shrimp culture species)",
        "source": "AP1_Aquaculture_in_Thailand p.34",
        "body": [
          {
            "bullets": [
              "**PACIFIC WHITE SHRIMP *Litopenaeus vannamei*** ภาพกุ้งลำตัวใส ไม่มีลายขวาง",
              "**BLACK TIGER SHRIMP *Penaeus monodon*** ภาพกุ้งลำตัวมีลายขวางเข้มสลับ ขาและหางมีสีแดง"
            ]
          },
          {
            "callout": "ชื่อวิทยาศาสตร์ 2 ตัวนี้ต้องจำคู่กับไทม์ไลน์ p.32 กุ้งกุลาดำคือชนิดที่ไทยเป็นผู้ผลิตอันดับ 1 ของโลกในปี 1986 ส่วนกุ้งขาวคือชนิดที่ขึ้นมาเป็นชนิดหลักในปี 2002",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "วงจรชีวิตกุ้งทะเล (Life cycle)",
        "source": "AP1_Aquaculture_in_Thailand p.35",
        "body": [
          {
            "text": "แผนภาพแสดงวงจรชีวิตกุ้งทะเลจากป่าชายเลน (mangrove) ออกไปสู่ทะเลเปิด (open sea) โดยระยะที่สไลด์ระบุชื่อไว้ เรียงตามที่พิมพ์บนภาพคือ"
          },
          {
            "bullets": [
              "**Nauplius**",
              "**Zoea (protozoea)**",
              "**Mysis**",
              "**Postlarvae**",
              "**Broodstock**"
            ]
          },
          {
            "text": "ในแผนภาพ ระยะ Nauplius, Zoea (protozoea) และ Mysis เขียนกำกับไว้ฝั่งป่าชายเลน ส่วน Postlarvae อยู่ระหว่างชายฝั่งกับทะเล และ Broodstock อยู่ฝั่งทะเลลึกพร้อมกลุ่มไข่"
          },
          {
            "callout": "สไลด์ไม่ได้ให้ระยะเวลาของแต่ละ stage และไม่ได้บอกจำนวน substage สไลด์ให้มาแค่ชื่อระยะกับตำแหน่งในธรรมชาติ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ขนาดพ่อแม่พันธุ์และลูกกุ้ง (Broodstock and larvae size)",
        "source": "AP1_Aquaculture_in_Thailand p.36",
        "body": [
          {
            "text": "สไลด์ **BROODSTOCK AND LARVAE SIZE** เปรียบเทียบขนาดด้วยภาพ ภาพซ้ายเป็นกุ้งพ่อแม่พันธุ์ที่ถือเต็มฝ่ามือ ภาพขวาเป็นบีกเกอร์ใส 3 ใบที่ใส่ลูกกุ้งวัยอ่อนซึ่งเล็กจนแทบมองไม่เห็นด้วยตาเปล่า วางคู่กับกล้องจุลทรรศน์ สไลด์ไม่ได้ระบุขนาดเป็นตัวเลข"
          }
        ]
      },
      {
        "heading": "โรงเพาะฟักกุ้ง (Hatchery)",
        "source": "AP1_Aquaculture_in_Thailand p.37-40",
        "body": [
          {
            "text": "สไลด์ 4 หน้าติดกันแสดงโรงเพาะฟักกุ้งจากภายนอกเข้าสู่ภายใน โดยหน้า p.37 เป็นภาพหน้าโรงเรือนหลังคาโค้งคลุมพลาสติกใส และภาพนิสิตดูงานที่ **Thai Union Hatchery**"
          },
          {
            "bullets": [
              "ตัวอาคารเป็นโรงเรือนหลังคาโค้ง คลุมพลาสติก ตั้งเรียงกันหลายหลัง มีรั้วล้อม (p.37, p.39)",
              "ภายในเป็นบ่อซีเมนต์ยาวขนาดใหญ่ มีระบบท่อและหัวให้อากาศเดินตลอดแนวบ่อ (p.38)",
              "น้ำในบ่อบางหลังมีสีน้ำตาลแดงเข้ม (p.38, p.40)",
              "ผู้เข้าชมในโรงเรือนสวมชุดคลุม หมวกคลุมผม และรองเท้าบูท (p.40)"
            ]
          },
          {
            "callout": "ภาพชุดคลุมกับรองเท้าบูทใน hatchery คือ biosecurity ในทางปฏิบัติ แต่สไลด์ชุดนี้ไม่ได้เขียนอธิบายไว้ หัวข้อ BIOSECURITY & DISEASE CONTROL IN AQUACULTURE เป็นคาบแยกหลัง midterm",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ระบบน้ำของโรงเพาะฟัก (Water supply)",
        "source": "AP1_Aquaculture_in_Thailand p.41",
        "body": [
          {
            "text": "สไลด์ **WATER SUPPLY** แสดงแหล่งน้ำ 3 แบบด้วยภาพ"
          },
          {
            "bullets": [
              "ท่อขนาดใหญ่หลายเส้นวางลากจากชายทะเลเข้าฝั่ง (สูบน้ำทะเลเข้าฟาร์ม)",
              "รถบรรทุกถังน้ำ (ขนน้ำเข้ามา)",
              "บ่อพักน้ำในโรงเรือน แบ่งเป็นช่อง มีท่อและวาล์วเดินถึงแต่ละช่อง"
            ]
          },
          {
            "text": "สไลด์ไม่ได้อธิบายขั้นตอนการบำบัดหรือฆ่าเชื้อน้ำ ให้แค่ภาพของแหล่งน้ำและบ่อพัก"
          }
        ]
      },
      {
        "heading": "การจัดการพ่อแม่พันธุ์ การผสมและฟัก (Broodstock management, spawning, hatching, disinfection)",
        "source": "AP1_Aquaculture_in_Thailand p.42-43",
        "body": [
          {
            "bullets": [
              "**BROODSTOCK MANAGEMENT** (p.42) เป็นภาพกุ้งพ่อแม่พันธุ์ในสวิงและในน้ำ เห็นตัวกุ้งชัด แต่สไลด์ไม่มีข้อความอธิบายวิธีจัดการ",
              "**SPAWNING / HATCHING / DISINFECTION** (p.43) ภาพซ้ายเป็นลูกกุ้งวัยอ่อนถ่ายผ่านกล้อง ภาพขวาเป็นถังกลมสีดำ 3 ใบวางเรียงกัน มีสายอากาศห้อยลงในถังแต่ละใบ"
            ]
          },
          {
            "callout": "สไลด์เขียนคำว่า disinfection ไว้ในหัวข้อ แต่ไม่ได้ระบุว่าใช้สารอะไร ความเข้มข้นเท่าไร หรือแช่นานแค่ไหน",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "บ่ออนุบาลลูกกุ้งและบ่อเลี้ยงพ่อแม่พันธุ์ (Larval rearing pond and broodstock rearing pond)",
        "source": "AP1_Aquaculture_in_Thailand p.44-45",
        "body": [
          {
            "bullets": [
              "**LARVAL REARING POND** (p.44) มีทั้งบ่อซีเมนต์ทรงกลมขนาดใหญ่และบ่อสี่เหลี่ยม น้ำในบ่อมีสีเขียว บ่อสี่เหลี่ยมมีผ้าใบสีดำคลุมปิดด้านบนได้",
              "**BROODSTOCK REARING POND** (p.45) เป็นบ่อในอาคาร น้ำสีเขียวอ่อน มีสายอากาศห้อยลงมาจากด้านบนจำนวนมากทั่วบ่อ และมีไม้วัดระดับน้ำปักอยู่ในบ่อ ภาพขยายเห็นกุ้งว่ายอยู่ในบ่อ"
            ]
          },
          {
            "text": "สไลด์ไม่ได้ระบุความหนาแน่น ระดับความลึกน้ำ หรือความเค็มที่ใช้ในบ่อทั้งสองแบบ"
          }
        ]
      },
      {
        "heading": "บ่อเลี้ยงกุ้งจนถึงจับ (Grow out pond, PE growout pond, harvesting)",
        "source": "AP1_Aquaculture_in_Thailand p.46-48",
        "body": [
          {
            "bullets": [
              "**GROW OUT POND** (p.46) บ่อดินกลางแจ้งขนาดใหญ่ มีเครื่องตีน้ำเรียงหลายชุด และภาพเกษตรกรกำลังยกยอ/ยกสวิงเช็คกุ้งจากสะพานไม้",
              "**PE GROWOUT POND** (p.47) บ่อที่ปูพื้นและคันบ่อด้วยแผ่นพลาสติกสีดำ (PE liner) ภาพหนึ่งเป็นบ่อที่มีน้ำและเครื่องตีน้ำทำงาน อีกภาพเป็นบ่อที่พร่องน้ำเห็นแผ่นปูเต็มทั้งบ่อ",
              "**WHITE SHRIMP HARVESTING AND SORTING** (p.48) ภาพคนงานหลายคนคัดขนาดกุ้งขาวบนโต๊ะยาว สวมถุงมือยาง มีตะกร้าพลาสติกรองรับ"
            ]
          },
          {
            "callout": "สไลด์เปรียบเทียบบ่อดินธรรมดากับบ่อปู PE ไว้ด้วยภาพเท่านั้น ไม่ได้เขียนข้อดีข้อเสียของแต่ละแบบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ปลากะพงขาว (Seabass, barramundi, Lates calcarifer)",
        "source": "AP1_Aquaculture_in_Thailand p.49, p.51",
        "body": [
          {
            "text": "สไลด์เขียนชื่อไว้ 3 อย่างคู่กันคือ **SEABASS, BARRAMUNDI *Lates calcarifer***"
          },
          {
            "bullets": [
              "ภาพปลากะพงขาวเต็มตัว ลำตัวสีเงิน (p.49)",
              "ภาพกระชังตาข่ายในน้ำ เห็นปลากระโดดตีน้ำในกระชัง และภาพกระชังที่ยกขึ้นตากอยู่ริมบ้านริมน้ำ แสดงว่าเลี้ยงในกระชังตามแม่น้ำหรือชายฝั่ง (p.49)",
              "**SEABASS FRY** (p.51) ภาพลูกปลากะพงขาวจำนวนมากในบ่อ มีท่อน้ำปล่อยลงบ่อ"
            ]
          }
        ]
      },
      {
        "heading": "ปลากะพงเอเชียกับปลากะพงยุโรป (ASEAN seabass vs European seabass)",
        "source": "AP1_Aquaculture_in_Thailand p.50",
        "body": [
          {
            "text": "สไลด์ **ASEAN SEABASS VS EUROPEAN SEABASS** แสดงแผนที่โลกที่ระบายสีส้มเน้นประเทศ/พื้นที่ที่มีการเลี้ยง โดยชื่อที่ปรากฏบนแผนที่คือ **Saudi Arabia, Hong Kong, Taiwan PC, Thailand, Malaysia, Brunei, Singapore, Indonesia, Australia** และมีภาพปลาอีกชนิดหนึ่งอยู่มุมล่างซ้ายในกรอบสีดำ"
          },
          {
            "callout": "สไลด์ตั้งหัวข้อเปรียบเทียบ 2 ชนิดไว้ แต่ไม่ได้เขียนชื่อวิทยาศาสตร์ของ European seabass และไม่ได้อธิบายว่าต่างกันอย่างไร ให้มาแค่แผนที่การกระจาย",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ปลากะรัง (Grouper) และโรงเพาะฟักปลาทะเล",
        "source": "AP1_Aquaculture_in_Thailand p.52-53",
        "body": [
          {
            "bullets": [
              "**GROUPER** (p.52) ภาพปลากะรังหลายแบบ ทั้งตัวที่มีจุดดำทั่วลำตัว ตัวลายพาดสีเข้ม และตัวสีชมพูจุดน้ำตาล พร้อมภาพลูกปลาในบ่อ ภาพปลาในธรรมชาติ และภาพแพกระชังกลางทะเลที่ใช้ถังพลาสติกสีน้ำเงินเป็นทุ่นลอย",
              "**MARINE FISH HATCHERY** (p.53) โรงเพาะฟักปลาทะเล เป็นบ่อซีเมนต์ยาวกลางแจ้งที่คลุมด้วยตาข่ายพรางแสงเป็นชั้น ๆ ด้านบน"
            ]
          },
          {
            "text": "สไลด์ไม่ได้ระบุชื่อวิทยาศาสตร์หรือชนิดของปลากะรังที่แสดงในภาพ"
          }
        ]
      },
      {
        "heading": "หอยแมลงภู่และหอยนางรม (Green mussel and oyster)",
        "source": "AP1_Aquaculture_in_Thailand p.54",
        "body": [
          {
            "bullets": [
              "**GREEN MUSSEL** สไลด์มีป้ายชื่อในภาพว่า **หอยแมลงภู่ *Perna viridis*** ภาพหนึ่งเป็นหอยเกาะติดกันเป็นพวงบนหลักไม้ อีกภาพเป็นหอยที่เก็บมาแล้ว เห็นเปลือกสีเขียวชัด",
              "**OYSTER *CRASSOSTREA GIGAS*** ภาพเปลือกหอยนางรมด้านนอกและเนื้อหอยด้านใน พร้อมภาพหอยที่ติดอยู่กับวัสดุเกาะ"
            ]
          },
          {
            "callout": "ชื่อวิทยาศาสตร์ 2 ตัวนี้พิมพ์ชัดบนสไลด์ Perna viridis (หอยแมลงภู่) และ Crassostrea gigas (หอยนางรม) ให้จำตามที่พิมพ์",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หอยแครงและหอยหวาน (Cockle and Babylon snail)",
        "source": "AP1_Aquaculture_in_Thailand p.55",
        "body": [
          {
            "bullets": [
              "**COCKLE** ภาพหอยจำนวนมากกองรวมกัน มีป้ายในภาพเขียนว่า **หอยแครง**",
              "**BABYLON SNAIL** ภาพหอย 2 ตัว เปลือกทรงกรวยยาว ลายจุดสี่เหลี่ยมสีน้ำตาลบนพื้นขาว"
            ]
          },
          {
            "text": "สไลด์ไม่ได้ให้ชื่อวิทยาศาสตร์ของหอยทั้งสองชนิดนี้"
          }
        ]
      },
      {
        "heading": "หอยเป๋าฮื้อ (Abalone)",
        "source": "AP1_Aquaculture_in_Thailand p.56, p.60",
        "body": [
          {
            "bullets": [
              "**ABALONE** (p.56) ภาพหอยเป๋าฮื้อตัวเดี่ยวเห็นเนื้อด้านใน ภาพหอยหลายตัวอยู่กับสาหร่ายสีเขียวในตะกร้า ภาพไข่/ตัวอ่อนจำนวนมาก ภาพแผ่นเลี้ยงที่มีลูกหอยเกาะเรียงกันหนาแน่นทั้งสองด้าน และภาพสาหร่ายที่ใช้เป็นอาหาร",
              "**PHUKET ABALONE FARM** (p.60) ฟาร์มหอยเป๋าฮื้อที่ภูเก็ต เป็นโรงเรือนขนาดใหญ่มีหลังคา ภายในเป็นบ่อยาวที่วางตะกร้า/ลังเลี้ยงสีดำเรียงกันเต็มบ่อ มีระบบท่อน้ำสีฟ้าเดินตลอด และมีเครนเหนือบ่อสำหรับยกลังเลี้ยง"
            ]
          },
          {
            "callout": "สไลด์แสดงว่าหอยเป๋าฮื้อเลี้ยงในระบบโรงเรือนแบบเข้มข้น ต่างจากหอยแมลงภู่และหอยนางรมที่เลี้ยงกลางทะเลด้วยหลักและเชือก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "รูปแบบฟาร์มหอยและโครงสร้างในทะเล (Shellfish farming and hanging rope)",
        "source": "AP1_Aquaculture_in_Thailand p.57-59",
        "body": [
          {
            "bullets": [
              "**SHELLFISH FARMING AND HANGING ROPE** (p.57) ภาพหลักไม้ปักเรียงเป็นแนวยาวกลางทะเล และภาพราวไม้ไผ่ที่มีหอยเกาะเป็นพวงห้อยลงมาตลอดแนวริมป่าชายเลน",
              "**SHELLFISH FARMS** (p.58) แสดงโครงสร้างหลายแบบ ทั้งหลักไม้ปักหนาแน่น ราวไม้ไผ่ที่มีหอยเกาะ และแนวเชือกลอยที่ใช้**ขวดพลาสติกเป็นทุ่น**โดยมีหอยเกาะเป็นกระจุกใต้ขวดแต่ละใบ",
              "**TEMPORARY HUTS IN THE FARMING AREA** (p.59) กระท่อมยกพื้นสูงบนเสาไม้กลางทะเลในเขตฟาร์ม มีเรือจอดเทียบ ใช้เป็นที่พักเฝ้าฟาร์ม"
            ]
          }
        ]
      },
      {
        "heading": "ปูทะเลและปูม้า (Muddy crab and swimming crab)",
        "source": "AP1_Aquaculture_in_Thailand p.61-62",
        "body": [
          {
            "text": "สไลด์ **MUDDY CRAB AND SWIMMING CRAB** (p.61) วางภาพเปรียบเทียบปู 2 กลุ่มไว้คู่กัน ทั้งด้านหลังและด้านท้อง โดยปูทะเลอยู่ฝั่งซ้าย กระดองสีเข้มทึบ ส่วนปูม้าอยู่ฝั่งขวา ก้ามและขายาวเรียว มีสีฟ้าเด่น สไลด์อ้างอิงแหล่งภาพ https://www4.fisheries.go.th/local/file_document/20170106150743_file.pdf"
          },
          {
            "text": "หน้าถัดมา (p.62) เป็นภาพปูตัวเมียหงายท้อง เห็น**ไข่นอกกระดองเป็นก้อนสีส้ม**ติดอยู่ใต้จับปิ้ง สไลด์ไม่มีหัวข้อและไม่มีคำบรรยายกำกับภาพนี้"
          }
        ]
      },
      {
        "heading": "ปูนิ่มและระบบเลี้ยงแบบคอนโด (Softshell crab and condo system)",
        "source": "AP1_Aquaculture_in_Thailand p.63-64",
        "body": [
          {
            "bullets": [
              "**SOFTSHELL CRAB** (p.63) ภาพฟาร์มปูนิ่ม เป็นแพยาวลอยน้ำใต้โรงเรือนหลังคาสังกะสี บนแพวางตะกร้า/กล่องเลี้ยงปูสีดำเรียงกันเป็นแถวยาวหลายแถว",
              "หน้าสุดท้าย (p.64) เป็นภาพระบบเลี้ยงแบบตู้ซ้อนชั้นในโรงเรือน มีกล่องเลี้ยงสีดำซ้อนกัน 5 ชั้น หลายคอลัมน์ มีระบบท่อน้ำสีฟ้าเดินถึงทุกกล่องและถังกรองด้านล่าง สไลด์เขียนกำกับว่า **คอนโดกุ้งปู : Smile Box** พร้อมลิงก์ https://www.facebook.com/Boxgung/videos/1432723170412329?locale=th_TH"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้อธิบายหลักการของการเลี้ยงปูนิ่มหรือระบบคอนโด ให้มาแค่ภาพและชื่อระบบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "หัวข้อบรรยายและผู้บรรยาย",
        "source": "Aquaculture_Industry_Tech p.1",
        "body": [
          {
            "text": "หัวข้อบรรยายคือ **Aquaculture Industry and Technology**"
          },
          {
            "bullets": [
              "ผู้บรรยาย Dr. Sirikorn Kitiyodom, DVM., MSc., PhD.",
              "สังกัด **Aquatic Animal Health Research and Development center: AAHRC**",
              "CPF Thailand: Charoen Pokphand Foods PCL"
            ]
          }
        ]
      },
      {
        "heading": "สัดส่วนอุตสาหกรรมเพาะเลี้ยงสัตว์น้ำ กุ้งครองตลาด",
        "source": "Aquaculture_Industry_Tech p.2",
        "body": [
          {
            "text": "แผนภูมิวงกลมแสดงสัดส่วนการเพาะเลี้ยง รวมทั้งหมด **541,239 ตัน (Ton)**"
          },
          {
            "bullets": [
              "การเลี้ยงกุ้ง Shrimp culture **72.5%**",
              "การเลี้ยงหอย Shellfish culture 16.6%",
              "การเลี้ยงปลา Fish culture 10.3%",
              "การเลี้ยงปูทะเล Sea crabs culture 0.6%"
            ]
          },
          {
            "text": "ตัวเลขที่สไลด์เน้นด้วยสีแดง คือ ปริมาณการเลี้ยงกุ้ง **392,600 ตัน** และ มูลค่าการเลี้ยงกุ้ง **57,435 ล้านบาท**"
          },
          {
            "sub": "ชนิดกุ้งที่แสดงในภาพ",
            "body": [
              {
                "bullets": [
                  "Tiger prawn, *Penaeus monodon*",
                  "White shrimp / King prawn, *Litopenaeus vannamei*"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุปีของข้อมูลและไม่ได้ระบุว่าเป็นสถิติของประเทศใดหรือหน่วยงานใด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การเพาะเลี้ยงสัตว์น้ำจืด ปลานิลเป็นตัวหลัก",
        "source": "Aquaculture_Industry_Tech p.3",
        "body": [
          {
            "text": "ปริมาณสัตว์น้ำจืดจากการเพาะเลี้ยง จำแนกตามชนิดสัตว์น้ำ (Production from freshwater culture by species) รวม **459,980 ตัน (Ton)**"
          },
          {
            "bullets": [
              "ปลานิล Nile tilapia **57.9%**",
              "ปลาดุก Walking catfish 19.8%",
              "กุ้งก้ามกราม Giant prawn 9.1%",
              "ปลาตะเพียน common silver barb 4.6%",
              "ปลาสวาย Striped catfish 2.9%",
              "ปลาอื่นๆ Other fish 2.7%",
              "ปลาสลิด Snake skin gourami 2.0%",
              "สัตว์น้ำอื่นๆ Others 0.5%",
              "ปลาช่อน Striped snake-head fish 0.3%",
              "ปลาไน Common carp 0.2%"
            ]
          },
          {
            "text": "ตัวเลขที่สไลด์เน้นด้วยสีแดง คือ ปริมาณการเลี้ยงปลานิล **266,500 ตัน** และ มูลค่าการเลี้ยงปลานิล **12,710 ล้านบาท**"
          },
          {
            "callout": "เทียบกับหน้า 2 จะเห็นว่า กุ้งมีปริมาณน้อยกว่าปลานิลไม่มาก (392,600 ตัน เทียบ 266,500 ตัน) แต่มูลค่าต่างกันมาก (57,435 ล้านบาท เทียบ 12,710 ล้านบาท) สไลด์ไม่ได้อธิบายเหตุผลของส่วนต่างนี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "สัตว์น้ำ VS สัตว์บก และลักษณะการเลี้ยงสัตว์น้ำ",
        "source": "Aquaculture_Industry_Tech p.4-5",
        "body": [
          {
            "text": "สองสไลด์นี้เป็นภาพประกอบล้วน ไม่มีข้อความอธิบายบนสไลด์"
          },
          {
            "sub": "หน้า 4 สัตว์น้ำ VS สัตว์บก",
            "body": [
              {
                "text": "เปรียบเทียบภาพบ่อเลี้ยงปลากับโรงเรือนไก่ และภาพบ่อกุ้งที่มีเครื่องตีน้ำกับคอกสุกร"
              }
            ]
          },
          {
            "sub": "หน้า 5 สัตว์น้ำ",
            "body": [
              {
                "text": "ภาพบ่อเลี้ยงปลาชี้ไปยังภาพการจับปลาด้วยอวน และภาพบ่อกุ้งชี้ไปยังภาพกุ้งจำนวนมากในกระชอนพร้อมเม็ดอาหาร"
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนข้อสรุปของการเปรียบเทียบสัตว์น้ำกับสัตว์บกไว้ ผู้บรรยายน่าจะพูดประกอบภาพ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การประเมินสุขภาพสัตว์น้ำในฟาร์ม",
        "source": "Aquaculture_Industry_Tech p.6",
        "body": [
          {
            "text": "สไลด์ตั้งคำถาม (เครื่องหมาย ? บนภาพเงาปลาและกุ้ง) ว่าจะรู้สุขภาพสัตว์น้ำได้อย่างไร แล้วให้สองตัวชี้วัด"
          },
          {
            "bullets": [
              "**อาหาร**: พฤติกรรมการกิน, ปริมาณ",
              "**น้ำหนักสัตว์น้ำ**: สุ่มชั่งน้ำหนัก"
            ]
          },
          {
            "callout": "จุดสำคัญของงานสัตว์น้ำ คือ มองตัวสัตว์โดยตรงไม่ได้เหมือนสัตว์บก จึงต้องอาศัยพฤติกรรมการกินและการสุ่มชั่งเป็นตัวแทน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "อัตราการเจริญเติบโต (ADG: Average daily Gain)",
        "source": "Aquaculture_Industry_Tech p.7",
        "body": [
          {
            "text": "**ADG = (น้ำหนักสัตว์น้ำสุดท้าย - น้ำหนักสัตว์น้ำเริ่มต้น) / จำนวนวัน**"
          },
          {
            "sub": "กราฟการเจริญเติบโต (Length/Weight เทียบกับ Time)",
            "body": [
              {
                "bullets": [
                  "**Lag phase** ช่วงต้นของกราฟ",
                  "**Exponential phase** ช่วงกลางที่โตเร็ว",
                  "**Stationary phase** ช่วงปลายที่กราฟแบนราบ"
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยที่กำหนดการเจริญเติบโต (กล่องด้านขวาของสไลด์)",
            "body": [
              {
                "bullets": [
                  "การพัฒนาสายพันธุ์",
                  "การพัฒนาอาหาร",
                  "การดูแลสุขภาพสัตว์น้ำ",
                  "การจัดการและสภาพแวดล้อม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "อัตราแลกเนื้อ (FCR: Feed conversion ratio)",
        "source": "Aquaculture_Industry_Tech p.8",
        "body": [
          {
            "text": "FCR คือ **อัตราการเปลี่ยนอาหารเป็นเนื้อ**"
          },
          {
            "text": "**FCR = น้ำหนักอาหารที่กิน / น้ำหนักสัตว์น้ำที่เพิ่มขึ้น**"
          },
          {
            "sub": "กราฟเปรียบเทียบ FCR ระหว่างสัตว์น้ำกับสัตว์บก",
            "body": [
              {
                "text": "แกน x คือ Feed conversion ratio (kg of feed/kg weight gain) สเกล 0 ถึง 11 รายการที่แสดงเรียงจากบนลงล่าง ได้แก่ Giant tiger prawn, Common carp, Pangas catfish, Tilapia, Grass carp, Channel catfish, Whiteleg shrimp, Rainbow trout, Atlantic salmon, Aquaculture weighted avg., Beef cattle, Pigs, Chicken"
              },
              {
                "text": "ภาพรวมที่กราฟสื่อคือ กลุ่มสัตว์น้ำและ Aquaculture weighted avg. อยู่ทางซ้ายของสเกล ส่วน **Beef cattle อยู่ขวาสุด (FCR สูงสุด)** รองลงมาคือ Pigs ขณะที่ Chicken อยู่ใกล้กลุ่มสัตว์น้ำ"
              }
            ]
          },
          {
            "callout": "กราฟไม่ได้พิมพ์ตัวเลข FCR กำกับแต่ละชนิดไว้ จึงไม่ควรจำเป็นค่าตัวเลขเจาะจง ให้จำลำดับเปรียบเทียบแทน",
            "kind": "warn"
          },
          {
            "text": "อ้างอิงบนสไลด์: Fry, *et al*., 2018. Feed conversion efficiency in aquaculture: do we measure it correctly?. *Environmental Research Letters*."
          }
        ]
      },
      {
        "heading": "อาหารสัตว์น้ำและส่วนประกอบเสริม",
        "source": "Aquaculture_Industry_Tech p.9",
        "body": [
          {
            "sub": "อาหารสัตว์น้ำ (Nutrient requirements)",
            "body": [
              {
                "bullets": [
                  "โปรตีน / กรดอะมิโน, คาร์โบไฮเดรต, ไขมัน / กรดไขมัน, วิตามิน, แร่ธาตุ",
                  "เป้าหมายสองด้าน คือ **การเจริญเติบโต (growth)** และ **สุขภาพสัตว์ที่ดีแข็งแรง (health & immunity)**"
                ]
              }
            ]
          },
          {
            "sub": "ส่วนประกอบอื่นๆ",
            "body": [
              {
                "bullets": [
                  "พรีไบโอติก (prebiotic) และ โปรไบโอติก (probiotics)",
                  "สารเสริมภูมิคุ้มกัน (immunostimulant)",
                  "สมุนไพร (herbal extracts)",
                  "อื่นๆ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โภชนพันธุศาสตร์ (Nutrigenomics) และจุลินทรีย์ในทางเดินอาหาร (Gut microbiome)",
        "source": "Aquaculture_Industry_Tech p.10",
        "body": [
          {
            "text": "สไลด์วางสองหัวข้อคู่กันเป็นสองคอลัมน์ ได้แก่ **โภชนพันธุศาสตร์ (Nutrigenomics)** และ **จุลินทรีย์ในทางเดินอาหาร (Gut microbiome)**"
          },
          {
            "text": "ภาพฝั่ง Gut microbiome แบ่งเป็น Healthy microbiome ที่นำไปสู่ **Balanced microbiome** (เครื่องหมายถูก) และ **Unbalanced microbiome** (เครื่องหมายกากบาท)"
          },
          {
            "text": "ข้อความใต้ภาพระบุปัจจัยที่เกี่ยวข้องกับ microbiome ได้แก่ **อาหาร / สุขภาพสัตว์ / การให้สารเสริมต่างๆ / สภาวะแวดล้อม**"
          },
          {
            "callout": "สไลด์ไม่ได้ให้นิยามของ Nutrigenomics ไว้ มีเพียงชื่อหัวข้อกับภาพประกอบ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Gut microbiome ในกุ้ง",
        "source": "Aquaculture_Industry_Tech p.11",
        "body": [
          {
            "text": "แผนภาพ (A) แสดงการแบ่งทางเดินอาหารของ Pacific white shrimp, *Litopenaeus vannamei* ออกเป็น **Foregut, Midgut, Hindgut**"
          },
          {
            "sub": "taxa ที่แสดงในคำอธิบายกราฟแท่ง",
            "body": [
              {
                "text": "Unclassified, Verrucomicrobia, Tenericutes, Proteobacteria, Planctomycetes, Gammatimonadetes, Fusobacteria, Firmicutes, Cyanobacteria, Chloroflexi, Bacteroidetes, Actinobacteria"
              }
            ]
          },
          {
            "sub": "มิติที่กราฟนำมาเปรียบเทียบ",
            "body": [
              {
                "bullets": [
                  "**Life stage**: Larvae, PL, Juvenile, Adult",
                  "**Health comparison**: Diseased, AHPND, WSSV, WFS, CSL, BBS, Retardation",
                  "**Qualifying information**: Whole-body homogenates, Foregut, Clear water system, Biofloc, Big, Blue, Over-grown",
                  "แผงเสริม (B) เป็น Black tiger shrimp *Penaeus monodon* และ (C) เป็น Pacific white shrimp โดยเทียบ Cultured กับ Wild"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์: Holt, *et al*., 2021. Understanding the role of the shrimp gut microbiome in health and disease. *Journal of Invertebrate Pathology*."
          },
          {
            "callout": "สไลด์ไม่ได้เขียนข้อสรุปเป็นตัวอักษรว่า taxa ใดเพิ่มหรือลดในภาวะโรคใด แสดงเฉพาะกราฟ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Gut microbiome ในปลา habitat เป็นตัวกำหนดหลัก",
        "source": "Aquaculture_Industry_Tech p.12",
        "body": [
          {
            "text": "ชื่อบทความที่อ้างบนสไลด์ระบุใจความสำคัญไว้แล้วว่า **Host habitat is the major determinant of the gut microbiome of fish**"
          },
          {
            "sub": "แผนภูมิ relative abundance (แผง b)",
            "body": [
              {
                "bullets": [
                  "**Proteobacteria 51.7%** เป็นกลุ่มใหญ่สุด",
                  "**Firmicutes 13.5%**",
                  "**Cyanobacteria 10.3%**",
                  "ยังมีตัวเลขย่อยอีกหลายค่าบนแผนภูมิ (4.4%, 4.3%, 2.0%, 1.74%, 0.44%, 0.35%, 0.33%, 0.33% และ 10.7%) แต่บนสไลด์จับคู่กับชื่อ taxa ได้ไม่ชัดเจน"
                ]
              }
            ]
          },
          {
            "sub": "แผง c เปรียบเทียบ FWF กับ SWF",
            "body": [
              {
                "text": "เทียบ Relative abundance (%) และ Frequency of occurrence (%) ของ Proteobacteria, Firmicutes, Cyanobacteria, Actinobacteria, Planctomycetes, Fusobacteria โดยสัญลักษณ์วงกลมโปร่งคือ **FWF** และวงกลมทึบคือ **SWF**"
              },
              {
                "text": "สไลด์ไม่ได้ขยายตัวย่อ FWF และ SWF ไว้"
              }
            ]
          },
          {
            "sub": "แผง a จุดเก็บตัวอย่าง (ประเทศเกาหลีใต้)",
            "body": [
              {
                "text": "East sea (Deep sea) N = 68, East sea (Dokdo) N = 28, West sea (EEZ) N = 70, Gangneung (Yeongok Stream) N = 16, Yesan (Yedang Lake) N = 16, Andong (Andong Lake) N = 29"
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์: Kim, *et al.*, 2021. Host habitat is the major determinant of the gut microbiome of fish. *Microbiome*."
          }
        ]
      },
      {
        "heading": "นิยาม Microbiome และการตรวจด้วย 16S rRNA",
        "source": "Aquaculture_Industry_Tech p.13",
        "body": [
          {
            "text": "**Microbiome**: the community of microorganisms (bacteria, archaea, fungi, viruses and protozoa)"
          },
          {
            "text": "วิธีศึกษาที่ระบุบนสไลด์ คือ **Sequence variation of the 16S rRNA gene** from organisms and environments of interest"
          },
          {
            "sub": "มุมที่ศึกษา microbiome ในงานสัตว์น้ำ",
            "body": [
              {
                "bullets": [
                  "Microbiome VS nutrition",
                  "Microbiome VS health and disease",
                  "Microbiome VS the culture environment",
                  "Microbiome VS aquaculture productivity"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์: Infante-Villamil, *et al*., 2020. Microbiome diversity and dysbiosis in aquaculture. *Reviews in Aquaculture*."
          }
        ]
      },
      {
        "heading": "Microbiome diversity VS สุขภาพสัตว์น้ำ และภาวะ gut dysbiosis",
        "source": "Aquaculture_Industry_Tech p.14",
        "body": [
          {
            "text": "แผนภาพวงจรของ Fish and Shrimp ตั้งแต่ Post larvae ไป Juvenile และ Adult โดยมีปัจจัยกดดันระหว่างทางที่ทำให้ **Disease sensitivity** เพิ่มขึ้น"
          },
          {
            "sub": "ปัจจัยที่เพิ่มความไวต่อโรค",
            "body": [
              {
                "bullets": [
                  "Diet change",
                  "Physiological change",
                  "Environment stress",
                  "Poor water quality"
                ]
              }
            ]
          },
          {
            "text": "ปลายทางของปัจจัยเหล่านี้คือ **Gut Dysbiosis** ซึ่งวาดเป็นตราชั่งระหว่าง **Pathogenic microbes** กับ **Beneficial microbes**"
          },
          {
            "sub": "สองทางเลือกในการจัดการที่สไลด์วางไว้",
            "body": [
              {
                "bullets": [
                  "กรอบสีเขียว (สู่สภาวะ Healthy): **Probiotics, Prebiotics, Synbiotics**",
                  "กรอบสีแดง (เมื่อ Diseased แล้ว): **Drugs**"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์: Infante-Villamil, *et al*., 2020. Microbiome diversity and dysbiosis in aquaculture. *Reviews in Aquaculture*. และ Rajeev, *et al*., 2021. Healthy microbiome: a key to successful and sustainable shrimp aquaculture. *Reviews in aquaculture*."
          }
        ]
      },
      {
        "heading": "โรคในสัตว์น้ำ สามเหลี่ยมการเกิดโรค",
        "source": "Aquaculture_Industry_Tech p.15",
        "body": [
          {
            "text": "โรคเกิดที่จุดตัดของสามวง คือ **Environment, Susceptible Host และ Pathogen**"
          },
          {
            "sub": "Environment",
            "body": [
              {
                "bullets": [
                  "Temperature increase",
                  "Oxygen decrease"
                ]
              }
            ]
          },
          {
            "sub": "Susceptible Host",
            "body": [
              {
                "bullets": [
                  "Overcrowding",
                  "Stress",
                  "Compromised immune system"
                ]
              }
            ]
          },
          {
            "sub": "Pathogen",
            "body": [
              {
                "bullets": [
                  "Ideal growth conditions",
                  "Host availability"
                ]
              }
            ]
          },
          {
            "text": "ภาพประกอบด้านขวาแสดงเชื้อก่อโรค 4 กลุ่ม ได้แก่ **Bacteria, Virus, Protozoa, Fungi**"
          }
        ]
      },
      {
        "heading": "สัตว์น้ำป่วยหรือตาย VS การใช้ยา และปัญหา AMR",
        "source": "Aquaculture_Industry_Tech p.16",
        "body": [
          {
            "text": "หัวข้อกลางสไลด์คือ **AMR: Antimicrobial resistance**"
          },
          {
            "text": "อินโฟกราฟิกใช้ชื่อรายงาน NO TIME TO WAIT: SECURING THE FUTURE FROM DRUG-RESISTANT INFECTIONS และวางกรอบ **ONE HEALTH RESPONSE TO ANTIMICROBIAL RESISTANCE**"
          },
          {
            "sub": "ภาคส่วนใน One Health ที่แสดงบนสไลด์",
            "body": [
              {
                "bullets": [
                  "Humans",
                  "Food & Feed",
                  "Plants & Crops",
                  "Environment",
                  "**Terrestrial & Aquatic Animals**"
                ]
              }
            ]
          },
          {
            "text": "ข้อความในกรอบระบุว่า Antimicrobial resistance is a global crisis. There is no time to wait. A sustained One Health response with a shared vision and goals is essential to tackle antimicrobial resistance and achieve the Sustainable Development Goals."
          },
          {
            "sub": "Interagency Coordination Group on Antimicrobial Resistance Recommendations 5 ข้อ",
            "body": [
              {
                "bullets": [
                  "ACCELERATE PROGRESS IN COUNTRIES",
                  "INNOVATE TO SECURE THE FUTURE",
                  "COLLABORATE FOR MORE EFFECTIVE ACTION",
                  "INVEST FOR A SUSTAINABLE RESPONSE",
                  "STRENGTHEN ACCOUNTABILITY AND GLOBAL GOVERNANCE"
                ]
              }
            ]
          },
          {
            "text": "องค์กรที่ปรากฏโลโก้บนสไลด์ ได้แก่ FAO (Food and Agriculture Organization of the United Nations), WHO (World Health Organization) และ WOAH (World Organisation for Animal Health, Founded as OIE)"
          }
        ]
      },
      {
        "heading": "โปรไบโอติก (Probiotic) VS สุขภาพสัตว์น้ำ",
        "source": "Aquaculture_Industry_Tech p.17",
        "body": [
          {
            "text": "นิยามที่สไลด์ยกมาจาก FAO/WHO: **Probiotics: \"living microorganisms, which, when administered in adequate amounts, confer a health benefit on the host.\"**"
          },
          {
            "sub": "จุลชีพที่ใช้ในผลิตภัณฑ์ probiotic",
            "body": [
              {
                "text": "*Lactobacillus, Bifidobacterium, Saccharomyces, Streptococcus, Enterococcus, Roseobacter, Escherichia,* and *Bacillus sp*."
              }
            ]
          },
          {
            "sub": "กลไกและผลที่คาดหวัง",
            "body": [
              {
                "text": "To modify the host-associated or ambient microbial community, leading to more efficient use of feed and enhanced nutritional value, improved immune response, and better water quality."
              }
            ]
          },
          {
            "text": "สไลด์แบ่งการใช้งานออกเป็นสองแบบ คือ **Gut probiotic & Water probiotic**"
          },
          {
            "text": "อ้างอิงบนสไลด์: FAO/WHO, 2001. Evaluation of health and nutritional properties of powder milk and live lactic acid bacteria. และ Sánchez, *et al*. 2016. Probiotics, gut microbiota, and their influence on host health and disease. *Molecular nutrition and food research*."
          }
        ]
      },
      {
        "heading": "Water probiotics (Aqueous probiotics)",
        "source": "Aquaculture_Industry_Tech p.18",
        "body": [
          {
            "sub": "เป้าหมายสองข้อ",
            "body": [
              {
                "bullets": [
                  "**competitive exclusion and inhibition of pathogenic bacteria**",
                  "**improvement of water quality**"
                ]
              }
            ]
          },
          {
            "sub": "สายพันธุ์แบคทีเรียที่ใช้เป็น water probiotics",
            "body": [
              {
                "text": "*Bacillus acidophilus, B. subtilis, B. licheniformis, Aerobacter, Saccharomyces cerevisiae, Pseudomonas, Acinetobacter, Cellulomonas, Rhodopseudomonas, Nitrosomonas* and *Nitrobacter spp.*"
              }
            ]
          },
          {
            "sub": "เส้นทางการให้และผลตามแผนภาพ",
            "body": [
              {
                "bullets": [
                  "**Direct addition to the rearing water** ทำให้ Vibrio count, Ammonia และ Nitrite ลดลง และเกี่ยวข้องกับ Nitrogen, Phosphorus, Carbon ที่พื้นบ่อ",
                  "**Feed supplements** ให้ผลด้าน Digestibility and nutrient utilization, Digestive enzymes, Inhibition of pathogens in the gut, Colonization of beneficial microbes",
                  "ผ่าน Immune system ทาง Cellular and humoral factors นำไปสู่ **Protection** และ **Growth**"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์: Lazado, et al. 2015. Mechanisms of probiotic actions in shrimp: Implications to tropical aquaculture. *Biology engineering*."
          }
        ]
      },
      {
        "heading": "ภาพรวม Probiotics / Prebiotics / Synbiotics / Postbiotics",
        "source": "Aquaculture_Industry_Tech p.19",
        "body": [
          {
            "text": "แผนภาพสรุปความสัมพันธ์เป็นสมการ **PREBIOTICS + PROBIOTICS = SYNBIOTICS** โดยมี POSTBIOTICS เป็น by-product แยกออกมา"
          },
          {
            "sub": "PREBIOTICS (ทำหน้าที่เป็น FOOD)",
            "body": [
              {
                "bullets": [
                  "Supply nutrient for beneficial bacteria",
                  "Promote the growth and development of advantageous bacteria"
                ]
              }
            ]
          },
          {
            "sub": "PROBIOTICS (ติดป้าย LIVE)",
            "body": [
              {
                "bullets": [
                  "Live bacteria",
                  "Regulating immunity",
                  "Strengthening the defences against infections"
                ]
              }
            ]
          },
          {
            "sub": "SYNBIOTICS (COMBINATION)",
            "body": [
              {
                "bullets": [
                  "Combination of pre- and probiotics",
                  "Enhances immunity"
                ]
              }
            ]
          },
          {
            "sub": "POSTBIOTICS (ติดป้าย DEAD และ By-product)",
            "body": [
              {
                "text": "Inanimate microorganisms and their components that confers a health benefit on the host."
              }
            ]
          },
          {
            "callout": "จุดที่ชอบออกสอบ คือ ป้าย LIVE บน probiotic กับป้าย DEAD บน postbiotic ต่างกันที่จุลชีพยังมีชีวิตหรือไม่",
            "kind": "tip"
          },
          {
            "text": "อ้างอิงบนสไลด์: Mohd Fuad, *et al*., 2022. The Mechanisms of Probiotics, Prebiotics, Synbiotics, and Postbiotics in Oral Cancer Management. *Probiotics and Antimicrobial Proteins*."
          }
        ]
      },
      {
        "heading": "พรีไบโอติก (Prebiotic) นิยาม ชนิด และกลไก",
        "source": "Aquaculture_Industry_Tech p.20",
        "body": [
          {
            "text": "**Prebiotics** are indigestible food ingredients that any compound, substrate, long chain sugar, nutrient, or fiber that serves as food to the beneficial microorganisms in a host digestive system. **Most prebiotics are a subset of carbohydrate groups.**"
          },
          {
            "sub": "ตัวอย่างพรีไบโอติกที่ระบุบนสไลด์",
            "body": [
              {
                "text": "**β-glucan, inulin, arabinoxylanoligosaccharide (AXOS), mannan oligosaccharide (MOS), fructo-oligosaccharides (FOS), galacto-oligosaccharides (GOS), starch and glucose-derived oligosaccharides**"
              }
            ]
          },
          {
            "sub": "ประโยชน์ที่ระบุ",
            "body": [
              {
                "text": "to promote growth performance, increase feed utilization efficiency, enhance immune system and stimulate disease resistance of aquaculture species"
              }
            ]
          },
          {
            "sub": "กลไก 4 ข้อจากแผนภาพ",
            "body": [
              {
                "bullets": [
                  "1) **Stimulate probiotics growth**",
                  "2) **Fermentation** แบบ selective fermentation ซึ่งได้ **Postbiotics** ออกมา",
                  "3) **Direct uptake** ที่ intestinal epithelial cells",
                  "4) **Interaction with pathogens**"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์: Wee., *et al.* 2022. The effects of mixed prebiotics in aquaculture: A review. *Aquaculture and Fisheries*. และ Hutkins, et al. 2016. Prebiotics: Why definitions matter. *Current Opinion in Biotechnology*."
          }
        ]
      },
      {
        "heading": "ตารางงานวิจัย prebiotic mixtures ต่อการเจริญเติบโต",
        "source": "Aquaculture_Industry_Tech p.21",
        "body": [
          {
            "text": "ตารางหัวข้อ The effects of prebiotic mixtures on the growth performance of aquatic animals มีคอลัมน์ Prebiotic mixtures, Aquaculture species, Dosage, Duration, References ตัวอย่างแถวที่อ่านได้จากสไลด์"
          },
          {
            "bullets": [
              "FOS, GOS, MOS, GGM ใน Red drum (*Sciaenops ocellatus*) ขนาด **10 g/kg diet** นาน **56 days** (Zhou et al. 2010)",
              "Inulin, GOS, soybean oligosaccharide (SBO), corncob-derived oligosaccharide (CDXOS) ใน Sex reversed red hybrid tilapia ขนาด **5% of diet** นาน **60 days** (Plongbunjong et al. 2011)",
              "Immunogen (β-glucan, MOS) ใน Common carp (*Cyprinus carpio*) ขนาด **0.5-2.5 g/kg diet** นาน **8 weeks** (Ebrahimi et al. 2012)",
              "β-1,3/1,6-glucans ใน Gilthead sea bream (*Sparus aurata*) ขนาด **1 g/kg diet** นาน **4 weeks** (Guzmán-Villanueva et al. 2014)",
              "Inulin, FOS, GOS ใน Post larval Pacific white shrimp (*Litopenaeus vannamei*) ขนาด **2% of diet** นาน **30 days** (Oktaviana and Yuhana 2014)",
              "Inulin, Jerusalem artichoke ใน Juvenile Nile tilapia (*Oreochromis niloticus*) ขนาด **5 g-10 g/kg diet** นาน **8 weeks** (Tiengtam et al. 2015)",
              "β-glucan + MOS ใน Nile tilapia ขนาด **1.5-3 g/kg diet** นาน **60 days** (Selim and Reda 2015)",
              "β-glucan, GOS, MOS ใน Snakehead (*Channa striata*) ขนาด β-glucan **2 g/kg diet**, GOS **5 g/kg diet**, MOS **5 g/kg diet** นาน **16 weeks** (Munir et al. 2016)",
              "FOS, GOS, MOS ใน Pacific white shrimp ขนาด **0.4% of diet** นาน **60 days** (Huynh et al. 2018)",
              "β-glucan, MOS ใน Caspian trout (*Salmo trutta caspius*) ขนาด MOS **4 g/kg diet** + β-glucan **4 g/kg diet** นาน **8 weeks** (Jami et al. 2019)",
              "β-glucan + MOS + dextrose ใน Nile tilapia ขนาด **0.5-1.5 g/kg diet** นาน **45 days** (Ismail et al. 2019)",
              "β-glucan, MOS ใน Shabout (*Tor grypus*) ขนาด MOS **1.5% of diet** + β-glucan **1.5% of diet** นาน **90 days** (Mohammadian et al. 2021)"
            ]
          },
          {
            "callout": "ตารางยังมีแถว Chinese mitten crab (*Eriocheir sinensis*) ที่ใช้ MOS 3 g/kg diet เดี่ยว หรือรวมกับ β-glucan 1.5 g/kg diet หรือรวมกับ Inulin 10 g/kg diet นาน 8 weeks (Lu et al. 2019)",
            "kind": "tip"
          },
          {
            "text": "อ้างอิงบนสไลด์: Wee., *et al.* 2022. The effects of mixed prebiotics in aquaculture: A review. *Aquaculture and Fisheries*."
          }
        ]
      },
      {
        "heading": "ตารางงานวิจัย prebiotic mixtures ในบทบาท immunostimulant",
        "source": "Aquaculture_Industry_Tech p.22",
        "body": [
          {
            "text": "ตารางหัวข้อ Prebiotic mixtures as immunostimulants in aquaculture species ตัวอย่างแถวที่อ่านได้"
          },
          {
            "bullets": [
              "β-1,3/1,6-glucans ใน Nile tilapia (*Oreochromis niloticus*) ขนาด **0.1% of diet** นาน **2 weeks** (Şahan and Duman 2010)",
              "FOS, GOS, MOS, GGM ใน Red drum (*Sciaenops ocellatus*) ขนาด **10 g/kg diet** นาน **56 days** (Zhou et al. 2010)",
              "β-glucan, MOS ใน Atlantic cod (*Gadus morhua*) ขนาด **1 g/kg diet** นาน **5 weeks** (Lokesh et al. 2012)",
              "Chitooligosaccharides, hydrolyzed shrimp shell chitin ใน Hybrid tilapia (*Oreochromis niloticus* X *Oreochromis aureus*) ขนาด **1 g/kg diet** นาน **4 weeks** (Qin et al. 2014)",
              "GOS, FOS, inulin ใน Common carp (*Cyprinus carpio*) ขนาด **20 g/kg diet** นาน **8 weeks** (Hoseinifar et al. 2017)",
              "β-1,3/1,6-glucans ใน Nile tilapia ขนาด **0.1-0.2% of diet** นาน **21 days** (Salah et al. 2017)",
              "MOS, inulin ใน Pacific white shrimp (*Litopenaeus vannamei*) ขนาด MOS **2.5-4 g/kg diet** + inulin **10 g/kg diet** นาน **4 weeks** (Li et al. 2018)",
              "β-glucan, MOS ใน Nile tilapia ขนาด **0.1-0.2% of diet** นาน **60 days** (Abu-Elala et al. 2018)",
              "MOS, β-glucan ใน Shabout (*Tor grypus*) ขนาด MOS **1.5% of diet** + β-glucan **1.5% of diet** นาน **90 days** (Mohammadian et al. 2021)"
            ]
          },
          {
            "callout": "สังเกตว่างานเดียวกันหลายเรื่อง (เช่น Zhou 2010, Lokesh 2012, Munir 2016, Jami 2019, Lu 2019) ปรากฏซ้ำทั้งตารางการเจริญเติบโตและตาราง immunostimulant คือใช้สูตรและขนาดเดิมแต่วัดคนละผลลัพธ์",
            "kind": "tip"
          },
          {
            "text": "อ้างอิงบนสไลด์: Wee., *et al.* 2022. The effects of mixed prebiotics in aquaculture: A review. *Aquaculture and Fisheries*."
          }
        ]
      },
      {
        "heading": "ตารางงานวิจัย prebiotic mixtures ต่อความต้านทานโรค",
        "source": "Aquaculture_Industry_Tech p.23",
        "body": [
          {
            "text": "ตารางหัวข้อ Effects of prebiotic mixtures on the disease resistance of aquatic animals ตารางนี้มีคอลัมน์ **Pathogen/Disease** เพิ่มเข้ามา ตัวอย่างแถวที่อ่านได้"
          },
          {
            "bullets": [
              "β-glucan, MOS ใน Sea cucumber (*Apostichopus*) ต่อ *Vibrio splendidus* ขนาด **β-glucan 0.15%, MOS 0.1%** นาน **4 weeks** (Gu et al. 2011)",
              "β-glucan, MOS ใน Atlantic cod (*Gadus morhua*) ต่อ *Vibrio anguillarum* ขนาด **1 g/kg diet** นาน **5 weeks** (Lokesh et al. 2012)",
              "Immunogen (β-glucan, MOS) ใน Common carp ต่อ *Aeromonas hydrophila* ขนาด **0.5-2.5 g/kg diet** นาน **8 weeks** (Ebrahimi et al. 2012)",
              "*Echinacea purpurea, Uncaria tomentosa* ใน Pacific whiteleg shrimp (*Litopenaeus vannamei*) ต่อ **WSSV** ขนาด **1-4 g/kg diet** นาน **21 days** (Peraza-Gómez et al. 2014)",
              "β-glucan, MOS ใน Juvenile tiger shrimp (*Penaeus monodon*) ต่อ **White Spot Syndrome Disease** ขนาด **0.1-0.5% of diet** นาน **60 days** (Andrino et al. 2014)",
              "MOS, peptidoglycan ใน Juvenile tiger shrimp ต่อ **White Spot Syndrome Disease** ขนาด **0.1-0.5% of diet** นาน **8 weeks** (Apines-Amar et al. 2014)",
              "Inulin, FOS, GOS ใน Post larval Pacific white shrimp ต่อ *Vibrio harveyi* ขนาด **2% of diet** นาน **30 days** (Oktaviana and Yuhana 2014)",
              "β-glucan, MOS ใน Nile tilapia ต่อ *Yersinia ruckeri* ขนาด **1.5-3 g/kg diet** นาน **60 days** (Selim and Reda 2015)",
              "MOS, inulin ใน Pacific white shrimp ต่อ *Vibrio alginolyticus* และ White Spot Syndrome Disease ขนาด MOS **2.5-4 g/kg diet** + inulin **10 g/kg diet** นาน **4 weeks** (Li et al. 2018)",
              "β-glucan + MOS + dextrose ใน Nile tilapia ต่อ *Pseudomonas fluorescens* ขนาด **0.5-1.5 g/kg diet** นาน **45 days** (Ismail et al. 2019)",
              "Alginate extract + *Sargassum crassifolium* ใน Crayfish (*Cherax quadricarinatus*) ต่อ *Aeromonas hydrophila* ขนาด **200 mg/L** นาน **40 days** (Amrullah and Wahidah 2019)",
              "β-glucan, MOS ใน Nile tilapia ต่อ *Pseudomonas aeruginosa* ขนาด **1 mL/kg diet** นาน **8 weeks** (El-Nobi et al. 2021)"
            ]
          },
          {
            "callout": "เชื้อเป้าหมายที่พบซ้ำมากที่สุดในตารางนี้ คือ *Aeromonas hydrophila*, กลุ่ม *Vibrio* และ White Spot Syndrome Disease (WSSV)",
            "kind": "tip"
          },
          {
            "text": "อ้างอิงบนสไลด์: Wee., *et al.* 2022. The effects of mixed prebiotics in aquaculture: A review. *Aquaculture and Fisheries*."
          }
        ]
      },
      {
        "heading": "ซินไบโอติก (Synbiotic)",
        "source": "Aquaculture_Industry_Tech p.24",
        "body": [
          {
            "text": "**Synbiotic is defined as the synergistic combination of prebiotics and probiotics.**"
          },
          {
            "bullets": [
              "improve survival rates and modulation of intestinal microbiota",
              "the action of probiotic bacteria be increased by prebiotics, due to the contribution of this component for their growth metabolism and activation",
              "to positive effects on growth performance (e.g., growth, weight gain) improve intestinal microbiota, microvilli and absorptive ability; digestive enzyme activity; growth performance; expression levels of immune-related genes; and disease resistance against viral and bacterial infections"
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์: Huynh et al., 2017. Current applications, selection, and possible mechanisms of actions of synbiotics in improving the growth and health status in aquaculture: A review. *Fish and Shellfish Immunology*."
          }
        ]
      },
      {
        "heading": "โพสไบโอติก (Postbiotic)",
        "source": "Aquaculture_Industry_Tech p.25",
        "body": [
          {
            "text": "**Postbiotic is preparation of inanimate microorganisms and their components that confers a health benefit on the host.**"
          },
          {
            "sub": "ตัวอย่างสารที่จัดเป็น postbiotic",
            "body": [
              {
                "text": "**short-chain fatty acids (SCFAs)** และองค์ประกอบอื่น เช่น microbial fractions, functional proteins, secreted polysaccharides, **extracellular polysaccharides (EPS)**, cell lysates, teichoic acid, peptidoglycan-derived muropeptides และ pili-type structures"
              }
            ]
          },
          {
            "text": "**Postbiotics may have therapeutic and protective activities, similar to probiotics, with less risk.**"
          },
          {
            "sub": "องค์ประกอบของ postbiotic ตามภาพ",
            "body": [
              {
                "bullets": [
                  "intact inanimate microbial cells",
                  "microbial cell fragments/structures เช่น cell walls, membranes, exopolysaccharides, cell-wall anchored proteins, pili",
                  "with or without metabolites/endproducts เช่น organic acids, peptides, secreted proteins, enzymes, bacteriocins"
                ]
              }
            ]
          },
          {
            "text": "อ้างอิงบนสไลด์: Żółkiewicz., et al. 2020. Postbiotics, a step beyond pre- and probiotics. *Nutrients*."
          }
        ]
      },
      {
        "heading": "Biofloc system",
        "source": "Aquaculture_Industry_Tech p.26",
        "body": [
          {
            "text": "สไลด์นี้เป็นภาพประกอบล้วน ไม่มีข้อความอธิบายบนสไลด์"
          },
          {
            "text": "ภาพแสดงโรงเรือนหลังคาโค้งคลุมบ่อเลี้ยง น้ำในบ่อมีสีน้ำตาลขุ่นและมีระบบตีน้ำ พร้อมภาพเจ้าหน้าที่ยกยอตรวจสัตว์น้ำในบ่อ"
          },
          {
            "callout": "สไลด์ไม่ได้ให้นิยามหรือหลักการของ biofloc ไว้เป็นตัวอักษร มีแต่หัวข้อกับภาพ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "วัฏจักรไนโตรเจน (The nitrogen cycle)",
        "source": "Aquaculture_Industry_Tech p.27",
        "body": [
          {
            "text": "ข้อความกลางแผนภาพ: Nitrogen compounds are essential to life, but many are toxic and must be managed in a balanced fashion to work with the aquaponic system's ecology. The nitrogen cycle is a series of metabolic processes that prevent the build-up of toxic nitrogen compounds by converting them to nitrates. When a tank is filled with new, clean water, the process of establishing the nitrogen cycle is called **\"cycling.\"**"
          },
          {
            "sub": "ขั้นที่ 1 แหล่งไนโตรเจน",
            "body": [
              {
                "text": "Nitrogen sources include waste products from animal metabolism and decaying plant matter. Shrimp meal can be used as a starter when cycling a new, clean tank. ได้ผลผลิตเป็น **Ammonia NH3/NH4**"
              }
            ]
          },
          {
            "sub": "ขั้นที่ 2 nitrification ช่วงแรก",
            "body": [
              {
                "text": "**Nitrosomonas** bacteria colonize the system and metabolize the toxic ammonia to produce **nitrites (NO2)**. This process is called **nitrification.** ได้ **Nitrite NO2-**"
              }
            ]
          },
          {
            "sub": "ขั้นที่ 3 nitrification ช่วงหลัง",
            "body": [
              {
                "text": "**Nitrobacter** bacteria metabolize the nitrites to produce **nitrates (NO3)**, a key nutrient necessary for green growth. ได้ **Nitrate NO3-**"
              }
            ]
          },
          {
            "sub": "ขั้นที่ 4 กลับเข้าวงจร",
            "body": [
              {
                "text": "Plants are fertilized by the nitrates. Through a combination of decay and excretions from fish that eat the plants, waste matter generates ammonia to continue the cycle."
              }
            ]
          },
          {
            "callout": "จำลำดับ **แอมโมเนีย ไปเป็น ไนไตรท์ ไปเป็น ไนเตรต** พร้อมคู่แบคทีเรีย **Nitrosomonas** ที่ขั้นแอมโมเนียไปไนไตรท์ และ **Nitrobacter** ที่ขั้นไนไตรท์ไปไนเตรต",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ฟาร์มกุ้ง",
        "source": "Aquaculture_Industry_Tech p.28",
        "body": [
          {
            "text": "สไลด์หัวข้อ กุ้ง เป็นภาพประกอบล้วน ไม่มีข้อความอธิบายบนสไลด์"
          },
          {
            "text": "ภาพแสดงมุมสูงของฟาร์มกุ้งที่มีบ่อเรียงเป็นแปลง ภาพเครื่องตีน้ำในบ่อ และภาพแถวโรงเรือนหลังคาโค้งคลุมบ่อจำนวนมาก"
          }
        ]
      },
      {
        "heading": "ปัญหาการเกิดโรคระบาดในกุ้งของไทย",
        "source": "Aquaculture_Industry_Tech p.29",
        "body": [
          {
            "text": "กราฟแท่ง **ปริมาณผลผลิตกุ้งขาวไทย (พันตัน)** ครอบคลุมปี **2553 ถึง 2567** แกน y ไล่ตั้งแต่ 0 ถึง 700"
          },
          {
            "text": "บนกราฟมีลูกศรสีแดงชี้ลงจากจุด **125,000 MB** ไปยัง **50,000 MB** และวงกลมสีแดงกำกับว่าลดลง **54%**"
          },
          {
            "sub": "โรคที่สไลด์ระบุว่าเป็นสาเหตุ",
            "body": [
              {
                "bullets": [
                  "**โรคกุ้งตายด่วน (EMS) หรือโรคตับและตับอ่อนตายเฉียบพลัน (AHPNS)**",
                  "**โรคขี้ขาว หรือ โรคอีเอชพี (EHP: Enterocytozoon hepatopenae)**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์สรุปว่า **มูลค่าความเสียหายรวมกว่า 7 หมื่นล้านบาท**"
          },
          {
            "sub": "ภาพเปรียบเทียบ EMS Shrimp กับ Normal Shrimp",
            "body": [
              {
                "bullets": [
                  "**EMS Shrimp**: Empty stomach, Atrophied pale hepatopancreas, Empty midgut",
                  "**Normal Shrimp**: Full stomach, Large pigmented hepatopancreas, Full midgut",
                  "ภาพอื่นบนสไลด์ติดป้าย Healthy individuals เทียบ Infected individuals, Size variation และ White gut"
                ]
              }
            ]
          },
          {
            "callout": "ชื่อวิทยาศาสตร์บนสไลด์หน้านี้พิมพ์ว่า *Enterocytozoon hepatopenae* ขณะที่สไลด์หน้า 31 พิมพ์ว่า *Enterocytozoon hepatopenaei* บันทึกไว้ตามที่ปรากฏจริงบนแต่ละสไลด์",
            "kind": "warn"
          },
          {
            "callout": "กราฟไม่มีตัวเลขกำกับบนแท่งแต่ละปี ตัวเลขที่พิมพ์ไว้จริงมีเพียง 125,000 MB และ 50,000 MB ที่ปลายลูกศร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "โรคสำคัญใน Penaeus vannamei จัดกลุ่มตามอาการทางคลินิก",
        "source": "Aquaculture_Industry_Tech p.30",
        "body": [
          {
            "text": "สไลด์จัดกลุ่มโรคด้วยหลัก **Grouping by clinical signs** เป็น 3 กลุ่ม"
          },
          {
            "sub": "1. Massive mortality rate (ตายยกบ่อ)",
            "body": [
              {
                "text": "**WSSV, DIV 1, YHV, TSV, IMNV, AHPND, NHP**"
              }
            ]
          },
          {
            "sub": "2. Slow growth rate (โตช้า)",
            "body": [
              {
                "text": "**EHP**"
              }
            ]
          },
          {
            "sub": "3. White feces syndrome (ขี้ขาว)",
            "body": [
              {
                "text": "**EHP + Vibrio, Vibriosis, Dysbiosis**"
              }
            ]
          },
          {
            "text": "ลูกศรด้านขวาของสไลด์ชี้ไปที่คำว่า **Biosecurity** พร้อมสัญลักษณ์ห้ามเชื้อโรคเข้า"
          },
          {
            "callout": "การจัดกลุ่มแบบนี้เหมาะกับการวินิจฉัยหน้าบ่อ คือ เริ่มจากอาการที่เห็น (ตายยกบ่อ, โตช้า, ขี้ขาว) แล้วจึงไล่หาเชื้อในกลุ่มนั้น สังเกตว่า **EHP อยู่ได้ทั้งกลุ่มโตช้าและกลุ่มขี้ขาว**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Infection with Enterocytozoon hepatopenaei (EHP) ลักษณะเชื้อและอาการ",
        "source": "Aquaculture_Industry_Tech p.31",
        "body": [
          {
            "sub": "ลักษณะเชื้อ",
            "body": [
              {
                "bullets": [
                  "A member of **microsporidian**",
                  "Family **Enterocytozoonidae**",
                  "**Unicellular parasite**, Spore forming size **1.1 x 0.6-0.7 µm** with **4-5 coils of polar filament**, **resist to chemicals or environment**"
                ]
              }
            ]
          },
          {
            "sub": "Host",
            "body": [
              {
                "text": "*P.monodon, P.vannamei, P.japonicus, P.stylirostris, M.rosenbergii*"
              }
            ]
          },
          {
            "sub": "Signs",
            "body": [
              {
                "text": "**slow growth, atrophy HP, loose shell, high CV% or FCR, low ADG, White feces?**"
              },
              {
                "text": "สไลด์ใส่เครื่องหมายคำถามไว้หลัง White feces เอง ไม่ได้อธิบายว่าเพราะอะไร"
              }
            ]
          },
          {
            "sub": "Vector and carriers",
            "body": [
              {
                "text": "Mussels (*Mytilopsis leucophaeata*), Polychaete (*Marphysa gravelyi*), *Artemia salina*, *Acetes* sp., crab, copepod"
              }
            ]
          },
          {
            "callout": "ผลของ EHP คือ กุ้งไม่ตายทันทีแต่โตช้า ทำให้ **CV% และ FCR สูงขึ้น ADG ต่ำลง** ซึ่งเป็นตัวเลขเดียวกับที่สอนในหน้า 7 และ 8",
            "kind": "tip"
          },
          {
            "text": "ผู้อ้างอิงภาพบนสไลด์ ได้แก่ A.N. Krishnan et al., 2021, Praveena P.E. 2022, Munkongwongsiri N. et al., 2021, Karthikeyan K. and Sudhakaran R., 2020"
          }
        ]
      },
      {
        "heading": "EHP กลไกการเข้าเซลล์ผ่าน polar tube extrusion",
        "source": "Aquaculture_Industry_Tech p.32",
        "body": [
          {
            "text": "หัวข้อบนสไลด์คือ How to EHP infect shrimp hepatopancreas? และ In vivo mechanism of polar tube extrusion"
          },
          {
            "sub": "ขั้นที่ 1 Trigger",
            "body": [
              {
                "text": "**High pH stimulates protein on cell membrane, lead to water and Ca2+ get into spore** สอดคล้องกับภาพที่ระบุ High pH และ Osmotic stress"
              }
            ]
          },
          {
            "sub": "ขั้นที่ 2 Swelling",
            "body": [
              {
                "text": "**Increased Ca2+ can activate the spore swelling and polar tube extrusion.**"
              }
            ]
          },
          {
            "sub": "ขั้นที่ 3 Discharge",
            "body": [
              {
                "text": "**Polar tube discharge from anchoring disc. PTP2, the protein components bind the receptor on targeted cell then inject sporoplasm and develop EHP.**"
              }
            ]
          },
          {
            "text": "ภาพถ่ายกล้องจุลทรรศน์เปรียบเทียบ **Positive control** กับ **+Calcium ionophore** โดยมี scale bar 20 µm ทั้งสองภาพ ภาพที่เติม calcium ionophore เห็นสปอร์ยื่น polar tube ออกมาเป็นเส้น"
          },
          {
            "text": "ที่มาข้อมูลบนสไลด์: Dr.Kallaya Sritunyalucksana-Dangtip (Unpublic data)"
          },
          {
            "callout": "กลไกนี้คือฐานของวิธีควบคุมในหน้า 33 คือ ใช้ pH สูงบังคับให้สปอร์ยิง polar tube ออกมาเสียเปล่านอกตัวกุ้ง สปอร์นั้นจึงติดเชื้อต่อไม่ได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การควบคุม EHP ด้วย pH สูงและปูน",
        "source": "Aquaculture_Industry_Tech p.33",
        "body": [
          {
            "text": "หัวข้อบนสไลด์คือ **Effect of high pH and lime on EHP**"
          },
          {
            "text": "**To inactivate EHP by inducing polar tube extrusion using \"high pH with lime or sodium hydroxide\"**"
          },
          {
            "text": "วิธีปฏิบัติที่ระบุ: **Using Hi-Power 250-500 kg/Rai and spray NaOH at pH > 11 at pond bottom and slope**"
          },
          {
            "text": "ภาพประกอบแสดงการโรยปูนผงสีขาวลงพื้นบ่อและลาดบ่อทั้งบ่อดินและบ่อปูผ้าใบ"
          },
          {
            "callout": "ตัวเลขที่ต้องจำให้ตรง คือ **Hi-Power 250-500 kg/ไร่** และ **NaOH ที่ pH มากกว่า 11** ใช้ที่ **พื้นบ่อและลาดบ่อ**",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "การควบคุม EHP ด้วยการจัดการคุณภาพน้ำและของเสีย",
        "source": "Aquaculture_Industry_Tech p.34-35",
        "body": [
          {
            "sub": "หน้า 34 EHP controlling by water quality management",
            "body": [
              {
                "text": "**To delay EHP infection by water quality controlling using \"central drainage system\"**"
              },
              {
                "bullets": [
                  "**Control EHP amount less than 10² copy/L by regularly water exchange with clean water**",
                  "**Remove sediments, solid waste and shrimp carcass** for maintains optimal water qualities, low concentration of nutrients and EHP accumulation in pond water"
                ]
              }
            ]
          },
          {
            "sub": "หน้า 35 EHP controlling by water quality and waste management",
            "body": [
              {
                "text": "สไลด์แสดงสองจังหวะของการจัดการเลน คือ **Remove sludge during cultivation** (ระหว่างเลี้ยง) และ **After harvested** (หลังจับ)"
              },
              {
                "text": "ภาพติดป้ายเปรียบเทียบ **EHP** ในบ่อที่ยังมีเลน กับ **No EHP** ในบ่อที่ล้างจนสะอาดแล้ว"
              }
            ]
          },
          {
            "callout": "คำว่า delay ในสไลด์หน้า 34 คือ ชะลอการติดเชื้อ ไม่ใช่กำจัด สไลด์ไม่ได้อ้างว่าการจัดการน้ำอย่างเดียวทำให้บ่อปลอด EHP",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การควบคุม EHP ด้วยสารเคมี (in vitro)",
        "source": "Aquaculture_Industry_Tech p.36",
        "body": [
          {
            "text": "ตาราง **In vitro test (Direct contact) of disinfectant on EHP** แบ่งตามระยะเวลาสัมผัส"
          },
          {
            "sub": "Contact time: 18 hour",
            "body": [
              {
                "bullets": [
                  "Potassium permanganate **200 ppm** ผลคือ **Destroy DNA**",
                  "Acidified chlorine (pH 4) **125 ppm** ผลคือ **Destroy DNA**",
                  "Chlorine **50 ppm** ผลคือ **Kill EHP for 4 log**",
                  "Biosol **2,000-8,000 ppm** ผลคือ **Kill EHP for 1 Log**"
                ]
              }
            ]
          },
          {
            "sub": "Contact time: 12 hour",
            "body": [
              {
                "bullets": [
                  "Chlorine **75 ppm** ผลคือ **Kill EHP for 2 log**",
                  "Povidon iodine **6,000-10,000 ppm** ผลคือ **Kill EHP for 70%**",
                  "Chlorine dioxide **300 ppm** ผลคือ **Destroy DNA**"
                ]
              }
            ]
          },
          {
            "callout": "ตารางถูกตัดที่ขอบล่างของสไลด์ อาจมีแถวต่อจาก chlorine dioxide ที่อ่านไม่ได้จากหน้านี้",
            "kind": "flag"
          },
          {
            "callout": "สังเกตว่าเป็นผลทดสอบ **in vitro แบบสัมผัสโดยตรง** และต้องใช้เวลาสัมผัสนานถึง 12 ถึง 18 ชั่วโมง ซึ่งสอดคล้องกับที่หน้า 31 ระบุว่าสปอร์ EHP resist to chemicals or environment",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หลักการ \"6 Cleans\" ในการป้องกันโรคกุ้ง",
        "source": "Aquaculture_Industry_Tech p.37",
        "body": [
          {
            "text": "สไลด์วางกรอบว่า เพื่อป้องกันเชื้อก่อโรคในกุ้ง (prevent shrimp pathogens) และคงสิ่งแวดล้อมให้ดี (maintain a healthy environment) ให้พิจารณา **6 Cleans** ซึ่งเป็นแกนของทั้งบทนี้"
          },
          {
            "bullets": [
              "**C1 = Clean facilities** (โรงเรือน/สถานที่)",
              "**C2 = Clean water** (น้ำ)",
              "**C3 = Clean seed** (ลูกพันธุ์)",
              "**C4 = Clean feed and materials** (อาหารและวัสดุ)",
              "**C5 = Clean fomites** (อุปกรณ์/สิ่งของที่เป็นพาหะ)",
              "**C6 = Clean personnel** (คน)"
            ]
          },
          {
            "callout": "สไลด์นี้เป็นแค่แผนภาพภาพรวม รายละเอียดของแต่ละ C อยู่ในสไลด์ถัดไป",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "C1 = Clean facilities (สถานที่และโครงสร้างฟาร์ม)",
        "source": "Aquaculture_Industry_Tech p.38-40",
        "body": [
          {
            "sub": "Site selection and isolation",
            "body": [
              {
                "bullets": [
                  "เลือกทำเลฟาร์มให้ **ห่างจากพื้นที่ที่มีการระบาดของโรค** หรือพื้นที่ที่มีการเลี้ยงสัตว์น้ำหนาแน่น (high populations of aquatic farming)"
                ]
              }
            ]
          },
          {
            "sub": "Farm designs",
            "body": [
              {
                "bullets": [
                  "**Closed system, green house, net / fence** ช่วยกันกุ้งให้ห่างจากสัตว์อื่น"
                ]
              }
            ]
          },
          {
            "sub": "Restricted access",
            "body": [
              {
                "bullets": [
                  "จำกัดการเข้าฟาร์มเฉพาะ **authorized personnel** เท่านั้น",
                  "ใช้ **hygiene และ disinfection protocol ที่เข้มงวด** กับทุกคนที่เข้าฟาร์ม"
                ]
              }
            ]
          },
          {
            "sub": "Zoning",
            "body": [
              {
                "bullets": [
                  "แยก **production area ออกจาก non-production area**"
                ]
              }
            ]
          },
          {
            "sub": "Biosecure facilities",
            "body": [
              {
                "bullets": [
                  "ทำให้มั่นใจว่าโครงสร้างของฟาร์ม ได้แก่ **บ่อ อุปกรณ์ ยานพาหนะ และเส้นทางสัญจร (route way)** ถูก disinfect และดูแลรักษาอย่างเหมาะสมเพื่อลดความเสี่ยงของโรค"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "C2 = Clean water หรือ Water quality management",
        "source": "Aquaculture_Industry_Tech p.41-42",
        "body": [
          {
            "sub": "Monitor and control the quality of water and air",
            "body": [
              {
                "bullets": [
                  "ทำให้น้ำและอากาศ **ปราศจาก pollutants และ pathogens**",
                  "ใช้ระบบบำบัดและกรองน้ำ เช่น **ultrafiltration**, **double layers of fishing net**, **filtrated aeration system**"
                ]
              }
            ]
          },
          {
            "sub": "Water management during culture",
            "body": [
              {
                "bullets": [
                  "ใช้น้ำที่ **free-pathogens** สำหรับการเปลี่ยนถ่ายน้ำ",
                  "จัดการของเสียให้เหมาะสม ได้แก่ **pond sediments, waste water และการเก็บซาก (carcass removal)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "C3 = Clean seed หรือ free-pathogens in fry (ลูกพันธุ์สะอาด)",
        "source": "Aquaculture_Industry_Tech p.43",
        "body": [
          {
            "sub": "Use certificated disease-free shrimp seed",
            "body": [
              {
                "bullets": [
                  "**หลีกเลี่ยงการผสมลูกกุ้งจากหลายแหล่ง** (avoid mixing fry from different sources)"
                ]
              }
            ]
          },
          {
            "sub": "Quarantine",
            "body": [
              {
                "bullets": [
                  "ทำ **quarantine period** สำหรับลูกพันธุ์ชุดใหม่ เพื่อสังเกตอาการและตรวจโรคก่อนนำเข้าระบบ"
                ]
              }
            ]
          },
          {
            "sub": "มาตรฐาน/ใบรับรองที่สไลด์แสดงไว้",
            "body": [
              {
                "bullets": [
                  "Quality issue: **ISO 9001:2015** (Quality management system), **ISO 56002** (Innovation management system), **Good Aquaculture Practice (G.A.P.)**",
                  "Safety Health and Environment issue: **ISO 14001:2015** (Environment management system), **CPF SHE&En** (Safety Health Environment and Energy), **Code Of Conduct (COC)**",
                  "**Thai Labour standard TLS 8001-2010** กำกับว่า Human welfare",
                  "**Best Aquaculture Practices** กำกับว่า Sustainability",
                  "**TESCO** (Customer requirement) กำกับว่า Animal welfare"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "C4 = Clean feed and materials (อาหารและวัสดุสะอาด)",
        "source": "Aquaculture_Industry_Tech p.44",
        "body": [
          {
            "sub": "Live feed",
            "body": [
              {
                "bullets": [
                  "ใช้อาหารมีชีวิต เช่น **planktons และ artemia จาก inhouse เท่านั้น**"
                ]
              }
            ]
          },
          {
            "sub": "Commercial feed",
            "body": [
              {
                "bullets": [
                  "เลือก **โรงงานที่ได้รับการรับรอง (certificated plants)** เพื่อให้มั่นใจในความปลอดภัยและคุณภาพของอาหาร"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "C5 = Clean fomites (อุปกรณ์และสิ่งของที่เป็นพาหะ)",
        "source": "Aquaculture_Industry_Tech p.45",
        "body": [
          {
            "sub": "Sanitation",
            "body": [
              {
                "bullets": [
                  "รักษา good hygiene practices รวมถึงการ **ทำความสะอาดและฆ่าเชื้ออุปกรณ์ บ่อ และ fomites**"
                ]
              }
            ]
          },
          {
            "sub": "Separate equipment for individual pond",
            "body": [
              {
                "bullets": [
                  "**แยกอุปกรณ์ของแต่ละบ่อ** และใช้เครื่องมือ/วิธีที่เหมาะสมในการตรวจกุ้งประจำวันหรือจับกุ้ง เช่น **boots, hand sanitization, dip nets, transport containers และ vehicle**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "C6 = Clean personnel หรือ personal hygiene (คน)",
        "source": "Aquaculture_Industry_Tech p.46",
        "body": [
          {
            "sub": "Protective clothing",
            "body": [
              {
                "bullets": [
                  "คนงานควรใส่ชุดที่สะอาดและเป็น **farm-specific clothing** เพื่อลดการปนเปื้อนจากภายนอก"
                ]
              }
            ]
          },
          {
            "sub": "Personnel hygiene practices",
            "body": [
              {
                "bullets": [
                  "ก่อนเข้าบ่อ ต้องมั่นใจว่าพนักงาน **เปลี่ยนชุดใหม่ และทำ hand-foot disinfection**"
                ]
              }
            ]
          },
          {
            "sub": "Education and Training",
            "body": [
              {
                "bullets": [
                  "ทำให้มั่นใจว่าพนักงานฟาร์ม **ได้รับการอบรมเรื่อง biosecurity practices** และเข้าใจความสำคัญของการป้องกันโรค"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Monitors and plans (การเฝ้าระวังและแผนรับมือ)",
        "source": "Aquaculture_Industry_Tech p.47",
        "body": [
          {
            "sub": "Pond monitoring and shrimp testing",
            "body": [
              {
                "bullets": [
                  "**เฝ้าติดตามสุขภาพกุ้งอย่างสม่ำเสมอ**",
                  "มั่นใจว่า test protocols **ตรวจจับโรคได้ตั้งแต่ระยะแรก (detect disease early)**"
                ]
              }
            ]
          },
          {
            "sub": "Biosecurity monitoring",
            "body": [
              {
                "text": "สไลด์ขึ้นหัวข้อนี้ไว้เฉย ๆ **โดยไม่ได้อธิบายรายละเอียดใด ๆ**"
              }
            ]
          },
          {
            "sub": "Emergency shrimp plans",
            "body": [
              {
                "bullets": [
                  "มีแผนจัดการเมื่อเกิดการระบาด รวมถึง **protocol สำหรับการ culling และการจัดการบ่อที่รักษา รวมถึงบ่อข้างเคียงที่ติดเชื้อ**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Fish (ปลา): คุณค่าอาหารและความสูญเสียทางเศรษฐกิจ",
        "source": "Aquaculture_Industry_Tech p.48",
        "body": [
          {
            "text": "สไลด์เปิดหัวข้อฝั่งปลา ด้วยข้อความสั้น ๆ ว่าปลาให้ **High nutrition & Good source of protein** พร้อมภาพเนื้อปลาแล่และปลาปรุงสุก"
          },
          {
            "text": "แถวล่างเป็นภาพปลาในบ่อ ปลาตายลอยเต็มกระชัง และฟาร์มกระชัง โดยติดป้ายกำกับว่า **Economic loss**"
          },
          {
            "callout": "สไลด์นี้เป็นภาพนำเข้าสู่หัวข้อ ไม่มีข้อความบรรยายอื่นนอกจากสองวลีข้างต้น",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Fish culture: กรอบหัวข้อที่จะพูดถึง",
        "source": "Aquaculture_Industry_Tech p.49",
        "body": [
          {
            "bullets": [
              "**Fish farming: close, semi and open systems**",
              "**Risk factors**",
              "**Outbreak / Epidemic diseases**"
            ]
          },
          {
            "callout": "สไลด์ให้แค่หัวข้อ 3 บรรทัดนี้ ไม่ได้อธิบายว่าแต่ละระบบ (close/semi/open) ต่างกันอย่างไร หรือ risk factors มีอะไรบ้าง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Fish disease / Pathogens: สัดส่วนเชื้อก่อโรคในปลา",
        "source": "Aquaculture_Industry_Tech p.50",
        "body": [
          {
            "text": "แผนภูมิวงกลมแสดงสัดส่วนของเชื้อก่อโรคในปลา"
          },
          {
            "bullets": [
              "**Bacterial pathogen 55%**",
              "**Virus 23%**",
              "**Parasitic agents 19%**",
              "**Mycotic agents 3%**"
            ]
          },
          {
            "text": "ภาพประกอบด้านขวาแสดงรอยโรคในปลา เช่น ปลาที่มีรอยแผลบริเวณลำตัวและครีบ ปลาที่มีเลือดออกบริเวณปากและตา และปลาที่มีจุดเลือดออกกระจายทั้งตัว"
          },
          {
            "callout": "จำสัดส่วนให้ได้ว่า **แบคทีเรียเกินครึ่ง (55%)** เป็นสาเหตุหลักของโรคในปลา ตามข้อมูลในสไลด์นี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Prevention and control diseases (แนวทางป้องกันและควบคุมโรคในปลา)",
        "source": "Aquaculture_Industry_Tech p.51",
        "body": [
          {
            "bullets": [
              "**Farm managements**",
              "**Drugs and chemicals: Dose, type and time** (ต้องคำนึงถึงขนาดยา ชนิด และเวลา)",
              "**Vaccine**"
            ]
          },
          {
            "sub": "ตัวอย่างที่สไลด์ยกมา",
            "body": [
              {
                "bullets": [
                  "Chemical: **KmnO4** (ตามที่พิมพ์บนสไลด์) และ **Formalin**",
                  "Antibiotics: **Enrofloxacin** และ **Oxytetracyclin**"
                ]
              }
            ]
          },
          {
            "text": "มีภาพจานเพาะเชื้อพร้อมแผ่นยา ติดป้ายว่า **Antimicrobial Susceptibility Test** สื่อว่าการเลือกยาควรอิงผลทดสอบความไวต่อยา"
          }
        ]
      },
      {
        "heading": "Problems use of drugs and chemicals: เชื้อดื้อยา (Drug resistant bacteria)",
        "source": "Aquaculture_Industry_Tech p.52",
        "body": [
          {
            "text": "สไลด์แสดงโลโก้ **World Health Organization (WHO)**, **FAO** และ **World Organisation for Animal Health (Founded as OIE)** กำกับหัวข้อ แล้วอธิบายว่าเชื้อดื้อยาเกิดขึ้นอย่างไร ผ่านภาพ 4 ขั้น"
          },
          {
            "bullets": [
              "ขั้นที่ 1: เมื่อมีแบคทีเรียจำนวนมาก บางตัว **กลายพันธุ์ (mutated)** กลายเป็น antibiotic resistant strain",
              "ขั้นที่ 2: เมื่อใส่ยาปฏิชีวนะ **sensitive strains ถูกฆ่า** แต่ไม่มีผลต่อ antibiotic resistant strain",
              "ขั้นที่ 3: **antibiotic resistant strain จึงเติบโตและเพิ่มจำนวน** ได้",
              "ขั้นที่ 4: ยิ่งกว่านั้น เชื้อสามารถ **ถ่ายทอดความดื้อยาไปยังแบคทีเรียตัวอื่น** จนกลายเป็นกลุ่มเชื้อดื้อยา"
            ]
          }
        ]
      },
      {
        "heading": "Vaccine: นิยาม",
        "source": "Aquaculture_Industry_Tech p.53",
        "body": [
          {
            "text": "สไลด์นิยามว่า วัคซีนคือ **biological agents** ที่กระตุ้นให้เกิด immune response ต่อ **specific antigen** ซึ่งได้มาจากเชื้อก่อโรคติดเชื้อ (infectious disease-causing pathogen) โดยสไลด์ขีดเส้นใต้คำว่า biological agents และ specific antigen ไว้"
          },
          {
            "text": "ภาพประกอบเขียนว่า **VACCINATION นำไปสู่ ADAPTIVE IMMUNITY** โดยมี **MEMORY T-CELLS** และ **MEMORY B-CELLS**"
          }
        ]
      },
      {
        "heading": "Vaccine: Type (ภาพรวมชนิดวัคซีน และความสัมพันธ์ immunogenicity กับ tolerability)",
        "source": "Aquaculture_Industry_Tech p.54-55",
        "body": [
          {
            "sub": "ชนิดของวัคซีนที่แตกออกมาจากตัวเชื้อ (p.54)",
            "body": [
              {
                "bullets": [
                  "**Whole inactivated**",
                  "**Live attenuated**",
                  "**Synthetic peptides** (ในภาพเขียนลำดับกรดอะมิโนตัวอย่างว่า LPQPGGSYC)",
                  "**Recombinant subunit**",
                  "**DNA**",
                  "**Recombinant viral vectors**",
                  "**Recombinant bacterial vectors**",
                  "และอื่น ๆ (สไลด์เขียน Etc. ไว้ท้ายภาพ)"
                ]
              }
            ]
          },
          {
            "sub": "แกน Immunogenicity เทียบกับ Tolerability (p.55)",
            "body": [
              {
                "text": "กราฟแสดงว่า ยิ่งใกล้ตัวเชื้อจริงยิ่ง **immunogenicity สูง** แต่ **tolerability ต่ำ** และเมื่อย่อยเป็นชิ้นส่วนเล็กลง immunogenicity จะลดลงแต่ tolerability สูงขึ้น เรียงลำดับดังนี้"
              },
              {
                "bullets": [
                  "**Native pathogen** (immunogenicity สูงสุด)",
                  "**Replicating** = live attenuated pathogen",
                  "**Non-replicating** = whole inactivated pathogen",
                  "**Subunit** = toxoids, split virus, fragments of pathogens",
                  "**Purified antigens** = recombinant proteins (tolerability สูงสุด)"
                ]
              },
              {
                "callout": "สไลด์ใส่เครื่องหมายดอกจันไว้ที่คำว่า Immunogenicity และ Tolerability แต่ไม่ได้เขียนเชิงอรรถอธิบายไว้",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Vaccine: Type 1-5 และวิธีผลิตของแต่ละชนิด",
        "source": "Aquaculture_Industry_Tech p.56-60",
        "body": [
          {
            "sub": "1. Live-attenuated Vaccine (p.56)",
            "body": [
              {
                "text": "เริ่มจากนำเชื้อไปติดในเซลล์ที่เลี้ยงในอาหารเลี้ยงเชื้อ (artificial culture) ให้เชื้อ **replicate** แล้วแยกเชื้อออกมาเพาะซ้ำหลายรอบ (repeat several times) ทุกครั้งที่ replicate เชื้อจะ **สูญเสียความสามารถในการก่อโรคในปลา** จนได้ live-attenuated antigen ที่ replicate ในปลาได้น้อยลง"
              }
            ]
          },
          {
            "sub": "2. Inactivated Vaccine (p.57)",
            "body": [
              {
                "text": "นำเชื้อมา **treat ด้วยความร้อนหรือสารเคมี (heat or chemicals)** เพื่อทำให้หมดความสามารถในการก่อโรค ผลลัพธ์คือเชื้อที่ **inactivated แต่ยังคง immunogenic**"
              }
            ]
          },
          {
            "sub": "3. Subunit Vaccine (p.58)",
            "body": [
              {
                "text": "วัคซีนที่ได้จากการ **แยกทางกายภาพและ/หรือ fractionation ของเชื้อทั้งตัวให้เป็นชิ้นส่วนย่อย** โดยแยกได้เป็น **split antigen** และ **subunit/purified antigen** ผ่านกระบวนการ pathogen fragmentation"
              }
            ]
          },
          {
            "sub": "4. Recombinant protein Vaccine (p.59)",
            "body": [
              {
                "text": "แยกและผลิตซ้ำโปรตีนที่อยู่ **บนผิวของเชื้อ (viral surface antigen)** โดยใช้ culture cell หรือ yeast จากนั้นนำโปรตีนที่ purified แล้วมา **ผสมกับ adjuvant** เพื่อทำเป็นวัคซีน"
              },
              {
                "bullets": [
                  "ขั้นตอนตามภาพ: sequence gene ที่เข้ารหัส antigen แล้ว **insert gene เข้า expression system genome** (สไลด์ระบุเชิงอรรถว่า yeast or insect cell)",
                  "เกิด antigen protein expression แล้วจึง **purify recombinant protein แล้วผสม adjuvant** หรือ **ส่งใน vector (plasmid)**"
                ]
              }
            ]
          },
          {
            "sub": "5. DNA Vaccine (p.60)",
            "body": [
              {
                "bullets": [
                  "DNA vaccine คือวัคซีนที่บรรจุ **DNA ที่เข้ารหัสโปรตีน (antigens) จำเพาะของเชื้อ**",
                  "**ฉีด DNA เข้าเซลล์**",
                  "เซลล์ใช้ DNA นั้น **สังเคราะห์โปรตีน**",
                  "เพราะโปรตีนเหล่านี้ถูกมองว่าเป็นสิ่งแปลกปลอม เมื่อถูก process โดย host cells และแสดงบนผิวเซลล์ **ระบบภูมิคุ้มกันจึงถูกกระตุ้น**",
                  "และนำไปสู่การเกิด immune responses"
                ]
              },
              {
                "text": "ภาพด้านขวาแสดงขั้นตอนการผลิต คือ นำ **viral gene** รวมกับ **expression plasmid** ด้วย recombinant DNA technology ได้ plasmid with foreign gene แล้ว **transform เข้าแบคทีเรีย** ให้ plasmid DNA เพิ่มจำนวน แล้ว isolate plasmid DNA เก็บใส่ vial พร้อมใช้"
              }
            ]
          }
        ]
      },
      {
        "heading": "Fish vaccination: ช่องทางการให้วัคซีน 3 แบบ",
        "source": "Aquaculture_Industry_Tech p.61",
        "body": [
          {
            "bullets": [
              "**Injection vaccine: IP/IM** (ฉีดเข้าช่องท้องหรือกล้ามเนื้อ) ภาพประกอบมีไอคอนคนหลายคน ถุงเงิน และนาฬิกา สื่อถึงแรงงาน ค่าใช้จ่าย และเวลา",
              "**Oral vaccine** (ผสมอาหาร) ภาพในสไลด์กำกับว่ามี **Antigen degradation** เกิดขึ้น",
              "**Immersion vaccine** (แช่)"
            ]
          }
        ]
      },
      {
        "heading": "Fish vaccination: ข้อดีและข้อเสียของแต่ละวิธี",
        "source": "Aquaculture_Industry_Tech p.62",
        "body": [
          {
            "sub": "Injection (Intramuscular IM, Intraperitoneal IP)",
            "body": [
              {
                "bullets": [
                  "Advantage: **High efficacy**, **Long protection time**",
                  "Disadvantage: ปลาต้องมีขนาด **มากกว่า 10 g.**, **Waste of Labor cost and time**"
                ]
              }
            ]
          },
          {
            "sub": "Immersion",
            "body": [
              {
                "bullets": [
                  "Advantage: ใช้กับ **ปลาเล็ก** ได้, **Mass vaccination**, **Save labor cost and time**",
                  "Disadvantage: **Low efficacy**, **Poor antigen delivery**, **Short protection time**"
                ]
              }
            ]
          },
          {
            "sub": "Oral",
            "body": [
              {
                "bullets": [
                  "Advantage: ใช้ได้ **ทุกอายุและทุกขนาด**, **Easy to use and mass vaccination**, **Save labor cost and time**",
                  "Disadvantage: **Low efficacy**, **Antigen degradation ที่ทางเดินอาหาร (GI)**, **Short protection time**"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่มักถูกถาม คือเกณฑ์ **ขนาดปลามากกว่า 10 g. สำหรับการฉีด** และการที่ทั้ง immersion และ oral ให้ **short protection time** เหมือนกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Vaccine: ส่วนประกอบอื่นนอกเหนือจาก antigen",
        "source": "Aquaculture_Industry_Tech p.63",
        "body": [
          {
            "text": "สไลด์ระบุว่า นอกจาก **Antigen** แล้ว วัคซีนยังมีส่วนประกอบอื่นดังนี้"
          },
          {
            "bullets": [
              "**ADJUVANTS**: เพิ่ม (enhance) การตอบสนองทางภูมิคุ้มกัน",
              "**ADDITIVES / STABILISERS**: ทำให้วัคซีนคงตัวและปกป้องวัคซีนระหว่างการเก็บรักษา",
              "**PRESERVATIVES**: ป้องกันการปนเปื้อนจากแบคทีเรียหรือเชื้อรา",
              "**TRACE COMPONENTS**: สารตกค้างจากกระบวนการผลิต",
              "**WATER**: ส่วนประกอบทั้งหมดใช้ในปริมาณน้อยมาก และแขวนลอยอยู่ในน้ำ"
            ]
          },
          {
            "text": "สไลด์ปิดท้ายว่า รายการส่วนประกอบทั้งหมดของวัคซีนหาได้จาก **package leaflet และ summary of product characteristics** ของวัคซีนนั้น"
          }
        ]
      },
      {
        "heading": "Adjuvant: Functions (บทบาทของ adjuvant)",
        "source": "Aquaculture_Industry_Tech p.64",
        "body": [
          {
            "text": "แผนภาพ Role of Adjuvant แตกออกเป็น 8 บทบาท"
          },
          {
            "bullets": [
              "**เพิ่ม immunogenicity ของ antigen ที่อ่อน (weak antigens)**",
              "**เพิ่มความเร็วและระยะเวลาของ immune response**",
              "**เสริมความแรงของ immune response**",
              "**ประหยัดต้นทุน โดยลดขนาด antigen ที่ต้องใช้**",
              "**เพิ่ม mucosal immunity**",
              "**กระตุ้น cellular immunity**",
              "**เพิ่ม affinity ระหว่าง antigen กับ antibody**",
              "**ลดการแข่งขันกันของ antigen ใน combination vaccines**"
            ]
          }
        ]
      },
      {
        "heading": "Adjuvant: Types (ชนิดของ adjuvant และบทบาท)",
        "source": "Aquaculture_Industry_Tech p.65",
        "body": [
          {
            "sub": "1. Mineral adjuvants",
            "body": [
              {
                "bullets": [
                  "increase **IgE และ IgG1**",
                  "เปลี่ยนสัดส่วน **IgG1 : IgG2α**",
                  "นำไปสู่ immune response ทาง **Th1 pathway**"
                ]
              }
            ]
          },
          {
            "sub": "2. Emulsion adjuvants",
            "body": [
              {
                "bullets": [
                  "เพิ่ม **phagocytosis และ pinocytosis**",
                  "เพิ่ม **APC antigen uptake**",
                  "ส่งผลให้ **จำนวน APCs ใน DLN เพิ่มขึ้น**"
                ]
              }
            ]
          },
          {
            "sub": "3. Polymeric adjuvants",
            "body": [
              {
                "bullets": [
                  "เพิ่มประสิทธิภาพของวัคซีน โดยนำเสนอ antigen ในลักษณะ **immune boosters**",
                  "ปรับปรุงการนำส่ง antigen และ **ลดจำนวนโดสกระตุ้นซ้ำที่ต้องใช้**"
                ]
              }
            ]
          },
          {
            "sub": "4. Saponins",
            "body": [
              {
                "bullets": [
                  "กระตุ้น cellular responses และ **induce CTL**",
                  "สร้าง **cytokines type 1 (interleukin และ interferon-γ)** และ **IgG2a isotype antibodies**"
                ]
              }
            ]
          },
          {
            "sub": "5. Derivatives of the complement system",
            "body": [
              {
                "bullets": [
                  "**กระตุ้น antibody responses**"
                ]
              }
            ]
          },
          {
            "sub": "6. Cytokine",
            "body": [
              {
                "bullets": [
                  "เสริม **cellular immune responses** และดูเหมือนจะเปลี่ยนไปทาง **type 1 responses**"
                ]
              }
            ]
          },
          {
            "sub": "7. Adjuvants taken from bacteria",
            "body": [
              {
                "bullets": [
                  "ฤทธิ์ขึ้นกับการกระตุ้น **TLR-like receptors** ผ่าน hazard signals ของระบบป้องกันของ host"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เขียน Etc. ไว้ท้ายตาราง แปลว่ายังมี adjuvant ชนิดอื่นอีกที่ไม่ได้ลงรายละเอียดไว้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Adjuvant: กลไกการทำงาน",
        "source": "Aquaculture_Industry_Tech p.66",
        "body": [
          {
            "text": "แผนภาพลำดับเหตุการณ์หลังฉีด **Adjuvant ร่วมกับ Antigen**"
          },
          {
            "bullets": [
              "เกิด **Depot-protective effect** บริเวณที่ฉีด",
              "antigen ถูกจับเข้า **phagosome** แล้วเกิด **antigen processing**",
              "มีการ **แสดง antigen ให้เซลล์ภูมิคุ้มกัน (immune cell presentation)** ต่อ **Naive T cells** ร่วมกับ **co-stimulatory molecules** (ในภาพยกตัวอย่าง CD80/86-CD28 และ CD40-CD40L)",
              "เกิด **Inflammasome activation** และการ **expression ของ cytokines และ chemokines** นำไปสู่ production of cytokines and chemokines",
              "เส้นทาง **Th1 cell** นำไปสู่ **Cellular response** ได้แก่ Macrophage, CTL และ NK",
              "เส้นทาง **Th2 cell** นำไปสู่ **Humoral response** ผ่าน **B cell**"
            ]
          }
        ]
      },
      {
        "heading": "Nanotechnology: Adjuvant and delivery system",
        "source": "Aquaculture_Industry_Tech p.67",
        "body": [
          {
            "text": "แผนภาพแสดงอนุภาคนาโนที่บรรจุ **Therapeutic agents** ได้แก่ **Conventional drugs, Biopharmaceuticals และ Antigen (peptide, protein, nucleic acid)**"
          },
          {
            "sub": "องค์ประกอบที่ปรับแต่งได้บนอนุภาค",
            "body": [
              {
                "bullets": [
                  "**Targeting ligands**: antibodies, proteins/peptides, nucleic acids (เช่น aptamer), small molecules, polymers",
                  "**Surface chemistry**: surface charge, surface functionality (เช่น -NH2, -OCH3, -COOH), hydrophobicity"
                ]
              }
            ]
          },
          {
            "sub": "Organic nanoparticles",
            "body": [
              {
                "bullets": [
                  "**Viral vectors**: Retrovirus, Adenovirus, Adeno-associated virus",
                  "**Non-viral vectors**: Polymeric (chitosan, PLGA), Lipid nanoparticle, Liposomes, Nanoemulsion, Solid lipid nanoparticles (SLN), Nanostructured lipid carriers (NLC)"
                ]
              }
            ]
          },
          {
            "sub": "Inorganic nanoparticles",
            "body": [
              {
                "bullets": [
                  "**Quantum dots**",
                  "**Gold nanoparticles**",
                  "**Silver nanoparticles**",
                  "**Superparamagnetic iron oxide NP (SPION)**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ขนาดของ nanoparticle เทียบกับขนาดเชื้อก่อโรค",
        "source": "Aquaculture_Industry_Tech p.68",
        "body": [
          {
            "text": "กราฟเปรียบเทียบขนาด โดยแถบด้านบนคือ **Pathogens** เรียงจากเล็กไปใหญ่ ได้แก่ **soluble antigens, viruses, bacteria และ fungi (yeast) and protozoans** ส่วนแถบด้านล่างคือ **Nanoparticle** โดยแกนเป็นสเกล 1, 10, 100, 1000, 10,000 ถึง 100,000"
          },
          {
            "sub": "ขนาดของอนุภาคนาโนที่สไลด์ระบุตัวเลขไว้",
            "body": [
              {
                "bullets": [
                  "**Polymeric nanoparticles (2-1000 nm.)**",
                  "**Inorganic nanoparticles (2-1000 nm.)**",
                  "**Nanoliposome (100-400 nm.)**",
                  "**ISCOMs (40 nm.)**",
                  "**Viral like particles (20-800 nm.)**",
                  "**Nanoemulsion (50-600 nm.)**"
                ]
              }
            ]
          },
          {
            "callout": "ฝั่ง pathogens ไม่มีตัวเลขกำกับปลายแถบ อ่านช่วงขนาดที่แน่นอนของ viruses, bacteria หรือ fungi จากสไลด์ไม่ได้ จึงไม่ควรจำเป็นตัวเลข",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ตัวอย่างงานวิจัย: nanovaccine แบบแช่ต้านโรค columnaris",
        "source": "Aquaculture_Industry_Tech p.69",
        "body": [
          {
            "text": "สไลด์หัวเรื่องงานวิจัย ชื่อว่า **Development of Pathogen-like mucoadhesive immersion nanovaccine against columnaris disease in fish**"
          },
          {
            "text": "ภาพประกอบด้านล่างแสดงอนุภาคขนาดนาโนเกาะอยู่บนชั้นเยื่อเมือกของผิวปลา สอดคล้องกับคำว่า **mucoadhesive** ในชื่อเรื่อง"
          },
          {
            "callout": "สไลด์นี้เป็นแค่หน้าชื่อเรื่อง ยังไม่ได้ให้ผลการทดลองหรือรายละเอียดวิธีการใด ๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Columnaris disease",
        "source": "Aquaculture_Industry_Tech p.70",
        "body": [
          {
            "text": "โรค columnaris มี **การกระจายทั่วโลกในแหล่งน้ำจืด (a worldwide distribution in freshwater sources)**"
          },
          {
            "sub": "เชื้อสาเหตุ",
            "body": [
              {
                "text": "**Flavobacterium columnare** ลักษณะ **Gram negative, Long rod shape**"
              }
            ]
          },
          {
            "sub": "Lesions",
            "body": [
              {
                "bullets": [
                  "**skin discoloration / damage** (สีผิวเปลี่ยนหรือผิวหนังเสียหาย)",
                  "**fin / gill rot and necrosis** (ครีบและเหงือกกร่อนและตาย)",
                  "**'saddle back' lesion**"
                ]
              }
            ]
          },
          {
            "callout": "**Mortality rate: 30-100%** ตามที่สไลด์เน้นไว้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Pathogenesis ของ columnaris disease",
        "source": "Aquaculture_Industry_Tech p.71",
        "body": [
          {
            "sub": "Colonization",
            "body": [
              {
                "bullets": [
                  "Attraction / Adhesion / Aggregation"
                ]
              }
            ]
          },
          {
            "sub": "Exotoxins, bacteriocins and endotoxins",
            "body": [
              {
                "bullets": [
                  "**chondroitin AC lyase / protease**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์อ้างอิง Bernardet et al., 2006; Declercq et al., 2013, 2015 และแสดงภาพจุลทรรศน์กับภาพ SEM ของแบคทีเรียเกาะบนเหงือก (scale bar 5 µm) แต่ไม่ได้เขียนอธิบายรายละเอียดของแต่ละภาพไว้"
          },
          {
            "callout": "สไลด์ให้มาแค่ 2 หัวข้อใหญ่ คือ colonization กับกลุ่มสารพิษ ไม่ได้อธิบายกลไกลึกกว่านี้ว่า chondroitin AC lyase ทำงานอย่างไร",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การป้องกันและควบคุมโรค columnaris (Prevention and control)",
        "source": "Aquaculture_Industry_Tech p.72",
        "body": [
          {
            "bullets": [
              "Farm managements",
              "Drugs and chemicals",
              "Vaccine"
            ]
          },
          {
            "sub": "Vaccine แบ่งเป็น 2 แบบ",
            "body": [
              {
                "bullets": [
                  "**Formalin killed vaccine + adjuvants** ให้ได้ 3 ทาง คือ Intraperitoneal (Grabowski et al., 2004), Immersion (Grabowski et al., 2004; Leal et al., 2010) และ oral (Leal et al., 2010)",
                  "**Attenuated live vaccine** แบบ Immersion เป็น licensed vaccine (By Intervet/Schering-Plough Animal Health, Shoemaker et al., 2005, 2011)"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างที่แสดงในภาพประกอบ",
            "body": [
              {
                "bullets": [
                  "Antibiotics: **Enrofloxacin**, **Oxytetracyclin**",
                  "Chemical: **KMnO4**, **Formalin**",
                  "Vaccine: **Aquavac-col**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Immersion vaccine: ข้อดีและข้อเสีย",
        "source": "Aquaculture_Industry_Tech p.73",
        "body": [
          {
            "sub": "Advantage",
            "body": [
              {
                "bullets": [
                  "Suitable for mass vaccination",
                  "Reduced stress and Lower labor costs"
                ]
              }
            ]
          },
          {
            "sub": "Disadvantage",
            "body": [
              {
                "bullets": [
                  "**The vaccine cannot be delivered into the fish**",
                  "The large amount of vaccine required",
                  "Lower level of protection and short duration of immunity"
                ]
              }
            ]
          },
          {
            "callout": "ข้อเสียข้อแรกคือโจทย์ตั้งต้นของทั้งงานวิจัยในสไลด์ถัดไป จำไว้ว่าปัญหาหลักของ immersion vaccine คือวัคซีนเข้าตัวปลาไม่ได้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Immersion vaccine development: แก้ปัญหาด้วยนาโนเทคโนโลยี",
        "source": "Aquaculture_Industry_Tech p.74",
        "body": [
          {
            "bullets": [
              "The vaccine cannot be delivered into the fish",
              "Problem solve: Knowledges and Technology",
              "**Nanotechnology**"
            ]
          },
          {
            "text": "สไลด์แสดงโลโก้ NANOTEC (NSTDA) และ CUVET (Veterinary Science, Chulalongkorn University) เป็นผู้ร่วมงาน"
          },
          {
            "text": "ด้านล่างยกตัวอย่างเทียบเคียงว่า **Human vaccine development without injection** ก็มีอยู่แล้ว โดยมีภาพวัคซีน intranasal COVID-19, แบบพ่นทางจมูก/ปาก และแบบแปะผิวหนัง"
          }
        ]
      },
      {
        "heading": "Cationic polymer และ electrostatic interaction",
        "source": "Aquaculture_Industry_Tech p.75",
        "body": [
          {
            "text": "หลักการที่ทำให้อนุภาคเกาะตัวปลาได้คือ **Electrostatic interactions**"
          },
          {
            "bullets": [
              "**cationic polymer** มีประจุบวก (+)",
              "**mucopolysaccharide** ที่ผิว/เมือกปลามีประจุลบ (-)",
              "ประจุบวกกับประจุลบดึงดูดกัน อนุภาคจึงไปเกาะที่ตัวปลา"
            ]
          }
        ]
      },
      {
        "heading": "Immersion nanovaccine: เป้าหมายของวัคซีนแช่ในอุดมคติ",
        "source": "Aquaculture_Industry_Tech p.76",
        "body": [
          {
            "text": "**Ideal killed vaccine: Mucoadhesive nanoparticle**"
          },
          {
            "text": "คุณสมบัติที่ต้องการ: **High efficacy / ready and easy to use / suitable price**"
          },
          {
            "text": "รูปแบบการให้คือ Bath / immersion vaccine โดยอนุภาคนาโนจะไปเกาะตามตัวปลา (สไลด์วาดเป็นจุดกระจายบนลำตัวปลา)"
          }
        ]
      },
      {
        "heading": "ข้อดีของ nanovaccine 5 ข้อ",
        "source": "Aquaculture_Industry_Tech p.77",
        "body": [
          {
            "bullets": [
              "**Protection of antigen**",
              "**Site specific delivery of antigens**",
              "**Enhanced immune response**",
              "**Enhanced bioavailability**",
              "**Reduced side effects and dose**"
            ]
          },
          {
            "text": "สไลด์สรุปว่า Nanovaccine ทำหน้าที่ 2 อย่างพร้อมกัน คือเป็น **Adjuvant** และเป็น **Delivery system**"
          }
        ]
      },
      {
        "heading": "ขั้นตอนการพัฒนา nanovaccine และเกณฑ์ characterization",
        "source": "Aquaculture_Industry_Tech p.78",
        "body": [
          {
            "sub": "ลำดับขั้นตอน",
            "body": [
              {
                "text": "Selection of Antigen and Adjuvant ไป Nanoparticle Design ไป Formulation Optimization ไป Characterization and Stability Testing ไป Preclinical Studies and Clinical Trials"
              }
            ]
          },
          {
            "sub": "Characterization ด้วย Dynamic light scattering (DLS) / Zetasizer",
            "body": [
              {
                "bullets": [
                  "Size: **< 500 nm**",
                  "Zeta potential: **Does not approach 0 mV**",
                  "Polydispersity index (PDI): **< 0.3**"
                ]
              }
            ]
          },
          {
            "sub": "Biomimetic nanovaccines (ภาพประกอบ)",
            "body": [
              {
                "text": "Sources: Liposome, Protein, Virus, Bacteria, Cell, Exosome"
              },
              {
                "text": "Components: Antibodies, Adjuvants & Antigens"
              },
              {
                "text": "Applications: strong immune responses against various diseases / multifunctional carrier for antigens, adjuvants & therapeutic cargos / prolonged blood circulation & specific targeting"
              }
            ]
          },
          {
            "callout": "3 ตัวเลขนี้ (size < 500 nm, zeta ไม่ใกล้ 0 mV, PDI < 0.3) เป็นเกณฑ์ที่เอาไปใช้อ่านตารางในสไลด์หน้า 80 ได้เลย",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Methods: 5 ขั้นตอนของงานวิจัยนาโนวัคซีน",
        "source": "Aquaculture_Industry_Tech p.79",
        "body": [
          {
            "sub": "1. Bacterial isolation and Preparation",
            "body": [
              {
                "bullets": [
                  "Microbiology",
                  "Molecular technique",
                  "Diagnostic skill (Veterinary science)"
                ]
              }
            ]
          },
          {
            "sub": "2. Vaccine formulation",
            "body": [
              {
                "bullets": [
                  "**Nanotechnology*** (สไลด์ทำดาวกำกับไว้)",
                  "Vaccinology",
                  "Pathogenesis of disease"
                ]
              },
              {
                "text": "แผนภาพอธิบายว่า **Negatively charged bacteria (inactivated Flavobacterium columnare)** จับกับ **Cationic polymer** ด้วย electrostatic complexation กลายเป็น **Mucoadhesive nanoparticles**"
              },
              {
                "text": "อีกเส้นทางหนึ่งคือ Whole cell ไป Break cell ไป Nanoemulsion แล้ว coated with polymer ได้เป็น nanoemulsion coated"
              }
            ]
          },
          {
            "sub": "3. Physicochemical characterization",
            "body": [
              {
                "bullets": [
                  "Size shape and Zeta potential",
                  "Mucoadhesive and acid tolerance properties"
                ]
              }
            ]
          },
          {
            "sub": "4. Efficacy test and immunological assay",
            "body": [
              {
                "bullets": [
                  "Vaccination and challenge test",
                  "Data record: **RPS**",
                  "Immunological assay: **ELISA**, **Bactericidal assay**",
                  "Histology"
                ]
              }
            ]
          },
          {
            "sub": "5. Farm vaccination and scale-up vaccine production",
            "body": [
              {
                "bullets": [
                  "Vaccination",
                  "Data record: **survival rate, ADG**",
                  "Statistical assessment",
                  "Data analysis"
                ]
              }
            ]
          },
          {
            "text": "แผนผังมีลูกศรวนกลับ: ถ้า **Vaccine was not effective** ให้ย้อนกลับไปขั้นตอนที่ 2 (vaccine formulation) ใหม่ ถ้าได้ **Effective vaccine** จึงไปขั้นตอนที่ 5"
          }
        ]
      },
      {
        "heading": "Physicochemical characterization ของแต่ละสูตรวัคซีน",
        "source": "Aquaculture_Industry_Tech p.80",
        "body": [
          {
            "text": "กระบวนการคือ **Formalin-killed F. columnare** ผ่านการ **Sonicated** แล้วเคลือบด้วย **Mucoadhesive biopolymer**"
          },
          {
            "sub": "ตารางค่าที่วัดได้ (Average diameter nm / Zeta potential mV / PDI)",
            "body": [
              {
                "bullets": [
                  "Whole cell bacteria (WC): **2,272 ± 212** / **-10.7 ± 1.2** / **5.29**",
                  "Sonicated bacteria: **586 ± 41** / **-19.3 ± 1.7** / **5.80**",
                  "Bacteria coated (CS): **698 ± 52** / **12.9 ± 2.4** / **0.41**",
                  "Nanoemulsion (NE): **188 ± 2.81** / **-34.4 ± 1.9** / **0.15**",
                  "Nanoemulsion coated (CS-NE: hybrid nanovaccine): **296 ± 2.27** / **29.04 ± 3.5** / **0.19**"
                ]
              }
            ]
          },
          {
            "callout": "สังเกตว่าสูตรที่ถูกเคลือบด้วย polymer (CS และ CS-NE) เปลี่ยนจากประจุลบเป็น **ประจุบวก** ซึ่งเป็นเงื่อนไขที่ทำให้เกาะเมือกปลาได้ตามหลักในสไลด์หน้า 75 สไลด์ไฮไลต์แถว CS-NE ไว้ด้วยสีแดง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Mucoadhesive property และ permeability test",
        "source": "Aquaculture_Industry_Tech p.81",
        "body": [
          {
            "text": "การทดสอบเปรียบเทียบ 5 กลุ่ม คือ Control, WC, CS, NE และ CS-NE"
          },
          {
            "sub": "(a) กราฟแท่ง Fold increase in mean fluorescence intensity (MFI)",
            "body": [
              {
                "text": "แท่งของ **CS สูงที่สุด** รองลงมาคือ **CS-NE** ส่วน WC และ NE สูงกว่า control เพียงเล็กน้อย มีเครื่องหมาย *** กำกับความแตกต่างหลายคู่ และมี ns หนึ่งคู่ สไลด์กรอบสีแดงเน้นที่ **CS-NE**"
              }
            ]
          },
          {
            "sub": "(b) ภาพ fluorescence ของเหงือกทั้งชิ้น",
            "body": [
              {
                "text": "เรียงเป็น CS-NE, NE, CS, WC, Control พร้อม heat scale จาก 20.45 ถึง 2.5e+003 กลุ่ม CS-NE และ CS ให้สัญญาณเข้ม (โซนสีแดง) มากกว่ากลุ่มอื่น"
              }
            ]
          },
          {
            "sub": "(c) ภาพ Brightfield และ DAPI ของ gill filament",
            "body": [
              {
                "text": "ในแถว DAPI กลุ่ม **CS-NE** เห็นสัญญาณเรืองแสงชัดที่สุดตลอดความยาวของ filament รองลงมาคือ CS ส่วน Control, WC และ NE แทบไม่เห็นสัญญาณ"
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนสรุปเป็นข้อความว่าอนุภาคชนิดใดดีที่สุด มีเพียงกรอบแดงเน้นที่ CS-NE เท่านั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Efficacy test (Laboratory trial)",
        "source": "Aquaculture_Industry_Tech p.82",
        "body": [
          {
            "text": "ทดสอบ 4 ช่วงเวลาหลังฉีดวัคซีน คือ **30, 60, 90 และ 120 days post vaccination** แล้ว challenge และติดตาม survival rate ต่ออีก 14 วัน (แกน x = Day after challenge 0 ถึง 14)"
          },
          {
            "sub": "กลุ่มทดลอง 4 กลุ่ม",
            "body": [
              {
                "bullets": [
                  "Control (เส้นสีดำ)",
                  "Formalin Killed vaccine (WC) (เส้นสีเขียว)",
                  "**Nanovaccine (CS-NE)** (เส้นสีแดง)",
                  "Polymer (Blank) (เส้นสีน้ำเงิน)"
                ]
              }
            ]
          },
          {
            "text": "ทั้ง 4 ช่วงเวลา เส้นของ **Nanovaccine (CS-NE) อยู่สูงสุดเสมอ** ส่วนที่ 30 และ 60 วัน Formalin killed vaccine (WC) ยังสูงกว่า control และ polymer อยู่บ้าง แต่ที่ 90 และ 120 วัน เส้นของ WC ลงมาทับกลุ่ม control และ polymer"
          },
          {
            "callout": "กราฟไม่มีตัวเลขกำกับบนเส้น จึงจดได้เฉพาะลำดับและแนวโน้ม ไม่ควรจำเป็นตัวเลขเปอร์เซ็นต์จากกราฟนี้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การให้ immersion nanovaccine จริงในฟาร์ม (ภาพขั้นตอน)",
        "source": "Aquaculture_Industry_Tech p.83",
        "body": [
          {
            "text": "สไลด์นี้เป็นภาพถ่ายล้วน ไม่มีข้อความอธิบาย แสดงลำดับตั้งแต่ขวดวัคซีน การเทวัคซีนผสมลงในภาชนะ การเทลงบ่อ/กระชังที่มีลูกปลา และการให้อากาศระหว่างแช่"
          },
          {
            "text": "ในภาพมีเครื่องวัด DO (EcoSense DO200A) แสดงค่า **6.17** และ **28.5** ขณะทำการแช่วัคซีน แต่สไลด์ไม่ได้เขียนกำกับว่าเป็นค่าอะไรหรือหน่วยใด"
          },
          {
            "callout": "สไลด์ไม่ได้บอกโปรโตคอลตัวเลข เช่น ความเข้มข้นวัคซีน ระยะเวลาแช่ หรือความหนาแน่นปลา",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Field test ของ Flavobacterium nanovaccine",
        "source": "Aquaculture_Industry_Tech p.84",
        "body": [
          {
            "sub": "ผลที่เขียนเป็นข้อความ",
            "body": [
              {
                "bullets": [
                  "เมื่อเกิด columnaris disease ในฟาร์ม survival rate ของปลาที่ได้วัคซีนและไม่ได้วัคซีน เท่ากับ **86%** และ **52%** ตามลำดับ",
                  "เมื่อสุ่มปลาไป challenge กับ F. columnare ในห้องปฏิบัติการ survival rate ของปลาที่ได้วัคซีนและไม่ได้วัคซีน เท่ากับ **73%** และ **32%** ตามลำดับ"
                ]
              }
            ]
          },
          {
            "sub": "ตารางผลรายฟาร์ม (Survival rate Control / Vaccine / RPS)",
            "body": [
              {
                "bullets": [
                  "ฟาร์ม 1: 20.00 / 66.67 / 58.34",
                  "ฟาร์ม 2: 28.00 / 52.00 / 33.33",
                  "ฟาร์ม 3: 37.14 / 85.71 / 77.27",
                  "ฟาร์ม 4: 37.14 / 77.14 / 63.63",
                  "ฟาร์ม 5: 37.14 / 85.71 / 77.27",
                  "**Average: 31.88 / 73.45 / 61.97**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Efficacy test (field): ฟาร์มปกติเทียบฟาร์มที่มีการระบาด",
        "source": "Aquaculture_Industry_Tech p.85",
        "body": [
          {
            "sub": "Farm: Normal",
            "body": [
              {
                "bullets": [
                  "Vaccinated fish: survival rate **96%**",
                  "Non-vaccinated fish: survival rate **85%**"
                ]
              }
            ]
          },
          {
            "sub": "Farm: Disease outbreak",
            "body": [
              {
                "bullets": [
                  "Vaccinated fish: survival rate **77%**",
                  "Non-vaccinated fish: survival rate **38%**"
                ]
              }
            ]
          },
          {
            "callout": "ในฟาร์มปกติส่วนต่างมีแค่ราว 11% แต่ในฟาร์มที่มีการระบาดส่วนต่างกว้างขึ้นมาก (77 เทียบ 38) นี่คือจุดที่มักถูกถามว่าเห็นประโยชน์วัคซีนชัดตอนไหน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ตารางรวม Experimental nanovaccines for tilapia",
        "source": "Aquaculture_Industry_Tech p.86",
        "body": [
          {
            "text": "ตารางเรียงตาม Pathogen / Nanoparticle / Route of Delivery / Relative Percentage Survival (%) โดยมีเครื่องหมายดอกจันสีแดงกำกับบางแถว (สไลด์ไม่ได้อธิบายว่าดอกจันแปลว่าอะไร)"
          },
          {
            "sub": "กลุ่มแบคทีเรีย",
            "body": [
              {
                "bullets": [
                  "**Flavobacterium columnare** / Chitosan-coated mucoadhesive / **Immersion** / RPS 78%, 85% และ 72% ตามลำดับ (ตัวเลขตัวแรกพิมพ์เบลอ อาจเป็น 79%)",
                  "Flavobacterium columnare / Alginate / Oral / **No difference between vaccinated and unvaccinated fish**",
                  "**Aeromonas veronii** / Chitosan-coated mucoadhesive nanovaccine / Immersion / **75%**",
                  "**Francisella orientalis** / Cetyltrimethylammonium bromide / Immersion / **Not determined**"
                ]
              }
            ]
          },
          {
            "sub": "Francisella orientalis (Fo) และ/หรือ Flavobacterium columnare (For), Cetyltrimethylammonium bromide, Immersion",
            "body": [
              {
                "bullets": [
                  "ปลาที่ได้วัคซีน Fo, For หรือ bivalent แล้ว challenge ด้วย **Fo** ได้ **62.5%, 6.25% และ 25%** ตามลำดับ",
                  "เมื่อ challenge ด้วย **For** ได้ RPS **5.56%, 50% และ 38.9%** สำหรับกลุ่ม Fo, For และ bivalent mucoadhesive nanovaccine ตามลำดับ",
                  "เมื่อ co-infection ด้วย mixed antigens (Fo และ For) ได้ RPS **20%, 25% และ 55%** สำหรับกลุ่ม Fo, For และ bivalent ตามลำดับ"
                ]
              }
            ]
          },
          {
            "sub": "Streptococcus agalactiae",
            "body": [
              {
                "bullets": [
                  "Nano clay, halloysite nanotubes (HNTs) แบบ HNT-Chitosan; HNT-APTES; และ HNT-APTES-Chitosan / Oral / **RPS 75.0 ± 10.8%** เมื่อ experimentally infected ด้วย **serotype III**",
                  "Poly [(methyl methacrylate)-co-(methyl acrylate)-co-(methacrylic acid)]-poly(d,l-lactide-co-glycolide) (PMMMA-PLGA) / Oral / **100%**",
                  "Cationic-based nanoemulsion containing bile salts and coated by chitosan / Oral / **96%** with homologous S. agalactiae **Ia** challenge"
                ]
              }
            ]
          },
          {
            "sub": "Tilapia lake virus และอื่น ๆ",
            "body": [
              {
                "bullets": [
                  "Tilapia lake virus / Biomimetic nano delivery system (Cs-pS2@M-M) for DNA construct using a mannose-modified erythrocyte membrane / **Intramuscular** / **76.0% และ 68.9%** ตามลำดับ",
                  "**Tilapia lake virus** / Chitosan-coated mucoadhesive / **Immersion** / **RPS 68.17%** with cohabitation challenge และใน field trial ได้ **RPS 52.2%** ด้วย chitosan-nanovaccine",
                  "β-galactosidase reporter gene / DNA construct encapsulated in chitosan / Oral, intrabuccal or intramuscular / ช่อง RPS เว้นว่างไว้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สถานการณ์โรคทิลาเปียเลคไวรัส (TiLV) ในปลานิล",
        "source": "Aquaculture_Industry_Tech p.87",
        "body": [
          {
            "bullets": [
              "พบมีการระบาดสูง โดยมีปัจจัยของ **ความเครียด** และ **คุณภาพน้ำ**",
              "รูปแบบการเลี้ยงแบบ **กระชัง** พบมีการระบาดมากกว่าแบบ **บ่อดิน/PE**",
              "**อัตราตาย 20-90 %**"
            ]
          },
          {
            "text": "ภาพประกอบเป็นปลานิลแดงที่มีรอยโรค และภาพฟาร์มกระชังที่มีปลาตายลอย"
          }
        ]
      },
      {
        "heading": "การพัฒนาวัคซีน TiLV: ขั้นตอนการพัฒนาดีเอ็นเอนาโนวัคซีน",
        "source": "Aquaculture_Industry_Tech p.88-89",
        "body": [
          {
            "text": "สไลด์ระบุว่าไวรัสอยู่ในวงศ์ **Orthomyxoviridae** พร้อมภาพ EM ของอนุภาคไวรัส"
          },
          {
            "sub": "ลำดับขั้นตอนตามลูกศรในสไลด์หน้า 89",
            "body": [
              {
                "text": "Gene amplification ไป Recombinant plasmid construction (ในภาพมี DNA9 และ DNA10) ไป Recombinant plasmid transformation to bacteria cells ไป Bacterial culture ไป DNA vaccine and Nanotechnology combination ไป **DNA-Nano vaccine version1 in Tilapia (Immersion vaccine)** ไป Vaccine efficacy test"
              }
            ]
          },
          {
            "sub": "สถานะงานที่สไลด์กำกับไว้",
            "body": [
              {
                "bullets": [
                  "ขั้นตอนที่มีเครื่องหมายถูกสีเขียว: recombinant plasmid construction (DNA10), transformation, bacterial culture, DNA vaccine + nanotechnology combination และ DNA-Nano vaccine version1 in Tilapia",
                  "ในกรอบเส้นประแดงเขียนว่า **On process** สำหรับส่วน **Adjuvant**",
                  "**Vaccine efficacy test** ระบุ 2 แบบคือ **LAB test** และ **Field test**"
                ]
              }
            ]
          },
          {
            "text": "สไลด์หน้า 88 เป็นแผนผังเดียวกันแต่วาดครบวง มีขั้น **Plasmid purification** และ **Nano vaccine formation** เพิ่มเข้ามา โดย Plasmid purification มีเครื่องหมายกากบาทสีแดงกำกับ และปลายทางมีรูปปลา 2 ตัว ตัวหนึ่งติดเครื่องหมายถูกสีเขียว อีกตัว (มีเข็มฉีดยา) ติดเครื่องหมายกากบาทสีแดง"
          },
          {
            "callout": "สไลด์ไม่ได้เขียนอธิบายว่าเครื่องหมายถูก/กากบาทบนแต่ละไอคอนหมายถึงอะไร จึงไม่ควรตีความเกินกว่าที่เห็น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การจำลองการก่อโรค TiLV ในห้องปฏิบัติการ (On process)",
        "source": "Aquaculture_Industry_Tech p.90",
        "body": [
          {
            "text": "หัวสไลด์ระบุว่ายังอยู่ในสถานะ **On process**"
          },
          {
            "text": "ภาพซ้ายเป็นปลานิลแดง 3 ตัว พร้อมตารางหัวข้อ **TiLV-Real** ค่าที่แสดงคือ **3.58E+05**, **7.05E+05** และ **5.60E+05** สไลด์ไม่ได้บอกหน่วยหรือวิธีการตรวจของค่าเหล่านี้"
          },
          {
            "text": "จากนั้นลูกศรเขียนว่า **Cell culture** ไปยังภาพการทำงานใน biosafety cabinet และ culture flask"
          }
        ]
      },
      {
        "heading": "นวัตกรรมระบบนำส่งนาโนและการประยุกต์ใช้ในสัตว์น้ำ (ภาพรวม 4 กลุ่ม)",
        "source": "Aquaculture_Industry_Tech p.91",
        "body": [
          {
            "text": "แนวคิดรวมคือ **Nano-encapsulation and Nano-delivery of bioactive components**"
          },
          {
            "bullets": [
              "**Herbal medicine**: Curcumin nanoparticle",
              "**Vaccine**: Nano-vaccine immersion",
              "**Probiotic**: Probiotic-Prebiotic Nano Microencapsulation (Lactobacillus Rhamnosus GG)",
              "**Anesthetic**: Clove-Cannabis nanoparticle"
            ]
          },
          {
            "callout": "4 กลุ่มนี้คือโครงของสไลด์ที่เหลือ (I. Herbal Medicine, II. Vaccines, III. Anesthesia, IV. Probiotic)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "นาโนเทคโนโลยี: องค์ประกอบของอนุภาคและการแบ่งชนิด",
        "source": "Aquaculture_Industry_Tech p.92",
        "body": [
          {
            "sub": "Therapeutic agents ที่บรรจุอยู่ตรงกลาง",
            "body": [
              {
                "bullets": [
                  "Conventional drugs",
                  "Biopharmaceuticals",
                  "Antigen (peptide, protein, nucleic acid)"
                ]
              }
            ]
          },
          {
            "sub": "Targeting ligands",
            "body": [
              {
                "bullets": [
                  "antibodies",
                  "proteins, peptides",
                  "nucleic acids (e.g. aptamer)",
                  "small molecules",
                  "polymers"
                ]
              }
            ]
          },
          {
            "sub": "Surface chemistry",
            "body": [
              {
                "bullets": [
                  "surface charge",
                  "surface functionality (e.g. -NH2, -OCH3, -COOH)",
                  "hydrophobicity"
                ]
              }
            ]
          },
          {
            "sub": "Organic nanoparticles",
            "body": [
              {
                "bullets": [
                  "**Viral vectors**: Retrovirus, Adenovirus, Adeno-associated virus",
                  "**Non-viral vectors**: Polymeric (chitosan, PLGA), Lipid nanoparticle, Liposomes, Nanoemulsion, Solid lipid nanoparticles (SLN), Nanostructured lipid carriers (NLC)"
                ]
              }
            ]
          },
          {
            "sub": "Inorganic nanoparticles",
            "body": [
              {
                "bullets": [
                  "Quantum dots",
                  "Gold nanoparticles",
                  "Silver nanoparticles",
                  "Superparamagnetic iron oxide NP (SPION)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Type of organic nanoparticle",
        "source": "Aquaculture_Industry_Tech p.93",
        "body": [
          {
            "text": "คำบรรยายใต้ภาพ: **Organic nanoparticle for drug delivery system; water in oil nanoparticle and oil in water nanoparticle.**"
          },
          {
            "sub": "ป้ายที่ปรากฏบนแผนภาพแต่ละแบบ",
            "body": [
              {
                "bullets": [
                  "Drug molecule, Hydrophilic drug",
                  "Target ligands: Antibody, Peptide, Protein, Carbohydrate",
                  "DNA/RNA/SiRNA, PEG density",
                  "Ethanol, Phosphatidylcholine",
                  "Single chain surfactant molecule",
                  "Solid lipid crystal, Liquid lipid (oil), Liquid oil, PEG"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์วาดอนุภาค 7 แบบแต่ไม่ได้เขียนชื่อกำกับแต่ละแบบ (เช่น liposome, ethosome, SLN, NLC) มีเพียงป้ายชี้องค์ประกอบเท่านั้น จึงไม่ระบุชื่อแต่ละอนุภาค",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "I. Herbal Medicine: plant-based alternative antibiotic",
        "source": "Aquaculture_Industry_Tech p.94",
        "body": [
          {
            "text": "หัวข้อหลักคือ **Plant-based alternative antibiotic**"
          },
          {
            "sub": "ตำแหน่งออกฤทธิ์ของยาปฏิชีวนะที่แสดงในแผนภาพเซลล์แบคทีเรีย",
            "body": [
              {
                "bullets": [
                  "**Cell wall**: β-lactams (penicillins, cephalosporins, monobactams, carbapenems), Glycopeptides (vancomycin), Bacitracin",
                  "**Plasma membrane**: Polymyxins (polymyxin B, colistin), Lipopeptide (daptomycin)",
                  "**Ribosomes**: 30S subunit (aminoglycosides, tetracyclines) และ 50S subunit (macrolides, lincosamides, chloramphenicol, oxazolidinones)",
                  "**DNA synthesis**: Fluoroquinolones (ciprofloxacin, levofloxacin, moxifloxacin)",
                  "**RNA synthesis**: Rifamycins (rifampin)",
                  "**Metabolic pathways**: Folic acid synthesis (sulfonamides, sulfones, trimethoprim), Mycolic acid synthesis (izoniazid)"
                ]
              }
            ]
          },
          {
            "sub": "เทคนิคนำส่งที่แสดงด้านขวา",
            "body": [
              {
                "bullets": [
                  "**Micro-encapsulations**",
                  "**Nano-delivery system**"
                ]
              },
              {
                "text": "**Hydrophobic molecule** เช่นโครงสร้าง phenol ใช้ **Lipid nanoparticle**"
              },
              {
                "text": "**Hydrophilic molecule** ได้แก่ Acetate, Propionate, Butyrate ซึ่งเป็น **Short chain fatty acids (SCFAs)** ใช้แบบ **Water in oil in water (w/o/w)**"
              }
            ]
          }
        ]
      },
      {
        "heading": "CURCUMIN-NANO และกลุ่มสารสำคัญจากพืช",
        "source": "Aquaculture_Industry_Tech p.95",
        "body": [
          {
            "text": "สไลด์วางตรงกลางเป็น **Curcumin nanoparticle** (จากขมิ้น) พร้อมสูตรโครงสร้าง curcumin แล้วล้อมด้วยกลุ่มสารสำคัญจากพืช 4 กลุ่ม"
          },
          {
            "sub": "4 กลุ่ม และจุดสังเกตที่สไลด์วงแดงไว้",
            "body": [
              {
                "bullets": [
                  "**Alkaloid group**: จุดสังเกตคือ **Nitrogen atom** ตัวอย่างพืชคือ Opium poppy (ฝิ่น)",
                  "**Polyphenol group**: จุดสังเกตคือ **phenol molecule** ตัวอย่างพืชคือ Grape",
                  "**Glycoside group**: จุดสังเกตคือ **glycosidic bond** ตัวอย่างพืชคือ Digitalis purpurea (ถุงมือจิ้งจอก) และ Urginea maritima (หัวหอมทะเล)",
                  "**Terpenoid groups**: จุดสังเกตคือ **Terpene structure** ตัวอย่างพืชคือ Oregano และ Mint"
                ]
              }
            ]
          },
          {
            "callout": "ในกล่อง terpenoid สไลด์แบ่งย่อยเป็น Hemiterpenes, Acyclic monoterpenoids, Monocyclic monoterpenoids, Sesquiterpenoids และ Diterpenoids ส่วนชื่อสารรายตัวพิมพ์เล็กมากจนอ่านไม่ครบ จึงไม่จดมาทั้งหมด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "II. Vaccines: immersion และ oral vaccination",
        "source": "Aquaculture_Industry_Tech p.96",
        "body": [
          {
            "text": "หัวข้อคือ **Immersion and oral vaccination**"
          },
          {
            "bullets": [
              "Vaccine delivery ??",
              "**Nanotechnology**"
            ]
          },
          {
            "text": "เทียบเคียงกับฝั่งคน: **In human: needle-free vaccination** โดยมีภาพวัคซีน intranasal COVID-19, แบบพ่นทางปาก/จมูก และแบบแปะผิวหนัง"
          }
        ]
      },
      {
        "heading": "การพัฒนาวัคซีนด้วยนาโนเทคโนโลยี",
        "source": "Aquaculture_Industry_Tech p.97",
        "body": [
          {
            "text": "แผนภาพวงกลม **อนุภาคของวัคซีน** แบ่งเป็นด้าน ๆ ดังนี้"
          },
          {
            "bullets": [
              "**ขนาด**: ไล่จาก **200 nm** ลงมาถึง **1 nm**",
              "**รูปร่าง**: sphere, cube, rod, plate, star",
              "**โครงสร้าง**: dendrimer, Protein-drug conjugate, Polymer particle, liposome, Hydrogel particle, Solid-lipid hybrid particle",
              "ด้านที่แตกออกมาทางขวา ได้แก่ **หมู่ฟังก์ชั่น (surface functional group)**, **ประจุ (surface charge)** และ **ลิแกนด์เป้าหมาย (targeting ligand เช่น antibody, peptide, aptamer)**"
            ]
          },
          {
            "sub": "ประโยชน์ที่สไลด์สรุปไว้ในกล่องเหลือง",
            "body": [
              {
                "bullets": [
                  "เป็นระบบนำส่งแอนติเจนและแอดจูแวน",
                  "เพิ่มประสิทธิภาพวัคซีน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Polymeric nanocarrier: แพลตฟอร์มที่ใช้ได้กับหลายเชื้อ",
        "source": "Aquaculture_Industry_Tech p.98",
        "body": [
          {
            "text": "สไลด์เน้นว่าเป็น **A versatile platform: Polymeric Nanocarrier with excellent mucoadhesive characteristic**"
          },
          {
            "sub": "เชื้อที่แสดงว่าใช้แพลตฟอร์มนี้ได้",
            "body": [
              {
                "bullets": [
                  "Streptococcus agalactiae",
                  "**Aeromonas veronii** (สไลด์ตีกรอบสีเขียวเน้นไว้)",
                  "Francisella noatunensis",
                  "Aeromonas hydrophila"
                ]
              }
            ]
          },
          {
            "text": "ภาพยังแสดงว่าอนุภาคสามารถห่อได้ทั้งไวรัส แบคทีเรียทรงกลม และแบคทีเรียทรงแท่ง แล้วนำส่งให้ปลานิล"
          }
        ]
      },
      {
        "heading": "III. Anesthesia: clove oil",
        "source": "Aquaculture_Industry_Tech p.99",
        "body": [
          {
            "text": "สารที่นำเสนอคือ **Clove oil** จาก **Syzygium aromaticum**"
          },
          {
            "text": "สไลด์ทำเป็นป้าย WANTED เขียนว่า **Anesthetic agent** ที่ต้องการคือต้องมี **Safety and efficacy**"
          },
          {
            "text": "บริบทการใช้งานที่แสดงคือ **Handling and transport management** พร้อมภาพการเทปลาลงบ่อ การตัดครีบ/เก็บตัวอย่าง และการจับปลาระหว่างทำหัตถการ"
          }
        ]
      },
      {
        "heading": "Anesthetic: clove-cannabis nanoparticle และ stages of anesthesia",
        "source": "Aquaculture_Industry_Tech p.100",
        "body": [
          {
            "text": "รูปแบบที่พัฒนาคือ **Clove-Cannabis nanoparticle**"
          },
          {
            "text": "สิ่งที่ต้องพิจารณาในการวางยาสลบ: **Anesthesia: Dosage, Induction time and Recovery time**"
          },
          {
            "sub": "Stages of anesthesia in fish and shrimp",
            "body": [
              {
                "bullets": [
                  "**Stage I - Sedation**: Motion & breathing reduced",
                  "**Stage II - Anesthesia**: Partial loss of equilibrium, Reactive to touch stimuli",
                  "**Stage III - Surgical anesthesia**: Total loss of equilibrium, No reaction to touch stimuli",
                  "**Stage IV - Death**: Breathing & heart beat stop, Overdose ทำให้ตายในที่สุด"
                ]
              }
            ]
          },
          {
            "text": "สัตว์น้ำที่แสดงในภาพประกอบ ได้แก่ Nile tilapia, Koi carp, Goldfish และ White shrimp"
          },
          {
            "callout": "จุดแยก stage II กับ III คือ partial กับ total loss of equilibrium และการตอบสนองต่อการสัมผัส (reactive เทียบ no reaction)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "IV. Probiotic: Lactobacillus rhamnosus GG",
        "source": "Aquaculture_Industry_Tech p.101",
        "body": [
          {
            "text": "โพรไบโอติกที่ใช้คือ **Lactobacillus Rhamnosus GG (LGG)**"
          },
          {
            "sub": "งานวิจัยที่อ้างในสไลด์",
            "body": [
              {
                "bullets": [
                  "3 Biotech (2021) 11:279 เรื่อง Development of pelleted feed containing probiotic Lactobacillus rhamnosus GG and Jerusalem artichoke for Nile Tilapia and its biocompatibility studies (Unchaleeporn Sribounoy, Nopadon Pirarat, Kevin Mis Solval, Subramaniam Sathivel, Arranee Chotiko)",
                  "Fish Shellfish Immunol. 2019 Mar;86:260-268 doi: 10.1016/j.fsi.2018.11.026 เรื่อง Efficacy of synbiotic Jerusalem artichoke and Lactobacillus rhamnosus GG-supplemented diets on growth performance, serum biochemical parameters, intestinal morphology, immune parameters and protection against **Aeromonas veronii** in juvenile red tilapia (Oreochromis spp.) (PMID: 30439500)"
                ]
              }
            ]
          },
          {
            "sub": "กายวิภาคทางเดินอาหารที่เทียบในภาพ (Herbivore เทียบ Carnivore)",
            "body": [
              {
                "text": "a) Esophagus, b) Stomach, c) Gall bladder, d) Spleen, e) Pyloric caeca, f) Intestine, g) Anus, h) Gizzard"
              }
            ]
          },
          {
            "sub": "ภาพภูมิคุ้มกันของลำไส้ที่แสดง",
            "body": [
              {
                "text": "Small intestine: Goblet cell, Paneth cell, Enterocyte, Enteroendocrine cell, IESC, Stromal cell, Macrophage, DC, sIgA, AMPs, TFF3, Commensal bacteria, Apoptotic IECs และชั้น Mucus"
              },
              {
                "text": "Follicle-associated epithelium: **M cell**, B cell, Lymphoid follicle"
              },
              {
                "text": "Colon: Mucus และ Second-layer mucus"
              }
            ]
          },
          {
            "callout": "สไลด์ไม่ได้เขียนสรุปผลของงานวิจัยทั้งสองเป็นตัวเลข มีแค่ภาพ abstract ที่ยกมาแสดง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Probiotic-Prebiotic Nano-Microencapsulation",
        "source": "Aquaculture_Industry_Tech p.102",
        "body": [
          {
            "text": "หัวข้อคือ **Probiotic-Prebiotic Nano-Microencapsulation** โดยใช้ **Lactobacillus Rhamnosus GG**"
          },
          {
            "text": "แผนภาพซ้ายแสดงองค์ประกอบ 3 ส่วน คือ **Probiotic bacteria**, **Microencapsulation system** และ **Prebiotics** ที่อยู่ในระบบห่อหุ้มเดียวกัน"
          },
          {
            "sub": "แผนภาพขวา: เส้นทางในทางเดินอาหาร",
            "body": [
              {
                "text": "จาก Stomach ไป Small intestine ไป Colon โดย **Probiotics spore** เกิด **Germination** แล้วเกิด **Probiotics colonization** ตามด้วย **Self-assembly** เป็น **Nanoparticles**"
              },
              {
                "text": "องค์ประกอบที่กำกับไว้ในภาพ ได้แก่ DOX, SOR และ DA (สไลด์ไม่ได้ขยายความว่าย่อมาจากอะไร)"
              }
            ]
          },
          {
            "text": "ภาพ TEM เปรียบเทียบ Control กับ Nanoparticles ที่ scale bar **1 µm**"
          }
        ]
      },
      {
        "heading": "Nano-delivery preparation and particle decoration",
        "source": "Aquaculture_Industry_Tech p.103",
        "body": [
          {
            "text": "สไลด์แสดงว่าอนุภาคถูกออกแบบ (decorate) ให้ต่างกันตามเส้นทางการนำส่ง 3 แบบ"
          },
          {
            "bullets": [
              "**Gill-penetrating Nanocarrier**: ภาพประกอบเป็นน้ำที่ไหลผ่านปากเข้าสู่ gill filament และ gill arch",
              "**Mucoadhesive Nanocarrier**: อนุภาคเกาะที่ชั้นเมือกบนผิวปลา",
              "**Orally administered Nanocarrier**: เข้าทางทางเดินอาหาร โดยในภาพกำกับประจุลบ (-) ไว้ต่างจากอีก 2 แบบ"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้อธิบายเป็นข้อความว่าแต่ละแบบตกแต่งอนุภาคอย่างไร ให้ดูจากภาพเป็นหลักว่าประจุและตำแหน่งเป้าหมายต่างกัน",
            "kind": "flag"
          }
        ]
      }
    ]
  },
  "aqua-fish-biology": {
    "topic": "aqua-fish-biology",
    "title": "Fish Biology (ชีววิทยาปลา)",
    "lecturer": "Associate Professor Dr. Aranya Ponpornpisit",
    "icon": "🐟",
    "summary": "ส่วนแรกของ lecture Fish Biology (สไลด์หน้า 1-36) ครอบคลุม 2 เรื่องใหญ่ คือ (1) การจำแนกปลา (classification) ตาม 8 เกณฑ์ ได้แก่ structure, habitat, food, reproductive pattern, age, culture purpose, culture system และ migration pattern และ (2) กายวิภาคภายนอกและภายใน ตั้งแต่ body shape, body planes, body regions, external features ไปจนถึงภาพ anatomy เปรียบเทียบระหว่างปลาชนิดต่าง ๆ (salmonid, catfish, goldfish, sturgeon, angelfish, ปลาลำตัวลึก, seahorse, shark, ray) และจบด้วย coelomic cavity สไลด์ช่วงนี้เน้นให้จำ term ภาษาอังกฤษและตำแหน่งอวัยวะจากรูป มากกว่าการอธิบายเป็นข้อความ",
    "sections": [
      {
        "heading": "ภาพรวมของบทเรียน (Principal concepts)",
        "source": "AP2_Fish_bio p.1-2",
        "body": [
          {
            "text": "หัวเรื่อง **FISH BIOLOGY** โดย Associate Professor Dr. Aranya Ponpornpisit, Department of Veterinary Medicine, Faculty of Veterinary Science, Chulalongkorn University"
          },
          {
            "text": "สไลด์ Principal concepts วางกรอบเนื้อหาไว้ **3 หัวข้อ**"
          },
          {
            "bullets": [
              "**Classification** (การจำแนกปลา)",
              "**General characteristics** (ลักษณะทั่วไป)",
              "**Structure and function of important organ** (โครงสร้างและหน้าที่ของอวัยวะสำคัญ)"
            ]
          }
        ]
      },
      {
        "heading": "ตำแหน่งของปลาใน Tree of life",
        "source": "AP2_Fish_bio p.3",
        "body": [
          {
            "text": "สไลด์แสดงแผนภาพ Tree of life พร้อมข้อความสรุปว่า **Fish is the most primitive species in a vertebrate group** (ปลาเป็นสิ่งมีชีวิตที่ primitive ที่สุดในกลุ่มสัตว์มีกระดูกสันหลัง)"
          },
          {
            "text": "บนแผนภาพมีการวงเน้นด้วยลายมือ 2 วง คือ วงสีแดงคลุมกิ่งของ vertebrate ทั้งหมด (Birds, Reptiles, Mammals, Amphibians, Fishes) และวงสีน้ำเงินเน้นเฉพาะตำแหน่ง **Fishes** ซึ่งอยู่ที่ฐานของกิ่ง vertebrate"
          },
          {
            "text": "ที่มาของภาพระบุไว้ว่า From: Hotton III, Nicholas. The Evidence of Evolution. Smithsonian, 1968"
          },
          {
            "callout": "สไลด์ไม่ได้อธิบายเหตุผลว่าทำไมปลาจึงถือเป็น primitive ที่สุด บอกไว้เพียงข้อความสรุปกับแผนภาพเท่านั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เกณฑ์การจำแนกปลา (Classification of fish)",
        "source": "AP2_Fish_bio p.4",
        "body": [
          {
            "text": "สไลด์ list เกณฑ์การจำแนกปลาไว้ **8 เกณฑ์** ซึ่งสไลด์หน้าถัดไปจะขยายทีละเกณฑ์"
          },
          {
            "bullets": [
              "**Structure** (โครงสร้าง)",
              "**Habitat** (แหล่งอาศัย)",
              "**Food** (อาหาร)",
              "**Reproductive pattern** (รูปแบบการสืบพันธุ์)",
              "**Age** (อายุ)",
              "**Culture purpose** (วัตถุประสงค์ในการเลี้ยง)",
              "**Culture system** (ระบบการเลี้ยง)",
              "**Migration pattern** (รูปแบบการอพยพ)"
            ]
          },
          {
            "callout": "ลำดับ 8 ข้อนี้คือโครงของสไลด์ทั้งช่วงแรก จำลำดับไว้จะช่วยไล่เนื้อหาได้ครบ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "จำแนกตามโครงสร้าง (Structure)",
        "source": "AP2_Fish_bio p.5",
        "body": [
          {
            "text": "แบ่งปลาตามโครงสร้างเป็น **3 กลุ่ม**"
          },
          {
            "bullets": [
              "**Cyclostome**",
              "**Cartilaginous fish** (ปลากระดูกอ่อน)",
              "**Bony fish** (ปลากระดูกแข็ง)"
            ]
          },
          {
            "text": "ภาพประกอบบนสไลด์ ได้แก่ ปลาที่มี lamprey เกาะอยู่พร้อมภาพ oral disc ของ lamprey แบบใกล้ (คู่กับ Cyclostome) ฉลามในตู้ (คู่กับ Cartilaginous fish) และปลาสวยงามสีส้มแดง (คู่กับ Bony fish)"
          },
          {
            "callout": "สไลด์ไม่ได้ให้นิยามหรือลักษณะจำเพาะของแต่ละกลุ่ม ให้มาเพียงชื่อกลุ่มกับภาพตัวอย่าง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "จำแนกตามแหล่งน้ำที่อยู่อาศัย และความทนเค็ม (Habitat / Salt tolerance)",
        "source": "AP2_Fish_bio p.6",
        "body": [
          {
            "sub": "Habitat",
            "body": [
              {
                "bullets": [
                  "**Fresh water fish** (ปลาน้ำจืด)",
                  "**Brackish water fish** (ปลาน้ำกร่อย)",
                  "**Marine fish** (ปลาทะเล)"
                ]
              }
            ]
          },
          {
            "sub": "Salt tolerance",
            "body": [
              {
                "bullets": [
                  "**Stenohaline**",
                  "**Euryhaline**"
                ]
              }
            ]
          },
          {
            "text": "ภาพประกอบ ได้แก่ ปลากะพงขาว ปลาน้ำจืดและปลาลิ้นหมาที่วางรวมกัน และปลาการ์ตูนในดอกไม้ทะเล"
          },
          {
            "callout": "สไลด์เขียนแค่ชื่อ Stenohaline กับ Euryhaline ไม่ได้ให้คำนิยามหรือช่วงความเค็มที่ทนได้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "จำแนกตามการกินอาหาร (Food consumption)",
        "source": "AP2_Fish_bio p.7",
        "body": [
          {
            "text": "สไลด์มีเพียงหัวข้อ **Food consumption** กับรูปปลา 3 รูป คือ ปลาคาร์ป (koi) ปลาขนาดเล็กลำตัวเรียวหลายตัวในกะละมัง และปลาดุก"
          },
          {
            "callout": "สไลด์ไม่ได้ list ประเภทของปลาตามการกินอาหาร (เช่น กลุ่มกินพืช กินเนื้อ หรือกินทั้งสองอย่าง) มีเพียงชื่อหัวข้อกับรูปเท่านั้น ต้องรอเนื้อหาจากที่อาจารย์บรรยายเสริม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "จำแนกตามรูปแบบการสืบพันธุ์ (Reproductive pattern)",
        "source": "AP2_Fish_bio p.8-9",
        "body": [
          {
            "text": "แบ่งเป็น **2 แบบ**"
          },
          {
            "bullets": [
              "**Livebearer** (ออกลูกเป็นตัว)",
              "**Egg-laying fish** (ออกลูกเป็นไข่)"
            ]
          },
          {
            "text": "ภาพประกอบ p.8 ได้แก่ ปลาม้าลาย (zebrafish) พร้อมภาพ embryo ในไข่แบบขยาย ภาพการรีดไข่จากแม่ปลาคาร์ปลงจาน และภาพปลาหางนกยูง (guppy) ซึ่งเป็นตัวอย่างกลุ่ม livebearer"
          },
          {
            "text": "p.9 เป็นรูปถ่ายเต็มหน้า แสดงปลาที่อมไข่จำนวนมากไว้ในปาก และมีมือคนกำลังรีดไข่ออกจากปากปลา"
          },
          {
            "callout": "p.9 ไม่มีข้อความบรรยายบนสไลด์ มีเพียง URL ที่มาของรูป จึงบอกไม่ได้จากสไลด์ว่าอาจารย์ใช้รูปนี้ยกตัวอย่างพฤติกรรมชนิดใดโดยเฉพาะ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "จำแนกตามอายุ (Age)",
        "source": "AP2_Fish_bio p.10-11",
        "body": [
          {
            "text": "แบ่งปลาตามช่วงอายุเป็น **5 ระยะ** เรียงตามที่สไลด์เขียน"
          },
          {
            "bullets": [
              "**Larvae**",
              "**Fry**",
              "**Fingering** (สไลด์พิมพ์คำนี้ไว้แบบนี้)",
              "**Juvenile**",
              "**Broodstock**"
            ]
          },
          {
            "text": "ภาพประกอบ p.11 ได้แก่ ลูกปลาระยะแรกที่ยังมีถุงไข่แดงติดอยู่จำนวนมาก และลูกปลาที่โตขึ้นวางอยู่บนฝ่ามือ"
          },
          {
            "sub": "p.10 ป้ายราคาลูกพันธุ์ปลา",
            "body": [
              {
                "text": "p.10 เป็นรูปถ่ายป้าย **ราคาลูกพันธุ์ปลา** ของฟาร์มแห่งหนึ่ง (ป้ายระบุ กูมิไทยฟาร์ม เริ่ม 1 มกราคม 2559) วางลูกปลานิลขนาดต่าง ๆ เรียงเทียบกับไม้บรรทัด โดยแต่ละขนาดมีป้ายบอกขนาดตาร่อน จำนวนตัวต่อกิโลกรัม และราคา"
              },
              {
                "text": "แถวบนไล่จากขนาดเล็กสุดคือช่วง 6-8 มม. (ระบุว่าใบมะขาม) ไป 8-8.5 มม. 8.5-10 มม. แล้วต่อด้วยขนาดที่ระบุเป็นค้าง # 1.5, # 2, # 2.5 ส่วนแถวล่างเป็นขนาดใหญ่ขึ้นระบุเป็นค้าง # 3, # 3.5, # 4, # 4.5"
              },
              {
                "callout": "ตัวเลขจำนวนตัวต่อกิโลกรัมและราคาต่อตัวบนป้ายพิมพ์เล็กและเบลอในรูปถ่าย จึงไม่ยืนยันเป็นรายช่อง ประเด็นที่สไลด์ต้องการสื่อคือ **ลูกพันธุ์ปลาซื้อขายกันโดยแยกเกรดตามขนาด**",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "จำแนกตามวัตถุประสงค์การเลี้ยง และระบบการเลี้ยง (Culture purpose / Culture system)",
        "source": "AP2_Fish_bio p.12-14",
        "body": [
          {
            "sub": "Culture purpose",
            "body": [
              {
                "bullets": [
                  "**Consumption** (เลี้ยงเพื่อบริโภค)",
                  "**Ornament / pet** (ปลาสวยงาม หรือสัตว์เลี้ยง)"
                ]
              }
            ]
          },
          {
            "sub": "Culture system",
            "body": [
              {
                "bullets": [
                  "**Cement pond** (บ่อปูน)",
                  "**Earth pond** (บ่อดิน)",
                  "**Net pen** (กระชัง)",
                  "**Aquarium, bottle, etc.** (ตู้ปลา ขวด และอื่น ๆ)"
                ]
              }
            ]
          },
          {
            "text": "p.13-14 เป็นรูปถ่ายตัวอย่างระบบการเลี้ยง ได้แก่ บ่อปูผ้าใบ กระชังในแหล่งน้ำ อ่างซีเมนต์กลมที่มีพืชน้ำ บ่อดินที่กำลังลากอวน บ่อปูนในโรงเรือน ตู้ปลาสวยงาม และขวดแก้วเลี้ยงปลาเรียงเป็นแถว"
          },
          {
            "callout": "สไลด์ไม่ได้เปรียบเทียบข้อดีข้อเสียหรือความหนาแน่นการเลี้ยงของแต่ละระบบ ให้มาเป็นรายชื่อระบบกับภาพตัวอย่าง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "จำแนกตามรูปแบบการอพยพ (Migration pattern)",
        "source": "AP2_Fish_bio p.15",
        "body": [
          {
            "bullets": [
              "**Diadromous**",
              "**Anadromous : Salmonidae**",
              "**Catadromous : Anguillidae**"
            ]
          },
          {
            "text": "สไลด์จับคู่ตัวอย่างวงศ์ปลาไว้ชัดเจน คือ Anadromous คู่กับ **Salmonidae** (ภาพปลาแซลมอนกำลังกระโดดทวนน้ำ) และ Catadromous คู่กับ **Anguillidae** (ภาพปลาไหลในภาชนะไม้)"
          },
          {
            "callout": "สไลด์เขียนเฉพาะชื่อรูปแบบกับวงศ์ตัวอย่าง ไม่ได้อธิบายทิศทางการอพยพของแต่ละแบบ (เช่น จากน้ำเค็มขึ้นน้ำจืด หรือจากน้ำจืดลงทะเล)",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "รูปร่างลำตัว (Body shape)",
        "source": "AP2_Fish_bio p.16-19",
        "body": [
          {
            "text": "สไลด์แสดง body shape ทีละแบบ พร้อมภาพตัวอย่าง รวม **6 แบบ** ในช่วงหน้า 16 ถึง 19"
          },
          {
            "bullets": [
              "**Fusiform** ตัวอย่างคือปลาทูน่า (p.16 มี thumbnail BLUE FIN TUNA ประกอบ)",
              "**Compressiform (laterally compressed)** แบนข้าง ตัวอย่างคือปลาเทวดา (angelfish) (p.17)",
              "**Depressiform (Dorso ventrally compressed)** แบนบนลงล่าง ตัวอย่างคือปลาลิ้นหมาที่นอนราบกับพื้นตู้ (p.17)",
              "**Globiform** ตัวอย่างคือปลาทองหัวโหนกทรงกลม (p.18)",
              "**Filiform** ตัวอย่างคือปลาลำตัวเรียวยาวคล้ายเส้นด้าย (p.18)",
              "**Anguilliform** ตัวอย่างคือปลาไหล (p.19)"
            ]
          },
          {
            "callout": "จุดที่ต้องแม่นคือ **compressiform = แบนข้าง** ส่วน **depressiform = แบนจากด้านบนลงล่าง** สไลด์วงเล็บกำกับความหมายไว้ให้ทั้งสองคำ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ระนาบและทิศทางของลำตัว (Body planes)",
        "source": "AP2_Fish_bio p.20-21",
        "body": [
          {
            "text": "สไลด์ list คำบอกทิศทางและระนาบของลำตัวปลาไว้ **6 คำ**"
          },
          {
            "bullets": [
              "**Dorsal**",
              "**Ventral**",
              "**Anterior**",
              "**Posterior**",
              "**Median**",
              "**Lateral**"
            ]
          },
          {
            "text": "p.21 เป็นรูปถ่ายปลาในตู้ (ปลากลุ่มกะรังและปลาลำตัวแบนราบนอนอยู่ที่พื้นตู้) โดยไม่มีข้อความกำกับบนสไลด์"
          }
        ]
      },
      {
        "heading": "ส่วนของลำตัว และการวัดขนาดปลา (Body regions)",
        "source": "AP2_Fish_bio p.22",
        "body": [
          {
            "text": "แบ่งลำตัวปลาเป็น **3 ส่วน**"
          },
          {
            "bullets": [
              "**Head** (หัว)",
              "**Trunk** (ลำตัว)",
              "**Tail** (หาง)"
            ]
          },
          {
            "sub": "แผนภาพ Common Measurements บนสไลด์เดียวกัน",
            "body": [
              {
                "bullets": [
                  "**Total Length** วัดจากปลายสุดด้านหัวถึงปลายสุดของครีบหาง",
                  "**Fork Length** วัดถึงตำแหน่งง่ามของครีบหาง",
                  "**Standard Length** วัดถึงตำแหน่งโคนหาง (สั้นกว่า fork length)",
                  "**Girth** คือ the distance around the fattest part of the fish (เส้นรอบวงตรงส่วนที่อ้วนที่สุดของตัวปลา)"
                ]
              },
              {
                "text": "แผนภาพระบุกำกับไว้ว่า In Freshwater Rules only **Total Length** is used และ The measurement is taken **flat, not along the curve of the fish** พร้อม Note ว่า **Mouth should be shut and tail fin pinched closed**"
              }
            ]
          },
          {
            "callout": "ตอนวัด total length ต้องปิดปากปลาและบีบครีบหางให้หุบ ไม่วัดตามความโค้งของลำตัว เป็นรายละเอียดที่สไลด์เขียนไว้ตรง ๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ลักษณะภายนอก (External features)",
        "source": "AP2_Fish_bio p.23",
        "body": [
          {
            "text": "แผนภาพ EXTERNAL ANATOMY ชี้ตำแหน่งโครงสร้างภายนอกไว้ดังนี้"
          },
          {
            "bullets": [
              "**Nares (Nostrils)** รูจมูก",
              "**Eye**",
              "**Mouth**",
              "**Operculum (Gill Cover)** แผ่นปิดเหงือก",
              "**Pectoral fins**",
              "**Pelvic fins**",
              "**Scales**",
              "**Vent**",
              "**Anal fin**",
              "**Lateral line** เส้นข้างลำตัว",
              "**Peduncle** คอดหาง",
              "**Caudal (Tail) fin**",
              "**Spiny dorsal fin** และ **Soft dorsal fin** ซึ่งสไลด์แยกออกจากกันเป็นสองส่วนบนหลังปลา"
            ]
          },
          {
            "callout": "สไลด์นี้แยก dorsal fin ออกเป็น **spiny** กับ **soft** ชัดเจน เป็นจุดที่ต่างจากแผนภาพหน้าอื่นที่เขียนรวมเป็น dorsal fin เฉย ๆ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "กายวิภาคปลากลุ่ม salmonid (ภาพจาก Stoskopf Fish Medicine)",
        "source": "AP2_Fish_bio p.24",
        "body": [
          {
            "text": "สไลด์แสดงภาพปลากลุ่ม salmonid 3 ชั้น ไล่จากภายนอกเข้าไปภายใน โดยไม่มีข้อความบรรยายเพิ่มนอกจากป้ายชื่อในภาพ อ้างอิงหนังสือ Stoskopf **FISH MEDICINE Volume I**"
          },
          {
            "sub": "ภาพที่ 1 ภายนอก",
            "body": [
              {
                "bullets": [
                  "**First dorsal fin**",
                  "**Adipose fin or 2nd dorsal fin**",
                  "**Operculum**",
                  "**Nostril**",
                  "**Lateral line**",
                  "**Pectoral fin**, **Pelvic fin**, **Anal fin**, **Caudal fin**"
                ]
              }
            ]
          },
          {
            "sub": "ภาพที่ 2 อวัยวะภายในชั้นตื้น",
            "body": [
              {
                "bullets": [
                  "**Gills**",
                  "**Liver**",
                  "**Pyloric ceca**",
                  "**Stomach**",
                  "**Gonad**",
                  "**Swim bladder**",
                  "**Colon**"
                ]
              }
            ]
          },
          {
            "sub": "ภาพที่ 3 อวัยวะภายในชั้นลึก",
            "body": [
              {
                "bullets": [
                  "**Atrium**, **Ventricle**, **Conus** (ส่วนของหัวใจ)",
                  "**Kidney**",
                  "**Swim bladder**",
                  "**Stomach**",
                  "**Colon**"
                ]
              },
              {
                "callout": "ป้ายชื่อบรรทัดล่างสุดของภาพที่ 3 ถูกตัดขอบสไลด์ อ่านไม่ครบคำ จึงไม่ระบุไว้",
                "kind": "flag"
              }
            ]
          },
          {
            "callout": "**Adipose fin** และ **Pyloric ceca** เป็นสองโครงสร้างที่ปรากฏชัดในกลุ่ม salmonid บนสไลด์นี้",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "กายวิภาคปลาหนัง (catfish)",
        "source": "AP2_Fish_bio p.25",
        "body": [
          {
            "sub": "ภายนอก",
            "body": [
              {
                "bullets": [
                  "**Dorsal fin**, **Adipose fin**, **Caudal fin**, **Anal fin**, **Pelvic fin**, **Pectoral fin**",
                  "**First dorsal fin**",
                  "**Short barbel** และ **Long barbel** (หนวดสั้นและหนวดยาว)"
                ]
              }
            ]
          },
          {
            "sub": "ภายใน",
            "body": [
              {
                "bullets": [
                  "**Gill**, **Heart**",
                  "**Esophagus**, **Stomach**, **Intestine**",
                  "**Liver**, **Gallbladder**",
                  "**Swim bladder**",
                  "**Spleen**",
                  "**Cranial kidney** และ **Caudal kidney** (สไลด์แยกไตออกเป็นส่วนหน้าและส่วนท้าย)",
                  "**Gonad**",
                  "**Urinary bladder**",
                  "**Genital pore**",
                  "**Fat** (ชี้ไว้หลายตำแหน่งในช่องท้อง)"
                ]
              }
            ]
          },
          {
            "callout": "จุดที่ควรจำจากแผนภาพนี้คือปลามีไตแยกเป็น **cranial kidney** และ **caudal kidney** ตามความยาวลำตัว ต่างจากสัตว์บกที่เป็นไตคู่รูปเมล็ดถั่ว",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "กายวิภาคปลาทอง (goldfish)",
        "source": "AP2_Fish_bio p.26",
        "body": [
          {
            "text": "แผนภาพปลาทองชี้ตำแหน่งอวัยวะดังนี้"
          },
          {
            "bullets": [
              "**Cranial kidney** และ **Caudal kidney**",
              "**Swim bladder** ซึ่งสไลด์แยกออกเป็น **Cranial chamber** และ **Caudal chamber**",
              "**Lateral line**",
              "**Gill**, **Heart**",
              "**Liver**, **Gallbladder**, **Spleen**",
              "**Intestine**, **Colon**",
              "**Gonad + Fat**",
              "**Oviduct**"
            ]
          },
          {
            "callout": "สไลด์แสดงชัดว่า swim bladder ของปลาทองมี **2 ห้อง** คือห้องหน้า (cranial chamber) และห้องหลัง (caudal chamber)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "กายวิภาคภายนอกของ sturgeon",
        "source": "AP2_Fish_bio p.27",
        "body": [
          {
            "text": "แผนภาพ sturgeon แสดง 2 มุมมอง คือด้านข้างและด้านท้อง ป้ายชื่อที่ปรากฏ ได้แก่"
          },
          {
            "bullets": [
              "**Nostril**, **Barbels**",
              "**Operculum**, **Gill**",
              "**Pectoral fin**, **Pelvic fin**, **Anal fin**, **Dorsal fin**, **Caudal fin**",
              "**Anus**",
              "**Urogenital pore**"
            ]
          },
          {
            "callout": "ภาพด้านท้องแยกช่องเปิด **anus** ออกจาก **urogenital pore** เป็นคนละรูกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "กายวิภาคปลาลำตัวแบนข้างและปลาลำตัวลึก",
        "source": "AP2_Fish_bio p.28-29",
        "body": [
          {
            "sub": "ปลาเทวดา (angelfish) p.28",
            "body": [
              {
                "text": "ภายนอก ป้ายชื่อได้แก่ **Dorsal fin**, **Lateral line**, **Anal fin**, **Anus**, **Pelvic fin**"
              },
              {
                "text": "ภายใน ป้ายชื่อได้แก่ **Kidney**, **Swim bladder**, **Liver**, **Stomach**, **Fat**, **Spleen**, **Colon**, **Intestine** และส่วนของหัวใจคือ **Atrium**, **Conus**, **Ventricle**"
              }
            ]
          },
          {
            "sub": "ปลาลำตัวลึก p.29",
            "body": [
              {
                "text": "ภาพบน ป้ายชื่อได้แก่ **Brain**, **Lateral line**, **Gill**, **Heart**, **Liver**, **Kidney**, **Esophagus**, **Spleen**, **Stomach**, **Intestine**, **Gonad + Fat**, **Anus**"
              },
              {
                "text": "ภาพล่าง ป้ายชื่อได้แก่ **Liver**, **Gallbladder**, **Kidney**, **Gill**, **Gonad**, **Oviduct**, **Stomach**, **Pyloric pouches**, **Anus**"
              }
            ]
          },
          {
            "callout": "ทั้งสองหน้าเป็นภาพจาก Stoskopf FISH MEDICINE Volume I ไม่มีข้อความบรรยายบนสไลด์นอกจากป้ายชื่ออวัยวะในภาพ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "กายวิภาคม้าน้ำ (seahorse)",
        "source": "AP2_Fish_bio p.30",
        "body": [
          {
            "text": "แผนภาพม้าน้ำผ่าด้านข้าง ป้ายชื่อที่ปรากฏ ได้แก่"
          },
          {
            "bullets": [
              "**Heart**, **Gill**",
              "**Esophagus**, **Stomach**, **Intestine**",
              "**Liver**, **Gall bladder**",
              "**Swim bladder**",
              "**Kidney** (ชี้ไว้สองตำแหน่ง)",
              "**Ovary**",
              "**Anus**",
              "**Pouch-♂** (ถุงหน้าท้องของตัวผู้)"
            ]
          },
          {
            "callout": "ม้าน้ำมี **Pouch** ของตัวผู้เป็นโครงสร้างเฉพาะที่ปลาชนิดอื่นในสไลด์ชุดนี้ไม่มี",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "กายวิภาคปลากระดูกอ่อน (shark และ ray)",
        "source": "AP2_Fish_bio p.31-32",
        "body": [
          {
            "sub": "ฉลาม p.31",
            "body": [
              {
                "text": "ภายนอก ป้ายชื่อได้แก่ **1st dorsal fin**, **2nd dorsal fin**, **Caudal fin**, **Pelvic fin**, **Anal fin**, **Pectoral fin**, **Nostril**, **Eye**"
              },
              {
                "text": "ภายใน ป้ายชื่อได้แก่ **Gill slits**, **Atrium**, **Ventricle**, **Liver** (แสดงเป็นสองพู), **Spleen**, **Stomach**, **Spiral colon**, **Gonad**"
              }
            ]
          },
          {
            "sub": "ปลากระเบน p.32",
            "body": [
              {
                "text": "ป้ายชื่อได้แก่ **Heart**, **Liver**, **Gallbladder**, **Esophagus**, **Pancreas**, **Spleen**, **Stomach**, **Spiral colon**, **Spinal column**, **Gonad**, **Rectal gland**, **Kidney**"
              }
            ]
          },
          {
            "callout": "สองโครงสร้างที่โผล่มาเฉพาะกลุ่มปลากระดูกอ่อนในสไลด์ชุดนี้คือ **spiral colon** (ทั้งฉลามและกระเบน) และ **rectal gland** (ในกระเบน) นอกจากนี้ฉลามใช้ **gill slits** ไม่ใช่ operculum แบบปลากระดูกแข็ง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ช่องลำตัว (Coelomic cavity)",
        "source": "AP2_Fish_bio p.33-36",
        "body": [
          {
            "text": "สไลด์แบ่ง coelomic cavity ออกเป็น"
          },
          {
            "bullets": [
              "**Abdominal cavity** หรือ **Pleuroperitoneal cavity**",
              "**Pericardial cavity**",
              "**Transverse septum**"
            ]
          },
          {
            "text": "p.33 มีรูปถ่ายปลาที่ผ่าเปิดช่องลำตัวประกอบ ส่วน p.34 ถึง p.36 เป็นรูปถ่ายซากปลาที่ผ่าเปิดช่องท้องเพิ่มอีก 3 รูป (รูปหนึ่งเห็นเหงือกกับตับสีเข้มและไขมันสีเหลืองชัด อีกรูปเป็นปลาที่เห็นอวัยวะภายในเต็มช่องท้อง และอีกรูปเป็นปลากะรังจุดฟ้าที่ผ่าเปิดข้างลำตัว)"
          },
          {
            "callout": "p.34 ถึง p.36 ไม่มีข้อความหรือป้ายชี้อวัยวะบนสไลด์ จึงระบุไม่ได้จากสไลด์ว่าอาจารย์ชี้อวัยวะใดในแต่ละรูป",
            "kind": "flag"
          },
          {
            "callout": "คำที่ควรจำคือ **transverse septum** ซึ่งเป็นแผ่นกั้นระหว่าง pericardial cavity กับ abdominal cavity ตามที่สไลด์จัดไว้ในกลุ่มเดียวกัน",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หน้าที่ของระบบผิวหนัง (The integumentary system: Function)",
        "source": "AP2_Fish_bio p.37",
        "body": [
          {
            "text": "สไลด์เปิดหัวข้อระบบผิวหนังด้วยการไล่หน้าที่ไว้ 7 ข้อ ผิวหนังปลาไม่ได้ทำแค่ห่อหุ้มร่างกาย"
          },
          {
            "bullets": [
              "**Body protection**",
              "**Sensory organ**",
              "**Breathing in larva** (ใช้หายใจในระยะตัวอ่อน)",
              "**Locomotion**",
              "**Osmoregulation**",
              "**Excretion**",
              "**Temperature regulation**"
            ]
          },
          {
            "callout": "สไลด์ให้มาเป็นรายการ 7 ข้อเท่านั้น ไม่ได้อธิบายกลไกของแต่ละหน้าที่",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "โครงสร้างผิวหนังและชั้น Epidermis",
        "source": "AP2_Fish_bio p.38-39",
        "body": [
          {
            "text": "โครงสร้างผิวหนังปลาแบ่งเป็น 2 ชั้นหลัก คือ **Epidermis** และ **Dermis**"
          },
          {
            "sub": "Epidermis",
            "body": [
              {
                "bullets": [
                  "**Ectodermal origin**",
                  "Thickness varies with **fish species, age, body region, environmental condition**",
                  "**Thinner than dermis layer**",
                  "**Metabolically active throughout the body and the lifespan**",
                  "**Transparent, no pigment**",
                  "Contain **mucous cell, club cell** etc."
                ]
              }
            ]
          },
          {
            "callout": "จำจุดเปรียบเทียบ Epidermis บางกว่า Dermis และ Epidermis ใสไม่มีเม็ดสี (เม็ดสีอยู่ที่ Dermis)",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ชั้น Dermis",
        "source": "AP2_Fish_bio p.40",
        "body": [
          {
            "bullets": [
              "**Mesodermal origin**",
              "แบ่งเป็น **Loose connective tissue layer** และ **Dense connective tissue layer**",
              "Major tissue component is **collagen**",
              "Contains **blood vessels, nerves, scale, adipose tissue, chromatophores**",
              "**Scute or osseous dermal plate** appear in **Coridoras** species"
            ]
          },
          {
            "callout": "สไลด์สะกดชื่อสกุลว่า \"Coridoras\" ตามที่พิมพ์บนสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "แผนภาพชั้นผิวหนังปลา (Diagram of fish skin)",
        "source": "AP2_Fish_bio p.41",
        "body": [
          {
            "text": "สไลด์เป็นแผนภาพ Fig. 1 ไล่จากผิวนอกเข้าสู่ผิวใน โดยมีป้ายชื่อโครงสร้างดังนี้"
          },
          {
            "bullets": [
              "**epithelium** ชั้นบนสุด ภายในมี **club cells** และ **mucous cell**",
              "**germ cell** และ **basal membrane** อยู่ใต้ชั้น epithelium",
              "**scale sac** และ **scale** ฝังอยู่ในชั้น dermis",
              "**dermis** แบ่งเป็น **loose connective tissue** (ชั้นที่มี scale อยู่) และ **dense connective tissue** (ชั้นล่างที่เป็นเส้นใยเรียงตัวหนาแน่น)",
              "**subdermal adipose tissue**",
              "**muscle tissue** ชั้นในสุด",
              "**melanophores** ชี้อยู่ทั้งบริเวณรอบ scale และในชั้น dense connective tissue"
            ]
          },
          {
            "callout": "แผนภาพนี้พิมพ์คำว่า \"demis\" กำกับวงเล็บปีกกาชั้นหนังแท้ ซึ่งเป็นการสะกดบนภาพต้นฉบับ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ภาพจุลกายวิภาคผิวหนังเปรียบเทียบระหว่างชนิดปลา",
        "source": "AP2_Fish_bio p.42-44",
        "body": [
          {
            "sub": "Catfish skin และ Red tail catfish",
            "body": [
              {
                "bullets": [
                  "ภาพบนกำกับ **Club cell** ที่ชั้น epidermis และ **Scale** ที่ชั้นลึกลงไป",
                  "ภาพล่าง (Red tail catfish) กำกับจากบนลงล่าง **Mucous cell**, **Club cell**, **Pigment** พร้อมวงเล็บปีกกาแยกชั้น **Epidermis** และ **Dermis**"
                ]
              }
            ]
          },
          {
            "sub": "Guppy fish และ Siamese fighting fish",
            "body": [
              {
                "bullets": [
                  "Guppy fish กำกับ **Scale** และ **Scale pocket**",
                  "Siamese fighting fish กำกับ **Mucous cell (alcian blue stain)** ซึ่งติดสีน้ำเงิน และ **Scale**"
                ]
              }
            ]
          },
          {
            "sub": "Comparison of catfish skin and guppy fish skin",
            "body": [
              {
                "text": "สไลด์วางภาพผิวหนังปลาดุกไว้บนและผิวหนังปลาหางนกยูงไว้ล่างเพื่อเปรียบเทียบ **สไลด์ไม่ได้เขียนสรุปข้อแตกต่างเป็นข้อความไว้** ให้ดูเทียบจากภาพเอง"
              }
            ]
          },
          {
            "callout": "สีย้อมที่สไลด์ระบุชัดคือ alcian blue สำหรับดู mucous cell ตรงนี้เป็นจุดที่ระบุชื่อสีย้อมไว้จริง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ชนิดของเกล็ด (SCALES)",
        "source": "AP2_Fish_bio p.45-46",
        "body": [
          {
            "text": "สไลด์ระบุเกล็ดปลาไว้ 4 ชนิด"
          },
          {
            "bullets": [
              "**Placoid**",
              "**Ganoid**",
              "**Cycloid**",
              "**Ctenoid**"
            ]
          },
          {
            "text": "ด้านล่างของรายการมีข้อความไทยพิมพ์กำกับไว้ว่า **ฉลาม, การ์, ปลาครีบอ่อน, ปลาครีบแข็ง** เรียงตามลำดับเดียวกับรายชื่อเกล็ด 4 ชนิด"
          },
          {
            "callout": "สไลด์ไม่ได้ลากเส้นจับคู่ระหว่างข้อความไทยกับชื่อเกล็ดแต่ละชนิด ให้ยึดตามลำดับที่พิมพ์เท่านั้น อย่าเดาเกินจากนี้",
            "kind": "warn"
          },
          {
            "text": "หน้าถัดมาเป็นภาพจริงกำกับว่า **Ganoid scale** (ผิวปลาที่เกล็ดเรียงเป็นแผ่นสี่เหลี่ยมมันวาว) และ **Placoid scale** (แถวหนามเรียงตามลำตัวปลา)"
          }
        ]
      },
      {
        "heading": "Cycloid scale, Ctenoid scale และ scale pocket",
        "source": "AP2_Fish_bio p.47-49",
        "body": [
          {
            "bullets": [
              "**Cycloid scale** สไลด์ใช้ภาพปลาอะโรวานาที่เกล็ดใหญ่ขอบมน",
              "หน้าถัดมาเป็นภาพจุลกายวิภาคของปลาอะโรวานากำกับ **Scale** และ **Scale pocket** โดยตีวงสีเขียวรอบ scale pocket ไว้",
              "**Ctenoid scale** สไลด์ใช้ภาพปลานิลและภาพเกล็ดที่หลุดออกมาวางเรียงบนพื้นน้ำเงิน มีภาพขยายเกล็ดเดี่ยวที่เห็นส่วนสีเข้ม"
            ]
          },
          {
            "callout": "สไลด์นำเสนอ cycloid กับ ctenoid ด้วยภาพตัวอย่างล้วน ไม่ได้เขียนนิยามความต่างของขอบเกล็ดเป็นข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Scute",
        "source": "AP2_Fish_bio p.50",
        "body": [
          {
            "text": "สไลด์มีหัวข้อ **Scute** พร้อมภาพปลาที่มีแผ่นแข็งเรียงเป็นแนวตามลำตัวและโคนหาง **สไลด์หน้านี้ไม่มีคำอธิบายเป็นข้อความ** มีเพียงชื่อหัวข้อกับภาพ"
          },
          {
            "callout": "ต้องอ่านคู่กับสไลด์ Dermis (p.40) ที่ระบุว่า scute หรือ osseous dermal plate พบใน Coridoras species",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Chromatophore และชนิดของเซลล์เม็ดสี",
        "source": "AP2_Fish_bio p.51",
        "body": [
          {
            "text": "สไลด์แบ่งการเปลี่ยนสีของปลาเป็น 2 แบบ"
          },
          {
            "bullets": [
              "**Morphological colour change**",
              "**Physiological colour change**"
            ]
          },
          {
            "sub": "Type (ชนิดของ chromatophore)",
            "body": [
              {
                "bullets": [
                  "**Melanophore : black, brown**",
                  "**Xanthrophore : yellow, orange**",
                  "**Erythorophore : red, orange**",
                  "**Iridophore : iridescent colour**",
                  "**Leucophore : metalic colour**"
                ]
              }
            ]
          },
          {
            "callout": "ชื่อเซลล์และคำบรรยายสีคัดตามที่พิมพ์บนสไลด์ทุกตัวอักษร รวมถึง Xanthrophore, Erythorophore และ metalic",
            "kind": "flag"
          },
          {
            "callout": "สไลด์ไม่ได้อธิบายว่า morphological กับ physiological colour change ต่างกันอย่างไร บอกแค่ว่ามี 2 แบบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "การเปลี่ยนสีตามสภาพแวดล้อมและ Melanophore",
        "source": "AP2_Fish_bio p.52-53",
        "body": [
          {
            "text": "สไลด์เทียบภาพลำตัวปลาใน **Dark environment** (บน) กับ **Light environment** (ล่าง) โดยมีลูกศรไล่ระดับจากบนลงล่างระหว่างสองสภาวะ"
          },
          {
            "text": "ภาพประกอบด้านขวาเป็นแผงภาพเซลล์เม็ดสี 9 ช่อง ไล่จากเซลล์ที่แผ่แขนงกระจายเม็ดสีเต็มเซลล์ (บน) ไปจนเม็ดสีรวมกันเป็นจุดกลม (ล่าง) และมีแผนภาพกำกับว่า Colour change in fish or frog melanophore cell โดยฝั่งหนึ่งเขียนว่า **Cell appears dark, Melanosomes dispersed throughout cell** และอีกฝั่งเขียนว่า **Cell appears light, Melanosomes aggregated in centre of cell**"
          },
          {
            "text": "สไลด์ถัดมาเป็นภาพจุลทรรศน์ของครีบปลากำกับว่า **Melanophore : black, brown** เห็นเม็ดสีดำเรียงเป็นแนวตามก้านครีบ"
          }
        ]
      },
      {
        "heading": "ภาพ chromatophore ในเนื้อเยื่อจริงและ Camouflage",
        "source": "AP2_Fish_bio p.54-56",
        "body": [
          {
            "text": "สองสไลด์แรกของช่วงนี้เป็นภาพล้วน ไม่มีข้อความกำกับบนสไลด์"
          },
          {
            "bullets": [
              "ภาพจุลกายวิภาคผิวหนังย้อม H&E เห็นเซลล์รูปดาวสีน้ำตาลดำแทรกอยู่ในชั้น epidermis และแถบเม็ดสีเรียงในชั้น dermis",
              "ภาพปลาหางนกยูง 4 ตัวที่หางมีสีต่างกัน (ดำ 3 ตัว ส้มแดง 1 ตัว) คู่กับภาพขยายเซลล์เม็ดสีเดี่ยวและกลุ่มเซลล์เม็ดสีที่มีเม็ดสีขนาดต่างกันภายใน"
            ]
          },
          {
            "text": "สไลด์สุดท้ายของหัวข้อนี้ชื่อ **Camouflage** พร้อมภาพปลาที่มีลายและสีกลืนไปกับก้อนหินและสาหร่ายสีแดงม่วงในธรรมชาติ **สไลด์ไม่ได้เขียนคำอธิบายเรื่องกลไกการพรางตัวไว้**"
          }
        ]
      },
      {
        "heading": "The musculoskeletal system: โครงกระดูกปลา",
        "source": "AP2_Fish_bio p.57",
        "body": [
          {
            "text": "สไลด์เปิดหัวข้อด้วยแผนภาพโครงกระดูกปลาทั้งตัว มีป้ายชื่อกระดูกดังนี้"
          },
          {
            "bullets": [
              "**Proximal pterygiophore**, **Supraneurals**",
              "**Scapula**, **Ceracoid**, **Pectoral radial**, **Postcleithrum**",
              "**Pelvic girdle (basipterygia)**, **Inter-musculars**",
              "**Pleural ribs**",
              "**Last precaudal vertebra**, **First caudal vertebra**",
              "**Neural spine**, **Haemal spine**, **Vertebral centrum**",
              "**Anal spine**, **Anal ray**"
            ]
          },
          {
            "callout": "ชื่อกระดูกคัดตามที่พิมพ์บนแผนภาพ รวมถึง Ceracoid ที่สะกดแบบนี้บนภาพต้นฉบับ",
            "kind": "flag"
          },
          {
            "callout": "แผนภาพวงกลมสีแดงเน้นบริเวณโคนหาง (caudal region) พร้อมลากลูกศรออกไปนอกภาพ แต่สไลด์ไม่ได้เขียนข้อความอธิบายว่าวงนั้นสื่อถึงอะไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "หน้าที่ของระบบกล้ามเนื้อและกระดูก (Function: Support)",
        "source": "AP2_Fish_bio p.58-59",
        "body": [
          {
            "text": "สไลด์ระบุหน้าที่ภายใต้หัวข้อ **Support** ไว้ 4 ข้อ"
          },
          {
            "bullets": [
              "**Body structure**",
              "**Feeding and respiration**",
              "**Locomotion**",
              "**Buoyancy**"
            ]
          },
          {
            "text": "สไลด์ถัดมาขึ้นคำว่า Function ทับบนภาพปกสื่อชื่อ THE INCREDIBLE EVOLUTION OF FISH BODIES **เป็นสไลด์สื่อประกอบ ไม่มีเนื้อหาข้อความเพิ่มเติม**"
          }
        ]
      },
      {
        "heading": "Muscle fiber type: white, red, intermediate",
        "source": "AP2_Fish_bio p.60-62",
        "body": [
          {
            "text": "หัวข้อ **Structure** ของระบบกล้ามเนื้อ ระบุ **Muscle fiber type** ไว้ 3 ชนิด"
          },
          {
            "bullets": [
              "**White muscle**",
              "**Red muscle**",
              "**Intermediate muscle**"
            ]
          },
          {
            "text": "สไลด์ถัดมาใช้ภาพเนื้อปลาจริงประกอบ ทั้งเนื้อแซลมอนสีส้ม เนื้อปลานิลแล่สีขาวชมพูที่เห็นแถบสีเข้มตามแนวข้างลำตัว และภาพชิ้นเนื้อปลาแบบตัดขวาง **สไลด์ไม่ได้เขียนคำบรรยายกำกับภาพเหล่านี้**"
          },
          {
            "sub": "Fig. 5 การแยกชนิดกล้ามเนื้อด้วย Succinate dehydrogenase reaction",
            "body": [
              {
                "text": "สไลด์แสดงภาพตัดขวางกล้ามเนื้อปลาที่ย้อมด้วย **Succinate dehydrogenase reaction** แล้วตีวงชี้ 3 บริเวณ"
              },
              {
                "bullets": [
                  "วงบนสุดชี้ไปที่ **Dark muscle** ซึ่งติดสีเข้ม",
                  "วงกลางชี้ไปที่ **Intermdediate muscle** (สะกดตามที่พิมพ์บนภาพ)",
                  "วงล่างชี้ไปที่ **White muscle**"
                ]
              },
              {
                "callout": "ภาพขยายของ dark muscle เห็นจุดสีเข้มแทรกระหว่างเส้นใยกล้ามเนื้อมากกว่าภาพขยายของ white muscle อย่างชัดเจน ตรงนี้คือสิ่งที่ปฏิกิริยานี้ทำให้เห็น แต่สไลด์ไม่ได้เขียนอธิบายความหมายของปฏิกิริยาไว้เป็นข้อความ",
                "kind": "warn"
              }
            ]
          }
        ]
      },
      {
        "heading": "Circulatory system: เปรียบเทียบปลา สัตว์ครึ่งบกครึ่งน้ำ และสัตว์เลี้ยงลูกด้วยนม",
        "source": "AP2_Fish_bio p.63",
        "body": [
          {
            "text": "สไลด์วางแผนภาพหัวใจและวงจรเลือด 3 ภาพเทียบกัน กำกับใต้ภาพว่า **fish**, **amphibian**, **mammal**"
          },
          {
            "bullets": [
              "**fish** มี **gill capillaries** อยู่บนสุด และหัวใจกำกับเพียง **ventricle** กับ **atrium** เป็นวงจรเดียว",
              "**amphibian** มี **lung capillaries** และหัวใจกำกับ **atria** (สองห้อง) กับ **ventricle** เดียว",
              "**mammal** มี **lung capillaries** และหัวใจกำกับ **atria** กับ **ventricles** (สองห้อง)"
            ]
          },
          {
            "callout": "จุดที่ภาพสื่อคือปลาส่งเลือดผ่าน gill capillaries ในวงจรเดียว ต่างจาก amphibian และ mammal ที่ผ่าน lung capillaries สไลด์สื่อด้วยภาพ ไม่ได้เขียนสรุปเป็นข้อความ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "หัวใจปลา (Heart)",
        "source": "AP2_Fish_bio p.64-65",
        "body": [
          {
            "text": "สไลด์ระบุว่าหัวใจปลาเป็น **Two chamber** แต่ไล่ส่วนประกอบไว้ 4 ส่วน"
          },
          {
            "bullets": [
              "**Atrium**",
              "**Ventricle**",
              "**Bulbus arteriosus**",
              "**Sinus venosus**"
            ]
          },
          {
            "callout": "สไลด์เขียนหัวข้อว่า Two chamber แต่ระบุส่วนประกอบ 4 อย่าง สไลด์ไม่ได้อธิบายว่าทำไมนับเป็น 2 ห้อง",
            "kind": "warn"
          },
          {
            "sub": "แผนภาพทางเดินเลือดในหัวใจ",
            "body": [
              {
                "text": "แผนภาพด้านซ้ายกำกับ **pericardial sac** หุ้มอยู่รอบนอก และแสดงทิศทางเลือดด้วยลูกศร"
              },
              {
                "bullets": [
                  "เลือดเข้าทาง **sinus venosus** เข้าสู่ **atrium**",
                  "จาก atrium ลงสู่ **ventricle**",
                  "จาก ventricle ออกสู่ **bulbus arteriosus** แล้วต่อไปยัง **ventral aorta**"
                ]
              },
              {
                "text": "แผนภาพด้านขวาเป็นมุมมองอีกด้าน กำกับ **ventral aorta**, **atrium**, **bulbus arteriosus**, **ventricle**, **pericardial sac** และ **common cardinal**"
              }
            ]
          }
        ]
      },
      {
        "heading": "หลอดเลือดของปลาและตำแหน่งเจาะเลือดที่ caudal vein",
        "source": "AP2_Fish_bio p.66-67",
        "body": [
          {
            "text": "สไลด์ p.66 วางแผนภาพหลอดเลือดทั้งตัวปลา 4 ภาพ แยกฝั่งหลอดเลือดแดง (ภาพลงสีแดง) และหลอดเลือดดำ (ภาพที่ตัวย่อลงท้ายด้วย v.) พร้อมภาพขยายบริเวณหัว **แผนภาพใช้ตัวย่อล้วนและสไลด์ไม่ได้กางคำเต็มไว้**"
          },
          {
            "text": "สไลด์ p.67 เป็นแผนภาพหลอดเลือดหลักของปลาที่มีป้ายชื่อเต็ม"
          },
          {
            "bullets": [
              "**Ventral aorta** และ **Dorsal aorta**",
              "**Hepatic artery**, **Gastric artery**, **Gonadal arteries**, **Renal artery**, **Parietal artery**",
              "**Abdominal vein**, **Subintestinal vein**",
              "**Dorsal segmental arteries and veins**",
              "**Caudal artery and vein**"
            ]
          },
          {
            "text": "ภาพล่างของสไลด์เดียวกันแสดงการแทงเข็มเข้าบริเวณโคนหางใต้แนวกระดูกสันหลัง พร้อมภาพตัดขวางของกระดูกสันหลังที่แสดงตำแหน่งหลอดเลือด ภาพนี้อ้างอิงหนังสือ **Stoskopf FISH MEDICINE Volume I**"
          },
          {
            "callout": "ภาพเจาะเลือดสอดคล้องกับป้าย Caudal artery and vein ในแผนภาพบน แต่สไลด์ไม่ได้เขียนขั้นตอนหรือมุมเข็มเป็นข้อความ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "เม็ดเลือดแดงของปลา",
        "source": "AP2_Fish_bio p.68",
        "body": [
          {
            "text": "สไลด์เป็นภาพ blood smear กำลังขยายสูง มีป้ายชี้เพียง 2 คำคือ **nucleus** และ **red blood cell** พร้อม scale bar **20 µm**"
          },
          {
            "text": "ภาพแสดงว่า **red blood cell ของปลามีนิวเคลียส** และรูปร่างเป็นวงรี นอกจากนี้ในภาพยังเห็นเซลล์ที่ติดสีเข้มกว่าและมีขนาดเล็กกว่าแทรกอยู่ แต่สไลด์ไม่ได้กำกับชื่อเซลล์เหล่านั้น"
          },
          {
            "callout": "ตัวเลขเดียวที่พิมพ์บนสไลด์นี้คือ scale bar 20 µm ไม่มีค่าปกติของเม็ดเลือดใด ๆ บนสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "The respiratory system: องค์ประกอบและกลไกหลัก",
        "source": "AP2_Fish_bio p.69",
        "body": [
          {
            "text": "สไลด์เปิดหัวข้อระบบหายใจด้วยรายการ 8 ข้อ"
          },
          {
            "bullets": [
              "**5 pairs of gill arches**",
              "**last pair changed to be pharyngeal bone**",
              "**Primary lamellae or primary gill filament**",
              "**Secondary lamellae or secondary gill filament**",
              "**Gill raker**",
              "**Dendrite, diverticula, labyrinth**",
              "**Suction pump, ram ventilation**",
              "**Counter current system**"
            ]
          },
          {
            "callout": "ตัวเลข 5 pairs of gill arches และประเด็นที่คู่สุดท้ายเปลี่ยนไปเป็น pharyngeal bone เป็นข้อเท็จจริงเชิงตัวเลขที่สไลด์ระบุชัด",
            "kind": "tip"
          },
          {
            "callout": "สไลด์ให้มาเป็นรายการหัวข้อล้วน ไม่ได้อธิบายว่า dendrite, diverticula, labyrinth คืออะไร หรือ suction pump ต่างจาก ram ventilation อย่างไร",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "โครงสร้างเหงือกและ Counter current system",
        "source": "AP2_Fish_bio p.70",
        "body": [
          {
            "text": "สไลด์แสดงเหงือกปลาจากตัวอย่างจริงคู่กับแผนภาพ"
          },
          {
            "bullets": [
              "แผนภาพซ้ายเป็นหัวปลาแสดงตำแหน่งเหงือก โดยส่วนสีเหลืองกำกับว่า **Gill raker** และส่วนสีแดงเป็นซี่เหงือก",
              "แผนภาพขวาขยายให้เห็น **Gill filament with lamellae** พร้อมลูกศรสีน้ำเงินแสดง **Flow of water** ไหลผ่านระหว่างซี่เหงือก",
              "ภาพถ่ายด้านล่างแสดงเหงือกปลาที่ผ่าเปิดแผ่นปิดเหงือกออก เห็นซี่เหงือกสีชมพูแดง"
            ]
          },
          {
            "sub": "Counter current system",
            "body": [
              {
                "text": "แผนภาพขวาสุดวางลูกศร **Water** (สีน้ำเงิน ชี้ลง) และ **Blood** (สีแดง ชี้ขึ้น) สวนทางกัน แล้วเขียนตัวเลขไล่ระดับกำกับไว้แต่ละคู่ระดับ ค่าที่อ่านได้คือฝั่งน้ำ 100, 70, 40, 15 และฝั่งเลือด 90, 60, 30, 5"
              },
              {
                "callout": "ตัวเลขบนแผนภาพนี้พิมพ์เล็กมาก ค่าที่บันทึกไว้เป็นค่าที่อ่านได้จากภาพ ถ้าจะใช้อ้างอิงเป๊ะ ๆ ควรเปิดสไลด์ยืนยันอีกครั้ง สิ่งที่แผนภาพสื่อชัดคือค่าฝั่งน้ำสูงกว่าฝั่งเลือดที่ทุกระดับตลอดแนวแลกเปลี่ยน",
                "kind": "warn"
              },
              {
                "callout": "สไลด์ไม่ได้เขียนอธิบายเป็นข้อความว่าทำไมการไหลสวนทางจึงให้ประสิทธิภาพสูงกว่า มีเพียงชื่อหัวข้อในสไลด์ก่อนหน้าและแผนภาพนี้",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาพผ่าเหงือก (gill) ในตัวปลาและซี่เหงือกที่แยกออกมา",
        "source": "AP2_Fish_bio p.71-72",
        "body": [
          {
            "text": "สองสไลด์นี้เป็นภาพถ่ายล้วน **ไม่มีข้อความหรือคำบรรยายกำกับ** มีเพียงลูกศรชี้ไปยังโครงสร้าง สไลด์ไม่ได้เขียนชื่อโครงสร้างที่ลูกศรชี้เอาไว้"
          },
          {
            "bullets": [
              "p.71 ภาพเปิดแผ่นปิดเหงือกของปลาที่ยังอยู่ในตัว เห็นซี่เหงือกเรียงกันหลายชุด สีแดงเข้ม ลูกศรชี้ขึ้นไปที่ส่วนสีแดงซึ่งเป็นแผงเส้นใยเหงือก (filament)",
              "p.72 ภาพเหงือก 1 arch ที่แยกออกมาวางบนพื้นขาว ด้านบนเป็นแผงเส้นใยสีแดง ด้านล่างของ arch เป็นแท่งเรียวสีชมพูอ่อนเรียงเป็นซี่ ลูกศรชี้ไปที่แท่งเรียวสีชมพูอ่อนชุดนี้"
            ]
          },
          {
            "callout": "ทั้งสองภาพมีวันที่ประทับบนภาพ 25 6 2005 ซึ่งเป็นวันที่ถ่ายรูป ไม่ใช่เนื้อหาวิชาการ",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "The digestive system - สไลด์เปิดหัวข้อ",
        "source": "AP2_Fish_bio p.73-74",
        "body": [
          {
            "text": "p.73 เป็นสไลด์เปิดหัวข้อ **ตัวหนังสือหัวข้อถูกภาพถ่ายทับจนอ่านได้ไม่ครบ** เห็นชัดเฉพาะคำว่า The ที่บรรทัดบน และคำลงท้ายที่อ่านได้ว่า system ส่วนคำกลางถูกภาพบัง"
          },
          {
            "bullets": [
              "ภาพซ้ายบน ผ่าเปิดช่องท้องปลา เห็นอวัยวะภายในและเยื่อบุช่องท้อง",
              "ภาพขวาบน ผ่าเปิดปลา เห็นอวัยวะสีเขียวเข้มอยู่ในช่องท้อง",
              "ภาพล่าง ทางเดินอาหารที่แยกออกมาทั้งชุด เห็นส่วนต้นที่แตกเป็นแขนงหลายแฉก ต่อกับท่อยาวขดไปมา"
            ]
          },
          {
            "text": "p.74 เป็นภาพหัวปลา 2 ภาพ ภาพซ้ายเป็นหัวปลาที่เห็นฟันในปาก ภาพขวาเป็นปลาหัวโตอ้าปากเห็นภายในช่องปาก **สไลด์ไม่มีคำบรรยายกำกับทั้งสองภาพ** จึงไม่ได้ระบุว่าต้องการให้ดูจุดใดเป็นพิเศษ"
          }
        ]
      },
      {
        "heading": "รูปแบบทางเดินอาหารแตกต่างกันตามชนิดปลา",
        "source": "AP2_Fish_bio p.75",
        "body": [
          {
            "text": "สไลด์เป็นแผนภาพลายเส้นเปรียบเทียบรูปร่างทางเดินอาหารของปลาแต่ละกลุ่ม พร้อมคำกำกับภาษาอังกฤษบนภาพ และมีคำไทยเขียนไว้ใต้ภาพเป็นแถวเดียวกัน"
          },
          {
            "sub": "คำกำกับภาษาอังกฤษบนแผนภาพ (ตามที่พิมพ์)",
            "body": [
              {
                "bullets": [
                  "แถวบน Seahorse, Carp/goldfish, Catfish (มีคำว่า Stomach กำกับที่ภาพ Catfish)",
                  "แถวล่าง Shark/ray มีคำกำกับ **Spiral colon**",
                  "แถวล่าง Flounder มีคำกำกับ **Pyloric pouches** และคำว่า Stomach",
                  "แถวล่าง Trout/salmon มีคำกำกับ **Pyloric ceca**"
                ]
              }
            ]
          },
          {
            "sub": "คำไทยใต้ภาพ (ตามที่พิมพ์)",
            "body": [
              {
                "text": "ม้าน้ำ, คาร์พ, ดุก, ฉลาม, ช่อน, เทราท์"
              }
            ]
          },
          {
            "callout": "จุดที่ต้องระวัง คำไทยลำดับที่ 5 คือ ช่อน แต่ภาพลำดับเดียวกันเขียนภาษาอังกฤษว่า Flounder สไลด์ไม่ได้อธิบายว่าทำไมสองคำนี้ไม่ตรงกัน จึงไม่ควรจับคู่เองโดยไม่ถามอาจารย์",
            "kind": "warn"
          },
          {
            "callout": "ภาพในสไลด์ถูกครอบตัด ที่ขอบขวาบนมีตัวอักษรของคำกำกับอีกหนึ่งภาพโผล่มาแต่ถูกตัดหายไป จึงอาจมีปลาอีกชนิดในแผนภาพต้นฉบับที่มองไม่เห็นในสไลด์นี้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การสลาย hemoglobin ไปเป็น biliverdin และ bilirubin",
        "source": "AP2_Fish_bio p.76",
        "body": [
          {
            "text": "สไลด์เป็นแผนภาพเปรียบเทียบเส้นทางเมแทบอลิซึมของ heme ระหว่างกลุ่มสัตว์ ตามลำดับต้นทางดังนี้"
          },
          {
            "bullets": [
              "**Hemoglobin** แยกออกเป็น **Heme** และ **Globin**",
              "**Heme** แยกออกเป็น **Fe** และ **Biliverdin (green)**"
            ]
          },
          {
            "sub": "การเปรียบเทียบระหว่างกลุ่มสัตว์ (3 คอลัมน์ตามที่พิมพ์)",
            "body": [
              {
                "bullets": [
                  "คอลัมน์ 1 **AVES, REPTILE, AMPHIBIA**",
                  "คอลัมน์ 2 **PISCES**",
                  "คอลัมน์ 3 **MAMMAL**"
                ]
              },
              {
                "text": "ทั้ง PISCES และ MAMMAL แสดงลำดับเหมือนกันคือ **(REDUCTION)** ต่อไปเป็น **Bilirubin (Unconjugated, yellow and unsoluble in water)** แล้วต่อไปเป็น **(CONJUGATION)** แล้วเป็น **Bilirubin (Conjugated, yellow and ...)**"
              },
              {
                "text": "บนแผนภาพมีข้อความขีดเส้นใต้ว่า **PRIMARY PATHWAY IN MOST SPECIES** พร้อมเส้นหนากำกับ"
              }
            ]
          },
          {
            "callout": "ข้อความบรรทัดสุดท้ายของแผนภาพถูกตัดที่ขอบล่างของสไลด์ อ่านได้แค่ Bilirubin (Conjugated, yellow and ... ส่วนที่เหลืออ่านไม่ออก และตำแหน่งที่เส้นหนาของ PRIMARY PATHWAY IN MOST SPECIES เชื่อมไปหาคอลัมน์ใดนั้นดูจากภาพในสไลด์ไม่ชัดพอจะยืนยัน",
            "kind": "flag"
          },
          {
            "text": "ด้านขวาของสไลด์มีภาพถ่าย 2 ภาพ ภาพบนเป็นช่องท้องปลาที่เห็นอวัยวะสีเขียวสด ภาพล่างเป็นช่องท้องปลาที่เห็นอวัยวะสีเข้มเกือบดำ **สไลด์ไม่ได้ใส่คำบรรยายภาพว่าเป็นอวัยวะใด**"
          }
        ]
      },
      {
        "heading": "Swim bladder",
        "source": "AP2_Fish_bio p.77-80",
        "body": [
          {
            "sub": "ข้อความบนสไลด์ p.77 (มีเท่านี้)",
            "body": [
              {
                "bullets": [
                  "**Pneumatic duct**",
                  "**Gas gland**"
                ]
              },
              {
                "text": "สไลด์ให้มาแค่สองคำนี้ **ไม่ได้อธิบายว่าแต่ละอย่างทำหน้าที่อะไรหรืออยู่ตรงไหน**"
              }
            ]
          },
          {
            "sub": "ภาพประกอบ",
            "body": [
              {
                "bullets": [
                  "p.77 ภาพซ้าย ปลาผ่าเปิดช่องท้อง มีก้อนสีน้ำตาลอ่อนเป็นเม็ดวางอยู่ข้างตัว ภาพขวา ปลามีเกล็ด ผ่าเปิดเห็นถุงผนังบางใสสีขาวอมม่วง 2 ห้องเรียงกันใต้แนวสันหลัง มีเส้นเลือดแดงพาดผ่าน และมีอวัยวะสีเหลืองเป็นเม็ดอยู่ด้านล่าง",
                  "p.78 ภาพปลาเก๋าจุดฟ้าผ่าเปิดข้างลำตัว เห็นถุงผนังบางโปร่งแสงยาวตลอดแนวช่องท้องด้านบน และมีอวัยวะสีเหลืองส้มอยู่ด้านหน้าล่าง **ไม่มีคำบรรยายบนสไลด์**",
                  "p.79 ภาพระยะใกล้ของช่องท้องปลา เห็นอวัยวะรูปยาวรี ผิวมันวาว สีเทาเข้มเกือบดำ วางอยู่เหนืออวัยวะสีแดง **สไลด์ไม่มีคำบรรยายและไม่มีลูกศรชี้ จึงระบุไม่ได้ว่าต้องการให้ดูอะไร**",
                  "p.80 ภาพปลาเกล็ด (คล้ายภาพขวาของ p.77 แต่ถ่ายเต็มตัว) ผ่าเปิดเห็นถุงผนังบาง 2 ห้อง ตับ และอวัยวะสีเหลืองเป็นเม็ดจำนวนมากที่ล้นออกมานอกช่องท้อง **ไม่มีคำบรรยายบนสไลด์**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "The reproductive system - ลักษณะภายนอกและโครงสร้างภายใน",
        "source": "AP2_Fish_bio p.81",
        "body": [
          {
            "sub": "External feature",
            "body": [
              {
                "bullets": [
                  "**Pearl organ**",
                  "**Colour**",
                  "**Enlarge abdomen**",
                  "**Gonopodium, etc**"
                ]
              }
            ]
          },
          {
            "sub": "Internal structure",
            "body": [
              {
                "bullets": [
                  "**Testis / Ovary**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้มาเป็นรายการหัวข้อล้วน ไม่ได้อธิบายว่า pearl organ คืออะไร หรือ gonopodium พบในปลากลุ่มไหน คำว่า etc บนสไลด์บอกด้วยว่ายังมีลักษณะภายนอกอื่นอีกที่สไลด์ไม่ได้ระบุ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ภาพประกอบลักษณะภายนอกที่ใช้แยกเพศ",
        "source": "AP2_Fish_bio p.82-84",
        "body": [
          {
            "text": "p.82 มีภาพปลา 4 ภาพเรียงเป็นตาราง **ไม่มีคำบรรยายกำกับภาพใดเลย** สไลด์จึงไม่ได้บอกว่าแต่ละภาพต้องการแสดงลักษณะข้อไหนจากรายการใน p.81"
          },
          {
            "bullets": [
              "ซ้ายบน ปลาทองหัวมีก้อนเนื้อนูนเป็นตะปุ่มตะป่ำคลุมทั้งหัว",
              "ขวาบน ปลาหางนกยูงสีสันสด ครีบหางแผ่กว้าง ลำตัวเรียว",
              "ซ้ายล่าง ปลาผิวหนังไม่มีเกล็ดถูกผ่าเปิด เห็นผิวหนังบริเวณลำตัวมีตุ่มนูนเล็ก ๆ",
              "ขวาล่าง ปลาหางนกยูงสีส้มทอง ลำตัวป้อม ท้องอูม"
            ]
          },
          {
            "text": "p.83 เป็นภาพเปรียบเทียบส่วนท้องด้านล่างของปลา 2 ตัววางคู่กัน **มีคำกำกับชัดเจนว่า Male ที่ตัวซ้าย และ Female ที่ตัวขวา** เห็นรูเปิดบริเวณใต้ท้องซึ่งมีรูปร่างต่างกันระหว่างสองตัว สไลด์ไม่ได้เขียนชื่อรูเปิดนั้นไว้"
          },
          {
            "text": "p.84 เป็นภาพปลาหางนกยูง 2 ตัวว่ายในน้ำ ตัวซ้ายเรียวและมีแต้มสีเหลืองส้มดำชัด ตัวขวาลำตัวใหญ่กว่าและสีจาง **สไลด์ไม่ได้ระบุว่าตัวไหนเพศอะไร** มีเพียงที่มาของภาพพิมพ์ไว้ว่า https://emilyakane.blogspot.com/2016/07/the-sinful-side-of-guppies.html"
          }
        ]
      },
      {
        "heading": "ภาพอวัยวะสืบพันธุ์และการรีดเซลล์สืบพันธุ์",
        "source": "AP2_Fish_bio p.85-86",
        "body": [
          {
            "text": "ทั้งสองสไลด์เป็นภาพถ่ายล้วน **ไม่มีคำบรรยายกำกับ** จึงไม่ได้ระบุว่าเป็นอวัยวะเพศผู้หรือเพศเมียในแต่ละภาพ"
          },
          {
            "bullets": [
              "p.85 ภาพบน มือจับปลาดุกแล้วรีดที่ท้อง มีสายวัสดุสีส้มอมแดงเป็นเม็ดไหลออกจากรูเปิดใต้ท้อง ภาพล่าง ปลาถูกผ่าเปิดช่องท้อง ใช้ปากคีบชี้ก้อนเนื้อสีน้ำตาลอ่อนผิวเป็นเม็ดละเอียด",
              "p.86 ภาพซ้ายบนและขวาบน ปลาหนังผ่าเปิดช่องท้องด้านข้าง เห็นอวัยวะสีขาวแบ่งเป็นพูหลายแฉก ภาพล่าง ปลามีจุดสีส้มบนหัวถูกผ่าเปิดข้างลำตัว เห็นอวัยวะสีขาวยาวอยู่ในช่องท้อง"
            ]
          }
        ]
      },
      {
        "heading": "Prespawning และ Postspawning",
        "source": "AP2_Fish_bio p.87",
        "body": [
          {
            "text": "สไลด์เป็นภาพลายเส้นปลา 2 ตัว เปรียบเทียบช่องท้องก่อนและหลังวางไข่ **มีคำกำกับบนภาพเพียง 2 คำ**"
          },
          {
            "bullets": [
              "ภาพบน **Postspawning** ช่องท้องมีเนื้อที่ว่าง อวัยวะภายในเห็นเป็นแนวเรียวแบน",
              "ภาพล่าง **Prespawning** ช่องท้องถูกเติมเต็มด้วยโครงสร้างเป็นเม็ดจำนวนมากจนขยายเต็มพื้นที่"
            ]
          },
          {
            "callout": "มุมขวาล่างของสไลด์มีปกหนังสือ Stoskopf FISH MEDICINE Volume I แสดงว่าภาพนี้มาจากหนังสือเล่มดังกล่าว",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Reproduction - รูปแบบการปฏิสนธิและการออกลูก",
        "source": "AP2_Fish_bio p.88",
        "body": [
          {
            "sub": "sexual and asexual fertilization",
            "body": [
              {
                "bullets": [
                  "**Bisexual reproduction**",
                  "**Hermaphroditism**",
                  "**Pathenogenesis** (สะกดตามที่พิมพ์บนสไลด์)",
                  "**Gynogenesis**"
                ]
              }
            ]
          },
          {
            "sub": "Egg laying",
            "body": [
              {
                "bullets": [
                  "**Oviparus (external fertilization)**",
                  "**Viviparus (internal fertilization)**",
                  "**Ovoviviparus (live barrier)**"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์ให้มาเป็นรายการชื่อเท่านั้น ไม่ได้อธิบายนิยามของแต่ละรูปแบบ และไม่ได้ยกตัวอย่างชนิดปลาในสไลด์นี้ คำในวงเล็บที่พิมพ์ไว้ (external fertilization / internal fertilization / live barrier) คือคำอธิบายทั้งหมดที่มี",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Hermaphroditism",
        "source": "AP2_Fish_bio p.89",
        "body": [
          {
            "sub": "การแบ่งประเภทตามสไลด์",
            "body": [
              {
                "bullets": [
                  "1. **Synchronous**",
                  "2. **Asynchronous or / Sequential hermaphroditism** ซึ่งแบ่งย่อยเป็น 1. **Protandrous** และ 2. **Protogynous**"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างที่กำกับบนภาพลายเส้น",
            "body": [
              {
                "bullets": [
                  "**Synchronous** - Three spined stickleback",
                  "**Protandrous** - Clownfish พร้อมสัญลักษณ์ **เพศผู้เปลี่ยนเป็นเพศเมีย**",
                  "**Protogynous** - Haplochromis Cichlid พร้อมสัญลักษณ์ **เพศเมียเปลี่ยนเป็นเพศผู้**"
                ]
              }
            ]
          },
          {
            "callout": "ทิศทางการเปลี่ยนเพศบนสไลด์แสดงด้วยสัญลักษณ์เพศพร้อมลูกศรเท่านั้น ไม่มีคำอธิบายเป็นตัวหนังสือ ภาพมาจาก Stoskopf FISH MEDICINE Volume I",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "สไลด์วิดีโอประกอบเรื่อง Reproduction",
        "source": "AP2_Fish_bio p.90",
        "body": [
          {
            "text": "สไลด์นี้มีหัวข้อ **Reproduction** และภาพตัวอย่าง (thumbnail) ของคลิปวิดีโอ 4 คลิป **ไม่มีเนื้อหาตัวอักษรอื่นให้จด** เนื้อหาจริงอยู่ในคลิปที่เปิดในห้องเรียน"
          },
          {
            "bullets": [
              "คลิปซ้ายบน ผู้บรรยายชายในฉากใต้น้ำ มีโลโก้ BLUE WORLD และ SHARK ACADEMY",
              "คลิปขวาบน ปลาอะโรวาน่ากับกลุ่มไข่หรือลูกปลาสีส้ม",
              "คลิปซ้ายล่าง ปลาหางนกยูงเพศผู้และเพศเมีย มีแถบ HAWAII HOBBYIST",
              "คลิปขวาล่าง ปลาคาร์พในบ่อ มีข้อความ Koi Pond Natural Spawn"
            ]
          }
        ]
      },
      {
        "heading": "The excretory system - Osmoregulation และ Kidney",
        "source": "AP2_Fish_bio p.91-92",
        "body": [
          {
            "sub": "Osmoregulation",
            "body": [
              {
                "bullets": [
                  "**Fresh water fish**",
                  "**Marine fish**"
                ]
              },
              {
                "text": "สไลด์เขียนแค่สองกลุ่มนี้ **ไม่ได้อธิบายกลไกการควบคุมน้ำและเกลือของแต่ละกลุ่มไว้ในสไลด์**"
              }
            ]
          },
          {
            "sub": "Kidney",
            "body": [
              {
                "bullets": [
                  "**Anterior kidney, head kidney**",
                  "**Posterior kidney, trunk kidney**"
                ]
              },
              {
                "text": "สไลด์ให้ชื่อเรียกทั้งสองแบบของไตแต่ละส่วน แต่ **ไม่ได้ระบุหน้าที่ที่ต่างกันของ head kidney กับ trunk kidney**"
              }
            ]
          },
          {
            "text": "p.92 หัวข้อ **Kidney** พร้อมภาพถ่าย 2 ภาพ เป็นการผ่าเปิดปลาแล้วเลาะอวัยวะช่องท้องออก เห็นเนื้อเยื่อสีแดงเข้มอมม่วงเป็นแนวยาวแนบอยู่ใต้แนวกระดูกสันหลังตลอดความยาวลำตัว **สไลด์ไม่ได้ใส่คำกำกับแยกส่วนหน้าและส่วนท้ายบนภาพ**"
          }
        ]
      },
      {
        "heading": "The nervous system",
        "source": "AP2_Fish_bio p.93",
        "body": [
          {
            "sub": "หัวข้อบนสไลด์",
            "body": [
              {
                "bullets": [
                  "**Central nervous system**",
                  "**Brain**",
                  "**Spinal cord**",
                  "**Cranial nerve**",
                  "**Peripheral nervous system**",
                  "**Nerve**"
                ]
              },
              {
                "text": "สไลด์พิมพ์เรียงต่อกันแบบนี้ โดยไม่ได้แยกให้ชัดว่ารายการใดอยู่ใต้ CNS และรายการใดอยู่ใต้ PNS"
              }
            ]
          },
          {
            "sub": "ภาพประกอบ",
            "body": [
              {
                "bullets": [
                  "ภาพขวาบน กำกับว่า **Brain of yellow tail fish** (Fig. 2) เป็นสมองปลาที่แยกออกมา เห็นเป็นก้อนกลมหลายก้อนต่อกันเป็นแถวและมีไขสันหลังต่อท้าย",
                  "ภาพล่าง Fig. 1 เปรียบเทียบสมองของ **Fish, Lizard, primitive mammal และ human**"
                ]
              },
              {
                "sub": "คำกำกับตัวเลขใต้ Fig. 1 (ตามที่พิมพ์)",
                "body": [
                  {
                    "bullets": [
                      "1. **metencephalon (cerebellum + medulla)** กำกับว่า (ballance) สะกดตามสไลด์",
                      "2. **mesencephalon** กำกับว่า (vision)",
                      "3. **telencephalon** กำกับว่า (smell)"
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "The endocrine system - รายชื่อต่อมและตำแหน่งในตัวปลา",
        "source": "AP2_Fish_bio p.94-95",
        "body": [
          {
            "sub": "รายชื่อบนสไลด์ p.94",
            "body": [
              {
                "bullets": [
                  "**Thyroid gland**",
                  "**Pineal gland**",
                  "**Pituitary gland**",
                  "**Interrenal gland**",
                  "**Stanius body**",
                  "**Thymus gland**"
                ]
              },
              {
                "text": "สไลด์ให้เป็นรายชื่อ 6 ต่อม **ไม่ได้ระบุฮอร์โมนหรือหน้าที่ของแต่ละต่อม**"
              }
            ]
          },
          {
            "sub": "แผนภาพตำแหน่งอวัยวะ p.95 (คำกำกับตามที่พิมพ์)",
            "body": [
              {
                "bullets": [
                  "**Pituitary**, **Pineal**, **Sacculus vasculosus**, **Thymus**",
                  "**Interrenal gland**, **Suprarenal gland**, **Chromaffin tissue**",
                  "**Corpuscles of Stannius**, **Urophysis**",
                  "**Thyroid**, **Pseudobranch**, **Pancreas**, **Gonad**"
                ]
              }
            ]
          },
          {
            "callout": "สังเกตว่ารายการใน p.94 เขียนว่า Stanius body แต่แผนภาพใน p.95 เขียนว่า Corpuscles of Stannius สะกดไม่เหมือนกัน และแผนภาพยังมีอวัยวะที่ไม่ได้อยู่ในรายการ p.94 อีกหลายอย่าง เช่น Sacculus vasculosus, Suprarenal gland, Chromaffin tissue, Urophysis, Pseudobranch, Pancreas สไลด์ไม่ได้อธิบายว่าทำไมสองหน้าไม่ตรงกัน",
            "kind": "warn"
          },
          {
            "callout": "แผนภาพ p.95 มาจาก Stoskopf FISH MEDICINE Volume I",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Thyroid hormone production และโครงสร้างสมองปลา",
        "source": "AP2_Fish_bio p.96",
        "body": [
          {
            "text": "สไลด์นี้วางภาพ 3 ชุดไว้ด้วยกัน **ไม่มีข้อความอธิบายของอาจารย์เพิ่ม มีเฉพาะคำกำกับที่ติดมากับภาพ**"
          },
          {
            "sub": "ภาพซ้าย Thyroid Hormone Production",
            "body": [
              {
                "bullets": [
                  "**Hypothalamus** หลั่ง **TRH**",
                  "**Pituitary Gland** หลั่ง **TSH**",
                  "**Thyroid Gland** หลั่ง **T3 และ T4**"
                ]
              },
              {
                "text": "หมายเหตุ ภาพวาดที่ใช้แสดงแกนนี้เป็นภาพสมองและต่อมไทรอยด์แบบ**คน** ไม่ใช่ปลา"
              }
            ]
          },
          {
            "sub": "ภาพขวาบน Brain structure of the fish (perch)",
            "body": [
              {
                "bullets": [
                  "**olfactory bulb**",
                  "**cerebrum**",
                  "**optic lobe**",
                  "**cerebellum**",
                  "**pituitary**"
                ]
              },
              {
                "text": "มีเครดิตพิมพ์ไว้ว่า 2002 Encyclopaedia Britannica, Inc."
              }
            ]
          },
          {
            "sub": "ภาพขวาล่าง Fig. 1",
            "body": [
              {
                "text": "เปรียบเทียบ **Human brain** (A) กับ **Trout brain** (B) โดยระบายสีส่วนต่าง ๆ ให้เทียบกันได้ และมีภาพเล็ก (C) ที่มองไม่ชัดในสไลด์"
              }
            ]
          }
        ]
      },
      {
        "heading": "The sensory system - หัวข้อรวม",
        "source": "AP2_Fish_bio p.97",
        "body": [
          {
            "bullets": [
              "**Lateral line system**",
              "**Internal ear: Otolith**",
              "**Taste bud / gustatory organ**",
              "**Rod cell, cone cell**"
            ]
          },
          {
            "callout": "สไลด์ต่อ ๆ ไปขยายเฉพาะ lateral line system, internal ear และเรื่องการมองเห็น ส่วน taste bud / gustatory organ ไม่มีสไลด์ขยายในช่วงหน้า 97-104 ที่โน้ตนี้ครอบคลุม",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Lateral line system",
        "source": "AP2_Fish_bio p.98-100",
        "body": [
          {
            "text": "p.98 หัวข้อ **Lateral line system** พร้อมภาพปลาปอมปาดัวร์สีส้มแดงที่เห็นแนวจุดเรียงบนลำตัว และภาพลายเส้นปลา 4 ชนิดที่วาดแนวเส้นข้างลำตัวไว้ **แนวเส้นในภาพลายเส้นแต่ละชนิดไม่เหมือนกัน** แต่สไลด์ไม่ได้เขียนชื่อปลาแต่ละตัวกำกับไว้"
          },
          {
            "text": "p.99 ภาพบนเป็นปลาช่อนวางเต็มตัว ภาพล่างซ้ายเป็นภาพจากกล้องจุลทรรศน์อิเล็กตรอน (SEM) กำกับว่า **Canal pores** พร้อมลูกศรชี้รูเรียงเป็นแนวบนเกล็ด ภาพล่างขวาเป็นภาพถ่ายเกล็ดจริงที่เห็นแนวรูเรียงเป็นเส้นพาดตามลำตัว (มีวันที่บนภาพ 2 7 2005) สเกลบน SEM อ่านได้ว่า WD29.6mm 15.0kV x40 และ 1mm"
          },
          {
            "sub": "แผนภาพ p.100 (คำกำกับตามที่พิมพ์)",
            "body": [
              {
                "bullets": [
                  "A แบ่งระบบเป็น **head canal system** และ **trunk canal system**",
                  "B ภาพตัดขวางแสดง **lateral-line canal**, **water displacement**, **external opening**, **epidermis**, **lateral-line nerve**, **neuromast**",
                  "C ภาพขยายหน่วยรับความรู้สึก แสดง **cupula**, **sense hair**, **sensory cells**, **nerve**"
                ]
              },
              {
                "text": "มีเครดิตพิมพ์ไว้ว่า 1994 Encyclopaedia Britannica, Inc."
              }
            ]
          },
          {
            "callout": "สไลด์แสดงว่า water displacement คือสิ่งกระตุ้นที่เข้ามาทาง external opening แล้วไปมีผลต่อ neuromast แต่ **สไลด์ไม่ได้เขียนคำอธิบายกลไกเป็นตัวหนังสือ** มีแต่ลูกศรบนภาพ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "Internal ear",
        "source": "AP2_Fish_bio p.101",
        "body": [
          {
            "sub": "คำกำกับบนภาพหลัก (หัวปลามองด้านข้าง)",
            "body": [
              {
                "bullets": [
                  "**Spinal cord**",
                  "**Semicircular canals**",
                  "**Brain**",
                  "**Eye**",
                  "**Saccule**",
                  "**Otolith**"
                ]
              }
            ]
          },
          {
            "sub": "คำกำกับบนภาพขยายมุมซ้ายล่าง",
            "body": [
              {
                "bullets": [
                  "**Posterior vertical canal**",
                  "**Anterior vertical canal**",
                  "**Horizontal canal**",
                  "**Saccule**",
                  "**Otolith**"
                ]
              }
            ]
          },
          {
            "callout": "ภาพมุมขวาบนเป็นแผนภาพตัดตามยาวของหัวและลำตัวส่วนหน้าที่มีคำกำกับจำนวนมาก แต่ **ตัวหนังสือเล็กและเบลอเกินกว่าจะอ่านได้ครบถ้วนจากสไลด์** อ่านได้เพียงบางคำ เช่น Optic lobe, Cerebellum, Sacculus, Lagena, Ampulla, Gas bladder และคำที่ดูเหมือน Weberian apparatus จึงไม่ควรยึดรายการนี้เป็นคำตอบ ต้องดูจากสไลด์ต้นฉบับหรือหนังสือ",
            "kind": "flag"
          },
          {
            "callout": "ภาพมาจาก Stoskopf FISH MEDICINE Volume I",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "Otolith กับขนาดของปลา",
        "source": "AP2_Fish_bio p.102",
        "body": [
          {
            "text": "สไลด์เป็นภาพเดียว **ไม่มีข้อความใด ๆ กำกับเลย** ด้านบนเป็นภาพตัดของ otolith ที่เห็นเป็นชั้นวงซ้อนกันและมีแถบสีเข้ม มีเส้นโยงจากตำแหน่งต่าง ๆ ของ otolith ลงมาหาภาพปลาชนิดเดียวกัน 3 ตัวที่มีขนาดไล่จากเล็กไปใหญ่"
          },
          {
            "callout": "สไลด์แสดงเพียงการโยงเส้นระหว่างตำแหน่งบน otolith กับปลาขนาดต่าง ๆ แต่ **ไม่ได้เขียนอธิบายว่าโยงเพื่อสื่ออะไร** จึงไม่ควรเติมคำอธิบายเองในการตอบข้อสอบ",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "ภาพจุลกายวิภาคผิวหนังปลา",
        "source": "AP2_Fish_bio p.103",
        "body": [
          {
            "text": "สไลด์เป็นภาพสไลด์เนื้อเยื่อย้อมสีเต็มหน้า **ไม่มีหัวข้อ ไม่มีคำบรรยาย และไม่มีลูกศรชี้**"
          },
          {
            "bullets": [
              "ชั้นบนเป็นเยื่อบุผิวหลายชั้น ภายในมีเซลล์ทรงกลมใสขนาดใหญ่กระจายอยู่ทั่ว",
              "ใต้ชั้นเยื่อบุผิวมีเม็ดสีน้ำตาลเข้มถึงดำเรียงเป็นแนว",
              "ชั้นล่างสุดเป็นเส้นใยสีชมพูเรียงเป็นชั้นขนานกันเป็นแนวหนา"
            ]
          },
          {
            "callout": "สไลด์ไม่ได้ระบุว่านี่คือผิวหนังส่วนใด ย้อมสีอะไร หรือกำลังขยายเท่าไร ทั้งหมดนี้เป็นการบรรยายจากสิ่งที่เห็นในภาพเท่านั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "Vision",
        "source": "AP2_Fish_bio p.104",
        "body": [
          {
            "sub": "คำกำกับบนแผนภาพลูกตา",
            "body": [
              {
                "bullets": [
                  "**Cornea**",
                  "**Retina**",
                  "**Crystalline Lens** วาดเป็นทรงกลมขนาดใหญ่กลางลูกตา",
                  "**Iris**",
                  "**Tapetum**"
                ]
              }
            ]
          },
          {
            "text": "ส่วนที่เหลือของสไลด์เป็นภาพถ่ายที่ถ่ายด้วยเลนส์ตาปลา (fisheye) 4 ถึง 5 ภาพ เทียบกับภาพถ่ายปกติของฉากเดียวกัน 1 ภาพ **สไลด์ไม่มีคำบรรยายกำกับภาพเหล่านี้**"
          },
          {
            "callout": "สไลด์ให้ชื่อโครงสร้างของตาไว้ 5 คำเท่านั้น ไม่ได้อธิบายหน้าที่ของแต่ละส่วน และไม่ได้เขียนอธิบายว่าภาพ fisheye ต้องการสื่อถึงเรื่องใดของการมองเห็นของปลา",
            "kind": "warn"
          }
        ]
      }
    ]
  }
};
