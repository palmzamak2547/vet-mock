let pending;
export function questionCatalog() {
  if (!pending) pending = Promise.all([
    import('../../src/data/questions.js'), import('../../src/data/question-delivery.generated.js'),
  ]).then(async ([bank, delivery]) => {
    await bank.loadQB();
    return new Map(bank.QB.filter(delivery.isQuestionDeliverable).map(q => [String(q.id), q]));
  }).catch(error => { pending = null; throw error; });
  return pending;
}
