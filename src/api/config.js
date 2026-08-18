/**
 * API 설정.
 *
 * 값은 .env 로 넣는다 (.env.example 참고).
 * 백엔드가 준비되기 전에는 VITE_API_LIVE 를 켜지 않으면 목 데이터로 돌아간다.
 */

/** 서버를 실제로 호출할지 여부. 꺼져 있으면 목 응답을 쓴다. */
export const LIVE = import.meta.env.VITE_API_LIVE === 'true'

/** 백엔드 주소. 끝의 / 는 떼서 저장한다. */
export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '')

/**
 * 구글 로그인 시작 주소.
 *
 * 프론트에서 구글로 직접 가지 않고 백엔드의 시작 엔드포인트로 보낸다.
 * client_secret 이 백엔드에만 있어야 하고, 토큰 교환도 백엔드가 하기 때문.
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
