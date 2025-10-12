# PRD: Big 5 성격 분석 MCP 서버

## 1. 제품 개요

### 1.1 목적
Big 5 성격검사 결과를 활용하여 개인화된 인사이트, 추천, 분석을 제공하는 MCP(Model Context Protocol) 서버

### 1.2 핵심 가치
- 개인 맞춤형 커리어/자기계발 가이드
- 팀 구성 및 조직 관리 최적화
- AI 어시스턴트의 커뮤니케이션 스타일 개인화
- 데이터 기반 의사결정 지원

## 2. Big 5 성격검사 질문지

### 2.1 검사 개요
- **총 문항 수**: 50문항 (각 특성당 10문항)
- **응답 척도**: 5점 리커트 척도 (1: 전혀 아니다 ~ 5: 매우 그렇다)
- **소요 시간**: 약 5-10분
- **역채점 문항**: 각 특성당 5개 (부정적 표현 문항)

### 2.2 문항 구성

#### 개방성 (Openness) - 10문항
**정방향 문항 (5개)**
1. 새로운 아이디어와 경험에 흥미를 느낀다
2. 상상력이 풍부하고 창의적이다
3. 예술, 음악, 문학에 관심이 많다
4. 추상적이고 철학적인 주제를 즐긴다
5. 다양한 문화와 가치관을 이해하려 노력한다

**역방향 문항 (5개)**
6. 익숙한 방식을 선호하고 변화를 싫어한다 (R)
7. 상상력보다 현실적인 것을 중시한다 (R)
8. 예술적인 활동에는 별 관심이 없다 (R)
9. 복잡한 이론이나 개념은 피하고 싶다 (R)
10. 전통적인 가치관을 고수하는 편이다 (R)

#### 성실성 (Conscientiousness) - 10문항
**정방향 문항 (5개)**
1. 계획을 세우고 체계적으로 일을 처리한다
2. 맡은 일은 책임감 있게 완수한다
3. 시간 약속을 잘 지키고 준비를 철저히 한다
4. 목표 달성을 위해 꾸준히 노력한다
5. 세부사항까지 꼼꼼하게 확인하는 편이다

**역방향 문항 (5개)**
6. 일을 미루는 경향이 있다 (R)
7. 정리정돈을 잘 못하고 물건을 자주 잃어버린다 (R)
8. 계획 없이 즉흥적으로 행동하는 편이다 (R)
9. 시작한 일을 끝까지 마치기 어렵다 (R)
10. 대충대충 처리하는 경우가 많다 (R)

#### 외향성 (Extraversion) - 10문항
**정방향 문항 (5개)**
1. 사람들과 어울리는 것을 즐긴다
2. 새로운 사람을 만나는 것이 편하다
3. 파티나 모임에서 활기차고 에너지가 넘친다
4. 대화를 주도하고 적극적으로 의견을 말한다
5. 주목받는 것을 즐기고 리더 역할을 선호한다

**역방향 문항 (5개)**
6. 혼자 있는 시간이 더 편하다 (R)
7. 많은 사람들과 함께 있으면 피곤하다 (R)
8. 조용하고 침착한 편이다 (R)
9. 먼저 대화를 시작하는 것이 어렵다 (R)
10. 큰 모임보다 소규모 모임을 선호한다 (R)

#### 친화성 (Agreeableness) - 10문항
**정방향 문항 (5개)**
1. 다른 사람의 감정에 공감을 잘한다
2. 협력적이고 타협을 잘한다
3. 남을 돕는 것에 기쁨을 느낀다
4. 갈등 상황에서 평화적 해결을 추구한다
5. 다른 사람을 신뢰하는 편이다

**역방향 문항 (5개)**
6. 다른 사람의 의도를 의심하는 편이다 (R)
7. 내 의견을 고집하고 타협하기 어렵다 (R)
8. 비판적이고 냉소적인 태도를 보인다 (R)
9. 경쟁적이고 남을 이기려는 마음이 강하다 (R)
10. 다른 사람의 문제에 무관심한 편이다 (R)

#### 신경성 (Neuroticism) - 10문항
**정방향 문항 (5개)**
1. 스트레스 상황에서 불안하고 걱정이 많다
2. 기분이 자주 변하는 편이다
3. 작은 일에도 쉽게 화가 나거나 짜증이 난다
4. 부정적인 생각을 자주 한다
5. 실수나 실패에 대한 두려움이 크다

**역방향 문항 (5개)**
6. 대부분의 상황에서 침착하고 차분하다 (R)
7. 감정적으로 안정되어 있고 동요하지 않는다 (R)
8. 스트레스를 잘 관리하고 빨리 회복한다 (R)
9. 걱정이 적고 낙관적이다 (R)
10. 압박 상황에서도 평정심을 유지한다 (R)

### 2.3 배치 입력 방식 (5문항씩)

**사용자 경험 최적화를 위해 10개 문항을 5문항씩 2회에 걸쳐 입력**

```typescript
// 세션 관리 구조
interface SurveySession {
  id: string;
  name: string;
  current_trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  current_batch: 1 | 2;  // 각 특성당 2배치
  responses: {
    openness?: number[];
    conscientiousness?: number[];
    extraversion?: number[];
    agreeableness?: number[];
    neuroticism?: number[];
  };
  completed_traits: string[];
  created_at: timestamp;
}

// 배치 입력 예시
User: "성격검사 시작"
Claude: "Big 5 성격검사를 시작합니다. 각 특성당 5문항씩 답변해주세요.
        (1=전혀 아니다, 2=아니다, 3=보통, 4=그렇다, 5=매우 그렇다)

        === 개방성 (Openness) - 1/2 ===
        1. 새로운 아이디어와 경험에 흥미를 느낀다
        2. 상상력이 풍부하고 창의적이다
        3. 예술, 음악, 문학에 관심이 많다
        4. 추상적이고 철학적인 주제를 즐긴다
        5. 다양한 문화와 가치관을 이해하려 노력한다

        쉼표로 구분하여 답변해주세요 (예: 4,5,3,4,5)"

User: "4,5,3,4,5"

Claude: "개방성 1/2 완료! 이어서 진행하겠습니다.

        === 개방성 (Openness) - 2/2 ===
        6. 익숙한 방식을 선호하고 변화를 싫어한다 (R)
        7. 상상력보다 현실적인 것을 중시한다 (R)
        8. 예술적인 활동에는 별 관심이 없다 (R)
        9. 복잡한 이론이나 개념은 피하고 싶다 (R)
        10. 전통적인 가치관을 고수하는 편이다 (R)

        답변: "

User: "2,2,1,2,3"

Claude: "개방성 완료! (진행률: 10/50)

        === 성실성 (Conscientiousness) - 1/2 ===
        1. 계획을 세우고 체계적으로 일을 처리한다
        ..."

// 중간에 중단하고 나중에 재개 가능
User: "나중에 이어할게"
Claude: "세션이 저장되었습니다 (ID: survey_abc123).
        '검사 재개 survey_abc123' 명령으로 이어서 진행할 수 있습니다."
```

### 2.4 점수 계산 방식

```typescript
interface QuestionnaireResponse {
  openness: number[];          // 10개 응답 (1-5)
  conscientiousness: number[]; // 10개 응답 (1-5)
  extraversion: number[];      // 10개 응답 (1-5)
  agreeableness: number[];     // 10개 응답 (1-5)
  neuroticism: number[];       // 10개 응답 (1-5)
}

function calculateScores(responses: QuestionnaireResponse): Big5Scores {
  // 역채점 문항 인덱스 (6-10번)
  const reverseIndices = [5, 6, 7, 8, 9];

  // 각 특성별 점수 계산
  const calculateTrait = (answers: number[]): number => {
    const scored = answers.map((value, index) => {
      // 역채점 문항은 6에서 빼기 (1→5, 2→4, 3→3, 4→2, 5→1)
      return reverseIndices.includes(index) ? 6 - value : value;
    });

    // 평균 계산 후 0-100 스케일로 변환
    const average = scored.reduce((a, b) => a + b, 0) / scored.length;
    return Math.round((average - 1) * 25); // 1-5 → 0-100
  };

  return {
    openness: calculateTrait(responses.openness),
    conscientiousness: calculateTrait(responses.conscientiousness),
    extraversion: calculateTrait(responses.extraversion),
    agreeableness: calculateTrait(responses.agreeableness),
    neuroticism: calculateTrait(responses.neuroticism)
  };
}
```

### 2.5 검사 신뢰도 검증
- **내적 일관성**: Cronbach's Alpha > 0.70 (각 특성별)
- **재검사 신뢰도**: 2주 간격 재검사 상관계수 > 0.80
- **타당도**: 기존 Big 5 검사(NEO-PI-R)와 상관계수 > 0.75

## 3. 핵심 기능

### 3.1 프로필 관리 (MCP Tools)
- `manage_profile`: 프로필 CRUD 통합 (create/get/update/delete/list)
- `manage_survey`: 검사 세션 관리 통합 (start/submit/resume/progress)

### 3.2 개인 분석 (MCP Tools)
- `analyze_individual`: 개인 분석 통합
  - 성격 특성 분석 (personality)
  - 강점/약점 도출 (strengths_weaknesses)
  - 커리어 추천 (career)
  - 자기계발 전략 (development)
  - 학습 스타일 (learning_style)
  - 스트레스 관리 (stress_management)

### 3.3 팀/관계 분석 (MCP Tools)
- `analyze_team`: 팀 분석 통합
  - 팀 구성 분석 (composition)
  - 역할 배분 추천 (role_assignment)
  - 갈등 예측 (conflict_prediction)
  - 커뮤니케이션 최적화 (communication)
  - 협업 전략 (collaboration)

- `analyze_relationship`: 대인관계 분석 통합
  - 호환성 분석 (compatibility)
  - 소통 방법 추천 (communication_style)
  - 관계 역학 예측 (dynamics)


## 4. MCP 표준 API 설계

**MCP SDK**: [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)를 사용하여 표준 프로토콜 준수

### 4.1 MCP Tool: `manage_survey`

**통합된 검사 관리 도구** - 단일 tool로 모든 검사 관련 작업 수행

```typescript
// Tool 정의
{
  name: "manage_survey",
  description: "Big 5 성격검사 세션 관리 (시작/제출/재개/진행조회)",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["start", "submit", "resume", "progress"],
        description: "수행할 작업"
      },
      name: { type: "string" },           // action=start 시 필수
      session_id: { type: "string" },     // action=submit/resume/progress 시 필수
      answers: {                           // action=submit 시 필수
        type: "array",
        items: { type: "number", minimum: 1, maximum: 5 },
        minItems: 5,
        maxItems: 5
      },
      metadata: { type: "object" }        // action=start 시 선택
    }
  }
}

// 사용 예시 1: 검사 시작
manage_survey({
  action: "start",
  name: "홍길동",
  metadata: { occupation: "소프트웨어 엔지니어" }
})

// Response
{
  session_id: "survey_abc123",
  name: "홍길동",
  current_trait: "openness",
  current_batch: 1,
  progress: "0/50",
  questions: [
    { number: 1, text: "새로운 아이디어와 경험에 흥미를 느낀다", reverse_scored: false },
    { number: 2, text: "상상력이 풍부하고 창의적이다", reverse_scored: false },
    // ... 5개 문항
  ],
  instruction: "1-5로 답변해주세요 (쉼표 구분)"
}

// 사용 예시 2: 답변 제출
manage_survey({
  action: "submit",
  session_id: "survey_abc123",
  answers: [4, 5, 3, 4, 5]
})

// Response (진행 중)
{
  session_id: "survey_abc123",
  progress: "5/50",
  current_trait: "openness",
  current_batch: 2,
  next_questions: [...]
}

// Response (전체 완료)
{
  session_id: "survey_abc123",
  completed: true,
  progress: "50/50",
  profile_id: "prof_abc123",
  scores: {
    openness: 72,
    conscientiousness: 85,
    extraversion: 28,
    agreeableness: 68,
    neuroticism: 42
  }
}

// 사용 예시 3: 검사 재개
manage_survey({
  action: "resume",
  session_id: "survey_abc123"
})

// 사용 예시 4: 진행 상태
manage_survey({
  action: "progress",
  session_id: "survey_abc123"
})
```

### 4.2 MCP Tool: `manage_profile`

**통합된 프로필 관리 도구** - CRUD 작업을 단일 tool로 처리

```typescript
// Tool 정의
{
  name: "manage_profile",
  description: "Big 5 프로필 관리 (생성/조회/수정/삭제/목록)",
  inputSchema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["create", "get", "update", "delete", "list"],
        description: "수행할 작업"
      },
      profile_id: { type: "string" },     // get/update/delete 시 필수
      name: { type: "string" },            // create 시 필수
      scores: {                            // create/update 시 사용
        type: "object",
        properties: {
          openness: { type: "number", minimum: 0, maximum: 100 },
          conscientiousness: { type: "number", minimum: 0, maximum: 100 },
          extraversion: { type: "number", minimum: 0, maximum: 100 },
          agreeableness: { type: "number", minimum: 0, maximum: 100 },
          neuroticism: { type: "number", minimum: 0, maximum: 100 }
        }
      },
      metadata: { type: "object" }
    }
  }
}

// 사용 예시: 직접 점수로 생성
manage_profile({
  action: "create",
  name: "홍길동",
  scores: {
    openness: 75,
    conscientiousness: 82,
    extraversion: 45,
    agreeableness: 68,
    neuroticism: 38
  },
  metadata: { occupation: "소프트웨어 엔지니어" }
})

// 사용 예시: 프로필 조회
manage_profile({
  action: "get",
  profile_id: "prof_abc123"
})

// 사용 예시: 전체 목록
manage_profile({
  action: "list"
})
```

### 4.3 MCP Tool: `analyze_individual`

**개인 분석 통합 도구** - 다양한 분석을 단일 tool로 제공

```typescript
// Tool 정의
{
  name: "analyze_individual",
  description: "개인 성격 분석 (특성/강약점/커리어/학습/스트레스)",
  inputSchema: {
    type: "object",
    properties: {
      profile_id: { type: "string", description: "분석할 프로필 ID" },
      analysis_type: {
        type: "string",
        enum: [
          "personality",           // 성격 특성 분석
          "strengths_weaknesses",  // 강점/약점
          "career",                // 커리어 추천
          "development",           // 자기계발 전략
          "learning_style",        // 학습 스타일
          "stress_management"      // 스트레스 관리
        ]
      },
      options: {                   // 분석 옵션 (선택)
        type: "object",
        properties: {
          depth: { type: "string", enum: ["basic", "standard", "comprehensive"] },
          current_occupation: { type: "string" },
          industry_focus: { type: "array", items: { type: "string" } }
        }
      }
    },
    required: ["profile_id", "analysis_type"]
  }
}

// 사용 예시: 성격 분석
analyze_individual({
  profile_id: "prof_abc123",
  analysis_type: "personality",
  options: { depth: "comprehensive" }
})

// Response
{
  profile_id: "prof_abc123",
  analysis_type: "personality",
  summary: "높은 성실성과 개방성을 가진 내향적 성격",
  traits: {
    openness: {
      level: "high",
      percentile: 75,
      description: "새로운 아이디어와 경험에 개방적",
      implications: ["창의적 문제 해결", "학습 욕구 높음"]
    },
    // ... 다른 특성들
  },
  overall_insights: [
    "체계적이고 창의적인 업무 스타일",
    "독립적 작업 선호"
  ]
}

// 사용 예시: 커리어 추천
analyze_individual({
  profile_id: "prof_abc123",
  analysis_type: "career",
  options: {
    current_occupation: "소프트웨어 엔지니어",
    industry_focus: ["tech", "finance"]
  }
})
```

### 4.4 MCP Tool: `analyze_team`

**팀 분석 통합 도구** - 팀 구성 및 역학 분석

```typescript
// Tool 정의
{
  name: "analyze_team",
  description: "팀 분석 (구성/역할/갈등/커뮤니케이션/협업)",
  inputSchema: {
    type: "object",
    properties: {
      profile_ids: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
        description: "팀원 프로필 ID 목록"
      },
      analysis_type: {
        type: "string",
        enum: [
          "composition",        // 팀 구성 분석
          "role_assignment",    // 역할 배분
          "conflict_prediction", // 갈등 예측
          "communication",      // 커뮤니케이션
          "collaboration"       // 협업 전략
        ]
      },
      options: { type: "object" }
    },
    required: ["profile_ids", "analysis_type"]
  }
}

// 사용 예시: 팀 구성 분석
analyze_team({
  profile_ids: ["prof_abc123", "prof_def456", "prof_ghi789"],
  analysis_type: "composition"
})

// Response
{
  analysis_type: "composition",
  team_summary: {
    diversity_score: 0.72,
    balance_assessment: "well-balanced",
    potential_strengths: [
      "다양한 관점으로 창의적 해결책 도출",
      "체계적 실행력"
    ],
    potential_challenges: ["의사결정 속도", "갈등 관리"]
  },
  member_roles: [
    {
      profile_id: "prof_abc123",
      recommended_role: "기술 리드",
      rationale: "높은 개방성과 성실성"
    }
  ],
  compatibility_matrix: [
    {
      member_a: "prof_abc123",
      member_b: "prof_def456",
      compatibility_score: 0.78,
      synergies: ["보완적 강점"]
    }
  ]
}
```

### 4.5 MCP Tool: `analyze_relationship`

**대인관계 분석 도구** - 1:1 관계 분석

```typescript
// Tool 정의
{
  name: "analyze_relationship",
  description: "대인관계 분석 (호환성/소통방법/관계역학)",
  inputSchema: {
    type: "object",
    properties: {
      profile_id_a: { type: "string", description: "첫 번째 프로필 ID" },
      profile_id_b: { type: "string", description: "두 번째 프로필 ID" },
      analysis_type: {
        type: "string",
        enum: [
          "compatibility",        // 호환성 분석
          "communication_style",  // 소통 방법
          "dynamics"              // 관계 역학
        ]
      },
      options: { type: "object" }
    },
    required: ["profile_id_a", "profile_id_b", "analysis_type"]
  }
}

// 사용 예시
analyze_relationship({
  profile_id_a: "prof_abc123",
  profile_id_b: "prof_def456",
  analysis_type: "compatibility"
})

// Response
{
  compatibility_score: 0.78,
  strengths: ["보완적 관점", "공통 목표 지향"],
  challenges: ["소통 스타일 차이", "결정 속도"],
  recommendations: [
    "정기적인 1:1 미팅",
    "명확한 역할 분담"
  ]
}
```

## 5. 데이터 저장 전략

### 5.1 파일 시스템 기반 저장소
```typescript
// 디렉토리 구조
~/.big5/
├── profiles/           # 프로필 JSON 파일들
│   ├── prof_abc123.json
│   ├── prof_def456.json
│   └── prof_ghi789.json
├── surveys/            # 진행 중인 검사 세션
│   ├── survey_abc123.json
│   └── survey_def456.json
└── config.json         # 서버 설정
```

### 5.2 데이터 관리자
```typescript
class ProfileManager {
  private profileCache = new Map<string, Profile>();
  private surveyCache = new Map<string, SurveySession>();
  private profilePath = path.join(homedir(), '.big5/profiles');
  private surveyPath = path.join(homedir(), '.big5/surveys');

  // 프로필 관리
  async saveProfile(profile: Profile): Promise<void> {
    const filePath = path.join(this.profilePath, `${profile.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(profile, null, 2));
    this.profileCache.set(profile.id, profile);
    this.registerProfileResource(profile);
  }

  async getProfile(id: string): Promise<Profile | null> {
    if (this.profileCache.has(id)) {
      return this.profileCache.get(id)!;
    }

    const filePath = path.join(this.profilePath, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const profile = JSON.parse(data);
    this.profileCache.set(id, profile);
    return profile;
  }

  // 검사 세션 관리
  async saveSurveySession(session: SurveySession): Promise<void> {
    const filePath = path.join(this.surveyPath, `${session.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(session, null, 2));
    this.surveyCache.set(session.id, session);
  }

  async getSurveySession(id: string): Promise<SurveySession | null> {
    if (this.surveyCache.has(id)) {
      return this.surveyCache.get(id)!;
    }

    const filePath = path.join(this.surveyPath, `${id}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const session = JSON.parse(data);
      this.surveyCache.set(id, session);
      return session;
    } catch {
      return null;
    }
  }

  async deleteSurveySession(id: string): Promise<void> {
    const filePath = path.join(this.surveyPath, `${id}.json`);
    await fs.unlink(filePath);
    this.surveyCache.delete(id);
  }

  private registerProfileResource(profile: Profile): void {
    server.resource({
      uri: `big5://profile/${profile.id}`,
      name: `${profile.name}의 Big5 프로필`,
      mimeType: 'application/json',
      text: JSON.stringify(profile, null, 2)
    });
  }
}
```

### 5.3 저장 방식의 장점
- ✅ **영구 보관**: 파일 시스템에 JSON 형식으로 저장
- ✅ **빠른 조회**: 메모리 캐시로 성능 최적화
- ✅ **Claude 통합**: MCP 리소스로 자동 등록
- ✅ **세션 관리**: 검사 중단 후 재개 가능
- ✅ **사용자 제어**: 파일 직접 편집/백업/공유 가능
- ✅ **이식성**: 간단한 파일 복사로 프로필 이동
- ✅ **외부 의존성 없음**: DB 없이 독립 실행

## 6. MCP 서버 구현 상세

### 6.1 MCP 표준 준수
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "big5-consulting-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool 등록
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "manage_survey",
      description: "Big 5 성격검사 세션 관리",
      inputSchema: { /* ... */ }
    },
    {
      name: "manage_profile",
      description: "프로필 CRUD 관리",
      inputSchema: { /* ... */ }
    },
    {
      name: "analyze_individual",
      description: "개인 성격 분석",
      inputSchema: { /* ... */ }
    },
    {
      name: "analyze_team",
      description: "팀 구성 및 역학 분석",
      inputSchema: { /* ... */ }
    },
    {
      name: "analyze_relationship",
      description: "대인관계 분석",
      inputSchema: { /* ... */ }
    }
  ]
}));

// Tool 실행
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "manage_survey":
      return await handleSurveyManagement(args);
    case "manage_profile":
      return await handleProfileManagement(args);
    case "analyze_individual":
      return await handleIndividualAnalysis(args);
    case "analyze_team":
      return await handleTeamAnalysis(args);
    case "analyze_relationship":
      return await handleRelationshipAnalysis(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 서버 시작
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 6.2 기술 스택
- **언어**: TypeScript
- **MCP SDK**: @modelcontextprotocol/sdk (공식 SDK)
- **데이터 저장**: 파일 시스템 (JSON) + 메모리 캐시
- **분석 엔진**: 규칙 기반 + ML 모델

### 6.3 MCP Tool 최적화
**총 5개 Tools**로 모든 기능 제공 (기존 20+ 함수 → 5개 통합)
- `manage_survey`: 검사 관리 (4개 작업 통합)
- `manage_profile`: 프로필 관리 (5개 작업 통합)
- `analyze_individual`: 개인 분석 (6개 분석 통합)
- `analyze_team`: 팀 분석 (5개 분석 통합)
- `analyze_relationship`: 관계 분석 (3개 분석 통합)

### 6.4 분석 로직
```typescript
// 의사결정 트리 기반 추론
interface DecisionRule {
  condition: (scores: Big5Scores) => boolean
  outcome: string
  confidence: number
}

// 예시
const careerRules: DecisionRule[] = [
  {
    condition: (s) => s.openness > 70 && s.conscientiousness > 70,
    outcome: "researcher",
    confidence: 0.85
  },
  // ...
]
```

## 7. 구현 단계

### Phase 1: MVP (2주)
- [ ] MCP 표준 SDK 설정 및 서버 초기화
- [ ] 5개 MCP Tools 스켈레톤 구현
- [ ] 파일 시스템 기반 프로필/세션 저장소 구축
- [ ] `manage_survey` tool 구현 (start/submit 작업)
- [ ] `manage_profile` tool 구현 (create/get/list 작업)
- [ ] 점수 계산 로직 (역채점 포함)
- [ ] `analyze_individual` tool - 성격 분석 기능
- [ ] `analyze_individual` tool - 커리어 추천 (규칙 기반)

### Phase 2: 팀 기능 (2주)
- [ ] `manage_survey` - 재개/진행상태 작업 추가
- [ ] `manage_profile` - update/delete 작업 추가
- [ ] MCP 리소스 등록 기능 (프로필 자동 노출)
- [ ] `analyze_team` tool - 팀 구성 분석
- [ ] `analyze_team` tool - 역할 배분
- [ ] `analyze_relationship` tool - 호환성 분석

### Phase 3: 고급 기능 (3주)
- [ ] `analyze_individual` - 학습 스타일 분석
- [ ] `analyze_individual` - 스트레스 관리 전략
- [ ] `analyze_individual` - 강점/약점 분석
- [ ] `analyze_individual` - 자기계발 전략
- [ ] `analyze_team` - 갈등 예측, 커뮤니케이션, 협업 전략
- [ ] `analyze_relationship` - 소통방법, 관계역학 분석
- [ ] 프로필 백업/복원 기능

### Phase 4: 최적화 (1주)
- [ ] MCP 도구 응답 시간 최적화
- [ ] 파일 I/O 성능 최적화 (배치 처리)
- [ ] 동시성 제어 (파일 잠금)
- [ ] 에러 핸들링 및 재시도 로직
- [ ] MCP 서버 문서화 (usage examples)
- [ ] 테스트 커버리지 80%+

## 8. 품질 기준

### 8.1 정확도
- 커리어 추천 만족도 > 80%
- 팀 구성 예측 정확도 > 75%
- 질문지 신뢰도 (Cronbach's Alpha) > 0.70

### 8.2 성능
- MCP Tool 호출 응답 시간 < 200ms (p95)
- 캐시 히트율 > 90%
- 파일 I/O 최적화 (배치 처리)
- Tool 수: 5개 (최소화로 Claude 호출 효율성 향상)

### 8.3 안정성
- 파일 저장 오류 복구 메커니즘
- 동시 쓰기 충돌 방지
- 자동 백업 (일일)

### 8.4 사용성
- MCP Tool 문서 완성도 100%
- 각 Tool 사용 예제 제공
- 프로필 가져오기/내보내기 기능
- Claude Desktop 통합 가이드

## 9. 확장 가능성

### 9.1 미래 기능
- 시계열 분석 (성격 변화 추적)
- 조직 문화 분석
- 채용 후보 매칭
- 멘토-멘티 매칭
- 클라우드 동기화 (선택적)

### 9.2 통합
- HR 시스템 연동
- Slack/Teams 봇
- 학습 플랫폼 연동

## 10. 성공 지표

- 프로필 생성 건수
- MCP Tool 호출 성공률 > 99.5%
- 파일 저장 성공률 > 99.9%
- 사용자 추천 만족도
- 질문지 완료율 > 85%
- Claude Desktop 통합 성공률

---

## 부록: 샘플 워크플로우

### A. 개인 사용자 (MCP Tool 사용)
```
1. manage_survey(action: "start", name: "홍길동")
   → session_abc123, 첫 5문항 제시

2. manage_survey(action: "submit", session_id: "...", answers: [4,5,3,4,5])
   → 다음 5문항 (진행률: 5/50)

3. manage_survey(action: "submit", session_id: "...", answers: [2,2,1,2,3])
   → 개방성 완료, 성실성 시작 (10/50)

4. ... 반복 (총 10회)

5. 완료 → prof_abc123 자동 생성

6. analyze_individual(profile_id: "prof_abc123", analysis_type: "personality")
   → 성격 특성 분석

7. analyze_individual(profile_id: "prof_abc123", analysis_type: "career")
   → 커리어 추천

8. analyze_individual(profile_id: "prof_abc123", analysis_type: "development")
   → 자기계발 전략
```

### A-2. 검사 중단 후 재개
```
1. manage_survey(action: "start", name: "홍길동")
2. manage_survey(action: "submit", session_id: "...", answers: [4,5,3,4,5])
3. [나중에 재개]
4. manage_survey(action: "resume", session_id: "...")
5. manage_survey(action: "submit", session_id: "...", answers: [2,2,1,2,3])
```

### B. 팀 리더 (MCP Tool 사용)
```
1. 팀원들 프로필 생성
   manage_profile(action: "create", ...) × N

2. analyze_team(profile_ids: [...], analysis_type: "composition")
   → 팀 역학 이해

3. analyze_team(profile_ids: [...], analysis_type: "role_assignment")
   → 최적 역할 배치

4. analyze_team(profile_ids: [...], analysis_type: "conflict_prediction")
   → 사전 리스크 관리
```

### C. Claude Desktop 통합
```
1. manage_profile(action: "get", profile_id: "prof_abc123")
   → MCP 리소스로 자동 노출 (big5://profile/prof_abc123)

2. Claude가 프로필 컨텍스트 자동 인식

3. analyze_individual()로 필요 시 추가 분석
```
