// ============================================================
// seed-vetmock.mjs — Development / Testing Seed Script
// ============================================================

/**
 * DEMO & TEST-ONLY Seed Records
 * Explicitly tagged with isDemo: true & visibility: 'test_only'
 */
export const DEMO_SEED_DATA = {
  domains: [
    {
      id: 'domain-exotic-medicine',
      slug: 'exotic-medicine',
      name: 'Exotic Medicine (DEMO ONLY)',
      description: 'Avian, Reptile, and Small Mammal Veterinary Medicine practice domain',
      isPublished: true,
      isDemo: true,
      visibility: 'test_only',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  wikiPages: [
    {
      id: 'page-exotic-avian-reptile',
      domainId: 'domain-exotic-medicine',
      pageId: 'exotic-avian-and-reptile-medicine',
      title: 'Exotic Avian and Reptile Medicine (DEMO ONLY)',
      status: 'approved',
      sourceApprovalRef: 'DEMO_ONLY_REF_001',
      isDemo: true,
      visibility: 'test_only',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  wikiAnchors: [
    {
      id: 'anchor-avian-anatomy-approved',
      wikiPageId: 'page-exotic-avian-reptile',
      anchorId: 'avian-anatomy-and-common-diseases',
      title: 'Avian Anatomy and Common Diseases (DEMO ONLY)',
      contentSummary: 'Approved summary of avian respiratory and digestive anatomy.',
      status: 'approved',
      mappingEligible: true,
      sourceApprovalRef: 'DEMO_ONLY_REF_001',
      isDemo: true,
      visibility: 'test_only',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  questions: [
    {
      id: 'q-exotic-001',
      domainId: 'domain-exotic-medicine',
      questionCode: 'EXOTIC-001',
      stem: 'Which structure in the avian respiratory system connects the posterior air sacs to the lungs? (DEMO ONLY)',
      choices: [
        'Syrinx',
        'Primary bronchi',
        'Neopulmonic parabronchi',
        'Paleopulmonic parabronchi',
      ],
      correctChoiceIndex: 3,
      explanation: 'Paleopulmonic parabronchi comprise the majority of the avian lung structure with unidirectional airflow.',
      difficulty: 'medium',
      status: 'published',
      isDemo: true,
      visibility: 'test_only',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  questionWikiRefs: [
    {
      id: 'ref-exotic-001',
      questionId: 'q-exotic-001',
      wikiPageId: 'page-exotic-avian-reptile',
      wikiAnchorId: 'anchor-avian-anatomy-approved',
      isDemo: true,
      visibility: 'test_only',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

export function runSeed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('HARD SAFETY GUARD: Seed script cannot run in production (NODE_ENV === "production").');
  }

  console.log('🌱 Seeding VetMock DEV/TEST ONLY records...');
  console.log(`- ${DEMO_SEED_DATA.domains.length} Domain(s)`);
  console.log(`- ${DEMO_SEED_DATA.wikiPages.length} Wiki Page(s)`);
  console.log(`- ${DEMO_SEED_DATA.wikiAnchors.length} Wiki Anchor(s)`);
  console.log(`- ${DEMO_SEED_DATA.questions.length} Question(s)`);
  console.log('✅ Dev seed completed successfully!');
  return DEMO_SEED_DATA;
}

if (process.argv[1]?.endsWith('seed-vetmock.mjs')) {
  runSeed();
}
