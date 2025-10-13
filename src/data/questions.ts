import { Question } from '../types';

/**
 * Big 5 성격검사 질문지 (총 50문항)
 * 각 특성당 10문항 (정방향 5개, 역방향 5개)
 */
interface QuestionWithTrait extends Question {
  trait: string;
  trait_index: number; // 해당 특성 내에서의 인덱스 (0-9)
}

// 30문항 간략 버전 (각 특성당 6문항 - 6개 하위요인 × 1문항)
const SHORT_QUESTIONS: QuestionWithTrait[] = [
  // Openness (개방성) - 6개 하위요인
  { number: 1, text: '새로운 아이디어와 경험에 흥미를 느낀다', reverse_scored: false, trait: 'openness', trait_index: 0 },
  { number: 2, text: '상상력이 풍부하고 창의적이다', reverse_scored: false, trait: 'openness', trait_index: 1 },
  { number: 3, text: '예술 작품을 보며 깊은 감동을 느낀다', reverse_scored: false, trait: 'openness', trait_index: 2 },
  { number: 4, text: '여행지에서 현지 음식과 문화를 적극적으로 체험한다', reverse_scored: false, trait: 'openness', trait_index: 3 },
  { number: 5, text: '철학적이거나 심오한 대화를 즐긴다', reverse_scored: false, trait: 'openness', trait_index: 4 },
  { number: 6, text: '일상적인 루틴을 벗어나는 것이 불편하다', reverse_scored: true, trait: 'openness', trait_index: 5 },

  // Conscientiousness (성실성) - 6개 하위요인
  { number: 7, text: '복잡한 문제도 체계적으로 해결할 수 있다', reverse_scored: false, trait: 'conscientiousness', trait_index: 0 },
  { number: 8, text: '물건을 정해진 위치에 정리해두는 습관이 있다', reverse_scored: false, trait: 'conscientiousness', trait_index: 1 },
  { number: 9, text: '약속 시간 10분 전에는 항상 도착한다', reverse_scored: false, trait: 'conscientiousness', trait_index: 2 },
  { number: 10, text: '목표를 달성하기 위해 불편함을 감수할 수 있다', reverse_scored: false, trait: 'conscientiousness', trait_index: 3 },
  { number: 11, text: '유혹이 있어도 해야 할 일을 먼저 한다', reverse_scored: false, trait: 'conscientiousness', trait_index: 4 },
  { number: 12, text: '결정하기 전에 여러 가능성을 신중히 검토한다', reverse_scored: false, trait: 'conscientiousness', trait_index: 5 },

  // Extraversion (외향성) - 6개 하위요인
  { number: 13, text: '모임에서 여러 사람과 대화하는 것을 즐긴다', reverse_scored: false, trait: 'extraversion', trait_index: 0 },
  { number: 14, text: '그룹 토론에서 먼저 의견을 제시하는 편이다', reverse_scored: false, trait: 'extraversion', trait_index: 1 },
  { number: 15, text: '하루 종일 집에만 있으면 답답함을 느낀다', reverse_scored: false, trait: 'extraversion', trait_index: 2 },
  { number: 16, text: '새롭고 자극적인 경험을 찾아다닌다', reverse_scored: false, trait: 'extraversion', trait_index: 3 },
  { number: 17, text: '사람들과 함께 있으면 에너지가 충전된다', reverse_scored: false, trait: 'extraversion', trait_index: 4 },
  { number: 18, text: '처음 만난 사람과도 쉽게 친해진다', reverse_scored: false, trait: 'extraversion', trait_index: 5 },

  // Agreeableness (친화성) - 6개 하위요인
  { number: 19, text: '사람들의 말을 대부분 진심으로 받아들인다', reverse_scored: false, trait: 'agreeableness', trait_index: 0 },
  { number: 20, text: '솔직하게 내 생각을 표현하되 상대방을 배려한다', reverse_scored: false, trait: 'agreeableness', trait_index: 1 },
  { number: 21, text: '내 시간과 노력을 들여 다른 사람을 돕는다', reverse_scored: false, trait: 'agreeableness', trait_index: 2 },
  { number: 22, text: '의견 충돌 시 상대방 입장을 먼저 이해하려 한다', reverse_scored: false, trait: 'agreeableness', trait_index: 3 },
  { number: 23, text: '내 성과를 다른 사람과 나누는 것을 좋아한다', reverse_scored: false, trait: 'agreeableness', trait_index: 4 },
  { number: 24, text: '상대방의 감정을 빠르게 알아차린다', reverse_scored: false, trait: 'agreeableness', trait_index: 5 },

  // Neuroticism (신경성) - 6개 하위요인
  { number: 25, text: '중요한 일을 앞두면 불안해서 잠을 못 잔다', reverse_scored: false, trait: 'neuroticism', trait_index: 0 },
  { number: 26, text: '사소한 일에도 화가 나서 표현하는 편이다', reverse_scored: false, trait: 'neuroticism', trait_index: 1 },
  { number: 27, text: '실패하면 오랫동안 우울한 기분이 지속된다', reverse_scored: false, trait: 'neuroticism', trait_index: 2 },
  { number: 28, text: '다른 사람 앞에서 말할 때 실수할까 봐 걱정된다', reverse_scored: false, trait: 'neuroticism', trait_index: 3 },
  { number: 29, text: '화가 나면 생각하기 전에 행동한다', reverse_scored: false, trait: 'neuroticism', trait_index: 4 },
  { number: 30, text: '예상치 못한 문제가 생기면 당황한다', reverse_scored: false, trait: 'neuroticism', trait_index: 5 }
];

// 모든 질문을 하나의 배열로 관리 (랜덤 출제용 - 60문항 전체 버전)
const ALL_QUESTIONS: QuestionWithTrait[] = [
  // Openness (개방성) - 6가지 하위요인 × 2문항 = 12문항
  // 1. 상상력 (Fantasy)
  { number: 1, text: '새로운 아이디어와 경험에 흥미를 느낀다', reverse_scored: false, trait: 'openness', trait_index: 0 },
  { number: 2, text: '일상적인 루틴을 벗어나는 것이 불편하다', reverse_scored: true, trait: 'openness', trait_index: 1 },
  // 2. 심미성 (Aesthetics)
  { number: 3, text: '예술 작품을 보며 깊은 감동을 느낀다', reverse_scored: false, trait: 'openness', trait_index: 2 },
  { number: 4, text: '시나 소설보다는 실용서를 선호한다', reverse_scored: true, trait: 'openness', trait_index: 3 },
  // 3. 감정 (Feelings)
  { number: 5, text: '영화나 음악에 쉽게 감정이입한다', reverse_scored: false, trait: 'openness', trait_index: 4 },
  { number: 6, text: '감정 표현이 과한 사람들을 이해하기 어렵다', reverse_scored: true, trait: 'openness', trait_index: 5 },
  // 4. 행동 (Actions)
  { number: 7, text: '여행지에서 현지 음식과 문화를 적극적으로 체험한다', reverse_scored: false, trait: 'openness', trait_index: 6 },
  { number: 8, text: '검증된 방법만 사용하는 것이 안전하다고 생각한다', reverse_scored: true, trait: 'openness', trait_index: 7 },
  // 5. 아이디어 (Ideas)
  { number: 9, text: '철학적이거나 심오한 대화를 즐긴다', reverse_scored: false, trait: 'openness', trait_index: 8 },
  { number: 10, text: '복잡한 이론보다 실용적인 지식이 중요하다', reverse_scored: true, trait: 'openness', trait_index: 9 },
  // 6. 가치 (Values)
  { number: 11, text: '다양한 관점과 가치관을 존중한다', reverse_scored: false, trait: 'openness', trait_index: 10 },
  { number: 12, text: '전통적인 방식을 따르는 것이 바람직하다', reverse_scored: true, trait: 'openness', trait_index: 11 },

  // Conscientiousness (성실성) - 6가지 하위요인 × 2문항 = 12문항
  // 1. 유능감 (Competence)
  { number: 13, text: '복잡한 문제도 체계적으로 해결할 수 있다', reverse_scored: false, trait: 'conscientiousness', trait_index: 0 },
  { number: 14, text: '일을 시작하면 어떻게 해야 할지 막막할 때가 많다', reverse_scored: true, trait: 'conscientiousness', trait_index: 1 },
  // 2. 질서 (Order)
  { number: 15, text: '물건을 정해진 위치에 정리해두는 습관이 있다', reverse_scored: false, trait: 'conscientiousness', trait_index: 2 },
  { number: 16, text: '책상이나 작업 공간이 어질러져 있어도 신경 쓰이지 않는다', reverse_scored: true, trait: 'conscientiousness', trait_index: 3 },
  // 3. 책임감 (Dutifulness)
  { number: 17, text: '약속 시간 10분 전에는 항상 도착한다', reverse_scored: false, trait: 'conscientiousness', trait_index: 4 },
  { number: 18, text: '중요하지 않은 약속은 취소해도 괜찮다고 생각한다', reverse_scored: true, trait: 'conscientiousness', trait_index: 5 },
  // 4. 성취지향 (Achievement Striving)
  { number: 19, text: '목표를 달성하기 위해 불편함을 감수할 수 있다', reverse_scored: false, trait: 'conscientiousness', trait_index: 6 },
  { number: 20, text: '완벽하게 하려다 마감을 놓친 적이 있다', reverse_scored: true, trait: 'conscientiousness', trait_index: 7 },
  // 5. 자기훈련 (Self-Discipline)
  { number: 21, text: '유혹이 있어도 해야 할 일을 먼저 한다', reverse_scored: false, trait: 'conscientiousness', trait_index: 8 },
  { number: 22, text: '어려운 과제는 다음으로 미루는 편이다', reverse_scored: true, trait: 'conscientiousness', trait_index: 9 },
  // 6. 신중함 (Deliberation)
  { number: 23, text: '결정하기 전에 여러 가능성을 신중히 검토한다', reverse_scored: false, trait: 'conscientiousness', trait_index: 10 },
  { number: 24, text: '충분히 생각하기 전에 먼저 행동하는 편이다', reverse_scored: true, trait: 'conscientiousness', trait_index: 11 },

  // Extraversion (외향성) - 6가지 하위요인 × 2문항 = 12문항
  // 1. 사교성 (Warmth)
  { number: 25, text: '처음 만난 사람과도 쉽게 친해진다', reverse_scored: false, trait: 'extraversion', trait_index: 0 },
  { number: 26, text: '낯선 사람과 대화하는 것이 부담스럽다', reverse_scored: true, trait: 'extraversion', trait_index: 1 },
  // 2. 사회성 (Gregariousness)
  { number: 27, text: '모임에서 여러 사람과 대화하는 것을 즐긴다', reverse_scored: false, trait: 'extraversion', trait_index: 2 },
  { number: 28, text: '혼자만의 시간을 가지는 것이 중요하다', reverse_scored: true, trait: 'extraversion', trait_index: 3 },
  // 3. 주장성 (Assertiveness)
  { number: 29, text: '그룹 토론에서 먼저 의견을 제시하는 편이다', reverse_scored: false, trait: 'extraversion', trait_index: 4 },
  { number: 30, text: '모임에서 조용히 관찰하는 편이다', reverse_scored: true, trait: 'extraversion', trait_index: 5 },
  // 4. 활동성 (Activity)
  { number: 31, text: '하루 종일 집에만 있으면 답답함을 느낀다', reverse_scored: false, trait: 'extraversion', trait_index: 6 },
  { number: 32, text: '차분하고 느긋한 활동을 선호한다', reverse_scored: true, trait: 'extraversion', trait_index: 7 },
  // 5. 자극추구 (Excitement-Seeking)
  { number: 33, text: '새롭고 자극적인 경험을 찾아다닌다', reverse_scored: false, trait: 'extraversion', trait_index: 8 },
  { number: 34, text: '평온하고 조용한 환경을 더 좋아한다', reverse_scored: true, trait: 'extraversion', trait_index: 9 },
  // 6. 긍정적 정서 (Positive Emotions)
  { number: 35, text: '사람들과 함께 있으면 에너지가 충전된다', reverse_scored: false, trait: 'extraversion', trait_index: 10 },
  { number: 36, text: '사교 모임 후에는 휴식이 필요하다', reverse_scored: true, trait: 'extraversion', trait_index: 11 },

  // Agreeableness (친화성) - 6가지 하위요인 × 2문항 = 12문항
  // 1. 신뢰 (Trust)
  { number: 37, text: '사람들의 말을 대부분 진심으로 받아들인다', reverse_scored: false, trait: 'agreeableness', trait_index: 0 },
  { number: 38, text: '사람들의 숨겨진 의도를 파악하려 한다', reverse_scored: true, trait: 'agreeableness', trait_index: 1 },
  // 2. 솔직함 (Straightforwardness)
  { number: 39, text: '솔직하게 내 생각을 표현하되 상대방을 배려한다', reverse_scored: false, trait: 'agreeableness', trait_index: 2 },
  { number: 40, text: '내게 유리하도록 상황을 조작할 때가 있다', reverse_scored: true, trait: 'agreeableness', trait_index: 3 },
  // 3. 이타심 (Altruism)
  { number: 41, text: '내 시간과 노력을 들여 다른 사람을 돕는다', reverse_scored: false, trait: 'agreeableness', trait_index: 4 },
  { number: 42, text: '다른 사람의 고민을 듣는 것이 부담스럽다', reverse_scored: true, trait: 'agreeableness', trait_index: 5 },
  // 4. 순응성 (Compliance)
  { number: 43, text: '의견 충돌 시 상대방 입장을 먼저 이해하려 한다', reverse_scored: false, trait: 'agreeableness', trait_index: 6 },
  { number: 44, text: '논쟁에서 이기는 것이 중요하다', reverse_scored: true, trait: 'agreeableness', trait_index: 7 },
  // 5. 겸손 (Modesty)
  { number: 45, text: '내 성과를 다른 사람과 나누는 것을 좋아한다', reverse_scored: false, trait: 'agreeableness', trait_index: 8 },
  { number: 46, text: '내가 다른 사람보다 뛰어나다고 생각한다', reverse_scored: true, trait: 'agreeableness', trait_index: 9 },
  // 6. 공감 (Tender-Mindedness)
  { number: 47, text: '상대방의 감정을 빠르게 알아차린다', reverse_scored: false, trait: 'agreeableness', trait_index: 10 },
  { number: 48, text: '감정보다 논리가 더 중요하다고 생각한다', reverse_scored: true, trait: 'agreeableness', trait_index: 11 },

  // Neuroticism (신경성) - 6가지 하위요인 × 2문항 = 12문항
  // 1. 불안 (Anxiety)
  { number: 49, text: '중요한 일을 앞두면 불안해서 잠을 못 잔다', reverse_scored: false, trait: 'neuroticism', trait_index: 0 },
  { number: 50, text: '걱정거리가 있어도 일상생활에 영향을 받지 않는다', reverse_scored: true, trait: 'neuroticism', trait_index: 1 },
  // 2. 분노/적대감 (Angry Hostility)
  { number: 51, text: '사소한 일에도 화가 나서 표현하는 편이다', reverse_scored: false, trait: 'neuroticism', trait_index: 2 },
  { number: 52, text: '화가 나도 침착하게 대처한다', reverse_scored: true, trait: 'neuroticism', trait_index: 3 },
  // 3. 우울 (Depression)
  { number: 53, text: '실패하면 오랫동안 우울한 기분이 지속된다', reverse_scored: false, trait: 'neuroticism', trait_index: 4 },
  { number: 54, text: '어려운 상황에서도 긍정적인 면을 찾는다', reverse_scored: true, trait: 'neuroticism', trait_index: 5 },
  // 4. 자의식 (Self-Consciousness)
  { number: 55, text: '다른 사람 앞에서 말할 때 실수할까 봐 걱정된다', reverse_scored: false, trait: 'neuroticism', trait_index: 6 },
  { number: 56, text: '비판을 받아도 감정적으로 흔들리지 않는다', reverse_scored: true, trait: 'neuroticism', trait_index: 7 },
  // 5. 충동성 (Impulsiveness)
  { number: 57, text: '화가 나면 생각하기 전에 행동한다', reverse_scored: false, trait: 'neuroticism', trait_index: 8 },
  { number: 58, text: '감정이 격해져도 통제할 수 있다', reverse_scored: true, trait: 'neuroticism', trait_index: 9 },
  // 6. 취약성 (Vulnerability)
  { number: 59, text: '예상치 못한 문제가 생기면 당황한다', reverse_scored: false, trait: 'neuroticism', trait_index: 10 },
  { number: 60, text: '스트레스를 받아도 빠르게 회복한다', reverse_scored: true, trait: 'neuroticism', trait_index: 11 }
];

// 하위 호환성을 위한 특성별 질문 (기존 코드용)
export const QUESTIONS: Record<string, Question[]> = {
  openness: ALL_QUESTIONS.filter(q => q.trait === 'openness'),
  conscientiousness: ALL_QUESTIONS.filter(q => q.trait === 'conscientiousness'),
  extraversion: ALL_QUESTIONS.filter(q => q.trait === 'extraversion'),
  agreeableness: ALL_QUESTIONS.filter(q => q.trait === 'agreeableness'),
  neuroticism: ALL_QUESTIONS.filter(q => q.trait === 'neuroticism')
};

/**
 * 랜덤하게 5개 질문 선택
 * @param answered_count 이미 답변한 질문 수 (0-60 or 0-30)
 * @param short_version true일 경우 30문항 간략 버전 사용
 * @returns 5개 질문 배열 (질문 번호, 텍스트만 포함)
 */
export function getRandomQuestions(answered_count: number, short_version: boolean = false): Question[] {
  const questionPool = short_version ? SHORT_QUESTIONS : ALL_QUESTIONS;
  const maxQuestions = short_version ? 30 : 60;

  // 이미 모든 질문에 답변한 경우 빈 배열 반환
  if (answered_count >= maxQuestions) {
    return [];
  }

  // 전체 질문을 랜덤하게 섞음
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);

  // 이미 답변한 질문은 제외하고 5개 선택 (또는 남은 질문 수만큼)
  const startIndex = answered_count;
  const batchSize = Math.min(5, maxQuestions - answered_count);
  const batch = shuffled.slice(startIndex, startIndex + batchSize);

  // 측정 항목(trait) 정보를 제외하고 반환
  return batch.map(q => ({
    number: q.number,
    text: q.text,
    reverse_scored: q.reverse_scored
  }));
}

/**
 * 간략 버전(30문항) 전체 질문 반환
 * @returns 30개 질문 배열 (랜덤 순서)
 */
export function getShortQuestions(): Question[] {
  // 30문항을 랜덤하게 섞음
  const shuffled = [...SHORT_QUESTIONS].sort(() => Math.random() - 0.5);

  // 측정 항목(trait) 정보를 제외하고 반환
  return shuffled.map(q => ({
    number: q.number,
    text: q.text,
    reverse_scored: q.reverse_scored
  }));
}

/**
 * 질문 번호로 특성과 인덱스 찾기
 * @param question_number 질문 번호 (1-50 or 1-15)
 * @param short_version true일 경우 15문항 간략 버전에서 검색
 * @returns 특성명과 특성 내 인덱스
 */
export function getQuestionInfo(question_number: number, short_version: boolean = false): { trait: string; trait_index: number } | null {
  const questionPool = short_version ? SHORT_QUESTIONS : ALL_QUESTIONS;
  const question = questionPool.find(q => q.number === question_number);
  if (!question) return null;

  return {
    trait: question.trait,
    trait_index: question.trait_index
  };
}

/**
 * 특성별 질문을 배치로 나누기 (각 5문항씩)
 * @deprecated 랜덤 출제를 위해 getRandomQuestions 사용 권장
 */
export function getQuestionBatch(trait: string, batch: 1 | 2): Question[] {
  const questions = QUESTIONS[trait];
  if (!questions) return [];

  const startIndex = batch === 1 ? 0 : 5;
  return questions.slice(startIndex, startIndex + 5);
}

/**
 * 응답 데이터를 특성별로 매핑
 * @param answers 질문 번호를 키로 가지는 응답 맵 { 1: 4, 2: 5, ... }
 * @param short_version true일 경우 30문항 간략 버전 (각 특성당 6개)
 * @returns 특성별로 정리된 응답
 */
export function mapAnswersToTraits(
  answers: Record<number, number>,
  short_version: boolean = false
): Partial<{
  openness: number[];
  conscientiousness: number[];
  extraversion: number[];
  agreeableness: number[];
  neuroticism: number[];
}> {
  const arraySize = short_version ? 6 : 12;
  const mapped: any = {
    openness: new Array(arraySize).fill(null),
    conscientiousness: new Array(arraySize).fill(null),
    extraversion: new Array(arraySize).fill(null),
    agreeableness: new Array(arraySize).fill(null),
    neuroticism: new Array(arraySize).fill(null)
  };

  // 각 응답을 해당 특성의 올바른 인덱스에 배치
  for (const [questionNum, answer] of Object.entries(answers)) {
    const info = getQuestionInfo(Number(questionNum), short_version);
    if (info) {
      mapped[info.trait][info.trait_index] = answer;
    }
  }

  // null이 없는(완료된) 특성만 반환
  const result: any = {};
  for (const [trait, values] of Object.entries(mapped)) {
    if (Array.isArray(values) && values.every((v: number | null) => v !== null)) {
      result[trait] = values;
    }
  }

  return result;
}

/**
 * 점수 계산 함수
 * @param responses 특성별 응답 배열
 * @returns 특성별 점수 (0-100)
 */
export function calculateScores(responses: Partial<{
  openness: number[];
  conscientiousness: number[];
  extraversion: number[];
  agreeableness: number[];
  neuroticism: number[];
}>): Partial<{
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}> {
  const scores: any = {};
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];

  for (const trait of traits) {
    const answers = responses[trait as keyof typeof responses];
    // 12문항 (전체) 또는 6문항 (간략)
    if (!answers || (answers.length !== 12 && answers.length !== 6)) continue;

    // 역채점 문항 인덱스
    // 12문항: 홀수 인덱스 (1, 3, 5, 7, 9, 11)
    // 6문항: 5번 인덱스만 (마지막 문항)
    const reverseIndices = answers.length === 12 ? [1, 3, 5, 7, 9, 11] : [5];

    // 점수 계산
    const scored = answers.map((value, index) => {
      return reverseIndices.includes(index) ? 6 - value : value;
    });

    // 평균 계산 후 0-100 스케일로 변환
    const average = scored.reduce((a, b) => a + b, 0) / scored.length;
    scores[trait] = Math.round((average - 1) * 25); // 1-5 → 0-100
  }

  return scores;
}
