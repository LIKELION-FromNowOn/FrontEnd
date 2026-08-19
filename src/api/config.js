/**
 * API 설정.
 *
 * 값은 .env 로 넣는다 (.env.example 참고).
 *
 * 실연동 여부는 여기가 아니라 live.js 에서 **엔드포인트별로** 켠다.
 * 전역 스위치 하나로 두면 서버에 몇 건밖에 없는 동안 켜는 순간 화면이 전부 깨진다.
 */

/**
 * 백엔드 주소. 끝의 / 는 떼서 저장한다.
 *
 * 명세서의 경로가 전부 `{BASE_URL}/api/v1/...` 이므로 **버전 접두사까지 포함해서** 넣는다.
 *   예: https://api.example.com/api/v1
 */
/**
 * .env 파일은 gitignore 대상이라 다른 사람 환경이나 배포 빌드에서 비어 있을 수 있다.
 * 비밀이 아닌 값이므로 기본값을 둬서 「환경변수를 안 넣어서 조용히 안 되는」 상황을 없앤다.
 * 도메인이 붙으면 .env.production 과 이 줄을 같이 바꾼다.
 */
const DEFAULT_BASE = 'http://1.201.116.42:8080/api/v1'

export const API_BASE = (import.meta.env.VITE_API_BASE || DEFAULT_BASE).replace(
  /\/$/,
  '',
)

/**
 * 구글 로그인 시작 주소.
 * ⚠️ 명세서에 OAuth 엔드포인트가 없다. 팀에서 넣기로 정하면 그때 쓴다. (api/auth.js 참고)
 */
export const GOOGLE_LOGIN_URL = import.meta.env.VITE_GOOGLE_LOGIN_URL ?? ''

/** 설정이 빠졌을 때 화면에서 조용히 실패하지 않도록 알려준다. */
export function assertConfigured(what, value) {
  if (!value) {
    throw new Error(
      `[api] ${what} 가 설정되지 않았습니다. .env 를 확인하세요 (.env.example 참고)`,
    )
  }
}
