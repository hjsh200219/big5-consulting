const assert = require('node:assert/strict');
const test = require('node:test');

const {
  calculateScores,
  getQuestionBatch,
  getRandomQuestions,
  getShortQuestions,
  mapAnswersToTraits
} = require('../dist/data/questions');

test('getRandomQuestions excludes answered questions and caps batches at five', () => {
  const questions = getRandomQuestions([1, 2, 3], true);

  assert.ok(questions.length <= 5);
  assert.ok(questions.length > 0);
  assert.ok(questions.every((question) => ![1, 2, 3].includes(question.number)));
  assert.ok(questions.every((question) => question.number >= 1 && question.number <= 30));
});

test('question helpers can return English survey text', () => {
  const shortQuestions = getShortQuestions('en');
  const opennessBatch = getQuestionBatch('openness', 1, 'en');
  const randomQuestions = getRandomQuestions([], true, 'en');

  assert.equal(shortQuestions.length, 30);
  assert.equal(opennessBatch.length, 5);
  assert.ok(randomQuestions.length > 0);

  for (const question of [...shortQuestions, ...opennessBatch, ...randomQuestions]) {
    assert.doesNotMatch(question.text, /[가-힣]/);
    assert.equal(typeof question.reverse_scored, 'boolean');
  }
});

test('mapAnswersToTraits and calculateScores preserve reverse-scored behavior', () => {
  const answers = {};
  for (let questionNumber = 1; questionNumber <= 30; questionNumber += 1) {
    answers[questionNumber] = 5;
  }

  const mapped = mapAnswersToTraits(answers, true);
  assert.equal(mapped.openness.length, 6);
  assert.equal(mapped.neuroticism.length, 6);

  const scores = calculateScores(mapped);

  assert.equal(scores.openness, 83);
  assert.equal(scores.conscientiousness, 100);
  assert.equal(scores.extraversion, 100);
  assert.equal(scores.agreeableness, 100);
  assert.equal(scores.neuroticism, 100);
});
