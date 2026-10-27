// Release 5.164.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.164.1',
  date: '2026-10-27',
  headline: 'ลิงก์ VetWiki ที่ไม่มีบทความบอกให้รู้',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ลิงก์บทความ VetWiki ที่ไม่มีอยู่จริงบอกให้รู้', desc: 'ลิงก์บทความที่เก่าหรือพิมพ์ผิดเคยพาไปหน้าสารบัญเฉย ๆ ตอนนี้หน้าสารบัญบอกว่าไม่พบบทความตามลิงก์นั้น และค้นหาต่อจากสารบัญได้' },
  ],
};
