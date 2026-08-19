/**
 * 세션 토큰 보관.
 *
 * 인증 방식은 8/14에 JWT로 확정됐다(요구사항 No.15). 서버는 stateless 이고
 * 모든 요청에 `Authorization: Bearer {token}` 을 붙인다.
 *
 * 게스트도 기능 제한이 없어서 앱에 처음 들어오면 게스트 토큰부터 받아 쓰고,
 * 나중에 회원 가입할 때 그 토큰을 guestToken 으로 같이 보내 데이터를 옮긴다
 * (NOW-AUTH-002).
 *
 * ⚠️ localStorage 를 쓴다. XSS 가 나면 토큰이 노출되는 방식이라,
 *    서버가 httpOnly 쿠키로 바꾸자고 하면 이 파일만 바꾸면 된다.
 */
const KEY = 'now.session'

/** { token, userType, expiresAt } 또는 없으면 null */
export function getSession() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    // 저장값이 깨졌으면 없는 것으로 본다. 여기서 앱이 멈추면 안 된다.
    return null
  }
}

export function setSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

export const getToken = () => getSession()?.token ?? null

export const isGuest = () => getSession()?.userType === 'guest'

/** 게스트 세션은 만료 시각이 내려온다 (NOW-AUTH-001의 expiresAt) */
export function isExpired() {
  const at = getSession()?.expiresAt
  return at ? new Date(at).getTime() <= Date.now() : false
}
