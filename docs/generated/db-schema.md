# Data Schema -- Big 5 Consulting MCP Server

> 자동 생성 문서 -- 파일 기반 JSON 스토리지 스키마

이 프로젝트는 데이터베이스를 사용하지 않습니다.
`~/.big5/` 디렉토리에 JSON 파일로 데이터를 저장합니다.

## 저장소 구조

```
~/.big5/
├── profiles/          # 프로필 데이터
│   ├── {id}.json      # 개별 프로필
│   └── ...
└── surveys/           # 설문 세션 데이터
    ├── {id}.json      # 개별 세션
    └── ...
```

## Profile 스키마

파일: `~/.big5/profiles/{id}.json`

```json
{
  "id": "string",
  "name": "string",
  "scores": {
    "openness": 0-100,
    "conscientiousness": 0-100,
    "extraversion": 0-100,
    "agreeableness": 0-100,
    "neuroticism": 0-100
  },
  "metadata": {
    "age": "number (선택)",
    "occupation": "string (선택)",
    "industry": "string (선택)"
  },
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | O | UUID 또는 고유 식별자 |
| `name` | string | O | 프로필 이름 |
| `scores` | Big5Scores | O | 5가지 성격 특성 점수 |
| `scores.*` | number (0-100) | O | 정규화된 성격 점수 |
| `metadata` | object | X | 추가 정보 (나이, 직업 등) |
| `created_at` | string | O | 생성 시각 |
| `updated_at` | string | O | 마지막 수정 시각 |

## SurveySession 스키마

파일: `~/.big5/surveys/{id}.json`

```json
{
  "id": "string",
  "name": "string",
  "version": "short | full",
  "answered_count": 0-60,
  "answers": {
    "1": 1-5,
    "2": 1-5
  },
  "current_questions": [1, 15, 32, 7, 44],
  "metadata": {},
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | O | 세션 UUID |
| `name` | string | O | 검사 대상자 이름 |
| `version` | "short" \| "full" | O | 문항 버전 (30문항/60문항) |
| `answered_count` | number | O | 답변 완료 수 (0-30 또는 0-60) |
| `answers` | Record<number, number> | O | 질문번호 -> 답변(1-5) 매핑 |
| `current_questions` | number[] | X | 현재 제공된 질문 번호 배열 |
| `metadata` | object | X | 추가 메타데이터 |
| `created_at` | string | O | 세션 시작 시각 |
| `updated_at` | string | O | 마지막 업데이트 시각 |

## 데이터 생명주기

### Profile
- **생성**: `manage_profile` create / 설문 완료 시 자동 생성
- **조회**: `manage_profile` get / `analyze_*` 도구에서 참조
- **수정**: `manage_profile` update
- **삭제**: `manage_profile` delete (파일 + 캐시 동시 삭제)

### SurveySession
- **생성**: `manage_survey` start
- **업데이트**: `manage_survey` submit (배치 답변 저장)
- **조회**: `manage_survey` resume / progress
- **삭제**: 설문 완료 시 자동 삭제 (Profile로 변환)

## 캐시 구조

StorageManager는 메모리 캐시(Map)를 유지합니다:

```typescript
profileCache: Map<string, Profile>     // id -> Profile
surveyCache: Map<string, SurveySession> // id -> SurveySession
```

- **읽기**: 캐시 우선 조회 -> 캐시 미스 시 파일 로드 -> 캐시 저장
- **쓰기**: 파일 저장 + 캐시 동시 갱신
- **삭제**: 파일 삭제 + 캐시 제거
- **캐시 무효화**: 없음 (단일 프로세스이므로 불필요)
