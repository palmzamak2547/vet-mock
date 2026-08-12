#!/usr/bin/env node

// Generate the public instructor directory from the audited research cache.
// Run `npm run research:instructors` first, then this script. The generated
// module contains only public, source-traceable fields used by VetMock.

import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('..', import.meta.url);
const CACHE_FILE = new URL('data-cache/instructors/research-audit.json', ROOT);
const OUTPUT_FILE = new URL('src/data/instructors-directory.js', ROOT);
const VERIFIED_AT = '2026-08-12';
const CHULA_VET = 'คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย';

const EXCLUDED_SLUGS = new Set([
  // No official/current source, publication identity, or curriculum link was
  // found. This was a duplicate-like legacy stub, not a publishable profile.
  'pathmanchangchat-bunnak',
  // Legacy placeholder with no traceable current identity or publication.
  // Do not publish a plausible-looking profile without supporting evidence.
  'sirinun-pannaravee',
]);

const CANONICAL_NAME_EN = {
  'chatree-ketviraveach': 'Chatree Khatiworavage',
  'chenpop-sawangmake': 'Chenphop Sawangmake',
  'chollada-buranakarl': 'Chollada Buranakarl',
  'ekkapol-akkraputtiporn': 'Ekkapol Akaraphutiporn',
  'gunnaporn-suriyaphol': 'Gunnaporn Suriyaphol',
  'kananuch-vasunthararaksa': 'Kananuch Vasuntrarak',
  'komkrich-tiankam': 'Komkrich Teankum',
  'kongkiat-srisuwattanaskul': 'Kongkiat Srisuwatanasagul',
  'krichaporn-kradanggha': 'Krishaporn Kradangnga',
  'kriengyot-satchajerinpong': 'Kriengyot Sajjacharoenpong',
  'krit-komin': 'Kiatpichet Komin',
  'morakot-nantapaitoon': 'Morakot Nuntapaitoon',
  'nalinee-tantiwanich': 'Nalinee Tuntivanich',
  'nan-choisunirachon': 'Nan Choisunirachon',
  'natchanon-damneam': 'Natchanon Dumniem',
  'navapon-techakriengkrai': 'Navapon Techakriengkrai',
  'nicole-mehl': 'Nicole Sirisopit Mehl',
  'nipattra-suwanpairintr': 'Nipattra Suanpairintr',
  'nopadon-pirarat': 'Nopadon Pirarat',
  'nutthee-am-in': 'Nutthee Am-In',
  'orapun-chaturakanchanaphon': 'Orapun Jaturakan',
  'paisan-tianthailand': 'Paisan Tienthai',
  'panrawee-viriyasitthawat': 'Panrawee Viriyasitavat (Phoomvuthisarn)',
  'patharapol-piamsomboon': 'Patharapol Piamsomboon',
  'pattaramonchat-bunnak': 'Patmanachatr Bunnag',
  'pattrarat-chanchaithong': 'Pattrarat Chanchaithong',
  'pawana-ueasiri': 'Pawana Chuesiri',
  'prapruddee-piyaviriyakul': 'Prapruddee Piyaviriyakul',
  'punnarat-vibulchan': 'Punnarat Vibulchan',
  'saikaew-sutayatram': 'Saikaew Sattayatham',
  'sanipa-suradhat': 'Sanipa Suradhat',
  'sayamon-srisuwattanaskul': 'Sayamon Srisuwatanasagul',
  'sirakarnt-dhitavat': 'Sirakarnt Dhitavat',
  'sirawit-pakdeephanichkit': 'Sirawit Pagdepanichkit',
  'sirinun-thabthiang': 'Sirinun Pisamai Tabtieang',
  'siriwan-sakrintr': 'Siriwan Sakarin',
  'sitilak-surachetpong': 'Sirilak Surachetpong',
  'supol-semserimbun': 'Sapon Semsirmboon',
  'suppawiwat-ponglowhapan': 'Suppawiwat Ponglowhapan',
  'teerapol-chingkangsadar': 'Teerapol Chinkangsadarn',
  'thanasak-boonserm': 'Thanasak Boonserm',
  'teerawat-sawangchun-uthai': 'Theerawat Swangchan-Uthai',
  'thavajchai-lekdamrongsak': 'Thawat Lekdumrongsak',
  'theerapong-yata': 'Teerapong Yata',
  'theerawat-tharasanit': 'Theerawat Tharasanit',
  'theerayuth-kaewamatawong': 'Theerayuth Kaewamatawong',
  'worrayanee-thammathorn': 'Worrayanee Thammatorn',
  'wuthichai-klomkliao': 'Wuthichai Klomkleaw',
};

const CANONICAL_NAME_TH = {
  'chaowaphan-yinharnmingmongkol': 'เชาวพันธ์ ยินหาญมิ่งมงคล',
  'siwaporn-pengpis': 'ศิวพร เพ่งพิศ',
};

const EXTRA_ALIASES = {
  'chenpop-sawangmake': ['Chenpop Sawangmek'],
  'ekkapol-akkraputtiporn': ['Ekkapol Akkraputtiporn'],
  'ekasingh-sarueng': ['Ekasingh Sareung'],
  'gunnaporn-suriyaphol': ['Kannaporn Suriyaphol'],
  'kamonpan-charoenkul': ['Kamonphan Charoenkul'],
  'krichaporn-kradanggha': ['Krishaporn Krakangnag'],
  'krit-komin': ['Krit Komin'],
  'natchanon-damneam': ['Natchanon Damneam', 'Natchanon Dumumniem'],
  'nicole-mehl': ['Nicole Sirisophisth Mehl'],
  'nipattra-suwanpairintr': ['Nipattra Suwanpairintr'],
  'orapun-chaturakanchanaphon': ['Orapun Chaturakanchanaphon'],
  'panrawee-viriyasitthawat': ['Panrawee Viriyasitavat'],
  'pattaramonchat-bunnak': [
    'Pattaramonchat Bunnak',
    'Nadhapat Bunnag',
    'นถพัฒน์ บุนนาค',
  ],
  'sirakarnt-dhitavat': ['Sirikarnt Dhitavat'],
  'sirinun-thabthiang': ['Sirinun Pisamai', 'Sirinun Pisamai Thabthiang'],
  'sitilak-surachetpong': ['Sitilak Surachetpong'],
  'supol-semserimbun': ['Supol Semserimbun'],
};

const STATUS_OVERRIDES = {
  'ekasingh-sarueng': 'external',
  'kumpanart-soontornvipart': 'faculty',
  'paisin-lekcharoen': 'researcher',
  'pannawat-supapannachart': 'researcher',
  'saowaphang-sanannu': 'external',
  'siriwan-sakrintr': 'faculty',
  'siwaporn-pengpis': 'researcher',
};

const EXTRA_PROFILES = {
  'ampika-thongphakdee': {
    publicProfile: 'https://www.zoothailand.org/ewt_news.php?n_id=644',
  },
  'chaowaphan-yinharnmingmongkol': {
    publicProfile: 'https://www.thepeople.co/interview/social/8953',
  },
  'ekasingh-sarueng': {
    publicProfile: 'https://www.car.chula.ac.th/display7.php?bib=b2052075',
  },
  'nantapong-kamprasert': {
    publicProfile: 'https://vet.ed.ac.uk/roslin/research/divisions/quantitative-biology/highlander-lab/members/nantapong-kamprasert',
    orcid: 'https://orcid.org/0000-0001-5747-7043',
  },
  'paisin-lekcharoen': {
    publicProfile: 'https://loop.frontiersin.org/people/2924091/overview',
    researchgate: 'https://www.researchgate.net/profile/Paisin-Lekcharoen',
  },
  'pannawat-supapannachart': {
    publicProfile: 'https://doi.org/10.3897/zookeys.1283.186911',
  },
  'rosama-pusoonthornthum': {
    publicProfile: 'https://elibrary.tsri.or.th/fullP/RSA4580003/RSA4580003_full.pdf',
  },
  'saowaphang-sanannu': {
    publicProfile: 'https://www.seaza.asia/committees/species-management/',
  },
  'siriwan-sakrintr': {
    official: 'https://vet.chula.ac.th/en/department/biochemistry-unit',
  },
  'siwaporn-pengpis': {
    researchgate: 'https://www.researchgate.net/profile/Siwaporn-Pengpis',
    publicProfile: 'https://digital.car.chula.ac.th/tjvm/vol50/iss1/14/',
  },
  'supol-semserimbun': {
    kasetsart: 'https://research.ku.ac.th/forest/Person.aspx?id=660163',
  },
};

const INSTITUTION_OVERRIDES = {
  'chaowaphan-yinharnmingmongkol': 'Animal Space Pet Hospital',
  'ekasingh-sarueng': 'Betagro Public Company Limited',
  'nantapong-kamprasert': 'University of New England (UNE), Australia',
  'paisin-lekcharoen': CHULA_VET,
  'pannawat-supapannachart': CHULA_VET,
  'saowaphang-sanannu': 'Zoological Park Organization of Thailand',
  'siriwan-sakrintr': CHULA_VET,
  'siwaporn-pengpis': CHULA_VET,
};

const EXTRA_VERIFIED_PAPERS = {
  'pattaramonchat-bunnak': [{
    title: 'Assessment of a Combination of Tiletamine/Zolazepam, Ketamine, and Dexmedetomidine for Anesthesia of Swine (Sus domesticus)',
    year: 2023,
    journal: 'Journal of the American Association for Laboratory Animal Science',
    authors: 'Nadhapat Bunnag, Ekkapol Akaraphutiporn, Sumit Durongphongtorn, Kumpanart Soontornvipart, Patrick Sharp, Cholawat Pacharinsak, Chalika Wangdee',
    doi: '10.30802/aalas-jaalas-22-000083',
    verification: 'PUBMED_VERIFIED',
    targetPosition: 'first',
  }],
};

const DEPARTMENT_OVERRIDES = {
  'theerapong-yata': 'หน่วยชีวเคมี',
};

const DEPARTMENTS = {
  anatomy: 'ภาควิชากายวิภาคศาสตร์',
  microbiology: 'ภาควิชาจุลชีววิทยา',
  pathology: 'ภาควิชาพยาธิวิทยา',
  parasitology: 'หน่วยปรสิตวิทยา',
  pharmacology: 'ภาควิชาเภสัชวิทยา',
  surgery: 'ภาควิชาศัลยศาสตร์',
  biochemistry: 'หน่วยชีวเคมี',
  physiology: 'ภาควิชาสรีรวิทยา',
  'animal-husbandry': 'ภาควิชาสัตวบาล',
  'veterinary-public-health': 'ภาควิชาสัตวแพทยสาธารณสุข',
  reproduction: 'ภาควิชาสูติศาสตร์ เธนุเวชวิทยาและวิทยาการสืบพันธุ์',
  medicine: 'ภาควิชาอายุรศาสตร์',
};

// People who teach in the current curriculum but are absent from the current
// department roster snapshot (new appointments, emeritus faculty, and guest
// specialists). Every field below is backed by the public sources linked in
// `profiles` and `verification.sources`; do not infer missing identities.
const MANUAL_PROFILES = [
  {
    slug: 'thanicha-chanchaidechachai',
    nameEn: 'Thanicha Chanchaidechachai',
    nameTh: 'ฐนิชา ชาญชัยเดชาชัย',
    aliases: ['ฐูนิชา ชาญชัยเดชาชัย'],
    nickname: 'Ann',
    position: 'อาจารย์',
    department: 'ภาควิชาอายุรศาสตร์',
    institution: CHULA_VET,
    status: 'faculty',
    areas: ['Veterinary epidemiology', 'Disease modelling', 'Animal health economics', 'One Health', 'Animal-health data science'],
    areaSource: 'public-profile',
    papers: [
      {
        title: 'One-size measures do not fit all areas: Evaluation of area-specific control of foot and mouth disease in Thailand using bioeconomic modelling',
        year: 2024,
        journal: 'Preventive Veterinary Medicine',
        authors: 'Thanicha Chanchaidechachai, Egil A. J. Fischer, Helmut W. Saatkamp, Mart C. M. de Jong, Henk Hogeveen',
        url: 'https://doi.org/10.1016/j.prevetmed.2024.106359',
        doi: '10.1016/j.prevetmed.2024.106359',
        verifiedBy: 'PubMed',
      },
      {
        title: 'Evaluation of foot and mouth disease control measures: Simulating two endemic areas of Thailand',
        year: 2023,
        journal: 'Preventive Veterinary Medicine',
        authors: 'Thanicha Chanchaidechachai, Helmut W. Saatkamp, Henk Hogeveen, Mart C. M. de Jong, Egil A. J. Fischer',
        url: 'https://doi.org/10.1016/j.prevetmed.2023.106045',
        doi: '10.1016/j.prevetmed.2023.106045',
        verifiedBy: 'PubMed',
      },
      {
        title: 'Epidemiology of foot-and-mouth disease outbreaks in Thailand from 2011 to 2018',
        year: 2022,
        journal: 'Transboundary and Emerging Diseases',
        authors: 'Thanicha Chanchaidechachai, Helmut Saatkamp, Mart C. M. de Jong, Bart H. P. van den Borne',
        url: 'https://doi.org/10.1111/tbed.14754',
        doi: '10.1111/tbed.14754',
        verifiedBy: 'Crossref',
      },
    ],
    subjects: ['epidemiology'],
    topics: ['epidem-disease-transmission', 'epidem-causation', 'epidem-sample-size', 'epidem-applied-stats', 'epidem-data-analysis', 'epidem-eid-pandemic', 'epidem-economics'],
    profiles: {
      official: 'https://www.vet.chula.ac.th/relation_detail/1311',
      orcid: 'https://orcid.org/0000-0002-1301-3113',
      researchgate: 'https://www.researchgate.net/profile/Thanicha-Chanchaidechachai',
    },
    verification: {
      status: 'verified',
      verifiedAt: VERIFIED_AT,
      sources: [
        { label: 'Chula Vet', url: 'https://www.vet.chula.ac.th/relation_detail/1311' },
        { label: 'VPAT', url: 'https://www.vpatthailand.org/media/default/4846/รายชื่อสมาชิกสมาคมฯ%202567.pdf' },
        { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Thanicha+Chanchaidechachai' },
      ],
      publicationsFound: 3,
    },
  },
  {
    slug: 'noppawan-buamithup',
    nameEn: 'Noppawan Buamithup',
    nameTh: 'นพวรรณ บัวมีธูป',
    aliases: ['Noppawan Buamitoup'],
    position: 'ผู้เชี่ยวชาญด้านการพัฒนาสุขภาพสัตว์และบำบัดโรคสัตว์',
    department: 'กลุ่มพัฒนาวิชาการปศุสัตว์',
    institution: 'กรมปศุสัตว์',
    status: 'external',
    areas: ['Livestock disease surveillance', 'Foot-and-mouth disease control', 'Veterinary epidemiology', 'Animal movement networks', 'Livestock policy'],
    areaSource: 'official',
    papers: [
      {
        title: 'The impact of mass vaccination policy and control measures on lumpy skin disease cases in Thailand: insights from a Bayesian structural time series analysis',
        year: 2024,
        journal: 'Frontiers in Veterinary Science',
        authors: 'Veerasak Punyapornwithaya, Orapun Arjkumpa, Noppawan Buamithup, et al.',
        url: 'https://doi.org/10.3389/fvets.2023.1301546',
        doi: '10.3389/fvets.2023.1301546',
        verifiedBy: 'PubMed',
      },
      {
        title: 'The First Lumpy Skin Disease Outbreak in Thailand (2021): Epidemiological Features and Spatio-Temporal Analysis',
        year: 2022,
        journal: 'Frontiers in Veterinary Science',
        authors: 'Orapun Arjkumpa, Minta Suwannaboon, Manoch Boonrod, et al., Noppawan Buamithup, et al.',
        url: 'https://doi.org/10.3389/fvets.2021.799065',
        doi: '10.3389/fvets.2021.799065',
        verifiedBy: 'PubMed',
      },
      {
        title: 'การวิเคราะห์เครือข่ายการเคลื่อนย้ายโค กระบือในพื้นที่ระดับตำบลของประเทศไทย',
        year: 2017,
        journal: 'เอกสารวิชาการ กองสารวัตรและกักกัน กรมปศุสัตว์',
        authors: 'ณัฐชัย วรสุทธิ์, นพวรรณ บัวมีธูป',
        url: 'https://aqi.dld.go.th/webnew/index.php/en/organization-menu/research-menu/414-analysiscattlebuff',
        verifiedBy: 'กรมปศุสัตว์',
      },
    ],
    subjects: ['epidemiology'],
    topics: ['epidem-govt-policy'],
    profiles: {
      official: 'https://dld.go.th/webnew/index.php/about-dld/head-team/head-central',
      publicProfile: 'https://tarr.arda.or.th/Researcher/info/นพวรรณ%20บัวมีธูป',
    },
    verification: {
      status: 'verified',
      verifiedAt: VERIFIED_AT,
      sources: [
        { label: 'กรมปศุสัตว์', url: 'https://dld.go.th/webnew/index.php/about-dld/head-team/head-central' },
        { label: 'TARR', url: 'https://tarr.arda.or.th/Researcher/info/นพวรรณ%20บัวมีธูป' },
        { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Noppawan+Buamithup' },
      ],
      publicationsFound: 3,
    },
  },
  {
    slug: 'jiroj-sasipreeyajan',
    nameEn: 'Jiroj Sasipreeyajan',
    nameTh: 'จิโรจ ศศิปรียจันทร์',
    aliases: ['จิโรจน์ ศศิปรียจันทร์'],
    position: 'ศาสตราจารย์กิตติคุณ',
    department: 'ภาควิชาอายุรศาสตร์ · หน่วยเวชศาสตร์ป้องกันการสัตว์และโรคสัตว์ปีก',
    institution: CHULA_VET,
    status: 'emeritus',
    areas: ['Poultry diseases', 'Avian infectious diseases', 'Poultry vaccinology', 'Poultry health management'],
    areaSource: 'public-profile',
    papers: [
      {
        title: 'Genetic characterization of infectious bronchitis viruses in Thailand, 2014–2016: identification of a novel recombinant variant',
        year: 2020,
        journal: 'Poultry Science',
        authors: 'Sirorat Munyahongse, Tawatchai Pohuang, Nutthawan Nonthabenjawan, Jiroj Sasipreeyajan, Aunyaratana Thontiravong',
        url: 'https://doi.org/10.1016/j.psj.2019.11.044',
        doi: '10.1016/j.psj.2019.11.044',
        verifiedBy: 'PubMed',
      },
      {
        title: 'Protective Efficacy of Live LaSota Strain Newcastle Disease Virus Vaccine in Layer-type Chickens',
        year: 2016,
        journal: 'The Thai Journal of Veterinary Medicine',
        authors: 'Jiroj Sasipreeyajan, Phornphisut Areeraksakul, Somkid Khanda',
        url: 'https://doi.org/10.56808/2985-1130.2726',
        doi: '10.56808/2985-1130.2726',
        verifiedBy: 'Chula Digital Collections',
      },
      {
        title: 'Detection and molecular characterization of infectious bronchitis virus isolated from recent outbreaks in broiler flocks in Thailand',
        year: 2009,
        journal: 'Journal of Veterinary Science',
        authors: 'Tawatchai Pohuang, Niwat Chansiripornchai, Achara Tawatsin, Jiroj Sasipreeyajan',
        url: 'https://doi.org/10.4142/jvs.2009.10.3.219',
        doi: '10.4142/jvs.2009.10.3.219',
        verifiedBy: 'PubMed',
      },
    ],
    subjects: ['avian-medicine'],
    topics: ['avian-intro', 'avian-ai', 'avian-egg-breakout', 'avian-vaccine-prog', 'avian-serology'],
    profiles: {
      official: 'https://poultrycongress.hipra.com/all-speakers/',
      publicProfile: 'https://digital.car.chula.ac.th/e-lectures/17/',
      researchgate: 'https://www.researchgate.net/profile/Jiroj-Sasipreeyajan',
    },
    verification: {
      status: 'verified',
      verifiedAt: VERIFIED_AT,
      sources: [
        { label: 'Chula Digital Collections', url: 'https://digital.car.chula.ac.th/tjvm/vol46/iss2/2/' },
        { label: 'Emeritus speaker profile', url: 'https://poultrycongress.hipra.com/all-speakers/' },
        { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Jiroj+Sasipreeyajan' },
      ],
      publicationsFound: 3,
    },
  },
  {
    slug: 'sompiss-jullabutradee',
    nameEn: 'Sompiss Jullabutradee',
    nameTh: 'สมพิศ จุลลาบุตรดี',
    aliases: ['Sompis Junlaboothdi'],
    position: 'สัตวแพทย์และผู้ตรวจประเมินความปลอดภัยอาหาร',
    department: 'Food safety · HACCP · Poultry biosecurity',
    institution: 'G&S Agriconsultants Co., Ltd.',
    status: 'external',
    areas: ['Veterinary public health', 'Food safety auditing', 'HACCP', 'Poultry biosecurity', 'Avian influenza control'],
    areaSource: 'public-profile',
    papers: [
      {
        title: 'Limitations in the Application of Control Measures during the First Avian Influenza Outbreaks in Thailand',
        year: 2005,
        journal: 'M.Sc. thesis, Chiang Mai University / Freie Universität Berlin',
        authors: 'Sompiss Jullabutradee',
        url: 'https://archive.lib.cmu.ac.th/full/T/2005/vph0905sj_abs.pdf',
        verifiedBy: 'Chiang Mai University',
      },
    ],
    subjects: ['food-industry'],
    topics: ['fiqc-haccp', 'fiqc-poultry-export'],
    profiles: {
      official: 'https://vphcap.vet.cmu.ac.th/thesis.php',
      publicProfile: 'https://www.aquafisheriesexpo.com/en/event-news/conferences-and-technical-seminars-aquaculture-vietnam-2024-vietstock-2024/',
    },
    verification: {
      status: 'verified',
      verifiedAt: VERIFIED_AT,
      sources: [
        { label: 'Chiang Mai University', url: 'https://vphcap.vet.cmu.ac.th/thesis.php' },
        { label: 'Veterinary Council roster', url: 'https://dld.go.th/th/images/stories/news/livestock/2560/newsflash/256012/25601220_1.pdf' },
        { label: 'Vietstock 2024', url: 'https://www.aquafisheriesexpo.com/en/event-news/conferences-and-technical-seminars-aquaculture-vietnam-2024-vietstock-2024/' },
      ],
      publicationsFound: 1,
    },
  },
  {
    slug: 'weerapongse-tangjitjaroen',
    nameEn: 'Weerapongse Tangjitjaroen',
    nameTh: 'วีรพงศ์ ตั้งจิตเจริญ',
    aliases: [],
    position: 'รองศาสตราจารย์',
    department: 'คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่',
    institution: 'มหาวิทยาลัยเชียงใหม่',
    status: 'external',
    areas: ['Veterinary acupuncture', 'Traditional Chinese veterinary medicine', 'Integrative veterinary medicine', 'Equine medicine', 'Wildlife medicine'],
    areaSource: 'public-profile',
    papers: [
      {
        title: 'Acupuncture Improves Heart Rate Variability, Oxidative Stress Level, Exercise Tolerance, and Quality of Life in Tracheal Collapse Dogs',
        year: 2022,
        journal: 'Veterinary Sciences',
        authors: 'Phurion Chueainta, Veerasak Punyapornwithaya, Weerapongse Tangjitjaroen, Wanpitak Pongkan, Chavalit Boonyapakorn',
        url: 'https://doi.org/10.3390/vetsci9020088',
        doi: '10.3390/vetsci9020088',
        verifiedBy: 'Crossref',
      },
      {
        title: 'Acupuncture for the Treatment of Spinal Cord Injuries',
        year: 2011,
        journal: 'American Journal of Traditional Chinese Veterinary Medicine',
        authors: 'Weerapongse Tangjitjaroen',
        url: 'https://doi.org/10.59565/001c.117437',
        doi: '10.59565/001c.117437',
        verifiedBy: 'Crossref',
      },
      {
        title: 'Possible Mechanisms of Acupuncture for the Treatment of Chronic Inflammatory Disorders of the Equine Lower Airway',
        year: 2009,
        journal: 'American Journal of Traditional Chinese Veterinary Medicine',
        authors: 'Weerapongse Tangjitjaroen, Huisheng Xie, Patrick T. Colahan',
        url: 'https://doi.org/10.59565/001c.83749',
        doi: '10.59565/001c.83749',
        verifiedBy: 'Crossref',
      },
    ],
    subjects: ['equine-medicine'],
    topics: ['equine-acupuncture'],
    profiles: {
      official: 'https://www.vpatthailand.org/media/default/2183/ProceedingVRVC2019.pdf',
      publicProfile: 'https://ajtcvm.org/downloads/possible-mechanisms-of-acupuncture-for-the-treatment-of-chronic-inflammatory-disorders-of-the-equine-lower-airway/',
    },
    verification: {
      status: 'verified',
      verifiedAt: VERIFIED_AT,
      sources: [
        { label: 'VPAT', url: 'https://www.vpatthailand.org/media/default/2183/ProceedingVRVC2019.pdf' },
        { label: 'AJTCVM', url: 'https://ajtcvm.org/downloads/possible-mechanisms-of-acupuncture-for-the-treatment-of-chronic-inflammatory-disorders-of-the-equine-lower-airway/' },
        { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Weerapongse+Tangjitjaroen' },
      ],
      publicationsFound: 3,
    },
  },
  {
    slug: 'nawapen-phutikanit',
    nameEn: 'Nawapen Phutikanit',
    nameTh: 'นวเพ็ญ ภูติกนิษฐ์',
    aliases: [],
    position: 'อาจารย์สัตวแพทย์',
    department: 'สูติศาสตร์ เธนุเวชวิทยาและวิทยาการสืบพันธุ์',
    institution: CHULA_VET,
    status: 'historical',
    areas: ['Animal reproduction', 'Oocyte and embryo biotechnology', 'Epigenetics', 'Mesenchymal stem cells', 'Equine reproduction'],
    areaSource: 'publications',
    papers: [
      {
        title: 'In vitro culture of feline embryos increases stress-induced heat shock protein 70 and apoptotic related genes',
        year: 2013,
        journal: 'Journal of Reproduction and Development',
        authors: 'Thanida Sananmuang, Nawapen Phutikanit, Catherine Nguyen, Sukanya Manee-In, Mongkol Techakumphu, Theerawat Tharasanit',
        url: 'https://doi.org/10.1262/jrd.2012-116',
        doi: '10.1262/jrd.2012-116',
        verifiedBy: 'PubMed',
      },
      {
        title: 'Different DNA methylation patterns detected by the Amplified Methylation Polymorphism Polymerase Chain Reaction (AMP PCR) technique among various cell types of bulls',
        year: 2010,
        journal: 'Acta Veterinaria Scandinavica',
        authors: "Nawapen Phutikanit, Junpen Suwimonteerabutr, Dion Harrison, Michael D'Occhio, Bernie Carroll, Mongkol Techakumphu",
        url: 'https://doi.org/10.1186/1751-0147-52-18',
        doi: '10.1186/1751-0147-52-18',
        verifiedBy: 'PubMed',
      },
      {
        title: 'Transvaginal follicle aspiration in Thai swamp buffalo heifers using different vacuum pressures after FSH pretreatment',
        year: 2004,
        journal: 'Journal of Veterinary Medical Science',
        authors: 'Mongkol Techakumphu, Akachart Promdireg, Nawapen Phutikanit, Anchalee Nachiengmai, Sak Thongjan',
        url: 'https://doi.org/10.1292/jvms.66.973',
        doi: '10.1292/jvms.66.973',
        verifiedBy: 'PubMed',
      },
    ],
    subjects: ['equine-repro'],
    topics: ['eqrepro-pregnancy'],
    profiles: {
      official: 'https://www.vetmed.hokudai.ac.jp/project/cve/english/images/syllabus%202015.pdf',
      publicProfile: 'https://doi.nrct.go.th/ListDoi/Download/534993?Resolve_DOI=10.14457%2FCU.res.2011.86',
    },
    verification: {
      status: 'verified',
      verifiedAt: VERIFIED_AT,
      sources: [
        { label: 'NRCT research report', url: 'https://doi.nrct.go.th/ListDoi/Download/534993?Resolve_DOI=10.14457%2FCU.res.2011.86' },
        { label: 'Chula course syllabus', url: 'https://www.vetmed.hokudai.ac.jp/project/cve/english/images/syllabus%202015.pdf' },
        { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Nawapen+Phutikanit' },
      ],
      publicationsFound: 3,
    },
  },
  {
    slug: 'sirirat-wataradee',
    nameEn: 'Sirirat Wataradee',
    nameTh: 'สิริรัตน์ วัตระดี',
    aliases: [],
    position: 'อาจารย์',
    department: 'ภาควิชาอายุรศาสตร์',
    institution: CHULA_VET,
    status: 'faculty',
    areas: ['Bovine mastitis', 'Dairy herd health', 'Milk quality', 'Antimicrobial resistance', 'Livestock disease control'],
    areaSource: 'publications',
    papers: [
      {
        title: 'Herd Health Program Participation Associated with Lower Vancomycin Resistance and Multidrug Resistance in Dairy Mastitis Pathogens: A Five-Year Surveillance Study in Saraburi, Thailand',
        year: 2026,
        journal: 'Biology',
        authors: 'Sirirat Wataradee, Witaya Suriyasathaporn, Maneerat Somsee, et al.',
        url: 'https://doi.org/10.3390/biology15100782',
        doi: '10.3390/biology15100782',
        verifiedBy: 'PubMed',
      },
      {
        title: 'Characterization of Virulence Factors and Antimicrobial Susceptibility of Streptococcus agalactiae Associated with Bovine Mastitis Cases in Thailand',
        year: 2024,
        journal: 'Animals',
        authors: 'Sirirat Wataradee, Thanasak Boonserm, Sukuma Samngamnim, Kittisak Ajariyakhajorn',
        url: 'https://doi.org/10.3390/ani14030447',
        doi: '10.3390/ani14030447',
        verifiedBy: 'PubMed',
      },
      {
        title: 'Genotypic and antimicrobial susceptibility of Streptococcus agalactiae causing bovine mastitis in the central region of Thailand',
        year: 2023,
        journal: 'Frontiers in Veterinary Science',
        authors: 'Sirirat Wataradee, Sukuma Samngamnim, Thanasak Boonserm, Kittisak Ajariyakhajorn',
        url: 'https://doi.org/10.3389/fvets.2023.1250436',
        doi: '10.3389/fvets.2023.1250436',
        verifiedBy: 'PubMed',
      },
    ],
    subjects: ['ruminant-clinical'],
    topics: ['rum-mastitis'],
    profiles: {
      official: 'https://www.vet.chula.ac.th/relation_detail/1311',
      publicProfile: 'https://digital.car.chula.ac.th/chulaetd/12745/',
      researchgate: 'https://www.researchgate.net/profile/Sirirat-Wataradee',
    },
    verification: {
      status: 'verified',
      verifiedAt: VERIFIED_AT,
      sources: [
        { label: 'Chula Vet', url: 'https://www.vet.chula.ac.th/relation_detail/1311' },
        { label: 'Chula ETD', url: 'https://digital.car.chula.ac.th/chulaetd/12745/' },
        { label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Sirirat+Wataradee' },
      ],
      publicationsFound: 3,
    },
  },
];

const THEME_RULES = [
  ['Swine health & reproduction', /\b(?:swine|pigs?|piglets?|sows?|boars?|porcine)\b/i],
  ['Ruminant health & production', /\b(?:ruminants?|cattle|cows?|calves?|buffalo(?:es)?|goats?|dairy|mastitis|rumen)\b/i],
  ['Canine medicine', /\b(?:canine|dogs?)\b/i],
  ['Feline medicine', /\b(?:feline|cats?)\b/i],
  ['Aquatic animal health', /\b(?:fish(?:eries)?|tilapia|aquatic|shrimp|seabass|crayfish|koi|carp|coral|whipray|marine)\b/i],
  ['Avian health', /\b(?:avian|poultry|chickens?|ducks?|broilers?)\b/i],
  ['Wildlife & exotic animal medicine', /\b(?:wildlife|wild|elephants?|deer|muntjac|reptiles?|rabbits?|whipray)\b/i],
  ['Infectious diseases & vaccinology', /\b(?:vir(?:us|al)\w*|vaccin\w*|infect\w*|pathogen\w*|rabies|influenza|coronavirus\w*)\b/i],
  ['Microbiology & antimicrobial resistance', /\b(?:bacter\w*|microbi\w*|antimicrobial\w*|antibiotic\w*|resistan\w*|biofilms?)\b/i],
  ['Reproduction & theriogenology', /\b(?:reproduct\w*|fertil\w*|semen|sperm\w*|oocytes?|ovarian|estrus|gestation|farrowing|colostrum|theriogen\w*)\b/i],
  ['Surgery & anaesthesiology', /\b(?:surg\w*|anesth\w*|anaesth\w*|arthro\w*|fractures?|fixation|wounds?)\b/i],
  ['Diagnostic imaging', /\b(?:ultrason\w*|radiograph\w*|computed tomograph\w*|ct|imaging|elastograph\w*)\b/i],
  ['Pathology & oncology', /\b(?:patholog\w*|tumou?rs?|cancer\w*|lymphoma\w*|carcinoma\w*|neoplasm\w*|histopath\w*)\b/i],
  ['Pharmacology & toxicology', /\b(?:pharmac\w*|drugs?|toxic\w*|kinetic\w*|bioavailability|dos(?:e|ing)|microneedles?)\b/i],
  ['Anatomy & histology', /\b(?:anatom\w*|histolog\w*|morpholog\w*|plastination|embalm\w*|organs?)\b/i],
  ['Physiology & metabolism', /\b(?:physiolog\w*|metabol\w*|cardiac|renal|endocrin\w*|oxidative|heat stress)\b/i],
  ['Stem cells & regenerative medicine', /\b(?:stem cells?|mesenchymal|regenerat\w*|tissue engineering|organoids?|differentiation)\b/i],
  ['Nanomedicine & drug delivery', /\b(?:nanomed\w*|nanomaterials?|nanoparticles?|nanoemulsions?|gene delivery|drug delivery|bacteriophage vectors?)\b/i],
  ['Cell & molecular biology', /\b(?:cellular|molecular|gene expression|extracellular matrix|proteins?|genomic\w*|transcriptom\w*)\b/i],
  ['One Health & epidemiology', /\b(?:one health|epidemiolog\w*|zoon\w*|public health|surveillance|risk factors?)\b/i],
  ['Conservation & animal ecology', /\b(?:conservation|habitat|telemetry|ecolog\w*|biodiversity|artificial reefs?)\b/i],
];

function repairText(value = '') {
  let result = String(value).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (/[ÃÂâÎ]/.test(result)) {
    const repaired = Buffer.from(result, 'latin1').toString('utf8');
    if (!repaired.includes('�')) result = repaired;
  }
  return result;
}

function stripThaiTitle(value = '') {
  let result = repairText(value);
  const prefix = /^(?:(?:ศาสตราจารย์|รองศาสตราจารย์|ผู้ช่วยศาสตราจารย์|ศ\.|รศ\.|ผศ\.|อ\.|น\.สพ\.|สพ\.ญ\.|ดร\.)\s*)+/u;
  while (prefix.test(result)) result = result.replace(prefix, '').trim();
  return result;
}

function stripEnglishTitle(value = '') {
  let result = repairText(value)
    .replace(/,\s*(?:DVM|PhD|MSc|MD).*$/i, '')
    .replace(/^\.+\s*/, '')
    .trim();
  const prefix = /^(?:(?:professor|associate professor|assistant professor|instructor|insrtructor|lecturer|prof\.?|assoc\.?\s*prof\.?|asso\.?\s*prof\.?|asst\.?\s*prof\.?|doctor|dr\.?|dvm\.?|phd\.?|md\.?)\s*)+/i;
  while (prefix.test(result)) result = result.replace(prefix, '').replace(/^\.+\s*/, '').trim();
  if (result.includes(',') && /^[^,]+,\s*[^,]+$/.test(result)) {
    const [family, given] = result.split(',').map((part) => part.trim());
    if (given.length > 1 && !/^[A-Z]\.?$/i.test(given)) result = `${given} ${family}`;
  }
  return result.replace(/^\.+\s*/, '').trim();
}

function stripNameTitle(value = '') {
  return /[ก-๙]/u.test(value) ? stripThaiTitle(value) : stripEnglishTitle(value);
}

function unique(values) {
  return [...new Set(values.map(repairText).filter(Boolean))];
}

function cleanPosition(record) {
  const exact = record.official?.academicTitleTh
    || record.officialResearcher?.positionTh
    || record.official?.positionTh;
  if (exact && exact !== '.') return repairText(exact);
  const english = record.official?.academicTitleEn
    || record.officialResearcher?.positionEn
    || record.official?.positionEn
    || record.position
    || '';
  if (/associate professor|assoc\.?\s*prof/i.test(english)) return 'รองศาสตราจารย์';
  if (/assistant professor|asst\.?\s*prof/i.test(english)) return 'ผู้ช่วยศาสตราจารย์';
  if (/professor|prof\.?/i.test(english)) return 'ศาสตราจารย์';
  if (/lecturer|instructor/i.test(english)) return 'อาจารย์';
  return repairText(english) || 'ผู้สอน';
}

function classifyDepartment(record) {
  if (DEPARTMENT_OVERRIDES[record.slug]) return DEPARTMENT_OVERRIDES[record.slug];
  if (record.official?.departmentId && DEPARTMENTS[record.official.departmentId]) {
    return DEPARTMENTS[record.official.departmentId];
  }
  const source = `${record.officialResearcher?.departmentEn || ''} ${record.department || ''}`;
  const match = Object.entries(DEPARTMENTS).find(([id]) => {
    if (id === 'veterinary-public-health') return /public health/i.test(source);
    if (id === 'animal-husbandry') return /animal husbandry/i.test(source);
    if (id === 'reproduction') return /obstetric|reproduction|theriogen/i.test(source);
    return new RegExp(id.replace('-', '.*'), 'i').test(source);
  });
  return match?.[1] || repairText(record.department) || 'ไม่ระบุหน่วยงาน';
}

function publicStatus(record) {
  if (STATUS_OVERRIDES[record.slug]) return STATUS_OVERRIDES[record.slug];
  if (/external/i.test(record.sourceType || '')) return 'external';
  if (record.official) return 'faculty';
  if (record.officialResearcher) return 'researcher';
  return 'historical';
}

function verifiedPapers(record) {
  const allowed = new Set([
    'CROSSREF_VERIFIED',
    'CROSSREF_SEARCH_VERIFIED',
    'CROSSREF_AUTHOR_VERIFIED',
    'PUBMED_VERIFIED',
  ]);
  const candidates = [
    ...(EXTRA_VERIFIED_PAPERS[record.slug] || []),
    ...(record.openAlex?.status === 'matched-high' ? (record.openAlex.papers || []) : []),
    ...(record.fallbackPapers || []),
    ...(record.discoveredPapers || []),
  ].filter((paper) => allowed.has(paper.verification));
  const deduped = new Map();
  for (const paper of candidates) {
    const title = repairText(paper.title);
    const key = (paper.doi || paper.url || title).toLowerCase();
    if (!title || deduped.has(key)) continue;
    deduped.set(key, {
      title,
      year: Number(paper.year) || undefined,
      journal: repairText(paper.journal),
      authors: repairText(paper.authors),
      url: paper.doi ? `https://doi.org/${String(paper.doi).toLowerCase()}` : paper.url,
      doi: paper.doi ? String(paper.doi).toLowerCase() : undefined,
      verifiedBy: paper.verification.startsWith('PUBMED') ? 'PubMed' : 'Crossref',
      _score: (['first', 'last'].includes(paper.targetPosition) ? 60 : 0)
        + Math.log1p(paper.citedByCount || 0) * 12
        + ((Number(paper.year) || 0) >= 2022 ? 18 : 0),
    });
  }
  const all = [...deduped.values()];
  const signature = [...all].sort((a, b) => b._score - a._score);
  const recent = [...all].sort((a, b) => (b.year || 0) - (a.year || 0));
  const selected = [];
  for (const paper of [...signature.slice(0, 1), ...recent]) {
    if (selected.includes(paper)) continue;
    selected.push(paper);
    if (selected.length === 3) break;
  }
  return selected.map(({ _score, ...paper }) => paper);
}

function paperThemes(papers) {
  const corpus = papers.map((paper) => paper.title).join(' ');
  return THEME_RULES.filter(([, pattern]) => pattern.test(corpus)).map(([label]) => label).slice(0, 5);
}

function researchAreas(record, papers) {
  const official = unique([
    ...(record.official?.areasEn || []),
    ...(record.officialResearcher?.areasEn || []),
  ]).filter((area) => area !== '.');
  if (official.length) return { areas: official.slice(0, 6), areaSource: 'official' };
  if (record.openAlex?.status === 'matched-high' && record.openAlex?.areas?.length) {
    return { areas: unique(record.openAlex.areas).slice(0, 5), areaSource: 'OpenAlex' };
  }
  return { areas: paperThemes(papers), areaSource: papers.length ? 'publications' : 'unavailable' };
}

function profileLinks(record) {
  const officialProfile = record.official?.researcherUrl || record.officialResearcher?.url;
  const links = {
    official: officialProfile || record.official?.officialUrl,
    department: officialProfile ? record.official?.officialUrl : undefined,
    scholar: record.official?.profiles?.scholar || record.officialResearcher?.profiles?.scholar || record.profiles?.scholar,
    scopus: record.official?.profiles?.scopus || record.officialResearcher?.profiles?.scopus || record.profiles?.scopus,
    openalex: record.openAlex?.status === 'matched-high' ? record.openAlex?.id : undefined,
    orcid: record.openAlex?.status === 'matched-high' ? record.openAlex?.openAlex?.orcid : record.profiles?.orcid,
    pubmed: record.profiles?.pubmed,
    researchgate: record.profiles?.researchgate,
    ...(EXTRA_PROFILES[record.slug] || {}),
  };
  return Object.fromEntries(Object.entries(links).filter(([, url]) => /^https?:\/\//.test(url || '')));
}

function verificationSources(record, papers, profiles) {
  const sources = [];
  if (profiles.official) sources.push({ label: 'Chula Vet', url: profiles.official });
  if (profiles.department && profiles.department !== profiles.official) {
    sources.push({ label: 'Department roster', url: profiles.department });
  }
  if (profiles.kasetsart) sources.push({ label: 'Kasetsart University', url: profiles.kasetsart });
  if (profiles.publicProfile) sources.push({ label: 'Public professional profile', url: profiles.publicProfile });
  if (profiles.openalex) sources.push({ label: 'OpenAlex', url: profiles.openalex });
  if (papers.some((paper) => paper.verifiedBy === 'Crossref')) {
    sources.push({ label: 'Crossref', url: 'https://www.crossref.org/' });
  }
  if (papers.some((paper) => paper.verifiedBy === 'PubMed')) {
    sources.push({ label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' });
  }
  return sources;
}

function canonicalRecord(record) {
  const scholarlyName = record.openAlex?.status === 'matched-high'
    && !/^[A-Z]\.?(?:\s|$)/.test(record.openAlex?.openAlex?.display_name || '')
    ? record.openAlex.openAlex.display_name
    : undefined;
  const nameEn = CANONICAL_NAME_EN[record.slug]
    || stripEnglishTitle(scholarlyName)
    || stripEnglishTitle(record.officialResearcher?.nameEn)
    || stripEnglishTitle(record.official?.nameEn)
    || stripEnglishTitle(record.nameEn);
  const nameTh = CANONICAL_NAME_TH[record.slug]
    || stripThaiTitle(record.officialResearcher?.nameTh)
    || stripThaiTitle(record.official?.nameTh)
    || stripThaiTitle(record.nameTh);
  const aliases = unique([
    record.nameEn,
    record.nameTh,
    record.official?.nameEn,
    record.official?.nameTh,
    record.official?.rosterNameEn,
    record.official?.rosterNameTh,
    record.officialResearcher?.nameEn,
    record.officialResearcher?.nameTh,
    scholarlyName,
    ...(EXTRA_ALIASES[record.slug] || []),
  ].map(stripNameTitle)).filter((alias) => alias !== nameEn && alias !== nameTh);
  const papers = verifiedPapers(record);
  const research = researchAreas(record, papers);
  const profiles = profileLinks(record);
  const sources = verificationSources(record, papers, profiles);
  const officialIdentity = Boolean(
    record.official
    || record.officialResearcher
    || EXTRA_PROFILES[record.slug]?.official,
  );
  const verificationStatus = officialIdentity && papers.length ? 'verified' : 'partial';
  const email = record.official?.email || record.officialResearcher?.email;

  return {
    slug: record.slug,
    nameEn,
    nameTh,
    aliases,
    nickname: record.nickname,
    position: cleanPosition(record),
    department: classifyDepartment(record),
    institution: INSTITUTION_OVERRIDES[record.slug]
      || (officialIdentity ? CHULA_VET : repairText(record.institution)),
    email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email || '') ? email : undefined,
    status: publicStatus(record),
    areas: research.areas,
    areaSource: research.areaSource,
    papers,
    subjects: unique(record.subjects || []),
    topics: unique(record.topics || []),
    profiles,
    verification: {
      status: verificationStatus,
      verifiedAt: VERIFIED_AT,
      sources,
      publicationsFound: papers.length,
    },
  };
}

async function main() {
  const cache = JSON.parse(await readFile(CACHE_FILE, 'utf8'));
  const directory = cache.records
    .filter((record) => !EXCLUDED_SLUGS.has(record.slug))
    .map(canonicalRecord)
    .concat(MANUAL_PROFILES)
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn));

  const duplicateSlugs = directory.filter((record, index) => directory.findIndex((entry) => entry.slug === record.slug) !== index);
  if (duplicateSlugs.length) throw new Error(`Duplicate slugs: ${duplicateSlugs.map((record) => record.slug).join(', ')}`);
  if (directory.some((record) => !record.nameEn || !record.nameTh)) {
    throw new Error(`Missing canonical names: ${directory.filter((record) => !record.nameEn || !record.nameTh).map((record) => record.slug).join(', ')}`);
  }

  const header = `// GENERATED by scripts/generate-instructor-directory.mjs\n// Sources checked ${VERIFIED_AT}: official university profiles/rosters + DOI metadata.\n// Edit the generator or research cache inputs, not this file directly.\n\n`;
  const output = `${header}export const INSTRUCTOR_DIRECTORY = ${JSON.stringify(directory, null, 2)};\n`;
  await writeFile(OUTPUT_FILE, output, 'utf8');

  const withPapers = directory.filter((record) => record.papers.length > 0).length;
  const official = directory.filter((record) => ['faculty', 'researcher', 'emeritus'].includes(record.status)).length;
  console.log(`Generated ${directory.length} profiles (${official} official-profile/roster; ${withPapers} with verified publications)`);
  console.log(`Output: ${OUTPUT_FILE.pathname}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
