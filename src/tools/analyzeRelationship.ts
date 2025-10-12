import { AnalyzeRelationshipParams, Profile, Big5Scores } from '../types';
import { StorageManager } from '../services/storage';

export class RelationshipAnalyzer {
  constructor(private storage: StorageManager) {}

  async handle(params: AnalyzeRelationshipParams): Promise<any> {
    const { profile_id_a, profile_id_b, analysis_type } = params;

    const profileA = await this.storage.getProfile(profile_id_a);
    const profileB = await this.storage.getProfile(profile_id_b);

    if (!profileA) throw new Error(`Profile not found: ${profile_id_a}`);
    if (!profileB) throw new Error(`Profile not found: ${profile_id_b}`);

    switch (analysis_type) {
      case 'compatibility':
        return this.analyzeCompatibility(profileA, profileB, params.options);
      case 'communication_style':
        return this.analyzeCommunicationStyle(profileA, profileB, params.options);
      case 'dynamics':
        return this.analyzeDynamics(profileA, profileB, params.options);
      default:
        throw new Error(`Unknown analysis type: ${analysis_type}`);
    }
  }

  private analyzeCompatibility(profileA: Profile, profileB: Profile, options?: any): any {
    const depth = options?.depth || 'standard';
    const context = options?.context; // 'work', 'personal', 'romantic'

    const compatibilityScore = this.calculateCompatibilityScore(profileA.scores, profileB.scores, context);
    const scoreDifferences = this.calculateScoreDifferences(profileA.scores, profileB.scores);
    const strengths = this.identifyRelationshipStrengths(profileA.scores, profileB.scores, context);
    const challenges = this.identifyRelationshipChallenges(profileA.scores, profileB.scores, context);

    return {
      analysis_type: 'compatibility',
      depth,
      context,
      profile_a: { id: profileA.id, name: profileA.name },
      profile_b: { id: profileB.id, name: profileB.name },
      compatibility_score: compatibilityScore.overall,
      compatibility_level: this.getCompatibilityLevel(compatibilityScore.overall),
      dimension_scores: compatibilityScore.dimensions,
      score_differences: scoreDifferences,
      strengths,
      challenges,
      recommendations: this.generateCompatibilityRecommendations(
        profileA.scores,
        profileB.scores,
        strengths,
        challenges,
        context,
        depth
      )
    };
  }

  private analyzeCommunicationStyle(profileA: Profile, profileB: Profile, options?: any): any {
    const depth = options?.depth || 'standard';

    const styleA = this.determineCommunicationStyle(profileA.scores);
    const styleB = this.determineCommunicationStyle(profileB.scores);
    const compatibility = this.assessCommunicationCompatibility(profileA.scores, profileB.scores);
    const potentialMisunderstandings = this.identifyPotentialMisunderstandings(styleA, styleB);

    return {
      analysis_type: 'communication_style',
      depth,
      profile_a: {
        id: profileA.id,
        name: profileA.name,
        style: styleA,
        preferences: this.getCommunicationPreferences(profileA.scores)
      },
      profile_b: {
        id: profileB.id,
        name: profileB.name,
        style: styleB,
        preferences: this.getCommunicationPreferences(profileB.scores)
      },
      compatibility,
      potential_misunderstandings: potentialMisunderstandings,
      communication_tips: this.generateCommunicationTips(styleA, styleB, compatibility, depth),
      conflict_resolution_approach: this.recommendConflictResolutionApproach(profileA.scores, profileB.scores)
    };
  }

  private analyzeDynamics(profileA: Profile, profileB: Profile, options?: any): any {
    const depth = options?.depth || 'standard';
    const relationship_type = options?.relationship_type; // 'manager_employee', 'peer', 'mentor_mentee'

    const powerDynamics = this.analyzePowerDynamics(profileA.scores, profileB.scores, relationship_type);
    const influencePatterns = this.analyzeInfluencePatterns(profileA.scores, profileB.scores);
    const decisionMaking = this.analyzeDecisionMakingDynamics(profileA.scores, profileB.scores);
    const emotionalDynamics = this.analyzeEmotionalDynamics(profileA.scores, profileB.scores);

    return {
      analysis_type: 'dynamics',
      depth,
      relationship_type,
      profile_a: { id: profileA.id, name: profileA.name },
      profile_b: { id: profileB.id, name: profileB.name },
      power_dynamics: powerDynamics,
      influence_patterns: influencePatterns,
      decision_making: decisionMaking,
      emotional_dynamics: emotionalDynamics,
      synergy_potential: this.assessSynergyPotential(profileA.scores, profileB.scores),
      development_opportunities: this.identifyDevelopmentOpportunities(
        profileA.scores,
        profileB.scores,
        relationship_type,
        depth
      )
    };
  }

  // Compatibility Analysis Helper Methods
  private calculateCompatibilityScore(
    scoresA: Big5Scores,
    scoresB: Big5Scores,
    context?: string
  ): { overall: number; dimensions: Record<string, number> } {
    const weights = this.getContextWeights(context);

    const dimensions: Record<string, number> = {
      openness: this.calculateDimensionCompatibility(scoresA.openness, scoresB.openness, weights.openness),
      conscientiousness: this.calculateDimensionCompatibility(
        scoresA.conscientiousness,
        scoresB.conscientiousness,
        weights.conscientiousness
      ),
      extraversion: this.calculateDimensionCompatibility(scoresA.extraversion, scoresB.extraversion, weights.extraversion),
      agreeableness: this.calculateDimensionCompatibility(
        scoresA.agreeableness,
        scoresB.agreeableness,
        weights.agreeableness
      ),
      neuroticism: this.calculateDimensionCompatibility(scoresA.neuroticism, scoresB.neuroticism, weights.neuroticism)
    };

    const overall = Object.entries(dimensions).reduce((sum, [trait, score]) => {
      return sum + score * weights[trait as keyof Big5Scores];
    }, 0);

    return {
      overall: Math.round(overall),
      dimensions: Object.fromEntries(Object.entries(dimensions).map(([k, v]) => [k, Math.round(v)]))
    };
  }

  private getContextWeights(context?: string): Big5Scores {
    const weights: Record<string, Big5Scores> = {
      work: {
        openness: 0.15,
        conscientiousness: 0.30,
        extraversion: 0.15,
        agreeableness: 0.25,
        neuroticism: 0.15
      },
      personal: {
        openness: 0.20,
        conscientiousness: 0.15,
        extraversion: 0.20,
        agreeableness: 0.30,
        neuroticism: 0.15
      },
      romantic: {
        openness: 0.20,
        conscientiousness: 0.15,
        extraversion: 0.15,
        agreeableness: 0.25,
        neuroticism: 0.25
      }
    };

    return weights[context || 'work'];
  }

  private calculateDimensionCompatibility(scoreA: number, scoreB: number, weight: number): number {
    const difference = Math.abs(scoreA - scoreB);

    // 유사성 점수 (0-100)
    const similarity = 100 - difference;

    // 보완성 점수: 일부 특성은 차이가 있을 때 더 좋음
    const complementarity = difference > 30 ? 60 + (difference - 30) * 0.5 : similarity;

    // 가중 평균
    return (similarity * 0.6 + complementarity * 0.4) * weight * 10;
  }

  private calculateScoreDifferences(scoresA: Big5Scores, scoresB: Big5Scores): Record<string, any> {
    const traits: (keyof Big5Scores)[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const differences: Record<string, any> = {};

    for (const trait of traits) {
      const diff = scoresA[trait] - scoresB[trait];
      differences[trait] = {
        difference: Math.abs(diff),
        direction: diff > 0 ? 'A > B' : diff < 0 ? 'B > A' : 'equal',
        significance: Math.abs(diff) > 30 ? 'high' : Math.abs(diff) > 15 ? 'moderate' : 'low'
      };
    }

    return differences;
  }

  private identifyRelationshipStrengths(scoresA: Big5Scores, scoresB: Big5Scores, context?: string): string[] {
    const strengths: string[] = [];

    // 높은 친화성 - 협력과 이해
    if (scoresA.agreeableness >= 60 && scoresB.agreeableness >= 60) {
      strengths.push('상호 이해와 배려가 높은 관계');
    }

    // 유사한 개방성 - 공통 관심사
    if (Math.abs(scoresA.openness - scoresB.openness) < 20) {
      strengths.push('비슷한 가치관과 관심사 공유');
    }

    // 보완적 성실성
    if (Math.abs(scoresA.conscientiousness - scoresB.conscientiousness) > 30) {
      strengths.push('체계성과 유연성의 균형');
    }

    // 낮은 신경증 - 안정적 관계
    if (scoresA.neuroticism < 40 && scoresB.neuroticism < 40) {
      strengths.push('정서적으로 안정적이고 예측 가능한 관계');
    }

    return strengths;
  }

  private identifyRelationshipChallenges(scoresA: Big5Scores, scoresB: Big5Scores, context?: string): string[] {
    const challenges: string[] = [];

    // 외향성 차이 - 에너지 수준
    if (Math.abs(scoresA.extraversion - scoresB.extraversion) > 40) {
      challenges.push('활동 수준과 사회적 욕구의 차이');
    }

    // 성실성 차이 - 생활 방식
    if (Math.abs(scoresA.conscientiousness - scoresB.conscientiousness) > 40) {
      challenges.push('계획성과 즉흥성의 충돌 가능성');
    }

    // 높은 신경증 - 정서적 부담
    if (scoresA.neuroticism >= 60 || scoresB.neuroticism >= 60) {
      challenges.push('스트레스와 감정 관리의 어려움');
    }

    // 낮은 친화성 - 갈등 가능성
    if (scoresA.agreeableness < 40 || scoresB.agreeableness < 40) {
      challenges.push('의견 충돌 시 해결의 어려움');
    }

    return challenges;
  }

  private getCompatibilityLevel(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'moderate';
    if (score >= 35) return 'challenging';
    return 'difficult';
  }

  // Communication Style Analysis Helper Methods
  private determineCommunicationStyle(scores: Big5Scores): any {
    return {
      directness: scores.extraversion >= 60 ? 'direct' : 'indirect',
      expressiveness: scores.extraversion >= 60 ? 'expressive' : 'reserved',
      conflict_approach: scores.agreeableness >= 60 ? 'harmonizing' : 'confrontational',
      detail_level: scores.conscientiousness >= 60 ? 'detailed' : 'overview',
      feedback_sensitivity: scores.neuroticism >= 60 ? 'high' : 'low'
    };
  }

  private getCommunicationPreferences(scores: Big5Scores): any {
    return {
      preferred_channels: scores.extraversion >= 60 ? ['verbal', 'video'] : ['written', 'email'],
      meeting_preference: scores.extraversion >= 60 ? 'group' : 'one_on_one',
      response_time: scores.conscientiousness >= 60 ? 'prompt' : 'flexible',
      feedback_style: scores.agreeableness >= 60 ? 'gentle' : 'direct'
    };
  }

  private assessCommunicationCompatibility(scoresA: Big5Scores, scoresB: Big5Scores): any {
    const extraversionDiff = Math.abs(scoresA.extraversion - scoresB.extraversion);
    const agreeablenessDiff = Math.abs(scoresA.agreeableness - scoresB.agreeableness);

    const score = 100 - ((extraversionDiff + agreeablenessDiff) / 2);

    return {
      score: Math.round(score),
      level: score >= 70 ? 'high' : score >= 50 ? 'moderate' : 'low',
      ease_of_communication: score >= 70 ? 'natural' : score >= 50 ? 'manageable' : 'requires_effort'
    };
  }

  private identifyPotentialMisunderstandings(styleA: any, styleB: any): string[] {
    const misunderstandings: string[] = [];

    if (styleA.directness !== styleB.directness) {
      misunderstandings.push('의사소통 방식 차이 (직접적 vs 간접적)');
    }

    if (styleA.detail_level !== styleB.detail_level) {
      misunderstandings.push('정보 전달 수준 차이 (상세 vs 개요)');
    }

    if (styleA.conflict_approach !== styleB.conflict_approach) {
      misunderstandings.push('갈등 대응 방식 차이 (조화 vs 직면)');
    }

    return misunderstandings;
  }

  // Dynamics Analysis Helper Methods
  private analyzePowerDynamics(scoresA: Big5Scores, scoresB: Big5Scores, relationshipType?: string): any {
    const dominanceA = (scoresA.extraversion + (100 - scoresA.agreeableness)) / 2;
    const dominanceB = (scoresB.extraversion + (100 - scoresB.agreeableness)) / 2;

    return {
      balance: Math.abs(dominanceA - dominanceB) < 20 ? 'balanced' : 'imbalanced',
      dominance_levels: {
        profile_a: dominanceA >= 60 ? 'high' : 'moderate',
        profile_b: dominanceB >= 60 ? 'high' : 'moderate'
      },
      leadership_tendency: {
        profile_a: scoresA.extraversion >= 60 && scoresA.conscientiousness >= 60 ? 'strong' : 'moderate',
        profile_b: scoresB.extraversion >= 60 && scoresB.conscientiousness >= 60 ? 'strong' : 'moderate'
      }
    };
  }

  private analyzeInfluencePatterns(scoresA: Big5Scores, scoresB: Big5Scores): any {
    return {
      profile_a: {
        influence_style: scoresA.agreeableness >= 60 ? 'persuasive' : 'assertive',
        influence_strength: scoresA.extraversion >= 60 ? 'strong' : 'moderate'
      },
      profile_b: {
        influence_style: scoresB.agreeableness >= 60 ? 'persuasive' : 'assertive',
        influence_strength: scoresB.extraversion >= 60 ? 'strong' : 'moderate'
      },
      mutual_influence: Math.abs(scoresA.agreeableness - scoresB.agreeableness) < 30 ? 'reciprocal' : 'one_sided'
    };
  }

  private analyzeDecisionMakingDynamics(scoresA: Big5Scores, scoresB: Big5Scores): any {
    return {
      profile_a: {
        speed: scoresA.conscientiousness >= 60 ? 'deliberate' : 'quick',
        risk_tolerance: scoresA.openness >= 60 ? 'high' : 'moderate',
        consultation: scoresA.agreeableness >= 60 ? 'inclusive' : 'independent'
      },
      profile_b: {
        speed: scoresB.conscientiousness >= 60 ? 'deliberate' : 'quick',
        risk_tolerance: scoresB.openness >= 60 ? 'high' : 'moderate',
        consultation: scoresB.agreeableness >= 60 ? 'inclusive' : 'independent'
      },
      compatibility: this.assessDecisionMakingCompatibility(scoresA, scoresB)
    };
  }

  private assessDecisionMakingCompatibility(scoresA: Big5Scores, scoresB: Big5Scores): string {
    const conscientiousnessDiff = Math.abs(scoresA.conscientiousness - scoresB.conscientiousness);
    const opennessDiff = Math.abs(scoresA.openness - scoresB.openness);

    const avgDiff = (conscientiousnessDiff + opennessDiff) / 2;

    if (avgDiff < 20) return 'highly_compatible';
    if (avgDiff < 40) return 'moderately_compatible';
    return 'requires_alignment';
  }

  private analyzeEmotionalDynamics(scoresA: Big5Scores, scoresB: Big5Scores): any {
    return {
      emotional_stability: {
        profile_a: scoresA.neuroticism <= 40 ? 'stable' : 'sensitive',
        profile_b: scoresB.neuroticism <= 40 ? 'stable' : 'sensitive'
      },
      emotional_support: {
        profile_a_provides: scoresA.agreeableness >= 60 ? 'high' : 'moderate',
        profile_b_provides: scoresB.agreeableness >= 60 ? 'high' : 'moderate'
      },
      stress_response: {
        profile_a: scoresA.neuroticism >= 60 ? 'reactive' : 'calm',
        profile_b: scoresB.neuroticism >= 60 ? 'reactive' : 'calm'
      },
      mutual_regulation: (scoresA.neuroticism < 40 || scoresB.neuroticism < 40) ? 'possible' : 'challenging'
    };
  }

  private assessSynergyPotential(scoresA: Big5Scores, scoresB: Big5Scores): any {
    const complementarity = this.calculateComplementarity(scoresA, scoresB);
    const collaboration = (scoresA.agreeableness + scoresB.agreeableness) / 2;

    const score = (complementarity * 0.4 + collaboration * 0.6);

    return {
      score: Math.round(score),
      level: score >= 70 ? 'high' : score >= 50 ? 'moderate' : 'low',
      key_areas: this.identifySynergyAreas(scoresA, scoresB)
    };
  }

  private calculateComplementarity(scoresA: Big5Scores, scoresB: Big5Scores): number {
    // 일부 차이가 긍정적 (보완적)
    const opennessDiff = Math.abs(scoresA.openness - scoresB.openness);
    const conscientiousnessDiff = Math.abs(scoresA.conscientiousness - scoresB.conscientiousness);

    const idealDiff = 30; // 이상적 차이
    const opennessComp = 100 - Math.abs(opennessDiff - idealDiff);
    const conscientiousnessComp = 100 - Math.abs(conscientiousnessDiff - idealDiff);

    return (opennessComp + conscientiousnessComp) / 2;
  }

  private identifySynergyAreas(scoresA: Big5Scores, scoresB: Big5Scores): string[] {
    const areas: string[] = [];

    if (Math.abs(scoresA.openness - scoresB.openness) > 30) {
      areas.push('혁신과 안정의 균형');
    }

    if (scoresA.conscientiousness >= 60 || scoresB.conscientiousness >= 60) {
      areas.push('체계적 실행력');
    }

    if (scoresA.agreeableness >= 60 && scoresB.agreeableness >= 60) {
      areas.push('협력과 팀워크');
    }

    return areas;
  }

  private identifyDevelopmentOpportunities(
    scoresA: Big5Scores,
    scoresB: Big5Scores,
    relationshipType?: string,
    depth?: string
  ): string[] {
    return [
      '상호 학습을 통한 성장',
      '보완적 강점 활용',
      '의사소통 스킬 향상'
    ];
  }

  // Recommendation Generation
  private generateCompatibilityRecommendations(
    scoresA: Big5Scores,
    scoresB: Big5Scores,
    strengths: string[],
    challenges: string[],
    context?: string,
    depth?: string
  ): string[] {
    const recommendations: string[] = [];

    // 정기적 소통
    recommendations.push('정기적인 1:1 대화로 이해도 높이기');

    // 차이 존중
    if (challenges.length > 0) {
      recommendations.push('서로의 차이를 존중하고 보완적으로 활용하기');
    }

    // 역할 분담
    if (Math.abs(scoresA.conscientiousness - scoresB.conscientiousness) > 30) {
      recommendations.push('명확한 역할 분담으로 강점 활용하기');
    }

    return recommendations;
  }

  private generateCommunicationTips(styleA: any, styleB: any, compatibility: any, depth?: string): string[] {
    const tips: string[] = [];

    if (styleA.directness !== styleB.directness) {
      tips.push('의사소통 방식 차이를 인정하고 중간 지점 찾기');
    }

    if (compatibility.level === 'low') {
      tips.push('의도를 명확히 하고 확인하는 습관 기르기');
    }

    tips.push('정기적인 피드백으로 오해 최소화하기');

    return tips;
  }

  private recommendConflictResolutionApproach(scoresA: Big5Scores, scoresB: Big5Scores): any {
    const avgAgreeableness = (scoresA.agreeableness + scoresB.agreeableness) / 2;
    const avgNeuroticism = (scoresA.neuroticism + scoresB.neuroticism) / 2;

    return {
      recommended_approach: avgAgreeableness >= 60 ? 'collaborative' : 'structured',
      timing: avgNeuroticism >= 60 ? 'allow_cooling_period' : 'address_promptly',
      facilitator_needed: avgAgreeableness < 50 || avgNeuroticism >= 60,
      guidelines: [
        '감정이 아닌 사실에 집중하기',
        '비난보다는 해결책 찾기',
        '상대방의 관점 이해하려 노력하기'
      ]
    };
  }
}
