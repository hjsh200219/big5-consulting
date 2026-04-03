# AGENTS.md -- Big 5 Consulting MCP Server

**언어 규칙: 이 프로젝트에서는 항상 한글로 답변하세요. 기술 용어는 영문을 병기할 수 있습니다.**

## 프로젝트 개요

Big 5 성격 컨설팅 MCP 서버 -- Big 5 성격 평가와 개인/팀/관계 분석을 제공하는
Model Context Protocol 서버. Claude Desktop 통합용으로 설계됨.

- **TypeScript** (strict mode, ES2022, CommonJS) / **MCP SDK** v1.20.0 (stdio)
- **Storage**: 파일 시스템 JSON (~/.big5/) + 메모리 캐시 (Map)
- **Analysis**: 규칙 기반 의사결정 트리 (ML/AI 미사용)

## 빌드

```bash
npm run build    # TypeScript -> dist/
npm run dev      # tsx 자동 리로드
npm start        # node dist/index.js
```

## 소스 구조

```
src/
├── index.ts              # MCP 서버 진입점, 도구 라우팅
├── config.ts             # 환경변수 설정 (BIG5_LAZY_LOAD_SCHEMAS)
├── types/index.ts        # 공유 TypeScript 타입 (리프 노드)
├── schemas/index.ts      # MCP 도구 스키마 정의
├── services/storage.ts   # 파일 영속성 + 메모리 캐시
├── data/questions.ts     # 질문지 60+30문항, 점수 계산
└── tools/
    ├── manageSurvey.ts       # 설문 세션 (start/submit/resume/progress)
    ├── manageProfile.ts      # 프로필 CRUD
    ├── analyzeIndividual.ts  # 개인 분석 (6종)
    ├── analyzeTeam.ts        # 팀 분석 (5종)
    └── analyzeRelationship.ts# 관계 분석 (3종)
```

## 핵심 불변 규칙

1. **Import 방향**: 상위 -> 하위만 허용. tools/ -> services/ OK, 반대 금지
2. **도구 독립성**: tools/ 파일 간 직접 import 금지. StorageManager 통해서만 공유
3. **타입 리프**: types/index.ts는 내부 모듈을 import하지 않음
4. **데이터 보호**: ~/.big5/ 데이터는 git에 포함하지 않음
5. **빌드 필수**: 코드 변경 후 `npm run build` 성공 확인

## 에이전트 작업 원칙

1. **코드 변경 전 문서 확인**: 관련 docs/ 문서를 먼저 읽고 맥락을 파악
2. **아키텍처 규칙 준수**: ARCHITECTURE.md 및 docs/design-docs/layer-rules.md 확인
3. **빌드 검증 필수**: 코드 변경 후 `npm run build` 성공 확인

## 문서 맵

| 파일 | 용도 |
|------|------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | 도메인 맵, 레이어 구조, 의존성 방향 |
| [docs/DESIGN.md](docs/DESIGN.md) | 설계 시스템 -- 타입/스키마/인터페이스 규칙 |
| [docs/FRONTEND.md](docs/FRONTEND.md) | MCP 도구 인터페이스 -- 스키마 구조, 입출력 패턴 |
| [docs/PRODUCT_SENSE.md](docs/PRODUCT_SENSE.md) | 제품 원칙, 사용자 페르소나, 핵심 가치 |
| [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md) | 도메인별 품질 등급 (A-F), 개선 우선순위 |
| [docs/SECURITY.md](docs/SECURITY.md) | 보안 규칙 -- 데이터 보호, 파일 시스템 접근 |
| [docs/RELIABILITY.md](docs/RELIABILITY.md) | 신뢰성 기준, 에러 처리, 성능 목표 |
| [docs/PLANS.md](docs/PLANS.md) | 실행 계획 색인 |
| [docs/PRD.md](docs/PRD.md) | 제품 요구사항 정의서 |
| [docs/design-docs/](docs/design-docs/) | 설계 문서 (core-beliefs, layer-rules) |
| [docs/exec-plans/](docs/exec-plans/) | 실행 계획 (active, completed, tech-debt-tracker) |
| [docs/generated/db-schema.md](docs/generated/db-schema.md) | 데이터 스키마 (파일 기반 JSON) |
| [docs/product-specs/index.md](docs/product-specs/index.md) | 제품 사양 문서 색인 |
| [docs/references/CLAUDE-original.md](docs/references/CLAUDE-original.md) | 리팩토링 전 CLAUDE.md 원본 |

## 작업 유형별 체크리스트

### 새 분석 타입 추가
1. `src/types/index.ts` -> `src/schemas/index.ts` -> 핸들러 구현 -> `handle()` case 추가
2. `npm run build` 재빌드 + docs/QUALITY_SCORE.md 업데이트

### 버그 수정
1. docs/RELIABILITY.md + docs/design-docs/layer-rules.md 확인
2. 수정 후 `npm run build` 성공 확인

### 리팩토링
1. ARCHITECTURE.md + docs/design-docs/layer-rules.md 확인
2. docs/exec-plans/tech-debt-tracker.md 업데이트
