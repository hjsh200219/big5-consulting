# CLAUDE.md

이 파일은 이 저장소의 코드 작업 시 Claude Code (claude.ai/code)에게 제공되는 지침입니다.

**중요: 이 프로젝트에서는 항상 한글로 답변하세요. 기술 용어는 영문을 병기할 수 있습니다.**

## 프로젝트 개요

Big 5 성격 컨설팅 MCP 서버 - Big 5 성격 평가와 개인, 팀, 관계에 대한 포괄적인 분석을 제공하는 Model Context Protocol 서버입니다. Claude Desktop 통합을 위해 설계되었습니다.

## 빌드 및 개발 명령어

```bash
# TypeScript를 dist/로 빌드
npm run build

# 자동 리로드가 있는 개발 모드
npm run dev

# 프로덕션 실행
npm start
```

## 아키텍처 개요

### 로딩 전략: On-Demand vs Lazy Loading

서버는 두 가지 로딩 전략을 지원합니다:

#### 1. On-Demand Loading (기본값)
**각 도구를 호출 시에만 개별적으로 로드**

- **스키마 로딩**: `src/schemas/index.ts`의 도구 스키마는 `list_tools` 호출 시에만 `getToolSchemas()`를 통해 로드
- **개별 도구 로딩**: 각 도구는 동적 `import()`를 사용하며 **해당 특정 도구가 호출될 때만** 로드
  - `manage_survey` → SurveyManager만 로드
  - `analyze_team` → TeamAnalyzer만 로드 (다른 도구와 독립적)
- **스토리지**: `StorageManager`는 서버 시작 시 초기화되어 `~/.big5/` 디렉토리 구조 생성

**장점:**
- 사용된 도구만 메모리에 로드 (예: 팀 분석을 사용하지 않으면 TeamAnalyzer는 로드되지 않음)
- 메모리 사용량: ~30MB 기본, 로드된 도구당 +10-15MB
- 첫 도구 호출: ~50-100ms (동적 import), 이후: <10ms (캐시됨)
- 시작 시간: <50ms

**적합한 사용자:**
- 특정 도구만 주로 사용하는 경우
- 메모리 효율성이 중요한 경우

#### 2. Lazy Loading (선택적)
**첫 도구 호출 시 모든 도구를 한번에 로드**

환경변수 `BIG5_LAZY_LOAD_SCHEMAS=true` 설정으로 활성화:

```json
{
  "mcpServers": {
    "big5-consulting": {
      "command": "node",
      "args": ["/path/to/big5-consulting/dist/index.js"],
      "env": {
        "BIG5_LAZY_LOAD_SCHEMAS": "true"
      }
    }
  }
}
```

- **통합 로딩**: 첫 도구 호출 시 `Promise.all()`로 5개 도구를 모두 한번에 로드
- **이후 호출**: 모든 도구가 이미 메모리에 있어 즉시 응답

**장점:**
- 첫 로딩 후 모든 도구 즉시 사용 가능
- 여러 도구를 자주 사용하는 경우 전체적으로 더 빠름

**적합한 사용자:**
- 모든 도구를 골고루 사용하는 경우
- 첫 로딩 지연(~100-150ms)을 감수할 수 있는 경우

**성능 비교:**

| 특성 | On-Demand (기본값) | Lazy Loading |
|------|-------------------|--------------|
| 초기 메모리 | ~30MB | ~30MB |
| 완전 로드 메모리 | ~100MB (5개 도구 사용 시) | ~100MB |
| 첫 도구 호출 | 50-100ms | 100-150ms (모든 도구 로드) |
| 이후 도구 호출 | 50-100ms (첫 사용 시), <10ms (이후) | <10ms (모든 도구) |
| 미사용 도구 | 메모리에 없음 | 메모리에 있음 |

### MCP 서버 흐름

```
클라이언트 요청 → MCP 서버 (index.ts)
                 ├─ list_tools → getToolSchemas() [on-demand]
                 └─ call_tool →
                     [On-Demand 모드]
                     └─ getSurveyManager() [개별 동적 import]
                         → surveyManager.handle()

                     [Lazy Loading 모드]
                     └─ initializeAllTools() [첫 호출 시 한번만]
                         → surveyManager.handle()
```

### 핵심 컴포넌트

**src/config.ts** - 환경변수 기반 설정 관리
- `loadConfig()`: `BIG5_LAZY_LOAD_SCHEMAS` 환경변수 읽기
- `config.lazyLoadSchemas`: 로딩 전략 플래그 (true = Lazy, false = On-Demand)

**src/index.ts** - 이중 로딩 모드 로직을 가진 MCP 서버 진입점
- **On-Demand 모드**: 도구별 개별 getter 함수
  - `getSurveyManager()`, `getProfileManager()`, etc.
  - 각각 `await import()`로 동적 모듈 로딩
- **Lazy Loading 모드**: `initializeAllTools()` 함수
  - 첫 호출 시 `Promise.all()`로 모든 도구 한번에 로드
  - 이후 이미 로드된 매니저 직접 사용
- `ListToolsRequestSchema` 및 `CallToolRequestSchema` 요청 핸들러

**src/schemas/index.ts** - 도구 스키마 정의
- `getToolSchemas()`: 요청 시 5개 도구 스키마 모두 반환
- `getToolSchema(name)`: 필요 시 개별 스키마 조회

**src/services/storage.ts** - 캐싱을 포함한 파일 기반 영속성
- 디렉토리 구조: `~/.big5/profiles/` 및 `~/.big5/surveys/`
- 빠른 조회를 위한 메모리 캐시 (Map)
- 영속성을 위한 JSON 파일 저장

**src/data/questions.ts** - Big 5 질문지 데이터 및 점수 계산
- 50개 질문 (특성당 10개: 정방향 5개, 역방향 5개)
- `getQuestionBatch()`: 배치당 5개 질문 반환
- `calculateScores()`: 역점수 적용 (인덱스 5-9) 및 1-5 척도를 0-100으로 변환

**src/types/index.ts** - 전체 시스템을 위한 TypeScript 타입 정의

### 도구 구현

각 도구는 단일 `handle(params)` 메서드를 가진 액션 기반 라우팅 패턴을 따릅니다:

**src/tools/manageSurvey.ts** - 설문 세션 관리
- 액션: start, submit, resume, progress
- 5문항 배치 구현 (총 10 배치: 5개 특성 × 2 배치)
- 완료 시 Profile 생성 및 세션 삭제

**src/tools/manageProfile.ts** - Profile CRUD 작업
- 액션: create, get, update, delete, list
- 스토리지 레이어와 직접 상호작용

**src/tools/analyzeIndividual.ts** - 개인 성격 분석
- 분석 타입: personality, strengths_weaknesses, career, development, learning_style, stress_management
- 권장사항을 위한 규칙 기반 의사결정 트리

**src/tools/analyzeTeam.ts** - 팀 구성 및 역학 분석
- 분석 타입: composition, roles, conflicts, communication, collaboration
- 팀 메트릭을 위한 통계 분석 (평균, 분산, 표준편차)
- 다양성 점수 및 균형 평가

**src/tools/analyzeRelationship.ts** - 관계 호환성 분석
- 분석 타입: compatibility, communication_style, dynamics
- 맥락 인식 가중치 (업무/개인/연애)
- 상보성 vs 유사성 점수

## 데이터 흐름

### 설문 완료 흐름

1. **시작**: `manage_survey(action: "start", name: "사용자")` → `SurveySession` 생성, 첫 5개 질문 반환
2. **제출**: `manage_survey(action: "submit", session_id, answers: [1-5, 1-5, ...])` → 배치 저장, 다음으로 진행
3. **반복**: 10개 배치에 대해 제출 반복 (총 50개 질문)
4. **완료**: 최종 제출 → `calculateScores()` → `Profile` 생성 → 세션 삭제 → profile_id 반환

### 분석 흐름

1. `StorageManager`에서 프로필 조회
2. 특성별 분석 로직 적용 (규칙 기반 의사결정 트리)
3. 점수 임계값과 패턴에 기반한 권장사항 생성
4. 구조화된 JSON 응답 반환

## 주요 구현 세부사항

### 역점수 로직

각 특성의 6-10번 질문은 역점수 처리됩니다:
- 원래 점수: 1-5
- 역점수: `6 - 원래값`
- 예시: 사용자가 5(매우 동의) 응답 → 부정적 특성에 대해 1이 됨

### 점수 정규화

원시 점수 (1-5 척도)를 0-100으로 변환:
```typescript
const average = scored.reduce((a, b) => a + b, 0) / scored.length;
const normalized = Math.round((average - 1) * 25);
```

### 세션 상태 관리

세션은 다음 정보와 함께 `~/.big5/surveys/{session_id}.json`에 영속화됩니다:
- `current_trait`: 5개 특성 중 현재 활성 특성
- `current_batch`: 해당 특성 내 1 또는 2
- `responses`: 누적된 부분 응답
- `completed_traits`: 완료된 특성 배열

### Claude Desktop 통합

설정 파일: `~/Library/Application Support/Claude/claude_desktop_config.json`

**On-Demand Loading (기본값):**
```json
{
  "mcpServers": {
    "big5-consulting": {
      "command": "node",
      "args": ["/path/to/big5-consulting/dist/index.js"]
    }
  }
}
```

**Lazy Loading (선택적):**
```json
{
  "mcpServers": {
    "big5-consulting": {
      "command": "node",
      "args": ["/path/to/big5-consulting/dist/index.js"],
      "env": {
        "BIG5_LAZY_LOAD_SCHEMAS": "true"
      }
    }
  }
}
```

## 파일 구조 근거

- **tools/** - 각 도구는 모든 분석 로직을 포함하는 독립적인 핸들러
- **schemas/** - Lazy loading을 위해 분리; 필요할 때까지 메모리에 로드되지 않음
- **services/** - 모든 도구가 사용하는 공유 인프라 (스토리지)
- **data/** - 정적 질문지 데이터 및 점수 계산 알고리즘
- **types/** - 타입 안정성을 위한 중앙화된 TypeScript 정의

## 새로운 분석 타입 추가하기

기존 도구에 새로운 분석 타입을 추가하려면:

1. `src/types/index.ts`에서 타입 정의 업데이트 (예: `IndividualAnalysisType`)
2. `src/schemas/index.ts`의 스키마에 enum 값 추가
3. 해당 도구에서 핸들러 메서드 구현 (예: `analyzeIndividual.ts`의 `analyzeNewType()`)
4. 도구의 `handle()` 메서드에 switch 문 case 추가
5. `npm run build`로 재빌드

## 성능 고려사항

- **캐싱**: `StorageManager`는 메모리 내 Map 캐시 유지; 캐시 미스 시에만 디스크에서 프로필/세션 로드
- **배치 처리**: 모든 파일 I/O는 논블로킹 작업을 위해 async/await 사용
- **로딩 전략**:
  - **On-Demand**: 도구는 첫 사용 시에만 인스턴스화, 스키마는 발견 시에만 로드
  - **Lazy Loading**: 첫 도구 호출 시 모든 도구를 한번에 로드
- **메모리 사용량**:
  - 기본 ~30MB
  - On-Demand 완전 로드 시 ~100MB
  - Lazy Loading 첫 호출 후 ~100MB

## 환경변수 설정

프로젝트 루트에 `.env` 파일 생성 (선택적):

```bash
# 로딩 전략 설정
# - false (기본값): On-Demand Loading - 각 도구를 호출 시에만 개별 로드
# - true: Lazy Loading - 첫 tool 호출 시 모든 도구를 한번에 로드
BIG5_LAZY_LOAD_SCHEMAS=false
```

또는 Claude Desktop 설정에서 직접 `env` 필드로 설정할 수 있습니다.
