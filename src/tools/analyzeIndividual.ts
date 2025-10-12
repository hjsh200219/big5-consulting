import { AnalyzeIndividualParams, Profile, Big5Scores } from '../types';
import { StorageManager } from '../services/storage';

export class IndividualAnalyzer {
  constructor(private storage: StorageManager) {}

  async handle(params: AnalyzeIndividualParams): Promise<any> {
    const { profile_id, analysis_type } = params;

    const profile = await this.storage.getProfile(profile_id);
    if (!profile) {
      throw new Error(`Profile not found: ${profile_id}`);
    }

    switch (analysis_type) {
      case 'personality':
        return this.analyzePersonality(profile, params.options);
      case 'strengths_weaknesses':
        return this.analyzeStrengthsWeaknesses(profile, params.options);
      case 'career':
        return this.analyzeCareer(profile, params.options);
      case 'development':
        return this.analyzeDevelopment(profile, params.options);
      case 'learning_style':
        return this.analyzeLearningStyle(profile, params.options);
      case 'stress_management':
        return this.analyzeStressManagement(profile, params.options);
      default:
        throw new Error(`Unknown analysis type: ${analysis_type}`);
    }
  }

  private analyzePersonality(profile: Profile, options?: any): any {
    const { scores } = profile;
    const depth = options?.depth || 'standard';

    const traits = this.getTraitDescriptions(scores);

    return {
      profile_id: profile.id,
      name: profile.name,
      analysis_type: 'personality',
      depth,
      traits,
      summary: this.generatePersonalitySummary(scores, depth)
    };
  }

  private analyzeStrengthsWeaknesses(profile: Profile, options?: any): any {
    const { scores } = profile;
    const depth = options?.depth || 'standard';

    const strengths = this.identifyStrengths(scores);
    const weaknesses = this.identifyWeaknesses(scores);

    return {
      profile_id: profile.id,
      name: profile.name,
      analysis_type: 'strengths_weaknesses',
      depth,
      strengths,
      weaknesses,
      recommendations: this.generateImprovementRecommendations(weaknesses, depth)
    };
  }

  private analyzeCareer(profile: Profile, options?: any): any {
    const { scores } = profile;
    const depth = options?.depth || 'standard';
    const current_occupation = options?.current_occupation;
    const industry_focus = options?.industry_focus || [];

    const suitable_roles = this.matchCareerRoles(scores, industry_focus);
    const work_style = this.analyzeWorkStyle(scores);

    return {
      profile_id: profile.id,
      name: profile.name,
      analysis_type: 'career',
      depth,
      current_occupation,
      suitable_roles,
      work_style,
      career_development_advice: this.generateCareerAdvice(scores, current_occupation, depth)
    };
  }

  private analyzeDevelopment(profile: Profile, options?: any): any {
    const { scores } = profile;
    const depth = options?.depth || 'standard';

    const development_areas = this.identifyDevelopmentAreas(scores);

    return {
      profile_id: profile.id,
      name: profile.name,
      analysis_type: 'development',
      depth,
      development_areas,
      action_plan: this.createDevelopmentPlan(development_areas, depth)
    };
  }

  private analyzeLearningStyle(profile: Profile, options?: any): any {
    const { scores } = profile;
    const depth = options?.depth || 'standard';

    const learning_preferences = this.determineLearningStyle(scores);

    return {
      profile_id: profile.id,
      name: profile.name,
      analysis_type: 'learning_style',
      depth,
      learning_preferences,
      recommended_methods: this.recommendLearningMethods(scores, depth)
    };
  }

  private analyzeStressManagement(profile: Profile, options?: any): any {
    const { scores } = profile;
    const depth = options?.depth || 'standard';

    const stress_profile = this.assessStressVulnerability(scores);

    return {
      profile_id: profile.id,
      name: profile.name,
      analysis_type: 'stress_management',
      depth,
      stress_profile,
      coping_strategies: this.recommendCopingStrategies(scores, depth)
    };
  }

  // Helper methods
  private getTraitDescriptions(scores: Big5Scores): any {
    return {
      openness: {
        score: scores.openness,
        level: this.getLevel(scores.openness),
        description: this.getTraitDescription('openness', scores.openness)
      },
      conscientiousness: {
        score: scores.conscientiousness,
        level: this.getLevel(scores.conscientiousness),
        description: this.getTraitDescription('conscientiousness', scores.conscientiousness)
      },
      extraversion: {
        score: scores.extraversion,
        level: this.getLevel(scores.extraversion),
        description: this.getTraitDescription('extraversion', scores.extraversion)
      },
      agreeableness: {
        score: scores.agreeableness,
        level: this.getLevel(scores.agreeableness),
        description: this.getTraitDescription('agreeableness', scores.agreeableness)
      },
      neuroticism: {
        score: scores.neuroticism,
        level: this.getLevel(scores.neuroticism),
        description: this.getTraitDescription('neuroticism', scores.neuroticism)
      }
    };
  }

  private getLevel(score: number): string {
    if (score >= 70) return 'high';
    if (score >= 40) return 'moderate';
    return 'low';
  }

  private getTraitDescription(trait: string, score: number): string {
    const level = this.getLevel(score);

    const descriptions: Record<string, Record<string, string>> = {
      openness: {
        high: '새로운 경험과 아이디어에 매우 개방적이며 창의적입니다.',
        moderate: '적절히 개방적이며 새로운 것과 익숙한 것의 균형을 유지합니다.',
        low: '전통적이고 실용적인 접근을 선호합니다.'
      },
      conscientiousness: {
        high: '매우 체계적이고 책임감이 강하며 목표 지향적입니다.',
        moderate: '적절히 계획적이며 융통성도 가지고 있습니다.',
        low: '유연하고 즉흥적이며 자유로운 스타일을 선호합니다.'
      },
      extraversion: {
        high: '사교적이고 활동적이며 에너지가 넘칩니다.',
        moderate: '상황에 따라 외향적이거나 내향적일 수 있습니다.',
        low: '조용하고 내향적이며 혼자만의 시간을 중요시합니다.'
      },
      agreeableness: {
        high: '협력적이고 공감 능력이 뛰어나며 타인을 배려합니다.',
        moderate: '친절하면서도 자신의 의견을 적절히 주장합니다.',
        low: '경쟁적이고 독립적이며 직설적입니다.'
      },
      neuroticism: {
        high: '감정 기복이 있고 스트레스에 민감할 수 있습니다.',
        moderate: '대체로 안정적이나 스트레스 상황에서 영향을 받을 수 있습니다.',
        low: '정서적으로 매우 안정적이고 침착합니다.'
      }
    };

    return descriptions[trait]?.[level] || '분석 중';
  }

  private generatePersonalitySummary(scores: Big5Scores, depth: string): string {
    return `${depth} 수준의 성격 분석 결과입니다. 전체적인 성격 특성을 종합하여 설명합니다.`;
  }

  private identifyStrengths(scores: Big5Scores): string[] {
    const strengths: string[] = [];

    if (scores.openness >= 60) strengths.push('창의성과 적응력');
    if (scores.conscientiousness >= 60) strengths.push('책임감과 계획성');
    if (scores.extraversion >= 60) strengths.push('사교성과 리더십');
    if (scores.agreeableness >= 60) strengths.push('협력과 공감 능력');
    if (scores.neuroticism <= 40) strengths.push('정서적 안정성');

    return strengths;
  }

  private identifyWeaknesses(scores: Big5Scores): string[] {
    const weaknesses: string[] = [];

    if (scores.openness <= 40) weaknesses.push('변화 수용 능력');
    if (scores.conscientiousness <= 40) weaknesses.push('체계성과 일관성');
    if (scores.extraversion <= 40) weaknesses.push('사회적 활동성');
    if (scores.agreeableness <= 40) weaknesses.push('타인과의 협력');
    if (scores.neuroticism >= 60) weaknesses.push('스트레스 관리');

    return weaknesses;
  }

  private generateImprovementRecommendations(weaknesses: string[], depth: string): string[] {
    return weaknesses.map(w => `${w} 개선을 위한 구체적 방안`);
  }

  private matchCareerRoles(scores: Big5Scores, industries: string[]): string[] {
    const roles: string[] = [];

    if (scores.openness >= 60 && scores.conscientiousness >= 60) {
      roles.push('연구원', '기획자', '컨설턴트');
    }
    if (scores.extraversion >= 60 && scores.agreeableness >= 60) {
      roles.push('영업', '마케팅', '고객 서비스');
    }
    if (scores.conscientiousness >= 70) {
      roles.push('프로젝트 매니저', '회계사', '엔지니어');
    }

    return roles;
  }

  private analyzeWorkStyle(scores: Big5Scores): any {
    return {
      collaboration: scores.agreeableness >= 60 ? 'high' : 'moderate',
      independence: scores.extraversion <= 40 ? 'high' : 'moderate',
      structure: scores.conscientiousness >= 60 ? 'high' : 'flexible',
      innovation: scores.openness >= 60 ? 'high' : 'moderate'
    };
  }

  private generateCareerAdvice(scores: Big5Scores, current?: string, depth?: string): string[] {
    return ['커리어 개발을 위한 맞춤형 조언'];
  }

  private identifyDevelopmentAreas(scores: Big5Scores): any[] {
    return [
      { area: '개발 영역', priority: 'high', rationale: '근거' }
    ];
  }

  private createDevelopmentPlan(areas: any[], depth: string): any {
    return {
      short_term: ['단기 목표'],
      long_term: ['장기 목표'],
      resources: ['추천 리소스']
    };
  }

  private determineLearningStyle(scores: Big5Scores): any {
    return {
      preferred_mode: scores.extraversion >= 60 ? 'collaborative' : 'independent',
      pace: scores.conscientiousness >= 60 ? 'structured' : 'flexible',
      exploration: scores.openness >= 60 ? 'high' : 'moderate'
    };
  }

  private recommendLearningMethods(scores: Big5Scores, depth: string): string[] {
    const methods: string[] = [];

    if (scores.openness >= 60) methods.push('프로젝트 기반 학습', '탐구 학습');
    if (scores.conscientiousness >= 60) methods.push('체계적 커리큘럼', '목표 기반 학습');
    if (scores.extraversion >= 60) methods.push('그룹 스터디', '워크숍');
    else methods.push('독학', '온라인 강의');

    return methods;
  }

  private assessStressVulnerability(scores: Big5Scores): any {
    return {
      vulnerability_level: scores.neuroticism >= 60 ? 'high' : scores.neuroticism >= 40 ? 'moderate' : 'low',
      triggers: this.identifyStressTriggers(scores),
      resilience_factors: this.identifyResilienceFactors(scores)
    };
  }

  private identifyStressTriggers(scores: Big5Scores): string[] {
    const triggers: string[] = [];

    if (scores.neuroticism >= 60) triggers.push('불확실성', '비판');
    if (scores.conscientiousness >= 70) triggers.push('무질서', '마감 압박');
    if (scores.extraversion <= 40) triggers.push('과도한 사회적 요구');

    return triggers;
  }

  private identifyResilienceFactors(scores: Big5Scores): string[] {
    const factors: string[] = [];

    if (scores.conscientiousness >= 60) factors.push('체계적 문제 해결');
    if (scores.agreeableness >= 60) factors.push('사회적 지지 활용');
    if (scores.openness >= 60) factors.push('적응적 사고');

    return factors;
  }

  private recommendCopingStrategies(scores: Big5Scores, depth: string): string[] {
    const strategies: string[] = [];

    if (scores.neuroticism >= 60) {
      strategies.push('마음챙김 명상', '인지 재구성', '규칙적인 운동');
    }
    if (scores.extraversion >= 60) {
      strategies.push('사회적 지지 활용');
    } else {
      strategies.push('혼자만의 재충전 시간');
    }

    return strategies;
  }
}
