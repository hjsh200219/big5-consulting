// Big 5 성격 특성 점수
export interface Big5Scores {
  openness: number; // 개방성 (0-100)
  conscientiousness: number; // 성실성 (0-100)
  extraversion: number; // 외향성 (0-100)
  agreeableness: number; // 친화성 (0-100)
  neuroticism: number; // 신경성 (0-100)
}

// 프로필
export interface Profile {
  id: string;
  name: string;
  scores: Big5Scores;
  metadata?: {
    age?: number;
    occupation?: string;
    industry?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// 질문지 응답
export interface QuestionnaireResponse {
  openness: number[]; // 10개 응답 (1-5)
  conscientiousness: number[];
  extraversion: number[];
  agreeableness: number[];
  neuroticism: number[];
}

// 검사 세션 (랜덤 출제 방식)
export interface SurveySession {
  id: string;
  name: string;
  version: 'short' | 'full'; // 간략(30문항) 또는 전체(60문항)
  answered_count: number; // 답변 완료한 질문 수 (0-30 or 0-60)
  answers: Record<number, number>; // 질문 번호 → 답변 (1-5) 매핑
  current_questions?: number[]; // 현재 화면에 보여준 질문 번호 배열 (중복 방지용)
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 질문 항목
export interface Question {
  number: number;
  text: string;
  reverse_scored: boolean;
}

// Tool 액션 타입
export type SurveyAction = 'start' | 'submit' | 'resume' | 'progress';
export type ProfileAction = 'create' | 'get' | 'update' | 'delete' | 'list';
export type IndividualAnalysisType =
  | 'personality'
  | 'strengths_weaknesses'
  | 'career'
  | 'development'
  | 'learning_style'
  | 'stress_management';
export type TeamAnalysisType =
  | 'composition'
  | 'roles'
  | 'conflicts'
  | 'communication'
  | 'collaboration';
export type RelationshipAnalysisType = 'compatibility' | 'communication_style' | 'dynamics';

// Tool 파라미터 타입
export interface ManageSurveyParams {
  action: SurveyAction;
  name?: string;
  version?: 'short' | 'full'; // 간략(30문항) 또는 전체(60문항), 기본값 'full'
  session_id?: string;
  answers?: number[];
  metadata?: Record<string, any>;
}

export interface ManageProfileParams {
  action: ProfileAction;
  profile_id?: string;
  name?: string;
  scores?: Big5Scores;
  metadata?: Record<string, any>;
}

export interface AnalyzeIndividualParams {
  profile_id: string;
  analysis_type: IndividualAnalysisType;
  options?: {
    depth?: 'basic' | 'standard' | 'comprehensive';
    current_occupation?: string;
    industry_focus?: string[];
  };
}

export interface AnalyzeTeamParams {
  profile_ids: string[];
  analysis_type: TeamAnalysisType;
  options?: Record<string, any>;
}

export interface AnalyzeRelationshipParams {
  profile_id_a: string;
  profile_id_b: string;
  analysis_type: RelationshipAnalysisType;
  options?: Record<string, any>;
}
