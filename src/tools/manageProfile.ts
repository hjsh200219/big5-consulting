import { ManageProfileParams, Profile } from '../types';
import { StorageManager } from '../services/storage';

export class ProfileManager {
  constructor(private storage: StorageManager) {}

  async handle(params: ManageProfileParams): Promise<any> {
    const { action } = params;

    switch (action) {
      case 'create':
        return this.create(params);
      case 'get':
        return this.get(params);
      case 'update':
        return this.update(params);
      case 'delete':
        return this.delete(params);
      case 'list':
        return this.list(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async create(params: ManageProfileParams): Promise<any> {
    if (!params.name || !params.scores) {
      throw new Error('name and scores are required for create action');
    }

    const profile: Profile = {
      id: `prof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      scores: params.scores,
      metadata: params.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await this.storage.saveProfile(profile);

    return {
      profile_id: profile.id,
      name: profile.name,
      scores: profile.scores,
      created_at: profile.created_at
    };
  }

  private async get(params: ManageProfileParams): Promise<any> {
    if (!params.profile_id) {
      throw new Error('profile_id is required for get action');
    }

    const profile = await this.storage.getProfile(params.profile_id);
    if (!profile) {
      throw new Error(`Profile not found: ${params.profile_id}`);
    }

    return profile;
  }

  private async update(params: ManageProfileParams): Promise<any> {
    if (!params.profile_id) {
      throw new Error('profile_id is required for update action');
    }

    const profile = await this.storage.getProfile(params.profile_id);
    if (!profile) {
      throw new Error(`Profile not found: ${params.profile_id}`);
    }

    // 업데이트 가능 필드
    if (params.name) profile.name = params.name;
    if (params.scores) profile.scores = params.scores;
    if (params.metadata) profile.metadata = { ...profile.metadata, ...params.metadata };
    profile.updated_at = new Date().toISOString();

    await this.storage.saveProfile(profile);

    return {
      profile_id: profile.id,
      name: profile.name,
      scores: profile.scores,
      updated_at: profile.updated_at
    };
  }

  private async delete(params: ManageProfileParams): Promise<any> {
    if (!params.profile_id) {
      throw new Error('profile_id is required for delete action');
    }

    const success = await this.storage.deleteProfile(params.profile_id);
    if (!success) {
      throw new Error(`Failed to delete profile: ${params.profile_id}`);
    }

    return {
      profile_id: params.profile_id,
      deleted: true
    };
  }

  private async list(params: ManageProfileParams): Promise<any> {
    const profiles = await this.storage.listProfiles();

    return {
      total: profiles.length,
      profiles: profiles.map(p => ({
        profile_id: p.id,
        name: p.name,
        created_at: p.created_at,
        updated_at: p.updated_at
      }))
    };
  }
}
