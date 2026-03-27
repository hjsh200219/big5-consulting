# AGENTS.md -- Big 5 Consulting MCP Server

에이전트가 이 저장소에서 작업할 때의 가이드라인.

## 에이전트 작업 원칙

1. **코드 변경 전 문서 확인**: 관련 docs/ 문서를 먼저 읽고 맥락을 파악
2. **아키텍처 규칙 준수**: Import 방향, 도구 독립성 등 불변 규칙 반드시 확인
3. **빌드 검증 필수**: 코드 변경 후 `npm run build` 성공 확인
4. **한글 응답**: 이 프로젝트에서는 항상 한글로 답변 (기술 용어 영문 병기 가능)

## 문서 맵

### 핵심 문서 (루트)
| 파일 | 용도 |
|------|------|
| [agent.md](agent.md) | 에이전트 진입점, 프로젝트 개요 및 핵심 규칙 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 도메인 맵, 레이어 구조, 의존성 방향 |

### 상세 문서 (docs/)
| 파일 | 용도 |
|------|------|
| [docs/DESIGN.md](docs/DESIGN.md) | 설계 시스템 -- 타입/스키마/인터페이스 규칙 |
| [docs/FRONTEND.md](docs/FRONTEND.md) | MCP 도구 인터페이스 -- 스키마 구조, 입출력 패턴 |
| [docs/PRODUCT_SENSE.md](docs/PRODUCT_SENSE.md) | 제품 원칙, 사용자 페르소나, 핵심 가치 |
| [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md) | 도메인별 품질 등급 (A-F), 개선 우선순위 |
| [docs/SECURITY.md](docs/SECURITY.md) | 보안 규칙 -- 데이터 보호, 파일 시스템 접근 |
| [docs/RELIABILITY.md](docs/RELIABILITY.md) | 신뢰성 기준, 에러 처리, 성능 목표 |
| [docs/PLANS.md](docs/PLANS.md) | 실행 계획 색인 |
| [docs/PRD.md](docs/PRD.md) | 제품 요구사항 정의서 (원본) |

### 설계 문서 (docs/design-docs/)
| 파일 | 용도 |
|------|------|
| [docs/design-docs/index.md](docs/design-docs/index.md) | 설계 문서 색인 |
| [docs/design-docs/core-beliefs.md](docs/design-docs/core-beliefs.md) | 에이전트 우선 운영 원칙 |
| [docs/design-docs/layer-rules.md](docs/design-docs/layer-rules.md) | Import 방향 규칙, 순환 참조 금지 |

### 실행 계획 (docs/exec-plans/)
| 디렉토리/파일 | 용도 |
|---------------|------|
| [docs/exec-plans/active/](docs/exec-plans/active/) | 진행 중인 실행 계획 |
| [docs/exec-plans/completed/](docs/exec-plans/completed/) | 완료된 실행 계획 |
| [docs/exec-plans/tech-debt-tracker.md](docs/exec-plans/tech-debt-tracker.md) | 기술 부채 추적 |

### 생성 문서 (docs/generated/)
| 파일 | 용도 |
|------|------|
| [docs/generated/db-schema.md](docs/generated/db-schema.md) | 데이터 스키마 (파일 기반 JSON) |

### 참조 문서 (docs/references/)
| 파일 | 용도 |
|------|------|
| [docs/references/CLAUDE-original.md](docs/references/CLAUDE-original.md) | 리팩토링 전 CLAUDE.md 원본 |

## 작업 유형별 체크리스트

### 새 분석 타입 추가
1. `src/types/index.ts` 타입 정의 업데이트
2. `src/schemas/index.ts` 스키마에 enum 값 추가
3. 해당 도구에서 핸들러 메서드 구현
4. `handle()` switch 문에 case 추가
5. `npm run build` 재빌드
6. docs/QUALITY_SCORE.md 품질 매트릭스 업데이트

### 버그 수정
1. docs/RELIABILITY.md 에러 처리 기준 확인
2. docs/design-docs/layer-rules.md 의존성 규칙 확인
3. 수정 후 `npm run build` 성공 확인

### 리팩토링
1. ARCHITECTURE.md 도메인 맵 및 의존성 방향 확인
2. docs/design-docs/layer-rules.md import 규칙 확인
3. docs/exec-plans/tech-debt-tracker.md 기술 부채 확인 및 업데이트
