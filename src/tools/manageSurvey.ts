import { randomUUID } from 'crypto';
import { ManageSurveyParams, SurveySession, Profile } from '../types';
import { StorageManager } from '../services/storage';
import { getRandomQuestions, mapAnswersToTraits, calculateScores } from '../data/questions';

export class SurveyManager {
  constructor(private storage: StorageManager) {}

  async handle(params: ManageSurveyParams): Promise<any> {
    const { action } = params;

    switch (action) {
      case 'start':
        return this.start(params);
      case 'submit':
        return this.submit(params);
      case 'resume':
        return this.resume(params);
      case 'progress':
        return this.progress(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * 새로운 성격 검사 세션 시작
   * @param params 세션 시작 파라미터 (name, version, metadata)
   * @returns 세션 정보 및 첫 5개 질문
   */
  private async start(params: ManageSurveyParams): Promise<any> {
    if (!params.name) {
      throw new Error('name is required for start action');
    }

    const version = params.version || 'full';
    const maxQuestions = version === 'short' ? 30 : 60;
    const isShort = version === 'short';

    const session: SurveySession = {
      id: `survey_${randomUUID()}`,
      name: params.name,
      version,
      answered_count: 0,
      answers: {},
      metadata: params.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await this.storage.saveSurveySession(session);

    const questions = getRandomQuestions(0, isShort);

    return {
      session_id: session.id,
      name: session.name,
      version,
      progress: `0/${maxQuestions}`,
      questions,
      instruction: '각 질문에 대해 1-5로 답변해주세요.\n1 = 전혀 그렇지 않다, 2 = 그렇지 않다, 3 = 보통이다, 4 = 그렇다, 5 = 매우 그렇다\n쉼표로 구분하여 답변하세요 (예: 4,5,3,4,5)'
    };
  }

  /**
   * 질문 답변 제출 및 다음 질문 로드
   * @param params session_id, answers (5개 이하)
   * @returns 진행 상태 및 다음 질문 (또는 완료 시 프로필 정보)
   */
  private async submit(params: ManageSurveyParams): Promise<any> {
    if (!params.session_id || !params.answers) {
      throw new Error('session_id and answers are required for submit action');
    }

    if (params.answers.length < 1 || params.answers.length > 5) {
      throw new Error('Between 1 and 5 answers are required');
    }

    if (params.answers.some(a => a < 1 || a > 5)) {
      throw new Error('All answers must be between 1 and 5');
    }

    const session = await this.storage.getSurveySession(params.session_id);
    if (!session) {
      throw new Error(`Survey session not found: ${params.session_id}`);
    }

    const isShort = session.version === 'short';
    const maxQuestions = isShort ? 30 : 60;

    // 현재 화면의 질문들을 가져와서 질문 번호를 얻음
    const currentQuestions = getRandomQuestions(session.answered_count, isShort);

    // 각 질문 번호와 답변을 매핑하여 저장
    currentQuestions.forEach((question, index) => {
      if (index < params.answers!.length) {
        session.answers[question.number] = params.answers![index];
      }
    });

    // 답변 개수 증가
    session.answered_count += params.answers.length;
    session.updated_at = new Date().toISOString();

    // 모든 문항 완료 확인
    if (session.answered_count >= maxQuestions) {
      // 모든 답변을 특성별로 매핑
      const traitResponses = mapAnswersToTraits(session.answers, isShort);

      // 점수 계산
      const scores = calculateScores(traitResponses);

      // 프로필 생성
      const profile: Profile = {
        id: `prof_${randomUUID()}`,
        name: session.name,
        scores: scores as any,
        metadata: session.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await this.storage.saveProfile(profile);
      await this.storage.deleteSurveySession(session.id);

      return {
        session_id: session.id,
        completed: true,
        version: session.version,
        progress: `${maxQuestions}/${maxQuestions}`,
        profile_id: profile.id,
        scores: profile.scores,
        created_at: profile.created_at
      };
    } else {
      // 아직 완료되지 않음 - 다음 질문 로드
      await this.storage.saveSurveySession(session);

      const nextQuestions = getRandomQuestions(session.answered_count, isShort);

      return {
        session_id: session.id,
        version: session.version,
        progress: `${session.answered_count}/${maxQuestions}`,
        next_questions: nextQuestions
      };
    }
  }

  /**
   * 중단된 세션 재개
   * @param params session_id
   * @returns 현재 진행 상태 및 다음 질문들
   */
  private async resume(params: ManageSurveyParams): Promise<any> {
    if (!params.session_id) {
      throw new Error('session_id is required for resume action');
    }

    const session = await this.storage.getSurveySession(params.session_id);
    if (!session) {
      throw new Error(`Survey session not found: ${params.session_id}`);
    }

    const isShort = session.version === 'short';
    const maxQuestions = isShort ? 30 : 60;

    const questions = getRandomQuestions(session.answered_count, isShort);

    return {
      session_id: session.id,
      name: session.name,
      version: session.version,
      progress: `${session.answered_count}/${maxQuestions}`,
      questions,
      instruction: '각 질문에 대해 1-5로 답변해주세요.\n1 = 전혀 그렇지 않다, 2 = 그렇지 않다, 3 = 보통이다, 4 = 그렇다, 5 = 매우 그렇다\n쉼표로 구분하여 답변하세요 (예: 4,5,3,4,5)'
    };
  }

  /**
   * 세션 진행 상태 조회
   * @param params session_id
   * @returns 답변 진행률 및 메타데이터
   */
  private async progress(params: ManageSurveyParams): Promise<any> {
    if (!params.session_id) {
      throw new Error('session_id is required for progress action');
    }

    const session = await this.storage.getSurveySession(params.session_id);
    if (!session) {
      throw new Error(`Survey session not found: ${params.session_id}`);
    }

    const maxQuestions = session.version === 'short' ? 30 : 60;

    return {
      session_id: session.id,
      name: session.name,
      version: session.version,
      progress: `${session.answered_count}/${maxQuestions}`,
      percentage: Math.round((session.answered_count / maxQuestions) * 100),
      started_at: session.created_at,
      last_updated: session.updated_at
    };
  }
}
