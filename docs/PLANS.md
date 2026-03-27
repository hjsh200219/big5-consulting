# Plans -- Big 5 Consulting MCP Server

실행 계획 및 기술 부채 관리 색인.

## 활성 계획

현재 진행 중인 실행 계획은 [docs/exec-plans/active/](exec-plans/active/)에서 관리합니다.

| 계획 | 우선순위 | 상태 |
|------|----------|------|
| (아직 활성 계획 없음) | -- | -- |

## 기술 부채

[docs/exec-plans/tech-debt-tracker.md](exec-plans/tech-debt-tracker.md)에서 관리합니다.

### 요약 (상위 항목)
1. **P0**: 테스트 프레임워크 도입 및 핵심 경로 테스트 작성
2. **P1**: 도구 반환 타입 `any` -> 구체적 인터페이스로 교체
3. **P2**: analyzeTeam/analyzeRelationship 분석 로직 모듈화
4. **P3**: 분석 규칙/임계값을 설정 파일로 외부화

## 완료된 계획

[docs/exec-plans/completed/](exec-plans/completed/)에서 관리합니다.

## 계획 작성 가이드

새로운 실행 계획을 추가할 때:
1. `docs/exec-plans/active/`에 `YYYY-MM-DD-plan-name.md` 형식으로 파일 생성
2. 위 "활성 계획" 테이블에 항목 추가
3. 완료 시 `docs/exec-plans/completed/`로 이동하고 테이블 업데이트
