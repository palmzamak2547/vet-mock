import { QB as QB1 } from './questions-part1.js';
import { QB_PART2 } from './questions-part2.js';
import { QB_PART3 } from './questions-part3.js';

export const QB = [...QB1, ...QB_PART2, ...QB_PART3];

export const SUBJECTS = [
  { id: 'all',    name: 'รวมทุกวิชา',      name_en: 'All Subjects',       icon: '📚', color: '#2b2419' },
  { id: 'surg2',  name: 'Vet Surg Lab II', name_en: 'Soft Tissue / Eye',  icon: '👁️', color: '#4a6b4a' },
  { id: 'surg3',  name: 'Vet Surg Lab III', name_en: 'Orthopedic',         icon: '🦴', color: '#c26d6d' },
  { id: 'repro',  name: 'Repro Lab',       name_en: 'Reproduction',       icon: '🐾', color: '#b88940' },
  { id: 'com4',   name: 'COM IV',          name_en: 'Clinical Medicine',  icon: '🩺', color: '#3d6b82' },
  { id: 'com3',   name: 'COM III / Rumen', name_en: 'Large Animal',       icon: '🐄', color: '#7d4a44' },
  { id: 'exotic', name: 'Exotic / PP',     name_en: 'Exotic & Post-Grad', icon: '🦜', color: '#7d4a7d' },
];
