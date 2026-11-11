// Course teaching, positions and aliases checked on 2026-11-11, applied over
// the research cache by scripts/generate-instructor-directory.mjs.
//
// COURSE_TEACHING: subjects and topics a profile teaches, read from the
// repository's own course materials: a topic's `lecturer` in
// src/data/curriculum.js, a session's `lecturers` in src/data/course-syllabi.js
// (2569 schedules), and a note's `lecturer` (its title slide) in the note files
// src/data/note-corpus.js lists. Only additions; the cache's own lists stay.
// POSITION_OVERRIDES: academic titles as the current department rosters on
// vet.chula.ac.th print them (English and Thai pages agree).
// NEW_PROFILES: people a course names who are on an official Chulalongkorn
// staff page but on no department roster.

export const COURSE_TEACHING = {
  "punyamanee-yamkate": { subjects: ["poa-clinical"], topics: ["poa-vomiting","poa-anorexia"] },
  "woraporn-sukhumavasi": { subjects: ["zoonoses","rec-adv-bioscience","vet-parasit-1"], topics: ["zoo-protozoal","ravb-protozoa-gi"] },
  "vachira-hunprasit": { subjects: ["epidemiology","poa-clinical"], topics: ["epidem-disease-frequency","epidem-dx-screening","epidem-test-agreement","poa-intro","poa-red-urine","poa-pale-mm","epidem-basic-concepts"] },
  "nattawan-tangmahakul": { subjects: ["poa-clinical"], topics: ["poa-respiratory"] },
  "krissda-boonaramrueng": { subjects: ["poa-clinical"], topics: ["poa-jaundice","poa-collapse"] },
  "chutirat-torsahakul": { subjects: ["com4","poa-clinical"], topics: ["endo-dm","poa-diarrhea"] },
  "chaiyot-tanrattana": { subjects: ["poa-clinical"], topics: ["endo-cushing","endo-addison","poa-derm","poa-pupd"] },
  "suppawiwat-ponglowhapan": { subjects: [], topics: ["mahahon-hormone","mahahon-ultrasound"] },
  "theerawat-tharasanit": { subjects: ["equine-repro"], topics: ["semen-ai","semen-preservation","infertility","mahahon-semen-freezing","mahahon-semen-eval","eqrepro-anatomy-cycle","eqrepro-exam-mare","eqrepro-art-female","eqrepro-infertility","eqrepro-male","eqrepro-ai","eqrepro-mare-infect","eqrepro-stallion-infect"] },
  "ampika-thongphakdee": { subjects: [], topics: ["mahahon-art"] },
  "chaowaphan-yinharnmingmongkol": { subjects: [], topics: ["mahahon-exotic"] },
  "nantapong-kamprasert": { subjects: [], topics: ["mahahon-genetic"] },
  "sroisuda-chotimanukul": { subjects: [], topics: ["mahahon-risk-benefit","mahahon-surgical"] },
  "hatairat-plaimast": { subjects: [], topics: ["nutrition","mahahon-poultry-nutrition"] },
  "nataya-charoenvisal": { subjects: ["avian-medicine"], topics: ["biosecurity","mahahon-poultry-biosec","avian-nd","avian-ib","avian-lt","avian-mpv","avian-pox","avian-ibd","avian-marek","avian-cia","avian-reo","avian-rss","avian-cocci","avian-ne","avian-leuko","avian-malaria"] },
  "niwat-chansiripornchai": { subjects: ["epidemiology","avian-medicine"], topics: ["avian-drugs","mahahon-poultry-drugs","epidem-intro","epidem-basic-concepts","epidem-control-prevention","avian-mycosis","avian-ort","avian-campy","avian-listeria","avian-histomoniasis","epidem-disease-transmission","epidem-causation","epidem-disease-frequency","epidem-dx-screening","epidem-test-agreement","epidem-govt-policy"] },
  "ekasingh-sarueng": { subjects: [], topics: ["mahahon-poultry-qa"] },
  "kamonpan-charoenkul": { subjects: ["one-health","zoonoses"], topics: ["avian-zoonosis","mahahon-poultry-zoonosis","oh-disease-prevention","zoo-ebola-nipah","zoo-ai-basic","zoo-siv-civ","zoo-vbz","zoo-rickettsial","zoo-intro","zoo-rabies","zoo-eid-cuvet","zoo-corona","zoo-outbreak","zoo-eid-wildlife"] },
  "kriengwich-limpavithayakul": { subjects: ["avian-medicine"], topics: ["mahahon-poultry-firstweek","avian-salmonella","avian-adeno","avian-ae","avian-ahra-set","avian-duck-plague","avian-dvh","avian-nds","avian-goose-parvo","avian-duck-flavi"] },
  "kris-angkanaporn": { subjects: ["poultry","vet-physio-3"], topics: ["physiology"] },
  "somsak-pakpinyo": { subjects: ["avian-medicine"], topics: ["midterm-disease","avian-myco","avian-coryza","avian-fowl-cholera","avian-coli"] },
  "thavajchai-lekdamrongsak": { subjects: ["poa-clinical"], topics: ["poa-exotic"] },
  "paisin-lekcharoen": { subjects: ["zoonoses"], topics: ["zoo-eid-wildlife"] },
  "piyanat-prasomsri": { subjects: [], topics: ["metabolism-nutrition","mahahon-cliapprum-piyanat-hoof"] },
  "pattaramonchat-bunnak": { subjects: [], topics: ["mahahon-cliapprum-anes"] },
  "sawita-santivipatana": { subjects: ["equine-medicine","equine-repro"], topics: ["mahahon-cliapprum-sawita-gi","mahahon-cliapprum-sawita-respi","equine-anesthesia","equine-gi","equine-colic-bestfit","equine-derm","equine-surgery-wound","eqrepro-surgery","eqrepro-pregnancy","eqrepro-postpartum"] },
  "thanasak-boonserm": { subjects: [], topics: ["mahahon-cliapprum-givdtt"] },
  "thanicha-chanchaidechachai": { subjects: [], topics: ["epidem-intro","epidem-observational-study"] },
  "chaidate-inchaisri": { subjects: ["ruminant-clinical"], topics: ["epidem-observational-study","epidem-software","epidem-current-research","rum-hhm","epidem-sample-size"] },
  "saharuetai-jeamsripong": { subjects: ["epidemiology","milk-meat-hygiene","one-health","food-industry","zoonoses"], topics: ["epidem-surveillance","epidem-outbreak-investigation","milk-quality-composition","milk-raw-std","milk-microbiology","milk-borne-pathogens","milk-industry-std","milk-processing","milk-cleaning","oh-vet-role","oh-global-network","oh-integrating-epi","fiqc-aquatic","zoo-epi-approach"] },
  "aranya-ponpornpisit": { subjects: ["aquatic-clinic"], topics: ["aqua-intro-thailand","aqua-fish-biology","aqua-ornamental","aqua-disease-control"] },
  "patharapol-piamsomboon": { subjects: ["aquatic-clinic"], topics: ["aqua-water-quality","aqua-frog-diseases","aqua-shrimp-immunology","aqua-fish-diseases","aqua-shrimp-diseases","aqua-intro-thailand","aqua-life-support","aqua-amphibian","aqua-disease-control"] },
  "thanida-haetrakul": { subjects: ["aquatic-clinic"], topics: ["aqua-life-support","aqua-conservation","aqua-amphibian","aqua-turtle","aqua-intro-thailand","aqua-water-quality","aqua-frog-diseases","aqua-disease-control"] },
  "worrayanee-thammathorn": { subjects: ["aquatic-clinic","one-health"], topics: ["aqua-toxicology","oh-env-carcinogen","oh-env-mutagen","oh-gmo"] },
  "sitilak-surachetpong": { subjects: ["poa-clinical"], topics: ["poa-edema"] },
  "rungtip-chuanchuen": { subjects: ["milk-meat-hygiene","one-health"], topics: ["milk-overview","milk-mastitis","milk-raw-storage","milk-products-storage","milk-quality-determination","meat-storage","meat-quality","meat-molecular","oh-amr"] },
  "chackrit-nuengjamnong": { subjects: ["milk-meat-hygiene"], topics: ["milk-biosec-dairy"] },
  "sirawit-pakdeephanichkit": { subjects: ["milk-meat-hygiene","one-health","food-industry"], topics: ["meat-hygiene-intro","meat-seafood","meat-slaughter","meat-ante-post-mortem","meat-cutting-grading","oh-concept","oh-communication","oh-collaboration","oh-livestock-waste","fiqc-intro","fiqc-feed-qc","fiqc-slaughter-qc"] },
  "taradon-luangtongkum": { subjects: ["milk-meat-hygiene","one-health","zoonoses"], topics: ["meat-microbiology","oh-foodborne","zoo-prion","zoo-bacterial"] },
  "suphachai-nuanualsuwan": { subjects: ["milk-meat-hygiene","one-health","zoonoses"], topics: ["meat-pest-control","meat-egg-micro","oh-import-risk","oh-risk-analysis","zoo-mycoses"] },
  "alongkorn-amonsin": { subjects: ["one-health","zoonoses"], topics: ["oh-disease-prevention","zoo-intro","zoo-ai-basic","zoo-siv-civ"] },
  "teerapol-chingkangsadar": { subjects: ["equine-medicine"], topics: ["equine-intro","equine-infectious","equine-lameness","equine-hoof","equine-dentistry","equine-respi","equine-poa","equine-exercise","equine-nutrition"] },
  "piyanan-taweethavonsawat": { subjects: ["equine-medicine","zoonoses","rec-adv-bioscience"], topics: ["equine-parasites","zoo-helminthic","ravb-helminths"] },
  "nalinee-tantiwanich": { subjects: ["equine-medicine"], topics: ["equine-ophth"] },
  "teerawat-sawangchun-uthai": { subjects: ["equine-repro"], topics: ["eqrepro-endometritis"] },
  "navapon-techakriengkrai": { subjects: ["zoonoses","rec-adv-bioscience","vet-microbio-1"], topics: ["zoo-eid-cuvet","ravb-virology","zoo-corona"] },
  "athipoo-nuntaprasert": { subjects: ["swine-clinic"], topics: ["swine-gi-viral","swine-resp-viral","swine-cns"] },
  "pornchalit-assavacheep": { subjects: ["swine-clinic"], topics: ["swine-pornchalit-set","swine-repro","swine-control-dx"] },
  "suphot-wattanaphansak": { subjects: ["swine-clinic"], topics: ["swine-ileitis-bacti","swine-fmd","swine-pcv2","swine-trichinosis"] },
  "roongtham-kedkovid": { subjects: ["swine-clinic"], topics: ["swine-csf","swine-asf","swine-greasypig","swine-prv-je"] },
  "sirakarnt-dhitavat": { subjects: ["rec-adv-bioscience","biochem-2"], topics: ["ravb-intro"] },
  "prapruddee-piyaviriyakul": { subjects: ["rec-adv-bioscience","biochem-2"], topics: ["ravb-pcr-qpcr"] },
  "sariya-asawakarn": { subjects: ["rec-adv-bioscience","biochem-2"], topics: ["ravb-principle-tests"] },
  "gunnaporn-suriyaphol": { subjects: ["rec-adv-bioscience"], topics: ["ravb-proteomics"] },
  "charnnarong-rodkhum": { subjects: ["rec-adv-bioscience","vet-microbio-1"], topics: ["ravb-bacterial-dx","ravb-bacterial-special"] },
  "nuvee-prapasarakul": { subjects: ["rec-adv-bioscience","vet-microbio-1"], topics: ["ravb-mycology"] },
  "morakot-kaewthamasorn": { subjects: ["rec-adv-bioscience","vet-parasit-1"], topics: ["ravb-protozoa-blood"] },
  "sonthaya-tiawsirisup": { subjects: ["rec-adv-bioscience"], topics: ["ravb-avbd"] },
  "roongroje-thanawongnuwech": { subjects: ["livestock-pathology"], topics: ["lpath-slaughter"] },
  "sawang-kesdangsakonwut": { subjects: ["livestock-pathology"], topics: ["lpath-swine-systemic","lpath-systemic"] },
  "saikaew-sutayatram": { subjects: ["vet-physio-3"], topics: [] },
  "sumpun-thammacharoen": { subjects: ["vet-physio-3"], topics: [] },
  "chutamas-benjanirut": { subjects: ["vet-physio-3"], topics: [] },
  "sutthasinee-poonyachoti": { subjects: ["vet-physio-3","vet-physio-lab-1"], topics: [] },
  "theerapong-yata": { subjects: ["biochem-2"], topics: [] },
  "pattrarat-chanchaithong": { subjects: ["vet-microbio-1"], topics: [] },
  "aunyaratana-tonteerawong": { subjects: ["vet-microbio-1"], topics: [] },
  "benchaphorn-limcharoen": { subjects: ["vet-histo"], topics: [] },
  "paisan-tianthailand": { subjects: ["vet-histo"], topics: [] },
  "kamol-sakulwira": { subjects: ["vet-histo"], topics: [] },
  "kriengyot-satchajerinpong": { subjects: ["vet-histo"], topics: [] },
  "sayamon-srisuwattanaskul": { subjects: ["vet-histo"], topics: [] },
  "promporn-raksaseri": { subjects: ["vet-histo","vet-neuroanat"], topics: [] },
  "sarinee-kalandakanond-thongsong": { subjects: ["vet-physio-lab-2"], topics: [] },
  "damri-daraviroj": { subjects: ["vet-neuroanat"], topics: [] },
  "aree-laikul": { subjects: ["equine-medicine"], topics: [] },
};

export const POSITION_OVERRIDES = {
  // https://vet.chula.ac.th/en/department/physiology-unit (Prof. Dr.)
  'sumpun-thammacharoen': 'ศ. น.สพ. ดร.',
  // https://vet.chula.ac.th/en/department/animal-husbandry (Asst.Prof.)
  'praopilas-phakdeedindan': 'ผศ.สพ.ญ. ดร.',
  // https://vet.chula.ac.th/en/department/veterinary-public-health (Professor Dr.)
  'suphachai-nuanualsuwan': 'ศาสตราจารย์ น.สพ. ดร.',
};

export const EXTRA_ALIASES_2026_11 = {
  // src/data/epi-module5.js:5 and :38 spell the surname with ไชย; the roster spells ชัย.
  'chaidate-inchaisri': ['ชัยเดช อินทร์ไชยศรี'],
};

// https://culac.chula.ac.th/about/staff (นักวิจัย, name, title, email);
// English name from the title slide in src/data/notes-y2-physio-lab-2.js:24;
// papers already in the directory whose author lists carry the full name.
export const NEW_PROFILES = [{
  "slug": "tussapon-boonyarattanasoonthorn",
  "nameEn": "Tussapon Boonyarattanasoonthorn",
  "nameTh": "ทัศน์พล บุณยรัตนสุนทร",
  "aliases": [],
  "position": "น.สพ.ดร.",
  "department": "ศูนย์สัตว์ทดลอง จุฬาลงกรณ์มหาวิทยาลัย (CULAC)",
  "institution": "จุฬาลงกรณ์มหาวิทยาลัย",
  "email": "tussapon.b@chula.ac.th",
  "status": "researcher",
  "areas": [
    "Laboratory animal science",
    "SARS-CoV-2 infection models in hamsters"
  ],
  "areaSource": "publications",
  "papers": [
    {
      "title": "In vivo evaluation of Andrographis paniculata and Boesenbergia rotunda extract activity against SARS-CoV-2 Delta variant in Golden Syrian hamsters: Potential herbal alternative for COVID-19 treatment",
      "year": 2024,
      "journal": "Journal of Traditional and Complementary Medicine",
      "authors": "Supasek Kongsomros, Tussapon Boonyarattanasoonthorn, Wallaya Phongphaew, Chaiyan Kasorndorkbua, Piyanate Sunyakumthorn, Rawiwan Im‐Erbsin, Luis A. Lugo‐Roman, Teetat Kongratanapasert, Jiraporn Paha, Suwimon Manopwisedjaroen, Pakakrong Kwankhao, Kittitach Supannapan, Nittaya Ngamkhae, Nitipol Srimongkolpithak, Pornpun Vivithanaporn, Suradej Hongeng, Arunee Thitithanyanont, Phisit Khemawoot",
      "url": "https://doi.org/10.1016/j.jtcme.2024.05.004",
      "doi": "10.1016/j.jtcme.2024.05.004",
      "verifiedBy": "Crossref"
    },
    {
      "title": "Pharmacological Activities of Fingerroot Extract and Its Phytoconstituents Against SARS-CoV-2 Infection in Golden Syrian Hamsters",
      "year": 2023,
      "journal": "Journal of Experimental Pharmacology",
      "authors": "Teetat Kongratanapasert, Supasek Kongsomros, Nlin Arya, Kripitch Sutummaporn, Witthawat Wiriyarat, Yada Akkhawattanangkul, Tussapon Boonyarattanasoonthorn, Nithi Asavapanumas, Phongthon Kanjanasirirat, Ampa Suksatu, Khanit Sa‐ngiamsuntorn, Suparerk Borwornpinyo, Pornpun Vivithanaporn, Somchai Chutipongtanate, Suradej Hongeng, Boonsong Ongphiphadhanakul, Arunee Thitithanyanont, Phisit Khemawoot, Piyamitr Sritara",
      "url": "https://doi.org/10.2147/jep.s382895",
      "doi": "10.2147/jep.s382895",
      "verifiedBy": "Crossref"
    }
  ],
  "subjects": [
    "vet-physio-lab-2"
  ],
  "topics": [],
  "profiles": {
    "official": "https://culac.chula.ac.th/about/staff"
  },
  "verification": {
    "status": "verified",
    "verifiedAt": "2026-11-11",
    "sources": [
      {
        "label": "CULAC staff",
        "url": "https://culac.chula.ac.th/about/staff"
      },
      {
        "label": "Crossref",
        "url": "https://www.crossref.org/"
      }
    ],
    "publicationsFound": 2
  }
}];
