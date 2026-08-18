import { API_BASE, assertConfigured } from './config'

/**
 * 서버 응답이 실패했을 때 던지는 오류.
 * 명세서의 실패 코드(CANNOT_REVERT_EXCLUDED 등)를 code 로 담아 화면에서 분기할 수 있게 한다.
 */
export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/**
 * 공용 fetch 래퍼.
 *
 * credentials: 'include' — 백엔드가 세션 쿠키를 쓰는 경우를 기본으로 둔다.
 * 토큰 방식으로 정해지면 여기 한 곳에 Authorization 헤더를 추가하면 된다.
 */
export async function request(path, { method = 'GET', body, signal } = {}) {
  assertConfigured('VITE_API_BASE', API_BASE)

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  // 204 처럼 본문이 없는 응답도 있으므로 먼저 텍스트로 받는다
  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    throw new ApiError(data?.message ?? `요청에 실패했어요 (${res.status})`, {
      status: res.status,
      code: data?.code,
    })
  }

  return data
}
