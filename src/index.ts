#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import { StorageManager } from './services/storage';
import { getToolSchemas } from './schemas';
import { config } from './config';
import type {
  ManageSurveyParams,
  ManageProfileParams,
  AnalyzeIndividualParams,
  AnalyzeTeamParams,
  AnalyzeRelationshipParams
} from './types';

// 도구 매니저 타입 정의 (타입만 임포트)
import type { SurveyManager } from './tools/manageSurvey';
import type { ProfileManager } from './tools/manageProfile';
import type { IndividualAnalyzer } from './tools/analyzeIndividual';
import type { TeamAnalyzer } from './tools/analyzeTeam';
import type { RelationshipAnalyzer } from './tools/analyzeRelationship';

// 도구 인스턴스 저장소
let storage: StorageManager | null = null;
let surveyManager: SurveyManager | null = null;
let profileManager: ProfileManager | null = null;
let individualAnalyzer: IndividualAnalyzer | null = null;
let teamAnalyzer: TeamAnalyzer | null = null;
let relationshipAnalyzer: RelationshipAnalyzer | null = null;

/**
 * 도구 매니저 맵 타입
 */
type ToolManagerMap = {
  'manage_survey': SurveyManager;
  'manage_profile': ProfileManager;
  'analyze_individual': IndividualAnalyzer;
  'analyze_team': TeamAnalyzer;
  'analyze_relationship': RelationshipAnalyzer;
};

/**
 * Lazy Loading: 첫 tool 호출 시 모든 도구를 한번에 로드
 */
async function initializeAllTools(): Promise<void> {
  if (!surveyManager) {
    const [
      { SurveyManager },
      { ProfileManager },
      { IndividualAnalyzer },
      { TeamAnalyzer },
      { RelationshipAnalyzer }
    ] = await Promise.all([
      import('./tools/manageSurvey'),
      import('./tools/manageProfile'),
      import('./tools/analyzeIndividual'),
      import('./tools/analyzeTeam'),
      import('./tools/analyzeRelationship')
    ]);

    surveyManager = new SurveyManager(storage!);
    profileManager = new ProfileManager(storage!);
    individualAnalyzer = new IndividualAnalyzer(storage!);
    teamAnalyzer = new TeamAnalyzer(storage!);
    relationshipAnalyzer = new RelationshipAnalyzer(storage!);

    console.error('Lazy loading: All tools initialized at once');
  }
}

/**
 * On-Demand Loading: 각 도구는 실제 호출될 때만 개별적으로 로드
 */
async function getSurveyManager(): Promise<SurveyManager> {
  if (!surveyManager) {
    const { SurveyManager } = await import('./tools/manageSurvey');
    surveyManager = new SurveyManager(storage!);
    console.error('On-demand: SurveyManager loaded');
  }
  return surveyManager;
}

async function getProfileManager(): Promise<ProfileManager> {
  if (!profileManager) {
    const { ProfileManager } = await import('./tools/manageProfile');
    profileManager = new ProfileManager(storage!);
    console.error('On-demand: ProfileManager loaded');
  }
  return profileManager;
}

async function getIndividualAnalyzer(): Promise<IndividualAnalyzer> {
  if (!individualAnalyzer) {
    const { IndividualAnalyzer } = await import('./tools/analyzeIndividual');
    individualAnalyzer = new IndividualAnalyzer(storage!);
    console.error('On-demand: IndividualAnalyzer loaded');
  }
  return individualAnalyzer;
}

async function getTeamAnalyzer(): Promise<TeamAnalyzer> {
  if (!teamAnalyzer) {
    const { TeamAnalyzer } = await import('./tools/analyzeTeam');
    teamAnalyzer = new TeamAnalyzer(storage!);
    console.error('On-demand: TeamAnalyzer loaded');
  }
  return teamAnalyzer;
}

async function getRelationshipAnalyzer(): Promise<RelationshipAnalyzer> {
  if (!relationshipAnalyzer) {
    const { RelationshipAnalyzer } = await import('./tools/analyzeRelationship');
    relationshipAnalyzer = new RelationshipAnalyzer(storage!);
    console.error('On-demand: RelationshipAnalyzer loaded');
  }
  return relationshipAnalyzer;
}

/**
 * 도구 실행 헬퍼 함수 - 중복 제거
 */
async function executeTool(name: string, args: unknown): Promise<any> {
  if (config.lazyLoadSchemas) {
    // Lazy Loading 모드: 모든 도구를 한번에 로드
    await initializeAllTools();
  }

  // 도구 실행
  switch (name) {
    case 'manage_survey': {
      const manager = config.lazyLoadSchemas ? surveyManager! : await getSurveyManager();
      return await manager.handle(args as ManageSurveyParams);
    }
    case 'manage_profile': {
      const manager = config.lazyLoadSchemas ? profileManager! : await getProfileManager();
      return await manager.handle(args as ManageProfileParams);
    }
    case 'analyze_individual': {
      const manager = config.lazyLoadSchemas ? individualAnalyzer! : await getIndividualAnalyzer();
      return await manager.handle(args as AnalyzeIndividualParams);
    }
    case 'analyze_team': {
      const manager = config.lazyLoadSchemas ? teamAnalyzer! : await getTeamAnalyzer();
      return await manager.handle(args as AnalyzeTeamParams);
    }
    case 'analyze_relationship': {
      const manager = config.lazyLoadSchemas ? relationshipAnalyzer! : await getRelationshipAnalyzer();
      return await manager.handle(args as AnalyzeRelationshipParams);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

const server = new Server(
  {
    name: 'big5-consulting',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Tool Discovery: list_tools 호출 시에만 스키마 로드
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: getToolSchemas() };
});

/**
 * Tool 실행 핸들러
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await executeTool(name, args);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Tool execution error [${name}]:`, errorMessage);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2)
        }
      ],
      isError: true
    };
  }
});

/**
 * MCP 서버 시작
 *
 * 1. StorageManager 초기화 (디렉토리 생성)
 * 2. Stdio 트랜스포트를 통해 서버 연결
 * 3. 로딩 모드 정보 출력
 */
async function main(): Promise<void> {
  // Storage는 서버 시작 시 초기화 (디렉토리 생성 필요)
  storage = new StorageManager();
  await storage.initialize();

  const transport = new StdioServerTransport();
  await server.connect(transport);

  const mode = config.lazyLoadSchemas ? 'Lazy Loading' : 'On-Demand Loading';
  console.error(`Big 5 Consulting MCP Server running on stdio`);
  console.error(`Loading mode: ${mode}`);
  console.error(`  - Lazy Loading: All tools loaded on first call (BIG5_LAZY_LOAD_SCHEMAS=true)`);
  console.error(`  - On-Demand Loading: Each tool loaded individually when needed (default)`);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
