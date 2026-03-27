# MCP Tool Interface -- Big 5 Consulting MCP Server

이 프로젝트는 웹 프론트엔드가 없는 MCP 서버입니다.
"프론트엔드"는 MCP 클라이언트(Claude Desktop 등)에 노출되는 도구 인터페이스를 의미합니다.

## MCP 도구 목록

### 1. manage_survey -- 설문 세션 관리
| 액션 | 필수 파라미터 | 선택 파라미터 | 설명 |
|------|-------------|-------------|------|
| `start` | `name` | `version`, `metadata` | 새 설문 세션 시작, 5문항 반환 |
| `submit` | `session_id`, `answers[5]` | -- | 5문항 답변 제출, 다음 5문항 반환 |
| `resume` | `session_id` | -- | 기존 세션 재개, 현재 5문항 반환 |
| `progress` | `session_id` | -- | 진행 상황 조회 |

### 2. manage_profile -- 프로필 CRUD
| 액션 | 필수 파라미터 | 선택 파라미터 | 설명 |
|------|-------------|-------------|------|
| `create` | `name`, `scores` | `metadata` | 직접 점수 입력으로 프로필 생성 |
| `get` | `profile_id` | -- | 프로필 조회 |
| `update` | `profile_id` | `name`, `scores`, `metadata` | 프로필 수정 |
| `delete` | `profile_id` | -- | 프로필 삭제 |
| `list` | -- | -- | 전체 프로필 목록 |

### 3. analyze_individual -- 개인 분석 (6종)
| 분석 타입 | 설명 |
|-----------|------|
| `personality` | 종합 성격 프로필 해석 |
| `strengths_weaknesses` | 강점/약점 분석 |
| `career` | 커리어 적합도 및 추천 |
| `development` | 자기계발 가이드 |
| `learning_style` | 학습 스타일 분석 |
| `stress_management` | 스트레스 관리 전략 |

**옵션**: `depth` (basic/standard/comprehensive), `current_occupation`, `industry_focus[]`

### 4. analyze_team -- 팀 분석 (5종)
| 분석 타입 | 설명 |
|-----------|------|
| `composition` | 팀 성격 구성 분석 |
| `roles` | 역할 적합도 매핑 |
| `conflicts` | 갈등 예측 및 예방 |
| `communication` | 소통 스타일 분석 |
| `collaboration` | 협업 효율성 |

**필수**: `profile_ids[]` (2명 이상)

### 5. analyze_relationship -- 관계 분석 (3종)
| 분석 타입 | 설명 |
|-----------|------|
| `compatibility` | 호환성 평가 |
| `communication_style` | 소통 스타일 비교 |
| `dynamics` | 관계 역학 분석 |

**필수**: `profile_id_a`, `profile_id_b`
**옵션**: `context` (work/personal/romantic), `relationship_type` (manager_employee/peer/mentor_mentee)

## 입출력 패턴

### 요청 흐름
```
MCP Client → CallToolRequest { name, arguments }
           → executeTool(name, args)
           → ToolManager.handle(params)
           → JSON 결과
           → CallToolResult { content: [{ type: 'text', text }] }
```

### 설문 세션 흐름
```
start(name) → { session_id, questions[5] }
submit(session_id, answers[5]) → { remaining, questions[5] }  (반복)
submit(session_id, answers[5]) → { profile_id, scores }       (완료 시)
```

## 배포 채널

| 채널 | 설정 파일 | 설명 |
|------|----------|------|
| npm | package.json | `@hjsh200219/big5-consulting` |
| Docker | Dockerfile | node:18-alpine, multi-stage build |
| Smithery | smithery.yaml | MCP 서버 레지스트리 |
