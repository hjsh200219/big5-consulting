const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { getToolSchema } = require('../dist/schemas');
const { StorageManager } = require('../dist/services/storage');
const { SurveyManager } = require('../dist/tools/manageSurvey');

async function withTempSurveyManager(fn) {
  const baseDir = await mkdtemp(path.join(tmpdir(), 'big5-survey-language-test-'));

  try {
    const storage = new StorageManager(baseDir);
    await storage.initialize();
    return await fn(new SurveyManager(storage));
  } finally {
    await rm(baseDir, { recursive: true, force: true });
  }
}

function assertEnglishQuestions(questions) {
  assert.ok(questions.length > 0);
  for (const question of questions) {
    assert.doesNotMatch(question.text, /[가-힣]/);
  }
}

test('SurveyManager returns and preserves English survey text', async () => {
  await withTempSurveyManager(async (manager) => {
    const started = await manager.handle({
      action: 'start',
      name: 'English User',
      version: 'short',
      language: 'en'
    });

    assert.equal(started.version, 'short');
    assert.equal(started.language, 'en');
    assert.match(started.instruction, /Answer each question/);
    assertEnglishQuestions(started.questions);

    const submitted = await manager.handle({
      action: 'submit',
      session_id: started.session_id,
      answers: [3, 3, 3, 3, 3]
    });

    assert.equal(submitted.language, 'en');
    assertEnglishQuestions(submitted.next_questions);

    const resumed = await manager.handle({
      action: 'resume',
      session_id: started.session_id
    });

    assert.equal(resumed.language, 'en');
    assert.match(resumed.instruction, /Answer each question/);
    assertEnglishQuestions(resumed.questions);
  });
});

test('manage_survey schema exposes version and language options', () => {
  const schema = getToolSchema('manage_survey');
  assert.ok(schema);

  const properties = schema.inputSchema.properties;
  assert.deepEqual(properties.version.enum, ['short', 'full']);
  assert.deepEqual(properties.language.enum, ['ko', 'en']);
});
