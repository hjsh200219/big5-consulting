# Architecture -- Big 5 Consulting MCP Server

## 시스템 개요

Big 5 성격 분석 MCP 서버는 Claude Desktop에서 로컬 프로세스로 실행되는
stdio 기반 단일 사용자 서비스입니다. 심리학의 Big Five 성격 모델을
기반으로 개인/팀/관계 분석을 제공합니다.

## 도메인 맵

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

## 레이어 구조

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
│  Config (src/config.ts)                     │  독립 -- 외부 의존 없음
```

## 의존성 방향

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

**핵심 규칙**: 상위 -> 하위만 허용. 하위 -> 상위 import 금지.
상세: [docs/design-docs/layer-rules.md](docs/design-docs/layer-rules.md)

## 로딩 전략

| 모드 | 환경변수 | 동작 |
|------|----------|------|
| **On-Demand** (기본) | `BIG5_LAZY_LOAD_SCHEMAS=false` | 각 도구 호출 시 해당 도구만 `await import()` |
| **Lazy Loading** | `BIG5_LAZY_LOAD_SCHEMAS=true` | 첫 도구 호출 시 `Promise.all()`로 5개 전체 로드 |

## 데이터 흐름

```
Client → MCP Server → Tool Manager → StorageManager → ~/.big5/
                                    ↓
                              Analysis Engine
                              (규칙 기반 의사결정 트리)
                                    ↓
                              JSON Response → Client
```

### 설문 완료 흐름
1. `start` -> SurveySession 생성, 5문항 랜덤 제공
2. `submit` x N -> 배치 저장, 미답변 질문에서 다음 5문항 랜덤 제공
3. 전체 답변 완료 -> `calculateScores()` -> Profile 생성 -> 세션 삭제

## 파일 맵

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
- **Container**: Docker (node:18-alpine, multi-stage build)
- **Registry**: Smithery (MCP 서버 레지스트리)
