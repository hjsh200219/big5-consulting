# Big 5 Personality Consulting MCP Server

Claude Desktop용 Big 5 성격검사 및 종합 컨설팅 MCP 서버

## 기능 개요

### 5가지 MCP Tools

#### 1. manage_survey - 성격검사 관리
- **start**: 검사 시작 (첫 5문항 제공)
- **submit**: 답변 제출 (5문항씩 배치)
- **resume**: 중단된 검사 재개
- **progress**: 진행 상황 확인

#### 2. manage_profile - 프로필 관리
- **create**: 프로필 생성
- **get**: 프로필 조회
- **update**: 프로필 수정
- **delete**: 프로필 삭제
- **list**: 전체 프로필 목록

#### 3. analyze_individual - 개인 분석
- **personality**: 전반적 성격 분석
- **strengths_weaknesses**: 강점과 약점 분석
- **career**: 직업 추천 및 커리어 조언
- **development**: 자기계발 전략
- **learning_style**: 학습 스타일 분석
- **stress_management**: 스트레스 관리 전략

#### 4. analyze_team - 팀 분석
- **composition**: 팀 구성 분석 (다양성, 균형)
- **roles**: 역할 배분 추천
- **conflicts**: 갈등 예측 및 예방
- **communication**: 소통 스타일 분석
- **collaboration**: 협업 전략 제안

#### 5. analyze_relationship - 관계 분석
- **compatibility**: 호환성 분석 (업무/개인/연애)
- **communication_style**: 소통 방법 제안
- **dynamics**: 관계 역학 분석 (권력, 영향력, 의사결정)

## 설치

```bash
npm install
npm run build
```

## Claude Desktop 설정

`~/Library/Application Support/Claude/claude_desktop_config.json` 파일에 다음 내용을 추가:

### 기본 설정 (On-Demand Loading)

```json
{
  "mcpServers": {
    "big5": {
      "command": "node",
      "args": [
        "/Users/hoshin/workspace/big5-consulting/dist/index.js"
      ]
    }
  }
}
```

### Lazy Loading 모드 사용 (선택)

모든 도구를 첫 호출 시 한번에 로드하려면:

```json
{
  "mcpServers": {
    "big5": {
      "command": "node",
      "args": [
        "/Users/hoshin/workspace/big5-consulting/dist/index.js"
      ],
      "env": {
        "BIG5_LAZY_LOAD_SCHEMAS": "true"
      }
    }
  }
}
```

설정 후 Claude Desktop을 재시작하세요.

## 사용 예시

### 1. 성격검사 진행

**검사 시작:**
```
검사를 시작하고 싶어요. 제 이름은 홍길동입니다.
```

Claude가 자동으로 `manage_survey` 도구를 사용하여 첫 5문항을 제공합니다.

**답변 제출:**
```
4,5,3,4,5
```

5개의 답변을 쉼표로 구분하여 입력하면, 다음 배치로 이동하거나 다음 특성 질문으로 넘어갑니다.

**검사 재개:**
```
이전에 진행하던 검사를 계속하고 싶어요. 세션 ID는 survey_xxx입니다.
```

**진행 상황 확인:**
```
현재 검사 진행 상황을 알려주세요.
```

### 2. 개인 분석

**성격 분석:**
```
제 성격을 분석해주세요. (프로필 ID: prof_xxx)
```

**강점과 약점:**
```
제 강점과 약점을 알려주세요.
```

**직업 추천:**
```
저에게 맞는 직업을 추천해주세요. 현재 IT 업계에서 일하고 있습니다.
```

**학습 스타일:**
```
제 학습 스타일을 분석해주세요.
```

**스트레스 관리:**
```
스트레스를 관리하는 방법을 추천해주세요.
```

### 3. 팀 분석

**팀 구성 분석:**
```
우리 팀의 구성을 분석해주세요.
프로필 ID: prof_001, prof_002, prof_003, prof_004
```

**역할 배분:**
```
이 프로젝트에서 각 팀원의 역할을 추천해주세요.
프로젝트 유형: 신제품 개발
```

**갈등 예측:**
```
팀 내 갈등 가능성을 분석해주세요.
```

**협업 전략:**
```
우리 팀의 협업을 개선할 방법을 제안해주세요.
```

### 4. 관계 분석

**호환성 분석:**
```
저와 제 동료의 업무 호환성을 분석해주세요.
프로필 A: prof_001
프로필 B: prof_002
맥락: work
```

**소통 방법:**
```
우리 둘의 소통 방법을 제안해주세요.
```

**관계 역학:**
```
멘토-멘티 관계의 역학을 분석해주세요.
```

## 데이터 저장

모든 데이터는 `~/.big5/` 디렉토리에 JSON 파일로 저장됩니다:

```
~/.big5/
├── profiles/           # 완료된 프로필
│   ├── prof_abc123.json
│   └── prof_def456.json
└── surveys/            # 진행 중인 검사 세션
    ├── survey_abc123.json
    └── survey_def456.json
```

### 데이터 백업
```bash
# 프로필 백업
cp -r ~/.big5/profiles ~/backup/big5-profiles-$(date +%Y%m%d)

# 전체 백업
tar -czf ~/backup/big5-backup-$(date +%Y%m%d).tar.gz ~/.big5
```

## 개발

```bash
# 개발 모드 실행 (자동 재시작)
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 기술 스택

- **언어**: TypeScript
- **MCP SDK**: @modelcontextprotocol/sdk v1.20.0
- **저장소**: 파일 시스템 (JSON) + 메모리 캐시
- **분석 엔진**: 규칙 기반 의사결정 트리
- **아키텍처**: On-Demand Loading 패턴 (Dynamic Import)

## 성능 최적화

### 로딩 전략 선택

#### 1. On-Demand Loading (기본값, 권장)
```bash
BIG5_LAZY_LOAD_SCHEMAS=false  # 또는 설정하지 않음
```
- **개별 로드**: 각 도구는 **실제 호출될 때만** 동적 import
- **메모리 효율**: 미사용 도구는 절대 로드 안됨
- **적합한 경우**: 특정 도구만 주로 사용하는 경우 (예: survey만)

**성능 지표:**
- 서버 시작: < 50ms
- 첫 도구 호출: 50-100ms (import), 이후 < 10ms
- 메모리: 기본 ~30MB, 도구당 +10-15MB

#### 2. Lazy Loading (선택적)
```bash
BIG5_LAZY_LOAD_SCHEMAS=true
```
- **일괄 로드**: 첫 tool 호출 시 **모든 5개 도구를 한번에** 로드
- **빠른 후속 호출**: 모든 도구가 메모리에 있어 즉시 실행
- **적합한 경우**: 모든 도구를 골고루 사용하는 경우

**성능 지표:**
- 서버 시작: < 50ms
- 첫 호출: 100-150ms (모든 도구 import), 이후 < 10ms
- 메모리: 첫 호출 후 즉시 ~100MB

### 공통 성능 지표
- Tool 응답 시간: < 200ms (p95)
- 캐시 히트율: > 90%
- 동시 사용자: 지원
- 파일 I/O: 최적화된 배치 처리

## 라이선스

ISC

## 문의 및 기여

이슈와 PR은 GitHub 저장소에서 환영합니다.
