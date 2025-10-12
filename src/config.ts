/**
 * 서버 환경 설정
 */
export interface ServerConfig {
  /**
   * 로딩 전략 설정
   * - true: Lazy Loading - 첫 tool 호출 시 모든 도구를 한번에 로드
   * - false: On-Demand Loading - 각 tool 호출 시 해당 도구만 개별적으로 로드 (기본값)
   */
  lazyLoadSchemas: boolean;
}

/**
 * 환경변수 검증 및 설정 로드
 * @returns 서버 설정 객체
 */
export function loadConfig(): ServerConfig {
  const lazyLoadEnv = process.env.BIG5_LAZY_LOAD_SCHEMAS;

  // 환경변수 검증
  if (lazyLoadEnv !== undefined && lazyLoadEnv !== 'true' && lazyLoadEnv !== 'false') {
    console.error(
      `Warning: Invalid value for BIG5_LAZY_LOAD_SCHEMAS: "${lazyLoadEnv}". ` +
      `Expected "true" or "false". Using default (false - On-Demand Loading).`
    );
  }

  const config: ServerConfig = {
    lazyLoadSchemas: lazyLoadEnv === 'true'
  };

  return config;
}

/**
 * 전역 설정 인스턴스
 */
export const config = loadConfig();
