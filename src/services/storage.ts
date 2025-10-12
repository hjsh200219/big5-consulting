import * as fs from 'fs/promises';
import * as path from 'path';
import { homedir } from 'os';
import { Profile, SurveySession } from '../types';

/**
 * 파일 시스템 기반 스토리지 매니저
 *
 * Big 5 프로필과 설문 세션을 로컬 파일 시스템에 저장하고 관리합니다.
 * 메모리 캐시를 통해 빠른 조회 성능을 제공합니다.
 *
 * 저장 위치: ~/.big5/
 * - profiles/: 프로필 JSON 파일
 * - surveys/: 설문 세션 JSON 파일
 */
export class StorageManager {
  private profileCache = new Map<string, Profile>();
  private surveyCache = new Map<string, SurveySession>();
  private readonly baseDir: string;
  private readonly profilePath: string;
  private readonly surveyPath: string;

  constructor() {
    this.baseDir = path.join(homedir(), '.big5');
    this.profilePath = path.join(this.baseDir, 'profiles');
    this.surveyPath = path.join(this.baseDir, 'surveys');
  }

  /**
   * 스토리지 초기화
   * 필요한 디렉토리 구조를 생성합니다.
   */
  async initialize(): Promise<void> {
    await fs.mkdir(this.profilePath, { recursive: true });
    await fs.mkdir(this.surveyPath, { recursive: true });
  }

  /**
   * 프로필 저장
   * @param profile 저장할 프로필 객체
   */
  async saveProfile(profile: Profile): Promise<void> {
    const filePath = path.join(this.profilePath, `${profile.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(profile, null, 2));
    this.profileCache.set(profile.id, profile);
  }

  /**
   * 프로필 조회
   * @param id 프로필 ID
   * @returns 프로필 객체 또는 null (존재하지 않을 경우)
   */
  async getProfile(id: string): Promise<Profile | null> {
    // 캐시 확인
    if (this.profileCache.has(id)) {
      return this.profileCache.get(id)!;
    }

    // 파일에서 로드
    try {
      const filePath = path.join(this.profilePath, `${id}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const profile = JSON.parse(data) as Profile;
      this.profileCache.set(id, profile);
      return profile;
    } catch (error) {
      // 파일이 존재하지 않는 경우는 정상 동작
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      // 기타 에러는 로깅
      console.error(`Failed to load profile ${id}:`, error);
      return null;
    }
  }

  /**
   * 프로필 삭제
   * @param id 프로필 ID
   * @returns 성공 여부
   */
  async deleteProfile(id: string): Promise<boolean> {
    try {
      const filePath = path.join(this.profilePath, `${id}.json`);
      await fs.unlink(filePath);
      this.profileCache.delete(id);
      return true;
    } catch (error) {
      // 파일이 이미 없는 경우는 삭제 성공으로 처리
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.profileCache.delete(id);
        return true;
      }
      // 기타 에러 (권한 문제 등)
      console.error(`Failed to delete profile ${id}:`, error);
      return false;
    }
  }

  /**
   * 모든 프로필 목록 조회
   * @returns 모든 프로필 배열
   */
  async listProfiles(): Promise<Profile[]> {
    const files = await fs.readdir(this.profilePath);
    const profiles: Profile[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const id = file.replace('.json', '');
        const profile = await this.getProfile(id);
        if (profile) {
          profiles.push(profile);
        }
      }
    }

    return profiles;
  }

  /**
   * 검사 세션 저장
   * @param session 저장할 세션 객체
   */
  async saveSurveySession(session: SurveySession): Promise<void> {
    const filePath = path.join(this.surveyPath, `${session.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(session, null, 2));
    this.surveyCache.set(session.id, session);
  }

  /**
   * 검사 세션 조회
   * @param id 세션 ID
   * @returns 세션 객체 또는 null (존재하지 않을 경우)
   */
  async getSurveySession(id: string): Promise<SurveySession | null> {
    // 캐시 확인
    if (this.surveyCache.has(id)) {
      return this.surveyCache.get(id)!;
    }

    // 파일에서 로드
    try {
      const filePath = path.join(this.surveyPath, `${id}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const session = JSON.parse(data) as SurveySession;
      this.surveyCache.set(id, session);
      return session;
    } catch (error) {
      // 파일이 존재하지 않는 경우는 정상 동작
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      // 기타 에러는 로깅
      console.error(`Failed to load survey session ${id}:`, error);
      return null;
    }
  }

  /**
   * 검사 세션 삭제
   * @param id 세션 ID
   * @returns 성공 여부
   */
  async deleteSurveySession(id: string): Promise<boolean> {
    try {
      const filePath = path.join(this.surveyPath, `${id}.json`);
      await fs.unlink(filePath);
      this.surveyCache.delete(id);
      return true;
    } catch (error) {
      // 파일이 이미 없는 경우는 삭제 성공으로 처리
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.surveyCache.delete(id);
        return true;
      }
      // 기타 에러 (권한 문제 등)
      console.error(`Failed to delete survey session ${id}:`, error);
      return false;
    }
  }

  /**
   * 모든 검사 세션 목록 조회
   * @returns 모든 세션 배열
   */
  async listSurveySessions(): Promise<SurveySession[]> {
    const files = await fs.readdir(this.surveyPath);
    const sessions: SurveySession[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const id = file.replace('.json', '');
        const session = await this.getSurveySession(id);
        if (session) {
          sessions.push(session);
        }
      }
    }

    return sessions;
  }
}
