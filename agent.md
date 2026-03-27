# agent.md -- Big 5 Consulting MCP Server

**언어 규칙: 이 프로젝트에서는 항상 한글로 답변하세요. 기술 용어는 영문을 병기할 수 있습니다.**

## 프로젝트 개요

Big 5 성격 컨설팅 MCP 서버 -- Big 5 성격 평가와 개인/팀/관계 분석을 제공하는
Model Context Protocol 서버. Claude Desktop 통합용으로 설계됨.

## Tech Stack

- **TypeScript** (strict mode, ES2022, CommonJS)
- **MCP SDK** v1.20.0 (stdio transport)
- **Storage**: 파일 시스템 JSON (~/.big5/) + 메모리 캐시 (Map)
- **Analysis**: 규칙 기반 의사결정 트리 (ML/AI 미사용)

## 빌드 및 개발

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
5. **환경변수**: .env 파일은 git에 포함하지 않음
6. **빌드 필수**: 코드 변경 후 `npm run build` 성공 확인

## 로딩 전략

- **On-Demand (기본)**: 각 도구를 호출 시에만 동적 import
- **Lazy Loading**: `BIG5_LAZY_LOAD_SCHEMAS=true` 설정 시 첫 호출에 전체 로드

## 새로운 분석 타입 추가

1. `src/types/index.ts` 타입 정의 업데이트
2. `src/schemas/index.ts` 스키마에 enum 값 추가
3. 해당 도구에서 핸들러 메서드 구현
4. `handle()` switch 문에 case 추가
5. `npm run build` 재빌드

## 점수 계산

- 응답: 1-5 리커트 척도
- 역채점: 12문항 버전은 홀수 인덱스(1,3,5,7,9,11), 6문항 버전은 인덱스 5만
- 정규화: `Math.round((average - 1) * 25)` -> 0-100 스케일

## 상세 문서 (docs/)

| 문서 | 설명 |
|------|------|
| [AGENTS.md](AGENTS.md) | 에이전트 작업 가이드, 문서 맵 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 도메인 맵, 레이어 구조, 의존성 방향 |
| [docs/DESIGN.md](docs/DESIGN.md) | 설계 시스템 및 규칙 |
| [docs/FRONTEND.md](docs/FRONTEND.md) | MCP 도구 인터페이스 설계 |
| [docs/PRODUCT_SENSE.md](docs/PRODUCT_SENSE.md) | 제품 원칙 및 사용자 페르소나 |
| [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md) | 도메인별 품질 등급 |
| [docs/SECURITY.md](docs/SECURITY.md) | 인증 및 보안 규칙 |
| [docs/RELIABILITY.md](docs/RELIABILITY.md) | 신뢰성 기준, 에러 처리, 성능 목표 |
| [docs/PLANS.md](docs/PLANS.md) | 실행 계획 색인 |
| [docs/PRD.md](docs/PRD.md) | 제품 요구사항 정의서 |
| [docs/design-docs/](docs/design-docs/) | 설계 문서 모음 |
| [docs/exec-plans/](docs/exec-plans/) | 실행 계획 관리 |
| [docs/generated/](docs/generated/) | 자동 생성 문서 |
| [docs/references/](docs/references/) | 참조 문서 |
