#!/usr/bin/env node
// ============================================================
// instructor-portraits.mjs — where each lecturer's portrait came from
// ============================================================
// A profile in src/data/instructors-directory.js may carry
// `photo: { w, h, v }`: the portrait's pixel size and the first 8 hex of the
// SHA-256 of its file. The picture itself is never in this repository. It is
// in the R2 bucket `vetmock-evidence` beside the answer slides, at
// `e/<folder>/people/<slug>.webp`, and the app builds its address from the base
// /api/evidence-pass gives to Chula members only (src/lib/instructor-portrait.js).
//
// Every portrait is the person's own official staff portrait: the image in the
// same staff card as their name on their department's page on vet.chula.ac.th,
// or on the CULAC staff page. A card was used only when its name matched one
// profile's nameEn, nameTh or an alias exactly, titles trimmed, and its image
// was not shared with anyone else (docs/releases/pending/instructor-portraits.md).
//
// One line per person below. To take a portrait down: delete its line, run
//   node scripts/instructor-portraits.mjs --write
// (the profile loses `photo` and shows its initials), and delete the object
// `e/<folder>/people/<slug>.webp` from the bucket.
//
// Usage:
//   node scripts/instructor-portraits.mjs           # check (npm run lint:instructor-portraits)
//   node scripts/instructor-portraits.mjs --write   # apply this list to the directory
//   node scripts/instructor-portraits.mjs upload    # send ROOT/people/*.webp to R2, then check each answers
// ROOT is VMX_EVIDENCE_DATA (default C:/dev/vetmock-evidence-data); upload needs .r2env in the environment.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DIRECTORY_FILE = path.join(here, '..', 'src/data/instructors-directory.js');

// slug: [w, h, v, staff page, the image's address on that page, date fetched]
export const PORTRAITS = {
  "adisorn-adirekthaworn": [320, 320, "b3b797b0", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666941154.jpg", "2026-11-11"],
  "ajjima-chansaenroj": [320, 320, "e6b1ea2f", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-2311760070380.png", "2026-11-11"],
  "alongkorn-amonsin": [320, 320, "d97c6837", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-43-1661143506.jpg", "2026-11-11"],
  "anongnart-assavacheep": [320, 320, "3139ab0b", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-561768451557.jpg", "2026-11-11"],
  "anudep-rungsipipat": [300, 300, "3a54d1a3", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-185-1672305956.jpg", "2026-11-11"],
  "anusak-kijtawornrat": [320, 320, "1e7a1778", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1667188277.jpg", "2026-11-11"],
  "aranya-ponpornpisit": [320, 320, "5a970c77", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-149-1668157648.jpg", "2026-11-11"],
  "araya-radtanakatikanon": [320, 320, "64c8a50f", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-196-1672330785.jpg", "2026-11-11"],
  "athipoo-nuntaprasert": [320, 320, "cf9777e7", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668158630.jpg", "2026-11-11"],
  "aunyaratana-tonteerawong": [320, 320, "9f8b19d5", "https://vet.chula.ac.th/department/microbiology", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-12-1672329995.jpg", "2026-11-11"],
  "benchaphorn-limcharoen": [320, 320, "04e01116", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/department/staff/staff-1261763013116.jpg", "2026-11-11"],
  "boonrit-thongsong": [320, 320, "812815ef", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-281760064211.png", "2026-11-11"],
  "chackrit-nuengjamnong": [320, 320, "893cc60b", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-131768451352.jpg", "2026-11-11"],
  "chaidate-inchaisri": [320, 320, "a7253574", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668162035.jpg", "2026-11-11"],
  "chaiyot-tanrattana": [320, 320, "8b3a5898", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-162-1674002607.jpg", "2026-11-11"],
  "chalika-wangdee": [320, 320, "e6ec5f14", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-63-1670686737.png", "2026-11-11"],
  "charnnarong-rodkhum": [320, 320, "cfabc483", "https://vet.chula.ac.th/department/microbiology", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-9-1672330355.jpg", "2026-11-11"],
  "chatree-ketviraveach": [320, 320, "dc10c56b", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-311768451568.jpg", "2026-11-11"],
  "chenpop-sawangmake": [320, 320, "548f8e8c", "https://vet.chula.ac.th/department/%E0%B9%80%E0%B8%A0%E0%B8%AA%E0%B8%B1%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-lvew", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-183-1673505984.png", "2026-11-11"],
  "chutamas-benjanirut": [320, 320, "848014bb", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-207-1676621795.jpg", "2026-11-11"],
  "chutimon-thanaboonnipat": [320, 320, "af894d30", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-55-1670688207.png", "2026-11-11"],
  "dachrit-nilubol": [320, 320, "bb087dbd", "https://vet.chula.ac.th/department/microbiology", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-16-1672330206.jpg", "2026-11-11"],
  "damri-daraviroj": [320, 320, "c536a61f", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/department/staff/staff-1181763012304.jpg", "2026-11-11"],
  "ekkapol-akkraputtiporn": [320, 320, "14cf8719", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1661312504.jpg", "2026-11-11"],
  "gunnaporn-suriyaphol": [320, 320, "f63f03c2", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B9%80%E0%B8%84%E0%B8%A1%E0%B8%B5", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-26-1693894169.jpg", "2026-11-11"],
  "hatairat-plaimast": [320, 320, "e115cf38", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-331768451365.jpg", "2026-11-11"],
  "kamol-sakulwira": [320, 320, "93bc9dda", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666931552.jpg", "2026-11-11"],
  "kamonpan-charoenkul": [320, 320, "2aa73dee", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-49-1661146925.jpg", "2026-11-11"],
  "kananuch-vasunthararaksa": [320, 320, "7be495f3", "https://vet.chula.ac.th/department/%E0%B9%80%E0%B8%A0%E0%B8%AA%E0%B8%B1%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-lvew", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-227-1705304655.png", "2026-11-11"],
  "kasem-rattanapinyopituk": [320, 320, "6a5e18f8", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-195-1677305728.jpg", "2026-11-11"],
  "kaywalee-chatdarong": [320, 320, "e7c45dea", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666775246.jpg", "2026-11-11"],
  "kittipong-tachampa": [320, 320, "392fea1b", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1667188135.jpg", "2026-11-11"],
  "kittisak-ajariyakhajorn": [320, 320, "218622f7", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668157149.jpg", "2026-11-11"],
  "komkrich-tiankam": [320, 320, "1a3e8109", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-190-1672330469.jpg", "2026-11-11"],
  "kongkiat-srisuwattanaskul": [260, 260, "7e6659f2", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666930987.jpg", "2026-11-11"],
  "krichaporn-kradanggha": [296, 296, "1092ed5c", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-69-1670687539.png", "2026-11-11"],
  "kriengyot-satchajerinpong": [320, 320, "ccc19752", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666929218.jpg", "2026-11-11"],
  "kris-angkanaporn": [320, 320, "c2839390", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1667181654.jpg", "2026-11-11"],
  "krissda-boonaramrueng": [320, 320, "c3156b79", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/department/staff/staff-2501779335835.jpg", "2026-11-11"],
  "krit-komin": [320, 320, "17d597db", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-61-1670686360.png", "2026-11-11"],
  "kumpanart-soontornvipart": [320, 320, "c3ba221b", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-60-1670686138.png", "2026-11-11"],
  "meena-sarikaphuti": [320, 320, "4e94bfdb", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B9%80%E0%B8%84%E0%B8%A1%E0%B8%B5", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1660896303.jpg", "2026-11-11"],
  "morakot-kaewthamasorn": [320, 320, "22d5afe7", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%AA%E0%B8%B4%E0%B8%95%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/department/staff/staff-421753077425.jpg", "2026-11-11"],
  "morakot-nantapaitoon": [320, 320, "d43036c0", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666778444.jpg", "2026-11-11"],
  "nalinee-tantiwanich": [320, 320, "a9287f1f", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-62-1670686587.png", "2026-11-11"],
  "nan-choisunirachon": [320, 320, "f511bd90", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-64-1670686934.png", "2026-11-11"],
  "nataya-charoenvisal": [320, 320, "f96e892f", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-160-1670991666.png", "2026-11-11"],
  "natchanon-damneam": [320, 320, "a68b839e", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/department/staff/staff-2341789633641.jpg", "2026-11-11"],
  "navapon-techakriengkrai": [320, 320, "03c1a2d7", "https://vet.chula.ac.th/department/microbiology", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-17-1672330158.jpg", "2026-11-11"],
  "nicole-mehl": [320, 320, "39f28a1a", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-70-1670687692.png", "2026-11-11"],
  "nipattra-suwanpairintr": [320, 320, "8bd272da", "https://vet.chula.ac.th/department/%E0%B9%80%E0%B8%A0%E0%B8%AA%E0%B8%B1%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-lvew", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-145-1673505866.png", "2026-11-11"],
  "niwat-chansiripornchai": [320, 320, "bbeccefd", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-151-1668426605.jpg", "2026-11-11"],
  "nopadon-pirarat": [320, 320, "b59aaabb", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1672307336.jpg", "2026-11-11"],
  "nutthee-am-in": [320, 320, "d35734a3", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666778688.jpg", "2026-11-11"],
  "nuvee-prapasarakul": [320, 320, "7124ce99", "https://vet.chula.ac.th/department/microbiology", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-11-1672329788.jpg", "2026-11-11"],
  "orapun-chaturakanchanaphon": [320, 320, "fe1316b6", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-71-1670687876.png", "2026-11-11"],
  "padet-tummaruk": [320, 320, "38c1c71e", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666775901.jpg", "2026-11-11"],
  "paisan-tianthailand": [320, 320, "505c4c54", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666930389.jpg", "2026-11-11"],
  "panrawee-viriyasitthawat": [320, 320, "1e558d6c", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-67-1670688381.png", "2026-11-11"],
  "patharapol-piamsomboon": [320, 320, "6ea2963c", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668165657.jpg", "2026-11-11"],
  "pattaramonchat-bunnak": [320, 320, "35d8e651", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/department/staff/staff-661788254723.jpg", "2026-11-11"],
  "pattrarat-chanchaithong": [320, 320, "94bbb6bf", "https://vet.chula.ac.th/department/microbiology", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-14-1686723984.jpg", "2026-11-11"],
  "pawana-ueasiri": [320, 320, "8c1828e9", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/department/staff/staff-1251763012798.jpg", "2026-11-11"],
  "piyanan-taweethavonsawat": [320, 320, "8b93d28c", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%AA%E0%B8%B4%E0%B8%95%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-87-1670040654.jpg", "2026-11-11"],
  "piyanat-prasomsri": [320, 320, "55aab3b1", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/department/staff/staff-1631779338763.png", "2026-11-11"],
  "piyarat-chansiripornchai": [320, 320, "75d4f7de", "https://vet.chula.ac.th/department/%E0%B9%80%E0%B8%A0%E0%B8%AA%E0%B8%B1%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-lvew", "https://vet.chula.ac.th/storage/department/staff/staff-1811788334557.jpg", "2026-11-11"],
  "praopilas-phakdeedindan": [320, 320, "e827ffdb", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-341768451376.jpg", "2026-11-11"],
  "prapaporn-jongwattanapisan": [320, 320, "7a1238c5", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668423968.jpg", "2026-11-11"],
  "prapruddee-piyaviriyakul": [320, 320, "2c5a6ac7", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B9%80%E0%B8%84%E0%B8%A1%E0%B8%B5", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1689503631.jpg", "2026-11-11"],
  "promporn-raksaseri": [320, 320, "fe139569", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/department/staff/staff-1211763012319.jpg", "2026-11-11"],
  "punnarat-vibulchan": [320, 320, "d5e3c2bc", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666931894.jpg", "2026-11-11"],
  "punyamanee-yamkate": [320, 320, "9a50fc78", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-168-1670992071.png", "2026-11-11"],
  "roongroje-thanawongnuwech": [320, 320, "b4d33c8a", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-188-1672330416.png", "2026-11-11"],
  "roongtham-kedkovid": [320, 320, "c57794a2", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/department/staff/staff-1671779335275.png", "2026-11-11"],
  "ruchikon-jongsuwanwattana": [320, 320, "39eb2e85", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/department/staff/staff-2411765860207.jpg", "2026-11-11"],
  "rungtip-chuanchuen": [320, 320, "77793b0a", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1661143488.jpg", "2026-11-11"],
  "saharuetai-jeamsripong": [320, 320, "00eaf54a", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-47-1661145584.jpg", "2026-11-11"],
  "saikaew-sutayatram": [320, 320, "7a3fbfab", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-140-1678775762.jpg", "2026-11-11"],
  "sanipa-suradhat": [320, 320, "7889f17d", "https://vet.chula.ac.th/department/microbiology", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-10-1672329893.jpg", "2026-11-11"],
  "saranporn-poothong": [320, 320, "7eb24c7f", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-2371758683796.png", "2026-11-11"],
  "sarinee-kalandakanond-thongsong": [320, 320, "bfc3113d", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1667184254.jpg", "2026-11-11"],
  "saritvich-pannyabaribun": [320, 320, "d1252e67", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/department/staff/staff-2361763011986.jpg", "2026-11-11"],
  "sariya-asawakarn": [320, 320, "f54c8944", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B9%80%E0%B8%84%E0%B8%A1%E0%B8%B5", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1683013788.jpg", "2026-11-11"],
  "sawang-kesdangsakonwut": [320, 320, "be473ce2", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-193-1672330512.jpg", "2026-11-11"],
  "sawita-santivipatana": [320, 320, "4d0a0c76", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/department/staff/staff-01752467972.jpg", "2026-11-11"],
  "sayamon-srisuwattanaskul": [320, 320, "17db8252", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-4-1666926376.jpg", "2026-11-11"],
  "sirakarnt-dhitavat": [320, 320, "40dca747", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B9%80%E0%B8%84%E0%B8%A1%E0%B8%B5", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1683013370.jpg", "2026-11-11"],
  "sirawit-pakdeephanichkit": [320, 320, "5a45e085", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1661146467.jpg", "2026-11-11"],
  "sirinun-thabthiang": [320, 320, "4038760e", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-72-1670688142.png", "2026-11-11"],
  "siriwan-sakrintr": [320, 320, "2a631e52", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B9%80%E0%B8%84%E0%B8%A1%E0%B8%B5", "https://vet.chula.ac.th/storage/department/staff/staff-2351740022380.jpg", "2026-11-11"],
  "siriwat-suadsong": [320, 320, "8eb11000", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666777736.jpg", "2026-11-11"],
  "sitilak-surachetpong": [320, 320, "4447e783", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668154881.jpg", "2026-11-11"],
  "somporn-techangamsuwan": [320, 320, "81cc6d44", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/department/staff/staff-1921770278723.jpg", "2026-11-11"],
  "somsak-pakpinyo": [320, 320, "097ec463", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668156134.jpg", "2026-11-11"],
  "sonthaya-tiawsirisup": [320, 320, "459ec5cf", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%AA%E0%B8%B4%E0%B8%95%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-86-1670040584.jpg", "2026-11-11"],
  "sroisuda-chotimanukul": [320, 320, "6df7d869", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666778994.jpg", "2026-11-11"],
  "sukullaya-ritthikulprasert": [320, 320, "2af4a845", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-153-1670991183.png", "2026-11-11"],
  "sumit-durongphongtorn": [320, 320, "39dc185b", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-59-1670685971.png", "2026-11-11"],
  "sumonwan-chamsuwan": [320, 320, "2dfd3420", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-208-1678328974.png", "2026-11-11"],
  "sumpun-thammacharoen": [320, 320, "81fce501", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-3-1667183015.jpg", "2026-11-11"],
  "suphachai-nuanualsuwan": [320, 320, "d24b4775", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82", "https://vet.chula.ac.th/storage/department/staff/staff-451771208831.jpg", "2026-11-11"],
  "suphot-wattanaphansak": [320, 320, "71f27020", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668163918.jpg", "2026-11-11"],
  "supol-semserimbun": [320, 320, "ae23255c", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/department/staff/staff-51763012556.jpg", "2026-11-11"],
  "suppawiwat-ponglowhapan": [320, 320, "0b08dcde", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/department/staff/staff-2511790908239.jpg", "2026-11-11"],
  "sutthasinee-poonyachoti": [320, 320, "5bd8ccf3", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1667183165.jpg", "2026-11-11"],
  "suwanakiet-sawangkoon": [320, 320, "6d01201e", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-ftpi", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1667182902.jpg", "2026-11-11"],
  "talerngsak-angkuraseranee": [320, 320, "32ba462e", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B8%9A%E0%B8%B2%E0%B8%A5-le1u", "https://vet.chula.ac.th/storage/department/staff/staff-2331760069934.png", "2026-11-11"],
  "taradon-luangtongkum": [320, 320, "0557463a", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-46-1661147037.jpg", "2026-11-11"],
  "teerapol-chingkangsadar": [320, 320, "04304de5", "https://vet.chula.ac.th/department/%E0%B8%A8%E0%B8%B1%E0%B8%A5%E0%B8%A2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "https://vet.chula.ac.th/storage/department/staff/staff-741752466316.png", "2026-11-11"],
  "teerawat-sawangchun-uthai": [320, 320, "199f56c4", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/department/staff/staff-941790907126.jpg", "2026-11-11"],
  "teerawut-nedumpun": [320, 320, "525fc8c4", "https://vet.chula.ac.th/department/microbiology", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-19-1672330023.jpg", "2026-11-11"],
  "thanida-haetrakul": [320, 320, "28e0bebd", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-166-1670991898.png", "2026-11-11"],
  "thavajchai-lekdamrongsak": [320, 320, "39180013", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668164813.jpg", "2026-11-11"],
  "theerawat-tharasanit": [320, 320, "8977732d", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%80%E0%B8%98%E0%B8%99%E0%B8%B8%E0%B9%80%E0%B8%A7%E0%B8%8A%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%B7%E0%B8%9A%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666777368.jpg", "2026-11-11"],
  "theerayuth-kaewamatawong": [300, 300, "830d5031", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1672309069.jpg", "2026-11-11"],
  "tussapon-boonyarattanasoonthorn": [320, 320, "e4fd92f6", "https://culac.chula.ac.th/about/staff", "https://cms.makewell.co.th/uploads/27089544-026a-44d4-af56-c339a571c5ca/2026/10/1791882006_image.jpg", "2026-11-11"],
  "vachira-hunprasit": [320, 320, "a757b003", "https://vet.chula.ac.th/department/%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-ukzh", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1668165147.jpg", "2026-11-11"],
  "wijit-banlunara": [320, 320, "04e52413", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-189-1672330948.jpg", "2026-11-11"],
  "woraporn-sukhumavasi": [320, 320, "b6c01d73", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9B%E0%B8%A3%E0%B8%AA%E0%B8%B4%E0%B8%95%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-88-1670473827.jpg", "2026-11-11"],
  "worrayanee-thammathorn": [320, 320, "fa77acc0", "https://vet.chula.ac.th/department/%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82", "https://vet.chula.ac.th/storage/department/staff/staff-501752637715.jpg", "2026-11-11"],
  "wuthichai-klomkliao": [320, 320, "c71b85f5", "https://vet.chula.ac.th/department/anatomy", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-0-1666930236.jpg", "2026-11-11"],
  "yaowalak-panyasing": [320, 320, "f19fe842", "https://vet.chula.ac.th/department/%E0%B8%AB%E0%B8%99%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2", "https://vet.chula.ac.th/storage/dept_anatomy/image-staff-194-1672329641.jpg", "2026-11-11"],
};

const SOURCE_PAGES = /^https:\/\/(?:vet\.chula\.ac\.th\/(?:en\/)?department\/[\w%-]+|culac\.chula\.ac\.th\/about\/staff)$/;
const IMAGE_HOSTS = new Set(['vet.chula.ac.th', 'cms.makewell.co.th']);   // the faculty's own storage; the CMS the CULAC site serves its images from
const PHOTO_KEYS = ['w', 'h', 'v'];

/** Every problem with the directory's photos against this list; an empty array when they agree. */
export function checkPortraits(directory, portraits = PORTRAITS) {
  const problems = [];
  const slugs = new Set(directory.map((p) => p.slug));
  for (const p of directory) {
    if (p.photo === undefined) {
      if (portraits[p.slug]) problems.push(`${p.slug}: listed in instructor-portraits.mjs but the profile has no photo (run --write)`);
      continue;
    }
    const ph = p.photo;
    const keys = ph && typeof ph === 'object' ? Object.keys(ph).sort().join(',') : '';
    if (keys !== 'h,v,w') { problems.push(`${p.slug}: photo must be exactly { w, h, v }`); continue; }
    if (!Number.isInteger(ph.w) || !Number.isInteger(ph.h) || ph.w < 120 || ph.w > 320 || ph.h !== ph.w) problems.push(`${p.slug}: photo must be a square of 120 to 320 px`);
    if (!/^[0-9a-f]{8}$/.test(ph.v)) problems.push(`${p.slug}: photo.v must be 8 hex characters`);
    const row = portraits[p.slug];
    if (!row) { problems.push(`${p.slug}: has a photo but no line in instructor-portraits.mjs`); continue; }
    if (row[0] !== ph.w || row[1] !== ph.h || row[2] !== ph.v) problems.push(`${p.slug}: photo differs from its line in instructor-portraits.mjs (run --write)`);
  }
  for (const [slug, row] of Object.entries(portraits)) {
    if (!slugs.has(slug)) problems.push(`${slug}: in instructor-portraits.mjs but not in the directory`);
    if (!Array.isArray(row) || row.length !== 6) { problems.push(`${slug}: a line is [w, h, v, page, image, date]`); continue; }
    const [, , , page, image, fetched] = row;
    if (!SOURCE_PAGES.test(page)) problems.push(`${slug}: the source must be a department staff page of vet.chula.ac.th or the CULAC staff page`);
    let host = '';
    try { host = new URL(image).host; } catch { /* reported below */ }
    if (!image.startsWith('https://') || !IMAGE_HOSTS.has(host)) problems.push(`${slug}: the image address must be on the source site's own storage`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fetched)) problems.push(`${slug}: the date fetched is YYYY-MM-DD`);
  }
  return problems;
}

/** The directory with `photo` set from this list, every other photo removed; `photo` sits after `email`. */
export function applyPortraits(directory, portraits = PORTRAITS) {
  return directory.map((p) => {
    const { photo: _old, ...rest } = p;
    const row = portraits[p.slug];
    if (!row) return rest;
    const out = {};
    for (const [k, v] of Object.entries(rest)) {
      out[k] = v;
      if (k === 'email') out.photo = { w: row[0], h: row[1], v: row[2] };
    }
    if (!out.photo) out.photo = { w: row[0], h: row[1], v: row[2] };
    return out;
  });
}

async function loadDirectory() {
  return (await import(pathToFileURL(DIRECTORY_FILE).href)).INSTRUCTOR_DIRECTORY;
}

async function write() {
  const text = fs.readFileSync(DIRECTORY_FILE, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const at = text.indexOf('export const INSTRUCTOR_DIRECTORY = ');
  const next = applyPortraits(await loadDirectory());
  const body = `${text.slice(0, at).replace(/\r\n/g, '\n')}export const INSTRUCTOR_DIRECTORY = ${JSON.stringify(next, null, 2)};\n`;
  fs.writeFileSync(DIRECTORY_FILE, body.replace(/\n/g, eol));
  console.log(`${Object.keys(PORTRAITS).length} profiles carry a portrait`);
}

async function upload() {
  const DATA = path.resolve(process.env.VMX_EVIDENCE_DATA || 'C:/dev/vetmock-evidence-data');
  const { CLOUDFLARE_API_TOKEN: token, R2_ACCOUNT_ID: account } = process.env;
  if (!token || !account) throw new Error('set CLOUDFLARE_API_TOKEN and R2_ACCOUNT_ID (.r2env) to upload');
  // The folder name is the grant (api/evidence-pass.js hands it to members): never printed, never in the repository.
  const folder = (process.env.VMX_EVIDENCE_FOLDER || fs.readFileSync(path.join(DATA, 'folder.txt'), 'utf8')).trim();
  if (!/^[0-9a-f]{32}$/.test(folder)) throw new Error('ROOT/folder.txt must hold the 32 hex characters of the image folder');
  let sent = 0; let bytes = 0; let ok = 0; const failed = [];
  for (const [slug, row] of Object.entries(PORTRAITS)) {
    const file = path.join(DATA, 'people', `${slug}.webp`);
    if (!fs.existsSync(file)) { failed.push(`${slug}: no file in ROOT/people`); continue; }
    const body = fs.readFileSync(file);
    if (crypto.createHash('sha256').update(body).digest('hex').slice(0, 8) !== row[2]) { failed.push(`${slug}: file differs from its v`); continue; }
    const key = `e/${folder}/people/${slug}.webp`;
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/r2/buckets/vetmock-evidence/objects/${key}`, {
      method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable' }, body,
    });
    if (!res.ok) { failed.push(`${slug}: upload answered ${res.status}`); continue; }
    sent++; bytes += body.length;
    const got = await fetch(`https://slides.vetmock.com/${key}?v=${row[2]}`);
    if (got.status === 200) ok++; else failed.push(`${slug}: served ${got.status}`);
    await got.arrayBuffer().catch(() => {});
  }
  console.log(`uploaded ${sent} (${bytes} bytes), answering 200: ${ok} of ${Object.keys(PORTRAITS).length}`);
  for (const f of failed) console.log(`  ${f}`);
  if (failed.length) process.exitCode = 1;
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) {
  const arg = process.argv[2];
  if (arg === '--write') await write();
  else if (arg === 'upload') await upload();
  else {
    const problems = checkPortraits(await loadDirectory());
    if (problems.length) {
      console.error(`instructor portraits: ${problems.length} problem(s)`);
      for (const p of problems) console.error(`  ${p}`);
      process.exit(1);
    }
    console.log(`instructor portraits: ${Object.keys(PORTRAITS).length} portraits, each with its source`);
  }
}
