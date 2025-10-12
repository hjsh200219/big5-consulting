import { randomUUID } from 'crypto';
import { ManageSurveyParams, SurveySession, Profile } from '../types';
import { StorageManager } from '../services/storage';
import { getQuestionBatch, calculateScores } from '../data/questions';

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

  private async start(params: ManageSurveyParams): Promise<any> {
    if (!params.name) {
      throw new Error('name is required for start action');
    }

    const session: SurveySession = {
      id: `survey_${randomUUID()}`,
      name: params.name,
      current_trait: 'openness',
      current_batch: 1,
      responses: {},
      completed_traits: [],
      metadata: params.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await this.storage.saveSurveySession(session);

    const questions = getQuestionBatch('openness', 1);

    return {
      session_id: session.id,
      name: session.name,
      current_trait: session.current_trait,
      current_batch: session.current_batch,
      progress: '0/50',
      questions,
      instruction: '1-5로 답변해주세요. 쉼표로 구분 (예: 4,5,3,4,5)'
    };
  }

  private async submit(params: ManageSurveyParams): Promise<any> {
    if (!params.session_id || !params.answers) {
      throw new Error('session_id and answers are required for submit action');
    }

    if (params.answers.length !== 5) {
      throw new Error('Exactly 5 answers are required');
    }

    if (params.answers.some(a => a < 1 || a > 5)) {
      throw new Error('All answers must be between 1 and 5');
    }

    const session = await this.storage.getSurveySession(params.session_id);
    if (!session) {
      throw new Error(`Survey session not found: ${params.session_id}`);
    }

    // 현재 특성의 응답 추가
    const currentTrait = session.current_trait;
    if (!session.responses[currentTrait]) {
      session.responses[currentTrait] = [];
    }
    session.responses[currentTrait]!.push(...params.answers);

    // 진행률 계산
    const totalAnswers = Object.values(session.responses).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0
    );

    // 다음 배치로 이동 또는 다음 특성으로
    if (session.current_batch === 1) {
      session.current_batch = 2;
      await this.storage.saveSurveySession(session);

      const questions = getQuestionBatch(currentTrait, 2);
      return {
        session_id: session.id,
        progress: `${totalAnswers}/50`,
        current_trait: currentTrait,
        current_batch: 2,
        completed_traits: session.completed_traits,
        next_questions: questions
      };
    } else {
      // 특성 완료
      session.completed_traits.push(currentTrait);

      // 점수 계산 (완료된 특성)
      const partialScores = calculateScores(session.responses);

      // 다음 특성 결정
      const traitOrder: Array<'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism'> =
        ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
      const currentIndex = traitOrder.indexOf(currentTrait);

      if (currentIndex >= 4) {
        // 모든 특성 완료 - 프로필 생성
        const allScores = calculateScores(session.responses);
        const profile: Profile = {
          id: `prof_${randomUUID()}`,
          name: session.name,
          scores: allScores as any,
          metadata: session.metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await this.storage.saveProfile(profile);
        await this.storage.deleteSurveySession(session.id);

        return {
          session_id: session.id,
          completed: true,
          progress: '50/50',
          profile_id: profile.id,
          scores: profile.scores,
          created_at: profile.created_at
        };
      } else {
        // 다음 특성으로
        const nextTrait = traitOrder[currentIndex + 1];
        session.current_trait = nextTrait;
        session.current_batch = 1;
        await this.storage.saveSurveySession(session);

        const questions = getQuestionBatch(nextTrait, 1);
        return {
          session_id: session.id,
          progress: `${totalAnswers}/50`,
          current_trait: nextTrait,
          current_batch: 1,
          completed_traits: session.completed_traits,
          trait_scores: partialScores,
          next_questions: questions
        };
      }
    }
  }

  private async resume(params: ManageSurveyParams): Promise<any> {
    if (!params.session_id) {
      throw new Error('session_id is required for resume action');
    }

    const session = await this.storage.getSurveySession(params.session_id);
    if (!session) {
      throw new Error(`Survey session not found: ${params.session_id}`);
    }

    const totalAnswers = Object.values(session.responses).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0
    );

    const questions = getQuestionBatch(session.current_trait, session.current_batch);

    return {
      session_id: session.id,
      name: session.name,
      current_trait: session.current_trait,
      current_batch: session.current_batch,
      progress: `${totalAnswers}/50`,
      completed_traits: session.completed_traits,
      questions
    };
  }

  private async progress(params: ManageSurveyParams): Promise<any> {
    if (!params.session_id) {
      throw new Error('session_id is required for progress action');
    }

    const session = await this.storage.getSurveySession(params.session_id);
    if (!session) {
      throw new Error(`Survey session not found: ${params.session_id}`);
    }

    const totalAnswers = Object.values(session.responses).reduce(
      (sum, arr) => sum + (arr?.length || 0),
      0
    );

    const allTraits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const remainingTraits = allTraits.filter(t => !session.completed_traits.includes(t));

    return {
      session_id: session.id,
      name: session.name,
      progress: `${totalAnswers}/50`,
      completed_traits: session.completed_traits,
      remaining_traits: remainingTraits,
      started_at: session.created_at,
      last_updated: session.updated_at
    };
  }
}
