import { LIVE, GOOGLE_LOGIN_URL, assertConfigured } from './config'
import { request } from './client'

/**
 * 인증 API (A01 · B01~B03).
 *
 * LIVE 가 꺼져 있으면 서버를 부르지 않고 성공한 척한다.
 * 백엔드가 붙기 전에도 화면 흐름을 그대로 확인할 수 있게 하기 위한 것.
 *
 * ⚠️ 비밀번호·인증코드는 여기서 저장하지 않는다. 서버로 보내고 끝.
 *    세션은 백엔드가 쿠키로 관리하는 것을 기본으로 본다.
 */

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

/**
 * 구글 로그인 시작.
 *
 * 프론트에서 구글로 직접 가지 않는다. 백엔드의 시작 엔드포인트로 브라우저를 넘기면
 * 백엔드가 구글로 리다이렉트하고, 사용자가 동의한 뒤 다시 백엔드로 돌아와
 * 토큰 교환까지 마친 다음 앱으로 보내준다.
 *
 * 그래서 「계정 선택」·「로그인하도록 허용」 화면은 구글이 그린다. 우리가 만들 화면이 아니다.
 * 그 화면 상단의 앱 로고는 Google Cloud Console 의 OAuth 동의 화면에 등록한다.
 */
export function startGoogleLogin() {
  if (!LIVE) {
    // 백엔드 전에는 이메일 입력 화면으로 흐름만 이어 둔다
    return { mocked: true }
  }
  assertConfigured('VITE_GOOGLE_LOGIN_URL', GOOGLE_LOGIN_URL)
  window.location.href = GOOGLE_LOGIN_URL
  return { mocked: false }
}

/** B01 — 이메일이 가입된 계정인지 확인하고 다음 단계를 알려준다 */
export async function checkEmail(email) {
  if (!LIVE) {
    await delay()
    return { exists: false, next: 'password' }
  }
  return request('/auth/email', { method: 'POST', body: { email } })
}

/** B02 — 비밀번호 설정(가입) 또는 로그인 */
export async function submitPassword({ email, password }) {
  if (!LIVE) {
    await delay()
    return { next: 'verify' }
  }
  return request('/auth/password', { method: 'POST', body: { email, password } })
}

/** B03 — 이메일로 받은 인증코드 확인 */
export async function verifyCode({ email, code }) {
  if (!LIVE) {
    await delay()
    return { verified: true }
  }
  return request('/auth/verify', { method: 'POST', body: { email, code } })
}

/** B03 — 인증코드 재발송 */
export async function resendCode(email) {
  if (!LIVE) {
    await delay()
    return { sent: true }
  }
  return request('/auth/verify/resend', { method: 'POST', body: { email } })
}

/** 로그인 상태 확인. 앱 진입 시 세션이 살아 있는지 볼 때 쓴다. */
export async function getMe() {
  if (!LIVE) {
    await delay(200)
    return { nickname: '예니', guest: true }
  }
  return request('/auth/me')
}
