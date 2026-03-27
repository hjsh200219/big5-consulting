# Architecture

> Big 5 Consulting MCP Server -- 아키텍처 참조 문서

## Domain Map

```
big5-consulting
├── Survey Domain      : 성격검사 세션 관리 (시작/제출/재개/진행)
├── Profile Domain     : 사용자 프로필 CRUD
├── Analysis Domain
│   ├── Individual     : 개인 성격/강약점/커리어/개발/학습/스트레스
│   ├── Team           : 팀 구성/역할/갈등/소통/협업
│   └── Relationship   : 호환성/소통스타일/역학
└── Infrastructure
    ├── Storage        : 파일 기반 영속성 + 메모리 캐시
    ├── Config         : 환경변수 기반 설정
    └── Schema         : MCP 도구 스키마 정의
```

## Layer Structure

```
┌─────────────────────────────────────────────┐
│  Entry Point (src/index.ts)                 │  MCP Server, Tool Routing
├─────────────────────────────────────────────┤
│  Tool Layer (src/tools/*.ts)                │  비즈니스 로직, 분석 엔진
│   manageSurvey | manageProfile              │
│   analyzeIndividual | analyzeTeam           │
│   analyzeRelationship                       │
├─────────────────────────────────────────────┤
│  Schema Layer (src/schemas/index.ts)        │  MCP Tool 스키마 정의
├─────────────────────────────────────────────┤
│  Data Layer (src/data/questions.ts)         │  질문지 데이터, 점수 계산
├─────────────────────────────────────────────┤
│  Service Layer (src/services/storage.ts)    │  파일 I/O, 캐시 관리
├─────────────────────────────────────────────┤
│  Type Layer (src/types/index.ts)            │  공유 TypeScript 타입
└─────────────────────────────────────────────┘
```

## Dependency Directions

```
index.ts ──→ tools/*       (동적 import, on-demand)
index.ts ──→ schemas/      (list_tools 시)
index.ts ──→ services/     (StorageManager 초기화)
index.ts ──→ config        (로딩 전략 결정)
index.ts ──→ types/        (타입만 import)

tools/*  ──→ services/     (StorageManager 의존)
tools/*  ──→ types/        (파라미터/모델 타입)
tools/*  ──→ data/         (manageSurvey만 - 질문/점수)

schemas/ ──→ (외부 의존 없음, MCP SDK 타입만)
data/    ──→ types/        (Question 타입)
services/──→ types/        (Profile, SurveySession 타입)
config   ──→ (외부 의존 없음)
types/   ──→ (외부 의존 없음, 리프 노드)
```

## Loading Strategy

두 가지 모드 지원 (BIG5_LAZY_LOAD_SCHEMAS 환경변수):

| 모드 | 트리거 | 동작 |
|------|--------|------|
| **On-Demand** (기본) | 각 도구 호출 시 | 해당 도구만 `await import()` |
| **Lazy Loading** | 첫 도구 호출 시 | `Promise.all()`로 5개 전체 로드 |

## Data Flow

```
Client → MCP Server → Tool Manager → StorageManager → ~/.big5/
                                    ↓
                              Analysis Engine
                              (규칙 기반 의사결정 트리)
                                    ↓
                              JSON Response → Client
```

### 설문 완료 흐름
1. `start` → SurveySession 생성, 5문항 랜덤 제공
2. `submit` x N → 배치 저장, 미답변 질문에서 다음 5문항 랜덤 제공
3. 전체 답변 완료 → `calculateScores()` → Profile 생성 → 세션 삭제

## File Map

| 파일 | 줄 수 | 역할 |
|------|------|------|
| `src/index.ts` | 235 | 서버 진입점, 라우팅, 로딩 전략 |
| `src/config.ts` | 39 | 환경변수 설정 |
| `src/types/index.ts` | 112 | 공유 타입 정의 |
| `src/schemas/index.ts` | 202 | MCP 도구 스키마 |
| `src/services/storage.ts` | 203 | 파일 영속성 + 캐시 |
| `src/data/questions.ts` | 332 | 질문지 60+30문항, 점수 계산 |
| `src/tools/manageSurvey.ts` | 227 | 설문 세션 관리 |
| `src/tools/manageProfile.ts` | 118 | 프로필 CRUD |
| `src/tools/analyzeIndividual.ts` | 343 | 개인 분석 (6종) |
| `src/tools/analyzeTeam.ts` | 509 | 팀 분석 (5종) |
| `src/tools/analyzeRelationship.ts` | 512 | 관계 분석 (3종) |

## Tech Stack

- **Runtime**: Node.js (ES2022 target)
- **Language**: TypeScript (strict mode)
- **Protocol**: MCP SDK v1.20.0 (stdio transport)
- **Module**: CommonJS
- **Storage**: 파일 시스템 (JSON) + 메모리 캐시 (Map)
- **Analysis**: 규칙 기반 의사결정 트리 (ML/AI 미사용)
