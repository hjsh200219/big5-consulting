const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { StorageManager } = require('../dist/services/storage');
const { ProfileManager } = require('../dist/tools/manageProfile');

const scores = {
  openness: 72,
  conscientiousness: 64,
  extraversion: 48,
  agreeableness: 81,
  neuroticism: 27
};

async function withTempStorage(fn) {
  const baseDir = await mkdtemp(path.join(tmpdir(), 'big5-profile-test-'));

  try {
    const storage = new StorageManager(baseDir);
    await storage.initialize();
    return await fn(storage);
  } finally {
    await rm(baseDir, { recursive: true, force: true });
  }
}

test('ProfileManager creates, reads, updates, lists, and deletes profiles', async () => {
  await withTempStorage(async (storage) => {
    const manager = new ProfileManager(storage);

    const created = await manager.handle({
      action: 'create',
      name: 'Test User',
      scores,
      metadata: { role: 'engineer' }
    });

    assert.equal(created.name, 'Test User');
    assert.match(created.profile_id, /^prof_/);

    const fetched = await manager.handle({
      action: 'get',
      profile_id: created.profile_id
    });

    assert.equal(fetched.name, 'Test User');
    assert.deepEqual(fetched.scores, scores);
    assert.deepEqual(fetched.metadata, { role: 'engineer' });

    const updated = await manager.handle({
      action: 'update',
      profile_id: created.profile_id,
      name: 'Updated User',
      metadata: { team: 'platform' }
    });

    assert.equal(updated.name, 'Updated User');

    const afterUpdate = await manager.handle({
      action: 'get',
      profile_id: created.profile_id
    });

    assert.deepEqual(afterUpdate.metadata, {
      role: 'engineer',
      team: 'platform'
    });

    const list = await manager.handle({ action: 'list' });
    assert.equal(list.total, 1);
    assert.equal(list.profiles[0].profile_id, created.profile_id);

    const deleted = await manager.handle({
      action: 'delete',
      profile_id: created.profile_id
    });

    assert.deepEqual(deleted, {
      profile_id: created.profile_id,
      deleted: true
    });

    const afterDelete = await manager.handle({ action: 'list' });
    assert.equal(afterDelete.total, 0);
  });
});
