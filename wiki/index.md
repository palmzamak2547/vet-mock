---
id: index
title: VetMock Wiki Master Index
type: reference
version: 1.0.0
status: approved
tags: [index, toc, main]
sourceRefs:
  - path: README.md
lastReviewed: 2026-07-23
---

# 🐾 VetMock Wiki Master Index

สารบัญดัชนีหลักสำหรับเข้าถึงเอกสารและสถาปัตยกรรมทั้งหมดของโปรเจกต์ VetMock

---

## 📐 สถาปัตยกรรมและมาตรฐาน (Architecture & Standards)
- [Wiki Schema & Standards](./SCHEMA.md) - ข้อกำหนด Frontmatter, Anchor Identity และ Citation Contract
- [Architecture Overview](./architecture/overview.md) - สถาปัตยกรรมหลักระบบ, State Router ใน App.jsx และ Lazy Chunks

## 🧠 โดเมนหลัก (Core Domains)
- [Question Bank Engine](./domain/question-bank-engine.md) - โครงสร้างคลังข้อสอบ, SM-2 Spaced Repetition และ ID Migration System
- **COM5 — Companion Animal Infectious Diseases (Drafts):**
  - [Canine Viral Enteritis (CPV-2, CCV, CRV)](./domain/com-5/canine-viral-enteritis.md)
  - [Feline Upper Respiratory Infection Complex](./domain/com-5/feline-upper-respiratory-complex.md)
  - [Rabies Pathogenesis & Vaccination Guidelines (WSAVA/VPAT 2024)](./domain/com-5/rabies-and-vaccine-guidelines.md)
  - [Small Animal Mycoses & GI Protozoal Infections](./domain/com-5/systemic-mycoses-and-protozoa.md)
  - 📋 [Domain Owner Review & Approval Pack (COM5)](./reviews/com5-domain-owner-review.md)
- **REPRO-LECT — Companion Animal Reproduction (Wave 1 Drafts):**
  - [Companion Animal Theriogenology & Reproductive Medicine](./domain/repro/canine-feline-theriogenology.md)
  - [Semen Evaluation, Preservation & Reproductive Biotechnology](./domain/repro/semen-evaluation-preservation.md)
  - 📋 [Domain Owner Review & Approval Pack (REPRO-LECT)](./reviews/repro-domain-owner-review.md)
- **EXOTIC — Wildlife & Exotic Pet Health Management (Wave 1 Drafts):**
  - [Avian & Reptile Health Management](./domain/exotic/avian-and-reptile-medicine.md)
  - [Small Mammal Exotic Pet Medicine](./domain/exotic/small-mammal-medicine.md)
  - 📋 [Domain Owner Review & Approval Pack (EXOTIC)](./reviews/exotic-domain-owner-review.md)
- **POULTRY — Poultry Health Management (Wave 2 Drafts):**
  - [Avian Viral & Bacterial Diseases](./domain/poultry/poultry-viral-and-bacterial-diseases.md)
  - [Avian Parasites & Flock Hygiene](./domain/poultry/poultry-parasites-and-flock-hygiene.md)
  - 📋 [Domain Owner Review & Approval Pack (POULTRY)](./reviews/poultry-domain-owner-review.md)
- **FOOD-SAFETY — Milk & Meat Hygiene / Zoonoses (Wave 2 Drafts):**
  - [Milk & Meat Hygiene Standards](./domain/food-safety/food-safety-milk-and-meat-hygiene.md)
  - [Major Zoonoses & Public Health](./domain/food-safety/food-safety-major-zoonoses-and-public-health.md)
  - 📋 [Domain Owner Review & Approval Pack (FOOD-SAFETY)](./reviews/food-safety-domain-owner-review.md)

## ⚡ ฟีเจอร์และส่วนประสานงาน (Features & Protocols)
- [AI Question Source Citation Protocol](./features/ai-question-source-citation.md) - ข้อกำหนดการระบุแหล่งอ้างอิงสำหรับ AI และ UI Citation Chip

## 🔌 การเชื่อมต่อและระบบภายนอก (Integrations)
- [API & Edge Specifications](./integrations/api-and-edge.md) - Serverless Endpoints, Rate Limiting (Upstash Redis) และ Line Auth

## 🛠️ ปฏิบัติการและการทดสอบ (Operations & Testing)
- [Testing & CI Quality Gates](./operations/testing-and-ci.md) - คำสั่งทดสอบระบบ, สคริปต์ Lint และ CI Validation

## 📚 คู่มือการดำเนินงาน (Guides)
- [Content Pipeline Guide](./guides/content-pipeline.md) - ขั้นตอนการจัดทำสรุปวิดีโอและกระบวนการนำเข้าข้อสอบ
