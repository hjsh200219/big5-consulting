import { Question } from '../types';

// Big 5 성격검사 질문지 (총 50문항)
export const QUESTIONS: Record<string, Question[]> = {
  openness: [
    { number: 1, text: '새로운 아이디어와 경험에 흥미를 느낀다', reverse_scored: false },
    { number: 2, text: '상상력이 풍부하고 창의적이다', reverse_scored: false },
    { number: 3, text: '예술, 음악, 문학에 관심이 많다', reverse_scored: false },
    { number: 4, text: '추상적이고 철학적인 주제를 즐긴다', reverse_scored: false },
    { number: 5, text: '다양한 문화와 가치관을 이해하려 노력한다', reverse_scored: false },
    { number: 6, text: '익숙한 방식을 선호하고 변화를 싫어한다 (R)', reverse_scored: true },
    { number: 7, text: '상상력보다 현실적인 것을 중시한다 (R)', reverse_scored: true },
    { number: 8, text: '예술적인 활동에는 별 관심이 없다 (R)', reverse_scored: true },
    { number: 9, text: '복잡한 이론이나 개념은 피하고 싶다 (R)', reverse_scored: true },
    { number: 10, text: '전통적인 가치관을 고수하는 편이다 (R)', reverse_scored: true }
  ],
  conscientiousness: [
    { number: 1, text: '계획을 세우고 체계적으로 일을 처리한다', reverse_scored: false },
    { number: 2, text: '맡은 일은 책임감 있게 완수한다', reverse_scored: false },
    { number: 3, text: '시간 약속을 잘 지키고 준비를 철저히 한다', reverse_scored: false },
    { number: 4, text: '목표 달성을 위해 꾸준히 노력한다', reverse_scored: false },
    { number: 5, text: '세부사항까지 꼼꼼하게 확인하는 편이다', reverse_scored: false },
    { number: 6, text: '일을 미루는 경향이 있다 (R)', reverse_scored: true },
    { number: 7, text: '정리정돈을 잘 못하고 물건을 자주 잃어버린다 (R)', reverse_scored: true },
    { number: 8, text: '계획 없이 즉흥적으로 행동하는 편이다 (R)', reverse_scored: true },
    { number: 9, text: '시작한 일을 끝까지 마치기 어렵다 (R)', reverse_scored: true },
    { number: 10, text: '대충대충 처리하는 경우가 많다 (R)', reverse_scored: true }
  ],
  extraversion: [
    { number: 1, text: '사람들과 어울리는 것을 즐긴다', reverse_scored: false },
    { number: 2, text: '새로운 사람을 만나는 것이 편하다', reverse_scored: false },
    { number: 3, text: '파티나 모임에서 활기차고 에너지가 넘친다', reverse_scored: false },
    { number: 4, text: '대화를 주도하고 적극적으로 의견을 말한다', reverse_scored: false },
    { number: 5, text: '주목받는 것을 즐기고 리더 역할을 선호한다', reverse_scored: false },
    { number: 6, text: '혼자 있는 시간이 더 편하다 (R)', reverse_scored: true },
    { number: 7, text: '많은 사람들과 함께 있으면 피곤하다 (R)', reverse_scored: true },
    { number: 8, text: '조용하고 침착한 편이다 (R)', reverse_scored: true },
    { number: 9, text: '먼저 대화를 시작하는 것이 어렵다 (R)', reverse_scored: true },
    { number: 10, text: '큰 모임보다 소규모 모임을 선호한다 (R)', reverse_scored: true }
  ],
  agreeableness: [
    { number: 1, text: '다른 사람의 감정에 공감을 잘한다', reverse_scored: false },
    { number: 2, text: '협력적이고 타협을 잘한다', reverse_scored: false },
    { number: 3, text: '남을 돕는 것에 기쁨을 느낀다', reverse_scored: false },
    { number: 4, text: '갈등 상황에서 평화적 해결을 추구한다', reverse_scored: false },
    { number: 5, text: '다른 사람을 신뢰하는 편이다', reverse_scored: false },
    { number: 6, text: '다른 사람의 의도를 의심하는 편이다 (R)', reverse_scored: true },
    { number: 7, text: '내 의견을 고집하고 타협하기 어렵다 (R)', reverse_scored: true },
    { number: 8, text: '비판적이고 냉소적인 태도를 보인다 (R)', reverse_scored: true },
    { number: 9, text: '경쟁적이고 남을 이기려는 마음이 강하다 (R)', reverse_scored: true },
    { number: 10, text: '다른 사람의 문제에 무관심한 편이다 (R)', reverse_scored: true }
  ],
  neuroticism: [
    { number: 1, text: '스트레스 상황에서 불안하고 걱정이 많다', reverse_scored: false },
    { number: 2, text: '기분이 자주 변하는 편이다', reverse_scored: false },
    { number: 3, text: '작은 일에도 쉽게 화가 나거나 짜증이 난다', reverse_scored: false },
    { number: 4, text: '부정적인 생각을 자주 한다', reverse_scored: false },
    { number: 5, text: '실수나 실패에 대한 두려움이 크다', reverse_scored: false },
    { number: 6, text: '대부분의 상황에서 침착하고 차분하다 (R)', reverse_scored: true },
    { number: 7, text: '감정적으로 안정되어 있고 동요하지 않는다 (R)', reverse_scored: true },
    { number: 8, text: '스트레스를 잘 관리하고 빨리 회복한다 (R)', reverse_scored: true },
    { number: 9, text: '걱정이 적고 낙관적이다 (R)', reverse_scored: true },
    { number: 10, text: '압박 상황에서도 평정심을 유지한다 (R)', reverse_scored: true }
  ]
};

// 특성별 질문을 배치로 나누기 (각 5문항씩)
export function getQuestionBatch(trait: string, batch: 1 | 2): Question[] {
  const questions = QUESTIONS[trait];
  if (!questions) return [];

  const startIndex = batch === 1 ? 0 : 5;
  return questions.slice(startIndex, startIndex + 5);
}

// 점수 계산 함수
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
    if (!answers || answers.length !== 10) continue;

    // 역채점 문항 인덱스 (6-10번 = 인덱스 5-9)
    const reverseIndices = [5, 6, 7, 8, 9];

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
