import { Tool } from '@modelcontextprotocol/sdk/types.js';

// 스키마 정의를 함수로 lazy load
export function getToolSchemas(): Tool[] {
  return [
    {
      name: 'manage_survey',
      description: 'Big 5 성격검사 세션 관리 (start, submit, resume, progress)',
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['start', 'submit', 'resume', 'progress'],
            description: '수행할 액션'
          },
          name: {
            type: 'string',
            description: '검사 대상자 이름 (start 시 필수)'
          },
          session_id: {
            type: 'string',
            description: '세션 ID (submit, resume, progress 시 필수)'
          },
          answers: {
            type: 'array',
            items: { type: 'number', minimum: 1, maximum: 5 },
            minItems: 5,
            maxItems: 5,
            description: '5문항에 대한 답변 배열 (submit 시 필수)'
          },
          metadata: {
            type: 'object',
            description: '추가 메타데이터 (선택)'
          }
        },
        required: ['action']
      }
    },
    {
      name: 'manage_profile',
      description: '프로필 CRUD 관리 (create, get, update, delete, list)',
      inputSchema: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['create', 'get', 'update', 'delete', 'list'],
            description: '수행할 액션'
          },
          profile_id: {
            type: 'string',
            description: '프로필 ID (get, update, delete 시 필수)'
          },
          name: {
            type: 'string',
            description: '이름 (create 시 필수, update 시 선택)'
          },
          scores: {
            type: 'object',
            properties: {
              openness: { type: 'number', minimum: 0, maximum: 100 },
              conscientiousness: { type: 'number', minimum: 0, maximum: 100 },
              extraversion: { type: 'number', minimum: 0, maximum: 100 },
              agreeableness: { type: 'number', minimum: 0, maximum: 100 },
              neuroticism: { type: 'number', minimum: 0, maximum: 100 }
            },
            description: 'Big 5 점수 (create 시 필수, update 시 선택)'
          },
          metadata: {
            type: 'object',
            description: '추가 메타데이터 (선택)'
          }
        },
        required: ['action']
      }
    },
    {
      name: 'analyze_individual',
      description: '개인 성격 분석 (personality, strengths_weaknesses, career, development, learning_style, stress_management)',
      inputSchema: {
        type: 'object',
        properties: {
          profile_id: {
            type: 'string',
            description: '분석할 프로필 ID'
          },
          analysis_type: {
            type: 'string',
            enum: ['personality', 'strengths_weaknesses', 'career', 'development', 'learning_style', 'stress_management'],
            description: '분석 유형'
          },
          options: {
            type: 'object',
            properties: {
              depth: {
                type: 'string',
                enum: ['basic', 'standard', 'comprehensive'],
                description: '분석 깊이'
              },
              current_occupation: {
                type: 'string',
                description: '현재 직업 (career 분석 시)'
              },
              industry_focus: {
                type: 'array',
                items: { type: 'string' },
                description: '관심 산업 (career 분석 시)'
              }
            }
          }
        },
        required: ['profile_id', 'analysis_type']
      }
    },
    {
      name: 'analyze_team',
      description: '팀 구성 및 역학 분석 (composition, roles, conflicts, communication, collaboration)',
      inputSchema: {
        type: 'object',
        properties: {
          profile_ids: {
            type: 'array',
            items: { type: 'string' },
            minItems: 2,
            description: '분석할 팀원들의 프로필 ID 배열'
          },
          analysis_type: {
            type: 'string',
            enum: ['composition', 'roles', 'conflicts', 'communication', 'collaboration'],
            description: '분석 유형'
          },
          options: {
            type: 'object',
            properties: {
              depth: {
                type: 'string',
                enum: ['basic', 'standard', 'comprehensive'],
                description: '분석 깊이'
              },
              project_type: {
                type: 'string',
                description: '프로젝트 유형 (roles 분석 시)'
              }
            }
          }
        },
        required: ['profile_ids', 'analysis_type']
      }
    },
    {
      name: 'analyze_relationship',
      description: '대인관계 분석 (compatibility, communication_style, dynamics)',
      inputSchema: {
        type: 'object',
        properties: {
          profile_id_a: {
            type: 'string',
            description: '첫 번째 프로필 ID'
          },
          profile_id_b: {
            type: 'string',
            description: '두 번째 프로필 ID'
          },
          analysis_type: {
            type: 'string',
            enum: ['compatibility', 'communication_style', 'dynamics'],
            description: '분석 유형'
          },
          options: {
            type: 'object',
            properties: {
              depth: {
                type: 'string',
                enum: ['basic', 'standard', 'comprehensive'],
                description: '분석 깊이'
              },
              context: {
                type: 'string',
                enum: ['work', 'personal', 'romantic'],
                description: '관계 맥락 (compatibility 분석 시)'
              },
              relationship_type: {
                type: 'string',
                enum: ['manager_employee', 'peer', 'mentor_mentee'],
                description: '관계 유형 (dynamics 분석 시)'
              }
            }
          }
        },
        required: ['profile_id_a', 'profile_id_b', 'analysis_type']
      }
    }
  ];
}

// 개별 도구 스키마 lazy getter (필요시 사용)
export function getToolSchema(toolName: string): Tool | undefined {
  const schemas = getToolSchemas();
  return schemas.find(tool => tool.name === toolName);
}
