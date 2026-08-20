import { API_BASE, assertConfigured } from './config'
import { ENDPOINTS, isLive } from './live'
import { getToken } from './session'

/**
 * 서버 응답이 실패했을 때 던지는 오류.
 * `code` 는 api/errors.js 의 ERROR 상수와 같은 문자열이다.
 */
export class ApiError extends Error {
  constructor(message, { status, code, apiId } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.apiId = apiId
  }
}

/**
 * 응답 봉투 — 2026-08-19 실서버 실측 (FE-HANDOFF-0819.md 2장).
 *
 *   성공  { "ok": true,  "data": { ... }, "error": null }
 *   실패  { "ok": false, "data": null,    "error": { "code": "...", "message": "..." } }
 *
 * 세 키가 항상 다 온다. 목도 **같은 봉투로** 만들어서 실연동으로 바꿀 때
 * 파싱 경로가 달라지지 않게 한다.
 */
export const ok = (data) => ({ ok: true, data, error: null })
export const fail = (code, message) => ({
  ok: false,
  data: null,
  error: { code, message },
})

/** 봉투를 벗긴다. 봉투가 아닌 응답(혹시 모를 예외)은 그대로 돌려준다. */
const unwrap = (body) =>
  body && typeof body === 'object' && 'ok' in body ? body.data : body

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * API 한 건을 부른다.
 *
 *   apiId  API 명세서의 API ID. live.js 에서 실연동 여부를 본다.
 *   path   경로 변수({itemId} 등)를 채운 실제 경로. 없으면 live.js 의 path 를 쓴다.
 *   mock   실연동 전에 돌려줄 **봉투 전체**. ok()/fail() 로 만든다.
 *
 * 실연동이 꺼져 있어도 봉투를 벗기고 실패면 ApiError 를 던지는 흐름이 똑같다.
 * 그래서 목에서 fail(...) 을 돌려주면 화면의 에러 처리도 그대로 확인할 수 있다.
 */
export async function call(apiId, { path, query, body, mock, signal } = {}) {
  const ep = ENDPOINTS[apiId]
  if (!ep) throw new Error(`[api] 모르는 API ID: ${apiId}`)

  if (!isLive(apiId)) {
    // 실제 호출과 비슷한 체감을 주려고 약간 늦춘다. 로딩 상태가 안 보이면 버그를 놓친다.
    await delay(250)
    const envelope = typeof mock === 'function' ? mock() : mock
    if (envelope && envelope.ok === false) {
      throw new ApiError(envelope.error?.message ?? '요청에 실패했어요', {
        status: 400,
        code: envelope.error?.code,
        apiId,
      })
    }
    return unwrap(envelope)
  }

  assertConfigured('VITE_API_BASE', API_BASE)

  const qs = query ? `?${new URLSearchParams(query)}` : ''
  const token = getToken()

  const res = await fetch(`${API_BASE}${path ?? ep.path}${qs}`, {
    method: ep.method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : null),
      ...(token ? { Authorization: `Bearer ${token}` } : null),
    },
    /* credentials 를 넣지 않는다 — 서버가 allowCredentials 를 켜지 않아서
       include 로 보내면 브라우저가 응답을 통째로 버린다 (핸드오프 3장 ①). */
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  // 204(예정 삭제 등)처럼 본문이 없는 응답이 있으므로 먼저 텍스트로 받는다
  const text = await res.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      // JSON이 아니면(프록시 오류 페이지 등) 본문을 그대로 메시지에 싣는다
      throw new ApiError(text.slice(0, 200), { status: res.status, apiId })
    }
  }

  if (!res.ok || payload?.ok === false) {
    const e = payload?.error ?? {}
    throw new ApiError(e.message ?? `요청에 실패했어요 (${res.status})`, {
      status: res.status,
      code: e.code,
      apiId,
    })
  }

  return unwrap(payload)
}

/**
 * 경로가 틀린 것인지 구분한다.
 *
 * 2026-08-20 서버가 고쳐져 없는 경로는 404 NOT_FOUND 로 온다(전에는 500 이었다).
 *   NOT_FOUND            경로가 틀렸다
 *   EVALUATION_NOT_FOUND 경로는 맞고 판정이 아직 없다
 * 둘을 구분할 수 있어서 500 이 뜨면 이제는 진짜 서버 문제로 보고 알리면 된다.
 */
export const looksLikeWrongUrl = (err) =>
  err instanceof ApiError && err.code === 'NOT_FOUND'
