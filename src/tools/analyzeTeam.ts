import { AnalyzeTeamParams, Profile, Big5Scores } from '../types';
import { StorageManager } from '../services/storage';

export class TeamAnalyzer {
  constructor(private storage: StorageManager) {}

  async handle(params: AnalyzeTeamParams): Promise<any> {
    const { profile_ids, analysis_type } = params;

    // 모든 프로필 로드
    const profiles: Profile[] = [];
    for (const id of profile_ids) {
      const profile = await this.storage.getProfile(id);
      if (!profile) {
        throw new Error(`Profile not found: ${id}`);
      }
      profiles.push(profile);
    }

    switch (analysis_type) {
      case 'composition':
        return this.analyzeComposition(profiles, params.options);
      case 'roles':
        return this.analyzeRoles(profiles, params.options);
      case 'conflicts':
        return this.analyzeConflicts(profiles, params.options);
      case 'communication':
        return this.analyzeCommunication(profiles, params.options);
      case 'collaboration':
        return this.analyzeCollaboration(profiles, params.options);
      default:
        throw new Error(`Unknown analysis type: ${analysis_type}`);
    }
  }

  private analyzeComposition(profiles: Profile[], options?: any): any {
    const depth = options?.depth || 'standard';

    const teamStats = this.calculateTeamStats(profiles);
    const diversity = this.assessDiversity(profiles);
    const balance = this.assessBalance(teamStats);

    return {
      analysis_type: 'composition',
      depth,
      team_size: profiles.length,
      team_stats: teamStats,
      diversity_score: diversity.score,
      diversity_analysis: diversity.details,
      balance_assessment: balance,
      recommendations: this.generateCompositionRecommendations(teamStats, diversity, balance, depth)
    };
  }

  private analyzeRoles(profiles: Profile[], options?: any): any {
    const depth = options?.depth || 'standard';
    const project_type = options?.project_type;

    const roleAssignments = profiles.map(profile => ({
      profile_id: profile.id,
      name: profile.name,
      recommended_roles: this.recommendRoles(profile.scores, project_type),
      strengths: this.identifyRoleStrengths(profile.scores),
      potential_contributions: this.identifyContributions(profile.scores, project_type)
    }));

    const coverageAnalysis = this.analyzeRoleCoverage(profiles, project_type);

    return {
      analysis_type: 'roles',
      depth,
      project_type,
      role_assignments: roleAssignments,
      coverage: coverageAnalysis,
      gaps: this.identifyRoleGaps(coverageAnalysis),
      recommendations: this.generateRoleRecommendations(roleAssignments, coverageAnalysis, depth)
    };
  }

  private analyzeConflicts(profiles: Profile[], options?: any): any {
    const depth = options?.depth || 'standard';

    const conflictPairs = this.identifyConflictPairs(profiles);
    const conflictRisks = this.assessConflictRisks(profiles);

    return {
      analysis_type: 'conflicts',
      depth,
      overall_risk_level: this.calculateOverallRisk(conflictRisks),
      high_risk_pairs: conflictPairs.filter(p => p.risk_level === 'high'),
      conflict_risks: conflictRisks,
      prevention_strategies: this.generatePreventionStrategies(conflictRisks, depth),
      resolution_guidelines: this.generateResolutionGuidelines(conflictRisks, depth)
    };
  }

  private analyzeCommunication(profiles: Profile[], options?: any): any {
    const depth = options?.depth || 'standard';

    const communicationStyles = profiles.map(profile => ({
      profile_id: profile.id,
      name: profile.name,
      style: this.determineCommunicationStyle(profile.scores),
      preferences: this.identifyCommunicationPreferences(profile.scores),
      potential_challenges: this.identifyCommunicationChallenges(profile.scores)
    }));

    const teamDynamics = this.analyzeTeamCommunicationDynamics(profiles);

    return {
      analysis_type: 'communication',
      depth,
      individual_styles: communicationStyles,
      team_dynamics: teamDynamics,
      compatibility_matrix: this.buildCommunicationCompatibilityMatrix(profiles),
      best_practices: this.generateCommunicationBestPractices(communicationStyles, teamDynamics, depth)
    };
  }

  private analyzeCollaboration(profiles: Profile[], options?: any): any {
    const depth = options?.depth || 'standard';

    const collaborationPotential = this.assessCollaborationPotential(profiles);
    const workStyles = profiles.map(profile => ({
      profile_id: profile.id,
      name: profile.name,
      work_style: this.analyzeWorkStyle(profile.scores),
      collaboration_strengths: this.identifyCollaborationStrengths(profile.scores),
      collaboration_challenges: this.identifyCollaborationChallenges(profile.scores)
    }));

    return {
      analysis_type: 'collaboration',
      depth,
      overall_potential: collaborationPotential.score,
      individual_work_styles: workStyles,
      synergy_opportunities: collaborationPotential.opportunities,
      optimization_strategies: this.generateCollaborationStrategies(workStyles, collaborationPotential, depth)
    };
  }

  // Helper methods
  private calculateTeamStats(profiles: Profile[]): Record<string, any> {
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const;
    const stats: any = {};

    for (const trait of traits) {
      const values = profiles.map(p => p.scores[trait]);
      stats[trait] = {
        mean: this.mean(values),
        std: this.standardDeviation(values),
        min: Math.min(...values),
        max: Math.max(...values)
      };
    }

    return stats;
  }

  private assessDiversity(profiles: Profile[]): { score: number; details: any } {
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const;
    let totalVariance = 0;

    for (const trait of traits) {
      const values = profiles.map(p => p.scores[trait]);
      totalVariance += this.variance(values);
    }

    const diversityScore = Math.min(100, (totalVariance / 5) * 2); // 정규화

    return {
      score: Math.round(diversityScore),
      details: {
        level: diversityScore >= 70 ? 'high' : diversityScore >= 40 ? 'moderate' : 'low',
        interpretation: this.interpretDiversity(diversityScore)
      }
    };
  }

  private assessBalance(teamStats: Record<string, any>): any {
    const balanceScores = Object.entries(teamStats).map(([trait, stats]: [string, any]) => ({
      trait,
      balance_score: 100 - Math.abs(50 - stats.mean),
      is_balanced: stats.std < 20
    }));

    return {
      overall_balance: this.mean(balanceScores.map(b => b.balance_score)),
      trait_balance: balanceScores,
      balanced_traits: balanceScores.filter(b => b.is_balanced).map(b => b.trait),
      imbalanced_traits: balanceScores.filter(b => !b.is_balanced).map(b => b.trait)
    };
  }

  private recommendRoles(scores: Big5Scores, projectType?: string): string[] {
    const roles: string[] = [];

    if (scores.conscientiousness >= 70 && scores.extraversion >= 60) {
      roles.push('팀 리더', '프로젝트 매니저');
    }
    if (scores.openness >= 70 && scores.conscientiousness >= 60) {
      roles.push('전략 기획', '혁신 담당');
    }
    if (scores.conscientiousness >= 70) {
      roles.push('품질 관리', '일정 관리');
    }
    if (scores.extraversion >= 70 && scores.agreeableness >= 60) {
      roles.push('대외 협력', '커뮤니케이션 담당');
    }
    if (scores.agreeableness >= 70) {
      roles.push('팀 조율', '갈등 중재');
    }
    if (scores.openness >= 70) {
      roles.push('아이디어 발굴', '리서치');
    }

    return roles;
  }

  private identifyRoleStrengths(scores: Big5Scores): string[] {
    const strengths: string[] = [];

    if (scores.conscientiousness >= 70) strengths.push('체계적 실행력');
    if (scores.openness >= 70) strengths.push('창의적 사고');
    if (scores.extraversion >= 70) strengths.push('리더십과 동기부여');
    if (scores.agreeableness >= 70) strengths.push('협력과 조율');
    if (scores.neuroticism <= 40) strengths.push('스트레스 상황 대처');

    return strengths;
  }

  private identifyContributions(scores: Big5Scores, projectType?: string): string[] {
    return [
      '프로젝트 성공에 기여할 수 있는 영역',
      '팀 시너지를 높일 수 있는 활동'
    ];
  }

  private analyzeRoleCoverage(profiles: Profile[], projectType?: string): any {
    const essentialRoles = ['리더십', '실행', '창의성', '협력', '품질관리'];
    const coverage: Record<string, number> = {};

    for (const role of essentialRoles) {
      coverage[role] = this.calculateRoleCoverage(profiles, role);
    }

    return coverage;
  }

  private calculateRoleCoverage(profiles: Profile[], role: string): number {
    // 간단한 커버리지 계산
    return Math.min(100, profiles.length * 20);
  }

  private identifyRoleGaps(coverage: any): string[] {
    return Object.entries(coverage)
      .filter(([_, score]) => (score as number) < 60)
      .map(([role, _]) => role);
  }

  private identifyConflictPairs(profiles: Profile[]): any[] {
    const pairs: any[] = [];

    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const riskLevel = this.assessPairConflictRisk(profiles[i], profiles[j]);
        if (riskLevel !== 'low') {
          pairs.push({
            profile_a: { id: profiles[i].id, name: profiles[i].name },
            profile_b: { id: profiles[j].id, name: profiles[j].name },
            risk_level: riskLevel,
            potential_issues: this.identifyPotentialIssues(profiles[i].scores, profiles[j].scores)
          });
        }
      }
    }

    return pairs.sort((a, b) => {
      const order = { high: 3, moderate: 2, low: 1 };
      return order[b.risk_level as keyof typeof order] - order[a.risk_level as keyof typeof order];
    });
  }

  private assessPairConflictRisk(profileA: Profile, profileB: Profile): string {
    const diff = this.calculateScoreDifference(profileA.scores, profileB.scores);
    const avgDiff = this.mean(Object.values(diff));

    if (avgDiff > 50) return 'high';
    if (avgDiff > 30) return 'moderate';
    return 'low';
  }

  private calculateScoreDifference(scoresA: Big5Scores, scoresB: Big5Scores): Record<string, number> {
    return {
      openness: Math.abs(scoresA.openness - scoresB.openness),
      conscientiousness: Math.abs(scoresA.conscientiousness - scoresB.conscientiousness),
      extraversion: Math.abs(scoresA.extraversion - scoresB.extraversion),
      agreeableness: Math.abs(scoresA.agreeableness - scoresB.agreeableness),
      neuroticism: Math.abs(scoresA.neuroticism - scoresB.neuroticism)
    };
  }

  private identifyPotentialIssues(scoresA: Big5Scores, scoresB: Big5Scores): string[] {
    const issues: string[] = [];
    const diff = this.calculateScoreDifference(scoresA, scoresB);

    if (diff.conscientiousness > 40) issues.push('업무 스타일 차이 (체계성 vs 유연성)');
    if (diff.extraversion > 40) issues.push('에너지 수준 차이 (활동적 vs 조용함)');
    if (diff.agreeableness > 40) issues.push('의사결정 스타일 차이 (협력 vs 경쟁)');
    if (diff.openness > 40) issues.push('변화 수용도 차이 (혁신 vs 안정)');

    return issues;
  }

  private assessConflictRisks(profiles: Profile[]): any[] {
    return [
      {
        risk_type: '업무 스타일 충돌',
        probability: 'moderate',
        impact: 'high'
      }
    ];
  }

  private calculateOverallRisk(risks: any[]): string {
    return 'moderate';
  }

  private determineCommunicationStyle(scores: Big5Scores): any {
    return {
      primary_style: scores.extraversion >= 60 ? 'direct_expressive' : 'thoughtful_reserved',
      openness_to_feedback: scores.openness >= 60 ? 'high' : 'moderate',
      conflict_approach: scores.agreeableness >= 60 ? 'collaborative' : 'assertive',
      detail_preference: scores.conscientiousness >= 60 ? 'detailed' : 'high_level'
    };
  }

  private identifyCommunicationPreferences(scores: Big5Scores): any {
    return {
      meeting_style: scores.extraversion >= 60 ? 'group_discussion' : 'one_on_one',
      feedback_style: scores.neuroticism <= 40 ? 'direct' : 'constructive',
      information_sharing: scores.openness >= 60 ? 'proactive' : 'as_needed'
    };
  }

  private identifyCommunicationChallenges(scores: Big5Scores): string[] {
    const challenges: string[] = [];

    if (scores.extraversion <= 40) challenges.push('대규모 회의에서 의견 표현의 어려움');
    if (scores.neuroticism >= 60) challenges.push('비판적 피드백 수용 시 감정적 반응');
    if (scores.agreeableness >= 70) challenges.push('갈등 상황 직접 대면 회피');
    if (scores.conscientiousness <= 40) challenges.push('세부사항 전달 누락');

    return challenges;
  }

  private analyzeTeamCommunicationDynamics(profiles: Profile[]): any {
    const avgExtraversion = this.mean(profiles.map(p => p.scores.extraversion));
    const avgAgreeableness = this.mean(profiles.map(p => p.scores.agreeableness));

    return {
      energy_level: avgExtraversion >= 60 ? 'high' : 'moderate',
      harmony_level: avgAgreeableness >= 60 ? 'high' : 'moderate',
      decision_making_speed: avgExtraversion >= 60 ? 'fast' : 'thoughtful',
      conflict_resolution_style: avgAgreeableness >= 60 ? 'collaborative' : 'competitive'
    };
  }

  private buildCommunicationCompatibilityMatrix(profiles: Profile[]): any[][] {
    const matrix: any[][] = [];

    for (let i = 0; i < profiles.length; i++) {
      const row: any[] = [];
      for (let j = 0; j < profiles.length; j++) {
        if (i === j) {
          row.push({ compatibility: 100, note: 'self' });
        } else {
          row.push(this.calculateCommunicationCompatibility(profiles[i], profiles[j]));
        }
      }
      matrix.push(row);
    }

    return matrix;
  }

  private calculateCommunicationCompatibility(profileA: Profile, profileB: Profile): any {
    const diff = this.calculateScoreDifference(profileA.scores, profileB.scores);
    const avgDiff = this.mean(Object.values(diff));
    const compatibility = 100 - avgDiff;

    return {
      compatibility: Math.round(compatibility),
      level: compatibility >= 70 ? 'high' : compatibility >= 50 ? 'moderate' : 'low'
    };
  }

  private assessCollaborationPotential(profiles: Profile[]): any {
    const avgAgreeableness = this.mean(profiles.map(p => p.scores.agreeableness));
    const avgConscientiousness = this.mean(profiles.map(p => p.scores.conscientiousness));

    const score = (avgAgreeableness + avgConscientiousness) / 2;

    return {
      score: Math.round(score),
      opportunities: this.identifySynergyOpportunities(profiles)
    };
  }

  private identifySynergyOpportunities(profiles: Profile[]): string[] {
    return [
      '상호 보완적 강점 활용',
      '지식 공유 및 멘토링',
      '창의적 문제 해결'
    ];
  }

  private analyzeWorkStyle(scores: Big5Scores): any {
    return {
      pace: scores.conscientiousness >= 60 ? 'steady' : 'flexible',
      structure: scores.conscientiousness >= 60 ? 'high' : 'low',
      autonomy: scores.extraversion <= 40 ? 'high' : 'moderate',
      collaboration: scores.agreeableness >= 60 ? 'high' : 'moderate'
    };
  }

  private identifyCollaborationStrengths(scores: Big5Scores): string[] {
    const strengths: string[] = [];

    if (scores.agreeableness >= 70) strengths.push('팀워크와 협력');
    if (scores.conscientiousness >= 70) strengths.push('신뢰성과 책임감');
    if (scores.openness >= 70) strengths.push('새로운 아이디어 수용');
    if (scores.extraversion >= 70) strengths.push('적극적 참여와 에너지');

    return strengths;
  }

  private identifyCollaborationChallenges(scores: Big5Scores): string[] {
    const challenges: string[] = [];

    if (scores.agreeableness <= 40) challenges.push('직접적 의견 충돌');
    if (scores.conscientiousness <= 40) challenges.push('약속 이행 일관성');
    if (scores.neuroticism >= 60) challenges.push('스트레스 상황 대처');
    if (scores.extraversion <= 40) challenges.push('적극적 참여');

    return challenges;
  }

  // Statistical helper methods
  private mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private variance(values: number[]): number {
    const avg = this.mean(values);
    return values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
  }

  private standardDeviation(values: number[]): number {
    return Math.sqrt(this.variance(values));
  }

  private interpretDiversity(score: number): string {
    if (score >= 70) return '매우 다양한 팀 구성으로 다양한 관점과 접근 방식이 가능합니다.';
    if (score >= 40) return '적절한 다양성으로 균형잡힌 팀 구성입니다.';
    return '유사한 성향의 팀원들로 구성되어 있습니다.';
  }

  private generateCompositionRecommendations(teamStats: any, diversity: any, balance: any, depth: string): string[] {
    const recommendations: string[] = [];

    if (diversity.score < 40) {
      recommendations.push('다양한 관점을 위해 다른 성향의 인원 보강 고려');
    }
    if (balance.overall_balance < 60) {
      recommendations.push('불균형한 특성 보완을 위한 팀 구성 조정');
    }

    return recommendations;
  }

  private generateRoleRecommendations(assignments: any[], coverage: any, depth: string): string[] {
    return ['역할 배분 최적화를 위한 제안'];
  }

  private generatePreventionStrategies(risks: any[], depth: string): string[] {
    return ['갈등 예방을 위한 전략'];
  }

  private generateResolutionGuidelines(risks: any[], depth: string): string[] {
    return ['갈등 해결을 위한 가이드라인'];
  }

  private generateCommunicationBestPractices(styles: any[], dynamics: any, depth: string): string[] {
    return [
      '정기적인 팀 회의 (주간)',
      '다양한 소통 채널 활용',
      '명확한 의사결정 프로세스 수립'
    ];
  }

  private generateCollaborationStrategies(workStyles: any[], potential: any, depth: string): string[] {
    return [
      '상호 강점 활용 전략',
      '페어 프로그래밍/작업',
      '정기적인 지식 공유 세션'
    ];
  }
}
