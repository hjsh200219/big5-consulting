# Design System -- Big 5 Consulting MCP Server

## 설계 원칙

### 1. 타입 우선 설계
- 모든 도메인 객체는 `src/types/index.ts`에서 인터페이스로 정의
- types/는 리프 노드 -- 어떤 내부 모듈도 import하지 않음
- strict 모드 필수 (`"strict": true` in tsconfig.json)

### 2. 스키마-도구 분리
- MCP 도구 스키마(`src/schemas/index.ts`)는 도구 구현을 import하지 않음
- 스키마는 JSON Schema 형식으로 입력 검증만 담당
- 도구 구현(`src/tools/*.ts`)은 비즈니스 로직만 담당

### 3. 단일 저장소 패턴
- `StorageManager`가 모든 파일 I/O를 관리하는 유일한 서비스
- 모든 도구는 StorageManager를 통해서만 데이터에 접근
- 도구 간 직접 의존 금지

## 타입 체계

### 핵심 도메인 타입
```typescript
Big5Scores        // 5가지 특성 점수 (0-100)
Profile           // 사용자 프로필 (id, name, scores, metadata)
SurveySession     // 설문 세션 (진행 상태, 답변 기록)
Question          // 질문 항목 (번호, 텍스트, 역채점 여부)
```

### 액션 타입 (Union 리터럴)
```typescript
SurveyAction      // 'start' | 'submit' | 'resume' | 'progress'
ProfileAction     // 'create' | 'get' | 'update' | 'delete' | 'list'
IndividualAnalysisType  // 'personality' | 'strengths_weaknesses' | ...
TeamAnalysisType        // 'composition' | 'roles' | 'conflicts' | ...
RelationshipAnalysisType // 'compatibility' | 'communication_style' | 'dynamics'
```

### 파라미터 타입
- 각 MCP 도구의 입력 파라미터는 전용 인터페이스로 정의
- `ManageSurveyParams`, `ManageProfileParams`, `AnalyzeIndividualParams` 등

## 스키마 설계 규칙

### MCP 도구 스키마 표준
- `inputSchema`는 JSON Schema Draft-07 형식
- `required` 배열에 필수 파라미터 명시
- 선택 파라미터는 `description`에 조건 명시 (예: "submit 시 필수")
- 숫자 범위는 `minimum`/`maximum`으로 제한

### 점수 범위
| 데이터 | 범위 | 타입 |
|--------|------|------|
| Big5 점수 | 0-100 | 정수 |
| 설문 응답 | 1-5 | 정수 (리커트 척도) |
| 배치 크기 | 5문항 | 고정 |

## 파일 저장 규칙

### 경로 규약
```
~/.big5/
├── profiles/     # {profile_id}.json
└── surveys/      # {session_id}.json
```

### JSON 포맷
- 들여쓰기: 2칸 (`JSON.stringify(data, null, 2)`)
- 전체 덮어쓰기 (부분 업데이트 없음)
- 캐시와 파일 동시 갱신

## 에러 응답 규칙

### MCP 응답 형식
```typescript
// 성공
{ content: [{ type: 'text', text: JSON.stringify(result) }] }

// 에러
{ content: [{ type: 'text', text: JSON.stringify({ error: message }) }], isError: true }
```

### 에러 메시지 일관성
- 한글로 작성 권장 (현재 한글/영문 혼재 -- 통일 필요)
- 구체적인 에러 원인 포함 (예: "프로필 ID 'xxx'를 찾을 수 없습니다")
