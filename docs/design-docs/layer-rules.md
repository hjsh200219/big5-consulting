# Layer Dependency Rules

> 아키텍처 린트 규칙 -- import 방향 및 금지 패턴 정의

## 허용된 Import 방향

```
 Layer 0: types/           (리프 노드 -- 외부 의존 없음)
    ↑
 Layer 1: data/            (types만 import 가능)
    ↑
 Layer 2: services/        (types만 import 가능)
    ↑
 Layer 3: schemas/         (외부 SDK 타입만 -- 내부 의존 없음)
    ↑
 Layer 4: tools/           (services, data, types import 가능)
    ↑
 Layer 5: index.ts         (모든 레이어 import 가능)
    ↑
 Layer 6: config           (독립 -- 외부 의존 없음)
```

## Import 규칙

### ALLOW (허용)

```typescript
// tools/ -> services/ (OK: 상위 -> 하위)
import { StorageManager } from '../services/storage';

// tools/ -> types/ (OK: 상위 -> 리프)
import { Profile, Big5Scores } from '../types';

// tools/ -> data/ (OK: 상위 -> 하위, manageSurvey만)
import { getRandomQuestions, calculateScores } from '../data/questions';

// services/ -> types/ (OK: 상위 -> 리프)
import { Profile, SurveySession } from '../types';

// data/ -> types/ (OK: 상위 -> 리프)
import { Question } from '../types';

// index.ts -> 모든 레이어 (OK: 진입점)
import { StorageManager } from './services/storage';
import { getToolSchemas } from './schemas';
import { config } from './config';
```

### DENY (금지)

```typescript
// services/ -> tools/ (DENY: 하위 -> 상위)
// NEVER: import { SurveyManager } from '../tools/manageSurvey';

// data/ -> tools/ (DENY: 하위 -> 상위)
// NEVER: import { IndividualAnalyzer } from '../tools/analyzeIndividual';

// data/ -> services/ (DENY: 동일 레이어 간 교차)
// NEVER: import { StorageManager } from '../services/storage';

// types/ -> 어떤 내부 모듈도 (DENY: 리프 노드는 순수해야 함)
// NEVER: import { anything } from '../*';

// schemas/ -> tools/ (DENY: 스키마는 도구를 알면 안 됨)
// NEVER: import { SurveyManager } from '../tools/manageSurvey';

// config -> 어떤 내부 모듈도 (DENY: config는 독립적)
// NEVER: import { anything } from './*';
```

## 순환 참조 금지 패턴

### 절대 금지
```
tools/A.ts -> tools/B.ts -> tools/A.ts          (도구 간 순환)
services/ -> tools/ -> services/                  (레이어 순환)
data/ -> services/ -> data/                       (레이어 순환)
```

### 현재 순환 참조: 없음
모든 도구는 StorageManager만 의존하며, 도구 간 직접 참조 없음.

## 도메인 간 접근 규칙

### 도구 간 독립성
- 각 도구(manageSurvey, manageProfile, analyzeIndividual, analyzeTeam, analyzeRelationship)는 서로를 직접 import하지 않음
- 도구 간 데이터 공유는 StorageManager를 통해서만 수행
- 예: analyzeTeam이 프로필을 조회할 때 storage.getProfile()을 사용 (profileManager를 직접 호출하지 않음)

### 공유 의존성
- `StorageManager`: 모든 도구가 공유하는 유일한 서비스
- `types/`: 모든 레이어가 공유하는 타입 정의
- `data/questions.ts`: manageSurvey만 직접 사용 (다른 도구는 사용 금지)

## 새로운 모듈 추가 시 체크리스트

1. [ ] 해당 모듈의 레이어 위치 결정
2. [ ] import 방향이 상위 -> 하위인지 확인
3. [ ] 순환 참조가 발생하지 않는지 확인
4. [ ] types/에 새로운 타입이 필요하면 types/index.ts에 추가
5. [ ] 도구 간 직접 의존이 생기지 않는지 확인
